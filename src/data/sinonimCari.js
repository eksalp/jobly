/**
 * Kamus kecil untuk kolom pencarian loker (dipakai server API).
 *
 * Berbeda dari synonyms.js (untuk mencocokkan CV), daftar ini sengaja
 * dibuat sempit: hanya padanan yang benar-benar berarti posisi yang sama,
 * supaya mencari "akuntan" juga menemukan "Accounting Staff" tanpa
 * menarik loker yang tidak berhubungan.
 *
 * Setiap baris = satu kelompok. Kata yang diketik pengguna cocok dengan
 * kelompok bila sama persis dengan salah satu isinya.
 */
export const KELOMPOK_SINONIM = [
  ["akuntan", "akuntansi", "accounting", "accountant"],
  ["keuangan", "finance", "financial"],
  ["pajak", "tax", "perpajakan", "taxation"],
  ["admin", "administrasi", "administration", "administrative"],
  ["hr", "hrd", "human resource", "human resources", "personalia", "sdm", "people"],
  ["it", "information technology", "teknologi informasi"],
  ["programmer", "developer", "pengembang", "software engineer"],
  ["desain", "desainer", "design", "designer", "grafis", "graphic"],
  ["marketing", "pemasaran"],
  ["sales", "penjualan"],
  ["cs", "customer service", "customer support", "layanan pelanggan", "customer care"],
  ["gudang", "warehouse"],
  ["kurir", "courier"],
  ["driver", "sopir", "supir", "pengemudi"],
  ["perawat", "nurse", "keperawatan", "nursing"],
  ["dokter", "doctor", "physician"],
  ["guru", "teacher", "pengajar", "tutor"],
  ["apoteker", "pharmacist", "farmasi", "pharmacy"],
  ["kasir", "cashier"],
  ["insinyur", "engineer", "engineering"],
  ["teknisi", "technician"],
  ["produksi", "production"],
  ["logistik", "logistics", "supply chain"],
  ["pembelian", "purchasing", "procurement"],
  ["hukum", "legal", "lawyer", "pengacara"],
  ["sekretaris", "secretary"],
  ["resepsionis", "receptionist", "front desk", "front office"],
  ["analis", "analyst"],
  ["magang", "intern", "internship"],
  ["manajer", "manager"],
  ["spv", "supervisor"],
  ["konten", "content"],
  ["penulis", "writer", "copywriter"],
  ["satpam", "security"],
  ["koki", "chef", "cook", "juru masak"],
  ["mekanik", "mechanic"],
  ["listrik", "electrical", "elektrik"],
  ["sipil", "civil"],
  ["arsitek", "architect"],
  ["fotografer", "photographer"],
  ["penerjemah", "translator", "interpreter"],
  ["asisten", "assistant"],
  ["qa", "quality assurance", "tester"],
  ["qc", "quality control"],
  ["ga", "general affair", "general affairs"],
  ["bd", "business development"],
  ["pr", "public relations", "humas"],
  ["ui", "user interface"],
  ["ux", "user experience"],
  ["va", "virtual assistant"],
  ["pengajar", "instructor", "trainer"],
  ["kreatif", "creative"],
  ["editor", "editing"],
  ["operator", "operasional", "operations"],
];

/**
 * Kata umum di kolom cari yang tidak menyaring apa pun
 * ("loker admin di jakarta" → "admin jakarta").
 */
export const KATA_CARI_ABAIKAN = new Set([
  "loker", "lowongan", "lowker", "kerja", "kerjaan", "pekerjaan", "job", "jobs",
  "vacancy", "vacancies", "hiring", "dibutuhkan", "dicari", "cari", "posisi",
  "di", "ke", "in", "at", "the", "and", "dan", "untuk", "yang", "for", "of",
]);

/** Kelompok padanan untuk satu kata, termasuk kata itu sendiri. */
export function padananKata(kata) {
  const k = String(kata || "").toLowerCase();
  const grup = KELOMPOK_SINONIM.find((g) => g.includes(k));
  return grup ? [...new Set([k, ...grup])] : [k];
}
