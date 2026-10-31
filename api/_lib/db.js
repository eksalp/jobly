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

import { KATA_CARI_ABAIKAN, padananKata } from "../../src/data/sinonimCari.js";
import { cariNegara } from "../../src/data/negara.js";
import { cariBidang } from "../../src/data/bidang.js";
import { SITUS_BUMN } from "../../src/data/bumn.js";

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

/**
 * Project kedua berisi campuran loker dan kerja freelance/sampingan
 * (sebagian dengan tautan afiliasi). Isinya hanya ditampilkan di halaman
 * Freelance, tidak ikut daftar loker umum, pencarian, maupun statistik.
 */
export const DB_FREELANCE = "db2";

/** Project untuk daftar loker umum (tanpa project freelance). */
export function dbUmum() {
  return daftarDb().filter((d) => d.id !== DB_FREELANCE);
}

/** Pilih project: "db2" → hanya itu; kosong → project umum. */
export function pilihDb(id) {
  if (id) return daftarDb().filter((d) => d.id === id);
  return dbUmum();
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
  const semua = bersih(q)
    .toLowerCase()
    .split(" ")
    .filter((k) => k.length >= 2);
  // "loker admin di jakarta" → "admin jakarta". Bila semuanya kata umum
  // (mis. hanya "loker"), pencarian tidak menyaring apa pun.
  return semua.filter((k) => !KATA_CARI_ABAIKAN.has(k)).slice(0, 6);
}

/** Nilai di dalam or() yang memuat , ( ) harus diberi tanda kutip. */
const kutip = (v) => (/[,()]/.test(v) ? `"${v}"` : v);

/**
 * Pola ILIKE untuk satu istilah.
 * Kata pendek (≤3 huruf, mis. "it", "hr", "qa", "sql") harus berdiri
 * sendiri sebagai kata — kalau tidak, "it" ikut cocok dengan "digital",
 * "security", "ritel", dan hampir semua judul lain.
 */
export function polaKata(istilah) {
  const w = String(istilah || "").toLowerCase().trim();
  if (!w) return [];
  if (w.length > 3 || w.includes(" ")) return [`*${w}*`];
  return [w, `${w} *`, `* ${w}`, `* ${w} *`, `${w}/*`, `* ${w}/*`, `*/${w}`, `*/${w} *`, `*/${w}/*`, `${w}-*`, `* ${w}-*`];
}

const ilikeSemua = (kolom, istilah) =>
  polaKata(istilah).flatMap((pola) => kolom.map((c) => `${c}.ilike.${kutip(pola)}`));

/**
 * Susun parameter filter PostgREST dari permintaan.
 * f: { q, pt, negara, bidang, bumn, kota, lokasi, tipe, sumber, gaji, asing, kata, ids, gratisFilter }
 */
