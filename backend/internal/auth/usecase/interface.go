package usecase

import "ShapeUP/pkg/vars"

type Provider interface {
	CreateUser(string, string, string) error
	CheckUserByEmail(string) (bool, error)
	GetUsernameAndHashedPassword(string) (string, string, error)
}

type JWTProvider interface {
	GenerateToken(string) (string, error)
	ValidateToken(string) (*vars.JWTClaims, error)
}
