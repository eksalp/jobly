/**
 * Generator soal TPA Numerik (HOTS). Angka dibuat acak setiap tes,
 * pembahasannya dihitung otomatis dari angka yang sama sehingga selalu
 * cocok dengan soalnya.
 *
 * Setiap fungsi mengembalikan { q, benar, pengecoh: [...], e, b }.
 */

const rp = (n) => Math.round(n).toLocaleString("id-ID");
const desimal = (n) => (Math.round(n * 100) / 100).toLocaleString("id-ID");

const DERET = "Deret angka";
const ARIT = "Aritmetika";
const CERITA = "Soal cerita";
const PERBANDINGAN = "Perbandingan";
const PELUANG = "Peluang & statistik";

/* ------------------------------------------------------------- deret */

function deretTingkatDua(a) {
  const x = a.int(2, 20), b = a.int(1, 5), c = a.int(1, 3);
  const s = [x];
  let selisih = b;
  for (let i = 1; i < 6; i++) {
    s.push(s[i - 1] + selisih);
    selisih += c;
  }
  const sel = s.slice(1).map((v, i) => v - s[i]);
  return {
    b: DERET,
    q: `Lanjutkan deret: ${s.slice(0, 5).join(", ")}, …`,
    benar: s[5],
    pengecoh: [s[5] + c, s[5] - c, s[5] + 1, s[4] + sel[3]],
    e: `Lihat selisih antarsuku: ${sel.slice(0, 4).join(", ")}. Selisihnya bertambah ${c} setiap langkah (deret bertingkat dua), jadi selisih berikutnya ${sel[4]}. ${s[4]} + ${sel[4]} = ${s[5]}.`,
  };
}

function deretSelang(a) {
  const p = a.int(2, 9), dp = a.int(2, 6), q = a.int(10, 30), dq = a.int(3, 8);
  const s = [];
  for (let i = 0; i < 7; i++) s.push(i % 2 === 0 ? p + (i / 2) * dp : q - ((i - 1) / 2) * dq);
  return {
    b: DERET,
    q: `Lanjutkan deret: ${s.slice(0, 6).join(", ")}, …`,
    benar: s[6],
    pengecoh: [s[6] + dp, s[5] - dq, s[6] - 1, s[5] + dp],
    e: `Ada dua deret yang berselang-seling. Suku ganjil (ke-1, 3, 5, …): ${s[0]}, ${s[2]}, ${s[4]} selalu +${dp}. Suku genap: ${s[1]}, ${s[3]}, ${s[5]} selalu −${dq}. Suku ke-7 termasuk suku ganjil: ${s[4]} + ${dp} = ${s[6]}.`,
  };
}

function deretFibonacci(a) {
  const x = a.int(1, 6), y = a.int(2, 8);
  const s = [x, y];
  for (let i = 2; i < 7; i++) s.push(s[i - 1] + s[i - 2]);
  return {
    b: DERET,
    q: `Lanjutkan deret: ${s.slice(0, 6).join(", ")}, …`,
    benar: s[6],
    pengecoh: [s[6] + 1, s[5] * 2, s[6] - s[3], s[5] + s[3]],
    e: `Setiap suku adalah jumlah DUA suku sebelumnya: ${s[2]} = ${s[0]} + ${s[1]}, ${s[3]} = ${s[1]} + ${s[2]}, dan seterusnya. Jadi suku berikutnya ${s[4]} + ${s[5]} = ${s[6]}.`,
  };
}

function deretKaliTambah(a) {
  const x = a.int(2, 5), k = a.int(2, 3), t = a.pilih([-1, 1, 2]);
  const s = [x];
  for (let i = 1; i < 6; i++) s.push(s[i - 1] * k + t);
  const tanda = t >= 0 ? `+ ${t}` : `− ${Math.abs(t)}`;
  return {
    b: DERET,
    q: `Lanjutkan deret: ${s.slice(0, 5).join(", ")}, …`,
    benar: s[5],
    pengecoh: [s[4] * k, s[5] + k, s[5] - 2 * t || s[5] + 3, s[4] + s[3]],
    e: `Pola: suku sebelumnya dikali ${k} lalu ${tanda}. Contoh ${s[0]} × ${k} ${tanda} = ${s[1]}. Jadi ${s[4]} × ${k} ${tanda} = ${s[5]}.`,
  };
}

