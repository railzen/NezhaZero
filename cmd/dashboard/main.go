package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"
	_ "time/tzdata"

	"github.com/ory/graceful"
	"github.com/railzen/nezha-zero/cmd/dashboard/controller"
	"github.com/railzen/nezha-zero/cmd/dashboard/rpc"
	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/audit"
	"github.com/railzen/nezha-zero/pkg/geoip"
	"github.com/railzen/nezha-zero/proto"
	"github.com/railzen/nezha-zero/service/singleton"
	flag "github.com/spf13/pflag"
)

type DashboardCliParam struct {
	Version          bool   // 当前版本号
	ConfigFile       string // 配置文件路径
	DatebaseLocation string // Sqlite3 数据库文件路径
}

var (
	dashboardCliParam DashboardCliParam
)

func init() {
	flag.CommandLine.ParseErrorsWhitelist.UnknownFlags = true
	flag.BoolVarP(&dashboardCliParam.Version, "version", "v", false, "查看当前版本号")
	flag.StringVarP(&dashboardCliParam.ConfigFile, "config", "c", "data/config.yaml", "配置文件路径")
	flag.StringVar(&dashboardCliParam.DatebaseLocation, "db", "data/sqlite.db", "Sqlite3数据库文件路径")
	flag.Parse()
}

func initSystem() {
	// 启动 singleton 包下的所有服务
	singleton.LoadSingleton()

	// 每天的3:30 对 监控记录 和 流量记录 进行清理
	if _, err := singleton.Cron.AddFunc("0 30 3 * * *", singleton.CleanMonitorHistory); err != nil {
		panic(err)
	}

	// 每小时对流量记录进行打点
	if _, err := singleton.Cron.AddFunc("0 0 * * * *", singleton.RecordTransferHourlyUsage); err != nil {
		panic(err)
	}
}

func main() {
	controller.WaitForPortableBackupRestart()
	if dashboardCliParam.Version {
		fmt.Println(singleton.Version)
		os.Exit(0)
	}

	// 初始化 dao 包
	singleton.InitConfigFromPath(dashboardCliParam.ConfigFile)
	singleton.InitTimezoneAndCache()
	singleton.InitDBFromPath(dashboardCliParam.DatebaseLocation)
	geoip.InitExternal(filepath.Dir(dashboardCliParam.DatebaseLocation))
	if err := geoip.ReloadExternal(singleton.Conf.UseExternalGeoIP); err != nil {
		log.Printf("NEZHA>> GeoIP reload failed: %v", err)
	}
	singleton.InitLocalizer()
	initSystem()
	audit.StartWatchdog()
	audit.Record(nil, audit.TypeEvent, "Dashboard started", fmt.Sprintf(
		"version %s, HTTP port %d, GRPC port %d",
		singleton.Version, singleton.Conf.HTTPPort, singleton.Conf.GRPCPort))

	// 开启 gRPC
	singleton.CleanMonitorHistory()
	serviceSentinelDispatchBus := make(chan model.Monitor) // 用于传递服务监控任务信息的channel
	go rpc.DispatchTask(serviceSentinelDispatchBus)
	go rpc.DispatchKeepalive()
	go singleton.AlertSentinelStart()
	singleton.NewServiceSentinel(serviceSentinelDispatchBus)

	// 开启HTTP服务
	srv := controller.ServeWeb(singleton.Conf.HTTPPort)
	go dispatchReportInfoTask()

	// 端口复用,如果HTTPPort 和 GRPCPort 配置为相同的端口
	if singleton.Conf.HTTPPort == singleton.Conf.GRPCPort {
		log.Printf("NEZHA>> MUX HTTP and gRPC %d", singleton.Conf.GRPCPort)
		if err := graceful.Graceful(func() error {
			return rpc.ServeMultiplex(singleton.Conf.GRPCPort, srv.Handler)
		}, func(c context.Context) error {
			log.Println("NEZHA>> Graceful::START")
			audit.Record(nil, audit.TypeEvent, "Dashboard stopped", "Graceful shutdown")
			if !singleton.PortableImportRestartPending() {
				singleton.RecordTransferHourlyUsage()
			}
			log.Println("NEZHA>> Graceful::END")
			return rpc.ShutdownMultiplex(c)
		}); err != nil {
			log.Printf("NEZHA>> ERROR: %v", err)
		}
	} else {
		// 如果端口不同，则分别启动
		log.Printf("NEZHA>> HTTP=%d, gRPC=%d", singleton.Conf.HTTPPort, singleton.Conf.GRPCPort)
		go rpc.ServeRPC(singleton.Conf.GRPCPort)

		if err := graceful.Graceful(func() error {
			return srv.ListenAndServe()
		}, func(c context.Context) error {
			log.Println("NEZHA>> Graceful::START")
			audit.Record(nil, audit.TypeEvent, "Dashboard stopped", "Graceful shutdown")
			if !singleton.PortableImportRestartPending() {
				singleton.RecordTransferHourlyUsage()
			}
			log.Println("NEZHA>> Graceful::END")
			srv.Shutdown(c)
			return nil
		}); err != nil {
			log.Printf("NEZHA>> ERROR: %v", err)
		}
	}

	if singleton.PortableImportRestartPending() {
		if err := controller.RestartDashboardAfterPortableImport(); err != nil {
			log.Printf("NEZHA>> automatic restart failed: %v", err)
		}
	}
}

func dispatchReportInfoTask() {
	time.Sleep(time.Second * 15)
	var servers []*model.Server
	singleton.ServerLock.RLock()
	for _, server := range singleton.ServerList {
		if server == nil || server.TaskStream == nil {
			continue
		}
		servers = append(servers, server)
	}
	singleton.ServerLock.RUnlock()

	for _, server := range servers {
		_ = server.SendTask(&proto.Task{
			Type: model.TaskTypeReportHostInfo,
			Data: "",
		})
	}
}
