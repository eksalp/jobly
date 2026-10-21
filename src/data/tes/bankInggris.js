/**
 * Bank soal Bahasa Inggris untuk dunia kerja (setara TOEIC/TOEFL ITP).
 * Jawaban benar SELALU di indeks 0 (diacak saat tes dibuat).
 * Pembahasan dalam bahasa Indonesia supaya mudah dipahami.
 */

const STR = "Structure";
const ERR = "Error recognition";
const VOC = "Vocabulary";
const READ = "Reading";
const BIZ = "Business communication";

const PASSAGE_1 = `To: All Staff
Subject: New Expense Reimbursement Policy

Starting 1 November, all expense claims must be submitted through the FinTrack app within 14 days of the purchase date. Claims submitted after this period will not be processed unless approved in writing by a department head. Receipts must be photographed clearly; handwritten receipts are accepted only for transport costs under Rp100,000. Reimbursements will be transferred every second and fourth Friday of the month. Please contact the finance team at ext. 204 if you have any questions.`;

const PASSAGE_2 = `Many companies believe that offering higher salaries is the most effective way to retain employees. However, a recent study of 3,000 workers in Southeast Asia found that career development opportunities were cited as the top reason for staying with an employer, followed by flexible working arrangements. Salary ranked third. Interestingly, employees under 30 placed even greater weight on learning opportunities, while those over 40 valued job security more than any other factor. The researchers concluded that a one-size-fits-all retention strategy is likely to fail.`;

