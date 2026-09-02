// Spesifikasi teknis tiap bagian profil LinkedIn.
export const LI_SPECS = {
  cover: {
    label: "Foto sampul",
    spec: [
      ["Ukuran ideal", "1584 × 396 px (4:1)"],
      ["Format", "JPG, PNG, GIF"],
      ["Ukuran file", "Maksimal 8 MB"],
      ["Zona aman", "Kiri bawah tertutup foto profil"],
    ],
    panduan: [
      "Pakai gambar yang menjelaskan bidang kerjamu, bukan pemandangan generik.",
      "Teks di sampul sering terpotong di HP — taruh elemen penting di tengah atas.",
      "Foto tempat kerja atau industrimu lebih kuat daripada stok gambar.",
    ],
  },
  photo: {
    label: "Foto profil",
    spec: [
      ["Ukuran minimal", "400 × 400 px"],
      ["Ukuran maksimal", "7680 × 4320 px"],
      ["Ukuran file", "Maksimal 8 MB"],
      ["Proporsi wajah", "Wajah mengisi ±60% bingkai"],
    ],
    panduan: [
      "Latar polos, pencahayaan merata, pakaian sesuai standar industrimu.",
      "Profil dengan foto jauh lebih sering dikunjungi daripada yang tanpa foto.",
      "Bingkai #OPENTOWORK menandakan sedang mencari kerja — lepas setelah diterima.",
    ],
  },
  headline: {
    label: "Headline",
    max: 220,
    spec: [
      ["Batas karakter", "220 karakter"],
      ["Bobot pencarian", "Tertinggi setelah nama"],
      ["Tampil di", "Pencarian, komentar, undangan"],
    ],
    panduan: [
      "Pola yang bekerja: Jabatan | Keahlian inti | Industri | Nilai yang kamu bawa.",
      "Recruiter mencari lewat kata kunci jabatan — pastikan jabatan target ada di sini.",
      "Hindari 'Fresh Graduate' atau 'Open to Work' sebagai isi utama.",
    ],
  },
  about: {
    label: "Tentang",
    max: 2600,
    spec: [
      ["Batas karakter", "2.600 karakter"],
      ["Terlihat tanpa klik", "±270 karakter pertama"],
      ["Format", "Teks biasa, baris baru didukung"],
    ],
    panduan: [
      "270 karakter pertama menentukan orang klik 'lihat selengkapnya' atau tidak.",
      "Sudut pandang orang pertama, bukan gaya CV formal.",
      "Struktur: siapa kamu → pencapaian terukur → yang kamu cari → cara menghubungi.",
      "Sisipkan kata kunci industri secara wajar, bagian ini diindeks LinkedIn.",
    ],
  },
  experience: {
    label: "Pengalaman",
    spec: [
      ["Deskripsi per posisi", "2.000 karakter"],
      ["Media", "Dokumen, link, gambar"],
      ["Skill per posisi", "Maksimal 5"],
    ],
    panduan: [
      "Isi kolom Skill di tiap posisi — dipakai LinkedIn untuk mencocokkan lowongan.",
      "Mulai tiap poin dengan kata kerja aktif dan sertakan angka bila ada.",
      "Lampirkan media di posisi terpenting supaya profil terlihat kredibel.",
    ],
  },
  education: {
    label: "Pendidikan",
    spec: [
      ["Deskripsi", "1.000 karakter"],
      ["Kolom nilai", "Opsional, bebas format"],
      ["Bidang studi", "Terpisah dari gelar"],
    ],
    panduan: [
      "Tulis nama resmi institusi — LinkedIn mencocokkannya dengan halaman kampus.",
      "Terhubung ke halaman kampus membuka jaringan alumni untuk referral.",
      "Isi kegiatan dan organisasi kalau pengalaman kerjamu masih sedikit.",
      "Cantumkan IPK hanya kalau di atas 3,5.",
    ],
  },
  certifications: {
    label: "Lisensi & sertifikasi",
    spec: [
      ["Nomor kredensial", "Opsional"],
      ["URL kredensial", "Opsional, bisa diverifikasi"],
      ["Masa berlaku", "Bisa dikosongkan"],
    ],
    panduan: [
      "Selalu isi URL kredensial — sertifikasi yang bisa diklik jauh lebih dipercaya.",
      "Tulis nama lengkap sertifikasi, bukan singkatan saja.",
      "Sertifikasi terkait posisi target sebaiknya diletakkan paling atas.",
      "Sertifikasi kedaluwarsa sebaiknya diperbarui atau dihapus.",
    ],
  },
  volunteering: {
    label: "Pengalaman sukarela",
    spec: [
      ["Deskripsi", "2.000 karakter"],
      ["Bidang kegiatan", "Pilihan dari daftar LinkedIn"],
      ["Tampil di", "Bagian terpisah dari pengalaman"],
    ],
    panduan: [
      "Banyak recruiter menganggap pengalaman sukarela setara pengalaman kerja.",
      "Berguna mengisi jeda karier tanpa meninggalkan lubang kosong.",
      "Jelaskan dampaknya, bukan hanya nama kegiatannya.",
    ],
  },
  skills: {
    label: "Keahlian",
    spec: [
      ["Jumlah maksimal", "50 keahlian"],
      ["Ditampilkan utama", "3 teratas"],
      ["Endorsement", "Tidak terbatas"],
    ],
    panduan: [
      "Isi minimal 15 keahlian, LinkedIn memakainya untuk pencocokan lowongan.",
      "Tiga teratas paling terlihat — letakkan yang paling relevan dengan posisi target.",
      "Gunakan nama keahlian yang disarankan LinkedIn, bukan istilah karangan sendiri.",
    ],
  },
  publications: {
    label: "Publikasi",
    spec: [
      ["Deskripsi", "2.000 karakter"],
      ["URL", "Opsional"],
      ["Penulis pendamping", "Bisa ditandai"],
    ],
    panduan: [
      "Termasuk artikel, riset, whitepaper, atau tulisan di media industri.",
      "Tandai rekan penulis supaya publikasi muncul juga di profil mereka.",
      "Berguna kuat untuk bidang riset, konsultan, dan teknis.",
    ],
  },
  awards: {
    label: "Penghargaan & prestasi",
    spec: [
      ["Deskripsi", "2.000 karakter"],
      ["Pemberi", "Wajib diisi"],
      ["Tanggal", "Bulan dan tahun"],
    ],
    panduan: [
      "Sebutkan skalanya: dari berapa peserta, tingkat apa, siapa penyelenggaranya.",
      "Penghargaan internal perusahaan tetap layak dicantumkan.",
      "Prestasi lama yang sudah tidak relevan sebaiknya dilepas.",
    ],
  },
  languages: {
    label: "Bahasa",
    spec: [
      ["Tingkat kemahiran", "5 pilihan resmi LinkedIn"],
      ["Jumlah", "Tidak dibatasi"],
    ],
    panduan: [
      "Gunakan istilah resmi LinkedIn: Dasar, Terbatas, Profesional, Mahir, Penutur asli.",
      "Perusahaan multinasional menyaring kandidat lewat kolom ini.",
      "Jangan melebih-lebihkan — sering diuji saat wawancara.",
    ],
  },
  organizations: {
    label: "Organisasi",
    spec: [
      ["Deskripsi", "1.000 karakter"],
      ["Jabatan", "Opsional"],
      ["Periode", "Opsional"],
    ],
    panduan: [
      "Termasuk asosiasi profesi, komunitas industri, dan organisasi kampus.",
      "Keanggotaan asosiasi profesi menandakan keseriusan di bidangmu.",
      "Sebutkan jabatan kalau kamu memegang peran kepengurusan.",
    ],
  },
};

