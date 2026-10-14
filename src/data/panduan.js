/**
 * Panduan kerja remote untuk pemula (halaman /panduan).
 *
 * Dua jenis isi:
 *   - "profesi": panduan per pekerjaan, susunannya seragam
 *   - "insight": topik umum yang dibutuhkan semua pekerja remote
 *
 * Angka penghasilan selalu disertai sumbernya. Kalau sumbernya diperbarui,
 * cukup ubah di sini. Versi bahasa Inggris ada di panduan.en.js (dipakai
 * otomatis saat bahasa tampilan English).
 *
 * `remoteQ`   kata kunci untuk tombol "Lihat lowongannya" (→ /remote?q=...)
 * `kursus`    kata kunci untuk mencocokkan katalog kursus (data/kursus.js)
 */

const SUMBER = {
  upwork: { nama: "Upwork, Best Work-From-Home Jobs 2026", url: "https://www.upwork.com/resources/best-work-from-home-jobs" },
  cnbcVa: {
    nama: "CNBC Indonesia, April 2026",
    url: "https://www.cnbcindonesia.com/lifestyle/20260424104344-33-729520/banyak-yang-beralih-jadi-virtual-assistant-segini-gaji-dan-modalnya",
  },
  kkCs: { nama: "KantorKu, Gaji Customer Service 2026", url: "https://kantorku.id/blog/gaji-customer-service" },
  kkSosmed: { nama: "KantorKu, Gaji Social Media Specialist 2026", url: "https://kantorku.id/blog/gaji-social-media-specialist/" },
  kkWriter: { nama: "KantorKu, Gaji Content Writer 2026", url: "https://kantorku.id/blog/gaji-content-writer" },
  kkDesain: { nama: "KantorKu, Gaji Graphic Designer 2026", url: "https://kantorku.id/blog/gaji-graphic-designer" },
  bwa: {
    nama: "BuildWithAngga, 7 Pekerjaan Remote Tanpa Coding 2026 (estimasi penulis)",
    url: "https://buildwithangga.com/tips/7-pekerjaan-remote-tanpa-coding-di-era-ai-digital-2026",
  },
  careerflow: {
    nama: "Lowongan Indonesian Data Annotator, Careerflow (2026)",
    url: "https://jobs.techstars.com/companies/careerflow/jobs/78359771-indonesian-data-annotator",
  },
  bps: {
    nama: "BPS lewat Databoks, Februari 2026",
    url: "https://databoks.katadata.co.id/ketenagakerjaan/statistik/6a3dd8b1c7e23/rata-rata-gaji-freelance-di-provinsi-indonesia-awal-2026",
  },
  djp: { nama: "DJP, Coretaxpedia: Penghasilan dari Pekerjaan Bebas", url: "https://pajak.go.id/coretaxpedia/penghasilan-dari-pekerjaan-bebas" },
  upworkDataEntry: { nama: "Upwork, tarif data entry specialist", url: "https://www.upwork.com/hire/data-entry-specialists/cost/" },
  upworkVideo: { nama: "Upwork, tarif video editor", url: "https://www.upwork.com/hire/video-editors/cost/" },
  ddtc: {
    nama: "DDTCNews, ketentuan PP 20/2026",
    url: "https://news.ddtc.co.id/komunitas/suluh-pajak/1820255/ketentuan-baru-jasa-pekerjaan-bebas-yang-dikecualikan-pph-final-05",
  },
  ukm: {
    nama: "UKMIndonesia, Pajak Freelancer 2026",
    url: "https://ukmindonesia.id/baca-deskripsi-posts/pajak-freelancer-2026-apa-yang-berubah-dan-bagaimana-kamu-harus-menyikapinya",
  },
  cnbcScam: {
    nama: "CNBC Indonesia, Juli 2026",
    url: "https://www.cnbcindonesia.com/news/20260731140934-4-755484/duh-ribuan-wni-terjebak-scam-berkedok-lowongan-kerja-ini-modusnya",
  },
};

/* ------------------------------------------------------------------ */
/*  Panduan per profesi                                                */
/* ------------------------------------------------------------------ */

import { bahasa } from "../i18n.js";
import { PROFESI_EN, INSIGHT_EN, LEVEL_EN } from "./panduan.en.js";
import { PROFESI_TAMBAHAN, KATEGORI_PANDUAN as KATEGORI_ID, KATEGORI_PROFESI_AWAL } from "./panduan2.js";
import { PROFESI_TAMBAHAN_EN, KATEGORI_EN } from "./panduan2.en.js";

