/**
 * Pemetaan baris tabel `jobs` → objek loker yang dipakai UI, plus
 * klasifikasi bidang. Murni JavaScript tanpa ketergantungan browser:
 * dipakai di aplikasi dan di server API (/api/loker).
 */
import { TAXONOMY } from "../data/taxonomy.js";

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
  // Kerja online (mis. dari tabel freelance) sering hanya menulis lokasinya
  const lok = `${row.location || row.lokasi || ""} ${tipe}`.toLowerCase();
  if (/\b(remote|online|wfh|work from home|dari rumah|anywhere|daring)\b/.test(lok)) return "remote";
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

// Judul dari sebagian scraper ditulis HURUF BESAR SEMUA. Ubah jadi
// kapital biasa, singkatan dalam kurung (mis. "(MDP)") tetap utuh.
export function rapikanJudul(judul) {
  const t = String(judul || "").trim();
  if (!t || t !== t.toUpperCase() || !/[A-Z]{4,}/.test(t)) return t;
  return t
    .toLowerCase()
    .replace(/(^|[\s\-/(])([a-z])/g, (m, a, b) => a + b.toUpperCase())
    .replace(/\(([^)]{1,6})\)/g, (m, isi) => `(${isi.toUpperCase()})`)
    .replace(/\b(Dan|Di|Ke|Dari|Untuk|Atau|Of|And|For|The|In|At|To)\b/g, (m, w, i) =>
      i === 0 ? w : w.toLowerCase(),
    )
    .replace(SINGKATAN, (m) => m.toUpperCase());
}

// Singkatan yang harus tetap kapital setelah judul dirapikan
const SINGKATAN =
  /\b(It|Hr|Hrd|Hrbp|Qa|Qc|Ui|Ux|Ai|Seo|Sem|Cs|Ga|Pr|Ios|Sap|Sql|Pt|Bumn|Mt|Odp|Mdp|Erp|Crm|Kol|Ppic|Hse|K3|Smk|D3|S1|S2|Spg|Spb|Bd|Ceo|Cfo|Cto|Coo|Vp|Api|Mep|Gis)\b/g;

// Ubah baris hasil query Supabase jadi bentuk yang dipakai UI di sini.
// `source` dipakai buat bikin id gabungan yang aman kalau datanya digabung
// dari beberapa project Supabase sekaligus (dua tabel beda project bisa
// aja punya id mentah yang sama persis padahal itu loker yang berbeda).
export function mapSupabaseJob(row, source = "db1") {
  const tipeKerja = readTipeKerja(row);
  // Freelance dari project kedua dikerjakan online kecuali ditandai lain
  const lokasiKerja =
    readLokasiKerja(row) ?? (source === "db2" && String(tipeKerja || "").includes("freelance") ? "remote" : null); // null | "full-time" | "kontrak" | "freelance" | "magang"
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
    posisi: rapikanJudul(row.title || row.posisi) || "Tanpa judul",
    perusahaan: row.company || row.perusahaan || "Tidak disebutkan",
    lokasiKerja, // "onsite" | "remote" | "hybrid"
    tipeKerja, // "fulltime" | "contract" | "freelance" | "internship" | "parttime"
    tipe: lokasiKerja, // dipertahankan buat kode lama yang masih baca job.tipe
    kategori, // mis. "finance accounting", bisa kosong kalau kolom category/kategori null
    lokasi: row.location || row.lokasi || "Tidak disebutkan",
    gaji: formatGaji(row),
    link: row.job_url || row.job_url_direct || row.link || "#",
    deskripsi: row.description || row.deskripsi || "",
    // --- Data tambahan untuk kartu & halaman detail ---
    // `site` = sumber scraping dari bot Telegram (linkedin, indeed, bca,
    // pertamina_ptc, ...). Dipakai untuk menampilkan logo sumber.
    site: (row.site || "").toString().toLowerCase().trim() || null,
    logoPerusahaan: row.company_logo || null,
    situsPerusahaan: row.company_url_direct || row.company_url || null,
    industri: row.company_industry || null,
    jenjang: row.job_level || row.experience_range || null,
    fungsi: row.job_function || null,
    tanggal: row.date_posted || row.posted_at || row.created_at || null,
    gajiMin: row.min_amount ?? row.salary_min ?? null,
    gajiMax: row.max_amount ?? row.salary_max ?? null,
    mataUang: row.currency || row.salary_currency || null,
    intervalGaji: row.interval || null,
    gajiTeks: row.gaji || row.salary || null,
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
