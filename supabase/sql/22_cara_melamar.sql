-- =====================================================================
--  22 · Cara melamar: link perusahaan, formulir Workly, atau email
-- =====================================================================
--  Jalankan sekali di SQL Editor project DB1, setelah SQL 19–21.
--  Aman dijalankan ulang.
--
--  Perusahaan memilih cara pelamar melamar:
--   link  → diarahkan ke formulir/halaman milik perusahaan (Google Form,
--           situs karier, dsb). Kolom link.
--   form  → pelamar mengisi formulir Workly di workly.id/lamar/<nomor>.
--           Lamaran tersimpan di tabel lamaran_mitra, CV di bucket
--           cv-pelamar, dan perusahaan menerima email berisi lamaran itu
--           (edge function kirim-lamaran). Kolom email_lamaran = tujuan email.
--   email → pelamar mengirim email langsung ke perusahaan. Kolom email_lamaran.
-- =====================================================================

-- ------------------------------------------------------- kolom loker
alter table public.loker_perusahaan add column if not exists cara_lamar text not null default 'link';
alter table public.loker_perusahaan add column if not exists email_lamaran text;
do $$ begin
  alter table public.loker_perusahaan add constraint loker_perusahaan_cara_lamar_cek
    check (cara_lamar in ('link', 'form', 'email'));
exception when duplicate_object then null; end $$;

grant insert (cara_lamar, email_lamaran) on public.loker_perusahaan to authenticated;
grant update (cara_lamar, email_lamaran) on public.loker_perusahaan to authenticated;

-- Perubahan cara melamar pada loker yang tayang juga dicek ulang admin
create or replace function public.loker_perusahaan_sebelum_ubah()
returns trigger language plpgsql as $$
begin
  new.diubah_at := now();
  if current_user = 'authenticated' and old.status = 'tayang'
     and (new.posisi, new.lokasi, new.tipe, new.cara_kerja, new.kategori, new.jenjang, new.pendidikan,
          new.gaji_min, new.gaji_max, new.tampilkan_gaji, new.link, new.deskripsi, new.cara_lamar, new.email_lamaran)
         is distinct from
         (old.posisi, old.lokasi, old.tipe, old.cara_kerja, old.kategori, old.jenjang, old.pendidikan,
          old.gaji_min, old.gaji_max, old.tampilkan_gaji, old.link, old.deskripsi, old.cara_lamar, old.email_lamaran) then
    new.status := 'menunggu';
  end if;
  return new;
end $$;

-- Salinan ke tabel jobs memakai alamat lamaran yang sesuai
create or replace function public.loker_perusahaan_ke_jobs(m public.loker_perusahaan)
returns void language plpgsql security definer set search_path = public as $$
declare
  p public.perusahaan;
  data jsonb;
  identitas char;
begin
  delete from public.jobs where id = 800000000 + m.id;
  if m.status <> 'tayang' or m.tayang_sampai is null or m.tayang_sampai <= now() then return; end if;
  select * into p from public.perusahaan where user_id = m.user_id;

  data := jsonb_strip_nulls(jsonb_build_object(
    'id', 800000000 + m.id,
    'job_id', 'mitra-' || m.id,
    'site', 'jobly',
    -- Alamat lamaran sesuai cara melamar yang dipilih perusahaan
    'job_url', case coalesce(m.cara_lamar, 'link')
                 when 'form' then 'https://workly.id/lamar/' || m.id
                 when 'email' then 'mailto:' || m.email_lamaran
                                   || '?subject=' || replace(replace('Lamaran ' || m.posisi || ' (via Workly)', ' ', '%20'), '&', '%26')
                 else m.link
               end,
    'title', m.posisi,
    'company', p.nama,
    'company_logo', p.logo_url,
    'company_url', p.situs,
    'company_url_direct', p.situs,
    'company_industry', p.industri,
    'company_description', p.deskripsi,
    'company_num_employees', p.ukuran,
    'location', coalesce(nullif(m.lokasi, ''), nullif(p.kota, ''), 'Indonesia'),
    'employment_type', m.tipe,
    'job_type', m.tipe,
    'work_arrangement', m.cara_kerja,
    'is_remote', m.cara_kerja = 'remote',
    'category', m.kategori,
    'job_level', m.jenjang,
    'experience_range', m.jenjang,
    'min_amount', case when m.tampilkan_gaji then m.gaji_min end,
    'max_amount', case when m.tampilkan_gaji then coalesce(m.gaji_max, m.gaji_min) end,
    'currency', case when m.tampilkan_gaji and coalesce(m.gaji_min, m.gaji_max) is not null then 'IDR' end,
    'interval', case when m.tampilkan_gaji and coalesce(m.gaji_min, m.gaji_max) is not null then 'monthly' end,
    'description', m.deskripsi || case when nullif(m.pendidikan, '') is not null
                                       then E'\n\nPendidikan minimal: ' || m.pendidikan else '' end,
    'status', 'open',
    'prioritas', true,
    'date_posted', m.tayang_mulai::date,
    'created_at', m.tayang_mulai,
    'updated_at', now()
  ));

  select attidentity into identitas from pg_attribute
   where attrelid = 'public.jobs'::regclass and attname = 'id';
  if identitas = 'a' then
    insert into public.jobs overriding system value
      select * from jsonb_populate_record(null::public.jobs, data);
  else
    insert into public.jobs select * from jsonb_populate_record(null::public.jobs, data);
  end if;
