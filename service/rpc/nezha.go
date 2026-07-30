package rpc

import (
	"context"
	"fmt"
	"log"
	"net"
	"strings"
	"sync"
	"time"

	"github.com/railzen/nezha-zero/pkg/ddns"
	"github.com/railzen/nezha-zero/pkg/geoip"
	"github.com/railzen/nezha-zero/pkg/grpcx"
	"github.com/railzen/nezha-zero/pkg/utils"
	"golang.org/x/time/rate"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/jinzhu/copier"
	"github.com/nicksnyder/go-i18n/v2/i18n"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/audit"
	pb "github.com/railzen/nezha-zero/proto"
	"github.com/railzen/nezha-zero/service/singleton"
)

var NezhaHandlerSingleton *NezhaHandler

// 全局内存缓存 device_id -> secret
var DeviceIDToSecret = make(map[string]string)
var DeviceIDLastSeen = make(map[string]time.Time)
var DeviceIDLock sync.Mutex

const (
	discoverCreateBurst       = 10
	discoverCreateInterval    = 100 * time.Millisecond
	discoverDeviceSecretLimit = 10000
)

var discoverCreateLimiter = rate.NewLimiter(rate.Every(discoverCreateInterval), discoverCreateBurst)

type NezhaHandler struct {
	pb.UnimplementedNezhaServiceServer
	Auth          *authHandler
	ioStreams     map[string]*ioStreamContext
	ioStreamMutex *sync.RWMutex
}

func NewNezhaHandler() *NezhaHandler {
	h := &NezhaHandler{
		Auth:          &authHandler{},
		ioStreamMutex: new(sync.RWMutex),
		ioStreams:     make(map[string]*ioStreamContext),
	}
	go h.cleanupStaleStreams()
	return h
}

func getDiscoverDeviceSecret(deviceID string) (string, bool) {
	DeviceIDLock.Lock()
	defer DeviceIDLock.Unlock()

	secret, exists := DeviceIDToSecret[deviceID]
	if exists {
		DeviceIDLastSeen[deviceID] = time.Now()
	}
	return secret, exists
}

func setDiscoverDeviceSecret(deviceID, secret string) {
	DeviceIDLock.Lock()
	defer DeviceIDLock.Unlock()

	if _, exists := DeviceIDToSecret[deviceID]; !exists && len(DeviceIDToSecret) >= discoverDeviceSecretLimit {
		evictOldestDiscoverDeviceSecretLocked()
	}

	DeviceIDToSecret[deviceID] = secret
	DeviceIDLastSeen[deviceID] = time.Now()
}

func evictOldestDiscoverDeviceSecretLocked() {
	var oldestDeviceID string
	var oldestSeen time.Time
	for deviceID, lastSeen := range DeviceIDLastSeen {
		if oldestDeviceID == "" || lastSeen.Before(oldestSeen) {
			oldestDeviceID = deviceID
			oldestSeen = lastSeen
		}
	}

	if oldestDeviceID == "" {
		for deviceID := range DeviceIDToSecret {
			oldestDeviceID = deviceID
			break
		}
	}
	delete(DeviceIDToSecret, oldestDeviceID)
	delete(DeviceIDLastSeen, oldestDeviceID)
}

