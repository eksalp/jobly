/**
 * Progres latihan praktik, disimpan di browser (per perangkat).
 * Bentuk:
 *   kuis:     { [no]: pilihan }
 *   tugas:    { [no]: { jawaban, dikirim, revisi, cek: [bool] } }
 *   simulasi: [pilihan per langkah]
 *   selesai:  bool
 */

const kunci = (slug) => `jobly:latihan:${slug}`;

export const MIN_JAWABAN = 40;
export const MIN_REVISI = 20;

export function bacaProgres(slug) {
  try {
    const v = JSON.parse(localStorage.getItem(kunci(slug)) || "null");
    if (v && typeof v === "object") return { kuis: {}, tugas: {}, simulasi: [], ...v };
  } catch {
    /* penyimpanan tidak tersedia */
  }
  return { kuis: {}, tugas: {}, simulasi: [], selesai: false };
}

export function simpanProgres(slug, data) {
  try {
    localStorage.setItem(kunci(slug), JSON.stringify(data));
  } catch {
    /* penyimpanan tidak tersedia */
  }
}

const panjang = (s) => (s || "").trim().length;

/** Satu tugas dianggap selesai jika jawaban cukup panjang dan revisi dari klien sudah dikerjakan. */
export function tugasSelesai(tugas, data) {
  if (panjang(data?.jawaban) < MIN_JAWABAN) return false;
  if (tugas.revisi && panjang(data?.revisi) < MIN_REVISI) return false;
  return true;
}

/** Latihan selesai jika semua soal dijawab, semua tugas beres, dan simulasi sampai akhir. */
export function hitungSelesai(progres, set) {
  if (!set) return false;
  const kuisBeres = set.kuis.every((_, i) => progres.kuis[i] != null);
  const tugasBeres = set.tugas.every((x, i) => tugasSelesai(x, progres.tugas[i]));
  const simBeres = !set.simulasi || (progres.simulasi || []).filter((x) => x != null).length >= set.simulasi.langkah.length;
  return kuisBeres && tugasBeres && simBeres;
}

export const sudahSelesai = (slug) => Boolean(bacaProgres(slug).selesai);
