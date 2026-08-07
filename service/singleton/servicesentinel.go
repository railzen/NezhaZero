package singleton

import (
	"fmt"
	"log"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/nicksnyder/go-i18n/v2/i18n"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/audit"
	pb "github.com/railzen/nezha-zero/proto"
)

const (
	_CurrentStatusSize = 30 // 统计 15 分钟内的数据为当前状态

	// ping 监控历史批量落盘参数：满 200 条或每分钟落盘一次。
	monitorHistoryBatchFlushSize     = 200
	monitorHistoryBatchFlushInterval = time.Minute
)

var ServiceSentinelShared *ServiceSentinel

type ReportData struct {
	Data     *pb.TaskResult
	Reporter uint64
}

type serviceReportMessage struct {
	report ReportData
	stop   chan struct{}
}

// _TodayStatsOfMonitor 今日监控记录
type _TodayStatsOfMonitor struct {
	Up    int     // 今日在线计数
	Down  int     // 今日离线计数
	Delay float32 // 今日平均延迟
}

// NewServiceSentinel 创建服务监控器
func NewServiceSentinel(serviceSentinelDispatchBus chan<- model.Monitor) {
	ServiceSentinelShared = &ServiceSentinel{
		serviceReportChannel:                    make(chan serviceReportMessage, 200),
		serviceStatusToday:                      make(map[uint64]*_TodayStatsOfMonitor),
		serviceCurrentStatusIndex:               make(map[uint64]*indexStore),
		serviceCurrentStatusData:                make(map[uint64][]*pb.TaskResult),
		lastStatus:                              make(map[uint64]int),
		serviceResponseDataStoreCurrentUp:       make(map[uint64]uint64),
		serviceResponseDataStoreCurrentDown:     make(map[uint64]uint64),
		serviceResponseDataStoreCurrentAvgDelay: make(map[uint64]float32),
		serviceResponsePing:                     make(map[uint64]map[uint64]*pingStore),
		monitors:                                make(map[uint64]*model.Monitor),
		sslCertCache:                            make(map[uint64]string),
		monitorHistoryFlushCh:                   make(chan struct{}, 1),
		monitorHistoryStopCh:                    make(chan struct{}),
		monitorHistoryDoneCh:                    make(chan struct{}),
		// 30天数据缓存
		monthlyStatus: make(map[uint64]*model.ServiceItemResponse),
		dispatchBus:   serviceSentinelDispatchBus,
	}
	// 加载历史记录
	ServiceSentinelShared.loadMonitorHistory()

	year, month, day := time.Now().Date()
	today := time.Date(year, month, day, 0, 0, 0, 0, Loc)

	var mhs []model.MonitorHistory
	// 加载当日记录
	DB.Where("created_at >= ?", today).Find(&mhs)
	totalDelay := make(map[uint64]float32)
	totalDelayCount := make(map[uint64]float32)
	for i := 0; i < len(mhs); i++ {
		totalDelay[mhs[i].MonitorID] += mhs[i].AvgDelay
		totalDelayCount[mhs[i].MonitorID]++
		ServiceSentinelShared.serviceStatusToday[mhs[i].MonitorID].Up += int(mhs[i].Up)
		ServiceSentinelShared.monthlyStatus[mhs[i].MonitorID].TotalUp += mhs[i].Up
		ServiceSentinelShared.serviceStatusToday[mhs[i].MonitorID].Down += int(mhs[i].Down)
		ServiceSentinelShared.monthlyStatus[mhs[i].MonitorID].TotalDown += mhs[i].Down
	}
	for id, delay := range totalDelay {
		ServiceSentinelShared.serviceStatusToday[id].Delay = delay / float32(totalDelayCount[id])
	}

	// 启动服务监控器
	go ServiceSentinelShared.worker()

	// 启动 ping 监控历史批量落盘器。只有该 goroutine 会执行批量写库。
	go ServiceSentinelShared.monitorHistoryFlusher()

	// 每日将游标往后推一天
	_, err := Cron.AddFunc("0 0 0 * * *", ServiceSentinelShared.refreshMonthlyServiceStatus)
	if err != nil {
		panic(err)
	}
}

