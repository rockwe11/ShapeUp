package main

import (
	"ShapeUP/internal/auth/api"
	"ShapeUP/internal/auth/config"
	"ShapeUP/internal/auth/provider"
	"ShapeUP/internal/auth/usecase"
	"flag"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	configPath := flag.String("config-path", "./configs/auth.yaml", "путь к файлу конфигурации")
	flag.Parse()

	cfg, err := config.LoadConfig(*configPath)
	if err != nil {
		log.Fatal(err)
	}

	prv := provider.NewProvider(cfg.DB.Host, cfg.DB.Port, cfg.DB.User, cfg.DB.Password, cfg.DB.DBname)
	jwt_prv := provider.NewJWTProvider(cfg.JWT.Secret)
	use := usecase.NewUsecase(cfg.Usecase.DefaultMessage, prv, jwt_prv)
	srv := api.NewServer(cfg.IP, cfg.Port, cfg.API.MinPasswordSize, cfg.API.MaxPasswordSize, cfg.API.MinUsernameSize, cfg.API.MaxUsernameSize, cfg.JWT.Secret, use)

	srv.Run()
}
