import React, { useState } from "react";
import { Briefcase } from "lucide-react";
import { inisial } from "../../utils/sumberLoker";

/**
 * Kotak logo dengan cadangan berlapis:
 *   gambar (logo/favicon) → inisial perusahaan → ikon tas kerja.
 *
 * Favicon yang gagal dimuat tidak meninggalkan gambar rusak; komponen
 * otomatis turun ke cadangan berikutnya.
 */
export function LogoKotak({ src, nama, ukuran = 44, radius, ikon = false }) {
  const [gagal, setGagal] = useState(false);
  const r = radius ?? Math.round(ukuran * 0.26);
  const pakaiGambar = src && !gagal;

  return (
    <div
      className={`pb-logo ${pakaiGambar ? "" : "fallback"}`}
      style={{
        width: ukuran,
        height: ukuran,
        borderRadius: r,
        padding: pakaiGambar ? Math.round(ukuran * 0.14) : 0,
        fontSize: Math.round(ukuran * 0.36),
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
      ) : ikon || !nama ? (
        <Briefcase size={Math.round(ukuran * 0.46)} strokeWidth={1.8} />
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
