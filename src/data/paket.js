import { lokal, t } from "../i18n.js";
/**
 * Definisi paket berlangganan.
 *
 * File ini disalin ke edge function juga. Harga dan kuota TIDAK BOLEH
 * dikirim dari browser — server selalu membacanya dari sini.
 *
 * Struktur bertingkat: tiap paket berbayar mencakup SEMUA fitur tier di
 * bawahnya, ditambah miliknya sendiri. Fitur dasar (CV Builder, LinkedIn
 * Builder, bank pertanyaan interview, pelacak lamaran) gratis selamanya
 * di tier Free, begitu juga 5.000 loker pertama. Paket berbayar membuka
 * SEMUA loker, analisis AI, dan fitur lanjutan.
 */

// Fitur yang sama di semua tier, gratis selamanya. Didefinisikan sekali
// lalu disebar ke tiap paket, supaya tidak ada yang tertinggal saat
// daftarnya berubah.
const FITUR_DASAR = [
  t("5.000 loker, bisa dicari dan disaring per kota", "5,000 jobs to search and filter by city"),
  t("CV Builder: bikin dan unduh PDF, gratis selamanya", "CV Builder: create and download a PDF, free forever"),
  t("LinkedIn Builder: susun profil, gratis selamanya", "LinkedIn Builder: write your profile, free forever"),
  t("140+ pertanyaan interview, termasuk level neraka", "140+ interview questions, including the hardest ones"),
  t("Pelacak lamaran untuk memantau progres", "Application tracker to follow your progress"),
];

export const PAKET = {
  free: {
    id: "free",
    nama: "Free",
    harga: 0,
    kuotaAnalisis: 0,
    kuotaPindah: 0,
    kuotaInterview: 0,
    durasiHari: 0, // tanpa masa berlaku — selamanya
    selamanya: true,
    ringkas: t("Mulai tanpa biaya", "Start at no cost"),
    fitur: [...FITUR_DASAR],
    tanpa: [
      t("Loker di atas 5.000", "Jobs beyond 5,000"),
      t("Analisis AI (CV & LinkedIn)", "AI analysis (CV & LinkedIn)"),
      t("Rencana Pindah Karier", "Career Switch plan"),
      t("Simulasi interview dengan AI", "AI mock interview"),
    ],
  },

  coba: {
    id: "coba",
    nama: "Starter",
    harga: 9000,
    kuotaAnalisis: 1,
    kuotaPindah: 0,
    kuotaInterview: 0,
    durasiHari: 90, // 3 bulan
    ringkas: t("Coba fitur AI", "Try the AI features"),
    // Semua yang di Free, PLUS milik Starter
    fitur: [
      t("Semua fitur Free, plus:", "Everything in Free, plus:"),
      t("Buka SEMUA loker, tanpa batas 5.000", "Unlock ALL jobs, no 5,000 limit"),
      t("Masa aktif 3 bulan", "Active for 3 months"),
      t("1x analisis AI (CV atau LinkedIn)", "1 AI analysis (CV or LinkedIn)"),
      t("Draft CV & LinkedIn dalam dua bahasa", "CV & LinkedIn drafts in two languages"),
      t("Kuota analisis tidak hangus meski masa akses habis", "Analysis credits don't expire when access ends"),
    ],
    tanpa: [t("Rencana Pindah Karier", "Career Switch plan"), t("Simulasi interview dengan AI", "AI mock interview")],
  },

  aktif: {
    id: "aktif",
    nama: "Pro",
    harga: 19000,
    kuotaAnalisis: 3,
    kuotaPindah: 2,
    kuotaInterview: 1,
    durasiHari: 180, // 6 bulan
    populer: true,
    ringkas: t("Paling pas untuk masa melamar", "Best for an active job search"),
    fitur: [
      t("Semua fitur Starter, plus:", "Everything in Starter, plus:"),
      t("Masa aktif 6 bulan", "Active for 6 months"),
      t("3x analisis AI, cukup untuk cek ulang setelah revisi CV", "3 AI analyses, enough to recheck after revising your CV"),
      t("2x Rencana Pindah Karier", "2 Career Switch plans"),
      t("1x simulasi interview AI bersuara (10 menit)", "1 AI voice mock interview (10 minutes)"),
      t("Riwayat analisis tersimpan, bisa dibandingkan", "Saved analysis history you can compare"),
    ],
    tanpa: [],
  },

  serius: {
    id: "serius",
    nama: "Max",
    harga: 29000,
    kuotaAnalisis: 10,
    kuotaPindah: 5,
    kuotaInterview: 2,
    durasiHari: 365, // 1 tahun
    ringkas: t("Untuk pencarian yang butuh waktu", "For a longer job search"),
    fitur: [
      t("Semua fitur Pro, plus:", "Everything in Pro, plus:"),
      t("Masa aktif 1 tahun", "Active for 1 year"),
      t("10x analisis AI", "10 AI analyses"),
      t("5x Rencana Pindah Karier", "5 Career Switch plans"),
      t("2x simulasi interview AI bersuara (@10 menit)", "2 AI voice mock interviews (10 minutes each)"),
    ],
    tanpa: [],
  },
};

// Paket berbayar saja — dipakai halaman checkout. Free tidak dijual.
export const DAFTAR_PAKET = [PAKET.coba, PAKET.aktif, PAKET.serius];

// Semua tier termasuk Free — dipakai tabel perbandingan.
export const SEMUA_TIER = [PAKET.free, PAKET.coba, PAKET.aktif, PAKET.serius];

/** Masa berlaku dalam kata: 90 → "3 bulan", 365 → "1 tahun". */
export function labelDurasi(hari) {
  if (!hari) return t("selamanya", "forever");
  const jamak = (n, s) => `${n} ${s}${n === 1 ? "" : "s"}`;
  if (hari % 365 === 0) return t(`${hari / 365} tahun`, jamak(hari / 365, "year"));
  if (hari % 30 === 0) return t(`${hari / 30} bulan`, jamak(hari / 30, "month"));
  return t(`${hari} hari`, jamak(hari, "day"));
}

export function rupiah(n) {
  return n === 0 ? t("Gratis", "Free") : "Rp " + Number(n || 0).toLocaleString(lokal());
}
