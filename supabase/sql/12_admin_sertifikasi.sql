-- =====================================================================
--  12 · Admin sertifikasi lewat situs (tanpa Telegram)
-- =====================================================================
--  Jalankan sekali di Supabase → SQL Editor (aman dijalankan ulang).
--
--  PENTING: ganti EMAIL_LOGIN_JOBLY_KAMU di baris paling bawah dengan
--  email yang kamu pakai untuk MASUK ke Jobly. Admin lain bisa
--  ditambahkan dengan baris insert yang sama.
--
--  Admin bisa melihat semua item (termasuk arsip dan yang sudah tutup),
--  serta menambah, mengubah, dan menghapusnya di /dashboard/admin-sertifikasi.
-- =====================================================================

create table if not exists public.admin_jobly (
  email      text primary key,
  dibuat_at  timestamptz not null default now()
);

alter table public.admin_jobly enable row level security;
-- Tidak ada policy: tabel ini hanya dibaca lewat fungsi di bawah.

create or replace function public.saya_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_jobly a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.saya_admin() to authenticated;

drop policy if exists "sertifikasi admin baca semua" on public.sertifikasi;
create policy "sertifikasi admin baca semua" on public.sertifikasi
  for select to authenticated
  using (public.saya_admin());

drop policy if exists "sertifikasi admin tambah" on public.sertifikasi;
create policy "sertifikasi admin tambah" on public.sertifikasi
  for insert to authenticated
  with check (public.saya_admin());

drop policy if exists "sertifikasi admin ubah" on public.sertifikasi;
create policy "sertifikasi admin ubah" on public.sertifikasi
  for update to authenticated
  using (public.saya_admin())
  with check (public.saya_admin());

drop policy if exists "sertifikasi admin hapus" on public.sertifikasi;
create policy "sertifikasi admin hapus" on public.sertifikasi
  for delete to authenticated
  using (public.saya_admin());

-- Ganti dengan email login Jobly-mu:
insert into public.admin_jobly (email) values ('EMAIL_LOGIN_JOBLY_KAMU')
on conflict (email) do nothing;

notify pgrst, 'reload schema';
