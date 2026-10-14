import { t as _ } from "../../i18n.js";

/** Latihan praktik kategori Pendidikan & Konsultasi. */
export default {
  "tutor-online": {
    kuis: [
      {
        q: _("Di sesi pertama, murid SMP diam saja dan hanya menjawab \"iya\". Langkah paling efektif?", "In the first session, a junior high student stays quiet and only says \"yes\". Most effective move?"),
        o: [
          _("Terus menjelaskan materi sampai jam selesai", "Keep explaining until time's up"),
          _("Ajukan soal pendek yang bisa ia jawab, lalu minta ia menjelaskan caranya", "Give a short question they can answer, then ask them to explain how"),
          _("Laporkan ke orang tua bahwa anaknya tidak fokus", "Tell the parents their child isn't focused"),
          _("Akhiri sesi lebih cepat", "End the session early"),
        ],
        a: 1,
        e: _("Keberhasilan kecil membangun rasa percaya diri, dan meminta murid menjelaskan cara berpikirnya menunjukkan apakah ia benar-benar paham.", "Small wins build confidence, and asking students to explain their thinking shows whether they truly understand."),
      },
      {
        q: _("Bagaimana cara terbaik memastikan murid paham di akhir sesi online?", "What's the best way to check understanding at the end of an online session?"),
        o: [
          _("Bertanya \"Sudah paham?\"", "Ask \"Got it?\""),
          _("Memberi 2 sampai 3 soal singkat untuk dikerjakan langsung", "Give 2 to 3 short questions to solve on the spot"),
          _("Mengirim rekaman sesi", "Send the session recording"),
          _("Memberi PR sebanyak mungkin", "Assign as much homework as possible"),
        ],
        a: 1,
        e: _("Hampir semua murid menjawab \"paham\" walaupun belum. Soal singkat memberi bukti nyata.", "Almost every student says \"yes\" even when they don't get it. Short questions give real evidence."),
      },
      {
        q: _("Orang tua meminta jadwal diganti mendadak 30 menit sebelum sesi, untuk ketiga kalinya bulan ini. Respons yang paling profesional?", "A parent asks to reschedule 30 minutes before the session, for the third time this month. Most professional response?"),
        o: [
          _("Selalu menerima tanpa batas", "Always accept, no limit"),
          _("Menolak dengan marah", "Refuse angrily"),
          _("Menerima kali ini, lalu menyampaikan kebijakan pembatalan dengan sopan, misalnya minimal 12 jam sebelumnya", "Accept this time, then politely share a cancellation policy, such as at least 12 hours' notice"),
          _("Diam-diam tidak datang di sesi berikutnya", "Quietly skip the next session"),
        ],
        a: 2,
        e: _("Kebijakan pembatalan yang tertulis melindungi waktumu tanpa merusak hubungan. Sampaikan sebelum masalahnya terulang.", "A written cancellation policy protects your time without damaging the relationship. Share it before it happens again."),
      },
      {
        q: _("Kamu mengajar bahasa Indonesia untuk orang asing pemula. Cara mengajar mana yang paling tepat?", "You teach Indonesian to beginner foreigners. Which approach fits best?"),
        o: [
          _("Mulai dari tata bahasa formal dan imbuhan", "Start with formal grammar and affixes"),
          _("Mulai dari percakapan sehari-hari yang langsung bisa dipakai, seperti memesan makanan", "Start with everyday conversation they can use right away, like ordering food"),
          _("Hanya memakai bahasa Indonesia sejak menit pertama tanpa bantuan", "Use only Indonesian from minute one with no support"),
          _("Membaca koran bersama", "Read newspapers together"),
        ],
        a: 1,
        e: _("Orang dewasa termotivasi oleh hal yang langsung berguna. Tata bahasa diperkenalkan bertahap lewat contoh percakapan.", "Adults are motivated by what's immediately useful. Grammar comes in gradually through conversation."),
      },
      {
        q: _("Sebuah platform tutor meminta \"biaya verifikasi akun\" Rp200.000 sebelum kamu bisa menerima murid. Apa artinya?", "A tutoring platform asks for a Rp200,000 \"account verification fee\" before you can take students. What does that mean?"),
        o: [
          _("Platform tutor yang sah biasanya mengambil komisi dari pembayaran murid, bukan memungut biaya di awal dari tutor", "Legitimate tutoring platforms usually take a commission from student payments, not upfront fees from tutors"),
          _("Semua platform tutor melakukannya", "All tutoring platforms do this"),
          _("Itu biaya pajak", "That's a tax fee"),
          _("Itu jaminan pasti mendapat murid", "It guarantees you'll get students"),
        ],
        a: 0,
        e: _("Biaya di awal tanpa kepastian murid adalah tanda bahaya. Periksa ulasan platform dan cara mereka dibayar sebelum mendaftar.", "An upfront fee with no guaranteed students is a red flag. Check reviews and how the platform earns before signing up."),
      },
    ],
    tugas: [
      {
        judul: _("Rancang rencana sesi 60 menit", "Plan a 60-minute session"),
        brief: _(
          "Anak saya kelas 8, nilai matematikanya turun di materi persamaan linear satu variabel. Bisa tolong jelaskan rencana sesi pertama?",
          "My child is in grade 8 and their maths grades dropped on single-variable linear equations. Could you outline the first session plan?",
        ),
        langkah: [
          _("Bagi sesi 60 menit menjadi beberapa bagian dengan durasi.", "Split the 60 minutes into parts with durations."),
          _("Tuliskan satu contoh soal yang akan dipakai.", "Write one example problem you'll use."),
          _("Tulis pesan singkat ke orang tua tentang rencana ini.", "Write a short message to the parent about the plan."),
        ],
        rubrik: [
          _("Ada sesi pemetaan awal untuk mencari letak kesulitan", "Starts with a diagnostic to find where the gap is"),
          _("Ada penjelasan, latihan terbimbing, dan latihan mandiri", "Includes explanation, guided practice, and independent practice"),
          _("Ada pengecekan pemahaman di akhir", "Ends with an understanding check"),
          _("Contoh soal sesuai level kelas 8", "Example problem fits grade 8"),
          _("Pesan ke orang tua jelas dan meyakinkan", "Message to the parent is clear and reassuring"),
        ],
        contoh: _(
          "Rencana sesi (60 menit):\n• 10 menit: 3 soal pemetaan untuk melihat letak kesulitan (operasi bilangan negatif, pindah ruas, atau soal cerita)\n• 15 menit: penjelasan konsep \"timbangan seimbang\", apa yang dilakukan di kiri juga dilakukan di kanan\n• 20 menit: latihan terbimbing, misalnya 3x + 5 = 20, lalu 2(x - 4) = 10\n• 10 menit: 3 soal mandiri\n• 5 menit: rangkuman dan 1 soal penutup\n\nPesan ke orang tua:\n\"Selamat sore, Bu. Di sesi pertama saya akan mengecek dulu bagian mana yang paling sulit, lalu fokus berlatih di sana. Setelah sesi, saya kirim catatan singkat perkembangan dan latihan untuk di rumah.\"",
          "Session plan (60 minutes):\n• 10 min: 3 diagnostic questions to find the gap (negative numbers, moving terms, or word problems)\n• 15 min: the \"balanced scale\" idea, whatever you do on the left you do on the right\n• 20 min: guided practice, e.g. 3x + 5 = 20, then 2(x - 4) = 10\n• 10 min: 3 independent questions\n• 5 min: recap and 1 closing question\n\nMessage to the parent:\n\"Good afternoon. In the first session I'll check which part is hardest, then focus practice there. Afterwards I'll send a short progress note and some practice for home.\"",
        ),
      },
      {
        judul: _("Tulis laporan perkembangan murid", "Write a student progress report"),
        brief: _(
          "Sudah 4 sesi berjalan. Tolong kirimkan laporan perkembangan anak saya: apa yang sudah bisa, apa yang masih sulit, dan apa yang bisa kami bantu di rumah.",
          "We're 4 sessions in. Please send a progress report: what my child can do now, what's still hard, and how we can help at home.",
        ),
        langkah: [
          _("Tulis laporan singkat untuk orang tua (anggap muridnya bernama Raka).", "Write a short report for the parent (the student is called Raka)."),
          _("Gunakan contoh konkret, bukan penilaian umum.", "Use concrete examples, not general judgements."),
          _("Akhiri dengan saran yang bisa dilakukan di rumah.", "End with suggestions for home."),
        ],
        rubrik: [
          _("Dibuka dengan hal positif yang spesifik", "Opens with a specific positive"),
          _("Kesulitan dijelaskan dengan contoh dan tanpa menyalahkan", "Difficulties described with examples, without blame"),
          _("Ada target untuk sesi berikutnya", "Sets a target for the next sessions"),
          _("Saran di rumah praktis dan ringan", "Home suggestions are practical and light"),
        ],
        contoh: _(
          "Laporan perkembangan Raka (sesi 1 sampai 4)\n\nSudah bisa: Raka sekarang lancar menyelesaikan persamaan seperti 4x - 7 = 13 dan mulai menjelaskan langkahnya sendiri. Di kuis sesi 4 ia benar 7 dari 10 soal, naik dari 3 dari 10 di sesi pertama.\n\nMasih perlu latihan: soal cerita. Raka sering bingung menentukan apa yang dimisalkan sebagai x.\n\nTarget dua sesi ke depan: mengubah soal cerita menjadi persamaan.\n\nDi rumah: cukup 10 menit sehari. Minta Raka menjelaskan satu soal kepada Ibu atau Bapak seolah-olah ia gurunya. Menjelaskan dengan kata-kata sendiri sangat membantu pemahamannya.",
          "Raka's progress report (sessions 1 to 4)\n\nCan do now: Raka now solves equations like 4x - 7 = 13 confidently and is starting to explain his steps. He got 7 out of 10 on the session 4 quiz, up from 3 out of 10 in the first session.\n\nStill needs practice: word problems. Raka often isn't sure what to set as x.\n\nTarget for the next two sessions: turning word problems into equations.\n\nAt home: 10 minutes a day is enough. Ask Raka to explain one problem to you as if he were the teacher. Explaining in his own words really helps.",
        ),
      },
    ],
  },

  "career-coach": {
    kuis: [
      {
        q: _("Klien menulis di CV: \"Bertanggung jawab atas media sosial perusahaan.\" Perbaikan terbaik?", "A client's CV says: \"Responsible for the company's social media.\" Best improvement?"),
        o: [
          _("\"Sangat bertanggung jawab atas media sosial perusahaan\"", "\"Highly responsible for the company's social media\""),
          _("\"Menaikkan pengikut Instagram dari 4.000 menjadi 15.000 dalam 8 bulan lewat konten video pendek mingguan\"", "\"Grew Instagram followers from 4,000 to 15,000 in 8 months with weekly short videos\""),
          _("\"Media sosial\"", "\"Social media\""),
          _("\"Bertanggung jawab atas media sosial, website, dan lain-lain\"", "\"Responsible for social media, website, etc.\""),
        ],
        a: 1,
        e: _("Rekruter mencari hasil. Kata kerja aktif, angka, dan cara mencapainya membuat pencapaian terlihat nyata.", "Recruiters look for results. Action verbs, numbers, and how you did it make achievements concrete."),
      },
      {
        q: _("Apa yang paling sering membuat CV tidak terbaca dengan baik oleh sistem ATS?", "What most often makes a CV unreadable for ATS software?"),
        o: [
          _("Tata letak dua kolom dengan tabel, ikon, dan teks di dalam gambar", "Two-column layouts with tables, icons, and text inside images"),
          _("Memakai font standar seperti Arial", "Using standard fonts like Arial"),
          _("Judul bagian seperti \"Pengalaman Kerja\"", "Section headings like \"Work Experience\""),
          _("Menyimpan sebagai PDF teks", "Saving as a text-based PDF"),
        ],
        a: 0,
        e: _("Banyak ATS membaca teks dari kiri ke kanan. Tabel, ikon, dan teks dalam gambar bisa membuat informasi terlewat atau berantakan.", "Many ATS read text left to right. Tables, icons, and text in images can get skipped or scrambled."),
      },
      {
        q: _("Klien bertanya, \"Apakah dengan jasa ini saya pasti diterima kerja?\" Jawaban yang jujur?", "A client asks, \"Will this service guarantee me a job?\" What's the honest answer?"),
        o: [
          _("\"Pasti, saya jamin 100%.\"", "\"Definitely, 100% guaranteed.\""),
          _("\"Saya tidak bisa menjamin hasil, tetapi saya bisa membuat CV dan persiapan interview Anda jauh lebih kuat.\"", "\"I can't guarantee an outcome, but I can make your CV and interview prep much stronger.\""),
          _("\"Tergantung keberuntungan saja.\"", "\"It's just luck.\""),
          _("\"Kalau tidak diterima, itu salah Anda.\"", "\"If you don't get hired, it's your fault.\""),
        ],
        a: 1,
        e: _("Keputusan rekrutmen ada di perusahaan. Menjanjikan kepastian kerja tidak jujur dan merusak reputasimu.", "Hiring decisions belong to employers. Promising a guaranteed job is dishonest and hurts your reputation."),
      },
      {
        q: _("Dalam mock interview, klien menjawab \"Ceritakan tentang diri Anda\" dengan membacakan riwayat hidup sejak SD. Masukan terbaik?", "In a mock interview, a client answers \"Tell me about yourself\" by reciting their life since primary school. Best feedback?"),
        o: [
          _("\"Bagus, sudah lengkap.\"", "\"Great, very complete.\""),
          _("\"Coba fokus ke 3 bagian: posisimu sekarang, pencapaian yang relevan, dan alasan tertarik pada posisi ini, dalam 1 sampai 2 menit.\"", "\"Try 3 parts: where you are now, a relevant achievement, and why this role, in 1 to 2 minutes.\""),
          _("\"Jawabanmu salah.\"", "\"Your answer is wrong.\""),
          _("\"Hafalkan jawaban dari internet.\"", "\"Memorise an answer from the internet.\""),
        ],
        a: 1,
        e: _("Masukan yang baik spesifik dan bisa langsung dipraktikkan. Struktur sekarang, pencapaian, dan alasan membuat jawaban ringkas dan relevan.", "Good feedback is specific and actionable. The now, achievement, why structure keeps answers tight and relevant."),
      },
      {
        q: _("Seorang \"agen\" menawarkan kerja sama: kamu merekomendasikan klienmu ke perusahaan tertentu, lalu klien membayar Rp2 juta agar \"pasti lolos\". Bagaimana menyikapinya?", "An \"agent\" proposes a deal: you refer clients to certain companies, and clients pay Rp2 million to \"be sure to pass\". How do you respond?"),
        o: [
          _("Terima, karena ada komisi tambahan", "Accept for the extra commission"),
          _("Tolak, karena ini praktik jual-beli posisi yang merugikan klien dan sering kali penipuan", "Decline, it's selling positions, harms clients, and is often a scam"),
          _("Terima hanya untuk klien yang mampu membayar", "Accept only for clients who can afford it"),
          _("Tawar komisinya lebih besar", "Negotiate a bigger commission"),
        ],
        a: 1,
        e: _("Rekrutmen yang sah tidak bisa dibeli. Ikut dalam skema seperti ini bisa merugikan klien dan menyeretmu ke masalah hukum.", "Legitimate hiring can't be bought. Joining such a scheme harms clients and may drag you into legal trouble."),
      },
    ],
    tugas: [
      {
        judul: _("Perbaiki poin pengalaman di CV", "Rewrite CV experience bullets"),
        brief: _(
          "Ini bagian pengalaman di CV saya. Saya melamar posisi Admin Operasional.\n• Mengurus data\n• Membantu atasan\n• Membuat laporan setiap minggu\n• Menjawab telepon",
          "Here's the experience section of my CV. I'm applying for Operations Admin.\n• Handled data\n• Helped my manager\n• Made weekly reports\n• Answered phone calls",
        ),
        langkah: [
          _("Tulis ulang keempat poin agar lebih kuat. Jika butuh angka, buat perkiraan dan tandai [perlu dicek].", "Rewrite all four bullets to be stronger. If you need numbers, estimate and mark [to verify]."),
          _("Gunakan kata kerja aktif di awal setiap poin.", "Start each bullet with an action verb."),
          _("Tulis 2 pertanyaan untuk klien agar poinnya bisa lebih akurat.", "Write 2 questions for the client to make the bullets more accurate."),
        ],
        rubrik: [
          _("Setiap poin diawali kata kerja aktif", "Each bullet starts with an action verb"),
          _("Ada angka atau hasil yang terukur", "Includes numbers or measurable results"),
          _("Relevan dengan posisi Admin Operasional", "Relevant to Operations Admin"),
          _("Angka perkiraan ditandai untuk dicek", "Estimated numbers are flagged to verify"),
          _("Pertanyaan ke klien membantu menggali pencapaian", "Questions help uncover achievements"),
        ],
        contoh: _(
          "• Mengelola dan memperbarui data 300+ pesanan per minggu di Excel dengan tingkat kesalahan di bawah 1% [perlu dicek]\n• Menyiapkan jadwal, dokumen rapat, dan tindak lanjut untuk manajer operasional\n• Menyusun laporan operasional mingguan yang dipakai manajemen untuk memantau keterlambatan pengiriman\n• Menangani rata-rata 25 panggilan pelanggan dan vendor per hari [perlu dicek]\n\nPertanyaan untuk klien:\n1. Berapa kira-kira data atau pesanan yang Anda kelola setiap minggu?\n2. Apakah laporan mingguan Anda pernah membantu menemukan masalah atau menghemat waktu tim?",
          "• Managed and updated 300+ weekly orders in Excel with an error rate below 1% [to verify]\n• Prepared schedules, meeting documents, and follow-ups for the operations manager\n• Built weekly operations reports used by management to track delivery delays\n• Handled an average of 25 customer and vendor calls a day [to verify]\n\nQuestions for the client:\n1. Roughly how many records or orders did you handle each week?\n2. Did your weekly reports ever help spot a problem or save the team time?",
        ),
      },
      {
        judul: _("Beri masukan jawaban interview", "Give feedback on an interview answer"),
        brief: _(
          "Pertanyaan: \"Apa kelemahan terbesar Anda?\"\nJawaban klien: \"Kelemahan saya adalah saya terlalu perfeksionis dan terlalu rajin bekerja.\"",
          "Question: \"What's your biggest weakness?\"\nClient's answer: \"My weakness is that I'm too much of a perfectionist and I work too hard.\"",
        ),
        langkah: [
          _("Jelaskan mengapa jawaban ini kurang efektif.", "Explain why this answer falls short."),
          _("Berikan struktur jawaban yang lebih baik.", "Give a better answer structure."),
          _("Tulis satu contoh jawaban perbaikan.", "Write one improved example answer."),
        ],
        rubrik: [
          _("Masukan disampaikan dengan sopan dan membangun", "Feedback is polite and constructive"),
          _("Menjelaskan bahwa jawaban klise terdengar menghindar", "Explains that clichés sound evasive"),
          _("Struktur: kelemahan nyata, dampaknya, dan langkah perbaikan", "Structure: a real weakness, its impact, and the fix"),
          _("Contoh jawaban jujur dan tidak merusak peluang", "Example is honest without hurting chances"),
        ],
        contoh: _(
          "Masukan: Jawaban \"terlalu perfeksionis\" sangat sering didengar rekruter, sehingga terdengar seperti menghindari pertanyaan. Rekruter ingin melihat kesadaran diri dan usaha memperbaiki.\n\nStruktur: sebutkan kelemahan nyata yang tidak inti bagi posisinya, beri contoh dampaknya, lalu jelaskan langkah yang sudah kamu ambil.\n\nContoh: \"Dulu saya kurang nyaman berbicara di depan banyak orang, sehingga sering menahan ide saat rapat. Setahun terakhir saya sengaja mengambil giliran presentasi di rapat tim setiap bulan. Sekarang saya jauh lebih percaya diri, walaupun masih terus berlatih.\"",
          "Feedback: \"Too much of a perfectionist\" is something recruiters hear constantly, so it sounds like dodging the question. They want self-awareness and effort to improve.\n\nStructure: name a real weakness that isn't core to the role, give an example of its impact, then explain what you've done about it.\n\nExample: \"I used to be uncomfortable speaking in front of groups, so I held back ideas in meetings. Over the past year I've volunteered to present at our monthly team meeting. I'm much more confident now, though I keep practising.\"",
        ),
      },
    ],
  },

  kurikulum: {
    kuis: [
      {
        q: _("Mana tujuan pembelajaran yang paling bisa diukur?", "Which learning objective is most measurable?"),
        o: [
          _("Siswa memahami pecahan", "Students understand fractions"),
          _("Siswa dapat menjumlahkan dua pecahan berpenyebut berbeda dengan benar", "Students can correctly add two fractions with different denominators"),
          _("Siswa menyukai matematika", "Students enjoy maths"),
          _("Siswa mengetahui sejarah pecahan", "Students know the history of fractions"),
        ],
        a: 1,
        e: _("Tujuan yang baik memakai kata kerja yang bisa diamati, seperti menghitung atau menjelaskan, sehingga mudah dibuat soalnya.", "Good objectives use observable verbs like calculate or explain, which makes them easy to test."),
      },
      {
        q: _("Apa ciri pengecoh (pilihan salah) yang baik dalam soal pilihan ganda?", "What makes a good distractor (wrong option) in a multiple-choice question?"),
        o: [
          _("Jelas-jelas salah supaya siswa cepat menjawab", "Obviously wrong so students answer fast"),
          _("Berasal dari kesalahan umum siswa sehingga terlihat masuk akal", "Based on common student mistakes so it looks plausible"),
          _("Lebih panjang dari jawaban benar", "Longer than the correct answer"),
          _("Memakai kata \"selalu\" dan \"tidak pernah\"", "Uses \"always\" and \"never\""),
        ],
        a: 1,
        e: _("Pengecoh dari kesalahan umum membuat soal bisa membedakan siswa yang paham dan yang belum, sekaligus memberi data miskonsepsi.", "Distractors based on common mistakes separate students who understand from those who don't, and reveal misconceptions."),
      },
      {
        q: _("Soal: \"Manakah yang bukan bukan termasuk hewan mamalia?\" Apa masalahnya?", "Question: \"Which is not not a mammal?\" What's the problem?"),
        o: [
          _("Tidak ada masalah", "No problem"),
          _("Negasi ganda membingungkan dan menguji kemampuan membaca, bukan pemahaman materi", "The double negative confuses and tests reading, not subject knowledge"),
          _("Terlalu mudah", "Too easy"),
          _("Harus memakai gambar", "It needs an image"),
        ],
        a: 1,
        e: _("Hindari negasi ganda. Jika harus memakai kata \"bukan\", tebalkan agar terlihat jelas.", "Avoid double negatives. If you must use \"not\", make it bold so it stands out."),
      },
      {
        q: _("Bimbel memintamu menulis 100 soal dalam 3 hari. Cara menjaga kualitasnya?", "A tutoring centre wants 100 questions in 3 days. How do you keep quality up?"),
        o: [
          _("Menyalin soal dari buku dan situs lain", "Copy questions from books and sites"),
          _("Membuat kisi-kisi dulu (materi, level kesulitan, jumlah), lalu menulis dan mengecek kunci jawaban satu per satu", "Draft a blueprint first (topics, difficulty, counts), then write and check every answer key"),
          _("Membuat soal acak dan berharap seimbang", "Write random questions and hope it balances"),
          _("Menyerahkan tanpa kunci jawaban", "Submit without answer keys"),
        ],
        a: 1,
        e: _("Kisi-kisi menjaga sebaran materi dan level tetap seimbang. Menyalin soal orang lain melanggar hak cipta dan merusak kepercayaan klien.", "A blueprint keeps topics and difficulty balanced. Copying others' questions breaks copyright and the client's trust."),
      },
      {
        q: _("Seseorang menawarkan bayaran besar jika kamu bisa mendapatkan \"bocoran soal\" ujian resmi. Apa sikap yang tepat?", "Someone offers big money if you can get \"leaked\" official exam questions. What's the right stance?"),
        o: [
          _("Terima jika bayarannya cukup besar", "Accept if the pay is high enough"),
          _("Tolak, karena membocorkan soal ujian resmi melanggar hukum dan etika", "Decline, leaking official exam questions breaks the law and ethics"),
          _("Buat soal palsu yang mirip lalu jual", "Make similar fake questions and sell them"),
          _("Minta setengah dibayar di awal", "Ask for half upfront"),
        ],
        a: 1,
        e: _("Penulis soal yang dipercaya menjaga integritas ujian. Tawaran seperti ini juga sering dipakai untuk menipu.", "Trusted question writers protect exam integrity. Offers like this are also common scams."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis 3 soal dengan pembahasan", "Write 3 questions with explanations"),
        brief: _(
          "Kami butuh soal latihan IPA kelas 7 tentang wujud zat (padat, cair, gas) dan perubahannya. Tolong buat 3 soal pilihan ganda: 1 mudah, 1 sedang, 1 sulit.",
          "We need grade 7 science practice questions on states of matter (solid, liquid, gas) and changes of state. Please write 3 multiple-choice questions: 1 easy, 1 medium, 1 hard.",
        ),
        langkah: [
          _("Tulis 3 soal dengan 4 pilihan jawaban masing-masing.", "Write 3 questions with 4 options each."),
          _("Tandai kunci jawaban dan level kesulitannya.", "Mark the answer key and difficulty."),
          _("Tulis pembahasan singkat untuk setiap soal.", "Write a short explanation for each."),
        ],
        rubrik: [
          _("Tingkat kesulitan benar-benar bertingkat", "Difficulty actually increases"),
          _("Pengecoh masuk akal, bukan asal salah", "Distractors are plausible"),
          _("Kunci jawaban benar secara ilmiah", "Answer keys are scientifically correct"),
          _("Pembahasan menjelaskan alasan, bukan hanya jawaban", "Explanations give reasons, not just answers"),
        ],
        contoh: _(
          "1. (Mudah) Perubahan wujud dari cair menjadi padat disebut...\nA. Mencair  B. Membeku*  C. Menguap  D. Menyublim\nPembahasan: Membeku terjadi saat zat cair melepaskan kalor, misalnya air menjadi es.\n\n2. (Sedang) Kapur barus di lemari lama-lama habis tanpa meninggalkan cairan. Peristiwa ini adalah...\nA. Mencair  B. Menguap  C. Menyublim*  D. Mengembun\nPembahasan: Kapur barus berubah langsung dari padat menjadi gas tanpa melalui wujud cair.\n\n3. (Sulit) Gelas berisi es teh terlihat basah di bagian luarnya. Penjelasan yang paling tepat adalah...\nA. Es teh merembes melalui gelas\nB. Uap air di udara mengembun karena menyentuh permukaan gelas yang dingin*\nC. Es di dalam gelas menyublim\nD. Gelas mencair karena dingin\nPembahasan: Uap air di udara melepaskan kalor saat menyentuh permukaan dingin, lalu berubah menjadi titik air. Pilihan A adalah miskonsepsi yang umum.",
          "1. (Easy) The change from liquid to solid is called...\nA. Melting  B. Freezing*  C. Evaporation  D. Sublimation\nExplanation: Freezing happens when a liquid releases heat, like water turning into ice.\n\n2. (Medium) Mothballs in a wardrobe slowly disappear without leaving any liquid. This is...\nA. Melting  B. Evaporation  C. Sublimation*  D. Condensation\nExplanation: Mothballs change directly from solid to gas without becoming liquid.\n\n3. (Hard) A glass of iced tea looks wet on the outside. The best explanation is...\nA. The tea seeps through the glass\nB. Water vapour in the air condenses on the cold glass surface*\nC. The ice inside sublimates\nD. The glass melts from the cold\nExplanation: Water vapour in the air loses heat on the cold surface and turns into droplets. Option A is a common misconception.",
        ),
      },
      {
        judul: _("Susun kerangka modul pelatihan", "Outline a training module"),
        brief: _(
          "Kami ingin modul online singkat \"Dasar Excel untuk Admin\" untuk karyawan baru, total sekitar 2 jam belajar mandiri. Tolong buat kerangkanya.",
          "We want a short online module, \"Excel Basics for Admin Staff\", for new hires, about 2 hours of self-study in total. Please outline it.",
        ),
        langkah: [
          _("Tulis 3 tujuan pembelajaran yang bisa diukur.", "Write 3 measurable learning objectives."),
          _("Bagi modul menjadi beberapa bagian dengan durasi.", "Split the module into parts with durations."),
          _("Tentukan cara mengukur keberhasilan peserta di akhir.", "Decide how to assess learners at the end."),
        ],
        rubrik: [
          _("Tujuan pembelajaran memakai kata kerja yang bisa diukur", "Objectives use measurable verbs"),
          _("Urutan materi dari dasar ke lanjutan", "Content goes from basic to advanced"),
          _("Total durasi masuk akal (sekitar 2 jam)", "Total duration is realistic (about 2 hours)"),
          _("Ada latihan praktik, bukan hanya video atau bacaan", "Includes hands-on practice, not just videos or reading"),
          _("Ada penilaian akhir yang sesuai tujuan", "Final assessment matches the objectives"),
        ],
        contoh: _(
          "Tujuan: setelah modul, peserta dapat\n1. Merapikan dan mengurutkan tabel data dengan filter dan sort\n2. Menghitung total dan rata-rata dengan SUM, AVERAGE, dan SUMIF\n3. Membuat pivot table sederhana untuk laporan bulanan\n\nBagian:\n• 15 menit: mengenal tampilan Excel dan format tabel\n• 25 menit: sort, filter, dan freeze panes + latihan data penjualan\n• 35 menit: rumus dasar dan SUMIF + latihan\n• 30 menit: pivot table + latihan laporan bulanan\n• 15 menit: tugas akhir\n\nPenilaian: peserta mengunggah file berisi tabel yang sudah dirapikan, 3 rumus yang benar, dan 1 pivot table. Dinilai dengan checklist 5 poin.",
          "Objectives: after the module, learners can\n1. Clean and sort a data table using filter and sort\n2. Calculate totals and averages with SUM, AVERAGE, and SUMIF\n3. Build a simple pivot table for a monthly report\n\nParts:\n• 15 min: the Excel interface and table formatting\n• 25 min: sort, filter, and freeze panes + practice with sales data\n• 35 min: basic formulas and SUMIF + practice\n• 30 min: pivot tables + monthly report practice\n• 15 min: final task\n\nAssessment: learners upload a file with a cleaned table, 3 correct formulas, and 1 pivot table, scored with a 5-point checklist.",
        ),
      },
    ],
  },
};
