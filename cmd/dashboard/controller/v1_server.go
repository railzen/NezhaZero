package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/naiba/nezha/model"
	"github.com/naiba/nezha/pkg/utils"
	"github.com/naiba/nezha/service/singleton"
)

func (cv *compatV1) listServer(c *gin.Context) {
	singleton.SortedServerLock.RLock()
	defer singleton.SortedServerLock.RUnlock()

	var ssl []*model.V1Server
	for _, s := range singleton.SortedServerList {
		ipv4, ipv6, _ := utils.SplitIPAddr(s.Host.IP)
		ssl = append(ssl, &model.V1Server{
			V1Common: model.V1Common{
				ID:        s.ID,
				CreatedAt: s.CreatedAt,
				UpdatedAt: s.UpdatedAt,
			},
			Name:         s.Name,
			UUID:         idToUuid(s.ID),
			Note:         s.Note,
			PublicNote:   s.PublicNote,
			DisplayIndex: s.DisplayIndex,
			HideForGuest: s.HideForGuest,
			EnableDDNS:   s.EnableDDNS,
			DDNSProfiles: s.DDNSProfiles,
			Host: &model.V1Host{
				Platform:        s.Host.Platform,
				PlatformVersion: s.Host.PlatformVersion,
				CPU:             s.Host.CPU,
				MemTotal:        s.Host.MemTotal,
				DiskTotal:       s.Host.DiskTotal,
				SwapTotal:       s.Host.SwapTotal,
				Arch:            s.Host.Arch,
				Virtualization:  s.Host.Virtualization,
				BootTime:        s.Host.BootTime,
				Version:         s.Host.Version,
				GPU:             s.Host.GPU,
			},
			State: &model.V1HostState{
				CPU:            s.State.CPU,
				MemUsed:        s.State.MemUsed,
				SwapUsed:       s.State.SwapUsed,
				DiskUsed:       s.State.DiskUsed,
				NetInTransfer:  s.State.NetInTransfer,
				NetOutTransfer: s.State.NetOutTransfer,
				NetInSpeed:     s.State.NetInSpeed,
				NetOutSpeed:    s.State.NetOutSpeed,
				Uptime:         s.State.Uptime,
				Load1:          s.State.Load1,
				Load5:          s.State.Load5,
				Load15:         s.State.Load15,
				TcpConnCount:   s.State.TcpConnCount,
				UdpConnCount:   s.State.UdpConnCount,
				ProcessCount:   s.State.ProcessCount,
				Temperatures:   s.State.Temperatures,
				GPU: func() []float64 {
					if len(s.Host.GPU) > 0 {
						return []float64{s.State.GPU}
					}
					return nil
				}(),
			},
			GeoIP: &model.V1GeoIP{
				IP: model.V1IP{
					IPv4Addr: ipv4,
					IPv6Addr: ipv6,
				},
				CountryCode: s.Host.CountryCode,
			},
			LastActive:              s.LastActive,
			TaskStream:              s.TaskStream,
			PrevTransferInSnapshot:  s.PrevTransferInSnapshot,
			PrevTransferOutSnapshot: s.PrevTransferOutSnapshot,
		})
	}

	filterID := c.Query("id")
	if filterID != "" {
		oldssl := ssl
		ssl = []*model.V1Server{}
		ids := strings.Split(filterID, ",")
		for _, id := range ids {
			idUint, err := strconv.ParseUint(id, 10, 64)
			if err != nil {
				continue
			}
			ssl = appendBinarySearch(ssl, oldssl, idUint)
		}
	}

	c.JSON(200, V1Response[[]*model.V1Server]{
		Success: true,
		Data:    ssl,
	})
}

func (cv *compatV1) serverStream(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, V1Response[any]{
			Success: false,
			Error:   err.Error(),
		})
		return
	}
	defer conn.Close()
	singleton.OnlineUsers.Add(1)
	defer singleton.OnlineUsers.Add(^uint64(0))
	count := 0
	for {
		stat, err := cv.getServerStat(c, count == 0)
		if err != nil {
			continue
		}
		if err := conn.WriteMessage(websocket.TextMessage, stat); err != nil {
			break
		}
		count += 1
		if count%4 == 0 {
			err = conn.WriteMessage(websocket.PingMessage, []byte{})
			if err != nil {
				break
			}
		}
		time.Sleep(time.Second * 2)
	}
}

