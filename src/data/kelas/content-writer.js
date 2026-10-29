import { P, POIN, ISTILAH, CONTOH, KOTAK, LANGKAH, LATIHAN, K } from "./_blok.js";

export default {
  slug: "content-writer",
  judul: "Kelas Dasar Content Writing",
  ringkas: "Apa itu content writer, jenis-jenis konten, cara riset, struktur artikel yang enak dibaca, dasar SEO, sampai cara memakai AI tanpa kehilangan kualitas.",
  untuk: "Pemula yang suka menulis dan ingin dibayar untuk itu.",
  durasi: "± 1,5 jam",
  hasil: [
    "Paham perbedaan content writing, copywriting, dan menulis bebas",
    "Bisa menyusun kerangka artikel dari satu kata kunci",
    "Bisa menulis paragraf yang ringkas, jelas, dan mudah dipindai",
    "Paham dasar SEO on-page yang diminta hampir semua klien",
  ],
  bab: [
    {
      id: "apa-itu",
      judul: "Apa itu content writer?",
      menit: 10,
      isi: [
        P("Content writer menulis konten yang memberi informasi, menjawab pertanyaan, atau menghibur, dengan tujuan membangun kepercayaan pembaca kepada sebuah brand. Contohnya artikel blog, panduan, newsletter, naskah video edukasi, dan konten LinkedIn perusahaan."),
        P("Bedanya dengan copywriter: copywriter mendorong pembaca bertindak sekarang, content writer membuat pembaca kembali lagi dan lama-lama percaya. Artikel 'Cara memilih laptop untuk kuliah' di blog toko elektronik adalah konten. Halaman promo 'Diskon laptop 20% sampai Minggu' adalah copy."),
        POIN("Siapa yang membutuhkan content writer?", [
          "Perusahaan yang ingin blognya muncul di Google",
          "Startup dan aplikasi yang butuh artikel bantuan dan edukasi",
          "Agensi digital yang menangani banyak klien",
          "Media online dan situs ulasan",
          "Pemilik usaha kecil yang tidak sempat menulis sendiri",
        ]),
        ISTILAH([
          ["Artikel SEO", "Artikel yang ditulis agar mudah ditemukan di mesin pencari untuk kata kunci tertentu."],
          ["Kata kunci (keyword)", "Kata atau frasa yang diketik orang di Google, misalnya 'cara membuat CV ATS'."],
          ["Content calendar", "Jadwal konten yang akan terbit, biasanya per minggu atau bulan."],
          ["Brief artikel", "Instruksi klien: judul, kata kunci, jumlah kata, target pembaca, dan poin wajib."],
          ["Evergreen", "Konten yang tetap relevan bertahun-tahun, misalnya 'cara menulis email lamaran'."],
        ]),
        KOTAK("fakta", "Bayaran umumnya dihitung bagaimana?", "Di Indonesia, freelancer pemula sering dibayar per artikel atau per jumlah kata. Penulis berpengalaman beralih ke tarif per proyek atau kontrak bulanan. Semakin spesifik bidangmu (keuangan, kesehatan, teknologi), semakin tinggi tarifnya."),
      ],
      kuis: [
        K("Mana yang paling tepat disebut konten, bukan copy?", "Artikel 'Cara merawat sepatu kulit agar awet'", ["Banner 'Diskon 50% hari ini'", "Tombol 'Beli sekarang'", "Iklan 'Gratis ongkir khusus pengguna baru'"], "Artikel panduan memberi informasi dan membangun kepercayaan. Itu ciri konten."),
        K("Kata kunci (keyword) adalah …", "Frasa yang diketik orang di mesin pencari", ["Kata yang dicetak tebal", "Judul artikel", "Nama penulis"], "Content writer menulis artikel yang menjawab kata kunci tertentu agar mudah ditemukan."),
        K("Konten evergreen artinya …", "Tetap relevan dalam waktu lama", ["Hanya untuk produk ramah lingkungan", "Diterbitkan setiap hari", "Berisi berita terbaru"], "Konten evergreen tidak cepat basi, sehingga terus mendatangkan pembaca."),
      ],
    },
    {
      id: "riset",
      judul: "Riset sebelum menulis",
      menit: 15,
      isi: [
        P("Artikel yang bagus bukan yang paling panjang, tetapi yang paling tepat menjawab pertanyaan pembaca. Untuk tahu pertanyaannya, kamu perlu riset sebelum menulis."),
        LANGKAH([
          ["Pahami maksud pencarian", "Ketik kata kuncinya di Google. Perhatikan hasil teratas: apakah berupa panduan langkah, daftar, perbandingan, atau definisi? Itu bentuk yang diinginkan pembaca."],
          ["Kumpulkan pertanyaan", "Lihat bagian 'Orang juga bertanya' di Google, kolom komentar YouTube, dan forum. Pertanyaan ini akan menjadi subjudul."],
          ["Cari sumber terpercaya", "Situs resmi pemerintah, jurnal, laporan lembaga, atau dokumentasi produk. Catat tautannya."],
          ["Temukan celah", "Apa yang belum dijelaskan artikel pesaing? Contoh nyata, angka terbaru, langkah yang lebih rinci? Celah inilah nilai tambah artikelmu."],
        ]),
        KOTAK("awas", "Jangan menyalin, termasuk 'parafrase' tipis", "Mengganti beberapa kata dari artikel orang lain tetap dianggap plagiat. Klien biasanya mengecek dengan alat seperti Copyscape. Tulis ulang dari pemahamanmu sendiri dan cantumkan sumber untuk data."),
        ISTILAH([
          ["Search intent", "Maksud di balik pencarian: ingin tahu, ingin membandingkan, atau ingin membeli."],
          ["SERP", "Halaman hasil pencarian Google."],
          ["Plagiarisme", "Memakai tulisan orang lain tanpa izin atau tanpa menyebut sumber."],
        ]),
        LATIHAN(
          "Untuk kata kunci 'cara membuat surat lamaran kerja', tulis 5 pertanyaan yang kemungkinan besar dicari pembaca.",
          "1) Apa saja isi surat lamaran kerja? 2) Bagaimana contoh surat lamaran untuk fresh graduate? 3) Surat lamaran dikirim lewat email, bagaimana formatnya? 4) Berapa panjang surat lamaran yang ideal? 5) Apa bedanya surat lamaran dan CV?",
        ),
      ],
      kuis: [
        K("Langkah pertama untuk memahami search intent adalah …", "Melihat bentuk hasil teratas di Google untuk kata kunci itu", ["Langsung menulis 2.000 kata", "Mengganti kata kunci dengan sinonim", "Menulis judul sepanjang mungkin"], "Hasil teratas menunjukkan bentuk konten yang dianggap paling menjawab kebutuhan pembaca."),
        K("Mengubah beberapa kata dari artikel orang lain disebut …", "Tetap plagiat", ["Riset", "Kurasi", "Optimasi"], "Parafrase tipis tetap plagiat. Tulis dari pemahaman sendiri."),
        K("Bagian 'Orang juga bertanya' di Google berguna untuk …", "Menemukan pertanyaan yang bisa dijadikan subjudul", ["Menentukan harga artikel", "Mencari gambar", "Mengecek tata bahasa"], "Pertanyaan nyata pembaca adalah bahan subjudul yang kuat."),
      ],
    },
    {
      id: "struktur",
      judul: "Struktur artikel yang enak dibaca",
      menit: 18,
      isi: [
        P("Pembaca online jarang membaca kata per kata. Mereka memindai: melihat subjudul, kalimat pertama paragraf, dan daftar. Tugasmu adalah membuat artikel yang tetap bisa dipahami walau hanya dipindai."),
        POIN("Kerangka standar artikel", [
          "Judul: jelas, memuat kata kunci, menjanjikan manfaat",
          "Pembuka (2 sampai 4 kalimat): akui masalah pembaca dan beri tahu apa yang akan ia dapat",
          "Isi: subjudul (H2) per poin besar, sub-subjudul (H3) bila perlu",
          "Penutup: rangkum poin terpenting dan beri langkah berikutnya",
        ]),
        CONTOH(
          "Pembuka yang bertele-tele vs langsung",
          "Di era globalisasi yang semakin maju seperti sekarang ini, teknologi berkembang dengan sangat pesat dan memengaruhi berbagai aspek kehidupan, termasuk dalam dunia kerja.",
          "Lamaranmu sering tidak dibalas? Bisa jadi CV-mu tidak terbaca sistem ATS. Di artikel ini kamu akan belajar 5 cara membuat CV yang lolos ATS, lengkap dengan contohnya.",
          "Pembuka pertama tidak berisi informasi apa pun. Pembuka kedua langsung menyentuh masalah dan menjanjikan isi.",
        ),
        POIN("Aturan paragraf online", [
          "Satu paragraf, satu gagasan; idealnya 2 sampai 4 kalimat",
          "Kalimat pertama berisi inti paragraf",
          "Pakai daftar bernomor untuk langkah, poin untuk daftar biasa",
          "Cetak tebal secukupnya, hanya untuk hal yang benar-benar penting",
          "Hindari kalimat lebih dari 25 kata",
        ]),
        KOTAK("tips", "Tes 10 detik", "Minta teman melihat artikelmu selama 10 detik, lalu tanyakan isinya. Kalau ia bisa menjawab, struktur artikelmu sudah baik."),
        LATIHAN(
          "Buat kerangka (judul, pembuka 1 kalimat, dan 4 subjudul H2) untuk artikel dengan kata kunci 'tips wawancara kerja online'.",
          "Judul: 7 Tips Wawancara Kerja Online agar Lancar dan Berkesan. Pembuka: Wawancara online terlihat santai, tetapi masalah kecil seperti sinyal atau pencahayaan bisa merusak kesan pertama. H2: Siapkan perangkat dan koneksi sehari sebelumnya; Atur latar, cahaya, dan suara; Jawab dengan struktur yang jelas; Tutup wawancara dengan pertanyaan dan ucapan terima kasih.",
        ),
      ],
      kuis: [
        K("Mengapa artikel online perlu banyak subjudul?", "Karena pembaca online cenderung memindai", ["Agar jumlah kata bertambah", "Karena diwajibkan Google", "Agar terlihat formal"], "Subjudul membantu pembaca menemukan bagian yang ia butuhkan dengan cepat."),
        K("Pembuka artikel yang baik sebaiknya …", "Menyentuh masalah pembaca dan menjelaskan apa yang akan didapat", ["Dimulai dengan 'Di era globalisasi'", "Berisi definisi dari KBBI", "Panjang minimal 3 paragraf"], "Pembuka harus langsung relevan agar pembaca mau lanjut."),
        K("Panjang paragraf yang ideal untuk artikel online adalah …", "2 sampai 4 kalimat", ["10 kalimat", "Satu paragraf untuk satu artikel", "Tidak ada paragraf"], "Paragraf pendek lebih mudah dibaca di layar ponsel."),
      ],
    },
    {
      id: "seo",
      judul: "Dasar SEO untuk penulis",
      menit: 15,
      isi: [
        P("SEO (search engine optimization) adalah upaya agar tulisan muncul di halaman pertama mesin pencari. Penulis tidak perlu menguasai sisi teknis, tetapi wajib paham SEO on-page: hal-hal di dalam tulisan."),
        POIN("Checklist SEO on-page", [
          "Kata kunci utama ada di judul, paragraf pertama, dan minimal satu subjudul",
          "Gunakan variasi dan sinonim secara alami, jangan diulang-ulang",
          "Meta description 140 sampai 155 karakter yang merangkum isi",
          "Tautan internal ke artikel lain di situs yang sama",
          "Tautan eksternal ke sumber terpercaya",
          "Teks alternatif (alt text) gambar yang menjelaskan isi gambar",
        ]),
        CONTOH(
          "Keyword stuffing vs penulisan alami",
          "Tips wawancara kerja online ini adalah tips wawancara kerja online terbaik untuk kamu yang mencari tips wawancara kerja online.",
          "Wawancara kerja online kini jadi tahap awal di banyak perusahaan. Berikut tujuh tips agar kamu tampil percaya diri di depan kamera.",
          "Mengulang kata kunci membuat tulisan tidak enak dibaca dan justru bisa dinilai buruk oleh Google.",
        ),
        KOTAK("fakta", "Google menilai manfaat untuk manusia", "Panduan Google tentang konten yang membantu (helpful content) menekankan pengalaman, keahlian, dan kepercayaan. Artikel yang benar-benar menjawab pertanyaan pembaca lebih penting daripada trik kata kunci."),
        ISTILAH([
          ["Meta description", "Ringkasan pendek yang muncul di bawah judul pada hasil pencarian."],
          ["Internal link", "Tautan ke halaman lain di situs yang sama."],
          ["Alt text", "Deskripsi gambar untuk mesin pencari dan pembaca layar."],
          ["Keyword stuffing", "Mengulang kata kunci berlebihan secara tidak wajar."],
        ]),
      ],
      kuis: [
        K("Di mana kata kunci utama sebaiknya muncul?", "Judul, paragraf pertama, dan minimal satu subjudul", ["Hanya di bagian penutup", "Di setiap kalimat", "Di nama file saja"], "Penempatan di bagian penting membantu mesin pencari memahami topik artikel."),
        K("Panjang meta description yang umum dianjurkan adalah …", "Sekitar 140 sampai 155 karakter", ["10 karakter", "1.000 karakter", "Satu paragraf penuh"], "Lebih panjang dari itu biasanya terpotong di hasil pencarian."),
        K("Mengulang kata kunci secara berlebihan disebut …", "Keyword stuffing", ["Internal linking", "Content calendar", "Evergreen"], "Keyword stuffing membuat tulisan buruk dan tidak disukai mesin pencari."),
      ],
    },
    {
      id: "ai-editing",
      judul: "Menyunting dan memakai AI dengan benar",
      menit: 12,
      isi: [
        P("Klien membayar penulis untuk ketepatan, gaya, dan kepercayaan. AI bisa mempercepat, tetapi hasil mentahnya sering umum, kadang salah fakta, dan mudah dikenali. Penulis yang laku justru yang tahu cara menyunting."),
        POIN("Pemakaian AI yang wajar", [
          "Memancing ide judul dan kerangka",
          "Merangkum bahan riset yang panjang (tetap cek sumber aslinya)",
          "Mencari variasi kalimat ketika buntu",
          "Mengecek tata bahasa",
        ]),
        POIN("Yang tetap harus kamu lakukan sendiri", [
          "Memeriksa setiap fakta dan angka ke sumber asli",
          "Menambahkan contoh, pengalaman, dan sudut pandang yang tidak dimiliki AI",
          "Menyesuaikan gaya bahasa dengan brand klien",
          "Membaca ulang dengan suara keras untuk menangkap kalimat kaku",
        ]),
        KOTAK("awas", "Tanyakan kebijakan klien", "Sebagian klien melarang konten AI atau mewajibkan pemberitahuan. Selalu tanyakan di awal kerja sama agar tidak terjadi masalah kepercayaan."),
        LANGKAH([
          ["Baca untuk isi", "Apakah semua pertanyaan pembaca terjawab? Ada bagian yang hilang?"],
          ["Baca untuk struktur", "Apakah urutannya logis? Subjudul jelas?"],
          ["Baca untuk kalimat", "Potong kata yang tidak perlu, pecah kalimat panjang."],
          ["Baca untuk ejaan", "Cek EYD, nama, angka, dan tautan."],
        ]),
      ],
      kuis: [
        K("Penggunaan AI yang paling aman bagi content writer adalah …", "Memancing ide kerangka lalu menulis dan memeriksa fakta sendiri", ["Menyalin hasil AI langsung ke klien", "Meminta AI membuat data statistik", "Memakai AI tanpa membaca hasilnya"], "AI membantu proses, tetapi tanggung jawab kualitas dan fakta tetap di penulis."),
        K("Mengapa membaca ulang dengan suara keras berguna?", "Untuk menangkap kalimat yang kaku atau terlalu panjang", ["Untuk menghitung jumlah kata", "Untuk memeriksa SEO", "Untuk mencari gambar"], "Telinga lebih mudah menangkap kalimat yang tidak alami."),
        K("Sebelum memakai AI untuk proyek klien, sebaiknya kamu …", "Menanyakan kebijakan klien tentang konten AI", ["Merahasiakannya", "Menaikkan tarif dua kali lipat", "Tidak perlu melakukan apa pun"], "Kebijakan setiap klien berbeda; keterbukaan menjaga kepercayaan."),
      ],
    },
    {
      id: "klien",
      judul: "Portofolio, tarif, dan klien pertama",
      menit: 12,
      isi: [
        LANGKAH([
          ["Pilih 1 sampai 2 bidang", "Misalnya karier, keuangan pribadi, teknologi, atau parenting. Klien lebih percaya penulis yang punya fokus."],
          ["Tulis 3 artikel contoh", "Terbitkan di Medium, LinkedIn, atau blog gratis. Pilih kata kunci nyata dan tulis sebaik mungkin."],
          ["Buat halaman portofolio", "Satu halaman berisi profil singkat, bidang, dan tautan ke artikel contoh."],
          ["Mulai melamar", "Lowongan content writer remote, Upwork, Projects.co.id, dan grup komunitas penulis."],
        ]),
        POIN("Hal yang perlu disepakati sebelum mulai", [
          "Jumlah kata, kata kunci, dan tenggat",
          "Berapa kali revisi termasuk dalam harga",
          "Cara dan waktu pembayaran (misalnya 50% di awal untuk klien baru)",
          "Apakah namamu boleh dicantumkan atau artikel ditulis atas nama klien",
        ]),
        KOTAK("tips", "Langkah berikutnya", "Kerjakan latihan praktik Content Writer di Jobly: ada brief artikel sungguhan dan umpan balik seperti dari editor."),
      ],
      kuis: [
        K("Mengapa memilih 1 sampai 2 bidang tulisan menguntungkan?", "Klien lebih percaya penulis yang punya fokus dan pengetahuan bidang", ["Supaya tidak perlu riset", "Karena platform mewajibkannya", "Agar bisa menulis lebih cepat tanpa membaca"], "Spesialisasi membuat tulisanmu lebih dalam dan tarifmu lebih tinggi."),
        K("Hal yang wajib disepakati sebelum mulai menulis adalah …", "Jumlah revisi, tenggat, dan cara pembayaran", ["Warna font", "Merek laptop", "Jam tidur penulis"], "Kesepakatan jelas mencegah konflik di kemudian hari."),
        K("Tempat paling mudah menerbitkan artikel contoh adalah …", "Medium, LinkedIn, atau blog gratis", ["Grup keluarga", "Surat kabar cetak", "Kolom komentar"], "Platform ini gratis dan mudah dibagikan sebagai portofolio."),
      ],
    },
  ],
  tugasAkhir: {
    judul: "Tugas akhir: satu artikel SEO utuh",
    brief: "Pilih kata kunci di bidang yang kamu minati. Tulis artikel 700 sampai 900 kata lengkap dengan judul, meta description, minimal 4 subjudul, 1 tautan internal (bayangkan), dan 2 sumber terpercaya.",
    kriteria: ["Menjawab search intent", "Pembuka langsung ke masalah", "Paragraf pendek dan mudah dipindai", "Kata kunci ditempatkan secara alami", "Fakta dicek ke sumber"],
  },
};
