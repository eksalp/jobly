-- =====================================================================
--  Portofolio versi English: simpan hasil terjemahan per proyek
-- =====================================================================
--  Kolom ini menyimpan { hash, teks } dari edge function terjemah-portofolio
--  supaya isi yang sama tidak diterjemahkan berulang kali (hemat biaya AI).
--  Pengguna sudah boleh meng-update barisnya sendiri (lihat 05_portofolio.sql).
--  Aman dijalankan ulang.
-- =====================================================================
alter table public.portofolio_proyek add column if not exists terjemahan jsonb;

notify pgrst, 'reload schema';
