/**
 * Bank soal Penalaran Logis (HOTS). Jawaban benar SELALU di indeks 0
 * (diacak saat tes dibuat). `e` = pembahasan langkah demi langkah.
 */

const PROP = "Logika proposisi";
const ANALITIS = "Penalaran analitis";
const KUANT = "Logika kuantitatif";
const DATA = "Interpretasi data";

const SET_RAPAT = `Enam karyawan (A, B, C, D, E, F) akan presentasi berurutan dari sesi 1 sampai 6, satu orang per sesi.
• B presentasi tepat sebelum E.
• C tidak presentasi di sesi 1 maupun sesi 6.
• D presentasi di sesi 4.
• A presentasi setelah F.`;

const SET_MEJA = `Lima rekan kerja (Rina, Sigit, Tari, Umar, Vina) duduk mengelilingi meja bundar dengan 5 kursi yang berjarak sama.
• Rina duduk tepat di sebelah kanan Sigit.
• Tari tidak duduk bersebelahan dengan Sigit.
• Umar duduk bersebelahan dengan Vina.`;

const SET_PROYEK = `Sebuah tim terdiri dari 3 orang dipilih dari 6 kandidat: Ani, Beni, Citra, Dodi, Eka, Fajar.
• Jika Ani dipilih, Beni juga dipilih.
• Citra dan Dodi tidak boleh dipilih bersama.
• Eka dipilih hanya jika Fajar tidak dipilih.
• Dodi pasti dipilih.`;

