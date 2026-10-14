import { t as _ } from "../../i18n.js";

/** Cara lolos seleksi dan gambaran kerja: kategori Keuangan & Bisnis. */
export default {
  "admin-keuangan": {
    kerja: {
      hari: [
        { jam: "08.30", isi: _("Unduh mutasi rekening dan rekap penjualan kemarin dari marketplace atau kasir.", "Download bank statements and yesterday's sales from marketplaces or the POS.") },
        { jam: "09.00", isi: _("Catat transaksi ke software akuntansi (Jurnal, Accurate, atau spreadsheet), lampirkan bukti untuk setiap transaksi.", "Record transactions in accounting software (Jurnal, Accurate, or spreadsheets), attaching proof for each.") },
        { jam: "11.00", isi: _("Kirim invoice baru dan pengingat untuk piutang yang lewat tempo.", "Send new invoices and reminders for overdue receivables.") },
        { jam: "14.00", isi: _("Siapkan pembayaran ke vendor sesuai jadwal, lalu minta persetujuan pemilik usaha.", "Prepare scheduled vendor payments and get the owner's approval.") },
        { jam: "16.00", isi: _("Rekonsiliasi saldo bank dengan pembukuan dan catat selisih yang perlu ditanyakan.", "Reconcile bank balances with the books and note gaps to query.") },
      ],
      dinilai: [
        _("Pembukuan rapi dan tutup buku bulanan tepat waktu", "Clean books and on-time monthly close"),
        _("Saldo bank selalu cocok dengan catatan", "Bank balances always reconcile"),
        _("Piutang tertagih tepat waktu", "Receivables collected on time"),
        _("Tidak ada pembayaran ganda atau salah transfer", "No duplicate or misdirected payments"),
      ],
      tantangan: [
        { judul: _("Bukti transaksi tidak lengkap", "Missing receipts"), isi: _("Buat aturan sederhana bersama pemilik: tidak ada bukti, tidak dicatat sebagai biaya usaha. Kirim daftar bukti yang kurang setiap minggu.", "Agree a simple rule with the owner: no receipt, no business expense. Send a weekly list of missing receipts.") },
        { judul: _("Uang pribadi dan usaha tercampur", "Mixed personal and business money"), isi: _("Catat pengeluaran pribadi sebagai prive dan sarankan rekening terpisah.", "Record personal spending as owner's drawings and suggest separate accounts.") },
        { judul: _("Akses rekening yang sensitif", "Sensitive bank access"), isi: _("Gunakan akses lihat saja bila bisa, dan pastikan setiap pembayaran disetujui pemilik.", "Use view-only access where possible and ensure the owner approves every payment.") },
      ],
      jenjang: _("Admin keuangan bisa naik menjadi staf akuntansi, accounting supervisor, atau finance manager. Banyak juga yang membuka jasa pembukuan untuk beberapa UMKM sekaligus.", "Finance admins can move up to accounting staff, accounting supervisor, or finance manager. Many also run bookkeeping services for several small businesses."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan CV yang menyebut software akuntansi yang dikuasai", "Apply listing the accounting software you know"),
        _("Tes akuntansi dasar: jurnal, laporan laba rugi, dan rekonsiliasi", "Basic accounting test: journals, P&L, and reconciliation"),
        _("Tes Excel: rumus, pivot, dan kerapian", "Excel test: formulas, pivots, and tidiness"),
        _("Interview dengan pemilik usaha atau manajer keuangan", "Interview with the owner or finance manager"),
      ],
      portofolio: [
        _("Contoh laporan laba rugi dan neraca sederhana dari data contoh", "A sample P&L and simple balance sheet from example data"),
        _("Template rekonsiliasi bank di Excel", "An Excel bank reconciliation template"),
        _("Sertifikat software akuntansi atau brevet pajak", "Accounting software or tax certificates"),
      ],
      tes: _("Tes biasanya berupa daftar transaksi satu bulan yang harus dicatat lalu disusun menjadi laporan laba rugi, ditambah rekonsiliasi dengan mutasi bank. Ketelitian angka dan pemisahan transaksi pribadi sering menjadi penentu.", "Tests usually give a month of transactions to record and turn into a P&L, plus a bank reconciliation. Numerical accuracy and separating personal items often decide it."),
      pertanyaan: [
        { q: _("Apa yang kamu lakukan jika saldo bank tidak cocok?", "What do you do when the bank doesn't reconcile?"), jawab: _("Jelaskan langkah mencocokkan transaksi, mencari perbedaan waktu, biaya bank, atau salah catat.", "Explain matching transactions and looking for timing differences, bank fees, or entry errors.") },
        { q: _("Apa beda laba dan arus kas?", "What's the difference between profit and cash flow?"), jawab: _("Laba dicatat saat transaksi terjadi, kas saat uang diterima atau dibayar. Beri contoh piutang.", "Profit is recorded when transactions occur, cash when money moves. Give a receivables example.") },
      ],
      kesalahan: [
        _("Tidak menguasai Excel dasar", "Weak basic Excel"),
        _("Salah hitung kecil di tes", "Small calculation slips in tests"),
        _("Bersedia memalsukan bukti atau laporan saat ditanya", "Willingness to falsify receipts or reports when asked"),
      ],
    },
  },

  "business-plan": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Wawancara klien tentang usaha, target pembaca (bank, investor, atau hibah), dan jumlah dana yang dibutuhkan.", "Interview the client about the business, target reader (bank, investor, or grant), and funding needed.") },
        { jam: "10.30", isi: _("Riset pasar dan kompetitor dari data publik, laporan industri, dan observasi.", "Research the market and competitors from public data, industry reports, and observation.") },
        { jam: "13.00", isi: _("Bangun model keuangan: asumsi, proyeksi pendapatan, biaya, arus kas, dan titik impas.", "Build the financial model: assumptions, revenue, costs, cash flow, and break-even.") },
        { jam: "15.00", isi: _("Tulis bagian dokumen dan tandai data yang masih harus dilengkapi klien.", "Write document sections and flag data the client must supply.") },
        { jam: "16.30", isi: _("Kirim draf bagian untuk ditinjau dan jadwalkan sesi revisi.", "Send draft sections for review and schedule a revision call.") },
      ],
      dinilai: [
        _("Dokumen lolos ke tahap berikutnya (rapat investor, kredit disetujui, hibah lolos seleksi)", "The document advances (investor meeting, loan approved, grant shortlisted)"),
        _("Asumsi keuangan masuk akal dan bisa dipertanggungjawabkan", "Financial assumptions are sensible and defensible"),
        _("Dokumen ringkas dan mudah dibaca", "Concise, readable documents"),
      ],
      tantangan: [
        { judul: _("Klien terlalu optimis", "Overly optimistic clients"), isi: _("Buat tiga skenario (pesimis, realistis, optimis) dan jelaskan asumsinya.", "Build three scenarios (pessimistic, realistic, optimistic) with clear assumptions.") },
        { judul: _("Data usaha tidak lengkap", "Incomplete business data"), isi: _("Kirim daftar data yang dibutuhkan sejak awal dan tandai bagian yang masih memakai perkiraan.", "Send a data checklist upfront and mark sections still using estimates.") },
        { judul: _("Permintaan memalsukan angka", "Requests to fake numbers"), isi: _("Tolak dengan tegas, lalu bantu menyajikan data asli secara meyakinkan.", "Decline firmly, then help present real data persuasively.") },
      ],
      jenjang: _("Penulis business plan bisa berkembang menjadi konsultan bisnis, analis di inkubator atau modal ventura, atau konsultan pendanaan UMKM.", "Business plan writers can become business consultants, analysts at incubators or VCs, or small-business funding advisers."),
    },
    lolos: {
      alur: [
        _("Tampilkan contoh dokumen dan model keuangan (data disamarkan)", "Show sample documents and models (anonymised)"),
        _("Konsultasi awal untuk memahami kebutuhan", "An initial consultation"),
        _("Penawaran dengan ruang lingkup, jadwal, dan revisi", "A proposal with scope, timeline, and revisions"),
      ],
      portofolio: [
        _("Business plan lengkap untuk usaha fiktif dengan model keuangan Excel", "A full business plan for a fictional business with an Excel model"),
        _("Contoh pitch deck pendek", "A short sample pitch deck"),
        _("Testimoni klien yang dananya cair atau lolos seleksi", "Testimonials from funded or shortlisted clients"),
      ],
      tes: _("Klien jarang memberi tes, tetapi akan menilai pertanyaanmu di sesi pertama. Pertanyaan tentang model bisnis, pelanggan, dan angka menunjukkan bahwa kamu paham.", "Clients rarely test you, but they judge your questions in the first call. Questions on the model, customers, and numbers show you know your stuff."),
      pertanyaan: [
        { q: _("Apa bedanya business plan untuk bank dan investor?", "How do plans for banks and investors differ?"), jawab: _("Bank fokus pada kemampuan bayar dan jaminan, investor pada pertumbuhan dan potensi keuntungan besar.", "Banks focus on repayment ability and collateral; investors on growth and upside.") },
        { q: _("Bagaimana kamu membuat proyeksi untuk usaha yang belum berjalan?", "How do you project for a business that hasn't started?"), jawab: _("Bangun dari bawah: kapasitas, harga, konversi, dan data pembanding dari usaha serupa.", "Build bottom-up: capacity, price, conversion, and benchmarks from similar businesses.") },
      ],
      kesalahan: [
        _("Proyeksi tanpa asumsi yang jelas", "Projections without clear assumptions"),
        _("Dokumen terlalu panjang dan bertele-tele", "Overlong, rambling documents"),
        _("Menyalin template tanpa menyesuaikan dengan usaha klien", "Copying templates without tailoring"),
      ],
    },
  },

  "konsultan-pajak": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Kumpulkan dokumen klien: bukti potong, catatan penghasilan, daftar harta dan utang.", "Collect client documents: withholding slips, income records, assets and debts.") },
        { jam: "10.00", isi: _("Hitung pajak dan siapkan draf SPT, catat hal yang perlu dikonfirmasi.", "Calculate tax and draft the return, noting items to confirm.") },
        { jam: "13.00", isi: _("Video call dengan klien untuk menjelaskan hasil perhitungan dan meminta persetujuan.", "Video call to explain the calculation and get approval.") },
        { jam: "14.30", isi: _("Bantu klien melaporkan lewat Coretax (klien yang memasukkan kode verifikasi) dan simpan bukti penerimaan.", "Help the client file via Coretax (the client enters verification codes) and save the receipt.") },
        { jam: "16.00", isi: _("Ikuti pembaruan peraturan dari situs resmi DJP dan catat dampaknya untuk klien.", "Follow regulation updates from the official DGT site and note client impacts.") },
      ],
      dinilai: [
        _("SPT dilaporkan tepat waktu dan tanpa kesalahan", "Returns filed on time and error-free"),
        _("Klien paham kewajibannya", "Clients understand their obligations"),
        _("Kerahasiaan data terjaga", "Data stays confidential"),
      ],
      tantangan: [
        { judul: _("Lonjakan kerja menjelang 31 Maret", "The March deadline rush"), isi: _("Mulai kumpulkan dokumen klien sejak Januari dan batasi jumlah klien sesuai kapasitas.", "Start collecting documents in January and cap clients at your capacity.") },
        { judul: _("Aturan yang sering berubah", "Frequently changing rules"), isi: _("Rujuk selalu ke peraturan resmi terbaru dan catat sumbernya di setiap penjelasan.", "Always refer to the latest official rules and cite sources.") },
        { judul: _("Batas kewenangan", "Limits of authority"), isi: _("Mewakili klien secara resmi di hadapan kantor pajak memerlukan izin kuasa hukum pajak atau konsultan pajak. Jelaskan batas jasamu.", "Formally representing clients before tax offices requires a tax consultant licence. Explain your service limits.") },
      ],
      jenjang: _("Dari pendamping SPT, kamu bisa mengambil ujian sertifikasi konsultan pajak, bekerja di kantor konsultan pajak, atau menjadi staf pajak perusahaan.", "From return assistant you can take the tax consultant certification exam, join a tax firm, or become an in-house tax officer."),
    },
    lolos: {
      alur: [
        _("Ikuti pelatihan brevet pajak sebagai dasar", "Take a tax brevet course as a foundation"),
        _("Untuk kantor konsultan: tes hitung pajak dan interview", "For tax firms: a tax calculation test and interview"),
        _("Untuk jasa mandiri: bangun kepercayaan lewat konten edukasi dan rekomendasi", "For independent work: build trust via education content and referrals"),
      ],
      portofolio: [
        _("Sertifikat brevet atau pelatihan pajak", "Brevet or tax training certificates"),
        _("Contoh perhitungan pajak untuk kasus fiktif", "Sample tax calculations for fictional cases"),
        _("Konten edukasi pajak yang akurat", "Accurate tax education content"),
      ],
      tes: _("Kantor konsultan biasanya memberi kasus: menghitung PPh orang pribadi dengan beberapa sumber penghasilan, atau mengisi SPT dari dokumen contoh. Ketelitian dan pemahaman aturan terbaru menjadi kunci.", "Tax firms usually give cases: calculating individual income tax with several income sources, or filling a return from sample documents. Accuracy and current rules are key."),
      pertanyaan: [
        { q: _("Bagaimana kamu mengikuti perubahan aturan pajak?", "How do you keep up with tax changes?"), jawab: _("Sebut sumber resmi seperti situs DJP dan peraturan yang diterbitkan, serta kebiasaan membacanya.", "Name official sources like the DGT site and published regulations, and your reading habit.") },
        { q: _("Apa yang kamu lakukan jika klien ingin menyembunyikan penghasilan?", "What if a client wants to hide income?"), jawab: _("Tolak, jelaskan risiko sanksi, dan tawarkan perencanaan pajak yang legal.", "Decline, explain penalties, and offer legal tax planning.") },
      ],
      kesalahan: [
        _("Memakai aturan lama", "Using outdated rules"),
        _("Meminta password atau kode verifikasi klien", "Asking for clients' passwords or verification codes"),
        _("Menjanjikan pajak nol tanpa dasar", "Promising zero tax without basis"),
      ],
    },
  },

  "sop-compliance": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Wawancara staf yang menjalankan proses, rekam alur kerja nyata termasuk pengecualian.", "Interview staff who run the process, capturing the real flow and exceptions.") },
        { jam: "11.00", isi: _("Gambar diagram alur di Draw.io atau Miro dan tandai titik risiko.", "Draw the flowchart in Draw.io or Miro and mark risk points.") },
        { jam: "13.00", isi: _("Tulis SOP: tujuan, ruang lingkup, penanggung jawab, langkah, dan formulir.", "Write the SOP: purpose, scope, owners, steps, and forms.") },
        { jam: "15.00", isi: _("Uji SOP dengan meminta staf baru membaca dan menjalankannya.", "Test the SOP by having a new staff member follow it.") },
        { jam: "16.30", isi: _("Kirim draf untuk persetujuan dan catat versi dokumen.", "Send the draft for approval and log the version.") },
      ],
      dinilai: [
        _("SOP dipakai dan mengurangi kesalahan", "SOPs are used and reduce errors"),
        _("Lolos audit atau pemeriksaan", "Passing audits or inspections"),
        _("Dokumen mudah dipahami staf", "Documents are easy for staff"),
      ],
      tantangan: [
        { judul: _("Staf menolak perubahan", "Staff resisting change"), isi: _("Libatkan staf sejak awal dan jelaskan manfaatnya bagi mereka, misalnya lebih sedikit kesalahan dan teguran.", "Involve staff early and explain benefits to them, like fewer errors and reprimands.") },
        { judul: _("SOP yang terlalu ideal", "Overly idealised SOPs"), isi: _("Tulis berdasarkan proses nyata, lalu perbaiki bertahap.", "Write from the real process, then improve gradually.") },
        { judul: _("Permintaan dokumen fiktif", "Requests for fake documents"), isi: _("Tolak dan tawarkan rencana perbaikan yang jujur.", "Decline and offer an honest remediation plan.") },
      ],
      jenjang: _("Penulis SOP bisa menjadi konsultan proses bisnis, internal auditor, compliance officer, atau quality manager.", "SOP writers can become business process consultants, internal auditors, compliance officers, or quality managers."),
    },
    lolos: {
      alur: [
        _("Tunjukkan contoh SOP dan diagram alur", "Show sample SOPs and flowcharts"),
        _("Diskusi tentang proses yang ingin dirapikan", "Discuss the processes to fix"),
        _("Penawaran per dokumen atau per proyek", "Quote per document or project"),
        _("Untuk posisi tetap: tes menulis SOP dari deskripsi proses", "For employed roles: write an SOP from a process description"),
      ],
      portofolio: [
        _("2 sampai 3 SOP lengkap dengan diagram alur", "2 to 3 complete SOPs with flowcharts"),
        _("Contoh checklist kepatuhan", "A sample compliance checklist"),
        _("Pengalaman audit, keuangan, HR, atau operasional", "Audit, finance, HR, or operations experience"),
      ],
      tes: _("Kamu biasanya diberi cerita proses yang berantakan dan diminta mengubahnya menjadi SOP dan diagram. Penilai melihat kejelasan langkah, penanggung jawab, dan kontrol risiko.", "You're usually given a messy process story to turn into an SOP and diagram. Graders look at clear steps, owners, and risk controls."),
      pertanyaan: [
        { q: _("Bagaimana memastikan SOP dipakai, bukan disimpan saja?", "How do you make sure SOPs are used, not shelved?"), jawab: _("Libatkan pengguna, buat singkat, latih, dan tinjau berkala.", "Involve users, keep them short, train people, and review regularly.") },
        { q: _("Apa itu pemisahan tugas?", "What's segregation of duties?"), jawab: _("Jelaskan bahwa satu proses penting dibagi ke beberapa orang agar kesalahan dan kecurangan lebih mudah terdeteksi.", "Explain splitting key steps among people so errors and fraud are easier to catch.") },
      ],
      kesalahan: [
        _("SOP panjang penuh istilah", "Long, jargon-heavy SOPs"),
        _("Tidak menyebut penanggung jawab", "No named owners"),
        _("Menulis tanpa melihat proses nyata", "Writing without seeing the real process"),
      ],
    },
  },

  "analis-keuangan": {
    kerja: {
      hari: [
        { jam: "08.30", isi: _("Baca berita pasar dan keterbukaan informasi perusahaan yang dipantau.", "Read market news and disclosures from covered companies.") },
        { jam: "09.30", isi: _("Perbarui model keuangan dengan laporan terbaru dan cek perubahan asumsi.", "Update financial models with the latest reports and check assumption changes.") },
        { jam: "13.00", isi: _("Tulis catatan riset atau memo: temuan, risiko, dan sensitivitas.", "Write a research note or memo: findings, risks, and sensitivities.") },
        { jam: "15.00", isi: _("Diskusi dengan tim atau klien, jawab pertanyaan tentang angka.", "Discuss with the team or client and answer questions on the numbers.") },
        { jam: "16.30", isi: _("Rapikan model: dokumentasi asumsi dan pengecekan rumus.", "Tidy the model: document assumptions and check formulas.") },
      ],
      dinilai: [
        _("Akurasi model dan kualitas analisis", "Model accuracy and analysis quality"),
        _("Kejelasan kesimpulan untuk pengambil keputusan", "Clarity of conclusions for decision-makers"),
        _("Ketepatan waktu laporan", "Report timeliness"),
      ],
      tantangan: [
        { judul: _("Model yang rumit dan rawan salah", "Complex, error-prone models"), isi: _("Pisahkan asumsi, perhitungan, dan output. Tambahkan cek otomatis seperti neraca yang harus seimbang.", "Separate inputs, calculations, and outputs. Add automatic checks like a balancing balance sheet.") },
        { judul: _("Tekanan memberi kesimpulan tertentu", "Pressure for a certain conclusion"), isi: _("Tetap berpegang pada data dan tunjukkan skenario.", "Stick to the data and show scenarios.") },
        { judul: _("Batas regulasi", "Regulatory limits"), isi: _("Memberi rekomendasi investasi kepada publik diatur OJK. Pahami batas peranmu.", "Giving investment advice to the public is regulated by OJK. Know your role's limits.") },
      ],
      jenjang: _("Analis keuangan bisa naik menjadi senior analyst, manajer FP&A, atau pindah ke investment banking, riset ekuitas, dan modal ventura.", "Financial analysts can become senior analysts, FP&A managers, or move into investment banking, equity research, and venture capital."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan contoh model atau catatan riset", "Apply with a sample model or research note"),
        _("Tes modelling 2 sampai 4 jam atau kasus dibawa pulang", "A 2 to 4-hour modelling test or take-home case"),
        _("Interview teknis tentang laporan keuangan dan valuasi", "Technical interview on statements and valuation"),
        _("Interview dengan atasan dan tim", "Interviews with the manager and team"),
      ],
      portofolio: [
        _("Model tiga laporan keuangan untuk satu perusahaan tercatat", "A three-statement model of a listed company"),
        _("Catatan riset 2 sampai 3 halaman", "A 2 to 3-page research note"),
        _("Sertifikasi seperti CFA atau pelatihan modelling bila ada", "Certifications like CFA or modelling courses if any"),
      ],
      tes: _("Tes umum: membangun proyeksi dari data historis dalam waktu terbatas, menghitung valuasi sederhana, dan menulis rekomendasi singkat. Model yang rapi dan bebas kesalahan rumus lebih penting daripada kerumitan.", "Common test: build projections from historicals under time pressure, run a simple valuation, and write a short recommendation. A tidy, error-free model beats complexity."),
      pertanyaan: [
        { q: _("Bagaimana tiga laporan keuangan saling terhubung?", "How do the three statements connect?"), jawab: _("Laba bersih masuk ke laba ditahan dan arus kas; perubahan neraca memengaruhi arus kas; saldo kas akhir masuk ke neraca.", "Net income flows to retained earnings and cash flow; balance sheet changes affect cash flow; ending cash goes to the balance sheet.") },
        { q: _("Laba naik tetapi arus kas operasional turun, apa artinya?", "Profit up but operating cash flow down, what does it mean?"), jawab: _("Sebut kemungkinan piutang atau persediaan naik, dan perlunya melihat kualitas laba.", "Mention rising receivables or inventory and the need to examine earnings quality.") },
      ],
      kesalahan: [
        _("Model dengan angka yang diketik langsung di rumus", "Hardcoded numbers in formulas"),
        _("Tidak bisa menjelaskan asumsi sendiri", "Can't explain your own assumptions"),
        _("Kesimpulan tanpa risiko", "Conclusions without risks"),
      ],
    },
  },
};
