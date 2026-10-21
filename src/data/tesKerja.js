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

const rp = (n) => n.toLocaleString("id-ID");

/* --------------------------------------------------- bank verbal */

const SINONIM = [
  ["KONKRET", "Nyata", ["Abstrak", "Semu", "Ringkas"]],
  ["AKURAT", "Tepat", ["Cepat", "Lengkap", "Rapi"]],
  ["EFISIEN", "Hemat", ["Mahal", "Lambat", "Boros"]],
  ["KOMPETEN", "Cakap", ["Ramah", "Jujur", "Rajin"]],
  ["SINERGI", "Kerja sama", ["Persaingan", "Pemisahan", "Kekuatan"]],
  ["ESTIMASI", "Perkiraan", ["Kepastian", "Hasil", "Tujuan"]],
  ["PRIORITAS", "Utama", ["Tambahan", "Pilihan", "Akhir"]],
  ["FLUKTUASI", "Naik turun", ["Kenaikan", "Kestabilan", "Penurunan"]],
  ["KONSISTEN", "Taat asas", ["Berubah-ubah", "Cepat", "Kuat"]],
  ["VALID", "Sahih", ["Lengkap", "Baru", "Cocok"]],
  ["ADAPTASI", "Penyesuaian", ["Penolakan", "Perubahan", "Pembelajaran"]],
  ["INOVASI", "Pembaruan", ["Tradisi", "Peniruan", "Perbaikan"]],
];
const ANTONIM = [
  ["OPTIMIS", "Pesimis", ["Realistis", "Yakin", "Bersemangat"]],
  ["DEFISIT", "Surplus", ["Kurang", "Rugi", "Utang"]],
  ["SPESIFIK", "Umum", ["Khusus", "Rinci", "Jelas"]],
  ["EKSPOR", "Impor", ["Kirim", "Dagang", "Produksi"]],
  ["PERMANEN", "Sementara", ["Tetap", "Lama", "Abadi"]],
  ["AKTIF", "Pasif", ["Rajin", "Giat", "Sibuk"]],
  ["MAKSIMAL", "Minimal", ["Optimal", "Terbatas", "Rata-rata"]],
  ["SENTRALISASI", "Desentralisasi", ["Pemusatan", "Penyatuan", "Pengaturan"]],
  ["INKLUSIF", "Eksklusif", ["Terbuka", "Umum", "Lengkap"]],
  ["PROGRESIF", "Regresif", ["Maju", "Modern", "Agresif"]],
];
const ANALOGI = [
  ["PENA : MENULIS = GUNTING : ...", "Memotong", ["Kertas", "Tajam", "Menjahit"]],
  ["DOKTER : PASIEN = GURU : ...", "Murid", ["Sekolah", "Buku", "Kelas"]],
  ["AIR : HAUS = MAKANAN : ...", "Lapar", ["Kenyang", "Nasi", "Piring"]],
  ["GAJI : KARYAWAN = HONOR : ...", "Pekerja lepas", ["Direktur", "Kantor", "Bonus"]],
  ["MOBIL : BENSIN = MANUSIA : ...", "Makanan", ["Kaki", "Jalan", "Rumah"]],
  ["PETANI : CANGKUL = PENULIS : ...", "Pena", ["Buku", "Cerita", "Pembaca"]],
  ["SUHU : TERMOMETER = BERAT : ...", "Timbangan", ["Kilogram", "Barang", "Meteran"]],
  ["LAUT : IKAN = HUTAN : ...", "Harimau", ["Pohon", "Sungai", "Gunung"]],
  ["KOMPUTER : DATA = LEMARI : ...", "Pakaian", ["Kayu", "Kamar", "Kunci"]],
  ["MATAHARI : SIANG = BULAN : ...", "Malam", ["Bintang", "Langit", "Gelap"]],
];
const KELOMPOK = [
  [["Merah", "Biru", "Kuning", "Meja"], "Meja"],
  [["Gitar", "Biola", "Piano", "Kuas"], "Kuas"],
  [["Jakarta", "Bandung", "Surabaya", "Kalimantan"], "Kalimantan"],
  [["Excel", "Word", "PowerPoint", "Chrome"], "Chrome"],
  [["Neraca", "Laba rugi", "Arus kas", "Kontrak kerja"], "Kontrak kerja"],
  [["Mangga", "Apel", "Wortel", "Jeruk"], "Wortel"],
  [["Senin", "Rabu", "Maret", "Jumat"], "Maret"],
  [["Elang", "Merpati", "Kelelawar", "Pipit"], "Kelelawar"],
];

