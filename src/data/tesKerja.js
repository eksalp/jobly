/**
 * Tes persiapan kerja (paket Max): psikotes yang umum dipakai perusahaan
 * dan BUMN di Indonesia.
 *
 * Soal angka (deret, hitungan, ketelitian, Kraepelin) dibuat acak setiap
 * kali tes dimulai, jadi tidak bisa dihafal. Soal verbal dan logika
 * diambil acak dari bank soal.
 *
 * Setiap soal pilihan ganda: { q, o: [pilihan], a: indeks benar, e: penjelasan, bagian }
 */
import { t } from "../i18n.js";
import { BANK_VERBAL, TIPS_VERBAL } from "./tes/bankVerbal.js";
import { BANK_LOGIKA, TIPS_LOGIKA } from "./tes/bankLogika.js";
import { BANK_INGGRIS, TIPS_INGGRIS } from "./tes/bankInggris.js";
import { soalNumerikHots, TIPS_NUMERIK } from "./tes/numerik.js";
import { soalFigural, TIPS_FIGURAL } from "./tes/figural.js";
import { TIPS_KECERMATAN } from "./tes/kecermatan.js";
export { buatKecermatan, nilaiKecermatan, KECERMATAN, LABEL_KECERMATAN } from "./tes/kecermatan.js";

/* ------------------------------------------------------------ acak */

export function buatAcak(benih = Date.now()) {
  let s = benih >>> 0 || 1;
  const r = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
  const int = (a, b) => a + Math.floor(r() * (b - a + 1));
  const pilih = (arr) => arr[Math.floor(r() * arr.length)];
  const kocok = (arr) => {
    const x = [...arr];
    for (let i = x.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [x[i], x[j]] = [x[j], x[i]];
    }
    return x;
  };
  return { r, int, pilih, kocok };
}

/** Susun pilihan: jawaban benar + pengecoh, diacak, tanpa duplikat. */
function susunPilihan(acak, benar, pengecoh) {
  const unik = [...new Set(pengecoh.map(String))].filter((x) => x !== String(benar)).slice(0, 3);
  const o = acak.kocok([String(benar), ...unik]);
  return { o, a: o.indexOf(String(benar)) };
}


/* ------------------------------------------- bank & generator HOTS */

/** Soal dari bank: jawaban benar ada di o[0], lalu pilihan diacak. */
function dariBank(acak, bank, n) {
  return acak.kocok(bank).slice(0, n).map((x) => ({
    q: x.q,
    bacaan: x.bacaan,
    ...susunPilihan(acak, x.o[0], x.o.slice(1)),
    e: x.e,
    bagian: x.b,
  }));
}

/** Bacaan yang sama dikelompokkan berurutan supaya tidak bolak-balik. */
function rapikanBacaan(daftar) {
  const urut = [];
  const sudah = new Set();
  daftar.forEach((s) => {
    if (!s.bacaan) return urut.push(s);
    if (sudah.has(s.bacaan)) return;
    sudah.add(s.bacaan);
    daftar.filter((x) => x.bacaan === s.bacaan).forEach((x) => urut.push(x));
  });
  return urut;
}

const soalVerbal = (acak, n = 30) => rapikanBacaan(dariBank(acak, BANK_VERBAL, n));
const soalLogika = (acak, n = 25) => rapikanBacaan(dariBank(acak, BANK_LOGIKA, n));
const soalInggris = (acak, n = 40) => rapikanBacaan(dariBank(acak, BANK_INGGRIS, n));
const soalNumerik = (acak, n = 30) => soalNumerikHots(acak, n, susunPilihan);

/* ------------------------------------------------- ketelitian */

const NAMA = ["Andi Pratama", "Siti Rahmawati", "Budi Santoso", "Dewi Lestari", "Rizky Maulana", "Putri Ayu", "Hendra Gunawan", "Nur Aisyah", "Agus Setiawan", "Fitri Handayani", "Yoga Saputra", "Rina Wulandari"];
const JALAN = ["Jl. Melati No. ", "Jl. Sudirman Kav. ", "Jl. Kenanga Blok ", "Jl. Ahmad Yani No. ", "Jl. Diponegoro No. "];