export function susunFilter(sk, f, agregator) {
  const p = [];
  const dan = []; // kelompok or(...) yang semuanya wajib terpenuhi

  const fungsi = sk.ada.has("job_function") && "job_function";
  const kolomCari = [sk.judul, sk.pt, sk.lok, sk.kat, sk.ada.has("job_level") && "job_level", fungsi].filter(Boolean);
  // Padanan kata hanya dicari di kolom yang menggambarkan posisi, bukan
  // di nama perusahaan atau lokasi.
  const kolomPosisi = [sk.judul, sk.kat, fungsi].filter(Boolean);
  for (const w of kataDari(f.q)) {
    const isi = ilikeSemua(kolomCari, w);
    for (const lain of padananKata(w)) {
      if (lain !== w) isi.push(...ilikeSemua(kolomPosisi, lain));
    }
    dan.push(`or(${isi.join(",")})`);
  }

  // Pencocokan profil: cukup SALAH SATU kata kunci muncul di judul/kategori
  if (f.kata?.length) {
    const kol = [sk.judul, sk.kat].filter(Boolean);
    const isi = f.kata
      .map((k) => bersih(k).toLowerCase())
      .filter((k) => k.length >= 2)
      .slice(0, 24)
      .flatMap((k) => ilikeSemua(kol, k));
    if (isi.length) dan.push(`or(${isi.join(",")})`);
  }

  // Nama perusahaan
  if (f.pt && sk.pt) {
    const pt = bersih(f.pt);
    if (pt) p.push([sk.pt, `ilike.*${pt}*`]);
  }

  // Bidang kerja: kategori dari bot, atau kata kunci di judul
  if (f.bidang) {
    const b = cariBidang(f.bidang);
    if (b && sk.judul) {
      const isi = b.kata.flatMap((k) => ilikeSemua([sk.judul], k));
      if (sk.kat && b.kategori.length) isi.push(`${sk.kat}.in.(${b.kategori.join(",")})`);
      dan.push(`or(${isi.join(",")})`);
    } else p.push(["id", "eq.-1"]);
  }

  // BUMN: hanya loker hasil scraper khusus BUMN (kolom site, terindeks → cepat)
  if (f.bumn) {
    if (sk.ada.has("site")) p.push(["site", `in.(${SITUS_BUMN.join(",")})`]);
    else p.push(["id", "eq.-1"]);
  }

  // Negara: dikenali dari teks lokasi (lihat src/data/negara.js)
  if (f.negara) {
    const n = cariNegara(f.negara);
    if (n && sk.lok) dan.push(`or(${n.pola.map((pola) => `${sk.lok}.ilike.${kutip(pola)}`).join(",")})`);
    else p.push(["id", "eq.-1"]);
  }

  if (f.kota && sk.lok) p.push([sk.lok, `ilike.*${bersih(f.kota)}*`]);

  if (f.lokasi) {
    if (sk.ada.has("work_arrangement")) p.push(["work_arrangement", `eq.${bersih(f.lokasi)}`]);
    else if (f.lokasi === "remote" && sk.ada.has("is_remote")) p.push(["is_remote", "is.true"]);
    else p.push(["id", "eq.-1"]); // kolomnya tidak ada → tidak ada yang cocok
  }
  if (f.remoteHybrid && sk.ada.has("work_arrangement")) p.push(["work_arrangement", "in.(remote,hybrid)"]);

  if (f.tipe) {
    // Tabel papan-loker menyimpan tipe kerja di kolom `tipe`; nilainya bisa
    // berhuruf besar ("Freelance"), jadi dicocokkan tanpa peka huruf.
    const t = bersih(f.tipe);
    const kol = [sk.ada.has("employment_type") && "employment_type", sk.ada.has("tipe") && "tipe"].filter(Boolean);
    if (kol.length) dan.push(`or(${kol.map((k) => `${k}.ilike.${kutip(`*${t}*`)}`).join(",")})`);
    else p.push(["id", "eq.-1"]);
  }

  // Magang: tipe kerja magang, atau judulnya menyebut magang/intern
  if (f.magang) {
    const isi = [];
    if (sk.ada.has("employment_type")) isi.push("employment_type.ilike.*magang*", "employment_type.ilike.*intern*");
    if (sk.ada.has("tipe")) isi.push("tipe.ilike.*magang*", "tipe.ilike.*intern*");
    // "intern" harus berdiri sendiri supaya "international"/"internal" tidak ikut
    if (sk.judul)
      isi.push(
        `${sk.judul}.ilike.*magang*`,
        `${sk.judul}.ilike.*internship*`,
        ...["intern", "intern *", "* intern", "* intern *", "*(intern)*", "*intern)*", "*intern -*", "*intern/*"].map((x) => `${sk.judul}.ilike.${kutip(x)}`),
      );
    if (sk.ada.has("site")) isi.push("site.eq.maganghub");
    dan.push(`or(${isi.join(",")})`);
  }
  if (f.kecuali && sk.ada.has("site")) {
    dan.push(`or(site.is.null,site.neq.${bersih(f.kecuali).replace(/ /g, "_")})`);
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

  // Batas loker gratis: hanya loker yang masuk jatah per sumber
  if (f.gratisFilter) {
    if (f.gratisFilter.startsWith("or(")) dan.push(f.gratisFilter);
    else p.push(["id", "eq.-1"]);
  }
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
let potongCache = null;

/**
 * Sejak Oktober 2026 SEMUA loker terbuka untuk semua pengguna, termasuk
 * yang belum masuk. Paket berbayar kini menjual fitur (latihan praktik
 * dan kuota AI), bukan akses loker. Set ke false untuk menghidupkan lagi
 * batas 5.000 loker gratis.
 */
export const SEMUA_LOKER_GRATIS = true;

/**
 * Jatah 5.000 loker gratis dibagi rata ke SETIAP SUMBER (LinkedIn, Indeed,
 * BCA, Pertamina, …), supaya pengguna gratis tetap melihat perwakilan dari
 * semua situs — bukan hanya sumber yang paling banyak lokernya.
 *
 * Cara membagi ("isi air"): tiap sumber mendapat bagian yang sama. Sumber
 * yang lokernya lebih sedikit dari bagiannya diambil semua, dan sisanya
 * dibagikan lagi ke sumber lain. Dari tiap sumber yang diambil adalah
 * loker TERBARU-nya.
 *
 * Hasilnya per project & per sumber berupa titik potong waktu:
 *   { db1: { linkedin: "2026-10-01T…", bca: null, … } }
 * null = seluruh loker sumber itu gratis.
 *
 * Biayanya kecil: hitungan per sumber (HEAD, tanpa isi) dan satu baris
 * tanggal per sumber, disimpan di memori fungsi selama 10 menit.
 */
export async function titikPotong() {
  if (SEMUA_LOKER_GRATIS) return { aktif: false, totalSemua: 0, gratis: 0, perDb: {}, waktu: Date.now() };
  if (potongCache && Date.now() - potongCache.waktu < 10 * 60 * 1000) return potongCache;
  const { SUMBER_DIKENAL } = await import("../../src/data/kota.js");

  // 1. Hitung jumlah loker per (project, sumber)
  const grup = []; // { db, sk, site, n }
  let totalSemua = 0;
  for (const db of daftarDb()) {
    try {
      const sk = await skema(db);
      if (!sk.tgl) continue;
      const hitung = async (filter) =>
        (await rest(db, `${db.tabel}?${qs([["select", "id"], ...filter])}`, { hanyaHitung: true })).total || 0;

      if (!sk.ada.has("site")) {
        const n = await hitung([]);
        totalSemua += n;
        grup.push({ db, sk, site: "_semua", n });
        continue;
      }

      // Sumber yang dikenal + sumber baru yang belum ada di daftar
      const dikenal = new Set(SUMBER_DIKENAL);
      const sisaLain = await hitung([["site", `not.in.(${[...dikenal].join(",")})`]]);
      if (sisaLain > 0) {
        const { data } = await rest(
          db,
          `${db.tabel}?${qs([["select", "site"], ["site", `not.in.(${[...dikenal].join(",")})`], ["limit", "1000"]])}`,
        );
        (data || []).forEach((r) => r.site && dikenal.add(String(r.site)));
      }
      const situs = [...dikenal];
      const jumlah = await paralel(situs.map((x) => () => hitung([["site", `eq.${x}`]])), 6);
      situs.forEach((x, i) => {
        const n = typeof jumlah[i] === "number" ? jumlah[i] : 0;
        if (n > 0) grup.push({ db, sk, site: x, n });
      });
      const tanpaSitus = await hitung([["site", "is.null"]]);
      if (tanpaSitus > 0) grup.push({ db, sk, site: "_null", n: tanpaSitus });
      totalSemua += grup.filter((g) => g.db === db).reduce((t, g) => t + g.n, 0);
    } catch (e) {
      console.warn("[api/loker] titik potong", db.id, e.message);
    }
  }

  if (totalSemua <= BATAS_GRATIS) {
    potongCache = { aktif: false, totalSemua, gratis: totalSemua, perDb: {}, waktu: Date.now() };
    return potongCache;
  }

  // 2. Bagi jatah: mulai dari sumber terkecil
  const urut = [...grup].sort((a, b) => a.n - b.n);
  let sisa = BATAS_GRATIS;
  urut.forEach((g, i) => {
    const bagian = Math.floor(sisa / (urut.length - i));
    g.jatah = Math.min(g.n, bagian);
    sisa -= g.jatah;
  });

  // 3. Titik potong untuk sumber yang tidak diambil semuanya
  const perDb = {};
  await paralel(
    grup.map((g) => async () => {
      perDb[g.db.id] = perDb[g.db.id] || {};
      if (g.jatah >= g.n) {
        perDb[g.db.id][g.site] = null;
        return;
      }
      if (g.jatah <= 0) return; // sumber ini tidak mendapat jatah
      const filterSitus = g.site === "_semua" ? [] : g.site === "_null" ? [["site", "is.null"]] : [["site", `eq.${g.site}`]];
      const { data } = await rest(
        g.db,
        `${g.db.tabel}?${qs([
          ["select", g.sk.tgl],
          ...filterSitus,
          [g.sk.tgl, "not.is.null"],
          ["order", `${g.sk.tgl}.desc`],
          ["offset", String(g.jatah - 1)],
          ["limit", "1"],
        ])}`,
      );
      const t = data?.[0]?.[g.sk.tgl];
      if (t) perDb[g.db.id][g.site] = String(t);
    }),
    6,
  );

  const gratis = grup.reduce((t, g) => t + (g.jatah || 0), 0);
  potongCache = { aktif: true, totalSemua, gratis, perDb, waktu: Date.now() };
  return potongCache;
}

/** Filter PostgREST: hanya loker yang masuk jatah gratis di project ini. */
export function filterGratis(potong, db, sk) {
  if (!potong?.aktif) return null;
  const peta = potong.perDb[db.id] || {};
  const q = (v) => `"${v}"`; // nilai tanggal mengandung ":" → wajib dikutip
  const syarat = Object.entries(peta).map(([site, t]) => {
    if (site === "_semua") return t ? `${sk.tgl}.gte.${q(t)}` : `id.gte.0`;
    const s = site === "_null" ? "site.is.null" : `site.eq.${site}`;
    return t ? `and(${s},${sk.tgl}.gte.${q(t)})` : s;
  });
  return syarat.length ? `or(${syarat.join(",")})` : "id.eq.-1";
}

/** Apakah satu baris termasuk jatah gratis. */
export function barisGratis(potong, db, sk, row) {
  if (!potong?.aktif) return true;
  const peta = potong.perDb[db.id] || {};
  const kunci = sk.ada.has("site") ? (row.site == null ? "_null" : String(row.site)) : "_semua";
  if (!(kunci in peta)) return false;
  const t = peta[kunci];
  return t === null || String(row[sk.tgl] ?? "") >= t;
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