end $$;

-- Perbarui loker yang sedang tayang
do $$
declare m public.loker_perusahaan;
begin
  for m in select * from public.loker_perusahaan where status = 'tayang' loop
    perform public.loker_perusahaan_ke_jobs(m);
  end loop;
end $$;

-- ------------------------------------------------------ tabel lamaran
create table if not exists public.lamaran_mitra (
  id          bigint generated always as identity primary key,
  loker_id    bigint not null references public.loker_perusahaan (id) on delete cascade,
  pelamar_id  uuid not null references auth.users (id) on delete cascade,
  nama        text not null,
  email       text not null,
  telepon     text,
  domisili    text,
  tautan      text,          -- LinkedIn / portofolio
  pesan       text,          -- surat lamaran singkat
  cv_path     text not null, -- path di bucket cv-pelamar
  status      text not null default 'baru'
              check (status in ('baru', 'dilihat', 'diproses', 'ditolak', 'diterima')),
  dibuat_at   timestamptz not null default now(),
  unique (loker_id, pelamar_id)
);
create index if not exists lamaran_mitra_loker_idx on public.lamaran_mitra (loker_id, dibuat_at desc);
alter table public.lamaran_mitra enable row level security;

-- Pelamar melihat lamarannya sendiri; perusahaan melihat lamaran untuk lokernya
drop policy if exists "lamaran baca" on public.lamaran_mitra;
create policy "lamaran baca" on public.lamaran_mitra
  for select to authenticated
  using (
    pelamar_id = auth.uid()
    or exists (select 1 from public.loker_perusahaan l where l.id = loker_id and l.user_id = auth.uid())
    or public.saya_admin()
  );
-- Perusahaan hanya boleh mengubah status lamaran
drop policy if exists "lamaran ubah status" on public.lamaran_mitra;
create policy "lamaran ubah status" on public.lamaran_mitra
  for update to authenticated
  using (exists (select 1 from public.loker_perusahaan l where l.id = loker_id and l.user_id = auth.uid()))
  with check (exists (select 1 from public.loker_perusahaan l where l.id = loker_id and l.user_id = auth.uid()));
revoke insert, update, delete on public.lamaran_mitra from authenticated, anon;
grant select on public.lamaran_mitra to authenticated;
grant update (status) on public.lamaran_mitra to authenticated;
-- Lamaran baru hanya lewat edge function kirim-lamaran (service role)

-- ------------------------------------------------------- CV pelamar
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cv-pelamar', 'cv-pelamar', false, 2097152, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
                               allowed_mime_types = excluded.allowed_mime_types;

-- Pelamar mengunggah ke foldernya sendiri: <user id>/<file>.pdf
drop policy if exists "cv pelamar unggah" on storage.objects;
create policy "cv pelamar unggah" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cv-pelamar' and (storage.foldername(name))[1] = auth.uid()::text);
-- Dibaca oleh pemiliknya, atau perusahaan yang menerima lamaran dengan CV itu
drop policy if exists "cv pelamar baca" on storage.objects;
create policy "cv pelamar baca" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'cv-pelamar' and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1 from public.lamaran_mitra lm
        join public.loker_perusahaan l on l.id = lm.loker_id
        where lm.cv_path = storage.objects.name and l.user_id = auth.uid()
      )
    )
  );