function ubahSedikit(acak, s) {
  const i = acak.int(0, s.length - 1);
  const c = s[i];
  if (/\d/.test(c)) return s.slice(0, i) + String((Number(c) + acak.int(1, 8)) % 10) + s.slice(i + 1);
  if (/[a-z]/i.test(c)) {
    const huruf = "aiueonmrstlk";
    let g = acak.pilih(huruf.split(""));
    if (g === c.toLowerCase()) g = "x";
    return s.slice(0, i) + (c === c.toUpperCase() ? g.toUpperCase() : g) + s.slice(i + 1);
  }
  return s.slice(0, i) + s.slice(i + 1);
}

function soalKetelitian(acak, n = 50) {
  return Array.from({ length: n }, () => {
    const jenis = acak.int(0, 2);
    const asli =
      jenis === 0
        ? acak.pilih(NAMA)
        : jenis === 1
          ? `08${acak.int(11, 99)}-${acak.int(1000, 9999)}-${acak.int(1000, 9999)}`
          : `${acak.pilih(JALAN)}${acak.int(1, 120)}${acak.pilih(["", "A", "B"])}, ${acak.pilih(["Bekasi", "Depok", "Bogor", "Medan", "Malang"])}`;
    const sama = acak.r() < 0.45;
    const kanan = sama ? asli : ubahSedikit(acak, asli);
    const o = [t("Sama", "Same"), t("Berbeda", "Different")];
    return { q: `${asli}\n${kanan}`, o, a: kanan === asli ? 0 : 1, e: kanan === asli ? t("Kedua data persis sama.", "Both entries are identical.") : t("Ada satu karakter yang berbeda.", "One character is different."), bagian: t("Ketelitian", "Accuracy"), pasangan: true };
  });
}

/* ----------------------------------------------- kepribadian */

// Model Big Five (IPIP, domain publik). k: dimensi, r: dibalik
const KEPRIBADIAN = [
  [t("Saya menyelesaikan tugas tepat waktu, bahkan tanpa diingatkan.", "I finish tasks on time, even without reminders."), "teliti"],
  [t("Saya membuat rencana sebelum mulai bekerja.", "I plan before I start working."), "teliti"],
  [t("Saya sering menunda pekerjaan yang membosankan.", "I often put off boring work."), "teliti", true],
  [t("Saya memeriksa ulang pekerjaan sebelum menyerahkannya.", "I double-check work before handing it in."), "teliti"],
  [t("Barang dan file saya sering berantakan.", "My things and files are often messy."), "teliti", true],
  [t("Saya mudah memulai obrolan dengan orang baru.", "I easily start conversations with strangers."), "ekstra"],
  [t("Saya bersemangat saat bekerja dalam tim yang ramai.", "I feel energised in a busy team."), "ekstra"],
  [t("Saya lebih suka diam saat rapat besar.", "I prefer to stay quiet in big meetings."), "ekstra", true],
  [t("Saya nyaman berbicara di depan banyak orang.", "I'm comfortable speaking in front of many people."), "ekstra"],
  [t("Setelah seharian bertemu banyak orang, saya butuh waktu sendiri cukup lama.", "After a day with many people, I need a long time alone."), "ekstra", true],
  [t("Saya senang membantu rekan kerja meski bukan tugas saya.", "I like helping colleagues even when it isn't my job."), "ramah"],
  [t("Saya mudah memaafkan kesalahan orang lain.", "I forgive others' mistakes easily."), "ramah"],
  [t("Saya cenderung curiga pada niat orang lain.", "I tend to suspect others' intentions."), "ramah", true],
  [t("Saya mempertimbangkan perasaan orang sebelum memberi kritik.", "I consider people's feelings before criticising."), "ramah"],
  [t("Saya lebih mementingkan menang dalam diskusi daripada mencapai kesepakatan.", "Winning a debate matters more to me than reaching agreement."), "ramah", true],
  [t("Saya tetap tenang saat tenggat sangat mepet.", "I stay calm when deadlines are very tight."), "stabil"],
  [t("Kritik membuat saya kepikiran berhari-hari.", "Criticism stays on my mind for days."), "stabil", true],
  [t("Saya cepat bangkit setelah mengalami kegagalan.", "I bounce back quickly after a failure."), "stabil"],
  [t("Saya mudah cemas saat menghadapi perubahan mendadak.", "Sudden changes make me anxious."), "stabil", true],
  [t("Suasana hati saya jarang memengaruhi pekerjaan.", "My mood rarely affects my work."), "stabil"],
  [t("Saya senang mencoba cara kerja baru.", "I enjoy trying new ways of working."), "terbuka"],
  [t("Saya tertarik mempelajari hal di luar bidang saya.", "I'm curious about things outside my field."), "terbuka"],
  [t("Saya lebih nyaman dengan prosedur yang sudah biasa.", "I'm more comfortable with familiar procedures."), "terbuka", true],
  [t("Saya sering punya ide untuk memperbaiki proses kerja.", "I often have ideas to improve how work gets done."), "terbuka"],
  [t("Diskusi tentang ide abstrak membuat saya bosan.", "Discussions about abstract ideas bore me."), "terbuka", true],
];

