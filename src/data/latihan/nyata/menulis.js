import { t as _ } from "../../../i18n.js";

/** Detail kerja nyata, kategori Penulisan & Penerjemahan. */
export default {
  "content-writer": {
    tugas: [
      {
        dari: { nama: "Mbak Indah", peran: _("Editor, platform belajar online", "Editor, online learning platform") },
        kanal: "Slack",
        tenggat: _("Besok, 12.00", "Tomorrow, noon"),
        revisi: {
          pesan: _("Kerangkanya bagus. Tim SEO minta tambahkan bagian \"Contoh CV fresh graduate untuk jurusan non-bisnis\", karena banyak dicari. Dan judulnya kepanjangan, maksimal 60 karakter ya.", "Good outline. SEO wants a section \"Fresh graduate CV example for non-business majors\" since it's searched a lot. And the title's too long; 60 characters max."),
          petunjuk: [
            _("Tambahkan subjudul baru di posisi yang logis", "Add the new subheading in a logical spot"),
            _("Persingkat judul tanpa menghilangkan kata kunci", "Shorten the title while keeping the keyword"),
            _("Cek ulang alur kerangka setelah perubahan", "Recheck the outline flow after changes"),
          ],
        },
      },
      {
        dari: { nama: "Kak Bella", peran: _("Pemilik toko tumbler", "Tumbler shop owner") },
        kanal: "WhatsApp",
        tenggat: _("Hari ini", "Today"),
        revisi: {
          pesan: _("Suka banget! Tapi marketplace membatasi judul produk maksimal 70 karakter dan deskripsi tidak boleh ada link atau ajakan transaksi di luar aplikasi. Tolong sesuaikan, plus buatkan judul produknya.", "Love it! But the marketplace limits titles to 70 characters and descriptions can't contain links or off-app transaction prompts. Please adjust and write the product title too."),
          petunjuk: [
            _("Tulis judul produk maksimal 70 karakter dengan kata kunci utama", "Write a product title of 70 characters max with the main keywords"),
            _("Pastikan deskripsi tidak melanggar aturan marketplace", "Make sure the description follows marketplace rules"),
            _("Pertahankan manfaat utama dan struktur poin", "Keep the key benefits and bullet structure"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Seminggu sebagai penulis lepas untuk blog keuangan", "A week freelancing for a finance blog"),
      konteks: _("Kamu menulis 4 artikel per minggu untuk blog keuangan pribadi. Editor menilai akurasi dengan ketat.", "You write 4 articles a week for a personal finance blog. The editor is strict about accuracy."),
      langkah: [
        {
          waktu: _("Senin", "Monday"),
          dari: { nama: "Mbak Indah", peran: _("Editor", "Editor") },
          kanal: "Slack",
          pesan: _("Topik minggu ini: \"Cara menghitung dana darurat\". Target 1.200 kata, kata kunci \"dana darurat ideal\".", "This week: \"How to calculate an emergency fund\". 1,200 words, keyword \"ideal emergency fund\"."),
          pilihan: [
            { teks: _("Minta AI menulis artikel lengkap, lalu kirim", "Have AI write it, then submit"), skor: 0, umpan: _("Artikel keuangan tanpa pengecekan fakta berisiko salah dan merugikan pembaca.", "Unchecked finance articles risk errors that harm readers.") },
            { teks: _("Cek 5 artikel teratas, cari celah yang belum dibahas (misalnya hitungan untuk freelancer), lalu tulis kerangka", "Check the top 5 results, find gaps (e.g. calculations for freelancers), then outline"), skor: 2, umpan: _("Kamu menawarkan nilai yang belum ada di pesaing.", "You add value competitors lack.") },
            { teks: _("Langsung menulis dari pengetahuan sendiri", "Write straight from your own knowledge"), skor: 1, umpan: _("Bisa, tetapi tanpa riset kamu mungkin mengulang yang sudah ada.", "Possible, but without research you may repeat what exists.") },
          ],
        },
        {
          waktu: _("Selasa", "Tuesday"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Kamu menemukan angka \"dana darurat 3 sampai 6 kali pengeluaran\" di banyak blog, tetapi tanpa sumber.", "You see \"3 to 6 months of expenses\" everywhere, without sources."),
          pilihan: [
            { teks: _("Pakai saja karena semua orang menulisnya", "Use it since everyone does"), skor: 1, umpan: _("Angka ini memang umum, tetapi lebih kuat jika dirujuk ke sumber kredibel.", "It's common, but stronger with a credible source.") },
            { teks: _("Cari sumber kredibel seperti materi literasi keuangan OJK, lalu jelaskan kapan perlu lebih dari 6 bulan (misalnya freelancer)", "Find a credible source like OJK financial literacy materials, then explain when over 6 months is needed (e.g. freelancers)"), skor: 2, umpan: _("Akurat dan lebih berguna bagi pembaca.", "Accurate and more useful for readers.") },
            { teks: _("Tulis angka 12 bulan agar terlihat berbeda", "Write 12 months to stand out"), skor: 0, umpan: _("Mengubah angka tanpa dasar menyesatkan pembaca.", "Changing numbers without basis misleads readers.") },
          ],
        },
        {
          waktu: _("Kamis", "Thursday"),
          dari: { nama: "Mbak Indah", peran: _("Editor", "Editor") },
          kanal: "Slack",
          pesan: _("Artikel kamu bagus, tapi pembukanya terlalu panjang. Pembaca harus scroll 3 paragraf sebelum masuk inti.", "Good article, but the intro's too long. Readers scroll 3 paragraphs before the point."),
          pilihan: [
            { teks: _("\"Pembuka itu penting untuk konteks.\"", "\"The intro is important for context.\""), skor: 0, umpan: _("Defensif terhadap masukan yang wajar.", "Defensive about fair feedback.") },
            { teks: _("Pangkas pembuka menjadi 2 sampai 3 kalimat yang langsung menjawab \"berapa dana darurat yang ideal\", lalu kirim ulang", "Trim the intro to 2 to 3 sentences answering \"how much is ideal\", then resubmit"), skor: 2, umpan: _("Menjawab cepat sesuai niat pencari.", "Answers fast, matching search intent.") },
            { teks: _("Hapus pembuka sepenuhnya", "Remove the intro entirely"), skor: 1, umpan: _("Pembuka singkat tetap perlu untuk mengarahkan pembaca.", "A short intro still orients readers.") },
          ],
        },
        {
          waktu: _("Jumat", "Friday"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Artikel ke-4 belum selesai, tenggat jam 17.00. Sekarang jam 14.00.", "Article 4 isn't done; due at 5 pm. It's 2 pm."),
          pilihan: [
            { teks: _("Kabari editor sekarang: perkiraan selesai, bagian yang tersisa, dan tawarkan kirim jam 19.00 atau Senin pagi", "Tell the editor now: expected finish, what's left, and offer 7 pm or Monday morning"), skor: 2, umpan: _("Memberi kabar lebih awal menjaga kepercayaan.", "Early notice preserves trust.") },
            { teks: _("Kirim seadanya jam 17.00", "Submit whatever you have at 5"), skor: 1, umpan: _("Tepat waktu, tetapi kualitas buruk bisa lebih merugikan.", "On time, but poor quality may hurt more.") },
            { teks: _("Diam dan kirim besok", "Stay quiet and send tomorrow"), skor: 0, umpan: _("Terlambat tanpa kabar merusak reputasi.", "Silent lateness damages your reputation.") },
          ],
        },
      ],
    },
  },

  copywriter: {
    tugas: [
      {
        dari: { nama: "Mas Doni", peran: _("Pemilik laundry, Surabaya", "Laundry owner, Surabaya") },
        kanal: "WhatsApp",
        tenggat: _("Besok pagi, iklan tayang siang", "Tomorrow morning; ads go live at noon"),
        revisi: {
          pesan: _("Mantap! Versi 1 dan 3 saya suka. Tapi Meta menolak versi 3 karena \"Baju kerja menumpuk lagi?\" dianggap menyinggung kondisi pribadi. Bisa diubah tanpa kehilangan maknanya?", "Great! I like versions 1 and 3. But Meta rejected version 3 because \"Work clothes piling up again?\" was flagged as addressing personal circumstances. Can you rework it without losing the idea?"),
          petunjuk: [
            _("Hindari kalimat yang menyiratkan kondisi pribadi pembaca (\"kamu\" + masalah)", "Avoid lines implying the reader's personal situation (\"you\" + problem)"),
            _("Pertahankan sudut masalah dengan pernyataan umum", "Keep the pain angle with a general statement"),
            _("Tulis 2 alternatif headline", "Write 2 alternative headlines"),
          ],
        },
      },
      {
        dari: { nama: "Kak Sasa", peran: _("Penulis e-book keuangan", "Finance e-book author") },
        kanal: "Email",
        tenggat: _("Akhir minggu", "End of the week"),
        revisi: {
          pesan: _("Jauh lebih bagus! Testimoni asli sudah ada 3, saya lampirkan. Dan saya berani kasih garansi uang kembali 7 hari. Tolong masukkan keduanya.", "Much better! I have 3 genuine testimonials attached. And I'll offer a 7-day money-back guarantee. Please add both."),
          petunjuk: [
            _("Letakkan testimoni di dekat bagian yang memunculkan keraguan", "Place testimonials near where doubts arise"),
            _("Tambahkan garansi di dekat tombol beli untuk mengurangi risiko yang dirasakan", "Put the guarantee near the buy button to reduce perceived risk"),
            _("Jangan mengubah isi testimoni", "Don't alter testimonial wording"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Kampanye flash sale untuk brand fashion", "A flash sale campaign for a fashion brand"),
      konteks: _("Kamu copywriter lepas untuk brand fashion lokal. Flash sale 3 hari dimulai Jumat.", "You freelance as copywriter for a local fashion brand. A 3-day flash sale starts Friday."),
      langkah: [
        {
          waktu: _("Selasa", "Tuesday"),
          dari: { nama: _("Brand manager", "Brand manager") },
          kanal: "Slack",
          pesan: _("Tulis copy flash sale ya. Pakai kata \"TERMURAH SE-INDONESIA\".", "Write the flash sale copy. Use \"CHEAPEST IN INDONESIA\"."),
          pilihan: [
            { teks: _("Pakai sesuai permintaan", "Use it as asked"), skor: 0, umpan: _("Klaim superlatif tanpa bukti bisa menyesatkan dan ditolak platform iklan.", "Unprovable superlatives mislead and may be rejected.") },
            { teks: _("Usulkan alternatif yang bisa dibuktikan, misalnya \"Diskon sampai 60%, hanya 3 hari\"", "Suggest a provable alternative, e.g. \"Up to 60% off, 3 days only\""), skor: 2, umpan: _("Tetap kuat, tanpa risiko klaim palsu.", "Still strong, without false-claim risk.") },
            { teks: _("Tulis tanpa memberi tahu bahwa klaimnya dihapus", "Quietly drop the claim"), skor: 1, umpan: _("Keputusan tepat, tetapi klien perlu tahu alasannya.", "Right call, but explain why.") },
          ],
        },
        {
          waktu: _("Rabu", "Wednesday"),
          dari: { nama: _("Brand manager", "Brand manager") },
          kanal: "Slack",
          pesan: _("Kita perlu headline untuk email, push notification, dan banner. Bisa satu headline untuk semua?", "We need headlines for email, push notifications, and banners. One headline for all?"),
          pilihan: [
            { teks: _("Satu headline yang sama untuk semua", "One headline for all"), skor: 1, umpan: _("Konsisten, tetapi tiap kanal punya batas panjang berbeda.", "Consistent, but channels have different length limits.") },
            { teks: _("Satu pesan inti, disesuaikan per kanal: push sangat singkat, email dengan subject menarik, banner dengan teks besar dan ringkas", "One core message adapted per channel: very short push, an email subject that intrigues, a bold, concise banner"), skor: 2, umpan: _("Pesan tetap konsisten sambil mengikuti karakter tiap kanal.", "Consistent message, fitted to each channel.") },
            { teks: _("Headline berbeda total untuk tiap kanal", "Totally different headlines per channel"), skor: 0, umpan: _("Pesan yang tidak konsisten membingungkan pelanggan.", "Inconsistent messages confuse customers.") },
          ],
        },
        {
          waktu: _("Sabtu", "Saturday"),
          dari: { nama: _("Brand manager", "Brand manager") },
          kanal: "Slack",
          pesan: _("Hari pertama penjualan di bawah target. Ada ide untuk hari kedua?", "Day one sales are below target. Ideas for day two?"),
          pilihan: [
            { teks: _("Minta data: produk yang paling banyak dilihat tetapi tidak dibeli, lalu tulis copy yang menjawab keberatan pembeli (ukuran, bahan, retur)", "Ask for data on most-viewed but unbought items, then write copy addressing objections (size, fabric, returns)"), skor: 2, umpan: _("Perbaikan berdasarkan data, bukan tebakan.", "Data-driven fixes, not guesses.") },
            { teks: _("Tambahkan kata \"MURAH!\" di semua copy", "Add \"CHEAP!\" everywhere"), skor: 0, umpan: _("Tidak menjawab penyebab penjualan rendah.", "Doesn't address why sales are low.") },
            { teks: _("Tambah tanda seru dan emoji", "Add exclamation marks and emojis"), skor: 1, umpan: _("Mungkin menarik perhatian, tetapi masalahnya belum jelas.", "May grab attention, but the problem isn't diagnosed.") },
          ],
        },
        {
          waktu: _("Senin", "Monday"),
          dari: { nama: _("Brand manager", "Brand manager") },
          kanal: "Slack",
          pesan: _("Flash sale selesai. Ada catatan untuk kampanye berikutnya?", "The sale's over. Notes for next time?"),
          pilihan: [
            { teks: _("Tulis catatan: copy dengan CTR tertinggi, keberatan pembeli yang muncul, dan 3 hal yang akan diuji di kampanye berikutnya", "Write notes: highest-CTR copy, buyer objections seen, and 3 things to test next time"), skor: 2, umpan: _("Catatan seperti ini membuat setiap kampanye lebih baik.", "Notes like these improve every campaign.") },
            { teks: _("\"Lancar, sampai jumpa di kampanye berikutnya.\"", "\"Went fine, see you next time.\""), skor: 1, umpan: _("Sopan, tetapi pelajaran kampanye hilang.", "Polite, but lessons are lost.") },
            { teks: _("Tidak membalas", "No reply"), skor: 0, umpan: _("Kesempatan membangun hubungan jangka panjang terlewat.", "A chance to build the relationship is missed.") },
          ],
        },
      ],
    },
  },

  ghostwriter: {
    tugas: [
      {
        dari: { nama: "Pak Haris", peran: _("Pemilik usaha konveksi", "Garment business owner") },
        kanal: "WhatsApp",
        tenggat: _("Kamis, untuk diunggah Jumat pagi", "Thursday, to post Friday morning"),
        revisi: {
          pesan: _("Bagus sekali, tapi kalimat \"saya sudah menyiapkan kata-kata untuk memberi tahu tim bahwa usaha ini akan tutup\" terlalu dramatis, saya tidak pernah sampai sejauh itu. Dan tolong sebut nama usaha kami, Haris Garmen.", "Very good, but \"I'd already rehearsed telling my team we were closing\" is too dramatic; I never got that far. And please mention our business name, Haris Garmen."),
          petunjuk: [
            _("Ubah bagian yang tidak sesuai fakta klien", "Fix the part that doesn't match the client's facts"),
            _("Tambahkan nama usaha secara alami, bukan seperti iklan", "Mention the business name naturally, not like an ad"),
            _("Jaga kekuatan cerita tanpa melebih-lebihkan", "Keep the story strong without exaggeration"),
          ],
        },
      },
      {
        dari: { nama: "Bu Rina", peran: _("Konsultan HR, calon penulis buku", "HR consultant, aspiring author") },
        kanal: "Email",
        tenggat: _("Sebelum wawancara Selasa", "Before Tuesday's interview"),
        revisi: {
          pesan: _("Daftar pertanyaannya bagus, tapi waktu saya cuma 45 menit. Bisa pilih 6 pertanyaan terpenting dan urutkan?", "Good list, but I only have 45 minutes. Can you pick the 6 most important and order them?"),
          petunjuk: [
            _("Pilih pertanyaan yang paling banyak menghasilkan cerita untuk bab pertama", "Pick questions that yield the most stories for chapter one"),
            _("Urutkan dari pemanasan ke yang paling mendalam", "Order from warm-up to deepest"),
            _("Sisakan satu pertanyaan cadangan jika waktu tersisa", "Keep one backup question if time allows"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Mengelola LinkedIn seorang CEO", "Running a CEO's LinkedIn"),
      konteks: _("Kamu ghostwriter untuk CEO startup logistik. Target 3 unggahan per minggu.", "You ghostwrite for a logistics startup CEO. Target: 3 posts a week."),
      langkah: [
        {
          waktu: _("Senin", "Monday"),
          dari: { nama: "Pak Arman", peran: "CEO" },
          kanal: "WhatsApp",
          pesan: _("Minggu ini saya sibuk, tidak sempat wawancara. Tulis saja apa yang menurutmu bagus.", "I'm busy this week, no time for an interview. Write whatever you think is good."),
          pilihan: [
            { teks: _("Tulis opini umum tentang logistik", "Write generic logistics opinions"), skor: 1, umpan: _("Unggahan tanpa cerita atau pandangan klien terdengar hambar dan bukan suaranya.", "Posts without the client's stories or views sound bland and unlike him.") },
            { teks: _("Kirim 3 pertanyaan singkat yang bisa dijawab lewat pesan suara 5 menit", "Send 3 quick questions he can answer in a 5-minute voice note"), skor: 2, umpan: _("Cara praktis mendapat bahan asli tanpa menyita waktu klien.", "A practical way to get real material without eating his time.") },
            { teks: _("Pakai unggahan CEO lain sebagai dasar dan ubah sedikit", "Rework another CEO's post slightly"), skor: 0, umpan: _("Ini plagiarisme dan bisa memalukan klien.", "That's plagiarism and could embarrass the client.") },
          ],
        },
        {
          waktu: _("Rabu", "Wednesday"),
          dari: { nama: "Pak Arman", peran: "CEO" },
          kanal: "WhatsApp",
          pesan: _("Tolong tulis bahwa perusahaan kami \"nomor 1 di Indonesia\" ya.", "Please write that we're \"number 1 in Indonesia\"."),
          pilihan: [
            { teks: _("Tulis sesuai permintaan", "Write it as asked"), skor: 0, umpan: _("Klaim tanpa data bisa dipertanyakan publik dan merusak kredibilitas klien.", "Unbacked claims can be challenged publicly and hurt credibility.") },
            { teks: _("Tanyakan data pendukungnya, atau usulkan klaim spesifik yang bisa dibuktikan, misalnya jumlah kota atau pengiriman", "Ask for supporting data, or suggest a specific, provable claim like cities served or deliveries"), skor: 2, umpan: _("Kamu melindungi reputasi klien.", "You protect the client's reputation.") },
            { teks: _("Diam-diam tidak memasukkannya", "Quietly leave it out"), skor: 1, umpan: _("Keputusan aman, tetapi jelaskan alasannya.", "Safe call, but explain why.") },
          ],
        },
        {
          waktu: _("Jumat", "Friday"),
          dari: { nama: _("Komentar di unggahan", "Post comment") },
          kanal: "LinkedIn",
          pesan: _("Seorang pengikut bertanya detail teknis di komentar unggahan yang kamu tulis.", "A follower asks a technical question in the comments of a post you wrote."),
          pilihan: [
            { teks: _("Balas sendiri atas nama CEO tanpa bertanya", "Reply as the CEO without asking"), skor: 0, umpan: _("Jawaban teknis yang salah atas nama CEO berisiko.", "A wrong technical answer in the CEO's name is risky.") },
            { teks: _("Teruskan ke CEO dengan draf jawaban yang perlu ia cek", "Forward it to the CEO with a draft reply to check"), skor: 2, umpan: _("Klien tetap memegang kendali atas pernyataan publiknya.", "The client keeps control of public statements.") },
            { teks: _("Abaikan", "Ignore it"), skor: 1, umpan: _("Interaksi yang dibalas memperkuat jangkauan unggahan.", "Replies boost a post's reach.") },
          ],
        },
        {
          waktu: _("Akhir bulan", "Month end"),
          dari: { nama: "Pak Arman", peran: "CEO" },
          kanal: "WhatsApp",
          pesan: _("Teman saya ingin pakai jasamu juga. Boleh kamu tunjukkan unggahan saya sebagai contoh?", "A friend wants your services too. Can you show my posts as examples?"),
          pilihan: [
            { teks: _("Tunjukkan karena klien sendiri yang menawarkan", "Show them since he offered"), skor: 1, umpan: _("Klien setuju, tetapi pastikan persetujuannya jelas dan tertulis.", "He agreed, but get clear written consent.") },
            { teks: _("Terima kasih atas rekomendasinya, konfirmasi tertulis bahwa ia mengizinkan unggahannya dijadikan contoh", "Thank him and confirm in writing that he allows his posts as examples"), skor: 2, umpan: _("Kerahasiaan tetap terjaga dengan izin yang jelas.", "Confidentiality preserved with clear permission.") },
            { teks: _("Tunjukkan juga karya klien lain", "Show other clients' work too"), skor: 0, umpan: _("Melanggar kerahasiaan klien lain.", "Breaches other clients' confidentiality.") },
          ],
        },
      ],
    },
  },

  "penulis-skrip": {
    tugas: [
      {
        dari: { nama: "Kak Nina", peran: _("Social media lead, aplikasi keuangan", "Social lead, finance app") },
        kanal: "Slack",
        tenggat: _("Syuting Rabu pagi", "Shoot on Wednesday morning"),
        revisi: {
          pesan: _("Skripnya seru! Tapi tim legal minta kita tidak menyebut angka penghematan pasti dan tidak menjanjikan \"pasti kaget\". Bisa disesuaikan?", "Fun script! But legal says no specific savings figures or promises like \"you'll be shocked\". Can you adjust?"),
          petunjuk: [
            _("Ganti angka pasti dengan contoh yang jelas sebagai ilustrasi", "Replace exact figures with clearly illustrative examples"),
            _("Ubah ajakan agar tidak menjanjikan hasil", "Rephrase the CTA so it doesn't promise outcomes"),
            _("Tetap jaga durasi 45 detik dan hook yang kuat", "Keep 45 seconds and a strong hook"),
          ],
        },
      },
      {
        dari: { nama: "Mas Gilang", peran: _("YouTuber karier", "Career YouTuber") },
        kanal: "WhatsApp",
        tenggat: _("Senin", "Monday"),
        revisi: {
          pesan: _("Kerangkanya oke. Video saya biasanya 12 menit karena penonton suka studi kasus. Bisa tambah 2 studi kasus negosiasi (satu berhasil, satu gagal)?", "Good outline. My videos usually run 12 minutes since viewers love case studies. Can you add 2 negotiation cases (one success, one failure)?"),
          petunjuk: [
            _("Tambahkan 2 studi kasus di posisi yang menjaga ritme", "Add 2 case studies where they keep the pacing"),
            _("Perbarui durasi per bagian agar total sekitar 12 menit", "Update section timings to about 12 minutes"),
            _("Pastikan setiap studi kasus punya pelajaran yang jelas", "Give each case a clear lesson"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Seminggu menulis untuk kreator edukasi", "A week writing for an education creator"),
      konteks: _("Kamu menulis 5 skrip video pendek per minggu untuk kreator dengan 300 ribu pengikut.", "You write 5 short video scripts a week for a creator with 300k followers."),
      langkah: [
        {
          waktu: _("Senin", "Monday"),
          dari: { nama: _("Kreator", "Creator") },
          kanal: "WhatsApp",
          pesan: _("Video minggu lalu banyak yang tidak ditonton sampai habis. Kenapa ya?", "Lots of people didn't finish last week's videos. Why?"),
          pilihan: [
            { teks: _("\"Mungkin algoritmanya sedang jelek.\"", "\"Maybe the algorithm's off.\""), skor: 0, umpan: _("Menyalahkan algoritma tanpa melihat data.", "Blaming the algorithm without data.") },
            { teks: _("Minta data retensi, cari detik penurunan terbesar, dan bandingkan dengan isi skrip di detik itu", "Ask for retention data, find the biggest drop, and compare with the script at that point"), skor: 2, umpan: _("Analisis berbasis data menunjukkan bagian skrip yang perlu diperbaiki.", "Data analysis pinpoints what to fix.") },
            { teks: _("Tulis skrip lebih pendek tanpa melihat data", "Write shorter scripts without data"), skor: 1, umpan: _("Mungkin membantu, tetapi belum tentu itu masalahnya.", "May help, but may not be the problem.") },
          ],
        },
        {
          waktu: _("Selasa", "Tuesday"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Data menunjukkan penonton pergi di detik ke-4, saat kreator memperkenalkan diri.", "Data shows viewers leave at second 4, when the creator introduces himself."),
          pilihan: [
            { teks: _("Pindahkan perkenalan ke akhir dan mulai langsung dengan hook", "Move the intro to the end and open with the hook"), skor: 2, umpan: _("Penonton ingin langsung tahu manfaat videonya.", "Viewers want the payoff immediately.") },
            { teks: _("Buat perkenalan lebih lucu", "Make the intro funnier"), skor: 1, umpan: _("Mungkin membantu sedikit, tetapi masalahnya adalah posisinya.", "Might help a little, but position is the issue.") },
            { teks: _("Tambah musik yang lebih keras", "Add louder music"), skor: 0, umpan: _("Tidak menyentuh penyebabnya.", "Doesn't touch the cause.") },
          ],
        },
        {
          waktu: _("Rabu", "Wednesday"),
          dari: { nama: _("Kreator", "Creator") },
          kanal: "WhatsApp",
          pesan: _("Ada brand minta video promosi pinjaman online. Bayarannya besar. Tulis skripnya ya.", "A brand wants a promo video for an online loan app. Big fee. Please write the script."),
          pilihan: [
            { teks: _("Tulis tanpa mengecek apa pun", "Write it without checking anything"), skor: 0, umpan: _("Mempromosikan pinjol ilegal bisa merugikan penonton dan reputasi kreator.", "Promoting illegal lenders can harm viewers and the creator's reputation.") },
            { teks: _("Sarankan cek dulu apakah terdaftar dan diawasi OJK, dan pastikan skrip menyebut bunga dan risikonya dengan jelas", "Suggest first checking it's OJK-registered, and ensure the script clearly states interest and risks"), skor: 2, umpan: _("Kamu melindungi penonton dan kreator.", "You protect viewers and the creator.") },
            { teks: _("Tolak tanpa penjelasan", "Refuse without explanation"), skor: 1, umpan: _("Aman, tetapi kreator perlu tahu alasannya.", "Safe, but explain why.") },
          ],
        },
        {
          waktu: _("Jumat", "Friday"),
          dari: { nama: _("Kreator", "Creator") },
          kanal: "WhatsApp",
          pesan: _("Skrip minggu ini mantap, retensi naik! Minggu depan bisa 7 skrip?", "Great scripts, retention is up! Can you do 7 next week?"),
          pilihan: [
            { teks: _("Terima tanpa membahas tarif", "Accept without discussing rates"), skor: 1, umpan: _("Pekerjaan bertambah, sebaiknya bayaran juga disesuaikan.", "More work should mean adjusted pay.") },
            { teks: _("\"Bisa. Dengan tambahan 2 skrip, total menjadi Rp... per minggu. Saya kirim jadwalnya.\"", "\"Sure. With 2 extra scripts, the weekly total is Rp... I'll send the schedule.\""), skor: 2, umpan: _("Responsif terhadap peluang dan jelas soal harga.", "Responsive to the opportunity and clear on price.") },
            { teks: _("Terima dan kurangi kualitas agar sempat", "Accept and cut quality to fit"), skor: 0, umpan: _("Kualitas yang turun menghapus hasil baik minggu ini.", "Dropping quality undoes this week's gains.") },
          ],
        },
      ],
    },
  },

  penerjemah: {
    tugas: [
      {
        dari: { nama: "Sophie", peran: _("Marketing manager, aplikasi pembagi tagihan", "Marketing manager, bill-splitting app") },
        kanal: "Email",
        tenggat: _("Rabu", "Wednesday"),
        revisi: {
          pesan: _("Terjemahannya enak dibaca! Tapi untuk pasar ini kami ingin terdengar lebih muda dan santai, seperti cara mahasiswa berbicara sehari-hari. Bisa dibuat versi kedua?", "Reads well! But for this market we want it younger and more casual, like how college students talk. Can you do a second version?"),
          petunjuk: [
            _("Buat versi dengan register yang lebih santai, tetapi tetap jelas", "Make a more casual version that stays clear"),
            _("Pertahankan semua informasi fitur", "Keep all feature information"),
            _("Jelaskan perbedaan pilihan kata antara dua versi", "Explain the word choice differences between versions"),
          ],
        },
      },
      {
        dari: { nama: "Pak Ahmad", peran: _("Sekretaris perusahaan", "Corporate secretary") },
        kanal: "Email",
        tenggat: _("Siang ini", "This afternoon"),
        revisi: {
          pesan: _("Terima kasih. Ternyata rapatnya bukan Kamis 14 Maret, tetapi Jumat 15 Maret, dan kami perlu tambahan informasi bahwa rapat diadakan lewat Zoom. Mohon perbarui emailnya.", "Thanks. The meeting is actually Friday 15 March, not Thursday 14 March, and we need to add that it's on Zoom. Please update the email."),
          petunjuk: [
            _("Perbarui hari dan tanggal dengan benar", "Update the day and date correctly"),
            _("Tambahkan informasi Zoom secara singkat dan formal", "Add the Zoom detail briefly and formally"),
            _("Cek ulang tata bahasa dan konsistensi gaya", "Recheck grammar and style consistency"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Proyek lokalisasi aplikasi", "An app localisation project"),
      konteks: _("Kamu menerjemahkan 4.000 kata teks aplikasi kesehatan dari bahasa Inggris ke bahasa Indonesia. Tenggat 5 hari.", "You're translating 4,000 words of a health app from English to Indonesian. 5-day deadline."),
      langkah: [
        {
          waktu: _("Hari 1", "Day 1"),
          dari: { nama: _("Project manager agensi", "Agency project manager") },
          kanal: "Email",
          pesan: _("File dan glosarium terlampir. Beberapa teks tombol maksimal 15 karakter.", "Files and glossary attached. Some button labels have a 15-character limit."),
          pilihan: [
            { teks: _("Langsung terjemahkan tanpa membaca glosarium", "Translate without reading the glossary"), skor: 0, umpan: _("Istilah yang tidak sesuai glosarium dianggap kesalahan.", "Off-glossary terms count as errors.") },
            { teks: _("Baca glosarium dan instruksi, cek batas karakter di CAT tool, lalu mulai", "Read the glossary and instructions, set character limits in the CAT tool, then start"), skor: 2, umpan: _("Persiapan mencegah kesalahan berulang.", "Preparation prevents repeat errors.") },
            { teks: _("Baca glosarium setelah selesai", "Read the glossary afterwards"), skor: 1, umpan: _("Kamu harus memperbaiki banyak istilah di akhir.", "You'll fix many terms at the end.") },
          ],
        },
        {
          waktu: _("Hari 2", "Day 2"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Tombol \"Track your symptoms\" diterjemahkan \"Lacak gejala Anda\" (17 karakter), melebihi batas.", "\"Track your symptoms\" became \"Lacak gejala Anda\" (17 characters), over the limit."),
          pilihan: [
            { teks: _("Biarkan, nanti developer yang menyesuaikan", "Leave it; developers will adjust"), skor: 0, umpan: _("Teks yang terpotong di layar membingungkan pengguna.", "Truncated text confuses users.") },
            { teks: _("Ringkas menjadi \"Catat gejala\" (12 karakter) dan tambahkan catatan untuk reviewer", "Shorten to \"Catat gejala\" (12 characters) and add a note for the reviewer"), skor: 2, umpan: _("Makna tetap, batas terpenuhi, dan keputusan terdokumentasi.", "Meaning kept, limit met, decision documented.") },
            { teks: _("Pakai bahasa Inggris saja", "Keep it in English"), skor: 1, umpan: _("Bisa jadi opsi terakhir, tetapi tanyakan dulu ke klien.", "A last resort; ask the client first.") },
          ],
        },
        {
          waktu: _("Hari 3", "Day 3"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Ada kalimat medis \"Take 2 tablets twice daily\" yang tidak ada di glosarium.", "A medical line, \"Take 2 tablets twice daily\", isn't in the glossary."),
          pilihan: [
            { teks: _("Terjemahkan \"Minum 2 tablet 2 kali sehari\" dan cek dengan istilah resmi label obat di Indonesia", "Translate as \"Minum 2 tablet 2 kali sehari\" and check against standard Indonesian drug label wording"), skor: 2, umpan: _("Teks dosis harus jelas dan sesuai istilah yang umum dipakai.", "Dosage text must be clear and use standard terms.") },
            { teks: _("Terjemahkan dengan mesin tanpa cek", "Machine-translate without checking"), skor: 0, umpan: _("Kesalahan di teks dosis bisa berbahaya.", "Dosage errors can be dangerous.") },
            { teks: _("Lewati kalimat itu", "Skip it"), skor: 0, umpan: _("Teks yang hilang di aplikasi kesehatan berisiko.", "Missing text in a health app is risky.") },
          ],
        },
        {
          waktu: _("Hari 5", "Day 5"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Terjemahan selesai.", "Translation done."),
          pilihan: [
            { teks: _("Jalankan QA otomatis (angka, tag, istilah), baca ulang tanpa sumber, lalu kirim dengan daftar catatan", "Run automated QA (numbers, tags, terms), reread without the source, then send with a notes list"), skor: 2, umpan: _("Pengecekan dua lapis menangkap kesalahan teknis dan bahasa.", "Two-layer checks catch technical and language errors.") },
            { teks: _("Kirim langsung", "Send immediately"), skor: 1, umpan: _("Kesalahan kecil seperti tag atau angka mudah terlewat.", "Small tag or number slips are easy to miss.") },
            { teks: _("Minta teman yang tidak paham bidang ini untuk mengecek", "Ask a friend unfamiliar with the field to check"), skor: 0, umpan: _("Kamu juga membagikan file rahasia klien.", "You'd also share confidential client files.") },
          ],
        },
      ],
    },
  },

  "technical-writer": {
    tugas: [
      {
        dari: { nama: "Rizky", peran: _("Product manager, aplikasi kasir", "Product manager, POS app") },
        kanal: "Slack",
        tenggat: _("Sebelum rilis Kamis", "Before Thursday's release"),
        revisi: {
          pesan: _("Artikelnya jelas! Update dari engineering: mulai rilis ini refund sebagian bisa juga lewat QRIS, dan dana kembali ke pelanggan maksimal 3 hari kerja. Tolong tambahkan.", "Clear article! Engineering update: from this release partial refunds also work via QRIS, with funds back to customers within 3 working days. Please add it."),
          petunjuk: [
            _("Tambahkan QRIS sebagai metode pengembalian di langkah yang tepat", "Add QRIS as a refund method in the right step"),
            _("Tambahkan informasi waktu pengembalian dana untuk QRIS", "Add the QRIS refund timing"),
            _("Perbarui bagian masalah umum bila perlu", "Update common problems if needed"),
          ],
        },
      },
      {
        dari: { nama: "Rizky", peran: _("Product manager", "Product manager") },
        kanal: "Slack",
        tenggat: _("Hari ini", "Today"),
        revisi: {
          pesan: _("Bagus. Tim CS bilang banyak pemilik toko bertanya: \"Kalau HP rusak sebelum online, data hilang nggak?\" Tolong tambahkan jawabannya. Faktanya: data offline hanya tersimpan di HP itu.", "Good. Support says many owners ask: \"If my phone breaks before going online, is the data lost?\" Please add the answer. Fact: offline data is stored only on that phone."),
          petunjuk: [
            _("Jawab dengan jujur bahwa data yang belum tersinkron bisa hilang", "Honestly say unsynced data can be lost"),
            _("Beri tips pencegahan yang praktis", "Give practical prevention tips"),
            _("Tetap pakai bahasa yang menenangkan dan sederhana", "Keep the language calm and simple"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Minggu rilis fitur baru", "New feature release week"),
      konteks: _("Kamu technical writer di perusahaan SaaS. Fitur laporan pajak otomatis dirilis Jumat.", "You're a technical writer at a SaaS company. An automatic tax report feature ships Friday."),
      langkah: [
        {
          waktu: _("Senin", "Monday"),
          dari: { nama: _("Engineer", "Engineer") },
          kanal: "Slack",
          pesan: _("Spesifikasi fitur ada di dokumen ini. Fiturnya belum bisa dicoba sampai Kamis.", "The spec is in this doc. The feature can't be tested until Thursday."),
          pilihan: [
            { teks: _("Tunggu Kamis untuk mulai menulis", "Wait until Thursday to start"), skor: 0, umpan: _("Waktu menulis jadi terlalu sempit.", "Leaves too little writing time.") },
            { teks: _("Tulis draf dari spesifikasi, tandai bagian yang perlu dicek, lalu verifikasi saat fitur bisa dicoba", "Draft from the spec, flag items to verify, then confirm once testable"), skor: 2, umpan: _("Pekerjaan berjalan sambil menjaga akurasi.", "Work progresses while protecting accuracy.") },
            { teks: _("Tulis dari spesifikasi dan langsung terbitkan", "Write from the spec and publish"), skor: 1, umpan: _("Spesifikasi sering berubah sebelum rilis.", "Specs often change before release.") },
          ],
        },
        {
          waktu: _("Kamis", "Thursday"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Saat mencoba, nama tombol di aplikasi \"Ekspor\", padahal di spesifikasi \"Unduh laporan\".", "Testing shows the button says \"Export\", but the spec says \"Download report\"."),
          pilihan: [
            { teks: _("Ikuti spesifikasi", "Follow the spec"), skor: 0, umpan: _("Pengguna akan mencari tombol yang tidak ada.", "Users will look for a button that doesn't exist.") },
            { teks: _("Konfirmasi ke engineer nama finalnya, lalu samakan dokumentasi dengan tampilan yang akan dirilis", "Confirm the final name with engineering, then match the docs to the shipped UI"), skor: 2, umpan: _("Dokumentasi harus sama dengan yang dilihat pengguna.", "Docs must match what users see.") },
            { teks: _("Tulis keduanya", "Write both"), skor: 1, umpan: _("Membingungkan pembaca.", "Confuses readers.") },
          ],
        },
        {
          waktu: _("Jumat", "Friday"),
          dari: { nama: _("Manajer produk", "Product manager") },
          kanal: "Slack",
          pesan: _("Rilis diundur ke Senin karena ada bug. Artikel jangan diterbitkan dulu.", "Release slips to Monday due to a bug. Don't publish yet."),
          pilihan: [
            { teks: _("Jadwalkan penerbitan Senin dan cek apakah ada perubahan dari perbaikan bug", "Schedule for Monday and check whether the bug fix changes anything"), skor: 2, umpan: _("Siap, tetapi tetap waspada terhadap perubahan.", "Ready, yet alert to changes.") },
            { teks: _("Terbitkan saja, toh sudah selesai", "Publish anyway; it's done"), skor: 0, umpan: _("Pengguna akan membaca tentang fitur yang belum ada.", "Users would read about a feature they don't have.") },
            { teks: _("Simpan dan lupakan sampai ada kabar", "Shelve it until told"), skor: 1, umpan: _("Kamu bisa terlambat saat rilis Senin.", "You might be late on Monday.") },
          ],
        },
        {
          waktu: _("Minggu berikutnya", "The following week"),
          dari: { nama: _("Tim CS", "Support team") },
          kanal: "Slack",
          pesan: _("Banyak tiket: \"laporan pajak kosong\". Ternyata pengguna harus mengisi NPWP dulu di pengaturan.", "Lots of tickets: \"tax report is empty\". Turns out users must enter their tax ID in settings first."),
          pilihan: [
            { teks: _("Tambahkan bagian \"Sebelum mulai\" tentang pengisian NPWP di artikel dan kabari tim CS dengan tautannya", "Add a \"Before you start\" section on entering the tax ID and share the link with support"), skor: 2, umpan: _("Dokumentasi diperbarui berdasarkan masalah nyata pengguna.", "Docs updated from real user problems.") },
            { teks: _("Biarkan tim CS menjawab satu per satu", "Let support answer one by one"), skor: 0, umpan: _("Masalah yang sama akan terus menambah tiket.", "Tickets will keep piling up.") },
            { teks: _("Tambahkan catatan kecil di akhir artikel", "Add a small note at the end"), skor: 1, umpan: _("Informasi penting sebaiknya di awal, sebelum langkah.", "Key prerequisites belong before the steps.") },
          ],
        },
      ],
    },
  },
};
