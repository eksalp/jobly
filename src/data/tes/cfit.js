/**
 * Tes inteligensi non-verbal gaya CFIT (Culture Fair): seri, klasifikasi,
 * dan matriks (analogi gambar). Gambar memakai format yang sama dengan
 * soal figural: { s: sisi (0 lingkaran, 1 panah), r: rotasi, f: terisi, n: titik }.
 */
import { soalFigural } from "./figural.js";

const F = (o) => {
  const x = { s: 1, r: 0, f: false, n: 0, ...o };
  x.r = ((x.r % 360) + 360) % 360;
  return JSON.stringify(x);
};

const NAMA_BANGUN = { 0: "lingkaran", 1: "panah", 3: "segitiga", 4: "segi empat", 5: "segi lima", 6: "segi enam" };

/* ------------------------------------------------------- klasifikasi */

function klasBentuk(a) {
  const [s, beda] = a.kocok([3, 4, 5, 6]).slice(0, 2);
  const putaran = a.kocok([0, 20, 40, 60]);
  const sama = [0, 1, 2].map((i) => F({ s, r: putaran[i] }));
  return {
    benar: F({ s: beda, r: putaran[3] }),
    lain: sama,
    e: `Tiga gambar adalah ${NAMA_BANGUN[s]} yang diputar ke arah berbeda. Satu-satunya yang berbeda bentuk (jumlah sisinya lain) adalah ${NAMA_BANGUN[beda]}. Rotasi tidak membuat bangun menjadi kelompok lain.`,
  };
}

function klasIsi(a) {
  const bangun = a.kocok([0, 3, 4, 5, 6]).slice(0, 4);
  const terisi = a.int(0, 1) === 1;
  return {
    benar: F({ s: bangun[3], f: !terisi }),
    lain: bangun.slice(0, 3).map((s) => F({ s, f: terisi })),
    e: `Bentuknya berbeda-beda, jadi bentuk bukan aturannya. Tiga gambar ${terisi ? "terisi penuh" : "kosong"}, sedangkan satu gambar ${terisi ? "kosong" : "terisi"}. Itulah yang tidak sekelompok.`,
  };
}

function klasTitik(a) {
  // Bentuk dibuat berbeda semua supaya bentuk bukan pembeda; yang dihitung titiknya
  const bangun = a.kocok([0, 4, 5, 6]);
  const n = a.int(2, 4);
  const beda = a.pilih([n - 1, n + 1]);
  return {
    benar: F({ s: bangun[3], n: beda }),
    lain: bangun.slice(0, 3).map((s) => F({ s, n })),
    e: `Bentuk keempat gambar berbeda-beda, jadi bentuk bukan aturannya. Tiga gambar memuat ${n} titik, sedangkan satu gambar memuat ${beda} titik.`,
  };
}

function klasArah(a) {
  // Tiga panah menunjuk ke arah diagonal, satu menunjuk lurus (atau sebaliknya)
  const diagonal = a.int(0, 1) === 1;
  const kelompok = diagonal ? [45, 135, 225, 315] : [0, 90, 180, 270];
  const lainnya = diagonal ? [0, 90, 180, 270] : [45, 135, 225, 315];
  const tiga = a.kocok(kelompok).slice(0, 3);
  return {
    benar: F({ s: 1, r: a.pilih(lainnya) }),
    lain: tiga.map((r) => F({ s: 1, r })),
    e: `Tiga panah menunjuk ke arah ${diagonal ? "miring (diagonal)" : "lurus (atas, bawah, kiri, atau kanan)"}, sedangkan satu panah menunjuk ${diagonal ? "lurus" : "miring"}.`,
  };
}

/* ----------------------------------------------------------- matriks */

function matPutar(a) {
  const [s1, s2] = a.kocok([1, 3]);
  const r1 = a.pilih([0, 90]);
  const r2 = a.pilih([0, 180]);
  const langkah = a.pilih([90, 180]);
  return {
    seri: [F({ s: s1, r: r1 }), F({ s: s1, r: r1 + langkah })],
    c: F({ s: s2, r: r2 }),
    benar: F({ s: s2, r: r2 + langkah }),
    pengecoh: [F({ s: s2, r: r2 }), F({ s: s2, r: r2 + (langkah === 90 ? 270 : 90) }), F({ s: s2, r: r2 + langkah, f: true }), F({ s: s1, r: r2 + langkah })],
    e: `Gambar pertama diputar ${langkah}° searah jarum jam menjadi gambar kedua. Aturan yang sama diterapkan pada gambar ketiga: putar ${langkah}°.`,
  };
}

