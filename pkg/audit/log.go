package audit

import (
	"fmt"
	"strconv"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/service/singleton"
)

const (
	TypeAuth     = "auth"
	TypeSecurity = "security"
	TypeConfig   = "config"
	TypeEvent    = "event"
	MaxLogs      = 1000
	PageSize     = 20
	maxDetailLen = 1024
)

type TypeOption struct {
	ID    string `json:"id"`
	Label string `json:"label"`
}

var typeLabels = map[string]string{
	TypeAuth:     "认证",
	TypeSecurity: "安全",
	TypeConfig:   "配置",
	TypeEvent:    "事件",
}

// SettingChangeInput 设置保存后的目标值（用于生成变更详情，不含敏感内容）。
type SettingChangeInput struct {
	Title                           string
	Admin                           string
	Language                        string
	Theme                           string
	DashboardTheme                  string
	CustomCodeChanged               bool
	CustomCodeDashboardChanged      bool
	ViewPasswordChanged             bool
	CustomNameservers               string
	EnableIPChangeNotification      bool
	EnablePlainIPInNotification     bool
	DisableSwitchTemplateInFrontend bool
	CompatAPIDisable                bool
	UseTemplateHandleNoRoute        bool
	DisableOauthLogin               bool
	DisablePasswordLogin            bool
	GRPCHost                        string
	GRPCDiscoverKey                 string
	Cover                           uint8
	IgnoredIPNotification           string
	IPChangeNotificationTag         string
	PasswordChanged                 bool
	TwoFactorCleared                bool
}

// TypeOptions 供筛选使用
func TypeOptions() []TypeOption {
	return []TypeOption{
		{ID: "all", Label: "全部"},
		{ID: TypeAuth, Label: typeLabels[TypeAuth]},
		{ID: TypeSecurity, Label: typeLabels[TypeSecurity]},
		{ID: TypeConfig, Label: typeLabels[TypeConfig]},
		{ID: TypeEvent, Label: typeLabels[TypeEvent]},
	}
}

// BuildSecuritySettingDetail 安全相关配置变更（登录、权限、API 边界等）。
func BuildSecuritySettingDetail(before *model.Config, in SettingChangeInput) string {
	if before == nil {
		return ""
	}
	var changes []string
	if before.Oauth2.Admin != in.Admin {
		changes = append(changes, "admin user list changed")
	}
	appendBoolChange(&changes, "OAuth login disabled", before.Oauth2.DisableOauthLogin, in.DisableOauthLogin)
	appendBoolChange(&changes, "password login disabled", before.Site.DisablePasswordLogin, in.DisablePasswordLogin)
	appendBoolChange(&changes, "compat API disabled", before.CompatAPIDisable, in.CompatAPIDisable)
	if in.ViewPasswordChanged {
		changes = append(changes, "frontend view password changed")
	}
	if in.PasswordChanged {
		changes = append(changes, "admin password changed")
	}
	if in.TwoFactorCleared {
		changes = append(changes, "two-factor authentication cleared (password login disabled)")
	}
	return joinChanges(changes)
}

// BuildConfigSettingDetail 非安全类站点配置变更。
func BuildConfigSettingDetail(before *model.Config, in SettingChangeInput) string {
	if before == nil {
		return ""
	}
	var changes []string
	appendStrChange(&changes, "site title", before.Site.Brand, in.Title)
	appendStrChange(&changes, "language", before.Language, in.Language)
	appendStrChange(&changes, "frontend theme", before.Site.Theme, in.Theme)
	appendStrChange(&changes, "dashboard theme", before.Site.DashboardTheme, in.DashboardTheme)
	appendStrChange(&changes, "gRPC host", before.GRPCHost, in.GRPCHost)
	if before.GRPCDiscoverKey != in.GRPCDiscoverKey {
		changes = append(changes, "gRPC discover key changed")
	}
	appendStrChange(&changes, "DNS servers", before.DNSServers, in.CustomNameservers)
	appendStrChange(&changes, "ignored IPs for notification", before.IgnoredIPNotification, in.IgnoredIPNotification)
	appendStrChange(&changes, "IP change notification tag", before.IPChangeNotificationTag, in.IPChangeNotificationTag)
	appendUint8Change(&changes, "notification cover mode", before.Cover, in.Cover)
	appendBoolChange(&changes, "IP change notification", before.EnableIPChangeNotification, in.EnableIPChangeNotification)
	appendBoolChange(&changes, "plain IP in notification", before.EnablePlainIPInNotification, in.EnablePlainIPInNotification)
	appendBoolChange(&changes, "disable frontend theme switch", before.DisableSwitchTemplateInFrontend, in.DisableSwitchTemplateInFrontend)
	appendBoolChange(&changes, "template 404 handler", before.UseTemplateHandleNoRoute, in.UseTemplateHandleNoRoute)
	if in.CustomCodeChanged {
		changes = append(changes, "frontend custom code modified")
	}
	if in.CustomCodeDashboardChanged {
		changes = append(changes, "dashboard custom code modified")
	}
	return joinChanges(changes)
}

func joinChanges(changes []string) string {
	if len(changes) == 0 {
		return ""
	}
	return strings.Join(changes, "; ")
}

// Record 写入一条审计日志（忽略写入错误，避免影响主流程）。
func Record(c *gin.Context, typ, action, detail string) {
	if singleton.DB == nil {
		return
	}
	ip := ""
	if c != nil {
		ip = c.ClientIP()
	}
	if err := singleton.DB.Create(&model.AuditLog{
		Type:   typ,
		Action: capitalizeFirst(action),
		Detail: trimDetail(capitalizeFirst(detail)),
		IP:     ip,
	}).Error; err != nil {
		return
	}
	PruneExcess()
}

// PruneExcess 删除超出上限的最旧日志。
func PruneExcess() {
	var count int64
	singleton.DB.Model(&model.AuditLog{}).Count(&count)
	if count <= MaxLogs {
		return
	}
	excess := int(count - MaxLogs)
	var oldest []model.AuditLog
	singleton.DB.Order("created_at ASC").Limit(excess).Find(&oldest)
	if len(oldest) == 0 {
		return
	}
	ids := make([]uint64, len(oldest))
	for i, entry := range oldest {
		ids[i] = entry.ID
	}
	_ = singleton.DB.Unscoped().Delete(&model.AuditLog{}, ids).Error
}

func appendStrChange(changes *[]string, name, oldVal, newVal string) {
	if oldVal == newVal {
		return
	}
	*changes = append(*changes, fmt.Sprintf("%s: %q -> %q", name, oldVal, newVal))
}

func appendBoolChange(changes *[]string, name string, oldVal, newVal bool) {
	if oldVal == newVal {
		return
	}
	*changes = append(*changes, fmt.Sprintf("%s: %s -> %s", name, boolWord(oldVal), boolWord(newVal)))
}

func appendUint8Change(changes *[]string, name string, oldVal, newVal uint8) {
	if oldVal == newVal {
		return
	}
	*changes = append(*changes, fmt.Sprintf("%s: %s -> %s", name, strconv.FormatUint(uint64(oldVal), 10), strconv.FormatUint(uint64(newVal), 10)))
}

func boolWord(v bool) string {
	if v {
		return "enabled"
	}
	return "disabled"
}

func capitalizeFirst(s string) string {
	s = strings.TrimSpace(s)
	if s == "" {
		return s
	}
	r := []rune(s)
	r[0] = unicode.ToUpper(r[0])
	return string(r)
}

func trimDetail(s string) string {
	if len(s) <= maxDetailLen {
		return s
	}
	return s[:maxDetailLen-3] + "..."
}
