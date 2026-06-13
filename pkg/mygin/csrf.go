package mygin

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"

	"github.com/railzen/nezha-zero/model"
)

const (
	CSRFCookieName = "nz-csrf"
	CSRFHeaderName = "X-CSRF-Token"
)

var (
	csrfSigningKey     []byte
	csrfSigningKeyOnce sync.Once
)

func csrfSigningSecret() []byte {
	csrfSigningKeyOnce.Do(func() {
		csrfSigningKey = make([]byte, 32)
		if _, err := rand.Read(csrfSigningKey); err != nil {
			panic("csrf signing key generation failed: " + err.Error())
		}
	})
	return csrfSigningKey
}

func issueCSRFToken() string {
	var b [32]byte
	if _, err := rand.Read(b[:]); err != nil {
		return ""
	}
	nonce := hex.EncodeToString(b[:])
	return nonce + "." + csrfSign(nonce)
}

func csrfSign(nonce string) string {
	mac := hmac.New(sha256.New, csrfSigningSecret())
	mac.Write([]byte(nonce))
	return hex.EncodeToString(mac.Sum(nil))
}

func validateCSRFToken(value string) bool {
	if value == "" {
		return false
	}
	idx := strings.LastIndex(value, ".")
	if idx <= 0 || idx == len(value)-1 {
		return false
	}
	nonce, sig := value[:idx], value[idx+1:]
	return hmac.Equal([]byte(sig), []byte(csrfSign(nonce)))
}

// SetCSRFCookie 在响应中设置 CSRF cookie（非 HttpOnly，JS 需读取）
func SetCSRFCookie(c *gin.Context) {
	token := issueCSRFToken()
	if token == "" {
		return
	}
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie(CSRFCookieName, token, 0, "/", "", CookieSecure(c), false)
}

// 无需 CSRF 校验的路径（登录接口在用户未认证时调用，尚无 CSRF Cookie）
var csrfSkipPaths = map[string]bool{
	"/auth":          true, // 密码登录
	"/api/v1/login":  true, // V1 API 登录
	"/api/logout":    true, // 注销
	"/view-password": true, // 访问密码验证
}

// CSRFMiddleware CSRF 防护中间件（Double-Submit Cookie 模式）
// 对基于 Cookie 的 POST/PUT/DELETE/PATCH 请求校验 X-CSRF-Token 头与 CSRF Cookie 是否一致且签名有效
func CSRFMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 安全方法直接放行；缺失或过期的 nz-csrf 在此自愈，避免仅 nz-jwt 仍有效时 POST 403
		switch c.Request.Method {
		case http.MethodGet, http.MethodHead, http.MethodOptions, http.MethodTrace:
			if cookie, err := c.Cookie(CSRFCookieName); err != nil || cookie == "" || !validateCSRFToken(cookie) {
				SetCSRFCookie(c)
			}
			c.Next()
			return
		}

		// Bearer Token 认证（API 调用）天然免疫 CSRF，直接放行
		authHeader := c.GetHeader("Authorization")
		if strings.HasPrefix(authHeader, "Bearer ") {
			c.Next()
			return
		}

		// OAuth2 路径跳过（外部重定向无法携带自定义头）
		path := c.Request.URL.Path
		if strings.HasPrefix(path, "/oauth2/") {
			c.Next()
			return
		}

		// 登录接口跳过（尚未认证，无 CSRF Cookie；登录 CSRF 风险较低）
		if csrfSkipPaths[path] {
			c.Next()
			return
		}

		// 从 Cookie 读取 CSRF token
		cookieToken, err := c.Cookie(CSRFCookieName)
		if err != nil || cookieToken == "" {
			c.AbortWithStatusJSON(http.StatusForbidden, model.Response{
				Code:    http.StatusForbidden,
				Message: "CSRF token missing",
			})
			return
		}

		// 从请求头读取 CSRF token（也支持表单字段 _csrf）
		headerToken := c.GetHeader(CSRFHeaderName)
		if headerToken == "" {
			headerToken = c.PostForm("_csrf")
		}

		if headerToken == "" || cookieToken != headerToken || !validateCSRFToken(cookieToken) {
			c.AbortWithStatusJSON(http.StatusForbidden, model.Response{
				Code:    http.StatusForbidden,
				Message: "CSRF token mismatch",
			})
			return
		}

		c.Next()
	}
}
