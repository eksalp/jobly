-- =====================================================================
--  09 · Portofolio: studi kasus terstruktur + lampiran gambar/mockup
-- =====================================================================
--  Jalankan sekali di Supabase → SQL Editor (aman dijalankan ulang).
--
--  • Kolom baru di portofolio_proyek:
--      studi    → ringkasan, tantangan, peran, proses, hasil, pelajaran
--      lampiran → daftar gambar [{ path, ket, w, h }]
--  • Bucket Storage privat "portofolio": hanya gambar JPG/PNG/WebP,
--    maksimal 2 MB per berkas. Setiap pengguna hanya bisa membaca dan
--    menulis di foldernya sendiri ({user_id}/...), maksimal 16 berkas,
--    dan hanya jika sudah memilih proyek portofolio.
-- =====================================================================

alter table public.portofolio_proyek
  add column if not exists studi jsonb not null default '{}'::jsonb,
  add column if not exists lampiran jsonb not null default '[]'::jsonb;

alter table public.portofolio_proyek drop constraint if exists portofolio_studi_batas;
alter table public.portofolio_proyek
  add constraint portofolio_studi_batas check (
    jsonb_typeof(studi) = 'object'
    and pg_column_size(studi) <= 30000
    and jsonb_typeof(lampiran) = 'array'
    and jsonb_array_length(lampiran) <= 6
    and pg_column_size(lampiran) <= 8000
  );

-- Bucket privat untuk gambar portofolio
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portofolio', 'portofolio', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Jumlah berkas milik pengguna (security definer supaya tidak memicu
-- RLS berulang saat dipakai di dalam policy storage.objects)
create or replace function public.portofolio_jumlah_berkas(uid uuid)
returns int
language sql
stable
security definer
set search_path = public, storage
as $$
  select count(*)::int from storage.objects
  where bucket_id = 'portofolio' and (storage.foldername(name))[1] = uid::text;
$$;

create or replace function public.portofolio_boleh_unggah(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.portofolio_proyek p where p.user_id = uid)
     and public.portofolio_jumlah_berkas(uid) < 16;
$$;

drop policy if exists "portofolio berkas baca sendiri" on storage.objects;
create policy "portofolio berkas baca sendiri" on storage.objects
  for select to authenticated
  using (bucket_id = 'portofolio' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "portofolio berkas unggah sendiri" on storage.objects;
create policy "portofolio berkas unggah sendiri" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'portofolio'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.portofolio_boleh_unggah(auth.uid())
  );

drop policy if exists "portofolio berkas hapus sendiri" on storage.objects;
create policy "portofolio berkas hapus sendiri" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portofolio' and (storage.foldername(name))[1] = auth.uid()::text);

-- Proyek yang sudah punya lampiran atau studi kasus tidak bisa dilepas
drop policy if exists "portofolio hapus yang belum dikerjakan" on public.portofolio_proyek;
create policy "portofolio hapus yang belum dikerjakan" on public.portofolio_proyek
  for delete using (
    auth.uid() = user_id
    and jawaban = ''
    and tabel is null
    and dikirim = false
    and lampiran = '[]'::jsonb
  );

notify pgrst, 'reload schema';
