/**
 * Definisi paket berlangganan.
 *
 * File ini disalin ke edge function juga. Harga dan kuota TIDAK BOLEH
 * dikirim dari browser — server selalu membacanya dari sini.
 *
 * Struktur bertingkat: tiap paket berbayar mencakup SEMUA fitur tier di
 * bawahnya, ditambah miliknya sendiri. Fitur dasar (CV Builder, LinkedIn
 * Builder, bank pertanyaan interview, pelacak lamaran) gratis selamanya
 * di tier Free, begitu juga SEMUA loker. Paket berbayar membuka latihan
 * praktik, analisis AI, dan fitur lanjutan.
 */

// Fitur yang sama di semua tier, gratis selamanya. Didefinisikan sekali
// lalu disebar ke tiap paket, supaya tidak ada yang tertinggal saat
// daftarnya berubah.
const FITUR_DASAR = [
  "Semua loker, bisa dicari dan disaring per kota",
  "CV Builder — bikin & unduh PDF, selamanya",
  "LinkedIn Builder — susun profil, selamanya",
  "140+ pertanyaan interview, termasuk level neraka",
  "Pelacak lamaran untuk memantau progres",
];

export const PAKET: Record<string, any> = {
  free: {
    id: "free",
    nama: "Free",
    harga: 0,
    kuotaAnalisis: 0,
    kuotaPindah: 0,
    kuotaInterview: 0,
    durasiHari: 0, // tanpa masa berlaku — selamanya
    selamanya: true,
    ringkas: "Mulai tanpa biaya",
    fitur: [...FITUR_DASAR],
    tanpa: [
      "Latihan praktik 40 pekerjaan remote",
      "Analisis AI (CV & LinkedIn)",
      "Rencana Pindah Karier",
      "Simulasi interview dengan AI",
    ],
  },

  coba: {
    id: "coba",
    nama: "Starter",
    harga: 9000,
    kuotaAnalisis: 2,
    kuotaPindah: 1,
    kuotaInterview: 0,
    durasiHari: 90, // 3 bulan
    ringkas: "Coba fitur AI",
    // Semua yang di Free, PLUS milik Starter
    fitur: [
      "Semua fitur Free, plus:",
      "Latihan praktik lengkap untuk 40 pekerjaan remote",
      "Masa aktif 3 bulan",
      "2x analisis AI (CV atau LinkedIn)",
      "1x Rencana Pindah Karier",
      "Draft CV & LinkedIn dalam dua bahasa",
    ],
    tanpa: ["Simulasi interview dengan AI"],
  },

  aktif: {
    id: "aktif",
    nama: "Pro",
    harga: 19000,
    kuotaAnalisis: 5,
    kuotaPindah: 2,
    kuotaInterview: 1,
    durasiHari: 180, // 6 bulan
    populer: true,
    ringkas: "Paling pas untuk masa melamar",
    fitur: [
      "Semua fitur Starter, plus:",
      "Masa aktif 6 bulan",
      "5x analisis AI — cek ulang tiap revisi CV",
      "2x Rencana Pindah Karier",
      "1x simulasi interview AI bersuara (10 menit)",
      "Riwayat analisis tersimpan, bisa dibandingkan",
    ],
    tanpa: [],
  },

  serius: {
    id: "serius",
    nama: "Max",
    harga: 29000,
    kuotaAnalisis: 10,
    kuotaPindah: 4,
    kuotaInterview: 2,
    durasiHari: 365, // 1 tahun
    ringkas: "Untuk pencarian yang butuh waktu",
    fitur: [
      "Semua fitur Pro, plus:",
      "Masa aktif 1 tahun",
      "10x analisis AI",
      "4x Rencana Pindah Karier",
      "2x simulasi interview AI bersuara (@10 menit)",
    ],
    tanpa: [],
  },
};

// Paket berbayar saja — dipakai halaman checkout. Free tidak dijual.
export const DAFTAR_PAKET = [PAKET.coba, PAKET.aktif, PAKET.serius];

// Semua tier termasuk Free — dipakai tabel perbandingan.
export const SEMUA_TIER = [PAKET.free, PAKET.coba, PAKET.aktif, PAKET.serius];

/** Masa berlaku dalam kata: 90 → "3 bulan", 365 → "1 tahun". */
export function labelDurasi(hari: number) {
  if (!hari) return "selamanya";
  if (hari % 365 === 0) return `${hari / 365} tahun`;
  if (hari % 30 === 0) return `${hari / 30} bulan`;
  return `${hari} hari`;
}

export function rupiah(n: number) {
  return n === 0 ? "Gratis" : "Rp " + Number(n || 0).toLocaleString("id-ID");
}
