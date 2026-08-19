package singleton

import (
	"crypto/subtle"
	"sort"
	"strings"
	"sync"
	"time"

	"gorm.io/gorm"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/utils"
)

var (
	ApiTokenList         = make(map[string]*model.ApiToken)
	UserIDToApiTokenList = make(map[uint64][]string)
	ApiLock              sync.RWMutex

	ServerAPI  = &ServerAPIService{}
	MonitorAPI = &MonitorAPIService{}
)

type ServerAPIService struct{}

// CommonResponse 常规返回结构 包含状态码 和 状态信息
type CommonResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type RegisterServer struct {
	Name         string
	Tag          string
	Note         string
	HideForGuest string
}

type ServerRegisterResponse struct {
	CommonResponse
	Secret string `json:"secret"`
}

type CommonServerInfo struct {
	ID           uint64 `json:"id"`
	Name         string `json:"name"`
	Tag          string `json:"tag"`
	LastActive   int64  `json:"last_active"`
	IPV4         string `json:"ipv4"`
	IPV6         string `json:"ipv6"`
	ValidIP      string `json:"valid_ip"`
	DisplayIndex int    `json:"display_index"`
	HideForGuest bool   `json:"hide_for_guest"`
}

// StatusResponse 服务器状态子结构 包含服务器信息与状态信息
type StatusResponse struct {
	CommonServerInfo
	Host   *model.Host      `json:"host"`
	Status *model.HostState `json:"status"`
}

// ServerStatusResponse 服务器状态返回结构 包含常规返回结构 和 服务器状态子结构
type ServerStatusResponse struct {
	CommonResponse
	Result []*StatusResponse `json:"result"`
}

// ServerInfoResponse 服务器信息返回结构 包含常规返回结构 和 服务器信息子结构
type ServerInfoResponse struct {
	CommonResponse
	Result []*CommonServerInfo `json:"result"`
}

type MonitorAPIService struct {
}

type MonitorInfoResponse struct {
	CommonResponse
	Result []*MonitorInfo `json:"result"`
}

type MonitorInfo struct {
	MonitorID   uint64    `json:"monitor_id"`
	ServerID    uint64    `json:"server_id"`
	MonitorName string    `json:"monitor_name"`
	ServerName  string    `json:"server_name"`
	CreatedAt   []int64   `json:"created_at"`
	AvgDelay    []float32 `json:"avg_delay"`
}

func InitAPI() {
	ApiTokenList = make(map[string]*model.ApiToken)
	UserIDToApiTokenList = make(map[uint64][]string)
}