function soalVerbal(acak, n = 20) {
  const daftar = [
    ...SINONIM.map(([k, b, x]) => ({ q: t(`Sinonim (persamaan kata) dari ${k} adalah…`, `Synonym of ${k}:`), b, x, bagian: t("Sinonim", "Synonyms") })),
    ...ANTONIM.map(([k, b, x]) => ({ q: t(`Antonim (lawan kata) dari ${k} adalah…`, `Antonym of ${k}:`), b, x, bagian: t("Antonim", "Antonyms") })),
    ...ANALOGI.map(([k, b, x]) => ({ q: t(`Lengkapi analogi berikut: ${k}`, `Complete the analogy: ${k}`), b, x, bagian: t("Analogi", "Analogies") })),
    ...KELOMPOK.map(([kata, b]) => ({ q: t(`Kata mana yang TIDAK termasuk kelompoknya? ${kata.join(", ")}`, `Which word does NOT belong? ${kata.join(", ")}`), b, x: kata.filter((k) => k !== b), bagian: t("Pengelompokan", "Odd one out") })),
  ];
  return acak.kocok(daftar).slice(0, n).map((s) => ({ q: s.q, ...susunPilihan(acak, s.b, s.x), bagian: s.bagian, e: t(`Jawaban: ${s.b}.`, `Answer: ${s.b}.`) }));
}

/* -------------------------------------------------- numerik */

function deret(acak) {
  const jenis = acak.int(0, 4);
  let suku = [];
  let jelas = "";
  if (jenis === 0) {
    const a = acak.int(2, 30), b = acak.int(3, 12);
    suku = Array.from({ length: 6 }, (_, i) => a + b * i);
    jelas = t(`Selalu ditambah ${b}.`, `Add ${b} each time.`);
  } else if (jenis === 1) {
    const a = acak.int(1, 5), r = acak.int(2, 3);
    suku = Array.from({ length: 6 }, (_, i) => a * r ** i);
    jelas = t(`Selalu dikali ${r}.`, `Multiply by ${r} each time.`);
  } else if (jenis === 2) {
    const a = acak.int(2, 10), b = acak.int(1, 4);
    let x = a;
    suku = [x];
    for (let i = 1; i < 6; i++) {
      x += b + (i - 1) * 2;
      suku.push(x);
    }
    jelas = t(`Selisihnya bertambah 2: +${b}, +${b + 2}, +${b + 4}, dan seterusnya.`, `The gap grows by 2: +${b}, +${b + 2}, +${b + 4}, and so on.`);
  } else if (jenis === 3) {
    const a = acak.int(10, 40), b = acak.int(2, 6), c = acak.int(2, 5);
    suku = [a];
    for (let i = 1; i < 6; i++) suku.push(i % 2 ? suku[i - 1] + b : suku[i - 1] - c);
    jelas = t(`Bergantian +${b} dan -${c}.`, `Alternates +${b} and -${c}.`);
  } else {
    const a = acak.int(1, 4);
    suku = Array.from({ length: 6 }, (_, i) => (a + i) ** 2);
    jelas = t("Bilangan kuadrat berurutan.", "Consecutive square numbers.");
  }
  const benar = suku[5];
  return {
    q: t(`Lanjutkan deret: ${suku.slice(0, 5).join(", ")}, …`, `Continue the series: ${suku.slice(0, 5).join(", ")}, …`),
    ...susunPilihan(acak, benar, [benar + 1, benar - 2, benar + acak.int(3, 7), benar - acak.int(3, 6), benar + 10]),
    e: jelas,
    bagian: t("Deret angka", "Number series"),
  };
}

