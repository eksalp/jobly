/**
 * Klien untuk /api/loker — satu-satunya jalan aplikasi mengambil data loker.
 *
 * Browser tidak lagi mengunduh ribuan baris. Setiap permintaan hanya
 * berisi yang ditampilkan (mis. 24 loker), dan jawabannya di-cache di CDN
 * Vercel sehingga Supabase jarang tersentuh walau pengunjung banyak.
 */
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { mapSupabaseJob } from "./petaLoker.js";

const memori = new Map(); // url → { waktu, data } — mencegah ambil ulang saat bolak-balik halaman
const UMUR = 60 * 1000;

export async function panggilApi(aksi, params = {}, { penuh = false, segar = false } = {}) {
  const p = new URLSearchParams({ aksi });
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "" || v === false) continue;
    p.set(k, v === true ? "1" : String(v));
  }
  if (penuh) p.set("akses", "penuh");
  const url = `/api/loker?${p.toString()}`;

  const c = memori.get(url);
  if (!segar && c && Date.now() - c.waktu < UMUR) return c.data;

  const headers = {};
  if (penuh && supabaseConfigured) {
    const { data } = await supabase.auth.getSession();
    const t = data?.session?.access_token;
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(url, { headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 404) throw new Error(data?.error || `Gagal memuat (${res.status})`);
  if (memori.size > 200) memori.clear();
  memori.set(url, { waktu: Date.now(), data });
  return data;
}

/** Baris mentah dari API → objek loker yang dipakai UI. */
export function keJob(row) {
  if (!row) return null;
  const j = mapSupabaseJob(row, row._s || "db1");
  if (row._kunci) j.terkunci = true;
  return j;
}
