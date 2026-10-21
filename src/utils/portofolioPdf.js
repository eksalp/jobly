/**
 * Menyusun PDF portofolio dari proyek yang dikerjakan pengguna.
 *
 *   buatPdfPortofolio({ profil, proyek: [{ proyek, data }] })  → Blob
 *
 * Satu halaman sampul, lalu setiap proyek dimulai di halaman baru dan
 * disusun sebagai studi kasus: ringkasan, gambar utama, tantangan &
 * brief, peran, proses, hasil & dampak, galeri, hasil kerja lengkap,
 * revisi klien, pelajaran, dan daftar periksa.
 *
 * Setiap halaman diberi keterangan "Proyek latihan di Jobly" supaya
 * jelas bahwa ini studi kasus latihan, bukan pengalaman kerja dengan
 * klien sungguhan.
 */
import { jsPDF } from "jspdf";
import { pasangFontPdf } from "../data/cvGaya.js";
import { tabelTerisi } from "../data/portofolio.js";
import { t, lokal } from "../i18n.js";

const AKSEN = [20, 84, 154];
const TINTA = [26, 32, 44];
const ABU = [104, 114, 130];
const GARIS = [213, 219, 229];
const LATAR = [240, 245, 251];

const M = 18; // margin
const LEBAR = 210;
const ISI = LEBAR - M * 2;
const BAWAH = 280;

// Lato memuat huruf Latin dan tanda baca umum. Karakter lain diganti.
const aman = (s) =>
  String(s ?? "")
    .replace(/\r/g, "")
    .replace(/[→⟶]/g, "->")
    .replace(/[←]/g, "<-")
    .replace(/[✓✔]/g, "v")
    .replace(/[^\x00-\xFF–—‘’“”•…€]/g, "");