/*
使用缓存 channel，处理上报的 Service 请求结果，然后判断是否需要报警
需要记录上一次的状态信息

加锁顺序：serviceResponseDataStoreLock > monthlyStatusLock > monitorsLock
*/
type ServiceSentinel struct {
	// 服务监控任务上报通道
	serviceReportChannel chan serviceReportMessage // 服务状态汇报管道
	serviceLifecycleLock sync.RWMutex
	serviceStopped       bool
	// 服务监控任务调度通道
	dispatchBus chan<- model.Monitor

	serviceResponseDataStoreLock            sync.RWMutex
	serviceStatusToday                      map[uint64]*_TodayStatsOfMonitor // [monitor_id] -> _TodayStatsOfMonitor
	serviceCurrentStatusIndex               map[uint64]*indexStore           // [monitor_id] -> 该监控ID对应的 serviceCurrentStatusData 的最新索引下标
	serviceCurrentStatusData                map[uint64][]*pb.TaskResult      // [monitor_id] -> []model.MonitorHistory
	serviceResponseDataStoreCurrentUp       map[uint64]uint64                // [monitor_id] -> 当前服务在线计数
	serviceResponseDataStoreCurrentDown     map[uint64]uint64                // [monitor_id] -> 当前服务离线计数
	serviceResponseDataStoreCurrentAvgDelay map[uint64]float32               // [monitor_id] -> 当前服务离线计数
	serviceResponsePing                     map[uint64]map[uint64]*pingStore // [monitor_id] -> ClientID -> delay
	lastStatus                              map[uint64]int
	sslCertCache                            map[uint64]string

	monitorsLock sync.RWMutex
	monitors     map[uint64]*model.Monitor // [monitor_id] -> model.Monitor

	// ping 监控历史批量写入缓冲。worker 只追加并发信号，不直接写库。
	monitorHistoryBatchLock sync.Mutex
	monitorHistoryBatch     []model.MonitorHistory
	monitorHistoryInFlight  []model.MonitorHistory
	monitorHistoryFlushCh   chan struct{}
	monitorHistoryStopCh    chan struct{}
	monitorHistoryDoneCh    chan struct{}
	monitorHistoryFlushErr  error
	shutdownOnce            sync.Once
	shutdownErr             error

	// 30天数据缓存
	monthlyStatusLock sync.Mutex
	monthlyStatus     map[uint64]*model.ServiceItemResponse // [monitor_id] -> model.ServiceItemResponse
}

type indexStore struct {
	index int
	t     time.Time
}

type pingStore struct {
	count int
	ping  float32
}

func (ss *ServiceSentinel) refreshMonthlyServiceStatus() {
	// 刷新数据防止无人访问
	ss.LoadStats()
	// 将数据往前刷一天
	ss.serviceResponseDataStoreLock.Lock()
	defer ss.serviceResponseDataStoreLock.Unlock()
	ss.monthlyStatusLock.Lock()
	defer ss.monthlyStatusLock.Unlock()
	for k, v := range ss.monthlyStatus {
		for i := 0; i < len(v.Up)-1; i++ {
			if i == 0 {
				// 30 天在线率，减去已经出30天之外的数据
				v.TotalDown -= uint64(v.Down[i])
				v.TotalUp -= uint64(v.Up[i])
			}
			v.Up[i], v.Down[i], v.Delay[i] = v.Up[i+1], v.Down[i+1], v.Delay[i+1]
		}
		v.Up[29] = 0
		v.Down[29] = 0
		v.Delay[29] = 0
		// 清理前一天数据
		ss.serviceResponseDataStoreCurrentUp[k] = 0
		ss.serviceResponseDataStoreCurrentDown[k] = 0
		ss.serviceResponseDataStoreCurrentAvgDelay[k] = 0
		ss.serviceStatusToday[k].Delay = 0
		ss.serviceStatusToday[k].Up = 0
		ss.serviceStatusToday[k].Down = 0
	}
}

// Dispatch 将传入的 ReportData 传给 服务状态汇报管道
func (ss *ServiceSentinel) Dispatch(r ReportData) {
	ss.serviceLifecycleLock.RLock()
	defer ss.serviceLifecycleLock.RUnlock()
	if ss.serviceStopped {
		return
	}
	select {
	case ss.serviceReportChannel <- serviceReportMessage{report: r}:
	default:
		log.Printf("NEZHA>> Service report channel full, dropped monitor report: monitor=%d reporter=%d type=%d", r.Data.GetId(), r.Reporter, r.Data.GetType())
	}
}

// enqueueMonitorHistory 把一条 ping 监控历史追加到内存缓冲，凑满一批后通知落盘器。
func (ss *ServiceSentinel) enqueueMonitorHistory(mh model.MonitorHistory) {
	if mh.CreatedAt.IsZero() {
		mh.CreatedAt = time.Now()
	}
	ss.monitorHistoryBatchLock.Lock()
	ss.monitorHistoryBatch = append(ss.monitorHistoryBatch, mh)
	full := len(ss.monitorHistoryBatch) == monitorHistoryBatchFlushSize
	ss.monitorHistoryBatchLock.Unlock()
	if full {
		select {
		case ss.monitorHistoryFlushCh <- struct{}{}:
		default:
		}
	}
}

