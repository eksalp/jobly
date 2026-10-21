/**
 * Panduan "nilai jual" portofolio per profesi.
 *
 * Perekrut dan klien jarang membaca hasil kerja dari awal sampai akhir.
 * Yang mereka cari: masalah apa yang diselesaikan, apa peranmu, dan
 * bukti hasilnya. Data ini dipakai untuk:
 *   • memberi arahan saat menyusun studi kasus,
 *   • menentukan bukti yang wajib dilampirkan (gambar/mockup untuk
 *     profesi visual, tautan untuk video/audio/kode),
 *   • menampilkan label format di katalog proyek.
 *
 * bukti (jenis bukti yang paling meyakinkan untuk profesi itu):
 *   "gambar"  → gambar hasil akhir / mockup
 *   "media"   → tautan video/audio (YouTube, Drive, SoundCloud)
 *   "kode"    → tautan demo atau repositori (GitHub, Vercel, Netlify)
 *   "dokumen" → tautan dan gambar opsional
 *
 * Bukti hanya WAJIB untuk tugas yang memang menghasilkan karya visual
 * (TUGAS_WAJIB_GAMBAR). Untuk tugas lain, bukti ditampilkan sebagai
 * "nilai tambah" yang disarankan.
 */
import { t } from "../i18n.js";

const UMUM = {
  bukti: "dokumen",
  nilai: t(
    "Tunjukkan bahwa kamu memahami kebutuhan klien, bekerja rapi, dan menanggapi revisi dengan baik.",
    "Show that you understood the client's need, worked carefully, and handled revisions well.",
  ),
  metrik: [
    t("Waktu pengerjaan dibanding tenggat (mis. selesai 1 hari lebih cepat)", "Turnaround versus deadline (e.g. delivered a day early)"),
    t("Jumlah revisi yang dibutuhkan sampai klien setuju", "How many revisions it took to get sign-off"),
    t("Apa yang menjadi lebih mudah, cepat, atau hemat bagi klien", "What became easier, faster, or cheaper for the client"),
  ],
};

