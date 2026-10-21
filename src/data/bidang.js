/**
 * Bidang kerja untuk "Jelajahi per bidang". Dipakai juga oleh server API.
 *
 * Loker dianggap masuk sebuah bidang bila kolom kategori (diisi bot
 * scraper, mis. "data-science") termasuk `kategori`, ATAU judulnya
 * mengandung salah satu `kata` — loker lama sering belum berkategori.
 */
import { t } from "../i18n.js";

export const BIDANG = [
  { slug: "data", ikon: "BarChart3", warna: "#7C3AED", nama: t("Data & AI", "Data & AI"), ket: t("Data analyst, data scientist, ML engineer", "Data analyst, data scientist, ML engineer"),
    kategori: ["data-science", "data-analyst"], kata: ["data", "machine learning", "business intelligence", "analis data"] },
  { slug: "it", ikon: "Code2", warna: "#2563EB", nama: t("IT & Software", "IT & Software"), ket: t("Developer, QA, DevOps, keamanan siber", "Developer, QA, DevOps, cybersecurity"),
    kategori: ["software-engineering", "frontend", "backend", "fullstack", "mobile-development", "devops-infrastructure", "qa-testing", "cybersecurity", "blockchain-web3"],
    kata: ["developer", "programmer", "software", "devops", "frontend", "backend", "fullstack", "it support"] },
  { slug: "marketing", ikon: "Megaphone", warna: "#DB2777", nama: "Marketing", ket: t("Digital marketing, konten, brand, SEO", "Digital marketing, content, brand, SEO"),
    kategori: ["marketing"], kata: ["marketing", "pemasaran", "content", "konten", "social media", "seo", "brand"] },
  { slug: "sales", ikon: "Handshake", warna: "#EA580C", nama: t("Sales & BD", "Sales & BD"), ket: t("Sales, account executive, business development", "Sales, account executive, business development"),
    kategori: ["sales-business-development"], kata: ["sales", "penjualan", "business development", "account executive", "account manager"] },
  { slug: "teknik", ikon: "Wrench", warna: "#CA8A04", nama: t("Teknik", "Engineering"), ket: t("Sipil, mesin, elektro, produksi, K3", "Civil, mechanical, electrical, production, HSE"),
    kategori: ["engineering-non-it"], kata: ["teknik", "engineer", "mechanical", "electrical", "sipil", "civil", "produksi", "maintenance", "hse"] },
  { slug: "keuangan", ikon: "Calculator", warna: "#059669", nama: t("Keuangan & Akuntansi", "Finance & Accounting"), ket: t("Akuntan, pajak, audit, treasury", "Accounting, tax, audit, treasury"),
    kategori: ["finance-accounting"], kata: ["finance", "keuangan", "akuntan", "accounting", "pajak", "tax", "audit"] },
  { slug: "desain", ikon: "Palette", warna: "#C026D3", nama: t("Desain & Kreatif", "Design & Creative"), ket: t("UI/UX, desainer grafis, video", "UI/UX, graphic design, video"),
    kategori: ["design-ui-ux"], kata: ["desain", "designer", "design", "ui/ux", "video editor", "creative"] },
  { slug: "hr", ikon: "Users", warna: "#0891B2", nama: "HR", ket: t("Rekrutmen, people, payroll", "Recruitment, people, payroll"),
    kategori: ["human-resources"], kata: ["hr", "hrd", "human resource", "recruiter", "talent acquisition", "personalia"] },
  { slug: "admin", ikon: "ClipboardList", warna: "#64748B", nama: t("Admin & Sekretaris", "Admin & Secretarial"), ket: t("Admin, sekretaris, data entry", "Admin, secretary, data entry"),
    kategori: ["admin-general"], kata: ["admin", "administrasi", "sekretaris", "secretary", "data entry"] },
  { slug: "cs", ikon: "Headset", warna: "#0D9488", nama: t("Customer Service", "Customer Service"), ket: t("CS, call center, customer success", "CS, call centre, customer success"),
    kategori: ["customer-service"], kata: ["customer service", "customer support", "call center", "customer success", "customer care"] },
  { slug: "logistik", ikon: "Truck", warna: "#9333EA", nama: t("Operasional & Logistik", "Operations & Logistics"), ket: t("Gudang, supply chain, purchasing", "Warehouse, supply chain, purchasing"),
    kategori: ["operations-logistics"], kata: ["logistik", "logistics", "gudang", "warehouse", "supply chain", "purchasing", "operasional"] },
  { slug: "kesehatan", ikon: "HeartPulse", warna: "#DC2626", nama: t("Kesehatan", "Healthcare"), ket: t("Perawat, dokter, apoteker, medis", "Nurses, doctors, pharmacists"),
    kategori: ["healthcare"], kata: ["perawat", "nurse", "dokter", "doctor", "apoteker", "pharmacist", "medis", "bidan"] },
  { slug: "pendidikan", ikon: "GraduationCap", warna: "#4F46E5", nama: t("Pendidikan", "Education"), ket: t("Guru, tutor, trainer, dosen", "Teachers, tutors, trainers"),
    kategori: ["education"], kata: ["guru", "teacher", "tutor", "trainer", "dosen", "pengajar"] },
  { slug: "produk", ikon: "Rocket", warna: "#0284C7", nama: t("Produk & Proyek", "Product & Project"), ket: t("Product manager, project manager", "Product manager, project manager"),
    kategori: ["product-management", "project-management"], kata: ["product manager", "product owner", "project manager", "scrum master"] },
  { slug: "hukum", ikon: "Scale", warna: "#78716C", nama: t("Hukum & Kepatuhan", "Legal & Compliance"), ket: t("Legal officer, compliance", "Legal officer, compliance"),
    kategori: ["legal"], kata: ["legal", "hukum", "compliance", "lawyer"] },
  { slug: "mt", ikon: "Sprout", warna: "#16A34A", nama: t("MT & Fresh Graduate", "MT & Fresh Graduates"), ket: t("Management trainee, program lulusan baru", "Management trainee, graduate programmes"),
    kategori: ["management-trainee"], kata: ["management trainee", "fresh graduate", "graduate program", "officer development"] },
];

export const cariBidang = (slug) => BIDANG.find((b) => b.slug === slug) || null;
