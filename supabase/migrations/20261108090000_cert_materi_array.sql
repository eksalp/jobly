-- DIBUAT OTOMATIS oleh scripts/gen-cert-sql.mjs. Jangan diedit manual.
-- Sertifikat kelulusan per tingkat (wajib lulus ujian akhir) + verifikasi publik lewat QR code.

-- Aturan kelulusan (daftar materi wajib, pola soal, minimal soal & studi kasus)
create table if not exists public.cert_rules (
  level      text primary key,
  ord        integer not null,
  title      text not null,
  lessons    text[] not null,
  drill_re   text not null,
  min_drill  integer not null,
  min_cases  integer not null
);
alter table public.cert_rules enable row level security;
revoke all on public.cert_rules from anon, authenticated;

insert into public.cert_rules (level, ord, title, lessons, drill_re, min_drill, min_cases) values
('basic', 1, 'Excel Basic', array['mengenal-excel', 'rumus-pertama', 'operator', 'absolut', 'isi-cepat', 'format-sel', 'sum', 'average', 'count', 'round', 'sumproduct', 'rank', 'large-small', 'sebaran']::text[], '^soal-(sum|avg|maxmin|count|kali|diskon|capai|selisih|bulat|kunci|gabung|rapi|kode|lulus|tempo|bagian-tgl|ppn|margin|selisih-kurs|pajak-bulat)-[0-9]+$', 1000, 0),
('intermediate', 2, 'Excel Intermediate', array['sumif', 'countif', 'sumifs', 'maxifs', 'if', 'if-bertingkat', 'ifs-switch', 'and-or', 'iferror', 'gabung-teks', 'textjoin', 'left-mid-right', 'find-substitute', 'rapikan-teks', 'text-format', 'tanggal', 'datedif', 'eomonth-edate', 'networkdays', 'waktu']::text[], '^soal-(sumif|countif|countif-angka|avgif|sumifs|countifs|maxifs|vlookup|xlookup-kiri|grade|and|or|iferror|masa-kerja|harikerja|akhir-bulan|rank|large|sumproduct|mid|email|teks-rp|duplikat|median|porsi|saldo-akun|umur-kelompok|cek-seimbang|rasio-status|sln|limit-jabatan|ppn-dpp-lain|rata-tertimbang|saldo-normal|akrual-bunga|nper-target|bunga-efektif|bep|audit-akhir-pekan|audit-angka-bulat|audit-materialitas|lembur|ongkir-berat|masa-kerja-teks|kode-switch|h-debug-vlookup|h-debug-rata|h-debug-persen|h-debug-sum-range|h-target-sisa|pv-total|pv-hitung|pv-rata)-[0-9]+$', 1000, 0),
('advanced', 3, 'Excel Advanced', array['vlookup', 'vlookup-tarif', 'index-match', 'xlookup', 'offset-indirect', 'filter', 'sort-unique', 'let', 'textsplit', 'stack', 'pilih-kolom', 'bentuk-array', 'textbefore-after', 'groupby', 'regex', 'pmt', 'angsuran', 'npv-irr', 'sln', 'tabel', 'sort-filter', 'cond-format', 'data-validation', 'bersih-data', 'named-range', 'grafik', 'pivot', 'pivot-lanjut', 'what-if', 'power-query', 'power-pivot']::text[], '^soal-(filter|sort|unik|top3|nama-terbaik|tarif|pmt|bunga-bulan|irr|sumproduct-syarat|dua-kunci|groupby|regex|textsplit|let|rata-terakhir|choosecols|chooserows-akhir|take-bawah|drop-kolom|tocol-unik|wraprows|textafter-akhir|textbefore-n|vstack|total-bunga|fv|pv|rate|kurs-tanggal|pph21-pkp|pph23|umkm-final|ppn-kurang-bayar|dibayar-dimuka|susut-metode|laba-operasi|npv-irr|cicilan-rinci|rasio-lapkeu|audit-cutoff|audit-sod|peringkat-grup|top-n|h-nilai-minimal|h-harga-jual-min|h-diskon-maks|h-plafon-maks|h-cek-konsisten|h-alokasi-sisa|pv-silang|pv-persen|pv-saring|pv-dua-level|pv-urut|pv-maks)-[0-9]+$', 1000, 3),
('expert', 4, 'Excel Expert', array['tampilan', 'proteksi', 'cetak', 'audit-rumus', 'kolaborasi-berbagi', 'opsi-workbook', 'macro-recorder', 'vba-dasar', 'vba-logika', 'vba-kantor', 'vba-event-udf', 'excel-ai', 'sebaran-data', 'korelasi-tren', 'peramalan', 'frekuensi', 'fungsi-database', 'fungsi-informasi', 'mod-quotient', 'konversi-satuan', 'hari-kerja-intl', 'lama-cicilan', 'xirr-xnpv', 'aggregate', 'lambda-helper', 'konsolidasi-3d']::text[], '^soal-(x-pilih-top|x-gabung-unik|x-domain-hitung|x-filter-sort|x-lookup-sumifs|x-top-pelanggan|x-index-2match|x-umur-piutang|x-textjoin-filter|x-komisi-cap|x-pph-progresif|x-groupby-filter|x-transaksi-terakhir|x-restock|x-saldo-scan|x-bulan-terbaik|x-unik-bersyarat|x-sla-workday|x-qty-teks|x-tenor|x-yoy|x-absen-potong|x-rank-grup|x-nilai-akhir|x-duplikat|x-hari-kerja-bulan|x-nominal-catatan|x-benford|x-rekon|x-split|x-nomor-hilang|x-pph-lapis-tarif|x-pph-badan-31e|x-cadangan-umur|x-fifo|x-nilai-buku-ddb|x-payback|x-xirr|x-varians-anggaran|x-mus|x-outlier|x-tiga-arah|x-bayar-ganda|x-h-pilih-supplier|x-h-sewa-beli|x-h-kurir-tenggat|x-h-bonus-syarat|x-h-penurunan-terbesar|pv-persen-kolom|pv-dua-nilai|pv-silang-saring)-[0-9]+$', 1000, 8)
on conflict (level) do update set ord = excluded.ord, title = excluded.title, lessons = excluded.lessons,
  drill_re = excluded.drill_re, min_drill = excluded.min_drill, min_cases = excluded.min_cases;