function hitungan(acak) {
  const jenis = acak.int(0, 3);
  if (jenis === 0) {
    const p = acak.pilih([10, 15, 20, 25, 30, 40]), h = acak.int(4, 30) * 10000;
    const b = h - (h * p) / 100;
    return { q: t(`Harga barang Rp${rp(h)} mendapat diskon ${p}%. Berapa yang harus dibayar?`, `An item costs Rp${rp(h)} with a ${p}% discount. How much do you pay?`), ...susunPilihan(acak, `Rp${rp(b)}`, [`Rp${rp(b + 5000)}`, `Rp${rp((h * p) / 100)}`, `Rp${rp(b - 10000)}`, `Rp${rp(h)}`]), e: t(`${rp(h)} - ${p}% × ${rp(h)} = ${rp(b)}.`, `${rp(h)} - ${p}% × ${rp(h)} = ${rp(b)}.`), bagian: t("Aritmetika", "Arithmetic") };
  }
  if (jenis === 1) {
    const a = acak.int(3, 9), b = acak.int(2, 6), orang = a * acak.int(2, 4), hari = b * acak.int(2, 4);
    const hasil = (orang * hari) / a;
    return { q: t(`${orang} pekerja menyelesaikan proyek dalam ${hari} hari. Jika hanya ada ${a} pekerja, berapa hari yang dibutuhkan?`, `${orang} workers finish a project in ${hari} days. With only ${a} workers, how many days does it take?`), ...susunPilihan(acak, hasil, [hasil + a, hari, hasil - b, hasil * 2]), e: t(`Perbandingan berbalik nilai: ${orang} × ${hari} ÷ ${a} = ${hasil}.`, `Inverse proportion: ${orang} × ${hari} ÷ ${a} = ${hasil}.`), bagian: t("Soal cerita", "Word problems") };
  }
  if (jenis === 2) {
    const a = acak.int(12, 98), b = acak.int(12, 98), c = acak.int(2, 9);
    const hasil = a + b * c;
    return { q: t(`Berapa hasil ${a} + ${b} × ${c}?`, `What is ${a} + ${b} × ${c}?`), ...susunPilihan(acak, hasil, [(a + b) * c, hasil + 10, hasil - c, a * b + c]), e: t("Kali dikerjakan lebih dulu daripada tambah.", "Multiplication comes before addition."), bagian: t("Aritmetika", "Arithmetic") };
  }
  const total = acak.int(6, 15) * 10, p = acak.pilih([20, 25, 30, 40, 60]);
  const hasil = (total * p) / 100;
  return { q: t(`Dari ${total} pelamar, ${p}% lolos tes tertulis. Berapa orang yang lolos?`, `Of ${total} applicants, ${p}% pass the written test. How many pass?`), ...susunPilihan(acak, hasil, [hasil + 5, total - hasil, hasil - 3, p]), e: t(`${p}% × ${total} = ${hasil}.`, `${p}% × ${total} = ${hasil}.`), bagian: t("Soal cerita", "Word problems") };
}

function soalNumerik(acak, n = 20) {
  const hasil = [];
  const sudah = new Set();
  for (let coba = 0; hasil.length < n && coba < n * 20; coba++) {
    const soal = hasil.length % 2 ? hitungan(acak) : deret(acak);
    if (sudah.has(soal.q)) continue;
    sudah.add(soal.q);
    hasil.push(soal);
  }
  return hasil;
}

/* ---------------------------------------------------- logika */

