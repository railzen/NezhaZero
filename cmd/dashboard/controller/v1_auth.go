package controller

import (
	"crypto/sha1"
	"encoding/hex"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/audit"
	"github.com/railzen/nezha-zero/pkg/mygin"
	"github.com/railzen/nezha-zero/pkg/utils"
	"github.com/railzen/nezha-zero/service/singleton"
	"golang.org/x/crypto/bcrypt"
)

func (cv *compatV1) login(c *gin.Context) {
	var lr model.V1LoginRequest
	now := time.Now().UTC()
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	if singleton.Conf.TwoFactorActive() {
		c.JSON(403, V1Response[any]{Error: "CompatAPI: Password login not allowed"})
		return
	}
	// ===== 是否启用密码登录 =====
	if !singleton.Conf.PasswordLoginActive() {
		c.JSON(403, V1Response[any]{Error: "CompatAPI: Password login not allowed"})
		return
	}
	// 全局限速：被全局限速器拒绝的请求不写审计，避免未认证写放大打满 SQLite 单写者。
	if !allowAuthRateLimitedCheck() {
		c.JSON(http.StatusTooManyRequests, V1Response[any]{Error: "Too many requests"})
		return
	}

	if err := c.ShouldBindJSON(&lr); err != nil {
		audit.Record(c, audit.TypeAuth, "V1 password login failed", "invalid request body")
		c.JSON(400, V1Response[any]{Error: "Invalid credentials"})
		return
	}
	lr.Username = strings.TrimSpace(lr.Username)

	// 强制要求用户名和密码
	if lr.Username == "" || strings.TrimSpace(lr.Password) == "" {
		audit.Record(c, audit.TypeAuth, "V1 password login failed", "username or password is empty")
		c.JSON(400, V1Response[any]{Error: "Invalid credentials"})
		return
	}

	// 与 /login 一致：密码最短 6；并防止过长输入导致 DoS
	if len(lr.Username) > 63 || len(lr.Password) < 6 || len(lr.Password) > 63 {
		audit.Record(c, audit.TypeAuth, "V1 password login failed", "username or password length invalid")
		c.JSON(400, V1Response[any]{Error: "Invalid credentials"})
		return
	}

	// ===== 校验管理员用户名 =====
	usernameOK := false
	for _, admin := range strings.Split(singleton.Conf.Oauth2.Admin, ",") {
		if strings.EqualFold(lr.Username, strings.TrimSpace(admin)) {
			usernameOK = true
			break
		}
	}

	// 与 /login 共享 IP / 用户名失败计数
	sum := sha1.Sum([]byte(strings.ToLower(lr.Username)))
	failKey := "passwd_fail_" + hex.EncodeToString(sum[:])
	failCount, _ := singleton.Cache.Get(failKey)
	ruleAllowed := true
	if failCountInt, ok := failCount.(int); ok && failCountInt >= 5 {
		ruleAllowed = false
	}
	ipFailKey := passwordLoginIPFailKey(c.ClientIP())
	ipFailCount, _ := singleton.Cache.Get(ipFailKey)
	if ipFailCountInt, ok := ipFailCount.(int); ok && ipFailCountInt >= 5 {
		ruleAllowed = false
	}
	if !ruleAllowed {
		audit.Record(c, audit.TypeAuth, "V1 password login failed", "too many failed attempts, temporarily blocked")
		c.JSON(http.StatusForbidden, V1Response[any]{Error: "Password login locked"})
		return
	}

	// ===== 密码校验 =====
	passwordOK := false
	if err := bcrypt.CompareHashAndPassword(
		[]byte(singleton.Conf.Site.AdminPassword),
		[]byte(lr.Password),
	); err == nil {
		passwordOK = true
	}

	// ===== 登录失败处理 =====
	if !usernameOK || !passwordOK {
		incrementFailCount(failKey)
		incrementFailCount(ipFailKey)
		audit.Record(c, audit.TypeAuth, "V1 password login failed", "invalid username or password")
		c.JSON(400, V1Response[any]{Error: "Invalid credentials"})
		return
	}

	// ===== 登录成功，重置状态 =====
	singleton.Cache.Delete(failKey)
	singleton.Cache.Delete(ipFailKey)

	// ===== 创建会话 =====
	var u model.User
	u.Login = lr.Username
	u.Name = "Admin"
	u.SuperAdmin = false

	sessionToken, err := utils.NewSessionToken()
	if err != nil {
		c.JSON(400, V1Response[any]{Error: "Invalid credentials"})
		return
	}

	u.Token = sessionToken.Hash
	u.TokenExpired = now.AddDate(0, 0, 3)
	if err := u.SavePasswordSession(singleton.DB); err != nil {
		c.JSON(400, V1Response[any]{Error: "Invalid credentials"})
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("nz-jwt", sessionToken.Plain, 60*60*24*3, "/", "", mygin.CookieSecure(c), true)
	mygin.SetCSRFCookie(c)

	c.Set(model.CtxKeyAuthorizedUser, &u)

	c.JSON(200, V1Response[model.V1LoginResponse]{
		Success: true,
		Data: model.V1LoginResponse{
			Token:  sessionToken.Plain,
			Expire: u.TokenExpired.Format(time.RFC3339),
		},
	})
	audit.Record(c, audit.TypeAuth, "V1 password login succeeded", "user: "+lr.Username)
}

func (cv *compatV1) refreshToken(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	if u, ok := c.Get(model.CtxKeyAuthorizedUser); ok {
		user := u.(*model.User)
		// Only compat V1 login sessions are refreshable here.
		// API-token contexts and normal super-admin sessions are treated as
		// successful no-ops for compatibility, without rotating tokens.
		if user.SuperAdmin || user.Token == "" {
			c.JSON(200, V1Response[model.V1LoginResponse]{
				Success: true,
			})
			return
		}
		sessionToken, err := utils.NewSessionToken()
		if err != nil {
			mygin.ShowErrorPage(c, mygin.ErrInfo{
				Code:  http.StatusBadRequest,
				Title: "Something wrong",
				Msg:   err.Error(),
			}, true)
			return
		}
		user.SuperAdmin = false
		user.Token = sessionToken.Hash
		user.TokenExpired = time.Now().AddDate(0, 0, 14)
		singleton.DB.Save(&user)

		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("nz-jwt", sessionToken.Plain, 60*60*24*14, "/", "", mygin.CookieSecure(c), true)
		mygin.SetCSRFCookie(c)
		c.JSON(200, V1Response[model.V1LoginResponse]{
			Success: true,
			Data: model.V1LoginResponse{
				Expire: user.TokenExpired.Format(time.RFC3339),
				Token:  sessionToken.Plain,
			},
		})
	} else {
		c.JSON(400, V1Response[any]{
			Error: "ApiErrorUnauthorized",
		})
	}
}
