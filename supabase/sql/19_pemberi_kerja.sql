-- =====================================================================
--  19 · Pemberi kerja: akun perusahaan, kredit loker, loker prioritas
-- =====================================================================
--  Jalankan sekali di SQL Editor project DB1 (project Workly utama,
--  tempat tabel jobs dan akun pengguna berada). Aman dijalankan ulang.
--  Membutuhkan 12_admin_sertifikasi.sql (fungsi saya_admin) sudah dijalankan.
--
--  Alur:
--   1. Pemberi kerja mengisi profil perusahaan (tabel perusahaan).
--   2. Membeli paket kredit lewat Midtrans (tabel pembelian_kredit;
--      kredit ditambahkan oleh payment-webhook lewat lunasi_pembelian_kredit).
--   3. Membuat loker (status draf), lalu mengajukannya: 1 kredit terpakai,
--      status menjadi "menunggu".
--   4. Admin menyetujui → status "tayang" selama 30 hari, loker disalin ke
--      tabel jobs sebagai loker prioritas (id 800000000 + nomor).
--      Admin menolak → kredit dikembalikan.
--   5. Setelah 30 hari status menjadi "berakhir" dan loker hilang dari situs.
--
--  Mengubah isi loker yang sedang tayang membuatnya kembali "menunggu"
--  (dicek admin lagi) tanpa memotong kredit dan tanpa mengubah masa tayang.
-- =====================================================================

-- Masa tayang (hari). Ubah angka di fungsi masa_tayang_loker() bila perlu.
create or replace function public.masa_tayang_loker() returns int
language sql immutable as $$ select 30 $$;

-- ---------------------------------------------------------- perusahaan
create table if not exists public.perusahaan (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  nama         text not null check (length(trim(nama)) between 2 and 120),
  situs        text,
  logo_url     text,
  kota         text,
  industri     text,
  ukuran       text,
  deskripsi    text,
  kontak_nama  text,
  kontak_wa    text,
  kredit       int not null default 0 check (kredit >= 0),
  dibuat_at    timestamptz not null default now()
);
alter table public.perusahaan enable row level security;

drop policy if exists "perusahaan baca sendiri" on public.perusahaan;
create policy "perusahaan baca sendiri" on public.perusahaan
  for select to authenticated using (user_id = auth.uid() or public.saya_admin());
drop policy if exists "perusahaan tambah sendiri" on public.perusahaan;
create policy "perusahaan tambah sendiri" on public.perusahaan
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "perusahaan ubah sendiri" on public.perusahaan;
create policy "perusahaan ubah sendiri" on public.perusahaan
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Kredit hanya bisa berubah lewat fungsi di bawah, bukan dari browser
revoke insert, update on public.perusahaan from authenticated, anon;
grant select on public.perusahaan to authenticated;
grant insert (user_id, nama, situs, logo_url, kota, industri, ukuran, deskripsi, kontak_nama, kontak_wa)
  on public.perusahaan to authenticated;
grant update (nama, situs, logo_url, kota, industri, ukuran, deskripsi, kontak_nama, kontak_wa)
  on public.perusahaan to authenticated;

-- ---------------------------------------------------- pembelian kredit
create table if not exists public.pembelian_kredit (
  order_id    text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  paket       text not null,
  kredit      int not null check (kredit > 0),
  harga       int not null,
  status      text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  snap_token  text,
  dibuat_at   timestamptz not null default now(),
  dibayar_at  timestamptz
);
alter table public.pembelian_kredit enable row level security;
drop policy if exists "pembelian baca sendiri" on public.pembelian_kredit;
create policy "pembelian baca sendiri" on public.pembelian_kredit
  for select to authenticated using (user_id = auth.uid() or public.saya_admin());
revoke insert, update, delete on public.pembelian_kredit from authenticated, anon;

-- Dipanggil payment-webhook (service role). Aman dipanggil berulang:
-- kredit hanya ditambahkan sekali per order.
create or replace function public.lunasi_pembelian_kredit(p_order text)
returns int language plpgsql security definer set search_path = public as $$
declare b public.pembelian_kredit;
begin
  update public.pembelian_kredit set status = 'paid', dibayar_at = now()
   where order_id = p_order and status <> 'paid'
   returning * into b;
  if not found then return 0; end if;
  update public.perusahaan set kredit = kredit + b.kredit where user_id = b.user_id;
  return b.kredit;
end $$;
revoke execute on function public.lunasi_pembelian_kredit(text) from public, anon, authenticated;

