// @ts-nocheck
// Skema analisis pindah karier.

const S = { type: "string" };
const N = { type: "number" };
const arrS = { type: "array", items: S };

const objek = (properties) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
});

const daftar = (properties) => ({ type: "array", items: objek(properties) });

export const SKEMA_PINDAH = objek({
  // Penilaian jujur, termasuk kalau ternyata sulit
  ringkasan: S,
  tingkat_kesulitan: { type: "string", enum: ["mudah", "sedang", "sulit"] },
  estimasi_bulan: N,
  peluang_persen: N,

  // Skema sengaja dibuat dangkal. Generasi dengan responseSchema melambat
  // signifikan seiring bertambahnya field bersarang, dan fungsi ini punya
  // anggaran waktu yang ketat sebelum gateway memutusnya.

  // Yang paling bernilai: apa yang sudah dimiliki dan tetap terpakai.
  // Rujukan ke pengalaman digabung ke dalam kalimat penjelasnya.
  skill_transfer: daftar({
    skill: S,
    kenapa_berguna: S,
  }),

  skill_kurang: daftar({
    skill: S,
    prioritas: { type: "string", enum: ["wajib", "penting", "nilai tambah"] },
    cara_belajar: S,
  }),

  posisi_masuk: daftar({
    jabatan: S,
    level: S,
    alasan: S,
  }),

  tahapan: daftar({
    fase: S,
    durasi: S,
    fokus: S,
  }),

  // Disebutkan terus terang, bukan disembunyikan
  risiko: arrS,
  saran_jujur: S,
});
