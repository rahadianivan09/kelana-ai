// #HANDS-ON LAB — wrapper fetch ke FastAPI backend
const API_BASE_URL = "http://localhost:8000";

export interface CreateTripPayload {
  destination: string;
  budget: number;
  days: number;
  travel_style: string;
}

export interface Trip {
  id: number;
  destination: string;
  budget: number;
  days: number;
  travel_style: string;
  ai_recommendation: string | null;
}

export interface GenerateResponse {
  trip_id: number;
  destination: string;
  recommendation: string;
}

export async function createTrip(payload: CreateTripPayload): Promise<Trip> {
  const res = await fetch(`${API_BASE_URL}/api/v1/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create trip");
  return res.json();
}

export async function generateRecommendation(tripId: number): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/trips/${tripId}/generate`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to generate AI recommendation");
  return res.json();
}