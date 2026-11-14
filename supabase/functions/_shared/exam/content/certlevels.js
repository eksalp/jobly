// @ts-nocheck
// DISALIN OTOMATIS oleh scripts/sync-exam.mjs dari src/. Jangan diedit di sini.
// Tingkat sertifikat dan syaratnya. Dipakai aplikasi DAN skrip pembuat migrasi SQL (scripts/gen-cert-sql.mjs).
// Kalau syarat atau daftar materi berubah, jalankan: node scripts/gen-cert-sql.mjs lalu npx supabase db push.
export const CERT_LEVELS = [
  { key: 'basic', name: 'Excel Basic', label: 'Dasar', modules: ['dasar', 'hitung'], drillLevel: 'Dasar', minDrill: 1000, minCases: 0,
    skills: 'lembar kerja, referensi sel, format, SUM, AVERAGE, COUNT, ROUND, SUMPRODUCT, dan peringkat' },
  { key: 'intermediate', name: 'Excel Intermediate', label: 'Menengah', modules: ['syarat', 'logika', 'teks', 'tanggal'], drillLevel: 'Menengah', minDrill: 1000, minCases: 0,
    skills: 'SUMIFS, COUNTIFS, IF, IFS, AND/OR, IFERROR, pengolahan teks, dan perhitungan tanggal serta hari kerja' },
  { key: 'advanced', name: 'Excel Advanced', label: 'Advanced', modules: ['cari', 'array', 'keuangan', 'data'], drillLevel: 'Advanced', minDrill: 1000, minCases: 3,
    skills: 'XLOOKUP, INDEX-MATCH, array dinamis, fungsi keuangan, PivotTable, Power Query, dan analisis What-If' },
  { key: 'expert', name: 'Excel Expert', label: 'Expert', modules: ['kolaborasi', 'otomasi', 'lanjut'], drillLevel: 'Expert', minDrill: 1000, minCases: 8,
    skills: 'proteksi dan kolaborasi, macro dan VBA, LAMBDA, statistik, serta fungsi lanjutan' },
];

// Ujian akhir tiap tingkat. Soal khusus ujian disimpan HANYA di server (supabase/functions/_shared/exam/items/)
// dan dinilai di Edge Function "exam". Bobot: praktik 2, tiap tugas studi kasus 2, PivotTable 2, teori 1.
export const EXAM = {
  pass: 80, perDay: 3,
  weights: { practical: 2, caseTask: 2, pivot: 2, theory: 1 },
  levels: {
    basic: { practical: 12, cases: 1, pivot: 0, theory: 10, minutes: 60 },
    intermediate: { practical: 12, cases: 1, pivot: 3, theory: 10, minutes: 75 },
    advanced: { practical: 12, cases: 1, pivot: 4, theory: 10, minutes: 90 },
    expert: { practical: 12, cases: 1, pivot: 4, theory: 10, minutes: 90 },
  },
};
