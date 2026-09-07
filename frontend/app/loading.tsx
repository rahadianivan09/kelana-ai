// HOMEWORK (Session 11, #3) — Loading screen.
// Root-level loading.tsx: skeleton generik yang muncul saat navigasi antar
// route belum selesai fetch data (di luar /trips yang sudah punya skeleton sendiri).
export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-3 px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      <p className="text-sm text-slate-400">Menyiapkan KelanaAI…</p>
    </main>
  );
}
