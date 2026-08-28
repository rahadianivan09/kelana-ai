export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6" />
      {/* #UPDATE (Session 7) — skeleton horizontal, selaras dengan TripCard baru */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    </main>
  );
}