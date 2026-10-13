-- =====================================================================
-- OPSIONAL — tutup tabel jobs dari akses publik
--
-- Setelah update ini, browser TIDAK lagi membaca tabel jobs langsung;
-- semua lewat /api/loker di Vercel. Dengan menutup tabel, batas 5.000
-- loker gratis tidak bisa diakali lewat anon key.
--
-- SEBELUM menjalankan file ini:
--   1. Isi environment variable di Vercel (Settings → Environment Variables):
--        SUPABASE_SERVICE_ROLE_KEY    = service_role key project db1
--        SUPABASE_SERVICE_ROLE_KEY_2  = service_role key project db2
--      lalu redeploy. Kunci ini RAHASIA — jangan pernah diawali VITE_.
--   2. Pastikan bot scraper menulis memakai service_role key (bukan anon).
--   3. Buka jobly.my.id dan pastikan loker tampil normal.
--
-- Jalankan di kedua project. Untuk membatalkan, lihat bagian bawah.
-- =====================================================================
alter table public.jobs enable row level security;

-- Hapus policy baca publik yang ada (nama bisa berbeda di project-mu;
-- cek di Authentication → Policies, lalu sesuaikan nama di bawah).
-- drop policy if exists "Enable read access for all users" on public.jobs;

revoke select on public.jobs from anon;
revoke select on public.jobs from authenticated;

-- ---------------------------------------------------------------------
-- Membatalkan:
-- grant select on public.jobs to anon, authenticated;
-- create policy "baca publik" on public.jobs for select using (true);
