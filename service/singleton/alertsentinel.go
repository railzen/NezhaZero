package singleton

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/jinzhu/copier"
	"github.com/nicksnyder/go-i18n/v2/i18n"

	"github.com/railzen/nezha-zero/model"
)

const (
	_RuleCheckNoData = iota
	_RuleCheckFail
	_RuleCheckPass
)

type NotificationHistory struct {
	Duration time.Duration
	Until    time.Time
}

// 报警规则
var (
	AlertsLock                    sync.RWMutex
	Alerts                        []*model.AlertRule
	alertsStore                   map[uint64]map[uint64][][]interface{} // [alert_id][server_id] -> 对应报警规则的检查结果
	alertsPrevState               map[uint64]map[uint64]uint            // [alert_id][server_id] -> 对应报警规则的上一次报警状态
	AlertsCycleTransferStatsStore map[uint64]*model.CycleTransferStats  // [alert_id] -> 对应报警规则的周期流量统计
)

// addCycleTransferStatsInfo 向AlertsCycleTransferStatsStore中添加周期流量报警统计信息
func addCycleTransferStatsInfo(alert *model.AlertRule) {
	if !alert.Enabled() {
		return
	}
	for j := 0; j < len(alert.Rules); j++ {
		if !alert.Rules[j].IsTransferDurationRule() {
			continue
		}
		if AlertsCycleTransferStatsStore[alert.ID] == nil {
			from := alert.Rules[j].GetTransferDurationStart()
			to := alert.Rules[j].GetTransferDurationEnd()
			AlertsCycleTransferStatsStore[alert.ID] = &model.CycleTransferStats{
				Name:       alert.Name,
				From:       from,
				To:         to,
				Max:        uint64(alert.Rules[j].Max),
				Min:        uint64(alert.Rules[j].Min),
				ServerName: make(map[uint64]string),
				Transfer:   make(map[uint64]uint64),
				NextUpdate: make(map[uint64]time.Time),
			}
		}
	}
}

// AlertSentinelStart 报警器启动
func AlertSentinelStart() {
	alertsStore = make(map[uint64]map[uint64][][]interface{})
	alertsPrevState = make(map[uint64]map[uint64]uint)
	AlertsCycleTransferStatsStore = make(map[uint64]*model.CycleTransferStats)
	AlertsLock.Lock()
	var loadedAlerts []*model.AlertRule
	if err := DB.Find(&loadedAlerts).Error; err != nil {
		panic(err)
	}
	Alerts = Alerts[:0]
	for _, alert := range loadedAlerts {
		if alert.IsExpirationRule() {
			continue
		}
		Alerts = append(Alerts, alert)
		// 旧版本可能不存在通知组 为其添加默认值
		if alert.NotificationTag == "" {
			alert.NotificationTag = "default"
			DB.Save(alert)
		}
		alertsStore[alert.ID] = make(map[uint64][][]interface{})
		alertsPrevState[alert.ID] = make(map[uint64]uint)
		addCycleTransferStatsInfo(alert)
	}
	AlertsLock.Unlock()

	time.Sleep(time.Second * 10)
	var lastPrint time.Time
	var checkCount uint64
	for {
		startedAt := time.Now()
		checkStatus()
		checkCount++
		if lastPrint.Before(startedAt.Add(-1 * time.Hour)) {
			if Conf.Debug {
				log.Println("NEZHA>> 报警规则检测每小时", checkCount, "次", startedAt, time.Now())
			}
			checkCount = 0
			lastPrint = startedAt
		}
		time.Sleep(time.Until(startedAt.Add(time.Second * 5))) // 5秒钟检查一次
	}
}

func OnRefreshOrAddAlert(alert model.AlertRule) {
	AlertsLock.Lock()
	defer AlertsLock.Unlock()
	delete(alertsStore, alert.ID)
	delete(alertsPrevState, alert.ID)
	delete(AlertsCycleTransferStatsStore, alert.ID)
	var isEdit bool
	for i := 0; i < len(Alerts); i++ {
		if Alerts[i].ID == alert.ID {
			if alert.IsExpirationRule() {
				Alerts = append(Alerts[:i], Alerts[i+1:]...)
			} else {
				Alerts[i] = &alert
			}
			isEdit = true
			break
		}
	}
	if alert.IsExpirationRule() {
		return
	}
	if !isEdit {
		Alerts = append(Alerts, &alert)
	}
	alertsStore[alert.ID] = make(map[uint64][][]interface{})
	alertsPrevState[alert.ID] = make(map[uint64]uint)
	addCycleTransferStatsInfo(&alert)
}

func OnDeleteAlert(id uint64) {
	AlertsLock.Lock()
	defer AlertsLock.Unlock()
	delete(alertsStore, id)
	delete(alertsPrevState, id)
	for i := 0; i < len(Alerts); i++ {
		if Alerts[i].ID == id {
			Alerts = append(Alerts[:i], Alerts[i+1:]...)
			i--
		}
	}
	delete(AlertsCycleTransferStatsStore, id)
}

type cycleTransferQuery struct {
	key   model.CycleTransferDBKey
	sel   string
	since time.Time
}

