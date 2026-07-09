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
		host, state, lastActive, prevIn, prevOut := s.RuntimeSnapshot()
		if host == nil || state == nil {
			continue
		}
		ipv4, ipv6, _ := utils.SplitIPAddr(host.IP)
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
				Platform:        host.Platform,
				PlatformVersion: host.PlatformVersion,
				CPU:             host.CPU,
				MemTotal:        host.MemTotal,
				DiskTotal:       host.DiskTotal,
				SwapTotal:       host.SwapTotal,
				Arch:            host.Arch,
				Virtualization:  host.Virtualization,
				BootTime:        host.BootTime,
				Version:         host.Version,
				GPU:             host.GPU,
			},
			State: &model.V1HostState{
				CPU:            state.CPU,
				MemUsed:        state.MemUsed,
				SwapUsed:       state.SwapUsed,
				DiskUsed:       state.DiskUsed,
				NetInTransfer:  state.NetInTransfer,
				NetOutTransfer: state.NetOutTransfer,
				NetInSpeed:     state.NetInSpeed,
				NetOutSpeed:    state.NetOutSpeed,
				Uptime:         state.Uptime,
				Load1:          state.Load1,
				Load5:          state.Load5,
				Load15:         state.Load15,
				TcpConnCount:   state.TcpConnCount,
				UdpConnCount:   state.UdpConnCount,
				ProcessCount:   state.ProcessCount,
				Temperatures:   state.Temperatures,
				GPU: func() []float64 {
					if len(host.GPU) > 0 {
						return []float64{state.GPU}
					}
					return nil
				}(),
			},
			GeoIP: &model.V1GeoIP{
				IP: model.V1IP{
					IPv4Addr: ipv4,
					IPv6Addr: ipv6,
				},
				CountryCode: host.CountryCode,
			},
			LastActive:              lastActive,
			TaskStream:              s.TaskStream,
			PrevTransferInSnapshot:  prevIn,
			PrevTransferOutSnapshot: prevOut,
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
			host, state, lastActive, _, _ := server.RuntimeSnapshot()
			if host == nil || state == nil {
				continue
			}
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
					Platform:        host.Platform,
					PlatformVersion: host.PlatformVersion,
					CPU:             host.CPU,
					MemTotal:        host.MemTotal,
					DiskTotal:       host.DiskTotal,
					SwapTotal:       host.SwapTotal,
					Arch:            host.Arch,
					Virtualization:  host.Virtualization,
					BootTime:        host.BootTime,
					Version:         host.Version,
					GPU:             host.GPU,
				},
				State: &model.V1HostState{
					CPU:            state.CPU,
					MemUsed:        state.MemUsed,
					SwapUsed:       state.SwapUsed,
					DiskUsed:       state.DiskUsed,
					NetInTransfer:  state.NetInTransfer,
					NetOutTransfer: state.NetOutTransfer,
					NetInSpeed:     state.NetInSpeed,
					NetOutSpeed:    state.NetOutSpeed,
					Uptime:         state.Uptime,
					Load1:          state.Load1,
					Load5:          state.Load5,
					Load15:         state.Load15,
					TcpConnCount:   state.TcpConnCount,
					UdpConnCount:   state.UdpConnCount,
					ProcessCount:   state.ProcessCount,
					Temperatures:   state.Temperatures,
					GPU: func() []float64 {
						if len(host.GPU) > 0 {
							return []float64{state.GPU}
						}
						return nil
					}(),
				},
				CountryCode: host.CountryCode,
				LastActive:  lastActive,
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
	// ServerTagToIDList 与 ServerList 同由 ServerLock 保护：锁内快照，锁外组装响应。
	// guest 下全隐藏的 tag 仍占位递增 tagID，避免后续可见分组 ID 前移。
	type tagSnapshot struct {
		name string
		ids  []uint64
	}
	singleton.ServerLock.RLock()
	snapshots := make([]tagSnapshot, 0, len(singleton.ServerTagToIDList))
	for tag, ids := range singleton.ServerTagToIDList {
		visibleIDs := append([]uint64(nil), ids...)
		if !authorized {
			visibleIDs = make([]uint64, 0, len(ids))
			for _, id := range ids {
				if s, ok := singleton.ServerList[id]; ok && !s.HideForGuest {
					visibleIDs = append(visibleIDs, id)
				}
			}
		}
		snapshots = append(snapshots, tagSnapshot{name: tag, ids: visibleIDs})
	}
	singleton.ServerLock.RUnlock()

	sort.Slice(snapshots, func(i, j int) bool {
		return snapshots[i].name < snapshots[j].name
	})
	for _, snap := range snapshots {
		if !authorized && len(snap.ids) == 0 {
			tagID++
			continue
		}
		sgRes = append(sgRes, model.V1ServerGroupResponseItem{
			Group: model.V1ServerGroup{
				V1Common: model.V1Common{
					ID:        tagID,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				},
				Name: snap.name,
			},
			Servers: snap.ids,
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
