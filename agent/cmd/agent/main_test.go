package main

import (
	"fmt"
	"net"
	"reflect"
	"testing"
)

func Test(t *testing.T) {
	cases := []struct {
		start, size int
		want        []int
	}{
		{0, 2, []int{0, 1}},
		{1, 2, []int{1, 0}},
		{0, 3, []int{0, 1, 2}},
		{1, 3, []int{1, 2, 0}},
		{2, 3, []int{2, 0, 1}},
	}

	for _, c := range cases {
		if !reflect.DeepEqual(c.want, generateQueue(c.start, c.size)) {
			t.Errorf("generateQueue(%d, %d) == %d, want %d", c.start, c.size, generateQueue(c.start, c.size), c.want)
		}
	}
}

func TestLookupIP(t *testing.T) {
	ip, err := lookupIP("www.google.com")
	fmt.Printf("ip: %v, err: %v\n", ip, err)
	if err != nil {
		t.Errorf("lookupIP failed: %v", err)
	}
	_, err = net.ResolveIPAddr("ip", "www.google.com")
	if err != nil {
		t.Errorf("ResolveIPAddr failed: %v", err)
	}

	ip, err = lookupIP("ipv6.google.com")
	fmt.Printf("ip: %v, err: %v\n", ip, err)
	if err != nil {
		t.Errorf("lookupIP failed: %v", err)
	}
	_, err = net.ResolveIPAddr("ip", "ipv6.google.com")
	if err != nil {
		t.Errorf("ResolveIPAddr failed: %v", err)
	}
}

func TestRDPFeatureEnabled(t *testing.T) {
	tests := []struct {
		name    string
		goos    string
		enabled bool
		want    bool
	}{
		{name: "Windows defaults off", goos: "windows", enabled: false, want: false},
		{name: "Windows explicitly enabled", goos: "windows", enabled: true, want: true},
		{name: "non-Windows remains off", goos: "linux", enabled: true, want: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := rdpFeatureEnabled(tt.goos, tt.enabled); got != tt.want {
				t.Fatalf("rdpFeatureEnabled(%q, %t) = %t, want %t", tt.goos, tt.enabled, got, tt.want)
			}
		})
	}
}
