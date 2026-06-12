package audit

import (
	"fmt"
	"strconv"
	"strings"
	"time"
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

	serverOfflineThreshold = 10 * time.Minute
	highLoadDuration       = 15 * time.Minute
	highLoadCPUThreshold    = 85.0
	highMemoryThreshold     = 96.0
	watchdogInterval        = 30 * time.Second
	runtimeRowID            = uint64(1)

	TriggerReasonOffline    = "offline"
	TriggerReasonHighCPU    = "high_cpu"
	TriggerReasonHighMemory = "high_memory"
)

type serverWatchState struct {
	wasOnline      bool
	offlineLogged  bool
	highLoadSince  time.Time
	highLoadLogged bool
	highMemSince   time.Time
	highMemLogged  bool
}

// serverWatchSnapshot 在锁内拷贝的只读快照，避免 Watchdog 持锁期间写审计库。
type serverWatchSnapshot struct {
	id         uint64
	name       string
	lastActive time.Time
	cpu        float64
	memUsed    uint64
	memTotal   uint64
}

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
	EnableGeoIP                     bool
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
	appendBoolChange(&changes, "GeoIP lookup", before.EnableGeoIP, in.EnableGeoIP)
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

// StartWatchdog 启动后台巡检：心跳入库、意外关机检测、服务器上下线日志。
func StartWatchdog() {
	checkUnexpectedShutdown()
	go watchdogLoop()
}

// MarkGracefulShutdown 正常退出时标记已停机，避免下次启动误判为意外关机。
func MarkGracefulShutdown() {
	if singleton.DB == nil {
		return
	}
	_ = singleton.DB.Model(&model.DashboardRuntime{}).Where("id = ?", runtimeRowID).
		Update("running", false).Error
}

func loadRuntime() model.DashboardRuntime {
	var rt model.DashboardRuntime
	if singleton.DB == nil {
		return rt
	}
	if err := singleton.DB.First(&rt, runtimeRowID).Error; err != nil {
		rt = model.DashboardRuntime{ID: runtimeRowID, Running: false, LastAlive: time.Time{}}
		_ = singleton.DB.Create(&rt).Error
	}
	return rt
}

func checkUnexpectedShutdown() {
	if singleton.DB == nil {
		return
	}
	rt := loadRuntime()
	if rt.Running && !rt.LastAlive.IsZero() {
		Record(nil, TypeEvent, "Dashboard stopped",
			fmt.Sprintf("last alive at %s", rt.LastAlive.Format(time.RFC3339)))
	}
	now := time.Now()
	_ = singleton.DB.Save(&model.DashboardRuntime{
		ID: runtimeRowID, Running: true, LastAlive: now,
	}).Error
}

func watchdogLoop() {
	ticker := time.NewTicker(watchdogInterval)
	defer ticker.Stop()
	serverStates := make(map[uint64]*serverWatchState)
	for {
		writeAliveToDB()
		checkServerStates(serverStates)
		<-ticker.C
	}
}

func writeAliveToDB() {
	if singleton.DB == nil {
		return
	}
	_ = singleton.DB.Model(&model.DashboardRuntime{}).Where("id = ?", runtimeRowID).
		Updates(map[string]interface{}{"last_alive": time.Now(), "running": true}).Error
}

func isServerOnline(lastActive time.Time) bool {
	if lastActive.IsZero() {
		return false
	}
	return time.Since(lastActive) < serverOfflineThreshold
}

func snapshotMemoryPercent(snap serverWatchSnapshot) float64 {
	if snap.memTotal == 0 {
		return 0
	}
	return float64(snap.memUsed) / float64(snap.memTotal) * 100
}

func snapshotServersForWatch() []serverWatchSnapshot {
	singleton.ServerLock.RLock()
	defer singleton.ServerLock.RUnlock()

	snaps := make([]serverWatchSnapshot, 0, len(singleton.ServerList))
	for id, server := range singleton.ServerList {
		if server == nil {
			continue
		}
		snap := serverWatchSnapshot{
			id:         id,
			name:       server.Name,
			lastActive: server.LastActive,
		}
		if server.State != nil {
			snap.cpu = server.State.CPU
			snap.memUsed = server.State.MemUsed
		}
		if server.Host != nil {
			snap.memTotal = server.Host.MemTotal
		}
		snaps = append(snaps, snap)
	}
	return snaps
}

