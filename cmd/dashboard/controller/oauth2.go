package controller

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/naiba/nezha/pkg/oidc/cloudflare"
	myOidc "github.com/naiba/nezha/pkg/oidc/general"

	"code.gitea.io/sdk/gitea"
	"github.com/gin-gonic/gin"
	GitHubAPI "github.com/google/go-github/v47/github"
	"github.com/naiba/nezha/model"
	"github.com/naiba/nezha/pkg/mygin"
	"github.com/naiba/nezha/pkg/utils"
	"github.com/naiba/nezha/service/singleton"
	"github.com/patrickmn/go-cache"
	"github.com/xanzy/go-gitlab"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	GitHubOauth2 "golang.org/x/oauth2/github"
	GitlabOauth2 "golang.org/x/oauth2/gitlab"
)

type oauth2controller struct {
	r            gin.IRoutes
	oidcProvider *oidc.Provider
}

func (oa *oauth2controller) serve() {
	oa.r.GET("/oauth2/login", oa.login)
	oa.r.GET("/oauth2/callback", oa.callback)
	oa.r.POST("/auth/password", oa.passwordLogin)
}

func (oa *oauth2controller) passwordLogin(c *gin.Context) {
	type LoginForm struct {
		Username  string `form:"username" binding:"required"`
		Password  string `form:"password" binding:"required,min=6"`
		Timestamp int64  `form:"timestamp" binding:"required"`
		Nonce     string `form:"nonce" binding:"required,min=10"`
	}

	var req LoginForm
	if err := c.ShouldBind(&req); err != nil {
		showLoginFailed(c)
		return
	}

	// 1. 验证时间戳（防止重放攻击）
	currentTime := time.Now().UnixMilli()
	if currentTime-req.Timestamp > 300000 { // 5分钟有效期
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  400,
			Title: "登录失败",
			Msg:   "请求已过期，请刷新页面重试",
		}, true)
		return
	}

	// 2. 验证一次性随机数（防止重放攻击）
	nonceKey := "login_nonce_" + req.Nonce
	if _, found := singleton.Cache.Get(nonceKey); found {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  400,
			Title: "登录失败",
			Msg:   "重复的请求，请刷新页面重试",
		}, true)
		return
	}
	// 存储随机数，设置5分钟过期
	singleton.Cache.Set(nonceKey, true, 300)

	// 限制连续失败次数
	failKey := "passwd_fail_" + req.Username
	failCount, _ := singleton.Cache.Get(failKey)
	if failCountInt, ok := failCount.(int); ok && failCountInt >= 5 {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code: 400, Title: "登录失败",
			Msg: "连续错误次数过多，请稍后再试",
		}, true)
		return
	}

	// 校验用户名是否在管理员列表
	allowed := false
	for _, admin := range strings.Split(singleton.Conf.Oauth2.Admin, ",") {
		if strings.EqualFold(req.Username, admin) {
			allowed = true
			break
		}
	}
	if !allowed {
		incrementFailCount(failKey)
		showLoginFailed(c)
		return
	}

	decodedPassword, err := base64.StdEncoding.DecodeString(req.Password)
	if err != nil {
		incrementFailCount(failKey)
		showLoginFailed(c)
		return
	}
	// 校验密码（bcrypt）
	hash := singleton.Conf.Site.AdminPassword
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(decodedPassword)); err != nil {
		incrementFailCount(failKey)
		showLoginFailed(c)
		return
	}

	// 登录成功，清除失败计数
	singleton.Cache.Delete(failKey)

	// 构造管理员用户
	user := model.User{
		Login:      req.Username,
		Name:       "Admin",
		SuperAdmin: true,
	}

	// 生成 token 并设置过期时间
	token, err := utils.GenerateRandomString(32)
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code: 400, Title: "登录失败", Msg: "系统错误",
		}, true)
		return
	}
	user.Token = token
	user.TokenExpired = time.Now().UTC().AddDate(0, 2, 0)

	// 保存到数据库（可选）
	singleton.DB.Save(&user)

	// 设置安全 cookie (HttpOnly + Secure)
	c.SetCookie(singleton.Conf.Site.CookieName, user.Token, 60*60*24, "", "", c.Request.TLS != nil, true)

	// 登录成功跳转
	c.HTML(200, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/redirect", mygin.CommonEnvironment(c, gin.H{
		"URL": "/",
	}))
}

