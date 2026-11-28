// @ts-nocheck
/**
 * Paket kredit pasang loker untuk pemberi kerja (harga server).
 * 1 kredit = 1 loker prioritas tayang 30 hari.
 *
 * Samakan dengan src/data/paketLoker.js (tampilan). Harga yang dipakai
 * pembayaran selalu dari file ini, bukan dari browser.
 */
export const PAKET_LOKER: Record<string, { id: string; nama: string; kredit: number; harga: number }> = {
  satu: { id: "satu", nama: "1 Loker", kredit: 1, harga: 35000 },
  lima: { id: "lima", nama: "Paket 5 Loker", kredit: 5, harga: 170000 },
  sepuluh: { id: "sepuluh", nama: "Paket 10 Loker", kredit: 10, harga: 325000 },
};