-- ---------------------------------------------------- loker perusahaan
create table if not exists public.loker_perusahaan (
  id             bigint generated always as identity primary key,
  user_id        uuid not null references public.perusahaan (user_id) on delete cascade,
  posisi         text not null check (length(trim(posisi)) between 2 and 150),
  lokasi         text,
  tipe           text,          -- full-time | kontrak | freelance | magang | part-time
  cara_kerja     text,          -- onsite | remote | hybrid
  kategori       text,
  jenjang        text,          -- mis. "Fresh graduate", "1-3 tahun"
  pendidikan     text,
  gaji_min       numeric,
  gaji_max       numeric,
  tampilkan_gaji boolean not null default true,
  link           text not null, -- link lamar atau mailto:
  deskripsi      text not null,
  status         text not null default 'draf'
                 check (status in ('draf', 'menunggu', 'tayang', 'ditolak', 'ditutup', 'berakhir')),
  alasan_tolak   text,
  sudah_bayar    boolean not null default false,
  tayang_mulai   timestamptz,
  tayang_sampai  timestamptz,
  klik           int not null default 0,
  dilihat        int not null default 0,
  dibuat_at      timestamptz not null default now(),
  diubah_at      timestamptz not null default now()
);
create index if not exists loker_perusahaan_user_idx on public.loker_perusahaan (user_id, dibuat_at desc);
create index if not exists loker_perusahaan_status_idx on public.loker_perusahaan (status);
alter table public.loker_perusahaan enable row level security;

drop policy if exists "loker mitra baca" on public.loker_perusahaan;
create policy "loker mitra baca" on public.loker_perusahaan
  for select to authenticated using (user_id = auth.uid() or public.saya_admin());
drop policy if exists "loker mitra tambah" on public.loker_perusahaan;
create policy "loker mitra tambah" on public.loker_perusahaan
  for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.perusahaan p where p.user_id = auth.uid()));
drop policy if exists "loker mitra ubah" on public.loker_perusahaan;
create policy "loker mitra ubah" on public.loker_perusahaan
  for update to authenticated
  using (user_id = auth.uid() and status in ('draf', 'ditolak', 'menunggu', 'tayang'))
  with check (user_id = auth.uid());
drop policy if exists "loker mitra hapus" on public.loker_perusahaan;
create policy "loker mitra hapus" on public.loker_perusahaan
  for delete to authenticated using (user_id = auth.uid() and status in ('draf', 'ditolak'));

-- Status, kredit, masa tayang, dan statistik hanya diubah lewat fungsi
revoke insert, update on public.loker_perusahaan from authenticated, anon;
grant select, delete on public.loker_perusahaan to authenticated;
grant insert (user_id, posisi, lokasi, tipe, cara_kerja, kategori, jenjang, pendidikan, gaji_min, gaji_max,
              tampilkan_gaji, link, deskripsi)
  on public.loker_perusahaan to authenticated;
grant update (posisi, lokasi, tipe, cara_kerja, kategori, jenjang, pendidikan, gaji_min, gaji_max,
              tampilkan_gaji, link, deskripsi)
  on public.loker_perusahaan to authenticated;

-- Isi loker yang sedang tayang diubah pemberi kerja → dicek admin lagi
create or replace function public.loker_perusahaan_sebelum_ubah()
returns trigger language plpgsql as $$
begin
  new.diubah_at := now();
  if current_user = 'authenticated' and old.status = 'tayang'
     and (new.posisi, new.lokasi, new.tipe, new.cara_kerja, new.kategori, new.jenjang, new.pendidikan,
          new.gaji_min, new.gaji_max, new.tampilkan_gaji, new.link, new.deskripsi)
         is distinct from
         (old.posisi, old.lokasi, old.tipe, old.cara_kerja, old.kategori, old.jenjang, old.pendidikan,
          old.gaji_min, old.gaji_max, old.tampilkan_gaji, old.link, old.deskripsi) then
    new.status := 'menunggu';
  end if;
  return new;
end $$;
drop trigger if exists loker_perusahaan_sebelum_ubah on public.loker_perusahaan;
create trigger loker_perusahaan_sebelum_ubah
  before update on public.loker_perusahaan
  for each row execute function public.loker_perusahaan_sebelum_ubah();

-- ------------------------------------------------ tayang di tabel jobs
alter table public.jobs add column if not exists prioritas boolean not null default false;

create or replace function public.loker_perusahaan_ke_jobs(m public.loker_perusahaan)
returns void language plpgsql security definer set search_path = public as $$
declare
  p public.perusahaan;
  data jsonb;
  identitas char;
