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
  { id: "helvetica", nama: "Arial", ket: "Sans · bawaan", css: "Arial, Helvetica, sans-serif", pdf: "helvetica" },
  { id: "carlito", nama: "Calibri", ket: "Sans · setara Calibri", css: "'Carlito', Calibri, sans-serif", file: "carlito" },
  { id: "lato", nama: "Lato", ket: "Sans · modern", css: "'Lato', sans-serif", file: "lato" },
  { id: "roboto", nama: "Roboto", ket: "Sans · rapat", css: "'Roboto', sans-serif", file: "roboto" },
  { id: "times", nama: "Times New Roman", ket: "Serif · bawaan", css: "'Times New Roman', Times, serif", pdf: "times", skala: 1.04 },
  { id: "caladea", nama: "Cambria", ket: "Serif · setara Cambria", css: "'Caladea', Cambria, serif", file: "caladea" },
  { id: "gelasio", nama: "Georgia", ket: "Serif · setara Georgia", css: "'Gelasio', Georgia, serif", file: "gelasio", skala: 0.97 },
  { id: "eb-garamond", nama: "Garamond", ket: "Serif · klasik", css: "'EB Garamond', Garamond, serif", file: "eb-garamond", skala: 1.08 },
];

export const TEMA_CV = [
  { id: "klasik", nama: "Klasik", ket: "Rata kiri, garis di bawah judul bagian" },
  { id: "modern", nama: "Modern", ket: "Nama & judul bagian berwarna aksen" },
  { id: "eksekutif", nama: "Eksekutif", ket: "Kepala CV di tengah, judul diapit garis" },
  { id: "ringkas", nama: "Ringkas", ket: "Tanpa garis, muat lebih banyak isi" },
];

export const AKSEN_CV = [
  { id: "hitam", nama: "Hitam", hex: "#1A1A1A" },
  { id: "navy", nama: "Navy", hex: "#1F3A5F" },
  { id: "hijau", nama: "Hijau tua", hex: "#1E5B4F" },
  { id: "marun", nama: "Marun", hex: "#7A2331" },
  { id: "abu", nama: "Abu arang", hex: "#454B55" },
];

export const GAYA_AWAL = { font: "helvetica", tema: "klasik", aksen: "hitam" };

export function bacaGaya(g) {
  const gaya = { ...GAYA_AWAL, ...(g || {}) };
  return {
    font: FONT_CV.find((f) => f.id === gaya.font) || FONT_CV[0],
    tema: TEMA_CV.find((t) => t.id === gaya.tema)?.id || "klasik",
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
