package controller

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/audit"
	"github.com/railzen/nezha-zero/pkg/mygin"
	processutil "github.com/railzen/nezha-zero/pkg/process"
	"github.com/railzen/nezha-zero/pkg/totp"
	"github.com/railzen/nezha-zero/pkg/utils"
	"github.com/railzen/nezha-zero/resource"
	"github.com/railzen/nezha-zero/service/singleton"
)

const (
	portableBackupFormat  = "nezha-portable-backup"
	portableBackupVersion = 1
	portableBackupMaxSize = 8 << 20
	portableRestartDelay  = "NZ_SELF_RESTART_DELAY_MS"
)

func requestDashboardRestart() {
	time.AfterFunc(1500*time.Millisecond, func() {
		if runtime.GOOS == "windows" {
			if err := restartDashboardProcess(2500 * time.Millisecond); err == nil {
				os.Exit(0)
			}
			return
		}

		process, err := os.FindProcess(os.Getpid())
		if err == nil {
			_ = process.Signal(os.Interrupt)
		}
	})
}

func WaitForPortableBackupRestart() {
	delayText := os.Getenv(portableRestartDelay)
	if delayText == "" {
		return
	}
	_ = os.Unsetenv(portableRestartDelay)
	delay, err := time.ParseDuration(delayText + "ms")
	if err == nil && delay > 0 && delay <= 30*time.Second {
		time.Sleep(delay)
	}
}

func RestartDashboardAfterPortableImport() error {
	return restartDashboardProcess(0)
}

func restartDashboardProcess(delay time.Duration) error {
	executable, err := os.Executable()
	if err != nil {
		return err
	}
	env := os.Environ()
	if delay > 0 {
		env = append(env, portableRestartDelay+"="+strconv.FormatInt(delay.Milliseconds(), 10))
	}
	return processutil.Replace(executable, os.Args, env)
}

type portableBackup struct {
	Format     string               `json:"format"`
	Version    int                  `json:"version"`
	ExportedAt time.Time            `json:"exported_at"`
	Config     portableBackupConfig `json:"config"`
	Data       portableBackupData   `json:"data"`
}

// portableBackupConfig intentionally contains only portable site behavior.
// Authentication, listening ports, TLS, OAuth and other deployment
// settings remain owned by the destination installation.
type portableBackupConfig struct {
	Language                        string `json:"language"`
	GRPCDiscoverKey                 string `json:"grpc_discover_key"`
	SiteBrand                       string `json:"site_brand"`
	Theme                           string `json:"theme"`
	DashboardTheme                  string `json:"dashboard_theme"`
	CustomCode                      string `json:"custom_code"`
	CustomCodeDashboard             string `json:"custom_code_dashboard"`
	EnablePlainIPInNotification     bool   `json:"enable_plain_ip_in_notification"`
	DisableSwitchTemplateInFrontend bool   `json:"disable_switch_template_in_frontend"`
	CompatAPIDisable                bool   `json:"compat_api_disable"`
	UseTemplateHandleNoRoute        bool   `json:"use_template_handle_no_route"`
	EnableIPChangeNotification      bool   `json:"enable_ip_change_notification"`
	IPChangeNotificationTag         string `json:"ip_change_notification_tag"`
	Cover                           uint8  `json:"cover"`
	IgnoredIPNotification           string `json:"ignored_ip_notification"`
}

type portableBackupData struct {
	Servers       []portableServer       `json:"servers"`
	Notifications []portableNotification `json:"notifications"`
	AlertRules    []portableAlertRule    `json:"alert_rules"`
	Monitors      []portableMonitor      `json:"monitors"`
	Crons         []portableCron         `json:"crons"`
	NATs          []portableNAT          `json:"nats"`
	DDNSProfiles  []portableDDNSProfile  `json:"ddns_profiles"`
}

type portableServer struct {
	ID              uint64    `json:"id"`
	CreatedAt       time.Time `json:"created_at"`
	Name            string    `json:"name"`
	Tag             string    `json:"tag"`
	Secret          string    `json:"secret"`
	Note            string    `json:"note"`
	PublicNote      string    `json:"public_note"`
	DisplayIndex    int       `json:"display_index"`
	HideForGuest    bool      `json:"hide_for_guest"`
	EnableDDNS      bool      `json:"enable_ddns"`
	DDNSProfilesRaw string    `json:"ddns_profiles_raw" gorm:"column:ddns_profiles_raw"`
}

