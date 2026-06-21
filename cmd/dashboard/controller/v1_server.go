package controller

import (
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/utils"
	"github.com/railzen/nezha-zero/service/singleton"
)

func (cv *compatV1) listServer(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	_, isViewPasswordVerfied := c.Get(model.CtxKeyViewPasswordVerified)
	authorized := isMember || isViewPasswordVerfied

	singleton.SortedServerLock.RLock()
	defer singleton.SortedServerLock.RUnlock()

	serverList := singleton.SortedServerList
	if !authorized {
		serverList = singleton.SortedServerListForGuest
	}

	var ssl []*model.V1Server
	for _, s := range serverList {
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
		// SortedServerList 按 DisplayIndex DESC, ID ASC 排序，不是纯 ID 升序；
		// appendBinarySearch 要求按 ID 升序，这里仅在 filter 路径重排，
		// 不影响未带 ?id= 时的默认返回顺序。
		sort.SliceStable(ssl, func(i, j int) bool {
			return ssl[i].ID < ssl[j].ID
		})
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
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
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
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	_, isViewPasswordVerfied := c.Get(model.CtxKeyViewPasswordVerified)
	authorized := isMember || isViewPasswordVerfied

	tagID := uint64(1)
	// 按 tag 名升序遍历，保证同一个 tag 集合下 tagID 分配稳定（map 遍历无序会导致重启后 ID 漂移）。
	tagNames := make([]string, 0, len(singleton.ServerTagToIDList))
	for tag := range singleton.ServerTagToIDList {
		tagNames = append(tagNames, tag)
	}
	sort.Strings(tagNames)
	for _, tag := range tagNames {
		ids, ok := singleton.ServerTagToIDList[tag]
		if !ok {
			// 并发写场景下 tag 可能在 range 之后被删除，跳过即可
			continue
		}
		visibleIDs := ids
		if !authorized {
			visibleIDs = make([]uint64, 0, len(ids))
			singleton.ServerLock.RLock()
			for _, id := range ids {
				if s, ok := singleton.ServerList[id]; ok && !s.HideForGuest {
					visibleIDs = append(visibleIDs, id)
				}
			}
			singleton.ServerLock.RUnlock()
			if len(visibleIDs) == 0 {
				tagID++
				continue
			}
		}
		sgRes = append(sgRes, model.V1ServerGroupResponseItem{
			Group: model.V1ServerGroup{
				V1Common: model.V1Common{
					ID:        tagID,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				},
				Name: tag,
			},
			Servers: visibleIDs,
		})
		tagID++
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
			// 按 Group.ID 线性匹配；原实现把 idUint 当下标（oldsgRes[idUint]）语义错位。
			for i := range oldsgRes {
				if oldsgRes[i].Group.ID == idUint {
					sgRes = append(sgRes, oldsgRes[i])
					break
				}
			}
		}
	}

	c.JSON(200, V1Response[[]model.V1ServerGroupResponseItem]{
		Success: true,
		Data:    sgRes,
	})
}

func (cv *compatV1) listServiceHistory(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
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
	singleton.ServerLock.RUnlock()
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
		c.JSON(404, V1Response[any]{
			Success: false,
			Error:   "server not found",
		})
		return
	}

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
	singleton.ServerLock.RLock()
	for _, history := range monitorHistories.Result {
		monitor := monitorIDMap[history.MonitorID]
		server := singleton.ServerList[history.ServerID]
		// monitor 或 server 已删除但历史记录仍引用时跳过，避免 nil 解引用
		if monitor == nil || server == nil {
			continue
		}
		ret = append(ret, &model.V1ServiceInfos{
			ServiceID:   history.MonitorID,
			ServerID:    history.ServerID,
			ServiceName: monitor.Name,
			ServerName:  server.Name,
			CreatedAt:   history.CreatedAt,
			AvgDelay:    history.AvgDelay,
		})
	}
	singleton.ServerLock.RUnlock()

	c.JSON(200, V1Response[[]*model.V1ServiceInfos]{
		Success: true,
		Data:    ret,
	})
}
