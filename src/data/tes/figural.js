/**
 * Generator soal figural (logika gambar). Setiap gambar disimpan sebagai
 * objek sederhana lalu digambar oleh komponen <Figur> di panel tes:
 *   { s: sisi poligon (0 = lingkaran, 1 = panah), r: rotasi derajat,
 *     f: terisi (true/false), n: jumlah titik di dalam }
 * Pilihan jawaban disimpan sebagai string JSON supaya bisa dibandingkan.
 */

const F = (o) => {
  const x = { s: 1, r: 0, f: false, n: 0, ...o };
  x.r = ((x.r % 360) + 360) % 360;
  return JSON.stringify(x);
};
const FIGURAL = "Logika gambar";

function rotasi(a) {
  const langkah = a.pilih([45, 90]), awal = a.pilih([0, 45, 90]), s = a.pilih([1, 3]);
  const seri = Array.from({ length: 4 }, (_, i) => ({ s, r: awal + i * langkah }));
  const benar = { s, r: awal + 4 * langkah };
  return {
    seri,
    benar: F(benar),
    pengecoh: [F({ s, r: awal + 3 * langkah }), F({ s, r: awal + 4 * langkah + 180 }), F({ s, r: awal + 5 * langkah }), F({ s: s === 1 ? 3 : 1, r: benar.r })],
    e: `Gambar berputar ${langkah}° searah jarum jam setiap langkah. Gambar ke-5 adalah gambar ke-4 diputar ${langkah}° lagi.`,
  };
}

function jumlahTitik(a) {
  const awal = a.int(1, 2), tambah = a.pilih([1, 2]), s = a.pilih([0, 4]);
  const seri = Array.from({ length: 4 }, (_, i) => ({ s, n: awal + i * tambah }));
  const nb = awal + 4 * tambah;
  return {
    seri,
    benar: F({ s, n: nb }),
    pengecoh: [F({ s, n: nb - 1 }), F({ s, n: nb + 1 }), F({ s, n: nb, f: true }), F({ s: s === 0 ? 4 : 0, n: nb })],
    e: `Jumlah titik di dalam bertambah ${tambah} setiap langkah: ${seri.map((x) => x.n).join(", ")}, berikutnya ${nb}. Bentuk luar tidak berubah dan tetap tidak terisi.`,
  };
}

function sisiBertambah(a) {
  const awal = a.pilih([3, 4]);
  const seri = Array.from({ length: 4 }, (_, i) => ({ s: awal + i }));
  const nb = awal + 4;
  return {
    seri,
    benar: F({ s: nb }),
    pengecoh: [F({ s: nb - 1 }), F({ s: nb + 1 }), F({ s: nb, f: true }), F({ s: 0 })],
    e: `Jumlah sisi bangun bertambah satu setiap langkah (${seri.map((x) => x.s).join(", ")} sisi), jadi berikutnya bangun dengan ${nb} sisi.`,
  };
}

function rotasiIsi(a) {
  const s = a.pilih([3, 1]), langkah = 90;
  const seri = Array.from({ length: 4 }, (_, i) => ({ s, r: i * langkah, f: i % 2 === 0 }));
  const benar = { s, r: 4 * langkah, f: true };
  return {
    seri,
    benar: F(benar),
    pengecoh: [F({ ...benar, f: false }), F({ s, r: 3 * langkah, f: true }), F({ s, r: 5 * langkah, f: true }), F({ s, r: 3 * langkah, f: false })],
    e: "Dua pola berjalan bersamaan: gambar berputar 90° setiap langkah, dan warnanya berselang-seling terisi–kosong. Gambar ke-5 (urutan ganjil) terisi dan sudah berputar 360°, kembali ke posisi awal.",
  };
}

function dua(a) {
  // Pola maju-mundur: titik naik lalu turun
  const s = a.pilih([0, 4, 6]);
  const pola = a.pilih([[1, 2, 3, 2], [2, 4, 2, 4], [3, 2, 1, 2]]);
  const seri = pola.map((n) => ({ s, n }));
  const nb = pola[0] === 1 ? 1 : pola[0] === 2 ? 2 : 3;
  return {
    seri,
    benar: F({ s, n: nb }),
    pengecoh: [F({ s, n: nb + 2 }), F({ s, n: nb + 1 }), F({ s, n: nb, f: true }), F({ s: s === 0 ? 4 : 0, n: nb })],
    e: `Jumlah titik membentuk pola bolak-balik (${pola.join(", ")}, …). Polanya kembali ke ${nb} pada gambar berikutnya.`,
  };
}

const GEN = [rotasi, jumlahTitik, sisiBertambah, rotasiIsi, dua];

export function soalFigural(acak, n, susunPilihan) {
  const hasil = [];
  const sudah = new Set();
  for (let coba = 0; hasil.length < n && coba < n * 30; coba++) {
    const s = GEN[coba % GEN.length](acak);
    const kunci = JSON.stringify(s.seri) + s.benar;
    if (sudah.has(kunci)) continue;
    sudah.add(kunci);
    const pilihan = susunPilihan(acak, s.benar, s.pengecoh);
    hasil.push({
      q: "Gambar mana yang melanjutkan urutan berikut?",
      figural: true,
      seri: s.seri,
      ...pilihan,
      e: s.e,
      bagian: FIGURAL,
    });
  }
  return hasil;
}

export const TIPS_FIGURAL = [
  "Periksa satu unsur dalam satu waktu: arah/rotasi, jumlah, jumlah sisi, lalu warna (terisi atau kosong).",
  "Sering ada dua pola sekaligus, misalnya berputar 90° DAN warnanya berselang-seling. Pastikan jawabanmu memenuhi keduanya.",
  "Hitung rotasi dengan menelusuri ujung panah atau sudut segitiga dari gambar ke gambar.",
  "Pola bisa bolak-balik (naik lalu turun), bukan selalu bertambah.",
];
