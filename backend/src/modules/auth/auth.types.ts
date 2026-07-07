/**
 * Request body for user registration.
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Request body for user login.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * User model stored in memory.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

/**
 * Successful authentication response.
 */
export interface AuthResponse {
  success: true;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * JWT payload.
 */
export interface JwtPayload {
  userId: string;
  email: string;
}
