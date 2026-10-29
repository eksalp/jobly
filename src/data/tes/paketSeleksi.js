/**
 * Paket simulasi seleksi per jenis perusahaan.
 *
 * Tahapan diringkas dari pemberitaan dan pengalaman peserta yang
 * dipublikasikan (lihat `sumber`). Setiap perusahaan bisa mengubah
 * tahapannya di setiap periode, jadi teks sengaja memakai kata
 * "umumnya" dan selalu mengarahkan ke pengumuman resmi.
 */

export const PAKET_SELEKSI = [
  {
    id: "bumn",
    nama: "Rekrutmen Bersama BUMN",
    ikon: "Landmark",
    ringkas: "Tes online serentak untuk banyak BUMN, lalu tes lanjutan di masing-masing BUMN.",
    tahap: [
      "Pendaftaran dan seleksi administrasi",
      "Tes online: Tes Kemampuan Dasar (TKD), tes core values AKHLAK, dan pada periode tertentu bahasa Inggris, wawasan kebangsaan, serta learning agility",
      "Tes Kemampuan Bidang (TKB) di BUMN tujuan: bisa berupa psikotes, tes bidang, wawancara, dan kesehatan",
    ],
    tes: ["rbb", "tkd", "akhlak", "twk", "learning", "inggris"],
    tips: [
      "Mulai dari Simulasi Tes Online RBB untuk merasakan ritme waktunya, lalu perkuat bagian yang nilainya paling rendah.",
      "TKD RBB umumnya terdiri dari empat jenis soal: verbal logical reasoning, number sequence, word classification, dan diagram reasoning.",
      "Nilai AKHLAK sering menjadi penentu. Kerjakan tes sikap kerja AKHLAK sampai kamu konsisten memilih respons yang menyelesaikan masalah sekaligus menjaga integritas.",
      "Latih TKD dengan batas waktu ketat. Soal TKD umumnya berupa verbal, numerik, figural, dan penalaran.",
      "Siapkan jawaban wawancara tentang kesediaan ditempatkan di seluruh Indonesia.",
    ],
    posisi: "Semua posisi BUMN untuk lulusan SMA/D3/S1",
    sumber: [
      ["Bisnis.com: Soal Tes Online Rekrutmen Bersama BUMN 2025", "https://kabar24.bisnis.com/read/20250419/15/1870226/soal-tes-online-rekrutmen-bersama-bumn-2025"],
      ["Dealls: Nilai AKHLAK BUMN", "https://dealls.com/pengembangan-karir/nilai-akhlak-bumn"],
    ],
  },
  {
    id: "pertamina",
    nama: "Pertamina",
    ikon: "Fuel",
    ringkas: "Program lulusan baru dan rekrutmen berpengalaman dengan tahapan psikotes, bahasa Inggris, dan beberapa kali wawancara.",
    tahap: [
      "Pendaftaran online dan seleksi administrasi",
      "Tes penyaringan, lalu psikotes dan tes bahasa Inggris (pernah dilakukan online)",
      "Wawancara online, klarifikasi tatap muka, dan wawancara user",
      "Pemeriksaan kesehatan",
    ],
    tes: ["tpa", "inggris", "akhlak", "kraepelin", "kepribadian", "disc"],
    tips: [
      "Sebagai BUMN, Pertamina juga memakai nilai AKHLAK. Siapkan contoh nyata untuk tiap nilai.",
      "Tes bahasa Inggris berbobot besar. Latih reading dan structure sampai stabil di atas target.",
      "Untuk posisi teknik, siapkan juga pemahaman K3 (keselamatan kerja).",
    ],
    posisi: "Engineer, operator, keuangan, SDM, IT, dan program lulusan baru",
    sumber: [["detikFinance: Jadi pegawai Pertamina harus lalui 7 tahap", "https://finance.detik.com/berita-ekonomi-bisnis/d-3658648/panjang-jadi-pegawai-pertamina-harus-lalui-7-tahap"]],
  },
  {
    id: "bi",
    nama: "Bank Indonesia (PCPM)",
    ikon: "Building2",
    ringkas: "Seleksi calon pegawai muda (Asisten Manajer) dengan tes potensi dasar, pengetahuan umum & kebanksentralan, bahasa Inggris, psikologi, kesehatan, dan wawancara.",
    tahap: [
      "Seleksi administrasi",
      "Tes Potensi Dasar (TPD) online: verbal (sinonim, antonim, analogi, silogisme, bacaan), numerik (aritmetika, deret, soal cerita), dan figural",
      "Tes pengetahuan umum, kebanksentralan, dan bahasa Inggris (structure, written expression, reading; tanpa listening)",
      "Tes psikologi: diskusi kelompok tanpa ketua (LGD), wawancara psikologis, dan tes tertulis seperti Pauli/Kraepelin, Wartegg, menggambar orang/pohon, dan EPPS",
      "Tes kesehatan (MCU) dan psikiatri, dilanjutkan wawancara pra-tahap akhir dan seleksi tahap akhir",
    ],
    tes: ["tpa", "bi", "inggris", "epps", "kraepelin", "gambar"],
    tips: [
      "Pelajari tugas dan instrumen Bank Indonesia (moneter, sistem pembayaran, makroprudensial) untuk tes kebanksentralan, lalu baca siaran pers RDG terbaru untuk angka terkini.",
      "LGD menilai kemunculan kepemimpinan tanpa jabatan formal: menstrukturkan masalah, mengajak yang pendiam, dan merangkum keputusan. Latih di Simulasi FGD.",
      "Siapkan 6 sampai 8 cerita pengalaman dengan kerangka STAR-L (Situation, Task, Action, Result, Learning) untuk wawancara psikologis dan wawancara akhir.",
      "EPPS, inventori, dan tes psikiatri menilai konsistensi. Jawab jujur dan konsisten dengan sikapmu di LGD dan wawancara.",
      "Latih menggambar orang dan pohon dengan lengkap dan proporsional dalam batas waktu.",
    ],
    posisi: "Lulusan S1/S2 berbagai jurusan (PCPM)",
    sumber: [["Dealls: Seleksi PCPM BI 2025", "https://dealls.com/pengembangan-karir/seleksi-penerimaan-pcpm-bi-2025"]],
  },
  {
    id: "bank",
    nama: "Bank BUMN & bank swasta (ODP/MT)",
    ikon: "Banknote",
    ringkas: "Program officer development dan MT bank umumnya menguji potensi akademik, bahasa Inggris, psikotes, dan wawancara.",
    tahap: [
      "Seleksi administrasi (IPK, usia, dan sertifikat bahasa Inggris bila disyaratkan)",
      "Tes potensi akademik dan bahasa Inggris",
      "Psikotes: tes kerja (Kraepelin/Pauli), kepribadian, kadang tes gambar",
      "Wawancara HR dan user, lalu pemeriksaan kesehatan",
    ],
    tes: ["tpa", "bi", "inggris", "kraepelin", "disc", "akhlak"],
    tips: [
      "Siapkan sertifikat TOEFL atau sejenisnya; banyak program bank mensyaratkan skor minimal.",
      "Ketelitian dan konsistensi kerja sangat diperhatikan di bank. Latih Kraepelin sampai grafikmu stabil.",
      "Bank BUMN juga memakai nilai AKHLAK.",
    ],
    posisi: "Officer development program, management trainee, relationship officer, teller, customer service",
    sumber: [["CIMB Niaga: Jenis psikotes kerja yang sering dijumpai", "https://www.cimbniaga.co.id/id/inspirasi/karir/jenis-psikotes-kerja-yang-sering-dijumpai"]],
  },
  {
    id: "astra",
    nama: "Astra & perusahaan swasta besar",
    ikon: "Factory",
    ringkas: "Peserta sering melaporkan psikotes klasik: logika, deret, tes kerja (Kraepelin/Pauli), tes gambar, dan kepribadian, lalu wawancara.",
    tahap: [
      "Seleksi administrasi dan tes online awal",
      "Psikotes: logika, deret angka, Kraepelin/Pauli, tes gambar (Wartegg, orang, atau pohon), dan kepribadian",
      "Wawancara HR dan user, kadang diskusi kelompok (LGD/FGD)",
      "Pemeriksaan kesehatan",
    ],
    tes: ["logika", "numerik", "kraepelin", "gambar", "disc", "cfit"],
    tips: [
      "Psikotes tatap muka biasanya panjang. Jaga energi: tidur cukup dan sarapan.",
      "Untuk Wartegg, lanjutkan semua 8 kotak dan manfaatkan setiap rangsang gambar.",
      "Latih juga simulasi FGD; diskusi kelompok sering dipakai untuk program MT.",
    ],
    posisi: "Management trainee, staf, operator produksi, sales",
    sumber: [["Jobstreet: Contoh soal tes psikotes kerja", "https://id.jobstreet.com/id/career-advice/article/contoh-soal-tes-psikotes-kerja-dan-tips-agar-lolos"]],
  },
  {
    id: "operasional",
    nama: "Posisi admin & operasional",
    ikon: "ClipboardList",
    ringkas: "Posisi yang menuntut ketelitian dan kecepatan biasanya menekankan tes kerja dan ketelitian.",
    tahap: ["Tes ketelitian dan kecepatan kerja", "Tes kemampuan dasar", "Wawancara"],
    tes: ["ketelitian", "kecermatan", "kraepelin", "armyalpha", "numerik", "disc"],
    tips: [
      "Ketelitian lebih penting daripada kecepatan. Jawaban salah sering mengurangi nilai.",
      "Biasakan bekerja dengan ritme stabil dari awal sampai akhir.",
    ],
    posisi: "Admin, data entry, kasir, staf gudang, operator",
    sumber: [],
  },
  {
    id: "teknis",
    nama: "Posisi teknik & IT",
    ikon: "Cpu",
    ringkas: "Selain tes bidang, posisi teknis sering menguji penalaran, spasial, dan bahasa Inggris teknis.",
    tahap: ["Tes kemampuan dasar dan penalaran", "Tes bidang (teknik/coding)", "Wawancara user"],
    tes: ["logika", "spasial", "cfit", "numerik", "inggris", "tipe16"],
    tips: [
      "Tes spasial dan CFIT bisa ditingkatkan dengan latihan pola yang rutin.",
      "Banyak dokumentasi teknis berbahasa Inggris; latih reading.",
    ],
    posisi: "Engineer, teknisi, programmer, data, QA",
    sumber: [],
  },
];

export const cariPaket = (id) => PAKET_SELEKSI.find((p) => p.id === id) || null;