// Definisi kolom untuk section berulang — dipakai renderer generik.
export const LI_FIELDS = {
  education: {
    kosong: {
      school: "",
      degree: "",
      field: "",
      start: "",
      end: "",
      grade: "",
      desc: [],
    },
    judul: (i) => i.school,
    sub: (i) => [i.degree, i.field].filter(Boolean).join(", "),
    meta: (i) => [i.start, i.end].filter(Boolean).join(" - "),
    ekstra: (i) => (i.grade ? `Nilai: ${i.grade}` : ""),
    kolom: [
      { k: "school", ph: "Universitas Sebelas Maret", lebar: 2 },
      { k: "degree", ph: "S1" },
      { k: "field", ph: "Manajemen" },
      { k: "start", ph: "2020" },
      { k: "end", ph: "2024" },
      { k: "grade", ph: "IPK 3,65", lebar: 2 },
    ],
    deskripsi: "Kegiatan, organisasi, atau mata kuliah relevan",
  },
  certifications: {
    kosong: {
      name: "",
      issuer: "",
      issued: "",
      expires: "",
      credentialId: "",
      url: "",
    },
    judul: (i) => i.name,
    sub: (i) => i.issuer,
    meta: (i) =>
      i.issued
        ? `Diterbitkan ${i.issued}${i.expires ? ` · Berlaku sampai ${i.expires}` : ""}`
        : "",
    ekstra: (i) => (i.credentialId ? `ID kredensial ${i.credentialId}` : ""),
    tautan: (i) => i.url,
    kolom: [
      { k: "name", ph: "Brevet Pajak A & B", lebar: 2 },
      { k: "issuer", ph: "Ikatan Akuntan Indonesia" },
      { k: "issued", ph: "Mar 2024" },
      { k: "expires", ph: "Kosongkan bila tanpa masa berlaku" },
      { k: "credentialId", ph: "UC-XXXXXXXX" },
      { k: "url", ph: "https://...", lebar: 2 },
    ],
  },
  volunteering: {
    kosong: { role: "", org: "", cause: "", start: "", end: "", desc: [] },
    judul: (i) => i.role,
    sub: (i) => i.org,
    meta: (i) => [i.start, i.end].filter(Boolean).join(" - "),
    ekstra: (i) => i.cause,
    kolom: [
      { k: "role", ph: "Pengajar relawan" },
      { k: "org", ph: "Yayasan Cinta Anak Bangsa" },
      { k: "cause", ph: "Pendidikan" },
      { k: "start", ph: "Jan 2023" },
      { k: "end", ph: "Des 2023" },
    ],
    deskripsi: "Kegiatan dan dampak yang dihasilkan",
  },
  publications: {
    kosong: { title: "", publisher: "", date: "", url: "", desc: [] },
    judul: (i) => i.title,
    sub: (i) => i.publisher,
    meta: (i) => i.date,
    tautan: (i) => i.url,
    kolom: [
      { k: "title", ph: "Judul publikasi", lebar: 2 },
      { k: "publisher", ph: "Nama media atau jurnal" },
      { k: "date", ph: "Jun 2025" },
      { k: "url", ph: "https://...", lebar: 2 },
    ],
    deskripsi: "Ringkasan isi publikasi",
  },
  awards: {
    kosong: { title: "", issuer: "", date: "", desc: [] },
    judul: (i) => i.title,
    sub: (i) => i.issuer,
    meta: (i) => i.date,
    kolom: [
      { k: "title", ph: "Juara 1 Company Theme Contest", lebar: 2 },
      { k: "issuer", ph: "Integrasi Logistik Cipta Solusi" },
      { k: "date", ph: "Des 2024" },
    ],
    deskripsi: "Skala, jumlah peserta, dan konteks penghargaan",
  },
  languages: {
    kosong: { name: "", proficiency: "" },
    judul: (i) => i.name,
    sub: (i) => i.proficiency,
    kolom: [
      { k: "name", ph: "Bahasa Inggris" },
      {
        k: "proficiency",
        ph: "Pilih tingkat",
        tipe: "select",
        pilihan: [
          "Kemampuan dasar",
          "Kemampuan kerja terbatas",
          "Kemampuan kerja profesional",
          "Kemampuan profesional penuh",
          "Penutur asli atau dwibahasa",
        ],
      },
    ],
  },
  organizations: {
    kosong: { name: "", role: "", start: "", end: "", desc: [] },
    judul: (i) => i.name,
    sub: (i) => i.role,
    meta: (i) => [i.start, i.end].filter(Boolean).join(" - "),
    kolom: [
      { k: "name", ph: "Ikatan Akuntan Indonesia", lebar: 2 },
      { k: "role", ph: "Anggota" },
      { k: "start", ph: "2023" },
      { k: "end", ph: "Sekarang" },
    ],
    deskripsi: "Kontribusi dan kegiatan di organisasi",
  },
};
