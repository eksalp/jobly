/**
 * Isi dokumen: Kebijakan Privasi, Syarat & Ketentuan, Disclaimer.
 *
 * Format tiap bagian: { id, judul, isi: [...] }. Elemen `isi` berupa
 * string (paragraf) atau { daftar: [...] } (butir). Token {KONTAK}
 * diganti dengan alamat email kontak dari data/situs.js saat dirender.
 *
 * Catatan: teks ini disusun mengikuti cara kerja aplikasi saat ini.
 * Bukan nasihat hukum — tinjau ulang bila layanan atau penyedia berubah.
 */
import { PAKET, rupiah, labelDurasi } from "./paket";

const daftarHarga = ["coba", "aktif", "serius"].map((id) => {
  const p = PAKET[id];
  return `${p.nama}: ${rupiah(p.harga)}, berlaku ${labelDurasi(p.durasiHari)}`;
});

export const DOKUMEN = {
  /* ================================================================ */
  "kebijakan-privasi": {
    judul: "Kebijakan Privasi",
    ringkas:
      "Data apa yang kami kumpulkan, untuk apa dipakai, siapa yang ikut memprosesnya, dan bagaimana kamu bisa mengaksesnya atau memintanya dihapus.",
    callout:
      "Singkatnya: kami hanya menyimpan data yang dibutuhkan untuk menjalankan akunmu, tidak menjual data, dan tidak mengirim CV-mu ke perusahaan mana pun. Teks CV dikirim ke penyedia AI hanya saat kamu memakai fitur AI.",
    bagian: [
      {
        id: "data",
        judul: "Data yang kami kumpulkan",
        isi: [
          "Kamu bisa mencari dan membuka loker tanpa akun. Data berikut baru kami kumpulkan saat kamu membuat akun dan memakai fitur di dalamnya:",
          {
            daftar: [
              "Data akun: nama, alamat email, dan kata sandi yang tersimpan dalam bentuk terenkripsi oleh penyedia autentikasi kami. Jika masuk dengan Google, kami menerima nama dan email dari akun Google-mu.",
              "Data yang kamu isi: profil karier, keahlian, pengalaman, isi CV Builder dan LinkedIn Builder, teks CV atau profil LinkedIn yang kamu unggah, loker yang kamu simpan, serta catatan lamaran.",
              "Hasil fitur AI: hasil review CV, rencana pindah karier, serta transkrip teks dan penilaian simulasi interview.",
              "Data transaksi: paket yang dibeli, nominal, status pembayaran, dan nomor pesanan. Data kartu atau rekeningmu diproses oleh Midtrans dan tidak kami terima.",
              "Data di perangkatmu: browser menyimpan sesi masuk dan data pendukung seperti kurs mata uang terakhir agar halaman lebih cepat. Jobly tidak memasang pelacak iklan atau analitik pihak ketiga.",
            ],
          },
        ],
      },
      {
        id: "penggunaan",
        judul: "Bagaimana data dipakai",
        isi: [
          {
            daftar: [
              "Menjalankan akunmu dan menyimpan pekerjaanmu, seperti CV, loker tersimpan, dan riwayat analisis.",
              "Mengurutkan loker yang paling sesuai dengan profil dan CV-mu.",
              "Menjalankan fitur AI yang kamu pilih.",
              "Memproses pembayaran dan menambahkan kuota paket ke akunmu.",
              "Menjaga keamanan layanan dan mencegah penyalahgunaan, termasuk penyalahgunaan kuota.",
              "Menghubungimu soal akun atau transaksi bila diperlukan.",
            ],
          },
          "Kami tidak menjual data pribadi, tidak memakainya untuk iklan, dan tidak mengirimkan CV atau profilmu kepada perusahaan pemberi kerja.",
        ],
      },
      {
        id: "ai",
        judul: "Pemrosesan oleh AI",
        isi: [
          "Saat kamu memakai Review CV, Pindah Karier, atau Simulasi Interview, teks yang diperlukan (misalnya isi CV, posisi yang kamu incar, atau jawabanmu) dikirim ke Google melalui Gemini API untuk diproses. Pada simulasi interview, suaramu dialirkan langsung ke layanan suara Google selama sesi berlangsung. Jobly tidak menyimpan rekaman suara; yang kami simpan hanya transkrip teks dan penilaiannya.",
          "Pemrosesan oleh Google tunduk pada ketentuan layanan Google. Tergantung jenis layanan yang digunakan, Google dapat menyimpan sementara atau memakai data tersebut sesuai ketentuannya. Karena itu, jangan mencantumkan data yang tidak dibutuhkan untuk melamar — misalnya NIK, nomor rekening, atau foto KTP — di CV yang kamu analisis.",
        ],
      },
      {
        id: "pihak-ketiga",
        judul: "Penyedia yang ikut memproses data",
        isi: [
          "Kami memakai penyedia berikut untuk menjalankan layanan. Mereka hanya menerima data yang dibutuhkan untuk tugasnya:",
          {
            daftar: [
              "Supabase — basis data, autentikasi, dan fungsi server.",
              "Google — Gemini API untuk fitur AI dan login dengan Google.",
              "Midtrans — pemrosesan pembayaran.",
              "Vercel — hosting situs.",
            ],
          },
          "Logo perusahaan pada daftar loker dimuat dari layanan ikon situs Google, dan kurs mata uang diambil dari layanan kurs publik (open.er-api.com). Saat memuatnya, browser-mu terhubung langsung ke layanan tersebut.",
        ],
      },
      {
        id: "penyimpanan",
        judul: "Penyimpanan & keamanan",
        isi: [
          "Data disimpan selama akunmu aktif. Koneksi ke Jobly dienkripsi (HTTPS), dan aturan akses di basis data membatasi setiap akun hanya pada datanya sendiri. Data transaksi dapat kami simpan lebih lama bila diwajibkan untuk keperluan pencatatan dan perpajakan.",
          "Tidak ada sistem yang sepenuhnya kebal. Jika terjadi insiden keamanan yang berdampak pada data pribadimu, kami akan memberi tahu sesuai ketentuan yang berlaku.",
        ],
      },
      {
        id: "hak",
        judul: "Hak kamu",
        isi: [
          "Sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, kamu berhak untuk:",
          {
            daftar: [
              "Mengakses dan mendapatkan salinan data pribadimu.",
              "Memperbaiki data yang keliru — sebagian besar bisa langsung kamu ubah di Profil Karier dan CV Builder.",
              "Meminta penghapusan akun beserta datanya.",
              "Menarik persetujuan pemrosesan, dengan konsekuensi fitur terkait tidak lagi bisa dipakai.",
            ],
          },
          "Ajukan permintaan dari email yang terdaftar di akunmu ke {KONTAK}. Kami akan menanggapinya sesegera mungkin sesuai ketentuan peraturan yang berlaku.",
        ],
      },
      {
        id: "usia",
        judul: "Batas usia",
        isi: [
          "Jobly ditujukan bagi pengguna berusia 18 tahun ke atas. Pengguna di bawah 18 tahun hanya boleh membuat akun dengan persetujuan orang tua atau wali.",
        ],
      },
      {
        id: "perubahan",
        judul: "Perubahan kebijakan",
        isi: [
          "Kebijakan ini dapat diperbarui bila layanan atau penyedia kami berubah. Tanggal berlaku di bagian atas halaman menunjukkan versi terbaru. Untuk perubahan yang penting, kami akan memberi tahu melalui situs atau email.",
        ],
      },
      {
        id: "kontak",
        judul: "Kontak",
        isi: ["Pertanyaan tentang privasi dan permintaan terkait data pribadi dapat dikirim ke {KONTAK}."],
      },
    ],
  },

  /* ================================================================ */
  "syarat-ketentuan": {
    judul: "Syarat & Ketentuan",
    ringkas:
      "Aturan penggunaan Jobly, termasuk akun, paket berbayar, pembayaran, dan batas tanggung jawab.",
    callout:
      "Dengan memakai Jobly, kamu menyetujui ketentuan ini. Bacalah terutama bagian Paket berbayar dan Pembayaran & pengembalian dana sebelum membeli.",
    bagian: [
      {
        id: "layanan",
        judul: "Tentang layanan",
        isi: [
          "Jobly adalah layanan pencarian lowongan kerja yang mengumpulkan lowongan dari situs karier resmi perusahaan dan platform lowongan publik, ditambah alat untuk menyiapkan lamaran.",
          "Jobly bukan agen penyalur tenaga kerja, tidak mewakili perusahaan pemberi kerja, dan tidak menerima atau menyeleksi lamaran. Jobly tidak menjamin kamu akan dipanggil interview atau diterima bekerja.",
        ],
      },
      {
        id: "akun",
        judul: "Akun",
        isi: [
          {
            daftar: [
              "Gunakan data yang benar dan jaga kerahasiaan kata sandimu. Aktivitas yang terjadi di akunmu menjadi tanggung jawabmu.",
              "Satu akun untuk satu orang. Akun dan kuota tidak boleh dipindahtangankan atau diperjualbelikan.",
              "Kami dapat menangguhkan atau menutup akun yang melanggar ketentuan ini.",
            ],
          },
        ],
      },
      {
        id: "larangan",
        judul: "Penggunaan yang dilarang",
        isi: [
          {
            daftar: [
              "Mengambil data Jobly secara otomatis dalam jumlah besar (scraping) atau menyalin daftar loker untuk layanan lain.",
              "Mengakali sistem kuota atau pembayaran, termasuk memanfaatkan celah teknis.",
              "Mengunggah konten yang melanggar hukum atau hak orang lain, termasuk CV milik orang lain tanpa izin.",
              "Memakai fitur AI untuk memalsukan dokumen, pengalaman, atau kualifikasi.",
              "Mengganggu, membebani, atau mencoba mengakses sistem tanpa izin.",
            ],
          },
        ],
      },
      {
        id: "paket",
        judul: "Paket berbayar",
        isi: [
          "Paket yang tersedia saat ini:",
          { daftar: daftarHarga },
          {
            daftar: [
              "Harga dalam Rupiah dan dibayar sekali untuk setiap pembelian. Tidak ada tagihan berulang dan tidak ada perpanjangan otomatis.",
              "Masa berlaku dihitung sejak pembayaran dikonfirmasi.",
              "Akun gratis dapat membuka 5.000 lowongan terbaru yang dibagi rata dari setiap sumber. Selama paket berbayar masih berlaku, seluruh lowongan terbuka; setelah masa berlaku habis, akses kembali ke 5.000 lowongan.",
              "Sisa kuota Review CV tetap bisa dipakai setelah masa berlaku habis. Pindah Karier dan Simulasi Interview hanya bisa dipakai selama paket masih berlaku.",
              "Jika membeli lebih dari satu paket, kuotanya dijumlahkan dan setiap paket memiliki masa berlakunya sendiri.",
              "Perubahan harga tidak berlaku untuk paket yang sudah dibayar.",
            ],
          },
        ],
      },
      {
        id: "pembayaran",
        judul: "Pembayaran & pengembalian dana",
        isi: [
          "Pembayaran diproses oleh Midtrans. Pesanan yang tidak dibayar dalam batas waktu yang ditampilkan di halaman pembayaran akan batal otomatis.",
          "Paket adalah layanan digital yang langsung aktif, sehingga pembelian tidak dapat dibatalkan atau dikembalikan, kecuali:",
          {
            daftar: [
              "Terjadi tagihan ganda untuk satu pesanan.",
              "Pembayaran berhasil tetapi kuota tidak bertambah dalam 1×24 jam dan tidak dapat kami perbaiki.",
            ],
          },
          "Ajukan permintaan ke {KONTAK} paling lambat 7 hari setelah transaksi, dengan menyertakan email akun dan nomor pesanan. Dana dikembalikan melalui metode yang memungkinkan sesuai ketentuan Midtrans.",
          "Kuota Simulasi Interview dikembalikan otomatis bila sesi gagal tersambung atau berakhir tanpa jawaban darimu.",
        ],
      },
      {
        id: "ai",
        judul: "Hasil fitur AI",
        isi: [
          "Hasil Review CV, Pindah Karier, rekomendasi, dan penilaian simulasi dihasilkan secara otomatis dan bisa keliru atau tidak lengkap. Hasil tersebut adalah saran, bukan nasihat profesional. Periksa kembali setiap isinya sebelum dipakai, dan jangan mencantumkan pengalaman atau kualifikasi yang tidak kamu miliki.",
        ],
      },
      {
        id: "konten",
        judul: "Konten milikmu",
        isi: [
          "CV dan data yang kamu unggah tetap milikmu. Kamu memberi kami izin terbatas untuk menyimpan dan memprosesnya — termasuk melalui penyedia AI — semata-mata untuk menjalankan fitur yang kamu pakai.",
        ],
      },
      {
        id: "hki",
        judul: "Hak kekayaan intelektual",
        isi: [
          "Nama, tampilan, dan kode Jobly dilindungi hukum. Isi lowongan, nama, dan logo perusahaan adalah milik pemiliknya masing-masing.",
        ],
      },
      {
        id: "tanggung-jawab",
        judul: "Batas tanggung jawab",
        isi: [
          "Sejauh diizinkan hukum, Jobly tidak bertanggung jawab atas isi lowongan dari pihak ketiga, keputusan rekrutmen perusahaan, interaksimu dengan pemberi kerja atau pihak yang mengaku sebagai pemberi kerja, maupun keputusan yang kamu ambil berdasarkan hasil fitur AI atau kalkulator.",
          "Total tanggung jawab Jobly atas klaim terkait layanan berbayar dibatasi sebesar nilai paket yang kamu bayar dalam 12 bulan terakhir.",
        ],
      },
      {
        id: "perubahan-layanan",
        judul: "Perubahan & penghentian layanan",
        isi: [
          "Kamu bisa berhenti memakai Jobly kapan saja. Kami dapat mengubah, menambah, atau menghentikan fitur. Jika fitur berbayar dihentikan permanen saat paketmu masih berlaku, kami akan memberi tahu lebih dulu dan mengembalikan dana secara proporsional untuk sisa masa berlakunya.",
        ],
      },
      {
        id: "hukum",
        judul: "Hukum yang berlaku",
        isi: [
          "Ketentuan ini tunduk pada hukum Republik Indonesia. Perselisihan akan diselesaikan lebih dulu secara musyawarah.",
        ],
      },
      {
        id: "perubahan",
        judul: "Perubahan ketentuan",
        isi: [
          "Ketentuan ini dapat diperbarui. Versi terbaru selalu tersedia di halaman ini dengan tanggal berlakunya. Dengan tetap memakai Jobly setelah perubahan berlaku, kamu dianggap menyetujui ketentuan yang baru.",
        ],
      },
      {
        id: "kontak",
        judul: "Kontak",
        isi: ["Pertanyaan tentang ketentuan ini dapat dikirim ke {KONTAK}."],
      },
    ],
  },

  /* ================================================================ */
  disclaimer: {
    judul: "Disclaimer",
    ringkas:
      "Batasan informasi yang ditampilkan Jobly: lowongan dari pihak ketiga, logo perusahaan, angka gaji, kurs, dan hasil AI.",
    callout:
      "Jobly tidak pernah meminta biaya kepada pelamar. Jika ada pihak yang meminta transfer uang atas nama perusahaan atau atas nama Jobly, itu penipuan.",
    bagian: [
      {
        id: "lowongan",
        judul: "Lowongan dari pihak ketiga",
        isi: [
          "Lowongan dikumpulkan secara otomatis dari situs karier perusahaan dan platform lowongan publik. Kami tidak memverifikasi setiap lowongan satu per satu. Lowongan bisa saja sudah ditutup, berubah, atau tidak lengkap. Selalu periksa informasi terbaru di halaman sumbernya sebelum melamar.",
        ],
      },
      {
        id: "afiliasi",
        judul: "Tidak berafiliasi",
        isi: [
          "Nama dan logo perusahaan serta platform lowongan adalah milik pemiliknya masing-masing. Tampilnya nama atau logo di Jobly hanya untuk menunjukkan sumber lowongan, dan tidak berarti ada kemitraan, dukungan, atau rekomendasi dari perusahaan tersebut.",
        ],
      },
      {
        id: "bukan-penyalur",
        judul: "Bukan agen penyalur kerja",
        isi: [
          "Jobly tidak menerima, meneruskan, atau menyeleksi lamaran, dan tidak menjamin panggilan interview maupun penerimaan kerja. Seluruh proses rekrutmen berlangsung antara kamu dan perusahaan.",
        ],
      },
      {
        id: "penipuan",
        judul: "Waspada penipuan lowongan",
        isi: [
          "Perusahaan yang sah tidak meminta biaya sebagai syarat rekrutmen. Waspadai tanda-tanda berikut:",
          {
            daftar: [
              "Diminta membayar biaya tes, pelatihan, seragam, medical check-up, atau tiket perjalanan.",
              "Undangan interview dari email gratisan atau nomor pribadi yang mengatasnamakan perusahaan besar.",
              "Tawaran gaji jauh di atas wajar dengan syarat yang sangat ringan.",
              "Diminta mengirim data sensitif, seperti foto KTP dan nomor rekening, sebelum ada tahap seleksi yang jelas.",
            ],
          },
          "Jika menemukan lowongan yang mencurigakan, jangan melakukan pembayaran dan laporkan kepada kami melalui {KONTAK}.",
        ],
      },
      {
        id: "gaji",
        judul: "Informasi gaji & kalkulator",
        isi: [
          "Angka gaji berasal dari sumber lowongan dan hanya tampil bila sumbernya mencantumkan. Konversi ke rupiah, baik di kartu loker maupun di Kalkulator Gaji, memakai kurs referensi harian dari layanan pihak ketiga. Kurs itu bukan kurs transaksi bank, platform pembayaran, atau penyedia transfer, yang biasanya lebih rendah dan dikenai biaya.",
          "Hasil kalkulator adalah perkiraan untuk membantu membandingkan tawaran, bukan nasihat keuangan atau perpajakan.",
        ],
      },
      {
        id: "ai",
        judul: "Hasil fitur AI",
        isi: [
          "Review CV, rekomendasi karier, rencana pindah karier, dan penilaian simulasi interview dihasilkan secara otomatis. Hasilnya bisa keliru dan bukan pengganti pertimbangan profesional.",
        ],
      },
      {
        id: "tautan",
        judul: "Tautan ke situs lain & tautan afiliasi",
        isi: [
          "Jobly memuat tautan ke situs pihak ketiga, termasuk halaman lowongan asli. Kami tidak mengendalikan isi maupun praktik privasi situs tersebut.",
          "Sebagian tautan ke kursus, bootcamp, dan layanan coaching merupakan tautan afiliasi. Jika kamu membeli melalui tautan tersebut, Jobly dapat menerima komisi tanpa biaya tambahan untukmu.",
        ],
      },
    ],
  },
};
