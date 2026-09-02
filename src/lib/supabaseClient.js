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

// ----------------------------------------------------------------------
// SUPABASE PROJECT KEDUA \u2014 khusus buat narik daftar loker tambahan dari
// project Supabase yang berbeda. Auth/profiles/saved_jobs TETAP pakai
// client pertama di atas; client ini cuma dipakai buat baca tabel jobs
// project kedua. Isi 3 env var ini di .env kalau mau pakai:
//
//   VITE_SUPABASE_URL_2=https://yyyy.supabase.co
//   VITE_SUPABASE_ANON_KEY_2=eyJ....
//   VITE_SUPABASE_JOBS_TABLE_2=jobs
// ----------------------------------------------------------------------
const SUPABASE_URL_2 = import.meta.env.VITE_SUPABASE_URL_2;
const SUPABASE_ANON_KEY_2 = import.meta.env.VITE_SUPABASE_ANON_KEY_2;
export const SUPABASE_TABLE_2 =
  import.meta.env.VITE_SUPABASE_JOBS_TABLE_2 || "jobs";

export const supabase2Configured = Boolean(
  SUPABASE_URL_2 && SUPABASE_ANON_KEY_2,
);

export const supabase2 = createClient(
  SUPABASE_URL_2 || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY_2 || "placeholder-key",
  { auth: { persistSession: false } }, // client kedua nggak dipakai buat auth
);

if (import.meta.env.DEV) window.supabase = supabase;