// collectCycleTransferQueries 在持锁期间收集本轮需要查库的周期流量项（不执行 DB）。
func collectCycleTransferQueries() []cycleTransferQuery {
	var queries []cycleTransferQuery
	now := time.Now()
	for _, alert := range Alerts {
		if !alert.Enabled() {
			continue
		}
		for ruleIdx := range alert.Rules {
			rule := &alert.Rules[ruleIdx]
			if !rule.IsTransferDurationRule() || rule.CycleInterval == 0 {
				continue
			}
			for _, server := range ServerList {
				if rule.Cover == model.RuleCoverAll && rule.Ignore[server.ID] {
					continue
				}
				if rule.Cover == model.RuleCoverIgnoreAll && !rule.Ignore[server.ID] {
					continue
				}
				if rule.NextTransferAt[server.ID].After(now) {
					continue
				}
				var sel string
				switch rule.Type {
				case "transfer_in_cycle":
					sel = "SUM(`in`) AS n"
				case "transfer_out_cycle":
					sel = "SUM(`out`) AS n"
				case "transfer_all_cycle":
					sel = "SUM(`in`+`out`) AS n"
				default:
					continue
				}
				queries = append(queries, cycleTransferQuery{
					key: model.CycleTransferDBKey{
						AlertID:  alert.ID,
						RuleIdx:  ruleIdx,
						ServerID: server.ID,
					},
					sel:   sel,
					since: rule.GetTransferDurationStart().UTC(),
				})
			}
		}
	}
	return queries
}

func fetchCycleTransferFromDB(queries []cycleTransferQuery) map[model.CycleTransferDBKey]float64 {
	if len(queries) == 0 {
		return nil
	}
	out := make(map[model.CycleTransferDBKey]float64, len(queries))
	for _, q := range queries {
		var res model.NResult
		DB.Model(&model.Transfer{}).Select(q.sel).
			Where("datetime(`created_at`) >= datetime(?) AND server_id = ?", q.since, q.key.ServerID).
			Scan(&res)
		out[q.key] = float64(res.N)
	}
	return out
}

// checkStatus 检查报警规则并发送报警
func checkStatus() {
	// 锁顺序：ServerLock → AlertsLock，与 onServerDelete 一致，避免 AB-BA 死锁。
	// 周期流量 DB 查询在锁外执行，避免 SQLite 拖住全局锁。
	ServerLock.RLock()
	AlertsLock.Lock()
	queries := collectCycleTransferQueries()
	AlertsLock.Unlock()
	ServerLock.RUnlock()

	cycleFromDB := fetchCycleTransferFromDB(queries)

	ServerLock.RLock()
	defer ServerLock.RUnlock()
	AlertsLock.Lock()
	defer AlertsLock.Unlock()

	for _, alert := range Alerts {
		// 跳过未启用
		if !alert.Enabled() {
			continue
		}
		for _, server := range ServerList {
			// 监测点
			alertsStore[alert.ID][server.ID] = append(alertsStore[alert.
				ID][server.ID], alert.Snapshot(AlertsCycleTransferStatsStore[alert.ID], server, cycleFromDB))
			// 发送通知，分为触发报警和恢复通知
			_, passed := alert.Check(alertsStore[alert.ID][server.ID])
			// 保存当前服务器状态信息
			curServer := model.Server{}
			copier.Copy(&curServer, server)
			curServer.CopyFromRunningServer(server)
			serverIP := ""
			if curServer.Host != nil {
				serverIP = curServer.Host.IP
			}

			// 本次未通过检查
			if !passed {
				// 始终触发模式或上次检查不为失败时触发报警（跳过单次触发+上次失败的情况）
				if alert.TriggerMode == model.ModeAlwaysTrigger || alertsPrevState[alert.ID][server.ID] != _RuleCheckFail {
					alertsPrevState[alert.ID][server.ID] = _RuleCheckFail
					message := fmt.Sprintf("[%s] %s(%s) %s", Localizer.MustLocalize(&i18n.LocalizeConfig{
						MessageID: "Incident",
					}), server.Name, IPDesensitize(serverIP), alert.Name)
					go SendTriggerTasks(alert.FailTriggerTasks, curServer.ID)
					go SendNotification(alert.NotificationTag, message, NotificationMuteLabel.ServerIncident(server.ID, alert.ID), &curServer)
					// 清除恢复通知的静音缓存
					UnMuteNotification(alert.NotificationTag, NotificationMuteLabel.ServerIncidentResolved(server.ID, alert.ID))
				}
			} else {
				// 本次通过检查但上一次的状态为失败，则发送恢复通知
				if alertsPrevState[alert.ID][server.ID] == _RuleCheckFail {
					message := fmt.Sprintf("[%s] %s(%s) %s", Localizer.MustLocalize(&i18n.LocalizeConfig{
						MessageID: "Resolved",
					}), server.Name, IPDesensitize(serverIP), alert.Name)
					go SendTriggerTasks(alert.RecoverTriggerTasks, curServer.ID)
					go SendNotification(alert.NotificationTag, message, NotificationMuteLabel.ServerIncidentResolved(server.ID, alert.ID), &curServer)
					// 清除失败通知的静音缓存
					UnMuteNotification(alert.NotificationTag, NotificationMuteLabel.ServerIncident(server.ID, alert.ID))
				}
				alertsPrevState[alert.ID][server.ID] = _RuleCheckPass
			}
			// 清理旧数据：按规则定义的窗口截断，窗口为 0 时清空历史避免泄漏
			window := alert.RetentionWindow()
			if window > 0 {
				n := len(alertsStore[alert.ID][server.ID]) - window
				if n < 0 {
					n = 0
				}
				alertsStore[alert.ID][server.ID] = alertsStore[alert.ID][server.ID][n:]
			} else {
				alertsStore[alert.ID][server.ID] = nil
			}
		}
	}
}
