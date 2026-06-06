package mygin

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/utils"
)

const (
	CSRFCookieName = "nz-csrf"
	CSRFHeaderName = "X-CSRF-Token"
)

// SetCSRFCookie 在响应中设置 CSRF cookie（非 HttpOnly，JS 需读取）
func SetCSRFCookie(c *gin.Context) {
	token, err := utils.GenerateRandomString(32)
	if err != nil {
		return
	}
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie(CSRFCookieName, token, 0, "/", "", c.Request.TLS != nil, false)
}

// 无需 CSRF 校验的路径（登录接口在用户未认证时调用，尚无 CSRF Cookie）
var csrfSkipPaths = map[string]bool{
	"/auth":          true, // 密码登录
	"/api/v1/login":  true, // V1 API 登录
	"/api/logout":    true, // 注销
	"/view-password": true, // 访问密码验证
	"/terminal":      true, // 终端连接
}

// CSRFMiddleware CSRF 防护中间件（Double-Submit Cookie 模式）
// 对基于 Cookie 的 POST/PUT/DELETE/PATCH 请求校验 X-CSRF-Token 头与 CSRF Cookie 是否一致
func CSRFMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 安全方法直接放行
		switch c.Request.Method {
		case http.MethodGet, http.MethodHead, http.MethodOptions, http.MethodTrace:
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

		if headerToken == "" || cookieToken != headerToken {
			c.AbortWithStatusJSON(http.StatusForbidden, model.Response{
				Code:    http.StatusForbidden,
				Message: "CSRF token mismatch",
			})
			return
		}

		c.Next()
	}
}

// EnsureCSRFCookie 确保 CSRF Cookie 存在（用于页面级中间件）
// 如果客户端已有有效 CSRF Cookie 则不刷新，否则设置新的
func EnsureCSRFCookie() gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := c.Cookie(CSRFCookieName)
		if err != nil {
			SetCSRFCookie(c)
		}
		c.Next()
	}
}
