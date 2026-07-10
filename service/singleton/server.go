package singleton

import (
	"encoding/json"
	"log"
	"sort"
	"strings"
	"sync"

	"github.com/railzen/nezha-zero/model"
)

var (
	ServerList        map[uint64]*model.Server // [ServerID] -> model.Server
	SecretToID        map[string]uint64        // [ServerSecret] -> ServerID
	ServerTagToIDList map[string][]uint64      // [ServerTag] -> ServerID
	ServerLock        sync.RWMutex

	SortedServerList         []*model.Server // 用于存储服务器列表的 slice，按照服务器 ID 排序
	SortedServerListForGuest []*model.Server
	SortedServerLock         sync.RWMutex
)

// InitServer 初始化 ServerID <-> Secret 的映射
func InitServer() {
	ServerList = make(map[uint64]*model.Server)
	SecretToID = make(map[string]uint64)
	ServerTagToIDList = make(map[string][]uint64)
}

// loadServers 加载服务器列表并根据ID排序
func loadServers() {
	InitServer()
	var servers []model.Server
	DB.Find(&servers)
	for _, s := range servers {
		innerS := s
		innerS.Host = &model.Host{}
		innerS.State = &model.HostState{}
		innerS.TaskCloseLock = new(sync.Mutex)
		innerS.TaskSendLock = new(sync.Mutex)
		innerS.TaskDispatchLock = new(sync.Mutex)
		innerS.RuntimeLock = new(sync.RWMutex)
		ServerList[innerS.ID] = &innerS
		innerS.Secret = strings.TrimSpace(innerS.Secret)
		if innerS.Secret == "" {
			log.Printf("NEZHA>> Server %d has empty secret, agent authentication disabled until secret is reset", innerS.ID)
		} else {
			SecretToID[innerS.Secret] = innerS.ID
		}
		ServerTagToIDList[innerS.Tag] = append(ServerTagToIDList[innerS.Tag], innerS.ID)
	}
	ReSortServer()
}

// ReSortServer 根据服务器ID 对服务器列表进行排序（ID越大越靠前）
func ReSortServer() {
	ServerLock.RLock()
	defer ServerLock.RUnlock()
	SortedServerLock.Lock()
	defer SortedServerLock.Unlock()

	SortedServerList = []*model.Server{}
	SortedServerListForGuest = []*model.Server{}
	for _, s := range ServerList {
		SortedServerList = append(SortedServerList, s)
		if !s.HideForGuest {
			SortedServerListForGuest = append(SortedServerListForGuest, s)
		}
	}

	// 按照服务器 ID 排序的具体实现（ID越大越靠前）
	sort.SliceStable(SortedServerList, func(i, j int) bool {
		if SortedServerList[i].DisplayIndex == SortedServerList[j].DisplayIndex {
			return SortedServerList[i].ID < SortedServerList[j].ID
		}
		return SortedServerList[i].DisplayIndex > SortedServerList[j].DisplayIndex
	})

	sort.SliceStable(SortedServerListForGuest, func(i, j int) bool {
		if SortedServerListForGuest[i].DisplayIndex == SortedServerListForGuest[j].DisplayIndex {
			return SortedServerListForGuest[i].ID < SortedServerListForGuest[j].ID
		}
		return SortedServerListForGuest[i].DisplayIndex > SortedServerListForGuest[j].DisplayIndex
	})
}

func ParseCountryCodeFromJson(jsonStr []byte) *string {
	var m map[string]interface{}
	if err := json.Unmarshal(jsonStr, &m); err != nil {
		return nil
	}

	v, ok := m["countryCode"]
	if !ok {
		return nil
	}

	s, ok := v.(string)
	if !ok {
		return nil
	}

	s = strings.TrimSpace(strings.ToLower(s))
	if len(s) != 2 {
		return nil
	}

	if s[0] < 'a' || s[0] > 'z' || s[1] < 'a' || s[1] > 'z' {
		return nil
	}

	return &s
}
