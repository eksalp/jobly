import { t } from "../i18n.js";
/**
 * Pilihan font, tema, dan warna aksen CV.
 *
 * Semua kombinasi tetap ramah ATS: satu kolom, teks sungguhan (bukan
 * gambar), judul bagian standar, tanpa tabel atau ikon. Yang berubah
 * hanya huruf, perataan kepala CV, gaya judul bagian, dan warna aksen.
 *
 * Font dengan `file` disematkan ke PDF dari /public/fonts/cv (lisensi
 * SIL Open Font License). Font tanpa `file` memakai font bawaan PDF.
 */
export const FONT_CV = [
  { id: "helvetica", nama: "Arial", ket: t("Sans · bawaan", "Sans · built-in"), css: "Arial, Helvetica, sans-serif", pdf: "helvetica" },
  { id: "carlito", nama: "Calibri", ket: t("Sans · setara Calibri", "Sans · Calibri equivalent"), css: "'Carlito', Calibri, sans-serif", file: "carlito" },
  { id: "lato", nama: "Lato", ket: t("Sans · modern", "Sans · modern"), css: "'Lato', sans-serif", file: "lato" },
  { id: "roboto", nama: "Roboto", ket: t("Sans · rapat", "Sans · compact"), css: "'Roboto', sans-serif", file: "roboto" },
  { id: "times", nama: "Times New Roman", ket: t("Serif · bawaan", "Serif · built-in"), css: "'Times New Roman', Times, serif", pdf: "times", skala: 1.04 },
  { id: "caladea", nama: "Cambria", ket: t("Serif · setara Cambria", "Serif · Cambria equivalent"), css: "'Caladea', Cambria, serif", file: "caladea" },
  { id: "gelasio", nama: "Georgia", ket: t("Serif · setara Georgia", "Serif · Georgia equivalent"), css: "'Gelasio', Georgia, serif", file: "gelasio", skala: 0.97 },
  { id: "eb-garamond", nama: "Garamond", ket: t("Serif · klasik", "Serif · classic"), css: "'EB Garamond', Garamond, serif", file: "eb-garamond", skala: 1.08 },
];

export const TEMA_CV = [
  { id: "klasik", nama: t("Klasik", "Classic"), ket: t("Rata kiri, garis di bawah judul bagian", "Left-aligned, rule under section headings") },
  { id: "modern", nama: "Modern", ket: t("Nama & judul bagian berwarna aksen", "Name & headings in the accent colour") },
  { id: "eksekutif", nama: t("Eksekutif", "Executive"), ket: t("Kepala CV di tengah, judul diapit garis", "Centred header, headings between rules") },
  { id: "ringkas", nama: t("Ringkas", "Compact"), ket: t("Tanpa garis, muat lebih banyak isi", "No rules, fits more content") },
];

export const AKSEN_CV = [
  { id: "hitam", nama: t("Hitam", "Black"), hex: "#1A1A1A" },
  { id: "navy", nama: "Navy", hex: "#1F3A5F" },
  { id: "hijau", nama: t("Hijau tua", "Dark green"), hex: "#1E5B4F" },
  { id: "marun", nama: t("Marun", "Maroon"), hex: "#7A2331" },
  { id: "abu", nama: t("Abu arang", "Charcoal"), hex: "#454B55" },
];

export const GAYA_AWAL = { font: "helvetica", tema: "klasik", aksen: "hitam" };

export function bacaGaya(g) {
  const gaya = { ...GAYA_AWAL, ...(g || {}) };
  return {
    font: FONT_CV.find((f) => f.id === gaya.font) || FONT_CV[0],
    tema: TEMA_CV.find((tt) => tt.id === gaya.tema)?.id || "klasik",
    aksen: AKSEN_CV.find((a) => a.id === gaya.aksen) || AKSEN_CV[0],
  };
}

export const hexKeRgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

/* ------------------------------------------------ font untuk jsPDF */
const cache = new Map();

async function base64Dari(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font tidak bisa dimuat (${res.status})`);
  const buf = new Uint8Array(await res.arrayBuffer());
  let biner = "";
  const POTONG = 0x8000;
  for (let i = 0; i < buf.length; i += POTONG) {
    biner += String.fromCharCode.apply(null, buf.subarray(i, i + POTONG));
  }
  const b64 = btoa(biner);
  cache.set(url, b64);
  return b64;
}

/**
 * Daftarkan font ke dokumen jsPDF. Mengembalikan nama keluarga font
 * yang dipakai di doc.setFont(). Font bawaan langsung dikembalikan.
 */
export async function pasangFontPdf(doc, font) {
  if (!font.file) return font.pdf;
  const nama = `cv-${font.file}`;
  const [reg, bold] = await Promise.all([
    base64Dari(`/fonts/cv/${font.file}-400.ttf`),
    base64Dari(`/fonts/cv/${font.file}-700.ttf`),
  ]);
  doc.addFileToVFS(`${nama}-400.ttf`, reg);
  doc.addFont(`${nama}-400.ttf`, nama, "normal");
  doc.addFileToVFS(`${nama}-700.ttf`, bold);
  doc.addFont(`${nama}-700.ttf`, nama, "bold");
  return nama;
}