export const DIMENSI = {
  teliti: { nama: t("Kehati-hatian & disiplin", "Conscientiousness"), tinggi: t("Terencana, tepat waktu, dan teliti. Kekuatan besar untuk hampir semua pekerjaan.", "Organised, punctual, and careful. A big strength for almost any job."), rendah: t("Lebih spontan. Bantu dirimu dengan daftar tugas dan pengingat tenggat.", "More spontaneous. Help yourself with to-do lists and deadline reminders.") },
  ekstra: { nama: t("Ekstraversi", "Extraversion"), tinggi: t("Berenergi saat bersama orang. Cocok untuk sales, CS, dan peran yang banyak berinteraksi.", "Energised by people. Suits sales, customer service, and people-facing roles."), rendah: t("Lebih nyaman bekerja fokus sendiri. Cocok untuk analisis, penulisan, dan pekerjaan teknis.", "Prefers focused solo work. Suits analysis, writing, and technical roles.") },
  ramah: { nama: t("Keramahan & kerja sama", "Agreeableness"), tinggi: t("Mudah bekerja sama dan dipercaya tim. Pastikan tetap berani menyampaikan pendapat.", "Cooperative and trusted by teams. Make sure you still voice your views."), rendah: t("Lugas dan kritis. Bagus untuk negosiasi, tetapi jaga cara menyampaikan kritik.", "Direct and critical. Good for negotiation, but mind how you deliver criticism.") },
  stabil: { nama: t("Stabilitas emosi", "Emotional stability"), tinggi: t("Tenang di bawah tekanan. Dicari untuk peran dengan tenggat ketat.", "Calm under pressure. Valued in roles with tight deadlines."), rendah: t("Lebih peka terhadap tekanan. Latih teknik mengelola stres dan minta kejelasan prioritas.", "More sensitive to pressure. Practise stress management and ask for clear priorities.") },
  terbuka: { nama: t("Keterbukaan", "Openness"), tinggi: t("Kreatif dan senang belajar. Cocok untuk inovasi, desain, dan riset.", "Creative and eager to learn. Suits innovation, design, and research."), rendah: t("Praktis dan menghargai prosedur. Cocok untuk operasional dan pekerjaan berstandar tinggi.", "Practical and values procedure. Suits operations and high-standard work.") },
};

function soalKepribadian(acak) {
  return acak.kocok(KEPRIBADIAN).map(([q, k, r]) => ({ q, k, r: Boolean(r), likert: true }));
}

