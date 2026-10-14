import { t as _ } from "../../i18n.js";

/** Cara lolos seleksi dan gambaran kerja: kategori Pendidikan & Konsultasi. */
export default {
  "tutor-online": {
    kerja: {
      hari: [
        { jam: "13.00", isi: _("Siapkan materi untuk sesi sore: soal latihan, slide singkat, dan catatan perkembangan tiap murid dari sesi sebelumnya.", "Prep for afternoon sessions: practice questions, short slides, and each student's notes from last time.") },
        { jam: "15.00", isi: _("Sesi 1 (60 menit) lewat Zoom atau Google Meet: pemanasan, penjelasan, latihan bersama, dan cek pemahaman.", "Session 1 (60 minutes) on Zoom or Google Meet: warm-up, explanation, guided practice, and a check for understanding.") },
        { jam: "16.15", isi: _("Tulis catatan singkat sesi dan kirim PR atau ringkasan ke murid atau orang tua.", "Write a short session note and send homework or a summary to the student or parent.") },
        { jam: "16.30", isi: _("Sesi 2 dan 3, sering dengan jenjang atau mata pelajaran berbeda.", "Sessions 2 and 3, often different levels or subjects.") },
        { jam: "19.30", isi: _("Balas pesan orang tua, atur ulang jadwal yang berubah, dan periksa PR yang masuk.", "Reply to parents, reschedule changes, and check submitted homework.") },
      ],
      dinilai: [
        _("Kemajuan nilai atau kemampuan murid", "Progress in the student's grades or skills"),
        _("Murid tetap berlangganan dan merekomendasikanmu", "Students keep booking and recommend you"),
        _("Ulasan dan rating di platform", "Reviews and ratings on the platform"),
        _("Ketepatan waktu dan komunikasi dengan orang tua", "Punctuality and communication with parents"),
      ],
      tantangan: [
        { judul: _("Murid kurang fokus di layar", "Students losing focus on screen"), isi: _("Buat sesi interaktif: minta murid menulis di papan tulis digital, beri soal singkat setiap 10 menit, dan gunakan contoh dari kehidupannya.", "Make sessions interactive: have them write on a digital whiteboard, give a quick question every 10 minutes, and use examples from their life.") },
        { judul: _("Pembatalan mendadak", "Last-minute cancellations"), isi: _("Tulis kebijakan pembatalan sejak awal, misalnya minimal 12 jam sebelumnya, dan sesi yang dibatalkan mendadak tetap dihitung.", "Set a cancellation policy upfront, such as 12 hours' notice, with late cancellations still charged.") },
        { judul: _("Jadwal sore dan malam yang padat", "Packed afternoon and evening schedules"), isi: _("Kebanyakan murid sekolah hanya bisa sore hari. Kelompokkan sesi di jam yang sama dan sisakan pagi untuk persiapan.", "Most school students are only free in the afternoon. Batch sessions and keep mornings for prep.") },
      ],
      jenjang: _("Tutor yang punya reputasi baik bisa menaikkan tarif, membuka kelas kelompok, membuat kursus rekaman sendiri, atau menjadi pengembang kurikulum dan penulis soal untuk lembaga bimbel dan platform belajar.", "Well-reviewed tutors can raise rates, run group classes, create recorded courses, or move into curriculum and question writing for tutoring centres and learning platforms."),
    },
    lolos: {
      alur: [
        _("Daftar di platform tutor dan lengkapi profil", "Sign up with a tutoring platform and complete your profile"),
        _("Tes penguasaan mata pelajaran (pilihan ganda atau esai)", "Subject knowledge test (multiple choice or essay)"),
        _("Video perkenalan atau rekaman mengajar singkat", "An intro video or short teaching recording"),
        _("Demo mengajar langsung dengan tim penilai", "A live teaching demo with assessors"),
        _("Profil aktif, lalu murid pertama datang dari platform atau rekomendasi", "Profile goes live; first students come via the platform or referrals"),
      ],
      portofolio: [
        _("Video perkenalan 1 sampai 2 menit yang jelas suara dan cahayanya", "A 1 to 2-minute intro video with clear sound and lighting"),
        _("Contoh materi atau lembar latihan yang kamu buat", "Sample materials or worksheets you made"),
        _("Bukti kemampuan: ijazah, sertifikat, atau skor tes bahasa", "Proof of skill: degree, certificates, or language test scores"),
        _("Testimoni murid atau orang tua", "Student or parent testimonials"),
      ],
      tes: _("Biasanya ada dua bagian: tes materi untuk memastikan penguasaanmu, lalu demo mengajar 10 sampai 15 menit. Di demo, penilai melihat apakah kamu memeriksa pemahaman murid, menjelaskan dengan contoh, dan membuat suasana nyaman, bukan hanya menyampaikan materi.", "Usually two parts: a subject test, then a 10 to 15-minute teaching demo. In the demo, assessors look at whether you check understanding, explain with examples, and create a comfortable atmosphere, not just deliver content."),
      pertanyaan: [
        { q: _("Bagaimana kamu mengajar murid yang lambat memahami?", "How do you teach a student who's slow to understand?"), jawab: _("Jelaskan pendekatanmu: cari dulu letak kesulitannya, pecah materi menjadi langkah kecil, dan beri contoh yang dekat dengan kehidupannya.", "Explain your approach: find the gap, break content into small steps, and use relatable examples.") },
        { q: _("Bagaimana kamu tahu murid benar-benar paham?", "How do you know a student really understands?"), jawab: _("Sebut cara konkret seperti meminta murid menjelaskan ulang atau mengerjakan soal baru tanpa bantuan.", "Name concrete checks like having them explain it back or solve a new problem unaided.") },
        { q: _("Bagaimana berkomunikasi dengan orang tua?", "How do you communicate with parents?"), jawab: _("Ceritakan bahwa kamu memberi laporan rutin yang singkat, jujur soal kesulitan, dan menyarankan apa yang bisa dibantu di rumah.", "Say you send short regular reports, are honest about difficulties, and suggest how they can help at home.") },
      ],
      kesalahan: [
        _("Video perkenalan gelap, berisik, atau terlalu panjang", "Dark, noisy, or overly long intro videos"),
        _("Demo mengajar yang hanya ceramah tanpa interaksi", "Demo lessons that are all lecture, no interaction"),
        _("Mematok harga terlalu tinggi sebelum ada ulasan", "Pricing too high before having reviews"),
        _("Tidak menyiapkan perangkat dan koneksi cadangan", "No backup device or connection"),
      ],
    },
  },

  "career-coach": {
    kerja: {
      hari: [
        { jam: "09.00", isi: _("Baca CV dan lowongan target klien yang masuk, catat 5 masalah terbesar sebelum mulai menulis ulang.", "Read incoming client CVs and target job ads, noting the 5 biggest issues before rewriting.") },
        { jam: "10.00", isi: _("Sesi konsultasi 45 menit lewat Zoom: menggali pencapaian klien dengan pertanyaan terarah.", "45-minute Zoom consultation: drawing out the client's achievements with targeted questions.") },
        { jam: "11.00", isi: _("Tulis ulang CV dan profil LinkedIn, lalu cek keterbacaan ATS.", "Rewrite the CV and LinkedIn profile, then check ATS readability.") },
        { jam: "14.00", isi: _("Mock interview untuk klien lain, direkam (dengan izin) supaya klien bisa melihat ulang.", "Mock interview for another client, recorded (with consent) for review.") },
        { jam: "16.00", isi: _("Kirim catatan masukan tertulis dan buat konten tips karier untuk LinkedIn atau Instagram.", "Send written feedback and create career tips content for LinkedIn or Instagram.") },
      ],
      dinilai: [
        _("Klien mendapat lebih banyak panggilan interview setelah CV diperbaiki", "Clients get more interview calls after CV changes"),
        _("Kepuasan dan testimoni klien", "Client satisfaction and testimonials"),
        _("Kecepatan penyelesaian sesuai paket", "Turnaround within the package timeline"),
        _("Rekomendasi dari klien lama", "Referrals from past clients"),
      ],
      tantangan: [
        { judul: _("Klien berharap pasti diterima", "Clients expecting guaranteed hires"), isi: _("Jelaskan sejak awal apa yang bisa kamu bantu (CV, persiapan, strategi) dan apa yang di luar kendali (keputusan perusahaan).", "Explain upfront what you can help with (CV, prep, strategy) and what's outside your control (employer decisions).") },
        { judul: _("Klien sulit menyebut pencapaian", "Clients who can't name achievements"), isi: _("Gunakan pertanyaan penggali: apa yang berubah setelah kamu mengerjakannya, berapa banyak, seberapa cepat, siapa yang terbantu.", "Ask probing questions: what changed after your work, how many, how fast, who benefited.") },
        { judul: _("Pendapatan tidak stabil", "Irregular income"), isi: _("Bangun aliran klien lewat konten rutin dan kerja sama dengan kampus, komunitas, atau perusahaan untuk pelatihan kelompok.", "Build a client pipeline via regular content and partnerships with campuses, communities, or companies for group training.") },
      ],
      jenjang: _("Dari reviewer CV, kamu bisa berkembang menjadi career coach dengan program beberapa sesi, trainer persiapan kerja untuk kampus dan perusahaan, atau konsultan rekrutmen.", "From CV reviewer you can grow into a career coach with multi-session programs, a job-readiness trainer for campuses and companies, or a recruitment consultant."),
    },
    lolos: {
      alur: [
        _("Bangun kredibilitas lewat konten tips karier dan profil LinkedIn yang kuat", "Build credibility with career tips content and a strong LinkedIn profile"),
        _("Tawarkan jasa di marketplace atau langsung lewat media sosial", "Offer services on marketplaces or directly via social media"),
        _("Konsultasi singkat gratis atau berbayar murah untuk calon klien", "A short free or low-cost discovery call for prospects"),
        _("Untuk kerja sama dengan lembaga: presentasi program dan contoh materi", "For institutional work: a program pitch and sample materials"),
      ],
      portofolio: [
        _("Contoh CV sebelum dan sesudah (data klien disamarkan, dengan izin)", "Before-and-after CVs (anonymised, with consent)"),
        _("Testimoni klien yang menyebut hasilnya", "Client testimonials mentioning outcomes"),
        _("Konten tips karier yang konsisten", "Consistent career tips content"),
        _("Pengalaman rekrutmen: berapa banyak CV yang pernah kamu saring atau interview yang kamu lakukan", "Recruiting experience: how many CVs you've screened or interviews you've run"),
      ],
      tes: _("Jarang ada tes formal. Calon klien menilai dari contoh hasil kerja dan cara kamu mendiagnosis CV mereka di sesi pertama. Lembaga yang mengajak kerja sama biasanya meminta demo sesi pelatihan 15 sampai 30 menit.", "Formal tests are rare. Prospects judge your samples and how you diagnose their CV in the first call. Institutions usually ask for a 15 to 30-minute training demo."),
      pertanyaan: [
        { q: _("Apa bedanya jasa kamu dengan template CV gratis?", "How is your service different from free CV templates?"), jawab: _("Jelaskan bahwa kamu menyesuaikan isi dengan lowongan target dan menggali pencapaian, bukan hanya merapikan tampilan.", "Explain you tailor content to target roles and draw out achievements, not just tidy the layout.") },
        { q: _("Dari mana kamu tahu apa yang dicari rekruter?", "How do you know what recruiters want?"), jawab: _("Sebut pengalaman nyata, misalnya pernah bekerja di HR, menyaring CV, atau mewawancarai kandidat.", "Cite real experience such as HR work, screening CVs, or interviewing candidates.") },
        { q: _("Berapa lama prosesnya?", "How long does it take?"), jawab: _("Beri jadwal jelas per tahap: sesi penggalian, draf, revisi, dan hasil akhir.", "Give clear timing per stage: discovery, draft, revisions, final.") },
      ],
      kesalahan: [
        _("Menjanjikan pasti diterima kerja", "Promising guaranteed jobs"),
        _("CV hasil perbaikan yang terlihat sama untuk semua klien", "Rewritten CVs that all look the same"),
        _("Profil LinkedIn sendiri yang tidak terawat", "A neglected LinkedIn profile of your own"),
        _("Tidak meminta izin sebelum memakai CV klien sebagai contoh", "Using client CVs as samples without consent"),
      ],
    },
  },

  kurikulum: {
    kerja: {
      hari: [
        { jam: "08.00", isi: _("Baca kisi-kisi dan target proyek: jumlah soal, jenjang, sebaran materi, dan level kesulitan.", "Read the blueprint and targets: question count, level, topic spread, and difficulty.") },
        { jam: "09.00", isi: _("Tulis soal dalam satu sesi fokus, sekitar 10 sampai 15 soal per jam untuk pilihan ganda dengan pembahasan.", "Write questions in a focused block, about 10 to 15 multiple-choice questions with explanations per hour.") },
        { jam: "13.00", isi: _("Cek ulang kunci jawaban dan hitungan, pastikan pengecoh masuk akal dan tidak ada dua jawaban benar.", "Recheck keys and calculations, ensure distractors are plausible and no question has two right answers.") },
        { jam: "15.00", isi: _("Tanggapi masukan editor atau reviewer dari batch sebelumnya dan perbaiki soal yang ditandai.", "Address editor or reviewer feedback on the previous batch and fix flagged items.") },
        { jam: "16.30", isi: _("Unggah batch ke sistem klien dan catat progres untuk tagihan per soal atau per modul.", "Upload the batch to the client's system and log progress for per-item or per-module billing.") },
      ],
      dinilai: [
        _("Akurasi kunci jawaban dan pembahasan", "Accuracy of answer keys and explanations"),
        _("Kesesuaian dengan kurikulum atau kisi-kisi", "Alignment with curriculum or blueprint"),
        _("Jumlah soal yang lolos review tanpa revisi", "Share of items passing review without changes"),
        _("Ketepatan target jumlah dan tenggat", "Meeting volume targets and deadlines"),
      ],
      tantangan: [
        { judul: _("Target jumlah yang besar", "High volume targets"), isi: _("Gunakan template soal per tipe dan kisi-kisi yang jelas agar kecepatan naik tanpa mengorbankan kualitas.", "Use item templates per type and a clear blueprint to raise speed without losing quality.") },
        { judul: _("Kurikulum yang berubah", "Changing curricula"), isi: _("Ikuti dokumen resmi terbaru dan catat sumber untuk setiap materi agar mudah diperbarui.", "Follow the latest official documents and note sources per topic so updates are easy.") },
        { judul: _("Hak cipta soal", "Question copyright"), isi: _("Jangan menyalin soal dari buku atau situs lain. Buat soal orisinal dan biasakan menulis konteks sendiri.", "Never copy questions from books or sites. Write originals with your own contexts.") },
      ],
      jenjang: _("Penulis soal bisa naik menjadi reviewer atau editor konten, instructional designer untuk e-learning perusahaan, atau koordinator kurikulum di platform pendidikan.", "Question writers can become reviewers or content editors, instructional designers for corporate e-learning, or curriculum coordinators at education platforms."),
    },
    lolos: {
      alur: [
        _("Lamar ke lembaga bimbel, penerbit, atau platform belajar", "Apply to tutoring centres, publishers, or learning platforms"),
        _("Tes menulis soal sesuai kisi-kisi yang diberikan", "A question-writing test against a given blueprint"),
        _("Review hasil tes oleh editor senior", "Senior editor review of your test"),
        _("Kontrak per proyek dengan target jumlah soal atau modul", "Per-project contract with question or module targets"),
      ],
      portofolio: [
        _("10 sampai 20 soal orisinal dengan pembahasan, dari mudah sampai sulit", "10 to 20 original questions with explanations, easy to hard"),
        _("Satu modul ajar singkat dengan tujuan pembelajaran", "One short teaching module with learning objectives"),
        _("Latar belakang pendidikan atau pengalaman mengajar yang relevan", "Relevant education or teaching background"),
      ],
      tes: _("Kamu biasanya diberi kisi-kisi dan diminta menulis 5 sampai 10 soal dalam beberapa hari. Penilai mengecek kebenaran konsep, kejelasan bahasa, kualitas pengecoh, dan kesesuaian level. Satu kunci jawaban yang salah sering langsung membuat gagal.", "You're usually given a blueprint and asked to write 5 to 10 questions over a few days. Reviewers check concept accuracy, clarity, distractor quality, and level fit. A single wrong key often means a fail."),
      pertanyaan: [
        { q: _("Bagaimana kamu memastikan soal tidak ambigu?", "How do you make sure questions aren't ambiguous?"), jawab: _("Sebut proses cek: membaca ulang sebagai siswa, memastikan hanya satu jawaban benar, dan meminta orang lain mencoba.", "Describe your checks: rereading as a student, ensuring one right answer, and having someone else try it.") },
        { q: _("Berapa soal yang bisa kamu tulis per minggu?", "How many questions can you write a week?"), jawab: _("Beri angka realistis untuk tipe soal tertentu dan sebutkan bahwa kualitas tetap prioritas.", "Give a realistic number per item type and stress quality comes first.") },
        { q: _("Bagaimana kamu menulis soal HOTS?", "How do you write higher-order thinking questions?"), jawab: _("Jelaskan bahwa soal HOTS memakai konteks baru dan meminta analisis atau penerapan, bukan hafalan, lalu beri contoh singkat.", "Explain these use new contexts and ask for analysis or application, not recall, with a quick example.") },
      ],
      kesalahan: [
        _("Kunci jawaban salah atau hitungan keliru", "Wrong keys or calculation errors"),
        _("Menyalin soal dari sumber lain", "Copying questions from other sources"),
        _("Pengecoh yang jelas-jelas salah", "Obviously wrong distractors"),
        _("Tidak mengikuti format yang diminta", "Ignoring the requested format"),
      ],
    },
  },
};
