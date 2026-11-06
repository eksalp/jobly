-- =====================================================================
--  Tutup tabel jobs dari akses langsung (anti-scraping)
-- =====================================================================
--  Kunci anon Supabase memang ikut terkirim ke browser (dibutuhkan untuk
--  login). Selama tabel jobs masih bisa dibaca role anon, siapa pun bisa
--  menyedot SELURUH tabel langsung ke Supabase tanpa lewat /api/loker,
--  sehingga batas gratis, batas kecepatan, dan cek asal tidak berlaku.
--
--  WAJIB sebelum menjalankan file ini:
--    1. Vercel → Settings → Environment Variables, tambahkan:
--         SUPABASE_SERVICE_ROLE_KEY    (service_role key project 1)
--         SUPABASE_SERVICE_ROLE_KEY_2  (service_role key project 2)
--       Kunci ini RAHASIA: jangan diawali VITE_ dan jangan dikirim ke chat.
--       Lalu Redeploy, dan pastikan jobly.my.id masih menampilkan loker.
--    2. Pastikan bot scraper menulis memakai service_role key, bukan anon.
--
--  Jalankan di SQL Editor KEDUA project (project 1 dan project 2).
--  Aman dijalankan ulang. Cara membatalkan ada di bagian bawah.
-- =====================================================================

alter table public.jobs enable row level security;

-- Hapus semua policy SELECT yang terbuka di tabel jobs (namanya bisa
-- berbeda-beda di tiap project, jadi dicari otomatis).
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'jobs' and cmd in ('SELECT', 'ALL')
  loop
    execute format('drop policy %I on public.jobs', p.policyname);
  end loop;
end $$;

revoke all on public.jobs from anon;
revoke all on public.jobs from authenticated;

-- Cek: hasilnya harus kosong (tidak ada hak untuk anon/authenticated)
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'jobs' and grantee in ('anon', 'authenticated');

-- ---------------------------------------------------------------------
-- Membatalkan (kalau loker tidak tampil setelah ini):
--   grant select on public.jobs to anon, authenticated;
--   create policy "baca publik" on public.jobs for select using (true);
