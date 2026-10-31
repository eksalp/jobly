import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { inisial } from "../../utils/sumberLoker";

// Warna monogram: dipilih tetap dari nama perusahaan, jadi perusahaan yang
// sama selalu berwarna sama dan kartu yang berdampingan tidak seragam.
const WARNA = [
  ["#E8F0FE", "#1A4FA0"],
  ["#E6F4EA", "#1E6B3A"],
  ["#FDF0E1", "#9A5A0B"],
  ["#F3E8FD", "#6B2FA6"],
  ["#FCE8EC", "#A3263F"],
  ["#E3F5F6", "#0E6A70"],
  ["#EEF0F3", "#3F4A5A"],
];
function warnaDari(nama) {
  let h = 0;
  for (const c of String(nama || "")) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return WARNA[h % WARNA.length];
}

/**
 * Kotak logo dengan cadangan berlapis:
 *   gambar (logo/favicon) → monogram inisial berwarna → ikon gedung.
 *
 * Favicon yang gagal dimuat tidak meninggalkan gambar rusak; komponen
 * otomatis turun ke cadangan berikutnya.
 */
export function LogoKotak({ src, nama, ukuran = 44, radius }) {
  const [gagal, setGagal] = useState(false);
  const r = radius ?? Math.round(ukuran * 0.26);
  const pakaiGambar = src && !gagal;
  const adaNama = nama && !/^tidak disebutkan$/i.test(nama) && inisial(nama) !== "?";
  const [latar, tinta] = warnaDari(nama);

  return (
    <div
      className={`pb-logo ${pakaiGambar ? "" : "fallback"}`}
      style={{
        width: ukuran,
        height: ukuran,
        borderRadius: r,
        padding: pakaiGambar ? Math.round(ukuran * 0.14) : 0,
        fontSize: Math.round(ukuran * 0.36),
        ...(pakaiGambar ? {} : { "--lb": latar, "--lt": tinta }),
      }}
      aria-hidden="true"
    >
      {pakaiGambar ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setGagal(true)}
          onLoad={(e) => {
            // Layanan favicon mengembalikan gambar globe 16px kalau
            // situsnya tidak punya favicon. Anggap gagal supaya yang
            // tampil inisial yang lebih rapi.
            if (e.currentTarget.naturalWidth <= 16) setGagal(true);
          }}
        />
      ) : !adaNama ? (
        <Building2 size={Math.round(ukuran * 0.46)} strokeWidth={1.8} />
      ) : (
        inisial(nama)
      )}
    </div>
  );
}

/**
 * Logo sumber loker. Agregator yang dikenal (LinkedIn, Indeed, ...) memakai
 * badge warna merek bawaan — selalu tajam dan tidak bergantung layanan
 * favicon. Sumber langsung memakai logo situs perusahaan.
 */
export function LogoSumber({ sumber, ukuran = 22 }) {
  if (sumber?.merek) {
    const { warna, huruf } = sumber.merek;
    return (
      <span
        className="pb-merek"
        aria-hidden="true"
        style={{
          width: ukuran,
          height: ukuran,
          borderRadius: Math.round(ukuran * 0.26),
          background: warna,
          fontSize: Math.round(ukuran * (huruf.length > 1 ? 0.46 : 0.58)),
        }}
      >
        {huruf}
      </span>
    );
  }
  return (
    <LogoKotak
      src={sumber?.logo}
      nama={sumber?.nama}
      ukuran={ukuran}
      radius={Math.round(ukuran * 0.26)}
    />
  );
}
