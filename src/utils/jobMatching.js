import {
  supabase,
  SUPABASE_TABLE,
  supabase2,
  supabase2Configured,
  SUPABASE_TABLE_2,
} from "../lib/supabaseClient";
import { TAXONOMY } from "../data/taxonomy";
import { normalizeWord } from "../data/synonyms";

// lokasiKerja: baca langsung dari kolom `work_arrangement`.
// Nilai di DB sudah standar: "onsite" | "remote" | "hybrid" | null.
// Fallback ke kolom `tipe` (tabel papan-loker) kalau work_arrangement
// kosong dan tipe berisi salah satu nilai lokasi.
function readLokasiKerja(row) {
  const wa = (row.work_arrangement || "").toString().toLowerCase().trim();
  if (wa === "onsite" || wa === "remote" || wa === "hybrid") return wa;
  // Fallback: tabel papan-loker simpan lokasi di kolom `tipe`
  const tipe = (row.tipe || "").toString().toLowerCase().trim();
  if (tipe === "onsite" || tipe === "remote") return tipe;
  return null; // null = tidak diketahui, tidak akan match filter apapun
}

// tipeKerja: baca langsung dari kolom `employment_type`.
// Nilai di DB sudah standar: "full-time" | "kontrak" | "freelance" | "magang" | null.
// Fallback ke kolom `tipe` (tabel papan-loker) untuk nilai non-lokasi.
function readTipeKerja(row) {
  const et = (row.employment_type || "").toString().toLowerCase().trim();
  if (et) return et; // pakai apa adanya dari DB
  // Fallback: tabel papan-loker simpan tipe kerja di kolom `tipe`
  const tipe = (row.tipe || "").toString().toLowerCase().trim();
  const lokasiVals = ["onsite", "remote", "hybrid"];
  if (tipe && !lokasiVals.includes(tipe)) return tipe;
  return null;
}

// formatGaji: beberapa tabel loker pakai nama kolom beda buat rentang gaji
// (min_amount/max_amount vs salary_min/salary_max), jadi dicek dua-duanya.
// Kalau nggak ada rentang angka sama sekali, fallback ke kolom `gaji` yang
// udah berupa teks jadi (banyak tabel nyimpen ini langsung sebagai string).
function formatGaji(row) {
  const min = row.min_amount ?? row.salary_min;
  const max = row.max_amount ?? row.salary_max;
  const currency = row.currency || row.salary_currency;
  if (min && max) {
    return `${currency ? currency + " " : ""}${min}\u2013${max}${
      row.interval ? "/" + row.interval : ""
    }`;
  }
  return row.gaji || "Tidak disebutkan";
}

// Ubah baris hasil query Supabase jadi bentuk yang dipakai UI di sini.
// `source` dipakai buat bikin id gabungan yang aman kalau datanya digabung
// dari beberapa project Supabase sekaligus (dua tabel beda project bisa
// aja punya id mentah yang sama persis padahal itu loker yang berbeda).
export function mapSupabaseJob(row, source = "db1") {
  const lokasiKerja = readLokasiKerja(row); // null | "onsite" | "remote" | "hybrid"
  const tipeKerja = readTipeKerja(row); // null | "full-time" | "kontrak" | "freelance" | "magang"
  // Kolom `category` di database kamu udah berupa slug terklasifikasi
  // (mis. "finance-accounting") \u2014 pecah jadi kata biasa buat dipakai
  // di matching & ditampilkan ke user.
  const kategori = (row.category || row.kategori || "")
    .toString()
    .replace(/[-_]+/g, " ")
    .trim();
  return {
    id: `${source}:${row.id}`, // id gabungan, aman dipakai sebagai React key & buat saved_jobs
    rawId: row.id, // id asli dari tabel, kalau-kalau dibutuhkan
    source,
    posisi: row.title || row.posisi || "Tanpa judul",
    perusahaan: row.company || row.perusahaan || "Tidak disebutkan",
    lokasiKerja, // "onsite" | "remote" | "hybrid"
    tipeKerja, // "fulltime" | "contract" | "freelance" | "internship" | "parttime"
    tipe: lokasiKerja, // dipertahankan buat kode lama yang masih baca job.tipe
    kategori, // mis. "finance accounting", bisa kosong kalau kolom category/kategori null
    lokasi: row.location || row.lokasi || "Tidak disebutkan",
    gaji: formatGaji(row),
    link: row.job_url || row.job_url_direct || row.link || "#",
    deskripsi: row.description || row.deskripsi || "",
    // Kolom skill di database (array Postgres atau string dipisah koma).
    // Dipakai buat matching yang lebih presisi daripada cuma judul/deskripsi.
    skills: Array.isArray(row.skills)
      ? row.skills
      : typeof row.skills === "string"
        ? row.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
  };
}

