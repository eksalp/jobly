-- =====================================================================
--  Cover Letter Builder
-- =====================================================================
--  Jalankan sekali di Supabase → SQL Editor (aman dijalankan ulang).
--
--  • profiles.cover_letter_json : draft cover letter (gratis, semua user)
--  • cover_letter_analisis      : riwayat analisis AI (Starter, Pro, Max)
--
--  Jatah analisis AI cover letter per paket (terpisah dari analisis CV):
--    Starter 5x · Pro 15x · Max 30x, berlaku selama paket aktif.
--  Jatah dihitung dari baris di tabel ini, dan hanya fungsi server
--  (edge function dengan service role) yang boleh menambah baris.
-- =====================================================================

alter table public.profiles add column if not exists cover_letter_json jsonb;

create table if not exists public.cover_letter_analisis (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  langganan_id  text not null,
  status        text not null default 'proses' check (status in ('proses', 'selesai')),
  posisi        text not null default '',
  perusahaan    text not null default '',
  hasil         jsonb,
  dibuat_at     timestamptz not null default now()
);

create index if not exists cover_letter_analisis_user_idx
  on public.cover_letter_analisis (user_id, dibuat_at desc);
create index if not exists cover_letter_analisis_langganan_idx
  on public.cover_letter_analisis (langganan_id);

alter table public.cover_letter_analisis enable row level security;

-- Pengguna hanya bisa MEMBACA riwayatnya sendiri. Tidak ada kebijakan
-- insert/update/delete: semua penulisan lewat service role.
drop policy if exists "cl analisis baca milik sendiri" on public.cover_letter_analisis;
create policy "cl analisis baca milik sendiri" on public.cover_letter_analisis
  for select using (auth.uid() = user_id);

/* Jatah per paket. Satu-satunya sumber angka di server. */
create or replace function public.jatah_cl(p_paket text)
returns int
language sql
immutable
as $$
  select case p_paket
    when 'coba' then 5
    when 'aktif' then 15
    when 'serius' then 30
    else 0
  end;
$$;

/*
 * Ambil satu jatah analisis. Baris subscriptions dikunci supaya dua
 * permintaan bersamaan tidak bisa sama-sama lolos di jatah terakhir.
 * Baris 'proses' yang lebih tua dari 10 menit dianggap gagal dan tidak
 * dihitung (misalnya fungsi terputus sebelum sempat membersihkan).
 */
create or replace function public.klaim_analisis_cl(p_user uuid, p_posisi text, p_perusahaan text)
returns table (berhasil boolean, analisis_id uuid, sisa int, alasan text)
language plpgsql
security definer
set search_path = public
as $$
declare
  s record;
  dipakai int;
  baru uuid;
begin
  for s in
    select id, paket
    from public.subscriptions
    where user_id = p_user
      and status = 'aktif'
      and berakhir_at > now()
      and public.jatah_cl(paket) > 0
    order by berakhir_at asc
    for update
  loop
    select count(*) into dipakai
    from public.cover_letter_analisis a
    where a.langganan_id = s.id::text
      and (a.status = 'selesai' or a.dibuat_at > now() - interval '10 minutes');

    if dipakai < public.jatah_cl(s.paket) then
      insert into public.cover_letter_analisis (user_id, langganan_id, posisi, perusahaan)
      values (p_user, s.id::text, left(coalesce(p_posisi, ''), 150), left(coalesce(p_perusahaan, ''), 150))
      returning id into baru;
      return query select true, baru, public.jatah_cl(s.paket) - dipakai - 1, null::text;
      return;
    end if;
  end loop;

  if not exists (
    select 1 from public.subscriptions
    where user_id = p_user and status = 'aktif' and berakhir_at > now()
  ) then
    return query select false, null::uuid, 0, 'Analisis AI cover letter tersedia mulai paket Starter.'::text;
  else
    return query select false, null::uuid, 0, 'Jatah analisis AI cover letter di paketmu sudah habis.'::text;
  end if;
end;
$$;

revoke all on function public.klaim_analisis_cl(uuid, text, text) from public, anon, authenticated;

/* Sisa jatah untuk ditampilkan di halaman (hanya milik pemanggil). */
create or replace function public.kuota_cl_saya()
returns table (jatah int, terpakai int)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(sum(public.jatah_cl(s.paket)), 0)::int,
    coalesce(sum((
      select count(*) from public.cover_letter_analisis a
      where a.langganan_id = s.id::text
        and (a.status = 'selesai' or a.dibuat_at > now() - interval '10 minutes')
    )), 0)::int
  from public.subscriptions s
  where s.user_id = auth.uid()
    and s.status = 'aktif'
    and s.berakhir_at > now();
$$;

revoke all on function public.kuota_cl_saya() from public, anon;
grant execute on function public.kuota_cl_saya() to authenticated;

notify pgrst, 'reload schema';
