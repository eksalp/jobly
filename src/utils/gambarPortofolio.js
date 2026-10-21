/**
 * Lampiran gambar portofolio: kompres di browser, unggah ke bucket
 * privat "portofolio" (folder milik pengguna), tampilkan lewat signed URL,
 * dan siapkan data gambar untuk PDF.
 */
import { supabase } from "../lib/supabaseClient";
import { t } from "../i18n.js";

export const BUCKET_PORTOFOLIO = "portofolio";
const SISI_MAKS = 1600;
const BATAS_ASLI = 15 * 1024 * 1024; // berkas asli maksimal 15 MB sebelum dikompres
const BATAS_HASIL = 1.9 * 1024 * 1024;

function bacaGambar(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(t("Berkas ini bukan gambar yang bisa dibaca.", "This file isn't a readable image.")));
    };
    img.src = url;
  });
}

/** Perkecil ke sisi terpanjang 1600 px dan simpan sebagai JPEG. */
export async function kompresGambar(file) {
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
    throw new Error(t("Format gambar harus JPG, PNG, atau WebP.", "Images must be JPG, PNG, or WebP."));
  }
  if (file.size > BATAS_ASLI) throw new Error(t("Gambar terlalu besar (maksimal 15 MB).", "Image too large (max 15 MB)."));
  const { img, url } = await bacaGambar(file);
  try {
    const skala = Math.min(1, SISI_MAKS / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * skala));
    const h = Math.max(1, Math.round(img.naturalHeight * skala));
    const kanvas = document.createElement("canvas");
    kanvas.width = w;
    kanvas.height = h;
    const ctx = kanvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; // latar putih untuk PNG transparan
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    let blob = null;
    for (const mutu of [0.85, 0.75, 0.62, 0.5]) {
      blob = await new Promise((r) => kanvas.toBlob(r, "image/jpeg", mutu));
      if (blob && blob.size <= BATAS_HASIL) break;
    }
    if (!blob || blob.size > BATAS_HASIL) throw new Error(t("Gambar tidak bisa dikecilkan di bawah 2 MB.", "Couldn't shrink the image below 2 MB."));
    return { blob, w, h };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Unggah satu gambar. Mengembalikan item lampiran { path, ket, w, h }. */
export async function unggahGambar(userId, proyekId, file) {
  const { blob, w, h } = await kompresGambar(file);
  const path = `${userId}/${proyekId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage.from(BUCKET_PORTOFOLIO).upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) {
    if (/bucket not found/i.test(error.message)) {
      throw new Error(t("Penyimpanan gambar belum disiapkan. Jalankan supabase/sql/09_portofolio_lampiran.sql.", "Image storage isn't set up yet. Run supabase/sql/09_portofolio_lampiran.sql."));
    }
    if (/row-level security|policy/i.test(error.message)) {
      throw new Error(t("Batas 16 gambar portofolio sudah tercapai, atau akunmu belum memilih proyek.", "You've reached the 16-image limit, or haven't picked a project yet."));
    }
    throw error;
  }
  return { path, ket: "", w, h };
}

export async function hapusGambar(path) {
  await supabase.storage.from(BUCKET_PORTOFOLIO).remove([path]);
}

/** Signed URL untuk ditampilkan di layar (berlaku 1 jam). */
export async function urlGambar(paths) {
  if (!paths.length) return {};
  const { data, error } = await supabase.storage.from(BUCKET_PORTOFOLIO).createSignedUrls(paths, 3600);
  if (error) return {};
  return Object.fromEntries((data || []).filter((x) => x.signedUrl).map((x) => [x.path, x.signedUrl]));
}

const keDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

/** Unduh lampiran sebagai data URL untuk dimasukkan ke PDF. */
export async function gambarUntukPdf(lampiran) {
  const hasil = [];
  for (const g of lampiran || []) {
    const { data, error } = await supabase.storage.from(BUCKET_PORTOFOLIO).download(g.path);
    if (error || !data) continue;
    hasil.push({ dataUrl: await keDataUrl(data), w: g.w || 1600, h: g.h || 1000, ket: g.ket || "" });
  }
  return hasil;
}
