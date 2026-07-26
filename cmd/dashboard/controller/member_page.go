package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/audit"
	"github.com/railzen/nezha-zero/pkg/geoip"
	"github.com/railzen/nezha-zero/pkg/mygin"
	"github.com/railzen/nezha-zero/service/singleton"
)

type memberPage struct {
	r *gin.Engine
}

func (mp *memberPage) serve() {
	mr := mp.r.Group("")
	mr.Use(mygin.Authorize(mygin.AuthorizeOption{
		MemberOnly: true,
		IsPage:     true,
		Msg:        singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "YouAreNotAuthorized"}),
		Btn:        singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "Login"}),
		Redirect:   "/login",
	}))
	mr.GET("/server", mp.server)
	mr.GET("/monitor", mp.monitor)
	mr.GET("/cron", mp.cron)
	mr.GET("/notification", mp.notification)
	mr.GET("/ddns", mp.ddns)
	mr.GET("/nat", mp.nat)
	mr.GET("/setting", mp.setting)
	mr.GET("/log", mp.log)
	mr.GET("/api", mp.api)
}

func (mp *memberPage) api(c *gin.Context) {
	singleton.ApiLock.RLock()
	defer singleton.ApiLock.RUnlock()
	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/api", mygin.CommonEnvironment(c, gin.H{
		"title":  singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "ApiManagement"}),
		"Tokens": singleton.ApiTokenList,
	}))
}

func (mp *memberPage) server(c *gin.Context) {
	singleton.SortedServerLock.RLock()
	defer singleton.SortedServerLock.RUnlock()
	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/server", mygin.CommonEnvironment(c, gin.H{
		"Title":   singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "ServersManagement"}),
		"Servers": singleton.SortedServerList,
	}))
}

func (mp *memberPage) monitor(c *gin.Context) {
	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/monitor", mygin.CommonEnvironment(c, gin.H{
		"Title":    singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "ServicesManagement"}),
		"Monitors": singleton.ServiceSentinelShared.Monitors(),
	}))
}

func (mp *memberPage) cron(c *gin.Context) {
	var crons []model.Cron
	singleton.DB.Find(&crons)
	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/cron", mygin.CommonEnvironment(c, gin.H{
		"Title": singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "ScheduledTasks"}),
		"Crons": crons,
	}))
}

func (mp *memberPage) notification(c *gin.Context) {
	var nf []model.Notification
	singleton.DB.Find(&nf)
	for i := range nf {
		if nf[i].TelegramToken != "" {
			nf[i].TelegramToken = "********"
		}
		if nf[i].SMTPPassword != "" {
			nf[i].SMTPPassword = "********"
		}
	}
	var ar []model.AlertRule
	singleton.DB.Find(&ar)
	standardRules := make([]model.AlertRule, 0, len(ar))
	expirationRules := make([]model.AlertRule, 0)
	for _, rule := range ar {
		if rule.IsExpirationRule() {
			expirationRules = append(expirationRules, rule)
		} else {
			standardRules = append(standardRules, rule)
		}
	}
	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/notification", mygin.CommonEnvironment(c, gin.H{
		"Title":           singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "Notification"}),
		"Notifications":   nf,
		"AlertRules":      standardRules,
		"ExpirationRules": expirationRules,
	}))
}

func (mp *memberPage) ddns(c *gin.Context) {
	var data []model.DDNSProfile
	singleton.DB.Find(&data)
	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/ddns", mygin.CommonEnvironment(c, gin.H{
		"Title":        singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "DDNS"}),
		"DDNS":         data,
		"ProviderMap":  model.ProviderMap,
		"ProviderList": model.ProviderList,
	}))
}

func (mp *memberPage) nat(c *gin.Context) {
	var data []model.NAT
	singleton.DB.Find(&data)
	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/nat", mygin.CommonEnvironment(c, gin.H{
		"Title": singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "NAT"}),
		"NAT":   data,
	}))
}

func (mp *memberPage) setting(c *gin.Context) {
	geoIPUpdatedAt := ""
	if geoip.Downloaded() {
		loc, err := time.LoadLocation(singleton.Conf.Location)
		if err != nil {
			loc = time.Local
		}
		geoIPUpdatedAt = geoip.UpdatedAt().In(loc).Format("2006-01-02 15:04:05")
	}
	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/setting", mygin.CommonEnvironment(c, gin.H{
		"Title":           singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "Settings"}),
		"Languages":       model.Languages,
		"DashboardThemes": model.DashboardThemes,
		"GeoIPDownloaded": geoip.Downloaded(),
		"GeoIPUpdatedAt":  geoIPUpdatedAt,
	}))
}

func (mp *memberPage) log(c *gin.Context) {
	audit.PruneExcess()
	filterType := c.Query("type")
	if filterType == "" {
		filterType = "all"
	}
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}

	q := singleton.DB.Model(&model.AuditLog{})
	if filterType != "all" {
		q = q.Where("type = ?", filterType)
	}
	var total int64
	q.Count(&total)

	totalPages := int((total + int64(audit.PageSize) - 1) / int64(audit.PageSize))
	if totalPages < 1 {
		totalPages = 1
	}
	if page > totalPages {
		page = totalPages
	}

	var logs []model.AuditLog
	q.Order("created_at DESC").Offset((page - 1) * audit.PageSize).Limit(audit.PageSize).Find(&logs)

	pageInfo := singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{
		MessageID: "LogPageInfo",
		TemplateData: map[string]interface{}{
			"Page":       page,
			"TotalPages": totalPages,
		},
	})

	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/log", mygin.CommonEnvironment(c, gin.H{
		"Title":      singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "Log"}),
		"Logs":       logs,
		"Total":      total,
		"FilterType": filterType,
		"Page":       page,
		"TotalPages": totalPages,
		"PageInfo":   pageInfo,
		"HasPrev":    page > 1,
		"HasNext":    page < totalPages,
		"PrevPage":   page - 1,
		"NextPage":   page + 1,
	}))
}
