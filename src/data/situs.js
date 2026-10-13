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
  dokumenBerlaku: "12 Oktober 2026",
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
    label: "Gabung Telegram",
    ket: "Productive by Eksal: info loker dan tips karier",
    anggota: "",
    url: "https://t.me/productivebyeksal",
  },
  {
    // wa.me = chat pribadi. Kalau nanti punya grup/saluran WhatsApp,
    // ganti url ke tautan chat.whatsapp.com/… atau whatsapp.com/channel/…
    jenis: "whatsapp",
    label: "Chat WhatsApp",
    ket: "Tanya seputar Jobly atau minta info grup",
    aksi: "Chat",
    anggota: "",
    url: "https://wa.me/6285811858064",
  },
];

export const sosialAktif = () => SOSIAL.filter((s) => s.url);
export const grupAktif = () => GRUP.filter((g) => g.url);
