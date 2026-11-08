/**
 * Bidang khusus loker freelance (halaman /freelance, data DB2).
 *
 * Bentuknya sama dengan BIDANG di bidang.js supaya filter `bidang` di server
 * bisa langsung memakainya: loker masuk bidang ini bila judulnya memuat salah
 * satu `kata`. Kata pendek (≤3 huruf) dicocokkan per kata utuh.
 */
import { t } from "../i18n.js";

export const BIDANG_FREELANCE = [
  { slug: "fl-desain", ikon: "PenTool", nama: t("Desain grafis", "Graphic design"),
    kategori: [], kata: ["desain", "design", "graphic", "grafis", "logo", "ilustra", "illustrat", "canva", "figma", "ui", "ux", "banner", "thumbnail"] },
  { slug: "fl-tulis", ikon: "Feather", nama: t("Penulisan & konten", "Writing & content"),
    kategori: [], kata: ["writer", "writing", "penulis", "artikel", "article", "copywrit", "content", "konten", "blog", "seo", "script"] },
  { slug: "fl-video", ikon: "Video", nama: t("Video & animasi", "Video & animation"),
    kategori: [], kata: ["video", "editor", "editing", "animat", "animasi", "motion", "youtube", "tiktok", "reels", "capcut"] },
  { slug: "fl-web", ikon: "Code2", nama: t("Web & aplikasi", "Web & apps"),
    kategori: [], kata: ["developer", "programmer", "web", "website", "wordpress", "app", "aplikasi", "frontend", "backend", "fullstack", "react", "shopify", "laravel"] },
  { slug: "fl-sosmed", ikon: "Megaphone", nama: t("Social media & iklan", "Social media & ads"),
    kategori: [], kata: ["social media", "sosmed", "instagram", "marketing", "ads", "iklan", "facebook ads", "google ads", "influencer", "affiliate", "afiliasi"] },
  { slug: "fl-admin", ikon: "ClipboardList", nama: t("Admin & asisten virtual", "Admin & virtual assistant"),
    kategori: [], kata: ["virtual assistant", "asisten", "assistant", "admin", "data entry", "input data", "customer service", "customer support", "chat"] },
  { slug: "fl-bahasa", ikon: "Languages", nama: t("Terjemahan & transkripsi", "Translation & transcription"),
    kategori: [], kata: ["translat", "terjemah", "penerjemah", "transcri", "transkrip", "subtitle", "proofread"] },
  { slug: "fl-data", ikon: "BarChart3", nama: t("Data & riset", "Data & research"),
    kategori: [], kata: ["data analyst", "analis", "excel", "spreadsheet", "riset", "research", "survey", "survei", "dashboard"] },
  { slug: "fl-ajar", ikon: "GraduationCap", nama: t("Mengajar & tutor", "Teaching & tutoring"),
    kategori: [], kata: ["tutor", "guru", "mengajar", "pengajar", "teacher", "les", "mentor", "trainer"] },
  { slug: "fl-foto", ikon: "Camera", nama: t("Foto, audio & suara", "Photo, audio & voice"),
    kategori: [], kata: ["foto", "photo", "fotografer", "voice", "dubbing", "audio", "podcast", "musik", "music"] },
];
