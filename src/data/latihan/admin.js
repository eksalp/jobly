import { t as _ } from "../../i18n.js";

/**
 * Latihan praktik kategori Administrasi & Dukungan.
 * Setiap set: kuis (q: soal, o: pilihan, a: indeks jawaban benar, e: penjelasan)
 * dan tugas (judul, brief, langkah, rubrik, contoh).
 */
export default {
  "virtual-assistant": {
    kuis: [
      {
        q: _("Klienmu di Australia meminta rapat \"besok jam 9 pagi\". Kamu di Jakarta (WIB). Apa langkah paling tepat?", "Your client in Australia asks for a meeting \"tomorrow at 9 am\". You're in Jakarta (WIB). What's the best move?"),
        o: [
          _("Langsung jadwalkan jam 9 pagi WIB", "Schedule it at 9 am WIB right away"),
          _("Konfirmasi zona waktunya, lalu kirim undangan kalender yang otomatis menyesuaikan zona waktu", "Confirm the time zone, then send a calendar invite that adjusts to each time zone"),
          _("Tunggu klien mengirim undangan sendiri", "Wait for the client to send the invite"),
          _("Jadwalkan jam 9 malam WIB karena pasti selisihnya 12 jam", "Schedule it at 9 pm WIB because the gap must be 12 hours"),
        ],
        a: 1,
        e: _("Selisih waktu dengan Australia berubah-ubah karena daylight saving dan perbedaan negara bagian. Konfirmasi zona waktunya dan pakai undangan kalender agar tidak ada salah paham.", "The gap with Australia changes with daylight saving and differs by state. Confirm the time zone and use a calendar invite so nobody gets it wrong."),
      },
      {
        q: _("Ada tiga permintaan masuk bersamaan: invoice yang jatuh tempo hari ini, merapikan folder Drive, dan riset hotel untuk perjalanan bulan depan. Mana yang dikerjakan lebih dulu?", "Three requests arrive at once: an invoice due today, tidying a Drive folder, and researching hotels for next month's trip. Which comes first?"),
        o: [
          _("Merapikan folder Drive karena paling cepat", "Tidying the Drive folder because it's quickest"),
          _("Riset hotel karena klien paling antusias", "Hotel research because the client seemed most excited"),
          _("Invoice yang jatuh tempo hari ini", "The invoice due today"),
          _("Kerjakan ketiganya sedikit-sedikit secara bergantian", "Work on all three a little at a time"),
        ],
        a: 2,
        e: _("Dahulukan yang mendesak dan berdampak langsung, yaitu tenggat hari ini yang menyangkut uang. Jika ragu soal prioritas, tanyakan kepada klien.", "Start with what's urgent and has direct impact: a same-day deadline involving money. When in doubt, ask the client to confirm priorities."),
      },
      {
        q: _("Klien memberimu akses ke email dan akun bank bisnisnya. Praktik mana yang paling aman?", "A client gives you access to their email and business bank account. Which practice is safest?"),
        o: [
          _("Simpan semua password di catatan ponsel agar mudah diingat", "Keep all passwords in your phone's notes so you remember them"),
          _("Minta akses lewat password manager atau akun delegasi, dan aktifkan verifikasi dua langkah", "Ask for access through a password manager or a delegate account, with two-step verification on"),
          _("Pakai satu password yang sama untuk semua akun klien", "Use one password for all client accounts"),
          _("Kirim password lewat chat grup supaya tim juga bisa masuk", "Share passwords in a group chat so the team can log in too"),
        ],
        a: 1,
        e: _("Password manager dan akun delegasi membuat akses bisa dicabut kapan saja tanpa membuka password asli. Ini melindungi klien sekaligus dirimu.", "Password managers and delegate accounts let access be revoked anytime without exposing the real password. That protects the client and you."),
      },
      {
        q: _("Klien baru minta kamu \"mengerjakan sedikit tambahan\" di luar paket yang disepakati, hampir setiap hari. Respons yang paling profesional?", "A new client keeps asking you to do \"a little extra\" outside the agreed package, almost daily. What's the most professional response?"),
        o: [
          _("Kerjakan saja diam-diam supaya klien senang", "Just do it quietly to keep the client happy"),
          _("Tolak semua permintaan tambahan tanpa penjelasan", "Refuse all extra requests without explanation"),
          _("Catat tambahan pekerjaannya, lalu tawarkan penyesuaian paket atau tarif per jam untuk pekerjaan di luar cakupan", "Log the extra work, then offer a package upgrade or an hourly rate for out-of-scope tasks"),
          _("Berhenti bekerja dengan klien itu", "Stop working with that client"),
        ],
        a: 2,
        e: _("Catatan pekerjaan membuat pembicaraan berbasis data, bukan perasaan. Menawarkan opsi menjaga hubungan baik sekaligus menghargai waktumu.", "A work log keeps the conversation based on facts, not feelings. Offering options protects the relationship and your time."),
      },
      {
        q: _("Kamu menerima tawaran VA via Telegram: gaji US$800 per bulan, tanpa interview, tetapi diminta membayar Rp350.000 untuk \"akun pelatihan\". Apa yang sebaiknya dilakukan?", "You get a VA offer on Telegram: US$800 a month, no interview, but you must pay Rp350,000 for a \"training account\". What should you do?"),
        o: [
          _("Bayar, karena gajinya jauh lebih besar dari biayanya", "Pay, since the salary is far bigger than the fee"),
          _("Tawar biayanya menjadi lebih murah", "Negotiate the fee down"),
          _("Tolak dan laporkan, karena perekrut yang sah tidak meminta biaya dari pelamar", "Decline and report it, because legitimate recruiters don't charge applicants"),
          _("Minta teman membayarkan dulu", "Ask a friend to pay first"),
        ],
        a: 2,
        e: _("Gaji tinggi tanpa seleksi ditambah permintaan biaya di awal adalah pola penipuan yang sangat umum. Pekerjaan sungguhan membayarmu, bukan sebaliknya.", "High pay with no screening plus an upfront fee is a very common scam pattern. Real jobs pay you, not the other way around."),
      },
    ],
    tugas: [
      {
        judul: _("Rapikan jadwal minggu depan klien", "Organise the client's schedule for next week"),
        brief: _(
          "Hai, minggu depan jadwalku kacau. Senin aku perlu rapat dengan tim desain (1 jam), Selasa ada call dengan investor di London (30 menit, mereka hanya bisa jam 9 sampai 11 pagi waktu London), dan aku ingin blok 2 jam setiap pagi untuk fokus kerja. Aku tidak mau rapat setelah jam 4 sore WIB. Tolong susun jadwalnya dan kabari aku.",
          "Hi, my schedule next week is a mess. On Monday I need a meeting with the design team (1 hour), on Tuesday there's a call with an investor in London (30 minutes, they're only free 9 to 11 am London time), and I want a 2-hour focus block every morning. No meetings after 4 pm WIB. Please put it together and let me know.",
        ),
        langkah: [
          _("Hitung jam call investor dalam WIB (anggap London sedang memakai GMT+1, berarti selisih 6 jam).", "Convert the investor call to WIB (assume London is on GMT+1, a 6-hour gap)."),
          _("Susun jadwal Senin sampai Jumat yang memenuhi semua permintaan.", "Build a Monday-to-Friday schedule that meets every request."),
          _("Tulis pesan singkat ke klien yang merangkum jadwal dan hal yang perlu ia konfirmasi.", "Write a short message to the client summarising the schedule and anything they need to confirm."),
        ],
        rubrik: [
          _("Jam call investor dikonversi dengan benar (jam 9 sampai 11 London = jam 15.00 sampai 17.00 WIB)", "The investor call is converted correctly (9 to 11 am London = 3 to 5 pm WIB)"),
          _("Menyadari bahwa call investor harus jam 15.00 sampai 15.30 WIB agar tidak melewati jam 4 sore", "Notices the investor call must be 3:00 to 3:30 pm WIB to stay before 4 pm"),
          _("Blok fokus 2 jam ada setiap pagi dan tidak bentrok dengan rapat", "A 2-hour focus block appears every morning without clashing with meetings"),
          _("Pesan ke klien ringkas, jelas, dan menyebutkan hal yang perlu dikonfirmasi", "The message is brief, clear, and lists what needs confirming"),
        ],
        contoh: _(
          "Jadwal minggu depan:\n• Setiap hari, 08.00 sampai 10.00 WIB: blok fokus (tanpa rapat)\n• Senin, 10.30 sampai 11.30 WIB: rapat tim desain\n• Selasa, 15.00 sampai 15.30 WIB: call investor London (09.00 sampai 09.30 waktu London)\n\nPesan ke klien:\n\"Hai, jadwal minggu depan sudah saya susun. Blok fokus setiap pagi jam 08.00 sampai 10.00. Rapat tim desain Senin jam 10.30. Call investor saya usulkan Selasa jam 15.00 WIB (09.00 London), satu-satunya slot yang masih sebelum jam 4 sore. Mohon konfirmasi apakah jam 10.30 Senin cocok untuk tim desain, lalu saya kirim undangannya.\"",
          "Next week's schedule:\n• Every day, 8:00 to 10:00 am WIB: focus block (no meetings)\n• Monday, 10:30 to 11:30 am WIB: design team meeting\n• Tuesday, 3:00 to 3:30 pm WIB: London investor call (9:00 to 9:30 am London time)\n\nMessage to the client:\n\"Hi, next week's schedule is ready. Focus block every morning 8 to 10. Design team meeting Monday at 10:30. I suggest the investor call on Tuesday at 3 pm WIB (9 am London), the only slot that still ends before 4 pm. Please confirm Monday 10:30 works for the design team and I'll send the invites.\"",
        ),
      },
      {
        judul: _("Balas email yang menumpuk", "Reply to a pile of emails"),
        brief: _(
          "Kotak masukku penuh. Tolong buat draf balasan untuk email ini: seorang vendor menagih invoice yang menurutku sudah dibayar minggu lalu. Aku tidak mau terdengar marah, tapi ingin masalahnya cepat beres.",
          "My inbox is overflowing. Please draft a reply to this one: a vendor is chasing an invoice I believe was paid last week. I don't want to sound angry, but I want it sorted quickly.",
        ),
        langkah: [
          _("Tulis draf balasan email ke vendor atas nama klien.", "Draft the email reply to the vendor on the client's behalf."),
          _("Sertakan informasi yang membantu vendor mengecek pembayaran.", "Include details that help the vendor check the payment."),
          _("Tambahkan catatan singkat untuk klien tentang data yang perlu ia lengkapi sebelum email dikirim.", "Add a short note to the client about any details they must fill in before sending."),
        ],
        rubrik: [
          _("Nada sopan dan tidak menyalahkan", "The tone is polite and not accusing"),
          _("Menyebut detail pembayaran (tanggal, nominal, nomor invoice, atau bukti transfer)", "Mentions payment details (date, amount, invoice number, or transfer receipt)"),
          _("Ada permintaan tindakan yang jelas dari vendor", "Asks the vendor for a clear action"),
          _("Ada catatan untuk klien tentang data yang belum diketahui", "Includes a note to the client about missing details"),
        ],
        contoh: _(
          "Subjek: Re: Invoice INV-0412\n\nHalo Bu Rina,\n\nTerima kasih atas pengingatnya. Menurut catatan kami, invoice INV-0412 sebesar Rp4.500.000 sudah kami transfer pada [tanggal] ke rekening [bank] atas nama [nama]. Bukti transfer saya lampirkan.\n\nBoleh dibantu dicek kembali di sisi Ibu? Jika dananya belum masuk, mohon kabari kami agar bisa segera ditelusuri bersama bank.\n\nSalam,\n[Nama klien]\n\nCatatan untuk klien: mohon isi tanggal transfer dan lampirkan bukti transfernya sebelum email dikirim.",
          "Subject: Re: Invoice INV-0412\n\nHi Rina,\n\nThanks for the reminder. Our records show invoice INV-0412 for Rp4,500,000 was transferred on [date] to the [bank] account under [name]. I've attached the receipt.\n\nCould you check again on your side? If the funds haven't arrived, let us know and we'll trace it with the bank right away.\n\nBest,\n[Client name]\n\nNote to client: please add the transfer date and attach the receipt before sending.",
        ),
      },
    ],
  },

  "customer-support": {
    kuis: [
      {
        q: _("Pelanggan marah karena paketnya terlambat 5 hari dan menulis dengan huruf kapital semua. Kalimat pembuka terbaik?", "A customer is angry because their parcel is 5 days late and writes in all caps. Best opening line?"),
        o: [
          _("\"Mohon tidak menggunakan huruf kapital.\"", "\"Please don't use capital letters.\""),
          _("\"Keterlambatan bukan kesalahan kami, itu dari kurir.\"", "\"The delay isn't our fault, it's the courier's.\""),
          _("\"Maaf atas keterlambatannya, saya mengerti ini menyebalkan. Saya cek posisi paketnya sekarang.\"", "\"Sorry for the delay, I understand how frustrating this is. I'm checking where your parcel is now.\""),
          _("\"Silakan tunggu saja, nanti juga sampai.\"", "\"Please just wait, it'll arrive eventually.\""),
        ],
        a: 2,
        e: _("Akui perasaan pelanggan dan langsung tunjukkan tindakan. Menyalahkan pihak lain atau menegur cara menulis justru memperburuk suasana.", "Acknowledge the feeling and show action straight away. Blaming others or correcting how they write only makes it worse."),
      },
      {
        q: _("Pelanggan menanyakan hal yang jawabannya belum kamu ketahui. Apa yang sebaiknya dilakukan?", "A customer asks something you don't know the answer to yet. What should you do?"),
        o: [
          _("Menebak jawaban supaya respons cepat", "Guess so the reply is fast"),
          _("Sampaikan bahwa kamu sedang mengeceknya, beri perkiraan waktu, lalu tanyakan ke tim terkait", "Say you're checking, give a time estimate, then ask the relevant team"),
          _("Abaikan sampai pelanggan bertanya lagi", "Ignore it until they ask again"),
          _("Tutup tiket dan minta pelanggan membuka tiket baru", "Close the ticket and ask them to open a new one"),
        ],
        a: 1,
        e: _("Jawaban yang salah lebih merusak daripada jawaban yang sedikit lebih lambat. Kejelasan soal waktu membuat pelanggan tetap tenang.", "A wrong answer does more damage than a slightly slower one. A clear time estimate keeps the customer calm."),
      },
      {
        q: _("Metrik apa yang paling menggambarkan apakah masalah pelanggan benar-benar selesai pada kontak pertama?", "Which metric best shows whether a customer's issue was actually solved on first contact?"),
        o: [
          _("First Contact Resolution (FCR)", "First Contact Resolution (FCR)"),
          _("Jumlah chat per jam", "Chats per hour"),
          _("Panjang rata-rata balasan", "Average reply length"),
          _("Jumlah emoji yang dipakai", "Number of emojis used"),
        ],
        a: 0,
        e: _("FCR mengukur persentase masalah yang selesai tanpa pelanggan perlu menghubungi lagi. Kecepatan saja tidak berarti masalahnya beres.", "FCR measures the share of issues solved without the customer needing to contact you again. Speed alone doesn't mean it's solved."),
      },
      {
        q: _("Seseorang di chat mengaku pemilik akun dan meminta email akun diganti, tetapi tidak bisa menjawab pertanyaan verifikasi. Langkah yang benar?", "Someone in chat claims to own an account and asks to change its email, but can't answer the verification questions. What's right?"),
        o: [
          _("Ganti saja, karena ia terdengar meyakinkan", "Change it, they sound convincing"),
          _("Tolak dengan sopan dan arahkan ke prosedur verifikasi resmi", "Politely decline and point them to the official verification process"),
          _("Kirim kode OTP ke nomor yang ia sebutkan di chat", "Send an OTP to the number they give in chat"),
          _("Minta foto KTP lewat chat lalu langsung ganti", "Ask for an ID photo in chat and change it immediately"),
        ],
        a: 1,
        e: _("Ini pola pengambilalihan akun. Agen CS wajib mengikuti prosedur verifikasi, seberapa pun meyakinkan ceritanya.", "This is an account-takeover pattern. Support agents must follow verification procedure, however convincing the story."),
      },
      {
        q: _("Lowongan \"CS online dari rumah\" meminta pelamar membeli paket internet dan headset dari toko yang mereka tunjuk sebelum pelatihan. Bagaimana menilainya?", "A \"work-from-home CS\" listing requires buying an internet package and headset from their chosen shop before training. How do you judge it?"),
        o: [
          _("Wajar, karena alat kerja memang perlu", "Normal, work equipment is needed"),
          _("Wajar asalkan harganya murah", "Fine as long as it's cheap"),
          _("Mencurigakan, karena perusahaan sah tidak mewajibkan pembelian dari toko tertentu sebagai syarat diterima", "Suspicious, because legitimate companies don't require purchases from a specific shop as a hiring condition"),
          _("Aman jika pembayarannya lewat e-wallet", "Safe if paid by e-wallet"),
        ],
        a: 2,
        e: _("Kewajiban membeli dari pihak tertentu adalah cara lain meminta uang dari pelamar. Perusahaan boleh mensyaratkan spesifikasi alat, bukan tempat membelinya.", "Forcing purchases from a specific seller is another way to take money from applicants. Companies may set equipment specs, not where to buy."),
      },
    ],
    tugas: [
      {
        judul: _("Tenangkan pelanggan yang menerima barang rusak", "Calm a customer who received a damaged item"),
        brief: _(
          "Pesan pelanggan: \"Saya beli blender dua hari lalu, sampai dalam keadaan pecah. Ini kado ulang tahun ibu saya besok. Kecewa banget!\" Kebijakan toko: penggantian barang gratis jika ada video unboxing, pengiriman ulang 2 sampai 3 hari kerja, atau refund penuh.",
          "Customer message: \"I bought a blender two days ago and it arrived broken. It's my mum's birthday present for tomorrow. So disappointed!\" Store policy: free replacement with an unboxing video, reshipping takes 2 to 3 working days, or a full refund.",
        ),
        langkah: [
          _("Tulis balasan chat pertama untuk pelanggan.", "Write the first chat reply to the customer."),
          _("Tawarkan solusi sesuai kebijakan dan jujur soal waktu pengiriman.", "Offer solutions within policy and be honest about delivery time."),
          _("Jelaskan langkah berikutnya yang perlu dilakukan pelanggan.", "Explain the next step the customer needs to take."),
        ],
        rubrik: [
          _("Meminta maaf dan menunjukkan empati pada situasi kadonya", "Apologises and shows empathy about the gift"),
          _("Menawarkan pilihan penggantian atau refund", "Offers a replacement or refund option"),
          _("Jujur bahwa penggantian kemungkinan tidak sampai besok", "Is honest that a replacement likely won't arrive tomorrow"),
          _("Menjelaskan data yang dibutuhkan (video unboxing, nomor pesanan)", "Explains what's needed (unboxing video, order number)"),
          _("Singkat dan mudah dibaca di layar ponsel", "Short and easy to read on a phone screen"),
        ],
        contoh: _(
          "Halo Kak, mohon maaf sekali blendernya sampai dalam keadaan pecah, apalagi untuk kado ulang tahun ibu besok. Saya bantu selesaikan sekarang ya.\n\nAda dua pilihan:\n1. Penggantian barang gratis, dikirim 2 sampai 3 hari kerja\n2. Refund penuh ke metode pembayaran Kakak\n\nSejujurnya, penggantian kemungkinan belum sampai besok. Jika Kakak perlu membeli di tempat lain untuk besok, refund mungkin lebih praktis.\n\nBoleh kirimkan nomor pesanan dan video unboxing-nya? Setelah itu saya proses hari ini juga.",
          "Hi, I'm so sorry the blender arrived broken, especially as it's your mum's birthday gift tomorrow. Let me sort this out now.\n\nThere are two options:\n1. A free replacement, shipped in 2 to 3 working days\n2. A full refund to your payment method\n\nHonestly, a replacement probably won't arrive by tomorrow. If you need to buy one elsewhere for tomorrow, a refund may be more practical.\n\nCould you send your order number and unboxing video? I'll process it today.",
        ),
      },
      {
        judul: _("Tulis template jawaban untuk pertanyaan yang sering muncul", "Write a saved reply for a frequent question"),
        brief: _(
          "Setiap hari kami menerima puluhan pertanyaan \"Kenapa saldo refund saya belum masuk?\". Refund ke e-wallet masuk dalam 1x24 jam, ke rekening bank 3 sampai 7 hari kerja. Tolong buat satu template yang bisa dipakai semua agen.",
          "Every day we get dozens of \"Why hasn't my refund arrived?\" questions. E-wallet refunds take up to 24 hours, bank transfers 3 to 7 working days. Please write one saved reply all agents can use.",
        ),
        langkah: [
          _("Tulis template dengan bagian yang bisa diisi agen, misalnya [nama] dan [tanggal].", "Write a template with fields agents fill in, such as [name] and [date]."),
          _("Jelaskan perbedaan waktu e-wallet dan bank dengan jelas.", "Explain the e-wallet versus bank timing clearly."),
          _("Tambahkan langkah jika refund melewati batas waktu.", "Add what to do if the refund passes the time limit."),
        ],
        rubrik: [
          _("Ada bagian isian yang jelas untuk agen", "Has clear fields for agents to fill in"),
          _("Informasi waktu refund benar dan mudah dipahami", "Refund timing is correct and easy to understand"),
          _("Ada solusi jika melewati batas waktu", "Includes a fallback if the time limit passes"),
          _("Nada ramah dan tidak terasa seperti robot", "Friendly tone that doesn't sound robotic"),
        ],
        contoh: _(
          "Halo Kak [nama], terima kasih sudah menunggu.\n\nRefund untuk pesanan [nomor pesanan] sudah kami proses pada [tanggal]. Waktu masuknya tergantung metode pembayaran:\n• E-wallet: paling lambat 1x24 jam\n• Rekening bank: 3 sampai 7 hari kerja\n\nJika setelah [tanggal batas] dananya belum masuk, balas chat ini dengan tangkapan layar mutasi rekening atau riwayat e-wallet Kakak, lalu kami telusuri langsung dengan tim keuangan.",
          "Hi [name], thanks for waiting.\n\nThe refund for order [order number] was processed on [date]. When it arrives depends on the payment method:\n• E-wallet: within 24 hours\n• Bank account: 3 to 7 working days\n\nIf it still hasn't arrived after [deadline date], reply here with a screenshot of your bank statement or e-wallet history and we'll trace it with our finance team.",
        ),
      },
    ],
  },

  transkripsi: {
    kuis: [
      {
        q: _("Dalam transkrip clean verbatim, bagaimana kamu menangani \"eee\", \"hmm\", dan pengulangan kata?", "In a clean verbatim transcript, how do you handle \"umm\", \"hmm\", and repeated words?"),
        o: [
          _("Ditulis semua persis seperti di rekaman", "Write them all exactly as recorded"),
          _("Dihapus, selama tidak mengubah makna kalimat", "Remove them, as long as the meaning doesn't change"),
          _("Diganti dengan kata yang lebih formal", "Replace them with more formal words"),
          _("Ditandai dengan huruf tebal", "Mark them in bold"),
        ],
        a: 1,
        e: _("Clean verbatim membuang pengisi dan pengulangan agar mudah dibaca, tetapi tidak mengubah isi. Full verbatim justru menuliskan semuanya.", "Clean verbatim drops fillers and repetition for readability without changing content. Full verbatim keeps everything."),
      },
      {
        q: _("Ada kata yang benar-benar tidak terdengar di menit 12:41. Cara menandainya yang lazim?", "A word is completely inaudible at 12:41. What's the usual way to mark it?"),
        o: [
          _("Tebak kata yang paling mungkin", "Guess the most likely word"),
          _("Lewati tanpa tanda", "Skip it without a mark"),
          _("Tulis [tidak terdengar 12:41]", "Write [inaudible 12:41]"),
          _("Tulis tiga titik saja", "Just write three dots"),
        ],
        a: 2,
        e: _("Tanda beserta stempel waktu memudahkan klien mengecek bagian itu sendiri. Menebak bisa mengubah makna, terutama di wawancara riset atau hukum.", "A tag with a timestamp lets the client check that part themselves. Guessing can change meaning, especially in research or legal interviews."),
      },
      {
        q: _("Kamu memakai alat transkripsi otomatis untuk draf awal. Apa yang tetap wajib dilakukan?", "You use an automatic transcription tool for the first draft. What must you still do?"),
        o: [
          _("Langsung kirim karena AI sudah akurat", "Send it as-is since AI is accurate"),
          _("Dengarkan ulang dan koreksi kata per kata, terutama nama, angka, dan istilah", "Re-listen and correct word by word, especially names, numbers, and terms"),
          _("Cukup cek ejaan dengan spell checker", "Just run a spell checker"),
          _("Ganti semua nama dengan inisial", "Replace all names with initials"),
        ],
        a: 1,
        e: _("AI sering salah pada nama, angka, istilah, dan campuran bahasa. Nilai pekerjaanmu ada di akurasi hasil koreksi itu.", "AI often gets names, numbers, terms, and mixed languages wrong. Your value is the accuracy of that correction."),
      },
      {
        q: _("Klien meminta transkrip rekaman rapat internal yang berisi data gaji karyawan. Apa yang paling tepat?", "A client sends an internal meeting recording containing staff salary data. What's most appropriate?"),
        o: [
          _("Simpan rekaman di folder publik agar mudah diakses", "Store it in a public folder for easy access"),
          _("Hapus file setelah proyek selesai sesuai kesepakatan dan jangan bagikan ke siapa pun", "Delete the files after the project as agreed and never share them"),
          _("Pakai cuplikannya sebagai contoh portofolio", "Use clips as portfolio samples"),
          _("Unggah ke situs transkripsi gratis mana saja", "Upload it to any free transcription site"),
        ],
        a: 1,
        e: _("Rekaman klien bersifat rahasia. Gunakan alat yang aman, jangan jadikan portofolio, dan hapus sesuai kesepakatan.", "Client recordings are confidential. Use secure tools, never use them as portfolio pieces, and delete them as agreed."),
      },
      {
        q: _("Situs transkripsi meminta \"deposit tes\" Rp100.000 yang katanya dikembalikan setelah lulus tes. Ini tanda apa?", "A transcription site asks for a Rp100,000 \"test deposit\", refunded after you pass. What does this signal?"),
        o: [
          _("Standar industri transkripsi", "Industry standard for transcription"),
          _("Tanda penipuan, karena platform yang sah tidak memungut biaya untuk tes", "A scam sign, since legitimate platforms don't charge for tests"),
          _("Wajar jika jumlahnya kecil", "Fine if the amount is small"),
          _("Aman jika ada testimoni di situsnya", "Safe if the site shows testimonials"),
        ],
        a: 1,
        e: _("Platform transkripsi yang sah memberi tes gratis. Deposit yang \"dikembalikan nanti\" hampir tidak pernah kembali.", "Legitimate transcription platforms test you for free. Deposits \"refunded later\" almost never come back."),
      },
    ],
    tugas: [
      {
        judul: _("Rapikan draf transkrip otomatis", "Clean up an automatic transcript draft"),
        brief: _(
          "Ini hasil transkrip otomatis wawancara kami. Tolong rapikan menjadi clean verbatim dengan label pembicara.\n\n\"jadi eee waktu itu saya saya mulai usaha tahun dua ribu delapan belas di bandung modalnya cuma lima juta terus eh terus temen saya si dimas yang bantu bikin logo\"",
          "Here's the automatic transcript of our interview. Please clean it up into clean verbatim with speaker labels.\n\n\"so umm back then i i started the business in twenty eighteen in bandung the capital was only five million then uh then my friend dimas helped design the logo\"",
        ),
        langkah: [
          _("Ubah menjadi clean verbatim: hapus pengisi dan pengulangan.", "Convert to clean verbatim: remove fillers and repetition."),
          _("Perbaiki huruf kapital, angka, dan tanda baca.", "Fix capitalisation, numbers, and punctuation."),
          _("Tambahkan label pembicara (anggap ini Narasumber).", "Add a speaker label (treat this as the Interviewee)."),
        ],
        rubrik: [
          _("Pengisi (eee, eh) dan pengulangan dihapus", "Fillers (umm, uh) and repetition removed"),
          _("Angka ditulis rapi (2018, Rp5 juta)", "Numbers written neatly (2018, Rp5 million)"),
          _("Nama orang dan kota diawali huruf kapital", "Names of people and cities capitalised"),
          _("Makna kalimat tidak berubah dan ada label pembicara", "Meaning unchanged, with a speaker label"),
        ],
        contoh: _(
          "Narasumber: Jadi, waktu itu saya mulai usaha tahun 2018 di Bandung. Modalnya hanya Rp5 juta. Lalu teman saya, Dimas, yang membantu membuat logo.",
          "Interviewee: So back then, I started the business in 2018 in Bandung. The capital was only Rp5 million. Then my friend Dimas helped design the logo.",
        ),
      },
      {
        judul: _("Buat panduan gaya untuk proyek transkripsi", "Write a style guide for a transcription project"),
        brief: _(
          "Kami akan mengirim 30 rekaman wawancara pelanggan untuk riset. Sebelum mulai, tolong tuliskan aturan transkrip yang akan kamu pakai supaya hasilnya konsisten dan bisa kami setujui.",
          "We'll send 30 customer interview recordings for research. Before you start, please write the transcription rules you'll follow so results are consistent and we can approve them.",
        ),
        langkah: [
          _("Tentukan jenis verbatim dan alasannya.", "Choose the verbatim type and why."),
          _("Tulis aturan untuk label pembicara, stempel waktu, bagian tidak terdengar, dan angka.", "Set rules for speaker labels, timestamps, inaudible parts, and numbers."),
          _("Tambahkan satu aturan soal kerahasiaan data.", "Add one rule about data confidentiality."),
        ],
        rubrik: [
          _("Jenis verbatim dipilih dengan alasan yang masuk akal", "Verbatim type chosen with a sensible reason"),
          _("Format label pembicara dan stempel waktu jelas", "Clear format for speaker labels and timestamps"),
          _("Ada aturan untuk bagian tidak terdengar", "Has a rule for inaudible sections"),
          _("Ada aturan kerahasiaan atau penghapusan file", "Has a confidentiality or file deletion rule"),
        ],
        contoh: _(
          "1. Jenis: clean verbatim, karena tujuannya analisis isi, bukan analisis cara bicara.\n2. Label pembicara: Pewawancara dan Responden 01 sampai 30.\n3. Stempel waktu: setiap pergantian pembicara, format [mm:ss].\n4. Tidak terdengar: [tidak terdengar mm:ss]. Kata yang ragu: [kata? mm:ss].\n5. Angka: angka di bawah sepuluh ditulis dengan huruf, sisanya angka. Mata uang ditulis Rp.\n6. Bahasa daerah atau asing ditulis apa adanya dalam huruf miring, dengan terjemahan di dalam kurung jika diminta.\n7. Kerahasiaan: file disimpan di folder terenkripsi dan dihapus 7 hari setelah transkrip disetujui.",
          "1. Type: clean verbatim, since the goal is content analysis, not speech analysis.\n2. Speaker labels: Interviewer and Respondent 01 to 30.\n3. Timestamps: at every speaker change, format [mm:ss].\n4. Inaudible: [inaudible mm:ss]. Uncertain words: [word? mm:ss].\n5. Numbers: one to nine in words, the rest as digits. Currency as Rp.\n6. Regional or foreign words kept as spoken in italics, with a translation in brackets if requested.\n7. Confidentiality: files kept in an encrypted folder and deleted 7 days after the transcript is approved.",
        ),
      },
    ],
  },

  "executive-assistant": {
    kuis: [
      {
        q: _("Atasanmu punya tiga rapat yang bentrok di jam yang sama. Apa langkah pertama yang paling tepat?", "Your executive has three meetings clashing at the same time. What's the best first step?"),
        o: [
          _("Batalkan dua rapat secara acak", "Cancel two at random"),
          _("Nilai prioritas tiap rapat berdasarkan tujuan atasan, lalu usulkan mana yang dipertahankan, diwakilkan, atau dijadwal ulang", "Rank each meeting against the executive's goals, then propose which to keep, delegate, or move"),
          _("Biarkan atasan memilih sendiri tanpa informasi tambahan", "Let the executive pick with no extra context"),
          _("Terima semuanya dan minta atasan berpindah-pindah", "Accept all and have the executive hop between them"),
        ],
        a: 1,
        e: _("Executive assistant yang baik datang membawa usulan, bukan hanya masalah. Atasan cukup menyetujui atau mengubah sedikit.", "A good EA brings a recommendation, not just a problem. The executive only needs to approve or tweak it."),
      },
      {
        q: _("Kamu diminta merangkum laporan 40 halaman untuk atasan yang hanya punya waktu 2 menit. Format terbaik?", "You're asked to summarise a 40-page report for an executive with 2 minutes. Best format?"),
        o: [
          _("Salin bab pendahuluan", "Copy the introduction chapter"),
          _("Tiga sampai lima poin utama, keputusan yang dibutuhkan, dan tenggatnya di bagian paling atas", "Three to five key points, the decision needed, and the deadline at the very top"),
          _("Ringkasan per bab sepanjang 10 halaman", "A 10-page summary by chapter"),
          _("Kirim laporannya saja dengan tanda stabilo", "Send the report with highlights"),
        ],
        a: 1,
        e: _("Letakkan yang paling penting di atas: apa intinya dan apa yang harus diputuskan. Detail bisa menyusul sebagai lampiran.", "Lead with what matters most: the point and the decision needed. Details can follow as an attachment."),
      },
      {
        q: _("Email dari \"CEO\" memintamu segera mentransfer Rp85 juta ke rekening baru vendor karena \"rahasia dan mendesak\". Apa yang harus dilakukan?", "An email from the \"CEO\" asks you to urgently transfer Rp85 million to a vendor's new account because it's \"confidential and urgent\". What do you do?"),
        o: [
          _("Transfer segera karena dari CEO", "Transfer right away since it's from the CEO"),
          _("Balas email itu untuk konfirmasi", "Reply to that email to confirm"),
          _("Verifikasi langsung ke CEO lewat saluran lain, misalnya telepon ke nomor yang sudah kamu kenal", "Verify directly with the CEO through another channel, such as calling a number you already know"),
          _("Transfer setengahnya dulu", "Transfer half first"),
        ],
        a: 2,
        e: _("Ini pola business email compromise. Membalas email yang sama bisa sampai ke penipu. Verifikasi selalu lewat saluran berbeda yang sudah terpercaya.", "This is business email compromise. Replying to the same email may reach the scammer. Always verify through a separate trusted channel."),
      },
      {
        q: _("Atasan sering lupa menyiapkan bahan rapat. Bentuk inisiatif yang paling membantu?", "Your executive often forgets to prep for meetings. Most helpful initiative?"),
        o: [
          _("Mengingatkan lewat chat lima menit sebelum rapat", "Remind them by chat five minutes before"),
          _("Mengirim briefing satu halaman sehari sebelumnya: tujuan rapat, peserta, poin keputusan, dan dokumen terkait", "Send a one-page brief the day before: purpose, attendees, decisions, and related documents"),
          _("Menyiapkan bahan dan menyimpannya tanpa memberi tahu", "Prepare materials and keep them without telling"),
          _("Meminta peserta lain yang menyiapkan", "Ask other attendees to prepare"),
        ],
        a: 1,
        e: _("Briefing sehari sebelumnya memberi waktu untuk membaca dan bertanya. Ini kebiasaan yang membedakan EA dari asisten biasa.", "A brief the day before leaves time to read and ask questions. It's a habit that sets an EA apart."),
      },
      {
        q: _("Atasan memintamu membalas email investor atas namanya. Mana yang paling aman?", "Your executive asks you to reply to an investor on their behalf. What's safest?"),
        o: [
          _("Kirim apa saja yang menurutmu benar", "Send whatever you think is right"),
          _("Siapkan draf, minta persetujuan untuk email penting, dan sepakati jenis email yang boleh kamu kirim langsung", "Prepare drafts, get approval for important ones, and agree on which emails you may send directly"),
          _("Jangan pernah membalas email investor", "Never reply to investor emails"),
          _("Teruskan ke tim lain", "Forward it to another team"),
        ],
        a: 1,
        e: _("Batas wewenang yang jelas mencegah salah komunikasi. Seiring waktu, daftar email yang boleh kamu kirim langsung bisa bertambah.", "Clear authority limits prevent miscommunication. Over time, the list of emails you can send directly can grow."),
      },
    ],
    tugas: [
      {
        judul: _("Siapkan briefing perjalanan dinas", "Prepare a business trip brief"),
        brief: _(
          "Saya ke Singapura Kamis sampai Jumat minggu depan. Ada rapat dengan calon mitra Kamis jam 14.00 dan makan malam dengan tim lokal Jumat jam 19.00. Tolong siapkan briefing perjalanan yang bisa saya baca di bandara.",
          "I'm going to Singapore next Thursday to Friday. There's a meeting with a prospective partner Thursday at 2 pm and dinner with the local team Friday at 7 pm. Please prepare a trip brief I can read at the airport.",
        ),
        langkah: [
          _("Susun itinerary berurutan per hari, termasuk perbedaan waktu (Singapura satu jam lebih cepat dari WIB).", "Lay out a day-by-day itinerary, including the time difference (Singapore is one hour ahead of WIB)."),
          _("Tambahkan informasi penting untuk tiap agenda.", "Add key information for each item."),
          _("Tandai hal yang masih perlu konfirmasi dengan [ ].", "Mark anything still to confirm with [ ]."),
        ],
        rubrik: [
          _("Itinerary berurutan dan mencantumkan zona waktu", "Itinerary is in order and states the time zone"),
          _("Tiap rapat punya tujuan, peserta, atau lokasi", "Each meeting has a purpose, attendees, or location"),
          _("Ada informasi praktis (hotel, transportasi, kontak darurat)", "Includes practical info (hotel, transport, emergency contact)"),
          _("Hal yang belum pasti ditandai jelas", "Unconfirmed items are clearly marked"),
          _("Ringkas, bisa dibaca dalam 2 menit", "Concise, readable in 2 minutes"),
        ],
        contoh: _(
          "BRIEFING SINGAPURA (waktu Singapura, WIB +1 jam)\n\nKamis\n• 09.40 penerbangan CGK ke SIN [nomor penerbangan], tiba 12.25\n• 13.15 taksi ke kantor calon mitra, sekitar 25 menit\n• 14.00 rapat calon mitra, [nama dan jabatan]\n  Tujuan: sepakati ruang lingkup uji coba 3 bulan\n  Bahan: deck kemitraan (terlampir), proposal harga v2\n• Hotel: [nama hotel], check-in setelah rapat\n\nJumat\n• Pagi kosong untuk kerja jarak jauh\n• 19.00 makan malam tim lokal, [restoran], reservasi untuk 6 orang [ ]\n\nKontak darurat: [nama], [nomor]\nPerlu konfirmasi: nomor penerbangan pulang [ ], reservasi restoran [ ]",
          "SINGAPORE BRIEF (Singapore time, WIB +1 hour)\n\nThursday\n• 9:40 flight CGK to SIN [flight no.], arrives 12:25\n• 1:15 pm taxi to the partner's office, about 25 minutes\n• 2:00 pm partner meeting, [name and title]\n  Goal: agree on the scope of a 3-month pilot\n  Materials: partnership deck (attached), pricing proposal v2\n• Hotel: [hotel name], check in after the meeting\n\nFriday\n• Morning free for remote work\n• 7:00 pm dinner with the local team, [restaurant], booking for 6 [ ]\n\nEmergency contact: [name], [number]\nTo confirm: return flight number [ ], restaurant booking [ ]",
        ),
      },
      {
        judul: _("Tolak undangan rapat dengan sopan", "Decline a meeting invitation politely"),
        brief: _(
          "Seorang vendor software terus meminta rapat demo produk. Saya tidak tertarik sekarang, tapi mungkin perlu tahun depan. Tolong balas atas nama saya.",
          "A software vendor keeps asking for a product demo. I'm not interested now, but might need it next year. Please reply on my behalf.",
        ),
        langkah: [
          _("Tulis email penolakan yang sopan dan tegas.", "Write a polite, firm decline."),
          _("Buka peluang kontak di masa depan tanpa memberi janji.", "Leave the door open without making promises."),
          _("Usulkan cara agar vendor tidak terus mengirim undangan.", "Suggest a way to stop repeated invitations."),
        ],
        rubrik: [
          _("Penolakannya jelas, tidak menggantung", "The decline is clear, not vague"),
          _("Nada tetap ramah dan profesional", "Tone stays friendly and professional"),
          _("Menyebut waktu yang tepat untuk menghubungi lagi", "States a suitable time to reconnect"),
          _("Singkat, tidak lebih dari lima kalimat", "Short, no more than five sentences"),
        ],
        contoh: _(
          "Halo Pak Andi,\n\nTerima kasih atas tawaran demonya. Saat ini kami belum berencana menambah software baru, jadi kami belum bisa menjadwalkan rapat.\n\nKami akan meninjau kebutuhan ini lagi pada kuartal pertama tahun depan. Jika Bapak berkenan, silakan kirimkan brosur produknya lewat email, dan kami yang akan menghubungi bila waktunya tepat.\n\nSalam,\n[Nama], atas nama [Nama atasan]",
          "Hi Andi,\n\nThanks for the demo offer. We're not planning to add new software right now, so we can't schedule a meeting.\n\nWe'll review this need again in the first quarter of next year. If you'd like, send the product brochure by email and we'll reach out when the timing is right.\n\nBest,\n[Name], on behalf of [Executive's name]",
        ),
      },
    ],
  },
};
