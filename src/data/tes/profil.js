/**
 * Tes profil (tidak ada jawaban benar/salah):
 *   • DISC   — 24 kelompok kata, pilih yang PALING dan PALING TIDAK menggambarkan dirimu
 *   • EPPS   — gaya Edwards Personal Preference Schedule: pilih satu dari dua pernyataan
 *   • 16 tipe — gaya MBTI: empat dimensi preferensi, hasil berupa salah satu dari 16 tipe
 *
 * Ini latihan untuk mengenal format dan profil diri. Bukan alat tes
 * resmi (DISC, EPPS, dan MBTI resmi diadministrasikan psikolog/lembaga
 * berlisensi), jadi hasilnya bukan diagnosis.
 */

/* =============================================================== DISC */

export const DISC_DIMENSI = {
  D: {
    nama: "Dominance",
    singkat: "Tegas & berorientasi hasil",
    ket: "Cepat mengambil keputusan, menyukai tantangan, dan fokus pada target. Di tim sering menjadi penggerak. Perlu menjaga kesabaran dan mendengarkan pendapat orang lain.",
    cocok: "Sales, manajer proyek, wirausaha, posisi yang menuntut keputusan cepat",
  },
  I: {
    nama: "Influence",
    singkat: "Antusias & persuasif",
    ket: "Mudah bergaul, optimis, dan pandai meyakinkan orang. Membawa energi ke tim. Perlu menjaga ketelitian dan konsistensi menyelesaikan detail.",
    cocok: "Marketing, public relations, business development, trainer",
  },
  S: {
    nama: "Steadiness",
    singkat: "Stabil & suportif",
    ket: "Sabar, dapat diandalkan, dan menjaga keharmonisan tim. Bekerja baik dengan ritme yang konsisten. Perlu latihan menghadapi perubahan mendadak dan menyampaikan pendapat.",
    cocok: "Customer service, HR, administrasi, perawat, layanan operasional",
  },
  C: {
    nama: "Conscientiousness",
    singkat: "Teliti & analitis",
    ket: "Mengutamakan akurasi, data, dan standar kualitas. Teliti sebelum memutuskan. Perlu menjaga agar tidak terlalu perfeksionis dan tetap tepat waktu.",
    cocok: "Akuntansi, audit, analis data, quality control, engineering",
  },
};

// Setiap kelompok: [D, I, S, C]
const DISC_KATA = [
  ["Tegas", "Ramah", "Sabar", "Teliti"],
  ["Berani", "Meyakinkan", "Setia", "Hati-hati"],
  ["Kompetitif", "Ceria", "Tenang", "Akurat"],
  ["Langsung", "Ekspresif", "Penurut", "Sistematis"],
  ["Pengambil risiko", "Mudah bergaul", "Pendengar yang baik", "Perfeksionis"],
  ["Menuntut", "Optimis", "Konsisten", "Analitis"],
  ["Mandiri", "Spontan", "Kooperatif", "Rapi"],
  ["Pemimpin", "Penghibur", "Pendamai", "Pengamat"],
  ["Gigih", "Bersemangat", "Rendah hati", "Disiplin"],
  ["Cepat memutuskan", "Pandai bicara", "Mudah menyesuaikan", "Berpikir mendalam"],
  ["Berorientasi target", "Inspiratif", "Dapat diandalkan", "Taat aturan"],
  ["Lugas", "Hangat", "Santai", "Kritis"],
  ["Ambisius", "Percaya diri", "Penyabar", "Cermat"],
  ["Suka tantangan", "Suka keramaian", "Suka kestabilan", "Suka kepastian"],
  ["Keras kepala", "Impulsif", "Ragu-ragu", "Kaku"],
  ["Pemberani", "Menyenangkan", "Penyayang", "Terencana"],
  ["Tidak sabaran", "Mudah teralihkan", "Sulit menolak", "Terlalu khawatir"],
  ["Mengendalikan", "Memotivasi", "Mendukung", "Mengevaluasi"],
  ["Tangguh", "Lincah", "Lembut", "Logis"],
  ["Menyukai kemenangan", "Menyukai pujian", "Menyukai ketenangan", "Menyukai ketepatan"],
  ["Tegas pada aturan main", "Pandai mencairkan suasana", "Menjaga perasaan orang", "Menjaga mutu pekerjaan"],
  ["Ingin hasil cepat", "Ingin diakui", "Ingin rasa aman", "Ingin semuanya benar"],
  ["Memimpin rapat", "Mempresentasikan ide", "Mencatat dan membantu", "Memeriksa data"],
  ["Berani berdebat", "Senang bercerita", "Senang membantu", "Senang menganalisis"],
];
const HURUF = ["D", "I", "S", "C"];

