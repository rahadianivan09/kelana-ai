// #HOMEWORK — hero banner destinasi. Pakai gradient (bukan foto) — konsisten
// untuk destinasi manapun
export default function HeroImage({ destination }: { destination?: string }) {
  return (
    <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-gradient-to-br from-blue-800 to-teal-600">
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8">
        <h1 className="text-2xl sm:text-4xl font-semibold text-white">KelanaAI</h1>
        <p className="mt-1 text-sm text-slate-100/90 sm:text-base">
          {destination ? `Planning your trip to ${destination}` : "Plan your next adventure"}
        </p>
      </div>
    </div>
  );
}