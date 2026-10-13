import { t } from "../i18n.js";
// Spesifikasi teknis tiap bagian profil LinkedIn.
export const LI_SPECS = {
  cover: {
    label: t("Foto sampul", "Cover photo"),
    spec: [
      [t("Ukuran ideal", "Ideal size"), "1584 × 396 px (4:1)"],
      ["Format", "JPG, PNG, GIF"],
      [t("Ukuran file", "File size"), t("Maksimal 8 MB", "Max 8 MB")],
      [t("Zona aman", "Safe zone"), t("Kiri bawah tertutup foto profil", "Bottom left is covered by the profile photo")],
    ],
    panduan: [
      t("Pakai gambar yang menjelaskan bidang kerjamu, bukan pemandangan generik.", "Use an image that explains your field, not a generic landscape."),
      t("Teks di sampul sering terpotong di HP. Taruh bagian penting di tengah atas.", "Cover text often gets cropped on phones. Put the important part at the top centre."),
      t("Foto tempat kerja atau industrimu lebih kuat daripada stok gambar.", "A photo of your workplace or industry beats stock images."),
    ],
  },
  photo: {
    label: t("Foto profil", "Profile photo"),
    spec: [
      [t("Ukuran minimal", "Minimum size"), "400 × 400 px"],
      [t("Ukuran maksimal", "Maximum size"), "7680 × 4320 px"],
      [t("Ukuran file", "File size"), t("Maksimal 8 MB", "Max 8 MB")],
      [t("Proporsi wajah", "Face proportion"), t("Wajah mengisi ±60% bingkai", "Face fills ±60% of the frame")],
    ],
    panduan: [
      t("Latar polos, pencahayaan merata, pakaian sesuai standar industrimu.", "Plain background, even lighting, clothes that fit your industry's norms."),
      t("Profil dengan foto jauh lebih sering dikunjungi daripada yang tanpa foto.", "Profiles with a photo get far more visits than those without."),
      t("Bingkai #OPENTOWORK menandakan kamu sedang cari kerja. Lepas setelah diterima.", "The #OPENTOWORK frame signals you're job hunting. Remove it once you're hired."),
    ],
  },
  headline: {
    label: "Headline",
    max: 220,
    spec: [
      [t("Batas karakter", "Character limit"), t("220 karakter", "220 characters")],
      [t("Bobot pencarian", "Search weight"), t("Tertinggi setelah nama", "Highest after your name")],
      [t("Tampil di", "Shown in"), t("Pencarian, komentar, undangan", "Search, comments, invitations")],
    ],
    panduan: [
      t("Pola yang bekerja: Jabatan | Keahlian inti | Industri | Nilai yang kamu bawa.", "A pattern that works: Title | Core skills | Industry | Value you bring."),
      t("Recruiter mencari lewat kata kunci jabatan, jadi pastikan jabatan incaranmu ada di sini.", "Recruiters search by job-title keywords, so make sure your target title is here."),
      t("Hindari 'Fresh Graduate' atau 'Open to Work' sebagai isi utama.", "Avoid 'Fresh Graduate' or 'Open to Work' as the main content."),
    ],
  },
  about: {
    label: t("Tentang", "About"),
    max: 2600,
    spec: [
      [t("Batas karakter", "Character limit"), t("2.600 karakter", "2,600 characters")],
      [t("Terlihat tanpa klik", "Visible without clicking"), t("±270 karakter pertama", "First ±270 characters")],
      ["Format", t("Teks biasa, baris baru didukung", "Plain text, line breaks supported")],
    ],
    panduan: [
      t("270 karakter pertama menentukan orang klik 'lihat selengkapnya' atau tidak.", "The first 270 characters decide whether people click 'see more'."),
      t("Sudut pandang orang pertama, bukan gaya CV formal.", "First person, not formal CV style."),
      t("Struktur: siapa kamu → pencapaian terukur → yang kamu cari → cara menghubungi.", "Structure: who you are → measurable achievements → what you're looking for → how to reach you."),
      t("Sisipkan kata kunci industri secara wajar, bagian ini diindeks LinkedIn.", "Weave in industry keywords naturally; LinkedIn indexes this section."),
    ],
  },
  experience: {
    label: t("Pengalaman", "Experience"),
    spec: [
      [t("Deskripsi per posisi", "Description per position"), t("2.000 karakter", "2,000 characters")],
      ["Media", t("Dokumen, link, gambar", "Documents, links, images")],
      [t("Skill per posisi", "Skills per position"), t("Maksimal 5", "Max 5")],
    ],
    panduan: [
      t("Isi kolom Skill di tiap posisi. LinkedIn memakainya untuk mencocokkan lowongan.", "Fill in Skills for each position. LinkedIn uses them to match jobs."),
      t("Mulai tiap poin dengan kata kerja aktif dan sertakan angka bila ada.", "Start each point with an active verb and include numbers where you can."),
      t("Lampirkan media di posisi terpenting supaya profil terlihat kredibel.", "Attach media to your key positions so the profile looks credible."),
    ],
  },
  education: {
    label: t("Pendidikan", "Education"),
    spec: [
      [t("Deskripsi", "Description"), t("1.000 karakter", "1,000 characters")],
      [t("Kolom nilai", "Grade field"), t("Opsional, bebas format", "Optional, free format")],
      [t("Bidang studi", "Field of study"), t("Terpisah dari gelar", "Separate from degree")],
    ],
    panduan: [
      t("Tulis nama resmi kampus atau sekolah supaya LinkedIn bisa mencocokkannya dengan halaman institusinya.", "Use the official school name so LinkedIn can link it to the institution's page."),
      t("Terhubung ke halaman kampus membuka jaringan alumni untuk referral.", "Linking to the school page opens up the alumni network for referrals."),
      t("Isi kegiatan dan organisasi kalau pengalaman kerjamu masih sedikit.", "Add activities and societies if you have little work experience."),
      t("Cantumkan IPK hanya kalau di atas 3,5.", "List your GPA only if it's above 3.5."),
    ],
  },
  certifications: {
    label: t("Lisensi & sertifikasi", "Licenses & certifications"),
    spec: [
      [t("Nomor kredensial", "Credential ID"), t("Opsional", "Optional")],
      [t("URL kredensial", "Credential URL"), t("Opsional, bisa diverifikasi", "Optional, verifiable")],
      [t("Masa berlaku", "Expiry"), t("Bisa dikosongkan", "Can be left blank")],
    ],
    panduan: [
      t("Selalu isi URL kredensial. Sertifikat yang bisa diklik jauh lebih dipercaya.", "Always add the credential URL. Clickable certificates are trusted far more."),
      t("Tulis nama lengkap sertifikasi, bukan singkatan saja.", "Write the full certification name, not just an abbreviation."),
      t("Sertifikasi terkait posisi target sebaiknya diletakkan paling atas.", "Put certifications related to your target role at the top."),
      t("Sertifikasi kedaluwarsa sebaiknya diperbarui atau dihapus.", "Renew or remove expired certifications."),
    ],
  },
  volunteering: {
    label: t("Pengalaman sukarela", "Volunteer experience"),
    spec: [
      [t("Deskripsi", "Description"), t("2.000 karakter", "2,000 characters")],
      [t("Bidang kegiatan", "Cause"), t("Pilihan dari daftar LinkedIn", "Chosen from LinkedIn's list")],
      [t("Tampil di", "Shown in"), t("Bagian terpisah dari pengalaman", "Separate from experience")],
    ],
    panduan: [
      t("Banyak recruiter menganggap pengalaman sukarela setara pengalaman kerja.", "Many recruiters treat volunteer experience as equal to work experience."),
      t("Berguna mengisi jeda karier tanpa meninggalkan lubang kosong.", "Useful for filling career gaps."),
      t("Jelaskan dampaknya, bukan hanya nama kegiatannya.", "Describe the impact, not just the activity name."),
    ],
  },
  skills: {
    label: t("Keahlian", "Skills"),
    spec: [
      [t("Jumlah maksimal", "Maximum"), t("50 keahlian", "50 skills")],
      [t("Ditampilkan utama", "Featured"), t("3 teratas", "Top 3")],
      ["Endorsement", t("Tidak terbatas", "Unlimited")],
    ],
    panduan: [
      t("Isi minimal 15 keahlian, LinkedIn memakainya untuk pencocokan lowongan.", "Add at least 15 skills; LinkedIn uses them for job matching."),
      t("Tiga skill teratas paling sering dilihat, jadi taruh yang paling sesuai dengan posisi incaranmu.", "The top three skills get seen most, so put the ones closest to your target role there."),
      t("Gunakan nama keahlian yang disarankan LinkedIn, bukan istilah karangan sendiri.", "Use skill names LinkedIn suggests, not terms you made up."),
    ],
  },
  publications: {
    label: t("Publikasi", "Publications"),
    spec: [
      [t("Deskripsi", "Description"), t("2.000 karakter", "2,000 characters")],
      ["URL", t("Opsional", "Optional")],
      [t("Penulis pendamping", "Co-authors"), t("Bisa ditandai", "Can be tagged")],
    ],
    panduan: [
      t("Termasuk artikel, riset, whitepaper, atau tulisan di media industri.", "Includes articles, research, whitepapers, or pieces in industry media."),
      t("Tandai rekan penulis supaya publikasi muncul juga di profil mereka.", "Tag co-authors so the publication also appears on their profiles."),
      t("Berguna kuat untuk bidang riset, konsultan, dan teknis.", "Especially useful for research, consulting, and technical fields."),
    ],
  },
  awards: {
    label: t("Penghargaan & prestasi", "Honors & awards"),
    spec: [
      [t("Deskripsi", "Description"), t("2.000 karakter", "2,000 characters")],
      [t("Pemberi", "Issuer"), t("Wajib diisi", "Required")],
      [t("Tanggal", "Date"), t("Bulan dan tahun", "Month and year")],
    ],
    panduan: [
      t("Sebutkan skalanya: dari berapa peserta, tingkat apa, siapa penyelenggaranya.", "State the scale: how many participants, what level, who organised it."),
      t("Penghargaan internal perusahaan tetap layak dicantumkan.", "Internal company awards are still worth listing."),
      t("Prestasi lama yang sudah tidak relevan sebaiknya dilepas.", "Drop old achievements that are no longer relevant."),
    ],
  },
  languages: {
    label: t("Bahasa", "Languages"),
    spec: [
      [t("Tingkat kemahiran", "Proficiency"), t("5 pilihan resmi LinkedIn", "5 official LinkedIn levels")],
      [t("Jumlah", "Count"), t("Tidak dibatasi", "Unlimited")],
    ],
    panduan: [
      t("Gunakan istilah resmi LinkedIn: Dasar, Terbatas, Profesional, Mahir, Penutur asli.", "Use LinkedIn's official levels: Elementary, Limited working, Professional working, Full professional, Native or bilingual."),
      t("Perusahaan multinasional menyaring kandidat lewat kolom ini.", "Multinationals filter candidates by this field."),
      t("Jangan dilebih-lebihkan, karena sering diuji saat wawancara.", "Don't exaggerate; it's often tested in interviews."),
    ],
  },
  organizations: {
    label: t("Organisasi", "Organizations"),
    spec: [
      [t("Deskripsi", "Description"), t("1.000 karakter", "1,000 characters")],
      [t("Jabatan", "Position"), t("Opsional", "Optional")],
      [t("Periode", "Period"), t("Opsional", "Optional")],
    ],
    panduan: [
      t("Termasuk asosiasi profesi, komunitas industri, dan organisasi kampus.", "Includes professional associations, industry communities, and campus organisations."),
      t("Keanggotaan asosiasi profesi menandakan keseriusan di bidangmu.", "Professional association membership shows you're serious about your field."),
      t("Sebutkan jabatan kalau kamu memegang peran kepengurusan.", "Mention your position if you held a leadership role."),
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
    ekstra: (i) => (i.grade ? t(`Nilai: ${i.grade}`, `Grade: ${i.grade}`) : ""),
    kolom: [
      { k: "school", ph: "Universitas Sebelas Maret", lebar: 2 },
      { k: "degree", ph: "S1" },
      { k: "field", ph: "Manajemen" },
      { k: "start", ph: "2020" },
      { k: "end", ph: "2024" },
      { k: "grade", ph: "IPK 3,65", lebar: 2 },
    ],
    deskripsi: t("Kegiatan, organisasi, atau mata kuliah relevan", "Activities, societies, or relevant courses"),
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
        ? `${t("Diterbitkan", "Issued")} ${i.issued}${i.expires ? t(` · Berlaku sampai ${i.expires}`, ` · Valid until ${i.expires}`) : ""}`
        : "",
    ekstra: (i) => (i.credentialId ? `ID kredensial ${i.credentialId}` : ""),
    tautan: (i) => i.url,
    kolom: [
      { k: "name", ph: "Brevet Pajak A & B", lebar: 2 },
      { k: "issuer", ph: "Ikatan Akuntan Indonesia" },
      { k: "issued", ph: "Mar 2024" },
      { k: "expires", ph: t("Kosongkan bila tanpa masa berlaku", "Leave blank if it doesn't expire") },
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
      { k: "role", ph: t("Pengajar relawan", "Volunteer teacher") },
      { k: "org", ph: "Yayasan Cinta Anak Bangsa" },
      { k: "cause", ph: t("Pendidikan", "Education") },
      { k: "start", ph: "Jan 2023" },
      { k: "end", ph: "Des 2023" },
    ],
    deskripsi: t("Kegiatan dan dampak yang dihasilkan", "Activities and their impact"),
  },
  publications: {
    kosong: { title: "", publisher: "", date: "", url: "", desc: [] },
    judul: (i) => i.title,
    sub: (i) => i.publisher,
    meta: (i) => i.date,
    tautan: (i) => i.url,
    kolom: [
      { k: "title", ph: t("Judul publikasi", "Publication title"), lebar: 2 },
      { k: "publisher", ph: t("Nama media atau jurnal", "Media or journal name") },
      { k: "date", ph: "Jun 2025" },
      { k: "url", ph: "https://...", lebar: 2 },
    ],
    deskripsi: t("Ringkasan isi publikasi", "Publication summary"),
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
    deskripsi: t("Skala, jumlah peserta, dan konteks penghargaan", "Scale, number of participants, and context"),
  },
  languages: {
    kosong: { name: "", proficiency: "" },
    judul: (i) => i.name,
    sub: (i) => i.proficiency,
    kolom: [
      { k: "name", ph: t("Bahasa Inggris", "English") },
      {
        k: "proficiency",
        ph: t("Pilih tingkat", "Select level"),
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
      { k: "role", ph: t("Anggota", "Member") },
      { k: "start", ph: "2023" },
      { k: "end", ph: t("Sekarang", "Present") },
    ],
    deskripsi: t("Kontribusi dan kegiatan di organisasi", "Contributions and activities in the organisation"),
  },
};
