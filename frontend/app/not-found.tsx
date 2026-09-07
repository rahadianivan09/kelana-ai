// HOMEWORK (Session 11, #2) — Better error page (404).
// Ganti halaman 404 default Next.js dengan halaman bermerek KelanaAI,
// supaya pengalaman "nyasar" tetap terasa profesional, bukan halaman kosong bawaan.
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold tracking-wide text-teal-600">ERROR 404</p>
      <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
        Halaman ini sepertinya tersesat.
      </h1>
      <p className="max-w-md text-slate-500">
        Mungkin salah alamat, atau destinasi yang kamu cari belum ada di peta kami.
        Yuk balik dan rencanakan perjalanan baru.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
