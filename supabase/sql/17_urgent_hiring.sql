-- 17_urgent_hiring.sql
-- Tanda "Urgently hiring" pada loker.
--
-- Jalankan di SQL Editor KEDUA project (DB1 dan DB2). Bila tabel loker
-- DB2 bernama lain (mis. jobs_v1), ganti semua "public.jobs" di bawah.
--
-- Kenapa ada tabel loker_urgent terpisah?
--   Scrape harian (01.00 WIB) mengosongkan tabel jobs lalu mengisinya ulang,
--   jadi tanda yang hanya disimpan di jobs akan hilang setiap malam. Daftar
--   urgent disimpan di loker_urgent berdasarkan job_url (link loker tidak
--   berubah walau di-scrape ulang), lalu trigger memasangnya kembali setiap
--   loker yang sama masuk lagi.
--
-- Cara menandai manual di Table Editor:
--   buka tabel loker_urgent → Insert row → isi job_url (salin dari kolom
--   job_url di tabel jobs) dan, bila perlu, sampai (tanggal berakhir).
--   Kosongkan "sampai" untuk tanpa batas. Hapus barisnya untuk melepas.

alter table public.jobs add column if not exists urgent boolean not null default false;
alter table public.jobs add column if not exists urgent_sampai timestamptz;
create index if not exists jobs_urgent_idx on public.jobs (urgent_sampai) where urgent;

create table if not exists public.loker_urgent (
  job_url   text primary key,
  sampai    timestamptz,
  catatan   text,
  dibuat_at timestamptz not null default now()
);
-- Tanpa policy: hanya server (service role) dan SQL Editor yang bisa membaca/menulis
alter table public.loker_urgent enable row level security;

-- 1. Loker yang masuk (scrape ulang) otomatis mendapat tanda urgent-nya kembali
create or replace function public.jobs_terapkan_urgent()
returns trigger language plpgsql as $$
declare u public.loker_urgent;
begin
  if new.job_url is not null then
    select * into u from public.loker_urgent where job_url = new.job_url;
    if found and (u.sampai is null or u.sampai > now()) then
      new.urgent := true;
      new.urgent_sampai := u.sampai;
    end if;
  end if;
  return new;
end $$;


-- 2. Menambah/mengubah/menghapus baris loker_urgent langsung berlaku di jobs
create or replace function public.loker_urgent_sinkron()
returns trigger language plpgsql as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then
    update public.jobs set urgent = false, urgent_sampai = null where job_url = old.job_url;
  end if;
  if tg_op in ('INSERT', 'UPDATE') then
    update public.jobs set urgent = true, urgent_sampai = new.sampai where job_url = new.job_url;
  end if;
  return null;
end $$;

-- Trigger hanya dipasang bila tabel jobs punya kolom job_url
-- (tabel papan-loker di DB2 mungkin memakai nama kolom lain)
do $$
begin
  drop trigger if exists jobs_terapkan_urgent on public.jobs;
  drop trigger if exists loker_urgent_sinkron on public.loker_urgent;
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'jobs' and column_name = 'job_url') then
    create index if not exists jobs_job_url_idx on public.jobs (job_url);
    create trigger jobs_terapkan_urgent
      before insert on public.jobs
      for each row execute function public.jobs_terapkan_urgent();
    create trigger loker_urgent_sinkron
      after insert or update or delete on public.loker_urgent
      for each row execute function public.loker_urgent_sinkron();
    raise notice 'Urgently hiring siap.';
  else
    raise notice 'Kolom job_url tidak ada: tandai urgent lewat kolom urgent di tabel jobs saja.';
  end if;
end $$;
