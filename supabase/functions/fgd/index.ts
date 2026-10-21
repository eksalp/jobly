// @ts-nocheck
// Edge Function: fgd — simulasi Focus Group Discussion (paket Max).
//
// Satu meja diskusi: pengguna + 3 peserta AI (Dimas, Ayu, Fajar) +
// 1 asesor (Bu Sari). Alurnya bergiliran:
//
//   mulai    potong 1 kuota FGD, buat sesi, kembalikan pembukaan asesor
//   giliran  terima rekaman suara pengguna (WAV, opsional), transkripsikan,
//            lalu tentukan 1–3 tanggapan peserta AI berikutnya
//   suara    ubah satu kalimat peserta menjadi suara (Gemini TTS)
//   akhiri   nilai seluruh diskusi, atau kembalikan kuota bila terlalu singkat
//
// Transkrip disimpan di tabel fgd_sesi (server), sehingga penilaian selalu
// berdasarkan percakapan yang benar-benar terjadi.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MODEL_FGD, MODEL_TTS, kuotaHabis } from "../_shared/modelGemini.ts";
import { TOPIK_FGD, cariTopik, PERAN_FGD, pembukaModerator } from "../_shared/fgdTopik.ts";

const URL_GEMINI = (m) => `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;
const DURASI_MENIT = 20;
const MAKS_SUARA = 160; // batas panggilan TTS per sesi
const MIN_GILIRAN_DINILAI = 2;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const str = (v) => (typeof v === "string" ? v : "");
const num = (v, fb = 0) => (typeof v === "number" && isFinite(v) ? v : fb);

function ekstrakJson(mentah) {
  const t = String(mentah || "").replace(/```json/gi, "").replace(/```/g, "").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a === -1 || b <= a) throw new Error("Output bukan JSON.");
  return JSON.parse(t.slice(a, b + 1));
}

async function panggil(model, body, batasMs = 45000) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY belum di-set.");
  const pembatal = new AbortController();
  const jeda = setTimeout(() => pembatal.abort(), batasMs);
  try {
    const res = await fetch(`${URL_GEMINI(model)}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: pembatal.signal,
    });
    const teks = await res.text();
    if (!res.ok) {
      const e = new Error(`${model} ${res.status}: ${teks.slice(0, 300)}`);
      e.status = res.status;
      throw e;
    }
    return JSON.parse(teks);
  } finally {
    clearTimeout(jeda);
  }
}

