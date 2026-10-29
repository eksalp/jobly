-- ============================================================
--  13 · Tes BUMN & Bank Indonesia
--  Menambahkan Simulasi RBB BUMN, TKD BUMN, Wawasan Kebangsaan,
--  Learning Agility, dan Pengetahuan Umum & Kebanksentralan.
--  Aman dijalankan berulang kali.
-- ============================================================

alter table public.tes_sesi drop constraint if exists tes_jenis_sah;
alter table public.tes_sesi
  add constraint tes_jenis_sah check (
    jenis in (
      'tpa', 'kraepelin', 'verbal', 'numerik', 'logika', 'inggris', 'figural', 'kecermatan', 'ketelitian', 'kepribadian',
      'spasial', 'cfit', 'armyalpha', 'akhlak', 'disc', 'epps', 'tipe16',
      'rbb', 'tkd', 'twk', 'learning', 'bi'
    )
  );

notify pgrst, 'reload schema';
