// @ts-nocheck
// Pengelolaan rekomendasi sertifikasi & pelatihan dari Telegram.
//
// Hanya akun Telegram yang ID-nya ada di secret TELEGRAM_ADMIN_IDS
// (dipisah koma) yang bisa menambah, mengubah, dan menghapus.
// Semua orang bisa memakai /sertifikasi untuk melihat rekomendasi.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MODEL_ADMIN } from "../_shared/modelGemini.ts";

const ADMIN = (Deno.env.get("TELEGRAM_ADMIN_IDS") ?? "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);

export const adalahAdmin = (userId) => ADMIN.includes(String(userId));

let klien = null;
const db = () => {
  if (!klien) klien = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  return klien;
};

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ------------------------------------------------------------ kamus */

export const BIDANG = {
  data: ["data", "data & ai", "ai", "analitik"],
  it: ["it", "software", "teknologi", "programming", "developer"],
  marketing: ["marketing", "pemasaran", "digital marketing"],
  sales: ["sales", "penjualan", "bd", "business development"],
  teknik: ["teknik", "engineering", "engineer", "k3", "hse"],
  keuangan: ["keuangan", "akuntansi", "finance", "pajak", "accounting"],
  desain: ["desain", "design", "kreatif", "ui/ux", "ux"],
  hr: ["hr", "sdm", "hrd", "human resource"],
  admin: ["admin", "administrasi", "sekretaris"],
  cs: ["cs", "customer service", "layanan pelanggan"],
  logistik: ["logistik", "operasional", "supply chain", "gudang"],
  kesehatan: ["kesehatan", "medis"],
  pendidikan: ["pendidikan", "guru", "edukasi"],
  produk: ["produk", "proyek", "project", "product"],
  hukum: ["hukum", "legal"],
  mt: ["mt", "fresh graduate", "management trainee", "umum"],
};

const bidangDari = (teks) => {
  const hasil = new Set();
  String(teks || "")
    .toLowerCase()
    .split(/[,;/]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .forEach((x) => {
      for (const [slug, alias] of Object.entries(BIDANG)) if (x === slug || alias.includes(x)) hasil.add(slug);
    });
  return [...hasil];
};

const JENJANG = { dasar: ["dasar", "pemula", "entry", "junior", "fresh graduate"], menengah: ["menengah", "mid", "intermediate"], lanjut: ["lanjut", "senior", "advanced", "spesialis", "ahli"] };
const JENIS = ["sertifikasi", "pelatihan", "bootcamp", "beasiswa", "kursus"];
const MODE = ["online", "offline", "hybrid"];

const BULAN = { jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12 };

/** "2026-11-20", "20/11/2026", "20-11-2026", "20 Nov 2026", "20 November" → "YYYY-MM-DD" */
export function bacaTanggal(teks) {
  const s = String(teks || "").trim().toLowerCase();
  if (!s || s === "-" || s === "kosong" || s === "hapus") return null;
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return iso(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (m) return iso(m[3].length === 2 ? 2000 + +m[3] : +m[3], +m[2], +m[1]);
  m = s.match(/^(\d{1,2})\s+([a-z]+)\.?\s*(\d{4})?$/);
  if (m && BULAN[m[2].slice(0, 3)]) {
    const kini = new Date();
    let th = m[3] ? +m[3] : kini.getFullYear();
    const bln = BULAN[m[2].slice(0, 3)];
    // Tanpa tahun dan bulannya sudah lewat jauh → tahun depan
    if (!m[3] && bln < kini.getMonth() - 1) th += 1;
    return iso(th, bln, +m[1]);
  }
  return undefined; // tidak terbaca
}

function iso(th, bln, tgl) {
  const d = new Date(Date.UTC(th, bln - 1, tgl));
  if (d.getUTCMonth() !== bln - 1) return undefined;
  return d.toISOString().slice(0, 10);
}

const KUNCI = {
  nama: "nama", judul: "nama", program: "nama",
  penyelenggara: "penyelenggara", oleh: "penyelenggara", lembaga: "penyelenggara",
  url: "url", link: "url", tautan: "url",
  jenis: "jenis", tipe: "jenis",
  bidang: "bidang", kategori: "bidang",
  posisi: "posisi", untuk: "posisi", cocok: "posisi",
  jenjang: "jenjang", level: "jenjang",
  biaya: "biaya", harga: "biaya",
  mode: "mode", metode: "mode",
  durasi: "durasi", lama: "durasi",
  batch: "batch", angkatan: "batch", gelombang: "batch",
  buka: "buka", dibuka: "buka",
  tutup: "tutup", deadline: "tutup", ditutup: "tutup", "batas daftar": "tutup",
  mulai: "mulai", "mulai kelas": "mulai",
  ringkas: "ringkas", deskripsi: "ringkas", keterangan: "ringkas",
  manfaat: "manfaat", alasan: "manfaat",
  aktif: "aktif",
};

/** Ubah blok "kunci: nilai" menjadi kolom tabel. Mengembalikan { data, galat[] }. */
export function bacaBlok(teks) {
  const data = {};
  const galat = [];
  String(teks || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((baris) => {
      const i = baris.indexOf(":");
      if (i < 1) return;
      const k = KUNCI[baris.slice(0, i).trim().toLowerCase()];
      const v = baris.slice(i + 1).trim();
      if (!k) return;
      tulisKolom(data, k, v, galat);
    });
  return { data, galat };
}

function tulisKolom(data, k, v, galat) {
  if (k === "bidang") {
    const b = bidangDari(v);
    const asing = v.split(/[,;/]+/).map((x) => x.trim()).filter((x) => x && !bidangDari(x).length);
    if (asing.length) galat.push(`bidang "${asing.join(", ")}" tidak dikenal (pakai: ${Object.keys(BIDANG).join(", ")})`);
    if (b.length) data.bidang = b;
  } else if (k === "posisi") {
    data.posisi = v.split(/[,;]+/).map((x) => x.trim().toLowerCase()).filter(Boolean).slice(0, 15);
  } else if (k === "jenjang") {
    const j = Object.entries(JENJANG).find(([, a]) => a.includes(v.toLowerCase()))?.[0];
    if (!j) galat.push(`jenjang "${v}" (pakai: dasar, menengah, lanjut)`);
    else data.jenjang = j;
  } else if (k === "jenis") {
    if (!JENIS.includes(v.toLowerCase())) galat.push(`jenis "${v}" (pakai: ${JENIS.join(", ")})`);
    else data.jenis = v.toLowerCase();
  } else if (k === "mode") {
    if (!MODE.includes(v.toLowerCase())) galat.push(`mode "${v}" (pakai: online, offline, hybrid)`);
    else data.mode = v.toLowerCase();
  } else if (k === "biaya") {
    if (/^(gratis|free|0)$/i.test(v)) {
      data.biaya = 0;
      data.ket_biaya = "Gratis";
    } else {
      const angka = v.replace(/rp\.?|\s/gi, "").match(/^(\d+(?:[.,]\d+)*)(rb|ribu|k|jt|juta)?$/i);
      if (angka) {
        const sat = (angka[2] || "").toLowerCase();
        // Dengan satuan, koma/titik = desimal (1,5jt); tanpa satuan = pemisah ribuan (350.000)
        let n = sat ? Number(angka[1].replace(",", ".")) : Number(angka[1].replace(/[.,]/g, ""));
        if (["rb", "ribu", "k"].includes(sat)) n *= 1000;
        if (["jt", "juta"].includes(sat)) n *= 1000000;
        n = Math.round(n);
        data.biaya = n;
        data.ket_biaya = "";
      } else {
        data.biaya = null;
        data.ket_biaya = v.slice(0, 120);
      }
    }
  } else if (["buka", "tutup", "mulai"].includes(k)) {
    const d = bacaTanggal(v);
    if (d === undefined) galat.push(`tanggal ${k} "${v}" tidak terbaca (contoh: 2026-11-20 atau 20/11/2026)`);
    else data[k] = d;
  } else if (k === "url") {
    if (!/^https?:\/\/\S+\.\S+/i.test(v)) galat.push(`url harus diawali https://`);
    else data.url = v.slice(0, 500);
  } else if (k === "aktif") {
    data.aktif = /^(ya|y|1|true|aktif)$/i.test(v);
  } else {
    data[k] = v.slice(0, k === "nama" ? 200 : 600);
  }
}

/* ------------------------------------------------------- tampilan */

const fmtTgl = (d) => (d ? new Date(`${d}T00:00:00Z`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "");

export function hariKe(d) {
  if (!d) return null;
  const kini = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  kini.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${d}T00:00:00`).getTime() - kini.getTime()) / 86400000);
}

export function statusTeks(r) {
  const sisa = hariKe(r.tutup);
  const awal = hariKe(r.buka);
  if (!r.aktif) return "📝 draf";
  if (sisa !== null && sisa < 0) return "⛔ sudah tutup";
  if (awal !== null && awal > 0) return `🕒 buka ${fmtTgl(r.buka)}`;
  if (sisa !== null) return sisa <= 7 ? `⚠️ tutup ${fmtTgl(r.tutup)} (${sisa} hari lagi)` : `✅ buka s.d. ${fmtTgl(r.tutup)}`;
  return "♾️ selalu tersedia";
}

const biayaTeks = (r) => (r.biaya === 0 ? "Gratis" : r.biaya ? `Rp${Number(r.biaya).toLocaleString("id-ID")}` : r.ket_biaya || "-");

export function kartu(r, { lengkap = false } = {}) {
  const baris = [
    `<b>#${r.id} ${esc(r.nama)}</b>`,
    `${esc(r.penyelenggara || "-")} · ${esc(r.jenis)} · ${esc(r.jenjang)}`,
    `${statusTeks(r)}${r.batch ? ` · ${esc(r.batch)}` : ""}`,
  ];
  if (lengkap) {
    baris.push(`💰 ${esc(biayaTeks(r))} · ${esc(r.mode)}${r.durasi ? ` · ${esc(r.durasi)}` : ""}`);
    baris.push(`🏷️ bidang: ${esc((r.bidang || []).join(", ") || "-")}`);
    if (r.posisi?.length) baris.push(`👤 posisi: ${esc(r.posisi.join(", "))}`);
    if (r.mulai) baris.push(`📅 mulai kelas: ${fmtTgl(r.mulai)}`);
    if (r.ringkas) baris.push(`📝 ${esc(r.ringkas)}`);
    if (r.manfaat) baris.push(`⭐ ${esc(r.manfaat)}`);
  }
  if (r.url) baris.push(`<a href="${esc(r.url)}">${lengkap ? esc(r.url) : "Buka situs →"}</a>`);
  return baris.join("\n");
}

export const FORMAT = `<b>Format tambah/ubah sertifikasi</b>
Kirim perintah lalu baris <code>kunci: nilai</code>. Hanya <b>nama</b> yang wajib saat menambah.

<pre>/stambah
nama: Bangkit Academy 2027
penyelenggara: Google, GoTo, Traveloka
url: https://...
jenis: bootcamp
bidang: data, it
posisi: data analyst, android developer
jenjang: dasar
biaya: gratis
mode: online
durasi: 5 bulan
batch: Batch 1 2027
buka: 2026-11-01
tutup: 2026-11-30
mulai: 2027-02-01
ringkas: Program belajar intensif ...
manfaat: Lulusan banyak direkrut ...</pre>

• <b>jenis</b>: sertifikasi, pelatihan, bootcamp, beasiswa, kursus
• <b>jenjang</b>: dasar (pemula), menengah (1–3 th), lanjut (senior)
• <b>bidang</b>: ${Object.keys(BIDANG).join(", ")}
• <b>biaya</b>: gratis, 350rb, 1,5jt, atau teks bebas
• <b>tanggal</b>: 2026-11-30, 30/11/2026, atau 30 Nov 2026. Isi <code>-</code> untuk mengosongkan.

Setelah tanggal <b>tutup</b> lewat, item otomatis hilang dari situs.`;

export const BANTUAN_ADMIN = `<b>Admin sertifikasi</b>
/slist [kata] — semua item (termasuk draf & yang sudah tutup)
/sbaru — yang segera tutup (≤7 hari) & yang sudah tutup
/slihat 12 — detail item #12
/stambah — tambah (lihat /sformat)
/subah 12 — ubah item #12 dengan baris kunci: nilai
/sai &lt;tempel teks pengumuman&gt; — AI mengisi otomatis jadi draf
/sterbit 12 — terbitkan draf
/sarsip 12 — sembunyikan dari situs
/sformat — contoh format lengkap
/idku — lihat ID Telegram-mu`;

/* ------------------------------------------------------- database */

export async function daftar({ kata = "", semua = false, batas = 30 } = {}) {
  let q = db().from("sertifikasi").select("*").order("tutup", { ascending: true, nullsFirst: false }).order("id", { ascending: false }).limit(batas);
  if (!semua) q = q.eq("aktif", true);
  if (kata) q = q.or(`nama.ilike.%${kata.replace(/[%,()]/g, " ")}%,penyelenggara.ilike.%${kata.replace(/[%,()]/g, " ")}%`);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function ambil(id) {
  const { data, error } = await db().from("sertifikasi").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function tambah(data, oleh) {
  const { data: r, error } = await db().from("sertifikasi").insert({ ...data, diubah_oleh: String(oleh) }).select().single();
  if (error) throw error;
  return r;
}

export async function ubah(id, data, oleh) {
  const { data: r, error } = await db().from("sertifikasi").update({ ...data, diubah_oleh: String(oleh) }).eq("id", id).select().maybeSingle();
  if (error) throw error;
  return r;
}

/** Untuk pengguna umum: item aktif yang belum tutup, dicocokkan dengan kata. */
export async function rekomendasi(kata) {
  const hariIni = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })).toISOString().slice(0, 10);
  const { data } = await db()
    .from("sertifikasi")
    .select("*")
    .eq("aktif", true)
    .or(`tutup.is.null,tutup.gte.${hariIni}`)
    .limit(200);
  const k = String(kata || "").toLowerCase().trim();
  const bidang = bidangDari(k);
  const skor = (r) => {
    if (!k) return r.tutup ? 2 : 1;
    let s = 0;
    if (r.nama.toLowerCase().includes(k)) s += 4;
    if ((r.posisi || []).some((p) => p.includes(k) || k.includes(p))) s += 5;
    if ((r.bidang || []).some((b) => bidang.includes(b))) s += 3;
    if (k.split(/\s+/).some((w) => w.length > 2 && `${r.nama} ${(r.posisi || []).join(" ")} ${r.ringkas}`.toLowerCase().includes(w))) s += 1;
    return s;
  };
  return (data || [])
    .map((r) => ({ r, s: skor(r) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || (a.r.tutup || "9999").localeCompare(b.r.tutup || "9999"))
    .slice(0, 6)
    .map((x) => x.r);
}

/* ------------------------------------------------------------ AI */

export async function ekstrakAi(teks) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY belum di-set.");
  const hariIni = new Date().toISOString().slice(0, 10);
  const prompt = `Kamu membantu admin situs lowongan kerja mencatat program sertifikasi/pelatihan dari teks pengumuman.
Hari ini ${hariIni}. Ambil HANYA informasi yang tertulis di teks; jangan menebak. Kosongkan ("" atau null) bila tidak ada.

Kembalikan JSON:
{"nama":"","penyelenggara":"","url":"","jenis":"sertifikasi|pelatihan|bootcamp|beasiswa|kursus","bidang":["slug"],"posisi":["posisi kerja yang relevan, huruf kecil"],"jenjang":"dasar|menengah|lanjut","biaya":"gratis | angka rupiah | teks","mode":"online|offline|hybrid","durasi":"","batch":"","buka":"YYYY-MM-DD|null","tutup":"YYYY-MM-DD|null","mulai":"YYYY-MM-DD|null","ringkas":"maks 2 kalimat","manfaat":"1 kalimat: manfaatnya untuk karier"}

Slug bidang yang boleh: ${Object.keys(BIDANG).join(", ")}.
"posisi" boleh kamu simpulkan dari materi program (maks 6). Tulis ringkas & manfaat dalam bahasa Indonesia yang formal dan natural.

TEKS:
${teks.slice(0, 6000)}`;
  let terakhir;
  for (const model of MODEL_ADMIN) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1500, responseMimeType: "application/json" },
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(`${model} ${res.status}`);
      const mentah = (d?.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
      const j = JSON.parse(mentah.slice(mentah.indexOf("{"), mentah.lastIndexOf("}") + 1));
      // Lewatkan hasil AI melalui pembaca yang sama dengan input manual
      const data = {};
      const galat = [];
      for (const [k, v] of Object.entries(j)) {
        if (v === null || v === "" || (Array.isArray(v) && !v.length)) continue;
        const kunci = KUNCI[k];
        if (!kunci) continue;
        tulisKolom(data, kunci, Array.isArray(v) ? v.join(", ") : String(v), galat);
      }
      return { data, galat };
    } catch (e) {
      terakhir = e;
      console.warn("AI sertifikasi gagal:", model, e?.message);
    }
  }
  throw terakhir || new Error("AI tidak tersedia.");
}
