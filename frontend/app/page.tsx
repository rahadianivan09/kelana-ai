"use client";
// #HANDS-ON LAB — halaman utama: form -> call FastAPI -> auto redirect ke dashboard
import { useState } from "react";
import { useRouter } from "next/navigation";
import HeroImage from "./components/HeroImage";
import TripForm from "./components/TripForm";
import Spinner from "./components/Spinner";
import Footer from "./components/Footer";
import { createTrip, generateRecommendation } from "@/services/tripService";
import type { CreateTripPayload } from "@/types/trip";

export default function Home() {
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
      // #HANDS-ON LAB (Session 7, Part 8) — auto redirect setelah generate sukses
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