function matIsi(a) {
  const [s1, s2] = a.kocok([0, 3, 4, 5, 6]).slice(0, 2);
  const n1 = a.int(0, 3);
  const n2 = a.int(0, 3);
  return {
    seri: [F({ s: s1, n: n1 }), F({ s: s1, n: n1, f: true })],
    c: F({ s: s2, n: n2 }),
    benar: F({ s: s2, n: n2, f: true }),
    pengecoh: [F({ s: s2, n: n2 }), F({ s: s2, n: n2 + 1, f: true }), F({ s: s1, n: n2, f: true }), F({ s: s2, n: Math.max(0, n2 - 1), f: true })],
    e: "Dari gambar pertama ke kedua, bentuk dan jumlah titik tetap, hanya bangunnya menjadi terisi. Gambar ketiga diperlakukan sama: bentuk dan titik tetap, lalu diisi.",
  };
}

function matTitik(a) {
  const [s1, s2] = a.kocok([0, 4, 6]).slice(0, 2);
  const tambah = a.pilih([1, 2]);
  const n1 = a.int(1, 2);
  const n2 = a.int(1, 3);
  return {
    seri: [F({ s: s1, n: n1 }), F({ s: s1, n: n1 + tambah })],
    c: F({ s: s2, n: n2 }),
    benar: F({ s: s2, n: n2 + tambah }),
    pengecoh: [F({ s: s2, n: n2 }), F({ s: s2, n: n2 + tambah + 1 }), F({ s: s1, n: n2 + tambah }), F({ s: s2, n: n2 + tambah, f: true })],
    e: `Gambar kedua sama dengan gambar pertama ditambah ${tambah} titik. Maka jawabannya adalah gambar ketiga ditambah ${tambah} titik (${n2} menjadi ${n2 + tambah}).`,
  };
}

function matSisi(a) {
  const s1 = a.pilih([3, 4]);
  const s2 = s1 === 3 ? a.pilih([4, 5]) : a.pilih([3, 5]);
  return {
    seri: [F({ s: s1 }), F({ s: s1 + 1 })],
    c: F({ s: s2 }),
    benar: F({ s: s2 + 1 }),
    pengecoh: [F({ s: s2 }), F({ s: s2 + 2 }), F({ s: s2 + 1, f: true }), F({ s: 0 })],
    e: `${NAMA_BANGUN[s1]} menjadi ${NAMA_BANGUN[s1 + 1]}: jumlah sisinya bertambah satu. Jadi ${NAMA_BANGUN[s2]} menjadi ${NAMA_BANGUN[s2 + 1]}.`,
  };
}

/* ------------------------------------------------------------ rakit */

export function soalCfit(acak, susunPilihan, { seri = 10, klasifikasi = 10, matriks = 10 } = {}) {
  const hasil = [];
  // Seri: dari generator figural
  soalFigural(acak, seri, susunPilihan).forEach((s) => hasil.push({ ...s, bagian: "Seri" }));

  const klas = [klasBentuk, klasIsi, klasTitik, klasArah];
  const sudahK = new Set();
  for (let i = 0; hasil.filter((x) => x.bagian === "Klasifikasi").length < klasifikasi && i < 200; i++) {
    const s = klas[i % klas.length](acak);
    const kunci = s.benar + s.lain.join();
    if (sudahK.has(kunci) || s.lain.includes(s.benar)) continue;
    sudahK.add(kunci);
    const o = acak.kocok([s.benar, ...s.lain]);
    hasil.push({ q: "Manakah gambar yang TIDAK sekelompok dengan tiga gambar lainnya?", figural: true, o, a: o.indexOf(s.benar), e: s.e, bagian: "Klasifikasi" });
  }

  const mat = [matPutar, matIsi, matTitik, matSisi];
  const sudahM = new Set();
  for (let i = 0; hasil.filter((x) => x.bagian === "Matriks").length < matriks && i < 200; i++) {
    const s = mat[i % mat.length](acak);
    const kunci = s.seri.join() + s.c;
    if (sudahM.has(kunci)) continue;
    sudahM.add(kunci);
    const p = susunPilihan(acak, s.benar, s.pengecoh);
    if (p.o.length < 4) continue;
    hasil.push({ q: "Gambar 1 berubah menjadi gambar 2. Dengan aturan yang sama, gambar 3 berubah menjadi apa?", figural: true, analogi: [...s.seri, s.c], ...p, e: s.e, bagian: "Matriks" });
  }
  return hasil;
}

export const TIPS_CFIT = [
  "CFIT berwaktu sangat ketat (sekitar 3–4 menit per bagian). Jangan terpaku pada satu soal; lewati dan kembali bila sempat.",
  "Seri: periksa satu per satu perubahan rotasi, jumlah, bentuk, lalu warna.",
  "Klasifikasi: cari dulu apa yang SAMA pada sebagian besar gambar, baru tentukan mana yang berbeda. Rotasi biasanya bukan pembeda.",
  "Matriks: tuliskan aturan gambar 1 → 2 dalam satu kalimat (mis. 'diputar 90°'), lalu terapkan persis ke gambar 3.",
  "Tes ini tidak membutuhkan pengetahuan bahasa atau hitungan, sehingga latihan pola benar-benar meningkatkan kecepatan.",
];