// 显示统一登录失败页面
func showLoginFailed(c *gin.Context) {
	mygin.ShowErrorPage(c, mygin.ErrInfo{
		Code: 400, Title: "用户名或密码错误", Msg: "用户名或密码错误",
	}, true)
}

// 增加失败计数并设置 10 分钟过期
func incrementFailCount(key string) {
	count, _ := singleton.Cache.Get(key)
	if cInt, ok := count.(int); ok {
		singleton.Cache.Set(key, cInt+1, 10*time.Minute)
	} else {
		singleton.Cache.Set(key, 1, 10*time.Minute)
	}
}

func (oa *oauth2controller) getCommonOauth2Config(c *gin.Context) *oauth2.Config {
	if singleton.Conf.Oauth2.Type == model.ConfigTypeGitee {
		return &oauth2.Config{
			ClientID:     singleton.Conf.Oauth2.ClientID,
			ClientSecret: singleton.Conf.Oauth2.ClientSecret,
			Scopes:       []string{},
			Endpoint: oauth2.Endpoint{
				AuthURL:  "https://gitee.com/oauth/authorize",
				TokenURL: "https://gitee.com/oauth/token",
			},
			RedirectURL: oa.getRedirectURL(c),
		}
	} else if singleton.Conf.Oauth2.Type == model.ConfigTypeGitlab {
		return &oauth2.Config{
			ClientID:     singleton.Conf.Oauth2.ClientID,
			ClientSecret: singleton.Conf.Oauth2.ClientSecret,
			Scopes:       []string{"read_user", "read_api"},
			Endpoint:     GitlabOauth2.Endpoint,
			RedirectURL:  oa.getRedirectURL(c),
		}
	} else if singleton.Conf.Oauth2.Type == model.ConfigTypeJihulab {
		return &oauth2.Config{
			ClientID:     singleton.Conf.Oauth2.ClientID,
			ClientSecret: singleton.Conf.Oauth2.ClientSecret,
			Scopes:       []string{"read_user", "read_api"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  "https://jihulab.com/oauth/authorize",
				TokenURL: "https://jihulab.com/oauth/token",
			},
			RedirectURL: oa.getRedirectURL(c),
		}
	} else if singleton.Conf.Oauth2.Type == model.ConfigTypeGitea {
		return &oauth2.Config{
			ClientID:     singleton.Conf.Oauth2.ClientID,
			ClientSecret: singleton.Conf.Oauth2.ClientSecret,
			Endpoint: oauth2.Endpoint{
				AuthURL:  fmt.Sprintf("%s/login/oauth/authorize", singleton.Conf.Oauth2.Endpoint),
				TokenURL: fmt.Sprintf("%s/login/oauth/access_token", singleton.Conf.Oauth2.Endpoint),
			},
			RedirectURL: oa.getRedirectURL(c),
		}
	} else if singleton.Conf.Oauth2.Type == model.ConfigTypeCloudflare {
		return &oauth2.Config{
			ClientID:     singleton.Conf.Oauth2.ClientID,
			ClientSecret: singleton.Conf.Oauth2.ClientSecret,
			Scopes:       []string{"openid", "email", "profile", "groups"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  fmt.Sprintf("%s/cdn-cgi/access/sso/oidc/%s/authorization", singleton.Conf.Oauth2.Endpoint, singleton.Conf.Oauth2.ClientID),
				TokenURL: fmt.Sprintf("%s/cdn-cgi/access/sso/oidc/%s/token", singleton.Conf.Oauth2.Endpoint, singleton.Conf.Oauth2.ClientID),
			},
			RedirectURL: oa.getRedirectURL(c),
		}
	} else if singleton.Conf.Oauth2.Type == model.ConfigTypeOidc {
		var err error
		oa.oidcProvider, err = oidc.NewProvider(c.Request.Context(), singleton.Conf.Oauth2.OidcIssuer)
		if err != nil {
			mygin.ShowErrorPage(c, mygin.ErrInfo{
				Code:  http.StatusBadRequest,
				Title: fmt.Sprintf("Cannot get OIDC infomaion from issuer from %s", singleton.Conf.Oauth2.OidcIssuer),
				Msg:   err.Error(),
			}, true)
			return nil
		}
		scopes := strings.Split(singleton.Conf.Oauth2.OidcScopes, ",")
		scopes = append(scopes, oidc.ScopeOpenID)
		uniqueScopes := removeDuplicates(scopes)
		return &oauth2.Config{
			ClientID:     singleton.Conf.Oauth2.ClientID,
			ClientSecret: singleton.Conf.Oauth2.ClientSecret,
			Scopes:       uniqueScopes,
			Endpoint:     oa.oidcProvider.Endpoint(),
			RedirectURL:  oa.getRedirectURL(c),
		}
	} else {
		return &oauth2.Config{
			ClientID:     singleton.Conf.Oauth2.ClientID,
			ClientSecret: singleton.Conf.Oauth2.ClientSecret,
			Scopes:       []string{},
			Endpoint:     GitHubOauth2.Endpoint,
		}
	}
}

