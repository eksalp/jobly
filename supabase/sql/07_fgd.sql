-- =====================================================================
--  Simulasi FGD (paket Max)
-- =====================================================================
--  Jalankan sekali di Supabase → SQL Editor (aman dijalankan ulang),
--  SETELAH 06_tes_fgd.sql dan SEBELUM deploy edge function `fgd`.
--
--  Transkrip disimpan di server (bukan dikirim browser saat penilaian),
--  jadi penilaian selalu berdasarkan percakapan yang benar-benar terjadi.
-- =====================================================================

create table if not exists public.fgd_sesi (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  langganan_id  text not null,
  topik         jsonb not null,
  bahasa        text not null default 'id',
  status        text not null default 'berjalan', -- berjalan | selesai | batal
  mulai_at      timestamptz not null default now(),
  selesai_at    timestamptz,
  transkrip     jsonb not null default '[]'::jsonb,
  suara_dipakai int not null default 0,
  skor          int,
  hasil         jsonb
);

create index if not exists fgd_sesi_user_idx on public.fgd_sesi (user_id, mulai_at desc);

alter table public.fgd_sesi enable row level security;

drop policy if exists "fgd baca milik sendiri" on public.fgd_sesi;
create policy "fgd baca milik sendiri" on public.fgd_sesi
  for select using (auth.uid() = user_id);
-- Tulis hanya lewat edge function (service role).

/**
 * Pakai 1 kuota FGD dari langganan aktif yang masih punya sisa
 * (yang paling cepat berakhir lebih dulu). Dipanggil edge function.
 */
create or replace function public.pakai_kuota_fgd(p_user uuid)
returns table (berhasil boolean, langganan_id text, sisa int, alasan text)
language plpgsql
security definer
set search_path = public
as $$
declare
  s record;
begin
  select id, kuota_fgd, kuota_fgd_terpakai into s
  from public.subscriptions
  where user_id = p_user
    and status = 'aktif'
    and berakhir_at > now()
    and kuota_fgd > kuota_fgd_terpakai
  order by berakhir_at asc
  limit 1
  for update;

  if not found then
    return query select false, null::text, 0, 'Kuota simulasi FGD habis atau paket Max belum aktif.'::text;
    return;
  end if;

  update public.subscriptions set kuota_fgd_terpakai = kuota_fgd_terpakai + 1 where id = s.id;
  return query select true, s.id::text, s.kuota_fgd - s.kuota_fgd_terpakai - 1, null::text;
end;
$$;

/** Kembalikan kuota bila sesi terlalu singkat untuk dinilai. */
create or replace function public.kembalikan_kuota_fgd(p_sesi uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  f record;
begin
  select * into f from public.fgd_sesi where id = p_sesi and status = 'berjalan' for update;
  if not found then return false; end if;
  update public.fgd_sesi set status = 'batal', selesai_at = now() where id = p_sesi;
  update public.subscriptions
     set kuota_fgd_terpakai = greatest(0, kuota_fgd_terpakai - 1)
   where id::text = f.langganan_id;
  return true;
end;
$$;

revoke all on function public.pakai_kuota_fgd(uuid) from public, anon, authenticated;
revoke all on function public.kembalikan_kuota_fgd(uuid) from public, anon, authenticated;
