package rdp

import (
	"crypto/subtle"
	"crypto/tls"
	"encoding/asn1"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"path"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/utils"
	"github.com/railzen/nezha-zero/proto"
	"github.com/railzen/nezha-zero/service/rpc"
	"github.com/railzen/nezha-zero/service/singleton"
)

const (
	pendingSessionTTL       = 30 * time.Second
	maxPendingSessions      = 32
	maxActiveSessions       = 8
	maxActiveServerSessions = 2
	rdpConnectTimeout       = 15 * time.Second
	maxRDCleanPathPDU       = 64 << 10
	websocketBufferSize     = 64 << 10
	rdCleanPathVersion      = 3390
)

type pendingSession struct {
	ServerID uint64
	Expires  time.Time
}

// Manager owns one-time browser tunnel tokens and RDP session limits. RDP
// credentials are handled by IronRDP in the browser and never reach Dashboard.
type Manager struct {
	mu             sync.Mutex
	pending        map[string]*pendingSession
	activeTotal    int
	activeByServer map[uint64]int
	websocket      http.Handler
}

func NewManager() *Manager {
	m := &Manager{
		pending:        make(map[string]*pendingSession),
		activeByServer: make(map[uint64]int),
	}
	m.websocket = &websocketHandler{manager: m}
	return m
}

func ValidateServer(serverID uint64) (*model.Server, error) {
	return windowsRDPServer(serverID)
}

func IsWindowsPlatform(platform string) bool {
	return strings.Contains(strings.ToLower(platform), "windows")
}

func (m *Manager) Handler() http.Handler {
	return m.websocket
}

func (m *Manager) Create(serverID uint64) (string, error) {
	id, err := utils.GenerateRandomString(32)
	if err != nil {
		return "", err
	}

	now := time.Now()
	session := &pendingSession{ServerID: serverID, Expires: now.Add(pendingSessionTTL)}
	m.mu.Lock()
	m.pruneExpiredLocked(now)
	if len(m.pending) >= maxPendingSessions {
		m.mu.Unlock()
		return "", errors.New("too many pending remote desktop sessions")
	}
	m.pending[id] = session
	m.mu.Unlock()

	time.AfterFunc(pendingSessionTTL, func() {
		m.mu.Lock()
		if current, ok := m.pending[id]; ok && current == session && !time.Now().Before(session.Expires) {
			delete(m.pending, id)
		}
		m.mu.Unlock()
	})
	return id, nil
}

func (m *Manager) pruneExpiredLocked(now time.Time) {
	for id, session := range m.pending {
		if !now.Before(session.Expires) {
			delete(m.pending, id)
		}
	}
}

func (m *Manager) take(id string) (*pendingSession, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.pruneExpiredLocked(time.Now())
	session, ok := m.pending[id]
	if !ok {
		return nil, errors.New("remote desktop session is missing or expired")
	}
	delete(m.pending, id)
	return session, nil
}

func (m *Manager) reserve(serverID uint64) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.activeTotal >= maxActiveSessions {
		return errors.New("too many active remote desktop sessions")
	}
	if m.activeByServer[serverID] >= maxActiveServerSessions {
		return errors.New("this server already has too many remote desktop sessions")
	}
	m.activeTotal++
	m.activeByServer[serverID]++
	return nil
}

func (m *Manager) release(serverID uint64) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.activeTotal > 0 {
		m.activeTotal--
	}
	if m.activeByServer[serverID] <= 1 {
		delete(m.activeByServer, serverID)
	} else {
		m.activeByServer[serverID]--
	}
}

func (m *Manager) connect(token string) (net.Conn, error) {
	session, err := m.take(token)
	if err != nil {
		return nil, err
	}
	server, err := windowsRDPServer(session.ServerID)
	if err != nil {
		return nil, err
	}
	if err := m.reserve(session.ServerID); err != nil {
		return nil, err
	}

	streamID, err := utils.GenerateRandomString(32)
	if err != nil {
		m.release(session.ServerID)
		return nil, err
	}
	rpc.NezhaHandlerSingleton.CreateStream(streamID)
	userSide, gatewaySide := net.Pipe()
	cleanup := func() {
		_ = gatewaySide.Close()
		_ = rpc.NezhaHandlerSingleton.CloseStream(streamID)
		m.release(session.ServerID)
	}
	if err := rpc.NezhaHandlerSingleton.UserConnected(streamID, userSide); err != nil {
		cleanup()
		return nil, fmt.Errorf("register RDP tunnel: %w", err)
	}
	taskData, err := utils.Json.Marshal(model.TaskRDP{StreamID: streamID})
	if err != nil {
		cleanup()
		return nil, err
	}
	if err := server.SendTask(&proto.Task{Type: model.TaskTypeRDP, Data: string(taskData)}); err != nil {
		cleanup()
		return nil, fmt.Errorf("send RDP task: %w", err)
	}
	log.Printf("NEZHA>> IronRDP task sent to server %d; waiting for Agent bridge", session.ServerID)

	go func() {
		if err := rpc.NezhaHandlerSingleton.StartStream(streamID, rdpConnectTimeout); err != nil && !errors.Is(err, io.ErrClosedPipe) {
			log.Printf("NEZHA>> IronRDP Agent bridge closed: %v", err)
		}
		_ = gatewaySide.Close()
	}()
	return &managedConn{Conn: gatewaySide, close: cleanup}, nil
}

