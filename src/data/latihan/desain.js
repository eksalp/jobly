import { t as _ } from "../../i18n.js";

/** Latihan praktik kategori Desain & Kreatif. Tugas visual dijawab dalam bentuk konsep, alasan, atau tautan hasil kerja. */
export default {
  "desainer-grafis": {
    kuis: [
      {
        q: _("Klien meminta \"logonya diperbesar, teksnya diperbesar, fotonya juga diperbesar\" di poster yang sama. Masalah desain apa yang muncul?", "A client wants \"the logo bigger, the text bigger, and the photo bigger\" on the same poster. What design problem arises?"),
        o: [
          _("Tidak ada masalah", "None"),
          _("Hierarki visual hilang, karena jika semua ditonjolkan, tidak ada yang menonjol", "Visual hierarchy disappears; if everything is emphasised, nothing stands out"),
          _("Warnanya menjadi pudar", "Colours fade"),
          _("Ukuran file terlalu kecil", "File size gets too small"),
        ],
        a: 1,
        e: _("Tanyakan apa satu hal terpenting yang harus dilihat orang pertama kali, lalu atur ukuran berdasarkan prioritas itu.", "Ask what one thing people must see first, then size elements by that priority."),
      },
      {
        q: _("Desain akan dicetak di spanduk. Mode warna dan resolusi apa yang sebaiknya dipakai?", "A design will be printed on a banner. Which colour mode and resolution should you use?"),
        o: [
          _("RGB, 72 dpi", "RGB, 72 dpi"),
          _("CMYK, dengan resolusi sesuai ukuran cetak dan jarak pandang, serta konfirmasi spesifikasi ke percetakan", "CMYK, at a resolution suited to print size and viewing distance, confirmed with the printer"),
          _("Hitam putih saja", "Black and white only"),
          _("Format JPG kualitas rendah", "Low-quality JPG"),
        ],
        a: 1,
        e: _("Cetak memakai CMYK. Spesifikasi resolusi dan bleed sebaiknya selalu ditanyakan ke percetakan.", "Print uses CMYK. Always confirm resolution and bleed specs with the printer."),
      },
      {
        q: _("Klien sudah meminta revisi ke-6, padahal kesepakatan hanya 2 kali revisi. Respons yang paling profesional?", "The client asks for a 6th revision when only 2 were agreed. Most professional response?"),
        o: [
          _("Kerjakan terus tanpa batas", "Keep going without limit"),
          _("Ingatkan kesepakatan dengan sopan, lalu tawarkan biaya revisi tambahan", "Politely remind them of the agreement and offer paid extra revisions"),
          _("Berhenti membalas", "Stop replying"),
          _("Kirim file mentah lalu putuskan kontrak", "Send raw files and end the contract"),
        ],
        a: 1,
        e: _("Batas revisi yang tertulis di awal memudahkan percakapan ini. Tetap ramah, tetapi hargai waktumu.", "A revision limit agreed in writing makes this easier. Stay friendly but value your time."),
      },
      {
        q: _("Kamu menemukan foto bagus di Google untuk desain iklan klien. Bolehkah dipakai?", "You find a great photo on Google for a client's ad. Can you use it?"),
        o: [
          _("Boleh, semua yang ada di internet gratis", "Yes, everything online is free"),
          _("Hanya jika lisensinya mengizinkan penggunaan komersial, misalnya dari situs foto bebas royalti atau stok berbayar", "Only if the licence allows commercial use, e.g. from royalty-free or paid stock sites"),
          _("Boleh jika diberi filter", "Yes, if you add a filter"),
          _("Boleh jika ukurannya kecil", "Yes, if it's small"),
        ],
        a: 1,
        e: _("Foto memiliki hak cipta. Penggunaan komersial tanpa lisensi bisa merugikan klien.", "Photos are copyrighted. Commercial use without a licence can harm the client."),
      },
      {
        q: _("Seseorang menawarkan \"lomba desain\" berhadiah besar, tetapi semua peserta wajib menyerahkan file mentah dan seluruh hak cipta, termasuk yang tidak menang. Apa risikonya?", "Someone runs a \"design contest\" with a big prize, but every entrant must hand over source files and full copyright, winners or not. What's the risk?"),
        o: [
          _("Tidak ada risiko", "None"),
          _("Karyamu bisa dipakai tanpa bayaran walaupun tidak menang", "Your work can be used without pay even if you don't win"),
          _("Kamu pasti menang", "You'll definitely win"),
          _("Hadiahnya pasti dibayar", "The prize is guaranteed"),
        ],
        a: 1,
        e: _("Lomba yang mengambil hak semua peserta adalah cara mendapatkan banyak desain gratis. Baca syaratnya dengan teliti.", "Contests claiming every entrant's rights are a way to get lots of free designs. Read the terms carefully."),
      },
    ],
    tugas: [
      {
        judul: _("Susun konsep desain feed Instagram", "Plan an Instagram feed design concept"),
        brief: _(
          "Kami toko roti rumahan di Yogyakarta yang ingin tampil lebih rapi di Instagram. Kesannya hangat, homemade, tapi tetap modern. Tolong buatkan konsep visualnya sebelum mulai mendesain.",
          "We're a home bakery in Yogyakarta wanting a tidier Instagram look. Warm, homemade, but still modern. Please create a visual concept before designing.",
        ),
        langkah: [
          _("Tentukan palet warna (dengan kode hex) dan alasannya.", "Choose a colour palette (with hex codes) and why."),
          _("Tentukan pasangan font untuk judul dan teks.", "Choose a heading and body font pairing."),
          _("Jelaskan 3 template konten yang akan dibuat. Jika sudah membuat contoh di Canva atau Figma, tempel tautannya.", "Describe 3 content templates. If you've made samples in Canva or Figma, paste the link."),
        ],
        rubrik: [
          _("Palet warna sesuai kesan hangat dan homemade", "Palette fits a warm, homemade feel"),
          _("Kode warna dicantumkan", "Colour codes included"),
          _("Font mudah dibaca di layar HP", "Fonts are readable on phones"),
          _("Template sesuai kebutuhan toko (produk, promo, testimoni)", "Templates fit shop needs (product, promo, testimonial)"),
          _("Ada alasan untuk setiap pilihan", "Each choice is explained"),
        ],
        contoh: _(
          "Palet:\n• Krem #F6EBDD (latar, kesan hangat seperti adonan)\n• Cokelat roti #8B5A2B (judul dan aksen)\n• Hijau sage #9CAF88 (aksen segar dan modern)\n• Cokelat tua #3B2A20 (teks)\n\nFont: judul memakai serif yang membulat seperti Fraunces untuk kesan homemade; teks memakai sans-serif bersih seperti Plus Jakarta Sans agar mudah dibaca.\n\nTemplate:\n1. Foto produk: foto besar dengan latar krem, nama roti di sudut kiri bawah, harga kecil\n2. Promo: latar cokelat, teks besar \"Pre-order Jumat\", foto produk berbentuk lingkaran\n3. Testimoni: kutipan pelanggan di tengah dengan tanda kutip sage, nama pelanggan di bawah\n\nFoto: cahaya alami dari jendela, alas kayu atau kain linen, untuk menjaga kesan rumahan.",
          "Palette:\n• Cream #F6EBDD (background, warm like dough)\n• Bread brown #8B5A2B (headings and accents)\n• Sage green #9CAF88 (fresh, modern accent)\n• Dark brown #3B2A20 (text)\n\nFonts: headings in a soft serif like Fraunces for a homemade feel; body in a clean sans-serif like Plus Jakarta Sans for readability.\n\nTemplates:\n1. Product photo: large photo on cream, bread name bottom-left, small price\n2. Promo: brown background, big \"Friday Pre-order\" text, circular product photo\n3. Testimonial: customer quote centred with sage quote marks, name below\n\nPhotography: natural window light, wooden boards or linen, to keep the homemade feel.",
        ),
      },
      {
        judul: _("Balas revisi klien yang kurang jelas", "Respond to vague client feedback"),
        brief: _(
          "Klien membalas desain poster pertamamu: \"Hmm, kurang wow. Bisa dibuat lebih menarik?\"",
          "The client replies to your first poster draft: \"Hmm, not wow enough. Can you make it more eye-catching?\"",
        ),
        langkah: [
          _("Tulis balasan yang menggali maksud klien.", "Write a reply that uncovers what the client means."),
          _("Ajukan pertanyaan atau pilihan yang spesifik.", "Ask specific questions or offer options."),
          _("Jaga agar balasan tetap singkat dan ramah.", "Keep it short and friendly."),
        ],
        rubrik: [
          _("Tidak defensif", "Not defensive"),
          _("Mengajukan pertanyaan spesifik (warna, ukuran teks, foto, referensi)", "Asks specific questions (colour, text size, photo, references)"),
          _("Menawarkan pilihan arah yang konkret", "Offers concrete direction options"),
          _("Meminta contoh referensi yang disukai klien", "Asks for references the client likes"),
        ],
        contoh: _(
          "Siap, terima kasih masukannya! Supaya revisinya tepat sasaran, boleh saya tanya sedikit?\n\n1. Bagian mana yang paling terasa kurang: warna, ukuran tulisan promo, atau fotonya?\n2. Saya bisa coba dua arah:\n   A. Lebih berani: warna kontras, tulisan diskon sangat besar\n   B. Lebih premium: banyak ruang kosong, foto produk lebih dominan\n3. Jika ada poster atau akun lain yang gayanya Kakak suka, boleh kirim contohnya.\n\nNanti saya kirim revisinya maksimal besok siang.",
          "Sure, thanks for the feedback! So the revision hits the mark, can I ask a couple of things?\n\n1. What feels most lacking: colours, the promo text size, or the photo?\n2. I can try two directions:\n   A. Bolder: high-contrast colours, a huge discount headline\n   B. More premium: lots of white space, a more dominant product photo\n3. If there's a poster or account whose style you like, please send an example.\n\nI'll send the revision by tomorrow noon at the latest.",
        ),
      },
    ],
  },

  "video-editor": {
    kuis: [
      {
        q: _("Untuk Reels atau TikTok, rasio aspek video yang tepat adalah...", "The right aspect ratio for Reels or TikTok is..."),
        o: [
          _("16:9", "16:9"),
          _("9:16", "9:16"),
          _("4:3", "4:3"),
          _("1:1 saja", "1:1 only"),
        ],
        a: 1,
        e: _("Video vertikal 9:16 memenuhi layar HP. Siapkan juga area aman agar teks tidak tertutup tombol aplikasi.", "Vertical 9:16 fills the phone screen. Keep a safe zone so text isn't covered by app buttons."),
      },
      {
        q: _("Banyak orang menonton video tanpa suara. Apa yang paling membantu?", "Many people watch without sound. What helps most?"),
        o: [
          _("Musik yang lebih keras", "Louder music"),
          _("Subtitle atau teks di layar yang mudah dibaca", "Readable subtitles or on-screen text"),
          _("Transisi lebih banyak", "More transitions"),
          _("Durasi lebih panjang", "Longer duration"),
        ],
        a: 1,
        e: _("Subtitle membuat pesan tetap tersampaikan tanpa suara dan membantu aksesibilitas.", "Subtitles keep the message clear without sound and improve accessibility."),
      },
      {
        q: _("Klien mengirim 2 jam rekaman mentah untuk dijadikan video 60 detik. Langkah pertama yang paling efisien?", "A client sends 2 hours of raw footage for a 60-second video. Most efficient first step?"),
        o: [
          _("Langsung menambah efek", "Add effects right away"),
          _("Menonton dan menandai bagian terbaik, lalu menyusun kerangka cerita sebelum menyunting detail", "Review and mark the best parts, then build a story outline before detailed editing"),
          _("Memotong secara acak", "Cut at random"),
          _("Meminta klien memilih semua klip", "Ask the client to pick every clip"),
        ],
        a: 1,
        e: _("Menandai klip (logging) dan membuat kerangka cerita menghemat banyak waktu di tahap penyuntingan.", "Logging clips and outlining the story saves a lot of editing time."),
      },
      {
        q: _("Kamu ingin memakai lagu yang sedang viral untuk video iklan klien. Apa yang perlu dicek?", "You want a viral song in a client's ad video. What should you check?"),
        o: [
          _("Tidak perlu dicek", "Nothing"),
          _("Lisensi musik untuk penggunaan komersial, atau pakai musik bebas royalti atau pustaka audio komersial platform", "Commercial music licensing, or use royalty-free or the platform's commercial library"),
          _("Hanya pakai bagian reff", "Use only the chorus"),
          _("Kecilkan volumenya", "Lower the volume"),
        ],
        a: 1,
        e: _("Musik populer biasanya tidak boleh dipakai di iklan tanpa lisensi. Video bisa dibisukan atau diturunkan.", "Popular music usually can't be used in ads without a licence. Videos may be muted or removed."),
      },
      {
        q: _("Calon klien meminta \"tes edit\" berupa video lengkap 3 menit untuk produknya, tanpa bayaran. Bagaimana menyikapinya?", "A prospect asks for an unpaid \"editing test\": a full 3-minute video for their product. How do you respond?"),
        o: [
          _("Kerjakan agar dapat proyek", "Do it to win the project"),
          _("Tunjukkan showreel atau tawarkan tes pendek 15 detik; video lengkap sebaiknya dibayar", "Share your showreel or offer a 15-second test; a full video should be paid"),
          _("Kirim video orang lain", "Send someone else's video"),
          _("Kerjakan dengan watermark besar tanpa bicara", "Do it with a big watermark without discussing"),
        ],
        a: 1,
        e: _("Tes yang wajar singkat. Video lengkap yang siap pakai adalah pekerjaan berbayar.", "Reasonable tests are short. A complete, usable video is paid work."),
      },
    ],
    tugas: [
      {
        judul: _("Susun rencana edit video 30 detik", "Plan a 30-second edit"),
        brief: _(
          "Kami kedai mi ayam. Kami punya rekaman: proses membuat mi, menuang kuah, pelanggan makan, tampak depan kedai, dan pemilik bercerita 5 menit. Tolong buat rencana edit Reels 30 detik untuk menarik pembeli baru.",
          "We run a chicken noodle stall. Footage: making noodles, pouring broth, customers eating, the shopfront, and the owner talking for 5 minutes. Please plan a 30-second Reel edit to attract new customers.",
        ),
        langkah: [
          _("Susun urutan klip per detik.", "Lay out clips by second."),
          _("Tentukan teks layar, musik, dan gaya potongan.", "Choose on-screen text, music, and cutting style."),
          _("Tulis ajakan di akhir video.", "Write the end call to action."),
        ],
        rubrik: [
          _("3 detik pertama memakai visual paling menggugah selera", "First 3 seconds use the most appetising visual"),
          _("Urutan membangun cerita, bukan acak", "Sequence builds a story, not random"),
          _("Kutipan pemilik dipakai singkat, tidak panjang", "Owner's quote is short, not long"),
          _("Ada teks layar untuk penonton tanpa suara", "On-screen text for sound-off viewers"),
          _("Ada ajakan dengan informasi lokasi", "Call to action includes location"),
        ],
        contoh: _(
          "0-3 dtk: close-up kuah panas dituang ke mangkuk, uap terlihat. Teks: \"Mi ayam yang bikin antre sejak 2009\"\n3-9 dtk: potongan cepat proses membuat mi (tarik, potong, rebus), mengikuti ketukan musik\n9-16 dtk: pemilik bicara 1 kalimat: \"Mi-nya kami buat sendiri setiap pagi.\" (subtitle)\n16-24 dtk: pelanggan makan, slow motion saat mi diangkat dengan sumpit\n24-30 dtk: tampak depan kedai. Teks: \"Jl. Kaliurang Km 5 · Buka 10.00 sampai 21.00\" + \"Simpan video ini untuk makan siang nanti\"\n\nMusik: akustik ceria bebas royalti. Potongan cepat di bagian proses, lebih lambat di bagian makan.",
          "0-3s: close-up of hot broth poured into a bowl, steam visible. Text: \"The noodles people have queued for since 2009\"\n3-9s: quick cuts of making noodles (pull, cut, boil), on the beat\n9-16s: owner says one line: \"We make our noodles fresh every morning.\" (subtitled)\n16-24s: customers eating, slow motion as noodles are lifted with chopsticks\n24-30s: shopfront. Text: \"Jl. Kaliurang Km 5 · Open 10 am to 9 pm\" + \"Save this for lunch\"\n\nMusic: upbeat royalty-free acoustic. Fast cuts on the process, slower on the eating.",
        ),
      },
      {
        judul: _("Ubah video panjang menjadi beberapa klip pendek", "Turn a long video into short clips"),
        brief: _(
          "Kami punya rekaman podcast 60 menit tentang tips wawancara kerja. Kami ingin 5 klip pendek untuk TikTok dan Reels. Bagaimana kamu memilih dan mengemas klipnya?",
          "We have a 60-minute podcast recording on job interview tips. We want 5 short clips for TikTok and Reels. How would you choose and package them?",
        ),
        langkah: [
          _("Jelaskan kriteria memilih momen yang layak jadi klip.", "Explain how you choose clip-worthy moments."),
          _("Tulis 5 ide judul klip beserta hook pembukanya.", "Write 5 clip titles with opening hooks."),
          _("Jelaskan format visual yang akan dipakai.", "Describe the visual format."),
        ],
        rubrik: [
          _("Kriteria jelas (satu ide utuh, ada pendapat kuat atau tips konkret)", "Clear criteria (one complete idea, strong opinion or concrete tip)"),
          _("Hook setiap klip langsung menarik", "Each clip's hook grabs attention"),
          _("Format visual cocok untuk layar vertikal", "Visual format suits vertical screens"),
          _("Menyebut subtitle", "Mentions subtitles"),
        ],
        contoh: _(
          "Kriteria: satu ide yang utuh dalam 30 sampai 60 detik, ada pendapat yang kuat atau tips yang bisa langsung dipraktikkan, dan kalimat pembuka yang bisa berdiri sendiri.\n\n5 klip:\n1. \"Jangan jawab 'kelemahan saya perfeksionis'\" → hook: \"Rekruter sudah bosan dengar jawaban ini.\"\n2. \"Cara menjawab ekspektasi gaji\" → hook: \"Jangan pernah jawab 'terserah'.\"\n3. \"Pertanyaan yang harus kamu ajukan di akhir interview\"\n4. \"Kesalahan 5 menit pertama interview online\"\n5. \"Cerita kandidat yang ditolak karena hal sepele\"\n\nFormat: vertikal 9:16, wajah pembicara di tengah dengan zoom pelan, subtitle besar dengan kata kunci berwarna, judul klip di atas selama 3 detik pertama.",
          "Criteria: one complete idea in 30 to 60 seconds, a strong opinion or an actionable tip, and an opening line that stands alone.\n\n5 clips:\n1. \"Don't say 'my weakness is perfectionism'\" → hook: \"Recruiters are tired of hearing this.\"\n2. \"How to answer salary expectations\" → hook: \"Never say 'whatever you offer'.\"\n3. \"The question you must ask at the end of an interview\"\n4. \"First-5-minutes mistakes in online interviews\"\n5. \"The candidate rejected over something tiny\"\n\nFormat: vertical 9:16, speaker centred with slow zoom, large subtitles with coloured keywords, clip title on top for the first 3 seconds.",
        ),
      },
    ],
  },

  "desain-logo-branding": {
    kuis: [
      {
        q: _("Mengapa logo sebaiknya dibuat dalam format vektor?", "Why should logos be made as vectors?"),
        o: [
          _("Agar warnanya lebih cerah", "So colours are brighter"),
          _("Agar tetap tajam di ukuran apa pun, dari ikon aplikasi sampai baliho", "So they stay sharp at any size, from app icons to billboards"),
          _("Agar file lebih besar", "So files are bigger"),
          _("Agar tidak bisa diedit", "So they can't be edited"),
        ],
        a: 1,
        e: _("Vektor berbasis bentuk matematis, bukan piksel, sehingga tidak pecah saat diperbesar.", "Vectors are based on mathematical shapes, not pixels, so they don't blur when scaled."),
      },
      {
        q: _("Uji apa yang penting dilakukan untuk logo sebelum diserahkan?", "Which test matters before delivering a logo?"),
        o: [
          _("Melihatnya hanya di ukuran besar", "Only view it large"),
          _("Mengecek di ukuran sangat kecil, versi satu warna, dan di latar terang maupun gelap", "Check it very small, in one colour, and on light and dark backgrounds"),
          _("Menambah efek bayangan", "Add drop shadows"),
          _("Menambah gradien sebanyak mungkin", "Add as many gradients as possible"),
        ],
        a: 1,
        e: _("Logo akan dipakai di banyak tempat: favicon, stempel, kaus. Logo yang baik tetap terbaca di semua kondisi.", "Logos appear everywhere: favicons, stamps, T-shirts. A good logo stays legible in all conditions."),
      },
      {
        q: _("Apa isi minimal brand guideline sederhana?", "What should a basic brand guideline include at minimum?"),
        o: [
          _("Hanya file logo", "Just the logo file"),
          _("Variasi logo, area aman, warna dengan kode, font, dan contoh penggunaan yang benar dan salah", "Logo variations, clear space, colour codes, fonts, and do's and don'ts"),
          _("Sejarah perusahaan", "Company history"),
          _("Daftar harga produk", "Product price list"),
        ],
        a: 1,
        e: _("Brand guideline membantu klien dan tim lain memakai identitas visual secara konsisten.", "A brand guideline helps the client and others use the identity consistently."),
      },
      {
        q: _("Klien menyukai logo brand terkenal dan meminta logonya \"dibuat mirip, cuma ganti nama\". Respons yang tepat?", "A client loves a famous brand's logo and wants theirs \"just like it, with a different name\". Right response?"),
        o: [
          _("Buat persis sama", "Make it identical"),
          _("Jelaskan risiko pelanggaran merek, lalu gali apa yang mereka sukai dari logo itu untuk diterjemahkan ke desain orisinal", "Explain the trademark risk, then find what they like about it and translate that into an original design"),
          _("Ubah warnanya saja", "Just change the colour"),
          _("Tolak proyeknya", "Refuse the project"),
        ],
        a: 1,
        e: _("Logo yang mirip merek lain bisa ditolak saat pendaftaran merek atau digugat. Yang klien sukai biasanya adalah kesannya.", "Look-alike logos can be refused trademark registration or challenged. What clients like is usually the feel."),
      },
      {
        q: _("Setelah proyek selesai dan lunas, file apa yang biasanya diserahkan ke klien?", "After the project is complete and paid, which files do you usually deliver?"),
        o: [
          _("Hanya JPG kecil", "Just a small JPG"),
          _("File vektor (AI, SVG, atau PDF), PNG transparan berbagai ukuran, serta brand guideline", "Vector files (AI, SVG, or PDF), transparent PNGs in several sizes, and the brand guideline"),
          _("Tangkapan layar", "Screenshots"),
          _("File Word", "Word files"),
        ],
        a: 1,
        e: _("Paket file lengkap membuat klien bisa memakai logonya di mana saja tanpa harus kembali kepadamu.", "A complete file package lets the client use the logo anywhere without coming back to you."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis creative brief dari wawancara klien", "Write a creative brief from a client interview"),
        brief: _(
          "Catatan dari klien: \"Saya membuka bengkel motor khusus perempuan di Bekasi. Mekaniknya juga perempuan. Saya ingin pelanggan merasa aman, nyaman, dan tidak dibohongi soal harga. Nama bengkelnya 'Rida Motor'. Saya tidak mau warna pink karena terlalu klise.\"",
          "Client notes: \"I'm opening a motorbike workshop for women in Bekasi. The mechanics are women too. I want customers to feel safe, comfortable, and not cheated on price. The workshop is called 'Rida Motor'. I don't want pink, it's too cliché.\"",
        ),
        langkah: [
          _("Tulis creative brief: target, nilai merek, kesan yang dituju, dan batasan.", "Write a creative brief: audience, brand values, desired impression, and constraints."),
          _("Usulkan 2 arah konsep logo.", "Propose 2 logo concept directions."),
          _("Usulkan palet warna awal dengan alasannya.", "Suggest an initial palette with reasons."),
        ],
        rubrik: [
          _("Nilai merek ditarik dari kata-kata klien (aman, nyaman, jujur)", "Brand values drawn from the client's words (safe, comfortable, honest)"),
          _("Batasan klien (tanpa pink) dihormati", "Respects the constraint (no pink)"),
          _("Dua arah konsep benar-benar berbeda", "Two concept directions genuinely differ"),
          _("Palet warna punya alasan yang sesuai nilai merek", "Palette reasoning ties to brand values"),
        ],
        contoh: _(
          "Creative brief: Rida Motor\nTarget: perempuan pengendara motor di Bekasi, 20 sampai 45 tahun, yang pernah merasa tidak nyaman atau dibohongi di bengkel.\nNilai merek: aman, jujur, kompeten, ramah.\nKesan: profesional dan bisa dipercaya, bukan imut.\nBatasan: tanpa pink; harus terbaca jelas di papan nama dan seragam.\n\nArah konsep:\n1. Monogram \"R\" yang dibentuk dari kunci pas dan lengkung roda: menonjolkan keahlian teknis\n2. Perisai sederhana dengan huruf R di tengah: menonjolkan rasa aman dan kepercayaan\n\nPalet awal: biru tua #1F3A5F (kepercayaan dan profesional), oranye hangat #F28C38 (ramah dan mudah terlihat), abu muda #EEF1F4 (latar bersih).",
          "Creative brief: Rida Motor\nAudience: women riders in Bekasi, 20 to 45, who've felt uncomfortable or cheated at workshops.\nBrand values: safe, honest, competent, welcoming.\nImpression: professional and trustworthy, not cute.\nConstraints: no pink; must read clearly on signage and uniforms.\n\nConcept directions:\n1. An \"R\" monogram formed from a spanner and a wheel curve: highlights technical skill\n2. A simple shield with an R in the centre: highlights safety and trust\n\nInitial palette: navy #1F3A5F (trust, professional), warm orange #F28C38 (friendly, visible), light grey #EEF1F4 (clean background).",
        ),
      },
      {
        judul: _("Presentasikan logo kepada klien", "Present a logo to the client"),
        brief: _(
          "Kamu sudah membuat logo Rida Motor dengan konsep perisai. Tulis teks presentasi singkat yang akan menyertai mockup logo saat dikirim ke klien. Jika kamu sudah membuat desainnya, tempel juga tautannya.",
          "You've designed the Rida Motor logo with the shield concept. Write the short presentation text to accompany the logo mockups sent to the client. If you've made the design, paste the link too.",
        ),
        langkah: [
          _("Jelaskan makna bentuk, warna, dan huruf.", "Explain the meaning of shape, colour, and type."),
          _("Tunjukkan contoh penerapan yang akan dilihat klien.", "List the application mockups the client will see."),
          _("Tulis langkah berikutnya dan batas revisi.", "Write next steps and revision limits."),
        ],
        rubrik: [
          _("Penjelasan menghubungkan desain dengan nilai merek", "Explanation links design to brand values"),
          _("Menyebut penerapan nyata (papan nama, seragam, nota)", "Mentions real applications (signage, uniforms, receipts)"),
          _("Bahasa mudah dipahami klien awam", "Plain language for a non-designer client"),
          _("Ada langkah berikutnya yang jelas", "Clear next steps"),
        ],
        contoh: _(
          "Logo Rida Motor: konsep Perisai\n\nBentuk perisai mewakili rasa aman yang ingin Ibu berikan kepada pelanggan. Di dalamnya, huruf R dibuat tegas dengan ujung yang membulat: kuat dan kompeten, tetapi tetap ramah.\n\nWarna biru tua dipilih untuk kesan profesional dan dapat dipercaya. Oranye dipakai sebagai aksen agar papan nama mudah terlihat dari jalan.\n\nPada lampiran, Ibu bisa melihat logo di papan nama bengkel, seragam mekanik, stiker motor, dan nota servis.\n\nLangkah berikutnya: mohon beri masukan paling lambat Jumat. Paket ini termasuk 2 kali revisi. Setelah disetujui, saya kirim file lengkap dan panduan penggunaan logo.",
          "Rida Motor logo: Shield concept\n\nThe shield represents the safety you want customers to feel. Inside, a bold R with rounded ends: strong and competent, but still welcoming.\n\nNavy was chosen to feel professional and trustworthy. Orange is the accent so the sign stands out from the street.\n\nIn the attachments you'll see the logo on the workshop sign, mechanic uniforms, bike stickers, and service receipts.\n\nNext steps: please send feedback by Friday. This package includes 2 revision rounds. Once approved, I'll send the full files and a logo usage guide.",
        ),
      },
    ],
  },

  ilustrator: {
    kuis: [
      {
        q: _("Klien ingin ilustrasimu dipakai untuk kaus yang akan dijual. Apa yang perlu dibahas?", "A client wants your illustration on T-shirts for sale. What needs discussing?"),
        o: [
          _("Tidak ada, sama saja dengan pemakaian biasa", "Nothing, it's normal use"),
          _("Lisensi penggunaan komersial atau merchandise, yang biasanya dikenai biaya tambahan", "Commercial or merchandise licensing, which usually costs extra"),
          _("Warna tinta kaus", "Shirt ink colour"),
          _("Ukuran kaus", "Shirt sizes"),
        ],
        a: 1,
        e: _("Hak penggunaan menentukan nilai ilustrasi. Penggunaan untuk produk yang dijual biasanya lebih mahal.", "Usage rights determine an illustration's value. Use on products for sale usually costs more."),
      },
      {
        q: _("Cara terbaik menunjukkan konsistensi kepada calon klien yang mencari desainer maskot?", "Best way to show consistency to a client looking for a mascot designer?"),
        o: [
          _("Portofolio berisi gaya yang sangat beragam", "A portfolio of very varied styles"),
          _("Satu karakter dalam beberapa pose dan ekspresi (character sheet)", "One character in several poses and expressions (a character sheet)"),
          _("Satu gambar besar saja", "One large drawing"),
          _("Daftar software yang dikuasai", "A list of software you know"),
        ],
        a: 1,
        e: _("Maskot harus terlihat sama di berbagai situasi. Character sheet membuktikan kamu bisa menjaganya.", "Mascots must look the same in many situations. A character sheet proves you can do that."),
      },
      {
        q: _("Kapan sebaiknya klien menyetujui sketsa?", "When should a client approve the sketch?"),
        o: [
          _("Setelah ilustrasi selesai diwarnai", "After full colouring"),
          _("Sebelum masuk tahap pewarnaan dan detail, agar revisi besar tidak terjadi di akhir", "Before colouring and detail, so major revisions don't happen at the end"),
          _("Tidak perlu persetujuan", "No approval needed"),
          _("Setelah dicetak", "After printing"),
        ],
        a: 1,
        e: _("Persetujuan bertahap (sketsa, warna dasar, final) menghemat waktu kedua pihak.", "Staged approvals (sketch, flats, final) save time for both sides."),
      },
      {
        q: _("Klien meminta ilustrasi \"dengan gaya persis seperti studio animasi terkenal\" dan memakai karakter mereka untuk produk. Respons yang tepat?", "A client wants artwork \"exactly in a famous studio's style\" using their characters for products. Right response?"),
        o: [
          _("Gambar karakternya", "Draw the characters"),
          _("Tolak memakai karakter berhak cipta, lalu tawarkan karakter orisinal yang terinspirasi suasana yang mereka sukai", "Decline copyrighted characters and offer original characters inspired by the mood they like"),
          _("Gambar dengan warna berbeda", "Draw them in different colours"),
          _("Gambar tanpa mencantumkan nama", "Draw them anonymously"),
        ],
        a: 1,
        e: _("Karakter milik pihak lain dilindungi hak cipta dan merek. Karakter orisinal juga lebih bernilai bagi brand klien.", "Others' characters are protected by copyright and trademark. Original characters are also worth more to the client's brand."),
      },
      {
        q: _("Kamu mengirim file final sebelum klien membayar, lalu klien menghilang. Cara mencegahnya di proyek berikutnya?", "You sent final files before payment and the client vanished. How to prevent this next time?"),
        o: [
          _("Kirim file final lebih cepat", "Send finals sooner"),
          _("Minta uang muka (misalnya 50%) dan kirim file resolusi tinggi tanpa watermark setelah pelunasan", "Ask for a deposit (e.g. 50%) and send full-res unwatermarked files after final payment"),
          _("Tidak usah bekerja dengan klien baru", "Never work with new clients"),
          _("Kirim file lewat chat saja", "Send files only via chat"),
        ],
        a: 1,
        e: _("Uang muka dan pratinjau beresolusi rendah dengan watermark adalah praktik umum untuk melindungi ilustrator.", "Deposits and low-res watermarked previews are standard ways to protect illustrators."),
      },
    ],
    tugas: [
      {
        judul: _("Rancang karakter maskot", "Design a mascot character"),
        brief: _(
          "Kami aplikasi belajar matematika untuk anak SD. Kami ingin maskot yang ramah, cerdas, dan tidak menakutkan, yang akan muncul di aplikasi, stiker, dan buku latihan.",
          "We're a maths learning app for primary school kids. We want a friendly, clever, non-scary mascot that will appear in the app, stickers, and workbooks.",
        ),
        langkah: [
          _("Deskripsikan konsep karakter: bentuk, nama, kepribadian.", "Describe the character concept: form, name, personality."),
          _("Tentukan 4 ekspresi atau pose yang dibutuhkan beserta kegunaannya.", "List 4 expressions or poses needed and their uses."),
          _("Jelaskan pertimbangan agar maskot mudah digambar ulang. Jika sudah membuat sketsa, tempel tautannya.", "Explain how you'll keep it easy to redraw. If you've sketched it, paste the link."),
        ],
        rubrik: [
          _("Konsep sesuai target anak SD dan pelajaran matematika", "Concept suits primary kids and maths"),
          _("Kepribadian jelas dan mendukung pembelajaran", "Clear personality that supports learning"),
          _("Ekspresi dan pose terkait situasi nyata di aplikasi", "Expressions and poses tied to real app situations"),
          _("Bentuk sederhana, mudah dikenali di ukuran kecil", "Simple shapes, recognisable small"),
        ],
        contoh: _(
          "Konsep: \"Kiko\", burung hantu kecil berbentuk bulat dengan bulu berpola kotak-kotak seperti kertas berpetak. Kacamatanya berbentuk tanda tambah dan kurang yang lucu.\n\nKepribadian: penasaran, sabar, suka memberi semangat. Tidak pernah menertawakan jawaban yang salah.\n\nEkspresi dan pose:\n1. Melambai: layar sambutan\n2. Berpikir dengan sayap di dagu: saat soal sedang dikerjakan\n3. Bertepuk sayap dan melompat: jawaban benar\n4. Tersenyum sambil menunjuk petunjuk: jawaban salah, mengajak mencoba lagi\n\nAgar mudah digambar ulang: badan dari satu lingkaran besar, maksimal 4 warna, garis tebal yang konsisten, dan tanpa detail kecil yang hilang di ukuran stiker.",
          "Concept: \"Kiko\", a small round owl with feathers patterned like grid paper. Its glasses are playful plus and minus signs.\n\nPersonality: curious, patient, encouraging. Never laughs at wrong answers.\n\nExpressions and poses:\n1. Waving: welcome screen\n2. Thinking with a wing on its chin: while a question is being solved\n3. Clapping wings and jumping: correct answer\n4. Smiling and pointing at a hint: wrong answer, encouraging another try\n\nEasy to redraw: body from one big circle, max 4 colours, consistent thick lines, and no tiny details that vanish at sticker size.",
        ),
      },
      {
        judul: _("Susun penawaran harga ilustrasi", "Write an illustration quote"),
        brief: _(
          "Penerbit kecil meminta 12 ilustrasi isi untuk buku cerita anak, ukuran setengah halaman, berwarna. Bukunya akan dijual di toko buku. Tolong buat penawaran.",
          "A small publisher wants 12 interior illustrations for a children's storybook, half-page, full colour. The book will be sold in bookstores. Please write a quote.",
        ),
        langkah: [
          _("Tentukan rincian pekerjaan dan tahapannya.", "Define the work and its stages."),
          _("Jelaskan hak penggunaan yang termasuk.", "Explain the usage rights included."),
          _("Tulis ketentuan pembayaran, revisi, dan jadwal.", "Set payment, revision, and timeline terms."),
        ],
        rubrik: [
          _("Tahapan jelas (sketsa, warna, final)", "Clear stages (sketch, colour, final)"),
          _("Hak penggunaan disebut spesifik (buku cetak dan digital, tidak termasuk merchandise)", "Rights are specific (print and digital book, excluding merchandise)"),
          _("Ada uang muka", "Includes a deposit"),
          _("Batas revisi per tahap", "Revision limits per stage"),
          _("Jadwal realistis", "Realistic timeline"),
        ],
        contoh: _(
          "Penawaran: 12 ilustrasi isi buku anak\n\nPekerjaan: 12 ilustrasi setengah halaman, berwarna penuh, resolusi 300 dpi siap cetak.\n\nTahapan:\n1. Sketsa semua halaman (minggu 1 sampai 2), 1 kali revisi\n2. Warna dasar (minggu 3 sampai 4), 1 kali revisi\n3. Final dan detail (minggu 5 sampai 6)\n\nHak penggunaan: untuk buku ini dalam bentuk cetak dan e-book, termasuk promosi buku. Tidak termasuk merchandise, animasi, atau buku lain; dapat dibicarakan terpisah. Ilustrator boleh menampilkan karya di portofolio setelah buku terbit.\n\nPembayaran: 50% uang muka sebelum mulai, 50% sebelum file final dikirim.\nRevisi tambahan di luar ketentuan dikenai biaya per ilustrasi.",
          "Quote: 12 children's book interior illustrations\n\nWork: 12 half-page full-colour illustrations, 300 dpi print-ready.\n\nStages:\n1. Sketches for all pages (weeks 1 to 2), 1 revision round\n2. Flat colours (weeks 3 to 4), 1 revision round\n3. Final rendering (weeks 5 to 6)\n\nUsage rights: for this book in print and e-book, including book promotion. Excludes merchandise, animation, or other books; can be discussed separately. The illustrator may show the work in their portfolio after publication.\n\nPayment: 50% deposit before starting, 50% before final files are delivered.\nExtra revisions beyond these terms are charged per illustration.",
        ),
      },
    ],
  },

  "desain-presentasi": {
    kuis: [
      {
        q: _("Satu slide berisi 9 poin teks panjang. Perbaikan terbaik?", "One slide has 9 long bullet points. Best fix?"),
        o: [
          _("Kecilkan font agar muat", "Shrink the font to fit"),
          _("Ambil satu pesan utama per slide, pindahkan detail ke catatan pembicara atau slide lain", "Keep one main message per slide; move details to speaker notes or other slides"),
          _("Tambahkan animasi untuk setiap poin", "Animate every bullet"),
          _("Ubah semua teks menjadi huruf kapital", "Make it all caps"),
        ],
        a: 1,
        e: _("Penonton membaca atau mendengar, sulit melakukan keduanya sekaligus. Satu pesan per slide membuat presentasi lebih kuat.", "Audiences read or listen, rarely both. One message per slide makes the deck stronger."),
      },
      {
        q: _("Data perbandingan pendapatan 4 tahun paling baik ditampilkan sebagai...", "Four years of revenue comparison is best shown as..."),
        o: [
          _("Tabel penuh angka", "A full table of numbers"),
          _("Grafik batang sederhana dengan satu angka penting yang ditonjolkan", "A simple bar chart with one key number highlighted"),
          _("Grafik 3D berputar", "A rotating 3D chart"),
          _("Paragraf teks", "A paragraph of text"),
        ],
        a: 1,
        e: _("Grafik sederhana dengan penekanan pada satu angka membuat penonton langsung menangkap intinya.", "A simple chart emphasising one number lets the audience grasp the point instantly."),
      },
      {
        q: _("Urutan umum pitch deck untuk investor dimulai dari...", "A typical investor pitch deck starts with..."),
        o: [
          _("Laporan keuangan detail", "Detailed financial statements"),
          _("Masalah yang diselesaikan, lalu solusinya", "The problem being solved, then the solution"),
          _("Daftar semua karyawan", "A list of all employees"),
          _("Ucapan terima kasih", "A thank-you"),
        ],
        a: 1,
        e: _("Investor perlu tahu dulu masalah yang cukup besar dan nyata sebelum peduli pada solusi dan angka.", "Investors need a big, real problem before they care about the solution and numbers."),
      },
      {
        q: _("Mengapa sebaiknya memakai slide master saat membuat template presentasi perusahaan?", "Why use slide masters when building a company template?"),
        o: [
          _("Agar file lebih berat", "To make files heavier"),
          _("Agar font, warna, dan tata letak konsisten dan mudah dipakai tim lain", "So fonts, colours, and layouts stay consistent and easy for others to use"),
          _("Agar tidak bisa diedit", "So it can't be edited"),
          _("Agar terlihat rumit", "To look complex"),
        ],
        a: 1,
        e: _("Slide master membuat template tetap rapi walaupun dipakai banyak orang.", "Slide masters keep a template tidy even when many people use it."),
      },
      {
        q: _("Klien meminta tambahan 25 slide di luar kesepakatan 15 slide, tetapi menolak biaya tambahan. Respons yang tepat?", "The client wants 25 more slides beyond the agreed 15 but refuses extra fees. Right response?"),
        o: [
          _("Kerjakan gratis", "Do it for free"),
          _("Jelaskan cakupan awal, tawarkan harga per slide tambahan, atau bantu memprioritaskan slide yang paling penting dalam anggaran", "Explain the original scope, offer a per-slide rate, or help prioritise the most important slides within budget"),
          _("Hentikan proyek tanpa penjelasan", "End the project without explanation"),
          _("Kerjakan dengan kualitas rendah", "Do it at low quality"),
        ],
        a: 1,
        e: _("Memberi pilihan menjaga hubungan baik tanpa mengorbankan nilai pekerjaanmu.", "Offering options keeps the relationship healthy without undervaluing your work."),
      },
    ],
    tugas: [
      {
        judul: _("Rombak slide yang terlalu padat", "Redesign an overloaded slide"),
        brief: _(
          "Slide kami berjudul \"Pencapaian 2024\" dan berisi: pendapatan naik dari Rp4,2 M ke Rp6,1 M; pelanggan baru 1.240; buka 3 kota baru (Medan, Makassar, Balikpapan); tingkat retensi 87%; karyawan dari 45 menjadi 68 orang; penghargaan Startup Pilihan 2024. Semuanya dalam satu slide berisi poin-poin panjang.",
          "Our slide titled \"2024 Achievements\" contains: revenue up from Rp4.2bn to Rp6.1bn; 1,240 new customers; 3 new cities (Medan, Makassar, Balikpapan); 87% retention; staff from 45 to 68; Startup of the Year 2024 award. All on one slide in long bullet points.",
        ),
        langkah: [
          _("Tentukan pesan utama slide dan judul yang lebih kuat.", "Choose the slide's main message and a stronger title."),
          _("Jelaskan tata letak baru (apa yang besar, apa yang kecil).", "Describe the new layout (what's big, what's small)."),
          _("Tentukan informasi yang dipindah atau dihapus. Jika sudah membuatnya, tempel tautan desainmu.", "Decide what to move or drop. If you've built it, paste the design link."),
        ],
        rubrik: [
          _("Judul berupa pesan, bukan sekadar topik", "Title states a message, not just a topic"),
          _("Ada satu angka yang paling ditonjolkan", "One number is emphasised most"),
          _("Informasi dikelompokkan dan disederhanakan", "Information is grouped and simplified"),
          _("Persentase pertumbuhan dihitung benar (sekitar 45%)", "Growth percentage correct (about 45%)"),
          _("Ada keputusan jelas tentang informasi yang dipindah", "Clear decision on what moves elsewhere"),
        ],
        contoh: _(
          "Judul baru: \"2024: pendapatan tumbuh 45% dan kami hadir di 3 kota baru\"\n\nTata letak:\n• Kiri, besar: \"+45%\" dengan keterangan kecil \"Rp4,2 M → Rp6,1 M\"\n• Kanan: tiga kartu kecil berikon, yaitu 1.240 pelanggan baru, retensi 87%, dan 3 kota baru\n• Peta kecil Indonesia dengan titik Medan, Makassar, dan Balikpapan di bawah kartu\n\nDipindah: pertumbuhan karyawan ke slide \"Tim\"; penghargaan menjadi lencana kecil di pojok atau masuk slide penutup.\n\nAlasannya: pendapatan adalah hal yang paling ingin diketahui penonton, jadi angka itu yang paling besar.",
          "New title: \"2024: revenue grew 45% and we launched in 3 new cities\"\n\nLayout:\n• Left, large: \"+45%\" with a small caption \"Rp4.2bn → Rp6.1bn\"\n• Right: three small icon cards: 1,240 new customers, 87% retention, 3 new cities\n• A small Indonesia map with dots on Medan, Makassar, and Balikpapan below the cards\n\nMoved: staff growth to the \"Team\" slide; the award becomes a small badge in the corner or goes to the closing slide.\n\nReasoning: revenue is what the audience most wants to know, so that number is largest.",
        ),
      },
      {
        judul: _("Susun alur pitch deck 10 slide", "Outline a 10-slide pitch deck"),
        brief: _(
          "Kami startup yang menghubungkan petani sayur di Lembang dengan restoran di Bandung, sehingga restoran mendapat sayur segar dan petani mendapat harga lebih baik tanpa tengkulak. Kami mencari pendanaan awal. Tolong susun alur 10 slide.",
          "We're a startup connecting vegetable farmers in Lembang with restaurants in Bandung, so restaurants get fresh produce and farmers get better prices without middlemen. We're raising early funding. Please outline 10 slides.",
        ),
        langkah: [
          _("Tulis judul dan isi utama setiap slide.", "Write each slide's title and key content."),
          _("Tandai slide yang membutuhkan data dari klien.", "Mark slides that need data from the client."),
          _("Tentukan satu visual penting untuk slide masalah.", "Choose one key visual for the problem slide."),
        ],
        rubrik: [
          _("Urutan logis: masalah, solusi, pasar, model bisnis, traksi, tim, kebutuhan dana", "Logical order: problem, solution, market, business model, traction, team, ask"),
          _("Masalah dijelaskan dari dua sisi (petani dan restoran)", "Problem covers both sides (farmers and restaurants)"),
          _("Data yang belum ada ditandai, tidak dikarang", "Missing data is flagged, not invented"),
          _("Visual masalah relevan dan mudah dipahami", "Problem visual is relevant and clear"),
        ],
        contoh: _(
          "1. Judul: nama, tagline, satu kalimat tentang apa yang dilakukan\n2. Masalah: petani menerima harga rendah dari tengkulak, restoran sulit mendapat sayur segar yang konsisten [data selisih harga: perlu dari klien]\n3. Solusi: platform pemesanan langsung dari petani ke restoran dengan pengiriman pagi\n4. Cara kerja: alur 3 langkah, dari petani panen, pesanan restoran, sampai pengiriman\n5. Pasar: jumlah restoran di Bandung dan nilai belanja sayur [perlu data]\n6. Model bisnis: komisi per transaksi atau biaya berlangganan\n7. Traksi: jumlah petani, restoran, dan transaksi bulanan [perlu data]\n8. Pesaing: perbandingan dengan tengkulak dan pasar induk\n9. Tim: pendiri dan pengalaman relevan\n10. Kebutuhan dana: jumlah, penggunaan, dan target 12 bulan\n\nVisual slide 2: diagram rantai pasok, petani → 2 sampai 3 perantara → restoran, dengan harga di setiap titik, dibandingkan dengan jalur langsung.",
          "1. Title: name, tagline, one sentence on what you do\n2. Problem: farmers get low prices from middlemen, restaurants struggle to get consistently fresh produce [price gap data: needed from client]\n3. Solution: direct ordering from farmers to restaurants with morning delivery\n4. How it works: 3-step flow from harvest, restaurant order, to delivery\n5. Market: number of Bandung restaurants and vegetable spend [data needed]\n6. Business model: commission per transaction or subscription\n7. Traction: farmers, restaurants, and monthly transactions [data needed]\n8. Competition: compared with middlemen and wholesale markets\n9. Team: founders and relevant experience\n10. The ask: amount, use of funds, and 12-month targets\n\nSlide 2 visual: a supply chain diagram, farmer → 2 to 3 intermediaries → restaurant, with prices at each step, compared with the direct route.",
        ),
      },
    ],
  },

  "motion-graphics": {
    kuis: [
      {
        q: _("Mengapa animasi dengan easing terasa lebih alami daripada gerakan linear?", "Why does eased animation feel more natural than linear motion?"),
        o: [
          _("Karena lebih cepat dirender", "It renders faster"),
          _("Karena benda di dunia nyata mempercepat dan melambat, tidak bergerak dengan kecepatan tetap", "Real objects speed up and slow down rather than moving at constant speed"),
          _("Karena file lebih kecil", "Smaller files"),
          _("Karena warnanya berubah", "The colours change"),
        ],
        a: 1,
        e: _("Easing meniru percepatan dan perlambatan alami. Ini salah satu prinsip dasar animasi.", "Easing mimics natural acceleration and deceleration. It's a core animation principle."),
      },
      {
        q: _("Klien ingin video penjelasan produk 60 detik. Apa yang sebaiknya disepakati sebelum mulai menganimasikan?", "A client wants a 60-second explainer. What should be agreed before animating?"),
        o: [
          _("Tidak perlu, langsung animasikan", "Nothing, just animate"),
          _("Naskah, voice over, dan storyboard", "The script, voiceover, and storyboard"),
          _("Hanya warna", "Just colours"),
          _("Nama file", "File names"),
        ],
        a: 1,
        e: _("Mengubah naskah setelah animasi selesai sangat mahal. Kunci naskah dan storyboard lebih dulu.", "Changing the script after animating is costly. Lock the script and storyboard first."),
      },
      {
        q: _("Animasi logo untuk intro video sebaiknya berdurasi...", "A logo animation for a video intro should last..."),
        o: [
          _("Sekitar 2 sampai 5 detik", "About 2 to 5 seconds"),
          _("30 detik", "30 seconds"),
          _("1 menit", "1 minute"),
          _("Sepanjang mungkin", "As long as possible"),
        ],
        a: 0,
        e: _("Intro yang terlalu panjang membuat penonton pergi sebelum isi dimulai.", "Overly long intros make viewers leave before the content starts."),
      },
      {
        q: _("Untuk animasi ringan di website atau aplikasi, format apa yang sering dipakai?", "Which format is common for lightweight animation on websites or apps?"),
        o: [
          _("Video 4K", "4K video"),
          _("Lottie (JSON)", "Lottie (JSON)"),
          _("File PSD", "PSD files"),
          _("GIF berukuran besar", "Large GIFs"),
        ],
        a: 1,
        e: _("Lottie berbasis vektor, ringan, dan tetap tajam di berbagai ukuran layar.", "Lottie is vector-based, lightweight, and stays sharp at any screen size."),
      },
      {
        q: _("Klien meminta file proyek After Effects lengkap setelah proyek selesai, padahal tidak disepakati sebelumnya. Respons yang tepat?", "After the project, the client asks for the full After Effects project files, which weren't agreed. Right response?"),
        o: [
          _("Langsung kirim semuanya gratis", "Send everything free"),
          _("Jelaskan bahwa file proyek tidak termasuk paket awal dan tawarkan dengan biaya tambahan", "Explain project files weren't included and offer them for an extra fee"),
          _("Hapus file proyek", "Delete the project files"),
          _("Abaikan permintaannya", "Ignore the request"),
        ],
        a: 1,
        e: _("File proyek berisi kerja dan aset yang bernilai. Sebaiknya disebut jelas dalam penawaran sejak awal.", "Project files contain valuable work and assets. State this clearly in your quote from the start."),
      },
    ],
    tugas: [
      {
        judul: _("Buat storyboard video penjelasan", "Storyboard an explainer video"),
        brief: _(
          "Kami aplikasi pembayaran tagihan (listrik, air, BPJS) dalam satu tempat. Kami ingin video animasi 30 detik untuk iklan. Pesan utama: bayar semua tagihan dalam 1 menit, tidak perlu antre.",
          "We're a bill payment app (electricity, water, health insurance) in one place. We want a 30-second animated ad. Key message: pay all bills in 1 minute, no queues.",
        ),
        langkah: [
          _("Tulis naskah voice over singkat.", "Write a short voiceover script."),
          _("Buat storyboard per adegan dengan durasi dan gambaran visualnya.", "Storyboard each scene with duration and visuals."),
          _("Tentukan gaya animasi dan musik.", "Choose the animation style and music."),
        ],
        rubrik: [
          _("Ada masalah, solusi, dan ajakan dalam 30 detik", "Problem, solution, and CTA within 30 seconds"),
          _("Durasi adegan dijumlahkan sekitar 30 detik", "Scene durations add up to about 30 seconds"),
          _("Visual menjelaskan pesan tanpa terlalu banyak teks", "Visuals carry the message without too much text"),
          _("Naskah voice over cukup pendek untuk 30 detik", "Voiceover is short enough for 30 seconds"),
        ],
        contoh: _(
          "Naskah: \"Antre bayar listrik, air, dan BPJS di tiga tempat? Sekarang cukup satu aplikasi. Pilih tagihan, bayar, selesai. Kurang dari satu menit. Unduh [nama aplikasi] sekarang.\"\n\nStoryboard:\n1. (0-5 dtk) Karakter berdiri di antrean panjang, jam dinding berputar cepat\n2. (5-10 dtk) Tiga ikon tagihan melayang di sekitar kepala karakter, ekspresi pusing\n3. (10-18 dtk) HP muncul, ketiga ikon masuk ke layar aplikasi, centang hijau satu per satu\n4. (18-24 dtk) Teks besar \"< 1 menit\" dengan stopwatch, karakter tersenyum lega\n5. (24-30 dtk) Logo aplikasi, tombol unduh, dan tagline\n\nGaya: flat 2D dengan warna merek, gerakan lentur (squash and stretch) ringan. Musik: elektronik ceria bebas royalti.",
          "Script: \"Queuing to pay electricity, water, and health insurance in three places? Now it's one app. Pick your bill, pay, done. Under a minute. Download [app name] now.\"\n\nStoryboard:\n1. (0-5s) A character stands in a long queue, the wall clock spins fast\n2. (5-10s) Three bill icons float around the character's head, dizzy expression\n3. (10-18s) A phone appears, the icons fly into the app, green ticks one by one\n4. (18-24s) Big \"< 1 minute\" text with a stopwatch, the character smiles in relief\n5. (24-30s) App logo, download button, and tagline\n\nStyle: flat 2D in brand colours, light squash and stretch. Music: upbeat royalty-free electronic.",
        ),
      },
      {
        judul: _("Tulis penawaran untuk animasi logo", "Write a logo animation quote"),
        brief: _(
          "Sebuah kanal YouTube kuliner meminta animasi logo untuk intro dan outro video mereka. Tolong buat penawaran yang jelas.",
          "A food YouTube channel wants logo animations for their video intro and outro. Please write a clear quote.",
        ),
        langkah: [
          _("Tentukan apa saja yang dikerjakan dan durasinya.", "Define deliverables and durations."),
          _("Tentukan format file yang diserahkan.", "Specify delivery file formats."),
          _("Tulis tahapan, revisi, dan hal yang tidak termasuk.", "Write stages, revisions, and exclusions."),
        ],
        rubrik: [
          _("Durasi intro dan outro jelas dan wajar", "Intro and outro durations clear and reasonable"),
          _("Format file sesuai kebutuhan YouTube (MP4, versi transparan jika perlu)", "Formats suit YouTube (MP4, transparent version if needed)"),
          _("Ada tahapan persetujuan konsep", "Includes concept approval stage"),
          _("Menyebut file proyek dan musik secara jelas", "Clearly addresses project files and music"),
        ],
        contoh: _(
          "Penawaran animasi logo\n\nPekerjaan:\n• Intro 4 detik: logo muncul dengan animasi bertema dapur (uap, sendok berputar)\n• Outro 10 detik: logo, tombol subscribe, dan 2 area untuk video rekomendasi\n\nFile: MP4 1080p dan 4K, serta versi MOV dengan latar transparan untuk ditumpuk di atas video.\n\nTahapan:\n1. 2 konsep gerak berupa sketsa atau animasi kasar, pilih satu\n2. Animasi penuh, 2 kali revisi\n3. Penambahan efek suara dan ekspor final\n\nMusik dan efek suara: dari pustaka bebas royalti dengan lisensi komersial.\nTidak termasuk: file proyek After Effects (bisa ditambah dengan biaya terpisah) dan pembuatan ulang logo.",
          "Logo animation quote\n\nDeliverables:\n• 4-second intro: logo appears with kitchen-themed animation (steam, spinning spoon)\n• 10-second outro: logo, subscribe button, and 2 areas for recommended videos\n\nFiles: MP4 in 1080p and 4K, plus MOV with transparent background for overlaying.\n\nStages:\n1. 2 motion concepts as sketches or rough animatics, pick one\n2. Full animation, 2 revision rounds\n3. Sound effects and final export\n\nMusic and SFX: royalty-free library with a commercial licence.\nExcluded: After Effects project files (available for an extra fee) and logo redesign.",
        ),
      },
    ],
  },

  "voice-over-audio": {
    kuis: [
      {
        q: _("Rekaman voice over-mu terdengar bergema. Solusi murah yang paling efektif?", "Your voiceover sounds echoey. Cheapest effective fix?"),
        o: [
          _("Merekam di kamar mandi", "Record in the bathroom"),
          _("Merekam di dekat banyak kain lembut, misalnya lemari pakaian, atau menambah selimut di sekitar mikrofon", "Record near lots of soft fabric, like a wardrobe, or hang blankets around the mic"),
          _("Menaikkan volume", "Turn up the volume"),
          _("Menambah reverb", "Add reverb"),
        ],
        a: 1,
        e: _("Kain lembut menyerap pantulan suara. Ruangan dengan permukaan keras membuat gema semakin kuat.", "Soft fabric absorbs reflections. Hard-surfaced rooms make echo worse."),
      },
      {
        q: _("Klien meminta voice over iklan TV nasional, tetapi tarif yang ditawarkan sama dengan video internal perusahaan. Apa yang perlu dibahas?", "A client wants a national TV ad voiceover but offers the same rate as an internal company video. What needs discussing?"),
        o: [
          _("Tidak ada, terima saja", "Nothing, just accept"),
          _("Hak siar dan jangka waktu penggunaan, karena iklan TV dan siaran luas biasanya dikenai biaya lebih tinggi", "Broadcast rights and usage period, since TV and wide-broadcast ads usually cost more"),
          _("Jenis mikrofon", "Microphone type"),
          _("Panjang naskah saja", "Script length only"),
        ],
        a: 1,
        e: _("Tarif voice over bergantung pada penggunaan, bukan hanya durasi. Siaran nasional bernilai jauh lebih tinggi.", "Voiceover rates depend on usage, not just length. National broadcast is worth far more."),
      },
      {
        q: _("Format file yang paling umum diminta klien untuk voice over mentah?", "Which format do clients usually want for raw voiceover?"),
        o: [
          _("MP3 64 kbps", "64 kbps MP3"),
          _("WAV (misalnya 48 kHz, 24-bit) tanpa efek berlebihan", "WAV (e.g. 48 kHz, 24-bit) without heavy effects"),
          _("Video MP4", "MP4 video"),
          _("File Word", "Word file"),
        ],
        a: 1,
        e: _("WAV tidak terkompresi memberi ruang bagi editor untuk mengolah suara tanpa menurunkan kualitas.", "Uncompressed WAV lets editors process audio without losing quality."),
      },
      {
        q: _("Naskah meminta nada \"hangat dan meyakinkan\". Bagaimana menunjukkan pilihan kepada klien?", "The script calls for a \"warm and reassuring\" tone. How do you give the client options?"),
        o: [
          _("Merekam satu versi saja", "Record just one take"),
          _("Merekam 2 sampai 3 interpretasi singkat dari bagian pembuka untuk dipilih sebelum merekam semuanya", "Record 2 to 3 short interpretations of the opening for them to choose before recording everything"),
          _("Meminta klien merekam sendiri", "Ask the client to record it"),
          _("Membaca secepat mungkin", "Read as fast as possible"),
        ],
        a: 1,
        e: _("Sampel singkat menyelaraskan harapan lebih awal dan mengurangi rekaman ulang.", "Short samples align expectations early and reduce re-records."),
      },
      {
        q: _("Seseorang memintamu merekam suara yang meniru suara tokoh publik untuk \"pengumuman resmi\" yang akan disebar. Respons yang tepat?", "Someone asks you to record a voice imitating a public figure for an \"official announcement\" to be circulated. Right response?"),
        o: [
          _("Rekam, karena itu bakat imitasi", "Record it, it's an impression skill"),
          _("Tolak, karena berisiko dipakai untuk menipu atau menyesatkan publik", "Decline, since it risks being used to deceive or mislead the public"),
          _("Rekam tetapi naikkan tarif", "Record it at a higher rate"),
          _("Rekam tanpa nama", "Record anonymously"),
        ],
        a: 1,
        e: _("Imitasi untuk parodi yang jelas berbeda dengan rekaman yang dibuat seolah-olah asli. Yang kedua bisa menjadi alat penipuan.", "Clear parody differs from recordings made to pass as real. The latter can be used for fraud."),
      },
    ],
    tugas: [
      {
        judul: _("Tandai naskah sebelum merekam", "Mark up a script before recording"),
        brief: _(
          "Naskah iklan 30 detik untuk asuransi kesehatan:\n\"Sakit tidak pernah memberi kabar. Tapi kamu bisa bersiap. Dengan Sehatku, biaya rumah sakit ditanggung mulai hari pertama. Daftar dalam lima menit, langsung dari HP. Sehatku. Tenang, kami di sini.\"\nNada: hangat, tenang, meyakinkan.",
          "30-second ad script for health insurance:\n\"Illness never sends a warning. But you can be ready. With Sehatku, hospital costs are covered from day one. Sign up in five minutes, right from your phone. Sehatku. Relax, we're here.\"\nTone: warm, calm, reassuring.",
        ),
        langkah: [
          _("Tandai kata yang ditekankan dan tempat jeda.", "Mark stressed words and pauses."),
          _("Jelaskan perubahan nada di setiap bagian.", "Explain tone shifts in each part."),
          _("Perkirakan apakah naskah muat dalam 30 detik dengan tempo yang tenang.", "Estimate whether it fits 30 seconds at a calm pace."),
        ],
        rubrik: [
          _("Tanda jeda dan penekanan masuk akal", "Pauses and emphasis make sense"),
          _("Ada perubahan nada dari serius ke lega", "Tone moves from serious to relieved"),
          _("Kata kunci manfaat ditekankan (hari pertama, lima menit)", "Key benefits stressed (day one, five minutes)"),
          _("Perkiraan durasi realistis", "Realistic timing estimate"),
        ],
        contoh: _(
          "Tanda: / = jeda pendek, // = jeda panjang, KAPITAL = penekanan\n\n\"Sakit tidak pernah memberi KABAR. // Tapi kamu bisa BERSIAP. //\n(nada serius dan pelan, lalu naik sedikit di \"bersiap\")\n\nDengan Sehatku, / biaya rumah sakit ditanggung mulai HARI PERTAMA. /\n(lebih hangat, tersenyum saat membaca)\n\nDaftar dalam LIMA MENIT, / langsung dari HP. //\n(ringan dan praktis)\n\nSehatku. / Tenang, / kami di sini.\"\n(pelan, lembut, ditutup dengan senyum)\n\nDurasi: sekitar 30 kata. Dengan tempo tenang dan jeda, sekitar 18 sampai 22 detik, sehingga masih ada ruang untuk musik dan logo di akhir.",
          "Marks: / = short pause, // = long pause, CAPS = emphasis\n\n\"Illness never sends a WARNING. // But you can be READY. //\n(serious and slow, lifting slightly on \"ready\")\n\nWith Sehatku, / hospital costs are covered from DAY ONE. /\n(warmer, smiling while reading)\n\nSign up in FIVE MINUTES, / right from your phone. //\n(light and practical)\n\nSehatku. / Relax, / we're here.\"\n(slow, soft, ending with a smile)\n\nTiming: about 30 words. At a calm pace with pauses, around 18 to 22 seconds, leaving room for music and the logo at the end.",
        ),
      },
      {
        judul: _("Susun daftar harga jasa voice over", "Build a voiceover rate card"),
        brief: _(
          "Kamu baru mulai menawarkan jasa voice over bahasa Indonesia. Susun daftar layanan dan ketentuan yang jelas agar klien mudah memesan. Angka harga boleh ditandai [isi sendiri].",
          "You're starting to offer Indonesian voiceover services. Build a clear list of services and terms so clients can order easily. Prices may be marked [your rate].",
        ),
        langkah: [
          _("Kelompokkan layanan berdasarkan jenis penggunaan.", "Group services by usage type."),
          _("Tentukan apa yang termasuk dalam setiap paket.", "Define what each package includes."),
          _("Tulis ketentuan revisi, waktu pengerjaan, dan hak penggunaan.", "Write terms for revisions, turnaround, and usage rights."),
        ],
        rubrik: [
          _("Layanan dibedakan berdasarkan penggunaan (internal, media sosial, iklan siaran)", "Services split by usage (internal, social, broadcast ads)"),
          _("Ada rincian yang termasuk (jumlah kata atau durasi, format file)", "Lists inclusions (word count or length, file format)"),
          _("Membedakan revisi gratis (kesalahan baca) dan berbayar (perubahan naskah)", "Distinguishes free fixes (misreads) from paid changes (script edits)"),
          _("Menyebut hak penggunaan dan jangka waktunya", "States usage rights and duration"),
        ],
        contoh: _(
          "Layanan voice over bahasa Indonesia\n\n1. E-learning dan video internal: per 100 kata [isi sendiri], file WAV dan MP3 bersih, penggunaan internal tanpa batas waktu\n2. Konten media sosial dan YouTube: per naskah hingga 150 kata [isi sendiri], termasuk 1 pilihan nada tambahan\n3. Iklan digital berbayar: [isi sendiri], hak penggunaan 1 tahun\n4. Iklan TV atau radio: harga sesuai wilayah siaran dan durasi tayang, hubungi untuk penawaran\n\nTermasuk: rekaman di ruang yang sudah diredam, pembersihan noise, file WAV 48 kHz 24-bit.\n\nWaktu pengerjaan: 2 hari kerja; layanan kilat 24 jam dengan biaya tambahan.\n\nRevisi: perbaikan salah baca atau salah ucap gratis. Perubahan naskah atau arahan setelah rekaman dikenai biaya rekaman ulang.",
          "Indonesian voiceover services\n\n1. E-learning and internal videos: per 100 words [your rate], clean WAV and MP3, unlimited internal use\n2. Social media and YouTube content: per script up to 150 words [your rate], includes 1 extra tone option\n3. Paid digital ads: [your rate], 1-year usage rights\n4. TV or radio ads: priced by broadcast region and airtime, contact for a quote\n\nIncluded: recording in a treated space, noise cleanup, 48 kHz 24-bit WAV.\n\nTurnaround: 2 working days; 24-hour rush for an extra fee.\n\nRevisions: misreads or mispronunciations fixed free. Script or direction changes after recording are charged as a re-record.",
        ),
      },
    ],
  },
};
