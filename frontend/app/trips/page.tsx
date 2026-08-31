"use client";
// HOMEWORK (Session 8, #6) — Trip List jadi Client Component supaya bisa kirim
// Authorization header. Token JWT tersimpan di localStorage, cuma bisa diakses
// dari browser/client, TIDAK bisa dari Server Component (fetch server-side lama).
// Filtering "hanya trip milik user login" sudah ditangani backend (GET /trips).
import { useEffect, useState } from "react";
import { getTrips } from "@/services/tripService";
import TripsBoard from "@/app/components/TripsBoard";
import RouteGuard from "@/app/components/RouteGuard";
import type { Trip } from "@/types/trip";

function TripsContent() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTrips()
      .then(setTrips)
      .catch(() => setError("Unable to load trips."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
      <p className="text-gray-500 mb-6">{trips.length} saved itineraries</p>
      <TripsBoard trips={trips} />
    </>
  );
}

export default function TripsPage() {
  return (
    <RouteGuard>
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-1">Trip History</h1>
        <TripsContent />
      </main>
    </RouteGuard>
  );
}