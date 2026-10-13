import React, { useId } from "react";

/**
 * Tanda Jobly: huruf "j" yang nyeleneh, dari satu pita biru tebal tanpa latar.
 * Titiknya berdiri sendiri di kanan atas. Batangnya turun, menyelinap ke
 * bawah pita (gradasi memudar menandai bagian yang "di belakang"),
 * berputar jadi simpul, lalu berakhir dengan ujung bulat.
 *
 * Disusun berlapis supaya tidak ada sambungan yang terlihat:
 *   1. seluruh pita sebagai satu garis utuh (ujung bulat)
 *   2. gradasi di bagian batang yang lewat di bawah simpul
 *   3. lengkung atas simpul digambar ulang di paling atas
 *
 * Animasi (src/styles/merek.css): pita "ditulis" seperti goresan pena,
 * mengikuti urutan menulis huruf j (batang turun, lalu memutar jadi simpul),
 * lewat mask yang garisnya memanjang. Setelah itu titiknya jatuh.
 * Prop `diam` mematikan animasi.
 */
const BIRU = "#1660F5";
const PUDAR = "#B7CDFC";
export const PITA_UTUH =
  "M44 19C43 26 41.5 33 38.5 38.5C33.5 45 26 48 19 46.5C9 44 7 34 16 30.5C24 27.5 38 28.5 45 36C50 42 50.5 50 46 56";
export const PITA_BAWAH = "M43.6 22C43 26 41.5 33 38.5 38.5C33.5 45 26 48 19 46.5";
export const PITA_ATAS = "M16 30.5C24 27.5 38 28.5 45 36C50 42 50.5 50 46 56";
export const KOTAK_PANDANG = "-1 1.5 60 60";

export function TandaJobly({ ukuran = 32, diam = false }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className={`tj ${diam ? "tj-diam" : ""}`} style={{ width: ukuran, height: ukuran }} aria-hidden="true">
      <svg width={ukuran} height={ukuran} viewBox={KOTAK_PANDANG}>
        <defs>
          <linearGradient id={`tjg${id}`} gradientUnits="userSpaceOnUse" x1="44" y1="22" x2="22" y2="47">
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
          <path d={PITA_BAWAH} stroke={`url(#tjg${id})`} />
          <path className="tj-atas" d={PITA_ATAS} stroke={BIRU} strokeLinecap="round" />
        </g>
        <circle className="tj-titik" cx="45.5" cy="8.5" r="5.6" fill={BIRU} />
      </svg>
    </span>
  );
}
