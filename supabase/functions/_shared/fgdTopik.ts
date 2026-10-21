// @ts-nocheck
// Topik simulasi FGD. Daftar ringkas yang sama ada di src/data/fgdTopik.js
// (untuk pilihan di browser) — id, kelompok, dan judul WAJIB sama.

export const KELOMPOK_FGD = ["kerja", "digital", "ekonomi", "lingkungan", "muda", "publik", "kasus", "prioritas"];

export const TOPIK_FGD = [
  {
    id: "wfh",
    kelompok: "kerja",
    jenis: "isu",
    judul: { id: "WFH dijadikan kebijakan permanen", en: "Making remote work permanent" },
    materi: {
      id: "Sebuah perusahaan teknologi dengan 800 karyawan sedang mempertimbangkan menjadikan kerja dari rumah (WFH) sebagai kebijakan permanen untuk semua divisi, termasuk tim penjualan dan operasional. Diskusikan apakah kebijakan ini sebaiknya diterapkan, dan dengan syarat apa.",
      en: "A tech company with 800 staff is considering making work-from-home permanent for every division, including sales and operations. Discuss whether the policy should go ahead, and under what conditions.",
    },
    tujuan: { id: "sikap kelompok (setuju, tidak setuju, atau setuju dengan syarat) beserta alasannya", en: "a group position (for, against, or for with conditions) with reasons" },
  },
  {
    id: "4hari",
    kelompok: "kerja",
    jenis: "isu",
    judul: { id: "Empat hari kerja dalam seminggu", en: "A four-day work week" },
    materi: {
      id: "Pemerintah mewacanakan uji coba empat hari kerja dalam seminggu, dengan jam kerja per hari ditambah supaya total jam kerja tidak berkurang banyak. Diskusikan dampaknya bagi karyawan, perusahaan, dan pelayanan publik, lalu ambil sikap sebagai kelompok.",
      en: "The government is floating a trial of a four-day week, with longer days so total hours don't drop much. Discuss the impact on employees, companies, and public services, then agree a group position.",
    },
    tujuan: { id: "sikap kelompok dan rekomendasi pelaksanaan", en: "a group position and implementation recommendations" },
  },
  {
    id: "loyalitas",
    kelompok: "kerja",
    jenis: "isu",
    judul: { id: "Pindah kerja setiap 1–2 tahun", en: "Changing jobs every 1–2 years" },
    materi: {
      id: "Banyak pekerja muda pindah perusahaan setiap satu sampai dua tahun untuk mengejar kenaikan gaji dan pengalaman baru. Sebagian HR menganggapnya tanda kurang loyal dan enggan merekrut 'kutu loncat', sementara yang lain menganggapnya wajar di pasar kerja sekarang. Diskusikan apakah pola ini menguntungkan atau merugikan, bagi pekerja maupun perusahaan, dan bagaimana perusahaan sebaiknya menyikapinya.",
      en: "Many young workers switch companies every one to two years for higher pay and new experience. Some HR teams see this as disloyal and avoid 'job hoppers'; others think it's normal in today's market. Discuss whether the pattern helps or hurts workers and companies, and how companies should respond.",
    },
    tujuan: { id: "sikap kelompok dan dua langkah yang sebaiknya dilakukan perusahaan untuk mempertahankan karyawan", en: "a group position and two steps companies should take to retain staff" },
  },
  {
    id: "gajiterbuka",
    kelompok: "kerja",
    jenis: "isu",
    judul: { id: "Wajib mencantumkan gaji di lowongan", en: "Mandatory salary ranges in job ads" },
    materi: {
      id: "Muncul usulan agar setiap lowongan kerja wajib mencantumkan rentang gaji. Pendukungnya menyebut pelamar tidak membuang waktu dan kesenjangan gaji bisa berkurang. Penentangnya khawatir perusahaan kehilangan ruang negosiasi dan karyawan lama merasa dirugikan jika gajinya lebih rendah dari rentang yang diiklankan. Diskusikan apakah aturan ini sebaiknya diterapkan.",
      en: "There's a proposal that every job ad must state a salary range. Supporters say applicants won't waste time and pay gaps may shrink. Opponents worry companies lose negotiating room and existing staff feel short-changed if they earn below the advertised range. Discuss whether the rule should be adopted.",
    },
    tujuan: { id: "sikap kelompok dan cara penerapan yang adil bagi karyawan lama", en: "a group position and a fair way to handle existing staff" },
  },
  {
    id: "lembur",
    kelompok: "kerja",
    jenis: "isu",
    judul: { id: "Hak tidak dihubungi di luar jam kerja", en: "The right to disconnect" },
    materi: {
      id: "Di banyak kantor, atasan dan klien masih mengirim pesan kerja lewat WhatsApp pada malam hari dan akhir pekan, dan karyawan merasa wajib langsung membalas. Beberapa negara sudah mengatur hak karyawan untuk tidak dihubungi di luar jam kerja. Diskusikan apakah perusahaan di Indonesia sebaiknya menerapkan aturan serupa, dan bagaimana dengan pekerjaan yang memang butuh respons cepat.",
      en: "In many offices, managers and clients still send work messages on WhatsApp at night and on weekends, and staff feel they must reply at once. Some countries have a legal right to disconnect. Discuss whether companies in Indonesia should adopt a similar rule, and how to handle roles that genuinely need quick responses.",
    },
    tujuan: { id: "sikap kelompok dan aturan main yang konkret (jam, pengecualian, sanksi)", en: "a group position and concrete ground rules (hours, exceptions, enforcement)" },
  },
  {
    id: "phk",
    kelompok: "kerja",
    jenis: "kasus",
    judul: { id: "PHK atau potong gaji saat krisis", en: "Layoffs or pay cuts in a downturn" },
    materi: {
      id: "Pabrik garmen dengan 1.200 karyawan kehilangan dua pembeli besar sehingga pendapatan turun 30% selama setahun ke depan. Manajemen harus menghemat biaya tenaga kerja sekitar Rp2 miliar per bulan. Pilihannya: (A) PHK 15% karyawan dengan pesangon sesuai aturan, (B) memotong gaji semua karyawan 20% selama 6 bulan, termasuk direksi, (C) merumahkan karyawan secara bergilir dengan gaji 50%, atau (D) kombinasi yang kelompok rancang sendiri. Kelompok harus memilih satu pendekatan.",
      en: "A garment factory with 1,200 staff lost two major buyers, so revenue will drop 30% for the next year. Management must save about Rp2 billion a month in labour costs. Options: (A) lay off 15% of staff with statutory severance, (B) cut everyone's pay by 20% for 6 months, directors included, (C) rotate staff on unpaid-leave weeks at 50% pay, or (D) a combination the group designs. The group must choose one approach.",
    },
    tujuan: { id: "satu pendekatan terpilih, alasan, dan cara mengomunikasikannya ke karyawan", en: "one chosen approach, the reasons, and how to communicate it to staff" },
  },
  {
    id: "ai",
    kelompok: "digital",
    jenis: "isu",
    judul: { id: "AI di tempat kerja: ancaman atau peluang", en: "AI at work: threat or opportunity" },
    materi: {
      id: "Banyak perusahaan mulai memakai AI untuk pekerjaan administrasi, layanan pelanggan, dan analisis data. Sebagian orang khawatir lapangan kerja berkurang, sebagian lain melihat peluang baru. Diskusikan bagaimana lulusan baru sebaiknya menyikapinya, dan apa yang harus dilakukan perusahaan.",
      en: "Many companies now use AI for admin, customer service, and data analysis. Some fear fewer jobs; others see new opportunities. Discuss how new graduates should respond, and what companies should do.",
    },
    tujuan: { id: "kesimpulan kelompok dan tiga rekomendasi konkret", en: "a group conclusion and three concrete recommendations" },
  },
  {
    id: "databocor",
    kelompok: "digital",
    jenis: "kasus",
    judul: { id: "Data pelanggan bocor", en: "A customer data breach" },
    materi: {
      id: "Aplikasi dompet digital dengan 2 juta pengguna mendapati data nama, nomor HP, dan email 300 ribu pengguna dijual di forum peretas. Saldo dan PIN tidak ikut bocor. Berita mulai menyebar di media sosial dan regulator meminta laporan dalam 3 x 24 jam. Kelompok berperan sebagai tim manajemen krisis dan harus menyusun langkah 72 jam pertama.",
      en: "A digital wallet app with 2 million users finds that the names, phone numbers, and emails of 300,000 users are being sold on a hacker forum. Balances and PINs weren't leaked. The story is spreading on social media and the regulator wants a report within 72 hours. As the crisis team, the group must plan the first 72 hours.",
    },
    tujuan: { id: "urutan langkah 72 jam pertama dan isi pesan utama untuk pengguna", en: "the sequence of first-72-hour actions and the key message to users" },
  },
  {
    id: "medsos",
    kelompok: "digital",
    jenis: "isu",
    judul: { id: "Aturan media sosial untuk karyawan", en: "Social media rules for employees" },
    materi: {
      id: "Seorang karyawan bank mengunggah video keluhan tentang beban kerjanya di TikTok dan videonya viral. Perusahaan lalu mempertimbangkan aturan yang melarang karyawan membahas pekerjaan di media sosial pribadi, dengan sanksi hingga pemutusan hubungan kerja. Diskusikan sejauh mana perusahaan boleh mengatur akun media sosial pribadi karyawannya.",
      en: "A bank employee posted a TikTok complaining about her workload and it went viral. The company is now considering a rule banning staff from discussing work on personal social media, with penalties up to dismissal. Discuss how far a company may regulate employees' personal accounts.",
    },
    tujuan: { id: "sikap kelompok dan batasan yang wajar dalam aturan tersebut", en: "a group position and reasonable limits for such a rule" },
  },
  {
    id: "paylater",
    kelompok: "digital",
    jenis: "isu",
    judul: { id: "Paylater dan pinjol di kalangan anak muda", en: "Buy-now-pay-later and online loans among young people" },
    materi: {
      id: "Layanan paylater dan pinjaman online membuat belanja dan meminjam uang sangat mudah, cukup dengan KTP dan beberapa klik. Di sisi lain, jumlah anak muda yang terlilit utang dan tercatat kredit macet ikut naik, sehingga sebagian dari mereka kesulitan saat mengajukan KPR atau bahkan melamar kerja di perusahaan tertentu. Diskusikan siapa yang paling bertanggung jawab dan apa yang perlu dilakukan.",
      en: "Buy-now-pay-later and online loans make spending and borrowing very easy: an ID card and a few taps. Meanwhile more young people are falling into debt and getting bad credit records, which can hurt mortgage applications and even some job applications. Discuss who bears the most responsibility and what should be done.",
    },
    tujuan: { id: "kesimpulan kelompok dan tiga rekomendasi untuk pengguna, penyedia layanan, dan regulator", en: "a group conclusion and three recommendations for users, providers, and regulators" },
  },
  {
    id: "hoaks",
    kelompok: "digital",
    jenis: "isu",
    judul: { id: "Hoaks dan deepfake: tanggung jawab siapa?", en: "Hoaxes and deepfakes: whose job is it?" },
    materi: {
      id: "Video dan suara palsu buatan AI (deepfake) semakin sulit dibedakan dari aslinya dan sudah dipakai untuk penipuan, misalnya meniru suara atasan yang meminta transfer dana. Ada yang berpendapat platform media sosial harus bertanggung jawab penuh, ada yang menekankan literasi digital masyarakat, dan ada yang meminta aturan pemerintah yang lebih tegas. Diskusikan pendekatan mana yang paling efektif.",
      en: "AI-generated fake videos and voices (deepfakes) are getting harder to spot and are already used in scams, such as imitating a boss's voice to request a transfer. Some say platforms should be fully responsible, some stress public digital literacy, and others want tougher government rules. Discuss which approach works best.",
    },
    tujuan: { id: "pendekatan utama yang disepakati dan langkah yang bisa dilakukan perusahaan untuk melindungi karyawannya", en: "the main approach agreed and steps companies can take to protect staff" },
  },
  {
    id: "tunai",
    kelompok: "digital",
    jenis: "isu",
    judul: { id: "Toko yang tidak menerima uang tunai", en: "Cashless-only shops" },
    materi: {
      id: "Semakin banyak kafe dan gerai di kota besar yang hanya menerima pembayaran QRIS atau kartu, dengan alasan lebih cepat, aman, dan rapi pembukuannya. Namun sebagian pelanggan, terutama lansia dan warga yang tidak punya rekening bank, merasa tersingkir. Diskusikan apakah toko boleh menolak uang tunai.",
      en: "More cafés and shops in big cities accept only QRIS or cards, saying it's faster, safer, and easier to account for. But some customers, especially older people and the unbanked, feel shut out. Discuss whether shops should be allowed to refuse cash.",
    },
    tujuan: { id: "sikap kelompok dan jalan tengah yang adil", en: "a group position and a fair middle ground" },
  },
  {
    id: "ojol",
    kelompok: "ekonomi",
    jenis: "isu",
    judul: { id: "Status pengemudi ojek online: mitra atau karyawan?", en: "Ride-hailing drivers: partners or employees?" },
    materi: {
      id: "Pengemudi ojek online saat ini berstatus mitra, sehingga tidak mendapat upah minimum, cuti, atau jaminan sosial penuh, tetapi bebas mengatur jam kerjanya. Ada tuntutan agar mereka diakui sebagai karyawan. Aplikator memperingatkan tarif bisa naik dan jumlah mitra yang diterima akan dibatasi. Diskusikan status mana yang paling adil bagi pengemudi, konsumen, dan perusahaan.",
      en: "Ride-hailing drivers are currently classed as partners, so they get no minimum wage, leave, or full social security, but they choose their own hours. Some demand to be recognised as employees. The platforms warn fares would rise and fewer drivers would be taken on. Discuss which status is fairest to drivers, customers, and companies.",
    },
    tujuan: { id: "sikap kelompok dan bentuk perlindungan minimum bagi pengemudi", en: "a group position and the minimum protection drivers should get" },
  },
  {
    id: "umr",
    kelompok: "ekonomi",
    jenis: "isu",
    judul: { id: "Kenaikan upah minimum", en: "Raising the minimum wage" },
    materi: {
      id: "Serikat pekerja meminta upah minimum naik 15% karena biaya hidup terus meningkat. Asosiasi pengusaha, terutama UMKM dan industri padat karya, menyatakan hanya mampu menaikkan sekitar 5% dan memperingatkan risiko PHK serta relokasi pabrik ke daerah dengan upah lebih rendah. Kelompok berperan sebagai dewan pengupahan dan harus menyepakati satu angka.",
      en: "Unions want a 15% minimum-wage rise because living costs keep climbing. Employers, especially small firms and labour-intensive industries, say they can manage about 5% and warn of layoffs and factories moving to lower-wage regions. As the wage council, the group must agree on one figure.",
    },
    tujuan: { id: "satu angka kenaikan dan alasan serta kebijakan pendampingnya", en: "one percentage, the reasons, and any accompanying measures" },
  },
  {
    id: "waralaba",
    kelompok: "ekonomi",
    jenis: "kasus",
    judul: { id: "Ekspansi waralaba ke luar Jawa", en: "Expanding a franchise beyond Java" },
    materi: {
      id: "Waralaba ayam geprek dengan 60 gerai di Jawa ingin membuka 10 gerai pertama di luar Jawa dengan modal Rp4 miliar. Kandidat kota: Medan (pasar besar, pesaing banyak, sewa tinggi), Makassar (pertumbuhan cepat, pesaing sedikit, pemasok ayam belum pasti), Balikpapan (daya beli tinggi, penduduk lebih sedikit, biaya logistik mahal). Kelompok boleh memilih satu atau dua kota dan membagi jumlah gerainya.",
      en: "A smashed-chicken franchise with 60 outlets in Java wants to open its first 10 outside Java with Rp4 billion. Candidate cities: Medan (big market, many rivals, high rent), Makassar (fast growth, few rivals, uncertain chicken supply), Balikpapan (high spending power, smaller population, costly logistics). The group may pick one or two cities and split the outlets.",
    },
    tujuan: { id: "kota terpilih, jumlah gerai per kota, dan risiko utama yang harus diantisipasi", en: "the chosen cities, outlets per city, and the main risks to manage" },
  },
  {
    id: "harga",
    kelompok: "ekonomi",
    jenis: "kasus",
    judul: { id: "Naikkan harga atau kecilkan kemasan?", en: "Raise the price or shrink the pack?" },
    materi: {
      id: "Produsen biskuit lokal menghadapi kenaikan harga gandum dan gula sehingga biaya produksi naik 18%. Pilihannya: (A) menaikkan harga Rp1.000 per bungkus, (B) mempertahankan harga tetapi mengurangi isi dari 120 gram menjadi 100 gram, (C) mengganti sebagian bahan dengan yang lebih murah, atau (D) menahan harga dan menerima laba turun selama 6 bulan. Pesaing utama belum mengambil langkah apa pun.",
      en: "A local biscuit maker faces higher wheat and sugar prices, pushing production costs up 18%. Options: (A) raise the price by Rp1,000 a pack, (B) keep the price but cut the pack from 120 g to 100 g, (C) swap some ingredients for cheaper ones, or (D) hold the price and accept lower profit for 6 months. The main competitor hasn't moved yet.",
    },
    tujuan: { id: "satu pilihan dan cara menyampaikannya kepada konsumen secara jujur", en: "one option and how to explain it honestly to customers" },
  },
  {
    id: "lokal",
    kelompok: "ekonomi",
    jenis: "isu",
    judul: { id: "Produk impor murah di toko online", en: "Cheap imports on online marketplaces" },
    materi: {
      id: "Produk impor yang sangat murah membanjiri toko online, mulai dari pakaian hingga peralatan rumah tangga. Konsumen diuntungkan karena harga terjangkau, tetapi banyak UMKM dan pabrik tekstil lokal mengeluh kalah bersaing hingga terpaksa mengurangi karyawan. Diskusikan apakah pemerintah perlu membatasi produk impor tersebut, dan dengan cara apa.",
      en: "Very cheap imported goods, from clothing to household items, are flooding online marketplaces. Consumers benefit from low prices, but many small businesses and local textile factories say they can't compete and are cutting jobs. Discuss whether the government should restrict these imports, and how.",
    },
    tujuan: { id: "sikap kelompok dan dua kebijakan yang paling masuk akal", en: "a group position and the two most sensible policies" },
  },
  {
    id: "plastik",
    kelompok: "lingkungan",
    jenis: "isu",
    judul: { id: "Larangan kantong plastik sekali pakai", en: "Banning single-use plastic bags" },
    materi: {
      id: "Ada usulan melarang kantong plastik sekali pakai di seluruh minimarket, pasar tradisional, dan toko daring di Indonesia mulai tahun depan. Diskusikan apakah larangan ini tepat, apa dampaknya bagi pedagang kecil dan konsumen, dan bagaimana sebaiknya diterapkan.",
      en: "There's a proposal to ban single-use plastic bags in all minimarkets, traditional markets, and online stores in Indonesia from next year. Discuss whether the ban is right, its impact on small traders and consumers, and how it should be implemented.",
    },
    tujuan: { id: "sikap kelompok dan cara penerapan yang adil", en: "a group position and a fair way to implement it" },
  },
  {
    id: "motorlistrik",
    kelompok: "lingkungan",
    jenis: "isu",
    judul: { id: "Subsidi motor listrik", en: "Subsidies for electric motorbikes" },
    materi: {
      id: "Pemerintah memberi potongan harga beberapa juta rupiah untuk pembelian motor listrik demi mengurangi polusi dan impor BBM. Pengkritik menilai subsidi lebih banyak dinikmati warga mampu, jaringan pengisian daya masih terbatas, dan listrik masih banyak dihasilkan dari batu bara. Diskusikan apakah anggaran subsidi ini sebaiknya diteruskan atau dialihkan ke program lain.",
      en: "The government offers a discount of several million rupiah on electric motorbikes to cut pollution and fuel imports. Critics say the better-off benefit most, charging networks are thin, and much electricity still comes from coal. Discuss whether the subsidy should continue or the money go elsewhere.",
    },
    tujuan: { id: "sikap kelompok dan, jika dialihkan, ke program apa", en: "a group position and, if redirected, where the money should go" },
  },
  {
    id: "erp",
    kelompok: "lingkungan",
    jenis: "isu",
    judul: { id: "Jalan berbayar untuk mengatasi macet", en: "Congestion charging" },
    materi: {
      id: "Pemerintah kota berencana mengganti sistem ganjil-genap dengan jalan berbayar elektronik di jalan-jalan protokol: setiap mobil dan motor yang melintas pada jam sibuk dikenai tarif. Pendapatannya dijanjikan untuk memperbaiki transportasi umum. Pekerja yang tinggal di pinggiran kota khawatir biaya hariannya naik. Diskusikan apakah rencana ini layak dijalankan.",
      en: "The city plans to replace the odd-even plate scheme with electronic road pricing on main roads: every car and motorbike pays at peak hours. Revenue is promised for better public transport. Commuters from the outskirts worry their daily costs will rise. Discuss whether the plan should go ahead.",
    },
    tujuan: { id: "sikap kelompok dan syarat agar kebijakan ini adil", en: "a group position and the conditions for it to be fair" },
  },
  {
    id: "sisamakanan",
    kelompok: "lingkungan",
    jenis: "isu",
    judul: { id: "Sisa makanan di restoran dan hotel", en: "Food waste in restaurants and hotels" },
    materi: {
      id: "Indonesia termasuk penghasil sampah makanan terbesar di dunia, sebagian dari prasmanan hotel, restoran, dan acara pernikahan. Ada usulan mewajibkan hotel dan restoran besar menyumbangkan makanan layak konsumsi yang tidak terjual, serta mengenakan denda untuk sisa makanan berlebihan. Pelaku usaha khawatir soal keamanan pangan dan tanggung jawab hukum jika penerima sakit. Diskusikan usulan ini.",
      en: "Indonesia is among the world's biggest food wasters, partly from hotel buffets, restaurants, and weddings. One proposal would require large hotels and restaurants to donate unsold edible food and fine excessive waste. Businesses worry about food safety and liability if recipients fall ill. Discuss the proposal.",
    },
    tujuan: { id: "sikap kelompok dan mekanisme penerapan yang aman", en: "a group position and a safe way to implement it" },
  },
  {
    id: "banjir",
    kelompok: "lingkungan",
    jenis: "kasus",
    judul: { id: "Anggaran pengendalian banjir", en: "A flood-control budget" },
    materi: {
      id: "Kota berpenduduk 2 juta jiwa kebanjiran setiap musim hujan. Anggaran yang tersedia Rp200 miliar untuk 2 tahun. Usulan program: (1) normalisasi sungai Rp120 miliar, (2) 5.000 sumur resapan Rp40 miliar, (3) pompa air dan rumah pompa Rp60 miliar, (4) relokasi 800 rumah di bantaran sungai Rp90 miliar, (5) sistem peringatan dini dan aplikasi warga Rp15 miliar, (6) taman kota sebagai area resapan Rp50 miliar. Total usulan melebihi anggaran, jadi kelompok harus memilih.",
      en: "A city of 2 million floods every rainy season. It has Rp200 billion for 2 years. Proposals: (1) river dredging and widening Rp120bn, (2) 5,000 infiltration wells Rp40bn, (3) pumps and pump houses Rp60bn, (4) relocating 800 riverbank homes Rp90bn, (5) early-warning system and resident app Rp15bn, (6) city parks as catchment areas Rp50bn. The proposals exceed the budget, so the group must choose.",
    },
    tujuan: { id: "program terpilih dengan total maksimal Rp200 miliar dan alasannya", en: "chosen programmes totalling at most Rp200bn, with reasons" },
  },
  {
    id: "airbersih",
    kelompok: "lingkungan",
    jenis: "kasus",
    judul: { id: "Krisis air bersih saat kemarau", en: "A clean-water crisis in the dry season" },
    materi: {
      id: "Sebuah kabupaten mengalami kemarau panjang. Tiga kecamatan kekurangan air bersih: Kecamatan A (25 ribu warga, ada sumber mata air tetapi jauh), Kecamatan B (12 ribu warga, banyak sekolah dan puskesmas), Kecamatan C (40 ribu warga, sebagian besar petani yang sawahnya mulai kering). Pemerintah daerah hanya punya 10 truk tangki dan dana darurat untuk 30 hari. Kelompok harus membagi bantuan.",
      en: "A district is in a long drought. Three sub-districts lack clean water: A (25,000 people, a spring exists but is far away), B (12,000 people, many schools and clinics), C (40,000 people, mostly farmers whose fields are drying). The local government has only 10 water tankers and emergency funds for 30 days. The group must allocate the help.",
    },
    tujuan: { id: "pembagian truk per kecamatan, dasar pertimbangan, dan solusi jangka panjang", en: "tankers per sub-district, the criteria used, and a long-term fix" },
  },
  {
    id: "kuliah",
    kelompok: "muda",
    jenis: "isu",
    judul: { id: "Kuliah dulu atau langsung kerja?", en: "University first, or straight to work?" },
    materi: {
      id: "Biaya kuliah terus naik, sementara sejumlah perusahaan teknologi dan startup mulai menerima lulusan SMA/SMK yang punya sertifikasi dan portofolio. Sebagian orang menilai gelar sarjana masih menjadi syarat penting untuk karier jangka panjang, terutama di BUMN dan instansi pemerintah. Diskusikan jalur mana yang lebih masuk akal bagi lulusan SMA/SMK saat ini.",
      en: "Tuition keeps rising, while some tech firms and startups now hire high-school or vocational graduates with certifications and a portfolio. Others say a degree is still essential for long-term careers, especially at state-owned firms and government agencies. Discuss which path makes more sense for school leavers today.",
    },
    tujuan: { id: "kesimpulan kelompok dan kriteria untuk memilih jalur", en: "a group conclusion and criteria for choosing a path" },
  },
  {
    id: "magang",
    kelompok: "muda",
    jenis: "isu",
    judul: { id: "Magang tanpa dibayar", en: "Unpaid internships" },
    materi: {
      id: "Banyak perusahaan menawarkan magang tanpa uang saku dengan alasan peserta mendapat pengalaman dan sertifikat. Mahasiswa dari keluarga mampu bisa menerimanya, tetapi mahasiswa yang harus bekerja sambil kuliah sering tidak sanggup, sehingga kesempatannya tidak merata. Ada usulan agar semua magang wajib diberi uang saku minimal. Diskusikan usulan ini.",
      en: "Many companies offer unpaid internships, saying interns gain experience and a certificate. Students from well-off families can accept, but those who must work through university often can't, so opportunities are unequal. One proposal would require a minimum allowance for every internship. Discuss it.",
    },
    tujuan: { id: "sikap kelompok dan aturan magang yang adil", en: "a group position and fair internship rules" },
  },
  {
    id: "mental",
    kelompok: "muda",
    jenis: "isu",
    judul: { id: "Cuti untuk kesehatan mental", en: "Mental-health leave" },
    materi: {
      id: "Sejumlah perusahaan mulai memberikan cuti khusus kesehatan mental beberapa hari per tahun tanpa perlu surat dokter. Pendukungnya menilai ini mencegah kelelahan kerja (burnout) dan menurunkan turnover. Pihak lain khawatir cuti ini disalahgunakan dan membebani rekan kerja yang tetap masuk. Diskusikan apakah perusahaan sebaiknya menyediakan cuti ini.",
      en: "Some companies now offer a few days of mental-health leave a year with no doctor's note. Supporters say it prevents burnout and lowers turnover. Others worry it will be abused and burden colleagues who stay at work. Discuss whether companies should offer it.",
    },
    tujuan: { id: "sikap kelompok dan rancangan kebijakannya (jumlah hari, syarat, pencegahan penyalahgunaan)", en: "a group position and a policy design (days, conditions, abuse prevention)" },
  },
  {
    id: "judol",
    kelompok: "muda",
    jenis: "isu",
    judul: { id: "Judi online di kalangan pekerja muda", en: "Online gambling among young workers" },
    materi: {
      id: "Kasus karyawan muda yang terjerat judi online meningkat: ada yang meminjam ke banyak pinjol, menggelapkan uang kantor, hingga kehilangan pekerjaan. Situs judi terus berganti alamat dan diiklankan lewat media sosial dan permainan. Diskusikan apa yang paling efektif untuk mencegahnya, dan apa peran perusahaan terhadap karyawannya.",
      en: "More young employees are getting caught up in online gambling: borrowing from many lenders, embezzling company money, even losing their jobs. Gambling sites keep changing addresses and advertise via social media and games. Discuss what prevents this most effectively, and what role employers should play.",
    },
    tujuan: { id: "tiga langkah pencegahan yang disepakati, termasuk satu langkah dari sisi perusahaan", en: "three agreed prevention steps, including one from the employer's side" },
  },
  {
    id: "ijazah",
    kelompok: "muda",
    jenis: "isu",
    judul: { id: "Menghapus syarat IPK dan ijazah", en: "Dropping GPA and degree requirements" },
    materi: {
      id: "Beberapa perusahaan besar menghapus syarat IPK minimal dan jurusan tertentu dari lowongannya, lalu menggantinya dengan tes keterampilan dan portofolio. Mereka menilai IPK tidak selalu mencerminkan kemampuan kerja. Pihak lain berpendapat IPK tetap menunjukkan kedisiplinan dan menjadi penyaring yang praktis ketika pelamarnya puluhan ribu. Diskusikan pendekatan mana yang lebih baik.",
      en: "Some large employers have removed minimum GPA and specific-major requirements, using skills tests and portfolios instead, arguing that GPA doesn't always reflect job ability. Others say GPA still shows discipline and is a practical filter when tens of thousands apply. Discuss which approach is better.",
    },
    tujuan: { id: "sikap kelompok dan rancangan proses seleksi yang disarankan", en: "a group position and a recommended selection process" },
  },
  {
    id: "usia",
    kelompok: "muda",
    jenis: "isu",
    judul: { id: "Batas usia di lowongan kerja", en: "Age limits in job ads" },
    materi: {
      id: "Banyak lowongan di Indonesia mencantumkan batas usia, misalnya maksimal 25 tahun untuk fresh graduate atau 30 tahun untuk staf. Akibatnya, pencari kerja berusia di atas 30 tahun dan mereka yang terlambat lulus kesulitan mendapat pekerjaan. Ada usulan melarang batas usia di lowongan kecuali untuk jabatan tertentu. Diskusikan usulan ini dari sisi pencari kerja dan perusahaan.",
      en: "Many Indonesian job ads set age limits, such as a maximum of 25 for fresh graduates or 30 for staff roles. Jobseekers over 30, and those who graduated late, struggle to get hired. One proposal would ban age limits except for specific roles. Discuss it from both the jobseeker's and the employer's side.",
    },
    tujuan: { id: "sikap kelompok dan daftar pengecualian yang masuk akal", en: "a group position and a sensible list of exceptions" },
  },
  {
    id: "penempatan",
    kelompok: "publik",
    jenis: "isu",
    judul: { id: "Siap ditempatkan di seluruh Indonesia", en: "Willing to be posted anywhere in Indonesia" },
    materi: {
      id: "Banyak BUMN mensyaratkan pegawai baru bersedia ditempatkan di seluruh Indonesia, termasuk daerah terpencil, selama beberapa tahun pertama. Perusahaan membutuhkannya untuk melayani seluruh wilayah, tetapi sebagian pegawai muda mengundurkan diri setelah ditempatkan jauh dari keluarga. Diskusikan bagaimana kebijakan penempatan sebaiknya dirancang supaya kebutuhan perusahaan terpenuhi dan pegawai tetap bertahan.",
      en: "Many state-owned firms require new hires to accept postings anywhere in Indonesia, including remote areas, for their first few years. The company needs this to serve every region, but some young staff resign after being posted far from family. Discuss how a placement policy should be designed so the company's needs are met and staff stay.",
    },
    tujuan: { id: "rancangan kebijakan penempatan yang disepakati (durasi, insentif, rotasi)", en: "an agreed placement policy (duration, incentives, rotation)" },
  },
  {
    id: "cabang",
    kelompok: "publik",
    jenis: "isu",
    judul: { id: "Bank BUMN menutup kantor cabang", en: "A state bank closing branches" },
    materi: {
      id: "Sebuah bank BUMN berencana menutup 300 kantor cabang dan unit karena 85% transaksi sudah lewat aplikasi dan agen. Penghematannya diperkirakan Rp1 triliun per tahun. Namun di daerah pedesaan, banyak nasabah lansia, petani, dan pelaku usaha mikro yang masih bergantung pada layanan tatap muka. Diskusikan apakah rencana ini sebaiknya dijalankan, dan bagaimana caranya.",
      en: "A state-owned bank plans to close 300 branches and units because 85% of transactions now go through the app and agents, saving about Rp1 trillion a year. In rural areas, though, many older customers, farmers, and micro-businesses still rely on face-to-face service. Discuss whether the plan should proceed, and how.",
    },
    tujuan: { id: "sikap kelompok dan cara menjaga layanan bagi nasabah yang rentan", en: "a group position and how to protect vulnerable customers" },
  },
  {
    id: "mudik",
    kelompok: "publik",
    jenis: "kasus",
    judul: { id: "Lonjakan penumpang kereta saat mudik", en: "The holiday rush on the railways" },
    materi: {
      id: "Menjelang Lebaran, permintaan tiket kereta jarak jauh mencapai tiga kali kapasitas. Tiket habis dalam beberapa menit dan muncul keluhan soal calo serta aplikasi yang sering gagal. Kelompok berperan sebagai tim operasional perusahaan kereta dan punya waktu 6 minggu. Pilihan yang bisa dikombinasikan: menambah kereta tambahan (armada terbatas), sistem antrean virtual, verifikasi identitas lebih ketat, harga berbeda per jam keberangkatan, atau kerja sama dengan bus dan kapal.",
      en: "Before Eid, demand for long-distance train tickets is three times capacity. Tickets sell out in minutes, and there are complaints about scalpers and an app that keeps failing. As the railway's operations team, the group has 6 weeks. Options that can be combined: extra trains (fleet is limited), a virtual queue, stricter ID checks, different fares by departure time, or partnerships with buses and ferries.",
    },
    tujuan: { id: "rencana tindakan yang disepakati, urutan prioritas, dan ukuran keberhasilannya", en: "an agreed action plan, priorities, and how success will be measured" },
  },
  {
    id: "csr",
    kelompok: "publik",
    jenis: "kasus",
    judul: { id: "Menyalurkan dana CSR Rp5 miliar", en: "Allocating Rp5 billion in CSR funds" },
    materi: {
      id: "BUMN energi punya dana tanggung jawab sosial (CSR) Rp5 miliar untuk desa-desa di sekitar wilayah operasinya. Usulan yang masuk: (1) beasiswa 200 siswa Rp1,5 miliar, (2) pelatihan dan modal UMKM Rp2 miliar, (3) perbaikan 3 puskesmas pembantu Rp1,8 miliar, (4) air bersih untuk 2 desa Rp1,2 miliar, (5) penanaman mangrove Rp0,8 miliar, (6) renovasi masjid dan balai desa Rp1 miliar. Total usulan melebihi dana, dan warga juga meminta lapangan kerja.",
      en: "A state energy company has Rp5 billion in CSR funds for villages near its operations. Proposals: (1) scholarships for 200 pupils Rp1.5bn, (2) training and capital for small businesses Rp2bn, (3) repairing 3 sub-clinics Rp1.8bn, (4) clean water for 2 villages Rp1.2bn, (5) mangrove planting Rp0.8bn, (6) renovating a mosque and village hall Rp1bn. The total exceeds the fund, and residents are also asking for jobs.",
    },
    tujuan: { id: "program terpilih dengan total maksimal Rp5 miliar dan cara mengukur dampaknya", en: "chosen programmes totalling at most Rp5bn and how impact will be measured" },
  },
  {
    id: "padam",
    kelompok: "publik",
    jenis: "kasus",
    judul: { id: "Pemadaman listrik bergilir", en: "Rolling blackouts" },
    materi: {
      id: "Gangguan di dua pembangkit membuat pasokan listrik di sebuah provinsi kurang 15% selama perkiraan 10 hari. Perusahaan listrik harus melakukan pemadaman bergilir. Pertanyaannya: wilayah dan pelanggan mana yang didahulukan tetap menyala (rumah sakit, industri, perumahan, pusat perbelanjaan, sekolah), berapa lama setiap giliran, dan bagaimana menyampaikannya kepada masyarakat yang sudah mulai marah di media sosial.",
      en: "Faults at two power plants leave a province 15% short of electricity for an estimated 10 days. The utility must run rolling blackouts. Questions: which areas and customers keep power first (hospitals, industry, homes, malls, schools), how long each rotation lasts, and how to communicate with a public already angry on social media.",
    },
    tujuan: { id: "urutan prioritas pelanggan, pola giliran, dan rencana komunikasi", en: "customer priority order, the rotation pattern, and a communication plan" },
  },
  {
    id: "antrean",
    kelompok: "publik",
    jenis: "kasus",
    judul: { id: "Antrean panjang di rumah sakit daerah", en: "Long queues at a regional hospital" },
    materi: {
      id: "Pasien rumah sakit umum daerah rata-rata menunggu 4 jam sebelum bertemu dokter. Penyebabnya: pendaftaran manual, jadwal dokter sering molor, dan banyak pasien datang sejak subuh. Anggaran perbaikan Rp3 miliar. Pilihan: aplikasi pendaftaran online, menambah petugas pendaftaran, kontrak dokter tambahan, sistem nomor antrean per jam, atau layanan konsultasi jarak jauh untuk kontrol rutin. Sebagian besar pasien adalah lansia.",
      en: "Patients at a regional public hospital wait 4 hours on average to see a doctor. Causes: manual registration, doctors running late, and many patients arriving at dawn. The budget is Rp3 billion. Options: an online registration app, more registration staff, contracting extra doctors, hourly queue slots, or telehealth for routine check-ups. Most patients are elderly.",
    },
    tujuan: { id: "kombinasi solusi yang dipilih dengan anggaran Rp3 miliar dan target waktu tunggu", en: "a chosen mix of solutions within Rp3bn and a target waiting time" },
  },
  {
    id: "umkm",
    kelompok: "kasus",
    jenis: "kasus",
    judul: { id: "Anggaran pemasaran kedai kopi", en: "A coffee shop's marketing budget" },
    materi: {
      id: "Kedai kopi lokal dengan 3 cabang di Bandung punya anggaran pemasaran Rp50 juta untuk 3 bulan. Penjualan turun 20% sejak muncul dua pesaing baru. Pilihan yang tersedia: (1) iklan Instagram dan TikTok, (2) kerja sama dengan influencer lokal, (3) program member dan poin, (4) diskon besar di aplikasi ojek online, (5) menu baru musiman, (6) acara komunitas di kedai. Kelompok harus memilih maksimal 3 program dan membagi anggarannya.",
      en: "A local coffee chain with 3 branches in Bandung has Rp50 million for 3 months of marketing. Sales fell 20% after two new competitors opened. Options: (1) Instagram and TikTok ads, (2) local influencers, (3) a loyalty and points programme, (4) big discounts on ride-hailing food apps, (5) a seasonal menu, (6) community events in-store. The group must choose at most 3 and split the budget.",
    },
    tujuan: { id: "3 program terpilih, pembagian anggaran, dan alasannya", en: "3 chosen programmes, the budget split, and the reasons" },
  },
  {
    id: "gudang",
    kelompok: "kasus",
    jenis: "kasus",
    judul: { id: "Memilih lokasi gudang baru", en: "Choosing a new warehouse site" },
    materi: {
      id: "Perusahaan e-commerce perlu satu gudang baru untuk mempercepat pengiriman ke Jawa Tengah dan Jawa Timur. Kandidat: Semarang (sewa Rp95 juta per bulan, dekat pelabuhan, tenaga kerja mudah didapat), Solo (sewa Rp70 juta, di tengah, akses tol baik, tenaga kerja terbatas), Surabaya (sewa Rp120 juta, pasar terbesar, macet dan banjir musiman). Kelompok harus memilih satu lokasi.",
      en: "An e-commerce company needs one new warehouse to speed up delivery to Central and East Java. Options: Semarang (Rp95m/month rent, near the port, easy hiring), Solo (Rp70m, central, good toll access, limited labour), Surabaya (Rp120m, biggest market, congestion and seasonal floods). The group must pick one.",
    },
    tujuan: { id: "satu lokasi terpilih dengan alasan dan risikonya", en: "one chosen site with reasons and risks" },
  },
  {
    id: "turnover",
    kelompok: "kasus",
    jenis: "kasus",
    judul: { id: "Banyak karyawan keluar", en: "High staff turnover" },
    materi: {
      id: "Sebuah jaringan ritel dengan 40 toko kehilangan 35% karyawan tokonya dalam setahun. Hasil survei keluar: gaji di bawah pesaing (42%), jadwal shift sering berubah mendadak (31%), atasan kurang menghargai (18%), lainnya (9%). Anggaran perbaikan terbatas. Kelompok harus merumuskan 3 langkah prioritas untuk 6 bulan ke depan.",
      en: "A retail chain with 40 stores lost 35% of its store staff in a year. Exit survey: pay below competitors (42%), shifts changed at short notice (31%), managers don't show appreciation (18%), other (9%). The budget is limited. The group must agree 3 priority actions for the next 6 months.",
    },
    tujuan: { id: "3 langkah prioritas yang disepakati dan urutannya", en: "3 agreed priority actions in order" },
  },
  {
    id: "viral",
    kelompok: "kasus",
    jenis: "kasus",
    judul: { id: "Keluhan pelanggan viral", en: "A customer complaint goes viral" },
    materi: {
      id: "Video pelanggan yang menemukan benda asing di makanan dari restoran cepat saji lokal (120 gerai) ditonton 3 juta kali dalam sehari. Belum jelas apakah benda itu berasal dari dapur restoran. Penjualan di gerai terdekat turun 40% dan media mulai meminta tanggapan. Kelompok berperan sebagai tim manajemen dan harus memutuskan langkah dalam 24 jam pertama.",
      en: "A customer's video of a foreign object in food from a local fast-food chain (120 outlets) gets 3 million views in a day. It's not yet clear whether the object came from the kitchen. Sales at nearby outlets fall 40% and the media want a response. As the management team, the group must decide what to do in the first 24 hours.",
    },
    tujuan: { id: "langkah 24 jam pertama, isi pernyataan resmi, dan siapa yang menyampaikannya", en: "first-24-hour actions, the content of the statement, and who delivers it" },
  },
  {
    id: "vendor",
    kelompok: "kasus",
    jenis: "kasus",
    judul: { id: "Memilih vendor sistem HR", en: "Choosing an HR software vendor" },
    materi: {
      id: "Perusahaan dengan 900 karyawan akan mengganti sistem absensi dan penggajian. Vendor A: Rp450 juta per tahun, fitur lengkap, implementasi 6 bulan, banyak klien besar. Vendor B: Rp280 juta per tahun, fitur cukup, implementasi 2 bulan, perusahaan rintisan berumur 3 tahun. Vendor C: Rp320 juta per tahun, mudah dipakai, tetapi server di luar negeri dan dukungan pelanggan hanya dalam bahasa Inggris. Sistem lama berhenti didukung 4 bulan lagi.",
      en: "A 900-employee company is replacing its attendance and payroll system. Vendor A: Rp450m a year, full features, 6-month rollout, many large clients. Vendor B: Rp280m a year, adequate features, 2-month rollout, a 3-year-old startup. Vendor C: Rp320m a year, easy to use, but servers abroad and English-only support. The old system loses support in 4 months.",
    },
    tujuan: { id: "satu vendor terpilih, alasan, dan cara mengurangi risikonya", en: "one chosen vendor, the reasons, and how to reduce its risks" },
  },
  {
    id: "produkbaru",
    kelompok: "kasus",
    jenis: "kasus",
    judul: { id: "Meluncurkan minuman sehat", en: "Launching a healthy drink" },
    materi: {
      id: "Perusahaan minuman akan meluncurkan teh rendah gula dengan anggaran peluncuran Rp3 miliar. Harga Rp8.000 per botol, sedikit lebih mahal daripada teh manis biasa. Pilihan sasaran: mahasiswa, pekerja kantoran, atau ibu rumah tangga. Pilihan kanal: minimarket, kafe dan kantin kantor, atau toko online. Data survei: 62% responden ingin mengurangi gula, tetapi hanya 28% yang mau membayar lebih mahal.",
      en: "A beverage firm is launching a low-sugar tea with a Rp3 billion launch budget. It's priced at Rp8,000 a bottle, slightly above regular sweet tea. Target options: students, office workers, or homemakers. Channel options: minimarkets, cafés and office canteens, or online stores. Survey: 62% want to cut sugar, but only 28% will pay more.",
    },
    tujuan: { id: "satu segmen sasaran, kanal utama, dan pembagian anggaran", en: "one target segment, the main channel, and the budget split" },
  },
  {
    id: "akuisisi",
    kelompok: "kasus",
    jenis: "kasus",
    judul: { id: "Dua tim digabung setelah akuisisi", en: "Merging two teams after an acquisition" },
    materi: {
      id: "Perusahaan logistik besar mengakuisisi startup pengiriman. Tim startup (60 orang) terbiasa bekerja fleksibel, cepat mengambil keputusan, dan berpakaian bebas. Tim induk (400 orang) terbiasa dengan prosedur berjenjang, jam kerja tetap, dan seragam. Dalam 3 bulan, 12 orang dari tim startup mengundurkan diri, termasuk dua engineer senior. Kelompok harus merumuskan rencana integrasi.",
      en: "A large logistics company acquired a delivery startup. The startup team (60 people) is used to flexible hours, fast decisions, and casual dress. The parent team (400 people) works with layered procedures, fixed hours, and uniforms. In 3 months, 12 startup staff resigned, including two senior engineers. The group must draft an integration plan.",
    },
    tujuan: { id: "tiga langkah integrasi prioritas dan apa yang boleh tetap berbeda", en: "three priority integration steps and what may stay different" },
  },
  {
    id: "proyek",
    kelompok: "kasus",
    jenis: "kasus",
    judul: { id: "Proyek aplikasi terlambat dua bulan", en: "An app project two months late" },
    materi: {
      id: "Proyek aplikasi untuk klien perbankan terlambat dua bulan dari jadwal, padahal klien sudah mengumumkan tanggal peluncuran ke publik. Penyebabnya: perubahan permintaan dari klien, dua developer keluar, dan pengujian yang kurang. Pilihan: (A) menambah 4 developer kontrak, (B) meluncurkan dengan fitur inti saja lalu sisanya menyusul, (C) meminta klien memundurkan peluncuran, atau (D) lembur penuh tim selama 6 minggu.",
      en: "An app project for a banking client is two months late, and the client has already announced the launch date publicly. Causes: changing client requests, two developers leaving, and insufficient testing. Options: (A) add 4 contract developers, (B) launch with core features only and ship the rest later, (C) ask the client to delay, or (D) full-team overtime for 6 weeks.",
    },
    tujuan: { id: "satu keputusan, alasannya, dan cara menyampaikannya kepada klien", en: "one decision, the reasons, and how to tell the client" },
  },
  {
    id: "survival",
    kelompok: "prioritas",
    jenis: "kasus",
    judul: { id: "Terdampar di hutan", en: "Stranded in the forest" },
    materi: {
      id: "Pesawat kecil yang kalian tumpangi mendarat darurat di hutan Kalimantan. Semua selamat, tetapi lokasi jauh dari desa terdekat (sekitar 30 km) dan tim penyelamat mungkin baru datang 2 sampai 3 hari lagi. Barang yang tersisa: korek api, peta wilayah, kompas, cermin kecil, 5 liter air, pisau lipat, terpal plastik, dan senter. Kelompok harus mengurutkan 8 barang ini dari yang paling penting, dan memutuskan menunggu atau berjalan mencari bantuan.",
      en: "Your small plane made an emergency landing in the Kalimantan forest. Everyone is safe, but you're about 30 km from the nearest village and rescue may take 2 to 3 days. Items left: matches, a regional map, a compass, a small mirror, 5 litres of water, a pocket knife, a plastic tarp, and a torch. The group must rank the 8 items by importance and decide whether to wait or walk for help.",
    },
    tujuan: { id: "urutan 8 barang dan keputusan menunggu atau berjalan", en: "a ranking of the 8 items and a decision to wait or walk" },
  },
  {
    id: "laut",
    kelompok: "prioritas",
    jenis: "kasus",
    judul: { id: "Terombang-ambing di laut", en: "Adrift at sea" },
    materi: {
      id: "Kapal yang kalian tumpangi terbakar dan tenggelam di perairan Maluku. Kalian berlima selamat di sekoci karet. Pulau terdekat diperkirakan 150 km jauhnya, dan kalian tidak tahu pasti posisinya. Barang yang sempat diselamatkan: cermin, 20 liter air tawar, kelambu, ransum makanan untuk 2 hari, peta laut, bantal pelampung, jeriken 10 liter berisi campuran minyak dan bensin, radio transistor kecil, terpal plastik, dan sebatang cokelat. Kelompok harus mengurutkan 10 barang dari yang paling penting untuk bertahan hidup.",
      en: "Your boat caught fire and sank in Maluku waters. The five of you are safe in a rubber dinghy. The nearest island is about 150 km away, and you don't know your exact position. Items saved: a mirror, 20 litres of fresh water, a mosquito net, 2 days of food rations, a sea chart, a flotation cushion, a 10-litre can of oil-petrol mix, a small transistor radio, a plastic tarp, and a chocolate bar. The group must rank the 10 items for survival.",
    },
    tujuan: { id: "urutan 10 barang beserta alasan untuk tiga barang teratas", en: "a ranking of the 10 items with reasons for the top three" },
  },
  {
    id: "bencana",
    kelompok: "prioritas",
    jenis: "kasus",
    judul: { id: "Satu truk bantuan untuk tiga desa", en: "One aid truck for three villages" },
    materi: {
      id: "Gempa mengguncang sebuah kabupaten. Hanya ada satu truk bantuan yang bisa berangkat hari ini dan hanya sempat ke dua lokasi sebelum malam. Desa A: 300 warga, 12 orang luka berat, akses jalan rusak tetapi bisa dilalui. Desa B: 1.200 warga, banyak rumah roboh, sudah ada relawan lokal, kekurangan air dan tenda. Desa C: 150 warga, belum ada kabar sama sekali karena sinyal putus. Kelompok harus memilih dua lokasi dan isi muatan truk (obat, tenda, air, makanan, genset).",
      en: "An earthquake hits a district. Only one aid truck can leave today and it can reach two places before nightfall. Village A: 300 people, 12 seriously injured, damaged but passable road. Village B: 1,200 people, many houses collapsed, local volunteers present, short of water and tents. Village C: 150 people, no news at all because the signal is down. The group must pick two locations and what to load (medicine, tents, water, food, a generator).",
    },
    tujuan: { id: "dua lokasi terpilih, urutannya, dan isi muatan truk", en: "the two chosen locations, the order, and the truck's load" },
  },
  {
    id: "promosi",
    kelompok: "prioritas",
    jenis: "kasus",
    judul: { id: "Memilih satu kandidat promosi", en: "Choosing one candidate for promotion" },
    materi: {
      id: "Posisi supervisor penjualan kosong dan ada empat kandidat. Rina: penjualan tertinggi 2 tahun berturut-turut, tetapi sering bekerja sendiri dan kurang sabar membimbing. Bagus: penjualan rata-rata, disukai tim, sering membantu rekan baru. Dewi: masa kerja paling lama (7 tahun), pernah menjadi supervisor sementara dan hasilnya cukup baik. Hendra: baru 1,5 tahun bekerja, lulusan S2, inovatif, tetapi pernah berkonflik dengan bagian gudang. Kelompok berperan sebagai panel promosi dan harus memilih satu orang.",
      en: "A sales-supervisor role is open and there are four candidates. Rina: top seller two years running, but works alone and is impatient coaching others. Bagus: average sales, well liked, often helps new colleagues. Dewi: longest-serving (7 years), was acting supervisor once with decent results. Hendra: 1.5 years in, master's degree, innovative, but has clashed with the warehouse team. As the promotion panel, the group must choose one.",
    },
    tujuan: { id: "satu kandidat terpilih, kriteria yang dipakai, dan rencana pengembangan untuk kandidat lain", en: "one chosen candidate, the criteria used, and a development plan for the others" },
  },
  {
    id: "anggarankantor",
    kelompok: "prioritas",
    jenis: "kasus",
    judul: { id: "Anggaran perbaikan kantor Rp300 juta", en: "A Rp300 million office budget" },
    materi: {
      id: "Kantor cabang dengan 80 karyawan mendapat anggaran perbaikan Rp300 juta. Usulan dari karyawan: AC baru di ruang kerja Rp90 juta, ruang laktasi Rp35 juta, kursi ergonomis untuk semua Rp120 juta, renovasi toilet Rp70 juta, ruang rapat dengan peralatan video conference Rp85 juta, area parkir motor beratap Rp60 juta, dan pantry dengan kopi gratis Rp40 juta. Total usulan Rp500 juta. Kelompok harus memilih.",
      en: "A branch office of 80 staff has Rp300 million for improvements. Staff proposals: new air-conditioning Rp90m, a lactation room Rp35m, ergonomic chairs for all Rp120m, toilet renovation Rp70m, a meeting room with video-conferencing Rp85m, covered motorbike parking Rp60m, and a pantry with free coffee Rp40m. The total is Rp500m. The group must choose.",
    },
    tujuan: { id: "usulan terpilih dengan total maksimal Rp300 juta dan dasar pertimbangannya", en: "chosen proposals totalling at most Rp300m and the criteria used" },
  },
];

