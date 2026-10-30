/**
 * Cover Letter Builder: kerangka per situasi dan pemeriksaan otomatis.
 *
 * Kerangka dan pemeriksaan berjalan di browser tanpa AI (gratis untuk semua
 * pengguna). Analisis AI ada di edge function analisis-cover-letter.
 *
 * Teks di dalam [kurung siku] adalah bagian yang wajib diganti pengguna;
 * pemeriksaan akan menandainya selama masih ada.
 */

export const SITUASI = [
  { id: "fresh", nama: "Fresh graduate", ket: "Baru lulus, pengalaman dari kuliah, magang, atau organisasi" },
  { id: "pengalaman", nama: "Sudah berpengalaman", ket: "Pernah bekerja di bidang yang sama atau mirip" },
  { id: "pindah", nama: "Pindah bidang", ket: "Melamar ke bidang yang berbeda dari pekerjaan sekarang" },
  { id: "magang", nama: "Magang", ket: "Masih kuliah atau baru lulus, melamar program magang" },
  { id: "remote", nama: "Remote / luar negeri", ket: "Melamar kerja jarak jauh atau ke perusahaan asing" },
];

const P = (v, cadangan) => (v && v.trim() ? v.trim() : cadangan);

const KERANGKA = {
  ID: {
    fresh: (d) => ({
      pembuka: `Saya ingin melamar posisi ${P(d.posisi, "[posisi]")} di ${P(d.perusahaan, "[nama perusahaan]")} yang saya temukan melalui ${P(d.sumber, "[sumber lowongan]")}. Sebagai lulusan [jurusan] dari [nama kampus], saya tertarik dengan posisi ini karena [alasan spesifik: produk, nilai, atau proyek perusahaan yang kamu kagumi].`,
      isi: [
        `Selama kuliah, saya [pengalaman paling relevan: magang, proyek, atau organisasi]. Di sana saya [apa yang kamu kerjakan] menggunakan [alat atau keahlian], dan hasilnya [hasil yang bisa diukur, misalnya waktu yang dihemat atau jumlah peserta].`,
        `Pengalaman tersebut melatih [2-3 keahlian yang dicari di lowongan], yang menurut saya sangat dibutuhkan untuk posisi ${P(d.posisi, "[posisi]")}. Saya juga terbiasa [cara kerja yang relevan, misalnya bekerja dengan tenggat ketat atau berkoordinasi lintas tim].`,
      ],
      penutup: `Saya akan sangat senang mendapat kesempatan wawancara untuk menjelaskan bagaimana saya bisa berkontribusi di ${P(d.perusahaan, "[nama perusahaan]")}. Terima kasih atas waktu dan perhatian Bapak/Ibu.`,
    }),
    pengalaman: (d) => ({
      pembuka: `Saya ingin melamar posisi ${P(d.posisi, "[posisi]")} di ${P(d.perusahaan, "[nama perusahaan]")}. Dengan pengalaman [jumlah] tahun sebagai [jabatan sekarang] di [perusahaan sekarang], saya yakin bisa langsung berkontribusi pada [kebutuhan utama di lowongan].`,
      isi: [
        `Di posisi saya saat ini, saya bertanggung jawab atas [tanggung jawab utama]. Salah satu pencapaian yang paling relevan adalah [pencapaian dengan angka, misalnya menurunkan waktu proses dari 5 hari menjadi 2 hari].`,
        `Saya tertarik bergabung dengan ${P(d.perusahaan, "[nama perusahaan]")} karena [alasan spesifik]. Pengalaman saya dalam [keahlian yang cocok dengan lowongan] sejalan dengan kebutuhan tim untuk [tantangan atau target yang disebut di lowongan].`,
      ],
      penutup: `Saya terbuka untuk berdiskusi lebih lanjut mengenai bagaimana pengalaman saya dapat membantu tim ${P(d.perusahaan, "[nama perusahaan]")}. Terima kasih atas waktu dan pertimbangan Bapak/Ibu.`,
    }),
    pindah: (d) => ({
      pembuka: `Saya ingin melamar posisi ${P(d.posisi, "[posisi]")} di ${P(d.perusahaan, "[nama perusahaan]")}. Setelah [jumlah] tahun bekerja di bidang [bidang lama], saya memutuskan untuk berfokus pada [bidang baru] dan sudah mempersiapkan diri secara serius untuk peran ini.`,
      isi: [
        `Pengalaman saya sebagai [jabatan lama] membekali saya dengan [2-3 keahlian yang bisa dipindahkan, misalnya analisis data, komunikasi dengan klien, atau manajemen proyek]. Misalnya, saya pernah [contoh nyata yang relevan dengan posisi baru].`,
        `Untuk menutup kekurangan di bidang baru, saya telah [kursus, sertifikasi, atau proyek pribadi], termasuk [hasil konkret, misalnya portofolio atau proyek yang sudah selesai].`,
      ],
      penutup: `Saya percaya kombinasi pengalaman tersebut dapat memberi sudut pandang yang berbeda bagi tim ${P(d.perusahaan, "[nama perusahaan]")}. Saya akan senang mendapat kesempatan wawancara. Terima kasih atas perhatian Bapak/Ibu.`,
    }),
    magang: (d) => ({
      pembuka: `Saya ${P(d.nama, "[nama]")}, mahasiswa [semester] jurusan [jurusan] di [nama kampus], ingin melamar program ${P(d.posisi, "[posisi magang]")} di ${P(d.perusahaan, "[nama perusahaan]")} untuk periode [bulan sampai bulan].`,
      isi: [
        `Melalui [mata kuliah, proyek, atau organisasi], saya sudah terbiasa [keahlian yang relevan]. Salah satu proyek yang paling saya banggakan adalah [proyek dan hasilnya].`,
        `Saya ingin magang di ${P(d.perusahaan, "[nama perusahaan]")} karena [alasan spesifik], dan saya siap belajar cepat serta mengikuti ritme kerja tim.`,
      ],
      penutup: `Saya dapat bekerja [penuh waktu atau paruh waktu] dan bersedia mengikuti wawancara kapan pun dibutuhkan. Terima kasih atas kesempatan yang Bapak/Ibu berikan.`,
    }),
    remote: (d) => ({
      pembuka: `Saya ingin melamar posisi ${P(d.posisi, "[posisi]")} di ${P(d.perusahaan, "[nama perusahaan]")}. Saya sudah [jumlah] tahun bekerja secara jarak jauh sebagai [jabatan] dan terbiasa bekerja mandiri dengan komunikasi tertulis yang jelas.`,
      isi: [
        `Dalam pekerjaan terakhir, saya [pencapaian terukur] bersama tim yang tersebar di [zona waktu atau negara]. Saya terbiasa memakai [alat kerja: Slack, Notion, Jira, dan sebagainya].`,
        `Saya bekerja dari ${P(d.kota, "[kota]")} dan bisa menyesuaikan [jam tumpang tindih dengan tim].`,
      ],
      penutup: `Saya akan senang berdiskusi lebih lanjut melalui panggilan video. Terima kasih atas waktu Bapak/Ibu.`,
    }),
  },
  EN: {
    fresh: (d) => ({
      pembuka: `I am writing to apply for the ${P(d.posisi, "[position]")} role at ${P(d.perusahaan, "[company]")}, which I found on ${P(d.sumber, "[job source]")}. As a recent [major] graduate from [university], I am drawn to this role because [specific reason: product, values, or a project you admire].`,
      isi: [
        `During my studies, I [most relevant experience: internship, project, or organisation]. I [what you did] using [tools or skills], which resulted in [measurable outcome].`,
        `This experience strengthened my [2-3 skills from the job post], which I believe are key for this position. I am also comfortable [relevant way of working, e.g. meeting tight deadlines or coordinating across teams].`,
      ],
      penutup: `I would welcome the opportunity to discuss how I can contribute to ${P(d.perusahaan, "[company]")}. Thank you for your time and consideration.`,
    }),
    pengalaman: (d) => ({
      pembuka: `I am writing to apply for the ${P(d.posisi, "[position]")} role at ${P(d.perusahaan, "[company]")}. With [number] years of experience as a [current role] at [current company], I can contribute quickly to [main need in the job post].`,
      isi: [
        `In my current role, I am responsible for [key responsibility]. One of my most relevant achievements is [achievement with numbers].`,
        `I am excited about ${P(d.perusahaan, "[company]")} because [specific reason]. My experience in [matching skills] fits the team's goal to [challenge or target from the post].`,
      ],
      penutup: `I would be glad to discuss how my experience can support your team. Thank you for your time and consideration.`,
    }),
    pindah: (d) => ({
      pembuka: `I am writing to apply for the ${P(d.posisi, "[position]")} role at ${P(d.perusahaan, "[company]")}. After [number] years in [previous field], I have made a deliberate move into [new field] and prepared seriously for this role.`,
      isi: [
        `My work as a [previous role] gave me strong [2-3 transferable skills]. For example, I [concrete example relevant to the new role].`,
        `To close the gap, I have completed [courses, certifications, or personal projects], including [concrete result such as a portfolio project].`,
      ],
      penutup: `I believe this mix of experience brings a useful perspective to your team, and I would welcome the chance to talk further. Thank you for your consideration.`,
    }),
    magang: (d) => ({
      pembuka: `I am a [year] [major] student at [university], applying for the ${P(d.posisi, "[internship]")} at ${P(d.perusahaan, "[company]")} for [period].`,
      isi: [
        `Through [courses, projects, or organisations], I have practised [relevant skills]. The project I am most proud of is [project and result].`,
        `I want to intern at ${P(d.perusahaan, "[company]")} because [specific reason], and I am ready to learn quickly and keep up with the team.`,
      ],
      penutup: `I am available [full-time or part-time] and happy to interview at your convenience. Thank you for considering my application.`,
    }),
    remote: (d) => ({
      pembuka: `I am writing to apply for the ${P(d.posisi, "[position]")} role at ${P(d.perusahaan, "[company]")}. I have worked remotely for [number] years as a [role] and I am used to working independently with clear written communication.`,
      isi: [
        `In my most recent role, I [measurable achievement] with a team spread across [time zones or countries]. I work daily with [tools: Slack, Notion, Jira, etc.].`,
        `I am based in ${P(d.kota, "[city]")}, Indonesia, and can overlap [hours] with your team's working hours.`,
      ],
      penutup: `I would be happy to continue the conversation on a video call. Thank you for your time.`,
    }),
  },
};

