import Link from "next/link";
import { Trip } from "@/types/trip";
import { DestinationIcon } from "./DestinationIcon";

// #HOMEWORK (Session 7) — Currency & Budget Formatting: "USD 2,000" bukan "2000"
function formatBudget(budget: number): string {
  return `USD ${budget.toLocaleString("en-US")}`;
}

// #HOMEWORK (Session 7) — Category Badge (color-coded): Backpacker / Standard / Luxury
const CATEGORY_STYLES: Record<string, string> = {
  Backpacker: "bg-orange-100 text-orange-700",
  Standard: "bg-blue-100 text-blue-700",
  Luxury: "bg-purple-100 text-purple-700",
};

// #HOMEWORK (Session 7) — Travel Style Badge: Family / Solo / Couple (+ Friends/Business)
const STYLE_STYLES: Record<string, string> = {
  Solo: "bg-gray-100 text-gray-700",
  Couple: "bg-pink-100 text-pink-700",
  Family: "bg-green-100 text-green-700",
  Friends: "bg-yellow-100 text-yellow-700",
  Business: "bg-slate-100 text-slate-700",
};

// #UPDATE (Session 7) — Layout kartu diubah dari vertical block -> horizontal row,
// mengikuti mockup PDF: ikon + nama + badge di kiri, detail hari/budget/style di
// tengah, tombol "View Details" di kanan. Seluruh row tetap clickable ke /trips/[id].
export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border rounded-xl p-4 bg-white hover:shadow-md hover:border-blue-200 transition-all"
    >
      {/* Icon */}
      <DestinationIcon destination={trip.destination} />

      {/* Destination + badges */}
      <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
        <h3 className="font-semibold text-lg text-slate-800 truncate">{trip.destination}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            CATEGORY_STYLES[trip.category] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {trip.category}
        </span>
        {trip.travel_style && (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              STYLE_STYLES[trip.travel_style] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {trip.travel_style}
          </span>
        )}
      </div>

      {/* Detail text: days · budget */}
      <p className="text-gray-500 text-sm sm:w-56 sm:text-right shrink-0">
        {trip.days} days · {formatBudget(trip.budget)}
      </p>

      {/* View Details button */}
      <span className="shrink-0 inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
        View Details →
      </span>
    </Link>
  );
}
