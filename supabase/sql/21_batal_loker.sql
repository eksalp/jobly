-- =====================================================================
--  21 · Batalkan pengajuan loker tanpa kehilangan kredit
-- =====================================================================
--  Jalankan sekali di SQL Editor project DB1, setelah SQL 19. Aman diulang.
--
--  tutup_loker sekarang membedakan dua keadaan:
--   - Loker masih menunggu persetujuan dan BELUM PERNAH tayang
--     → pengajuan dibatalkan: loker kembali menjadi draf dan 1 kredit
--       dikembalikan. Draf ini bisa diubah, diajukan lagi, atau dihapus.
--   - Loker sedang tayang (atau pernah tayang lalu diubah)
--     → loker ditutup dan hilang dari situs. Kredit tidak dikembalikan
--       karena sudah terpakai untuk masa tayang.
-- =====================================================================

create or replace function public.tutup_loker(p_id bigint)
returns text language plpgsql security definer set search_path = public as $$
declare m public.loker_perusahaan;
begin
  select * into m from public.loker_perusahaan
   where id = p_id and (user_id = auth.uid() or public.saya_admin())
   for update;
  if not found then raise exception 'Loker tidak ditemukan.'; end if;
  if m.status not in ('menunggu', 'tayang') then raise exception 'Loker ini tidak bisa ditutup.'; end if;

  if m.status = 'menunggu' and m.tayang_sampai is null then
    if m.sudah_bayar then
      update public.perusahaan set kredit = kredit + 1 where user_id = m.user_id;
    end if;
    update public.loker_perusahaan set status = 'draf', sudah_bayar = false where id = p_id;
    return 'dibatalkan';
  end if;

  update public.loker_perusahaan set status = 'ditutup' where id = p_id;
  return 'ditutup';
end $$;
grant execute on function public.tutup_loker(bigint) to authenticated;
