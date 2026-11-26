// @ts-nocheck
// Input loker manual lewat Telegram (khusus admin).
//
//   /lokerbaru              kirim template
//   /lokerbaru + isian      simpan loker (format "kunci: nilai" per baris)
//   /lokermanual            daftar loker manual yang masih aktif
//   /lokerubah <no> + isian ubah sebagian isian
//   /lokertutup <no>        tutup loker (hilang dari situs)
//   /lokerbuka <no>         buka kembali
//
// Disimpan di tabel loker_manual (DB1); trigger SQL 18 menyalinnya ke tabel
// jobs dengan id 900000000 + nomor, jadi link loker tetap walau di-scrape ulang.

import { rest, tandaiUrl, kodeLoker } from "./urgent.ts";

export const ID_DASAR = 900000000;

export const TEMPLATE = `<b>Template loker manual</b>
Salin, isi, lalu kirim (baris yang tidak perlu boleh dihapus):

<code>/lokerbaru
posisi: Accounting Staff
perusahaan: PT Contoh Sejahtera
lokasi: Jakarta Selatan
tipe: full-time
kerja: onsite
gaji: 6-8 jt
link: https://contoh.com/karier/accounting
urgent: ya 14
deskripsi:
Tanggung jawab:
• Menyusun laporan keuangan bulanan
Kualifikasi:
• S1 Akuntansi</code>

<b>Wajib:</b> posisi, perusahaan, link (boleh alamat email).
<b>tipe</b>: full-time, kontrak, freelance, magang, part-time
<b>kerja</b>: onsite, remote, hybrid
<b>gaji</b>: "6-8 jt", "5000000", atau "Rp 4.500.000 - 6.000.000"
<b>urgent</b>: "ya" (14 hari), "ya 30", "ya 0" (tanpa batas), atau hapus barisnya
<b>deskripsi</b> harus di baris terakhir; semua baris sesudahnya ikut menjadi deskripsi.`;

const ALIAS = {
  posisi: "posisi", judul: "posisi", jabatan: "posisi",
  perusahaan: "perusahaan", pt: "perusahaan", company: "perusahaan",
  lokasi: "lokasi", kota: "lokasi", penempatan: "lokasi",
  tipe: "tipe", "tipe kerja": "tipe", status: "tipe",
  kerja: "cara_kerja", "cara kerja": "cara_kerja", sistem: "cara_kerja",
  gaji: "gaji", salary: "gaji",
  link: "link", lamar: "link", email: "link", url: "link",
  kategori: "kategori", bidang: "kategori",
  urgent: "urgent",
  deskripsi: "deskripsi", keterangan: "deskripsi", detail: "deskripsi",
};

function tipeBaku(v) {
  const s = v.toLowerCase();
  if (/full|tetap|permanen/.test(s)) return "full-time";
  if (/kontrak|contract|pkwt/.test(s)) return "kontrak";
  if (/freelance|lepas|proyek/.test(s)) return "freelance";
  if (/magang|intern/.test(s)) return "magang";
  if (/part|paruh/.test(s)) return "part-time";
  return null;
}

function kerjaBaku(v) {
  const s = v.toLowerCase();
  if (/hybrid|hibrid/.test(s)) return "hybrid";
  if (/remote|wfh|rumah|online/.test(s)) return "remote";
  if (/onsite|on-site|wfo|kantor|lokasi/.test(s)) return "onsite";
  return null;
}

function angkaGaji(t) {
  const s = t.toLowerCase().replace(/rp\.?/g, "").trim();
  const jt = /jt|juta/.test(s);
  if (jt) {
    const n = parseFloat(s.replace(/[^\d,.]/g, "").replace(",", "."));
    return Number.isFinite(n) ? Math.round(n * 1e6) : null;
  }
  const n = Number(s.replace(/[^\d]/g, ""));
  return n > 0 ? n : null;
}

/** "6-8 jt" → [6000000, 8000000]; "5jt" → [5000000, null] */
export function bacaGaji(v) {
  const s = String(v || "").toLowerCase();
  const satuanJt = /jt|juta/.test(s);
  const bagian = s.split(/\s*(?:-|–|—|s\.?d\.?|sampai|hingga)\s*/).filter(Boolean);
  const nilai = bagian.map((b) => angkaGaji(satuanJt && !/jt|juta/.test(b) ? `${b} jt` : b)).filter((x) => x);
  if (!nilai.length) return [null, null];
  return [Math.min(...nilai), nilai.length > 1 ? Math.max(...nilai) : null];
}