/** Soal DISC: kata diacak urutannya, tetapi tetap ingat dimensinya. */
export function soalDisc(acak) {
  return DISC_KATA.map((k, i) => ({ id: i, kata: acak.kocok(k.map((kata, j) => ({ kata, dim: HURUF[j] }))) }));
}

/** jawaban: { [i]: { paling: indeks, tidak: indeks } } */
export function hitungDisc(soal, jawaban) {
  const net = { D: 0, I: 0, S: 0, C: 0 };
  soal.forEach((s, i) => {
    const j = jawaban[i];
    if (!j) return;
    if (j.paling != null) net[s.kata[j.paling].dim] += 1;
    if (j.tidak != null) net[s.kata[j.tidak].dim] -= 1;
  });
  const n = soal.length;
  const nilai = Object.fromEntries(HURUF.map((h) => [h, Math.round(((net[h] + n) / (2 * n)) * 100)]));
  const urut = [...HURUF].sort((a, b) => nilai[b] - nilai[a]);
  return { nilai, utama: urut[0], kedua: urut[1] };
}

/* =============================================================== EPPS */

export const EPPS_KEBUTUHAN = {
  prestasi: { nama: "Berprestasi", tinggi: "Terdorong menyelesaikan tugas sulit dan menjadi yang terbaik.", rendah: "Tidak terlalu mengejar menjadi yang terbaik; cukup puas dengan hasil yang memadai." },
  keteraturan: { nama: "Keteraturan", tinggi: "Menyukai kerapian, rencana, dan prosedur yang jelas.", rendah: "Lebih luwes, tidak terlalu terikat rencana dan kerapian." },
  otonomi: { nama: "Kemandirian", tinggi: "Ingin bebas menentukan cara kerja sendiri dan tidak suka terlalu diatur.", rendah: "Nyaman mengikuti arahan dan bekerja dalam struktur." },
  afiliasi: { nama: "Pertemanan", tinggi: "Senang menjalin hubungan dan bekerja bersama orang lain.", rendah: "Nyaman bekerja sendiri; tidak terlalu membutuhkan banyak interaksi." },
  dominasi: { nama: "Memimpin", tinggi: "Suka memimpin, memengaruhi, dan mengambil keputusan untuk kelompok.", rendah: "Lebih nyaman berperan sebagai anggota daripada pemimpin." },
  ketekunan: { nama: "Ketekunan", tinggi: "Bertahan pada satu tugas sampai tuntas walau lama dan berat.", rendah: "Lebih suka berpindah tugas; cepat bosan pada pekerjaan panjang." },
  perubahan: { nama: "Variasi", tinggi: "Menyukai hal baru, tempat baru, dan cara kerja yang berganti-ganti.", rendah: "Menyukai rutinitas dan kestabilan." },
  membantu: { nama: "Kepedulian", tinggi: "Senang membantu, membimbing, dan memperhatikan kesulitan orang lain.", rendah: "Lebih fokus pada tugas daripada mengurus kebutuhan orang lain." },
  patuh: { nama: "Kepatuhan", tinggi: "Menghormati atasan dan aturan, senang mengikuti petunjuk orang yang lebih ahli.", rendah: "Kritis terhadap aturan dan arahan; ingin memahami alasannya dulu." },
  tampil: { nama: "Tampil", tinggi: "Senang menjadi pusat perhatian dan tampil di depan orang.", rendah: "Lebih suka bekerja di belakang layar." },
};

