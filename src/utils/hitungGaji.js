/**
 * Perhitungan Kalkulator Gaji: gaji mata uang asing → rupiah per periode,
 * dikurangi potongan platform dan biaya transfer.
 *
 * Semua periode diturunkan dari angka TAHUNAN:
 *   per tahun = 52 minggu = 12 bulan; per minggu = 5 hari kerja;
 *   per jam   = per minggu ÷ jam kerja per minggu.
 * Pajak penghasilan sengaja tidak dihitung — tarifnya bergantung pada
 * status dan total penghasilan masing-masing orang.
 */

export const PERIODE = [
  { id: "jam", label: "Per jam" },
  { id: "hari", label: "Per hari" },
  { id: "minggu", label: "Per minggu" },
  { id: "bulan", label: "Per bulan" },
  { id: "tahun", label: "Per tahun" },
];

export const MATA_UANG = [
  { kode: "USD", nama: "Dolar AS" },
  { kode: "SGD", nama: "Dolar Singapura" },
  { kode: "AUD", nama: "Dolar Australia" },
  { kode: "EUR", nama: "Euro" },
  { kode: "GBP", nama: "Pound Inggris" },
  { kode: "MYR", nama: "Ringgit Malaysia" },
];

/** Ubah nominal di satu periode menjadi nominal tahunan. */
export function keTahunan(jumlah, periode, jamPerMinggu = 40) {
  const x = Number(jumlah) || 0;
  const jam = Math.max(1, Number(jamPerMinggu) || 40);
  switch (periode) {
    case "jam":
      return x * jam * 52;
    case "hari":
      return x * 5 * 52;
    case "minggu":
      return x * 52;
    case "bulan":
      return x * 12;
    default:
      return x;
  }
}

/** Nominal tahunan → nominal per periode. */
export function dariTahunan(tahunan, periode, jamPerMinggu = 40) {
  const jam = Math.max(1, Number(jamPerMinggu) || 40);
  switch (periode) {
    case "jam":
      return tahunan / 52 / jam;
    case "hari":
      return tahunan / 52 / 5;
    case "minggu":
      return tahunan / 52;
    case "bulan":
      return tahunan / 12;
    default:
      return tahunan;
  }
}

/**
 * Hitung lengkap.
 * @returns {{ tahunanAsing, rincianBulan: {kotor, platform, transfer, bersih}, baris: [...] }}
 */
export function hitungGaji({ jumlah, periode, jamPerMinggu, kurs, potonganPlatform = 0, biayaTransfer = 0 }) {
  const tahunanAsing = keTahunan(jumlah, periode, jamPerMinggu);
  const k = Number(kurs) || 0;
  const pPlat = Math.min(100, Math.max(0, Number(potonganPlatform) || 0)) / 100;
  const pTrans = Math.min(100, Math.max(0, Number(biayaTransfer) || 0)) / 100;

  // Urutan potongan: platform memotong dulu, sisanya baru ditransfer
  const faktorBersih = (1 - pPlat) * (1 - pTrans);

  const bulanKotor = dariTahunan(tahunanAsing, "bulan") * k;
  const potPlat = bulanKotor * pPlat;
  const potTrans = (bulanKotor - potPlat) * pTrans;

  const baris = PERIODE.map((p) => {
    const asing = dariTahunan(tahunanAsing, p.id, jamPerMinggu);
    return {
      ...p,
      asing,
      kotorIdr: asing * k,
      bersihIdr: asing * k * faktorBersih,
    };
  });

  return {
    tahunanAsing,
    rincianBulan: {
      kotor: bulanKotor,
      platform: potPlat,
      transfer: potTrans,
      bersih: bulanKotor - potPlat - potTrans,
    },
    baris,
  };
}

export function formatAsing(n, kode) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "-";
  return `${kode} ${v.toLocaleString("en-US", { maximumFractionDigits: v < 100 ? 2 : 0 })}`;
}
