-- =====================================================================
--  Portofolio: proyek latihan yang dikerjakan pengguna Pro/Max
-- =====================================================================
--  Jalankan sekali di Supabase → SQL Editor (aman dijalankan ulang).
--
--  Aturan yang dijaga di database (tidak bisa diakali dari browser):
--   • hanya pengguna dengan paket Pro atau Max yang masih aktif yang
--     bisa memilih proyek baru;
--   • setiap pengguna maksimal 2 proyek;
--   • proyek hanya bisa dilepas selama belum dikerjakan sama sekali.
-- =====================================================================

create table if not exists public.portofolio_proyek (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  profesi     text not null,
  tugas       int  not null,
  jawaban     text not null default '',
  tabel       jsonb,
  dikirim     boolean not null default false,
  revisi      text not null default '',
  cek         jsonb not null default '[]'::jsonb,
  tautan      text not null default '',
  dibuat_at   timestamptz not null default now(),
  diubah_at   timestamptz not null default now(),
  unique (user_id, profesi, tugas),
  constraint portofolio_panjang check (
    char_length(jawaban) <= 20000
    and char_length(revisi) <= 10000
    and char_length(tautan) <= 500
    and (tabel is null or pg_column_size(tabel) <= 200000)
  )
);

create index if not exists portofolio_proyek_user_idx on public.portofolio_proyek (user_id);

alter table public.portofolio_proyek enable row level security;

drop policy if exists "portofolio baca milik sendiri" on public.portofolio_proyek;
create policy "portofolio baca milik sendiri" on public.portofolio_proyek
  for select using (auth.uid() = user_id);

drop policy if exists "portofolio tambah milik sendiri" on public.portofolio_proyek;
create policy "portofolio tambah milik sendiri" on public.portofolio_proyek
  for insert with check (auth.uid() = user_id);

drop policy if exists "portofolio ubah milik sendiri" on public.portofolio_proyek;
create policy "portofolio ubah milik sendiri" on public.portofolio_proyek
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Melepas proyek hanya boleh selama belum dikerjakan
drop policy if exists "portofolio hapus yang belum dikerjakan" on public.portofolio_proyek;
create policy "portofolio hapus yang belum dikerjakan" on public.portofolio_proyek
  for delete using (
    auth.uid() = user_id
    and jawaban = ''
    and tabel is null
    and dikirim = false
  );

-- Batas 2 proyek + wajib Pro/Max aktif
create or replace function public.portofolio_cek_tambah()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jumlah int;
begin
  -- Cegah dua pilihan bersamaan lolos batas
  perform pg_advisory_xact_lock(hashtext('portofolio:' || new.user_id::text));

  if not exists (
    select 1 from public.subscriptions s
    where s.user_id = new.user_id
      and s.status = 'aktif'
      and s.berakhir_at > now()
      and s.paket in ('aktif', 'serius')
  ) then
    raise exception 'Portofolio hanya untuk paket Pro dan Max yang masih aktif.';
  end if;

  select count(*) into jumlah from public.portofolio_proyek where user_id = new.user_id;
  if jumlah >= 2 then
    raise exception 'Batas 2 proyek portofolio sudah tercapai.';
  end if;

  return new;
end;
$$;

drop trigger if exists portofolio_cek_tambah on public.portofolio_proyek;
create trigger portofolio_cek_tambah
  before insert on public.portofolio_proyek
  for each row execute function public.portofolio_cek_tambah();

-- Profesi & nomor tugas tidak boleh diganti setelah dipilih
create or replace function public.portofolio_jaga_ubah()
returns trigger
language plpgsql
as $$
begin
  new.user_id := old.user_id;
  new.profesi := old.profesi;
  new.tugas := old.tugas;
  new.dibuat_at := old.dibuat_at;
  new.diubah_at := now();
  return new;
end;
$$;

drop trigger if exists portofolio_jaga_ubah on public.portofolio_proyek;
create trigger portofolio_jaga_ubah
  before update on public.portofolio_proyek
  for each row execute function public.portofolio_jaga_ubah();
