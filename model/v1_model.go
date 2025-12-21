package model

import (
	"time"

	pb "github.com/naiba/nezha/proto"
)

type V1CommonInterface interface {
	GetID() uint64
}

type V1Host struct {
	Platform        string   `json:"platform,omitempty"`
	PlatformVersion string   `json:"platform_version,omitempty"`
	CPU             []string `json:"cpu,omitempty"`
	MemTotal        uint64   `json:"mem_total,omitempty"`
	DiskTotal       uint64   `json:"disk_total,omitempty"`
	SwapTotal       uint64   `json:"swap_total,omitempty"`
	Arch            string   `json:"arch,omitempty"`
	Virtualization  string   `json:"virtualization,omitempty"`
	BootTime        uint64   `json:"boot_time,omitempty"`
	Version         string   `json:"version,omitempty"`
	GPU             []string `json:"gpu,omitempty"`
}

type V1HostState struct {
	CPU            float64             `json:"cpu,omitempty"`
	MemUsed        uint64              `json:"mem_used,omitempty"`
	SwapUsed       uint64              `json:"swap_used,omitempty"`
	DiskUsed       uint64              `json:"disk_used,omitempty"`
	NetInTransfer  uint64              `json:"net_in_transfer,omitempty"`
	NetOutTransfer uint64              `json:"net_out_transfer,omitempty"`
	NetInSpeed     uint64              `json:"net_in_speed,omitempty"`
	NetOutSpeed    uint64              `json:"net_out_speed,omitempty"`
	Uptime         uint64              `json:"uptime,omitempty"`
	Load1          float64             `json:"load_1,omitempty"`
	Load5          float64             `json:"load_5,omitempty"`
	Load15         float64             `json:"load_15,omitempty"`
	TcpConnCount   uint64              `json:"tcp_conn_count,omitempty"`
	UdpConnCount   uint64              `json:"udp_conn_count,omitempty"`
	ProcessCount   uint64              `json:"process_count,omitempty"`
	Temperatures   []SensorTemperature `json:"temperatures,omitempty"`
	GPU            []float64           `json:"gpu,omitempty"`
}

type V1StreamServer struct {
	ID           uint64 `json:"id,omitempty"`
	Name         string `json:"name,omitempty"`
	PublicNote   string `json:"public_note,omitempty"`   // 公开备注，只第一个数据包有值
	DisplayIndex int    `json:"display_index,omitempty"` // 展示排序，越大越靠前

	Host        *V1Host      `json:"host,omitempty"`
	State       *V1HostState `json:"state,omitempty"`
	CountryCode string       `json:"country_code,omitempty"`
	LastActive  time.Time    `json:"last_active,omitempty"`
}

type V1StreamServerData struct {
	Now     int64            `json:"now,omitempty"`
	Online  uint64           `json:"online,omitempty"`
	Servers []V1StreamServer `json:"servers,omitempty"`
}

