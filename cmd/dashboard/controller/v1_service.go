package controller

import (
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/naiba/nezha/model"
	"github.com/naiba/nezha/service/singleton"
)

func (cv *compatV1) listService(c *gin.Context) {
	services := singleton.ServiceSentinelShared.Monitors()

	vs := make([]*model.V1Service, 0, len(services))
	for _, s := range services {
		groupID := uint64(0)
		if len(singleton.NotificationList[s.NotificationTag]) < 1 {
			continue
		}
		for _, n := range singleton.NotificationList[s.NotificationTag] {
			groupID = n.ID
			break
		}
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
	res, err, _ := cv.requestGroup.Do("list-service", func() (interface{}, error) {
		singleton.AlertsLock.RLock()
		defer singleton.AlertsLock.RUnlock()

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
		cycleTransferStats := make(map[uint64]model.V1CycleTransferStats)
		for k, v := range singleton.AlertsCycleTransferStatsStore {
			cycleTransferStats[k] = model.V1CycleTransferStats{
				Name:       v.Name,
				From:       v.From,
				To:         v.To,
				Max:        v.Max,
				Min:        v.Min,
				ServerName: v.ServerName,
				Transfer:   v.Transfer,
				NextUpdate: v.NextUpdate,
			}
		}
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

	response := model.V1ServiceResponse{
		Services:           res.([]interface{})[0].(map[uint64]model.V1ServiceResponseItem),
		CycleTransferStats: res.([]interface{})[1].(map[uint64]model.V1CycleTransferStats),
	}
	c.JSON(200, V1Response[model.V1ServiceResponse]{
		Success: true,
		Data:    response,
	})
}

func (cv *compatV1) listServerWithServices(c *gin.Context) {
	var serverIdsWithService []uint64
	if err := singleton.DB.Model(&model.MonitorHistory{}).
		Select("distinct(server_id)").
		Where("server_id != 0").
		Find(&serverIdsWithService).Error; err != nil {
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
