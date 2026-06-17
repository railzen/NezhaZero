package mygin

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/service/singleton"
)

type AuthorizeOption struct {
	GuestOnly  bool
	MemberOnly bool
	IsPage     bool
	AllowAPI   bool
	Msg        string
	Redirect   string
	Btn        string
}

func Authorize(opt AuthorizeOption) func(*gin.Context) {
	return func(c *gin.Context) {
		var code = http.StatusForbidden
		if opt.GuestOnly {
			code = http.StatusBadRequest
		}

		commonErr := ErrInfo{
			Title: "访问受限",
			Code:  code,
			Msg:   opt.Msg,
			Link:  opt.Redirect,
			Btn:   opt.Btn,
		}
		var isLogin bool

		// 用户鉴权
		boolIsV1Api := strings.HasPrefix(c.Request.URL.Path, "/api/v1")
		token, _ := c.Cookie(singleton.Conf.Site.CookieName)
		token = strings.TrimSpace(token)
		if token == "" && boolIsV1Api {
			token, _ = c.Cookie("nz-jwt")
			token = strings.TrimSpace(token)
		}
		if token == "" {
			token = c.GetHeader("Authorization")
			// 兼容 v1 的鉴权
			token = strings.TrimPrefix(token, "Bearer ")
		}
		if token != "" {
			var u model.User
			// 优先检索用户 Session Token（库内为哈希）
			if user, err := model.FindUserBySessionToken(singleton.DB, token); err == nil {
				u = *user
				isLogin = u.TokenExpired.After(time.Now().UTC())
			}
			if isLogin {
				c.Set(model.CtxKeyAuthorizedUser, &u)
			} else if opt.AllowAPI {
				// API Token 鉴权：Token 在 ApiTokenList 中即视为已登录
				singleton.ApiLock.RLock()
				apiToken, ok := singleton.ApiTokenList[token]
				singleton.ApiLock.RUnlock()
				if ok {
					isLogin = true
					apiUser := model.User{
						Common:     model.Common{ID: apiToken.UserID},
						Login:      "Admin",
						Name:       "Admin",
						SuperAdmin: false,
					}
					c.Set(model.CtxKeyAuthorizedUser, &apiUser)
					c.Set("isAPI", true)
				}
			}
		}

		// 已登录且只能游客访问
		if isLogin && opt.GuestOnly {
			ShowErrorPage(c, commonErr, opt.IsPage)
			return
		}

		// 未登录且需要登录
		if !isLogin && opt.MemberOnly {
			ShowErrorPage(c, commonErr, opt.IsPage)
			return
		}
	}
}

// BlockIfNotSuperAdmin 拒绝未登录或非超级管理员，返回 true 表示已拒绝并已写入响应。
func BlockIfNotSuperAdmin(c *gin.Context, isPage bool) bool {
	u, ok := c.Get(model.CtxKeyAuthorizedUser)
	if !ok {
		ShowErrorPage(c, ErrInfo{
			Code:  http.StatusForbidden,
			Title: "登陆失败",
			Msg:   "非法请求，请稍后再试",
			Link:  "/",
			Btn:   "返回首页",
		}, isPage)
		return true
	}
	user, ok := u.(*model.User)
	if !ok || !user.SuperAdmin {
		ShowErrorPage(c, ErrInfo{
			Code:  http.StatusForbidden,
			Title: "登陆失败",
			Msg:   "非法请求，请稍后再试",
			Link:  "/",
			Btn:   "返回首页",
		}, isPage)
		return true
	}
	return false
}

// RequireSuperAdmin 中间件：仅允许超级管理员访问。
func RequireSuperAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		if BlockIfNotSuperAdmin(c, false) {
			return
		}
		c.Next()
	}
}

// CookieSecure 判断当前请求是否经 HTTPS 到达（直连 TLS 或反代 X-Forwarded-Proto）。
// 纯 HTTP 部署返回 false，不影响 Cookie 读写。
func CookieSecure(c *gin.Context) bool {
	if c.Request.TLS != nil {
		return true
	}
	proto := c.GetHeader("X-Forwarded-Proto")
	if proto == "" {
		return false
	}
	if idx := strings.Index(proto, ","); idx >= 0 {
		proto = proto[:idx]
	}
	return strings.EqualFold(strings.TrimSpace(proto), "https")
}

// ClearSessionCookies 清除认证与 CSRF Cookie
func ClearSessionCookies(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(singleton.Conf.Site.CookieName, "", -1, "/", "", CookieSecure(c), true)
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie(CSRFCookieName, "", -1, "/", "", CookieSecure(c), false)
}
