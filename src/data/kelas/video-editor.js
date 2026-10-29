import { P, POIN, ISTILAH, CONTOH, KOTAK, LANGKAH, LATIHAN, K } from "./_blok.js";

export default {
  slug: "video-editor",
  judul: "Kelas Dasar Video Editing",
  ringkas: "Apa yang dikerjakan video editor, alur kerja dari footage sampai ekspor, teknik potong, audio dan subtitle, video pendek yang ditonton sampai habis, sampai bekerja dengan klien.",
  untuk: "Pemula yang suka video dan ingin mengedit untuk kreator atau brand.",
  durasi: "± 1,5 jam",
  hasil: [
    "Paham alur kerja editing dan istilah dasarnya",
    "Bisa memotong video agar ritmenya enak ditonton",
    "Bisa merapikan audio, menambah musik, dan subtitle",
    "Bisa menyusun video pendek dengan hook dan retensi yang baik",
  ],
  bab: [
    {
      id: "apa-itu",
      judul: "Apa itu video editor?",
      menit: 10,
      isi: [
        P("Video editor menyusun rekaman mentah (footage) menjadi video yang enak ditonton dan menyampaikan pesan. Pekerjaannya lebih dari memotong: mengatur ritme, memilih bagian terbaik, merapikan suara, menambah teks, dan menjaga penonton tetap menonton."),
        POIN("Jenis pekerjaan yang banyak dicari", [
          "Video pendek untuk TikTok, Reels, dan Shorts",
          "Video YouTube panjang untuk kreator",
          "Potongan podcast menjadi klip pendek",
          "Video iklan produk",
          "Video edukasi dan kursus online",
        ]),
        ISTILAH([
          ["Footage", "Rekaman mentah sebelum diedit."],
          ["Timeline", "Area kerja tempat klip disusun berurutan."],
          ["Cut", "Potongan antar klip."],
          ["B-roll", "Rekaman pendukung yang ditempel di atas pembicara untuk menjelaskan atau memberi variasi."],
          ["Aspect ratio", "Perbandingan lebar dan tinggi: 16:9 (YouTube), 9:16 (video pendek), 1:1 (persegi)."],
          ["Render/ekspor", "Proses mengubah proyek menjadi file video jadi."],
        ]),
      ],
      kuis: [
        K("B-roll adalah …", "Rekaman pendukung yang ditempel di atas pembicara", ["Musik latar", "Judul video", "Rekaman yang rusak"], "B-roll memberi variasi visual dan membantu menjelaskan."),
        K("Aspect ratio untuk video pendek vertikal adalah …", "9:16", ["16:9", "4:3", "21:9"], "Video vertikal di ponsel memakai 9:16."),
        K("Tugas utama video editor adalah …", "Menyusun footage menjadi video yang enak ditonton dan jelas pesannya", ["Hanya menambah efek", "Merekam video", "Membeli kamera"], "Editing adalah bercerita lewat susunan gambar dan suara."),
      ],
    },
    {
      id: "alur",
      judul: "Alur kerja dari footage sampai ekspor",
      menit: 15,
      isi: [
        LANGKAH([
          ["Rapikan file", "Buat folder: footage, audio, musik, grafis, ekspor. Beri nama yang jelas. Editor yang rapi bekerja lebih cepat."],
          ["Tonton semua footage", "Tandai bagian terbaik. Untuk video bicara, catat menit mulai setiap poin penting."],
          ["Rough cut", "Susun urutan cerita dan buang bagian yang tidak perlu, tanpa memikirkan efek."],
          ["Fine cut", "Rapikan ritme, potong jeda, tambah B-roll."],
          ["Audio", "Ratakan volume suara, kurangi bising, tambah musik."],
          ["Teks dan grafis", "Subtitle, judul, dan penanda penting."],
          ["Warna", "Koreksi kecerahan dan warna agar konsisten."],
          ["Ekspor dan cek", "Tonton ulang dari awal sampai akhir sebelum dikirim."],
        ]),
        POIN("Aplikasi yang umum", [
          "CapCut: cepat untuk video pendek, populer di kalangan kreator",
          "DaVinci Resolve: versi gratisnya sudah sangat lengkap",
          "Adobe Premiere Pro: standar banyak agensi",
          "Final Cut Pro: populer di pengguna Mac",
        ]),
        KOTAK("tips", "Rough cut dulu, efek belakangan", "Pemula sering sibuk memberi transisi sebelum ceritanya jadi. Susun ceritanya dulu; efek hanya penyedap."),
      ],
      kuis: [
        K("Rough cut adalah tahap …", "Menyusun urutan cerita kasar tanpa efek", ["Ekspor akhir", "Koreksi warna", "Menambah musik"], "Rough cut fokus pada struktur cerita."),
        K("Mengapa file perlu dirapikan dalam folder?", "Agar kerja lebih cepat dan file tidak hilang", ["Agar video lebih tajam", "Karena aplikasi mewajibkan", "Agar ukuran file kecil"], "Manajemen file yang baik menghemat waktu."),
        K("Langkah terakhir sebelum mengirim video adalah …", "Menonton ulang hasil ekspor dari awal sampai akhir", ["Menghapus footage", "Langsung mengirim", "Menambah transisi"], "Pengecekan akhir menangkap kesalahan yang terlewat."),
      ],
    },
    {
      id: "memotong",
      judul: "Seni memotong dan ritme",
      menit: 15,
      isi: [
        P("Ritme membuat penonton bertahan. Video yang terasa lambat biasanya bukan karena durasinya, tetapi karena banyak jeda dan kalimat yang diulang."),
        POIN("Teknik potong yang wajib", [
          "Jump cut: memotong jeda dan 'eee' pada video bicara",
          "J-cut dan L-cut: suara klip berikutnya masuk lebih dulu (J) atau suara klip sebelumnya berlanjut (L) agar transisi terasa halus",
          "Cut on action: memotong saat ada gerakan agar perpindahan tidak terasa",
          "Punch-in: memperbesar gambar sedikit untuk penekanan atau menyamarkan jump cut",
        ]),
        CONTOH(
          "Video tips 60 detik",
          "Pembicara membuka dengan 'Halo semuanya, kembali lagi di channel saya, jangan lupa subscribe…' selama 12 detik sebelum masuk ke tips.",
          "Dibuka langsung dengan hasil: 'Tiga trik ini bikin CV-mu dipanggil HR.' Salam dan ajakan subscribe dipindah ke akhir atau dibuang.",
          "Pembuka yang langsung ke inti menjaga penonton tidak menggeser layar.",
        ),
        KOTAK("awas", "Transisi berlebihan", "Transisi berputar atau berkilau di setiap potongan membuat video terlihat amatir. Potongan langsung (straight cut) sudah cukup untuk sebagian besar video."),
      ],
      kuis: [
        K("Jump cut biasanya dipakai untuk …", "Memotong jeda dan kata pengisi pada video bicara", ["Mengganti musik", "Menambah subtitle", "Mengubah warna"], "Jump cut membuat video bicara lebih padat."),
        K("L-cut adalah …", "Suara klip sebelumnya tetap berlanjut saat gambar sudah berganti", ["Potongan berbentuk huruf L", "Efek zoom", "Subtitle di kiri bawah"], "L-cut membuat perpindahan adegan terasa halus."),
        K("Untuk sebagian besar video, transisi terbaik adalah …", "Potongan langsung", ["Transisi berputar", "Efek kilat di setiap potongan", "Layar hitam 3 detik"], "Potongan langsung bersih dan profesional."),
      ],
    },
    {
      id: "audio-teks",
      judul: "Audio, musik, dan subtitle",
      menit: 15,
      isi: [
        P("Penonton masih mau menonton gambar yang biasa saja, tetapi cepat pergi jika suaranya buruk. Audio sering lebih penting daripada gambar."),
        POIN("Checklist audio", [
          "Suara pembicara jelas dan volumenya rata dari awal sampai akhir",
          "Musik lebih pelan dari suara, terutama saat orang berbicara",
          "Kurangi bising latar dengan fitur noise reduction secukupnya",
          "Pakai musik yang lisensinya jelas, misalnya pustaka audio YouTube atau layanan berlisensi",
        ]),
        POIN("Subtitle yang enak dibaca", [
          "Maksimal 2 baris, sekitar 5 sampai 8 kata per tampilan untuk video pendek",
          "Letakkan di area aman agar tidak tertutup tombol aplikasi",
          "Kontras kuat, misalnya teks putih bergaris tepi gelap",
          "Periksa ejaan: subtitle otomatis sering salah nama dan istilah",
        ]),
        KOTAK("awas", "Hak cipta musik", "Memakai lagu populer tanpa lisensi bisa membuat video klien dibisukan, diblokir, atau pendapatannya diambil pemilik hak cipta. Selalu tanyakan sumber musik yang boleh dipakai."),
      ],
      kuis: [
        K("Saat pembicara berbicara, musik latar sebaiknya …", "Lebih pelan dari suara pembicara", ["Lebih keras", "Sama keras", "Selalu dimatikan"], "Suara pembicara adalah prioritas."),
        K("Subtitle otomatis perlu …", "Diperiksa ulang ejaan dan istilahnya", ["Langsung dipakai", "Dihapus", "Diterjemahkan otomatis lagi"], "Pengenalan suara otomatis sering salah."),
        K("Risiko memakai lagu tanpa lisensi adalah …", "Video dibisukan, diblokir, atau pendapatannya diambil", ["Video jadi viral", "Kualitas naik", "Tidak ada risiko"], "Hak cipta musik dilindungi dan dipantau sistem platform."),
      ],
    },
    {
      id: "video-pendek",
      judul: "Video pendek yang ditonton sampai habis",
      menit: 15,
      isi: [
        P("Di video pendek, retensi (berapa lama orang menonton) adalah segalanya. Struktur yang sering berhasil: hook, isi padat, penutup yang memancing tindakan."),
        LANGKAH([
          ["Hook (0 sampai 3 detik)", "Tunjukkan hasil, ajukan pertanyaan, atau mulai di tengah aksi."],
          ["Isi", "Satu ide per video. Ganti visual setiap beberapa detik: B-roll, punch-in, atau teks."],
          ["Penutup", "Ajakan sederhana: simpan, ikuti untuk bagian 2, atau komentar."],
        ]),
        LATIHAN(
          "Kamu mendapat footage podcast 40 menit. Bagaimana memilih 3 klip pendek?",
          "Cari momen dengan kalimat yang bisa berdiri sendiri: pendapat yang kuat, cerita lucu atau mengejutkan, atau tips yang jelas. Potong 30 sampai 60 detik, mulai tepat di kalimat paling kuat, ubah ke 9:16 dengan wajah pembicara di tengah, lalu tambah subtitle dan judul di atas.",
        ),
        ISTILAH([
          ["Retensi", "Persentase durasi video yang ditonton rata-rata."],
          ["Hook", "Pembuka yang membuat orang berhenti scroll."],
          ["Safe area", "Area layar yang tidak tertutup elemen aplikasi."],
        ]),
      ],
      kuis: [
        K("Bagian paling menentukan di video pendek adalah …", "Tiga detik pertama", ["Detik terakhir", "Musik penutup", "Logo di akhir"], "Hook menentukan apakah orang lanjut menonton."),
        K("Klip podcast yang baik untuk video pendek adalah yang …", "Bisa dipahami tanpa menonton keseluruhan podcast", ["Paling panjang", "Berisi salam pembuka", "Tanpa suara"], "Klip harus berdiri sendiri."),
        K("Retensi mengukur …", "Seberapa lama video ditonton rata-rata", ["Jumlah subscriber", "Ukuran file", "Jumlah komentar"], "Retensi tinggi menandakan video menarik."),
      ],
    },
    {
      id: "klien",
      judul: "Bekerja dengan klien dan portofolio",
      menit: 12,
      isi: [
        POIN("Yang perlu disepakati", [
          "Durasi dan format video (rasio, resolusi)",
          "Gaya: contoh video referensi",
          "Siapa yang menyediakan musik, logo, dan font",
          "Jumlah revisi dan cara memberi komentar (misalnya Frame.io atau Google Drive dengan timestamp)",
          "Tenggat dan cara pengiriman file",
        ]),
        KOTAK("tips", "Minta komentar dengan timestamp", "Minta klien menulis 'di 0:42 teksnya terlalu cepat' alih-alih 'bagian tengah kurang enak'. Revisi jadi jauh lebih cepat."),
        LANGKAH([
          ["Buat showreel 30 sampai 60 detik", "Gabungan potongan terbaikmu."],
          ["Siapkan 3 contoh sebelum-sesudah", "Footage mentah dan hasil editanmu."],
          ["Tawarkan ke kreator kecil", "Banyak kreator YouTube dan TikTok mencari editor tetap."],
        ]),
      ],
      kuis: [
        K("Cara memberi komentar revisi video yang paling efisien adalah …", "Dengan timestamp, misalnya 'di 0:42'", ["'Kurang greget'", "Telepon panjang tanpa catatan", "Mengirim ulang semua footage"], "Timestamp menunjukkan bagian yang tepat."),
        K("Showreel adalah …", "Gabungan potongan karya terbaik dalam video singkat", ["Daftar harga", "Kontrak kerja", "Footage mentah"], "Showreel adalah portofolio cepat untuk editor."),
        K("Contoh sebelum-sesudah berguna untuk …", "Menunjukkan dampak editanmu", ["Menambah durasi", "Mengurangi revisi", "Menghemat penyimpanan"], "Klien bisa melihat nilai yang kamu tambahkan."),
      ],
    },
  ],
  tugasAkhir: {
    judul: "Tugas akhir: satu video pendek",
    brief: "Rekam dirimu menjelaskan satu tips selama 2 sampai 3 menit tanpa naskah. Edit menjadi video 9:16 berdurasi 45 sampai 60 detik dengan hook, jump cut, minimal 3 B-roll, subtitle, dan musik berlisensi.",
    kriteria: ["Hook dalam 3 detik", "Tidak ada jeda panjang", "Audio jelas dan rata", "Subtitle di area aman dan bebas salah ketik"],
  },
};
