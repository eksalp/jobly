/**
 * Definisi paket berlangganan.
 *
 * File ini disalin ke edge function juga. Harga dan kuota TIDAK BOLEH
 * dikirim dari browser — server selalu membacanya dari sini, karena
 * apa pun yang dikirim client bisa dipalsukan.
 */
export const PAKET = {
  coba: {
    id: "coba",
    nama: "Mingguan",
    harga: 19000,
    kuotaAnalisis: 1,
    durasiHari: 7,
    ringkas: "Coba dulu sebelum memutuskan",
    fitur: [
      "1x analisis AI (CV atau LinkedIn)",
      "Akses semua loker yang cocok",
      "CV Builder dengan arahan AI",
      "LinkedIn Builder dengan arahan AI",
      "Draft CV & LinkedIn dalam dua bahasa",
    ],
  },

  aktif: {
    id: "aktif",
    nama: "Bulanan",
    harga: 49000,
    kuotaAnalisis: 5,
    durasiHari: 30,
    populer: true,
    ringkas: "Paling pas untuk masa melamar",
    fitur: [
      "5x analisis AI — cek ulang tiap kali revisi CV",
      "Akses semua loker yang cocok",
      "CV Builder dengan arahan AI",
      "LinkedIn Builder dengan arahan AI",
      "Draft CV & LinkedIn dalam dua bahasa",
      "Riwayat analisis tersimpan, bisa dibandingkan",
    ],
  },

  serius: {
    id: "serius",
    nama: "Tiga Bulan",
    harga: 99000,
    kuotaAnalisis: 15,
    durasiHari: 90,
    ringkas: "Untuk pencarian yang butuh waktu",
    fitur: [
      "15x analisis AI",
      "Akses semua loker yang cocok",
      "CV Builder dengan arahan AI",
      "LinkedIn Builder dengan arahan AI",
      "Draft CV & LinkedIn dalam dua bahasa",
      "Riwayat analisis tersimpan, bisa dibandingkan",
      "Pelacak lamaran tanpa batas",
    ],
  },
};

export const DAFTAR_PAKET = [PAKET.coba, PAKET.aktif, PAKET.serius];

export const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

/** Fitur yang dikunci saat belum berlangganan. */
export const FITUR = {
  ANALISIS_AI: "analisis_ai",
  LOKER_PENUH: "loker_penuh",
  CV_BUILDER_AI: "cv_builder_ai",
  LINKEDIN_BUILDER_AI: "linkedin_builder_ai",
};
