import { P, POIN, ISTILAH, CONTOH, KOTAK, LANGKAH, LATIHAN, K } from "./_blok.js";

export default {
  slug: "admin-media-sosial",
  judul: "Kelas Dasar Admin Media Sosial",
  ringkas: "Apa yang dikerjakan admin media sosial, cara kerja algoritma, pilar konten, menyusun kalender, menulis caption, membalas komentar, sampai membaca insight.",
  untuk: "Pemula yang aktif di media sosial dan ingin mengelolanya untuk brand.",
  durasi: "± 1,5 jam",
  hasil: [
    "Paham beda akun pribadi dan akun brand",
    "Bisa menyusun pilar konten dan kalender sebulan",
    "Bisa menulis caption dan membalas komentar sesuai suara brand",
    "Bisa membaca angka insight dan membuat laporan bulanan sederhana",
  ],
  bab: [
    {
      id: "apa-itu",
      judul: "Apa itu admin media sosial?",
      menit: 10,
      isi: [
        P("Admin media sosial mengelola akun Instagram, TikTok, Facebook, LinkedIn, atau X milik sebuah brand. Tugasnya bukan sekadar mengunggah foto, tetapi menjaga akun tetap aktif, konsisten, dan bermanfaat bagi tujuan bisnis."),
        POIN("Tugas harian dan mingguan", [
          "Merencanakan konten bersama klien atau tim",
          "Menulis caption dan menyiapkan desain atau video sederhana",
          "Menjadwalkan unggahan",
          "Membalas komentar dan DM",
          "Memantau tren dan akun pesaing",
          "Membuat laporan performa bulanan",
        ]),
        KOTAK("fakta", "Admin, specialist, dan strategist", "Admin biasanya fokus pada eksekusi harian. Social media specialist ikut menyusun strategi dan menganalisis data. Strategist menentukan arah besar dan sering memimpin tim. Banyak orang memulai dari admin."),
        ISTILAH([
          ["Feed", "Unggahan permanen di profil."],
          ["Story", "Konten yang hilang setelah 24 jam."],
          ["Reels/short video", "Video pendek vertikal yang menjangkau banyak orang baru."],
          ["Engagement", "Interaksi: suka, komentar, simpan, bagikan."],
          ["Reach", "Jumlah akun unik yang melihat konten."],
        ]),
      ],
      kuis: [
        K("Tugas admin media sosial yang paling tepat adalah …", "Merencanakan, mengunggah, membalas, dan melaporkan performa akun brand", ["Hanya mengunggah foto", "Mengatur gaji tim", "Membuat produk"], "Admin media sosial mengelola siklus konten dari rencana sampai laporan."),
        K("Reach adalah …", "Jumlah akun unik yang melihat konten", ["Jumlah pengikut", "Jumlah komentar", "Jumlah unggahan"], "Reach menghitung akun berbeda yang melihat konten."),
        K("Interaksi seperti simpan dan bagikan termasuk …", "Engagement", ["Reach", "Feed", "Bio"], "Engagement adalah semua bentuk interaksi audiens."),
      ],
    },
    {
      id: "algoritma",
      judul: "Cara kerja algoritma secara sederhana",
      menit: 12,
      isi: [
        P("Algoritma adalah sistem yang memilih konten mana yang ditampilkan ke siapa. Detailnya berubah-ubah dan tidak dibuka secara lengkap, tetapi prinsip umumnya konsisten: platform ingin pengguna betah."),
        POIN("Sinyal yang umumnya diperhatikan", [
          "Berapa lama orang menonton atau membaca",
          "Apakah konten disimpan atau dibagikan",
          "Apakah orang berkomentar dan berdiskusi",
          "Apakah pengguna pernah berinteraksi dengan akun itu sebelumnya",
        ]),
        KOTAK("tips", "Tiga detik pertama", "Untuk video pendek, tiga detik pertama menentukan apakah orang berhenti scroll. Mulailah dengan hook: pertanyaan, hasil akhir, atau situasi yang dikenali penonton."),
        KOTAK("awas", "Hindari trik curang", "Membeli pengikut, grup saling like, atau giveaway yang meminta tag 10 teman memberi angka palsu. Angka naik, tetapi penjualan tidak, dan akun bisa dibatasi."),
      ],
      kuis: [
        K("Konten yang disimpan banyak orang biasanya dianggap …", "Bernilai, sehingga cenderung disebarkan lebih luas", ["Melanggar aturan", "Tidak menarik", "Spam"], "Simpan menandakan konten berguna."),
        K("Hook pada video pendek berfungsi untuk …", "Menghentikan orang dari scroll di detik awal", ["Menambah durasi", "Menambah hashtag", "Mengganti musik"], "Tanpa hook, penonton langsung lewat."),
        K("Membeli pengikut berisiko karena …", "Angkanya palsu dan akun bisa dibatasi", ["Terlalu mahal", "Membuat akun terverifikasi", "Menambah penjualan"], "Pengikut palsu tidak berinteraksi dan merusak data."),
      ],
    },
    {
      id: "pilar",
      judul: "Pilar konten dan kalender",
      menit: 18,
      isi: [
        P("Pilar konten adalah 3 sampai 5 tema besar yang diulang secara bergilir. Dengan pilar, kamu tidak bingung setiap hari harus posting apa, dan akun terasa konsisten."),
        CONTOH(
          "Contoh pilar untuk kedai kopi lokal",
          "Posting acak: foto kopi, ucapan hari besar, promo, foto kopi lagi.",
          "Edukasi (cara seduh, beda biji kopi), Di balik layar (barista, proses sangrai), Promo dan menu baru, Komunitas (foto pelanggan, acara), Hiburan (meme kopi yang relevan).",
          "Pilar membuat feed bervariasi tetapi tetap terarah.",
        ),
        LANGKAH([
          ["Tentukan tujuan bulan ini", "Misalnya memperkenalkan menu baru atau menambah pesanan lewat DM."],
          ["Tentukan frekuensi", "Misalnya 3 feed, 2 reels, dan story harian per minggu. Konsisten lebih penting daripada sering."],
          ["Isi kalender di spreadsheet", "Kolom: tanggal, pilar, format, ide, caption, status, tautan desain."],
          ["Minta persetujuan klien", "Kirim kalender di awal bulan, bukan konten satu per satu setiap hari."],
          ["Jadwalkan", "Pakai Meta Business Suite atau fitur jadwal di TikTok."],
        ]),
        LATIHAN(
          "Buat 4 pilar konten untuk toko online sepatu lari lokal.",
          "1) Edukasi lari (pemanasan, memilih ukuran, cara merawat sepatu). 2) Produk (fitur, perbandingan model, menu baru). 3) Komunitas (cerita pelari, ajang lari lokal, repost pelanggan). 4) Promo (flash sale, bundling, gratis ongkir).",
        ),
      ],
      kuis: [
        K("Pilar konten adalah …", "Tema besar yang diulang bergiliran", ["Jumlah posting per hari", "Nama akun", "Jenis kamera"], "Pilar memberi struktur agar akun konsisten."),
        K("Mengapa kalender dikirim ke klien di awal bulan?", "Agar persetujuan dilakukan sekaligus dan pekerjaan efisien", ["Agar klien sibuk", "Karena diwajibkan Instagram", "Agar tidak perlu membuat laporan"], "Persetujuan sekaligus menghindari bolak-balik setiap hari."),
        K("Lebih penting mana untuk akun brand kecil?", "Konsisten dengan frekuensi yang realistis", ["Posting 10 kali sehari lalu berhenti", "Posting hanya saat promo", "Menyalin konten akun lain"], "Konsistensi membangun kebiasaan audiens."),
      ],
    },
    {
      id: "caption",
      judul: "Caption dan suara brand",
      menit: 15,
      isi: [
        P("Suara brand (brand voice) adalah kepribadian brand dalam tulisan: santai atau formal, pakai emoji atau tidak, menyapa 'kamu' atau 'Anda'. Admin harus menulis seolah brand itu satu orang yang konsisten."),
        POIN("Struktur caption yang efektif", [
          "Baris pertama: hook, karena hanya baris ini yang terlihat sebelum 'selengkapnya'",
          "Isi: nilai atau cerita singkat",
          "Ajakan: simpan, komentar, klik tautan di bio, atau DM",
          "Hashtag secukupnya dan relevan",
        ]),
        CONTOH(
          "Caption menu baru",
          "Menu baru nih guys!!! Es kopi pandan. Yuk cobain!!! #kopi #kopikekinian #kopiindonesia #enak #mantap",
          "Pernah coba kopi yang rasanya kayak kue pandan nenek? Es Kopi Pandan kami pakai pandan asli yang direbus tiap pagi, bukan perisa. Mulai hari ini di semua cabang. Tag teman yang wajib kamu ajak minggu ini.",
          "Caption kedua punya hook, detail yang membedakan, dan ajakan yang jelas.",
        ),
        KOTAK("tips", "Panduan suara brand", "Minta atau buat dokumen satu halaman: 3 kata sifat brand (misalnya hangat, jujur, jenaka), kata yang dipakai, kata yang dihindari, dan contoh balasan komentar."),
      ],
      kuis: [
        K("Bagian caption yang paling penting adalah …", "Baris pertama, karena terlihat sebelum dipotong", ["Hashtag terakhir", "Emoji", "Tanda tangan"], "Jika baris pertama tidak menarik, sisanya tidak dibaca."),
        K("Suara brand adalah …", "Kepribadian brand yang konsisten dalam tulisan", ["Musik di video", "Logo", "Warna desain"], "Brand voice menjaga brand terasa seperti satu orang."),
        K("Hashtag sebaiknya …", "Secukupnya dan relevan dengan konten", ["Sebanyak mungkin", "Selalu tidak relevan agar menjangkau semua orang", "Tidak pernah dipakai"], "Hashtag relevan membantu orang yang tepat menemukan konten."),
      ],
    },
    {
      id: "komunitas",
      judul: "Membalas komentar dan menangani keluhan",
      menit: 12,
      isi: [
        P("Kolom komentar adalah etalase layanan pelanggan yang dilihat semua orang. Cara admin membalas keluhan bisa menaikkan atau menjatuhkan kepercayaan."),
        LANGKAH([
          ["Balas cepat", "Akui keluhan dalam beberapa jam kerja, walau solusinya belum ada."],
          ["Minta maaf atas pengalamannya", "Tanpa menyalahkan pelanggan."],
          ["Pindahkan detail ke DM", "Nomor pesanan dan data pribadi jangan dibahas di publik."],
          ["Tindak lanjuti", "Setelah selesai, kembali ke komentar dan tulis bahwa masalahnya sudah ditangani."],
        ]),
        CONTOH(
          "Balasan keluhan pesanan terlambat",
          "Sabar ya kak, ekspedisinya lagi lambat bukan salah kami.",
          "Maaf ya Kak, pesanannya belum sampai. Boleh kirim nomor pesanan lewat DM? Kami cek langsung ke ekspedisi dan kabari hari ini.",
          "Balasan kedua mengambil tanggung jawab dan memberi langkah jelas.",
        ),
        KOTAK("awas", "Kapan perlu eskalasi", "Ancaman hukum, isu keamanan produk, atau keluhan yang viral harus segera diteruskan ke klien sebelum dibalas."),
      ],
      kuis: [
        K("Data seperti nomor pesanan sebaiknya dibahas …", "Melalui DM", ["Di kolom komentar", "Di story", "Di bio"], "Data pribadi tidak boleh dibahas di publik."),
        K("Keluhan yang harus segera diteruskan ke klien adalah …", "Keluhan tentang keamanan produk", ["Pertanyaan jam buka", "Pujian pelanggan", "Pertanyaan harga"], "Isu keamanan dan hukum butuh keputusan pemilik brand."),
        K("Langkah setelah masalah pelanggan selesai adalah …", "Memberi kabar di komentar bahwa sudah ditangani", ["Menghapus komentarnya", "Memblokir pelanggan", "Tidak melakukan apa-apa"], "Penutupan di publik menunjukkan brand bertanggung jawab."),
      ],
    },
    {
      id: "insight",
      judul: "Membaca insight dan membuat laporan",
      menit: 15,
      isi: [
        P("Klien membayar untuk hasil. Laporan bulanan menunjukkan apa yang berhasil, apa yang tidak, dan apa rencana bulan depan."),
        POIN("Angka yang biasa dilaporkan", [
          "Reach dan impressions",
          "Engagement rate: total interaksi dibagi reach, dikali 100%",
          "Pertumbuhan pengikut",
          "Klik tautan, DM masuk, atau pesanan dari media sosial",
          "Tiga konten terbaik dan terburuk",
        ]),
        LATIHAN(
          "Sebuah reels menjangkau 8.000 akun dan mendapat 320 suka, 40 komentar, 120 simpan, dan 20 bagikan. Berapa engagement rate-nya terhadap reach?",
          "Total interaksi = 320 + 40 + 120 + 20 = 500. Engagement rate = 500 / 8.000 × 100% = 6,25%.",
        ),
        CONTOH(
          "Kesimpulan laporan",
          "Bulan ini engagement naik. Terima kasih.",
          "Reels edukasi rata-rata menjangkau 3 kali lipat dibanding foto produk dan menghasilkan 18 DM pesanan. Bulan depan saya usul porsi reels edukasi naik dari 2 menjadi 4 per bulan.",
          "Laporan yang baik selalu diakhiri rekomendasi berbasis data.",
        ),
      ],
      kuis: [
        K("Engagement rate dihitung dengan …", "Total interaksi dibagi reach, dikali 100%", ["Pengikut dibagi unggahan", "Suka dikali komentar", "Reach dikurangi pengikut"], "Rumus ini menunjukkan seberapa banyak yang melihat juga berinteraksi."),
        K("Laporan bulanan sebaiknya ditutup dengan …", "Rekomendasi untuk bulan depan berdasarkan data", ["Ucapan terima kasih saja", "Daftar hashtag", "Foto profil baru"], "Rekomendasi menunjukkan kamu berpikir strategis."),
        K("Angka yang paling dekat dengan tujuan bisnis adalah …", "DM pesanan atau klik ke toko", ["Jumlah emoji", "Panjang caption", "Jumlah hashtag"], "Klien ingin tahu dampak ke penjualan."),
      ],
    },
  ],
  tugasAkhir: {
    judul: "Tugas akhir: rencana konten sebulan",
    brief: "Pilih satu UMKM. Buat 4 pilar konten, kalender 4 minggu (minimal 12 konten), 3 contoh caption lengkap, dan satu template laporan bulanan.",
    kriteria: ["Pilar sesuai tujuan bisnis", "Format bervariasi", "Caption punya hook dan ajakan", "Laporan memuat angka dan rekomendasi"],
  },
};