const EPPS_PERNYATAAN = {
  prestasi: ["Saya ingin menyelesaikan tugas yang sulit dengan hasil terbaik.", "Saya ingin dikenal sebagai ahli di bidang saya.", "Saya senang menghadapi target yang menantang."],
  keteraturan: ["Saya menyusun rencana sebelum mulai bekerja.", "Saya senang meja dan berkas kerja saya tertata rapi.", "Saya lebih nyaman bekerja dengan prosedur yang jelas."],
  otonomi: ["Saya ingin bebas menentukan cara saya bekerja.", "Saya lebih suka mengambil keputusan sendiri tanpa banyak bertanya.", "Saya kurang nyaman bila pekerjaan saya terlalu diawasi."],
  afiliasi: ["Saya senang bekerja bersama teman-teman dalam tim.", "Saya berusaha menjaga hubungan baik dengan semua rekan.", "Saya senang ikut kegiatan bersama rekan kerja."],
  dominasi: ["Saya ingin memimpin kelompok dalam mencapai tujuan.", "Saya senang meyakinkan orang lain untuk mengikuti pendapat saya.", "Saya ingin menjadi orang yang mengambil keputusan dalam tim."],
  ketekunan: ["Saya bertahan mengerjakan tugas sampai benar-benar selesai.", "Saya tidak mudah menyerah walau pekerjaan memakan waktu lama.", "Saya menyelesaikan satu pekerjaan sebelum memulai yang lain."],
  perubahan: ["Saya senang mencoba cara kerja yang baru.", "Saya suka bertemu orang baru dan pergi ke tempat baru.", "Saya cepat bosan dengan pekerjaan yang sama setiap hari."],
  membantu: ["Saya senang membantu rekan yang sedang kesulitan.", "Saya bersedia membimbing rekan baru sampai ia mahir.", "Saya memperhatikan perasaan orang-orang di sekitar saya."],
  patuh: ["Saya mengikuti petunjuk atasan dengan sungguh-sungguh.", "Saya menghargai saran dari orang yang lebih berpengalaman.", "Saya mematuhi aturan walau tidak selalu setuju."],
  tampil: ["Saya senang berbicara di depan banyak orang.", "Saya suka bila hasil kerja saya mendapat perhatian.", "Saya senang menjadi pusat perhatian dalam acara."],
};

/** 45 pasang: setiap kebutuhan dipasangkan sekali dengan setiap kebutuhan lain. */
export function soalEpps(acak) {
  const kunci = Object.keys(EPPS_PERNYATAAN);
  const pakai = Object.fromEntries(kunci.map((k) => [k, 0]));
  const ambil = (k) => EPPS_PERNYATAAN[k][pakai[k]++ % EPPS_PERNYATAAN[k].length];
  const pasang = [];
  for (let i = 0; i < kunci.length; i++) for (let j = i + 1; j < kunci.length; j++) pasang.push([kunci[i], kunci[j]]);
  return acak.kocok(pasang).map(([a, b]) => {
    const dua = acak.kocok([
      { teks: ambil(a), k: a },
      { teks: ambil(b), k: b },
    ]);
    return { q: "Pilih pernyataan yang LEBIH menggambarkan dirimu.", o: dua.map((x) => x.teks), kunciPaksa: dua.map((x) => x.k), paksa: true, bagian: "EPPS" };
  });
}

export function hitungEpps(soal, jawaban) {
  const skor = Object.fromEntries(Object.keys(EPPS_KEBUTUHAN).map((k) => [k, 0]));
  soal.forEach((s, i) => {
    if (jawaban[i] != null) skor[s.kunciPaksa[jawaban[i]]] += 1;
  });
  // Setiap kebutuhan muncul 9 kali
  return Object.fromEntries(Object.entries(skor).map(([k, v]) => [k, Math.round((v / 9) * 100)]));
}

/* ============================================================ 16 tipe */

