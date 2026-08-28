import Link from "next/link";

// #UPDATE (Session 7) — Navbar global: logo "KelanaAI" (kiri) + nav "History" &
// "My Trips" (kanan atas). Keduanya route ke /trips (Trip History Dashboard),
// sesuai request: "nav bar histori dan mytrip route ke /trips".
// Dipasang di app/layout.tsx supaya tampil konsisten di semua halaman
export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-blue-700">
          KelanaAI
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/trips" className="hover:text-blue-700 transition-colors">
            History
          </Link>
          <Link
            href="/trips"
            className="hover:text-blue-700 transition-colors"
          >
            My Trips
          </Link>
        </div>
      </nav>
    </header>
  );
}
