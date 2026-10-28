/**
 * Rekomendasi sertifikasi & pelatihan.
 *
 * Data ada di tabel Supabase `sertifikasi` dan dikelola admin lewat bot
 * Telegram (lihat supabase/functions/telegram-bot/sertifikasi.ts). Item
 * yang tanggal tutupnya sudah lewat otomatis tidak terbaca (RLS).
 */
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { BIDANG } from "./bidang.js";
import { t, lokal } from "../i18n.js";

export const JENJANG = [
  { id: "dasar", nama: t("Pemula", "Starter"), ket: t("Fresh graduate & 0–1 tahun", "Fresh grads & 0–1 year") },
  { id: "menengah", nama: t("Menengah", "Intermediate"), ket: t("1–3 tahun pengalaman", "1–3 years' experience") },
  { id: "lanjut", nama: t("Lanjut", "Advanced"), ket: t("Senior & spesialis", "Senior & specialist") },
];

export const JENIS = {
  sertifikasi: t("Sertifikasi", "Certification"),
  pelatihan: t("Pelatihan", "Training"),
  bootcamp: "Bootcamp",
  beasiswa: t("Beasiswa", "Scholarship"),
  kursus: t("Kursus", "Course"),
};

export const MODE = { online: "Online", offline: t("Tatap muka", "In person"), hybrid: "Hybrid" };

export const namaBidang = (slug) => BIDANG.find((b) => b.slug === slug)?.nama || slug;

export async function muatSertifikasi() {
  if (!supabaseConfigured) return { data: [], galat: "" };
  const { data, error } = await supabase.from("sertifikasi").select("*").limit(500);
  if (error) {
    return {
      data: [],
      galat: /relation|does not exist|schema cache/i.test(error.message)
        ? t("Daftar sertifikasi belum disiapkan. Jalankan supabase/sql/10_sertifikasi.sql.", "The certification list isn't set up yet. Run supabase/sql/10_sertifikasi.sql.")
        : error.message,
    };
  }
  return { data: data || [], galat: "" };
}

const hari = (d) => {
  if (!d) return null;
  const kini = new Date();
  kini.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${d}T00:00:00`).getTime() - kini.getTime()) / 86400000);
};

export const fmtTanggal = (d) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString(lokal(), { day: "numeric", month: "short", year: "numeric" }) : "");

/** Status pendaftaran: { kode, teks } dengan kode buka | segera | tutupSegera | selalu */
export function statusDaftar(r) {
  const sisa = hari(r.tutup);
  const awal = hari(r.buka);
  if (awal !== null && awal > 0) return { kode: "segera", teks: t(`Dibuka ${fmtTanggal(r.buka)}`, `Opens ${fmtTanggal(r.buka)}`) };
  if (sisa !== null) {
    if (sisa === 0) return { kode: "tutupSegera", teks: t("Ditutup hari ini", "Closes today") };
    if (sisa <= 7) return { kode: "tutupSegera", teks: t(`Tutup ${sisa} hari lagi`, `Closes in ${sisa} day${sisa > 1 ? "s" : ""}`) };
    return { kode: "buka", teks: t(`Daftar s.d. ${fmtTanggal(r.tutup)}`, `Apply by ${fmtTanggal(r.tutup)}`) };
  }
  return { kode: "selalu", teks: t("Bisa kapan saja", "Anytime") };
}

export function teksBiaya(r) {
  if (r.biaya === 0) return t("Gratis", "Free");
  if (r.biaya) return `Rp${Number(r.biaya).toLocaleString("id-ID")}`;
  return r.ket_biaya || t("Lihat situs", "See website");
}

/**
 * Skor kecocokan dengan posisi incaran. 0 = tidak cocok.
 * Posisi dicocokkan ke tag posisi, nama program, dan bidang (lewat kata kunci bidang).
 */
export function skorPosisi(r, posisi) {
  const k = String(posisi || "").toLowerCase().trim();
  if (!k) return 0;
  let s = 0;
  const tag = (r.posisi || []).map((p) => p.toLowerCase());
  if (tag.some((p) => p === k)) s += 8;
  else if (tag.some((p) => p.includes(k) || (p.length > 3 && k.includes(p)))) s += 5;
  const kata = k.split(/\s+/).filter((w) => w.length > 2);
  const teks = `${r.nama} ${tag.join(" ")} ${r.ringkas || ""}`.toLowerCase();
  s += kata.filter((w) => teks.includes(w)).length;
  const bidangCocok = BIDANG.filter((b) => b.kata.some((w) => k.includes(w)) || b.nama.toLowerCase().includes(k)).map((b) => b.slug);
  if ((r.bidang || []).some((b) => bidangCocok.includes(b))) s += 3;
  return s;
}
