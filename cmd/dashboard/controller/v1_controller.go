// 为 v1 版本提供兼容接口
package controller

import (
	"cmp"
	"net/http"
	"slices"
	"sort"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/mygin"
	"github.com/railzen/nezha-zero/service/singleton"
	"golang.org/x/sync/singleflight"
)

type compatV1 struct {
	r            gin.IRouter
	requestGroup singleflight.Group
}

type V1Response[T any] struct {
	Success bool   `json:"success,omitempty"`
	Data    T      `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

func (cv *compatV1) serve() {
	r := cv.r.Group("")
	r.Use(mygin.Authorize(mygin.AuthorizeOption{
		MemberOnly: false,
		IsPage:     false,
		AllowAPI:   true,
	}))

	r.GET("/ws/server", cv.serverStream)
	r.GET("/server-group", cv.listServerGroup)

	r.GET("/service", cv.showService)
	r.GET("/service/:id", cv.listServiceHistory)
	r.GET("/service/server", cv.listServerWithServices)

	r.GET("/setting", cv.listConfig)
	r.GET("/profile", cv.getProfile)

	r.POST("/login", cv.login)

	auth := cv.r.Group("")
	auth.Use(mygin.Authorize(mygin.AuthorizeOption{
		MemberOnly: true,
		AllowAPI:   true,
		IsPage:     false,
		Msg:        "访问此接口需要认证",
		Btn:        "点此登录",
		Redirect:   "/login",
	}))
	auth.GET("/refresh-token", cv.refreshToken)

	auth.GET("/server", cv.listServer)
	auth.GET("/notification", cv.listNotification)
	auth.GET("/alert-rule", cv.listAlertRule)
	auth.GET("/service/list", cv.listService)

	//auth.POST("/terminal", cv.createTerminal)
	//auth.GET("/ws/terminal/:id", cv.terminalStream)

	//auth.GET("/file", cv.createFM)
	//auth.GET("/ws/file/:id", cv.fmStream)
}

func idToUuid(id uint64) string {
	str := strconv.FormatUint(id, 10)
	str = strings.Repeat("0", 32-len(str)) + str
	return str[0:8] + "-" + str[8:12] + "-" + str[12:16] + "-" + str[16:20] + "-" + str[20:]
}

func appendBinarySearch[S ~[]E, E model.V1CommonInterface](x, y S, target uint64) S {
	if i, ok := slices.BinarySearchFunc(y, target, func(e E, t uint64) int {
		return cmp.Compare(e.GetID(), t)
	}); ok {
		x = append(x, y[i])
	}
	return x
}

func (cv *compatV1) listNotification(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	singleton.NotificationsLock.RLock()
	defer singleton.NotificationsLock.RUnlock()

	notifications := make([]*model.V1Notification, 0, len(singleton.NotificationList))
	for _, ns := range singleton.NotificationList {
		for _, n := range ns {
			notifications = append(notifications, &model.V1Notification{
				V1Common: model.V1Common{
					ID:        n.ID,
					CreatedAt: n.CreatedAt,
					UpdatedAt: n.UpdatedAt,
				},
				Name:          n.Name,
				URL:           "secret.api.skip",
				RequestMethod: uint8(n.RequestMethod),
				RequestType:   uint8(n.RequestType),
				RequestHeader: "Request Header",
				RequestBody:   "Request Body",
				VerifyTLS:     n.VerifySSL,
			})
		}
	}

	filterID := c.Query("id")
	if filterID != "" {
		// NotificationList 是 map 嵌套 map，遍历无序；按 ID 升序排序后 appendBinarySearch 才能命中。
		sort.SliceStable(notifications, func(i, j int) bool {
			return notifications[i].ID < notifications[j].ID
		})
		oldns := notifications
		notifications = []*model.V1Notification{}
		ids := strings.Split(filterID, ",")
		for _, id := range ids {
			idUint, err := strconv.ParseUint(id, 10, 64)
			if err != nil {
				continue
			}
			notifications = appendBinarySearch(notifications, oldns, idUint)
		}
	}

	c.JSON(200, V1Response[[]*model.V1Notification]{
		Success: true,
		Data:    notifications,
	})
}

func (cv *compatV1) listAlertRule(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	singleton.AlertsLock.RLock()
	defer singleton.AlertsLock.RUnlock()

	alerts := make([]*model.V1AlertRule, 0, len(singleton.Alerts))
	for _, alert := range singleton.Alerts {
		rules := make([]*model.V1Rule, 0, len(alert.Rules))
		for _, rule := range alert.Rules {
			rules = append(rules, &model.V1Rule{
				Type:          rule.Type,
				Min:           rule.Min,
				Max:           rule.Max,
				CycleStart:    rule.CycleStart,
				CycleInterval: rule.CycleInterval,
				CycleUnit:     rule.CycleUnit,
				Duration:      rule.Duration,
				Cover:         rule.Cover,
				Ignore:        rule.Ignore,
			})
		}
		groupID := uint64(0)
		if len(singleton.NotificationList[alert.NotificationTag]) < 1 {
			continue
		}
		for _, n := range singleton.NotificationList[alert.NotificationTag] {
			groupID = n.ID
			break
		}
		alerts = append(alerts, &model.V1AlertRule{
			V1Common: model.V1Common{
				ID:        alert.ID,
				CreatedAt: alert.CreatedAt,
				UpdatedAt: alert.UpdatedAt,
			},
			Name:                alert.Name,
			RulesRaw:            alert.RulesRaw,
			Enable:              alert.Enable,
			TriggerMode:         uint8(alert.TriggerMode),
			NotificationGroupID: groupID,
			Rules:               rules,
			FailTriggerTasks:    alert.FailTriggerTasks,
			RecoverTriggerTasks: alert.RecoverTriggerTasks,
		})
	}

	filterID := c.Query("id")
	if filterID != "" {
		// Alerts 来自 DB.Find + append，无排序保证；按 ID 升序排序后 appendBinarySearch 才能命中。
		sort.SliceStable(alerts, func(i, j int) bool {
			return alerts[i].ID < alerts[j].ID
		})
		oldalerts := alerts
		alerts = []*model.V1AlertRule{}
		ids := strings.Split(filterID, ",")
		for _, id := range ids {
			idUint, err := strconv.ParseUint(id, 10, 64)
			if err != nil {
				continue
			}
			alerts = appendBinarySearch(alerts, oldalerts, idUint)
		}
	}

	c.JSON(200, V1Response[[]*model.V1AlertRule]{
		Success: true,
		Data:    alerts,
	})
}

func (cv *compatV1) listConfig(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	_, isViewPasswordVerfied := c.Get(model.CtxKeyViewPasswordVerified)
	authorized := isMember || isViewPasswordVerfied

	conf := model.V1SettingResponse[model.V1Config]{
		Config: model.V1Config{
			SiteName:            singleton.Conf.Site.Brand,
			Language:            strings.Replace(singleton.Conf.Language, "_", "-", -1),
			CustomCode:          singleton.Conf.Site.CustomCode,
			CustomCodeDashboard: singleton.Conf.Site.CustomCodeDashboard,
		},
		Version: func() string {
			if authorized {
				return singleton.Version
			}
			return ""
		}(),
	}

	c.JSON(200, V1Response[model.V1SettingResponse[model.V1Config]]{
		Success: true,
		Data:    conf,
	})
}

func (cv *compatV1) getProfile(c *gin.Context) {
	if singleton.Conf.CompatAPIDisable {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	auth, ok := c.Get(model.CtxKeyAuthorizedUser)
	if !ok {
		c.JSON(401, V1Response[any]{
			Success: false,
			Error:   "unauthorized",
		})
		return
	}
	user := auth.(*model.User)
	profile := model.V1Profile{
		V1User: model.V1User{
			V1Common: model.V1Common{
				ID:        user.ID,
				CreatedAt: user.CreatedAt,
				UpdatedAt: user.UpdatedAt,
			},
			Username: user.Login,
		},
	}
	c.JSON(200, V1Response[model.V1Profile]{
		Success: true,
		Data:    profile,
	})
}
