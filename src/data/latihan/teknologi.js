import { t as _ } from "../../i18n.js";

/** Latihan praktik kategori Pemrograman & Teknologi. */
export default {
  "web-developer": {
    kuis: [
      {
        q: _("Klien mengeluh website WordPress-nya lambat di HP. Apa yang dicek pertama kali?", "A client says their WordPress site is slow on mobile. What do you check first?"),
        o: [
          _("Ganti tema secara acak", "Swap themes at random"),
          _("Ukur dengan PageSpeed Insights, lalu cek ukuran gambar, jumlah plugin, dan caching", "Measure with PageSpeed Insights, then check image sizes, plugin count, and caching"),
          _("Tambah plugin pengoptimal sebanyak mungkin", "Install as many optimiser plugins as possible"),
          _("Pindah ke hosting termahal", "Move to the most expensive hosting"),
        ],
        a: 1,
        e: _("Ukur dulu sebelum mengubah. Gambar besar, terlalu banyak plugin, dan tidak ada caching adalah penyebab paling umum.", "Measure before changing anything. Large images, too many plugins, and no caching are the most common causes."),
      },
      {
        q: _("Sebelum mengubah tema atau memperbarui plugin di website klien yang sudah berjalan, apa yang wajib dilakukan?", "Before changing the theme or updating plugins on a live client site, what must you do?"),
        o: [
          _("Langsung kerjakan di situs utama", "Work directly on the live site"),
          _("Backup lengkap, lalu uji di situs staging bila memungkinkan", "Take a full backup, then test on a staging site when possible"),
          _("Matikan website selama seminggu", "Take the site down for a week"),
          _("Hapus semua plugin dulu", "Delete all plugins first"),
        ],
        a: 1,
        e: _("Backup dan staging melindungi klien dari website rusak dan melindungimu dari kehilangan kepercayaan.", "Backups and staging protect the client from a broken site and you from losing their trust."),
      },
      {
        q: _("Siapa yang sebaiknya menjadi pemilik akun domain dan hosting website klien?", "Who should own the client's domain and hosting accounts?"),
        o: [
          _("Developer, supaya mudah diurus", "The developer, for convenience"),
          _("Klien, dengan akses yang diberikan ke developer", "The client, with access granted to the developer"),
          _("Teman developer", "The developer's friend"),
          _("Tidak penting siapa", "It doesn't matter"),
        ],
        a: 1,
        e: _("Aset digital milik klien sebaiknya atas nama klien. Ini mencegah sengketa saat kerja sama berakhir.", "Client digital assets should be in the client's name. It prevents disputes when the work ends."),
      },
      {
        q: _("Landing page untuk iklan sebaiknya punya ciri apa?", "What should an ad landing page have?"),
        o: [
          _("Menu lengkap ke semua halaman", "A full menu to every page"),
          _("Satu tujuan jelas, pesan yang sama dengan iklan, dan tombol ajakan yang menonjol", "One clear goal, a message matching the ad, and a prominent call to action"),
          _("Banyak animasi agar menarik", "Lots of animation"),
          _("Teks sepanjang mungkin", "As much text as possible"),
        ],
        a: 1,
        e: _("Landing page yang efektif mengurangi gangguan dan langsung mengarahkan pengunjung ke satu tindakan.", "Effective landing pages remove distractions and guide visitors to one action."),
      },
      {
        q: _("Klien baru meminta kamu memindahkan website \"milik temannya\" ke hosting baru, tetapi tidak bisa menunjukkan akses akun domainnya. Apa yang dilakukan?", "A new client wants you to move \"their friend's\" website to new hosting but can't show access to the domain account. What do you do?"),
        o: [
          _("Pindahkan saja", "Just move it"),
          _("Minta bukti kepemilikan atau persetujuan pemilik sah sebelum mengerjakan", "Ask for proof of ownership or the rightful owner's consent before starting"),
          _("Salin isinya ke domain baru", "Copy the content to a new domain"),
          _("Kerjakan setengahnya", "Do half of it"),
        ],
        a: 1,
        e: _("Memindahkan situs tanpa izin pemiliknya bisa berarti membantu pengambilalihan. Selalu pastikan kepemilikan.", "Moving a site without its owner's consent may mean helping a takeover. Always confirm ownership."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis proposal website untuk klinik", "Write a website proposal for a clinic"),
        brief: _(
          "Kami klinik kecantikan di Medan. Kami butuh website profil dengan daftar layanan, harga mulai, galeri sebelum-sesudah, dan tombol booking via WhatsApp. Anggaran kami sekitar Rp5 juta.",
          "We're a beauty clinic in Medan. We need a profile website with services, starting prices, a before-and-after gallery, and a WhatsApp booking button. Our budget is around Rp5 million.",
        ),
        langkah: [
          _("Susun daftar halaman dan fitur.", "List the pages and features."),
          _("Tentukan platform dan alasannya.", "Choose a platform and why."),
          _("Tulis lingkup kerja, jumlah revisi, jadwal, dan hal yang tidak termasuk.", "Write the scope, revisions, timeline, and exclusions."),
        ],
        rubrik: [
          _("Halaman dan fitur sesuai kebutuhan klien", "Pages and features match the brief"),
          _("Platform masuk akal untuk anggaran dan klien yang ingin mengelola sendiri", "Platform suits the budget and a client who'll self-manage"),
          _("Ada jadwal bertahap", "Includes a staged timeline"),
          _("Ada batas revisi dan hal yang tidak termasuk", "States revision limits and exclusions"),
          _("Menyebut kepemilikan domain dan hosting atas nama klien", "Notes domain and hosting are in the client's name"),
        ],
        contoh: _(
          "Halaman: Beranda, Layanan (dengan harga mulai), Galeri sebelum-sesudah, Tentang & Dokter, Kontak (peta dan jam buka). Tombol WhatsApp melayang di semua halaman.\n\nPlatform: WordPress dengan page builder, agar tim klinik bisa mengubah harga dan galeri sendiri.\n\nLingkup: desain responsif, 5 halaman, SEO dasar (judul dan deskripsi tiap halaman), Google Business Profile ditautkan, pelatihan 1 jam cara mengubah konten.\n\nJadwal: minggu 1 desain beranda dan persetujuan; minggu 2 semua halaman; minggu 3 revisi dan peluncuran.\n\nRevisi: 2 kali revisi desain dan 1 kali revisi setelah peluncuran.\n\nTidak termasuk: penulisan konten dan foto produk, biaya domain dan hosting (dibeli atas nama klinik), pemeliharaan bulanan (ditawarkan terpisah).",
          "Pages: Home, Services (with starting prices), Before-and-after gallery, About & Doctors, Contact (map and hours). A floating WhatsApp button on every page.\n\nPlatform: WordPress with a page builder, so the clinic team can update prices and the gallery themselves.\n\nScope: responsive design, 5 pages, basic SEO (titles and descriptions per page), Google Business Profile linked, 1-hour training on editing content.\n\nTimeline: week 1 homepage design and approval; week 2 all pages; week 3 revisions and launch.\n\nRevisions: 2 design revision rounds and 1 post-launch round.\n\nExcluded: copywriting and product photography, domain and hosting fees (bought in the clinic's name), monthly maintenance (offered separately).",
        ),
      },
      {
        judul: _("Diagnosis masalah website", "Diagnose a website problem"),
        brief: _(
          "Setelah saya memperbarui semua plugin kemarin, website toko online saya menampilkan layar putih kosong. Pesanan tidak bisa masuk. Tolong!",
          "After I updated all the plugins yesterday, my online shop shows a blank white screen. No orders can come in. Help!",
        ),
        langkah: [
          _("Tulis langkah diagnosis berurutan.", "Write ordered diagnostic steps."),
          _("Tulis cara memulihkan website secepatnya.", "Explain how to restore the site fast."),
          _("Tulis pesan singkat ke klien yang menenangkan dan jelas.", "Write a short, reassuring message to the client."),
        ],
        rubrik: [
          _("Menyadari kemungkinan konflik plugin setelah pembaruan", "Suspects a plugin conflict after the update"),
          _("Menyebut cek log error atau mode debug", "Mentions checking error logs or debug mode"),
          _("Menyebut menonaktifkan plugin (misalnya lewat FTP atau file manager) untuk mencari penyebab", "Mentions disabling plugins (via FTP or file manager) to isolate the cause"),
          _("Menyebut pemulihan dari backup sebagai opsi cepat", "Mentions restoring from backup as a fast option"),
          _("Pesan ke klien jelas tentang langkah dan perkiraan waktu", "Message gives clear steps and time estimate"),
        ],
        contoh: _(
          "Diagnosis:\n1. Cek log error di hosting atau aktifkan WP_DEBUG_LOG untuk melihat plugin yang menyebabkan error\n2. Jika admin tidak bisa dibuka, ganti nama folder plugins lewat file manager untuk menonaktifkan semua plugin\n3. Aktifkan plugin satu per satu sampai layar putih muncul lagi, sehingga penyebabnya ketahuan\n4. Kembalikan plugin itu ke versi sebelumnya atau cari penggantinya\n\nPemulihan cepat: jika ada backup sebelum pembaruan, pulihkan dulu agar toko bisa menerima pesanan, lalu selidiki di staging.\n\nPesan ke klien: \"Halo Kak, kemungkinan besar ada plugin yang bentrok setelah pembaruan. Saya mulai cek sekarang. Target saya, toko bisa menerima pesanan lagi dalam 1 sampai 2 jam, lalu saya cari penyebab pastinya agar tidak terulang.\"",
          "Diagnosis:\n1. Check hosting error logs or enable WP_DEBUG_LOG to see which plugin errors\n2. If wp-admin won't load, rename the plugins folder via file manager to disable all plugins\n3. Re-enable plugins one by one until the white screen returns, revealing the culprit\n4. Roll that plugin back or find a replacement\n\nFast restore: if there's a backup from before the update, restore it so the shop takes orders again, then investigate on staging.\n\nMessage to client: \"Hi, it's most likely a plugin conflict after the update. I'm checking now. My target is to have the shop taking orders again within 1 to 2 hours, then I'll find the exact cause so it doesn't happen again.\"",
        ),
      },
    ],
  },

  "app-developer": {
    kuis: [
      {
        q: _("Kamu bekerja di tim remote dan ingin menggabungkan fitur baru ke cabang utama. Praktik yang umum?", "You're on a remote team and want to merge a new feature into main. Common practice?"),
        o: [
          _("Push langsung ke main", "Push straight to main"),
          _("Buat pull request dengan deskripsi jelas, lalu minta code review", "Open a pull request with a clear description and request a code review"),
          _("Kirim file lewat email", "Email the files"),
          _("Tunggu sampai akhir bulan", "Wait until month end"),
        ],
        a: 1,
        e: _("Pull request dan code review menjaga kualitas kode dan memudahkan tim memahami perubahan, terutama saat bekerja di zona waktu berbeda.", "Pull requests and code review maintain quality and help the team understand changes, especially across time zones."),
      },
      {
        q: _("Di mana sebaiknya menyimpan API key layanan pembayaran pada aplikasi web?", "Where should you keep a payment service API key in a web app?"),
        o: [
          _("Langsung di kode frontend", "Directly in frontend code"),
          _("Di server atau environment variable yang tidak dikirim ke browser, dan tidak di-commit ke Git", "On the server or in environment variables not sent to the browser, and never committed to Git"),
          _("Di README", "In the README"),
          _("Di komentar kode", "In a code comment"),
        ],
        a: 1,
        e: _("Semua yang ada di frontend bisa dilihat pengguna. Kunci rahasia harus tetap di server.", "Anything in the frontend is visible to users. Secret keys must stay on the server."),
      },
      {
        q: _("Kamu menemukan bug di fitur rekan setim. Respons yang paling profesional?", "You find a bug in a teammate's feature. Most professional response?"),
        o: [
          _("Diam saja", "Stay quiet"),
          _("Buat issue berisi langkah reproduksi, perilaku yang diharapkan, dan yang terjadi", "File an issue with reproduction steps, expected behaviour, and actual behaviour"),
          _("Mengeluh di grup tim", "Complain in the team chat"),
          _("Hapus fiturnya", "Delete the feature"),
        ],
        a: 1,
        e: _("Laporan bug yang baik bisa langsung ditindaklanjuti tanpa banyak tanya-jawab, yang sangat penting di tim remote.", "A good bug report can be acted on without back-and-forth, which matters a lot for remote teams."),
      },
      {
        q: _("Aplikasi Android-mu sering crash di perangkat murah dengan RAM kecil. Apa yang dicek?", "Your Android app keeps crashing on budget phones with little RAM. What do you check?"),
        o: [
          _("Warna tombol", "Button colours"),
          _("Penggunaan memori, ukuran gambar yang dimuat, dan laporan crash dari alat seperti Firebase Crashlytics", "Memory use, loaded image sizes, and crash reports from tools like Firebase Crashlytics"),
          _("Jumlah unduhan", "Download count"),
          _("Nama aplikasi", "The app name"),
        ],
        a: 1,
        e: _("Banyak pengguna Indonesia memakai perangkat kelas menengah ke bawah. Data crash membantu menemukan penyebab pastinya.", "Many Indonesian users have mid to low-end phones. Crash data pinpoints the cause."),
      },
      {
        q: _("Perekrut menawarkan pekerjaan developer remote, lalu memintamu mengunduh dan menjalankan proyek dari repositori pribadi \"sebagai tes\", yang meminta akses ke dompet kripto. Apa yang sebaiknya dilakukan?", "A recruiter offers a remote developer job and asks you to download and run a project from a private repo \"as a test\", which requests crypto wallet access. What should you do?"),
        o: [
          _("Jalankan di laptop utama", "Run it on your main laptop"),
          _("Jangan jalankan; ini pola penipuan yang menyebarkan malware lewat tes coding palsu", "Don't run it; this is a known scam spreading malware through fake coding tests"),
          _("Jalankan tetapi matikan antivirus", "Run it with antivirus off"),
          _("Kirim ke teman untuk dijalankan", "Send it to a friend to run"),
        ],
        a: 1,
        e: _("Tes coding palsu dipakai untuk mencuri kredensial dan aset kripto. Periksa perusahaan, dan jangan jalankan kode asing di perangkat utama.", "Fake coding tests are used to steal credentials and crypto. Vet the company, and never run unknown code on your main machine."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis deskripsi pull request", "Write a pull request description"),
        brief: _(
          "Kamu baru menyelesaikan fitur \"lupa password\" lewat email untuk aplikasi web. Perubahannya: endpoint baru untuk meminta reset, token berlaku 30 menit, halaman form password baru, dan email template. Tulis deskripsi PR untuk reviewer.",
          "You just finished an email-based \"forgot password\" feature for a web app. Changes: a new endpoint to request a reset, tokens valid for 30 minutes, a new password form page, and an email template. Write the PR description for reviewers.",
        ),
        langkah: [
          _("Tulis ringkasan perubahan.", "Summarise the changes."),
          _("Jelaskan cara menguji.", "Explain how to test."),
          _("Sebutkan pertimbangan keamanan dan hal yang ingin direview khusus.", "Note security considerations and what you want reviewed."),
        ],
        rubrik: [
          _("Ringkasan jelas dan terstruktur", "Clear, structured summary"),
          _("Ada langkah pengujian yang bisa diikuti", "Followable testing steps"),
          _("Menyebut keamanan (token sekali pakai, kedaluwarsa, respons yang tidak membocorkan apakah email terdaftar)", "Covers security (single-use, expiring tokens, responses that don't reveal if an email exists)"),
          _("Meminta fokus review yang spesifik", "Requests specific review focus"),
        ],
        contoh: _(
          "## Ringkasan\nMenambahkan fitur lupa password lewat email.\n\n## Perubahan\n- POST /auth/forgot-password: membuat token reset dan mengirim email\n- Token acak, disimpan dalam bentuk hash, berlaku 30 menit, sekali pakai\n- Halaman /reset-password?token=... untuk mengatur password baru\n- Template email reset (ID dan EN)\n\n## Cara menguji\n1. Jalankan aplikasi lokal dengan mail catcher\n2. Minta reset untuk email terdaftar, buka tautan di email, ganti password\n3. Coba tautan yang sama lagi: harus ditolak\n4. Coba setelah 30 menit (atau ubah TTL di env): harus kedaluwarsa\n\n## Keamanan\n- Respons sama untuk email terdaftar maupun tidak, agar tidak bisa dipakai menebak akun\n- Ada rate limit 5 permintaan per jam per IP\n\n## Mohon direview\n- Logika kedaluwarsa token\n- Teks email versi Inggris",
          "## Summary\nAdds email-based password reset.\n\n## Changes\n- POST /auth/forgot-password: creates a reset token and sends an email\n- Random token, stored hashed, valid 30 minutes, single use\n- /reset-password?token=... page to set a new password\n- Reset email template (ID and EN)\n\n## How to test\n1. Run locally with a mail catcher\n2. Request a reset for a registered email, open the link, change the password\n3. Reuse the same link: it should be rejected\n4. Try after 30 minutes (or lower the TTL in env): it should expire\n\n## Security\n- Same response for registered and unknown emails, so accounts can't be enumerated\n- Rate limit of 5 requests per hour per IP\n\n## Please review\n- Token expiry logic\n- English email copy",
        ),
      },
      {
        judul: _("Pecah fitur menjadi tugas dan estimasi", "Break a feature into tasks with estimates"),
        brief: _(
          "Klien ingin fitur \"riwayat pesanan\" di aplikasi mobile: daftar pesanan, detail pesanan, filter berdasarkan status, dan tombol \"pesan lagi\". Tolong pecah menjadi tugas dan beri estimasi.",
          "The client wants an \"order history\" feature in the mobile app: an order list, order details, filtering by status, and a \"reorder\" button. Please break it into tasks with estimates.",
        ),
        langkah: [
          _("Pecah menjadi tugas kecil (masing-masing maksimal sekitar 1 hari).", "Split into small tasks (about 1 day max each)."),
          _("Beri estimasi untuk tiap tugas.", "Estimate each task."),
          _("Tulis asumsi dan pertanyaan untuk klien.", "List assumptions and questions for the client."),
        ],
        rubrik: [
          _("Tugas mencakup backend atau API, tampilan, dan pengujian", "Tasks cover backend/API, UI, and testing"),
          _("Tugas cukup kecil dan spesifik", "Tasks are small and specific"),
          _("Ada keadaan kosong, memuat, dan error", "Includes empty, loading, and error states"),
          _("Ada asumsi atau pertanyaan yang penting (misalnya stok saat pesan lagi)", "Raises key assumptions or questions (e.g. stock on reorder)"),
        ],
        contoh: _(
          "Tugas:\n1. API daftar pesanan dengan paginasi dan filter status: 1 hari\n2. API detail pesanan: 0,5 hari\n3. Layar daftar pesanan + filter: 1 hari\n4. Layar detail pesanan: 0,5 hari\n5. Tombol pesan lagi (menyalin item ke keranjang, cek stok dan harga terbaru): 1 hari\n6. Keadaan kosong, memuat, dan error: 0,5 hari\n7. Pengujian dan perbaikan: 1 hari\nTotal: sekitar 5,5 hari kerja\n\nAsumsi: data pesanan sudah tersedia di database.\nPertanyaan untuk klien:\n- Jika item sudah habis atau harganya berubah saat pesan lagi, apa yang ditampilkan?\n- Berapa lama riwayat yang ditampilkan (semua atau 12 bulan terakhir)?",
          "Tasks:\n1. Order list API with pagination and status filter: 1 day\n2. Order detail API: 0.5 day\n3. Order list screen + filter: 1 day\n4. Order detail screen: 0.5 day\n5. Reorder button (copies items to cart, checks current stock and price): 1 day\n6. Empty, loading, and error states: 0.5 day\n7. Testing and fixes: 1 day\nTotal: about 5.5 working days\n\nAssumption: order data already exists in the database.\nQuestions for the client:\n- If an item is out of stock or its price changed on reorder, what should we show?\n- How far back should history go (all or the last 12 months)?",
        ),
      },
    ],
  },

  "bot-otomasi": {
    kuis: [
      {
        q: _("Klien ingin setiap pesanan dari Google Form otomatis masuk ke spreadsheet dan pelanggan menerima email konfirmasi. Alat yang paling sederhana untuk mulai?", "The client wants every Google Form order to land in a spreadsheet and send the customer a confirmation email. Simplest tool to start?"),
        o: [
          _("Membangun server sendiri dari nol", "Build your own server from scratch"),
          _("Google Apps Script atau alat tanpa kode seperti Zapier, Make, atau n8n", "Google Apps Script or a no-code tool like Zapier, Make, or n8n"),
          _("Mengetik ulang setiap pesanan", "Retype every order"),
          _("Membeli software ERP", "Buy an ERP system"),
        ],
        a: 1,
        e: _("Untuk alur sederhana, solusi tanpa kode atau Apps Script lebih cepat dibuat dan lebih mudah dirawat klien.", "For simple flows, no-code tools or Apps Script are faster to build and easier for clients to maintain."),
      },
      {
        q: _("Otomasi berjalan setiap 5 menit dan kadang mengirim email ganda ke pelanggan. Penyebab yang mungkin dan solusinya?", "An automation runs every 5 minutes and sometimes double-emails customers. Likely cause and fix?"),
        o: [
          _("Emailnya rusak; kirim ulang semuanya", "Email is broken; resend everything"),
          _("Data yang sudah diproses tidak ditandai; tambahkan kolom status \"terkirim\" dan cek sebelum mengirim", "Processed rows aren't marked; add a \"sent\" status column and check it before sending"),
          _("Percepat jadwal menjadi setiap menit", "Run it every minute instead"),
          _("Matikan notifikasi email", "Turn off email notifications"),
        ],
        a: 1,
        e: _("Otomasi yang andal harus idempoten: memproses data yang sama berkali-kali tidak menghasilkan efek ganda.", "Reliable automations are idempotent: processing the same data twice doesn't double the effect."),
      },
      {
        q: _("Apa praktik yang benar untuk token API WhatsApp atau Telegram bot klien?", "What's the right practice for a client's WhatsApp or Telegram bot API token?"),
        o: [
          _("Tempel di dokumen yang dibagikan publik", "Paste it in a public shared doc"),
          _("Simpan di pengaturan rahasia atau environment variable, dan ganti segera jika bocor", "Keep it in secret settings or environment variables, and rotate it immediately if leaked"),
          _("Kirim lewat grup chat", "Send it in a group chat"),
          _("Tulis di kode lalu unggah ke GitHub publik", "Hardcode it and push to public GitHub"),
        ],
        a: 1,
        e: _("Token bot memberi kendali penuh atas bot. Siapa pun yang memegangnya bisa mengirim pesan atas nama klien.", "A bot token gives full control of the bot. Anyone holding it can message as the client."),
      },
      {
        q: _("Sebelum membangun otomasi, apa yang paling penting dipahami dulu?", "Before building an automation, what matters most to understand?"),
        o: [
          _("Alat apa yang paling populer", "Which tool is trendiest"),
          _("Alur kerja manual saat ini: langkahnya, datanya, pengecualiannya, dan siapa yang terlibat", "The current manual workflow: steps, data, exceptions, and who's involved"),
          _("Warna dashboard", "Dashboard colours"),
          _("Jumlah karyawan klien", "The client's headcount"),
        ],
        a: 1,
        e: _("Mengotomasi proses yang belum dipahami hanya mempercepat kekacauan. Pengecualian sering jadi sumber masalah.", "Automating a process you don't understand just speeds up the mess. Exceptions are often where things break."),
      },
      {
        q: _("Calon klien memintamu membuat bot yang mengirim pesan promosi massal ke ribuan nomor WhatsApp hasil scraping. Respons yang tepat?", "A prospect wants a bot that sends bulk promos to thousands of scraped WhatsApp numbers. Right response?"),
        o: [
          _("Buat, karena bayarannya besar", "Build it, the pay is good"),
          _("Tolak; ini spam, melanggar kebijakan WhatsApp, dan memakai data pribadi tanpa izin. Tawarkan alternatif seperti broadcast resmi ke pelanggan yang sudah setuju", "Decline; it's spam, breaks WhatsApp policy, and uses personal data without consent. Offer opt-in broadcasts via the official API instead"),
          _("Buat dengan nomor cadangan", "Build it with spare numbers"),
          _("Buat tetapi kirim pelan-pelan", "Build it but send slowly"),
        ],
        a: 1,
        e: _("Pesan massal ke nomor yang tidak memberi izin melanggar aturan platform dan pelindungan data. Nomor klien juga bisa diblokir permanen.", "Bulk messages to non-consenting numbers break platform rules and data protection law. The client's number can also be permanently banned."),
      },
    ],
    tugas: [
      {
        judul: _("Rancang alur otomasi pesanan", "Design an order automation flow"),
        brief: _(
          "Toko kue saya menerima pesanan lewat Google Form. Sekarang saya menyalin manual ke spreadsheet, mengirim WhatsApp konfirmasi, dan mencatat di kalender untuk tanggal pengambilan. Butuh 2 jam sehari. Bisa diotomasi?",
          "My cake shop takes orders through Google Forms. I currently copy them manually into a spreadsheet, send a WhatsApp confirmation, and add the pickup date to my calendar. It takes 2 hours a day. Can this be automated?",
        ),
        langkah: [
          _("Gambarkan alur otomasi langkah demi langkah (pemicu dan aksi).", "Describe the flow step by step (trigger and actions)."),
          _("Sebutkan alat yang dipakai dan alasannya.", "Name the tools and why."),
          _("Tulis cara menangani pengecualian, misalnya tanggal yang sudah penuh.", "Explain how to handle exceptions, such as fully booked dates."),
        ],
        rubrik: [
          _("Pemicu dan aksi jelas berurutan", "Triggers and actions are clearly ordered"),
          _("Alat sesuai skala usaha kecil", "Tools suit a small business"),
          _("Menyebut cara mengirim WhatsApp yang sah (WhatsApp Business API atau template, atau tautan wa.me untuk dikirim manual)", "Uses a legitimate WhatsApp method (Business API templates, or a wa.me link for manual sending)"),
          _("Ada penanganan pengecualian", "Handles exceptions"),
          _("Menyebut perkiraan waktu yang dihemat", "Estimates time saved"),
        ],
        contoh: _(
          "Alur:\n1. Pemicu: ada jawaban baru di Google Form\n2. Data otomatis masuk ke Google Sheets (bawaan Form), lalu Apps Script menambah nomor pesanan dan status \"Baru\"\n3. Apps Script membuat acara di Google Calendar pada tanggal pengambilan, berisi nama, pesanan, dan nomor HP\n4. Konfirmasi: untuk awal, sheet membuat tautan wa.me berisi pesan konfirmasi siap kirim, sehingga cukup satu klik. Jika pesanan sudah banyak, beralih ke WhatsApp Business API dengan pesan template\n\nPengecualian: Apps Script menghitung pesanan per tanggal. Jika melebihi kapasitas (misalnya 15 kue), status menjadi \"Perlu cek\" dan pemilik mendapat notifikasi email.\n\nAlat: Google Forms, Sheets, Calendar, dan Apps Script, karena gratis dan sudah dipakai.\n\nPerkiraan: waktu admin turun dari 2 jam menjadi sekitar 15 menit per hari.",
          "Flow:\n1. Trigger: a new Google Form response\n2. Data lands in Google Sheets (built-in), then Apps Script adds an order number and \"New\" status\n3. Apps Script creates a Google Calendar event on the pickup date with name, order, and phone\n4. Confirmation: to start, the sheet builds a wa.me link with a ready confirmation message, so it's one click. As volume grows, move to the WhatsApp Business API with template messages\n\nExceptions: Apps Script counts orders per date. Over capacity (say 15 cakes), status becomes \"Check\" and the owner gets an email alert.\n\nTools: Google Forms, Sheets, Calendar, and Apps Script, since they're free and already in use.\n\nEstimate: admin time drops from 2 hours to about 15 minutes a day.",
        ),
      },
      {
        judul: _("Tulis dokumentasi serah terima otomasi", "Write automation handover documentation"),
        brief: _(
          "Otomasi sudah jalan. Klien ingin dokumen singkat agar stafnya paham cara kerjanya dan apa yang harus dilakukan jika ada masalah.",
          "The automation is live. The client wants a short document so staff understand how it works and what to do when something goes wrong.",
        ),
        langkah: [
          _("Jelaskan cara kerja otomasi dalam bahasa sederhana.", "Explain how it works in plain language."),
          _("Tulis daftar masalah umum dan solusinya.", "List common problems and fixes."),
          _("Tulis siapa yang dihubungi dan informasi akun yang perlu dijaga.", "Say who to contact and which account details to protect."),
        ],
        rubrik: [
          _("Penjelasan bisa dipahami orang nonteknis", "Understandable to non-technical staff"),
          _("Ada tabel masalah umum dan solusinya", "Includes common problems and fixes"),
          _("Menyebut cara mengecek apakah otomasi berjalan", "Explains how to check it's running"),
          _("Menyebut kepemilikan akun dan keamanan akses", "Covers account ownership and access security"),
        ],
        contoh: _(
          "Cara kerja: setiap ada pesanan baru di Google Form, data otomatis masuk ke sheet \"Pesanan\", jadwal pengambilan masuk ke kalender toko, dan kolom \"Konfirmasi\" berisi tautan WhatsApp siap kirim.\n\nCara mengecek: buka sheet \"Log\". Setiap pesanan yang diproses tercatat dengan waktu. Jika log kosong lebih dari sehari padahal ada pesanan, otomasi mungkin berhenti.\n\nMasalah umum:\n• Pesanan tidak masuk kalender → cek apakah kolom tanggal di form diubah. Jangan ubah nama pertanyaan di form.\n• Status \"Perlu cek\" → tanggal itu sudah melebihi kapasitas. Hubungi pelanggan untuk menawarkan tanggal lain.\n• Muncul email \"Script error\" → teruskan ke [nama developer].\n\nAkun: semua berjalan di akun Google toko ([email toko]). Jangan bagikan password; jika staf berganti, cabut aksesnya di pengaturan berbagi.\n\nKontak: [nama developer], [WhatsApp], respons di hari kerja.",
          "How it works: each new Google Form order lands in the \"Orders\" sheet, the pickup is added to the shop calendar, and the \"Confirm\" column holds a ready WhatsApp link.\n\nHow to check: open the \"Log\" sheet. Every processed order is logged with a timestamp. If the log is empty for over a day despite orders, the automation may have stopped.\n\nCommon problems:\n• Order missing from the calendar → check whether the form's date question was changed. Don't rename form questions.\n• \"Check\" status → that date is over capacity. Contact the customer to offer another date.\n• A \"Script error\" email → forward it to [developer name].\n\nAccounts: everything runs on the shop's Google account ([shop email]). Don't share the password; when staff leave, remove their access in sharing settings.\n\nContact: [developer name], [WhatsApp], replies on working days.",
        ),
      },
    ],
  },

  "bug-maintenance": {
    kuis: [
      {
        q: _("Klien melapor, \"Website error.\" Apa pertanyaan pertama yang paling membantu?", "A client reports, \"The website has an error.\" Most helpful first question?"),
        o: [
          _("\"Sudah coba restart komputer?\"", "\"Have you restarted your computer?\""),
          _("\"Di halaman mana, apa yang dilakukan sebelum error muncul, dan boleh kirim tangkapan layarnya?\"", "\"Which page, what did you do before it appeared, and could you send a screenshot?\""),
          _("\"Websitenya sudah tua\"", "\"The site is just old\""),
          _("\"Saya tidak bisa membantu tanpa akses\"", "\"I can't help without access\""),
        ],
        a: 1,
        e: _("Langkah reproduksi dan tangkapan layar mempercepat diagnosis jauh lebih banyak daripada menebak.", "Reproduction steps and a screenshot speed up diagnosis far more than guessing."),
      },
      {
        q: _("Kamu berhasil memperbaiki bug di situs klien. Apa yang sebaiknya dilakukan setelahnya?", "You fixed a bug on a client's site. What should you do next?"),
        o: [
          _("Langsung tutup tiket tanpa kabar", "Close the ticket without a word"),
          _("Uji ulang alur terkait, catat penyebab dan solusinya, lalu laporkan ke klien", "Retest related flows, note the cause and fix, then report to the client"),
          _("Perbarui semua plugin sekaligus", "Update every plugin at once"),
          _("Ubah desain sekalian", "Redesign while you're at it"),
        ],
        a: 1,
        e: _("Perbaikan bisa memicu masalah di tempat lain. Catatan penyebab membantu mencegah masalah serupa di masa depan.", "Fixes can break things elsewhere. Notes on the cause help prevent repeats."),
      },
      {
        q: _("Website klien tiba-tiba mengarahkan pengunjung ke situs judi online. Kemungkinan penyebab dan langkah awal?", "A client's site suddenly redirects visitors to an online gambling site. Likely cause and first steps?"),
        o: [
          _("Iklan biasa, abaikan saja", "Normal ads, ignore it"),
          _("Situs diretas; ganti semua password, cari file atau kode berbahaya, pulihkan dari backup bersih, dan perbarui sistem", "The site is hacked; change all passwords, find malicious files or code, restore a clean backup, and update everything"),
          _("Ganti nama domain", "Change the domain name"),
          _("Matikan website selamanya", "Shut the site down forever"),
        ],
        a: 1,
        e: _("Redirect ke situs judi adalah tanda peretasan yang sangat umum di Indonesia. Bersihkan menyeluruh, karena penyerang sering meninggalkan pintu belakang.", "Redirects to gambling sites are a very common hack sign in Indonesia. Clean thoroughly, attackers often leave backdoors."),
      },
      {
        q: _("Klien bertanya kenapa perlu membayar pemeliharaan bulanan jika situsnya \"baik-baik saja\". Penjelasan terbaik?", "A client asks why they should pay for monthly maintenance if the site is \"fine\". Best explanation?"),
        o: [
          _("\"Karena semua orang melakukannya\"", "\"Because everyone does it\""),
          _("\"Pembaruan keamanan, backup rutin, dan pemantauan mencegah masalah yang biayanya jauh lebih mahal, seperti situs diretas atau data hilang\"", "\"Security updates, regular backups, and monitoring prevent much costlier problems like hacks or lost data\""),
          _("\"Supaya saya tetap punya pekerjaan\"", "\"So I keep having work\""),
          _("\"Itu wajib menurut hukum\"", "\"It's legally required\""),
        ],
        a: 1,
        e: _("Pemeliharaan menjual pencegahan. Jelaskan risiko dan biaya pemulihan dibanding biaya bulanan.", "Maintenance sells prevention. Compare recovery risks and costs with the monthly fee."),
      },
      {
        q: _("Seseorang menghubungimu: \"Saya pemilik website ini, tapi lupa password hosting. Tolong masuk lewat celahnya.\" Ia tidak bisa membuktikan kepemilikan. Apa yang dilakukan?", "Someone says: \"I own this site but forgot the hosting password. Please get in through a vulnerability.\" They can't prove ownership. What do you do?"),
        o: [
          _("Bantu masuk", "Help them in"),
          _("Tolak, dan arahkan ke proses pemulihan akun resmi dari penyedia hosting", "Decline, and direct them to the hosting provider's official account recovery"),
          _("Minta bayaran lebih", "Ask for more money"),
          _("Masuk lalu ganti passwordnya", "Get in and change the password"),
        ],
        a: 1,
        e: _("Masuk ke sistem tanpa izin pemilik sah adalah tindakan ilegal. Penyedia hosting punya proses verifikasi untuk kasus seperti ini.", "Accessing a system without the rightful owner's permission is illegal. Hosting providers have verification for such cases."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis laporan bug yang lengkap", "Write a complete bug report"),
        brief: _(
          "Klien bilang: \"Kadang form kontak tidak terkirim.\" Setelah kamu cek, form gagal saat nomor HP diisi dengan awalan +62, tetapi berhasil dengan awalan 08. Ini terjadi di semua browser. Tulis laporan bug untuk tim atau catatanmu sendiri.",
          "The client says: \"Sometimes the contact form doesn't send.\" You find it fails when the phone number starts with +62 but works with 08, in every browser. Write a bug report for the team or your own records.",
        ),
        langkah: [
          _("Tulis judul bug yang spesifik.", "Write a specific bug title."),
          _("Tulis langkah reproduksi, hasil yang diharapkan, dan hasil sebenarnya.", "Write reproduction steps, expected result, and actual result."),
          _("Usulkan kemungkinan penyebab dan solusinya.", "Suggest a likely cause and fix."),
        ],
        rubrik: [
          _("Judul spesifik, bukan \"form error\"", "Specific title, not \"form error\""),
          _("Langkah reproduksi bisa diikuti", "Reproduction steps are followable"),
          _("Hasil diharapkan dan sebenarnya dibedakan", "Expected and actual results separated"),
          _("Menyebut kemungkinan validasi nomor yang terlalu ketat", "Suggests overly strict phone validation"),
          _("Ada informasi lingkungan (browser, perangkat)", "Includes environment info (browser, device)"),
        ],
        contoh: _(
          "Judul: Form kontak gagal terkirim jika nomor HP diawali +62\n\nLangkah:\n1. Buka /kontak\n2. Isi nama, email, dan nomor HP +6281234567890\n3. Klik Kirim\n\nDiharapkan: form terkirim dan muncul pesan \"Terima kasih\"\nSebenarnya: tombol berputar lalu muncul \"Nomor tidak valid\", form tidak terkirim\n\nLingkungan: Chrome, Firefox, Safari (desktop dan HP)\nCatatan: dengan awalan 08 berhasil.\n\nKemungkinan penyebab: validasi nomor hanya menerima angka yang diawali 0, sehingga tanda + ditolak.\nUsulan: terima format 08, 628, dan +628, lalu ubah ke satu format sebelum disimpan.",
          "Title: Contact form fails to send when phone starts with +62\n\nSteps:\n1. Go to /contact\n2. Enter name, email, and phone +6281234567890\n3. Click Send\n\nExpected: the form sends and shows \"Thank you\"\nActual: the button spins, then \"Invalid number\" appears, and nothing is sent\n\nEnvironment: Chrome, Firefox, Safari (desktop and mobile)\nNote: works with an 08 prefix.\n\nLikely cause: phone validation only accepts numbers starting with 0, so the + is rejected.\nFix: accept 08, 628, and +628 formats, then normalise to one format before saving.",
        ),
      },
      {
        judul: _("Susun paket pemeliharaan bulanan", "Design a monthly maintenance package"),
        brief: _(
          "Saya punya 3 klien UMKM dengan website WordPress. Saya ingin menawarkan paket pemeliharaan bulanan yang jelas isinya. Tolong susun penawarannya.",
          "I have 3 small-business clients with WordPress sites. I want to offer a clearly defined monthly maintenance package. Please draft the offer.",
        ),
        langkah: [
          _("Tentukan isi paket (apa yang dikerjakan dan seberapa sering).", "Define what's included and how often."),
          _("Tentukan apa yang tidak termasuk.", "Define what's excluded."),
          _("Tulis laporan bulanan yang akan diterima klien.", "Describe the monthly report clients receive."),
        ],
        rubrik: [
          _("Ada backup rutin dan lokasi penyimpanan di luar server", "Includes regular backups stored off-server"),
          _("Ada pembaruan plugin, tema, dan sistem dengan pengecekan sesudahnya", "Includes plugin, theme, and core updates with post-checks"),
          _("Ada pemantauan keamanan dan uptime", "Includes security and uptime monitoring"),
          _("Batas pekerjaan jelas (misalnya jumlah jam perubahan kecil)", "Clear limits (e.g. hours of small changes)"),
          _("Ada laporan bulanan", "Includes a monthly report"),
        ],
        contoh: _(
          "Paket Pemeliharaan Bulanan\n\nTermasuk:\n• Backup otomatis harian, disimpan di penyimpanan cloud terpisah dari server\n• Pembaruan WordPress, tema, dan plugin setiap minggu, dicek setelahnya\n• Pemindaian malware dan pemantauan uptime 24 jam (notifikasi jika situs mati)\n• Perubahan kecil hingga 1 jam per bulan (mengganti teks, gambar, harga)\n• Respons masalah darurat di hari kerja maksimal 4 jam\n\nTidak termasuk: halaman atau fitur baru, desain ulang, penulisan konten, biaya hosting dan domain.\n\nLaporan bulanan: daftar pembaruan, hasil pemindaian keamanan, persentase uptime, kecepatan halaman, dan pekerjaan yang dilakukan.",
          "Monthly Maintenance Package\n\nIncluded:\n• Daily automatic backups, stored in cloud storage separate from the server\n• Weekly WordPress, theme, and plugin updates, checked afterwards\n• Malware scans and 24/7 uptime monitoring (alerts if the site goes down)\n• Up to 1 hour of small changes a month (text, images, prices)\n• Emergency response within 4 hours on working days\n\nExcluded: new pages or features, redesigns, copywriting, hosting and domain fees.\n\nMonthly report: updates applied, security scan results, uptime percentage, page speed, and work done.",
        ),
      },
    ],
  },

  "ai-specialist": {
    kuis: [
      {
        q: _("Prompt mana yang kemungkinan menghasilkan jawaban paling konsisten untuk membalas ulasan pelanggan?", "Which prompt is likely to give the most consistent replies to customer reviews?"),
        o: [
          _("\"Balas ulasan ini.\"", "\"Reply to this review.\""),
          _("Prompt yang menjelaskan peran, nada brand, panjang maksimal, hal yang tidak boleh dijanjikan, dan contoh balasan yang baik", "A prompt describing the role, brand tone, max length, what never to promise, and a good example reply"),
          _("\"Balas dengan sangat bagus.\"", "\"Reply really well.\""),
          _("Prompt berisi semua ulasan sekaligus tanpa instruksi", "All reviews at once with no instructions"),
        ],
        a: 1,
        e: _("Konteks, batasan, dan contoh membuat keluaran AI jauh lebih konsisten dan sesuai kebutuhan bisnis.", "Context, constraints, and examples make AI output far more consistent and on-brand."),
      },
      {
        q: _("Chatbot layanan pelanggan berbasis AI menjawab dengan informasi kebijakan refund yang salah. Pendekatan perbaikan terbaik?", "An AI support chatbot gives wrong refund policy information. Best fix?"),
        o: [
          _("Menambah kata \"jangan salah\" di prompt", "Add \"don't be wrong\" to the prompt"),
          _("Hubungkan chatbot ke dokumen kebijakan resmi (retrieval), minta ia menjawab hanya dari dokumen itu, dan arahkan ke manusia jika tidak yakin", "Ground it in the official policy documents (retrieval), answer only from them, and hand off to a human when unsure"),
          _("Matikan chatbot selamanya", "Turn the chatbot off for good"),
          _("Biarkan, pelanggan akan mengerti", "Leave it, customers will understand"),
        ],
        a: 1,
        e: _("Model bahasa bisa mengarang jawaban. Memberinya sumber resmi dan jalur ke manusia mengurangi risiko itu.", "Language models can make things up. Grounding them in official sources with a human fallback reduces that risk."),
      },
      {
        q: _("Klien ingin memasukkan data gaji seluruh karyawan ke chatbot AI publik gratis untuk dianalisis. Saran terbaik?", "A client wants to paste all employee salary data into a free public AI chatbot for analysis. Best advice?"),
        o: [
          _("Silakan saja", "Go ahead"),
          _("Hindari data sensitif di layanan yang kebijakan datanya tidak jelas; gunakan versi bisnis dengan perlindungan data, atau anonimkan dulu datanya", "Avoid sensitive data in services with unclear data policies; use a business tier with data protection, or anonymise first"),
          _("Masukkan setengahnya", "Paste half"),
          _("Kirim lewat email ke AI", "Email it to the AI"),
        ],
        a: 1,
        e: _("Layanan gratis bisa memakai data untuk pelatihan model. Data karyawan dilindungi undang-undang pelindungan data.", "Free services may use data for model training. Employee data is protected by data protection law."),
      },
      {
        q: _("Bagaimana cara terbaik membuktikan nilai proyek AI kepada klien?", "Best way to show an AI project's value to a client?"),
        o: [
          _("Menunjukkan model AI terbaru yang dipakai", "Show off the latest model used"),
          _("Mengukur waktu atau biaya sebelum dan sesudah, serta kualitas hasilnya", "Measure time or cost before and after, plus output quality"),
          _("Menyebut AI berkali-kali di presentasi", "Say \"AI\" often in the presentation"),
          _("Memakai istilah teknis sebanyak mungkin", "Use as much jargon as possible"),
        ],
        a: 1,
        e: _("Klien membayar untuk hasil bisnis. Angka sebelum dan sesudah adalah bukti yang paling meyakinkan.", "Clients pay for business results. Before-and-after numbers are the most convincing proof."),
      },
      {
        q: _("Seseorang menawarkan proyek membuat video AI yang meniru wajah dan suara pejabat untuk \"promosi investasi\". Respons yang tepat?", "Someone offers a project making AI videos imitating an official's face and voice to \"promote an investment\". Right response?"),
        o: [
          _("Terima, karena teknologinya menarik", "Accept, the tech is interesting"),
          _("Tolak; ini deepfake untuk penipuan dan melanggar hukum", "Decline; it's a deepfake for fraud and illegal"),
          _("Terima jika diberi watermark kecil", "Accept with a small watermark"),
          _("Terima tanpa mencantumkan nama", "Accept anonymously"),
        ],
        a: 1,
        e: _("Deepfake tokoh publik untuk mempromosikan investasi adalah modus penipuan yang marak. Ikut membuatnya bisa berujung pidana.", "Deepfakes of public figures promoting investments are a widespread scam. Taking part can lead to criminal charges."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis prompt sistem untuk chatbot toko", "Write a system prompt for a shop chatbot"),
        brief: _(
          "Toko online perlengkapan bayi kami ingin chatbot WhatsApp berbasis AI untuk menjawab pertanyaan umum: ongkir, cara retur, dan rekomendasi produk sesuai usia bayi. Chatbot tidak boleh memberi saran medis.",
          "Our online baby supplies shop wants an AI WhatsApp chatbot for common questions: shipping, returns, and product suggestions by baby age. It must not give medical advice.",
        ),
        langkah: [
          _("Tulis prompt sistem: peran, nada, sumber informasi, dan batasan.", "Write a system prompt: role, tone, information sources, and limits."),
          _("Tentukan kapan chatbot harus mengalihkan ke admin manusia.", "Define when it must hand off to a human admin."),
          _("Tulis 3 pertanyaan uji untuk mengecek prompt.", "Write 3 test questions to check the prompt."),
        ],
        rubrik: [
          _("Peran dan nada jelas", "Clear role and tone"),
          _("Chatbot hanya menjawab berdasarkan informasi toko yang diberikan", "Only answers from provided shop information"),
          _("Batasan medis tegas dan ada arahan ke tenaga kesehatan", "Firm medical limit with referral to health professionals"),
          _("Ada aturan pengalihan ke manusia", "Has human handoff rules"),
          _("Pertanyaan uji mencakup kasus sulit (pertanyaan medis, di luar topik)", "Test questions cover hard cases (medical, off-topic)"),
        ],
        contoh: _(
          "Prompt sistem:\n\"Kamu adalah asisten toko [Nama Toko], toko perlengkapan bayi. Jawab dengan ramah, singkat (maksimal 4 kalimat), dan dalam bahasa Indonesia sehari-hari yang sopan.\n\nJawab hanya berdasarkan informasi toko di bawah: daftar produk, kebijakan ongkir, dan kebijakan retur. Jika jawabannya tidak ada di informasi tersebut, katakan kamu akan menghubungkan ke admin.\n\nKamu tidak boleh memberi saran medis, dosis, atau diagnosis. Jika ditanya soal kesehatan bayi, sarankan berkonsultasi dengan dokter atau bidan, lalu tawarkan bantuan soal produk.\n\nAlihkan ke admin jika: pelanggan marah atau mengeluh, meminta refund, pesanan bermasalah, atau meminta bicara dengan manusia.\n\n[INFORMASI TOKO]\"\n\nPertanyaan uji:\n1. \"Ongkir ke Makassar berapa?\" (harus menjawab dari tabel ongkir)\n2. \"Bayi saya demam, boleh pakai minyak telon yang mana?\" (harus menolak memberi saran medis dan menyarankan dokter)\n3. \"Pesanan saya belum datang seminggu!\" (harus dialihkan ke admin)",
          "System prompt:\n\"You're the assistant for [Shop Name], a baby supplies shop. Reply warmly, briefly (4 sentences max), in polite everyday Indonesian.\n\nAnswer only from the shop information below: product list, shipping policy, and returns policy. If the answer isn't there, say you'll connect them to an admin.\n\nNever give medical advice, dosages, or diagnoses. If asked about a baby's health, suggest consulting a doctor or midwife, then offer help with products.\n\nHand off to an admin when the customer is upset or complaining, requests a refund, has an order problem, or asks for a human.\n\n[SHOP INFORMATION]\"\n\nTest questions:\n1. \"How much is shipping to Makassar?\" (should answer from the shipping table)\n2. \"My baby has a fever, which balm should I use?\" (should decline medical advice and suggest a doctor)\n3. \"My order hasn't arrived in a week!\" (should hand off to an admin)",
        ),
      },
      {
        judul: _("Usulkan penerapan AI untuk sebuah kantor", "Propose AI use cases for an office"),
        brief: _(
          "Kami kantor konsultan pajak dengan 12 staf. Banyak waktu habis untuk membalas email klien yang mirip-mirip, merangkum peraturan baru, dan menyusun notulen rapat. Bagaimana AI bisa membantu dengan aman?",
          "We're a tax consulting office with 12 staff. Lots of time goes to answering similar client emails, summarising new regulations, and writing meeting minutes. How can AI help safely?",
        ),
        langkah: [
          _("Usulkan 3 penerapan AI dengan perkiraan manfaatnya.", "Propose 3 AI use cases with expected benefits."),
          _("Tulis aturan keamanan data untuk staf.", "Write data security rules for staff."),
          _("Usulkan cara memulai secara bertahap.", "Suggest a phased rollout."),
        ],
        rubrik: [
          _("Penerapan sesuai masalah yang disebut klien", "Use cases match the client's problems"),
          _("Ada perkiraan manfaat yang terukur", "Includes measurable expected benefits"),
          _("Ada aturan data klien dan pemeriksaan manusia", "Covers client data rules and human review"),
          _("Mengingatkan bahwa rangkuman peraturan harus dicek ke sumber resmi", "Notes regulation summaries must be checked against official sources"),
          _("Ada rencana uji coba bertahap", "Includes a phased pilot"),
        ],
        contoh: _(
          "Penerapan:\n1. Draf balasan email: AI menyusun draf dari template jawaban kantor, staf memeriksa dan mengirim. Perkiraan hemat 30 sampai 40% waktu membalas email rutin.\n2. Rangkuman peraturan: AI merangkum peraturan baru menjadi poin dampak bagi klien. Wajib dicek ulang ke teks resmi sebelum dibagikan.\n3. Notulen rapat: transkripsi otomatis lalu dirangkum menjadi keputusan dan tindak lanjut.\n\nAturan keamanan:\n• Gunakan layanan AI versi bisnis yang tidak memakai data untuk pelatihan model\n• Jangan masukkan NPWP, NIK, atau angka keuangan klien yang tidak perlu; samarkan nama klien\n• Semua keluaran AI diperiksa manusia sebelum dikirim\n\nTahapan: bulan 1 uji coba notulen dan rangkuman dengan 3 staf; bulan 2 tambah draf email; bulan 3 evaluasi waktu yang dihemat dan perluas ke semua staf.",
          "Use cases:\n1. Email drafts: AI drafts from the office's answer templates, staff review and send. Expected 30 to 40% time saved on routine emails.\n2. Regulation summaries: AI summarises new rules into client-impact points. Must be checked against the official text before sharing.\n3. Meeting minutes: automatic transcription summarised into decisions and action items.\n\nSecurity rules:\n• Use business-tier AI services that don't train on your data\n• Don't enter tax IDs, national IDs, or unnecessary client financials; anonymise client names\n• A person reviews all AI output before it's sent\n\nRollout: month 1 pilot minutes and summaries with 3 staff; month 2 add email drafts; month 3 measure time saved and expand to all staff.",
        ),
      },
    ],
  },
};
