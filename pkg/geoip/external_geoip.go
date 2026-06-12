package geoip

import (
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	maxminddb "github.com/oschwald/maxminddb-golang"
)

const downloadURL = "https://raw.githubusercontent.com/Loyalsoldier/geoip/release/GeoLite2-Country.mmdb"

const (
	dbNamePrefix = "GeoLite-"
	dbNameSuffix = ".mmdb"
	dbTimeLayout = "20060102T150405Z"
)

type externalIPInfo struct {
	Country struct {
		ISOCode string            `maxminddb:"iso_code"`
		Names   map[string]string `maxminddb:"names"`
	} `maxminddb:"country"`
}

var (
	externalMu   sync.RWMutex
	externalData []byte
	dataDir      string
)

// InitExternal 指定外部 GeoIP 库存放目录（不预加载，由 ReloadExternal 按开关加载）。
func InitExternal(dir string) {
	dataDir = dir
}

// ReloadExternal 按开关在内存中只保留一份库：开启时加载外部并释放内置，关闭时释放外部。
func ReloadExternal(useExternal bool) error {
	if !useExternal {
		externalMu.Lock()
		externalData = nil
		externalMu.Unlock()
		return nil
	}
	return loadExternal()
}

func dbFileName(t time.Time) string {
	return dbNamePrefix + t.UTC().Format(dbTimeLayout) + dbNameSuffix
}

func parseTimeFromFileName(name string) (time.Time, bool) {
	if !strings.HasPrefix(name, dbNamePrefix) || !strings.HasSuffix(name, dbNameSuffix) {
		return time.Time{}, false
	}
	ts := strings.TrimSuffix(strings.TrimPrefix(name, dbNamePrefix), dbNameSuffix)
	t, err := time.Parse(dbTimeLayout, ts)
	return t, err == nil
}

func downloadedFile() string {
	if dataDir == "" {
		return ""
	}
	matches, err := filepath.Glob(filepath.Join(dataDir, dbNamePrefix+"*"+dbNameSuffix))
	if err != nil {
		return ""
	}
	var best string
	var bestTime time.Time
	for _, path := range matches {
		t, ok := parseTimeFromFileName(filepath.Base(path))
		if !ok {
			continue
		}
		if best == "" || t.After(bestTime) {
			best = path
			bestTime = t
		}
	}
	return best
}

// Downloaded 外部 GeoIP 数据库是否已下载到本地。
func Downloaded() bool {
	path := downloadedFile()
	if path == "" {
		return false
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return false
	}
	_, err = maxminddb.FromBytes(data)
	return err == nil
}

// UpdatedAt 从外部库文件名解析上次更新时间。
func UpdatedAt() time.Time {
	path := downloadedFile()
	if path == "" {
		return time.Time{}
	}
	t, _ := parseTimeFromFileName(filepath.Base(path))
	return t
}

func loadExternal() error {
	path := downloadedFile()
	if path == "" {
		externalMu.Lock()
		externalData = nil
		externalMu.Unlock()
		return nil
	}
	data, err := os.ReadFile(path)
	if err != nil {
		externalMu.Lock()
		externalData = nil
		externalMu.Unlock()
		return err
	}
	if _, err = maxminddb.FromBytes(data); err != nil {
		externalMu.Lock()
		externalData = nil
		externalMu.Unlock()
		return fmt.Errorf("invalid external geoip database: %w", err)
	}
	externalMu.Lock()
	externalData = data
	externalMu.Unlock()
	unloadEmbedded()
	return nil
}

func lookupExternal(ip net.IP) (string, error) {
	externalMu.RLock()
	data := externalData
	externalMu.RUnlock()
	if len(data) == 0 {
		return "", fmt.Errorf("external geoip database not loaded")
	}

	db, err := maxminddb.FromBytes(data)
	if err != nil {
		return "", err
	}
	defer db.Close()

	record := &externalIPInfo{}
	if err = db.Lookup(ip, record); err != nil {
		return "", err
	}
	if code := record.Country.ISOCode; code != "" {
		return strings.ToLower(code), nil
	}
	return "", fmt.Errorf("IP not found")
}

// Resolve 解析时按开关选择外部库或内置库（外部库不可用则回退内置库）。
func Resolve(useExternal bool, ip net.IP) (string, error) {
	if useExternal {
		if code, err := lookupExternal(ip); err == nil {
			return code, nil
		}
	}
	record := &IPInfo{}
	return Lookup(ip, record)
}

func removeOldDownloads() {
	if dataDir == "" {
		return
	}
	matches, _ := filepath.Glob(filepath.Join(dataDir, dbNamePrefix+"*"+dbNameSuffix))
	for _, path := range matches {
		_ = os.Remove(path)
	}
}

// Update 下载 GeoLite2-Country 并写入 data 目录。
func Update() error {
	if dataDir == "" {
		return fmt.Errorf("geoip database directory is not configured")
	}

	client := &http.Client{Timeout: 2 * time.Minute}
	resp, err := client.Get(downloadURL)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("download failed: HTTP %d", resp.Status)
	}

	body, err := io.ReadAll(io.LimitReader(resp.Body, 64<<20))
	if err != nil {
		return err
	}
	if len(body) == 0 {
		return fmt.Errorf("downloaded geoip database is empty")
	}
	if _, err = maxminddb.FromBytes(body); err != nil {
		return fmt.Errorf("downloaded file is not a valid mmdb database: %w", err)
	}

	if err = os.MkdirAll(dataDir, 0o755); err != nil {
		return err
	}
	removeOldDownloads()
	if err = os.WriteFile(filepath.Join(dataDir, dbFileName(time.Now().UTC())), body, 0o644); err != nil {
		return err
	}
	return loadExternal()
}
