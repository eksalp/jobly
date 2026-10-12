/**
 * Pertanyaan interview tingkat sulit.
 *
 * Selain `strategi`, tiap pertanyaan punya:
 *   - `jebakan`: apa yang sebenarnya diuji pewawancara
 *   - `contoh`:  contoh jawaban singkat — kerangka, bukan untuk dihafal
 *
 * Dipakai di Latihan Interview, termasuk Mode Tantangan berwaktu.
 */
export const KATEGORI_SULIT = [
  {
    id: 12,
    slug: "level-neraka",
    nama: "Level Neraka: Pertanyaan Paling Sulit",
    namaPendek: "Level Neraka",
    ikon: "Zap",
    level: "neraka",
    pertanyaan: [
      {
        nomor: 111,
        pertanyaan: "Kalau kami bisa merekrut kandidat internal dengan gaji lebih rendah, kenapa harus Anda?",
        jebakan:
          "Menguji apakah Anda bisa menyebut nilai yang tidak dimiliki orang dalam — tanpa merendahkan karyawan mereka.",
        strategi:
          "Jangan bersaing di harga. Tunjukkan satu-dua hal yang hanya bisa dibawa orang luar: pengalaman dari industri atau perusahaan lain, cara kerja yang sudah terbukti, atau jaringan. Hubungkan dengan masalah konkret yang sedang mereka hadapi, lalu tegaskan Anda ingin memperkuat tim internal, bukan menggantikannya.",
        contoh:
          "Kandidat internal pasti lebih paham budaya di sini, dan itu nilai yang besar. Yang saya bawa adalah tiga tahun menangani migrasi sistem ERP di dua perusahaan — persis proyek yang Bapak sebut akan dimulai kuartal depan. Saya sudah tahu jebakannya, jadi tim tidak perlu belajar dari kesalahan yang sama.",
      },
      {
        nomor: 112,
        pertanyaan: "Sebutkan satu keputusan atasan Anda yang menurut Anda salah. Apa yang Anda lakukan?",
        jebakan:
          "Ada dua lubang: menjelekkan atasan, atau mengaku selalu setuju (tidak punya pendirian). Yang dinilai adalah cara Anda tidak setuju.",
        strategi:
          "Pilih keputusan bisnis, bukan soal kepribadian. Ceritakan bagaimana Anda menyampaikan keberatan secara pribadi dengan data, lalu tetap menjalankan keputusan final dengan sungguh-sungguh. Tutup dengan hasilnya dan apa yang Anda pelajari — termasuk kalau ternyata atasan yang benar.",
        contoh:
          "Atasan saya memutuskan memangkas anggaran iklan digital untuk pameran. Saya kirim data konversi tiga bulan terakhir dan minta waktu 15 menit untuk membahasnya. Keputusan tetap jalan, jadi saya bantu siapkan pameran sebaik mungkin sambil mengukur hasilnya. Hasilnya di bawah target, dan kuartal berikutnya data itu dipakai untuk membagi anggaran 60–40.",
      },
      {
        nomor: 113,
        pertanyaan: "CV Anda bagus, tapi saya masih ragu. Yakinkan saya dalam 60 detik.",
        jebakan:
          "Tekanan sengaja untuk melihat apakah Anda panik, defensif, atau justru bertanya balik dengan tenang.",
        strategi:
          "Jangan langsung berpidato. Tanyakan dulu apa yang membuatnya ragu, lalu jawab keraguan itu dengan satu bukti konkret. Kalau ia menolak menjelaskan, sampaikan tiga poin: hasil terbesar Anda, kecocokannya dengan kebutuhan posisi, dan alasan Anda ingin bekerja di sini.",
        contoh:
          "Boleh saya tahu keraguannya di bagian mana — pengalaman, atau kecocokan dengan tim? … Kalau soal pengalaman memimpin yang baru dua tahun: dalam dua tahun itu tim saya tumbuh dari 3 ke 8 orang dan tidak ada yang keluar. Saya bisa ceritakan caranya.",
      },
      {
        nomor: 114,
        pertanyaan: "Kalau saya telepon atasan terakhir Anda sekarang, apa yang akan ia sebut sebagai kelemahan terbesar Anda?",
        jebakan:
          "Pertanyaan kelemahan versi 'tidak bisa bohong' — jawaban klise seperti 'perfeksionis' langsung kehilangan nilai karena bisa dicek.",
        strategi:
          "Sebut kelemahan nyata yang pernah benar-benar disampaikan atasan Anda, yang tidak fatal untuk posisi ini. Lanjutkan dengan langkah spesifik yang sudah Anda lakukan dan bukti perbaikannya.",
        contoh:
          "Beliau mungkin akan bilang saya terlalu lama memegang pekerjaan sendiri sebelum minta bantuan. Itu pernah membuat satu laporan terlambat. Sejak itu saya pakai aturan sederhana: kalau sudah buntu 30 menit, saya bertanya. Di evaluasi terakhir, poin itu sudah tidak muncul lagi.",
      },
      {
        nomor: 115,
        pertanyaan: "Kenapa Anda tidak dipromosikan selama bertahun-tahun di tempat lama?",
        jebakan: "Mengorek apakah Anda bermasalah, kurang ambisi, atau suka menyalahkan perusahaan.",
        strategi:
          "Jangan menyalahkan atasan atau 'politik kantor'. Jelaskan konteks faktual (struktur organisasi datar, tidak ada posisi kosong, promosi dibekukan), lalu tunjukkan bahwa tanggung jawab Anda tetap bertambah meski jabatannya sama. Akhiri dengan alasan posisi ini adalah langkah naik yang Anda cari.",
        contoh:
          "Divisi kami hanya punya satu posisi supervisor, dan pemegangnya belum pindah sejak 2019. Meski jabatan saya tetap, sejak 2022 saya memegang orientasi semua staf baru dan dua klien terbesar. Saya melamar ke sini karena ingin peran itu diakui secara resmi.",
      },
      {
        nomor: 116,
        pertanyaan: "Anda terlalu berpengalaman untuk posisi ini. Bukankah Anda akan cepat bosan dan pergi?",
        jebakan:
          "Kekhawatiran nyata soal retensi dan gaji. Pewawancara ingin alasan yang masuk akal, bukan sekadar 'saya tidak akan bosan'.",
        strategi:
          "Akui kekhawatirannya, lalu beri alasan yang tulus kenapa posisi ini tepat sekarang (ganti industri, keseimbangan hidup, ingin kembali ke pekerjaan teknis). Tunjukkan bahwa pengalaman lebih justru mempercepat hasil.",
        contoh:
          "Wajar kalau itu jadi pertanyaan. Saya sengaja mencari peran yang lebih fokus ke pekerjaan teknis setelah lima tahun mengurus administrasi tim. Artinya saya bisa produktif di bulan pertama, dan saya ingin menetap di peran yang saya nikmati — bukan sekadar batu loncatan.",
      },
      {
        nomor: 117,
        pertanyaan: "Kalau Anda tidak lolos di sini, apa kira-kira alasannya?",
        jebakan:
          "Menguji kesadaran diri. Jawaban 'tidak ada' terdengar sombong; jawaban terlalu jujur bisa jadi alasan menolak Anda.",
        strategi:
          "Sebut satu celah yang memang terlihat dari CV Anda dibanding kebutuhan posisi, lalu jelaskan bagaimana Anda menutupnya. Ini kesempatan menjawab keraguan sebelum mereka membahasnya di rapat penilaian.",
        contoh:
          "Mungkin karena pengalaman saya di B2C, sedangkan klien di sini mayoritas B2B. Karena itu dua bulan terakhir saya ikut kursus account management B2B dan berbincang dengan tiga teman yang bekerja di bidang ini — saya bisa ceritakan yang saya pelajari.",
      },
      {
        nomor: 118,
        pertanyaan: "Apa satu hal tentang perusahaan kami yang menurut Anda kurang baik?",
        jebakan:
          "Menguji riset dan keberanian memberi masukan — tanpa terdengar menghina calon tempat kerja sendiri.",
        strategi:
          "Pilih hal yang bisa diperbaiki dan relevan dengan peran Anda (pengalaman aplikasi, waktu respons layanan, konten media sosial). Sampaikan sebagai pengamatan pengguna, bukan kritik, lalu tawarkan ide perbaikan yang bisa Anda kerjakan.",
        contoh:
          "Sebagai pengguna, proses pengembalian dana di aplikasi butuh lima langkah dan saya sempat bingung di langkah ketiga. Kalau saya di tim produk, itu salah satu hal pertama yang ingin saya uji — mungkin bisa dipangkas jadi dua langkah.",
      },
      {
        nomor: 119,
        pertanyaan: "Ceritakan saat Anda melanggar aturan demi menyelesaikan pekerjaan.",
        jebakan:
          "Pertanyaan integritas. 'Tidak pernah' terdengar kaku atau tidak jujur; cerita yang melanggar etika langsung mengakhiri peluang Anda.",
        strategi:
          "Pilih contoh prosedur internal yang kaku, bukan hukum atau etika — dan Anda tetap meminta izin atau melapor. Tunjukkan Anda menimbang risiko, mengambil tanggung jawab, lalu mengusulkan perbaikan prosedurnya.",
        contoh:
          "Pengiriman ke klien terancam terlambat karena persetujuan manajer harus bertanda tangan basah, sementara beliau di luar kota. Saya minta persetujuan lewat email, mendokumentasikannya, lalu mengirim barang tepat waktu. Setelahnya saya usulkan persetujuan digital, dan sekarang itu jadi prosedur resmi.",
      },
      {
        nomor: 120,
        pertanyaan: "Berapa gaji paling rendah yang masih mau Anda terima?",
        jebakan: "Jebakan negosiasi: angka yang Anda sebut hampir pasti menjadi tawaran mereka.",
        strategi:
          "Jangan menyebut batas bawah. Kembalikan ke kisaran wajar berdasarkan riset (misalnya dari Peta Gaji), tekankan bahwa Anda melihat keseluruhan paket, lalu tanyakan anggaran mereka.",
        contoh:
          "Dari riset saya, posisi serupa di Jakarta berada di kisaran 9 sampai 12 juta. Saya terbuka mendiskusikan angka di kisaran itu dengan melihat paket keseluruhan — boleh saya tahu anggaran untuk posisi ini?",
      },
      {
        nomor: 121,
        pertanyaan: "Ceritakan kegagalan yang murni kesalahan Anda — bukan tim, bukan keadaan.",
        jebakan:
          "Kebanyakan kandidat menyelipkan 'tapi sebenarnya karena…'. Yang dinilai adalah kemampuan mengambil tanggung jawab penuh.",
        strategi:
          "Pilih kegagalan nyata dengan dampak sedang. Katakan dengan jelas 'itu kesalahan saya', jelaskan keputusan mana yang keliru, apa yang Anda lakukan untuk memperbaikinya saat itu, dan kebiasaan apa yang berubah sesudahnya.",
        contoh:
          "Saya pernah mengirim penawaran harga dengan diskon yang salah hitung ke klien besar karena tidak mengecek ulang rumusnya. Itu kesalahan saya. Saya langsung menelepon klien, menjelaskan, dan menutup selisihnya dengan tambahan layanan. Sejak itu setiap penawaran di atas 50 juta saya minta dicek satu orang lagi.",
      },
      {
        nomor: 122,
        pertanyaan: "Apa yang akan Anda lakukan dalam 90 hari pertama?",
        jebakan:
          "Membedakan kandidat yang paham perannya dari yang menjawab umum ('beradaptasi dan belajar').",
        strategi:
          "Bagi menjadi tiga fase: 30 hari belajar (orang, sistem, angka), 60 hari mulai berkontribusi di satu hal kecil yang terlihat, 90 hari menjalankan satu inisiatif terukur. Sebut contoh spesifik dari riset Anda tentang perusahaan.",
        contoh:
          "Bulan pertama saya ingin bertemu semua pemangku kepentingan dan mempelajari data penjualan dua tahun terakhir. Bulan kedua saya ambil alih laporan mingguan. Bulan ketiga saya ingin mengusulkan perbaikan proses tagihan yang menurut riset saya jadi keluhan utama pelanggan.",
      },
      {
        nomor: 123,
        pertanyaan: "Dua direktur memberi tugas yang sama-sama 'urgent' dan bertabrakan. Mana yang Anda kerjakan duluan?",
        jebakan:
          "Tidak ada jawaban benar soal siapa yang dipilih. Yang dinilai adalah cara Anda memprioritaskan dan berkomunikasi.",
        strategi:
          "Pahami tenggat dan dampak masing-masing tugas, kerjakan bagian yang bisa diselesaikan cepat, lalu libatkan atasan langsung untuk menentukan prioritas — jangan memutuskan diam-diam dan membuat satu pihak kecewa.",
        contoh:
          "Saya tanyakan tenggat pasti dan apa akibatnya kalau terlambat. Kalau tetap bertabrakan, saya bawa ke atasan langsung dengan dua opsi jadwal, supaya prioritas diputuskan orang yang berwenang dan kedua direktur tahu kapan tugasnya selesai.",
      },
      {
        nomor: 124,
        pertanyaan: "Hmm. Terus terang, saya kurang yakin dengan jawaban Anda barusan.",
        jebakan:
          "Tekanan sengaja (stress interview) untuk melihat apakah Anda goyah, defensif, atau mengubah jawaban hanya karena ditekan.",
        strategi:
          "Tetap tenang dan jangan langsung mencabut jawaban. Tanyakan bagian mana yang kurang meyakinkan, lalu perjelas dengan contoh atau angka. Kalau jawaban Anda memang keliru, akui dengan elegan dan perbaiki — itu justru nilai plus.",
        contoh:
          "Baik, boleh saya tahu bagian mana yang kurang meyakinkan? Mungkin saya kurang konkret. Contohnya begini: di proyek tadi, waktu proses turun dari lima hari ke dua hari — itu yang saya maksud dengan efisiensi.",
      },
      {
        nomor: 125,
        pertanyaan: "Beri saya satu alasan kuat untuk TIDAK menerima Anda.",
        jebakan:
          "Versi ekstrem pertanyaan kelemahan. Menolak menjawab terlihat mengelak; menjawab terlalu jujur bisa merugikan.",
        strategi:
          "Sebut satu hal yang mungkin tidak cocok bagi mereka tetapi bukan kekurangan kemampuan — misalnya Anda butuh tantangan, atau Anda lugas dalam memberi masukan. Lalu jelaskan kenapa hal itu justru bermanfaat di posisi ini.",
        contoh:
          "Kalau Bapak mencari orang yang menjalankan proses persis seperti yang sudah ada tanpa bertanya, mungkin saya bukan orangnya. Saya cenderung bertanya 'kenapa' dan mengusulkan perbaikan. Dari cerita tadi, tim ini justru sedang butuh orang yang mau membenahi proses.",
      },
    ],
  },
  {
    id: 13,
    slug: "kasus-hitung-cepat",
    nama: "Studi Kasus, Hitung Cepat & Analisis",
    namaPendek: "Kasus & Hitung Cepat",
    ikon: "Calculator",
    level: "sulit",
    pertanyaan: [
      {
        nomor: 126,
        pertanyaan: "Kira-kira berapa banyak pengemudi ojek online yang beroperasi di Jakarta pada jam sibuk pagi?",
        jebakan:
          "Tidak ada yang tahu angka pastinya. Yang dinilai adalah cara Anda menyusun asumsi dan menghitung dengan tenang.",
        strategi:
          "Pecah menjadi asumsi yang bisa dihitung: penduduk → orang yang bepergian pagi → yang memakai ojek online → perjalanan per pengemudi per jam. Ucapkan asumsinya, bulatkan angkanya, dan cek apakah hasilnya masuk akal.",
        contoh:
          "Anggap 11 juta penduduk, 40% bepergian pagi, jadi 4,4 juta. Kalau 10% memakai ojek online, ada 440 ribu perjalanan dalam dua jam. Satu pengemudi bisa tiga perjalanan dalam dua jam, jadi sekitar 150 ribu pengemudi aktif. Saya akan cocokkan dengan jumlah mitra yang pernah diumumkan.",
      },
      {
        nomor: 127,
        pertanyaan: "Penjualan produk kami turun 20% bulan lalu. Apa yang Anda periksa pertama kali?",
        jebakan: "Kandidat cenderung langsung menebak penyebab. Yang dicari adalah urutan diagnosis yang terstruktur.",
        strategi:
          "Pastikan datanya benar, lalu pecah: turun di semua wilayah, kanal, dan produk, atau hanya satu? Jumlah pembeli atau nilai per transaksi? Faktor internal (harga, stok, perubahan aplikasi) atau eksternal (musim, kompetitor)? Baru setelah itu susun dugaan penyebabnya.",
        contoh:
          "Pertama saya cek apakah ada perubahan cara pencatatan. Lalu saya pecah per kanal: kalau penurunannya hanya di marketplace, saya lihat apakah ada perubahan algoritma atau promo kompetitor di sana sebelum menyimpulkan apa pun.",
      },
      {
        nomor: 128,
        pertanyaan: "Anda diberi Rp 100 juta untuk menambah pelanggan baru. Ke mana uangnya?",
        jebakan:
          "Menguji apakah Anda berpikir dari data dan uji coba kecil, bukan langsung menghabiskan anggaran di satu kanal.",
        strategi:
          "Tanyakan dulu siapa sasarannya dan berapa nilai satu pelanggan. Usulkan pembagian: sebagian kecil untuk menguji beberapa kanal, ukur biaya per pelanggan, lalu alihkan sisa anggaran ke kanal yang terbukti.",
        contoh:
          "Saya pakai 30 juta untuk menguji tiga kanal selama dua minggu — iklan media sosial, kerja sama komunitas, dan program referral. Kanal dengan biaya per pelanggan terendah mendapat 70 juta sisanya, dengan evaluasi mingguan.",
      },
      {
        nomor: 129,
        pertanyaan: "Proyek Anda sudah menghabiskan 80% anggaran tapi baru selesai 50%. Apa langkah Anda?",
        jebakan: "Menilai kejujuran menyampaikan kabar buruk dan kemampuan mengambil keputusan, bukan sekadar 'lembur'.",
        strategi:
          "Segera laporkan ke pemangku kepentingan dengan angka yang jelas. Analisis penyebab pembengkakan, susun opsi (kurangi ruang lingkup, tambah anggaran, ubah jadwal) beserta konsekuensinya, lalu minta keputusan.",
        contoh:
          "Saya laporkan hari itu juga dengan rincian biaya, lalu siapkan tiga opsi: tunda dua fitur ke fase berikutnya, tambah anggaran 40%, atau perpanjang waktu dengan tim lebih kecil — masing-masing dengan risikonya.",
      },
      {
        nomor: 130,
        pertanyaan: "Hitung cepat tanpa kalkulator: berapa 15% dari 2,4 miliar? Jelaskan caranya.",
        jebakan: "Bukan soal matematika sulit, tapi ketenangan dan kemampuan menjelaskan langkah sambil diperhatikan.",
        strategi:
          "Pecah menjadi bagian yang mudah: 10% ditambah 5%. Ucapkan langkahnya, lalu cek ulang dengan cara lain. Berpikir dengan suara keras justru dinilai positif.",
        contoh:
          "10% dari 2,4 miliar adalah 240 juta, 5% setengahnya yaitu 120 juta, jadi totalnya 360 juta. Cek: 15% sedikit di bawah seperenam, dan 2,4 miliar dibagi 6 adalah 400 juta — jadi 360 juta masuk akal.",
      },
      {
        nomor: 131,
        pertanyaan: "Bagaimana Anda tahu sebuah fitur baru di aplikasi berhasil atau tidak?",
        jebakan: "Jawaban 'kalau banyak yang pakai' terlalu dangkal. Yang dicari adalah metrik yang terhubung dengan tujuan bisnis.",
        strategi:
          "Mulai dari tujuan fiturnya, lalu tentukan satu metrik utama dan beberapa metrik pengaman (yang tidak boleh memburuk). Sebut cara mengukurnya — misalnya uji A/B dengan kelompok pembanding — dan lama evaluasinya.",
        contoh:
          "Kalau tujuan fitur 'simpan keranjang' adalah menaikkan penjualan, metrik utamanya tingkat checkout dari keranjang tersimpan, dengan pengaman waktu muat aplikasi dan jumlah keluhan. Saya bandingkan dengan kelompok yang belum mendapat fitur selama dua minggu.",
      },
      {
        nomor: 132,
        pertanyaan: "Kami ingin membuka cabang di kota baru. Data apa yang Anda butuhkan sebelum memutuskan?",
        jebakan: "Menguji apakah Anda berpikir menyeluruh: pasar, biaya, operasional, dan risiko — bukan hanya jumlah penduduk.",
        strategi:
          "Kelompokkan: permintaan (calon pelanggan, daya beli, tren), persaingan (siapa saja, harga mereka), biaya (sewa, tenaga kerja, logistik), dan risiko (regulasi, musim). Tutup dengan kriteria keputusan, misalnya target balik modal.",
        contoh:
          "Saya butuh jumlah calon pelanggan sesuai profil kita, harga dan lokasi kompetitor, biaya sewa dan UMK setempat, serta ongkos kirim dari gudang terdekat. Keputusannya: lanjut kalau proyeksi balik modal di bawah 18 bulan.",
      },
      {
        nomor: 133,
        pertanyaan: "Tingkat pelanggan berhenti berlangganan naik dari 3% ke 5% per bulan. Seberapa serius ini?",
        jebakan: "Kenaikan dua poin terdengar kecil. Yang dinilai adalah kemampuan menerjemahkan angka ke dampak bisnis.",
        strategi:
          "Hitung dampaknya dalam setahun: dengan 5% per bulan, sekitar 46% pelanggan hilang, dibanding sekitar 31% di angka 3%. Jelaskan bahwa itu kenaikan lebih dari 60% secara relatif, lalu usulkan cara mencari penyebabnya per segmen.",
        contoh:
          "Serius. Dalam setahun kita kehilangan hampir separuh pelanggan, bukan sepertiga. Saya akan lihat segmen mana yang paling banyak berhenti dan kapan — misalnya setelah kenaikan harga atau gangguan layanan.",
      },
      {
        nomor: 134,
        pertanyaan: "Anda menemukan angka yang salah di laporan atasan, dan laporan itu sudah dikirim ke direksi. Apa yang Anda lakukan?",
        jebakan: "Pertanyaan integritas sekaligus kecerdasan politik: diam itu salah, mempermalukan atasan juga salah.",
        strategi:
          "Sampaikan langsung dan secara pribadi ke atasan secepatnya, dengan bukti dan angka yang benar. Tawarkan bantuan menyiapkan ralat. Jangan melangkahi atasan ke direksi kecuali atasan menolak memperbaiki kesalahan yang berdampak besar.",
        contoh:
          "Saya temui beliau hari itu juga, tunjukkan selisihnya beserta sumber datanya, lalu tawarkan menyiapkan versi revisi dan catatan singkat untuk direksi. Lebih baik diralat oleh kita sendiri daripada ditemukan orang lain.",
      },
    ],
  },
  {
    id: 14,
    slug: "interview-bahasa-inggris",
    nama: "Interview Bahasa Inggris yang Menjebak",
    namaPendek: "Bahasa Inggris",
    ikon: "Languages",
    level: "sulit",
    pertanyaan: [
      {
        nomor: 135,
        pertanyaan: "Walk me through your resume.",
        jebakan:
          "Kandidat sering membacakan CV dari awal secara kronologis. Pewawancara ingin cerita singkat yang mengarah ke posisi ini.",
        strategi:
          "Pakai kerangka present–past–future dalam 90 detik: peran sekarang dan satu pencapaian, pengalaman sebelumnya yang relevan, lalu kenapa posisi ini langkah berikutnya. Gunakan kalimat pendek dan kata kerja aktif.",
        contoh:
          "I'm currently a finance analyst at a logistics company, where I cut our month-end closing from eight to five days. Before that, I spent two years in audit, which taught me to read numbers critically. Now I'm looking to move into FP&A, and this role is where those two sides meet.",
      },
      {
        nomor: 136,
        pertanyaan: "Why should we hire you over someone with more experience?",
        jebakan: "Menguji kepercayaan diri tanpa terdengar meremehkan kandidat lain.",
        strategi:
          "Jangan membandingkan dengan orang lain. Fokus pada kecepatan belajar yang terbukti, kecocokan dengan kebutuhan spesifik mereka, dan hasil konkret yang sudah Anda capai dalam waktu singkat.",
        contoh:
          "I can't compete on years, but I can show how fast I deliver. In my first six months I automated a weekly report that used to take two days. You mentioned the team needs dashboards built quickly — that's what I've been doing every week.",
      },
      {
        nomor: 137,
        pertanyaan: "Tell me about a time you disagreed with your manager.",
        jebakan:
          "Pertanyaan perilaku klasik di perusahaan multinasional. Mereka mencari pola STAR dan sikap profesional saat berbeda pendapat.",
        strategi:
          "Gunakan STAR (Situation, Task, Action, Result). Tekankan bahwa Anda menyampaikan ketidaksetujuan dengan data, secara pribadi, dan tetap berkomitmen pada keputusan akhir.",
        contoh:
          "My manager wanted to launch a campaign before the customer data was cleaned. I shared a quick sample showing a 15% error rate and suggested a two-day delay. We agreed on one day, and the campaign hit its target with far fewer complaints.",
      },
      {
        nomor: 138,
        pertanyaan: "What would your previous team say is the most annoying thing about you?",
        jebakan: "Versi santai pertanyaan kelemahan yang sering membuat kandidat lengah dan terlalu jujur.",
        strategi:
          "Pilih kebiasaan kecil yang tidak merusak kinerja, sampaikan dengan sedikit humor, lalu tunjukkan Anda sudah menyesuaikannya.",
        contoh:
          "Probably that I ask 'what's the deadline?' about everything. Some found it a bit much at first, but it saved us from a few last-minute surprises. Now I ask once at kickoff instead of in every meeting.",
      },
      {
        nomor: 139,
        pertanyaan: "Where do you honestly see yourself in five years?",
        jebakan:
          "Kata 'honestly' memancing jawaban terlalu ambisius ('your job') atau tidak berkomitmen ('maybe my own business').",
        strategi:
          "Sebut arah keahlian dan tanggung jawab, bukan jabatan spesifik, lalu kaitkan dengan jalur yang realistis di perusahaan ini.",
        contoh:
          "I'd like to be the person the team relies on for pricing decisions — deeper in analytics and probably leading a small team. From what you've shared, that path exists here, which is a big reason I applied.",
      },
      {
        nomor: 140,
        pertanyaan: "What's a piece of feedback you received recently that you disagreed with?",
        jebakan: "Menguji apakah Anda bisa menerima masukan sekaligus tetap punya pendirian.",
        strategi:
          "Ceritakan masukan yang awalnya Anda tidak setujui, bagaimana Anda mencari tahu maksudnya, lalu bagian mana yang akhirnya Anda terima dan terapkan.",
        contoh:
          "I was told my presentations were too detailed. At first I disagreed — the details mattered. But after asking two colleagues, I realised the main message got lost. Now I put the key number on slide one and move the details to the appendix.",
      },
      {
        nomor: 141,
        pertanyaan: "How do you work with a team spread across different time zones?",
        jebakan:
          "Pertanyaan khas perusahaan remote. Mereka mencari kebiasaan komunikasi tertulis yang konkret, bukan sekadar 'saya fleksibel'.",
        strategi:
          "Sebut praktik nyata: tulisan yang lengkap, jam tumpang-tindih yang disepakati, dokumentasi keputusan, dan cara Anda menghindari pekerjaan terhenti menunggu balasan.",
        contoh:
          "I write updates so nobody needs to ask a follow-up question. I keep two overlap hours with the US team, and I record decisions in a shared doc, so work doesn't stop while others are asleep.",
      },
      {
        nomor: 142,
        pertanyaan: "What are your salary expectations in US dollars?",
        jebakan: "Banyak kandidat Indonesia menyebut angka terlalu rendah karena mengonversi dari gaji lokal.",
        strategi:
          "Riset kisaran untuk peran yang sama di pasar remote, hitung nilai bersih setelah biaya platform dan transfer (pakai Kalkulator Gaji), lalu sebut kisaran — bukan satu angka — dan tanyakan anggaran mereka.",
        contoh:
          "Based on similar remote roles, I'm looking at 2,500 to 3,200 dollars a month, depending on the overall package. Could you share the budget for this position?",
      },
      {
        nomor: 143,
        pertanyaan: "Describe a project that failed. What part of the failure was yours?",
        jebakan: "Kalimat kedua menutup jalan untuk menyalahkan tim. Mereka ingin melihat kepemilikan (ownership).",
        strategi:
          "Akui bagian Anda dengan jelas dalam satu kalimat, jelaskan apa yang Anda lakukan untuk memperbaikinya, dan sebut kebiasaan yang berubah sesudahnya.",
        contoh:
          "We launched a feature that users barely used. My part: I skipped user interviews to save time. Since then I run at least five short interviews before writing any spec — our next feature reached 40% adoption in a month.",
      },
      {
        nomor: 144,
        pertanyaan: "Do you have any questions for us?",
        jebakan:
          "'No, everything is clear' terdengar tidak tertarik. Pertanyaan soal gaji atau cuti di tahap awal juga kurang tepat.",
        strategi:
          "Siapkan dua-tiga pertanyaan tentang ekspektasi peran, tantangan tim, dan cara mengukur keberhasilan. Pertanyaan yang baik menunjukkan Anda sudah membayangkan bekerja di sana.",
        contoh:
          "What would success look like for this role after the first six months? And what's the biggest challenge the team is facing right now?",
      },
    ],
  },
];
