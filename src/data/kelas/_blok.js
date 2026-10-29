/**
 * Penyusun blok isi kelas. Dipakai semua file kelas supaya datanya ringkas.
 *
 *  P(teks)                          paragraf
 *  POIN(judul, [butir])             daftar berpoin
 *  ISTILAH([[istilah, arti], …])    kamus istilah
 *  CONTOH(judul, kurang, lebih, kenapa)   perbandingan sebelum/sesudah
 *  KOTAK(gaya, judul, teks)         gaya: "tips" | "awas" | "fakta"
 *  LANGKAH([[judul, isi], …])       langkah bernomor
 *  LATIHAN(soal, jawaban)           latihan dengan contoh jawaban (dibuka manual)
 *  K(soal, benar, [salah], alasan)  kuis pilihan ganda
 */
export const P = (teks) => ({ t: "p", teks });
export const POIN = (judul, items) => ({ t: "poin", judul, items });
export const ISTILAH = (items) => ({ t: "istilah", items });
export const CONTOH = (judul, kurang, lebih, kenapa) => ({ t: "contoh", judul, kurang, lebih, kenapa });
export const KOTAK = (gaya, judul, teks) => ({ t: "kotak", gaya, judul, teks });
export const LANGKAH = (items) => ({ t: "langkah", items });
export const LATIHAN = (soal, jawaban) => ({ t: "latihan", soal, jawaban });
export const K = (q, benar, salah, e) => ({ q, o: [benar, ...salah], e });
