/**
 * Informasi situs yang dipakai di footer dan dokumen hukum.
 *
 * EMAIL_KONTAK WAJIB diisi sebelum situs dipublikasikan — alamat ini
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
  { jenis: "instagram", label: "Instagram", handle: "", url: "" }, // "https://instagram.com/nama"
  { jenis: "tiktok", label: "TikTok", handle: "", url: "" }, // "https://tiktok.com/@nama"
  { jenis: "linkedin", label: "LinkedIn", handle: "", url: "" },
  { jenis: "x", label: "X", handle: "", url: "" },
  { jenis: "youtube", label: "YouTube", handle: "", url: "" },
  { jenis: "threads", label: "Threads", handle: "", url: "" },
];

export const GRUP = [
  {
    jenis: "whatsapp",
    label: "Grup WhatsApp",
    ket: "Info loker pilihan & tips melamar setiap hari",
    anggota: "", // opsional, mis. "2.300+ anggota"
    url: "", // "https://chat.whatsapp.com/…" atau "https://whatsapp.com/channel/…"
  },
  {
    jenis: "telegram",
    label: "Grup Telegram",
    ket: "Loker baru langsung dari bot Jobly",
    anggota: "",
    url: "", // "https://t.me/nama"
  },
];

export const sosialAktif = () => SOSIAL.filter((s) => s.url);
export const grupAktif = () => GRUP.filter((g) => g.url);