const LOGIKA = [
  [t("Semua karyawan tetap mendapat asuransi. Dina adalah karyawan tetap. Kesimpulan:", "All permanent staff get insurance. Dina is permanent staff. Conclusion:"), t("Dina mendapat asuransi", "Dina gets insurance"), [t("Dina tidak mendapat asuransi", "Dina gets no insurance"), t("Semua yang punya asuransi adalah Dina", "Everyone insured is Dina"), t("Tidak dapat disimpulkan", "Cannot be concluded")]],
  [t("Semua manajer hadir rapat. Sebagian yang hadir rapat adalah staf baru. Kesimpulan:", "All managers attend the meeting. Some attendees are new staff. Conclusion:"), t("Tidak dapat disimpulkan apakah ada manajer yang staf baru", "We can't tell whether any manager is new staff"), [t("Semua manajer adalah staf baru", "All managers are new staff"), t("Sebagian manajer adalah staf baru", "Some managers are new staff"), t("Tidak ada manajer yang staf baru", "No manager is new staff")]],
  [t("Jika hujan, jalan macet. Hari ini jalan tidak macet. Kesimpulan:", "If it rains, traffic jams. Today there's no jam. Conclusion:"), t("Hari ini tidak hujan", "It isn't raining today"), [t("Hari ini hujan", "It's raining today"), t("Besok akan hujan", "It will rain tomorrow"), t("Tidak dapat disimpulkan", "Cannot be concluded")]],
  [t("Tidak ada pelamar yang terlambat diterima. Budi terlambat. Kesimpulan:", "No late applicant is accepted. Budi was late. Conclusion:"), t("Budi tidak diterima", "Budi isn't accepted"), [t("Budi diterima", "Budi is accepted"), t("Budi mungkin diterima", "Budi might be accepted"), t("Semua yang tidak terlambat diterima", "Everyone on time is accepted")]],
  [t("Jika target tercapai, tim mendapat bonus. Tim mendapat bonus. Kesimpulan yang PASTI benar:", "If the target is met, the team gets a bonus. The team got a bonus. What MUST be true?"), t("Tidak dapat dipastikan target tercapai", "We can't be sure the target was met"), [t("Target pasti tercapai", "The target was definitely met"), t("Target tidak tercapai", "The target wasn't met"), t("Bonus diberikan setiap bulan", "Bonuses are monthly")]],
  [t("A lebih tinggi dari B. C lebih pendek dari B. D lebih tinggi dari A. Siapa yang paling pendek?", "A is taller than B. C is shorter than B. D is taller than A. Who is shortest?"), "C", ["A", "B", "D"]],
  [t("Rapat dimulai setelah presentasi Ani, tetapi sebelum presentasi Joko. Presentasi Ani setelah sambutan. Urutan yang benar:", "The meeting starts after Ani's talk but before Joko's. Ani's talk is after the opening. Correct order:"), t("Sambutan, Ani, rapat, Joko", "Opening, Ani, meeting, Joko"), [t("Ani, sambutan, rapat, Joko", "Ani, opening, meeting, Joko"), t("Sambutan, rapat, Ani, Joko", "Opening, meeting, Ani, Joko"), t("Joko, rapat, Ani, sambutan", "Joko, meeting, Ani, opening")]],
  [t("Lima kandidat duduk berjajar. Rina di ujung kiri. Sari tepat di sebelah kanan Rina. Tono di tengah. Siapa yang duduk di posisi kedua dari kiri?", "Five candidates sit in a row. Rina is far left. Sari is right next to Rina. Tono is in the middle. Who sits second from the left?"), "Sari", ["Rina", "Tono", t("Tidak dapat ditentukan", "Can't be determined")]],
  [t("Semua laporan diperiksa supervisor. Laporan X belum diperiksa supervisor. Kesimpulan:", "All reports are checked by a supervisor. Report X hasn't been checked. Conclusion:"), t("Laporan X belum termasuk laporan yang diserahkan", "Report X isn't yet among the submitted reports"), [t("Supervisor lalai", "The supervisor was negligent"), t("Laporan X salah", "Report X is wrong"), t("Semua laporan belum diperiksa", "No report has been checked")]],
  [t("Kantor buka Senin sampai Jumat. Hari ini kantor tutup dan bukan hari libur nasional. Hari ini adalah…", "The office opens Monday to Friday. It's closed today and it isn't a public holiday. Today is…"), t("Sabtu atau Minggu", "Saturday or Sunday"), [t("Jumat", "Friday"), t("Senin", "Monday"), t("Tidak dapat ditentukan", "Can't be determined")]],
  [t("Harga P lebih mahal dari Q. Harga R lebih murah dari Q. Pernyataan yang benar:", "P costs more than Q. R costs less than Q. Which is true?"), t("P lebih mahal dari R", "P costs more than R"), [t("R lebih mahal dari P", "R costs more than P"), t("Q paling murah", "Q is cheapest"), t("P sama dengan R", "P equals R")]],
  [t("Jika lulus tes tertulis, kandidat ikut wawancara. Jika ikut wawancara, kandidat mendapat jadwal FGD. Rudi lulus tes tertulis. Kesimpulan:", "If candidates pass the written test, they're interviewed. If interviewed, they get an FGD slot. Rudi passed the written test. Conclusion:"), t("Rudi mendapat jadwal FGD", "Rudi gets an FGD slot"), [t("Rudi tidak diwawancara", "Rudi isn't interviewed"), t("Rudi diterima kerja", "Rudi is hired"), t("Tidak dapat disimpulkan", "Cannot be concluded")]],
  [t("Sebagian karyawan bekerja remote. Semua yang bekerja remote memakai laptop kantor. Kesimpulan:", "Some staff work remotely. Everyone remote uses a company laptop. Conclusion:"), t("Sebagian karyawan memakai laptop kantor", "Some staff use a company laptop"), [t("Semua karyawan memakai laptop kantor", "All staff use a company laptop"), t("Tidak ada karyawan yang memakai laptop kantor", "No staff use a company laptop"), t("Semua yang memakai laptop bekerja remote", "Everyone with a laptop works remotely")]],
  [t("Tim A menyelesaikan proyek lebih cepat dari tim B. Tim C lebih lambat dari tim B. Tim D lebih cepat dari tim A. Tim yang paling lambat adalah…", "Team A finishes faster than B. C is slower than B. D is faster than A. The slowest team is…"), t("Tim C", "Team C"), [t("Tim A", "Team A"), t("Tim B", "Team B"), t("Tim D", "Team D")]],
  [t("Semua peserta FGD wajib memberi pendapat. Mira tidak memberi pendapat. Kesimpulan:", "All FGD participants must give an opinion. Mira gave none. Conclusion:"), t("Mira bukan peserta FGD", "Mira isn't an FGD participant"), [t("Mira peserta FGD", "Mira is an FGD participant"), t("Mira gugur", "Mira is eliminated"), t("Tidak dapat disimpulkan", "Cannot be concluded")]],
];

