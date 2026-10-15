/**
 * Mode pemeliharaan.
 *
 * AKTIF = true  → seluruh situs menampilkan halaman pemeliharaan.
 * AKTIF = false → situs kembali normal.
 *
 * Setelah mengubah nilai ini: npm run build, commit, push. Vercel akan
 * memasang versi baru dalam beberapa menit.
 *
 * Pemilik situs tetap bisa membuka situs untuk menguji dengan membuka
 * alamat ini sekali di browser:  https://<domain>/?uji=jobly-uji
 * Untuk kembali melihat halaman pemeliharaan:  /?uji=keluar
 */
export const PEMELIHARAAN = {
  AKTIF: true,
  // Perkiraan selesai (WIB). Situs TIDAK otomatis dibuka pada jam ini;
  // setelah jam ini lewat, halaman menampilkan "sebentar lagi".
  selesai: "2026-10-16T08:00:00+07:00",
  kunciUji: "jobly-uji",
};

const KUNCI_SIMPAN = "jobly:uji-pemeliharaan";

/** True bila halaman pemeliharaan harus ditampilkan ke pengunjung ini. */
export function sedangPemeliharaan() {
  if (!PEMELIHARAAN.AKTIF) return false;
  try {
    const uji = new URLSearchParams(window.location.search).get("uji");
    if (uji === PEMELIHARAAN.kunciUji) localStorage.setItem(KUNCI_SIMPAN, "1");
    if (uji === "keluar") localStorage.removeItem(KUNCI_SIMPAN);
    return localStorage.getItem(KUNCI_SIMPAN) !== "1";
  } catch {
    return true;
  }
}
