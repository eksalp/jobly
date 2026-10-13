/**
 * Peta Gaji — kisaran gaji dihitung dari loker Jobly sendiri.
 *
 * Hanya loker yang mencantumkan angka gaji yang dipakai. Semua nominal
 * disetarakan ke rupiah per bulan (kurs harian untuk mata uang asing),
 * lalu dikelompokkan per bidang, per kota, dan per cara kerja.
 */
import { klasifikasiLoker } from "./petaLoker.js";
import { kotaDari } from "./sumberLoker.js";
import { lokal, t } from "../i18n.js";

const PER_BULAN = {
  yearly: 1 / 12,
  year: 1 / 12,
  annual: 1 / 12,
  annually: 1 / 12,
  monthly: 1,
  month: 1,
  bulan: 1,
  weekly: 4.33,
  week: 4.33,
  daily: 22,
  day: 22,
  hourly: 173,
  hour: 173,
};

export const MIN_DATA = 3; // kelompok dengan data lebih sedikit tidak ditampilkan

/** Gaji per bulan dalam rupiah, atau null kalau tidak bisa dipastikan. */
export function gajiBulananRupiah(job, idrPerFn, rates) {
  const min = Number(job.gajiMin) || 0;
  const max = Number(job.gajiMax) || 0;
  if (!min && !max) return null;
  const nilai = min && max ? (min + max) / 2 : min || max;

  const kode = (job.mataUang || "IDR").toUpperCase();
  const kurs = kode === "IDR" ? 1 : idrPerFn(kode, rates);
  if (!kurs) return null;

  let faktor = PER_BULAN[(job.intervalGaji || "").toLowerCase()];
  if (faktor == null) {
    // Tanpa keterangan periode: tebak dari besarnya angka (rupiah)
    const rp = nilai * kurs;
    if (rp >= 1e6 && rp <= 1.2e8) faktor = 1;
    else if (rp > 1.2e8 && rp <= 2e9) faktor = 1 / 12;
    else return null;
  }
  const hasil = nilai * kurs * faktor;
  // Buang angka yang hampir pasti salah ketik / salah satuan
  if (hasil < 8e5 || hasil > 4e8) return null;
  return hasil;
}

function kuantil(urut, q) {
  if (!urut.length) return 0;
  const pos = (urut.length - 1) * q;
  const bawah = Math.floor(pos);
  const atas = Math.ceil(pos);
  return urut[bawah] + (urut[atas] - urut[bawah]) * (pos - bawah);
}

export function ringkasan(nilai) {
  const urut = [...nilai].sort((a, b) => a - b);
  return {
    n: urut.length,
    min: urut[0] ?? 0,
    p25: kuantil(urut, 0.25),
    median: kuantil(urut, 0.5),
    p75: kuantil(urut, 0.75),
    max: urut[urut.length - 1] ?? 0,
  };
}

function kelompokkan(baris, kunciFn) {
  const peta = new Map();
  for (const b of baris) {
    const k = kunciFn(b);
    if (!k) continue;
    if (!peta.has(k)) peta.set(k, []);
    peta.get(k).push(b.gaji);
  }
  const semua = [...peta.entries()].map(([label, nilai]) => ({ label, ...ringkasan(nilai) }));
  return {
    tampil: semua.filter((g) => g.n >= MIN_DATA).sort((a, b) => b.median - a.median),
    tersembunyi: semua.filter((g) => g.n < MIN_DATA).length,
  };
}

function normalKota(lokasi, daftarKota) {
  const l = (lokasi || "").toLowerCase();
  const k = daftarKota.find((x) => l.includes(x.toLowerCase()));
  return k || null;
}

/**
 * @returns {{ baris, total, perBidang, perKota, perCara }}
 *   baris: [{ job, gaji }] — loker dengan gaji yang bisa dihitung
 */
export function hitungPetaGaji(jobs, { idrPerFn, rates, daftarKota }) {
  const baris = [];
  for (const job of jobs) {
    const gaji = gajiBulananRupiah(job, idrPerFn, rates);
    if (gaji) baris.push({ job, gaji });
  }
  return {
    baris,
    total: baris.length,
    perBidang: kelompokkan(baris, (b) => klasifikasiLoker(b.job)?.label || null),
    perKota: kelompokkan(baris, (b) =>
      b.job.lokasiKerja === "remote" ? null : normalKota(b.job.lokasi, daftarKota) || kotaDari(b.job.lokasi),
    ),
    perCara: kelompokkan(baris, (b) =>
      ({ remote: "Remote", hybrid: "Hybrid", onsite: "Di kantor" })[b.job.lokasiKerja] || null,
    ),
  };
}

/** Cari kisaran gaji untuk satu posisi, mis. "akuntan" atau "frontend". */
export function gajiPosisi(baris, kata) {
  const kunci = kata.toLowerCase().split(/\s+/).filter(Boolean);
  if (!kunci.length) return null;
  const cocok = baris.filter((b) => {
    const tt = `${b.job.posisi} ${b.job.kategori || ""}`.toLowerCase();
    return kunci.every((k) => tt.includes(k));
  });
  if (!cocok.length) return { n: 0, contoh: [] };
  return {
    ...ringkasan(cocok.map((b) => b.gaji)),
    contoh: [...cocok].sort((a, b) => b.gaji - a.gaji).slice(0, 6),
  };
}

/** "Rp 7,5 jt" — ringkas untuk label grafik. */
export function jt(n) {
  if (n >= 1e9) return `Rp ${(n / 1e9).toLocaleString(lokal(), { maximumFractionDigits: 1 })} M`;
  if (n >= 1e6) return `Rp ${(n / 1e6).toLocaleString(lokal(), { maximumFractionDigits: 1 })} ${t("jt", "M")}`;
  return `Rp ${Math.round(n / 1e3).toLocaleString(lokal())} ${t("rb", "K")}`;
}
