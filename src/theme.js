/**
 * Token desain Jobly.
 *
 * Latar putih, teks biru-hitam, dan satu warna merek: biru navy yang dalam.
 * Warna merek dipakai hemat — tombol utama, tautan, angka penting, dan
 * status aktif. Pemisah antar-bagian berupa garis tipis.
 *
 * Nama kunci lama (ink, inkSoft, accent, dst) dipertahankan agar seluruh
 * panel dashboard ikut berganti tanpa diubah satu per satu.
 */
export const T = {
  // Teks
  ink: "#111B29", // judul & teks utama
  inkSoft: "#4A5567", // teks pendukung
  inkFaint: "#8792A3", // keterangan, placeholder

  // Merek
  accent: "#0B3C6E", // biru navy — tombol utama, logo, item aktif
  accentSoft: "#EAF1FA", // latar lembut untuk chip & ikon
  brand: "#14549A", // tautan & teks berwarna merek
  teal: "#1660B0", // aksen sekunder
  salary: "#1660B0", // nominal gaji

  // Permukaan & garis
  bg: "#FFFFFF",
  surface: "#FFFFFF",
  surface2: "#F3F6FA",
  border: "rgba(17,27,41,0.10)",
  line: "rgba(17,27,41,0.06)",

  // Huruf
  sans: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
};

export const fontLink =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