/* ------------------------------------------------------- aritmetika */

function persenBertingkat(a) {
  const n = a.pilih([400, 500, 600, 800, 1200, 1500]), p1 = a.pilih([20, 25, 40, 50]), p2 = a.pilih([10, 20, 30, 60]);
  const hasil = (n * p1 * p2) / 10000;
  return {
    b: ARIT,
    q: `Berapa ${p2}% dari ${p1}% dari ${rp(n)}?`,
    benar: rp(hasil),
    pengecoh: [rp(((p1 + p2) / 100) * n), rp((n * p1) / 100), rp(hasil * 10), rp(hasil + 10)],
    e: `Kerjakan dari dalam: ${p1}% × ${rp(n)} = ${rp((n * p1) / 100)}. Lalu ${p2}% × ${rp((n * p1) / 100)} = ${rp(hasil)}. Cara cepat: ${p1}% × ${p2}% = ${desimal((p1 * p2) / 100)}%, lalu kalikan ${rp(n)}.`,
  };
}

function pecahan(a) {
  const pembagi = a.pilih([4, 5, 8]), pembilang = a.int(1, pembagi - 1), x = pembagi * a.int(6, 15);
  const d = a.pilih([0.25, 0.5, 0.75, 1.5]), y = a.int(2, 9) * 4;
  const hasil = (pembilang / pembagi) * x + d * y;
  return {
    b: ARIT,
    q: `Hasil dari ${pembilang}/${pembagi} × ${x} + ${desimal(d)} × ${y} adalah…`,
    benar: desimal(hasil),
    pengecoh: [desimal(hasil + d), desimal((pembilang / pembagi) * (x + y)), desimal(hasil - pembilang), desimal(hasil * 2)],
    e: `${pembilang}/${pembagi} × ${x} = ${desimal((pembilang / pembagi) * x)} dan ${desimal(d)} × ${y} = ${desimal(d * y)}. Jumlahnya ${desimal(hasil)}. Kerjakan perkalian dulu, baru penjumlahan.`,
  };
}

function diskonGanda(a) {
  const h = a.int(10, 40) * 25000, p1 = a.pilih([20, 25, 30, 40]), p2 = a.pilih([10, 20, 25]);
  const bayar = h * (1 - p1 / 100) * (1 - p2 / 100);
  return {
    b: CERITA,
    q: `Sebuah laptop seharga Rp${rp(h)} mendapat diskon ${p1}% lalu diskon tambahan ${p2}% di kasir. Berapa harga yang dibayar?`,
    benar: `Rp${rp(bayar)}`,
    pengecoh: [`Rp${rp(h * (1 - (p1 + p2) / 100))}`, `Rp${rp(h * (1 - p1 / 100))}`, `Rp${rp(bayar + h * 0.05)}`, `Rp${rp(h - bayar)}`],
    e: `Diskon bertingkat TIDAK dijumlahkan menjadi ${p1 + p2}%. Setelah diskon ${p1}%: Rp${rp(h * (1 - p1 / 100))}. Diskon ${p2}% dihitung dari harga itu: Rp${rp(h * (1 - p1 / 100))} × ${100 - p2}% = Rp${rp(bayar)}. Total diskon efektif ${desimal(100 - (bayar / h) * 100)}%.`,
  };
}

function untungRugi(a) {
  const beli = a.int(8, 40) * 5000, p = a.pilih([10, 20, 25, 30, 40, 50]), untung = a.r() < 0.7;
  const jual = untung ? beli * (1 + p / 100) : beli * (1 - p / 100);
  return {
    b: CERITA,
    q: `Pedagang membeli barang seharga Rp${rp(beli)} dan menjualnya Rp${rp(jual)}. Berapa persen ${untung ? "keuntungannya" : "kerugiannya"} terhadap harga beli?`,
    benar: `${p}%`,
    pengecoh: [`${desimal((Math.abs(jual - beli) / jual) * 100)}%`, `${p + 5}%`, `${p - 5}%`, `${p * 2}%`],
    e: `Selisih = Rp${rp(Math.abs(jual - beli))}. Persentase dihitung terhadap HARGA BELI: ${rp(Math.abs(jual - beli))} ÷ ${rp(beli)} × 100% = ${p}%. Jebakan umum: membagi dengan harga jual.`,
  };
}

