// @ts-nocheck
// Membaca pesan pengguna menjadi filter pencarian API Jobly.

const KOTA = [
  "Jakarta", "Bandung", "Surabaya", "Medan", "Semarang", "Yogyakarta", "Makassar", "Denpasar", "Bekasi", "Tangerang",
  "Depok", "Bogor", "Malang", "Palembang", "Batam", "Pekanbaru", "Balikpapan", "Samarinda", "Banjarmasin", "Pontianak",
  "Manado", "Padang", "Bandar Lampung", "Cikarang", "Karawang", "Solo", "Cirebon", "Serang",
];
const ALIAS_KOTA = { jogja: "Yogyakarta", jogjakarta: "Yogyakarta", jkt: "Jakarta", sby: "Surabaya", bdg: "Bandung", tangsel: "Tangerang", lampung: "Bandar Lampung" };

/** Pecah teks pengguna menjadi filter API Jobly. */
export function bacaPermintaan(teks) {
  let sisa = ` ${String(teks || "").toLowerCase()} `;
  const f = {};
  const ambil = (re, kunci, nilai) => {
    if (re.test(sisa)) {
      f[kunci] = nilai;
      sisa = sisa.replace(re, " ");
    }
  };
  ambil(/\s(remote|wfh|dari rumah)\s/, "lokasi", "remote");
  ambil(/\s(hybrid)\s/, "lokasi", "hybrid");
  ambil(/\s(freelance|lepas|proyek)\s/, "tipe", "freelance");
  ambil(/\s(magang|internship|intern)\s/, "tipe", "magang");
  ambil(/\s(part time|part-time|paruh waktu)\s/, "tipe", "part-time");
  ambil(/\s(kontrak)\s/, "tipe", "kontrak");
  ambil(/\s(bumn)\s/, "bumn", "1");
  for (const [alias, kota] of Object.entries(ALIAS_KOTA)) ambil(new RegExp(`\\s${alias}\\s`), "kota", kota);
  for (const kota of KOTA) ambil(new RegExp(`\\s${kota.toLowerCase()}\\s`), "kota", kota);
  // Kata pengisi yang tidak menyaring apa pun
  sisa = sisa.replace(/(^|\s)(di|in|loker|lowongan|lowker|kerja|kerjaan|cari|carikan|ada|nggak|gak|dong|yang|untuk|buat|info|minta|tolong|kak|min)(?=\s)/g, " ");
  const q = sisa.replace(/[^\p{L}\p{N}+#\- ]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 60);
  if (q) f.q = q;
  return f;
}

