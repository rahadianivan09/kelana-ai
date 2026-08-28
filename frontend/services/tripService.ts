import { Trip, CreateTripPayload } from "@/types/trip";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/trips`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch trips");
  return res.json();
}

export async function getTrip(id: number): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch trip");
  return res.json();
}

export async function createTrip(payload: CreateTripPayload): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create trip");
  return res.json();
}

export async function generateRecommendation(tripId: number) {
  const res = await fetch(`${API_URL}/trips/${tripId}/generate`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to generate recommendation");
  return res.json();
}

// re-export biar file lain (TripForm dll) cukup import 1 sumber: @/services/tripService
export type { CreateTripPayload };