const PER_KATEGORI = {
  menulis: {
    bukti: "dokumen",
    nilai: t(
      "Klien membeli tulisan yang membuat pembaca bertindak. Tunjukkan target pembaca, sudut pandang yang kamu pilih, dan alasan di balik pilihan kata.",
      "Clients buy writing that makes readers act. Show the target reader, the angle you chose, and the reasoning behind your wording.",
    ),
    metrik: [
      t("Target kata kunci dan perkiraan volume pencarian", "Target keyword and estimated search volume"),
      t("Skor keterbacaan (mis. Flesch/Hemingway) sebelum dan sesudah", "Readability score (e.g. Flesch/Hemingway) before and after"),
      t("Panjang tulisan dibanding brief, dan berapa kali revisi", "Length versus brief, and number of revisions"),
    ],
  },
  desain: {
    bukti: "gambar",
    nilai: t(
      "Perekrut menilai desain dengan mata. Tampilkan gambar hasil akhir dalam bentuk mockup, ditambah alasan singkat di balik warna, huruf, dan tata letak.",
      "Recruiters judge design visually. Show final images as mockups, plus short reasoning behind colour, type, and layout.",
    ),
    metrik: [
      t("Jumlah aset yang dihasilkan (mis. 9 template feed, 3 ukuran banner)", "Number of assets produced (e.g. 9 feed templates, 3 banner sizes)"),
      t("Konsistensi dengan identitas merek: palet dan font yang dipakai", "Brand consistency: palette and fonts used"),
      t("Waktu klien membuat konten berikutnya setelah memakai template", "How much faster the client creates new content with the templates"),
    ],
  },
  teknologi: {
    bukti: "kode",
    nilai: t(
      "Klien teknologi ingin melihat hasil yang berjalan. Sertakan tautan demo atau repositori, tangkapan layar, dan masalah teknis yang kamu pecahkan.",
      "Tech clients want to see something running. Include a demo or repository link, screenshots, and the technical problem you solved.",
    ),
    metrik: [
      t("Skor PageSpeed/Lighthouse sebelum dan sesudah", "PageSpeed/Lighthouse score before and after"),
      t("Waktu proses manual yang dihemat per minggu", "Manual hours saved per week"),
      t("Jumlah bug yang ditutup atau error yang hilang", "Bugs closed or errors eliminated"),
    ],
  },
  pemasaran: {
    bukti: "dokumen",
    nilai: t(
      "Pemasaran dinilai dari angka. Tunjukkan target, strategi, dan proyeksi hasil yang realistis, dan tampilkan contoh konten atau iklannya bila ada.",
      "Marketing is judged by numbers. Show the goal, the strategy, and realistic projected results, and include sample content or ads where possible.",
    ),
    metrik: [
      t("Target CTR, CPC, atau ROAS dan dasar perhitungannya", "Target CTR, CPC, or ROAS and how you got there"),
      t("Perkiraan jangkauan atau trafik dari strategi yang diusulkan", "Estimated reach or traffic from the proposed strategy"),
      t("Anggaran per kanal dan alasannya", "Budget per channel and the reasoning"),
    ],
  },
  data: {
    bukti: "dokumen",
    nilai: t(
      "Data bernilai kalau menghasilkan keputusan. Tunjukkan data awal, cara kamu membersihkan dan mengolahnya, lalu temuan utama dalam satu kalimat.",
      "Data matters when it drives a decision. Show the raw data, how you cleaned and processed it, then the key finding in one sentence.",
    ),
    metrik: [
      t("Jumlah baris yang diolah dan persentase data yang diperbaiki", "Rows processed and percentage of records fixed"),
      t("Tingkat akurasi atau konsistensi setelah dibersihkan", "Accuracy or consistency after cleaning"),
      t("Keputusan yang bisa diambil klien dari temuanmu", "The decision the client can make from your finding"),
    ],
  },
  keuangan: {
    bukti: "dokumen",
    nilai: t(
      "Klien keuangan butuh ketelitian dan kepatuhan. Tunjukkan angka yang bisa ditelusuri, asumsi yang jelas, dan risiko yang kamu tandai.",
      "Finance clients need accuracy and compliance. Show traceable numbers, clear assumptions, and the risks you flagged.",
    ),
    metrik: [
      t("Selisih atau kesalahan yang ditemukan (Rp atau jumlah transaksi)", "Discrepancies found (in rupiah or number of transactions)"),
      t("Waktu tutup buku atau penyusunan laporan yang dipersingkat", "Time cut from month-end close or reporting"),
      t("Asumsi utama dan analisis sensitivitasnya", "Key assumptions and their sensitivity"),
    ],
  },
  admin: {
    bukti: "dokumen",
    nilai: t(
      "Klien admin membeli ketenangan pikiran. Tunjukkan sistem yang kamu buat supaya pekerjaan rapi, cepat, dan tidak ada yang terlewat.",
      "Admin clients buy peace of mind. Show the system you set up so work is tidy, fast, and nothing slips through.",
    ),
    metrik: [
      t("Jumlah email, tiket, atau jadwal yang ditangani", "Emails, tickets, or appointments handled"),
      t("Waktu respons rata-rata", "Average response time"),
      t("Templat atau SOP yang bisa dipakai ulang", "Reusable templates or SOPs created"),
    ],
  },
  pendidikan: {
    bukti: "dokumen",
    nilai: t(
      "Yang dicari adalah dampak pada peserta belajar. Tunjukkan tujuan belajar, materi atau soal yang kamu susun, dan cara mengukur keberhasilannya.",
      "What matters is the impact on learners. Show the learning goals, the material or questions you built, and how success is measured.",
    ),
    metrik: [
      t("Tujuan belajar yang dicakup dan tingkat kesulitannya", "Learning objectives covered and difficulty levels"),
      t("Perkiraan waktu belajar atau jumlah soal per tingkat", "Estimated study time or questions per level"),
      t("Perubahan yang diharapkan pada peserta (mis. skor, kepercayaan diri)", "Expected learner change (e.g. scores, confidence)"),
    ],
  },
};