func (cv *compatV1) getServerStat(c *gin.Context, withPublicNote bool) ([]byte, error) {
	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	_, isViewPasswordVerfied := c.Get(model.CtxKeyViewPasswordVerified)
	authorized := isMember || isViewPasswordVerfied
	v, err, _ := cv.requestGroup.Do(fmt.Sprintf("serverStats::%t", authorized), func() (interface{}, error) {
		singleton.SortedServerLock.RLock()
		defer singleton.SortedServerLock.RUnlock()

		var serverList []*model.Server
		if authorized {
			serverList = singleton.SortedServerList
		} else {
			serverList = singleton.SortedServerListForGuest
		}

		servers := make([]model.V1StreamServer, 0, len(serverList))
		for _, server := range serverList {
			servers = append(servers, model.V1StreamServer{
				ID:   server.ID,
				Name: server.Name,
				PublicNote: func() string {
					if withPublicNote {
						return server.PublicNote
					}
					return ""
				}(),
				DisplayIndex: server.DisplayIndex,
				Host: &model.V1Host{
					Platform:        server.Host.Platform,
					PlatformVersion: server.Host.PlatformVersion,
					CPU:             server.Host.CPU,
					MemTotal:        server.Host.MemTotal,
					DiskTotal:       server.Host.DiskTotal,
					SwapTotal:       server.Host.SwapTotal,
					Arch:            server.Host.Arch,
					Virtualization:  server.Host.Virtualization,
					BootTime:        server.Host.BootTime,
					Version:         server.Host.Version,
					GPU:             server.Host.GPU,
				},
				State: &model.V1HostState{
					CPU:            server.State.CPU,
					MemUsed:        server.State.MemUsed,
					SwapUsed:       server.State.SwapUsed,
					DiskUsed:       server.State.DiskUsed,
					NetInTransfer:  server.State.NetInTransfer,
					NetOutTransfer: server.State.NetOutTransfer,
					NetInSpeed:     server.State.NetInSpeed,
					NetOutSpeed:    server.State.NetOutSpeed,
					Uptime:         server.State.Uptime,
					Load1:          server.State.Load1,
					Load5:          server.State.Load5,
					Load15:         server.State.Load15,
					TcpConnCount:   server.State.TcpConnCount,
					UdpConnCount:   server.State.UdpConnCount,
					ProcessCount:   server.State.ProcessCount,
					Temperatures:   server.State.Temperatures,
					GPU: func() []float64 {
						if len(server.Host.GPU) > 0 {
							return []float64{server.State.GPU}
						}
						return nil
					}(),
				},
				CountryCode: server.Host.CountryCode,
				LastActive:  server.LastActive,
			})
		}

		return utils.Json.Marshal(model.V1StreamServerData{
			Now:     time.Now().Unix() * 1000,
			Online:  singleton.OnlineUsers.Load(),
			Servers: servers,
		})
	})
	return v.([]byte), err
}

func (cv *compatV1) listServerGroup(c *gin.Context) {
	var sgRes []model.V1ServerGroupResponseItem

	tagID := uint64(1)
	for tag, ids := range singleton.ServerTagToIDList {
		sgRes = append(sgRes, model.V1ServerGroupResponseItem{
			Group: model.V1ServerGroup{
				V1Common: model.V1Common{
					ID:        tagID,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				},
				Name: tag,
			},
			Servers: ids,
		})
		tagID++ // 虽然无法保证 tagID 的唯一性，但至少在绝大部分情况下不会出问题
	}

	filterID := c.Query("id")
	if filterID != "" {
		oldsgRes := sgRes
		sgRes = []model.V1ServerGroupResponseItem{}
		ids := strings.Split(filterID, ",")
		for _, id := range ids {
			idUint, err := strconv.ParseUint(id, 10, 64)
			if err != nil {
				continue
			}
			if idUint >= uint64(len(oldsgRes)) {
				continue
			}
			sgRes = append(sgRes, oldsgRes[idUint])
		}
	}

	c.JSON(200, V1Response[[]model.V1ServerGroupResponseItem]{
		Success: true,
		Data:    sgRes,
	})
}

func (cv *compatV1) listServiceHistory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(400, V1Response[any]{
			Success: false,
			Error:   "invalid id",
		})
		return
	}

	singleton.ServerLock.RLock()
	server, ok := singleton.ServerList[id]
	if !ok {
		c.JSON(404, V1Response[any]{
			Success: false,
			Error:   "server not found",
		})
		return
	}

	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	_, isViewPasswordVerfied := c.Get(model.CtxKeyViewPasswordVerified)
	authorized := isMember || isViewPasswordVerfied

	if server.HideForGuest && !authorized {
		c.JSON(403, V1Response[any]{
			Success: false,
			Error:   "unauthorized",
		})
		return
	}
	singleton.ServerLock.RUnlock()

	query := map[string]any{"server_id": id}
	monitorHistories := singleton.MonitorAPI.GetMonitorHistories(query)
	if monitorHistories.Code != 0 {
		c.JSON(500, V1Response[any]{
			Success: false,
			Error:   monitorHistories.Message,
		})
		return
	}

	monitorIDMap := make(map[uint64]*model.Monitor)
	for _, monitor := range singleton.ServiceSentinelShared.Monitors() {
		monitorIDMap[monitor.ID] = monitor
	}

	ret := make([]*model.V1ServiceInfos, 0, len(monitorHistories.Result))
	for _, history := range monitorHistories.Result {
		ret = append(ret, &model.V1ServiceInfos{
			ServiceID:   history.MonitorID,
			ServerID:    history.ServerID,
			ServiceName: monitorIDMap[history.MonitorID].Name,
			ServerName:  singleton.ServerList[history.ServerID].Name,
			CreatedAt:   history.CreatedAt,
			AvgDelay:    history.AvgDelay,
		})
	}

	c.JSON(200, V1Response[[]*model.V1ServiceInfos]{
		Success: true,
		Data:    ret,
	})
}
