"use client";
// #HANDS-ON LAB — halaman utama: form -> call FastAPI -> tampilkan hasil AI (loading + error handling)
import { useState } from "react";
import HeroImage from "./components/HeroImage";
import TripForm from "./components/TripForm";
import TripResult from "./components/TripResult";
import Spinner from "./components/Spinner";
import Footer from "./components/Footer";
import { createTrip, generateRecommendation, type CreateTripPayload } from "@/lib/api";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | undefined>();
  const [recommendation, setRecommendation] = useState<string | null>(null);

  async function handleSubmit(payload: CreateTripPayload) {
    setLoading(true);
    setError(null);
    setRecommendation(null);
    setDestination(payload.destination);

    try {
      // #HANDS-ON LAB — dua langkah: create trip, lalu generate rekomendasi AI
      const trip = await createTrip(payload);
      const result = await generateRecommendation(trip.id);
      setRecommendation(result.recommendation);
    } catch {
      // #HANDS-ON LAB — error handling: pesan ramah, bukan stack trace
      setError("Unable to generate itinerary. Please try again.");
    } finally {
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

        {recommendation && !loading && !error && (
          <TripResult rawRecommendation={recommendation} />
        )}
      </div>

      <Footer />
    </main>
  );
}