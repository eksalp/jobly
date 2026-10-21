/**
 * GET /api/loker?aksi=…  — satu pintu data loker untuk seluruh aplikasi.
 *
 *   daftar    24 loker per halaman, sudah difilter & diurutkan di database
 *   statistik angka beranda: total, baru, per kota, per sumber, contoh loker
 *   detail    satu loker lengkap (termasuk deskripsi)
 *   gaji      Peta Gaji yang sudah dihitung (per bidang/kota/cara kerja)
 *   kandidat  loker yang mengandung kata kunci profil (untuk "Cocok untukku")
 *   id        beberapa loker berdasarkan id (loker tersimpan)
 *
 * Jawaban untuk pengunjung & akun gratis di-cache di CDN Vercel, jadi
 * Supabase hanya ditanya sekali per URL per beberapa menit, berapa pun
 * jumlah pengunjungnya. Jawaban untuk pelanggan (akses=penuh) tidak
 * di-cache karena berbeda per orang.
 */
import {
  daftarDb,
  rest,
  qs,
  skema,
  susunFilter,
  urutan,
  titikPotong,
  filterGratis,
  barisGratis,
  punyaAksesPenuh,
  kurs,
  idrPer,
  paralel,
  BATAS_GRATIS,
} from "./_lib/db.js";
import { KOTA_POPULER, SUMBER_DIKENAL, SUMBER_AGREGATOR } from "../src/data/kota.js";
import { mapSupabaseJob } from "../src/utils/petaLoker.js";
import { DAFTAR_NEGARA } from "../src/data/negara.js";
import { BIDANG } from "../src/data/bidang.js";
import { hitungPetaGaji, gajiPosisi } from "../src/utils/petaGaji.js";

const MAKS_HALAMAN = 48;

function kirim(res, status, body, cache) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cache || "private, no-store");
  res.end(JSON.stringify(body));
}

/** s-maxage = lama disimpan CDN; swr = boleh disajikan basi sambil diperbarui. */
const publik = (detik, swr = detik * 6) =>
  `public, max-age=0, s-maxage=${detik}, stale-while-revalidate=${swr}`;

const bool = (v) => v === "1" || v === "true";

/** Kunci urut seragam lintas project: tanggal (ISO) atau gaji. */
function kunciUrut(sk, row, urut) {
  if (urut === "gaji") return Number(row[sk.gmax] ?? row[sk.gmin] ?? -1);
  return String(row[sk.tgl] ?? "");
}

/* ---------------------------------------------------------------- daftar */

