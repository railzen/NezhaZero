package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/naiba/nezha/model"
	"github.com/naiba/nezha/pkg/mygin"
	"github.com/naiba/nezha/pkg/utils"
	"github.com/naiba/nezha/service/singleton"
)

func (cv *compatV1) login(c *gin.Context) {
	var lr model.V1LoginRequest
	if err := c.ShouldBindJSON(&lr); err != nil {
		c.JSON(400, V1Response[any]{
			Error: err.Error(),
		})
		return
	}

	apiToken := lr.Password
	isLogin := false
	var u model.User
	if apiToken != "" {
		singleton.ApiLock.RLock()
		if token, ok := singleton.ApiTokenList[apiToken]; ok {
			err := singleton.DB.First(&u).Where("id = ?", token.UserID).Error
			isLogin = err == nil && token.Note == lr.Username
		}
		singleton.ApiLock.RUnlock()
		if isLogin {
			c.Set(model.CtxKeyAuthorizedUser, &u)
			c.Set("isAPI", true)
		}
	}

	if !isLogin {
		c.JSON(400, V1Response[any]{
			Error: "ApiErrorUnauthorized",
		})
	} else {
		c.SetCookie("nz-jwt", u.Token, 60*60*24*365, "/", "", false, false)
		c.JSON(200, V1Response[model.V1LoginResponse]{
			Success: true,
			Data: model.V1LoginResponse{
				Expire: u.TokenExpired.Format(time.RFC3339),
				Token:  u.Token,
			},
		})
	}
}

func (cv *compatV1) refreshToken(c *gin.Context) {
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
		user.TokenExpired = time.Now().AddDate(0, 2, 0)
		singleton.DB.Save(&user)

		c.SetCookie("nz-jwt", user.Token, 60*60*24*365, "/", "", false, false)
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