export const cariTopik = (id) => TOPIK_FGD.find((x) => x.id === id) || null;

/** Topik acak; bila kelompok diisi, acak di dalam kelompok itu saja. */
export function topikAcak(kelompok = "") {
  const daftar = kelompok ? TOPIK_FGD.filter((x) => x.kelompok === kelompok) : TOPIK_FGD;
  const sumber = daftar.length ? daftar : TOPIK_FGD;
  return sumber[Math.floor(Math.random() * sumber.length)];
}

/** Peserta AI. Suara = voice Gemini TTS. */
export const PERAN_FGD = {
  moderator: {
    nama: "Bu Sari",
    suara: "Aoede",
    gaya: { id: "asesor HR yang tenang dan netral", en: "a calm, neutral HR assessor" },
  },
  dimas: {
    nama: "Dimas",
    suara: "Puck",
    gaya: {
      id: "percaya diri dan cepat mengusulkan solusi, kadang terlalu dominan dan memotong pembicaraan; tetap sopan",
      en: "confident and quick to propose solutions, sometimes dominant and interrupting; still polite",
    },
  },
  ayu: {
    nama: "Ayu",
    suara: "Leda",
    gaya: {
      id: "analitis, suka angka dan data, sering bertanya 'datanya apa?', tenang",
      en: "analytical, likes numbers and data, often asks for evidence, calm",
    },
  },
  fajar: {
    nama: "Fajar",
    suara: "Charon",
    gaya: {
      id: "ramah dan mudah setuju, agak pendiam, kadang ragu-ragu; bicara lebih banyak bila diajak",
      en: "friendly and agreeable, a bit quiet and hesitant; speaks up more when invited",
    },
  },
};

export function pembukaModerator(topik, bahasa) {
  const en = bahasa === "en";
  return [
    {
      siapa: "moderator",
      teks: en
        ? `Good morning, everyone. I'm Sari, and I'll be observing today's group discussion. You have twenty minutes. Please reach a group conclusion together; everyone should contribute, and I won't step in except to remind you of the time.`
        : `Selamat pagi semuanya. Saya Sari, saya akan mengamati diskusi kelompok hari ini. Waktunya dua puluh menit. Silakan capai kesimpulan bersama sebagai kelompok, semua peserta diharapkan berkontribusi, dan saya tidak akan ikut campur kecuali untuk mengingatkan waktu.`,
    },
    {
      siapa: "moderator",
      teks: en
        ? `Here is your topic: ${topik.materi.en} By the end, the group should agree on ${topik.tujuan.en}. You may begin.`
        : `Topiknya: ${topik.materi.id} Di akhir diskusi, kelompok diharapkan menyepakati ${topik.tujuan.id}. Silakan dimulai.`,
    },
  ];
}
