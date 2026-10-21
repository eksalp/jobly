import { t } from "../i18n.js";
/**
 * Informasi situs yang dipakai di footer dan dokumen hukum.
 *
 * EMAIL_KONTAK WAJIB diisi sebelum situs dipublikasikan. Alamat ini
 * dicantumkan di Kebijakan Privasi dan Syarat & Ketentuan sebagai jalur
 * resmi permintaan data, keluhan, dan pengembalian dana. Selama masih
 * kosong, halaman dokumen menampilkan tautan ke halaman FAQ sebagai gantinya.
 */
export const SITUS = {
  nama: "Jobly",
  pembuat: "Eksal Pujianto",
  emailKontak: "", // contoh: "halo@domainmu.com"
  dokumenBerlaku: t("12 Oktober 2026", "12 October 2026"),
};

/**
 * Media sosial & grup komunitas. Isi `url` untuk menampilkannya — yang
 * kosong otomatis disembunyikan, jadi aman dibiarkan sebagian kosong.
 * Tampil di footer, beranda (bagian "Gabung komunitas"), dan halaman loker.
 */
export const SOSIAL = [
  { jenis: "instagram", label: "Instagram", handle: "@by.eksal", url: "https://instagram.com/by.eksal/" }, // "https://instagram.com/nama"
  { jenis: "tiktok", label: "TikTok", handle: "@eksalp", url: "https://tiktok.com/@eksalp" }, // "https://tiktok.com/@nama"
  { jenis: "linkedin", label: "LinkedIn", handle: "Eksal Pujianto", url: "https://linkedin.com/in/eksalpujianto/" },
  { jenis: "x", label: "X", handle: "", url: "" },
  { jenis: "youtube", label: "YouTube", handle: "@eksalp", url: "https://youtube.com/@eksalp" },
  { jenis: "threads", label: "Threads", handle: "", url: "" },
];

export const GRUP = [
  {
    jenis: "telegram",
    label: t("Gabung Telegram", "Join on Telegram"),
    ket: t("Productive by Eksal: info loker dan tips karier", "Productive by Eksal: job updates and career tips"),
    anggota: "",
    url: "https://t.me/productivebyeksal",
  },
  {
    // Bot Telegram pencari loker (supabase/functions/telegram-bot).
    // Isi setelah bot dibuat di @BotFather, mis. "https://t.me/JoblyLokerBot".
    jenis: "telegram",
    label: t("Bot cari loker", "Job search bot"),
    ket: t("Ketik posisi yang dicari, bot kirim lokernya di Telegram", "Type a role and the bot sends matching jobs on Telegram"),
    aksi: t("Buka bot", "Open bot"),
    anggota: "",
    url: "",
  },
  {
    // wa.me = chat pribadi. Kalau nanti punya grup/saluran WhatsApp,
    // ganti url ke tautan chat.whatsapp.com/… atau whatsapp.com/channel/…
    jenis: "whatsapp",
    label: t("Chat WhatsApp", "WhatsApp chat"),
    ket: t("Tanya seputar Jobly atau minta info grup", "Ask about Jobly or the group"),
    aksi: "Chat",
    anggota: "",
    url: "https://wa.me/6285811858064",
  },
];

export const sosialAktif = () => SOSIAL.filter((s) => s.url);
export const grupAktif = () => GRUP.filter((g) => g.url);
