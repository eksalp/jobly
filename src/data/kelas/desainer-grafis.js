import { P, POIN, ISTILAH, CONTOH, KOTAK, LANGKAH, LATIHAN, K } from "./_blok.js";

export default {
  slug: "desainer-grafis",
  judul: "Kelas Dasar Desain Grafis",
  ringkas: "Apa yang dikerjakan desainer grafis, prinsip desain (hierarki, ruang kosong, kontras), warna dan tipografi, alat kerja, membaca brief klien, sampai portofolio.",
  untuk: "Pemula yang suka visual dan ingin membuat desain yang bukan sekadar 'bagus', tetapi berfungsi.",
  durasi: "± 1,5 jam",
  hasil: [
    "Paham bahwa desain adalah komunikasi, bukan hiasan",
    "Bisa menerapkan hierarki, perataan, ruang kosong, dan kontras",
    "Bisa memilih kombinasi huruf dan warna yang aman",
    "Bisa membaca brief dan menangani revisi klien",
  ],
  bab: [
    {
      id: "apa-itu",
      judul: "Apa itu desainer grafis?",
      menit: 10,
      isi: [
        P("Desainer grafis menyusun teks, gambar, warna, dan bentuk untuk menyampaikan pesan. Poster yang bagus bukan yang paling ramai, tetapi yang dalam tiga detik membuat orang paham: acara apa, kapan, dan harus berbuat apa."),
        POIN("Pekerjaan desain yang paling sering dicari secara remote", [
          "Konten media sosial (feed, carousel, story)",
          "Banner iklan dan thumbnail",
          "Logo dan identitas brand sederhana",
          "Presentasi dan dokumen perusahaan",
          "Kemasan, label, dan materi cetak",
          "Desain UI dasar untuk situs atau aplikasi",
        ]),
        ISTILAH([
          ["Layout", "Susunan elemen dalam satu bidang desain."],
          ["Hierarki visual", "Urutan elemen yang dilihat lebih dulu sampai terakhir."],
          ["Brand guideline", "Aturan pemakaian logo, warna, dan huruf sebuah brand."],
          ["Mockup", "Gambaran desain ketika dipasang di benda nyata (kaos, kemasan, layar)."],
          ["Vektor vs raster", "Vektor bisa diperbesar tanpa pecah (logo); raster tersusun dari piksel (foto)."],
        ]),
      ],
      kuis: [
        K("Ukuran utama desain yang baik adalah …", "Pesannya cepat dipahami orang yang melihat", ["Memakai banyak warna", "Memakai efek terbaru", "Semua ruang terisi"], "Desain adalah komunikasi."),
        K("Logo sebaiknya dibuat dalam format …", "Vektor, agar bisa diperbesar tanpa pecah", ["Foto JPG kecil", "Tangkapan layar", "GIF"], "Logo dipakai di berbagai ukuran sehingga harus vektor."),
        K("Hierarki visual adalah …", "Urutan elemen yang dilihat lebih dulu sampai terakhir", ["Jumlah layer", "Ukuran file", "Nama font"], "Hierarki mengarahkan mata pembaca."),
      ],
    },
    {
      id: "prinsip",
      judul: "Empat prinsip yang langsung memperbaiki desain",
      menit: 20,
      isi: [
        POIN("Prinsip dasar", [
          "Kontras: perbedaan yang jelas antara elemen penting dan pendukung (ukuran, tebal, warna)",
          "Perataan (alignment): setiap elemen sejajar dengan sesuatu, tidak ada yang 'melayang'",
          "Kedekatan (proximity): informasi yang berhubungan diletakkan berdekatan",
          "Pengulangan (repetition): gaya yang sama dipakai konsisten",
        ]),
        CONTOH(
          "Poster webinar",
          "Semua teks berukuran sama dan di tengah, 4 jenis huruf, 6 warna, tanggal terpisah jauh dari jam, logo sponsor sebesar judul.",
          "Judul besar dan tebal di kiri atas, tanggal dan jam berdekatan di bawahnya, 2 jenis huruf, 2 warna utama plus 1 warna aksen untuk tombol 'Daftar', logo sponsor kecil di bawah.",
          "Kontras, perataan kiri, kedekatan informasi waktu, dan pengulangan gaya membuat versi kedua jauh lebih mudah dibaca.",
        ),
        KOTAK("tips", "Ruang kosong bukan ruang terbuang", "Pemula sering takut ada area kosong. Padahal ruang kosong (white space) membuat elemen penting menonjol dan desain terasa lebih mahal."),
        KOTAK("tips", "Tes menyipitkan mata", "Sipitkan matamu saat melihat desain. Yang masih terlihat adalah elemen paling dominan. Jika yang dominan bukan pesan utama, perbaiki hierarkinya."),
      ],
      kuis: [
        K("Prinsip kedekatan berarti …", "Informasi yang berhubungan diletakkan berdekatan", ["Semua elemen ditumpuk", "Logo selalu di tengah", "Teks selalu kapital"], "Kedekatan membantu pembaca mengelompokkan informasi."),
        K("Mengapa ruang kosong penting?", "Membuat elemen penting menonjol dan desain lebih rapi", ["Menghemat tinta", "Agar desain cepat selesai", "Karena klien suka kosong"], "White space memberi napas pada desain."),
        K("Jumlah jenis huruf yang aman untuk pemula adalah …", "Dua", ["Lima", "Satu per baris", "Sebanyak mungkin"], "Dua huruf (judul dan isi) sudah cukup untuk kebanyakan desain."),
      ],
    },
    {
      id: "warna-huruf",
      judul: "Warna dan tipografi",
      menit: 18,
      isi: [
        P("Warna dan huruf membawa emosi. Bank cenderung memakai biru yang tenang, makanan sering memakai merah dan oranye yang membangkitkan selera. Namun yang terpenting adalah konsistensi dan keterbacaan."),
        POIN("Aturan warna sederhana 60-30-10", [
          "60% warna dominan (biasanya netral atau latar)",
          "30% warna sekunder",
          "10% warna aksen untuk hal yang harus diklik atau diperhatikan",
        ]),
        POIN("Tipografi untuk pemula", [
          "Satu huruf untuk judul, satu untuk isi",
          "Sans-serif (Inter, Poppins, Montserrat) mudah dibaca di layar",
          "Hindari teks di atas foto ramai tanpa lapisan gelap atau terang",
          "Ukuran isi di media sosial jangan terlalu kecil; cek tampilannya di ponsel",
          "Pastikan kontras teks dan latar cukup kuat",
        ]),
        ISTILAH([
          ["Serif", "Huruf dengan kaki kecil di ujungnya, misalnya Times New Roman."],
          ["Sans-serif", "Huruf tanpa kaki, misalnya Arial atau Inter."],
          ["Kode HEX", "Kode warna digital, misalnya #1E88E5."],
          ["Leading", "Jarak antarbaris teks."],
        ]),
        KOTAK("awas", "Lisensi font dan gambar", "Tidak semua font dan foto gratis untuk komersial. Pakai sumber yang jelas lisensinya seperti Google Fonts, Unsplash, atau aset berlisensi di Canva, dan simpan bukti lisensinya."),
      ],
      kuis: [
        K("Dalam aturan 60-30-10, angka 10% dipakai untuk …", "Warna aksen pada hal penting seperti tombol", ["Latar belakang", "Seluruh teks", "Logo pesaing"], "Aksen kecil membuat elemen penting menonjol."),
        K("Huruf sans-serif umumnya …", "Mudah dibaca di layar", ["Hanya untuk undangan", "Selalu miring", "Tidak bisa dipakai untuk judul"], "Bentuknya bersih sehingga jelas di layar."),
        K("Sebelum memakai font untuk proyek klien, kamu harus …", "Memastikan lisensinya boleh untuk komersial", ["Mengganti namanya", "Mengunduh dari situs mana saja", "Memakainya tanpa cek"], "Pelanggaran lisensi bisa merugikan klien."),
      ],
    },
    {
      id: "alat",
      judul: "Alat kerja: Canva, Figma, dan Adobe",
      menit: 12,
      isi: [
        POIN("Kapan memakai apa", [
          "Canva: cepat untuk konten media sosial dan presentasi; banyak dipakai UMKM",
          "Figma: desain UI, kolaborasi tim, juga bisa untuk konten media sosial",
          "Adobe Illustrator: logo dan ilustrasi vektor",
          "Adobe Photoshop: edit foto dan manipulasi gambar",
          "Alternatif gratis: Photopea (mirip Photoshop) dan Inkscape (vektor)",
        ]),
        KOTAK("tips", "Mulai dari satu alat", "Kuasai satu alat sampai lancar, misalnya Canva atau Figma. Klien membayar hasil dan cara berpikir, bukan banyaknya aplikasi yang kamu sebut di CV."),
        POIN("Format file yang perlu kamu kenal", [
          "PNG: gambar dengan latar transparan, cocok untuk logo di layar",
          "JPG: foto, ukuran file kecil",
          "SVG/AI/EPS: vektor untuk logo",
          "PDF: dokumen dan file cetak",
        ]),
      ],
      kuis: [
        K("Alat yang paling umum untuk desain UI dan kolaborasi tim adalah …", "Figma", ["Notepad", "Paint", "Kalkulator"], "Figma dipakai luas untuk UI dan kolaborasi."),
        K("Format yang mendukung latar transparan adalah …", "PNG", ["JPG", "DOCX", "MP3"], "PNG mendukung transparansi."),
        K("Alternatif gratis untuk desain vektor adalah …", "Inkscape", ["Photoshop", "Premiere", "Excel"], "Inkscape adalah aplikasi vektor gratis."),
      ],
    },
    {
      id: "brief-revisi",
      judul: "Membaca brief dan menangani revisi",
      menit: 15,
      isi: [
        P("Sebagian besar konflik dengan klien desain berawal dari brief yang tidak jelas. Desainer yang baik bertanya dulu sebelum menggambar."),
        POIN("Pertanyaan wajib sebelum mulai", [
          "Untuk apa desain ini dan di mana dipasang (ukuran, platform)?",
          "Siapa yang akan melihatnya?",
          "Apa satu pesan utama yang harus ditangkap?",
          "Apakah ada brand guideline, logo, dan foto yang harus dipakai?",
          "Contoh desain yang disukai dan tidak disukai?",
          "Berapa kali revisi dan kapan tenggatnya?",
        ]),
        CONTOH(
          "Menjawab revisi 'kurang wah'",
          "Oke kak, saya ganti semua.",
          "Baik, Kak. Supaya revisinya tepat, 'kurang wah' ini lebih ke warnanya kurang mencolok, judulnya kurang besar, atau fotonya kurang menarik? Kalau ada contoh desain yang Kakak suka, boleh dikirim.",
          "Pertanyaan yang spesifik mengubah komentar samar menjadi arahan yang bisa dikerjakan.",
        ),
        KOTAK("tips", "Kirim dua sampai tiga opsi di awal", "Memberi beberapa arah di tahap awal membuat klien lebih mudah memilih dan mengurangi revisi besar."),
      ],
      kuis: [
        K("Pertanyaan yang paling penting sebelum mendesain adalah …", "Apa satu pesan utama dan di mana desain dipasang", ["Warna favorit desainer", "Laptop yang dipakai klien", "Jumlah pengikut klien"], "Tujuan dan media menentukan seluruh keputusan desain."),
        K("Jika klien bilang 'kurang wah', desainer sebaiknya …", "Bertanya bagian mana yang dimaksud dan meminta contoh", ["Mengganti semua elemen", "Menolak revisi", "Menambah efek sebanyak mungkin"], "Komentar samar perlu diterjemahkan menjadi arahan spesifik."),
        K("Jumlah revisi sebaiknya disepakati …", "Sebelum pekerjaan dimulai", ["Setelah revisi kelima", "Tidak perlu disepakati", "Setelah dibayar"], "Kesepakatan awal mencegah revisi tanpa akhir."),
      ],
    },
    {
      id: "portofolio",
      judul: "Portofolio dan klien pertama",
      menit: 12,
      isi: [
        LANGKAH([
          ["Buat 6 sampai 8 karya terbaik", "Lebih baik sedikit tetapi bagus daripada banyak tetapi biasa."],
          ["Tunjukkan proses", "Untuk 2 sampai 3 karya, tampilkan brief, sketsa, alternatif, dan alasan pilihanmu."],
          ["Pakai mockup", "Desain terlihat lebih nyata saat dipasang di ponsel, kemasan, atau baliho."],
          ["Unggah di Behance atau Dribbble", "Lalu tautkan di LinkedIn dan CV."],
        ]),
        POIN("Ide proyek tanpa klien", [
          "Redesain feed Instagram UMKM lokal (sebutkan sebagai konsep)",
          "Identitas visual untuk brand fiktif lengkap dengan logo, warna, dan contoh pemakaian",
          "Seri carousel edukasi tentang topik yang kamu kuasai",
        ]),
        KOTAK("awas", "Jangan memakai logo brand besar seolah klienmu", "Tandai karya konsep dengan jelas sebagai 'konsep pribadi' agar tidak menyesatkan."),
      ],
      kuis: [
        K("Portofolio yang baik berisi …", "Sedikit karya terbaik dan penjelasan prosesnya", ["Semua desain sejak SMP", "Hanya logo", "Desain orang lain"], "Klien menilai kualitas dan cara berpikir."),
        K("Karya untuk brand nyata yang bukan klienmu sebaiknya …", "Ditandai jelas sebagai konsep pribadi", ["Diakui sebagai proyek resmi", "Disembunyikan", "Diberi watermark brand"], "Kejujuran menjaga reputasi."),
        K("Platform portofolio desain yang populer adalah …", "Behance dan Dribbble", ["Spotify", "Waze", "Gojek"], "Keduanya banyak dilihat klien dan perekrut."),
      ],
    },
  ],
  tugasAkhir: {
    judul: "Tugas akhir: poster dan carousel",
    brief: "Buat (1) poster acara fiktif dan (2) carousel Instagram 5 slide tentang tips singkat. Terapkan 4 prinsip desain, aturan warna 60-30-10, dan maksimal 2 jenis huruf. Tulis 3 kalimat alasan desainmu.",
    kriteria: ["Pesan utama terbaca dalam 3 detik", "Perataan konsisten", "Kontras teks dan latar cukup", "Aset berlisensi jelas"],
  },
};
