package geoip

import (
	"embed"
	"fmt"
	"log"
	"net"
	"strings"
	"sync"

	maxminddb "github.com/oschwald/maxminddb-golang"
)

//go:embed geoip.db
var geoDBFS embed.FS

var (
	embeddedMu sync.RWMutex
	dbData     []byte
)

type IPInfo struct {
	Country       string `maxminddb:"country"`
	CountryName   string `maxminddb:"country_name"`
	Continent     string `maxminddb:"continent"`
	ContinentName string `maxminddb:"continent_name"`
}

func embeddedData() ([]byte, error) {
	embeddedMu.RLock()
	data := dbData
	embeddedMu.RUnlock()
	if len(data) > 0 {
		return data, nil
	}

	embeddedMu.Lock()
	defer embeddedMu.Unlock()
	if len(dbData) > 0 {
		return dbData, nil
	}

	data, err := geoDBFS.ReadFile("geoip.db")
	if err != nil {
		log.Printf("NEZHA>> Failed to open geoip database: %v", err)
		return nil, err
	}
	dbData = data
	return dbData, nil
}

func unloadEmbedded() {
	embeddedMu.Lock()
	dbData = nil
	embeddedMu.Unlock()
}

func Lookup(ip net.IP, record *IPInfo) (string, error) {
	data, err := embeddedData()
	if err != nil {
		return "", err
	}

	db, err := maxminddb.FromBytes(data)
	if err != nil {
		return "", err
	}
	defer db.Close()

	err = db.Lookup(ip, record)
	if err != nil {
		return "", err
	}

	if record.Country != "" {
		return strings.ToLower(record.Country), nil
	} else if record.Continent != "" {
		return strings.ToLower(record.Continent), nil
	}

	return "", fmt.Errorf("IP not found")
}
