// @ts-nocheck
// Daftar model Gemini untuk semua fungsi teks (Review CV, Pindah Karier,
// penilaian Simulasi Interview), dicoba berurutan.
//
// Urutannya disusun untuk API gratis (tanpa billing). Kuota gratis dihitung
// per model, dan per proyek:
//   - model Flash-Lite: sekitar 15 permintaan/menit dan 500/hari
//   - model Flash:      sekitar 5 permintaan/menit dan hanya 20/hari
// Jadi Flash-Lite dipakai lebih dulu, dan model berikutnya dicoba saat kuota
// model sebelumnya habis (galat 429). Setiap model punya kuota sendiri,
// sehingga kapasitas hariannya ikut bertambah.
//
// Setelah billing aktif, urutan bisa diganti tanpa mengubah kode lewat
// secret Supabase, misalnya:
//   npx supabase secrets set GEMINI_MODELS=gemini-3.8-flash,gemini-3.6-flash
export const DAFTAR_MODEL: string[] = (
  Deno.env.get("GEMINI_MODELS") ??
  "gemini-3.5-flash-lite,gemini-3.1-flash-lite,gemini-3.8-flash"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

/** True bila galat berarti kuota (harian atau per menit) habis. */
export const kuotaHabis = (teks = "") =>
  /429|RESOURCE_EXHAUSTED|quota/i.test(String(teks));
