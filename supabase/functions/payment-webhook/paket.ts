// @ts-nocheck
// Salinan definisi paket untuk sisi server (webhook pembayaran).
// Webhook hanya memakai `durasiHari` untuk menghitung tanggal berakhir.
// Harga & kuota yang dibayar ditentukan oleh create-payment/paket.ts —
// keduanya WAJIB sama.
export const PAKET = {
  coba: {
    id: "coba",
    nama: "Starter",
    harga: 9000,
    kuotaAnalisis: 2,
    kuotaPindah: 0,
    kuotaInterview: 0,
    durasiHari: 90, // 3 bulan
  },
  aktif: {
    id: "aktif",
    nama: "Pro",
    harga: 19000,
    kuotaAnalisis: 5,
    kuotaPindah: 2,
    kuotaInterview: 1,
    durasiHari: 180, // 6 bulan
  },
  serius: {
    id: "serius",
    nama: "Max",
    harga: 29000,
    kuotaAnalisis: 10,
    kuotaPindah: 4,
    kuotaInterview: 2,
    durasiHari: 365, // 1 tahun
  },
};
