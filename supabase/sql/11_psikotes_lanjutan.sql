-- ============================================================
--  11 · Psikotes lanjutan (Batch K)
--  Menambahkan tes Spasial, CFIT, Army Alpha, sikap kerja AKHLAK,
--  DISC, EPPS, dan 16 tipe kepribadian ke daftar jenis tes yang sah.
--  (Latihan tes gambar tidak dicatat di database.)
--  Aman dijalankan berulang kali.
-- ============================================================

alter table public.tes_sesi drop constraint if exists tes_jenis_sah;
alter table public.tes_sesi
  add constraint tes_jenis_sah check (
    jenis in (
      'tpa', 'kraepelin', 'verbal', 'numerik', 'logika', 'inggris', 'figural', 'kecermatan', 'ketelitian', 'kepribadian',
      'spasial', 'cfit', 'armyalpha', 'akhlak', 'disc', 'epps', 'tipe16'
    )
  );

notify pgrst, 'reload schema';
