import { t as _ } from "../../i18n.js";

/** Cara lolos seleksi dan gambaran kerja: kategori Pemrograman & Teknologi. */
export default {
  "web-developer": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Balas pesan klien dan cek tugas di Trello atau Notion: halaman mana yang dikerjakan hari ini.", "Reply to clients and check tasks in Trello or Notion: which pages are on today.") },
        { jam: "09.30", isi: _("Bangun halaman di staging: tata letak, isi dari klien, formulir, dan tombol WhatsApp.", "Build pages on staging: layout, client content, forms, and WhatsApp buttons.") },
        { jam: "13.00", isi: _("Cek tampilan di HP dan desktop, ukur kecepatan dengan PageSpeed, kompres gambar.", "Check mobile and desktop views, test speed with PageSpeed, compress images.") },
        { jam: "15.00", isi: _("Kirim tautan staging ke klien beserta daftar yang perlu ditinjau.", "Send the staging link with a review checklist.") },
        { jam: "16.30", isi: _("Pemeliharaan klien lama: pembaruan plugin, backup, dan cek keamanan.", "Maintenance for past clients: plugin updates, backups, and security checks.") },
      ],
      dinilai: [
        _("Website selesai tepat waktu sesuai lingkup", "Sites delivered on time and in scope"),
        _("Cepat, rapi di HP, dan mudah dikelola klien", "Fast, mobile-friendly, and easy for the client to manage"),
        _("Sedikit masalah setelah peluncuran", "Few post-launch issues"),
      ],
      tantangan: [
        { judul: _("Konten dari klien terlambat", "Late client content"), isi: _("Masukkan jadwal pengiriman konten di kesepakatan dan gunakan teks sementara agar pekerjaan tetap berjalan.", "Put content deadlines in the agreement and use placeholders so work continues.") },
        { judul: _("Revisi tanpa akhir", "Endless revisions"), isi: _("Tetapkan jumlah putaran revisi dan minta masukan dikumpulkan dalam satu daftar.", "Set revision rounds and ask for feedback in one consolidated list.") },
        { judul: _("Website diretas", "Hacked sites"), isi: _("Tawarkan paket pemeliharaan dengan backup dan pembaruan rutin sejak awal.", "Offer maintenance with backups and regular updates from the start.") },
      ],
      jenjang: _("Pembuat website bisa naik ke front-end developer dengan React, spesialis Shopify atau WordPress yang tarifnya lebih tinggi, atau membuka agensi web kecil.", "Website builders can move into front-end development with React, higher-paid Shopify or WordPress specialisation, or start a small web agency."),
    },
    lolos: {
      alur: [
        _("Proposal di marketplace atau penawaran langsung ke usaha lokal", "Proposals on marketplaces or direct pitches to local businesses"),
        _("Panggilan video untuk memahami kebutuhan", "A video call to understand needs"),
        _("Penawaran dengan lingkup, jadwal, dan harga", "A quote with scope, timeline, and price"),
        _("Uang muka, lalu pengerjaan bertahap", "Deposit, then staged work"),
      ],
      portofolio: [
        _("3 website yang bisa dibuka langsung, tampil baik di HP", "3 live sites that look good on mobile"),
        _("Skor PageSpeed dan penjelasan singkat apa yang kamu optimalkan", "PageSpeed scores and a note on what you optimised"),
        _("Testimoni klien", "Client testimonials"),
      ],
      tes: _("Klien jarang memberi tes. Mereka menilai portofolio dan cara kamu menjelaskan solusi. Untuk posisi di agensi, tes biasanya membangun satu halaman dari desain Figma dalam 1 sampai 3 hari.", "Clients rarely test you; they judge your portfolio and how you explain solutions. Agencies usually test by building a page from a Figma design in 1 to 3 days."),
      pertanyaan: [
        { q: _("Berapa lama website seperti ini selesai?", "How long will a site like this take?"), jawab: _("Beri jadwal per tahap dan sebut ketergantungan pada konten dari klien.", "Give staged timing and note dependence on client content.") },
        { q: _("Apakah saya bisa mengubah isi sendiri?", "Can I edit content myself?"), jawab: _("Jelaskan cara mengubahnya dan tawarkan pelatihan singkat.", "Explain how and offer brief training.") },
      ],
      kesalahan: [
        _("Portofolio yang tautannya mati atau lambat", "Portfolio links that are dead or slow"),
        _("Tidak menyebut apa yang tidak termasuk dalam harga", "Not stating what's excluded"),
        _("Mendaftarkan domain klien atas nama sendiri", "Registering the client's domain in your own name"),
      ],
    },
  },

  "app-developer": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Stand-up singkat dengan tim (sering asinkron lewat Slack): kemarin, hari ini, hambatan.", "Short stand-up (often async on Slack): yesterday, today, blockers.") },
        { jam: "09.30", isi: _("Kerjakan tiket fitur dalam blok fokus 2 sampai 3 jam.", "Work feature tickets in 2 to 3-hour focus blocks.") },
        { jam: "13.00", isi: _("Review pull request rekan, beri komentar yang spesifik dan sopan.", "Review teammates' pull requests with specific, polite comments.") },
        { jam: "14.30", isi: _("Tulis tes, perbaiki masukan review, dan perbarui dokumentasi.", "Write tests, address review feedback, and update docs.") },
        { jam: "16.30", isi: _("Tulis status singkat di tiket dan serahkan pertanyaan untuk tim di zona waktu lain.", "Post a brief status on tickets and leave questions for teammates in other time zones.") },
      ],
      dinilai: [
        _("Fitur selesai sesuai estimasi dan minim bug", "Features shipped on estimate with few bugs"),
        _("Kualitas kode dan review", "Code and review quality"),
        _("Komunikasi tertulis yang jelas", "Clear written communication"),
      ],
      tantangan: [
        { judul: _("Komunikasi asinkron", "Async communication"), isi: _("Tulis pertanyaan lengkap dengan konteks, sehingga rekan bisa menjawab tanpa bertanya balik.", "Write complete questions with context so teammates can answer without follow-ups.") },
        { judul: _("Estimasi yang meleset", "Missed estimates"), isi: _("Pecah tugas menjadi bagian kecil dan beri tahu lebih awal jika ada hambatan.", "Break work small and flag blockers early.") },
        { judul: _("Kelelahan karena kerja tanpa batas", "Burnout from no boundaries"), isi: _("Tetapkan jam kerja dan matikan notifikasi di luar jam itu.", "Set working hours and mute notifications outside them.") },
      ],
      jenjang: _("Junior developer bisa naik ke mid dan senior, lalu memilih jalur teknis (staff engineer, arsitek) atau jalur manajemen (engineering manager).", "Junior developers progress to mid and senior, then choose a technical track (staff engineer, architect) or management (engineering manager)."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan CV dan GitHub", "Apply with a CV and GitHub"),
        _("Tes coding online atau tugas dibawa pulang", "An online coding test or take-home task"),
        _("Interview teknis: membahas kode, live coding, atau system design", "Technical interviews: code discussion, live coding, or system design"),
        _("Interview budaya kerja dan komunikasi", "Culture and communication interview"),
        _("Penawaran kerja dan pengecekan referensi", "Offer and reference checks"),
      ],
      portofolio: [
        _("2 sampai 3 proyek nyata dengan README yang jelas", "2 to 3 real projects with clear READMEs"),
        _("Aplikasi yang bisa dicoba (link demo atau Play Store)", "Apps people can try (demo link or Play Store)"),
        _("Riwayat commit yang rapi dan konsisten", "A tidy, consistent commit history"),
        _("Kontribusi open source bila ada", "Open-source contributions if any"),
      ],
      tes: _("Tugas dibawa pulang biasanya membangun fitur kecil, misalnya daftar dan detail dari API, dalam 3 sampai 7 hari. Penilai melihat struktur kode, penanganan error, tes, dan README yang menjelaskan keputusanmu.", "Take-home tasks usually involve a small feature, like a list and detail view from an API, in 3 to 7 days. Reviewers check structure, error handling, tests, and a README explaining your choices."),
      pertanyaan: [
        { q: _("Ceritakan bug tersulit yang pernah kamu perbaiki.", "Tell me about the hardest bug you fixed."), jawab: _("Jelaskan gejala, cara mencari penyebab, solusi, dan pelajaran yang didapat.", "Explain the symptom, how you found the cause, the fix, and the lesson.") },
        { q: _("Bagaimana kamu bekerja dengan tim di zona waktu berbeda?", "How do you work across time zones?"), jawab: _("Sebut komunikasi tertulis, dokumentasi, dan jam tumpang tindih.", "Mention written communication, documentation, and overlap hours.") },
      ],
      kesalahan: [
        _("GitHub kosong atau hanya berisi tutorial", "An empty GitHub or only tutorials"),
        _("Tugas dibawa pulang tanpa README dan tes", "Take-homes without a README or tests"),
        _("Menjalankan kode dari perekrut yang tidak jelas di laptop utama", "Running code from dubious recruiters on your main laptop"),
      ],
    },
  },

  "bot-otomasi": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Cek log semua otomasi klien: ada yang gagal semalam?", "Check logs for all client automations: any overnight failures?") },
        { jam: "10.00", isi: _("Wawancara klien untuk memetakan proses manual yang ingin diotomasi.", "Interview a client to map a manual process to automate.") },
        { jam: "11.00", isi: _("Bangun alur di Zapier, Make, n8n, atau Apps Script, lalu uji dengan data contoh.", "Build the flow in Zapier, Make, n8n, or Apps Script, and test with sample data.") },
        { jam: "14.00", isi: _("Tangani kasus khusus: data kosong, duplikat, dan error dari API.", "Handle edge cases: blank data, duplicates, and API errors.") },
        { jam: "16.00", isi: _("Tulis dokumentasi serah terima dan rekam video penjelasan singkat.", "Write handover docs and record a short walkthrough video.") },
      ],
      dinilai: [
        _("Jam kerja manual yang dihemat klien", "Manual hours saved for the client"),
        _("Otomasi berjalan stabil tanpa sering gagal", "Automations run reliably"),
        _("Klien bisa memahami dan merawatnya", "The client can understand and maintain it"),
      ],
      tantangan: [
        { judul: _("Proses klien belum jelas", "Unclear client processes"), isi: _("Petakan dulu prosesnya di diagram sederhana dan minta klien menyetujuinya.", "Map the process in a simple diagram and get sign-off first.") },
        { judul: _("Batas dan biaya alat", "Tool limits and costs"), isi: _("Hitung jumlah tugas per bulan dan pilih alat yang biayanya masuk akal.", "Estimate monthly task volume and choose a cost-sensible tool.") },
        { judul: _("Perubahan di aplikasi pihak ketiga", "Third-party app changes"), isi: _("Pasang notifikasi error dan tawarkan pemeliharaan bulanan.", "Set error alerts and offer monthly maintenance.") },
      ],
      jenjang: _("Spesialis otomasi bisa menjadi konsultan operasional, integration engineer, atau developer backend.", "Automation specialists can become operations consultants, integration engineers, or backend developers."),
    },
    lolos: {
      alur: [
        _("Tawarkan jasa dengan contoh otomasi dan perkiraan waktu yang dihemat", "Pitch with sample automations and estimated time saved"),
        _("Panggilan untuk memetakan proses klien", "A call to map the client's process"),
        _("Penawaran per proyek ditambah pemeliharaan", "Per-project quote plus maintenance"),
      ],
      portofolio: [
        _("Video demo 1 sampai 2 menit untuk 3 otomasi", "1 to 2-minute demos of 3 automations"),
        _("Studi kasus dengan angka waktu yang dihemat", "Case studies with hours saved"),
        _("Template alur yang bisa ditunjukkan", "Shareable flow templates"),
      ],
      tes: _("Klien jarang memberi tes formal, tetapi sering meminta solusi untuk satu proses sebagai percobaan berbayar. Fokus pada keandalan dan dokumentasi.", "Clients rarely test formally but often request one process as a paid trial. Focus on reliability and docs."),
      pertanyaan: [
        { q: _("Bagaimana jika otomasinya error saat kamu tidak ada?", "What if it fails while you're away?"), jawab: _("Jelaskan notifikasi error, log, dokumentasi, dan waktu responsmu.", "Explain error alerts, logs, documentation, and your response time.") },
        { q: _("Data kami aman tidak?", "Is our data safe?"), jawab: _("Sebut akses minimum, penyimpanan token yang aman, dan akun milik klien.", "Mention least-privilege access, secure token storage, and client-owned accounts.") },
      ],
      kesalahan: [
        _("Menjual alat, bukan hasil", "Selling tools, not outcomes"),
        _("Membangun di akun pribadi, bukan akun klien", "Building in your account instead of the client's"),
        _("Tidak menangani kasus khusus", "Ignoring edge cases"),
      ],
    },
  },

  "bug-maintenance": {
    kerja: {
      hari: [
        { jam: "08.30", isi: _("Cek pemantauan uptime dan laporan keamanan semua situs klien.", "Check uptime monitoring and security reports for all client sites.") },
        { jam: "09.00", isi: _("Tangani tiket masuk: reproduksi masalah, cari penyebab, perbaiki di staging.", "Handle tickets: reproduce, find the cause, fix on staging.") },
        { jam: "13.00", isi: _("Pembaruan terjadwal: backup, perbarui plugin, uji halaman penting.", "Scheduled updates: backup, update plugins, test key pages.") },
        { jam: "15.00", isi: _("Tulis laporan singkat ke klien: masalah, penyebab, solusi, dan pencegahan.", "Write short client reports: issue, cause, fix, and prevention.") },
        { jam: "16.30", isi: _("Catat waktu kerja per klien untuk tagihan.", "Log time per client for billing.") },
      ],
      dinilai: [
        _("Kecepatan respons dan perbaikan", "Response and fix speed"),
        _("Masalah tidak terulang", "Problems don't recur"),
        _("Uptime dan keamanan situs", "Site uptime and security"),
      ],
      tantangan: [
        { judul: _("Kode orang lain yang berantakan", "Messy inherited code"), isi: _("Perbaiki seperlunya, catat temuan, dan sarankan perbaikan besar sebagai proyek terpisah.", "Fix what's needed, note findings, and propose big refactors separately.") },
        { judul: _("Darurat di luar jam kerja", "Emergencies after hours"), isi: _("Tetapkan waktu respons di paket dan biaya tambahan untuk darurat di luar jam.", "Set response times in packages and charge for after-hours emergencies.") },
        { judul: _("Akses yang tidak lengkap", "Incomplete access"), isi: _("Minta akses hosting, domain, dan admin sejak awal, dengan bukti kepemilikan.", "Request hosting, domain, and admin access upfront, with proof of ownership.") },
      ],
      jenjang: _("Spesialis maintenance bisa membuka layanan pemeliharaan berlangganan, menjadi spesialis keamanan web, atau DevOps.", "Maintenance specialists can run subscription care plans, become web security specialists, or move into DevOps."),
    },
    lolos: {
      alur: [
        _("Ambil tugas kecil di marketplace untuk membangun ulasan", "Take small marketplace tasks to build reviews"),
        _("Tawarkan audit gratis singkat untuk calon klien", "Offer a short free audit to prospects"),
        _("Lanjutkan dengan paket pemeliharaan bulanan", "Follow up with a monthly care plan"),
      ],
      portofolio: [
        _("Daftar masalah yang pernah diperbaiki beserta penyebabnya", "A list of issues fixed and their causes"),
        _("Contoh laporan pemeliharaan bulanan", "A sample monthly maintenance report"),
        _("Ulasan klien tentang kecepatan respons", "Client reviews about response speed"),
      ],
      tes: _("Sering berupa tugas nyata kecil yang dibayar, misalnya memperbaiki formulir yang tidak terkirim. Cara kamu berkomunikasi sama pentingnya dengan hasil perbaikan.", "Often a small paid real task, like fixing a broken form. How you communicate matters as much as the fix."),
      pertanyaan: [
        { q: _("Apa langkah pertamamu saat situs error?", "First step when a site errors?"), jawab: _("Backup, cek log error, lalu reproduksi masalah.", "Backup, check error logs, then reproduce.") },
        { q: _("Bagaimana mencegah situs diretas?", "How do you prevent hacks?"), jawab: _("Pembaruan rutin, password kuat, plugin terpercaya, firewall, dan backup di luar server.", "Regular updates, strong passwords, trusted plugins, a firewall, and off-server backups.") },
      ],
      kesalahan: [
        _("Mengubah situs tanpa backup", "Changing sites without backups"),
        _("Bekerja di situs utama tanpa staging", "Working on live sites without staging"),
        _("Membantu masuk ke situs tanpa izin pemilik", "Helping access sites without owner permission"),
      ],
    },
  },

  "ai-specialist": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Tinjau percakapan chatbot klien kemarin: jawaban salah, pertanyaan yang tidak terjawab, dan pengalihan ke manusia.", "Review yesterday's chatbot conversations: wrong answers, unanswered questions, and human handoffs.") },
        { jam: "10.00", isi: _("Perbaiki prompt atau dokumen sumber berdasarkan temuan, lalu uji ulang dengan set pertanyaan uji.", "Fix prompts or source documents based on findings, then rerun the test set.") },
        { jam: "13.00", isi: _("Bangun otomasi AI baru, misalnya merangkum email masuk atau membuat draf laporan.", "Build a new AI automation, like summarising inbound email or drafting reports.") },
        { jam: "15.00", isi: _("Pelatihan singkat untuk tim klien tentang cara memakai AI dengan aman.", "Short training for the client's team on safe AI use.") },
        { jam: "16.30", isi: _("Catat metrik: waktu yang dihemat, akurasi, dan biaya pemakaian AI.", "Log metrics: time saved, accuracy, and AI usage cost.") },
      ],
      dinilai: [
        _("Waktu atau biaya yang dihemat", "Time or cost saved"),
        _("Akurasi dan keamanan jawaban AI", "Accuracy and safety of AI output"),
        _("Tingkat pemakaian oleh tim klien", "Adoption by the client's team"),
      ],
      tantangan: [
        { judul: _("AI mengarang jawaban", "AI making things up"), isi: _("Hubungkan ke sumber resmi, batasi jawaban pada sumber itu, dan sediakan pengalihan ke manusia.", "Ground it in official sources, restrict answers to them, and provide human handoff.") },
        { judul: _("Data sensitif", "Sensitive data"), isi: _("Gunakan layanan versi bisnis dan aturan data yang jelas.", "Use business-tier services and clear data rules.") },
        { judul: _("Teknologi berubah cepat", "Fast-changing tech"), isi: _("Fokus pada masalah bisnis klien. Alat boleh berganti, pemahaman prosesnya tetap.", "Focus on the client's business problem. Tools change; process understanding lasts.") },
      ],
      jenjang: _("Spesialis AI bisa menjadi AI product manager, konsultan transformasi digital, atau engineer yang membangun aplikasi berbasis AI.", "AI specialists can become AI product managers, digital transformation consultants, or engineers building AI apps."),
    },
    lolos: {
      alur: [
        _("Tunjukkan studi kasus penerapan AI dengan hasil terukur", "Show AI case studies with measurable results"),
        _("Panggilan untuk menemukan proses yang paling cocok diotomasi", "A call to find the best process to automate"),
        _("Proyek percontohan kecil berbayar", "A small paid pilot"),
        _("Kontrak lanjutan atau pemeliharaan", "Follow-on or maintenance contract"),
      ],
      portofolio: [
        _("Demo chatbot atau otomasi yang bisa dicoba", "A chatbot or automation demo people can try"),
        _("Contoh prompt sistem beserta set uji dan hasilnya", "Sample system prompts with test sets and results"),
        _("Tulisan tentang batasan dan keamanan AI", "Writing on AI limits and safety"),
      ],
      tes: _("Untuk posisi di perusahaan, tes sering berupa membangun prototipe kecil dari dokumen perusahaan dan menjelaskan cara mengukur kualitasnya. Penilai mencari pemahaman tentang risiko, bukan hanya demo yang mengesankan.", "For company roles, tests often involve building a small prototype from company docs and explaining how you'd measure quality. Reviewers want risk awareness, not just a flashy demo."),
      pertanyaan: [
        { q: _("Bagaimana kamu tahu chatbot ini cukup baik?", "How do you know the chatbot is good enough?"), jawab: _("Jelaskan set pertanyaan uji, kriteria benar, dan pemantauan setelah diluncurkan.", "Explain a test question set, correctness criteria, and post-launch monitoring.") },
        { q: _("Apa risiko memakai AI untuk pelanggan?", "What are the risks of customer-facing AI?"), jawab: _("Jawaban salah, kebocoran data, dan nada yang tidak sesuai, beserta cara menguranginya.", "Wrong answers, data leaks, and off-brand tone, with mitigations.") },
      ],
      kesalahan: [
        _("Menjanjikan AI bisa menggantikan semua karyawan", "Promising AI will replace all staff"),
        _("Tidak membahas keamanan data", "Ignoring data security"),
        _("Demo tanpa ukuran keberhasilan", "Demos without success measures"),
      ],
    },
  },
};
