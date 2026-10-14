import { t as _ } from "../../i18n.js";

/** Cara lolos seleksi dan gambaran kerja: kategori Desain & Kreatif. */
export default {
  "desainer-grafis": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Cek brief dan masukan klien di WhatsApp, email, atau Trello. Susun daftar pekerjaan hari ini.", "Check briefs and feedback on WhatsApp, email, or Trello. List today's work.") },
        { jam: "09.30", isi: _("Kerjakan desain utama: feed media sosial, poster, atau kemasan, mengikuti brand guideline klien.", "Main design work: social feeds, posters, or packaging, following the client's brand guide.") },
        { jam: "13.00", isi: _("Revisi dari klien lain, kumpulkan semua masukan dalam satu putaran.", "Revisions for other clients, batching feedback into one round.") },
        { jam: "15.00", isi: _("Siapkan file final: ukuran sesuai platform, file cetak CMYK dengan bleed, dan file sumber jika disepakati.", "Prepare finals: platform sizes, CMYK print files with bleed, and source files if agreed.") },
        { jam: "16.30", isi: _("Kirim hasil dengan mockup dan catat jam kerja.", "Deliver with mockups and log hours.") },
      ],
      dinilai: [
        _("Desain sesuai brief dan brand", "Designs fit the brief and brand"),
        _("Sedikit putaran revisi", "Few revision rounds"),
        _("File siap pakai tanpa masalah teknis", "Ready-to-use files without technical issues"),
      ],
      tantangan: [
        { judul: _("Brief yang tidak jelas", "Unclear briefs"), isi: _("Gunakan formulir brief: tujuan, target, ukuran, teks, referensi yang disukai dan tidak disukai.", "Use a brief form: goal, audience, sizes, copy, liked and disliked references.") },
        { judul: _("Revisi tanpa batas", "Endless revisions"), isi: _("Tulis batas revisi di penawaran dan tunjukkan pilihan arah sejak awal.", "State revision limits in your quote and show direction options early.") },
        { judul: _("Harga yang terlalu murah", "Underpricing"), isi: _("Hitung tarif per jam yang kamu inginkan dan bandingkan dengan waktu nyata per desain.", "Set a target hourly rate and compare it with real time per design.") },
      ],
      jenjang: _("Desainer grafis bisa menjadi senior designer, art director, brand designer, atau UI designer jika mempelajari desain produk digital.", "Graphic designers can become senior designers, art directors, brand designers, or UI designers by learning digital product design."),
    },
    lolos: {
      alur: [
        _("Lamaran atau proposal dengan tautan portofolio", "Apply or pitch with a portfolio link"),
        _("Tes desain sesuai brand perusahaan (sebaiknya singkat atau dibayar)", "A design test for the brand (ideally short or paid)"),
        _("Presentasi alasan desain", "Present your design rationale"),
        _("Masa percobaan atau proyek kecil", "A trial or small project"),
      ],
      portofolio: [
        _("8 sampai 12 karya terbaik, bukan semua karya", "8 to 12 best pieces, not everything"),
        _("Studi kasus: brief, proses, dan hasil", "Case studies: brief, process, and outcome"),
        _("Variasi format yang relevan dengan lowongan (media sosial, cetak, kemasan)", "Formats relevant to the role (social, print, packaging)"),
      ],
      tes: _("Tes biasanya membuat 2 sampai 3 desain untuk brand perusahaan dalam 1 sampai 3 hari. Penilai melihat hierarki visual, konsistensi dengan brand, dan alasan yang kamu sampaikan.", "Tests usually ask for 2 to 3 designs for the brand in 1 to 3 days. Reviewers check visual hierarchy, brand fit, and your rationale."),
      pertanyaan: [
        { q: _("Bagaimana kamu menangani klien yang tidak suka desainmu?", "How do you handle a client who dislikes your design?"), jawab: _("Gali bagian yang tidak cocok dengan pertanyaan spesifik dan tawarkan arah alternatif.", "Probe what doesn't work with specific questions and offer alternative directions.") },
        { q: _("Ceritakan proses desainmu.", "Walk me through your process."), jawab: _("Brief, riset, sketsa atau moodboard, desain, revisi, file final.", "Brief, research, sketches or moodboard, design, revisions, final files.") },
      ],
      kesalahan: [
        _("Portofolio berisi semua karya tanpa kurasi", "Uncurated portfolios"),
        _("Memakai aset tanpa lisensi", "Using unlicensed assets"),
        _("Tidak bisa menjelaskan alasan desain", "Can't explain design choices"),
      ],
    },
  },

  "video-editor": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Unduh footage dari klien, rapikan folder, dan buat proxy jika file berat.", "Download client footage, organise folders, and make proxies for heavy files.") },
        { jam: "09.30", isi: _("Tonton dan tandai bagian terbaik, susun kerangka cerita.", "Review and mark the best parts, then outline the story.") },
        { jam: "11.00", isi: _("Edit kasar: urutan, ritme, dan durasi.", "Rough cut: order, pacing, and length.") },
        { jam: "14.00", isi: _("Edit halus: subtitle, musik, warna, dan suara.", "Fine cut: subtitles, music, colour, and audio.") },
        { jam: "16.00", isi: _("Ekspor sesuai platform, kirim pratinjau, dan catat masukan.", "Export per platform, send a preview, and log feedback.") },
      ],
      dinilai: [
        _("Retensi penonton dan performa video", "Viewer retention and performance"),
        _("Ketepatan waktu sesuai jadwal unggah", "On-time delivery for the posting schedule"),
        _("Konsistensi gaya dengan brand atau kreator", "Style consistency with the brand or creator"),
      ],
      tantangan: [
        { judul: _("File mentah besar dan internet lambat", "Huge raw files and slow internet"), isi: _("Minta klien mengunggah lebih awal dan gunakan proxy untuk mengedit.", "Ask for early uploads and edit with proxies.") },
        { judul: _("Revisi berdasarkan selera", "Taste-based revisions"), isi: _("Minta contoh video referensi di awal dan sepakati gaya.", "Ask for reference videos upfront and agree the style.") },
        { judul: _("Musik berhak cipta", "Copyrighted music"), isi: _("Gunakan pustaka musik berlisensi dan simpan bukti lisensinya.", "Use licensed libraries and keep licence records.") },
      ],
      jenjang: _("Video editor bisa menjadi senior editor, motion designer, content producer, atau membuka jasa produksi video.", "Video editors can become senior editors, motion designers, content producers, or start a video production service."),
    },
    lolos: {
      alur: [
        _("Kirim showreel dan contoh video sesuai format", "Send a showreel and format-matched samples"),
        _("Tes edit singkat dari footage perusahaan", "A short edit test from company footage"),
        _("Video percobaan berbayar", "A paid trial video"),
      ],
      portofolio: [
        _("Showreel 30 sampai 60 detik", "A 30 to 60-second showreel"),
        _("Contoh video pendek vertikal dan video panjang", "Vertical short-form and long-form samples"),
        _("Data performa jika ada (tayangan, retensi)", "Performance data if available (views, retention)"),
      ],
      tes: _("Biasanya kamu diberi 5 sampai 15 menit footage untuk dijadikan video 30 sampai 60 detik. Penilai melihat hook, ritme, subtitle, dan kualitas suara.", "You usually get 5 to 15 minutes of footage for a 30 to 60-second edit. Reviewers check the hook, pacing, subtitles, and audio."),
      pertanyaan: [
        { q: _("Bagaimana kamu membuat 3 detik pertama menarik?", "How do you make the first 3 seconds grab?"), jawab: _("Mulai dari visual atau kalimat paling kuat, bukan perkenalan.", "Open with the strongest visual or line, not an intro.") },
        { q: _("Software apa yang kamu pakai?", "Which software do you use?"), jawab: _("Sebut software dan contoh fitur yang dikuasai.", "Name your software and features you've mastered.") },
      ],
      kesalahan: [
        _("Showreel terlalu panjang", "Overlong showreels"),
        _("Suara yang tidak seimbang", "Unbalanced audio"),
        _("Mengerjakan video lengkap gratis sebagai tes", "Doing full unpaid videos as tests"),
      ],
    },
  },

  "desain-logo-branding": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Wawancara atau isi kuesioner brand bersama klien baru.", "Run a brand interview or questionnaire with a new client.") },
        { jam: "10.30", isi: _("Riset kompetitor dan buat moodboard.", "Research competitors and build moodboards.") },
        { jam: "13.00", isi: _("Sketsa banyak konsep, pilih 2 sampai 3 terbaik untuk digarap di vektor.", "Sketch many concepts and develop the best 2 to 3 in vector.") },
        { jam: "15.00", isi: _("Uji logo di ukuran kecil, satu warna, dan mockup nyata.", "Test logos small, in one colour, and on real mockups.") },
        { jam: "16.30", isi: _("Siapkan presentasi konsep dengan alasan setiap pilihan.", "Prepare a concept presentation with reasoning.") },
      ],
      dinilai: [
        _("Logo mewakili nilai brand dan mudah dikenali", "The logo reflects brand values and is recognisable"),
        _("Bekerja di semua ukuran dan media", "Works across sizes and media"),
        _("Paket file dan panduan lengkap", "Complete files and guidelines"),
      ],
      tantangan: [
        { judul: _("Klien terpaku pada selera pribadi", "Clients fixated on personal taste"), isi: _("Kembalikan diskusi ke target pelanggan dan nilai brand.", "Steer back to target customers and brand values.") },
        { judul: _("Permintaan meniru logo terkenal", "Requests to copy famous logos"), isi: _("Jelaskan risiko merek dan gali kesan yang sebenarnya diinginkan.", "Explain trademark risk and uncover the feel they want.") },
        { judul: _("Proyek yang terus melebar", "Expanding scope"), isi: _("Pisahkan paket logo, identitas lengkap, dan penerapan.", "Separate logo, full identity, and application packages.") },
      ],
      jenjang: _("Desainer logo bisa menjadi brand designer, brand strategist, atau creative director di studio branding.", "Logo designers can become brand designers, brand strategists, or creative directors at branding studios."),
    },
    lolos: {
      alur: [
        _("Calon klien melihat portofolio di Behance atau Dribbble", "Prospects view your Behance or Dribbble"),
        _("Panggilan atau kuesioner awal", "An intro call or questionnaire"),
        _("Penawaran paket dengan tahapan dan file yang diserahkan", "A package quote with stages and deliverables"),
        _("Uang muka sebelum mulai", "A deposit before starting"),
      ],
      portofolio: [
        _("Studi kasus branding: masalah, proses, konsep, dan penerapan", "Branding case studies: problem, process, concepts, application"),
        _("Mockup penerapan nyata", "Realistic application mockups"),
        _("Contoh brand guideline", "A sample brand guideline"),
      ],
      tes: _("Klien jarang memberi tes, tetapi lomba desain sering meminta karya gratis. Lebih baik tunjukkan studi kasus dan proses daripada ikut lomba yang mengambil hak semua peserta.", "Clients rarely test you, but contests often ask for free work. Show case studies and process rather than joining contests that claim every entrant's rights."),
      pertanyaan: [
        { q: _("Kenapa harga logo bisa jutaan?", "Why can a logo cost millions of rupiah?"), jawab: _("Jelaskan riset, konsep, revisi, file lengkap, dan panduan yang membuat logo awet dipakai.", "Explain research, concepts, revisions, complete files, and guidelines that make it last.") },
        { q: _("Berapa lama prosesnya?", "How long does it take?"), jawab: _("Beri tahapan dan waktu per tahap.", "Give stages and timing.") },
      ],
      kesalahan: [
        _("Hanya menunjukkan logo di latar putih", "Showing logos only on white"),
        _("Tidak menyerahkan file vektor", "Not delivering vector files"),
        _("Mengirim file final sebelum pelunasan", "Sending finals before payment"),
      ],
    },
  },

  ilustrator: {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Baca brief dan referensi, buat thumbnail sketsa kecil.", "Read the brief and references; make small thumbnail sketches.") },
        { jam: "10.30", isi: _("Kirim sketsa untuk disetujui, sambil mengerjakan proyek lain.", "Send sketches for approval while working on other projects.") },
        { jam: "13.00", isi: _("Warna dasar dan pencahayaan untuk sketsa yang sudah disetujui.", "Flats and lighting for approved sketches.") },
        { jam: "15.30", isi: _("Detail akhir dan ekspor sesuai kebutuhan cetak atau digital.", "Final rendering and export for print or digital.") },
        { jam: "17.00", isi: _("Unggah karya pribadi ke media sosial untuk menarik klien baru.", "Post personal work on social media to attract clients.") },
      ],
      dinilai: [
        _("Konsistensi gaya dan karakter", "Consistent style and characters"),
        _("Ketepatan tahapan dan tenggat", "Hitting stages and deadlines"),
        _("File siap cetak tanpa masalah", "Print-ready files without issues"),
      ],
      tantangan: [
        { judul: _("Revisi besar di tahap akhir", "Big late-stage revisions"), isi: _("Minta persetujuan tertulis di setiap tahap.", "Get written approval at each stage.") },
        { judul: _("Hak penggunaan", "Usage rights"), isi: _("Tulis penggunaan yang diizinkan dan harga tambahan untuk penggunaan lain.", "List permitted uses and pricing for others.") },
        { judul: _("Pendapatan tidak stabil", "Irregular income"), isi: _("Tambah pemasukan dari produk sendiri seperti stiker, cetakan, atau aset digital.", "Add income from your own products like stickers, prints, or digital assets.") },
      ],
      jenjang: _("Ilustrator bisa menjadi concept artist, art director buku atau game, atau membangun brand sendiri.", "Illustrators can become concept artists, art directors for books or games, or build their own brand."),
    },
    lolos: {
      alur: [
        _("Klien menemukan karyamu di media sosial atau portofolio", "Clients find you via social media or portfolio"),
        _("Diskusi brief dan anggaran", "Brief and budget discussion"),
        _("Penawaran dengan tahapan, hak penggunaan, dan uang muka", "A quote with stages, rights, and deposit"),
      ],
      portofolio: [
        _("Karya dengan gaya yang konsisten", "Work in a consistent style"),
        _("Character sheet atau seri ilustrasi", "Character sheets or illustration series"),
        _("Contoh proses dari sketsa sampai final", "Process from sketch to final"),
      ],
      tes: _("Untuk studio game atau penerbit, tes biasanya menggambar satu karakter atau adegan dari deskripsi dalam beberapa hari. Penilai melihat dasar gambar, gaya, dan kemampuan mengikuti arahan.", "Game studios or publishers usually test with one character or scene from a description over a few days, judging fundamentals, style, and following direction."),
      pertanyaan: [
        { q: _("Bisakah menggambar dengan gaya kami?", "Can you match our style?"), jawab: _("Jujur soal jangkauan gayamu dan tunjukkan contoh yang paling mendekati.", "Be honest about your range and show the closest samples.") },
        { q: _("Bagaimana hak cipta karyanya?", "What about copyright?"), jawab: _("Jelaskan lisensi penggunaan dan opsi pengalihan hak dengan biaya tambahan.", "Explain usage licences and rights transfer for an extra fee.") },
      ],
      kesalahan: [
        _("Portofolio dengan terlalu banyak gaya berbeda", "Portfolios with too many styles"),
        _("Tidak membahas hak penggunaan", "Not discussing usage rights"),
        _("Menggambar karakter berhak cipta untuk dijual", "Drawing copyrighted characters for sale"),
      ],
    },
  },

  "desain-presentasi": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Pelajari isi presentasi klien dan tanyakan pesan utama setiap bagian.", "Study the client's content and ask for each section's key message.") },
        { jam: "10.00", isi: _("Susun ulang alur cerita dan tentukan satu pesan per slide.", "Restructure the story with one message per slide.") },
        { jam: "11.00", isi: _("Desain slide master, lalu terapkan ke semua slide.", "Design slide masters, then apply them to all slides.") },
        { jam: "14.00", isi: _("Ubah data menjadi grafik sederhana dan ikon yang konsisten.", "Turn data into simple charts and consistent icons.") },
        { jam: "16.00", isi: _("Cek di mode presentasi dan kirim versi PPT serta PDF.", "Check in presenter mode and send PPT and PDF versions.") },
      ],
      dinilai: [
        _("Pesan utama mudah dipahami dalam beberapa detik", "Key messages land in seconds"),
        _("Template mudah dipakai dan diedit klien", "Templates are easy for clients to edit"),
        _("Tepat waktu menjelang rapat atau pitching", "On time before meetings or pitches"),
      ],
      tantangan: [
        { judul: _("Tenggat mendadak", "Last-minute deadlines"), isi: _("Siapkan template dasar dan perpustakaan ikon agar bisa bekerja cepat.", "Keep base templates and icon libraries to work fast.") },
        { judul: _("Klien ingin semua muat di satu slide", "Clients cramming everything on one slide"), isi: _("Usulkan memindahkan detail ke catatan pembicara atau lampiran.", "Suggest moving details to speaker notes or an appendix.") },
        { judul: _("Data rahasia", "Confidential data"), isi: _("Jaga kerahasiaan dan minta izin sebelum memakai sebagai portofolio.", "Keep it confidential and ask before using it in your portfolio.") },
      ],
      jenjang: _("Desainer presentasi bisa menjadi visual communication specialist, desainer laporan tahunan, atau konsultan pitch deck.", "Presentation designers can become visual communication specialists, annual report designers, or pitch deck consultants."),
    },
    lolos: {
      alur: [
        _("Tunjukkan contoh sebelum dan sesudah", "Show before-and-after samples"),
        _("Diskusi isi dan tenggat", "Discuss content and deadline"),
        _("Penawaran per slide atau per paket", "Quote per slide or package"),
      ],
      portofolio: [
        _("Slide sebelum dan sesudah dirapikan", "Before-and-after slides"),
        _("Contoh template perusahaan dengan slide master", "A company template with slide masters"),
        _("Contoh pitch deck (data disamarkan)", "A sample pitch deck (data anonymised)"),
      ],
      tes: _("Kadang klien meminta merapikan 1 sampai 3 slide sebagai percobaan. Fokus pada kejelasan pesan, bukan efek.", "Clients sometimes ask you to redo 1 to 3 slides as a trial. Focus on clarity, not effects."),
      pertanyaan: [
        { q: _("Bisa selesai dalam 2 hari?", "Can you finish in 2 days?"), jawab: _("Jawab berdasarkan jumlah slide dan kesiapan konten, dan sebut biaya ekspres bila perlu.", "Answer based on slide count and content readiness; mention rush fees if needed.") },
        { q: _("Format apa yang diserahkan?", "Which formats do you deliver?"), jawab: _("PPT atau Google Slides yang bisa diedit, plus PDF.", "Editable PPT or Google Slides, plus PDF.") },
      ],
      kesalahan: [
        _("Animasi berlebihan", "Excessive animation"),
        _("Template yang sulit diedit klien", "Templates clients can't edit"),
        _("Font yang tidak terpasang di komputer klien", "Fonts not installed on the client's computer"),
      ],
    },
  },

  "motion-graphics": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Baca naskah dan storyboard yang sudah disetujui.", "Read the approved script and storyboard.") },
        { jam: "10.00", isi: _("Siapkan aset vektor dan susun scene di After Effects.", "Prepare vector assets and build scenes in After Effects.") },
        { jam: "13.00", isi: _("Animasikan dengan timing dan easing yang halus, sinkron dengan voice over.", "Animate with smooth timing and easing, synced to voiceover.") },
        { jam: "15.30", isi: _("Render pratinjau dan kirim untuk masukan.", "Render a preview and send for feedback.") },
        { jam: "17.00", isi: _("Atur render final semalaman untuk beberapa format.", "Queue overnight final renders in several formats.") },
      ],
      dinilai: [
        _("Gerakan halus dan sesuai brand", "Smooth, on-brand motion"),
        _("Pesan tersampaikan dalam durasi singkat", "Message delivered in a short duration"),
        _("Ketepatan waktu dan format file", "Timeliness and correct formats"),
      ],
      tantangan: [
        { judul: _("Perubahan naskah setelah animasi", "Script changes after animating"), isi: _("Kunci naskah dan storyboard sebelum mulai, dan hitung biaya perubahan besar.", "Lock script and storyboard first and charge for major changes.") },
        { judul: _("Render lama", "Long renders"), isi: _("Gunakan pratinjau resolusi rendah dan render final di luar jam kerja.", "Preview at low resolution and render finals off-hours.") },
        { judul: _("Komputer kurang kuat", "Underpowered hardware"), isi: _("Optimalkan proyek (pre-compose, proxy) dan rencanakan upgrade dari pendapatan.", "Optimise projects (pre-compose, proxies) and plan upgrades from earnings.") },
      ],
      jenjang: _("Animator motion graphics bisa menjadi senior motion designer, 3D artist, atau art director di studio animasi.", "Motion designers can become senior motion designers, 3D artists, or art directors at animation studios."),
    },
    lolos: {
      alur: [
        _("Kirim showreel", "Send a showreel"),
        _("Diskusi naskah, durasi, dan gaya", "Discuss script, length, and style"),
        _("Penawaran dengan tahapan dan revisi", "A quote with stages and revisions"),
        _("Uang muka, lalu storyboard", "Deposit, then storyboard"),
      ],
      portofolio: [
        _("Showreel 30 sampai 60 detik", "A 30 to 60-second showreel"),
        _("Contoh animasi logo dan video penjelasan", "Logo animation and explainer samples"),
        _("Storyboard dari salah satu proyek", "A storyboard from one project"),
      ],
      tes: _("Studio kadang meminta menganimasikan satu scene dari aset yang mereka berikan. Penilai melihat timing, easing, dan kerapian proyek.", "Studios sometimes ask you to animate one scene from their assets, judging timing, easing, and project tidiness."),
      pertanyaan: [
        { q: _("Bagaimana prosesmu dari naskah sampai video?", "What's your process from script to video?"), jawab: _("Naskah, storyboard, styleframe, animasi, suara, render.", "Script, storyboard, styleframes, animation, sound, render.") },
        { q: _("Apakah file proyek diserahkan?", "Do you hand over project files?"), jawab: _("Jelaskan kebijakanmu dan biaya tambahan jika diminta.", "Explain your policy and any extra fee.") },
      ],
      kesalahan: [
        _("Showreel panjang dengan karya lemah di awal", "Long reels with weak opening work"),
        _("Gerakan berlebihan yang mengganggu pesan", "Excess motion that distracts"),
        _("Tidak mengunci naskah sebelum mulai", "Not locking the script first"),
      ],
    },
  },

  "voice-over-audio": {
    kerja: {
      hari: [
        { jam: "08.00", isi: _("Pemanasan suara dan cek ruang rekam (suara AC, kendaraan, tetangga).", "Vocal warm-up and check the booth for noise (AC, traffic, neighbours).") },
        { jam: "08.30", isi: _("Baca naskah, tandai penekanan dan jeda, tanyakan pelafalan nama atau istilah.", "Read scripts, mark emphasis and pauses, and ask about name or term pronunciation.") },
        { jam: "09.00", isi: _("Rekam beberapa take untuk tiap naskah.", "Record several takes per script.") },
        { jam: "11.00", isi: _("Edit: pilih take terbaik, bersihkan noise, atur volume.", "Edit: choose best takes, clean noise, level volume.") },
        { jam: "14.00", isi: _("Kirim file, tanggapi permintaan pengambilan ulang, dan cari proyek baru.", "Deliver files, handle pickups, and audition for new work.") },
      ],
      dinilai: [
        _("Nada sesuai arahan dan karakter brand", "Tone matching direction and brand"),
        _("Kualitas audio bersih", "Clean audio quality"),
        _("Cepat dalam pengerjaan dan pengambilan ulang", "Fast turnaround and pickups"),
      ],
      tantangan: [
        { judul: _("Kebisingan di rumah", "Noise at home"), isi: _("Rekam di jam sepi dan perbaiki peredaman ruang secara bertahap.", "Record in quiet hours and improve treatment gradually.") },
        { judul: _("Kesehatan suara", "Vocal health"), isi: _("Minum air, hindari berteriak, dan istirahatkan suara di antara sesi.", "Hydrate, avoid shouting, and rest your voice between sessions.") },
        { judul: _("Hak penggunaan rekaman", "Recording usage rights"), isi: _("Selalu tanyakan media dan durasi penggunaan sebelum memberi harga.", "Always ask about media and duration before quoting.") },
      ],
      jenjang: _("Voice talent bisa menjadi pengisi suara iklan nasional, audiobook narrator, sulih suara, atau membuka studio audio.", "Voice talent can grow into national ad voiceovers, audiobook narration, dubbing, or running an audio studio."),
    },
    lolos: {
      alur: [
        _("Kirim demo reel atau ikut audisi di platform", "Send a demo reel or audition on platforms"),
        _("Rekam audisi singkat dari potongan naskah klien", "Record a short audition from the client's script"),
        _("Klien memilih suara, lalu kesepakatan tarif dan hak penggunaan", "Client picks a voice, then rates and rights are agreed"),
      ],
      portofolio: [
        _("Demo reel per jenis: iklan, narasi, karakter", "Demo reels per type: ads, narration, characters"),
        _("Daftar peralatan dan contoh audio mentah yang bersih", "Equipment list and a clean raw audio sample"),
        _("Daftar klien atau iklan yang pernah tayang", "Clients or ads you've voiced"),
      ],
      tes: _("Audisi biasanya 1 sampai 2 paragraf naskah. Kualitas rekaman sama pentingnya dengan suara: gema atau dengung sering langsung membuat gagal.", "Auditions are usually 1 to 2 paragraphs. Recording quality matters as much as voice; echo or hum often means instant rejection."),
      pertanyaan: [
        { q: _("Berapa lama pengerjaan?", "What's your turnaround?"), jawab: _("Sebut waktu standar dan layanan kilat.", "State standard and rush options.") },
        { q: _("Apakah termasuk revisi?", "Are revisions included?"), jawab: _("Jelaskan perbedaan salah baca (gratis) dan perubahan naskah (berbayar).", "Explain misreads (free) versus script changes (paid).") },
      ],
      kesalahan: [
        _("Demo reel terlalu panjang", "Overlong demo reels"),
        _("Audio dengan gema atau noise", "Audio with echo or noise"),
        _("Tidak menanyakan hak penggunaan", "Not asking about usage rights"),
      ],
    },
  },
};