func (s *NezhaHandler) ReportTask(c context.Context, r *pb.TaskResult) (*pb.Receipt, error) {
	var err error
	var clientID uint64
	if clientID, err = s.Auth.Check(c); err != nil {
		return nil, err
	}
	if !singleton.ConsumeTaskResultAuthorization(clientID, r.GetType(), r.GetId()) {
		return nil, status.Error(codes.PermissionDenied, "task result was not requested")
	}
	if r.GetType() == model.TaskTypeCommand {
		// 处理上报的计划任务
		singleton.CronLock.RLock()
		cr := singleton.Crons[r.GetId()]
		var crp model.Cron
		if cr != nil {
			crp = *cr // 值拷贝，锁外使用不被并发写覆盖
		}
		singleton.CronLock.RUnlock()

		if crp.ID == 0 {
			// 未见对应计划任务，保持与原逻辑一致的早退
			return &pb.Receipt{Proced: true}, nil
		}

		// 取服务器快照（与 CronLock 顺序使用，不再嵌套持有，杜绝锁环路）
		var curServer model.Server
		var serverName string
		singleton.ServerLock.RLock()
		if srv := singleton.ServerList[clientID]; srv != nil {
			copier.Copy(&curServer, srv)
			curServer.CopyFromRunningServer(srv)
			serverName = srv.Name
		}
		singleton.ServerLock.RUnlock()

		// ===== 以下全部无锁：HTTP 通知、审计、DB 更新均不依赖上述锁 =====
		command := crp.Command
		if len(command) > 200 {
			command = command[:200] + "..."
		}
		resultStatus := "success"
		if !r.GetSuccessful() {
			resultStatus = "failed"
		}
		audit.Record(nil, audit.TypeEvent, "Scheduled task executed",
			fmt.Sprintf("task: %s, command: %s, server: %s (ID %d), result: %s",
				crp.Name, command, serverName, clientID, resultStatus))

		if crp.PushSuccessful && r.GetSuccessful() {
			singleton.SendNotification(crp.NotificationTag, fmt.Sprintf("[%s] %s, %s\n%s", singleton.Localizer.MustLocalize(
				&i18n.LocalizeConfig{
					MessageID: "ScheduledTaskExecutedSuccessfully",
				},
			), crp.Name, serverName, r.GetData()), nil, &curServer)
		}
		if !r.GetSuccessful() {
			singleton.SendNotification(crp.NotificationTag, fmt.Sprintf("[%s] %s, %s\n%s", singleton.Localizer.MustLocalize(
				&i18n.LocalizeConfig{
					MessageID: "ScheduledTaskExecutedFailed",
				},
			), crp.Name, serverName, r.GetData()), nil, &curServer)
		}
		singleton.DB.Model(&crp).Updates(model.Cron{
			LastExecutedAt: time.Now().Add(time.Second * -1 * time.Duration(r.GetDelay())),
			LastResult:     r.GetSuccessful(),
		})
	} else if model.IsServiceSentinelNeeded(r.GetType()) {
		singleton.ServiceSentinelShared.Dispatch(singleton.ReportData{
			Data:     r,
			Reporter: clientID,
		})
	}
	return &pb.Receipt{Proced: true}, nil
}

func addDiscoverServer() (string, error) {
	var s model.Server

	// 生成名称
	name, err := utils.GenerateRandomString(6)
	if err != nil {
		return "", err
	}

	// 生成 secret
	secret, err := utils.GenerateRandomString(18)
	if err != nil {
		return "", err
	}

	// 初始化 Server 字段
	s.Name = "AUTO - " + name
	s.Name = strings.ToUpper(s.Name)
	s.Secret = secret
	s.HideForGuest = false
	s.EnableDDNS = false
	s.Host = &model.Host{}
	s.State = &model.HostState{}
	s.TaskCloseLock = new(sync.Mutex)
	s.TaskSendLock = new(sync.Mutex)
	s.TaskDispatchLock = new(sync.Mutex)
	s.RuntimeLock = new(sync.RWMutex)

	// 写入数据库（只一次）
	if err := singleton.DB.Create(&s).Error; err != nil {
		return "", err
	}

	// 内存结构注册
	singleton.ServerLock.Lock()
	singleton.SecretToID[s.Secret] = s.ID
	singleton.ServerList[s.ID] = &s
	singleton.ServerTagToIDList[s.Tag] = append(singleton.ServerTagToIDList[s.Tag], s.ID)
	singleton.ServerLock.Unlock()

	singleton.ReSortServer()

	audit.Record(nil, audit.TypeConfig, "Server auto-discovered",
		fmt.Sprintf("server: %s (ID %d)", s.Name, s.ID))

	// 成功时返回 secret
	return s.Secret, nil
}

func (s *NezhaHandler) DiscoverServer(ctx context.Context, req *pb.DiscoverServerRequest,
) (*pb.DiscoverServerResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "Discover request required")
	}
	req.DiscoverKey = strings.TrimSpace(req.DiscoverKey)
	req.DeviceId = strings.TrimSpace(req.DeviceId)
	discoverKey := strings.TrimSpace(singleton.Conf.GRPCDiscoverKey)

	if discoverKey == "" {
		return nil, status.Error(codes.FailedPrecondition, "Discover is disabled")
	}

	if req.DiscoverKey == "" {
		return nil, status.Error(codes.InvalidArgument, "DiscoverKey required")
	}
	if req.DiscoverKey != discoverKey {
		return nil, status.Error(codes.PermissionDenied, "Invalid Key")
	}

	if req.DeviceId == "" {
		return nil, status.Error(codes.InvalidArgument, "DeviceId required")
	}

	// 内存幂等检查
	secret, exists := getDiscoverDeviceSecret(req.DeviceId)

	if exists {
		// 已经添加过设备，直接返回 secret
		return &pb.DiscoverServerResponse{
			NewServerSecret: secret,
		}, nil
	}

	// 新设备
	if err := discoverCreateLimiter.Wait(ctx); err != nil {
		return nil, status.Error(codes.ResourceExhausted, "Discover create rate limit exceeded")
	}

	secret, err := addDiscoverServer()
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to create server")
	}

	// 保存到全局 map
	setDiscoverDeviceSecret(req.DeviceId, secret)

	return &pb.DiscoverServerResponse{
		NewServerSecret: secret,
	}, nil
}

