package singleton

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/audit"
)

const (
	serverOfflineThreshold = 10 * time.Minute
	highLoadDuration       = 15 * time.Minute
	highLoadCPUThreshold   = 85.0
	highMemoryThreshold    = 96.0
	auditWatchdogInterval  = 30 * time.Second
)

var auditWatchdogStartedAt time.Time

type serverWatchState struct {
	wasOnline      bool
	offlineLogged  bool
	highLoadSince  time.Time
	highLoadLogged bool
	highMemSince   time.Time
	highMemLogged  bool
}

type serverWatchSnapshot struct {
	id         uint64
	name       string
	lastActive time.Time
	cpu        float64
	memUsed    uint64
	memTotal   uint64
}

// StartAuditWatchdog 启动意外关机、服务器上下线及资源使用率巡检。
func StartAuditWatchdog() {
	auditWatchdogStartedAt = time.Now()
	checkUnexpectedShutdown()
	go auditWatchdogLoop()
}

func checkUnexpectedShutdown() {
	if DB == nil {
		return
	}
	var lastStart model.AuditLog
	if err := DB.Where("type = ? AND action = ?", audit.TypeEvent, "Dashboard started").
		Order("created_at DESC").First(&lastStart).Error; err != nil {
		return
	}
	var gracefulStop model.AuditLog
	if err := DB.Where(
		"type = ? AND action = ? AND created_at > ? AND detail LIKE ?",
		audit.TypeEvent, "Dashboard stopped", lastStart.CreatedAt, "%graceful%",
	).Order("created_at DESC").First(&gracefulStop).Error; err == nil {
		return
	}
	lastActivity := dbLastActivityTime()
	var detail string
	if !lastActivity.IsZero() {
		detail = fmt.Sprintf("last active at %s", formatAuditLogTime(lastActivity))
	} else {
		detail = "unexpected shutdown detected"
	}
	audit.Record(nil, audit.TypeEvent, "Dashboard stopped", detail)
}

func dbLastActivityTime() time.Time {
	if DB == nil {
		return time.Time{}
	}
	var maxTS sql.NullString
	err := DB.Raw(`
SELECT MAX(t) FROM (
  SELECT MAX(updated_at) AS t FROM servers
  UNION ALL SELECT MAX(created_at) FROM servers
  UNION ALL SELECT MAX(updated_at) FROM users
  UNION ALL SELECT MAX(created_at) FROM users
  UNION ALL SELECT MAX(updated_at) FROM notifications
  UNION ALL SELECT MAX(created_at) FROM notifications
  UNION ALL SELECT MAX(updated_at) FROM alert_rules
  UNION ALL SELECT MAX(created_at) FROM alert_rules
  UNION ALL SELECT MAX(updated_at) FROM monitors
  UNION ALL SELECT MAX(created_at) FROM monitors
  UNION ALL SELECT MAX(updated_at) FROM monitor_histories
  UNION ALL SELECT MAX(created_at) FROM monitor_histories
  UNION ALL SELECT MAX(updated_at) FROM crons
  UNION ALL SELECT MAX(created_at) FROM crons
  UNION ALL SELECT MAX(updated_at) FROM transfers
  UNION ALL SELECT MAX(created_at) FROM transfers
  UNION ALL SELECT MAX(updated_at) FROM api_tokens
  UNION ALL SELECT MAX(created_at) FROM api_tokens
  UNION ALL SELECT MAX(updated_at) FROM nats
  UNION ALL SELECT MAX(created_at) FROM nats
  UNION ALL SELECT MAX(updated_at) FROM ddns
  UNION ALL SELECT MAX(created_at) FROM ddns
  UNION ALL SELECT MAX(updated_at) FROM audit_logs
  UNION ALL SELECT MAX(created_at) FROM audit_logs
)`).Scan(&maxTS).Error
	if err != nil || !maxTS.Valid {
		return time.Time{}
	}
	return parseSQLiteDateTime(maxTS.String)
}

func formatAuditLogTime(t time.Time) string {
	loc := Loc
	if loc == nil {
		loc = time.FixedZone("UTC+8", 8*60*60)
	}
	return t.In(loc).Format(time.RFC3339)
}

func parseSQLiteDateTime(value string) time.Time {
	value = strings.TrimSpace(value)
	if value == "" {
		return time.Time{}
	}
	for _, layout := range []string{
		time.RFC3339Nano,
		time.RFC3339,
		"2006-01-02 15:04:05.999999999-07:00",
		"2006-01-02 15:04:05",
	} {
		if parsed, err := time.Parse(layout, value); err == nil {
			return parsed
		}
	}
	return time.Time{}
}

func auditWatchdogLoop() {
	ticker := time.NewTicker(auditWatchdogInterval)
	defer ticker.Stop()
	serverStates := make(map[uint64]*serverWatchState)
	for {
		checkServerStates(serverStates)
		<-ticker.C
	}
}

func isServerOnline(lastActive time.Time) bool {
	if lastActive.IsZero() {
		return false
	}
	return time.Since(lastActive) < serverOfflineThreshold
}

