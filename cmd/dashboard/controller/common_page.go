package controller

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/hashicorp/go-uuid"
	"github.com/jinzhu/copier"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/sync/singleflight"

	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/audit"
	"github.com/railzen/nezha-zero/pkg/mygin"
	"github.com/railzen/nezha-zero/pkg/utils"
	"github.com/railzen/nezha-zero/pkg/websocketx"
	"github.com/railzen/nezha-zero/proto"
	"github.com/railzen/nezha-zero/service/rpc"
	"github.com/railzen/nezha-zero/service/singleton"
)

type commonPage struct {
	r            *gin.Engine
	requestGroup singleflight.Group
}

func (cp *commonPage) serve() {
	cr := cp.r.Group("")
	cr.Use(mygin.Authorize(mygin.AuthorizeOption{}))
	cr.Use(mygin.PreferredTheme)
	cr.POST("/view-password", cp.issueViewPassword)
	cr.GET("/terminal/:id", cp.terminal)
	{
		v1 := cr.Group("api/v1")
		v1.Use(mygin.Authorize(mygin.AuthorizeOption{
			MemberOnly: false,
			IsPage:     false,
			AllowAPI:   true,
		}))
		v1.Use(mygin.ValidateViewPassword(mygin.ValidateViewPasswordOption{
			IsPage:        false,
			AbortWhenFail: true,
		}))
		cv := &compatV1{r: v1}
		cv.serve()
	}
	cr.Use(mygin.ValidateViewPassword(mygin.ValidateViewPasswordOption{
		IsPage:        true,
		AbortWhenFail: true,
	}))
	cr.GET("/", cp.home)
	cr.GET("/service", cp.service)
	// TODO: 界面直接跳转使用该接口
	cr.GET("/network/:id", cp.network)
	cr.GET("/network", cp.network)
	cr.GET("/ws", cp.ws)
	cr.POST("/terminal", cp.createTerminal)
	cr.POST("/file", cp.createFM)
	cr.GET("/file/:id", cp.fm)
	cr.GET("/dashboard", cp.v1Dashboard)
}

type viewPasswordForm struct {
	Password string
}

func (p *commonPage) v1Dashboard(c *gin.Context) {
	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	if !isMember {
		c.Redirect(302, "/login")
	} else {
		c.Redirect(302, "/server")
	}
}

func (p *commonPage) issueViewPassword(c *gin.Context) {
	if !allowAuthRateLimitedCheck() {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusTooManyRequests,
			Title: singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "AnErrorEccurred"}),
			Msg:   "非法请求，请稍后再试",
		}, true)
		c.Abort()
		return
	}

	var vpf viewPasswordForm
	err := c.ShouldBind(&vpf)
	var hash string
	if err == nil && vpf.Password != singleton.Conf.Site.ViewPassword {
		err = errors.New(singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "WrongAccessPassword"}))
	}
	if err == nil {
		hash = mygin.HashViewPassword(vpf.Password)
	}
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code: http.StatusOK,
			Title: singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{
				MessageID: "AnErrorEccurred",
			}),
			Msg: err.Error(),
		}, true)
		c.Abort()
		return
	}
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(singleton.Conf.Site.CookieName+"-vp", hash, 60*60*24, "/", "", mygin.CookieSecure(c), true)
	c.Redirect(http.StatusFound, mygin.SafeRedirectPath(c))
}

