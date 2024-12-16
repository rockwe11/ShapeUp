package api

import "ShapeUP/pkg/vars"

type Usecase interface {
	Authenticate(string, string) (string, error)
	ValidateJWT(string) (*vars.JWTClaims, error)
	Register(string, string, string) error
}
