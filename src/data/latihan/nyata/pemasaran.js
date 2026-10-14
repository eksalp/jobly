import { t as _ } from "../../../i18n.js";

/** Detail kerja nyata, kategori Pemasaran Digital. */
export default {
  "admin-media-sosial": {
    tugas: [
      {
        dari: { nama: "Mas Arya", peran: _("Pemilik kedai kopi, Malang", "Coffee shop owner, Malang") },
        kanal: "WhatsApp",
        tenggat: _("Jumat, sebelum minggu peluncuran", "Friday, before launch week"),
        revisi: {
          pesan: _("Rencananya oke! Tapi promo KTM-nya kita ganti ya, karena kampus sedang libur semester. Targetnya jadi pekerja kantoran di sekitar Jalan Ijen. Tolong sesuaikan.", "Plan looks good! But let's change the student ID promo since campuses are on semester break. The target is now office workers around Jalan Ijen. Please adjust."),
          petunjuk: [
            _("Ganti promo dan sudut konten agar cocok untuk pekerja kantoran", "Swap the promo and content angle for office workers"),
            _("Sesuaikan jam unggah dengan kebiasaan pekerja (pagi dan jam makan siang)", "Adjust posting times to workers' habits (morning and lunch)"),
            _("Perbarui metrik keberhasilan", "Update the success metric"),
          ],
        },
      },
      {
        dari: { nama: "Bu Lia", peran: _("Pemilik brand", "Brand owner") },
        kanal: "Email",
        tenggat: _("Tanggal 3", "The 3rd"),
        revisi: {
          pesan: _("Laporannya jelas. Tapi saya bingung, kenapa pengikut naik tapi penjualan dari Instagram tidak naik?", "Clear report. But I'm confused: why did followers grow but Instagram sales didn't?"),
          petunjuk: [
            _("Jelaskan bahwa konten behind the scenes menarik perhatian tetapi belum tentu mendorong pembelian", "Explain behind-the-scenes content draws attention but doesn't necessarily drive purchases"),
            _("Usulkan konten yang mengarah ke penjualan (produk, promo, ulasan) dengan ajakan jelas", "Suggest sales-oriented content (products, promos, reviews) with clear CTAs"),
            _("Usulkan cara mengukur penjualan dari Instagram, misalnya tautan khusus atau kode promo", "Suggest ways to track Instagram sales, e.g. dedicated links or promo codes"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Hari peluncuran produk baru", "Launch day for a new product"),
      konteks: _("Kamu admin media sosial brand skincare lokal. Hari ini peluncuran serum baru, unggahan utama terjadwal jam 12.00.", "You manage social for a local skincare brand. Today a new serum launches, with the main post scheduled for noon."),
      langkah: [
        {
          waktu: "10.00",
          dari: { nama: _("Tim produk", "Product team") },
          kanal: "Slack",
          pesan: _("Ralat: harga serum Rp149.000, bukan Rp129.000 seperti di desain yang sudah terjadwal.", "Correction: the serum is Rp149,000, not Rp129,000 as in the scheduled design."),
          pilihan: [
            { teks: _("Biarkan, nanti diralat di komentar", "Leave it and correct in comments"), skor: 0, umpan: _("Harga salah di unggahan utama memicu komplain dan masalah kepercayaan.", "A wrong price in the main post triggers complaints and trust issues.") },
            { teks: _("Tunda jadwal unggah, minta desainer memperbaiki harga, cek ulang semua detail, lalu jadwalkan lagi", "Pause the schedule, get the designer to fix the price, recheck everything, then reschedule"), skor: 2, umpan: _("Lebih baik terlambat sedikit daripada salah harga.", "Better a little late than a wrong price.") },
            { teks: _("Hapus harga dari caption saja", "Just remove the price from the caption"), skor: 1, umpan: _("Desainnya masih menampilkan harga yang salah.", "The design still shows the wrong price.") },
          ],
        },
        {
          waktu: "12.40",
          dari: { nama: _("Komentar pengguna", "User comment") },
          kanal: "Instagram",
          pesan: _("\"Dulu pakai produk kalian malah jerawatan parah. Jangan percaya!\" (komentar sudah disukai 80 orang)", "\"Your product gave me terrible breakouts before. Don't trust them!\" (80 likes)"),
          pilihan: [
            { teks: _("Hapus komentarnya", "Delete the comment"), skor: 0, umpan: _("Menghapus komentar yang sudah ramai bisa memancing tuduhan menutupi masalah.", "Deleting a popular comment invites accusations of a cover-up.") },
            { teks: _("Balas dengan empati, minta ia menghubungi CS lewat DM, dan laporkan ke klien", "Reply with empathy, ask them to DM support, and alert the client"), skor: 2, umpan: _("Respons publik yang tenang menunjukkan brand peduli.", "A calm public reply shows the brand cares.") },
            { teks: _("Balas bahwa produk sudah teruji dan aman", "Reply that the product is tested and safe"), skor: 1, umpan: _("Terdengar defensif dan mengabaikan pengalaman pengguna.", "Sounds defensive and dismisses the user's experience.") },
          ],
        },
        {
          waktu: "14.00",
          dari: { nama: "Bu Lia", peran: _("Pemilik brand", "Brand owner") },
          kanal: "WhatsApp",
          pesan: _("Ada influencer dengan 500 ribu pengikut minta kirim produk gratis plus Rp15 juta untuk 1 video. Ambil nggak?", "An influencer with 500k followers wants free product plus Rp15m for 1 video. Should we?"),
          pilihan: [
            { teks: _("\"Ambil, Bu, pengikutnya banyak.\"", "\"Yes, they have lots of followers.\""), skor: 0, umpan: _("Jumlah pengikut tidak menjamin hasil. Cek dulu kualitasnya.", "Follower count doesn't guarantee results. Check quality first.") },
            { teks: _("\"Saya cek dulu engagement rate, kecocokan audiens dengan target kita, dan hasil kerja samanya dengan brand lain. Saya kabari sore ini.\"", "\"I'll check their engagement rate, audience fit, and past brand results. I'll update you this afternoon.\""), skor: 2, umpan: _("Keputusan berbasis data melindungi anggaran klien.", "Data-based decisions protect the client's budget.") },
            { teks: _("\"Terserah Ibu.\"", "\"Up to you.\""), skor: 1, umpan: _("Klien bertanya karena butuh pendapatmu.", "The client asked because they want your view.") },
          ],
        },
        {
          waktu: "17.00",
          dari: { nama: "Bu Lia", peran: _("Pemilik brand", "Brand owner") },
          kanal: "WhatsApp",
          pesan: _("Gimana hasil hari pertama?", "How did day one go?"),
          pilihan: [
            { teks: _("\"Ramai, Bu!\"", "\"Busy!\""), skor: 1, umpan: _("Semangat, tetapi tanpa angka.", "Enthusiastic, but no numbers.") },
            { teks: _("Kirim ringkasan: jangkauan unggahan, klik ke toko, pertanyaan yang paling sering muncul, satu komplain yang sudah dialihkan ke CS, dan saran konten besok", "Send a summary: post reach, store clicks, most common questions, one complaint routed to support, and tomorrow's content idea"), skor: 2, umpan: _("Lengkap, jujur, dan langsung bisa ditindaklanjuti.", "Complete, honest, and actionable.") },
            { teks: _("Kirim tangkapan layar insight tanpa penjelasan", "Send insight screenshots without explanation"), skor: 0, umpan: _("Klien harus menafsirkan sendiri.", "The client has to interpret it alone.") },
          ],
        },
      ],
    },
  },

  "ads-specialist": {
    tugas: [
      {
        dari: { nama: "Kak Salma", peran: _("Pemilik brand hijab", "Hijab brand owner") },
        kanal: "WhatsApp",
        tenggat: _("Senin, sebelum iklan mulai", "Monday, before ads start"),
        revisi: {
          pesan: _("Oke, tapi website saya belum bisa pasang pixel karena masih pakai link toko di marketplace. Gimana dong?", "OK, but my website can't install a pixel because I still use a marketplace store link. What now?"),
          petunjuk: [
            _("Jelaskan keterbatasan pelacakan saat mengarah ke marketplace", "Explain tracking limits when sending traffic to a marketplace"),
            _("Usulkan alternatif: tujuan traffic dengan UTM, kode voucher khusus iklan, atau iklan katalog marketplace", "Suggest alternatives: traffic objective with UTMs, ad-only voucher codes, or marketplace catalogue ads"),
            _("Sesuaikan cara mengukur keberhasilan uji 2 minggu", "Adjust how the 2-week test will be measured"),
          ],
        },
      },
      {
        dari: { nama: "Pak Hadi", peran: _("Pemilik toko perlengkapan rumah", "Home goods shop owner") },
        kanal: "Email",
        tenggat: _("Hari ini", "Today"),
        revisi: {
          pesan: _("Saya setuju hentikan A dan C. Tapi kalau B juga masih rugi per penjualan, kenapa tidak dihentikan juga? Saya mulai ragu iklan ini bisa untung.", "I agree to stop A and C. But if B also loses money per sale, why not stop it too? I'm starting to doubt ads can be profitable."),
          petunjuk: [
            _("Jelaskan nilai pelanggan jangka panjang jika pelanggan membeli ulang", "Explain customer lifetime value if buyers repurchase"),
            _("Usulkan batas waktu dan target yang jelas untuk B sebelum diputuskan", "Propose a clear deadline and target for B before deciding"),
            _("Jujur bahwa jika target tidak tercapai, iklan sebaiknya dihentikan", "Be honest that ads should stop if targets aren't met"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Seminggu mengelola iklan toko online", "A week running ads for an online shop"),
      konteks: _("Kamu mengelola Meta Ads untuk toko sepatu lokal. Anggaran Rp500.000 per hari, target biaya per pembelian di bawah Rp60.000.", "You run Meta Ads for a local shoe shop. Budget Rp500,000 a day; target cost per purchase under Rp60,000."),
      langkah: [
        {
          waktu: _("Senin", "Monday"),
          dari: { nama: _("Dashboard iklan", "Ads dashboard") },
          kanal: "Email",
          pesan: _("Iklan video baru: hari pertama biaya per pembelian Rp95.000 dari 3 pembelian.", "New video ad: day one cost per purchase Rp95,000 from 3 purchases."),
          pilihan: [
            { teks: _("Matikan sekarang", "Turn it off now"), skor: 1, umpan: _("Data 1 hari dengan 3 pembelian terlalu sedikit untuk keputusan.", "One day and 3 purchases is too little data.") },
            { teks: _("Biarkan 2 sampai 3 hari lagi dalam masa belajar, pantau tren", "Let it run 2 to 3 more days in the learning phase and watch the trend"), skor: 2, umpan: _("Iklan baru butuh waktu dan data sebelum dinilai.", "New ads need time and data before judging.") },
            { teks: _("Gandakan anggaran agar cepat belajar", "Double the budget to learn faster"), skor: 0, umpan: _("Menaikkan anggaran iklan yang belum terbukti memperbesar risiko rugi.", "Scaling an unproven ad magnifies losses.") },
          ],
        },
        {
          waktu: _("Rabu", "Wednesday"),
          dari: { nama: "Pak Hadi", peran: _("Klien", "Client") },
          kanal: "WhatsApp",
          pesan: _("Kompetitor pasang diskon 50%. Kita ikutan nggak?", "A competitor is running 50% off. Should we match?"),
          pilihan: [
            { teks: _("\"Ikut, Pak, supaya tidak kalah.\"", "\"Yes, so we don't lose out.\""), skor: 0, umpan: _("Diskon 50% bisa membuat setiap penjualan rugi.", "50% off could make every sale a loss.") },
            { teks: _("\"Kita hitung dulu margin. Alternatifnya, tonjolkan keunggulan lain seperti gratis ongkir atau garansi tukar ukuran, dan uji di iklan.\"", "\"Let's check margins first. Alternatively, highlight other perks like free shipping or size exchanges, and test them in ads.\""), skor: 2, umpan: _("Keputusan berdasarkan margin, dengan alternatif yang bisa diuji.", "A margin-based decision with testable alternatives.") },
            { teks: _("\"Terserah Bapak.\"", "\"Up to you.\""), skor: 1, umpan: _("Klien butuh saran dari ahlinya.", "The client needs expert advice.") },
          ],
        },
        {
          waktu: _("Kamis", "Thursday"),
          dari: { nama: _("Notifikasi Meta", "Meta notice") },
          kanal: "Email",
          pesan: _("Iklan carousel ditolak: melanggar kebijakan klaim sebelum dan sesudah.", "Carousel ad rejected: violates before-and-after claims policy."),
          pilihan: [
            { teks: _("Ajukan banding tanpa mengubah apa pun", "Appeal without changing anything"), skor: 1, umpan: _("Banding boleh jika yakin, tetapi cek dulu apakah memang ada pelanggaran.", "Appeal if sure, but first check whether it really violates.") },
            { teks: _("Baca kebijakannya, ubah kreatif agar sesuai, lalu ajukan ulang", "Read the policy, fix the creative to comply, and resubmit"), skor: 2, umpan: _("Memahami kebijakan mencegah akun iklan terkena pembatasan.", "Understanding policy prevents ad account restrictions.") },
            { teks: _("Buat akun iklan baru", "Make a new ad account"), skor: 0, umpan: _("Menghindari kebijakan dengan akun baru bisa membuat semua akun diblokir.", "Evading policy with new accounts can get them all banned.") },
          ],
        },
        {
          waktu: _("Jumat", "Friday"),
          dari: { nama: "Pak Hadi", peran: _("Klien", "Client") },
          kanal: "WhatsApp",
          pesan: _("Laporan minggu ini dong.", "This week's report, please."),
          pilihan: [
            { teks: _("Kirim: total belanja, pembelian, biaya per pembelian dibanding target, ROAS, iklan terbaik dan alasannya, serta rencana minggu depan", "Send: total spend, purchases, cost per purchase vs target, ROAS, best ad and why, and next week's plan"), skor: 2, umpan: _("Laporan lengkap yang fokus pada hasil bisnis.", "A complete report focused on business results.") },
            { teks: _("Kirim jumlah tayangan dan klik", "Send impressions and clicks"), skor: 0, umpan: _("Metrik ini tidak menjawab apakah iklan menguntungkan.", "These don't show whether ads are profitable.") },
            { teks: _("Kirim tangkapan layar dashboard", "Send a dashboard screenshot"), skor: 1, umpan: _("Datanya ada, tetapi tanpa analisis dan rencana.", "Data's there, but no analysis or plan.") },
          ],
        },
      ],
    },
  },

  "seo-specialist": {
    tugas: [
      {
        dari: { nama: "drg. Maya", peran: _("Pemilik klinik gigi, Semarang", "Dental clinic owner, Semarang") },
        kanal: "Email",
        tenggat: _("Minggu depan", "Next week"),
        revisi: {
          pesan: _("Terima kasih. Kami juga buka cabang baru di Ungaran bulan depan. Apakah perlu halaman sendiri, atau cukup ditulis di halaman kontak?", "Thanks. We're opening a new branch in Ungaran next month. Does it need its own page, or is the contact page enough?"),
          petunjuk: [
            _("Sarankan halaman lokasi khusus untuk cabang Ungaran", "Recommend a dedicated location page for Ungaran"),
            _("Tambahkan kata kunci lokal untuk Ungaran", "Add local keywords for Ungaran"),
            _("Ingatkan untuk membuat profil Google Business terpisah untuk cabang baru", "Remind them to create a separate Google Business Profile for the new branch"),
          ],
        },
      },
      {
        dari: { nama: "Mas Yudi", peran: _("Pemilik toko tas", "Bag shop owner") },
        kanal: "WhatsApp",
        tenggat: _("Hari ini", "Today"),
        revisi: {
          pesan: _("Ternyata gratis ongkir cuma sampai akhir bulan. Kalau ditulis di meta description, nanti harus diubah lagi ya?", "Free shipping only runs until month end. If it's in the meta description, will we need to change it again?"),
          petunjuk: [
            _("Tulis versi meta description tanpa promo yang cepat berubah", "Write a version without a short-lived promo"),
            _("Ganti dengan keunggulan yang tetap (misalnya garansi atau bahan)", "Use a lasting benefit instead (e.g. warranty or material)"),
            _("Jaga panjang tetap di bawah sekitar 155 karakter", "Keep it under about 155 characters"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Bulan ketiga proyek SEO", "Month three of an SEO project"),
      konteks: _("Kamu menangani SEO untuk toko furnitur online. Trafik organik naik 18% dalam 2 bulan.", "You handle SEO for an online furniture store. Organic traffic is up 18% in 2 months."),
      langkah: [
        {
          waktu: _("Senin", "Monday"),
          dari: { nama: _("Search Console", "Search Console") },
          kanal: "Email",
          pesan: _("Peringatan: 40 halaman produk tidak diindeks karena \"duplikat, Google memilih kanonis yang berbeda\".", "Warning: 40 product pages not indexed: \"Duplicate, Google chose different canonical\"."),
          pilihan: [
            { teks: _("Abaikan, mungkin hilang sendiri", "Ignore it, it may resolve itself"), skor: 0, umpan: _("Halaman produk yang tidak diindeks tidak akan muncul di pencarian.", "Unindexed product pages won't appear in search.") },
            { teks: _("Cek apakah variasi warna membuat URL ganda, lalu atur tag canonical dan deskripsi unik bersama developer", "Check whether colour variants create duplicate URLs, then set canonicals and unique descriptions with the developer"), skor: 2, umpan: _("Kamu menemukan penyebab teknis dan memperbaikinya bersama tim.", "You found the technical cause and fixed it with the team.") },
            { teks: _("Minta Google mengindeks ulang semua halaman satu per satu", "Request indexing for every page one by one"), skor: 1, umpan: _("Tanpa memperbaiki penyebabnya, masalah akan kembali.", "Without fixing the cause, it will recur.") },
          ],
        },
        {
          waktu: _("Rabu", "Wednesday"),
          dari: { nama: _("Pemilik toko", "Store owner") },
          kanal: "WhatsApp",
          pesan: _("Ada jasa yang menawarkan 1.000 backlink seharga Rp500 ribu. Beli ya biar cepat naik?", "A service offers 1,000 backlinks for Rp500k. Should we buy them to rank faster?"),
          pilihan: [
            { teks: _("\"Boleh, Pak.\"", "\"Sure.\""), skor: 0, umpan: _("Backlink massal berkualitas rendah berisiko penalti.", "Bulk low-quality backlinks risk a penalty.") },
            { teks: _("\"Saya tidak sarankan, risikonya penalti. Lebih baik kita buat konten panduan memilih furnitur yang layak dikutip, dan kerja sama dengan blog interior.\"", "\"I don't recommend it; it risks a penalty. Better to create furniture buying guides worth citing and partner with interior blogs.\""), skor: 2, umpan: _("Kamu melindungi website dan memberi alternatif yang sehat.", "You protect the site and offer a healthy alternative.") },
            { teks: _("\"Coba beli 100 dulu.\"", "\"Try 100 first.\""), skor: 0, umpan: _("Jumlah kecil tetap berisiko.", "Small amounts are still risky.") },
          ],
        },
        {
          waktu: _("Kamis", "Thursday"),
          dari: { nama: _("Penulis konten", "Content writer") },
          kanal: "Slack",
          pesan: _("Artikel \"meja kerja minimalis\" sudah selesai, 2.500 kata. Mau dicek?", "The \"minimalist desk\" article is done, 2,500 words. Want to check it?"),
          pilihan: [
            { teks: _("Cek kesesuaian dengan niat pencari, struktur heading, tautan ke halaman produk, dan judul serta meta", "Check search intent fit, heading structure, links to product pages, and title and meta"), skor: 2, umpan: _("Pemeriksaan yang fokus pada hal yang memengaruhi peringkat dan penjualan.", "A review focused on what drives rankings and sales.") },
            { teks: _("Langsung terbitkan, panjangnya sudah bagus", "Publish now, the length is good"), skor: 1, umpan: _("Panjang bukan ukuran kualitas.", "Length isn't quality.") },
            { teks: _("Minta ditambah sampai 5.000 kata", "Ask to pad it to 5,000 words"), skor: 0, umpan: _("Menambah kata tanpa nilai tidak membantu.", "Adding words without value doesn't help.") },
          ],
        },
        {
          waktu: _("Akhir bulan", "Month end"),
          dari: { nama: _("Pemilik toko", "Store owner") },
          kanal: "WhatsApp",
          pesan: _("Kok trafik bulan ini cuma naik 3%? Kemarin 18%.", "Why only 3% growth this month? It was 18% before."),
          pilihan: [
            { teks: _("Jelaskan dengan data: 40 halaman sempat tidak diindeks (sudah diperbaiki), ada penurunan musiman, dan klik dari kata kunci bernilai tinggi tetap naik", "Explain with data: 40 pages were unindexed (now fixed), there's a seasonal dip, and clicks from high-value keywords still rose"), skor: 2, umpan: _("Penjelasan jujur dan berbasis data menjaga kepercayaan klien.", "Honest, data-backed explanations keep trust.") },
            { teks: _("\"SEO memang naik turun, Pak.\"", "\"SEO just fluctuates.\""), skor: 1, umpan: _("Benar, tetapi terlalu umum.", "True, but vague.") },
            { teks: _("Tunjukkan hanya metrik yang naik", "Show only metrics that rose"), skor: 0, umpan: _("Menyembunyikan data buruk merusak kepercayaan jangka panjang.", "Hiding bad data erodes long-term trust.") },
          ],
        },
      ],
    },
  },

  "email-marketing": {
    tugas: [
      {
        dari: { nama: "Mbak Gita", peran: _("Pemilik brand skincare", "Skincare brand owner") },
        kanal: "Email",
        tenggat: _("Sebelum pop-up pendaftaran aktif", "Before the sign-up pop-up goes live"),
        revisi: {
          pesan: _("Bagus! Tapi sebagian besar yang daftar sudah pernah beli di marketplace. Diskon 10% buat mereka nggak terlalu menarik. Ada ide lain?", "Great! But most sign-ups have already bought from us on marketplaces. 10% off isn't that exciting for them. Other ideas?"),
          petunjuk: [
            _("Bedakan alur untuk pelanggan baru dan yang sudah pernah membeli", "Split flows for new and existing customers"),
            _("Tawarkan nilai lain untuk pelanggan lama (panduan rutinitas, sampel, poin)", "Offer other value to existing customers (routine guides, samples, points)"),
            _("Jelaskan cara membedakan keduanya saat pendaftaran", "Explain how to tell them apart at sign-up"),
          ],
        },
      },
      {
        dari: { nama: "Mas Rio", peran: _("Pemilik toko sepatu", "Shoe shop owner") },
        kanal: "Slack",
        tenggat: _("Hari ini", "Today"),
        revisi: {
          pesan: _("Email pertama sudah jalan, sekitar 8% pembeli kembali. Bisa tambahkan email kedua untuk yang belum kembali setelah 24 jam?", "The first email works, about 8% come back. Can you add a second email for those who don't return after 24 hours?"),
          petunjuk: [
            _("Tulis email kedua dengan sudut berbeda (misalnya ulasan atau panduan ukuran)", "Write a second email with a different angle (e.g. reviews or a size guide)"),
            _("Jangan mengulang isi email pertama", "Don't repeat the first email"),
            _("Tentukan waktu kirim dan kapan rangkaian berhenti", "Set send timing and when the sequence stops"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Minggu promo besar 11.11", "11.11 sale week"),
      konteks: _("Kamu mengelola email marketing toko fashion dengan 25.000 pelanggan. Promo 11.11 dimulai Senin.", "You run email for a fashion store with 25,000 subscribers. The 11.11 sale starts Monday."),
      langkah: [
        {
          waktu: _("Jumat sebelumnya", "The Friday before"),
          dari: { nama: _("Tim promo", "Promo team") },
          kanal: "Slack",
          pesan: _("Kita kirim email promo ke semua pelanggan setiap hari selama seminggu ya.", "Let's email all subscribers every day for the week."),
          pilihan: [
            { teks: _("Setuju", "Agree"), skor: 0, umpan: _("Email harian ke semua orang memicu banyak yang berhenti berlangganan dan menandai spam.", "Daily emails to everyone drive unsubscribes and spam reports.") },
            { teks: _("Usulkan: pengumuman untuk semua, pengingat hanya untuk yang membuka atau mengklik, dan email terakhir untuk yang belum membeli", "Propose: an announcement to all, reminders only to openers or clickers, and a last call to non-buyers"), skor: 2, umpan: _("Segmentasi menjaga hasil tetap tinggi tanpa merusak daftar.", "Segmentation keeps results high without harming the list.") },
            { teks: _("Kirim 2 kali saja ke semua", "Send just twice to all"), skor: 1, umpan: _("Lebih aman, tetapi belum memanfaatkan segmentasi.", "Safer, but misses segmentation.") },
          ],
        },
        {
          waktu: _("Senin 09.00", "Monday 9:00"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Email uji menunjukkan tombol \"Belanja sekarang\" mengarah ke halaman 404.", "The test email's \"Shop now\" button leads to a 404."),
          pilihan: [
            { teks: _("Tetap kirim sesuai jadwal", "Send on schedule anyway"), skor: 0, umpan: _("Ribuan klik ke halaman rusak berarti penjualan hilang.", "Thousands of clicks to a broken page mean lost sales.") },
            { teks: _("Tunda pengiriman, perbaiki tautan, uji ulang di HP dan desktop, lalu kirim", "Delay, fix the link, retest on mobile and desktop, then send"), skor: 2, umpan: _("Uji sebelum kirim adalah kebiasaan wajib.", "Testing before sending is a must.") },
            { teks: _("Kirim, lalu kirim email ralat", "Send, then send a correction"), skor: 1, umpan: _("Email ralat menambah beban kotak masuk pelanggan.", "Correction emails clutter inboxes.") },
          ],
        },
        {
          waktu: _("Selasa", "Tuesday"),
          dari: { nama: _("Dashboard email", "Email dashboard") },
          kanal: "Email",
          pesan: _("Open rate 38%, klik 1,2%, berhenti berlangganan 0,9% (biasanya 0,2%).", "Open rate 38%, clicks 1.2%, unsubscribes 0.9% (usually 0.2%)."),
          pilihan: [
            { teks: _("Abaikan, yang penting open rate tinggi", "Ignore it; opens are high"), skor: 0, umpan: _("Lonjakan berhenti berlangganan adalah sinyal penting.", "An unsubscribe spike is an important signal.") },
            { teks: _("Kurangi frekuensi untuk pelanggan yang jarang membuka dan tawarkan pilihan \"kirimi saya lebih jarang\"", "Reduce frequency for rare openers and offer an \"email me less\" option"), skor: 2, umpan: _("Kamu menjaga daftar tanpa menghentikan promo.", "You protect the list without stopping the sale.") },
            { teks: _("Hapus tombol berhenti berlangganan", "Remove the unsubscribe link"), skor: 0, umpan: _("Melanggar aturan dan membuat email masuk spam.", "It breaks rules and lands emails in spam.") },
          ],
        },
        {
          waktu: _("Jumat", "Friday"),
          dari: { nama: _("Manajer marketing", "Marketing manager") },
          kanal: "Slack",
          pesan: _("Rangkum hasil email minggu ini dong.", "Summarise this week's email results."),
          pilihan: [
            { teks: _("Pendapatan dari email, perbandingan dengan promo sebelumnya, segmen terbaik, pelajaran soal frekuensi, dan saran untuk promo berikutnya", "Email revenue, comparison with the last sale, best segment, frequency lessons, and next-sale suggestions"), skor: 2, umpan: _("Ringkasan yang menghubungkan hasil dan pelajaran.", "A summary linking results and lessons.") },
            { teks: _("Open rate rata-rata saja", "Just the average open rate"), skor: 0, umpan: _("Tidak menunjukkan dampak ke penjualan.", "Doesn't show sales impact.") },
            { teks: _("Daftar semua email yang dikirim", "A list of every email sent"), skor: 1, umpan: _("Aktivitas, bukan hasil.", "Activity, not results.") },
          ],
        },
      ],
    },
  },

  "riset-pasar": {
    tugas: [
      {
        dari: { nama: "Bu Fitri", peran: _("Calon pemilik catering sehat", "Aspiring healthy catering owner") },
        kanal: "Email",
        tenggat: _("Sebelum survei disebar Senin", "Before the survey goes out Monday"),
        revisi: {
          pesan: _("Kuesionernya bagus. Mitra saya bilang 8 pertanyaan terlalu banyak, takut orang malas isi. Bisa dipangkas jadi 5 tanpa kehilangan info penting?", "Good questionnaire. My partner says 8 questions is too many; people might not finish. Can you cut to 5 without losing key info?"),
          petunjuk: [
            _("Pertahankan pertanyaan penyaring dan pertanyaan harga", "Keep the screener and price questions"),
            _("Gabungkan atau hapus pertanyaan yang tumpang tindih", "Merge or drop overlapping questions"),
            _("Jelaskan informasi apa yang hilang karena pemangkasan", "Explain what information is lost by cutting"),
          ],
        },
      },
      {
        dari: { nama: "Mas Yoga", peran: _("Founder brand sabun", "Soap brand founder") },
        kanal: "Slack",
        tenggat: _("Besok", "Tomorrow"),
        revisi: {
          pesan: _("Setuju dengan posisinya. Tapi saya baru tahu kompetitor A minggu lalu juga meluncurkan kemasan isi ulang 1 liter. Apakah rekomendasinya berubah?", "I agree with the positioning. But I just learned competitor A launched a 1-litre refill last week too. Does the recommendation change?"),
          petunjuk: [
            _("Perbarui analisis dengan informasi baru", "Update the analysis with the new info"),
            _("Cari pembeda lain (harga isi ulang, bahan, distribusi, program pengembalian kemasan)", "Find other differentiators (refill price, ingredients, distribution, packaging return programme)"),
            _("Catat tanggal data agar jelas kapan analisis dibuat", "Note data dates so it's clear when the analysis was made"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Riset sebelum peluncuran produk", "Pre-launch research"),
      konteks: _("Startup minuman sehat meminta riset untuk memutuskan apakah meluncurkan produk di Surabaya.", "A healthy drinks startup wants research to decide whether to launch in Surabaya."),
      langkah: [
        {
          waktu: _("Minggu 1", "Week 1"),
          dari: { nama: "CEO", peran: _("Klien", "Client") },
          kanal: "Email",
          pesan: _("Kami yakin produk ini laku. Riset ini cuma formalitas untuk investor.", "We're sure it'll sell. This research is just a formality for investors."),
          pilihan: [
            { teks: _("Buat riset yang mengarahkan ke hasil positif", "Design research steered to a positive result"), skor: 0, umpan: _("Riset yang bias bisa menyesatkan klien dan investornya.", "Biased research misleads the client and investors.") },
            { teks: _("Jelaskan bahwa riset yang objektif lebih meyakinkan investor, lalu rancang pertanyaan netral", "Explain that objective research is more convincing to investors, then design neutral questions"), skor: 2, umpan: _("Objektivitas justru menjadi nilai jual riset.", "Objectivity is the research's selling point.") },
            { teks: _("Tolak proyeknya", "Decline the project"), skor: 1, umpan: _("Kamu bisa membantu dengan cara yang benar.", "You can help the right way.") },
          ],
        },
        {
          waktu: _("Minggu 2", "Week 2"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Survei hanya didapat 60 responden, 50 di antaranya mahasiswa.", "The survey got only 60 responses, 50 from students."),
          pilihan: [
            { teks: _("Laporkan sebagai gambaran pasar Surabaya", "Report it as Surabaya's market"), skor: 0, umpan: _("Sampel ini tidak mewakili pasar yang lebih luas.", "This sample doesn't represent the wider market.") },
            { teks: _("Tambah responden dari kelompok lain (pekerja, ibu rumah tangga) dan catat keterbatasan sampel di laporan", "Add respondents from other groups (workers, homemakers) and note sample limits"), skor: 2, umpan: _("Kamu memperbaiki sampel dan jujur soal batasnya.", "You improve the sample and are honest about limits.") },
            { teks: _("Hapus responden mahasiswa", "Drop the student responses"), skor: 1, umpan: _("Mahasiswa bisa jadi pasar penting. Tambah kelompok lain, jangan hapus data.", "Students may be a key market. Add groups; don't delete data.") },
          ],
        },
        {
          waktu: _("Minggu 3", "Week 3"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("70% responden tertarik, tetapi hanya 20% yang mau membayar di atas Rp15.000. Harga rencana Rp22.000.", "70% are interested, but only 20% would pay over Rp15,000. Planned price is Rp22,000."),
          pilihan: [
            { teks: _("Laporkan \"70% tertarik\" sebagai temuan utama", "Lead with \"70% interested\""), skor: 0, umpan: _("Minat tanpa kesediaan membayar bisa menyesatkan.", "Interest without willingness to pay misleads.") },
            { teks: _("Laporkan keduanya, tonjolkan kesenjangan harga, dan usulkan opsi (ukuran lebih kecil, harga perkenalan, atau target segmen lain)", "Report both, highlight the price gap, and suggest options (smaller size, intro price, or another segment)"), skor: 2, umpan: _("Temuan penting disajikan jujur bersama jalan keluar.", "A key finding presented honestly with ways forward.") },
            { teks: _("Sembunyikan data harga", "Hide the price data"), skor: 0, umpan: _("Menyembunyikan temuan penting merugikan klien.", "Hiding key findings harms the client.") },
          ],
        },
        {
          waktu: _("Minggu 4", "Week 4"),
          dari: { nama: "CEO", peran: _("Klien", "Client") },
          kanal: "Email",
          pesan: _("Jadi, kami sebaiknya launch atau tidak?", "So, should we launch or not?"),
          pilihan: [
            { teks: _("\"Launch saja, Pak.\"", "\"Just launch.\""), skor: 0, umpan: _("Tanpa dasar data dan syarat.", "No data basis or conditions.") },
            { teks: _("\"Rekomendasi: uji coba terbatas di 2 lokasi dengan ukuran 250 ml seharga Rp15.000 selama 6 minggu, dengan target penjualan sebelum ekspansi.\"", "\"Recommendation: a limited pilot at 2 locations with a 250 ml size at Rp15,000 for 6 weeks, with sales targets before expanding.\""), skor: 2, umpan: _("Rekomendasi spesifik yang mengurangi risiko.", "A specific, risk-reducing recommendation.") },
            { teks: _("\"Tergantung Bapak.\"", "\"It's up to you.\""), skor: 1, umpan: _("Klien membayar untuk rekomendasi.", "The client paid for a recommendation.") },
          ],
        },
      ],
    },
  },
};