type managedConn struct {
	net.Conn
	closeOnce sync.Once
	close     func()
}

func (c *managedConn) Close() error {
	err := c.Conn.Close()
	c.closeOnce.Do(c.close)
	return err
}

func windowsRDPServer(serverID uint64) (*model.Server, error) {
	singleton.ServerLock.RLock()
	server := singleton.ServerList[serverID]
	singleton.ServerLock.RUnlock()
	if server == nil || server.TaskStream == nil {
		return nil, errors.New("server is offline")
	}
	host, state, _, _, _ := server.RuntimeSnapshot()
	if host == nil || !IsWindowsPlatform(host.Platform) {
		return nil, errors.New("remote desktop is only available for Windows servers")
	}
	if state == nil || !state.RDPAvailable {
		return nil, errors.New("Windows RDP service is not available")
	}
	return server, nil
}

type websocketHandler struct {
	manager *Manager
}

func (h *websocketHandler) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	upgrader := websocket.Upgrader{
		ReadBufferSize:  websocketBufferSize,
		WriteBufferSize: websocketBufferSize,
		CheckOrigin:     func(*http.Request) bool { return true }, // Checked by controller.
	}
	ws, err := upgrader.Upgrade(writer, request, nil)
	if err != nil {
		log.Printf("NEZHA>> IronRDP WebSocket upgrade failed: %v", err)
		return
	}
	defer ws.Close()

	token := path.Base(request.URL.Path)
	raw, err := h.manager.connect(token)
	if err != nil {
		closeWebsocket(ws, "RDP tunnel setup failed")
		log.Printf("NEZHA>> IronRDP tunnel setup failed: %v", err)
		return
	}
	defer raw.Close()

	tunnel, err := performRDCleanPath(ws, raw, token)
	if err != nil {
		closeWebsocket(ws, "RDP negotiation failed")
		log.Printf("NEZHA>> IronRDP negotiation failed: %v", err)
		return
	}
	defer tunnel.Close()

	errs := make(chan error, 2)
	go func() { errs <- copyWebsocketToRDP(ws, tunnel) }()
	go func() { errs <- copyRDPToWebsocket(ws, tunnel) }()
	if err := <-errs; err != nil && !isNormalWebsocketClose(err) && !errors.Is(err, io.EOF) {
		log.Printf("NEZHA>> IronRDP WebSocket closed: %v", err)
	}
}

// RDCleanPath is IronRDP's browser transport handshake. Dashboard forwards the
// X.224 negotiation through the Agent, performs the server-side TLS upgrade,
// then exposes the decrypted RDP stream inside the authenticated WebSocket.
func performRDCleanPath(ws *websocket.Conn, raw net.Conn, token string) (net.Conn, error) {
	if err := ws.SetReadDeadline(time.Now().Add(rdpConnectTimeout)); err != nil {
		return nil, err
	}
	requestDER, err := readRDCleanPathMessage(ws)
	if err != nil {
		return nil, err
	}
	var request rdCleanPathPDU
	if rest, err := asn1.Unmarshal(requestDER, &request); err != nil || len(rest) != 0 {
		return nil, fmt.Errorf("decode RDCleanPath request: %w", err)
	}
	if request.Version != rdCleanPathVersion || len(request.X224ConnectionPDU) == 0 {
		return nil, errors.New("invalid RDCleanPath request")
	}
	if subtle.ConstantTimeCompare([]byte(request.ProxyAuth), []byte(token)) != 1 {
		return nil, errors.New("invalid RDCleanPath authorization")
	}

	if err := raw.SetDeadline(time.Now().Add(rdpConnectTimeout)); err != nil {
		return nil, err
	}
	if _, err := raw.Write(request.X224ConnectionPDU); err != nil {
		return nil, fmt.Errorf("send X.224 request: %w", err)
	}
	x224Response, err := readTPKT(raw)
	if err != nil {
		return nil, fmt.Errorf("read X.224 response: %w", err)
	}
	if !negotiatedTLS(x224Response) {
		return nil, errors.New("RDP server did not negotiate TLS or NLA")
	}

	tlsConn := tls.Client(raw, &tls.Config{InsecureSkipVerify: true}) // The RDP host certificate is returned to IronRDP for CredSSP binding.
	if err := tlsConn.Handshake(); err != nil {
		return nil, fmt.Errorf("RDP TLS handshake: %w", err)
	}
	state := tlsConn.ConnectionState()
	certChain := make([][]byte, 0, len(state.PeerCertificates))
	for _, cert := range state.PeerCertificates {
		certChain = append(certChain, cert.Raw)
	}
	if len(certChain) == 0 {
		return nil, errors.New("RDP server did not provide a TLS certificate")
	}
	responseDER, err := asn1.Marshal(rdCleanPathPDU{
		Version:           rdCleanPathVersion,
		X224ConnectionPDU: x224Response,
		ServerCertChain:   certChain,
		ServerAddr:        "127.0.0.1",
	})
	if err != nil {
		return nil, fmt.Errorf("encode RDCleanPath response: %w", err)
	}
	if err := ws.WriteMessage(websocket.BinaryMessage, responseDER); err != nil {
		return nil, fmt.Errorf("send RDCleanPath response: %w", err)
	}
	if err := ws.SetReadDeadline(time.Time{}); err != nil {
		return nil, err
	}
	if err := raw.SetDeadline(time.Time{}); err != nil {
		return nil, err
	}
	return tlsConn, nil
}