// Supabase (PostgREST) membatasi 1000 baris per request lewat setelan
// db-max-rows. Nilai .limit() sebesar apa pun tetap dipotong di angka itu.
// Jadi datanya diambil bertahap pakai .range() sampai habis.
const UKURAN_HALAMAN = 1000;
const MAKS_HALAMAN = 30; // pengaman: berhenti di 30.000 baris

// Kedua project punya skema berbeda, dan menebak nama kolom terbukti
// keliru — daftar tetap ditolak keduanya. Jadi kolomnya ditanyakan
// langsung: ambil satu baris dengan "*", lihat kunci apa saja yang ada,
// lalu pakai irisannya dengan kolom yang benar-benar kita butuhkan.
//
// Kunci cache memakai `sumber`, bukan nama tabel — kedua project
// sama-sama memakai tabel bernama "jobs".
const strategiCache = new Map(); // sumber -> { kolom, urut }

// Kolom yang berguna kalau tersedia. Yang tidak ada di tabel dilewati.
const KOLOM_DIINGINKAN = [
  "id",
  "title",
  "posisi",
  "company",
  "perusahaan",
  "location",
  "lokasi",
  "category",
  "kategori",
  "job_url",
  "job_url_direct",
  "link",
  "url",
  "employment_type",
  "work_arrangement",
  "tipe",
  "is_remote",
  "min_amount",
  "max_amount",
  "salary_min",
  "salary_max",
  "currency",
  "salary_currency",
  "interval",
  "gaji",
  "salary",
  "skills",
  "created_at",
  "date_posted",
  "posted_at",
];

// Kolom besar yang sengaja TIDAK diambil meski ada — isinya panjang,
// tidak ditampilkan di UI, dan jadi bagian terbesar payload.
const KOLOM_DILEWATI = [
  "description",
  "deskripsi",
  "job_description",
  "raw",
  "html",
];

async function tentukanStrategi(client, tabel, sumber) {
  if (strategiCache.has(sumber)) return strategiCache.get(sumber);

  // Satu baris contoh untuk mengetahui kolom yang benar-benar ada
  const { data: contoh, error } = await client.from(tabel).select("*").limit(1);

  if (error || !contoh?.length) {
    console.warn(
      `[loker] ${sumber}: gagal membaca skema, memakai select("*").`,
      error?.message,
    );
    const strategi = { kolom: "*", urut: null };
    strategiCache.set(sumber, strategi);
    return strategi;
  }

  const kolomAda = new Set(Object.keys(contoh[0]));

  const dipakai = KOLOM_DIINGINKAN.filter((k) => kolomAda.has(k));
  const dilewati = KOLOM_DILEWATI.filter((k) => kolomAda.has(k));

  // Kalau ternyata tidak ada kolom besar yang perlu dihindari,
  // select("*") sama saja dan lebih tahan perubahan skema.
  const kolom =
    dilewati.length > 0 && dipakai.length > 0 ? dipakai.join(",") : "*";

  // Kolom pengurutan dipilih dari yang tersedia. Tanpa urutan, PostgREST
  // tidak menjamin konsistensi antar-halaman.
  const urut =
    ["created_at", "date_posted", "posted_at", "id"].find((k) =>
      kolomAda.has(k),
    ) ?? null;

  console.log(
    `[loker] ${sumber}: ${kolomAda.size} kolom terdeteksi, ` +
      `mengambil ${kolom === "*" ? "semua" : dipakai.length}, urut: ${urut ?? "tidak ada"}`,
  );

  const strategi = { kolom, urut };
  strategiCache.set(sumber, strategi);
  return strategi;
}

async function ambilHalaman(client, tabel, halaman, strategi) {
  const dari = halaman * UKURAN_HALAMAN;
  let q = client
    .from(tabel)
    .select(strategi.kolom)
    .range(dari, dari + UKURAN_HALAMAN - 1);

  if (strategi.urut) q = q.order(strategi.urut, { ascending: false });

  return q;
}

