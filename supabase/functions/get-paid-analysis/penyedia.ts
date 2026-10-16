// @ts-nocheck
// Lapisan penyedia AI.
//
// Gemini dipakai sebagai utama karena responseSchema menjamin bentuk output.
// Claude disiapkan sebagai cadangan: kalau Gemini gagal (rate limit, error,
// atau output tidak valid), permintaan diulang ke Claude secara otomatis.

import { buatSkema, buatSkemaDraft } from "./skema.ts";
import { MODEL_ANALISIS, MODEL_TERJEMAH, kuotaHabis } from "../_shared/modelGemini.ts";

const GEMINI_URL = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

const MODEL_ANTHROPIC = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-5";

/* ---------- Util ---------- */

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));

// Status yang layak dicoba ulang: server penuh, rate limit, atau gangguan sesaat.
// Status lain (400 skema salah, 401 key salah) tidak ada gunanya diulang.
const bolehUlang = (status) =>
  status === 429 || status === 500 || status === 503 || status === 529;

// Status yang berarti kunci API bermasalah: percuma mencoba model lain.
const galatKunci = (status) => status === 401 || status === 403;

// Edge Function diputus Supabase setelah sekitar 150 detik. Setiap panggilan
// dibatasi waktunya, dan seluruh percobaan dijaga di bawah anggaran ini agar
// user menerima pesan galat yang jelas, bukan koneksi yang diputus.
const BATAS_PANGGILAN_MS = 60000;
const ANGGARAN_MS = 115000;
const mulaiProses = { waktu: Date.now() };
const sisaAnggaran = () => ANGGARAN_MS - (Date.now() - mulaiProses.waktu);
const batasPanggilan = () =>
  Math.max(15000, Math.min(BATAS_PANGGILAN_MS, sisaAnggaran() - 5000));

/** fetch dengan batas waktu; galat waktu habis diberi status 503 agar dicoba ulang. */
async function fetchBerbatas(url, opsi, batasMs) {
  const pembatal = new AbortController();
  const pewaktu = setTimeout(() => pembatal.abort(), batasMs);
  try {
    return await fetch(url, { ...opsi, signal: pembatal.signal });
  } catch (e) {
    if (e?.name === "AbortError") {
      const err = new Error(`AI tidak merespons dalam ${Math.round(batasMs / 1000)} detik.`);
      err.status = 503;
      throw err;
    }
    throw e;
  } finally {
    clearTimeout(pewaktu);
  }
}

/* ---------- Gemini ---------- */

async function panggilGemini(
  prompt,
  maksToken,
  bahasa,
  hanyaDraft,
  model = MODEL_ANALISIS[0],
) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY belum di-set.");

  const batas = batasPanggilan();
  const kirim = (denganThinking) =>
    fetchBerbatas(GEMINI_URL(model), {
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
          // Token "berpikir" Gemini 3 ikut dihitung dalam batas ini, jadi
          // batasnya diberi ruang lebih agar JSON tidak terpotong. Yang
          // ditagih hanya token yang benar-benar dipakai.
          maxOutputTokens: Math.max(maksToken, 12000),
          temperature: 0.4,
          // Token "berpikir" ditagih sebagai output. Tugas ini terstruktur,
          // jadi level rendah sudah cukup dan memangkas biaya per analisis.
          ...(denganThinking ? { thinkingConfig: { thinkingLevel: "low" } } : {}),
        },
      }),
    }, batas);

  let res = await kirim(true);
  // Model yang tidak mengenal thinkingLevel menolak dengan 400 —
  // ulangi sekali tanpa pengaturan itu.
  if (res.status === 400) {
    const t = await res.clone().text();
    if (/thinking/i.test(t)) res = await kirim(false);
  }

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
 * Urutan percobaan: setiap model di daftar fitur ini, lalu model pertama sekali lagi.
 * Draft bahasa Inggris (hanyaDraft) memakai daftar model murah.
 */
async function panggilGeminiTangguh(prompt, maksToken, bahasa, hanyaDraft) {
  const daftarModel = hanyaDraft ? MODEL_TERJEMAH : MODEL_ANALISIS;
  // Setiap model dicoba sekali; model terakhir yang sempat sibuk (503)
  // dicoba ulang sekali lagi di akhir kalau waktunya masih cukup.
  const percobaan = [
    ...daftarModel.map((model, i) => ({ model, jeda: i === 0 ? 0 : 800 })),
    { model: daftarModel[0], jeda: 2000 },
  ];

  let terakhir;

  for (let i = 0; i < percobaan.length; i++) {
    const { model, jeda } = percobaan[i];
    // Percobaan berikutnya dilewati kalau waktunya tidak lagi cukup.
    if (i > 0 && sisaAnggaran() < 25000) break;
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

      // Kunci API salah: percuma diulang ke model mana pun.
      if (galatKunci(status)) throw e;
      // 400/404 biasanya berarti model ini tidak mengenali permintaannya
      // (atau modelnya tidak tersedia untuk akun ini). Model yang sama
      // tidak perlu diulang; langsung lompat ke model cadangan.
      if (status && !bolehUlang(status)) {
        const idxCadangan = percobaan.findIndex((p, j) => j > i && p.model !== model);
        if (idxCadangan === -1) break;
        i = idxCadangan - 1;
      }

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

  if (sisaAnggaran() < 20000) throw new Error("Waktu proses habis sebelum cadangan dicoba.");
  const res = await fetchBerbatas(ANTHROPIC_URL, {
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
      // Tanpa prefill: model Claude terbaru menolak pesan assistant di
      // akhir percakapan. JSON diambil dari teks dengan ekstrakJson.
      messages: [{ role: "user", content: prompt }],
    }),
  }, batasPanggilan());

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
  return ekstrakJson(teks);
}

/* ---------- Pemilih penyedia ---------- */

export async function jalankanAnalisis(
  prompt,
  maksToken = 8000,
  bahasa = "id",
  hanyaDraft = false,
) {
  mulaiProses.waktu = Date.now();
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
    /503|429|UNAVAILABLE|high demand|overload|RESOURCE_EXHAUSTED/i.test(g),
  );
  const pesan = semuaSibuk
    ? galat.some(kuotaHabis)
      ? "Layanan AI sedang ramai dan batas pemakaian sementara tercapai. Kuota analisismu sudah dikembalikan. Coba lagi dalam beberapa menit."
      : "Server AI sedang penuh. Tunggu sebentar lalu coba lagi. Kuota analisismu sudah dikembalikan."
    : `Analisis gagal diproses. ${galat.join(" | ")}`;

  const err = new Error(pesan);
  err.sibuk = semuaSibuk;
  throw err;
}
