package singleton

import (
	"encoding/json"
	"log"
	"sort"
	"strings"
	"time"

	"github.com/nicksnyder/go-i18n/v2/i18n"

	"github.com/railzen/nezha-zero/model"
)

func loadExpirationReminders() {
	if _, err := Cron.AddFunc("0 0 9 * * *", CheckExpirationReminders); err != nil {
		log.Printf("NEZHA>> register expiration reminder failed: %v", err)
		return
	}
}

func CheckExpirationReminders() {
	var rules []model.AlertRule
	if err := DB.Order("id").Find(&rules).Error; err != nil {
		log.Printf("NEZHA>> load expiration reminder rules failed: %v", err)
		return
	}

	type serverExpiration struct {
		id         uint64
		name       string
		ip         string
		expiration time.Time
	}
	now := time.Now()
	var expirations []serverExpiration
	ServerLock.RLock()
	for id, server := range ServerList {
		if server == nil {
			continue
		}
		if expiration, ok := parsePublicNoteExpiration(server.PublicNote, now); ok {
			ip := ""
			if server.Host != nil {
				ip = IPDesensitize(server.Host.IP)
			}
			expirations = append(expirations, serverExpiration{id: id, name: server.Name, ip: ip, expiration: expiration})
		}
	}
	ServerLock.RUnlock()

	for _, rule := range rules {
		if !rule.Enabled() || !rule.IsExpirationRule() {
			continue
		}
		config := rule.Rules[0]
		var due []serverExpiration
		for _, item := range expirations {
			if !expirationReminderCoversServer(config.Cover, config.Ignore, item.id) {
				continue
			}
			days := calendarDaysBetween(now.In(item.expiration.Location()), item.expiration)
			if days == config.AdvanceDays || (config.DailyReminder && days >= 0 && days < config.AdvanceDays) {
				due = append(due, item)
			}
		}
		if len(due) == 0 {
			continue
		}
		sort.Slice(due, func(i, j int) bool { return due[i].id < due[j].id })
		var message strings.Builder
		message.WriteString(Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "ExpirationReminderTitle"}))
		message.WriteByte(' ')
		message.WriteString(Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "ExpirationReminderIntro"}))
		for _, item := range due {
			days := calendarDaysBetween(now.In(item.expiration.Location()), item.expiration)
			message.WriteByte('\n')
			message.WriteString(Localizer.MustLocalize(&i18n.LocalizeConfig{
				MessageID:   "ExpirationReminderItem",
				PluralCount: days,
				TemplateData: map[string]interface{}{
					"Name": item.name,
					"IP":   item.ip,
					"Date": item.expiration.Format("2006-01-02"),
					"Days": days,
				},
			}))
		}
		SendNotification(rule.NotificationTag, message.String(), nil)
	}
}

func expirationReminderCoversServer(cover uint64, selected map[uint64]bool, id uint64) bool {
	if cover == model.RuleCoverIgnoreAll {
		return selected[id]
	}
	return !selected[id]
}

func calendarDaysBetween(from, to time.Time) int {
	fromDate := time.Date(from.Year(), from.Month(), from.Day(), 0, 0, 0, 0, time.UTC)
	to = to.In(from.Location())
	toDate := time.Date(to.Year(), to.Month(), to.Day(), 0, 0, 0, 0, time.UTC)
	return int(toDate.Sub(fromDate) / (24 * time.Hour))
}

func parsePublicNoteExpiration(publicNote string, now time.Time) (time.Time, bool) {
	var note struct {
		BillingDataMod struct {
			EndDate     string          `json:"endDate"`
			Cycle       string          `json:"cycle"`
			AutoRenewal json.RawMessage `json:"autoRenewal"`
		} `json:"billingDataMod"`
	}
	if json.Unmarshal([]byte(publicNote), &note) != nil {
		return time.Time{}, false
	}
	endDate := strings.TrimSpace(note.BillingDataMod.EndDate)
	if endDate == "" || strings.Contains(endDate, "0000-00-00") {
		return time.Time{}, false
	}
	expiration, ok := parsePublicNoteDate(endDate)
	if !ok || !publicNoteAutoRenewal(note.BillingDataMod.AutoRenewal) {
		return expiration, ok
	}
	months := publicNoteCycleMonths(note.BillingDataMod.Cycle)
	if months == 0 {
		return time.Time{}, false
	}
	for i := 0; !expiration.After(now.In(expiration.Location())) && i < 2400; i++ {
		expiration = expiration.AddDate(0, months, 0)
	}
	return expiration, expiration.After(now.In(expiration.Location()))
}

func parsePublicNoteDate(value string) (time.Time, bool) {
	value = strings.TrimSpace(value)
	for _, layout := range []string{time.RFC3339Nano, "2006-01-02 15:04:05Z07:00"} {
		if parsed, err := time.Parse(layout, value); err == nil {
			return parsed, true
		}
	}
	location := time.FixedZone("UTC+8", 8*60*60)
	for _, layout := range []string{"2006-01-02", "2006-01-02T15:04:05", "2006-01-02 15:04:05"} {
		if parsed, err := time.ParseInLocation(layout, value, location); err == nil {
			return parsed, true
		}
	}
	return time.Time{}, false
}

func publicNoteAutoRenewal(raw json.RawMessage) bool {
	value := strings.Trim(strings.TrimSpace(string(raw)), `"`)
	return value == "1" || strings.EqualFold(value, "true")
}

func publicNoteCycleMonths(cycle string) int {
	switch strings.ToLower(strings.TrimSpace(cycle)) {
	case "月", "mo", "month", "monthly", "m":
		return 1
	case "季", "quarterly", "q":
		return 3
	case "半", "半年", "half", "semi-annually", "h":
		return 6
	case "年", "yr", "year", "annually", "y":
		return 12
	default:
		return 0
	}
}
