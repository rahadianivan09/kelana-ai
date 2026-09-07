"use client";
// #UPDATE (Session 7) — Navbar global: logo "KelanaAI" (kiri) + nav kanan atas.
// #UPDATE (Session 8) — jadi Client Component: BONUS "Welcome back, {name}" +
// Login/Register kalau belum login, atau Profile/Logout kalau sudah login.
// #UPDATE (Session 8, UX cleanup) — "History" & "My Trips" (dulu 2 link ke tujuan
// yang sama, redundant) dikonsolidasi jadi 1 link "My Trips" -> /trips. Ditambah
// link "Home" eksplisit -> / (sebelumnya cuma bisa lewat klik logo, kurang jelas).
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-blue-700" onClick={() => setMobileOpen(false)}>
          KelanaAI
        </Link>

        {/* Desktop nav — TIDAK DIUBAH, tetap sama persis seperti sebelumnya, hanya disembunyikan di layar kecil */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/assistant" className="hover:text-blue-700 transition-colors">
            Ask AI
          </Link>
          {/* HANDS-ON LAB (Session 10) — entry point ke fitur Conversation Memory */}
          <Link href="/chat" className="hover:text-blue-700 transition-colors">
            Chat
          </Link>
          <Link href="/" className="hover:text-blue-700 transition-colors">
            Home
          </Link>
          <Link href="/trips" className="hover:text-blue-700 transition-colors">
            My Trips
          </Link>
          {/* HOMEWORK (Session 11, #4) — link ke About page */}
          <Link href="/about" className="hidden sm:inline hover:text-blue-700 transition-colors">
            About
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

        {/* Mobile hamburger button — cuma muncul di layar kecil */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown menu — link sama persis dengan desktop, cuma tampil vertikal saat hamburger dibuka */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-600">
            <Link href="/assistant" className="hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
              Ask AI
            </Link>
            <Link href="/chat" className="hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
              Chat
            </Link>
            <Link href="/" className="hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link href="/trips" className="hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
              My Trips
            </Link>
            <Link href="/about" className="hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
              About
            </Link>

            {!loading && user && (
              <>
                <span className="text-slate-500">
                  Welcome back, <span className="font-semibold text-slate-800">{user.name}</span> 👋
                </span>
                <Link href="/profile" className="hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-left hover:text-blue-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            {!loading && !user && (
              <>
                <Link href="/login" className="hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-center text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}