func (s *NezhaHandler) RequestTask(h *pb.Host, stream pb.NezhaService_RequestTaskServer) error {
	var clientID uint64
	var err error
	if clientID, err = s.Auth.Check(stream.Context()); err != nil {
		return err
	}
	closeCh := make(chan error)
	singleton.ServerLock.RLock()
	server := singleton.ServerList[clientID]
	singleton.ServerLock.RUnlock()
	if server == nil || server.TaskCloseLock == nil {
		return status.Errorf(codes.Unauthenticated, "客户端认证失败")
	}

	server.TaskCloseLock.Lock()
	singleton.ServerLock.Lock()
	if singleton.ServerList[clientID] != server {
		singleton.ServerLock.Unlock()
		server.TaskCloseLock.Unlock()
		return status.Errorf(codes.Unauthenticated, "客户端认证失败")
	}
	// 修复不断的请求 task 但是没有 return 导致内存泄漏
	if server.TaskClose != nil {
		close(server.TaskClose)
	}
	server.TaskStream = stream
	server.TaskClose = closeCh
	singleton.ServerLock.Unlock()
	server.TaskCloseLock.Unlock()
	select {
	case err := <-closeCh:
		return err
	case <-stream.Context().Done():
		server.TaskCloseLock.Lock()
		if server.TaskClose == closeCh {
			server.TaskStream = nil
			server.TaskClose = nil
		}
		server.TaskCloseLock.Unlock()
		return stream.Context().Err()
	}
}

func (s *NezhaHandler) ReportSystemState(c context.Context, r *pb.State) (*pb.Receipt, error) {
	var clientID uint64
	var err error
	if clientID, err = s.Auth.Check(c); err != nil {
		return nil, err
	}
	state := model.PB2State(r)
	singleton.ServerLock.RLock()
	server := singleton.ServerList[clientID]
	singleton.ServerLock.RUnlock()
	if server == nil {
		return nil, status.Errorf(codes.Unauthenticated, "客户端认证失败")
	}
	server.InitRuntimeLock()
	server.RuntimeLock.Lock()
	defer server.RuntimeLock.Unlock()
	server.LastActive = time.Now()
	server.State = &state

	// 应对 dashboard 重启的情况，如果从未记录过，先打点，等到小时时间点时入库
	if server.PrevTransferInSnapshot == 0 || server.PrevTransferOutSnapshot == 0 {
		server.PrevTransferInSnapshot = int64(state.NetInTransfer)
		server.PrevTransferOutSnapshot = int64(state.NetOutTransfer)
	}

	return &pb.Receipt{Proced: true}, nil
}