begin
  delete from public.jobs where id = 800000000 + m.id;
  if m.status <> 'tayang' or m.tayang_sampai is null or m.tayang_sampai <= now() then return; end if;
  select * into p from public.perusahaan where user_id = m.user_id;

  data := jsonb_strip_nulls(jsonb_build_object(
    'id', 800000000 + m.id,
    'job_id', 'mitra-' || m.id,
    'site', 'jobly',
    'job_url', m.link,
    'title', m.posisi,
    'company', p.nama,
    'company_logo', p.logo_url,
    'company_url', p.situs,
    'company_url_direct', p.situs,
    'company_industry', p.industri,
    'company_description', p.deskripsi,
    'company_num_employees', p.ukuran,
    'location', coalesce(nullif(m.lokasi, ''), nullif(p.kota, ''), 'Indonesia'),
    'employment_type', m.tipe,
    'job_type', m.tipe,
    'work_arrangement', m.cara_kerja,
    'is_remote', m.cara_kerja = 'remote',
    'category', m.kategori,
    'job_level', m.jenjang,
    'experience_range', m.jenjang,
    'min_amount', case when m.tampilkan_gaji then m.gaji_min end,
    'max_amount', case when m.tampilkan_gaji then coalesce(m.gaji_max, m.gaji_min) end,
    'currency', case when m.tampilkan_gaji and coalesce(m.gaji_min, m.gaji_max) is not null then 'IDR' end,
    'interval', case when m.tampilkan_gaji and coalesce(m.gaji_min, m.gaji_max) is not null then 'monthly' end,
    'description', m.deskripsi || case when nullif(m.pendidikan, '') is not null
                                       then E'\n\nPendidikan minimal: ' || m.pendidikan else '' end,
    'status', 'open',
    'prioritas', true,
    'date_posted', m.tayang_mulai::date,
    'created_at', m.tayang_mulai,
    'updated_at', now()
  ));

  select attidentity into identitas from pg_attribute
   where attrelid = 'public.jobs'::regclass and attname = 'id';
  if identitas = 'a' then
    insert into public.jobs overriding system value
      select * from jsonb_populate_record(null::public.jobs, data);
  else
    insert into public.jobs select * from jsonb_populate_record(null::public.jobs, data);
  end if;
end $$;

create or replace function public.loker_perusahaan_sinkron()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    delete from public.jobs where id = 800000000 + old.id;
  else
    perform public.loker_perusahaan_ke_jobs(new);
  end if;
  return null;
end $$;
drop trigger if exists loker_perusahaan_sinkron on public.loker_perusahaan;
create trigger loker_perusahaan_sinkron
  after insert or update or delete on public.loker_perusahaan
  for each row execute function public.loker_perusahaan_sinkron();

-- Profil perusahaan berubah (nama, logo) → loker yang tayang ikut diperbarui
create or replace function public.perusahaan_sinkron()
returns trigger language plpgsql security definer set search_path = public as $$
declare m public.loker_perusahaan;
begin
  if (new.nama, new.logo_url, new.situs, new.industri, new.deskripsi, new.kota, new.ukuran)
     is distinct from (old.nama, old.logo_url, old.situs, old.industri, old.deskripsi, old.kota, old.ukuran) then
    for m in select * from public.loker_perusahaan where user_id = new.user_id and status = 'tayang' loop
      perform public.loker_perusahaan_ke_jobs(m);
    end loop;
  end if;
  return null;
end $$;
drop trigger if exists perusahaan_sinkron on public.perusahaan;
create trigger perusahaan_sinkron
  after update on public.perusahaan
  for each row execute function public.perusahaan_sinkron();

-- Loker yang masa tayangnya habis → "berakhir" (hilang dari situs).
-- Dipanggil oleh /api/loker (paling sering tiap 10 menit), dasbor
-- pemberi kerja, dan setelah tabel jobs dikosongkan scrape harian.
create or replace function public.rapikan_loker_mitra()
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update public.loker_perusahaan set status = 'berakhir'
   where status = 'tayang' and tayang_sampai <= now();
  get diagnostics n = row_count;
  return n;
end $$;
grant execute on function public.rapikan_loker_mitra() to authenticated;

-- Scrape harian mengosongkan jobs (TRUNCATE) → salin ulang loker yang tayang
create or replace function public.jobs_pulihkan_mitra()
returns trigger language plpgsql security definer set search_path = public as $$
declare m public.loker_perusahaan;
begin
  perform public.rapikan_loker_mitra();
  for m in select * from public.loker_perusahaan where status = 'tayang' loop
    perform public.loker_perusahaan_ke_jobs(m);
  end loop;
  return null;
end $$;
drop trigger if exists jobs_pulihkan_mitra on public.jobs;
create trigger jobs_pulihkan_mitra
  after truncate on public.jobs
  for each statement execute function public.jobs_pulihkan_mitra();

