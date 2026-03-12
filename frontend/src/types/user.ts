export type UserRole = "player" | "manager";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  created_at?: string;
  last_login?: string;
}

export interface CreateUserDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
}

export interface UpdateUserDTO {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
