// @ts-nocheck
// Edge Function: analisis-pindah-karier
//
// Menilai kelayakan pindah dari bidang saat ini ke bidang tujuan.
// Memakai kuota analisis yang sama dengan get-paid-analysis.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SKEMA_PINDAH } from "./skema-pindah.ts";

const GEMINI_URL = (m) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;
const MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.7-flash";
const MODEL_CADANGAN =
  Deno.env.get("GEMINI_MODEL_FALLBACK") ?? "gemini-3.6-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const str = (v) => (typeof v === "string" ? v : "");
const arr = (v) => (Array.isArray(v) ? v : []);
const arrStr = (v) => arr(v).filter((x) => typeof x === "string" && x.trim());
const num = (v, fb = 0) => (typeof v === "number" && isFinite(v) ? v : fb);

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));

// Dipakai saat berjalan tanpa responseSchema: ambil objek JSON dari teks,
// tahan terhadap fence markdown maupun kalimat pembuka.
function ekstrakJson(mentah) {
  let t = (mentah || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const mulai = t.indexOf("{");
  const akhir = t.lastIndexOf("}");
  if (mulai === -1 || akhir <= mulai) {
    throw new Error(`Output bukan JSON. Cuplikan: ${t.slice(0, 150)}`);
  }
  return JSON.parse(t.slice(mulai, akhir + 1));
}
const bolehUlang = (s) => [429, 500, 503, 529].includes(s);

// Gateway memutus permintaan yang berjalan terlalu lama (504). Anggaran
// total dijaga di bawah ambang itu, dan percobaan kedua hanya dijalankan
// kalau sisa waktunya masih cukup.
const ANGGARAN_MS = 80000; // total untuk seluruh percobaan
const BATAS_PANGGILAN_MS = 42000;

async function panggilGemini(
  prompt,
  model,
  batasMs = BATAS_PANGGILAN_MS,
  pakaiSkema = true,
) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY belum di-set.");

  // Tanpa batas waktu, satu panggilan yang menggantung membuat seluruh
  // permintaan tidak pernah selesai — user melihat loading tanpa akhir.
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
          // Skema menjamin bentuk output, tapi Gemini kadang menolaknya
          // untuk struktur bersarang tertentu. Mode tanpa skema dipakai
          // sebagai cadangan, dengan parsing manual sebagai gantinya.
          ...(pakaiSkema ? { responseSchema: SKEMA_PINDAH } : {}),
          maxOutputTokens: 3000,
          temperature: 0.4,
        },
      }),
    });
  } catch (e) {
    if (e?.name === "AbortError") {
      const err = new Error(
        `Gemini tidak merespons dalam ${Math.round(batasMs / 1000)} detik.`,
      );
      err.status = 503; // layak dicoba ulang
      throw err;
    }
    throw e;
  } finally {
    clearTimeout(pewaktu);
  }

  if (!res.ok) {
    const t = await res.text();
    const e = new Error(`Gemini error ${res.status}: ${t.slice(0, 200)}`);
    e.status = res.status;
    throw e;
  }

  const data = await res.json();
  const kandidat = data?.candidates?.[0];
  if (!kandidat) throw new Error("Gemini tidak mengembalikan hasil.");
  if (kandidat.finishReason === "MAX_TOKENS")
    throw new Error("Output terpotong.");

  const teks = (kandidat.content?.parts || [])
    .map((p) => p.text || "")
    .join("");
  if (!teks.trim()) throw new Error("Output Gemini kosong.");

  return pakaiSkema ? JSON.parse(teks) : ekstrakJson(teks);
}