/** Baca isian "kunci: nilai". Mengembalikan { data, urgentHari, galat }. */
export function bacaIsian(teks) {
  const data = {};
  const galat = [];
  let urgentHari = null;
  const baris = String(teks || "").split("\n");
  for (let i = 0; i < baris.length; i++) {
    const m = baris[i].match(/^\s*([a-zA-Z ]{2,20})\s*:\s*(.*)$/);
    if (!m) continue;
    const kunci = ALIAS[m[1].trim().toLowerCase()];
    if (!kunci) continue;
    let v = m[2].trim();
    if (kunci === "deskripsi") {
      data.deskripsi = [v, ...baris.slice(i + 1)].join("\n").trim() || null;
      break;
    }
    if (!v) continue;
    if (kunci === "tipe") {
      const t = tipeBaku(v);
      if (t) data.tipe = t;
      else galat.push(`tipe "${v}" tidak dikenal`);
    } else if (kunci === "cara_kerja") {
      const k = kerjaBaku(v);
      if (k) data.cara_kerja = k;
      else galat.push(`kerja "${v}" tidak dikenal`);
    } else if (kunci === "gaji") {
      const [min, max] = bacaGaji(v);
      if (min) {
        data.gaji_min = min;
        data.gaji_max = max;
      } else galat.push(`gaji "${v}" tidak terbaca`);
    } else if (kunci === "link") {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) v = `mailto:${v}`;
      else if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
      data.link = v;
    } else if (kunci === "urgent") {
      const s = v.toLowerCase();
      if (/^(ya|iya|y|yes|urgent)\b/.test(s)) {
        const h = s.match(/\d+/);
        urgentHari = h ? Number(h[0]) : 14;
      }
    } else {
      data[kunci] = v;
    }
  }
  return { data, urgentHari, galat };
}

const tampilGaji = (r) => {
  const f = (n) => `${Math.round(n / 100000) / 10}`.replace(".", ",");
  if (r.gaji_min && r.gaji_max) return `Rp ${f(r.gaji_min)}–${f(r.gaji_max)} jt`;
  if (r.gaji_min) return `Rp ${f(r.gaji_min)} jt`;
  return null;
};

export const linkManual = (situs, r) => `${situs}/loker/${kodeLoker("db1", ID_DASAR + r.id)}`;

export function ringkas(r, esc) {
  return [
    `#${r.id} <b>${esc(r.posisi)}</b>${r.aktif === false ? " (ditutup)" : ""}`,
    `${esc(r.perusahaan)}${r.lokasi ? ` · ${esc(r.lokasi)}` : ""}`,
    [r.tipe, r.cara_kerja, tampilGaji(r)].filter(Boolean).join(" · "),
  ]
    .filter(Boolean)
    .join("\n");
}

export async function simpanBaru(isi, oleh) {
  const { data, urgentHari, galat } = bacaIsian(isi);
  const kurang = ["posisi", "perusahaan", "link"].filter((k) => !data[k]);
  if (kurang.length) return { kurang, galat };
  // Tanda urgent dipasang lebih dulu supaya trigger langsung menerapkannya
  let sampai;
  if (urgentHari !== null) sampai = await tandaiUrl("db1", data.link, urgentHari);
  const [r] = await rest("db1", "select=*", { tabel: "loker_manual", metode: "POST", body: { ...data, dibuat_oleh: String(oleh || "") } });
  return { r, galat, urgent: urgentHari !== null, sampai };
}

export async function ubah(id, isi) {
  const { data, urgentHari, galat } = bacaIsian(isi);
  if (!Object.keys(data).length && urgentHari === null) return { kosong: true, galat };
  let r;
  if (Object.keys(data).length) {
    [r] = await rest("db1", `id=eq.${id}&select=*`, { tabel: "loker_manual", metode: "PATCH", body: data });
  } else {
    [r] = await rest("db1", `id=eq.${id}&select=*`, { tabel: "loker_manual" });
  }
  let sampai;
  if (r && urgentHari !== null) sampai = await tandaiUrl("db1", r.link, urgentHari);
  return { r, galat, urgent: urgentHari !== null, sampai };
}

export async function setAktif(id, aktif) {
  const [r] = await rest("db1", `id=eq.${id}&select=*`, { tabel: "loker_manual", metode: "PATCH", body: { aktif } });
  return r || null;
}

export async function daftar() {
  return rest("db1", "aktif=is.true&select=*&order=id.desc&limit=30", { tabel: "loker_manual" });
}

export const BANTUAN_MANUAL = `<b>Loker manual</b>
/lokerbaru — kirim template, lalu isi dan kirim balik
/lokermanual — daftar loker manual yang aktif
/lokerubah &lt;nomor&gt; — ubah isian, mis. <code>/lokerubah 3
gaji: 7-9 jt</code>
/lokertutup &lt;nomor&gt; — tutup loker (hilang dari situs)
/lokerbuka &lt;nomor&gt; — buka kembali`;
