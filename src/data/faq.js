/**
 * Pertanyaan yang sering diajukan. Dipakai di halaman /faq (semua grup)
 * dan cuplikannya di Beranda (yang bertanda `beranda: true`).
 *
 * Jawaban berupa array paragraf. Harga & masa berlaku diambil dari
 * data/paket.js supaya tidak pernah berbeda dengan halaman paket.
 */
import { PAKET, rupiah, labelDurasi } from "./paket";

const p = (id) => PAKET[id];
const hargaRingkas = ["coba", "aktif", "serius"]
  .map((id) => `${p(id).nama} ${rupiah(p(id).harga)} (berlaku ${labelDurasi(p(id).durasiHari)})`)
  .join(", ");

export const FAQ = [
  {
    grup: "Tentang Jobly",
    items: [
      {
        q: "Apa itu Jobly?",
        beranda: true,
        a: [
          "Jobly mengumpulkan lowongan kerja dari situs karier resmi perusahaan dan platform kerja seperti LinkedIn dan Indeed ke dalam satu pencarian. Lowongan diperbarui otomatis setiap hari.",
          "Selain mencari loker, kamu bisa menyusun CV, merapikan profil LinkedIn, berlatih pertanyaan interview, dan memakai alat AI untuk meninjau CV serta simulasi interview.",
        ],
      },
      {
        q: "Apakah mencari loker di Jobly gratis?",
        beranda: true,
        a: [
          "Ya. Semua lowongan bisa dicari dan dibuka tanpa biaya dan tanpa perlu mendaftar. Akun gratis juga sudah mencakup CV Builder, LinkedIn Builder, bank 100+ pertanyaan interview, loker tersimpan, dan pelacak lamaran.",
          "Yang berbayar hanya fitur yang memakai AI: Review CV, Pindah Karier, dan Simulasi Interview.",
        ],
      },
      {
        q: "Dari mana lowongan di Jobly berasal?",
        a: [
          "Dari dua jenis sumber: situs karier resmi perusahaan (misalnya halaman karier bank, BUMN, dan perusahaan teknologi) serta platform lowongan publik seperti LinkedIn dan Indeed. Setiap lowongan menampilkan sumbernya.",
          "Jobly tidak membuat atau mengubah isi lowongan. Informasi yang tampil adalah salinan dari sumber aslinya pada saat dikumpulkan.",
        ],
      },
      {
        q: "Bagaimana cara melamar?",
        beranda: true,
        a: [
          "Buka detail lowongan, lalu klik tombol Lamar. Kamu akan diarahkan ke halaman lowongan di sumber aslinya, dan proses lamaran sepenuhnya dilakukan di sana. Jobly tidak menerima, meneruskan, atau menyeleksi lamaran.",
        ],
      },
      {
        q: "Kenapa ada lowongan yang ternyata sudah ditutup?",
        a: [
          "Lowongan dikumpulkan secara otomatis, sehingga ada jeda antara saat perusahaan menutup lowongan dan saat lowongan itu hilang dari Jobly. Selalu periksa status dan tenggat di halaman sumbernya sebelum melamar.",
        ],
      },
      {
        q: "Ada yang meminta uang untuk proses rekrutmen. Apakah itu dari Jobly?",
        a: [
          "Bukan. Jobly tidak pernah memungut biaya dari pelamar dan tidak bekerja atas nama perusahaan mana pun. Perusahaan yang sah juga tidak meminta biaya tes, pelatihan, seragam, atau tiket perjalanan sebagai syarat diterima. Kalau ada pihak yang meminta, jangan transfer dan laporkan lowongan tersebut.",
        ],
      },
    ],
  },
  {
    grup: "Akun & fitur",
    items: [
      {
        q: "Apakah saya perlu membuat akun?",
        a: [
          "Tidak untuk mencari dan membuka loker. Akun diperlukan untuk menyimpan loker, mencatat lamaran, menyimpan CV di CV Builder, dan memakai fitur AI.",
        ],
      },
      {
        q: "Apa yang dilakukan Review CV dengan AI?",
        a: [
          "AI membaca CV atau profil LinkedIn yang kamu unggah, lalu memberi skor kesesuaian dengan sistem penyaringan (ATS), menunjukkan bagian yang melemahkan CV, dan menyusun versi perbaikan dalam bahasa Indonesia dan Inggris. Hasilnya tersimpan di riwayat akunmu.",
          "Hasil AI adalah saran. Periksa kembali setiap isinya sebelum dipakai untuk melamar.",
        ],
      },
      {
        q: "Bagaimana simulasi interview bekerja?",
        a: [
          "Kamu berbicara langsung dengan pewawancara AI lewat mikrofon, seperti interview sungguhan. Pertanyaannya menyesuaikan posisi yang kamu incar. Di akhir sesi kamu mendapat penilaian dan masukan berdasarkan jawabanmu.",
          "Simulasi membutuhkan izin mikrofon di browser. Kalau koneksi suara gagal tersambung atau sesi berakhir tanpa jawaban darimu, kuota simulasi dikembalikan otomatis.",
        ],
      },
    ],
  },
  {
    grup: "Paket & pembayaran",
    items: [
      {
        q: "Berapa harga paket berbayar?",
        beranda: true,
        a: [
          `Tersedia tiga paket: ${hargaRingkas}. Setiap paket berisi kuota Review CV, dan paket Pro serta Max juga berisi kuota Pindah Karier dan Simulasi Interview.`,
          "Pembayaran dilakukan sekali untuk setiap pembelian. Tidak ada tagihan berulang dan tidak ada perpanjangan otomatis.",
        ],
      },
      {
        q: "Metode pembayaran apa saja yang bisa dipakai?",
        a: [
          "Pembayaran diproses oleh Midtrans. Metode yang tersedia ditampilkan di halaman pembayaran, umumnya meliputi QRIS, dompet digital, transfer virtual account, dan kartu. Jobly tidak menyimpan data kartu atau rekeningmu.",
        ],
      },
      {
        q: "Apa yang terjadi saat masa berlaku paket habis?",
        a: [
          "Sisa kuota Review CV tetap bisa kamu pakai. Fitur Pindah Karier dan Simulasi Interview membutuhkan paket yang masih berlaku, jadi sisa kuota keduanya baru bisa dipakai lagi setelah kamu membeli paket baru.",
          "Semua fitur gratis — termasuk seluruh loker, CV Builder, dan riwayat analisis — tetap bisa diakses.",
        ],
      },
      {
        q: "Pembayaran sudah berhasil, tapi kuota belum bertambah.",
        a: [
          "Konfirmasi dari Midtrans biasanya masuk dalam beberapa detik sampai beberapa menit. Muat ulang halaman setelah pembayaran selesai. Kalau dalam 1×24 jam kuota belum bertambah, hubungi kami dengan menyertakan email akun dan nomor pesanan dari Midtrans.",
        ],
      },
      {
        q: "Apakah pembayaran bisa dikembalikan?",
        a: [
          "Karena berupa layanan digital yang langsung aktif, pembelian paket pada umumnya tidak dapat dibatalkan. Pengecualiannya adalah tagihan ganda untuk satu pesanan dan kuota yang tidak bertambah meski pembayaran berhasil. Rinciannya ada di Syarat & Ketentuan.",
        ],
      },
    ],
  },
  {
    grup: "Data & privasi",
    items: [
      {
        q: "Apakah CV saya aman?",
        beranda: true,
        a: [
          "CV dan data profilmu disimpan di akunmu dan tidak dijual atau dibagikan ke perusahaan pemberi kerja. Untuk fitur AI, teks CV dikirim ke penyedia AI (Google Gemini) hanya untuk diproses.",
          "Sebaiknya jangan mencantumkan data yang tidak diperlukan untuk melamar, seperti NIK, nomor rekening, atau foto KTP, di CV yang kamu analisis. Selengkapnya ada di Kebijakan Privasi.",
        ],
      },
      {
        q: "Bagaimana cara menghapus akun dan data saya?",
        a: [
          "Kirim permintaan penghapusan dari email yang terdaftar di akunmu ke kontak yang tercantum di Kebijakan Privasi. Kami akan menghapus akun beserta CV, riwayat analisis, dan data lamaran yang tersimpan.",
        ],
      },
    ],
  },
];

export const FAQ_BERANDA = FAQ.flatMap((g) => g.items).filter((i) => i.beranda);