func (oa *oauth2controller) getRedirectURL(c *gin.Context) string {
	scheme := "http://"
	referer := c.Request.Referer()
	if forwardedProto := c.Request.Header.Get("X-Forwarded-Proto"); forwardedProto == "https" || strings.HasPrefix(referer, "https://") {
		scheme = "https://"
	}
	return scheme + c.Request.Host + "/oauth2/callback"
}

func (oa *oauth2controller) login(c *gin.Context) {
	randomString, err := utils.GenerateRandomString(32)
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusBadRequest,
			Title: "Something Wrong",
			Msg:   err.Error(),
		}, true)
		return
	}
	state, stateKey := randomString[:16], randomString[16:]
	singleton.Cache.Set(fmt.Sprintf("%s%s", model.CacheKeyOauth2State, stateKey), state, cache.DefaultExpiration)
	url := oa.getCommonOauth2Config(c).AuthCodeURL(state, oauth2.AccessTypeOnline)
	c.SetCookie(singleton.Conf.Site.CookieName+"-sk", stateKey, 60*5, "", "", false, false)
	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/redirect", mygin.CommonEnvironment(c, gin.H{
		"URL": url,
	}))
}

func (oa *oauth2controller) callback(c *gin.Context) {
	var err error
	// 验证登录跳转时的 State
	stateKey, err := c.Cookie(singleton.Conf.Site.CookieName + "-sk")
	if err == nil {
		state, ok := singleton.Cache.Get(fmt.Sprintf("%s%s", model.CacheKeyOauth2State, stateKey))
		if !ok || state.(string) != c.Query("state") {
			err = errors.New("非法的登录方式")
		}
	}
	oauth2Config := oa.getCommonOauth2Config(c)
	ctx := context.Background()
	var otk *oauth2.Token
	if err == nil {
		otk, err = oauth2Config.Exchange(ctx, c.Query("code"))
	}

	var user model.User

	if err == nil {
		if singleton.Conf.Oauth2.Type == model.ConfigTypeGitlab || singleton.Conf.Oauth2.Type == model.ConfigTypeJihulab {
			var gitlabApiClient *gitlab.Client
			if singleton.Conf.Oauth2.Type == model.ConfigTypeGitlab {
				gitlabApiClient, err = gitlab.NewOAuthClient(otk.AccessToken)
			} else {
				gitlabApiClient, err = gitlab.NewOAuthClient(otk.AccessToken, gitlab.WithBaseURL("https://jihulab.com/api/v4/"))
			}
			var u *gitlab.User
			if err == nil {
				u, _, err = gitlabApiClient.Users.CurrentUser()
			}
			if err == nil {
				user = model.NewUserFromGitlab(u)
			}
		} else if singleton.Conf.Oauth2.Type == model.ConfigTypeGitea {
			var giteaApiClient *gitea.Client
			giteaApiClient, err = gitea.NewClient(singleton.Conf.Oauth2.Endpoint, gitea.SetToken(otk.AccessToken))
			var u *gitea.User
			if err == nil {
				u, _, err = giteaApiClient.GetMyUserInfo()
			}
			if err == nil {
				user = model.NewUserFromGitea(u)
			}
		} else if singleton.Conf.Oauth2.Type == model.ConfigTypeCloudflare {
			client := oauth2Config.Client(context.Background(), otk)
			resp, err := client.Get(fmt.Sprintf("%s/cdn-cgi/access/sso/oidc/%s/userinfo", singleton.Conf.Oauth2.Endpoint, singleton.Conf.Oauth2.ClientID))
			if err == nil {
				defer resp.Body.Close()
				var cloudflareUserInfo *cloudflare.UserInfo
				if err := utils.Json.NewDecoder(resp.Body).Decode(&cloudflareUserInfo); err == nil {
					user = cloudflareUserInfo.MapToNezhaUser()
				}
			}
		} else if singleton.Conf.Oauth2.Type == model.ConfigTypeOidc {
			userInfo, err := oa.oidcProvider.UserInfo(c.Request.Context(), oauth2.StaticTokenSource(otk))
			if err == nil {
				loginClaim := singleton.Conf.Oauth2.OidcLoginClaim
				groupClain := singleton.Conf.Oauth2.OidcGroupClaim
				adminGroups := strings.Split(singleton.Conf.Oauth2.AdminGroups, ",")
				autoCreate := singleton.Conf.Oauth2.OidcAutoCreate
				var oidceUserInfo *myOidc.UserInfo
				if err := userInfo.Claims(&oidceUserInfo); err == nil {
					user = oidceUserInfo.MapToNezhaUser(loginClaim, groupClain, adminGroups, autoCreate)
				}
			}
		} else {
			var client *GitHubAPI.Client
			oc := oauth2Config.Client(ctx, otk)
			if singleton.Conf.Oauth2.Type == model.ConfigTypeGitee {
				baseURL, _ := url.Parse("https://gitee.com/api/v5/")
				uploadURL, _ := url.Parse("https://gitee.com/api/v5/uploads/")
				client = GitHubAPI.NewClient(oc)
				client.BaseURL = baseURL
				client.UploadURL = uploadURL
			} else {
				client = GitHubAPI.NewClient(oc)
			}
			var gu *GitHubAPI.User
			gu, _, err = client.Users.Get(ctx, "")
			if err == nil {
				user = model.NewUserFromGitHub(gu)
			}
		}
	}
	if err == nil && user.Login == "" {
		err = errors.New("获取用户信息失败")
	}

	if err != nil || user.Login == "" {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusBadRequest,
			Title: "登录失败",
			Msg:   fmt.Sprintf("错误信息：%s", err),
		}, true)
		return
	}
	var isAdmin bool

	if user.SuperAdmin {
		isAdmin = true
	} else {
		for _, admin := range strings.Split(singleton.Conf.Oauth2.Admin, ",") {
			if admin != "" && strings.EqualFold(user.Login, admin) {
				isAdmin = true
				break
			}
		}
	}
	if !isAdmin {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusBadRequest,
			Title: "登录失败",
			Msg:   fmt.Sprintf("错误信息：%s", "该用户不是本站点管理员，无法登录"),
		}, true)
		return
	}
	user.Token, err = utils.GenerateRandomString(32)
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusBadRequest,
			Title: "Something wrong",
			Msg:   err.Error(),
		}, true)
		return
	}
	user.TokenExpired = time.Now().UTC().AddDate(0, 2, 0)
	singleton.DB.Save(&user)
	c.SetCookie(singleton.Conf.Site.CookieName, user.Token, 60*60*24, "", "", false, false)
	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/redirect", mygin.CommonEnvironment(c, gin.H{
		"URL": "/",
	}))
}

func removeDuplicates(elements []string) []string {
	encountered := map[string]bool{}
	result := []string{}

	for _, v := range elements {
		if !encountered[v] {
			encountered[v] = true
			result = append(result, v)
		}
	}
	return result
}
