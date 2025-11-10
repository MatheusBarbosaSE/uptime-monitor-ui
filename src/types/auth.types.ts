export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}