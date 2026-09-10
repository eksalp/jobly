// @ts-nocheck
// Edge Function: simulasi-interview
//
// Menangani satu giliran percakapan wawancara. Klien mengirim seluruh
// riwayat dialog, server membalas dengan pertanyaan berikutnya — atau,
// kalau sesi diakhiri, dengan penilaian menyeluruh.
//
// Suara TIDAK diproses di sini. Speech-to-text dan text-to-speech
// dikerjakan browser lewat Web Speech API, jadi biayanya nol dan
// latensinya jauh lebih rendah daripada mengirim audio bolak-balik.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_URL = (m) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;
const MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.0-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const str = (v) => (typeof v === "string" ? v : "");
const arr = (v) => (Array.isArray(v) ? v : []);
const num = (v, fb = 0) => (typeof v === "number" && isFinite(v) ? v : fb);

function ekstrakJson(mentah) {
  let t = (mentah || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a === -1 || b <= a) throw new Error("Output bukan JSON.");
  return JSON.parse(t.slice(a, b + 1));
}

async function panggilGemini(prompt, maksToken = 1200) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY belum di-set.");

  const pembatal = new AbortController();
  const pewaktu = setTimeout(() => pembatal.abort(), 25000);

  let res;
  try {
    res = await fetch(GEMINI_URL(MODEL), {
      signal: pembatal.signal,
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: maksToken,
          temperature: 0.7,
        },
      }),
    });
  } catch (e) {
    if (e?.name === "AbortError")
      throw new Error("AI tidak merespons tepat waktu.");
    throw e;
  } finally {
    clearTimeout(pewaktu);
  }

  if (!res.ok) {
    const t = await res.text();
    const err = new Error(`Gemini error ${res.status}: ${t.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const teks = (data?.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || "")
    .join("");
  if (!teks.trim()) throw new Error("Output AI kosong.");
  return ekstrakJson(teks);
}

/* ------------------------------------------------------------------ */

function promptPertanyaan({ posisi, kategori, dialog, sisaMenit, totalMenit }) {
  const riwayat = dialog
    .map((d) => `${d.dari === "ai" ? "PEWAWANCARA" : "KANDIDAT"}: ${d.teks}`)
    .join("\n");

  const sudah = dialog.filter((d) => d.dari === "ai").length;

  // Tahap wawancara ditentukan sisa waktu, bukan jumlah pertanyaan.
  // Ini yang membuat percakapan terasa mengalir: pewawancara sungguhan
  // juga menyesuaikan kedalaman pertanyaan dengan waktu yang tersisa.
  let arahan;
  if (sisaMenit <= 2) {
    arahan = `Waktu wawancara hampir habis (sisa ~${sisaMenit} menit). Ajukan SATU
pertanyaan penutup yang ringan — misalnya apakah kandidat punya pertanyaan,
atau hal terakhir yang ingin disampaikan.`;
  } else if (sisaMenit <= 5) {
    arahan = `Sisa waktu ~${sisaMenit} menit. Mulai arahkan ke pertanyaan penutup:
rencana ke depan, ekspektasi, atau kesiapan bergabung.`;
  } else if (sudah === 0) {
    arahan = `Ini AWAL wawancara. Sapa kandidat sekali dengan hangat dan singkat,
lalu ajukan pertanyaan pembuka.`;
  } else {
    arahan = `Wawancara sedang berjalan (sisa ~${sisaMenit} dari ${totalMenit} menit).
Gali lebih dalam dari jawaban terakhir kandidat.`;
  }

  return `Kamu pewawancara kerja profesional di Indonesia. Kamu sedang mewawancarai
kandidat untuk posisi "${posisi}". Fokus wawancara: ${kategori}.

${riwayat ? `Percakapan sejauh ini:\n${riwayat}\n` : "Belum ada percakapan."}

${arahan}

Balas HANYA objek JSON:
{
  "pertanyaan": "",
  "catatan_singkat": ""
}

ATURAN BICARA — ini wawancara LISAN, bukan tertulis:
- Maksimal 2 kalimat. Kalimat panjang sulit disimak lewat suara.
- Bahasa percakapan yang wajar. Boleh menanggapi singkat jawaban kandidat
  sebelum bertanya ("Menarik." / "Oke, saya paham.") supaya tidak terdengar
  seperti mesin membacakan daftar.
- GALI dari jawaban terakhir kandidat. Wawancara yang baik menelusuri satu
  topik sampai jelas, bukan melompat ke topik baru tiap giliran.
- Kalau jawaban kandidat terlalu umum atau menghindar, minta contoh konkret.
  Itu bagian paling melatih dari sesi ini.
- Jangan menyapa ulang setelah pertanyaan pertama.
- "catatan_singkat": satu kalimat penilaian internal atas jawaban terakhir
  (kosongkan kalau belum ada jawaban). Tidak dibacakan ke kandidat.`;
}

function promptPenilaian({ posisi, kategori, dialog, menit }) {
  const riwayat = dialog
    .map((d) => `${d.dari === "ai" ? "PEWAWANCARA" : "KANDIDAT"}: ${d.teks}`)
    .join("\n");

  return `Kamu pewawancara profesional. Berikut transkrip wawancara ${menit} menit
untuk posisi "${posisi}" dengan fokus ${kategori}:

${riwayat}

Nilai penampilan kandidat. Balas HANYA objek JSON:
{
  "skor": 0,
  "kejelasan": "kurang | cukup | baik | sangat baik",
  "struktur": "kurang | cukup | baik | sangat baik",
  "relevansi": "kurang | cukup | baik | sangat baik",
  "kekuatan": ["", ""],
  "perbaikan": ["", ""],
  "catatan": ""
}

ATURAN:
- "skor": 0-100, jujur. Jangan menggembungkan nilai — kandidat memakai ini
  untuk memperbaiki diri sebelum wawancara sungguhan.
- "kejelasan": seberapa mudah jawabannya dipahami.
- "struktur": apakah jawaban tersusun (misalnya memakai pola STAR) atau melompat.
- "relevansi": apakah jawabannya menjawab yang ditanya.
- "kekuatan" dan "perbaikan": MAKSIMAL 3 poin masing-masing, spesifik dan
  merujuk pada apa yang benar-benar kandidat katakan — bukan nasihat umum.
- "catatan": 2-3 kalimat penutup yang membangun.
Semua dalam Bahasa Indonesia.`;
}

/* ------------------------------------------------------------------ */

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

    const body = await req.json();
    const aksi = str(body.aksi) || "tanya";
    const posisi = str(body.posisi).slice(0, 120);
    const kategori = str(body.kategori).slice(0, 120);
    // Konteks dibatasi 24 giliran terakhir. Percakapan 15 menit bisa
    // menghasilkan lebih banyak, dan mengirim semuanya membuat prompt
    // membengkak tanpa menambah kualitas — AI cukup ingat alur terkini.
    const dialog = arr(body.dialog).slice(-24);
    const totalMenit = Math.min(30, Math.max(5, num(body.totalMenit, 15)));
    const sisaMenit = Math.max(0, Math.round(num(body.sisaMenit, totalMenit)));

    if (!posisi) return json({ error: "Posisi wajib diisi." }, 400);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    /* ---------- MULAI: potong kuota sekali di awal sesi ---------- */
    if (aksi === "mulai") {
      const { data: pakai, error: kuotaErr } = await supabaseAdmin.rpc(
        "pakai_kuota",
        { p_user_id: user.id, p_jenis: "interview" },
      );

      if (kuotaErr)
        throw new Error("Gagal memeriksa kuota: " + kuotaErr.message);

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

      const h = await panggilGemini(
        promptPertanyaan({
          posisi,
          kategori,
          dialog: [],
          sisaMenit: totalMenit,
          totalMenit,
        }),
      );
      return json({
        pertanyaan: str(h.pertanyaan),
        sisa_interview: hk.sisa,
      });
    }

    /* ---------- TANYA: giliran berikutnya, tidak memotong kuota ---------- */
    if (aksi === "tanya") {
      const h = await panggilGemini(
        promptPertanyaan({ posisi, kategori, dialog, sisaMenit, totalMenit }),
      );
      return json({
        pertanyaan: str(h.pertanyaan),
        catatan: str(h.catatan_singkat),
      });
    }

    /* ---------- NILAI: akhir sesi ---------- */
    if (aksi === "nilai") {
      const menit = Math.max(1, Math.round(num(body.durasiDetik, 0) / 60));
      const h = await panggilGemini(
        promptPenilaian({ posisi, kategori, dialog, menit }),
        1600,
      );

      const tingkat = ["kurang", "cukup", "baik", "sangat baik"];
      const bersih = (v) => (tingkat.includes(v) ? v : "cukup");
      const daftar = (v) =>
        arr(v)
          .filter((x) => typeof x === "string" && x.trim())
          .slice(0, 3);

      const hasil = {
        skor: Math.max(0, Math.min(100, Math.round(num(h.skor, 60)))),
        kejelasan: bersih(h.kejelasan),
        struktur: bersih(h.struktur),
        relevansi: bersih(h.relevansi),
        kekuatan: daftar(h.kekuatan),
        perbaikan: daftar(h.perbaikan),
        catatan: str(h.catatan),
      };

      // Disimpan tanpa ditunggu — hasilnya sudah di tangan user, dan
      // menunggu tulisan database hanya menambah jeda.
      supabaseAdmin
        .from("interview_sessions")
        .insert({
          user_id: user.id,
          posisi,
          kategori,
          jumlah_soal: dialog.filter((d) => d.dari === "ai").length,
          durasi_detik: num(body.durasiDetik, 0),
          skor: hasil.skor,
          transkrip: dialog,
          ringkasan: hasil,
        })
        .then(({ error }) => {
          if (error)
            console.error("Gagal menyimpan sesi interview:", error.message);
        });

      return json(hasil);
    }

    return json({ error: "Aksi tidak dikenali." }, 400);
  } catch (err) {
    const pesan = err instanceof Error ? err.message : "Internal server error.";
    console.error("simulasi-interview error:", pesan);
    const sibuk = /UNAVAILABLE|overload|RESOURCE_EXHAUSTED|429|503/i.test(
      pesan,
    );
    return json(
      {
        error: sibuk
          ? "Server AI sedang penuh. Tunggu sebentar lalu coba lagi."
          : pesan,
        detail: pesan,
        bolehCobaLagi: true,
      },
      503,
    );
  }
});