export const BANK_LOGIKA = [
  // --------------------------------------------------- proposisi
  { b: PROP, q: "Jika lulus tes tertulis, maka kandidat ikut wawancara. Rudi tidak ikut wawancara. Kesimpulan:", o: ["Rudi tidak lulus tes tertulis", "Rudi lulus tes tertulis", "Rudi tidak mendaftar", "Tidak dapat disimpulkan"], e: "Modus tollens: Jika p maka q; tidak q; jadi tidak p. 'Lulus tes' (p) → 'ikut wawancara' (q). Rudi tidak ikut wawancara (¬q), maka Rudi tidak lulus tes (¬p)." },
  { b: PROP, q: "Negasi dari \"Semua karyawan hadir tepat waktu\" adalah…", o: ["Ada karyawan yang tidak hadir tepat waktu", "Semua karyawan tidak hadir tepat waktu", "Tidak ada karyawan yang hadir tepat waktu", "Sebagian karyawan hadir tepat waktu"], e: "Negasi 'semua A adalah B' adalah 'ada (sekurang-kurangnya satu) A yang bukan B'. Cukup satu karyawan terlambat untuk membuat pernyataan awal salah." },
  { b: PROP, q: "Pernyataan yang setara dengan \"Jika target tercapai, maka tim mendapat bonus\" adalah…", o: ["Jika tim tidak mendapat bonus, maka target tidak tercapai", "Jika tim mendapat bonus, maka target tercapai", "Jika target tidak tercapai, maka tim tidak mendapat bonus", "Target tercapai dan tim mendapat bonus"], e: "Pernyataan p → q setara dengan kontraposisinya ¬q → ¬p. Pilihan B (konvers) dan C (invers) TIDAK setara, karena bonus bisa saja diberikan karena alasan lain." },
  { b: PROP, q: "Negasi dari \"Hari ini hujan dan rapat dibatalkan\" adalah…", o: ["Hari ini tidak hujan atau rapat tidak dibatalkan", "Hari ini tidak hujan dan rapat tidak dibatalkan", "Hari ini hujan atau rapat dibatalkan", "Jika hujan, rapat tidak dibatalkan"], e: "Hukum De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q. Kata 'dan' berubah menjadi 'atau', dan masing-masing bagian dinegasikan." },
  { b: PROP, q: "Semua analis menguasai Excel. Sebagian yang menguasai Excel menguasai SQL. Kesimpulan yang PASTI benar:", o: ["Tidak dapat dipastikan ada analis yang menguasai SQL", "Sebagian analis menguasai SQL", "Semua analis menguasai SQL", "Tidak ada analis yang menguasai SQL"], e: "Kelompok 'yang menguasai Excel dan SQL' belum tentu beririsan dengan kelompok analis. Gambar diagram Venn: lingkaran analis di dalam lingkaran Excel, dan lingkaran SQL bisa saja berada di bagian Excel yang bukan analis." },
  { b: PROP, q: "Tidak ada pegawai kontrak yang mendapat mobil dinas. Sebagian pegawai bagian pemasaran adalah pegawai kontrak. Kesimpulan:", o: ["Sebagian pegawai pemasaran tidak mendapat mobil dinas", "Semua pegawai pemasaran tidak mendapat mobil dinas", "Sebagian pegawai pemasaran mendapat mobil dinas", "Tidak ada pegawai pemasaran yang mendapat mobil dinas"], e: "Pegawai pemasaran yang kontrak pasti tidak mendapat mobil dinas, jadi 'sebagian pegawai pemasaran tidak mendapat mobil dinas' pasti benar. Tentang pegawai pemasaran yang bukan kontrak, tidak ada informasi." },
  { b: PROP, q: "Jika produk lolos uji, maka produk dipasarkan. Jika produk dipasarkan, maka tim pemasaran membuat kampanye. Produk X lolos uji. Kesimpulan:", o: ["Tim pemasaran membuat kampanye untuk produk X", "Produk X tidak dipasarkan", "Produk X gagal di pasar", "Tidak dapat disimpulkan"], e: "Silogisme hipotetis: p → q, q → r, maka p → r. Produk X lolos uji (p), jadi kampanye dibuat (r)." },
  { b: PROP, q: "Jika saya terlambat, maka saya naik ojek. Saya tidak naik ojek atau saya membawa payung. Saya tidak membawa payung. Kesimpulan:", o: ["Saya tidak terlambat", "Saya terlambat", "Saya naik ojek", "Saya membawa payung"], e: "Dari 'tidak naik ojek ATAU membawa payung' dan 'tidak membawa payung', maka 'tidak naik ojek' (silogisme disjungtif). Lalu dari 'jika terlambat maka naik ojek' dan 'tidak naik ojek', maka 'tidak terlambat' (modus tollens)." },
  { b: PROP, q: "Hanya pegawai tetap yang boleh mengikuti program beasiswa. Dina mengikuti program beasiswa. Kesimpulan:", o: ["Dina adalah pegawai tetap", "Semua pegawai tetap ikut beasiswa", "Dina bukan pegawai tetap", "Tidak dapat disimpulkan"], e: "'Hanya A yang boleh B' berarti: jika B maka A. Dina mengikuti beasiswa (B), jadi Dina pegawai tetap (A). Kebalikannya tidak berlaku: tidak semua pegawai tetap pasti ikut." },
  { b: PROP, q: "Semua yang lolos FGD diundang wawancara user. Tidak ada yang diundang wawancara user tanpa lolos tes psikologi. Kesimpulan:", o: ["Semua yang lolos FGD juga lolos tes psikologi", "Semua yang lolos tes psikologi lolos FGD", "Sebagian yang lolos FGD tidak lolos tes psikologi", "Tidak dapat disimpulkan"], e: "Lolos FGD → diundang wawancara user → (pasti) sudah lolos tes psikologi. Rantai ini membuat semua yang lolos FGD juga lolos tes psikologi." },

  // --------------------------------------------------- analitis (set)
  { b: ANALITIS, bacaan: SET_RAPAT, q: "Siapa yang PASTI presentasi di sesi 1?", o: ["Tidak dapat dipastikan", "F", "B", "A"], e: "Coba susunan: F, B, E, D, C, A memenuhi semua syarat (F di 1). Tetapi B, E, F, D, C, A juga memenuhi (B di 1). Karena ada lebih dari satu kemungkinan, sesi 1 tidak dapat dipastikan." },
  { b: ANALITIS, bacaan: SET_RAPAT, q: "Jika A presentasi di sesi 6, siapa yang mungkin presentasi di sesi 5?", o: ["C", "D", "A", "Tidak ada yang memenuhi"], e: "D tetap di sesi 4, A di sesi 6. Sesi 5 tidak bisa B (karena E harus tepat setelah B dan sesi 6 sudah terisi A), tidak bisa E (karena B harus tepat sebelumnya di sesi 4 milik D). Sisa F atau C; C mungkin, misalnya B, E, F, D, C, A." },
  { b: ANALITIS, bacaan: SET_RAPAT, q: "Pasangan sesi mana yang TIDAK mungkin ditempati B dan E (berurutan)?", o: ["Sesi 4 dan 5", "Sesi 1 dan 2", "Sesi 2 dan 3", "Sesi 5 dan 6"], e: "D sudah pasti di sesi 4, jadi B tidak mungkin di sesi 4. Pasangan lain masih dapat disusun dengan syarat-syarat yang ada." },
  { b: ANALITIS, bacaan: SET_RAPAT, q: "Jika C presentasi di sesi 2, maka pernyataan yang PASTI benar adalah…", o: ["B dan E presentasi setelah D", "F presentasi di sesi 3", "A presentasi di sesi 1", "E presentasi di sesi 3"], e: "Sesi 1 dan 3 tersisa sebelum D (sesi 4). B–E harus berurutan, dan tidak bisa di 1–2 (sesi 2 = C) atau 3–4 (sesi 4 = D). Jadi B–E harus di sesi 5–6, setelah D. F dan A mengisi sesi 1 dan 3 dengan F lebih dulu: F di 1, A di 3." },
  { b: ANALITIS, bacaan: SET_MEJA, q: "Siapa yang PASTI duduk bersebelahan dengan Sigit selain Rina?", o: ["Umar atau Vina", "Tari", "Hanya Vina", "Tidak ada"], e: "Sigit punya dua tetangga. Satu adalah Rina. Tetangga lainnya bukan Tari (syarat). Jadi tetangga kedua Sigit adalah Umar atau Vina; keduanya mungkin karena Umar dan Vina hanya perlu bersebelahan." },
  { b: ANALITIS, bacaan: SET_MEJA, q: "Tari PASTI duduk bersebelahan dengan…", o: ["Rina", "Sigit", "Umar dan Vina sekaligus", "Tidak dapat ditentukan"], e: "Urutan melingkar: Sigit, Rina, ?, ?, ? (searah). Tari tidak di sebelah Sigit, dan Umar–Vina harus berdampingan. Satu-satunya cara: Sigit, Rina, Tari, (Umar/Vina), (Vina/Umar). Jadi Tari pasti bersebelahan dengan Rina." },
  { b: ANALITIS, bacaan: SET_MEJA, q: "Berapa banyak susunan duduk berbeda (urutan melingkar) yang memenuhi semua syarat?", o: ["2", "1", "4", "6"], e: "Dari pembahasan sebelumnya urutannya Sigit, Rina, Tari, lalu dua kursi terakhir diisi Umar dan Vina dengan urutan bebas: 2 susunan." },
  { b: ANALITIS, bacaan: SET_PROYEK, q: "Siapa yang PASTI TIDAK dipilih?", o: ["Citra", "Ani", "Eka", "Fajar"], e: "Dodi pasti dipilih, dan Citra tidak boleh bersama Dodi, jadi Citra pasti tidak dipilih. Anggota lain masih bergantung pada pilihan." },
  { b: ANALITIS, bacaan: SET_PROYEK, q: "Jika Ani dipilih, siapa anggota ketiga?", o: ["Beni", "Eka", "Fajar", "Citra"], e: "Dodi pasti dipilih. Jika Ani dipilih, Beni wajib ikut. Tim = Dodi, Ani, Beni (sudah 3 orang)." },
  { b: ANALITIS, bacaan: SET_PROYEK, q: "Susunan tim mana yang MEMENUHI semua syarat?", o: ["Dodi, Eka, Beni", "Dodi, Eka, Fajar", "Dodi, Ani, Eka", "Dodi, Citra, Beni"], e: "B melanggar syarat Eka–Fajar. C melanggar karena Ani dipilih tanpa Beni. D melanggar karena Citra bersama Dodi. A memenuhi semua: Eka dipilih tanpa Fajar, tanpa Ani, tanpa Citra." },
  { b: ANALITIS, bacaan: SET_PROYEK, q: "Jika Fajar dipilih, berapa kemungkinan susunan tim?", o: ["1", "2", "3", "4"], e: "Tim = Dodi + Fajar + satu orang lagi. Citra gugur (tidak boleh bersama Dodi), Eka gugur (Fajar dipilih), Ani gugur (Ani wajib membawa Beni sehingga tim menjadi 4 orang). Tersisa Beni saja: Dodi, Fajar, Beni. Jadi hanya 1 susunan." },

  // --------------------------------------------------- kuantitatif
  { b: KUANT, q: "Umur Budi 3 kali umur anaknya. 12 tahun lagi, umur Budi 2 kali umur anaknya. Berapa umur Budi sekarang?", o: ["36 tahun", "24 tahun", "30 tahun", "42 tahun"], e: "Misal umur anak = x, Budi = 3x. 12 tahun lagi: 3x + 12 = 2(x + 12) → 3x + 12 = 2x + 24 → x = 12. Budi = 36 tahun." },
  { b: KUANT, q: "Dari 40 karyawan, 25 bisa bahasa Inggris, 18 bisa bahasa Mandarin, dan 8 bisa keduanya. Berapa karyawan yang tidak bisa keduanya?", o: ["5", "3", "8", "15"], e: "Yang bisa minimal satu = 25 + 18 − 8 = 35. Yang tidak bisa keduanya = 40 − 35 = 5. Tips: irisan dihitung dua kali, jadi harus dikurangi sekali." },
  { b: KUANT, q: "Tiga orang: satu selalu jujur, satu selalu bohong, satu kadang jujur kadang bohong. A berkata: \"Saya bukan yang jujur.\" Siapakah A?", o: ["Si kadang-kadang", "Si jujur", "Si pembohong", "Tidak dapat ditentukan"], e: "Jika A si jujur, kalimatnya bohong; mustahil. Jika A si pembohong, kalimat 'saya bukan yang jujur' justru BENAR; mustahil karena pembohong selalu bohong. Satu-satunya kemungkinan: A si kadang-kadang." },
  { b: KUANT, q: "Sebuah pekerjaan selesai dalam 6 hari oleh 8 orang. Setelah 2 hari, 4 orang berhenti. Berapa hari TAMBAHAN yang dibutuhkan untuk menyelesaikan sisa pekerjaan?", o: ["8 hari", "4 hari", "6 hari", "10 hari"], e: "Total pekerjaan = 8 × 6 = 48 orang-hari. Setelah 2 hari terpakai 16, sisa 32. Dikerjakan 4 orang: 32 ÷ 4 = 8 hari." },
  { b: KUANT, q: "Rapat diadakan setiap 4 hari sekali, pelatihan setiap 6 hari sekali. Keduanya diadakan bersamaan pada 1 Maret. Kapan keduanya bersamaan lagi?", o: ["13 Maret", "10 Maret", "24 Maret", "7 Maret"], e: "KPK dari 4 dan 6 adalah 12. Jadi 12 hari setelah 1 Maret, yaitu 13 Maret." },
  { b: KUANT, q: "Peringkat penjualan: Ana lebih tinggi dari Bayu. Cici lebih rendah dari Dodi tetapi lebih tinggi dari Ana. Siapa peringkat terendah?", o: ["Bayu", "Ana", "Cici", "Dodi"], e: "Urutan dari tinggi: Dodi > Cici > Ana > Bayu. Terendah adalah Bayu." },
  { b: KUANT, q: "Harga barang naik 20%, lalu turun 20%. Dibandingkan harga awal, harga akhirnya…", o: ["Turun 4%", "Sama", "Naik 4%", "Turun 2%"], e: "Misal harga awal 100. Naik 20% → 120. Turun 20% dari 120 = 24 → 96. Jadi turun 4%. Jebakan: persentase turun dihitung dari harga yang sudah naik." },
  { b: KUANT, q: "Dalam sebuah antrean, Sari berada di urutan ke-12 dari depan dan urutan ke-9 dari belakang. Berapa orang dalam antrean?", o: ["20", "21", "19", "22"], e: "12 + 9 − 1 = 20. Sari terhitung dua kali, jadi dikurangi satu." },

  // --------------------------------------------------- data
  { b: DATA, bacaan: "Penjualan (unit) tiga cabang:\nCabang | Jan | Feb | Mar\nBandung | 120 | 150 | 180\nMedan | 200 | 190 | 170\nSurabaya | 160 | 160 | 200", q: "Cabang dengan PERTUMBUHAN persentase terbesar dari Januari ke Maret adalah…", o: ["Bandung", "Surabaya", "Medan", "Bandung dan Surabaya sama"], e: "Bandung: (180−120)/120 = 50%. Surabaya: (200−160)/160 = 25%. Medan: turun 15%. Bandung terbesar. Jebakan: Surabaya naik 40 unit, Bandung naik 60 unit, tetapi yang ditanya persentase." },
  { b: DATA, bacaan: "Penjualan (unit) tiga cabang:\nCabang | Jan | Feb | Mar\nBandung | 120 | 150 | 180\nMedan | 200 | 190 | 170\nSurabaya | 160 | 160 | 200", q: "Rata-rata penjualan per bulan seluruh cabang pada kuartal tersebut adalah…", o: ["510 unit", "170 unit", "490 unit", "530 unit"], e: "Total Jan = 480, Feb = 500, Mar = 550. Jumlah = 1.530 unit dalam 3 bulan, rata-rata per bulan = 510 unit (seluruh cabang). 170 adalah rata-rata per cabang per bulan, bukan seluruh cabang." },
  { b: DATA, bacaan: "Penjualan (unit) tiga cabang:\nCabang | Jan | Feb | Mar\nBandung | 120 | 150 | 180\nMedan | 200 | 190 | 170\nSurabaya | 160 | 160 | 200", q: "Pernyataan yang PALING tepat berdasarkan tabel adalah…", o: ["Medan satu-satunya cabang yang penjualannya turun setiap bulan", "Surabaya selalu menjadi cabang tertinggi", "Penjualan Bandung pasti melampaui Medan pada April", "Total penjualan Februari lebih rendah dari Januari"], e: "Medan: 200 → 190 → 170, turun setiap bulan. Surabaya bukan tertinggi di Januari (Medan 200). Prediksi April tidak dapat dipastikan dari data. Total Februari (500) lebih tinggi dari Januari (480)." },
  { b: DATA, bacaan: "Hasil survei kepuasan 200 pelanggan:\nSangat puas 30% · Puas 45% · Netral 15% · Tidak puas 10%", q: "Jika target perusahaan adalah minimal 80% pelanggan 'puas' atau 'sangat puas', berapa pelanggan lagi yang perlu berpindah ke kelompok puas?", o: ["10 pelanggan", "5 pelanggan", "20 pelanggan", "15 pelanggan"], e: "Sekarang puas + sangat puas = 75% × 200 = 150 orang. Target 80% × 200 = 160 orang. Kurang 10 pelanggan." },
];

export const TIPS_LOGIKA = [
  "Jika p maka q: yang setara HANYA 'jika tidak q maka tidak p'. 'Jika q maka p' dan 'jika tidak p maka tidak q' tidak setara.",
  "Negasi 'semua' adalah 'ada yang tidak'; negasi 'dan' adalah 'atau' (De Morgan).",
  "Kata 'sebagian' tidak menjamin irisan. Gambar diagram Venn kecil di kertas buram.",
  "Soal penyusunan: tulis kotak 1–6, isi dulu yang PASTI (mis. D di sesi 4), baru coba kemungkinan lain.",
  "Soal 'pasti benar' berbeda dengan 'mungkin benar'. Untuk 'pasti', satu contoh yang membantah sudah cukup untuk menggugurkan pilihan.",
  "Persentase naik lalu turun dengan angka sama TIDAK kembali ke awal. Uji dengan angka 100.",
];