export function isiKerangka(situasi, bahasa, d) {
  const set = KERANGKA[bahasa === "EN" ? "EN" : "ID"];
  return (set[situasi] || set.fresh)(d);
}

export const salamAwal = (bahasa, d) =>
  bahasa === "EN" ? (d.penerimaNama?.trim() ? `Dear ${d.penerimaNama.trim()},` : "Dear Hiring Manager,") : "Dengan hormat,";
export const salamAkhir = (bahasa) => (bahasa === "EN" ? "Sincerely," : "Hormat saya,");

export const BULAN = {
  ID: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
  EN: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

export function tanggalSurat(iso, bahasa) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return "";
  const b = BULAN[bahasa === "EN" ? "EN" : "ID"][Number(m[2]) - 1];
  return bahasa === "EN" ? `${b} ${Number(m[3])}, ${m[1]}` : `${Number(m[3])} ${b} ${m[1]}`;
}

export const hariIni = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const KOSONG = {
  bahasa: "ID",
  nama: "",
  email: "",
  telepon: "",
  kota: "",
  linkedin: "",
  tanggal: "",
  penerimaNama: "",
  penerimaJabatan: "",
  perusahaan: "",
  alamat: "",
  posisi: "",
  sumber: "",
  salam: "",
  pembuka: "",
  isi: [""],
  penutup: "",
  salamPenutup: "",
  lampiran: "",
  gaya: { font: "helvetica", tema: "formal", aksen: "hitam" },
};

