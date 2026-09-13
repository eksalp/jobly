/**
 * Definisi paket berlangganan.
 *
 * File ini disalin ke edge function juga. Harga dan kuota TIDAK BOLEH
 * dikirim dari browser — server selalu membacanya dari sini.
 *
 * Struktur bertingkat: tiap paket berbayar mencakup SEMUA fitur tier di
 * bawahnya, ditambah miliknya sendiri. Fitur dasar (CV Builder, LinkedIn
 * Builder, bank pertanyaan interview, pelacak lamaran) gratis selamanya
 * di tier Free — yang dijual adalah analisis AI, akses loker penuh, dan
 * fitur lanjutan.
 */

// Fitur yang sama di semua tier, gratis selamanya. Didefinisikan sekali
// lalu disebar ke tiap paket, supaya tidak ada yang tertinggal saat
// daftarnya berubah.
const FITUR_DASAR = [
  "CV Builder — bikin & unduh PDF, selamanya",
  "LinkedIn Builder — susun profil, selamanya",
  "100+ pertanyaan interview + strategi menjawab",
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
      "Analisis AI (CV & LinkedIn)",
      "Akses semua loker Job Finder",
      "Rencana Pindah Karier",
      "Simulasi interview dengan AI",
    ],
  },

  coba: {
    id: "coba",
    nama: "Starter",
    harga: 14000,
    kuotaAnalisis: 1,
    kuotaPindah: 0,
    kuotaInterview: 0,
    durasiHari: 7,
    ringkas: "Coba fitur AI",
    // Semua yang di Free, PLUS milik Starter
    fitur: [
      "Semua fitur Free, plus:",
      "Akses semua loker 7 hari, saring per kota & jenis kerja",
      "1x analisis AI (CV atau LinkedIn)",
      "Draft CV & LinkedIn dalam dua bahasa",
      "Kuota analisis tidak hangus meski masa akses habis",
    ],
    tanpa: ["Rencana Pindah Karier", "Simulasi interview dengan AI"],
  },

  aktif: {
    id: "aktif",
    nama: "Pro",
    harga: 39000,
    kuotaAnalisis: 3,
    kuotaPindah: 2,
    kuotaInterview: 1,
    durasiHari: 30,
    populer: true,
    ringkas: "Paling pas untuk masa melamar",
    fitur: [
      "Semua fitur Starter, plus:",
      "Akses semua loker 1 bulan",
      "3x analisis AI — cek ulang tiap revisi CV",
      "2x Rencana Pindah Karier",
      "1x simulasi interview dengan AI bersuara",
      "Riwayat analisis tersimpan, bisa dibandingkan",
    ],
    tanpa: [],
  },

  serius: {
    id: "serius",
    nama: "Max",
    harga: 59000,
    kuotaAnalisis: 10,
    kuotaPindah: 5,
    kuotaInterview: 2,
    durasiHari: 90,
    ringkas: "Untuk pencarian yang butuh waktu",
    fitur: [
      "Semua fitur Pro, plus:",
      "Akses semua loker 3 bulan",
      "10x analisis AI",
      "5x Rencana Pindah Karier",
      "2x simulasi interview dengan AI bersuara",
    ],
    tanpa: [],
  },
};

// Paket berbayar saja — dipakai halaman checkout. Free tidak dijual.
export const DAFTAR_PAKET = [PAKET.coba, PAKET.aktif, PAKET.serius];

// Semua tier termasuk Free — dipakai tabel perbandingan.
export const SEMUA_TIER = [PAKET.free, PAKET.coba, PAKET.aktif, PAKET.serius];

export function rupiah(n: number) {
  return n === 0 ? "Gratis" : "Rp " + Number(n || 0).toLocaleString("id-ID");
}
