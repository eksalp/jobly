import React, { useId } from "react";

/**
 * Tanda Jobly: huruf "j" dari pita putih tebal di atas kotak biru.
 * Titiknya berdiri sendiri, batangnya turun lalu ekornya melengkung
 * seperti pita yang dilipat. Gradasi tipis di ekor memberi kesan lipatan.
 *
 * Animasi (src/styles/merek.css): pita "tergambar" sekali saat halaman
 * dibuka, lalu titiknya jatuh. Prop `diam` mematikan animasi.
 */
export function TandaJobly({ ukuran = 32, diam = false }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className={`tj ${diam ? "tj-diam" : ""}`} style={{ width: ukuran, height: ukuran }} aria-hidden="true">
      <svg width={ukuran} height={ukuran} viewBox="0 0 64 64">
        <defs>
          <linearGradient id={`tjl${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2E6FFF" />
            <stop offset="1" stopColor="#1248DC" />
          </linearGradient>
          <linearGradient id={`tjp${id}`} x1="38" y1="46" x2="12" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".5" stopColor="#dbe5ff" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="15" fill={`url(#tjl${id})`} />
        <path
          className="tj-ekor"
          d="M38.5 40C38.5 51.5 23.5 55.5 16.5 47.5C12 42 16 34.5 23 35.5"
          fill="none"
          stroke={`url(#tjp${id})`}
          strokeWidth="10.5"
          strokeLinecap="round"
          pathLength="100"
        />
        <path className="tj-batang" d="M38.5 27.5V40" fill="none" stroke="#fff" strokeWidth="10.5" strokeLinecap="round" />
        <circle className="tj-titik" cx="38.5" cy="14.5" r="6.6" fill="#fff" />
      </svg>
    </span>
  );
}
