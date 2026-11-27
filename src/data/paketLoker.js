/**
 * Paket kredit pasang loker untuk pemberi kerja (tampilan).
 * Harga pembayaran diambil server dari supabase/functions/_shared/paketLoker.ts,
 * jadi ubah KEDUA file bila harga berubah.
 *
 * Saat ini Rp10.000 per loker untuk semua paket. Isi `hemat` (persen) pada
 * paket bila nanti ingin memberi potongan; teks "hemat X%" otomatis tampil.
 */
import { t } from "../i18n.js";

export const MASA_TAYANG_HARI = 30;

export const PAKET_LOKER = [
  {
    id: "satu",
    nama: t("1 Loker", "1 Job post"),
    kredit: 1,
    harga: 10000,
    ket: t("Untuk satu posisi yang ingin segera terisi", "For a single role you need filled"),
  },
  {
    id: "lima",
    nama: t("Paket 5 Loker", "5 Job posts"),
    kredit: 5,
    harga: 50000,
    populer: true,
    ket: t("Untuk beberapa posisi sekaligus", "For several roles at once"),
  },
  {
    id: "lima_belas",
    nama: t("Paket 15 Loker", "15 Job posts"),
    kredit: 15,
    harga: 150000,
    ket: t("Untuk rekrutmen rutin atau agensi", "For ongoing hiring or agencies"),
  },
];

export const FITUR_LOKER = [
  t(`Tayang ${MASA_TAYANG_HARI} hari sebagai loker prioritas`, `Live for ${MASA_TAYANG_HARI} days as a priority job`),
  t("Tampil paling atas di pencarian yang cocok", "Shown first in matching searches"),
  t("Masuk bagian Loker prioritas di beranda", "Featured in the homepage Priority jobs section"),
  t("Label Prioritas dan logo perusahaan", "Priority label and your company logo"),
  t("Statistik dilihat dan klik lamar", "View and apply-click statistics"),
];

export const rupiah = (n) => `Rp${Number(n || 0).toLocaleString("id-ID")}`;

/** Teks harga per loker di bawah harga paket. */
export const ketHargaPaket = (p) => {
  const per = rupiah(Math.round(p.harga / p.kredit));
  if (p.kredit === 1) return t("per loker", "per post");
  return p.hemat
    ? t(`${per} per loker · hemat ${p.hemat}%`, `${per} per post · save ${p.hemat}%`)
    : t(`${p.kredit} loker × ${per}`, `${p.kredit} posts × ${per}`);
};
