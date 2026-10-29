import { P, POIN, ISTILAH, CONTOH, KOTAK, LANGKAH, LATIHAN, K } from "./_blok.js";

export default {
  slug: "customer-support",
  judul: "Kelas Dasar Customer Support",
  ringkas: "Apa itu customer support, saluran dan sistem tiket, rumus membalas pelanggan, menghadapi pelanggan marah, metrik yang dinilai, sampai persiapan melamar.",
  untuk: "Pemula yang sabar, suka membantu, dan ingin bekerja remote dengan jadwal shift.",
  durasi: "± 1,5 jam",
  hasil: [
    "Paham cara kerja tim support dan sistem tiket",
    "Bisa menulis balasan yang empatik, jelas, dan tuntas",
    "Bisa menenangkan pelanggan marah dengan langkah yang terstruktur",
    "Paham metrik seperti FRT, CSAT, dan resolution rate",
  ],
  bab: [
    {
      id: "apa-itu",
      judul: "Apa itu customer support?",
      menit: 10,
      isi: [
        P("Customer support (CS) membantu pelanggan yang punya pertanyaan atau masalah dengan produk atau layanan. Di perusahaan digital, sebagian besar pekerjaannya dilakukan lewat chat, email, dan media sosial, sehingga bisa dikerjakan dari rumah."),
        POIN("Contoh pekerjaan CS remote", [
          "Menjawab pertanyaan cara memakai aplikasi",
          "Membantu masalah pembayaran, pengembalian dana, atau pengiriman",
          "Mencatat bug dan meneruskannya ke tim teknis",
          "Menulis artikel bantuan (FAQ)",
        ]),
        ISTILAH([
          ["Tiket", "Satu kasus pelanggan yang dicatat di sistem, lengkap dengan riwayatnya."],
          ["Helpdesk", "Aplikasi untuk mengelola tiket, misalnya Zendesk, Freshdesk, Intercom."],
          ["Eskalasi", "Meneruskan kasus ke tim atau atasan yang lebih berwenang."],
          ["Macro/template", "Balasan siap pakai untuk pertanyaan yang sering muncul."],
          ["Tier 1 / Tier 2", "Tingkat dukungan: tier 1 menangani kasus umum, tier 2 kasus teknis."],
        ]),
        KOTAK("fakta", "Shift dan zona waktu", "Banyak perusahaan global membuka support 24 jam. Pekerja Indonesia sering mengisi shift malam untuk pelanggan Amerika atau shift siang untuk Australia. Tanyakan jadwalnya sejak wawancara."),
      ],
      kuis: [
        K("Tiket dalam customer support adalah …", "Catatan satu kasus pelanggan beserta riwayatnya", ["Tiket pesawat", "Bonus bulanan", "Kupon diskon"], "Sistem tiket membuat setiap kasus terlacak."),
        K("Eskalasi berarti …", "Meneruskan kasus ke pihak yang lebih berwenang", ["Menutup tiket", "Memberi diskon", "Menghapus pesan"], "Eskalasi dilakukan saat kasus di luar wewenangmu."),
        K("Zendesk dan Freshdesk termasuk …", "Aplikasi helpdesk", ["Aplikasi desain", "Media sosial", "Aplikasi bank"], "Keduanya dipakai untuk mengelola tiket pelanggan."),
      ],
    },
    {
      id: "rumus-balasan",
      judul: "Rumus balasan yang baik",
      menit: 18,
      isi: [
        P("Balasan yang baik membuat pelanggan merasa didengar dan masalahnya selesai dalam sesedikit mungkin pesan. Pakai rumus sederhana: sapa, akui, selesaikan, pastikan."),
        LANGKAH([
          ["Sapa dengan nama", "'Halo Kak Dina' terasa jauh lebih manusiawi daripada 'Halo pelanggan'."],
          ["Akui masalahnya", "Ulangi singkat agar pelanggan tahu kamu paham: 'Saldo sudah terpotong tetapi pesanan belum muncul, ya.'"],
          ["Selesaikan atau jelaskan langkahnya", "Berikan solusi atau langkah bernomor. Jika butuh waktu, sebutkan perkiraan waktunya."],
          ["Pastikan", "Tanyakan apakah ada lagi yang bisa dibantu, atau jelaskan apa yang terjadi selanjutnya."],
        ]),
        CONTOH(
          "Balasan pertanyaan lupa kata sandi",
          "Silakan reset password.",
          "Halo Kak Rani, saya bantu, ya. Caranya:\n1. Buka halaman masuk, ketuk 'Lupa kata sandi'.\n2. Masukkan email yang terdaftar.\n3. Buka email dari kami (cek juga folder spam), lalu ketuk tautan reset dalam 30 menit.\nKalau email belum masuk dalam 5 menit, balas pesan ini dan saya kirim ulang dari sistem.",
          "Balasan kedua lengkap, ramah, dan mencegah pertanyaan susulan.",
        ),
        KOTAK("tips", "Satu balasan, satu penyelesaian", "Coba jawab semua kemungkinan pertanyaan susulan dalam balasan pertama. Semakin sedikit bolak-balik, semakin puas pelanggan."),
      ],
      kuis: [
        K("Mengapa perlu mengulang masalah pelanggan secara singkat?", "Agar pelanggan tahu masalahnya dipahami dengan benar", ["Agar pesan lebih panjang", "Agar terlihat formal", "Karena diwajibkan aplikasi"], "Pengulangan singkat mencegah salah paham."),
        K("Jika solusi butuh waktu, CS sebaiknya …", "Menyebutkan perkiraan waktu penyelesaian", ["Diam sampai selesai", "Menutup tiket", "Meminta pelanggan menunggu tanpa kepastian"], "Kepastian waktu mengurangi kecemasan pelanggan."),
        K("Balasan yang paling baik adalah yang …", "Menyelesaikan masalah dengan sesedikit mungkin bolak-balik", ["Paling pendek", "Paling banyak emoji", "Paling formal"], "Efisiensi dan kejelasan adalah ukuran utama."),
      ],
    },
    {
      id: "pelanggan-marah",
      judul: "Menghadapi pelanggan marah",
      menit: 15,
      isi: [
        P("Pelanggan yang marah biasanya marah pada situasinya, bukan pada kamu. Tugasmu adalah meredakan emosinya lalu mengubah percakapan menjadi pencarian solusi."),
        POIN("Kalimat yang meredakan", [
          "'Saya paham ini bikin kesal, apalagi uangnya sudah terpotong.'",
          "'Terima kasih sudah menjelaskan dengan detail, ini sangat membantu saya mengecek.'",
          "'Saya akan pantau kasus ini sampai selesai.'",
        ]),
        POIN("Kalimat yang memperburuk", [
          "'Itu bukan kesalahan kami.'",
          "'Sesuai kebijakan, kami tidak bisa.' (tanpa alternatif)",
          "'Tenang dulu, Kak.'",
        ]),
        CONTOH(
          "Pelanggan: 'Udah 3 hari refund belum masuk!!! Penipu!'",
          "Refund memang butuh 3 sampai 7 hari kerja, mohon bersabar.",
          "Maaf banget Kak, menunggu 3 hari tanpa kabar pasti bikin cemas. Saya sudah cek: refund Rp185.000 diproses tanggal 12 dan bank biasanya butuh sampai 7 hari kerja. Saya catat untuk saya cek lagi Jumat. Kalau sampai Jumat belum masuk, saya bantu eskalasi ke tim keuangan.",
          "Balasan kedua mengakui perasaan, memberi data, dan menjanjikan tindak lanjut yang spesifik.",
        ),
        KOTAK("awas", "Batas yang perlu dijaga", "Jika pelanggan mengancam atau memaki secara pribadi, kamu boleh memberi peringatan sopan dan mengikuti prosedur perusahaan untuk mengakhiri percakapan atau eskalasi."),
        LATIHAN(
          "Pelanggan menulis: 'Paket saya rusak, ini kedua kalinya! Kecewa banget.' Tulis balasanmu.",
          "Maaf sekali, Kak, menerima paket rusak dua kali tentu sangat mengecewakan. Boleh kirim foto paket dan nomor pesanannya? Setelah saya terima, saya proses penggantian hari ini juga dan saya minta tim gudang memakai kemasan tambahan untuk pesanan Kakak.",
        ),
      ],
      kuis: [
        K("Kalimat mana yang meredakan pelanggan marah?", "Saya paham ini bikin kesal, saya bantu cek sekarang", ["Itu bukan kesalahan kami", "Tenang dulu, Kak", "Sesuai kebijakan kami tidak bisa"], "Mengakui perasaan lalu bergerak ke solusi meredakan emosi."),
        K("Janji tindak lanjut yang baik adalah …", "Spesifik: kapan dan apa yang akan dilakukan", ["Nanti dikabari", "Ditunggu saja", "Sedang diproses"], "Janji spesifik memberi kepastian."),
        K("Saat pelanggan memaki secara pribadi, CS sebaiknya …", "Memberi peringatan sopan dan mengikuti prosedur perusahaan", ["Membalas memaki", "Langsung memblokir tanpa prosedur", "Menyebarkan ke media sosial"], "Profesionalisme tetap dijaga dan prosedur diikuti."),
      ],
    },
    {
      id: "metrik",
      judul: "Metrik yang dinilai",
      menit: 12,
      isi: [
        P("Kinerja CS diukur dengan angka. Memahaminya membantumu bekerja sesuai harapan dan menjawab pertanyaan wawancara dengan meyakinkan."),
        ISTILAH([
          ["FRT (first response time)", "Waktu dari pesan pelanggan masuk sampai balasan pertama."],
          ["Resolution time", "Waktu sampai masalah benar-benar selesai."],
          ["CSAT", "Skor kepuasan pelanggan, biasanya dari survei 1 sampai 5 setelah percakapan."],
          ["FCR (first contact resolution)", "Persentase kasus yang selesai di kontak pertama."],
          ["QA score", "Nilai kualitas dari tim QA yang memeriksa contoh percakapanmu."],
        ]),
        LATIHAN(
          "Dari 200 survei, 168 memberi nilai 4 atau 5. Berapa CSAT-nya jika CSAT dihitung dari persentase nilai 4 dan 5?",
          "168 / 200 × 100% = 84%.",
        ),
        KOTAK("tips", "Cepat tetapi tuntas", "Mengejar FRT dengan balasan asal-asalan justru menurunkan CSAT dan FCR. Balas cepat untuk mengakui, lalu selesaikan dengan teliti."),
      ],
      kuis: [
        K("FRT mengukur …", "Waktu sampai balasan pertama", ["Jumlah pelanggan", "Nilai kepuasan", "Jumlah tiket ditutup"], "First response time menunjukkan kecepatan respons awal."),
        K("CSAT menunjukkan …", "Kepuasan pelanggan setelah dilayani", ["Kecepatan mengetik", "Jumlah eskalasi", "Gaji agen"], "CSAT biasanya dari survei singkat."),
        K("Mengejar FRT dengan balasan asal-asalan berisiko …", "Menurunkan CSAT dan FCR", ["Menaikkan semua metrik", "Tidak berpengaruh", "Menaikkan gaji"], "Kualitas tetap harus dijaga."),
      ],
    },
    {
      id: "pengetahuan",
      judul: "Menguasai produk dan basis pengetahuan",
      menit: 10,
      isi: [
        P("CS yang hebat tidak menghafal semua jawaban, tetapi tahu di mana mencarinya dengan cepat dan tahu kapan harus bertanya."),
        LANGKAH([
          ["Pakai produknya sendiri", "Daftar akun, coba fitur utama, dan alami alurnya seperti pelanggan."],
          ["Baca basis pengetahuan", "Artikel bantuan, kebijakan refund, dan daftar masalah yang sedang terjadi."],
          ["Buat catatan pribadi", "Simpan jawaban terbaik dan kasus unik untuk dipakai lagi."],
          ["Laporkan pola", "Jika pertanyaan yang sama muncul 10 kali sehari, usulkan artikel FAQ atau perbaikan produk."],
        ]),
        KOTAK("tips", "Laporan bug yang baik", "Tulis: langkah untuk mengulang masalah, yang diharapkan, yang terjadi, perangkat dan versi aplikasi, serta tangkapan layar. Tim teknis akan sangat menghargainya."),
      ],
      kuis: [
        K("Cara terbaik mempelajari produk adalah …", "Memakai produk itu sendiri seperti pelanggan", ["Menghafal semua artikel", "Menunggu pelanggan bertanya", "Bertanya ke teman"], "Pengalaman langsung membuatmu paham masalah pelanggan."),
        K("Laporan bug yang baik memuat …", "Langkah mengulang masalah, hasil yang diharapkan, dan yang terjadi", ["Hanya kata 'error'", "Nama pelanggan saja", "Emoji marah"], "Detail ini membantu tim teknis mereproduksi masalah."),
        K("Jika satu pertanyaan muncul berulang kali, CS sebaiknya …", "Mengusulkan artikel FAQ atau perbaikan", ["Mengabaikannya", "Menutup semua tiketnya", "Mengubah kebijakan sendiri"], "Melaporkan pola mengurangi beban tim dan pelanggan."),
      ],
    },
    {
      id: "melamar",
      judul: "Persiapan melamar kerja CS remote",
      menit: 12,
      isi: [
        POIN("Yang biasa diuji saat seleksi", [
          "Tes mengetik (sering diminta minimal sekitar 40 kata per menit)",
          "Tes menulis balasan untuk kasus pelanggan",
          "Tes bahasa Inggris untuk perusahaan global",
          "Wawancara dengan pertanyaan situasional",
          "Pemeriksaan perangkat dan koneksi internet",
        ]),
        POIN("Pertanyaan wawancara yang sering muncul", [
          "Ceritakan saat kamu membantu orang yang sedang kesal",
          "Bagaimana jika kamu tidak tahu jawaban pertanyaan pelanggan?",
          "Bagaimana kamu menjaga kualitas saat antrean chat menumpuk?",
        ]),
        KOTAK("tips", "Jawab dengan STAR", "Situation, Task, Action, Result. Contoh: 'Saat jadi kasir (S), ada pembeli marah karena struk salah (T). Saya minta maaf, mengecek ulang, dan memperbaiki transaksi (A). Ia tenang dan kembali belanja minggu berikutnya (R).'"),
        KOTAK("tips", "Langkah berikutnya", "Coba latihan praktik Customer Support di Jobly untuk merasakan tiket sungguhan dan penilaian seperti QA."),
      ],
      kuis: [
        K("Kerangka STAR terdiri dari …", "Situation, Task, Action, Result", ["Start, Talk, Act, Rest", "Skill, Team, Attitude, Role", "Simple, True, Accurate, Real"], "STAR membantu menjawab pertanyaan perilaku secara terstruktur."),
        K("Jika tidak tahu jawaban pelanggan, CS sebaiknya …", "Mengakui, mencari di basis pengetahuan atau bertanya ke tim, lalu kembali dengan jawaban", ["Mengarang jawaban", "Mengabaikan pesan", "Menutup tiket"], "Jawaban salah lebih merugikan daripada jawaban yang sedikit lebih lambat."),
        K("Pemeriksaan perangkat dan internet dilakukan karena …", "Pekerjaan remote bergantung pada koneksi yang stabil", ["Perusahaan ingin membeli laptopmu", "Formalitas saja", "Untuk menentukan seragam"], "Gangguan koneksi langsung memengaruhi pelanggan."),
      ],
    },
  ],
  tugasAkhir: {
    judul: "Tugas akhir: tiga tiket",
    brief: "Tulis balasan untuk tiga kasus: (1) pelanggan lupa cara membatalkan langganan, (2) pelanggan marah karena tertagih dua kali, (3) pelanggan melaporkan aplikasi keluar sendiri saat membayar. Untuk kasus 3, tulis juga laporan bug ke tim teknis.",
    kriteria: ["Sapa, akui, selesaikan, pastikan", "Empati tanpa menyalahkan", "Langkah jelas dan bernomor", "Laporan bug lengkap"],
  },
};
