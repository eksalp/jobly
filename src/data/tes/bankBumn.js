/**
 * Bank soal gaya Rekrutmen Bersama BUMN (RBB): klasifikasi kata, diagram
 * (hubungan himpunan), Tes Wawasan Kebangsaan, dan Learning Agility.
 *
 * Semua soal ditulis sendiri oleh Jobly mengikuti FORMAT tes yang umum
 * dipakai, bukan disalin dari buku atau bimbel mana pun.
 * Format: jawaban benar di o[0] (diacak saat ditampilkan).
 */

/* ------------------------------------------------ Klasifikasi kata */

const KK = (ganjil, kelompok, alasan) => ({
  b: "Klasifikasi kata",
  q: "Manakah kata yang TIDAK termasuk kelompoknya?",
  o: [ganjil, ...kelompok],
  e: alasan,
});

export const BANK_KATA = [
  KK("Biola", ["Gitar", "Harpa", "Kecapi", "Ukulele"], "Gitar, harpa, kecapi, dan ukulele dimainkan dengan dipetik. Biola dimainkan dengan digesek."),
  KK("Bulan", ["Merkurius", "Venus", "Mars", "Jupiter"], "Merkurius, Venus, Mars, dan Jupiter adalah planet. Bulan adalah satelit alami Bumi."),
  KK("Yen", ["Rupiah", "Ringgit", "Baht", "Dong"], "Rupiah, ringgit, baht, dan dong adalah mata uang negara Asia Tenggara. Yen adalah mata uang Jepang (Asia Timur)."),
  KK("Susu", ["Kopi", "Teh", "Kakao", "Rosela"], "Kopi, teh, kakao, dan rosela adalah minuman dari tumbuhan. Susu berasal dari hewan."),
  KK("Liter", ["Kilogram", "Ons", "Gram", "Kuintal"], "Kilogram, ons, gram, dan kuintal adalah satuan berat (massa). Liter adalah satuan volume."),
  KK("Januari", ["Senin", "Rabu", "Jumat", "Minggu"], "Senin, Rabu, Jumat, dan Minggu adalah nama hari. Januari adalah nama bulan."),
  KK("Beringin", ["Mawar", "Melati", "Anggrek", "Kenanga"], "Mawar, melati, anggrek, dan kenanga dikenal sebagai bunga. Beringin adalah pohon."),
  KK("Bukit", ["Sungai", "Danau", "Rawa", "Laut"], "Sungai, danau, rawa, dan laut adalah bentang perairan. Bukit adalah bentang daratan."),
  KK("Penghapus", ["Pena", "Pensil", "Spidol", "Kapur"], "Pena, pensil, spidol, dan kapur dipakai untuk menulis. Penghapus dipakai untuk menghapus tulisan."),
  KK("Arsitek", ["Dokter", "Perawat", "Bidan", "Apoteker"], "Dokter, perawat, bidan, dan apoteker adalah tenaga kesehatan. Arsitek bekerja di bidang perancangan bangunan."),
  KK("Membaca", ["Mendaki", "Berlari", "Berenang", "Bersepeda"], "Mendaki, berlari, berenang, dan bersepeda adalah olahraga atau aktivitas fisik. Membaca bukan aktivitas fisik."),
  KK("Hiu", ["Paus", "Lumba-lumba", "Dugong", "Anjing laut"], "Paus, lumba-lumba, dugong, dan anjing laut adalah mamalia laut. Hiu adalah ikan."),
  KK("Kubus", ["Segitiga", "Persegi", "Trapesium", "Jajargenjang"], "Segitiga, persegi, trapesium, dan jajargenjang adalah bangun datar. Kubus adalah bangun ruang."),
  KK("Hakim", ["Presiden", "Gubernur", "Bupati", "Wali kota"], "Presiden, gubernur, bupati, dan wali kota adalah pejabat eksekutif (pemerintahan). Hakim termasuk kekuasaan yudikatif."),
  KK("Tembaga", ["Emas", "Perak", "Platina", "Paladium"], "Emas, perak, platina, dan paladium tergolong logam mulia. Tembaga bukan logam mulia."),
  KK("Sushi", ["Rendang", "Gudeg", "Pempek", "Soto"], "Rendang, gudeg, pempek, dan soto adalah masakan khas Indonesia. Sushi berasal dari Jepang."),
  KK("Diagnosis", ["Debit", "Kredit", "Saldo", "Mutasi"], "Debit, kredit, saldo, dan mutasi adalah istilah rekening atau perbankan. Diagnosis adalah istilah medis."),
  KK("Menghitung", ["Menulis", "Membaca", "Menyimak", "Berbicara"], "Menulis, membaca, menyimak, dan berbicara adalah empat keterampilan berbahasa. Menghitung adalah keterampilan matematika."),
  KK("Murung", ["Riang", "Ceria", "Girang", "Gembira"], "Riang, ceria, girang, dan gembira menyatakan perasaan senang. Murung menyatakan perasaan sedih."),
  KK("Faktur", ["Neraca", "Laporan laba rugi", "Laporan arus kas", "Laporan perubahan ekuitas"], "Neraca, laba rugi, arus kas, dan perubahan ekuitas adalah komponen laporan keuangan. Faktur adalah dokumen transaksi."),
  KK("Bogor", ["Medan", "Surabaya", "Makassar", "Semarang"], "Medan, Surabaya, Makassar, dan Semarang adalah ibu kota provinsi. Bogor bukan ibu kota provinsi."),
  KK("Dividen", ["Inflasi", "Deflasi", "Resesi", "Stagflasi"], "Inflasi, deflasi, resesi, dan stagflasi adalah kondisi ekonomi makro. Dividen adalah pembagian laba kepada pemegang saham."),
  KK("Printer", ["Keyboard", "Mouse", "Pemindai", "Mikrofon"], "Keyboard, mouse, pemindai, dan mikrofon adalah perangkat masukan (input). Printer adalah perangkat keluaran (output)."),
  KK("Nilon", ["Kapas", "Wol", "Sutra", "Linen"], "Kapas, wol, sutra, dan linen adalah serat alami. Nilon adalah serat sintetis."),
  KK("Tepung", ["Kecap", "Saus", "Sambal", "Mayones"], "Kecap, saus, sambal, dan mayones adalah pelengkap atau penyedap makanan siap pakai. Tepung adalah bahan baku."),
  KK("Merpati", ["Elang", "Rajawali", "Alap-alap", "Burung hantu"], "Elang, rajawali, alap-alap, dan burung hantu adalah burung pemangsa (karnivora). Merpati bukan burung pemangsa."),
  KK("Merosot", ["Meningkat", "Naik", "Bertambah", "Melonjak"], "Meningkat, naik, bertambah, dan melonjak bermakna bertambah. Merosot bermakna berkurang."),
  KK("Darah", ["Paru-paru", "Jantung", "Ginjal", "Hati"], "Paru-paru, jantung, ginjal, dan hati adalah organ tubuh. Darah adalah cairan tubuh, bukan organ."),
  KK("Akuntan", ["Hakim", "Jaksa", "Advokat", "Notaris"], "Hakim, jaksa, advokat, dan notaris adalah profesi di bidang hukum. Akuntan berada di bidang keuangan."),
  KK("Bayam", ["Wortel", "Lobak", "Ubi jalar", "Bit"], "Wortel, lobak, ubi jalar, dan bit dimakan bagian akar atau umbinya. Bayam dimakan daunnya."),
  KK("Novel", ["Kamus", "Ensiklopedia", "Atlas", "Glosarium"], "Kamus, ensiklopedia, atlas, dan glosarium adalah buku rujukan (referensi). Novel adalah karya sastra fiksi."),
  KK("Pekan", ["Tahun", "Windu", "Dasawarsa", "Abad"], "Tahun, windu (8 tahun), dasawarsa (10 tahun), dan abad (100 tahun) adalah satuan waktu tahunan atau kelipatannya. Pekan lebih pendek dari satu tahun."),
  KK("Photoshop", ["Word", "Excel", "PowerPoint", "Outlook"], "Word, Excel, PowerPoint, dan Outlook adalah aplikasi Microsoft Office. Photoshop adalah aplikasi Adobe."),
  KK("Kebaya", ["Batik", "Songket", "Ulos", "Tenun ikat"], "Batik, songket, ulos, dan tenun ikat adalah kain tradisional. Kebaya adalah pakaian (busana) jadi."),
  KK("Kebakaran gedung", ["Gempa bumi", "Tsunami", "Erupsi gunung", "Banjir bandang"], "Gempa, tsunami, erupsi, dan banjir bandang adalah bencana alam. Kebakaran gedung umumnya tergolong bencana non-alam atau akibat manusia."),
  KK("Sepeda", ["Kereta api", "Bus kota", "Kapal feri", "Pesawat terbang"], "Kereta api, bus kota, kapal feri, dan pesawat terbang adalah moda transportasi umum. Sepeda adalah kendaraan pribadi."),
  KK("Membulatkan", ["Menjumlahkan", "Mengurangkan", "Mengalikan", "Membagi"], "Menjumlahkan, mengurangkan, mengalikan, dan membagi adalah empat operasi hitung dasar. Membulatkan bukan operasi hitung dasar."),
  KK("Komik", ["Puisi", "Pantun", "Gurindam", "Syair"], "Puisi, pantun, gurindam, dan syair adalah karya sastra berbentuk puisi atau sajak. Komik adalah cerita bergambar."),
  KK("Kopi", ["Padi", "Jagung", "Gandum", "Sorgum"], "Padi, jagung, gandum, dan sorgum adalah serealia (biji-bijian pangan pokok). Kopi bukan serealia."),
  KK("Kerapu", ["Gurami", "Lele", "Nila", "Mujair"], "Gurami, lele, nila, dan mujair adalah ikan air tawar. Kerapu adalah ikan laut."),
];

