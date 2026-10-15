// @ts-nocheck
// Edge Function: get-paid-analysis
//
// Alur:
//   1. Verifikasi user & pembayaran
//   2. Kalau hasil sudah pernah dibuat untuk order ini, kembalikan dari cache
//   3. Kalau belum, jalankan satu panggilan AI lewat penyedia.ts
//      (Gemini utama dengan responseSchema, Claude sebagai cadangan otomatis).
//      Pencocokan loker TIDAK lewat AI — dikerjakan algoritma lokal di client.
//   4. Normalisasi hasil supaya bentuknya dijamin aman untuk frontend
//   5. Simpan & kembalikan

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { jalankanAnalisis } from "./penyedia.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Instruksi bahasa output. Ditulis spesifik, bukan sekadar "pakai bahasa X",
// karena CV berbahasa Inggris punya konvensi sendiri yang berbeda dari
// sekadar menerjemahkan CV Indonesia kata per kata.
/* Standar penulisan draft. Ditulis rinci karena kualitas draft paling
   ditentukan oleh aturan ini, bukan oleh model yang dipakai. */
const STANDAR_DRAFT = {
  id: `STANDAR KUALITAS DRAFT CV (cv_draft):
- headline: jabatan target + 2-3 keahlian inti, maksimal 70 karakter.
  Contoh: "Staf Admin Keuangan | Rekonsiliasi Bank, Microsoft Excel".
- summary: 3-4 kalimat (50-90 kata), tanpa kata "saya". Isi berurutan:
  jabatan dan lama pengalaman (hitung dari tanggal di input bila jelas),
  2-4 keahlian inti yang sesuai posisi_target, 1-2 pencapaian terbaik dari
  input, lalu jenis peran yang dicari.
- experiences: urutkan dari yang terbaru. Posisi terbaru 4-5 bullet, posisi
  lama 2-3 bullet. Setiap bullet:
  * diawali kata kerja aktif yang berbeda-beda (Menyusun, Mengelola,
    Merekonsiliasi, Menangani, Meningkatkan, Mengoordinasikan, dst.),
  * pola: apa yang dikerjakan + bagaimana/alat yang dipakai + hasil atau
    cakupannya,
  * maksimal 25 kata, tanpa titik di akhir,
  * angka HANYA bila ada di input. Kalau tidak ada angka, tulis cakupan
    atau dampak secara kualitatif tanpa mengarang jumlah.
- skills: 8-15 keahlian, keahlian teknis dan tools lebih dulu, nama baku
  ("Microsoft Excel", bukan "excel"), relevan dengan posisi_target. Jangan
  isi dengan sifat pribadi ("jujur", "pekerja keras", "team player").
- Tanggal seragam: "Jan 2023" sampai "Sekarang". Jangan menambah tanggal
  yang tidak ada di input.
- education.desc: hanya hal yang menambah nilai (IPK bila 3,00 ke atas,
  skripsi atau kegiatan relevan). Boleh kosong.

STANDAR KUALITAS DRAFT LINKEDIN (linkedin_draft):
- headline (maks 220 karakter): "Jabatan | 2-3 spesialisasi | nilai yang
  ditawarkan", memuat kata kunci yang dicari recruiter untuk posisi_target.
- about: 180-300 kata, orang pertama, 4 paragraf dipisah baris kosong:
  1) pembuka kuat dalam 270 karakter pertama (siapa dan apa keahlian utama),
  2) pengalaman dan cara kerja dengan bukti dari input,
  3) 3-4 pencapaian atau keahlian berupa daftar berawalan "• ",
  4) ajakan: jenis peluang yang dicari dan cara menghubungi.
- experiences.desc: 2-4 poin per posisi, boleh sedikit lebih bercerita
  daripada CV, tetap berbasis fakta input.
- skills: 10-20 keahlian, diurutkan dari yang paling relevan untuk
  posisi_target (LinkedIn menampilkan beberapa teratas lebih menonjol).

STANDAR AUDIT (cv_audit dan linkedin_audit):
- Setiap masalah harus spesifik: kutip potongan pendek dari input yang
  bermasalah, dan "perbaikan" berisi contoh tulisan pengganti yang siap
  dipakai, bukan nasihat umum.
- skor_ats dihitung dengan bobot: kata kunci sesuai posisi_target 30,
  pencapaian terukur 25, struktur dan format 20, kelengkapan bagian 15,
  kejelasan bahasa 10. Jangan memberi skor tinggi pada CV yang tipis.`,

  en: `CV DRAFT QUALITY STANDARD (cv_draft):
- headline: target role + 2-3 core skills, max 70 characters.
- summary: 3-4 sentences (50-90 words), no "I". In order: role and years of
  experience (computed from input dates when clear), 2-4 core skills that fit
  the target roles, 1-2 best achievements from the input, then the kind of
  role sought.
- experiences: most recent first. Latest role 4-5 bullets, older roles 2-3.
  Each bullet starts with a different strong action verb, follows "what +
  how/tools + result or scope", max 25 words, no trailing period. Numbers
  ONLY when present in the input; otherwise describe scope or impact
  qualitatively without inventing figures.
- skills: 8-15 items, hard skills and tools first, standard names
  ("Microsoft Excel"), relevant to the target roles. No personality traits.
- Consistent dates: "Jan 2023" to "Present". Do not add dates that are not in
  the input.

LINKEDIN DRAFT QUALITY STANDARD (linkedin_draft):
- headline (max 220 chars): "Role | 2-3 specialties | value offered", with
  the keywords recruiters search for.
- about: 180-300 words, first person, 4 paragraphs separated by blank lines:
  1) a strong opening within the first 270 characters, 2) experience and way
  of working with evidence from the input, 3) 3-4 achievements or skills as a
  list starting with "• ", 4) a call to action: opportunities sought and how
  to get in touch.
- experiences.desc: 2-4 points per role, slightly more narrative than the CV,
  still grounded in the input.
- skills: 10-20 items ordered by relevance to the target roles.`,
};

