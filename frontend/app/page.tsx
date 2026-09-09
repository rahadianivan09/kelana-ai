"use client";
// UI POLISH — landing page publik. "/" sebelumnya adalah form create-trip yang
// protected (RouteGuard), sekarang dipindah ke /trips/new supaya pengunjung baru
// (belum login) bisa lihat dulu apa itu KelanaAI sebelum diminta daftar/login.
import Link from "next/link";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const STEPS = [
  {
    title: "1. Buat akun",
    description: "Daftar gratis dalam beberapa detik, tidak perlu kartu kredit.",
  },
  {
    title: "2. Ceritakan rencanamu",
    description: "Isi destinasi, budget, durasi, dan gaya perjalanan yang kamu suka.",
  },
  {
    title: "3. Dapatkan itinerary AI",
    description: "KelanaAI menyusun rencana perjalanan lengkap, siap kamu sesuaikan.",
  },
];

const FEATURES = [
  {
    title: "AI Trip Generator",
    description:
      "Cukup masukkan destinasi dan budget, KelanaAI menyusun itinerary hari-per-hari secara otomatis.",
  },
  {
    title: "Chat Travel Assistant",
    description:
      "Diskusikan dan sesuaikan rencana perjalananmu lewat percakapan, lengkap dengan riwayat conversation.",
  },
  {
    title: "Ask AI",
    description:
      "Tanya apa saja soal destinasi, visa, atau tips perjalanan, dan dapatkan jawaban singkat kapan saja.",
  },
];

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-800 to-teal-600">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">KelanaAI</h1>
          <p className="max-w-xl text-base text-slate-100/90 sm:text-lg">
            Plan your next adventure — biarkan AI menyusun itinerary perjalananmu
            dalam hitungan detik.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            {!loading && isAuthenticated ? (
              <Link
                href="/trips/new"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-slate-100 transition-colors"
              >
                Create a Trip
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-slate-100 transition-colors"
                >
                  Get Started — It&apos;s Free
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
        <h2 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
            >
              <h3 className="font-semibold text-blue-700">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">
            Everything you need to plan smarter
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-slate-50 p-6 text-center"
              >
                <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      {!loading && !isAuthenticated && (
        <section className="mx-auto max-w-3xl px-4 pb-16 text-center sm:pb-24">
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Siap merencanakan perjalanan berikutnya?
          </h2>
          <Link
            href="/register"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Get Started — It&apos;s Free
          </Link>
        </section>
      )}

      <Footer />
    </main>
  );
}