function rataRataHilang(a) {
  const n = a.int(4, 6), r1 = a.int(70, 82), r2 = r1 + a.pilih([1, 2, 3]);
  const x = r2 * (n + 1) - r1 * n;
  return {
    b: PELUANG,
    q: `Rata-rata nilai ${n} peserta tes adalah ${r1}. Setelah satu peserta lagi ikut, rata-ratanya menjadi ${r2}. Berapa nilai peserta tambahan itu?`,
    benar: x,
    pengecoh: [r2, x - (r2 - r1), x + n, r1 + r2],
    e: `Jumlah awal = ${n} × ${r1} = ${n * r1}. Jumlah akhir = ${n + 1} × ${r2} = ${(n + 1) * r2}. Nilai peserta baru = ${(n + 1) * r2} − ${n * r1} = ${x}.`,
  };
}

function kecepatanRataRata(a) {
  const [v1, v2] = a.pilih([[40, 60], [30, 60], [60, 90], [40, 80], [60, 40]]);
  const rata = (2 * v1 * v2) / (v1 + v2);
  return {
    b: CERITA,
    q: `Dina berangkat ke kantor dengan kecepatan rata-rata ${v1} km/jam dan pulang melalui jalan yang sama dengan ${v2} km/jam. Berapa kecepatan rata-rata untuk perjalanan pulang-pergi?`,
    benar: `${desimal(rata)} km/jam`,
    pengecoh: [`${desimal((v1 + v2) / 2)} km/jam`, `${Math.max(v1, v2)} km/jam`, `${desimal(rata + 4)} km/jam`, `${v1 + v2} km/jam`],
    e: `Kecepatan rata-rata = total jarak ÷ total waktu, BUKAN rata-rata kedua kecepatan. Misal jarak d: waktu = d/${v1} + d/${v2}. Rata-rata = 2d ÷ (d/${v1} + d/${v2}) = 2 × ${v1} × ${v2} ÷ (${v1} + ${v2}) = ${desimal(rata)} km/jam.`,
  };
}

function berpapasan(a) {
  const jarak = a.pilih([120, 150, 180, 210, 240]), v1 = a.pilih([40, 50, 60]), v2 = a.pilih([20, 30, 40]);
  const t = jarak / (v1 + v2);
  const menit = Math.round(t * 60);
  const jam = Math.floor(menit / 60), sisa = menit % 60;
  return {
    b: CERITA,
    q: `Kota P dan Q berjarak ${jarak} km. Mobil A berangkat dari P ke Q dengan ${v1} km/jam, dan pada saat yang sama mobil B berangkat dari Q ke P dengan ${v2} km/jam. Setelah berapa lama keduanya berpapasan?`,
    benar: `${jam} jam ${sisa} menit`,
    pengecoh: [`${Math.floor(jarak / v1)} jam ${Math.round(((jarak / v1) % 1) * 60)} menit`, `${jam + 1} jam ${sisa} menit`, `${jam} jam ${(sisa + 30) % 60} menit`, `${Math.floor(jarak / (v1 - v2 || 1))} jam`],
    e: `Bergerak saling mendekat → kecepatan dijumlahkan: ${v1} + ${v2} = ${v1 + v2} km/jam. Waktu = ${jarak} ÷ ${v1 + v2} = ${desimal(t)} jam = ${jam} jam ${sisa} menit.`,
  };
}

