-- 18_loker_manual.sql
-- Loker yang diinput manual (lewat /lokerbaru di bot Telegram atau Table Editor).
--
-- Jalankan di SQL Editor project DB1 SAJA, SETELAH 17_urgent_hiring.sql.
--
-- Loker manual disimpan di tabel loker_manual, lalu disalin ke tabel jobs
-- dengan id tetap (900000000 + nomor), jadi link-nya tidak berubah. Saat scrape
-- harian mengosongkan jobs (TRUNCATE), trigger menyalin semua loker manual
-- yang masih aktif kembali ke jobs, sehingga loker manual tidak ikut hilang.
--
-- Input manual di Table Editor: buka loker_manual → Insert row → isi posisi,
-- perusahaan, link (wajib), sisanya opsional → Save. Untuk menutup loker,
-- ubah kolom aktif menjadi false.

create table if not exists public.loker_manual (
  id          bigint generated always as identity primary key,
  posisi      text not null,
  perusahaan  text not null,
  lokasi      text,
  tipe        text,         -- full-time | kontrak | freelance | magang | part-time
  cara_kerja  text,         -- onsite | remote | hybrid
  gaji_min    numeric,
  gaji_max    numeric,
  link        text not null, -- link lamar, atau mailto:email
  deskripsi   text,
  kategori    text,
  aktif       boolean not null default true,
  dibuat_oleh text,
  created_at  timestamptz not null default now()
);
alter table public.loker_manual enable row level security;

-- Salin satu loker manual ke jobs (atau hapus dari jobs bila tidak aktif).
-- jsonb_populate_record hanya mengisi kolom yang memang ada di tabel jobs.
create or replace function public.loker_manual_ke_jobs(m public.loker_manual)
returns void language plpgsql as $$
declare
  data jsonb;
  identitas char;
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

  select attidentity into identitas from pg_attribute
   where attrelid = 'public.jobs'::regclass and attname = 'id';
  if identitas = 'a' then
    insert into public.jobs overriding system value
      select * from jsonb_populate_record(null::public.jobs, data);
  else
    insert into public.jobs
      select * from jsonb_populate_record(null::public.jobs, data);
  end if;
end $$;

-- Setiap perubahan di loker_manual langsung tercermin di jobs
create or replace function public.loker_manual_sinkron()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    delete from public.jobs where id = 900000000 + old.id;
  else
    perform public.loker_manual_ke_jobs(new);
  end if;
  return null;
end $$;

drop trigger if exists loker_manual_sinkron on public.loker_manual;
create trigger loker_manual_sinkron
  after insert or update or delete on public.loker_manual
  for each row execute function public.loker_manual_sinkron();

-- Setelah jobs dikosongkan oleh scrape harian, salin ulang loker manual
create or replace function public.jobs_pulihkan_manual()
returns trigger language plpgsql as $$
declare m public.loker_manual;
begin
  for m in select * from public.loker_manual where aktif loop
    perform public.loker_manual_ke_jobs(m);
  end loop;
  return null;
end $$;

drop trigger if exists jobs_pulihkan_manual on public.jobs;
create trigger jobs_pulihkan_manual
  after truncate on public.jobs
  for each statement execute function public.jobs_pulihkan_manual();
