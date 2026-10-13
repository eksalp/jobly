/**
 * Pertanyaan yang sering diajukan. Dipakai di halaman /faq (semua grup)
 * dan cuplikannya di Beranda (yang bertanda `beranda: true`).
 *
 * Jawaban berupa array paragraf. Harga & masa berlaku diambil dari
 * data/paket.js supaya tidak pernah berbeda dengan halaman paket.
 * Setiap teks ditulis dua bahasa lewat t(indonesia, inggris).
 */
import { PAKET, rupiah, labelDurasi } from "./paket";
import { t } from "../i18n.js";

const p = (id) => PAKET[id];
const hargaRingkas = ["coba", "aktif", "serius"]
  .map((id) => t(`${p(id).nama} ${rupiah(p(id).harga)} (berlaku ${labelDurasi(p(id).durasiHari)})`, `${p(id).nama} ${rupiah(p(id).harga)} (valid ${labelDurasi(p(id).durasiHari)})`))
  .join(", ");

export const FAQ = [
  {
    grup: t("Tentang Jobly", "About Jobly"),
    items: [
      {
        q: t("Apa itu Jobly?", "What is Jobly?"),
        beranda: true,
        a: [
          t(
            "Jobly mengumpulkan lowongan dari situs karier resmi perusahaan dan platform kerja seperti LinkedIn dan Indeed, jadi kamu cukup cari di satu tempat. Lowongannya diperbarui otomatis setiap hari.",
            "Jobly collects openings from official company career sites and job platforms like LinkedIn and Indeed, so you can search in one place. Listings update automatically every day.",
          ),
          t(
            "Selain cari loker, kamu juga bisa bikin CV, merapikan profil LinkedIn, latihan pertanyaan interview, sampai simulasi interview dengan AI.",
            "Besides searching for jobs, you can build a CV, polish your LinkedIn profile, practise interview questions, and even do a mock interview with AI.",
          ),
        ],
      },
      {
        q: t("Apakah mencari loker di Jobly gratis?", "Is searching for jobs on Jobly free?"),
        beranda: true,
        a: [
          t(
            "Ya. 5.000 lowongan terbaru, diambil merata dari setiap sumber, bisa dicari dan dibuka gratis tanpa perlu daftar. Akun gratis juga sudah mencakup CV Builder, LinkedIn Builder, bank 140+ pertanyaan interview, Cek Loker Palsu, Peta Gaji, Rencana Lamar, loker tersimpan, dan pelacak lamaran.",
            "Yes. The 5,000 newest jobs, taken evenly from every source, can be searched and opened for free without signing up. A free account also includes the CV Builder, LinkedIn Builder, a bank of 140+ interview questions, the Fake Job Checker, Salary Map, Application Plan, saved jobs, and an application tracker.",
          ),
          t(
            "Paket berbayar (mulai Rp 9.000, sekali bayar) membuka seluruh loker di atas 5.000 serta fitur yang memakai AI: Review CV, Pindah Karier, dan Simulasi Interview.",
            "Paid plans (from Rp 9,000, one-time) unlock every job beyond the first 5,000 plus the AI features: CV Review, Career Switch, and Mock Interview.",
          ),
        ],
      },
      {
        q: t("Dari mana lowongan di Jobly berasal?", "Where do Jobly's jobs come from?"),
        a: [
          t(
            "Dari dua jenis sumber: situs karier resmi perusahaan (misalnya halaman karier bank, BUMN, dan perusahaan teknologi) serta platform lowongan publik seperti LinkedIn dan Indeed. Setiap lowongan menampilkan sumbernya.",
            "From two kinds of sources: official company career sites (for example the career pages of banks, state-owned enterprises, and tech companies) and public job platforms like LinkedIn and Indeed. Every job shows its source.",
          ),
          t(
            "Jobly tidak membuat atau mengubah isi lowongan. Informasi yang tampil adalah salinan dari sumber aslinya pada saat dikumpulkan.",
            "Jobly doesn't write or edit job posts. What you see is a copy of the original source at the time it was collected.",
          ),
        ],
      },
      {
        q: t("Bagaimana cara melamar?", "How do I apply?"),
        beranda: true,
        a: [
          t(
            "Buka detail lowongan, lalu klik tombol Lamar. Kamu akan dibawa ke halaman loker di situs aslinya, dan semua proses lamaran dilakukan di sana. Jobly tidak menerima, meneruskan, atau menyeleksi lamaran.",
            "Open the job details and click Apply. You'll be taken to the job page on the original site, and the whole application happens there. Jobly doesn't receive, forward, or screen applications.",
          ),
        ],
      },
      {
        q: t("Kenapa ada lowongan yang ternyata sudah ditutup?", "Why are some jobs already closed?"),
        a: [
          t(
            "Lowongan dikumpulkan otomatis, jadi kadang ada jeda antara saat perusahaan menutup lowongan dan saat lowongan itu hilang dari Jobly. Sebelum melamar, cek dulu status dan batas waktunya di situs aslinya.",
            "Jobs are collected automatically, so there can be a delay between a company closing a job and it disappearing from Jobly. Before applying, check the status and deadline on the original site.",
          ),
        ],
      },
      {
        q: t("Ada yang meminta uang untuk proses rekrutmen. Apakah itu dari Jobly?", "Someone asked me for money during hiring. Is that Jobly?"),
        a: [
          t(
            "Bukan. Jobly tidak pernah memungut biaya dari pelamar dan tidak bekerja atas nama perusahaan mana pun. Perusahaan yang sah juga tidak meminta biaya tes, pelatihan, seragam, atau tiket perjalanan sebagai syarat diterima. Kalau ada pihak yang meminta, jangan transfer dan laporkan lowongan tersebut.",
            "No. Jobly never charges applicants and doesn't act on behalf of any company. Legitimate employers don't ask for test, training, uniform, or travel fees as a condition of hiring. If someone asks, don't transfer anything and report the job.",
          ),
        ],
      },
    ],
  },
  {
    grup: t("Akun & fitur", "Account & features"),
    items: [
      {
        q: t("Apakah saya perlu membuat akun?", "Do I need an account?"),
        a: [
          t(
            "Tidak untuk mencari dan membuka loker. Akun diperlukan untuk menyimpan loker, mencatat lamaran, menyimpan CV di CV Builder, dan memakai fitur AI.",
            "Not to search and open jobs. You need an account to save jobs, log applications, keep your CV in the CV Builder, and use the AI features.",
          ),
        ],
      },
      {
        q: t("Apa yang dilakukan Review CV dengan AI?", "What does the AI CV Review do?"),
        a: [
          t(
            "AI membaca CV atau profil LinkedIn yang kamu unggah, lalu memberi skor kesesuaian dengan sistem penyaringan (ATS), menunjukkan bagian yang melemahkan CV, dan menyusun versi perbaikan dalam bahasa Indonesia dan Inggris. Hasilnya tersimpan di riwayat akunmu.",
            "The AI reads the CV or LinkedIn profile you upload, scores how well it works with applicant tracking systems (ATS), points out the weak parts, and writes an improved version in Indonesian and English. Results are saved to your account history.",
          ),
          t(
            "Hasil AI adalah saran. Periksa kembali setiap isinya sebelum dipakai untuk melamar.",
            "AI results are suggestions. Review everything before you use it to apply.",
          ),
        ],
      },
      {
        q: t("Bagaimana simulasi interview bekerja?", "How does the mock interview work?"),
        a: [
          t(
            "Kamu berbicara langsung dengan pewawancara AI lewat mikrofon, seperti interview sungguhan. Pertanyaannya menyesuaikan posisi yang kamu incar. Di akhir sesi kamu mendapat penilaian dan masukan berdasarkan jawabanmu.",
            "You talk with an AI interviewer through your microphone, just like a real interview. Questions are tailored to the role you're aiming for. At the end you get a score and feedback based on your answers.",
          ),
          t(
            "Simulasi membutuhkan izin mikrofon di browser. Kalau koneksi suara gagal tersambung atau sesi berakhir tanpa jawaban darimu, kuota simulasi dikembalikan otomatis.",
            "The mock interview needs microphone permission in your browser. If the voice connection fails or the session ends without any answer from you, the credit is refunded automatically.",
          ),
        ],
      },
    ],
  },
  {
    grup: t("Paket & pembayaran", "Plans & payment"),
    items: [
      {
        q: t("Berapa harga paket berbayar?", "How much are the paid plans?"),
        beranda: true,
        a: [
          t(
            `Tersedia tiga paket: ${hargaRingkas}. Setiap paket berisi kuota Review CV, dan paket Pro serta Max juga berisi kuota Pindah Karier dan Simulasi Interview.`,
            `There are three plans: ${hargaRingkas}. Every plan includes CV Review credits, and Pro and Max also include Career Switch and Mock Interview credits.`,
          ),
          t(
            "Pembayaran dilakukan sekali untuk setiap pembelian. Tidak ada tagihan berulang dan tidak ada perpanjangan otomatis.",
            "Each purchase is a one-time payment. There are no recurring charges and nothing renews automatically.",
          ),
        ],
      },
      {
        q: t("Metode pembayaran apa saja yang bisa dipakai?", "Which payment methods are accepted?"),
        a: [
          t(
            "Pembayaran lewat QRIS, yang diproses oleh Midtrans. Kamu bisa scan pakai aplikasi bank atau dompet digital apa saja, seperti GoPay, OVO, DANA, atau ShopeePay. Jobly tidak menyimpan data rekeningmu.",
            "Payment is by QRIS, processed by Midtrans. Scan it with any Indonesian banking or e-wallet app, such as GoPay, OVO, DANA, or ShopeePay. Jobly doesn't store your account details.",
          ),
        ],
      },
      {
        q: t("Apa yang terjadi saat masa berlaku paket habis?", "What happens when my plan expires?"),
        a: [
          t(
            "Sisa kuota Review CV tetap bisa kamu pakai. Fitur Pindah Karier dan Simulasi Interview membutuhkan paket yang masih berlaku, jadi sisa kuota keduanya baru bisa dipakai lagi setelah kamu membeli paket baru.",
            "You can still use any remaining CV Review credits. Career Switch and Mock Interview need an active plan, so their remaining credits work again once you buy a new plan.",
          ),
          t(
            "Semua fitur gratis tetap bisa kamu pakai, termasuk 5.000 loker, CV Builder, dan riwayat analisis. Loker di atas 5.000 kembali terkunci sampai kamu membeli paket baru.",
            "All free features keep working, including 5,000 jobs, the CV Builder, and your analysis history. Jobs beyond 5,000 lock again until you buy a new plan.",
          ),
        ],
      },
      {
        q: t("Pembayaran sudah berhasil, tapi kuota belum bertambah.", "I paid, but my credits didn't go up."),
        a: [
          t(
            "Konfirmasi pembayaran biasanya masuk dalam hitungan detik sampai beberapa menit. Setelah bayar, coba muat ulang halaman. Kalau dalam 1×24 jam kuota belum bertambah, hubungi kami dengan menyertakan email akun dan nomor pesanan dari Midtrans.",
            "Payment confirmation usually arrives within seconds to a few minutes. After paying, try reloading the page. If your credits still haven't updated after 24 hours, contact us with your account email and the Midtrans order number.",
          ),
        ],
      },
      {
        q: t("Apakah pembayaran bisa dikembalikan?", "Can I get a refund?"),
        a: [
          t(
            "Karena paket langsung aktif setelah dibayar, pembelian umumnya tidak bisa dibatalkan. Pengecualiannya adalah tagihan ganda untuk satu pesanan dan kuota yang tidak bertambah meski pembayaran berhasil. Rinciannya ada di Syarat & Ketentuan.",
            "Because plans activate as soon as they're paid, purchases generally can't be cancelled. The exceptions are a double charge for one order and credits that never arrived despite a successful payment. Details are in the Terms of Service.",
          ),
        ],
      },
    ],
  },
  {
    grup: t("Data & privasi", "Data & privacy"),
    items: [
      {
        q: t("Apakah CV saya aman?", "Is my CV safe?"),
        beranda: true,
        a: [
          t(
            "CV dan data profilmu disimpan di akunmu dan tidak dijual atau dibagikan ke perusahaan pemberi kerja. Untuk fitur AI, teks CV dikirim ke penyedia AI (Google Gemini) hanya untuk diproses.",
            "Your CV and profile data stay in your account and are never sold or shared with employers. For AI features, the CV text is sent to the AI provider (Google Gemini) only to be processed.",
          ),
          t(
            "Sebaiknya jangan mencantumkan data yang tidak diperlukan untuk melamar, seperti NIK, nomor rekening, atau foto KTP, di CV yang kamu analisis. Selengkapnya ada di Kebijakan Privasi.",
            "Avoid putting data you don't need for applying, like your national ID number, bank account number, or ID card photo, in a CV you analyse. More in the Privacy Policy.",
          ),
        ],
      },
      {
        q: t("Bagaimana cara menghapus akun dan data saya?", "How do I delete my account and data?"),
        a: [
          t(
            "Kirim permintaan penghapusan dari email yang terdaftar di akunmu ke kontak yang tercantum di Kebijakan Privasi. Kami akan menghapus akun beserta CV, riwayat analisis, dan data lamaran yang tersimpan.",
            "Send a deletion request from your account's email address to the contact listed in the Privacy Policy. We'll delete your account along with your CV, analysis history, and saved application data.",
          ),
        ],
      },
    ],
  },
];

export const FAQ_BERANDA = FAQ.flatMap((g) => g.items).filter((i) => i.beranda);