/* ------------------------------------------------ Diagram (himpunan) */

/**
 * Tipe diagram:
 *  terpisah  → tiga lingkaran terpisah
 *  bersarang → tiga lingkaran di dalam satu sama lain
 *  dua_dalam → satu lingkaran besar berisi dua lingkaran terpisah
 *  dua_iris  → satu lingkaran besar berisi dua lingkaran yang beririsan
 *  iris_satu → dua lingkaran beririsan, satu lingkaran terpisah
 *  iris_tiga → tiga lingkaran saling beririsan
 *  dalam_satu → satu lingkaran di dalam lingkaran lain, satu lingkaran terpisah
 */
export const TIPE_DIAGRAM = ["terpisah", "bersarang", "dua_dalam", "dua_iris", "iris_satu", "iris_tiga", "dalam_satu"];

const KET_DIAGRAM = {
  terpisah: "ketiganya tidak beririsan sama sekali",
  bersarang: "yang satu termasuk bagian dari yang lain secara berjenjang",
  dua_dalam: "dua himpunan sama-sama bagian dari himpunan ketiga, tetapi keduanya tidak beririsan",
  dua_iris: "dua himpunan sama-sama bagian dari himpunan ketiga, dan keduanya bisa beririsan",
  iris_satu: "dua himpunan beririsan, sedangkan himpunan ketiga terpisah",
  iris_tiga: "ketiganya bisa saling beririsan",
  dalam_satu: "satu himpunan bagian dari himpunan lain, sedangkan himpunan ketiga terpisah",
};

