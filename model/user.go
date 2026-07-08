package model

import (
	"errors"
	"strings"
	"time"

	"code.gitea.io/sdk/gitea"
	"github.com/google/go-github/v75/github"
	"github.com/xanzy/go-gitlab"
	"gorm.io/gorm"

	"github.com/railzen/nezha-zero/pkg/utils"
)

const MaxPasswordSessions = 100

type User struct {
	Common
	Login     string `json:"login,omitempty"`      // 登录名
	AvatarURL string `json:"avatar_url,omitempty"` // 头像地址
	Name      string `json:"name,omitempty"`       // 昵称
	Blog      string `json:"blog,omitempty"`       // 网站链接
	Email     string `json:"email,omitempty"`      // 邮箱
	Hireable  bool   `json:"hireable,omitempty"`
	Bio       string `json:"bio,omitempty"` // 个人简介

	Token        string    `json:"-"`                       // 会话 Token 的 SHA-256 摘要（hex）
	TokenExpired time.Time `json:"token_expired,omitempty"` // Token 过期时间
	SuperAdmin   bool      `json:"super_admin,omitempty"`   // 超级管理员
}

// SavePasswordSession 密码登录保存 Session；同一 Login 最多保留 MaxPasswordSessions 条，
// 超出时按 updated_at 最早淘汰。OAuth 登录不走此路径。
func (u *User) SavePasswordSession(db *gorm.DB) error {
	return db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(u).Error; err != nil {
			return err
		}
		var ids []uint64
		if err := tx.Model(&User{}).Where("login = ?", u.Login).
			Order("updated_at ASC").Pluck("id", &ids).Error; err != nil {
			return err
		}
		if len(ids) <= MaxPasswordSessions {
			return nil
		}
		excess := len(ids) - MaxPasswordSessions
		return tx.Unscoped().Where("id IN ?", ids[:excess]).Delete(&User{}).Error
	})
}

// FindUserBySessionToken 按明文会话 Token 查找用户（库内仅存哈希）。
func FindUserBySessionToken(db *gorm.DB, plainToken string) (*User, error) {
	plainToken = strings.TrimSpace(plainToken)
	if plainToken == "" {
		return nil, errors.New("empty session token")
	}
	var u User
	err := db.Where("token = ?", utils.HashSessionToken(plainToken)).First(&u).Error
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func NewUserFromGitea(gu *gitea.User) User {
	var u User
	u.ID = uint64(gu.ID)
	u.Login = gu.UserName
	u.AvatarURL = gu.AvatarURL
	u.Name = gu.FullName
	if u.Name == "" {
		u.Name = u.Login
	}
	u.Blog = gu.Website
	u.Email = gu.Email
	u.Bio = gu.Description
	return u
}

func NewUserFromGitlab(gu *gitlab.User) User {
	var u User
	u.ID = uint64(gu.ID)
	u.Login = gu.Username
	u.AvatarURL = gu.AvatarURL
	u.Name = gu.Name
	if u.Name == "" {
		u.Name = u.Login
	}
	u.Blog = gu.WebsiteURL
	u.Email = gu.Email
	u.Bio = gu.Bio
	return u
}

func NewUserFromGitHub(gu *github.User) User {
	var u User
	u.ID = uint64(gu.GetID())
	u.Login = gu.GetLogin()
	u.AvatarURL = gu.GetAvatarURL()
	u.Name = gu.GetName()
	// 昵称为空的情况
	if u.Name == "" {
		u.Name = u.Login
	}
	u.Blog = gu.GetBlog()
	u.Email = gu.GetEmail()
	u.Hireable = gu.GetHireable()
	u.Bio = gu.GetBio()
	return u
}
