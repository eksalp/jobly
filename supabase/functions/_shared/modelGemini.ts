// @ts-nocheck
// Pilihan model Gemini per fitur, disusun untuk kualitas jawaban setara
// analis HR dengan margin tetap besar (perhitungan: Jobly v5).
//
// Prinsipnya: model yang lebih cerdas (3.8 Flash) hanya dipakai di bagian
// yang butuh penilaian, sedangkan pekerjaan menulis ulang dikerjakan model
// murah (Flash-Lite). Setiap daftar dicoba berurutan: kalau model pertama
// penuh, kuotanya habis, atau gangguan, model berikutnya langsung dipakai.
//
// Bisa diubah tanpa mengubah kode lewat secret Supabase, misalnya:
//   npx supabase secrets set GEMINI_MODELS_ANALISIS=gemini-3.5-flash-lite,gemini-3.1-flash-lite
// GEMINI_MODELS (tanpa akhiran) mengganti SEMUA daftar sekaligus.

const daftar = (nama: string, bawaan: string): string[] =>
  (Deno.env.get(nama) ?? Deno.env.get("GEMINI_MODELS") ?? bawaan)
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

/** Review CV & LinkedIn: analisis, audit, dan draft bahasa Indonesia. */
export const MODEL_ANALISIS = daftar(
  "GEMINI_MODELS_ANALISIS",
  "gemini-3.8-flash,gemini-3.5-flash-lite,gemini-3.1-flash-lite",
);

/** Review CV & LinkedIn: draft bahasa Inggris (menulis ulang, bukan menilai). */
export const MODEL_TERJEMAH = daftar(
  "GEMINI_MODELS_TERJEMAH",
  "gemini-3.1-flash-lite,gemini-3.5-flash-lite,gemini-3.8-flash",
);

/** Rencana Pindah Karier. */
export const MODEL_PINDAH = daftar(
  "GEMINI_MODELS_PINDAH",
  "gemini-3.8-flash,gemini-3.5-flash-lite,gemini-3.1-flash-lite",
);

/** Penilaian di akhir simulasi interview. */
export const MODEL_PENILAIAN = daftar(
  "GEMINI_MODELS_PENILAIAN",
  "gemini-3.8-flash,gemini-3.5-flash-lite,gemini-3.1-flash-lite",
);

/** Model suara untuk simulasi interview (Live API). */
export const MODEL_LIVE =
  Deno.env.get("GEMINI_MODEL_LIVE") ?? "models/gemini-3.8-live";

/** True bila galat berarti kuota (harian atau per menit) habis. */
export const kuotaHabis = (teks = "") =>
  /429|RESOURCE_EXHAUSTED|quota/i.test(String(teks));
