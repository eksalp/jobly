/**
 * Statistik loker dari pemberi kerja (dilihat & klik lamar).
 * Dicatat sekali per sesi per loker supaya angka tidak membengkak
 * karena muat ulang halaman.
 */
import { supabase, supabaseConfigured } from "../lib/supabaseClient";

export function catatMitra(job, jenis) {
  if (!job?.mitraId || !supabaseConfigured) return;
  const kunci = `jobly:mitra:${jenis}:${job.mitraId}`;
  try {
    if (sessionStorage.getItem(kunci)) return;
    sessionStorage.setItem(kunci, "1");
  } catch {
    /* penyimpanan tidak tersedia: tetap dicatat */
  }
  supabase.rpc("catat_loker_mitra", { p_id: job.mitraId, p_jenis: jenis }).then(
    () => {},
    () => {},
  );
}
