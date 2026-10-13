/**
 * Helper tampilan loker: sumber (logo platform), logo perusahaan, gaji,
 * tanggal, dan label lokasi/tipe kerja.
 *
 * Data loker berasal dari bot Telegram (Python) yang menulis ke tabel
 * `jobs`. Kolom `site` berisi salah satu dari dua jenis sumber:
 *   1. Agregator (via JobSpy): linkedin, indeed, glassdoor, google, ...
 *   2. Situs karier perusahaan langsung: bca, pertamina_ptc, shopee, ...
 *
 * Gaya remotefreelance.id: logo SUMBER ditampilkan di bagian bawah kartu
 * (mis. logo Jobstreet). Untuk sumber langsung, sumbernya adalah
 * perusahaan itu sendiri, jadi yang tampil logo perusahaannya.
 */

// Agregator yang dikenal → nama tampilan + domain (untuk favicon)
export const AGREGATOR = {
  linkedin: { nama: "LinkedIn", domain: "linkedin.com", warna: "#0A66C2", huruf: "in" },
  indeed: { nama: "Indeed", domain: "indeed.com", warna: "#2164F3", huruf: "i" },
  glassdoor: { nama: "Glassdoor", domain: "glassdoor.com", warna: "#0CAA41", huruf: "G" },
  google: { nama: "Google Jobs", domain: "google.com", warna: "#4285F4", huruf: "G" },
  ziprecruiter: { nama: "ZipRecruiter", domain: "ziprecruiter.com", warna: "#4A8C2A", huruf: "Z" },
  bayt: { nama: "Bayt", domain: "bayt.com", warna: "#E5512A", huruf: "b" },
  naukri: { nama: "Naukri", domain: "naukri.com", warna: "#275DF5", huruf: "N" },
  jobstreet: { nama: "Jobstreet", domain: "jobstreet.co.id", warna: "#1C2B84", huruf: "J" },
  glints: { nama: "Glints", domain: "glints.com", warna: "#EC272B", huruf: "G" },
  kalibrr: { nama: "Kalibrr", domain: "kalibrr.com", warna: "#1E5BE3", huruf: "K" },
  web3career: { nama: "web3.career", domain: "web3.career", warna: "#6D28D9", huruf: "w3" },
  lokerbumn: { nama: "Loker BUMN", domain: "rekrutmenbersama.fhcibumn.id", warna: "#1E3A8A", huruf: "B" },
  talentics: { nama: "Talentics", domain: "talentics.id", warna: "#0F766E", huruf: "T" },
};

// Domain platform — dipakai supaya halaman perusahaan di LinkedIn dkk.
// tidak dikira situs resmi perusahaan.
const DOMAIN_AGREGATOR = Object.values(AGREGATOR).map((a) => a.domain);

