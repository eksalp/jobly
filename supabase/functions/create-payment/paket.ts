/**
 * Definisi paket berlangganan.
 *
 * File ini disalin ke edge function juga. Harga dan kuota TIDAK BOLEH
 * dikirim dari browser — server selalu membacanya dari sini, karena
 * apa pun yang dikirim client bisa dipalsukan.
 *
 * Ada TIGA jenis kuota yang dihitung terpisah, karena biaya AI-nya
 * berbeda jauh:
 *   - kuotaAnalisis  : analisis CV / LinkedIn  (~Rp 750 per panggilan)
 *   - kuotaPindah    : analisis pindah karier  (~Rp 1.000 per panggilan)
 *   - kuotaInterview : simulasi interview suara (~Rp 5.000-15.000 per sesi)
 *
 * Perhatikan selisih biaya interview yang sangat besar itu — satu sesi
 * suara setara ~15 analisis CV. Karena itu kuotanya sengaja dibuat kecil,
 * dan menaikkannya harus selalu dicek ulang terhadap harga paketnya.
 */
export const PAKET: Record<string, any> = {
  coba: {
    id: "coba",
    nama: "Starter",
    harga: 14000,
    kuotaAnalisis: 1,
    kuotaPindah: 0,
    kuotaInterview: 0,
    durasiHari: 7,
    ringkas: "Coba dulu sebelum memutuskan",
    fitur: [
      "Akses semua loker 7 hari, saring per kota & jenis kerja",
      "1x analisis AI (CV atau LinkedIn)",
      "CV Builder & LinkedIn Builder dengan arahan AI",
      "Draft CV & LinkedIn dalam dua bahasa",
      "100 pertanyaan interview + strategi menjawab",
      "Kuota analisis tidak hangus meski masa akses habis",
    ],
    // Fitur yang TIDAK termasuk. Ditampilkan terus terang supaya user
    // paham bedanya dengan paket di atasnya tanpa membandingkan sendiri.
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
      "Akses semua loker 1 bulan, saring per kota & jenis kerja",
      "3x analisis AI — cek ulang tiap kali revisi CV",
      "2x Rencana Pindah Karier",
      "1x simulasi interview dengan AI bersuara",
      "CV Builder & LinkedIn Builder dengan arahan AI",
      "Draft CV & LinkedIn dalam dua bahasa",
      "Pelacak lamaran & riwayat analisis tersimpan",
      "100 pertanyaan interview + strategi menjawab",
      "Kuota analisis tidak hangus meski masa akses habis",
    ],
    tanpa: [],
  },

  serius: {
    id: "serius",
    nama: "Max",
    harga: 59000,
    kuotaAnalisis: 10,
    kuotaPindah: 5,
    // Dibatasi 2 sesi. Sesi suara jauh lebih mahal daripada analisis
    // teks (~Rp 9.000 vs ~Rp 750), jadi menaikkannya harus selalu
    // dicek ulang terhadap harga paket.
    kuotaInterview: 2,
    durasiHari: 90,
    ringkas: "Untuk pencarian yang butuh waktu",
    fitur: [
      "Akses semua loker 3 bulan, saring per kota & jenis kerja",
      "10x analisis AI",
      "5x Rencana Pindah Karier",
      "2x simulasi interview dengan AI bersuara",
      "CV Builder & LinkedIn Builder dengan arahan AI",
      "Draft CV & LinkedIn dalam dua bahasa",
      "Pelacak lamaran tanpa batas & riwayat tersimpan",
      "100 pertanyaan interview + strategi menjawab",
      "Kuota analisis tidak hangus meski masa akses habis",
    ],
    tanpa: [],
  },
};

export const DAFTAR_PAKET = [PAKET.coba, PAKET.aktif, PAKET.serius];

export function rupiah(n: number) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}
