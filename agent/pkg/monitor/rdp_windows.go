//go:build windows

package monitor

import (
	"fmt"
	"net"
	"strconv"
	"unsafe"

	"golang.org/x/sys/windows"
	"golang.org/x/sys/windows/registry"
)

const (
	terminalServerKey = `SYSTEM\CurrentControlSet\Control\Terminal Server`
	rdpTCPKey         = terminalServerKey + `\WinStations\RDP-Tcp`
)

func init() {
	rdpLocalAddress = windowsRDPLocalAddress
}

// windowsRDPLocalAddress returns the configured local RDP endpoint after
// confirming that Windows allows remote desktop and TermService is running.
func windowsRDPLocalAddress() (string, error) {
	terminalServer, err := registry.OpenKey(registry.LOCAL_MACHINE, terminalServerKey, registry.QUERY_VALUE)
	if err != nil {
		return "", fmt.Errorf("open Windows Terminal Server configuration: %w", err)
	}
	denyConnections, _, err := terminalServer.GetIntegerValue("fDenyTSConnections")
	_ = terminalServer.Close()
	if err != nil {
		return "", fmt.Errorf("read fDenyTSConnections: %w", err)
	}
	if denyConnections != 0 {
		return "", fmt.Errorf("Windows remote desktop connections are disabled")
	}

	rdpTCP, err := registry.OpenKey(registry.LOCAL_MACHINE, rdpTCPKey, registry.QUERY_VALUE)
	if err != nil {
		return "", fmt.Errorf("open Windows RDP listener configuration: %w", err)
	}
	port, _, err := rdpTCP.GetIntegerValue("PortNumber")
	_ = rdpTCP.Close()
	if err != nil {
		return "", fmt.Errorf("read Windows RDP port: %w", err)
	}
	if port == 0 || port > 65535 {
		return "", fmt.Errorf("invalid Windows RDP port %d", port)
	}
	address := net.JoinHostPort("127.0.0.1", strconv.FormatUint(port, 10))

	manager, err := windows.OpenSCManager(nil, nil, windows.SC_MANAGER_CONNECT)
	if err != nil {
		return "", fmt.Errorf("open Windows service manager: %w", err)
	}
	defer windows.CloseServiceHandle(manager)

	serviceName, err := windows.UTF16PtrFromString("TermService")
	if err != nil {
		return "", fmt.Errorf("encode TermService name: %w", err)
	}
	service, err := windows.OpenService(manager, serviceName, windows.SERVICE_QUERY_STATUS)
	if err != nil {
		return "", fmt.Errorf("open TermService: %w", err)
	}
	defer windows.CloseServiceHandle(service)

	var status windows.SERVICE_STATUS_PROCESS
	var bytesNeeded uint32
	if err := windows.QueryServiceStatusEx(
		service,
		windows.SC_STATUS_PROCESS_INFO,
		(*byte)(unsafe.Pointer(&status)),
		uint32(unsafe.Sizeof(status)),
		&bytesNeeded,
	); err != nil {
		return "", fmt.Errorf("query TermService status: %w", err)
	}
	if status.CurrentState != windows.SERVICE_RUNNING {
		return "", fmt.Errorf("TermService is not running")
	}

	return address, nil
}