// pendingMonitorHistories 返回尚未确认落库的历史快照，供查询与 SQLite 结果合并。
// in-flight 使用独立副本，避免 GORM 写入 ID 等字段时与查询发生数据竞争。
func (ss *ServiceSentinel) pendingMonitorHistories(serverID uint64, since time.Time) []*model.MonitorHistory {
	ss.monitorHistoryBatchLock.Lock()
	defer ss.monitorHistoryBatchLock.Unlock()

	result := make([]*model.MonitorHistory, 0, len(ss.monitorHistoryInFlight)+len(ss.monitorHistoryBatch))
	appendMatching := func(histories []model.MonitorHistory) {
		for i := range histories {
			if histories[i].ServerID != serverID || histories[i].CreatedAt.Before(since) {
				continue
			}
			history := histories[i]
			result = append(result, &history)
		}
	}
	appendMatching(ss.monitorHistoryInFlight)
	appendMatching(ss.monitorHistoryBatch)
	return result
}

// monitorHistoryFlusher 周期性地把内存里攒下的 ping 监控历史批量写入数据库。
func (ss *ServiceSentinel) monitorHistoryFlusher() {
	ticker := time.NewTicker(monitorHistoryBatchFlushInterval)
	defer ticker.Stop()
	defer close(ss.monitorHistoryDoneCh)
	for {
		select {
		case <-ticker.C:
			ss.monitorHistoryFlushErr = ss.flushMonitorHistory(true)
		case <-ss.monitorHistoryFlushCh:
			ss.monitorHistoryFlushErr = ss.flushMonitorHistory(false)
		case <-ss.monitorHistoryStopCh:
			ss.monitorHistoryFlushErr = ss.flushMonitorHistory(true)
			return
		}
	}
}

// Shutdown 停止接收新报告，等待 worker 排空已接收报告，再完成最后一次批量落库。
func (ss *ServiceSentinel) Shutdown() error {
	ss.shutdownOnce.Do(func() {
		ss.serviceLifecycleLock.Lock()
		ss.serviceStopped = true
		workerDone := make(chan struct{})
		ss.serviceReportChannel <- serviceReportMessage{stop: workerDone}
		ss.serviceLifecycleLock.Unlock()
		<-workerDone

		close(ss.monitorHistoryStopCh)
		<-ss.monitorHistoryDoneCh
		ss.shutdownErr = ss.monitorHistoryFlushErr
	})
	return ss.shutdownErr
}

// flushMonitorHistory 每次最多写 200 条。force 为 true 时同时写出不足 200 条的尾批。
// 写入失败的批次会直接丢弃，避免数据库持续故障时内存无上限增长。
func (ss *ServiceSentinel) flushMonitorHistory(force bool) error {
	for {
		ss.monitorHistoryBatchLock.Lock()
		if len(ss.monitorHistoryBatch) == 0 || (!force && len(ss.monitorHistoryBatch) < monitorHistoryBatchFlushSize) {
			ss.monitorHistoryBatchLock.Unlock()
			return nil
		}
		batchSize := min(len(ss.monitorHistoryBatch), monitorHistoryBatchFlushSize)
		batch := append([]model.MonitorHistory(nil), ss.monitorHistoryBatch[:batchSize]...)
		ss.monitorHistoryInFlight = append([]model.MonitorHistory(nil), batch...)
		ss.monitorHistoryBatch = ss.monitorHistoryBatch[batchSize:]
		if len(ss.monitorHistoryBatch) == 0 {
			ss.monitorHistoryBatch = nil
		}
		ss.monitorHistoryBatchLock.Unlock()

		if err := DB.Create(&batch).Error; err != nil {
			ss.monitorHistoryBatchLock.Lock()
			ss.monitorHistoryInFlight = nil
			ss.monitorHistoryBatchLock.Unlock()
			audit.Record(nil, audit.TypeEvent, "Monitor history persistence failed",
				fmt.Sprintf("dropped %d monitor history records: %v", len(batch), err))
			log.Println("NEZHA>> 服务监控数据批量持久化失败：", err)
			return err
		}
		ss.monitorHistoryBatchLock.Lock()
		ss.monitorHistoryInFlight = nil
		ss.monitorHistoryBatchLock.Unlock()
	}
}

