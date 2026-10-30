-- Kode referal untuk pembayaran manual.
--   referrers : pemilik kode (teman/afiliasi), komisi dan diskon per pembelian
--   referrals : riwayat pembelian yang memakai kode (dicatat bot Telegram saat /aktivasi)
-- Hanya bot (service_role) yang bisa membaca/menulis. Situs hanya bisa mengecek kode lewat ref_check().
-- Aman dijalankan ulang.

create table if not exists public.referrers (
  code        text primary key check (code ~ '^[A-Z0-9]{3,16}$'),
  name        text not null check (char_length(name) between 1 and 60),
  commission  integer not null default 0 check (commission between 0 and 10000000),
  discount    integer not null default 0 check (discount between 0 and 10000000),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  created_by  text
);

create table if not exists public.referrals (
  id          bigint generated always as identity primary key,
  code        text not null references public.referrers(code) on update cascade,
  user_id     uuid not null,
  email       text not null,
  amount      integer not null check (amount >= 0),
  commission  integer not null check (commission >= 0),
  paid        boolean not null default false,
  paid_at     timestamptz,
  created_at  timestamptz not null default now(),
  created_by  text
);
-- Satu pembeli hanya menghasilkan satu komisi.
create unique index if not exists referrals_user_once on public.referrals (user_id);
create index if not exists referrals_code_idx on public.referrals (code, created_at desc);

alter table public.referrers enable row level security;
alter table public.referrals enable row level security;
revoke all on public.referrers, public.referrals from anon, authenticated;

-- Dipanggil situs saat pembeli mengetik kode: hanya memberi tahu kode berlaku/tidak dan diskonnya.
-- Nama pemilik, komisi, dan riwayat tidak pernah keluar.
create or replace function public.ref_check(p_code text)
returns table (valid boolean, discount integer)
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(bool_or(r.active), false), coalesce(max(r.discount) filter (where r.active), 0)
  from public.referrers r
  where r.code = upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
$$;
revoke all on function public.ref_check(text) from public;
grant execute on function public.ref_check(text) to anon, authenticated;

-- Kode referal juga dicatat di server saat pembeli menekan "Lanjut ke WhatsApp",
-- supaya tetap terbaca walaupun baris "Kode referal" di pesan WhatsApp dihapus pembeli.
-- Bot memakai catatan ini otomatis saat /aktivasi email tersebut.
create table if not exists public.ref_claims (
  email       text primary key check (char_length(email) between 5 and 254),
  code        text not null references public.referrers(code) on update cascade on delete cascade,
  created_at  timestamptz not null default now()
);
alter table public.ref_claims enable row level security;
revoke all on public.ref_claims from anon, authenticated;

-- Kode pertama yang tercatat untuk satu email yang berlaku (60 hari), supaya tidak bisa ditimpa orang lain.
create or replace function public.ref_claim(p_email text, p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(coalesce(p_email, '')));
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
begin
  if v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' or char_length(v_email) > 254 then return false; end if;
  if not exists (select 1 from public.referrers where code = v_code and active) then return false; end if;
  insert into public.ref_claims (email, code) values (v_email, v_code)
  on conflict (email) do update set code = excluded.code, created_at = now()
    where public.ref_claims.created_at < now() - interval '60 days';
  return true;
end;
$$;
revoke all on function public.ref_claim(text, text) from public;
grant execute on function public.ref_claim(text, text) to anon, authenticated;
