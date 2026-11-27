import React, { useId } from "react";

/**
 * Tanda Workly: huruf "w" dari satu pita biru tebal tanpa latar.
 * Kaki kiri turun lurus, lalu di tengah pita memelintir (gradasi memudar
 * menandai sisi belakang pita) sebelum naik dan turun lagi ke kaki kanan.
 *
 * Disusun berlapis:
 *   1. seluruh pita sebagai satu garis utuh (ujung bulat)
 *   2. gradasi di bagian tengah yang memelintir
 *
 * Animasi (src/styles/merek.css): pita ditulis seperti goresan pena,
 * kilau menyapu pita, lalu pita ditarik kembali. Prop `diam` mematikan animasi.
 */
const BIRU = "#1660F5";
const PUDAR = "#B7CDFC";
export const PITA_UTUH =
  "M7 16C9 30 12 40 16 46C19 50.5 24 49 26 44C29 36 31.5 27 35 27C38.5 27 39 36 41 44C42.5 50 47.5 50.5 50 45C53 38 54 28 53 20";
export const PITA_PELINTIR = "M26 44C29 36 31.5 27 35 27";
export const KOTAK_PANDANG = "-1 1.5 60 60";

export function TandaJobly({ ukuran = 32, diam = false }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className={`tj ${diam ? "tj-diam" : ""}`} style={{ width: ukuran, height: ukuran }} aria-hidden="true">
      <svg width={ukuran} height={ukuran} viewBox={KOTAK_PANDANG}>
        <defs>
          <linearGradient id={`tjg${id}`} gradientUnits="userSpaceOnUse" x1="22" y1="46" x2="36" y2="20">
            <stop offset="0" stopColor={BIRU} />
            <stop offset=".45" stopColor={PUDAR} />
            <stop offset="1" stopColor={BIRU} />
          </linearGradient>
          <mask id={`tjm${id}`} maskUnits="userSpaceOnUse" x="-10" y="-10" width="84" height="84">
            <path
              className="tj-pena"
              d={PITA_UTUH}
              pathLength="100"
              fill="none"
              stroke="#fff"
              strokeWidth="8.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>
        <g className="tj-pita" fill="none" strokeWidth="8.4" mask={`url(#tjm${id})`}>
          <path d={PITA_UTUH} stroke={BIRU} strokeLinecap="round" strokeLinejoin="round" />
          <path d={PITA_PELINTIR} stroke={`url(#tjg${id})`} />
          {/* kilau: garis tipis terang yang menyapu sepanjang pita */}
          <path className="tj-kilau" d={PITA_UTUH} pathLength="100" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    </span>
  );
}
