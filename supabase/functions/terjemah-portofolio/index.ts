// @ts-nocheck
// Edge Function: terjemah-portofolio
//
// Menerjemahkan isi portofolio (studi kasus, hasil kerja, brief, ringkasan
// profil) ke bahasa Inggris profesional untuk PDF portofolio versi English.
// Khusus paket Pro dan Max. Hasil disimpan oleh klien di kolom
// portofolio_proyek.terjemahan, jadi teks yang sama tidak diterjemahkan dua kali.
//
// Masukan : { teks: { [kunci]: string } }   (maks. ±40.000 karakter)
// Keluaran: { teks: { [kunci]: string } }   kunci sama persis

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MODEL_TERJEMAH } from "../_shared/modelGemini.ts";

const GEMINI_URL = (m) => `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const MAKS_KARAKTER = 40000;
const MAKS_PER_PANGGILAN = 12000;

async function panggil(prompt, model, batasMs, pakaiThinking = true) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY belum di-set.");
  const pembatal = new AbortController();
  const pewaktu = setTimeout(() => pembatal.abort(), batasMs);
  try {
    const res = await fetch(GEMINI_URL(model), {
      method: "POST",
      signal: pembatal.signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 16000,
          temperature: 0.2,
          ...(pakaiThinking ? { thinkingConfig: { thinkingLevel: "low" } } : {}),
        },
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      if (res.status === 400 && pakaiThinking && /thinking/i.test(t)) return panggil(prompt, model, batasMs, false);
      throw new Error(`Gemini ${res.status}: ${t.slice(0, 160)}`);
    }
    const data = await res.json();
    const teks = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
    const a = teks.indexOf("{");
    const b = teks.lastIndexOf("}");
    return JSON.parse(teks.slice(a, b + 1));
  } finally {
    clearTimeout(pewaktu);
  }
}

const PROMPT = (isi) => `Translate every value in this JSON object from Indonesian into natural, professional
English suitable for a job-application portfolio read by recruiters and international clients.

Rules:
- Return ONLY a JSON object with EXACTLY the same keys. Translate the values, never the keys.
- Keep line breaks, numbering ("1."), bullet characters, and "|" table separators as they are.
- Keep numbers, currency amounts (e.g. "Rp1.500.000"), dates, URLs, emails, product and company
  names, and code unchanged. Indonesian proper nouns (city, brand, institution) stay as they are.
- Keep the first-person voice ("I ...") when the source uses "saya".
- If a value is already in English, return it unchanged.
- Do not add explanations, do not shorten, do not use the em dash (—).

${JSON.stringify(isi)}`;

/** Pecah peta teks menjadi beberapa kelompok supaya jawaban tidak terpotong. */
function kelompokkan(teks) {
  const grup = [];
  let kini = {};
  let panjang = 0;
  for (const [k, v] of Object.entries(teks)) {
    if (panjang + v.length > MAKS_PER_PANGGILAN && Object.keys(kini).length) {
      grup.push(kini);
      kini = {};
      panjang = 0;
    }
    kini[k] = v;
    panjang += v.length;
  }
  if (Object.keys(kini).length) grup.push(kini);
  return grup;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const {
      data: { user },
    } = await supa.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    // Portofolio hanya untuk paket Pro (aktif) dan Max (serius)
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: langganan } = await admin
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "aktif")
      .in("paket", ["aktif", "serius"])
      .gt("berakhir_at", new Date().toISOString())
      .limit(1);
    if (!langganan?.length) return json({ error: "Portofolio versi English tersedia untuk paket Pro dan Max." }, 402);

    const body = await req.json();
    const masuk = body?.teks && typeof body.teks === "object" ? body.teks : {};
    const teks = Object.fromEntries(
      Object.entries(masuk)
        .filter(([k, v]) => typeof k === "string" && k.length <= 80 && typeof v === "string" && v.trim())
        .map(([k, v]) => [k, v.slice(0, 8000)]),
    );
    const total = Object.values(teks).reduce((a, v) => a + v.length, 0);
    if (!total) return json({ teks: {} });
    if (total > MAKS_KARAKTER) return json({ error: "Isi portofolio terlalu panjang untuk diterjemahkan sekaligus." }, 413);

    const hasil = {};
    for (const grup of kelompokkan(teks)) {
      let jadi = null;
      for (const model of MODEL_TERJEMAH) {
        try {
          jadi = await panggil(PROMPT(grup), model, 45000);
          break;
        } catch (e) {
          console.warn(`terjemah gagal (${model}): ${e.message}`);
        }
      }
      if (!jadi) throw new Error("Penerjemahan gagal.");
      for (const k of Object.keys(grup)) {
        const v = jadi[k];
        hasil[k] = typeof v === "string" && v.trim() ? v.replace(/\s*—\s*/g, ", ") : grup[k];
      }
    }
    return json({ teks: hasil });
  } catch (e) {
    console.error("terjemah-portofolio:", e?.message);
    return json({ error: "Terjemahan sedang tidak bisa dibuat. Coba lagi sebentar." }, 503);
  }
});