func (s *NezhaHandler) ReportSystemInfo(c context.Context, r *pb.Host) (*pb.Receipt, error) {
	var clientID uint64
	var err error
	if clientID, err = s.Auth.Check(c); err != nil {
		return nil, err
	}
	host := model.PB2Host(r)
	singleton.ServerLock.RLock()
	server := singleton.ServerList[clientID]
	singleton.ServerLock.RUnlock()
	if server == nil {
		return nil, status.Errorf(codes.Unauthenticated, "客户端认证失败")
	}
	var ddnsProviders []*ddns.Provider
	var ipChangeMessage string
	server.InitRuntimeLock()
	server.RuntimeLock.Lock()

	// 检查并更新DDNS
	if server.EnableDDNS && host.IP != "" &&
		(server.Host == nil || server.Host.IP != host.IP) {
		ipv4, ipv6, _ := utils.SplitIPAddr(host.IP)
		providers, err := singleton.GetDDNSProvidersFromProfiles(server.DDNSProfiles, &ddns.IP{Ipv4Addr: ipv4, Ipv6Addr: ipv6})
		if err == nil {
			ddnsProviders = providers
		} else {
			log.Printf("NEZHA>> 获取DDNS配置时发生错误: %v", err)
		}
	}

	// 发送IP变动通知
	if server.Host != nil && singleton.Conf.EnableIPChangeNotification &&
		((singleton.Conf.Cover == model.ConfigCoverAll && !singleton.Conf.IgnoredIPNotificationServerIDs[clientID]) ||
			(singleton.Conf.Cover == model.ConfigCoverIgnoreAll && singleton.Conf.IgnoredIPNotificationServerIDs[clientID])) &&
		server.Host.IP != "" &&
		host.IP != "" &&
		server.Host.IP != host.IP {

		ipChangeMessage = fmt.Sprintf(
			"[%s] %s, %s => %s",
			singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{
				MessageID: "IPChanged",
			}),
			server.Name, singleton.IPDesensitize(server.Host.IP),
			singleton.IPDesensitize(host.IP),
		)
	}

	/**
	 * 这里的 singleton 中的数据都是关机前的旧数据
	 * 当 agent 重启时，bootTime 变大，agent 端会先上报 host 信息，然后上报 state 信息
	 * 这是可以借助上报顺序的空档，将停机前的流量统计数据标记下来，加到下一个小时的数据点上
	 */
	if server.Host != nil && server.State != nil && server.Host.BootTime < host.BootTime {
		server.PrevTransferInSnapshot = server.PrevTransferInSnapshot - int64(server.State.NetInTransfer)
		server.PrevTransferOutSnapshot = server.PrevTransferOutSnapshot - int64(server.State.NetOutTransfer)
	}

	// 不要冲掉国家码
	if server.Host != nil {
		host.CountryCode = server.Host.CountryCode
	}
	if host.CountryCode == "" && host.IP != "" {
		_, _, geoIP := utils.SplitIPAddr(host.IP)
		if netIP := net.ParseIP(geoIP); netIP != nil {
			if location, err := geoip.Resolve(singleton.Conf.UseExternalGeoIP, netIP); err == nil {
				host.CountryCode = location
			}
		}
	}

	publicCountryCode := singleton.ParseCountryCodeFromJson([]byte(server.PublicNote))
	if publicCountryCode != nil {
		host.CountryCode = *publicCountryCode
	}

	server.Host = &host
	server.RuntimeLock.Unlock()

	for _, provider := range ddnsProviders {
		go func(provider *ddns.Provider) {
			provider.UpdateDomain(context.Background())
		}(provider)
	}
	if ipChangeMessage != "" {
		singleton.SendNotification(singleton.Conf.IPChangeNotificationTag, ipChangeMessage, nil)
	}
	return &pb.Receipt{Proced: true}, nil
}

func (s *NezhaHandler) IOStream(stream pb.NezhaService_IOStreamServer) error {
	if _, err := s.Auth.Check(stream.Context()); err != nil {
		return err
	}
	id, err := stream.Recv()
	if err != nil {
		return err
	}
	if id == nil || len(id.Data) < 4 || id.Data[0] != 0xff || id.Data[1] != 0x05 || id.Data[2] != 0xff || id.Data[3] != 0x05 {
		return fmt.Errorf("invalid stream id")
	}

	streamId := string(id.Data[4:])

	if _, err := s.GetStream(streamId); err != nil {
		return err
	}
	iw := grpcx.NewIOStreamWrapper(stream)
	if err := s.AgentConnected(streamId, iw); err != nil {
		return err
	}
	iw.Wait()
	return nil
}

func (s *NezhaHandler) LookupGeoIP(c context.Context, r *pb.GeoIP) (*pb.GeoIP, error) {
	var clientID uint64
	var err error
	if clientID, err = s.Auth.Check(c); err != nil {
		return nil, err
	}

	ip := r.GetIp()
	netIP := net.ParseIP(ip)
	location, err := geoip.Resolve(singleton.Conf.UseExternalGeoIP, netIP)
	if err != nil {
		return nil, err
	}

	// 将地区码写入到 Host
	singleton.ServerLock.RLock()
	server := singleton.ServerList[clientID]
	singleton.ServerLock.RUnlock()
	if server == nil {
		return nil, status.Errorf(codes.Unauthenticated, "客户端认证失败")
	}
	server.InitRuntimeLock()
	server.RuntimeLock.Lock()
	defer server.RuntimeLock.Unlock()
	if server.Host == nil {
		return nil, fmt.Errorf("host not found")
	}
	server.Host.CountryCode = location

	publicCountryCode := singleton.ParseCountryCodeFromJson([]byte(server.PublicNote))
	if publicCountryCode != nil {
		server.Host.CountryCode = *publicCountryCode
	}

	return &pb.GeoIP{Ip: ip, CountryCode: location}, nil
}
