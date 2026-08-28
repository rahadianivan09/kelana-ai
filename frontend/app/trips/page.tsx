import { getTrips } from "@/services/tripService";
import TripsBoard from "@/app/components/TripsBoard";

export default async function TripsPage() {
  const trips = await getTrips();
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">Trip History</h1>
      <p className="text-gray-500 mb-6">{trips.length} saved itineraries</p>
      <TripsBoard trips={trips} />
    </main>
  );
}