const DG = (kata, tipe, alasan) => ({ kata, tipe, alasan });

export const BANK_DIAGRAM = [
  DG(["Makhluk hidup", "Hewan", "Kucing"], "bersarang", "Semua kucing adalah hewan, dan semua hewan adalah makhluk hidup."),
  DG(["Indonesia", "Jawa Barat", "Bandung"], "bersarang", "Bandung berada di Jawa Barat, dan Jawa Barat berada di Indonesia."),
  DG(["Karyawan", "Karyawan BUMN", "Karyawan Pertamina"], "bersarang", "Karyawan Pertamina adalah karyawan BUMN, dan karyawan BUMN adalah karyawan."),
  DG(["Bilangan", "Bilangan bulat", "Bilangan genap"], "bersarang", "Bilangan genap adalah bilangan bulat, dan bilangan bulat adalah bilangan."),
  DG(["Mamalia", "Kucing", "Kucing anggora"], "bersarang", "Kucing anggora adalah kucing, dan kucing adalah mamalia."),
  DG(["Buah", "Apel", "Jeruk"], "dua_dalam", "Apel dan jeruk sama-sama buah, tetapi tidak ada apel yang sekaligus jeruk."),
  DG(["Hewan", "Ikan", "Burung"], "dua_dalam", "Ikan dan burung sama-sama hewan, tetapi tidak ada ikan yang sekaligus burung."),
  DG(["Provinsi", "Jawa Tengah", "Bali"], "dua_dalam", "Jawa Tengah dan Bali sama-sama provinsi dan wilayahnya tidak tumpang tindih."),
  DG(["Logam", "Besi", "Emas"], "dua_dalam", "Besi dan emas sama-sama logam, tetapi unsur yang berbeda."),
  DG(["Planet", "Mars", "Venus"], "dua_dalam", "Mars dan Venus sama-sama planet, dan keduanya planet yang berbeda."),
  DG(["Manusia", "Guru", "Penulis"], "dua_iris", "Guru dan penulis sama-sama manusia, dan seorang guru bisa juga seorang penulis."),
  DG(["Penduduk Indonesia", "Petani", "Pemilik sepeda motor"], "dua_iris", "Keduanya bagian dari penduduk (dalam konteks soal), dan ada petani yang memiliki sepeda motor."),
  DG(["Bilangan bulat", "Bilangan genap", "Kelipatan 3"], "dua_iris", "Bilangan genap dan kelipatan 3 sama-sama bilangan bulat, dan beririsan (contoh: 6)."),
  DG(["Guru", "Perempuan", "Kursi"], "iris_satu", "Ada guru yang perempuan, sedangkan kursi adalah benda yang tidak berhubungan dengan keduanya."),
  DG(["Sarjana", "Pengusaha", "Sungai"], "iris_satu", "Ada pengusaha yang bergelar sarjana, sedangkan sungai terpisah dari keduanya."),
  DG(["Penyanyi", "Pria", "Meja"], "iris_satu", "Ada penyanyi pria, sedangkan meja adalah benda."),
  DG(["Bilangan prima", "Bilangan ganjil", "Huruf vokal"], "iris_satu", "Bilangan prima dan bilangan ganjil beririsan (contoh: 3, 5), sedangkan huruf vokal bukan bilangan."),
  DG(["Dokter", "Ibu", "Atlet"], "iris_tiga", "Seseorang bisa sekaligus dokter, ibu, dan atlet; setiap pasangan juga bisa beririsan."),
  DG(["Penulis", "Pengusaha", "Wanita"], "iris_tiga", "Ada wanita yang penulis, pengusaha yang penulis, dan wanita pengusaha penulis."),
  DG(["Bilangan genap", "Kelipatan 3", "Kelipatan 5"], "iris_tiga", "Ketiganya beririsan, misalnya 30 adalah bilangan genap sekaligus kelipatan 3 dan 5."),
  DG(["Meja", "Kucing", "Sungai"], "terpisah", "Meja, kucing, dan sungai tidak memiliki anggota yang sama."),
  DG(["Matahari", "Sepatu", "Gajah"], "terpisah", "Ketiganya tidak berhubungan sebagai himpunan."),
  DG(["Bilangan ganjil", "Bilangan genap", "Huruf konsonan"], "terpisah", "Tidak ada bilangan yang ganjil sekaligus genap, dan huruf bukan bilangan."),
  DG(["Kendaraan", "Mobil", "Pohon"], "dalam_satu", "Mobil adalah kendaraan, sedangkan pohon bukan kendaraan."),
  DG(["Hewan", "Burung", "Batu"], "dalam_satu", "Burung adalah hewan, sedangkan batu bukan hewan."),
  DG(["Logam", "Emas", "Kertas"], "dalam_satu", "Emas adalah logam, sedangkan kertas bukan logam."),
  DG(["Ibu kota provinsi", "Medan", "Danau Toba"], "dalam_satu", "Medan adalah ibu kota provinsi, sedangkan Danau Toba adalah danau."),
];

/** Ubah item diagram menjadi soal pilihan (4 diagram). */
export function soalDiagram(acak, n) {
  return acak
    .kocok(BANK_DIAGRAM)
    .slice(0, n)
    .map((d) => {
      const pengecoh = acak.kocok(TIPE_DIAGRAM.filter((t) => t !== d.tipe)).slice(0, 3);
      const o = acak.kocok([d.tipe, ...pengecoh]);
      return {
        q: `Diagram mana yang paling tepat menggambarkan hubungan: ${d.kata.join(", ")}?`,
        diagram: true,
        o,
        a: o.indexOf(d.tipe),
        e: `${d.alasan} Jadi diagram yang tepat: ${KET_DIAGRAM[d.tipe]}.`,
        bagian: "Diagram",
      };
    });
}

