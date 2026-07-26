package model

import (
	"crypto/tls"
	"errors"
	"fmt"
	"io"
	"mime"
	"net"
	"net/http"
	"net/mail"
	"net/smtp"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/railzen/nezha-zero/pkg/utils"
)

const (
	NotificationTypeWebhook = iota
	NotificationTypeTelegram
	NotificationTypeEmail
)

const notificationSendTimeout = 10 * time.Second

const (
	_ = iota
	NotificationRequestTypeJSON
	NotificationRequestTypeForm
)

const (
	_ = iota
	NotificationRequestMethodGET
	NotificationRequestMethodPOST
)

type NotificationServerBundle struct {
	Notification *Notification
	Server       *Server
	Loc          *time.Location
}

type Notification struct {
	Common
	Name           string
	Tag            string // 分组名
	Type           uint8  `gorm:"default:0"`
	URL            string
	RequestMethod  int
	RequestType    int
	RequestHeader  string `gorm:"type:longtext" `
	RequestBody    string `gorm:"type:longtext" `
	VerifySSL      *bool
	TelegramToken  string
	TelegramChatID string
	SMTPHost       string
	SMTPPort       int
	SMTPTLS        bool
	SMTPUsername   string
	SMTPPassword   string
	EmailTo        string
}

func (ns *NotificationServerBundle) reqURL(message string) string {
	n := ns.Notification
	return ns.replaceParamsInString(n.URL, message, func(msg string) string {
		return url.QueryEscape(msg)
	})
}

func (n *Notification) reqMethod() (string, error) {
	switch n.RequestMethod {
	case NotificationRequestMethodPOST:
		return http.MethodPost, nil
	case NotificationRequestMethodGET:
		return http.MethodGet, nil
	}
	return "", errors.New("不支持的请求方式")
}

func (ns *NotificationServerBundle) reqBody(message string) (string, error) {
	n := ns.Notification
	if n.RequestMethod == NotificationRequestMethodGET || message == "" {
		return "", nil
	}
	switch n.RequestType {
	case NotificationRequestTypeJSON:
		return ns.replaceParamsInString(n.RequestBody, message, func(msg string) string {
			msgBytes, _ := utils.Json.Marshal(msg)
			return string(msgBytes)[1 : len(msgBytes)-1]
		}), nil
	case NotificationRequestTypeForm:
		data, err := utils.GjsonParseStringMap(n.RequestBody)
		if err != nil {
			return "", err
		}
		params := url.Values{}
		for k, v := range data {
			params.Add(k, ns.replaceParamsInString(v, message, nil))
		}
		return params.Encode(), nil
	}
	return "", errors.New("不支持的请求类型")
}

func (n *Notification) setContentType(req *http.Request) {
	if n.RequestMethod == NotificationRequestMethodGET {
		return
	}
	if n.RequestType == NotificationRequestTypeForm {
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	} else {
		req.Header.Set("Content-Type", "application/json")
	}
}

func (n *Notification) setRequestHeader(req *http.Request) error {
	if n.RequestHeader == "" {
		return nil
	}
	m, err := utils.GjsonParseStringMap(n.RequestHeader)
	if err != nil {
		return err
	}
	for k, v := range m {
		req.Header.Set(k, v)
	}
	return nil
}

func (ns *NotificationServerBundle) Send(message string) error {
	switch ns.Notification.Type {
	case NotificationTypeWebhook:
		return ns.sendWebhook(message)
	case NotificationTypeTelegram:
		return ns.sendTelegram(message)
	case NotificationTypeEmail:
		return ns.sendEmail(message)
	default:
		return errors.New("不支持的通知方式类型")
	}
}

func (ns *NotificationServerBundle) sendWebhook(message string) error {
	var client *http.Client
	n := ns.Notification
	if n.VerifySSL != nil && *n.VerifySSL {
		client = utils.HttpClient
	} else {
		client = utils.HttpClientSkipTlsVerify
	}

	reqBody, err := ns.reqBody(message)
	if err != nil {
		return err
	}

	reqMethod, err := n.reqMethod()
	if err != nil {
		return err
	}

	req, err := http.NewRequest(reqMethod, ns.reqURL(message), strings.NewReader(reqBody))
	if err != nil {
		return err
	}

	n.setContentType(req)

	if err := n.setRequestHeader(req); err != nil {
		return err
	}

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("%d@%s %s", resp.StatusCode, resp.Status, string(body))
	} else {
		_, _ = io.Copy(io.Discard, resp.Body)
	}

	return nil
}

