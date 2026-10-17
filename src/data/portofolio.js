/**
 * Proyek portofolio (Pro & Max).
 *
 * Setiap tugas di latihan praktik (40 profesi × 2 tugas) bisa dipilih
 * sebagai proyek portofolio. Pengguna mengerjakannya dengan lebih lengkap,
 * menanggapi revisi dari klien, lalu Jobly menyusun hasilnya menjadi PDF
 * (dan Excel bila ada tabel). Setiap akun maksimal memilih 2 proyek.
 */
import { PROFESI, KATEGORI_PANDUAN } from "./panduan.js";
import { t } from "../i18n.js";

export const MAKS_PROYEK = 2;
export const PAKET_PORTOFOLIO = ["aktif", "serius"]; // Pro, Max

/** Panjang minimal agar proyek dianggap selesai. */
export const MIN_HASIL = 150;
export const MIN_REVISI = 40;

/**
 * Profesi yang hasil kerjanya lazim berbentuk tabel. Untuk profesi ini
 * editor tabel langsung dibuka dan hasilnya bisa diunduh sebagai Excel.
 * Profesi lain tetap bisa menambahkan tabel bila perlu.
 */
export const PROFESI_TABEL = new Set([
  "data-entry",
  "spreadsheet-template",
  "admin-keuangan",
  "analis-keuangan",
  "analis-statistik",
  "visualisasi-data",
  "anotasi-data-ai",
  "riset-pasar",
  "konsultan-pajak",
]);

export const idProyek = (profesi, tugas) => `${profesi}:${tugas}`;

let cache = null;

/** Katalog semua proyek. Data latihan dimuat terpisah agar halaman lain tetap ringan. */
export async function muatKatalog() {
  if (cache) return cache;
  const { LATIHAN } = await import("./latihan/index.js");
  const daftar = [];
  for (const p of PROFESI) {
    const set = LATIHAN[p.slug];
    if (!set) continue;
    set.tugas.forEach((tg, i) => {
      daftar.push({
        id: idProyek(p.slug, i),
        profesi: p.slug,
        tugas: i,
        namaProfesi: p.judul,
        kategori: p.kategori,
        ...tg,
        tabelAwal: PROFESI_TABEL.has(p.slug) || Boolean(bacaTabelPipa(tg.brief)),
      });
    });
  }
  cache = daftar;
  return daftar;
}

export const kategoriLabel = (id) => KATEGORI_PANDUAN.find((k) => k.id === id)?.judul || "";
export const DAFTAR_KATEGORI = KATEGORI_PANDUAN.map((k) => ({ id: k.id, judul: k.judul }));

/**
 * Ambil tabel "a | b | c" pertama dari teks (mis. data mentah di brief).
 * Mengembalikan { kolom, baris } atau null.
 */
export function bacaTabelPipa(teks) {
  const baris = String(teks || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => (l.match(/\|/g) || []).length >= 1 && l.split("|").length >= 2);
  // Ambil blok berurutan pertama dengan jumlah kolom yang sama
  if (baris.length < 2) return null;
  const pecah = baris.map((l) => l.split("|").map((x) => x.trim()));
  const n = pecah[0].length;
  const blok = [];
  for (const b of pecah) {
    if (b.length !== n) break;
    blok.push(b);
  }
  if (blok.length < 2 || n < 2) return null;
  return { kolom: blok[0], baris: blok.slice(1) };
}

/** Tabel awal untuk editor: dari brief bila ada, selain itu kerangka kosong. */
export function tabelAwal(proyek) {
  const dariBrief = bacaTabelPipa(proyek.brief);
  if (dariBrief) return dariBrief;
  const dariContoh = bacaTabelPipa(proyek.contoh);
  if (dariContoh) return { kolom: dariContoh.kolom, baris: [dariContoh.kolom.map(() => "")] };
  return { kolom: [t("Kolom 1", "Column 1"), t("Kolom 2", "Column 2"), t("Kolom 3", "Column 3")], baris: [["", "", ""], ["", "", ""]] };
}

export const tabelTerisi = (tabel) =>
  Boolean(tabel?.baris?.some((b) => b.some((v) => String(v ?? "").trim())));

const panjang = (s) => String(s || "").trim().length;

/** Status pengerjaan satu proyek. */
export function statusProyek(proyek, data) {
  const hasilCukup = panjang(data?.jawaban) >= MIN_HASIL || (tabelTerisi(data?.tabel) && panjang(data?.jawaban) >= 40);
  const revisiPerlu = Boolean(proyek?.revisi);
  const revisiBeres = !revisiPerlu || panjang(data?.revisi) >= MIN_REVISI;
  const cek = Array.isArray(data?.cek) ? data.cek : [];
  const jumlahCek = (proyek?.rubrik || []).filter((_, i) => cek[i]).length;
  const selesai = hasilCukup && Boolean(data?.dikirim) && revisiBeres && jumlahCek === (proyek?.rubrik || []).length;
  const langkah = !hasilCukup ? 1 : !data?.dikirim ? 2 : !revisiBeres ? 3 : jumlahCek < (proyek?.rubrik || []).length ? 4 : 5;
  return { hasilCukup, revisiBeres, jumlahCek, selesai, langkah };
}

/** Nama berkas aman: "portofolio-virtual-assistant-budi.pdf" */
export const namaBerkas = (...bagian) =>
  bagian
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
