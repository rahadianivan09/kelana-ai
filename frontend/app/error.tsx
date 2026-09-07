"use client";
// HOMEWORK (Session 11, #2) — Better error page (500 / runtime error).
// Next.js App Router: file `error.tsx` otomatis membungkus route di bawahnya
// sebagai error boundary. Wajib Client Component.
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log ke console (di production bisa disambungkan ke error-tracking service)
    console.error("KelanaAI runtime error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold tracking-wide text-red-600">ERROR 500</p>
      <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
        Ada yang tidak beres di sisi kami.
      </h1>
      <p className="max-w-md text-slate-500">
        Tim kami sedang membenahi rute ini. Coba lagi sebentar lagi, atau kembali
        ke beranda dan lanjutkan rencana perjalananmu.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Coba Lagi
        </button>
        <a
          href="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Ke Beranda
        </a>
      </div>
    </main>
  );
}