const PROFESI_ID = [
  {
    slug: "virtual-assistant",
    judul: "Virtual Assistant",
    ikon: "Headset",
    ringkas: "Bantu urusan admin pemilik bisnis dari jarak jauh: email, jadwal, data, dan riset kecil.",
    level: "Ramah pemula",
    modal: "Laptop, internet stabil, bahasa Inggris tertulis",
    intro:
      "Virtual assistant (VA) mengerjakan tugas administrasi untuk pemilik usaha, pelatih, atau tim kecil yang tidak sempat mengurus semuanya sendiri. Banyak kliennya berasal dari Amerika, Australia, dan Eropa, jadi bahasa Inggris dan disiplin waktu lebih penting daripada ijazah.",
    tugas: [
      "Merapikan kotak masuk email dan membalas pesan rutin",
      "Mengatur jadwal rapat di Google Calendar dengan zona waktu klien",
      "Menginput dan merapikan data di Google Sheets atau CRM",
      "Riset kecil: mencari kontak calon klien, membandingkan harga vendor",
      "Menyiapkan dokumen, presentasi sederhana, dan laporan mingguan",
    ],
    skill: ["Komunikasi tertulis bahasa Inggris", "Google Workspace (Gmail, Calendar, Sheets, Docs)", "Manajemen waktu", "Teliti dan rapi", "Inisiatif bertanya sebelum salah"],
    tools: ["Google Workspace", "Trello atau Asana", "Slack", "Canva", "ChatGPT untuk draf email"],
    penghasilan: [
      { label: "Klien luar negeri, pemula di Asia", nilai: "mulai sekitar US$5 per jam", sumber: SUMBER.cnbcVa },
      { label: "Kisaran tarif VA di Upwork", nilai: "US$10 sampai 20 per jam", sumber: SUMBER.upwork },
    ],
    langkah: [
      { judul: "Pilih 2 sampai 3 layanan inti", isi: "Jangan menawarkan semuanya. Mulai dari yang paling kamu kuasai, misalnya pengelolaan email, input data, dan penjadwalan." },
      { judul: "Kuasai Google Workspace", isi: "Hampir semua klien memakainya. Latih rumus dasar Sheets, berbagi dokumen, dan mengatur kalender lintas zona waktu." },
      { judul: "Buat portofolio contoh", isi: "Buat 2 atau 3 contoh kerja: template laporan mingguan, contoh balasan email pelanggan, atau spreadsheet data yang rapi. Simpan di Google Drive dan bagikan tautannya." },
      { judul: "Siapkan profil", isi: "Rapikan LinkedIn, lalu buat profil di satu platform freelance. Tulis jelas layanan apa, untuk siapa, dan jam kerja yang kamu sanggupi dalam zona waktu klien." },
      { judul: "Lamar dengan pesan yang personal", isi: "Baca lowongan sampai habis, sebut kebutuhan klien di kalimat pertama, lalu jelaskan cara kamu menyelesaikannya. Lamaran yang disalin untuk semua lowongan mudah dikenali." },
      { judul: "Mulai dari proyek kecil", isi: "Proyek pertama berguna untuk ulasan dan pengalaman. Setelah 3 sampai 5 ulasan bagus, naikkan tarifmu sedikit demi sedikit." },
    ],
    platform: ["LinkedIn", "Upwork", "Fiverr", "Sribulancer", "Glints dan Jobstreet (filter remote)"],
    waspada: [
      "Diminta membayar biaya pelatihan atau 'deposit' sebelum mulai kerja",
      "Diminta memakai rekening atau akun pribadimu untuk menerima uang orang lain",
      "Klien yang mengajak keluar dari platform sebelum ada kontrak dan pembayaran pertama",
    ],
    remoteQ: "virtual assistant",
    kursus: ["microsoft excel", "google sheets", "bahasa inggris", "chatgpt", "ai tools"],
  },
  {
    slug: "customer-support",
    judul: "Customer Support Remote",
    ikon: "MessageCircle",
    ringkas: "Menjawab pertanyaan dan keluhan pelanggan lewat chat, email, atau telepon dari rumah.",
    level: "Ramah pemula",
    modal: "Laptop, internet stabil, headset, ruangan tenang",
    intro:
      "Customer support menjadi wajah perusahaan di depan pelanggan. Banyak perusahaan rintisan, toko online, dan perusahaan luar negeri mencari CS yang bisa bekerja dari rumah, sering dengan sistem shift. Kesabaran dan cara menulis yang jelas lebih dihargai daripada gelar.",
    tugas: [
      "Membalas chat dan email pelanggan sesuai standar waktu respons",
      "Membantu pelanggan melacak pesanan, pengembalian dana, atau masalah akun",
      "Mencatat setiap kasus di sistem tiket",
      "Meneruskan masalah teknis ke tim yang tepat",
      "Memberi masukan ke tim produk dari keluhan yang sering muncul",
    ],
    skill: ["Empati dan tenang saat pelanggan marah", "Menulis singkat dan jelas", "Mengetik cepat dan akurat", "Bahasa Inggris untuk perusahaan luar negeri", "Mudah mempelajari produk baru"],
    tools: ["Zendesk, Freshdesk, atau Intercom", "WhatsApp Business", "Google Workspace", "Slack"],
    penghasilan: [
      { label: "Customer service fresh graduate (Indonesia)", nilai: "Rp3 sampai 4,5 juta per bulan", sumber: SUMBER.kkCs },
      { label: "Customer service 1 sampai 2 tahun (Indonesia)", nilai: "Rp4 sampai 6 juta per bulan", sumber: SUMBER.kkCs },
    ],
    catatanGaji: "Angka di atas untuk posisi customer service secara umum, tidak khusus remote. Perusahaan luar negeri biasanya membayar dalam dolar dengan kisaran yang berbeda.",
    langkah: [
      { judul: "Latih cara menulis jawaban", isi: "Ambil 10 keluhan pelanggan dari ulasan aplikasi mana pun, lalu tulis balasan yang sopan, singkat, dan menyelesaikan masalah. Ini bisa langsung jadi portofolio." },
      { judul: "Kenali sistem tiket", isi: "Banyak penyedia sistem tiket punya versi uji coba gratis dan materi belajar. Pahami istilah seperti tiket, SLA, eskalasi, dan makro." },
      { judul: "Siapkan perangkat", isi: "Headset dengan mikrofon yang jernih, internet cadangan (misalnya paket data di HP), dan ruangan yang tidak berisik. Perusahaan sering menanyakan ini saat wawancara." },
      { judul: "Cari lowongan dengan kata kunci tepat", isi: "Gunakan kata kunci customer support, customer service, chat support, atau customer success, lalu saring yang remote." },
      { judul: "Siap dengan tes", isi: "Proses rekrutmen CS sering ada tes mengetik, tes menulis balasan, atau simulasi telepon. Latih dengan menjawab kasus nyata dalam waktu terbatas." },
    ],
    platform: ["Jobstreet dan Glints (filter remote)", "LinkedIn", "Situs karier perusahaan teknologi", "Upwork"],
    waspada: [
      "Lowongan 'CS online' yang ujungnya meminta kamu merekrut orang lain",
      "Diminta membeli perangkat atau seragam lewat perusahaan",
      "Gaji sangat tinggi untuk pekerjaan tanpa pengalaman",
    ],
    remoteQ: "customer service",
    kursus: ["bahasa inggris", "customer relationship"],
  },
  {
    slug: "admin-media-sosial",
    judul: "Admin Media Sosial",
    ikon: "Instagram",
    ringkas: "Mengelola akun Instagram, TikTok, dan lainnya untuk bisnis: konten, jadwal posting, dan balas komentar.",
    level: "Ramah pemula",
    modal: "HP dengan kamera bagus, laptop, Canva, CapCut",
    intro:
      "Hampir semua usaha butuh media sosial yang aktif, tetapi pemiliknya jarang sempat. Admin media sosial menyusun rencana konten, membuat atau menjadwalkan unggahan, membalas komentar, dan melaporkan hasilnya. Banyak yang memegang beberapa klien sekaligus dari rumah.",
    tugas: [
      "Menyusun kalender konten bulanan",
      "Membuat desain feed dan video pendek",
      "Menulis caption dan memilih tagar",
      "Membalas komentar dan pesan masuk",
      "Membuat laporan jangkauan dan interaksi tiap bulan",
    ],
    skill: ["Menulis caption yang menarik", "Desain dasar dan edit video pendek", "Memahami algoritma tiap platform", "Membaca data Insights", "Konsisten dan tepat waktu"],
    tools: ["Canva", "CapCut", "Meta Business Suite", "Google Sheets untuk kalender konten", "ChatGPT untuk ide konten"],
    penghasilan: [
      { label: "Social media specialist junior (Indonesia)", nilai: "Rp4,5 sampai 6,5 juta per bulan", sumber: SUMBER.kkSosmed },
      { label: "Freelance pemula, per klien", nilai: "sekitar Rp500 ribu sampai 1,5 juta per bulan", sumber: SUMBER.bwa },
    ],
    catatanGaji: "Tarif freelance per klien sangat bergantung pada jumlah konten per bulan. Tulis jelas di penawaranmu berapa unggahan yang termasuk.",
    langkah: [
      { judul: "Kelola satu akun sebagai bukti", isi: "Bisa akun usaha keluarga, teman, atau akun tema yang kamu buat sendiri. Jalankan 1 sampai 2 bulan dengan rutin dan catat pertumbuhannya." },
      { judul: "Buat paket layanan", isi: "Contoh: 12 feed dan 8 story per bulan, termasuk caption dan balas komentar di jam kerja. Paket yang jelas memudahkan calon klien memutuskan." },
      { judul: "Siapkan portofolio visual", isi: "Kumpulkan desain terbaik, contoh kalender konten, dan tangkapan layar Insights (sebelum dan sesudah) dalam satu PDF atau halaman Notion." },
      { judul: "Tawarkan ke UMKM di sekitarmu", isi: "Kafe, toko baju, klinik, dan jasa lokal sering butuh bantuan. Kirim pesan singkat berisi satu saran perbaikan untuk akun mereka." },
      { judul: "Laporkan hasil tiap bulan", isi: "Laporan sederhana berisi angka jangkauan, interaksi, dan rencana bulan depan membuat klien bertahan lebih lama." },
    ],
    platform: ["Instagram dan LinkedIn kamu sendiri", "Glints dan Jobstreet (filter remote)", "Fastwork", "Sribulancer"],
    waspada: [
      "'Tugas like dan follow' yang dibayar per tugas lalu meminta deposit untuk 'tugas premium'",
      "Diminta login ke akun klien lewat tautan yang mencurigakan",
    ],
    remoteQ: "social media",
    kursus: ["social media", "social media marketing", "content planning", "canva", "capcut", "copywriting"],
  },
  {
    slug: "content-writer",
    judul: "Penulis Artikel & SEO",
    ikon: "PenLine",
    ringkas: "Menulis artikel blog dan deskripsi produk yang mudah ditemukan di Google dan enak dibaca.",
    level: "Ramah pemula",
    modal: "Laptop, kemampuan menulis rapi, mau belajar SEO",
    intro:
      "Content writer menulis artikel blog, deskripsi produk, naskah video, sampai email pemasaran. Pekerjaan ini sangat cocok dikerjakan dari rumah karena hasilnya berupa tulisan. AI membuat menulis draf lebih cepat, sehingga yang dicari sekarang adalah penulis yang bisa riset, menyunting, dan menulis dengan suara yang khas.",
    tugas: [
      "Riset topik dan kata kunci",
      "Menulis artikel sesuai brief dan tenggat",
      "Menyunting tulisan sendiri maupun draf dari AI",
      "Menulis deskripsi produk dan caption",
      "Memperbarui artikel lama supaya tetap relevan",
    ],
    skill: ["Ejaan dan tata bahasa yang rapi", "Riset dan memeriksa fakta", "SEO dasar (kata kunci, judul, struktur)", "Menyesuaikan gaya bahasa dengan merek", "Memakai AI tanpa membuat tulisan terasa kaku"],
    tools: ["Google Docs", "Google Search Console atau alat kata kunci", "WordPress", "Grammarly atau KBBI daring", "ChatGPT untuk kerangka"],
    penghasilan: [
      { label: "Content writer 0 sampai 2 tahun (Indonesia)", nilai: "Rp4 sampai 5,5 juta per bulan", sumber: SUMBER.kkWriter },
      { label: "Freelance pemula, per artikel 500 sampai 1.000 kata", nilai: "sekitar Rp50 ribu sampai 150 ribu", sumber: SUMBER.bwa },
      { label: "Kisaran tarif content writer di Upwork", nilai: "US$30 sampai 59 per jam", sumber: SUMBER.upwork },
    ],
    langkah: [
      { judul: "Pilih satu atau dua niche", isi: "Misalnya keuangan pribadi, teknologi, kesehatan, atau parenting. Penulis dengan niche jelas lebih mudah dipercaya dan bisa memasang tarif lebih tinggi." },
      { judul: "Tulis 3 contoh terbaik", isi: "Terbitkan di Medium, blog pribadi, atau LinkedIn. Satu artikel panjang yang dioptimasi SEO, satu deskripsi produk, satu tulisan bergaya santai." },
      { judul: "Pelajari SEO dasar", isi: "Pahami cara memilih kata kunci, menulis judul yang dicari orang, dan menyusun subjudul. Ini yang membedakan penulis biasa dengan penulis yang dicari perusahaan." },
      { judul: "Tentukan tarif per kata atau per artikel", isi: "Tulis jelas apa saja yang termasuk: riset, revisi berapa kali, dan apakah ada gambar. Ini mencegah salah paham." },
      { judul: "Bangun hubungan jangka panjang", isi: "Klien yang puas biasanya memberi pekerjaan rutin. Kirim tulisan tepat waktu dan tawarkan ide topik tanpa diminta." },
    ],
    platform: ["LinkedIn", "Upwork", "Sribulancer", "Projects.co.id", "Glints dan Jobstreet (filter remote)"],
    waspada: [
      "'Tes menulis' berbayar atau tes berupa 5 artikel penuh tanpa bayaran",
      "Klien yang memakai tulisanmu lalu menghilang. Minta uang muka untuk proyek besar.",
    ],
    remoteQ: "content writer",
    kursus: ["content writing", "copywriting", "seo", "keyword research", "penulisan konten"],
  },
  {
    slug: "desainer-grafis",
    judul: "Desainer Media Sosial, Poster & Kemasan",
    ikon: "Palette",
    ringkas: "Mendesain konten media sosial, poster, kemasan, dan materi promosi untuk klien dari mana saja.",
    level: "Butuh latihan",
    modal: "Laptop yang cukup kuat, Canva atau Adobe, portofolio",
    intro:
      "Desainer grafis membuat materi visual yang dipakai merek sehari-hari: feed Instagram, poster promo, banner, kemasan, dan brosur. Klien hampir selalu menilai dari portofolio, bukan dari ijazah, sehingga kamu bisa mulai dari mana saja asalkan karyanya bagus. Untuk pembuatan logo dan identitas merek, lihat panduan Desainer Logo & Branding.",
    tugas: [
      "Menerjemahkan brief klien menjadi konsep visual",
      "Mendesain feed dan Story media sosial sesuai brand guideline klien",
      "Membuat poster, banner, brosur, dan desain kemasan",
      "Menyiapkan file siap cetak atau siap unggah",
      "Merevisi sesuai masukan klien",
    ],
    skill: ["Prinsip desain: tipografi, warna, komposisi", "Menguasai Canva, lalu Adobe Illustrator atau Figma", "Memahami brief dan bertanya yang tepat", "Mengelola revisi", "Menyimpan file dengan rapi"],
    tools: ["Canva", "Adobe Illustrator dan Photoshop", "Figma", "Behance atau Dribbble untuk portofolio"],
    penghasilan: [
      { label: "Desainer grafis pemula, 0 sampai 2 tahun (Indonesia)", nilai: "Rp4 sampai 6 juta per bulan", sumber: SUMBER.kkDesain },
      { label: "Desainer grafis 1 sampai 3 tahun (Indonesia)", nilai: "Rp6 sampai 8,5 juta per bulan", sumber: SUMBER.kkDesain },
    ],
    catatanGaji: "Untuk proyek freelance, tarif biasanya dihitung per desain atau per paket. Bandingkan dengan proyek serupa di platform freelance sebelum menentukan harga.",
    langkah: [
      { judul: "Kuasai dasar desain dulu", isi: "Alat bisa dipelajari cepat, tetapi desain yang enak dilihat datang dari pemahaman tipografi, warna, dan ruang kosong." },
      { judul: "Buat proyek fiktif yang realistis", isi: "Redesain logo dan feed untuk usaha lokal yang kamu kenal, lengkap dengan alasan pilihan desainnya. Ini cara paling cepat mengisi portofolio." },
      { judul: "Tampilkan di Behance atau Dribbble", isi: "Susun 6 sampai 8 karya terbaik. Lebih baik sedikit, tetapi kuat, daripada banyak tetapi biasa." },
      { judul: "Tentukan paket dan batas revisi", isi: "Contoh: logo dengan 3 konsep awal dan 2 kali revisi. Batas revisi melindungi waktumu." },
      { judul: "Minta uang muka", isi: "Untuk klien baru, minta 30 sampai 50 persen di depan. Kirim file final setelah pelunasan." },
    ],
    platform: ["Fiverr", "Upwork", "Behance", "Dribbble", "Fastwork", "Sribulancer"],
    waspada: [
      "'Kontes desain' yang meminta desain jadi tanpa jaminan bayaran",
      "Klien yang meminta file mentah sebelum membayar",
    ],
    remoteQ: "graphic designer",
    kursus: ["graphic design", "canva", "adobe illustrator", "branding", "layout design", "figma"],
  },
  {
    slug: "data-entry",
    judul: "Data Entry",
    ikon: "Keyboard",
    ringkas: "Memasukkan, merapikan, dan memeriksa data. Mudah dimulai, tetapi juga paling banyak penipuannya.",
    level: "Ramah pemula",
    modal: "Laptop, mengetik cepat, Excel atau Google Sheets",
    intro:
      "Data entry adalah pekerjaan memasukkan dan merapikan data: dari dokumen ke spreadsheet, dari formulir ke sistem, atau memeriksa data yang salah. Pekerjaan ini sering jadi pintu masuk kerja remote, tetapi tarifnya cenderung rendah dan banyak lowongan palsu yang memakai nama data entry. Baca bagian waspada dengan teliti.",
    tugas: [
      "Memindahkan data dari dokumen atau gambar ke spreadsheet",
      "Membersihkan data ganda dan format yang tidak seragam",
      "Memeriksa ulang data untuk menemukan kesalahan",
      "Mengisi data produk di toko online",
      "Membuat ringkasan sederhana dari data",
    ],
    skill: ["Mengetik cepat dan akurat", "Excel atau Google Sheets (filter, VLOOKUP, pivot)", "Teliti dan konsisten", "Menjaga kerahasiaan data"],
    tools: ["Microsoft Excel", "Google Sheets", "Google Forms", "Alat OCR untuk membaca teks dari gambar"],
    penghasilan: [
      { label: "Kisaran tarif data entry specialist di Upwork", nilai: "US$10 sampai 20 per jam (median US$13)", sumber: SUMBER.upworkDataEntry },
      { label: "Rata-rata pendapatan bersih pekerja bebas di Indonesia", nilai: "Rp1,68 juta per bulan", sumber: SUMBER.bps },
    ],
    catatanGaji: "Data entry murni umumnya bertarif rendah. Supaya penghasilan naik, kembangkan ke pekerjaan yang butuh keahlian lebih, seperti admin data, analis data junior, atau virtual assistant.",
    langkah: [
      { judul: "Kuasai spreadsheet", isi: "Belajar filter, sort, VLOOKUP atau XLOOKUP, hapus duplikat, dan pivot table. Ini yang membuatmu lebih cepat dan lebih dibayar." },
      { judul: "Ukur kecepatan mengetikmu", isi: "Latih di situs uji mengetik sampai stabil di atas 40 kata per menit dengan akurasi tinggi. Cantumkan angkanya di CV." },
      { judul: "Buat contoh pekerjaan", isi: "Ambil data publik yang berantakan, rapikan, lalu simpan versi sebelum dan sesudah. Bagikan sebagai portofolio." },
      { judul: "Cari di tempat yang jelas", isi: "Utamakan lowongan dari perusahaan dengan nama, situs, dan alamat email resmi. Cek dulu di Cek Loker Jobly sebelum mengirim data diri." },
      { judul: "Naik kelas", isi: "Setelah terbiasa, pelajari analisis data dasar atau tugas admin yang lebih luas. Data entry sebaiknya jadi langkah awal, bukan tujuan akhir." },
    ],
    platform: ["Jobstreet dan Glints (filter remote)", "LinkedIn", "Upwork", "Situs karier perusahaan"],
    waspada: [
      "Diminta membayar biaya pendaftaran, pelatihan, atau 'aktivasi akun'",
      "'Kerja ketik dari HP' dengan gaji harian sangat tinggi",
      "Diminta mengirim foto KTP dan selfie sebelum ada wawancara. Data ini bisa dipakai untuk pinjaman online atas namamu.",
      "Tugas berupa memberi like, rating, atau menonton video yang lama-lama meminta deposit",
    ],
    sumberWaspada: SUMBER.cnbcScam,
    remoteQ: "data entry",
    kursus: ["microsoft excel", "excel", "data cleaning", "spreadsheet", "formula excel", "pivot table"],
  },
  {
    slug: "video-editor",
    judul: "Video Editor Konten Pendek",
    ikon: "Clapperboard",
    ringkas: "Mengedit video pendek untuk TikTok, Reels, dan YouTube Shorts milik kreator dan bisnis.",
    level: "Butuh latihan",
    modal: "Laptop atau HP yang cukup kuat, CapCut atau Premiere",
    intro:
      "Video pendek menjadi format paling dicari di media sosial, sementara banyak kreator dan bisnis tidak sempat mengedit sendiri. Editor video pendek memotong rekaman mentah, menambah teks, musik, dan efek, sehingga video enak ditonton sampai habis. Permintaannya tinggi, termasuk dari klien luar negeri.",
    tugas: [
      "Memotong rekaman panjang menjadi beberapa klip pendek",
      "Menambahkan subtitle, teks, musik, dan transisi",
      "Menyesuaikan ukuran video untuk tiap platform",
      "Mengatur warna dan suara supaya jernih",
      "Mengirim hasil sesuai jadwal unggah klien",
    ],
    skill: ["Ritme editing yang membuat penonton bertahan", "Subtitle dan teks yang mudah dibaca", "Memahami tren tiap platform", "Mengelola file besar dengan rapi"],
    tools: ["CapCut", "Adobe Premiere Pro atau DaVinci Resolve", "Google Drive untuk kirim file", "Pustaka musik bebas royalti"],
    penghasilan: [
      { label: "Kisaran tarif video editor di Upwork", nilai: "US$10 sampai 60 per jam (median US$35)", sumber: SUMBER.upworkVideo },
    ],
    catatanGaji: "Di dalam negeri, tarif biasanya per video atau per paket bulanan. Bandingkan dengan penawaran serupa di platform freelance.",
    langkah: [
      { judul: "Mulai dari CapCut", isi: "CapCut gratis dan cukup untuk sebagian besar video pendek. Setelah lancar, pelajari Premiere atau DaVinci untuk proyek yang lebih besar." },
      { judul: "Edit ulang video yang sudah ada", isi: "Unduh podcast atau wawancara yang bebas dipakai, lalu potong jadi 5 klip pendek. Ini menunjukkan kemampuan memilih momen terbaik." },
      { judul: "Buat showreel 30 detik", isi: "Gabungkan potongan terbaik dalam satu video singkat. Calon klien jarang menonton portofolio panjang." },
      { judul: "Tawarkan uji coba satu video", isi: "Untuk kreator yang kamu incar, tawarkan mengedit satu video dari rekaman mereka. Kalau cocok, lanjut ke paket bulanan." },
    ],
    platform: ["Upwork", "Fiverr", "LinkedIn", "Komunitas kreator di Instagram dan TikTok"],
    waspada: ["Klien yang meminta beberapa video 'tes' gratis berturut-turut"],
    remoteQ: "video editor",
    kursus: ["video editing", "capcut", "konten video", "motion design"],
  },
  {
    slug: "anotasi-data-ai",
    judul: "Anotator Data AI",
    ikon: "BrainCircuit",
    ringkas: "Memberi label pada teks, gambar, atau suara supaya AI bisa belajar. Bahasa Indonesia jadi nilai jual.",
    level: "Ramah pemula",
    modal: "Laptop, internet stabil, teliti, bahasa Indonesia yang baik",
    intro:
      "Perusahaan AI butuh banyak orang untuk memeriksa dan memberi label data: menilai jawaban chatbot, menandai objek di gambar, atau meringkas artikel. Penutur asli bahasa Indonesia dicari untuk proyek berbahasa Indonesia. Pekerjaannya berbasis proyek, jadi jumlah jamnya bisa naik turun.",
    tugas: [
      "Membaca konten berbahasa Indonesia lalu menjawab pertanyaan terstruktur",
      "Menandai bagian gambar atau tangkapan layar sesuai instruksi",
      "Menilai dan memperbaiki jawaban AI",
      "Menulis ringkasan singkat",
    ],
    skill: ["Membaca instruksi panjang dengan teliti", "Bahasa Indonesia yang baik dan benar", "Konsisten dalam waktu lama", "Bahasa Inggris untuk membaca panduan proyek"],
    tools: ["Platform anotasi milik perusahaan", "Google Workspace"],
    penghasilan: [
      { label: "Contoh: Indonesian Data Annotator (Careerflow)", nilai: "US$2,45 per jam, 30 sampai 40 jam per minggu, tanpa pengalaman", sumber: SUMBER.careerflow },
    ],
    catatanGaji: "Proyek yang butuh keahlian khusus (misalnya hukum, kedokteran, atau pemrograman) biasanya dibayar jauh lebih tinggi.",
    langkah: [
      { judul: "Cari dengan kata kunci yang tepat", isi: "Gunakan data annotator, AI trainer, AI rater, atau language specialist Indonesian." },
      { judul: "Siapkan diri untuk tes", isi: "Kebanyakan proses seleksi berupa tes bahasa atau tes ketelitian 15 sampai 60 menit, tanpa wawancara. Kerjakan dengan tenang dan baca instruksi sampai habis." },
      { judul: "Jaga kualitas di minggu pertama", isi: "Skor kualitas awal biasanya menentukan apakah kamu mendapat lebih banyak tugas. Lebih baik lambat tetapi akurat." },
      { judul: "Manfaatkan keahlian lain", isi: "Kalau kamu punya latar belakang di bidang tertentu, cari proyek AI untuk bidang itu. Tarifnya lebih tinggi." },
    ],
    platform: ["LinkedIn", "Situs karier perusahaan AI dan penyedia data", "Upwork"],
    waspada: [
      "Proyek AI asli tidak pernah meminta biaya pendaftaran atau pembelian 'akun kerja'",
      "Hati-hati dengan grup Telegram yang menjual 'akun annotator' atau 'slot proyek'",
    ],
    remoteQ: "annotator",
    kursus: ["artificial intelligence", "ai tools", "prompt engineering", "chatgpt"],
  },
  {
    slug: "tutor-online",
    judul: "Tutor Online",
    ikon: "GraduationCap",
    ringkas: "Mengajar lewat video call: bahasa Inggris, mata pelajaran sekolah, atau bahasa Indonesia untuk orang asing.",
    level: "Butuh keahlian",
    modal: "Laptop dengan kamera, internet stabil, ruangan tenang",
    intro:
      "Kalau kamu menguasai satu bidang dan senang menjelaskan, mengajar online bisa jadi pekerjaan remote yang fleksibel. Murid bisa datang dari dalam negeri (les sekolah, persiapan ujian) maupun luar negeri, misalnya orang asing yang ingin belajar bahasa Indonesia.",
    tugas: [
      "Menyiapkan materi dan latihan untuk tiap sesi",
      "Mengajar lewat Zoom atau Google Meet",
      "Memberi tugas dan memeriksa perkembangan murid",
      "Berkomunikasi dengan orang tua atau murid soal jadwal",
    ],
    skill: ["Menguasai materi dengan baik", "Menjelaskan dengan sederhana", "Sabar dan bisa membaca kebutuhan murid", "Mengelola kelas online"],
    tools: ["Zoom atau Google Meet", "Google Slides atau Canva", "Google Classroom", "Papan tulis digital"],
    penghasilan: [],
    catatanGaji: "Tarif tutor sangat beragam, tergantung mata pelajaran, jenjang murid, dan platform. Bandingkan dengan tutor lain di platform yang kamu pilih sebelum menentukan harga per sesi.",
    langkah: [
      { judul: "Pilih bidang dan jenjang", isi: "Misalnya matematika SMP, bahasa Inggris percakapan, persiapan IELTS, atau bahasa Indonesia untuk penutur asing." },
      { judul: "Buat video perkenalan", isi: "Video 1 sampai 2 menit tentang dirimu dan cara mengajarmu. Banyak platform tutor mewajibkan ini." },
      { judul: "Mulai dari lingkaran terdekat", isi: "Tawarkan sesi percobaan ke kenalan, lalu minta testimoni tertulis." },
      { judul: "Daftar di platform tutor", isi: "Platform membantu mendatangkan murid, sebagai gantinya mereka memotong komisi. Baca ketentuannya sebelum mendaftar." },
    ],
    platform: ["Platform tutor online", "Komunitas orang tua di media sosial", "LinkedIn"],
    waspada: ["Platform yang meminta biaya pendaftaran mahal sebelum ada murid"],
    remoteQ: "tutor",
    kursus: ["bahasa inggris", "ielts", "toefl", "speaking", "video pembelajaran"],
  },
  {
    slug: "admin-keuangan",
    judul: "Admin Keuangan & Bookkeeper",
    ikon: "Calculator",
    ringkas: "Mencatat transaksi, rekonsiliasi bank, dan menyiapkan laporan keuangan sederhana untuk usaha kecil.",
    level: "Butuh keahlian",
    modal: "Laptop, dasar akuntansi, Excel",
    intro:
      "Banyak usaha kecil butuh pembukuan yang rapi tetapi belum perlu staf keuangan penuh waktu. Bookkeeper remote mencatat transaksi, mencocokkan mutasi bank, dan menyiapkan laporan bulanan. Lulusan akuntansi atau yang pernah jadi admin keuangan punya modal kuat di sini.",
    tugas: [
      "Mencatat pemasukan dan pengeluaran",
      "Rekonsiliasi mutasi bank dengan catatan",
      "Membuat dan mengirim invoice",
      "Menyiapkan laporan laba rugi dan neraca sederhana",
      "Membantu menyiapkan data untuk urusan pajak",
    ],
    skill: ["Dasar akuntansi", "Excel tingkat menengah", "Teliti dengan angka", "Menjaga kerahasiaan data klien"],
    tools: ["Microsoft Excel atau Google Sheets", "Software akuntansi seperti Jurnal, Accurate, atau Xero", "Internet banking"],
    penghasilan: [
      { label: "Kisaran tarif akuntan di Upwork", nilai: "US$12 sampai 32 per jam", sumber: SUMBER.upwork },
    ],
    langkah: [
      { judul: "Kuatkan dasar akuntansi", isi: "Pahami jurnal, buku besar, dan laporan keuangan dasar. Sertifikasi atau kursus singkat menambah kepercayaan klien." },
      { judul: "Pelajari satu software akuntansi", isi: "Klien lokal banyak memakai software buatan Indonesia, klien luar negeri sering memakai Xero atau QuickBooks." },
      { judul: "Buat contoh laporan", isi: "Susun pembukuan satu bulan untuk usaha fiktif, lengkap dengan laporan laba rugi. Ini jadi portofolio." },
      { judul: "Tawarkan ke UMKM", isi: "Banyak pemilik usaha tahu pembukuannya berantakan. Tawarkan paket bulanan dengan harga yang jelas." },
    ],
    platform: ["LinkedIn", "Upwork", "Jobstreet dan Glints (filter remote)", "Komunitas UMKM"],
    waspada: ["Diminta memindahkan uang klien ke rekening pribadimu atau rekening pihak ketiga"],
    remoteQ: "finance admin",
    kursus: ["akuntansi", "laporan keuangan", "perpajakan", "pajak", "microsoft excel"],
  },
];

