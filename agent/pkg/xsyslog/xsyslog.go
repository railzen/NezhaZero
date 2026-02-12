//go:build darwin

package xsyslog

import (
	"fmt"
	"log"
	"log/syslog"
	"os"
	"strings"
	"time"

	"github.com/ebitengine/purego"
)

type Writer struct {
	priority syslog.Priority
	tag      string

	lib        uintptr
	syslogFunc func(priority syslog.Priority, message string, a ...any)
}

func New(priority syslog.Priority, tag string) (*Writer, error) {
	writer := &Writer{
		priority: priority,
		tag:      tag,
	}

	lib, err := purego.Dlopen("/usr/lib/libSystem.B.dylib", purego.RTLD_LAZY|purego.RTLD_GLOBAL)
	if err != nil {
		return nil, err
	}
	writer.lib = lib

	purego.RegisterLibFunc(&writer.syslogFunc, writer.lib, "syslog")
	return writer, nil
}

func (w *Writer) Write(b []byte) (int, error) {
	return w.write(w.priority, string(b))
}

func (w *Writer) Close() error {
	return purego.Dlclose(w.lib)
}

func (w *Writer) Emerg(m string) error {
	_, err := w.write(syslog.LOG_EMERG, m)
	return err
}

func (w *Writer) Alert(m string) error {
	_, err := w.write(syslog.LOG_ALERT, m)
	return err
}

func (w *Writer) Crit(m string) error {
	_, err := w.write(syslog.LOG_CRIT, m)
	return err
}

func (w *Writer) Err(m string) error {
	_, err := w.write(syslog.LOG_ERR, m)
	return err
}

func (w *Writer) Warning(m string) error {
	_, err := w.write(syslog.LOG_WARNING, m)
	return err
}

func (w *Writer) Notice(m string) error {
	_, err := w.write(syslog.LOG_NOTICE, m)
	return err
}

func (w *Writer) Info(m string) error {
	_, err := w.write(syslog.LOG_INFO, m)
	return err
}

func (w *Writer) Debug(m string) error {
	_, err := w.write(syslog.LOG_DEBUG, m)
	return err
}

func (w *Writer) write(priority syslog.Priority, msg string) (int, error) {
	// ensure it ends in a \n
	nl := ""
	if !strings.HasSuffix(msg, "\n") {
		nl = "\n"
	}

	timestamp := time.Now().Format(time.Stamp)
	w.syslogFunc(priority, fmt.Sprintf("<%d>%s %s[%d]: %s%s",
		priority, timestamp, w.tag, os.Getpid(), msg, nl))

	return len(msg), nil
}

func NewLogger(p syslog.Priority, logFlag int) (*log.Logger, error) {
	s, err := New(p, "")
	if err != nil {
		return nil, err
	}

	return log.New(s, "", logFlag), nil
}