export async function buatPdfPortofolio({ profil = {}, proyek = [] }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let F = "helvetica";
  try {
    F = await pasangFontPdf(doc, { file: "lato" });
  } catch {
    /* font gagal dimuat: pakai font bawaan */
  }
  const tulisAman = F === "helvetica" ? (s) => aman(s).replace(/[^\x00-\x7F•]/g, "") : aman;

  const nama = profil.nama || t("Nama Lengkap", "Full Name");
  doc.setProperties({ title: `${t("Portofolio", "Portfolio")} ${nama}`, creator: "Jobly", subject: t("Portofolio proyek latihan", "Practice project portfolio") });

  let y = M;
  let halamanProyek = "";

  const huruf = (ukuran, tebal = false, warna = TINTA) => {
    doc.setFont(F, tebal ? "bold" : "normal");
    doc.setFontSize(ukuran);
    doc.setTextColor(...warna);
  };

  const kaki = () => {
    const n = doc.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      doc.setDrawColor(...GARIS);
      doc.setLineWidth(0.2);
      doc.line(M, 287, LEBAR - M, 287);
      huruf(7.5, false, ABU);
      doc.text(tulisAman(t("Proyek latihan berbasis studi kasus di Jobly · jobly.my.id", "Case-study practice project on Jobly · jobly.my.id")), M, 291.5);
      doc.text(`${i} / ${n}`, LEBAR - M, 291.5, { align: "right" });
    }
  };

  const halamanBaru = () => {
    doc.addPage();
    y = M;
    if (halamanProyek) {
      huruf(8, false, ABU);
      doc.text(tulisAman(halamanProyek), M, y);
      y += 7;
    }
  };

  const pastikan = (tinggi) => {
    if (y + tinggi > BAWAH) halamanBaru();
  };

  /** Paragraf dengan pemecahan baris dan halaman otomatis. */
  const paragraf = (teks, { ukuran = 10, tebal = false, warna = TINTA, indent = 0, jarak = 4.9, sesudah = 2 } = {}) => {
    huruf(ukuran, tebal, warna);
    const blok = tulisAman(teks).split("\n");
    blok.forEach((b) => {
      if (!b.trim()) {
        y += jarak * 0.6;
        return;
      }
      const baris = doc.splitTextToSize(b, ISI - indent);
      baris.forEach((l) => {
        pastikan(jarak);
        doc.text(l, M + indent, y);
        y += jarak;
      });
    });
    y += sesudah;
  };

  const judulBagian = (teks) => {
    // Judul tidak boleh tertinggal sendirian di bawah halaman
    pastikan(30);
    y += 3;
    huruf(8.5, true, AKSEN);
    doc.text(tulisAman(teks.toUpperCase()), M, y, { charSpace: 0.4 });
    y += 2;
    doc.setDrawColor(...AKSEN);
    doc.setLineWidth(0.5);
    doc.line(M, y, M + 12, y);
    y += 5.5;
  };

  /** Kotak berlatar untuk kutipan pesan klien. */
  const kotakPesan = (kepala, teks) => {
    huruf(9.5);
    const baris = tulisAman(teks)
      .split("\n")
      .flatMap((b) => (b.trim() ? doc.splitTextToSize(b, ISI - 10) : [""]));
    const tinggiBaris = 4.6;
    let i = 0;
    let pertama = true;
    while (i < baris.length) {
      pastikan(18);
      const muat = Math.max(1, Math.floor((BAWAH - y - 10 - (pertama ? 6 : 0)) / tinggiBaris));
      const potong = baris.slice(i, i + muat);
      const tinggi = potong.length * tinggiBaris + 6 + (pertama ? 6 : 0);
      doc.setFillColor(...LATAR);
      doc.setDrawColor(...LATAR);
      doc.roundedRect(M, y - 4, ISI, tinggi, 2, 2, "F");
      doc.setFillColor(...AKSEN);
      doc.rect(M, y - 4, 1.2, tinggi, "F");
      let yy = y + 0.5;
      if (pertama && kepala) {
        huruf(8.5, true, AKSEN);
        doc.text(tulisAman(kepala), M + 5, yy);
        yy += 6;
      }
      huruf(9.5);
      potong.forEach((l) => {
        doc.text(l, M + 5, yy);
        yy += tinggiBaris;
      });
      y += tinggi + 2;
      i += muat;
      pertama = false;
      if (i < baris.length) halamanBaru();
    }
  };

  const daftarButir = (butir, { nomor = false } = {}) => {
    butir.forEach((b, i) => {
      huruf(10);
      const tanda = nomor ? `${i + 1}.` : "•";
      const baris = doc.splitTextToSize(tulisAman(b), ISI - 7);
      pastikan(baris.length * 4.9);
      doc.text(tanda, M + 1, y);
      baris.forEach((l) => {
        doc.text(l, M + 7, y);
        y += 4.9;
      });
      y += 1;
    });
    y += 1;
  };

  const kotakCentang = (butir, cek) => {
    butir.forEach((b, i) => {
      huruf(10);
      const baris = doc.splitTextToSize(tulisAman(b), ISI - 8);
      pastikan(baris.length * 4.9 + 1);
      doc.setDrawColor(...(cek[i] ? AKSEN : GARIS));
      doc.setLineWidth(0.35);
      doc.roundedRect(M + 0.5, y - 3.4, 3.8, 3.8, 0.6, 0.6, cek[i] ? "FD" : "S");
      if (cek[i]) {
        doc.setFillColor(...AKSEN);
        doc.roundedRect(M + 0.5, y - 3.4, 3.8, 3.8, 0.6, 0.6, "F");
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.5);
        doc.line(M + 1.4, y - 1.6, M + 2.2, y - 0.6);
        doc.line(M + 2.2, y - 0.6, M + 3.6, y - 2.6);
      }
      baris.forEach((l) => {
        doc.text(l, M + 7, y);
        y += 4.9;
      });
      y += 1;
    });
  };

  /** Tabel dengan pemecahan teks dalam sel dan kepala tabel berulang. */
  const tabel = ({ kolom, baris }) => {
    const n = kolom.length;
    const isiBaris = baris.filter((b) => b.some((v) => String(v ?? "").trim()));
    const ukuran = n > 6 ? 7.5 : 8.5;
    huruf(ukuran);
    // Lebar kolom sebanding panjang isi, dengan batas wajar
    const panjangMaks = kolom.map((k, i) =>
      Math.min(40, Math.max(String(k).length, ...isiBaris.map((b) => String(b[i] ?? "").length), 4)),
    );
    const total = panjangMaks.reduce((a, b) => a + b, 0);
    const lebar = panjangMaks.map((p) => (p / total) * ISI);
    const pad = 1.6;
    const tinggiTeks = ukuran * 0.42;

    const gambarBaris = (sel, kepala) => {
      huruf(ukuran, kepala, kepala ? [255, 255, 255] : TINTA);
      const pecah = sel.map((v, i) => doc.splitTextToSize(tulisAman(v ?? ""), lebar[i] - pad * 2));
      const tinggi = Math.max(1, ...pecah.map((p) => p.length)) * tinggiTeks + pad * 2 + 0.6;
      return { pecah, tinggi };
    };

    const kepala = gambarBaris(kolom, true);
    const cetak = ({ pecah, tinggi }, isKepala, ganjil) => {
      let x = M;
      if (isKepala) {
        doc.setFillColor(...AKSEN);
        doc.rect(M, y, ISI, tinggi, "F");
      } else if (ganjil) {
        doc.setFillColor(...LATAR);
        doc.rect(M, y, ISI, tinggi, "F");
      }
      huruf(ukuran, isKepala, isKepala ? [255, 255, 255] : TINTA);
      pecah.forEach((p, i) => {
        p.forEach((l, j) => doc.text(l, x + pad, y + pad + tinggiTeks * (j + 0.8)));
        x += lebar[i];
      });
      doc.setDrawColor(...GARIS);
      doc.setLineWidth(0.15);
      doc.line(M, y + tinggi, M + ISI, y + tinggi);
      y += tinggi;
    };

    pastikan(kepala.tinggi + 10);
    cetak(kepala, true);
    isiBaris.forEach((b, r) => {
      const sel = kolom.map((_, i) => b[i] ?? "");
      const brs = gambarBaris(sel, false);
      if (y + brs.tinggi > BAWAH) {
        halamanBaru();
        cetak(kepala, true);
      }
      cetak(brs, false, r % 2 === 1);
    });
    y += 4;
  };

  /** Satu gambar selebar `w` mm, tinggi maksimal `maksH` mm. */
  const ukurGambar = (g, w, maksH) => {
    let lebar = w;
    let tinggi = (w * (g.h || 1)) / (g.w || 1);
    if (tinggi > maksH) {
      lebar = (lebar * maksH) / tinggi;
      tinggi = maksH;
    }
    return { lebar, tinggi };
  };

  const pasangGambar = (g, x, yy, lebar, tinggi) => {
    try {
      doc.addImage(g.dataUrl, "JPEG", x, yy, lebar, tinggi, undefined, "FAST");
      doc.setDrawColor(...GARIS);
      doc.setLineWidth(0.2);
      doc.rect(x, yy, lebar, tinggi);
    } catch {
      /* gambar rusak dilewati */
    }
  };

  const keterangan = (teks, x, yy, lebar) => {
    if (!String(teks || "").trim()) return 0;
    huruf(8, false, ABU);
    const baris = doc.splitTextToSize(tulisAman(teks), lebar).slice(0, 2);
    baris.forEach((l, i) => doc.text(l, x, yy + 3.6 + i * 3.6));
    return baris.length * 3.6 + 1.5;
  };

  const gambarBesar = (g) => {
    const { lebar, tinggi } = ukurGambar(g, ISI, 120);
    pastikan(tinggi + 10);
    const x = M + (ISI - lebar) / 2;
    pasangGambar(g, x, y, lebar, tinggi);
    y += tinggi;
    y += keterangan(g.ket, x, y, lebar) + 4;
  };

  const galeri = (daftar) => {
    const kolomW = (ISI - 6) / 2;
    for (let i = 0; i < daftar.length; i += 2) {
      const pasangan = daftar.slice(i, i + 2).map((g) => ({ g, ...ukurGambar(g, kolomW, 85) }));
      const tinggiMaks = Math.max(...pasangan.map((x) => x.tinggi));
      pastikan(tinggiMaks + 12);
      let tambahan = 0;
      pasangan.forEach((x, j) => {
        const kiri = M + j * (kolomW + 6) + (kolomW - x.lebar) / 2;
        pasangGambar(x.g, kiri, y, x.lebar, x.tinggi);
        tambahan = Math.max(tambahan, keterangan(x.g.ket, M + j * (kolomW + 6), y + x.tinggi, kolomW));
      });
      y += tinggiMaks + tambahan + 5;
    }
  };

  /** Ringkasan satu kalimat dalam kotak menonjol. */
  const kotakRingkasan = (teks) => {
    huruf(12.5, true, AKSEN);
    const baris = doc.splitTextToSize(tulisAman(teks), ISI - 12);
    const tinggi = baris.length * 6 + 9;
    pastikan(tinggi + 4);
    doc.setFillColor(...LATAR);
    doc.roundedRect(M, y, ISI, tinggi, 2.5, 2.5, "F");
    doc.setFillColor(...AKSEN);
    doc.rect(M, y, 1.6, tinggi, "F");
    let yy = y + 8;
    baris.forEach((l) => {
      doc.text(l, M + 7, yy);
      yy += 6;
    });
    y += tinggi + 5;
  };

  /* --------------------------------------------------- sampul */
  doc.setFillColor(...AKSEN);
  doc.rect(0, 0, LEBAR, 92, "F");
  huruf(10, true, [255, 255, 255]);
  doc.text(tulisAman(t("PORTOFOLIO PROYEK", "PROJECT PORTFOLIO")), M, 34, { charSpace: 1 });
  huruf(28, true, [255, 255, 255]);
  const barisNama = doc.splitTextToSize(tulisAman(nama), ISI);
  barisNama.slice(0, 2).forEach((l, i) => doc.text(l, M, 50 + i * 11));
  let yS = 50 + Math.min(2, barisNama.length) * 11;
  if (profil.headline) {
    huruf(12, false, [214, 228, 245]);
    doc.splitTextToSize(tulisAman(profil.headline), ISI).slice(0, 2).forEach((l) => {
      doc.text(l, M, yS);
      yS += 6;
    });
  }
  const kontak = [profil.lokasi, profil.email].filter(Boolean).join("  ·  ");
  if (kontak) {
    huruf(9.5, false, [214, 228, 245]);
    doc.text(tulisAman(kontak), M, Math.min(86, yS + 2));
  }

  y = 108;
  huruf(8.5, true, AKSEN);
  doc.text(tulisAman(t("ISI PORTOFOLIO", "CONTENTS")), M, y, { charSpace: 0.4 });
  y += 8;
  proyek.forEach(({ proyek: p }, i) => {
    huruf(12, true);
    doc.text(`${i + 1}.`, M, y);
    const baris = doc.splitTextToSize(tulisAman(p.judul), ISI - 10);
    baris.forEach((l) => {
      doc.text(l, M + 8, y);
      y += 5.6;
    });
    huruf(9.5, false, ABU);
    doc.text(tulisAman(`${p.namaProfesi}${p.dari?.peran ? `  ·  ${t("Klien", "Client")}: ${p.dari.peran}` : ""}`), M + 8, y);
    y += 5;
    const ringkas = String(proyek[i].data?.studi?.ringkasan || "").trim();
    if (ringkas) {
      huruf(9.5, false, TINTA);
      doc.splitTextToSize(tulisAman(ringkas), ISI - 10).slice(0, 2).forEach((l) => {
        doc.text(l, M + 8, y);
        y += 4.6;
      });
    }
    y += 5;
  });

  y += 4;
  doc.setDrawColor(...GARIS);
  doc.setLineWidth(0.2);
  doc.line(M, y, LEBAR - M, y);
  y += 7;
  paragraf(
    t(
      "Portofolio ini berisi proyek latihan berbasis studi kasus yang saya kerjakan di Jobly. Brief, klien, dan data di dalamnya adalah simulasi yang disusun menyerupai pekerjaan nyata. Setiap proyek disajikan sebagai studi kasus: tantangan klien, peran dan proses saya, hasil kerja beserta buktinya, tanggapan atas revisi, dan pelajaran yang saya ambil.",
      "This portfolio contains case-study practice projects I completed on Jobly. The briefs, clients, and data are simulations modelled on real work. Each project is presented as a case study: the client's challenge, my role and process, the work and its evidence, my response to a revision, and lessons learned.",
    ),
    { ukuran: 9.5, warna: ABU, jarak: 4.7 },
  );
  huruf(8.5, false, ABU);
  doc.text(
    tulisAman(`${t("Disusun", "Compiled")}: ${new Date().toLocaleDateString(lokal(), { day: "numeric", month: "long", year: "numeric" })}`),
    M,
    y + 2,
  );

  /* --------------------------------------------------- proyek */
  proyek.forEach(({ proyek: p, data }, i) => {
    halamanProyek = "";
    doc.addPage();
    y = M;
    halamanProyek = `${t("Proyek", "Project")} ${i + 1} · ${p.namaProfesi} · ${p.judul}`;

    huruf(9, true, AKSEN);
    doc.text(tulisAman(`${t("PROYEK", "PROJECT")} ${i + 1}  ·  ${p.namaProfesi.toUpperCase()}`), M, y + 2, { charSpace: 0.3 });
    y += 10;
    huruf(18, true);
    doc.splitTextToSize(tulisAman(p.judul), ISI).forEach((l) => {
      doc.text(l, M, y);
      y += 8;
    });
    const meta = [
      p.dari?.nama && `${t("Klien", "Client")}: ${p.dari.nama}${p.dari.peran ? ` (${p.dari.peran})` : ""}`,
      p.kanal && `${t("Kanal", "Channel")}: ${p.kanal}`,
      p.tenggat && `${t("Tenggat", "Due")}: ${p.tenggat}`,
    ].filter(Boolean);
    if (meta.length) paragraf(meta.join("   ·   "), { ukuran: 9, warna: ABU, sesudah: 3 });

    const studi = data.studi || {};
    const ada = (k) => String(studi[k] || "").trim();
    const gambar = Array.isArray(data.gambar) ? data.gambar : [];

    if (ada("ringkasan")) kotakRingkasan(studi.ringkasan);
    if (gambar.length) gambarBesar(gambar[0]);

    judulBagian(t("Tantangan klien", "The challenge"));
    if (ada("tantangan")) paragraf(studi.tantangan, { ukuran: 10 });
    kotakPesan(p.dari?.nama ? `${t("Brief", "Brief")} · ${p.dari.nama}${p.kanal ? ` · ${p.kanal}` : ""}` : t("Brief", "Brief"), p.brief);

    if (ada("peran")) {
      judulBagian(t("Peran saya & alat", "My role & tools"));
      paragraf(studi.peran, { ukuran: 10 });
    }

    judulBagian(t("Pendekatan & proses", "Approach & process"));
    if (ada("proses")) paragraf(studi.proses, { ukuran: 10 });
    else if (p.langkah?.length) daftarButir(p.langkah, { nomor: true });

    if (ada("hasil")) {
      judulBagian(t("Hasil & dampak", "Results & impact"));
      paragraf(studi.hasil, { ukuran: 10 });
    }

    if (gambar.length > 1) {
      judulBagian(t("Galeri hasil", "Gallery"));
      galeri(gambar.slice(1));
    }

    judulBagian(t("Hasil kerja lengkap", "The full deliverable"));
    if (tabelTerisi(data.tabel)) tabel(data.tabel);
    if (String(data.jawaban || "").trim()) paragraf(data.jawaban, { ukuran: 10 });

    if (data.tautan) {
      huruf(9.5, true, AKSEN);
      pastikan(8);
      const label = `${t("Lihat hasil kerja", "View the work")}: `;
      doc.text(tulisAman(label), M, y);
      const lebarLabel = doc.getTextWidth(tulisAman(label));
      huruf(9.5, false, AKSEN);
      const tautan = tulisAman(data.tautan).slice(0, 110);
      doc.textWithLink(tautan, M + lebarLabel, y, { url: data.tautan });
      y += 7;
    }

    if (p.revisi && String(data.revisi || "").trim()) {
      judulBagian(t("Revisi dari klien", "Client revision"));
      kotakPesan(p.dari?.nama || "", p.revisi.pesan);
      judulBagian(t("Tanggapan saya", "My response"));
      paragraf(data.revisi, { ukuran: 10 });
    }

    if (ada("pelajaran")) {
      judulBagian(t("Pelajaran & langkah berikutnya", "Lessons & next steps"));
      paragraf(studi.pelajaran, { ukuran: 10 });
    }

    if (p.rubrik?.length) {
      judulBagian(t("Daftar periksa (dinilai sendiri)", "Checklist (self-assessed)"));
      kotakCentang(p.rubrik, Array.isArray(data.cek) ? data.cek : []);
    }
  });

  kaki();
  return doc.output("blob");
}