async function aksiDaftar(p, penuh) {
  const dbs = daftarDb();
  const n = Math.min(MAKS_HALAMAN, Math.max(1, Number(p.get("n")) || 24));
  const urut = p.get("urut") === "gaji" ? "gaji" : "terbaru";
  const kursor = (p.get("c") || "").split(",").map((x) => Math.max(0, Number(x) || 0));
  const halamanPertama = kursor.every((x) => !x);
  const potong = penuh ? { aktif: false } : await titikPotong();

  const f = {
    q: p.get("q"),
    pt: p.get("pt"),
    negara: p.get("negara"),
    bidang: p.get("bidang"),
    bumn: bool(p.get("bumn")),
    kota: p.get("kota"),
    lokasi: p.get("lokasi"),
    tipe: p.get("tipe"),
    sumber: p.get("sumber"),
    gaji: bool(p.get("gaji")),
    asing: bool(p.get("asing")),
    remoteHybrid: bool(p.get("rh")),
  };
  const terbatas = Boolean(potong.aktif);

  const perDb = await Promise.all(
    dbs.map(async (db, i) => {
     try {
      const sk = await skema(db);
      const filter = susunFilter(sk, { ...f, gratisFilter: filterGratis(potong, db, sk) }, SUMBER_AGREGATOR);
      const { data, total } = await rest(
        db,
        `${db.tabel}?${qs([
          ["select", sk.kolom],
          ...filter,
          ["order", urutan(sk, urut)],
          ["limit", String(n)],
          ["offset", String(kursor[i] || 0)],
        ])}`,
        { hitung: halamanPertama },
      );
      // Berapa yang tersembunyi karena batas gratis (hanya di halaman pertama)
      let tanpaBatas = null;
      if (halamanPertama && terbatas) {
        const r = await rest(
          db,
          `${db.tabel}?${qs([["select", "id"], ...susunFilter(sk, f, SUMBER_AGREGATOR)])}`,
          { hanyaHitung: true },
        );
        tanpaBatas = r.total;
      }
      return { db, sk, data: data || [], total, tanpaBatas, mulai: kursor[i] || 0 };
     } catch (e) {
      // Satu project bermasalah tidak boleh membuat seluruh daftar kosong
      console.warn("[api/loker] daftar", db.id, e.message);
      return { db, sk: { tgl: null }, data: [], total: 0, tanpaBatas: 0, mulai: kursor[i] || 0 };
     }
    }),
  );
  if (perDb.every((x) => !x.data.length && x.total === 0 && x.sk.tgl === null)) {
    throw new Error("Semua sumber data gagal dimuat.");
  }

  // Gabungkan hasil semua project lalu ambil n teratas
  const calon = perDb.flatMap((x, i) =>
    x.data.map((row) => ({ i, row, k: kunciUrut(x.sk, row, urut) })),
  );
  calon.sort((a, b) => (a.k < b.k ? 1 : a.k > b.k ? -1 : 0));
  const dipakai = calon.slice(0, n);
  const terpakai = perDb.map((_, i) => dipakai.filter((x) => x.i === i).length);
  const masihAda = perDb.some((x, i) => x.data.length === n || terpakai[i] < x.data.length);

  const hasil = {
    rows: dipakai.map(({ i, row }) => ({ ...row, _s: perDb[i].db.id })),
    kursor: masihAda ? perDb.map((x, i) => x.mulai + terpakai[i]).join(",") : null,
    penuh,
  };
  if (halamanPertama) {
    hasil.total = perDb.reduce((t, x) => t + (x.total || 0), 0);
    hasil.terkunci = terbatas
      ? Math.max(0, perDb.reduce((t, x) => t + (x.tanpaBatas || 0), 0) - hasil.total)
      : 0;
  }
  return hasil;
}

/* ------------------------------------------------------------- statistik */

async function aksiStatistik() {
  const dbs = daftarDb();
  const potong = await titikPotong();
  const kini = Date.now();
  const iso = (hari) => new Date(kini - hari * 86400000).toISOString();

  const hitung = (fBuat) =>
    paralel(
      dbs.map((db) => async () => {
        const sk = await skema(db);
        const { total } = await rest(
          db,
          `${db.tabel}?${qs([["select", "id"], ...susunFilter(sk, fBuat(sk), SUMBER_AGREGATOR)])}`,
          { hanyaHitung: true },
        );
        return total || 0;
      }),
    ).then((r) => r.reduce((t, x) => t + (typeof x === "number" ? x : 0), 0));

  const ambil = async (f, n) => {
    const per = await Promise.all(
      dbs.map(async (db) => {
        const sk = await skema(db);
        const { data } = await rest(
          db,
          `${db.tabel}?${qs([["select", sk.kolom], ...susunFilter(sk, f, SUMBER_AGREGATOR), ["order", urutan(sk)], ["limit", String(n)]])}`,
        );
        return (data || []).map((row) => ({ row: { ...row, _s: db.id }, k: kunciUrut(sk, row) }));
      }).map((p) => p.catch(() => [])),
    );
    return per
      .flat()
      .sort((a, b) => (a.k < b.k ? 1 : a.k > b.k ? -1 : 0))
      .slice(0, n)
      .map((x) => x.row);
  };

  const [total, baru7, baru2, remote, remoteAsing, terbaru, contohRemote, freelance, contohFreelance, bumn, contohBumn] = await Promise.all([
    hitung(() => ({})),
    hitung(() => ({ mulai: iso(7) })),
    hitung(() => ({ mulai: iso(2) })),
    hitung(() => ({ lokasi: "remote" })),
    hitung(() => ({ lokasi: "remote", asing: true })),
    ambil({}, 8),
    ambil({ lokasi: "remote" }, 4),
    hitung(() => ({ tipe: "freelance" })),
    ambil({ tipe: "freelance" }, 4),
    hitung(() => ({ bumn: true })),
    ambil({ bumn: true }, 4),
  ]);

  const bidang = {};
  const hasilBidang = await paralel(BIDANG.map((b) => () => hitung(() => ({ bidang: b.slug }))), 4);
  BIDANG.forEach((b, i) => {
    const jml = typeof hasilBidang[i] === "number" ? hasilBidang[i] : 0;
    if (jml) bidang[b.slug] = jml;
  });

  const kota = {};
  const hasilKota = await paralel(KOTA_POPULER.map((k) => () => hitung(() => ({ kota: k }))), 4);
  KOTA_POPULER.forEach((k, i) => (kota[k] = typeof hasilKota[i] === "number" ? hasilKota[i] : 0));

  const negara = {};
  const hasilNegara = await paralel(DAFTAR_NEGARA.map((n) => () => hitung(() => ({ negara: n.kode }))), 4);
  DAFTAR_NEGARA.forEach((n, i) => {
    const jml = typeof hasilNegara[i] === "number" ? hasilNegara[i] : 0;
    if (jml) negara[n.kode] = jml;
  });

  const sumber = {};
  const hasilSumber = await paralel(SUMBER_DIKENAL.map((s) => () => hitung(() => ({ sumber: s }))), 4);
  SUMBER_DIKENAL.forEach((s, i) => {
    const n = typeof hasilSumber[i] === "number" ? hasilSumber[i] : 0;
    if (n) sumber[s] = n;
  });

  return {
    total,
    gratis: potong.aktif ? potong.gratis : total,
    batasGratis: BATAS_GRATIS,
    baru7,
    baru2,
    remote,
    remoteAsing,
    kota,
    negara,
    sumber,
    terbaru,
    remoteContoh: contohRemote,
    freelance,
    freelanceContoh: contohFreelance,
    bumn,
    bumnContoh: contohBumn,
    bidang,
    diperbarui: new Date(kini).toISOString(),
  };
}

