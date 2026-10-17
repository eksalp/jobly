/**
 * Negara untuk filter pencarian loker. Dipakai juga oleh server API.
 *
 * Tabel jobs tidak punya kolom negara, jadi negara dikenali dari teks
 * kolom lokasi. Setiap negara punya daftar pola ILIKE (huruf besar/kecil
 * tidak berpengaruh, "*" = teks apa saja).
 *
 * Pola yang mengandung koma (mis. "*, ny") dikirim dalam tanda kutip ke
 * PostgREST, jadi aman dipakai.
 */
import { KOTA_POPULER } from "./kota.js";

// Kota & provinsi Indonesia tambahan (selain KOTA_POPULER) — loker dari
// Indeed/Glints sering hanya menulis nama kota tanpa "Indonesia".
const WILAYAH_INDONESIA = [
  "indonesia", "dki", "jabodetabek", "jawa", "sumatera", "sumatra", "kalimantan",
  "sulawesi", "bali", "banten", "riau", "papua", "aceh", "lampung", "jambi",
  "bengkulu", "maluku", "gorontalo", "nusa tenggara", "kepulauan", "bangka",
  "sidoarjo", "gresik", "mojokerto", "kediri", "jember", "banyuwangi", "madiun",
  "tegal", "pekalongan", "purwokerto", "magelang", "klaten", "kudus", "jepara",
  "sleman", "bantul", "tasikmalaya", "garut", "sukabumi", "cimahi", "cianjur",
  "purwakarta", "subang", "cilegon", "pandeglang", "lebak", "jambi", "dumai",
  "tanjung pinang", "tanjungpinang", "pangkal pinang", "bukittinggi", "padang",
  "binjai", "deli serdang", "pematang siantar", "kupang", "mataram", "ambon",
  "jayapura", "sorong", "palu", "kendari", "bitung", "tarakan", "bontang",
  "palangkaraya", "palangka raya", "singkawang", "bogor", "depok", "tangsel",
  "tangerang selatan", "serpong", "bsd", "karawang", "cikarang", "bekasi",
];

// Kode negara bagian AS — loker AS biasanya ditulis "Kota, ST"
const NEGARA_BAGIAN_AS = [
  "al", "ak", "az", "ar", "ca", "co", "ct", "de", "fl", "ga", "hi", "id", "il", "in",
  "ia", "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv",
  "nh", "nj", "nm", "ny", "nc", "nd", "oh", "ok", "or", "pa", "ri", "sc", "sd", "tn",
  "tx", "ut", "vt", "va", "wa", "wv", "wi", "wy", "dc",
];

const isi = (kata) => kata.map((k) => `*${k}*`);

/** Urutan di sini = urutan di pilihan filter bila jumlahnya sama. */
export const DAFTAR_NEGARA = [
  {
    kode: "id",
    id: "Indonesia",
    en: "Indonesia",
    pola: isi([...new Set([...WILAYAH_INDONESIA, ...KOTA_POPULER.map((k) => k.toLowerCase())])]),
  },
  { kode: "sg", id: "Singapura", en: "Singapore", pola: isi(["singapore", "singapura"]) },
  { kode: "my", id: "Malaysia", en: "Malaysia", pola: isi(["malaysia", "kuala lumpur", "penang", "johor", "selangor", "petaling jaya", "cyberjaya"]) },
  { kode: "ph", id: "Filipina", en: "Philippines", pola: isi(["philippines", "filipina", "manila", "makati", "taguig", "cebu", "pasig", "quezon city"]) },
  { kode: "vn", id: "Vietnam", en: "Vietnam", pola: isi(["vietnam", "viet nam", "ho chi minh", "hanoi", "ha noi", "da nang"]) },
  { kode: "th", id: "Thailand", en: "Thailand", pola: isi(["thailand", "bangkok"]) },
  { kode: "au", id: "Australia", en: "Australia", pola: isi(["australia", "sydney", "melbourne", "brisbane", "perth", "adelaide", "canberra"]) },
  { kode: "jp", id: "Jepang", en: "Japan", pola: isi(["japan", "jepang", "tokyo", "osaka"]) },
  { kode: "kr", id: "Korea Selatan", en: "South Korea", pola: isi(["korea", "seoul"]) },
  { kode: "hk", id: "Hong Kong", en: "Hong Kong", pola: isi(["hong kong"]) },
  { kode: "cn", id: "Tiongkok", en: "China", pola: isi(["china", "shanghai", "beijing", "shenzhen", "guangzhou"]) },
  { kode: "in", id: "India", en: "India", pola: isi(["india", "bengaluru", "bangalore", "mumbai", "hyderabad", "pune", "chennai", "gurugram", "gurgaon", "noida", "new delhi"]) },
  { kode: "ae", id: "Uni Emirat Arab", en: "United Arab Emirates", pola: isi(["united arab emirates", "uae", "dubai", "abu dhabi"]) },
  { kode: "sa", id: "Arab Saudi", en: "Saudi Arabia", pola: isi(["saudi", "riyadh", "jeddah"]) },
  { kode: "qa", id: "Qatar", en: "Qatar", pola: isi(["qatar", "doha"]) },
  {
    kode: "us",
    id: "Amerika Serikat",
    en: "United States",
    pola: [...isi(["united states", "usa", "new york", "san francisco", "los angeles", "seattle", "chicago", "boston", "austin"]), "*, us", ...NEGARA_BAGIAN_AS.map((s) => `*, ${s}`)],
  },
  { kode: "ca", id: "Kanada", en: "Canada", pola: isi(["canada", "toronto", "vancouver", "montreal"]) },
  { kode: "gb", id: "Inggris", en: "United Kingdom", pola: [...isi(["united kingdom", "england", "london", "manchester", "scotland"]), "*, uk", "uk"] },
  { kode: "de", id: "Jerman", en: "Germany", pola: isi(["germany", "jerman", "berlin", "munich", "münchen", "hamburg", "frankfurt"]) },
  { kode: "nl", id: "Belanda", en: "Netherlands", pola: isi(["netherlands", "belanda", "amsterdam", "rotterdam"]) },
];

export const cariNegara = (kode) => DAFTAR_NEGARA.find((n) => n.kode === kode) || null;
