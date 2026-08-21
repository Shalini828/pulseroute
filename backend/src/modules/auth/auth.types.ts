export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: true;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
}