export function hitungKepribadian(soal, jawaban) {
  const total = {};
  const jumlah = {};
  soal.forEach((s, i) => {
    const j = jawaban[i];
    if (j == null) return;
    const nilai = s.r ? 6 - (j + 1) : j + 1; // 1..5
    total[s.k] = (total[s.k] || 0) + nilai;
    jumlah[s.k] = (jumlah[s.k] || 0) + 1;
  });
  return Object.fromEntries(Object.keys(DIMENSI).map((k) => [k, jumlah[k] ? Math.round(((total[k] / jumlah[k] - 1) / 4) * 100) : 0]));
}

/* ------------------------------------------------- Kraepelin */

export const KRAEPELIN = { kolom: 20, baris: 26, detikPerKolom: 20 };

export function buatKraepelin(acak) {
  return Array.from({ length: KRAEPELIN.kolom }, () => Array.from({ length: KRAEPELIN.baris }, () => acak.int(1, 9)));
}

/**
 * Hasil Kraepelin per kolom: { dijawab, benar }.
 * Kecepatan = rata-rata dijawab per kolom, ketelitian = % benar,
 * keajegan = seberapa stabil jumlah per kolom, ketahanan = tren
 * paruh akhir dibanding paruh awal.
 */
export function nilaiKraepelin(perKolom) {
  const n = perKolom.length || 1;
  const dijawab = perKolom.map((k) => k.dijawab);
  const total = dijawab.reduce((a, b) => a + b, 0);
  const benar = perKolom.reduce((a, k) => a + k.benar, 0);
  const rata = total / n;
  const sd = Math.sqrt(dijawab.reduce((a, x) => a + (x - rata) ** 2, 0) / n);
  const awal = dijawab.slice(0, Math.floor(n / 2));
  const akhir = dijawab.slice(Math.floor(n / 2));
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const tren = avg(akhir) - avg(awal);
  const kecepatan = Math.min(100, Math.round((rata / (KRAEPELIN.baris - 1)) * 100));
  const ketelitian = total ? Math.round((benar / total) * 100) : 0;
  const keajegan = Math.max(0, Math.round(100 - sd * 12));
  const ketahanan = Math.max(0, Math.min(100, Math.round(70 + tren * 8)));
  const skor = Math.round(kecepatan * 0.3 + ketelitian * 0.35 + keajegan * 0.2 + ketahanan * 0.15);
  return { total, benar, rata: Math.round(rata * 10) / 10, sd: Math.round(sd * 10) / 10, tren: Math.round(tren * 10) / 10, kecepatan, ketelitian, keajegan, ketahanan, skor };
}

/* ------------------------------------------------- katalog tes */

const TIPS_KRAEPELIN = [
  "Mulai dengan kecepatan yang bisa kamu pertahankan sampai kolom terakhir. Yang dinilai bukan hanya jumlah, tetapi juga kestabilan grafik kerjamu.",
  "Tulis/ketik hanya digit terakhir hasil penjumlahan (7 + 8 = 15 → 5).",
  "Jika salah, jangan berhenti untuk menyesal; langsung lanjut ke pasangan berikutnya.",
  "Grafik yang turun tajam di akhir dibaca sebagai cepat lelah. Grafik yang naik-turun dibaca sebagai konsentrasi tidak ajeg.",
  "Tidur cukup dan sarapan sebelum tes sungguhan sangat berpengaruh pada tes ini.",
];
const TIPS_KETELITIAN = [
  "Bandingkan per bagian: angka per kelompok 4 digit, nama per suku kata, alamat per kata.",
  "Perhatikan huruf yang mirip (m–n, rn–m, l–I) dan angka yang mirip (6–8, 1–7).",
  "Jangan membaca untuk memahami; bacalah untuk mencocokkan.",
  "Pakai tombol S (sama) dan B (berbeda) di keyboard supaya lebih cepat.",
];
const TIPS_KEPRIBADIAN = [
  "Jawab jujur sesuai kebiasaanmu di tempat kerja, bukan sosok ideal yang kamu bayangkan.",
  "Tes kepribadian sungguhan memuat pernyataan berulang dengan kalimat berbeda untuk mendeteksi jawaban yang tidak konsisten.",
  "Hindari terlalu banyak memilih jawaban tengah (netral); itu bisa dibaca sebagai ragu-ragu atau menyembunyikan diri.",
  "Tidak ada profil yang 'salah'. Yang dicari perusahaan adalah kecocokan profil dengan tuntutan posisi.",
];
const TIPS_TPA = [
  "Kerjakan bagian yang paling kamu kuasai lebih dulu jika tes mengizinkan berpindah bagian.",
  "Alokasikan waktu sekitar 1 menit per soal. Soal yang butuh lebih dari 2 menit, tandai dan lewati dulu.",
  "Untuk soal hitungan, perkirakan dulu besaran jawabannya, lalu buang pilihan yang jauh berbeda.",
  "Sisakan 5 menit di akhir untuk memeriksa soal yang ditandai.",
];

