import { P, POIN, ISTILAH, CONTOH, KOTAK, LANGKAH, LATIHAN, K } from "./_blok.js";

export default {
  slug: "seo-specialist",
  judul: "Kelas Dasar SEO",
  ringkas: "Cara mesin pencari bekerja, riset kata kunci, SEO on-page, SEO teknis dasar, backlink, membaca Google Search Console, sampai audit SEO pertama.",
  untuk: "Pemula yang suka menganalisis dan ingin membantu situs muncul di Google.",
  durasi: "± 1,5 jam",
  hasil: [
    "Paham cara Google merayapi, mengindeks, dan mengurutkan halaman",
    "Bisa melakukan riset kata kunci dan memetakan ke halaman",
    "Bisa mengaudit SEO on-page dan teknis dasar",
    "Bisa membaca Google Search Console dan menyusun laporan",
  ],
  bab: [
    {
      id: "apa-itu",
      judul: "Apa itu SEO dan cara kerja Google",
      menit: 12,
      isi: [
        P("SEO (search engine optimization) adalah upaya agar halaman situs muncul di posisi atas hasil pencarian tanpa membayar iklan. Trafik dari pencarian disebut trafik organik."),
        LANGKAH([
          ["Crawling (merayapi)", "Robot Google (Googlebot) mengikuti tautan untuk menemukan halaman."],
          ["Indexing (mengindeks)", "Halaman yang ditemukan dipahami dan disimpan di indeks Google."],
          ["Ranking (mengurutkan)", "Saat ada pencarian, Google memilih dan mengurutkan halaman yang paling relevan dan bermanfaat."],
        ]),
        POIN("Tiga bidang SEO", [
          "On-page: isi dan struktur halaman (judul, konten, subjudul, tautan internal)",
          "Teknis: kecepatan, ramah ponsel, struktur URL, sitemap, indeks",
          "Off-page: reputasi dari luar, terutama tautan dari situs lain (backlink)",
        ]),
        ISTILAH([
          ["SERP", "Halaman hasil pencarian."],
          ["Organik", "Hasil pencarian yang tidak dibayar."],
          ["Indeks", "Basis data halaman yang disimpan Google."],
          ["Backlink", "Tautan dari situs lain ke situsmu."],
        ]),
      ],
      kuis: [
        K("Urutan proses Google yang benar adalah …", "Crawling, indexing, ranking", ["Ranking, crawling, indexing", "Indexing, ranking, crawling", "Crawling, ranking, indexing"], "Halaman ditemukan, disimpan, baru diurutkan."),
        K("Kecepatan halaman termasuk bidang SEO …", "Teknis", ["Off-page", "Iklan", "Media sosial"], "Kecepatan adalah faktor teknis."),
        K("Backlink adalah …", "Tautan dari situs lain ke situsmu", ["Tombol kembali di browser", "Iklan berbayar", "Menu navigasi"], "Backlink adalah sinyal reputasi dari luar."),
      ],
    },
    {
      id: "kata-kunci",
      judul: "Riset kata kunci",
      menit: 18,
      isi: [
        P("Riset kata kunci menjawab pertanyaan: apa yang diketik calon pelanggan, seberapa banyak, dan seberapa sulit bersaing di sana."),
        POIN("Ukuran yang diperhatikan", [
          "Volume: perkiraan jumlah pencarian per bulan",
          "Tingkat kesulitan: seberapa kuat halaman pesaing di posisi atas",
          "Search intent: informasi, perbandingan, transaksi, atau navigasi",
          "Relevansi bisnis: apakah orang yang mencari ini bisa menjadi pelanggan",
        ]),
        CONTOH(
          "Memilih kata kunci untuk toko furnitur kecil",
          "Menargetkan 'sofa' karena volumenya paling besar.",
          "Menargetkan 'sofa minimalis untuk ruang tamu kecil' dan 'sofa bed murah Jakarta'.",
          "Kata kunci panjang (long-tail) volumenya lebih kecil, tetapi persaingannya lebih ringan dan niat belinya lebih jelas.",
        ),
        POIN("Alat yang bisa dipakai", [
          "Google Keyword Planner (gratis dengan akun Google Ads)",
          "Google Search Console untuk kata kunci yang sudah mendatangkan pengunjung",
          "Saran otomatis Google dan 'Orang juga bertanya'",
          "Alat berbayar seperti Ahrefs atau Semrush (biasanya disediakan agensi)",
        ]),
        LATIHAN(
          "Kelompokkan kata kunci berikut berdasarkan intent: (a) 'apa itu reksa dana', (b) 'beli reksa dana online', (c) 'Bibit vs Bareksa', (d) 'login Bibit'.",
          "(a) Informasi. (b) Transaksi. (c) Perbandingan (commercial investigation). (d) Navigasi.",
        ),
      ],
      kuis: [
        K("Kata kunci long-tail umumnya …", "Volumenya lebih kecil tetapi niatnya lebih spesifik", ["Selalu paling besar volumenya", "Tidak pernah dicari", "Hanya satu kata"], "Long-tail sering lebih mudah dimenangkan dan lebih dekat ke pembelian."),
        K("'Login Bibit' termasuk intent …", "Navigasi", ["Informasi", "Transaksi", "Perbandingan"], "Orang ingin menuju situs atau halaman tertentu."),
        K("Alat gratis untuk melihat kata kunci yang sudah mendatangkan pengunjung adalah …", "Google Search Console", ["Canva", "Trello", "Zoom"], "Search Console menampilkan kueri yang memunculkan situsmu."),
      ],
    },
    {
      id: "on-page",
      judul: "SEO on-page",
      menit: 15,
      isi: [
        POIN("Checklist on-page", [
          "Title tag memuat kata kunci utama, sekitar 50 sampai 60 karakter",
          "Meta description yang mendorong klik",
          "Satu H1 per halaman, subjudul H2/H3 yang terstruktur",
          "URL pendek dan deskriptif, misalnya /sofa-minimalis",
          "Konten benar-benar menjawab intent dan lebih membantu dari pesaing",
          "Tautan internal ke halaman terkait",
          "Gambar dikompres dan diberi alt text",
        ]),
        CONTOH(
          "Title tag",
          "Home | Toko Kami",
          "Sofa Minimalis untuk Ruang Tamu Kecil, Kirim se-Jabodetabek | Rumahku",
          "Title kedua memuat kata kunci, manfaat, dan nama brand.",
        ),
        KOTAK("tips", "Satu halaman, satu topik utama", "Jangan membuat beberapa halaman yang menargetkan kata kunci sama. Halaman-halaman itu bisa saling bersaing (keyword cannibalization)."),
      ],
      kuis: [
        K("Berapa H1 yang dianjurkan per halaman?", "Satu", ["Lima", "Tidak ada", "Sebanyak paragraf"], "Satu H1 menegaskan topik utama halaman."),
        K("URL yang baik adalah …", "/sofa-minimalis", ["/p?id=8273&x=1", "/HALAMAN_BARU_FINAL2", "/index.php?page=89"], "URL pendek dan deskriptif mudah dipahami pengguna dan mesin pencari."),
        K("Keyword cannibalization terjadi ketika …", "Beberapa halaman menargetkan kata kunci yang sama", ["Kata kunci terlalu panjang", "Halaman tidak punya gambar", "Situs memakai HTTPS"], "Halaman-halaman itu saling bersaing."),
      ],
    },
    {
      id: "teknis",
      judul: "SEO teknis dasar",
      menit: 15,
      isi: [
        P("SEO teknis memastikan Google bisa menemukan, membaca, dan menampilkan halaman dengan baik. Kamu tidak harus jadi programmer, tetapi harus tahu apa yang dicek dan cara menjelaskannya ke developer."),
        ISTILAH([
          ["Sitemap XML", "Daftar halaman situs untuk membantu Google menemukannya."],
          ["robots.txt", "File yang memberi tahu robot bagian mana yang boleh dirayapi."],
          ["Noindex", "Tanda agar halaman tidak dimasukkan ke indeks."],
          ["Canonical", "Penanda versi utama jika ada halaman yang mirip atau sama."],
          ["Core Web Vitals", "Ukuran pengalaman pengguna dari Google: kecepatan muat, respons, dan stabilitas tampilan."],
          ["Redirect 301", "Pengalihan permanen dari URL lama ke URL baru."],
        ]),
        POIN("Pemeriksaan cepat", [
          "Ketik site:namadomain.com di Google untuk melihat perkiraan halaman yang terindeks",
          "Uji kecepatan di PageSpeed Insights",
          "Cek tampilan di ponsel",
          "Cari tautan rusak (404)",
          "Pastikan situs memakai HTTPS",
        ]),
        KOTAK("awas", "Kesalahan yang sering terjadi", "Halaman penting tidak sengaja diberi noindex atau diblokir robots.txt setelah situs baru diluncurkan. Akibatnya trafik bisa hilang. Ini salah satu hal pertama yang dicek saat audit."),
      ],
      kuis: [
        K("Alat gratis untuk menguji kecepatan halaman adalah …", "PageSpeed Insights", ["Canva", "Meta Ads", "Notion"], "PageSpeed Insights menilai kinerja dan Core Web Vitals."),
        K("Saat URL halaman diganti permanen, sebaiknya dipasang …", "Redirect 301", ["Noindex", "Hapus halaman", "Tautan rusak"], "Redirect 301 mengalihkan pengunjung dan nilai SEO ke URL baru."),
        K("Tanda noindex berarti …", "Halaman tidak dimasukkan ke indeks Google", ["Halaman dipercepat", "Halaman diiklankan", "Halaman diterjemahkan"], "Noindex berguna untuk halaman yang memang tidak perlu muncul di pencarian."),
      ],
    },
    {
      id: "off-page",
      judul: "Backlink dan reputasi",
      menit: 10,
      isi: [
        P("Tautan dari situs lain ibarat rekomendasi. Satu tautan dari situs relevan dan terpercaya jauh lebih bernilai daripada ratusan tautan dari situs sampah."),
        POIN("Cara mendapat backlink yang wajar", [
          "Membuat konten yang layak dikutip: data, panduan lengkap, alat gratis",
          "Menulis artikel tamu di situs relevan",
          "Mendaftarkan bisnis di Google Business Profile dan direktori resmi",
          "Menjalin kerja sama dengan media, komunitas, atau mitra bisnis",
        ]),
        KOTAK("awas", "Membeli backlink massal", "Paket '1.000 backlink murah' melanggar kebijakan spam Google dan bisa menurunkan peringkat situs. Hindari dan jelaskan risikonya kepada klien."),
      ],
      kuis: [
        K("Backlink yang paling bernilai berasal dari …", "Situs relevan dan terpercaya", ["Situs acak sebanyak-banyaknya", "Komentar spam", "Situs yang sudah ditutup"], "Kualitas lebih penting daripada jumlah."),
        K("Membeli ribuan backlink murah berisiko …", "Melanggar kebijakan spam dan menurunkan peringkat", ["Menaikkan peringkat permanen", "Tidak berpengaruh", "Membuat situs lebih cepat"], "Google menindak skema tautan."),
        K("Google Business Profile berguna terutama untuk …", "Bisnis lokal agar muncul di Maps dan pencarian lokal", ["Toko luar negeri saja", "Desain logo", "Iklan TV"], "Profil bisnis membantu pencarian lokal."),
      ],
    },
    {
      id: "laporan",
      judul: "Search Console, laporan, dan klien pertama",
      menit: 15,
      isi: [
        ISTILAH([
          ["Klik", "Berapa kali orang mengklik situsmu dari hasil pencarian."],
          ["Impresi", "Berapa kali situsmu muncul di hasil pencarian."],
          ["CTR", "Klik ÷ impresi × 100%."],
          ["Posisi rata-rata", "Rata-rata peringkat situs untuk kueri tertentu."],
        ]),
        CONTOH(
          "Menemukan peluang cepat",
          "Laporan: 'Klik bulan ini 1.200.'",
          "Halaman 'sofa bed murah' tampil 18.000 kali dengan posisi rata-rata 7 tetapi CTR hanya 0,8%. Usulan: perbaiki title dan meta description agar lebih menarik, lalu tambah bagian FAQ. Target: CTR 2% dalam 6 minggu.",
          "Halaman yang sudah di halaman pertama tetapi CTR-nya rendah adalah peluang tercepat.",
        ),
        KOTAK("fakta", "SEO butuh waktu", "Perubahan SEO biasanya baru terlihat dalam beberapa minggu sampai bulan. Sampaikan ini sejak awal agar harapan klien realistis, dan jangan pernah menjanjikan posisi nomor satu."),
        LANGKAH([
          ["Audit situs UMKM", "Pilih satu situs lokal dan buat audit 1 sampai 2 halaman: 5 temuan teratas dan cara memperbaikinya."],
          ["Bangun situs latihan", "Blog gratis dengan 5 sampai 10 artikel, pasang Search Console, dan catat perkembangannya."],
          ["Pelajari dari sumber resmi", "Google Search Central berisi panduan SEO resmi dan gratis."],
        ]),
      ],
      kuis: [
        K("Halaman dengan impresi tinggi tetapi CTR rendah sebaiknya …", "Diperbaiki title dan meta description-nya", ["Dihapus", "Diberi noindex", "Dibiarkan"], "Title dan deskripsi yang lebih menarik bisa menaikkan klik dengan cepat."),
        K("Janji yang tidak boleh diberikan kepada klien adalah …", "Pasti nomor satu di Google", ["Laporan bulanan", "Audit awal", "Rekomendasi perbaikan"], "Tidak ada yang bisa menjamin peringkat."),
        K("Sumber panduan SEO resmi dari Google adalah …", "Google Search Central", ["Meta Blueprint", "TikTok Academy", "Canva Design School"], "Google Search Central berisi dokumentasi SEO resmi."),
      ],
    },
  ],
  tugasAkhir: {
    judul: "Tugas akhir: audit SEO mini",
    brief: "Pilih satu situs UMKM. Buat audit berisi: 10 kata kunci target dan intent-nya, pemeriksaan on-page untuk 3 halaman, 5 temuan teknis (cek indeks, kecepatan, ponsel, HTTPS, tautan rusak), dan 5 rekomendasi berurut prioritas.",
    kriteria: ["Kata kunci relevan dengan bisnis", "Temuan disertai bukti", "Rekomendasi bisa dikerjakan", "Tidak menjanjikan peringkat"],
  },
};
