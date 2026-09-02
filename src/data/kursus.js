/**
 * Katalog kursus afiliasi.
 *
 * Ganti setiap `url` dengan tautan afiliasimu sendiri. Yang ada di sini
 * hanya penanda tempat — jangan dipakai apa adanya.
 *
 * `skills` dipakai untuk mencocokkan kursus dengan skill gap user.
 * Tulis dalam huruf kecil, dan sertakan variasi kata yang mungkin muncul
 * di hasil analisis AI (mis. "pajak" dan "tax").
 */
export const KURSUS = [
  // ---------- Keuangan, Pajak, Treasury ----------
  {
    id: "brevet-ab",
    judul: "Brevet Pajak A & B",
    penyedia: "Ikatan Akuntan Indonesia",
    durasi: "3 bulan",
    level: "Menengah",
    harga: "Rp 3.500.000",
    skills: ["pajak", "tax", "perpajakan", "brevet", "pph", "ppn", "kepatuhan"],
    kategori: ["Transaksi, Keuangan & Treasury"],
    url: "https://contoh-afiliasi.com/brevet-ab",
  },
  {
    id: "excel-finance",
    judul: "Advanced Excel untuk Analis Keuangan",
    penyedia: "Coursera",
    durasi: "6 minggu",
    level: "Menengah",
    harga: "Rp 550.000",
    skills: [
      "excel",
      "spreadsheet",
      "analisis data",
      "pivot",
      "financial modeling",
      "laporan",
    ],
    kategori: ["Transaksi, Keuangan & Treasury"],
    url: "https://contoh-afiliasi.com/excel-finance",
  },
  {
    id: "sap-fi",
    judul: "SAP FI/CO Fundamental",
    penyedia: "Udemy",
    durasi: "40 jam",
    level: "Pemula",
    harga: "Rp 400.000",
    skills: ["sap", "erp", "akuntansi", "accounting", "jurnal", "rekonsiliasi"],
    kategori: ["Transaksi, Keuangan & Treasury"],
    url: "https://contoh-afiliasi.com/sap-fi",
  },
  {
    id: "audit-internal",
    judul: "Internal Audit & ISO 19011",
    penyedia: "PT Surveyor Indonesia",
    durasi: "5 hari",
    level: "Menengah",
    harga: "Rp 4.000.000",
    skills: [
      "audit",
      "iso",
      "icofr",
      "risk",
      "risiko",
      "kepatuhan",
      "pengendalian internal",
    ],
    kategori: ["Transaksi, Keuangan & Treasury"],
    url: "https://contoh-afiliasi.com/audit-internal",
  },

  // ---------- Data & Teknologi ----------
  {
    id: "python-dasar",
    judul: "Python untuk Analisis Data",
    penyedia: "Dicoding",
    durasi: "8 minggu",
    level: "Pemula",
    harga: "Rp 500.000",
    skills: [
      "python",
      "data",
      "analisis data",
      "otomatisasi",
      "automation",
      "scripting",
    ],
    kategori: ["AI Training & Anotasi Data", "IT & Dukungan Teknis"],
    url: "https://contoh-afiliasi.com/python-data",
  },
  {
    id: "sql-analis",
    judul: "SQL untuk Analis Bisnis",
    penyedia: "RevoU",
    durasi: "4 minggu",
    level: "Pemula",
    harga: "Rp 750.000",
    skills: [
      "sql",
      "database",
      "query",
      "data",
      "business intelligence",
      "dashboard",
    ],
    kategori: ["AI Training & Anotasi Data", "Transaksi, Keuangan & Treasury"],
    url: "https://contoh-afiliasi.com/sql-analis",
  },
  {
    id: "prompt-eng",
    judul: "Prompt Engineering untuk Profesional",
    penyedia: "Coursera",
    durasi: "3 minggu",
    level: "Pemula",
    harga: "Gratis",
    gratis: true,
    skills: [
      "ai",
      "prompt",
      "chatgpt",
      "llm",
      "artificial intelligence",
      "otomatisasi",
    ],
    kategori: ["AI Training & Anotasi Data"],
    url: "https://contoh-afiliasi.com/prompt-engineering",
  },
  {
    id: "rpa-dasar",
    judul: "Robotic Process Automation Fundamental",
    penyedia: "UiPath Academy",
    durasi: "20 jam",
    level: "Pemula",
    harga: "Gratis",
    gratis: true,
    skills: ["rpa", "otomatisasi", "automation", "proses bisnis", "efisiensi"],
    kategori: ["IT & Dukungan Teknis", "Transaksi, Keuangan & Treasury"],
    url: "https://contoh-afiliasi.com/rpa",
  },

  // ---------- Bisnis, Marketing, Operasional ----------
  {
    id: "digital-marketing",
    judul: "Digital Marketing Menyeluruh",
    penyedia: "RevoU",
    durasi: "12 minggu",
    level: "Pemula",
    harga: "Rp 9.500.000",
    skills: [
      "marketing",
      "pemasaran",
      "digital marketing",
      "seo",
      "social media",
      "konten",
    ],
    kategori: ["Sales, Marketing & Lapangan", "Konten, Bahasa & Presenter"],
    url: "https://contoh-afiliasi.com/digital-marketing",
  },
  {
    id: "project-mgmt",
    judul: "Project Management Professional",
    penyedia: "Coursera",
    durasi: "6 bulan",
    level: "Menengah",
    harga: "Rp 700.000",
    skills: [
      "project management",
      "manajemen proyek",
      "agile",
      "scrum",
      "koordinasi",
      "stakeholder",
    ],
    kategori: ["Sales, Marketing & Lapangan", "IT & Dukungan Teknis"],
    url: "https://contoh-afiliasi.com/project-management",
  },
  {
    id: "komunikasi-bisnis",
    judul: "Business English & Presentasi",
    penyedia: "Cakap",
    durasi: "8 minggu",
    level: "Menengah",
    harga: "Rp 1.200.000",
    skills: [
      "bahasa inggris",
      "english",
      "presentasi",
      "komunikasi",
      "negosiasi",
    ],
    kategori: ["Konten, Bahasa & Presenter", "Sales, Marketing & Lapangan"],
    url: "https://contoh-afiliasi.com/business-english",
  },
];

/**
 * Mencocokkan kursus dengan kebutuhan user.
 *
 * @param skillDibutuhkan  array string — dari `kekurangan` / `saran_perbaikan`
 *                         hasil analisis AI, atau nama skill dari jalur karier
 * @param kategori         label kategori user dari detectCategory
 */
export function cocokkanKursus(
  skillDibutuhkan = [],
  kategori = null,
  maks = 3,
) {
  const teks = skillDibutuhkan.join(" ").toLowerCase();

  const dinilai = KURSUS.map((k) => {
    let skor = 0;

    // Kecocokan kata kunci skill — sinyal terkuat
    k.skills.forEach((s) => {
      if (teks.includes(s)) skor += 3;
    });

    // Kategori bidang yang sama
    if (kategori && k.kategori.includes(kategori)) skor += 2;

    // Kursus gratis sedikit didahulukan pada skor setara,
    // supaya rekomendasi tidak selalu mengarah ke yang berbayar.
    if (k.gratis) skor += 0.5;

    return { ...k, skor };
  });

  return dinilai
    .filter((k) => k.skor > 0)
    .sort((a, b) => b.skor - a.skor)
    .slice(0, maks);
}
