// Kamus sinonim ID <-> EN buat istilah kerja/skill yang umum dipakai.
// Setiap grup punya satu "concept" (representasi kanonik) dan daftar kata
// (bahasa Indonesia maupun Inggris) yang semuanya dianggap sama artinya.
// Dipakai oleh utils/jobMatching.js supaya CV berbahasa Indonesia tetap
// bisa match dengan loker yang ditulis dalam bahasa Inggris (atau
// sebaliknya).
//
// Cara nambah entri baru: tambahin objek baru di array ini. Nggak perlu
// bikin dua arah manual, cukup daftarin semua variasi kata di 'terms'.
export const SYNONYM_GROUPS = [
  // --- Software & Engineering ---
  {
    concept: "engineer",
    terms: ["engineer", "insinyur", "enjinir", "rekayasawan"],
  },
  { concept: "software", terms: ["software", "perangkat", "lunak"] },
  {
    concept: "developer",
    terms: [
      "developer",
      "pengembang",
      "programmer",
      "pemrogram",
      "coding",
      "koding",
    ],
  },
  { concept: "backend", terms: ["backend", "back-end", "server-side"] },
  {
    concept: "frontend",
    terms: ["frontend", "front-end", "client-side", "antarmuka"],
  },
  { concept: "fullstack", terms: ["fullstack", "full-stack"] },
  { concept: "mobile", terms: ["mobile", "seluler", "aplikasi mobile"] },
  { concept: "web", terms: ["web", "website", "situs"] },
  { concept: "database", terms: ["database", "basis data", "basisdata"] },
  { concept: "cloud", terms: ["cloud", "awan"] },
  { concept: "devops", terms: ["devops"] },
  {
    concept: "qa",
    terms: ["qa", "quality assurance", "penjaminan mutu", "tester", "penguji"],
  },
  {
    concept: "ai",
    terms: [
      "ai",
      "artificial intelligence",
      "kecerdasan buatan",
      "machine learning",
      "ml",
    ],
  },
  { concept: "data", terms: ["data"] },
  { concept: "analyst", terms: ["analyst", "analis", "analisa", "analisis"] },
  { concept: "network", terms: ["network", "jaringan"] },
  { concept: "security", terms: ["security", "keamanan", "cyber", "siber"] },
  { concept: "system", terms: ["system", "sistem"] },
  { concept: "infrastructure", terms: ["infrastructure", "infrastruktur"] },
  { concept: "design", terms: ["design", "desain", "perancangan"] },
  { concept: "ui", terms: ["ui", "user interface", "antarmuka pengguna"] },
  { concept: "ux", terms: ["ux", "user experience", "pengalaman pengguna"] },
  { concept: "product", terms: ["product", "produk"] },

  // --- Finance & Accounting ---
  { concept: "finance", terms: ["finance", "keuangan", "finansial"] },
  { concept: "accounting", terms: ["accounting", "akuntansi", "akuntan"] },
  { concept: "tax", terms: ["tax", "pajak", "perpajakan", "brevet"] },
  { concept: "audit", terms: ["audit", "auditor", "pemeriksaan"] },
  { concept: "treasury", terms: ["treasury", "perbendaharaan"] },
  { concept: "compliance", terms: ["compliance", "kepatuhan"] },
  { concept: "risk", terms: ["risk", "risiko"] },
  { concept: "budget", terms: ["budget", "anggaran"] },
  { concept: "investment", terms: ["investment", "investasi"] },
  { concept: "banking", terms: ["banking", "perbankan", "bank"] },

  // --- Sales, Marketing & Customer ---
  { concept: "sales", terms: ["sales", "penjualan", "wiraniaga"] },
  { concept: "marketing", terms: ["marketing", "pemasaran"] },
  { concept: "customer", terms: ["customer", "pelanggan", "konsumen"] },
  { concept: "brand", terms: ["brand", "merek"] },
  {
    concept: "digital marketing",
    terms: ["digital marketing", "pemasaran digital"],
  },
  { concept: "content", terms: ["content", "konten"] },
  { concept: "social media", terms: ["social media", "media sosial"] },
  { concept: "retail", terms: ["retail", "eceran"] },
  { concept: "promotor", terms: ["promotor", "sales promotion", "spg", "spb"] },

  // --- Management & Operations ---
  { concept: "manager", terms: ["manager", "manajer"] },
  {
    concept: "leader",
    terms: ["leader", "pemimpin", "team lead", "ketua tim"],
  },
  { concept: "supervisor", terms: ["supervisor", "pengawas"] },
  {
    concept: "coordinator",
    terms: ["coordinator", "koordinator", "koordinasi"],
  },
  { concept: "operation", terms: ["operation", "operasional", "operasi"] },
  { concept: "logistics", terms: ["logistics", "logistik"] },
  { concept: "supply chain", terms: ["supply chain", "rantai pasok"] },
  { concept: "warehouse", terms: ["warehouse", "gudang"] },
  { concept: "distribution", terms: ["distribution", "distribusi"] },
  { concept: "project", terms: ["project", "proyek"] },
  { concept: "strategy", terms: ["strategy", "strategi"] },

  // --- HR & Admin ---
  {
    concept: "human resources",
    terms: ["human resources", "hr", "sumber daya manusia", "sdm"],
  },
  { concept: "recruitment", terms: ["recruitment", "rekrutmen", "perekrutan"] },
  { concept: "training", terms: ["training", "pelatihan"] },
  { concept: "admin", terms: ["admin", "administrasi", "administrative"] },

  // --- General work terms ---
  { concept: "remote", terms: ["remote", "jarak jauh", "wfh"] },
  { concept: "onsite", terms: ["onsite", "di tempat", "on-site"] },
  {
    concept: "freelance",
    terms: ["freelance", "lepas", "paruh waktu freelance"],
  },
  { concept: "fulltime", terms: ["fulltime", "full-time", "penuh waktu"] },
  { concept: "contract", terms: ["contract", "kontrak"] },
  { concept: "experience", terms: ["experience", "pengalaman"] },
  { concept: "communication", terms: ["communication", "komunikasi"] },
  { concept: "english", terms: ["english", "bahasa inggris", "inggris"] },
  { concept: "writing", terms: ["writing", "menulis", "penulisan"] },
  {
    concept: "translation",
    terms: ["translation", "translator", "penerjemah", "terjemahan"],
  },
  {
    concept: "journalism",
    terms: ["journalism", "jurnalisme", "reporter", "wartawan"],
  },
  {
    concept: "presenter",
    terms: ["presenter", "pembawa acara", "voice over", "pengisi suara"],
  },
  {
    concept: "annotation",
    terms: ["annotation", "anotasi", "labeling", "pelabelan"],
  },
  { concept: "evaluation", terms: ["evaluation", "evaluasi", "evaluator"] },
];

// Bangun reverse-lookup sekali di module-load: tiap kata mentah -> concept.
const TERM_TO_CONCEPT = new Map();
SYNONYM_GROUPS.forEach(({ concept, terms }) => {
  terms.forEach((term) => TERM_TO_CONCEPT.set(term.toLowerCase(), concept));
});

// normalizeWord: kalau kata ada di kamus, kembalikan concept kanoniknya;
// kalau nggak ada, kembalikan kata itu sendiri apa adanya.
export function normalizeWord(word) {
  return TERM_TO_CONCEPT.get(word) || word;
}
