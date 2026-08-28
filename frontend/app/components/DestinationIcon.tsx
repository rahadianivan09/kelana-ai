// #HOMEWORK (Session 7) — Destination Icon/Flag per destinasi
//
// Kenapa SVG, bukan emoji (🇯🇵 🇸🇬 🇲🇾)?
// Emoji flag adalah 2 karakter "regional indicator" yang di-render jadi
// gambar bendera oleh FONT emoji sistem operasi. macOS/Android render
// dengan benar, tapi Windows tidak punya flag glyph — yang muncul cuma
// teks kode negara mentah ("MY", "ID", "SG"). SVG inline di bawah ini
// tidak bergantung pada font sistem, jadi tampilannya konsisten di semua
// OS (Windows/Mac/Linux) tanpa perlu tambah dependency baru.

type FlagProps = { className?: string };

function FlagJapan({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="6" fill="#bc002d" />
    </svg>
  );
}

function FlagIndonesia({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="10" fill="#e70011" />
      <rect y="10" width="30" height="10" fill="#fff" />
    </svg>
  );
}

function FlagSingapore({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="10" fill="#ed2939" />
      <rect y="10" width="30" height="10" fill="#fff" />
      <circle cx="7" cy="6" r="3.2" fill="#fff" />
      <circle cx="8.3" cy="6" r="2.6" fill="#ed2939" />
    </svg>
  );
}

function FlagMalaysia({ className }: FlagProps) {
  const stripeH = 20 / 14;
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * stripeH} width="30" height={stripeH} fill="#cc0001" />
      ))}
      <rect width="14" height="11" fill="#010066" />
      <circle cx="5.5" cy="5.5" r="3.2" fill="#ffcc00" />
      <circle cx="6.6" cy="5.5" r="2.6" fill="#010066" />
    </svg>
  );
}

function FlagThailand({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#fff" />
      <rect y="3.3" width="30" height="13.4" fill="#a51931" />
      <rect y="6.6" width="30" height="6.7" fill="#f4f5f8" />
      <rect y="8.3" width="30" height="3.3" fill="#2d2a4a" />
    </svg>
  );
}

function FlagVietnam({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#da251d" />
      <polygon
        points="15,5 16.8,9.5 21.5,9.5 17.7,12.2 19.1,16.7 15,14 10.9,16.7 12.3,12.2 8.5,9.5 13.2,9.5"
        fill="#ffde00"
      />
    </svg>
  );
}

function FlagKorea({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="4.2" fill="#cd2e3a" />
      <path
        d="M15 5.8a4.2 4.2 0 0 0 0 8.4 2.1 2.1 0 0 1 0-4.2 2.1 2.1 0 0 0 0-4.2z"
        fill="#0047a0"
      />
    </svg>
  );
}

// Generic pin — fallback untuk destinasi yang belum ada di daftar bendera,
// menggantikan fallback lama "✈️" biar tetap gambar (bukan teks/emoji).
function GenericPin({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 2C7.6 2 4 5.6 4 10c0 5.4 6.9 11.3 7.2 11.5a1.2 1.2 0 0 0 1.6 0C13.1 21.3 20 15.4 20 10c0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

// destinasi (sudah lowercase) -> komponen bendera
const FLAG_MAP: Record<string, (props: FlagProps) => JSX.Element> = {
  japan: FlagJapan,
  indonesia: FlagIndonesia,
  bali: FlagIndonesia,
  jakarta: FlagIndonesia,
  singapore: FlagSingapore,
  malaysia: FlagMalaysia,
  thailand: FlagThailand,
  vietnam: FlagVietnam,
  korea: FlagKorea,
  "south korea": FlagKorea,
};

// Alias untuk input pendek/typo umum — contoh kasus di dashboard kamu:
// destination tersimpan "sing" bukan "singapore", jadi tanpa alias ini
// dia fallback ke ikon generik.
const ALIASES: Record<string, string> = {
  sg: "singapore",
  sing: "singapore",
  id: "indonesia",
  indo: "indonesia",
  my: "malaysia",
  malay: "malaysia",
  th: "thailand",
  vn: "vietnam",
  jp: "japan",
  kr: "korea",
};

function resolveFlagKey(destination: string): string | null {
  const normalized = destination.trim().toLowerCase();
  if (FLAG_MAP[normalized]) return normalized;
  if (ALIASES[normalized]) return ALIASES[normalized];

  // Fuzzy match dua arah: "sing" ada di dalam "singapore", atau
  // sebaliknya destination panjang yang memuat salah satu key.
  const fuzzyKey = Object.keys(FLAG_MAP).find(
    (key) => key.includes(normalized) || normalized.includes(key)
  );
  return fuzzyKey ?? null;
}

export function DestinationIcon({
  destination,
  className = "h-5 w-7 rounded-sm object-cover ring-1 ring-black/10 shrink-0",
}: {
  destination: string;
  className?: string;
}) {
  const key = resolveFlagKey(destination);
  const Flag = key ? FLAG_MAP[key] : null;

  if (Flag) return <Flag className={className} />;
  return <GenericPin className="h-5 w-5 text-slate-400 shrink-0" />;
}