const TIPE16_SOAL = [
  // [dimensi, pilihan A (huruf pertama), pilihan B (huruf kedua)]
  ["EI", "Setelah seharian bekerja, saya mengisi ulang energi dengan bertemu teman.", "Setelah seharian bekerja, saya mengisi ulang energi dengan waktu sendiri."],
  ["EI", "Saya berpikir sambil berbicara dan berdiskusi.", "Saya lebih suka memikirkan dulu sebelum berbicara."],
  ["EI", "Di acara baru, saya mudah memulai obrolan dengan orang asing.", "Di acara baru, saya menunggu diajak bicara lebih dulu."],
  ["EI", "Saya menikmati rapat dan brainstorming bersama.", "Saya lebih produktif bekerja tenang tanpa gangguan."],
  ["EI", "Saya punya banyak kenalan dari berbagai kalangan.", "Saya punya sedikit teman, tetapi sangat dekat."],
  ["EI", "Saya nyaman menjadi pusat perhatian.", "Saya lebih nyaman berada di belakang layar."],
  ["EI", "Saya lebih suka menelepon untuk menyelesaikan masalah dengan cepat.", "Saya lebih suka menulis pesan supaya bisa menyusun kata-kata."],
  ["SN", "Saya lebih percaya pada fakta dan pengalaman nyata.", "Saya lebih tertarik pada ide dan kemungkinan baru."],
  ["SN", "Saya suka instruksi yang jelas langkah demi langkah.", "Saya suka gambaran besar, lalu mencari caranya sendiri."],
  ["SN", "Saya memperhatikan detail yang sering terlewat orang lain.", "Saya cepat melihat pola dan hubungan antarhal."],
  ["SN", "Saya lebih suka memperbaiki cara yang sudah terbukti.", "Saya lebih suka mencoba cara yang belum pernah dipakai."],
  ["SN", "Saat bercerita, saya menyampaikan kejadian secara runtut dan rinci.", "Saat bercerita, saya melompat ke makna dan kesannya."],
  ["SN", "Saya fokus pada apa yang terjadi sekarang.", "Saya sering memikirkan apa yang bisa terjadi di masa depan."],
  ["SN", "Saya menilai sesuatu dari kegunaannya yang praktis.", "Saya menilai sesuatu dari potensi dan gagasan di baliknya."],
  ["TF", "Saat memutuskan, saya mengutamakan logika dan konsistensi.", "Saat memutuskan, saya mengutamakan dampaknya bagi orang lain."],
  ["TF", "Saya menyampaikan kritik secara lugas agar jelas.", "Saya menyampaikan kritik dengan hati-hati agar tidak menyakiti."],
  ["TF", "Adil berarti aturan berlaku sama untuk semua orang.", "Adil berarti mempertimbangkan keadaan setiap orang."],
  ["TF", "Saya lebih mudah dipengaruhi argumen yang masuk akal.", "Saya lebih mudah dipengaruhi cerita yang menyentuh."],
  ["TF", "Dalam konflik, saya fokus mencari siapa yang benar.", "Dalam konflik, saya fokus menjaga hubungan tetap baik."],
  ["TF", "Saya dikenal sebagai orang yang objektif.", "Saya dikenal sebagai orang yang hangat."],
  ["TF", "Saya menilai hasil kerja dari kualitasnya.", "Saya menilai hasil kerja juga dari usaha orangnya."],
  ["JP", "Saya suka menyelesaikan pekerjaan jauh sebelum tenggat.", "Saya bekerja paling baik ketika tenggat sudah dekat."],
  ["JP", "Saya membuat daftar tugas dan mengikutinya.", "Saya mengerjakan apa yang terasa paling penting saat itu."],
  ["JP", "Saya lebih tenang bila keputusan sudah diambil.", "Saya lebih suka membiarkan pilihan tetap terbuka."],
  ["JP", "Liburan yang baik punya jadwal yang jelas.", "Liburan yang baik dibiarkan mengalir."],
  ["JP", "Perubahan rencana mendadak membuat saya tidak nyaman.", "Perubahan rencana mendadak terasa menyenangkan."],
  ["JP", "Meja kerja saya umumnya tertata.", "Meja kerja saya tertata dengan cara yang hanya saya pahami."],
  ["JP", "Saya suka aturan dan struktur yang jelas di tempat kerja.", "Saya suka kebebasan dan fleksibilitas di tempat kerja."],
];

export function soalTipe16(acak) {
  return acak.kocok(TIPE16_SOAL).map(([dim, a, b]) => {
    const balik = acak.int(0, 1) === 1;
    return {
      q: "Pilih yang LEBIH menggambarkan dirimu.",
      o: balik ? [b, a] : [a, b],
      kunciPaksa: balik ? [dim[1], dim[0]] : [dim[0], dim[1]],
      paksa: true,
      bagian: "16 tipe",
    };
  });
}

