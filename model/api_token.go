package model

type ApiToken struct {
	Common
	UserID uint64 `json:"user_id"`
	Token  string `json:"token"`
	Hash   string `json:"-"`
	Note   string `json:"note"`
}
