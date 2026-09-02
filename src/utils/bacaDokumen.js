import mammoth from "mammoth";

/**
 * Membaca teks dari berkas CV yang diunggah.
 *
 * Mendukung .docx, .pdf, dan .txt. PDF dibaca di browser memakai pdf.js
 * sehingga isinya tidak pernah dikirim ke mana pun sebelum user menekan
 * tombol analisis.
 */

/* ------------------------------------------------------------------ */
/*  PDF                                                                */
/* ------------------------------------------------------------------ */

let pdfjsCache = null;

// pdf.js dimuat saat dibutuhkan saja. Ukurannya cukup besar, dan
// kebanyakan sesi tidak pernah membuka berkas PDF.
async function muatPdfjs() {
  if (pdfjsCache) return pdfjsCache;

  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  pdfjsCache = pdfjs;
  return pdfjs;
}

/**
 * pdf.js mengembalikan potongan teks beserta koordinatnya, bukan baris utuh.
 * Potongan dikelompokkan berdasarkan posisi vertikal supaya struktur baris
 * CV tetap terjaga — tanpa ini, seluruh halaman menyatu jadi satu paragraf
 * panjang dan deteksi kategori jadi kacau.
 */
function susunBaris(items) {
  const baris = new Map();

  items.forEach((it) => {
    const teks = it.str;
    if (!teks || !teks.trim()) return;

    // transform[5] = posisi Y. Dibulatkan supaya potongan pada baris
    // yang sama tapi beda pecahan piksel tetap terkelompok.
    const y = Math.round(it.transform[5]);
    const x = it.transform[4];

    if (!baris.has(y)) baris.set(y, []);
    baris.get(y).push({ x, teks });
  });

  return [...baris.entries()]
    .sort((a, b) => b[0] - a[0]) // Y besar = atas halaman
    .map(([, potongan]) =>
      potongan
        .sort((a, b) => a.x - b.x)
        .map((p) => p.teks)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean)
    .join("\n");
}

async function bacaPdf(file, onProgres) {
  const pdfjs = await muatPdfjs();
  const buffer = await file.arrayBuffer();

  const dok = await pdfjs.getDocument({
    data: buffer,
    // Menekan permintaan berkas font eksternal yang tidak kita perlukan
    disableFontFace: true,
    isEvalSupported: false,
  }).promise;

  const halaman = [];
  for (let i = 1; i <= dok.numPages; i++) {
    onProgres?.(i, dok.numPages);
    const hal = await dok.getPage(i);
    const isi = await hal.getTextContent();
    halaman.push(susunBaris(isi.items));
  }

  await dok.destroy();
  return halaman.join("\n\n").trim();
}

/* ------------------------------------------------------------------ */
/*  Pintu masuk                                                        */
/* ------------------------------------------------------------------ */

const MAKS_UKURAN = 10 * 1024 * 1024; // 10 MB

export async function bacaDokumen(file, onProgres) {
  if (!file) throw new Error("Tidak ada berkas yang dipilih.");

  if (file.size > MAKS_UKURAN) {
    throw new Error("Ukuran berkas melebihi 10 MB. Coba kompres dulu.");
  }

  const nama = file.name.toLowerCase();

  if (nama.endsWith(".docx")) {
    const buffer = await file.arrayBuffer();
    const hasil = await mammoth.extractRawText({ arrayBuffer: buffer });
    return bersihkan(hasil.value);
  }

  if (nama.endsWith(".pdf")) {
    const teks = await bacaPdf(file, onProgres);

    // PDF hasil pindaian berisi gambar, bukan teks. Kasusnya cukup sering
    // terjadi sehingga perlu pesan yang menjelaskan langkah berikutnya,
    // bukan sekadar "gagal membaca".
    if (teks.replace(/\s/g, "").length < 50) {
      throw new Error(
        "PDF ini sepertinya hasil pindaian atau foto, jadi teksnya tidak bisa dibaca. " +
          "Coba simpan ulang CV kamu sebagai PDF dari Word atau Google Docs, " +
          "atau tempel isinya langsung ke kotak di bawah.",
      );
    }

    return bersihkan(teks);
  }

  if (nama.endsWith(".txt") || nama.endsWith(".md")) {
    return bersihkan(await file.text());
  }

  if (nama.endsWith(".doc")) {
    throw new Error(
      "Format .doc lama belum didukung. Buka di Word lalu simpan sebagai .docx atau PDF.",
    );
  }

  throw new Error(
    "Format tidak didukung. Gunakan PDF, DOCX, atau tempel teksnya langsung.",
  );
}

function bersihkan(teks) {
  return (teks || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n") // rapatkan baris kosong beruntun
    .trim();
}

export const FORMAT_DITERIMA = ".pdf,.docx,.txt,.md";
