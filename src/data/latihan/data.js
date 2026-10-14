import { t as _ } from "../../i18n.js";

/** Latihan praktik kategori Data & Analisis. */
export default {
  "data-entry": {
    kuis: [
      {
        q: _("Kamu memasukkan 500 data pelanggan. Cara paling efektif untuk mencegah kesalahan ketik pada kolom \"Kota\"?", "You're entering 500 customer records. Best way to prevent typos in the \"City\" column?"),
        o: [
          _("Mengetik secepat mungkin lalu mengecek di akhir", "Type as fast as possible and check at the end"),
          _("Memakai data validation berupa daftar pilihan kota", "Use data validation with a dropdown list of cities"),
          _("Menulis semua kota dengan huruf kapital", "Write all cities in capitals"),
          _("Meminta klien mengecek semuanya", "Ask the client to check everything"),
        ],
        a: 1,
        e: _("Daftar pilihan mencegah variasi seperti \"Jkt\", \"Jakarta\", dan \"DKI Jakarta\" yang membuat data sulit diolah.", "A dropdown prevents variants like \"Jkt\", \"Jakarta\", and \"DKI Jakarta\" that make data hard to analyse."),
      },
      {
        q: _("Nomor telepon \"081234567890\" berubah menjadi \"81234567890\" di Excel. Apa penyebab dan solusinya?", "The phone number \"081234567890\" turns into \"81234567890\" in Excel. Why, and how do you fix it?"),
        o: [
          _("Excel rusak, instal ulang", "Excel is broken, reinstall it"),
          _("Excel membaca sebagai angka; format kolom sebagai Text sebelum memasukkan data", "Excel reads it as a number; format the column as Text before entering data"),
          _("Hapus angka 0 di semua data", "Remove the 0 from all records"),
          _("Ganti dengan +62 secara manual satu per satu", "Manually change each to +62"),
        ],
        a: 1,
        e: _("Angka nol di depan hilang karena Excel menganggapnya bilangan. Format Text menjaga data persis seperti aslinya.", "Leading zeros vanish because Excel treats the value as a number. Text format keeps it exactly as entered."),
      },
      {
        q: _("Kamu menemukan 12 baris data ganda dengan nama dan email yang sama. Apa yang sebaiknya dilakukan?", "You find 12 duplicate rows with the same name and email. What should you do?"),
        o: [
          _("Langsung hapus tanpa memberi tahu", "Delete them without telling anyone"),
          _("Biarkan saja", "Leave them"),
          _("Tandai duplikatnya, laporkan ke klien, lalu hapus setelah disetujui", "Flag the duplicates, report to the client, then remove them once approved"),
          _("Ubah salah satu email agar tidak sama", "Change one email so they differ"),
        ],
        a: 2,
        e: _("Duplikat bisa saja disengaja, misalnya dua pesanan dari orang yang sama. Laporkan dulu agar klien yang memutuskan.", "Duplicates may be intentional, like two orders from the same person. Report first so the client decides."),
      },
      {
        q: _("Klien membayar per 1.000 data. Mana yang paling menentukan apakah klien akan memakai jasamu lagi?", "A client pays per 1,000 records. What most decides whether they'll hire you again?"),
        o: [
          _("Kecepatan saja", "Speed alone"),
          _("Akurasi yang konsisten dan laporan singkat tentang data yang bermasalah", "Consistent accuracy and a short note about problem records"),
          _("Jumlah pesan yang kamu kirim", "How many messages you send"),
          _("Memakai font yang menarik", "Using attractive fonts"),
        ],
        a: 1,
        e: _("Data yang salah lebih mahal diperbaiki daripada data yang lambat. Laporan singkat menunjukkan ketelitianmu.", "Wrong data costs more to fix than slow data. A short note shows your attention to detail."),
      },
      {
        q: _("Lowongan \"input data dari rumah, Rp150.000 per hari\" mengharuskan membeli \"software input\" seharga Rp250.000. Apa yang paling mungkin?", "A listing for \"data entry from home, Rp150,000 a day\" requires buying \"entry software\" for Rp250,000. What's most likely?"),
        o: [
          _("Pekerjaan sungguhan dengan alat khusus", "A real job with special tools"),
          _("Penipuan, karena pekerjaan input data memakai alat umum dan perusahaan tidak menjual software ke pelamar", "A scam, since data entry uses common tools and employers don't sell software to applicants"),
          _("Investasi yang wajar", "A reasonable investment"),
          _("Program pelatihan pemerintah", "A government training scheme"),
        ],
        a: 1,
        e: _("Data entry hampir selalu memakai Excel, Google Sheets, atau sistem milik perusahaan. Kewajiban membeli software adalah modus penipuan yang umum.", "Data entry almost always uses Excel, Google Sheets, or the company's own system. Being made to buy software is a common scam."),
      },
    ],
    tugas: [
      {
        judul: _("Rapikan data pelanggan yang berantakan", "Clean up messy customer data"),
        brief: _(
          "Data pelanggan kami berantakan. Tolong rapikan 4 baris ini dan jelaskan aturan yang kamu pakai supaya bisa diterapkan ke ribuan baris lainnya.\n\nNama | Telp | Kota | Tgl Daftar\nbudi santoso | 0812-3456-7890 | jkt | 3/1/24\nSITI AMINAH | +62 813 2222 1111 | Bandung | 2024-01-05\nAndi | 81299998888 | DKI Jakarta | 7 Jan 2024\nbudi santoso | 0812-3456-7890 | jkt | 3/1/24",
          "Our customer data is messy. Please clean these 4 rows and explain the rules you used so we can apply them to thousands more.\n\nName | Phone | City | Sign-up date\nbudi santoso | 0812-3456-7890 | jkt | 3/1/24\nSITI AMINAH | +62 813 2222 1111 | Bandung | 2024-01-05\nAndi | 81299998888 | DKI Jakarta | 7 Jan 2024\nbudi santoso | 0812-3456-7890 | jkt | 3/1/24",
        ),
        langkah: [
          _("Tulis ulang tabelnya dalam format yang seragam.", "Rewrite the table in a consistent format."),
          _("Tulis aturan pembersihan untuk setiap kolom.", "Write a cleaning rule for each column."),
          _("Catat hal yang perlu dikonfirmasi ke klien.", "Note anything to confirm with the client."),
        ],
        rubrik: [
          _("Nama memakai huruf kapital di awal kata", "Names use title case"),
          _("Nomor telepon diseragamkan ke satu format", "Phone numbers standardised to one format"),
          _("Nama kota diseragamkan (jkt dan DKI Jakarta menjadi Jakarta)", "City names standardised (jkt and DKI Jakarta become Jakarta)"),
          _("Tanggal diseragamkan dan ambiguitas 3/1/24 dicatat", "Dates standardised, with the 3/1/24 ambiguity flagged"),
          _("Baris duplikat ditandai", "Duplicate row flagged"),
        ],
        contoh: _(
          "Nama | Telp | Kota | Tgl Daftar\nBudi Santoso | 6281234567890 | Jakarta | 2024-01-03\nSiti Aminah | 6281322221111 | Bandung | 2024-01-05\nAndi | 6281299998888 | Jakarta | 2024-01-07\n(baris 4 duplikat dari baris 1, ditandai untuk dihapus)\n\nAturan:\n• Nama: huruf kapital di awal setiap kata, spasi berlebih dihapus\n• Telepon: hanya angka, diawali 62 (0 atau +62 diubah menjadi 62)\n• Kota: memakai daftar baku (jkt, DKI Jakarta, Jakarta Selatan menjadi Jakarta, kecuali klien ingin per wilayah)\n• Tanggal: format YYYY-MM-DD\n\nPerlu dikonfirmasi: 3/1/24 saya baca sebagai 3 Januari (format Indonesia). Mohon konfirmasi bukan 1 Maret. Apakah duplikat boleh dihapus?",
          "Name | Phone | City | Sign-up date\nBudi Santoso | 6281234567890 | Jakarta | 2024-01-03\nSiti Aminah | 6281322221111 | Bandung | 2024-01-05\nAndi | 6281299998888 | Jakarta | 2024-01-07\n(row 4 duplicates row 1, flagged for removal)\n\nRules:\n• Name: title case, extra spaces removed\n• Phone: digits only, starting with 62 (0 or +62 becomes 62)\n• City: standard list (jkt, DKI Jakarta, South Jakarta become Jakarta, unless the client wants districts)\n• Date: YYYY-MM-DD\n\nTo confirm: I read 3/1/24 as 3 January (Indonesian format). Please confirm it isn't 1 March. May the duplicate be deleted?",
        ),
      },
      {
        judul: _("Ekstrak data dari invoice", "Extract data from an invoice"),
        brief: _(
          "Kami punya ratusan invoice PDF. Ini teks salah satunya. Tolong ambil datanya ke format tabel.\n\n\"INVOICE No. 2024/INV/0087 · Tanggal: 12 Februari 2024 · Kepada: CV Maju Jaya, Surabaya · 1) Kertas A4 80gr, 20 rim x Rp52.000 · 2) Tinta printer hitam, 5 botol x Rp85.000 · Subtotal Rp1.465.000 · PPN 11% Rp161.150 · Total Rp1.626.150\"",
          "We have hundreds of PDF invoices. Here's the text of one. Please extract the data into a table.\n\n\"INVOICE No. 2024/INV/0087 · Date: 12 February 2024 · To: CV Maju Jaya, Surabaya · 1) A4 paper 80gsm, 20 reams x Rp52,000 · 2) Black printer ink, 5 bottles x Rp85,000 · Subtotal Rp1,465,000 · VAT 11% Rp161,150 · Total Rp1,626,150\"",
        ),
        langkah: [
          _("Buat tabel dengan satu baris per item barang.", "Make a table with one row per line item."),
          _("Masukkan angka tanpa titik ribuan atau \"Rp\" supaya bisa dihitung.", "Enter numbers without thousand separators or \"Rp\" so they can be calculated."),
          _("Periksa apakah perhitungan invoice sudah benar.", "Check whether the invoice maths is correct."),
        ],
        rubrik: [
          _("Satu baris per item, dengan nomor invoice dan tanggal di setiap baris", "One row per item, with invoice number and date on each"),
          _("Angka bersih tanpa titik dan Rp", "Numbers are clean, without separators or Rp"),
          _("Tanggal dalam format seragam", "Date in a consistent format"),
          _("Perhitungan subtotal, PPN, dan total dicek dan benar", "Subtotal, VAT, and total checked and correct"),
        ],
        contoh: _(
          "No Invoice | Tanggal | Pelanggan | Kota | Item | Qty | Satuan | Harga | Jumlah\n2024/INV/0087 | 2024-02-12 | CV Maju Jaya | Surabaya | Kertas A4 80gr | 20 | rim | 52000 | 1040000\n2024/INV/0087 | 2024-02-12 | CV Maju Jaya | Surabaya | Tinta printer hitam | 5 | botol | 85000 | 425000\n\nPengecekan: 1.040.000 + 425.000 = 1.465.000 (sesuai). PPN 11% = 161.150 (sesuai). Total 1.626.150 (sesuai).",
          "Invoice No | Date | Customer | City | Item | Qty | Unit | Price | Amount\n2024/INV/0087 | 2024-02-12 | CV Maju Jaya | Surabaya | A4 paper 80gsm | 20 | ream | 52000 | 1040000\n2024/INV/0087 | 2024-02-12 | CV Maju Jaya | Surabaya | Black printer ink | 5 | bottle | 85000 | 425000\n\nCheck: 1,040,000 + 425,000 = 1,465,000 (matches). 11% VAT = 161,150 (matches). Total 1,626,150 (matches).",
        ),
      },
    ],
  },

  "anotasi-data-ai": {
    kuis: [
      {
        q: _("Instruksi proyek berbeda dengan pendapat pribadimu tentang jawaban yang \"bagus\". Mana yang diikuti?", "The project guidelines differ from your personal view of a \"good\" answer. Which do you follow?"),
        o: [
          _("Pendapat pribadi, karena lebih masuk akal", "Your own view, it makes more sense"),
          _("Instruksi proyek, dan sampaikan masukan lewat saluran yang disediakan jika menurutmu instruksinya kurang jelas", "The guidelines, and send feedback through the provided channel if they seem unclear"),
          _("Campuran keduanya", "A mix of both"),
          _("Lewati tugas itu", "Skip the task"),
        ],
        a: 1,
        e: _("Konsistensi antar-anotator adalah kunci data yang baik. Pendapat pribadi yang berbeda-beda membuat data tidak bisa dipakai.", "Consistency across annotators is what makes data useful. Differing personal views make it unusable."),
      },
      {
        q: _("Chatbot menjawab: \"Ibu kota Indonesia saat ini adalah Surabaya.\" Bagaimana menilainya?", "A chatbot answers: \"Indonesia's current capital is Surabaya.\" How do you rate it?"),
        o: [
          _("Bagus, karena kalimatnya rapi", "Good, the sentence is well written"),
          _("Salah secara fakta, jadi nilainya rendah walaupun bahasanya rapi", "Factually wrong, so it scores low even though the language is clean"),
          _("Netral", "Neutral"),
          _("Tidak perlu dinilai", "No need to rate"),
        ],
        a: 1,
        e: _("Akurasi fakta biasanya menjadi kriteria utama. Bahasa yang rapi tidak menutupi informasi yang salah.", "Factual accuracy is usually the top criterion. Clean language doesn't excuse wrong information."),
      },
      {
        q: _("Kamu menemukan tugas yang meminta menilai konten berisi data pribadi orang sungguhan. Apa yang sebaiknya dilakukan?", "A task asks you to rate content containing a real person's personal data. What should you do?"),
        o: [
          _("Simpan datanya untuk berjaga-jaga", "Save the data just in case"),
          _("Ikuti prosedur proyek untuk konten sensitif, biasanya menandai atau melaporkannya", "Follow the project's sensitive-content procedure, usually flagging or reporting it"),
          _("Bagikan ke grup anotator untuk didiskusikan", "Share it with the annotator group to discuss"),
          _("Abaikan dan lanjutkan", "Ignore it and continue"),
        ],
        a: 1,
        e: _("Proyek anotasi punya aturan untuk data sensitif. Jangan pernah menyimpan atau membagikan data di luar platform.", "Annotation projects have rules for sensitive data. Never store or share data outside the platform."),
      },
      {
        q: _("Skor kualitasmu turun karena beberapa jawaban terlalu cepat. Langkah perbaikan terbaik?", "Your quality score dropped because some answers were too fast. Best fix?"),
        o: [
          _("Kerja lebih cepat agar jumlah tugas lebih banyak", "Work faster to complete more tasks"),
          _("Baca ulang instruksi, pelajari contoh yang dinilai salah, dan perlambat sedikit sampai akurasi kembali naik", "Reread the guidelines, study the flagged examples, and slow down until accuracy recovers"),
          _("Membuat akun baru", "Create a new account"),
          _("Protes ke admin tanpa membaca masukan", "Complain to admins without reading feedback"),
        ],
        a: 1,
        e: _("Di proyek anotasi, akses ke tugas bergantung pada skor kualitas. Akurasi lebih menguntungkan daripada kecepatan.", "On annotation projects, access to tasks depends on quality scores. Accuracy pays more than speed."),
      },
      {
        q: _("Seseorang di grup Facebook menjual \"akun anotator yang sudah lolos tes\" seharga Rp500.000. Apa risikonya?", "Someone in a Facebook group sells \"pre-approved annotator accounts\" for Rp500,000. What's the risk?"),
        o: [
          _("Tidak ada risiko, ini jalan pintas", "No risk, it's a shortcut"),
          _("Melanggar aturan platform, akun bisa diblokir, bayaran ditahan, dan sering kali penipuan", "It breaks platform rules, accounts get banned, pay withheld, and it's often a scam"),
          _("Hanya berisiko jika ketahuan", "Only risky if caught"),
          _("Aman jika penjualnya ramah", "Safe if the seller is friendly"),
        ],
        a: 1,
        e: _("Platform anotasi memverifikasi identitas pekerja. Akun beli hampir pasti diblokir, dan pembayarannya ke pemilik asli akun.", "Annotation platforms verify worker identity. Bought accounts almost always get banned, and pay goes to the original owner."),
      },
    ],
    tugas: [
      {
        judul: _("Bandingkan dua jawaban chatbot", "Compare two chatbot answers"),
        brief: _(
          "Pertanyaan pengguna: \"Bagaimana cara membuat NPWP online?\"\n\nJawaban A: \"Anda bisa membuat NPWP secara online melalui situs resmi Direktorat Jenderal Pajak. Siapkan NIK dan data diri, isi formulir pendaftaran, lalu ikuti langkah verifikasinya. Sejak 2024, NIK juga berfungsi sebagai NPWP bagi wajib pajak orang pribadi.\"\n\nJawaban B: \"NPWP bisa dibuat di aplikasi mana saja yang menyediakan jasa pajak, biayanya sekitar Rp150.000 dan selesai dalam 5 menit.\"",
          "User question: \"How do I register for an NPWP (tax ID) online?\"\n\nAnswer A: \"You can register for an NPWP online through the Directorate General of Taxes' official site. Prepare your NIK and personal details, fill in the registration form, then follow the verification steps. Since 2024, the NIK also serves as the NPWP for individual taxpayers.\"\n\nAnswer B: \"You can get an NPWP from any app that offers tax services. It costs around Rp150,000 and takes 5 minutes.\"",
        ),
        langkah: [
          _("Tentukan jawaban mana yang lebih baik.", "Decide which answer is better."),
          _("Beri nilai 1 sampai 5 untuk akurasi, kegunaan, dan keamanan masing-masing.", "Score each from 1 to 5 for accuracy, helpfulness, and safety."),
          _("Tulis alasan singkat dan objektif.", "Write a short, objective rationale."),
        ],
        rubrik: [
          _("Memilih A sebagai jawaban yang lebih baik", "Picks A as the better answer"),
          _("Menyebut bahwa B berisi informasi menyesatkan soal biaya", "Notes that B is misleading about fees"),
          _("Menyebut risiko keamanan B (mengarahkan ke pihak tidak resmi)", "Mentions B's safety risk (sending users to unofficial parties)"),
          _("Alasan ditulis objektif dan merujuk kriteria", "Rationale is objective and tied to criteria"),
        ],
        contoh: _(
          "Pilihan: A lebih baik.\n\nA: akurasi 5, kegunaan 4, keamanan 5\nB: akurasi 1, kegunaan 1, keamanan 1\n\nAlasan: A mengarahkan ke kanal resmi DJP, menjelaskan dokumen yang dibutuhkan, dan menyebut integrasi NIK sebagai NPWP. A bisa lebih berguna jika menyertakan alamat situsnya. B tidak akurat karena pendaftaran NPWP di DJP tidak dipungut biaya, dan berisiko karena mengarahkan pengguna menyerahkan data pribadi ke pihak yang tidak jelas.",
          "Choice: A is better.\n\nA: accuracy 5, helpfulness 4, safety 5\nB: accuracy 1, helpfulness 1, safety 1\n\nRationale: A points to the official DGT channel, lists the required documents, and mentions the NIK-as-NPWP integration. It could be more helpful with the site address. B is inaccurate because NPWP registration with the DGT is free, and it's risky because it pushes users to hand personal data to unknown parties.",
        ),
      },
      {
        judul: _("Beri label sentimen ulasan", "Label review sentiment"),
        brief: _(
          "Beri label Positif, Negatif, atau Campuran untuk ulasan berikut, sesuai panduan: \"Campuran\" dipakai jika ada pujian dan keluhan yang sama kuat.\n1. \"Barangnya oke sih, tapi kurirnya parah, telat seminggu.\"\n2. \"Mantap jiwa, langganan terus di sini!\"\n3. \"Ya gitu deh, sesuai harga.\"\n4. \"Bagus banget... rusak di hari kedua. Makasih ya.\"",
          "Label each review Positive, Negative, or Mixed, per the guidelines: \"Mixed\" is used when praise and complaints are equally strong.\n1. \"The item's fine, but the courier was awful, a week late.\"\n2. \"Brilliant, I'll keep shopping here!\"\n3. \"It is what it is, you get what you pay for.\"\n4. \"Really great... broke on day two. Thanks a lot.\"",
        ),
        langkah: [
          _("Beri label untuk keempat ulasan.", "Label all four reviews."),
          _("Tulis alasan satu kalimat untuk masing-masing.", "Give a one-sentence reason for each."),
          _("Tandai ulasan yang menurutmu ambigu dan jelaskan.", "Flag any review you find ambiguous and explain."),
        ],
        rubrik: [
          _("Ulasan 1 diberi label Campuran", "Review 1 labelled Mixed"),
          _("Ulasan 2 diberi label Positif", "Review 2 labelled Positive"),
          _("Ulasan 4 dikenali sebagai sarkasme, jadi Negatif", "Review 4 recognised as sarcasm, so Negative"),
          _("Ulasan 3 dibahas sebagai kasus ambigu dengan alasan yang masuk akal", "Review 3 discussed as ambiguous with a sensible reason"),
        ],
        contoh: _(
          "1. Campuran: memuji barang, tetapi mengeluhkan pengiriman dengan kuat.\n2. Positif: pujian jelas dan niat membeli lagi.\n3. Campuran atau netral (ambigu): \"sesuai harga\" tidak memuji ataupun mengeluh. Jika panduan tidak punya label Netral, saya pilih Campuran dan mencatatnya sebagai ambigu.\n4. Negatif: \"bagus banget\" dan \"makasih\" adalah sarkasme, karena barangnya rusak di hari kedua.",
          "1. Mixed: praises the item but strongly complains about delivery.\n2. Positive: clear praise and intent to buy again.\n3. Mixed or neutral (ambiguous): \"you get what you pay for\" neither praises nor complains. If the guidelines have no Neutral label, I'd choose Mixed and flag it as ambiguous.\n4. Negative: \"really great\" and \"thanks\" are sarcastic, since it broke on day two.",
        ),
      },
    ],
  },

  "visualisasi-data": {
    kuis: [
      {
        q: _("Kamu ingin menunjukkan tren penjualan bulanan selama 2 tahun. Grafik apa yang paling tepat?", "You want to show monthly sales over 2 years. Which chart fits best?"),
        o: [
          _("Pie chart", "Pie chart"),
          _("Line chart", "Line chart"),
          _("Tabel berisi 24 angka", "A table of 24 numbers"),
          _("Diagram radar", "Radar chart"),
        ],
        a: 1,
        e: _("Line chart paling mudah memperlihatkan naik turunnya nilai dari waktu ke waktu.", "Line charts show change over time most clearly."),
      },
      {
        q: _("Klien meminta pie chart untuk membandingkan 14 kategori produk. Saran terbaik?", "A client wants a pie chart comparing 14 product categories. Best suggestion?"),
        o: [
          _("Tetap pakai pie chart dengan 14 warna", "Use a pie chart with 14 colours anyway"),
          _("Usulkan bar chart horizontal yang diurutkan dari terbesar", "Suggest a horizontal bar chart sorted largest first"),
          _("Pakai grafik 3D supaya lebih menarik", "Use a 3D chart so it looks better"),
          _("Tampilkan tanpa label", "Show it without labels"),
        ],
        a: 1,
        e: _("Mata manusia sulit membandingkan banyak irisan pie. Bar chart terurut membuat perbandingan langsung terlihat.", "People struggle to compare many pie slices. A sorted bar chart makes comparisons obvious."),
      },
      {
        q: _("Sumbu Y grafik pendapatan dimulai dari 950 juta, sehingga kenaikan 2% terlihat seperti naik tiga kali lipat. Apa masalahnya?", "A revenue chart's Y axis starts at 950 million, so a 2% rise looks like tripling. What's the problem?"),
        o: [
          _("Tidak ada masalah", "No problem"),
          _("Grafik batang dengan sumbu yang tidak dimulai dari nol bisa menyesatkan pembaca", "A bar chart whose axis doesn't start at zero can mislead readers"),
          _("Warnanya kurang cerah", "The colours aren't bright enough"),
          _("Judulnya terlalu panjang", "The title is too long"),
        ],
        a: 1,
        e: _("Panjang batang mewakili nilai, jadi sumbu batang sebaiknya dimulai dari nol. Line chart lebih fleksibel untuk sumbu yang dipotong.", "Bar length encodes value, so bar axes should start at zero. Line charts are more forgiving with a truncated axis."),
      },
      {
        q: _("Apa yang sebaiknya ditanyakan pertama kali sebelum membuat dashboard?", "What should you ask first before building a dashboard?"),
        o: [
          _("Warna favorit klien", "The client's favourite colour"),
          _("Keputusan apa yang ingin diambil dari dashboard ini dan siapa penggunanya", "What decisions the dashboard should support and who will use it"),
          _("Berapa banyak grafik yang diinginkan", "How many charts they want"),
          _("Software apa yang paling canggih", "Which software is most advanced"),
        ],
        a: 1,
        e: _("Dashboard yang baik menjawab pertanyaan bisnis. Tanpa itu, hasilnya hanya kumpulan grafik yang jarang dibuka.", "A good dashboard answers business questions. Without that, it's just a pile of charts nobody opens."),
      },
      {
        q: _("Klien mengirim file berisi nama, alamat, dan nomor telepon pelanggan untuk dibuatkan dashboard. Praktik terbaik?", "A client sends a file with customer names, addresses, and phone numbers for a dashboard. Best practice?"),
        o: [
          _("Tampilkan semua data di dashboard publik", "Show all of it on a public dashboard"),
          _("Pakai hanya kolom yang dibutuhkan, sembunyikan data pribadi, dan atur akses dashboard", "Use only needed columns, hide personal data, and restrict dashboard access"),
          _("Unggah ke situs konversi file gratis", "Upload it to a free file converter"),
          _("Kirim ulang file ke grup kerja", "Reshare the file in a work group"),
        ],
        a: 1,
        e: _("Prinsip data minimal: pakai hanya data yang perlu. Ini melindungi pelanggan klien dan menjaga kepercayaan.", "Data minimisation: use only what's needed. It protects the client's customers and their trust in you."),
      },
    ],
    tugas: [
      {
        judul: _("Rancang dashboard untuk toko online", "Design a dashboard for an online shop"),
        brief: _(
          "Saya pemilik toko online fashion. Setiap Senin saya ingin tahu dalam 1 menit apakah minggu lalu bagus atau buruk, dan produk apa yang harus ditambah stoknya. Data saya: pesanan, produk, harga, ongkir, kota, dan sumber trafik.",
          "I own an online fashion shop. Every Monday I want to know in 1 minute whether last week was good or bad, and which products to restock. My data: orders, products, prices, shipping, cities, and traffic sources.",
        ),
        langkah: [
          _("Tentukan 3 sampai 5 KPI utama yang ditampilkan paling atas.", "Pick 3 to 5 headline KPIs for the top."),
          _("Tentukan grafik pendukung dan jenis grafiknya.", "Choose supporting charts and chart types."),
          _("Jelaskan cara pemilik membaca dashboard dalam 1 menit.", "Explain how the owner reads it in 1 minute."),
        ],
        rubrik: [
          _("KPI relevan dengan pertanyaan klien (penjualan dan stok)", "KPIs match the client's questions (sales and stock)"),
          _("Ada perbandingan dengan minggu sebelumnya", "Includes comparison with the previous week"),
          _("Jenis grafik sesuai datanya", "Chart types match the data"),
          _("Ada bagian yang langsung menjawab soal stok", "Has a section that directly answers the restock question"),
          _("Tidak berlebihan, bisa dibaca cepat", "Not overloaded, quick to read"),
        ],
        contoh: _(
          "Baris atas (KPI, dibanding minggu lalu):\n• Pendapatan bersih: Rp18,4 jt (+12%)\n• Jumlah pesanan: 236 (+8%)\n• Rata-rata nilai pesanan: Rp78 rb (+4%)\n• Tingkat retur: 3,1% (turun dari 4%)\n\nGrafik:\n1. Line chart pendapatan harian, minggu ini dibanding minggu lalu\n2. Bar chart 10 produk terlaris beserta sisa stok, produk dengan stok di bawah 2 minggu penjualan diberi warna merah\n3. Bar chart pesanan per sumber trafik (Instagram, TikTok, marketplace)\n\nCara membaca: lihat warna KPI (hijau naik, merah turun), lalu cek produk merah di grafik 2 untuk ditambah stoknya.",
          "Top row (KPIs, vs last week):\n• Net revenue: Rp18.4m (+12%)\n• Orders: 236 (+8%)\n• Average order value: Rp78k (+4%)\n• Return rate: 3.1% (down from 4%)\n\nCharts:\n1. Line chart of daily revenue, this week vs last\n2. Bar chart of the top 10 products with remaining stock; items with under 2 weeks of stock in red\n3. Bar chart of orders by traffic source (Instagram, TikTok, marketplace)\n\nHow to read it: check KPI colours (green up, red down), then look at red products in chart 2 to restock.",
        ),
      },
      {
        judul: _("Tulis insight dari data", "Write insights from data"),
        brief: _(
          "Penjualan per kuartal (juta rupiah):\nQ1: Jakarta 120, Bandung 45, Surabaya 60\nQ2: Jakarta 118, Bandung 70, Surabaya 58\nQ3: Jakarta 115, Bandung 96, Surabaya 61\nTolong tulis temuan penting untuk rapat direksi.",
          "Sales by quarter (million rupiah):\nQ1: Jakarta 120, Bandung 45, Surabaya 60\nQ2: Jakarta 118, Bandung 70, Surabaya 58\nQ3: Jakarta 115, Bandung 96, Surabaya 61\nPlease write the key findings for a board meeting.",
        ),
        langkah: [
          _("Hitung perubahan yang paling penting.", "Calculate the most important changes."),
          _("Tulis 3 temuan utama, dengan yang terpenting di atas.", "Write 3 key findings, most important first."),
          _("Usulkan satu pertanyaan atau tindakan lanjutan.", "Suggest one follow-up question or action."),
        ],
        rubrik: [
          _("Menemukan pertumbuhan Bandung yang tinggi (sekitar 113% dari Q1 ke Q3)", "Spots Bandung's strong growth (about 113% from Q1 to Q3)"),
          _("Menyebut Jakarta menurun pelan", "Notes Jakarta's slow decline"),
          _("Angka dihitung dengan benar", "Numbers calculated correctly"),
          _("Ada usulan tindak lanjut yang masuk akal", "Includes a sensible follow-up"),
        ],
        contoh: _(
          "1. Bandung tumbuh paling cepat: dari 45 juta (Q1) menjadi 96 juta (Q3), naik sekitar 113%. Jika tren berlanjut, Bandung bisa menyamai Jakarta dalam 1 sampai 2 kuartal.\n2. Jakarta, pasar terbesar, turun pelan: 120 ke 115 juta (sekitar -4%). Kecil, tetapi konsisten tiga kuartal.\n3. Surabaya stabil di kisaran 58 sampai 61 juta.\n\nTotal naik dari 225 juta menjadi 272 juta (+21%), hampir seluruhnya karena Bandung.\n\nTindak lanjut: cari tahu pendorong pertumbuhan Bandung (kampanye, mitra, atau produk tertentu) dan apakah bisa diterapkan di Jakarta.",
          "1. Bandung is growing fastest: from 45 million (Q1) to 96 million (Q3), up about 113%. If this continues, Bandung could match Jakarta within 1 to 2 quarters.\n2. Jakarta, the largest market, is slowly declining: 120 to 115 million (about -4%). Small, but consistent for three quarters.\n3. Surabaya is flat at 58 to 61 million.\n\nTotal rose from 225 million to 272 million (+21%), almost entirely from Bandung.\n\nFollow-up: find out what's driving Bandung (a campaign, partner, or product) and whether it can be applied in Jakarta.",
        ),
      },
    ],
  },

  "analis-statistik": {
    kuis: [
      {
        q: _("Data gaji karyawan berisi beberapa direktur dengan gaji sangat tinggi. Ukuran pemusatan mana yang paling mewakili gaji karyawan pada umumnya?", "Salary data includes a few directors with very high pay. Which average best represents a typical employee?"),
        o: [
          _("Rata-rata (mean)", "Mean"),
          _("Median", "Median"),
          _("Nilai maksimum", "Maximum"),
          _("Jumlah total", "Total"),
        ],
        a: 1,
        e: _("Median tidak terpengaruh nilai ekstrem, sehingga lebih mewakili data yang miring seperti gaji.", "The median isn't pulled by extreme values, so it better represents skewed data like salaries."),
      },
      {
        q: _("Hasil uji menunjukkan p-value 0,03 dengan taraf signifikansi 0,05. Kesimpulan yang tepat?", "A test gives a p-value of 0.03 at a 0.05 significance level. What's the right conclusion?"),
        o: [
          _("Hipotesis nol ditolak; ada bukti perbedaan yang signifikan secara statistik", "Reject the null hypothesis; there's statistically significant evidence of a difference"),
          _("Hipotesis alternatif terbukti 97% benar", "The alternative hypothesis is 97% proven"),
          _("Tidak ada perbedaan", "There's no difference"),
          _("Perbedaannya pasti besar dan penting", "The difference must be large and important"),
        ],
        a: 0,
        e: _("p-value kecil berarti data sulit dijelaskan jika hipotesis nol benar. Itu tidak mengukur besar dampak atau peluang hipotesis benar.", "A small p-value means the data would be unlikely if the null were true. It doesn't measure effect size or the chance a hypothesis is true."),
      },
      {
        q: _("Penjualan es krim dan kasus tenggelam sama-sama naik di musim panas. Kesimpulan yang benar?", "Ice cream sales and drownings both rise in summer. What's the right conclusion?"),
        o: [
          _("Es krim menyebabkan tenggelam", "Ice cream causes drowning"),
          _("Ada korelasi, tetapi kemungkinan disebabkan faktor ketiga seperti cuaca panas", "They're correlated, likely due to a third factor such as hot weather"),
          _("Data pasti salah", "The data must be wrong"),
          _("Tenggelam menyebabkan orang membeli es krim", "Drowning makes people buy ice cream"),
        ],
        a: 1,
        e: _("Korelasi bukan sebab-akibat. Variabel ketiga (confounder) sering menjelaskan hubungan yang terlihat.", "Correlation isn't causation. A third variable (confounder) often explains the link."),
      },
      {
        q: _("Kamu ingin membandingkan rata-rata nilai dua kelompok independen yang datanya kira-kira berdistribusi normal. Uji yang paling umum dipakai?", "You want to compare the means of two independent groups with roughly normal data. Most common test?"),
        o: [
          _("Chi-square", "Chi-square"),
          _("Independent samples t-test", "Independent samples t-test"),
          _("Regresi logistik", "Logistic regression"),
          _("Korelasi Pearson", "Pearson correlation"),
        ],
        a: 1,
        e: _("Independent t-test membandingkan rata-rata dua kelompok. Chi-square dipakai untuk data kategori.", "The independent t-test compares two group means. Chi-square is for categorical data."),
      },
      {
        q: _("Klien mahasiswa meminta kamu \"menyesuaikan\" data agar hasil penelitiannya signifikan. Respons yang benar?", "A student client asks you to \"adjust\" data so their results come out significant. Right response?"),
        o: [
          _("Ubah sedikit, tidak akan ketahuan", "Change it a bit, nobody will notice"),
          _("Tolak manipulasi data, lalu jelaskan bahwa hasil tidak signifikan juga merupakan temuan yang sah dan bisa dibahas", "Refuse to manipulate data, and explain that non-significant results are valid findings worth discussing"),
          _("Hapus responden yang tidak sesuai harapan", "Remove respondents who don't fit"),
          _("Ganti uji statistik sampai hasilnya signifikan", "Keep switching tests until one is significant"),
        ],
        a: 1,
        e: _("Memalsukan data dan mencoba-coba uji sampai signifikan (p-hacking) melanggar etika riset dan bisa membatalkan karya klien.", "Fabricating data and test-shopping for significance (p-hacking) breaks research ethics and can void the client's work."),
      },
    ],
    tugas: [
      {
        judul: _("Pilih metode dan jelaskan alasannya", "Choose a method and justify it"),
        brief: _(
          "Saya meneliti apakah pelatihan online meningkatkan skor tes karyawan. 40 karyawan dites sebelum dan sesudah pelatihan. Uji apa yang cocok, dan bagaimana menjelaskannya di skripsi?",
          "I'm researching whether online training raises employee test scores. 40 employees were tested before and after the training. Which test fits, and how do I explain it in my thesis?",
        ),
        langkah: [
          _("Tentukan uji statistik yang sesuai dan alasannya.", "Choose a suitable test and why."),
          _("Sebutkan asumsi yang perlu dicek dan alternatif jika asumsi tidak terpenuhi.", "List assumptions to check and an alternative if they fail."),
          _("Tulis hipotesis nol dan alternatif.", "Write the null and alternative hypotheses."),
        ],
        rubrik: [
          _("Memilih paired samples t-test karena subjek yang sama diukur dua kali", "Chooses a paired samples t-test because the same people are measured twice"),
          _("Menyebut asumsi normalitas selisih skor", "Mentions normality of the score differences"),
          _("Menyebut Wilcoxon signed-rank sebagai alternatif", "Mentions Wilcoxon signed-rank as the alternative"),
          _("Hipotesis ditulis jelas", "Hypotheses written clearly"),
        ],
        contoh: _(
          "Uji: paired samples t-test, karena data berasal dari 40 orang yang sama yang diukur sebelum dan sesudah pelatihan (data berpasangan).\n\nAsumsi: selisih skor (sesudah dikurangi sebelum) berdistribusi kira-kira normal. Cek dengan uji Shapiro-Wilk dan histogram. Jika tidak normal, gunakan Wilcoxon signed-rank test.\n\nH0: tidak ada perbedaan rata-rata skor sebelum dan sesudah pelatihan.\nH1: rata-rata skor sesudah pelatihan berbeda dari sebelum pelatihan.\n\nSaran: laporkan juga besar efeknya (misalnya Cohen's d) dan rata-rata kenaikan skor, bukan hanya p-value.",
          "Test: paired samples t-test, since the data come from the same 40 people measured before and after training (paired data).\n\nAssumption: the score differences (after minus before) are roughly normal. Check with a Shapiro-Wilk test and a histogram. If not normal, use the Wilcoxon signed-rank test.\n\nH0: no difference in mean scores before and after training.\nH1: mean scores after training differ from before.\n\nTip: also report the effect size (e.g. Cohen's d) and the average score gain, not just the p-value.",
        ),
      },
      {
        judul: _("Jelaskan hasil regresi untuk orang awam", "Explain a regression result to a non-expert"),
        brief: _(
          "Hasil regresi: Penjualan = 12 + 3,5 × Biaya Iklan (juta rupiah). R² = 0,62. Koefisien biaya iklan signifikan (p < 0,01). Tolong jelaskan ke pemilik usaha yang tidak paham statistik.",
          "Regression result: Sales = 12 + 3.5 × Ad Spend (million rupiah). R² = 0.62. The ad spend coefficient is significant (p < 0.01). Please explain it to a business owner with no statistics background.",
        ),
        langkah: [
          _("Jelaskan arti angka 3,5 dengan bahasa sehari-hari.", "Explain what 3.5 means in everyday language."),
          _("Jelaskan arti R² 0,62.", "Explain what R² of 0.62 means."),
          _("Sebutkan satu keterbatasan yang penting.", "Name one important limitation."),
        ],
        rubrik: [
          _("Menjelaskan bahwa setiap tambahan Rp1 juta iklan berkaitan dengan tambahan sekitar Rp3,5 juta penjualan", "Explains each extra Rp1 million in ads is linked to about Rp3.5 million more sales"),
          _("Menjelaskan R² sebagai porsi variasi penjualan yang terjelaskan (62%)", "Explains R² as the share of sales variation explained (62%)"),
          _("Menyebut bahwa hubungan ini belum tentu sebab-akibat atau berlaku tanpa batas", "Notes the link isn't necessarily causal or unlimited"),
          _("Bahasa mudah dipahami tanpa istilah teknis berlebihan", "Plain language without heavy jargon"),
        ],
        contoh: _(
          "Secara sederhana: setiap kali biaya iklan naik Rp1 juta, penjualan rata-rata naik sekitar Rp3,5 juta. Hubungan ini cukup kuat dan bukan kebetulan.\n\nAngka 0,62 berarti sekitar 62% naik turunnya penjualan bisa dijelaskan oleh biaya iklan. Sisanya, 38%, dipengaruhi hal lain seperti musim, harga, atau promosi.\n\nPerlu diingat: ini hubungan dari data yang sudah ada, bukan jaminan. Menambah iklan terus-menerus belum tentu selalu menghasilkan Rp3,5 juta per Rp1 juta, karena efek iklan biasanya melemah jika anggarannya terlalu besar. Sebaiknya diuji bertahap.",
          "Simply put: every time ad spend goes up by Rp1 million, sales go up by about Rp3.5 million on average. The link is fairly strong and not a coincidence.\n\nThe 0.62 means about 62% of the ups and downs in sales are explained by ad spend. The other 38% comes from things like season, price, or promotions.\n\nKeep in mind: this is a pattern in past data, not a guarantee. Spending more won't always return Rp3.5 million per Rp1 million, because ad effects usually weaken at high budgets. Test increases gradually.",
        ),
      },
    ],
  },

  "spreadsheet-template": {
    kuis: [
      {
        q: _("Kamu ingin mengambil harga produk dari tabel lain berdasarkan kode produk. Rumus yang paling tepat di Excel modern?", "You want to pull a product's price from another table using its product code. Best formula in modern Excel?"),
        o: [
          _("SUM", "SUM"),
          _("XLOOKUP", "XLOOKUP"),
          _("COUNTIF", "COUNTIF"),
          _("CONCAT", "CONCAT"),
        ],
        a: 1,
        e: _("XLOOKUP mencari nilai berdasarkan kunci dan lebih fleksibel daripada VLOOKUP. Di Google Sheets juga tersedia.", "XLOOKUP finds a value by key and is more flexible than VLOOKUP. It's in Google Sheets too."),
      },
      {
        q: _("Rumus =B2*$E$1 disalin ke bawah. Apa fungsi tanda $ pada $E$1?", "The formula =B2*$E$1 is copied down. What do the $ signs in $E$1 do?"),
        o: [
          _("Mengubah format menjadi mata uang", "Format the value as currency"),
          _("Mengunci referensi sel agar tidak bergeser saat rumus disalin", "Lock the cell reference so it doesn't shift when copied"),
          _("Membuat rumus lebih cepat", "Make the formula faster"),
          _("Menyembunyikan nilai sel", "Hide the cell value"),
        ],
        a: 1,
        e: _("Referensi absolut ($) penting untuk nilai tetap seperti tarif pajak atau kurs yang dipakai banyak baris.", "Absolute references ($) matter for fixed values like a tax rate or exchange rate used across many rows."),
      },
      {
        q: _("Template yang kamu buat akan dipakai staf yang tidak paham Excel. Hal paling penting yang dilakukan?", "Your template will be used by staff who don't know Excel. What matters most?"),
        o: [
          _("Menambah sebanyak mungkin rumus rumit", "Add as many complex formulas as possible"),
          _("Mengunci sel rumus, memberi warna pada sel input, dan menambah petunjuk singkat", "Lock formula cells, colour input cells, and add short instructions"),
          _("Memakai banyak warna cerah", "Use lots of bright colours"),
          _("Menyembunyikan semua sheet", "Hide every sheet"),
        ],
        a: 1,
        e: _("Template yang baik sulit dirusak dan jelas cara pakainya. Pengguna hanya mengisi sel yang ditandai.", "A good template is hard to break and obvious to use. Users only fill in marked cells."),
      },
      {
        q: _("Rumus menghasilkan #DIV/0! pada baris yang belum diisi. Cara paling rapi mengatasinya?", "A formula shows #DIV/0! on rows not yet filled in. Cleanest fix?"),
        o: [
          _("Hapus rumusnya", "Delete the formula"),
          _("Bungkus dengan IFERROR atau IF agar menampilkan kosong saat data belum ada", "Wrap it in IFERROR or IF to show blank when data is missing"),
          _("Ubah warna teks menjadi putih", "Make the text white"),
          _("Biarkan saja", "Leave it"),
        ],
        a: 1,
        e: _("IFERROR atau IF membuat template terlihat rapi tanpa menyembunyikan kesalahan sungguhan di baris yang sudah terisi.", "IFERROR or IF keeps the template tidy without hiding real errors in filled rows."),
      },
      {
        q: _("Seseorang menawarkan \"template Excel premium\" berisi macro dari sumber tidak jelas, gratis. Risiko utamanya?", "Someone offers a free \"premium Excel template\" with macros from an unknown source. Main risk?"),
        o: [
          _("Ukuran file terlalu besar", "File size is too big"),
          _("Macro bisa berisi kode berbahaya; jangan aktifkan macro dari sumber yang tidak terpercaya", "Macros can contain malicious code; don't enable macros from untrusted sources"),
          _("Warnanya tidak cocok", "Colours don't match"),
          _("Tidak ada risiko", "No risk"),
        ],
        a: 1,
        e: _("File Office dengan macro adalah cara lama menyebarkan malware. Aktifkan macro hanya dari sumber yang kamu percayai.", "Office files with macros are an old way to spread malware. Only enable macros from sources you trust."),
      },
    ],
    tugas: [
      {
        judul: _("Rancang template stok barang", "Design a stock tracking template"),
        brief: _(
          "Saya punya toko kecil dengan sekitar 80 jenis barang. Saya ingin template stok yang memberi tahu barang mana yang hampir habis. Saya tidak terlalu paham Excel.",
          "I run a small shop with about 80 products. I want a stock template that tells me which items are running low. I'm not great with Excel.",
        ),
        langkah: [
          _("Tentukan kolom-kolom yang dibutuhkan dan mana yang diisi manual atau otomatis.", "Define the columns and which are manual or automatic."),
          _("Tulis rumus untuk sisa stok dan status \"Perlu restok\".", "Write formulas for remaining stock and a \"Restock\" status."),
          _("Jelaskan fitur agar template mudah dipakai.", "Describe features that make it easy to use."),
        ],
        rubrik: [
          _("Kolom lengkap: kode, nama, stok awal, masuk, keluar, sisa, batas minimum, status", "Complete columns: code, name, opening stock, in, out, remaining, minimum, status"),
          _("Rumus sisa stok benar", "Remaining stock formula is correct"),
          _("Rumus status memakai IF dan batas minimum", "Status formula uses IF and the minimum"),
          _("Ada fitur ramah pengguna (warna input, sel terkunci, conditional formatting)", "Includes user-friendly features (input colours, locked cells, conditional formatting)"),
        ],
        contoh: _(
          "Kolom:\nA Kode (input) | B Nama (input) | C Stok awal (input) | D Masuk (input) | E Keluar (input) | F Sisa (otomatis) | G Batas minimum (input) | H Status (otomatis)\n\nRumus:\nF2: =C2+D2-E2\nH2: =IF(B2=\"\",\"\",IF(F2<=G2,\"Perlu restok\",\"Aman\"))\n\nFitur:\n• Sel input berwarna kuning muda, sel rumus terkunci\n• Conditional formatting: baris berwarna merah jika status \"Perlu restok\"\n• Filter di baris judul agar bisa menampilkan barang yang perlu restok saja\n• Sheet \"Cara Pakai\" berisi 4 langkah singkat",
          "Columns:\nA Code (input) | B Name (input) | C Opening stock (input) | D In (input) | E Out (input) | F Remaining (auto) | G Minimum (input) | H Status (auto)\n\nFormulas:\nF2: =C2+D2-E2\nH2: =IF(B2=\"\",\"\",IF(F2<=G2,\"Restock\",\"OK\"))\n\nFeatures:\n• Input cells light yellow, formula cells locked\n• Conditional formatting: row turns red when status is \"Restock\"\n• Filter on the header row to show only items to restock\n• A \"How to use\" sheet with 4 short steps",
        ),
      },
      {
        judul: _("Buat kalkulator harga jual", "Build a selling price calculator"),
        brief: _(
          "Saya jualan kue. Saya ingin kalkulator: masukkan biaya bahan, biaya kemasan, ongkos tenaga, dan target margin, lalu keluar harga jual. Bisa juga cek apakah harga di marketplace (potongan 8%) masih untung?",
          "I sell cakes. I want a calculator: enter ingredient cost, packaging, labour, and target margin, and it gives a selling price. Can it also check if a marketplace price (8% fee) is still profitable?",
        ),
        langkah: [
          _("Susun sel input dan sel hasil.", "Lay out input and output cells."),
          _("Tulis rumus harga jual berdasarkan margin dari harga jual.", "Write the selling price formula based on margin on price."),
          _("Tulis rumus laba bersih jika dijual di marketplace.", "Write the net profit formula when sold on a marketplace."),
        ],
        rubrik: [
          _("Total biaya dihitung dari semua komponen", "Total cost includes all components"),
          _("Rumus harga = biaya / (1 - margin), bukan biaya × (1 + margin) tanpa penjelasan", "Price = cost / (1 - margin), not cost × (1 + margin) without explanation"),
          _("Potongan marketplace dihitung dari harga jual", "Marketplace fee calculated from the selling price"),
          _("Ada contoh angka yang membuktikan rumusnya", "Includes example numbers proving the formulas"),
        ],
        contoh: _(
          "Input:\nB1 Biaya bahan: 30.000\nB2 Kemasan: 5.000\nB3 Tenaga: 10.000\nB4 Target margin: 30%\nB5 Potongan marketplace: 8%\n\nHasil:\nB7 Total biaya: =B1+B2+B3 → 45.000\nB8 Harga jual: =ROUNDUP(B7/(1-B4),-3) → 65.000\nB9 Laba di marketplace: =B8*(1-B5)-B7 → 14.800\nB10 Margin di marketplace: =B9/B8 → 22,8%\n\nCatatan: margin dihitung dari harga jual, jadi rumusnya biaya dibagi (1 - margin). Jika dijual di marketplace, margin turun dari 30% menjadi sekitar 23%, masih untung.",
          "Inputs:\nB1 Ingredients: 30,000\nB2 Packaging: 5,000\nB3 Labour: 10,000\nB4 Target margin: 30%\nB5 Marketplace fee: 8%\n\nOutputs:\nB7 Total cost: =B1+B2+B3 → 45,000\nB8 Selling price: =ROUNDUP(B7/(1-B4),-3) → 65,000\nB9 Marketplace profit: =B8*(1-B5)-B7 → 14,800\nB10 Marketplace margin: =B9/B8 → 22.8%\n\nNote: margin is on the selling price, so the formula divides cost by (1 - margin). On the marketplace, margin drops from 30% to about 23%, still profitable.",
        ),
      },
    ],
  },
};
