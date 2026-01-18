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
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/jinzhu/copier"
	"github.com/nicksnyder/go-i18n/v2/i18n"

	"github.com/railzen/nezha-zero/model"
	pb "github.com/railzen/nezha-zero/proto"
	"github.com/railzen/nezha-zero/service/singleton"
)

var NezhaHandlerSingleton *NezhaHandler

// 全局内存缓存 device_id -> secret
var DeviceIDToSecret = make(map[string]string)
var DeviceIDLock sync.Mutex

type NezhaHandler struct {
	pb.UnimplementedNezhaServiceServer
	Auth          *authHandler
	ioStreams     map[string]*ioStreamContext
	ioStreamMutex *sync.RWMutex
}

func NewNezhaHandler() *NezhaHandler {
	return &NezhaHandler{
		Auth:          &authHandler{},
		ioStreamMutex: new(sync.RWMutex),
		ioStreams:     make(map[string]*ioStreamContext),
	}
}

func (s *NezhaHandler) ReportTask(c context.Context, r *pb.TaskResult) (*pb.Receipt, error) {
	var err error
	var clientID uint64
	if clientID, err = s.Auth.Check(c); err != nil {
		return nil, err
	}
	if r.GetType() == model.TaskTypeCommand {
		// 处理上报的计划任务
		singleton.CronLock.RLock()
		defer singleton.CronLock.RUnlock()
		cr := singleton.Crons[r.GetId()]
		if cr != nil {
			singleton.ServerLock.RLock()
			defer singleton.ServerLock.RUnlock()
			// 保存当前服务器状态信息
			curServer := model.Server{}
			copier.Copy(&curServer, singleton.ServerList[clientID])
			if cr.PushSuccessful && r.GetSuccessful() {
				singleton.SendNotification(cr.NotificationTag, fmt.Sprintf("[%s] %s, %s\n%s", singleton.Localizer.MustLocalize(
					&i18n.LocalizeConfig{
						MessageID: "ScheduledTaskExecutedSuccessfully",
					},
				), cr.Name, singleton.ServerList[clientID].Name, r.GetData()), nil, &curServer)
			}
			if !r.GetSuccessful() {
				singleton.SendNotification(cr.NotificationTag, fmt.Sprintf("[%s] %s, %s\n%s", singleton.Localizer.MustLocalize(
					&i18n.LocalizeConfig{
						MessageID: "ScheduledTaskExecutedFailed",
					},
				), cr.Name, singleton.ServerList[clientID].Name, r.GetData()), nil, &curServer)
			}
			singleton.DB.Model(cr).Updates(model.Cron{
				LastExecutedAt: time.Now().Add(time.Second * -1 * time.Duration(r.GetDelay())),
				LastResult:     r.GetSuccessful(),
			})
		}
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

	// 成功时返回 secret
	return s.Secret, nil
}

/*
func (s *NezhaHandler) DiscoverServer(ctx context.Context, req *pb.DiscoverServerRequest,
) (*pb.DiscoverServerResponse, error) {

	if req.DiscoverKey != "123456789abcdef" {
		return nil, status.Error(codes.PermissionDenied, "Invalid Key")
	}

	secret, err := addDiscoverServer()
	if err != nil {
		return nil, status.Error(codes.PermissionDenied, "Invalid Key")
	}

	return &pb.DiscoverServerResponse{
		NewServerSecret: secret,
	}, nil
}
*/

func (s *NezhaHandler) DiscoverServer(ctx context.Context, req *pb.DiscoverServerRequest,
) (*pb.DiscoverServerResponse, error) {

	if req.DiscoverKey != singleton.Conf.GRPCDiscoverKey {
		return nil, status.Error(codes.PermissionDenied, "Invalid Key")
	}

	if req.DeviceId == "" {
		return nil, status.Error(codes.InvalidArgument, "DeviceId required")
	}

	// ====== 内存幂等检查 ======
	DeviceIDLock.Lock()
	secret, exists := DeviceIDToSecret[req.DeviceId]
	DeviceIDLock.Unlock()

	if exists {
		// 已经添加过设备，直接返回 secret
		return &pb.DiscoverServerResponse{
			NewServerSecret: secret,
		}, nil
	}

	// ====== 新设备 ======
	secret, err := addDiscoverServer()
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to create server")
	}

	// 保存到全局 map
	DeviceIDLock.Lock()
	DeviceIDToSecret[req.DeviceId] = secret
	DeviceIDLock.Unlock()

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
	singleton.ServerList[clientID].TaskCloseLock.Lock()
	// 修复不断的请求 task 但是没有 return 导致内存泄漏
	if singleton.ServerList[clientID].TaskClose != nil {
		close(singleton.ServerList[clientID].TaskClose)
	}
	singleton.ServerList[clientID].TaskStream = stream
	singleton.ServerList[clientID].TaskClose = closeCh
	singleton.ServerList[clientID].TaskCloseLock.Unlock()
	singleton.ServerLock.RUnlock()
	return <-closeCh
}