func (p *commonPage) service(c *gin.Context) {
	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	_, isViewPasswordVerfied := c.Get(model.CtxKeyViewPasswordVerified)
	authorized := isMember || isViewPasswordVerfied

	res, _, _ := p.requestGroup.Do("servicePage", func() (interface{}, error) {
		// 先 LoadStats 再拿 AlertsLock，避免 Alerts→store→Server→Alerts 三锁环
		var stats map[uint64]model.ServiceItemResponse
		copier.Copy(&stats, singleton.ServiceSentinelShared.LoadStats())
		for k, service := range stats {
			if !service.Monitor.EnableShowInService {
				delete(stats, k)
			}
		}
		var statsStore map[uint64]model.CycleTransferStats
		singleton.AlertsLock.RLock()
		copier.CopyWithOption(&statsStore, singleton.AlertsCycleTransferStatsStore, copier.Option{DeepCopy: true})
		singleton.AlertsLock.RUnlock()
		return []interface {
		}{
			stats, statsStore,
		}, nil
	})
	cycleTransferStats := res.([]interface{})[1].(map[uint64]model.CycleTransferStats)
	if !authorized {
		filtered := make(map[uint64]model.CycleTransferStats, len(cycleTransferStats))
		singleton.ServerLock.RLock()
		for k, v := range cycleTransferStats {
			serverName := make(map[uint64]string, len(v.ServerName))
			transfer := make(map[uint64]uint64, len(v.Transfer))
			nextUpdate := make(map[uint64]time.Time, len(v.NextUpdate))
			for serverID, name := range v.ServerName {
				if s, ok := singleton.ServerList[serverID]; ok && s.HideForGuest {
					continue
				}
				serverName[serverID] = name
				if t, ok2 := v.Transfer[serverID]; ok2 {
					transfer[serverID] = t
				}
				if nu, ok2 := v.NextUpdate[serverID]; ok2 {
					nextUpdate[serverID] = nu
				}
			}
			filtered[k] = model.CycleTransferStats{
				Name:       v.Name,
				From:       v.From,
				To:         v.To,
				Max:        v.Max,
				Min:        v.Min,
				ServerName: serverName,
				Transfer:   transfer,
				NextUpdate: nextUpdate,
			}
		}
		singleton.ServerLock.RUnlock()
		cycleTransferStats = filtered
	}
	c.HTML(http.StatusOK, mygin.GetPreferredTheme(c, "/service"), mygin.CommonEnvironment(c, gin.H{
		"Title":              singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "ServicesStatus"}),
		"Services":           res.([]interface{})[0],
		"CycleTransferStats": cycleTransferStats,
	}))
}

func serverIDsWithMonitorHistory() ([]uint64, error) {
	var ids []uint64
	err := singleton.DB.Raw(`
		SELECT s.id
		FROM servers AS s
		WHERE s.deleted_at IS NULL
		  AND EXISTS (
			  SELECT 1
			  FROM monitor_histories AS mh
			  WHERE mh.deleted_at IS NULL
			    AND mh.server_id = s.id
			  LIMIT 1
		  )
	`).Scan(&ids).Error
	return ids, err
}

