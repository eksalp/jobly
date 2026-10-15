-- Penyimpanan foto profil dan sampul LinkedIn Builder.
-- Jalankan sekali di Supabase: SQL Editor -> New query -> tempel -> Run.
--
-- Hemat ruang:
--  - batas 200 KB per berkas (foto dikompres jadi maks 100 KB, sampul 200 KB)
--  - setiap user hanya menulis ke folder miliknya sendiri, dengan nama
--    berkas tetap ("<user_id>/foto" dan "<user_id>/sampul"), sehingga
--    unggahan baru selalu menimpa berkas lama.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('linkedin-media', 'linkedin-media', true, 204800, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "linkedin_media_baca" on storage.objects;
drop policy if exists "linkedin_media_tambah" on storage.objects;
drop policy if exists "linkedin_media_ubah" on storage.objects;
drop policy if exists "linkedin_media_hapus" on storage.objects;

-- Siapa pun boleh melihat (dibutuhkan untuk menampilkan gambar)
create policy "linkedin_media_baca" on storage.objects
  for select using (bucket_id = 'linkedin-media');

-- Hanya pemilik folder yang boleh menambah, mengganti, dan menghapus
create policy "linkedin_media_tambah" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'linkedin-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "linkedin_media_ubah" on storage.objects
  for update to authenticated
  using (bucket_id = 'linkedin-media' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'linkedin-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "linkedin_media_hapus" on storage.objects
  for delete to authenticated
  using (bucket_id = 'linkedin-media' and (storage.foldername(name))[1] = auth.uid()::text);
