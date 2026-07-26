package singleton

import (
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"mime"
	"net"
	"net/mail"
	"net/smtp"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/utils"
)

var expirationReminderSent = struct {
	sync.Mutex
	telegram map[uint64]string
	email    map[uint64]string
}{
	telegram: make(map[uint64]string),
	email:    make(map[uint64]string),
}

func loadExpirationReminders() {
	if err := DB.AutoMigrate(&model.ExpirationReminderRule{}); err != nil {
		log.Printf("NEZHA>> migrate expiration reminder rules failed: %v", err)
		return
	}
	if _, err := Cron.AddFunc("0 0 9 * * *", checkExpirationReminders); err != nil {
		log.Printf("NEZHA>> register expiration reminder failed: %v", err)
		return
	}
	go checkExpirationReminders()
}

func ForgetExpirationReminderRule(id uint64) {
	expirationReminderSent.Lock()
	delete(expirationReminderSent.telegram, id)
	delete(expirationReminderSent.email, id)
	expirationReminderSent.Unlock()
}

func checkExpirationReminders() {
	var rules []model.ExpirationReminderRule
	if err := DB.Order("id").Find(&rules).Error; err != nil {
		log.Printf("NEZHA>> load expiration reminder rules failed: %v", err)
		return
	}
	if len(rules) == 0 {
		return
	}

	type serverExpiration struct {
		id         uint64
		name       string
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
			expirations = append(expirations, serverExpiration{id: id, name: server.Name, expiration: expiration})
		}
	}
	ServerLock.RUnlock()

	dateKey := now.In(Loc).Format("2006-01-02")
	for _, rule := range rules {
		selected, err := expirationReminderServerSet(rule.SkipServersRaw)
		if err != nil {
			log.Printf("NEZHA>> expiration reminder rule %d has invalid server list: %v", rule.ID, err)
			continue
		}
		var due []serverExpiration
		for _, item := range expirations {
			if !expirationReminderCoversServer(rule.Cover, selected, item.id) {
				continue
			}
			days := calendarDaysBetween(now.In(item.expiration.Location()), item.expiration)
			if days == rule.AdvanceDays || (rule.DailyReminder && days >= 0 && days < rule.AdvanceDays) {
				due = append(due, item)
			}
		}
		if len(due) == 0 {
			continue
		}
		sort.Slice(due, func(i, j int) bool { return due[i].id < due[j].id })
		var message strings.Builder
		message.WriteString("【服务器到期提醒】\n")
		message.WriteString("以下服务器即将到期，请您关注：")
		for _, item := range due {
			days := calendarDaysBetween(now.In(item.expiration.Location()), item.expiration)
			fmt.Fprintf(&message, "\n- %s（ID: %d）将于 %s 到期，剩余 %d 天",
				item.name, item.id, item.expiration.Format("2006-01-02"), days)
		}
		if rule.TelegramEnabled && claimExpirationReminder(rule.ID, dateKey, true) {
			if err := SendExpirationTelegram(rule, message.String()); err != nil {
				releaseExpirationReminder(rule.ID, dateKey, true)
				log.Printf("NEZHA>> Telegram expiration reminder rule %d failed: %v", rule.ID, err)
			}
		}
		if rule.EmailEnabled && claimExpirationReminder(rule.ID, dateKey, false) {
			if err := SendExpirationEmail(rule, "Nezha 服务器到期提醒", message.String()); err != nil {
				releaseExpirationReminder(rule.ID, dateKey, false)
				log.Printf("NEZHA>> email expiration reminder rule %d failed: %v", rule.ID, err)
			}
		}
	}
}

func expirationReminderServerSet(raw string) (map[uint64]bool, error) {
	var ids []uint64
	if err := json.Unmarshal([]byte(raw), &ids); err != nil {
		return nil, err
	}
	selected := make(map[uint64]bool, len(ids))
	for _, id := range ids {
		selected[id] = true
	}
	return selected, nil
}

func expirationReminderCoversServer(cover uint8, selected map[uint64]bool, id uint64) bool {
	if cover == model.MonitorCoverIgnoreAll {
		return selected[id]
	}
	return !selected[id]
}

func claimExpirationReminder(id uint64, date string, telegram bool) bool {
	expirationReminderSent.Lock()
	defer expirationReminderSent.Unlock()
	sent := expirationReminderSent.email
	if telegram {
		sent = expirationReminderSent.telegram
	}
	if sent[id] == date {
		return false
	}
	sent[id] = date
	return true
}

