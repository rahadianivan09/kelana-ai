export type TripCategory = "Backpacker" | "Standard" | "Luxury";
export type TravelStyle = "Solo" | "Couple" | "Family" | "Friends" | "Business";

export interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
}

export interface BudgetItem {
  category: string;
  amount: number;
}

export interface AIRecommendation {
  itinerary: DayItinerary[];
  travel_tips: string[];
  food_recommendations: string[];
  budget_breakdown: BudgetItem[];
}

export interface Trip {
  id: number;
  destination: string;
  budget: number;
  days: number;
  category: TripCategory;
  daily_budget: number;
  travel_style: string;
  ai_recommendation?: string | null;
  created_at?: string;
}

// Payload buat bikin trip baru dari form — dipindah dari lib/api.ts lama
export interface CreateTripPayload {
  destination: string;
  budget: number;
  days: number;
  travel_style: string;
}