func (s *NezhaHandler) ReportSystemState(c context.Context, r *pb.State) (*pb.Receipt, error) {
	var clientID uint64
	var err error
	if clientID, err = s.Auth.Check(c); err != nil {
		return nil, err
	}
	state := model.PB2State(r)
	singleton.ServerLock.RLock()
	defer singleton.ServerLock.RUnlock()
	singleton.ServerList[clientID].LastActive = time.Now()
	singleton.ServerList[clientID].State = &state

	// 应对 dashboard 重启的情况，如果从未记录过，先打点，等到小时时间点时入库
	if singleton.ServerList[clientID].PrevTransferInSnapshot == 0 || singleton.ServerList[clientID].PrevTransferOutSnapshot == 0 {
		singleton.ServerList[clientID].PrevTransferInSnapshot = int64(state.NetInTransfer)
		singleton.ServerList[clientID].PrevTransferOutSnapshot = int64(state.NetOutTransfer)
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
	defer singleton.ServerLock.RUnlock()

	// 检查并更新DDNS
	if singleton.ServerList[clientID].EnableDDNS && host.IP != "" &&
		(singleton.ServerList[clientID].Host == nil || singleton.ServerList[clientID].Host.IP != host.IP) {
		ipv4, ipv6, _ := utils.SplitIPAddr(host.IP)
		providers, err := singleton.GetDDNSProvidersFromProfiles(singleton.ServerList[clientID].DDNSProfiles, &ddns.IP{Ipv4Addr: ipv4, Ipv6Addr: ipv6})
		if err == nil {
			for _, provider := range providers {
				go func(provider *ddns.Provider) {
					provider.UpdateDomain(context.Background())
				}(provider)
			}
		} else {
			log.Printf("NEZHA>> 获取DDNS配置时发生错误: %v", err)
		}
	}

	// 发送IP变动通知
	if singleton.ServerList[clientID].Host != nil && singleton.Conf.EnableIPChangeNotification &&
		((singleton.Conf.Cover == model.ConfigCoverAll && !singleton.Conf.IgnoredIPNotificationServerIDs[clientID]) ||
			(singleton.Conf.Cover == model.ConfigCoverIgnoreAll && singleton.Conf.IgnoredIPNotificationServerIDs[clientID])) &&
		singleton.ServerList[clientID].Host.IP != "" &&
		host.IP != "" &&
		singleton.ServerList[clientID].Host.IP != host.IP {

		singleton.SendNotification(singleton.Conf.IPChangeNotificationTag,
			fmt.Sprintf(
				"[%s] %s, %s => %s",
				singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{
					MessageID: "IPChanged",
				}),
				singleton.ServerList[clientID].Name, singleton.IPDesensitize(singleton.ServerList[clientID].Host.IP),
				singleton.IPDesensitize(host.IP),
			),
			nil)
	}

	/**
	 * 这里的 singleton 中的数据都是关机前的旧数据
	 * 当 agent 重启时，bootTime 变大，agent 端会先上报 host 信息，然后上报 state 信息
	 * 这是可以借助上报顺序的空档，将停机前的流量统计数据标记下来，加到下一个小时的数据点上
	 */
	if singleton.ServerList[clientID].Host != nil && singleton.ServerList[clientID].Host.BootTime < host.BootTime {
		singleton.ServerList[clientID].PrevTransferInSnapshot = singleton.ServerList[clientID].PrevTransferInSnapshot - int64(singleton.ServerList[clientID].State.NetInTransfer)
		singleton.ServerList[clientID].PrevTransferOutSnapshot = singleton.ServerList[clientID].PrevTransferOutSnapshot - int64(singleton.ServerList[clientID].State.NetOutTransfer)
	}

	// 不要冲掉国家码
	if singleton.ServerList[clientID].Host != nil {
		host.CountryCode = singleton.ServerList[clientID].Host.CountryCode
	}

	publicCountryCode := singleton.ParseCountryCodeFromJson([]byte(singleton.ServerList[clientID].PublicNote))
	if publicCountryCode != nil {
		host.CountryCode = *publicCountryCode
	}

	singleton.ServerList[clientID].Host = &host
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
	if id == nil || len(id.Data) < 4 || (id.Data[0] != 0xff && id.Data[1] != 0x05 && id.Data[2] != 0xff && id.Data[3] == 0x05) {
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

	// 根据内置数据库查询 IP 地理位置
	record := &geoip.IPInfo{}
	ip := r.GetIp()
	netIP := net.ParseIP(ip)
	location, err := geoip.Lookup(netIP, record)
	if err != nil {
		return nil, err
	}

	// 将地区码写入到 Host
	singleton.ServerLock.RLock()
	defer singleton.ServerLock.RUnlock()
	if singleton.ServerList[clientID].Host == nil {
		return nil, fmt.Errorf("host not found")
	}
	singleton.ServerList[clientID].Host.CountryCode = location

	publicCountryCode := singleton.ParseCountryCodeFromJson([]byte(singleton.ServerList[clientID].PublicNote))
	if publicCountryCode != nil {
		singleton.ServerList[clientID].Host.CountryCode = *publicCountryCode
	}

	return &pb.GeoIP{Ip: ip, CountryCode: location}, nil
}
