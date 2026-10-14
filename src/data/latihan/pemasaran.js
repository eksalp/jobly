import { t as _ } from "../../i18n.js";

/** Latihan praktik kategori Pemasaran Digital. */
export default {
  "admin-media-sosial": {
    kuis: [
      {
        q: _("Unggahan brand mendapat banyak komentar negatif soal kualitas produk. Langkah pertama yang paling tepat?", "A brand post gets lots of negative comments about product quality. Best first step?"),
        o: [
          _("Hapus semua komentar negatif", "Delete all negative comments"),
          _("Balas dengan tenang, akui masalahnya, arahkan ke DM atau CS, dan laporkan ke klien", "Reply calmly, acknowledge the issue, direct them to DMs or support, and alert the client"),
          _("Balas dengan membela produk secara keras", "Reply by defending the product aggressively"),
          _("Arsipkan unggahannya tanpa memberi tahu klien", "Archive the post without telling the client"),
        ],
        a: 1,
        e: _("Menghapus komentar sering memperbesar masalah. Respons yang tenang dan cepat menunjukkan brand peduli, dan klien perlu tahu sejak awal.", "Deleting comments often makes things worse. A calm, quick response shows the brand cares, and the client needs to know early."),
      },
      {
        q: _("Metrik mana yang paling menunjukkan konten benar-benar menarik bagi audiens?", "Which metric best shows content truly resonates with the audience?"),
        o: [
          _("Jumlah pengikut total", "Total followers"),
          _("Engagement rate, seperti simpan, bagikan, dan komentar dibanding jangkauan", "Engagement rate, such as saves, shares, and comments relative to reach"),
          _("Jumlah hashtag", "Number of hashtags"),
          _("Jumlah unggahan per hari", "Posts per day"),
        ],
        a: 1,
        e: _("Pengikut bisa saja pasif. Simpan dan bagikan menunjukkan konten dianggap bernilai.", "Followers can be passive. Saves and shares show the content is valued."),
      },
      {
        q: _("Klien ingin memakai lagu populer di Reels untuk iklan berbayar. Apa yang perlu diperhatikan?", "The client wants a popular song in a Reel used as a paid ad. What should you watch for?"),
        o: [
          _("Tidak ada, semua lagu bebas dipakai", "Nothing, all songs are free to use"),
          _("Lagu populer sering dibatasi untuk konten komersial atau iklan; gunakan musik dari pustaka bebas royalti atau audio komersial yang disediakan platform", "Popular songs are often restricted for commercial use or ads; use royalty-free or the platform's commercial audio"),
          _("Cukup tulis nama penyanyi di caption", "Just credit the singer in the caption"),
          _("Pakai hanya 10 detik", "Use only 10 seconds"),
        ],
        a: 1,
        e: _("Akun bisnis dan iklan punya batasan musik yang lebih ketat. Melanggarnya bisa membuat audio dibisukan atau iklan ditolak.", "Business accounts and ads face stricter music limits. Breaking them can get audio muted or ads rejected."),
      },
      {
        q: _("Kapan waktu terbaik mengunggah konten untuk akun klien?", "When's the best time to post for a client's account?"),
        o: [
          _("Selalu jam 12 siang", "Always at noon"),
          _("Berdasarkan data insight akun tentang kapan pengikutnya paling aktif, lalu diuji", "Based on account insights about when followers are most active, then tested"),
          _("Tengah malam supaya sepi persaingan", "Midnight to avoid competition"),
          _("Sesuai jadwal admin sendiri", "Whenever suits the admin"),
        ],
        a: 1,
        e: _("Setiap akun punya pola audiens berbeda. Insight akun dan uji coba lebih andal daripada aturan umum.", "Every account has a different audience pattern. Insights and testing beat general rules."),
      },
      {
        q: _("Seseorang mengirim DM ke akun klien: \"Akun Anda melanggar hak cipta, klik tautan ini dalam 24 jam untuk banding.\" Apa yang dilakukan?", "Someone DMs the client's account: \"Your account violates copyright, click this link within 24 hours to appeal.\" What do you do?"),
        o: [
          _("Klik dan isi data login secepatnya", "Click and log in quickly"),
          _("Abaikan tautannya, cek status akun langsung di aplikasi, dan laporkan pesannya", "Ignore the link, check account status directly in the app, and report the message"),
          _("Teruskan ke semua tim untuk diklik", "Forward it to the team to click"),
          _("Balas dan minta perpanjangan waktu", "Reply and ask for more time"),
        ],
        a: 1,
        e: _("Ini phishing yang umum menyasar akun bisnis. Pemberitahuan resmi muncul di dalam aplikasi, bukan lewat DM dengan tautan luar.", "This is common phishing aimed at business accounts. Real notices appear inside the app, not via DMs with outside links."),
      },
    ],
    tugas: [
      {
        judul: _("Susun kalender konten satu minggu", "Plan one week of content"),
        brief: _(
          "Saya punya kedai kopi kekinian di Malang, target pelanggan mahasiswa dan pekerja muda. Minggu depan ada menu baru: Es Kopi Pandan. Tolong buat rencana konten Instagram 1 minggu.",
          "I run a trendy coffee shop in Malang targeting students and young workers. Next week we're launching a new drink: Iced Pandan Coffee. Please plan one week of Instagram content.",
        ),
        langkah: [
          _("Buat 5 rencana unggahan (hari, format, ide, caption singkat).", "Plan 5 posts (day, format, idea, short caption)."),
          _("Variasikan format: Reels, carousel, dan Story.", "Mix formats: Reels, carousel, and Stories."),
          _("Tentukan satu cara mengukur keberhasilan minggu ini.", "Pick one way to measure success this week."),
        ],
        rubrik: [
          _("Ada alur: teaser, peluncuran, dan pengingat", "Has a flow: teaser, launch, and reminder"),
          _("Format bervariasi dan sesuai tujuan", "Formats vary and fit each goal"),
          _("Caption singkat dengan ajakan bertindak", "Short captions with a call to action"),
          _("Sesuai target audiens mahasiswa dan pekerja muda", "Fits the student and young worker audience"),
          _("Ada metrik keberhasilan yang jelas", "Has a clear success metric"),
        ],
        contoh: _(
          "Senin, Story polling: \"Pandan atau gula aren?\" (teaser tanpa menyebut menu)\nRabu, Reels 15 detik: proses meracik Es Kopi Pandan. Caption: \"Hijau, wangi, dan dingin. Mulai Kamis di semua outlet.\"\nKamis, carousel peluncuran: foto menu, rasa, harga, dan promo beli 2 gratis 1 cookies untuk mahasiswa (tunjukkan KTM). Caption: \"Es Kopi Pandan resmi hadir! Simpan postingan ini untuk nongkrong akhir pekan.\"\nJumat, Story ulang unggahan pelanggan yang menandai akun\nMinggu, Reels: reaksi pelanggan mencoba pertama kali\n\nUkuran keberhasilan: jumlah Es Kopi Pandan terjual dan jumlah pelanggan yang menunjukkan KTM untuk promo.",
          "Monday, Story poll: \"Pandan or palm sugar?\" (teaser without naming the drink)\nWednesday, 15-second Reel: making the Iced Pandan Coffee. Caption: \"Green, fragrant, and cold. Starting Thursday at every outlet.\"\nThursday, launch carousel: photo, flavour, price, and a buy 2 get 1 free cookie deal for students (show student ID). Caption: \"Iced Pandan Coffee is here! Save this for your weekend hangout.\"\nFriday, Stories resharing customers who tagged us\nSunday, Reel: customers' first-sip reactions\n\nSuccess metric: Iced Pandan Coffee units sold and how many customers used the student ID deal.",
        ),
      },
      {
        judul: _("Tulis laporan bulanan untuk klien", "Write a monthly report for the client"),
        brief: _(
          "Data bulan ini: jangkauan 48.000 (bulan lalu 31.000), pengikut naik 620 (bulan lalu 410), engagement rate 3,2% (bulan lalu 4,1%). Reels dengan performa terbaik: video behind the scenes dengan 18.000 tayangan. Klien hanya punya waktu baca 2 menit.",
          "This month: reach 48,000 (last month 31,000), followers up 620 (last month 410), engagement rate 3.2% (last month 4.1%). Best-performing Reel: a behind-the-scenes video with 18,000 views. The client has 2 minutes to read.",
        ),
        langkah: [
          _("Tulis ringkasan dengan angka penting dan perbandingannya.", "Write a summary with key numbers and comparisons."),
          _("Jelaskan penurunan engagement rate secara jujur.", "Explain the engagement rate drop honestly."),
          _("Usulkan 2 rencana untuk bulan depan.", "Propose 2 plans for next month."),
        ],
        rubrik: [
          _("Persentase perubahan jangkauan benar (sekitar +55%)", "Reach change correct (about +55%)"),
          _("Penurunan engagement rate tidak disembunyikan", "Engagement drop isn't hidden"),
          _("Ada penjelasan masuk akal untuk penurunan itu", "Gives a sensible explanation for it"),
          _("Rencana bulan depan berbasis data (misalnya lebih banyak konten behind the scenes)", "Next month's plan is data-based (e.g. more behind-the-scenes)"),
          _("Ringkas dan bisa dibaca dalam 2 menit", "Concise, readable in 2 minutes"),
        ],
        contoh: _(
          "Ringkasan Oktober\n• Jangkauan 48.000, naik sekitar 55% dari 31.000\n• Pengikut baru 620, naik dari 410\n• Engagement rate 3,2%, turun dari 4,1%\n\nKenapa engagement rate turun? Banyak orang baru melihat konten kita (jangkauan naik tajam), tetapi belum semuanya berinteraksi. Ini wajar saat akun menjangkau audiens baru. Jumlah interaksi totalnya tetap naik.\n\nKonten terbaik: Reels behind the scenes, 18.000 tayangan.\n\nRencana November:\n1. Tambah konten behind the scenes menjadi 2 kali seminggu\n2. Tambah ajakan berkomentar di caption (pertanyaan sederhana) untuk menaikkan interaksi audiens baru",
          "October summary\n• Reach 48,000, up about 55% from 31,000\n• 620 new followers, up from 410\n• Engagement rate 3.2%, down from 4.1%\n\nWhy did engagement rate drop? Many new people saw our content (reach rose sharply), but not all interacted yet. That's normal when reaching new audiences. Total interactions still went up.\n\nBest content: the behind-the-scenes Reel, 18,000 views.\n\nNovember plan:\n1. Increase behind-the-scenes content to twice a week\n2. Add comment prompts in captions (simple questions) to lift engagement from new viewers",
        ),
      },
    ],
  },

  "ads-specialist": {
    kuis: [
      {
        q: _("Iklan menghabiskan Rp5 juta dan menghasilkan penjualan Rp20 juta. Berapa ROAS-nya?", "An ad spent Rp5m and generated Rp20m in sales. What's the ROAS?"),
        o: [
          _("0,25", "0.25"),
          _("4 (atau 400%)", "4 (or 400%)"),
          _("15", "15"),
          _("25%", "25%"),
        ],
        a: 1,
        e: _("ROAS = pendapatan dari iklan / biaya iklan = 20 / 5 = 4. Tetapi ROAS tinggi belum tentu untung; margin produk juga harus dihitung.", "ROAS = ad revenue / ad spend = 20 / 5 = 4. A high ROAS isn't always profitable; product margin matters too."),
      },
      {
        q: _("CTR iklan tinggi, tetapi hampir tidak ada yang membeli. Di mana masalah yang paling mungkin?", "An ad has a high CTR but almost nobody buys. Where's the likely problem?"),
        o: [
          _("Gambar iklannya kurang menarik", "The ad image isn't appealing"),
          _("Halaman tujuan (landing page), harga, atau kesesuaian pesan iklan dengan halaman", "The landing page, price, or mismatch between the ad and the page"),
          _("Anggaran terlalu kecil", "Budget is too small"),
          _("Terlalu banyak orang yang mengklik", "Too many people click"),
        ],
        a: 1,
        e: _("CTR tinggi berarti iklan berhasil menarik klik. Jika tidak terjadi pembelian, cek apa yang dilihat orang setelah klik.", "A high CTR means the ad gets clicks. If nobody buys, check what people see after clicking."),
      },
      {
        q: _("Kamu ingin menguji dua judul iklan. Cara yang benar?", "You want to test two ad headlines. What's the right approach?"),
        o: [
          _("Ubah judul, gambar, dan target sekaligus", "Change headline, image, and targeting at once"),
          _("Ubah hanya judulnya, sisanya sama, lalu jalankan sampai datanya cukup", "Change only the headline, keep the rest the same, and run until there's enough data"),
          _("Jalankan satu hari lalu pilih yang menang", "Run for one day and pick the winner"),
          _("Tanyakan pendapat teman", "Ask friends' opinions"),
        ],
        a: 1,
        e: _("Uji A/B yang valid hanya mengubah satu variabel. Data yang terlalu sedikit bisa menyesatkan.", "A valid A/B test changes one variable. Too little data can mislead."),
      },
      {
        q: _("Produk dijual Rp100.000 dengan margin kotor 40%. Berapa biaya iklan maksimal per penjualan agar tidak rugi?", "A product sells for Rp100,000 at a 40% gross margin. What's the maximum ad cost per sale to break even?"),
        o: [
          _("Rp100.000", "Rp100,000"),
          _("Rp40.000", "Rp40,000"),
          _("Rp60.000", "Rp60,000"),
          _("Rp4.000", "Rp4,000"),
        ],
        a: 1,
        e: _("Margin kotor Rp40.000 per penjualan adalah batas atas biaya akuisisi agar impas, sebelum biaya lain.", "The Rp40,000 gross margin per sale is the break-even ceiling for acquisition cost, before other costs."),
      },
      {
        q: _("Klien memintamu memakai kartu kredit pribadimu untuk membayar iklan dan \"diganti nanti setelah ada penjualan\". Risiko utamanya?", "A client asks you to pay for ads with your personal credit card, \"reimbursed once sales come in\". Main risk?"),
        o: [
          _("Tidak ada risiko", "No risk"),
          _("Kamu menanggung kerugian jika klien tidak membayar; seharusnya klien membayar iklan dari akunnya sendiri", "You carry the loss if the client doesn't pay; clients should fund ads from their own account"),
          _("Iklan jadi lebih murah", "Ads get cheaper"),
          _("Akun iklan jadi lebih cepat disetujui", "The ad account gets approved faster"),
        ],
        a: 1,
        e: _("Praktik standar: klien memberi akses ke akun iklannya dan membayar langsung ke platform. Kamu dibayar untuk jasanya.", "Standard practice: the client grants access to their ad account and pays the platform directly. You're paid for your service."),
      },
    ],
    tugas: [
      {
        judul: _("Rancang kampanye iklan pertama", "Plan a first ad campaign"),
        brief: _(
          "Saya jual hijab instan premium seharga Rp129.000, margin kotor 50%. Anggaran iklan Rp3 juta untuk percobaan 2 minggu. Penjualan lewat website. Tolong rancang kampanye Meta Ads-nya.",
          "I sell premium instant hijabs at Rp129,000 with a 50% gross margin. Ad budget Rp3m for a 2-week test. Sales are on my website. Please plan the Meta Ads campaign.",
        ),
        langkah: [
          _("Tentukan tujuan kampanye dan target audiens.", "Set the campaign objective and target audience."),
          _("Rencanakan struktur uji (berapa set iklan dan apa yang diuji).", "Plan the test structure (how many ad sets and what's tested)."),
          _("Hitung batas biaya per pembelian dan kapan iklan dihentikan.", "Calculate the cost-per-purchase ceiling and when to stop ads."),
        ],
        rubrik: [
          _("Tujuan kampanye penjualan atau konversi, bukan sekadar jangkauan", "Objective is sales or conversions, not just reach"),
          _("Menyebut pemasangan pixel atau pelacakan konversi", "Mentions setting up the pixel or conversion tracking"),
          _("Struktur uji membandingkan satu variabel", "Test structure compares one variable"),
          _("Batas biaya per pembelian dihitung benar (sekitar Rp64.500)", "Cost-per-purchase ceiling correct (about Rp64,500)"),
          _("Ada aturan kapan menghentikan atau menaikkan anggaran", "Has rules for when to stop or scale"),
        ],
        contoh: _(
          "Tujuan: Sales (pembelian di website). Pastikan Meta Pixel dan event Purchase sudah terpasang sebelum mulai.\n\nAudiens: perempuan 20 sampai 35 tahun di kota besar, minat busana muslim dan hijab modern.\n\nStruktur uji (Rp3 jt / 14 hari ≈ Rp214 rb per hari):\n• 2 set iklan dengan audiens sama, berbeda kreatif: A video try-on 15 detik, B carousel foto produk dan ulasan pelanggan\n\nBatas biaya: margin kotor 50% × Rp129.000 = Rp64.500. Biaya per pembelian di atas itu berarti rugi.\n\nAturan:\n• Setelah 3 hari, set iklan dengan biaya per pembelian di atas Rp64.500 dan tanpa tren membaik dimatikan\n• Set iklan dengan biaya per pembelian di bawah Rp40.000 dinaikkan anggarannya 20% setiap 2 sampai 3 hari",
          "Objective: Sales (website purchases). Make sure the Meta Pixel and Purchase event are set up before starting.\n\nAudience: women 20 to 35 in major cities, interested in modest fashion and modern hijab styles.\n\nTest structure (Rp3m / 14 days ≈ Rp214k a day):\n• 2 ad sets with the same audience, different creatives: A a 15-second try-on video, B a carousel of product photos and customer reviews\n\nCost ceiling: 50% gross margin × Rp129,000 = Rp64,500. Any cost per purchase above that loses money.\n\nRules:\n• After 3 days, turn off ad sets above Rp64,500 per purchase with no improving trend\n• Raise the budget 20% every 2 to 3 days on ad sets below Rp40,000 per purchase",
        ),
      },
      {
        judul: _("Analisis hasil iklan dan beri rekomendasi", "Analyse ad results and recommend next steps"),
        brief: _(
          "Hasil 7 hari:\nIklan A: biaya Rp1,2 jt, klik 800, pembelian 6\nIklan B: biaya Rp1,1 jt, klik 350, pembelian 14\nIklan C: biaya Rp0,7 jt, klik 600, pembelian 2\nHarga produk Rp150.000, margin kotor Rp60.000. Apa yang harus dilakukan?",
          "7-day results:\nAd A: spend Rp1.2m, 800 clicks, 6 purchases\nAd B: spend Rp1.1m, 350 clicks, 14 purchases\nAd C: spend Rp0.7m, 600 clicks, 2 purchases\nProduct price Rp150,000, gross margin Rp60,000. What should we do?",
        ),
        langkah: [
          _("Hitung biaya per pembelian dan ROAS setiap iklan.", "Calculate cost per purchase and ROAS for each ad."),
          _("Tentukan iklan mana yang dihentikan, dipertahankan, atau dinaikkan.", "Decide which ads to stop, keep, or scale."),
          _("Jelaskan satu temuan yang tidak terlihat jika hanya melihat jumlah klik.", "Explain one insight you'd miss by only looking at clicks."),
        ],
        rubrik: [
          _("Biaya per pembelian benar (A Rp200 rb, B sekitar Rp78,6 rb, C Rp350 rb)", "Cost per purchase correct (A Rp200k, B about Rp78.6k, C Rp350k)"),
          _("ROAS benar (A 0,75, B sekitar 1,9, C sekitar 0,43)", "ROAS correct (A 0.75, B about 1.9, C about 0.43)"),
          _("Menyadari bahwa semua iklan masih di atas margin Rp60.000, termasuk B", "Notices all ads exceed the Rp60,000 margin, including B"),
          _("Rekomendasi logis: hentikan A dan C, perbaiki B sebelum menaikkan anggaran", "Logical recommendation: stop A and C, improve B before scaling"),
          _("Menjelaskan bahwa klik terbanyak (A) belum tentu iklan terbaik", "Explains the most clicks (A) isn't necessarily best"),
        ],
        contoh: _(
          "Biaya per pembelian dan ROAS:\n• A: Rp1.200.000 / 6 = Rp200.000; ROAS = 900.000 / 1.200.000 = 0,75\n• B: Rp1.100.000 / 14 ≈ Rp78.600; ROAS = 2.100.000 / 1.100.000 ≈ 1,9\n• C: Rp700.000 / 2 = Rp350.000; ROAS = 300.000 / 700.000 ≈ 0,43\n\nPenting: margin kotor hanya Rp60.000, jadi ketiganya masih rugi per penjualan, termasuk B.\n\nRekomendasi:\n• Hentikan A dan C\n• Pertahankan B tanpa menaikkan anggaran dulu. Perbaiki halaman produk, uji penawaran bundling untuk menaikkan nilai pesanan, dan targetkan biaya per pembelian di bawah Rp60.000\n\nTemuan: A mendapat klik terbanyak, tetapi B jauh lebih efektif mengubah klik menjadi pembelian (4% dibanding 0,75%). Klik saja tidak menunjukkan kualitas.",
          "Cost per purchase and ROAS:\n• A: Rp1,200,000 / 6 = Rp200,000; ROAS = 900,000 / 1,200,000 = 0.75\n• B: Rp1,100,000 / 14 ≈ Rp78,600; ROAS = 2,100,000 / 1,100,000 ≈ 1.9\n• C: Rp700,000 / 2 = Rp350,000; ROAS = 300,000 / 700,000 ≈ 0.43\n\nKey point: gross margin is only Rp60,000, so all three lose money per sale, including B.\n\nRecommendation:\n• Stop A and C\n• Keep B without scaling yet. Improve the product page, test bundle offers to raise order value, and aim for cost per purchase under Rp60,000\n\nInsight: A got the most clicks, but B converts far better (4% vs 0.75%). Clicks alone don't show quality.",
        ),
      },
    ],
  },

  "seo-specialist": {
    kuis: [
      {
        q: _("Kata kunci mana yang paling cocok untuk toko online sepatu lari kecil yang baru mulai?", "Which keyword suits a small, new online running shoe shop best?"),
        o: [
          _("\"sepatu\"", "\"shoes\""),
          _("\"sepatu lari untuk pemula kaki lebar\"", "\"running shoes for beginners with wide feet\""),
          _("\"olahraga\"", "\"sports\""),
          _("\"sepatu terbaik dunia\"", "\"best shoes in the world\""),
        ],
        a: 1,
        e: _("Kata kunci long-tail lebih spesifik, persaingannya lebih rendah, dan niat pencarinya lebih jelas.", "Long-tail keywords are more specific, less competitive, and show clearer intent."),
      },
      {
        q: _("Di Google Search Console, sebuah halaman punya impresi tinggi tetapi CTR sangat rendah. Perbaikan pertama yang paling masuk akal?", "In Search Console, a page has high impressions but very low CTR. Most sensible first fix?"),
        o: [
          _("Hapus halamannya", "Delete the page"),
          _("Perbaiki judul (title tag) dan meta description agar lebih relevan dan menarik diklik", "Improve the title tag and meta description to be more relevant and clickable"),
          _("Tambah ribuan kata kunci di halaman", "Add thousands of keywords to the page"),
          _("Beli backlink murah", "Buy cheap backlinks"),
        ],
        a: 1,
        e: _("Halaman sudah muncul di hasil pencarian, tetapi jarang diklik. Judul dan deskripsi adalah hal pertama yang dilihat calon pengunjung.", "The page already shows up in results but rarely gets clicked. The title and description are what searchers see first."),
      },
      {
        q: _("Apa praktik yang berisiko membuat situs terkena penalti Google?", "Which practice risks a Google penalty?"),
        o: [
          _("Menulis konten yang menjawab pertanyaan pembaca", "Writing content that answers readers' questions"),
          _("Membeli backlink massal dari jaringan situs berkualitas rendah", "Buying bulk backlinks from low-quality site networks"),
          _("Mempercepat loading halaman", "Speeding up page load"),
          _("Membuat struktur URL yang rapi", "Creating clean URL structures"),
        ],
        a: 1,
        e: _("Skema tautan berbayar melanggar pedoman Google. Risikonya lebih besar dari manfaat sesaatnya.", "Paid link schemes violate Google's guidelines. The risk outweighs any short-term gain."),
      },
      {
        q: _("Dua artikel di situs klien menargetkan kata kunci yang sama persis dan saling bersaing. Solusi yang umum?", "Two articles on the client's site target the exact same keyword and compete. Common fix?"),
        o: [
          _("Biarkan keduanya", "Leave both"),
          _("Gabungkan menjadi satu artikel yang lebih lengkap dan arahkan URL lama dengan redirect 301", "Merge into one stronger article and 301-redirect the old URL"),
          _("Hapus keduanya", "Delete both"),
          _("Ubah tanggal publikasinya", "Change their publish dates"),
        ],
        a: 1,
        e: _("Ini disebut keyword cannibalization. Menggabungkan konten mengumpulkan kekuatan di satu halaman.", "This is keyword cannibalisation. Merging concentrates strength in one page."),
      },
      {
        q: _("Sebuah jasa menjanjikan \"peringkat 1 Google dalam 7 hari, dijamin\" untuk klienmu. Bagaimana menyikapinya?", "A service promises \"guaranteed #1 on Google in 7 days\" for your client. How do you respond?"),
        o: [
          _("Langsung pakai", "Use it right away"),
          _("Waspadai, karena tidak ada yang bisa menjamin peringkat Google, dan cara cepat sering memakai teknik terlarang", "Be wary, nobody can guarantee Google rankings, and fast tricks often use banned techniques"),
          _("Pakai untuk setengah halaman saja", "Use it on half the pages"),
          _("Minta jaminan tertulis", "Ask for a written guarantee"),
        ],
        a: 1,
        e: _("Google sendiri menyatakan tidak ada yang bisa menjamin peringkat. Janji seperti ini adalah tanda bahaya.", "Google itself says nobody can guarantee rankings. Promises like this are a red flag."),
      },
    ],
    tugas: [
      {
        judul: _("Riset kata kunci untuk klinik gigi", "Keyword research for a dental clinic"),
        brief: _(
          "Kami klinik gigi di Semarang dan ingin lebih banyak pasien dari Google. Layanan utama: scaling, tambal gigi, behel, dan pemutihan gigi.",
          "We're a dental clinic in Semarang and want more patients from Google. Main services: scaling, fillings, braces, and teeth whitening.",
        ),
        langkah: [
          _("Buat daftar 8 kata kunci dan kelompokkan menurut niat pencari.", "List 8 keywords grouped by search intent."),
          _("Tentukan halaman mana di website yang menargetkan tiap kelompok.", "Map each group to a page on the website."),
          _("Usulkan 2 ide artikel blog.", "Suggest 2 blog article ideas."),
        ],
        rubrik: [
          _("Ada kata kunci lokal (menyebut Semarang)", "Includes local keywords (mentioning Semarang)"),
          _("Dibedakan niat transaksional dan informasional", "Separates transactional and informational intent"),
          _("Setiap layanan punya halaman sendiri", "Each service has its own page"),
          _("Ide artikel menjawab pertanyaan nyata calon pasien", "Article ideas answer real patient questions"),
        ],
        contoh: _(
          "Transaksional (halaman layanan):\n• klinik gigi semarang → beranda\n• scaling gigi semarang → halaman Scaling\n• pasang behel semarang / harga behel semarang → halaman Behel\n• tambal gigi semarang → halaman Tambal Gigi\n• bleaching gigi semarang → halaman Pemutihan Gigi\n\nInformasional (blog):\n• berapa lama pakai behel\n• apakah scaling gigi sakit\n• perbedaan bleaching dan whitening di rumah\n\nIde artikel:\n1. \"Berapa Lama Pakai Behel? Tahapan dan Perawatannya\"\n2. \"Apakah Scaling Gigi Sakit? Ini Proses dan Tips Sebelum Datang\"\n\nTambahan: lengkapi dan perbarui profil Google Business klinik, karena pencarian lokal sering menampilkan peta terlebih dahulu.",
          "Transactional (service pages):\n• dental clinic semarang → homepage\n• teeth scaling semarang → Scaling page\n• braces semarang / braces price semarang → Braces page\n• tooth filling semarang → Fillings page\n• teeth whitening semarang → Whitening page\n\nInformational (blog):\n• how long do you wear braces\n• does scaling hurt\n• professional vs at-home whitening\n\nArticle ideas:\n1. \"How Long Do You Wear Braces? Stages and Care\"\n2. \"Does Teeth Scaling Hurt? The Process and Tips Before Your Visit\"\n\nExtra: complete and update the clinic's Google Business Profile, since local searches often show the map first.",
        ),
      },
      {
        judul: _("Perbaiki title tag dan meta description", "Fix a title tag and meta description"),
        brief: _(
          "Halaman produk kami:\nTitle: \"Home | Produk | Toko Kami\"\nMeta description: (kosong)\nProduknya: tas ransel laptop anti air 15,6 inci, harga Rp349.000, gratis ongkir Jawa.",
          "Our product page:\nTitle: \"Home | Products | Our Store\"\nMeta description: (empty)\nThe product: water-resistant 15.6-inch laptop backpack, Rp349,000, free shipping across Java.",
        ),
        langkah: [
          _("Tulis title tag baru, maksimal sekitar 60 karakter.", "Write a new title tag, about 60 characters max."),
          _("Tulis meta description, maksimal sekitar 155 karakter.", "Write a meta description, about 155 characters max."),
          _("Jelaskan alasan pilihan katamu.", "Explain your word choices."),
        ],
        rubrik: [
          _("Title memuat kata kunci utama di awal", "Title leads with the main keyword"),
          _("Panjang title dan deskripsi sesuai batas", "Title and description lengths fit the limits"),
          _("Deskripsi memuat manfaat dan ajakan atau keunggulan (harga, ongkir)", "Description includes benefits and a hook (price, shipping)"),
          _("Tidak mengulang kata kunci secara berlebihan", "No keyword stuffing"),
        ],
        contoh: _(
          "Title (48 karakter): Tas Ransel Laptop 15,6 Inci Anti Air | Toko Kami\n\nMeta description (139 karakter): Tas ransel laptop 15,6 inci anti air dengan banyak kompartemen. Rp349.000, gratis ongkir ke seluruh Jawa. Pesan sekarang, dikirim hari ini.\n\nAlasan: kata kunci \"tas ransel laptop\" diletakkan di awal karena itu yang dicari orang. \"Anti air\" dan ukuran membedakan dari produk lain. Harga dan gratis ongkir mendorong klik dari halaman hasil pencarian.",
          "Title (53 characters): Water-Resistant 15.6-Inch Laptop Backpack | Our Store\n\nMeta description (132 characters): Water-resistant 15.6-inch laptop backpack with plenty of compartments. Rp349,000, free shipping across Java. Order now, ships today.\n\nReasoning: \"laptop backpack\" leads because that's what people search. \"Water-resistant\" and the size set it apart. Price and free shipping encourage clicks from the results page.",
        ),
      },
    ],
  },

  "email-marketing": {
    kuis: [
      {
        q: _("Open rate newsletter turun dari 32% ke 18% dalam 2 bulan. Penyebab yang paling perlu dicek dulu?", "Newsletter open rate fell from 32% to 18% in 2 months. What should you check first?"),
        o: [
          _("Warna tombol di dalam email", "Button colour inside the email"),
          _("Masalah deliverability (email masuk spam), kualitas daftar, dan subject line", "Deliverability (landing in spam), list quality, and subject lines"),
          _("Ukuran font", "Font size"),
          _("Jumlah gambar di footer", "Number of footer images"),
        ],
        a: 1,
        e: _("Open rate dipengaruhi apakah email sampai ke inbox dan apakah subject line menarik. Isi email baru berpengaruh setelah dibuka.", "Open rate depends on reaching the inbox and an appealing subject line. Content only matters after opening."),
      },
      {
        q: _("Email otomatis mana yang biasanya paling menghasilkan penjualan untuk toko online?", "Which automated email usually drives the most sales for an online shop?"),
        o: [
          _("Ucapan selamat tahun baru", "Happy new year greeting"),
          _("Pengingat keranjang yang ditinggalkan (abandoned cart)", "Abandoned cart reminder"),
          _("Email perubahan kebijakan privasi", "Privacy policy update"),
          _("Konfirmasi berhenti berlangganan", "Unsubscribe confirmation"),
        ],
        a: 1,
        e: _("Orang yang meninggalkan keranjang sudah sangat dekat dengan pembelian. Pengingat yang tepat waktu sering mengembalikan sebagian dari mereka.", "People who abandon carts are close to buying. A timely reminder often brings some of them back."),
      },
      {
        q: _("Klien ingin mengirim promo ke 10.000 email yang dibelinya dari pihak lain. Apa saranmu?", "The client wants to email a promo to 10,000 addresses bought from a third party. What do you advise?"),
        o: [
          _("Kirim semuanya sekaligus", "Send to all at once"),
          _("Jangan kirim; daftar yang dibeli tidak memberi izin, berisiko spam, dan bisa merusak reputasi domain pengirim", "Don't; bought lists lack consent, risk spam flags, and can ruin the sender domain's reputation"),
          _("Kirim setengahnya dulu", "Send to half first"),
          _("Kirim dari email pribadi", "Send from a personal email"),
        ],
        a: 1,
        e: _("Email marketing yang sehat dibangun dari orang yang memang mendaftar. Daftar beli merusak deliverability semua email berikutnya.", "Healthy email marketing is built on people who opted in. Bought lists damage deliverability for every future email."),
      },
      {
        q: _("Apa tujuan segmentasi daftar email?", "What's the point of segmenting an email list?"),
        o: [
          _("Mengirim lebih banyak email", "To send more emails"),
          _("Mengirim pesan yang lebih relevan berdasarkan perilaku atau minat pelanggan", "To send more relevant messages based on customer behaviour or interest"),
          _("Menghapus pelanggan lama", "To remove old customers"),
          _("Membuat daftar terlihat lebih besar", "To make the list look bigger"),
        ],
        a: 1,
        e: _("Pesan yang relevan menaikkan klik dan menurunkan jumlah yang berhenti berlangganan.", "Relevant messages lift clicks and reduce unsubscribes."),
      },
      {
        q: _("Kamu menerima email \"akun Mailchimp Anda ditangguhkan, verifikasi di sini\" dengan tautan ke domain aneh. Apa yang dilakukan?", "You get an email saying \"your Mailchimp account is suspended, verify here\" linking to an odd domain. What do you do?"),
        o: [
          _("Klik dan masuk agar akun tidak hilang", "Click and log in so you don't lose the account"),
          _("Jangan klik; buka situs resmi secara langsung untuk mengecek status akun", "Don't click; go to the official site directly to check the account"),
          _("Teruskan ke klien untuk diklik", "Forward it to the client to click"),
          _("Balas email itu", "Reply to it"),
        ],
        a: 1,
        e: _("Phishing yang meniru platform email marketing sering menyasar pengelola akun. Selalu cek dari situs resmi, bukan tautan di email.", "Phishing imitating email platforms often targets account managers. Always check via the official site, not email links."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis rangkaian email selamat datang", "Write a welcome email sequence"),
        brief: _(
          "Kami toko skincare lokal. Orang yang mendaftar newsletter mendapat diskon 10%. Tolong rancang 3 email selamat datang yang dikirim otomatis.",
          "We're a local skincare shop. Newsletter sign-ups get a 10% discount. Please design 3 automated welcome emails.",
        ),
        langkah: [
          _("Tentukan waktu kirim setiap email (misalnya hari ke-0, 2, 5).", "Set send timing for each (e.g. day 0, 2, 5)."),
          _("Tulis subject line dan isi singkat masing-masing.", "Write a subject line and short body for each."),
          _("Tentukan satu tujuan untuk setiap email.", "Give each email one goal."),
        ],
        rubrik: [
          _("Email pertama langsung memberi kode diskon", "Email 1 delivers the discount code immediately"),
          _("Ada email yang membangun kepercayaan (cerita brand atau ulasan)", "One email builds trust (brand story or reviews)"),
          _("Ada pengingat sebelum diskon berakhir", "Includes a reminder before the discount expires"),
          _("Subject line singkat dan menarik", "Subject lines are short and compelling"),
          _("Setiap email punya satu ajakan utama", "Each email has one main call to action"),
        ],
        contoh: _(
          "Email 1 (langsung setelah daftar)\nSubject: Kode diskon 10% kamu ada di sini\nIsi: Terima kasih sudah bergabung! Pakai kode HALO10 untuk diskon 10%, berlaku 7 hari. Tombol: Belanja sekarang\nTujuan: pembelian pertama\n\nEmail 2 (hari ke-2)\nSubject: Kenapa kulit sensitif cocok dengan produk kami\nIsi: cerita singkat brand, bahan yang dipakai, dan 3 ulasan pelanggan. Tombol: Temukan produk untuk jenis kulitmu\nTujuan: membangun kepercayaan\n\nEmail 3 (hari ke-5)\nSubject: Diskon 10% berakhir 2 hari lagi\nIsi: pengingat singkat, 3 produk terlaris, kode HALO10. Tombol: Pakai diskonku\nTujuan: mendorong pembelian sebelum diskon habis",
          "Email 1 (right after sign-up)\nSubject: Your 10% discount code is here\nBody: Thanks for joining! Use code HELLO10 for 10% off, valid 7 days. Button: Shop now\nGoal: first purchase\n\nEmail 2 (day 2)\nSubject: Why sensitive skin loves our products\nBody: short brand story, key ingredients, and 3 customer reviews. Button: Find products for your skin type\nGoal: build trust\n\nEmail 3 (day 5)\nSubject: Your 10% off ends in 2 days\nBody: quick reminder, 3 best sellers, code HELLO10. Button: Use my discount\nGoal: purchase before the discount expires",
        ),
      },
      {
        judul: _("Tulis email pengingat keranjang", "Write an abandoned cart email"),
        brief: _(
          "Pelanggan memasukkan sepatu seharga Rp459.000 ke keranjang lalu pergi. Kami ingin email pengingat yang tidak terasa memaksa. Kami bisa memberi gratis ongkir, tetapi tidak diskon harga.",
          "A customer added Rp459,000 shoes to their cart and left. We want a reminder that doesn't feel pushy. We can offer free shipping but no price discount.",
        ),
        langkah: [
          _("Tulis subject line dan preview text.", "Write a subject line and preview text."),
          _("Tulis isi email singkat.", "Write a short email body."),
          _("Tentukan kapan email dikirim dan alasannya.", "Decide when to send it and why."),
        ],
        rubrik: [
          _("Nada ramah, tidak memaksa", "Friendly, not pushy"),
          _("Menampilkan produk yang ditinggalkan", "Shows the abandoned product"),
          _("Menawarkan gratis ongkir, bukan diskon harga", "Offers free shipping, not a price cut"),
          _("Ada satu tombol ajakan yang jelas", "One clear call-to-action button"),
          _("Waktu kirim masuk akal (misalnya 1 sampai 4 jam setelahnya)", "Sensible timing (e.g. 1 to 4 hours later)"),
        ],
        contoh: _(
          "Waktu kirim: 2 jam setelah keranjang ditinggalkan, saat minat masih tinggi.\n\nSubject: Sepatumu masih menunggu\nPreview: Dan ongkirnya gratis untuk kamu\n\nIsi:\nHai [nama],\nSepertinya kamu belum sempat menyelesaikan pesanan. [Foto sepatu] [Nama produk], ukuran [ukuran], Rp459.000.\n\nSupaya lebih ringan, kami gratiskan ongkirnya untuk pesanan ini selama 24 jam.\n\n[Tombol: Selesaikan pesanan]\n\nAda pertanyaan soal ukuran? Balas email ini, tim kami siap membantu.",
          "Send time: 2 hours after the cart is abandoned, while interest is still high.\n\nSubject: Your shoes are still waiting\nPreview: And shipping's on us\n\nBody:\nHi [name],\nLooks like you didn't get to finish your order. [Shoe photo] [Product name], size [size], Rp459,000.\n\nTo make it easier, shipping is free on this order for the next 24 hours.\n\n[Button: Complete my order]\n\nQuestions about sizing? Just reply, our team is happy to help.",
        ),
      },
    ],
  },

  "riset-pasar": {
    kuis: [
      {
        q: _("Pertanyaan survei mana yang paling netral?", "Which survey question is most neutral?"),
        o: [
          _("\"Seberapa suka Anda dengan produk kami yang luar biasa ini?\"", "\"How much do you love our amazing product?\""),
          _("\"Bagaimana penilaian Anda terhadap produk ini?\" dengan skala 1 sampai 5", "\"How would you rate this product?\" on a 1 to 5 scale"),
          _("\"Anda setuju bukan bahwa harga kami murah?\"", "\"You agree our prices are cheap, right?\""),
          _("\"Mengapa Anda lebih memilih kami dibanding kompetitor?\"", "\"Why do you prefer us over competitors?\""),
        ],
        a: 1,
        e: _("Pertanyaan yang mengarahkan (leading question) membuat jawaban bias. Gunakan kata netral dan skala yang seimbang.", "Leading questions bias answers. Use neutral wording and balanced scales."),
      },
      {
        q: _("Klien ingin tahu mengapa pelanggan berhenti berlangganan. Metode awal yang paling tepat?", "The client wants to know why customers cancel. Best initial method?"),
        o: [
          _("Survei dengan pilihan jawaban tetap", "A fixed-choice survey"),
          _("Wawancara mendalam dengan beberapa pelanggan yang berhenti untuk menggali alasannya", "In-depth interviews with a few churned customers to uncover reasons"),
          _("Menebak berdasarkan pengalaman", "Guessing from experience"),
          _("Melihat jumlah pengikut media sosial", "Looking at social follower counts"),
        ],
        a: 1,
        e: _("Saat belum tahu kemungkinan jawabannya, riset kualitatif membantu menemukan alasan. Survei bisa menyusul untuk mengukur seberapa umum alasan itu.", "When you don't know the possible answers yet, qualitative research uncovers them. A survey can follow to measure how common they are."),
      },
      {
        q: _("Survei hanya disebar ke pengikut Instagram brand. Apa keterbatasan hasilnya?", "A survey is only shared with the brand's Instagram followers. What's the limitation?"),
        o: [
          _("Tidak ada keterbatasan", "None"),
          _("Respondennya cenderung sudah menyukai brand, sehingga tidak mewakili pasar yang lebih luas", "Respondents likely already like the brand, so they don't represent the wider market"),
          _("Jumlah pertanyaannya terlalu sedikit", "Too few questions"),
          _("Instagram tidak bisa dipakai untuk survei", "Instagram can't be used for surveys"),
        ],
        a: 1,
        e: _("Ini bias sampel. Tetap boleh dipakai, asalkan keterbatasannya ditulis jelas di laporan.", "This is sampling bias. It's usable as long as the limitation is stated clearly in the report."),
      },
      {
        q: _("Untuk memetakan harga kompetitor di marketplace, sumber mana yang paling bisa dipertanggungjawabkan?", "To map competitor prices on marketplaces, which source is most defensible?"),
        o: [
          _("Ingatan pribadi", "Personal memory"),
          _("Data harga yang dicatat langsung dari halaman produk, lengkap dengan tanggal pengambilan dan tautannya", "Prices recorded directly from product pages, with date and link"),
          _("Komentar di grup Facebook", "Facebook group comments"),
          _("Perkiraan klien", "The client's estimate"),
        ],
        a: 1,
        e: _("Harga berubah cepat. Mencatat tanggal dan sumber membuat data bisa dicek ulang.", "Prices change fast. Recording date and source lets the data be rechecked."),
      },
      {
        q: _("Klien memintamu menyamar sebagai pembeli untuk mengambil daftar pelanggan kompetitor dari grup WhatsApp mereka. Respons yang tepat?", "The client asks you to pose as a buyer to take a competitor's customer list from their WhatsApp group. Right response?"),
        o: [
          _("Lakukan, itu riset biasa", "Do it, it's normal research"),
          _("Tolak; mengambil data pribadi pelanggan pihak lain melanggar etika dan hukum pelindungan data", "Decline; taking another party's customer personal data breaks ethics and data protection law"),
          _("Lakukan tanpa memberi tahu siapa pun", "Do it quietly"),
          _("Ambil sebagian saja", "Take only part of it"),
        ],
        a: 1,
        e: _("Riset kompetitor memakai informasi publik seperti harga, produk, dan ulasan, bukan data pribadi pelanggan mereka.", "Competitor research uses public info like prices, products, and reviews, not their customers' personal data."),
      },
    ],
    tugas: [
      {
        judul: _("Susun kuesioner singkat", "Write a short questionnaire"),
        brief: _(
          "Kami ingin meluncurkan layanan catering sehat untuk pekerja kantoran di Jakarta. Sebelum mulai, kami ingin tahu kebiasaan makan siang mereka dan berapa yang mau mereka bayar.",
          "We want to launch a healthy catering service for office workers in Jakarta. Before starting, we want to learn their lunch habits and what they'd pay.",
        ),
        langkah: [
          _("Tulis 6 sampai 8 pertanyaan survei.", "Write 6 to 8 survey questions."),
          _("Gunakan pilihan jawaban yang jelas dan seimbang.", "Use clear, balanced answer options."),
          _("Jelaskan satu pertanyaan penyaring di awal.", "Add one screening question at the start."),
        ],
        rubrik: [
          _("Ada pertanyaan penyaring (pekerja kantoran di Jakarta)", "Has a screening question (office workers in Jakarta)"),
          _("Pertanyaan netral, tidak mengarahkan", "Questions are neutral, not leading"),
          _("Ada pertanyaan kebiasaan dan pengeluaran saat ini", "Covers current habits and spending"),
          _("Rentang harga tidak tumpang tindih", "Price ranges don't overlap"),
          _("Survei pendek, bisa selesai dalam 3 menit", "Short, done in 3 minutes"),
        ],
        contoh: _(
          "1. (Penyaring) Apakah Anda bekerja di kantor di wilayah Jakarta minimal 3 hari seminggu? Ya / Tidak (jika tidak, survei selesai)\n2. Biasanya Anda makan siang di mana? Bawa bekal / Kantin kantor / Beli di sekitar kantor / Pesan online / Lainnya\n3. Berapa rata-rata pengeluaran untuk sekali makan siang? Di bawah Rp20 rb / Rp20 sampai 34 rb / Rp35 sampai 49 rb / Rp50 rb ke atas\n4. Seberapa penting faktor berikut saat memilih makan siang? (skala 1 sampai 5) Harga, rasa, kesehatan, kecepatan\n5. Pernahkah Anda berlangganan catering makan siang? Ya, masih / Pernah, sudah berhenti / Belum pernah\n6. (Jika pernah berhenti) Apa alasan utama berhenti? (isian singkat)\n7. Jika ada catering sehat dengan menu berganti setiap hari, berapa harga per porsi yang menurut Anda wajar? (pilihan rentang sama dengan no. 3)\n8. Apa yang paling membuat Anda tertarik mencoba? (isian singkat)",
          "1. (Screener) Do you work at an office in Jakarta at least 3 days a week? Yes / No (if no, end)\n2. Where do you usually have lunch? Bring my own / Office canteen / Buy nearby / Order online / Other\n3. What do you spend on an average lunch? Under Rp20k / Rp20 to 34k / Rp35 to 49k / Rp50k and above\n4. How important are these when choosing lunch? (1 to 5) Price, taste, healthiness, speed\n5. Have you ever subscribed to lunch catering? Yes, currently / Yes, but stopped / Never\n6. (If stopped) What was the main reason? (short answer)\n7. For healthy catering with a daily-changing menu, what price per meal seems fair? (same ranges as Q3)\n8. What would most make you want to try it? (short answer)",
        ),
      },
      {
        judul: _("Tulis ringkasan analisis kompetitor", "Write a competitor analysis summary"),
        brief: _(
          "Hasil pemetaan 3 kompetitor sabun cuci piring ramah lingkungan:\nA: Rp35.000/500 ml, rating 4,8, dijual di marketplace dan supermarket\nB: Rp28.000/500 ml, rating 4,5, hanya marketplace, sering promo\nC: Rp45.000/500 ml, rating 4,9, kemasan isi ulang, fokus Instagram\nProduk klien rencananya Rp32.000/500 ml. Tolong tulis ringkasan dan rekomendasinya.",
          "Mapping of 3 eco-friendly dish soap competitors:\nA: Rp35,000/500 ml, rating 4.8, sold on marketplaces and in supermarkets\nB: Rp28,000/500 ml, rating 4.5, marketplace only, frequent promos\nC: Rp45,000/500 ml, rating 4.9, refill packaging, Instagram-focused\nThe client plans Rp32,000/500 ml. Please write a summary and recommendations.",
        ),
        langkah: [
          _("Tulis 3 temuan utama tentang posisi kompetitor.", "Write 3 key findings on competitor positioning."),
          _("Tentukan posisi yang paling masuk akal untuk produk klien.", "Recommend the most sensible positioning for the client."),
          _("Sebutkan satu keterbatasan data.", "State one data limitation."),
        ],
        rubrik: [
          _("Temuan membandingkan harga, kualitas (rating), dan saluran", "Findings compare price, quality (rating), and channels"),
          _("Rekomendasi posisi jelas dan beralasan", "Positioning recommendation is clear and reasoned"),
          _("Menyebut pembeda yang bisa dipakai klien", "Names a differentiator the client can use"),
          _("Ada keterbatasan data yang jujur", "States a data limitation honestly"),
        ],
        contoh: _(
          "Temuan:\n1. Kisaran harga pasar Rp28.000 sampai 45.000 per 500 ml. Harga klien (Rp32.000) berada di tengah bawah.\n2. B paling murah tetapi rating terendah dan bergantung pada promo; A unggul di distribusi; C premium dengan kemasan isi ulang dan rating tertinggi.\n3. Belum ada pemain yang menggabungkan harga terjangkau dengan kemasan isi ulang.\n\nRekomendasi: posisikan produk sebagai pilihan ramah lingkungan yang terjangkau, dengan isi ulang 1 liter sebagai pembeda. Fokus awal di marketplace dengan ulasan yang kuat, lalu masuk ke toko curah dan toko organik.\n\nKeterbatasan: data diambil dari marketplace pada satu tanggal; harga promo dan volume penjualan belum diketahui.",
          "Findings:\n1. Market price range is Rp28,000 to 45,000 per 500 ml. The client's Rp32,000 sits in the lower middle.\n2. B is cheapest but lowest rated and promo-dependent; A leads on distribution; C is premium with refill packaging and the top rating.\n3. Nobody yet combines an affordable price with refill packaging.\n\nRecommendation: position the product as the affordable eco choice, with a 1-litre refill as the differentiator. Start on marketplaces with strong reviews, then expand into bulk and organic stores.\n\nLimitation: data comes from marketplaces on a single date; promo pricing and sales volumes are unknown.",
        ),
      },
    ],
  },
};
