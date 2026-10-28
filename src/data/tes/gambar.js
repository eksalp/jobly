/**
 * Latihan tes gambar: Wartegg (8 kotak), menggambar orang (DAP/DAM),
 * rumah-pohon-orang (HTP), dan pohon (Baum).
 *
 * Ini latihan format, bukan penilaian. Tes gambar ditafsirkan psikolog
 * secara utuh bersama tes lain, sehingga Jobly tidak memberi "skor".
 * Yang diberikan: waktu, kanvas, dan daftar periksa hal yang biasa
 * diperhatikan asesor (kelengkapan, proporsi, penggunaan ruang).
 */

/**
 * Rangsang Wartegg per kotak (koordinat 0–100). Bentuknya mengikuti
 * deskripsi umum tes Wartegg: titik, garis lengkung, tiga garis
 * bertingkat, kotak hitam kecil, dua garis miring, garis horizontal &
 * vertikal, titik-titik setengah lingkaran, dan lengkungan besar.
 */
export const WARTEGG = [
  { no: 1, ket: "Titik di tengah", gambar: [{ t: "titik", x: 50, y: 50, r: 1.6 }] },
  { no: 2, ket: "Garis lengkung kecil", gambar: [{ t: "path", d: "M18 22 q6 -8 12 0 t12 0" }] },
  { no: 3, ket: "Tiga garis bertingkat", gambar: [{ t: "path", d: "M30 86 v-10 M38 86 v-18 M46 86 v-26" }] },
  { no: 4, ket: "Kotak hitam kecil", gambar: [{ t: "kotak", x: 78, y: 14, s: 8 }] },
  { no: 5, ket: "Dua garis miring", gambar: [{ t: "path", d: "M18 82 l14 -14 M26 86 l14 -14" }] },
  { no: 6, ket: "Garis mendatar dan tegak", gambar: [{ t: "path", d: "M20 30 h22 M64 52 v24" }] },
  { no: 7, ket: "Titik-titik setengah lingkaran", gambar: [{ t: "titikTitik", cx: 74, cy: 78, r: 9 }] },
  { no: 8, ket: "Lengkungan besar", gambar: [{ t: "path", d: "M16 30 q34 -26 68 0" }] },
];

export const LATIHAN_GAMBAR = [
  {
    id: "wartegg",
    nama: "Wartegg (8 kotak)",
    menit: 12,
    perintah: "Lanjutkan setiap rangsang gambar di 8 kotak menjadi gambar yang bermakna. Urutan bebas, tetapi semua kotak harus diisi. Setelah selesai, beri judul singkat untuk setiap gambar.",
    tips: [
      "Isi KEDELAPAN kotak. Kotak kosong biasanya menjadi catatan negatif.",
      "Manfaatkan rangsang yang ada; jangan menimpanya dengan gambar yang tidak berhubungan.",
      "Variasikan isi: benda, makhluk hidup, pemandangan. Hindari gambar yang suram, menakutkan, atau senjata.",
      "Gambar jelas dan proporsional, tidak perlu artistik. Beri judul yang singkat dan positif.",
    ],
  },
  {
    id: "dap",
    nama: "Menggambar orang (DAP)",
    menit: 10,
    perintah: "Gambarlah seorang manusia secara utuh, dari kepala sampai kaki. Jangan menggambar kartun, stik, atau orang yang terpotong.",
    tips: [
      "Gambar utuh: kepala, wajah lengkap, leher, badan, tangan dengan jari, kaki dengan telapak.",
      "Ukuran sedang, kira-kira separuh sampai dua pertiga tinggi kertas, posisi di tengah.",
      "Garis tegas dan tidak putus-putus. Hindari menghapus berulang kali.",
      "Wajah menghadap depan dengan ekspresi netral atau tersenyum. Gambar orang yang sesuai jenis kelaminmu sendiri bila tidak ditentukan.",
    ],
  },
  {
    id: "htp",
    nama: "Rumah, pohon, orang (HTP)",
    menit: 12,
    perintah: "Gambarlah sebuah rumah, sebuah pohon, dan seorang manusia dalam satu kertas.",
    tips: [
      "Rumah lengkap dengan pintu, jendela, atap, dan jalan menuju pintu.",
      "Pohon berbatang jelas, bercabang, dan berdaun lebat, dengan akar atau garis tanah.",
      "Orang digambar utuh dengan ukuran wajar dibanding rumah dan pohon.",
      "Gunakan sebagian besar ruang kertas dan susun gambar secara seimbang.",
    ],
  },
  {
    id: "baum",
    nama: "Menggambar pohon (Baum)",
    menit: 8,
    perintah: "Gambarlah sebuah pohon berkayu, bukan pohon kelapa, pisang, bambu, atau cemara.",
    tips: [
      "Pilih pohon berkayu yang bercabang, misalnya pohon mangga atau beringin.",
      "Gambar batang, cabang, ranting, daun atau tajuk, dan garis tanah. Akar boleh digambar.",
      "Pohon sebaiknya tidak terpotong tepi kertas dan berada kurang lebih di tengah.",
      "Batang dan cabang tersambung dengan wajar; tajuk tidak terlalu kecil dibanding batang.",
    ],
  },
];

export const TIPS_GAMBAR = [
  "Tes gambar dinilai psikolog secara utuh bersama tes lain, bukan dari satu detail. Fokus pada kelengkapan dan kerapian.",
  "Pakai pensil dan gambar dengan garis yang tegas. Di tes sungguhan, siapkan pensil 2B dan penghapus sendiri.",
  "Perhatikan waktu. Gambar yang lengkap tetapi sederhana lebih baik daripada gambar detail yang tidak selesai.",
];
