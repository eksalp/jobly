import { t as _ } from "../../i18n.js";

/** Cara lolos seleksi dan gambaran kerja: kategori Pemasaran Digital. */
export default {
  "admin-media-sosial": {
    kerja: {
      hari: [
        { jam: "08.30", isi: _("Cek notifikasi akun klien: komentar, DM, dan mention semalam. Balas yang perlu dijawab, laporkan yang sensitif.", "Check the client's notifications: overnight comments, DMs, and mentions. Reply where needed; escalate sensitive ones.") },
        { jam: "09.30", isi: _("Jadwalkan konten hari ini di Meta Business Suite, cek caption, tag lokasi, dan musik.", "Schedule today's content in Meta Business Suite, checking captions, location tags, and music.") },
        { jam: "10.30", isi: _("Produksi konten minggu depan: ambil atau edit foto dan video, buat desain di Canva, tulis caption.", "Produce next week's content: shoot or edit photos and video, design in Canva, write captions.") },
        { jam: "14.00", isi: _("Pantau tren dan akun kompetitor, catat ide yang relevan untuk brand.", "Watch trends and competitor accounts, noting ideas that fit the brand.") },
        { jam: "16.00", isi: _("Kirim konten minggu depan untuk disetujui klien dan catat performa unggahan kemarin.", "Send next week's content for approval and log yesterday's post performance.") },
      ],
      dinilai: [
        _("Jangkauan dan interaksi (simpan, bagikan, komentar)", "Reach and engagement (saves, shares, comments)"),
        _("Konsistensi jadwal unggah", "Posting consistency"),
        _("Kecepatan dan kualitas membalas komentar dan DM", "Speed and quality of replies to comments and DMs"),
        _("Dampak ke penjualan atau prospek, jika bisa diukur", "Impact on sales or leads, where measurable"),
      ],
      tantangan: [
        { judul: _("Klien terlambat memberi persetujuan", "Slow client approvals"), isi: _("Kirim konten seminggu di depan dengan tenggat persetujuan, dan sepakati bahwa konten tanpa jawaban sampai batas waktu tertentu boleh dijadwalkan.", "Send content a week ahead with an approval deadline, and agree that unanswered content may be scheduled after a cutoff.") },
        { judul: _("Komentar negatif atau krisis", "Negative comments or crises"), isi: _("Buat panduan respons bersama klien: apa yang boleh dijawab admin dan kapan harus dilaporkan.", "Agree a response guide: what admins may answer and when to escalate.") },
        { judul: _("Algoritma yang berubah", "Changing algorithms"), isi: _("Fokus pada data akun sendiri dan uji format baru secara berkala, bukan mengejar semua tren.", "Focus on the account's own data and test new formats regularly rather than chasing every trend.") },
      ],
      jenjang: _("Admin media sosial bisa naik menjadi social media strategist, content lead, atau digital marketing manager. Banyak juga yang memegang beberapa brand sekaligus sebagai freelancer.", "Social media admins can become social strategists, content leads, or digital marketing managers. Many handle several brands as freelancers."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan portofolio konten dan akun yang pernah dikelola", "Apply with a content portfolio and accounts managed"),
        _("Tes membuat 3 sampai 5 konten untuk brand perusahaan", "A test creating 3 to 5 posts for the brand"),
        _("Interview tentang strategi dan cara membaca data", "Interview on strategy and reading data"),
        _("Masa percobaan 1 bulan", "A 1-month trial"),
      ],
      portofolio: [
        _("Akun yang pernah kamu kelola, dengan angka sebelum dan sesudah", "Accounts you've managed, with before-and-after numbers"),
        _("Contoh kalender konten satu bulan", "A sample month's content calendar"),
        _("3 sampai 5 konten terbaik (Reels, carousel, Story) beserta performanya", "3 to 5 best posts (Reels, carousels, Stories) with performance"),
        _("Contoh laporan bulanan", "A sample monthly report"),
      ],
      tes: _("Tes umumnya meminta ide konten untuk satu minggu dan 2 sampai 3 contoh jadi. Penilai melihat apakah kamu memahami target audiens brand, kualitas visual dan caption, serta alasan di balik setiap konten.", "Tests usually ask for a week of content ideas and 2 to 3 finished posts. Graders check your grasp of the brand's audience, visual and caption quality, and reasoning behind each post."),
      pertanyaan: [
        { q: _("Bagaimana kamu menentukan konten yang berhasil?", "How do you judge whether content worked?"), jawab: _("Sebut metrik yang sesuai tujuan: simpan dan bagikan untuk nilai, klik untuk penjualan, dan bandingkan dengan rata-rata akun.", "Name goal-fit metrics: saves and shares for value, clicks for sales, compared with account averages.") },
        { q: _("Apa yang kamu lakukan jika ada komentar negatif yang viral?", "What do you do if a negative comment goes viral?"), jawab: _("Jelaskan: jangan dihapus, laporkan ke klien segera, respons dengan tenang, dan arahkan ke kanal penyelesaian.", "Explain: don't delete, alert the client immediately, respond calmly, and direct to a resolution channel.") },
      ],
      kesalahan: [
        _("Portofolio tanpa angka performa", "Portfolios without performance numbers"),
        _("Akun media sosial sendiri yang tidak terurus", "Your own neglected social accounts"),
        _("Memakai musik atau foto tanpa izin di konten contoh", "Using unlicensed music or photos in samples"),
      ],
    },
  },

  "ads-specialist": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Cek performa iklan kemarin: biaya, CPA, ROAS, dan frekuensi. Tandai iklan yang memburuk.", "Check yesterday's ad performance: spend, CPA, ROAS, and frequency. Flag anything worsening.") },
        { jam: "10.00", isi: _("Optimasi: matikan iklan yang rugi, naikkan anggaran yang berhasil secara bertahap.", "Optimise: pause losing ads, scale winners gradually.") },
        { jam: "11.00", isi: _("Siapkan kreatif uji baru bersama desainer dan copywriter.", "Prepare new test creatives with designers and copywriters.") },
        { jam: "14.00", isi: _("Cek pelacakan konversi (pixel, event, UTM) agar data tetap akurat.", "Check conversion tracking (pixel, events, UTMs) to keep data accurate.") },
        { jam: "16.00", isi: _("Laporan singkat ke klien: hasil, apa yang diubah, dan rencana besok.", "Short client update: results, changes made, and tomorrow's plan.") },
      ],
      dinilai: [
        _("Biaya per hasil (CPA) di bawah target", "Cost per result (CPA) under target"),
        _("ROAS yang menguntungkan setelah dihitung margin", "ROAS that's profitable after margin"),
        _("Pertumbuhan penjualan dari iklan", "Sales growth from ads"),
      ],
      tantangan: [
        { judul: _("Data pelacakan yang tidak akurat", "Inaccurate tracking"), isi: _("Cocokkan data iklan dengan penjualan nyata di toko atau website secara berkala.", "Regularly reconcile ad data with actual store or website sales.") },
        { judul: _("Klien panik setelah 2 hari", "Clients panicking after 2 days"), isi: _("Sepakati masa uji (misalnya 7 hari) dan target sejak awal.", "Agree a test period (e.g. 7 days) and targets upfront.") },
        { judul: _("Iklan ditolak platform", "Ads rejected by the platform"), isi: _("Pahami kebijakan iklan, terutama untuk kesehatan, keuangan, dan klaim sebelum dan sesudah.", "Learn ad policies, especially for health, finance, and before-and-after claims.") },
      ],
      jenjang: _("Ads specialist bisa menjadi performance marketing manager, growth lead, atau membuka agensi iklan sendiri.", "Ads specialists can become performance marketing managers, growth leads, or run their own agency."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan studi kasus kampanye", "Apply with campaign case studies"),
        _("Tes: menganalisis data kampanye dan memberi rekomendasi", "Test: analyse campaign data and recommend actions"),
        _("Interview teknis tentang struktur kampanye dan metrik", "Technical interview on campaign structure and metrics"),
        _("Akses ke akun iklan klien untuk masa percobaan", "Access to the client's ad account for a trial"),
      ],
      portofolio: [
        _("Studi kasus: anggaran, target, hasil, dan apa yang kamu ubah", "Case studies: budget, target, results, and your changes"),
        _("Tangkapan layar dashboard iklan (data sensitif disamarkan)", "Ad dashboard screenshots (sensitive data hidden)"),
        _("Sertifikasi Meta Blueprint atau Google Ads", "Meta Blueprint or Google Ads certifications"),
      ],
      tes: _("Tes paling umum adalah tabel hasil beberapa iklan dan pertanyaan \"apa yang akan kamu lakukan?\". Hitung CPA dan ROAS, bandingkan dengan margin, dan beri keputusan yang jelas.", "The most common test is a table of ad results and \"what would you do?\". Calculate CPA and ROAS, compare to margin, and give clear decisions."),
      pertanyaan: [
        { q: _("ROAS 3 itu bagus atau tidak?", "Is a ROAS of 3 good?"), jawab: _("Tergantung margin. Jelaskan dengan contoh: margin 25% butuh ROAS di atas 4 untuk untung.", "It depends on margin. Explain with an example: a 25% margin needs ROAS above 4 to profit.") },
        { q: _("Bagaimana kamu menguji kreatif?", "How do you test creatives?"), jawab: _("Ubah satu variabel, beri waktu dan anggaran cukup, lalu putuskan berdasarkan biaya per hasil.", "Change one variable, allow enough time and budget, then decide on cost per result.") },
      ],
      kesalahan: [
        _("Hanya melaporkan jangkauan dan klik", "Reporting only reach and clicks"),
        _("Tidak tahu cara memasang pelacakan konversi", "Not knowing how to set up conversion tracking"),
        _("Menjanjikan hasil pasti", "Promising guaranteed results"),
      ],
    },
  },

  "seo-specialist": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Cek Google Search Console: halaman yang turun, error indeks, dan kata kunci baru.", "Check Search Console: dropping pages, indexing errors, and new keywords.") },
        { jam: "10.00", isi: _("Riset kata kunci dan buat brief artikel untuk penulis.", "Keyword research and article briefs for writers.") },
        { jam: "13.00", isi: _("Perbaikan on-page: judul, meta description, tautan internal, dan struktur heading.", "On-page fixes: titles, meta descriptions, internal links, and heading structure.") },
        { jam: "15.00", isi: _("Audit teknis kecil: kecepatan halaman, tampilan HP, dan halaman rusak.", "Small technical audits: page speed, mobile view, and broken pages.") },
        { jam: "16.30", isi: _("Catat perubahan yang dilakukan untuk laporan bulanan.", "Log changes for the monthly report.") },
      ],
      dinilai: [
        _("Pertumbuhan trafik organik", "Organic traffic growth"),
        _("Peringkat kata kunci target", "Target keyword rankings"),
        _("Konversi dari trafik organik", "Conversions from organic traffic"),
      ],
      tantangan: [
        { judul: _("Hasil yang lambat", "Slow results"), isi: _("Jelaskan sejak awal bahwa SEO butuh 3 sampai 6 bulan dan tunjukkan kemajuan kecil setiap bulan.", "Explain upfront that SEO takes 3 to 6 months and show small monthly wins.") },
        { judul: _("Pembaruan algoritma Google", "Google algorithm updates"), isi: _("Fokus pada konten yang benar-benar membantu pembaca dan hindari jalan pintas.", "Focus on genuinely helpful content and avoid shortcuts.") },
        { judul: _("Akses website terbatas", "Limited site access"), isi: _("Minta akses yang cukup atau bekerja sama dengan developer klien.", "Get adequate access or work with the client's developer.") },
      ],
      jenjang: _("SEO specialist bisa menjadi SEO lead, content strategist, atau konsultan SEO untuk beberapa klien.", "SEO specialists can become SEO leads, content strategists, or consultants for several clients."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan studi kasus kenaikan trafik", "Apply with traffic growth case studies"),
        _("Tes audit singkat website perusahaan", "A short audit test of the company site"),
        _("Interview tentang strategi dan prioritas", "Interview on strategy and priorities"),
      ],
      portofolio: [
        _("Website sendiri dengan data Search Console", "Your own site with Search Console data"),
        _("Contoh audit SEO 5 sampai 10 halaman", "A 5 to 10-page sample SEO audit"),
        _("Studi kasus kenaikan peringkat atau trafik", "A ranking or traffic case study"),
      ],
      tes: _("Biasanya kamu diminta mengaudit website perusahaan dan menyebut 5 perbaikan prioritas. Penilai menghargai prioritas yang berdasarkan dampak, bukan daftar panjang masalah kecil.", "You're usually asked to audit the company site and name 5 priority fixes. Graders value impact-based priorities over long lists of minor issues."),
      pertanyaan: [
        { q: _("Apa yang kamu cek pertama di website baru?", "What do you check first on a new site?"), jawab: _("Indeks di Search Console, kecepatan, tampilan HP, dan apakah halaman penting bisa ditemukan.", "Indexing in Search Console, speed, mobile view, and whether key pages are findable.") },
        { q: _("Bagaimana kamu memilih kata kunci?", "How do you choose keywords?"), jawab: _("Pertimbangkan volume, persaingan, dan niat pencari yang sesuai bisnis.", "Weigh volume, competition, and intent that fits the business.") },
      ],
      kesalahan: [
        _("Menjanjikan peringkat 1", "Promising #1 rankings"),
        _("Tidak bisa membaca data Search Console", "Can't read Search Console data"),
        _("Menyarankan membeli backlink massal", "Recommending bulk backlink buying"),
      ],
    },
  },

  "email-marketing": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Cek hasil kampanye kemarin: open rate, klik, penjualan, dan berhenti berlangganan.", "Check yesterday's campaign: opens, clicks, sales, and unsubscribes.") },
        { jam: "10.00", isi: _("Tulis dan desain newsletter minggu ini, siapkan 2 versi subject line untuk diuji.", "Write and design this week's newsletter with 2 subject lines to test.") },
        { jam: "13.00", isi: _("Perbarui segmen pelanggan dan alur otomatis (selamat datang, keranjang, pembelian ulang).", "Update segments and automated flows (welcome, cart, repeat purchase).") },
        { jam: "15.00", isi: _("Kirim email uji ke beberapa perangkat, cek tampilan di HP dan semua tautan.", "Send test emails to several devices, checking mobile view and every link.") },
        { jam: "16.30", isi: _("Jadwalkan kampanye dan catat hasil uji A/B sebelumnya.", "Schedule campaigns and log previous A/B results.") },
      ],
      dinilai: [
        _("Pendapatan dari email", "Revenue from email"),
        _("Klik dan konversi, bukan hanya open rate", "Clicks and conversions, not just opens"),
        _("Kesehatan daftar: bounce, spam, dan berhenti berlangganan rendah", "List health: low bounces, spam reports, and unsubscribes"),
      ],
      tantangan: [
        { judul: _("Email masuk spam", "Emails landing in spam"), isi: _("Jaga kualitas daftar, hindari daftar beli, dan pastikan domain pengirim sudah diautentikasi.", "Keep the list clean, avoid bought lists, and authenticate the sending domain.") },
        { judul: _("Kehabisan ide konten", "Running out of ideas"), isi: _("Gunakan kalender: edukasi, cerita brand, produk, testimoni, dan promo secara bergantian.", "Use a rotation: education, brand stories, products, testimonials, and promos.") },
        { judul: _("Terlalu banyak promo", "Too many promos"), isi: _("Seimbangkan email yang memberi nilai dengan email penjualan agar pelanggan tidak berhenti berlangganan.", "Balance value emails with sales emails so people stay subscribed.") },
      ],
      jenjang: _("Email marketer bisa menjadi CRM atau retention manager, lifecycle marketer, atau konsultan untuk toko online.", "Email marketers can become CRM or retention managers, lifecycle marketers, or consultants for online stores."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan contoh email dan hasilnya", "Apply with sample emails and results"),
        _("Tes menulis rangkaian email atau mengkritik email perusahaan", "Test: write a sequence or critique the company's emails"),
        _("Interview tentang segmentasi dan metrik", "Interview on segmentation and metrics"),
      ],
      portofolio: [
        _("Contoh alur otomatis lengkap dengan alasannya", "A full automated flow with reasoning"),
        _("Contoh newsletter dan hasilnya", "Sample newsletters and results"),
        _("Pengalaman dengan Mailchimp, Klaviyo, atau Brevo", "Experience with Mailchimp, Klaviyo, or Brevo"),
      ],
      tes: _("Tes yang umum: menulis 3 email selamat datang atau memperbaiki email perusahaan yang performanya rendah. Penilai melihat subject line, kejelasan ajakan, dan pemahaman tentang pelanggan.", "Common tests: write 3 welcome emails or fix an underperforming company email. Graders look at subject lines, CTA clarity, and customer understanding."),
      pertanyaan: [
        { q: _("Open rate tinggi tetapi klik rendah, kenapa?", "High opens but low clicks, why?"), jawab: _("Isi email tidak sesuai harapan subject line, atau ajakan tidak jelas.", "The content didn't match the subject line's promise, or the CTA was unclear.") },
        { q: _("Bagaimana kamu membangun daftar email?", "How do you grow a list?"), jawab: _("Dengan formulir pendaftaran yang memberi nilai (diskon, panduan) dan izin yang jelas.", "With sign-up forms offering value (discounts, guides) and clear consent.") },
      ],
      kesalahan: [
        _("Hanya fokus pada desain", "Focusing only on design"),
        _("Tidak paham dasar deliverability", "Not knowing deliverability basics"),
        _("Menyarankan membeli daftar email", "Suggesting buying email lists"),
      ],
    },
  },

  "riset-pasar": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Rapat dengan klien untuk memperjelas keputusan yang akan diambil dari riset.", "Meet the client to clarify which decision the research supports.") },
        { jam: "10.30", isi: _("Susun desain riset: metode, sampel, dan daftar pertanyaan.", "Design the research: methods, sample, and questions.") },
        { jam: "13.00", isi: _("Kumpulkan data: sebar survei, wawancara calon pelanggan, atau catat harga kompetitor.", "Collect data: run surveys, interview prospects, or log competitor prices.") },
        { jam: "15.00", isi: _("Olah data di spreadsheet dan cari pola utama.", "Analyse data in spreadsheets and find key patterns.") },
        { jam: "16.30", isi: _("Tulis temuan sementara dan rekomendasi.", "Write interim findings and recommendations.") },
      ],
      dinilai: [
        _("Rekomendasi yang membantu keputusan klien", "Recommendations that inform the client's decision"),
        _("Metode yang tepat dan jujur soal keterbatasan", "Sound methods and honest limitations"),
        _("Laporan ringkas dan mudah dipahami", "Concise, readable reports"),
      ],
      tantangan: [
        { judul: _("Responden sulit didapat", "Hard-to-reach respondents"), isi: _("Gunakan beberapa saluran dan beri insentif kecil, lalu catat bias sampelnya.", "Use several channels and small incentives, and note sample bias.") },
        { judul: _("Klien ingin hasil tertentu", "Clients wanting a certain result"), isi: _("Sampaikan temuan apa adanya dengan data pendukung.", "Report findings as they are, with supporting data.") },
        { judul: _("Data kompetitor terbatas", "Limited competitor data"), isi: _("Gunakan sumber publik dan catat tanggal pengambilan.", "Use public sources and log collection dates.") },
      ],
      jenjang: _("Peneliti pasar bisa menjadi consumer insights manager, product researcher, atau konsultan strategi.", "Market researchers can become consumer insights managers, product researchers, or strategy consultants."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan contoh laporan riset", "Apply with a sample research report"),
        _("Studi kasus: merancang riset untuk pertanyaan bisnis", "Case study: design research for a business question"),
        _("Presentasi temuan", "Present findings"),
      ],
      portofolio: [
        _("Laporan riset singkat untuk industri lokal", "A short report on a local industry"),
        _("Contoh kuesioner yang netral", "A sample neutral questionnaire"),
        _("Ringkasan wawancara pelanggan", "A customer interview summary"),
      ],
      tes: _("Biasanya kamu diberi pertanyaan bisnis (\"apakah kami perlu masuk kota X?\") dan diminta merancang riset atau menganalisis data contoh. Penilai melihat logika, metode, dan kejelasan rekomendasi.", "You're usually given a business question (\"should we enter city X?\") and asked to design research or analyse sample data. They judge logic, method, and clear recommendations."),
      pertanyaan: [
        { q: _("Kapan memakai survei dan kapan wawancara?", "When do you use surveys versus interviews?"), jawab: _("Wawancara untuk menggali alasan saat belum tahu kemungkinan jawaban, survei untuk mengukur seberapa umum.", "Interviews to explore reasons when answers are unknown; surveys to measure how common they are.") },
        { q: _("Bagaimana menghindari bias?", "How do you avoid bias?"), jawab: _("Pertanyaan netral, sampel yang beragam, dan menuliskan keterbatasan.", "Neutral questions, a varied sample, and stating limitations.") },
      ],
      kesalahan: [
        _("Laporan panjang tanpa rekomendasi", "Long reports without recommendations"),
        _("Pertanyaan survei yang mengarahkan", "Leading survey questions"),
        _("Mengambil data pribadi kompetitor secara tidak etis", "Unethically taking competitors' personal data"),
      ],
    },
  },
};
