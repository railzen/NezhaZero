package controller

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/hashicorp/go-uuid"
	"github.com/railzen/nezha-zero/model"
	"github.com/railzen/nezha-zero/pkg/mygin"
	"github.com/railzen/nezha-zero/pkg/utils"
	"github.com/railzen/nezha-zero/pkg/websocketx"
	"github.com/railzen/nezha-zero/proto"
	"github.com/railzen/nezha-zero/service/rpc"
	"github.com/railzen/nezha-zero/service/singleton"
)

func (cv *compatV1) createTerminal(c *gin.Context) {
	if mygin.BlockIfNotSuperAdmin(c, false) {
		return
	}
	var createTerminalReq model.V1TerminalForm
	if err := c.ShouldBind(&createTerminalReq); err != nil {
		c.JSON(500, V1Response[any]{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	streamId, err := uuid.GenerateUUID()
	if err != nil {
		c.JSON(500, V1Response[any]{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	rpc.NezhaHandlerSingleton.CreateStream(streamId)

	singleton.ServerLock.RLock()
	server := singleton.ServerList[createTerminalReq.ServerID]
	singleton.ServerLock.RUnlock()
	if server == nil || server.TaskStream == nil {
		rpc.NezhaHandlerSingleton.CloseStream(streamId)
		c.JSON(500, V1Response[string]{
			Success: false,
			Error:   "服务器不存在或处于离线状态",
		})
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
		c.JSON(500, V1Response[any]{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	response := model.V1CreateTerminalResponse{
		SessionID:  streamId,
		ServerID:   server.ID,
		ServerName: server.Name,
	}
	c.JSON(200, V1Response[model.V1CreateTerminalResponse]{
		Success: true,
		Data:    response,
	})
}

func (cv *compatV1) terminalStream(c *gin.Context) {
	if mygin.BlockIfNotSuperAdmin(c, false) {
		return
	}
	streamId := c.Param("id")
	if _, err := rpc.NezhaHandlerSingleton.GetStream(streamId); err != nil {
		c.JSON(404, V1Response[any]{
			Success: false,
			Error:   err.Error(),
		})
		return
	}
	defer rpc.NezhaHandlerSingleton.CloseStream(streamId)

	wsConn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(400, V1Response[any]{
			Success: false,
			Error:   err.Error(),
		})
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
