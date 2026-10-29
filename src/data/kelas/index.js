/**
 * Kelas Dasar: kursus gratis untuk pemula di setiap profesi remote.
 *
 * Isi tiap kelas cukup panjang, jadi dimuat terpisah saat halaman kelas
 * dibuka. Daftar slug di sini cukup untuk menampilkan lencana "Ada kelas".
 *
 * Bentuk satu kelas: { slug, judul, ringkas, untuk, durasi, hasil[],
 *   bab: [{ id, judul, menit, isi: [blok], kuis: [{ q, o: [benar, ...salah], e }] }],
 *   tugasAkhir: { judul, brief, kriteria[] } }
 * Jenis blok ada di _blok.js.
 */

const MUAT = {
  copywriter: () => import("./copywriter.js"),
  "content-writer": () => import("./content-writer.js"),
  "virtual-assistant": () => import("./virtual-assistant.js"),
  "admin-media-sosial": () => import("./admin-media-sosial.js"),
  "customer-support": () => import("./customer-support.js"),
  "data-entry": () => import("./data-entry.js"),
  "desainer-grafis": () => import("./desainer-grafis.js"),
  "video-editor": () => import("./video-editor.js"),
  "ads-specialist": () => import("./ads-specialist.js"),
  "seo-specialist": () => import("./seo-specialist.js"),
};

export const SLUG_KELAS = Object.keys(MUAT);
export const adaKelas = (slug) => Object.prototype.hasOwnProperty.call(MUAT, slug);

export async function muatKelas(slug) {
  if (!adaKelas(slug)) return null;
  const m = await MUAT[slug]();
  return m.default;
}
