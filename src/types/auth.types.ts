// Types para o sistema de autenticação
export interface UserInfo {
  name: string;
  email: string;
  username: string;
  roles: string[];
  sub?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
}
