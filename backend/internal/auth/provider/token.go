package provider

import (
	"ShapeUP/pkg/vars"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func (j *JWTProvider) GenerateToken(username string) (string, error) {
	claims := vars.JWTClaims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(j.secretKey))
}

func (j *JWTProvider) ValidateToken(tokenString string) (*vars.JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &vars.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(j.secretKey), nil
	})
	if err != nil || !token.Valid {
		return nil, err
	}
	claims, ok := token.Claims.(*vars.JWTClaims)
	if !ok {
		return nil, fmt.Errorf("invalid claims")
	}
	return claims, nil
}
