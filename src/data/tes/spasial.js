/**
 * Tes spasial: membedakan bangun yang DIPUTAR dengan yang DICERMINKAN.
 *
 * Bangun berupa susunan kotak (polyomino) acak yang asimetris, sehingga
 * hasil putaran dan hasil cerminannya selalu berbeda. Gambar disimpan
 * sebagai string "x,y;x,y;…" dan digambar oleh komponen <Grid>.
 */

const SPASIAL = "Spasial";

const norm = (sel) => {
  const minX = Math.min(...sel.map((c) => c[0]));
  const minY = Math.min(...sel.map((c) => c[1]));
  return sel.map(([x, y]) => [x - minX, y - minY]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};
export const kodeGrid = (sel) => norm(sel).map((c) => c.join(",")).join(";");
export const bacaGrid = (kode) => String(kode).split(";").map((p) => p.split(",").map(Number));

const putar = (sel) => sel.map(([x, y]) => [-y, x]); // 90° searah jarum jam (sumbu y ke bawah)
const cermin = (sel) => sel.map(([x, y]) => [-x, y]);

function rotasi(sel) {
  const hasil = [norm(sel)];
  for (let i = 1; i < 4; i++) hasil.push(norm(putar(hasil[i - 1])));
  return hasil;
}

/** Bangun acak 6–7 kotak yang tidak simetris sama sekali. */
function bangunAcak(acak) {
  for (let coba = 0; coba < 200; coba++) {
    const n = acak.int(6, 7);
    const sel = [[0, 0]];
    const ada = new Set(["0,0"]);
    while (sel.length < n) {
      const [x, y] = acak.pilih(sel);
      const [dx, dy] = acak.pilih([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      const k = `${x + dx},${y + dy}`;
      if (!ada.has(k)) {
        ada.add(k);
        sel.push([x + dx, y + dy]);
      }
    }
    const b = norm(sel);
    const w = Math.max(...b.map((c) => c[0])) + 1;
    const h = Math.max(...b.map((c) => c[1])) + 1;
    if (w > 4 || h > 4) continue;
    const rot = rotasi(b).map(kodeGrid);
    const cer = rotasi(cermin(b)).map(kodeGrid);
    if (new Set(rot).size !== 4) continue; // punya simetri putar
    if (cer.some((c) => rot.includes(c))) continue; // simetri cermin
    return b;
  }
  return null;
}

const SUDUT = ["0°", "90°", "180°", "270°"];

function soalPutar(acak) {
  const b = bangunAcak(acak);
  const rot = rotasi(b);
  const cer = rotasi(cermin(b));
  const k = acak.int(1, 3);
  const pengecoh = acak.kocok([0, 1, 2, 3]).slice(0, 3).map((i) => kodeGrid(cer[i]));
  return {
    q: "Manakah gambar yang merupakan gambar di atas setelah DIPUTAR (bukan dicerminkan)?",
    contoh: kodeGrid(b),
    benar: kodeGrid(rot[k]),
    pengecoh,
    e: `Jawaban yang benar adalah gambar asli diputar ${SUDUT[k]} searah jarum jam. Tiga pilihan lain adalah bayangan cermin yang ikut diputar, sehingga posisi tonjolannya terbalik kiri-kanan. Cara cepat: pilih satu kotak ujung yang khas, lalu ikuti arah putarnya.`,
  };
}

function soalBukan(acak) {
  const b = bangunAcak(acak);
  const rot = rotasi(b);
  const cer = rotasi(cermin(b));
  const pengecoh = acak.kocok([0, 1, 2, 3]).slice(0, 3).map((i) => kodeGrid(rot[i]));
  return {
    q: "Tiga pilihan adalah gambar di atas yang diputar. Manakah yang BUKAN hasil putaran (melainkan cerminan)?",
    contoh: kodeGrid(b),
    benar: kodeGrid(cer[acak.int(0, 3)]),
    pengecoh,
    e: "Tiga pilihan lain bisa diperoleh dengan memutar gambar asli. Jawaban yang benar hanya bisa diperoleh dengan membaliknya seperti di cermin, jadi tidak mungkin didapat dengan memutar saja.",
  };
}

export function soalSpasial(acak, n, susunPilihan) {
  const hasil = [];
  const sudah = new Set();
  for (let i = 0; hasil.length < n && i < n * 20; i++) {
    const s = (i % 3 === 2 ? soalBukan : soalPutar)(acak);
    if (!s.contoh || sudah.has(s.contoh)) continue;
    sudah.add(s.contoh);
    hasil.push({ q: s.q, grid: true, contoh: s.contoh, ...susunPilihan(acak, s.benar, s.pengecoh), e: s.e, bagian: SPASIAL });
  }
  return hasil;
}

export const TIPS_SPASIAL = [
  "Putaran tidak mengubah 'arah tangan' sebuah bangun; cerminan mengubahnya. Bayangkan bangun itu sebagai huruf L atau F: setelah diputar tetap terbaca benar, setelah dicerminkan terbaca terbalik.",
  "Pilih satu ciri khas (mis. tonjolan satu kotak di ujung), lalu ikuti posisinya relatif terhadap bagian terpanjang.",
  "Jangan memutar seluruh gambar di kepala sekaligus. Putar 90° satu kali, cocokkan, lalu putar lagi bila perlu.",
  "Jika dua pilihan tampak sama-sama benar, salah satunya hampir pasti cerminan. Periksa ulang sisi kiri dan kanannya.",
];