type portableNotification struct {
	ID            uint64    `json:"id"`
	CreatedAt     time.Time `json:"created_at"`
	Name          string    `json:"name"`
	Tag           string    `json:"tag"`
	URL           string    `json:"url"`
	RequestMethod int       `json:"request_method"`
	RequestType   int       `json:"request_type"`
	RequestHeader string    `json:"request_header"`
	RequestBody   string    `json:"request_body"`
	VerifySSL     *bool     `json:"verify_ssl"`
}

type portableAlertRule struct {
	ID                     uint64    `json:"id"`
	CreatedAt              time.Time `json:"created_at"`
	Name                   string    `json:"name"`
	RulesRaw               string    `json:"rules_raw"`
	Enable                 *bool     `json:"enable"`
	TriggerMode            int       `json:"trigger_mode"`
	NotificationTag        string    `json:"notification_tag"`
	FailTriggerTasksRaw    string    `json:"fail_trigger_tasks_raw"`
	RecoverTriggerTasksRaw string    `json:"recover_trigger_tasks_raw"`
}

type portableMonitor struct {
	ID                     uint64    `json:"id"`
	CreatedAt              time.Time `json:"created_at"`
	Name                   string    `json:"name"`
	Type                   uint8     `json:"type"`
	Target                 string    `json:"target"`
	SkipServersRaw         string    `json:"skip_servers_raw"`
	Duration               uint64    `json:"duration"`
	Notify                 bool      `json:"notify"`
	NotificationTag        string    `json:"notification_tag"`
	Cover                  uint8     `json:"cover"`
	EnableTriggerTask      bool      `json:"enable_trigger_task"`
	EnableShowInService    bool      `json:"enable_show_in_service"`
	FailTriggerTasksRaw    string    `json:"fail_trigger_tasks_raw"`
	RecoverTriggerTasksRaw string    `json:"recover_trigger_tasks_raw"`
	MinLatency             float32   `json:"min_latency"`
	MaxLatency             float32   `json:"max_latency"`
	LatencyNotify          bool      `json:"latency_notify"`
}

type portableCron struct {
	ID              uint64    `json:"id"`
	CreatedAt       time.Time `json:"created_at"`
	Name            string    `json:"name"`
	TaskType        uint8     `json:"task_type"`
	Scheduler       string    `json:"scheduler"`
	Command         string    `json:"command"`
	PushSuccessful  bool      `json:"push_successful"`
	NotificationTag string    `json:"notification_tag"`
	Cover           uint8     `json:"cover"`
	ServersRaw      string    `json:"servers_raw"`
}

