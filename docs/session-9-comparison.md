# Session 9 — RAG vs Base-Model Comparison

Perbandingan jawaban antara sistem RAG (menggunakan Knowledge Base) dengan
jawaban murni base-model (tanpa akses ke dokumen), untuk 5 pertanyaan yang
membutuhkan informasi spesifik dari dokumen travel knowledge yang di-upload.

Jawaban di bawah ini adalah hasil asli (verbatim) dari endpoint
`POST /api/v1/assistant/compare`, tanpa diringkas atau diedit.

---

## Q1: Apa itu IMEI dan kenapa perlu didaftarkan saat membawa HP dari luar negeri ke Indonesia?

### Base-model (tanpa KB)

IMEI (International Mobile Equipment Identity) adalah nomor unik 15 digit yang digunakan untuk mengidentifikasi perangkat seluler seperti smartphone dan tablet. Setiap perangkat seluler memiliki IMEI yang unik, sehingga IMEI dapat digunakan untuk melacak perangkat tersebut jika hilang atau dicuri.

Daftar IMEI sangat penting ketika membawa perangkat seluler dari luar negeri ke Indonesia karena alasan-alasan berikut:

1. **Pencegahan Perangkat Terlacak**: Jika perangkat Anda dicuri atau dihilangkan, polisi dapat menggunakan nomor IMEI untuk melacak lokasi perangkat tersebut.
2. **Mencegah Penggunaan Perangkat yang Dilarang**: Nomor IMEI yang terdaftar dapat membantu operator telekomunikasi mendeteksi perangkat yang diblokir atau yang tidak diizinkan untuk digunakan di jaringan mereka.
3. **Memfasilitasi Pengembalian Perangkat**: Jika perangkat Anda hilang atau dicuri di Indonesia, mendaftarkan IMEI dapat membantu pihak berwenang lokal mengidentifikasi perangkat tersebut.
4. **Kepatuhan Hukum**: Di beberapa negara, termasuk Indonesia, ada persyaratan hukum untuk mendaftarkan IMEI perangkat seluler yang diimpor.

Cara mendaftarkan IMEI dapat bervariasi tergantung pada negara dan operator telekomunikasi. Umumnya, Anda dapat mendaftarkan IMEI melalui situs web operator telekomunikasi atau melalui layanan pelanggan mereka. Untuk memastikan proses pendaftaran IMEI di Indonesia, Anda dapat mengunjungi situs web Badan Komunikasi dan Informatika (Kominfo) atau operator telekomunikasi lokal.

### RAG (dengan KB)

IMEI (International Mobile Equipment Identity) adalah nomor unik yang diberikan kepada perangkat seluler seperti smartphone, tablet, dan komputer genggam untuk identifikasi dan pelacakan. IMEI didaftarkan saat membawa HP dari luar negeri ke Indonesia karena internasional travelers yang membawa perangkat seluler baru yang dibeli di luar negeri harus mendaftarkan nomor IMEI perangkat tersebut untuk mengakses jaringan seluler domestik Indonesia (seperti Telkomsel, Indosat, XL, Smartfren). Setiap penumpang diperbolehkan mendaftarkan maksimal dua (2) perangkat per kedatangan. Pendaftaran dilakukan dengan mengisi Electronic Customs Declaration (e-CD) atau formulir pendaftaran IMEI khusus di portal resmi (beacukai.go.id/register-imei.html) atau melalui aplikasi Mobile Bea Cukai sebelum kedatangan, yang menghasilkan QR Code dan ID Pendaftaran.

**Source:** `indonesia-customs-and-imei-guide.md`, `indonesian-traveler-payment-guide.md`

**Observasi:** RAG menyebut prosedur konkret (portal `beacukai.go.id`, aplikasi Mobile Bea Cukai, batas 2 perangkat, output QR Code) yang tidak muncul sama sekali di jawaban base-model. Base-model hanya memberi pengetahuan umum yang tidak spesifik ke regulasi Indonesia terkini.

---

## Q2: Metode pembayaran apa yang direkomendasikan untuk traveler Indonesia saat berada di luar negeri?

### Base-model (tanpa KB)