export const TEMA_CL = [
  { id: "formal", nama: "Formal", ket: "Format surat lamaran resmi: tempat dan tanggal, perihal, tujuan surat" },
  { id: "modern", nama: "Modern", ket: "Nama besar berwarna aksen di atas, kontak satu baris" },
  { id: "ringkas", nama: "Ringkas", ket: "Tanpa kepala surat, cocok ditempel di badan email" },
];

/* ------------------------------------------------------------ teks */

export const badanSurat = (d) => [d.pembuka, ...(d.isi || []), d.penutup].map((x) => (x || "").trim()).filter(Boolean);

export const hitungKata = (s) => (s || "").split(/\s+/).filter(Boolean).length;

/** Seluruh surat sebagai teks biasa (untuk badan email dan analisis AI). */
export function suratKeTeks(d) {
  const en = d.bahasa === "EN";
  const baris = [];
  baris.push(d.salam || salamAwal(d.bahasa, d), "");
  badanSurat(d).forEach((p) => baris.push(p, ""));
  baris.push(d.salamPenutup || salamAkhir(d.bahasa), d.nama || (en ? "[Your name]" : "[Nama]"));
  const kontak = [d.telepon, d.email, d.linkedin].filter((x) => x && x.trim());
  if (kontak.length) baris.push(kontak.join(" | "));
  return baris.join("\n");
}