-- Sertifikat yang sudah diterbitkan. Pengguna hanya bisa membaca miliknya; menulis hanya lewat issue_certificate().
create table if not exists public.certificates (
  id         text primary key check (id ~ '^JE-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$'),
  user_id    uuid not null references auth.users (id) on delete cascade,
  level      text not null references public.cert_rules (level),
  name       text not null check (char_length(name) between 2 and 60),
  issued_at  timestamptz not null default now(),
  revoked    boolean not null default false,
  unique (user_id, level)
);
alter table public.certificates enable row level security;
drop policy if exists "sertifikat: baca milik sendiri" on public.certificates;
create policy "sertifikat: baca milik sendiri" on public.certificates for select using (auth.uid() = user_id);
revoke insert, update, delete on public.certificates from anon, authenticated;
alter table public.certificates add column if not exists score integer;
-- true = sertifikat uji coba (akun bypass, tanpa lulus ujian). Halaman verifikasi menandainya, dan dihapus saat bypass dimatikan.
alter table public.certificates add column if not exists test boolean not null default false;

-- Percobaan ujian akhir. Ditulis HANYA oleh Edge Function "exam" (service role) yang menilai jawaban di server.
create table if not exists public.exam_attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  level         text not null references public.cert_rules (level),
  questions     text[] not null,
  started_at    timestamptz not null default now(),
  deadline      timestamptz not null,
  submitted_at  timestamptz,
  correct       integer,
  total         integer,
  score         integer,
  passed        boolean,
  answers       jsonb,
  results       jsonb
);
create index if not exists exam_attempts_user on public.exam_attempts (user_id, level, started_at desc);
alter table public.exam_attempts enable row level security;
drop policy if exists "ujian: baca milik sendiri" on public.exam_attempts;
create policy "ujian: baca milik sendiri" on public.exam_attempts for select using (auth.uid() = user_id);
revoke insert, update, delete on public.exam_attempts from anon, authenticated;