Untuk traveler dari Indonesia yang berada di luar negeri, ada beberapa metode pembayaran yang direkomendasikan:

1. **Kartu Kredit/Debit Internasional** — Visa, Mastercard, American Express, atau UnionPay yang sudah diaktifkan untuk pembayaran internasional.
2. **E-Wallet/Digital Wallet** — GoPay, OVO, LinkAja disebut menyediakan fitur pembayaran internasional melalui kartu virtual.
3. **Transfer Bank Internasional** — layanan SWIFT/BIC untuk jumlah besar.
4. **Prepaid Travel Card** — bisa diisi sebelum berangkat.
5. **Cash (Mata Uang Lokal)** — untuk situasi darurat.

Tips tambahan: cek biaya transaksi internasional, gunakan layanan seperti Wise untuk kurs lebih rendah, dan jaga keamanan kartu.

### RAG (dengan KB)

Metode pembayaran yang direkomendasikan untuk traveler Indonesia saat berada di luar negeri adalah:

1. **Cross-Border QRIS**: Indonesian travelers can make direct cashless payments in retail shops, restaurants, and convenience stores abroad using their domestic Indonesian mobile banking or e-wallet applications without exchanging cash at physical money changers.
2. **International Debit and Multi-Currency Cards**: For destinations where QRIS is not yet active (or for ATM cash withdrawals), Indonesian travelers are advised to utilize multi-currency digital debit cards or international cards. Debit cards with Visa/Mastercard logo should have international transactions activated in the mobile banking app before departing Indonesia. Multi-currency accounts like Jenius (BTPN), Bank Jago, and Wise also allow travelers to exchange IDR into various foreign currencies at market rates in advance, enabling direct debits in local currency with zero foreign exchange fees.

**Source:** `indonesian-traveler-payment-guide.md`, `indonesia-customs-and-imei-guide.md`

**Observasi:** RAG menyebut nama produk nyata dan relevan secara lokal (Cross-Border QRIS, Jenius, Bank Jago) yang tidak disebutkan base-model sama sekali. Base-model justru menyebut GoPay/OVO dengan klaim fitur internasional yang tidak terverifikasi.

---

## Q3: Di mana bisa menemukan makanan halal di Jepang?

### Base-model (tanpa KB)

Di Jepang, makanan halal dapat ditemukan di beberapa tempat:

1. **Restoran Muslim** — di kota besar seperti Tokyo, Osaka, Kyoto. Contoh: "Halal Tokyo".
2. **Supermarket Internasional** — seperti "Isetan" dan "Lotte Mart".
3. **Toko Makanan Halal** — contoh "Halal Mart" di Tokyo.
4. **Hotel Internasional** — hotel bintang tinggi sering sediakan makanan halal.
5. **Aplikasi Halal** — seperti "Halal Trip" atau "Halal Trip Japan".
6. **Komunitas Muslim Lokal**.

### RAG (dengan KB)

Di Jepang, makanan halal bisa ditemukan di restoran yang memiliki sertifikasi halal dari badan-badan resmi seperti Japan Halal Association (JHA), Nippon Asia Halal Association (NAHA), Japan Islamic Trust (JIT) / Otsuka Mosque Halal Certification, dan Kyoto Council for Sharia and Halal Affairs. Selain itu, makanan halal juga tersedia di konvenyens store (konbini) dengan memilih produk yang menghindari bahan-bahan terlarang seperti daging babi, minuman beralkohol, dan gelatin yang tidak disertifikasi.

**Source:** `japan-halal-dining-guide.md`

**Observasi:** RAG menyebut nama badan sertifikasi resmi yang bisa diverifikasi. Base-model menyebut nama tempat spesifik ("Halal Tokyo", "Halal Mart") yang berpotensi tidak akurat/halusinasi karena tidak berasal dari sumber terverifikasi — ini contoh paling jelas risiko jawaban tanpa RAG.

---

## Q4: Dokumen apa saja yang dibutuhkan untuk mengajukan visa kunjungan singkat (single-entry) ke Jepang?

### Base-model (tanpa KB)