func (cp *commonPage) network(c *gin.Context) {
	var (
		monitorHistory       *model.MonitorHistory
		servers              []*model.Server
		serverIdsWithMonitor []uint64
		monitorInfos         = []byte("{}")
		id                   uint64
	)
	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	_, isViewPasswordVerfied := c.Get(model.CtxKeyViewPasswordVerified)
	authorized := isMember || isViewPasswordVerfied

	pickDefaultServerID := func() uint64 {
		singleton.SortedServerLock.RLock()
		defer singleton.SortedServerLock.RUnlock()
		if authorized && len(singleton.SortedServerList) > 0 {
			return singleton.SortedServerList[0].ID
		}
		if len(singleton.SortedServerListForGuest) > 0 {
			return singleton.SortedServerListForGuest[0].ID
		}
		return 0
	}

	id = pickDefaultServerID()
	if err := singleton.DB.Model(&model.MonitorHistory{}).Select("monitor_id, server_id").
		Where("monitor_id != 0 and server_id != 0").Limit(1).First(&monitorHistory).Error; err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "请求失败",
			Msg:   "请求参数有误：" + "server monitor history not found",
			Link:  "/",
			Btn:   "返回重试",
		}, true)
		return
	} else if monitorHistory != nil && monitorHistory.ServerID != 0 {
		singleton.ServerLock.RLock()
		server := singleton.ServerList[monitorHistory.ServerID]
		singleton.ServerLock.RUnlock()
		if server != nil && (!server.HideForGuest || authorized) {
			id = monitorHistory.ServerID
		}
	}

	idStr := c.Param("id")
	if idStr != "" {
		var err error
		id, err = strconv.ParseUint(idStr, 10, 64)
		if err != nil {
			mygin.ShowErrorPage(c, mygin.ErrInfo{
				Code:  http.StatusForbidden,
				Title: "请求失败",
				Msg:   "请求参数有误：" + err.Error(),
				Link:  "/",
				Btn:   "返回重试",
			}, true)
			return
		}
		singleton.ServerLock.RLock()
		server, ok := singleton.ServerList[id]
		singleton.ServerLock.RUnlock()
		if !ok {
			mygin.ShowErrorPage(c, mygin.ErrInfo{
				Code:  http.StatusForbidden,
				Title: "请求失败",
				Msg:   "请求参数有误：" + "server id not found",
				Link:  "/",
				Btn:   "返回重试",
			}, true)
			return
		}
		if server.HideForGuest && !authorized {
			mygin.ShowErrorPage(c, mygin.ErrInfo{
				Code:  http.StatusNotFound,
				Title: "请求失败",
				Msg:   "请求参数有误：server id not found",
				Link:  "/",
				Btn:   "返回重试",
			}, true)
			return
		}
	} else {
		singleton.ServerLock.RLock()
		server := singleton.ServerList[id]
		singleton.ServerLock.RUnlock()
		if server != nil && server.HideForGuest && !authorized {
			id = pickDefaultServerID()
		}
	}
	if id == 0 {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "请求失败",
			Msg:   "请求参数有误：no visible server",
			Link:  "/",
			Btn:   "返回重试",
		}, true)
		return
	}
	monitorHistories := singleton.MonitorAPI.GetMonitorHistories(map[string]any{"server_id": id})
	monitorInfos, _ = utils.Json.Marshal(monitorHistories)

	serverIdsWithMonitor, err := serverIDsWithMonitorHistory()
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "请求失败",
			Msg:   "请求参数有误：" + "no server with monitor histories",
			Link:  "/",
			Btn:   "返回重试",
		}, true)
		return
	}
	singleton.SortedServerLock.RLock()
	serverList := singleton.SortedServerList
	if !authorized {
		serverList = singleton.SortedServerListForGuest
	}
	for _, server := range serverList {
		for _, sid := range serverIdsWithMonitor {
			if server.ID == sid {
				servers = append(servers, server)
			}
		}
	}
	singleton.SortedServerLock.RUnlock()
	serversBytes, _ := utils.Json.Marshal(Data{
		Now:     time.Now().Unix() * 1000,
		Servers: servers,
	})

	c.HTML(http.StatusOK, mygin.GetPreferredTheme(c, "/network"), mygin.CommonEnvironment(c, gin.H{
		"Servers":         string(serversBytes),
		"MonitorInfos":    string(monitorInfos),
		"MaxTCPPingValue": singleton.Conf.MaxTCPPingValue,
	}))
}

func (cp *commonPage) getServerStat(c *gin.Context, withPublicNote bool) ([]byte, error) {
	_, isMember := c.Get(model.CtxKeyAuthorizedUser)
	_, isViewPasswordVerfied := c.Get(model.CtxKeyViewPasswordVerified)
	authorized := isMember || isViewPasswordVerfied
	v, err, _ := cp.requestGroup.Do(fmt.Sprintf("serverStats::%t", authorized), func() (interface{}, error) {
		singleton.SortedServerLock.RLock()
		defer singleton.SortedServerLock.RUnlock()

		var serverList []*model.Server
		if authorized {
			serverList = singleton.SortedServerList
		} else {
			serverList = singleton.SortedServerListForGuest
		}

		var servers []*model.Server
		for _, server := range serverList {
			item := *server
			host, state, lastActive, prevIn, prevOut := server.RuntimeSnapshot()
			item.Host = host
			item.State = state
			item.LastActive = lastActive
			item.PrevTransferInSnapshot = prevIn
			item.PrevTransferOutSnapshot = prevOut
			if !withPublicNote {
				item.PublicNote = ""
			}
			servers = append(servers, &item)
		}

		return utils.Json.Marshal(Data{
			Now:     time.Now().Unix() * 1000,
			Servers: servers,
		})
	})
	return v.([]byte), err
}

func (cp *commonPage) home(c *gin.Context) {
	stat, err := cp.getServerStat(c, true)
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code: http.StatusInternalServerError,
			Title: singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{
				MessageID: "SystemError",
			}),
			Msg:  "服务器状态获取失败",
			Link: "/",
			Btn:  "返回首页",
		}, true)
		return
	}
	c.HTML(http.StatusOK, mygin.GetPreferredTheme(c, "/home"), mygin.CommonEnvironment(c, gin.H{
		"Servers": string(stat),
	}))
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  32768,
	WriteBufferSize: 32768,
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		if origin == "" {
			return true
		}
		u, err := url.Parse(origin)
		if err != nil {
			return false
		}
		return u.Host == r.Host
	},
}

