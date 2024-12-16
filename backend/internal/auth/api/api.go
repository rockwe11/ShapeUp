package api

import (
	"ShapeUP/pkg/vars"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Server struct {
	minPassword int
	maxPassword int
	minUsername int
	maxUsername int

	server  *echo.Echo
	r       *echo.Group
	address string

	uc Usecase
}

func NewServer(ip string, port int, minPassword, maxPassword, minUsername, maxUsername int, secret string, uc Usecase) *Server {
	api := Server{
		minPassword: minPassword,
		maxPassword: maxPassword,
		minUsername: minUsername,
		maxUsername: maxUsername,

		uc: uc,
	}

	api.server = echo.New()
	api.server.Use(middleware.Logger())
	api.server.Use(middleware.Recover())
	api.server.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{echo.GET, echo.POST},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAuthorization},
	}))

	api.server.POST("/api/register", api.Register)
	api.server.POST("/api/login", api.Login)
	api.r = api.server.Group("/profile")

	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(vars.JWTClaims)
		},
		SigningKey: []byte(secret),
	}

	api.r.Use(echojwt.WithConfig(config))
	api.r.GET("", api.AuthMiddleware)

	api.address = fmt.Sprintf("%s:%d", ip, port)

	return &api
}

func (api *Server) Run() {
	api.server.Logger.Fatal(api.server.Start(api.address))
}