const INSTRUKSI_BAHASA = {
  id: `Tulis SEMUA teks dalam Bahasa Indonesia yang baik dan profesional.
Kecualikan nama tools, sertifikasi, dan jabatan yang memang lazim dipakai dalam
bahasa Inggris di dunia kerja Indonesia (misalnya "Microsoft Excel", "Business
Analyst", "Robotic Process Automation"), jangan diterjemahkan.
Data faktual seperti nama perusahaan dan institusi ditulis apa adanya.
Gaya tulisan: kalimat yang lazim dipakai orang Indonesia, lugas, tidak
berlebihan. JANGAN memakai tanda pisah panjang (—) sama sekali; pakai koma,
titik, titik dua, atau tanda kurung. Hindari kata klise seperti "dinamis",
"inovatif", "berdedikasi tinggi", "passionate", atau "hasil yang luar biasa".`,

  en: `Write ALL text in professional English suitable for international job
applications. This is not a word-for-word translation job. Apply English CV
conventions: strong action verbs in past tense for previous roles and present
tense for the current role, quantified achievements, and concise phrasing.
Keep proper nouns exactly as given: company names, institution names, and
certification names stay in their original form (e.g. "PT Integrasi Logistik
Cipta Solusi", "Universitas Sebelas Maret", "Brevet Pajak AB"). Do not
translate them. Dates may be written in English format (e.g. "Oct 2024").
For the LinkedIn About section, use first person ("I have...").
Style: plain, natural wording a real person would write. NEVER use the em dash
character (—); use commas, periods, colons, or parentheses instead. Avoid
buzzwords such as "dynamic", "passionate", "results-driven", "synergy",
"leverage", or "spearheaded" unless the candidate's own CV uses them.`,
};

