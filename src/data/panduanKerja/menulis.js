import { t as _ } from "../../i18n.js";

/** Cara lolos seleksi dan gambaran kerja: kategori Penulisan & Penerjemahan. */
export default {
  "content-writer": {
    kerja: {
      hari: [
        { jam: "08.30", isi: _("Baca brief artikel dari editor: kata kunci, target pembaca, panjang, dan tenggat.", "Read the editor's brief: keyword, audience, length, and deadline.") },
        { jam: "09.00", isi: _("Riset: cek 5 artikel teratas di Google untuk kata kunci itu, catat yang kurang dari mereka.", "Research: check the top 5 Google results for the keyword and note what they miss.") },
        { jam: "10.00", isi: _("Tulis kerangka, lalu draf dalam 2 sampai 3 blok fokus.", "Outline, then draft in 2 to 3 focus blocks.") },
        { jam: "14.00", isi: _("Sunting: baca ulang dengan suara, pangkas kalimat panjang, cek fakta dan sumber.", "Edit: read aloud, trim long sentences, check facts and sources.") },
        { jam: "16.00", isi: _("Kirim ke editor di Google Docs, tanggapi komentar dari artikel sebelumnya.", "Submit in Google Docs and address comments on the previous piece.") },
      ],
      dinilai: [
        _("Artikel sesuai brief dan tenggat", "On-brief, on-time articles"),
        _("Sedikit revisi dari editor", "Few editor revisions"),
        _("Kinerja artikel: trafik, waktu baca, peringkat", "Article performance: traffic, read time, rankings"),
      ],
      tantangan: [
        { judul: _("Topik yang belum dikuasai", "Unfamiliar topics"), isi: _("Gunakan sumber utama (situs resmi, jurnal, wawancara), bukan hanya artikel lain.", "Use primary sources (official sites, journals, interviews), not just other articles.") },
        { judul: _("Target jumlah artikel", "Volume targets"), isi: _("Buat template kerangka dan perpustakaan sumber per topik agar lebih cepat.", "Build outline templates and a source library per topic to speed up.") },
        { judul: _("AI menurunkan tarif tulisan biasa", "AI driving down generic rates"), isi: _("Tawarkan nilai yang sulit ditiru AI: riset mendalam, wawancara, pengalaman, dan suara khas.", "Offer what AI struggles with: deep research, interviews, experience, and a distinct voice.") },
      ],
      jenjang: _("Content writer bisa menjadi editor, content strategist, SEO content lead, atau spesialis di satu bidang (keuangan, kesehatan, teknologi) dengan tarif lebih tinggi.", "Content writers can become editors, content strategists, SEO content leads, or niche specialists (finance, health, tech) at higher rates."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan 3 contoh tulisan yang relevan", "Apply with 3 relevant writing samples"),
        _("Tes menulis artikel pendek sesuai brief (sebaiknya dibayar jika panjang)", "A short brief-based writing test (ideally paid if long)"),
        _("Interview dengan editor", "Interview with the editor"),
        _("Masa percobaan beberapa artikel", "A trial of several articles"),
      ],
      portofolio: [
        _("3 sampai 5 artikel terbit atau di blog sendiri, di niche yang dilamar", "3 to 5 published or self-hosted articles in the target niche"),
        _("Satu artikel SEO dengan kata kunci dan alasannya", "One SEO article with its keyword and rationale"),
        _("Bukti hasil bila ada: peringkat atau trafik", "Results if available: rankings or traffic"),
      ],
      tes: _("Tes biasanya berupa brief singkat untuk artikel 500 sampai 800 kata. Penilai melihat apakah kamu mengikuti brief, memakai sumber yang kredibel, dan menulis dengan jelas. Salah ketik dan informasi tanpa sumber sering membuat gagal.", "Tests usually give a short brief for 500 to 800 words. Reviewers check brief adherence, credible sources, and clarity. Typos and unsourced claims often cause a fail."),
      pertanyaan: [
        { q: _("Bagaimana kamu meriset topik baru?", "How do you research a new topic?"), jawab: _("Jelaskan urutan sumber: resmi, ahli, data, lalu artikel pendukung.", "Explain your source order: official, experts, data, then supporting articles.") },
        { q: _("Apakah kamu memakai AI?", "Do you use AI?"), jawab: _("Jawab jujur dan jelaskan batasannya, misalnya hanya untuk ide atau kerangka, dan selalu cek fakta.", "Be honest and explain limits, e.g. for ideas or outlines, always fact-checked.") },
      ],
      kesalahan: [
        _("Contoh tulisan di luar niche yang dilamar", "Samples outside the target niche"),
        _("Tidak membaca brief dengan teliti", "Not reading the brief carefully"),
        _("Mengirim teks AI tanpa suntingan", "Submitting unedited AI text"),
      ],
    },
  },

  copywriter: {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Baca brief kampanye dan data hasil iklan sebelumnya.", "Read the campaign brief and past ad results.") },
        { jam: "09.30", isi: _("Riset pembeli: ulasan produk, komentar, dan pertanyaan yang sering muncul.", "Buyer research: reviews, comments, and common questions.") },
        { jam: "11.00", isi: _("Tulis banyak variasi headline dan teks, lalu pilih yang terbaik untuk diuji.", "Write many headline and body variants, then pick the best to test.") },
        { jam: "14.00", isi: _("Kerja dengan desainer agar teks dan visual saling mendukung.", "Work with designers so copy and visuals align.") },
        { jam: "16.00", isi: _("Tinjau hasil uji A/B dan catat pelajaran untuk kampanye berikutnya.", "Review A/B results and note lessons for the next campaign.") },
      ],
      dinilai: [
        _("Konversi: klik, pendaftaran, penjualan", "Conversions: clicks, sign-ups, sales"),
        _("Hasil uji A/B", "A/B test results"),
        _("Kepatuhan pada aturan iklan dan suara brand", "Ad policy and brand voice compliance"),
      ],
      tantangan: [
        { judul: _("Klien meminta klaim berlebihan", "Clients asking for exaggerated claims"), isi: _("Tawarkan versi yang persuasif dan jujur, dan jelaskan risiko iklan ditolak.", "Offer persuasive, honest versions and explain rejection risks.") },
        { judul: _("Penilaian berdasarkan selera", "Taste-based judgement"), isi: _("Usulkan uji A/B agar keputusan berdasarkan data.", "Suggest A/B tests so decisions rest on data.") },
        { judul: _("Kehabisan ide", "Running dry"), isi: _("Simpan swipe file berisi iklan dan headline yang bagus untuk inspirasi.", "Keep a swipe file of great ads and headlines.") },
      ],
      jenjang: _("Copywriter bisa menjadi senior copywriter, creative lead, conversion specialist, atau konsultan untuk brand tertentu.", "Copywriters can become senior copywriters, creative leads, conversion specialists, or brand consultants."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan portofolio copy dan hasilnya", "Apply with copy samples and results"),
        _("Tes menulis beberapa versi iklan atau headline", "A test writing ad or headline variants"),
        _("Diskusi tentang alasan di balik pilihan kata", "Discussion of the reasoning behind word choices"),
      ],
      portofolio: [
        _("Iklan atau landing page dengan angka hasil (CTR, konversi)", "Ads or landing pages with results (CTR, conversions)"),
        _("Contoh sebelum dan sesudah penulisan ulang", "Before-and-after rewrites"),
        _("Variasi headline untuk satu produk beserta alasannya", "Headline variants for one product with reasoning"),
      ],
      tes: _("Tes umumnya meminta 5 sampai 10 headline dan 2 sampai 3 versi teks iklan untuk produk perusahaan. Penilai melihat pemahaman pembeli, variasi pendekatan, dan kejelasan ajakan.", "Tests usually ask for 5 to 10 headlines and 2 to 3 ad variants for the company's product. Reviewers check buyer insight, varied angles, and clear CTAs."),
      pertanyaan: [
        { q: _("Bagaimana kamu menulis untuk produk yang belum kamu kenal?", "How do you write for an unfamiliar product?"), jawab: _("Riset ulasan pembeli, wawancara tim, dan cari keberatan yang paling umum.", "Research buyer reviews, interview the team, and find common objections.") },
        { q: _("Copy mana yang paling berhasil yang pernah kamu tulis?", "What's your most successful copy?"), jawab: _("Ceritakan konteks, pendekatan, dan angka hasilnya.", "Share the context, approach, and results.") },
      ],
      kesalahan: [
        _("Portofolio tanpa hasil", "Portfolios without results"),
        _("Semua variasi memakai pendekatan yang sama", "All variants using the same angle"),
        _("Klaim yang tidak bisa dibuktikan", "Unprovable claims"),
      ],
    },
  },

  ghostwriter: {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Dengarkan rekaman wawancara klien dan catat cerita, pendapat, dan ungkapan khasnya.", "Listen to client interview recordings, noting stories, opinions, and signature phrases.") },
        { jam: "10.30", isi: _("Tulis draf unggahan LinkedIn atau bab buku dengan suara klien.", "Draft LinkedIn posts or book chapters in the client's voice.") },
        { jam: "14.00", isi: _("Sunting dan sesuaikan nada agar terdengar seperti klien berbicara.", "Edit and tune tone so it sounds like the client speaking.") },
        { jam: "15.30", isi: _("Kirim draf untuk ditinjau dan jadwalkan wawancara berikutnya.", "Send drafts for review and schedule the next interview.") },
      ],
      dinilai: [
        _("Klien merasa tulisan benar-benar suaranya", "The client feels it truly sounds like them"),
        _("Konsistensi jadwal unggah atau penyelesaian bab", "Consistent posting or chapter delivery"),
        _("Hasil: interaksi unggahan atau kemajuan naskah", "Results: post engagement or manuscript progress"),
      ],
      tantangan: [
        { judul: _("Klien sibuk dan sulit diwawancarai", "Busy, hard-to-reach clients"), isi: _("Gunakan pesan suara atau sesi singkat 20 menit seminggu sekali.", "Use voice notes or a short weekly 20-minute session.") },
        { judul: _("Menangkap suara orang lain", "Capturing someone else's voice"), isi: _("Kumpulkan contoh tulisan dan rekaman klien, buat panduan gaya pribadi untuknya.", "Collect the client's writing and recordings and build a personal style guide.") },
        { judul: _("Tidak bisa menunjukkan karya", "Can't show your work"), isi: _("Sepakati apa yang boleh disebut di portofolio, dan siapkan sampel atas nama sendiri.", "Agree what you may mention, and keep samples under your own name.") },
      ],
      jenjang: _("Ghostwriter bisa fokus pada buku dengan tarif per proyek yang besar, menjadi ghostwriter untuk eksekutif, atau editor buku.", "Ghostwriters can focus on high-fee book projects, write for executives, or become book editors."),
    },
    lolos: {
      alur: [
        _("Calon klien melihat contoh tulisan atas namamu sendiri", "Prospects review samples under your own name"),
        _("Panggilan perkenalan untuk menilai kecocokan", "An intro call to assess fit"),
        _("Tulisan percobaan berbayar dari wawancara singkat", "A paid trial piece from a short interview"),
        _("Kontrak dengan klausul kerahasiaan", "A contract with a confidentiality clause"),
      ],
      portofolio: [
        _("Unggahan LinkedIn atau artikel atas namamu sendiri yang menunjukkan gaya", "LinkedIn posts or articles under your name showing range"),
        _("Contoh tulisan dengan beberapa suara berbeda", "Samples in several distinct voices"),
        _("Testimoni klien tanpa menyebut karya spesifik", "Client testimonials without naming specific pieces"),
      ],
      tes: _("Klien sering meminta satu tulisan dari wawancara 20 sampai 30 menit. Yang dinilai: apakah tulisan terdengar seperti mereka dan menangkap cerita yang menarik.", "Clients often request one piece from a 20 to 30-minute interview. They judge whether it sounds like them and captures a compelling story."),
      pertanyaan: [
        { q: _("Bagaimana kamu menjaga kerahasiaan?", "How do you keep confidentiality?"), jawab: _("Jelaskan kesediaan menandatangani NDA dan kebiasaan tidak menyebut klien.", "Explain willingness to sign an NDA and never naming clients.") },
        { q: _("Bagaimana prosesmu menangkap gaya bicara saya?", "How will you capture my voice?"), jawab: _("Jelaskan wawancara, rekaman, dan panduan gaya pribadi.", "Describe interviews, recordings, and a personal style guide.") },
      ],
      kesalahan: [
        _("Menyebut nama klien lama tanpa izin", "Naming past clients without permission"),
        _("Gaya yang sama untuk semua klien", "The same style for every client"),
        _("Menerima pekerjaan akademik atas nama orang lain", "Taking academic work in someone else's name"),
      ],
    },
  },

  "penulis-skrip": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Tonton analitik video klien: di detik mana penonton pergi.", "Review the client's video analytics: where viewers drop off.") },
        { jam: "10.00", isi: _("Riset topik dan tulis 3 sampai 5 hook pembuka.", "Research topics and write 3 to 5 opening hooks.") },
        { jam: "11.00", isi: _("Tulis skrip lengkap dengan catatan visual dan teks layar.", "Write full scripts with visual notes and on-screen text.") },
        { jam: "14.00", isi: _("Baca skrip dengan suara untuk mengecek durasi dan kelancaran.", "Read scripts aloud to check timing and flow.") },
        { jam: "15.30", isi: _("Kirim ke kreator, tanggapi revisi, dan siapkan daftar ide minggu depan.", "Send to the creator, handle revisions, and prep next week's ideas.") },
      ],
      dinilai: [
        _("Retensi penonton dan waktu tonton", "Viewer retention and watch time"),
        _("Skrip mudah dibawakan oleh host", "Scripts are easy for the host to deliver"),
        _("Konsistensi pengiriman sesuai jadwal produksi", "Consistent delivery for the production schedule"),
      ],
      tantangan: [
        { judul: _("Host improvisasi jauh dari skrip", "Hosts ad-libbing far from the script"), isi: _("Tulis poin kunci yang wajib disampaikan dan beri ruang untuk improvisasi.", "Write must-say points and leave room for improvisation.") },
        { judul: _("Tren cepat berubah", "Fast-moving trends"), isi: _("Gabungkan tren dengan topik yang tetap relevan.", "Combine trends with evergreen topics.") },
        { judul: _("Klien ingin viral", "Clients wanting virality"), isi: _("Fokus pada retensi dan nilai untuk penonton, bukan janji viral.", "Focus on retention and viewer value, not viral promises.") },
      ],
      jenjang: _("Penulis skrip bisa menjadi content strategist untuk kreator, produser konten, atau creative director di agensi video.", "Scriptwriters can become creator content strategists, producers, or creative directors at video agencies."),
    },
    lolos: {
      alur: [
        _("Kirim contoh skrip ke kreator atau agensi", "Send sample scripts to creators or agencies"),
        _("Tes menulis skrip untuk topik channel mereka", "A test script on their channel's topic"),
        _("Skrip percobaan berbayar yang diproduksi", "A paid trial script that gets produced"),
      ],
      portofolio: [
        _("Skrip video pendek, YouTube panjang, dan iklan", "Short-form, long-form YouTube, and ad scripts"),
        _("Tautan video yang diproduksi dari skripmu beserta datanya", "Links to produced videos from your scripts with data"),
      ],
      tes: _("Tes biasanya skrip untuk satu topik channel. Penilai melihat hook, alur, dan apakah skrip cocok dengan gaya host.", "Tests are usually one script on the channel's topic. Reviewers check the hook, flow, and fit with the host's style."),
      pertanyaan: [
        { q: _("Bagaimana kamu menulis hook?", "How do you write hooks?"), jawab: _("Sebut beberapa pola (pertanyaan, pernyataan mengejutkan, hasil di awal) dan beri contoh.", "Name a few patterns (question, bold claim, result first) with examples.") },
        { q: _("Bagaimana memakai data retensi?", "How do you use retention data?"), jawab: _("Cari titik penurunan dan perbaiki bagian itu di skrip berikutnya.", "Find drop-off points and fix those parts in the next script.") },
      ],
      kesalahan: [
        _("Skrip yang terdengar seperti esai tertulis", "Scripts that read like written essays"),
        _("Tidak menonton konten kreator yang dilamar", "Not watching the creator's content"),
        _("Durasi yang tidak realistis", "Unrealistic durations"),
      ],
    },
  },

  penerjemah: {
    kerja: {
      hari: [
        { jam: "08.30", isi: _("Terima proyek dari agensi atau klien, baca instruksi, glosarium, dan panduan gaya.", "Receive projects, reading instructions, glossaries, and style guides.") },
        { jam: "09.00", isi: _("Terjemahkan di CAT tool dengan memori terjemahan, dalam blok fokus.", "Translate in a CAT tool with translation memory, in focus blocks.") },
        { jam: "13.00", isi: _("Riset istilah yang sulit dan catat pertanyaan untuk klien.", "Research tricky terms and note client queries.") },
        { jam: "15.00", isi: _("Baca ulang terjemahan tanpa melihat sumber untuk mengecek kealamian.", "Reread without the source to check naturalness.") },
        { jam: "16.00", isi: _("Jalankan pengecekan QA (angka, tag, konsistensi istilah), lalu kirim.", "Run QA checks (numbers, tags, term consistency), then deliver.") },
      ],
      dinilai: [
        _("Akurasi makna dan istilah", "Accuracy of meaning and terms"),
        _("Kealamian bahasa sasaran", "Naturalness in the target language"),
        _("Ketepatan waktu dan kepatuhan instruksi", "Timeliness and instruction compliance"),
      ],
      tantangan: [
        { judul: _("Tarif per kata yang rendah", "Low per-word rates"), isi: _("Spesialisasi di bidang tertentu dan klien langsung biasanya memberi tarif lebih baik.", "Specialising and working with direct clients usually pays better.") },
        { judul: _("Terjemahan mesin", "Machine translation"), isi: _("Kuasai post-editing dan tawarkan keahlian yang tidak bisa diberikan mesin, seperti nuansa dan istilah khusus.", "Master post-editing and offer what machines can't, like nuance and specialist terms.") },
        { judul: _("Sumber yang ambigu", "Ambiguous sources"), isi: _("Kumpulkan pertanyaan dalam satu daftar dan kirim ke klien lebih awal.", "Batch queries in one list and send them early.") },
      ],
      jenjang: _("Penerjemah bisa menjadi reviewer atau editor, spesialis lokalisasi aplikasi dan game, atau penerjemah tersumpah dengan sertifikasi.", "Translators can become reviewers or editors, app and game localisation specialists, or certified sworn translators."),
    },
    lolos: {
      alur: [
        _("Daftar di agensi atau platform penerjemah", "Register with agencies or translator platforms"),
        _("Tes terjemahan 200 sampai 500 kata di bidang tertentu", "A 200 to 500-word test in a specific field"),
        _("Pemeriksaan oleh reviewer senior", "Review by a senior linguist"),
        _("Masuk daftar penerjemah agensi dan menerima proyek kecil dulu", "Join the agency roster with small jobs first"),
      ],
      portofolio: [
        _("Contoh terjemahan teks publik di bidang spesialisasimu", "Sample translations of public texts in your field"),
        _("Sertifikat atau skor tes bahasa", "Certificates or language test scores"),
        _("Daftar CAT tool yang dikuasai", "CAT tools you use"),
      ],
      tes: _("Tes biasanya teks 300 sampai 500 kata di bidang yang kamu pilih. Reviewer menandai kesalahan makna, istilah, tata bahasa, dan gaya. Kesalahan makna dinilai paling berat.", "Tests are usually 300 to 500 words in your chosen field. Reviewers mark meaning, terminology, grammar, and style errors, with meaning errors weighted heaviest."),
      pertanyaan: [
        { q: _("Bagaimana kamu menangani istilah yang tidak ada padanannya?", "How do you handle terms without equivalents?"), jawab: _("Jelaskan pilihanmu: padanan baku, penjelasan, atau mempertahankan istilah asli sesuai konteks dan glosarium.", "Explain options: standard equivalents, explanation, or keeping the original per context and glossary.") },
        { q: _("Berapa kata per hari yang bisa kamu terjemahkan?", "How many words a day can you translate?"), jawab: _("Beri angka realistis per jenis teks.", "Give realistic numbers per text type.") },
      ],
      kesalahan: [
        _("Mengaku menguasai semua bidang", "Claiming every specialism"),
        _("Menerjemahkan kata per kata", "Word-for-word translation"),
        _("Mengerjakan tes ribuan kata tanpa bayaran", "Doing unpaid tests of thousands of words"),
      ],
    },
  },

  "technical-writer": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Ikuti stand-up tim produk dan catat fitur yang akan dirilis.", "Join the product stand-up and note upcoming features.") },
        { jam: "10.00", isi: _("Coba fitur di lingkungan uji dan ambil tangkapan layar.", "Try features in a test environment and take screenshots.") },
        { jam: "11.00", isi: _("Tulis atau perbarui artikel bantuan dan dokumentasi.", "Write or update help articles and documentation.") },
        { jam: "14.00", isi: _("Minta review teknis dari engineer dan review bahasa dari editor.", "Get technical review from engineers and language review from an editor.") },
        { jam: "16.00", isi: _("Terbitkan dan cek tiket bantuan untuk pertanyaan yang belum ada artikelnya.", "Publish and check support tickets for unanswered questions.") },
      ],
      dinilai: [
        _("Berkurangnya tiket bantuan untuk topik yang sudah didokumentasikan", "Fewer tickets on documented topics"),
        _("Dokumentasi akurat dan diperbarui bersama rilis", "Accurate docs updated with releases"),
        _("Kemudahan dibaca dan diikuti", "Ease of reading and following"),
      ],
      tantangan: [
        { judul: _("Akses ke engineer terbatas", "Limited engineer access"), isi: _("Kumpulkan pertanyaan dan minta sesi rutin singkat.", "Batch questions and ask for short regular sessions.") },
        { judul: _("Produk sering berubah", "Frequent product changes"), isi: _("Masukkan pembaruan dokumentasi sebagai bagian dari daftar rilis.", "Make doc updates part of the release checklist.") },
        { judul: _("Pembaca dengan level berbeda", "Readers of different levels"), isi: _("Pisahkan panduan pemula dan referensi lanjutan.", "Separate beginner guides from advanced references.") },
      ],
      jenjang: _("Technical writer bisa menjadi senior atau lead, documentation manager, content designer, atau developer advocate.", "Technical writers can become senior or lead writers, documentation managers, content designers, or developer advocates."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan contoh dokumentasi", "Apply with documentation samples"),
        _("Tes menulis panduan dari fitur atau API contoh", "A test writing a guide for a sample feature or API"),
        _("Interview dengan tim produk dan engineer", "Interviews with product and engineering"),
      ],
      portofolio: [
        _("Panduan langkah demi langkah dengan tangkapan layar", "Step-by-step guides with screenshots"),
        _("Contoh dokumentasi API atau README", "Sample API docs or a README"),
        _("Kontribusi dokumentasi open source", "Open-source documentation contributions"),
      ],
      tes: _("Biasanya kamu diberi akses ke fitur atau deskripsi API dan diminta menulis panduan. Penilai melihat ketepatan, struktur, dan apakah pembaca bisa mengikuti tanpa bantuan.", "You're usually given a feature or API description to document. Reviewers check accuracy, structure, and whether readers can follow unaided."),
      pertanyaan: [
        { q: _("Bagaimana kamu memahami fitur teknis yang rumit?", "How do you learn complex features?"), jawab: _("Mencoba langsung, membaca spesifikasi, dan bertanya dengan pertanyaan yang terarah.", "Hands-on testing, reading specs, and asking targeted questions.") },
        { q: _("Bagaimana mengukur dokumentasi yang baik?", "How do you measure good docs?"), jawab: _("Tiket bantuan berkurang, umpan balik pembaca, dan tingkat penyelesaian tugas.", "Fewer tickets, reader feedback, and task completion.") },
      ],
      kesalahan: [
        _("Menulis untuk diri sendiri, bukan untuk pembaca", "Writing for yourself, not the reader"),
        _("Tangkapan layar yang tidak sesuai versi terbaru", "Outdated screenshots"),
        _("Tidak memahami dasar Markdown dan Git", "Not knowing Markdown and Git basics"),
      ],
    },
  },
};
