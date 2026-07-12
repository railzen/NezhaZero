package mygin

import (
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"net/http"
	"net/url"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/utils"
	"github.com/railzen/nezha-zero/service/singleton"
)

var viewPasswordSalt, _ = utils.GenerateRandomString(32)

// HashViewPassword generates the value stored in the view-password cookie.
// The process-local salt intentionally invalidates existing cookies on restart.
func HashViewPassword(password string) string {
	hash := sha256.Sum256([]byte(viewPasswordSalt + password))
	return hex.EncodeToString(hash[:])
}

func verifyViewPasswordHash(hash, password string) bool {
	expected := HashViewPassword(password)
	if len(hash) != len(expected) {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(hash), []byte(expected)) == 1
}

type ValidateViewPasswordOption struct {
	IsPage        bool
	AbortWhenFail bool
}

func ValidateViewPassword(opt ValidateViewPasswordOption) gin.HandlerFunc {
	return func(c *gin.Context) {
		if singleton.Conf.Site.ViewPassword == "" {
			return
		}
		_, authorized := c.Get(model.CtxKeyAuthorizedUser)
		if authorized {
			return
		}
		viewPassword, err := c.Cookie(singleton.Conf.Site.CookieName + "-vp")
		if err == nil && verifyViewPasswordHash(viewPassword, singleton.Conf.Site.ViewPassword) {
			c.Set(model.CtxKeyViewPasswordVerified, true)
			return
		}
		if !opt.AbortWhenFail {
			return
		}
		if opt.IsPage {
			c.HTML(http.StatusOK, GetPreferredTheme(c, "/viewpassword"), CommonEnvironment(c, gin.H{
				"Title": singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "VerifyPassword"}),
			}))

		} else {
			c.JSON(http.StatusOK, model.Response{
				Code:    http.StatusForbidden,
				Message: "访问受限",
			})
		}
		c.Abort()
	}
}

// SafeRedirectPath 从 Referer 解析同站相对路径用于跳转，失败则返回 "/"。
func SafeRedirectPath(c *gin.Context) string {
	const fallback = "/"

	ref := c.Request.Referer()
	if ref == "" {
		return fallback
	}

	u, err := url.Parse(ref)
	if err != nil || u.Host != c.Request.Host {
		return fallback
	}

	redirectPath := path.Clean(u.EscapedPath())
	if redirectPath == "" || !strings.HasPrefix(redirectPath, "/") || strings.HasPrefix(redirectPath, "//") || strings.Contains(redirectPath, `\`) {
		return fallback
	}

	if u.RawQuery != "" {
		return redirectPath + "?" + u.RawQuery
	}
	return redirectPath
}
