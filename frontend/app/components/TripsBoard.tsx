"use client";
import { useMemo, useState } from "react";
import { Trip } from "@/types/trip";
import TripCard from "./TripCard";
import Pagination from "./Pagination";

// #BONUS (Session 7, Challenge) — pagination aktif kalau trip > 10 item
const PAGE_SIZE = 10;
type SortMode = "latest" | "oldest" | "budget";

export default function TripsBoard({ trips }: { trips: Trip[] }) {
  // #CORE CHALLENGE (Session 7) — search state: filter by destination / travel style
  const [search, setSearch] = useState("");
  // #BONUS (Session 7) — sort state: latest / oldest / highest budget
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [page, setPage] = useState(1);

  // #CORE CHALLENGE (Session 7) — "Filter the trips array on every keystroke."
  // Filter dijalankan setiap `search` berubah (setiap keystroke di input).
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return trips;
    return trips.filter(
      (t) =>
        t.destination.toLowerCase().includes(term) ||
        (t.travel_style ?? "").toLowerCase().includes(term)
    );
  }, [trips, search]);

  // #BONUS (Session 7) — Sort Trips: Latest (newest first) / Oldest (first trip
  // first) / Highest Budget (descending), sesuai code hint di PDF:
  // trips.sort((a, b) => b.budget - a.budget)
  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortMode === "oldest") {
      return list.sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
    }
    if (sortMode === "budget") {
      return list.sort((a, b) => b.budget - a.budget);
    }
    return list.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
  }, [filtered, sortMode]);

  if (trips.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-xl p-12 text-center text-gray-500">
        <p className="text-lg font-medium mb-2">No trips found.</p>
        <p className="mb-4">Create your first itinerary.</p>
        <a href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">
          Generate a Trip →
        </a>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const visibleTrips = sorted.slice(start, start + PAGE_SIZE);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* #CORE CHALLENGE (Session 7) — search input, UI hint sesuai PDF */}
        <input
          type="text"
          placeholder="Search trips..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        {/* #BONUS (Session 7) — dropdown untuk switch sort mode */}
        <select
          value={sortMode}
          onChange={(e) => { setSortMode(e.target.value as SortMode); setPage(1); }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="budget">Highest Budget</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No trips match your search.</p>
      ) : (
        <>
          {/* #UPDATE (Session 7) — vertical stack of horizontal TripCard rows,
              bukan grid card vertikal, sesuai mockup dashboard baru. */}
          <div className="flex flex-col gap-3">
            {visibleTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
          {/* #BONUS (Session 7) — pagination hanya muncul kalau totalPages > 1 (>10 trips) */}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </>
  );
}