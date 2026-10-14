import { t as _ } from "../../i18n.js";

/** Cara lolos seleksi dan gambaran kerja: kategori Data & Analisis. */
export default {
  "data-entry": {
    kerja: {
      hari: [
        { jam: "08.00", isi: _("Terima batch data hari ini (scan formulir, PDF invoice, atau daftar produk) beserta aturan format dari klien.", "Receive today's batch (scanned forms, PDF invoices, or product lists) with the client's formatting rules.") },
        { jam: "08.30", isi: _("Siapkan sheet: format kolom (teks, tanggal, angka), daftar pilihan untuk kolom tertentu, dan rumus pengecekan.", "Set up the sheet: column formats (text, date, number), dropdowns, and check formulas.") },
        { jam: "09.00", isi: _("Input data dalam blok 45 menit dengan jeda singkat. Tandai data yang meragukan di kolom catatan.", "Enter data in 45-minute blocks with short breaks. Flag doubtful entries in a notes column.") },
        { jam: "13.00", isi: _("Cek kualitas: cari duplikat, sel kosong, format tanggal yang tidak seragam, dan cocokkan sampel acak dengan sumber.", "Quality check: find duplicates, blanks, inconsistent dates, and spot-check random rows against the source.") },
        { jam: "15.30", isi: _("Kirim hasil dengan ringkasan: jumlah baris, data bermasalah, dan pertanyaan untuk klien.", "Deliver with a summary: row count, problem records, and questions for the client.") },
      ],
      dinilai: [
        _("Tingkat akurasi (sering ditargetkan 99% atau lebih)", "Accuracy rate (often 99% or higher)"),
        _("Jumlah data per jam sesuai target", "Records per hour against target"),
        _("Konsistensi format", "Format consistency"),
        _("Laporan data bermasalah yang jelas", "Clear reporting of problem records"),
      ],
      tantangan: [
        { judul: _("Pekerjaan monoton", "Repetitive work"), isi: _("Bagi pekerjaan dalam blok waktu, gunakan pintasan keyboard, dan buat rumus pengecekan agar fokus tetap terjaga.", "Work in time blocks, use keyboard shortcuts, and build check formulas to stay sharp.") },
        { judul: _("Sumber data sulit dibaca", "Hard-to-read sources"), isi: _("Jangan menebak. Tandai data yang ragu dan tanyakan dalam satu daftar, bukan satu per satu.", "Don't guess. Flag doubtful data and ask in one list, not one at a time.") },
        { judul: _("Tarif rendah per data", "Low per-record rates"), isi: _("Tingkatkan nilai dengan menawarkan pembersihan data, otomasi sederhana, atau laporan, bukan hanya input.", "Add value by offering data cleaning, simple automation, or reports, not just entry.") },
      ],
      jenjang: _("Data entry yang menguasai Excel dan logika data bisa naik menjadi admin data, data cleaning specialist, operator sistem ERP, atau mulai belajar analisis data dan visualisasi.", "Data entry staff who master Excel and data logic can move into data admin, data cleaning, ERP operations, or start learning data analysis and visualisation."),
    },
    lolos: {
      alur: [
        _("Lamar proyek atau lowongan dengan menyebut tools dan kecepatan mengetik", "Apply mentioning your tools and typing speed"),
        _("Tes ketelitian: input 50 sampai 100 data dalam waktu tertentu", "Accuracy test: enter 50 to 100 records within a time limit"),
        _("Tes Excel dasar (sort, filter, rumus sederhana)", "Basic Excel test (sort, filter, simple formulas)"),
        _("Proyek percobaan kecil yang dibayar", "A small paid trial project"),
      ],
      portofolio: [
        _("Contoh sheet sebelum dan sesudah dibersihkan", "Before-and-after cleaned spreadsheets"),
        _("Hasil tes kecepatan mengetik dan akurasi", "Typing speed and accuracy test results"),
        _("Contoh template input dengan data validation", "A sample input template with data validation"),
      ],
      tes: _("Tes paling umum: memindahkan data dari gambar atau PDF ke spreadsheet dengan format tertentu. Kesalahan kecil seperti nol di depan nomor HP yang hilang atau tanggal tertukar sering jadi penentu gagal.", "Most common test: moving data from images or PDFs into a spreadsheet in a set format. Small slips like lost leading zeros or swapped dates often decide a fail."),
      pertanyaan: [
        { q: _("Bagaimana kamu menjaga akurasi saat bekerja cepat?", "How do you stay accurate while working fast?"), jawab: _("Sebut teknik konkret: data validation, rumus pengecekan, dan cek sampel acak.", "Name concrete techniques: data validation, check formulas, and random spot checks.") },
        { q: _("Apa yang kamu lakukan jika sumber data tidak terbaca?", "What do you do if the source is unreadable?"), jawab: _("Tandai, kumpulkan dalam daftar, dan tanyakan ke klien tanpa menebak.", "Flag it, collect a list, and ask the client without guessing.") },
        { q: _("Tools apa yang kamu kuasai?", "Which tools do you know?"), jawab: _("Sebutkan Excel atau Google Sheets beserta fitur spesifik yang kamu pakai.", "Name Excel or Google Sheets and the specific features you use.") },
      ],
      kesalahan: [
        _("Mengaku cepat tetapi akurasi tes rendah", "Claiming speed but scoring low on accuracy"),
        _("Tidak membaca aturan format", "Not reading formatting rules"),
        _("Membayar biaya pendaftaran ke situs input data palsu", "Paying fees to fake data entry sites"),
      ],
    },
  },

  "anotasi-data-ai": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Masuk ke platform anotasi, cek proyek yang tersedia dan pembaruan panduan (guidelines sering berubah).", "Log in to the annotation platform, check available projects and guideline updates (they change often).") },
        { jam: "09.30", isi: _("Kerjakan tugas: menilai jawaban chatbot, memberi label teks atau gambar, atau menulis contoh jawaban yang ideal.", "Work tasks: rating chatbot answers, labelling text or images, or writing ideal responses.") },
        { jam: "12.00", isi: _("Baca masukan reviewer dan contoh tugas yang dinilai salah untuk memperbaiki pemahaman.", "Read reviewer feedback and flagged examples to sharpen understanding.") },
        { jam: "13.00", isi: _("Lanjut tugas dengan fokus pada akurasi. Tandai tugas yang ambigu lewat fitur yang disediakan.", "Continue tasks focusing on accuracy. Flag ambiguous ones through the provided feature.") },
        { jam: "16.00", isi: _("Catat jam kerja atau jumlah tugas sesuai sistem pembayaran proyek.", "Log hours or task counts per the project's pay system.") },
      ],
      dinilai: [
        _("Skor kualitas dari reviewer atau tugas uji tersembunyi", "Quality score from reviewers or hidden test tasks"),
        _("Konsistensi dengan panduan dan anotator lain", "Consistency with guidelines and other annotators"),
        _("Produktivitas sesuai target waktu per tugas", "Productivity against time-per-task targets"),
      ],
      tantangan: [
        { judul: _("Pekerjaan tidak selalu tersedia", "Work isn't always available"), isi: _("Proyek datang dan pergi. Daftar di lebih dari satu platform dan jaga skor kualitas agar mendapat prioritas.", "Projects come and go. Join more than one platform and keep your quality score high for priority access.") },
        { judul: _("Panduan yang panjang dan berubah", "Long, changing guidelines"), isi: _("Buat ringkasan pribadi dari panduan dan perbarui setiap ada perubahan.", "Keep a personal summary of the guidelines and update it with every change.") },
        { judul: _("Konten yang tidak nyaman", "Uncomfortable content"), isi: _("Beberapa proyek berisi konten sensitif. Kamu boleh memilih tidak mengambil proyek seperti itu dan beristirahat bila perlu.", "Some projects involve sensitive content. You may opt out and take breaks when needed.") },
      ],
      jenjang: _("Anotator dengan skor tinggi bisa menjadi reviewer, quality lead, atau pindah ke proyek khusus yang dibayar lebih tinggi, misalnya evaluasi AI di bidang hukum, kesehatan, atau pemrograman jika punya latar belakangnya.", "High-scoring annotators can become reviewers or quality leads, or move to specialist projects that pay more, such as AI evaluation in law, health, or coding if they have the background."),
    },
    lolos: {
      alur: [
        _("Daftar di platform anotasi dan verifikasi identitas", "Register on annotation platforms and verify identity"),
        _("Tes kualifikasi: memahami panduan lalu mengerjakan contoh tugas", "Qualification test: read guidelines and complete sample tasks"),
        _("Tes bahasa (misalnya bahasa Indonesia dan Inggris)", "Language tests (e.g. Indonesian and English)"),
        _("Masuk ke proyek, akses bertambah sesuai skor kualitas", "Join projects; access grows with your quality score"),
      ],
      portofolio: [
        _("Pada umumnya tidak perlu portofolio, yang dinilai adalah hasil tes", "Usually no portfolio needed; test results matter"),
        _("Latar belakang pendidikan atau keahlian khusus menambah peluang proyek bernilai tinggi", "Education or specialist skills open higher-value projects"),
      ],
      tes: _("Tes biasanya berisi bacaan panduan 10 sampai 30 halaman lalu belasan contoh tugas. Banyak yang gagal karena membaca panduan sekilas. Kerjakan perlahan, karena tes ini menilai ketelitian, bukan kecepatan.", "Tests usually involve reading 10 to 30 pages of guidelines then a dozen sample tasks. Many fail by skimming. Go slowly; it's about care, not speed."),
      pertanyaan: [
        { q: _("Bagaimana kamu menilai jawaban AI yang benar tetapi kurang membantu?", "How do you rate an AI answer that's correct but unhelpful?"), jawab: _("Jelaskan bahwa kamu menilai per kriteria sesuai panduan, misalnya akurasi tinggi tetapi kegunaan rendah, dan menuliskan alasannya.", "Explain you score each criterion per the guidelines, e.g. high accuracy but low helpfulness, with a rationale.") },
      ],
      kesalahan: [
        _("Membaca panduan sekilas", "Skimming the guidelines"),
        _("Membeli akun atau memakai akun orang lain", "Buying or using someone else's account"),
        _("Memakai AI untuk mengerjakan tugas anotasi, yang biasanya dilarang", "Using AI to do annotation tasks, which is usually banned"),
      ],
    },
  },

  "visualisasi-data": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Cek apakah sumber data dashboard (database, Google Sheets, atau sistem penjualan) berhasil diperbarui semalam.", "Check whether dashboard data sources (database, Google Sheets, or sales system) refreshed overnight.") },
        { jam: "10.00", isi: _("Rapat kebutuhan dengan pengguna: pertanyaan bisnis apa yang ingin dijawab dan keputusan apa yang akan diambil.", "Requirements call with users: which business questions to answer and which decisions follow.") },
        { jam: "11.00", isi: _("Bersihkan dan gabungkan data dengan SQL, Power Query, atau spreadsheet.", "Clean and join data with SQL, Power Query, or spreadsheets.") },
        { jam: "14.00", isi: _("Bangun atau perbarui dashboard, lalu cocokkan angka utama dengan laporan resmi.", "Build or update the dashboard, then reconcile headline numbers with official reports.") },
        { jam: "16.00", isi: _("Kirim versi uji, kumpulkan masukan, dan tulis catatan cara membaca dashboard.", "Share a test version, gather feedback, and write notes on how to read it.") },
      ],
      dinilai: [
        _("Angka di dashboard cocok dengan sumber resmi", "Dashboard numbers match official sources"),
        _("Dashboard benar-benar dipakai untuk keputusan", "The dashboard is actually used for decisions"),
        _("Kecepatan memenuhi permintaan laporan baru", "Speed in meeting new report requests"),
      ],
      tantangan: [
        { judul: _("Data kotor dan tidak lengkap", "Dirty, incomplete data"), isi: _("Catat semua aturan pembersihan dan beri tahu pengguna keterbatasan datanya.", "Document every cleaning rule and tell users the data's limits.") },
        { judul: _("Permintaan grafik yang terus bertambah", "Ever-growing chart requests"), isi: _("Kembalikan ke pertanyaan bisnis. Jika grafik baru tidak membantu keputusan, sarankan ditaruh di halaman detail.", "Go back to the business question. If a chart won't aid a decision, suggest a detail page.") },
        { judul: _("Angka yang berbeda antar-tim", "Numbers differing between teams"), isi: _("Sepakati definisi metrik secara tertulis, misalnya apakah pendapatan dihitung sebelum atau sesudah diskon.", "Agree metric definitions in writing, e.g. whether revenue is before or after discounts.") },
      ],
      jenjang: _("Dari pembuat dashboard kamu bisa menjadi data analyst, BI developer, atau analytics engineer jika mendalami SQL dan pemodelan data.", "From dashboard builder you can become a data analyst, BI developer, or analytics engineer by going deeper into SQL and data modelling."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan tautan portofolio dashboard publik", "Apply with links to public dashboards"),
        _("Tes teknis: membuat dashboard dari dataset dalam 2 sampai 5 hari", "Technical test: build a dashboard from a dataset in 2 to 5 days"),
        _("Presentasi hasil tes dan tanya jawab", "Present the test and answer questions"),
        _("Interview dengan pengguna bisnis", "Interview with business stakeholders"),
      ],
      portofolio: [
        _("2 sampai 3 dashboard publik (Tableau Public, Looker Studio, atau Power BI) dengan cerita bisnis yang jelas", "2 to 3 public dashboards (Tableau Public, Looker Studio, or Power BI) with a clear business story"),
        _("Tulisan singkat proses: pertanyaan, data, pembersihan, dan temuan", "A short write-up: question, data, cleaning, and findings"),
        _("Contoh query SQL jika melamar posisi yang membutuhkannya", "Sample SQL queries if the role needs it"),
      ],
      tes: _("Kamu biasanya diberi dataset penjualan atau operasional dan pertanyaan bisnis yang terbuka. Yang dinilai: apakah kamu menjawab pertanyaan, pilihan grafik, kerapian, dan kemampuan menjelaskan temuan dalam 5 menit.", "You usually get a sales or operations dataset and an open business question. They judge whether you answered it, chart choices, tidiness, and explaining findings in 5 minutes."),
      pertanyaan: [
        { q: _("Bagaimana kamu memilih jenis grafik?", "How do you choose a chart type?"), jawab: _("Jelaskan berdasarkan tujuan: tren waktu dengan garis, perbandingan dengan batang, komposisi dengan batang bertumpuk.", "Explain by purpose: lines for trends, bars for comparisons, stacked bars for composition.") },
        { q: _("Ceritakan dashboard yang mengubah keputusan.", "Tell me about a dashboard that changed a decision."), jawab: _("Ceritakan masalah, apa yang kamu bangun, dan keputusan atau hasil yang terjadi.", "Describe the problem, what you built, and the resulting decision or outcome.") },
      ],
      kesalahan: [
        _("Portofolio berisi grafik cantik tanpa pertanyaan bisnis", "Pretty charts with no business question"),
        _("Tidak mengecek angka dengan sumber", "Not reconciling numbers with sources"),
        _("Presentasi yang membacakan semua grafik", "Presentations that read out every chart"),
      ],
    },
  },

  "analis-statistik": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Baca tujuan penelitian atau pertanyaan bisnis klien, serta cara data dikumpulkan.", "Read the research aim or business question and how data was collected.") },
        { jam: "10.00", isi: _("Periksa data: nilai hilang, pencilan, dan kesalahan input. Catat semua perubahan.", "Inspect data: missing values, outliers, and entry errors. Log every change.") },
        { jam: "13.00", isi: _("Pilih metode, cek asumsi, lalu jalankan analisis di SPSS, R, atau Python.", "Choose methods, check assumptions, then run the analysis in SPSS, R, or Python.") },
        { jam: "15.00", isi: _("Susun tabel dan grafik hasil, tulis interpretasi dalam bahasa yang dipahami klien.", "Build result tables and charts, and write interpretations the client understands.") },
        { jam: "16.30", isi: _("Kirim hasil dengan catatan keterbatasan dan jadwalkan sesi penjelasan bila perlu.", "Deliver with limitations noted and schedule an explanation call if needed.") },
      ],
      dinilai: [
        _("Ketepatan metode dan kebenaran hasil", "Method fit and correct results"),
        _("Kejelasan interpretasi", "Clarity of interpretation"),
        _("Kemampuan menjelaskan dan menjawab pertanyaan klien", "Ability to explain and answer client questions"),
      ],
      tantangan: [
        { judul: _("Klien ingin hasil tertentu", "Clients wanting a specific result"), isi: _("Jelaskan bahwa hasil tidak signifikan juga merupakan temuan. Jangan pernah mengubah data.", "Explain non-significant results are findings too. Never alter data.") },
        { judul: _("Data yang tidak memenuhi asumsi", "Data violating assumptions"), isi: _("Siapkan alternatif non-parametrik atau transformasi data, dan jelaskan pilihannya.", "Have non-parametric alternatives or transformations ready, and explain the choice.") },
        { judul: _("Batas etika akademik", "Academic ethics limits"), isi: _("Bantu analisis dan penjelasan, tetapi jangan menulis skripsi atau tesis atas nama orang lain.", "Help with analysis and explanation, but don't write theses for others.") },
      ],
      jenjang: _("Analis statistik bisa berkembang menjadi data scientist, peneliti di lembaga riset atau konsultan, atau biostatistisi jika mendalami bidang kesehatan.", "Statistical analysts can grow into data scientists, researchers at institutes or consultancies, or biostatisticians in health."),
    },
    lolos: {
      alur: [
        _("Tawarkan jasa di marketplace, komunitas riset, atau LinkedIn", "Offer services on marketplaces, research communities, or LinkedIn"),
        _("Diskusi awal untuk memahami data dan tujuan klien", "An initial call to understand data and goals"),
        _("Penawaran dengan ruang lingkup dan jadwal", "A proposal with scope and timeline"),
        _("Untuk posisi tetap: tes analisis dan interview teknis", "For employed roles: an analysis test and technical interview"),
      ],
      portofolio: [
        _("Contoh laporan analisis dari data publik (BPS, Kaggle) dengan metode dan interpretasi", "Sample reports from public data (BPS, Kaggle) with methods and interpretation"),
        _("Kode R atau Python yang rapi di GitHub", "Clean R or Python code on GitHub"),
        _("Latar belakang pendidikan statistika atau riset", "A statistics or research background"),
      ],
      tes: _("Tes biasanya berupa dataset dengan pertanyaan seperti \"apakah ada perbedaan antara kelompok A dan B\". Penilai melihat pemilihan uji, pengecekan asumsi, dan apakah kamu menjelaskan besar efek, bukan hanya p-value.", "Tests usually give a dataset and a question like \"is there a difference between groups A and B\". They look at test choice, assumption checks, and whether you explain effect size, not just p-values."),
      pertanyaan: [
        { q: _("Apa beda signifikan secara statistik dan penting secara praktis?", "What's the difference between statistically significant and practically important?"), jawab: _("Jelaskan bahwa sampel besar bisa membuat perbedaan kecil menjadi signifikan, jadi besar efek perlu dilaporkan.", "Explain large samples can make tiny differences significant, so effect sizes matter.") },
        { q: _("Bagaimana menangani data yang hilang?", "How do you handle missing data?"), jawab: _("Sebut pilihan (hapus, imputasi) dan bahwa pilihan bergantung pada pola dan jumlah data yang hilang.", "Name options (deletion, imputation) and that it depends on the pattern and amount missing.") },
      ],
      kesalahan: [
        _("Menjalankan uji tanpa mengecek asumsi", "Running tests without checking assumptions"),
        _("Interpretasi yang hanya menyalin output software", "Interpretation that just copies software output"),
        _("Menerima permintaan mengubah data", "Agreeing to alter data"),
      ],
    },
  },

  "spreadsheet-template": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Wawancara singkat dengan klien tentang alur kerjanya saat ini: data apa yang dicatat, siapa yang mengisi, laporan apa yang dibutuhkan.", "Short interview on the client's current workflow: what data, who enters it, which reports are needed.") },
        { jam: "10.00", isi: _("Rancang struktur: sheet input, sheet data, dan sheet laporan, beserta alur antar-sheet.", "Design the structure: input, data, and report sheets, and how they connect.") },
        { jam: "11.00", isi: _("Bangun rumus, data validation, dan conditional formatting.", "Build formulas, data validation, and conditional formatting.") },
        { jam: "14.00", isi: _("Uji dengan data contoh, termasuk kasus aneh seperti sel kosong dan angka negatif.", "Test with sample data, including edge cases like blanks and negatives.") },
        { jam: "15.30", isi: _("Kunci sel rumus, tulis petunjuk penggunaan, dan rekam video tutorial singkat untuk klien.", "Lock formula cells, write instructions, and record a short tutorial video.") },
      ],
      dinilai: [
        _("Template benar-benar dipakai dan mengurangi kerja manual", "The template is used and cuts manual work"),
        _("Rumus benar dan tidak rusak saat data bertambah", "Formulas are correct and survive growing data"),
        _("Mudah dipakai oleh orang yang tidak paham Excel", "Easy for non-Excel users"),
      ],
      tantangan: [
        { judul: _("Pengguna merusak rumus", "Users breaking formulas"), isi: _("Kunci sel rumus, beri warna sel input, dan sediakan sheet petunjuk.", "Lock formula cells, colour input cells, and include an instructions sheet.") },
        { judul: _("Kebutuhan berubah setelah jadi", "Needs change after delivery"), isi: _("Sepakati ruang lingkup di awal dan tawarkan paket perubahan atau pemeliharaan.", "Agree scope upfront and offer a change or maintenance package.") },
        { judul: _("Versi Excel berbeda", "Different Excel versions"), isi: _("Tanyakan versi yang dipakai klien. Rumus seperti XLOOKUP tidak ada di Excel lama.", "Ask which version they use. XLOOKUP isn't in older Excel.") },
      ],
      jenjang: _("Pembuat template bisa menjual template sebagai produk digital, menjadi konsultan otomasi kantor dengan Apps Script atau VBA, atau beralih ke analisis data dan BI.", "Template builders can sell templates as digital products, become office automation consultants with Apps Script or VBA, or move into data analysis and BI."),
    },
    lolos: {
      alur: [
        _("Tampilkan contoh template di marketplace atau media sosial", "Show sample templates on marketplaces or social media"),
        _("Diskusi kebutuhan dengan calon klien", "Discuss needs with prospects"),
        _("Penawaran harga dengan daftar fitur dan jumlah revisi", "A quote with a feature list and revision count"),
        _("Untuk posisi kantor: tes Excel praktik", "For office roles: a hands-on Excel test"),
      ],
      portofolio: [
        _("Video demo 1 menit untuk 3 template berbeda", "1-minute demo videos of 3 different templates"),
        _("Template yang bisa dicoba versi gratisnya", "A free trial version of a template"),
        _("Sertifikat Excel bila ada", "Excel certificates if any"),
      ],
      tes: _("Tes Excel praktik biasanya meminta lookup, SUMIFS, pivot table, dan membersihkan data dalam 30 sampai 60 menit. Rapikan hasilnya, karena penguji juga melihat kemudahan file dibaca orang lain.", "Hands-on Excel tests usually ask for lookups, SUMIFS, pivot tables, and data cleaning in 30 to 60 minutes. Keep it tidy, as testers also judge readability."),
      pertanyaan: [
        { q: _("Bagaimana kamu memastikan template tidak rusak di tangan pengguna?", "How do you make templates hard to break?"), jawab: _("Sebut proteksi sheet, data validation, warna sel input, dan petunjuk.", "Mention sheet protection, data validation, input cell colours, and instructions.") },
        { q: _("Kapan memakai Apps Script atau VBA?", "When do you use Apps Script or VBA?"), jawab: _("Saat rumus tidak cukup, misalnya mengirim email otomatis atau memproses banyak file.", "When formulas aren't enough, e.g. sending automatic emails or processing many files.") },
      ],
      kesalahan: [
        _("Template penuh warna dan efek yang sulit dipakai", "Templates full of colours and effects that are hard to use"),
        _("Rumus yang ditulis manual angka, bukan referensi sel", "Hardcoded numbers instead of cell references"),
        _("Tidak menguji dengan data yang banyak", "Not testing with large data"),
      ],
    },
  },
};