const TINGKAT_BAHASA = {
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

/* ---------- Util ---------- */

const uid = () => Math.random().toString(36).slice(2, 9);

const str = (v) => (typeof v === "string" ? v : "");
const arr = (v) => (Array.isArray(v) ? v : []);
const arrStr = (v) => arr(v).filter((x) => typeof x === "string" && x.trim());
const num = (v, fb = 0) => (typeof v === "number" && isFinite(v) ? v : fb);

// Pastikan tiap item punya id dan hanya berisi field yang dikenal
function normalisasiDaftar(daftar, bentuk) {
  return arr(daftar)
    .filter((i) => i && typeof i === "object")
    .map((i) => {
      const hasil = { id: uid() };
      Object.keys(bentuk).forEach((k) => {
        hasil[k] = bentuk[k] === "array" ? arrStr(i[k]) : str(i[k]);
      });
      return hasil;
    })
    .filter((i) =>
      Object.entries(i).some(
        ([k, v]) => k !== "id" && (Array.isArray(v) ? v.length : v),
      ),
    );
}

const BENTUK = {
  experiences: {
    role: "s",
    company: "s",
    start: "s",
    end: "s",
    lokasi: "s",
    desc: "array",
    skills: "array",
  },
  cvExperiences: {
    role: "s",
    company: "s",
    start: "s",
    end: "s",
    desc: "array",
  },
  organizations: { name: "s", role: "s", start: "s", end: "s", desc: "array" },
  cvOrganizations: { role: "s", org: "s", start: "s", end: "s", desc: "array" },
  volunteers: { role: "s", org: "s", start: "s", end: "s", desc: "array" },
  volunteering: {
    role: "s",
    org: "s",
    cause: "s",
    start: "s",
    end: "s",
    desc: "array",
  },
  education: {
    school: "s",
    degree: "s",
    field: "s",
    start: "s",
    end: "s",
    grade: "s",
    desc: "array",
  },
  cvEducation: {
    school: "s",
    degree: "s",
    start: "s",
    end: "s",
    desc: "array",
  },
  certifications: {
    name: "s",
    issuer: "s",
    issued: "s",
    expires: "s",
    credentialId: "s",
    url: "s",
  },
  cvCerts: { name: "s", issuer: "s", year: "s", license: "s", url: "s" },
  publications: {
    title: "s",
    publisher: "s",
    date: "s",
    url: "s",
    desc: "array",
  },
  awards: { title: "s", issuer: "s", date: "s", desc: "array" },
  cvAwards: { title: "s", year: "s", issuer: "s" },
  languages: { name: "s", proficiency: "s" },
};

function normalisasiAudit(a, kunciSkor) {
  const o = a && typeof a === "object" ? a : {};
  return {
    [kunciSkor]: Math.max(0, Math.min(100, num(o[kunciSkor], 50))),
    masalah: arr(o.masalah)
      .filter((m) => m && typeof m === "object")
      .map((m) => ({
        bagian: str(m.bagian),
        masalah: str(m.masalah),
        perbaikan: str(m.perbaikan),
      }))
      .filter((m) => m.bagian && m.masalah),
  };
}

/* ---------- Handler ---------- */

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    const { cvText, sourceType } = await req.json();
    // Kedua bahasa selalu dihasilkan — user tidak perlu memilih di awal,
    // dan bisa berganti versi kapan saja di CV/LinkedIn Builder.

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    /* ----- Gerbang langganan -----
       Kuota dikurangi lewat fungsi Postgres yang mengunci barisnya,
       sehingga dua permintaan bersamaan tidak bisa sama-sama lolos
       saat kuota tinggal satu. */
    // Jenis disebut eksplisit, tidak mengandalkan fungsi pembungkus lama.
    // Sejak kuota dipisah per fitur, menyebutkannya di sini membuat
    // kekeliruan seperti memotong jatah yang salah langsung kelihatan.
    // Catat sesi sebelum kuota dipotong. Id-nya dipakai mengembalikan
    // kuota kalau analisisnya gagal.
    const { data: catatan } = await supabaseAdmin
      .from("sesi_token")
      .insert({ user_id: user.id, jenis: "analisis" })
      .select("id")
      .single();

    const tokenId = catatan?.id ?? null;

    const { data: pakai, error: kuotaErr } = await supabaseAdmin.rpc(
      "pakai_kuota",
      { p_user_id: user.id, p_jenis: "analisis" },
    );

    if (kuotaErr) throw new Error("Gagal memeriksa kuota: " + kuotaErr.message);

    const hasilKuota = Array.isArray(pakai) ? pakai[0] : pakai;

    if (!hasilKuota?.berhasil) {
      return json(
        {
          error: hasilKuota?.alasan ?? "Tidak ada langganan aktif.",
          butuhLangganan: true,
        },
        402,
      );
    }

    const sisaKuota = hasilKuota.sisa;

    const isLinkedIn = sourceType === "linkedin";
    // Batas dinaikkan dari 6.000: CV dua halaman sering lebih panjang, dan
    // bagian yang terpotong biasanya justru pengalaman lama dan pendidikan.
    const inputUser = str(cvText).slice(0, 12000);
    const asal = isLinkedIn ? "salinan profil LinkedIn" : "CV";

    /* ===== Satu panggilan: audit + draft =====
       Pencocokan loker TIDAK lagi lewat AI. Dikerjakan algoritma lokal
       di client memakai scoreJob(), gratis dan hasilnya bisa diverifikasi. */
    /* ===== Panggilan B: draft CV + LinkedIn ===== */
    const prompt = `Kamu AI career coach + ATS specialist untuk platform kerja di Indonesia.

Input user (${asal}):
"""${inputUser}"""

Balas HANYA objek JSON dengan struktur ini:
{
  "arah_karier": "satu kalimat padat, maksimal 15 kata",
  "arah_karier_alasan": "2-3 kalimat: kenapa arah ini yang paling masuk akal, berdasarkan bukti dari CV",
  "posisi_target": ["3-5 nama jabatan spesifik yang realistis dilamar sekarang"],
  "bidang_alternatif": [{"bidang":"nama bidang","alasan":"kenapa bisa dimasuki dengan bekal yang ada, maks 20 kata"}],
  "kekuatan": ["3 poin"],
  "kekurangan": ["2-3 poin"],
  "saran_perbaikan": ["3 saran konkret"],
  "cv_audit": {
    "skor_ats": 0-100,
    "masalah": [{"bagian":"Ringkasan Profil","masalah":"...","perbaikan":"..."}]
  },
  "linkedin_audit": {
    "skor": 0-100,
    "masalah": [{"bagian":"Headline","masalah":"...","perbaikan":"..."}]
  },
  "cv_draft": {
    "fullName":"","headline":"","email":"","phone":"","location":"","linkedin":"","summary":"",
    "experiences":[{"role":"","company":"","start":"","end":"","desc":["bullet1","bullet2"]}],
    "organizations":[{"role":"","org":"","start":"","end":"","desc":[]}],
    "volunteers":[{"role":"","org":"","start":"","end":"","desc":[]}],
    "education":[{"school":"","degree":"","start":"","end":"","desc":[]}],
    "awards":[{"title":"","year":"","issuer":""}],
    "certifications":[{"name":"","issuer":"","year":"","license":"","url":""}],
    "skills":[]
  },
  "linkedin_draft": {
    "headline":"maks 220 karakter",
    "about":"3-4 paragraf, dipisah baris kosong",
    "cover_saran":"1-2 kalimat",
    "photo_saran":"1-2 kalimat",
    "experiences":[{"role":"","company":"","start":"","end":"","lokasi":"","desc":["poin1","poin2"],"skills":[]}],
    "education":[{"school":"","degree":"","field":"","start":"","end":"","grade":"","desc":[]}],
    "certifications":[{"name":"","issuer":"","issued":"","expires":"","credentialId":"","url":""}],
    "volunteering":[{"role":"","org":"","cause":"","start":"","end":"","desc":[]}],
    "skills":[],
    "publications":[{"title":"","publisher":"","date":"","url":"","desc":[]}],
    "awards":[{"title":"","issuer":"","date":"","desc":[]}],
    "languages":[{"name":"","proficiency":""}],
    "organizations":[{"name":"","role":"","start":"","end":"","desc":[]}]
  }
}

ATURAN:
- posisi_target: jabatan yang realistis dilamar SEKARANG dengan pengalaman di CV,
  bukan cita-cita jangka panjang. Sebut level yang sesuai (Staff, Officer, Senior, dst).
- bidang_alternatif: 2-3 bidang di luar jalur utama yang masih bisa dimasuki
  dengan bekal yang sudah ada. Kalau tidak ada yang masuk akal, kembalikan array kosong.
- arah_karier_alasan: rujuk bukti konkret dari CV (posisi, sertifikasi, proyek),
  jangan menyimpulkan tanpa dasar.
- cv_audit.masalah: 3-4 bagian. linkedin_audit.masalah: 4-5 bagian (Headline, Tentang, Pengalaman, Keahlian, Sampul).
- EKSTRAK fakta dari input apa adanya. JANGAN mengarang nama, tanggal, perusahaan, atau angka yang tidak ada.
- Field yang tidak ada di input: isi "" atau []. Array boleh kosong.
- cv_draft bergaya CV: bullet pendek, kata kerja aktif, sertakan angka bila ada di input.
- linkedin_draft bergaya LinkedIn: naratif, orang pertama ("Saya..."), lebih panjang.
- linkedin_draft.about: 270 karakter pertama harus paling kuat, itu yang terlihat sebelum "lihat selengkapnya".
- linkedin_draft.experiences[].skills: maksimal 5 per posisi.
- languages[].proficiency HARUS persis salah satu dari: ${TINGKAT_BAHASA.id.map((x) => `"${x}"`).join(", ")}.
- cover_saran & photo_saran: spesifik untuk bidang kerja user ini, bukan nasihat umum.

${STANDAR_DRAFT.id}

${INSTRUKSI_BAHASA.id}`;

    // Panggilan kedua: draft versi Inggris.
    // Dipisah supaya tiap panggilan punya ruang token sendiri — satu panggilan
    // berisi empat draft sekaligus hampir pasti terpotong.
    const promptEn = `You are an AI career coach and ATS specialist.

Candidate input (${asal}):
"""${inputUser}"""

Return ONLY a JSON object with this structure:
{
  "cv_draft": {
    "fullName":"","headline":"","email":"","phone":"","location":"","linkedin":"","summary":"",
    "experiences":[{"role":"","company":"","start":"","end":"","desc":["bullet1","bullet2"]}],
    "organizations":[{"role":"","org":"","start":"","end":"","desc":[]}],
    "volunteers":[{"role":"","org":"","start":"","end":"","desc":[]}],
    "education":[{"school":"","degree":"","start":"","end":"","desc":[]}],
    "awards":[{"title":"","year":"","issuer":""}],
    "certifications":[{"name":"","issuer":"","year":"","license":"","url":""}],
    "skills":[]
  },
  "linkedin_draft": {
    "headline":"max 220 characters",
    "about":"3-4 paragraphs separated by blank lines",
    "cover_saran":"1-2 sentences",
    "photo_saran":"1-2 sentences",
    "experiences":[{"role":"","company":"","start":"","end":"","lokasi":"","desc":["poin1","poin2"],"skills":[]}],
    "education":[{"school":"","degree":"","field":"","start":"","end":"","grade":"","desc":[]}],
    "certifications":[{"name":"","issuer":"","issued":"","expires":"","credentialId":"","url":""}],
    "volunteering":[{"role":"","org":"","cause":"","start":"","end":"","desc":[]}],
    "skills":[],
    "publications":[{"title":"","publisher":"","date":"","url":"","desc":[]}],
    "awards":[{"title":"","issuer":"","date":"","desc":[]}],
    "languages":[{"name":"","proficiency":""}],
    "organizations":[{"name":"","role":"","start":"","end":"","desc":[]}]
  }
}

RULES:
- Extract facts from the input as-is. Do NOT invent names, dates, companies, or numbers.
- Fields absent from the input: use "" or []. Empty arrays are fine.
- languages[].proficiency MUST be exactly one of: ${TINGKAT_BAHASA.en.map((x) => `"${x}"`).join(", ")}.
- linkedin_draft.experiences[].skills: max 5 per role.
- cover_saran & photo_saran: specific to this candidate's field, not generic advice.

${STANDAR_DRAFT.en}

${INSTRUKSI_BAHASA.en}`;

    let utama, versiEn;
    try {
      [utama, versiEn] = await Promise.all([
        jalankanAnalisis(prompt, 8000, "id", false),
        jalankanAnalisis(promptEn, 8000, "en", true),
      ]);
    } catch (e) {
      /* Analisis gagal — kuota dikembalikan seketika di server.
         User yang gagal lalu menutup tab tidak akan pernah mengirim
         klaim apa pun, jadi menunggu klien bukan pilihan. */
      if (tokenId) {
        const { error: galatKembali } = await supabaseAdmin.rpc(
          "kembalikan_kuota_token",
          { p_user_id: user.id, p_token_id: tokenId },
        );
        if (galatKembali) {
          console.error("Gagal mengembalikan kuota:", galatKembali.message);
        } else {
          console.log(`Kuota analisis dikembalikan untuk ${user.id} (gagal)`);
        }
      }
      throw e;
    }

    const { hasil: hasilAi, penyedia } = utama;
    const hasilEn = versiEn.hasil ?? {};

    /* ----- Normalisasi: bentuk dijamin aman untuk frontend ----- */
    const d = hasilAi.cv_draft ?? {};
    const cvDraft = {
      fullName: str(d.fullName),
      headline: str(d.headline),
      email: str(d.email),
      phone: str(d.phone),
      location: str(d.location),
      linkedin: str(d.linkedin),
      summary: str(d.summary),
      experiences: normalisasiDaftar(d.experiences, BENTUK.cvExperiences),
      organizations: normalisasiDaftar(d.organizations, BENTUK.cvOrganizations),
      volunteers: normalisasiDaftar(d.volunteers, BENTUK.volunteers),
      education: normalisasiDaftar(d.education, BENTUK.cvEducation),
      awards: normalisasiDaftar(d.awards, BENTUK.cvAwards),
      certifications: normalisasiDaftar(d.certifications, BENTUK.cvCerts),
      skills: arrStr(d.skills),
    };

    const l = hasilAi.linkedin_draft ?? {};
    const linkedinDraft = {
      headline: str(l.headline).slice(0, 260),
      about: str(l.about),
      cover_saran: str(l.cover_saran),
      photo_saran: str(l.photo_saran),
      experiences: normalisasiDaftar(l.experiences, BENTUK.experiences).map(
        (e) => ({ ...e, skills: e.skills.slice(0, 5) }),
      ),
      education: normalisasiDaftar(l.education, BENTUK.education),
      certifications: normalisasiDaftar(
        l.certifications,
        BENTUK.certifications,
      ),
      volunteering: normalisasiDaftar(l.volunteering, BENTUK.volunteering),
      skills: arrStr(l.skills).slice(0, 50),
      publications: normalisasiDaftar(l.publications, BENTUK.publications),
      awards: normalisasiDaftar(l.awards, BENTUK.awards),
      // Tingkat bahasa dipaksa ke daftar resmi LinkedIn
      languages: normalisasiDaftar(l.languages, BENTUK.languages).map((x) => ({
        ...x,
        proficiency: TINGKAT_BAHASA.id.includes(x.proficiency)
          ? x.proficiency
          : TINGKAT_BAHASA.id[2],
      })),
      organizations: normalisasiDaftar(l.organizations, BENTUK.organizations),
    };

    // Draft versi Inggris dinormalisasi dengan aturan yang sama
    const de = hasilEn.cv_draft ?? {};
    const cvDraftEn = {
      fullName: str(de.fullName),
      headline: str(de.headline),
      email: str(de.email),
      phone: str(de.phone),
      location: str(de.location),
      linkedin: str(de.linkedin),
      summary: str(de.summary),
      experiences: normalisasiDaftar(de.experiences, BENTUK.cvExperiences),
      organizations: normalisasiDaftar(
        de.organizations,
        BENTUK.cvOrganizations,
      ),
      volunteers: normalisasiDaftar(de.volunteers, BENTUK.volunteers),
      education: normalisasiDaftar(de.education, BENTUK.cvEducation),
      awards: normalisasiDaftar(de.awards, BENTUK.cvAwards),
      certifications: normalisasiDaftar(de.certifications, BENTUK.cvCerts),
      skills: arrStr(de.skills),
    };

    const le = hasilEn.linkedin_draft ?? {};
    const linkedinDraftEn = {
      headline: str(le.headline).slice(0, 260),
      about: str(le.about),
      cover_saran: str(le.cover_saran),
      photo_saran: str(le.photo_saran),
      experiences: normalisasiDaftar(le.experiences, BENTUK.experiences).map(
        (e) => ({ ...e, skills: e.skills.slice(0, 5) }),
      ),
      education: normalisasiDaftar(le.education, BENTUK.education),
      certifications: normalisasiDaftar(
        le.certifications,
        BENTUK.certifications,
      ),
      volunteering: normalisasiDaftar(le.volunteering, BENTUK.volunteering),
      skills: arrStr(le.skills).slice(0, 50),
      publications: normalisasiDaftar(le.publications, BENTUK.publications),
      awards: normalisasiDaftar(le.awards, BENTUK.awards),
      languages: normalisasiDaftar(le.languages, BENTUK.languages).map((x) => ({
        ...x,
        proficiency: TINGKAT_BAHASA.en.includes(x.proficiency)
          ? x.proficiency
          : TINGKAT_BAHASA.en[2],
      })),
      organizations: normalisasiDaftar(le.organizations, BENTUK.organizations),
    };

    const hasil = {
      arah_karier: str(hasilAi.arah_karier),
      arah_karier_alasan: str(hasilAi.arah_karier_alasan),
      posisi_target: arrStr(hasilAi.posisi_target).slice(0, 5),
      bidang_alternatif: normalisasiDaftar(hasilAi.bidang_alternatif, {
        bidang: "s",
        alasan: "s",
      }).slice(0, 3),
      kekuatan: arrStr(hasilAi.kekuatan),
      kekurangan: arrStr(hasilAi.kekurangan),
      saran_perbaikan: arrStr(hasilAi.saran_perbaikan),
      cv_audit: normalisasiAudit(hasilAi.cv_audit, "skor_ats"),
      linkedin_audit: normalisasiAudit(hasilAi.linkedin_audit, "skor"),
      cv_draft: cvDraft,
      linkedin_draft: linkedinDraft,
      cv_draft_en: cvDraftEn,
      linkedin_draft_en: linkedinDraftEn,
    };

    /* ----- Simpan ----- */
    const { error: galatSimpan } = await supabaseAdmin
      .from("analysis_results")
      .insert({
        user_id: user.id,
        ...hasil,
        created_at: new Date().toISOString(),
      });

    if (galatSimpan) {
      console.error("Gagal menyimpan hasil analisis:", galatSimpan.message);
      // Hasilnya tetap dikirim ke user yang menunggu, tapi kuota
      // dikembalikan karena hasilnya tidak bisa dipulihkan nanti kalau
      // user sempat pindah halaman.
      if (tokenId) {
        await supabaseAdmin.rpc("kembalikan_kuota_token", {
          p_user_id: user.id,
          p_token_id: tokenId,
        });
      }
    } else if (tokenId) {
      // Hasil tersimpan dan bisa dipulihkan — kuotanya memang layak
      // terpotong, jadi tokennya ditandai terpakai.
      await supabaseAdmin.rpc("tandai_token_terpakai", {
        p_user_id: user.id,
        p_token_id: tokenId,
      });
    }

    await supabaseAdmin
      .from("profiles")
      .update({
        cv_ai_draft: cvDraft,
        cv_ai_draft_at: new Date().toISOString(),
        linkedin_ai_draft: linkedinDraft,
        linkedin_ai_draft_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    return json({ ...hasil, _penyedia: penyedia, sisa_analisis: sisaKuota });
  } catch (err) {
    const pesan = err instanceof Error ? err.message : "Internal server error.";
    console.error("get-paid-analysis error:", pesan);
    // 503 menandakan boleh dicoba lagi — pembayaran tetap tercatat 'paid'
    return json({ error: pesan, bolehCobaLagi: true }, 503);
  }
});