type Data struct {
	Now     int64           `json:"now,omitempty"`
	Servers []*model.Server `json:"servers,omitempty"`
}

func (cp *commonPage) ws(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code: http.StatusInternalServerError,
			Title: singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{
				MessageID: "NetworkError",
			}),
			Msg:  "Websocket协议切换失败",
			Link: "/",
			Btn:  "返回首页",
		}, true)
		return
	}
	defer conn.Close()
	singleton.OnlineUsers.Add(1)
	defer singleton.OnlineUsers.Add(^uint64(0))
	count := 0
	for {
		stat, err := cp.getServerStat(c, false)
		if err != nil {
			continue
		}
		if err := conn.WriteMessage(websocket.TextMessage, stat); err != nil {
			break
		}
		count += 1
		if count%4 == 0 {
			err = conn.WriteMessage(websocket.PingMessage, []byte{})
			if err != nil {
				break
			}
		}
		time.Sleep(time.Second * 2)
	}
}

func (cp *commonPage) terminal(c *gin.Context) {
	if _, authorized := c.Get(model.CtxKeyAuthorizedUser); !authorized {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "无权访问",
			Msg:   "用户未登录",
			Link:  "/login",
			Btn:   "去登录",
		}, true)
		return
	}
	if mygin.BlockIfNotSuperAdmin(c, true) {
		return
	}
	streamId := c.Param("id")
	if _, err := rpc.NezhaHandlerSingleton.GetStream(streamId); err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "无权访问",
			Msg:   "终端会话不存在",
			Link:  "/",
			Btn:   "返回首页",
		}, true)
		return
	}
	defer rpc.NezhaHandlerSingleton.CloseStream(streamId)

	wsConn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code: http.StatusInternalServerError,
			Title: singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{
				MessageID: "NetworkError",
			}),
			Msg:  "Websocket协议切换失败",
			Link: "/",
			Btn:  "返回首页",
		}, true)
		return
	}
	defer wsConn.Close()
	conn := websocketx.NewConn(wsConn)

	go func() {
		// PING 保活
		for {
			if err := conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return
			}
			time.Sleep(time.Second * 10)
		}
	}()

	if err = rpc.NezhaHandlerSingleton.UserConnected(streamId, conn); err != nil {
		return
	}

	rpc.NezhaHandlerSingleton.StartStream(streamId, time.Second*10)
}

type createTerminalRequest struct {
	Host     string
	Protocol string
	ID       uint64
}

func (cp *commonPage) createTerminal(c *gin.Context) {
	if _, authorized := c.Get(model.CtxKeyAuthorizedUser); !authorized {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "无权访问",
			Msg:   "用户未登录",
			Link:  "/login",
			Btn:   "去登录",
		}, true)
		return
	}
	if mygin.BlockIfNotSuperAdmin(c, true) {
		return
	}
	var createTerminalReq createTerminalRequest
	if err := c.ShouldBind(&createTerminalReq); err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "请求失败",
			Msg:   "请求参数有误：" + err.Error(),
			Link:  "/server",
			Btn:   "返回重试",
		}, true)
		return
	}

	streamId, err := uuid.GenerateUUID()
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code: http.StatusInternalServerError,
			Title: singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{
				MessageID: "SystemError",
			}),
			Msg:  "生成会话ID失败",
			Link: "/server",
			Btn:  "返回重试",
		}, true)
		return
	}

	rpc.NezhaHandlerSingleton.CreateStream(streamId)

	singleton.ServerLock.RLock()
	server := singleton.ServerList[createTerminalReq.ID]
	singleton.ServerLock.RUnlock()
	if server == nil || server.TaskStream == nil {
		rpc.NezhaHandlerSingleton.CloseStream(streamId)
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "请求失败",
			Msg:   "服务器不存在或处于离线状态",
			Link:  "/server",
			Btn:   "返回重试",
		}, true)
		return
	}

	terminalData, _ := utils.Json.Marshal(&model.TerminalTask{
		StreamID: streamId,
	})
	if err := server.SendTask(&proto.Task{
		Type: model.TaskTypeTerminalGRPC,
		Data: string(terminalData),
	}); err != nil {
		rpc.NezhaHandlerSingleton.CloseStream(streamId)
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "请求失败",
			Msg:   "Agent信令下发失败",
			Link:  "/server",
			Btn:   "返回重试",
		}, true)
		return
	}

	audit.Record(c, audit.TypeSecurity, "Terminal opened",
		fmt.Sprintf("server: %s (ID %d)", server.Name, server.ID))

	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/terminal", mygin.CommonEnvironment(c, gin.H{
		"SessionID":  streamId,
		"ServerName": server.Name,
		"ServerID":   server.ID,
	}))
}

