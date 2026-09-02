// Aturan review lokal — berjalan tanpa AI.
// Hasil AI (kalau ada) ditambahkan sebagai temuan terpisah di panel.

const OK = "ok",
  WARN = "warn",
  BAD = "bad";

/**
 * Menyeragamkan nilai deskripsi menjadi teks.
 *
 * Sejak editor berubah jadi poin-poin, `desc` berupa array. Data lama masih
 * berupa string, jadi keduanya harus tetap tertangani.
 */
function teksDesk(v) {
  if (Array.isArray(v)) return v.filter(Boolean).join(" ").trim();
  if (typeof v === "string") return v.trim();
  return "";
}

/** Jumlah poin pada sebuah deskripsi. */
function jumlahPoin(v) {
  if (Array.isArray(v)) return v.filter((x) => x && String(x).trim()).length;
  return teksDesk(v) ? 1 : 0;
}

export function auditProfile(p) {
  return {
    cover: auditCover(p),
    photo: auditPhoto(p),
    headline: auditHeadline(p.headline),
    about: auditAbout(p.about),
    experience: auditExperience(p.experiences),
    education: auditEducation(p.education),
    certifications: auditCertifications(p.certifications),
    volunteering: auditDaftar(p.volunteering, "pengalaman sukarela", 1, 8),
    skills: auditSkills(p.skills),
    publications: auditDaftar(p.publications, "publikasi", 0, 5),
    awards: auditDaftar(p.awards, "penghargaan", 1, 6),
    languages: auditLanguages(p.languages),
    organizations: auditDaftar(p.organizations, "organisasi", 1, 6),
  };
}

function auditCover(p) {
  if (!p.coverUrl)
    return {
      status: BAD,
      ringkas: "Belum ada foto sampul",
      temuan: [
        "Sampul kosong menyisakan ruang abu-abu polos di bagian paling atas profil.",
      ],
    };
  return {
    status: OK,
    ringkas: "Sampul terpasang",
    temuan: [
      "Pastikan resolusi minimal 1584 × 396 px supaya tidak pecah di layar besar.",
    ],
  };
}

function auditPhoto(p) {
  if (!p.photoUrl)
    return {
      status: BAD,
      ringkas: "Belum ada foto profil",
      temuan: [
        "Profil tanpa foto jarang dilirik recruiter dan terlihat belum selesai.",
      ],
    };
  return { status: OK, ringkas: "Foto profil terpasang", temuan: [] };
}

function auditHeadline(h) {
  const t = (h || "").trim();
  if (!t)
    return {
      status: BAD,
      ringkas: "Headline kosong",
      temuan: ["Bagian dengan bobot pencarian tertinggi setelah nama."],
    };
  const temuan = [];
  if (t.length < 80)
    temuan.push(
      `Baru ${t.length} dari 220 karakter. Masih banyak ruang untuk kata kunci.`,
    );
  if (/fresh graduate|jobseeker|looking for/i.test(t))
    temuan.push("Mengandung frasa generik yang tidak dicari recruiter.");
  if (!t.includes("|") && t.length > 40)
    temuan.push(
      "Coba pisahkan dengan tanda | supaya tiap bagian mudah dipindai.",
    );
  if (t.length > 220)
    temuan.push(`Kelebihan ${t.length - 220} karakter, akan terpotong.`);
  return {
    status: temuan.length === 0 ? OK : t.length < 60 ? BAD : WARN,
    ringkas: `${t.length} / 220 karakter`,
    temuan,
  };
}