/* ------------------------------------------------------------------ */
/*  Insight: topik umum untuk semua pekerja remote                     */
/* ------------------------------------------------------------------ */

const INSIGHT_ID = [
  {
    slug: "mulai-kerja-remote",
    judul: "Mulai Kerja Remote dari Nol",
    ikon: "Compass",
    ringkas: "Pilih bidang, siapkan perangkat, dan susun rencana 30 hari pertama.",
    bagian: [
      {
        judul: "Pahami dulu kenyataannya",
        isi: "Kerja remote memberi kebebasan waktu dan tempat, tetapi persaingannya juga lebih luas karena kamu bersaing dengan pelamar dari mana saja. Penghasilan di awal sering belum stabil. Sebagai gambaran, rata-rata pendapatan bersih pekerja bebas di Indonesia pada Februari 2026 sekitar Rp1,68 juta per bulan menurut BPS. Yang bisa jauh di atas angka itu biasanya punya keahlian jelas dan klien tetap.",
        sumber: SUMBER.bps,
      },
      {
        judul: "Pilih satu bidang dulu",
        isi: "Mulai dari keahlian yang paling dekat dengan pengalamanmu. Lulusan administrasi cocok mulai dari virtual assistant, yang suka menulis bisa jadi content writer, yang sering mengedit video bisa jadi video editor. Fokus pada satu bidang selama 3 bulan pertama.",
      },
      {
        judul: "Siapkan perangkat minimal",
        poin: ["Laptop yang lancar untuk pekerjaanmu", "Internet utama dan cadangan (paket data di HP)", "Headset dengan mikrofon jernih", "Tempat kerja yang tenang", "Email profesional dengan nama aslimu"],
      },
      {
        judul: "Rencana 30 hari pertama",
        poin: [
          "Minggu 1: pelajari dasar bidang yang kamu pilih",
          "Minggu 2: buat 2 sampai 3 contoh karya untuk portofolio",
          "Minggu 3: rapikan CV, LinkedIn, dan satu profil platform freelance",
          "Minggu 4: kirim minimal 15 lamaran yang personal, lalu catat hasilnya",
        ],
      },
      {
        judul: "Biasakan kerja lintas zona waktu",
        isi: "Klien luar negeri bisa berada 5 sampai 12 jam di belakang Jakarta. Tulis jam kerjamu dalam zona waktu klien, dan gunakan kalender yang menampilkan dua zona waktu sekaligus.",
      },
    ],
    remoteQ: "",
  },
  {
    slug: "portofolio-tanpa-pengalaman",
    judul: "Membuat Portofolio Tanpa Pengalaman",
    ikon: "FolderOpen",
    ringkas: "Belum pernah punya klien? Ini cara menunjukkan kemampuan dengan proyek buatan sendiri.",
    bagian: [
      {
        judul: "Portofolio lebih penting daripada CV",
        isi: "Untuk pekerjaan remote, calon klien ingin melihat hasil kerja, bukan sekadar daftar pengalaman. Tiga contoh karya yang relevan sering lebih meyakinkan daripada CV dua halaman.",
      },
      {
        judul: "Buat proyek yang menyerupai pekerjaan nyata",
        poin: [
          "Virtual assistant: template laporan mingguan, contoh balasan email, spreadsheet yang rapi",
          "Admin media sosial: kalender konten satu bulan dan 9 desain feed untuk usaha lokal",
          "Content writer: satu artikel SEO, satu deskripsi produk, satu naskah video",
          "Desainer: redesain logo usaha lokal lengkap dengan alasan desainnya",
          "Video editor: 5 klip pendek dari satu video panjang",
        ],
      },
      {
        judul: "Tulis konteksnya",
        isi: "Di setiap karya, jelaskan singkat masalahnya, apa yang kamu kerjakan, dan hasilnya. Jujur bahwa ini proyek latihan tidak mengurangi nilainya.",
      },
      {
        judul: "Tempat menyimpan portofolio",
        poin: ["Google Drive dengan tautan yang bisa dibuka siapa saja", "Notion untuk halaman portofolio sederhana", "Behance atau Dribbble untuk desainer", "Medium atau LinkedIn untuk penulis"],
      },
      {
        judul: "Perbarui terus",
        isi: "Setiap selesai proyek nyata, ganti karya latihan dengan hasil kerja sungguhan (dengan izin klien).",
      },
    ],
    remoteQ: "",
  },
  {
    slug: "dapat-klien-pertama",
    judul: "Cara Dapat Klien atau Kerja Remote Pertama",
    ikon: "Handshake",
    ringkas: "Menulis lamaran dan proposal yang dibaca, bukan langsung dilewati.",
    bagian: [
      {
        judul: "Cari di beberapa tempat sekaligus",
        poin: [
          "Lowongan remote di Jobly, Jobstreet, Glints, dan LinkedIn",
          "Platform freelance seperti Upwork, Fiverr, Sribulancer, dan Projects.co.id",
          "Jaringan sendiri: teman, mantan rekan kerja, komunitas",
          "Usaha di sekitarmu yang terlihat butuh bantuan",
        ],
      },
      {
        judul: "Susunan proposal yang efektif",
        poin: [
          "Kalimat pertama: sebut kebutuhan klien dengan kata-katamu sendiri",
          "Kalimat kedua: jelaskan bagaimana kamu akan menyelesaikannya",
          "Lampirkan satu contoh karya yang paling relevan, bukan semuanya",
          "Tutup dengan satu pertanyaan tentang proyeknya",
          "Panjangnya cukup 5 sampai 8 kalimat",
        ],
      },
      {
        judul: "Contoh pembuka",
        isi: "\"Halo, saya lihat Anda butuh bantuan merapikan 2.000 data pelanggan di Google Sheets dan menghapus data ganda. Saya biasa memakai filter dan rumus untuk membersihkan data, contohnya di tautan berikut. Apakah datanya sudah ada di satu file, atau tersebar di beberapa file?\"",
      },
      {
        judul: "Jangan berhenti di satu lamaran",
        isi: "Wajar kalau dari 20 lamaran hanya 1 sampai 2 yang dibalas di awal. Catat lamaranmu, lihat mana yang dibalas, lalu perbaiki pola lamarannya. Fitur Lamaran Saya dan Rencana Lamar di Jobly bisa membantu mencatatnya.",
      },
      {
        judul: "Setelah dapat klien pertama",
        isi: "Kerjakan lebih rapi dari yang diharapkan, komunikasikan progres tanpa diminta, lalu minta ulasan atau testimoni. Klien pertama yang puas sering membawa klien berikutnya.",
      },
    ],
    remoteQ: "",
  },
  {
    slug: "dibayar-klien-luar-negeri",
    judul: "Cara Dibayar Klien Luar Negeri",
    ikon: "Wallet",
    ringkas: "PayPal, Payoneer, Wise, atau lewat platform: kenali pilihannya sebelum mengirim invoice.",
    bagian: [
      {
        judul: "Lewat platform freelance",
        isi: "Kalau kamu bekerja lewat Upwork atau Fiverr, pembayaran diatur platform. Kamu menerima saldo setelah dipotong komisi, lalu menariknya ke rekening atau dompet digital yang tersedia. Cek besaran komisi dan pilihan penarikan terbaru di halaman bantuan platformnya, karena ketentuannya bisa berubah.",
      },
      {
        judul: "Pilihan untuk klien langsung",
        poin: [
          "PayPal: dikenal luas oleh klien luar negeri. Perhatikan biaya penerimaan dan kurs saat menarik ke rupiah.",
          "Payoneer: menyediakan rekening penampung dalam mata uang asing dan banyak dipakai pekerja lepas.",
          "Wise: biaya konversi biasanya transparan. Cek mata uang yang bisa diterima untuk akun yang terdaftar di Indonesia.",
          "Transfer bank internasional (SWIFT): bisa langsung ke rekening bank Indonesia, tetapi biasanya ada potongan dari bank perantara.",
        ],
      },
      {
        judul: "Hitung uang yang benar-benar kamu terima",
        isi: "Selisih kurs dan biaya bisa memakan beberapa persen dari bayaranmu. Sebelum menyetujui tarif, hitung nilai bersihnya dalam rupiah dengan Kalkulator Gaji Jobly.",
        tautan: { label: "Buka Kalkulator Gaji", path: "/kalkulator-gaji" },
      },
      {
        judul: "Kirim invoice yang rapi",
        poin: ["Nama dan kontakmu, nama klien", "Nomor invoice dan tanggal", "Rincian pekerjaan dan jumlahnya", "Mata uang dan cara pembayaran", "Tenggat pembayaran"],
      },
      {
        judul: "Lindungi dirimu",
        isi: "Untuk klien baru, minta uang muka atau pembayaran per tahap. Jangan menerima 'kelebihan transfer' lalu diminta mengembalikan selisihnya. Ini modus penipuan yang umum.",
      },
    ],
    remoteQ: "",
  },
  {
    slug: "pajak-freelancer",
    judul: "Pajak untuk Freelancer dan Pekerja Remote",
    ikon: "Receipt",
    ringkas: "Penghasilan dari klien luar negeri tetap dilaporkan. Ini hal dasar yang perlu kamu tahu di 2026.",
    bagian: [
      {
        judul: "Penghasilan dari luar negeri tetap kena pajak",
        isi: "Sebagai warga yang tinggal di Indonesia, penghasilanmu dikenai pajak di Indonesia, baik dari klien dalam negeri maupun luar negeri. Penghasilan itu dilaporkan di SPT Tahunan.",
        sumber: SUMBER.ukm,
      },
      {
        judul: "Freelancer termasuk pekerjaan bebas",
        isi: "Di formulir SPT, freelancer memilih sumber penghasilan Pekerjaan Bebas. Kalau omzet setahun tidak lebih dari Rp4,8 miliar, kamu bisa memakai Norma Penghitungan Penghasilan Neto (NPPN), sehingga tidak perlu pembukuan lengkap, cukup pencatatan.",
        sumber: SUMBER.djp,
      },
      {
        judul: "Beritahukan pemakaian NPPN tepat waktu",
        isi: "Pemakaian NPPN diberitahukan lewat Coretax DJP paling lambat tiga bulan pertama tahun pajak. Untuk tahun pajak 2026 batasnya 31 Maret 2026. Kalau tidak memberitahu, kamu dianggap memilih menyelenggarakan pembukuan.",
        sumber: SUMBER.djp,
      },
      {
        judul: "Perubahan 2026: PPh final 0,5 persen tidak untuk semua",
        isi: "Sejak 22 April 2026, lewat PP 20/2026, sejumlah pekerjaan bebas tidak bisa memakai tarif PPh final 0,5 persen. Daftarnya mencakup tenaga ahli seperti konsultan, pengajar dan pelatih, pengarang dan penerjemah, serta pembuat konten di media daring. Profesi dalam daftar itu memakai tarif umum (progresif), dan boleh memakai NPPN bila omzetnya di bawah Rp4,8 miliar.",
        sumber: SUMBER.ddtc,
      },
      {
        judul: "Kebiasaan yang membantu",
        poin: [
          "Catat setiap pembayaran yang masuk: tanggal, klien, jumlah, dan mata uang",
          "Simpan invoice dan bukti transfer",
          "Pisahkan rekening untuk pemasukan kerja",
          "Kalau ragu, tanyakan ke kantor pajak atau konsultan pajak",
        ],
      },
    ],
    catatan: "Ringkasan ini untuk pengenalan, bukan nasihat pajak. Aturan bisa berubah, jadi cek ketentuan terbaru di pajak.go.id atau tanyakan ke konsultan pajak.",
    remoteQ: "",
  },
  {
    slug: "kenali-penipuan-kerja-online",
    judul: "Kenali Penipuan Kerja Online",
    ikon: "ShieldAlert",
    ringkas: "Tanda-tanda lowongan palsu yang paling sering menjebak pencari kerja pemula.",
    bagian: [
      {
        judul: "Kenapa ini penting",
        isi: "Penipuan berkedok lowongan kerja makin banyak, mulai dari yang meminta uang sampai yang menjebak korban ke luar negeri. Lebih dari 3.200 WNI tercatat dalam kasus online scam di Asia Tenggara, dan lebih dari 1.100 di antaranya diidentifikasi sebagai korban perdagangan orang.",
        sumber: SUMBER.cnbcScam,
      },
      {
        judul: "Tanda bahaya yang paling umum",
        poin: [
          "Diminta membayar biaya apa pun: pendaftaran, pelatihan, seragam, tiket, atau deposit",
          "Gaji sangat tinggi untuk pekerjaan yang mudah dan tanpa pengalaman",
          "Rekrutmen hanya lewat WhatsApp atau Telegram, tanpa situs atau email resmi",
          "Diminta foto KTP, KK, atau selfie sebelum ada wawancara",
          "Tugas like, rating, atau menonton video yang lama-lama meminta deposit",
          "Tawaran kerja di luar negeri dengan visa turis atau tanpa kontrak jelas",
        ],
      },
      {
        judul: "Cara memeriksa lowongan",
        poin: [
          "Cari nama perusahaan dan nomor perekrut di internet",
          "Cocokkan lowongan dengan situs karier resmi perusahaan",
          "Pastikan email perekrut memakai domain perusahaan, bukan Gmail",
          "Tempel teks lowongan ke Cek Loker Jobly untuk melihat tanda bahayanya",
        ],
        tautan: { label: "Buka Cek Loker", path: "/cek-loker" },
      },
      {
        judul: "Kalau sudah terlanjur",
        isi: "Simpan semua bukti percakapan dan transfer, hubungi bank untuk menahan transaksi, dan laporkan ke kepolisian. Kalau data diri sudah terkirim, waspadai pengajuan pinjaman online atas namamu.",
      },
    ],
    remoteQ: "",
  },
];