type V1Common struct {
	ID        uint64    `gorm:"primaryKey" json:"id,omitempty"`
	CreatedAt time.Time `gorm:"index;<-:create" json:"created_at,omitempty"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at,omitempty"`
	// Do not use soft deletion
	// DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

type V1IP struct {
	IPv4Addr string `json:"ipv4_addr,omitempty"`
	IPv6Addr string `json:"ipv6_addr,omitempty"`
}

type V1GeoIP struct {
	IP          V1IP   `json:"ip,omitempty"`
	CountryCode string `json:"country_code,omitempty"`
}

type V1Server struct {
	V1Common

	Name            string `json:"name"`
	UUID            string `json:"uuid,omitempty" gorm:"unique"`
	Note            string `json:"note,omitempty"`           // 管理员可见备注
	PublicNote      string `json:"public_note,omitempty"`    // 公开备注
	DisplayIndex    int    `json:"display_index"`            // 展示排序，越大越靠前
	HideForGuest    bool   `json:"hide_for_guest,omitempty"` // 对游客隐藏
	EnableDDNS      bool   `json:"enable_ddns,omitempty"`    // 启用DDNS
	DDNSProfilesRaw string `gorm:"default:'[]';column:ddns_profiles_raw" json:"-"`

	DDNSProfiles []uint64 `gorm:"-" json:"ddns_profiles,omitempty" validate:"optional"` // DDNS配置

	Host       *V1Host      `gorm:"-" json:"host,omitempty"`
	State      *V1HostState `gorm:"-" json:"state,omitempty"`
	GeoIP      *V1GeoIP     `gorm:"-" json:"geoip,omitempty"`
	LastActive time.Time    `gorm:"-" json:"last_active,omitempty"`

	TaskStream pb.NezhaService_RequestTaskServer `gorm:"-" json:"-"`

	PrevTransferInSnapshot  int64 `gorm:"-" json:"-"` // 上次数据点时的入站使用量
	PrevTransferOutSnapshot int64 `gorm:"-" json:"-"` // 上次数据点时的出站使用量
}

type V1ServerGroup struct {
	V1Common

	Name string `json:"name"`
}

type V1ServerGroupResponseItem struct {
	Group   V1ServerGroup `json:"group"`
	Servers []uint64      `json:"servers"`
}

type V1ServiceResponseItem struct {
	ServiceName string       `json:"service_name,omitempty"`
	CurrentUp   uint64       `json:"current_up"`
	CurrentDown uint64       `json:"current_down"`
	TotalUp     uint64       `json:"total_up"`
	TotalDown   uint64       `json:"total_down"`
	Delay       *[30]float32 `json:"delay,omitempty"`
	Up          *[30]int     `json:"up,omitempty"`
	Down        *[30]int     `json:"down,omitempty"`
}

type V1CycleTransferStats struct {
	Name       string               `json:"name"`
	From       time.Time            `json:"from"`
	To         time.Time            `json:"to"`
	Max        uint64               `json:"max"`
	Min        uint64               `json:"min"`
	ServerName map[uint64]string    `json:"server_name,omitempty"`
	Transfer   map[uint64]uint64    `json:"transfer,omitempty"`
	NextUpdate map[uint64]time.Time `json:"next_update,omitempty"`
}

type V1ServiceResponse struct {
	Services           map[uint64]V1ServiceResponseItem `json:"services,omitempty"`
	CycleTransferStats map[uint64]V1CycleTransferStats  `json:"cycle_transfer_stats,omitempty"`
}

type V1ServiceInfos struct {
	ServiceID   uint64    `json:"monitor_id"`
	ServerID    uint64    `json:"server_id"`
	ServiceName string    `json:"monitor_name"`
	ServerName  string    `json:"server_name"`
	CreatedAt   []int64   `json:"created_at"`
	AvgDelay    []float32 `json:"avg_delay"`
}

type V1Config struct {
	SiteName            string `mapstructure:"site_name" json:"site_name"`
	Language            string `mapstructure:"language" json:"language"`
	CustomCode          string `mapstructure:"custom_code" json:"custom_code,omitempty"`
	CustomCodeDashboard string `mapstructure:"custom_code_dashboard" json:"custom_code_dashboard,omitempty"`
}

type V1SettingResponse[T any] struct {
	Config T `json:"config,omitempty"`

	Version string `json:"version,omitempty"`
}

type V1User struct {
	V1Common
	Username string `json:"username,omitempty" gorm:"uniqueIndex"`
	Password string `json:"password,omitempty" gorm:"type:char(72)"`
}

type V1Profile struct {
	V1User
	LoginIP string `json:"login_ip,omitempty"`
}

type V1LoginRequest struct {
	Password string `json:"password,omitempty"`
	Username string `json:"username,omitempty"`
}

type V1LoginResponse struct {
	Expire string `json:"expire,omitempty"`
	Token  string `json:"token,omitempty"`
}

type V1Notification struct {
	V1Common
	Name          string `json:"name"`
	URL           string `json:"url"`
	RequestMethod uint8  `json:"request_method"`
	RequestType   uint8  `json:"request_type"`
	RequestHeader string `json:"request_header" gorm:"type:longtext"`
	RequestBody   string `json:"request_body" gorm:"type:longtext"`
	VerifyTLS     *bool  `json:"verify_tls,omitempty"`
}

type V1Rule struct {
	// 指标类型，cpu、memory、swap、disk、net_in_speed、net_out_speed
	// net_all_speed、transfer_in、transfer_out、transfer_all、offline
	// transfer_in_cycle、transfer_out_cycle、transfer_all_cycle
	Type          string          `json:"type"`
	Min           float64         `json:"min,omitempty" validate:"optional"`                                                        // 最小阈值 (百分比、字节 kb ÷ 1024)
	Max           float64         `json:"max,omitempty" validate:"optional"`                                                        // 最大阈值 (百分比、字节 kb ÷ 1024)
	CycleStart    *time.Time      `json:"cycle_start,omitempty" validate:"optional"`                                                // 流量统计的开始时间
	CycleInterval uint64          `json:"cycle_interval,omitempty" validate:"optional"`                                             // 流量统计周期
	CycleUnit     string          `json:"cycle_unit,omitempty" enums:"hour,day,week,month,year" validate:"optional" default:"hour"` // 流量统计周期单位，默认hour,可选(hour, day, week, month, year)
	Duration      uint64          `json:"duration,omitempty" validate:"optional"`                                                   // 持续时间 (秒)
	Cover         uint64          `json:"cover"`                                                                                    // 覆盖范围 RuleCoverAll/IgnoreAll
	Ignore        map[uint64]bool `json:"ignore,omitempty" validate:"optional"`                                                     // 覆盖范围的排除
}

type V1AlertRule struct {
	V1Common
	Name                string    `json:"name"`
	RulesRaw            string    `json:"-"`
	Enable              *bool     `json:"enable,omitempty"`
	TriggerMode         uint8     `gorm:"default:0" json:"trigger_mode"` // 触发模式: 0-始终触发(默认) 1-单次触发
	NotificationGroupID uint64    `json:"notification_group_id"`         // 该报警规则所在的通知组
	Rules               []*V1Rule `gorm:"-" json:"rules"`
	FailTriggerTasks    []uint64  `gorm:"-" json:"fail_trigger_tasks"`    // 失败时执行的触发任务id
	RecoverTriggerTasks []uint64  `gorm:"-" json:"recover_trigger_tasks"` // 恢复时执行的触发任务id
}

type V1Service struct {
	V1Common
	Name                string `json:"name"`
	Type                uint8  `json:"type"`
	Target              string `json:"target"`
	SkipServersRaw      string `json:"-"`
	Duration            uint64 `json:"duration"`
	Notify              bool   `json:"notify,omitempty"`
	NotificationGroupID uint64 `json:"notification_group_id"` // 当前服务监控所属的通知组 ID
	Cover               uint8  `json:"cover"`

	EnableTriggerTask   bool `gorm:"default: false" json:"enable_trigger_task,omitempty"`
	EnableShowInService bool `gorm:"default: false" json:"enable_show_in_service,omitempty"`

	FailTriggerTasks    []uint64 `gorm:"-" json:"fail_trigger_tasks"`    // 失败时执行的触发任务id
	RecoverTriggerTasks []uint64 `gorm:"-" json:"recover_trigger_tasks"` // 恢复时执行的触发任务id

	MinLatency    float32 `json:"min_latency"`
	MaxLatency    float32 `json:"max_latency"`
	LatencyNotify bool    `json:"latency_notify,omitempty"`

	SkipServers map[uint64]bool `gorm:"-" json:"skip_servers"`
}

type V1TerminalForm struct {
	Protocol string `json:"protocol,omitempty"`
	ServerID uint64 `json:"server_id,omitempty"`
}

type V1CreateTerminalResponse struct {
	SessionID  string `json:"session_id,omitempty"`
	ServerID   uint64 `json:"server_id,omitempty"`
	ServerName string `json:"server_name,omitempty"`
}

type V1CreateFMResponse struct {
	SessionID string `json:"session_id,omitempty"`
}

func (s *V1Server) GetID() uint64 {
	return s.ID
}

func (s *V1ServerGroup) GetID() uint64 {
	return s.ID
}

func (s *V1Notification) GetID() uint64 {
	return s.ID
}

func (s *V1AlertRule) GetID() uint64 {
	return s.ID
}

func (s *V1Service) GetID() uint64 {
	return s.ID
}