Untuk mengajukan visa kunjungan singkat (single-entry) ke Jepang, dokumen yang biasanya dibutuhkan:

1. Formulir Permohonan Visa
2. Paspor (berlaku minimal 6 bulan, 2 halaman kosong)
3. Foto Paspor (35mm x 45mm)
4. Surat Pernyataan (Statement of Purpose)
5. Jadwal Perjalanan (tiket, reservasi hotel)
6. Bukti Keuangan (rekening koran 3 bulan terakhir)
7. Surat Pendukung (dari majikan/institusi, jika diperlukan)
8. Bukti Hubungan (opsional, untuk kunjungan keluarga/teman)

### RAG (dengan KB)

Dokumen yang dibutuhkan untuk mengajukan visa kunjungan singkat (single-entry) ke Jepang tergantung pada tujuan kunjungan. Berikut adalah daftar dokumen yang diperlukan untuk setiap tujuan kunjungan:

**Untuk Kunjungan Bisnis**
1. Valid Passport
2. Visa application form
3. Photo
4. Itinerary with the flight/ship number and date of arrival and departure to and from Japan
5. Document to prove that you are traveling to Japan for business purposes (misalnya, Travel order issued by your employer, Letter from employer, Certificate of employment)
6. One of the following documents to prove ability to pay travel expenses during your stay in Japan (misalnya, Income certificate or tax return issued by a public agency, Bank statement, balance certificate, etc.)

**Untuk Kunjungan Keluarga/Teman**
1. Valid Passport
2. Visa application form
3. Photo
4. Itinerary with the flight/ship number and date of arrival and departure to and from Japan
5. One of the following documents to prove ability to pay travel expenses during your stay in Japan
6. Document to prove kinship, friendship, or acquaintance relationship (misalnya, Birth certificate, Marriage certificate, Family register certificate (Kosekitohon) untuk kunjungan keluarga; Photos, E-mails, Call history, Letters, etc. untuk kunjungan teman)

**Untuk Wisata**
1. Valid Passport
2. Visa application form
3. Photo
4. Itinerary with the flight/ship number and date of arrival and departure to and from Japan
5. One of the following documents to prove ability to pay travel expenses during your stay in Japan
6. Itinerary in Japan (p.6)

**Untuk Kunjungan yang Ditawar oleh Organisasi/Garansi di Jepang**
1. Valid Passport
2. Visa application form
3. Photo
4. Itinerary with the flight/ship number and date of arrival and departure to and from Japan
5. One of the following documents to prove ability to pay travel expenses during your stay in Japan
6. Invitation letter (p.4) atau salah satu dokumen berikut yang menjelaskan kegiatan di Jepang (misalnya, A transaction agreement between companies, Conference materials)
7. List of visa applicants (p.5) (Jika ada lebih dari satu pelamar)
8. Itinerary in Japan (p.6)

**Untuk Kunjungan yang Dijamin oleh Garansi di Jepang**
1. Valid Passport
2. Visa application form
3. Photo
4. Itinerary with the flight/ship number and date of arrival and departure to and from Japan
5. One of the following documents to prove ability to pay travel expenses during your stay in Japan
6. Letter of guarantee (p.8)
7. A certified copy of the corporation register or Overview of company/organization (p.9) (tidak diperlukan jika perusahaan terdaftar di bursa efek dan menyediakan laporan kuartalan perusahaan)
8. Proof of funds of the guarantor (misalnya, The latest Certificate of income/taxation issued by the head of administration of the place of residence, Balance certificate, Certificate of residence (Juminhyo))

**Source:** `single-entry-short-term-visa-japan.pdf`

**Observasi:** RAG memecah requirement dokumen ke dalam 5 kategori tujuan kunjungan berbeda dengan detail spesifik per kategori (termasuk nomor halaman dokumen asli). Base-model menyamaratakan semua jenis kunjungan menjadi satu daftar generik.

---

## Q5: Apa saja hal yang perlu diperhatikan wisatawan yang ikut tur ke Korea Utara menurut panduan Koryo Tours?

### Base-model (tanpa KB)

Untuk wisatawan yang memilih tur yang dikelola oleh perusahaan seperti Koryo Tours, ada beberapa hal penting:

1. **Dokumentasi dan Visa** — proses aplikasi visa dilakukan melalui perusahaan tour.
2. **Aturan Berpakaian** — aturan ketat, hindari pakaian mencolok.
3. **Perilaku dan Sikap** — sopan dan hormat terhadap petugas dan pemandu.
4. **Peraturan Fotografi dan Videografi** — sangat dibatasi, hanya di tempat tertentu.
5. **Bahasa dan Komunikasi** — hindari topik sensitif seperti politik.
6. **Peraturan Keamanan** — selalu ikuti instruksi pemandu, jangan berkelana sendiri.
7. **Keamanan Pribadi** — jaga barang pribadi, hindari makanan/minuman dari orang tak dikenal.
8. **Kebiasaan dan Tradisi Lokal**.
9. **Mata Uang** — KPW, USD, dan Euro.
10. **Teknologi dan Telekomunikasi** — akses internet sangat terbatas.

### RAG (dengan KB)

Menurut panduan Koryo Tours, hal-hal yang perlu diperhatikan wisatawan yang ikut tur ke Korea Utara meliputi:

1. **Pre-Trip Briefing**: Wisatawan harus mengikuti pre-tour briefing yang diadakan oleh staf Koryo Tours. Briefing ini berlangsung sekitar 1 jam dan mencakup panduan, etika, dan keamanan untuk bepergian di Korea Utara. Biasanya briefing ini diadakan sore hari sebelum tanggal keberangkatan.
2. **Pemandu Tur**: Selama di dalam negeri, wisatawan akan diawasi oleh dua pemandu tur profesional dari Korean International Travel Company (KITC). Pemandu ini terlatih, ramah, berpengalaman, dan berpengetahuan luas.
3. **Persiapan Penuh**: Perjalanan ke Korea Utara harus dilakukan dengan penelitian, pengenalan, dan konsultasi dengan mereka yang tahu cara melakukannya dengan aman.
4. **Panduan Ini Bukan Untuk Digunakan Selama Perjalanan di DPRK**: DPRK melarang materi tertulis, tercetak, dan elektronik tentang DPRK masuk ke negara tersebut. Oleh karena itu, panduan ini hanya digunakan untuk persiapan sebelum perjalanan.
5. **Konsultasikan dengan Koryo Tours**: Setiap pertanyaan atau kebutuhan khusus selama perjalanan harus dikonsultasikan dengan manajer tur Koryo Tours.

**Source:** `original-Koryo_Tours_North_Korea_Guide_2019.pdf`

**Observasi:** Base-model menjawab dari pengetahuan umum soal Korea Utara sebagai negara (dress code, fotografi, mata uang) — bukan soal prosedur Koryo Tours sebagai operator tur. RAG menjawab persis sesuai isi panduan operasional Koryo Tours (durasi briefing, nama perusahaan pemandu KITC, larangan bawa dokumen ke DPRK) yang tidak mungkin diketahui base-model tanpa akses ke dokumen aslinya.

---

## Kesimpulan Umum

| Aspek | Base-model | RAG |
|---|---|---|
| Sumber jawaban | Pengetahuan umum / general training data | Dokumen spesifik yang di-upload ke Knowledge Base |
| Verifikasi | Tidak bisa diverifikasi, berpotensi halusinasi (lihat Q3) | Bisa diverifikasi lewat field `sources` |
| Relevansi lokal | Cenderung generik, kurang sesuai konteks Indonesia (Q1, Q2) | Sangat kontekstual dan spesifik |
| Presisi struktur | Menyamaratakan kategori (Q4) | Membedakan sesuai kategori resmi dokumen |
| Kekhususan sumber | Menjawab dari topik umum, bukan sumber yang ditanya (Q5) | Menjawab persis sesuai dokumen/operator yang ditanya |

Secara konsisten di 5 pertanyaan, RAG menghasilkan jawaban yang lebih **spesifik, presisi, dan dapat diverifikasi sumbernya**, dibanding base-model yang cenderung memberi jawaban umum dan pada kasus tertentu berpotensi memberi informasi yang tidak akurat (halusinasi).