/* ------------------------------------------------------------------ */
/*  Terjemahan                                                         */
/* ------------------------------------------------------------------ */

const KODE_LEVEL = { "Ramah pemula": "mudah", "Butuh latihan": "latihan", "Butuh keahlian": "keahlian" };

/** Gabungkan teks Inggris per indeks; bagian yang tidak diterjemahkan tetap memakai aslinya. */
const gabungDaftar = (asli = [], en) => (Array.isArray(en) ? asli.map((x, i) => (en[i] && typeof x === "object" ? { ...x, ...en[i] } : en[i] ?? x)) : asli);

/** Label tarif Upwork di panduan2.js berpola tetap, jadi diterjemahkan otomatis. */
function penghasilanEn(g) {
  const label = g.label
    .replace(/^Kisaran tarif (.+) di Upwork/, "Upwork rate range for $1")
    .replace(", sebagai pembanding", ", for comparison")
    .replace(", sebagai batas bawah", ", as a lower bound");
  const nilai = g.nilai.replace(" sampai ", " to ").replace(" per jam", " per hour");
  const sumber = g.sumber && { ...g.sumber, nama: g.sumber.nama.replace(/^Upwork, tarif (.+)$/, "Upwork, $1 rates") };
  return { ...g, label, nilai, sumber };
}

