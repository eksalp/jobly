import { t as _ } from "../../../i18n.js";

/** Detail kerja nyata, kategori Desain & Kreatif. */
export default {
  "desainer-grafis": {
    tugas: [
      {
        dari: { nama: "Bu Wati", peran: _("Pemilik toko roti rumahan, Yogyakarta", "Home bakery owner, Yogyakarta") },
        kanal: "WhatsApp",
        tenggat: _("Kamis", "Thursday"),
        revisi: {
          pesan: _("Konsepnya cantik! Tapi logo kami sudah ada dan warnanya merah bata #B5462F. Bisa paletnya disesuaikan supaya cocok dengan logo?", "Lovely concept! But we already have a logo in brick red #B5462F. Can the palette be adjusted to match?"),
          petunjuk: [
            _("Jadikan warna logo sebagai warna utama atau aksen", "Use the logo colour as primary or accent"),
            _("Sesuaikan warna lain agar tetap hangat dan kontras cukup untuk teks", "Adjust other colours to stay warm with enough text contrast"),
            _("Jelaskan perubahan di setiap template", "Explain changes in each template"),
          ],
        },
      },
      {
        dari: { nama: "Mas Bayu", peran: _("Pemilik toko elektronik", "Electronics shop owner") },
        kanal: "WhatsApp",
        tenggat: _("Besok", "Tomorrow"),
        revisi: {
          pesan: _("Saya pilih arah A yang lebih berani. Referensinya saya kirim, poster promo toko HP sebelah yang kuning-hitam itu. Tapi jangan sama persis ya.", "I'll go with direction A, the bolder one. Here's my reference: the yellow-and-black promo poster from the phone shop next door. But don't copy it exactly."),
          petunjuk: [
            _("Tangkap kesan yang disukai (kontras, berani) tanpa meniru tata letak dan elemen", "Capture the liked feel (contrast, boldness) without copying layout or elements"),
            _("Tulis konsep revisi: warna, ukuran teks diskon, dan foto", "Describe the revision: colours, discount text size, and photo"),
            _("Jika sudah membuat desainnya, tempel tautannya", "If you've made the design, paste the link"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Seminggu memegang 4 klien desain", "A week juggling 4 design clients"),
      konteks: _("Kamu desainer lepas dengan 4 klien bulanan: kafe, toko baju, klinik, dan sekolah musik.", "You freelance for 4 monthly clients: a café, a clothing shop, a clinic, and a music school."),
      langkah: [
        {
          waktu: _("Senin 09.00", "Monday 9:00"),
          dari: { nama: _("Klinik", "Clinic") },
          kanal: "WhatsApp",
          pesan: _("Tolong buat poster promo, pakai foto dokter yang ini saja ya (foto dari Google).", "Please make a promo poster using this doctor photo (from Google)."),
          pilihan: [
            { teks: _("Pakai foto itu", "Use that photo"), skor: 0, umpan: _("Foto dari Google bisa milik orang lain dan berisiko hak cipta.", "Google photos may belong to others and risk copyright.") },
            { teks: _("Minta foto asli dokter klinik, atau usulkan foto stok berlisensi", "Ask for the clinic's own doctor photo, or suggest licensed stock"), skor: 2, umpan: _("Kamu melindungi klien dari masalah hak cipta.", "You protect the client from copyright issues.") },
            { teks: _("Pakai foto itu dengan filter", "Use it with a filter"), skor: 0, umpan: _("Filter tidak menghapus hak cipta.", "Filters don't remove copyright.") },
          ],
        },
        {
          waktu: _("Selasa 14.00", "Tuesday 2:00"),
          dari: { nama: _("Toko baju", "Clothing shop") },
          kanal: "WhatsApp",
          pesan: _("Revisi ke-5 ya, kali ini warnanya jadi hijau lagi seperti versi pertama.", "Revision 5: change the colours back to green like version 1."),
          pilihan: [
            { teks: _("Kerjakan tanpa komentar", "Do it silently"), skor: 1, umpan: _("Klien senang, tetapi pola revisi tanpa batas berlanjut.", "Client's happy, but endless revisions continue.") },
            { teks: _("Kerjakan kali ini, lalu sampaikan bahwa paket berisi 2 revisi dan tawarkan sesi singkat untuk menyepakati arah sebelum desain berikutnya", "Do it this time, then note the package has 2 revisions and offer a quick call to agree direction before the next design"), skor: 2, umpan: _("Tetap membantu sambil memperbaiki proses kerja.", "Helpful while fixing the process.") },
            { teks: _("Tolak dengan kesal", "Refuse irritably"), skor: 0, umpan: _("Merusak hubungan dengan klien bulanan.", "Damages a monthly client relationship.") },
          ],
        },
        {
          waktu: _("Rabu 10.00", "Wednesday 10:00"),
          dari: { nama: _("Kafe dan sekolah musik", "Café and music school") },
          kanal: "WhatsApp",
          pesan: _("Kafe: \"Poster event Jumat, perlu hari ini!\" Sekolah musik: \"Banner pendaftaran, kalau bisa hari ini juga.\"", "Café: \"Friday event poster, need it today!\" Music school: \"Enrolment banner, today if possible.\""),
          pilihan: [
            { teks: _("Kerjakan dua-duanya setengah-setengah", "Do both halfway"), skor: 0, umpan: _("Dua pekerjaan setengah jadi tidak membantu siapa pun.", "Two half-finished jobs help nobody.") },
            { teks: _("Tanyakan tenggat sebenarnya. Poster event Jumat dikerjakan dulu, banner dikirim besok pagi, lalu kabari keduanya", "Check real deadlines. Do the Friday event poster first, send the banner tomorrow morning, and tell both"), skor: 2, umpan: _("Prioritas berdasarkan tenggat nyata dan komunikasi yang jelas.", "Prioritising by real deadlines with clear communication.") },
            { teks: _("Kerjakan yang pertama mengirim pesan", "Do whichever messaged first"), skor: 1, umpan: _("Belum tentu yang paling mendesak.", "Not necessarily the most urgent.") },
          ],
        },
        {
          waktu: _("Jumat 16.00", "Friday 4:00"),
          dari: { nama: _("Sekolah musik", "Music school") },
          kanal: "Email",
          pesan: _("Banner sudah dicetak, tapi warnanya jauh lebih gelap daripada di layar!", "The banner's printed, but colours are much darker than on screen!"),
          pilihan: [
            { teks: _("\"Itu masalah percetakan.\"", "\"That's the printer's problem.\""), skor: 0, umpan: _("Menyalahkan tanpa mengecek file sendiri.", "Blaming without checking your file.") },
            { teks: _("Cek apakah file dikirim dalam CMYK dan sesuai spesifikasi percetakan, lalu tawarkan solusi dan catat untuk ke depan", "Check whether the file was CMYK and matched the printer's spec, then offer a fix and note it for next time"), skor: 2, umpan: _("Kamu mencari penyebab dan bertanggung jawab.", "You investigate and take responsibility.") },
            { teks: _("Minta maaf tanpa mengecek apa pun", "Apologise without checking"), skor: 1, umpan: _("Sopan, tetapi penyebabnya tetap tidak diketahui.", "Polite, but the cause stays unknown.") },
          ],
        },
      ],
    },
  },

  "video-editor": {
    tugas: [
      {
        dari: { nama: "Pak Slamet", peran: _("Pemilik kedai mi ayam", "Chicken noodle stall owner") },
        kanal: "WhatsApp",
        tenggat: _("Sabtu, untuk diunggah Minggu", "Saturday, for Sunday posting"),
        revisi: {
          pesan: _("Bagus! Tapi saya mau tampilkan juga menu baru mi ayam pedas level 1 sampai 5, dan harga Rp18.000. Durasi tetap 30 detik ya.", "Great! But I want to show the new spicy noodles levels 1 to 5, priced at Rp18,000. Keep it 30 seconds."),
          petunjuk: [
            _("Masukkan menu baru tanpa menambah durasi", "Fit the new menu without extending the length"),
            _("Tentukan bagian yang dipangkas", "Decide what to trim"),
            _("Tambahkan teks harga yang mudah dibaca", "Add easy-to-read price text"),
          ],
        },
      },
      {
        dari: { nama: "Mbak Dita", peran: _("Produser podcast karier", "Career podcast producer") },
        kanal: "Slack",
        tenggat: _("Jumat", "Friday"),
        revisi: {
          pesan: _("Ide kliplnya bagus. Tapi narasumber minta klip nomor 5 (kandidat yang ditolak) tidak dipakai karena bisa dikenali. Bisa ganti dengan klip lain?", "Good clip ideas. But the guest asked us not to use clip 5 (the rejected candidate) since they could be identified. Can you replace it?"),
          petunjuk: [
            _("Hapus klip yang berisiko mengungkap identitas", "Drop the clip that risks identifying someone"),
            _("Usulkan pengganti dengan kriteria yang sama", "Propose a replacement meeting the same criteria"),
            _("Tulis hook untuk klip pengganti", "Write a hook for the replacement"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Editor tetap untuk kreator kuliner", "Retained editor for a food creator"),
      konteks: _("Kamu mengedit 4 video pendek per minggu untuk kreator kuliner dengan 200 ribu pengikut.", "You edit 4 short videos a week for a food creator with 200k followers."),
      langkah: [
        {
          waktu: _("Senin", "Monday"),
          dari: { nama: _("Kreator", "Creator") },
          kanal: "WhatsApp",
          pesan: _("Footage minggu ini sudah di Drive. Totalnya 40 GB.", "This week's footage is on Drive. 40 GB total."),
          pilihan: [
            { teks: _("Unduh semua lalu mulai mengedit langsung dari file asli", "Download everything and edit the originals directly"), skor: 1, umpan: _("Bisa, tetapi laptop bisa lambat dengan file 4K.", "Possible, but laptops can lag with 4K files.") },
            { teks: _("Unduh, rapikan folder per video, buat proxy, lalu tandai klip terbaik", "Download, organise folders per video, make proxies, then mark the best clips"), skor: 2, umpan: _("Persiapan yang rapi mempercepat seluruh minggu.", "Tidy prep speeds up the whole week.") },
            { teks: _("Minta kreator memilihkan klip", "Ask the creator to pick clips"), skor: 0, umpan: _("Memilih klip adalah bagian dari pekerjaan editor.", "Selecting clips is the editor's job.") },
          ],
        },
        {
          waktu: _("Rabu", "Wednesday"),
          dari: { nama: _("Kreator", "Creator") },
          kanal: "WhatsApp",
          pesan: _("Pakai lagu yang lagi viral di TikTok ya buat video sponsor minggu ini.", "Use the viral TikTok song for this week's sponsored video."),
          pilihan: [
            { teks: _("Pakai saja", "Just use it"), skor: 0, umpan: _("Konten bersponsor termasuk komersial; lagu populer bisa membuat video dibisukan atau bermasalah dengan sponsor.", "Sponsored content is commercial; popular songs can get muted or cause sponsor issues.") },
            { teks: _("Jelaskan risikonya dan usulkan musik berlisensi komersial dengan nuansa serupa", "Explain the risk and suggest commercially licensed music with a similar vibe"), skor: 2, umpan: _("Melindungi kreator dan sponsornya.", "Protects the creator and sponsor.") },
            { teks: _("Pakai lagu itu tapi dipercepat", "Use the song sped up"), skor: 0, umpan: _("Mengubah kecepatan tidak menghapus hak cipta.", "Speeding it up doesn't remove copyright.") },
          ],
        },
        {
          waktu: _("Kamis", "Thursday"),
          dari: { nama: _("Kreator", "Creator") },
          kanal: "WhatsApp",
          pesan: _("Video kemarin retensinya turun di detik 8. Ada ide?", "Yesterday's video drops at second 8. Ideas?"),
          pilihan: [
            { teks: _("Cek isi detik 6 sampai 10: biasanya ada bagian lambat atau penjelasan panjang, lalu usulkan potongan yang lebih cepat atau teks layar", "Check seconds 6 to 10: usually a slow part or long explanation, then suggest tighter cuts or on-screen text"), skor: 2, umpan: _("Analisis spesifik yang langsung bisa dicoba.", "Specific analysis to try right away.") },
            { teks: _("\"Mungkin algoritma.\"", "\"Maybe the algorithm.\""), skor: 0, umpan: _("Tidak melihat data yang sudah ada.", "Ignores the data you have.") },
            { teks: _("Tambah efek transisi di detik 8", "Add a transition at second 8"), skor: 1, umpan: _("Bisa membantu, tetapi cari penyebabnya dulu.", "Might help, but find the cause first.") },
          ],
        },
        {
          waktu: _("Jumat", "Friday"),
          dari: { nama: _("Kreator", "Creator") },
          kanal: "WhatsApp",
          pesan: _("Bulan depan saya mau 6 video per minggu. Bisa?", "Next month I want 6 videos a week. Can you?"),
          pilihan: [
            { teks: _("Terima tanpa membahas tarif dan waktu", "Accept without discussing pay or time"), skor: 1, umpan: _("Beban kerja naik 50%, tarif dan jadwal perlu disesuaikan.", "Workload rises 50%; pay and schedule should adjust.") },
            { teks: _("\"Bisa, dengan tarif per video yang sama, total menjadi Rp... per minggu. Footage paling lambat Senin agar semua tepat waktu.\"", "\"Yes, at the same per-video rate the weekly total is Rp... Footage by Monday so everything's on time.\""), skor: 2, umpan: _("Jelas soal harga dan syarat agar kualitas terjaga.", "Clear on price and conditions to protect quality.") },
            { teks: _("Terima dan pakai template yang sama untuk semua", "Accept and use one template for all"), skor: 0, umpan: _("Video yang mirip semua bisa menurunkan performa.", "Look-alike videos can hurt performance.") },
          ],
        },
      ],
    },
  },

  "desain-logo-branding": {
    tugas: [
      {
        dari: { nama: "Bu Rida", peran: _("Pemilik bengkel Rida Motor, Bekasi", "Owner, Rida Motor workshop, Bekasi") },
        kanal: "WhatsApp",
        tenggat: _("Sebelum presentasi konsep Senin", "Before Monday's concept presentation"),
        revisi: {
          pesan: _("Brief-nya pas! Satu tambahan: saya mau logonya juga bisa dibordir di seragam dan dicetak di stiker helm kecil. Apakah konsepnya perlu disesuaikan?", "Spot-on brief! One addition: the logo must also work embroidered on uniforms and printed on small helmet stickers. Do the concepts need adjusting?"),
          petunjuk: [
            _("Tambahkan kebutuhan teknis (bordir, ukuran kecil) ke brief", "Add technical needs (embroidery, small sizes) to the brief"),
            _("Jelaskan dampaknya pada detail dan jumlah warna", "Explain the impact on detail and colour count"),
            _("Sesuaikan arah konsep yang terlalu detail", "Adjust overly detailed concept directions"),
          ],
        },
      },
      {
        dari: { nama: "Bu Rida", peran: _("Pemilik bengkel", "Workshop owner") },
        kanal: "WhatsApp",
        tenggat: _("Jumat", "Friday"),
        revisi: {
          pesan: _("Saya suka! Tapi suami saya bilang perisainya mirip logo klub sepak bola. Bisa dibuat lebih berbeda?", "I love it! But my husband says the shield looks like a football club crest. Can it be more distinctive?"),
          petunjuk: [
            _("Tanggapi kekhawatiran dengan serius tanpa defensif", "Take the concern seriously, not defensively"),
            _("Usulkan cara membuat bentuk lebih khas (misalnya memadukan bentuk roda atau kunci pas)", "Suggest ways to make the shape distinctive (e.g. blending a wheel or spanner)"),
            _("Tulis balasan singkat beserta rencana revisi", "Write a short reply with the revision plan"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Proyek identitas brand untuk kedai kopi", "A brand identity project for a coffee shop"),
      konteks: _("Kamu mengerjakan logo dan identitas untuk kedai kopi baru. Paket: 3 konsep, 2 revisi, file lengkap, dan panduan.", "You're designing a logo and identity for a new coffee shop. Package: 3 concepts, 2 revisions, full files, and a guide."),
      langkah: [
        {
          waktu: _("Minggu 1", "Week 1"),
          dari: { nama: "Mas Fadil", peran: _("Pemilik kedai", "Owner") },
          kanal: "WhatsApp",
          pesan: _("Saya mau logonya mirip logo kopi terkenal dari Amerika itu, cuma ganti nama.", "I want it like that famous American coffee logo, just a different name."),
          pilihan: [
            { teks: _("Buat mirip sesuai permintaan", "Make it look similar"), skor: 0, umpan: _("Berisiko pelanggaran merek dan ditolak saat pendaftaran merek.", "Risks trademark infringement and registration refusal.") },
            { teks: _("Tanyakan apa yang ia sukai dari logo itu (kesan premium, bentuk melingkar) dan terjemahkan ke konsep orisinal", "Ask what he likes about it (premium feel, circular badge) and translate that into original concepts"), skor: 2, umpan: _("Kamu menangkap kebutuhan tanpa meniru.", "You capture the need without copying.") },
            { teks: _("Tolak proyeknya", "Decline the project"), skor: 1, umpan: _("Masih ada cara membantu dengan benar.", "There's still a right way to help.") },
          ],
        },
        {
          waktu: _("Minggu 2", "Week 2"),
          dari: { nama: "Mas Fadil", peran: _("Pemilik kedai", "Owner") },
          kanal: "WhatsApp",
          pesan: _("Dari 3 konsep, bisa gabungkan huruf dari konsep 1, ikon dari konsep 2, dan warna dari konsep 3?", "Can you combine the type from concept 1, icon from 2, and colours from 3?"),
          pilihan: [
            { teks: _("Gabungkan tanpa komentar", "Combine without comment"), skor: 1, umpan: _("Bisa berhasil, tetapi sering menghasilkan desain yang tidak padu.", "Might work, but often looks incoherent.") },
            { teks: _("Buat versi gabungan, sertakan pendapat profesional soal kesatuannya, dan tunjukkan perbandingan dengan konsep asli", "Make the combined version, add your professional view on cohesion, and show it beside the originals"), skor: 2, umpan: _("Klien bisa memutuskan dengan informasi lengkap.", "The client decides with full information.") },
            { teks: _("Tolak karena merusak desain", "Refuse since it ruins the design"), skor: 0, umpan: _("Klien berhak mencoba, tugasmu memberi pertimbangan.", "The client may explore; your job is to advise.") },
          ],
        },
        {
          waktu: _("Minggu 3", "Week 3"),
          dari: { nama: "Mas Fadil", peran: _("Pemilik kedai", "Owner") },
          kanal: "WhatsApp",
          pesan: _("Sudah oke! Kirim semua filenya sekarang ya, sisa pembayaran minggu depan.", "Approved! Send all the files now; I'll pay the balance next week."),
          pilihan: [
            { teks: _("Kirim semua file final", "Send all final files"), skor: 0, umpan: _("Risiko tidak dibayar setelah file diserahkan.", "Risk of non-payment after handover.") },
            { teks: _("Kirim pratinjau beresolusi rendah dengan watermark untuk keperluan mendesak, file final setelah pelunasan sesuai kesepakatan", "Send low-res watermarked previews for urgent needs; finals after payment as agreed"), skor: 2, umpan: _("Membantu klien sambil melindungi pembayaranmu.", "Helps the client while protecting your payment.") },
            { teks: _("Tolak mengirim apa pun", "Send nothing"), skor: 1, umpan: _("Aman, tetapi kaku jika klien butuh pratinjau.", "Safe but rigid if he needs a preview.") },
          ],
        },
        {
          waktu: _("Minggu 4", "Week 4"),
          dari: { nama: "Mas Fadil", peran: _("Pemilik kedai", "Owner") },
          kanal: "WhatsApp",
          pesan: _("Sudah lunas. Percetakan minta file \"yang bisa diperbesar tanpa pecah\".", "Paid in full. The printer wants a file \"that can be enlarged without blurring\"."),
          pilihan: [
            { teks: _("Kirim PNG ukuran besar", "Send a large PNG"), skor: 1, umpan: _("Tetap bisa pecah jika diperbesar lebih jauh.", "Can still blur when scaled further.") },
            { teks: _("Kirim paket file: vektor (AI, SVG, PDF), PNG transparan berbagai ukuran, dan panduan warna untuk percetakan", "Send the full pack: vectors (AI, SVG, PDF), transparent PNGs in sizes, and a colour guide for print"), skor: 2, umpan: _("Paket lengkap membuat klien mandiri.", "A complete pack makes the client self-sufficient.") },
            { teks: _("Kirim tangkapan layar logo", "Send a screenshot"), skor: 0, umpan: _("Kualitas sangat rendah untuk cetak.", "Far too low quality for print.") },
          ],
        },
      ],
    },
  },

  ilustrator: {
    tugas: [
      {
        dari: { nama: "Kak Yuli", peran: _("Product lead, aplikasi belajar anak", "Product lead, kids' learning app") },
        kanal: "Email",
        tenggat: _("Sketsa Jumat", "Sketches by Friday"),
        revisi: {
          pesan: _("Kiko lucu! Tim kurikulum minta maskot tidak memakai kacamata tanda tambah dan kurang, karena aplikasi juga akan mengajar perkalian dan pembagian. Dan tolong tambah satu pose untuk layar \"istirahat dulu\".", "Kiko's cute! Curriculum asks that it not wear plus and minus glasses since the app will also teach multiplication and division. And please add a pose for the \"take a break\" screen."),
          petunjuk: [
            _("Ganti elemen kacamata dengan ciri khas lain yang tetap bertema matematika", "Replace the glasses with another maths-themed feature"),
            _("Tambahkan pose kelima beserta kegunaannya", "Add a fifth pose and its use"),
            _("Pastikan bentuk tetap sederhana", "Keep shapes simple"),
          ],
        },
      },
      {
        dari: { nama: "Pak Gun", peran: _("Editor penerbit buku anak", "Children's book editor") },
        kanal: "Email",
        tenggat: _("Minggu ini", "This week"),
        revisi: {
          pesan: _("Penawaran jelas. Kami juga ingin memakai 3 ilustrasi untuk poster promosi di toko buku dan pembatas buku yang dijual terpisah. Bagaimana?", "Clear quote. We'd also like to use 3 illustrations on bookstore posters and bookmarks sold separately. How does that work?"),
          petunjuk: [
            _("Bedakan poster promosi buku (termasuk) dan pembatas buku yang dijual (merchandise)", "Separate promotional posters (included) from bookmarks for sale (merchandise)"),
            _("Usulkan biaya lisensi tambahan untuk merchandise", "Propose an extra licence fee for merchandise"),
            _("Perbarui bagian hak penggunaan", "Update the usage rights section"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Komisi ilustrasi kemasan produk", "A packaging illustration commission"),
      konteks: _("Brand teh lokal memesan 4 ilustrasi untuk kemasan varian baru. Tenggat 3 minggu.", "A local tea brand commissions 4 illustrations for new variant packaging. 3-week deadline."),
      langkah: [
        {
          waktu: _("Hari 1", "Day 1"),
          dari: { nama: _("Brand manager", "Brand manager") },
          kanal: "Email",
          pesan: _("Kami suka gaya ilustrasimu. Bisa langsung kirim final minggu depan, tanpa sketsa?", "We love your style. Can you send finals next week, no sketches?"),
          pilihan: [
            { teks: _("Setuju agar cepat", "Agree to be fast"), skor: 0, umpan: _("Tanpa persetujuan sketsa, revisi besar di akhir sangat mungkin terjadi.", "Without sketch approval, big late revisions are likely.") },
            { teks: _("Jelaskan bahwa persetujuan sketsa justru mempercepat, dan tawarkan sketsa dalam 3 hari", "Explain sketch approval actually speeds things up, and offer sketches in 3 days"), skor: 2, umpan: _("Proses bertahap melindungi kedua pihak.", "Staged process protects both sides.") },
            { teks: _("Kirim final langsung tanpa memberi tahu prosesnya", "Send finals without explaining"), skor: 1, umpan: _("Berisiko, dan klien tidak paham alasan revisi besar nantinya.", "Risky, and the client won't understand later big revisions.") },
          ],
        },
        {
          waktu: _("Hari 5", "Day 5"),
          dari: { nama: _("Brand manager", "Brand manager") },
          kanal: "Email",
          pesan: _("Sketsa disetujui! Oh iya, apakah kami boleh memakai ilustrasinya untuk iklan TV juga?", "Sketches approved! By the way, can we use the art in TV ads too?"),
          pilihan: [
            { teks: _("\"Boleh, sama saja.\"", "\"Sure, same thing.\""), skor: 0, umpan: _("Iklan TV adalah penggunaan yang jauh lebih luas dan bernilai.", "TV ads are a much broader, more valuable use.") },
            { teks: _("\"Kontrak saat ini untuk kemasan dan media sosial. Untuk iklan TV, saya kirim penawaran lisensi tambahan.\"", "\"The current contract covers packaging and social. For TV, I'll send an extra licence quote.\""), skor: 2, umpan: _("Jelas dan menghargai nilai karyamu.", "Clear and values your work.") },
            { teks: _("Diam saja", "Say nothing"), skor: 1, umpan: _("Masalah hak penggunaan bisa muncul belakangan.", "Rights issues may surface later.") },
          ],
        },
        {
          waktu: _("Hari 12", "Day 12"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Ilustrasi ketiga terlambat 2 hari karena kamu sakit.", "Illustration 3 is 2 days behind because you were ill."),
          pilihan: [
            { teks: _("Kabari klien sekarang dengan tanggal baru yang realistis", "Tell the client now with a realistic new date"), skor: 2, umpan: _("Kabar awal memberi klien waktu menyesuaikan jadwal cetak.", "Early notice lets them adjust the print schedule.") },
            { teks: _("Diam dan kejar sendiri", "Stay quiet and catch up"), skor: 1, umpan: _("Jika tetap terlambat, klien kaget di akhir.", "If still late, they're surprised at the end.") },
            { teks: _("Kirim versi setengah jadi sebagai final", "Send a half-finished version as final"), skor: 0, umpan: _("Merusak kualitas dan reputasi.", "Damages quality and reputation.") },
          ],
        },
        {
          waktu: _("Hari 20", "Day 20"),
          dari: { nama: _("Percetakan", "Printer") },
          kanal: "Email",
          pesan: _("File perlu CMYK, 300 dpi, dengan bleed 3 mm.", "Files need CMYK, 300 dpi, with 3 mm bleed."),
          pilihan: [
            { teks: _("Kirim file RGB seperti biasa", "Send RGB as usual"), skor: 0, umpan: _("Warna bisa bergeser saat dicetak.", "Colours may shift in print.") },
            { teks: _("Konversi ke CMYK, cek warna yang bergeser, tambahkan bleed, lalu kirim beserta pratinjau", "Convert to CMYK, check shifted colours, add bleed, then send with a preview"), skor: 2, umpan: _("File siap cetak dan warna terkendali.", "Print-ready with colours under control.") },
            { teks: _("Minta percetakan yang mengubah", "Ask the printer to convert"), skor: 1, umpan: _("Bisa, tetapi kamu kehilangan kendali atas hasil warna.", "Possible, but you lose colour control.") },
          ],
        },
      ],
    },
  },

  "desain-presentasi": {
    tugas: [
      {
        dari: { nama: "Bu Diana", peran: _("Head of corporate communication", "Head of corporate communication") },
        kanal: "Email",
        tenggat: _("Besok pagi, rapat umum jam 10.00", "Tomorrow morning; town hall at 10"),
        revisi: {
          pesan: _("Bagus sekali. Direktur ingin karyawan juga merasa dihargai, jadi pertumbuhan tim dari 45 ke 68 orang tetap ditampilkan di slide ini, tapi jangan sampai ramai lagi.", "Excellent. The director wants staff to feel valued, so team growth from 45 to 68 should stay on this slide, without making it cluttered again."),
          petunjuk: [
            _("Tambahkan pertumbuhan tim sebagai elemen kecil yang terintegrasi", "Add team growth as a small integrated element"),
            _("Pertahankan satu angka utama yang paling menonjol", "Keep one dominant headline number"),
            _("Jelaskan tata letak revisinya", "Describe the revised layout"),
          ],
        },
      },
      {
        dari: { nama: "Mas Reza", peran: _("Founder startup agritech", "Agritech startup founder") },
        kanal: "WhatsApp",
        tenggat: _("Demo day minggu depan", "Demo day next week"),
        revisi: {
          pesan: _("Alurnya oke! Tapi waktu pitching cuma 3 menit. 10 slide terlalu banyak, maksimal 7. Bagian mana yang digabung?", "Good flow! But the pitch is only 3 minutes. 10 slides is too many; 7 max. What should be merged?"),
          petunjuk: [
            _("Gabungkan slide yang berkaitan (misalnya solusi dan cara kerja)", "Merge related slides (e.g. solution and how it works)"),
            _("Pertahankan masalah, traksi, dan kebutuhan dana", "Keep problem, traction, and the ask"),
            _("Perkirakan durasi bicara per slide", "Estimate speaking time per slide"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Pitch deck dengan tenggat 48 jam", "A pitch deck with a 48-hour deadline"),
      konteks: _("Startup meminta kamu merapikan 20 slide untuk pitching ke investor dalam 2 hari.", "A startup needs 20 slides polished for an investor pitch in 2 days."),
      langkah: [
        {
          waktu: _("Jam ke-1", "Hour 1"),
          dari: { nama: _("Founder", "Founder") },
          kanal: "WhatsApp",
          pesan: _("File-nya ini. Isinya masih bisa berubah sampai besok ya.", "Here's the file. Content might change until tomorrow."),
          pilihan: [
            { teks: _("Mulai desain detail semua slide", "Start detailing every slide"), skor: 1, umpan: _("Jika isi berubah, banyak pekerjaan terbuang.", "If content changes, lots of work is wasted.") },
            { teks: _("Buat slide master dan 3 slide contoh dulu untuk disetujui gayanya, sambil minta tenggat isi final", "Build masters and 3 sample slides for style approval, and ask for a final content deadline"), skor: 2, umpan: _("Gaya disepakati lebih awal, isi bisa menyusul.", "Style is agreed early; content can follow.") },
            { teks: _("Tunggu isi final besok", "Wait for final content tomorrow"), skor: 0, umpan: _("Waktu yang tersisa jadi terlalu sempit.", "Leaves too little time.") },
          ],
        },
        {
          waktu: _("Jam ke-20", "Hour 20"),
          dari: { nama: _("Founder", "Founder") },
          kanal: "WhatsApp",
          pesan: _("Saya mau tambah 8 slide data pasar lagi.", "I want to add 8 more market data slides."),
          pilihan: [
            { teks: _("Tambahkan semuanya", "Add them all"), skor: 0, umpan: _("Deck terlalu panjang untuk pitching dan tenggat terancam.", "Too long for a pitch, and the deadline's at risk.") },
            { teks: _("Usulkan merangkum data pasar menjadi 1 sampai 2 slide utama dan memindahkan sisanya ke lampiran", "Suggest condensing market data into 1 to 2 key slides with the rest in an appendix"), skor: 2, umpan: _("Pesan tetap fokus dan data tetap tersedia jika ditanya.", "Focused message, data still on hand if asked.") },
            { teks: _("Tolak", "Refuse"), skor: 1, umpan: _("Kebutuhan klien nyata, tawarkan solusinya.", "The need is real; offer a solution.") },
          ],
        },
        {
          waktu: _("Jam ke-40", "Hour 40"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Font yang dipakai tidak tersedia di laptop founder.", "The font isn't installed on the founder's laptop."),
          pilihan: [
            { teks: _("Biarkan saja", "Ignore it"), skor: 0, umpan: _("Tampilan bisa berantakan saat presentasi.", "Layout may break during the pitch.") },
            { teks: _("Ganti dengan font yang aman (atau sematkan font), lalu kirim juga versi PDF sebagai cadangan", "Switch to a safe font (or embed it) and also send a PDF backup"), skor: 2, umpan: _("Mencegah kejutan saat presentasi.", "Prevents surprises on stage.") },
            { teks: _("Minta founder membeli font", "Ask the founder to buy the font"), skor: 1, umpan: _("Mungkin tidak sempat sebelum pitching.", "May not happen before the pitch.") },
          ],
        },
        {
          waktu: _("Jam ke-47", "Hour 47"),
          dari: { nama: _("Founder", "Founder") },
          kanal: "WhatsApp",
          pesan: _("Sudah saya cek, ada angka pendapatan yang salah di slide 7.", "I checked, and a revenue figure on slide 7 is wrong."),
          pilihan: [
            { teks: _("Perbaiki segera, cek ulang semua angka lain dengan data yang ia berikan, lalu kirim versi akhir", "Fix it now, recheck every other number against his data, then send the final"), skor: 2, umpan: _("Satu kesalahan angka bisa merusak kredibilitas di depan investor.", "One wrong number can damage credibility with investors.") },
            { teks: _("Perbaiki slide 7 saja", "Fix slide 7 only"), skor: 1, umpan: _("Kesalahan serupa mungkin ada di slide lain.", "Similar errors may exist elsewhere.") },
            { teks: _("Bilang angkanya dari file dia", "Say the number came from his file"), skor: 0, umpan: _("Benar atau tidak, yang penting deck-nya benar sebelum pitching.", "Right or not, the deck must be correct before the pitch.") },
          ],
        },
      ],
    },
  },

  "motion-graphics": {
    tugas: [
      {
        dari: { nama: "Mbak Tari", peran: _("Marketing lead, aplikasi pembayaran tagihan", "Marketing lead, bill payment app") },
        kanal: "Slack",
        tenggat: _("Storyboard Rabu", "Storyboard by Wednesday"),
        revisi: {
          pesan: _("Storyboard-nya oke! Tapi iklan ini juga akan tayang di YouTube 15 detik yang bisa dilewati setelah 5 detik. Bisa buat versi 15 detik dengan pesan utama di 5 detik pertama?", "Good storyboard! But it'll also run as a 15-second skippable YouTube ad. Can you make a 15-second cut with the key message in the first 5 seconds?"),
          petunjuk: [
            _("Pindahkan pesan utama dan logo ke 5 detik pertama", "Move the key message and logo into the first 5 seconds"),
            _("Pangkas adegan yang tidak penting", "Cut non-essential scenes"),
            _("Tulis storyboard versi 15 detik", "Write the 15-second storyboard"),
          ],
        },
      },
      {
        dari: { nama: "Mas Arif", peran: _("Kreator kanal kuliner", "Food channel creator") },
        kanal: "Email",
        tenggat: _("Akhir minggu", "End of the week"),
        revisi: {
          pesan: _("Penawarannya jelas. Saya juga butuh versi animasi untuk Shorts (vertikal 9:16). Termasuk atau tambah biaya?", "Clear quote. I also need versions for Shorts (vertical 9:16). Included or extra?"),
          petunjuk: [
            _("Jelaskan perbedaan pekerjaan untuk format vertikal", "Explain the extra work for vertical formats"),
            _("Tawarkan biaya tambahan atau paket gabungan", "Offer an add-on fee or a bundle"),
            _("Perbarui daftar file yang diserahkan", "Update the deliverables list"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Video penjelasan untuk startup", "An explainer video for a startup"),
      konteks: _("Kamu membuat video penjelasan 60 detik untuk aplikasi HR. Naskah dan voice over dari klien.", "You're making a 60-second explainer for an HR app. Script and voiceover come from the client."),
      langkah: [
        {
          waktu: _("Minggu 1", "Week 1"),
          dari: { nama: _("Klien", "Client") },
          kanal: "Email",
          pesan: _("Naskah masih draf, langsung mulai animasi saja ya biar cepat.", "The script's still a draft; just start animating to save time."),
          pilihan: [
            { teks: _("Mulai animasi penuh", "Start full animation"), skor: 0, umpan: _("Perubahan naskah nanti berarti animasi diulang.", "Script changes later mean redoing animation.") },
            { teks: _("Buat styleframe dan storyboard dulu, minta naskah dikunci sebelum animasi penuh", "Make styleframes and a storyboard first, and ask for the script to be locked before full animation"), skor: 2, umpan: _("Kunci naskah menghemat waktu kedua pihak.", "Locking the script saves everyone time.") },
            { teks: _("Tunggu tanpa mengerjakan apa pun", "Wait and do nothing"), skor: 1, umpan: _("Styleframe bisa dikerjakan sambil menunggu.", "Styleframes can be done meanwhile.") },
          ],
        },
        {
          waktu: _("Minggu 2", "Week 2"),
          dari: { nama: _("Klien", "Client") },
          kanal: "Email",
          pesan: _("Voice over baru dikirim, durasinya 72 detik, bukan 60.", "The voiceover's in at 72 seconds, not 60."),
          pilihan: [
            { teks: _("Percepat audio agar 60 detik", "Speed the audio to 60 seconds"), skor: 0, umpan: _("Suara jadi tidak alami.", "The voice sounds unnatural.") },
            { teks: _("Kabari klien: pilih memangkas naskah dan rekam ulang, atau menyesuaikan durasi video dengan biaya tambahan", "Tell the client: trim the script and re-record, or extend the video at extra cost"), skor: 2, umpan: _("Jujur soal dampak dan memberi pilihan.", "Honest about impact with options.") },
            { teks: _("Animasikan 72 detik tanpa memberi tahu", "Animate 72 seconds without telling"), skor: 1, umpan: _("Pekerjaan bertambah tanpa kesepakatan.", "More work without agreement.") },
          ],
        },
        {
          waktu: _("Minggu 3", "Week 3"),
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Render final butuh 6 jam, tenggat besok pagi.", "Final render takes 6 hours; due tomorrow morning."),
          pilihan: [
            { teks: _("Render pratinjau resolusi rendah untuk cek terakhir, lalu jalankan render final malam ini", "Render a low-res preview for a last check, then queue the final tonight"), skor: 2, umpan: _("Kesalahan tertangkap sebelum render panjang.", "Errors caught before the long render.") },
            { teks: _("Langsung render final", "Render final straight away"), skor: 1, umpan: _("Jika ada kesalahan, waktu tidak cukup untuk render ulang.", "If there's an error, no time to re-render.") },
            { teks: _("Render besok pagi", "Render tomorrow morning"), skor: 0, umpan: _("Tenggat pasti terlewat.", "The deadline will be missed.") },
          ],
        },
        {
          waktu: _("Minggu 4", "Week 4"),
          dari: { nama: _("Klien", "Client") },
          kanal: "Email",
          pesan: _("Hasilnya keren! Kirim file proyek After Effects juga ya.", "Looks great! Send the After Effects project too."),
          pilihan: [
            { teks: _("Kirim gratis", "Send free"), skor: 1, umpan: _("Boleh jika ingin, tetapi sebaiknya sesuai kesepakatan.", "Fine if you choose, but follow the agreement.") },
            { teks: _("Jelaskan bahwa file proyek tidak termasuk paket dan tawarkan dengan biaya tambahan", "Explain project files weren't included and offer them for a fee"), skor: 2, umpan: _("Jelas dan profesional.", "Clear and professional.") },
            { teks: _("Abaikan permintaannya", "Ignore the request"), skor: 0, umpan: _("Klien perlu jawaban.", "The client needs an answer.") },
          ],
        },
      ],
    },
  },

  "voice-over-audio": {
    tugas: [
      {
        dari: { nama: "Mbak Lusi", peran: _("Produser agensi iklan", "Ad agency producer") },
        kanal: "Email",
        tenggat: _("Rekaman besok, 10.00", "Recording tomorrow, 10 am"),
        revisi: {
          pesan: _("Take-nya bagus! Klien minta versi kedua yang lebih ceria dan energik untuk iklan radio, dan nama brand dilafalkan \"SEH-hat-ku\", tekanan di suku kata pertama.", "Good take! The client wants a second, brighter and more energetic version for radio, with the brand pronounced \"SEH-hat-ku\", stress on the first syllable."),
          petunjuk: [
            _("Tandai ulang naskah untuk nada ceria dan energik", "Re-mark the script for a bright, energetic tone"),
            _("Tulis catatan pelafalan nama brand", "Add a pronunciation note for the brand"),
            _("Perkirakan apakah durasi berubah dengan tempo lebih cepat", "Estimate whether timing changes at a faster pace"),
          ],
        },
      },
      {
        dari: { nama: _("Calon klien, startup e-learning", "Prospect, e-learning startup") },
        kanal: "Email",
        tenggat: _("Minggu ini", "This week"),
        revisi: {
          pesan: _("Daftar layanannya jelas. Kami butuh 40 modul e-learning, total sekitar 20.000 kata. Ada harga khusus untuk volume besar?", "Clear rate card. We need 40 e-learning modules, about 20,000 words in total. Is there volume pricing?"),
          petunjuk: [
            _("Usulkan diskon volume yang masuk akal", "Propose a sensible volume discount"),
            _("Tulis jadwal pengerjaan bertahap", "Write a staged schedule"),
            _("Sebut ketentuan revisi untuk proyek besar", "State revision terms for a large project"),
          ],
        },
      },
    ],
    simulasi: {
      judul: _("Hari rekaman untuk 3 klien", "A recording day for 3 clients"),
      konteks: _("Kamu voice talent lepas dengan studio rumahan. Hari ini ada 3 naskah.", "You're a freelance voice talent with a home studio. Three scripts today."),
      langkah: [
        {
          waktu: "08.00",
          dari: { nama: _("Kamu (catatan sendiri)", "You (own note)") },
          kanal: "Email",
          pesan: _("Tetangga sedang renovasi, suara bor terdengar di rekaman.", "A neighbour is renovating; drilling is audible in recordings."),
          pilihan: [
            { teks: _("Tetap rekam dan hapus suaranya dengan noise reduction", "Record anyway and remove it with noise reduction"), skor: 0, umpan: _("Noise reduction yang berat merusak kualitas suara.", "Heavy noise reduction degrades the voice.") },
            { teks: _("Geser jadwal rekaman ke jam istirahat atau sore, dan kabari klien yang tenggatnya pagi", "Shift recording to break time or evening, and alert clients with morning deadlines"), skor: 2, umpan: _("Kualitas terjaga dan klien mendapat kabar.", "Quality protected and clients informed.") },
            { teks: _("Batalkan semua proyek hari ini", "Cancel all today's work"), skor: 1, umpan: _("Masih ada cara mengatur ulang jadwal.", "Rescheduling is still possible.") },
          ],
        },
        {
          waktu: "11.00",
          dari: { nama: "Mbak Lusi", peran: _("Produser agensi", "Agency producer") },
          kanal: "Email",
          pesan: _("Naskah ini menyebut nama dokter \"dr. Nguyen\". Pelafalannya bagaimana ya?", "The script names \"Dr Nguyen\". How should it be pronounced?"),
          pilihan: [
            { teks: _("Tebak sendiri", "Guess"), skor: 0, umpan: _("Salah ucap nama orang terdengar tidak profesional.", "Mispronouncing names sounds unprofessional.") },
            { teks: _("Tanyakan ke klien atau minta rekaman contoh pelafalan sebelum merekam", "Ask the client or request a pronunciation sample first"), skor: 2, umpan: _("Satu pertanyaan mencegah rekam ulang.", "One question prevents a re-record.") },
            { teks: _("Rekam 3 versi pelafalan", "Record 3 pronunciations"), skor: 1, umpan: _("Membantu, tetapi bertanya lebih efisien.", "Helpful, but asking is more efficient.") },
          ],
        },
        {
          waktu: "14.00",
          dari: { nama: _("Klien baru", "New client") },
          kanal: "WhatsApp",
          pesan: _("Saya butuh rekaman yang terdengar seperti suara presenter TV terkenal itu untuk pengumuman resmi.", "I need a recording that sounds like that famous TV presenter for an official announcement."),
          pilihan: [
            { teks: _("Terima karena bayarannya besar", "Accept for the big fee"), skor: 0, umpan: _("Meniru suara orang nyata untuk \"pengumuman resmi\" bisa dipakai untuk menipu.", "Imitating a real person for an \"official announcement\" can be used to deceive.") },
            { teks: _("Tolak meniru orang nyata, tawarkan gaya suara serupa (tegas, berwibawa) dengan suaramu sendiri", "Decline imitating a real person; offer a similar style (authoritative, clear) in your own voice"), skor: 2, umpan: _("Kebutuhan klien tetap terpenuhi dengan cara yang etis.", "The need is met ethically.") },
            { teks: _("Terima tapi jangan cantumkan namamu", "Accept but keep your name off it"), skor: 0, umpan: _("Risikonya tetap sama.", "Same risk.") },
          ],
        },
        {
          waktu: "17.00",
          dari: { nama: "Mbak Lusi", peran: _("Produser agensi", "Agency producer") },
          kanal: "Email",
          pesan: _("Klien ingin mengganti satu kalimat di naskah setelah rekaman selesai.", "The client wants to change one line after recording."),
          pilihan: [
            { teks: _("Rekam ulang seluruh naskah gratis", "Re-record everything free"), skor: 1, umpan: _("Murah hati, tetapi bukan kebiasaan yang berkelanjutan.", "Generous but not sustainable.") },
            { teks: _("Rekam ulang kalimat itu dengan nada dan mikrofon yang sama agar menyatu, dan tagih sesuai ketentuan perubahan naskah", "Re-record that line with matching tone and mic so it blends, and bill per your script-change terms"), skor: 2, umpan: _("Profesional dan sesuai kesepakatan.", "Professional and per agreement.") },
            { teks: _("Tolak perubahan", "Refuse the change"), skor: 0, umpan: _("Perubahan naskah kecil adalah hal biasa.", "Small script changes are normal.") },
          ],
        },
      ],
    },
  },
};
