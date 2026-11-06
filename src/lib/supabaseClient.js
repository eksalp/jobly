import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const SUPABASE_TABLE =
  import.meta.env.VITE_SUPABASE_JOBS_TABLE || "jobs";

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Satu client dipakai bareng untuk data (jobs, profiles, saved_jobs) dan auth.
// Kalau env var belum diisi, client tetap dibuat dengan URL/key dummy supaya
// import.meta.env yang kosong nggak bikin createClient() crash — tapi semua
// pemanggilan akan gagal dan fallback ke data demo / redirect ke login.
export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-key",
  { auth: { persistSession: true, autoRefreshToken: true } },
);

// Project Supabase kedua (DB2) TIDAK lagi dibuat di browser: URL dan
// kuncinya hanya dipakai server (/api/loker) supaya tidak ikut terkirim
// ke pengunjung dan tidak bisa dipakai untuk menyedot tabel langsung.

if (import.meta.env.DEV) window.supabase = supabase;
