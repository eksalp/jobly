import React from "react";

/**
 * Tanda Jobly: tas kerja dengan petir di tengahnya — "cari kerja, lebih cepat".
 *
 * Animasi (lihat src/styles/merek.css), sengaja hemat:
 *  - saat halaman dibuka, petir "menyambar" sekali;
 *  - kilau tipis melintas pelan setiap beberapa detik;
 *  - saat kursor di atas logo, petir berkedip sekali.
 * Semua dimatikan untuk pengguna yang memilih mengurangi gerakan.
 */
export function TandaJobly({ ukuran = 32, diam = false }) {
  return (
    <span
      className={`tj ${diam ? "tj-diam" : ""}`}
      style={{ width: ukuran, height: ukuran, borderRadius: Math.round(ukuran * 0.28) }}
      aria-hidden="true"
    >
      <svg width={Math.round(ukuran * 0.72)} height={Math.round(ukuran * 0.72)} viewBox="0 0 24 24" fill="none">
        {/* Gagang & badan tas */}
        <path
          d="M8.5 7V5.6A2 2 0 0 1 10.5 3.6h3A2 2 0 0 1 15.5 5.6V7"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect x="2.5" y="7" width="19" height="13.6" rx="2.6" stroke="#fff" strokeWidth="1.8" />
        {/* Petir */}
        <path className="tj-petir" d="M14.1 8.7 7.7 15.1h4.2l-1.4 4.6 6.1-6.7h-4.2l1.7-4.3Z" />
      </svg>
      <span className="tj-kilau" />
    </span>
  );
}
