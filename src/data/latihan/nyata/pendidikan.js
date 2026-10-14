import { t as _ } from "../../../i18n.js";

/** Detail kerja nyata, kategori Pendidikan & Konsultasi. */
export default {
  "tutor-online": {
    tugas: [
      {
        dari: { nama: "Bu Ratna", peran: _("Orang tua murid kelas 8", "Parent of a grade 8 student") },
        kanal: "WhatsApp",
        tenggat: _("Sebelum sesi Kamis", "Before Thursday's session"),
        revisi: {
          pesan: _("Terima kasih rencananya, Kak. Oh iya, Raka gampang bosan kalau terlalu lama dijelaskan. Bisa dibuat lebih banyak latihan dan sedikit permainan?", "Thanks for the plan. By the way, Raka gets bored with long explanations. Could it have more practice and a bit of a game?"),
          petunjuk: [
            _("Kurangi durasi penjelasan dan perbanyak latihan aktif", "Shorten explanation time and add active practice"),
            _("Tambahkan satu aktivitas berbentuk permainan yang tetap melatih materi", "Add one game-like activity that still practises the topic"),
            _("Balas orang tua dengan singkat dan tunjukkan perubahannya", "Reply briefly to the parent showing the changes"),
          ],
        },
      },
      {
        dari: { nama: "Bu Ratna", peran: _("Orang tua murid", "Parent") },
        kanal: "WhatsApp",
        tenggat: _("Akhir minggu ini", "End of this week"),
        revisi: {
          pesan: _("Terima kasih laporannya. Tapi nilai ulangan Raka minggu ini malah turun jadi 60. Apakah lesnya kurang efektif?", "Thanks for the report. But Raka's quiz score this week actually dropped to 60. Is the tutoring not working?"),
          petunjuk: [
            _("Tanggapi dengan tenang dan tidak defensif", "Respond calmly, not defensively"),
            _("Minta melihat soal ulangannya untuk mencari penyebab", "Ask to see the quiz to find the cause"),
            _("Usulkan langkah konkret untuk sesi berikutnya", "Propose concrete next steps"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Sore yang padat sebagai tutor online", "A busy afternoon as an online tutor"),
      konteks: _("Kamu punya 3 sesi berturut-turut mulai jam 15.00. Sesi pertama dengan Nadia, kelas 6, persiapan ujian sekolah.", "You have 3 back-to-back sessions from 3 pm. The first is with Nadia, grade 6, preparing for school exams."),
      langkah: [
        {
          waktu: "14.50",
          dari: { nama: "Pak Yoga", peran: _("Ayah Nadia", "Nadia's father") },
          kanal: "WhatsApp",
          pesan: _("Kak, maaf, internet di rumah mati. Nadia hanya bisa ikut lewat HP dengan kuota. Tetap bisa les?", "Sorry, our home internet is down. Nadia can only join via phone data. Can we still do the session?"),
          pilihan: [
            { teks: _("\"Bisa, Pak. Saya matikan video dan kirim soal lewat foto supaya hemat kuota.\"", "\"Yes. I'll turn video off and send questions as photos to save data.\""), skor: 2, umpan: _("Fleksibel dan memberi solusi praktis.", "Flexible with a practical solution.") },
            { teks: _("\"Kalau begitu sesi dibatalkan dan tetap dihitung, sesuai kebijakan.\"", "\"Then the session is cancelled and still charged, per policy.\""), skor: 0, umpan: _("Pembatalan bukan dari pihak orang tua secara sengaja. Kaku di situasi seperti ini merusak hubungan.", "It isn't a deliberate cancellation. Rigidity here damages the relationship.") },
            { teks: _("\"Kita undur ke minggu depan saja ya.\"", "\"Let's just move it to next week.\""), skor: 1, umpan: _("Aman, tetapi ujian Nadia sudah dekat dan masih ada cara untuk tetap belajar.", "Safe, but Nadia's exam is near and there's still a way to study.") },
          ],
        },
        {
          waktu: "15.20",
          dari: { nama: "Nadia", peran: _("Murid", "Student") },
          kanal: "Zoom",
          pesan: _("Kak, aku nggak ngerti pecahan. Dari dulu memang nggak bisa matematika.", "I don't get fractions. I've always been bad at maths."),
          pilihan: [
            { teks: _("\"Masa sih, ini gampang kok.\"", "\"Really? This is easy.\""), skor: 0, umpan: _("Menyebut materi \"gampang\" membuat murid yang kesulitan merasa makin bodoh.", "Calling it \"easy\" makes a struggling student feel worse.") },
            { teks: _("\"Banyak yang merasa begitu. Kita coba pakai contoh pizza dulu ya. Kalau satu pizza dibagi 4, kamu ambil 1, itu berapa?\"", "\"Lots of people feel that way. Let's try a pizza example. If a pizza is cut into 4 and you take 1, how much is that?\""), skor: 2, umpan: _("Validasi perasaan, lalu mulai dari contoh konkret yang mudah dibayangkan.", "Validate the feeling, then start from a concrete, easy-to-picture example.") },
            { teks: _("Ulangi penjelasan rumus dari awal dengan lebih lambat", "Repeat the formula explanation more slowly"), skor: 1, umpan: _("Lebih lambat membantu sedikit, tetapi cara yang sama sering tetap tidak berhasil.", "Slower helps a little, but the same approach often still fails.") },
          ],
        },
        {
          waktu: "16.05",
          dari: { nama: _("Admin platform tutor", "Tutor platform admin") },
          kanal: "Email",
          pesan: _("Ada orang tua baru yang ingin les bahasa Inggris untuk anak SMA, 3 kali seminggu. Tertarik? Jadwal yang diminta jam 19.00.", "A new parent wants English tutoring for a high schooler, 3 times a week at 7 pm. Interested?"),
          pilihan: [
            { teks: _("Terima walaupun jam 19.00 sudah terisi sesi lain, nanti diatur", "Accept even though 7 pm is taken; sort it out later"), skor: 0, umpan: _("Jadwal bentrok akan mengecewakan dua keluarga sekaligus.", "A clash will disappoint two families at once.") },
            { teks: _("Cek kalender, tawarkan jam 18.00 atau 20.00 yang masih kosong", "Check your calendar and offer free slots at 6 or 8 pm"), skor: 2, umpan: _("Kamu menjaga komitmen lama sambil membuka peluang baru.", "You keep existing commitments while taking the opportunity.") },
            { teks: _("Tolak karena sudah sibuk", "Decline since you're busy"), skor: 1, umpan: _("Aman, tetapi kamu belum mencoba mencari waktu lain.", "Safe, but you didn't try for another slot.") },
          ],
        },
        {
          waktu: "18.00",
          dari: { nama: "Pak Yoga", peran: _("Ayah Nadia", "Nadia's father") },
          kanal: "WhatsApp",
          pesan: _("Gimana tadi lesnya, Kak?", "How did the session go?"),
          pilihan: [
            { teks: _("\"Bagus, Pak.\"", "\"Good.\""), skor: 1, umpan: _("Orang tua ingin tahu perkembangan yang lebih jelas.", "Parents want clearer progress info.") },
            { teks: _("\"Nadia sudah paham konsep pecahan dengan contoh pizza dan bisa mengerjakan 4 dari 5 soal. Yang masih perlu latihan: menyamakan penyebut. Saya kirim 5 soal untuk latihan 10 menit besok.\"", "\"Nadia now gets fractions through the pizza example and solved 4 of 5 questions. Still needs practice: common denominators. I'm sending 5 questions for 10 minutes of practice tomorrow.\""), skor: 2, umpan: _("Spesifik, jujur, dan memberi tindakan lanjutan yang ringan.", "Specific, honest, with a light follow-up.") },
            { teks: _("\"Nadia masih lemah sekali di matematika.\"", "\"Nadia is still very weak at maths.\""), skor: 0, umpan: _("Tanpa konteks dan solusi, ini membuat orang tua khawatir dan bisa menurunkan semangat anak.", "With no context or plan, this worries parents and can demotivate the child.") },
          ],
        },
      ],
    },
  },

  "career-coach": {
    tugas: [
      {
        dari: { nama: "Fajar", peran: _("Klien, pencari kerja", "Client, job seeker") },
        kanal: "Email",
        tenggat: _("2 hari kerja", "2 working days"),
        revisi: {
          pesan: _("Terima kasih, Kak! Ternyata saya juga mau melamar posisi Data Entry di perusahaan logistik. Apakah poinnya perlu diubah?", "Thanks! I also want to apply for Data Entry at a logistics company. Should the bullets change?"),
          petunjuk: [
            _("Sesuaikan penekanan ke akurasi data, kecepatan, dan tools", "Shift emphasis to data accuracy, speed, and tools"),
            _("Jelaskan bahwa CV sebaiknya disesuaikan untuk setiap jenis posisi", "Explain that CVs should be tailored per role type"),
            _("Tulis versi poin untuk posisi Data Entry", "Write a Data Entry version of the bullets"),
          ],
        },
      },
      {
        dari: { nama: "Sinta", peran: _("Klien, fresh graduate", "Client, fresh graduate") },
        kanal: "WhatsApp",
        tenggat: _("Sebelum interview hari Senin", "Before Monday's interview"),
        revisi: {
          pesan: _("Kak, contohnya bagus, tapi saya belum pernah presentasi bulanan di kantor. Kelemahan saya sebenarnya sering menunda pekerjaan. Boleh dibantu jawaban yang jujur?", "The example is good, but I've never presented monthly at work. My real weakness is procrastination. Can you help with an honest answer?"),
          petunjuk: [
            _("Gunakan kelemahan asli klien, bukan contoh orang lain", "Use the client's real weakness, not someone else's"),
            _("Tunjukkan langkah perbaikan yang nyata dan bisa diceritakan", "Show real, tellable improvement steps"),
            _("Jaga agar jawaban tidak merusak peluang untuk posisi yang dilamar", "Keep it from hurting the client's chances for the role"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Hari kerja sebagai CV reviewer", "A day as a CV reviewer"),
      konteks: _("Kamu menjual paket review CV dan satu sesi mock interview. Hari ini ada 3 klien aktif.", "You sell CV review packages and one mock interview session. You have 3 active clients today."),
      langkah: [
        {
          waktu: "09.10",
          dari: { nama: "Dimas", peran: _("Calon klien", "Prospect") },
          kanal: "Instagram",
          pesan: _("Kak, kalau saya pakai jasa Kakak, dijamin keterima kerja dalam sebulan nggak?", "If I use your service, am I guaranteed a job within a month?"),
          pilihan: [
            { teks: _("\"Dijamin, Kak. Klien saya semua diterima.\"", "\"Guaranteed. All my clients get hired.\""), skor: 0, umpan: _("Janji palsu merusak kepercayaan dan bisa berujung komplain.", "False promises destroy trust and invite complaints.") },
            { teks: _("\"Keputusan ada di perusahaan, jadi saya tidak bisa menjamin. Yang saya bantu: CV yang lebih kuat untuk posisi targetmu dan persiapan interview. Rata-rata klien saya mulai dapat panggilan lebih banyak setelah revisi.\"", "\"Employers decide, so I can't guarantee it. What I help with: a stronger CV for your target role and interview prep. Most clients start getting more calls after the revision.\""), skor: 2, umpan: _("Jujur, jelas soal apa yang kamu bantu, dan tetap meyakinkan.", "Honest, clear about what you do, and still convincing.") },
            { teks: _("\"Tergantung keberuntungan, Kak.\"", "\"It depends on luck.\""), skor: 1, umpan: _("Jujur, tetapi tidak menjelaskan nilai jasamu.", "Honest, but doesn't explain your value.") },
          ],
        },
        {
          waktu: "11.00",
          dari: { nama: "Fajar", peran: _("Klien", "Client") },
          kanal: "Zoom",
          pesan: _("Saya cuma admin biasa, Kak. Nggak ada pencapaian yang bisa ditulis.", "I'm just a regular admin. I don't have any achievements to write."),
          pilihan: [
            { teks: _("\"Kalau begitu kita tulis tugas-tugasmu saja.\"", "\"Then let's just list your duties.\""), skor: 1, umpan: _("CV yang hanya berisi tugas terlihat datar. Pencapaian biasanya ada, hanya perlu digali.", "Duty-only CVs look flat. Achievements usually exist; they just need digging out.") },
            { teks: _("\"Coba ceritakan, laporan apa yang kamu buat setiap minggu, dan apa yang terjadi kalau laporan itu terlambat?\"", "\"Tell me which reports you make weekly, and what happens if they're late?\""), skor: 2, umpan: _("Pertanyaan penggali seperti ini membantu klien menemukan dampak kerjanya.", "Probing questions like this help clients find their impact.") },
            { teks: _("\"Tambahkan saja angka perkiraan, tidak ada yang mengecek.\"", "\"Just add estimated numbers, nobody checks.\""), skor: 0, umpan: _("Angka karangan bisa terbongkar di interview dan merugikan klien.", "Made-up numbers can unravel in interviews and hurt the client.") },
          ],
        },
        {
          waktu: "14.00",
          dari: { nama: "Sinta", peran: _("Klien", "Client") },
          kanal: "Zoom",
          pesan: _("(Saat mock interview) \"Saya orangnya pekerja keras, jujur, dan bisa kerja tim.\"", "(During the mock interview) \"I'm hardworking, honest, and a team player.\""),
          pilihan: [
            { teks: _("Hentikan dan katakan jawabannya salah", "Stop her and say the answer is wrong"), skor: 0, umpan: _("Masukan yang keras di tengah sesi bisa membuat klien kehilangan percaya diri.", "Harsh mid-session feedback can shake the client's confidence.") },
            { teks: _("Biarkan selesai, lalu beri masukan: \"Klaimnya bagus, tapi butuh bukti. Pilih satu sifat dan ceritakan satu kejadian yang membuktikannya.\"", "Let her finish, then: \"Good claims, but they need proof. Pick one trait and tell one story that shows it.\""), skor: 2, umpan: _("Masukan spesifik dan langsung bisa dipraktikkan.", "Specific, immediately usable feedback.") },
            { teks: _("Puji jawabannya agar ia percaya diri", "Praise it to boost confidence"), skor: 1, umpan: _("Percaya diri penting, tetapi tanpa masukan ia akan mengulang jawaban generik di interview asli.", "Confidence matters, but without feedback she'll repeat a generic answer in the real interview.") },
          ],
        },
        {
          waktu: "17.00",
          dari: { nama: "Fajar", peran: _("Klien", "Client") },
          kanal: "WhatsApp",
          pesan: _("Kak, boleh minta revisi CV lagi? Saya mau ganti semua jadi warna biru dan tambah foto.", "Can I get another revision? I want everything in blue and to add a photo."),
          pilihan: [
            { teks: _("Kerjakan tanpa komentar", "Do it without comment"), skor: 1, umpan: _("Permintaan klien dipenuhi, tetapi kamu tidak memberi saran yang bisa membantu peluangnya.", "You complied, but missed advice that could help his chances.") },
            { teks: _("\"Bisa, ini masih termasuk 1 revisi di paketmu. Saran saya: warna boleh untuk judul saja agar tetap mudah dibaca ATS. Foto boleh jika lowongan tidak melarang.\"", "\"Sure, this is within your 1 included revision. My tip: use colour only for headings so ATS reads it well. A photo is fine unless the job ad says otherwise.\""), skor: 2, umpan: _("Kamu melayani sambil memberi saran profesional dan mengingatkan batas paket.", "You helped, gave professional advice, and noted the package limit.") },
            { teks: _("\"Tidak bisa, desain saya sudah benar.\"", "\"No, my design is already right.\""), skor: 0, umpan: _("Kaku dan tidak menghargai preferensi klien.", "Rigid and dismissive of the client's preferences.") },
          ],
        },
      ],
    },
  },

  kurikulum: {
    tugas: [
      {
        dari: { nama: "Pak Bayu", peran: _("Koordinator konten, lembaga bimbel", "Content coordinator, tutoring centre") },
        kanal: "Email",
        tenggat: _("Jumat, 17.00", "Friday, 5 pm"),
        revisi: {
          pesan: _("Soalnya bagus. Revisi dari reviewer: soal nomor 3 terlalu panjang untuk kelas 7, dan kami butuh satu soal tambahan berbentuk gambar atau tabel. Mohon diperbaiki.", "Good questions. Reviewer notes: question 3 is too long for grade 7, and we need one extra question using a picture or table. Please revise."),
          petunjuk: [
            _("Sederhanakan kalimat soal nomor 3 tanpa mengubah konsep yang diuji", "Simplify question 3's wording without changing the concept tested"),
            _("Tambahkan satu soal berbasis tabel atau deskripsi gambar", "Add one question based on a table or image description"),
            _("Sertakan kunci dan pembahasan untuk soal baru", "Include a key and explanation for the new question"),
          ],
        },
      },
      {
        dari: { nama: "Mbak Tia", peran: _("Manajer L&D, perusahaan logistik", "L&D manager, logistics company") },
        kanal: "Email",
        tenggat: _("Senin depan", "Next Monday"),
        revisi: {
          pesan: _("Kerangkanya rapi. Masukan: sebagian besar staf belajar lewat HP saat istirahat, jadi tiap bagian sebaiknya maksimal 10 menit. Bisa disesuaikan?", "Neat outline. Feedback: most staff learn on their phones during breaks, so each part should be 10 minutes max. Can you adjust?"),
          petunjuk: [
            _("Pecah materi menjadi unit-unit maksimal 10 menit", "Split content into units of 10 minutes max"),
            _("Pastikan latihan bisa dikerjakan di HP", "Make sure practice works on phones"),
            _("Pertahankan tujuan pembelajaran yang sama", "Keep the same learning objectives"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Minggu tenggat penulisan soal", "Deadline week for question writing"),
      konteks: _("Kamu menulis 100 soal IPA SMP untuk sebuah platform belajar. Hari ini Rabu, tenggat Jumat. Sudah selesai 70 soal.", "You're writing 100 junior high science questions for a learning platform. It's Wednesday, due Friday. 70 done."),
      langkah: [
        {
          waktu: "08.30",
          dari: { nama: _("Reviewer platform", "Platform reviewer") },
          kanal: "Email",
          pesan: _("Dari 30 soal batch pertama, 4 kunci jawabannya salah. Mohon diperbaiki dan dicek ulang semua.", "Of the first 30 questions, 4 answer keys are wrong. Please fix them and recheck everything."),
          pilihan: [
            { teks: _("Perbaiki 4 soal itu saja lalu lanjut menulis", "Fix those 4 and keep writing"), skor: 1, umpan: _("Jika 4 dari 30 salah, kemungkinan ada kesalahan serupa di batch lain.", "If 4 of 30 are wrong, similar errors likely exist elsewhere.") },
            { teks: _("Perbaiki, cari pola penyebabnya, lalu cek ulang 70 soal dengan pola itu sebelum lanjut", "Fix them, find the cause pattern, then recheck all 70 for it before continuing"), skor: 2, umpan: _("Mencari akar masalah mencegah kesalahan yang sama terulang.", "Finding the root cause stops repeat errors.") },
            { teks: _("Balas bahwa reviewer mungkin salah", "Reply that the reviewer may be wrong"), skor: 0, umpan: _("Tanpa mengecek dulu, ini terdengar defensif dan merusak kepercayaan.", "Without checking first, this sounds defensive and erodes trust.") },
          ],
        },
        {
          waktu: "11.00",
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Waktu makin mepet. Ada situs yang berisi ratusan soal serupa.", "Time is tight. A website has hundreds of similar questions."),
          pilihan: [
            { teks: _("Salin dan ubah sedikit angkanya", "Copy them and tweak the numbers"), skor: 0, umpan: _("Ini pelanggaran hak cipta dan bisa membatalkan kontrakmu.", "That's copyright infringement and can void your contract.") },
            { teks: _("Gunakan sebagai inspirasi topik saja, lalu tulis soal dengan konteks sendiri", "Use it only for topic ideas, then write questions with your own context"), skor: 2, umpan: _("Inspirasi boleh, isi harus orisinal.", "Inspiration is fine; content must be original.") },
            { teks: _("Minta perpanjangan waktu tanpa alasan", "Ask for an extension with no reason"), skor: 1, umpan: _("Meminta tambahan waktu boleh, tetapi jelaskan alasannya dan usulkan tanggal yang jelas.", "Asking is fine, but give a reason and a firm date.") },
          ],
        },
        {
          waktu: "14.00",
          dari: { nama: _("Reviewer platform", "Platform reviewer") },
          kanal: "Email",
          pesan: _("Apakah memungkinkan menambah 20 soal dengan tenggat yang sama? Tarif per soal sama.", "Could you add 20 more questions on the same deadline? Same per-item rate."),
          pilihan: [
            { teks: _("Terima semua", "Accept all"), skor: 0, umpan: _("Dengan 30 soal tersisa dan revisi tadi, kualitas hampir pasti turun.", "With 30 left and the revisions, quality would almost certainly drop.") },
            { teks: _("\"Untuk Jumat saya fokus menuntaskan 100 soal dengan kualitas terjaga. Tambahan 20 soal bisa saya kirim Selasa depan.\"", "\"For Friday I'll focus on finishing 100 with quality. The extra 20 can come next Tuesday.\""), skor: 2, umpan: _("Kamu menjaga kualitas dan tetap mengambil peluang.", "You protect quality and still take the work.") },
            { teks: _("Tolak tanpa alternatif", "Decline with no alternative"), skor: 1, umpan: _("Aman, tetapi kamu kehilangan tambahan pekerjaan yang sebenarnya bisa diatur.", "Safe, but you lose work that could have been arranged.") },
          ],
        },
        {
          waktu: "Jumat 16.00",
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("100 soal selesai. Saatnya mengirim.", "100 questions done. Time to submit."),
          pilihan: [
            { teks: _("Kirim dengan catatan: daftar soal yang direvisi, penyebab kesalahan sebelumnya, dan cara kamu mencegahnya", "Submit with a note: revised items, the cause of earlier errors, and how you prevented them"), skor: 2, umpan: _("Catatan seperti ini menunjukkan profesionalisme dan memudahkan reviewer.", "A note like this shows professionalism and helps the reviewer.") },
            { teks: _("Kirim file tanpa pesan", "Send the file with no message"), skor: 1, umpan: _("Pekerjaan selesai, tetapi reviewer tidak tahu apa yang sudah diperbaiki.", "Done, but the reviewer doesn't know what changed.") },
            { teks: _("Kirim tanpa cek akhir agar tidak terlambat, padahal masih ada 1 jam", "Submit without a final check to be safe, though an hour remains"), skor: 0, umpan: _("Masih ada waktu untuk cek kunci jawaban, padahal itu masalah utama minggu ini.", "There was time to check keys, the week's main problem.") },
          ],
        },
      ],
    },
  },
};
