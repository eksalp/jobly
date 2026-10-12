/**
 * Mengubah deskripsi loker hasil scraping menjadi blok-blok rapi
 * (judul bagian, paragraf, daftar poin) untuk halaman detail.
 *
 * Deskripsi dari bot datang dalam dua bentuk:
 *  1. Markdown dari JobSpy (LinkedIn/Indeed): ada baris baru, "- " untuk
 *     poin, **tebal**, dan karakter escape seperti "\-".
 *  2. Satu blok teks panjang dari scraper situs perusahaan (mis. BCA),
 *     kadang berisi isi halaman yang terulang dua kali.
 *
 * Hasilnya array blok: { jenis: "judul" | "paragraf" | "daftar", ... }.
 * Tidak ada HTML yang dirender langsung — aman dari injeksi.
 */

const JUDUL_DIKENAL = [
  "Tentang Pekerjaan",
  "Deskripsi Pekerjaan",
  "Uraian Pekerjaan",
  "Tanggung Jawab",
  "Tugas dan Tanggung Jawab",
  "Persyaratan",
  "Kualifikasi",
  "Keahlian",
  "Benefit",
  "Fasilitas",
  "Tunjangan",
  "Tahapan Seleksi",
  "Lokasi Penempatan",
  "Lokasi Tes",
  "Informasi Tambahan",
  "Tentang Kami",
  "Tentang Perusahaan",
  "Job Description",
  "Job Descriptions",
  "Job Requirements",
  "Job Responsibilities",
  "Key Responsibilities",
  "Responsibilities",
  "Requirements",
  "Qualifications",
  "Minimum Qualifications",
  "Preferred Qualifications",
  "Benefits",
  "What You'll Do",
  "What You Will Do",
  "What We Offer",
  "About The Role",
  "About the role",
  "About Us",
  "Skills",
];

const POLA_JUDUL = new RegExp(
  `^(${JUDUL_DIKENAL.map((j) => j.replace(/[.*+?^${}()|[\]\\']/g, "\\$&")).join("|")})\\s*:?$`,
  "i",
);

/** Buang salinan kedua kalau isi halaman terulang (khas scraper situs). */
function buangPengulangan(teks) {
  if (teks.length < 600) return teks;
  const contoh = teks.slice(40, 200);
  const ulang = teks.indexOf(contoh, 200);
  if (ulang > teks.length * 0.3) {
    return teks.slice(0, ulang - 40).trim();
  }
  return teks;
}

/** Sisipkan baris baru di teks satu-blok supaya bisa dipecah. */
function pecahBlok(teks) {
  let t = teks;
  // Sebelum dan sesudah judul bagian (huruf kapital di awal kata —
  // supaya kata yang sama di tengah kalimat tidak ikut terpotong)
  for (const j of JUDUL_DIKENAL) {
    const pola = new RegExp(
      `\\s(${j.replace(/[.*+?^${}()|[\]\\']/g, "\\$&")})\\s`,
      "g",
    );
    t = t.replace(pola, "\n\n$1\n");
  }
  // Poin berlambang
  t = t.replace(/\s*[•●▪]\s*/g, "\n• ");
  return t;
}

