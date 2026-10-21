/**
 * Tes kecermatan (simbol hilang) — format yang umum di seleksi BUMN,
 * kepolisian, dan kedinasan. Setiap kolom punya kunci 5 simbol berlabel
 * A–E. Setiap soal menampilkan 4 simbol acak; peserta memilih huruf
 * simbol yang HILANG. Waktu per kolom terbatas, lalu otomatis pindah.
 */

export const KECERMATAN = { kolom: 10, detikPerKolom: 45 };
const LABEL = ["A", "B", "C", "D", "E"];

const KUMPULAN = [
  "ABCDEFGHJKLMNPQRSTUVWXYZ".split(""),
  "0123456789".split(""),
  ["★", "●", "▲", "■", "◆", "♥", "♣", "✚", "☾", "✦", "⬟", "⬢"],
];

export function buatKecermatan(acak, kolom = KECERMATAN.kolom) {
  return Array.from({ length: kolom }, (_, i) => {
    const sumber = KUMPULAN[i % KUMPULAN.length];
    const kunci = acak.kocok(sumber).slice(0, 5);
    const soal = Array.from({ length: 60 }, () => {
      const hilang = acak.int(0, 4);
      const tampil = acak.kocok(kunci.filter((_, j) => j !== hilang));
      return { tampil, a: hilang };
    });
    return { kunci, soal };
  });
}

export { LABEL as LABEL_KECERMATAN };

export function nilaiKecermatan(perKolom) {
  const n = perKolom.length || 1;
  const dijawab = perKolom.map((k) => k.dijawab);
  const total = dijawab.reduce((a, b) => a + b, 0);
  const benar = perKolom.reduce((a, k) => a + k.benar, 0);
  const rata = total / n;
  const sd = Math.sqrt(dijawab.reduce((a, x) => a + (x - rata) ** 2, 0) / n);
  const awal = dijawab.slice(0, Math.floor(n / 2));
  const akhir = dijawab.slice(Math.floor(n / 2));
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  // Peserta terlatih menjawab sekitar 25 soal per 45 detik
  const kecepatan = Math.min(100, Math.round((rata / 25) * 100));
  const ketelitian = total ? Math.round((benar / total) * 100) : 0;
  const keajegan = Math.max(0, Math.round(100 - sd * 10));
  const ketahanan = Math.max(0, Math.min(100, Math.round(70 + (avg(akhir) - avg(awal)) * 6)));
  const skor = Math.round(kecepatan * 0.35 + ketelitian * 0.4 + keajegan * 0.15 + ketahanan * 0.1);
  return { total, benar, rata: Math.round(rata * 10) / 10, kecepatan, ketelitian, keajegan, ketahanan, skor };
}

export const TIPS_KECERMATAN = [
  "Hafalkan kunci di awal setiap kolom dalam 2–3 detik, misalnya dengan mengucapkannya dalam hati sebagai satu 'kata'.",
  "Jangan membandingkan satu per satu dengan tabel kunci terus-menerus; cari simbol yang tidak kamu lihat.",
  "Ketelitian lebih penting daripada kecepatan. Jawaban salah menurunkan nilai lebih banyak daripada soal yang tidak sempat dijawab.",
  "Jaga ritme yang stabil dari kolom pertama sampai terakhir; asesor juga menilai kestabilan dan ketahanan.",
];
