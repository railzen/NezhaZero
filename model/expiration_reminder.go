package model

import (
	"time"

	"gorm.io/gorm"
)

type ExpirationReminderRule struct {
	ID              uint64         `json:"id" gorm:"primaryKey"`
	CreatedAt       time.Time      `json:"-"`
	UpdatedAt       time.Time      `json:"-"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
	Name            string         `json:"name"`
	AdvanceDays     int            `json:"advance_days"`
	DailyReminder   bool           `json:"daily_reminder" gorm:"default:false"`
	Cover           uint8          `json:"cover"`
	SkipServersRaw  string         `json:"skip_servers_raw" gorm:"default:'[]'"`
	TelegramEnabled bool           `json:"telegram_enabled"`
	TelegramToken   string         `json:"telegram_token"`
	TelegramChatID  string         `json:"telegram_chat_id"`
	EmailEnabled    bool           `json:"email_enabled"`
	SMTPHost        string         `json:"smtp_host"`
	SMTPPort        int            `json:"smtp_port"`
	SMTPTLS         bool           `json:"smtp_tls"`
	SMTPUsername    string         `json:"smtp_username"`
	SMTPPassword    string         `json:"smtp_password"`
	EmailTo         string         `json:"email_to"`
}

func (ExpirationReminderRule) TableName() string {
	return "expiration_reminder_rules"
}
