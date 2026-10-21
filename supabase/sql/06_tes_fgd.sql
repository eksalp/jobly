-- =====================================================================
--  Tes persiapan kerja & kuota FGD (paket Max)
-- =====================================================================
--  Jalankan sekali di Supabase → SQL Editor (aman dijalankan ulang),
--  SEBELUM deploy create-payment dan payment-webhook yang baru.
--
--  • Kolom kuota FGD di subscriptions.
--  • Tabel tes_sesi: setiap jenis tes hanya bisa dikerjakan 1x per
--    langganan Max. Tes dihitung terpakai sejak dimulai, seperti tes
--    sungguhan.
-- =====================================================================

alter table public.subscriptions add column if not exists kuota_fgd int not null default 0;
alter table public.subscriptions add column if not exists kuota_fgd_terpakai int not null default 0;

create table if not exists public.tes_sesi (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  langganan_id  text not null, -- id langganan (teks, apa pun tipe kolom id-nya)
  jenis         text not null,
  status        text not null default 'berjalan', -- berjalan | selesai
  benih         bigint not null,
  mulai_at      timestamptz not null default now(),
  selesai_at    timestamptz,
  skor          int,
  hasil         jsonb,
  unique (user_id, jenis, langganan_id),
  constraint tes_jenis_sah check (jenis in ('kraepelin', 'verbal', 'numerik', 'logika', 'ketelitian', 'kepribadian')),
  constraint tes_hasil_kecil check (hasil is null or pg_column_size(hasil) <= 100000)
);

create index if not exists tes_sesi_user_idx on public.tes_sesi (user_id);

alter table public.tes_sesi enable row level security;

drop policy if exists "tes baca milik sendiri" on public.tes_sesi;
create policy "tes baca milik sendiri" on public.tes_sesi
  for select using (auth.uid() = user_id);
-- Tidak ada policy insert/update: semua lewat fungsi di bawah.

/** Langganan Max aktif milik user (yang paling lama berlaku). */
create or replace function public.langganan_max_aktif(p_user uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select s.id::text from public.subscriptions s
  where s.user_id = p_user
    and s.status = 'aktif'
    and s.berakhir_at > now()
    and s.paket = 'serius'
  order by s.berakhir_at desc
  limit 1;
$$;

/** Mulai satu tes. Mengembalikan sesi (baru, atau yang sedang berjalan). */
create or replace function public.mulai_tes(p_jenis text, p_benih bigint)
returns public.tes_sesi
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  lid text;
  sesi public.tes_sesi;
begin
  if uid is null then raise exception 'Silakan masuk dulu.'; end if;
  lid := public.langganan_max_aktif(uid);
  if lid is null then raise exception 'Tes persiapan kerja khusus paket Max yang masih aktif.'; end if;

  select * into sesi from public.tes_sesi where user_id = uid and jenis = p_jenis and langganan_id = lid;
  if found then
    if sesi.status = 'selesai' then raise exception 'Tes ini sudah kamu kerjakan di paket Max-mu.'; end if;
    return sesi; -- lanjutkan sesi yang sedang berjalan (mis. halaman dimuat ulang)
  end if;

  insert into public.tes_sesi (user_id, langganan_id, jenis, benih)
  values (uid, lid, p_jenis, p_benih)
  returning * into sesi;
  return sesi;
end;
$$;

/** Simpan hasil tes yang sedang berjalan. */
create or replace function public.selesaikan_tes(p_id uuid, p_skor int, p_hasil jsonb)
returns public.tes_sesi
language plpgsql
security definer
set search_path = public
as $$
declare
  sesi public.tes_sesi;
begin
  update public.tes_sesi
     set status = 'selesai',
         selesai_at = now(),
         skor = greatest(0, least(100, p_skor)),
         hasil = p_hasil
   where id = p_id and user_id = auth.uid() and status = 'berjalan'
  returning * into sesi;
  if not found then raise exception 'Sesi tes tidak ditemukan atau sudah selesai.'; end if;
  return sesi;
end;
$$;

revoke all on function public.mulai_tes(text, bigint) from public, anon;
revoke all on function public.selesaikan_tes(uuid, int, jsonb) from public, anon;
revoke all on function public.langganan_max_aktif(uuid) from public, anon, authenticated;
grant execute on function public.mulai_tes(text, bigint) to authenticated;
grant execute on function public.selesaikan_tes(uuid, int, jsonb) to authenticated;
