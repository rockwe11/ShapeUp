package api

import (
	"ShapeUP/pkg/vars"
	"log"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func (srv *Server) Register(c echo.Context) error {
	user := struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `jsom:"password"`
	}{}

	err := c.Bind(&user)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	if user.Name == "" || user.Password == "" || user.Email == "" {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
	}

	if len(user.Name) < srv.minUsername || len(user.Name) > srv.maxUsername {
		return echo.NewHTTPError(http.StatusUnauthorized, "Username should be "+strconv.Itoa(srv.minUsername)+"-"+strconv.Itoa(srv.maxUsername)+" length")
	}

	if len(user.Password) < srv.minPassword || len(user.Password) > srv.maxPassword {
		return echo.NewHTTPError(http.StatusUnauthorized, "Password should be "+strconv.Itoa(srv.minPassword)+"-"+strconv.Itoa(srv.maxPassword)+" length")
	}

	err = srv.uc.Register(user.Name, user.Email, user.Password)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create account")
	}

	return c.JSON(http.StatusOK, "OK!")
}

func (srv *Server) Login(c echo.Context) error {
	user := struct {
		Email    string `json:"email"`
		Password string `jsom:"password"`
	}{}

	err := c.Bind(&user)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	if user.Email == "" || user.Password == "" {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
	}

	token, err := srv.uc.Authenticate(user.Email, user.Password)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, echo.Map{"token": token})
}

func (srv *Server) AuthMiddleware(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	if user == nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Token is missing or invalid"})
	}
	claims := user.Claims.(*vars.JWTClaims)
	log.Printf("Claims: %v", claims)
	username := claims.Username
	log.Printf("Username: %v", username)
	return c.JSON(http.StatusOK, map[string]string{"message": "Welcome " + username})
}
