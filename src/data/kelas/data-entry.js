import { P, POIN, ISTILAH, CONTOH, KOTAK, LANGKAH, LATIHAN, K } from "./_blok.js";

export default {
  slug: "data-entry",
  judul: "Kelas Dasar Data Entry",
  ringkas: "Apa itu data entry, jenis pekerjaannya, dasar spreadsheet yang wajib, membersihkan data berantakan, menjaga akurasi, sampai menghindari penipuan lowongan data entry.",
  untuk: "Pemula yang teliti dan ingin pekerjaan remote yang bisa dimulai tanpa latar belakang khusus.",
  durasi: "± 1 jam",
  hasil: [
    "Paham jenis pekerjaan data entry yang nyata",
    "Bisa memakai rumus dasar Google Sheets/Excel untuk mengecek data",
    "Bisa merapikan data yang tidak konsisten",
    "Bisa mengenali lowongan data entry palsu",
  ],
  bab: [
    {
      id: "apa-itu",
      judul: "Apa itu data entry?",
      menit: 10,
      isi: [
        P("Data entry adalah pekerjaan memasukkan, memindahkan, dan merapikan data ke dalam sistem: spreadsheet, database, CRM, atau marketplace. Kelihatannya sederhana, tetapi data yang salah bisa membuat laporan, tagihan, atau stok ikut salah."),
        POIN("Contoh pekerjaan data entry", [
          "Memindahkan data dari formulir kertas atau PDF ke spreadsheet",
          "Mengunggah ratusan produk ke toko online",
          "Memperbarui data kontak pelanggan di CRM",
          "Mencari dan mengumpulkan data dari situs (riset data)",
          "Merapikan data duplikat dan tidak konsisten",
          "Memberi label pada data untuk pelatihan AI",
        ]),
        ISTILAH([
          ["Spreadsheet", "Lembar kerja berbentuk tabel, misalnya Google Sheets atau Excel."],
          ["CRM", "Sistem pengelolaan data pelanggan, misalnya HubSpot."],
          ["CSV", "Format file tabel sederhana yang bisa dibuka di hampir semua aplikasi."],
          ["Duplikat", "Data yang tercatat lebih dari sekali."],
          ["Akurasi", "Persentase data yang benar tanpa kesalahan."],
        ]),
        KOTAK("fakta", "Pekerjaan ini terus berubah", "Banyak entri sederhana kini diotomatisasi. Yang tetap dicari adalah orang yang teliti, bisa merapikan data, dan paham spreadsheet. Itu sebabnya kelas ini fokus pada keterampilan tersebut."),
      ],
      kuis: [
        K("Mengapa ketelitian sangat penting dalam data entry?", "Data salah bisa membuat laporan, tagihan, atau stok ikut salah", ["Karena dibayar per huruf", "Agar mengetik lebih lambat", "Karena semua data rahasia"], "Kesalahan kecil di data bisa berdampak besar."),
        K("CSV adalah …", "Format file tabel sederhana", ["Aplikasi desain", "Jenis printer", "Bahasa pemrograman"], "CSV bisa dibuka di Sheets, Excel, dan banyak sistem lain."),
        K("Keterampilan data entry yang paling tahan otomatisasi adalah …", "Merapikan data dan menguasai spreadsheet", ["Mengetik secepat mungkin tanpa mengecek", "Menyalin tanpa membaca", "Menghafal keyboard"], "Kemampuan mengecek dan merapikan data tetap dibutuhkan."),
      ],
    },
    {
      id: "spreadsheet",
      judul: "Spreadsheet yang wajib dikuasai",
      menit: 20,
      isi: [
        P("Kamu tidak perlu jadi ahli Excel. Cukup kuasai beberapa fungsi yang dipakai setiap hari untuk mengecek dan merapikan data."),
        POIN("Fungsi dan fitur dasar", [
          "TRIM: menghapus spasi berlebih. =TRIM(A2)",
          "PROPER/UPPER/LOWER: menyeragamkan huruf besar-kecil",
          "COUNTIF: menghitung kemunculan, berguna untuk mencari duplikat. =COUNTIF(A:A;A2)>1",
          "VLOOKUP/XLOOKUP: mengambil data dari tabel lain berdasarkan kunci",
          "Filter dan sortir untuk melihat data yang aneh",
          "Data validation: membatasi isi sel, misalnya hanya pilihan dari daftar",
          "Conditional formatting: mewarnai sel yang memenuhi syarat",
        ]),
        KOTAK("tips", "Koma atau titik koma?", "Di Google Sheets atau Excel dengan pengaturan Indonesia, pemisah argumen rumus biasanya titik koma (;). Dengan pengaturan bahasa Inggris, pemisahnya koma (,)."),
        LATIHAN(
          "Kolom A berisi nomor HP pelanggan. Bagaimana cara menandai nomor yang muncul lebih dari sekali?",
          "Buat kolom bantu B dengan rumus =COUNTIF(A:A;A2)>1 lalu tarik ke bawah. Baris dengan hasil TRUE adalah duplikat. Atau pakai conditional formatting dengan rumus khusus yang sama agar selnya berwarna.",
        ),
      ],
      kuis: [
        K("Fungsi untuk menghapus spasi berlebih adalah …", "TRIM", ["SUM", "COUNT", "ROUND"], "TRIM membersihkan spasi di awal, akhir, dan spasi ganda."),
        K("Untuk mengambil data dari tabel lain berdasarkan kode produk, gunakan …", "VLOOKUP atau XLOOKUP", ["TRIM", "UPPER", "LEN"], "Fungsi lookup mencocokkan kunci dan mengambil nilai terkait."),
        K("Data validation berguna untuk …", "Membatasi isi sel agar sesuai aturan", ["Mewarnai seluruh tabel", "Menghapus file", "Mengirim email"], "Validasi mencegah kesalahan input sejak awal."),
      ],
    },
    {
      id: "membersihkan",
      judul: "Membersihkan data berantakan",
      menit: 18,
      isi: [
        P("Data dari dunia nyata hampir selalu berantakan: penulisan berbeda, format tanggal campur, dan banyak duplikat. Membersihkan data adalah keterampilan yang membuat nilai jualmu naik."),
        CONTOH(
          "Kolom kota yang tidak konsisten",
          "jakarta | Jakarta  | JKT | DKI Jakarta | Jakarta Selatan",
          "Jakarta Selatan | Jakarta | Jakarta | Jakarta | Jakarta",
          "Tentukan aturan dulu (misalnya pakai nama kota resmi), lalu seragamkan. Tanyakan klien jika aturannya tidak jelas, misalnya apakah 'Jakarta Selatan' harus dipisah.",
        ),
        LANGKAH([
          ["Simpan salinan asli", "Jangan pernah membersihkan file asli. Duplikat dulu lembarnya."],
          ["Kenali masalahnya", "Sortir setiap kolom dan lihat variasi yang aneh."],
          ["Tetapkan aturan", "Format tanggal, penulisan nama, nomor HP dengan 62 atau 08, dan seterusnya."],
          ["Rapikan dengan rumus atau Find & Replace", "Lebih cepat dan konsisten daripada mengetik ulang satu per satu."],
          ["Catat perubahan", "Tulis di lembar terpisah apa saja yang kamu ubah."],
        ]),
        KOTAK("awas", "Format tanggal", "01/02/2026 bisa berarti 1 Februari atau 2 Januari tergantung pengaturan. Pakai format yang tidak ambigu seperti 2026-02-01, atau sepakati format dengan klien."),
      ],
      kuis: [
        K("Langkah pertama sebelum membersihkan data adalah …", "Membuat salinan data asli", ["Menghapus kolom yang aneh", "Mengirim ke klien", "Mengganti semua huruf menjadi kapital"], "Salinan asli memungkinkan kamu kembali jika ada kesalahan."),
        K("Format tanggal yang paling tidak ambigu adalah …", "2026-02-01", ["01/02/26", "1-2", "Feb 1"], "Format tahun-bulan-tanggal tidak bisa disalahartikan."),
        K("Mengapa perubahan perlu dicatat?", "Agar klien tahu apa yang diubah dan bisa dicek", ["Agar file lebih besar", "Agar terlihat sibuk", "Karena aturan Google"], "Catatan perubahan menjaga transparansi."),
      ],
    },
    {
      id: "akurasi",
      judul: "Menjaga akurasi dan kecepatan",
      menit: 12,
      isi: [
        P("Klien data entry biasanya menetapkan target akurasi, sering di atas 98%. Kecepatan penting, tetapi kesalahan yang harus diperbaiki ulang jauh lebih mahal."),
        POIN("Kebiasaan agar akurat", [
          "Kerjakan dalam blok, misalnya 50 baris, lalu cek ulang sebelum lanjut",
          "Gunakan dua layar atau jendela berdampingan agar mata tidak bolak-balik terlalu jauh",
          "Cek acak 5 sampai 10% hasil kerja sendiri",
          "Istirahat singkat setiap 50 sampai 60 menit",
          "Pakai shortcut keyboard: Ctrl+C, Ctrl+V, Ctrl+Z, Ctrl+Shift+V (tempel tanpa format)",
        ]),
        LATIHAN(
          "Kamu memasukkan 1.200 baris dan ditemukan 30 baris salah. Berapa akurasimu?",
          "(1.200 − 30) / 1.200 × 100% = 97,5%. Jika target 98%, kamu perlu menambah langkah pengecekan.",
        ),
      ],
      kuis: [
        K("Akurasi 1.170 baris benar dari 1.200 adalah …", "97,5%", ["98,5%", "95%", "99%"], "1.170 / 1.200 = 0,975."),
        K("Ctrl+Shift+V berguna untuk …", "Menempel tanpa format", ["Menyimpan file", "Menghapus baris", "Mencetak"], "Menempel tanpa format menjaga tampilan tabel tetap seragam."),
        K("Cek acak hasil kerja sendiri dilakukan untuk …", "Menemukan kesalahan sebelum klien menemukannya", ["Menambah jam kerja", "Mengurangi data", "Mengganti klien"], "Pengecekan sendiri menjaga kualitas."),
      ],
    },
    {
      id: "penipuan",
      judul: "Mengenali lowongan data entry palsu",
      menit: 10,
      isi: [
        P("Lowongan data entry adalah salah satu yang paling sering dipakai penipu, karena terdengar mudah dan menjanjikan bayaran besar."),
        POIN("Tanda bahaya", [
          "Diminta membayar biaya pendaftaran, pelatihan, atau 'deposit'",
          "Bayaran sangat tinggi untuk pekerjaan sangat ringan",
          "Diminta menyelesaikan 'tugas' dengan menyetor uang dulu lalu dijanjikan komisi",
          "Hanya berkomunikasi lewat Telegram dengan akun anonim",
          "Diminta data pribadi berlebihan seperti foto KTP sambil memegang KTP sebelum ada kontrak",
        ]),
        KOTAK("awas", "Prinsip sederhana", "Pekerjaan sah membayarmu, bukan meminta uangmu. Jika ragu, cek nama perusahaan, cari ulasan, dan baca panduan kenali penipuan kerja online di Jobly."),
      ],
      kuis: [
        K("Tanda paling jelas lowongan palsu adalah …", "Diminta menyetor uang sebelum bekerja", ["Ada tes mengetik", "Ada kontrak tertulis", "Ada wawancara"], "Pemberi kerja sah tidak meminta uang dari pekerja."),
        K("Bayaran yang sangat tinggi untuk tugas sangat ringan sebaiknya …", "Dicurigai dan dicek lebih dulu", ["Langsung diterima", "Dibagikan ke teman", "Diabaikan tanpa dibaca"], "Tawaran yang terlalu bagus sering merupakan umpan penipuan."),
        K("Data pribadi seperti foto KTP sebaiknya diberikan …", "Hanya setelah perusahaan terverifikasi dan ada kontrak", ["Kepada siapa saja yang meminta", "Di grup Telegram", "Sebelum melamar"], "Data pribadi bisa disalahgunakan."),
      ],
    },
  ],
  tugasAkhir: {
    judul: "Tugas akhir: rapikan data pelanggan",
    brief: "Buat sendiri 30 baris data pelanggan fiktif yang sengaja berantakan (nama huruf campur, kota tidak konsisten, nomor HP berbeda format, 3 duplikat). Rapikan dengan rumus, tandai duplikat, dan buat lembar catatan perubahan.",
    kriteria: ["Salinan asli tersimpan", "Format seragam", "Duplikat ditandai", "Catatan perubahan jelas"],
  },
};
