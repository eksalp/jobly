-- =====================================================================
--  10 · Rekomendasi sertifikasi & pelatihan
-- =====================================================================
--  Jalankan sekali di Supabase → SQL Editor (aman dijalankan ulang).
--
--  • Data dikelola admin lewat bot Telegram (Edge Function telegram-bot
--    memakai service role), jadi tidak ada policy tulis untuk pengguna.
--  • Pengunjung hanya bisa membaca yang aktif dan belum lewat tanggal
--    tutup pendaftaran. Yang sudah lewat otomatis hilang dari situs.
--  • Di akhir ada data awal: program yang selalu tersedia (tanpa batch).
--    Program ber-batch (Bangkit, DTS, bootcamp, brevet, dsb.) sebaiknya
--    ditambahkan dari Telegram lengkap dengan tanggalnya.
-- =====================================================================

create table if not exists public.sertifikasi (
  id            bigint generated always as identity primary key,
  nama          text not null,
  penyelenggara text not null default '',
  url           text not null default '',
  jenis         text not null default 'sertifikasi',
  bidang        text[] not null default '{}',
  posisi        text[] not null default '{}',
  jenjang       text not null default 'dasar',
  biaya         bigint,                     -- rupiah; 0 = gratis; null = lihat ket_biaya
  ket_biaya     text not null default '',
  mode          text not null default 'online',
  durasi        text not null default '',
  batch         text not null default '',
  buka          date,
  tutup         date,
  mulai         date,
  ringkas       text not null default '',
  manfaat       text not null default '',
  aktif         boolean not null default true,
  diubah_oleh   text not null default '',
  dibuat_at     timestamptz not null default now(),
  diubah_at     timestamptz not null default now(),
  constraint sertifikasi_jenis_sah check (jenis in ('sertifikasi', 'pelatihan', 'bootcamp', 'beasiswa', 'kursus')),
  constraint sertifikasi_jenjang_sah check (jenjang in ('dasar', 'menengah', 'lanjut')),
  constraint sertifikasi_mode_sah check (mode in ('online', 'offline', 'hybrid')),
  constraint sertifikasi_panjang check (
    char_length(nama) between 3 and 200
    and char_length(url) <= 500
    and char_length(ringkas) <= 600
    and char_length(manfaat) <= 600
  )
);

create index if not exists sertifikasi_aktif_idx on public.sertifikasi (aktif, tutup);
create index if not exists sertifikasi_bidang_idx on public.sertifikasi using gin (bidang);

alter table public.sertifikasi enable row level security;

drop policy if exists "sertifikasi baca publik" on public.sertifikasi;
create policy "sertifikasi baca publik" on public.sertifikasi
  for select to anon, authenticated
  using (aktif and (tutup is null or tutup >= (now() at time zone 'Asia/Jakarta')::date));

create or replace function public.sertifikasi_ubah_at()
returns trigger
language plpgsql
as $$
begin
  new.diubah_at := now();
  return new;
end;
$$;

drop trigger if exists sertifikasi_ubah_at on public.sertifikasi;
create trigger sertifikasi_ubah_at
  before update on public.sertifikasi
  for each row execute function public.sertifikasi_ubah_at();