/* --------------------------------------------- Wawasan Kebangsaan */

const TW = (b, q, o, e) => ({ b, q, o, e });

export const BANK_TWK = [
  TW("Pilar negara", "Rumusan dasar negara Pancasila yang sah dan berlaku saat ini tercantum dalam …", ["Pembukaan UUD 1945 alinea keempat", "Piagam Jakarta", "Pidato Bung Karno 1 Juni 1945", "Pembukaan UUD 1945 alinea pertama"], "Rumusan Pancasila yang resmi terdapat dalam Pembukaan UUD 1945 alinea keempat, yang disahkan PPKI pada 18 Agustus 1945."),
  TW("Pilar negara", "Hari Lahir Pancasila diperingati setiap tanggal …", ["1 Juni", "22 Juni", "18 Agustus", "1 Oktober"], "1 Juni merujuk pada pidato Soekarno di sidang BPUPKI 1 Juni 1945. 1 Oktober adalah Hari Kesaktian Pancasila, 22 Juni tanggal Piagam Jakarta."),
  TW("Pilar negara", "Empat Pilar MPR terdiri atas Pancasila, UUD NRI 1945, NKRI, dan …", ["Bhinneka Tunggal Ika", "Sumpah Pemuda", "Garuda Pancasila", "Wawasan Nusantara"], "Empat pilar kehidupan berbangsa yang disosialisasikan MPR: Pancasila, UUD NRI 1945, NKRI, dan Bhinneka Tunggal Ika."),
  TW("Pilar negara", "Semboyan Bhinneka Tunggal Ika diambil dari kitab …", ["Sutasoma karya Mpu Tantular", "Negarakertagama karya Mpu Prapanca", "Arjunawiwaha karya Mpu Kanwa", "Pararaton"], "Bhinneka Tunggal Ika berasal dari kitab Sutasoma karya Mpu Tantular pada masa Majapahit."),
  TW("Pilar negara", "Lambang negara Garuda Pancasila diatur dalam UUD 1945 pasal …", ["36A", "35", "36", "36B"], "Pasal 35 mengatur bendera, Pasal 36 bahasa, Pasal 36A lambang negara, dan Pasal 36B lagu kebangsaan."),
  TW("Pilar negara", "Jumlah bulu pada leher burung Garuda Pancasila melambangkan …", ["Tahun 1945 (45 helai)", "Bulan Agustus (8 helai)", "Tanggal 17 (17 helai)", "Tanggal 19 (19 helai)"], "Bulu pada Garuda melambangkan tanggal Proklamasi: 17 helai di setiap sayap, 8 di ekor, 19 di pangkal ekor, dan 45 di leher."),
  TW("Pilar negara", "UUD 1945 telah diamendemen sebanyak …", ["Empat kali (1999–2002)", "Tiga kali (1999–2001)", "Dua kali (1999–2000)", "Lima kali (1999–2003)"], "Amendemen UUD 1945 dilakukan empat kali oleh MPR pada 1999, 2000, 2001, dan 2002."),
  TW("Pilar negara", "Menurut UUD NRI 1945 Pasal 1 ayat (3), Negara Indonesia adalah …", ["Negara hukum", "Negara kesatuan berbentuk republik", "Negara kekuasaan", "Negara federal"], "Pasal 1 ayat (3): Negara Indonesia adalah negara hukum. Ayat (1) mengatur bentuk negara kesatuan berbentuk republik."),
  TW("Pilar negara", "Pasal 1 ayat (2) UUD NRI 1945 menyatakan bahwa kedaulatan berada di tangan …", ["Rakyat dan dilaksanakan menurut UUD", "MPR sepenuhnya", "Presiden sebagai kepala negara", "DPR sebagai wakil rakyat"], "Setelah amendemen, kedaulatan berada di tangan rakyat dan dilaksanakan menurut Undang-Undang Dasar, tidak lagi sepenuhnya oleh MPR."),
  TW("Pilar negara", "Keanggotaan MPR menurut UUD NRI 1945 terdiri atas …", ["Anggota DPR dan anggota DPD", "Anggota DPR dan utusan golongan", "Anggota DPR, DPD, dan DPRD", "Anggota DPD dan utusan daerah"], "Pasal 2 ayat (1): MPR terdiri atas anggota DPR dan anggota DPD yang dipilih melalui pemilihan umum."),
  TW("Pilar negara", "Masa jabatan presiden dan wakil presiden menurut Pasal 7 UUD NRI 1945 adalah …", ["Lima tahun dan dapat dipilih kembali satu kali dalam jabatan yang sama", "Lima tahun tanpa batas periode", "Enam tahun untuk satu periode", "Empat tahun dan dapat dipilih kembali dua kali"], "Pasal 7 hasil amendemen membatasi jabatan presiden lima tahun dan hanya dapat dipilih kembali untuk satu kali masa jabatan."),
  TW("Bela negara", "Hak dan kewajiban warga negara untuk ikut serta dalam upaya pembelaan negara tercantum dalam UUD NRI 1945 pasal …", ["27 ayat (3)", "28 ayat (1)", "29 ayat (2)", "31 ayat (1)"], "Pasal 27 ayat (3): setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara. Pasal 30 ayat (1) mengatur usaha pertahanan dan keamanan."),
  TW("Pilar negara", "Pasal UUD NRI 1945 yang menjadi dasar sistem perekonomian nasional adalah …", ["Pasal 33", "Pasal 29", "Pasal 31", "Pasal 27"], "Pasal 33 mengatur perekonomian disusun sebagai usaha bersama berdasar atas asas kekeluargaan, serta penguasaan cabang produksi penting oleh negara."),
  TW("Nasionalisme", "Teks Proklamasi dibacakan pada 17 Agustus 1945 di …", ["Jalan Pegangsaan Timur 56, Jakarta", "Gedung Kesenian Jakarta", "Rengasdengklok", "Rumah Laksamana Maeda"], "Proklamasi dibacakan di kediaman Soekarno, Jalan Pegangsaan Timur 56. Naskahnya dirumuskan di rumah Laksamana Maeda."),
  TW("Nasionalisme", "Badan yang mengesahkan UUD 1945 pada 18 Agustus 1945 adalah …", ["PPKI", "BPUPKI", "KNIP", "MPRS"], "PPKI (Panitia Persiapan Kemerdekaan Indonesia) dalam sidang 18 Agustus 1945 mengesahkan UUD dan memilih presiden serta wakil presiden."),
  TW("Nasionalisme", "Peristiwa Sumpah Pemuda terjadi pada tanggal …", ["28 Oktober 1928", "20 Mei 1908", "10 November 1945", "28 Oktober 1945"], "Sumpah Pemuda diikrarkan pada Kongres Pemuda II, 28 Oktober 1928. 20 Mei 1908 adalah berdirinya Budi Utomo."),
  TW("Nasionalisme", "Organisasi Budi Utomo yang berdiri 20 Mei 1908 kini diperingati sebagai …", ["Hari Kebangkitan Nasional", "Hari Pendidikan Nasional", "Hari Sumpah Pemuda", "Hari Pahlawan"], "Tanggal berdirinya Budi Utomo diperingati sebagai Hari Kebangkitan Nasional."),
  TW("Nasionalisme", "Kamu melihat rekan kerja membagikan konten di grup kantor yang merendahkan suku tertentu. Sikap yang paling tepat adalah …", ["Mengingatkan secara baik bahwa konten itu tidak pantas, lalu meminta ia menghapusnya", "Diam karena itu urusan pribadinya", "Membalas dengan konten yang merendahkan suku dia", "Ikut menanggapi dengan bercanda supaya suasana cair"], "Sikap nasionalis menghargai keberagaman. Menegur dengan baik dan meminta konten dihapus mencegah perpecahan tanpa memperkeruh suasana."),
  TW("Nasionalisme", "Sebagai pegawai BUMN, kamu diminta memilih vendor. Ada produk dalam negeri dengan kualitas setara dan harga sedikit lebih tinggi daripada produk impor. Sikap yang mencerminkan nasionalisme dan profesionalisme adalah …", ["Mengutamakan produk dalam negeri sesuai ketentuan TKDN, selama memenuhi spesifikasi dan aturan pengadaan", "Selalu memilih yang termurah tanpa mempertimbangkan aturan", "Memilih produk impor karena lebih bergengsi", "Menyerahkan keputusan kepada vendor"], "BUMN wajib memperhatikan ketentuan Tingkat Komponen Dalam Negeri (TKDN) dalam pengadaan. Mengutamakan produk lokal yang memenuhi spesifikasi sejalan dengan aturan dan nasionalisme."),
  TW("Integritas", "Atasan memintamu menaikkan nilai tagihan perjalanan dinas dengan alasan 'semua juga begitu'. Tindakan yang paling tepat adalah …", ["Menolak dan tetap melaporkan biaya sesuai bukti yang sah", "Menurutinya karena perintah atasan", "Menaikkan sedikit saja agar tidak mencolok", "Meminta rekan lain yang mengurusnya"], "Integritas berarti jujur meski ada tekanan. Menggelembungkan biaya adalah penyalahgunaan anggaran."),
  TW("Integritas", "Kamu tidak sengaja mengetahui soal ujian seleksi internal sebelum ujian berlangsung. Sikapmu adalah …", ["Melaporkan kebocoran itu kepada panitia dan tidak memanfaatkannya", "Mempelajarinya karena bukan salahmu", "Membagikannya ke teman dekat", "Diam saja dan ikut ujian seperti biasa"], "Memanfaatkan atau membiarkan kebocoran merugikan keadilan seleksi. Melapor menjaga integritas proses."),
  TW("Integritas", "Seorang calon mitra memberimu voucer belanja setelah rapat penawaran kerja sama. Sikap yang benar adalah …", ["Menolak, dan bila sudah terlanjur diterima, melaporkannya sesuai aturan gratifikasi", "Menerima karena nilainya kecil", "Menerima lalu membagikan ke tim", "Menerima tetapi tidak memengaruhi keputusan"], "Pemberian yang berhubungan dengan jabatan berpotensi gratifikasi. Pegawai negeri dan BUMN wajib menolak atau melaporkannya."),
  TW("Integritas", "Kamu menemukan kesalahan hitung dalam laporan yang sudah kamu serahkan kemarin. Sikapmu?", ["Segera memberi tahu atasan dan mengirim versi yang sudah diperbaiki", "Membiarkannya karena belum ada yang sadar", "Menunggu sampai ada yang menegur", "Menyalahkan data dari bagian lain"], "Mengakui dan memperbaiki kesalahan secara terbuka menunjukkan tanggung jawab dan kejujuran."),
  TW("Bela negara", "Contoh bela negara yang dapat dilakukan karyawan dalam pekerjaannya sehari-hari adalah …", ["Bekerja dengan jujur, disiplin, dan berprestasi sesuai bidangnya", "Mengikuti wajib militer setiap tahun", "Menolak semua produk asing", "Hanya mengikuti upacara bendera"], "Bela negara bersifat nonfisik juga: bekerja jujur, disiplin, dan berprestasi memperkuat ketahanan nasional."),
  TW("Bela negara", "Nilai-nilai dasar bela negara meliputi cinta tanah air, sadar berbangsa dan bernegara, setia pada Pancasila, rela berkorban, dan …", ["Kemampuan awal bela negara", "Kesetiaan pada partai", "Kebanggaan pada daerah asal", "Ketaatan pada pimpinan"], "Lima nilai dasar bela negara yang sering dirujuk: cinta tanah air, sadar berbangsa dan bernegara, setia pada Pancasila, rela berkorban, dan memiliki kemampuan awal bela negara."),
  TW("Bela negara", "Ancaman nonmiliter terhadap kedaulatan negara contohnya adalah …", ["Penyebaran hoaks yang memecah belah dan peretasan sistem data negara", "Agresi militer negara lain", "Pelanggaran wilayah udara oleh pesawat tempur asing", "Blokade laut"], "Ancaman nonmiliter tidak memakai senjata, misalnya ideologi, siber, hoaks, dan ekonomi."),
  TW("Bela negara", "Wawasan Nusantara pada dasarnya adalah …", ["Cara pandang bangsa Indonesia tentang diri dan lingkungannya yang beragam dan strategis, dengan mengutamakan persatuan", "Ajaran tentang batas wilayah laut", "Kebijakan luar negeri bebas aktif", "Konsep pertahanan rakyat semesta"], "Wawasan Nusantara adalah cara pandang bangsa tentang diri dan lingkungannya berdasarkan Pancasila dan UUD 1945 dengan mengutamakan persatuan dan kesatuan."),
  TW("Bela negara", "Deklarasi yang menetapkan laut di antara pulau-pulau Indonesia sebagai wilayah kesatuan adalah …", ["Deklarasi Djuanda 1957", "Dekrit Presiden 1959", "Konferensi Meja Bundar 1949", "Konferensi Asia Afrika 1955"], "Deklarasi Djuanda 13 Desember 1957 menyatakan laut di sekitar dan di antara pulau-pulau Indonesia sebagai wilayah NKRI."),
  TW("Pilar negara", "Sila Pancasila yang paling erat dengan musyawarah untuk mufakat adalah sila ke- …", ["Empat", "Tiga", "Dua", "Lima"], "Sila keempat: Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan."),
  TW("Pilar negara", "Penerapan sila kelima Pancasila di tempat kerja adalah …", ["Memberikan penilaian kinerja yang adil berdasarkan hasil kerja, tanpa pilih kasih", "Berdoa sebelum memulai rapat", "Menggunakan bahasa Indonesia dalam laporan", "Bermusyawarah dalam rapat"], "Sila kelima menekankan keadilan sosial, termasuk perlakuan adil di tempat kerja."),
  TW("Nasionalisme", "Dalam rapat tim, ide rekan dari daerah lain berbeda dengan pendapat mayoritas, tetapi didukung data yang kuat. Sikap yang mencerminkan Bhinneka Tunggal Ika adalah …", ["Mempertimbangkan ide tersebut secara objektif berdasarkan data", "Menolak karena tidak sesuai kebiasaan mayoritas", "Mengabaikan karena ia anggota baru", "Menunda pembahasan tanpa alasan"], "Bhinneka Tunggal Ika berarti menghargai perbedaan. Keputusan diambil berdasarkan kualitas ide, bukan asal-usul orangnya."),
  TW("Integritas", "Prinsip 'konflik kepentingan' dalam pekerjaan berarti …", ["Keadaan ketika kepentingan pribadi berpotensi memengaruhi keputusan dalam jabatan", "Perselisihan antara dua divisi", "Perbedaan pendapat dalam rapat", "Persaingan sehat antarkaryawan"], "Konflik kepentingan terjadi saat kepentingan pribadi (keluarga, teman, bisnis) bisa memengaruhi objektivitas keputusan jabatan; harus diungkapkan dan dihindari."),
  TW("Integritas", "Lembaga negara yang berwenang memberantas tindak pidana korupsi secara khusus adalah …", ["KPK", "BPK", "OJK", "BPKP"], "KPK (Komisi Pemberantasan Korupsi). BPK memeriksa pengelolaan keuangan negara, BPKP mengawasi internal pemerintah, OJK mengawasi jasa keuangan."),
  TW("Pilar negara", "Kekuasaan kehakiman di Indonesia dilakukan oleh Mahkamah Agung dan …", ["Mahkamah Konstitusi", "Komisi Yudisial", "Kejaksaan Agung", "Dewan Perwakilan Daerah"], "Pasal 24 ayat (2): kekuasaan kehakiman dilakukan oleh MA dan badan peradilan di bawahnya, serta oleh MK. Komisi Yudisial bukan pelaksana kekuasaan kehakiman."),
  TW("Nasionalisme", "Kamu ditempatkan di cabang daerah dengan budaya yang berbeda dari daerah asalmu. Langkah pertama yang paling tepat adalah …", ["Mempelajari adat dan kebiasaan setempat serta membangun hubungan baik dengan masyarakat", "Meminta pindah karena tidak cocok", "Mengikuti kebiasaan daerah asal agar tetap nyaman", "Bergaul hanya dengan rekan dari daerah yang sama"], "Kesediaan beradaptasi dan menghormati budaya setempat adalah wujud persatuan dalam keberagaman."),
];

