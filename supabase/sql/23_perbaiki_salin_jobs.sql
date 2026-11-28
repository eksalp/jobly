-- 23_perbaiki_salin_jobs.sql
-- Jalankan di SQL Editor project DB1 SAJA, setelah 22_cara_melamar.sql.
--
-- Memperbaiki galat saat loker perusahaan disetujui:
--   null value in column "urgent" of relation "jobs" violates not-null constraint
-- Penyebab: jsonb_populate_record mengisi NULL untuk kolom yang tidak disebut,
-- sehingga nilai bawaan kolom (default) tidak terpakai. Sekarang hanya kolom
-- yang memang diisi yang ikut di-insert; kolom lain memakai default tabel jobs.
-- Aman dijalankan ulang.

create or replace function public.sisipkan_ke_jobs(data jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare
  kolom text;
  identitas char;
begin
  select string_agg(quote_ident(a.attname), ', ' order by a.attnum) into kolom
    from pg_attribute a
   where a.attrelid = 'public.jobs'::regclass and a.attnum > 0 and not a.attisdropped
     and a.attgenerated = '' and data ? a.attname;
  if kolom is null then return; end if;

  select attidentity into identitas from pg_attribute
   where attrelid = 'public.jobs'::regclass and attname = 'id';
  execute format(
    'insert into public.jobs (%s) %s select %s from jsonb_populate_record(null::public.jobs, $1)',
    kolom, case when identitas = 'a' then 'overriding system value' else '' end, kolom
  ) using data;
end $$;
revoke all on function public.sisipkan_ke_jobs(jsonb) from public, anon, authenticated;
grant execute on function public.sisipkan_ke_jobs(jsonb) to service_role;

-- Loker perusahaan (pemberi kerja)
create or replace function public.loker_perusahaan_ke_jobs(m public.loker_perusahaan)
returns void language plpgsql security definer set search_path = public as $$
declare
  p public.perusahaan;
  data jsonb;
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

  perform public.sisipkan_ke_jobs(data);
end $$;

-- Loker manual dari Telegram
create or replace function public.loker_manual_ke_jobs(m public.loker_manual)
returns void language plpgsql as $$
declare
  data jsonb;
begin
  delete from public.jobs where id = 900000000 + m.id;
  if not m.aktif then return; end if;

  data := jsonb_strip_nulls(jsonb_build_object(
    'id', 900000000 + m.id,
    'job_id', 'manual-' || m.id,
    'site', 'jobly',
    'job_url', m.link,
    'title', m.posisi,
    'company', m.perusahaan,
    'location', coalesce(nullif(m.lokasi, ''), 'Indonesia'),
    'employment_type', m.tipe,
    'job_type', m.tipe,
    'work_arrangement', m.cara_kerja,
    'is_remote', m.cara_kerja = 'remote',
    'min_amount', m.gaji_min,
    'max_amount', coalesce(m.gaji_max, m.gaji_min),
    'currency', case when coalesce(m.gaji_min, m.gaji_max) is not null then 'IDR' end,
    'interval', case when coalesce(m.gaji_min, m.gaji_max) is not null then 'monthly' end,
    'description', m.deskripsi,
    'category', m.kategori,
    'status', 'open',
    'date_posted', m.created_at::date,
    'created_at', m.created_at,
    'updated_at', now(),
    'urgent', false
  ));

  perform public.sisipkan_ke_jobs(data);
end $$;

-- Salin ulang loker yang sedang tayang / aktif
do $$
declare
  m public.loker_perusahaan;
  n public.loker_manual;
begin
  for m in select * from public.loker_perusahaan where status = 'tayang' loop
    perform public.loker_perusahaan_ke_jobs(m);
  end loop;
  for n in select * from public.loker_manual where aktif loop
    perform public.loker_manual_ke_jobs(n);
  end loop;
end $$;