func snapshotMemoryPercent(snapshot serverWatchSnapshot) float64 {
	if snapshot.memTotal == 0 {
		return 0
	}
	return float64(snapshot.memUsed) / float64(snapshot.memTotal) * 100
}

func snapshotServersForWatch() []serverWatchSnapshot {
	ServerLock.RLock()
	defer ServerLock.RUnlock()

	snapshots := make([]serverWatchSnapshot, 0, len(ServerList))
	for id, server := range ServerList {
		if server == nil {
			continue
		}
		host, state, lastActive, _, _ := server.RuntimeSnapshot()
		snapshot := serverWatchSnapshot{
			id:         id,
			name:       server.Name,
			lastActive: lastActive,
		}
		if state != nil {
			snapshot.cpu = state.CPU
			snapshot.memUsed = state.MemUsed
		}
		if host != nil {
			snapshot.memTotal = host.MemTotal
		}
		snapshots = append(snapshots, snapshot)
	}
	return snapshots
}

func checkServerStates(states map[uint64]*serverWatchState) {
	for _, snapshot := range snapshotServersForWatch() {
		id := snapshot.id
		online := isServerOnline(snapshot.lastActive)
		state, ok := states[id]
		if !ok {
			states[id] = &serverWatchState{wasOnline: online}
			continue
		}
		if online && !state.wasOnline {
			if auditWatchdogStartedAt.IsZero() || time.Since(auditWatchdogStartedAt) >= 3*time.Minute {
				if state.offlineLogged {
					audit.Record(nil, audit.TypeEvent, "Server offline recovered",
						fmt.Sprintf("server: %s (ID %d)", snapshot.name, id))
				} else {
					audit.Record(nil, audit.TypeEvent, "Server online",
						fmt.Sprintf("server: %s (ID %d)", snapshot.name, id))
				}
			}
			state.offlineLogged = false
			state.highLoadSince = time.Time{}
			state.highLoadLogged = false
			state.highMemSince = time.Time{}
			state.highMemLogged = false
		}
		if !online && state.wasOnline && !state.offlineLogged {
			if snapshot.lastActive.IsZero() || time.Since(snapshot.lastActive) >= serverOfflineThreshold {
				detail := fmt.Sprintf("server: %s (ID %d)", snapshot.name, id)
				if !snapshot.lastActive.IsZero() {
					detail += fmt.Sprintf(", last active at %s", formatAuditLogTime(snapshot.lastActive))
				}
				audit.Record(nil, audit.TypeEvent, "Server offline", detail)
				state.offlineLogged = true
			}
		}
		if !online {
			state.highLoadSince = time.Time{}
			state.highLoadLogged = false
			state.highMemSince = time.Time{}
			state.highMemLogged = false
		} else {
			checkServerHighLoad(state, snapshot)
			checkServerHighMemory(state, snapshot)
		}
		state.wasOnline = online
	}
}

func checkServerHighLoad(state *serverWatchState, snapshot serverWatchSnapshot) {
	high := snapshot.cpu >= highLoadCPUThreshold
	if state.highLoadLogged && !high {
		audit.Record(nil, audit.TypeEvent, "Server high load recovered",
			fmt.Sprintf("server: %s (ID %d), CPU %.1f%%", snapshot.name, snapshot.id, snapshot.cpu))
		state.highLoadSince = time.Time{}
		state.highLoadLogged = false
		return
	}
	if !high {
		state.highLoadSince = time.Time{}
		return
	}
	now := time.Now()
	if state.highLoadSince.IsZero() {
		state.highLoadSince = now
		return
	}
	if state.highLoadLogged || time.Since(state.highLoadSince) < highLoadDuration {
		return
	}
	audit.Record(nil, audit.TypeEvent, "Server high load",
		fmt.Sprintf("server: %s (ID %d), CPU %.1f%%, sustained for %d minutes",
			snapshot.name, snapshot.id, snapshot.cpu, int(highLoadDuration.Minutes())))
	state.highLoadLogged = true
}

func checkServerHighMemory(state *serverWatchState, snapshot serverWatchSnapshot) {
	memory := snapshotMemoryPercent(snapshot)
	high := memory >= highMemoryThreshold
	if state.highMemLogged && !high {
		audit.Record(nil, audit.TypeEvent, "Server high memory recovered",
			fmt.Sprintf("server: %s (ID %d), memory %.1f%%", snapshot.name, snapshot.id, memory))
		state.highMemSince = time.Time{}
		state.highMemLogged = false
		return
	}
	if !high {
		state.highMemSince = time.Time{}
		return
	}
	now := time.Now()
	if state.highMemSince.IsZero() {
		state.highMemSince = now
		return
	}
	if state.highMemLogged || time.Since(state.highMemSince) < highLoadDuration {
		return
	}
	audit.Record(nil, audit.TypeEvent, "Server high memory",
		fmt.Sprintf("server: %s (ID %d), memory %.1f%%, sustained for %d minutes",
			snapshot.name, snapshot.id, memory, int(highLoadDuration.Minutes())))
	state.highMemLogged = true
}