/* ------------------------------------------------- Learning Agility */

const LA = (b, q, o, e) => ({ b, q, o, e });

export const BANK_LA = [
  LA("Mental agility", "Kamu diminta menyelesaikan masalah yang belum pernah kamu hadapi dan tidak ada SOP-nya. Langkah pertamamu?", ["Memetakan masalah, mencari pola dari pengalaman serupa, lalu mencoba solusi kecil dan mengevaluasinya", "Menunggu sampai ada SOP resmi", "Menyerahkan ke rekan yang lebih senior", "Langsung mengambil solusi pertama yang terpikir"], "Mental agility adalah kemampuan berpikir jernih menghadapi hal baru: memahami masalah, mengaitkan pengalaman, dan bereksperimen secara terukur."),
  LA("Mental agility", "Data penjualan bulan ini turun, tetapi penyebabnya tidak jelas. Apa yang kamu lakukan?", ["Mengurai data per produk, wilayah, dan waktu untuk menemukan sumber penurunan sebelum menyimpulkan", "Menyimpulkan bahwa pasar sedang lesu", "Menunggu bulan depan apakah membaik", "Langsung menurunkan harga"], "Orang yang tangkas secara mental menggali akar masalah dengan memecah informasi, bukan menebak."),
  LA("Mental agility", "Dua kebijakan yang kamu terima tampak bertentangan. Sikapmu?", ["Mencari tujuan di balik kedua kebijakan dan mengusulkan jalan tengah yang memenuhi keduanya", "Memilih salah satu secara acak", "Mengabaikan keduanya", "Mengeluh kepada rekan kerja"], "Menghadapi ambiguitas dengan mencari tujuan di balik aturan adalah ciri mental agility."),
  LA("Mental agility", "Kamu ditugaskan ke proyek dengan istilah teknis yang asing. Cara belajar tercepat yang paling efektif adalah …", ["Membuat daftar istilah, bertanya pada ahli, lalu langsung mempraktikkannya di tugas kecil", "Membaca semua dokumen dari awal sampai akhir sebelum mulai", "Menghindari bagian yang belum dipahami", "Menunggu pelatihan resmi"], "Belajar cepat paling efektif dengan kombinasi bertanya, mencatat, dan langsung praktik."),
  LA("People agility", "Kamu bekerja dengan rekan yang gaya kerjanya sangat berbeda (spontan, sementara kamu terencana). Cara terbaik?", ["Memahami kekuatannya, menyepakati cara kerja bersama, dan menyesuaikan diri tanpa kehilangan kualitas", "Memaksanya mengikuti gayamu", "Bekerja sendiri-sendiri", "Melapor ke atasan bahwa ia sulit diajak kerja sama"], "People agility berarti mampu bekerja efektif dengan beragam orang dengan memahami dan menyesuaikan diri."),
  LA("People agility", "Klien marah karena kesalahan tim lain. Responsmu?", ["Mendengarkan, mengakui ketidaknyamanannya, dan memastikan masalah diselesaikan bersama tim terkait", "Menjelaskan bahwa itu kesalahan tim lain", "Meminta klien menghubungi tim lain", "Menghindari klien sampai ia tenang"], "Kemampuan membaca emosi orang lain dan merespons dengan empati adalah bagian dari people agility."),
  LA("People agility", "Kamu menerima kritik keras dari atasan atas presentasimu. Sikap paling tepat?", ["Berterima kasih, menanyakan contoh spesifik, lalu memperbaikinya di presentasi berikutnya", "Membela diri di tempat", "Diam dan menganggap atasan tidak paham", "Meminta tugas presentasi dialihkan ke orang lain"], "Terbuka pada umpan balik dan menggunakannya untuk berkembang adalah inti learning agility."),
  LA("People agility", "Anggota tim baru tampak kesulitan tetapi tidak berani bertanya. Apa yang kamu lakukan?", ["Menawarkan bantuan dan berbagi cara kerja yang sudah terbukti", "Membiarkannya belajar sendiri", "Melaporkan kinerjanya ke atasan", "Mengerjakan tugasnya diam-diam"], "Orang yang tangkas secara interpersonal peka terhadap kebutuhan orang lain dan membantu tim berkembang."),
  LA("Change agility", "Perusahaan memutuskan mengganti sistem kerja manual ke aplikasi baru dalam satu bulan. Sikapmu?", ["Mencoba aplikasi sejak awal, mencatat kendala, dan membantu rekan beradaptasi", "Menunggu sampai benar-benar diwajibkan", "Menolak karena sistem lama sudah nyaman", "Mengikuti tetapi tetap memakai cara lama diam-diam"], "Change agility adalah keingintahuan dan kesiapan memimpin atau mendukung perubahan."),
  LA("Change agility", "Kamu punya ide memperbaiki proses kerja yang sudah berjalan bertahun-tahun. Langkahmu?", ["Menguji ide dalam skala kecil, mengukur hasilnya, lalu mengusulkannya dengan data", "Langsung mengubah proses tanpa izin", "Menyimpan ide karena takut ditolak", "Mengeluhkan proses lama ke rekan"], "Mendorong perubahan dengan eksperimen terukur menunjukkan change agility yang bertanggung jawab."),
  LA("Change agility", "Rencana proyek berubah total karena keputusan manajemen. Responsmu?", ["Segera memahami alasan perubahan, menyusun ulang prioritas, dan melanjutkan pekerjaan", "Protes karena pekerjaan sebelumnya sia-sia", "Menunggu instruksi lebih rinci tanpa melakukan apa pun", "Melanjutkan rencana lama"], "Bangkit cepat dari perubahan dan menyesuaikan arah kerja adalah tanda kelincahan menghadapi perubahan."),
  LA("Change agility", "Kamu diminta belajar keterampilan baru di luar bidangmu. Sikapmu?", ["Melihatnya sebagai kesempatan berkembang dan menyusun rencana belajar", "Menolak karena bukan tugas utama", "Menerima tetapi menundanya", "Meminta kompensasi dulu"], "Keinginan belajar hal baru adalah komponen utama learning agility."),
  LA("Results agility", "Target timmu terancam tidak tercapai karena sumber daya berkurang. Apa yang kamu lakukan?", ["Memprioritaskan pekerjaan berdampak terbesar dan mencari cara kerja yang lebih efisien", "Menerima saja bahwa target tidak tercapai", "Meminta target diturunkan tanpa usaha", "Bekerja lembur sendiri tanpa koordinasi"], "Results agility adalah kemampuan tetap memberikan hasil dalam kondisi sulit dengan cara yang cerdas."),
  LA("Results agility", "Proyek pertama yang kamu pimpin gagal mencapai target. Sikapmu?", ["Melakukan evaluasi jujur tentang penyebabnya dan menerapkan pelajarannya di proyek berikutnya", "Menyalahkan kondisi eksternal", "Menghindari memimpin proyek lagi", "Menutupi kegagalan dari atasan"], "Belajar dari kegagalan dan menerapkannya adalah ciri orang yang tangkas belajar."),
  LA("Results agility", "Kamu menyelesaikan tugas lebih cepat dari jadwal. Apa yang kamu lakukan selanjutnya?", ["Memeriksa ulang kualitasnya, lalu menawarkan bantuan atau mengambil tugas berikutnya", "Menunggu sampai tenggat agar tidak diberi tugas lain", "Langsung pulang", "Mengurangi kecepatan kerja"], "Orang dengan results agility memanfaatkan waktu untuk menambah nilai, bukan sekadar menyelesaikan."),
  LA("Self-awareness", "Cara terbaik untuk mengetahui kelemahanmu dalam bekerja adalah …", ["Meminta umpan balik dari atasan dan rekan, lalu merefleksikannya secara rutin", "Menilai diri sendiri saja", "Menunggu penilaian kinerja tahunan", "Membandingkan diri dengan rekan yang paling lemah"], "Kesadaran diri dibangun melalui umpan balik dari orang lain dan refleksi."),
  LA("Self-awareness", "Kamu sadar mudah terburu-buru saat mengambil keputusan. Langkah perbaikan yang paling efektif?", ["Menetapkan kebiasaan memeriksa data dan meminta pendapat satu orang sebelum memutuskan hal penting", "Menghindari mengambil keputusan", "Menyerahkan semua keputusan ke atasan", "Menganggap itu sifat bawaan yang tidak bisa diubah"], "Mengenali kelemahan lalu membuat kebiasaan untuk mengatasinya adalah wujud self-awareness yang aktif."),
  LA("Self-awareness", "Setelah menyelesaikan proyek besar, kebiasaan yang paling mendukung perkembanganmu adalah …", ["Mencatat apa yang berhasil, apa yang tidak, dan apa yang akan dilakukan berbeda", "Langsung beralih ke proyek berikutnya", "Merayakan tanpa evaluasi", "Hanya mengingat keberhasilan"], "Refleksi terstruktur (after action review) membuat pengalaman berubah menjadi pembelajaran."),
  LA("Mental agility", "Saat diskusi, kamu menyadari pendapatmu keliru setelah mendengar argumen rekan. Sikapmu?", ["Mengakui dan mengubah pendapat berdasarkan argumen yang lebih kuat", "Tetap mempertahankan pendapat agar tidak terlihat lemah", "Diam dan tidak menanggapi", "Mengalihkan pembicaraan"], "Kesediaan mengubah pandangan saat ada informasi lebih baik menunjukkan pikiran yang terbuka dan tangkas."),
  LA("People agility", "Kamu harus meyakinkan unit lain yang awalnya menolak usulanmu. Strategi terbaik?", ["Memahami keberatan mereka, lalu menyesuaikan usulan agar menjawab kepentingan kedua pihak", "Meminta atasan memaksa mereka setuju", "Menyerah dan mencari usulan lain", "Menjalankan usulan tanpa persetujuan mereka"], "Memengaruhi orang lain dimulai dari memahami kepentingan mereka. Ini bagian dari people agility."),
];