export const TIPE16 = {
  ISTJ: ["Si Pengelola", "Teliti, bertanggung jawab, dan menjunjung prosedur.", "Akuntansi, audit, administrasi, operasional, hukum"],
  ISFJ: ["Si Pelindung", "Setia, perhatian, dan dapat diandalkan dalam detail.", "Kesehatan, HR, layanan pelanggan, administrasi"],
  INFJ: ["Si Penasihat", "Visioner, peka, dan berprinsip kuat.", "Konseling, HR development, pendidikan, penulisan"],
  INTJ: ["Si Arsitek", "Strategis, mandiri, dan berorientasi rencana jangka panjang.", "Strategi bisnis, data science, riset, engineering"],
  ISTP: ["Si Pemecah Masalah", "Praktis, tenang dalam krisis, dan senang memahami cara kerja sesuatu.", "Teknik, IT, maintenance, investigasi"],
  ISFP: ["Si Seniman", "Lembut, estetis, dan fleksibel.", "Desain, kreatif, kesehatan, layanan personal"],
  INFP: ["Si Idealis", "Bernilai kuat, kreatif, dan empatik.", "Penulisan, desain, pendidikan, organisasi sosial"],
  INTP: ["Si Pemikir", "Analitis, kritis, dan penasaran pada konsep.", "Pemrograman, riset, analisis data, akademik"],
  ESTP: ["Si Pelaku", "Energik, cepat bertindak, dan pragmatis.", "Sales, negosiasi, operasional lapangan, wirausaha"],
  ESFP: ["Si Penghibur", "Ramah, spontan, dan menyenangkan.", "Event, hospitality, public relations, sales ritel"],
  ENFP: ["Si Penggerak", "Antusias, imajinatif, dan pandai menginspirasi.", "Marketing, kreatif, pelatihan, business development"],
  ENTP: ["Si Inovator", "Cerdas berdebat, penuh ide, dan suka tantangan intelektual.", "Konsultan, startup, produk, strategi"],
  ESTJ: ["Si Pengatur", "Terorganisasi, tegas, dan efisien.", "Manajemen, operasional, perbankan, pemerintahan"],
  ESFJ: ["Si Penjaga Tim", "Hangat, kooperatif, dan peduli kebutuhan orang lain.", "HR, layanan pelanggan, pendidikan, kesehatan"],
  ENFJ: ["Si Pembimbing", "Karismatik, empatik, dan memotivasi orang.", "Kepemimpinan, pelatihan, HR, komunikasi"],
  ENTJ: ["Si Komandan", "Tegas, strategis, dan berorientasi pada tujuan.", "Manajemen, konsultan, wirausaha, posisi eksekutif"],
};

export function hitungTipe16(soal, jawaban) {
  const n = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  soal.forEach((s, i) => {
    if (jawaban[i] != null) n[s.kunciPaksa[jawaban[i]]] += 1;
  });
  const pilih = (a, b) => (n[a] >= n[b] ? a : b);
  const tipe = pilih("E", "I") + pilih("S", "N") + pilih("T", "F") + pilih("J", "P");
  const persen = (a, b) => Math.round((n[a] / Math.max(1, n[a] + n[b])) * 100);
  return { tipe, skala: { EI: persen("E", "I"), SN: persen("S", "N"), TF: persen("T", "F"), JP: persen("J", "P") } };
}

export const TIPS_DISC = [
  "Di setiap kelompok, pilih satu kata yang PALING menggambarkan dirimu dan satu yang PALING TIDAK. Keduanya wajib diisi.",
  "Jawab berdasarkan perilakumu di tempat kerja, bukan sosok ideal yang kamu inginkan.",
  "Jangan terlalu lama berpikir. Jawaban spontan biasanya paling konsisten.",
  "Tidak ada profil yang salah. Perusahaan mencari profil yang cocok dengan tuntutan posisi, misalnya D/I untuk sales dan C untuk audit.",
];

export const TIPS_EPPS = [
  "Kedua pernyataan sering sama-sama baik. Pilih yang LEBIH sesuai, walau hanya sedikit.",
  "Pernyataan serupa muncul berulang dengan kata berbeda. Jawab jujur supaya hasilmu konsisten; ketidakkonsistenan sering ditandai oleh psikolog.",
  "Jangan berusaha menebak 'jawaban yang diinginkan perusahaan'. Pola jawaban yang dibuat-buat biasanya terlihat.",
  "Di seleksi sungguhan EPPS berisi 225 pasang. Jaga konsentrasi dan ritme agar tidak asal pilih di bagian akhir.",
];

export const TIPS_TIPE16 = [
  "Pilih yang lebih alami bagimu, bukan yang menurutmu lebih baik.",
  "Tipe kepribadian tidak menentukan bisa atau tidaknya kamu bekerja di suatu posisi. Gunakan hasilnya untuk memahami gaya kerjamu.",
  "Hasil yang mendekati 50% di satu dimensi berarti kamu fleksibel di dimensi itu.",
];
