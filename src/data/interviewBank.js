/**
 * Bank pertanyaan interview.
 *
 * 100 pertanyaan dalam 10 kategori, masing-masing dengan strategi
 * menjawabnya. Dipakai di halaman Latihan Interview.
 *
 * `namaPendek` untuk label tab/chip yang ruangnya terbatas, `nama`
 * untuk judul lengkap. `ikon` merujuk nama komponen lucide-react —
 * komponennya diimpor di panel, bukan di sini, supaya file data ini
 * tetap murni data tanpa ketergantungan React.
 */
export const KATEGORI_INTERVIEW = [
  {
    id: 1,
    slug: "pembuka-tentang-diri",
    nama: "Pertanyaan Pembuka & Tentang Diri (Menjebak karena Terlalu Umum)",
    namaPendek: "Pembuka & Tentang Diri",
    ikon: "User",
    pertanyaan: [
      {
        nomor: 1,
        pertanyaan: "Ceritakan tentang diri Anda.",
        strategi:
          "Jangan menceritakan riwayat hidup lengkap. Gunakan format Present-Past-Future: mulai dari peran Anda sekarang, singgung pengalaman relevan sebelumnya, lalu tutup dengan alasan Anda tertarik pada posisi ini. Fokus hanya pada hal yang relevan dengan pekerjaan, maksimal 2 menit.",
      },
      {
        nomor: 2,
        pertanyaan: "Kenapa Anda ingin bekerja di perusahaan kami?",
        strategi:
          "Jebakannya adalah jawaban generik seperti 'karena perusahaan besar dan terkenal'. Tunjukkan riset spesifik: produk, budaya, atau proyek perusahaan yang relevan dengan keahlian dan nilai Anda, lalu hubungkan dengan kontribusi konkret yang bisa Anda berikan.",
      },
      {
        nomor: 3,
        pertanyaan: "Apa yang Anda ketahui tentang perusahaan ini?",
        strategi:
          "Ini menguji seberapa serius Anda melamar. Sebutkan fakta terbaru (produk, misi, berita terkini, kompetitor) dan kaitkan dengan mengapa hal itu relevan bagi peran yang Anda lamar, bukan sekadar mengulang tagline di website.",
      },
      {
        nomor: 4,
        pertanyaan: "Mengapa Anda keluar dari pekerjaan sebelumnya?",
        strategi:
          "Jangan menjelekkan mantan atasan atau perusahaan. Jelaskan secara netral dan berorientasi masa depan, misalnya mencari tantangan baru, pertumbuhan karier, atau kesesuaian nilai, bukan konflik atau ketidakpuasan personal.",
      },
      {
        nomor: 5,
        pertanyaan: "Kenapa ada jeda/gap dalam CV Anda?",
        strategi:
          "Jawab jujur dan singkat tanpa terdengar defensif. Jelaskan apa yang Anda lakukan selama jeda (belajar, keluarga, kesehatan, proyek pribadi) dan tekankan bagaimana Anda tetap produktif atau berkembang selama periode tersebut.",
      },
      {
        nomor: 6,
        pertanyaan: "Apa yang membuat Anda berbeda dari kandidat lain?",
        strategi:
          "Hindari klaim generik seperti 'saya pekerja keras'. Berikan kombinasi unik dari skill, pengalaman, dan hasil terukur yang Anda miliki serta relevan langsung dengan kebutuhan spesifik posisi ini.",
      },
      {
        nomor: 7,
        pertanyaan:
          "Bagaimana teman Anda mendeskripsikan Anda dalam tiga kata?",
        strategi:
          "Jebakannya adalah memilih kata yang terdengar bagus tapi tidak bisa dibuktikan. Pilih 2-3 sifat yang relevan dengan pekerjaan dan siap dengan contoh singkat nyata untuk masing-masing kata tersebut.",
      },
      {
        nomor: 8,
        pertanyaan: "Apa hobi Anda di luar pekerjaan?",
        strategi:
          "Pewawancara menilai keseimbangan hidup dan kepribadian Anda. Jawab jujur, namun pilih hobi yang menunjukkan sifat positif seperti disiplin, kreativitas, atau kerja tim jika relevan, tanpa terkesan dibuat-buat.",
      },
      {
        nomor: 9,
        pertanyaan: "Kenapa Anda sering pindah kerja (job hopping)?",
        strategi:
          "Jangan defensif. Kelompokkan pola perpindahan menjadi narasi pertumbuhan yang logis—setiap pindah membawa peningkatan tanggung jawab atau skill baru—dan tegaskan bahwa Anda mencari kestabilan jangka panjang di posisi ini.",
      },
      {
        nomor: 10,
        pertanyaan: "Apa arti sukses menurut Anda?",
        strategi:
          "Hindari jawaban terlalu filosofis atau terlalu materialistis. Definisikan sukses sebagai kombinasi pencapaian target kerja, pertumbuhan pribadi, dan kontribusi nyata pada tim/perusahaan, lalu kaitkan dengan tujuan karier Anda saat ini.",
      },
    ],
  },
  {
    id: 2,
    slug: "kelemahan-kegagalan",
    nama: "Pertanyaan tentang Kelemahan & Kegagalan",
    namaPendek: "Kelemahan & Kegagalan",
    ikon: "AlertTriangle",
    pertanyaan: [
      {
        nomor: 11,
        pertanyaan: "Apa kelemahan terbesar Anda?",
        strategi:
          "Jangan menjawab kelemahan palsu seperti 'saya terlalu perfeksionis' tanpa bukti. Sebutkan kelemahan nyata namun tidak fatal untuk posisi tersebut, lalu jelaskan langkah konkret yang sudah Anda ambil untuk memperbaikinya.",
      },
      {
        nomor: 12,
        pertanyaan:
          "Ceritakan kegagalan terbesar Anda dan apa yang Anda pelajari.",
        strategi:
          "Pilih kegagalan nyata dengan dampak jelas, jelaskan situasi-tindakan-hasil (metode STAR), lalu tekankan pembelajaran konkret yang mengubah cara kerja Anda setelahnya. Jangan menyalahkan orang lain.",
      },
      {
        nomor: 13,
        pertanyaan: "Pernahkah Anda gagal memenuhi target? Apa yang terjadi?",
        strategi:
          "Jawab jujur dengan contoh spesifik. Fokus pada analisis akar masalah dan tindakan perbaikan yang Anda lakukan, bukan hanya mengakui kegagalan tanpa solusi.",
      },
      {
        nomor: 14,
        pertanyaan:
          "Kritik apa yang paling menyakitkan yang pernah Anda terima, dan bagaimana Anda meresponnya?",
        strategi:
          "Tunjukkan kedewasaan emosional: akui bahwa kritik itu awalnya sulit diterima, tapi jelaskan bagaimana Anda merefleksikannya secara objektif dan mengubahnya menjadi perbaikan nyata.",
      },
      {
        nomor: 15,
        pertanyaan:
          "Apa hal yang membuat Anda ditolak di rekrutmen sebelumnya, menurut Anda?",
        strategi:
          "Jangan berspekulasi negatif tentang diri sendiri. Jawab dengan reflektif dan positif, misalnya kesesuaian budaya atau kualifikasi yang belum pas saat itu, lalu tunjukkan bagaimana Anda telah berkembang sejak saat itu.",
      },
      {
        nomor: 16,
        pertanyaan:
          "Jika atasan sebelumnya ditanya tentang Anda, apa kelemahan yang akan disebutkan?",
        strategi:
          "Ini menguji kejujuran dan kesadaran diri. Berikan jawaban yang jujur namun ringan, dan tunjukkan bahwa Anda sudah mengetahui serta menindaklanjuti hal tersebut secara aktif.",
      },
      {
        nomor: 17,
        pertanyaan:
          "Ceritakan saat Anda membuat keputusan yang salah dalam pekerjaan.",
        strategi:
          "Pilih contoh nyata dengan dampak terukur namun tidak fatal, jelaskan proses berpikir saat itu, dan yang terpenting tunjukkan langkah perbaikan serta perubahan proses agar tidak terulang.",
      },
      {
        nomor: 18,
        pertanyaan: "Bagaimana Anda menangani kritik dari atasan di depan tim?",
        strategi:
          "Tunjukkan bahwa Anda menerima kritik secara profesional tanpa emosi berlebihan, kemudian mendiskusikannya secara privat jika diperlukan untuk klarifikasi, bukan membalas argumen di depan tim.",
      },
      {
        nomor: 19,
        pertanyaan: "Apa proyek yang paling Anda sesali dalam karier Anda?",
        strategi:
          "Jujur namun konstruktif. Jelaskan konteks singkat, kesalahan yang diambil, dan yang terpenting perubahan pendekatan kerja Anda ke depannya akibat pengalaman tersebut.",
      },
      {
        nomor: 20,
        pertanyaan:
          "Ceritakan saat Anda tidak setuju dengan keputusan atasan dan ternyata atasan benar.",
        strategi:
          "Tunjukkan kerendahan hati profesional: jelaskan alasan ketidaksetujuan awal, lalu bagaimana Anda tetap mendukung keputusan tim, dan pembelajaran yang diambil setelah hasil terlihat.",
      },
    ],
  },
  {
    id: 3,
    slug: "gaji-negosiasi",
    nama: "Pertanyaan Gaji & Negosiasi",
    namaPendek: "Gaji & Negosiasi",
    ikon: "Wallet",
    pertanyaan: [
      {
        nomor: 21,
        pertanyaan: "Berapa ekspektasi gaji Anda?",
        strategi:
          "Jangan menyebut angka terlalu cepat tanpa riset. Berikan kisaran berdasarkan riset pasar dan pengalaman Anda, atau tanyakan balik kisaran anggaran perusahaan terlebih dahulu jika situasinya memungkinkan.",
      },
      {
        nomor: 22,
        pertanyaan: "Berapa gaji Anda sebelumnya?",
        strategi:
          "Di banyak wilayah pertanyaan ini sensitif secara hukum. Anda boleh sopan mengalihkan ke ekspektasi gaji untuk posisi baru berdasarkan tanggung jawab dan riset pasar, tanpa harus membuka angka pasti jika tidak nyaman.",
      },
      {
        nomor: 23,
        pertanyaan:
          "Jika kami menawarkan gaji lebih rendah dari ekspektasi Anda, apakah Anda tetap mau?",
        strategi:
          "Jangan langsung mengatakan ya atau tidak. Jelaskan bahwa Anda terbuka mendiskusikan keseluruhan paket (tunjangan, jenjang karier, bonus), bukan hanya gaji pokok, untuk menemukan titik temu.",
      },
      {
        nomor: 24,
        pertanyaan: "Apakah Anda melamar ke perusahaan lain juga?",
        strategi:
          "Jujur tanpa memberi detail berlebihan. Mengonfirmasi bahwa Anda sedang eksplorasi opsi menunjukkan Anda diminati, namun tegaskan posisi ini menjadi prioritas karena alasan spesifik yang relevan.",
      },
      {
        nomor: 25,
        pertanyaan:
          "Apa yang akan Anda lakukan jika mendapat tawaran lebih tinggi dari perusahaan lain?",
        strategi:
          "Tegaskan bahwa keputusan Anda tidak semata soal gaji, melainkan kecocokan jangka panjang, pertumbuhan karier, dan budaya kerja, sambil tetap jujur bahwa kompensasi adalah faktor pertimbangan wajar.",
      },
      {
        nomor: 26,
        pertanyaan: "Kenapa kami harus membayar Anda lebih dari kandidat lain?",
        strategi:
          "Hindari perbandingan langsung dengan kandidat lain yang tidak Anda kenal. Fokus pada nilai konkret dan hasil terukur yang bisa Anda berikan bagi perusahaan sesuai kebutuhan posisi tersebut.",
      },
      {
        nomor: 27,
        pertanyaan:
          "Apakah Anda bersedia bekerja lembur tanpa bayaran tambahan?",
        strategi:
          "Jangan berkomitmen buta. Jawab bahwa Anda berkomitmen menyelesaikan pekerjaan dengan baik dan fleksibel saat mendesak, namun ingin memahami kebijakan lembur perusahaan secara jelas terlebih dahulu.",
      },
      {
        nomor: 28,
        pertanyaan: "Kapan Anda bisa mulai bekerja?",
        strategi:
          "Berikan tanggal realistis mempertimbangkan masa pemberitahuan (notice period) di tempat kerja saat ini. Jangan menjanjikan tanggal yang tidak bisa Anda penuhi hanya demi terlihat kooperatif.",
      },
      {
        nomor: 29,
        pertanyaan:
          "Apakah Anda bersedia diturunkan levelnya (demosi) demi posisi ini?",
        strategi:
          "Tanyakan alasan di balik penawaran tersebut terlebih dahulu. Jawab jujur tentang pertimbangan Anda, misalnya jika ada peluang pertumbuhan jangka panjang yang jelas, tanpa terkesan putus asa menerima apa saja.",
      },
      {
        nomor: 30,
        pertanyaan:
          "Jika Anda diterima namun kontrak awal hanya 3 bulan tanpa jaminan perpanjangan, apakah Anda tetap mau?",
        strategi:
          "Tunjukkan sikap terbuka namun kritis: tanyakan kriteria evaluasi dan peluang perpanjangan secara spesifik sebelum memutuskan, agar keputusan Anda berdasarkan informasi yang jelas bukan tekanan.",
      },
    ],
  },
  {
    id: 4,
    slug: "tekanan-situasional",
    nama: "Pertanyaan Tekanan & Situasional (Stress Interview)",
    namaPendek: "Tekanan & Situasional",
    ikon: "Flame",
    pertanyaan: [
      {
        nomor: 31,
        pertanyaan:
          "Menurut Anda, apa kelemahan produk/layanan perusahaan kami?",
        strategi:
          "Jangan memuji buta atau menjatuhkan produk. Berikan kritik membangun berbasis riset nyata, disertai saran perbaikan singkat, untuk menunjukkan Anda berpikir kritis sekaligus konstruktif.",
      },
      {
        nomor: 32,
        pertanyaan: "Kenapa kami tidak boleh menolak Anda hari ini?",
        strategi:
          "Tetap tenang, jangan terpancing emosi. Jawab percaya diri dengan menyoroti 2-3 nilai konkret unik yang Anda tawarkan, bukan dengan nada defensif atau sombong.",
      },
      {
        nomor: 33,
        pertanyaan: "Jual pulpen ini kepada saya.",
        strategi:
          "Jangan langsung menjelaskan fitur pulpen. Gali dulu kebutuhan 'pembeli' dengan bertanya, lalu hubungkan fitur pulpen dengan kebutuhan spesifik tersebut—ini menguji kemampuan menjual berbasis kebutuhan, bukan hafalan skrip.",
      },
      {
        nomor: 34,
        pertanyaan:
          "Apa yang akan Anda lakukan jika saya bilang wawancara ini berjalan buruk?",
        strategi:
          "Tetap tenang dan profesional. Tanyakan dengan sopan area mana yang dirasa kurang agar bisa diklarifikasi, tanpa panik atau langsung meminta maaf berlebihan.",
      },
      {
        nomor: 35,
        pertanyaan:
          "Bagaimana jika atasan Anda memberi instruksi yang menurut Anda salah secara etika?",
        strategi:
          "Jelaskan bahwa Anda akan menyampaikan keberatan secara profesional dan berbasis data kepada atasan, lalu mengeskalasi ke pihak berwenang (HR/kepatuhan) jika instruksi tetap melanggar etika.",
      },
      {
        nomor: 36,
        pertanyaan:
          "Ceritakan situasi tersulit yang pernah Anda hadapi dan bagaimana menanganinya di bawah tekanan.",
        strategi:
          "Gunakan metode STAR (Situasi, Tugas, Aksi, Hasil) dengan contoh nyata yang menunjukkan ketenangan, prioritas jelas, dan hasil positif terukur, bukan sekadar cerita dramatis tanpa penyelesaian.",
      },
      {
        nomor: 37,
        pertanyaan:
          "Apa yang Anda lakukan jika diberi tiga proyek mendesak sekaligus dengan deadline sama?",
        strategi:
          "Jelaskan proses prioritisasi berbasis dampak dan urgensi, komunikasi proaktif dengan atasan/pemangku kepentingan mengenai realistisnya deadline, serta contoh nyata pernah melakukannya.",
      },
      {
        nomor: 38,
        pertanyaan: "Apakah Anda pernah berbohong di tempat kerja? Ceritakan.",
        strategi:
          "Jujur namun bijak—jika pernah, pilih contoh ringan (misalnya menahan opini demi menjaga hubungan kerja) dan tekankan komitmen Anda pada integritas dalam hal-hal penting seperti data dan hasil kerja.",
      },
      {
        nomor: 39,
        pertanyaan:
          "Bagaimana jika seluruh tim tidak setuju dengan pendapat Anda yang menurut Anda benar?",
        strategi:
          "Tunjukkan keberanian menyuarakan pendapat dengan data pendukung, namun juga kedewasaan menerima keputusan kolektif dan tetap mendukung pelaksanaannya secara profesional.",
      },
      {
        nomor: 40,
        pertanyaan:
          "Coba yakinkan saya bahwa Anda pantas mendapat posisi ini dalam 30 detik.",
        strategi:
          "Latih pitch singkat: satu kalimat pencapaian kuat, satu kalimat skill relevan, satu kalimat alasan cocok dengan perusahaan. Sampaikan dengan percaya diri dan tanpa terburu-buru meski waktunya singkat.",
      },
    ],
  },
  {
    id: 5,
    slug: "atasan-rekan-konflik",
    nama: "Pertanyaan tentang Atasan, Rekan Kerja & Konflik",
    namaPendek: "Konflik & Rekan Kerja",
    ikon: "Users",
    pertanyaan: [
      {
        nomor: 41,
        pertanyaan:
          "Ceritakan konflik dengan rekan kerja dan bagaimana Anda menyelesaikannya.",
        strategi:
          "Fokus pada penyelesaian, bukan drama konflik. Jelaskan bagaimana Anda berkomunikasi langsung dan profesional untuk mencari solusi bersama, dan hasil positif dari pendekatan tersebut.",
      },
      {
        nomor: 42,
        pertanyaan: "Bagaimana pendapat Anda tentang atasan Anda sebelumnya?",
        strategi:
          "Jangan pernah menjelekkan atasan lama, sekalipun hubungannya buruk. Fokus pada hal positif yang Anda pelajari dari gaya kepemimpinan mereka, dan bicarakan perbedaan secara netral bila perlu.",
      },
      {
        nomor: 43,
        pertanyaan: "Apa tipe atasan yang paling sulit Anda hadapi?",
        strategi:
          "Jawab spesifik namun tetap netral—jelaskan gaya kerja yang menantang bagi Anda (misalnya komunikasi minim) dan bagaimana Anda beradaptasi untuk tetap produktif bekerja dengan gaya tersebut.",
      },
      {
        nomor: 44,
        pertanyaan:
          "Bagaimana jika rekan kerja Anda tidak becus tapi disukai atasan?",
        strategi:
          "Hindari nada sinis. Jelaskan Anda akan tetap fokus pada kontribusi dan hasil kerja sendiri, memberi masukan langsung ke rekan tersebut secara konstruktif, dan menghindari drama politik kantor.",
      },
      {
        nomor: 45,
        pertanyaan:
          "Apa yang Anda lakukan jika mengetahui rekan kerja melakukan kecurangan?",
        strategi:
          "Tunjukkan integritas: jelaskan bahwa Anda akan mengumpulkan fakta, membicarakannya langsung jika memungkinkan, dan melaporkan melalui jalur resmi (atasan/HR) jika masalahnya serius atau berulang.",
      },
      {
        nomor: 46,
        pertanyaan:
          "Bagaimana Anda menangani rekan kerja yang lebih senior namun kinerjanya buruk memengaruhi proyek Anda?",
        strategi:
          "Jelaskan pendekatan profesional: komunikasikan dampak masalah secara objektif dan berbasis data kepada yang bersangkutan atau atasan, tanpa menyerang secara personal.",
      },
      {
        nomor: 47,
        pertanyaan:
          "Apakah Anda pernah tidak setuju dengan kebijakan perusahaan? Apa yang Anda lakukan?",
        strategi:
          "Berikan contoh nyata, jelaskan bagaimana Anda menyampaikan keberatan melalui jalur yang tepat (bukan menyebar keluhan ke tim), dan bagaimana Anda tetap profesional meski kebijakan tidak berubah.",
      },
      {
        nomor: 48,
        pertanyaan:
          "Bagaimana jika Anda diminta menilai kinerja teman dekat Anda secara objektif?",
        strategi:
          "Tegaskan komitmen pada objektivitas dan keadilan berbasis data kinerja aktual, memisahkan hubungan personal dari tanggung jawab profesional.",
      },
      {
        nomor: 49,
        pertanyaan:
          "Apa yang akan Anda lakukan jika atasan baru Anda ternyata lebih junior dari Anda secara pengalaman?",
        strategi:
          "Tunjukkan kedewasaan profesional: fokus pada hasil kerja tim, hormati struktur organisasi, dan lihat ini sebagai peluang berkontribusi dengan pengalaman Anda tanpa merasa terancam.",
      },
      {
        nomor: 50,
        pertanyaan:
          "Bagaimana Anda memberi umpan balik negatif kepada rekan kerja tanpa merusak hubungan?",
        strategi:
          "Jelaskan pendekatan spesifik, berbasis fakta, disampaikan secara privat, fokus pada perilaku bukan pribadi, serta diakhiri dengan ajakan solusi bersama.",
      },
    ],
  },
  {
    id: 6,
    slug: "logika-brainteaser",
    nama: "Pertanyaan Logika & Brainteaser",
    namaPendek: "Logika & Brainteaser",
    ikon: "Brain",
    pertanyaan: [
      {
        nomor: 51,
        pertanyaan: "Berapa banyak jendela yang ada di kota Jakarta?",
        strategi:
          "Bukan angka pasti yang dicari, melainkan proses berpikir. Uraikan estimasi logis langkah demi langkah: jumlah penduduk, rata-rata bangunan, rata-rata jendela per bangunan, lalu hitung perkiraan totalnya secara terstruktur.",
      },
      {
        nomor: 52,
        pertanyaan:
          "Jika Anda bisa menjadi hewan apa saja, apa yang Anda pilih dan mengapa?",
        strategi:
          "Jebakannya adalah jawaban asal tanpa makna. Pilih hewan yang mencerminkan sifat profesional relevan (misalnya lebah untuk kerja tim dan produktivitas) dan jelaskan alasannya secara logis.",
      },
      {
        nomor: 53,
        pertanyaan:
          "Anda punya 3 kotak berisi bola, satu kotak berisi campuran, label semua kotak salah. Bagaimana Anda memastikan isi tiap kotak dengan mengambil 1 bola?",
        strategi:
          "Ambil bola dari kotak berlabel 'campuran' (pasti salah label, jadi isinya salah satu warna murni). Warna itu menentukan isi kotak sebenarnya, lalu gunakan logika eliminasi untuk dua kotak sisanya berdasarkan aturan semua label salah.",
      },
      {
        nomor: 54,
        pertanyaan: "Ada berapa cara menyusun 5 orang dalam antrean?",
        strategi:
          "Ini soal permutasi: 5! = 120 cara. Jelaskan langkah berpikirnya—pilihan orang pertama 5 opsi, kedua 4 opsi, dan seterusnya, lalu kalikan semua opsi tersebut.",
      },
      {
        nomor: 55,
        pertanyaan:
          "Jika Anda punya 8 bola dan 1 lebih berat, timbangan hanya boleh dipakai 2 kali, bagaimana menemukannya?",
        strategi:
          "Bagi bola jadi 3-3-2. Timbang 3 lawan 3: jika seimbang, bola berat ada di 2 sisa (timbang keduanya); jika tidak seimbang, ambil sisi lebih berat lalu timbang 1 lawan 1 dari 3 bola tersebut, sisakan satu sebagai pembanding.",
      },
      {
        nomor: 56,
        pertanyaan: "Berapa banyak bola golf yang muat dalam bus sekolah?",
        strategi:
          "Jelaskan proses estimasi: hitung volume bus, volume rata-rata satu bola golf, perkirakan faktor pengisian ruang (packing efficiency sekitar 60-70%), lalu hitung estimasi akhirnya secara sistematis.",
      },
      {
        nomor: 57,
        pertanyaan:
          "Anda memiliki dua tali yang masing-masing terbakar habis dalam 60 menit namun tidak merata. Bagaimana mengukur 45 menit?",
        strategi:
          "Bakar tali pertama dari kedua ujung dan tali kedua dari satu ujung secara bersamaan. Saat tali pertama habis (30 menit), bakar ujung kedua tali kedua; tali kedua akan habis 15 menit kemudian, totalnya 45 menit.",
      },
      {
        nomor: 58,
        pertanyaan: "Kenapa penutup lubang got (manhole) berbentuk bulat?",
        strategi:
          "Jelaskan alasan teknis: lingkaran tidak bisa jatuh ke dalam lubangnya sendiri dari sudut manapun (berbeda dengan persegi yang bisa jatuh secara diagonal), sehingga lebih aman dan mudah digulingkan saat dipindahkan.",
      },
      {
        nomor: 59,
        pertanyaan:
          "Jika hari ini bukan Senin ataupun Selasa, dan besok bukan Kamis ataupun Jumat, hari apa sekarang?",
        strategi:
          "Gunakan eliminasi sistematis semua kemungkinan hari, cocokkan dengan dua syarat yang diberikan. Jawabannya adalah Sabtu, karena besoknya (Minggu) tidak melanggar syarat kedua dan hari ini tidak melanggar syarat pertama.",
      },
      {
        nomor: 60,
        pertanyaan:
          "Bagaimana Anda menjelaskan cara kerja internet kepada anak berusia 8 tahun?",
        strategi:
          "Gunakan analogi sederhana, misalnya internet seperti jaringan jalan raya yang menghubungkan rumah-rumah (komputer) sehingga surat (data) bisa dikirim dan diterima dengan cepat. Ini menguji kemampuan komunikasi Anda, bukan pengetahuan teknis semata.",
      },
    ],
  },
  {
    id: 7,
    slug: "etika-dilema-moral",
    nama: "Pertanyaan Etika & Dilema Moral",
    namaPendek: "Etika & Dilema Moral",
    ikon: "Scale",
    pertanyaan: [
      {
        nomor: 61,
        pertanyaan:
          "Jika Anda menemukan kesalahan besar dalam laporan yang sudah dikirim ke klien, apa yang Anda lakukan?",
        strategi:
          "Segera laporkan ke atasan begitu ditemukan, jangan ditutupi. Jelaskan rencana perbaikan dan komunikasi transparan ke klien untuk meminimalkan dampak, menunjukkan tanggung jawab dan integritas.",
      },
      {
        nomor: 62,
        pertanyaan:
          "Apa yang Anda lakukan jika diminta atasan memanipulasi data demi mencapai target?",
        strategi:
          "Tegaskan Anda akan menolak secara sopan namun tegas, menjelaskan risiko bagi perusahaan, dan mengajukan alternatif solusi yang etis untuk mencapai target tersebut.",
      },
      {
        nomor: 63,
        pertanyaan:
          "Jika perusahaan meminta Anda bekerja di area abu-abu hukum, apa sikap Anda?",
        strategi:
          "Jelaskan Anda akan mencari klarifikasi hukum/kepatuhan terlebih dahulu, menyuarakan keberatan jika berisiko, dan bersedia menolak instruksi yang jelas-jelas melanggar hukum meski berisiko pada posisi Anda.",
      },
      {
        nomor: 64,
        pertanyaan:
          "Apa yang akan Anda lakukan jika teman dekat Anda melamar untuk posisi yang sama dan Anda yang diterima?",
        strategi:
          "Tunjukkan profesionalisme: pisahkan hubungan personal dari keputusan rekrutmen, tetap dukung dan komunikasikan situasi dengan jujur dan empatik kepada teman Anda di luar proses seleksi.",
      },
      {
        nomor: 65,
        pertanyaan:
          "Bagaimana jika Anda diminta menandatangani dokumen yang isinya belum Anda pahami sepenuhnya?",
        strategi:
          "Jelaskan Anda tidak akan menandatangani sebelum memahami sepenuhnya isi dokumen tersebut, dan akan meminta waktu serta penjelasan tambahan sebelum mengambil keputusan.",
      },
      {
        nomor: 66,
        pertanyaan:
          "Apa yang akan Anda lakukan jika mengetahui perusahaan melakukan sesuatu yang tidak etis namun legal?",
        strategi:
          "Jelaskan Anda akan menyuarakan keprihatinan secara internal melalui jalur yang tepat, mempertimbangkan dampak jangka panjang terhadap reputasi perusahaan dan nilai pribadi Anda sebelum memutuskan langkah lanjut.",
      },
      {
        nomor: 67,
        pertanyaan:
          "Bagaimana jika target perusahaan bertentangan dengan kepentingan pelanggan?",
        strategi:
          "Tekankan pentingnya keseimbangan jangka panjang: kepercayaan pelanggan adalah aset berharga, sehingga Anda akan mencari solusi yang tetap memenuhi target namun tidak merugikan pelanggan secara tidak adil.",
      },
      {
        nomor: 68,
        pertanyaan:
          "Apakah Anda akan melaporkan atasan Anda sendiri jika ia melanggar aturan perusahaan?",
        strategi:
          "Jelaskan bahwa keputusan bergantung pada tingkat keseriusan pelanggaran; untuk pelanggaran serius yang merugikan perusahaan/orang lain, Anda akan melaporkannya melalui jalur resmi meski itu sulit secara personal.",
      },
      {
        nomor: 69,
        pertanyaan:
          "Bagaimana sikap Anda jika diminta menerima 'hadiah' dari klien yang bisa dianggap gratifikasi?",
        strategi:
          "Tegaskan Anda akan menolak dengan sopan sesuai kebijakan etika perusahaan, dan melaporkannya ke atasan/kepatuhan agar tercatat secara transparan.",
      },
      {
        nomor: 70,
        pertanyaan:
          "Jika Anda melihat rekan kerja mencuri barang kecil milik kantor, apa yang Anda lakukan?",
        strategi:
          "Jelaskan Anda akan mempertimbangkan berbicara langsung dengan rekan tersebut terlebih dahulu jika kasusnya ringan, namun akan melaporkannya secara resmi jika berulang atau signifikan, demi menjaga integritas tempat kerja.",
      },
    ],
  },
  {
    id: 8,
    slug: "motivasi-rencana-karier",
    nama: "Pertanyaan Motivasi & Rencana Karier",
    namaPendek: "Motivasi & Karier",
    ikon: "TrendingUp",
    pertanyaan: [
      {
        nomor: 71,
        pertanyaan: "Di mana Anda melihat diri Anda dalam 5 tahun ke depan?",
        strategi:
          "Hindari jawaban terlalu ambisius (ingin jadi CEO) atau terlalu pasif (tidak tahu). Jelaskan visi pertumbuhan yang realistis dan selaras dengan jenjang karier di perusahaan tersebut.",
      },
      {
        nomor: 72,
        pertanyaan:
          "Apa yang memotivasi Anda untuk bangun dan bekerja setiap hari?",
        strategi:
          "Berikan jawaban personal dan jujur, hubungkan dengan nilai kerja seperti dampak, pertumbuhan, atau tantangan, dan kaitkan dengan bagaimana posisi ini memenuhi motivasi tersebut.",
      },
      {
        nomor: 73,
        pertanyaan:
          "Mengapa kami harus mempekerjakan Anda dibanding kandidat internal?",
        strategi:
          "Jangan meremehkan kandidat internal. Fokus pada perspektif segar dan pengalaman eksternal unik yang bisa Anda bawa, yang melengkapi kekuatan tim yang sudah ada.",
      },
      {
        nomor: 74,
        pertanyaan: "Apa rencana Anda jika tidak diterima di posisi ini?",
        strategi:
          "Tunjukkan sikap tangguh dan positif: Anda akan meminta umpan balik untuk perbaikan diri dan terus mengembangkan skill relevan, tanpa terkesan putus asa atau kecewa berlebihan.",
      },
      {
        nomor: 75,
        pertanyaan:
          "Seberapa penting posisi ini bagi Anda dibanding tawaran lain yang sedang Anda pertimbangkan?",
        strategi:
          "Jujur namun strategis: jelaskan faktor spesifik yang membuat posisi ini menarik (misi, tim, tantangan), tanpa harus mengorbankan posisi tawar Anda di proses lain.",
      },
      {
        nomor: 76,
        pertanyaan:
          "Apa yang akan membuat Anda resign dari posisi ini nantinya?",
        strategi:
          "Jawab dengan reflektif dan jujur, misalnya kurangnya peluang pertumbuhan atau ketidaksesuaian nilai jangka panjang, namun tegaskan Anda berkomitmen memberikan yang terbaik selama bergabung.",
      },
      {
        nomor: 77,
        pertanyaan:
          "Apa pencapaian yang paling Anda banggakan dalam karier Anda?",
        strategi:
          "Pilih pencapaian dengan dampak terukur dan relevan dengan posisi yang dilamar, jelaskan kontribusi spesifik Anda menggunakan data atau hasil konkret, bukan hanya deskripsi tugas.",
      },
      {
        nomor: 78,
        pertanyaan:
          "Bagaimana Anda mengukur kesuksesan dalam peran ini setelah satu tahun bekerja?",
        strategi:
          "Tunjukkan pemikiran berorientasi hasil: sebutkan indikator konkret seperti pencapaian target, kontribusi proyek, atau pengembangan skill baru yang relevan dengan ekspektasi peran tersebut.",
      },
      {
        nomor: 79,
        pertanyaan:
          "Apa yang akan Anda lakukan di 90 hari pertama jika diterima?",
        strategi:
          "Jelaskan rencana bertahap: belajar dan observasi di awal, identifikasi quick wins, lalu mulai berkontribusi signifikan sesuai prioritas tim, menunjukkan Anda sudah berpikir strategis sebelum bergabung.",
      },
      {
        nomor: 80,
        pertanyaan:
          "Mengapa Anda ingin pindah dari industri sebelumnya ke industri ini?",
        strategi:
          "Jelaskan motivasi otentik dan hubungkan skill transferable dari industri lama dengan kebutuhan industri baru, tunjukkan riset dan pemahaman Anda tentang perbedaan serta tantangannya.",
      },
    ],
  },
  {
    id: 9,
    slug: "penutup-red-flag",
    nama: "Pertanyaan Penutup & Red Flag Detector",
    namaPendek: "Penutup & Red Flag",
    ikon: "Flag",
    pertanyaan: [
      {
        nomor: 81,
        pertanyaan: "Apakah Anda punya pertanyaan untuk kami?",
        strategi:
          "Jangan menjawab 'tidak ada'—ini dianggap kurang minat. Siapkan 2-3 pertanyaan cerdas tentang ekspektasi peran, tim, atau tantangan terbesar posisi ini, yang menunjukkan Anda serius mempertimbangkan kecocokan dua arah.",
      },
      {
        nomor: 82,
        pertanyaan:
          "Apa yang membuat Anda ragu untuk menerima posisi ini jika ditawarkan sekarang?",
        strategi:
          "Jujur namun terukur: sebutkan satu pertimbangan wajar (misalnya ingin memahami lebih lanjut jenjang karier atau budaya tim) tanpa terkesan tidak yakin atau kurang berminat pada peran tersebut.",
      },
      {
        nomor: 83,
        pertanyaan:
          "Jika kami menawarkan posisi ini sekarang, apakah Anda langsung menerima?",
        strategi:
          "Jangan terburu-buru mengatakan ya tanpa syarat, namun juga jangan ragu berlebihan. Nyatakan minat kuat sambil menyebutkan kebutuhan review detail penawaran (kompensasi, mulai kerja) secara profesional.",
      },
      {
        nomor: 84,
        pertanyaan:
          "Bagaimana perasaan Anda tentang bekerja lembur atau di akhir pekan secara rutin?",
        strategi:
          "Ini sinyal red flag budaya kerja. Jawab jujur tentang batas keseimbangan kerja-hidup Anda, sambil tetap menunjukkan fleksibilitas wajar saat situasi mendesak benar-benar terjadi.",
      },
      {
        nomor: 85,
        pertanyaan: "Apa yang Anda cari dari atasan langsung Anda nantinya?",
        strategi:
          "Sebutkan kualitas kepemimpinan yang mendukung produktivitas Anda, seperti komunikasi jelas, umpan balik konstruktif, dan kepercayaan, tanpa terdengar menuntut secara berlebihan.",
      },
      {
        nomor: 86,
        pertanyaan:
          "Ceritakan pengalaman Anda bekerja di lingkungan yang berubah sangat cepat (fast-paced).",
        strategi:
          "Berikan contoh nyata dengan hasil konkret menunjukkan kemampuan adaptasi dan prioritisasi cepat, karena pertanyaan ini sering menandakan beban kerja tinggi di perusahaan tersebut.",
      },
      {
        nomor: 87,
        pertanyaan:
          "Apakah Anda nyaman menerima banyak tanggung jawab tanpa deskripsi kerja yang jelas?",
        strategi:
          "Jawab dengan seimbang: tunjukkan fleksibilitas Anda, namun juga tanyakan balik ekspektasi konkret di masa awal untuk memastikan kejelasan peran meski fleksibel.",
      },
      {
        nomor: 88,
        pertanyaan:
          "Berapa lama rata-rata Anda bertahan di satu perusahaan sebelumnya, dan mengapa?",
        strategi:
          "Berikan konteks jujur untuk setiap durasi, hindari kesan tidak loyal, dan tegaskan alasan Anda tertarik untuk berkomitmen jangka panjang khususnya pada posisi yang dilamar sekarang.",
      },
      {
        nomor: 89,
        pertanyaan:
          "Bagaimana Anda menangani situasi ketika ekspektasi kerja tidak sesuai dengan yang dijanjikan saat wawancara?",
        strategi:
          "Jelaskan bahwa Anda akan mengomunikasikan ketidaksesuaian tersebut secara langsung dan profesional kepada atasan/HR untuk mencari klarifikasi atau solusi, bukan langsung resign atau diam saja.",
      },
      {
        nomor: 90,
        pertanyaan:
          "Apa satu hal yang bisa membuat Anda menolak tawaran kerja meski gajinya menarik?",
        strategi:
          "Jawaban ini menunjukkan nilai inti Anda—sebutkan faktor seperti budaya kerja tidak sehat, ketidaksesuaian etika, atau kurangnya peluang berkembang, yang menunjukkan Anda mempertimbangkan lebih dari sekadar kompensasi.",
      },
    ],
  },
  {
    id: 10,
    slug: "kepemimpinan-kerja-tim",
    nama: "Pertanyaan Kepemimpinan & Kerja Tim",
    namaPendek: "Kepemimpinan & Tim",
    ikon: "Crown",
    pertanyaan: [
      {
        nomor: 91,
        pertanyaan:
          "Ceritakan saat Anda harus memimpin tim tanpa memiliki otoritas formal.",
        strategi:
          "Gunakan contoh nyata (metode STAR) yang menunjukkan Anda memengaruhi lewat komunikasi, kredibilitas, dan kolaborasi, bukan kekuasaan jabatan. Tekankan hasil konkret yang dicapai tim.",
      },
      {
        nomor: 92,
        pertanyaan:
          "Bagaimana Anda menangani anggota tim yang berkinerja buruk namun sudah lama bekerja di perusahaan?",
        strategi:
          "Jelaskan pendekatan berbasis data dan empati: identifikasi akar masalah lewat percakapan pribadi, berikan dukungan/pelatihan, tetapkan target jelas, dan eskalasi formal hanya jika tidak ada perbaikan.",
      },
      {
        nomor: 93,
        pertanyaan:
          "Apa yang Anda lakukan jika dua anggota tim Anda saling berkonflik dan mengganggu produktivitas?",
        strategi:
          "Jelaskan pendekatan mediasi netral: dengarkan kedua pihak secara terpisah, fokus pada masalah bukan pribadi, dan bantu mereka menemukan solusi bersama demi keberlangsungan proyek.",
      },
      {
        nomor: 94,
        pertanyaan: "Bagaimana gaya kepemimpinan Anda, dan berikan contohnya?",
        strategi:
          "Jangan hanya menyebut label (misal 'demokratis'). Jelaskan gaya Anda dengan contoh nyata bagaimana Anda menyesuaikan pendekatan sesuai situasi dan karakter anggota tim, disertai hasilnya.",
      },
      {
        nomor: 95,
        pertanyaan:
          "Ceritakan saat Anda harus mendelegasikan tugas penting namun khawatir hasilnya tidak sesuai standar.",
        strategi:
          "Jelaskan proses delegasi yang tetap memberi kejelasan ekspektasi dan dukungan (check-in berkala), menunjukkan kepercayaan pada tim sambil tetap menjaga kualitas hasil akhir.",
      },
      {
        nomor: 96,
        pertanyaan:
          "Bagaimana jika anggota tim Anda mengambil kredit atas pekerjaan Anda?",
        strategi:
          "Tunjukkan ketenangan profesional: bicarakan langsung dengan orang tersebut secara privat terlebih dahulu, klarifikasi kontribusi secara objektif ke atasan bila perlu, tanpa drama berlebihan.",
      },
      {
        nomor: 97,
        pertanyaan:
          "Apa yang Anda lakukan jika tim Anda kehilangan motivasi di tengah proyek besar?",
        strategi:
          "Jelaskan langkah konkret seperti memecah tujuan besar menjadi pencapaian kecil yang terlihat, mengapresiasi progres, dan mendengarkan kekhawatiran tim untuk menemukan akar penyebab hilangnya motivasi.",
      },
      {
        nomor: 98,
        pertanyaan:
          "Bagaimana Anda memastikan keberagaman pendapat didengar dalam rapat tim?",
        strategi:
          "Jelaskan teknik konkret seperti meminta pendapat bergiliran, menyediakan kanal masukan tertulis bagi yang kurang nyaman bicara langsung, dan secara aktif mengundang pandangan berbeda sebelum mengambil keputusan.",
      },
      {
        nomor: 99,
        pertanyaan:
          "Ceritakan saat Anda harus menyampaikan keputusan tidak populer kepada tim Anda.",
        strategi:
          "Jelaskan bagaimana Anda mengomunikasikan alasan di balik keputusan secara transparan dan empatik, mendengarkan keberatan tim, namun tetap konsisten menjalankan keputusan yang sudah ditetapkan.",
      },
      {
        nomor: 100,
        pertanyaan:
          "Bagaimana Anda membangun kepercayaan dengan tim baru dalam waktu singkat?",
        strategi:
          "Jelaskan langkah konkret: mendengarkan aktif di awal, konsisten menepati janji kecil, transparan soal ekspektasi, dan memberi pengakuan atas kontribusi tim sejak dini untuk membangun hubungan kerja yang solid.",
      },
    ],
  },
  {
    id: 11,
    slug: "masih-bekerja-interview-diam-diam",
    nama: "Pertanyaan untuk Kandidat yang Masih Bekerja (Interview Diam-Diam)",
    namaPendek: "Masih Bekerja & Diam-Diam",
    ikon: "Briefcase",
    pertanyaan: [
      {
        nomor: 101,
        pertanyaan:
          "Bagaimana Anda bisa hadir interview di jam kerja seperti ini?",
        strategi:
          "Jebakan: menjawab jujur tapi terkesan Anda sering 'mencuri waktu' kantor. Jelaskan Anda mengambil cuti/izin resmi atau menjadwalkan di luar jam kerja inti, menunjukkan Anda tetap menghormati komitmen ke pemberi kerja saat ini.",
      },
      {
        nomor: 102,
        pertanyaan:
          "Apakah atasan Anda saat ini tahu Anda sedang melamar kerja?",
        strategi:
          "Menjawab 'tidak tahu' wajar namun jangan terdengar sembunyi-sembunyi. Katakan ini masih proses awal dan Anda akan menginformasikan secara profesional begitu ada keputusan konkret—ini hal normal dan tidak perlu diumumkan sebelum waktunya.",
      },
      {
        nomor: 103,
        pertanyaan:
          "Bolehkah kami menghubungi atasan Anda saat ini untuk referensi?",
        strategi:
          "Jangan menolak seolah ada yang disembunyikan. Jelaskan Anda lebih nyaman jika referensi dari atasan saat ini dihubungi setelah ada penawaran resmi, agar tidak mengganggu situasi kerja Anda sekarang, dan tawarkan referensi lain (mantan atasan/rekan) untuk sementara.",
      },
      {
        nomor: 104,
        pertanyaan:
          "Bagaimana jika perusahaan Anda saat ini memberi counter offer setelah Anda resign?",
        strategi:
          "Jawaban 'pasti tolak' terdengar tidak realistis, 'mungkin terima' terdengar tidak berkomitmen. Jelaskan alasan Anda mencari peluang baru biasanya bukan sekadar gaji (jenjang karier, tantangan, budaya), sehingga counter offer finansial saja tidak akan mengubah keputusan Anda.",
      },
      {
        nomor: 105,
        pertanyaan:
          "Apa yang membuat Anda mencari peluang lain padahal masih bekerja?",
        strategi:
          "Berbeda dari 'kenapa keluar dari kerja sebelumnya'—di sini pewawancara menguji apakah Anda kabur dari masalah atau mengejar pertumbuhan. Fokus pada hal yang Anda cari ke depan (tantangan, skala, jenjang karier), bukan keluhan tentang tempat kerja sekarang.",
      },
      {
        nomor: 106,
        pertanyaan:
          "Berapa lama masa pemberitahuan (notice period) Anda, dan apakah bisa dipercepat?",
        strategi:
          "Sebutkan kewajiban kontrak Anda secara jujur, tegaskan Anda ingin resign secara profesional agar tidak meninggalkan tim lama dalam kondisi buruk—ini justru sinyal positif soal integritas Anda.",
      },
      {
        nomor: 107,
        pertanyaan:
          "Bagaimana Anda menjaga kerahasiaan info perusahaan lama saat bekerja di sini nanti?",
        strategi:
          "Tegaskan komitmen pada etika profesional dan kontrak kerahasiaan (NDA)—Anda tidak akan membawa data/strategi rahasia, hanya keahlian dan pengalaman umum.",
      },
      {
        nomor: 108,
        pertanyaan: "Apakah Anda sedang interview di tempat lain juga?",
        strategi:
          "Lebih tajam dibanding kandidat yang sudah resign, karena pewawancara ingin tahu urgensi Anda pindah. Jujur secukupnya tanpa detail berlebihan, tekankan posisi ini prioritas karena alasan spesifik.",
      },
      {
        nomor: 109,
        pertanyaan:
          "Bagaimana jika proses rekrutmen ini memakan waktu lama—apakah Anda akan tetap menunggu atau mengambil tawaran lain?",
        strategi:
          "Jawab jujur dan profesional: sampaikan bahwa Anda menghargai proses namun juga punya tanggung jawab mempertimbangkan opsi lain jika ada tenggat waktu, sambil tetap terbuka berkomunikasi mengenai linimasa dengan perusahaan ini.",
      },
      {
        nomor: 110,
        pertanyaan:
          "Bagaimana Anda memastikan pekerjaan Anda saat ini tidak terbengkalai selama proses interview berlangsung?",
        strategi:
          "Tunjukkan profesionalisme dan manajemen waktu: jelaskan Anda tetap memenuhi tanggung jawab penuh di pekerjaan sekarang, menjadwalkan proses interview secara hati-hati agar tidak mengganggu kinerja, dan tidak akan meninggalkan tugas menggantung meski sedang mencari peluang baru.",
      },
    ],
  },
];

/** Total pertanyaan, dihitung otomatis supaya tidak perlu diperbarui manual. */
export const TOTAL_PERTANYAAN = KATEGORI_INTERVIEW.reduce(
  (n, k) => n + k.pertanyaan.length,
  0,
);