type portableNAT struct {
	ID        uint64    `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Name      string    `json:"name"`
	ServerID  uint64    `json:"server_id"`
	Host      string    `json:"host"`
	Domain    string    `json:"domain"`
}

type portableDDNSProfile struct {
	ID                 uint64    `json:"id"`
	CreatedAt          time.Time `json:"created_at"`
	EnableIPv4         *bool     `json:"enable_ipv4"`
	EnableIPv6         *bool     `json:"enable_ipv6"`
	MaxRetries         uint64    `json:"max_retries"`
	Name               string    `json:"name"`
	Provider           uint8     `json:"provider"`
	AccessID           string    `json:"access_id"`
	AccessSecret       string    `json:"access_secret"`
	WebhookURL         string    `json:"webhook_url"`
	WebhookMethod      uint8     `json:"webhook_method"`
	WebhookRequestType uint8     `json:"webhook_request_type"`
	WebhookRequestBody string    `json:"webhook_request_body"`
	WebhookHeaders     string    `json:"webhook_headers"`
	DomainsRaw         string    `json:"domains_raw"`
}

func portableConfigFromCurrent() portableBackupConfig {
	c := singleton.Conf
	return portableBackupConfig{
		Language:                        c.Language,
		GRPCDiscoverKey:                 c.GRPCDiscoverKey,
		SiteBrand:                       c.Site.Brand,
		Theme:                           c.Site.Theme,
		DashboardTheme:                  c.Site.DashboardTheme,
		CustomCode:                      c.Site.CustomCode,
		CustomCodeDashboard:             c.Site.CustomCodeDashboard,
		EnablePlainIPInNotification:     c.EnablePlainIPInNotification,
		DisableSwitchTemplateInFrontend: c.DisableSwitchTemplateInFrontend,
		CompatAPIDisable:                c.CompatAPIDisable,
		UseTemplateHandleNoRoute:        c.UseTemplateHandleNoRoute,
		EnableIPChangeNotification:      c.EnableIPChangeNotification,
		IPChangeNotificationTag:         c.IPChangeNotificationTag,
		Cover:                           c.Cover,
		IgnoredIPNotification:           c.IgnoredIPNotification,
	}
}

func applyPortableConfig(dst *model.Config, src portableBackupConfig) {
	dst.Language = src.Language
	dst.GRPCDiscoverKey = src.GRPCDiscoverKey
	dst.Site.Brand = src.SiteBrand
	dst.Site.Theme = src.Theme
	dst.Site.DashboardTheme = src.DashboardTheme
	dst.Site.CustomCode = src.CustomCode
	dst.Site.CustomCodeDashboard = src.CustomCodeDashboard
	dst.EnablePlainIPInNotification = src.EnablePlainIPInNotification
	dst.DisableSwitchTemplateInFrontend = src.DisableSwitchTemplateInFrontend
	dst.CompatAPIDisable = src.CompatAPIDisable
	dst.UseTemplateHandleNoRoute = src.UseTemplateHandleNoRoute
	dst.EnableIPChangeNotification = src.EnableIPChangeNotification
	dst.IPChangeNotificationTag = strings.TrimSpace(src.IPChangeNotificationTag)
	if dst.IPChangeNotificationTag == "" {
		dst.IPChangeNotificationTag = "default"
	}
	dst.Cover = src.Cover
	dst.IgnoredIPNotification = src.IgnoredIPNotification
}

func (ma *memberAPI) exportPortableBackup(c *gin.Context) {
	if !verifyPortableBackupTwoFactor(c, c.PostForm("two_factor_code"), "export") {
		return
	}

	backup, err := buildPortableBackup(singleton.DB)
	if err != nil {
		audit.Record(c, audit.TypeEvent, "Portable backup export failed", err.Error())
		c.JSON(http.StatusOK, model.Response{Code: http.StatusInternalServerError, Message: "导出失败：" + err.Error()})
		return
	}
	data, err := json.Marshal(backup)
	if err != nil {
		audit.Record(c, audit.TypeEvent, "Portable backup export failed", err.Error())
		c.JSON(http.StatusOK, model.Response{Code: http.StatusInternalServerError, Message: "导出失败：" + err.Error()})
		return
	}

	audit.Record(c, audit.TypeConfig, "Portable backup exported", portableBackupSummary(backup))
	c.Header("Cache-Control", "no-store")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=nezha-backup-%s.json", time.Now().Format("060102-150405")))
	// Error responses use application/json. Keep successful downloads on a
	// distinct MIME type so the browser can reliably distinguish the backup
	// attachment from a JSON error envelope.
	c.Data(http.StatusOK, "application/octet-stream", data)
}

func (ma *memberAPI) importPortableBackup(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, portableBackupMaxSize)
	if err := c.Request.ParseMultipartForm(portableBackupMaxSize); err != nil {
		audit.Record(c, audit.TypeConfig, "Portable backup import failed", "invalid or oversized request")
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: "导入文件无效或超过 8 MiB"})
		return
	}
	if !verifyPortableBackupTwoFactor(c, c.PostForm("two_factor_code"), "import") {
		return
	}

	file, _, err := c.Request.FormFile("file")
	if err != nil {
		audit.Record(c, audit.TypeConfig, "Portable backup import failed", "backup file is missing")
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: "请选择备份文件"})
		return
	}
	defer file.Close()

	backup, err := decodePortableBackup(io.LimitReader(file, portableBackupMaxSize+1))
	if err != nil {
		audit.Record(c, audit.TypeConfig, "Portable backup import failed", "validation failed: "+err.Error())
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: "备份校验失败：" + err.Error()})
		return
	}

	if err := replacePortableData(backup); err != nil {
		audit.Record(c, audit.TypeEvent, "Portable backup import failed", err.Error())
		c.JSON(http.StatusOK, model.Response{Code: http.StatusInternalServerError, Message: "导入失败：" + err.Error()})
		return
	}

	// Sessions and API tokens are deliberately not portable. Clear their
	// in-memory representation immediately; the remaining business caches are
	// rebuilt by the required dashboard restart.
	singleton.ApiLock.Lock()
	singleton.ApiTokenList = make(map[string]*model.ApiToken)
	singleton.UserIDToApiTokenList = make(map[uint64][]string)
	singleton.ApiLock.Unlock()
	mygin.ClearSessionCookies(c)

	singleton.MarkPortableImportRestart()
	audit.Record(c, audit.TypeConfig, "Portable backup imported", portableBackupSummary(backup)+", automatic restart scheduled")
	c.JSON(http.StatusOK, model.Response{
		Code:    http.StatusOK,
		Message: "导入成功，Dashboard 正在自动重启",
		Result: map[string]bool{
			"restart_required": true,
			"auto_restart":     true,
		},
	})
	requestDashboardRestart()
}

func verifyPortableBackupTwoFactor(c *gin.Context, code, action string) bool {
	if !singleton.Conf.TwoFactorActive() {
		return true
	}
	if !allowAuthRateLimitedCheck() {
		c.JSON(http.StatusOK, model.Response{Code: http.StatusTooManyRequests, Message: "请求过于频繁，请稍后再试"})
		return false
	}
	code = strings.TrimSpace(code)
	if code == "" || !totp.Validate(singleton.Conf.Site.TwoFactorSecret, code, 1) {
		audit.Record(c, audit.TypeSecurity, "Portable backup "+action+" failed", "invalid two-factor code")
		c.JSON(http.StatusOK, model.Response{Code: http.StatusBadRequest, Message: "双重验证码错误，请重试"})
		return false
	}
	return true
}

func buildPortableBackup(db *gorm.DB) (portableBackup, error) {
	b := portableBackup{
		Format:     portableBackupFormat,
		Version:    portableBackupVersion,
		ExportedAt: time.Now().UTC(),
		Config:     portableConfigFromCurrent(),
	}
	queries := []struct {
		name string
		dst  interface{}
	}{
		{"servers", &b.Data.Servers},
		{"notifications", &b.Data.Notifications},
		{"alert_rules", &b.Data.AlertRules},
		{"monitors", &b.Data.Monitors},
		{"crons", &b.Data.Crons},
		{"nats", &b.Data.NATs},
		{"ddns", &b.Data.DDNSProfiles},
	}
	for _, query := range queries {
		if err := db.Table(query.name).Where("deleted_at IS NULL").Order("id ASC").Find(query.dst).Error; err != nil {
			return portableBackup{}, fmt.Errorf("read %s: %w", query.name, err)
		}
	}
	return b, nil
}

func decodePortableBackup(r io.Reader) (portableBackup, error) {
	decoder := json.NewDecoder(r)
	decoder.DisallowUnknownFields()
	var b portableBackup
	if err := decoder.Decode(&b); err != nil {
		return portableBackup{}, err
	}
	if err := ensureJSONEOF(decoder); err != nil {
		return portableBackup{}, err
	}
	if err := validatePortableBackup(b); err != nil {
		return portableBackup{}, err
	}
	return b, nil
}

func ensureJSONEOF(decoder *json.Decoder) error {
	var extra interface{}
	if err := decoder.Decode(&extra); errors.Is(err, io.EOF) {
		return nil
	} else if err != nil {
		return err
	}
	return errors.New("JSON 文件包含多余内容")
}

func validatePortableBackup(b portableBackup) error {
	if b.Format != portableBackupFormat || b.Version != portableBackupVersion {
		return fmt.Errorf("不支持的备份格式或版本 %q/%d", b.Format, b.Version)
	}
	if _, ok := model.Languages[b.Config.Language]; !ok {
		return fmt.Errorf("不支持的语言 %q", b.Config.Language)
	}
	if _, ok := model.Themes[b.Config.Theme]; !ok {
		return fmt.Errorf("不存在的前台主题 %q", b.Config.Theme)
	}
	if _, ok := model.DashboardThemes[b.Config.DashboardTheme]; !ok {
		return fmt.Errorf("不存在的后台主题 %q", b.Config.DashboardTheme)
	}
	if !utils.IsFileExists("resource/template/theme-"+b.Config.Theme+"/home.html") &&
		!resource.IsTemplateFileExist("template/theme-"+b.Config.Theme+"/home.html") {
		return fmt.Errorf("前台主题文件不存在 %q", b.Config.Theme)
	}
	if !utils.IsFileExists("resource/template/dashboard-"+b.Config.DashboardTheme+"/setting.html") &&
		!resource.IsTemplateFileExist("template/dashboard-"+b.Config.DashboardTheme+"/setting.html") {
		return fmt.Errorf("后台主题文件不存在 %q", b.Config.DashboardTheme)
	}
	if b.Config.Cover > model.ConfigCoverIgnoreAll {
		return errors.New("IP 变更提醒覆盖范围无效")
	}
	if b.Config.CompatAPIDisable && model.IsV1Theme(b.Config.Theme) {
		return errors.New("禁用兼容 API 时不能导入 V1 主题")
	}

	serverIDs, err := uniquePortableIDs("服务器", len(b.Data.Servers), func(i int) uint64 { return b.Data.Servers[i].ID })
	if err != nil {
		return err
	}
	ddnsIDs, err := uniquePortableIDs("DDNS 配置", len(b.Data.DDNSProfiles), func(i int) uint64 { return b.Data.DDNSProfiles[i].ID })
	if err != nil {
		return err
	}
	for name, countAndID := range map[string]struct {
		count int
		id    func(int) uint64
	}{
		"通知方式":   {len(b.Data.Notifications), func(i int) uint64 { return b.Data.Notifications[i].ID }},
		"告警规则":   {len(b.Data.AlertRules), func(i int) uint64 { return b.Data.AlertRules[i].ID }},
		"服务监控":   {len(b.Data.Monitors), func(i int) uint64 { return b.Data.Monitors[i].ID }},
		"计划任务":   {len(b.Data.Crons), func(i int) uint64 { return b.Data.Crons[i].ID }},
		"NAT 配置": {len(b.Data.NATs), func(i int) uint64 { return b.Data.NATs[i].ID }},
	} {
		if _, err := uniquePortableIDs(name, countAndID.count, countAndID.id); err != nil {
			return err
		}
	}

	secrets := make(map[string]uint64, len(b.Data.Servers))
	for _, server := range b.Data.Servers {
		secret := strings.TrimSpace(server.Secret)
		if secret == "" {
			return fmt.Errorf("服务器 %d 的密钥为空", server.ID)
		}
		if previous, exists := secrets[secret]; exists {
			return fmt.Errorf("服务器 %d 与 %d 使用了重复密钥", previous, server.ID)
		}
		secrets[secret] = server.ID
		var profiles []uint64
		if err := decodeJSONArray("服务器 DDNS 配置", server.ID, server.DDNSProfilesRaw, &profiles); err != nil {
			return err
		}
		for _, id := range profiles {
			if _, ok := ddnsIDs[id]; !ok {
				return fmt.Errorf("服务器 %d 引用了不存在的 DDNS 配置 %d", server.ID, id)
			}
		}
	}

	domains := make(map[string]uint64, len(b.Data.NATs))
	for _, nat := range b.Data.NATs {
		if _, ok := serverIDs[nat.ServerID]; !ok {
			return fmt.Errorf("NAT 配置 %d 引用了不存在的服务器 %d", nat.ID, nat.ServerID)
		}
		domain := strings.ToLower(strings.TrimSpace(nat.Domain))
		if domain == "" {
			return fmt.Errorf("NAT 配置 %d 的域名为空", nat.ID)
		}
		if previous, exists := domains[domain]; exists {
			return fmt.Errorf("NAT 配置 %d 与 %d 使用了重复域名", previous, nat.ID)
		}
		domains[domain] = nat.ID
	}

	for _, monitor := range b.Data.Monitors {
		if err := decodeJSONArray("服务监控服务器列表", monitor.ID, monitor.SkipServersRaw, &[]uint64{}); err != nil {
			return err
		}
		if err := decodeJSONArray("服务监控失败任务", monitor.ID, monitor.FailTriggerTasksRaw, &[]uint64{}); err != nil {
			return err
		}
		if err := decodeJSONArray("服务监控恢复任务", monitor.ID, monitor.RecoverTriggerTasksRaw, &[]uint64{}); err != nil {
			return err
		}
	}
	for _, cron := range b.Data.Crons {
		if err := decodeJSONArray("计划任务服务器列表", cron.ID, cron.ServersRaw, &[]uint64{}); err != nil {
			return err
		}
	}
	for _, alert := range b.Data.AlertRules {
		if err := decodeJSONArray("告警规则", alert.ID, alert.RulesRaw, &[]model.Rule{}); err != nil {
			return err
		}
		if err := decodeJSONArray("告警失败任务", alert.ID, alert.FailTriggerTasksRaw, &[]uint64{}); err != nil {
			return err
		}
		if err := decodeJSONArray("告警恢复任务", alert.ID, alert.RecoverTriggerTasksRaw, &[]uint64{}); err != nil {
			return err
		}
	}
	return nil
}

func uniquePortableIDs(name string, count int, idAt func(int) uint64) (map[uint64]struct{}, error) {
	ids := make(map[uint64]struct{}, count)
	for i := 0; i < count; i++ {
		id := idAt(i)
		if id == 0 {
			return nil, fmt.Errorf("%s包含无效的 ID 0", name)
		}
		if _, exists := ids[id]; exists {
			return nil, fmt.Errorf("%s包含重复 ID %d", name, id)
		}
		ids[id] = struct{}{}
	}
	return ids, nil
}

func decodeJSONArray(name string, id uint64, raw string, dst interface{}) error {
	if strings.TrimSpace(raw) == "" {
		return fmt.Errorf("%s %d 的 JSON 为空", name, id)
	}
	if err := json.Unmarshal([]byte(raw), dst); err != nil {
		return fmt.Errorf("%s %d 的 JSON 无效: %w", name, id, err)
	}
	return nil
}

func replacePortableData(b portableBackup) error {
	oldConfig := *singleton.Conf
	applyPortableConfig(singleton.Conf, b.Config)
	configWriteAttempted := false

	err := singleton.DB.Transaction(func(tx *gorm.DB) error {
		for _, tableModel := range []interface{}{
			&model.MonitorHistory{}, &model.Transfer{},
			&model.Server{}, &model.Notification{}, &model.AlertRule{},
			&model.Monitor{}, &model.Cron{}, &model.NAT{}, &model.DDNSProfile{},
			&model.ApiToken{}, &model.User{},
		} {
			if err := tx.Unscoped().Where("1 = 1").Delete(tableModel).Error; err != nil {
				return err
			}
		}

		models := portableModels(b.Data)
		session := tx.Session(&gorm.Session{SkipHooks: true})
		for _, rows := range models {
			if rows.count == 0 {
				continue
			}
			if err := session.Create(rows.value).Error; err != nil {
				return fmt.Errorf("写入%s失败: %w", rows.name, err)
			}
		}

		configWriteAttempted = true
		if err := singleton.Conf.Save(); err != nil {
			return fmt.Errorf("写入配置文件失败: %w", err)
		}
		return nil
	})
	if err == nil {
		return nil
	}

	*singleton.Conf = oldConfig
	if configWriteAttempted {
		if restoreErr := singleton.Conf.Save(); restoreErr != nil {
			return errors.Join(err, fmt.Errorf("恢复原配置失败: %w", restoreErr))
		}
	}
	return err
}

type portableModelRows struct {
	name  string
	count int
	value interface{}
}

func portableModels(data portableBackupData) []portableModelRows {
	servers := make([]model.Server, len(data.Servers))
	for i, row := range data.Servers {
		servers[i] = model.Server{
			Common: model.Common{ID: row.ID, CreatedAt: row.CreatedAt}, Name: row.Name, Tag: row.Tag,
			Secret: strings.TrimSpace(row.Secret), Note: row.Note, PublicNote: row.PublicNote,
			DisplayIndex: row.DisplayIndex, HideForGuest: row.HideForGuest, EnableDDNS: row.EnableDDNS,
			DDNSProfilesRaw: row.DDNSProfilesRaw,
		}
	}
	notifications := make([]model.Notification, len(data.Notifications))
	for i, row := range data.Notifications {
		notifications[i] = model.Notification{
			Common: model.Common{ID: row.ID, CreatedAt: row.CreatedAt}, Name: row.Name, Tag: row.Tag,
			URL: row.URL, RequestMethod: row.RequestMethod, RequestType: row.RequestType,
			RequestHeader: row.RequestHeader, RequestBody: row.RequestBody, VerifySSL: row.VerifySSL,
		}
	}
	alerts := make([]model.AlertRule, len(data.AlertRules))
	for i, row := range data.AlertRules {
		alerts[i] = model.AlertRule{
			Common: model.Common{ID: row.ID, CreatedAt: row.CreatedAt}, Name: row.Name, RulesRaw: row.RulesRaw,
			Enable: row.Enable, TriggerMode: row.TriggerMode, NotificationTag: row.NotificationTag,
			FailTriggerTasksRaw: row.FailTriggerTasksRaw, RecoverTriggerTasksRaw: row.RecoverTriggerTasksRaw,
		}
	}
	monitors := make([]model.Monitor, len(data.Monitors))
	for i, row := range data.Monitors {
		monitors[i] = model.Monitor{
			Common: model.Common{ID: row.ID, CreatedAt: row.CreatedAt}, Name: row.Name, Type: row.Type,
			Target: row.Target, SkipServersRaw: row.SkipServersRaw, Duration: row.Duration, Notify: row.Notify,
			NotificationTag: row.NotificationTag, Cover: row.Cover, EnableTriggerTask: row.EnableTriggerTask,
			EnableShowInService: row.EnableShowInService, FailTriggerTasksRaw: row.FailTriggerTasksRaw,
			RecoverTriggerTasksRaw: row.RecoverTriggerTasksRaw, MinLatency: row.MinLatency,
			MaxLatency: row.MaxLatency, LatencyNotify: row.LatencyNotify,
		}
	}
	crons := make([]model.Cron, len(data.Crons))
	for i, row := range data.Crons {
		crons[i] = model.Cron{
			Common: model.Common{ID: row.ID, CreatedAt: row.CreatedAt}, Name: row.Name, TaskType: row.TaskType,
			Scheduler: row.Scheduler, Command: row.Command, PushSuccessful: row.PushSuccessful,
			NotificationTag: row.NotificationTag, Cover: row.Cover, ServersRaw: row.ServersRaw,
		}
	}
	nats := make([]model.NAT, len(data.NATs))
	for i, row := range data.NATs {
		nats[i] = model.NAT{Common: model.Common{ID: row.ID, CreatedAt: row.CreatedAt}, Name: row.Name, ServerID: row.ServerID, Host: row.Host, Domain: row.Domain}
	}
	ddns := make([]model.DDNSProfile, len(data.DDNSProfiles))
	for i, row := range data.DDNSProfiles {
		ddns[i] = model.DDNSProfile{
			Common: model.Common{ID: row.ID, CreatedAt: row.CreatedAt}, EnableIPv4: row.EnableIPv4,
			EnableIPv6: row.EnableIPv6, MaxRetries: row.MaxRetries, Name: row.Name, Provider: row.Provider,
			AccessID: row.AccessID, AccessSecret: row.AccessSecret, WebhookURL: row.WebhookURL,
			WebhookMethod: row.WebhookMethod, WebhookRequestType: row.WebhookRequestType,
			WebhookRequestBody: row.WebhookRequestBody, WebhookHeaders: row.WebhookHeaders, DomainsRaw: row.DomainsRaw,
		}
	}
	return []portableModelRows{
		{"服务器", len(servers), &servers}, {"通知方式", len(notifications), &notifications},
		{"告警规则", len(alerts), &alerts}, {"服务监控", len(monitors), &monitors},
		{"计划任务", len(crons), &crons}, {"NAT 配置", len(nats), &nats}, {"DDNS 配置", len(ddns), &ddns},
	}
}

func portableBackupSummary(b portableBackup) string {
	return fmt.Sprintf("servers=%d, notifications=%d, alert_rules=%d, monitors=%d, crons=%d, nats=%d, ddns_profiles=%d",
		len(b.Data.Servers), len(b.Data.Notifications), len(b.Data.AlertRules), len(b.Data.Monitors),
		len(b.Data.Crons), len(b.Data.NATs), len(b.Data.DDNSProfiles))
}