// migrateAPITokens replaces each legacy plaintext token with a masked
// identifier and stores its SHA-256 digest separately. Existing plaintext
// credentials continue to authenticate after the upgrade.
func migrateAPITokens(db *gorm.DB) error {
	var tokenList []model.ApiToken
	if err := db.Find(&tokenList).Error; err != nil {
		return err
	}
	return db.Transaction(func(tx *gorm.DB) error {
		for i := range tokenList {
			token := &tokenList[i]
			plain := strings.TrimSpace(token.Token)
			hash := strings.TrimSpace(token.Hash)
			if plain == "" && hash == "" {
				continue
			}
			updates := map[string]any{}
			if hash == "" {
				updates["hash"] = utils.HashAPIToken(plain)
				updates["token"] = utils.MaskAPIToken(plain)
			}
			if len(updates) > 0 {
				if err := tx.Model(token).Updates(updates).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})
}

func loadAPI() {
	InitAPI()
	var tokenList []*model.ApiToken
	DB.Find(&tokenList)
	for _, token := range tokenList {
		token.Token = strings.TrimSpace(token.Token)
		token.Hash = strings.TrimSpace(token.Hash)
		if token.Token == "" || !utils.IsHashedAPIToken(token.Hash) {
			continue
		}
		ApiTokenList[token.Token] = token
		UserIDToApiTokenList[token.UserID] = append(UserIDToApiTokenList[token.UserID], token.Token)
	}
}

func FindAPIToken(plain string) (*model.ApiToken, bool) {
	plain = strings.TrimSpace(plain)
	if plain == "" {
		return nil, false
	}
	masked := utils.MaskAPIToken(plain)
	hash := utils.HashAPIToken(plain)
	ApiLock.RLock()
	token, ok := ApiTokenList[masked]
	ApiLock.RUnlock()
	if !ok || subtle.ConstantTimeCompare([]byte(token.Hash), []byte(hash)) != 1 {
		return nil, false
	}
	return token, true
}

// GetStatusByIDList 获取传入IDList的服务器状态信息
func (s *ServerAPIService) GetStatusByIDList(idList []uint64) *ServerStatusResponse {
	res := &ServerStatusResponse{}
	res.Result = make([]*StatusResponse, 0)

	ServerLock.RLock()
	defer ServerLock.RUnlock()

	for _, v := range idList {
		server := ServerList[v]
		if server == nil {
			continue
		}
		host, state, lastActive, _, _ := server.RuntimeSnapshot()
		if host == nil || state == nil {
			continue
		}
		ipv4, ipv6, validIP := utils.SplitIPAddr(host.IP)
		info := CommonServerInfo{
			ID:         server.ID,
			Name:       server.Name,
			Tag:        server.Tag,
			LastActive: lastActive.Unix(),
			IPV4:       ipv4,
			IPV6:       ipv6,
			ValidIP:    validIP,
		}
		res.Result = append(res.Result, &StatusResponse{
			CommonServerInfo: info,
			Host:             host,
			Status:           state,
		})
	}
	res.CommonResponse = CommonResponse{
		Code:    0,
		Message: "success",
	}
	return res
}

// GetStatusByTag 获取传入分组的所有服务器状态信息
func (s *ServerAPIService) GetStatusByTag(tag string) *ServerStatusResponse {
	ServerLock.RLock()
	idList := append([]uint64(nil), ServerTagToIDList[tag]...)
	ServerLock.RUnlock()
	return s.GetStatusByIDList(idList)
}

// GetAllStatus 获取所有服务器状态信息
func (s *ServerAPIService) GetAllStatus() *ServerStatusResponse {
	res := &ServerStatusResponse{}
	res.Result = make([]*StatusResponse, 0)
	ServerLock.RLock()
	defer ServerLock.RUnlock()
	for _, v := range ServerList {
		host, state, lastActive, _, _ := v.RuntimeSnapshot()
		if host == nil || state == nil {
			continue
		}
		ipv4, ipv6, validIP := utils.SplitIPAddr(host.IP)
		info := CommonServerInfo{
			ID:           v.ID,
			Name:         v.Name,
			Tag:          v.Tag,
			LastActive:   lastActive.Unix(),
			IPV4:         ipv4,
			IPV6:         ipv6,
			ValidIP:      validIP,
			DisplayIndex: v.DisplayIndex,
			HideForGuest: v.HideForGuest,
		}
		res.Result = append(res.Result, &StatusResponse{
			CommonServerInfo: info,
			Host:             host,
			Status:           state,
		})
	}
	res.CommonResponse = CommonResponse{
		Code:    0,
		Message: "success",
	}
	return res
}

// GetListByTag 获取传入分组的所有服务器信息
func (s *ServerAPIService) GetListByTag(tag string) *ServerInfoResponse {
	res := &ServerInfoResponse{}
	res.Result = make([]*CommonServerInfo, 0)

	ServerLock.RLock()
	defer ServerLock.RUnlock()
	for _, v := range ServerTagToIDList[tag] {
		server := ServerList[v]
		if server == nil {
			continue
		}
		host, _, lastActive, _, _ := server.RuntimeSnapshot()
		if host == nil {
			continue
		}
		ipv4, ipv6, validIP := utils.SplitIPAddr(host.IP)
		info := &CommonServerInfo{
			ID:         v,
			Name:       server.Name,
			Tag:        server.Tag,
			LastActive: lastActive.Unix(),
			IPV4:       ipv4,
			IPV6:       ipv6,
			ValidIP:    validIP,
		}
		res.Result = append(res.Result, info)
	}
	res.CommonResponse = CommonResponse{
		Code:    0,
		Message: "success",
	}
	return res
}

// GetAllList 获取所有服务器信息
func (s *ServerAPIService) GetAllList() *ServerInfoResponse {
	res := &ServerInfoResponse{}
	res.Result = make([]*CommonServerInfo, 0)

	ServerLock.RLock()
	defer ServerLock.RUnlock()
	for _, v := range ServerList {
		host, _, lastActive, _, _ := v.RuntimeSnapshot()
		if host == nil {
			continue
		}
		ipv4, ipv6, validIP := utils.SplitIPAddr(host.IP)
		info := &CommonServerInfo{
			ID:         v.ID,
			Name:       v.Name,
			Tag:        v.Tag,
			LastActive: lastActive.Unix(),
			IPV4:       ipv4,
			IPV6:       ipv6,
			ValidIP:    validIP,
		}
		res.Result = append(res.Result, info)
	}
	res.CommonResponse = CommonResponse{
		Code:    0,
		Message: "success",
	}
	return res
}
func (s *ServerAPIService) Register(rs *RegisterServer) *ServerRegisterResponse {
	var serverInfo model.Server
	var err error
	// Populate serverInfo fields
	serverInfo.Name = rs.Name
	serverInfo.Tag = rs.Tag
	serverInfo.Note = rs.Note
	serverInfo.HideForGuest = rs.HideForGuest == "on"
	// Generate a random secret
	serverInfo.Secret, err = utils.GenerateRandomString(18)
	if err != nil {
		return &ServerRegisterResponse{
			CommonResponse: CommonResponse{
				Code:    500,
				Message: "Generate secret failed: " + err.Error(),
			},
			Secret: "",
		}
	}
	// Attempt to save serverInfo in the database
	err = DB.Create(&serverInfo).Error
	if err != nil {
		return &ServerRegisterResponse{
			CommonResponse: CommonResponse{
				Code:    500,
				Message: "Database error: " + err.Error(),
			},
			Secret: "",
		}
	}

	serverInfo.Host = &model.Host{}
	serverInfo.State = &model.HostState{}
	serverInfo.TaskCloseLock = new(sync.Mutex)
	serverInfo.TaskSendLock = new(sync.Mutex)
	serverInfo.TaskDispatchLock = new(sync.Mutex)
	serverInfo.TaskDispatchSem = make(chan struct{}, model.TaskDispatchSlotLimit)
	serverInfo.RuntimeLock = new(sync.RWMutex)
	ServerLock.Lock()
	SecretToID[serverInfo.Secret] = serverInfo.ID
	ServerList[serverInfo.ID] = &serverInfo
	ServerTagToIDList[serverInfo.Tag] = append(ServerTagToIDList[serverInfo.Tag], serverInfo.ID)
	ServerLock.Unlock()
	ReSortServer()
	// Successful response
	return &ServerRegisterResponse{
		CommonResponse: CommonResponse{
			Code:    200,
			Message: "Server created successfully",
		},
		Secret: serverInfo.Secret,
	}
}

func (m *MonitorAPIService) GetMonitorHistories(query map[string]any) *MonitorInfoResponse {
	var (
		resultMap        = make(map[uint64]*MonitorInfo)
		monitorHistories []*model.MonitorHistory
		sortedMonitorIDs []uint64
	)
	res := &MonitorInfoResponse{
		CommonResponse: CommonResponse{
			Code:    0,
			Message: "success",
		},
	}
	since := time.Now().Add(-24 * time.Hour)
	var pendingHistories []*model.MonitorHistory
	if serverID, ok := query["server_id"].(uint64); ok && ServiceSentinelShared != nil {
		// 先取内存快照再查 SQLite；即使期间恰好完成落库，后面也会按采集时间去重。
		pendingHistories = ServiceSentinelShared.pendingMonitorHistories(serverID, since)
	}
	if err := DB.Model(&model.MonitorHistory{}).Select("monitor_id, created_at, server_id, avg_delay").
		Where(query).Where("created_at >= ?", since).Order("monitor_id, created_at").
		Scan(&monitorHistories).Error; err != nil {
		res.CommonResponse = CommonResponse{
			Code:    500,
			Message: err.Error(),
		}
	} else {
		monitorHistories = append(monitorHistories, pendingHistories...)
		sort.Slice(monitorHistories, func(i, j int) bool {
			if monitorHistories[i].MonitorID == monitorHistories[j].MonitorID {
				return monitorHistories[i].CreatedAt.Before(monitorHistories[j].CreatedAt)
			}
			return monitorHistories[i].MonitorID < monitorHistories[j].MonitorID
		})
		type historyKey struct {
			monitorID uint64
			serverID  uint64
			createdAt int64
		}
		seen := make(map[historyKey]struct{}, len(monitorHistories))
		ServiceSentinelShared.monitorsLock.RLock()
		defer ServiceSentinelShared.monitorsLock.RUnlock()
		ServerLock.RLock()
		defer ServerLock.RUnlock()
		for _, history := range monitorHistories {
			if ServiceSentinelShared.monitors[history.MonitorID] == nil || ServerList[history.ServerID] == nil {
				continue
			}
			key := historyKey{monitorID: history.MonitorID, serverID: history.ServerID, createdAt: history.CreatedAt.UnixNano()}
			if _, ok := seen[key]; ok {
				continue
			}
			seen[key] = struct{}{}
			infos, ok := resultMap[history.MonitorID]
			if !ok {
				infos = &MonitorInfo{
					MonitorID:   history.MonitorID,
					ServerID:    history.ServerID,
					MonitorName: ServiceSentinelShared.monitors[history.MonitorID].Name,
					ServerName:  ServerList[history.ServerID].Name,
				}
				resultMap[history.MonitorID] = infos
				sortedMonitorIDs = append(sortedMonitorIDs, history.MonitorID)
			}
			infos.CreatedAt = append(infos.CreatedAt, history.CreatedAt.Truncate(time.Minute).Unix()*1000)
			infos.AvgDelay = append(infos.AvgDelay, history.AvgDelay)
		}
		for _, monitorID := range sortedMonitorIDs {
			res.Result = append(res.Result, resultMap[monitorID])
		}
	}
	return res
}