/** Penyesuaian khusus profesi. */
const PER_PROFESI = {
  "admin-media-sosial": {
    bukti: "gambar",
    nilai: t(
      "Tampilkan kalender konten dan contoh unggahan dalam bentuk mockup layar HP. Perekrut ingin melihat konsistensi visual dan pemahaman audiens.",
      "Show the content calendar and sample posts as phone-screen mockups. Recruiters want visual consistency and audience understanding.",
    ),
  },
  "video-editor": {
    bukti: "media",
    nilai: t(
      "Video editor dinilai dari hasil tontonan. Selain rencana edit, tautan video yang sudah jadi (YouTube, Drive, atau Instagram) beserta thumbnail adalah bukti paling kuat.",
      "Editors are judged on the watch. Beyond the edit plan, a finished video link (YouTube, Drive, or Instagram) with a thumbnail is the strongest proof.",
    ),
    metrik: [
      t("Durasi akhir dibanding bahan mentah", "Final length versus raw footage"),
      t("Hook 3 detik pertama dan perkiraan retensi", "The 3-second hook and expected retention"),
      t("Format yang dihasilkan (9:16, 1:1, 16:9)", "Formats delivered (9:16, 1:1, 16:9)"),
    ],
  },
  "motion-graphics": {
    bukti: "media",
    nilai: t(
      "Animasi paling meyakinkan bila bisa ditonton. Sertakan frame kunci storyboard sebagai gambar, dan tautan video bila kamu membuat versi jadinya.",
      "Animation convinces best when it can be watched. Include storyboard key frames as images, and a video link if you produce the finished piece.",
    ),
  },
  "voice-over-audio": {
    bukti: "media",
    nilai: t(
      "Klien ingin mendengar suaramu. Tambahkan tautan rekaman (Drive, SoundCloud, atau YouTube) dan catatan teknis: mikrofon, durasi, format berkas.",
      "Clients want to hear you. Add a recording link (Drive, SoundCloud, or YouTube) plus technical notes: mic, duration, file format.",
    ),
  },
  "visualisasi-data": {
    bukti: "gambar",
    nilai: t(
      "Dashboard harus terlihat. Lampirkan tangkapan layar dashboard dan jelaskan pertanyaan bisnis yang dijawab setiap grafik.",
      "A dashboard has to be seen. Attach dashboard screenshots and explain the business question each chart answers.",
    ),
  },
  "desain-presentasi": {
    bukti: "gambar",
    nilai: t(
      "Lampirkan slide sebelum dan sesudah. Perekrut ingin melihat bagaimana kamu menyederhanakan informasi menjadi alur cerita yang meyakinkan.",
      "Attach before-and-after slides. Recruiters want to see how you turn information into a persuasive storyline.",
    ),
  },
  "web-developer": {
    bukti: "kode",
    nilai: t(
      "Sertakan tautan situs yang bisa dibuka dan tangkapan layar versi desktop dan HP. Jelaskan teknologi yang dipakai dan alasannya.",
      "Include a live link and desktop and mobile screenshots. Explain the stack you used and why.",
    ),
  },
  "app-developer": {
    bukti: "kode",
  },
  "bot-otomasi": {
    bukti: "kode",
    nilai: t(
      "Tunjukkan alur otomasi (diagram atau tangkapan layar) dan berapa jam kerja manual yang dihemat. Tautan ke repositori atau rekaman demo sangat membantu.",
      "Show the automation flow (diagram or screenshots) and how many manual hours it saves. A repo link or demo recording helps a lot.",
    ),
  },
  "ai-specialist": {
    bukti: "kode",
    nilai: t(
      "Tunjukkan prompt atau alur chatbot, contoh percakapan sebelum dan sesudah perbaikan, dan cara kamu menguji akurasinya.",
      "Show the prompt or chatbot flow, before-and-after conversations, and how you tested accuracy.",
    ),
  },
  "bug-maintenance": { bukti: "kode" },
  "ads-specialist": {
    nilai: t(
      "Tampilkan struktur kampanye, contoh materi iklan (gambar atau teks), dan perhitungan anggaran terhadap target CPA atau ROAS.",
      "Show the campaign structure, sample ad creatives (images or copy), and the budget maths against the CPA or ROAS target.",
    ),
  },
  "email-marketing": {
    nilai: t(
      "Tampilkan alur email (sequence), contoh email yang sudah jadi, dan target open rate serta click rate yang realistis untuk industrinya.",
      "Show the email sequence, finished sample emails, and realistic open and click rate targets for the industry.",
    ),
  },
  "data-entry": {
    nilai: t(
      "Data entry dinilai dari ketelitian dan kecepatan. Tunjukkan jumlah data, aturan pembersihan yang kamu pakai, dan pemeriksaan ganda yang kamu lakukan.",
      "Data entry is judged on accuracy and speed. Show the volume, the cleaning rules you applied, and how you double-checked.",
    ),
  },
  "customer-support": {
    nilai: t(
      "Tunjukkan contoh balasan yang menenangkan pelanggan yang marah, templat yang bisa dipakai ulang, dan cara kamu memastikan masalah benar-benar selesai.",
      "Show replies that calm upset customers, reusable templates, and how you make sure the issue is truly resolved.",
    ),
  },
  "career-coach": {
    nilai: t(
      "Tunjukkan CV sebelum dan sesudah (dengan data pribadi disamarkan) dan alasan setiap perubahan. Itu bukti paling meyakinkan bagi calon klien.",
      "Show a before-and-after CV (with personal details masked) and the reason for each change. It's the most convincing proof for prospects.",
    ),
  },
};