/* ------------------------------------------------------------ pemeriksaan */

const KLISE = [
  "pekerja keras", "dinamis", "passionate", "berdedikasi tinggi", "kandidat terbaik", "kandidat yang tepat",
  "fast learner", "team player", "hard worker", "go-getter", "think outside the box", "results-driven",
  "jujur dan bertanggung jawab", "mampu bekerja di bawah tekanan", "dear sir/madam", "to whom it may concern",
];

const AJAKAN = /wawancara|interview|diskusi|berdiskusi|bertemu|berbincang|panggilan|discuss|conversation|talk|call|meet/i;
const PEMBUKA_USANG = /^(saya yang bertanda tangan|melalui surat ini|bersama surat ini|berdasarkan informasi|sehubungan dengan|i am writing this letter to|with reference to)/i;

/**
 * Pemeriksaan cepat tanpa AI. Mengembalikan daftar
 * { status: "ok" | "warn" | "bad", judul, saran }.
 */
export function periksaSurat(d) {
  const hasil = [];
  const badan = badanSurat(d);
  const semua = badan.join(" ");
  const kata = hitungKata(semua);
  const kecil = semua.toLowerCase();
  const tambah = (status, judul, saran = "") => hasil.push({ status, judul, saran });

  if (kata < 150) tambah("bad", `Terlalu pendek (${kata} kata)`, "Recruiter mengharapkan 250-400 kata: cukup untuk 1 pembuka, 1-2 paragraf bukti, dan penutup.");
  else if (kata < 250) tambah("warn", `Agak pendek (${kata} kata)`, "Tambahkan satu contoh pengalaman atau pencapaian yang relevan dengan posisi.");
  else if (kata > 450) tambah("warn", `Terlalu panjang (${kata} kata)`, "Pangkas sampai sekitar 400 kata. Surat yang muat satu halaman lebih mungkin dibaca sampai habis.");
  else tambah("ok", `Panjang pas (${kata} kata)`);

  const placeholder = (semua.match(/\[[^\]]{2,}\]/g) || []).length;
  if (placeholder) tambah("bad", `${placeholder} bagian [dalam kurung] belum diganti`, "Ganti semua teks dalam kurung siku dengan informasi milikmu sebelum dikirim.");

  if (!d.posisi?.trim()) tambah("bad", "Posisi yang dilamar belum diisi", "Isi kolom posisi. Recruiter sering membuka banyak lowongan sekaligus.");
  else if (!(d.pembuka || "").toLowerCase().includes(d.posisi.trim().toLowerCase().split(/\s+/)[0]))
    tambah("warn", "Posisi tidak disebut di paragraf pembuka", "Sebut nama posisi di kalimat pertama agar recruiter langsung tahu suratmu untuk lowongan yang mana.");
  else tambah("ok", "Posisi disebut di pembuka");

  if (!d.perusahaan?.trim()) tambah("warn", "Nama perusahaan belum diisi", "Surat yang menyebut nama perusahaan terasa ditulis khusus, bukan dikirim massal.");
  else if (!kecil.includes(d.perusahaan.trim().toLowerCase())) tambah("warn", "Nama perusahaan tidak muncul di isi surat", "Sebut nama perusahaan dan satu alasan spesifik kenapa kamu tertarik bergabung.");
  else tambah("ok", "Nama perusahaan disebut");

  if (/\d/.test((d.isi || []).join(" ").replace(/\[[^\]]*\]/g, ""))) tambah("ok", "Ada bukti berupa angka");
  else tambah("warn", "Belum ada bukti terukur", "Tambahkan angka: berapa banyak, berapa persen, berapa lama, atau berapa orang. Angka membuat klaim lebih dipercaya.");

  if (AJAKAN.test(d.penutup || "")) tambah("ok", "Penutup mengajak wawancara");
  else tambah("warn", "Penutup belum mengajak bertindak", "Akhiri dengan kesediaan wawancara, misalnya: Saya akan senang mendapat kesempatan wawancara.");

  if (PEMBUKA_USANG.test((d.pembuka || "").trim()))
    tambah("warn", "Pembuka terdengar seperti template lama", "Kalimat seperti 'Melalui surat ini' atau 'Saya yang bertanda tangan di bawah ini' terasa kaku. Langsung sebut posisi dan alasan kamu cocok.");

  const klise = KLISE.filter((k) => kecil.includes(k));
  if (klise.length) tambah("warn", `Ada kata klise: ${klise.slice(0, 3).join(", ")}`, "Ganti klaim sifat dengan contoh nyata. Daripada 'pekerja keras', ceritakan apa yang kamu selesaikan.");

  const panjang = semua.split(/(?<=[.!?])\s+/).filter((k) => hitungKata(k) > 35).length;
  if (panjang) tambah("warn", `${panjang} kalimat terlalu panjang`, "Pecah kalimat di atas 35 kata agar mudah dibaca.");

  const awalSaya = badan.filter((p) => /^(saya|i)\b/i.test(p)).length;
  if (badan.length >= 3 && awalSaya >= 3) tambah("warn", "Hampir semua paragraf diawali 'Saya'", "Variasikan awal paragraf, misalnya dengan konteks: 'Selama tiga tahun di ...' atau 'Di proyek ...'.");

  if (!d.email?.trim() || !d.telepon?.trim()) tambah("warn", "Kontak belum lengkap", "Cantumkan email dan nomor telepon yang aktif.");

  return hasil;
}

