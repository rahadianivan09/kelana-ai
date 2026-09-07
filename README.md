# KelanaAI

KelanaAI adalah asisten perencana perjalanan berbasis AI — dibangun bertahap
selama 12 sesi sebagai bagian dari **AI Native Software Engineer Bootcamp
(Alkademi)**. Dari itinerary generator sederhana, dilengkapi autentikasi,
database, RAG, hingga percakapan AI dengan memori konteks, dan sekarang
di-deploy sebagai aplikasi cloud publik.

## Arsitektur Production

```
User (browser)
   |
   v
Vercel  (Next.js frontend)  -- https://<project>.vercel.app
   |
   v
FastApiCloud  (FastAPI backend)  -- https://<project>.fastapicloud.com
   |
   +--> Neon (PostgreSQL, managed)
   +--> Amazon Bedrock (LLM inference + Knowledge Base / RAG)
```

## Struktur Proyek

```
kelana-ai/
|-- README.md
|-- backend/
|   |-- main.py              # FastAPI app + semua route
|   |-- database.py          # SQLAlchemy engine/session + init_db()
|   |-- dependencies.py      # get_current_user (JWT)
|   |-- migrations.py        # migrasi ringan (kolom baru, seed admin)
|   |-- requirements.txt
|   |-- models/               # User, Trip, Conversation, Message
|   `-- services/             # auth, bedrock (rekomendasi), kb (RAG), chat, trip
`-- frontend/
    |-- app/                   # Next.js App Router (pages, layout, error/loading)
    |-- components/            # Navbar, TripForm, ChatWindow, dll
    |-- contexts/AuthContext.tsx
    |-- services/              # authService, tripService, assistantService, conversationService
    `-- types/
```

## Menjalankan Secara Lokal

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# isi backend/.env dengan semua variable di tabel di bawah
uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
# isi frontend/.env: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
npm run dev
```

## Environment Variables

### Backend (`backend/.env`, dan di dashboard FastApiCloud untuk production)

| Variable | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string Postgres. Lokal: Postgres lokal. Production: Neon. |
| `FRONTEND_URL` | Origin frontend yang diizinkan CORS. Production: URL Vercel (contoh `https://kelana-ai.vercel.app`), boleh multi-value dipisah koma. |
| `AWS_BEARER_TOKEN_BEDROCK` | Bearer token Bedrock API key, dipakai untuk chat & rekomendasi trip. |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Kredensial IAM, dipakai khusus untuk Bedrock Knowledge Base (RAG retrieve). |
| `AWS_REGION` | Region AWS Bedrock, contoh `us-east-1`. |
| `MODEL_ID` | Model ID Bedrock untuk chat/rekomendasi, contoh `amazon.nova-lite-v1:0`. |
| `KNOWLEDGE_BASE_ID` | ID Knowledge Base Bedrock untuk fitur RAG. |
| `JWT_SECRET_KEY` / `JWT_EXPIRE_MINUTES` | Konfigurasi token JWT. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed akun admin pertama (dipakai `migrations.py`). |

### Frontend (`frontend/.env`, dan di dashboard Vercel untuk production)

| Variable | Keterangan |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL backend + `/api/v1`. Production: URL FastApiCloud (contoh `https://kelana-ai-api.fastapicloud.com/api/v1`). |

> **Jangan pernah commit file `.env` berisi kredensial asli ke Git.** Semua
> secrets production di-set langsung di dashboard hosting (FastApiCloud /
> Vercel), bukan lewat file.

## Deployment ke Production

### 1. Database -- Neon (PostgreSQL)
1. Daftar di neon.tech, buat project baru, pilih region terdekat.
2. Salin **connection string** (`DATABASE_URL`) dari dashboard.
3. Simpan nilainya -- akan dipakai di langkah 2.

### 2. Backend -- FastApiCloud
1. Push kode terbaru ke GitHub (`git push origin main`).
2. Buat service baru di FastApiCloud, hubungkan ke repo `rahadianivan09/kelana-ai`, set **root directory** ke `backend`.
3. Build command: `pip install -r requirements.txt`
   Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Tambahkan seluruh environment variable di atas (bagian *Backend*) -- untuk `FRONTEND_URL`, isi sementara dengan placeholder, akan diupdate lagi di langkah 3.
5. Deploy, tunggu build (~2-3 menit), lalu verifikasi:
   - `GET /` -> `{"message": "Welcome to KelanaAI"}`
   - `GET /health` -> `{"status": "OK", "database": "connected"}`
   - `GET /docs` -> Swagger UI terbuka

### 3. Frontend -- Vercel
1. Import repo yang sama di vercel.com, Vercel otomatis mendeteksi Next.js (root directory: `frontend`).
2. Set env var `NEXT_PUBLIC_API_URL` ke URL backend FastApiCloud + `/api/v1`.
3. Deploy. Setelah URL Vercel didapat (misal `https://kelana-ai.vercel.app`), **update `FRONTEND_URL` di FastApiCloud** ke URL ini, lalu redeploy backend supaya CORS mengizinkan origin ini.
4. Aktifkan auto-deploy on push (biasanya default aktif).

### 4. End-to-End Testing
Buka URL Vercel dari device apa pun, lalu uji: Register -> Login -> Generate itinerary -> Chat dengan AI -> Buka kembali riwayat percakapan. Cek console browser: tidak boleh ada error CORS atau 404.

### Deployment Checklist
- [ ] Backend live, `/health` return `database: connected`
- [ ] Frontend live di Vercel, tanpa error console
- [ ] `FRONTEND_URL` di backend sudah cocok dengan domain Vercel (bukan localhost)
- [ ] Semua secrets di-set lewat dashboard, tidak ada yang ke-commit ke Git
- [ ] HTTPS aktif di kedua layanan (default Vercel & FastApiCloud)
- [ ] Login + JWT round-trip berhasil dari domain production