function auditAbout(a) {
  const t = (a || "").trim();
  if (!t)
    return {
      status: BAD,
      ringkas: "Bagian Tentang kosong",
      temuan: [
        "Tersedia 2.600 karakter dan diindeks pencarian LinkedIn — sayang kalau dilewat.",
      ],
    };
  const temuan = [];
  const paragraf = t.split(/\n\s*\n/).filter(Boolean).length;
  if (t.length < 600)
    temuan.push(`Baru ${t.length} dari 2.600 karakter. Idealnya minimal 600.`);
  if (paragraf < 3)
    temuan.push(
      `Baru ${paragraf} paragraf. Pisahkan jadi 3–4 supaya enak dibaca.`,
    );
  if (!/\d/.test(t))
    temuan.push("Belum ada angka. Pencapaian terukur jauh lebih meyakinkan.");
  if (!/\bsaya\b|\baku\b/i.test(t))
    temuan.push("Tulis dengan sudut pandang orang pertama, bukan gaya CV.");
  return {
    status: temuan.length === 0 ? OK : t.length < 400 ? BAD : WARN,
    ringkas: `${t.length} / 2.600 karakter · ${paragraf} paragraf`,
    temuan,
  };
}

function auditExperience(list) {
  const terisi = (list || []).filter((e) => e.role && e.company);
  if (terisi.length === 0)
    return {
      status: BAD,
      ringkas: "Belum ada pengalaman",
      temuan: ["Tambahkan minimal satu posisi."],
    };
  const temuan = [];
  const tanpaDesk = terisi.filter((e) => teksDesk(e.desc).length < 40);
  if (tanpaDesk.length)
    temuan.push(
      `${tanpaDesk.length} posisi belum punya deskripsi memadai: ${tanpaDesk.map((e) => e.role).join(", ")}.`,
    );
  const tanpaSkill = terisi.filter((e) => !e.skills || e.skills.length === 0);
  if (tanpaSkill.length)
    temuan.push(
      `${tanpaSkill.length} posisi belum mencantumkan skill. Kolom ini dipakai untuk pencocokan lowongan.`,
    );
  const tanpaAngka = terisi.filter(
    (e) => teksDesk(e.desc) && !/\d/.test(teksDesk(e.desc)),
  );
  if (tanpaAngka.length)
    temuan.push(
      `${tanpaAngka.length} deskripsi belum memuat angka atau dampak terukur.`,
    );
  return {
    status: temuan.length === 0 ? OK : temuan.length >= 3 ? BAD : WARN,
    ringkas: `${terisi.length} posisi tercatat`,
    temuan,
  };
}

function auditEducation(list) {
  const terisi = (list || []).filter((e) => e.school);
  if (terisi.length === 0)
    return {
      status: BAD,
      ringkas: "Belum ada pendidikan",
      temuan: ["Recruiter sering menyaring berdasarkan jenjang pendidikan."],
    };
  const temuan = [];
  const tanpaGelar = terisi.filter((e) => !e.degree || !e.field);
  if (tanpaGelar.length)
    temuan.push(
      `${tanpaGelar.length} entri belum lengkap gelar atau bidang studinya.`,
    );
  const tanpaPeriode = terisi.filter((e) => !e.start && !e.end);
  if (tanpaPeriode.length)
    temuan.push(`${tanpaPeriode.length} entri belum mencantumkan periode.`);
  return {
    status: temuan.length === 0 ? OK : WARN,
    ringkas: `${terisi.length} institusi tercatat`,
    temuan,
  };
}

function auditCertifications(list) {
  const terisi = (list || []).filter((c) => c.name);
  if (terisi.length === 0)
    return {
      status: WARN,
      ringkas: "Belum ada sertifikasi",
      temuan: ["Sertifikasi relevan menaikkan peluang lolos penyaringan awal."],
    };
  const temuan = [];
  const tanpaUrl = terisi.filter((c) => !c.url);
  if (tanpaUrl.length)
    temuan.push(
      `${tanpaUrl.length} sertifikasi belum ada URL kredensial. Yang bisa diklik lebih dipercaya.`,
    );
  const tanpaPenerbit = terisi.filter((c) => !c.issuer);
  if (tanpaPenerbit.length)
    temuan.push(
      `${tanpaPenerbit.length} sertifikasi belum mencantumkan penerbit.`,
    );
  return {
    status: temuan.length === 0 ? OK : WARN,
    ringkas: `${terisi.length} sertifikasi tercatat`,
    temuan,
  };
}