type rdCleanPathPDU struct {
	Version           int           `asn1:"explicit,tag:0"`
	Error             asn1.RawValue `asn1:"optional,explicit,tag:1"`
	Destination       string        `asn1:"optional,explicit,tag:2,utf8"`
	ProxyAuth         string        `asn1:"optional,explicit,tag:3,utf8"`
	ServerAuth        string        `asn1:"optional,explicit,tag:4,utf8"`
	PreconnectionBlob string        `asn1:"optional,explicit,tag:5,utf8"`
	X224ConnectionPDU []byte        `asn1:"optional,explicit,tag:6"`
	ServerCertChain   [][]byte      `asn1:"optional,explicit,tag:7"`
	ServerAddr        string        `asn1:"optional,explicit,tag:9,utf8"`
}

func readRDCleanPathMessage(ws *websocket.Conn) ([]byte, error) {
	var data []byte
	for len(data) < maxRDCleanPathPDU {
		messageType, chunk, err := ws.ReadMessage()
		if err != nil {
			return nil, err
		}
		if messageType != websocket.BinaryMessage {
			continue
		}
		data = append(data, chunk...)
		total, complete, err := derMessageLength(data)
		if err != nil {
			return nil, err
		}
		if complete {
			if len(data) != total {
				return nil, errors.New("RDCleanPath request contains trailing data")
			}
			return data, nil
		}
	}
	return nil, errors.New("RDCleanPath request is too large")
}

func derMessageLength(data []byte) (int, bool, error) {
	if len(data) < 2 {
		return 0, false, nil
	}
	if data[0] != 0x30 {
		return 0, false, errors.New("RDCleanPath request is not a DER sequence")
	}
	length := int(data[1])
	header := 2
	if data[1]&0x80 != 0 {
		count := int(data[1] & 0x7f)
		if count == 0 || count > 4 {
			return 0, false, errors.New("invalid DER length")
		}
		if len(data) < 2+count {
			return 0, false, nil
		}
		length = 0
		for _, value := range data[2 : 2+count] {
			length = length<<8 | int(value)
		}
		header += count
	}
	total := header + length
	if total > maxRDCleanPathPDU {
		return 0, false, errors.New("RDCleanPath request is too large")
	}
	return total, len(data) >= total, nil
}

func readTPKT(reader io.Reader) ([]byte, error) {
	header := make([]byte, 4)
	if _, err := io.ReadFull(reader, header); err != nil {
		return nil, err
	}
	length := int(binary.BigEndian.Uint16(header[2:4]))
	if header[0] != 3 || length < len(header) || length > maxRDCleanPathPDU {
		return nil, errors.New("invalid RDP TPKT response")
	}
	packet := make([]byte, length)
	copy(packet, header)
	_, err := io.ReadFull(reader, packet[4:])
	return packet, err
}

func negotiatedTLS(response []byte) bool {
	for offset := 7; offset+8 <= len(response); offset++ {
		if response[offset] == 0x02 && binary.LittleEndian.Uint16(response[offset+2:offset+4]) == 8 {
			return binary.LittleEndian.Uint32(response[offset+4:offset+8]) != 0
		}
	}
	return false
}

func copyWebsocketToRDP(ws *websocket.Conn, rdp io.Writer) error {
	for {
		messageType, data, err := ws.ReadMessage()
		if err != nil {
			return err
		}
		if messageType == websocket.BinaryMessage {
			if _, err := rdp.Write(data); err != nil {
				return err
			}
		}
	}
}

func copyRDPToWebsocket(ws *websocket.Conn, rdp io.Reader) error {
	buffer := make([]byte, websocketBufferSize)
	for {
		n, err := rdp.Read(buffer)
		if n > 0 {
			if writeErr := ws.WriteMessage(websocket.BinaryMessage, buffer[:n]); writeErr != nil {
				return writeErr
			}
		}
		if err != nil {
			return err
		}
	}
}

func closeWebsocket(ws *websocket.Conn, message string) {
	_ = ws.WriteControl(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseInternalServerErr, message), time.Now().Add(time.Second))
}

func isNormalWebsocketClose(err error) bool {
	return websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway, websocket.CloseNoStatusReceived)
}
