/**
 * Progres latihan praktik, disimpan di browser (per perangkat).
 * Bentuk: { kuis: { [no]: pilihan }, tugas: { [no]: { jawaban, cek: [bool] } }, selesai: bool }
 */

const kunci = (slug) => `jobly:latihan:${slug}`;

export function bacaProgres(slug) {
  try {
    const v = JSON.parse(localStorage.getItem(kunci(slug)) || "null");
    if (v && typeof v === "object") return { kuis: {}, tugas: {}, ...v };
  } catch {
    /* penyimpanan tidak tersedia */
  }
  return { kuis: {}, tugas: {}, selesai: false };
}

export function simpanProgres(slug, data) {
  try {
    localStorage.setItem(kunci(slug), JSON.stringify(data));
  } catch {
    /* penyimpanan tidak tersedia */
  }
}

/** Latihan dianggap selesai jika semua soal dijawab dan semua tugas dikerjakan. */
export function hitungSelesai(progres, set) {
  if (!set) return false;
  const kuisBeres = set.kuis.every((_, i) => progres.kuis[i] != null);
  const tugasBeres = set.tugas.every((_, i) => (progres.tugas[i]?.jawaban || "").trim().length >= 40);
  return kuisBeres && tugasBeres;
}

export const sudahSelesai = (slug) => Boolean(bacaProgres(slug).selesai);
