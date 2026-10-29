import { P, POIN, ISTILAH, CONTOH, KOTAK, LANGKAH, LATIHAN, K } from "./_blok.js";

export default {
  slug: "ads-specialist",
  judul: "Kelas Dasar Ads Specialist",
  ringkas: "Apa itu iklan berbayar, beda Meta Ads dan Google Ads, struktur kampanye, target audiens, membaca metrik (CTR, CPC, CPA, ROAS), sampai menguji iklan dengan benar.",
  untuk: "Pemula yang suka angka dan pemasaran, dan ingin mengelola iklan online.",
  durasi: "± 1,5 jam",
  hasil: [
    "Paham cara kerja lelang iklan dan beda platform iklan",
    "Bisa menyusun struktur kampanye, ad set, dan iklan",
    "Bisa menghitung dan menafsirkan CTR, CPC, CPA, dan ROAS",
    "Bisa merencanakan uji A/B yang adil",
  ],
  bab: [
    {
      id: "apa-itu",
      judul: "Apa itu ads specialist?",
      menit: 10,
      isi: [
        P("Ads specialist mengelola iklan berbayar di platform seperti Meta (Facebook dan Instagram), Google, TikTok, dan marketplace. Tugasnya membuat uang iklan klien menghasilkan penjualan atau prospek sebanyak mungkin."),
        POIN("Pekerjaan sehari-hari", [
          "Menyusun kampanye dan menentukan target",
          "Menyiapkan materi iklan bersama desainer dan copywriter",
          "Memantau angka setiap hari dan mengatur anggaran",
          "Mematikan iklan yang boros dan memperbesar yang berhasil",
          "Membuat laporan dan rekomendasi",
        ]),
        KOTAK("fakta", "Mengelola uang orang lain", "Ini pekerjaan yang hasilnya paling mudah diukur di dunia pemasaran. Karena itu kepercayaan sangat penting: transparan soal angka, termasuk saat hasilnya buruk."),
        ISTILAH([
          ["Kampanye", "Wadah iklan dengan satu tujuan, misalnya penjualan atau prospek."],
          ["Ad set/ad group", "Kelompok iklan dengan target, anggaran, dan jadwal yang sama."],
          ["Creative", "Materi iklan: gambar, video, dan teks."],
          ["Pixel", "Kode di situs yang melacak tindakan pengunjung dari iklan."],
        ]),
      ],
      kuis: [
        K("Tugas utama ads specialist adalah …", "Membuat anggaran iklan menghasilkan penjualan atau prospek sebanyak mungkin", ["Membuat produk", "Mengirim barang", "Menulis artikel blog"], "Fokusnya adalah hasil dari uang iklan."),
        K("Pixel berfungsi untuk …", "Melacak tindakan pengunjung situs yang datang dari iklan", ["Mendesain gambar", "Membayar iklan", "Menulis caption"], "Pixel mengirim data konversi ke platform iklan."),
        K("Ad set berisi …", "Kelompok iklan dengan target dan anggaran yang sama", ["Satu gambar saja", "Laporan bulanan", "Daftar pelanggan"], "Pengaturan target dan anggaran biasanya di level ad set."),
      ],
    },
    {
      id: "platform",
      judul: "Meta Ads, Google Ads, dan TikTok Ads",
      menit: 15,
      isi: [
        P("Perbedaan terbesar ada pada niat penggunanya. Di Google, orang sedang mencari sesuatu. Di Meta dan TikTok, orang sedang bersantai lalu disela iklan."),
        POIN("Kapan memakai apa", [
          "Google Search Ads: menangkap orang yang sudah mencari, misalnya 'servis AC Bekasi'",
          "Meta Ads: membangun minat pada produk yang belum dicari, target berdasarkan minat dan perilaku",
          "TikTok Ads: produk yang mudah diperagakan lewat video pendek, audiens muda",
          "Ads marketplace (Shopee, Tokopedia): menaikkan produk di hasil pencarian toko",
        ]),
        CONTOH(
          "Memilih platform",
          "Jasa sedot WC dipromosikan dengan video lucu di TikTok untuk semua usia se-Indonesia.",
          "Jasa sedot WC dipromosikan di Google Search untuk kata kunci 'sedot WC [kota]' di radius layanan, dengan ekstensi telepon.",
          "Orang mencari jasa darurat saat membutuhkannya. Google menangkap niat itu tepat waktu.",
        ),
      ],
      kuis: [
        K("Mengapa Google Search Ads cocok untuk jasa darurat?", "Karena orang mencarinya saat butuh", ["Karena paling murah", "Karena videonya bagus", "Karena tidak perlu anggaran"], "Search ads menangkap niat yang sudah ada."),
        K("Meta Ads kuat untuk …", "Membangun minat pada produk yang belum dicari orang", ["Hanya produk B2B", "Hanya iklan radio", "Mengirim email"], "Meta menargetkan berdasarkan minat dan perilaku."),
        K("Ads marketplace digunakan untuk …", "Menaikkan posisi produk di pencarian toko", ["Mengirim barang", "Membuat logo", "Membalas chat"], "Iklan marketplace muncul di hasil pencarian toko."),
      ],
    },
    {
      id: "struktur",
      judul: "Menyusun kampanye pertama",
      menit: 15,
      isi: [
        LANGKAH([
          ["Tentukan tujuan", "Penjualan, prospek (lead), atau trafik. Tujuan menentukan cara platform mengoptimalkan iklan."],
          ["Pasang pelacakan", "Pastikan pixel atau tag konversi berjalan sebelum iklan tayang. Tanpa data, kamu menebak-nebak."],
          ["Tentukan audiens", "Mulai dari audiens yang cukup luas, lalu biarkan data menunjukkan siapa yang merespons."],
          ["Siapkan 3 sampai 5 creative", "Variasi sudut pesan, misalnya harga, hasil, dan testimoni."],
          ["Tetapkan anggaran dan durasi", "Beri waktu beberapa hari untuk fase belajar sebelum menilai."],
        ]),
        ISTILAH([
          ["Lookalike audience", "Audiens yang mirip dengan pelanggan yang sudah ada."],
          ["Retargeting", "Menampilkan iklan ke orang yang pernah berkunjung atau berinteraksi."],
          ["Learning phase", "Masa awal ketika platform mempelajari siapa yang merespons iklan."],
        ]),
        KOTAK("awas", "Jangan mengubah setiap jam", "Mengubah target atau anggaran terlalu sering bisa membuat platform terus mengulang fase belajar sehingga hasil tidak stabil."),
      ],
      kuis: [
        K("Yang harus dipastikan sebelum iklan tayang adalah …", "Pelacakan konversi sudah berjalan", ["Jumlah emoji di caption", "Warna logo", "Jumlah pengikut"], "Tanpa pelacakan, hasil iklan tidak bisa diukur."),
        K("Retargeting adalah …", "Menampilkan iklan ke orang yang pernah berinteraksi", ["Mengganti target setiap jam", "Iklan di radio", "Menghapus iklan"], "Retargeting menyasar orang yang sudah kenal brand."),
        K("Mengapa sebaiknya tidak mengubah iklan setiap jam?", "Agar platform tidak terus mengulang fase belajar", ["Karena dilarang hukum", "Agar anggaran habis", "Karena tidak bisa diubah"], "Perubahan berlebihan mengganggu optimasi."),
      ],
    },
    {
      id: "metrik",
      judul: "Membaca metrik iklan",
      menit: 20,
      isi: [
        ISTILAH([
          ["Impresi", "Berapa kali iklan ditampilkan."],
          ["CTR", "Click-through rate: klik ÷ impresi × 100%."],
          ["CPC", "Cost per click: biaya ÷ klik."],
          ["CPM", "Biaya per 1.000 impresi."],
          ["Conversion rate", "Konversi ÷ klik × 100%."],
          ["CPA", "Cost per acquisition: biaya ÷ jumlah konversi."],
          ["ROAS", "Return on ad spend: pendapatan dari iklan ÷ biaya iklan."],
        ]),
        LATIHAN(
          "Biaya iklan Rp2.000.000, impresi 100.000, klik 1.500, pembelian 40 dengan total penjualan Rp6.000.000. Hitung CTR, CPC, CPA, dan ROAS.",
          "CTR = 1.500 / 100.000 = 1,5%. CPC = 2.000.000 / 1.500 ≈ Rp1.333. CPA = 2.000.000 / 40 = Rp50.000. ROAS = 6.000.000 / 2.000.000 = 3 (atau 3x).",
        ),
        CONTOH(
          "Menafsirkan angka",
          "CTR tinggi, berarti iklan sukses.",
          "CTR 3% bagus, tetapi conversion rate hanya 0,2%. Iklannya menarik, masalahnya kemungkinan di halaman tujuan atau penawarannya. Saya usul cek kecepatan halaman dan kejelasan harga.",
          "Satu metrik tidak cukup. Lihat rangkaiannya dari tayang sampai beli untuk menemukan titik bocor.",
        ),
        KOTAK("tips", "ROAS minimal yang masuk akal", "ROAS 3 belum tentu untung. Jika margin produk 30%, penjualan Rp3 juta hanya menghasilkan laba kotor Rp900 ribu dari biaya iklan Rp1 juta: rugi. Tanyakan margin klien untuk menentukan ROAS impas."),
      ],
      kuis: [
        K("CTR dihitung dengan …", "Klik ÷ impresi × 100%", ["Biaya ÷ klik", "Pendapatan ÷ biaya", "Konversi ÷ impresi"], "CTR menunjukkan persentase orang yang mengklik."),
        K("Biaya Rp1.000.000 menghasilkan 20 pembelian. CPA-nya …", "Rp50.000", ["Rp20.000", "Rp500.000", "Rp5.000"], "1.000.000 ÷ 20 = 50.000."),
        K("CTR tinggi tetapi pembelian sangat rendah biasanya menunjukkan masalah di …", "Halaman tujuan atau penawaran", ["Gambar iklan", "Jumlah impresi", "Nama akun"], "Orang tertarik mengklik, tetapi berhenti di halaman."),
      ],
    },
    {
      id: "uji",
      judul: "Menguji iklan dengan adil (A/B test)",
      menit: 12,
      isi: [
        P("Uji A/B membandingkan dua versi untuk melihat mana yang lebih baik. Kuncinya: ubah satu hal saja agar kamu tahu penyebab perbedaannya."),
        POIN("Aturan uji yang adil", [
          "Ubah satu variabel: gambar, headline, atau audiens, bukan semuanya sekaligus",
          "Beri anggaran dan waktu yang sama",
          "Tunggu data cukup sebelum menyimpulkan",
          "Catat hasilnya agar pelajaran bisa dipakai lagi",
        ]),
        CONTOH(
          "Rencana uji",
          "Versi A: foto produk + headline harga + audiens wanita 25-34. Versi B: video testimoni + headline manfaat + audiens pria 35-44.",
          "Versi A dan B memakai audiens dan headline sama. Yang berbeda hanya creative: foto produk vs video testimoni.",
          "Pada rencana pertama, jika B menang, kamu tidak tahu apakah karena video, headline, atau audiensnya.",
        ),
      ],
      kuis: [
        K("Dalam uji A/B yang adil, berapa variabel yang diubah?", "Satu", ["Semuanya", "Tiga", "Tidak ada"], "Satu variabel membuat penyebab perbedaan jelas."),
        K("Kapan sebaiknya menyimpulkan hasil uji?", "Setelah data cukup", ["Setelah 1 jam", "Sebelum iklan tayang", "Setelah 3 klik"], "Data sedikit bisa menyesatkan."),
        K("Mengapa hasil uji perlu dicatat?", "Agar pelajarannya bisa dipakai di kampanye berikutnya", ["Agar laporan tebal", "Karena diwajibkan platform", "Agar anggaran naik"], "Catatan membangun pengetahuan tim."),
      ],
    },
    {
      id: "karier",
      judul: "Aturan iklan, sertifikasi, dan klien pertama",
      menit: 12,
      isi: [
        KOTAK("awas", "Kebijakan iklan", "Platform menolak iklan dengan klaim berlebihan, sebelum-sesudah tubuh yang menyesatkan, produk terlarang, atau yang menyinggung kondisi pribadi pengguna ('Kamu gendut?'). Pelajari kebijakan iklan setiap platform sebelum membuat materi."),
        POIN("Belajar dan sertifikasi gratis", [
          "Google Skillshop: sertifikasi Google Ads",
          "Meta Blueprint: materi belajar iklan Meta",
          "TikTok Academy",
        ]),
        LANGKAH([
          ["Latihan dengan anggaran kecil", "Promosikan produk temanmu atau layananmu sendiri dengan anggaran kecil untuk merasakan dashboard sungguhan."],
          ["Buat studi kasus", "Tujuan, anggaran, apa yang diuji, hasil, dan pelajaran. Angka nyata walau kecil lebih meyakinkan."],
          ["Tawarkan audit gratis singkat", "Lihat iklan UMKM di Meta Ad Library dan beri 3 saran perbaikan."],
        ]),
        KOTAK("tips", "Langkah berikutnya", "Latihan praktik Ads Specialist di Jobly berisi data kampanye untuk dianalisis seperti di pekerjaan sungguhan."),
      ],
      kuis: [
        K("Iklan mana yang berisiko ditolak platform?", "'Kamu gendut? Turun 10 kg dalam seminggu!'", ["'Sepatu lari ringan, ukuran 38 sampai 45'", "'Kelas Excel online, mulai Senin'", "'Gratis ongkir se-Jabodetabek'"], "Menyinggung kondisi pribadi dan klaim berlebihan melanggar kebijakan."),
        K("Sertifikasi Google Ads tersedia gratis di …", "Google Skillshop", ["Meta Blueprint", "Canva", "Shopee"], "Skillshop adalah pusat belajar resmi Google untuk produk iklannya."),
        K("Studi kasus yang meyakinkan berisi …", "Tujuan, uji, hasil nyata, dan pelajaran", ["Hanya tangkapan layar logo", "Janji hasil 10x", "Daftar platform"], "Klien ingin melihat cara kerjamu dan hasilnya."),
      ],
    },
  ],
  tugasAkhir: {
    judul: "Tugas akhir: rencana kampanye",
    brief: "Pilih satu produk UMKM. Tulis rencana kampanye: tujuan, platform dan alasannya, audiens, 3 sudut pesan creative, anggaran harian, metrik keberhasilan, ROAS impas (dari margin yang kamu asumsikan), dan rencana uji A/B.",
    kriteria: ["Platform sesuai niat pembeli", "Metrik sesuai tujuan", "ROAS impas dihitung dari margin", "Uji A/B mengubah satu variabel"],
  },
};