/** Tugas yang hasilnya karya visual: wajib melampirkan minimal 1 gambar. */
const TUGAS_WAJIB_GAMBAR = new Set([
  "desainer-grafis:0", // konsep feed → 3 template dalam mockup
  "desain-logo-branding:1", // presentasi logo → logo + penerapan
  "ilustrator:0", // maskot → sketsa karakter dan ekspresi
  "desain-presentasi:0", // rombak slide → sebelum & sesudah
  "visualisasi-data:0", // rancangan dashboard → mockup dashboard
]);

export const JENIS_BUKTI = {
  gambar: {
    label: t("Gambar / mockup wajib", "Images / mockups required"),
    saran: t("Nilai tambah: gambar atau mockup", "Bonus: images or mockups"),
    pendek: t("Mockup", "Mockups"),
    petunjuk: t(
      "Unggah hasil akhir dalam bentuk mockup (mis. feed di layar HP, logo di kartu nama, poster di dinding). Gambar mentah tanpa konteks kurang meyakinkan.",
      "Upload final work as mockups (e.g. a feed on a phone screen, a logo on a business card, a poster on a wall). Raw images without context are less convincing.",
    ),
    minGambar: 1,
    perluTautan: false,
  },
  media: {
    label: t("Tautan video/audio wajib", "Video/audio link required"),
    saran: t("Nilai tambah: tautan video/audio", "Bonus: a video/audio link"),
    pendek: t("Video/audio", "Video/audio"),
    petunjuk: t(
      "Unggah video atau audio ke YouTube (unlisted), Google Drive (akses: siapa saja yang memiliki link), atau SoundCloud, lalu tempel tautannya. Tambahkan thumbnail atau frame kunci sebagai gambar.",
      "Upload the video or audio to YouTube (unlisted), Google Drive (anyone with the link), or SoundCloud, then paste the link. Add a thumbnail or key frames as images.",
    ),
    minGambar: 0,
    perluTautan: true,
  },
  kode: {
    label: t("Tautan demo/repositori wajib", "Demo/repo link required"),
    saran: t("Nilai tambah: demo atau repositori", "Bonus: a demo or repository"),
    pendek: t("Demo/GitHub", "Demo/GitHub"),
    petunjuk: t(
      "Tempel tautan demo yang bisa dibuka (Vercel, Netlify, situs WordPress) atau repositori GitHub publik. Tambahkan tangkapan layar versi desktop dan HP.",
      "Paste a working demo link (Vercel, Netlify, a WordPress site) or a public GitHub repo. Add desktop and mobile screenshots.",
    ),
    minGambar: 0,
    perluTautan: true,
  },
  dokumen: {
    label: t("Lampiran opsional", "Attachments optional"),
    saran: t("Lampiran opsional", "Attachments optional"),
    pendek: "",
    petunjuk: t(
      "Opsional: tambahkan tangkapan layar dokumen, grafik, atau tabel yang paling menunjukkan hasil kerjamu.",
      "Optional: add screenshots of the document, chart, or table that best shows your work.",
    ),
    minGambar: 0,
    perluTautan: false,
  },
};

const SARAN_HASIL_JADI = {
  gambar: t(
    "Brief ini berupa perencanaan. Supaya bernilai jual, buat juga versi jadinya (mis. di Canva atau Figma) lalu unggah mockupnya di sini.",
    "This brief is a plan. To make it sell, also produce the finished piece (e.g. in Canva or Figma) and upload mockups here.",
  ),
  media: t(
    "Brief ini berupa perencanaan. Nilainya naik berkali lipat bila kamu juga membuat versi jadinya dan menempel tautan video atau audionya.",
    "This brief is a plan. Its value multiplies if you also produce the finished piece and paste the video or audio link.",
  ),
  kode: t(
    "Brief ini berupa dokumen kerja. Bila sempat, buat contoh kecil yang berjalan (repositori atau demo) dan tempel tautannya. Itu bukti terkuat bagi klien teknologi.",
    "This brief is a working document. If you can, build a small working example (repo or demo) and paste the link. It's the strongest proof for tech clients.",
  ),
};