function auditSkills(s) {
  const n = (s || []).length;
  if (n === 0)
    return {
      status: BAD,
      ringkas: "Belum ada keahlian",
      temuan: ["Isi minimal 15 keahlian."],
    };
  const temuan = [];
  if (n < 15)
    temuan.push(`Baru ${n} dari 50. LinkedIn menyarankan minimal 15.`);
  const generik = (s || []).filter((x) =>
    /^(komunikasi|kerja ?sama|teamwork|leadership|microsoft office)$/i.test(
      x.trim(),
    ),
  );
  if (generik.length)
    temuan.push(
      `Terlalu umum: ${generik.join(", ")}. Ganti dengan nama tools spesifik.`,
    );
  return {
    status: temuan.length === 0 ? OK : n < 8 ? BAD : WARN,
    ringkas: `${n} dari 50 keahlian`,
    temuan,
  };
}

function auditLanguages(list) {
  const terisi = (list || []).filter((l) => l.name);
  if (terisi.length === 0)
    return {
      status: WARN,
      ringkas: "Belum ada bahasa",
      temuan: ["Perusahaan multinasional menyaring kandidat lewat kolom ini."],
    };
  const temuan = [];
  const tanpaTingkat = terisi.filter((l) => !l.proficiency);
  if (tanpaTingkat.length)
    temuan.push(
      `${tanpaTingkat.length} bahasa belum ada tingkat kemahirannya.`,
    );
  if (terisi.length === 1)
    temuan.push(
      "Baru satu bahasa. Tambahkan bahasa lain yang kamu kuasai, sekecil apa pun tingkatnya.",
    );
  return {
    status: temuan.length === 0 ? OK : WARN,
    ringkas: `${terisi.length} bahasa tercatat`,
    temuan,
  };
}

// Audit generik untuk daftar sederhana
function auditDaftar(list, nama, minimal, ideal) {
  const terisi = (list || []).filter((i) =>
    Object.entries(i).some(([k, v]) => {
      if (k === "id") return false;
      if (Array.isArray(v)) return v.some((x) => x && String(x).trim());
      return typeof v === "string" && v.trim();
    }),
  );
  const n = terisi.length;
  if (n === 0) {
    return {
      status: minimal > 0 ? WARN : OK,
      ringkas: `Belum ada ${nama}`,
      temuan:
        minimal > 0
          ? [
              `Bagian ini masih kosong. Mengisinya membuat profil terlihat lebih lengkap.`,
            ]
          : [],
    };
  }
  const temuan = [];
  const tanpaDesk = terisi.filter(
    (i) => "desc" in i && teksDesk(i.desc).length < 30,
  );
  if (tanpaDesk.length)
    temuan.push(`${tanpaDesk.length} entri belum punya deskripsi memadai.`);
  if (n < ideal && n < 3)
    temuan.push(
      `Baru ${n} entri. Menambah beberapa lagi memperkuat bagian ini.`,
    );
  return {
    status: temuan.length === 0 ? OK : WARN,
    ringkas: `${n} ${nama} tercatat`,
    temuan,
  };
}

export function skorProfil(review) {
  const bobot = {
    cover: 6,
    photo: 8,
    headline: 18,
    about: 18,
    experience: 16,
    education: 8,
    certifications: 6,
    skills: 8,
    volunteering: 3,
    publications: 2,
    awards: 3,
    languages: 2,
    organizations: 2,
  };
  const nilai = { ok: 1, warn: 0.55, bad: 0.15 };
  let total = 0;
  Object.entries(bobot).forEach(([k, w]) => {
    total += w * (nilai[review[k]?.status] ?? 0);
  });
  return Math.round(total);
}