-- Akun uji coba (bypass): syarat materi/soal/studi kasus, urutan tingkat, dan batas percobaan harian dilewati.
-- Ujian tetap harus dikerjakan dan lulus untuk mengambil sertifikat. Diatur admin lewat bot /bypass.
create table if not exists public.cert_bypass (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  note        text,
  created_at  timestamptz not null default now()
);
alter table public.cert_bypass enable row level security;
drop policy if exists "bypass: baca milik sendiri" on public.cert_bypass;
create policy "bypass: baca milik sendiri" on public.cert_bypass for select using (auth.uid() = user_id);
revoke insert, update, delete on public.cert_bypass from anon, authenticated;

-- Apakah pengguna memenuhi syarat satu tingkat (dihitung dari tabel completions).
create or replace function public.cert_ok(p_user uuid, p_level text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.cert_bypass b where b.user_id = p_user) or coalesce((
    select (select count(distinct c.item_id) from public.completions c
             where c.user_id = p_user and c.kind = 'lesson' and c.item_id = any (r.lessons)) = cardinality(r.lessons)
       and (select count(*) from public.completions c
             where c.user_id = p_user and c.kind = 'drill' and c.item_id ~ r.drill_re) >= r.min_drill
       and (select count(*) from public.completions c
             where c.user_id = p_user and c.kind = 'case') >= r.min_cases
      from public.cert_rules r where r.level = p_level), false);
$$;
revoke all on function public.cert_ok(uuid, text) from public, anon, authenticated;

-- Boleh mulai ujian tingkat ini? null = boleh; selain itu alasan penolakan. Dipanggil Edge Function (service role).
create or replace function public.exam_block_reason(p_user uuid, p_level text, p_per_day integer)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ord integer;
begin
  select r.ord into v_ord from public.cert_rules r where r.level = p_level;
  if not found then return 'Tingkat tidak dikenal'; end if;
  if exists (select 1 from public.cert_bypass b where b.user_id = p_user) then return null; end if;
  if exists (select 1 from public.cert_rules r where r.ord <= v_ord and not public.cert_ok(p_user, r.level)) then
    return 'Selesaikan dulu semua materi, soal latihan, dan studi kasus yang disyaratkan';
  end if;
  if exists (select 1 from public.cert_rules r where r.ord < v_ord
             and not exists (select 1 from public.exam_attempts a where a.user_id = p_user and a.level = r.level and a.passed)) then
    return 'Lulus ujian tingkat sebelumnya dulu';
  end if;
  if (select count(*) from public.exam_attempts a where a.user_id = p_user and a.level = p_level and a.started_at > now() - interval '24 hours') >= p_per_day then
    return 'Batas percobaan ujian hari ini sudah habis. Coba lagi besok';
  end if;
  return null;
end;
$$;
revoke all on function public.exam_block_reason(uuid, text, integer) from public, anon, authenticated;

-- Nama di sertifikat & portofolio: diisi SEKALI oleh peserta, perubahan hanya lewat admin (bot /nama).
create table if not exists public.cert_names (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 2 and 60),
  set_at      timestamptz not null default now(),
  changed_by  text
);
alter table public.cert_names enable row level security;
drop policy if exists "nama sertifikat: baca milik sendiri" on public.cert_names;
create policy "nama sertifikat: baca milik sendiri" on public.cert_names for select using (auth.uid() = user_id);
revoke insert, update, delete on public.cert_names from anon, authenticated;

create or replace function public.set_cert_name(p_name text)
returns text
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_uid  uuid := auth.uid();
  v_name text := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g'));
begin
  if v_uid is null then raise exception 'Masuk dulu untuk mengisi nama'; end if;
  if char_length(v_name) < 2 or char_length(v_name) > 60 then raise exception 'Nama harus 2–60 karakter'; end if;
  if v_name !~ '^[[:alpha:]][[:alpha:] .,''-]*$' then raise exception 'Nama hanya boleh berisi huruf, spasi, titik, koma, apostrof, atau tanda hubung'; end if;
  insert into public.cert_names (user_id, name) values (v_uid, v_name) on conflict (user_id) do nothing;
  if not found then raise exception 'Nama sudah terkunci. Hubungi admin untuk mengganti nama'; end if;
  return v_name;
