package controller

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/service/singleton"
)

func (cv *compatV1) listService(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	services := singleton.ServiceSentinelShared.Monitors()

	vs := make([]*model.V1Service, 0, len(services))
	for _, s := range services {
		groupID := uint64(0)
		singleton.NotificationsLock.RLock()
		ns := singleton.NotificationList[s.NotificationTag]
		if len(ns) < 1 {
			singleton.NotificationsLock.RUnlock()
			continue
		}
		for _, n := range ns {
			groupID = n.ID
			break
		}
		singleton.NotificationsLock.RUnlock()
		vs = append(vs, &model.V1Service{
			V1Common: model.V1Common{
				ID:        s.ID,
				CreatedAt: s.CreatedAt,
				UpdatedAt: s.UpdatedAt,
			},
			Name:                s.Name,
			Type:                s.Type,
			Target:              s.Target,
			Duration:            s.Duration,
			Notify:              s.Notify,
			NotificationGroupID: groupID,
			Cover:               s.Cover,
			EnableTriggerTask:   s.EnableTriggerTask,
			EnableShowInService: s.EnableShowInService,
			FailTriggerTasks:    s.FailTriggerTasks,
			RecoverTriggerTasks: s.RecoverTriggerTasks,
			MinLatency:          s.MinLatency,
			MaxLatency:          s.MaxLatency,
			LatencyNotify:       s.LatencyNotify,
			SkipServers:         s.SkipServers,
		})
	}

	filterID := c.Query("id")
	if filterID != "" {
		oldvs := vs
		vs = []*model.V1Service{}
		ids := strings.Split(filterID, ",")
		for _, id := range ids {
			idUint, err := strconv.ParseUint(id, 10, 64)
			if err != nil {
				continue
			}
			vs = appendBinarySearch(vs, oldvs, idUint)
		}
	}

	c.JSON(200, V1Response[[]*model.V1Service]{
		Success: true,
		Data:    vs,
	})
}

func (cv *compatV1) showService(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	_, isViewPasswordVerfied := c.Get(model.CtxKeyViewPasswordVerified)
	authorized := isMember || isViewPasswordVerfied

	res, err, _ := cv.requestGroup.Do("list-service", func() (interface{}, error) {
		// 先 LoadStats 再拿 AlertsLock，避免 Alerts→store→Server→Alerts 三锁环
		sri := make(map[uint64]model.V1ServiceResponseItem)
		for k, service := range singleton.ServiceSentinelShared.LoadStats() {
			if !service.Monitor.EnableShowInService {
				continue
			}

			sri[k] = model.V1ServiceResponseItem{
				ServiceName: service.Monitor.Name,
				CurrentUp:   service.CurrentUp,
				CurrentDown: service.CurrentDown,
				TotalUp:     service.TotalUp,
				TotalDown:   service.TotalDown,
				Delay:       service.Delay,
				Up:          service.Up,
				Down:        service.Down,
			}
		}
		var cycleTransferStats map[uint64]model.V1CycleTransferStats
		singleton.AlertsLock.RLock()
		copier.CopyWithOption(&cycleTransferStats, singleton.AlertsCycleTransferStatsStore, copier.Option{DeepCopy: true})
		singleton.AlertsLock.RUnlock()
		return []interface {
		}{
			sri, cycleTransferStats,
		}, nil
	})
	if err != nil {
		c.JSON(500, V1Response[any]{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	cycleTransferStats := res.([]interface{})[1].(map[uint64]model.V1CycleTransferStats)
	if !authorized {
		// 过滤掉 HideForGuest 服务器在流量统计中的名称和数据
		filtered := make(map[uint64]model.V1CycleTransferStats, len(cycleTransferStats))
		singleton.ServerLock.RLock()
		for k, v := range cycleTransferStats {
			serverName := make(map[uint64]string, len(v.ServerName))
			transfer := make(map[uint64]uint64, len(v.Transfer))
			nextUpdate := make(map[uint64]time.Time, len(v.NextUpdate))
			for serverID, name := range v.ServerName {
				if s, ok := singleton.ServerList[serverID]; ok && s.HideForGuest {
					continue
				}
				serverName[serverID] = name
				if t, ok2 := v.Transfer[serverID]; ok2 {
					transfer[serverID] = t
				}
				if nu, ok2 := v.NextUpdate[serverID]; ok2 {
					nextUpdate[serverID] = nu
				}
			}
			filtered[k] = model.V1CycleTransferStats{
				Name:       v.Name,
				From:       v.From,
				To:         v.To,
				Max:        v.Max,
				Min:        v.Min,
				ServerName: serverName,
				Transfer:   transfer,
				NextUpdate: nextUpdate,
			}
		}
		singleton.ServerLock.RUnlock()
		cycleTransferStats = filtered
	}

	response := model.V1ServiceResponse{
		Services:           res.([]interface{})[0].(map[uint64]model.V1ServiceResponseItem),
		CycleTransferStats: cycleTransferStats,
	}
	c.JSON(200, V1Response[model.V1ServiceResponse]{
		Success: true,
		Data:    response,
	})
}

func (cv *compatV1) listServerWithServices(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	serverIdsWithService, err := serverIDsWithMonitorHistory()
	if err != nil {
		c.JSON(500, V1Response[any]{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	_, isViewPasswordVerfied := c.Get(model.CtxKeyViewPasswordVerified)
	authorized := isMember || isViewPasswordVerfied

	var ret []uint64
	for _, id := range serverIdsWithService {
		singleton.ServerLock.RLock()
		server, ok := singleton.ServerList[id]
		if !ok {
			singleton.ServerLock.RUnlock()
			c.JSON(404, V1Response[any]{
				Success: false,
				Error:   "server not found",
			})
			return
		}

		if !server.HideForGuest || authorized {
			ret = append(ret, id)
		}
		singleton.ServerLock.RUnlock()
	}

	c.JSON(200, V1Response[[]uint64]{
		Success: true,
		Data:    ret,
	})
}
