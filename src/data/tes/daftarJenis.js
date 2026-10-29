/**
 * Daftar id tes yang dicatat di tabel tes_sesi (1x per paket Max).
 * Dipisah dari tesKerja.js supaya LanggananContext tidak ikut memuat
 * bank soal. Harus sama dengan constraint tes_jenis_sah di
 * supabase/sql/13_tes_bumn_bi.sql.
 */
export const JENIS_TERCATAT = [
  "tpa", "kraepelin", "verbal", "numerik", "logika", "inggris", "figural", "kecermatan", "ketelitian", "kepribadian",
  "spasial", "cfit", "armyalpha", "akhlak", "disc", "epps", "tipe16",
  "rbb", "tkd", "twk", "learning", "bi",
];