-- ---------------------------------------------------------------------
--  Data awal: program yang selalu tersedia (tidak ber-batch)
-- ---------------------------------------------------------------------
insert into public.sertifikasi (nama, penyelenggara, url, jenis, bidang, posisi, jenjang, biaya, ket_biaya, mode, durasi, ringkas, manfaat)
select v.* from (values
  ('Google Data Analytics Professional Certificate', 'Google via Coursera', 'https://www.coursera.org/professional-certificates/google-data-analytics',
   'sertifikasi', array['data'], array['data analyst','business analyst','analis data','reporting'], 'dasar', null::bigint, 'Langganan Coursera; tersedia bantuan biaya', 'online', '± 6 bulan (10 jam/minggu)',
   'Dasar analisis data: spreadsheet, SQL, Tableau, dan R, dengan studi kasus akhir.', 'Pintu masuk paling umum untuk posisi data analyst entry level.'),
  ('IBM Data Science Professional Certificate', 'IBM via Coursera', 'https://www.coursera.org/professional-certificates/ibm-data-science',
   'sertifikasi', array['data'], array['data scientist','data analyst','machine learning'], 'dasar', null, 'Langganan Coursera; tersedia bantuan biaya', 'online', '± 4–5 bulan',
   'Python, SQL, visualisasi, dan machine learning dasar dengan proyek portofolio.', 'Melengkapi CV calon data scientist dengan proyek Python yang bisa ditunjukkan.'),
  ('Microsoft Certified: Power BI Data Analyst Associate (PL-300)', 'Microsoft', 'https://learn.microsoft.com/credentials/certifications/data-analyst-associate/',
   'sertifikasi', array['data','keuangan'], array['data analyst','bi analyst','reporting','financial analyst'], 'menengah', null, 'Biaya ujian; materi belajar gratis di Microsoft Learn', 'online', 'Belajar mandiri + ujian',
   'Sertifikasi resmi untuk menyiapkan, memodelkan, dan memvisualisasikan data di Power BI.', 'Banyak dicantumkan di loker BI/reporting di perusahaan Indonesia.'),
  ('Google UX Design Professional Certificate', 'Google via Coursera', 'https://www.coursera.org/professional-certificates/google-ux-design',
   'sertifikasi', array['desain','produk'], array['ui/ux designer','product designer','ux researcher'], 'dasar', null, 'Langganan Coursera; tersedia bantuan biaya', 'online', '± 6 bulan',
   'Riset pengguna, wireframe, prototipe di Figma, dan 3 proyek portofolio.', 'Menghasilkan portofolio UX yang langsung bisa dilampirkan saat melamar.'),
  ('Google Project Management Professional Certificate', 'Google via Coursera', 'https://www.coursera.org/professional-certificates/google-project-management',
   'sertifikasi', array['produk','mt'], array['project manager','project coordinator','pmo','management trainee'], 'dasar', null, 'Langganan Coursera; tersedia bantuan biaya', 'online', '± 6 bulan',
   'Dasar manajemen proyek tradisional dan Agile/Scrum.', 'Cocok untuk fresh graduate yang mengincar project coordinator atau MT.'),
  ('Google Digital Marketing & E-commerce Professional Certificate', 'Google via Coursera', 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce',
   'sertifikasi', array['marketing'], array['digital marketing','social media','e-commerce','performance marketing'], 'dasar', null, 'Langganan Coursera; tersedia bantuan biaya', 'online', '± 6 bulan',
   'SEO, SEM, email marketing, analitik, dan pengelolaan toko online.', 'Dasar yang lengkap untuk posisi digital marketing junior.'),
  ('Google IT Support Professional Certificate', 'Google via Coursera', 'https://www.coursera.org/professional-certificates/google-it-support',
   'sertifikasi', array['it'], array['it support','helpdesk','system administrator'], 'dasar', null, 'Langganan Coursera; tersedia bantuan biaya', 'online', '± 3–6 bulan',
   'Troubleshooting, jaringan, sistem operasi, administrasi sistem, dan keamanan dasar.', 'Jalur awal ke IT support sebelum naik ke sysadmin atau cloud.'),
  ('AWS Certified Cloud Practitioner', 'Amazon Web Services', 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
   'sertifikasi', array['it'], array['cloud engineer','devops','backend developer','it support'], 'dasar', null, 'Biaya ujian (USD)', 'online', 'Belajar mandiri + ujian',
   'Konsep dasar cloud AWS: layanan inti, keamanan, harga, dan dukungan.', 'Langkah pertama sebelum sertifikasi AWS tingkat associate.'),
  ('Cisco Networking Academy', 'Cisco', 'https://www.netacad.com',
   'kursus', array['it'], array['network engineer','it support','cybersecurity'], 'dasar', 0, 'Banyak kelas gratis', 'online', 'Bervariasi per kelas',
   'Kelas jaringan, keamanan siber, dan pemrograman dasar, termasuk jalur persiapan CCNA.', 'Dasar jaringan yang dibutuhkan untuk IT support dan network engineer.'),
  ('Dicoding Academy', 'Dicoding', 'https://www.dicoding.com/academies',
   'kursus', array['it','data'], array['web developer','android developer','backend developer','machine learning'], 'dasar', null, 'Ada kelas gratis dan berbayar', 'online', 'Bervariasi per kelas',
   'Kelas pemrograman berbahasa Indonesia dengan review submission dan sertifikat kompetensi.', 'Sertifikat Dicoding cukup dikenal perusahaan teknologi lokal.'),
  ('Google Ads Certification', 'Google Skillshop', 'https://skillshop.withgoogle.com',
   'sertifikasi', array['marketing'], array['performance marketing','digital marketing','sem specialist','ads specialist'], 'dasar', 0, 'Gratis', 'online', 'Belajar mandiri + ujian',
   'Sertifikasi resmi Google untuk Search, Display, Video, dan Shopping Ads.', 'Bukti cepat dan gratis bahwa kamu memahami Google Ads.'),
  ('HubSpot Academy (Inbound, Content, Email Marketing)', 'HubSpot', 'https://academy.hubspot.com',
   'sertifikasi', array['marketing','sales','cs'], array['content marketing','email marketing','sales','customer success'], 'dasar', 0, 'Gratis', 'online', 'Beberapa jam per sertifikat',
   'Kumpulan sertifikasi gratis untuk inbound marketing, konten, email, dan penjualan.', 'Menambah kredibilitas CV marketing/sales tanpa biaya.'),
  ('Microsoft Office Specialist (MOS)', 'Microsoft via Certiport', 'https://certiport.pearsonvue.com/Certifications/Microsoft/MOS/Overview',
   'sertifikasi', array['admin','keuangan','cs'], array['admin','sekretaris','data entry','staf administrasi'], 'dasar', null, 'Biaya ujian di pusat tes resmi', 'offline', 'Ujian 50 menit per aplikasi',
   'Sertifikasi kemahiran Word, Excel, dan PowerPoint.', 'Membuktikan kemampuan Office yang hampir selalu diminta untuk posisi admin.'),
  ('TOEFL ITP', 'ETS (di Indonesia lewat ITC)', 'https://www.ets.org/toefl/itp.html',
   'sertifikasi', array['mt','admin','keuangan','hr'], array['management trainee','bumn','bank','semua posisi'], 'dasar', null, 'Biaya tes', 'offline', 'Tes ± 2 jam',
   'Tes kemampuan bahasa Inggris yang sering diminta BUMN, bank, dan program MT.', 'Banyak lowongan BUMN dan bank mensyaratkan skor TOEFL minimal.'),
  ('IELTS', 'British Council / IDP', 'https://ielts.org',
   'sertifikasi', array['mt','pendidikan'], array['beasiswa','kerja luar negeri','management trainee'], 'menengah', null, 'Biaya tes', 'offline', 'Tes ± 3 jam',
   'Tes bahasa Inggris internasional untuk studi dan kerja di luar negeri.', 'Diperlukan untuk beasiswa luar negeri dan perusahaan multinasional tertentu.'),
  ('Certified Associate in Project Management (CAPM)', 'Project Management Institute (PMI)', 'https://www.pmi.org/certifications/certified-associate-capm',
   'sertifikasi', array['produk'], array['project coordinator','project manager','pmo'], 'menengah', null, 'Biaya ujian (USD)', 'online', 'Belajar 23 jam + ujian',
   'Sertifikasi tingkat awal dari PMI sebelum PMP.', 'Nilai tambah untuk project coordinator yang ingin naik ke project manager.'),
  ('Project Management Professional (PMP)', 'Project Management Institute (PMI)', 'https://www.pmi.org/certifications/project-management-pmp',
   'sertifikasi', array['produk','teknik','it'], array['project manager','program manager','construction manager'], 'lanjut', null, 'Biaya ujian (USD); syarat pengalaman', 'online', 'Persiapan beberapa bulan',
   'Sertifikasi manajemen proyek paling dikenal di dunia, mensyaratkan pengalaman memimpin proyek.', 'Sering menjadi syarat posisi project manager senior.'),
  ('Professional Scrum Master I (PSM I)', 'Scrum.org', 'https://www.scrum.org/assessments/professional-scrum-master-i-certification',
   'sertifikasi', array['produk','it'], array['scrum master','product owner','project manager'], 'menengah', null, 'Biaya ujian (USD), tanpa wajib kursus', 'online', 'Belajar mandiri + ujian',
   'Sertifikasi pemahaman Scrum untuk tim pengembangan produk.', 'Dicari untuk posisi scrum master dan project manager di perusahaan teknologi.'),
  ('CFA Program', 'CFA Institute', 'https://www.cfainstitute.org/programs/cfa-program',
   'sertifikasi', array['keuangan'], array['investment analyst','equity research','portfolio manager'], 'lanjut', null, 'Biaya pendaftaran dan ujian per level', 'offline', '3 level, umumnya beberapa tahun',
   'Gelar profesional untuk analisis investasi dan manajemen portofolio.', 'Standar emas karier di investasi dan pasar modal.'),
  ('Brevet Pajak A & B', 'IAI dan penyelenggara pelatihan pajak', 'https://iaiglobal.or.id',
   'pelatihan', array['keuangan'], array['staf pajak','tax officer','akuntan','konsultan pajak'], 'menengah', null, 'Berbayar; jadwal per angkatan', 'hybrid', 'Beberapa minggu',
   'Pelatihan perpajakan untuk orang pribadi dan badan.', 'Sering diminta untuk posisi tax staff dan akuntan.'),
  ('Sertifikasi Kompetensi BNSP', 'Lembaga Sertifikasi Profesi (LSP) berlisensi BNSP', 'https://bnsp.go.id',
   'sertifikasi', array['admin','hr','keuangan','teknik','logistik'], array['semua posisi'], 'menengah', null, 'Bervariasi per LSP', 'offline', 'Uji kompetensi',
   'Sertifikat kompetensi kerja nasional untuk berbagai profesi melalui LSP.', 'Diakui secara nasional dan sering diminta di BUMN serta proyek pemerintah.'),
  ('Ahli K3 Umum (AK3U)', 'Kemnaker melalui PJK3 terdaftar', 'https://kemnaker.go.id',
   'sertifikasi', array['teknik','logistik'], array['hse officer','safety officer','supervisor produksi'], 'menengah', null, 'Berbayar; jadwal per angkatan', 'offline', '± 2 minggu',
   'Pembinaan dan sertifikasi Ahli K3 Umum dari Kemnaker.', 'Syarat umum untuk posisi HSE/safety di industri dan konstruksi.'),
  ('SHRM Certified Professional (SHRM-CP)', 'SHRM', 'https://www.shrm.org/credentials',
   'sertifikasi', array['hr'], array['hr generalist','hr business partner','talent acquisition'], 'lanjut', null, 'Biaya ujian (USD)', 'online', 'Persiapan beberapa bulan',
   'Sertifikasi HR internasional untuk praktisi SDM.', 'Nilai tambah besar di perusahaan multinasional.'),
  ('Pendidikan Khusus Profesi Advokat (PKPA)', 'Organisasi advokat (mis. PERADI)', 'https://peradi.or.id',
   'pelatihan', array['hukum'], array['legal officer','advokat','corporate lawyer'], 'menengah', null, 'Berbayar; jadwal per angkatan', 'hybrid', 'Beberapa minggu',
   'Pendidikan wajib sebelum ujian profesi advokat.', 'Tahap penting untuk karier hukum dan legal corporate.'),
  ('ASCM Certified Supply Chain Professional (CSCP)', 'ASCM (APICS)', 'https://www.ascm.org/learning-development/certifications-credentials/cscp/',
   'sertifikasi', array['logistik'], array['supply chain','procurement','ppic','logistics manager'], 'lanjut', null, 'Biaya ujian (USD)', 'online', 'Persiapan beberapa bulan',
   'Sertifikasi internasional manajemen rantai pasok.', 'Diakui di perusahaan manufaktur dan logistik multinasional.')
) as v(nama, penyelenggara, url, jenis, bidang, posisi, jenjang, biaya, ket_biaya, mode, durasi, ringkas, manfaat)
where not exists (select 1 from public.sertifikasi s where s.nama = v.nama);

notify pgrst, 'reload schema';