async function ambilSemuaBaris(client, tabel, sumber) {
  // Hitung dulu jumlah barisnya, supaya semua halaman bisa diambil
  // BERSAMAAN. Cara berurutan menunggu 10+ perjalanan bolak-balik,
  // dan itu penyebab utama layar "Memuat data loker" terasa lama.
  const { count, error: galatHitung } = await client
    .from(tabel)
    .select("*", { count: "exact", head: true });

  if (galatHitung) {
    throw new Error(galatHitung.message || "Supabase fetch gagal");
  }

  const jumlahHalaman = Math.min(
    MAKS_HALAMAN,
    Math.max(1, Math.ceil((count || 0) / UKURAN_HALAMAN)),
  );

  const strategi = await tentukanStrategi(client, tabel, sumber);

  // Halaman diambil berkelompok, bukan seluruhnya sekaligus. Menembak
  // belasan permintaan bersamaan kadang ditolak Supabase, dan kegagalan
  // seperti itu sulit dibedakan dari masalah skema.
  const SEKALIGUS = 4;
  const semua = [];

  for (let mulai = 0; mulai < jumlahHalaman; mulai += SEKALIGUS) {
    const kelompok = Array.from(
      { length: Math.min(SEKALIGUS, jumlahHalaman - mulai) },
      (_, i) => ambilHalaman(client, tabel, mulai + i, strategi),
    );

    const hasil = await Promise.all(kelompok);

    let adaIsi = false;
    hasil.forEach(({ data, error }, i) => {
      if (error) {
        // Satu halaman gagal tidak menggagalkan semuanya — lebih baik
        // menampilkan sebagian daripada layar kosong.
        console.warn(
          `[loker] ${sumber} halaman ${mulai + i + 1} gagal:`,
          error.message,
        );
        return;
      }
      if (data?.length) {
        semua.push(...data);
        adaIsi = true;
      }
    });

    // Kelompok yang sepenuhnya kosong menandakan data sudah habis,
    // biasanya karena `count` melaporkan lebih banyak dari yang ada.
    if (!adaIsi) break;
  }

  console.log(`[loker] ${sumber}: ${semua.length} dari ${count ?? "?"} baris`);
  return semua.map((row) => mapSupabaseJob(row, sumber));
}

export async function fetchJobsFromSupabase() {
  return ambilSemuaBaris(supabase, SUPABASE_TABLE, "db1");
}

// fetchJobsFromSupabase2: sama kayak di atas, tapi narik dari project
// Supabase kedua (client & tabel beda). Dipanggil cuma kalau env var
// VITE_SUPABASE_URL_2 / VITE_SUPABASE_ANON_KEY_2 udah diisi.
export async function fetchJobsFromSupabase2() {
  return ambilSemuaBaris(supabase2, SUPABASE_TABLE_2, "db2");
}

// fetchAllJobs: gabungin loker dari kedua project Supabase (kalau
// project kedua udah dikonfigurasi). Kalau salah satu gagal, yang lain
// tetap ditampilkan \u2014 jangan sampai satu sumber error bikin semuanya
// kosong.
export async function fetchAllJobs() {
  const tasks = [fetchJobsFromSupabase()];
  if (supabase2Configured) tasks.push(fetchJobsFromSupabase2());

  const results = await Promise.allSettled(tasks);
  const jobs = [];
  const errors = [];
  results.forEach((r) => {
    if (r.status === "fulfilled") jobs.push(...r.value);
    else errors.push(r.reason?.message || "Gagal memuat sebagian loker");
  });

  if (jobs.length === 0 && errors.length > 0) {
    throw new Error(errors.join("; "));
  }
  // Urutkan gabungan berdasarkan id (paling baru duluan sebisanya)
  return jobs;
}

// tokenize: pecah teks jadi kata-kata, lalu normalize tiap kata lewat kamus
// sinonim ID<->EN (data/synonyms.js). Jadi "insinyur" dan "engineer" bakal
// jadi token yang sama persis ("engineer") setelah lewat sini, sehingga CV
// berbahasa Indonesia tetap bisa match loker berbahasa Inggris (dan
// sebaliknya). Kata yang nggak ada di kamus dibiarkan apa adanya.
export function tokenize(text) {
  const raw = text.toLowerCase().match(/[a-z\u00e0-\u00ff]{3,}/g) || [];
  return raw.map(normalizeWord);
}

