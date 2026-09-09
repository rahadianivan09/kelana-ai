"use client";
// #HANDS-ON LAB — halaman create trip: form -> call FastAPI -> auto redirect ke dashboard
// UI POLISH — dipindah dari "/" (root) ke "/trips/new" supaya "/" bisa jadi landing page
// publik, sementara pembuatan trip tetap protected dan konsisten dengan pola
// resource routing /trips (list) -> /trips/new (create) -> /trips/[id] (detail).
import { useState } from "react";
import { useRouter } from "next/navigation";
import HeroImage from "@/app/components/HeroImage";
import TripForm from "@/app/components/TripForm";
import Spinner from "@/app/components/Spinner";
import Footer from "@/app/components/Footer";
import RouteGuard from "@/app/components/RouteGuard"; // HOMEWORK (Session 8, #5) — protect generate-trip page
import { createTrip, generateRecommendation } from "@/services/tripService";
import type { CreateTripPayload } from "@/types/trip";

function NewTripContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | undefined>();

  async function handleSubmit(payload: CreateTripPayload) {
    setLoading(true);
    setError(null);
    setDestination(payload.destination);
    try {
      const trip = await createTrip(payload);
      await generateRecommendation(trip.id);
      // #HANDS-ON LAB (Session 7, Part 8) — auto redirect setelah generate sukses,
      // trip baru langsung kelihatan tersimpan di My Trips
      router.push("/trips");
    } catch {
      setError("Unable to generate itinerary. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <HeroImage destination={destination} />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:py-10">
        <TripForm onSubmit={handleSubmit} disabled={loading} />
        {loading && <Spinner />}
        {error && !loading && (
          <div className="rounded-xl bg-teal-600 py-6 text-center text-white">
            <p className="font-semibold">{error}</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default function NewTripPage() {
  return (
    <RouteGuard>
      <NewTripContent />
    </RouteGuard>
  );
}