function soalLogika(acak, n = 15) {
  return acak.kocok(LOGIKA).slice(0, n).map(([q, b, x]) => ({ q, ...susunPilihan(acak, b, x), e: t(`Jawaban: ${b}.`, `Answer: ${b}.`), bagian: t("Penalaran", "Reasoning") }));
}

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

function soalKetelitian(acak, n = 30) {
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

export const JENIS_TES = [
  {
    id: "kraepelin",
    nama: t("Tes Kraepelin (Pauli)", "Kraepelin (Pauli) test"),
    ikon: "Columns3",
    ket: t("Menjumlahkan angka berpasangan secepat dan seteliti mungkin. Mengukur kecepatan, ketelitian, keajegan, dan daya tahan kerja.", "Add pairs of digits as fast and accurately as you can. Measures speed, accuracy, consistency, and endurance."),
    info: t(`${KRAEPELIN.kolom} kolom · ${KRAEPELIN.detikPerKolom} detik per kolom`, `${KRAEPELIN.kolom} columns · ${KRAEPELIN.detikPerKolom} s per column`),
    menit: Math.ceil((KRAEPELIN.kolom * KRAEPELIN.detikPerKolom) / 60),
  },
  { id: "verbal", nama: t("TPA Verbal", "Verbal aptitude"), ikon: "BookA", ket: t("Sinonim, antonim, analogi, dan pengelompokan kata.", "Synonyms, antonyms, analogies, and odd-one-out."), info: t("20 soal · 12 menit", "20 questions · 12 minutes"), menit: 12 },
  { id: "numerik", nama: t("TPA Numerik", "Numerical aptitude"), ikon: "Sigma", ket: t("Deret angka, hitungan cepat, persen, dan soal cerita.", "Number series, quick maths, percentages, and word problems."), info: t("20 soal · 15 menit", "20 questions · 15 minutes"), menit: 15 },
  { id: "logika", nama: t("Penalaran Logis", "Logical reasoning"), ikon: "Brain", ket: t("Silogisme, urutan, dan penarikan kesimpulan.", "Syllogisms, ordering, and drawing conclusions."), info: t("15 soal · 12 menit", "15 questions · 12 minutes"), menit: 12 },
  { id: "ketelitian", nama: t("Tes Ketelitian", "Accuracy test"), ikon: "ScanSearch", ket: t("Bandingkan pasangan nama, nomor, dan alamat: sama atau berbeda. Umum untuk posisi admin dan bank.", "Compare pairs of names, numbers, and addresses: same or different. Common for admin and banking roles."), info: t("30 soal · 5 menit", "30 questions · 5 minutes"), menit: 5 },
  { id: "kepribadian", nama: t("Tes Kepribadian Kerja", "Work personality test"), ikon: "UserRound", ket: t("25 pernyataan tentang caramu bekerja. Tidak ada jawaban benar atau salah; hasilnya profil lima dimensi kepribadian.", "25 statements about how you work. No right or wrong answers; you get a five-dimension personality profile."), info: t("25 pernyataan · tanpa batas waktu", "25 statements · no time limit"), menit: 0 },
];

export const cariTes = (id) => JENIS_TES.find((x) => x.id === id) || null;

/** Soal untuk satu tes. Contoh (gratis) memakai 3 soal saja. */
export function buatSoal(jenis, benih, contoh = false) {
  const acak = buatAcak(benih);
  const daftar =
    jenis === "verbal" ? soalVerbal(acak)
      : jenis === "numerik" ? soalNumerik(acak)
        : jenis === "logika" ? soalLogika(acak)
          : jenis === "ketelitian" ? soalKetelitian(acak)
            : jenis === "kepribadian" ? soalKepribadian(acak)
              : [];
  return contoh ? daftar.slice(0, jenis === "kepribadian" ? 5 : 3) : daftar;
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
