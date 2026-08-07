package rpc

import (
	"errors"
	"io"
	"sync"
	"sync/atomic"
	"time"
)

type ioStreamContext struct {
	userIo           io.ReadWriteCloser
	agentIo          io.ReadWriteCloser
	userIoConnectCh  chan struct{}
	agentIoConnectCh chan struct{}
	createdAt        time.Time
}

type bp struct {
	buf []byte
}

var bufPool = sync.Pool{
	New: func() any {
		return &bp{
			buf: make([]byte, 1024*1024),
		}
	},
}

const (
	ioStreamCleanupInterval = time.Minute
	ioStreamConnectTimeout  = 5 * time.Minute
	ioStreamLimit           = 256
	// 首帧 stream id 等待上限：避免已鉴权 agent 占槽后永不 Recv 导致永久耗尽
	ioStreamIDTimeout = 2 * time.Minute
)

func (s *NezhaHandler) CreateStream(streamId string) error {
	s.ioStreamMutex.Lock()
	defer s.ioStreamMutex.Unlock()

	if len(s.ioStreams) >= ioStreamLimit {
		return errors.New("too many active streams")
	}
	s.ioStreams[streamId] = &ioStreamContext{
		userIoConnectCh:  make(chan struct{}),
		agentIoConnectCh: make(chan struct{}),
		createdAt:        time.Now(),
	}
	return nil
}

func (s *NezhaHandler) GetStream(streamId string) (*ioStreamContext, error) {
	s.ioStreamMutex.RLock()
	defer s.ioStreamMutex.RUnlock()

	if ctx, ok := s.ioStreams[streamId]; ok {
		return ctx, nil
	}

	return nil, errors.New("stream not found")
}

func (s *NezhaHandler) CloseStream(streamId string) error {
	s.ioStreamMutex.Lock()
	defer s.ioStreamMutex.Unlock()

	if ctx, ok := s.ioStreams[streamId]; ok {
		s.closeStreamLocked(streamId, ctx)
	}

	return nil
}

func (s *NezhaHandler) closeStreamLocked(streamId string, ctx *ioStreamContext) {
	if ctx.userIo != nil {
		ctx.userIo.Close()
	}
	if ctx.agentIo != nil {
		ctx.agentIo.Close()
	}
	delete(s.ioStreams, streamId)
}

func (s *NezhaHandler) cleanupStaleStreams() {
	ticker := time.NewTicker(ioStreamCleanupInterval)
	defer ticker.Stop()

	for range ticker.C {
		cutoff := time.Now().Add(-ioStreamConnectTimeout)
		s.ioStreamMutex.Lock()
		for streamId, ctx := range s.ioStreams {
			if ctx.createdAt.Before(cutoff) && (ctx.userIo == nil || ctx.agentIo == nil) {
				s.closeStreamLocked(streamId, ctx)
			}
		}
		s.ioStreamMutex.Unlock()
	}
}

func (s *NezhaHandler) UserConnected(streamId string, userIo io.ReadWriteCloser) error {
	s.ioStreamMutex.Lock()
	defer s.ioStreamMutex.Unlock()

	stream, ok := s.ioStreams[streamId]
	if !ok {
		return errors.New("stream not found")
	}
	if stream.userIo != nil {
		return errors.New("user already connected")
	}
	stream.userIo = userIo
	close(stream.userIoConnectCh)

	return nil
}

func (s *NezhaHandler) AgentConnected(streamId string, agentIo io.ReadWriteCloser) error {
	s.ioStreamMutex.Lock()
	defer s.ioStreamMutex.Unlock()

	stream, ok := s.ioStreams[streamId]
	if !ok {
		return errors.New("stream not found")
	}
	if stream.agentIo != nil {
		return errors.New("agent already connected")
	}
	stream.agentIo = agentIo
	close(stream.agentIoConnectCh)

	return nil
}

func (s *NezhaHandler) StartStream(streamId string, timeout time.Duration) error {
	stream, err := s.GetStream(streamId)
	if err != nil {
		return err
	}

	timeoutTimer := time.NewTimer(timeout)
	defer timeoutTimer.Stop()

LOOP:
	for {
		select {
		case <-timeoutTimer.C:
			break LOOP
		default:
		}

		select {
		case <-stream.userIoConnectCh:
			if stream.agentIo != nil {
				break LOOP
			}
		case <-stream.agentIoConnectCh:
			if stream.userIo != nil {
				break LOOP
			}
		case <-timeoutTimer.C:
			break LOOP
		}
		time.Sleep(time.Millisecond * 500)
	}

	if stream.userIo == nil && stream.agentIo == nil {
		return errors.New("timeout: no connection established")
	}
	if stream.userIo == nil {
		return errors.New("timeout: user connection not established")
	}
	if stream.agentIo == nil {
		return errors.New("timeout: agent connection not established")
	}

	isDone := new(atomic.Bool)
	endCh := make(chan struct{})
	doneErrCh := make(chan error, 1)

	go func() {
		bp := bufPool.Get().(*bp)
		defer bufPool.Put(bp)
		_, innerErr := io.CopyBuffer(stream.userIo, stream.agentIo, bp.buf)
		if isDone.CompareAndSwap(false, true) {
			doneErrCh <- innerErr
			close(endCh)
		}
	}()
	go func() {
		bp := bufPool.Get().(*bp)
		defer bufPool.Put(bp)
		_, innerErr := io.CopyBuffer(stream.agentIo, stream.userIo, bp.buf)
		if isDone.CompareAndSwap(false, true) {
			doneErrCh <- innerErr
			close(endCh)
		}
	}()

	<-endCh
	return <-doneErrCh
}