/* ---------------------------------------------------------------- detail */

function pecahId(id) {
  const [s, ...sisa] = String(id || "").split(":");
  return { sumber: s, rawId: sisa.join(":").replace(/[^\w-]/g, "") };
}

async function aksiDetail(p, penuh) {
  const { sumber, rawId } = pecahId(p.get("id"));
  const db = daftarDb().find((d) => d.id === sumber);
  if (!db || !rawId) return { row: null };
  const sk = await skema(db);
  const { data } = await rest(db, `${db.tabel}?${qs([["select", "*"], ["id", `eq.${rawId}`], ["limit", "1"]])}`);
  const row = data?.[0];
  if (!row) return { row: null };
  if (!penuh) {
    const potong = await titikPotong();
    if (!barisGratis(potong, db, sk, row)) {
      // Terkunci: kirim ringkasan saja, tanpa deskripsi & tautan lamar
      return {
        terkunci: true,
        row: {
          id: row.id,
          _s: db.id,
          title: row[sk.judul],
          company: row[sk.pt],
          location: row[sk.lok],
          company_logo: row.company_logo ?? null,
          site: row.site ?? null,
        },
      };
    }
  }
  return { row: { ...row, _s: db.id }, terkunci: false };
}

/* ------------------------------------------------------------------ gaji */

const KOLOM_GAJI = [
  "id", "title", "posisi", "company", "perusahaan", "category", "kategori",
  "location", "lokasi", "work_arrangement", "min_amount", "max_amount",
  "salary_min", "salary_max", "currency", "salary_currency", "interval",
  "skills", "created_at", "date_posted",
];

let gajiCache = null;
async function barisGaji() {
  if (gajiCache && Date.now() - gajiCache.waktu < 60 * 60 * 1000) return gajiCache.jobs;
  const jobs = [];
  for (const db of daftarDb()) {
    const sk = await skema(db);
    if (!sk.gmin && !sk.gmax) continue;
    const kolom = KOLOM_GAJI.filter((k) => sk.ada.has(k)).join(",");
    const halaman = await Promise.all(
      [0, 1, 2].map((i) =>
        rest(
          db,
          `${db.tabel}?${qs([
            ["select", kolom],
            ...susunFilter(sk, { gaji: true }, SUMBER_AGREGATOR),
            ["order", urutan(sk)],
            ["limit", "1000"],
            ["offset", String(i * 1000)],
          ])}`,
        ).catch(() => ({ data: [] })),
      ),
    );
    halaman.forEach(({ data }) => (data || []).forEach((r) => jobs.push(mapSupabaseJob(r, db.id))));
  }
  gajiCache = { jobs, waktu: Date.now() };
  return jobs;
}

