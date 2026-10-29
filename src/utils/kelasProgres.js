/**
 * Progres Kelas Dasar, disimpan di browser (per perangkat).
 * Bentuk: { kuis: { [babId]: { [no]: pilihanAsli } }, terakhir: index, latihan: { [kunci]: teks } }
 */

const kunci = (slug) => `jobly:kelas:${slug}`;

export function bacaKelas(slug) {
  try {
    const v = JSON.parse(localStorage.getItem(kunci(slug)) || "null");
    if (v && typeof v === "object") return { kuis: {}, latihan: {}, terakhir: -1, ...v };
  } catch {
    /* penyimpanan tidak tersedia */
  }
  return { kuis: {}, latihan: {}, terakhir: -1 };
}

export function simpanKelas(slug, data) {
  try {
    localStorage.setItem(kunci(slug), JSON.stringify(data));
  } catch {
    /* penyimpanan tidak tersedia */
  }
}

/** Satu bab dianggap selesai jika semua soal kuisnya sudah dijawab. */
export const babSelesai = (bab, data) => {
  const j = data?.kuis?.[bab.id] || {};
  return bab.kuis.every((_, i) => j[i] != null);
};
