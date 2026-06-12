package model

import (
	"time"

	"gorm.io/gorm"
)

const CtxKeyAuthorizedUser = "ckau"
const CtxKeyViewPasswordVerified = "ckvpv"
const CtxKeyPreferredTheme = "ckpt"
const CacheKeyOauth2State = "p:a:state"

type Common struct {
	ID        uint64         `gorm:"primaryKey"`
	CreatedAt time.Time      `gorm:"index;<-:create"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type Response struct {
	Code    int         `json:"code,omitempty"`
	Message string      `json:"message,omitempty"`
	Result  interface{} `json:"result,omitempty"`
}

// AuditLog 审计日志
type AuditLog struct {
	Common
	Type   string `json:"type" gorm:"index;size:32;not null"`
	Action string `json:"action" gorm:"size:128;not null"`
	Detail string `json:"detail" gorm:"size:1024"`
	IP     string `json:"ip" gorm:"size:64"`
}

// DashboardRuntime 面板运行心跳（固定单行 ID=1）
type DashboardRuntime struct {
	ID        uint64    `gorm:"primaryKey"`
	Running   bool      `gorm:"not null"`
	LastAlive time.Time
}