export function detectCategory(text) {
  const lower = text.toLowerCase();
  const scored = TAXONOMY.map((cat) => {
    const hits = cat.keywords.filter((k) => lower.includes(k));
    return { ...cat, score: hits.length, hits };
  }).sort((a, b) => b.score - a.score);
  return scored[0].score > 0
    ? scored[0]
    : { label: "Umum / belum terdeteksi spesifik", score: 0, hits: [] };
}

// GENERIC_TERMS: kata yang terlalu umum buat jadi sinyal kecocokan yang
// berarti kalau cuma nongol di judul/deskripsi loker \u2014 kata-kata ini
// muncul di hampir semua lowongan apa pun bidangnya, jadi kalau dihitung
// penuh bakal bikin loker yang sebenarnya nggak relevan ikut ke-lolosin
// (mis. "VP of Finance" muncul di daftar loker developer cuma gara-gara
// sama-sama nyebut kata "data").
const GENERIC_TERMS = new Set([
  // --- Basa-basi korporat: muncul di hampir semua deskripsi lowongan,
  // apa pun bidangnya. Ini penyebab utama loker tidak relevan ikut naik. ---
  "collaboration",
  "collaborate",
  "collaborative",
  "kolaborasi",
  "communication",
  "communications",
  "komunikasi",
  "opportunity",
  "opportunities",
  "kesempatan",
  "peluang",
  "relationship",
  "relationships",
  "hubungan",
  "implementation",
  "implement",
  "implementasi",
  "organizational",
  "organization",
  "organisasi",
  "documentation",
  "document",
  "documents",
  "dokumentasi",
  "dokumen",
  "comprehensive",
  "competitive",
  "competitively",
  "kompetitif",
  "sustainable",
  "sustainability",
  "berkelanjutan",
  "contribute",
  "contribution",
  "kontribusi",
  "interaction",
  "interactions",
  "interaksi",
  "responsibility",
  "responsibilities",
  "tanggung",
  "jawab",
  "requirement",
  "requirements",
  "persyaratan",
  "kualifikasi",
  "qualification",
  "experience",
  "experienced",
  "pengalaman",
  "berpengalaman",
  "environment",
  "environments",
  "lingkungan",
  "stakeholder",
  "stakeholders",
  "pemangku",
  "development",
  "develop",
  "pengembangan",
  "mengembangkan",
  "management",
  "manage",
  "managing",
  "manajemen",
  "mengelola",
  "support",
  "supporting",
  "dukungan",
  "mendukung",
  "improve",
  "improvement",
  "peningkatan",
  "meningkatkan",
  "ensure",
  "ensuring",
  "memastikan",
  "provide",
  "providing",
  "menyediakan",
  "strong",
  "excellent",
  "good",
  "great",
  "ability",
  "abilities",
  "knowledge",
  "skill",
  "skills",
  "keahlian",
  "kemampuan",
  "work",
  "working",
  "kerja",
  "bekerja",
  "job",
  "role",
  "peran",
  "candidate",
  "kandidat",
  "applicant",
  "pelamar",
  "benefit",
  "benefits",
  "tunjangan",
  "training",
  "pelatihan",
  "learning",
  "pembelajaran",
  "solution",
  "solutions",
  "solusi",
  "process",
  "processes",
  "proses",
  "report",
  "reports",
  "reporting",
  "laporan",
  "melaporkan",
  "analysis",
  "analyze",
  "analisis",
  "menganalisis",
  "quality",
  "kualitas",
  "standard",
  "standards",
  "standar",
  "performance",
  "kinerja",
  "target",
  "goals",
  "tujuan",
  "internal",
  "external",
  "eksternal",
  "global",
  "regional",
  "local",
  "lokal",
  "senior",
  "junior",
  "staff",
  "officer",
  "specialist",
  "associate",
  "intern",
  "internship",
  "magang",
  "fresh",
  "graduate",
  "year",
  "years",
  "tahun",
  "month",
  "months",
  "bulan",
  "min",
  "minimal",
  "maksimal",
  "maximum",
  "minimum",
  "bachelor",
  "degree",
  "sarjana",
  "pendidikan",
  "education",
  "data",
  "system",
  "sistem",
  "product",
  "produk",
  "team",
  "tim",
  "project",
  "proyek",
  "company",
  "perusahaan",
  "posisi",
  "position",
  "experience",
  "pengalaman",
  "skill",
  "kemampuan",
  "general",
  "umum",
  "industry",
  "industri",
  "kerja",
  "work",
  "job",
  "role",
  "peran",
]);

