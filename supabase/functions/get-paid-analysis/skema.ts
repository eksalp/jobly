// @ts-nocheck
// Skema JSON untuk responseSchema Gemini.
//
// Ini yang menggantikan seluruh lapisan parseJsonAman + normalisasi manual:
// Gemini dijamin mengembalikan struktur ini, bukan sekadar diminta lewat prompt.
//
// Catatan: token skema ikut dihitung sebagai input, jadi sengaja dibuat
// seringkas mungkin — deskripsi panjang ditaruh di prompt, bukan di sini.

const S = { type: "string" };
const N = { type: "number" };
const arrS = { type: "array", items: S };

const objek = (properties, required) => ({
  type: "object",
  properties,
  required: required ?? Object.keys(properties),
});

const daftar = (properties) => ({ type: "array", items: objek(properties) });

const audit = (kunciSkor) =>
  objek({
    [kunciSkor]: N,
    masalah: daftar({ bagian: S, masalah: S, perbaikan: S }),
  });

// Istilah resmi tingkat kemahiran bahasa di LinkedIn.
// Wajib persis, karena LinkedIn hanya menerima lima nilai ini.
export const TINGKAT_BAHASA = {
  id: [
    "Kemampuan dasar",
    "Kemampuan kerja terbatas",
    "Kemampuan kerja profesional",
    "Kemampuan profesional penuh",
    "Penutur asli atau dwibahasa",
  ],
  en: [
    "Elementary proficiency",
    "Limited working proficiency",
    "Professional working proficiency",
    "Full professional proficiency",
    "Native or bilingual proficiency",
  ],
};

// Skema dibuat sebagai fungsi karena enum tingkat bahasa
// ikut berubah mengikuti bahasa output.
// Bagian draft dipisah supaya bisa diminta sendiri untuk bahasa kedua,
// tanpa ikut membawa audit dan arah karier yang tidak perlu diduplikasi.
const draftCv = () =>
  objek({
    fullName: S,
    headline: S,
    email: S,
    phone: S,
    location: S,
    linkedin: S,
    summary: S,
    experiences: daftar({ role: S, company: S, start: S, end: S, desc: arrS }),
    organizations: daftar({ role: S, org: S, start: S, end: S, desc: arrS }),
    volunteers: daftar({ role: S, org: S, start: S, end: S, desc: arrS }),
    education: daftar({ school: S, degree: S, start: S, end: S, desc: arrS }),
    awards: daftar({ title: S, year: S, issuer: S }),
    certifications: daftar({ name: S, issuer: S, year: S, license: S, url: S }),
    skills: arrS,
  });

const draftLinkedin = (bahasa) =>
  objek({
    headline: S,
    about: S,
    cover_saran: S,
    photo_saran: S,
    // desc berupa array poin, sama seperti cv_draft — bentuknya langsung
    // cocok dengan editor poin di LinkedIn Builder.
    experiences: daftar({
      role: S,
      company: S,
      start: S,
      end: S,
      lokasi: S,
      desc: arrS,
      skills: arrS,
    }),
    education: daftar({
      school: S,
      degree: S,
      field: S,
      start: S,
      end: S,
      grade: S,
      desc: arrS,
    }),
    certifications: daftar({
      name: S,
      issuer: S,
      issued: S,
      expires: S,
      credentialId: S,
      url: S,
    }),
    volunteering: daftar({
      role: S,
      org: S,
      cause: S,
      start: S,
      end: S,
      desc: arrS,
    }),
    skills: arrS,
    publications: daftar({
      title: S,
      publisher: S,
      date: S,
      url: S,
      desc: arrS,
    }),
    awards: daftar({ title: S, issuer: S, date: S, desc: arrS }),
    languages: daftar({
      name: S,
      proficiency: {
        type: "string",
        enum: TINGKAT_BAHASA[bahasa] ?? TINGKAT_BAHASA.id,
      },
    }),
    organizations: daftar({ name: S, role: S, start: S, end: S, desc: arrS }),
  });

// Skema untuk panggilan kedua: hanya draft, tanpa audit.
export const buatSkemaDraft = (bahasa = "en") =>
  objek({
    cv_draft: draftCv(),
    linkedin_draft: draftLinkedin(bahasa),
  });

export const buatSkema = (bahasa = "id") =>
  objek({
    arah_karier: S,
    arah_karier_alasan: S,
    posisi_target: arrS,
    bidang_alternatif: daftar({ bidang: S, alasan: S }),
    kekuatan: arrS,
    kekurangan: arrS,
    saran_perbaikan: arrS,

    cv_audit: audit("skor_ats"),
    linkedin_audit: audit("skor"),

    cv_draft: draftCv(),
    linkedin_draft: draftLinkedin(bahasa),
  });
