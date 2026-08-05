package model

import (
	"encoding/json"
	"sort"
	"time"

	"github.com/railzen/nezha-zero/pkg/utils"
	"gorm.io/gorm"
)

// CycleTransferDBKey 标识一条周期流量规则在某服务器上的预查结果。
type CycleTransferDBKey struct {
	AlertID  uint64
	RuleIdx  int
	ServerID uint64
}

const (
	ModeAlwaysTrigger  = 0
	ModeOnetimeTrigger = 1
)

type CycleTransferStats struct {
	Name       string
	From       time.Time
	To         time.Time
	Max        uint64
	Min        uint64
	ServerName map[uint64]string
	Transfer   map[uint64]uint64
	NextUpdate map[uint64]time.Time
}

type AlertRule struct {
	Common
	Name                   string
	RulesRaw               string
	Enable                 *bool
	TriggerMode            int      `gorm:"default:0"` // 触发模式: 0-始终触发(默认) 1-单次触发
	NotificationTag        string   // 该报警规则所在的通知组
	FailTriggerTasksRaw    string   `gorm:"default:'[]'"`
	RecoverTriggerTasksRaw string   `gorm:"default:'[]'"`
	Rules                  []Rule   `gorm:"-" json:"-"`
	FailTriggerTasks       []uint64 `gorm:"-" json:"-"` // 失败时执行的触发任务id
	RecoverTriggerTasks    []uint64 `gorm:"-" json:"-"` // 恢复时执行的触发任务id
}

func (r *AlertRule) BeforeSave(tx *gorm.DB) error {
	if data, err := utils.Json.Marshal(r.Rules); err != nil {
		return err
	} else {
		r.RulesRaw = string(data)
	}
	if data, err := utils.Json.Marshal(r.FailTriggerTasks); err != nil {
		return err
	} else {
		r.FailTriggerTasksRaw = string(data)
	}
	if data, err := utils.Json.Marshal(r.RecoverTriggerTasks); err != nil {
		return err
	} else {
		r.RecoverTriggerTasksRaw = string(data)
	}
	return nil
}

func (r *AlertRule) AfterFind(tx *gorm.DB) error {
	var err error
	if err = utils.Json.Unmarshal([]byte(r.RulesRaw), &r.Rules); err != nil {
		return err
	}
	if err = utils.Json.Unmarshal([]byte(r.FailTriggerTasksRaw), &r.FailTriggerTasks); err != nil {
		return err
	}
	if err = utils.Json.Unmarshal([]byte(r.RecoverTriggerTasksRaw), &r.RecoverTriggerTasks); err != nil {
		return err
	}
	return nil
}

func (r *AlertRule) Enabled() bool {
	return r.Enable != nil && *r.Enable
}

func (r *AlertRule) IsExpirationRule() bool {
	return len(r.Rules) == 1 && r.Rules[0].Type == RuleTypeExpiration
}

func (r *AlertRule) ExpirationAdvanceDays() int {
	if !r.IsExpirationRule() {
		return 0
	}
	return r.Rules[0].AdvanceDays
}

func (r *AlertRule) ExpirationDailyReminder() bool {
	return r.IsExpirationRule() && r.Rules[0].DailyReminder
}

func (r *AlertRule) ExpirationCover() uint64 {
	if !r.IsExpirationRule() {
		return RuleCoverAll
	}
	return r.Rules[0].Cover
}

func (r *AlertRule) ExpirationServerIDs() string {
	if !r.IsExpirationRule() {
		return "[]"
	}
	ids := make([]uint64, 0, len(r.Rules[0].Ignore))
	for id := range r.Rules[0].Ignore {
		ids = append(ids, id)
	}
	sort.Slice(ids, func(i, j int) bool { return ids[i] < ids[j] })
	data, _ := json.Marshal(ids)
	return string(data)
}

// Snapshot 对传入的Server进行该报警规则下所有type的检查 返回包含每项检查结果的空接口。
// cycleFromDB 为锁外预查的周期流量合计，key 见 CycleTransferDBKey；无预查时传 nil。
// 需要查库的周期规则未命中 cycleFromDB 时（下次检查时间恰好在锁外预查窗口内到期），
// 跳过本轮评估并沿用上次结果，避免把 DB 合计当作 0 导致显示值骤降。
func (r *AlertRule) Snapshot(cycleTransferStats *CycleTransferStats, server *Server, cycleFromDB map[CycleTransferDBKey]float64) []interface{} {
	var point []interface{}
	for i := 0; i < len(r.Rules); i++ {
		key := CycleTransferDBKey{AlertID: r.ID, RuleIdx: i, ServerID: server.ID}
		fromDB, ok := cycleFromDB[key]
		if !ok && r.Rules[i].IsTransferDurationRule() && r.Rules[i].CycleInterval != 0 {
			point = append(point, r.Rules[i].LastCycleStatus[server.ID])
			continue
		}
		point = append(point, r.Rules[i].Snapshot(cycleTransferStats, server, fromDB))
	}
	return point
}

// Check 传入包含当前报警规则下所有type检查结果的空接口 返回报警持续时间与是否通过报警检查(通过则返回true)
func (r *AlertRule) Check(points [][]interface{}) (int, bool) {
	var maxNum int // 报警持续时间
	var count int  // 检查未通过的个数
	for i := 0; i < len(r.Rules); i++ {
		if r.Rules[i].IsTransferDurationRule() {
			// 循环区间流量报警
			if maxNum < 1 {
				maxNum = 1
			}
			for j := len(points[i]) - 1; j >= 0; j-- {
				if points[i][j] != nil {
					count++
					break
				}
			}
		} else {
			// 常规报警
			num := int(r.Rules[i].Duration)
			if num <= 0 {
				continue
			}
			total := 0.0
			fail := 0.0
			if num > maxNum {
				maxNum = num
			}
			if len(points) < num {
				continue
			}
			for j := len(points) - 1; j >= 0 && len(points)-num <= j; j-- {
				total++
				if points[j][i] != nil {
					fail++
				}
			}
			// 当70%以上的采样点未通过规则判断时 才认为当前检查未通过
			if fail/total > 0.7 {
				count++
				break
			}
		}
	}
	// 仅当所有检查均未通过时 返回false
	return maxNum, count != len(r.Rules)
}

// RetentionWindow 返回告警规则所需保留的最大采样数。
// 周期流量规则只需 1 个样本；常规规则需要其 Duration 定义的样本数。
func (r *AlertRule) RetentionWindow() int {
	window := 0
	for _, rule := range r.Rules {
		need := 1
		if rule.IsTransferDurationRule() {
			need = 1
		} else if d := int(rule.Duration); d > need {
			need = d
		}
		if need > window {
			window = need
		}
	}
	return window
}
