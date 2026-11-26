// @ts-nocheck
// Admin "Urgently hiring" lewat Telegram.
//
//   /urgent                      daftar loker yang sedang urgent
//   /urgent <link atau nomor>    tandai urgent 14 hari (angka di akhir = jumlah hari,
//                                0 = tanpa batas), mis. /urgent jobly.my.id/loker/1758392041 30
//   /urgent <kata kunci>         cari loker, lalu pilih lewat tombol "Tandai"
//   /lepasurgent <link/nomor>    hapus tanda urgent
//
// Secret tambahan (khusus loker DB2, project Supabase kedua):
//   JOBLY_DB2_URL          URL project DB2, mis. https://xxxx.supabase.co
//   JOBLY_DB2_SERVICE_KEY  service role / secret key project DB2
//   JOBLY_DB2_TABLE        opsional, bawaan "jobs"
//   JOBS_TABLE             opsional, nama tabel loker DB1 (bawaan "jobs")

const HARI_BAWAAN = 14;

function sumber() {
  const e = (k) => Deno.env.get(k) ?? "";
  return {
    db1: { url: e("SUPABASE_URL"), kunci: e("SUPABASE_SERVICE_ROLE_KEY"), tabel: e("JOBS_TABLE") || "jobs" },
    db2: { url: e("JOBLY_DB2_URL").replace(/\/+$/, ""), kunci: e("JOBLY_DB2_SERVICE_KEY"), tabel: e("JOBLY_DB2_TABLE") || "jobs" },
  };
}

export async function rest(dbId, path, { metode = "GET", body, tabel, prefer } = {}) {
  const db = sumber()[dbId];
  if (!db?.url || !db.kunci) {
    throw new Error(dbId === "db2" ? "Secret JOBLY_DB2_URL / JOBLY_DB2_SERVICE_KEY belum di-set." : "Koneksi DB1 belum tersedia.");
  }
  const headers = String(db.kunci).startsWith("sb_")
    ? { apikey: db.kunci }
    : { apikey: db.kunci, Authorization: `Bearer ${db.kunci}` };
  if (body) {
    headers["Content-Type"] = "application/json";
    headers.Prefer = prefer || "return=representation";
  }
  const res = await fetch(`${db.url}/rest/v1/${tabel || db.tabel}?${path}`, { method: metode, headers, body: body ? JSON.stringify(body) : undefined });
  const teks = await res.text();
  if (!res.ok) {
    if (/urgent/.test(teks)) throw new Error(`Tabel/kolom urgent belum ada di ${dbId}. Jalankan supabase/sql/17_urgent_hiring.sql di project itu.`);
    if (/loker_manual/.test(teks)) throw new Error("Tabel loker_manual belum ada. Jalankan supabase/sql/18_loker_manual.sql di project DB1.");
    throw new Error(`${dbId} ${res.status}: ${teks.slice(0, 140)}`);
  }
  return teks ? JSON.parse(teks) : [];
}

// ---- nomor unik loker (sama dengan src/utils/sumberLoker.js) ----
const KUNCI_ACAK = [0x5bd1, 0xe995, 0x2c1b, 0x9e37];
const BATAS_ID = 4294967296;
const putaran = (r, k) => (Math.imul(r ^ k, 0x45d9f3b) >>> 7) & 0xffff;
function acakId(n) {
  let l = (n >>> 16) & 0xffff;
  let r = n & 0xffff;
  for (const k of KUNCI_ACAK) [l, r] = [r, l ^ putaran(r, k)];
  return ((l << 16) | r) >>> 0;
}
function balikId(x) {
  let l = (x >>> 16) & 0xffff;
  let r = x & 0xffff;
  for (const k of [...KUNCI_ACAK].reverse()) [l, r] = [r ^ putaran(l, k), l];
  return ((l << 16) | r) >>> 0;
}
export const kodeLoker = (dbId, id) => {
  const k = Number(String(dbId).replace(/^db/, ""));
  const n = Number(id);
  return n > 0 && n < BATAS_ID && k >= 1 && k <= 9 ? String(acakId(n) * 10 + k) : `${dbId}-${id}`;
};

