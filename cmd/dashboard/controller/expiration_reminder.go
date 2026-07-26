package controller

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/mail"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/service/singleton"
)

type expirationReminderTestForm struct {
	model.ExpirationReminderRule
	Channel string `json:"channel"`
}

func (mp *memberPage) getExpirationReminder(c *gin.Context) {
	rules := make([]model.ExpirationReminderRule, 0)
	if err := singleton.DB.Order("id").Find(&rules).Error; err != nil {
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: err.Error()})
		return
	}
	for i := range rules {
		maskExpirationReminderSecrets(&rules[i])
	}
	c.JSON(http.StatusOK, model.Response{Code: http.StatusOK, Result: rules})
}

func (ma *memberAPI) updateExpirationReminder(c *gin.Context) {
	var rule model.ExpirationReminderRule
	if err := c.ShouldBindJSON(&rule); err != nil {
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: err.Error()})
		return
	}
	normalizeExpirationReminder(&rule)
	if err := restoreExpirationReminderSecrets(&rule); err != nil {
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: err.Error()})
		return
	}
	if err := validateExpirationReminder(rule); err != nil {
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: err.Error()})
		return
	}
	var err error
	if rule.ID == 0 {
		err = singleton.DB.Create(&rule).Error
	} else {
		var existing model.ExpirationReminderRule
		if err = singleton.DB.First(&existing, rule.ID).Error; err != nil {
			c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: err.Error()})
			return
		}
		rule.CreatedAt = existing.CreatedAt
		err = singleton.DB.Save(&rule).Error
	}
	if err != nil {
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, model.Response{Code: http.StatusOK, Message: "到期告警规则已保存"})
}

func (ma *memberAPI) testExpirationReminder(c *gin.Context) {
	var form expirationReminderTestForm
	if err := c.ShouldBindJSON(&form); err != nil {
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: err.Error()})
		return
	}
	rule := form.ExpirationReminderRule
	normalizeExpirationReminder(&rule)
	if err := restoreExpirationReminderSecrets(&rule); err != nil {
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: err.Error()})
		return
	}
	message := "Nezha 到期提醒测试：如果您收到此消息，说明通知方式配置有效。"
	var err error
	switch form.Channel {
	case "telegram":
		err = validateExpirationTelegram(rule)
		if err == nil {
			err = singleton.SendExpirationTelegram(rule, message)
		}
	case "email":
		err = validateExpirationEmail(rule)
		if err == nil {
			err = singleton.SendExpirationEmail(rule, "Nezha 到期提醒测试", message)
		}
	default:
		err = errors.New("未知的测试通知方式")
	}
	if err != nil {
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, model.Response{Code: http.StatusOK, Message: "测试通知发送成功"})
}

func maskExpirationReminderSecrets(rule *model.ExpirationReminderRule) {
	if rule.TelegramToken != "" {
		rule.TelegramToken = "********"
	}
	if rule.SMTPPassword != "" {
		rule.SMTPPassword = "********"
	}
}

func restoreExpirationReminderSecrets(rule *model.ExpirationReminderRule) error {
	if rule.TelegramToken != "********" && rule.SMTPPassword != "********" {
		return nil
	}
	if rule.ID == 0 {
		return errors.New("新增规则不能使用隐藏的凭据")
	}
	var old model.ExpirationReminderRule
	if err := singleton.DB.First(&old, rule.ID).Error; err != nil {
		return err
	}
	if rule.TelegramToken == "********" {
		rule.TelegramToken = old.TelegramToken
	}
	if rule.SMTPPassword == "********" {
		rule.SMTPPassword = old.SMTPPassword
	}
	return nil
}

func normalizeExpirationReminder(rule *model.ExpirationReminderRule) {
	rule.Name = strings.TrimSpace(rule.Name)
	rule.SkipServersRaw = strings.TrimSpace(rule.SkipServersRaw)
	if rule.SkipServersRaw == "" {
		rule.SkipServersRaw = "[]"
	}
	rule.TelegramToken = strings.TrimSpace(rule.TelegramToken)
	rule.TelegramChatID = strings.TrimSpace(rule.TelegramChatID)
	rule.SMTPHost = strings.TrimSpace(rule.SMTPHost)
	rule.SMTPUsername = strings.TrimSpace(rule.SMTPUsername)
	rule.EmailTo = strings.TrimSpace(rule.EmailTo)
	if rule.SMTPPort == 0 {
		if rule.SMTPTLS {
			rule.SMTPPort = 465
		} else {
			rule.SMTPPort = 25
		}
	}
}

func validateExpirationReminder(rule model.ExpirationReminderRule) error {
	if rule.Name == "" {
		return errors.New("规则名称不能为空")
	}
	if rule.AdvanceDays < 0 || rule.AdvanceDays > 365 {
		return errors.New("提前天数必须在 0 到 365 之间")
	}
	if rule.Cover > model.MonitorCoverIgnoreAll {
		return errors.New("覆盖范围无效")
	}
	var serverIDs []uint64
	if err := json.Unmarshal([]byte(rule.SkipServersRaw), &serverIDs); err != nil {
		return fmt.Errorf("指定服务器格式错误：%w", err)
	}
	if !rule.TelegramEnabled && !rule.EmailEnabled {
		return errors.New("至少启用一种通知方式")
	}
	if rule.TelegramEnabled {
		if err := validateExpirationTelegram(rule); err != nil {
			return err
		}
	}
	if rule.EmailEnabled {
		return validateExpirationEmail(rule)
	}
	return nil
}

func validateExpirationTelegram(rule model.ExpirationReminderRule) error {
	if rule.TelegramToken == "" || rule.TelegramChatID == "" {
		return errors.New("启用 Telegram 时必须填写 Token 和会话 ID")
	}
	return nil
}

func validateExpirationEmail(rule model.ExpirationReminderRule) error {
	if rule.SMTPHost == "" || rule.SMTPPort < 1 || rule.SMTPPort > 65535 ||
		rule.SMTPUsername == "" || rule.SMTPPassword == "" || rule.EmailTo == "" {
		return errors.New("邮件通知需要有效的 SMTP 地址、端口号、用户名、密码和目标邮件地址")
	}
	if _, err := mail.ParseAddress(rule.SMTPUsername); err != nil {
		return errors.New("SMTP 用户名必须是有效的发件邮箱地址")
	}
	if _, err := mail.ParseAddress(rule.EmailTo); err != nil {
		return errors.New("目标邮件地址格式不正确")
	}
	return nil
}
