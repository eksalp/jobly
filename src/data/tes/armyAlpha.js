/**
 * Tes gaya Army Alpha: daya tangkap dan kecepatan mengikuti instruksi
 * tertulis. Soal dibuat acak, jawabannya dihitung, dan pembahasannya
 * menjelaskan langkah membaca instruksi.
 */

const KATA = ["JENDELA", "KANTOR", "LAPORAN", "SEPATU", "PELANGI", "MERDEKA", "KAMERA", "BENDERA", "SURAT", "TELEPON", "PASAR", "GEDUNG", "SEMANGKA", "KOMPUTER", "PERAHU", "KERTAS"];
const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const LAWAN = [
  ["naik", "turun"], ["terang", "gelap"], ["rajin", "malas"], ["untung", "rugi"], ["awal", "akhir"], ["masuk", "keluar"],
  ["boros", "hemat"], ["kokoh", "rapuh"], ["jujur", "curang"], ["ramai", "sepi"], ["pasang", "surut"], ["maju", "mundur"],
  ["lebar", "sempit"], ["lambat", "cepat"], ["tegang", "santai"],
];
const VOKAL = new Set(["A", "I", "U", "E", "O"]);
const BAGIAN = "Mengikuti instruksi";

function syaratHuruf(a) {
  const kata = a.pilih(KATA);
  const x = a.int(10, 60);
  const y = a.int(10, 60);
  if (x === y) return null;
  const benar = x > y ? kata.at(-1) : kata[0];
  const pengecoh = [kata.at(-1), kata[0], kata[1], kata.at(-2)];
  return {
    q: `Jika ${x} lebih besar daripada ${y}, pilih huruf TERAKHIR dari kata "${kata}". Jika tidak, pilih huruf PERTAMANYA.`,
    benar,
    pengecoh,
    e: `${x} ${x > y ? "memang lebih besar" : "tidak lebih besar"} daripada ${y}, jadi yang dipilih huruf ${x > y ? "terakhir" : "pertama"} dari "${kata}", yaitu ${benar}.`,
  };
}

function selisihEkstrem(a) {
  const daftar = a.kocok([a.int(2, 19), a.int(20, 49), a.int(50, 99), a.int(3, 95), a.int(4, 90)]);
  if (new Set(daftar).size < 5) return null;
  const maks = Math.max(...daftar);
  const min = Math.min(...daftar);
  return {
    q: `Dari angka ${daftar.join(", ")}: kurangkan angka TERKECIL dari angka TERBESAR.`,
    benar: maks - min,
    pengecoh: [maks + min, maks - daftar[0], daftar.at(-1) - min, maks - min + 1],
    e: `Terbesar ${maks}, terkecil ${min}. ${maks} − ${min} = ${maks - min}.`,
  };
}

function hariRelatif(a) {
  const acuan = a.int(0, 6);
  const geserAcuan = a.pilih([[2, "lusa"], [1, "besok"], [-1, "kemarin"], [-2, "kemarin lusa"]]);
  const ditanya = a.pilih([[1, "besok"], [-1, "kemarin"], [0, "hari ini"], [3, "tiga hari lagi"]]);
  if (geserAcuan[1] === ditanya[1]) return null;
  // acuan = hari dari "geserAcuan"; hari ini = acuan − geser
  const hariIni = (acuan - geserAcuan[0] + 70) % 7;
  const jawab = (hariIni + ditanya[0] + 70) % 7;
  return {
    q: `Jika ${geserAcuan[1]} adalah hari ${HARI[acuan]}, hari apakah ${ditanya[1]}?`,
    benar: HARI[jawab],
    pengecoh: [HARI[(jawab + 1) % 7], HARI[(jawab + 6) % 7], HARI[acuan], HARI[(jawab + 2) % 7]],
    e: `${geserAcuan[1][0].toUpperCase() + geserAcuan[1].slice(1)} adalah ${HARI[acuan]}, berarti hari ini ${HARI[hariIni]}. Maka ${ditanya[1]} adalah ${HARI[jawab]}.`,
  };
}

function hitungVokal(a) {
  const kata = a.pilih(KATA);
  const n = [...kata].filter((h) => VOKAL.has(h)).length;
  return {
    q: `Berapa banyak huruf vokal (A, I, U, E, O) dalam kata "${kata}"?`,
    benar: n,
    pengecoh: [n + 1, n - 1, kata.length - n, n + 2].filter((x) => x >= 0),
    e: `Huruf vokal dalam ${kata}: ${[...kata].filter((h) => VOKAL.has(h)).join(", ")}, jumlahnya ${n}.`,
  };
}

