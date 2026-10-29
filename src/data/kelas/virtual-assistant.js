import { P, POIN, ISTILAH, CONTOH, KOTAK, LANGKAH, LATIHAN, K } from "./_blok.js";

export default {
  slug: "virtual-assistant",
  judul: "Kelas Dasar Virtual Assistant",
  ringkas: "Apa itu virtual assistant, tugas yang paling sering diminta, alat kerja wajib, cara mengelola email dan jadwal klien, komunikasi profesional, sampai menawarkan jasa.",
  untuk: "Pemula yang rapi, terorganisasi, dan ingin bekerja dari rumah.",
  durasi: "± 1,5 jam",
  hasil: [
    "Paham jenis-jenis VA dan tugas yang biasa diminta",
    "Bisa mengatur email, kalender, dan dokumen klien dengan sistem yang rapi",
    "Bisa menulis laporan harian dan pesan yang profesional",
    "Tahu cara menentukan paket jasa dan mencari klien pertama",
  ],
  bab: [
    {
      id: "apa-itu",
      judul: "Apa itu virtual assistant?",
      menit: 10,
      isi: [
        P("Virtual assistant (VA) adalah asisten yang membantu pekerjaan administratif, operasional, atau kreatif dari jarak jauh. Kliennya bisa pemilik usaha kecil, pelatih online, agen properti, sampai eksekutif perusahaan di luar negeri."),
        P("Bayangkan sekretaris atau staf admin, tetapi bekerja dari rumah dan sering melayani beberapa klien sekaligus. Tujuan utamanya satu: menghemat waktu klien agar ia bisa fokus pada pekerjaan yang menghasilkan uang."),
        POIN("Jenis VA yang umum", [
          "General/admin VA: email, jadwal, entri data, dokumen",
          "Social media VA: menjadwalkan posting dan membalas komentar",
          "E-commerce VA: mengunggah produk, mengurus pesanan, membalas chat pembeli",
          "Executive assistant: mendukung satu eksekutif secara penuh, termasuk perjalanan dinas",
          "VA spesialis: pembukuan, real estate, podcast, dan sebagainya",
        ]),
        ISTILAH([
          ["Klien retainer", "Klien yang membayar jumlah jam tetap setiap bulan."],
          ["SOP", "Prosedur standar tertulis, misalnya cara memproses pesanan."],
          ["Inbox zero", "Kebiasaan merapikan kotak masuk sampai semua email sudah ditangani."],
          ["Time zone overlap", "Jam kerja yang sama antara kamu dan klien di zona waktu berbeda."],
        ]),
      ],
      kuis: [
        K("Tujuan utama seorang VA adalah …", "Menghemat waktu klien agar ia fokus pada pekerjaan penting", ["Menggantikan pemilik usaha", "Menjual produk klien", "Membuat strategi bisnis"], "VA mengambil alih pekerjaan rutin sehingga klien bisa fokus pada hal bernilai tinggi."),
        K("Klien retainer adalah klien yang …", "Membayar jumlah jam tetap setiap bulan", ["Hanya sekali memakai jasa", "Tidak membayar", "Memberikan tip"], "Retainer memberi penghasilan stabil bagi VA."),
        K("Mengunggah produk ke marketplace dan membalas chat pembeli adalah tugas …", "E-commerce VA", ["Executive assistant", "Social media VA", "Penerjemah"], "Tugas tersebut khas untuk toko online."),
      ],
    },
    {
      id: "alat",
      judul: "Alat kerja yang wajib dikuasai",
      menit: 15,
      isi: [
        P("Hampir semua lowongan VA menyebut alat tertentu. Kabar baiknya, sebagian besar gratis dan bisa dipelajari dalam beberapa hari."),
        POIN("Alat utama", [
          "Google Workspace: Gmail, Calendar, Drive, Docs, Sheets",
          "Microsoft 365: Outlook, Word, Excel (dipakai banyak perusahaan)",
          "Manajemen tugas: Trello, Asana, ClickUp, Notion",
          "Komunikasi: Slack, Zoom, Google Meet, WhatsApp Business",
          "Desain ringan: Canva",
          "Password manager seperti Bitwarden atau 1Password untuk akses akun klien",
        ]),
        KOTAK("tips", "Belajar dari kasus, bukan dari menu", "Jangan menghafal semua menu. Ambil satu tugas nyata, misalnya 'atur rapat 3 orang di zona waktu berbeda dan kirim undangan', lalu kerjakan dari awal sampai akhir."),
        KOTAK("awas", "Keamanan akun klien", "Jangan pernah menyimpan kata sandi klien di chat atau catatan biasa. Minta akses lewat fitur berbagi (shared access) atau password manager, dan aktifkan verifikasi dua langkah."),
        LATIHAN(
          "Klien di Sydney (UTC+10) ingin rapat dengan rekan di Jakarta (UTC+7) pukul 10.00 waktu Sydney. Jam berapa di Jakarta?",
          "Pukul 07.00 WIB. Selisihnya 3 jam, Jakarta lebih lambat. Perhatikan juga musim panas di Australia (daylight saving): saat berlaku, Sydney menjadi UTC+11 sehingga selisihnya 4 jam. Biasakan mengecek dengan alat seperti timeanddate.com.",
        ),
      ],
      kuis: [
        K("Cara paling aman menerima akses akun klien adalah …", "Melalui fitur berbagi akses atau password manager", ["Meminta kata sandi lewat chat", "Menulisnya di kertas", "Menyimpan di catatan ponsel"], "Fitur berbagi dan password manager menjaga keamanan dan mudah dicabut."),
        K("Alat yang tepat untuk membagi dan memantau daftar tugas adalah …", "Trello atau Asana", ["Canva", "Zoom", "Kalkulator"], "Trello, Asana, dan ClickUp dirancang untuk manajemen tugas."),
        K("Mengapa daylight saving perlu diperhatikan?", "Karena selisih zona waktu bisa berubah sepanjang tahun", ["Karena memengaruhi tarif", "Karena email tidak terkirim", "Karena Google Calendar tidak bisa dipakai"], "Beberapa negara memajukan jam saat musim panas sehingga selisih waktu berubah."),
      ],
    },
    {
      id: "email-jadwal",
      judul: "Mengelola email dan jadwal klien",
      menit: 18,
      isi: [
        P("Dua tugas paling sering untuk VA adalah merapikan kotak masuk dan mengatur kalender. Kuncinya adalah sistem, bukan kerja keras."),
        POIN("Sistem label email sederhana", [
          "Perlu dibalas klien: hal yang butuh keputusannya",
          "Sudah dibalas VA: ditangani dengan template yang disetujui",
          "Menunggu balasan: kamu menunggu jawaban orang lain",
          "Tagihan dan keuangan",
          "Arsip: informasi saja, tidak perlu tindakan",
        ]),
        CONTOH(
          "Laporan ke klien: berantakan vs rapi",
          "Pak, tadi ada banyak email, sebagian udah aku balas, ada yang nanya soal invoice juga, sama ada yang mau meeting.",
          "Ringkasan email hari ini (Selasa):\n1. Perlu keputusan Bapak (2): penawaran harga dari PT Sinar, undangan webinar Kamis.\n2. Sudah saya balas (6): konfirmasi pesanan dan pertanyaan pengiriman.\n3. Invoice: tagihan hosting Rp450.000 jatuh tempo Jumat.\n4. Rapat: Bu Rina meminta jadwal minggu ini, saya usulkan Rabu 14.00. Setuju?",
          "Versi kedua bisa dibaca dalam 30 detik dan jelas apa yang harus diputuskan klien.",
        ),
        POIN("Aturan mengatur kalender", [
          "Sisakan jeda 10 sampai 15 menit di antara rapat",
          "Selalu tulis zona waktu di undangan",
          "Lampirkan tautan rapat dan agenda di deskripsi acara",
          "Lindungi waktu fokus klien (misalnya pagi tanpa rapat) bila ia meminta",
        ]),
        LATIHAN(
          "Tulis pesan singkat ke klien untuk mengonfirmasi jadwal rapat yang bentrok: rapat dengan investor dan rapat tim jatuh di Kamis pukul 10.00.",
          "Pak Andi, Kamis pukul 10.00 ada dua rapat yang bentrok: rapat investor dan rapat tim mingguan. Usul saya, rapat tim dipindah ke 13.00 karena semua anggota tim kosong di jam itu. Boleh saya ubah?",
        ),
      ],
      kuis: [
        K("Laporan email yang baik untuk klien berisi …", "Ringkasan terkelompok dan hal yang butuh keputusan", ["Semua isi email disalin lengkap", "Cerita kronologis tanpa urutan", "Hanya jumlah email masuk"], "Klien butuh tahu apa yang perlu ia putuskan, bukan semua detail."),
        K("Mengapa perlu jeda di antara rapat?", "Agar klien punya waktu bernapas dan rapat yang molor tidak menabrak jadwal berikutnya", ["Agar kalender terlihat penuh", "Karena Zoom membatasi rapat", "Agar VA bisa istirahat"], "Jeda mencegah keterlambatan berantai."),
        K("Saat jadwal bentrok, VA sebaiknya …", "Memberi tahu klien dan mengusulkan solusi", ["Membatalkan salah satu tanpa bertanya", "Membiarkan klien tahu sendiri", "Memindahkan keduanya"], "VA yang baik membawa masalah sekaligus usulan solusi."),
      ],
    },
    {
      id: "komunikasi",
      judul: "Komunikasi profesional jarak jauh",
      menit: 12,
      isi: [
        P("Klien tidak melihatmu bekerja. Yang ia lihat hanya pesanmu. Karena itu, komunikasi yang jelas dan teratur adalah cara utama membangun kepercayaan."),
        POIN("Kebiasaan komunikasi VA yang dipercaya", [
          "Kirim laporan akhir hari: selesai, sedang dikerjakan, butuh bantuan",
          "Balas pesan dalam waktu yang disepakati, walau hanya 'baik, saya cek dulu'",
          "Kabari lebih awal jika ada kendala, jangan menunggu tenggat lewat",
          "Ajukan pertanyaan sekaligus dalam satu pesan, bukan satu per satu",
        ]),
        CONTOH(
          "Laporan akhir hari",
          "Udah selesai semua kak.",
          "Laporan Rabu:\nSelesai: 25 produk diunggah ke Shopee, 14 chat pembeli dibalas.\nSedang dikerjakan: deskripsi 10 produk baru (selesai besok siang).\nButuh dari Kakak: foto produk kode B12 belum ada di Drive.",
          "Laporan terstruktur membuat klien tenang tanpa perlu bertanya.",
        ),
        KOTAK("tips", "Bahasa Inggris untuk klien luar negeri", "Kalimat sederhana dan sopan lebih baik daripada kalimat rumit. Contoh: 'Quick update: the invoices are sent. I need your approval for the new supplier before Friday.'"),
      ],
      kuis: [
        K("Kapan sebaiknya VA mengabarkan kendala?", "Sedini mungkin, sebelum tenggat lewat", ["Setelah tenggat lewat", "Hanya jika klien bertanya", "Saat laporan bulanan"], "Kabar lebih awal memberi klien waktu untuk menyesuaikan."),
        K("Isi laporan akhir hari yang baik adalah …", "Yang selesai, yang sedang dikerjakan, dan yang dibutuhkan dari klien", ["Hanya kata 'selesai'", "Daftar jam istirahat", "Keluhan pekerjaan"], "Struktur ini menjawab semua pertanyaan klien sekaligus."),
        K("Mengapa pertanyaan sebaiknya dikirim dalam satu pesan?", "Agar klien bisa menjawab sekaligus dan tidak terganggu berkali-kali", ["Agar pesan terlihat panjang", "Karena WhatsApp membatasi pesan", "Agar terlihat sibuk"], "Menghormati waktu klien adalah inti pekerjaan VA."),
      ],
    },
    {
      id: "sop",
      judul: "Membuat SOP dan sistem kerja",
      menit: 12,
      isi: [
        P("VA yang dipertahankan lama biasanya bukan yang paling cepat, tetapi yang membuat pekerjaan klien lebih rapi. Caranya dengan menulis SOP untuk tugas yang berulang."),
        LANGKAH([
          ["Pilih tugas berulang", "Misalnya memproses pesanan, membuat invoice, atau menerima klien baru."],
          ["Tulis langkahnya", "Nomor urut, kalimat perintah singkat, dan tangkapan layar bila perlu."],
          ["Tambahkan pengecualian", "Apa yang dilakukan jika stok habis atau pembayaran gagal?"],
          ["Simpan di satu tempat", "Notion atau Google Docs dengan nama yang konsisten."],
        ]),
        LATIHAN(
          "Tulis SOP 5 langkah untuk 'membalas pertanyaan ongkir dari pembeli di WhatsApp Business'.",
          "1) Tanyakan kota/kecamatan tujuan jika belum disebut. 2) Cek ongkir di aplikasi ekspedisi yang dipakai toko. 3) Balas dengan template 'Ongkir ke [kota] via [kurir]: Rp[...], estimasi [...] hari'. 4) Tawarkan link checkout atau format pesanan. 5) Beri label 'calon pembeli' dan follow-up besok jika belum ada balasan.",
        ),
      ],
      kuis: [
        K("Tugas mana yang paling tepat dibuatkan SOP?", "Tugas yang berulang setiap hari atau minggu", ["Tugas sekali seumur hidup", "Percakapan pribadi", "Ide kreatif yang selalu berbeda"], "SOP paling berguna untuk pekerjaan berulang."),
        K("Bagian SOP yang sering terlupa adalah …", "Pengecualian, misalnya jika stok habis", ["Judul", "Nomor urut", "Tanggal"], "Pengecualian membuat SOP tetap berguna saat terjadi masalah."),
        K("Manfaat utama SOP bagi klien adalah …", "Pekerjaan tetap konsisten walau dikerjakan orang lain", ["Mengurangi gaji VA", "Menambah rapat", "Menggantikan kontrak"], "SOP membuat pekerjaan tidak bergantung pada ingatan satu orang."),
      ],
    },
    {
      id: "klien",
      judul: "Paket jasa dan klien pertama",
      menit: 12,
      isi: [
        P("Pemula sering menawarkan 'bisa semua'. Klien justru lebih mudah membeli jika kamu menawarkan paket yang jelas."),
        CONTOH(
          "Penawaran jasa",
          "Saya bisa bantu apa saja: admin, sosmed, data, desain, dll.",
          "Paket Admin Toko Online, 20 jam per bulan: balas chat pembeli setiap hari kerja, unggah 40 produk, rekap pesanan mingguan di Google Sheets.",
          "Paket yang jelas memudahkan klien membayangkan hasil dan membandingkan harga.",
        ),
        POIN("Tempat mencari klien", [
          "OnlineJobs.ph dan Upwork untuk klien luar negeri",
          "LinkedIn: tulis profil sebagai VA dengan bidang tertentu",
          "Grup Facebook pemilik toko online dan pelatih online",
          "Lowongan remote di Jobly dengan kata kunci 'virtual assistant' atau 'admin online'",
        ]),
        KOTAK("awas", "Ciri lowongan VA palsu", "Diminta membayar biaya pendaftaran, diminta 'like dan subscribe' berbayar, atau diminta memakai rekeningmu untuk menerima uang orang lain. Tinggalkan segera."),
      ],
      kuis: [
        K("Penawaran mana yang lebih mudah dibeli klien?", "Paket dengan jam, tugas, dan hasil yang jelas", ["'Bisa semua'", "Daftar 30 keahlian", "Tanpa harga dan tanpa rincian"], "Klien membeli hasil yang bisa ia bayangkan."),
        K("Tanda lowongan VA palsu adalah …", "Diminta membayar biaya pendaftaran", ["Ada tes singkat", "Ada wawancara video", "Kontrak tertulis"], "Pemberi kerja yang sah tidak meminta biaya dari pelamar."),
        K("Platform yang banyak dipakai klien luar negeri untuk mencari VA adalah …", "OnlineJobs.ph dan Upwork", ["Shopee", "Gojek", "Spotify"], "Kedua platform tersebut populer untuk mencari VA."),
      ],
    },
  ],
  tugasAkhir: {
    judul: "Tugas akhir: simulasi hari pertama VA",
    brief: "Bayangkan kamu VA seorang pemilik toko online. Buat (1) sistem label Gmail, (2) SOP satu tugas berulang, dan (3) contoh laporan akhir hari.",
    kriteria: ["Label jelas dan tidak tumpang tindih", "SOP berurutan dan ada pengecualian", "Laporan memuat selesai, berjalan, dan kebutuhan", "Bahasa sopan dan ringkas"],
  },
};
