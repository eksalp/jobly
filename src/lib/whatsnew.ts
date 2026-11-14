// Penanda "baru" untuk konten yang baru dirilis. Tag otomatis hilang setelah NEW_UNTIL,
// jadi tidak perlu dihapus manual. Untuk rilis berikutnya cukup ganti daftar dan tanggalnya.
export const NEW_UNTIL = '2026-12-15';
/** Materi yang benar-benar baru. */
export const NEW_LESSONS = new Set(['pilih-kolom', 'bentuk-array', 'textbefore-after', 'gs-beda', 'gs-query', 'gs-import', 'ai-rumus', 'kasus-proyek-1-bersih', 'kasus-proyek-2-hitung', 'kasus-proyek-3-ringkas']);
/** Materi lama yang mendapat simulasi interaktif baru. */
export const NEW_SIM_LESSONS = new Set(['sort-filter', 'cond-format', 'data-validation', 'bersih-data', 'grafik', 'format-sel', 'cetak']);
/** Kunci simulasi (Preview) yang baru. */
export const NEW_SIMS = new Set(['sort', 'cf', 'dv', 'dupes', 'textcol', 'chart', 'numfmt', 'print']);

export const isFresh = (now = new Date()) => now.getTime() <= new Date(NEW_UNTIL + 'T23:59:59+07:00').getTime();
export const lessonTag = (id: string): string | null => !isFresh() ? null : NEW_LESSONS.has(id) ? 'baru' : NEW_SIM_LESSONS.has(id) ? 'simulasi baru' : null;
export const simIsNew = (k: string) => isFresh() && NEW_SIMS.has(k);
export const modHasNew = (lessonIds: string[]) => isFresh() && lessonIds.some(id => NEW_LESSONS.has(id) || NEW_SIM_LESSONS.has(id));

/** Ringkasan untuk kotak "Yang baru" di beranda. */
export const WHATS_NEW = {
  id: 'rilis-2026-11c',
  title: 'Yang baru di Jagoan Excel',
  items: [
    { to: '/materi/vlookup', text: 'Demo animasi di setiap materi praktik: lihat rumus diketik langkah demi langkah, lengkap dengan penjelasan dan suara' },
    { to: '/tantangan', text: 'Tantangan harian: satu soal baru setiap hari, catat waktumu dan bagikan' },
    { to: '/kasus/kasus-proyek-1-bersih', text: 'Proyek akhir: bangun laporan penjualan dari data mentah sampai ringkasan untuk atasan' },
    { to: '/materi/gs-beda', text: 'Modul baru Google Sheets dan AI: QUERY, IMPORTRANGE, dan cara memeriksa rumus buatan AI' },
    { to: '/materi/cond-format', text: 'Simulasi baru: grafik, Format Cells, Page Setup, Conditional Formatting, dan lainnya' },
  ],
};
