import { t as _ } from "../../i18n.js";

/** Latihan praktik kategori Penulisan & Penerjemahan. */
export default {
  "content-writer": {
    kuis: [
      {
        q: _("Kamu diminta menulis artikel dengan kata kunci \"cara menabung untuk mahasiswa\". Di mana kata kunci sebaiknya muncul?", "You're asked to write an article for \"how students can save money\". Where should the keyword appear?"),
        o: [
          _("Diulang sebanyak mungkin di setiap paragraf", "Repeated as often as possible in every paragraph"),
          _("Di judul, paragraf pembuka, salah satu subjudul, dan meta description secara alami", "Naturally in the title, intro, a subheading, and the meta description"),
          _("Hanya di bagian akhir", "Only at the end"),
          _("Disembunyikan dengan warna putih", "Hidden in white text"),
        ],
        a: 1,
        e: _("Letakkan kata kunci di posisi penting secara alami. Pengulangan berlebihan membuat tulisan tidak enak dibaca dan bisa dianggap spam.", "Place the keyword naturally in key spots. Overuse makes writing awkward and can look like spam."),
      },
      {
        q: _("Klien meminta artikel 1.500 kata, tetapi topiknya sudah tuntas dibahas dalam 900 kata. Apa yang sebaiknya dilakukan?", "A client wants 1,500 words, but the topic is fully covered in 900. What should you do?"),
        o: [
          _("Tambah kalimat berulang agar mencapai 1.500 kata", "Pad it with repetition to hit 1,500"),
          _("Diskusikan dengan klien: tawarkan tambahan bagian yang bernilai (contoh, FAQ, data) atau artikel yang lebih padat", "Discuss with the client: offer valuable additions (examples, FAQ, data) or a tighter article"),
          _("Kirim 900 kata tanpa penjelasan", "Send 900 words with no explanation"),
          _("Salin bagian dari artikel lain", "Copy sections from other articles"),
        ],
        a: 1,
        e: _("Panjang tulisan seharusnya mengikuti kebutuhan pembaca. Menambah nilai lebih baik daripada menambah kata.", "Length should follow reader needs. Adding value beats adding words."),
      },
      {
        q: _("Kamu memakai AI untuk membuat draf artikel. Apa yang tetap menjadi tanggung jawabmu?", "You use AI to draft an article. What's still your responsibility?"),
        o: [
          _("Tidak ada, AI yang bertanggung jawab", "Nothing, the AI is responsible"),
          _("Memeriksa fakta, menambah pengalaman dan sudut pandang, menyunting gaya, dan mematuhi kebijakan klien soal AI", "Fact-checking, adding experience and perspective, editing style, and following the client's AI policy"),
          _("Hanya mengganti judul", "Just changing the title"),
          _("Menghapus tanda baca", "Removing punctuation"),
        ],
        a: 1,
        e: _("Klien membayar untuk tulisan yang akurat dan bernilai. Banyak klien juga punya aturan sendiri soal penggunaan AI.", "Clients pay for accurate, valuable writing. Many also have their own rules on AI use."),
      },
      {
        q: _("Paragraf pembuka mana yang paling kuat untuk artikel \"cara mengatur gaji pertama\"?", "Which opening is strongest for an article on \"managing your first salary\"?"),
        o: [
          _("\"Gaji adalah uang yang diterima seseorang setelah bekerja.\"", "\"A salary is money someone receives after working.\""),
          _("\"Gaji pertama sudah masuk, tapi pertengahan bulan saldo tinggal setengah? Kamu tidak sendirian. Ini cara membaginya supaya cukup sampai gajian berikutnya.\"", "\"Your first salary landed, but by mid-month half is gone? You're not alone. Here's how to split it so it lasts until next payday.\""),
          _("\"Pada artikel ini kita akan membahas gaji.\"", "\"In this article we'll talk about salaries.\""),
          _("\"Sejak zaman dahulu manusia sudah mengenal uang.\"", "\"Since ancient times humans have used money.\""),
        ],
        a: 1,
        e: _("Pembuka yang baik langsung menyentuh masalah pembaca dan menjanjikan solusi.", "A strong opening speaks to the reader's problem and promises a solution."),
      },
      {
        q: _("Situs \"penulis lepas\" meminta kamu menulis 5 artikel percobaan gratis sebelum diterima, lalu tidak pernah membalas lagi. Bagaimana mencegahnya?", "A \"freelance writing\" site asks for 5 free trial articles before acceptance, then goes silent. How do you avoid this?"),
        o: [
          _("Selalu kirim sebanyak yang diminta", "Always send as many as asked"),
          _("Kirim portofolio yang sudah ada atau tawarkan tes pendek; tes yang panjang seharusnya dibayar", "Share your existing portfolio or offer a short test; long tests should be paid"),
          _("Kirim tulisan orang lain", "Send someone else's writing"),
          _("Berhenti menulis", "Stop writing"),
        ],
        a: 1,
        e: _("Beberapa \"tes\" sebenarnya cara mendapat konten gratis. Portofolio dan tes pendek sudah cukup untuk menilai kemampuan.", "Some \"tests\" are a way to get free content. A portfolio and a short test are enough to judge skill."),
      },
    ],
    tugas: [
      {
        judul: _("Buat kerangka artikel SEO", "Outline an SEO article"),
        brief: _(
          "Kami platform belajar online. Tolong buatkan kerangka artikel dengan kata kunci \"cara membuat CV untuk fresh graduate\". Target pembaca: lulusan baru yang belum punya pengalaman kerja.",
          "We're an online learning platform. Please outline an article for the keyword \"how to write a CV as a fresh graduate\". Target readers: new graduates with no work experience.",
        ),
        langkah: [
          _("Tulis judul dan meta description.", "Write a title and meta description."),
          _("Susun subjudul (H2 dan H3) yang menjawab kebutuhan pembaca.", "Lay out subheadings (H2 and H3) that answer reader needs."),
          _("Tulis 2 kalimat pembuka.", "Write a 2-sentence opening."),
        ],
        rubrik: [
          _("Judul memuat kata kunci dan menarik", "Title includes the keyword and is compelling"),
          _("Subjudul runtut dan menjawab masalah utama (tidak punya pengalaman)", "Subheadings flow and address the main problem (no experience)"),
          _("Ada contoh atau template konkret", "Includes concrete examples or a template"),
          _("Ada bagian kesalahan umum atau FAQ", "Has a common mistakes or FAQ section"),
          _("Pembuka langsung menyentuh masalah pembaca", "Opening addresses the reader's problem directly"),
        ],
        contoh: _(
          "Judul: Cara Membuat CV untuk Fresh Graduate Tanpa Pengalaman Kerja (+ Contoh)\nMeta: Belum punya pengalaman kerja? Ikuti cara membuat CV fresh graduate yang dilirik rekruter, lengkap dengan contoh dan template.\n\nH2 Apa yang dicari rekruter dari CV fresh graduate\nH2 Struktur CV fresh graduate\n  H3 Data diri dan ringkasan profil\n  H3 Pendidikan, IPK, dan skripsi yang relevan\n  H3 Organisasi, magang, dan proyek kuliah\n  H3 Skill dan sertifikat\nH2 Cara menulis pengalaman jika belum pernah bekerja\nH2 Contoh CV fresh graduate (sebelum dan sesudah)\nH2 5 kesalahan yang sering membuat CV ditolak\nH2 FAQ: perlu foto? berapa halaman?\n\nPembuka: \"Belum punya pengalaman kerja bukan alasan CV-mu diabaikan. Rekruter tahu kamu baru lulus, yang mereka cari adalah bukti bahwa kamu bisa belajar dan bekerja dengan baik.\"",
          "Title: How to Write a Fresh Graduate CV With No Work Experience (+ Example)\nMeta: No work experience yet? Follow these steps to write a fresh graduate CV recruiters notice, with examples and a template.\n\nH2 What recruiters look for in a fresh graduate CV\nH2 Fresh graduate CV structure\n  H3 Contact details and profile summary\n  H3 Education, GPA, and a relevant thesis\n  H3 Organisations, internships, and campus projects\n  H3 Skills and certificates\nH2 How to write experience when you've never had a job\nH2 Fresh graduate CV example (before and after)\nH2 5 mistakes that get CVs rejected\nH2 FAQ: photo or not? how many pages?\n\nOpening: \"No work experience isn't a reason for your CV to be ignored. Recruiters know you just graduated; what they want is proof you can learn and work well.\"",
        ),
      },
      {
        judul: _("Tulis deskripsi produk", "Write a product description"),
        brief: _(
          "Produk: tumbler stainless 500 ml, tahan panas 12 jam dan dingin 24 jam, tutup anti tumpah, muat di cup holder mobil, 5 pilihan warna, harga Rp129.000. Target: pekerja muda yang sering bepergian. Tulis deskripsi untuk marketplace.",
          "Product: 500 ml stainless tumbler, keeps hot 12 hours and cold 24 hours, leak-proof lid, fits car cup holders, 5 colours, Rp129,000. Target: young workers on the go. Write a marketplace description.",
        ),
        langkah: [
          _("Tulis kalimat pembuka yang menonjolkan manfaat utama.", "Write an opening line highlighting the main benefit."),
          _("Ubah fitur menjadi manfaat dalam poin-poin.", "Turn features into benefits in bullet points."),
          _("Tambahkan spesifikasi dan ajakan membeli.", "Add specs and a call to action."),
        ],
        rubrik: [
          _("Pembuka menonjolkan manfaat, bukan sekadar nama produk", "Opening leads with a benefit, not just the name"),
          _("Fitur diterjemahkan menjadi manfaat bagi pembeli", "Features translated into buyer benefits"),
          _("Mudah dipindai (poin-poin)", "Easy to scan (bullets)"),
          _("Spesifikasi lengkap dan akurat", "Specs are complete and accurate"),
          _("Nada sesuai target pembeli", "Tone fits the target buyer"),
        ],
        contoh: _(
          "Kopi pagi tetap panas sampai jam makan siang, es teh tetap dingin sampai pulang kerja.\n\n• Panas 12 jam, dingin 24 jam: tidak perlu beli minum di jalan\n• Tutup anti tumpah: aman dimasukkan ke tas bersama laptop\n• Muat di cup holder mobil dan motor: praktis untuk perjalanan\n• Stainless food grade: tidak meninggalkan bau dan mudah dicuci\n• 5 pilihan warna: pilih yang paling kamu banget\n\nSpesifikasi: kapasitas 500 ml, bahan stainless steel 304, tutup dengan seal silikon.\n\nHemat uang jajan minuman dan kurangi sampah plastik mulai hari ini. Klik Beli Sekarang.",
          "Morning coffee stays hot until lunch, iced tea stays cold until you head home.\n\n• Hot 12 hours, cold 24 hours: no need to buy drinks on the go\n• Leak-proof lid: safe in your bag next to your laptop\n• Fits car and motorbike cup holders: made for commuting\n• Food-grade stainless: no lingering smells, easy to wash\n• 5 colours: pick the one that's most you\n\nSpecs: 500 ml capacity, 304 stainless steel, lid with silicone seal.\n\nSave on drinks and cut plastic waste starting today. Tap Buy Now.",
        ),
      },
    ],
  },

  copywriter: {
    kuis: [
      {
        q: _("Formula AIDA terdiri dari...", "The AIDA formula stands for..."),
        o: [
          _("Attention, Interest, Desire, Action", "Attention, Interest, Desire, Action"),
          _("Audience, Idea, Design, Ad", "Audience, Idea, Design, Ad"),
          _("Analysis, Insight, Data, Answer", "Analysis, Insight, Data, Answer"),
          _("Ask, Inform, Deliver, Achieve", "Ask, Inform, Deliver, Achieve"),
        ],
        a: 0,
        e: _("AIDA: tarik perhatian, bangun minat, tumbuhkan keinginan, lalu ajak bertindak.", "AIDA: grab attention, build interest, create desire, then prompt action."),
      },
      {
        q: _("Headline mana yang paling kuat untuk kursus Excel online?", "Which headline is strongest for an online Excel course?"),
        o: [
          _("\"Kursus Excel Terbaik\"", "\"The Best Excel Course\""),
          _("\"Selesaikan laporan bulanan dalam 15 menit, bukan 3 jam\"", "\"Finish monthly reports in 15 minutes, not 3 hours\""),
          _("\"Belajar Excel\"", "\"Learn Excel\""),
          _("\"Kami menyediakan kursus\"", "\"We offer courses\""),
        ],
        a: 1,
        e: _("Headline yang spesifik dan menjanjikan hasil nyata lebih kuat daripada klaim umum seperti \"terbaik\".", "Specific headlines promising a real outcome beat generic claims like \"best\"."),
      },
      {
        q: _("Klien meminta kamu menulis \"dijamin kurus 10 kg dalam seminggu\" untuk produk suplemen. Respons yang tepat?", "A client wants \"guaranteed 10 kg weight loss in a week\" for a supplement. Right response?"),
        o: [
          _("Tulis, karena klien yang meminta", "Write it, the client asked"),
          _("Tolak klaim itu dan tawarkan copy yang persuasif tanpa klaim kesehatan yang menyesatkan", "Decline that claim and offer persuasive copy without misleading health claims"),
          _("Tulis \"hampir dijamin\"", "Write \"almost guaranteed\""),
          _("Tulis dengan huruf kecil", "Write it in small print"),
        ],
        a: 1,
        e: _("Klaim kesehatan yang menyesatkan bisa melanggar aturan iklan dan membuat iklan ditolak platform. Copywriter yang baik persuasif sekaligus jujur.", "Misleading health claims can break ad rules and get ads rejected. Good copywriters are persuasive and honest."),
      },
      {
        q: _("Apa fungsi bukti sosial (social proof) dalam halaman penjualan?", "What does social proof do on a sales page?"),
        o: [
          _("Mengisi ruang kosong", "Fill empty space"),
          _("Mengurangi keraguan pembeli dengan menunjukkan orang lain sudah mencoba dan puas", "Reduce buyer doubt by showing others tried it and were happy"),
          _("Membuat halaman lebih panjang", "Make the page longer"),
          _("Menggantikan harga", "Replace the price"),
        ],
        a: 1,
        e: _("Testimoni nyata, jumlah pembeli, dan ulasan menjawab keraguan \"apakah ini benar-benar berhasil?\". Pastikan selalu asli.", "Real testimonials, buyer counts, and reviews answer \"does this actually work?\". Always keep them genuine."),
      },
      {
        q: _("Kamu ingin tahu dua versi teks iklan mana yang lebih efektif. Cara yang paling bisa dipercaya?", "You want to know which of two ad copies works better. Most reliable way?"),
        o: [
          _("Tanya pendapat keluarga", "Ask family"),
          _("Uji A/B dengan audiens dan anggaran yang sama, lalu bandingkan konversi", "A/B test with the same audience and budget, then compare conversions"),
          _("Pilih yang lebih panjang", "Pick the longer one"),
          _("Pilih yang lebih banyak emoji", "Pick the one with more emojis"),
        ],
        a: 1,
        e: _("Data dari pembeli sungguhan lebih bisa dipercaya daripada selera pribadi.", "Data from real buyers beats personal taste."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis 3 versi teks iklan", "Write 3 ad copy variations"),
        brief: _(
          "Kami jasa laundry kiloan dengan antar-jemput gratis di Surabaya, selesai dalam 24 jam, harga Rp8.000/kg. Target: pekerja dan mahasiswa yang sibuk. Tolong buat 3 versi teks iklan Instagram dengan pendekatan berbeda.",
          "We're a by-the-kilo laundry in Surabaya with free pick-up and delivery, 24-hour turnaround, Rp8,000/kg. Target: busy workers and students. Please write 3 Instagram ad versions with different angles.",
        ),
        langkah: [
          _("Tulis 3 versi: misalnya fokus waktu, fokus harga, dan fokus masalah.", "Write 3 versions: e.g. time-focused, price-focused, and pain-focused."),
          _("Setiap versi berisi headline, teks utama singkat, dan ajakan bertindak.", "Each has a headline, short body, and call to action."),
          _("Jelaskan versi mana yang kamu uji lebih dulu dan alasannya.", "Say which you'd test first and why."),
        ],
        rubrik: [
          _("Ketiga versi benar-benar berbeda pendekatan", "The three versions truly differ in angle"),
          _("Headline singkat dan spesifik", "Headlines are short and specific"),
          _("Menyebut keunggulan nyata (antar-jemput gratis, 24 jam, harga)", "Mentions real benefits (free pick-up, 24 hours, price)"),
          _("Ajakan bertindak jelas (misalnya pesan via WhatsApp)", "Clear call to action (e.g. order via WhatsApp)"),
          _("Ada alasan pemilihan versi pertama", "Explains which to test first"),
        ],
        contoh: _(
          "Versi 1 (waktu)\nHeadline: Akhir pekanmu terlalu berharga untuk mencuci\nTeks: Kami jemput, cuci, setrika, dan antar kembali dalam 24 jam. Gratis antar-jemput se-Surabaya.\nCTA: Pesan lewat WhatsApp\n\nVersi 2 (harga)\nHeadline: Rp8.000/kg, sudah termasuk antar-jemput\nTeks: Lebih hemat daripada waktu dan tenaga yang kamu habiskan. Bersih, wangi, dan rapi dalam 24 jam.\nCTA: Cek jadwal jemput hari ini\n\nVersi 3 (masalah)\nHeadline: Baju kerja menumpuk lagi?\nTeks: Kirim pesan sekarang, besok sore sudah kembali rapi di depan pintu.\nCTA: Jadwalkan penjemputan\n\nUji pertama: versi 1 dan 3, karena target sibuk biasanya lebih tergerak oleh waktu yang dihemat daripada harga.",
          "Version 1 (time)\nHeadline: Your weekend's too valuable for laundry\nBody: We pick up, wash, iron, and deliver back within 24 hours. Free pick-up across Surabaya.\nCTA: Order on WhatsApp\n\nVersion 2 (price)\nHeadline: Rp8,000/kg, pick-up and delivery included\nBody: Cheaper than the time and effort you'd spend. Clean, fresh, and folded within 24 hours.\nCTA: Book today's pick-up\n\nVersion 3 (pain)\nHeadline: Work clothes piling up again?\nBody: Message us now and they'll be back, neatly folded at your door, by tomorrow afternoon.\nCTA: Schedule a pick-up\n\nTest first: versions 1 and 3, since busy people are usually moved more by time saved than by price.",
        ),
      },
      {
        judul: _("Perbaiki halaman penjualan yang lemah", "Fix a weak sales page"),
        brief: _(
          "Ini bagian atas halaman penjualan e-book kami:\n\"Selamat datang di website kami. Kami adalah perusahaan yang bergerak di bidang pendidikan sejak 2019. Kami menjual e-book tentang keuangan. E-book ini berisi 120 halaman. Harga Rp79.000.\"\nPenjualannya sepi. Tolong perbaiki.",
          "Here's the top of our e-book sales page:\n\"Welcome to our website. We are an education company founded in 2019. We sell e-books about finance. This e-book has 120 pages. Price Rp79,000.\"\nSales are slow. Please fix it.",
        ),
        langkah: [
          _("Jelaskan 3 masalah utama teks ini.", "Explain the 3 main problems with this copy."),
          _("Tulis ulang bagian atas: headline, subheadline, 3 poin manfaat, dan ajakan.", "Rewrite the top: headline, subheadline, 3 benefit points, and CTA."),
          _("Tandai informasi yang perlu ditanyakan ke klien.", "Flag information to ask the client."),
        ],
        rubrik: [
          _("Menyadari teks berfokus pada perusahaan, bukan pembaca", "Notices it focuses on the company, not the reader"),
          _("Menyadari tidak ada manfaat atau hasil yang dijanjikan", "Notices there's no benefit or outcome"),
          _("Headline baru berfokus pada hasil bagi pembaca", "New headline focuses on reader outcomes"),
          _("Ada bukti sosial atau placeholder untuknya", "Includes social proof or a placeholder"),
          _("Tidak mengarang klaim; data yang belum ada ditandai", "Doesn't invent claims; missing data is flagged"),
        ],
        contoh: _(
          "Masalah:\n1. Dibuka dengan cerita perusahaan, padahal pembaca ingin tahu \"apa untungnya buat saya\"\n2. Tidak ada manfaat atau hasil yang dijanjikan, hanya jumlah halaman\n3. Tidak ada bukti dan ajakan bertindak\n\nTulis ulang:\nHeadline: Gaji habis sebelum akhir bulan? Mulai atur keuanganmu dalam 7 hari\nSubheadline: Panduan praktis untuk pekerja muda: dari membuat anggaran sampai mulai menabung dan berinvestasi dengan aman.\n• Template anggaran siap pakai yang bisa langsung kamu isi\n• Cara membangun dana darurat walau gaji pas-pasan\n• Ciri investasi bodong supaya uangmu tidak hilang\n[Testimoni pembaca: perlu dari klien]\nTombol: Dapatkan e-book, Rp79.000\n\nPerlu ditanyakan: jumlah pembaca sejauh ini, testimoni asli, dan apakah ada garansi.",
          "Problems:\n1. It opens with the company's story, while readers want \"what's in it for me\"\n2. No benefit or outcome is promised, only a page count\n3. No proof and no call to action\n\nRewrite:\nHeadline: Salary gone before month end? Get your finances in order in 7 days\nSubheadline: A practical guide for young workers: from budgeting to saving and investing safely.\n• A ready-to-use budget template you can fill in right away\n• How to build an emergency fund even on a tight salary\n• Signs of investment scams so you don't lose your money\n[Reader testimonials: needed from client]\nButton: Get the e-book, Rp79,000\n\nTo ask: reader count so far, genuine testimonials, and whether there's a guarantee.",
        ),
      },
    ],
  },

  ghostwriter: {
    kuis: [
      {
        q: _("Apa langkah paling penting sebelum menulis unggahan LinkedIn atas nama klien?", "What's most important before writing LinkedIn posts for a client?"),
        o: [
          _("Langsung menulis berdasarkan tren", "Write straight from trends"),
          _("Mewawancarai klien untuk memahami cerita, pendapat, dan cara bicaranya", "Interview the client to understand their stories, views, and voice"),
          _("Menyalin unggahan tokoh terkenal", "Copy famous people's posts"),
          _("Memakai banyak emoji", "Use lots of emojis"),
        ],
        a: 1,
        e: _("Ghostwriting yang baik terdengar seperti kliennya sendiri. Bahan terbaik berasal dari cerita dan pendapat asli klien.", "Good ghostwriting sounds like the client. The best material comes from their real stories and opinions."),
      },
      {
        q: _("Bolehkah kamu mencantumkan karya ghostwriting di portofolio?", "Can you include ghostwritten work in your portfolio?"),
        o: [
          _("Selalu boleh, lengkap dengan nama klien", "Always, with the client's name"),
          _("Hanya jika sudah disepakati; jika tidak, tampilkan jenis proyek tanpa nama atau gunakan sampel tulisan sendiri", "Only if agreed; otherwise describe the project type anonymously or use your own samples"),
          _("Tidak pernah boleh menyebut pengalaman apa pun", "Never mention any experience at all"),
          _("Boleh jika klien tidak tahu", "Yes, if the client won't find out"),
        ],
        a: 1,
        e: _("Kerahasiaan adalah inti ghostwriting. Sepakati sejak awal apa yang boleh kamu sebutkan.", "Confidentiality is core to ghostwriting. Agree from the start what you may mention."),
      },
      {
        q: _("Klien mengatakan draf pertamamu \"bukan saya banget\". Respons yang paling produktif?", "The client says your first draft \"doesn't sound like me\". Most productive response?"),
        o: [
          _("Membela tulisanmu", "Defend your writing"),
          _("Minta contoh tulisan atau rekaman bicara klien, dan tanyakan bagian mana yang paling tidak sesuai", "Ask for samples of their writing or speech, and which parts feel most off"),
          _("Menulis ulang dari nol tanpa bertanya", "Rewrite from scratch without asking"),
          _("Menghentikan proyek", "End the project"),
        ],
        a: 1,
        e: _("Masukan spesifik dan contoh gaya bicara asli mempercepat proses menemukan suara klien.", "Specific feedback and real voice samples speed up finding the client's voice."),
      },
      {
        q: _("Struktur unggahan LinkedIn yang efektif biasanya dimulai dengan...", "Effective LinkedIn posts usually start with..."),
        o: [
          _("Paragraf panjang tentang latar belakang perusahaan", "A long paragraph of company background"),
          _("Satu kalimat pembuka yang membuat orang ingin klik \"lihat selengkapnya\"", "One opening line that makes people click \"see more\""),
          _("Daftar hashtag", "A list of hashtags"),
          _("Ucapan terima kasih", "A thank-you"),
        ],
        a: 1,
        e: _("Hanya beberapa baris pertama yang terlihat di linimasa. Kalimat pembuka menentukan apakah unggahan dibaca.", "Only the first lines show in the feed. The opening decides whether the post gets read."),
      },
      {
        q: _("Seseorang memintamu menulis skripsi lengkap atas namanya untuk diserahkan ke kampus. Apa sikap yang tepat?", "Someone asks you to write their full thesis to submit to their university. Right stance?"),
        o: [
          _("Terima, sama seperti ghostwriting lain", "Accept, it's like any ghostwriting"),
          _("Tolak, karena ini pelanggaran integritas akademik; tawarkan bantuan yang sah seperti penyuntingan bahasa atau bimbingan menulis", "Decline, it breaches academic integrity; offer legitimate help like language editing or writing coaching"),
          _("Terima jika bayarannya besar", "Accept if the pay is big"),
          _("Kerjakan setengahnya", "Do half"),
        ],
        a: 1,
        e: _("Ghostwriting untuk bisnis dan buku itu sah, tetapi karya akademik yang dinilai harus dikerjakan mahasiswa sendiri.", "Ghostwriting for business and books is fine, but graded academic work must be the student's own."),
      },
    ],
    tugas: [
      {
        judul: _("Ubah cerita klien menjadi unggahan LinkedIn", "Turn a client's story into a LinkedIn post"),
        brief: _(
          "Catatan wawancara dengan klien (pemilik usaha konveksi): \"Tahun 2020 pesanan turun 80% karena pandemi. Saya hampir menutup usaha. Lalu karyawan saya, Bu Wati, mengusulkan membuat masker kain. Dalam 3 bulan kami menjual 40.000 masker dan tidak ada yang di-PHK. Sejak itu saya selalu mendengarkan ide dari tim produksi.\"",
          "Interview notes from the client (a garment business owner): \"In 2020 orders fell 80% because of the pandemic. I nearly closed the business. Then my employee, Bu Wati, suggested making cloth masks. In 3 months we sold 40,000 masks and nobody was laid off. Since then I always listen to ideas from the production team.\"",
        ),
        langkah: [
          _("Tulis unggahan LinkedIn 150 sampai 250 kata dari sudut pandang klien.", "Write a 150 to 250-word LinkedIn post in the client's voice."),
          _("Buat kalimat pembuka yang kuat.", "Write a strong opening line."),
          _("Akhiri dengan pelajaran atau pertanyaan untuk pembaca.", "End with a lesson or question for readers."),
        ],
        rubrik: [
          _("Kalimat pembuka membuat penasaran", "Opening line creates curiosity"),
          _("Ditulis sebagai orang pertama dan terdengar alami", "Written in first person and sounds natural"),
          _("Fakta sesuai catatan, tidak ada yang dikarang", "Facts match the notes, nothing invented"),
          _("Memberi kredit kepada Bu Wati", "Credits Bu Wati"),
          _("Paragraf pendek dan mudah dibaca", "Short, readable paragraphs"),
        ],
        contoh: _(
          "Ide yang menyelamatkan usaha saya bukan datang dari saya.\n\nTahun 2020, pesanan konveksi kami turun 80%. Setiap malam saya menghitung berapa bulan lagi kami bisa bertahan. Jujur, saya sudah menyiapkan kata-kata untuk memberi tahu tim bahwa usaha ini akan tutup.\n\nLalu Bu Wati, salah satu penjahit kami, datang dengan usulan sederhana: \"Pak, bagaimana kalau kita buat masker kain?\"\n\nDalam 3 bulan, kami menjual 40.000 masker. Tidak ada satu pun karyawan yang di-PHK.\n\nSejak itu, saya belajar satu hal: orang yang paling dekat dengan pekerjaan sering melihat jalan keluar yang tidak terlihat dari meja pemilik.\n\nSekarang setiap bulan kami punya sesi khusus untuk mendengar ide dari tim produksi.\n\nKapan terakhir kali Anda bertanya kepada tim, \"Menurutmu, apa yang bisa kita lakukan?\"",
          "The idea that saved my business wasn't mine.\n\nIn 2020, our garment orders fell 80%. Every night I counted how many months we could survive. Honestly, I'd already rehearsed telling my team we were closing.\n\nThen Bu Wati, one of our tailors, came with a simple suggestion: \"Sir, what if we made cloth masks?\"\n\nIn 3 months we sold 40,000 masks. Not a single employee was laid off.\n\nSince then I've learned one thing: the people closest to the work often see the way out that you can't see from the owner's desk.\n\nNow we hold a monthly session just to hear ideas from the production team.\n\nWhen did you last ask your team, \"What do you think we could do?\"",
        ),
      },
      {
        judul: _("Susun daftar pertanyaan wawancara", "Prepare interview questions"),
        brief: _(
          "Klien baru: konsultan HR berpengalaman 15 tahun yang ingin menulis buku tentang mencari kerja untuk fresh graduate. Kamu akan mewawancarainya selama 1 jam untuk bab pertama. Siapkan pertanyaannya.",
          "New client: an HR consultant with 15 years' experience who wants to write a book on job hunting for fresh graduates. You'll interview them for 1 hour for chapter one. Prepare your questions.",
        ),
        langkah: [
          _("Tulis 8 sampai 10 pertanyaan wawancara.", "Write 8 to 10 interview questions."),
          _("Kelompokkan menjadi: cerita pribadi, pandangan, dan contoh konkret.", "Group them into personal stories, views, and concrete examples."),
          _("Tambahkan satu pertanyaan untuk menangkap gaya bicara klien.", "Add one question to capture the client's speaking style."),
        ],
        rubrik: [
          _("Pertanyaan terbuka, bukan ya atau tidak", "Open questions, not yes/no"),
          _("Ada pertanyaan yang menggali cerita dan contoh nyata", "Includes questions drawing out stories and real examples"),
          _("Ada pertanyaan tentang pandangan atau opini klien yang khas", "Includes questions about the client's distinctive views"),
          _("Urutan logis dan cukup untuk 1 jam", "Logical order, enough for 1 hour"),
        ],
        contoh: _(
          "Cerita pribadi\n1. Ceritakan pengalaman pertama Anda mencari kerja. Apa yang paling Anda ingat?\n2. Kapan pertama kali Anda menyadari banyak fresh graduate salah memahami proses rekrutmen?\n\nPandangan\n3. Menurut Anda, apa kesalahan terbesar fresh graduate yang jarang dibahas orang?\n4. Nasihat populer apa yang menurut Anda keliru?\n5. Apa yang sebenarnya dicari rekruter dalam 30 detik pertama membaca CV?\n\nContoh konkret\n6. Ceritakan satu kandidat tanpa pengalaman yang tetap Anda rekomendasikan. Apa yang membuatnya menonjol?\n7. Ceritakan satu interview yang gagal karena hal kecil.\n8. Jika Anda hanya boleh memberi satu tugas kepada fresh graduate minggu ini, apa tugasnya?\n\nGaya bicara\n9. Bagaimana biasanya Anda menjelaskan hal ini kepada keponakan atau anak Anda sendiri?\n10. Ada kalimat atau istilah yang sering Anda pakai saat mengisi pelatihan?",
          "Personal stories\n1. Tell me about your first job search. What do you remember most?\n2. When did you first realise many fresh graduates misunderstand hiring?\n\nViews\n3. What's the biggest fresh graduate mistake nobody talks about?\n4. Which popular advice do you think is wrong?\n5. What do recruiters really look for in the first 30 seconds of reading a CV?\n\nConcrete examples\n6. Tell me about a candidate with no experience you still recommended. What made them stand out?\n7. Tell me about an interview that failed over something small.\n8. If you could give fresh graduates just one task this week, what would it be?\n\nSpeaking style\n9. How do you usually explain this to your own nephew or child?\n10. Are there phrases or terms you often use in your training sessions?",
        ),
      },
    ],
  },

  "penulis-skrip": {
    kuis: [
      {
        q: _("Apa fungsi utama 3 detik pertama dalam skrip video pendek?", "What's the main job of the first 3 seconds of a short video script?"),
        o: [
          _("Memperkenalkan nama channel", "Introduce the channel name"),
          _("Menahan penonton agar tidak menggulir, dengan hook yang langsung menyentuh minat mereka", "Stop viewers scrolling with a hook that hits their interest immediately"),
          _("Menampilkan logo brand", "Show the brand logo"),
          _("Mengucapkan salam panjang", "Give a long greeting"),
        ],
        a: 1,
        e: _("Penonton memutuskan menonton atau menggulir dalam beberapa detik. Hook yang kuat menentukan retensi.", "Viewers decide to watch or scroll within seconds. A strong hook drives retention."),
      },
      {
        q: _("Kalimat mana yang lebih cocok untuk naskah yang dibacakan (bukan dibaca)?", "Which sentence suits a script meant to be spoken (not read)?"),
        o: [
          _("\"Berdasarkan data yang telah dihimpun dari berbagai sumber terpercaya, dapat disimpulkan bahwa...\"", "\"Based on data compiled from various trusted sources, it can be concluded that...\""),
          _("\"Datanya jelas: tiga dari empat orang salah soal ini.\"", "\"The data's clear: three out of four people get this wrong.\""),
          _("\"Sebagaimana telah disebutkan pada bagian sebelumnya...\"", "\"As previously mentioned in the preceding section...\""),
          _("\"Tabel 3 menunjukkan bahwa...\"", "\"Table 3 shows that...\""),
        ],
        a: 1,
        e: _("Naskah untuk diucapkan memakai kalimat pendek dan bahasa percakapan. Rujukan ke tabel atau bagian sebelumnya tidak cocok untuk video.", "Spoken scripts use short sentences and conversational language. References to tables or sections don't work in video."),
      },
      {
        q: _("Data YouTube menunjukkan banyak penonton keluar di menit ke-1 video 10 menit. Apa yang sebaiknya dievaluasi dulu?", "YouTube data shows many viewers leave at minute 1 of a 10-minute video. What should you review first?"),
        o: [
          _("Bagian penutup", "The ending"),
          _("Pembuka: apakah janji di judul segera dipenuhi atau terlalu lama basa-basi", "The opening: whether the title's promise is delivered quickly or there's too much preamble"),
          _("Musik latar di menit 9", "Background music at minute 9"),
          _("Jumlah subscriber", "Subscriber count"),
        ],
        a: 1,
        e: _("Penurunan di awal biasanya berarti pembuka tidak sesuai harapan penonton dari judul dan thumbnail.", "Early drop-off usually means the opening doesn't match what the title and thumbnail promised."),
      },
      {
        q: _("Bagaimana sebaiknya menulis skrip untuk host yang punya gaya bicara santai dan suka bercanda?", "How should you write for a host with a relaxed, jokey speaking style?"),
        o: [
          _("Tetap formal agar profesional", "Keep it formal to be professional"),
          _("Sesuaikan dengan gayanya: tonton videonya, catat ungkapan khasnya, dan beri ruang untuk improvisasi", "Match their style: watch their videos, note their phrases, and leave room for improvisation"),
          _("Tulis lelucon sebanyak mungkin", "Pack in as many jokes as possible"),
          _("Abaikan gaya host", "Ignore the host's style"),
        ],
        a: 1,
        e: _("Skrip yang tidak sesuai gaya host terdengar kaku. Pelajari cara bicaranya dulu.", "Scripts that don't match the host sound stiff. Learn how they talk first."),
      },
      {
        q: _("Klien memintamu menulis skrip video yang memakai cuplikan film terkenal tanpa izin untuk iklan produknya. Saran terbaik?", "A client wants a product ad script using clips from a famous film without permission. Best advice?"),
        o: [
          _("Pakai saja, tidak akan ketahuan", "Use them, nobody will notice"),
          _("Jelaskan risiko pelanggaran hak cipta dan usulkan alternatif seperti footage berlisensi atau produksi sendiri", "Explain the copyright risk and suggest alternatives like licensed footage or original shots"),
          _("Pakai hanya 5 detik", "Use only 5 seconds"),
          _("Ganti warna cuplikannya", "Recolour the clips"),
        ],
        a: 1,
        e: _("Penggunaan komersial tanpa izin bisa membuat video diturunkan atau klien dituntut.", "Commercial use without permission can get videos taken down or the client sued."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis skrip video pendek 45 detik", "Write a 45-second short video script"),
        brief: _(
          "Kami aplikasi pencatat keuangan. Tolong tulis skrip TikTok 45 detik dengan topik \"3 kebiasaan kecil yang bikin gaji cepat habis\". Host: perempuan 25 tahun, gaya santai. Akhiri dengan ajakan mencoba aplikasi.",
          "We're a budgeting app. Please write a 45-second TikTok script on \"3 small habits that drain your salary\". Host: a 25-year-old woman, casual style. End with a call to try the app.",
        ),
        langkah: [
          _("Tulis hook untuk 3 detik pertama.", "Write a hook for the first 3 seconds."),
          _("Tulis isi dengan 3 poin, beserta catatan visual singkat.", "Write the body with 3 points and short visual notes."),
          _("Tulis penutup dengan ajakan yang tidak terasa memaksa.", "Write a closing with a soft call to action."),
        ],
        rubrik: [
          _("Hook kuat dan langsung pada topik", "Strong hook that's on topic"),
          _("Tiga kebiasaan konkret dan relevan", "Three concrete, relatable habits"),
          _("Ada catatan visual atau teks layar", "Includes visual or on-screen text notes"),
          _("Bahasa percakapan, sesuai gaya host", "Conversational, fits the host"),
          _("Panjang realistis untuk 45 detik (sekitar 100 sampai 120 kata)", "Realistic length for 45 seconds (about 100 to 120 words)"),
        ],
        contoh: _(
          "[0-3 dtk] (host menatap kamera, memegang struk panjang)\n\"Gaji habis bukan karena belanja besar. Biasanya karena tiga hal kecil ini.\"\n\n[3-15 dtk] Teks layar: 1. Ongkir\n\"Satu: checkout satu barang, ongkirnya Rp15 ribu. Sepuluh kali sebulan? Rp150 ribu, cuma buat ongkir.\"\n\n[15-27 dtk] Teks layar: 2. Langganan lupa\n\"Dua: langganan yang sudah tidak dipakai. Cek deh, pasti ada satu yang masih jalan.\"\n\n[27-38 dtk] Teks layar: 3. Kopi harian\n\"Tiga: kopi Rp25 ribu setiap hari kerja. Sebulan bisa lebih dari Rp500 ribu.\"\n\n[38-45 dtk] (tunjukkan layar aplikasi)\n\"Aku baru sadar setelah mencatat semuanya di [nama aplikasi]. Coba catat seminggu saja, kamu pasti kaget. Link di bio.\"",
          "[0-3s] (host looks into camera holding a long receipt)\n\"Your salary doesn't vanish on big purchases. It's usually these three small things.\"\n\n[3-15s] On-screen: 1. Shipping fees\n\"One: checking out one item at a time, Rp15k shipping each. Ten times a month? Rp150k just on shipping.\"\n\n[15-27s] On-screen: 2. Forgotten subscriptions\n\"Two: subscriptions you don't use anymore. Go check, there's always one still running.\"\n\n[27-38s] On-screen: 3. Daily coffee\n\"Three: a Rp25k coffee every workday. That's over Rp500k a month.\"\n\n[38-45s] (show the app screen)\n\"I only noticed after logging everything in [app name]. Try it for just one week, you'll be shocked. Link in bio.\"",
        ),
      },
      {
        judul: _("Buat kerangka skrip YouTube 8 menit", "Outline an 8-minute YouTube script"),
        brief: _(
          "Channel kami membahas karier. Topik video berikutnya: \"Cara negosiasi gaji pertama kali (tanpa terlihat serakah)\". Tolong buat kerangka skripnya dengan perkiraan durasi per bagian.",
          "Our channel covers careers. Next video topic: \"How to negotiate your first salary (without looking greedy)\". Please outline the script with estimated durations per section.",
        ),
        langkah: [
          _("Tulis judul alternatif dan hook pembuka.", "Write alternative titles and an opening hook."),
          _("Susun bagian isi dengan durasi.", "Lay out body sections with durations."),
          _("Tambahkan momen untuk menjaga perhatian di tengah video.", "Add moments to hold attention mid-video."),
        ],
        rubrik: [
          _("Hook pembuka menjanjikan hasil yang jelas", "Opening hook promises a clear payoff"),
          _("Struktur runtut dengan durasi yang masuk akal (total sekitar 8 menit)", "Logical structure with realistic durations (about 8 minutes total)"),
          _("Ada contoh kalimat negosiasi yang konkret", "Includes concrete negotiation phrases"),
          _("Ada teknik menjaga retensi (cerita, contoh, pratinjau)", "Uses retention techniques (stories, examples, previews)"),
          _("Ada ajakan penutup", "Has a closing call to action"),
        ],
        contoh: _(
          "Judul alternatif: \"Ditanya Ekspektasi Gaji? Jawab Begini\" / \"Negosiasi Gaji Pertama: Kalimat yang Bisa Kamu Tiru\"\n\n[0:00-0:30] Hook: \"Kalau kamu menjawab 'terserah perusahaan' saat ditanya gaji, kamu mungkin kehilangan jutaan rupiah per tahun. Di video ini aku kasih kalimat persis yang bisa kamu pakai.\"\n[0:30-1:30] Kenapa fresh graduate takut negosiasi (cerita singkat)\n[1:30-3:00] Langkah 1: riset kisaran gaji (Peta gaji, info lowongan, tanya senior)\n[3:00-4:30] Langkah 2: cara menjawab pertanyaan ekspektasi gaji + contoh kalimat\n[4:30-5:00] Pratinjau: \"Bagian berikutnya paling sering salah...\"\n[5:00-6:30] Langkah 3: merespons tawaran yang di bawah harapan, termasuk menegosiasikan hal selain gaji\n[6:30-7:30] Kesalahan yang membuat terlihat serakah\n[7:30-8:00] Ringkasan 3 langkah + ajakan menonton video tentang interview",
          "Alternative titles: \"Asked Your Salary Expectation? Say This\" / \"First Salary Negotiation: Lines You Can Copy\"\n\n[0:00-0:30] Hook: \"If you answer 'whatever the company offers' when asked about salary, you could lose millions of rupiah a year. In this video I'll give you the exact lines to use.\"\n[0:30-1:30] Why fresh grads fear negotiating (short story)\n[1:30-3:00] Step 1: research the salary range (salary maps, job listings, asking seniors)\n[3:00-4:30] Step 2: answering the expectation question + example lines\n[4:30-5:00] Preview: \"The next part is where most people go wrong...\"\n[5:00-6:30] Step 3: responding to a low offer, including negotiating beyond salary\n[6:30-7:30] Mistakes that make you look greedy\n[7:30-8:00] 3-step recap + prompt to watch the interview video",
        ),
      },
    ],
  },

  penerjemah: {
    kuis: [
      {
        q: _("Terjemahan terbaik untuk \"Break a leg!\" dalam konteks menyemangati teman sebelum pentas?", "Best Indonesian rendering of \"Break a leg!\" when cheering on a friend before a show?"),
        o: [
          _("\"Patahkan kakimu!\"", "\"Patahkan kakimu!\" (literal)"),
          _("\"Semoga sukses, ya!\"", "\"Semoga sukses, ya!\" (good luck)"),
          _("\"Hati-hati jatuh!\"", "\"Hati-hati jatuh!\" (careful not to fall)"),
          _("\"Istirahatkan kakimu\"", "\"Istirahatkan kakimu\" (rest your legs)"),
        ],
        a: 1,
        e: _("Ungkapan idiomatis diterjemahkan berdasarkan maknanya, bukan kata per kata.", "Idioms are translated by meaning, not word for word."),
      },
      {
        q: _("Kamu menerjemahkan dokumen teknis dan menemukan istilah yang diterjemahkan berbeda-beda di bagian sebelumnya. Apa yang sebaiknya dilakukan?", "Translating a technical document, you find a term rendered differently in earlier sections. What should you do?"),
        o: [
          _("Biarkan agar bervariasi", "Leave it for variety"),
          _("Tetapkan satu padanan di glosarium proyek dan seragamkan seluruh dokumen", "Pick one equivalent in the project glossary and make it consistent throughout"),
          _("Pakai istilah bahasa Inggris semua", "Use English for everything"),
          _("Tanyakan ke pembaca", "Ask the readers"),
        ],
        a: 1,
        e: _("Konsistensi istilah sangat penting di dokumen teknis. Glosarium membantu penerjemah dan klien.", "Consistent terminology is essential in technical documents. A glossary helps translator and client alike."),
      },
      {
        q: _("Klien mengirim hasil terjemahan mesin dan meminta \"post-editing ringan\". Apa artinya?", "A client sends machine translation output and asks for \"light post-editing\". What does that mean?"),
        o: [
          _("Menerjemahkan ulang dari nol", "Retranslate from scratch"),
          _("Memperbaiki kesalahan makna dan tata bahasa yang jelas agar bisa dipahami, tanpa memoles gaya secara menyeluruh", "Fix clear meaning and grammar errors so it's understandable, without polishing style throughout"),
          _("Hanya mengecek ejaan nama", "Only check name spellings"),
          _("Menghapus kalimat yang sulit", "Delete hard sentences"),
        ],
        a: 1,
        e: _("Post-editing ringan fokus pada akurasi dan keterbacaan. Post-editing penuh menghasilkan kualitas setara terjemahan manusia.", "Light post-editing focuses on accuracy and readability. Full post-editing aims for human-translation quality."),
      },
      {
        q: _("Saat proofreading, kamu menemukan kalimat sumber yang ambigu dan bisa bermakna dua hal. Langkah yang tepat?", "While proofreading, you find an ambiguous source sentence with two possible meanings. Right step?"),
        o: [
          _("Pilih salah satu tanpa memberi tahu", "Pick one silently"),
          _("Tanyakan ke klien, atau beri catatan di dokumen tentang dua kemungkinan maknanya", "Ask the client, or leave a note in the document about both readings"),
          _("Hapus kalimatnya", "Delete the sentence"),
          _("Terjemahkan keduanya dalam satu kalimat panjang", "Translate both in one long sentence"),
        ],
        a: 1,
        e: _("Penerjemah profesional mengajukan pertanyaan saat ragu. Catatan seperti ini menunjukkan ketelitian.", "Professional translators ask when in doubt. Notes like this show care."),
      },
      {
        q: _("Agensi meminta \"tes terjemahan\" 3.000 kata tanpa bayaran. Bagaimana menyikapinya?", "An agency wants a 3,000-word unpaid \"translation test\". How do you respond?"),
        o: [
          _("Kerjakan semua", "Do it all"),
          _("Tawarkan tes 200 sampai 300 kata, atau minta tes yang panjang dibayar", "Offer a 200 to 300-word test, or ask for the longer one to be paid"),
          _("Pakai mesin penerjemah", "Use machine translation"),
          _("Abaikan semua agensi", "Ignore all agencies"),
        ],
        a: 1,
        e: _("Tes terjemahan wajar biasanya pendek. Tes ribuan kata bisa jadi cara mendapat terjemahan gratis.", "Reasonable translation tests are short. Thousands of words may be a way to get free work."),
      },
    ],
    tugas: [
      {
        judul: _("Terjemahkan teks promosi dengan nada yang tepat", "Translate promotional copy with the right tone"),
        brief: _(
          "Terjemahkan teks promosi aplikasi ini ke bahasa Indonesia untuk pengguna muda. Jangan kaku.\n\n\"Say goodbye to messy group chats. Split bills in seconds, track who owes what, and settle up without the awkward reminders. Your wallet (and your friendships) will thank you.\"",
          "Translate this app promo into English for an international audience. Keep it natural.\n\n\"Ucapkan selamat tinggal pada chat grup yang berantakan. Bagi tagihan dalam hitungan detik, pantau siapa berutang apa, dan lunasi tanpa perlu mengingatkan dengan canggung. Dompetmu (dan pertemananmu) akan berterima kasih.\"",
        ),
        langkah: [
          _("Terjemahkan dengan nada santai yang sesuai target pengguna.", "Translate with a casual tone suited to the audience."),
          _("Pertahankan makna dan lelucon di kalimat terakhir.", "Keep the meaning and the joke in the last line."),
          _("Jelaskan dua pilihan kata yang kamu ambil.", "Explain two word choices you made."),
        ],
        rubrik: [
          _("Makna utuh, tidak ada informasi yang hilang", "Meaning intact, nothing lost"),
          _("Nada santai dan alami, tidak terasa terjemahan", "Casual and natural, doesn't read like a translation"),
          _("Lelucon tentang dompet dan pertemanan tetap terasa", "The wallet-and-friendship joke still lands"),
          _("Penjelasan pilihan kata masuk akal", "Word choice explanations are sensible"),
        ],
        contoh: _(
          "\"Tidak perlu lagi pusing dengan chat grup yang berantakan. Bagi tagihan dalam hitungan detik, pantau siapa yang masih berutang, dan lunasi tanpa harus menagih dengan canggung. Dompetmu (dan pertemananmu) bakal berterima kasih.\"\n\nPilihan kata:\n• \"Say goodbye\" diterjemahkan menjadi \"tidak perlu lagi pusing\", karena \"ucapkan selamat tinggal\" terasa kaku untuk iklan.\n• \"Awkward reminders\" menjadi \"menagih dengan canggung\", karena \"menagih\" lebih dekat dengan pengalaman sehari-hari pengguna Indonesia.",
          "\"Goodbye, messy group chats. Split bills in seconds, see who still owes what, and settle up without the awkward reminders. Your wallet (and your friendships) will thank you.\"\n\nWord choices:\n• \"Ucapkan selamat tinggal\" became \"Goodbye\" as a punchy opener, which suits ad copy better than a literal \"say goodbye to\".\n• \"Mengingatkan dengan canggung\" became \"awkward reminders\", the natural English phrase for chasing friends for money.",
        ),
      },
      {
        judul: _("Proofreading dokumen terjemahan", "Proofread a translated document"),
        brief: _(
          "Tolong periksa terjemahan email resmi berikut dan perbaiki kesalahannya:\n\"Dengan hormat, Kami ingin menginformasikan bahwa meeting yang akan datang telah di reschedule menjadi hari Kamis tanggal 14 maret. Mohon untuk konfirmasi kehadiran anda paling lambat Selasa. Terimakasih atas perhatiannya.\"",
          "Please proofread this formal English email and fix the errors:\n\"Dear Sir/Madam, We would like to inform you that the upcoming meeting have been reschedule to thursday, March 14. Please confirm you're attendance by tuesday at latest. Thank you for you're attention.\"",
        ),
        langkah: [
          _("Tulis versi yang sudah diperbaiki.", "Write the corrected version."),
          _("Buat daftar kesalahan yang diperbaiki.", "List the errors you fixed."),
          _("Beri satu saran gaya untuk email resmi.", "Give one style tip for formal emails."),
        ],
        rubrik: [
          _("Memperbaiki penulisan kata (di-reschedule atau dijadwalkan ulang, terima kasih)", "Fixes word forms (have → has, reschedule → rescheduled)"),
          _("Memperbaiki huruf kapital (Maret, Anda)", "Fixes capitalisation (Thursday, Tuesday)"),
          _("Memperbaiki atau mengganti istilah asing yang tidak perlu dalam email resmi", "Fixes your/you're confusion"),
          _("Hasil akhir rapi dan formal", "Final version is clean and formal"),
        ],
        contoh: _(
          "Versi perbaikan:\n\"Dengan hormat,\n\nKami ingin menginformasikan bahwa rapat yang akan datang telah dijadwalkan ulang menjadi hari Kamis, 14 Maret. Mohon konfirmasi kehadiran Anda paling lambat hari Selasa.\n\nTerima kasih atas perhatiannya.\"\n\nPerbaikan:\n• \"meeting\" menjadi \"rapat\" dan \"di reschedule\" menjadi \"dijadwalkan ulang\" (istilah Indonesia lebih tepat untuk email resmi)\n• \"maret\" menjadi \"Maret\" dan \"anda\" menjadi \"Anda\" (huruf kapital)\n• \"Terimakasih\" menjadi \"Terima kasih\" (dipisah)\n• \"Mohon untuk konfirmasi\" menjadi \"Mohon konfirmasi\" (lebih ringkas)\n\nSaran gaya: dalam email resmi, utamakan padanan bahasa Indonesia; jika istilah asing perlu dipakai, cetak miring.",
          "Corrected version:\n\"Dear Sir or Madam,\n\nWe would like to inform you that the upcoming meeting has been rescheduled to Thursday, 14 March. Please confirm your attendance by Tuesday at the latest.\n\nThank you for your attention.\"\n\nFixes:\n• \"have been reschedule\" → \"has been rescheduled\" (subject-verb agreement and past participle)\n• \"thursday\" and \"tuesday\" → \"Thursday\" and \"Tuesday\" (capitalised days)\n• \"you're attendance\" and \"you're attention\" → \"your\" (possessive, not \"you are\")\n• \"by tuesday at latest\" → \"by Tuesday at the latest\"\n\nStyle tip: in formal emails, keep sentences short and avoid contractions.",
        ),
      },
    ],
  },

  "technical-writer": {
    kuis: [
      {
        q: _("Instruksi mana yang paling jelas untuk panduan pengguna?", "Which instruction is clearest for a user guide?"),
        o: [
          _("\"Pengaturan dapat diubah jika diperlukan melalui menu yang tersedia.\"", "\"Settings can be changed if needed via the available menu.\""),
          _("\"Klik Pengaturan > Notifikasi, lalu matikan Email Promosi.\"", "\"Click Settings > Notifications, then turn off Promotional Emails.\""),
          _("\"Silakan atur sesuai keinginan.\"", "\"Adjust as you like.\""),
          _("\"Notifikasi bisa diatur.\"", "\"Notifications can be configured.\""),
        ],
        a: 1,
        e: _("Instruksi yang baik menyebut tombol dan menu persis seperti di layar, dalam kalimat perintah yang aktif.", "Good instructions name buttons and menus exactly as on screen, using active imperative sentences."),
      },
      {
        q: _("Siapa yang perlu kamu pahami pertama kali sebelum menulis dokumentasi?", "Who do you need to understand first before writing documentation?"),
        o: [
          _("Pesaing produk", "Competitors"),
          _("Pembaca: siapa mereka, apa yang ingin mereka capai, dan seberapa paham teknis mereka", "The reader: who they are, what they want to achieve, and how technical they are"),
          _("Investor perusahaan", "Investors"),
          _("Tim desain logo", "The logo design team"),
        ],
        a: 1,
        e: _("Dokumen untuk developer sangat berbeda dengan dokumen untuk pelanggan awam. Kenali pembacanya dulu.", "Docs for developers differ greatly from docs for everyday customers. Know your reader first."),
      },
      {
        q: _("Produk baru diperbarui dan tampilan menu berubah. Apa yang terjadi jika dokumentasi tidak ikut diperbarui?", "The product updated and its menus changed. What happens if docs aren't updated?"),
        o: [
          _("Tidak ada masalah", "Nothing"),
          _("Pengguna bingung, tiket bantuan naik, dan kepercayaan pada dokumentasi turun", "Users get confused, support tickets rise, and trust in the docs drops"),
          _("Produk menjadi lebih cepat", "The product gets faster"),
          _("Pengguna otomatis paham", "Users automatically understand"),
        ],
        a: 1,
        e: _("Dokumentasi yang usang lebih berbahaya daripada tidak ada dokumentasi. Jadikan pembaruan dokumen bagian dari rilis.", "Outdated docs can be worse than none. Make doc updates part of every release."),
      },
      {
        q: _("Format apa yang sering dipakai untuk dokumentasi developer yang disimpan bersama kode?", "Which format is common for developer docs stored alongside code?"),
        o: [
          _("File Word yang dikirim lewat email", "Word files sent by email"),
          _("Markdown di repositori Git", "Markdown in a Git repository"),
          _("Foto tulisan tangan", "Photos of handwriting"),
          _("Presentasi PowerPoint", "PowerPoint decks"),
        ],
        a: 1,
        e: _("Markdown di Git memungkinkan dokumentasi ditinjau dan diperbarui bersama perubahan kode (docs as code).", "Markdown in Git lets docs be reviewed and updated alongside code (docs as code)."),
      },
      {
        q: _("Klien memintamu menulis dokumentasi lengkap untuk aplikasinya tetapi tidak memberi akses ke aplikasi atau tim. Apa yang sebaiknya dilakukan?", "A client wants complete docs for their app but gives no access to the app or team. What should you do?"),
        o: [
          _("Menebak cara kerjanya", "Guess how it works"),
          _("Minta akses ke versi uji, demo, atau sesi tanya jawab dengan tim, karena dokumentasi tanpa akses berisiko salah", "Ask for a test build, a demo, or Q&A with the team, since docs without access risk being wrong"),
          _("Salin dokumentasi aplikasi lain", "Copy another app's docs"),
          _("Tulis seadanya", "Write whatever"),
        ],
        a: 1,
        e: _("Akurasi adalah nilai utama technical writer. Tanpa akses, kualitas dokumen tidak bisa dijamin.", "Accuracy is a technical writer's core value. Without access, quality can't be guaranteed."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis artikel bantuan langkah demi langkah", "Write a step-by-step help article"),
        brief: _(
          "Tolong tulis artikel pusat bantuan untuk fitur aplikasi kasir kami: \"Cara mengembalikan dana (refund) transaksi\". Langkahnya: buka menu Riwayat, pilih transaksi, ketuk Refund, pilih item yang dikembalikan, pilih metode pengembalian (tunai atau saldo), lalu masukkan PIN supervisor. Refund hanya bisa dilakukan maksimal 7 hari setelah transaksi.",
          "Please write a help centre article for our POS app: \"How to refund a transaction\". Steps: open History, select the transaction, tap Refund, choose the items being returned, choose the refund method (cash or balance), then enter the supervisor PIN. Refunds are only possible within 7 days of the transaction.",
        ),
        langkah: [
          _("Tulis judul dan satu kalimat pengantar.", "Write a title and a one-sentence intro."),
          _("Tulis langkah bernomor dengan nama menu yang ditebalkan.", "Write numbered steps with bold menu names."),
          _("Tambahkan catatan penting dan bagian \"masalah umum\".", "Add an important note and a \"common problems\" section."),
        ],
        rubrik: [
          _("Langkah bernomor, satu tindakan per langkah", "Numbered steps, one action each"),
          _("Nama menu dan tombol konsisten dan ditandai", "Menu and button names consistent and marked"),
          _("Batas 7 hari disebut sebelum langkah dimulai", "The 7-day limit appears before the steps"),
          _("Menyebut kebutuhan PIN supervisor", "Mentions the supervisor PIN requirement"),
          _("Ada bagian masalah umum yang berguna", "Has a useful common problems section"),
        ],
        contoh: _(
          "Cara mengembalikan dana (refund) transaksi\n\nGunakan fitur ini jika pelanggan mengembalikan sebagian atau seluruh barang yang sudah dibayar.\n\nSebelum mulai:\n• Refund hanya bisa dilakukan maksimal 7 hari setelah transaksi\n• Siapkan PIN supervisor\n\nLangkah:\n1. Buka menu **Riwayat**.\n2. Pilih transaksi yang ingin di-refund.\n3. Ketuk **Refund**.\n4. Pilih item yang dikembalikan, lalu ketuk **Lanjut**.\n5. Pilih metode pengembalian: **Tunai** atau **Saldo**.\n6. Minta supervisor memasukkan PIN, lalu ketuk **Konfirmasi**.\n\nMasalah umum:\n• Tombol Refund tidak muncul → transaksi sudah lebih dari 7 hari\n• PIN ditolak → pastikan memakai PIN supervisor, bukan PIN kasir",
          "How to refund a transaction\n\nUse this when a customer returns some or all of a paid order.\n\nBefore you start:\n• Refunds are only possible within 7 days of the transaction\n• Have the supervisor PIN ready\n\nSteps:\n1. Open **History**.\n2. Select the transaction to refund.\n3. Tap **Refund**.\n4. Choose the returned items, then tap **Next**.\n5. Choose the refund method: **Cash** or **Balance**.\n6. Ask a supervisor to enter their PIN, then tap **Confirm**.\n\nCommon problems:\n• No Refund button → the transaction is over 7 days old\n• PIN rejected → make sure it's the supervisor PIN, not a cashier PIN",
        ),
      },
      {
        judul: _("Sederhanakan penjelasan teknis", "Simplify a technical explanation"),
        brief: _(
          "Tulisan dari tim engineer: \"Sinkronisasi data dilakukan secara asinkron melalui mekanisme antrean, sehingga perubahan dari perangkat offline akan dipropagasi ke server ketika konektivitas jaringan kembali tersedia, dengan resolusi konflik berbasis timestamp terakhir.\" Ubah menjadi penjelasan untuk pemilik toko yang tidak paham teknologi.",
          "From the engineering team: \"Data synchronisation is performed asynchronously via a queuing mechanism, so changes from offline devices propagate to the server when network connectivity is restored, with last-write-wins conflict resolution.\" Rewrite it for a shop owner with no tech background.",
        ),
        langkah: [
          _("Tulis ulang dalam 2 sampai 4 kalimat sederhana.", "Rewrite in 2 to 4 simple sentences."),
          _("Jelaskan dampaknya bagi pengguna dengan contoh.", "Explain the user impact with an example."),
          _("Tambahkan satu tips praktis.", "Add one practical tip."),
        ],
        rubrik: [
          _("Tanpa istilah teknis yang membingungkan", "No confusing jargon"),
          _("Makna tetap akurat (data tersimpan saat offline dan dikirim saat online)", "Meaning stays accurate (saved offline, sent when online)"),
          _("Menjelaskan konflik data dengan contoh sederhana", "Explains data conflicts with a simple example"),
          _("Ada tips praktis yang relevan", "Includes a relevant practical tip"),
        ],
        contoh: _(
          "Aplikasi tetap bisa dipakai saat internet mati. Semua transaksi disimpan di HP, lalu dikirim otomatis ke server begitu internet kembali tersambung.\n\nJika data yang sama diubah di dua HP saat offline, misalnya harga kopi diubah di HP kasir dan di HP pemilik, yang dipakai adalah perubahan yang dilakukan paling akhir.\n\nTips: setelah mengubah harga atau stok, pastikan HP tersambung ke internet sebentar agar perubahan langsung tersimpan di server.",
          "The app keeps working when the internet is down. Every transaction is saved on the phone, then sent to the server automatically once the internet is back.\n\nIf the same data is changed on two phones while offline, say the coffee price is edited on the cashier's phone and the owner's phone, the most recent change wins.\n\nTip: after changing prices or stock, make sure the phone connects to the internet briefly so the change is saved right away.",
        ),
      },
    ],
  },
};
