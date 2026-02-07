type RuntimeEnv = Partial<{
  KEYCLOAK_BASE_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_REDIRECT_URI: string;
  KEYCLOAK_LOGOUT_REDIRECT_URI: string;
}>;

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

const runtimeEnv = (): RuntimeEnv => {
  if (typeof window === "undefined") return {};
  return ((window as Window & { _env_?: RuntimeEnv })._env_ ??
    {}) as RuntimeEnv;
};

const normalizeEnvValue = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const RUNTIME_ENV = runtimeEnv();

const ENV = {
  baseUrl:
    normalizeEnvValue(RUNTIME_ENV.KEYCLOAK_BASE_URL) ??
    process.env.REACT_APP_KEYCLOAK_BASE_URL,
  realm:
    normalizeEnvValue(RUNTIME_ENV.KEYCLOAK_REALM) ??
    process.env.REACT_APP_KEYCLOAK_REALM,
  clientId:
    normalizeEnvValue(RUNTIME_ENV.KEYCLOAK_CLIENT_ID) ??
    process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
  redirectUri:
    normalizeEnvValue(RUNTIME_ENV.KEYCLOAK_REDIRECT_URI) ??
    process.env.REACT_APP_KEYCLOAK_REDIRECT_URI,
  logoutRedirectUri:
    normalizeEnvValue(RUNTIME_ENV.KEYCLOAK_LOGOUT_REDIRECT_URI) ??
    process.env.REACT_APP_KEYCLOAK_LOGOUT_REDIRECT_URI,
};

const defaultOrigin =
  typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
const defaultRedirectUri = `${defaultOrigin}/callback`;

const baseUrl = normalizeBaseUrl(ENV.baseUrl ?? "http://localhost:8080");
const realm = ENV.realm ?? "finance-realm";
const clientId = ENV.clientId ?? "finance-frontend-app";
const redirectUri = ENV.redirectUri ?? defaultRedirectUri;
const logoutRedirectUri = ENV.logoutRedirectUri ?? defaultOrigin;

const buildUrl = (path: string, params?: Record<string, string>) => {
  const base = `${baseUrl}/realms/${realm}/protocol/openid-connect/${path}`;
  if (!params) return base;
  const search = new URLSearchParams(params);
  return `${base}?${search.toString()}`;
};

// Configuração do Keycloak com links diretos
export const KEYCLOAK_CONFIG = {
  baseUrl,
  realm,
  clientId,
  redirectUri,
  logoutRedirectUri,

  // URLs completas para autenticação
  urls: {
    login: buildUrl("auth", {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid profile email",
    }),
    register: buildUrl("registrations", {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid",
    }),
    logout: buildUrl("logout"),
    token: buildUrl("token"),
    userInfo: buildUrl("userinfo"),
  },
};

export default KEYCLOAK_CONFIG;
