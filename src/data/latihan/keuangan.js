import { t as _ } from "../../i18n.js";

/** Latihan praktik kategori Keuangan & Bisnis. */
export default {
  "admin-keuangan": {
    kuis: [
      {
        q: _("Saat rekonsiliasi bank, saldo di buku kas lebih besar Rp2,5 juta daripada saldo rekening koran. Langkah pertama yang paling tepat?", "During bank reconciliation, the cash book is Rp2.5 million higher than the bank statement. Best first step?"),
        o: [
          _("Ubah saldo buku agar sama dengan bank", "Change the book balance to match the bank"),
          _("Cocokkan transaksi satu per satu untuk mencari selisih, misalnya cek yang belum dicairkan atau biaya bank yang belum dicatat", "Match transactions one by one to find the gap, such as uncleared payments or unrecorded bank fees"),
          _("Abaikan karena selisihnya kecil", "Ignore it, the gap is small"),
          _("Laporkan sebagai kehilangan uang", "Report it as lost money"),
        ],
        a: 1,
        e: _("Selisih rekonsiliasi biasanya berasal dari perbedaan waktu pencatatan atau biaya bank. Cari penyebabnya sebelum membuat penyesuaian.", "Reconciliation gaps usually come from timing differences or bank fees. Find the cause before making adjustments."),
      },
      {
        q: _("Pemilik usaha bertanya, \"Bulan ini kita untung, tapi kenapa kas menipis?\" Penjelasan yang paling mungkin?", "The owner asks, \"We made a profit this month, so why is cash low?\" Most likely explanation?"),
        o: [
          _("Laporannya pasti salah", "The report must be wrong"),
          _("Banyak penjualan masih berupa piutang yang belum dibayar pelanggan, atau ada pembelian stok dan cicilan", "Many sales are still unpaid receivables, or cash went to stock and loan repayments"),
          _("Laba selalu sama dengan kas", "Profit always equals cash"),
          _("Ada karyawan yang mencuri", "An employee is stealing"),
        ],
        a: 1,
        e: _("Laba dicatat saat penjualan terjadi, sedangkan kas bertambah saat uang benar-benar diterima. Itu sebabnya laporan arus kas tetap penting.", "Profit is recorded at the sale, while cash rises only when money actually arrives. That's why the cash flow statement matters."),
      },
      {
        q: _("Kamu menerima nota pembelian tanpa tanggal dan tanpa nama penjual. Apa yang sebaiknya dilakukan?", "You receive a purchase receipt with no date and no seller name. What should you do?"),
        o: [
          _("Langsung catat sebagai biaya", "Record it as an expense right away"),
          _("Minta bukti yang lengkap atau konfirmasi ke pihak yang membeli sebelum mencatat", "Ask for complete proof or confirm with the buyer before recording"),
          _("Buang notanya", "Throw it away"),
          _("Isi sendiri tanggal dan nama penjualnya", "Fill in the date and seller yourself"),
        ],
        a: 1,
        e: _("Bukti transaksi yang lengkap penting untuk audit dan pajak. Mengisi data sendiri bisa dianggap memalsukan dokumen.", "Complete supporting documents matter for audits and tax. Filling in details yourself can count as falsifying records."),
      },
      {
        q: _("Klien memintamu mencatat pengeluaran pribadinya (belanja keluarga) sebagai biaya usaha. Respons yang tepat?", "A client asks you to record personal spending (family shopping) as business expenses. Right response?"),
        o: [
          _("Ikuti saja, itu urusan klien", "Just do it, it's their business"),
          _("Jelaskan bahwa biaya pribadi harus dipisahkan, misalnya dicatat sebagai prive atau penarikan pemilik", "Explain personal costs must be separated, for example recorded as owner's drawings"),
          _("Catat setengahnya", "Record half"),
          _("Diamkan tanpa dicatat", "Leave it unrecorded"),
        ],
        a: 1,
        e: _("Mencampur keuangan pribadi dan usaha membuat laporan tidak akurat dan bisa bermasalah secara pajak. Prive adalah pencatatan yang benar.", "Mixing personal and business money makes reports inaccurate and can cause tax problems. Owner's drawings is the correct treatment."),
      },
      {
        q: _("Email dari \"vendor lama\" memberi tahu nomor rekening mereka berganti dan meminta pembayaran berikutnya ke rekening baru. Apa yang dilakukan?", "An email from a \"long-time vendor\" says their bank account changed and asks for the next payment to the new account. What do you do?"),
        o: [
          _("Langsung perbarui data rekening", "Update the bank details right away"),
          _("Verifikasi lewat telepon ke nomor vendor yang sudah tercatat sebelum mengubah apa pun", "Verify by phone using the vendor's number already on file before changing anything"),
          _("Balas email untuk konfirmasi", "Reply to the email to confirm"),
          _("Bayar ke kedua rekening", "Pay both accounts"),
        ],
        a: 1,
        e: _("Penggantian rekening lewat email adalah modus penipuan yang sering menyasar staf keuangan. Verifikasi selalu lewat saluran yang sudah terpercaya.", "Account-change emails are a common scam targeting finance staff. Always verify through a trusted channel you already have."),
      },
    ],
    tugas: [
      {
        judul: _("Susun laporan laba rugi sederhana", "Prepare a simple profit and loss statement"),
        brief: _(
          "Data usaha katering saya bulan Maret:\nPenjualan Rp48 juta · Bahan baku Rp19 juta · Gaji 3 karyawan Rp9 juta · Sewa dapur Rp3,5 juta · Listrik dan gas Rp1,8 juta · Iklan Instagram Rp1,2 juta · Saya ambil uang untuk keperluan rumah Rp4 juta.\nTolong buatkan laporan laba ruginya.",
          "My catering business data for March:\nSales Rp48m · Ingredients Rp19m · Wages for 3 staff Rp9m · Kitchen rent Rp3.5m · Electricity and gas Rp1.8m · Instagram ads Rp1.2m · I took Rp4m for household needs.\nPlease prepare the profit and loss statement.",
        ),
        langkah: [
          _("Susun laporan: penjualan, harga pokok, laba kotor, biaya operasional, laba bersih.", "Lay out: sales, cost of goods, gross profit, operating expenses, net profit."),
          _("Tentukan perlakuan untuk uang Rp4 juta yang diambil pemilik.", "Decide how to treat the Rp4m the owner took."),
          _("Tulis satu catatan singkat untuk pemilik.", "Write one short note for the owner."),
        ],
        rubrik: [
          _("Laba kotor benar: Rp29 juta", "Gross profit correct: Rp29m"),
          _("Total biaya operasional benar: Rp15,5 juta", "Total operating expenses correct: Rp15.5m"),
          _("Laba bersih benar: Rp13,5 juta", "Net profit correct: Rp13.5m"),
          _("Rp4 juta tidak dicatat sebagai biaya, tetapi sebagai prive", "The Rp4m is not an expense but owner's drawings"),
          _("Ada catatan yang berguna bagi pemilik", "Includes a useful note for the owner"),
        ],
        contoh: _(
          "Laporan Laba Rugi, Maret\nPenjualan: 48.000.000\nHarga pokok (bahan baku): (19.000.000)\nLaba kotor: 29.000.000 (margin kotor 60%)\n\nBiaya operasional:\n• Gaji: 9.000.000\n• Sewa dapur: 3.500.000\n• Listrik dan gas: 1.800.000\n• Iklan: 1.200.000\nTotal: (15.500.000)\n\nLaba bersih: 13.500.000\n\nCatatan: Rp4 juta untuk keperluan rumah dicatat sebagai prive (penarikan pemilik), bukan biaya, sehingga tidak mengurangi laba. Namun prive tetap mengurangi kas. Disarankan memisahkan rekening pribadi dan usaha.",
          "Profit and Loss, March\nSales: 48,000,000\nCost of goods (ingredients): (19,000,000)\nGross profit: 29,000,000 (60% gross margin)\n\nOperating expenses:\n• Wages: 9,000,000\n• Kitchen rent: 3,500,000\n• Electricity and gas: 1,800,000\n• Ads: 1,200,000\nTotal: (15,500,000)\n\nNet profit: 13,500,000\n\nNote: the Rp4m for household needs is owner's drawings, not an expense, so it doesn't reduce profit. It does reduce cash. Separate personal and business bank accounts is recommended.",
        ),
      },
      {
        judul: _("Tulis pengingat piutang yang sopan", "Write a polite overdue payment reminder"),
        brief: _(
          "Pelanggan korporat belum membayar invoice Rp12,6 juta yang jatuh tempo 14 hari lalu. Ini pelanggan penting. Tolong buat email pengingat.",
          "A corporate customer hasn't paid a Rp12.6m invoice that was due 14 days ago. It's an important customer. Please write a reminder email.",
        ),
        langkah: [
          _("Tulis email pengingat yang sopan dan jelas.", "Write a polite, clear reminder."),
          _("Sertakan detail yang memudahkan pelanggan membayar.", "Include details that make paying easy."),
          _("Tawarkan bantuan jika ada kendala.", "Offer help if there's an issue."),
        ],
        rubrik: [
          _("Menyebut nomor invoice, nominal, dan tanggal jatuh tempo", "Mentions invoice number, amount, and due date"),
          _("Nada sopan, tidak menuduh", "Polite, not accusatory"),
          _("Ada informasi pembayaran (rekening)", "Includes payment details (account)"),
          _("Ada permintaan tindakan dan tenggat yang jelas", "Clear action and deadline"),
        ],
        contoh: _(
          "Subjek: Pengingat Pembayaran Invoice INV-2024-031\n\nYth. Bapak/Ibu Bagian Keuangan PT Sentosa,\n\nKami ingin mengingatkan bahwa invoice INV-2024-031 sebesar Rp12.600.000 telah jatuh tempo pada 1 Maret 2024. Invoice terlampir untuk memudahkan pengecekan.\n\nPembayaran dapat dilakukan ke rekening BCA 123-456-7890 atas nama CV Rasa Nusantara. Mohon konfirmasi rencana tanggal pembayaran paling lambat Jumat, 22 Maret 2024.\n\nJika ada dokumen yang perlu dilengkapi atau kendala dalam proses pembayaran, kami dengan senang hati membantu.\n\nTerima kasih atas kerja samanya.\n\nSalam,\n[Nama], Admin Keuangan",
          "Subject: Payment Reminder for Invoice INV-2024-031\n\nDear Finance Team at PT Sentosa,\n\nThis is a reminder that invoice INV-2024-031 for Rp12,600,000 was due on 1 March 2024. The invoice is attached for reference.\n\nPayment can be made to BCA account 123-456-7890 in the name of CV Rasa Nusantara. Please confirm your planned payment date by Friday, 22 March 2024.\n\nIf any documents are needed or there's an issue with processing, we're happy to help.\n\nThank you for your cooperation.\n\nBest regards,\n[Name], Finance Admin",
        ),
      },
    ],
  },

  "business-plan": {
    kuis: [
      {
        q: _("Bagian business plan mana yang biasanya dibaca pertama kali oleh investor?", "Which business plan section do investors usually read first?"),
        o: [
          _("Lampiran", "Appendix"),
          _("Ringkasan eksekutif", "Executive summary"),
          _("Daftar isi", "Table of contents"),
          _("Profil tim lengkap", "Full team profiles"),
        ],
        a: 1,
        e: _("Ringkasan eksekutif menentukan apakah investor mau membaca lebih lanjut. Tulis paling akhir, tetapi letakkan paling depan.", "The executive summary decides whether investors read further. Write it last, place it first."),
      },
      {
        q: _("Klien yakin \"pasar kami adalah seluruh 270 juta penduduk Indonesia\". Bagaimana memperbaikinya?", "A client believes \"our market is all 270 million Indonesians\". How do you improve this?"),
        o: [
          _("Pertahankan, angka besar menarik investor", "Keep it, big numbers attract investors"),
          _("Persempit menjadi TAM, SAM, dan SOM berdasarkan segmen yang realistis dijangkau", "Narrow it into TAM, SAM, and SOM based on realistically reachable segments"),
          _("Ganti dengan pasar global", "Use the global market instead"),
          _("Hapus bagian analisis pasar", "Remove the market analysis section"),
        ],
        a: 1,
        e: _("Investor menilai klaim pasar yang terlalu luas sebagai tanda kurang riset. TAM, SAM, dan SOM menunjukkan ukuran pasar yang bisa benar-benar diraih.", "Investors see overly broad market claims as a sign of weak research. TAM, SAM, and SOM show the market you can actually win."),
      },
      {
        q: _("Proyeksi klien: pendapatan naik 300% setiap tahun selama 5 tahun tanpa penjelasan. Saran terbaik?", "The client projects 300% revenue growth every year for 5 years with no explanation. Best advice?"),
        o: [
          _("Naikkan lagi agar lebih menarik", "Raise it further to impress"),
          _("Turunkan ke angka yang bisa dijelaskan dengan asumsi, misalnya jumlah pelanggan, harga, dan tingkat konversi", "Lower it to figures backed by assumptions such as customers, price, and conversion"),
          _("Hapus proyeksi keuangan", "Delete the financial projections"),
          _("Gunakan angka kompetitor", "Use a competitor's numbers"),
        ],
        a: 1,
        e: _("Proyeksi yang kuat dibangun dari asumsi yang bisa diperiksa. Angka tanpa dasar mengurangi kepercayaan pembaca.", "Strong projections are built from checkable assumptions. Numbers with no basis cost credibility."),
      },
      {
        q: _("Untuk pengajuan kredit usaha ke bank, apa yang paling diperhatikan bank?", "For a business loan application, what does a bank focus on most?"),
        o: [
          _("Visi jangka panjang yang besar", "A big long-term vision"),
          _("Kemampuan membayar cicilan, terlihat dari arus kas, riwayat usaha, dan jaminan", "Ability to repay, shown by cash flow, track record, and collateral"),
          _("Jumlah pengikut media sosial", "Social media followers"),
          _("Desain dokumen yang menarik", "Attractive document design"),
        ],
        a: 1,
        e: _("Bank menilai risiko gagal bayar. Arus kas yang cukup untuk cicilan lebih penting daripada potensi pertumbuhan besar.", "Banks assess default risk. Enough cash flow to cover repayments matters more than big growth potential."),
      },
      {
        q: _("Klien memintamu mengubah laporan keuangan tahun lalu agar terlihat lebih untung untuk pengajuan kredit. Respons yang tepat?", "A client asks you to alter last year's financials to look more profitable for a loan application. Right response?"),
        o: [
          _("Lakukan, karena bank tidak akan memeriksa", "Do it, the bank won't check"),
          _("Tolak, lalu bantu menyajikan data asli dengan jujur beserta rencana perbaikannya", "Decline, and help present the real data honestly with an improvement plan"),
          _("Ubah sedikit saja", "Change it just a little"),
          _("Minta bayaran tambahan untuk itu", "Charge extra for it"),
        ],
        a: 1,
        e: _("Memalsukan data untuk kredit adalah pelanggaran hukum. Data yang jujur ditambah rencana yang kuat lebih aman bagi semua pihak.", "Falsifying data for credit is illegal. Honest data with a strong plan is safer for everyone."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis ringkasan eksekutif", "Write an executive summary"),
        brief: _(
          "Usaha saya: laundry kiloan antar-jemput untuk mahasiswa di sekitar kampus di Yogyakarta. Sudah berjalan 1 tahun, 350 pelanggan aktif, omzet rata-rata Rp28 juta per bulan, laba bersih sekitar 22%. Saya butuh Rp150 juta untuk membuka 2 cabang baru. Tolong tulis ringkasan eksekutif untuk investor.",
          "My business: pick-up and delivery laundry by the kilo for students near campuses in Yogyakarta. Running for 1 year, 350 active customers, average revenue Rp28m a month, net margin around 22%. I need Rp150m to open 2 new branches. Please write an executive summary for investors.",
        ),
        langkah: [
          _("Tulis ringkasan maksimal 200 kata.", "Write a summary of up to 200 words."),
          _("Masukkan masalah, solusi, traksi, rencana, dan kebutuhan dana.", "Cover problem, solution, traction, plan, and funding need."),
          _("Tandai angka yang perlu dilengkapi klien dengan [ ].", "Mark figures the client must supply with [ ]."),
        ],
        rubrik: [
          _("Dibuka dengan masalah dan solusi yang jelas", "Opens with a clear problem and solution"),
          _("Menyebut traksi dengan angka (pelanggan, omzet, margin)", "States traction with numbers (customers, revenue, margin)"),
          _("Menjelaskan penggunaan dana Rp150 juta", "Explains how the Rp150m will be used"),
          _("Menyebut target hasil dari ekspansi", "States expected results of expansion"),
          _("Ringkas dan tidak berlebihan", "Concise, without hype"),
        ],
        contoh: _(
          "Mahasiswa di Yogyakarta butuh layanan cuci yang murah dan tidak menyita waktu. [Nama usaha] menyediakan laundry kiloan dengan antar-jemput terjadwal di sekitar kampus, dipesan lewat WhatsApp.\n\nDalam 1 tahun, kami melayani 350 pelanggan aktif dengan omzet rata-rata Rp28 juta per bulan dan margin laba bersih sekitar 22%. [Tingkat pelanggan berlangganan ulang: ...%]\n\nKami mencari pendanaan Rp150 juta untuk membuka 2 cabang di kawasan [nama kawasan]: Rp[...] untuk mesin dan renovasi, Rp[...] untuk modal kerja 3 bulan, dan Rp[...] untuk pemasaran pembukaan. Target: setiap cabang mencapai titik impas dalam [...] bulan dan total omzet Rp[...] per bulan pada akhir tahun kedua.\n\n[Skema yang ditawarkan: bagi hasil atau kepemilikan saham ...%]",
          "Students in Yogyakarta need affordable laundry that doesn't eat into their time. [Business name] offers laundry by the kilo with scheduled pick-up and delivery around campus, booked via WhatsApp.\n\nIn 1 year we've served 350 active customers, averaging Rp28m monthly revenue with about 22% net margin. [Repeat customer rate: ...%]\n\nWe're raising Rp150m to open 2 branches in [areas]: Rp[...] for machines and fit-out, Rp[...] for 3 months of working capital, and Rp[...] for launch marketing. Target: each branch breaks even within [...] months, with total revenue of Rp[...] per month by the end of year two.\n\n[Offer: profit sharing or ...% equity]",
        ),
      },
      {
        judul: _("Hitung titik impas", "Calculate the break-even point"),
        brief: _(
          "Saya ingin buka kedai kopi. Biaya tetap per bulan: sewa Rp6 juta, gaji Rp8 juta, listrik dan lainnya Rp2 juta. Harga rata-rata segelas kopi Rp22.000, biaya bahan per gelas Rp8.000. Berapa gelas per hari agar balik modal operasional?",
          "I want to open a coffee shop. Monthly fixed costs: rent Rp6m, wages Rp8m, utilities and others Rp2m. Average price per cup Rp22,000, ingredient cost per cup Rp8,000. How many cups a day to cover operating costs?",
        ),
        langkah: [
          _("Hitung margin kontribusi per gelas.", "Calculate the contribution margin per cup."),
          _("Hitung titik impas per bulan dan per hari (anggap buka 30 hari).", "Calculate break-even per month and per day (assume 30 open days)."),
          _("Beri satu saran praktis dari hasil hitungan.", "Give one practical tip from the result."),
        ],
        rubrik: [
          _("Margin kontribusi benar: Rp14.000 per gelas", "Contribution margin correct: Rp14,000 per cup"),
          _("Biaya tetap benar: Rp16 juta per bulan", "Fixed costs correct: Rp16m per month"),
          _("Titik impas sekitar 1.143 gelas per bulan atau 39 gelas per hari", "Break-even about 1,143 cups a month or 39 a day"),
          _("Ada saran yang relevan", "Includes a relevant tip"),
        ],
        contoh: _(
          "Margin kontribusi per gelas: Rp22.000 - Rp8.000 = Rp14.000\nBiaya tetap per bulan: Rp6 jt + Rp8 jt + Rp2 jt = Rp16.000.000\nTitik impas: Rp16.000.000 / Rp14.000 = 1.143 gelas per bulan\nPer hari (30 hari): 1.143 / 30 = 38,1, dibulatkan ke atas menjadi 39 gelas\n\nSaran: 39 gelas per hari baru menutup biaya operasional, belum termasuk balik modal peralatan dan renovasi. Cek apakah lokasi yang dipilih realistis mencapai 50 sampai 60 gelas per hari, misalnya dengan menghitung lalu lintas pejalan kaki di jam sibuk.",
          "Contribution margin per cup: Rp22,000 - Rp8,000 = Rp14,000\nMonthly fixed costs: Rp6m + Rp8m + Rp2m = Rp16,000,000\nBreak-even: Rp16,000,000 / Rp14,000 = 1,143 cups a month\nPer day (30 days): 1,143 / 30 = 38.1, rounded up to 39 cups\n\nTip: 39 cups a day only covers operating costs, not payback on equipment and fit-out. Check whether your location can realistically reach 50 to 60 cups a day, for example by counting foot traffic at peak hours.",
        ),
      },
    ],
  },

  "konsultan-pajak": {
    kuis: [
      {
        q: _("Batas waktu pelaporan SPT Tahunan PPh orang pribadi adalah...", "The deadline for individual annual income tax returns (SPT Tahunan) is..."),
        o: [
          _("31 Januari", "31 January"),
          _("31 Maret", "31 March"),
          _("30 April", "30 April"),
          _("31 Desember", "31 December"),
        ],
        a: 1,
        e: _("SPT Tahunan orang pribadi paling lambat 3 bulan setelah akhir tahun pajak, yaitu 31 Maret. Untuk badan, 30 April.", "Individual returns are due 3 months after the tax year ends, on 31 March. Corporate returns are due 30 April."),
      },
      {
        q: _("Klien adalah pelaku UMKM orang pribadi yang memakai tarif PPh final 0,5%. Omzetnya tahun ini Rp380 juta. Bagaimana PPh finalnya?", "A client is an individual small business owner on the 0.5% final income tax. Revenue this year is Rp380m. What about the final tax?"),
        o: [
          _("0,5% dari Rp380 juta", "0.5% of Rp380m"),
          _("Tidak terutang, karena omzet sampai Rp500 juta setahun tidak dikenai PPh final untuk wajib pajak orang pribadi", "None is due, since individual revenue up to Rp500m a year isn't subject to the final tax"),
          _("10% dari laba", "10% of profit"),
          _("Wajib membayar Rp500 juta", "They must pay Rp500m"),
        ],
        a: 1,
        e: _("Sejak PP 55 Tahun 2022, wajib pajak orang pribadi UMKM dengan omzet sampai Rp500 juta setahun tidak dikenai PPh final 0,5%. Tetap periksa aturan terbaru setiap tahun.", "Since Government Regulation 55/2022, individual small businesses with revenue up to Rp500m a year pay no 0.5% final tax. Always check the latest rules each year."),
      },
      {
        q: _("Karyawan dengan satu pemberi kerja menerima bukti potong dari kantornya. Apa fungsi bukti potong itu dalam SPT?", "An employee with one employer receives a withholding slip. What's its role in the tax return?"),
        o: [
          _("Tidak ada fungsinya", "No role"),
          _("Menjadi dasar mengisi penghasilan dan pajak yang sudah dipotong, sehingga perhitungan SPT biasanya nihil", "It's the basis for reporting income and tax already withheld, so the return usually shows nil due"),
          _("Hanya untuk arsip kantor", "Only for the office's records"),
          _("Sebagai bukti tidak perlu lapor SPT", "Proof that no return is needed"),
        ],
        a: 1,
        e: _("Pajak karyawan sudah dipotong pemberi kerja. Bukti potong dipakai untuk melaporkannya agar tidak terhitung dua kali.", "The employer already withheld the employee's tax. The slip is used to report it so it isn't counted twice."),
      },
      {
        q: _("Seorang klien freelance menerima bayaran dari klien luar negeri lewat PayPal. Bagaimana statusnya?", "A freelance client receives pay from overseas clients via PayPal. What's the status?"),
        o: [
          _("Tidak perlu dilaporkan karena dari luar negeri", "No need to report since it's from abroad"),
          _("Tetap merupakan penghasilan yang wajib dilaporkan di SPT Tahunan", "It's still income that must be reported on the annual return"),
          _("Hanya dilaporkan jika di atas Rp1 miliar", "Only reported if above Rp1 billion"),
          _("Dilaporkan oleh PayPal", "PayPal reports it"),
        ],
        a: 1,
        e: _("Wajib pajak dalam negeri dikenai pajak atas penghasilan dari mana pun. Penghasilan dari luar negeri tetap dilaporkan.", "Indonesian tax residents are taxed on worldwide income. Foreign income must still be reported."),
      },
      {
        q: _("Klien meminta kamu tidak melaporkan sebagian penghasilannya \"karena tidak akan ketahuan\". Respons yang tepat?", "A client asks you not to report part of their income \"since nobody will find out\". Right response?"),
        o: [
          _("Ikuti permintaannya", "Do as asked"),
          _("Tolak, jelaskan risiko sanksi, dan bantu mencari cara legal untuk mengurangi pajak, misalnya biaya yang memang boleh dikurangkan", "Decline, explain the penalties, and help find legal ways to reduce tax, such as allowable deductions"),
          _("Laporkan setengahnya", "Report half"),
          _("Minta bayaran tambahan", "Charge extra"),
        ],
        a: 1,
        e: _("Menyembunyikan penghasilan adalah penggelapan pajak. Peran pendamping pajak adalah membantu kepatuhan dan perencanaan yang legal.", "Hiding income is tax evasion. A tax assistant's role is compliance and legal planning."),
      },
    ],
    tugas: [
      {
        judul: _("Jelaskan kewajiban pajak freelancer pemula", "Explain tax duties to a new freelancer"),
        brief: _(
          "Saya baru jadi desainer freelance tahun ini. Pendapatan dari klien lokal dan luar negeri. Saya belum pernah lapor SPT sendiri karena dulu karyawan. Apa saja yang perlu saya siapkan?",
          "I became a freelance designer this year, earning from local and overseas clients. I've never filed my own return because I used to be an employee. What do I need to prepare?",
        ),
        langkah: [
          _("Tulis penjelasan singkat dalam bahasa sederhana.", "Write a short explanation in plain language."),
          _("Buat daftar dokumen dan catatan yang perlu disiapkan.", "List the documents and records to prepare."),
          _("Sebutkan tenggat dan satu kebiasaan yang membantu.", "Mention the deadline and one helpful habit."),
        ],
        rubrik: [
          _("Menyebut bahwa penghasilan dalam dan luar negeri wajib dilaporkan", "States both local and foreign income must be reported"),
          _("Menyebut kebutuhan NPWP atau NIK yang sudah dipadankan dan akun Coretax", "Mentions NPWP or a validated NIK and a Coretax account"),
          _("Daftar dokumen lengkap (bukti potong, catatan penghasilan, bukti transfer)", "Complete document list (withholding slips, income records, transfer proofs)"),
          _("Menyebut tenggat 31 Maret", "States the 31 March deadline"),
          _("Menyarankan pencatatan rutin atau konsultasi untuk kasus rumit", "Suggests regular record-keeping or advice for complex cases"),
        ],
        contoh: _(
          "Sebagai freelancer, kamu wajib melaporkan semua penghasilan, baik dari klien lokal maupun luar negeri, di SPT Tahunan paling lambat 31 Maret tahun berikutnya.\n\nYang perlu disiapkan:\n1. NPWP atau NIK yang sudah dipadankan, dan akun Coretax DJP yang aktif\n2. Bukti potong PPh dari klien lokal (jika mereka memotong pajak)\n3. Catatan penghasilan per bulan: tanggal, klien, jumlah, dan mata uang\n4. Bukti transfer atau riwayat PayPal/Wise untuk penghasilan luar negeri\n5. Daftar harta dan utang per 31 Desember\n\nKebiasaan yang membantu: catat setiap pembayaran di spreadsheet pada hari yang sama, termasuk kurs saat diterima.\n\nAturan pajak freelancer bisa berbeda tergantung jumlah penghasilan dan apakah kamu memakai norma penghitungan. Untuk perhitungan pastinya, kita cek bersama datamu.",
          "As a freelancer, you must report all income, from local and overseas clients, on your annual return by 31 March of the following year.\n\nWhat to prepare:\n1. An NPWP or validated NIK, and an active DGT Coretax account\n2. Withholding slips from local clients (if they withheld tax)\n3. A monthly income log: date, client, amount, and currency\n4. Transfer proofs or PayPal/Wise history for foreign income\n5. A list of assets and debts as of 31 December\n\nHelpful habit: record every payment in a spreadsheet the same day, including the exchange rate when received.\n\nFreelancer tax treatment varies with income level and whether you use the deemed-profit norm. We'll check your actual figures together.",
        ),
      },
      {
        judul: _("Buat checklist dokumen SPT karyawan", "Make an employee tax return checklist"),
        brief: _(
          "Kantor kami ingin membantu 40 karyawan melapor SPT tahun ini. Tolong buat checklist singkat yang bisa dibagikan ke karyawan.",
          "Our office wants to help 40 employees file their returns this year. Please make a short checklist we can share with them.",
        ),
        langkah: [
          _("Buat checklist dokumen yang perlu disiapkan.", "List the documents to prepare."),
          _("Tambahkan langkah singkat proses pelaporan.", "Add brief filing steps."),
          _("Tambahkan peringatan soal keamanan akun.", "Add a warning about account security."),
        ],
        rubrik: [
          _("Ada bukti potong dari kantor", "Includes the office withholding slip"),
          _("Ada data harta, utang, dan tanggungan", "Includes assets, debts, and dependants"),
          _("Langkah pelaporan runtut", "Filing steps are in order"),
          _("Ada peringatan agar tidak membagikan password atau kode verifikasi", "Warns not to share passwords or verification codes"),
        ],
        contoh: _(
          "Checklist SPT Tahunan Karyawan\n\nSiapkan:\n☐ NIK/NPWP dan akses akun Coretax (email dan nomor HP aktif)\n☐ Bukti potong PPh 21 dari kantor\n☐ Bukti potong dari penghasilan lain (jika ada)\n☐ Daftar harta per 31 Desember (kendaraan, tabungan, rumah) beserta nilai perolehan\n☐ Daftar utang (KPR, cicilan kendaraan) dan sisa pokoknya\n☐ Data tanggungan keluarga (status nikah dan jumlah anak)\n\nLangkah:\n1. Masuk ke Coretax DJP\n2. Pilih pembuatan SPT Tahunan PPh orang pribadi\n3. Isi data dari bukti potong\n4. Isi harta, utang, dan tanggungan\n5. Periksa hasilnya, lalu kirim dan simpan bukti penerimaan elektronik\n\nPenting: jangan bagikan password atau kode verifikasi Coretax kepada siapa pun, termasuk yang mengaku petugas pajak.",
          "Employee Annual Tax Return Checklist\n\nPrepare:\n☐ NIK/NPWP and Coretax access (active email and phone number)\n☐ PPh 21 withholding slip from the office\n☐ Withholding slips from other income (if any)\n☐ Assets as of 31 December (vehicles, savings, property) with acquisition values\n☐ Debts (mortgage, vehicle loans) and remaining principal\n☐ Dependants (marital status and number of children)\n\nSteps:\n1. Log in to DGT Coretax\n2. Choose to create an individual annual return\n3. Enter data from the withholding slip\n4. Fill in assets, debts, and dependants\n5. Review, submit, and save the electronic receipt\n\nImportant: never share your Coretax password or verification codes with anyone, including people claiming to be tax officers.",
        ),
      },
    ],
  },

  "sop-compliance": {
    kuis: [
      {
        q: _("Apa ciri SOP yang baik?", "What makes a good SOP?"),
        o: [
          _("Panjang dan penuh istilah teknis agar terlihat profesional", "Long and full of jargon to look professional"),
          _("Langkahnya berurutan, ada penanggung jawab, dan bisa diikuti orang baru tanpa bertanya", "Steps in order, with owners, and followable by a newcomer without asking"),
          _("Ditulis sekali dan tidak pernah diperbarui", "Written once and never updated"),
          _("Hanya dipahami penulisnya", "Only the author understands it"),
        ],
        a: 1,
        e: _("Ukuran SOP yang baik: orang baru bisa menjalankannya dengan benar. Penanggung jawab yang jelas mencegah tugas terlewat.", "The test of a good SOP: a newcomer can run it correctly. Clear owners stop tasks falling through the cracks."),
      },
      {
        q: _("Satu orang staf mengajukan pembelian, menyetujui, dan membayar sendiri. Prinsip pengendalian internal apa yang dilanggar?", "One staff member requests, approves, and pays for purchases alone. Which internal control principle is broken?"),
        o: [
          _("Pemisahan tugas (segregation of duties)", "Segregation of duties"),
          _("Efisiensi", "Efficiency"),
          _("Transparansi media sosial", "Social media transparency"),
          _("Tidak ada yang dilanggar", "Nothing is broken"),
        ],
        a: 0,
        e: _("Pemisahan tugas memastikan tidak ada satu orang yang menguasai seluruh proses, sehingga kesalahan dan kecurangan lebih mudah terdeteksi.", "Segregation of duties ensures no one person controls the whole process, making errors and fraud easier to catch."),
      },
      {
        q: _("Langkah paling awal saat menulis SOP proses yang belum pernah didokumentasikan?", "First step when writing an SOP for an undocumented process?"),
        o: [
          _("Langsung menulis dari bayangan sendiri", "Write from your own assumptions"),
          _("Mewawancarai dan mengamati orang yang menjalankan proses itu sehari-hari", "Interview and observe the people who run the process daily"),
          _("Menyalin SOP perusahaan lain", "Copy another company's SOP"),
          _("Meminta direktur menulisnya", "Ask the director to write it"),
        ],
        a: 1,
        e: _("Proses nyata sering berbeda dari yang dibayangkan manajemen. Pengamatan langsung membuat SOP sesuai kenyataan.", "Real processes often differ from what management imagines. Observing directly keeps the SOP grounded."),
      },
      {
        q: _("Bagaimana memastikan SOP tetap relevan?", "How do you keep an SOP relevant?"),
        o: [
          _("Mencetaknya dan menempel di dinding", "Print it and stick it on the wall"),
          _("Mencantumkan pemilik dokumen, nomor versi, dan jadwal tinjauan berkala", "Name a document owner, version number, and regular review schedule"),
          _("Mengirimnya sekali lewat email", "Email it once"),
          _("Membuatnya sangat panjang", "Make it very long"),
        ],
        a: 1,
        e: _("Pemilik dokumen dan jadwal tinjauan memastikan SOP diperbarui saat proses atau sistem berubah.", "A document owner and review schedule ensure the SOP is updated when processes or systems change."),
      },
      {
        q: _("Menjelang audit, klien memintamu membuat notulen rapat dan tanda tangan persetujuan untuk rapat yang tidak pernah terjadi. Respons yang tepat?", "Before an audit, a client asks you to create minutes and approval signatures for meetings that never happened. Right response?"),
        o: [
          _("Buat saja agar audit lancar", "Make them so the audit goes smoothly"),
          _("Tolak membuat dokumen fiktif, lalu bantu menyusun rencana perbaikan untuk temuan yang ada", "Refuse to create fake documents, and help draft a remediation plan for the findings"),
          _("Buat dengan tanggal yang berbeda", "Make them with different dates"),
          _("Minta auditor tidak memeriksa", "Ask auditors not to check"),
        ],
        a: 1,
        e: _("Dokumen fiktif adalah pemalsuan dan bisa berakibat hukum. Rencana perbaikan yang jujur jauh lebih aman dan biasanya diterima auditor.", "Fake documents are forgery with legal consequences. An honest remediation plan is far safer and usually accepted by auditors."),
      },
    ],
    tugas: [
      {
        judul: _("Tulis SOP pengajuan penggantian biaya", "Write an expense reimbursement SOP"),
        brief: _(
          "Karyawan kami sering mengajukan reimburse biaya perjalanan dengan cara berbeda-beda, dan ada yang dobel klaim. Tolong buatkan SOP singkat untuk proses reimburse.",
          "Our staff submit travel expense claims in all sorts of ways, and some claim twice. Please write a short SOP for reimbursements.",
        ),
        langkah: [
          _("Tulis tujuan, ruang lingkup, dan penanggung jawab.", "Write the purpose, scope, and owners."),
          _("Tulis langkah-langkah bernomor dari pengajuan sampai pembayaran.", "Write numbered steps from claim to payment."),
          _("Tambahkan kontrol untuk mencegah klaim ganda.", "Add controls to prevent double claims."),
        ],
        rubrik: [
          _("Ada tujuan, ruang lingkup, dan penanggung jawab", "Includes purpose, scope, and owners"),
          _("Langkah berurutan dengan batas waktu", "Ordered steps with time limits"),
          _("Ada pemisahan tugas antara pengaju, penyetuju, dan pembayar", "Separates claimant, approver, and payer"),
          _("Ada kontrol klaim ganda (nomor nota unik, stempel atau tanda \"sudah dibayar\")", "Has double-claim controls (unique receipt numbers, a \"paid\" mark)"),
          _("Bahasa jelas dan bisa diikuti karyawan baru", "Clear language a new hire can follow"),
        ],
        contoh: _(
          "SOP Reimburse Biaya Perjalanan (versi 1.0)\nTujuan: memastikan penggantian biaya tepat, cepat, dan tanpa klaim ganda.\nRuang lingkup: biaya transportasi, akomodasi, dan makan saat dinas.\nPemilik dokumen: Manajer Keuangan. Ditinjau setiap 12 bulan.\n\nLangkah:\n1. Karyawan mengisi formulir reimburse paling lambat 7 hari kerja setelah perjalanan, melampirkan nota asli atau digital.\n2. Atasan langsung memeriksa kesesuaian dengan surat tugas dan menyetujui dalam 2 hari kerja.\n3. Staf keuangan memverifikasi nota, mencatat nomor nota di register reimburse, dan menolak nota yang sudah tercatat.\n4. Manajer keuangan menyetujui pembayaran.\n5. Pembayaran ditransfer paling lambat 5 hari kerja setelah persetujuan. Nota diberi tanda \"DIBAYAR\" dan tanggal.\n\nKontrol: pengaju, penyetuju, dan pembayar harus orang yang berbeda. Register nota dicek setiap kali ada pengajuan baru.",
          "Travel Expense Reimbursement SOP (version 1.0)\nPurpose: accurate, timely reimbursement with no double claims.\nScope: transport, accommodation, and meals on business trips.\nDocument owner: Finance Manager. Reviewed every 12 months.\n\nSteps:\n1. The employee submits a claim form within 7 working days of the trip, with original or digital receipts.\n2. The line manager checks it against the travel assignment and approves within 2 working days.\n3. Finance verifies receipts, logs each receipt number in the claims register, and rejects receipts already logged.\n4. The finance manager approves payment.\n5. Payment is transferred within 5 working days of approval. Receipts are marked \"PAID\" with the date.\n\nControls: claimant, approver, and payer must be different people. The receipt register is checked for every new claim.",
        ),
      },
      {
        judul: _("Ubah proses menjadi checklist kepatuhan", "Turn a process into a compliance checklist"),
        brief: _(
          "Kami toko online yang menyimpan data pelanggan (nama, alamat, nomor HP). Kami ingin checklist sederhana untuk menjaga keamanan data pelanggan, karena ada UU Pelindungan Data Pribadi.",
          "We're an online shop storing customer data (names, addresses, phone numbers). We want a simple checklist to keep it secure, given Indonesia's Personal Data Protection Law.",
        ),
        langkah: [
          _("Buat 6 sampai 8 poin checklist yang bisa dicek ya atau tidak.", "Write 6 to 8 yes/no checklist items."),
          _("Kelompokkan poin berdasarkan topik (akses, penyimpanan, insiden).", "Group items by topic (access, storage, incidents)."),
          _("Tambahkan catatan bahwa checklist ini bukan pengganti nasihat hukum.", "Add a note that it's not a substitute for legal advice."),
        ],
        rubrik: [
          _("Poin bisa dijawab ya atau tidak dengan jelas", "Items are clearly yes/no"),
          _("Mencakup pembatasan akses dan password yang kuat", "Covers access limits and strong passwords"),
          _("Mencakup penyimpanan dan penghapusan data", "Covers data storage and deletion"),
          _("Mencakup langkah jika terjadi kebocoran data", "Covers what to do in a data breach"),
          _("Ada catatan batasan (bukan nasihat hukum)", "Includes a not-legal-advice note"),
        ],
        contoh: _(
          "Checklist Keamanan Data Pelanggan\n\nAkses\n☐ Hanya staf yang membutuhkan yang bisa melihat data pelanggan\n☐ Setiap akun admin memakai password kuat dan verifikasi dua langkah\n☐ Akses staf yang keluar dicabut di hari terakhirnya\n\nPenyimpanan\n☐ Data tidak disimpan di grup chat atau flashdisk pribadi\n☐ Hanya data yang perlu yang dikumpulkan (tidak meminta foto KTP tanpa alasan)\n☐ Ada aturan berapa lama data disimpan dan kapan dihapus\n\nInsiden\n☐ Ada penanggung jawab jika terjadi kebocoran data\n☐ Ada langkah tertulis untuk memberi tahu pelanggan yang terdampak\n\nCatatan: checklist ini adalah langkah awal dan bukan nasihat hukum. Untuk kepatuhan penuh terhadap UU PDP, konsultasikan dengan ahli hukum.",
          "Customer Data Security Checklist\n\nAccess\n☐ Only staff who need it can see customer data\n☐ Every admin account uses a strong password and two-step verification\n☐ Departing staff lose access on their last day\n\nStorage\n☐ Data isn't kept in chat groups or personal USB drives\n☐ Only necessary data is collected (no ID photos without a reason)\n☐ There's a rule for how long data is kept and when it's deleted\n\nIncidents\n☐ Someone is responsible if a breach happens\n☐ There are written steps for notifying affected customers\n\nNote: this checklist is a starting point, not legal advice. For full compliance with the PDP Law, consult a legal professional.",
        ),
      },
    ],
  },

  "analis-keuangan": {
    kuis: [
      {
        q: _("Perusahaan A punya laba bersih Rp10 miliar dengan ekuitas Rp50 miliar. Berapa ROE-nya?", "Company A has net profit of Rp10bn and equity of Rp50bn. What's its ROE?"),
        o: [
          _("5%", "5%"),
          _("20%", "20%"),
          _("50%", "50%"),
          _("500%", "500%"),
        ],
        a: 1,
        e: _("ROE = laba bersih / ekuitas = 10 / 50 = 20%. ROE menunjukkan seberapa efisien modal pemegang saham menghasilkan laba.", "ROE = net profit / equity = 10 / 50 = 20%. It shows how efficiently shareholders' capital generates profit."),
      },
      {
        q: _("Laba bersih perusahaan naik, tetapi arus kas operasional negatif dua tahun berturut-turut. Apa yang perlu diselidiki?", "Net profit is rising but operating cash flow has been negative two years running. What should you investigate?"),
        o: [
          _("Tidak ada, laba naik itu bagus", "Nothing, rising profit is good"),
          _("Kualitas laba: piutang yang menumpuk, persediaan yang naik, atau pengakuan pendapatan yang agresif", "Earnings quality: growing receivables, rising inventory, or aggressive revenue recognition"),
          _("Jumlah karyawan", "Headcount"),
          _("Logo perusahaan", "The company logo"),
        ],
        a: 1,
        e: _("Laba yang tidak diikuti kas bisa menandakan masalah penagihan atau pencatatan. Ini salah satu tanda bahaya klasik dalam analisis.", "Profit without cash can signal collection or accounting problems. It's a classic red flag in analysis."),
      },
      {
        q: _("Dalam model keuangan yang rapi, di mana sebaiknya asumsi (pertumbuhan, harga, biaya) diletakkan?", "In a clean financial model, where should assumptions (growth, price, costs) go?"),
        o: [
          _("Diketik langsung di dalam rumus", "Typed directly into formulas"),
          _("Di bagian atau sheet asumsi tersendiri yang dirujuk oleh rumus", "In a separate assumptions section or sheet that formulas reference"),
          _("Di catatan kaki presentasi", "In presentation footnotes"),
          _("Tidak perlu ditulis", "No need to write them down"),
        ],
        a: 1,
        e: _("Asumsi yang terpisah memudahkan orang lain memeriksa dan mengubah skenario tanpa membongkar rumus.", "Separate assumptions let others check and change scenarios without digging into formulas."),
      },
      {
        q: _("Mana yang paling menggambarkan kemampuan perusahaan membayar utang jangka pendek?", "Which best shows a company's ability to pay short-term debts?"),
        o: [
          _("Current ratio (aset lancar / liabilitas lancar)", "Current ratio (current assets / current liabilities)"),
          _("Price to earnings ratio", "Price to earnings ratio"),
          _("Jumlah cabang", "Number of branches"),
          _("Pertumbuhan pendapatan", "Revenue growth"),
        ],
        a: 0,
        e: _("Current ratio membandingkan aset yang bisa dicairkan dalam setahun dengan kewajiban yang jatuh tempo dalam setahun.", "The current ratio compares assets convertible within a year to obligations due within a year."),
      },
      {
        q: _("Klien memintamu menulis analisis saham dengan klaim \"dijamin naik 50% bulan depan\" untuk dijual ke grup Telegram berbayar. Respons yang tepat?", "A client wants a stock write-up claiming \"guaranteed 50% gain next month\" to sell in a paid Telegram group. Right response?"),
        o: [
          _("Tulis, karena bayarannya bagus", "Write it, the pay is good"),
          _("Tolak klaim jaminan keuntungan; analisis harus menyajikan data, asumsi, dan risiko secara seimbang", "Refuse guaranteed-return claims; analysis must present data, assumptions, and risks fairly"),
          _("Tulis tanpa nama penulis", "Write it anonymously"),
          _("Ubah menjadi \"dijamin naik 30%\"", "Change it to \"guaranteed 30%\""),
        ],
        a: 1,
        e: _("Janji keuntungan pasti adalah ciri penipuan investasi. Menjual rekomendasi ke publik juga diatur OJK.", "Guaranteed returns are a hallmark of investment scams. Selling recommendations to the public is also regulated by OJK."),
      },
    ],
    tugas: [
      {
        judul: _("Bandingkan dua perusahaan", "Compare two companies"),
        brief: _(
          "Data tahun lalu (miliar rupiah):\nPerusahaan X: pendapatan 800, laba bersih 40, aset lancar 300, liabilitas lancar 150, utang total 200, ekuitas 400\nPerusahaan Y: pendapatan 600, laba bersih 60, aset lancar 180, liabilitas lancar 200, utang total 500, ekuitas 250\nTolong bandingkan kesehatan keuangannya untuk tim investasi.",
          "Last year's data (billion rupiah):\nCompany X: revenue 800, net profit 40, current assets 300, current liabilities 150, total debt 200, equity 400\nCompany Y: revenue 600, net profit 60, current assets 180, current liabilities 200, total debt 500, equity 250\nPlease compare their financial health for the investment team.",
        ),
        langkah: [
          _("Hitung net margin, ROE, current ratio, dan debt to equity untuk keduanya.", "Calculate net margin, ROE, current ratio, and debt to equity for both."),
          _("Tulis 3 kesimpulan utama.", "Write 3 key conclusions."),
          _("Sebutkan data tambahan yang perlu dicek.", "Name additional data to check."),
        ],
        rubrik: [
          _("Rasio dihitung benar (X: margin 5%, ROE 10%, CR 2,0, DER 0,5; Y: margin 10%, ROE 24%, CR 0,9, DER 2,0)", "Ratios correct (X: margin 5%, ROE 10%, CR 2.0, D/E 0.5; Y: margin 10%, ROE 24%, CR 0.9, D/E 2.0)"),
          _("Menyebut Y lebih menguntungkan tetapi berisiko lebih tinggi", "Notes Y is more profitable but riskier"),
          _("Menyebut current ratio Y di bawah 1 sebagai risiko likuiditas", "Flags Y's current ratio below 1 as a liquidity risk"),
          _("Ada usulan data tambahan yang relevan", "Suggests relevant extra data"),
        ],
        contoh: _(
          "Rasio:\n• Net margin: X 5%, Y 10%\n• ROE: X 10%, Y 24%\n• Current ratio: X 2,0, Y 0,9\n• Debt to equity: X 0,5, Y 2,0\n\nKesimpulan:\n1. Y jauh lebih menguntungkan (margin dan ROE dua kali lipat X), tetapi sebagian ROE yang tinggi didorong utang.\n2. Y berisiko likuiditas: liabilitas lancar lebih besar dari aset lancar, sehingga perlu pendanaan tambahan untuk membayar kewajiban jangka pendek.\n3. X lebih konservatif dan stabil, cocok untuk profil risiko rendah, tetapi pertumbuhan labanya perlu dicek.\n\nData tambahan: arus kas operasional 3 tahun, jadwal jatuh tempo utang Y, dan tren margin beberapa tahun.",
          "Ratios:\n• Net margin: X 5%, Y 10%\n• ROE: X 10%, Y 24%\n• Current ratio: X 2.0, Y 0.9\n• Debt to equity: X 0.5, Y 2.0\n\nConclusions:\n1. Y is far more profitable (double X's margin and ROE), but part of that high ROE is driven by debt.\n2. Y has liquidity risk: current liabilities exceed current assets, so it needs extra funding to meet short-term obligations.\n3. X is more conservative and stable, suited to low risk appetite, but its profit growth needs checking.\n\nExtra data: 3 years of operating cash flow, Y's debt maturity schedule, and multi-year margin trends.",
        ),
      },
      {
        judul: _("Bangun proyeksi pendapatan sederhana", "Build a simple revenue projection"),
        brief: _(
          "Aplikasi langganan kami punya 2.000 pelanggan berbayar dengan harga Rp50.000 per bulan. Setiap bulan ada sekitar 300 pelanggan baru, dan 5% pelanggan berhenti. Tolong proyeksikan pelanggan dan pendapatan 3 bulan ke depan.",
          "Our subscription app has 2,000 paying customers at Rp50,000 a month. Each month about 300 new customers join and 5% churn. Please project customers and revenue for the next 3 months.",
        ),
        langkah: [
          _("Tulis asumsi yang dipakai secara terpisah.", "List the assumptions separately."),
          _("Hitung pelanggan akhir dan pendapatan setiap bulan.", "Calculate end-of-month customers and revenue each month."),
          _("Tulis satu catatan risiko dari proyeksi ini.", "Write one risk note about the projection."),
        ],
        rubrik: [
          _("Asumsi ditulis terpisah dan jelas", "Assumptions listed clearly and separately"),
          _("Churn dihitung dari pelanggan awal bulan", "Churn calculated on opening customers"),
          _("Angka bulan 1 benar: 2.000 - 100 + 300 = 2.200", "Month 1 correct: 2,000 - 100 + 300 = 2,200"),
          _("Pendapatan dihitung konsisten dari jumlah pelanggan", "Revenue calculated consistently from customers"),
          _("Ada catatan risiko yang masuk akal", "Includes a sensible risk note"),
        ],
        contoh: _(
          "Asumsi: harga Rp50.000/bulan, pelanggan baru 300/bulan, churn 5% dari pelanggan awal bulan, pendapatan dihitung dari pelanggan akhir bulan.\n\nBulan 1: 2.000 - 100 + 300 = 2.200 pelanggan → Rp110.000.000\nBulan 2: 2.200 - 110 + 300 = 2.390 pelanggan → Rp119.500.000\nBulan 3: 2.390 - 120 + 300 = 2.570 pelanggan → Rp128.500.000\n(churn bulan 3 dibulatkan dari 119,5)\n\nRisiko: proyeksi sangat sensitif terhadap churn. Jika churn naik menjadi 8%, pertumbuhan melambat cukup jauh. Sebaiknya sajikan juga skenario pesimis.",
          "Assumptions: price Rp50,000/month, 300 new customers/month, 5% churn on opening customers, revenue based on closing customers.\n\nMonth 1: 2,000 - 100 + 300 = 2,200 customers → Rp110,000,000\nMonth 2: 2,200 - 110 + 300 = 2,390 customers → Rp119,500,000\nMonth 3: 2,390 - 120 + 300 = 2,570 customers → Rp128,500,000\n(month 3 churn rounded from 119.5)\n\nRisk: the projection is very sensitive to churn. If churn rises to 8%, growth slows considerably. Present a pessimistic scenario too.",
        ),
      },
    ],
  },
};
