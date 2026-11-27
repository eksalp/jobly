-- =====================================================================
--  19b · Membersihkan SQL 18 & 19 yang terlanjur dijalankan di DB2
-- =====================================================================
--  Jalankan HANYA di SQL Editor project DB2. Aman dijalankan ulang.
--  Tabel hanya dihapus bila bentuknya memang buatan SQL 18/19, jadi
--  tabel lain yang kebetulan bernama sama tidak tersentuh.
-- =====================================================================

-- Trigger yang dipasang ke tabel jobs
drop trigger if exists jobs_pulihkan_manual on public.jobs;
drop trigger if exists jobs_pulihkan_mitra on public.jobs;

do $$
begin
  -- loker_manual (SQL 18)
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'loker_manual' and column_name = 'dibuat_oleh') then
    drop table public.loker_manual cascade;
    raise notice 'loker_manual dihapus';
  end if;
  -- loker_perusahaan (SQL 19)
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'loker_perusahaan' and column_name = 'sudah_bayar') then
    drop table public.loker_perusahaan cascade;
    raise notice 'loker_perusahaan dihapus';
  end if;
  -- pembelian_kredit (SQL 19)
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'pembelian_kredit' and column_name = 'snap_token') then
    drop table public.pembelian_kredit cascade;
    raise notice 'pembelian_kredit dihapus';
  end if;
  -- perusahaan (SQL 19): hanya bila punya kolom kredit dan kontak_wa
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'perusahaan' and column_name = 'kontak_wa')
     and exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'perusahaan' and column_name = 'kredit') then
    drop table public.perusahaan cascade;
    raise notice 'perusahaan dihapus';
  end if;
end $$;

-- Fungsi
drop function if exists public.loker_manual_ke_jobs cascade;
drop function if exists public.loker_manual_sinkron() cascade;
drop function if exists public.jobs_pulihkan_manual() cascade;
drop function if exists public.masa_tayang_loker() cascade;
drop function if exists public.lunasi_pembelian_kredit(text) cascade;
drop function if exists public.loker_perusahaan_sebelum_ubah() cascade;
drop function if exists public.loker_perusahaan_ke_jobs cascade;
drop function if exists public.loker_perusahaan_sinkron() cascade;
drop function if exists public.perusahaan_sinkron() cascade;
drop function if exists public.rapikan_loker_mitra() cascade;
drop function if exists public.jobs_pulihkan_mitra() cascade;
drop function if exists public.ajukan_loker(bigint) cascade;
drop function if exists public.setujui_loker(bigint) cascade;
drop function if exists public.tolak_loker(bigint, text) cascade;
drop function if exists public.tutup_loker(bigint) cascade;
drop function if exists public.catat_loker_mitra(bigint, text) cascade;

-- Kolom prioritas di tabel jobs DB2 (hanya dipakai DB1)
alter table public.jobs drop column if exists prioritas;

-- Tempat logo perusahaan (hanya dihapus bila masih kosong)
drop policy if exists "logo perusahaan unggah" on storage.objects;
drop policy if exists "logo perusahaan ganti" on storage.objects;
drop policy if exists "logo perusahaan hapus" on storage.objects;
delete from storage.buckets b
 where b.id = 'logo-perusahaan'
   and not exists (select 1 from storage.objects o where o.bucket_id = b.id);