function bersihkanBaris(s) {
  return s
    .replace(/\\([\\`*_{}[\]()#+\-.!|>~])/g, "$1") // escape markdown
    .replace(/\s+/g, " ")
    .trim();
}

/** Pecah teks menjadi potongan biasa & tebal (**...**). */
export function potongTebal(s) {
  const hasil = [];
  const pola = /\*\*(.+?)\*\*/g;
  let akhir = 0;
  let m;
  while ((m = pola.exec(s))) {
    if (m.index > akhir) hasil.push({ tebal: false, teks: s.slice(akhir, m.index) });
    hasil.push({ tebal: true, teks: m[1] });
    akhir = m.index + m[0].length;
  }
  if (akhir < s.length) hasil.push({ tebal: false, teks: s.slice(akhir) });
  return hasil;
}

export function formatDeskripsi(mentah, judul = "") {
  if (!mentah) return [];
  let teks = String(mentah).replace(/\r/g, "").trim();

  // Halaman situs perusahaan sering diawali judul lowongan itu sendiri
  if (judul && teks.toLowerCase().startsWith(judul.toLowerCase())) {
    teks = teks.slice(judul.length).replace(/^[\s:\-–]+/, "");
  }
  teks = buangPengulangan(teks);

  const jumlahBaris = (teks.match(/\n/g) || []).length;
  if (jumlahBaris < 3 && teks.length > 300) teks = pecahBlok(teks);

  const blok = [];
  let paragraf = [];
  let daftar = null;

  const tutupParagraf = () => {
    if (paragraf.length) {
      blok.push({ jenis: "paragraf", teks: paragraf.join(" ") });
      paragraf = [];
    }
  };
  const tutupDaftar = () => {
    if (daftar?.length) blok.push({ jenis: "daftar", butir: daftar });
    daftar = null;
  };

  for (const asli of teks.split("\n")) {
    const baris = bersihkanBaris(asli);

    if (!baris) {
      tutupParagraf();
      tutupDaftar();
      continue;
    }

    // Poin daftar
    const poin = baris.match(/^(?:[-*•·–]|\d{1,2}[.)])\s+(.*)$/);
    if (poin) {
      tutupParagraf();
      daftar = daftar || [];
      daftar.push(poin[1]);
      continue;
    }

    // Judul: markdown "#", baris tebal penuh, judul dikenal, atau baris
    // pendek berakhiran titik dua
    const judulMd = baris.match(/^#{1,6}\s+(.*)$/);
    const tebalPenuh = baris.match(/^\*\*(.+?)\*\*:?$/);
    const tanpaTebal = baris.replace(/\*\*/g, "");
    if (
      judulMd ||
      tebalPenuh ||
      POLA_JUDUL.test(tanpaTebal) ||
      (tanpaTebal.length <= 48 && /:$/.test(tanpaTebal))
    ) {
      tutupParagraf();
      tutupDaftar();
      const isi = (judulMd?.[1] || tebalPenuh?.[1] || tanpaTebal)
        .replace(/\*\*/g, "")
        .replace(/:$/, "");
      blok.push({ jenis: "judul", teks: isi });
      continue;
    }

    tutupDaftar();
    paragraf.push(baris);
  }
  tutupParagraf();
  tutupDaftar();

  const satuBlok = jumlahBaris < 3;
  return rapikan(blok, satuBlok);
}

// Teks sisa tampilan situs asal yang ikut terambil scraper
const SAMPAH = [
  /^(share|daftar|share daftar|bagikan|apply|apply now|lamar|lamar sekarang|simpan)$/i,
  /maaf,? (job|lowongan) saat ini tidak tersedia/i,
  /^karir lainnya/i,
];
const sampah = (s) => SAMPAH.some((p) => p.test(s.trim()));

// Kata yang lazim membuka butir persyaratan / tanggung jawab. Dipakai untuk
// memecah daftar yang kehilangan lambang poinnya saat di-scrape.
const AWAL_BUTIR =
  "Pendidikan|Menyukai|Mempunyai|Memiliki|Mampu|Bersedia|Berusia|Usia|Pengalaman|Berpengalaman|Menguasai|Memahami|Lulusan|Diutamakan|Terbiasa|Sehat|Jujur|Teliti|Dapat|Siap|Domisili|Penempatan|Wanita|Pria|Menyusun|Melakukan|Membuat|Mengelola|Bertanggung|Berkoordinasi|Memastikan|Mengembangkan|Menganalisis|Menyiapkan|Melaksanakan|Bekerja|Menangani|Memonitor|Mencatat|Gaji|Tunjangan|BPJS|Bonus|Asuransi|Kesempatan|Lingkungan|Experience|Bachelor|Strong|Excellent|Proficient|Ability|Able|Knowledge|Minimum|Fluent|Willing|Must|Familiarity|Degree|Responsible|Manage|Develop|Ensure|Build|Lead|Collaborate|Support|Create|Maintain|Analyze|Prepare|Coordinate|Competitive|Health";
const POLA_PECAH = new RegExp(`(?<=[a-z0-9)%])\\s+(?=(?:${AWAL_BUTIR})\\b)`, "g");

function jadikanButir(teks) {
  // Tahapan bernomor: "1 SELEKSI ADMINISTRASI 2 TES ONLINE 3 ..."
  if (/^1\s+[A-Z]/.test(teks) && /\s2\s+[A-Z]/.test(teks)) {
    const butir = teks
      .split(/\s*\b\d{1,2}\s+(?=[A-Z])/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) =>
        s === s.toUpperCase()
          ? s.charAt(0) + s.slice(1).toLowerCase()
          : s,
      );
    if (butir.length >= 3) return butir;
  }
  const potong = teks.split(POLA_PECAH).map((s) => s.trim()).filter(Boolean);
  if (potong.length >= 3 && potong.every((s) => s.length >= 12)) return potong;
  return null;
}

function rapikan(blok, satuBlok) {
  // 1. Buang sampah dan isi yang terulang (halaman tersalin dua kali)
  const sudah = new Set();
  let hasil = [];
  for (const b of blok) {
    if (b.jenis === "daftar") {
      const butir = b.butir.filter((s) => !sampah(s));
      const kunci = butir.join("|");
      if (!butir.length || sudah.has(kunci)) continue;
      sudah.add(kunci);
      hasil.push({ ...b, butir });
    } else if (b.jenis === "paragraf") {
      if (sampah(b.teks) || sudah.has(b.teks)) continue;
      sudah.add(b.teks);
      hasil.push(b);
    } else {
      hasil.push(b);
    }
  }

  // 2. Judul tanpa isi (karena isinya terbuang di langkah 1) ikut dibuang
  hasil = hasil.filter(
    (b, i) => b.jenis !== "judul" || (hasil[i + 1] && hasil[i + 1].jenis !== "judul"),
  );

  // 3. Teks satu-blok: kembalikan poin yang hilang lambangnya
  if (satuBlok) {
    hasil = hasil.map((b) => {
      if (b.jenis !== "paragraf") return b;
      const butir = jadikanButir(b.teks);
      return butir ? { jenis: "daftar", butir } : b;
    });
  }

  // 4. Paragraf yang sangat panjang dipecah per 3 kalimat agar enak dibaca
  return hasil.flatMap((b) => {
    if (b.jenis !== "paragraf" || b.teks.length < 650) return [b];
    const kalimat = b.teks.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [b.teks];
    const potong = [];
    for (let i = 0; i < kalimat.length; i += 3) {
      potong.push({ jenis: "paragraf", teks: kalimat.slice(i, i + 3).join("").trim() });
    }
    return potong;
  });
}