func checkServerStates(states map[uint64]*serverWatchState) {
	snaps := snapshotServersForWatch()
	for _, snap := range snaps {
		id := snap.id
		online := isServerOnline(snap.lastActive)
		st, ok := states[id]
		if !ok {
			states[id] = &serverWatchState{wasOnline: online}
			continue
		}
		if online && !st.wasOnline {
			if st.offlineLogged {
				recordServerWatchRecovery(id, "Server offline recovered",
					fmt.Sprintf("server: %s (ID %d)", snap.name, id))
			} else {
				Record(nil, TypeEvent, "Server online",
					fmt.Sprintf("server: %s (ID %d)", snap.name, id))
			}
			st.offlineLogged = false
			st.highLoadSince = time.Time{}
			st.highLoadLogged = false
			st.highMemSince = time.Time{}
			st.highMemLogged = false
		}
		if !online && st.wasOnline && !st.offlineLogged {
			if snap.lastActive.IsZero() || time.Since(snap.lastActive) >= serverOfflineThreshold {
				detail := fmt.Sprintf("server: %s (ID %d)", snap.name, id)
				if !snap.lastActive.IsZero() {
					detail += fmt.Sprintf(", last active at %s", snap.lastActive.Format(time.RFC3339))
				}
				recordServerWatchEvent(id, "Server offline", detail, TriggerReasonOffline)
				st.offlineLogged = true
			}
		}
		if !online {
			st.highLoadSince = time.Time{}
			st.highLoadLogged = false
			st.highMemSince = time.Time{}
			st.highMemLogged = false
		} else {
			checkServerHighLoad(st, snap)
			checkServerHighMemory(st, snap)
		}
		st.wasOnline = online
	}
}

func checkServerHighLoad(st *serverWatchState, snap serverWatchSnapshot) {
	high := snap.cpu >= highLoadCPUThreshold
	if st.highLoadLogged && !high {
		recordServerWatchRecovery(snap.id, "Server high load recovered",
			fmt.Sprintf("server: %s (ID %d), CPU %.1f%%", snap.name, snap.id, snap.cpu))
		st.highLoadSince = time.Time{}
		st.highLoadLogged = false
		return
	}
	if !high {
		st.highLoadSince = time.Time{}
		return
	}
	now := time.Now()
	if st.highLoadSince.IsZero() {
		st.highLoadSince = now
		return
	}
	if st.highLoadLogged || time.Since(st.highLoadSince) < highLoadDuration {
		return
	}
	recordServerWatchEvent(snap.id, "Server high load",
		fmt.Sprintf("server: %s (ID %d), CPU %.1f%%, sustained for %d minutes",
			snap.name, snap.id, snap.cpu, int(highLoadDuration.Minutes())),
		TriggerReasonHighCPU)
	st.highLoadLogged = true
}

func checkServerHighMemory(st *serverWatchState, snap serverWatchSnapshot) {
	mem := snapshotMemoryPercent(snap)
	high := mem >= highMemoryThreshold
	if st.highMemLogged && !high {
		recordServerWatchRecovery(snap.id, "Server high memory recovered",
			fmt.Sprintf("server: %s (ID %d), memory %.1f%%", snap.name, snap.id, mem))
		st.highMemSince = time.Time{}
		st.highMemLogged = false
		return
	}
	if !high {
		st.highMemSince = time.Time{}
		return
	}
	now := time.Now()
	if st.highMemSince.IsZero() {
		st.highMemSince = now
		return
	}
	if st.highMemLogged || time.Since(st.highMemSince) < highLoadDuration {
		return
	}
	recordServerWatchEvent(snap.id, "Server high memory",
		fmt.Sprintf("server: %s (ID %d), memory %.1f%%, sustained for %d minutes",
			snap.name, snap.id, mem, int(highLoadDuration.Minutes())),
		TriggerReasonHighMemory)
	st.highMemLogged = true
}

func recordServerWatchEvent(serverID uint64, action, detail, reason string) {
	Record(nil, TypeEvent, action, detail)
	OnServerWatchTrigger(serverID, reason)
}

func recordServerWatchRecovery(serverID uint64, action, detail string) {
	Record(nil, TypeEvent, action, detail)
}

// OnServerWatchTrigger 服务器离线、持续高 CPU/内存时触发回调，供后续扩展通知/Webhook 等。
func OnServerWatchTrigger(serverID uint64, reason string) {
	_ = serverID
	_ = reason
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