/** Panggil model teks berurutan sampai ada yang berhasil. */
async function panggilTeks(parts, maksToken = 1500) {
  let terakhir;
  for (const model of MODEL_FGD) {
    try {
      const d = await panggil(model, {
        contents: [{ role: "user", parts }],
        generationConfig: { temperature: 0.8, maxOutputTokens: Math.max(maksToken, 2000), responseMimeType: "application/json" },
      });
      const teks = (d?.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
      return ekstrakJson(teks);
    } catch (e) {
      terakhir = e;
      if (e?.status === 401 || e?.status === 403) throw e;
      console.warn("Model FGD gagal:", model, e?.message);
    }
  }
  throw terakhir;
}

/** Suara satu kalimat. Mengembalikan base64 PCM 16-bit 24 kHz mono. */
async function suara(teks, voice) {
  let terakhir;
  for (const model of MODEL_TTS) {
    try {
      const d = await panggil(
        model,
        {
          contents: [{ role: "user", parts: [{ text: teks }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
          },
        },
        30000,
      );
      const bagian = (d?.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData?.data);
      if (bagian) return { audio: bagian.inlineData.data, mime: bagian.inlineData.mimeType || "audio/L16;rate=24000" };
      throw new Error("TTS tidak mengembalikan audio.");
    } catch (e) {
      terakhir = e;
      if (e?.status === 401 || e?.status === 403) throw e;
      console.warn("TTS gagal:", model, e?.message);
    }
  }
  throw terakhir;
}

function teksTranskrip(transkrip, bahasa) {
  return transkrip
    .slice(-46)
    .map((b) => `${b.siapa === "kamu" ? (bahasa === "en" ? "CANDIDATE (user)" : "KANDIDAT (pengguna)") : PERAN_FGD[b.siapa]?.nama || b.siapa}: ${b.teks}`)
    .join("\n");
}

function promptGiliran({ topik, bahasa, transkrip, menit, adaAudio }) {
  const en = bahasa === "en";
  const sisa = Math.max(0, DURASI_MENIT - menit);
  const fase =
    sisa <= 1.5
      ? "PENUTUP: Bu Sari (moderator) menyampaikan waktu habis, berterima kasih, dan menutup diskusi. Jangan ada peserta lain bicara setelahnya. Isi \"selesai\": true."
      : sisa <= 4
        ? "MENJELANG AKHIR: waktu tinggal sekitar " + Math.ceil(sisa) + " menit. Bu Sari boleh mengingatkan waktu satu kali (jika belum). Peserta mulai merangkum dan mengarah ke kesepakatan."
        : menit < 3
          ? "AWAL: peserta mulai menyampaikan pandangan awal. Belum perlu kesepakatan."
          : "INTI: peserta beradu argumen, menanggapi satu sama lain, dan mulai mencari titik temu.";

  return `Kamu mengatur simulasi FGD (diskusi kelompok tanpa pemimpin) untuk latihan seleksi kerja.
Bahasa diskusi: ${en ? "INGGRIS (semua ucapan dalam bahasa Inggris profesional yang natural)" : "INDONESIA (lisan, sopan, natural seperti kandidat fresh graduate di Indonesia)"}.

TOPIK (${topik.jenis === "kasus" ? "studi kasus" : "isu"}): ${topik.materi[en ? "en" : "id"]}
TARGET KELOMPOK: ${topik.tujuan[en ? "en" : "id"]}

PESERTA AI (kamu memerankan mereka):
- dimas: Dimas, ${PERAN_FGD.dimas.gaya[en ? "en" : "id"]}
- ayu: Ayu, ${PERAN_FGD.ayu.gaya[en ? "en" : "id"]}
- fajar: Fajar, ${PERAN_FGD.fajar.gaya[en ? "en" : "id"]}
- moderator: Bu Sari, asesor. HANYA bicara untuk mengingatkan waktu atau menutup. Tidak ikut berpendapat.
Pengguna adalah peserta keempat ("KANDIDAT"). Jangan pernah membuat ucapan atas nama pengguna.

WAKTU: sudah berjalan ${menit.toFixed(1)} menit dari ${DURASI_MENIT} menit. Fase: ${fase}

TRANSKRIP SEJAUH INI:
${teksTranskrip(transkrip, bahasa) || "(belum ada)"}

${adaAudio
  ? `TUGAS 1: Audio terlampir adalah ucapan KANDIDAT barusan. Tuliskan transkripnya apa adanya di "transkrip_user" (bahasa sesuai ucapan, tanpa menambah isi). Jika audio kosong, hanya bunyi latar, atau tidak jelas, isi "".`
  : `TUGAS 1: Kandidat memilih diam atau memberi kesempatan peserta lain. Isi "transkrip_user" dengan "".`}
TUGAS 2: Tentukan 1 sampai 3 ucapan berikutnya dari peserta AI, sebagai kelanjutan yang wajar.

ATURAN UCAPAN:
- Setiap ucapan 1 sampai 3 kalimat lisan, maksimal sekitar 45 kata. Ini percakapan suara, bukan esai.
- Tanggapi isi ucapan terakhir secara spesifik (setuju, membantah, menambah data, bertanya). Jangan mengulang poin yang sudah dibahas.
- Jaga karakter masing-masing. Dimas cenderung mendominasi; Ayu menuntut data; Fajar ragu dan mudah setuju.
- Beri ruang untuk kandidat: sering-seringlah ucapan terakhir berupa pertanyaan atau ajakan kepada kandidat (sebut "kamu" atau "${en ? "you" : "kamu"}"), terutama bila kandidat belum bicara lama. Jika kandidat baru saja bicara, minimal satu peserta menanggapi isi ucapannya.
- Jika kandidat mengajukan usulan bagus, peserta boleh mendukung; jika lemah, boleh dibantah dengan sopan. Jangan selalu setuju.
- Arahkan diskusi pelan-pelan ke target kelompok sesuai fase waktu.
- Jangan pakai tanda pisah panjang (—). Jangan ada narasi atau aksi dalam kurung.

Balas HANYA JSON:
{"transkrip_user": "", "giliran": [{"siapa": "dimas|ayu|fajar|moderator", "teks": ""}], "selesai": false}`;
}

function promptNilai({ topik, bahasa, transkrip, menit, bahasaTampilan }) {
  const en = bahasa === "en";
  return `Kamu asesor HR berpengalaman yang menilai kandidat dalam Leaderless Group Discussion (FGD) seleksi kerja.
Topik: ${topik.materi[en ? "en" : "id"]}
Target kelompok: ${topik.tujuan[en ? "en" : "id"]}
Durasi: ${menit} menit. Peserta lain (Dimas, Ayu, Fajar) adalah peserta simulasi; nilai HANYA "KANDIDAT".

TRANSKRIP:
${teksTranskrip(transkrip, bahasa)}

Nilai kandidat secara jujur dan spesifik berdasarkan ucapannya. Balas HANYA JSON:
{
  "skor": 0,
  "aspek": {
    "inisiatif": 0,
    "kualitas_argumen": 0,
    "mendengarkan": 0,
    "kerja_sama": 0,
    "kepemimpinan": 0,
    "komunikasi": 0
  },
  "kekuatan": ["", ""],
  "perbaikan": ["", ""],
  "momen_kunci": "",
  "catatan": ""
}
ATURAN:
- Semua angka 0 sampai 100. "skor" = penilaian menyeluruh, bukan rata-rata mentah. Kandidat yang hampir tidak bicara harus mendapat skor rendah.
- "inisiatif": berani membuka/mengusulkan. "kualitas_argumen": logis, berdasar data/contoh. "mendengarkan": menanggapi ucapan orang lain. "kerja_sama": membangun di atas ide orang, mengajak yang pendiam (Fajar). "kepemimpinan": mengarahkan ke kesimpulan, merangkum, mengelola peserta dominan (Dimas). "komunikasi": jelas, ringkas, sopan.
- "kekuatan" dan "perbaikan": maksimal 3 poin, merujuk ucapan kandidat yang sebenarnya.
- "momen_kunci": satu kalimat kandidat yang paling berpengaruh (kutip), atau kosong.
- "catatan": 2 sampai 3 kalimat penutup yang membangun.
${bahasaTampilan === "en" ? "Write kekuatan, perbaikan, catatan in natural English." : "Tulis dalam Bahasa Indonesia yang lugas."} Jangan pakai tanda pisah panjang (—).`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const supabaseUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { data: { user }, error: authErr } = await supabaseUser.auth.getUser();
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const body = await req.json();
    const aksi = str(body.aksi);

    /* ------------------------------------------------------- mulai */
    if (aksi === "mulai") {
      const topik = cariTopik(str(body.topik)) || TOPIK_FGD[Math.floor(Math.random() * TOPIK_FGD.length)];
      const bahasa = str(body.bahasa) === "en" ? "en" : "id";

      // Sesi yang masih berjalan dilanjutkan, tidak memotong kuota lagi
      const { data: lama } = await admin
        .from("fgd_sesi")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "berjalan")
        .gt("mulai_at", new Date(Date.now() - (DURASI_MENIT + 5) * 60000).toISOString())
        .order("mulai_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (lama) return json({ sesi: lama, lanjut: true, peran: PERAN_FGD });

      const { data: kuota, error: kErr } = await admin.rpc("pakai_kuota_fgd", { p_user: user.id });
      if (kErr) throw new Error("Gagal memeriksa kuota: " + kErr.message);
      const k = Array.isArray(kuota) ? kuota[0] : kuota;
      if (!k?.berhasil) return json({ error: k?.alasan || "Kuota FGD habis.", butuhLangganan: true }, 402);

      const pembuka = pembukaModerator(topik, bahasa);
      const { data: sesi, error } = await admin
        .from("fgd_sesi")
        .insert({ user_id: user.id, langganan_id: k.langganan_id, topik: { id: topik.id, judul: topik.judul, jenis: topik.jenis }, bahasa, transkrip: pembuka })
        .select()
        .single();
      if (error) throw new Error("Gagal membuat sesi: " + error.message);
      return json({ sesi, peran: PERAN_FGD, sisa: k.sisa });
    }

    const sesiId = str(body.sesiId);
    const { data: sesi } = await admin.from("fgd_sesi").select("*").eq("id", sesiId).eq("user_id", user.id).maybeSingle();
    if (!sesi) return json({ error: "Sesi FGD tidak ditemukan." }, 404);
    const topik = cariTopik(sesi.topik?.id) || TOPIK_FGD[0];
    const menit = (Date.now() - new Date(sesi.mulai_at).getTime()) / 60000;

    /* ------------------------------------------------------- suara */
    if (aksi === "suara") {
      if (sesi.status !== "berjalan" || menit > DURASI_MENIT + 5) return json({ error: "Sesi sudah berakhir." }, 409);
      if (sesi.suara_dipakai >= MAKS_SUARA) return json({ error: "Batas suara sesi tercapai." }, 429);
      const siapa = str(body.siapa);
      const peran = PERAN_FGD[siapa];
      const teks = str(body.teks).slice(0, 400);
      // Hanya kalimat yang memang ada di transkrip sesi ini yang boleh disuarakan
      const ada = (sesi.transkrip || []).some((b) => b.siapa === siapa && b.teks === teks);
      if (!peran || !teks || !ada) return json({ error: "Kalimat tidak dikenal." }, 400);
      await admin.from("fgd_sesi").update({ suara_dipakai: sesi.suara_dipakai + 1 }).eq("id", sesi.id);
      const s = await suara(teks, peran.suara);
      return json(s);
    }

    /* ----------------------------------------------------- giliran */
    if (aksi === "giliran") {
      if (sesi.status !== "berjalan") return json({ error: "Sesi sudah berakhir." }, 409);
      const audio = str(body.audio);
      if (audio.length > 6_000_000) return json({ error: "Rekaman terlalu panjang. Bicara maksimal sekitar 90 detik per giliran." }, 413);

      const parts = [{ text: promptGiliran({ topik, bahasa: sesi.bahasa, transkrip: sesi.transkrip || [], menit, adaAudio: Boolean(audio) }) }];
      if (audio) parts.push({ inlineData: { mimeType: "audio/wav", data: audio } });

      const h = await panggilTeks(parts, 1200);
      const ucapanUser = str(h.transkrip_user).trim().slice(0, 2000);
      const giliran = (Array.isArray(h.giliran) ? h.giliran : [])
        .filter((g) => PERAN_FGD[g?.siapa] && str(g?.teks).trim())
        .slice(0, 3)
        .map((g) => ({ siapa: g.siapa, teks: str(g.teks).trim().slice(0, 400) }));

      const baru = [...(sesi.transkrip || [])];
      if (ucapanUser) baru.push({ siapa: "kamu", teks: ucapanUser, menit: Math.round(menit * 10) / 10 });
      giliran.forEach((g) => baru.push({ ...g, menit: Math.round(menit * 10) / 10 }));
      await admin.from("fgd_sesi").update({ transkrip: baru.slice(-200) }).eq("id", sesi.id);

      return json({
        ucapanUser,
        giliran,
        selesai: Boolean(h.selesai) || menit >= DURASI_MENIT + 1,
        menit,
      });
    }

    /* ------------------------------------------------------ akhiri */
    if (aksi === "akhiri") {
      if (sesi.status === "selesai") return json({ hasil: sesi.hasil, skor: sesi.skor });
      if (sesi.status !== "berjalan") return json({ error: "Sesi sudah dibatalkan." }, 409);
      const ucapan = (sesi.transkrip || []).filter((b) => b.siapa === "kamu");

      if (ucapan.length < MIN_GILIRAN_DINILAI) {
        // Terlalu singkat: kuota dikembalikan
        await admin.rpc("kembalikan_kuota_fgd", { p_sesi: sesi.id });
        return json({ dikembalikan: true });
      }

      const h = await panggilTeks(
        [{ text: promptNilai({ topik, bahasa: sesi.bahasa, transkrip: sesi.transkrip, menit: Math.max(1, Math.round(Math.min(menit, DURASI_MENIT))), bahasaTampilan: str(body.bahasaTampilan) === "en" ? "en" : "id" }) }],
        3000,
      );
      const angka = (v) => Math.max(0, Math.min(100, Math.round(num(Number(v), 50))));
      const daftar = (v) => (Array.isArray(v) ? v : []).filter((x) => typeof x === "string" && x.trim()).slice(0, 3);
      const aspek = h.aspek || {};
      const hasil = {
        skor: angka(h.skor),
        aspek: {
          inisiatif: angka(aspek.inisiatif),
          kualitas_argumen: angka(aspek.kualitas_argumen),
          mendengarkan: angka(aspek.mendengarkan),
          kerja_sama: angka(aspek.kerja_sama),
          kepemimpinan: angka(aspek.kepemimpinan),
          komunikasi: angka(aspek.komunikasi),
        },
        kekuatan: daftar(h.kekuatan),
        perbaikan: daftar(h.perbaikan),
        momen_kunci: str(h.momen_kunci).slice(0, 400),
        catatan: str(h.catatan).slice(0, 1200),
        jumlah_bicara: ucapan.length,
      };
      await admin.from("fgd_sesi").update({ status: "selesai", selesai_at: new Date().toISOString(), skor: hasil.skor, hasil }).eq("id", sesi.id);
      return json({ hasil, skor: hasil.skor });
    }

    return json({ error: "Aksi tidak dikenal." }, 400);
  } catch (e) {
    console.error("fgd:", e?.message);
    const pesan = kuotaHabis(e?.message)
      ? "Server AI sedang penuh. Coba lagi sebentar lagi."
      : e?.name === "AbortError"
        ? "AI terlalu lama menjawab. Coba lagi."
        : e?.message || "Terjadi kesalahan.";
    return json({ error: pesan }, 500);
  }
});
