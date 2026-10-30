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
import { bahasa } from "../i18n.js";

const daftarHarga = ["coba", "aktif", "serius"].map((id) => {
  const p = PAKET[id];
  return bahasa() === "en"
    ? `${p.nama}: ${rupiah(p.harga)}, valid for ${labelDurasi(p.durasiHari)}`
    : `${p.nama}: ${rupiah(p.harga)}, berlaku ${labelDurasi(p.durasiHari)}`;
});

const DOKUMEN_ID = {
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
              "Data yang kamu isi: profil karier, keahlian, pengalaman, isi CV Builder, Cover Letter Builder, dan LinkedIn Builder, teks CV atau profil LinkedIn yang kamu unggah, loker yang kamu simpan, serta catatan lamaran.",
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
          "Saat kamu memakai Review CV, analisis cover letter, Pindah Karier, atau Simulasi Interview, teks yang diperlukan (misalnya isi CV, isi cover letter, teks lowongan, posisi yang kamu incar, atau jawabanmu) dikirim ke Google melalui Gemini API untuk diproses. Pada simulasi interview, suaramu dialirkan langsung ke layanan suara Google selama sesi berlangsung. Jobly tidak menyimpan rekaman suara; yang kami simpan hanya transkrip teks dan penilaiannya.",
          "Pemrosesan oleh Google tunduk pada ketentuan layanan Google. Tergantung jenis layanan yang digunakan, Google dapat menyimpan sementara atau memakai data tersebut sesuai ketentuannya. Karena itu, jangan mencantumkan data yang tidak dibutuhkan untuk melamar (misalnya NIK, nomor rekening, atau foto KTP) di CV yang kamu analisis.",
        ],
      },
      {
        id: "pihak-ketiga",
        judul: "Penyedia yang ikut memproses data",
        isi: [
          "Kami memakai penyedia berikut untuk menjalankan layanan. Mereka hanya menerima data yang dibutuhkan untuk tugasnya:",
          {
            daftar: [
              "Supabase: basis data, autentikasi, dan fungsi server.",
              "Google: Gemini API untuk fitur AI dan login dengan Google.",
              "Midtrans: pemrosesan pembayaran.",
              "Vercel: hosting situs.",
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
              "Memperbaiki data yang keliru. Sebagian besar bisa langsung kamu ubah sendiri di Profil Karier dan CV Builder.",
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
              "Seluruh lowongan dapat dibuka gratis oleh semua pengguna, dengan atau tanpa paket berbayar. Paket berbayar membuka latihan praktik dan kuota fitur AI selama masa berlakunya.",
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
          "Hasil Review CV, analisis cover letter, Pindah Karier, rekomendasi, dan penilaian simulasi dihasilkan secara otomatis dan bisa keliru atau tidak lengkap. Hasil tersebut adalah saran, bukan nasihat profesional. Periksa kembali setiap isinya sebelum dipakai, dan jangan mencantumkan pengalaman atau kualifikasi yang tidak kamu miliki.",
        ],
      },
      {
        id: "konten",
        judul: "Konten milikmu",
        isi: [
          "CV dan data yang kamu unggah tetap milikmu. Kamu memberi kami izin terbatas untuk menyimpan dan memprosesnya, termasuk lewat penyedia AI, hanya untuk menjalankan fitur yang kamu pakai.",
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

/*
 * Terjemahan bahasa Inggris. Disediakan untuk kemudahan membaca;
 * bila ada perbedaan makna, versi bahasa Indonesia yang berlaku.
 */
const CATATAN_EN =
  "This English version is provided for convenience. If there is any difference in meaning, the Indonesian version prevails.";

const DOKUMEN_EN = {
  "kebijakan-privasi": {
    judul: "Privacy Policy",
    ringkas:
      "What data we collect, what it's used for, who helps process it, and how you can access it or ask for it to be deleted.",
    callout: `In short: we only keep the data needed to run your account, we don't sell data, and we never send your CV to any company. CV text is sent to an AI provider only when you use an AI feature. ${CATATAN_EN}`,
    bagian: [
      {
        id: "data",
        judul: "Data we collect",
        isi: [
          "You can search and open jobs without an account. We only collect the following once you create an account and use its features:",
          {
            daftar: [
              "Account data: your name, email address, and password, which our authentication provider stores in encrypted form. If you sign in with Google, we receive the name and email from your Google account.",
              "Data you enter: your career profile, skills, experience, CV Builder, Cover Letter Builder, and LinkedIn Builder content, CV or LinkedIn text you upload, saved jobs, and application notes.",
              "AI feature results: CV review results, career switch plans, and mock interview transcripts and scores.",
              "Transaction data: the plan purchased, amount, payment status, and order number. Card or bank details are processed by Midtrans and never reach us.",
              "Data on your device: your browser stores your sign-in session and supporting data such as the latest exchange rate so pages load faster. Jobly doesn't use third-party advertising trackers or analytics.",
            ],
          },
        ],
      },
      {
        id: "penggunaan",
        judul: "How we use data",
        isi: [
          {
            daftar: [
              "Running your account and saving your work, such as your CV, saved jobs, and analysis history.",
              "Ranking the jobs that best match your profile and CV.",
              "Running the AI features you choose.",
              "Processing payments and adding plan credits to your account.",
              "Keeping the service secure and preventing abuse, including credit abuse.",
              "Contacting you about your account or a transaction when needed.",
            ],
          },
          "We don't sell personal data, don't use it for advertising, and never send your CV or profile to employers.",
        ],
      },
      {
        id: "ai",
        judul: "AI processing",
        isi: [
          "When you use CV Review, cover letter review, Career Switch, or Mock Interview, the text needed (for example your CV, cover letter, job post, target role, or answers) is sent to Google through the Gemini API for processing. During a mock interview, your voice is streamed directly to Google's voice service for the length of the session. Jobly doesn't store voice recordings; we only keep the text transcript and the score.",
          "Processing by Google is subject to Google's terms of service. Depending on the service used, Google may temporarily store or use that data under its terms. So don't include data you don't need for applying (for example your national ID number, bank account number, or ID card photo) in a CV you analyse.",
        ],
      },
      {
        id: "pihak-ketiga",
        judul: "Providers that process data",
        isi: [
          "We use the following providers to run the service. They only receive the data needed for their task:",
          {
            daftar: [
              "Supabase: database, authentication, and server functions.",
              "Google: the Gemini API for AI features and Google sign-in.",
              "Midtrans: payment processing.",
              "Vercel: website hosting.",
            ],
          },
          "Company logos in job listings load from Google's site icon service, and exchange rates come from a public rates service (open.er-api.com). When these load, your browser connects to those services directly.",
        ],
      },
      {
        id: "penyimpanan",
        judul: "Storage & security",
        isi: [
          "Data is kept while your account is active. Connections to Jobly are encrypted (HTTPS), and database access rules limit each account to its own data. We may keep transaction data longer where required for record-keeping and tax purposes.",
          "No system is completely immune. If a security incident affects your personal data, we will notify you as required by applicable rules.",
        ],
      },
      {
        id: "hak",
        judul: "Your rights",
        isi: [
          "Under Indonesia's Law No. 27 of 2022 on Personal Data Protection, you have the right to:",
          {
            daftar: [
              "Access and get a copy of your personal data.",
              "Correct inaccurate data. Most of it you can change yourself in Career Profile and the CV Builder.",
              "Ask for your account and its data to be deleted.",
              "Withdraw consent to processing, in which case the related features can no longer be used.",
            ],
          },
          "Send your request from your account's email address to {KONTAK}. We will respond as soon as possible in line with applicable regulations.",
        ],
      },
      {
        id: "usia",
        judul: "Age limit",
        isi: [
          "Jobly is intended for users aged 18 and over. Users under 18 may only create an account with the consent of a parent or guardian.",
        ],
      },
      {
        id: "perubahan",
        judul: "Changes to this policy",
        isi: [
          "This policy may be updated when our service or providers change. The effective date at the top of the page shows the latest version. For important changes, we'll notify you on the site or by email.",
        ],
      },
      {
        id: "kontak",
        judul: "Contact",
        isi: ["Privacy questions and personal data requests can be sent to {KONTAK}."],
      },
    ],
  },

  "syarat-ketentuan": {
    judul: "Terms of Service",
    ringkas: "Rules for using Jobly, including accounts, paid plans, payment, and limits of liability.",
    callout: `By using Jobly, you agree to these terms. Please read the Paid plans and Payment & refunds sections before buying. ${CATATAN_EN}`,
    bagian: [
      {
        id: "layanan",
        judul: "About the service",
        isi: [
          "Jobly is a job search service that collects openings from official company career sites and public job platforms, plus tools to help you prepare applications.",
          "Jobly is not a recruitment agency, doesn't represent employers, and doesn't receive or screen applications. Jobly doesn't guarantee that you'll be invited to interview or hired.",
        ],
      },
      {
        id: "akun",
        judul: "Accounts",
        isi: [
          {
            daftar: [
              "Use accurate information and keep your password secret. You are responsible for activity on your account.",
              "One account per person. Accounts and credits may not be transferred or sold.",
              "We may suspend or close accounts that break these terms.",
            ],
          },
        ],
      },
      {
        id: "larangan",
        judul: "Prohibited use",
        isi: [
          {
            daftar: [
              "Automatically collecting Jobly data in bulk (scraping) or copying job listings for another service.",
              "Gaming the credit or payment system, including exploiting technical loopholes.",
              "Uploading content that breaks the law or others' rights, including someone else's CV without permission.",
              "Using AI features to fake documents, experience, or qualifications.",
              "Disrupting, overloading, or trying to access systems without permission.",
            ],
          },
        ],
      },
      {
        id: "paket",
        judul: "Paid plans",
        isi: [
          "Plans currently available:",
          { daftar: daftarHarga },
          {
            daftar: [
              "Prices are in rupiah and paid once per purchase. There are no recurring charges and no automatic renewal.",
              "The validity period starts when payment is confirmed.",
              "Every job can be opened for free by all users, with or without a paid plan. Paid plans unlock hands-on practice and AI feature credits while they're active.",
              "Remaining CV Review credits can still be used after a plan expires. Career Switch and Mock Interview can only be used while a plan is active.",
              "If you buy more than one plan, credits add up and each plan keeps its own validity period.",
              "Price changes don't apply to plans already paid for.",
            ],
          },
        ],
      },
      {
        id: "pembayaran",
        judul: "Payment & refunds",
        isi: [
          "Payments are processed by Midtrans. Orders not paid within the time shown on the payment page are cancelled automatically.",
          "Plans are digital services that activate immediately, so purchases can't be cancelled or refunded, except when:",
          {
            daftar: [
              "You are charged twice for one order.",
              "Payment succeeds but your credits don't update within 24 hours and we can't fix it.",
            ],
          },
          "Send a request to {KONTAK} within 7 days of the transaction, including your account email and order number. Refunds are made through whatever method is possible under Midtrans's rules.",
          "Mock Interview credits are refunded automatically if a session fails to connect or ends without any answer from you.",
        ],
      },
      {
        id: "ai",
        judul: "AI feature results",
        isi: [
          "CV Review, cover letter review, Career Switch, suggestions, and mock interview scores are generated automatically and may be wrong or incomplete. They are suggestions, not professional advice. Check everything before using it, and never list experience or qualifications you don't have.",
        ],
      },
      {
        id: "konten",
        judul: "Your content",
        isi: [
          "The CV and data you upload remain yours. You give us a limited permission to store and process them, including through AI providers, only to run the features you use.",
        ],
      },
      {
        id: "hki",
        judul: "Intellectual property",
        isi: [
          "Jobly's name, design, and code are protected by law. Job content, company names, and logos belong to their respective owners.",
        ],
      },
      {
        id: "tanggung-jawab",
        judul: "Limitation of liability",
        isi: [
          "To the extent permitted by law, Jobly is not responsible for third-party job content, employers' hiring decisions, your dealings with employers or people claiming to be employers, or decisions you make based on AI features or calculators.",
          "Jobly's total liability for claims related to paid services is limited to the amount you paid for plans in the last 12 months.",
        ],
      },
      {
        id: "perubahan-layanan",
        judul: "Changes & discontinuation",
        isi: [
          "You can stop using Jobly at any time. We may change, add, or discontinue features. If a paid feature is permanently discontinued while your plan is active, we'll tell you in advance and refund the unused portion proportionally.",
        ],
      },
      {
        id: "hukum",
        judul: "Governing law",
        isi: [
          "These terms are governed by the laws of the Republic of Indonesia. Disputes will first be settled through good-faith discussion.",
        ],
      },
      {
        id: "perubahan",
        judul: "Changes to these terms",
        isi: [
          "These terms may be updated. The latest version is always on this page with its effective date. By continuing to use Jobly after a change takes effect, you accept the new terms.",
        ],
      },
      {
        id: "kontak",
        judul: "Contact",
        isi: ["Questions about these terms can be sent to {KONTAK}."],
      },
    ],
  },

  disclaimer: {
    judul: "Disclaimer",
    ringkas: "Limits of the information Jobly shows: third-party jobs, company logos, salary figures, exchange rates, and AI results.",
    callout: `Jobly never charges applicants. If anyone asks you to transfer money in a company's name or in Jobly's name, it's a scam. ${CATATAN_EN}`,
    bagian: [
      {
        id: "lowongan",
        judul: "Third-party job listings",
        isi: [
          "Jobs are collected automatically from company career sites and public job platforms. We don't verify every listing individually. A job may already be closed, changed, or incomplete. Always check the latest information on the source page before applying.",
        ],
      },
      {
        id: "afiliasi",
        judul: "No affiliation",
        isi: [
          "Company and job platform names and logos belong to their owners. Showing a name or logo on Jobly only indicates the source of a job and doesn't imply any partnership, endorsement, or recommendation from that company.",
        ],
      },
      {
        id: "bukan-penyalur",
        judul: "Not a recruitment agency",
        isi: [
          "Jobly doesn't receive, forward, or screen applications, and doesn't guarantee interviews or job offers. The whole hiring process happens between you and the company.",
        ],
      },
      {
        id: "penipuan",
        judul: "Beware of job scams",
        isi: [
          "Legitimate companies never charge fees as part of hiring. Watch out for these signs:",
          {
            daftar: [
              "Being asked to pay for tests, training, uniforms, medical check-ups, or travel tickets.",
              "Interview invitations from free email addresses or personal numbers claiming to be a big company.",
              "Pay far above normal for very light requirements.",
              "Being asked for sensitive data, like an ID card photo or bank account number, before any clear selection step.",
            ],
          },
          "If you find a suspicious job, don't pay anything and report it to us at {KONTAK}.",
        ],
      },
      {
        id: "gaji",
        judul: "Salary information & calculator",
        isi: [
          "Salary figures come from the job source and only appear when the source lists them. Rupiah conversions, on job cards and in the Salary Calculator, use a daily reference rate from a third-party service. It isn't the rate used by banks, payment platforms, or transfer providers, which is usually lower and comes with fees.",
          "Calculator results are estimates to help compare offers, not financial or tax advice.",
        ],
      },
      {
        id: "ai",
        judul: "AI feature results",
        isi: [
          "CV reviews, career suggestions, career switch plans, and mock interview scores are generated automatically. They can be wrong and don't replace professional judgement.",
        ],
      },
      {
        id: "tautan",
        judul: "Links to other sites & affiliate links",
        isi: [
          "Jobly links to third-party sites, including original job pages. We don't control their content or privacy practices.",
          "Some links to courses, bootcamps, and coaching services are affiliate links. If you buy through them, Jobly may earn a commission at no extra cost to you.",
        ],
      },
    ],
  },
};

export const DOKUMEN = bahasa() === "en" ? DOKUMEN_EN : DOKUMEN_ID;