/* ------------------------------------------------------------------ */
/*  Klasifikasi lowongan                                                */
/*                                                                      */
/*  Lowongan dijalankan lewat taxonomy yang SAMA dengan yang dipakai    */
/*  detectCategory() pada CV user. Pencocokan lalu dilakukan di tingkat  */
/*  KATEGORI, bukan kata per kata.                                      */
/*                                                                      */
/*  Ini yang menyelesaikan kasus seperti "AI Engineer" yang tadinya      */
/*  lolos hanya karena CV menyebut "automation": lowongan itu           */
/*  terklasifikasi sebagai kategori AI, bukan Keuangan, jadi langsung   */
/*  tidak relevan untuk user bidang keuangan.                           */
/* ------------------------------------------------------------------ */

// Deskripsi sengaja TIDAK ikut diklasifikasikan. Deskripsi lowongan penuh
// basa-basi lintas bidang, dan itulah sumber semua salah cocok sebelumnya.
// Judul dan kolom skill jauh lebih mencerminkan inti pekerjaan.
const _cacheKlasifikasi = new Map();

export function klasifikasiLoker(job) {
  if (_cacheKlasifikasi.has(job.id)) return _cacheKlasifikasi.get(job.id);

  // Deskripsi memang tidak ikut: kolomnya tidak diambil dari database,
  // dan sebelum itu pun deskripsi terlalu berisik untuk klasifikasi.
  const teks = [
    job.posisi || "",
    (job.skills || []).join(" "),
    job.kategori || "",
  ]
    .join(" ")
    .toLowerCase();

  const dinilai = TAXONOMY.map((cat) => {
    const hits = cat.keywords.filter((k) => teks.includes(k));
    return { label: cat.label, score: hits.length, hits };
  }).sort((a, b) => b.score - a.score);

  const hasil = dinilai[0].score > 0 ? dinilai[0] : null;
  _cacheKlasifikasi.set(job.id, hasil);
  return hasil;
}