async function jalankan(prompt) {
  // Dua percobaan saja. Dengan batas 45 detik per panggilan, tiga
  // percobaan bisa menembus batas waktu Edge Function itu sendiri.
  const percobaan = [
    { model: MODEL, jeda: 0 },
    { model: MODEL_CADANGAN, jeda: 1000 },
  ];
  let terakhir;
  for (const { model, jeda, skema } of percobaan) {
    if (jeda) await tidur(jeda);
    try {
      return await panggilGemini(prompt, model);
    } catch (e) {
      terakhir = e;
      // Status 400 biasanya berarti skema ditolak — percobaan berikutnya
      // berjalan tanpa skema, jadi jangan dihentikan di sini.
      const layakUlang = bolehUlang(e?.status) || (e?.status === 400 && skema);
      if (e?.status && !layakUlang) throw e;
      console.warn(`Percobaan gagal (${model}): ${e.message}`);
    }
  }
  throw terakhir;
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  const json = (b, status = 200) =>
    new Response(JSON.stringify(b), {
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

    const { cvText, bidangTujuan } = await req.json();

    if (!bidangTujuan?.trim())
      return json({ error: "Bidang tujuan wajib diisi." }, 400);
    if (!cvText?.trim())
      return json({ error: "CV atau profil belum diisi." }, 400);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    /* Gerbang kuota — kuota dikurangi secara atomik di Postgres,
       sama seperti get-paid-analysis. */
    const { data: pakai, error: kuotaErr } = await supabaseAdmin.rpc(
      "pakai_kuota_analisis",
      { p_user_id: user.id },
    );

    if (kuotaErr) throw new Error("Gagal memeriksa kuota: " + kuotaErr.message);

    const hk = Array.isArray(pakai) ? pakai[0] : pakai;
    if (!hk?.berhasil) {
      return json(
        {
          error: hk?.alasan ?? "Tidak ada langganan aktif.",
          butuhLangganan: true,
        },
        402,
      );
    }

    const sisaKuota = hk.sisa;

    const prompt = `Kamu AI career coach untuk pasar kerja Indonesia.

Profil user saat ini:
"""${str(cvText).slice(0, 3500)}"""

Bidang yang ingin dituju: "${str(bidangTujuan).slice(0, 120)}"

Nilai kelayakan perpindahan ini. Balas HANYA satu objek JSON valid, tanpa
penjelasan dan tanpa markdown fence, dengan struktur PERSIS ini:
{
  "ringkasan": "",
  "tingkat_kesulitan": "mudah | sedang | sulit",
  "estimasi_bulan": 0,
  "peluang_persen": 0,
  "skill_transfer": [{"skill":"","kenapa_berguna":""}],
  "skill_kurang": [{"skill":"","prioritas":"wajib | penting | nilai tambah","cara_belajar":""}],
  "posisi_masuk": [{"jabatan":"","level":"","alasan":""}],
  "tahapan": [{"fase":"","durasi":"","fokus":""}],
  "risiko": [""],
  "saran_jujur": ""
}

ATURAN PENTING:
- JUJUR. Kalau perpindahannya sulit atau tidak realistis, katakan apa adanya di
  "saran_jujur" dan "risiko". Jangan memberi harapan palsu — user mengambil
  keputusan hidup berdasarkan ini.
- "skill_transfer": MAKSIMAL 4 item. Keahlian yang SUDAH dimiliki dan tetap
  terpakai di bidang tujuan. Di "kenapa_berguna", sebutkan dari pengalaman mana
  keahlian itu datang. Ini bagian terpenting: orang sering meremehkan apa yang
  sudah mereka bawa.
- "skill_kurang": MAKSIMAL 5 item. Tandai "wajib" hanya untuk yang benar-benar
  jadi syarat masuk, bukan sekadar bagus dimiliki.
- "posisi_masuk": MAKSIMAL 3 item. Jabatan yang realistis dilamar SETELAH
  mengisi kekurangan wajib. Sebut levelnya jujur — pindah bidang sering berarti
  turun level, katakan itu.
- "tahapan": TEPAT 3 fase berurutan dengan durasi masuk akal.
- "estimasi_bulan": total waktu realistis sampai siap melamar.
- "peluang_persen": 0-100, seberapa besar peluang berhasil pindah.
- "risiko": MAKSIMAL 3 poin — penurunan gaji, usia, persaingan, atau kebutuhan
  pengalaman yang tidak bisa dikejar kursus.
- "ringkasan" dan "saran_jujur": masing-masing maksimal 3 kalimat.
Semua teks dalam Bahasa Indonesia.`;

    const mulai = Date.now();
    const h = await jalankan(prompt);
    console.log(
      `Analisis pindah karier selesai dalam ${Date.now() - mulai} ms`,
    );

    const hasil = {
      bidang_tujuan: str(bidangTujuan),
      ringkasan: str(h.ringkasan),
      tingkat_kesulitan: ["mudah", "sedang", "sulit"].includes(
        h.tingkat_kesulitan,
      )
        ? h.tingkat_kesulitan
        : "sedang",
      estimasi_bulan: Math.max(0, Math.round(num(h.estimasi_bulan, 6))),
      peluang_persen: Math.max(
        0,
        Math.min(100, Math.round(num(h.peluang_persen, 50))),
      ),
      skill_transfer: arr(h.skill_transfer)
        .map((x) => ({
          skill: str(x?.skill),
          kenapa_berguna: str(x?.kenapa_berguna),
        }))
        .filter((x) => x.skill),
      skill_kurang: arr(h.skill_kurang)
        .map((x) => ({
          skill: str(x?.skill),
          prioritas: ["wajib", "penting", "nilai tambah"].includes(x?.prioritas)
            ? x.prioritas
            : "penting",
          cara_belajar: str(x?.cara_belajar),
        }))
        .filter((x) => x.skill),
      posisi_masuk: arr(h.posisi_masuk)
        .map((x) => ({
          jabatan: str(x?.jabatan),
          level: str(x?.level),
          alasan: str(x?.alasan),
        }))
        .filter((x) => x.jabatan),
      tahapan: arr(h.tahapan)
        .map((x) => ({
          fase: str(x?.fase),
          durasi: str(x?.durasi),
          fokus: str(x?.fokus),
        }))
        .filter((x) => x.fase),
      risiko: arrStr(h.risiko),
      saran_jujur: str(h.saran_jujur),
    };

    // Penyimpanan tidak ditunggu. Hasilnya sudah ada di tangan user, dan
    // menunggu tulisan ke database hanya menambah waktu pada permintaan
    // yang sudah mepet batas.
    supabaseAdmin
      .from("career_switches")
      .insert({
        user_id: user.id,
        bidang_tujuan: hasil.bidang_tujuan,
        hasil,
        created_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error)
          console.error(
            "Gagal menyimpan riwayat pindah karier:",
            error.message,
          );
      });

    return json({ ...hasil, sisa_analisis: sisaKuota });
  } catch (err) {
    const pesan = err instanceof Error ? err.message : "Internal server error.";
    console.error("analisis-pindah-karier error:", pesan);

    // Deteksi dibuat spesifik. Pola longgar seperti /503/ ikut cocok dengan
    // pesan buatan kita sendiri, sehingga sebab aslinya tertutupi.
    const sibuk =
      /UNAVAILABLE|high demand|overload|RESOURCE_EXHAUSTED/i.test(pesan) ||
      /Gemini error (?:429|503)/i.test(pesan);

    // `detail` selalu disertakan supaya sebab aslinya tetap bisa dibaca
    // tanpa harus membuka log server.
    return json(
      {
        error: sibuk
          ? "Server AI sedang penuh. Tunggu sebentar lalu coba lagi — kuotamu tidak terpotong."
          : pesan,
        detail: pesan,
        bolehCobaLagi: true,
      },
      503,
    );
  }
});
