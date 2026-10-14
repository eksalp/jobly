/**
 * Latihan praktik untuk setiap profesi di Panduan Remote Working.
 * Dimuat terpisah (dynamic import) agar tidak membebani halaman lain.
 */
import menulis from "./menulis.js";
import desain from "./desain.js";
import teknologi from "./teknologi.js";
import pemasaran from "./pemasaran.js";
import data from "./data.js";
import keuangan from "./keuangan.js";
import admin from "./admin.js";
import pendidikan from "./pendidikan.js";

/** Hash sederhana untuk mengacak urutan pilihan secara tetap (sama di setiap kunjungan). */
function hash(teks) {
  let h = 2166136261;
  for (let i = 0; i < teks.length; i++) {
    h ^= teks.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Acak urutan pilihan agar jawaban benar tidak selalu di posisi yang sama. */
function acakPilihan(soal, benih) {
  let s = hash(benih);
  const urutan = soal.o.map((_, i) => i);
  for (let i = urutan.length - 1; i > 0; i--) {
    s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0;
    const j = s % (i + 1);
    [urutan[i], urutan[j]] = [urutan[j], urutan[i]];
  }
  return { ...soal, o: urutan.map((i) => soal.o[i]), a: urutan.indexOf(soal.a) };
}

const SEMUA = { ...menulis, ...desain, ...teknologi, ...pemasaran, ...data, ...keuangan, ...admin, ...pendidikan };

export const LATIHAN = Object.fromEntries(
  Object.entries(SEMUA).map(([slug, set]) => [
    slug,
    { ...set, kuis: set.kuis.map((q, i) => acakPilihan(q, `${slug}:${i}`)) },
  ]),
);