// scoreJob: hitung kecocokan CV/skill user (cvTokens, sudah dinormalize)
// terhadap satu loker. Match di kolom 'skills' dikasih bobot paling tinggi
// karena itu data paling presisi, match di judul lebih tinggi dari
// deskripsi karena judul biasanya lebih mencerminkan inti pekerjaan.
// Kata yang terlalu generik (GENERIC_TERMS) atau terlalu umum di dataset
// ini (datasetCommonTerms) diabaikan kecuali memang tercantum eksplisit
// di kolom skill.
// Selain skor, fungsi ini juga catat *concept* apa aja yang match supaya
// bisa ditampilkan ke user ("cocok karena: engineer, finance, ...").
function scoreJob(
  cvTokens,
  job,
  datasetCommonTerms,
  kategoriTokens,
  labelKategoriUser,
) {
  const titleTokens = new Set(tokenize(job.posisi || ""));
  // Kolom skill dan kategori (kalau ada) sama-sama data terstruktur yang
  // sengaja diklasifikasikan, jadi diperlakukan setara \u2014 bobot paling
  // tinggi karena lebih presisi daripada nebak dari teks bebas.
  const skillTokens = new Set(
    tokenize([...(job.skills || []), job.kategori || ""].join(" ")),
  );
  // Catatan: deskripsi tidak lagi diambil dari database demi kecepatan muat,
  // jadi himpunan ini praktis selalu kosong. Dibiarkan agar scoring tetap
  // bekerja kalau suatu saat deskripsi dikembalikan.
  const descTokens = new Set(tokenize(job.deskripsi || ""));

  // ---- GERBANG KATEGORI ----
  // Lowongan diklasifikasikan dengan taxonomy yang sama seperti CV user.
  // Kalau kategorinya berbeda, lowongan ini bukan di bidang user —
  // berapa pun kata yang kebetulan sama, hasilnya tetap tidak relevan.
  const katLoker = klasifikasiLoker(job);
  const kategoriCocok = labelKategoriUser
    ? katLoker?.label === labelKategoriUser
    : true; // tanpa kategori user, gerbang tidak diterapkan

  let score = 0;
  const matched = new Set();
  const matchedKategori = new Set();

  // Kata kunci kategori (dari detectCategory) diperiksa lebih dulu dengan
  // bobot paling tinggi. Ini istilah kurasi manual dari taxonomy, jadi
  // sinyalnya jauh lebih bersih daripada token mentah CV — dan sengaja
  // TIDAK dikenai filter GENERIC_TERMS/datasetCommonTerms, karena kata
  // seperti "finance" memang inti bidangnya, bukan kebetulan.
  // skorInti = kecocokan di judul atau kolom skill. Ini yang menentukan
  // apakah sebuah lowongan benar-benar di bidang yang sama.
  // Kecocokan yang cuma nyangkut di deskripsi TIDAK dihitung di sini,
  // karena satu kata "finance" di deskripsi lowongan ML Engineer
  // tidak menjadikannya lowongan finance.
  let skorInti = 0;

  if (kategoriTokens && kategoriTokens.size > 0) {
    kategoriTokens.forEach((t) => {
      if (skillTokens.has(t)) {
        score += 5;
        skorInti += 5;
        matchedKategori.add(t);
      } else if (titleTokens.has(t)) {
        score += 4;
        skorInti += 4;
        matchedKategori.add(t);
      } else if (descTokens.has(t)) {
        // Sinyal lemah: dihitung kecil dan tidak masuk skorInti
        score += 0.5;
        matchedKategori.add(t);
      }
    });
  }

  cvTokens.forEach((t) => {
    if (matchedKategori.has(t)) return; // sudah dihitung sebagai kategori
    if (skillTokens.has(t)) {
      score += 3;
      skorInti += 3;
      matched.add(t);
      return;
    }
    // terlalu umum secara universal ATAU terlalu umum khusus di dataset
    // loker yang lagi dipakai sekarang -> skip kalau bukan skill eksplisit
    if (GENERIC_TERMS.has(t) || datasetCommonTerms.has(t)) return;
    if (titleTokens.has(t)) {
      score += 2;
      skorInti += 2;
      matched.add(t);
    } else if (descTokens.has(t)) {
      score += 0.5; // diturunkan dari 1 — deskripsi sinyal paling lemah
      matched.add(t);
    }
  });

  // Tanpa kecocokan di judul atau kolom skill, sinyalnya terlalu lemah.
  if (skorInti === 0) {
    score = Math.min(score, 1);
  }

  // Kategori lowongan berbeda dari bidang user -> tidak relevan.
  // Skor inti dinolkan supaya tersaring keluar di rankJobs.
  if (!kategoriCocok) {
    skorInti = 0;
    score = 0;
  }
  return {
    score,
    skorInti,
    kategoriLoker: katLoker?.label || null,
    matchedTerms: Array.from(matched),
    matchedKategori: Array.from(matchedKategori),
  };
}

// Ambang batas: kalau sebuah kata muncul di judul+deskripsi lebih dari 18%
// loker dalam satu dataset, anggap kata itu "terlalu umum di dataset ini"
// dan jangan dipakai sebagai sinyal kecocokan (walau bukan kata generik
// universal). Ini yang nangani kasus kayak "finance" yang nongol di
// hampir semua loker perusahaan crypto/fintech, meski "finance" sendiri
// bukan kata generik di konteks lain.
// Diturunkan dari 0.18 ke 0.10: dengan katalog 10.000+ loker lintas industri,
// kata yang muncul di 10% lowongan sudah terlalu umum untuk jadi sinyal.
const DATASET_COMMON_THRESHOLD = 0.1;

// Cache: dataset common terms hanya dihitung ulang kalau daftar lokernya berubah.
// Tanpa ini, 10.000 deskripsi di-tokenize ulang setiap kali rankJobs dipanggil.
let _dctCache = { kunci: null, hasil: new Set() };

function computeDatasetCommonTerms(jobsList) {
  if (!jobsList.length) return new Set();

  // Kunci murah: jumlah loker + id pertama & terakhir sudah cukup
  // untuk mendeteksi daftar yang berubah.
  const kunci = `${jobsList.length}:${jobsList[0]?.id}:${jobsList[jobsList.length - 1]?.id}`;
  if (_dctCache.kunci === kunci) return _dctCache.hasil;

  const hasil = _hitungDatasetCommonTerms(jobsList);
  _dctCache = { kunci, hasil };
  return hasil;
}

