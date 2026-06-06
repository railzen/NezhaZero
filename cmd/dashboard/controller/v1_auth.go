package controller

import (
	"math/rand"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/mygin"
	"github.com/railzen/nezha-zero/pkg/utils"
	"github.com/railzen/nezha-zero/service/singleton"
	"golang.org/x/crypto/bcrypt"
)

var passwordLoginAttempt struct {
	LastAttempt   time.Time // 最近一次尝试
	WindowStart   time.Time // 当前10秒窗口起点
	WindowCount   int       // 窗口内请求次数
	FailCount     int
	LockedUntil   time.Time
	NextAllowedAt time.Time
}

var passwordLoginLock sync.Mutex

func (cv *compatV1) login(c *gin.Context) {
	var lr model.V1LoginRequest
	now := time.Now().UTC()
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	if err := c.ShouldBindJSON(&lr); err != nil {
		c.JSON(400, V1Response[any]{Error: "Invalid credentials"})
		return
	}

	// 强制要求用户名和密码
	if lr.Username == "" || lr.Password == "" {
		c.JSON(400, V1Response[any]{Error: "Invalid credentials"})
		return
	}

	// 防止过长的输入导致DoS
	if len(lr.Username) > 63 || len(lr.Password) > 63 {
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

	// ===== 是否启用密码登录 =====
	if singleton.Conf.Site.AdminPassword == "" || len(singleton.Conf.Site.AdminPassword) < 10 {
		c.JSON(400, V1Response[any]{Error: "Password login locked"})
		return
	}

	// ===== 全局锁 & 节流 & 退避 =====
	passwordLoginLock.Lock()

	// 锁定期
	if now.Before(passwordLoginAttempt.LockedUntil) {
		passwordLoginLock.Unlock()
		c.JSON(http.StatusForbidden, V1Response[any]{Error: "Password login locked"})
		return
	}

	// 指数退避（立即拒绝，不 sleep）
	if now.Before(passwordLoginAttempt.NextAllowedAt) {
		passwordLoginLock.Unlock()
		c.JSON(http.StatusTooManyRequests, V1Response[any]{Error: "Invalid credentials"})
		return
	}

	// ===== 10 秒窗口内允许 2 次 =====
	window := 10 * time.Second
	// 新窗口 or 窗口已过期
	if passwordLoginAttempt.WindowStart.IsZero() ||
		now.Sub(passwordLoginAttempt.WindowStart) >= window {

		passwordLoginAttempt.WindowStart = now
		passwordLoginAttempt.WindowCount = 1
	} else {
		passwordLoginAttempt.WindowCount++
		if passwordLoginAttempt.WindowCount > 2 {
			passwordLoginLock.Unlock()
			c.JSON(http.StatusTooManyRequests, V1Response[any]{
				Error: "Invalid credentials",
			})
			return
		}
	}

	passwordLoginAttempt.LastAttempt = now

	passwordLoginLock.Unlock()

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

		passwordLoginLock.Lock()
		passwordLoginAttempt.FailCount++
		fail := passwordLoginAttempt.FailCount

		// 达到最大失败次数，直接锁定
		if fail >= 6 {
			passwordLoginAttempt.LockedUntil = now.Add(10 * time.Minute)
			passwordLoginAttempt.FailCount = 0
			passwordLoginAttempt.NextAllowedAt = time.Time{}
			passwordLoginAttempt.WindowStart = time.Time{}
			passwordLoginAttempt.WindowCount = 0
		} else {
			passwordLoginAttempt.NextAllowedAt = calcNextAllowedTime(now, fail)
		}
		passwordLoginLock.Unlock()

		c.JSON(400, V1Response[any]{Error: "Invalid credentials"})
		return
	}

	// ===== 登录成功，重置状态 =====
	passwordLoginLock.Lock()
	passwordLoginAttempt.FailCount = 0
	passwordLoginAttempt.LockedUntil = time.Time{}
	passwordLoginAttempt.NextAllowedAt = time.Time{}
	passwordLoginAttempt.WindowStart = time.Time{}
	passwordLoginAttempt.WindowCount = 0
	passwordLoginLock.Unlock()

	// ===== 创建会话 =====
	var u model.User
	u.Login = lr.Username
	u.Name = "Admin"
	u.SuperAdmin = false

	token, err := utils.GenerateRandomString(32)
	if err != nil {
		c.JSON(400, V1Response[any]{Error: "Invalid credentials"})
		return
	}

	u.Token = token
	u.TokenExpired = now.AddDate(0, 0, 7)
	singleton.DB.Save(&u)

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("nz-jwt", u.Token, 60*60*24*7, "/", "", c.Request.TLS != nil, true)
	mygin.SetCSRFCookie(c)

	c.Set(model.CtxKeyAuthorizedUser, &u)
	c.Set("isAPI", true)

	c.JSON(200, V1Response[model.V1LoginResponse]{
		Success: true,
		Data: model.V1LoginResponse{
			Token:  u.Token,
			Expire: u.TokenExpired.Format(time.RFC3339),
		},
	})
}

func calcNextAllowedTime(now time.Time, failCount int) time.Time {
	if failCount <= 0 {
		return now
	}

	// 最大退避时间
	const maxDelay = 20 * time.Second

	// 2^(failCount-1) 秒
	baseDelay := time.Duration(1<<(failCount-1)) * time.Second
	delay := baseDelay + time.Duration(rand.Int63n(int64(baseDelay/2)))

	if delay > maxDelay {
		delay = maxDelay
	}

	return now.Add(delay)
}

func (cv *compatV1) refreshToken(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	if u, ok := c.Get(model.CtxKeyAuthorizedUser); ok {
		user := u.(*model.User)
		var err error
		user.Token, err = utils.GenerateRandomString(32)
		if err != nil {
			mygin.ShowErrorPage(c, mygin.ErrInfo{
				Code:  http.StatusBadRequest,
				Title: "Something wrong",
				Msg:   err.Error(),
			}, true)
			return
		}
		user.TokenExpired = time.Now().AddDate(0, 0, 14)
		singleton.DB.Save(&user)

		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("nz-jwt", user.Token, 60*60*24*14, "/", "", c.Request.TLS != nil, true)
		mygin.SetCSRFCookie(c)
		c.JSON(200, V1Response[model.V1LoginResponse]{
			Success: true,
			Data: model.V1LoginResponse{
				Expire: user.TokenExpired.Format(time.RFC3339),
				Token:  user.Token,
			},
		})
	} else {
		c.JSON(400, V1Response[any]{
			Error: "ApiErrorUnauthorized",
		})
	}
}