async function aksiGaji(p) {
  const [jobs, rates] = await Promise.all([barisGaji(), kurs()]);
  const peta = hitungPetaGaji(jobs, { idrPerFn: idrPer, rates, daftarKota: KOTA_POPULER });
  const hasil = {
    total: peta.total,
    perBidang: peta.perBidang,
    perKota: peta.perKota,
    perCara: peta.perCara,
  };
  const q = (p.get("posisi") || "").trim();
  if (q.length >= 2) {
    const g = gajiPosisi(peta.baris, q);
    hasil.posisi = g && {
      ...g,
      contoh: (g.contoh || []).map(({ job, gaji }) => ({
        gaji,
        job: { id: job.id, posisi: job.posisi, perusahaan: job.perusahaan },
      })),
    };
  }
  return hasil;
}

/* -------------------------------------------------------------- kandidat */

async function aksiKandidat(p, penuh) {
  const kata = (p.get("kata") || "").split(",").map((x) => x.trim()).filter(Boolean).slice(0, 24);
  if (!kata.length) return { rows: [] };
  const n = Math.min(300, Math.max(20, Number(p.get("n")) || 200));
  const potong = penuh ? { aktif: false } : await titikPotong();
  const per = await Promise.all(
    daftarDb().map(async (db) => {
      const sk = await skema(db);
      const { data } = await rest(
        db,
        `${db.tabel}?${qs([
          ["select", sk.kolom],
          ...susunFilter(sk, { kata, gratisFilter: filterGratis(potong, db, sk) }, SUMBER_AGREGATOR),
          ["order", urutan(sk)],
          ["limit", String(n)],
        ])}`,
      );
      return (data || []).map((r) => ({ ...r, _s: db.id }));
    }).map((x) => x.catch(() => [])),
  );
  return { rows: per.flat() };
}

/* ------------------------------------------------------------------- id */

async function aksiId(p, penuh) {
  const daftar = (p.get("ids") || "").split(",").slice(0, 100).map(pecahId).filter((x) => x.rawId);
  const potong = penuh ? { aktif: false } : await titikPotong();
  const per = await Promise.all(
    daftarDb().map(async (db) => {
      const ids = daftar.filter((x) => x.sumber === db.id).map((x) => x.rawId);
      if (!ids.length) return [];
      const sk = await skema(db);
      const { data } = await rest(
        db,
        `${db.tabel}?${qs([["select", sk.kolom], ...susunFilter(sk, { ids }, SUMBER_AGREGATOR)])}`,
      );
      return (data || []).map((r) => ({
        ...r,
        _s: db.id,
        _kunci: !barisGratis(potong, db, sk, r),
      }));
    }).map((x) => x.catch(() => [])),
  );
  return { rows: per.flat() };
}

/* ---------------------------------------------------------------- handler */

export default async function handler(req, res) {
  const url = new URL(req.url, "http://lokal");
  const p = url.searchParams;
  const aksi = p.get("aksi") || "daftar";

  if (!daftarDb().length) {
    return kirim(res, 503, { error: "Supabase belum dikonfigurasi di server." });
  }

  try {
    // Pelanggan meminta akses=penuh dan mengirim token login. Jawabannya
    // berbeda per orang, jadi tidak boleh disimpan di CDN.
    const minta = p.get("akses") === "penuh";
    const penuh = minta ? await punyaAksesPenuh(req) : false;
    const cache = (detik) => (minta ? "private, no-store" : publik(detik));

    switch (aksi) {
      case "daftar":
        return kirim(res, 200, await aksiDaftar(p, penuh), cache(120));
      case "statistik":
        return kirim(res, 200, await aksiStatistik(), publik(900, 3600));
      case "detail": {
        const d = await aksiDetail(p, penuh);
        return kirim(res, d.row ? 200 : 404, d, cache(600));
      }
      case "gaji":
        return kirim(res, 200, await aksiGaji(p), publik(3600, 6 * 3600));
      case "kandidat":
        return kirim(res, 200, await aksiKandidat(p, penuh), cache(300));
      case "id":
        return kirim(res, 200, await aksiId(p, penuh), "private, no-store");
      default:
        return kirim(res, 400, { error: "aksi tidak dikenal" });
    }
  } catch (e) {
    console.error("[api/loker]", aksi, e?.message);
    return kirim(res, 502, { error: "Data loker sedang tidak bisa dimuat." }, "no-store");
  }
}
