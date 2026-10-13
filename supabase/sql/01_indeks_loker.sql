-- =====================================================================
-- Jobly — indeks supaya pencarian loker tetap cepat walau datanya besar
-- Jalankan di Supabase → SQL Editor, di KEDUA project (db1 & db2).
-- Aman dijalankan berulang (IF NOT EXISTS). Kalau project db2 tidak punya
-- salah satu kolom (mis. category), hapus baris indeks kolom itu saja.
-- =====================================================================

-- Pencarian teks "frontend", "akuntan", "Bandung" memakai ILIKE '%kata%'.
-- Tanpa indeks trigram, Postgres membaca seluruh tabel setiap kali.
create extension if not exists pg_trgm;

create index if not exists jobs_title_trgm    on public.jobs using gin (title gin_trgm_ops);
create index if not exists jobs_company_trgm  on public.jobs using gin (company gin_trgm_ops);
create index if not exists jobs_location_trgm on public.jobs using gin (location gin_trgm_ops);
create index if not exists jobs_category_trgm on public.jobs using gin (category gin_trgm_ops);

-- Urutan "terbaru" dan batas 5.000 loker gratis
create index if not exists jobs_created_at_idx on public.jobs (created_at desc nulls last, id desc);

-- Filter yang sering dipakai
create index if not exists jobs_site_idx             on public.jobs (site);
create index if not exists jobs_work_arrangement_idx on public.jobs (work_arrangement);
create index if not exists jobs_employment_type_idx  on public.jobs (employment_type);

-- Statistik tabel diperbarui supaya perencana query memakai indeks di atas
analyze public.jobs;