/** Ambil domain bersih dari URL ("https://www.bca.co.id/x" → "bca.co.id"). */
export function domainDari(url) {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Favicon resolusi tinggi lewat layanan Google. */
export function faviconDari(domain, ukuran = 128) {
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    domain,
  )}&sz=${ukuran}`;
}

function bukanAgregator(domain) {
  return domain && !DOMAIN_AGREGATOR.some((d) => domain.endsWith(d));
}

/**
 * Info sumber untuk satu loker.
 * → { nama, logo, langsung, domain }
 */
export function infoSumber(job) {
  const site = job?.site || "";
  const agg = AGREGATOR[site];

  if (agg) {
    return {
      nama: agg.nama,
      logo: faviconDari(agg.domain, 64),
      domain: agg.domain,
      merek: { warna: agg.warna, huruf: agg.huruf },
      langsung: false,
    };
  }

  // Sumber langsung dari situs karier perusahaan
  const domain = domainDari(job?.situsPerusahaan) || domainDari(job?.link);
  return {
    nama: "Situs karier resmi",
    logo: faviconDari(domain, 64),
    domain,
    langsung: true,
  };
}

/** Logo perusahaan: kolom company_logo → favicon situs resmi → null. */
export function logoPerusahaan(job) {
  if (job?.logoPerusahaan) return job.logoPerusahaan;
  const domain = domainDari(job?.situsPerusahaan);
  if (bukanAgregator(domain)) return faviconDari(domain, 128);
  return null;
}

/** Situs resmi perusahaan (tanpa domain agregator) untuk ditampilkan. */
export function situsResmi(job) {
  const domain = domainDari(job?.situsPerusahaan);
  return bukanAgregator(domain) ? domain : null;
}

/** Inisial perusahaan untuk cadangan logo ("PT Bank Central Asia" → "BC"). */
export function inisial(nama) {
  const kata = (nama || "")
    .replace(/\b(PT|Tbk|Persero|CV|Inc|Ltd|Indonesia)\b\.?/gi, " ")
    .replace(/[^A-Za-z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return ((kata[0]?.[0] || "") + (kata[1]?.[0] || "")).toUpperCase() || "?";
}

// ---------------------------------------------------------------- gaji

const INTERVAL = {
  yearly: "tahun",
  year: "tahun",
  annual: "tahun",
  monthly: "bulan",
  month: "bulan",
  bulan: "bulan",
  weekly: "minggu",
  week: "minggu",
  daily: "hari",
  day: "hari",
  hourly: "jam",
  hour: "jam",
};

function angka(n, mataUang) {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  const awalan = !mataUang || mataUang === "IDR" ? "Rp " : `${mataUang} `;
  return awalan + v.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

/**
 * "Rp 3.000.000 — Rp 4.000.000 per bulan", atau null kalau tidak ada.
 * Data gaji hanya ada di sebagian loker (umumnya dari agregator), jadi
 * pemanggil wajib siap menerima null.
 */
export function formatGaji(job) {
  const min = job?.gajiMin;
  const max = job?.gajiMax;
  const per = INTERVAL[(job?.intervalGaji || "").toLowerCase()];
  const ekor = per ? ` per ${per}` : "";

  if (min && max && Number(min) !== Number(max)) {
    return `${angka(min, job.mataUang)} – ${angka(max, job.mataUang)}${ekor}`;
  }
  if (min || max) return `${angka(min || max, job.mataUang)}${ekor}`;

  // Tabel lain menyimpan gaji sebagai teks jadi
  const teks = (job?.gajiTeks || "").toString().trim();
  if (teks && !/tidak disebutkan/i.test(teks)) return teks;
  return null;
}

// ------------------------------------------------------------- tanggal

export function formatTanggal(tgl) {
  if (!tgl) return null;
  const d = new Date(tgl);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function waktuRelatif(tgl) {
  if (!tgl) return null;
  const d = new Date(tgl);
  if (Number.isNaN(d.getTime())) return null;
  const hari = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (hari <= 0) return "Hari ini";
  if (hari === 1) return "Kemarin";
  if (hari < 7) return `${hari} hari lalu`;
  if (hari < 30) return `${Math.floor(hari / 7)} minggu lalu`;
  return formatTanggal(tgl);
}

// -------------------------------------------------------------- label

export const LABEL_LOKASI_KERJA = {
  onsite: "Di kantor",
  remote: "Remote",
  hybrid: "Hybrid",
};

export const LABEL_TIPE_KERJA = {
  "full-time": "Full time",
  kontrak: "Kontrak",
  freelance: "Freelance",
  magang: "Magang",
  "part-time": "Part time",
};

export function labelTipe(job) {
  return LABEL_TIPE_KERJA[job?.tipeKerja] || job?.tipeKerja || null;
}

export function labelLokasiKerja(job) {
  return LABEL_LOKASI_KERJA[job?.lokasiKerja] || null;
}

/** URL halaman detail. "db1:123" → "/loker/db1-123". */
export function urlDetail(job) {
  return `/loker/${String(job.id).replace(":", "-")}`;
}

/** Kebalikan urlDetail: "db1-123" → "db1:123". */
export function idDariSlug(slug) {
  const s = decodeURIComponent(slug || "");
  const i = s.indexOf("-");
  return i > 0 ? `${s.slice(0, i)}:${s.slice(i + 1)}` : s;
}

// ------------------------------------------------- konversi & penanda

/**
 * Perkiraan gaji dalam rupiah untuk loker bergaji mata uang asing.
 * "≈ Rp 71,6 jt per bulan", atau null kalau gajinya sudah rupiah / tidak ada.
 */
export function konversiGaji(job, rates, idrPerFn, ringkasFn) {
  const kode = (job?.mataUang || "").toUpperCase();
  if (!kode || kode === "IDR") return null;
  const per = idrPerFn(kode, rates);
  if (!per) return null;
  const min = Number(job.gajiMin) || 0;
  const max = Number(job.gajiMax) || 0;
  if (!min && !max) return null;
  const intv = INTERVAL[(job?.intervalGaji || "").toLowerCase()];
  const ekor = intv ? ` per ${intv}` : "";
  if (min && max && min !== max) {
    return `≈ ${ringkasFn(min * per)} – ${ringkasFn(max * per).replace("Rp ", "")}${ekor}`;
  }
  return `≈ ${ringkasFn((min || max) * per)}${ekor}`;
}

/** Loker dianggap baru kalau diposting dalam 2 hari terakhir. */
export function lokerBaru(tgl) {
  if (!tgl) return false;
  const t = new Date(tgl).getTime();
  return Number.isFinite(t) && Date.now() - t < 2 * 86400000;
}

/** Nama kota dari kolom lokasi: "Jakarta Selatan, Indonesia" → "Jakarta Selatan". */
export function kotaDari(lokasi) {
  const s = (lokasi || "").split(",")[0].trim();
  return s && s.toLowerCase() !== "indonesia" ? s : null;
}

/**
 * Gaji ringkas untuk kartu: "Rp 15–25 jt / bulan", "USD 4,000–7,000 / bulan".
 * Halaman detail memakai formatGaji (angka lengkap).
 */
export function gajiRingkas(job) {
  const min = Number(job?.gajiMin) || 0;
  const max = Number(job?.gajiMax) || 0;
  if (!min && !max) return formatGaji(job);
  const per = INTERVAL[(job?.intervalGaji || "").toLowerCase()];
  const ekor = per ? ` / ${per}` : "";
  const kode = (job?.mataUang || "IDR").toUpperCase();
  const dua = min && max && min !== max;

  if (kode === "IDR") {
    const jt = (v) => (v / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 });
    if ((dua ? Math.min(min, max) : min || max) >= 1e6) {
      return dua ? `Rp ${jt(min)}–${jt(max)} jt${ekor}` : `Rp ${jt(min || max)} jt${ekor}`;
    }
    const p = (v) => v.toLocaleString("id-ID");
    return dua ? `Rp ${p(min)}–${p(max)}${ekor}` : `Rp ${p(min || max)}${ekor}`;
  }
  const p = (v) => v.toLocaleString("en-US");
  return dua ? `${kode} ${p(min)}–${p(max)}${ekor}` : `${kode} ${p(min || max)}${ekor}`;
}
