package provider

import (
	"database/sql"
	"errors"
)

func (p *Provider) CreateUser(username, email, hashedPassword string) error {
	_, err := p.conn.Exec("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", username, email, hashedPassword)
	return err
}

func (p *Provider) CheckUserByEmail(email string) (bool, error) {
	err := p.conn.QueryRow("SELECT (email) FROM users WHERE email = $1", email).Scan(&email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return false, nil
		}
		return false, err
	}

	return true, nil
}

func (p *Provider) GetUsernameAndHashedPassword(email string) (string, string, error) {
	var password_db string
	var name string
	err := p.conn.QueryRow("SELECT name, password FROM users WHERE email = $1", email).Scan(&name, &password_db)
	if err != nil {
		return "", "", err
	}

	return name, password_db, nil
}