end;
$$;
revoke all on function public.set_cert_name(text) from public, anon;
grant execute on function public.set_cert_name(text) to authenticated;

-- Ganti nama oleh admin (Edge Function bot, service role). Sertifikat yang sudah terbit ikut diperbarui.
create or replace function public.admin_set_cert_name(p_user uuid, p_name text, p_by text)
returns text
language plpgsql
volatile
security definer
set search_path = public
as $$
declare v_name text := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g'));
begin
  if char_length(v_name) < 2 or char_length(v_name) > 60 then raise exception 'Nama harus 2–60 karakter'; end if;
  insert into public.cert_names (user_id, name, set_at, changed_by) values (p_user, v_name, now(), left(coalesce(p_by, ''), 80))
  on conflict (user_id) do update set name = excluded.name, set_at = now(), changed_by = excluded.changed_by;
  update public.certificates set name = v_name where user_id = p_user;
  return v_name;
end;
$$;
revoke all on function public.admin_set_cert_name(uuid, text, text) from public, anon, authenticated;

drop function if exists public.issue_certificate(text, text);
-- Terbitkan (atau perbarui nama di) sertifikat untuk pengguna yang sedang login.
create or replace function public.issue_certificate(p_level text, p_name text)
returns table (id text, level text, name text, issued_at timestamptz, score integer)
language plpgsql
volatile
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_uid  uuid := auth.uid();
  v_ord  integer;
  v_name text;
  v_hex  text := upper(replace(gen_random_uuid()::text, '-', ''));
  v_score integer;
  v_test  boolean;
begin
  if v_uid is null then raise exception 'Masuk dulu untuk mengambil sertifikat'; end if;
  -- Nama selalu diambil dari nama yang sudah dikunci (p_name diabaikan, disimpan untuk kompatibilitas).
  select n.name into v_name from public.cert_names n where n.user_id = v_uid;
  if v_name is null then raise exception 'Isi dan kunci nama sertifikat dulu'; end if;
  select r.ord into v_ord from public.cert_rules r where r.level = p_level;
  if not found then raise exception 'Tingkat sertifikat tidak dikenal'; end if;
  if exists (select 1 from public.cert_rules r where r.ord <= v_ord and not public.cert_ok(v_uid, r.level)) then
    raise exception 'Syarat kelulusan belum terpenuhi';
  end if;
  select max(a.score) into v_score from public.exam_attempts a where a.user_id = v_uid and a.level = p_level and a.passed;
  v_test := v_score is null;
  if v_test and not exists (select 1 from public.cert_bypass b where b.user_id = v_uid) then raise exception 'Belum lulus ujian akhir tingkat ini'; end if;
  return query
    insert into public.certificates as c (id, user_id, level, name, score, test)
    values ('JE-' || substr(v_hex, 1, 4) || '-' || substr(v_hex, 5, 4) || '-' || substr(v_hex, 9, 4), v_uid, p_level, v_name, v_score, v_test)
    on conflict (user_id, level) do update set name = excluded.name, score = excluded.score, test = excluded.test
    returning c.id, c.level, c.name, c.issued_at, c.score;
end;
$$;
revoke all on function public.issue_certificate(text, text) from public, anon;
grant execute on function public.issue_certificate(text, text) to authenticated;

-- Verifikasi publik (halaman /verifikasi/:id yang dibuka dari QR code). Tidak menampilkan email.
drop function if exists public.verify_certificate(text);
create or replace function public.verify_certificate(p_id text)
returns table (id text, level text, title text, name text, issued_at timestamptz, revoked boolean, score integer, test boolean)
language sql
stable
security definer
set search_path = public
as $$
  select c.id, c.level, r.title, c.name, c.issued_at, c.revoked, c.score, c.test
    from public.certificates c join public.cert_rules r on r.level = c.level
   where char_length(p_id) <= 20 and c.id = upper(p_id);
$$;
revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- Akun uji coba bawaan (kalau emailnya sudah terdaftar). Tambah/hapus berikutnya lewat bot: /bypass email [off]
insert into public.cert_bypass (user_id, note)
select u.id, 'uji coba founder' from auth.users u where lower(u.email) in ('eksalpu1@gmail.com')
on conflict (user_id) do nothing;
