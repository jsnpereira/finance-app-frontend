// Configuração do Keycloak com links diretos
export const KEYCLOAK_CONFIG = {
  baseUrl: "http://localhost:8080",
  realm: "finance-realm",
  clientId: "finance-frontend-app",
  redirectUri: "http://localhost:3000/callback",
  logoutRedirectUri: "http://localhost:3000",

  // URLs completas para autenticação
  urls: {
    login:
      "http://localhost:8080/realms/finance-realm/protocol/openid-connect/auth?client_id=finance-frontend-app&redirect_uri=http://localhost:3000/callback&response_type=code&scope=openid profile email",
    register:
      "http://localhost:8080/realms/finance-realm/protocol/openid-connect/registrations?client_id=finance-frontend-app&redirect_uri=http://localhost:3000/callback&response_type=code&scope=openid",
    logout:
      "http://localhost:8080/realms/finance-realm/protocol/openid-connect/logout",
    token:
      "http://localhost:8080/realms/finance-realm/protocol/openid-connect/token",
    userInfo:
      "http://localhost:8080/realms/finance-realm/protocol/openid-connect/userinfo",
  },
};

export default KEYCLOAK_CONFIG;
