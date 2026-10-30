// @ts-nocheck
// Pengaman jumlah bullet draft CV.
//
// Model AI kadang tetap meringkas bullet walau sudah dilarang di prompt.
// Setelah draft jadi, jumlah bullet per posisi dibandingkan dengan CV asli
// (dihitung tanpa AI di _shared/petaBullet.js). Posisi yang bullet-nya
// berkurang ditulis ulang dalam SATU panggilan tambahan, dengan jumlah
// minimal yang dipaksa lewat responseSchema (minItems), sehingga model
// tidak bisa lagi memangkasnya.

import { petakanBullet, cariKekurangan } from "../_shared/petaBullet.js";
import { MODEL_TERJEMAH } from "../_shared/modelGemini.ts";

const GEMINI_URL = (m) => `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;

async function panggil(prompt, skema, model, batasMs, pakaiThinking = true) {
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
          responseSchema: skema,
          maxOutputTokens: 8000,
          temperature: 0.3,
          ...(pakaiThinking ? { thinkingConfig: { thinkingLevel: "low" } } : {}),
        },
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      if (res.status === 400 && pakaiThinking && /thinking/i.test(t)) return panggil(prompt, skema, model, batasMs, false);
      throw new Error(`Gemini ${res.status}: ${t.slice(0, 160)}`);
    }
    const data = await res.json();
    const teks = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
    return JSON.parse(teks);
  } finally {
    clearTimeout(pewaktu);
  }
}

const ATURAN = {
  id: `Bahasa Indonesia yang profesional dan lugas. Diawali kata kerja aktif yang
berbeda-beda (Menyusun, Merekonsiliasi, Mengelola, Memverifikasi, dst.). Nama alat,
sistem, dan istilah yang lazim berbahasa Inggris (SAP, accrual, accounts payable)
boleh tetap. JANGAN memakai tanda pisah panjang (—).`,
  en: `Professional English. Start each bullet with a different strong action verb.
Use PAST tense for a role that has ended and PRESENT tense for a current role
("Present"). NEVER use the em dash (—).`,
};

/**
 * Lengkapi draft yang bullet-nya berkurang. Mengembalikan { cv, cvEn } baru.
 * Kalau gagal atau waktunya tidak cukup, draft dikembalikan apa adanya.
 */
export async function lengkapiBullet({ cv, cvEn, input, batasMs }) {
  const blok = petakanBullet(input);
  if (!blok.length) return { cv, cvEn };

  const tugas = [
    ...cariKekurangan(cv, blok).map((k) => ({ ...k, bahasa: "id", draft: "cv" })),
    ...cariKekurangan(cvEn, blok).map((k) => ({ ...k, bahasa: "en", draft: "cvEn" })),
  ];
  if (!tugas.length || batasMs < 12000) return { cv, cvEn };

  const skema = { type: "OBJECT", properties: {}, required: [] };
  const daftar = tugas
    .map((k, i) => {
      const kunci = `k${i}`;
      const n = k.asli.length;
      skema.properties[kunci] = { type: "ARRAY", items: { type: "STRING" }, minItems: n, maxItems: n + 3 };
      skema.required.push(kunci);
      const akhir = (k.bahasa === "id" ? cv : cvEn)?.[k.bagian]?.[k.indeks]?.end || "";
      return `### ${kunci}
Bahasa: ${k.bahasa === "id" ? "Indonesia" : "English"}
Posisi: ${k.judul} (berakhir: ${akhir || "tidak disebut"})
Bullet ASLI (${n} buah, semuanya WAJIB tercakup, masing-masing jadi bullet sendiri):
${k.asli.map((b, j) => `${j + 1}. ${b}`).join("\n")}
Draft sebelumnya (contoh gaya, tetapi terlalu sedikit):
${k.sekarang.map((b) => `- ${b}`).join("\n") || "-"}`;
    })
    .join("\n\n");

  const prompt = `Kamu menulis ulang bullet pengalaman di CV. Untuk setiap bagian di bawah,
kembalikan array bullet yang jumlahnya MINIMAL sama dengan jumlah bullet asli:
setiap bullet asli ditulis ulang menjadi satu bullet yang lebih kuat, urutkan dari yang
paling berdampak. Boleh menambah paling banyak 3 bullet bila jelas didukung isi CV di
bawah (misalnya skill atau sistem yang dipakai), tanpa mengarang angka, alat, atau
tanggung jawab baru. Setiap bullet maksimal 25 kata, tanpa titik di akhir, angka hanya
bila ada di input.

Aturan bahasa Indonesia: ${ATURAN.id}
Aturan bahasa Inggris: ${ATURAN.en}

ISI CV LENGKAP (sumber fakta):
"""${String(input).slice(0, 7000)}"""

${daftar}`;

  let hasil = null;
  const mulai = Date.now();
  for (const model of MODEL_TERJEMAH) {
    const sisa = batasMs - (Date.now() - mulai);
    if (sisa < 8000) break;
    try {
      hasil = await panggil(prompt, skema, model, sisa - 1000);
      break;
    } catch (e) {
      console.warn(`lengkapiBullet gagal (${model}): ${e.message}`);
    }
  }
  if (!hasil) return { cv, cvEn };

  const salin = (d) => (d ? JSON.parse(JSON.stringify(d)) : d);
  const out = { cv: salin(cv), cvEn: salin(cvEn) };
  let diperbaiki = 0;
  tugas.forEach((k, i) => {
    const baru = (Array.isArray(hasil[`k${i}`]) ? hasil[`k${i}`] : [])
      .map((b) => (typeof b === "string" ? b.replace(/\s*—\s*/g, ", ").trim() : ""))
      .filter(Boolean);
    if (baru.length < k.asli.length) return;
    const target = out[k.draft]?.[k.bagian]?.[k.indeks];
    if (target) {
      target.desc = baru;
      diperbaiki++;
    }
  });
  console.log(`lengkapiBullet: ${diperbaiki}/${tugas.length} posisi dilengkapi dalam ${Date.now() - mulai} ms`);
  return out;
}

/** Ringkasan jumlah bullet per posisi untuk disisipkan di prompt utama. */
export function petaUntukPrompt(input) {
  const blok = petakanBullet(input);
  if (!blok.length) return "";
  return blok.map((b) => `- ${b.kepala.slice(0, 120)}: ${b.bullets.length} bullet`).join("\n");
}
