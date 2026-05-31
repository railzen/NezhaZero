package utils

import (
	"embed"
	"io/fs"
	"os"
	"path"
	"strings"
)

// HybridFS combines embed.FS and os.DirFS.
type HybridFS struct {
	embedFS, dir fs.FS
}

func NewHybridFS(embed embed.FS, subDir string, localDir string) (*HybridFS, error) {
	subFS, err := fs.Sub(embed, subDir)
	if err != nil {
		return nil, err
	}

	return &HybridFS{
		embedFS: subFS,
		dir:     os.DirFS(localDir),
	}, nil
}

func (hfs *HybridFS) Open(name string) (fs.File, error) {
	cleanName := path.Clean(name)

	// Reject absolute paths and directory-traversal attempts.
	if strings.HasPrefix(cleanName, "..") || strings.HasPrefix(cleanName, "/") {
		return nil, fs.ErrNotExist
	}

	// Reject Windows-style backslash paths as they are not valid fs paths here.
	if strings.Contains(cleanName, "\\") {
		return nil, fs.ErrNotExist
	}

	// Ensure embed files are not replaced.
	if file, err := hfs.embedFS.Open(cleanName); err == nil {
		return file, nil
	}

	return hfs.dir.Open(cleanName)
}
