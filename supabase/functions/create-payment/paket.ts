// @ts-nocheck
// Salinan definisi paket untuk sisi server.
// Harga dan kuota SELALU dibaca dari sini, tidak pernah dari body request.
export const PAKET = {
  coba: {
    id: "coba",
    nama: "Mingguan",
    harga: 19000,
    kuotaAnalisis: 1,
    durasiHari: 7,
  },
  aktif: {
    id: "aktif",
    nama: "Bulanan",
    harga: 49000,
    kuotaAnalisis: 5,
    durasiHari: 30,
  },
  serius: {
    id: "serius",
    nama: "Tiga Bulan",
    harga: 99000,
    kuotaAnalisis: 15,
    durasiHari: 90,
  },
};
