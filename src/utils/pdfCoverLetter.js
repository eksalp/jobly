import { jsPDF } from "jspdf";
import { bacaGaya, hexKeRgb, pasangFontPdf } from "../data/cvGaya";
import { susunSurat, UKURAN_CL } from "../data/coverLetter";


/** Buat PDF cover letter dan unduh. */
export async function unduhCoverLetter(d) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const { font, aksen } = bacaGaya(d.gaya);
  const F = await pasangFontPdf(doc, font);
  const k = font.skala || 1;
  const AKS = hexKeRgb(aksen.hex);
  const U = UKURAN_CL;
  const pageW = 210;
  const lebar = pageW - U.margin * 2;
  const BATAS = 297 - U.margin;
  let y = U.margin + 4;

  doc.setProperties({
    title: `Cover Letter ${d.nama || ""}`.trim(),
    subject: d.posisi ? `Lamaran ${d.posisi}` : "Cover Letter",
    creator: "Jobly Cover Letter Builder",
  });

  const safe = font.file
    ? (tt) => String(tt || "").replace(/[^\x00-\xFF–—‘’“”•…€]/g, "")
    : (tt) =>
        String(tt || "").replace(/[^\x00-\xFF]/g, (c) => ({ "–": "-", "—": "-", "‘": "'", "’": "'", "“": '"', "”": '"', "…": "..." })[c] || "");

  const halamanBaru = () => {
    doc.addPage();
    y = U.margin + 4;
  };
  const pakai = (ukuran, tebal = false, warna = [25, 25, 25]) => {
    doc.setFontSize(ukuran * k);
    doc.setFont(F, tebal ? "bold" : "normal");
    doc.setTextColor(...warna);
  };

  const rata = (baris, x, yy, lb) => {
    const kata = baris.split(/\s+/).filter(Boolean);
    if (kata.length < 2) return doc.text(baris, x, yy);
    const lk = kata.map((w) => doc.getTextWidth(w));
    const celah = (lb - lk.reduce((a, b) => a + b, 0)) / (kata.length - 1);
    const spasi = doc.getTextWidth(" ") || 1;
    if (celah <= 0 || celah > spasi * 2.5) return doc.text(baris, x, yy);
    let px = x;
    kata.forEach((w, i) => {
      doc.text(w, px, yy);
      px += lk[i] + celah;
    });
  };

  for (const b of susunSurat(d)) {
    if (b.t === "jarak") {
      y += b.n;
      continue;
    }
    if (b.t === "garis") {
      doc.setDrawColor(...AKS);
      doc.setLineWidth(0.5);
      doc.line(U.margin, y, pageW - U.margin, y);
      y += 1;
      continue;
    }
    if (b.t === "judul") {
      pakai(U.judul, true, AKS);
      doc.text(safe(b.teks), U.margin, y + 4);
      y += 10;
      continue;
    }
    if (b.t === "kecil") {
      pakai(U.kecil, false, [85, 85, 85]);
      doc.splitTextToSize(safe(b.teks), lebar).forEach((l) => {
        doc.text(l, U.margin, y);
        y += 4.4;
      });
      continue;
    }
    if (b.t === "baris") {
      pakai(U.isi, b.tebal);
      const teks = safe(b.teks);
      if (teks.includes("\t")) {
        const [label, isi] = teks.split("\t");
        doc.text(label, U.margin, y);
        const baris = doc.splitTextToSize(isi, lebar - U.label);
        baris.forEach((l, i) => {
          doc.text(l, U.margin + U.label, y + i * U.baris);
        });
        y += U.baris * baris.length;
        continue;
      }
      if (b.kanan) {
        doc.text(teks, pageW - U.margin, y, { align: "right" });
        y += U.baris;
        continue;
      }
      doc.splitTextToSize(teks, lebar).forEach((l) => {
        if (y > BATAS) halamanBaru();
        doc.text(l, U.margin, y);
        y += U.baris;
      });
      continue;
    }
    if (b.t === "paragraf") {
      pakai(U.isi);
      const baris = doc.splitTextToSize(safe(b.teks), lebar);
      baris.forEach((l, i) => {
        if (y > BATAS) halamanBaru();
        if (i < baris.length - 1) rata(l, U.margin, y, lebar);
        else doc.text(l, U.margin, y);
        y += U.baris;
      });
    }
  }

  const bersih = (s) => (s || "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_");
  const nama = ["CoverLetter", bersih(d.nama), bersih(d.posisi)].filter(Boolean).join("_");
  doc.save(`${nama || "CoverLetter"}.pdf`);
}