export const TIPS_RBB = [
  "Tes online RBB berbasis komputer (CAT) dan berwaktu ketat. Kerjakan yang mudah lebih dulu.",
  "Klasifikasi kata: tentukan dulu kategori yang dimiliki empat kata, baru cari yang tidak cocok. Waspadai kata yang mirip tetapi beda sifat (contoh: biola digesek, bukan dipetik).",
  "Diagram: tanyakan dua hal untuk setiap pasangan: apakah satu termasuk yang lain, dan apakah keduanya bisa punya anggota yang sama.",
  "AKHLAK dan Learning Agility tidak menguji hafalan, tetapi konsistensi sikap. Pilih respons yang menyelesaikan masalah, menjaga integritas, dan melibatkan orang lain dengan tepat.",
  "Wawasan Kebangsaan: hafalkan pasal-pasal kunci UUD (1, 2, 7, 27, 29, 30, 31, 33, 35–36B) dan tonggak sejarah penting.",
];

export const TIPS_TWK = [
  "Bagi materi menjadi empat: nasionalisme, integritas, bela negara, dan pilar negara (Pancasila, UUD, NKRI, Bhinneka Tunggal Ika).",
  "Soal pengetahuan menuntut hafalan pasal dan tanggal; soal situasi menuntut sikap yang jujur dan menghargai keberagaman.",
  "Pada soal situasi, hindari pilihan yang diam saja atau membalas dengan cara yang sama buruknya.",
  "Bedakan lembaga yang mirip: KPK, BPK, BPKP, dan OJK; MA, MK, dan Komisi Yudisial.",
];

export const TIPS_LA = [
  "Learning agility mengukur kemauan dan kemampuan belajar dari pengalaman baru.",
  "Lima aspek yang sering dipakai: mental, people, change, results, dan self-awareness.",
  "Respons terbaik biasanya proaktif, terbuka pada umpan balik, dan mengubah pengalaman menjadi pelajaran.",
  "Hindari pilihan yang menunggu instruksi, menyalahkan pihak lain, atau menolak perubahan.",
];
