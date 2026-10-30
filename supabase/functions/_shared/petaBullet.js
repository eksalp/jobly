/**
 * Membaca jumlah bullet per posisi langsung dari teks CV asli, tanpa AI.
 *
 * Dipakai untuk memastikan draft AI tidak memangkas bullet: hasilnya
 * dibandingkan dengan draft, dan posisi yang bullet-nya berkurang ditulis
 * ulang sekali lagi dengan jumlah minimal yang dipaksa lewat skema.
 *
 * Cara kerja: setiap baris yang memuat rentang tanggal ("May 2023 – Present",
 * "2019 - 2021", "01/2020 – 12/2021") dianggap kepala posisi. Baris-baris
 * sesudahnya sampai kepala berikutnya atau judul bagian (HURUF BESAR SEMUA)
 * dianggap bullet posisi itu.
 */

const TGL = String.raw`(?:(?:[A-Za-z]{3,9}\.?\s+)?(?:\d{1,2}[/.-])?(?:19|20)\d{2})`;
const KINI = String.raw`(?:present|current|now|today|sekarang|saat ini|kini)`;
const RENTANG = new RegExp(`${TGL}\\s*(?:-|–|—|s\\.?d\\.?|sampai|to|until)\\s*(?:${TGL}|${KINI})`, "i");

const bersihkan = (s) => s.replace(/^\s*(?:[-•●▪◦*·]|\d+[.)])\s*/, "").trim();
const judulBagian = (s) => {
  const t = s.trim();
  return t.length >= 4 && t.length <= 60 && /[A-Z]/.test(t) && t === t.toUpperCase() && !/\d{4}/.test(t);
};

export function petakanBullet(teks) {
  const baris = String(teks || "")
    .split(/\r?\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  const blok = [];
  let aktif = null;
  baris.forEach((b, i) => {
    if (RENTANG.test(b) && b.length <= 220) {
      // Jabatan atau perusahaan kadang ditulis di baris sebelum tanggal
      const p = i > 0 ? baris[i - 1] : "";
      const sebelum =
        p && !RENTANG.test(p) && !judulBagian(p) && p.length <= 70 && !/[.;:]$/.test(p) && !/^\s*(?:[-•●▪◦*·]|\d+[.)])/.test(p) ? p : "";
      aktif = { kepala: `${sebelum} ${b}`.trim(), bullets: [] };
      blok.push(aktif);
      return;
    }
    if (judulBagian(b)) {
      aktif = null;
      return;
    }
    if (aktif && b.length >= 12) aktif.bullets.push(bersihkan(b));
  });
  // Baris kepala yang ditulis sebelum tanggal ikut terbaca sebagai bullet
  // posisi sebelumnya; buang kalau persis sama.
  blok.forEach((x, i) => {
    const berikut = blok[i + 1];
    if (!berikut) return;
    const kepalaBerikut = berikut.kepala.toLowerCase();
    x.bullets = x.bullets.filter((b) => !kepalaBerikut.startsWith(b.toLowerCase()));
  });
  return blok.filter((x) => x.bullets.length > 0);
}

const token = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

function cocok(kata, kepala) {
  const t = token(kata);
  if (!t.length) return 0;
  const k = new Set(token(kepala));
  return t.filter((w) => k.has(w)).length / t.length;
}

/** Cari blok input yang paling cocok untuk satu entri draft. */
export function cariBlok(entri, blok) {
  let terbaik = null;
  let skor = 0;
  for (const b of blok) {
    const tahun = String(entri.start || "").match(/(19|20)\d{2}/);
    const s =
      cocok(entri.company || entri.org || entri.name, b.kepala) * 2 +
      cocok(entri.role, b.kepala) +
      (tahun && b.kepala.includes(tahun[0]) ? 0.5 : 0);
    if (s > skor) {
      skor = s;
      terbaik = b;
    }
  }
  return skor >= 1 ? terbaik : null;
}

/**
 * Daftar entri draft yang bullet-nya lebih sedikit dari input.
 * Hasil: [{ bagian, indeks, asli: [bullet input], sekarang: [bullet draft] }]
 */
export function cariKekurangan(draft, blok) {
  const kurang = [];
  for (const bagian of ["experiences", "organizations", "volunteers"]) {
    (draft?.[bagian] || []).forEach((e, indeks) => {
      const b = cariBlok(e, blok);
      const desc = Array.isArray(e.desc) ? e.desc : [];
      if (b && desc.length < b.bullets.length) kurang.push({ bagian, indeks, asli: b.bullets, sekarang: desc, judul: `${e.role || ""} · ${e.company || e.org || ""}` });
    });
  }
  return kurang;
}
