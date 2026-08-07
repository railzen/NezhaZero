package websocketx

import (
	"io"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// WriteTimeout 单次写操作的最长阻塞时间（非空闲超时）。
// 每次 Write/WriteMessage 前会重新 SetWriteDeadline(now+WriteTimeout)，
// 两次写之间空闲多久都不受影响；超时仅防止对端不读导致永久卡死占槽。
const WriteTimeout = 30 * time.Minute

var _ io.ReadWriteCloser = &Conn{}

type Conn struct {
	*websocket.Conn
	writeLock *sync.Mutex
	dataBuf   []byte
}

func NewConn(conn *websocket.Conn) *Conn {
	return &Conn{Conn: conn, writeLock: new(sync.Mutex)}
}

func (conn *Conn) Write(data []byte) (int, error) {
	conn.writeLock.Lock()
	defer conn.writeLock.Unlock()
	_ = conn.Conn.SetWriteDeadline(time.Now().Add(WriteTimeout))
	if err := conn.Conn.WriteMessage(websocket.BinaryMessage, data); err != nil {
		return 0, err
	}
	return len(data), nil
}

func (conn *Conn) WriteMessage(messageType int, data []byte) error {
	conn.writeLock.Lock()
	defer conn.writeLock.Unlock()
	_ = conn.Conn.SetWriteDeadline(time.Now().Add(WriteTimeout))
	return conn.Conn.WriteMessage(messageType, data)
}

func (conn *Conn) Read(data []byte) (int, error) {
	if len(conn.dataBuf) > 0 {
		n := copy(data, conn.dataBuf)
		conn.dataBuf = conn.dataBuf[n:]
		return n, nil
	}
	mType, innerData, err := conn.Conn.ReadMessage()
	if err != nil {
		return 0, err
	}
	// 将文本消息转换为命令输入
	if mType == websocket.TextMessage {
		innerData = append([]byte{0}, innerData...)
	}
	n := copy(data, innerData)
	if n < len(innerData) {
		conn.dataBuf = innerData[n:]
	}
	return n, nil
}
