/**
 * Tes sikap kerja (situational judgement) berbasis core values BUMN
 * AKHLAK: Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif.
 *
 * Format sama dengan bank soal lain: jawaban paling tepat ada di o[0]
 * (diacak saat ditampilkan), `b` = nilai yang diukur, `e` = alasan.
 * Di tes sungguhan pilihan sering sama-sama "baik"; yang dicari adalah
 * respons PALING sesuai dengan nilai, bukan sekadar yang aman.
 */

export const BANK_AKHLAK = [
  // ---------------------------------------------------------- Amanah
  {
    b: "Amanah",
    q: "Atasan memintamu menandatangani daftar hadir pelatihan atas nama rekan yang tidak hadir, dengan alasan 'supaya laporan ke kantor pusat rapi'. Apa yang kamu lakukan?",
    o: [
      "Menolak dengan sopan, lalu menawarkan untuk mencatat ketidakhadiran rekan beserta alasannya di laporan",
      "Menandatangani sekali ini saja karena perintah atasan",
      "Meminta rekan tersebut menandatangani sendiri keesokan harinya dengan tanggal mundur",
      "Diam saja dan tidak melakukan apa-apa sampai atasan lupa",
    ],
    e: "Amanah berarti memegang teguh kepercayaan dan jujur. Memalsukan kehadiran, langsung atau dengan tanggal mundur, tetap tidak jujur. Jawaban terbaik menolak dengan sopan sekaligus memberi solusi agar laporan tetap rapi dan benar.",
  },
  {
    b: "Amanah",
    q: "Kamu menemukan kesalahan input di laporan keuangan bulan lalu yang sudah ditandatangani manajer. Kesalahannya kecil dan belum ada yang menyadari. Sikapmu?",
    o: [
      "Melaporkan temuan ke manajer beserta usulan koreksinya",
      "Memperbaikinya diam-diam di laporan bulan ini supaya totalnya seimbang",
      "Membiarkannya karena nilainya kecil dan laporan sudah ditandatangani",
      "Menceritakannya ke rekan satu tim lebih dulu untuk melihat reaksi mereka",
    ],
    e: "Integritas data keuangan tidak bergantung pada besar kecilnya nilai. Melaporkan secara terbuka beserta solusi menunjukkan tanggung jawab. Mengoreksi diam-diam justru menimbulkan selisih yang tidak bisa ditelusuri.",
  },
  {
    b: "Amanah",
    q: "Seorang vendor yang sedang ikut tender di unitmu mengirim parsel Lebaran bernilai cukup besar ke rumahmu. Apa yang kamu lakukan?",
    o: [
      "Mengembalikan parsel dan melaporkannya sesuai aturan gratifikasi perusahaan",
      "Menerimanya karena hanya parsel hari raya dan tidak memengaruhi penilaian",
      "Membagikan isinya ke rekan kantor supaya tidak dinikmati sendiri",
      "Menyimpannya sampai tender selesai, lalu memutuskan",
    ],
    e: "Pemberian dari pihak yang sedang berkepentingan merupakan gratifikasi yang wajib ditolak atau dilaporkan. Membagikan ke rekan tidak menghilangkan konflik kepentingannya.",
  },
  {
    b: "Amanah",
    q: "Target bulananmu hampir tercapai, tetapi kurang sedikit. Rekan menyarankan mencatat penjualan bulan depan ke bulan ini. Sikapmu?",
    o: [
      "Menolak dan melaporkan pencapaian apa adanya, beserta rencana menutup kekurangannya",
      "Mengikuti saran karena toh penjualan itu memang akan terjadi",
      "Mencatatnya, tetapi memberi catatan kecil di sistem",
      "Meminta pelanggan membayar uang muka fiktif lebih dulu",
    ],
    e: "Memajukan pencatatan adalah manipulasi data. Pegawai yang amanah melaporkan kinerja sesuai fakta dan bertanggung jawab atas kekurangannya.",
  },
  // --------------------------------------------------------- Kompeten
  {
    b: "Kompeten",
    q: "Kamu dipindahkan ke unit baru yang memakai sistem aplikasi yang belum pernah kamu gunakan. Minggu depan sudah harus mulai menangani pekerjaan. Langkah terbaikmu?",
    o: [
      "Mempelajari panduan dan meminta sesi singkat dengan pengguna senior sebelum minggu depan",
      "Menunggu pelatihan resmi dari perusahaan sebelum mulai bekerja",
      "Meminta atasan menunda penugasan sampai kamu benar-benar siap",
      "Langsung mengerjakan tugas dan belajar dari kesalahan yang muncul",
    ],
    e: "Kompeten berarti terus meningkatkan kapabilitas secara proaktif. Belajar mandiri ditambah meminta bimbingan menyiapkanmu tepat waktu tanpa mengorbankan kualitas.",
  },
  {
    b: "Kompeten",
    q: "Hasil kerjamu dikritik keras oleh atasan di depan tim karena dianggap kurang teliti. Menurutmu sebagian kritik itu kurang tepat. Bagaimana responsmu?",
    o: [
      "Menerima kritik, meminta waktu bicara empat mata untuk memahami poinnya, lalu menyampaikan data pendukung dengan tenang",
      "Langsung membantah di depan tim agar nama baik tetap terjaga",
      "Diam dan menganggap kritik itu tidak perlu ditindaklanjuti",
      "Menyampaikan keberatan ke atasan dari atasanmu",
    ],
    e: "Kompeten mencakup terbuka terhadap umpan balik untuk memperbaiki diri. Klarifikasi empat mata dengan data menjaga profesionalisme dan hubungan kerja.",
  },
  {
    b: "Kompeten",
    q: "Pekerjaan rutinmu memakan 3 jam setiap hari karena banyak proses salin-tempel data. Kamu melihat proses ini bisa diotomasi dengan rumus dan template. Apa yang kamu lakukan?",
    o: [
      "Membuat prototipe template, menguji hasilnya, lalu mengusulkannya ke atasan",
      "Tetap mengikuti cara lama karena sudah menjadi prosedur",
      "Langsung mengganti cara kerja tanpa memberi tahu siapa pun",
      "Menunggu ada instruksi resmi untuk memperbaiki proses",
    ],
    e: "Kompeten berarti menyelesaikan tugas dengan kualitas terbaik dan terus berinovasi. Prototipe yang teruji lalu diusulkan menunjukkan inisiatif tanpa melanggar prosedur.",
  },
  {
    b: "Kompeten",
    q: "Kamu diminta membantu proyek di luar bidang keahlianmu. Kamu tidak yakin bisa berkontribusi banyak. Sikapmu?",
    o: [
      "Menerima, memetakan bagian yang bisa kamu kerjakan, dan mempelajari hal baru yang dibutuhkan",
      "Menolak karena bukan bidang keahlianmu",
      "Menerima tetapi hanya mengerjakan tugas administratif",
      "Menerima dengan syarat diberi tambahan insentif",
    ],
    e: "Proyek lintas bidang adalah kesempatan mengembangkan kompetensi. Memetakan kontribusi yang realistis sambil belajar adalah sikap paling produktif.",
  },
  // --------------------------------------------------------- Harmonis
  {
    b: "Harmonis",
    q: "Dua rekan satu timmu berselisih soal pembagian tugas, dan suasana kerja menjadi tidak nyaman. Kamu bukan atasan mereka. Apa yang kamu lakukan?",
    o: [
      "Mengajak keduanya duduk bersama untuk memperjelas pembagian tugas berdasarkan fakta, dan melibatkan atasan bila buntu",
      "Tidak ikut campur karena bukan urusanmu",
      "Memihak rekan yang menurutmu benar",
      "Langsung melaporkan keduanya ke HR",
    ],
    e: "Harmonis berarti saling peduli dan menghargai perbedaan. Memfasilitasi dialog berbasis fakta membantu tim, dan eskalasi ke atasan tetap menjadi pilihan bila tidak selesai.",
  },
  {
    b: "Harmonis",
    q: "Rekan baru dari daerah lain sering diejek karena logat bicaranya. Beberapa rekan menganggapnya hanya bercanda. Sikapmu?",
    o: [
      "Menegur dengan sopan rekan yang mengejek dan mengajak rekan baru bergabung dalam kegiatan tim",
      "Ikut tertawa agar suasana tetap cair",
      "Menyarankan rekan baru memperbaiki logatnya",
      "Diam karena tidak ingin bermasalah dengan rekan lama",
    ],
    e: "Harmonis berarti menghargai setiap orang apa pun latar belakangnya dan membangun lingkungan kerja yang kondusif. Candaan yang merendahkan tetap perlu dihentikan.",
  },
  {
    b: "Harmonis",
    q: "Kamu tidak setuju dengan pendapat rekan senior dalam rapat. Pendapatmu didukung data yang cukup kuat. Cara terbaik menyampaikannya?",
    o: [
      "Mengapresiasi pendapatnya, lalu menyampaikan data dan usulanmu dengan bahasa yang santun",
      "Diam karena menghormati senioritas",
      "Menyampaikannya setelah rapat kepada rekan lain",
      "Langsung menyatakan pendapatnya keliru agar rapat efisien",
    ],
    e: "Harmonis tidak berarti menghindari perbedaan pendapat, tetapi menyampaikannya dengan saling menghargai. Data membuat diskusi objektif.",
  },
  {
    b: "Harmonis",
    q: "Seorang pelanggan marah dan berkata kasar karena layanan terlambat, padahal keterlambatan disebabkan unit lain. Responsmu?",
    o: [
      "Mendengarkan dengan tenang, meminta maaf atas ketidaknyamanannya, dan memastikan penyelesaiannya ditindaklanjuti",
      "Menjelaskan bahwa kesalahan ada di unit lain, bukan di unitmu",
      "Memintanya berbicara lebih sopan sebelum dilayani",
      "Mengalihkan pelanggan ke unit yang bersalah",
    ],
    e: "Di mata pelanggan, perusahaan adalah satu kesatuan. Empati dan tindak lanjut nyata menjaga hubungan baik dengan pelanggan.",
  },
  // ------------------------------------------------------------ Loyal
  {
    b: "Loyal",
    q: "Di grup WhatsApp alumni, beberapa orang menyebarkan informasi keliru tentang perusahaanmu. Sikapmu?",
    o: [
      "Meluruskan dengan informasi resmi yang sudah dipublikasikan, tanpa membuka data internal",
      "Membela perusahaan dengan data internal agar lebih meyakinkan",
      "Membiarkan saja karena bukan tugasmu",
      "Ikut berkomentar negatif agar tidak dianggap terlalu membela",
    ],
    e: "Loyal berarti menjaga nama baik perusahaan sekaligus menjaga kerahasiaan. Meluruskan dengan informasi resmi adalah cara yang tepat.",
  },
  {
    b: "Loyal",
    q: "Perusahaan pesaing menawarimu gaji lebih tinggi dengan syarat membawa data pelanggan dari kantormu sekarang. Apa yang kamu lakukan?",
    o: [
      "Menolak syarat tersebut karena data pelanggan adalah rahasia perusahaan",
      "Menerima karena data pelanggan juga hasil kerjamu",
      "Bernegosiasi agar cukup membawa sebagian data",
      "Menerima tawaran, tetapi menunda menyerahkan data",
    ],
    e: "Menjaga rahasia perusahaan adalah bentuk loyalitas dan kepatuhan hukum. Pindah kerja itu wajar, tetapi membawa data perusahaan tidak.",
  },
  {
    b: "Loyal",
    q: "Ada kebijakan baru perusahaan yang menurutmu kurang tepat dan membuat pekerjaan timmu bertambah. Bagaimana sikapmu?",
    o: [
      "Menjalankan kebijakan sambil menyampaikan masukan melalui jalur resmi beserta data dampaknya",
      "Menjalankan setengah hati sampai kebijakan diubah",
      "Mengeluhkan kebijakan di media sosial pribadi",
      "Mengajak tim tidak menjalankannya bersama-sama",
    ],
    e: "Loyal berarti patuh pada keputusan organisasi sambil berkontribusi memperbaikinya lewat jalur yang benar.",
  },
  {
    b: "Loyal",
    q: "Menjelang jam pulang, ada gangguan layanan yang berdampak besar pada pelanggan. Tim yang bertugas kekurangan orang. Kamu sudah punya janji pribadi yang bisa dijadwal ulang. Sikapmu?",
    o: [
      "Menjadwal ulang janji dan membantu penanganan gangguan sampai situasi terkendali",
      "Pulang karena jam kerjamu sudah selesai",
      "Membantu sebentar lalu pulang tanpa memberi tahu tim",
      "Menawarkan bantuan hanya jika dibayar lembur",
    ],
    e: "Loyal mencakup kesediaan berkorban demi kepentingan organisasi yang lebih besar, terutama saat krisis dan selama janji pribadimu memang bisa ditunda.",
  },
  // ---------------------------------------------------------- Adaptif
  {
    b: "Adaptif",
    q: "Unitmu beralih dari laporan kertas ke aplikasi digital. Beberapa rekan senior kesulitan dan menolak memakainya. Apa yang kamu lakukan?",
    o: [
      "Menawarkan pendampingan singkat dan membuat panduan sederhana untuk rekan yang kesulitan",
      "Melaporkan rekan yang menolak ke atasan",
      "Mengerjakan input mereka diam-diam supaya target tercapai",
      "Membiarkan karena setiap orang bertanggung jawab atas dirinya sendiri",
    ],
    e: "Adaptif berarti cepat menyesuaikan diri dan mendorong perubahan ke arah yang lebih baik. Membantu rekan beradaptasi mempercepat perubahan tim.",
  },
  {
    b: "Adaptif",
    q: "Di tengah proyek, prioritas perusahaan berubah sehingga rencana kerja timmu harus dirombak total. Responsmu?",
    o: [
      "Segera memahami prioritas baru, menyusun ulang rencana, dan mengomunikasikannya ke pihak terkait",
      "Meminta rencana lama tetap dilanjutkan karena sudah setengah jalan",
      "Menunggu instruksi detail sebelum melakukan apa pun",
      "Mengerjakan rencana lama dan baru sekaligus tanpa prioritas",
    ],
    e: "Adaptif berarti bertindak proaktif dalam menghadapi perubahan. Menyusun ulang rencana dan berkomunikasi menjaga proyek tetap terarah.",
  },
  {
    b: "Adaptif",
    q: "Kamu ditempatkan di kantor cabang daerah terpencil dengan fasilitas terbatas. Sikapmu dalam bulan pertama?",
    o: [
      "Mempelajari kondisi setempat, membangun hubungan dengan rekan dan masyarakat, dan mencari cara kerja yang efektif",
      "Segera mengajukan permohonan pindah",
      "Bekerja seadanya sambil menunggu masa penempatan selesai",
      "Membandingkan terus dengan kantor pusat dan menuntut fasilitas sama",
    ],
    e: "Kesediaan ditempatkan di mana saja dan cepat menyesuaikan diri adalah wujud nilai Adaptif yang sering diuji di seleksi BUMN.",
  },
  {
    b: "Adaptif",
    q: "Teknologi baru membuat sebagian tugas rutinmu dikerjakan otomatis. Kamu khawatir peranmu berkurang. Sikap terbaikmu?",
    o: [
      "Mempelajari teknologi itu dan mencari peran bernilai tambah, misalnya analisis atau layanan pelanggan",
      "Menunjukkan kelemahan teknologi baru agar tetap dibutuhkan",
      "Menolak memakai teknologi tersebut",
      "Diam dan berharap perubahan tidak berdampak padamu",
    ],
    e: "Adaptif berarti melihat perubahan sebagai peluang untuk meningkatkan nilai diri, bukan ancaman yang harus dihindari.",
  },
  // ------------------------------------------------------- Kolaboratif
  {
    b: "Kolaboratif",
    q: "Unit lain meminta bantuan datamu untuk proyek mereka, padahal timmu juga sedang sibuk. Data itu tidak rahasia. Sikapmu?",
    o: [
      "Membantu dengan menyepakati jadwal dan format yang realistis bagi kedua pihak",
      "Menolak karena bukan prioritas unitmu",
      "Mengirim data mentah seadanya tanpa penjelasan",
      "Meminta mereka mengajukan permintaan lewat atasan masing-masing dulu",
    ],
    e: "Kolaboratif berarti membangun kerja sama yang sinergis. Menyepakati jadwal yang realistis membantu unit lain tanpa mengorbankan pekerjaan timmu.",
  },
  {
    b: "Kolaboratif",
    q: "Dalam kerja kelompok, satu anggota tidak menyelesaikan bagiannya, dan tenggat tinggal dua hari. Apa yang kamu lakukan?",
    o: [
      "Menanyakan kendalanya, lalu membagi ulang tugas bersama tim agar tenggat tetap terkejar",
      "Mengerjakan bagiannya sendiri tanpa bertanya",
      "Melaporkan ke atasan bahwa ia tidak bekerja",
      "Membiarkan bagian itu kosong agar terlihat siapa yang bertanggung jawab",
    ],
    e: "Kolaboratif berarti memberi kesempatan dan saling membantu. Memahami kendala dulu lalu membagi ulang tugas menjaga hasil tim.",
  },
  {
    b: "Kolaboratif",
    q: "Idemu dipakai dalam presentasi ke direksi, tetapi rekanmu yang mempresentasikannya tanpa menyebut namamu. Sikapmu?",
    o: [
      "Fokus pada keberhasilan tim, lalu membicarakan pengakuan kontribusi secara baik-baik dengan rekan tersebut",
      "Menyela presentasi untuk meluruskan siapa pemilik ide",
      "Tidak mau lagi berbagi ide dengan rekan tersebut",
      "Mengirim email ke direksi bahwa ide itu milikmu",
    ],
    e: "Kolaboratif menempatkan keberhasilan bersama di atas kepentingan pribadi, tanpa mengabaikan komunikasi terbuka agar kontribusi dihargai dengan adil.",
  },
  {
    b: "Kolaboratif",
    q: "Kamu ditunjuk memimpin tim lintas unit yang anggotanya lebih senior darimu. Langkah pertamamu?",
    o: [
      "Mengajak seluruh anggota menyepakati tujuan, peran, dan cara kerja tim di awal",
      "Langsung membagi tugas sesuai keinginanmu agar cepat",
      "Menyerahkan keputusan penting kepada anggota paling senior",
      "Bekerja sendiri sebanyak mungkin agar tidak merepotkan anggota",
    ],
    e: "Kesepakatan tujuan dan peran di awal membuat setiap anggota merasa dilibatkan dan mempermudah kerja sama, terutama bila ada perbedaan senioritas.",
  },
  {
    b: "Kolaboratif",
    q: "Rekan dari unit lain sering terlambat mengirim data yang kamu butuhkan, sehingga laporanmu juga terlambat. Apa yang kamu lakukan?",
    o: [
      "Membahas kendalanya bersama dan menyepakati jadwal serta format pengiriman data yang jelas",
      "Mencatat setiap keterlambatan untuk dilaporkan saat penilaian kinerja",
      "Mengambil data sendiri dari sistem unit tersebut tanpa izin",
      "Menyampaikan ke atasan bahwa keterlambatan bukan salahmu",
    ],
    e: "Mencari akar masalah dan menyepakati mekanisme kerja adalah cara kolaboratif untuk menyelesaikan masalah antarunit secara permanen.",
  },
];

export const TIPS_AKHLAK = [
  "Hafalkan enam nilai AKHLAK: Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif. Setiap soal biasanya mengukur satu nilai utama.",
  "Pilihan yang paling tepat biasanya menyelesaikan masalah DAN menjaga hubungan, bukan sekadar menghindari masalah.",
  "Hindari jawaban ekstrem: diam/tidak peduli, atau langsung melapor ke atasan tanpa mencoba menyelesaikan.",
  "Integritas tidak bisa ditawar. Pilihan yang sedikit saja melanggar aturan (tanggal mundur, gratifikasi, data rahasia) hampir pasti salah.",
  "Jawab konsisten. Tes sikap sungguhan mengulang situasi serupa untuk melihat apakah jawabanmu konsisten.",
];