export const BANK_INGGRIS = [
  // ---------------------------------------------------------- structure
  { b: STR, q: "The quarterly report ______ to the board before the meeting starts.", o: ["must be sent", "must send", "must sending", "must to send"], e: "Laporan tidak mengirim dirinya sendiri, jadi butuh bentuk PASIF: modal + be + V3 → must be sent." },
  { b: STR, q: "If the client ______ the contract yesterday, we would have started the project today.", o: ["had signed", "signed", "has signed", "would sign"], e: "Conditional tipe 3 (pengandaian masa lalu): If + had + V3, ... would have + V3. Kata 'yesterday' dan 'would have started' menandai tipe 3." },
  { b: STR, q: "Neither the manager nor the staff members ______ aware of the change.", o: ["were", "was", "is", "has been"], e: "Pada 'neither ... nor ...', kata kerja mengikuti subjek TERDEKAT. Subjek terdekat 'staff members' jamak → were." },
  { b: STR, q: "She has worked at the company ______ 2019.", o: ["since", "for", "from", "during"], e: "'Since' dipakai untuk titik waktu awal (2019); 'for' untuk lamanya waktu (for five years)." },
  { b: STR, q: "The candidate ______ CV impressed the panel was invited to a second interview.", o: ["whose", "who", "whom", "which"], e: "'Whose' menunjukkan kepemilikan: kandidat yang CV-NYA mengesankan. 'Who' tidak bisa diikuti kata benda milik." },
  { b: STR, q: "By the time we arrive, the presentation ______.", o: ["will have started", "will start", "has started", "starts"], e: "Future perfect (will have + V3) untuk kejadian yang SUDAH selesai sebelum titik waktu di masa depan (saat kami tiba)." },
  { b: STR, q: "We look forward to ______ from you soon.", o: ["hearing", "hear", "heard", "be heard"], e: "'Look forward to' diikuti gerund (V-ing) karena 'to' di sini adalah preposisi, bukan bagian dari infinitive." },
  { b: STR, q: "The new software is ______ than the old one.", o: ["much more efficient", "more efficienter", "most efficient", "very more efficient"], e: "Kata sifat panjang memakai 'more + adj'; penguat untuk perbandingan adalah 'much', bukan 'very'." },
  { b: STR, q: "______ the heavy traffic, the team arrived on time.", o: ["Despite", "Although", "Because", "However"], e: "'Despite' diikuti kata benda/frasa benda (the heavy traffic). 'Although' harus diikuti klausa lengkap (although the traffic was heavy)." },
  { b: STR, q: "The manager asked me ______ the files by Friday.", o: ["to finish", "finishing", "finish", "finished"], e: "Pola 'ask someone TO do something'." },
  { b: STR, q: "Not only ______ the target, but they also exceeded it by 20%.", o: ["did they meet", "they met", "they did meet", "met they"], e: "Setelah 'Not only' di awal kalimat, terjadi INVERSI: auxiliary + subject + verb → did they meet." },
  { b: STR, q: "It is essential that every employee ______ the safety training.", o: ["complete", "completes", "completed", "is completing"], e: "Setelah 'It is essential/important that', dipakai bentuk subjunctive: kata kerja dasar tanpa -s (complete)." },
  { b: STR, q: "The meeting, ______ was scheduled for Monday, has been postponed.", o: ["which", "that", "what", "who"], e: "Klausa non-defining (diapit koma) memakai 'which' untuk benda. 'That' tidak boleh dipakai setelah koma." },
  { b: STR, q: "Hardly ______ the office when it started to rain.", o: ["had I left", "I had left", "did I leave", "I left"], e: "'Hardly ... when' di awal kalimat diikuti inversi past perfect: had + subject + V3." },
  { b: STR, q: "There are ______ applicants this year than last year.", o: ["fewer", "less", "little", "least"], e: "'Applicants' dapat dihitung (countable), jadi memakai 'fewer'. 'Less' untuk benda tak terhitung." },

  // ---------------------------------------------------------- error
  { b: ERR, q: "Pilih bagian yang SALAH: \"Each of the employees (A) have (B) received (C) their bonus (D) last week.\"", o: ["B: have", "A: Each of the employees", "C: received", "D: their bonus"], e: "'Each of ...' bersifat tunggal, jadi kata kerjanya 'has'. Selain itu, karena ada 'last week', bentuk yang lebih tepat adalah 'received' (past simple). Bagian yang salah adalah 'have'." },
  { b: ERR, q: "Pilih bagian yang SALAH: \"The informations (A) you sent (B) were very (C) useful for (D) our team.\"", o: ["A: informations", "B: you sent", "C: very", "D: for"], e: "'Information' adalah uncountable noun, tidak memakai -s. Yang benar: 'The information you sent was very useful'." },
  { b: ERR, q: "Pilih bagian yang SALAH: \"She is responsible (A) of managing (B) the budget and (C) reporting (D) to the director.\"", o: ["A: responsible of", "B: managing", "C: and", "D: reporting"], e: "Ungkapan yang benar adalah 'responsible FOR', bukan 'responsible of'." },
  { b: ERR, q: "Pilih bagian yang SALAH: \"Despite (A) of the delay, the project (B) was completed (C) within (D) budget.\"", o: ["A: Despite of", "B: the project", "C: was completed", "D: within"], e: "'Despite' tidak diikuti 'of'. Yang benar: 'Despite the delay' atau 'In spite of the delay'." },
  { b: ERR, q: "Pilih bagian yang SALAH: \"We discussed about (A) the proposal (B) during (C) yesterday's (D) meeting.\"", o: ["A: discussed about", "B: the proposal", "C: during", "D: yesterday's"], e: "'Discuss' adalah kata kerja transitif; langsung diikuti objek tanpa 'about'. Yang benar: 'We discussed the proposal'." },
  { b: ERR, q: "Pilih bagian yang SALAH: \"The number (A) of complaints have (B) decreased significantly (C) since (D) March.\"", o: ["B: have", "A: The number", "C: significantly", "D: since"], e: "'The number of ...' bersifat tunggal → 'has decreased'. Bandingkan dengan 'A number of complaints have...' yang jamak." },
  { b: ERR, q: "Pilih bagian yang SALAH: \"If I would know (A) the answer, I would tell (B) you right away (C), but I don't (D).\"", o: ["A: would know", "B: would tell", "C: right away", "D: don't"], e: "Pada conditional tipe 2, klausa 'if' memakai past simple: 'If I knew the answer...'. 'Would' tidak dipakai di klausa 'if'." },
  { b: ERR, q: "Pilih bagian yang SALAH: \"The staffs (A) were asked (B) to attend (C) the training (D) on Monday.\"", o: ["A: The staffs", "B: were asked", "C: to attend", "D: the training"], e: "'Staff' adalah kata benda kolektif; tidak ditambah -s untuk menyatakan jamak. Gunakan 'the staff' atau 'the staff members'." },

  // ---------------------------------------------------------- vocabulary
  { b: VOC, q: "The company decided to POSTPONE the launch. The word 'postpone' is closest in meaning to…", o: ["delay", "cancel", "announce", "speed up"], e: "Postpone = menunda (delay). Cancel berarti membatalkan sama sekali." },
  { b: VOC, q: "Our supplier is very RELIABLE. 'Reliable' means…", o: ["dependable", "expensive", "flexible", "famous"], e: "Reliable = dapat diandalkan (dependable)." },
  { b: VOC, q: "Please make sure the data is ACCURATE. The closest meaning is…", o: ["correct", "complete", "current", "confidential"], e: "Accurate = tepat/benar (correct). Complete berarti lengkap, current berarti terbaru." },
  { b: VOC, q: "The manager will ALLOCATE the budget next week. 'Allocate' means…", o: ["distribute for a purpose", "reduce", "approve", "calculate"], e: "Allocate = mengalokasikan, membagikan untuk tujuan tertentu." },
  { b: VOC, q: "Choose the best word: \"We need to ______ our costs to stay competitive.\"", o: ["reduce", "rise", "raise up", "grow"], e: "Biaya perlu dikurangi (reduce) agar kompetitif. 'Rise' adalah intransitif (tidak punya objek); 'raise up' berlebihan dan maknanya berlawanan." },
  { b: VOC, q: "Choose the best word: \"The new policy will take ______ on 1 January.\"", o: ["effect", "affect", "effort", "efficiency"], e: "Ungkapan baku 'take effect' = mulai berlaku. 'Affect' adalah kata kerja (memengaruhi)." },
  { b: VOC, q: "Choose the best word: \"She was ______ to the position of senior analyst.\"", o: ["promoted", "advanced up", "lifted", "graduated"], e: "Naik jabatan dalam bahasa Inggris adalah 'be promoted to'." },
  { b: VOC, q: "A 'deadline' is…", o: ["the latest time by which something must be finished", "a cancelled project", "a line on a chart", "a document signed by a director"], e: "Deadline = batas waktu terakhir penyelesaian." },

  // ---------------------------------------------------------- reading
  { b: READ, bacaan: PASSAGE_1, q: "What is the main purpose of the email?", o: ["To inform staff about new rules for expense claims", "To announce a salary increase", "To introduce the finance team", "To ask staff to download a new app for attendance"], e: "Seluruh isi email membahas aturan baru pengajuan klaim biaya (reimbursement)." },
  { b: READ, bacaan: PASSAGE_1, q: "An employee bought supplies on 3 November. What is the last day to submit the claim without special approval?", o: ["17 November", "14 November", "30 November", "3 December"], e: "Batasnya 14 hari sejak tanggal pembelian: 3 + 14 = 17 November." },
  { b: READ, bacaan: PASSAGE_1, q: "Which receipt would be accepted?", o: ["A handwritten receipt for a Rp75,000 taxi ride", "A handwritten receipt for a Rp250,000 lunch", "A blurry photo of a hotel receipt", "A handwritten receipt for Rp150,000 of stationery"], e: "Kuitansi tulisan tangan HANYA diterima untuk transport di bawah Rp100.000. Taksi Rp75.000 memenuhi syarat; foto buram tidak diterima karena foto harus jelas." },
  { b: READ, bacaan: PASSAGE_1, q: "What can be inferred about late claims?", o: ["They can still be processed with written approval from a department head", "They are always rejected", "They are paid on the last Friday of the month", "They must be submitted in person"], e: "Email menyebut klaim terlambat tidak diproses KECUALI disetujui tertulis oleh kepala departemen." },
  { b: READ, bacaan: PASSAGE_1, q: "The word 'processed' in the email is closest in meaning to…", o: ["handled", "rejected", "printed", "delayed"], e: "Processed = diproses/ditangani (handled)." },
  { b: READ, bacaan: PASSAGE_2, q: "According to the passage, what was the most common reason employees stayed with an employer?", o: ["Career development opportunities", "Higher salaries", "Flexible working arrangements", "Job security"], e: "Teks menyebut career development opportunities sebagai alasan teratas, disusul fleksibilitas; gaji di urutan ketiga." },
  { b: READ, bacaan: PASSAGE_2, q: "Which group valued job security the most?", o: ["Employees over 40", "Employees under 30", "All employees equally", "Managers only"], e: "'Those over 40 valued job security more than any other factor.'" },
  { b: READ, bacaan: PASSAGE_2, q: "What does the phrase 'one-size-fits-all' suggest?", o: ["A single approach applied to everyone", "A strategy based on salary only", "A flexible policy for each worker", "A short-term solution"], e: "One-size-fits-all = satu pendekatan yang sama untuk semua orang. Peneliti menyimpulkan pendekatan seperti itu cenderung gagal karena kebutuhan tiap kelompok usia berbeda." },
  { b: READ, bacaan: PASSAGE_2, q: "Which statement would the researchers MOST likely agree with?", o: ["Retention programmes should be adjusted to different employee groups", "Raising salaries is the best retention strategy", "Younger employees do not care about salary", "Flexible work is the least important factor"], e: "Kesimpulan peneliti: strategi seragam akan gagal, jadi program perlu disesuaikan per kelompok. Teks tidak menyatakan karyawan muda tidak peduli gaji." },
  { b: READ, bacaan: PASSAGE_2, q: "The word 'cited' in the passage is closest in meaning to…", o: ["mentioned", "rejected", "measured", "invented"], e: "Cited = disebutkan (mentioned) sebagai alasan." },

  // ---------------------------------------------------------- business
  { b: BIZ, q: "Which is the most appropriate opening for a formal email to a client you have never met?", o: ["Dear Ms. Tan,", "Hey Tan!", "Yo Ms. Tan,", "To whom it may concern Tan,"], e: "Email formal kepada orang yang belum dikenal memakai 'Dear + Mr./Ms. + nama belakang'. 'To whom it may concern' dipakai bila nama penerima tidak diketahui, dan tidak diikuti nama." },
  { b: BIZ, q: "Which sentence is the most polite way to ask for a deadline extension?", o: ["Would it be possible to extend the deadline to Friday?", "Give me more time until Friday.", "I need the deadline changed to Friday.", "You must extend the deadline."], e: "Bentuk 'Would it be possible to...?' sopan dan profesional. Pilihan lain bernada perintah." },
  { b: BIZ, q: "In an interview, which answer best responds to \"Tell me about yourself\"?", o: ["I'm a marketing graduate with two years of experience in digital campaigns, and I'm excited to bring that to a growing brand like yours.", "I was born in 1999 and I like football.", "I need this job because I have bills to pay.", "Everything is on my CV."], e: "Jawaban ideal singkat, relevan dengan pekerjaan: latar belakang, pengalaman, dan alasan cocok dengan posisi." },
  { b: BIZ, q: "\"Please find attached the revised proposal.\" This sentence is used to…", o: ["tell the reader a document is included with the email", "ask the reader to search for a missing file", "request a new proposal", "reject a proposal"], e: "Ungkapan baku dalam email untuk memberi tahu bahwa ada lampiran." },
];

export const TIPS_INGGRIS = [
  "Structure: cari dulu subjek dan kata kerja utama. Banyak soal menguji kesesuaian subjek–kata kerja (each, the number of, neither...nor).",
  "Kenali pola tetap: look forward to + V-ing, responsible for, take effect, despite + noun, discuss (tanpa about).",
  "Conditional: tipe 2 = If + past, would + V1; tipe 3 = If + had V3, would have V3.",
  "Error recognition: baca kalimat utuh dulu, lalu periksa tiap bagian bergaris. Biasanya hanya satu kesalahan tata bahasa.",
  "Reading: baca pertanyaan lebih dulu, lalu cari kata kuncinya di teks. Untuk soal inference, jawaban harus didukung teks, bukan pendapat sendiri.",
  "Vocabulary: tebak dari konteks kalimat, lalu cek apakah pilihanmu tetap masuk akal jika menggantikan kata aslinya.",
];
