import { t as _ } from "../../../i18n.js";

/**
 * Detail kerja nyata, kategori Administrasi & Dukungan.
 * tugas[i] melengkapi tugas di ../admin.js (urutan sama).
 * simulasi.langkah[].pilihan[].skor: 2 tepat, 1 kurang tepat, 0 berisiko.
 */
export default {
  "virtual-assistant": {
    tugas: [
      {
        dari: { nama: "Sarah Lim", peran: _("Pemilik agensi desain, Singapura", "Design agency owner, Singapore") },
        kanal: "Slack",
        tenggat: _("Hari ini, 15.00 WIB", "Today, 3 pm WIB"),
        revisi: {
          pesan: _("Thanks! Satu perubahan: tim desain baru bisa hari Senin setelah jam 13.00 WIB, dan investor minta call dipindah ke Rabu, jam yang sama. Bisa disesuaikan dan kirim ulang ringkasannya?", "Thanks! One change: the design team can only do Monday after 1 pm WIB, and the investor wants the call moved to Wednesday, same time. Can you adjust and resend the summary?"),
          petunjuk: [
            _("Pindahkan rapat desain ke Senin siang tanpa bentrok dengan blok fokus pagi", "Move the design meeting to Monday afternoon without hitting the morning focus block"),
            _("Pindahkan call investor ke Rabu 15.00 sampai 15.30 WIB", "Move the investor call to Wednesday 3:00 to 3:30 pm WIB"),
            _("Kirim ringkasan baru yang singkat, tandai bagian yang berubah", "Send a short new summary that flags what changed"),
          ],
        },
      },
      {
        dari: { nama: "Pak Hendra", peran: _("Pemilik usaha distribusi", "Distribution business owner") },
        kanal: "WhatsApp",
        tenggat: _("Hari ini, 12.00", "Today, 12 pm"),
        revisi: {
          pesan: _("Sudah saya cek, ternyata transfernya memang belum masuk karena saya salah pilih rekening. Tolong ubah emailnya jadi permintaan maaf dan sampaikan pembayaran dilakukan hari ini.", "I checked, and the transfer actually didn't go through because I picked the wrong account. Please change the email into an apology and say payment is being made today."),
          petunjuk: [
            _("Akui kesalahan dengan singkat tanpa berlebihan", "Acknowledge the mistake briefly without overdoing it"),
            _("Sebutkan kepastian waktu pembayaran", "State a firm payment time"),
            _("Tawarkan untuk mengirim bukti transfer setelah dibayar", "Offer to send the receipt once paid"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Senin pagi sebagai VA untuk pemilik toko online", "Monday morning as a VA for an online shop owner"),
      konteks: _("Kamu VA paruh waktu untuk Bu Maya, pemilik toko online perlengkapan bayi. Jam kerjamu 08.00 sampai 12.00 WIB. Bu Maya sedang di perjalanan dan sulit dihubungi sampai siang.", "You're a part-time VA for Bu Maya, who runs an online baby goods shop. You work 8 am to 12 pm WIB. Bu Maya is travelling and hard to reach until noon."),
      langkah: [
        {
          waktu: "08.05",
          dari: { nama: "Bu Maya", peran: _("Klien", "Client") },
          kanal: "WhatsApp",
          pesan: _("Pagi! Tolong hari ini balas semua chat pembeli di marketplace, rekap pesanan minggu lalu, dan carikan supplier botol susu yang lebih murah. Aku di pesawat sampai jam 11.", "Morning! Today please answer all buyer chats on the marketplace, recap last week's orders, and find a cheaper baby bottle supplier. I'm on a plane until 11."),
          pilihan: [
            { teks: _("\"Siap, Bu. Saya mulai dari chat pembeli karena itu memengaruhi penjualan hari ini, lalu rekap pesanan, lalu riset supplier. Jam 11 saya kirim ringkasannya.\"", "\"Sure. I'll start with buyer chats since they affect today's sales, then the recap, then supplier research. I'll send a summary at 11.\""), skor: 2, umpan: _("Kamu mengonfirmasi, menyusun prioritas berdasarkan dampak, dan menjanjikan laporan di waktu yang tepat.", "You confirmed, prioritised by impact, and promised a report at the right time.") },
            { teks: _("\"Oke, Bu.\"", "\"OK.\""), skor: 1, umpan: _("Tidak salah, tetapi klien tidak tahu urutan kerjamu dan kapan akan mendapat kabar.", "Not wrong, but the client doesn't know your plan or when to expect an update.") },
            { teks: _("\"Bu, yang mana dulu ya? Saya tunggu jawaban Ibu.\"", "\"Which one first? I'll wait for your answer.\""), skor: 0, umpan: _("Klien sedang di pesawat. Menunggu jawaban berarti pagimu terbuang. Ambil keputusan yang masuk akal dan jelaskan alasannya.", "The client is on a plane. Waiting wastes your morning. Make a sensible call and explain why.") },
          ],
        },
        {
          waktu: "09.20",
          dari: { nama: _("Pembeli: Rina", "Buyer: Rina"), peran: "Marketplace" },
          kanal: "WhatsApp",
          pesan: _("Kak, botol yang saya terima bocor. Saya mau refund sekarang juga, kalau tidak saya kasih bintang 1!", "The bottle I received leaks. I want a refund right now or I'm leaving a 1-star review!"),
          pilihan: [
            { teks: _("\"Langsung saya refund penuh, Kak.\"", "\"I'll issue a full refund right away.\""), skor: 0, umpan: _("Kamu belum tahu kebijakan refund dan belum punya wewenang. Keputusan uang sebaiknya sesuai aturan yang disepakati dengan klien.", "You don't know the refund policy or have the authority. Money decisions should follow rules agreed with the client.") },
            { teks: _("\"Mohon maaf, Kak. Boleh kirim foto atau video botolnya? Saya proses sesuai kebijakan toko dan kabari maksimal jam 12 hari ini.\"", "\"So sorry. Could you send a photo or video of the bottle? I'll process it per store policy and update you by noon today.\""), skor: 2, umpan: _("Empati, minta bukti, dan memberi waktu yang jelas tanpa menjanjikan hal di luar wewenangmu.", "Empathy, evidence, and a clear time without promising beyond your authority.") },
            { teks: _("\"Pemilik toko sedang di pesawat, tunggu saja ya.\"", "\"The owner is on a plane, please just wait.\""), skor: 1, umpan: _("Jujur, tetapi terdengar tidak peduli dan tidak ada langkah konkret. Pembeli bisa makin marah.", "Honest, but it sounds uncaring with no concrete step. The buyer may get angrier.") },
          ],
        },
        {
          waktu: "10.40",
          dari: { nama: "Supplier Botol Jaya", peran: _("Calon supplier", "Prospective supplier") },
          kanal: "WhatsApp",
          pesan: _("Harga kami 20% lebih murah dari supplier Ibu sekarang. Promo hanya hari ini, minimal order 500 pcs, transfer DP 50% sekarang ya.", "Our price is 20% cheaper than your current supplier. Today-only deal, minimum 500 pcs, transfer a 50% deposit now."),
          pilihan: [
            { teks: _("Transfer DP dari rekening toko supaya promo tidak hilang", "Transfer the deposit from the shop account so the deal isn't lost"), skor: 0, umpan: _("Kamu tidak berwenang membelanjakan uang klien, dan desakan \"hanya hari ini\" adalah tanda bahaya.", "You're not authorised to spend the client's money, and \"today only\" pressure is a red flag.") },
            { teks: _("Minta katalog, sampel, dan legalitas usaha, lalu masukkan ke tabel perbandingan untuk Bu Maya", "Ask for a catalogue, samples, and business details, then add them to a comparison table for Bu Maya"), skor: 2, umpan: _("Kamu mengumpulkan informasi untuk keputusan klien tanpa mengambil risiko.", "You gathered information for the client's decision without taking risks.") },
            { teks: _("Abaikan pesannya", "Ignore the message"), skor: 1, umpan: _("Aman, tetapi kamu sedang ditugasi mencari supplier. Informasinya mungkin berguna jika diverifikasi.", "Safe, but you were asked to find suppliers. The info might be useful once verified.") },
          ],
        },
        {
          waktu: "11.05",
          dari: { nama: "Bu Maya", peran: _("Klien", "Client") },
          kanal: "WhatsApp",
          pesan: _("Sudah mendarat. Gimana pagi ini?", "Just landed. How was the morning?"),
          pilihan: [
            { teks: _("\"Lancar, Bu, nanti saya ceritakan.\"", "\"All good, I'll tell you later.\""), skor: 1, umpan: _("Klien baru mendarat dan ingin gambaran cepat. Laporan yang ditunda membuatnya harus bertanya lagi.", "The client wants a quick picture. Delaying makes them ask again.") },
            { teks: _("Kirim ringkasan 4 poin: 18 chat dibalas, 1 komplain botol bocor menunggu keputusan refund, rekap pesanan terlampir, 3 calon supplier di tabel (1 minta DP mendadak, perlu hati-hati)", "Send a 4-point summary: 18 chats answered, 1 leaking bottle complaint awaiting a refund decision, order recap attached, 3 prospective suppliers in a table (1 pushing an urgent deposit, be careful)"), skor: 2, umpan: _("Ringkas, lengkap, dan menonjolkan dua hal yang butuh keputusan klien.", "Concise, complete, and highlights the two items needing the client's decision.") },
            { teks: _("Kirim semua tangkapan layar chat pagi ini", "Send screenshots of every chat this morning"), skor: 0, umpan: _("Klien harus membaca semuanya sendiri. Tugas VA adalah merangkum.", "The client would have to read everything. A VA's job is to summarise.") },
          ],
        },
      ],
    },
  },

  "customer-support": {
    tugas: [
      {
        dari: { nama: "Dewi", peran: _("Team lead CS", "CS team lead") },
        kanal: "Slack",
        tenggat: _("Balas pelanggan dalam 15 menit", "Reply to the customer within 15 minutes"),
        revisi: {
          pesan: _("Bagus! Update: pelanggan baru membalas bahwa ia tidak punya video unboxing, hanya foto. Kebijakan kita memperbolehkan foto jika ada nomor resi di kardusnya. Tolong balas lagi.", "Nice! Update: the customer says they have no unboxing video, only photos. Policy allows photos if the waybill number is visible on the box. Please reply again."),
          petunjuk: [
            _("Jelaskan pengecualian dengan foto dan resi tanpa membuat pelanggan merasa disalahkan", "Explain the photo-with-waybill exception without blaming the customer"),
            _("Sebutkan foto apa saja yang dibutuhkan", "Specify which photos are needed"),
            _("Tetap beri pilihan penggantian atau refund", "Keep the replacement or refund choice"),
          ],
        },
      },
      {
        dari: { nama: "Dewi", peran: _("Team lead CS", "CS team lead") },
        kanal: "Slack",
        tenggat: _("Besok pagi, untuk dibahas di stand-up", "Tomorrow morning, for stand-up"),
        revisi: {
          pesan: _("Templatenya oke, tapi tim keuangan bilang sejak bulan ini refund ke bank jadi 5 sampai 10 hari kerja karena ganti bank mitra. Tolong perbarui, dan tambahkan kalimat maaf atas waktu yang lebih lama.", "Template's good, but finance says bank refunds now take 5 to 10 working days because of a new partner bank. Please update it and add an apology for the longer wait."),
          petunjuk: [
            _("Ubah waktu refund bank menjadi 5 sampai 10 hari kerja", "Change bank refund time to 5 to 10 working days"),
            _("Tambahkan permintaan maaf singkat dan alasan yang jujur", "Add a short apology with an honest reason"),
            _("Jangan ubah bagian e-wallet yang masih benar", "Don't change the e-wallet part, which is still correct"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Shift siang di tim CS aplikasi ojek online", "Afternoon shift at a ride-hailing app's support team"),
      konteks: _("Kamu agen CS tier 1. Antrean sedang ramai karena aplikasi sempat error 30 menit. Target balasan pertama di bawah 5 menit.", "You're a tier 1 support agent. The queue is busy after a 30-minute app outage. First-reply target is under 5 minutes."),
      langkah: [
        {
          waktu: "13.02",
          dari: { nama: _("Pelanggan: Andi", "Customer: Andi"), peran: _("Chat dalam aplikasi", "In-app chat") },
          kanal: "Chat",
          pesan: _("Saldo saya terpotong Rp45.000 tapi pesanan gagal karena aplikasi error! Balikin sekarang!", "My balance was charged Rp45,000 but the order failed because the app crashed! Give it back now!"),
          pilihan: [
            { teks: _("\"Mohon maaf atas gangguannya, Kak Andi. Tadi memang ada gangguan sistem. Saldo yang terpotong untuk pesanan gagal akan kembali otomatis maksimal 1x24 jam. Boleh saya cek ID pesanannya?\"", "\"Sorry for the trouble, Andi. There was a system issue earlier. Balances charged for failed orders return automatically within 24 hours. Could I check your order ID?\""), skor: 2, umpan: _("Kamu mengakui masalah, memberi informasi yang menenangkan, dan meminta data untuk memastikan.", "You acknowledged the issue, gave reassuring information, and asked for data to confirm.") },
            { teks: _("\"Silakan tunggu 1x24 jam.\"", "\"Please wait 24 hours.\""), skor: 1, umpan: _("Informasinya benar, tetapi tanpa empati dan tanpa pengecekan. Pelanggan bisa merasa diabaikan.", "Correct info, but no empathy or checking. The customer may feel brushed off.") },
            { teks: _("\"Itu bukan kesalahan kami, mungkin sinyal Kakak yang buruk.\"", "\"That's not our fault, maybe your signal was bad.\""), skor: 0, umpan: _("Menyalahkan pelanggan padahal ada gangguan sistem. Ini memicu keluhan yang lebih besar.", "Blaming the customer during a known outage. This escalates the complaint.") },
          ],
        },
        {
          waktu: "13.15",
          dari: { nama: _("Pelanggan: Sinta", "Customer: Sinta") },
          kanal: "Email",
          pesan: _("Halo, saya pemilik akun ini tapi ganti nomor HP. Tolong ganti nomor di akun saya ke 0812xxxx. Email saya juga sudah tidak aktif.", "Hi, I own this account but changed my phone number. Please change it to 0812xxxx. My email is no longer active either."),
          pilihan: [
            { teks: _("Langsung ganti nomornya karena ia sopan", "Change the number since she's polite"), skor: 0, umpan: _("Tanpa verifikasi, ini bisa jadi pengambilalihan akun. Kesopanan bukan bukti kepemilikan.", "Without verification this could be an account takeover. Politeness isn't proof of ownership.") },
            { teks: _("Arahkan ke prosedur verifikasi identitas resmi untuk pemulihan akun", "Direct her to the official identity verification process for account recovery"), skor: 2, umpan: _("Tepat. Perubahan data login selalu lewat verifikasi resmi.", "Right. Login detail changes always go through official verification.") },
            { teks: _("Minta ia mengirim foto KTP lewat email", "Ask her to email a photo of her ID"), skor: 1, umpan: _("Niatnya verifikasi, tetapi meminta KTP lewat email di luar prosedur berisiko bagi data pribadi.", "Meant as verification, but collecting IDs by email outside the process risks personal data.") },
          ],
        },
        {
          waktu: "13.40",
          dari: { nama: "Dewi", peran: _("Team lead CS", "CS team lead") },
          kanal: "Slack",
          pesan: _("Antrean 120 chat. Banyak pertanyaan sama soal saldo terpotong. Ada ide supaya lebih cepat?", "Queue is at 120 chats. Lots of the same question about charged balances. Any ideas to speed up?"),
          pilihan: [
            { teks: _("\"Saya usulkan saved reply khusus gangguan hari ini, dan banner info di aplikasi. Saya bisa buat draf saved reply-nya dalam 10 menit.\"", "\"I suggest a saved reply specific to today's outage, plus an in-app info banner. I can draft the saved reply in 10 minutes.\""), skor: 2, umpan: _("Solusi yang mengurangi beban seluruh tim, ditambah inisiatif untuk mengerjakannya.", "A fix that lightens the whole team's load, plus initiative to do it.") },
            { teks: _("\"Saya akan mengetik lebih cepat.\"", "\"I'll type faster.\""), skor: 1, umpan: _("Semangatnya baik, tetapi tidak menyelesaikan masalah antrean secara tim.", "Good spirit, but doesn't solve the team-wide queue.") },
            { teks: _("\"Tutup saja chat yang sudah lama menunggu.\"", "\"Just close chats that have waited long.\""), skor: 0, umpan: _("Menutup chat tanpa jawaban merusak kepuasan pelanggan dan metrik tim.", "Closing unanswered chats hurts satisfaction and team metrics.") },
          ],
        },
        {
          waktu: "16.55",
          dari: { nama: "Dewi", peran: _("Team lead CS", "CS team lead") },
          kanal: "Slack",
          pesan: _("Shift kamu selesai 5 menit lagi. Masih ada 3 tiket yang kamu janjikan kabar besok.", "Your shift ends in 5 minutes. You still have 3 tickets where you promised an update tomorrow."),
          pilihan: [
            { teks: _("Pulang saja, besok dilanjut", "Log off and continue tomorrow"), skor: 1, umpan: _("Jika besok kamu libur atau terlambat, pelanggan tidak mendapat kabar. Tiket perlu catatan serah terima.", "If you're off or late tomorrow, customers get no update. Tickets need a handover note.") },
            { teks: _("Tulis catatan serah terima: nomor tiket, janji ke pelanggan, dan status terakhir", "Write a handover: ticket numbers, promises made, and latest status"), skor: 2, umpan: _("Kerja tim CS bergantung pada serah terima yang jelas antar-shift.", "Support teamwork relies on clear handovers between shifts.") },
            { teks: _("Tutup ketiga tiket supaya statistik bersih", "Close all three to keep stats clean"), skor: 0, umpan: _("Menutup tiket yang belum selesai menyembunyikan masalah dan merugikan pelanggan.", "Closing unresolved tickets hides problems and hurts customers.") },
          ],
        },
      ],
    },
  },

  transkripsi: {
    tugas: [
      {
        dari: { nama: "Laras", peran: _("Peneliti, tim riset UX", "UX researcher") },
        kanal: "Email",
        tenggat: _("Besok, 10.00", "Tomorrow, 10 am"),
        revisi: {
          pesan: _("Terima kasih! Untuk proyek ini ternyata kami perlu stempel waktu setiap pergantian pembicara, format [mm:ss], dan nama narasumber diganti kode R01 demi anonimitas. Tolong sesuaikan.", "Thanks! For this project we actually need timestamps at every speaker change, format [mm:ss], and the interviewee's name replaced with code R01 for anonymity. Please adjust."),
          petunjuk: [
            _("Tambahkan stempel waktu di awal giliran bicara", "Add timestamps at the start of each turn"),
            _("Ganti label dan nama orang yang disebut dengan kode anonim", "Replace labels and named people with anonymous codes"),
            _("Pastikan tidak ada nama asli yang tersisa", "Make sure no real names remain"),
          ],
        },
      },
      {
        dari: { nama: "Laras", peran: _("Peneliti, tim riset UX", "UX researcher") },
        kanal: "Email",
        tenggat: _("Lusa", "In two days"),
        revisi: {
          pesan: _("Panduannya jelas. Satu masukan dari tim: beberapa responden memakai bahasa Jawa. Kami butuh teks aslinya tetap ada, plus terjemahan Indonesia. Bisa ditambahkan aturannya?", "Clear guide. One note from the team: some respondents speak Javanese. We need the original kept, plus an Indonesian translation. Can you add a rule?"),
          petunjuk: [
            _("Tambahkan aturan penulisan bahasa daerah dan terjemahannya", "Add a rule for regional language and its translation"),
            _("Beri contoh format yang konsisten", "Give a consistent format example"),
            _("Sebutkan jika ada tambahan waktu atau biaya karena pekerjaan bertambah", "Mention any extra time or cost since the work increases"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Hari sibuk transkriptor freelance", "A busy day for a freelance transcriber"),
      konteks: _("Kamu punya 2 proyek: wawancara riset 60 menit (tenggat besok) dan podcast 30 menit (tenggat lusa).", "You have 2 projects: a 60-minute research interview (due tomorrow) and a 30-minute podcast (due in two days)."),
      langkah: [
        {
          waktu: "08.30",
          dari: { nama: "Laras", peran: _("Klien riset", "Research client") },
          kanal: "Email",
          pesan: _("Audio sudah saya kirim. Maaf, rekamannya agak berisik karena di kafe.", "Audio sent. Sorry, it's a bit noisy because it was recorded in a café."),
          pilihan: [
            { teks: _("Dengarkan 5 menit pertama dulu, lalu kabari klien perkiraan kualitas dan apakah tenggat masih realistis", "Listen to the first 5 minutes, then tell the client the expected quality and whether the deadline holds"), skor: 2, umpan: _("Mengecek dulu sebelum berjanji membuat ekspektasi klien realistis.", "Checking before promising keeps the client's expectations realistic.") },
            { teks: _("Balas \"Siap\" dan kerjakan malam nanti", "Reply \"OK\" and do it tonight"), skor: 1, umpan: _("Jika ternyata audionya sangat buruk, kamu baru tahu menjelang tenggat.", "If the audio is very poor, you'll only find out near the deadline.") },
            { teks: _("Tolak karena audionya berisik", "Decline because it's noisy"), skor: 0, umpan: _("Kamu belum mendengar audionya. Banyak rekaman kafe masih bisa ditranskripsi dengan baik.", "You haven't heard it yet. Many café recordings are still workable.") },
          ],
        },
        {
          waktu: "11.00",
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Di menit 23:10 ada nama obat yang tidak jelas terdengar. Konteksnya wawancara tentang kesehatan.", "At 23:10 a drug name is unclear. The interview is about health."),
          pilihan: [
            { teks: _("Tulis nama obat yang paling mirip bunyinya", "Write the closest-sounding drug name"), skor: 0, umpan: _("Menebak nama obat bisa mengubah makna dan berbahaya untuk riset kesehatan.", "Guessing a drug name can change meaning and is risky in health research.") },
            { teks: _("Tandai [tidak jelas 23:10] dan sebutkan dugaan di catatan untuk klien", "Tag [unclear 23:10] and note your best guess for the client"), skor: 2, umpan: _("Transparan dan membantu klien memverifikasi sendiri.", "Transparent and helps the client verify.") },
            { teks: _("Lewati bagian itu", "Skip that part"), skor: 1, umpan: _("Lebih aman dari menebak, tetapi bagian yang hilang tanpa tanda membingungkan pembaca.", "Safer than guessing, but untagged gaps confuse readers.") },
          ],
        },
        {
          waktu: "15.00",
          dari: { nama: "Podcast Kopi Pagi", peran: _("Klien podcast", "Podcast client") },
          kanal: "WhatsApp",
          pesan: _("Bisa dipercepat jadi besok pagi? Kami mau upload lebih cepat. Nanti dibayar sama.", "Can you speed it up to tomorrow morning? We want to publish sooner. Same pay."),
          pilihan: [
            { teks: _("Terima tanpa melihat jadwal", "Accept without checking your schedule"), skor: 0, umpan: _("Dua tenggat bertabrakan. Kualitas salah satu proyek bisa turun.", "Two deadlines collide. One project's quality may suffer.") },
            { teks: _("\"Tenggat proyek lain saya besok pagi. Saya bisa kirim besok jam 16.00, atau besok pagi dengan biaya ekspres.\"", "\"I have another deadline tomorrow morning. I can deliver tomorrow at 4 pm, or tomorrow morning with a rush fee.\""), skor: 2, umpan: _("Jujur soal kapasitas dan memberi pilihan. Ini praktik umum untuk pekerjaan kilat.", "Honest about capacity with options. Standard practice for rush work.") },
            { teks: _("\"Tidak bisa.\"", "\"Can't.\""), skor: 1, umpan: _("Jujur, tetapi tanpa alternatif kamu bisa kehilangan klien.", "Honest, but with no alternative you may lose the client.") },
          ],
        },
        {
          waktu: "21.00",
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Transkrip riset selesai. Waktu tinggal sedikit sebelum tidur.", "The research transcript is done. Little time left before bed."),
          pilihan: [
            { teks: _("Langsung kirim", "Send it straight away"), skor: 1, umpan: _("Tanpa membaca ulang, salah ketik dan kalimat janggal mudah lolos.", "Without a final read, typos and odd sentences slip through.") },
            { teks: _("Baca ulang cepat tanpa audio, cek format dan bagian yang ditandai, lalu kirim dengan catatan singkat", "Do a quick read without audio, check format and tags, then send with a short note"), skor: 2, umpan: _("Satu putaran baca ulang menaikkan akurasi secara nyata.", "One final read noticeably lifts accuracy.") },
            { teks: _("Kirim draf AI saja karena sudah lelah", "Send the AI draft since you're tired"), skor: 0, umpan: _("Draf AI tanpa koreksi menurunkan kepercayaan klien dan skor kualitasmu.", "Uncorrected AI drafts damage trust and your quality score.") },
          ],
        },
      ],
    },
  },

  "executive-assistant": {
    tugas: [
      {
        dari: { nama: "Pak Arief", peran: _("Direktur utama", "Managing director") },
        kanal: "Email",
        tenggat: _("Rabu, sebelum jam 17.00", "Wednesday, before 5 pm"),
        revisi: {
          pesan: _("Bagus. Perubahan: rapat calon mitra maju ke Kamis jam 11.00 karena mereka ada acara siang, dan saya perlu waktu 1 jam setelah rapat untuk menelepon kantor. Tolong sesuaikan itinerary.", "Good. Change: the partner meeting moves to Thursday 11 am because they have an afternoon event, and I need 1 hour after it to call the office. Please adjust the itinerary."),
          petunjuk: [
            _("Cek apakah penerbangan masih memungkinkan tiba tepat waktu, jika tidak usulkan penerbangan lebih pagi", "Check whether the flight still arrives in time; if not, propose an earlier one"),
            _("Tambahkan blok 1 jam setelah rapat", "Add a 1-hour block after the meeting"),
            _("Tandai hal yang harus dikonfirmasi ulang", "Flag what must be reconfirmed"),
          ],
        },
      },
      {
        dari: { nama: "Pak Arief", peran: _("Direktur utama", "Managing director") },
        kanal: "Email",
        tenggat: _("Hari ini", "Today"),
        revisi: {
          pesan: _("Sebelum dikirim: vendor ini ternyata teman lama Pak Komisaris. Tolong nadanya lebih hangat, dan tawarkan ngopi santai bulan depan, bukan rapat demo.", "Before sending: this vendor turns out to be an old friend of our commissioner. Please make it warmer and offer a casual coffee next month instead of a demo."),
          petunjuk: [
            _("Ubah nada menjadi lebih hangat tanpa membuka janji pembelian", "Make the tone warmer without implying a purchase"),
            _("Ganti ajakan demo dengan pertemuan santai", "Swap the demo for a casual meet-up"),
            _("Tetap singkat dan jelas", "Keep it short and clear"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Satu hari mendukung direktur yang sibuk", "A day supporting a busy director"),
      konteks: _("Kamu executive assistant Pak Arief. Hari ini ia ada rapat dewan jam 10.00 dan jadwal penuh sampai sore.", "You're Pak Arief's EA. Today he has a board meeting at 10 am and a packed schedule until evening."),
      langkah: [
        {
          waktu: "07.45",
          dari: { nama: _("Sekretaris dewan", "Board secretary") },
          kanal: "Email",
          pesan: _("Bahan rapat dewan direvisi tadi malam. Mohon pastikan Pak Arief membaca halaman 4 sampai 6 sebelum rapat.", "The board pack was revised last night. Please make sure Pak Arief reads pages 4 to 6 before the meeting."),
          pilihan: [
            { teks: _("Teruskan email itu ke Pak Arief", "Forward the email to Pak Arief"), skor: 1, umpan: _("Informasinya sampai, tetapi atasan harus mencari sendiri apa yang berubah.", "The info arrives, but he has to find the changes himself.") },
            { teks: _("Kirim ringkasan perubahan di halaman 4 sampai 6 dalam 3 poin, dengan file terlampir", "Send a 3-point summary of changes on pages 4 to 6, with the file attached"), skor: 2, umpan: _("Kamu menghemat waktunya dan memastikan ia siap.", "You saved his time and made sure he's prepared.") },
            { teks: _("Tunggu sampai ia bertanya", "Wait until he asks"), skor: 0, umpan: _("Rapat jam 10. Menunggu berarti ia bisa masuk rapat tanpa persiapan.", "The meeting is at 10. Waiting risks him walking in unprepared.") },
          ],
        },
        {
          waktu: "09.10",
          dari: { nama: "Bu Lina", peran: _("Kepala divisi penjualan", "Head of sales") },
          kanal: "WhatsApp",
          pesan: _("Saya butuh 30 menit dengan Pak Arief hari ini, penting soal klien besar.", "I need 30 minutes with Pak Arief today, it's important, about a big client."),
          pilihan: [
            { teks: _("\"Jadwal beliau penuh, coba minggu depan.\"", "\"His schedule is full, try next week.\""), skor: 0, umpan: _("Kamu menolak tanpa menggali urgensinya. Bisa jadi ini prioritas bisnis.", "You declined without checking urgency. It may be a business priority.") },
            { teks: _("\"Boleh saya tahu inti masalahnya dan keputusan apa yang dibutuhkan? Saya cek dengan beliau, ada slot 15 menit jam 13.15.\"", "\"Could you share the core issue and what decision is needed? I'll check with him; there's a 15-minute slot at 1:15.\""), skor: 2, umpan: _("Kamu menyaring, menyiapkan konteks untuk atasan, dan menawarkan solusi realistis.", "You screened, prepared context for him, and offered a realistic option.") },
            { teks: _("Langsung masukkan 30 menit dengan menggeser rapat lain", "Book 30 minutes by bumping another meeting"), skor: 1, umpan: _("Responsif, tetapi menggeser rapat lain tanpa konfirmasi bisa menimbulkan masalah baru.", "Responsive, but bumping meetings without approval can create new problems.") },
          ],
        },
        {
          waktu: "12.30",
          dari: { nama: _("\"Pak Arief\" (email dari alamat mirip)", "\"Pak Arief\" (email from a similar address)") },
          kanal: "Email",
          pesan: _("Saya sedang rapat, tidak bisa ditelepon. Tolong segera transfer Rp120 juta ke rekening vendor baru ini, rahasia ya.", "I'm in a meeting, can't take calls. Please urgently transfer Rp120 million to this new vendor account, keep it confidential."),
          pilihan: [
            { teks: _("Transfer karena perintah direktur", "Transfer since the director asked"), skor: 0, umpan: _("Ciri khas penipuan email bisnis: mendesak, rahasia, rekening baru, dan tidak bisa dihubungi.", "Classic business email compromise: urgent, secret, new account, unreachable.") },
            { teks: _("Jangan transfer, verifikasi langsung ke Pak Arief lewat pesan di nomor yang kamu kenal, dan laporkan ke tim IT", "Don't transfer; verify with Pak Arief via his known number and report to IT"), skor: 2, umpan: _("Tepat. Verifikasi lewat saluran berbeda dan laporkan percobaan penipuan.", "Right. Verify via another channel and report the attempt.") },
            { teks: _("Balas email itu untuk minta konfirmasi", "Reply to the email asking for confirmation"), skor: 1, umpan: _("Balasan bisa sampai ke penipu yang tentu akan \"mengonfirmasi\".", "Your reply may reach the scammer, who will of course \"confirm\".") },
          ],
        },
        {
          waktu: "17.30",
          dari: { nama: "Pak Arief", peran: _("Direktur utama", "Managing director") },
          kanal: "WhatsApp",
          pesan: _("Hari ini padat sekali. Besok apa saja?", "Packed day. What's on tomorrow?"),
          pilihan: [
            { teks: _("Kirim agenda besok beserta bahan yang perlu dibaca malam ini, dan 1 keputusan yang ditunggu darinya", "Send tomorrow's agenda, materials to read tonight, and the 1 decision awaiting him"), skor: 2, umpan: _("Ringkas dan membantu ia bersiap.", "Concise and helps him prepare.") },
            { teks: _("Kirim tangkapan layar kalender", "Send a calendar screenshot"), skor: 1, umpan: _("Cukup informatif, tetapi tanpa konteks bahan dan keputusan.", "Informative, but lacks materials and decisions.") },
            { teks: _("\"Banyak, Pak.\"", "\"A lot, sir.\""), skor: 0, umpan: _("Tidak membantu sama sekali.", "Not helpful at all.") },
          ],
        },
      ],
    },
  },
};
