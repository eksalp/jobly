import { t as _ } from "../../../i18n.js";

/** Detail kerja nyata, kategori Data & Analisis. */
export default {
  "data-entry": {
    tugas: [
      {
        dari: { nama: "Mbak Vina", peran: _("Admin CRM, toko online", "CRM admin, online shop") },
        kanal: "WhatsApp",
        tenggat: _("Hari ini, 16.00", "Today, 4 pm"),
        revisi: {
          pesan: _("Makasih! Tanggalnya ternyata format Amerika, jadi 3/1/24 itu 1 Maret. Dan tim marketing minta nomor HP diawali 08, bukan 62, karena dipakai untuk WhatsApp manual. Bisa diubah?", "Thanks! The dates are actually US format, so 3/1/24 is 1 March. And marketing wants phone numbers starting with 08, not 62, for manual WhatsApp. Can you change it?"),
          petunjuk: [
            _("Ubah tanggal Budi Santoso menjadi 2024-03-01", "Change Budi Santoso's date to 2024-03-01"),
            _("Ubah format nomor HP menjadi diawali 08", "Change phone numbers to start with 08"),
            _("Perbarui aturan pembersihan agar konsisten untuk ribuan baris berikutnya", "Update the cleaning rules for the next thousands of rows"),
          ],
        },
      },
      {
        dari: { nama: "Pak Darmawan", peran: _("Pemilik toko alat kantor", "Office supplies shop owner") },
        kanal: "Email",
        tenggat: _("Besok pagi", "Tomorrow morning"),
        revisi: {
          pesan: _("Bagus. Untuk 300 invoice berikutnya, tolong tambahkan kolom \"Status Bayar\" dan pisahkan PPN di kolom sendiri per baris item, karena akuntan saya butuh itu.", "Great. For the next 300 invoices, please add a \"Payment Status\" column and split VAT into its own column per line item, as my accountant needs it."),
          petunjuk: [
            _("Tambahkan kolom Status Bayar dan jelaskan sumber datanya", "Add a Payment Status column and explain its data source"),
            _("Hitung PPN per item (11% dari jumlah per item)", "Calculate VAT per item (11% of each line amount)"),
            _("Pastikan total PPN per invoice tetap sama dengan invoice asli", "Make sure total VAT per invoice still matches the original"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Proyek input data 2.000 produk", "A 2,000-product data entry project"),
      konteks: _("Kamu memasukkan data 2.000 produk dari katalog PDF ke spreadsheet untuk toko online. Tenggat 3 hari, dibayar per 100 produk.", "You're entering 2,000 products from a PDF catalogue into a spreadsheet for an online shop. 3-day deadline, paid per 100 products."),
      langkah: [
        {
          waktu: _("Hari 1, 08.30", "Day 1, 8:30"),
          dari: { nama: "Mbak Vina", peran: _("Klien", "Client") },
          kanal: "WhatsApp",
          pesan: _("Kolomnya: nama produk, SKU, harga, berat, kategori. Sudah ya, langsung mulai saja.", "Columns: product name, SKU, price, weight, category. That's it, go ahead."),
          pilihan: [
            { teks: _("Langsung input semua data", "Start entering everything"), skor: 1, umpan: _("Bisa, tetapi format harga, berat, dan daftar kategori belum jelas. Risiko revisi besar.", "Possible, but price, weight, and category formats are unclear. Big rework risk.") },
            { teks: _("Input 20 produk sebagai contoh, kirim ke klien, dan tanyakan format harga, satuan berat, dan daftar kategori", "Enter 20 products as a sample, send it, and ask about price format, weight unit, and category list"), skor: 2, umpan: _("Sampel kecil di awal mencegah mengulang 2.000 data.", "A small early sample prevents redoing 2,000 rows.") },
            { teks: _("Tunggu sampai klien mengirim aturan lengkap", "Wait until the client sends full rules"), skor: 0, umpan: _("Klien sudah bilang mulai. Menunggu pasif membuang waktu tenggat.", "The client said go. Passive waiting burns deadline time.") },
          ],
        },
        {
          waktu: _("Hari 1, 14.00", "Day 1, 2:00 pm"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Ada 35 produk di katalog tanpa harga.", "35 catalogue products have no price."),
          pilihan: [
            { teks: _("Isi dengan harga produk yang mirip", "Fill in prices from similar products"), skor: 0, umpan: _("Harga karangan bisa membuat toko rugi.", "Invented prices could cost the shop money.") },
            { teks: _("Kosongkan dan beri warna, lalu kirim daftar SKU-nya ke klien di akhir hari", "Leave them blank and highlighted, then send the SKU list to the client at day's end"), skor: 2, umpan: _("Transparan dan efisien, satu daftar untuk semua pertanyaan.", "Transparent and efficient, one list for all questions.") },
            { teks: _("Tanya klien setiap kali menemukan satu", "Message the client each time you find one"), skor: 1, umpan: _("Benar untuk bertanya, tetapi 35 pesan terpisah mengganggu klien.", "Right to ask, but 35 separate messages annoy the client.") },
          ],
        },
        {
          waktu: _("Hari 2, 10.00", "Day 2, 10:00"),
          dari: { nama: "Mbak Vina", peran: _("Klien", "Client") },
          kanal: "WhatsApp",
          pesan: _("Bisa sekalian tambahkan deskripsi produk 2 kalimat untuk semua produk? Bayarannya sama ya.", "Could you also add a 2-sentence description for every product? Same pay."),
          pilihan: [
            { teks: _("Terima karena ingin klien senang", "Accept to keep the client happy"), skor: 0, umpan: _("Menulis 2.000 deskripsi adalah pekerjaan besar yang berbeda. Kamu juga berisiko melewati tenggat.", "Writing 2,000 descriptions is big, different work. You'd also risk the deadline.") },
            { teks: _("\"Bisa, tapi itu pekerjaan menulis tambahan. Tarifnya Rp... per 100 produk dan butuh 4 hari lagi. Mau saya selesaikan input data dulu sesuai tenggat?\"", "\"I can, but that's extra writing work. It's Rp... per 100 products and needs 4 more days. Shall I finish the data entry on time first?\""), skor: 2, umpan: _("Jelas soal ruang lingkup, harga, dan waktu, tanpa menolak peluang.", "Clear on scope, price, and time without refusing the opportunity.") },
            { teks: _("Tolak tanpa penjelasan", "Decline without explanation"), skor: 1, umpan: _("Kamu melindungi waktumu, tetapi kehilangan peluang pekerjaan tambahan.", "You protected your time but lost extra work.") },
          ],
        },
        {
          waktu: _("Hari 3, 15.00", "Day 3, 3:00 pm"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Semua data selesai. Sebelum dikirim...", "All data done. Before sending..."),
          pilihan: [
            { teks: _("Jalankan pengecekan: duplikat SKU, harga nol atau kosong, dan cocokkan 50 baris acak dengan katalog", "Run checks: duplicate SKUs, zero or blank prices, and match 50 random rows with the catalogue"), skor: 2, umpan: _("Pengecekan sistematis menangkap kesalahan sebelum klien menemukannya.", "Systematic checks catch errors before the client does.") },
            { teks: _("Scroll cepat dari atas ke bawah", "Scroll quickly top to bottom"), skor: 1, umpan: _("Lebih baik dari tidak sama sekali, tetapi mata mudah melewatkan kesalahan di 2.000 baris.", "Better than nothing, but eyes miss errors in 2,000 rows.") },
            { teks: _("Langsung kirim", "Send immediately"), skor: 0, umpan: _("Kesalahan yang ditemukan klien jauh lebih merugikan reputasimu.", "Errors the client finds hurt your reputation far more.") },
          ],
        },
      ],
    },
  },

  "anotasi-data-ai": {
    tugas: [
      {
        dari: { nama: _("Panduan proyek", "Project guidelines") , peran: _("Platform anotasi", "Annotation platform") },
        kanal: "Email",
        tenggat: _("Rata-rata 8 menit per tugas", "Average 8 minutes per task"),
        revisi: {
          pesan: _("Masukan reviewer: penilaianmu benar, tetapi alasan harus menyebut kriteria dari panduan secara eksplisit dan maksimal 3 kalimat. Silakan perbaiki alasanmu.", "Reviewer feedback: your ratings are right, but the rationale must cite the guideline criteria explicitly and be 3 sentences max. Please fix your rationale."),
          petunjuk: [
            _("Sebut nama kriteria (akurasi, kegunaan, keamanan) di alasan", "Name the criteria (accuracy, helpfulness, safety) in the rationale"),
            _("Ringkas menjadi maksimal 3 kalimat", "Cut to 3 sentences max"),
            _("Hindari opini pribadi yang tidak terkait panduan", "Avoid personal opinions unrelated to the guidelines"),
          ],
        },
      },
      {
        dari: { nama: _("Panduan proyek", "Project guidelines"), peran: _("Platform anotasi", "Annotation platform") },
        kanal: "Email",
        tenggat: _("Rata-rata 1 menit per ulasan", "Average 1 minute per review"),
        revisi: {
          pesan: _("Pembaruan panduan: label \"Netral\" sekarang tersedia untuk ulasan yang tidak memuji ataupun mengeluh. Mohon tinjau ulang label untuk keempat ulasan.", "Guideline update: a \"Neutral\" label is now available for reviews that neither praise nor complain. Please review your labels for all four."),
          petunjuk: [
            _("Terapkan label baru hanya pada ulasan yang memang netral", "Apply the new label only to truly neutral reviews"),
            _("Jangan ubah label yang sudah benar", "Don't change labels that are already right"),
            _("Tulis alasan singkat untuk label yang berubah", "Give a short reason for any changed label"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Satu sesi kerja di platform anotasi", "One work session on an annotation platform"),
      konteks: _("Kamu anotator untuk proyek evaluasi chatbot berbahasa Indonesia. Skor kualitasmu 92%, batas minimal proyek 90%.", "You annotate for an Indonesian chatbot evaluation project. Your quality score is 92%; the project minimum is 90%."),
      langkah: [
        {
          waktu: "09.00",
          dari: { nama: _("Notifikasi platform", "Platform notice") },
          kanal: "Email",
          pesan: _("Panduan proyek diperbarui (versi 3.2). Perubahan pada cara menilai jawaban yang menolak permintaan.", "Project guidelines updated (v3.2). Changes to rating answers that decline a request."),
          pilihan: [
            { teks: _("Baca bagian yang berubah sebelum mengambil tugas", "Read the changed section before taking tasks"), skor: 2, umpan: _("Tugas setelah pembaruan dinilai dengan panduan baru.", "Tasks after the update are scored against the new rules.") },
            { teks: _("Langsung kerjakan, nanti dibaca", "Start working, read later"), skor: 0, umpan: _("Skor kualitas bisa turun di bawah batas karena memakai aturan lama.", "Your score could drop below the minimum using old rules.") },
            { teks: _("Baca judulnya saja", "Just read the headline"), skor: 1, umpan: _("Kamu tahu ada perubahan, tetapi tidak tahu detailnya.", "You know something changed, not what.") },
          ],
        },
        {
          waktu: "10.15",
          dari: { nama: _("Tugas #4471", "Task #4471") },
          kanal: "Email",
          pesan: _("Pertanyaan pengguna berbahasa campuran Jawa dan Indonesia. Kamu tidak yakin arti satu kata.", "The user's question mixes Javanese and Indonesian. You're unsure of one word."),
          pilihan: [
            { teks: _("Tebak artinya dan lanjutkan", "Guess and move on"), skor: 0, umpan: _("Tebakan salah bisa membuat penilaianmu keliru.", "A wrong guess can skew your rating.") },
            { teks: _("Gunakan fitur lewati atau tandai sesuai panduan untuk tugas di luar kemampuan bahasamu", "Use the skip or flag feature per the guidelines for tasks outside your language skill"), skor: 2, umpan: _("Platform biasanya lebih menghargai lewati daripada jawaban yang salah.", "Platforms usually prefer skips over wrong answers.") },
            { teks: _("Tanyakan di grup anotator sambil menempel isi tugas", "Ask in an annotator group, pasting the task"), skor: 1, umpan: _("Bertanya boleh, tetapi menempel isi tugas di luar platform melanggar kerahasiaan.", "Asking is fine, but pasting task content outside breaks confidentiality.") },
          ],
        },
        {
          waktu: "13.00",
          dari: { nama: _("Teman sesama anotator", "Fellow annotator") },
          kanal: "WhatsApp",
          pesan: _("Pakai ChatGPT aja buat nulis alasan, lebih cepat. Aku udah 2 minggu begitu.", "Just use ChatGPT for rationales, it's faster. I've been doing it for 2 weeks."),
          pilihan: [
            { teks: _("Ikut memakai AI agar lebih cepat", "Start using AI to go faster"), skor: 0, umpan: _("Banyak proyek melarang AI dan mendeteksinya. Akun bisa diblokir dan bayaran ditahan.", "Many projects ban and detect AI use. Accounts get banned and pay withheld.") },
            { teks: _("Cek aturan proyek soal alat AI, dan tetap menulis sendiri jika dilarang", "Check the project's AI rules, and keep writing yourself if banned"), skor: 2, umpan: _("Mematuhi aturan melindungi akun dan penghasilanmu.", "Following rules protects your account and income.") },
            { teks: _("Pakai AI hanya untuk sebagian tugas", "Use AI for only some tasks"), skor: 0, umpan: _("Pelanggaran sebagian tetap pelanggaran.", "A partial violation is still a violation.") },
          ],
        },
        {
          waktu: "16.00",
          dari: { nama: _("Notifikasi platform", "Platform notice") },
          kanal: "Email",
          pesan: _("Skor kualitasmu turun menjadi 89% minggu ini. 6 tugas ditandai tidak sesuai panduan.", "Your quality score fell to 89% this week. 6 tasks were flagged as off-guideline."),
          pilihan: [
            { teks: _("Pelajari 6 tugas itu, cari polanya, perlambat sementara sampai skor kembali naik", "Study the 6 tasks, find the pattern, and slow down until the score recovers"), skor: 2, umpan: _("Pendekatan yang paling cepat memulihkan akses ke proyek.", "The fastest way to restore project access.") },
            { teks: _("Kerjakan lebih banyak tugas agar skor naik", "Do more tasks to raise the score"), skor: 0, umpan: _("Tanpa memperbaiki kesalahan, skor bisa makin turun.", "Without fixing the errors, the score may fall further.") },
            { teks: _("Ajukan banding untuk semua tugas yang ditandai", "Appeal every flagged task"), skor: 1, umpan: _("Banding boleh untuk yang benar-benar keliru, tetapi pelajari dulu alasannya.", "Appeal genuine mistakes, but study the reasons first.") },
          ],
        },
      ],
    },
  },

  "visualisasi-data": {
    tugas: [
      {
        dari: { nama: "Kak Nadia", peran: _("Pemilik toko online fashion", "Online fashion shop owner") },
        kanal: "WhatsApp",
        tenggat: _("Senin depan", "Next Monday"),
        revisi: {
          pesan: _("Suka rancangannya! Tapi saya sering lihat dari HP. Dan saya juga mau tahu produk mana yang paling sering diretur. Bisa disesuaikan?", "Love the design! But I mostly check on my phone. I also want to know which products get returned most. Can you adjust?"),
          petunjuk: [
            _("Susun ulang tata letak agar nyaman di layar HP (satu kolom, KPI di atas)", "Rearrange for phone screens (one column, KPIs on top)"),
            _("Tambahkan grafik produk dengan retur terbanyak", "Add a chart of most-returned products"),
            _("Pertahankan jawaban 1 menit untuk pertanyaan awal klien", "Keep the 1-minute answer to the original questions"),
          ],
        },
      },
      {
        dari: { nama: "Pak Gunawan", peran: _("Direktur penjualan", "Sales director") },
        kanal: "Email",
        tenggat: _("Besok, sebelum rapat direksi 09.00", "Tomorrow, before the 9 am board meeting"),
        revisi: {
          pesan: _("Bagus. Direksi pasti bertanya: apakah penurunan Jakarta karena pasar atau karena tim kita? Data tambahan: jumlah sales Jakarta turun dari 12 menjadi 9 orang sejak Q2.", "Good. The board will ask: is Jakarta's decline the market or our team? Extra data: Jakarta sales headcount dropped from 12 to 9 since Q2."),
          petunjuk: [
            _("Hitung penjualan per orang sales di Jakarta untuk Q1 dan Q3", "Calculate sales per salesperson in Jakarta for Q1 and Q3"),
            _("Tarik kesimpulan yang hati-hati dari data tersebut", "Draw a careful conclusion from the data"),
            _("Sebutkan data lain yang dibutuhkan untuk memastikan", "Name other data needed to be sure"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Minggu pertama sebagai analis dashboard", "First week as a dashboard analyst"),
      konteks: _("Kamu baru bergabung secara remote di perusahaan distribusi. Tugas pertamamu: memperbaiki dashboard penjualan mingguan.", "You've just joined a distribution company remotely. First task: fix the weekly sales dashboard."),
      langkah: [
        {
          waktu: _("Senin 09.30", "Monday 9:30"),
          dari: { nama: "Pak Gunawan", peran: _("Direktur penjualan", "Sales director") },
          kanal: "Slack",
          pesan: _("Angka di dashboard beda dengan laporan keuangan. Orang jadi tidak percaya. Tolong cek.", "The dashboard numbers differ from finance's report. People don't trust it. Please check."),
          pilihan: [
            { teks: _("Langsung samakan angkanya dengan laporan keuangan", "Just force the numbers to match finance"), skor: 0, umpan: _("Menyamakan angka tanpa tahu penyebabnya menutupi masalah.", "Forcing a match hides the underlying issue.") },
            { teks: _("Bandingkan definisi pendapatan di keduanya (sebelum atau sesudah diskon, retur, pajak), lalu laporkan penyebab selisihnya", "Compare revenue definitions (before or after discounts, returns, tax), then report the cause of the gap"), skor: 2, umpan: _("Selisih angka hampir selalu berasal dari definisi yang berbeda.", "Number gaps almost always come from different definitions.") },
            { teks: _("Bilang dashboard yang benar", "Say the dashboard is right"), skor: 1, umpan: _("Mungkin benar, tetapi tanpa penjelasan kepercayaan tidak kembali.", "Maybe true, but trust won't return without an explanation.") },
          ],
        },
        {
          waktu: _("Selasa 11.00", "Tuesday 11:00"),
          dari: { nama: "Mbak Sari", peran: _("Manajer gudang", "Warehouse manager") },
          kanal: "Slack",
          pesan: _("Bisa tambahkan 15 grafik stok per gudang di dashboard penjualan juga?", "Can you add 15 stock charts per warehouse to the sales dashboard too?"),
          pilihan: [
            { teks: _("Tambahkan semuanya", "Add them all"), skor: 0, umpan: _("Dashboard penjualan jadi penuh dan tujuan awalnya kabur.", "The sales dashboard gets cluttered and loses its purpose.") },
            { teks: _("Tanyakan keputusan apa yang ingin diambil dari data stok, lalu usulkan halaman atau dashboard terpisah untuk gudang", "Ask which decisions the stock data supports, then propose a separate page or dashboard for the warehouse"), skor: 2, umpan: _("Kamu menjaga fokus dashboard sambil memenuhi kebutuhan baru.", "You keep the dashboard focused while meeting the new need.") },
            { teks: _("Tolak karena bukan tugasmu", "Decline since it's not your job"), skor: 1, umpan: _("Kebutuhannya nyata. Lebih baik diarahkan daripada ditolak.", "The need is real. Redirect rather than refuse.") },
          ],
        },
        {
          waktu: _("Rabu 08.00", "Wednesday 8:00"),
          dari: { nama: _("Notifikasi sistem", "System alert") },
          kanal: "Email",
          pesan: _("Pembaruan data semalam gagal. Dashboard masih menampilkan data hari Senin.", "Last night's data refresh failed. The dashboard still shows Monday's data."),
          pilihan: [
            { teks: _("Diam saja dan perbaiki pelan-pelan", "Stay quiet and fix it slowly"), skor: 0, umpan: _("Orang bisa mengambil keputusan dari data lama tanpa tahu.", "People may decide on stale data without knowing.") },
            { teks: _("Pasang pemberitahuan di dashboard bahwa data belum diperbarui, kabari pengguna di Slack, lalu cari penyebabnya", "Add a notice on the dashboard that data is stale, tell users on Slack, then find the cause"), skor: 2, umpan: _("Transparansi menjaga kepercayaan pada dashboard.", "Transparency keeps trust in the dashboard.") },
            { teks: _("Perbaiki dulu, kabari jika sudah beres", "Fix first, announce when done"), skor: 1, umpan: _("Niatnya baik, tetapi pengguna sudah melihat data lama sejak pagi.", "Well meant, but users have seen stale data since morning.") },
          ],
        },
        {
          waktu: _("Jumat 15.00", "Friday 3:00 pm"),
          dari: { nama: "Pak Gunawan", peran: _("Direktur penjualan", "Sales director") },
          kanal: "Slack",
          pesan: _("Minggu ini bagaimana?", "How was this week?"),
          pilihan: [
            { teks: _("Kirim ringkasan: penyebab selisih angka sudah ditemukan dan definisi disepakati, dashboard gudang diusulkan, satu kegagalan pembaruan data sudah diperbaiki dengan pemantauan otomatis", "Send a summary: the number gap's cause found and definitions agreed, warehouse dashboard proposed, one failed refresh fixed with automatic monitoring"), skor: 2, umpan: _("Ringkasan berbasis hasil memperlihatkan nilai kerjamu.", "An outcome-based summary shows your value.") },
            { teks: _("\"Sibuk sekali, Pak.\"", "\"Very busy.\""), skor: 0, umpan: _("Tidak memberi informasi apa pun.", "Says nothing useful.") },
            { teks: _("Kirim daftar semua tugas yang dikerjakan", "Send a list of every task done"), skor: 1, umpan: _("Lengkap, tetapi atasan perlu hasil dan dampaknya, bukan daftar aktivitas.", "Complete, but leaders want outcomes, not activity lists.") },
          ],
        },
      ],
    },
  },

  "analis-statistik": {
    tugas: [
      {
        dari: { nama: "Anisa", peran: _("Mahasiswi S1 Manajemen", "Management undergraduate") },
        kanal: "WhatsApp",
        tenggat: _("Kamis, sebelum bimbingan", "Thursday, before supervision"),
        revisi: {
          pesan: _("Kak, setelah dicek, selisih skornya tidak normal (Shapiro-Wilk p = 0,01). Dosen saya juga tanya, kenapa tidak pakai kelompok kontrol?", "After checking, the score differences aren't normal (Shapiro-Wilk p = 0.01). My lecturer also asked why there's no control group."),
          petunjuk: [
            _("Ganti uji ke Wilcoxon signed-rank dan jelaskan alasannya", "Switch to the Wilcoxon signed-rank test and explain why"),
            _("Jelaskan keterbatasan desain tanpa kelompok kontrol dengan jujur", "Honestly explain the limits of a design without a control group"),
            _("Bantu Anisa menyiapkan jawaban untuk dosen, bukan menuliskan skripsinya", "Help Anisa prepare an answer for her lecturer, not write her thesis"),
          ],
        },
      },
      {
        dari: { nama: "Bu Wulan", peran: _("Pemilik usaha", "Business owner") },
        kanal: "Email",
        tenggat: _("Akhir minggu", "End of the week"),
        revisi: {
          pesan: _("Penjelasannya mudah dipahami, terima kasih. Kalau begitu, apakah aman kalau saya naikkan iklan dari Rp10 juta ke Rp30 juta per bulan?", "Clear explanation, thanks. So is it safe to raise ads from Rp10m to Rp30m a month?"),
          petunjuk: [
            _("Jelaskan bahwa model dibuat dari rentang biaya iklan yang pernah terjadi", "Explain the model was built on past ad spend ranges"),
            _("Ingatkan risiko ekstrapolasi dan efek yang melemah", "Warn about extrapolation and diminishing returns"),
            _("Sarankan kenaikan bertahap dengan pemantauan", "Suggest gradual increases with monitoring"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Proyek analisis survei kepuasan pelanggan", "A customer satisfaction survey analysis project"),
      konteks: _("Sebuah jaringan klinik meminta kamu menganalisis survei 1.200 pasien dari 5 cabang.", "A clinic chain asks you to analyse a survey of 1,200 patients across 5 branches."),
      langkah: [
        {
          waktu: _("Hari 1", "Day 1"),
          dari: { nama: "Pak Rudi", peran: _("Manajer operasional", "Operations manager") },
          kanal: "Email",
          pesan: _("Datanya terlampir. Saya ingin tahu cabang mana yang paling buruk.", "Data attached. I want to know which branch is worst."),
          pilihan: [
            { teks: _("Langsung hitung rata-rata skor per cabang", "Compute average scores per branch right away"), skor: 1, umpan: _("Berguna, tetapi kamu belum mengecek kualitas data dan jumlah responden per cabang.", "Useful, but you haven't checked data quality or respondents per branch.") },
            { teks: _("Cek dulu data: responden per cabang, data kosong, dan jawaban yang tidak masuk akal, lalu konfirmasi \"paling buruk\" diukur dari pertanyaan mana", "First check data: respondents per branch, blanks, and odd answers, then confirm which question defines \"worst\""), skor: 2, umpan: _("Pemahaman data dan definisi yang jelas membuat analisis bisa dipercaya.", "Understanding data and clear definitions make the analysis trustworthy.") },
            { teks: _("Tanya klien hasil apa yang ia harapkan", "Ask what result he expects"), skor: 0, umpan: _("Analisis harus mengikuti data, bukan harapan.", "Analysis follows data, not expectations.") },
          ],
        },
        {
          waktu: _("Hari 2", "Day 2"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Cabang D hanya punya 18 responden, cabang lain 250 sampai 350. Rata-rata cabang D paling rendah.", "Branch D has only 18 respondents; others have 250 to 350. Branch D's average is lowest."),
          pilihan: [
            { teks: _("Laporkan cabang D sebagai yang terburuk", "Report D as the worst"), skor: 0, umpan: _("Dengan 18 responden, hasilnya sangat tidak stabil.", "With 18 respondents, the result is very unstable.") },
            { teks: _("Laporkan dengan catatan jumlah responden kecil dan rentang kepercayaan yang lebar, serta sarankan survei tambahan", "Report it with a note on the small sample and wide confidence interval, and suggest more surveys"), skor: 2, umpan: _("Jujur soal keterbatasan adalah bagian penting dari analisis.", "Being honest about limits is a key part of analysis.") },
            { teks: _("Keluarkan cabang D dari analisis tanpa menyebutnya", "Drop branch D silently"), skor: 0, umpan: _("Menghapus data tanpa penjelasan menyesatkan pembaca.", "Removing data silently misleads readers.") },
          ],
        },
        {
          waktu: _("Hari 3", "Day 3"),
          dari: { nama: "Pak Rudi", peran: _("Manajer operasional", "Operations manager") },
          kanal: "Email",
          pesan: _("Bisa sekalian buktikan bahwa waktu tunggu yang lama menyebabkan kepuasan rendah?", "Can you also prove long waiting times cause low satisfaction?"),
          pilihan: [
            { teks: _("\"Terbukti, korelasinya negatif.\"", "\"Proven, the correlation is negative.\""), skor: 0, umpan: _("Korelasi dari survei tidak membuktikan sebab-akibat.", "Survey correlations don't prove causation.") },
            { teks: _("\"Dari survei saya bisa tunjukkan hubungannya dan seberapa kuat. Untuk membuktikan penyebab, perlu uji coba, misalnya mengurangi waktu tunggu di satu cabang lalu membandingkan.\"", "\"From the survey I can show the link and its strength. Proving cause needs a trial, e.g. reducing waits at one branch and comparing.\""), skor: 2, umpan: _("Kamu menjawab kebutuhan klien dengan jujur dan memberi jalan untuk membuktikannya.", "You answered honestly and offered a way to prove it.") },
            { teks: _("Tolak permintaannya", "Refuse the request"), skor: 1, umpan: _("Pertanyaannya wajar. Jelaskan apa yang bisa dan tidak bisa dijawab data.", "It's a fair question. Explain what the data can and can't answer.") },
          ],
        },
        {
          waktu: _("Hari 4", "Day 4"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Laporan siap dikirim ke manajer yang tidak paham statistik.", "The report is ready for a manager with no statistics background."),
          pilihan: [
            { teks: _("Halaman pertama berisi 3 temuan utama dan rekomendasi dalam bahasa sederhana, detail statistik di lampiran", "Page one has 3 key findings and recommendations in plain language, stats detail in an appendix"), skor: 2, umpan: _("Pembaca mendapat inti dengan cepat, detail tetap tersedia.", "Readers get the gist fast; details remain available.") },
            { teks: _("Kirim output SPSS lengkap", "Send the full SPSS output"), skor: 0, umpan: _("Output mentah sulit dibaca orang awam.", "Raw output is unreadable for non-experts.") },
            { teks: _("Kirim tabel dan grafik tanpa penjelasan", "Send tables and charts without explanation"), skor: 1, umpan: _("Lebih baik dari output mentah, tetapi interpretasi tetap dibutuhkan.", "Better than raw output, but interpretation is still needed.") },
          ],
        },
      ],
    },
  },

  "spreadsheet-template": {
    tugas: [
      {
        dari: { nama: "Bu Endah", peran: _("Pemilik toko kelontong", "Grocery shop owner") },
        kanal: "WhatsApp",
        tenggat: _("3 hari", "3 days"),
        revisi: {
          pesan: _("Templatenya enak dipakai! Tapi stok masuk dan keluar saya catat tiap hari, bukan total. Jadi saya bingung harus isi di mana. Bisa dibuat ada sheet transaksi harian?", "The template is easy to use! But I record stock in and out daily, not totals. So I'm not sure where to enter it. Could there be a daily transactions sheet?"),
          petunjuk: [
            _("Tambahkan sheet transaksi (tanggal, kode, jenis masuk atau keluar, jumlah)", "Add a transactions sheet (date, code, in or out, quantity)"),
            _("Ubah kolom Masuk dan Keluar menjadi SUMIFS dari sheet transaksi", "Turn In and Out columns into SUMIFS from the transactions sheet"),
            _("Perbarui petunjuk penggunaan", "Update the instructions"),
          ],
        },
      },
      {
        dari: { nama: "Mbak Rini", peran: _("Pemilik usaha kue", "Cake business owner") },
        kanal: "WhatsApp",
        tenggat: _("Akhir pekan", "This weekend"),
        revisi: {
          pesan: _("Bagus banget! Satu lagi: kalau jual lewat aplikasi ojek online, potongannya 20%. Saya mau lihat harga minimal supaya tetap untung 25% di sana.", "Brilliant! One more: delivery apps take a 20% cut. I want to see the minimum price to still make a 25% margin there."),
          petunjuk: [
            _("Tambahkan input potongan aplikasi (20%) dan target margin (25%)", "Add inputs for the app fee (20%) and target margin (25%)"),
            _("Gunakan rumus harga = biaya / (1 - potongan - margin)", "Use price = cost / (1 - fee - margin)"),
            _("Tunjukkan hasilnya dengan contoh angka (biaya Rp45.000)", "Show the result with an example (cost Rp45,000)"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Proyek template untuk kantor akuntan kecil", "A template project for a small accounting office"),
      konteks: _("Kamu membuat template rekap invoice untuk kantor dengan 5 staf yang tidak terlalu paham Excel.", "You're building an invoice summary template for a 5-person office with limited Excel skills."),
      langkah: [
        {
          waktu: _("Hari 1", "Day 1"),
          dari: { nama: "Bu Lestari", peran: _("Pemilik kantor", "Office owner") },
          kanal: "WhatsApp",
          pesan: _("Pokoknya buat yang otomatis ya. Detailnya terserah kamu.", "Just make it automatic. Details are up to you."),
          pilihan: [
            { teks: _("Langsung buat versi lengkap", "Build the full version right away"), skor: 1, umpan: _("Tanpa memahami alur kerja mereka, template bisa tidak cocok.", "Without understanding their workflow, it may not fit.") },
            { teks: _("Minta contoh data asli dan 15 menit untuk melihat cara mereka bekerja sekarang", "Ask for real sample data and 15 minutes to see how they work now"), skor: 2, umpan: _("\"Terserah\" sering berarti klien belum tahu. Melihat alur kerja nyata adalah langkah terpenting.", "\"Up to you\" often means they don't know yet. Seeing the real workflow matters most.") },
            { teks: _("Pakai template dari internet", "Use an internet template"), skor: 0, umpan: _("Template umum jarang sesuai kebutuhan spesifik.", "Generic templates rarely fit specific needs.") },
          ],
        },
        {
          waktu: _("Hari 2", "Day 2"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Kantor memakai Excel 2013. Rumus favoritmu XLOOKUP.", "The office uses Excel 2013. Your favourite formula is XLOOKUP."),
          pilihan: [
            { teks: _("Tetap pakai XLOOKUP", "Use XLOOKUP anyway"), skor: 0, umpan: _("XLOOKUP tidak tersedia di Excel 2013, template akan error.", "XLOOKUP doesn't exist in Excel 2013; the template will break.") },
            { teks: _("Pakai INDEX dan MATCH yang didukung Excel 2013", "Use INDEX and MATCH, supported in Excel 2013"), skor: 2, umpan: _("Menyesuaikan dengan lingkungan klien adalah kunci template yang awet.", "Fitting the client's environment keeps templates working.") },
            { teks: _("Minta klien membeli Excel terbaru", "Ask them to buy the latest Excel"), skor: 1, umpan: _("Bisa disarankan, tetapi jangan dijadikan syarat.", "You can suggest it, but don't require it.") },
          ],
        },
        {
          waktu: _("Hari 4", "Day 4"),
          dari: { nama: _("Staf kantor", "Office staff") },
          kanal: "WhatsApp",
          pesan: _("Kak, rumusnya hilang karena saya tidak sengaja menimpa sel.", "The formula disappeared because I accidentally overwrote a cell."),
          pilihan: [
            { teks: _("Perbaiki, lalu proteksi sel rumus dan beri warna pada sel input", "Fix it, then protect formula cells and colour input cells"), skor: 2, umpan: _("Kamu memperbaiki penyebabnya, bukan hanya gejalanya.", "You fixed the cause, not just the symptom.") },
            { teks: _("Perbaiki saja", "Just fix it"), skor: 1, umpan: _("Masalah akan terulang.", "It will happen again.") },
            { teks: _("Minta staf lebih hati-hati", "Ask staff to be more careful"), skor: 0, umpan: _("Template yang baik tidak bergantung pada pengguna yang sempurna.", "Good templates don't rely on perfect users.") },
          ],
        },
        {
          waktu: _("Hari 5", "Day 5"),
          dari: { nama: "Bu Lestari", peran: _("Pemilik kantor", "Office owner") },
          kanal: "WhatsApp",
          pesan: _("Sudah jadi? Staf saya baru 2 minggu lagi bisa belajar.", "Is it done? My staff can only learn it in 2 weeks."),
          pilihan: [
            { teks: _("Serahkan file dengan sheet petunjuk dan video tutorial 5 menit agar staf bisa belajar sendiri", "Deliver the file with an instructions sheet and a 5-minute video so staff can self-learn"), skor: 2, umpan: _("Serah terima yang baik membuat template tetap dipakai walau kamu tidak ada.", "A good handover keeps the template in use without you.") },
            { teks: _("Kirim file saja", "Just send the file"), skor: 1, umpan: _("Tanpa panduan, staf bisa kebingungan.", "Without guidance, staff may struggle.") },
            { teks: _("Tunda serah terima 2 minggu", "Delay handover 2 weeks"), skor: 0, umpan: _("Pekerjaan selesai, tetapi pembayaran dan penutupan proyek ikut tertunda tanpa alasan.", "The work is done, but payment and closure get delayed for no reason.") },
          ],
        },
      ],
    },
  },
};