-- --------------------------------------------------------- aksi status
-- Ajukan loker untuk dicek admin. Memakai 1 kredit bila belum pernah dibayar.
create or replace function public.ajukan_loker(p_id bigint)
returns text language plpgsql security definer set search_path = public as $$
declare m public.loker_perusahaan;
begin
  select * into m from public.loker_perusahaan where id = p_id and user_id = auth.uid() for update;
  if not found then raise exception 'Loker tidak ditemukan.'; end if;
  if m.status not in ('draf', 'ditolak') then raise exception 'Loker ini sudah diajukan.'; end if;
  if not m.sudah_bayar then
    update public.perusahaan set kredit = kredit - 1 where user_id = auth.uid() and kredit > 0;
    if not found then raise exception 'Kredit loker habis. Beli paket terlebih dahulu.'; end if;
  end if;
  update public.loker_perusahaan set status = 'menunggu', sudah_bayar = true, alasan_tolak = null
   where id = p_id;
  return 'menunggu';
end $$;
grant execute on function public.ajukan_loker(bigint) to authenticated;

-- Admin (situs: saya_admin, Telegram: service role) menyetujui loker
create or replace function public.setujui_loker(p_id bigint)
returns text language plpgsql security definer set search_path = public as $$
declare m public.loker_perusahaan;
begin
  if not (public.saya_admin() or coalesce(auth.role(), '') = 'service_role' or session_user = 'postgres') then
    raise exception 'Khusus admin.';
  end if;
  select * into m from public.loker_perusahaan where id = p_id for update;
  if not found then raise exception 'Loker tidak ditemukan.'; end if;
  if m.status <> 'menunggu' then raise exception 'Status loker: %', m.status; end if;
  update public.loker_perusahaan set
    status = 'tayang',
    alasan_tolak = null,
    -- Pengajuan ulang setelah diubah: masa tayang lama dilanjutkan
    tayang_mulai = case when m.tayang_sampai > now() then m.tayang_mulai else now() end,
    tayang_sampai = case when m.tayang_sampai > now() then m.tayang_sampai
                         else now() + make_interval(days => public.masa_tayang_loker()) end
   where id = p_id;
  return 'tayang';
end $$;
grant execute on function public.setujui_loker(bigint) to authenticated;

-- Admin menolak loker. Kredit dikembalikan bila loker belum pernah tayang.
create or replace function public.tolak_loker(p_id bigint, p_alasan text)
returns text language plpgsql security definer set search_path = public as $$
declare m public.loker_perusahaan;
begin
  if not (public.saya_admin() or coalesce(auth.role(), '') = 'service_role' or session_user = 'postgres') then
    raise exception 'Khusus admin.';
  end if;
  select * into m from public.loker_perusahaan where id = p_id for update;
  if not found then raise exception 'Loker tidak ditemukan.'; end if;
  if m.status not in ('menunggu', 'tayang') then raise exception 'Status loker: %', m.status; end if;
  if m.sudah_bayar and m.tayang_sampai is null then
    update public.perusahaan set kredit = kredit + 1 where user_id = m.user_id;
  end if;
  update public.loker_perusahaan set
    status = 'ditolak',
    alasan_tolak = nullif(trim(coalesce(p_alasan, '')), ''),
    sudah_bayar = m.sudah_bayar and m.tayang_sampai is not null
   where id = p_id;
  return 'ditolak';
end $$;
grant execute on function public.tolak_loker(bigint, text) to authenticated;

-- Pemberi kerja (atau admin) menutup loker lebih awal
create or replace function public.tutup_loker(p_id bigint)
returns text language plpgsql security definer set search_path = public as $$
begin
  update public.loker_perusahaan set status = 'ditutup'
   where id = p_id and status in ('menunggu', 'tayang')
     and (user_id = auth.uid() or public.saya_admin());
  if not found then raise exception 'Loker tidak bisa ditutup.'; end if;
  return 'ditutup';
end $$;
grant execute on function public.tutup_loker(bigint) to authenticated;

-- Statistik sederhana untuk pemberi kerja (boleh dipanggil pengunjung)
create or replace function public.catat_loker_mitra(p_id bigint, p_jenis text)
returns void language sql security definer set search_path = public as $$
  update public.loker_perusahaan
     set klik = klik + case when p_jenis = 'klik' then 1 else 0 end,
         dilihat = dilihat + case when p_jenis = 'lihat' then 1 else 0 end
   where id = p_id and status = 'tayang';
$$;
grant execute on function public.catat_loker_mitra(bigint, text) to anon, authenticated;

-- ------------------------------------------------- logo perusahaan
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logo-perusahaan', 'logo-perusahaan', true, 1048576, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

drop policy if exists "logo perusahaan unggah" on storage.objects;
create policy "logo perusahaan unggah" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'logo-perusahaan' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "logo perusahaan ganti" on storage.objects;
create policy "logo perusahaan ganti" on storage.objects
  for update to authenticated
  using (bucket_id = 'logo-perusahaan' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "logo perusahaan hapus" on storage.objects;
create policy "logo perusahaan hapus" on storage.objects
  for delete to authenticated
  using (bucket_id = 'logo-perusahaan' and (storage.foldername(name))[1] = auth.uid()::text);
