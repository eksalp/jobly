/**
 * Akses tabel `jobs` dari server (Vercel Function), lewat REST Supabase.
 *
 * Kenapa lewat server, bukan langsung dari browser?
 *  - Browser hanya menerima 24 loker per halaman, bukan ribuan baris.
 *  - Jawaban untuk pengunjung disimpan di CDN Vercel (s-maxage), jadi
 *    1.000 pengunjung yang membuka halaman yang sama hanya memicu SATU
 *    query ke Supabase per beberapa menit.
 *  - Batas 5.000 loker gratis ditegakkan di server, tidak bisa diakali
 *    dari browser.
 *
 * Mendukung dua project Supabase (db1 & db2) seperti versi sebelumnya.
 */

const KOLOM_DIINGINKAN = [
  "id", "title", "posisi", "company", "perusahaan", "location", "lokasi",
  "category", "kategori", "job_url", "job_url_direct", "link", "url",
  "employment_type", "work_arrangement", "tipe", "is_remote",
  "min_amount", "max_amount", "salary_min", "salary_max", "currency",
  "salary_currency", "interval", "gaji", "salary", "skills",
  "created_at", "date_posted", "posted_at", "site", "company_logo",
  "company_url", "company_url_direct", "company_industry", "job_level",
  "job_function", "experience_range",
];

export function daftarDb() {
  const e = process.env;
  const anon1 = e.SUPABASE_ANON_KEY || e.VITE_SUPABASE_ANON_KEY;
  const anon2 = e.SUPABASE_ANON_KEY_2 || e.VITE_SUPABASE_ANON_KEY_2;
  return [
    {
      id: "db1",
      url: (e.SUPABASE_URL || e.VITE_SUPABASE_URL || "").replace(/\/+$/, ""),
      // Kunci service role (opsional, rahasia server) memungkinkan tabel
      // jobs ditutup dari akses publik. Tanpa itu dipakai anon key.
      kunci: e.SUPABASE_SERVICE_ROLE_KEY || anon1,
      anon: anon1,
      tabel: e.VITE_SUPABASE_JOBS_TABLE || "jobs",
    },
    {
      id: "db2",
      url: (e.SUPABASE_URL_2 || e.VITE_SUPABASE_URL_2 || "").replace(/\/+$/, ""),
      kunci: e.SUPABASE_SERVICE_ROLE_KEY_2 || anon2,
      anon: anon2,
      tabel: e.VITE_SUPABASE_JOBS_TABLE_2 || "jobs",
    },
  ].filter((d) => d.url && d.kunci);
}

/* ------------------------------------------------------------ REST */

