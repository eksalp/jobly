// @ts-nocheck
// Edge Function: analisis-cover-letter
//
// Menilai cover letter seperti recruiter, lalu menulis ulang paragrafnya.
// Tersedia untuk paket Starter, Pro, dan Max dengan jatah terpisah dari
// analisis CV (lihat supabase/sql/14_cover_letter.sql).
//
// Alur:
//   1. Verifikasi user
//   2. Klaim satu jatah lewat RPC klaim_analisis_cl (baris 'proses')
//   3. Panggil Gemini dengan responseSchema
//   4. Berhasil → simpan hasil, status 'selesai'
//      Gagal    → hapus baris 'proses' sehingga jatah kembali

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MODEL_ANALISIS as DAFTAR_MODEL } from "../_shared/modelGemini.ts";

const GEMINI_URL = (m) => `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const str = (v) => (typeof v === "string" ? v.trim() : "");
const arr = (v) => (Array.isArray(v) ? v : []);
const arrStr = (v, n) => arr(v).map(str).filter(Boolean).slice(0, n);
const angka = (v) => Math.max(0, Math.min(100, Math.round(typeof v === "number" && isFinite(v) ? v : 0)));
const tidur = (ms) => new Promise((r) => setTimeout(r, ms));
const tanpaPisah = (s) => str(s).replace(/\s*—\s*/g, ", ");

const ASPEK = ["kecocokan", "struktur", "bukti", "nada", "kejelasan"];

const SKEMA = {
  type: "OBJECT",
  properties: {
    skor: { type: "INTEGER" },
    kesan_hr: { type: "STRING" },
    skor_aspek: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          aspek: { type: "STRING", enum: ASPEK },
          nilai: { type: "INTEGER" },
          catatan: { type: "STRING" },
        },
        required: ["aspek", "nilai", "catatan"],
      },
    },
    kekuatan: { type: "ARRAY", items: { type: "STRING" } },
    masalah: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          bagian: { type: "STRING", enum: ["pembuka", "isi", "penutup", "umum"] },
          kutipan: { type: "STRING" },
          masalah: { type: "STRING" },
          perbaikan: { type: "STRING" },
        },
        required: ["bagian", "masalah", "perbaikan"],
      },
    },
    kata_kunci_kurang: { type: "ARRAY", items: { type: "STRING" } },
    perbaikan: {
      type: "OBJECT",
      properties: {
        pembuka: { type: "STRING" },
        isi: { type: "ARRAY", items: { type: "STRING" } },
        penutup: { type: "STRING" },
      },
      required: ["pembuka", "isi", "penutup"],
    },
    subjek_email: { type: "STRING" },
  },
  required: ["skor", "kesan_hr", "skor_aspek", "kekuatan", "masalah", "perbaikan", "subjek_email"],
};

const ANGGARAN_MS = 80000;
const BATAS_PANGGILAN_MS = 42000;

function ekstrakJson(mentah) {
  const t = (mentah || "").replace(/```json/gi, "").replace(/```/g, "").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a === -1 || b <= a) throw new Error(`Output bukan JSON. Cuplikan: ${t.slice(0, 150)}`);
  return JSON.parse(t.slice(a, b + 1));
}

async function panggilGemini(prompt, model, batasMs, pakaiSkema = true, pakaiThinking = true) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY belum di-set.");
  const pembatal = new AbortController();
  const pewaktu = setTimeout(() => pembatal.abort(), batasMs);
  let res;
  try {
    res = await fetch(GEMINI_URL(model), {
      signal: pembatal.signal,
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          ...(pakaiSkema ? { responseSchema: SKEMA } : {}),
          maxOutputTokens: 9000,
          ...(pakaiThinking ? { thinkingConfig: { thinkingLevel: "low" } } : {}),
          temperature: 0.4,
        },
      }),
    });
  } catch (e) {
    if (e?.name === "AbortError") {
      const err = new Error(`Gemini tidak merespons dalam ${Math.round(batasMs / 1000)} detik.`);
      err.status = 503;
      throw err;
    }
    throw e;
  } finally {
    clearTimeout(pewaktu);
  }
  if (!res.ok) {
    const t = await res.text();
    if (res.status === 400 && pakaiThinking && /thinking/i.test(t)) {
      return panggilGemini(prompt, model, batasMs, pakaiSkema, false);
    }
    const e = new Error(`Gemini error ${res.status}: ${t.slice(0, 200)}`);
    e.status = res.status;
    throw e;
  }
  const data = await res.json();
  const k = data?.candidates?.[0];
  if (!k) throw new Error("Gemini tidak mengembalikan hasil.");
  if (k.finishReason === "MAX_TOKENS") throw new Error("Output terpotong.");
  const teks = (k.content?.parts || []).map((p) => p.text || "").join("");
  if (!teks.trim()) throw new Error("Output Gemini kosong.");
  return pakaiSkema ? JSON.parse(teks) : ekstrakJson(teks);
}

async function jalankan(prompt) {
  const mulai = Date.now();
  const sisa = () => ANGGARAN_MS - (Date.now() - mulai);
  const percobaan = [
    { model: DAFTAR_MODEL[0], skema: true, jeda: 0 },
    { model: DAFTAR_MODEL[0], skema: false, jeda: 0, hanyaJika400: true },
    ...DAFTAR_MODEL.slice(1).map((model) => ({ model, skema: true, jeda: 800 })),
  ];
  let terakhir;
  for (const { model, skema, jeda, hanyaJika400 } of percobaan) {
    if (hanyaJika400 && terakhir?.status !== 400) continue;
    if (terakhir && sisa() < 20000) break;
    if (jeda) await tidur(jeda);
    try {
      const batas = Math.max(15000, Math.min(BATAS_PANGGILAN_MS, sisa() - 3000));
      return await panggilGemini(prompt, model, batas, skema);
    } catch (e) {
      terakhir = e;
      if (e?.status === 401 || e?.status === 403) throw e;
      console.warn(`Percobaan gagal (${model}, skema=${skema}): ${e.message}`);
    }
  }
  throw terakhir;
}

function buatPrompt({ surat, posisi, perusahaan, lowongan, cv, bahasa }) {
  const en = bahasa === "EN";
  const aturanBahasa = en
    ? `Cover letter ini berbahasa INGGRIS. Tulis "perbaikan" dan "subjek_email" dalam bahasa Inggris
profesional yang natural (bukan terjemahan kaku). Semua field penilaian lainnya (kesan_hr,
catatan, kekuatan, masalah, perbaikan pada daftar masalah) tetap dalam Bahasa Indonesia, kecuali
"perbaikan" di daftar masalah yang berisi contoh kalimat pengganti: tulis dalam bahasa Inggris.`
    : `Semua teks dalam Bahasa Indonesia yang baku tetapi natural, seperti surat lamaran yang
ditulis orang Indonesia yang terampil menulis. Pakai "saya", bukan "aku".`;

  return `Kamu adalah senior recruiter di Indonesia yang sudah membaca ribuan surat lamaran untuk
perusahaan swasta, BUMN, startup, dan perusahaan multinasional. Nilai cover letter berikut
dengan jujur, lalu tulis ulang menjadi versi yang siap dikirim.

POSISI YANG DILAMAR: ${str(posisi).slice(0, 150) || "(tidak disebut)"}
PERUSAHAAN: ${str(perusahaan).slice(0, 150) || "(tidak disebut)"}

COVER LETTER:
"""${str(surat).slice(0, 7000)}"""

${lowongan ? `TEKS LOWONGAN (pakai untuk menilai kecocokan dan kata kunci):\n"""${str(lowongan).slice(0, 6000)}"""\n` : "TEKS LOWONGAN: tidak diberikan. Nilai kecocokan dari posisi dan perusahaan saja, dan kosongkan kata_kunci_kurang.\n"}
${cv ? `RINGKASAN CV PELAMAR (sumber fakta tambahan, JANGAN mengarang di luar ini dan surat):\n"""${str(cv).slice(0, 5000)}"""\n` : ""}
CARA MENILAI:
- skor 0-100, gabungan berbobot: kecocokan dengan posisi/lowongan 30, bukti dan pencapaian
  konkret 25, struktur (pembuka yang menyebut posisi, isi yang relevan, penutup dengan ajakan) 20,
  nada dan bahasa 15, kejelasan dan panjang (ideal 250-400 kata) 10. Surat generik yang bisa
  dikirim ke perusahaan mana saja tidak boleh di atas 60. Jangan murah hati.
- skor_aspek: TEPAT 5 item dengan aspek ${ASPEK.join(", ")}, masing-masing 0-100 dan catatan 1 kalimat.
- kesan_hr: 2-3 kalimat, kesan pertama recruiter setelah membaca 30 detik, apa adanya.
- kekuatan: 2-4 poin spesifik (sebut bagian suratnya).
- masalah: 3-6 masalah paling berpengaruh, urut dari yang paling penting. "kutipan" berisi
  potongan pendek dari surat (kosongkan kalau masalahnya tentang hal yang tidak ada), "masalah"
  menjelaskan kenapa ini merugikan di mata recruiter, "perbaikan" berisi contoh kalimat
  pengganti yang siap pakai, bukan nasihat umum.
- kata_kunci_kurang: maksimal 8 keahlian atau istilah penting dari lowongan yang belum muncul
  di surat padahal relevan dengan pengalaman pelamar.

CARA MENULIS ULANG (field "perbaikan"):
- pembuka: 2-3 kalimat. Sebut posisi dan perusahaan, lalu satu alasan kuat kenapa pelamar cocok.
  Jangan dibuka dengan "Dengan hormat" (itu salam, sudah terpisah) atau "Melalui surat ini".
- isi: 1-3 paragraf. Hubungkan pengalaman, keahlian, dan pencapaian pelamar dengan kebutuhan
  posisi. Angka HANYA kalau ada di surat atau CV. Jangan menambah pengalaman, sertifikat,
  atau angka yang tidak ada di input. Kalau buktinya tipis, tulis secara kualitatif.
- penutup: 2 kalimat, nyatakan kesediaan wawancara dan ucapan terima kasih, tanpa memohon.
- Total sekitar 250-380 kata. Hindari klise seperti "pekerja keras", "dinamis", "passionate",
  "saya yakin saya adalah kandidat terbaik". JANGAN memakai tanda pisah panjang (—).
- subjek_email: format yang lazim, misalnya "Lamaran Posisi [Posisi] - [Nama]" atau
  "Application for [Position] - [Name]". Isi nama dari surat bila ada.

${aturanBahasa}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (b, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  let admin = null;
  let analisisId = null;

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json();
    const surat = str(body?.surat);
    const posisi = str(body?.posisi);
    const perusahaan = str(body?.perusahaan);
    const lowongan = str(body?.lowongan);
    const cv = str(body?.cv);
    const bahasa = body?.bahasa === "EN" ? "EN" : "ID";

    const jumlahKata = surat.split(/\s+/).filter(Boolean).length;
    if (jumlahKata < 60) {
      return json({ error: "Cover letter terlalu pendek untuk dinilai. Tulis minimal 60 kata dulu." }, 400);
    }

    admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: klaim, error: klaimErr } = await admin.rpc("klaim_analisis_cl", {
      p_user: user.id,
      p_posisi: posisi,
      p_perusahaan: perusahaan,
    });
    if (klaimErr) throw new Error("Gagal memeriksa jatah: " + klaimErr.message);
    const k = Array.isArray(klaim) ? klaim[0] : klaim;
    if (!k?.berhasil) return json({ error: k?.alasan ?? "Tidak ada paket aktif.", butuhLangganan: true }, 402);
    analisisId = k.analisis_id;

    const mulai = Date.now();
    const h = await jalankan(buatPrompt({ surat, posisi, perusahaan, lowongan, cv, bahasa }));
    console.log(`Analisis cover letter selesai dalam ${Date.now() - mulai} ms`);

    const aspekMap = new Map(arr(h.skor_aspek).map((a) => [a?.aspek, a]));
    const hasil = {
      skor: angka(h.skor),
      kesan_hr: tanpaPisah(h.kesan_hr),
      skor_aspek: ASPEK.map((a) => ({
        aspek: a,
        nilai: angka(aspekMap.get(a)?.nilai),
        catatan: tanpaPisah(aspekMap.get(a)?.catatan),
      })),
      kekuatan: arrStr(h.kekuatan, 4).map(tanpaPisah),
      masalah: arr(h.masalah)
        .map((m) => ({
          bagian: ["pembuka", "isi", "penutup", "umum"].includes(m?.bagian) ? m.bagian : "umum",
          kutipan: str(m?.kutipan).slice(0, 300),
          masalah: tanpaPisah(m?.masalah),
          perbaikan: tanpaPisah(m?.perbaikan),
        }))
        .filter((m) => m.masalah)
        .slice(0, 6),
      kata_kunci_kurang: lowongan ? arrStr(h.kata_kunci_kurang, 8) : [],
      perbaikan: {
        pembuka: tanpaPisah(h.perbaikan?.pembuka),
        isi: arrStr(h.perbaikan?.isi, 3).map(tanpaPisah),
        penutup: tanpaPisah(h.perbaikan?.penutup),
      },
      subjek_email: tanpaPisah(h.subjek_email),
      bahasa,
      pakai_lowongan: Boolean(lowongan),
    };

    if (!hasil.perbaikan.pembuka || !hasil.perbaikan.isi.length) throw new Error("Hasil AI tidak lengkap.");

    const { error: galatSimpan } = await admin
      .from("cover_letter_analisis")
      .update({ status: "selesai", hasil })
      .eq("id", analisisId);
    if (galatSimpan) throw new Error("Gagal menyimpan hasil: " + galatSimpan.message);

    return json({ ...hasil, id: analisisId, dibuat_at: new Date().toISOString(), sisa: k.sisa });
  } catch (err) {
    const pesan = err instanceof Error ? err.message : "Internal server error.";
    console.error("analisis-cover-letter error:", pesan);
    // Jatah dikembalikan dengan menghapus baris yang belum selesai
    if (admin && analisisId) {
      const { error: e2 } = await admin.from("cover_letter_analisis").delete().eq("id", analisisId).eq("status", "proses");
      if (e2) console.error("Gagal mengembalikan jatah:", e2.message);
    }
    const sibuk = /UNAVAILABLE|high demand|overload|RESOURCE_EXHAUSTED/i.test(pesan) || /Gemini error (?:429|503)/i.test(pesan);
    return json(
      {
        error: sibuk
          ? "Server AI sedang penuh. Tunggu sebentar lalu coba lagi. Jatahmu tidak terpotong."
          : "Analisis gagal. Jatahmu tidak terpotong, silakan coba lagi.",
        detail: pesan,
      },
      503,
    );
  }
});