function profesiEn(p) {
  const e = PROFESI_EN[p.slug] || PROFESI_TAMBAHAN_EN[p.slug] || {};
  return {
    ...p,
    ...e,
    level: LEVEL_EN[p.level] || p.level,
    penghasilan: e.penghasilan
      ? gabungDaftar(p.penghasilan, e.penghasilan).map((g) => ({ ...g, sumber: g.sumber && { ...g.sumber, nama: g.sumber.nama.replace(/^Upwork, tarif (.+)$/, "Upwork, $1 rates") } }))
      : p.penghasilan.map(penghasilanEn),
    langkah: gabungDaftar(p.langkah, e.langkah),
  };
}

function insightEn(p) {
  const e = INSIGHT_EN[p.slug] || {};
  return {
    ...p,
    ...e,
    bagian: p.bagian.map((b, i) => {
      const be = (e.bagian || [])[i] || {};
      return {
        ...b,
        ...be,
        tautan: b.tautan && be.tautanLabel ? { ...b.tautan, label: be.tautanLabel } : b.tautan,
      };
    }),
  };
}

const EN = bahasa() === "en";
const PROFESI_SEMUA = [
  ...PROFESI_ID.map((p) => ({ ...p, kategori: KATEGORI_PROFESI_AWAL[p.slug] })),
  ...PROFESI_TAMBAHAN,
];
export const PROFESI = PROFESI_SEMUA.map((p) => ({ ...(EN ? profesiEn(p) : p), levelKode: KODE_LEVEL[p.level] }));

/** Kategori layanan, masing-masing dengan daftar panduannya. */
export const KATEGORI_PANDUAN = KATEGORI_ID.map((k) => ({
  ...k,
  judul: EN ? KATEGORI_EN[k.id] || k.judul : k.judul,
  profesi: PROFESI.filter((p) => p.kategori === k.id),
}));
export const INSIGHT = EN ? INSIGHT_ID.map(insightEn) : INSIGHT_ID;

export const SEMUA_PANDUAN = [
  ...PROFESI.map((p) => ({ ...p, jenis: "profesi" })),
  ...INSIGHT.map((p) => ({ ...p, jenis: "insight" })),
];

export const cariPanduan = (slug) => SEMUA_PANDUAN.find((p) => p.slug === slug) || null;