function urutAbjad(a) {
  const pilih = a.kocok(KATA).slice(0, 5);
  const urut = [...pilih].sort();
  const ke = a.int(2, 4);
  return {
    q: `Urutkan kata berikut sesuai abjad: ${pilih.join(", ")}. Kata manakah yang berada di urutan ke-${ke}?`,
    benar: urut[ke - 1],
    pengecoh: [urut[ke - 2], urut[ke] || urut[0], pilih[ke - 1], urut.at(-1)],
    e: `Urutan abjad: ${urut.join(", ")}. Urutan ke-${ke} adalah ${urut[ke - 1]}.`,
  };
}

function jumlahGenap(a) {
  const daftar = Array.from({ length: 6 }, () => a.int(1, 30));
  const genap = daftar.filter((x) => x % 2 === 0);
  if (genap.length < 2) return null;
  const j = genap.reduce((p, x) => p + x, 0);
  const ganjil = daftar.filter((x) => x % 2).reduce((p, x) => p + x, 0);
  return {
    q: `Jumlahkan hanya angka GENAP dari deret ini: ${daftar.join(", ")}.`,
    benar: j,
    pengecoh: [ganjil, j + genap[0], daftar.reduce((p, x) => p + x, 0), j - 2],
    e: `Angka genap: ${genap.join(" + ")} = ${j}.`,
  };
}

function syaratBagi(a) {
  let x;
  do x = a.int(12, 99);
  while (x % 12 === 0);
  const [A, B, C] = a.kocok(["MERAH", "BIRU", "HIJAU", "KUNING"]).slice(0, 3);
  const benar = x % 3 === 0 ? A : x % 4 === 0 ? B : C;
  return {
    q: `Jika ${x} habis dibagi 3, pilih ${A}. Jika ${x} habis dibagi 4, pilih ${B}. Jika tidak keduanya, pilih ${C}.`,
    benar,
    pengecoh: [A, B, C, "PUTIH"],
    e: `${x} ${x % 3 === 0 ? "habis" : "tidak habis"} dibagi 3 dan ${x % 4 === 0 ? "habis" : "tidak habis"} dibagi 4, jadi jawabannya ${benar}.`,
  };
}

function lawanKata(a) {
  const [kata, lawan] = a.pilih(LAWAN);
  const lain = a.kocok(LAWAN.filter((p) => p[0] !== kata)).slice(0, 3).map((p) => a.pilih(p));
  return {
    q: `Pilih kata yang BERLAWANAN arti dengan "${kata}".`,
    benar: lawan,
    pengecoh: lain,
    e: `Lawan kata "${kata}" adalah "${lawan}".`,
  };
}

function posisiHuruf(a) {
  const kata = a.pilih(KATA);
  const k = a.int(2, Math.min(5, kata.length - 1));
  const huruf = kata[k - 1];
  const balik = [...kata].reverse();
  return {
    q: `Tulis kata "${kata}" dari belakang. Huruf apakah yang berada di urutan ke-${k}?`,
    benar: balik[k - 1],
    pengecoh: [huruf, balik[k] || kata[0], balik[k - 2] || kata.at(-1), kata[k]],
    e: `"${kata}" dibalik menjadi "${balik.join("")}". Huruf ke-${k} adalah ${balik[k - 1]}.`,
  };
}

const GEN = [syaratHuruf, selisihEkstrem, hariRelatif, hitungVokal, urutAbjad, jumlahGenap, syaratBagi, lawanKata, posisiHuruf];

export function soalArmyAlpha(acak, n, susunPilihan) {
  const hasil = [];
  const sudah = new Set();
  const urut = acak.kocok(GEN);
  for (let i = 0; hasil.length < n && i < n * 30; i++) {
    const s = urut[i % urut.length](acak);
    if (!s || sudah.has(s.q)) continue;
    const p = susunPilihan(acak, s.benar, s.pengecoh);
    if (p.o.length < 3) continue;
    sudah.add(s.q);
    hasil.push({ q: s.q, ...p, e: s.e, bagian: BAGIAN });
  }
  return hasil;
}

export const TIPS_ARMY_ALPHA = [
  "Baca instruksi sampai habis sebelum menjawab. Banyak soal menyelipkan kata TIDAK, TERAKHIR, atau HANYA yang mengubah jawaban.",
  "Kerjakan bertahap: tentukan dulu syaratnya benar atau salah, baru lakukan perintahnya.",
  "Untuk soal hari, tentukan dulu 'hari ini', baru hitung maju atau mundur.",
  "Waktu sangat terbatas. Soal yang membingungkan langsung dilewati, karena setiap soal bernilai sama.",
];
