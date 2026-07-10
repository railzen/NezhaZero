package rpc

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"time"

	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"

	"github.com/railzen/nezha-zero/model"
	pb "github.com/railzen/nezha-zero/proto"
	rpcService "github.com/railzen/nezha-zero/service/rpc"
	"github.com/railzen/nezha-zero/service/singleton"
)

var (
	multiplexHTTPServer *http.Server
	multiplexGRPCServer *grpc.Server
)

// ShutdownMultiplex 优雅停止端口复用模式下的 HTTP/gRPC 服务。
func ShutdownMultiplex(ctx context.Context) error {
	if multiplexHTTPServer == nil {
		return nil
	}
	err := multiplexHTTPServer.Shutdown(ctx)
	if multiplexGRPCServer != nil {
		done := make(chan struct{})
		go func() {
			multiplexGRPCServer.GracefulStop()
			close(done)
		}()
		select {
		case <-done:
		case <-ctx.Done():
			multiplexGRPCServer.Stop()
		}
	}
	multiplexHTTPServer = nil
	multiplexGRPCServer = nil
	return err
}

func ServeRPC(port uint) {
	server := grpc.NewServer(
		grpc.KeepaliveParams(keepalive.ServerParameters{
			Time:    3 * time.Minute,
			Timeout: 30 * time.Second,
		}),
		grpc.KeepaliveEnforcementPolicy(keepalive.EnforcementPolicy{
			MinTime:             10 * time.Second,
			PermitWithoutStream: true,
		}),
	)
	rpcService.NezhaHandlerSingleton = rpcService.NewNezhaHandler()
	pb.RegisterNezhaServiceServer(server, rpcService.NezhaHandlerSingleton)
	listen, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		panic(err)
	}
	server.Serve(listen)
}

func ServeMultiplex(port uint, httpHandler http.Handler) error {
	// 创建gRPC服务器
	grpcServer := grpc.NewServer(
		grpc.KeepaliveParams(keepalive.ServerParameters{
			Time:    3 * time.Minute,
			Timeout: 30 * time.Second,
		}),
		grpc.KeepaliveEnforcementPolicy(keepalive.EnforcementPolicy{
			MinTime:             10 * time.Second,
			PermitWithoutStream: true,
		}),
	)
	rpcService.NezhaHandlerSingleton = rpcService.NewNezhaHandler()
	pb.RegisterNezhaServiceServer(grpcServer, rpcService.NezhaHandlerSingleton)
	multiplexGRPCServer = grpcServer

	// 创建多路复用处理器
	multiplexHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 检查是否为gRPC请求
		if r.ProtoMajor == 2 &&
			r.Header.Get("Content-Type") == "application/grpc" {
			grpcServer.ServeHTTP(w, r)
			return
		}

		// 检查HTTP/2升级请求
		if r.Header.Get("Upgrade") == "h2c" {
			// 这个连接需要升级到HTTP/2，但h2c会自动处理
			grpcServer.ServeHTTP(w, r)
			return
		}

		httpHandler.ServeHTTP(w, r)
	})

	// 创建HTTP服务器
	httpServer := &http.Server{
		Handler:           h2c.NewHandler(multiplexHandler, &http2.Server{}),
		Addr:              fmt.Sprintf(":%d", port),
		ReadHeaderTimeout: 10 * time.Second,
	}
	multiplexHTTPServer = httpServer

	listen, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return fmt.Errorf("failed to listen on port %d: %w", port, err)
	}

	log.Printf("HTTP + gRPC multiplex server listening on :%d", port)
	return httpServer.Serve(listen)
}

func DispatchTask(serviceSentinelDispatchBus <-chan model.Monitor) {
	workedServerIndex := 0
	for task := range serviceSentinelDispatchBus {
		round := 0
		endIndex := workedServerIndex
		var servers []*model.Server
		singleton.SortedServerLock.RLock()
		// 如果已经轮了一整圈又轮到自己，没有合适机器去请求，跳出循环
		for round < 1 || workedServerIndex < endIndex {
			// 如果到了圈尾，再回到圈头，圈数加一，游标重置
			if workedServerIndex >= len(singleton.SortedServerList) {
				workedServerIndex = 0
				round++
				continue
			}
			// 如果服务器不在线，跳过这个服务器
			if singleton.SortedServerList[workedServerIndex].TaskStream == nil {
				workedServerIndex++
				continue
			}
			// 如果此任务不可使用此服务器请求，跳过这个服务器（有些 IPv6 only 开了 NAT64 的机器请求 IPv4 总会出问题）
			if (task.Cover == model.MonitorCoverAll && task.SkipServers[singleton.SortedServerList[workedServerIndex].ID]) ||
				(task.Cover == model.MonitorCoverIgnoreAll && !task.SkipServers[singleton.SortedServerList[workedServerIndex].ID]) {
				workedServerIndex++
				continue
			}
			if task.Cover == model.MonitorCoverIgnoreAll && task.SkipServers[singleton.SortedServerList[workedServerIndex].ID] {
				servers = append(servers, singleton.SortedServerList[workedServerIndex])
				workedServerIndex++
				continue
			}
			if task.Cover == model.MonitorCoverAll && !task.SkipServers[singleton.SortedServerList[workedServerIndex].ID] {
				servers = append(servers, singleton.SortedServerList[workedServerIndex])
				workedServerIndex++
				continue
			}
			// 找到合适机器执行任务，跳出循环
			// singleton.SortedServerList[workedServerIndex].TaskStream.Send(task.PB())
			// workedServerIndex++
			// break
		}
		singleton.SortedServerLock.RUnlock()
		for _, server := range servers {
			dispatchLock := server.TaskDispatchLock
			if dispatchLock == nil || !dispatchLock.TryLock() {
				continue
			}
			monitorTask := task.PB()
			go func(server *model.Server) {
				defer dispatchLock.Unlock()
				_ = server.SendTask(monitorTask)
			}(server)
		}
	}
}

func DispatchKeepalive() {
	singleton.Cron.AddFunc("@every 30s", func() {
		var servers []*model.Server
		singleton.SortedServerLock.RLock()
		for i := 0; i < len(singleton.SortedServerList); i++ {
			if singleton.SortedServerList[i] == nil || singleton.SortedServerList[i].TaskStream == nil {
				continue
			}

			servers = append(servers, singleton.SortedServerList[i])
		}
		singleton.SortedServerLock.RUnlock()
		for _, server := range servers {
			dispatchLock := server.TaskDispatchLock
			if dispatchLock == nil || !dispatchLock.TryLock() {
				continue
			}
			go func(server *model.Server) {
				defer dispatchLock.Unlock()
				_ = server.SendTask(&pb.Task{Type: model.TaskTypeKeepalive})
			}(server)
		}
	})
}