function _hitungDatasetCommonTerms(jobsList) {
  const documentFrequency = new Map();
  jobsList.forEach((job) => {
    const tokensInJob = new Set(
      tokenize((job.posisi || "") + " " + (job.deskripsi || "")),
    );
    tokensInJob.forEach((t) => {
      documentFrequency.set(t, (documentFrequency.get(t) || 0) + 1);
    });
  });
  const common = new Set();
  documentFrequency.forEach((count, term) => {
    if (count / jobsList.length >= DATASET_COMMON_THRESHOLD) common.add(term);
  });
  return common;
}

/* ------------------------------------------------------------------ */
/*  Alasan kecocokan — dibuat lokal dari matchedTerms, tanpa AI.        */
/*  Bisa diverifikasi user, tidak bisa mengarang.                       */
/* ------------------------------------------------------------------ */

// Persentase dihitung dari skorInti secara ABSOLUT, bukan relatif terhadap
// loker teratas. Kalau relatif, lowongan lemah tetap tampil 90% asalkan
// kebetulan berada di urutan atas — itu menyesatkan.
//
// Skala: skorInti 2 = pas-pasan, 8 = kuat, 16+ = sangat kuat.
export function persenKecocokan(skorInti) {
  if (!skorInti || skorInti <= 0) return 0;
  // Kurva melandai: naik cepat di awal, makin pelan di atas.
  const persen = 40 + 55 * (1 - Math.exp(-skorInti / 7));
  return Math.min(95, Math.round(persen));
}

// Label kualitatif — lebih jujur daripada angka untuk kecocokan lemah
export function labelKecocokan(skorInti) {
  if (skorInti >= 12) return "Sangat cocok";
  if (skorInti >= 6) return "Cocok";
  if (skorInti >= 3) return "Cukup cocok";
  return "Kecocokan lemah";
}

// Ambil kata kunci paling informatif untuk ditampilkan.
// Kata dari kategori didahulukan karena itu inti bidangnya —
// "treasury, pajak" lebih menjelaskan daripada "laporan, bulanan".
export function alasanKecocokan(matchedTerms, maks = 4, matchedKategori = []) {
  const kategori = [...(matchedKategori || [])];
  const sisa = (matchedTerms || [])
    .filter((t) => !kategori.includes(t))
    .sort((a, b) => b.length - a.length);
  const gabungan = [...kategori, ...sisa];
  return gabungan.slice(0, maks);
}

// Tambahkan persen + alasan ke hasil rankJobs
export function lengkapiKecocokan(ranked) {
  return ranked.map((j) => ({
    ...j,
    persen: persenKecocokan(j.skorInti),
    label: labelKecocokan(j.skorInti),
    alasanTerms: alasanKecocokan(j.matchedTerms, 4, j.matchedKategori),
    cocokKategori: (j.matchedKategori || []).length > 0,
  }));
}

// rankJobs butuh daftar `jobs` (dari Supabase/demo) sebagai argumen.
// Tiap job hasil balikan punya tambahan `score` dan `matchedTerms`.
/**
 * rankJobs(jobsList, text, limit, kategori)
 * @param kategori - hasil detectCategory(text). Kalau diisi, kata kunci
 *   kategorinya dipakai sebagai sinyal utama dengan bobot lebih tinggi
 *   daripada token CV biasa. Kalau tidak diisi, dihitung otomatis.
 */
export function rankJobs(jobsList, text, limit, kategori) {
  const cvTokens = new Set(tokenize(text));
  const datasetCommonTerms = computeDatasetCommonTerms(jobsList);

  // Kalau kategori tidak dioper, deteksi sendiri supaya pemanggil lama
  // tetap ikut menikmati peningkatan akurasinya.
  const kat = kategori ?? detectCategory(text);
  const kategoriTokens = new Set(tokenize((kat?.hits || []).join(" ")));
  // Label hanya dipakai sebagai gerbang kalau kategorinya benar-benar terdeteksi.
  // Kalau CV terlalu umum untuk diklasifikasikan, gerbangnya dilewati
  // supaya user tidak berakhir dengan nol hasil.
  const labelKategoriUser = kat && kat.score > 0 ? kat.label : null;

  return jobsList
    .map((j) => {
      const { score, skorInti, kategoriLoker, matchedTerms, matchedKategori } =
        scoreJob(
          cvTokens,
          j,
          datasetCommonTerms,
          kategoriTokens,
          labelKategoriUser,
        );
      return {
        ...j,
        score,
        skorInti,
        kategoriLoker,
        matchedTerms,
        matchedKategori,
      };
    })
    .filter((j) => j.skorInti > 0) // wajib cocok di judul atau kolom skill
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
