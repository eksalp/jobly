// @ts-nocheck
// Moderasi loker dari pemberi kerja (lihat supabase/sql/19_pemberi_kerja.sql).
//   Tombol Setujui/Tolak di pesan dari kabar-loker → m|s|id, m|t|id
//   /antreanloker              daftar loker yang menunggu persetujuan
//   /tolakloker <no> <alasan>  tolak dengan alasan (kredit dikembalikan)

const URL = (Deno.env.get("SUPABASE_URL") ?? "").replace(/\/+$/, "");
const KUNCI = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const kepala = () =>
  KUNCI.startsWith("sb_") ? { apikey: KUNCI } : { apikey: KUNCI, Authorization: `Bearer ${KUNCI}` };

async function panggil(path, opsi = {}) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    ...opsi,
    headers: { ...kepala(), "Content-Type": "application/json", ...(opsi.headers || {}) },
  });
  const teks = await res.text();
  if (!res.ok) {
    let pesan = teks;
    try {
      pesan = JSON.parse(teks).message || teks;
    } catch {
      /* teks apa adanya */
    }
    throw new Error(pesan.slice(0, 200));
  }
  return teks ? JSON.parse(teks) : null;
}

export const setujui = (id) => panggil("rpc/setujui_loker", { method: "POST", body: JSON.stringify({ p_id: Number(id) }) });
export const tolak = (id, alasan) =>
  panggil("rpc/tolak_loker", { method: "POST", body: JSON.stringify({ p_id: Number(id), p_alasan: alasan || null }) });

export async function ambil(id) {
  const [m] = await panggil(`loker_perusahaan?id=eq.${Number(id)}&select=id,posisi,status,user_id`);
  if (!m) return null;
  const [p] = await panggil(`perusahaan?user_id=eq.${m.user_id}&select=nama`);
  return { ...m, perusahaan: p?.nama || "" };
}

export async function antrean() {
  const rows = await panggil("loker_perusahaan?status=eq.menunggu&select=id,posisi,user_id,dibuat_at&order=diubah_at.asc&limit=30");
  const ids = [...new Set(rows.map((r) => r.user_id))];
  const pts = ids.length ? await panggil(`perusahaan?user_id=in.(${ids.join(",")})&select=user_id,nama`) : [];
  const nama = Object.fromEntries(pts.map((p) => [p.user_id, p.nama]));
  return rows.map((r) => ({ ...r, perusahaan: nama[r.user_id] || "" }));
}

export const ALASAN_BAWAAN = "Isi loker belum memenuhi ketentuan Workly. Periksa kembali posisi, deskripsi, dan link lamaran.";

export const BANTUAN_MITRA = `<b>Loker pemberi kerja</b>
/antreanloker — loker yang menunggu persetujuan
/tolakloker &lt;nomor&gt; &lt;alasan&gt; — tolak dengan alasan (kredit dikembalikan)
Tombol Setujui/Tolak juga muncul setiap ada loker baru diajukan.`;