export const JENIS_TES = [
  {
    id: "tpa",
    nama: t("TPA Lengkap (100 soal)", "Full aptitude test (100 questions)"),
    ikon: "GraduationCap",
    ket: t("Simulasi Tes Potensi Akademik lengkap: 35 verbal, 35 numerik, dan 30 penalaran, setara tes seleksi BUMN dan perusahaan besar.", "A full academic aptitude simulation: 35 verbal, 35 numerical, and 30 reasoning questions, like large-company selection tests."),
    info: t("100 soal · 100 menit", "100 questions · 100 minutes"),
    menit: 100,
    tips: TIPS_TPA,
  },
  {
    id: "kraepelin",
    nama: t("Tes Kraepelin (Pauli)", "Kraepelin (Pauli) test"),
    ikon: "Columns3",
    ket: t("Menjumlahkan angka berpasangan secepat dan seteliti mungkin. Mengukur kecepatan, ketelitian, keajegan, dan daya tahan kerja.", "Add pairs of digits as fast and accurately as you can. Measures speed, accuracy, consistency, and endurance."),
    info: t(`${KRAEPELIN.kolom} kolom · ${KRAEPELIN.detikPerKolom} detik per kolom`, `${KRAEPELIN.kolom} columns · ${KRAEPELIN.detikPerKolom} s per column`),
    menit: Math.ceil((KRAEPELIN.kolom * KRAEPELIN.detikPerKolom) / 60),
    tips: TIPS_KRAEPELIN,
  },
  { id: "verbal", nama: t("TPA Verbal", "Verbal aptitude"), ikon: "BookA", ket: t("Analogi, makna kata, pemahaman bacaan, dan penalaran argumen (HOTS).", "Analogies, word meaning, reading comprehension, and argument reasoning."), info: t("30 soal · 25 menit", "30 questions · 25 minutes"), menit: 25, tips: TIPS_VERBAL },
  { id: "numerik", nama: t("TPA Numerik", "Numerical aptitude"), ikon: "Sigma", ket: t("Deret bertingkat, persen, perbandingan, kecepatan, peluang, dan soal cerita. Angka berbeda setiap tes.", "Multi-level series, percentages, ratios, speed, probability, and word problems. Numbers change every time."), info: t("30 soal · 35 menit", "30 questions · 35 minutes"), menit: 35, tips: TIPS_NUMERIK },
  { id: "logika", nama: t("Penalaran Logis", "Logical reasoning"), ikon: "Brain", ket: t("Logika proposisi, penalaran analitis (penyusunan & penjadwalan), dan interpretasi data.", "Propositional logic, analytical puzzles, and data interpretation."), info: t("25 soal · 30 menit", "25 questions · 30 minutes"), menit: 30, tips: TIPS_LOGIKA },
  { id: "inggris", nama: t("Bahasa Inggris Kerja", "Workplace English"), ikon: "Languages", ket: t("Structure, error recognition, vocabulary, reading, dan komunikasi bisnis. Setara TOEIC/TOEFL ITP.", "Structure, error recognition, vocabulary, reading, and business communication. TOEIC/TOEFL ITP style."), info: t("40 soal · 35 menit", "40 questions · 35 minutes"), menit: 35, tips: TIPS_INGGRIS },
  { id: "figural", nama: t("Logika Gambar (Figural)", "Figural reasoning"), ikon: "Shapes", ket: t("Lanjutkan urutan gambar: rotasi, jumlah, sisi bangun, dan pola ganda.", "Continue the picture sequence: rotation, count, sides, and combined patterns."), info: t("20 soal · 15 menit", "20 questions · 15 minutes"), menit: 15, tips: TIPS_FIGURAL },
  { id: "kecermatan", nama: t("Tes Kecermatan", "Attention test"), ikon: "Focus", ket: t("Temukan simbol yang hilang secepat mungkin. Umum di seleksi BUMN, kepolisian, dan kedinasan.", "Find the missing symbol as fast as you can. Common in state-owned and civil-service selection."), info: t("10 kolom · 45 detik per kolom", "10 columns · 45 s per column"), menit: 8, tips: TIPS_KECERMATAN },
  { id: "ketelitian", nama: t("Tes Ketelitian", "Accuracy test"), ikon: "ScanSearch", ket: t("Bandingkan pasangan nama, nomor, dan alamat: sama atau berbeda. Umum untuk posisi admin dan bank.", "Compare pairs of names, numbers, and addresses: same or different. Common for admin and banking roles."), info: t("50 soal · 8 menit", "50 questions · 8 minutes"), menit: 8, tips: TIPS_KETELITIAN },
  { id: "kepribadian", nama: t("Tes Kepribadian Kerja", "Work personality test"), ikon: "UserRound", ket: t("25 pernyataan tentang caramu bekerja. Hasilnya profil lima dimensi kepribadian.", "25 statements about how you work. You get a five-dimension personality profile."), info: t("25 pernyataan · tanpa batas waktu", "25 statements · no time limit"), menit: 0, tips: TIPS_KEPRIBADIAN },
];