func (cp *commonPage) fm(c *gin.Context) {
	if _, authorized := c.Get(model.CtxKeyAuthorizedUser); !authorized {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "无权访问",
			Msg:   "用户未登录",
			Link:  "/login",
			Btn:   "去登录",
		}, true)
		return
	}
	if mygin.BlockIfNotSuperAdmin(c, true) {
		return
	}
	streamId := c.Param("id")
	if _, err := rpc.NezhaHandlerSingleton.GetStream(streamId); err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "无权访问",
			Msg:   "FM会话不存在",
			Link:  "/",
			Btn:   "返回首页",
		}, true)
		return
	}
	defer rpc.NezhaHandlerSingleton.CloseStream(streamId)

	wsConn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code: http.StatusInternalServerError,
			Title: singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{
				MessageID: "NetworkError",
			}),
			Msg:  "Websocket协议切换失败",
			Link: "/",
			Btn:  "返回首页",
		}, true)
		return
	}
	defer wsConn.Close()
	conn := websocketx.NewConn(wsConn)

	go func() {
		// PING 保活
		for {
			if err := conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return
			}
			time.Sleep(time.Second * 10)
		}
	}()

	if err = rpc.NezhaHandlerSingleton.UserConnected(streamId, conn); err != nil {
		return
	}

	rpc.NezhaHandlerSingleton.StartStream(streamId, time.Second*10)
}

func (cp *commonPage) createFM(c *gin.Context) {
	if _, authorized := c.Get(model.CtxKeyAuthorizedUser); !authorized {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "无权访问",
			Msg:   "用户未登录",
			Link:  "/login",
			Btn:   "去登录",
		}, true)
		return
	}
	if mygin.BlockIfNotSuperAdmin(c, true) {
		return
	}
	IdString := c.PostForm("id")
	streamId, err := uuid.GenerateUUID()
	if err != nil {
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code: http.StatusInternalServerError,
			Title: singleton.Localizer.MustLocalize(&i18n.LocalizeConfig{
				MessageID: "SystemError",
			}),
			Msg:  "生成会话ID失败",
			Link: "/server",
			Btn:  "返回重试",
		}, true)
		return
	}

	rpc.NezhaHandlerSingleton.CreateStream(streamId)

	serverId, err := strconv.Atoi(IdString)
	if err != nil {
		rpc.NezhaHandlerSingleton.CloseStream(streamId)
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "请求失败",
			Msg:   "请求参数有误：" + err.Error(),
			Link:  "/server",
			Btn:   "返回重试",
		}, true)
		return
	}

	singleton.ServerLock.RLock()
	server := singleton.ServerList[uint64(serverId)]
	singleton.ServerLock.RUnlock()
	if server == nil || server.TaskStream == nil {
		rpc.NezhaHandlerSingleton.CloseStream(streamId)
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "请求失败",
			Msg:   "服务器不存在或处于离线状态",
			Link:  "/server",
			Btn:   "返回重试",
		}, true)
		return
	}

	fmData, _ := utils.Json.Marshal(&model.TaskFM{
		StreamID: streamId,
	})
	if err := server.SendTask(&proto.Task{
		Type: model.TaskTypeFM,
		Data: string(fmData),
	}); err != nil {
		rpc.NezhaHandlerSingleton.CloseStream(streamId)
		mygin.ShowErrorPage(c, mygin.ErrInfo{
			Code:  http.StatusForbidden,
			Title: "请求失败",
			Msg:   "Agent信令下发失败",
			Link:  "/server",
			Btn:   "返回重试",
		}, true)
		return
	}

	c.HTML(http.StatusOK, "dashboard-"+singleton.Conf.Site.DashboardTheme+"/file", mygin.CommonEnvironment(c, gin.H{
		"SessionID": streamId,
	}))
}
