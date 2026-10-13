-- =====================================================================
-- Jobly — catatan pemakaian token AI per sesi (Simulasi interview)
-- Jalankan sekali di project UTAMA (db1, yang dipakai login & pembayaran).
-- Diisi oleh edge function simulasi-interview memakai service role.
-- =====================================================================
create table if not exists public.pemakaian_ai (
  id           bigint generated always as identity primary key,
  user_id      uuid references auth.users (id) on delete set null,
  fitur        text not null,
  model        text,
  token_masuk  integer default 0,
  token_keluar integer default 0,
  token_total  integer default 0,
  detik        integer default 0,
  dibuat       timestamptz not null default now()
);

alter table public.pemakaian_ai enable row level security;
-- Tidak ada policy: tabel ini hanya bisa dibaca/ditulis service role.

-- Rata-rata biaya per sesi (jalankan kapan saja di SQL Editor):
-- select fitur, count(*) sesi,
--        round(avg(token_masuk)) rata_masuk, round(avg(token_keluar)) rata_keluar,
--        round(avg(detik)/60.0, 1) rata_menit
-- from public.pemakaian_ai group by fitur;
