"use client";
// HOMEWORK (Session 8, #6) — Trip List jadi Client Component supaya bisa kirim
// Authorization header. Token JWT tersimpan di localStorage, cuma bisa diakses
// dari browser/client, TIDAK bisa dari Server Component (fetch server-side lama).
// Filtering "hanya trip milik user login" sudah ditangani backend (GET /trips).
import { useEffect, useState } from "react";
import Link from "next/link";
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
        <div className="mb-1 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Trip History</h1>
          <Link
            href="/trips/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Trip
          </Link>
        </div>
        <TripsContent />
      </main>
    </RouteGuard>
  );
}