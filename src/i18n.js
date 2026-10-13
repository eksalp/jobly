/**
 * Bahasa tampilan Jobly: Indonesia (bawaan) atau Inggris.
 *
 * Cara pakai di mana saja (komponen, data, utilitas):
 *
 *   import { t } from "../i18n.js";
 *   t("Cari loker", "Find jobs")
 *
 * Pilihan bahasa disimpan di perangkat. Saat diganti, halaman dimuat
 * ulang sekali, sehingga teks yang disusun di tingkat modul (daftar
 * paket, FAQ, menu) ikut memakai bahasa baru tanpa perlu diubah jadi
 * fungsi satu per satu.
 */

const KUNCI = "jobly:bahasa";
export const DAFTAR_BAHASA = [
  ["id", "Indonesia", "ID"],
  ["en", "English", "EN"],
];

function baca() {
  try {
    const v = localStorage.getItem(KUNCI);
    if (v === "id" || v === "en") return v;
  } catch {
    // penyimpanan tidak tersedia: pakai bawaan
  }
  return "id";
}

const aktif = typeof window === "undefined" ? "id" : baca();

/** Bahasa yang sedang dipakai: "id" atau "en". */
export const bahasa = () => aktif;

/** Pilih teks sesuai bahasa. Kalau versi Inggris kosong, pakai versi Indonesia. */
export const t = (id, en) => (aktif === "en" && en != null ? en : id);

/** Locale untuk angka dan tanggal (toLocaleString). */
export const lokal = () => (aktif === "en" ? "en-US" : "id-ID");

/** Ganti bahasa lalu muat ulang halaman. */
export function setBahasa(b) {
  if (b === aktif) return;
  try {
    localStorage.setItem(KUNCI, b);
  } catch {
    // tetap muat ulang; tanpa penyimpanan, bahasa kembali ke bawaan
  }
  window.location.reload();
}
