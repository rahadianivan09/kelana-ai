"use client";
// HOMEWORK (Session 8, #5/#6) — Trip Detail jadi Client Component (butuh token dari
// localStorage) + dibungkus RouteGuard. Client Component tidak menerima `params`
// sebagai Promise seperti Server Component dulu, jadi dipakai hook `useParams()`.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTrip } from "@/services/tripService";
import AIRecommendationView from "@/app/components/AIRecommendationView";
import RouteGuard from "@/app/components/RouteGuard";
import type { Trip } from "@/types/trip";

function TripDetailContent() {
  const params = useParams<{ id: string }>();
  const tripId = Number(params.id);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Number.isNaN(tripId)) {
      setError("Invalid trip id.");
      setLoading(false);
      return;
    }
    getTrip(tripId)
      .then(setTrip)
      .catch(() => setError("Unable to load trip."))
      .finally(() => setLoading(false));
  }, [tripId])

  if (loading) return <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />;
  if (error || !trip) return <p className="text-red-600">{error ?? "Trip not found."}</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mt-2 mb-6">{trip.destination}</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-3"><p className="text-xs text-gray-500">DESTINATION</p><p className="font-medium">{trip.destination}</p></div>
        <div className="border rounded-lg p-3"><p className="text-xs text-gray-500">BUDGET</p><p className="font-medium">USD {trip.budget.toLocaleString("en-US")}</p></div>
        <div className="border rounded-lg p-3"><p className="text-xs text-gray-500">CATEGORY</p><p className="font-medium">{trip.category}</p></div>
        <div className="border rounded-lg p-3"><p className="text-xs text-gray-500">DAYS</p><p className="font-medium">{trip.days}</p></div>
      </div>
      <h2 className="font-semibold mb-2">AI Recommendation</h2>
      <AIRecommendationView raw={trip.ai_recommendation} />
    </>
  );
}

export default function TripDetailPage() {
  return (
    <RouteGuard>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/trips" className="text-blue-600 text-sm">← Back to Trips</Link>
        <TripDetailContent />
      </main>
    </RouteGuard>
  );
}