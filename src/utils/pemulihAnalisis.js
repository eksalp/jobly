/**
 * Penanda analisis yang sedang berjalan.
 *
 * Analisis AI memakan waktu puluhan detik. Kalau user pindah halaman
 * atau menutup tab di tengah proses, edge function TETAP menyelesaikan
 * pekerjaannya dan menyimpan hasilnya — yang hilang hanya tampilannya,
 * sementara kuotanya sudah terpotong.
 *
 * Penanda ini disimpan di localStorage supaya bertahan melewati pindah
 * halaman maupun muat ulang. Saat user kembali, hasilnya dijemput dari
 * database alih-alih dianggap hilang.
 */

const AWALAN = "jobly:analisis:";

// Penanda yang lebih tua dari ini dianggap basi. Analisis paling lama
// pun selesai dalam dua menit; kalau lebih dari itu, kemungkinan besar
// prosesnya memang gagal dan menahan penanda hanya membingungkan.
const KEDALUWARSA_MS = 10 * 60 * 1000;

export function tandaiBerjalan(jenis, info = {}) {
  try {
    localStorage.setItem(
      AWALAN + jenis,
      JSON.stringify({ ...info, mulai: Date.now() }),
    );
  } catch {
    // localStorage bisa ditolak di mode penyamaran tertentu. Kegagalan
    // di sini tidak boleh menggagalkan analisisnya sendiri.
  }
}

export function bacaPenanda(jenis) {
  try {
    const mentah = localStorage.getItem(AWALAN + jenis);
    if (!mentah) return null;

    const data = JSON.parse(mentah);
    if (!data?.mulai || Date.now() - data.mulai > KEDALUWARSA_MS) {
      hapusPenanda(jenis);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function hapusPenanda(jenis) {
  try {
    localStorage.removeItem(AWALAN + jenis);
  } catch {
    /* abaikan */
  }
}
