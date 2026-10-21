-- ============================================================
--  08 · Jenis tes tambahan (Batch G)
--  Menambahkan tes Bahasa Inggris, Figural, Kecermatan, dan
--  TPA Lengkap (100 soal) ke daftar jenis tes yang sah.
--  Aman dijalankan berulang kali.
-- ============================================================

alter table public.tes_sesi drop constraint if exists tes_jenis_sah;
alter table public.tes_sesi
  add constraint tes_jenis_sah check (
    jenis in (
      'kraepelin', 'verbal', 'numerik', 'logika', 'ketelitian', 'kepribadian',
      'inggris', 'figural', 'kecermatan', 'tpa'
    )
  );

notify pgrst, 'reload schema';
