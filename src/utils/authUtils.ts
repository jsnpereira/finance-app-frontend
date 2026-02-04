import { KEYCLOAK_CONFIG } from '../config/keycloak.config';
import { UserInfo, TokenResponse } from '../types/auth.types';

// Chave para armazenar dados no localStorage
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
};

/**
 * Redireciona para a página de login do Keycloak
 */
export const doLogin = (): void => {
  window.location.href = KEYCLOAK_CONFIG.urls.login;
};

/**
 * Redireciona para a página de registro do Keycloak
 */
export const doRegister = (): void => {
  window.location.href = KEYCLOAK_CONFIG.urls.register;
};

/**
 * Faz logout completo do Keycloak e limpa dados locais
 */
export const doLogout = (): void => {
  // Limpa o localStorage
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  
  // Faz logout no Keycloak para encerrar a sessão SSO
  const logoutUrl = `${KEYCLOAK_CONFIG.urls.logout}?client_id=${KEYCLOAK_CONFIG.clientId}&post_logout_redirect_uri=${encodeURIComponent(KEYCLOAK_CONFIG.logoutRedirectUri)}`;
  window.location.href = logoutUrl;
};

/**
 * Troca o código de autorização por tokens de acesso
 */
export const exchangeCodeForToken = async (code: string): Promise<TokenResponse> => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: KEYCLOAK_CONFIG.clientId,
    redirect_uri: KEYCLOAK_CONFIG.redirectUri,
    code: code,
  });

  const response = await fetch(KEYCLOAK_CONFIG.urls.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Falha ao trocar código por token');
  }

  const tokenData: TokenResponse = await response.json();
  
  // Armazena os tokens
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenData.access_token);
  if (tokenData.refresh_token) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refresh_token);
  }

  return tokenData;
};

/**
 * Busca informações do usuário autenticado
 */
export const fetchUserInfo = async (): Promise<UserInfo> => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  
  if (!accessToken) {
    throw new Error('Token de acesso não encontrado');
  }

  const response = await fetch(KEYCLOAK_CONFIG.urls.userInfo, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao buscar informações do usuário');
  }

  const data = await response.json();
  
  // Decodifica o token para obter as roles
  const tokenPayload = parseJwt(accessToken);
  const roles = tokenPayload?.realm_access?.roles || [];

  const userInfo: UserInfo = {
    name: data.name || data.preferred_username || 'Usuário',
    email: data.email || '',
    username: data.preferred_username || '',
    roles: roles,
    sub: data.sub,
  };

  // Armazena as informações do usuário
  localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));

  return userInfo;
};

/**
 * Obtém as informações do usuário armazenadas localmente
 */
export const getUserInfo = (): UserInfo | null => {
  const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
  if (!userInfoStr) return null;
  
  try {
    return JSON.parse(userInfoStr) as UserInfo;
  } catch {
    return null;
  }
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (!accessToken) return false;

  // Verifica se o token ainda é válido
  try {
    const tokenPayload = parseJwt(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    return tokenPayload.exp > currentTime;
  } catch {
    return false;
  }
};

/**
 * Obtém o token de acesso
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Verifica se o usuário possui uma role específica
 */
export const hasRole = (role: string): boolean => {
  const userInfo = getUserInfo();
  return userInfo?.roles.includes(role) || false;
};

/**
 * Decodifica um JWT
 */
const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
};

/**
 * Processa o callback após autenticação
 */
export const handleAuthCallback = async (): Promise<UserInfo> => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (!code) {
    throw new Error('Código de autorização não encontrado');
  }

  // Troca o código por tokens
  await exchangeCodeForToken(code);

  // Busca informações do usuário
  const userInfo = await fetchUserInfo();

  return userInfo;
};
