// HOMEWORK (Session 11, #4) — About page.
// Halaman statis: cerita singkat KelanaAI + stack teknis, sesuai tone
// "presentasi profesional" yang diminta jelang Demo Day (Session 12).
import Footer from "../components/Footer";

const STACK = [
  { name: "Next.js", role: "Frontend — App Router, TypeScript, Tailwind CSS" },
  { name: "FastAPI", role: "Backend REST API — Python" },
  { name: "PostgreSQL (Neon)", role: "Managed database — serverless Postgres" },
  { name: "Amazon Bedrock", role: "LLM inference untuk rekomendasi & chat AI" },
  { name: "RAG Knowledge Base", role: "Jawaban berbasis dokumen terpercaya" },
  { name: "JWT Auth", role: "Autentikasi & proteksi endpoint" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-semibold tracking-wide text-blue-600">TENTANG</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-800 sm:text-4xl">
          KelanaAI
        </h1>
        <p className="mt-4 leading-relaxed text-slate-600">
          KelanaAI adalah asisten perencana perjalanan berbasis AI. Cukup ceritakan
          destinasi, durasi, dan budget-mu — KelanaAI menyusun itinerary harian,
          tips perjalanan, rekomendasi kuliner, hingga estimasi anggaran, lalu bisa
          diajak diskusi lanjutan lewat percakapan AI dengan memori konteks.
        </p>
        <p className="mt-3 leading-relaxed text-slate-600">
          Proyek ini dibangun bertahap selama 12 sesi sebagai bagian dari{" "}
          <span className="font-medium text-slate-800">
            AI Native Software Engineer Bootcamp (Alkademi)
          </span>
          , mulai dari aplikasi konsol sederhana hingga aplikasi cloud production
          dengan autentikasi, database terkelola, dan RAG.
        </p>

        <h2 className="mt-10 text-lg font-semibold text-slate-800">Dibangun dengan</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {STACK.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="font-semibold text-slate-800">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500">{item.role}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-blue-50 p-5 text-sm text-blue-900">
          Kode sumber terbuka di{" "}
          <a
            href="https://github.com/rahadianivan09/kelana-ai"
            className="font-medium underline hover:text-blue-700"
          >
            github.com/rahadianivan09/kelana-ai
          </a>
          .
        </div>
      </div>
      <Footer />
    </main>
  );
}