func releaseExpirationReminder(id uint64, date string, telegram bool) {
	expirationReminderSent.Lock()
	defer expirationReminderSent.Unlock()
	sent := expirationReminderSent.email
	if telegram {
		sent = expirationReminderSent.telegram
	}
	if sent[id] == date {
		delete(sent, id)
	}
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

func SendExpirationTelegram(rule model.ExpirationReminderRule, message string) error {
	endpoint := "https://api.telegram.org/bot" + url.PathEscape(rule.TelegramToken) + "/sendMessage"
	response, err := utils.HttpClient.PostForm(endpoint, url.Values{
		"chat_id": {rule.TelegramChatID},
		"text":    {message},
	})
	if err != nil {
		return err
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return fmt.Errorf("Telegram 返回 HTTP %d", response.StatusCode)
	}
	return nil
}

func SendExpirationEmail(rule model.ExpirationReminderRule, subject, message string) error {
	address := net.JoinHostPort(rule.SMTPHost, strconv.Itoa(rule.SMTPPort))
	var client *smtp.Client
	if rule.SMTPTLS && rule.SMTPPort == 465 {
		connection, err := tls.Dial("tcp", address, &tls.Config{MinVersion: tls.VersionTLS12, ServerName: rule.SMTPHost})
		if err != nil {
			return err
		}
		client, err = smtp.NewClient(connection, rule.SMTPHost)
		if err != nil {
			connection.Close()
			return err
		}
	} else {
		var err error
		client, err = smtp.Dial(address)
		if err != nil {
			return err
		}
	}
	defer client.Close()
	if rule.SMTPTLS && rule.SMTPPort != 465 {
		if err := client.StartTLS(&tls.Config{MinVersion: tls.VersionTLS12, ServerName: rule.SMTPHost}); err != nil {
			return err
		}
	}
	ok, methods := client.Extension("AUTH")
	if !ok {
		return errors.New("SMTP 服务器不支持身份认证")
	}
	var auth smtp.Auth
	switch {
	case strings.Contains(strings.ToUpper(methods), "PLAIN"):
		auth = expirationSMTPPlainAuth{rule.SMTPUsername, rule.SMTPPassword}
	case strings.Contains(strings.ToUpper(methods), "LOGIN"):
		auth = expirationSMTPLoginAuth{rule.SMTPUsername, rule.SMTPPassword}
	default:
		return fmt.Errorf("SMTP 服务器不支持 PLAIN 或 LOGIN 认证：%s", methods)
	}
	if err := client.Auth(auth); err != nil {
		return fmt.Errorf("SMTP 身份认证失败：%w", err)
	}
	to, _ := mail.ParseAddress(rule.EmailTo)
	from, _ := mail.ParseAddress(rule.SMTPUsername)
	if err := client.Mail(from.Address); err != nil {
		return err
	}
	if err := client.Rcpt(to.Address); err != nil {
		return err
	}
	writer, err := client.Data()
	if err != nil {
		return err
	}
	body := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n%s\r\n",
		from.Address, to.Address, mime.QEncoding.Encode("UTF-8", subject), message)
	if _, err = writer.Write([]byte(body)); err != nil {
		_ = writer.Close()
		return err
	}
	if err = writer.Close(); err != nil {
		return err
	}
	return client.Quit()
}

type expirationSMTPPlainAuth struct{ username, password string }

func (a expirationSMTPPlainAuth) Start(*smtp.ServerInfo) (string, []byte, error) {
	return "PLAIN", []byte("\x00" + a.username + "\x00" + a.password), nil
}
func (expirationSMTPPlainAuth) Next([]byte, bool) ([]byte, error) { return nil, nil }

type expirationSMTPLoginAuth struct{ username, password string }

func (a expirationSMTPLoginAuth) Start(*smtp.ServerInfo) (string, []byte, error) {
	return "LOGIN", nil, nil
}
func (a expirationSMTPLoginAuth) Next(challenge []byte, more bool) ([]byte, error) {
	if !more {
		return nil, nil
	}
	switch {
	case strings.Contains(strings.ToLower(string(challenge)), "username"):
		return []byte(a.username), nil
	case strings.Contains(strings.ToLower(string(challenge)), "password"):
		return []byte(a.password), nil
	default:
		return nil, fmt.Errorf("未知的 SMTP LOGIN 验证步骤：%s", challenge)
	}
}
