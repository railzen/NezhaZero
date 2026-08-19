package model

import (
	"errors"
	"fmt"
	"html/template"
	"log"
	"sync"
	"time"

	"github.com/railzen/nezha-zero/pkg/utils"
	pb "github.com/railzen/nezha-zero/proto"
	"gorm.io/gorm"
)

const TaskDispatchSlotLimit = 32

type Server struct {
	Common
	Name         string
	Tag          string   // 分组名
	Secret       string   `gorm:"uniqueIndex" json:"-"`
	Note         string   `json:"-"`                    // 管理员可见备注
	PublicNote   string   `json:"PublicNote,omitempty"` // 公开备注
	DisplayIndex int      // 展示排序，越大越靠前
	HideForGuest bool     // 对游客隐藏
	EnableDDNS   bool     // 启用DDNS
	DDNSProfiles []uint64 `gorm:"-" json:"-"` // DDNS配置

	DDNSProfilesRaw string `gorm:"default:'[]';column:ddns_profiles_raw" json:"-"`

	Host       *Host      `gorm:"-"`
	State      *HostState `gorm:"-"`
	LastActive time.Time  `gorm:"-"`

	TaskClose        chan error                        `gorm:"-" json:"-"`
	TaskCloseLock    *sync.Mutex                       `gorm:"-" json:"-"`
	TaskSendLock     *sync.Mutex                       `gorm:"-" json:"-"`
	TaskDispatchLock *sync.Mutex                       `gorm:"-" json:"-"`
	TaskDispatchSem  chan struct{}                     `gorm:"-" json:"-"`
	TaskStream       pb.NezhaService_RequestTaskServer `gorm:"-" json:"-"`
	RuntimeLock      *sync.RWMutex                     `gorm:"-" json:"-"`

	PrevTransferInSnapshot  uint64 `gorm:"-" json:"-"` // 上次数据点时的入站使用量
	PrevTransferOutSnapshot uint64 `gorm:"-" json:"-"` // 上次数据点时的出站使用量
}

func (s *Server) CopyFromRunningServer(old *Server) {
	if old == nil {
		return
	}
	host, state, lastActive, prevIn, prevOut := old.RuntimeSnapshot()
	s.Host = host
	s.State = state
	s.LastActive = lastActive
	s.TaskClose = old.TaskClose
	s.TaskCloseLock = old.TaskCloseLock
	s.TaskSendLock = old.TaskSendLock
	s.TaskDispatchLock = old.TaskDispatchLock
	s.TaskDispatchSem = old.TaskDispatchSem
	s.TaskStream = old.TaskStream
	s.RuntimeLock = old.RuntimeLock
	s.PrevTransferInSnapshot = prevIn
	s.PrevTransferOutSnapshot = prevOut
}

func (s *Server) InitRuntimeLock() {
	if s.RuntimeLock == nil {
		s.RuntimeLock = new(sync.RWMutex)
	}
}

func (s *Server) RuntimeSnapshot() (*Host, *HostState, time.Time, uint64, uint64) {
	if s == nil {
		return nil, nil, time.Time{}, 0, 0
	}
	s.InitRuntimeLock()
	s.RuntimeLock.RLock()
	defer s.RuntimeLock.RUnlock()

	var host *Host
	if s.Host != nil {
		hostValue := *s.Host
		if hostValue.CPU != nil {
			hostValue.CPU = append([]string(nil), hostValue.CPU...)
		}
		if hostValue.GPU != nil {
			hostValue.GPU = append([]string(nil), hostValue.GPU...)
		}
		host = &hostValue
	}
	var state *HostState
	if s.State != nil {
		stateValue := *s.State
		if stateValue.Temperatures != nil {
			stateValue.Temperatures = append([]SensorTemperature(nil), stateValue.Temperatures...)
		}
		state = &stateValue
	}
	return host, state, s.LastActive, s.PrevTransferInSnapshot, s.PrevTransferOutSnapshot
}

func (s *Server) SendTask(task *pb.Task) error {
	if s == nil {
		return errors.New("server is nil")
	}
	if s.TaskCloseLock == nil {
		return errors.New("task stream lock is nil")
	}
	if s.TaskSendLock == nil {
		return errors.New("task stream send lock is nil")
	}

	s.TaskSendLock.Lock()
	defer s.TaskSendLock.Unlock()

	s.TaskCloseLock.Lock()
	taskStream := s.TaskStream
	s.TaskCloseLock.Unlock()

	if taskStream == nil {
		return errors.New("task stream is nil")
	}
	return taskStream.Send(task)
}

func (s *Server) AfterFind(tx *gorm.DB) error {
	if s.DDNSProfilesRaw != "" {
		if err := utils.Json.Unmarshal([]byte(s.DDNSProfilesRaw), &s.DDNSProfiles); err != nil {
			log.Println("NEZHA>> Server.AfterFind:", err)
			return nil
		}
	}
	return nil
}

func boolToString(b bool) string {
	if b {
		return "true"
	}
	return "false"
}

// ShowCountryFlag 与主界面逻辑一致
func (s *Server) ShowCountryFlag() bool {
	return s.State != nil && s.State.Uptime > 0
}

func (s Server) MarshalForDashboard() template.JS {
	name, _ := utils.Json.Marshal(s.Name)
	tag, _ := utils.Json.Marshal(s.Tag)
	note, _ := utils.Json.Marshal(s.Note)
	secret, _ := utils.Json.Marshal(s.Secret)
	ddnsProfilesRaw, _ := utils.Json.Marshal(s.DDNSProfilesRaw)
	publicNote, _ := utils.Json.Marshal(s.PublicNote)
	return template.JS(fmt.Sprintf(`{"ID":%d,"Name":%s,"Secret":%s,"DisplayIndex":%d,"Tag":%s,"Note":%s,"HideForGuest": %s,"EnableDDNS": %s,"DDNSProfilesRaw": %s,"PublicNote": %s}`, s.ID, name, secret, s.DisplayIndex, tag, note, boolToString(s.HideForGuest), boolToString(s.EnableDDNS), ddnsProfilesRaw, publicNote))
}
