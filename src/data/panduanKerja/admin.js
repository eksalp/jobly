import { t as _ } from "../../i18n.js";

/** Cara lolos seleksi dan gambaran kerja: kategori Administrasi & Dukungan. */
export default {
  "virtual-assistant": {
    kerja: {
      hari: [
        { jam: "08.00", isi: _("Cek kotak masuk dan kalender klien. Tandai email yang mendesak, arsipkan promosi, dan siapkan daftar prioritas hari ini.", "Check the client's inbox and calendar. Flag urgent emails, archive promotions, and draft today's priority list.") },
        { jam: "09.00", isi: _("Kirim ringkasan pagi ke klien lewat Slack atau WhatsApp: 3 hal penting hari ini dan hal yang butuh keputusannya.", "Send the client a morning summary on Slack or WhatsApp: 3 key items today and anything needing their decision.") },
        { jam: "10.00", isi: _("Kerjakan tugas utama: menjadwalkan rapat lintas zona waktu, membalas email rutin dengan template, memperbarui spreadsheet.", "Main tasks: scheduling meetings across time zones, answering routine emails from templates, updating spreadsheets.") },
        { jam: "13.00", isi: _("Riset kecil, misalnya membandingkan 3 vendor atau mencari hotel, lalu rangkum dalam satu tabel.", "Small research, such as comparing 3 vendors or finding hotels, summarised in one table.") },
        { jam: "15.00", isi: _("Tindak lanjut: tagih invoice yang lewat tempo, ingatkan peserta rapat besok, rapikan folder Drive.", "Follow-ups: chase overdue invoices, remind tomorrow's attendees, tidy Drive folders.") },
        { jam: "16.30", isi: _("Laporan akhir hari: apa yang selesai, apa yang tertunda dan alasannya, rencana besok. Catat jam kerja di time tracker.", "End-of-day report: what's done, what's pending and why, tomorrow's plan. Log hours in the time tracker.") },
      ],
      dinilai: [
        _("Kecepatan respons di jam kerja yang disepakati (biasanya di bawah 1 sampai 2 jam)", "Response time within agreed hours (usually under 1 to 2 hours)"),
        _("Tidak ada tenggat atau rapat yang terlewat", "No missed deadlines or meetings"),
        _("Seberapa sedikit klien harus mengulang instruksi", "How rarely the client has to repeat instructions"),
        _("Inisiatif: menemukan masalah sebelum klien menyadarinya", "Initiative: spotting problems before the client does"),
      ],
      tantangan: [
        { judul: _("Instruksi yang samar", "Vague instructions"), isi: _("Ulangi instruksi dengan kata-katamu sendiri sebelum mengerjakan: \"Jadi saya buat X untuk Y paling lambat Z, betul?\" Satu pesan ini mencegah banyak pekerjaan ulang.", "Restate the instruction before starting: \"So I'll do X for Y by Z, correct?\" This one message prevents a lot of rework.") },
        { judul: _("Perbedaan zona waktu", "Time zone gaps"), isi: _("Sepakati jam tumpang tindih (misalnya 2 jam sehari) untuk diskusi langsung, dan pakai pesan tertulis yang lengkap di luar jam itu.", "Agree on overlap hours (say 2 hours a day) for live discussion, and write complete messages outside them.") },
        { judul: _("Pekerjaan bertambah di luar paket", "Scope creep"), isi: _("Catat semua tugas di time tracker. Saat pekerjaan tambahan konsisten muncul, tunjukkan datanya dan tawarkan paket jam yang lebih besar.", "Log every task. When extra work keeps appearing, show the data and offer a bigger hours package.") },
      ],
      jenjang: _("Biasanya mulai dari VA umum dengan beberapa klien kecil. Setelah 1 sampai 2 tahun, banyak VA memilih spesialisasi yang tarifnya lebih tinggi, seperti VA e-commerce, VA podcast, VA real estate, atau naik menjadi executive assistant dan online business manager yang memegang operasional bisnis klien.", "Most start as general VAs with a few small clients. After 1 to 2 years many specialise into higher-paying niches such as e-commerce, podcast, or real estate VA, or move up to executive assistant or online business manager running a client's operations."),
    },
    lolos: {
      alur: [
        _("Kirim lamaran atau proposal (Upwork, LinkedIn, agensi VA)", "Send an application or proposal (Upwork, LinkedIn, VA agencies)"),
        _("Tes tertulis singkat: membalas email, mengatur jadwal, atau mengisi spreadsheet", "Short written test: replying to an email, scheduling, or filling a spreadsheet"),
        _("Interview video 15 sampai 30 menit, sering dalam bahasa Inggris", "15 to 30-minute video interview, often in English"),
        _("Masa percobaan berbayar 1 sampai 2 minggu dengan tugas nyata", "Paid trial of 1 to 2 weeks with real tasks"),
        _("Kontrak jangka panjang per jam atau paket bulanan", "Long-term hourly or monthly package contract"),
      ],
      portofolio: [
        _("Contoh email balasan klien sebelum dan sesudah dirapikan", "Before-and-after examples of client email replies"),
        _("Template kalender mingguan atau SOP sederhana yang kamu buat", "A weekly calendar template or simple SOP you wrote"),
        _("Spreadsheet pelacak (invoice, lead, atau konten) yang rapi", "A tidy tracker spreadsheet (invoices, leads, or content)"),
        _("Video perkenalan 60 detik untuk menunjukkan cara bicaramu", "A 60-second intro video showing how you communicate"),
      ],
      tes: _("Tes VA biasanya praktis dan diberi batas waktu: membalas 3 email dengan nada berbeda, menjadwalkan rapat untuk peserta di 3 zona waktu, atau merapikan data kontak di Google Sheets. Yang dinilai adalah ketelitian, kejelasan tulisan, dan apakah kamu bertanya saat ada informasi yang kurang.", "VA tests are usually practical and timed: answering 3 emails in different tones, scheduling a meeting across 3 time zones, or cleaning contact data in Google Sheets. They judge accuracy, clear writing, and whether you ask when information is missing."),
      pertanyaan: [
        { q: _("Bagaimana kamu mengatur prioritas jika ada banyak permintaan sekaligus?", "How do you prioritise when lots of requests come at once?"), jawab: _("Sebut metodemu (mendesak dan penting, tenggat, dampak ke uang) dan beri contoh nyata. Tambahkan bahwa kamu mengonfirmasi prioritas ke klien saat ragu.", "Name your method (urgent vs important, deadlines, money impact) and give a real example. Add that you confirm priorities with the client when unsure.") },
        { q: _("Tools apa yang biasa kamu pakai?", "Which tools do you use?"), jawab: _("Sebutkan tools yang benar-benar kamu kuasai (Google Workspace, Notion, Trello, Calendly, Canva) dan satu contoh hasil kerja dengan masing-masing.", "List tools you truly know (Google Workspace, Notion, Trello, Calendly, Canva) with one example of work in each.") },
        { q: _("Bagaimana kamu menjaga kerahasiaan data klien?", "How do you keep client data confidential?"), jawab: _("Jelaskan kebiasaan konkret: password manager, verifikasi dua langkah, tidak menyimpan data di perangkat pribadi, dan siap menandatangani NDA.", "Explain concrete habits: a password manager, two-step verification, no client data on personal devices, and readiness to sign an NDA.") },
      ],
      kesalahan: [
        _("Proposal generik yang tidak menyebut kebutuhan klien sama sekali", "Generic proposals that never mention the client's needs"),
        _("Bahasa Inggris tertulis yang berantakan di lamaran pertama", "Messy written English in the very first application"),
        _("Menjanjikan bisa semua hal tanpa contoh hasil kerja", "Claiming to do everything without work samples"),
        _("Tidak menyebut jam kerja dan zona waktu yang tersedia", "Not stating available hours and time zone"),
      ],
    },
  },

  "customer-support": {
    kerja: {
      hari: [
        { jam: "08.45", isi: _("Masuk ke helpdesk (Zendesk, Freshdesk, atau Intercom), baca catatan serah terima dari shift sebelumnya dan pengumuman produk terbaru.", "Log in to the helpdesk (Zendesk, Freshdesk, or Intercom), read the previous shift's handover and the latest product notes.") },
        { jam: "09.00", isi: _("Tangani antrean chat dan email. Pakai saved reply untuk pertanyaan umum, tetapi selalu sesuaikan dengan nama dan situasi pelanggan.", "Work the chat and email queue. Use saved replies for common questions, always personalised to the customer.") },
        { jam: "11.00", isi: _("Kasus sulit: refund, akun terkunci, keluhan berulang. Eskalasi ke tim teknis atau keuangan dengan catatan lengkap.", "Hard cases: refunds, locked accounts, repeat complaints. Escalate to tech or finance with full notes.") },
        { jam: "13.30", isi: _("Rapat singkat tim (stand-up) membahas masalah yang sedang ramai dan perubahan kebijakan.", "Short team stand-up on trending issues and policy changes.") },
        { jam: "14.00", isi: _("Lanjut antrean, tindak lanjuti tiket yang menunggu balasan, perbarui artikel FAQ jika ada pertanyaan baru yang sering muncul.", "Back to the queue, follow up on pending tickets, update FAQ articles when new frequent questions appear.") },
        { jam: "17.00", isi: _("Tulis catatan serah terima untuk shift berikutnya: tiket terbuka, pelanggan yang dijanjikan kabar, dan bug yang dilaporkan.", "Write the handover for the next shift: open tickets, customers promised updates, and bugs reported.") },
      ],
      dinilai: [
        _("CSAT: skor kepuasan pelanggan setelah percakapan", "CSAT: customer satisfaction score after each conversation"),
        _("First response time dan resolution time", "First response time and resolution time"),
        _("First contact resolution: masalah beres tanpa pelanggan menghubungi lagi", "First contact resolution: solved without the customer coming back"),
        _("Kualitas tulisan dan kepatuhan pada prosedur, dicek lewat QA acak", "Writing quality and process compliance, checked by random QA"),
      ],
      tantangan: [
        { judul: _("Pelanggan yang marah", "Angry customers"), isi: _("Jangan membalas emosi dengan emosi. Akui masalahnya, sebut langkah yang sedang kamu ambil, dan beri perkiraan waktu yang jujur.", "Don't meet emotion with emotion. Acknowledge the issue, state your action, and give an honest time estimate.") },
        { judul: _("Target kecepatan versus kualitas", "Speed targets versus quality"), isi: _("Gunakan saved reply untuk hal rutin agar punya waktu lebih untuk kasus sulit. Membalas cepat tetapi salah justru menambah tiket.", "Use saved replies for routine cases to free time for hard ones. Fast but wrong replies only create more tickets.") },
        { judul: _("Shift malam dan kelelahan", "Night shifts and burnout"), isi: _("Banyak klien luar negeri butuh shift malam WIB. Atur jadwal tidur yang konsisten dan ambil jeda singkat setiap 1 sampai 2 jam.", "Many overseas clients need night shifts in WIB. Keep a consistent sleep schedule and take short breaks every 1 to 2 hours.") },
      ],
      jenjang: _("Dari agen tier 1 (pertanyaan umum), kamu bisa naik ke tier 2 yang menangani kasus teknis, lalu menjadi team lead, QA specialist, atau pindah ke customer success yang mengelola akun pelanggan besar. Pengalaman CS juga menjadi pintu masuk ke product operations dan trust and safety.", "From tier 1 (general questions) you can move to tier 2 technical cases, then team lead, QA specialist, or customer success managing key accounts. CS experience also opens doors to product operations and trust and safety."),
    },
    lolos: {
      alur: [
        _("Lamaran lewat situs karier atau LinkedIn", "Apply via a careers site or LinkedIn"),
        _("Tes menulis: membalas 2 sampai 3 tiket contoh dalam waktu terbatas", "Writing test: answer 2 to 3 sample tickets under time limits"),
        _("Tes mengetik dan kadang tes bahasa Inggris", "Typing test and sometimes an English test"),
        _("Interview dengan simulasi peran (role play) menghadapi pelanggan", "Interview with a customer role play"),
        _("Pelatihan produk 1 sampai 2 minggu sebelum mulai menangani tiket", "1 to 2 weeks of product training before handling tickets"),
      ],
      portofolio: [
        _("Contoh balasan untuk pelanggan marah, refund, dan pertanyaan teknis", "Sample replies for an angry customer, a refund, and a technical question"),
        _("Artikel FAQ singkat yang kamu tulis untuk produk yang kamu kenal", "A short FAQ article you wrote for a product you know"),
        _("Bukti kecepatan mengetik (misalnya hasil tes 60 kata per menit)", "Typing speed proof (e.g. a 60 wpm test result)"),
        _("Pengalaman melayani orang, walau bukan online: toko, kasir, organisasi kampus", "Any service experience, even offline: retail, cashier, campus organisations"),
      ],
      tes: _("Tes CS hampir selalu berupa tiket contoh. Kamu diminta membalas pelanggan yang kesal, menjelaskan kebijakan yang tidak disukai pelanggan, atau menolak permintaan dengan sopan. Penilai melihat empati, kejelasan langkah, tata bahasa, dan apakah kamu mengikuti kebijakan yang diberikan.", "CS tests are almost always sample tickets: replying to an upset customer, explaining an unpopular policy, or politely declining a request. Graders look at empathy, clear steps, grammar, and whether you follow the given policy."),
      pertanyaan: [
        { q: _("Ceritakan saat kamu menghadapi pelanggan yang sangat marah.", "Tell me about a time you handled a very angry customer."), jawab: _("Pakai struktur STAR (situasi, tugas, aksi, hasil). Tekankan bagaimana kamu menenangkan, solusi yang diberikan, dan hasil akhirnya.", "Use STAR (situation, task, action, result). Emphasise how you calmed them, the solution, and the outcome.") },
        { q: _("Apa yang kamu lakukan jika tidak tahu jawabannya?", "What do you do when you don't know the answer?"), jawab: _("Jujur bahwa kamu akan mengecek, beri perkiraan waktu, cari di knowledge base atau tanya tim, lalu kabari pelanggan.", "Say you'd check, give a time estimate, search the knowledge base or ask the team, then update the customer.") },
        { q: _("Bersedia bekerja shift atau di akhir pekan?", "Are you open to shifts or weekends?"), jawab: _("Jawab jujur dan spesifik soal jadwal yang bisa kamu jalani. Fleksibilitas shift sering jadi nilai tambah besar.", "Answer honestly and specifically about what you can do. Shift flexibility is often a big plus.") },
      ],
      kesalahan: [
        _("Tes tertulis penuh salah ketik", "Written tests full of typos"),
        _("Balasan terlalu kaku seperti robot atau terlalu santai", "Replies too robotic or too casual"),
        _("Menjanjikan hal di luar kebijakan saat role play", "Promising things outside policy during role play"),
        _("Koneksi internet atau ruangan tidak siap saat interview", "Unready internet or room during the interview"),
      ],
    },
  },

  transkripsi: {
    kerja: {
      hari: [
        { jam: "08.00", isi: _("Unduh file audio dari platform atau folder klien, cek durasi, jumlah pembicara, dan kualitas suara.", "Download audio from the platform or client folder; check length, speaker count, and sound quality.") },
        { jam: "08.30", isi: _("Jalankan transkripsi otomatis sebagai draf awal, lalu baca panduan gaya proyek (verbatim, format label, stempel waktu).", "Run automatic transcription as a first draft, then read the project style guide (verbatim type, labels, timestamps).") },
        { jam: "09.00", isi: _("Koreksi per bagian sambil mendengar ulang: nama, angka, istilah, dan bagian yang tumpang tindih. Kecepatan putar 0,75x untuk bagian sulit.", "Correct section by section while re-listening: names, numbers, terms, and overlaps. Use 0.75x speed for hard parts.") },
        { jam: "13.00", isi: _("Cek akhir: baca transkrip tanpa audio untuk menemukan kalimat janggal, lalu cocokkan lagi bagian yang ditandai.", "Final pass: read without audio to spot odd sentences, then recheck flagged parts.") },
        { jam: "15.00", isi: _("Kirim transkrip sesuai format, catat jumlah menit untuk tagihan, dan hapus file sesuai ketentuan kerahasiaan.", "Deliver in the required format, log minutes for billing, and delete files per confidentiality terms.") },
      ],
      dinilai: [
        _("Akurasi, biasanya ditargetkan 98 sampai 99%", "Accuracy, usually targeted at 98 to 99%"),
        _("Kepatuhan pada panduan gaya proyek", "Adherence to the project style guide"),
        _("Ketepatan waktu penyerahan", "On-time delivery"),
        _("Konsistensi label pembicara dan stempel waktu", "Consistent speaker labels and timestamps"),
      ],
      tantangan: [
        { judul: _("Audio buruk dan banyak pembicara", "Poor audio and many speakers"), isi: _("Gunakan headset yang bagus, putar lebih lambat, dan tandai bagian yang benar-benar tidak terdengar daripada menebak.", "Use good headphones, slow playback, and tag truly inaudible parts instead of guessing.") },
        { judul: _("Bayaran per menit audio", "Pay per audio minute"), isi: _("Satu menit audio bisa butuh 4 sampai 6 menit kerja. Hitung tarif efektifmu per jam dan tolak proyek yang terlalu murah untuk audio sulit.", "One audio minute can take 4 to 6 minutes of work. Calculate your effective hourly rate and decline underpriced difficult audio.") },
        { judul: _("Kelelahan telinga dan mata", "Ear and eye fatigue"), isi: _("Istirahat 5 menit setiap 45 menit, atur volume tidak terlalu keras, dan gunakan pintasan keyboard untuk mengurangi gerakan tangan.", "Rest 5 minutes every 45, keep volume moderate, and use keyboard shortcuts to reduce strain.") },
      ],
      jenjang: _("Transkriptor yang teliti bisa beralih ke subtitle dan captioning, transkripsi khusus (hukum, medis, riset), editor kualitas di platform, atau menjadi penerjemah audiovisual jika menguasai dua bahasa.", "Careful transcribers can move into subtitling and captioning, specialised transcription (legal, medical, research), QA editor roles, or audiovisual translation if bilingual."),
    },
    lolos: {
      alur: [
        _("Daftar di platform transkripsi atau lamar proyek di marketplace freelance", "Sign up with transcription platforms or bid on freelance projects"),
        _("Tes gaya dan tata bahasa (sering pilihan ganda)", "Style and grammar test (often multiple choice)"),
        _("Tes transkripsi audio pendek sesuai panduan gaya", "Short audio transcription test following a style guide"),
        _("Mulai dari proyek kecil, akses ke proyek lebih besar bertambah seiring skor kualitas", "Start with small jobs; access grows with your quality score"),
      ],
      portofolio: [
        _("Contoh transkrip 5 sampai 10 menit dari podcast publik, dengan label dan stempel waktu", "A 5 to 10-minute sample transcript of a public podcast with labels and timestamps"),
        _("Contoh subtitle (file SRT) untuk video pendek", "A sample subtitle (SRT) file for a short video"),
        _("Hasil tes kecepatan mengetik", "A typing speed test result"),
        _("Daftar bahasa atau dialek yang kamu kuasai", "Languages or dialects you understand"),
      ],
      tes: _("Biasanya kamu mendapat audio 2 sampai 5 menit dengan kualitas sedang dan panduan gaya 5 sampai 10 halaman. Kesalahan kecil seperti format stempel waktu atau label yang tidak konsisten sering membuat gagal, jadi baca panduannya dua kali.", "You usually get 2 to 5 minutes of medium-quality audio and a 5 to 10-page style guide. Small slips like inconsistent timestamps or labels often cause a fail, so read the guide twice."),
      pertanyaan: [
        { q: _("Bagaimana kamu menangani audio yang tidak jelas?", "How do you handle unclear audio?"), jawab: _("Jelaskan langkahmu: putar ulang lebih lambat, cek konteks, lalu tandai dengan format yang disepakati jika tetap tidak terdengar.", "Explain your steps: replay slower, check context, then tag per the agreed format if still unclear.") },
        { q: _("Berapa menit audio yang bisa kamu kerjakan per hari?", "How many audio minutes can you do a day?"), jawab: _("Beri angka realistis berdasarkan pengalaman (misalnya 60 sampai 90 menit audio jernih per hari) dan jelaskan bahwa audio sulit butuh waktu lebih.", "Give a realistic number from experience (e.g. 60 to 90 clear minutes a day) and note that hard audio takes longer.") },
        { q: _("Apakah kamu memakai AI?", "Do you use AI?"), jawab: _("Jawab jujur. Jelaskan bahwa AI hanya draf awal dan nilai kerjamu ada pada koreksi menyeluruh, serta patuhi aturan klien tentang alat AI.", "Be honest. Explain AI is only a first draft and your value is thorough correction, and follow the client's AI rules.") },
      ],
      kesalahan: [
        _("Tidak membaca panduan gaya sampai habis", "Not reading the style guide fully"),
        _("Menebak kata yang tidak terdengar", "Guessing inaudible words"),
        _("Mengirim draf AI tanpa koreksi", "Submitting uncorrected AI drafts"),
        _("Membayar \"biaya tes\" ke situs yang tidak jelas", "Paying \"test fees\" to dubious sites"),
      ],
    },
  },

  "executive-assistant": {
    kerja: {
      hari: [
        { jam: "07.30", isi: _("Tinjau kalender dan email atasan sebelum ia mulai bekerja. Siapkan briefing harian: rapat, bahan, dan keputusan yang ditunggu.", "Review the executive's calendar and inbox before they start. Prepare a daily brief: meetings, materials, and pending decisions.") },
        { jam: "09.00", isi: _("Kelola permintaan rapat: terima, tolak dengan sopan, atau usulkan waktu lain sesuai prioritas atasan.", "Handle meeting requests: accept, decline politely, or propose other times per the executive's priorities.") },
        { jam: "11.00", isi: _("Siapkan bahan rapat dan catat notulen di rapat penting, lalu kirim tindak lanjut dalam 24 jam.", "Prepare meeting materials, take minutes at key meetings, then send follow-ups within 24 hours.") },
        { jam: "14.00", isi: _("Urus perjalanan dinas, pengajuan biaya, dan riset singkat untuk keputusan atasan.", "Handle travel, expense claims, and quick research for decisions.") },
        { jam: "16.30", isi: _("Kirim ringkasan sore: yang sudah beres, yang menunggu jawaban atasan, dan agenda besok.", "Send an afternoon summary: done items, items awaiting the executive, and tomorrow's agenda.") },
      ],
      dinilai: [
        _("Atasan bisa fokus pada pekerjaan bernilai tinggi tanpa terganggu urusan administrasi", "The executive can focus on high-value work without admin distractions"),
        _("Tidak ada bentrok jadwal atau rapat tanpa persiapan", "No schedule clashes or unprepared meetings"),
        _("Kualitas komunikasi atas nama atasan", "Quality of communication on the executive's behalf"),
        _("Kerahasiaan dan penilaian yang baik", "Confidentiality and sound judgement"),
      ],
      tantangan: [
        { judul: _("Prioritas yang berubah cepat", "Fast-changing priorities"), isi: _("Tanyakan secara rutin \"apa tiga hal terpenting minggu ini?\" dan atur kalender berdasarkan jawaban itu.", "Regularly ask \"what are the three most important things this week?\" and shape the calendar around them.") },
        { judul: _("Menjaga batas wewenang", "Staying within your authority"), isi: _("Sepakati jenis keputusan dan email yang boleh kamu tangani sendiri. Perluas perlahan seiring kepercayaan.", "Agree which decisions and emails you may handle alone, and widen this as trust grows.") },
        { judul: _("Penipuan atas nama atasan", "Impersonation scams"), isi: _("Permintaan transfer atau data rahasia lewat email selalu diverifikasi lewat saluran lain, walaupun terlihat mendesak.", "Always verify transfer or sensitive data requests through another channel, however urgent they look.") },
      ],
      jenjang: _("Executive assistant berpengalaman bisa menjadi chief of staff, office manager, atau operations manager. Banyak juga yang berkembang menjadi online business manager untuk beberapa klien sekaligus.", "Experienced EAs can become chiefs of staff, office managers, or operations managers. Many also grow into online business managers serving several clients."),
    },
    lolos: {
      alur: [
        _("Lamaran dengan CV dan surat yang menonjolkan pengalaman mendukung atasan", "Apply with a CV and letter highlighting support experience"),
        _("Tes kasus: menyusun jadwal minggu sibuk atau membalas email sensitif", "Case test: building a busy week's schedule or replying to a sensitive email"),
        _("Interview dengan HR, lalu dengan eksekutif yang akan didukung", "Interviews with HR, then the executive you'd support"),
        _("Cek referensi dari atasan sebelumnya", "Reference checks with previous managers"),
      ],
      portofolio: [
        _("Contoh briefing harian atau mingguan (data klien disamarkan)", "A sample daily or weekly brief (client data anonymised)"),
        _("Contoh itinerary perjalanan dinas", "A sample business trip itinerary"),
        _("Notulen rapat dengan daftar tindak lanjut yang jelas", "Meeting minutes with clear action items"),
        _("Testimoni dari atasan atau klien yang pernah kamu dukung", "Testimonials from executives you've supported"),
      ],
      tes: _("Tes EA biasanya simulasi: kamu menerima kotak masuk berisi 10 sampai 15 email dan kalender yang bentrok, lalu diminta menyusun prioritas, membalas beberapa email, dan mengusulkan jadwal. Penilai melihat penilaianmu, bukan hanya kecepatan.", "EA tests are usually simulations: an inbox of 10 to 15 emails and a clashing calendar, and you prioritise, reply to some, and propose a schedule. Graders look at judgement, not just speed."),
      pertanyaan: [
        { q: _("Bagaimana kamu menolak permintaan rapat dari orang penting?", "How do you decline a meeting request from someone important?"), jawab: _("Tunjukkan bahwa kamu menolak dengan sopan sambil memberi alternatif, misalnya waktu lain atau orang lain yang bisa membantu.", "Show you decline politely while offering alternatives, like another time or another person who can help.") },
        { q: _("Ceritakan saat kamu mengantisipasi kebutuhan atasan sebelum ia meminta.", "Tell me about anticipating an executive's need before they asked."), jawab: _("Pilih contoh konkret dan sebut dampaknya, misalnya rapat menjadi lebih singkat atau masalah dihindari.", "Pick a concrete example and its impact, such as a shorter meeting or a problem avoided.") },
        { q: _("Bagaimana kamu menangani informasi rahasia?", "How do you handle confidential information?"), jawab: _("Jelaskan prinsip dan kebiasaan konkretmu, dan tegaskan bahwa kamu tidak membicarakan urusan atasan di luar pekerjaan.", "Explain your principles and habits, and stress you never discuss the executive's matters outside work.") },
      ],
      kesalahan: [
        _("Hanya bercerita tugas, tanpa hasil atau dampak", "Listing tasks without results or impact"),
        _("Tidak siap dengan contoh situasi sulit", "No ready examples of difficult situations"),
        _("Komunikasi tertulis yang bertele-tele", "Wordy written communication"),
        _("Membagikan detail rahasia atasan lama saat interview", "Sharing a former boss's confidential details in the interview"),
      ],
    },
  },
};
