"use client";
// #UPDATE (Session 7) — Navbar global: logo "KelanaAI" (kiri) + nav kanan atas.
// #UPDATE (Session 8) — jadi Client Component: BONUS "Welcome back, {name}" +
// Login/Register kalau belum login, atau Profile/Logout kalau sudah login.
// #UPDATE (Session 8, UX cleanup) — "History" & "My Trips" (dulu 2 link ke tujuan
// yang sama, redundant) dikonsolidasi jadi 1 link "My Trips" -> /trips. Ditambah
// link "Home" eksplisit -> / (sebelumnya cuma bisa lewat klik logo, kurang jelas).
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-blue-700">
          KelanaAI
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-700 transition-colors">
            Home
          </Link>
          <Link href="/trips" className="hover:text-blue-700 transition-colors">
            My Trips
          </Link>

          {!loading && user && (
            <>
              {/* BONUS (Session 8) — Personalized Welcome */}
              <span className="hidden sm:inline text-slate-500">
                Welcome back, <span className="font-semibold text-slate-800">{user.name}</span> 👋
              </span>
              <Link href="/profile" className="hover:text-blue-700 transition-colors">
                Profile
              </Link>
              <button onClick={logout} className="hover:text-blue-700 transition-colors">
                Logout
              </button>
            </>
          )}

          {!loading && !user && (
            <>
              <Link href="/login" className="hover:text-blue-700 transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}