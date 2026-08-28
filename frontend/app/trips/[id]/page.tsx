import { getTrip } from "@/services/tripService";
import AIRecommendationView from "@/app/components/AIRecommendationView";
import Link from "next/link";

// #BUGFIX (Session 7) — di Next.js 15, `params` pada dynamic route (app/trips/[id])
// adalah sebuah Promise, bukan object biasa. Kode lama membaca `params.id` secara
// sinkron sehingga nilainya `undefined` -> Number(undefined) = NaN -> request ke
// /api/v1/trips/NaN -> FastAPI balas 422 (bukan 200) -> tripService melempar
// "Failed to fetch trip". Fix: `params` harus di-await dulu.
export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tripId = Number(id);
  const trip = await getTrip(tripId);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/trips" className="text-blue-600 text-sm">← Back to Trips</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">{trip.destination}</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-3"><p className="text-xs text-gray-500">DESTINATION</p><p className="font-medium">{trip.destination}</p></div>
        <div className="border rounded-lg p-3"><p className="text-xs text-gray-500">BUDGET</p><p className="font-medium">USD {trip.budget.toLocaleString("en-US")}</p></div>
        <div className="border rounded-lg p-3"><p className="text-xs text-gray-500">CATEGORY</p><p className="font-medium">{trip.category}</p></div>
        <div className="border rounded-lg p-3"><p className="text-xs text-gray-500">DAYS</p><p className="font-medium">{trip.days}</p></div>
      </div>

      <h2 className="font-semibold mb-2">AI Recommendation</h2>
      <AIRecommendationView raw={trip.ai_recommendation} />
    </main>
  );
}