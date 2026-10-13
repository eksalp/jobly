import { t } from "../i18n.js";
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
    volunteering: auditDaftar(p.volunteering, t("pengalaman sukarela", "volunteer experience"), 1, 8),
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
      ringkas: t("Belum ada foto sampul", "No cover photo yet"),
      temuan: [
        t("Sampul kosong menyisakan ruang abu-abu polos di bagian paling atas profil.", "An empty cover leaves a plain grey space at the very top of your profile."),
      ],
    };
  return {
    status: OK,
    ringkas: t("Sampul terpasang", "Cover photo added"),
    temuan: [
      t("Pastikan resolusi minimal 1584 × 396 px supaya tidak pecah di layar besar.", "Make sure it's at least 1584 × 396 px so it doesn't pixelate on large screens."),
    ],
  };
}

function auditPhoto(p) {
  if (!p.photoUrl)
    return {
      status: BAD,
      ringkas: t("Belum ada foto profil", "No profile photo yet"),
      temuan: [
        t("Profil tanpa foto jarang dilirik recruiter dan terlihat belum selesai.", "Profiles without a photo rarely get a recruiter's attention and look unfinished."),
      ],
    };
  return { status: OK, ringkas: t("Foto profil terpasang", "Profile photo added"), temuan: [] };
}

function auditHeadline(h) {
  const tt = (h || "").trim();
  if (!tt)
    return {
      status: BAD,
      ringkas: t("Headline kosong", "Headline is empty"),
      temuan: [t("Bagian dengan bobot pencarian tertinggi setelah nama.", "The section with the highest search weight after your name.")],
    };
  const temuan = [];
  if (tt.length < 80)
    temuan.push(
      t(`Baru ${tt.length} dari 220 karakter. Masih banyak ruang untuk kata kunci.`, `Only ${tt.length} of 220 characters. Plenty of room left for keywords.`),
    );
  if (/fresh graduate|jobseeker|looking for/i.test(tt))
    temuan.push(t("Mengandung frasa generik yang tidak dicari recruiter.", "Contains generic phrases recruiters don't search for."));
  if (!tt.includes("|") && tt.length > 40)
    temuan.push(
      t("Coba pisahkan dengan tanda | supaya tiap bagian mudah dipindai.", "Try separating parts with | so each one is easy to scan."),
    );
  if (tt.length > 220)
    temuan.push(t(`Kelebihan ${tt.length - 220} karakter, akan terpotong.`, `${tt.length - 220} characters over, it will be cut off.`));
  return {
    status: temuan.length === 0 ? OK : tt.length < 60 ? BAD : WARN,
    ringkas: `${tt.length} / 220 ${t("karakter", "characters")}`,
    temuan,
  };
}

function auditAbout(a) {
  const tt = (a || "").trim();
  if (!tt)
    return {
      status: BAD,
      ringkas: t("Bagian Tentang kosong", "About section is empty"),
      temuan: [
        t("Ada 2.600 karakter dan ikut terbaca oleh pencarian LinkedIn. Sayang kalau dilewatkan.", "You get 2,600 characters and LinkedIn search reads them. A shame to skip it."),
      ],
    };
  const temuan = [];
  const paragraf = tt.split(/\n\s*\n/).filter(Boolean).length;
  if (tt.length < 600)
    temuan.push(t(`Baru ${tt.length} dari 2.600 karakter. Idealnya minimal 600.`, `Only ${tt.length} of 2,600 characters. Ideally at least 600.`));
  if (paragraf < 3)
    temuan.push(
      t(`Baru ${paragraf} paragraf. Pisahkan jadi 3–4 supaya enak dibaca.`, `Only ${paragraf} paragraph(s). Split it into 3–4 so it reads easily.`),
    );
  if (!/\d/.test(tt))
    temuan.push(t("Belum ada angka. Pencapaian terukur jauh lebih meyakinkan.", "No numbers yet. Measurable achievements are far more convincing."));
  if (!/\bsaya\b|\baku\b/i.test(tt))
    temuan.push(t("Tulis dengan sudut pandang orang pertama, bukan gaya CV.", "Write in the first person, not CV style."));
  return {
    status: temuan.length === 0 ? OK : tt.length < 400 ? BAD : WARN,
    ringkas: t(`${tt.length} / 2.600 karakter · ${paragraf} paragraf`, `${tt.length} / 2,600 characters · ${paragraf} paragraph(s)`),
    temuan,
  };
}

function auditExperience(list) {
  const terisi = (list || []).filter((e) => e.role && e.company);
  if (terisi.length === 0)
    return {
      status: BAD,
      ringkas: t("Belum ada pengalaman", "No experience yet"),
      temuan: [t("Tambahkan minimal satu posisi.", "Add at least one position.")],
    };
  const temuan = [];
  const tanpaDesk = terisi.filter((e) => teksDesk(e.desc).length < 40);
  if (tanpaDesk.length)
    temuan.push(
      t(`${tanpaDesk.length} posisi belum punya deskripsi memadai: ${tanpaDesk.map((e) => e.role).join(", ")}.`, `${tanpaDesk.length} position(s) lack a proper description: ${tanpaDesk.map((e) => e.role).join(", ")}.`),
    );
  const tanpaSkill = terisi.filter((e) => !e.skills || e.skills.length === 0);
  if (tanpaSkill.length)
    temuan.push(
      t(`${tanpaSkill.length} posisi belum mencantumkan skill. Kolom ini dipakai untuk pencocokan lowongan.`, `${tanpaSkill.length} position(s) list no skills. This field is used for job matching.`),
    );
  const tanpaAngka = terisi.filter(
    (e) => teksDesk(e.desc) && !/\d/.test(teksDesk(e.desc)),
  );
  if (tanpaAngka.length)
    temuan.push(
      t(`${tanpaAngka.length} deskripsi belum memuat angka atau dampak terukur.`, `${tanpaAngka.length} description(s) have no numbers or measurable impact.`),
    );
  return {
    status: temuan.length === 0 ? OK : temuan.length >= 3 ? BAD : WARN,
    ringkas: t(`${terisi.length} posisi tercatat`, `${terisi.length} position(s) listed`),
    temuan,
  };
}

