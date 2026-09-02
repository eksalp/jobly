// @ts-nocheck
// Lapisan penyedia AI.
//
// Gemini dipakai sebagai utama karena responseSchema menjamin bentuk output.
// Claude disiapkan sebagai cadangan: kalau Gemini gagal (rate limit, error,
// atau output tidak valid), permintaan diulang ke Claude secara otomatis.

import { buatSkema, buatSkemaDraft } from "./skema.ts";

const GEMINI_URL = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

const MODEL_GEMINI = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.7-flash";
// Model kembar: harga dan kemampuannya identik dengan 3.7-flash, tapi
// beban trafiknya berbeda. Dipakai saat model utama sedang penuh.
const MODEL_GEMINI_CADANGAN =
  Deno.env.get("GEMINI_MODEL_FALLBACK") ?? "gemini-3.6-flash";
const MODEL_ANTHROPIC = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-5";

/* ---------- Util ---------- */

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));

// Status yang layak dicoba ulang: server penuh, rate limit, atau gangguan sesaat.
// Status lain (400 skema salah, 401 key salah) tidak ada gunanya diulang.
const bolehUlang = (status) =>
  status === 429 || status === 500 || status === 503 || status === 529;

/* ---------- Gemini ---------- */

async function panggilGemini(
  prompt,
  maksToken,
  bahasa,
  hanyaDraft,
  model = MODEL_GEMINI,
) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY belum di-set.");

  const res = await fetch(GEMINI_URL(model), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        // Dua baris inilah yang menjamin JSON valid sesuai struktur.
        responseMimeType: "application/json",
        responseSchema: hanyaDraft ? buatSkemaDraft(bahasa) : buatSkema(bahasa),
        maxOutputTokens: maksToken,
        temperature: 0.4,
      },
    }),
  });

  if (!res.ok) {
    const teks = await res.text();
    const err = new Error(`Gemini error ${res.status}: ${teks.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const kandidat = data?.candidates?.[0];

  if (!kandidat) {
    const blokir = data?.promptFeedback?.blockReason;
    throw new Error(
      blokir
        ? `Gemini memblokir permintaan: ${blokir}`
        : "Gemini tidak mengembalikan kandidat.",
    );
  }
  if (kandidat.finishReason === "MAX_TOKENS") {
    throw new Error("Output Gemini terpotong karena mencapai batas token.");
  }

  const teks = (kandidat.content?.parts || [])
    .map((p) => p.text || "")
    .join("");
  if (!teks.trim()) throw new Error("Output Gemini kosong.");

  // Dengan responseSchema, ini seharusnya selalu berhasil.
  // try/catch tetap dipasang untuk berjaga-jaga.
  try {
    return JSON.parse(teks);
  } catch (e) {
    throw new Error(`JSON Gemini tidak valid: ${e.message}`);
  }
}

/**
 * Gemini dengan percobaan ulang bertahap.
 *
 * Model kelas Flash cukup sering mengembalikan 503 saat trafik Google sedang
 * tinggi, dan itu hampir selalu sembuh dalam hitungan detik. Tanpa retry,
 * user yang sudah membayar melihat kegagalan padahal masalahnya sesaat.
 *
 * Urutan percobaan: 3.7 → 3.7 → 3.6 (model kembar, beban trafik berbeda).
 */
async function panggilGeminiTangguh(prompt, maksToken, bahasa, hanyaDraft) {
  const percobaan = [
    { model: MODEL_GEMINI, jeda: 0 },
    { model: MODEL_GEMINI, jeda: 1200 },
    { model: MODEL_GEMINI_CADANGAN, jeda: 2500 },
  ];

  let terakhir;

  for (let i = 0; i < percobaan.length; i++) {
    const { model, jeda } = percobaan[i];
    if (jeda) await tidur(jeda);

    try {
      const hasil = await panggilGemini(
        prompt,
        maksToken,
        bahasa,
        hanyaDraft,
        model,
      );
      if (i > 0) console.log(`Berhasil pada percobaan ke-${i + 1} (${model})`);
      return hasil;
    } catch (e) {
      terakhir = e;
      const status = e?.status;

      // Error permanen: percuma diulang
      if (status && !bolehUlang(status)) throw e;

      console.warn(
        `Percobaan ${i + 1}/${percobaan.length} gagal (${model}): ${e.message}`,
      );
    }
  }

  throw terakhir;
}

/* ---------- Claude (cadangan) ---------- */

// Claude tidak punya padanan responseSchema, jadi JSON-nya diekstrak manual
// dan strukturnya diminta lewat prompt.
function ekstrakJson(mentah) {
  let t = (mentah || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const mulai = t.indexOf("{");
  const akhir = t.lastIndexOf("}");
  if (mulai === -1 || akhir <= mulai) throw new Error("Output bukan JSON.");
  return JSON.parse(t.slice(mulai, akhir + 1));
}

async function panggilClaude(prompt, maksToken, bahasa, hanyaDraft) {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY belum di-set.");

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL_ANTHROPIC,
      max_tokens: maksToken,
      system:
        "Kamu hanya membalas dengan satu objek JSON valid. Tanpa penjelasan, tanpa markdown fence. " +
        "Ikuti struktur yang diminta persis, termasuk semua field.",
      messages: [
        { role: "user", content: prompt },
        // Prefill: memaksa Claude langsung masuk ke JSON
        { role: "assistant", content: "{" },
      ],
    }),
  });

  if (!res.ok) {
    const teks = await res.text();
    const err = new Error(
      `Anthropic error ${res.status}: ${teks.slice(0, 200)}`,
    );
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  if (data.stop_reason === "max_tokens") {
    throw new Error("Output Claude terpotong karena mencapai batas token.");
  }

  const teks = (data.content || []).map((c) => c.text || "").join("");
  // Prefill "{" tidak ikut di respons, jadi ditambahkan kembali
  return ekstrakJson("{" + teks);
}

/* ---------- Pemilih penyedia ---------- */

export async function jalankanAnalisis(
  prompt,
  maksToken = 8000,
  bahasa = "id",
  hanyaDraft = false,
) {
  const utama = (Deno.env.get("AI_PROVIDER") ?? "gemini").toLowerCase();
  const cadanganAktif = Deno.env.get("AI_FALLBACK") !== "false";

  const urutan =
    utama === "anthropic"
      ? [
          ["anthropic", panggilClaude],
          ["gemini", panggilGeminiTangguh],
        ]
      : [
          ["gemini", panggilGeminiTangguh],
          ["anthropic", panggilClaude],
        ];

  const daftar = cadanganAktif ? urutan : [urutan[0]];
  const galat = [];

  for (const [nama, fn] of daftar) {
    try {
      const hasil = await fn(prompt, maksToken, bahasa, hanyaDraft);
      console.log(`Analisis berhasil lewat ${nama}`);
      return { hasil, penyedia: nama };
    } catch (e) {
      const pesan = e instanceof Error ? e.message : String(e);
      console.warn(`Penyedia ${nama} gagal: ${pesan}`);
      galat.push(`${nama}: ${pesan}`);
    }
  }

  // Bedakan "server AI sedang penuh" dari kegagalan lain — yang pertama
  // hanya perlu ditunggu, dan pesannya harus mencerminkan itu.
  const semuaSibuk = galat.every((g) =>
    /503|429|UNAVAILABLE|high demand|overload/i.test(g),
  );
  const pesan = semuaSibuk
    ? "Server AI sedang penuh. Tunggu sebentar lalu ulangi — pembayaranmu tetap tersimpan."
    : `Analisis gagal diproses. ${galat.join(" | ")}`;

  const err = new Error(pesan);
  err.sibuk = semuaSibuk;
  throw err;
}