export const TIPS_CL = [
  "Satu surat untuk satu lowongan. Sebut posisi, nama perusahaan, dan alasan spesifik kamu tertarik.",
  "Jangan mengulang CV. Pilih 1-2 pengalaman paling relevan lalu ceritakan hasilnya.",
  "Cocokkan dengan lowongan: pakai istilah yang sama dengan yang tertulis di kualifikasi.",
  "Kirim sebagai PDF dengan nama file yang jelas, misalnya CoverLetter_Nama_Posisi.pdf.",
  "Kalau melamar lewat email, tempel isi surat di badan email dan lampirkan CV.",
];

/* ------------------------------------------------------------ tata letak */

/**
 * Susunan baris surat, dipakai bersama oleh pratinjau dan PDF supaya
 * keduanya selalu sama. Satuan jarak dalam milimeter.
 *   judul    nama besar berwarna aksen
 *   kecil    baris kecil abu-abu (kontak)
 *   garis    garis aksen selebar halaman
 *   baris    satu baris teks (tebal opsional, kanan opsional)
 *   paragraf paragraf rata kanan-kiri
 *   jarak    ruang kosong
 */
export function susunSurat(d) {
  const en = d.bahasa === "EN";
  const tema = d.gaya?.tema || "formal";
  const B = [];
  const add = (t, teks, ext = {}) => {
    if (t === "jarak" || t === "garis" || (teks && String(teks).trim())) B.push({ t, teks, ...ext });
  };
  const jarak = (n) => B.push({ t: "jarak", n });
  const tgl = tanggalSurat(d.tanggal, d.bahasa);
  const kotaTgl = [d.kota?.trim(), tgl].filter(Boolean).join(", ");
  const kontak = [d.telepon, d.email, d.linkedin].map((x) => (x || "").trim()).filter(Boolean);
  const alamat = (d.alamat || "").split("\n").map((x) => x.trim()).filter(Boolean);
  const posisi = d.posisi?.trim() || (en ? "[position]" : "[posisi]");

  const tujuanId = () => {
    add("baris", "Kepada Yth.");
    if (d.penerimaNama?.trim()) add("baris", `Bapak/Ibu ${d.penerimaNama.trim()}`);
    add("baris", d.penerimaJabatan?.trim() || (d.penerimaNama?.trim() ? "" : "Bapak/Ibu Bagian Rekrutmen"));
    add("baris", d.perusahaan);
    alamat.forEach((a) => add("baris", a));
    add("baris", "di Tempat");
  };
  const tujuanEn = () => {
    add("baris", d.penerimaNama);
    add("baris", d.penerimaJabatan);
    add("baris", d.perusahaan);
    alamat.forEach((a) => add("baris", a));
  };
  const badan = () => {
    add("baris", d.salam?.trim() || salamAwal(d.bahasa, d));
    jarak(3);
    badanSurat(d).forEach((p, i) => {
      if (i) jarak(3.2);
      add("paragraf", p);
    });
    jarak(6);
    add("baris", d.salamPenutup?.trim() || salamAkhir(d.bahasa));
  };

  if (tema === "ringkas") {
    badan();
    jarak(4);
    add("baris", d.nama, { tebal: true });
    add("kecil", kontak.join("  |  "));
    return B;
  }

  if (tema === "modern") {
    add("judul", d.nama || (en ? "Your Name" : "Nama Kamu"));
    add("kecil", [d.kota, ...kontak].map((x) => (x || "").trim()).filter(Boolean).join("  ·  "));
    jarak(2);
    add("garis");
    jarak(6);
    add("baris", en ? tgl : kotaTgl);
    jarak(5);
    if (en) tujuanEn();
    else {
      add("baris", [d.penerimaNama?.trim() ? `Yth. Bapak/Ibu ${d.penerimaNama.trim()}` : "Yth. Tim Rekrutmen", d.penerimaJabatan].filter((x) => x && x.trim()).join(", "));
      add("baris", d.perusahaan);
      alamat.forEach((a) => add("baris", a));
    }
    jarak(5);
    add("baris", en ? `Re: Application for ${posisi}` : `Perihal: Lamaran posisi ${posisi}`, { tebal: true });
    jarak(5);
    badan();
    jarak(14);
    add("baris", d.nama, { tebal: true });
    return B;
  }

  // formal
  if (en) {
    add("baris", d.nama || "Your Name", { tebal: true });
    add("kecil", d.kota);
    add("kecil", kontak.join("  |  "));
    jarak(6);
    add("baris", tgl);
    jarak(5);
    tujuanEn();
    jarak(5);
    add("baris", `Re: Application for ${posisi}`, { tebal: true });
    jarak(5);
    badan();
    jarak(16);
    add("baris", d.nama, { tebal: true });
    return B;
  }

  add("baris", kotaTgl, { kanan: true });
  jarak(6);
  add("baris", `Perihal\t: Lamaran Pekerjaan sebagai ${posisi}`);
  add("baris", d.lampiran?.trim() ? `Lampiran\t: ${d.lampiran.trim()}` : "");
  jarak(6);
  tujuanId();
  jarak(6);
  badan();
  jarak(16);
  add("baris", d.nama || "[Nama]", { tebal: true });
  add("kecil", kontak.join("  |  "));
  return B;
}

/** Ukuran halaman dan huruf, dipakai juga oleh pratinjau (dalam mm/pt). */
export const UKURAN_CL = {
  margin: 22,
  isi: 10.5, // pt
  kecil: 9,
  judul: 20,
  baris: 5.3, // mm per baris teks isi
  label: 20, // lebar label "Perihal", "Lampiran"
};