export const cariTes = (id) => JENIS_TES.find((x) => x.id === id) || null;

/** Soal untuk satu tes. Contoh (gratis) memakai 3 soal saja. */
export function buatSoal(jenis, benih, contoh = false) {
  const acak = buatAcak(benih);
  const daftar =
    jenis === "verbal" ? soalVerbal(acak)
      : jenis === "numerik" ? soalNumerik(acak)
        : jenis === "logika" ? soalLogika(acak)
          : jenis === "inggris" ? soalInggris(acak)
            : jenis === "figural" ? soalFigural(acak, 20, susunPilihan)
              : jenis === "ketelitian" ? soalKetelitian(acak)
                : jenis === "kepribadian" ? soalKepribadian(acak)
                  : jenis === "tpa" ? [...soalVerbal(acak, 35), ...soalNumerik(acak, 35), ...soalLogika(acak, 30)]
                    : [];
  if (!contoh) return daftar;
  // Contoh: ambil soal tanpa bacaan panjang supaya cepat dicoba
  const ringkas = daftar.filter((s) => !s.bacaan);
  return (ringkas.length >= 3 ? ringkas : daftar).slice(0, jenis === "kepribadian" ? 5 : 3);
}

/** Ringkasan skor tes pilihan ganda per bagian. */
export function nilaiPilihan(soal, jawaban) {
  const per = {};
  let benar = 0;
  soal.forEach((s, i) => {
    const b = jawaban[i] === s.a;
    if (b) benar++;
    per[s.bagian] = per[s.bagian] || { benar: 0, total: 0 };
    per[s.bagian].total++;
    if (b) per[s.bagian].benar++;
  });
  return { benar, total: soal.length, skor: soal.length ? Math.round((benar / soal.length) * 100) : 0, perBagian: per };
}

export function labelSkor(skor) {
  if (skor >= 85) return t("Sangat baik", "Excellent");
  if (skor >= 70) return t("Baik", "Good");
  if (skor >= 55) return t("Cukup", "Fair");
  return t("Perlu latihan", "Needs practice");
}
