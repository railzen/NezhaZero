package model

import (
	"time"

	"gorm.io/gorm"
)

// MonitorHistory 历史监控记录
type MonitorHistory struct {
	ID        uint64         `gorm:"primaryKey"`
	CreatedAt time.Time      `gorm:"index;<-:create;index:idx_monitor_histories_server_created_monitor_delay,priority:2,where:deleted_at IS NULL"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
	MonitorID uint64         `gorm:"index:idx_monitor_histories_server_created_monitor_delay,priority:3"`
	ServerID  uint64         `gorm:"index:idx_monitor_histories_server_created_monitor_delay,priority:1"`
	AvgDelay  float32        `gorm:"index:idx_monitor_histories_server_created_monitor_delay,priority:4"` // 平均延迟，毫秒
	Up        uint64         // 检查状态良好计数
	Down      uint64         // 检查状态异常计数
	Data      string
}
