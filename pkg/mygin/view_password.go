package mygin

import (
	"net/http"
	"net/url"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/service/singleton"
	"golang.org/x/crypto/bcrypt"
)

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
		if err == nil {
			err = bcrypt.CompareHashAndPassword([]byte(viewPassword), []byte(singleton.Conf.Site.ViewPassword))
		}
		if err == nil {
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
