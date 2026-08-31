import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload, User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_KEY = "kelanaai_access_token";

// HANDS-ON LAB (Session 8, Part 7) — simpan/baca JWT dari localStorage
export function getToken(): string | null {
  if (typeof window === "undefined") return null; // guard SSR
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// HOMEWORK (Session 8, #4) — Register
export async function register(payload: RegisterPayload): Promise<User> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Failed to register");
  }
  return res.json();
}

// HOMEWORK (Session 8, #4) — Login -> simpan token
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Invalid email or password");
  }
  const data: AuthResponse = await res.json();
  setToken(data.access_token);
  return data;
}

// PART 8 — Logout = forget the token. JWT stateless, tidak perlu API call.
export function logout() {
  clearToken();
}

// CHALLENGE (Session 8) — profile: nama, email, total trip
export async function getMe(): Promise<AuthUser> {
  const token = getToken();
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}