function kerjaBersama(a) {
  const [x, y, h] = a.pilih([[6, 12, 4], [10, 15, 6], [12, 24, 8], [20, 30, 12], [6, 3, 2], [15, 10, 6]]);
  return {
    b: CERITA,
    q: `Andi dapat menyelesaikan laporan dalam ${x} hari, sedangkan Budi dalam ${y} hari. Jika mereka bekerja bersama, laporan selesai dalam…`,
    benar: `${h} hari`,
    pengecoh: [`${(x + y) / 2} hari`, `${x + y} hari`, `${Math.abs(x - y) || h + 1} hari`, `${h + 2} hari`],
    e: `Dalam sehari Andi menyelesaikan 1/${x}, Budi 1/${y} bagian. Bersama: 1/${x} + 1/${y} = 1/${h}. Jadi waktu bersama ${h} hari. Rumus cepat: (${x} × ${y}) ÷ (${x} + ${y}) = ${h}.`,
  };
}

function perbandingan(a) {
  const p = a.int(2, 5), q = p + a.int(1, 4), k = a.int(5, 20) * 10000;
  const total = (p + q) * k;
  return {
    b: PERBANDINGAN,
    q: `Bonus Rp${rp(total)} dibagi kepada Rani dan Sari dengan perbandingan ${p} : ${q}. Berapa selisih bonus mereka?`,
    benar: `Rp${rp((q - p) * k)}`,
    pengecoh: [`Rp${rp(p * k)}`, `Rp${rp(q * k)}`, `Rp${rp(total / 2)}`, `Rp${rp((q - p) * k * 2)}`],
    e: `Total bagian = ${p} + ${q} = ${p + q}. Satu bagian = Rp${rp(total)} ÷ ${p + q} = Rp${rp(k)}. Selisih = (${q} − ${p}) × Rp${rp(k)} = Rp${rp((q - p) * k)}.`,
  };
}

function perbandinganBerbalik(a) {
  const orang = a.pilih([6, 8, 10, 12]), hari = a.pilih([12, 15, 18, 20]), tambah = a.pilih([2, 4, 6]);
  const baru = (orang * hari) / (orang + tambah);
  const hasil = Number.isInteger(baru) ? baru : Math.round(baru * 10) / 10;
  return {
    b: PERBANDINGAN,
    q: `Sebuah proyek dikerjakan ${orang} orang dalam ${hari} hari. Jika ditambah ${tambah} orang dengan kemampuan sama, proyek selesai dalam berapa hari?`,
    benar: `${desimal(hasil)} hari`,
    pengecoh: [`${hari - tambah} hari`, `${desimal((hari * (orang + tambah)) / orang)} hari`, `${desimal(hasil + 2)} hari`, `${hari / 2} hari`],
    e: `Jumlah pekerja dan waktu berbanding TERBALIK (pekerja bertambah, waktu berkurang). Total pekerjaan = ${orang} × ${hari} = ${orang * hari} orang-hari. Dibagi ${orang + tambah} orang = ${desimal(hasil)} hari.`,
  };
}

function peluang(a) {
  const m = a.int(3, 6), bi = a.int(2, 6), total = m + bi;
  const pembilang = m * (m - 1), penyebut = total * (total - 1);
  const fpb = (x, y) => (y ? fpb(y, x % y) : x);
  const g = fpb(pembilang, penyebut);
  return {
    b: PELUANG,
    q: `Dalam kotak terdapat ${m} bola merah dan ${bi} bola biru. Dua bola diambil satu per satu TANPA pengembalian. Berapa peluang keduanya merah?`,
    benar: `${pembilang / g}/${penyebut / g}`,
    pengecoh: [`${m * m}/${total * total}`, `${m}/${total}`, `${2 * m}/${total * 2 + 1}`, `${(m - 1)}/${total}`],
    e: `Ambilan pertama merah: ${m}/${total}. Karena tidak dikembalikan, ambilan kedua merah: ${m - 1}/${total - 1}. Peluang = ${m}/${total} × ${m - 1}/${total - 1} = ${pembilang}/${penyebut} = ${pembilang / g}/${penyebut / g}.`,
  };
}

