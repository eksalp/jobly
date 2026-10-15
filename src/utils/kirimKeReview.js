/**
 * Mengirim isi CV Builder atau LinkedIn Builder langsung ke halaman
 * Review CV & LinkedIn, supaya user tidak perlu mengunduh PDF lalu
 * mengunggahnya lagi.
 *
 * Teksnya dimasukkan ke cvText (UserProfileContext) yang juga dibaca
 * halaman review, dan jenis sumbernya dititipkan di sessionStorage agar
 * halaman review langsung memilih mode yang tepat (CV atau LinkedIn).
 */
import { t } from "../i18n.js";

const KUNCI = "jobly:review-dari";

const str = (v) => (typeof v === "string" ? v.trim() : "");
const daftarTeks = (v) => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);

/** Satu entri berulang (pengalaman, pendidikan, dll.) menjadi beberapa baris. */
function entriKeBaris(e, urutanJudul) {
  if (!e || typeof e !== "object") return [];
  const judul = urutanJudul.map((k) => str(e[k])).filter(Boolean).join(" · ");
  const periode = [str(e.start), str(e.end)].filter(Boolean).join(" – ");
  const baris = [];
  if (judul || periode) baris.push([judul, periode].filter(Boolean).join(" | "));
  for (const d of daftarTeks(e.desc)) baris.push(`- ${d}`);
  // Isi teks lain yang belum tercakup (misalnya tahun, penerbit, tingkat bahasa)
  const lain = Object.entries(e)
    .filter(([k, v]) => !["id", "desc", "start", "end", "skills", ...urutanJudul].includes(k) && typeof v === "string" && v.trim())
    .map(([, v]) => v.trim());
  if (lain.length) baris.push(lain.join(" · "));
  const skill = daftarTeks(e.skills);
  if (skill.length) baris.push(`${t("Keahlian", "Skills")}: ${skill.join(", ")}`);
  return baris;
}

function bagian(judul, entri, urutanJudul) {
  const isi = (Array.isArray(entri) ? entri : []).flatMap((e) => {
    const b = entriKeBaris(e, urutanJudul);
    return b.length ? [...b, ""] : [];
  });
  return isi.length ? [judul.toUpperCase(), ...isi] : [];
}

/** Data CV Builder → teks CV biasa. */
export function cvKeTeks(d = {}) {
  const kontak = [d.email, d.phone, d.location, d.linkedin].map(str).filter(Boolean).join(" | ");
  const baris = [
    str(d.fullName),
    str(d.headline),
    kontak,
    "",
    ...(str(d.summary) ? [t("RINGKASAN", "SUMMARY"), str(d.summary), ""] : []),
    ...bagian(t("Pengalaman kerja", "Work experience"), d.experiences, ["role", "company"]),
    ...bagian(t("Organisasi", "Organizations"), d.organizations, ["role", "org"]),
    ...bagian(t("Kegiatan sukarela", "Volunteering"), d.volunteers, ["role", "org"]),
    ...bagian(t("Pendidikan", "Education"), d.education, ["degree", "school"]),
    ...bagian(t("Sertifikasi", "Certifications"), d.certifications, ["name", "issuer"]),
    ...bagian(t("Penghargaan", "Awards"), d.awards, ["title", "issuer"]),
  ];
  const skill = daftarTeks(d.skills);
  if (skill.length) baris.push(t("KEAHLIAN", "SKILLS"), skill.join(", "));
  return baris.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Data LinkedIn Builder → teks profil LinkedIn biasa. */
export function linkedinKeTeks(p = {}) {
  const baris = [
    str(p.nama),
    str(p.headline),
    str(p.lokasi),
    "",
    ...(str(p.about) ? [t("TENTANG", "ABOUT"), str(p.about), ""] : []),
    ...bagian(t("Pengalaman", "Experience"), p.experiences, ["role", "company", "jenis"]),
    ...bagian(t("Pendidikan", "Education"), p.education, ["degree", "school", "field"]),
    ...bagian(t("Lisensi & sertifikasi", "Licenses & certifications"), p.certifications, ["name", "issuer"]),
    ...bagian(t("Pengalaman sukarela", "Volunteer experience"), p.volunteering, ["role", "org"]),
    ...bagian(t("Organisasi", "Organizations"), p.organizations, ["role", "org", "name"]),
    ...bagian(t("Publikasi", "Publications"), p.publications, ["title", "publisher"]),
    ...bagian(t("Penghargaan", "Honors & awards"), p.awards, ["title", "issuer"]),
    ...bagian(t("Bahasa", "Languages"), p.languages, ["name", "language"]),
  ];
  const skill = daftarTeks(p.skills);
  if (skill.length) baris.push(t("KEAHLIAN", "SKILLS"), skill.join(", "));
  return baris.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Titipkan sumber teks untuk halaman review. */
export function tandaiKirimanReview(sumber, asal) {
  try {
    sessionStorage.setItem(KUNCI, JSON.stringify({ sumber, asal, waktu: Date.now() }));
  } catch {
    /* tanpa penyimpanan, halaman review tetap memakai mode CV */
  }
}

/** Diambil sekali oleh halaman review, lalu dihapus. Kedaluwarsa 10 menit. */
export function ambilKirimanReview() {
  try {
    const mentah = sessionStorage.getItem(KUNCI);
    if (!mentah) return null;
    sessionStorage.removeItem(KUNCI);
    const d = JSON.parse(mentah);
    if (!d || Date.now() - (d.waktu || 0) > 10 * 60 * 1000) return null;
    return d;
  } catch {
    return null;
  }
}
