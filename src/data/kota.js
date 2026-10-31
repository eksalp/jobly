/** Kota yang ditampilkan di pencarian & statistik. Dipakai juga oleh server API. */
export const KOTA_POPULER = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Medan",
  "Semarang",
  "Yogyakarta",
  "Makassar",
  "Denpasar",
  "Bekasi",
  "Tangerang",
  "Depok",
  "Bogor",
  "Malang",
  "Palembang",
  "Batam",
  "Pekanbaru",
  "Balikpapan",
  "Samarinda",
  "Banjarmasin",
  "Pontianak",
  "Manado",
  "Padang",
  "Bandar Lampung",
  "Cikarang",
  "Karawang",
  "Solo",
  "Cirebon",
  "Serang",
];

/**
 * Nilai kolom `site` yang dikenal (scraper bot Telegram). Dipakai untuk
 * menghitung jumlah loker per sumber tanpa mengunduh seluruh tabel.
 * Tambahkan di sini kalau ada scraper baru.
 */
export const SUMBER_DIKENAL = [
  "linkedin",
  "indeed",
  "glassdoor",
  "google",
  "ziprecruiter",
  "jobstreet",
  "glints",
  "kalibrr",
  "web3career",
  "lokerbumn",
  "talentics",
  "maganghub",
  "bca",
  "pertamina_ptc",
  "shopee",
  "astracareer",
  "tiket",
  "unilever",
  "pmi",
  "loreal",
  "danone",
  "traveloka",
];

/** Sumber berupa platform (bukan situs karier resmi perusahaan). */
export const SUMBER_AGREGATOR = [
  "linkedin",
  "indeed",
  "glassdoor",
  "google",
  "ziprecruiter",
  "bayt",
  "naukri",
  "jobstreet",
  "glints",
  "kalibrr",
  "web3career",
  "lokerbumn",
  "talentics",
  "maganghub",
];
