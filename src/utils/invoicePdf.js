/**
 * Invoice PDF untuk pembelian kredit pasang loker (pemberi kerja).
 * Dibuat di browser dari baris pembelian_kredit yang sudah lunas.
 */
import { jsPDF } from "jspdf";
import { SITUS } from "../data/situs";
import { PAKET_LOKER, MASA_TAYANG_HARI } from "../data/paketLoker";

const rp = (n) => `Rp${Number(n || 0).toLocaleString("id-ID")}`;
const tglPanjang = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const tgl = d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
  const jam = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
  return `${tgl}, ${jam} WIB`;
};

const METODE = {
  qris: "QRIS",
  gopay: "GoPay",
  shopeepay: "ShopeePay",
  bank_transfer: "Transfer bank (virtual account)",
  echannel: "Mandiri Bill",
  credit_card: "Kartu kredit",
  cstore: "Gerai retail",
};

/** Logo Workly (SVG di /public) diubah menjadi PNG untuk ditempel ke PDF. */
async function logoPng() {
  try {
    const img = await new Promise((ok, gagal) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = gagal;
      i.src = "/logo-workly-w.svg";
    });
    const c = document.createElement("canvas");
    c.width = 240;
    c.height = 240;
    c.getContext("2d").drawImage(img, 0, 0, 240, 240);
    return c.toDataURL("image/png");
  } catch {
    return null; // tanpa logo, invoice tetap dibuat
  }
}

/**
 * @param {object} b  baris pembelian_kredit (status paid)
 * @param {object} pt baris perusahaan
 * @param {string} email email akun perusahaan
 */
export async function unduhInvoice(b, pt, email) {
  const logo = await logoPng();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const kiri = 18;
  const kanan = W - 18;
  const biru = [11, 60, 110];
  const abu = [107, 118, 133];
  const tinta = [17, 27, 41];
  const paket = PAKET_LOKER.find((p) => p.id === b.paket);
  const PAKET_LAMA = { lima_belas: "Paket 15 Loker" };
  const namaPaket = paket ? paket.nama : PAKET_LAMA[b.paket] || b.paket;
  const noInvoice = b.no_invoice || b.order_id;

  // ---------------------------------------------------------------- kepala
  doc.setFillColor(...biru);
  doc.rect(0, 0, W, 4, "F");
  const xNama = logo ? kiri + 15 : kiri;
  if (logo) doc.addImage(logo, "PNG", kiri - 1, 13.5, 14, 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...tinta);
  doc.text(SITUS.nama || "Workly", xNama, 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...abu);
  doc.text("workly.id", xNama, 30);
  if (SITUS.emailKontak) doc.text(SITUS.emailKontak, xNama, 35);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...tinta);
  doc.text("INVOICE", kanan, 24, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(...abu);
  doc.setFont("helvetica", "normal");
  doc.text(noInvoice, kanan, 30, { align: "right" });

  // Cap LUNAS
  doc.setDrawColor(22, 163, 74);
  doc.setTextColor(22, 163, 74);
  doc.setLineWidth(0.6);
  doc.roundedRect(kanan - 30, 34, 30, 9, 2, 2, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("LUNAS", kanan - 15, 40.3, { align: "center" });

  // ---------------------------------------------------- pihak & rincian
  let y = 56;
  const label = (teks, x, yy) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...abu);
    doc.text(teks.toUpperCase(), x, yy);
  };
  const isi = (baris, x, yy, opsi = {}) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...tinta);
    baris.filter(Boolean).forEach((t, i) => {
      if (i === 0 && opsi.tebal) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(doc.splitTextToSize(String(t), opsi.lebar || 80), x, yy + i * 5.2);
    });
  };

  label("Ditagihkan kepada", kiri, y);
  isi([pt?.nama, pt?.kontak_nama ? `u.p. ${pt.kontak_nama}` : null, email, pt?.kota, pt?.situs], kiri, y + 6, { tebal: true });

  const xKanan = 118;
  label("Rincian pembayaran", xKanan, y);
  const rincian = [
    ["Tanggal bayar", tglPanjang(b.dibayar_at)],
    ["Tanggal pesanan", tglPanjang(b.dibuat_at)],
    ["Metode", METODE[b.metode] || (b.metode ? b.metode : "QRIS / Midtrans")],
    ["ID transaksi", b.transaksi_id || "-"],
    ["Nomor pesanan", b.order_id],
  ];
  let yR = y + 6;
  rincian.forEach(([k, v]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...abu);
    doc.text(k, xKanan, yR);
    doc.setTextColor(...tinta);
    const teks = doc.splitTextToSize(String(v), kanan - xKanan - 26);
    teks.forEach((baris, i) => doc.text(baris, kanan, yR + i * 4.2, { align: "right" }));
    yR += 5.4 + (teks.length - 1) * 4.2;
  });

  // ------------------------------------------------------------- tabel
  y = Math.max(100, yR + 6);
  doc.setFillColor(244, 246, 251);
  doc.rect(kiri, y, kanan - kiri, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...abu);
  doc.text("DESKRIPSI", kiri + 3, y + 6);
  doc.text("QTY", 128, y + 6, { align: "center" });
  doc.text("HARGA", 158, y + 6, { align: "right" });
  doc.text("JUMLAH", kanan - 3, y + 6, { align: "right" });

  y += 16;
  doc.setTextColor(...tinta);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(`${namaPaket}`, kiri + 3, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...abu);
  const ket = doc.splitTextToSize(
    `${b.kredit} kredit pasang loker prioritas di Workly. 1 kredit = 1 loker tayang ${MASA_TAYANG_HARI} hari setelah disetujui. Kredit tidak hangus.`,
    92,
  );
  doc.text(ket, kiri + 3, y + 5);
  doc.setFontSize(10);
  doc.setTextColor(...tinta);
  doc.text("1", 128, y, { align: "center" });
  doc.text(rp(b.harga), 158, y, { align: "right" });
  doc.text(rp(b.harga), kanan - 3, y, { align: "right" });

  y += 8 + ket.length * 4.4;
  doc.setDrawColor(227, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(kiri, y, kanan, y);

  // ------------------------------------------------------------- total
  y += 8;
  const baris = (k, v, tebal = false) => {
    doc.setFont("helvetica", tebal ? "bold" : "normal");
    doc.setFontSize(tebal ? 12 : 10);
    doc.setTextColor(...(tebal ? tinta : abu));
    doc.text(k, 140, y);
    doc.setTextColor(...tinta);
    doc.text(v, kanan - 3, y, { align: "right" });
    y += tebal ? 8 : 6;
  };
  baris("Subtotal", rp(b.harga));
  doc.line(136, y - 2, kanan, y - 2);
  y += 3;
  baris("Total dibayar", rp(b.harga), true);

  // ----------------------------------------------------------- catatan
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...abu);
  const catatan = doc.splitTextToSize(
    "Invoice ini diterbitkan secara elektronik dan sah tanpa tanda tangan. Pembayaran diproses oleh Midtrans. " +
      "Simpan invoice ini sebagai bukti pembelian.",
    kanan - kiri,
  );
  doc.text(catatan, kiri, y);

  doc.setFontSize(8);
  doc.text(`${SITUS.nama || "Workly"} · workly.id`, W / 2, 287, { align: "center" });

  const aman = String(noInvoice).replace(/[^A-Za-z0-9-]+/g, "-");
  doc.save(`Invoice-${aman}.pdf`);
}
