package provider

type JWTProvider struct {
	secretKey string
}

func NewJWTProvider(secretKey string) *JWTProvider {
	return &JWTProvider{secretKey: secretKey}
}
