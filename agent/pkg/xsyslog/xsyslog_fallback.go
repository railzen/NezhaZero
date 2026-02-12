//go:build !darwin && !windows && !plan9

package xsyslog

import (
	"log/syslog"
)

type Writer = syslog.Writer

var (
	New       = syslog.New
	NewLogger = syslog.NewLogger
)