function auditEducation(list) {
  const terisi = (list || []).filter((e) => e.school);
  if (terisi.length === 0)
    return {
      status: BAD,
      ringkas: t("Belum ada pendidikan", "No education yet"),
      temuan: [t("Recruiter sering menyaring berdasarkan jenjang pendidikan.", "Recruiters often filter by education level.")],
    };
  const temuan = [];
  const tanpaGelar = terisi.filter((e) => !e.degree || !e.field);
  if (tanpaGelar.length)
    temuan.push(
      t(`${tanpaGelar.length} entri belum lengkap gelar atau bidang studinya.`, `${tanpaGelar.length} entry(ies) missing a degree or field of study.`),
    );
  const tanpaPeriode = terisi.filter((e) => !e.start && !e.end);
  if (tanpaPeriode.length)
    temuan.push(t(`${tanpaPeriode.length} entri belum mencantumkan periode.`, `${tanpaPeriode.length} entry(ies) missing dates.`));
  return {
    status: temuan.length === 0 ? OK : WARN,
    ringkas: t(`${terisi.length} institusi tercatat`, `${terisi.length} institution(s) listed`),
    temuan,
  };
}

function auditCertifications(list) {
  const terisi = (list || []).filter((c) => c.name);
  if (terisi.length === 0)
    return {
      status: WARN,
      ringkas: t("Belum ada sertifikasi", "No certifications yet"),
      temuan: [t("Sertifikasi relevan menaikkan peluang lolos penyaringan awal.", "Relevant certifications improve your odds in early screening.")],
    };
  const temuan = [];
  const tanpaUrl = terisi.filter((c) => !c.url);
  if (tanpaUrl.length)
    temuan.push(
      t(`${tanpaUrl.length} sertifikasi belum ada URL kredensial. Yang bisa diklik lebih dipercaya.`, `${tanpaUrl.length} certification(s) have no credential URL. Clickable ones are trusted more.`),
    );
  const tanpaPenerbit = terisi.filter((c) => !c.issuer);
  if (tanpaPenerbit.length)
    temuan.push(
      t(`${tanpaPenerbit.length} sertifikasi belum mencantumkan penerbit.`, `${tanpaPenerbit.length} certification(s) list no issuer.`),
    );
  return {
    status: temuan.length === 0 ? OK : WARN,
    ringkas: t(`${terisi.length} sertifikasi tercatat`, `${terisi.length} certification(s) listed`),
    temuan,
  };
}

function auditSkills(s) {
  const n = (s || []).length;
  if (n === 0)
    return {
      status: BAD,
      ringkas: t("Belum ada keahlian", "No skills yet"),
      temuan: [t("Isi minimal 15 keahlian.", "Add at least 15 skills.")],
    };
  const temuan = [];
  if (n < 15)
    temuan.push(t(`Baru ${n} dari 50. LinkedIn menyarankan minimal 15.`, `Only ${n} of 50. LinkedIn recommends at least 15.`));
  const generik = (s || []).filter((x) =>
    /^(komunikasi|kerja ?sama|teamwork|leadership|microsoft office)$/i.test(
      x.trim(),
    ),
  );
  if (generik.length)
    temuan.push(
      t(`Terlalu umum: ${generik.join(", ")}. Ganti dengan nama tools spesifik.`, `Too generic: ${generik.join(", ")}. Replace them with specific tool names.`),
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
      ringkas: t("Belum ada bahasa", "No languages yet"),
      temuan: [t("Perusahaan multinasional menyaring kandidat lewat kolom ini.", "Multinationals filter candidates by this field.")],
    };
  const temuan = [];
  const tanpaTingkat = terisi.filter((l) => !l.proficiency);
  if (tanpaTingkat.length)
    temuan.push(
      t(`${tanpaTingkat.length} bahasa belum ada tingkat kemahirannya.`, `${tanpaTingkat.length} language(s) have no proficiency level.`),
    );
  if (terisi.length === 1)
    temuan.push(
      t("Baru satu bahasa. Tambahkan bahasa lain yang kamu kuasai, sekecil apa pun tingkatnya.", "Only one language. Add others you know, however basic."),
    );
  return {
    status: temuan.length === 0 ? OK : WARN,
    ringkas: t(`${terisi.length} bahasa tercatat`, `${terisi.length} language(s) listed`),
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
      ringkas: t(`Belum ada ${nama}`, `No ${nama} yet`),
      temuan:
        minimal > 0
          ? [
              t(`Bagian ini masih kosong. Mengisinya membuat profil terlihat lebih lengkap.`, `This section is empty. Filling it makes your profile look more complete.`),
            ]
          : [],
    };
  }
  const temuan = [];
  const tanpaDesk = terisi.filter(
    (i) => "desc" in i && teksDesk(i.desc).length < 30,
  );
  if (tanpaDesk.length)
    temuan.push(t(`${tanpaDesk.length} entri belum punya deskripsi memadai.`, `${tanpaDesk.length} entry(ies) lack a proper description.`));
  if (n < ideal && n < 3)
    temuan.push(
      t(`Baru ${n} entri. Menambah beberapa lagi memperkuat bagian ini.`, `Only ${n} entry(ies). Adding a few more strengthens this section.`),
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