export function qs(params) {
  return params
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function rest(db, path, { hitung = false, hanyaHitung = false, kunci, metode, body } = {}) {
  const k = kunci || db.kunci;
  const headers = { apikey: db.anon || k, Authorization: `Bearer ${k}` };
  if (hitung || hanyaHitung) headers.Prefer = "count=exact";
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${db.url}/rest/v1/${path}`, {
    method: metode || (hanyaHitung ? "HEAD" : "GET"),
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const teks = hanyaHitung ? "" : await res.text().catch(() => "");
    const err = new Error(`[${db.id}] ${res.status} ${teks.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  let total = null;
  if (hitung || hanyaHitung) {
    const cr = res.headers.get("content-range") || "";
    const n = Number(cr.split("/")[1]);
    total = Number.isFinite(n) ? n : null;
  }
  const data = hanyaHitung ? null : await res.json();
  return { data, total };
}

/* ------------------------------------------------- skema per project */

const skemaCache = new Map();

/** Kolom yang benar-benar ada di tabel, dibaca dari satu baris contoh. */
export async function skema(db) {
  const c = skemaCache.get(db.id);
  if (c && Date.now() - c.waktu < 60 * 60 * 1000) return c.nilai;
  const { data } = await rest(db, `${db.tabel}?${qs([["select", "*"], ["limit", "1"]])}`);
  const ada = new Set(Object.keys(data?.[0] || {}));
  const pilih = (...k) => k.find((x) => ada.has(x)) || null;
  const nilai = {
    ada,
    kolom: ada.size ? KOLOM_DIINGINKAN.filter((k) => ada.has(k)).join(",") : "*",
    tgl: pilih("created_at", "date_posted", "posted_at"),
    judul: pilih("title", "posisi"),
    pt: pilih("company", "perusahaan"),
    lok: pilih("location", "lokasi"),
    kat: pilih("category", "kategori"),
    gmin: pilih("min_amount", "salary_min"),
    gmax: pilih("max_amount", "salary_max"),
    uang: pilih("currency", "salary_currency"),
  };
  skemaCache.set(db.id, { nilai, waktu: Date.now() });
  return nilai;
}

/* --------------------------------------------------------- filter */

// Nilai di dalam or()/and() PostgREST tidak boleh mengandung , . : ( ) "
const bersih = (t) =>
  String(t || "")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}+#\- ]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);

export function kataDari(q) {
  return bersih(q)
    .toLowerCase()
    .split(" ")
    .filter((k) => k.length >= 2)
    .slice(0, 6);
}

/**
 * Susun parameter filter PostgREST dari permintaan.
 * f: { q, kota, lokasi, tipe, sumber, gaji, asing, kata, ids, sejak }
 */
export function susunFilter(sk, f, agregator) {
  const p = [];
  const dan = []; // kelompok or(...) yang semuanya wajib terpenuhi

  const kolomCari = [sk.judul, sk.pt, sk.lok, sk.kat, sk.ada.has("job_level") && "job_level", sk.ada.has("job_function") && "job_function"].filter(Boolean);
  for (const w of kataDari(f.q)) {
    dan.push(`or(${kolomCari.map((c) => `${c}.ilike.*${w}*`).join(",")})`);
  }

  // Pencocokan profil: cukup SALAH SATU kata kunci muncul di judul/kategori
  if (f.kata?.length) {
    const kol = [sk.judul, sk.kat].filter(Boolean);
    const isi = f.kata
      .map(bersih)
      .filter((k) => k.length >= 2)
      .slice(0, 24)
      .flatMap((k) => kol.map((c) => `${c}.ilike.*${k}*`));
    if (isi.length) dan.push(`or(${isi.join(",")})`);
  }

  if (f.kota && sk.lok) p.push([sk.lok, `ilike.*${bersih(f.kota)}*`]);

  if (f.lokasi) {
    if (sk.ada.has("work_arrangement")) p.push(["work_arrangement", `eq.${bersih(f.lokasi)}`]);
    else if (f.lokasi === "remote" && sk.ada.has("is_remote")) p.push(["is_remote", "is.true"]);
    else p.push(["id", "eq.-1"]); // kolomnya tidak ada → tidak ada yang cocok
  }
  if (f.remoteHybrid && sk.ada.has("work_arrangement")) p.push(["work_arrangement", "in.(remote,hybrid)"]);

  if (f.tipe) {
    if (sk.ada.has("employment_type")) p.push(["employment_type", `eq.${bersih(f.tipe)}`]);
    else p.push(["id", "eq.-1"]);
  }

  if (f.sumber && sk.ada.has("site")) {
    if (f.sumber === "_langsung") p.push(["site", `not.in.(${agregator.join(",")})`]);
    else p.push(["site", `eq.${bersih(f.sumber).replace(/ /g, "_")}`]);
  }

  if (f.gaji && sk.gmin && sk.gmax) dan.push(`or(${sk.gmin}.not.is.null,${sk.gmax}.not.is.null)`);
  if (f.asing && sk.uang) {
    p.push([sk.uang, "not.is.null"]);
    p.push([sk.uang, "neq.IDR"]);
  }

  if (f.ids?.length) p.push(["id", `in.(${f.ids.map((x) => String(x).replace(/[^\w-]/g, "")).join(",")})`]);

  // Batas loker gratis: hanya yang lebih baru dari titik potong
  if (f.sejak && sk.tgl) p.push([sk.tgl, `gte.${f.sejak}`]);
  if (f.sebelum && sk.tgl) p.push([sk.tgl, `lt.${f.sebelum}`]);
  if (f.mulai && sk.tgl) p.push([sk.tgl, `gte.${f.mulai}`]);

  if (dan.length) p.push(["and", `(${dan.join(",")})`]);
  return p;
}

export function urutan(sk, urut) {
  if (urut === "gaji" && sk.gmax) return `${sk.gmax}.desc.nullslast,${sk.gmin}.desc.nullslast,id.desc`;
  return sk.tgl ? `${sk.tgl}.desc.nullslast,id.desc` : "id.desc";
}

/* ---------------------------------------------- batas 5.000 gratis */

export const BATAS_GRATIS = 5000;
let potongCache = null; // { nilai, totalSemua, waktu }

/**
 * Titik potong waktu: loker ke-5.000 paling baru dari gabungan semua
 * project. Loker yang lebih baru atau sama dengan titik ini = gratis.
 * Hanya kolom tanggal yang diambil (±35 byte per baris), dan hasilnya
 * disimpan di memori fungsi selama 10 menit.
 */
export async function titikPotong() {
  if (potongCache && Date.now() - potongCache.waktu < 10 * 60 * 1000) return potongCache;
  const semua = [];
  let totalSemua = 0;
  for (const db of daftarDb()) {
   try {
    const sk = await skema(db);
    if (!sk.tgl) continue;
    const { total } = await rest(db, `${db.tabel}?${qs([["select", "id"]])}`, { hanyaHitung: true });
    totalSemua += total || 0;
    const halaman = Math.ceil(Math.min(total || 0, BATAS_GRATIS) / 1000);
    const hasil = await Promise.all(
      Array.from({ length: halaman }, (_, i) =>
        rest(
          db,
          `${db.tabel}?${qs([
            ["select", sk.tgl],
            [sk.tgl, "not.is.null"],
            ["order", `${sk.tgl}.desc`],
            ["limit", "1000"],
            ["offset", String(i * 1000)],
          ])}`,
        ),
      ),
    );
    hasil.forEach(({ data }) => data.forEach((r) => semua.push(String(r[sk.tgl]))));
   } catch (e) {
    console.warn("[api/loker] titik potong", db.id, e.message);
   }
  }
  semua.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  const nilai = totalSemua > BATAS_GRATIS && semua.length >= BATAS_GRATIS ? semua[BATAS_GRATIS - 1] : null;
  potongCache = { nilai, totalSemua, waktu: Date.now() };
  return potongCache;
}

/* -------------------------------------------------- cek langganan */

const aksesCache = new Map(); // jwt → { aktif, waktu }

/** true kalau pemilik token punya paket berbayar yang masih aktif. */
export async function punyaAksesPenuh(req) {
  const auth = req.headers?.authorization || req.headers?.Authorization || "";
  const jwt = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!jwt || jwt.split(".").length !== 3) return false;
  const c = aksesCache.get(jwt);
  if (c && Date.now() - c.waktu < 5 * 60 * 1000) return c.aktif;
  const db = daftarDb()[0];
  if (!db) return false;
  let aktif = false;
  try {
    const { data } = await rest(db, "rpc/cek_langganan", { kunci: jwt, metode: "POST", body: {} });
    const b = Array.isArray(data) ? data[0] : data;
    aktif = Boolean(b?.aktif);
  } catch {
    aktif = false;
  }
  if (aksesCache.size > 2000) aksesCache.clear();
  aksesCache.set(jwt, { aktif, waktu: Date.now() });
  return aktif;
}

