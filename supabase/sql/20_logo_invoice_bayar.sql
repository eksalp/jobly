-- =====================================================================
--  20 · Perbaikan unggah logo, invoice kredit loker, lanjutkan bayar
-- =====================================================================
--  Jalankan sekali di SQL Editor project DB1, setelah 19_pemberi_kerja.sql.
--  Aman dijalankan ulang.
-- =====================================================================

-- ---------------------------------------------- 1. unggah logo perusahaan
-- Unggahan dengan "upsert" juga membutuhkan izin SELECT. Tanpa policy ini
-- Supabase Storage menolak dengan "new row violates row-level security".
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logo-perusahaan', 'logo-perusahaan', true, 1048576, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

drop policy if exists "logo perusahaan baca" on storage.objects;
create policy "logo perusahaan baca" on storage.objects
  for select to authenticated
  using (bucket_id = 'logo-perusahaan' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "logo perusahaan unggah" on storage.objects;
create policy "logo perusahaan unggah" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'logo-perusahaan' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "logo perusahaan ganti" on storage.objects;
create policy "logo perusahaan ganti" on storage.objects
  for update to authenticated
  using (bucket_id = 'logo-perusahaan' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'logo-perusahaan' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "logo perusahaan hapus" on storage.objects;
create policy "logo perusahaan hapus" on storage.objects
  for delete to authenticated
  using (bucket_id = 'logo-perusahaan' and (storage.foldername(name))[1] = auth.uid()::text);

-- ------------------------------------------- 2. invoice pembelian kredit
alter table public.pembelian_kredit add column if not exists no_invoice text;
alter table public.pembelian_kredit add column if not exists metode text;        -- payment_type Midtrans, mis. qris
alter table public.pembelian_kredit add column if not exists transaksi_id text;  -- transaction_id Midtrans
create unique index if not exists pembelian_kredit_no_invoice_idx on public.pembelian_kredit (no_invoice);
create sequence if not exists public.no_invoice_seq;

-- Nomor invoice berurutan: INV/WK/2026/11/00001
create or replace function public.buat_no_invoice(p_waktu timestamptz)
returns text language sql as $$
  select 'INV/WK/' || to_char(p_waktu at time zone 'Asia/Jakarta', 'YYYY/MM') || '/'
         || lpad(nextval('public.no_invoice_seq')::text, 5, '0');
$$;

-- Pembelian yang sudah lunas sebelum SQL ini dijalankan ikut diberi nomor
do $$
declare b record;
begin
  for b in select order_id, coalesce(dibayar_at, dibuat_at) w from public.pembelian_kredit
            where status = 'paid' and no_invoice is null order by coalesce(dibayar_at, dibuat_at) loop
    update public.pembelian_kredit set no_invoice = public.buat_no_invoice(b.w) where order_id = b.order_id;
  end loop;
end $$;

-- Pelunasan (dipanggil payment-webhook) sekarang juga memberi nomor invoice
-- dan mencatat metode serta ID transaksi Midtrans.
create or replace function public.lunasi_pembelian_kredit(p_order text, p_metode text default null, p_transaksi text default null)
returns int language plpgsql security definer set search_path = public as $$
declare b public.pembelian_kredit;
begin
  update public.pembelian_kredit set
    status = 'paid',
    dibayar_at = now(),
    no_invoice = coalesce(no_invoice, public.buat_no_invoice(now())),
    metode = coalesce(p_metode, metode),
    transaksi_id = coalesce(p_transaksi, transaksi_id)
   where order_id = p_order and status <> 'paid'
   returning * into b;
  if not found then return 0; end if;
  update public.perusahaan set kredit = kredit + b.kredit where user_id = b.user_id;
  return b.kredit;
end $$;
drop function if exists public.lunasi_pembelian_kredit(text);
revoke execute on function public.lunasi_pembelian_kredit(text, text, text) from public, anon, authenticated;

-- ------------------------------- 3. lanjutkan pembayaran (pencari kerja)
-- Pengguna boleh membaca pembayarannya sendiri, supaya pembayaran QRIS yang
-- jendelanya tertutup bisa dibuka lagi. Penulisan tetap hanya oleh server.
alter table public.payments enable row level security;
drop policy if exists "payments baca sendiri" on public.payments;
create policy "payments baca sendiri" on public.payments
  for select to authenticated using (user_id = auth.uid());