/** Panduan nilai jual untuk satu proyek (profesi + nomor tugas). */
export function panduanJual(profesi, kategori, tugas) {
  const k = PER_KATEGORI[kategori] || UMUM;
  const p = PER_PROFESI[profesi] || {};
  const bukti = p.bukti || k.bukti || "dokumen";
  const dasar = JENIS_BUKTI[bukti];
  const wajib = bukti === "gambar" && TUGAS_WAJIB_GAMBAR.has(`${profesi}:${tugas}`);
  const jenis = {
    ...dasar,
    label: wajib ? dasar.label : dasar.saran,
    petunjuk: wajib || bukti === "dokumen" ? dasar.petunjuk : `${SARAN_HASIL_JADI[bukti]} ${dasar.petunjuk}`,
    minGambar: wajib ? dasar.minGambar : 0,
    perluTautan: false,
  };
  return { bukti, wajib, jenis, nilai: p.nilai || k.nilai, metrik: p.metrik || k.metrik };
}

/* --------------------------------------------------------------- */
/*  Studi kasus                                                     */
/* --------------------------------------------------------------- */

export const BIDANG_STUDI = [
  {
    k: "ringkasan",
    label: t("Ringkasan satu kalimat", "One-line summary"),
    bantu: t(
      "Rumus: Membantu [klien] [mencapai hasil] dengan [cara]. Ini yang pertama dibaca perekrut.",
      "Formula: Helped [client] [achieve outcome] by [method]. Recruiters read this first.",
    ),
    contoh: t(
      "Membantu toko roti rumahan tampil konsisten di Instagram dengan 3 template feed yang selaras dengan logo.",
      "Helped a home bakery look consistent on Instagram with 3 feed templates aligned to its logo.",
    ),
    min: 30,
    maks: 200,
    baris: 2,
  },
  {
    k: "tantangan",
    label: t("Tantangan klien", "The client's challenge"),
    bantu: t(
      "Apa masalahnya, siapa yang terdampak, dan apa yang dipertaruhkan jika tidak diselesaikan?",
      "What was the problem, who was affected, and what was at stake if it wasn't solved?",
    ),
    min: 60,
    maks: 1200,
    baris: 4,
  },
  {
    k: "peran",
    label: t("Peranku & alat yang dipakai", "My role & tools"),
    bantu: t("Bagian mana yang kamu kerjakan sendiri, dan alat apa yang dipakai (Canva, Figma, Excel, WordPress, dan sebagainya)?", "Which parts did you do yourself, and which tools did you use (Canva, Figma, Excel, WordPress, etc.)?"),
    min: 20,
    maks: 600,
    baris: 2,
  },
  {
    k: "proses",
    label: t("Pendekatan & proses", "Approach & process"),
    bantu: t(
      "Langkah utama yang kamu ambil dan alasannya. Sebutkan juga keputusan penting dan alternatif yang kamu tolak.",
      "The main steps you took and why. Mention key decisions and alternatives you rejected.",
    ),
    min: 60,
    maks: 2000,
    baris: 5,
  },
  {
    k: "hasil",
    label: t("Hasil & dampak", "Results & impact"),
    bantu: t(
      "Sebutkan hasil yang konkret dan terukur. Karena ini proyek latihan, tulis sebagai hasil yang dihasilkan atau proyeksi dengan dasar perhitungan, bukan klaim penjualan nyata.",
      "Be concrete and measurable. As this is a practice project, describe outputs or projections with their basis, not real sales claims.",
    ),
    min: 60,
    maks: 1500,
    baris: 4,
  },
  {
    k: "pelajaran",
    label: t("Pelajaran & langkah berikutnya", "Lessons & next steps"),
    bantu: t("Apa yang kamu pelajari, dan apa yang akan kamu lakukan berbeda atau tambahkan bila proyek dilanjutkan?", "What did you learn, and what would you do differently or add next?"),
    min: 0,
    maks: 800,
    baris: 3,
  },
];

const panjang = (s) => String(s || "").trim().length;

export function studiLengkap(studi) {
  return BIDANG_STUDI.every((b) => panjang(studi?.[b.k]) >= b.min);
}

/** Bukti wajib sudah dipenuhi? */
export function buktiLengkap(panduan, data) {
  const j = panduan.jenis;
  const gambar = Array.isArray(data?.lampiran) ? data.lampiran.length : 0;
  const tautan = /^https?:\/\/\S+\.\S+/i.test(String(data?.tautan || "").trim());
  return gambar >= j.minGambar && (!j.perluTautan || tautan);
}

export const MAKS_GAMBAR = 6;