/* ------------------------------------------------------------ kurs */

let kursCache = null;
export async function kurs() {
  if (kursCache && Date.now() - kursCache.waktu < 12 * 60 * 60 * 1000) return kursCache.rates;
  try {
    const r = await fetch("https://open.er-api.com/v6/latest/USD");
    const d = await r.json();
    if (d?.rates?.IDR) {
      kursCache = { rates: d.rates, waktu: Date.now() };
      return d.rates;
    }
  } catch {
    /* pakai cadangan */
  }
  return { USD: 1, IDR: 17890 };
}

export function idrPer(kode, rates) {
  const k = String(kode || "").toUpperCase();
  if (!k || k === "IDR") return 1;
  const idr = rates?.IDR;
  const per = rates?.[k];
  if (!idr || !per) return null;
  return idr / per;
}

/* ------------------------------------------------------- batasi paralel */

export async function paralel(tugas, maks = 8) {
  const hasil = new Array(tugas.length);
  let i = 0;
  const pekerja = Array.from({ length: Math.min(maks, tugas.length) }, async () => {
    while (i < tugas.length) {
      const j = i++;
      try {
        hasil[j] = await tugas[j]();
      } catch (e) {
        hasil[j] = { galat: e };
      }
    }
  });
  await Promise.all(pekerja);
  return hasil;
}