// replaceParamInString 替换字符串中的占位符
func (ns *NotificationServerBundle) replaceParamsInString(str string, message string, mod func(string) string) string {
	if mod == nil {
		mod = func(s string) string {
			return s
		}
	}

	str = strings.ReplaceAll(str, "#NEZHA#", mod(message))
	str = strings.ReplaceAll(str, "#DATETIME#", mod(time.Now().In(ns.Loc).String()))

	if ns.Server != nil {
		str = strings.ReplaceAll(str, "#SERVER.NAME#", mod(ns.Server.Name))
		str = strings.ReplaceAll(str, "#SERVER.ID#", mod(fmt.Sprintf("%d", ns.Server.ID)))
		str = strings.ReplaceAll(str, "#SERVER.CPU#", mod(fmt.Sprintf("%f", ns.Server.State.CPU)))
		str = strings.ReplaceAll(str, "#SERVER.MEM#", mod(fmt.Sprintf("%d", ns.Server.State.MemUsed)))
		str = strings.ReplaceAll(str, "#SERVER.SWAP#", mod(fmt.Sprintf("%d", ns.Server.State.SwapUsed)))
		str = strings.ReplaceAll(str, "#SERVER.DISK#", mod(fmt.Sprintf("%d", ns.Server.State.DiskUsed)))
		str = strings.ReplaceAll(str, "#SERVER.MEMUSED#", mod(fmt.Sprintf("%d", ns.Server.State.MemUsed)))
		str = strings.ReplaceAll(str, "#SERVER.SWAPUSED#", mod(fmt.Sprintf("%d", ns.Server.State.SwapUsed)))
		str = strings.ReplaceAll(str, "#SERVER.DISKUSED#", mod(fmt.Sprintf("%d", ns.Server.State.DiskUsed)))
		str = strings.ReplaceAll(str, "#SERVER.MEMTOTAL#", mod(fmt.Sprintf("%d", ns.Server.Host.MemTotal)))
		str = strings.ReplaceAll(str, "#SERVER.SWAPTOTAL#", mod(fmt.Sprintf("%d", ns.Server.Host.SwapTotal)))
		str = strings.ReplaceAll(str, "#SERVER.DISKTOTAL#", mod(fmt.Sprintf("%d", ns.Server.Host.DiskTotal)))
		str = strings.ReplaceAll(str, "#SERVER.NETINSPEED#", mod(fmt.Sprintf("%d", ns.Server.State.NetInSpeed)))
		str = strings.ReplaceAll(str, "#SERVER.NETOUTSPEED#", mod(fmt.Sprintf("%d", ns.Server.State.NetOutSpeed)))
		str = strings.ReplaceAll(str, "#SERVER.TRANSFERIN#", mod(fmt.Sprintf("%d", ns.Server.State.NetInTransfer)))
		str = strings.ReplaceAll(str, "#SERVER.TRANSFEROUT#", mod(fmt.Sprintf("%d", ns.Server.State.NetOutTransfer)))
		str = strings.ReplaceAll(str, "#SERVER.NETINTRANSFER#", mod(fmt.Sprintf("%d", ns.Server.State.NetInTransfer)))
		str = strings.ReplaceAll(str, "#SERVER.NETOUTTRANSFER#", mod(fmt.Sprintf("%d", ns.Server.State.NetOutTransfer)))
		str = strings.ReplaceAll(str, "#SERVER.LOAD1#", mod(fmt.Sprintf("%f", ns.Server.State.Load1)))
		str = strings.ReplaceAll(str, "#SERVER.LOAD5#", mod(fmt.Sprintf("%f", ns.Server.State.Load5)))
		str = strings.ReplaceAll(str, "#SERVER.LOAD15#", mod(fmt.Sprintf("%f", ns.Server.State.Load15)))
		str = strings.ReplaceAll(str, "#SERVER.TCPCONNCOUNT#", mod(fmt.Sprintf("%d", ns.Server.State.TcpConnCount)))
		str = strings.ReplaceAll(str, "#SERVER.UDPCONNCOUNT#", mod(fmt.Sprintf("%d", ns.Server.State.UdpConnCount)))

		var ipv4, ipv6, validIP string
		ipList := strings.Split(ns.Server.Host.IP, "/")
		if len(ipList) > 1 {
			// 双栈
			ipv4 = ipList[0]
			ipv6 = ipList[1]
			validIP = ipv4
		} else if len(ipList) == 1 {
			// 仅ipv4|ipv6
			if strings.Contains(ipList[0], ":") {
				ipv6 = ipList[0]
				validIP = ipv6
			} else {
				ipv4 = ipList[0]
				validIP = ipv4
			}
		}

		str = strings.ReplaceAll(str, "#SERVER.IP#", mod(validIP))
		str = strings.ReplaceAll(str, "#SERVER.IPV4#", mod(ipv4))
		str = strings.ReplaceAll(str, "#SERVER.IPV6#", mod(ipv6))
	}

	return str
}