/** Link / nomor / "db1-123" → { db, id }, atau null bila bukan rujukan loker. */
export function bacaRujukan(teks) {
  let s = String(teks || "").trim();
  const m = s.match(/\/loker\/([^\s?#]+)/);
  if (m) s = m[1];
  else if (/\s/.test(s)) return null;
  const lama = s.match(/^(db\d)[-:](\d+)/i);
  if (lama) return { db: lama[1].toLowerCase(), id: Number(lama[2]) };
  const angka = s.match(/^(\d{3,})(?:-|$)/);
  if (angka) {
    const kode = Number(angka[1]);
    const k = kode % 10;
    const acak = Math.floor(kode / 10);
    if (k >= 1 && k <= 2 && acak < BATAS_ID) {
      const id = balikId(acak);
      if (id > 0) return { db: `db${k}`, id };
    }
  }
  return null;
}

const KOLOM = "id,title,company,urgent,urgent_sampai";
const tglId = (iso) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });

// Tanda disimpan di tabel loker_urgent berdasarkan job_url, karena tabel jobs
// dikosongkan dan diisi ulang setiap malam oleh scrape harian. Trigger di
// database (SQL 17) yang memasang/melepas kolom urgent di tabel jobs.
async function ambilLoker(rujukan) {
  const [r] = await rest(rujukan.db, `id=eq.${rujukan.id}&select=${KOLOM},job_url`);
  return r || null;
}

/** Tandai urgent berdasarkan job_url (dipakai juga oleh /lokerbaru). */
export async function tandaiUrl(dbId, jobUrl, hari = HARI_BAWAAN) {
  const sampai = hari > 0 ? new Date(Date.now() + hari * 86400000).toISOString() : null;
  await rest(dbId, "on_conflict=job_url", {
    tabel: "loker_urgent",
    metode: "POST",
    body: { job_url: jobUrl, sampai },
    prefer: "resolution=merge-duplicates,return=minimal",
  });
  return sampai;
}

export async function tandai(rujukan, hari = HARI_BAWAAN) {
  const r = await ambilLoker(rujukan);
  if (!r) return null;
  if (!r.job_url) throw new Error("Loker ini tidak punya job_url, jadi tidak bisa ditandai.");
  const sampai = await tandaiUrl(rujukan.db, r.job_url, hari);
  return { ...r, urgent: true, urgent_sampai: sampai, db: rujukan.db };
}

export async function lepas(rujukan) {
  const r = await ambilLoker(rujukan);
  if (!r) return null;
  if (r.job_url) {
    await rest(rujukan.db, `job_url=eq.${encodeURIComponent(r.job_url)}`, { tabel: "loker_urgent", metode: "DELETE" });
  }
  return { ...r, urgent: false, urgent_sampai: null, db: rujukan.db };
}

/** Semua loker yang sedang urgent (yang kedaluwarsa tidak ikut). */
export async function daftarUrgent() {
  const kini = new Date().toISOString();
  const hasil = [];
  for (const db of ["db1", "db2"]) {
    const s = sumber()[db];
    if (!s.url || !s.kunci) continue;
    try {
      const rows = await rest(db, `urgent=is.true&or=(urgent_sampai.is.null,urgent_sampai.gt.\"${kini}\")&select=${KOLOM}&order=urgent_sampai.asc.nullslast&limit=40`);
      rows.forEach((r) => hasil.push({ ...r, db }));
    } catch (e) {
      hasil.push({ galat: `${db}: ${e.message}` });
    }
  }
  return hasil;
}

export const sisaTeks = (r) => (r.urgent_sampai ? `sampai ${tglId(r.urgent_sampai)}` : "tanpa batas waktu");

export const BANTUAN_URGENT = `<b>Urgently hiring</b>
/urgent — daftar loker yang sedang urgent
/urgent &lt;link loker&gt; — tandai urgent ${HARI_BAWAAN} hari
/urgent &lt;link loker&gt; 30 — tandai 30 hari (0 = tanpa batas)
/urgent &lt;kata kunci&gt; — cari loker lalu pilih lewat tombol "Tandai"
/lepasurgent &lt;link loker&gt; — hapus tanda urgent

Tanda hilang sendiri setelah batas waktunya lewat. Di situs, loker urgent mendapat label "Urgent" dan bisa disaring lewat filter "Urgently hiring".`;
