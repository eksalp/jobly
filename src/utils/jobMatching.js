import { TAXONOMY } from "../data/taxonomy";
import { normalizeWord, SYNONYM_GROUPS } from "../data/synonyms";

// Pemetaan baris database → objek loker dan klasifikasi bidang ada di
// petaLoker.js (tanpa ketergantungan browser, dipakai juga oleh server API).
import { mapSupabaseJob, klasifikasiLoker, rapikanJudul } from "./petaLoker.js";
export { mapSupabaseJob, klasifikasiLoker, rapikanJudul };

// Data loker tidak lagi diambil langsung dari Supabase oleh browser.
// Semuanya lewat /api/loker (lihat api/loker.js & src/utils/apiLoker.js),
// yang hanya mengirim baris yang ditampilkan dan di-cache di CDN.

// tokenize: pecah teks jadi kata-kata, lalu normalize tiap kata lewat kamus
// sinonim ID<->EN (data/synonyms.js). Jadi "insinyur" dan "engineer" bakal
// jadi token yang sama persis ("engineer") setelah lewat sini, sehingga CV
// berbahasa Indonesia tetap bisa match loker berbahasa Inggris (dan
// sebaliknya). Kata yang nggak ada di kamus dibiarkan apa adanya.
export function tokenize(text) {
  const raw = text.toLowerCase().match(/[a-z\u00e0-\u00ff]{3,}/g) || [];
  return raw.map(normalizeWord);
}

/**
 * Kata kunci untuk mencari kandidat loker di server.
 *
 * Diambil dari kata yang paling sering muncul di profil (setelah kata umum
 * dibuang), lalu diperluas dengan sinonimnya — "akuntansi" ikut mencari
 * "akuntan" dan "accounting", "pajak" ikut mencari "tax". Server mencocokkan
 * kata-kata ini ke judul & bidang loker, hasilnya diurutkan di browser.
 */
const KATA_ABAIKAN = new Set([
  "dan", "yang", "untuk", "dengan", "dari", "pada", "dalam", "saya", "tahun",
  "pengalaman", "the", "and", "for", "with", "years", "experience", "bulan",
  "kerja", "bekerja", "sebagai", "serta", "juga", "lebih", "telah", "sudah",
  "satu", "dua", "tiga", "empat", "lima", "staf", "staff",
]);

export function kataKunciPencarian(teks, skills = []) {
  const frek = new Map();
  for (const t of tokenize(`${skills.join(" ")} ${skills.join(" ")} ${teks || ""}`)) {
    if (t.length < 3 || KATA_ABAIKAN.has(t) || GENERIC_TERMS.has(t)) continue;
    frek.set(t, (frek.get(t) || 0) + 1);
  }
  const inti = [...frek.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);

  const hasil = [];
  const tambah = (k) => {
    const t = String(k || "").toLowerCase().trim();
    if (t.length >= 3 && t.length <= 30 && !hasil.includes(t)) hasil.push(t);
  };
  for (const t of inti) {
    tambah(t);
    const grup = SYNONYM_GROUPS.find((g) => g.concept === t);
    (grup?.terms || []).forEach(tambah);
  }
  const cat = detectCategory(teks || "");
  (cat.hits || []).forEach(tambah);
  return hasil.slice(0, 24);
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
  // Gerbang hanya menolak loker yang JELAS masuk bidang lain. Loker yang
  // judulnya tidak cocok dengan frasa taxonomy mana pun (mis. "Frontend
  // Engineer", "Finance & Tax Staff") tetap dinilai dari kecocokan judul
  // dan skill — dulu loker seperti ini ikut terbuang, sehingga halaman
  // "Cocok untukku" sering kosong padahal ada loker yang relevan.
  const kategoriCocok =
    labelKategoriUser && katLoker ? katLoker.label === labelKategoriUser : true;

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
