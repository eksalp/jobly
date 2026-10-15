/**
 * Foto profil dan sampul LinkedIn Builder: dikompres di browser lalu
 * disimpan di Supabase Storage (bucket "linkedin-media").
 *
 * Hemat penyimpanan:
 *  - Setiap user hanya punya SATU berkas per jenis, dengan nama tetap
 *    ("<user_id>/foto" dan "<user_id>/sampul"). Unggahan baru menimpa
 *    berkas lama, jadi tidak ada berkas lama yang tertinggal.
 *  - Gambar dipotong ke proporsi LinkedIn dan dikecilkan sampai di bawah
 *    batas ukuran sebelum dikirim. Batas yang sama dipasang di bucket.
 */
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { t } from "../i18n.js";

export const BUCKET_LINKEDIN = "linkedin-media";

export const ATURAN_GAMBAR = {
  foto: { lebar: 400, tinggi: 400, maksKB: 100, label: "400 × 400 px" },
  sampul: { lebar: 1584, tinggi: 396, maksKB: 200, label: "1584 × 396 px" },
};

/** Berkas asli yang diterima sebelum dikompres. */
export const MAKS_MB_ASLI = 10;
export const TIPE_DITERIMA = "image/jpeg,image/png,image/webp";

function muatGambar(sumber) {
  return new Promise((ok, gagal) => {
    const url = typeof sumber === "string" ? sumber : URL.createObjectURL(sumber);
    const img = new Image();
    img.onload = () => {
      if (typeof sumber !== "string") URL.revokeObjectURL(url);
      ok(img);
    };
    img.onerror = () => gagal(new Error(t("Gambar tidak bisa dibaca. Coba berkas JPG atau PNG lain.", "The image couldn't be read. Try another JPG or PNG.")));
    img.src = url;
  });
}

const keBlob = (kanvas, tipe, mutu) => new Promise((ok) => kanvas.toBlob(ok, tipe, mutu));

/**
 * Potong di tengah sesuai proporsi, kecilkan, lalu turunkan mutu sampai
 * ukurannya di bawah maksKB. WebP dipakai bila browser mendukung,
 * selain itu JPEG.
 */
export async function kompresGambar(sumber, { lebar, tinggi, maksKB }) {
  const img = sumber instanceof HTMLCanvasElement ? sumber : await muatGambar(sumber);
  const lebarAsli = img.naturalWidth || img.width;
  const tinggiAsli = img.naturalHeight || img.height;

  // Potongan tengah dengan proporsi tujuan
  const rasio = lebar / tinggi;
  let sw = lebarAsli;
  let sh = lebarAsli / rasio;
  if (sh > tinggiAsli) {
    sh = tinggiAsli;
    sw = tinggiAsli * rasio;
  }
  const sx = (lebarAsli - sw) / 2;
  const sy = (tinggiAsli - sh) / 2;

  let skala = 1;
  for (let ulang = 0; ulang < 4; ulang++) {
    const kanvas = document.createElement("canvas");
    kanvas.width = Math.round(lebar * skala);
    kanvas.height = Math.round(tinggi * skala);
    const ctx = kanvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, kanvas.width, kanvas.height);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, kanvas.width, kanvas.height);

    for (const mutu of [0.86, 0.78, 0.7, 0.6, 0.5, 0.4]) {
      let blob = await keBlob(kanvas, "image/webp", mutu);
      // Browser yang tidak bisa membuat WebP mengembalikan PNG: pakai JPEG
      if (!blob || blob.type !== "image/webp") blob = await keBlob(kanvas, "image/jpeg", mutu);
      if (blob && blob.size <= maksKB * 1024) return blob;
    }
    skala *= 0.8;
  }
  throw new Error(t("Gambar terlalu rumit untuk dikecilkan. Coba gambar lain.", "This image couldn't be made small enough. Try another one."));
}

/** Unggah (menimpa berkas lama) dan kembalikan URL publik baru. */
export async function unggahGambarLinkedin(userId, jenis, blob) {
  if (!supabaseConfigured || !userId) {
    // Tanpa Supabase (mode pratinjau), tampilkan lokal saja
    return URL.createObjectURL(blob);
  }
  const path = `${userId}/${jenis}`;
  const { error } = await supabase.storage.from(BUCKET_LINKEDIN).upload(path, blob, {
    upsert: true,
    contentType: blob.type,
    cacheControl: "3600",
  });
  if (error) throw new Error(t(`Gagal mengunggah: ${error.message}`, `Upload failed: ${error.message}`));
  const { data } = supabase.storage.from(BUCKET_LINKEDIN).getPublicUrl(path);
  // Penanda versi supaya browser tidak menampilkan gambar lama dari cache
  return `${data.publicUrl}?v=${Date.now()}`;
}

/** Hapus berkas dari penyimpanan. */
export async function hapusGambarLinkedin(userId, jenis) {
  if (!supabaseConfigured || !userId) return;
  await supabase.storage.from(BUCKET_LINKEDIN).remove([`${userId}/${jenis}`]);
}
