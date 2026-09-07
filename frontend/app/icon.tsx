// HOMEWORK (Session 11, #1) — Custom application icon.
// Next.js App Router: file `icon.tsx` di-generate otomatis jadi favicon,
// jadi KelanaAI tidak lagi pakai favicon default Next.js starter.
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          background: "linear-gradient(135deg, #1d4ed8 0%, #0d9488 100%)",
          color: "white",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        K
      </div>
    ),
    size
  );
}
