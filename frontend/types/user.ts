export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at?: string;
}

// dipakai khusus untuk response GET /auth/me (ada total_trips)
export interface AuthUser extends User {
  total_trips?: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}