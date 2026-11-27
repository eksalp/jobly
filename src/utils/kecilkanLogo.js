/**
 * Mengecilkan logo di browser sebelum diunggah: sisi terpanjang maks.
 * 256 px, disimpan sebagai WEBP (PNG bila browser tidak mendukung WEBP).
 * Hasil biasanya 5–40 KB, jadi penyimpanan Supabase tetap ringan.
 * SVG juga diubah menjadi gambar biasa, sehingga tidak ada kode di dalam
 * file yang tersimpan.
 */
export const SISI_LOGO = 256;
export const MAKS_ASLI = 5 * 1024 * 1024; // file asli boleh sampai 5 MB
export const MAKS_HASIL = 200 * 1024; // sama dengan batas bucket (SQL 20)

export async function kecilkanLogo(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, gagal) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => gagal(new Error("Gambar tidak bisa dibaca."));
      i.src = url;
    });
    const w0 = img.naturalWidth || SISI_LOGO;
    const h0 = img.naturalHeight || SISI_LOGO;
    const skala = Math.min(1, SISI_LOGO / Math.max(w0, h0));
    const w = Math.max(1, Math.round(w0 * skala));
    const h = Math.max(1, Math.round(h0 * skala));
    const kanvas = document.createElement("canvas");
    kanvas.width = w;
    kanvas.height = h;
    const ctx = kanvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);

    const keBlob = (tipe, mutu) => new Promise((ok) => kanvas.toBlob(ok, tipe, mutu));
    let blob = await keBlob("image/webp", 0.88);
    let ext = "webp";
    if (!blob || blob.type !== "image/webp") {
      blob = await keBlob("image/png");
      ext = "png";
    }
    if (!blob) throw new Error("Gambar tidak bisa diproses.");
    // Masih terlalu besar (jarang): turunkan mutu WEBP
    if (blob.size > MAKS_HASIL && ext === "webp") blob = (await keBlob("image/webp", 0.7)) || blob;
    return { blob, ext, tipe: blob.type };
  } finally {
    URL.revokeObjectURL(url);
  }
}
