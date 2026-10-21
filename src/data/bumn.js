/**
 * Loker BUMN: dari situs khusus BUMN (lokerbumn, Pertamina) dan dari
 * perusahaan BUMN beserta anak usahanya di sumber lain. Dipakai juga oleh
 * server API.
 */
import { t } from "../i18n.js";

/**
 * Nilai kolom `site` dari scraper khusus BUMN. Halaman BUMN HANYA
 * menampilkan loker dari situs-situs ini, sesuai hasil scrap.
 * Tambahkan nama site di sini bila ada scraper BUMN baru.
 */
export const SITUS_BUMN = ["lokerbumn", "pertamina_ptc"];

/** Nama perusahaan BUMN (dicocokkan ke kolom perusahaan, huruf besar/kecil sama). */
export const NAMA_BUMN = [
  "pertamina", "pln", "telkom", "telkomsel", "bank mandiri", "bank rakyat indonesia", "bri", "bank negara indonesia",
  "bni", "bank tabungan negara", "btn", "bank syariah indonesia", "kereta api", "kai", "angkasa pura", "injourney",
  "pelindo", "garuda indonesia", "citilink", "semen indonesia", "pupuk indonesia", "pupuk kaltim", "petrokimia gresik",
  "pegadaian", "perusahaan gas negara", "pgn", "aneka tambang", "antam", "bukit asam", "timah", "inalum", "mind id",
  "wijaya karya", "wika", "waskita", "adhi karya", "hutama karya", "pembangunan perumahan", "jasa marga", "bio farma",
  "kimia farma", "indofarma", "pos indonesia", "asdp", "pelni", "bulog", "perhutani", "perkebunan nusantara", "ptpn",
  "krakatau steel", "len industri", "pindad", "pal indonesia", "dirgantara indonesia", "taspen", "asabri",
  "jasa raharja", "askrindo", "jamkrindo", "danareksa", "peruri", "sucofindo", "surveyor indonesia", "nindya karya",
  "brantas abipraya", "industri kereta api", "inka", "airnav", "persero",
];

/** Pintasan perusahaan di halaman BUMN. */
export const BUMN_POPULER = [
  ["Pertamina", "pertamina"], ["PLN", "pln"], ["Telkom", "telkom"], ["Bank Mandiri", "mandiri"],
  ["BRI", "bank rakyat"], ["BNI", "bni"], ["BTN", "btn"], ["KAI", "kereta api"], ["Pelindo", "pelindo"],
  ["Pegadaian", "pegadaian"], ["Pupuk Indonesia", "pupuk"], ["Garuda", "garuda"],
];

export const KET_BUMN = t(
  "Loker dari Pertamina, PLN, Telkom, bank BUMN, dan BUMN lain beserta anak usahanya.",
  "Openings from Pertamina, PLN, Telkom, state-owned banks, and other state-owned enterprises and their subsidiaries.",
);