func (ss *ServiceSentinel) Monitors() []*model.Monitor {
	ss.monitorsLock.RLock()
	defer ss.monitorsLock.RUnlock()
	var monitors []*model.Monitor
	for _, v := range ss.monitors {
		monitors = append(monitors, v)
	}
	sort.SliceStable(monitors, func(i, j int) bool {
		return monitors[i].ID < monitors[j].ID
	})
	return monitors
}

// loadMonitorHistory 加载服务监控器的历史状态信息
func (ss *ServiceSentinel) loadMonitorHistory() {
	var monitors []*model.Monitor
	err := DB.Find(&monitors).Error
	if err != nil {
		panic(err)
	}

	ss.serviceResponseDataStoreLock.Lock()
	defer ss.serviceResponseDataStoreLock.Unlock()
	ss.monthlyStatusLock.Lock()
	defer ss.monthlyStatusLock.Unlock()
	ss.monitorsLock.Lock()
	defer ss.monitorsLock.Unlock()

	for i := 0; i < len(monitors); i++ {
		// 旧版本可能不存在通知组 为其设置默认组
		if monitors[i].NotificationTag == "" {
			monitors[i].NotificationTag = "default"
			DB.Save(monitors[i])
		}
		task := *monitors[i]
		// 通过cron定时将服务监控任务传递给任务调度管道
		monitors[i].CronJobID, err = Cron.AddFunc(task.CronSpec(), func() {
			ss.dispatchBus <- task
		})
		if err != nil {
			panic(err)
		}
		ss.monitors[monitors[i].ID] = monitors[i]
		ss.serviceCurrentStatusData[monitors[i].ID] = make([]*pb.TaskResult, _CurrentStatusSize)
		ss.serviceStatusToday[monitors[i].ID] = &_TodayStatsOfMonitor{}
	}

	year, month, day := time.Now().Date()
	today := time.Date(year, month, day, 0, 0, 0, 0, Loc)

	for i := 0; i < len(monitors); i++ {
		ServiceSentinelShared.monthlyStatus[monitors[i].ID] = &model.ServiceItemResponse{
			Monitor: monitors[i],
			Delay:   &[30]float32{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
			Up:      &[30]int{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
			Down:    &[30]int{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
		}
	}

	// 加载服务监控历史记录
	var mhs []model.MonitorHistory
	DB.Where("created_at > ? AND created_at < ?", today.AddDate(0, 0, -29), today).Find(&mhs)
	var delayCount = make(map[int]int)
	for i := 0; i < len(mhs); i++ {
		dayIndex := 28 - (int(today.Sub(mhs[i].CreatedAt).Hours()) / 24)
		if dayIndex < 0 {
			continue
		}
		ServiceSentinelShared.monthlyStatus[mhs[i].MonitorID].Delay[dayIndex] = (ServiceSentinelShared.monthlyStatus[mhs[i].MonitorID].Delay[dayIndex]*float32(delayCount[dayIndex]) + mhs[i].AvgDelay) / float32(delayCount[dayIndex]+1)
		delayCount[dayIndex]++
		ServiceSentinelShared.monthlyStatus[mhs[i].MonitorID].Up[dayIndex] += int(mhs[i].Up)
		ServiceSentinelShared.monthlyStatus[mhs[i].MonitorID].TotalUp += mhs[i].Up
		ServiceSentinelShared.monthlyStatus[mhs[i].MonitorID].Down[dayIndex] += int(mhs[i].Down)
		ServiceSentinelShared.monthlyStatus[mhs[i].MonitorID].TotalDown += mhs[i].Down
	}
}

func (ss *ServiceSentinel) OnMonitorUpdate(m model.Monitor) error {
	ss.serviceResponseDataStoreLock.Lock()
	defer ss.serviceResponseDataStoreLock.Unlock()
	ss.monthlyStatusLock.Lock()
	defer ss.monthlyStatusLock.Unlock()
	ss.monitorsLock.Lock()
	defer ss.monitorsLock.Unlock()

	var err error
	// 写入新任务
	m.CronJobID, err = Cron.AddFunc(m.CronSpec(), func() {
		ss.dispatchBus <- m
	})
	if err != nil {
		return err
	}
	if ss.monitors[m.ID] != nil {
		// 停掉旧任务
		Cron.Remove(ss.monitors[m.ID].CronJobID)
	} else {
		// 新任务初始化数据
		ss.monthlyStatus[m.ID] = &model.ServiceItemResponse{
			Monitor: &m,
			Delay:   &[30]float32{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
			Up:      &[30]int{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
			Down:    &[30]int{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
		}
		ss.serviceCurrentStatusData[m.ID] = make([]*pb.TaskResult, _CurrentStatusSize)
		ss.serviceStatusToday[m.ID] = &_TodayStatsOfMonitor{}
	}
	// 更新这个任务
	ss.monitors[m.ID] = &m
	return nil
}

func (ss *ServiceSentinel) OnMonitorDelete(id uint64) {
	ss.serviceResponseDataStoreLock.Lock()
	defer ss.serviceResponseDataStoreLock.Unlock()
	ss.monthlyStatusLock.Lock()
	defer ss.monthlyStatusLock.Unlock()
	ss.monitorsLock.Lock()
	defer ss.monitorsLock.Unlock()

	delete(ss.serviceCurrentStatusIndex, id)
	delete(ss.serviceCurrentStatusData, id)
	delete(ss.lastStatus, id)
	delete(ss.serviceResponseDataStoreCurrentUp, id)
	delete(ss.serviceResponseDataStoreCurrentDown, id)
	delete(ss.serviceResponseDataStoreCurrentAvgDelay, id)
	delete(ss.sslCertCache, id)
	delete(ss.serviceStatusToday, id)

	// 停掉定时任务
	if monitor := ss.monitors[id]; monitor != nil {
		Cron.Remove(monitor.CronJobID)
	}
	delete(ss.monitors, id)

	delete(ss.monthlyStatus, id)
}

func (ss *ServiceSentinel) LoadStats() map[uint64]*model.ServiceItemResponse {
	ss.serviceResponseDataStoreLock.RLock()
	defer ss.serviceResponseDataStoreLock.RUnlock()
	ss.monthlyStatusLock.Lock()
	defer ss.monthlyStatusLock.Unlock()

	// 刷新最新一天的数据
	for k := range ss.monitors {
		if ss.monthlyStatus[k] == nil || ss.serviceStatusToday[k] == nil {
			continue
		}
		ss.monthlyStatus[k].Monitor = ss.monitors[k]
		v := ss.serviceStatusToday[k]

		// 30 天在线率，
		//   |- 减去上次加的旧当天数据，防止出现重复计数
		ss.monthlyStatus[k].TotalUp -= uint64(ss.monthlyStatus[k].Up[29])
		ss.monthlyStatus[k].TotalDown -= uint64(ss.monthlyStatus[k].Down[29])
		//   |- 加上当日数据
		ss.monthlyStatus[k].TotalUp += uint64(v.Up)
		ss.monthlyStatus[k].TotalDown += uint64(v.Down)

		ss.monthlyStatus[k].Up[29] = v.Up
		ss.monthlyStatus[k].Down[29] = v.Down
		ss.monthlyStatus[k].Delay[29] = v.Delay
	}

	// 最后 5 分钟的状态 与 monitor 对象填充
	for k, v := range ss.serviceResponseDataStoreCurrentDown {
		if ss.monthlyStatus[k] != nil {
			ss.monthlyStatus[k].CurrentDown = v
		}
	}
	for k, v := range ss.serviceResponseDataStoreCurrentUp {
		if ss.monthlyStatus[k] != nil {
			ss.monthlyStatus[k].CurrentUp = v
		}
	}

	stats := make(map[uint64]*model.ServiceItemResponse, len(ss.monthlyStatus))
	for k, v := range ss.monthlyStatus {
		if v == nil {
			continue
		}
		item := *v
		if v.Delay != nil {
			delay := *v.Delay
			item.Delay = &delay
		}
		if v.Up != nil {
			up := *v.Up
			item.Up = &up
		}
		if v.Down != nil {
			down := *v.Down
			item.Down = &down
		}
		stats[k] = &item
	}

	return stats
}

// worker 服务监控的实际工作流程
func (ss *ServiceSentinel) worker() {
	// 从服务状态汇报管道获取汇报的服务数据
	for message := range ss.serviceReportChannel {
		if message.stop != nil {
			close(message.stop)
			return
		}
		r := message.report
		mh := r.Data
		monitorID := mh.GetId()

		ss.monitorsLock.RLock()
		monitor := ss.monitors[monitorID]
		var monitorSnapshot model.Monitor
		if monitor != nil {
			monitorSnapshot = *monitor
		}
		ss.monitorsLock.RUnlock()

		if monitorSnapshot.ID == 0 {
			log.Printf("NEZHA>> 错误的服务监控上报 %+v", r)
			continue
		}

		if mh.Type == model.TaskTypeTCPPing || mh.Type == model.TaskTypeICMPPing {
			monitorTcpMap, ok := ss.serviceResponsePing[mh.GetId()]
			if !ok {
				monitorTcpMap = make(map[uint64]*pingStore)
				ss.serviceResponsePing[mh.GetId()] = monitorTcpMap
			}
			ts, ok := monitorTcpMap[r.Reporter]
			if !ok {
				ts = &pingStore{}
			}
			ts.count++
			ts.ping = (ts.ping*float32(ts.count-1) + mh.Delay) / float32(ts.count)
			if ts.count == Conf.AvgPingCount {
				if ts.ping > float32(Conf.MaxTCPPingValue) {
					ts.ping = float32(Conf.MaxTCPPingValue)
				}
				ts.count = 0
				// 不立即写库，先入内存缓冲，由 flusher 批量落盘
				ss.enqueueMonitorHistory(model.MonitorHistory{
					MonitorID: mh.GetId(),
					AvgDelay:  ts.ping,
					Data:      mh.Data,
					ServerID:  r.Reporter,
				})
			}
			monitorTcpMap[r.Reporter] = ts
		}
		ss.serviceResponseDataStoreLock.Lock()
		if ss.serviceStatusToday[monitorID] == nil || ss.serviceCurrentStatusData[monitorID] == nil {
			ss.serviceResponseDataStoreLock.Unlock()
			continue
		}
		// 写入当天状态
		if mh.Successful {
			ss.serviceStatusToday[mh.GetId()].Delay = (ss.serviceStatusToday[mh.
				GetId()].Delay*float32(ss.serviceStatusToday[mh.GetId()].Up) +
				mh.Delay) / float32(ss.serviceStatusToday[mh.GetId()].Up+1)
			ss.serviceStatusToday[mh.GetId()].Up++
		} else {
			ss.serviceStatusToday[mh.GetId()].Down++
		}

		currentTime := time.Now()
		if ss.serviceCurrentStatusIndex[mh.GetId()] == nil {
			ss.serviceCurrentStatusIndex[mh.GetId()] = &indexStore{
				t:     currentTime,
				index: 0,
			}
		}
		// 写入当前数据
		if ss.serviceCurrentStatusIndex[mh.GetId()].t.Before(currentTime) {
			ss.serviceCurrentStatusIndex[mh.GetId()].t = currentTime.Add(30 * time.Second)
			ss.serviceCurrentStatusData[mh.GetId()][ss.serviceCurrentStatusIndex[mh.GetId()].index] = mh
			ss.serviceCurrentStatusIndex[mh.GetId()].index++
		}

		// 更新当前状态
		ss.serviceResponseDataStoreCurrentUp[mh.GetId()] = 0
		ss.serviceResponseDataStoreCurrentDown[mh.GetId()] = 0
		ss.serviceResponseDataStoreCurrentAvgDelay[mh.GetId()] = 0

		// 永远是最新的 30 个数据的状态 [01:00, 02:00, 03:00] -> [04:00, 02:00, 03: 00]
		for i := 0; i < len(ss.serviceCurrentStatusData[mh.GetId()]); i++ {
			if ss.serviceCurrentStatusData[mh.GetId()][i].GetId() > 0 {
				if ss.serviceCurrentStatusData[mh.GetId()][i].Successful {
					ss.serviceResponseDataStoreCurrentUp[mh.GetId()]++
					ss.serviceResponseDataStoreCurrentAvgDelay[mh.GetId()] = (ss.serviceResponseDataStoreCurrentAvgDelay[mh.GetId()]*float32(ss.serviceResponseDataStoreCurrentUp[mh.GetId()]-1) + ss.serviceCurrentStatusData[mh.GetId()][i].Delay) / float32(ss.serviceResponseDataStoreCurrentUp[mh.GetId()])
				} else {
					ss.serviceResponseDataStoreCurrentDown[mh.GetId()]++
				}
			}
		}

		// 计算在线率，
		var upPercent uint64 = 0
		if ss.serviceResponseDataStoreCurrentDown[mh.GetId()]+ss.serviceResponseDataStoreCurrentUp[mh.GetId()] > 0 {
			upPercent = ss.serviceResponseDataStoreCurrentUp[mh.GetId()] * 100 / (ss.serviceResponseDataStoreCurrentDown[mh.GetId()] + ss.serviceResponseDataStoreCurrentUp[mh.GetId()])
		}
		stateCode := GetStatusCode(upPercent)

		// 数据持久化：锁内只快照，DB.Create 放到解锁后，避免 SQLite 写拖住 store 锁
		var historyToPersist *model.MonitorHistory
		if ss.serviceCurrentStatusIndex[mh.GetId()].index == _CurrentStatusSize {
			ss.serviceCurrentStatusIndex[mh.GetId()] = &indexStore{
				index: 0,
				t:     currentTime,
			}
			historyToPersist = &model.MonitorHistory{
				MonitorID: mh.GetId(),
				AvgDelay:  ss.serviceResponseDataStoreCurrentAvgDelay[mh.GetId()],
				Data:      mh.Data,
				Up:        ss.serviceResponseDataStoreCurrentUp[mh.GetId()],
				Down:      ss.serviceResponseDataStoreCurrentDown[mh.GetId()],
			}
		}

		// 延迟报警
		if mh.Delay > 0 {
			if monitorSnapshot.LatencyNotify {
				notificationTag := monitorSnapshot.NotificationTag
				minMuteLabel := NotificationMuteLabel.ServiceLatencyMin(mh.GetId())
				maxMuteLabel := NotificationMuteLabel.ServiceLatencyMax(mh.GetId())
				if mh.Delay > monitorSnapshot.MaxLatency {
					// 延迟超过最大值
					ServerLock.RLock()
					reporterServer := ServerList[r.Reporter]
					if reporterServer != nil {
						msg := fmt.Sprintf("[Latency] %s %2f > %2f, Reporter: %s", monitorSnapshot.Name, mh.Delay, monitorSnapshot.MaxLatency, reporterServer.Name)
						go SendNotification(notificationTag, msg, minMuteLabel)
					}
					ServerLock.RUnlock()
				} else if mh.Delay < monitorSnapshot.MinLatency {
					// 延迟低于最小值
					ServerLock.RLock()
					reporterServer := ServerList[r.Reporter]
					if reporterServer != nil {
						msg := fmt.Sprintf("[Latency] %s %2f < %2f, Reporter: %s", monitorSnapshot.Name, mh.Delay, monitorSnapshot.MinLatency, reporterServer.Name)
						go SendNotification(notificationTag, msg, maxMuteLabel)
					}
					ServerLock.RUnlock()
				} else {
					// 正常延迟， 清除静音缓存
					UnMuteNotification(notificationTag, minMuteLabel)
					UnMuteNotification(notificationTag, maxMuteLabel)
				}
			}
		}

		// 状态变更报警+触发任务执行
		if stateCode == StatusDown || stateCode != ss.lastStatus[mh.GetId()] {
			ss.monitorsLock.Lock()
			lastStatus := ss.lastStatus[mh.GetId()]
			// 存储新的状态值
			ss.lastStatus[mh.GetId()] = stateCode

			// 判断是否需要发送通知
			isNeedSendNotification := monitorSnapshot.Notify && (lastStatus != 0 || stateCode == StatusDown)
			if isNeedSendNotification {
				ServerLock.RLock()

				reporterServer := ServerList[r.Reporter]
				notificationTag := monitorSnapshot.NotificationTag
				muteLabel := NotificationMuteLabel.ServiceStateChanged(mh.GetId())

				// 状态变更时，清除静音缓存
				if stateCode != lastStatus {
					UnMuteNotification(notificationTag, muteLabel)
				}

				if reporterServer != nil {
					notificationMsg := fmt.Sprintf("[%s] %s Reporter: %s, Error: %s", StatusCodeToString(stateCode), monitorSnapshot.Name, reporterServer.Name, mh.Data)
					go SendNotification(notificationTag, notificationMsg, muteLabel)
				}
				ServerLock.RUnlock()
			}

			// 判断是否需要触发任务
			isNeedTriggerTask := monitorSnapshot.EnableTriggerTask && lastStatus != 0
			if isNeedTriggerTask {
				ServerLock.RLock()
				reporterServer := ServerList[r.Reporter]
				ServerLock.RUnlock()

				if reporterServer != nil {
					if stateCode == StatusGood && lastStatus != stateCode {
						// 当前状态正常 前序状态非正常时 触发恢复任务
						go SendTriggerTasks(monitorSnapshot.RecoverTriggerTasks, reporterServer.ID)
					} else if lastStatus == StatusGood && lastStatus != stateCode {
						// 前序状态正常 当前状态非正常时 触发失败任务
						go SendTriggerTasks(monitorSnapshot.FailTriggerTasks, reporterServer.ID)
					}
				}
			}

			ss.monitorsLock.Unlock()
		}
		ss.serviceResponseDataStoreLock.Unlock()

		if historyToPersist != nil {
			if err := DB.Create(historyToPersist).Error; err != nil {
				log.Println("NEZHA>> 服务监控数据持久化失败：", err)
			}
		}

		ss.monitorsLock.RLock()
		monitorExists := ss.monitors[monitorID] != nil
		ss.monitorsLock.RUnlock()
		if !monitorExists {
			continue
		}

		// SSL 证书报警
		var errMsg string
		if strings.HasPrefix(mh.Data, "SSL证书错误：") {
			// i/o timeout、connection timeout、EOF 错误
			if !strings.HasSuffix(mh.Data, "timeout") &&
				!strings.HasSuffix(mh.Data, "EOF") &&
				!strings.HasSuffix(mh.Data, "timed out") {
				errMsg = mh.Data
				if monitorSnapshot.Notify {
					muteLabel := NotificationMuteLabel.ServiceSSL(mh.GetId(), "network")
					go SendNotification(monitorSnapshot.NotificationTag, fmt.Sprintf("[SSL] Fetch cert info failed, %s %s", monitorSnapshot.Name, errMsg), muteLabel)
				}

			}
		} else {
			// 清除网络错误静音缓存
			UnMuteNotification(monitorSnapshot.NotificationTag, NotificationMuteLabel.ServiceSSL(mh.GetId(), "network"))

			var newCert = strings.Split(mh.Data, "|")
			if len(newCert) > 1 {
				ss.monitorsLock.Lock()
				if ss.monitors[monitorID] == nil {
					ss.monitorsLock.Unlock()
					continue
				}
				enableNotify := monitorSnapshot.Notify

				// 首次获取证书信息时，缓存证书信息
				if ss.sslCertCache[mh.GetId()] == "" {
					ss.sslCertCache[mh.GetId()] = mh.Data
				}

				oldCert := strings.Split(ss.sslCertCache[mh.GetId()], "|")
				isCertChanged := false
				expiresOld, _ := time.Parse("2006-01-02 15:04:05 -0700 MST", oldCert[1])
				expiresNew, _ := time.Parse("2006-01-02 15:04:05 -0700 MST", newCert[1])

				// 证书变更时，更新缓存
				if oldCert[0] != newCert[0] && !expiresNew.Equal(expiresOld) {
					isCertChanged = true
					ss.sslCertCache[mh.GetId()] = mh.Data
				}

				notificationTag := monitorSnapshot.NotificationTag
				serviceName := monitorSnapshot.Name
				ss.monitorsLock.Unlock()

				// 需要发送提醒
				if enableNotify {
					// 证书过期提醒
					if expiresNew.Before(time.Now().AddDate(0, 0, 7)) {
						expiresTimeStr := expiresNew.Format("2006-01-02 15:04:05")
						errMsg = fmt.Sprintf(
							"The SSL certificate will expire within seven days. Expiration time: %s",
							expiresTimeStr,
						)

						// 静音规则： 服务id+证书过期时间
						// 用于避免多个监测点对相同证书同时报警
						muteLabel := NotificationMuteLabel.ServiceSSL(mh.GetId(), fmt.Sprintf("expire_%s", expiresTimeStr))
						go SendNotification(notificationTag, fmt.Sprintf("[SSL] %s %s", serviceName, errMsg), muteLabel)
					}

					// 证书变更提醒
					if isCertChanged {
						errMsg = fmt.Sprintf(
							"SSL certificate changed, old: %s, %s expired; new: %s, %s expired.",
							oldCert[0], expiresOld.Format("2006-01-02 15:04:05"), newCert[0], expiresNew.Format("2006-01-02 15:04:05"))

						// 证书变更后会自动更新缓存，所以不需要静音
						go SendNotification(notificationTag, fmt.Sprintf("[SSL] %s %s", serviceName, errMsg), nil)
					}
				}
			}
		}
	}
}

const (
	_ = iota
	StatusNoData
	StatusGood
	StatusLowAvailability
	StatusDown
)

func GetStatusCode[T float32 | uint64](percent T) int {
	if percent == 0 {
		return StatusNoData
	}
	if percent > 95 {
		return StatusGood
	}
	if percent > 80 {
		return StatusLowAvailability
	}
	return StatusDown
}

func StatusCodeToString(statusCode int) string {
	switch statusCode {
	case StatusNoData:
		return Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "StatusNoData"})
	case StatusGood:
		return Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "StatusGood"})
	case StatusLowAvailability:
		return Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "StatusLowAvailability"})
	case StatusDown:
		return Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "StatusDown"})
	default:
		return ""
	}
}