function bungaTunggal(a) {
  const modal = a.pilih([5, 8, 10, 12, 20]) * 1000000, p = a.pilih([6, 8, 9, 12]), bulan = a.pilih([3, 6, 8, 9]);
  const bunga = (modal * p * bulan) / 1200;
  return {
    b: CERITA,
    q: `Tabungan Rp${rp(modal)} mendapat bunga tunggal ${p}% per tahun. Berapa total saldo setelah ${bulan} bulan?`,
    benar: `Rp${rp(modal + bunga)}`,
    pengecoh: [`Rp${rp(modal + (modal * p) / 100)}`, `Rp${rp(bunga)}`, `Rp${rp(modal + bunga * 2)}`, `Rp${rp(modal + (modal * p * bulan) / 100)}`],
    e: `Bunga = modal × persen × (bulan/12) = ${rp(modal)} × ${p}% × ${bulan}/12 = Rp${rp(bunga)}. Saldo = Rp${rp(modal)} + Rp${rp(bunga)} = Rp${rp(modal + bunga)}.`,
  };
}

const GENERATOR = [deretTingkatDua, deretSelang, deretFibonacci, deretKaliTambah, persenBertingkat, pecahan, diskonGanda, untungRugi, rataRataHilang, kecepatanRataRata, berpapasan, kerjaBersama, perbandingan, perbandinganBerbalik, peluang, bungaTunggal];

/**
 * Pengecoh cadangan bila pengecoh bawaan ada yang kembar dengan kunci.
 * Mengubah angka pertama di jawaban dengan format yang sama.
 */
function pengecohCadangan(benar) {
  const teks = String(benar);
  const m = teks.match(/\d[\d.]*(,\d+)?/);
  if (!m) return [];
  const bersih = m[0].replace(/\./g, "").replace(",", ".");
  const v = Number(bersih);
  if (!Number.isFinite(v)) return [];
  const ribuan = m[0].includes(".") && !m[0].includes(",");
  const besar = v >= 1000;
  const geser = besar ? [1.1, 0.9, 1.2, 0.8, 1.25] : [1, -1, 2, -2, 3];
  return geser.map((g) => {
    let n = besar ? Math.round((v * g) / 1000) * 1000 : v + g;
    if (n < 0) n = v + 4;
    const tampil = ribuan || besar ? n.toLocaleString("id-ID") : String(Math.round(n * 100) / 100).replace(".", ",");
    return teks.slice(0, m.index) + tampil + teks.slice(m.index + m[0].length);
  });
}

/** n soal numerik, jenis bergantian supaya bervariasi. */
export function soalNumerikHots(acak, n, susunPilihan) {
  const hasil = [];
  const sudah = new Set();
  const urut = acak.kocok(GENERATOR);
  for (let i = 0, coba = 0; hasil.length < n && coba < n * 20; coba++, i++) {
    const g = urut[i % urut.length];
    const s = g(acak);
    if (sudah.has(s.q)) continue;
    sudah.add(s.q);
    let pilihan = susunPilihan(acak, s.benar, s.pengecoh);
    if (pilihan.o.length < 4) pilihan = susunPilihan(acak, s.benar, [...new Set([...s.pengecoh.map(String), ...pengecohCadangan(s.benar)])]);
    hasil.push({ q: s.q, ...pilihan, e: s.e, bagian: s.b });
  }
  return hasil;
}

export const TIPS_NUMERIK = [
  "Deret: tulis selisih antarsuku di bawah deret. Jika selisihnya belum berpola, cek selisih dari selisih (tingkat dua), deret berselang-seling, atau pola kali-tambah.",
  "Diskon bertingkat tidak dijumlahkan: 30% + 20% = 44% efektif, bukan 50%.",
  "Untung/rugi selalu dibandingkan dengan harga BELI, kecuali soal menyebut lain.",
  "Kecepatan rata-rata pulang-pergi = 2 × v1 × v2 ÷ (v1 + v2), bukan (v1 + v2) ÷ 2.",
  "Kerja bersama: jumlahkan kecepatan kerja per hari (1/x + 1/y), bukan jumlah harinya.",
  "Eliminasi pilihan yang jelas tidak masuk akal (mis. waktu bersama lebih lama dari yang tercepat) sebelum menghitung detail.",
];
