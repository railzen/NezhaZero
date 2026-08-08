package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"math/big"
	"os"
	"regexp"
	"strings"
	"unicode"

	jsoniter "github.com/json-iterator/go"
)

// BcryptCost 密码 bcrypt 哈希 cost（默认 10，此处提高到 12 以增强离线破解成本）。
const BcryptCost = 12

// ErrAdminPasswordPolicy 管理员密码不符合复杂度要求。
var ErrAdminPasswordPolicy = errors.New("管理员密码需不少于8位，且大写字母、小写字母、数字、特殊字符至少包含三种")

var (
	Json = jsoniter.ConfigCompatibleWithStandardLibrary

	DNSServers = []string{"1.1.1.1:53", "223.5.5.5:53"}
)

func IsWindows() bool {
	return os.PathSeparator == '\\' && os.PathListSeparator == ';'
}

var ipv4Re = regexp.MustCompile(`(\d*\.).*(\.\d*)`)

func ipv4Desensitize(ipv4Addr string) string {
	return ipv4Re.ReplaceAllString(ipv4Addr, "$1****$2")
}

var ipv6Re = regexp.MustCompile(`(\w*:\w*:).*(:\w*:\w*)`)

func ipv6Desensitize(ipv6Addr string) string {
	return ipv6Re.ReplaceAllString(ipv6Addr, "$1****$2")
}

func IPDesensitize(ipAddr string) string {
	ipAddr = ipv4Desensitize(ipAddr)
	ipAddr = ipv6Desensitize(ipAddr)
	return ipAddr
}

// SplitIPAddr 传入/分割的v4v6混合地址，返回v4和v6地址与有效地址
func SplitIPAddr(v4v6Bundle string) (string, string, string) {
	ipList := strings.Split(v4v6Bundle, "/")
	ipv4 := ""
	ipv6 := ""
	validIP := ""
	if len(ipList) > 1 {
		// 双栈
		ipv4 = ipList[0]
		ipv6 = ipList[1]
		validIP = ipv4
	} else if len(ipList) == 1 {
		// 仅ipv4|ipv6
		if strings.Contains(ipList[0], ":") {
			ipv6 = ipList[0]
			validIP = ipv6
		} else {
			ipv4 = ipList[0]
			validIP = ipv4
		}
	}
	return ipv4, ipv6, validIP
}

func IsFileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

func GenerateRandomString(n int) (string, error) {
	const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	lettersLength := big.NewInt(int64(len(letters)))
	ret := make([]byte, n)
	for i := 0; i < n; i++ {
		num, err := rand.Int(rand.Reader, lettersLength)
		if err != nil {
			return "", err
		}
		ret[i] = letters[num.Int64()]
	}
	return string(ret), nil
}

const sessionTokenLength = 32

const apiTokenVisibleLength = 4

// SessionToken 会话 Token：Plain 发给客户端，Hash 写入 users.token。
type SessionToken struct {
	Plain string
	Hash  string
}

// NewSessionToken 生成会话 Token（明文 + SHA-256 十六进制摘要）。
func NewSessionToken() (SessionToken, error) {
	plain, err := GenerateRandomString(sessionTokenLength)
	if err != nil {
		return SessionToken{}, err
	}
	return SessionToken{
		Plain: plain,
		Hash:  HashSessionToken(plain),
	}, nil
}

// HashSessionToken 将会话 Token 明文转为 SHA-256 十六进制摘要，用于入库与校验。
func HashSessionToken(plain string) string {
	sum := sha256.Sum256([]byte(plain))
	return hex.EncodeToString(sum[:])
}

// HashAPIToken converts a plaintext API token to the SHA-256 digest stored in
// the database and used as the in-memory authentication index.
func HashAPIToken(plain string) string {
	sum := sha256.Sum256([]byte(strings.TrimSpace(plain)))
	return hex.EncodeToString(sum[:])
}

// IsHashedAPIToken reports whether value has the shape produced by
// HashAPIToken. API tokens issued by the dashboard are 32 characters long, so
// this also distinguishes legacy plaintext rows during an upgrade.
func IsHashedAPIToken(value string) bool {
	if len(value) != sha256.Size*2 {
		return false
	}
	_, err := hex.DecodeString(value)
	return err == nil
}

// MaskAPIToken keeps enough of a token to identify it without retaining the
// recoverable credential in the database.
func MaskAPIToken(plain string) string {
	plain = strings.TrimSpace(plain)
	if len(plain) <= apiTokenVisibleLength*2 {
		return strings.Repeat("*", len(plain))
	}
	return plain[:apiTokenVisibleLength] +
		strings.Repeat("*", len(plain)-apiTokenVisibleLength*2) +
		plain[len(plain)-apiTokenVisibleLength:]
}

// ValidateAdminPassword 校验管理员明文密码：长度不少于 8 位，且四类字符至少包含三种。
func ValidateAdminPassword(password string) error {
	if len(password) < 8 {
		return ErrAdminPasswordPolicy
	}
	if len(password) > 32 {
		return errors.New("管理员密码长度不能超过32位")
	}
	var hasLower, hasUpper, hasDigit, hasSpecial bool
	for _, r := range password {
		switch {
		case r >= 'a' && r <= 'z':
			hasLower = true
		case r >= 'A' && r <= 'Z':
			hasUpper = true
		case r >= '0' && r <= '9':
			hasDigit = true
		case !unicode.IsLetter(r) && !unicode.IsDigit(r):
			hasSpecial = true
		}
	}
	types := 0
	if hasLower {
		types++
	}
	if hasUpper {
		types++
	}
	if hasDigit {
		types++
	}
	if hasSpecial {
		types++
	}
	if types < 3 {
		return ErrAdminPasswordPolicy
	}
	return nil
}

func SubUintChecked(a, b uint64) uint64 {
	if a < b {
		return 0
	}
	return a - b
}