func (ns *NotificationServerBundle) sendTelegram(message string) error {
	n := ns.Notification
	if n.TelegramToken == "" || n.TelegramChatID == "" {
		return errors.New("Telegram Token 和会话 ID 不能为空")
	}
	endpoint := "https://api.telegram.org/bot" + url.PathEscape(n.TelegramToken) + "/sendMessage"
	client := *utils.HttpClient
	client.Timeout = notificationSendTimeout
	response, err := client.PostForm(endpoint, url.Values{
		"chat_id": {n.TelegramChatID},
		"text":    {message},
	})
	if err != nil {
		errMessage := strings.ReplaceAll(err.Error(), n.TelegramToken, "***")
		errMessage = strings.ReplaceAll(errMessage, url.PathEscape(n.TelegramToken), "***")
		return errors.New(errMessage)
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return fmt.Errorf("Telegram 返回 HTTP %d", response.StatusCode)
	}
	return nil
}

func (ns *NotificationServerBundle) sendEmail(message string) error {
	n := ns.Notification
	if n.SMTPHost == "" || n.SMTPPort < 1 || n.SMTPPort > 65535 ||
		n.SMTPUsername == "" || n.SMTPPassword == "" || n.EmailTo == "" {
		return errors.New("邮件通知需要有效的 SMTP 地址、端口、用户名、密码和目标邮箱地址")
	}
	to, err := mail.ParseAddress(n.EmailTo)
	if err != nil {
		return errors.New("目标邮箱地址格式不正确")
	}
	from, err := mail.ParseAddress(n.SMTPUsername)
	if err != nil {
		return errors.New("SMTP 用户名必须是有效的发件邮箱地址")
	}

	address := net.JoinHostPort(n.SMTPHost, strconv.Itoa(n.SMTPPort))
	connection, err := (&net.Dialer{Timeout: notificationSendTimeout}).Dial("tcp", address)
	if err != nil {
		return err
	}
	if err = connection.SetDeadline(time.Now().Add(notificationSendTimeout)); err != nil {
		connection.Close()
		return err
	}

	if n.SMTPTLS && n.SMTPPort == 465 {
		connection = tls.Client(connection, &tls.Config{MinVersion: tls.VersionTLS12, ServerName: n.SMTPHost})
	}
	client, err := smtp.NewClient(connection, n.SMTPHost)
	if err != nil {
		connection.Close()
		return err
	}
	defer client.Close()
	if n.SMTPTLS && n.SMTPPort != 465 {
		if err := client.StartTLS(&tls.Config{MinVersion: tls.VersionTLS12, ServerName: n.SMTPHost}); err != nil {
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
		auth = notificationSMTPPlainAuth{n.SMTPUsername, n.SMTPPassword}
	case strings.Contains(strings.ToUpper(methods), "LOGIN"):
		auth = notificationSMTPLoginAuth{n.SMTPUsername, n.SMTPPassword}
	default:
		return fmt.Errorf("SMTP 服务器不支持 PLAIN 或 LOGIN 认证：%s", methods)
	}
	if err := client.Auth(auth); err != nil {
		return fmt.Errorf("SMTP 身份认证失败：%w", err)
	}
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
	subject := "Nezha Notification"
	if firstLine := strings.TrimSpace(strings.SplitN(message, "\n", 2)[0]); firstLine != "" {
		subject = firstLine
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

type notificationSMTPPlainAuth struct{ username, password string }

func (a notificationSMTPPlainAuth) Start(*smtp.ServerInfo) (string, []byte, error) {
	return "PLAIN", []byte("\x00" + a.username + "\x00" + a.password), nil
}

func (notificationSMTPPlainAuth) Next([]byte, bool) ([]byte, error) { return nil, nil }

type notificationSMTPLoginAuth struct{ username, password string }

func (a notificationSMTPLoginAuth) Start(*smtp.ServerInfo) (string, []byte, error) {
	return "LOGIN", nil, nil
}

func (a notificationSMTPLoginAuth) Next(challenge []byte, more bool) ([]byte, error) {
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
