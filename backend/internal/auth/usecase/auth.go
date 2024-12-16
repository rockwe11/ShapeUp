package usecase

import (
	"ShapeUP/pkg/vars"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

func (u *Usecase) Authenticate(email, password string) (string, error) {
	exist, err := u.p.CheckUserByEmail(email)
	if !exist {
		return "", errors.New("user not found")
	}
	if err != nil {
		return "", err
	}

	name, hashedPassword, err := u.p.GetUsernameAndHashedPassword(email)
	if err != nil {
		return "", err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}

	return u.jp.GenerateToken(name)
}

func (u *Usecase) ValidateJWT(token string) (*vars.JWTClaims, error) {
	return u.jp.ValidateToken(token)
}

func (u *Usecase) Register(name, email, password string) error {
	exist, err := u.p.CheckUserByEmail(email)
	if err != nil {
		return err
	}
	if exist {
		return errors.New("user already exists")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}
	return u.p.CreateUser(name, email, string(hashedPassword))
}
