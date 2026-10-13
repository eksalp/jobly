import React from "react";

/**
 * Tanda Jobly: tas kerja putih dengan petir sebagai ruang kosong di
 * tengahnya — loker, dan cara menemukannya lebih cepat. Satu warna,
 * satu bentuk, tetap terbaca di ukuran favicon.
 *
 * Animasi (src/styles/merek.css): petir muncul sekali saat halaman dibuka.
 */
export function TandaJobly({ ukuran = 32, diam = false }) {
  return (
    <span
      className={`tj ${diam ? "tj-diam" : ""}`}
      style={{ width: ukuran, height: ukuran, borderRadius: Math.round(ukuran * 0.27) }}
      aria-hidden="true"
    >
      <svg width={Math.round(ukuran * 0.68)} height={Math.round(ukuran * 0.68)} viewBox="0 0 24 24">
        <path
          d="M8.6 7.6V5.9a2 2 0 0 1 2-2h2.8a2 2 0 0 1 2 2v1.7"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="2.6" y="7.6" width="18.8" height="13" rx="2.8" fill="#fff" />
        <path className="tj-petir" d="M13.9 9.1 8.3 15h3.5l-1.1 4.3 5.4-6.2h-3.5l1.3-4Z" />
      </svg>
    </span>
  );
}
