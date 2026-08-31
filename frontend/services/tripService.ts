import { Trip, CreateTripPayload } from "@/types/trip";
import { getToken } from "@/services/authService"; // HANDS-ON LAB (Session 8, Part 6)

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// HANDS-ON LAB (Session 8, Part 6) — otomatis nempelin Bearer token ke tiap request
function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/trips`, { cache: "no-store", headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch trips");
  return res.json();
}

export async function getTrip(id: number): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${id}`, { cache: "no-store", headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch trip");
  return res.json();
}

export async function createTrip(payload: CreateTripPayload): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create trip");
  return res.json();
}

export async function generateRecommendation(tripId: number) {
  const res = await fetch(`${API_URL}/trips/${tripId}/generate`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to generate recommendation");
  return res.json();
}

export type { CreateTripPayload };