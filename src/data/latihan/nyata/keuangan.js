import { t as _ } from "../../../i18n.js";

/** Detail kerja nyata, kategori Keuangan & Bisnis. */
export default {
  "admin-keuangan": {
    tugas: [
      {
        dari: { nama: "Bu Sari", peran: _("Pemilik usaha katering", "Catering business owner") },
        kanal: "WhatsApp",
        tenggat: _("Tanggal 5 bulan depan", "The 5th of next month"),
        revisi: {
          pesan: _("Makasih! Saya lupa bilang, ada uang muka pesanan pernikahan Rp6 juta yang masuk Maret tapi acaranya April. Itu termasuk penjualan Maret nggak?", "Thanks! I forgot: there's a Rp6m wedding order deposit received in March for an April event. Does it count as March sales?"),
          petunjuk: [
            _("Jelaskan bahwa uang muka untuk acara bulan depan belum menjadi penjualan Maret", "Explain the deposit for next month's event isn't March revenue yet"),
            _("Sebut pencatatannya sebagai uang muka atau pendapatan diterima di muka", "Name its treatment as a customer deposit or unearned revenue"),
            _("Pastikan laba rugi Maret tidak berubah jika Rp6 juta belum termasuk penjualan", "Confirm March P&L is unchanged if the Rp6m wasn't in sales"),
          ],
        },
      },
      {
        dari: { nama: "Pak Wira", peran: _("Pemilik CV Rasa Nusantara", "Owner, CV Rasa Nusantara") },
        kanal: "Email",
        tenggat: _("Hari ini", "Today"),
        revisi: {
          pesan: _("PT Sentosa membalas: invoice belum diproses karena tidak ada nomor PO di invoice kita. Tolong balas dan minta nomor PO-nya, lalu terbitkan ulang invoice.", "PT Sentosa replied: the invoice wasn't processed because it lacked their PO number. Please reply asking for the PO number, then reissue the invoice."),
          petunjuk: [
            _("Akui kekurangan dokumen tanpa menyalahkan", "Acknowledge the missing detail without blame"),
            _("Minta nomor PO dan konfirmasi data lain yang mereka butuhkan", "Ask for the PO number and any other details they need"),
            _("Sebut kapan invoice baru dikirim dan tanggal jatuh tempo yang baru", "State when the new invoice will be sent and the new due date"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Tutup buku akhir bulan untuk klien UMKM", "Month-end close for a small business client"),
      konteks: _("Kamu admin keuangan remote untuk usaha konveksi. Hari ini tanggal 2, laporan bulan lalu harus selesai tanggal 5.", "You're a remote finance admin for a garment business. It's the 2nd; last month's report is due on the 5th."),
      langkah: [
        {
          waktu: "09.00",
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Rekonsiliasi bank selisih Rp425.000. Buku lebih besar dari bank.", "Bank reconciliation is off by Rp425,000. The books are higher than the bank."),
          pilihan: [
            { teks: _("Catat selisih sebagai biaya lain-lain", "Book the gap as miscellaneous expense"), skor: 0, umpan: _("Menutup selisih tanpa tahu penyebabnya menyembunyikan masalah.", "Plugging the gap without knowing why hides problems.") },
            { teks: _("Cocokkan transaksi bank satu per satu, cari biaya admin bank, transfer yang belum masuk, atau salah input", "Match bank transactions one by one, looking for bank fees, pending transfers, or entry errors"), skor: 2, umpan: _("Ditemukan: biaya admin dan pajak bunga Rp25.000 serta satu transfer pelanggan Rp400.000 yang dicatat dua kali.", "Found: Rp25,000 bank fees and interest tax, and one Rp400,000 customer transfer recorded twice.") },
            { teks: _("Tanyakan ke pemilik apakah ia tahu", "Ask the owner if they know"), skor: 1, umpan: _("Boleh, tetapi cek data dulu supaya pertanyaanmu spesifik.", "Fine, but check the data first so your question is specific.") },
          ],
        },
        {
          waktu: "11.30",
          dari: { nama: "Pak Joko", peran: _("Pemilik usaha", "Business owner") },
          kanal: "WhatsApp",
          pesan: _("Tolong catat belanja keluarga Rp3 juta kemarin sebagai biaya bahan ya, biar pajaknya kecil.", "Please book yesterday's Rp3m family shopping as material costs, so tax is lower."),
          pilihan: [
            { teks: _("Catat sesuai permintaan", "Book it as asked"), skor: 0, umpan: _("Ini memalsukan catatan dan bisa bermasalah saat pemeriksaan pajak.", "That falsifies records and can cause trouble in a tax audit.") },
            { teks: _("\"Pak, belanja keluarga saya catat sebagai prive agar laporan tetap benar dan aman kalau diperiksa. Kalau Bapak mau, saya bantu cari biaya usaha yang memang bisa dikurangkan.\"", "\"I'll record family spending as owner's drawings so the books stay correct and safe in an audit. If you like, I'll help find legitimately deductible business costs.\""), skor: 2, umpan: _("Tegas, sopan, dan tetap membantu tujuan klien secara legal.", "Firm, polite, and still helping legally.") },
            { teks: _("Diamkan dan tidak dicatat sama sekali", "Ignore it and don't record it"), skor: 1, umpan: _("Lebih baik daripada memalsukan, tetapi uang keluar dari rekening usaha tetap harus dicatat.", "Better than faking, but money leaving the business account must still be recorded.") },
          ],
        },
        {
          waktu: "14.00",
          dari: { nama: _("\"Supplier Kain Sejahtera\"", "\"Sejahtera Fabrics\"") },
          kanal: "Email",
          pesan: _("Mulai bulan ini pembayaran ke rekening baru kami di bank berbeda. Mohon invoice Rp18 juta dibayar ke rekening baru hari ini.", "From this month please pay our new account at a different bank. Please pay the Rp18m invoice there today."),
          pilihan: [
            { teks: _("Bayar ke rekening baru", "Pay the new account"), skor: 0, umpan: _("Ganti rekening lewat email adalah modus penipuan yang sangat umum.", "Account changes by email are a very common scam.") },
            { teks: _("Tahan pembayaran, telepon supplier di nomor yang sudah tercatat, dan beri tahu pemilik", "Hold payment, call the supplier on the number on file, and tell the owner"), skor: 2, umpan: _("Verifikasi lewat saluran terpercaya mencegah kerugian besar.", "Verifying via a trusted channel prevents big losses.") },
            { teks: _("Balas email untuk konfirmasi", "Reply to confirm"), skor: 1, umpan: _("Jika email itu palsu, penipu yang akan menjawab.", "If it's fake, the scammer will answer.") },
          ],
        },
        {
          waktu: _("Tanggal 5, 15.00", "The 5th, 3 pm"),
          dari: { nama: "Pak Joko", peran: _("Pemilik usaha", "Business owner") },
          kanal: "WhatsApp",
          pesan: _("Laporannya sudah? Saya cuma mau tahu bulan lalu untung atau rugi.", "Is the report done? I just want to know if we made a profit."),
          pilihan: [
            { teks: _("Kirim file laporan lengkap tanpa penjelasan", "Send the full report with no explanation"), skor: 1, umpan: _("Datanya ada, tetapi pemilik harus mencari sendiri jawabannya.", "The data's there, but the owner must dig for the answer.") },
            { teks: _("\"Untung bersih Rp14,2 juta (naik 8%). Kas akhir Rp31 juta. Perhatian: piutang Rp22 juta dari 2 pelanggan sudah lewat 30 hari. Laporan lengkap terlampir.\"", "\"Net profit Rp14.2m (up 8%). Ending cash Rp31m. Note: Rp22m owed by 2 customers is over 30 days late. Full report attached.\""), skor: 2, umpan: _("Jawaban langsung, ditambah satu hal penting yang perlu ditindaklanjuti.", "A direct answer plus one important item to act on.") },
            { teks: _("\"Untung, Pak.\"", "\"Profit.\""), skor: 0, umpan: _("Terlalu singkat dan tanpa angka.", "Too short, no numbers.") },
          ],
        },
      ],
    },
  },

  "business-plan": {
    tugas: [
      {
        dari: { nama: "Mas Bima", peran: _("Pemilik laundry", "Laundry owner") },
        kanal: "WhatsApp",
        tenggat: _("Sebelum pitching Jumat", "Before Friday's pitch"),
        revisi: {
          pesan: _("Mantap! Investornya ternyata lebih tertarik pada skema bagi hasil, bukan saham. Dan mereka bilang Rp150 juta terlalu besar untuk tahap awal. Bisa diubah jadi 1 cabang dulu, Rp80 juta?", "Great! The investor prefers profit sharing over equity. And they say Rp150m is too big for an early stage. Can we change it to 1 branch first, Rp80m?"),
          petunjuk: [
            _("Ubah kebutuhan dana dan penggunaannya untuk 1 cabang", "Change the funding amount and use of funds for 1 branch"),
            _("Ganti skema menjadi bagi hasil dengan placeholder persentase dan jangka waktu", "Switch to profit sharing with placeholders for percentage and term"),
            _("Jaga agar ringkasan tetap di bawah 200 kata", "Keep it under 200 words"),
          ],
        },
      },
      {
        dari: { nama: "Kak Rendi", peran: _("Calon pemilik kedai kopi", "Aspiring coffee shop owner") },
        kanal: "WhatsApp",
        tenggat: _("Besok", "Tomorrow"),
        revisi: {
          pesan: _("Wah, 39 gelas per hari itu realistis nggak ya? Lokasi saya dekat kampus, tapi kalau libur semester sepi. Dan saya juga mau jual roti Rp15.000 dengan modal Rp9.000.", "Is 39 cups a day realistic? My spot is near a campus, but quiet during semester breaks. And I want to sell bread at Rp15,000 with a Rp9,000 cost."),
          petunjuk: [
            _("Bahas risiko musim libur dan sarankan skenario bulan sepi", "Discuss the semester-break risk and suggest a quiet-month scenario"),
            _("Tambahkan margin kontribusi roti (Rp6.000)", "Add the bread contribution margin (Rp6,000)"),
            _("Tunjukkan contoh titik impas jika setiap 3 kopi diikuti 1 roti", "Show a break-even example if every 3 coffees come with 1 bread"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Menyiapkan proposal kredit usaha", "Preparing a business loan proposal"),
      konteks: _("Klienmu pemilik bengkel motor yang ingin mengajukan kredit Rp200 juta ke bank untuk membeli peralatan.", "Your client owns a motorbike workshop and wants a Rp200m bank loan for equipment."),
      langkah: [
        {
          waktu: _("Minggu 1", "Week 1"),
          dari: { nama: "Pak Agus", peran: _("Pemilik bengkel", "Workshop owner") },
          kanal: "WhatsApp",
          pesan: _("Laporan keuangan saya cuma catatan buku tulis. Cukup nggak?", "My finances are just notes in an exercise book. Is that enough?"),
          pilihan: [
            { teks: _("\"Tidak cukup, cari konsultan lain.\"", "\"Not enough, find another consultant.\""), skor: 0, umpan: _("Banyak UMKM mulai dari catatan sederhana. Tugasmu membantu merapikannya.", "Many small businesses start with simple notes. Your job is to help tidy them.") },
            { teks: _("\"Bisa jadi dasar. Saya bantu susun laporan 12 bulan dari catatan dan mutasi rekening. Tolong siapkan buku catatan dan mutasi rekening setahun terakhir.\"", "\"It's a starting point. I'll build 12 months of statements from your notes and bank statements. Please gather the notebook and a year of bank statements.\""), skor: 2, umpan: _("Solutif dan jelas soal data yang dibutuhkan.", "Solution-focused and clear on data needs.") },
            { teks: _("\"Kita buat angkanya saja yang bagus.\"", "\"Let's just make up good numbers.\""), skor: 0, umpan: _("Memalsukan data untuk kredit melanggar hukum.", "Falsifying data for a loan is illegal.") },
          ],
        },
        {
          waktu: _("Minggu 2", "Week 2"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Laba bersih rata-rata Rp9 juta per bulan. Cicilan kredit Rp200 juta selama 3 tahun sekitar Rp6,8 juta per bulan.", "Average net profit is Rp9m a month. A Rp200m 3-year loan costs about Rp6.8m a month."),
          pilihan: [
            { teks: _("Ajukan Rp200 juta apa adanya", "Apply for Rp200m as is"), skor: 1, umpan: _("Cicilan memakan 75% laba, risiko gagal bayar tinggi dan bank mungkin menolak.", "Repayments take 75% of profit; default risk is high and the bank may refuse.") },
            { teks: _("Diskusikan opsi: jumlah lebih kecil, tenor lebih panjang, atau proyeksi kenaikan laba dari peralatan baru dengan asumsi yang jelas", "Discuss options: a smaller amount, longer tenor, or projected profit gains from new equipment with clear assumptions"), skor: 2, umpan: _("Kamu melindungi klien dari beban cicilan yang berat dan menaikkan peluang disetujui.", "You protect the client from heavy repayments and improve approval odds.") },
            { teks: _("Naikkan proyeksi laba supaya terlihat aman", "Inflate projected profit to look safe"), skor: 0, umpan: _("Proyeksi yang dibesar-besarkan berbahaya bagi klien dan bisa ketahuan analis bank.", "Inflated projections endanger the client and bank analysts can spot them.") },
          ],
        },
        {
          waktu: _("Minggu 3", "Week 3"),
          dari: { nama: _("Analis kredit bank", "Bank credit analyst") },
          kanal: "Email",
          pesan: _("Kami butuh rincian penggunaan dana dan bukti penawaran harga peralatan.", "We need a breakdown of fund use and equipment quotes."),
          pilihan: [
            { teks: _("Kirim tabel penggunaan dana dan 2 penawaran harga dari supplier berbeda", "Send a use-of-funds table and 2 quotes from different suppliers"), skor: 2, umpan: _("Lengkap dan meyakinkan.", "Complete and convincing.") },
            { teks: _("Kirim perkiraan kasar", "Send rough estimates"), skor: 1, umpan: _("Bank butuh bukti, bukan perkiraan.", "Banks need evidence, not estimates.") },
            { teks: _("Minta klien mengurus sendiri", "Tell the client to handle it"), skor: 0, umpan: _("Kamu dibayar untuk mendampingi prosesnya.", "You're paid to support the process.") },
          ],
        },
        {
          waktu: _("Minggu 4", "Week 4"),
          dari: { nama: "Pak Agus", peran: _("Pemilik bengkel", "Workshop owner") },
          kanal: "WhatsApp",
          pesan: _("Kreditnya disetujui Rp150 juta! Terima kasih. Apa yang perlu saya jaga sekarang?", "Approved for Rp150m! Thank you. What should I watch now?"),
          pilihan: [
            { teks: _("Beri 3 saran: catat penjualan harian, pisahkan rekening usaha, dan sisihkan cicilan di awal bulan", "Give 3 tips: record daily sales, separate business accounts, and set aside repayments at the start of the month"), skor: 2, umpan: _("Saran praktis yang menjaga kemampuan bayar klien.", "Practical tips that protect repayment ability.") },
            { teks: _("\"Sama-sama, Pak.\"", "\"You're welcome.\""), skor: 1, umpan: _("Sopan, tetapi kesempatan memberi nilai tambah terlewat.", "Polite, but a chance to add value is missed.") },
            { teks: _("Tawarkan kredit tambahan dari pihak lain", "Offer extra credit from another lender"), skor: 0, umpan: _("Menambah utang baru tepat setelah kredit cair berisiko tinggi.", "New debt right after a loan is high risk.") },
          ],
        },
      ],
    },
  },

  "konsultan-pajak": {
    tugas: [
      {
        dari: { nama: "Raka", peran: _("Desainer freelance", "Freelance designer") },
        kanal: "WhatsApp",
        tenggat: _("Minggu ini", "This week"),
        revisi: {
          pesan: _("Makasih, Kak! Penghasilan saya tahun ini sekitar Rp180 juta, kebanyakan dari klien luar negeri. Saya dengar bisa pakai norma penghitungan. Itu apa dan apa syaratnya?", "Thanks! My income this year is about Rp180m, mostly from overseas clients. I heard I can use the deemed-profit norm. What is it and what are the requirements?"),
          petunjuk: [
            _("Jelaskan norma penghitungan secara sederhana (penghasilan neto dihitung dari persentase bruto)", "Explain the norm simply (net income is a percentage of gross)"),
            _("Sebut syarat umumnya: batas peredaran bruto dan pemberitahuan ke DJP di awal tahun", "Mention the general conditions: a gross revenue cap and notifying the DGT early in the year"),
            _("Sarankan mengecek persentase norma yang berlaku untuk jenis pekerjaan dan kotanya di aturan resmi", "Suggest checking the applicable norm rate for the job and city in official rules"),
          ],
        },
      },
      {
        dari: { nama: "Bu Mira", peran: _("Manajer HR", "HR manager") },
        kanal: "Email",
        tenggat: _("Akhir minggu", "End of the week"),
        revisi: {
          pesan: _("Checklistnya bagus. Banyak karyawan bertanya: kalau punya usaha sampingan jualan online, apa yang harus disiapkan tambahan?", "Great checklist. Many staff ask: if they have an online side business, what extra do they need?"),
          petunjuk: [
            _("Tambahkan bagian khusus untuk karyawan dengan usaha sampingan", "Add a section for employees with side businesses"),
            _("Sebut catatan omzet bulanan dan bukti setor PPh final bila ada", "Mention monthly turnover records and final tax payment receipts if any"),
            _("Sarankan konsultasi pribadi untuk kasus yang lebih rumit", "Suggest individual consultation for complex cases"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Seminggu sebelum batas SPT 31 Maret", "The week before the 31 March deadline"),
      konteks: _("Kamu pendamping SPT dengan 25 klien. 8 klien belum mengirim dokumen.", "You assist 25 clients with returns. 8 haven't sent documents."),
      langkah: [
        {
          waktu: "24 Maret",
          dari: { nama: _("Klien baru", "New client") },
          kanal: "WhatsApp",
          pesan: _("Kak, saya mau dibantu lapor SPT. Penghasilan dari 3 kantor dan sewa kos. Bisa selesai minggu ini?", "I need help filing. Income from 3 employers and a boarding house. Done this week?"),
          pilihan: [
            { teks: _("Terima semua klien baru", "Accept every new client"), skor: 0, umpan: _("Dengan 8 klien lama yang belum lengkap, kualitas dan tenggat bisa terancam.", "With 8 incomplete existing clients, quality and deadlines are at risk.") },
            { teks: _("Cek kapasitas dulu, terima jika dokumen bisa dikirim hari ini, atau arahkan ke pilihan lain", "Check capacity first; accept if documents arrive today, or point to alternatives"), skor: 2, umpan: _("Kamu menjaga komitmen ke klien lama dan jujur soal kemampuan.", "You protect existing commitments and stay honest about capacity.") },
            { teks: _("Tolak tanpa penjelasan", "Decline without explanation"), skor: 1, umpan: _("Aman, tetapi kurang ramah dan bisa kehilangan klien tahun depan.", "Safe, but unfriendly; you may lose them next year.") },
          ],
        },
        {
          waktu: "26 Maret",
          dari: { nama: "Raka", peran: _("Klien", "Client") },
          kanal: "WhatsApp",
          pesan: _("Kak, ini password Coretax saya biar Kakak yang isi semuanya ya.", "Here's my Coretax password so you can fill everything in."),
          pilihan: [
            { teks: _("Pakai passwordnya untuk mengisi", "Use the password to file"), skor: 0, umpan: _("Memegang kredensial klien berisiko bagi kalian berdua.", "Holding client credentials is risky for both of you.") },
            { teks: _("Minta klien tidak membagikan password, lalu dampingi lewat video call saat klien mengisi sendiri", "Ask the client not to share passwords, then guide them on a video call while they file"), skor: 2, umpan: _("Aman dan klien belajar prosesnya.", "Safe, and the client learns the process.") },
            { teks: _("Simpan password di catatan untuk tahun depan", "Save the password for next year"), skor: 0, umpan: _("Menyimpan kredensial klien sangat berisiko.", "Storing client credentials is very risky.") },
          ],
        },
        {
          waktu: "28 Maret",
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Masih ada 3 klien yang belum mengirim dokumen.", "3 clients still haven't sent documents."),
          pilihan: [
            { teks: _("Tunggu sampai mereka mengirim", "Wait for them"), skor: 0, umpan: _("Tanpa pengingat, mereka bisa terlambat dan terkena denda.", "Without reminders they may file late and get fined.") },
            { teks: _("Kirim pengingat personal berisi daftar dokumen yang kurang, tenggat 29 Maret, dan risiko denda keterlambatan", "Send personal reminders listing missing documents, a 29 March cutoff, and late-filing penalties"), skor: 2, umpan: _("Jelas dan membantu klien bertindak.", "Clear and helps clients act.") },
            { teks: _("Kirim pesan broadcast umum", "Send a generic broadcast"), skor: 1, umpan: _("Lebih baik daripada diam, tetapi pesan umum mudah diabaikan.", "Better than nothing, but generic messages get ignored.") },
          ],
        },
        {
          waktu: "30 Maret",
          dari: { nama: _("Klien", "Client") },
          kanal: "WhatsApp",
          pesan: _("Kak, bisa nggak penghasilan sewa kos saya nggak usah dilaporkan? Toh nggak ada yang tahu.", "Can I skip reporting my boarding house income? Nobody would know."),
          pilihan: [
            { teks: _("\"Boleh, aman kok.\"", "\"Sure, it's safe.\""), skor: 0, umpan: _("Menyarankan menyembunyikan penghasilan adalah pelanggaran.", "Advising hidden income is a violation.") },
            { teks: _("\"Penghasilan sewa wajib dilaporkan. Sewa tanah dan bangunan biasanya dikenai PPh final, jadi kita cek apakah sudah dibayar dan berapa sebenarnya kewajibannya.\"", "\"Rental income must be reported. Land and building rent is usually subject to final tax, so let's check whether it's been paid and what's actually owed.\""), skor: 2, umpan: _("Jujur, akurat, dan tetap membantu klien memahami kewajibannya yang sebenarnya.", "Honest, accurate, and helps the client understand the real obligation.") },
            { teks: _("\"Terserah Kakak.\"", "\"Up to you.\""), skor: 1, umpan: _("Kamu menghindari tanggung jawab memberi informasi yang benar.", "You dodge the duty to give correct information.") },
          ],
        },
      ],
    },
  },

  "sop-compliance": {
    tugas: [
      {
        dari: { nama: "Bu Hana", peran: _("Manajer keuangan", "Finance manager") },
        kanal: "Email",
        tenggat: _("2 minggu", "2 weeks"),
        revisi: {
          pesan: _("SOP-nya jelas. Tapi kami cuma punya 2 orang di keuangan, jadi tidak bisa 3 orang berbeda untuk mengaju, menyetujui, dan membayar. Bagaimana solusinya?", "Clear SOP. But we only have 2 finance people, so we can't have 3 different people request, approve, and pay. What's the fix?"),
          petunjuk: [
            _("Usulkan kontrol pengganti (misalnya persetujuan direktur di aplikasi bank)", "Propose compensating controls (e.g. director approval in the bank app)"),
            _("Tambahkan pemeriksaan berkala oleh pemilik atau atasan", "Add periodic review by the owner or manager"),
            _("Sesuaikan langkah SOP tanpa menghilangkan pencegahan klaim ganda", "Adjust the steps without losing double-claim prevention"),
          ],
        },
      },
      {
        dari: { nama: "Mas Danu", peran: _("Pemilik toko online", "Online shop owner") },
        kanal: "WhatsApp",
        tenggat: _("Minggu depan", "Next week"),
        revisi: {
          pesan: _("Oke, checklistnya saya pakai. Pertanyaan: admin kami masih pakai grup WhatsApp untuk kirim alamat pelanggan ke kurir. Itu bermasalah nggak? Apa alternatifnya?", "OK, I'll use the checklist. Question: our admins still use a WhatsApp group to send customer addresses to couriers. Is that a problem? What's the alternative?"),
          petunjuk: [
            _("Jelaskan risikonya dengan bahasa sederhana", "Explain the risk simply"),
            _("Usulkan alternatif praktis yang sesuai usaha kecil", "Propose a practical small-business alternative"),
            _("Tambahkan satu poin checklist terkait hal ini", "Add one checklist item for it"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Proyek SOP di perusahaan distribusi", "An SOP project at a distribution company"),
      konteks: _("Kamu konsultan remote yang ditugasi menulis SOP penerimaan barang di gudang.", "You're a remote consultant writing a goods receiving SOP for a warehouse."),
      langkah: [
        {
          waktu: _("Hari 1", "Day 1"),
          dari: { nama: "Pak Tono", peran: _("Direktur", "Director") },
          kanal: "Email",
          pesan: _("Ini SOP perusahaan lain yang saya dapat dari teman. Tinggal disesuaikan sedikit saja.", "Here's another company's SOP from a friend. Just tweak it a bit."),
          pilihan: [
            { teks: _("Salin dan ganti nama perusahaannya", "Copy it and change the company name"), skor: 0, umpan: _("SOP yang tidak sesuai proses nyata tidak akan dipakai.", "An SOP that doesn't match reality won't be used.") },
            { teks: _("Pakai sebagai referensi, lalu wawancarai staf gudang untuk memetakan proses mereka sendiri", "Use it as reference, then interview warehouse staff to map their own process"), skor: 2, umpan: _("Proses nyata menjadi dasar SOP yang dipakai.", "The real process makes an SOP that's used.") },
            { teks: _("Abaikan file itu", "Ignore the file"), skor: 1, umpan: _("Referensi bisa membantu struktur, jadi tidak perlu diabaikan.", "References can help structure; no need to ignore it.") },
          ],
        },
        {
          waktu: _("Hari 3", "Day 3"),
          dari: { nama: "Mas Eko", peran: _("Kepala gudang", "Warehouse head") },
          kanal: "WhatsApp",
          pesan: _("SOP ini bikin kerja tambah lama. Kami biasa langsung terima barang tanpa cek surat jalan.", "This SOP slows us down. We usually take goods without checking delivery notes."),
          pilihan: [
            { teks: _("\"Pokoknya harus diikuti, perintah direktur.\"", "\"Just follow it, the director said so.\""), skor: 0, umpan: _("Paksaan membuat staf mencari cara menghindari SOP.", "Forcing it makes staff find ways around it.") },
            { teks: _("Tanyakan bagian mana yang paling lama, lalu cari cara mempercepat, misalnya cek sampel untuk barang tertentu, sambil jelaskan risiko barang kurang", "Ask which step is slowest, then find a faster way, like sample checks for some items, while explaining shortage risks"), skor: 2, umpan: _("Melibatkan staf membuat SOP realistis dan diterima.", "Involving staff makes SOPs realistic and accepted.") },
            { teks: _("Hapus langkah cek surat jalan", "Remove the delivery note check"), skor: 0, umpan: _("Itu kontrol utama untuk mencegah barang kurang atau hilang.", "It's the key control against shortages and loss.") },
          ],
        },
        {
          waktu: _("Hari 5", "Day 5"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("SOP selesai ditulis.", "The SOP is written."),
          pilihan: [
            { teks: _("Langsung kirim ke direktur untuk disahkan", "Send it to the director for sign-off"), skor: 1, umpan: _("Belum diuji, bisa ada langkah yang tidak jalan di lapangan.", "Untested; some steps may not work in practice.") },
            { teks: _("Minta satu staf baru mencoba menjalankannya saat barang datang, catat kebingungannya, lalu perbaiki", "Have a new staff member try it on a delivery, note confusion, then fix"), skor: 2, umpan: _("Uji coba singkat menemukan masalah sebelum disahkan.", "A short trial finds problems before sign-off.") },
            { teks: _("Kirim ke semua staf tanpa pelatihan", "Send it to all staff with no training"), skor: 0, umpan: _("Tanpa pelatihan, SOP jarang dipahami.", "Without training, SOPs are rarely understood.") },
          ],
        },
        {
          waktu: _("Bulan berikutnya", "Next month"),
          dari: { nama: "Pak Tono", peran: _("Direktur", "Director") },
          kanal: "Email",
          pesan: _("Auditor bulan depan datang. Bisa buatkan catatan pemeriksaan barang 6 bulan terakhir supaya terlihat SOP sudah jalan lama?", "Auditors come next month. Can you create receiving check records for the last 6 months so it looks like the SOP has run for a while?"),
          pilihan: [
            { teks: _("Buat catatan mundur", "Backdate the records"), skor: 0, umpan: _("Ini pemalsuan dokumen.", "That's falsifying documents.") },
            { teks: _("Tolak dan sarankan menunjukkan SOP baru, catatan sejak SOP berlaku, dan rencana perbaikan kepada auditor", "Decline and suggest showing the new SOP, records since it started, and an improvement plan to the auditors"), skor: 2, umpan: _("Jujur dan biasanya diterima auditor sebagai langkah perbaikan.", "Honest, and auditors usually accept it as remediation.") },
            { teks: _("Diam saja", "Stay silent"), skor: 1, umpan: _("Tidak melanggar, tetapi klien butuh arahan.", "Not wrong, but the client needs guidance.") },
          ],
        },
      ],
    },
  },

  "analis-keuangan": {
    tugas: [
      {
        dari: { nama: "Mbak Citra", peran: _("Investment associate", "Investment associate") },
        kanal: "Slack",
        tenggat: _("Besok, 10.00", "Tomorrow, 10 am"),
        revisi: {
          pesan: _("Bagus. Komite akan tanya: kalau suku bunga naik 2%, perusahaan mana yang lebih terdampak? Utang Y sebagian besar berbunga mengambang.", "Good. The committee will ask: if rates rise 2%, which company is hit harder? Most of Y's debt is floating-rate."),
          petunjuk: [
            _("Hitung tambahan beban bunga kasar untuk Y (2% × 500 miliar = 10 miliar)", "Roughly calculate Y's extra interest (2% × 500bn = 10bn)"),
            _("Bandingkan dengan laba bersih Y dan X", "Compare with Y's and X's net profit"),
            _("Tulis kesimpulan singkat untuk komite", "Write a short conclusion for the committee"),
          ],
        },
      },
      {
        dari: { nama: "Kevin", peran: _("Co-founder startup", "Startup co-founder") },
        kanal: "Slack",
        tenggat: _("Sebelum rapat investor Kamis", "Before Thursday's investor meeting"),
        revisi: {
          pesan: _("Makasih! Investor minta skenario pesimis juga: churn 8% dan pelanggan baru hanya 200 per bulan. Bisa ditambahkan?", "Thanks! Investors want a pessimistic case too: 8% churn and only 200 new customers a month. Can you add it?"),
          petunjuk: [
            _("Hitung 3 bulan untuk skenario pesimis dengan rumus yang sama", "Calculate 3 months for the pessimistic case with the same method"),
            _("Sajikan berdampingan dengan skenario dasar", "Show it side by side with the base case"),
            _("Tulis satu kalimat tentang apa yang paling memengaruhi hasil", "Write one sentence on what drives the outcome most"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Minggu laporan kuartalan", "Quarterly reporting week"),
      konteks: _("Kamu analis FP&A remote di perusahaan ritel. Laporan kuartalan untuk direksi harus siap Jumat.", "You're a remote FP&A analyst at a retailer. The quarterly board report is due Friday."),
      langkah: [
        {
          waktu: _("Senin", "Monday"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Neraca di model tidak seimbang, selisih Rp1,2 miliar.", "The model's balance sheet is off by Rp1.2bn."),
          pilihan: [
            { teks: _("Tambahkan baris \"penyesuaian\" agar seimbang", "Add an \"adjustment\" line to balance it"), skor: 0, umpan: _("Menutupi selisih membuat seluruh model tidak bisa dipercaya.", "Plugging it makes the whole model untrustworthy.") },
            { teks: _("Telusuri arus kas dan perubahan neraca per akun untuk menemukan penyebabnya", "Trace cash flow and balance sheet changes per account to find the cause"), skor: 2, umpan: _("Ditemukan: penyusutan belum dikurangkan dari aset tetap.", "Found: depreciation wasn't deducted from fixed assets.") },
            { teks: _("Laporkan ke atasan tanpa mencari tahu", "Report to your manager without investigating"), skor: 1, umpan: _("Transparan, tetapi cari dulu penyebabnya.", "Transparent, but investigate first.") },
          ],
        },
        {
          waktu: _("Rabu", "Wednesday"),
          dari: { nama: _("Kepala divisi penjualan", "Head of sales") },
          kanal: "Slack",
          pesan: _("Tolong proyeksi kuartal depan dibuat naik 25% ya, biar target tim saya terlihat ambisius.", "Please make next quarter's projection +25% so my team's target looks ambitious."),
          pilihan: [
            { teks: _("Ubah ke 25%", "Change it to 25%"), skor: 0, umpan: _("Proyeksi tanpa dasar menyesatkan direksi.", "Baseless projections mislead the board.") },
            { teks: _("Tunjukkan skenario dasar (dari data) dan skenario target 25% berdampingan, beserta apa yang harus terjadi agar 25% tercapai", "Show the base case (data-driven) and the 25% target side by side, with what must happen to hit 25%"), skor: 2, umpan: _("Kamu mengakomodasi ambisi tanpa mengorbankan objektivitas.", "You accommodate ambition without sacrificing objectivity.") },
            { teks: _("Tolak tanpa penjelasan", "Refuse without explanation"), skor: 1, umpan: _("Objektif, tetapi hubungan kerja bisa terganggu.", "Objective, but it may strain relations.") },
          ],
        },
        {
          waktu: _("Kamis", "Thursday"),
          dari: { nama: "CFO", peran: _("Atasan", "Manager") },
          kanal: "Slack",
          pesan: _("Margin kotor turun dari 32% ke 28%. Kenapa?", "Gross margin fell from 32% to 28%. Why?"),
          pilihan: [
            { teks: _("\"Biaya naik, Pak.\"", "\"Costs went up.\""), skor: 1, umpan: _("Benar tetapi terlalu umum. CFO butuh penyebab spesifik.", "True but vague. The CFO needs specifics.") },
            { teks: _("Uraikan penyebab: kenaikan harga beli 2 kategori utama (-2,5 poin), diskon besar akhir kuartal (-1 poin), dan perubahan bauran produk (-0,5 poin)", "Break it down: higher purchase prices in 2 main categories (-2.5 pts), heavy end-of-quarter discounts (-1 pt), and product mix (-0.5 pt)"), skor: 2, umpan: _("Penguraian per faktor langsung bisa ditindaklanjuti.", "A factor breakdown is immediately actionable.") },
            { teks: _("Kirim seluruh file Excel", "Send the whole Excel file"), skor: 0, umpan: _("CFO butuh jawaban, bukan file.", "The CFO needs an answer, not a file.") },
          ],
        },
        {
          waktu: _("Jumat", "Friday"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Laporan siap. Satu angka dari tim operasional belum final.", "The report's ready. One figure from operations isn't final."),
          pilihan: [
            { teks: _("Kirim dan tandai angka itu sebagai sementara, dengan tanggal angka final", "Send it with that figure marked provisional and the final date"), skor: 2, umpan: _("Tepat waktu dan transparan.", "On time and transparent.") },
            { teks: _("Tunda laporan sampai angka final", "Delay until the figure is final"), skor: 1, umpan: _("Akurat, tetapi direksi kehilangan laporan tepat waktu.", "Accurate, but the board misses its timely report.") },
            { teks: _("Isi dengan perkiraan tanpa tanda", "Fill in an estimate without marking it"), skor: 0, umpan: _("Angka yang tampak final padahal belum dapat menyesatkan.", "A seemingly final but unconfirmed number misleads.") },
          ],
        },
      ],
    },
  },
};
