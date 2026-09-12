import { useEffect } from "react";

/**
 * Mencegah user meninggalkan halaman saat analisis sedang berjalan.
 *
 * Ada dua jalan keluar yang berbeda dan harus ditangani terpisah:
 *
 *   1. Tutup tab / muat ulang / tekan tombol kembali browser
 *      -> ditangani `beforeunload`. Browser menampilkan dialog bawaannya
 *         sendiri; teksnya tidak bisa diatur (semua browser modern
 *         mengabaikan pesan kustom demi mencegah penyalahgunaan).
 *
 *   2. Pindah menu di dalam aplikasi
 *      -> `beforeunload` TIDAK terpicu, karena halamannya tidak benar-
 *         benar ditinggalkan. Itu sebabnya ada penanda bersama di bawah
 *         yang bisa diperiksa sebelum berpindah panel.
 */

// Penanda tingkat modul, bukan state React. Sengaja: nilainya perlu
// dibaca dari komponen lain (router/menu) yang tidak punya hubungan
// induk-anak dengan panel yang sedang menjalankan analisis.
let sedangBerjalan = false;
let keterangan = "";

export function adaProsesBerjalan() {
  return sedangBerjalan;
}

export function keteranganProses() {
  return keterangan;
}

export function useCegahTinggalkan(aktif, pesan = "Analisis sedang berjalan.") {
  useEffect(() => {
    sedangBerjalan = Boolean(aktif);
    keterangan = aktif ? pesan : "";

    if (!aktif) return;

    const cegah = (e) => {
      e.preventDefault();
      // returnValue masih dibutuhkan sebagian browser lama, meski isinya
      // tidak pernah ditampilkan.
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", cegah);

    return () => {
      window.removeEventListener("beforeunload", cegah);
      sedangBerjalan = false;
      keterangan = "";
    };
  }, [aktif, pesan]);
}
