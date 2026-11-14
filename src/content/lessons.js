/* Jagoan Excel — kurikulum: modul, pemetaan sertifikasi, dan semua materi */
import { XL } from '../engine/engine.js';

/** @type {any[]} */ let MODULES;
/** @type {any[]} */ let CERT;
/** @type {any[]} */ let LESSONS;

// Bagian A: Dasar sampai Mencari data
{
const D=XL.D;
MODULES=[
  {id:'dasar',title:'Dasar Excel',desc:'Lembar kerja, alamat sel, operator, referensi, isi cepat, format',free:true},
  {id:'hitung',title:'Fungsi hitung',desc:'Menjumlah, rata-rata, membulatkan, peringkat',free:true},
  {id:'syarat',title:'Hitung bersyarat',desc:'SUMIF, COUNTIF, SUMIFS, MAXIFS'},
  {id:'logika',title:'Fungsi logika',desc:'IF, IFS, SWITCH, AND, OR, IFERROR'},
  {id:'teks',title:'Mengolah teks',desc:'Menggabung, memotong, mencari, dan memformat teks'},
  {id:'tanggal',title:'Tanggal dan hari kerja',desc:'Jatuh tempo, masa kerja, hari kerja'},
  {id:'cari',title:'Mencari data',desc:'VLOOKUP, INDEX-MATCH, XLOOKUP, tabel tarif'},
  {id:'array',title:'Array dinamis',desc:'FILTER, SORT, UNIQUE, LET di Excel 365'},
  {id:'keuangan',title:'Fungsi keuangan',desc:'Cicilan, kelayakan investasi, penyusutan'},
  {id:'data',title:'Mengelola dan menganalisis data',desc:'Tabel, filter, conditional formatting, grafik, PivotTable, Power Query'},
  {id:'kolaborasi',title:'Tampilan, keamanan, dan cetak',desc:'Freeze panes, proteksi, cetak, audit rumus, kolaborasi'},
  {id:'otomasi',title:'Macro dan VBA',desc:'Merekam macro sampai menulis kode VBA untuk pekerjaan rutin'},
  {id:'lanjut',title:'Fungsi lanjutan',desc:'Statistik, peramalan, database, informasi, konversi, keuangan lanjutan, LAMBDA, konsolidasi'},
  {id:'latihan',title:'Latihan bebas',desc:'Lembar kosong untuk mencoba apa saja',free:true},
];
CERT=[
  {code:'A1',exam:'MO-210',title:'Mengelola worksheet dan workbook'},
  {code:'A2',exam:'MO-210',title:'Mengelola sel dan rentang data'},
  {code:'A3',exam:'MO-210',title:'Mengelola tabel dan data tabel'},
  {code:'A4',exam:'MO-210',title:'Operasi dengan rumus dan fungsi'},
  {code:'A5',exam:'MO-210',title:'Mengelola grafik'},
  {code:'E1',exam:'MO-211',title:'Opsi dan pengaturan workbook'},
  {code:'E2',exam:'MO-211',title:'Mengelola dan memformat data'},
  {code:'E3',exam:'MO-211',title:'Rumus lanjutan dan macro'},
  {code:'E4',exam:'MO-211',title:'Grafik dan tabel lanjutan'},
];
LESSONS=[
/* ================= DASAR ================= */
{id:'mengenal-excel',mod:'dasar',type:'read',title:'Mengenal lembar kerja Excel',fns:'Workbook · Sheet · Ribbon',cert:['A1'],preview:'window',
 body:`<p>File Excel disebut <b>workbook</b>. Satu workbook berisi satu atau lebih <b>worksheet</b> (sheet), yang tampil sebagai tab di bagian bawah layar. Setiap sheet adalah kisi raksasa: 16.384 kolom (A sampai XFD) dan 1.048.576 baris.</p>
 <p>Bagian-bagian layar yang akan sering kamu pakai:</p>
 <ul>
  <li><b>Ribbon</b>, deretan menu di atas (Home, Insert, Formulas, Data, dan seterusnya). Setiap tab berisi grup perintah.</li>
  <li><b>Name Box</b>, kotak kecil di kiri bar rumus. Isinya alamat sel yang sedang dipilih. Kamu juga bisa mengetik alamat di sini untuk melompat, misalnya <code>X200</code>.</li>
  <li><b>Formula bar</b>, tempat melihat dan mengedit isi asli sel. Sel bisa menampilkan <code>54.000</code> padahal isinya <code>=B2*C2</code>.</li>
  <li><b>Status bar</b>, baris paling bawah. Saat beberapa sel angka dipilih, Excel langsung menampilkan Average, Count, dan Sum tanpa perlu rumus.</li>
  <li><b>Tab sheet</b>. Klik kanan tab untuk mengganti nama, warna, menyalin, atau menyembunyikan sheet.</li>
 </ul>
 <p>Format file yang perlu kamu tahu: <code>.xlsx</code> untuk workbook biasa, <code>.xlsm</code> untuk workbook yang berisi macro, <code>.xltx</code> untuk template, dan <code>.csv</code> untuk data teks yang dipisah koma. CSV tidak menyimpan rumus, format, maupun lebih dari satu sheet.</p>`,
 quiz:[
  {q:'Kamu memilih sel B2:B20 dan ingin tahu totalnya tanpa menulis rumus. Lihat di mana?',opts:['Name Box','Status bar','Tab sheet','Formula bar'],a:1,why:'Status bar menampilkan Sum, Average, dan Count untuk sel yang dipilih.'},
  {q:'Workbook kamu berisi macro. Simpan dengan format apa supaya macro-nya tidak hilang?',opts:['.xlsx','.csv','.xlsm','.xltx'],a:2,why:'.xlsx tidak bisa menyimpan macro. Gunakan .xlsm (Excel Macro-Enabled Workbook).'},
 ]},

{id:'rumus-pertama',mod:'dasar',title:'Sel, alamat, dan rumus pertama',fns:'= * +',cert:['A4'],
 intro:`<p>Pertemuan kolom dan baris disebut sel, dan namanya adalah gabungan huruf kolom dan nomor baris. Sel di kolom B baris 2 bernama <code>B2</code>.</p>
 <p>Rumus selalu diawali tanda <code>=</code>. Di dalam rumus, sebut alamat sel, bukan angkanya. Dengan begitu, kalau harga di B2 diubah, hasil rumusnya ikut berubah tanpa perlu diketik ulang.</p>`,
 syntax:'=B2*C2',parts:[['=','tanda bahwa isi sel adalah rumus'],['B2, C2','alamat sel yang nilainya dipakai'],['*','operator perkalian']],
 task:'Isi <code>D2</code> dengan total harga kopi susu, yaitu harga dikali jumlah. Sel <code>D3</code> sudah berisi contoh; klik sel itu untuk melihat rumusnya.',
 cols:4,rows:4,target:'D2',solution:'=B2*C2',
 hint:'Klik D2, ketik <code>=</code>, klik sel B2, ketik <code>*</code>, lalu klik C2. Tekan Enter untuk memeriksa.',
 data:{A1:'Menu',B1:'Harga',C1:'Jumlah',D1:'Total',A2:'Kopi susu',B2:18000,C2:3,A3:'Roti bakar',B3:22000,C3:2,D3:'=B3*C3'}},

{id:'operator',mod:'dasar',title:'Operator dan urutan hitung',fns:'+ - * / ^ ( )',cert:['A4'],
 intro:`<p>Operator hitung di Excel adalah <code>+</code> tambah, <code>-</code> kurang, <code>*</code> kali, <code>/</code> bagi, dan <code>^</code> pangkat. Urutannya mengikuti matematika: pangkat dulu, lalu kali dan bagi, terakhir tambah dan kurang.</p>
 <p>Tanda kurung memaksa sebuah bagian dihitung lebih dulu. Persen boleh ditulis <code>10%</code> atau <code>0.1</code>; keduanya bernilai sama.</p>`,
 syntax:'=B1*(1-B2)+B3',parts:[['( )','bagian ini dihitung paling awal'],['1-B2','sisa harga setelah diskon, di sini 90%'],['+B3','ongkos kirim ditambahkan terakhir']],
 task:'Di <code>B4</code>, hitung harga akhir sepatu: harga dikurangi diskon, lalu ditambah ongkos kirim.',
 cols:3,rows:5,target:'B4',solution:'=B1*(1-B2)+B3',bold:['A4'],fmt:{B2:'pct'},
 hint:'Tanpa kurung, <code>=B1*1-B2+B3</code> dihitung sebagai (B1×1) − B2 + B3. Hasilnya jauh dari harapan.',
 data:{A1:'Harga sepatu',B1:250000,A2:'Diskon',B2:0.1,A3:'Ongkos kirim',B3:15000,A4:'Harga akhir'}},

{id:'absolut',mod:'dasar',title:'Referensi relatif dan absolut',fns:'$A$1 · F4',cert:['A4'],
 intro:`<p>Saat rumus disalin ke bawah, alamat sel di dalamnya ikut bergeser. <code>=B2*F1</code> di baris 2 akan menjadi <code>=B3*F2</code> di baris 3. Ini disebut referensi relatif.</p>
 <p>Tarif pajak hanya ada di satu sel, jadi alamatnya tidak boleh ikut bergeser. Kunci dengan tanda dolar: <code>$F$1</code>. Dolar di depan huruf mengunci kolom, di depan angka mengunci baris. Tekan <kbd>F4</kbd> saat kursor berada di alamat sel untuk menambahkan tanda dolar, baik di Excel maupun di sini.</p>`,
 syntax:'=B2*$F$1',parts:[['B2','relatif, ikut bergeser saat disalin'],['$F$1','absolut, selalu menunjuk F1'],['F4','berganti F1 → $F$1 → F$1 → $F1']],
 task:'Isi <code>C2</code> dengan pajak untuk kemeja, dengan sel F1 dikunci. Lalu tekan <b>Salin ke bawah</b> dan lihat apakah C3 sampai C5 ikut benar.',
 cols:6,rows:6,target:'C2',editable:['C2','C3','C4','C5'],fill:{from:'C2',to:['C3','C4','C5']},solution:'=B2*$F$1',fmt:{F1:'pct'},bold:['E1'],
 abs:'\\$F\\$1',absMsg:'Rumusnya sudah menghitung, tapi F1 belum dikunci. Saat disalin ke bawah, alamatnya akan bergeser ke F2, F3, dan seterusnya yang kosong. Taruh kursor di F1 lalu tekan F4.',
 hint:'Ketik <code>=B2*F1</code>, taruh kursor di F1, tekan <kbd>F4</kbd> sekali sampai menjadi <code>$F$1</code>.',
 data:{A1:'Produk',B1:'Harga',C1:'Pajak',A2:'Kemeja',B2:185000,A3:'Celana',B3:240000,A4:'Jaket',B4:375000,A5:'Topi',B5:65000,E1:'Tarif (contoh)',F1:0.11}},

{id:'isi-cepat',mod:'dasar',type:'read',title:'Isi cepat: AutoFill dan Flash Fill',fns:'Fill handle · Ctrl+E',cert:['A2','E2'],preview:'autofill',
 body:`<p>Kotak kecil di pojok kanan bawah sel yang dipilih disebut <b>fill handle</b>. Seret ke bawah atau ke samping, dan Excel akan melanjutkan polanya.</p>
 <ul>
  <li>Angka <code>1</code> dan <code>2</code> di dua sel, pilih keduanya, lalu seret: menjadi 3, 4, 5, dan seterusnya.</li>
  <li><code>Jan</code> atau <code>Senin</code> diseret menjadi Feb, Mar, … atau Selasa, Rabu, …</li>
  <li>Rumus diseret akan disalin dengan alamat relatif yang bergeser.</li>
  <li>Klik dua kali fill handle untuk mengisi ke bawah otomatis sepanjang kolom di sebelahnya.</li>
 </ul>
 <h3>Fill Series</h3>
 <p>Untuk deret yang lebih teratur, misalnya tanggal setiap hari kerja atau kelipatan 5 sampai 500, pakai <b>Home › Fill › Series</b>. Kamu bisa memilih jenis Linear, Growth, atau Date, lalu menentukan langkah dan batasnya.</p>
 <h3>Flash Fill</h3>
 <p>Flash Fill membaca pola dari contoh yang kamu ketik. Misalnya kolom A berisi email <code>rina.w@kantor.co.id</code>. Ketik <code>rina.w</code> di B2, lalu tekan <kbd>Ctrl</kbd>+<kbd>E</kbd>. Excel mengisi sisanya dengan pola yang sama.</p>
 <div class="tip"><b>Catatan:</b> hasil Flash Fill berupa nilai tetap, bukan rumus. Kalau data sumbernya berubah, hasilnya tidak ikut berubah. Untuk data yang akan terus diperbarui, gunakan rumus teks seperti LEFT dan FIND.</div>`,
 quiz:[
  {q:'Kamu mengetik nama depan di B2 dari kolom nama lengkap, lalu ingin Excel mengisi sisanya otomatis. Shortcut-nya?',opts:['Ctrl + D','Ctrl + E','Ctrl + R','Alt + ='],a:1,why:'Ctrl + E menjalankan Flash Fill.'},
  {q:'Data sumber Flash Fill diubah. Apa yang terjadi pada hasilnya?',opts:['Ikut berubah otomatis','Menjadi error','Tetap seperti semula','Terhapus'],a:2,why:'Flash Fill mengisi nilai tetap, bukan rumus.'},
 ]},

{id:'format-sel',mod:'dasar',type:'read',title:'Format angka, tanggal, dan perataan',fns:'Ctrl+1 · Custom format',cert:['A2','E2'],preview:'numfmt',
 body:`<p>Format hanya mengubah tampilan, bukan nilai. Sel berisi <code>0,1</code> bisa tampil sebagai <code>10%</code>, dan sel berisi <code>46279</code> bisa tampil sebagai tanggal. Buka semua pilihan format dengan <kbd>Ctrl</kbd>+<kbd>1</kbd>.</p>
 <h3>Format yang paling sering dipakai</h3>
 <ul>
  <li><b>Number</b>: atur jumlah desimal dan pemisah ribuan.</li>
  <li><b>Currency</b> dan <b>Accounting</b>: menampilkan simbol mata uang. Accounting menyejajarkan simbol di kiri sel dan menampilkan nol sebagai tanda strip, cocok untuk laporan keuangan.</li>
  <li><b>Date</b>: berbagai gaya tanggal. Gaya yang tersedia mengikuti pengaturan wilayah komputer.</li>
  <li><b>Percentage</b>: mengalikan tampilan dengan 100 dan menambah tanda %.</li>
  <li><b>Text</b>: angka disimpan sebagai teks. Berguna untuk nomor HP atau NIK yang diawali 0 atau lebih dari 15 digit, karena Excel hanya menyimpan 15 digit angka yang presisi.</li>
 </ul>
 <h3>Format kustom</h3>
 <p>Di kategori <b>Custom</b> kamu menulis kode format sendiri. Beberapa contoh:</p>
 <ul>
  <li><code>"Rp"#,##0</code> → Rp1.250.000</li>
  <li><code>#,##0,,"jt"</code> → 1.250.000.000 tampil sebagai 1.250jt (setiap koma di akhir membagi 1.000)</li>
  <li><code>dd mmmm yyyy</code> → 14 September 2026</li>
  <li><code>0;[Red]-0;"–"</code> → positif biasa, negatif merah, nol menjadi strip</li>
 </ul>
 <h3>Perataan</h3>
 <p><b>Wrap Text</b> memecah teks panjang menjadi beberapa baris di dalam sel. <b>Merge &amp; Center</b> menggabungkan beberapa sel, tetapi membuat sort, filter, dan salin-tempel bermasalah. Untuk judul tabel, lebih aman memakai <b>Center Across Selection</b> (Ctrl+1 › Alignment › Horizontal), yang tampilannya sama tanpa menggabungkan sel.</p>
 <div class="tip"><b>Excel berbahasa Indonesia:</b> pemisah ribuan menjadi titik dan desimal menjadi koma. Kode format juga ikut tertukar, jadi <code>#,##0.00</code> ditulis <code>#.##0,00</code>.</div>`,
 quiz:[
  {q:'Sel berisi 0,25 dan diberi format Percentage. Berapa nilai yang dipakai rumus lain saat merujuk sel itu?',opts:['25','0,25','25%','Teks "25%"'],a:1,why:'Format hanya mengubah tampilan. Nilainya tetap 0,25.'},
  {q:'Cara paling aman membuat judul tampil di tengah beberapa kolom tanpa mengganggu sort dan filter?',opts:['Merge & Center','Center Across Selection','Wrap Text','Menambah spasi'],a:1,why:'Center Across Selection tidak menggabungkan sel.'},
  {q:'Nomor HP 081234567890 kehilangan angka 0 di depan. Format apa yang perlu dipasang sebelum mengetik?',opts:['Number','Text','Accounting','General'],a:1,why:'Format Text menyimpan isian apa adanya, termasuk 0 di depan.'},
 ]},

/* ================= FUNGSI HITUNG ================= */
{id:'sum',mod:'hitung',title:'Menjumlah dengan SUM',fns:'SUM · AutoSum',cert:['A4'],
 intro:`<p>Fungsi adalah rumus siap pakai yang punya nama. <code>SUM</code> menjumlahkan semua angka di dalam rentang.</p>
 <p>Rentang ditulis sel awal, titik dua, sel akhir. <code>B2:B6</code> berarti B2 sampai B6. Teks dan sel kosong di dalam rentang dilewati tanpa error. Di Excel, <kbd>Alt</kbd>+<kbd>=</kbd> menulis SUM otomatis untuk data di atasnya.</p>`,
 syntax:'=SUM(B2:B6)',parts:[['SUM','nama fungsi'],['B2:B6','rentang yang dijumlahkan']],
 task:'Isi <code>B7</code> dengan total penjualan dari Senin sampai Jumat.',
 cols:3,rows:8,target:'B7',solution:'=SUM(B2:B6)',use:['SUM'],bold:['A7'],
 hint:'Sambil mengetik rumus, klik lalu seret di tabel untuk memilih rentang. Ketik <code>=SUM(</code>, seret dari B2 sampai B6, lalu tutup dengan <code>)</code>.',
 data:{A1:'Hari',B1:'Penjualan',A2:'Senin',B2:1250000,A3:'Selasa',B3:980000,A4:'Rabu',B4:1430000,A5:'Kamis',B5:1100000,A6:'Jumat',B6:1675000,A7:'Total'}},

{id:'average',mod:'hitung',title:'Rata-rata, terkecil, terbesar',fns:'AVERAGE · MIN · MAX',cert:['A4'],
 intro:`<p><code>AVERAGE</code> menghitung rata-rata, <code>MIN</code> mencari angka terkecil, dan <code>MAX</code> angka terbesar. Ketiganya ditulis dengan pola yang sama seperti SUM.</p>
 <p>AVERAGE melewati sel kosong, tetapi tetap menghitung angka 0. Siswa yang belum ikut ujian sebaiknya dikosongkan, bukan diisi 0. <code>MEDIAN</code> memberi nilai tengah dan lebih tahan terhadap angka ekstrem.</p>`,
 syntax:'=AVERAGE(B2:B7)',parts:[['AVERAGE','jumlah dibagi banyaknya angka'],['MIN / MAX','angka terkecil / terbesar']],
 task:'Isi <code>B8</code> dengan nilai rata-rata ujian. Baris 9 dan 10 sudah memakai MAX dan MIN.',
 cols:3,rows:11,target:'B8',solution:'=AVERAGE(B2:B7)',use:['AVERAGE'],bold:['A8','A9','A10'],
 hint:'Rentang nilainya B2 sampai B7. B1 berisi judul kolom, jadi tidak perlu diikutkan.',
 data:{A1:'Siswa',B1:'Nilai',A2:'Andi',B2:78,A3:'Bunga',B3:85,A4:'Citra',B4:92,A5:'Dimas',B5:66,A6:'Eka',B6:88,A7:'Fajar',B7:71,A8:'Rata-rata',A9:'Tertinggi',B9:'=MAX(B2:B7)',A10:'Terendah',B10:'=MIN(B2:B7)'}},

{id:'count',mod:'hitung',title:'Menghitung jumlah data',fns:'COUNT · COUNTA · COUNTBLANK',cert:['A4'],
 intro:`<p><code>COUNT</code> menghitung sel berisi angka, <code>COUNTA</code> menghitung semua sel yang tidak kosong, dan <code>COUNTBLANK</code> menghitung sel kosong.</p>
 <p>Untuk daftar nama, pakai COUNTA karena nama adalah teks. Untuk kolom nominal pembayaran, COUNT lebih tepat karena isinya angka.</p>`,
 syntax:'=COUNT(B2:B8)',parts:[['COUNT','banyaknya sel berisi angka'],['COUNTA','banyaknya sel yang tidak kosong']],
 task:'Isi <code>B9</code> dengan jumlah peserta workshop yang sudah membayar.',
 cols:3,rows:11,target:'B9',solution:'=COUNT(B2:B8)',use:['COUNT'],bold:['A9','A10'],
 hint:'Sel kosong di kolom B berarti peserta itu belum bayar. COUNT tidak menghitung sel kosong.',
 data:{A1:'Peserta',B1:'Bayar',A2:'Rina',B2:150000,A3:'Yusuf',A4:'Maya',B4:150000,A5:'Hendra',B5:150000,A6:'Sari',A7:'Teguh',B7:150000,A8:'Lestari',B8:150000,A9:'Sudah bayar',A10:'Total peserta',B10:'=COUNTA(A2:A8)'}},

{id:'round',mod:'hitung',title:'Membulatkan angka',fns:'ROUND · ROUNDUP · MROUND',cert:['A4'],
 intro:`<p>Mengubah tampilan desimal lewat format sel tidak mengubah nilainya. Kalau nilainya memang perlu dibulatkan, misalnya pajak dalam rupiah penuh, pakai <code>ROUND</code>.</p>
 <p>Argumen kedua menentukan jumlah digit. <code>0</code> berarti tanpa desimal, <code>-3</code> berarti ke ribuan terdekat. <code>ROUNDUP</code> selalu ke atas, <code>ROUNDDOWN</code> selalu ke bawah, dan <code>MROUND(x,500)</code> membulatkan ke kelipatan 500 terdekat, berguna untuk harga jual.</p>`,
 syntax:'=ROUND(B2,0)',parts:[['B2','angka yang dibulatkan'],['0','jumlah digit di belakang koma']],
 task:'Pajak 11% di <code>B2</code> masih berkoma. Isi <code>B3</code> dengan pajak yang dibulatkan ke rupiah penuh. Total bayar di B4 akan ikut berubah.',
 cols:3,rows:5,target:'B3',solution:'=ROUND(B2,0)',use:['ROUND'],bold:['A4'],
 hint:'ROUND butuh dua argumen: angkanya, lalu jumlah digit. Pisahkan dengan koma atau titik koma.',
 data:{A1:'Subtotal',B1:187650,A2:'Pajak 11%',B2:'=B1*0.11',A3:'Pajak dibulatkan',A4:'Total bayar',B4:'=B1+B3'}},

{id:'sumproduct',mod:'hitung',title:'Kali lalu jumlah: SUMPRODUCT',fns:'SUMPRODUCT',cert:['E3'],
 intro:`<p>Untuk menghitung total penjualan, biasanya kita membuat kolom bantu qty × harga lalu menjumlahkannya. <code>SUMPRODUCT</code> melakukan keduanya sekaligus: mengalikan rentang baris per baris, lalu menjumlahkan hasilnya.</p>
 <p>SUMPRODUCT juga bisa dipakai untuk menjumlah dengan syarat, misalnya <code>=SUMPRODUCT((A2:A6="Pulpen")*B2:B6*C2:C6)</code>. Bagian di dalam kurung menghasilkan TRUE atau FALSE, yang dihitung sebagai 1 atau 0.</p>`,
 syntax:'=SUMPRODUCT(B2:B6,C2:C6)',parts:[['B2:B6','rentang pertama, qty'],['C2:C6','rentang kedua, harga satuan; ukurannya harus sama']],
 task:'Isi <code>B7</code> dengan total nilai penjualan alat tulis tanpa membuat kolom bantu.',
 cols:3,rows:8,target:'B7',solution:'=SUMPRODUCT(B2:B6,C2:C6)',use:['SUMPRODUCT'],bold:['A7'],
 hint:'Kedua rentang harus sama panjang: B2:B6 dan C2:C6.',
 data:{A1:'Produk',B1:'Qty',C1:'Harga satuan',A2:'Pulpen',B2:120,C2:3500,A3:'Buku tulis',B3:80,C3:6000,A4:'Map plastik',B4:45,C4:4500,A5:'Stabilo',B5:30,C5:9500,A6:'Kertas A4 (rim)',B6:12,C6:52000,A7:'Total penjualan'}},

{id:'rank',mod:'hitung',title:'Membuat peringkat',fns:'RANK',cert:['E3'],
 intro:`<p><code>RANK</code> memberi posisi sebuah angka di antara angka lain. Secara bawaan, angka terbesar mendapat peringkat 1.</p>
 <p>Rentang pembandingnya harus dikunci dengan <code>$</code> supaya tidak bergeser saat rumus disalin. Di Excel versi baru, fungsi ini juga tersedia dengan nama <code>RANK.EQ</code>.</p>`,
 syntax:'=RANK(B3,$B$2:$B$7)',parts:[['B3','angka yang dicari peringkatnya'],['$B$2:$B$7','semua angka pembanding, dikunci'],['[urutan]','opsional; isi 1 agar angka terkecil jadi peringkat 1']],
 task:'Isi <code>C3</code> dengan peringkat penjualan Bella. Setelah itu tekan <b>Salin ke bawah</b> untuk mengisi peringkat yang lain.',
 cols:3,rows:8,target:'C3',editable:['C3','C4','C5','C6','C7'],fill:{from:'C3',to:['C4','C5','C6','C7']},solution:'=RANK(B3,$B$2:$B$7)',use:['RANK|RANK.EQ'],
 abs:'\\$B\\$2:\\$B\\$7',absMsg:'Peringkat Bella sudah benar, tapi rentang B2:B7 belum dikunci. Coba salin ke bawah dan lihat hasilnya. Kunci rentang dengan F4.',
 hint:'C2 berisi contoh. Polanya sama, hanya angka yang dicari diganti B3.',
 data:{A1:'Sales',B1:'Unit terjual',C1:'Peringkat',A2:'Agus',B2:42,C2:'=RANK(B2,$B$2:$B$7)',A3:'Bella',B3:57,A4:'Candra',B4:38,A5:'Dina',B5:61,A6:'Eko',B6:45,A7:'Farah',B7:50}},

{id:'large-small',mod:'hitung',title:'Nilai ke-N terbesar dan terkecil',fns:'LARGE · SMALL',cert:['E3'],
 intro:`<p>MAX hanya memberi nilai terbesar. Untuk nilai terbesar kedua, ketiga, dan seterusnya, pakai <code>LARGE</code>. Kebalikannya, <code>SMALL</code> memberi nilai terkecil ke-N.</p>
 <p>Ini cara cepat membuat daftar "Top 3" atau "5 cabang terbawah" tanpa mengurutkan data aslinya.</p>`,
 syntax:'=LARGE($B$2:$B$8,D3)',parts:[['$B$2:$B$8','data yang dicari, dikunci'],['D3','urutan ke berapa, di sini 2']],
 task:'Isi <code>E3</code> dengan omzet cabang tertinggi kedua. E2 sudah berisi contoh untuk peringkat 1.',
 cols:5,rows:9,target:'E3',editable:['E3','E4'],fill:{from:'E3',to:['E4']},solution:'=LARGE($B$2:$B$8,D3)',use:['LARGE'],
 hint:'Pakai D3 sebagai urutan, jangan angka 2 langsung, supaya rumusnya bisa disalin ke E4.',
 data:{A1:'Cabang',B1:'Omzet (juta)',A2:'Bandung',B2:412,A3:'Medan',B3:388,A4:'Makassar',B4:295,A5:'Semarang',B5:341,A6:'Denpasar',B6:276,A7:'Palembang',B7:359,A8:'Balikpapan',B8:318,D1:'Peringkat',E1:'Omzet',D2:1,E2:'=LARGE($B$2:$B$8,D2)',D3:2,D4:3}},

/* ================= BERSYARAT ================= */
{id:'sumif',mod:'syarat',title:'Menjumlah dengan satu syarat',fns:'SUMIF',cert:['E3'],
 intro:`<p><code>SUMIF</code> hanya menjumlahkan baris yang memenuhi kriteria. Ada tiga bagian: rentang yang dicek, kriterianya, dan rentang yang dijumlahkan.</p>
 <p>Kriteria bisa berupa teks di dalam tanda kutip seperti <code>"Makanan"</code>, alamat sel yang berisi teks itu, atau perbandingan seperti <code>"&gt;50000"</code>. Untuk perbandingan dengan isi sel, gabungkan dengan &amp;: <code>"&gt;"&amp;F1</code>.</p>`,
 syntax:'=SUMIF(A2:A7,"Makanan",B2:B7)',parts:[['A2:A7','kolom yang dicek'],['"Makanan"','kriteria'],['B2:B7','kolom yang dijumlahkan']],
 task:'Isi <code>E2</code> dengan total pengeluaran untuk kategori yang tertulis di <code>D2</code>.',
 cols:5,rows:8,target:'E2',editable:['E2','D2'],solution:'=SUMIF(A2:A7,D2,B2:B7)',use:['SUMIF'],
 hint:'Kriteria boleh ditulis <code>"Makanan"</code> atau cukup <code>D2</code>. Dengan D2, kamu bisa mengganti kategori dan totalnya ikut berubah.',
 data:{A1:'Kategori',B1:'Jumlah',A2:'Makanan',B2:45000,A3:'Transport',B3:20000,A4:'Makanan',B4:32000,A5:'Hiburan',B5:75000,A6:'Makanan',B6:58000,A7:'Transport',B7:15000,D1:'Kategori',D2:'Makanan',E1:'Total'}},

{id:'countif',mod:'syarat',title:'Menghitung dengan satu syarat',fns:'COUNTIF',cert:['E3'],
 intro:`<p><code>COUNTIF</code> menghitung berapa sel dalam rentang yang cocok dengan kriteria. Bagiannya hanya dua: rentang dan kriteria.</p>
 <p>Tanda bintang menggantikan karakter apa saja. <code>"Rekap*"</code> cocok dengan semua teks yang diawali kata Rekap. Huruf besar dan kecil dianggap sama.</p>`,
 syntax:'=COUNTIF(B2:B8,"Selesai")',parts:[['B2:B8','rentang yang diperiksa'],['"Selesai"','kriteria']],
 task:'Isi <code>B9</code> dengan jumlah pekerjaan bagian keuangan yang statusnya Selesai.',
 cols:3,rows:10,target:'B9',solution:'=COUNTIF(B2:B8,"Selesai")',use:['COUNTIF'],bold:['A9'],
 hint:'Kriteria teks ditulis di dalam tanda kutip ganda: <code>"Selesai"</code>.',
 data:{A1:'Pekerjaan',B1:'Status',A2:'Rekap kas bulanan',B2:'Selesai',A3:'Rekonsiliasi bank',B3:'Proses',A4:'Laporan pajak',B4:'Selesai',A5:'Input faktur',B5:'Selesai',A6:'Audit stok',B6:'Tertunda',A7:'Jadwal gaji',B7:'Proses',A8:'Arsip nota',B8:'Selesai',A9:'Jumlah selesai'}},

{id:'sumifs',mod:'syarat',title:'Banyak syarat sekaligus',fns:'SUMIFS · COUNTIFS · AVERAGEIFS',cert:['E3'],
 intro:`<p>Kalau syaratnya lebih dari satu, misalnya kategori Makanan <em>dan</em> bulan Januari, pakai <code>SUMIFS</code>. Pasangan rentang dan kriteria bisa ditambah sebanyak yang diperlukan.</p>
 <p>Perhatikan urutannya. Di SUMIFS, rentang yang dijumlahkan ditulis paling depan, berbeda dengan SUMIF. <code>COUNTIFS</code> dan <code>AVERAGEIFS</code> memakai pola yang sama.</p>`,
 syntax:'=SUMIFS(C2:C9,A2:A9,E2,B2:B9,F2)',parts:[['C2:C9','yang dijumlahkan, paling depan'],['A2:A9, E2','syarat pertama: kategori'],['B2:B9, F2','syarat kedua: bulan']],
 task:'Isi <code>G2</code> dengan total pengeluaran untuk kategori di E2 pada bulan di F2. Setelah benar, coba ganti F2 menjadi Feb.',
 cols:7,rows:10,target:'G2',editable:['G2','E2','F2'],solution:'=SUMIFS(C2:C9,A2:A9,E2,B2:B9,F2)',use:['SUMIFS'],
 hint:'Mulai dengan <code>=SUMIFS(C2:C9,</code> lalu tambahkan pasangan kategori dan pasangan bulan.',
 data:{A1:'Kategori',B1:'Bulan',C1:'Jumlah',A2:'Makanan',B2:'Jan',C2:45000,A3:'Transport',B3:'Jan',C3:20000,A4:'Makanan',B4:'Feb',C4:52000,A5:'Makanan',B5:'Jan',C5:38000,A6:'Hiburan',B6:'Feb',C6:75000,A7:'Makanan',B7:'Feb',C7:41000,A8:'Transport',B8:'Feb',C8:18000,A9:'Makanan',B9:'Jan',C9:27000,E1:'Kategori',F1:'Bulan',G1:'Total',E2:'Makanan',F2:'Jan'}},

{id:'maxifs',mod:'syarat',title:'Nilai tertinggi dan terendah bersyarat',fns:'MAXIFS · MINIFS',cert:['E3'],
 intro:`<p><code>MAXIFS</code> mencari nilai terbesar hanya di antara baris yang memenuhi syarat. <code>MINIFS</code> mencari yang terkecil. Urutan argumennya sama seperti SUMIFS: rentang nilai di depan, lalu pasangan rentang dan kriteria.</p>
 <p>Contoh pemakaiannya: penjualan terbaik per cabang, harga termurah dari vendor tertentu, atau tanggal transaksi terakhir per pelanggan.</p>`,
 syntax:'=MAXIFS(C2:C9,A2:A9,F1)',parts:[['C2:C9','nilai yang dicari maksimumnya'],['A2:A9, F1','hanya baris dengan cabang = F1']],
 note:'<b>Catatan versi:</b> MAXIFS dan MINIFS tersedia mulai Excel 2019 dan Microsoft 365.',
 task:'Isi <code>F2</code> dengan penjualan tertinggi di cabang yang tertulis di <code>F1</code>. Setelah benar, ganti F1 menjadi Bandung.',
 cols:6,rows:10,target:'F2',editable:['F2','F1'],solution:'=MAXIFS(C2:C9,A2:A9,F1)',use:['MAXIFS'],bold:['E1','E2'],
 hint:'Polanya: <code>=MAXIFS(nilai, rentang_cabang, cabang_yang_dicari)</code>.',
 data:{A1:'Cabang',B1:'Sales',C1:'Penjualan (unit)',A2:'Jakarta',B2:'Rina',C2:58,A3:'Bandung',B3:'Yusuf',C3:44,A4:'Jakarta',B4:'Maya',C4:71,A5:'Surabaya',B5:'Hendra',C5:39,A6:'Bandung',B6:'Sari',C6:62,A7:'Jakarta',B7:'Teguh',C7:49,A8:'Surabaya',B8:'Lestari',C8:55,A9:'Bandung',B9:'Dimas',C9:47,E1:'Cabang',F1:'Jakarta',E2:'Tertinggi'}},

/* ================= LOGIKA ================= */
{id:'if',mod:'logika',title:'Keputusan dengan IF',fns:'IF',cert:['A4','E3'],
 intro:`<p><code>IF</code> memeriksa sebuah kondisi, lalu memberi satu hasil kalau kondisinya benar dan hasil lain kalau salah.</p>
 <p>Operator pembandingnya: <code>=</code> sama dengan, <code>&lt;&gt;</code> tidak sama dengan, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, dan <code>&gt;=</code>. Teks di dalam rumus selalu diapit tanda kutip ganda.</p>`,
 syntax:'=IF(B4>=75,"Lulus","Remedial")',parts:[['B4>=75','kondisi yang diperiksa'],['"Lulus"','hasil jika benar'],['"Remedial"','hasil jika salah']],
 task:'Nilai minimal lulus (KKM) adalah 75. Isi <code>C4</code> dengan status Citra. C2 dan C3 sudah berisi contoh.',
 cols:3,rows:5,target:'C4',solution:'=IF(B4>=75,"Lulus","Remedial")',use:['IF'],
 hint:'Nilai Citra tepat 75, jadi dia lulus. Pakai <code>&gt;=</code>, bukan <code>&gt;</code>.',
 data:{A1:'Siswa',B1:'Nilai',C1:'Status',A2:'Andi',B2:82,C2:'=IF(B2>=75,"Lulus","Remedial")',A3:'Bunga',B3:68,C3:'=IF(B3>=75,"Lulus","Remedial")',A4:'Citra',B4:75}},

{id:'if-bertingkat',mod:'logika',title:'IF bertingkat',fns:'IF(IF(IF()))',cert:['E3'],
 intro:`<p>Satu IF hanya punya dua kemungkinan hasil. Untuk lebih dari dua, taruh IF baru di bagian "jika salah". Excel memeriksa dari kiri ke kanan dan berhenti di kondisi pertama yang benar.</p>
 <p>Karena itu urutannya penting. Mulai dari batas tertinggi: cek 85 dulu, lalu 70, lalu 55. Jumlah kurung tutup di akhir sama dengan jumlah IF.</p>`,
 syntax:'=IF(B3>=85,"A",IF(B3>=70,"B",IF(B3>=55,"C","D")))',parts:[['IF(B3>=85,"A",','kalau 85 ke atas, langsung A'],['IF(B3>=70,"B",','sisanya: 70 ke atas dapat B'],['IF(B3>=55,"C","D")','sisanya: C atau D'],[')))','tiga IF, tiga kurung tutup']],
 task:'Isi <code>C3</code> dengan predikat Bunga sesuai tabel di sebelah kanan.',
 cols:6,rows:5,target:'C3',editable:['C3','C4'],solution:'=IF(B3>=85,"A",IF(B3>=70,"B",IF(B3>=55,"C","D")))',use:['IF|IFS'],bold:['E1','F1'],
 test:raw=>/\bIFS\s*\(/i.test(raw)||(raw.match(/\bIF\s*\(/gi)||[]).length>=3?null:'Hasil untuk Bunga sudah tepat, tapi ada empat predikat (A sampai D), jadi rumusnya perlu tiga IF supaya berlaku untuk nilai berapa pun.',
 hint:'Lihat rumus contoh di C2, lalu ganti B2 menjadi B3 di ketiga tempat.',
 data:{A1:'Siswa',B1:'Nilai',C1:'Predikat',A2:'Andi',B2:91,C2:'=IF(B2>=85,"A",IF(B2>=70,"B",IF(B2>=55,"C","D")))',A3:'Bunga',B3:72,A4:'Citra',B4:48,E1:'Nilai minimal',F1:'Predikat',E2:85,F2:'A',E3:70,F3:'B',E4:55,F4:'C',E5:0,F5:'D'}},

{id:'ifs-switch',mod:'logika',title:'IFS dan SWITCH',fns:'IFS · SWITCH',cert:['E3'],
 intro:`<p><code>IFS</code> menulis beberapa kondisi tanpa IF bersarang: <code>=IFS(B2&gt;=85,"A",B2&gt;=70,"B",TRUE,"C")</code>. Kondisi terakhir <code>TRUE</code> berfungsi sebagai "selain itu".</p>
 <p><code>SWITCH</code> cocok untuk mencocokkan satu nilai dengan daftar pilihan, misalnya kode menjadi nama. Argumen terakhir yang tidak berpasangan menjadi hasil kalau tidak ada yang cocok.</p>`,
 syntax:'=SWITCH(A3,"JKT","Jakarta","SBY","Surabaya","BDG","Bandung","Lainnya")',parts:[['A3','nilai yang dicocokkan'],['"JKT","Jakarta"','pasangan: kalau JKT, hasilnya Jakarta'],['"Lainnya"','hasil kalau tidak ada yang cocok']],
 note:'<b>Catatan versi:</b> IFS dan SWITCH tersedia mulai Excel 2019 dan Microsoft 365.',
 task:'Isi <code>B3</code> dengan nama cabang untuk kode di A3. Gunakan SWITCH seperti contoh di B2.',
 cols:3,rows:6,target:'B3',editable:['B3','B4','B5'],fill:{from:'B3',to:['B4','B5']},solution:'=SWITCH(A3,"JKT","Jakarta","SBY","Surabaya","BDG","Bandung","Lainnya")',use:['SWITCH'],
 hint:'Salin rumus dari B2, lalu ganti A2 menjadi A3. Setelah benar, salin ke bawah: MDN akan menjadi "Lainnya".',
 data:{A1:'Kode cabang',B1:'Nama cabang',A2:'JKT',B2:'=SWITCH(A2,"JKT","Jakarta","SBY","Surabaya","BDG","Bandung","Lainnya")',A3:'SBY',A4:'BDG',A5:'MDN'}},

{id:'and-or',mod:'logika',title:'Menggabung syarat dengan AND dan OR',fns:'AND · OR · NOT',cert:['E3'],
 intro:`<p><code>AND</code> bernilai TRUE hanya kalau semua syaratnya terpenuhi. <code>OR</code> bernilai TRUE kalau salah satu saja terpenuhi. <code>NOT</code> membalik TRUE menjadi FALSE dan sebaliknya.</p>
 <p>Ketiganya biasanya ditaruh di bagian kondisi milik IF.</p>`,
 syntax:'=IF(AND(C3>=B3,D3>=20),"Dapat","Tidak")',parts:[['C3>=B3','syarat 1: realisasi mencapai target'],['D3>=20','syarat 2: hadir minimal 20 hari'],['AND(…)','TRUE kalau keduanya terpenuhi']],
 task:'Bonus diberikan kalau target tercapai <em>dan</em> kehadiran minimal 20 hari. Isi <code>E3</code> untuk Bella.',
 cols:5,rows:5,target:'E3',editable:['E3','E4'],solution:'=IF(AND(C3>=B3,D3>=20),"Dapat","Tidak")',use:['AND'],
 hint:'Penjualan Bella melampaui target, tetapi kehadirannya 18 hari. Karena memakai AND, hasilnya tetap Tidak.',
 data:{A1:'Sales',B1:'Target',C1:'Realisasi',D1:'Hari hadir',E1:'Bonus',A2:'Agus',B2:40,C2:46,D2:22,E2:'=IF(AND(C2>=B2,D2>=20),"Dapat","Tidak")',A3:'Bella',B3:40,C3:52,D3:18,A4:'Candra',B4:35,C4:35,D4:21}},

{id:'iferror',mod:'logika',title:'Menangani error dengan IFERROR',fns:'IFERROR · IFNA',cert:['E3'],
 intro:`<p>Rumus bisa menghasilkan error, misalnya <code>#DIV/0!</code> saat membagi dengan nol atau <code>#N/A</code> saat data tidak ditemukan. Di laporan, error seperti ini mengganggu dan bisa merusak rumus lain yang merujuk ke sel tersebut.</p>
 <p><code>IFERROR</code> menjalankan rumus seperti biasa; kalau hasilnya error, nilai pengganti yang dipakai. <code>IFNA</code> hanya menangkap #N/A, jadi error lain seperti salah ketik tetap terlihat.</p>`,
 syntax:'=IFERROR(B3/C3,0)',parts:[['B3/C3','rumus yang mungkin error'],['0','nilai pengganti kalau error']],
 task:'Sandal belum terjual sama sekali, jadi <code>=B3/C3</code> menghasilkan #DIV/0!. Isi <code>D3</code> dengan harga rata-rata yang menampilkan 0 kalau terjadi error.',
 cols:4,rows:5,target:'D3',solution:'=IFERROR(B3/C3,0)',use:['IFERROR'],
 hint:'Bungkus rumus pembagiannya: <code>=IFERROR(</code> rumus <code>,0)</code>.',
 data:{A1:'Produk',B1:'Pendapatan',C1:'Unit terjual',D1:'Harga rata-rata',A2:'Kaos',B2:2400000,C2:30,D2:'=B2/C2',A3:'Sandal',B3:0,C3:0,A4:'Tas',B4:1950000,C4:13,D4:'=B4/C4'}},

/* ================= TEKS ================= */
{id:'gabung-teks',mod:'teks',title:'Menggabungkan teks',fns:'& · CONCAT · TEXTJOIN',cert:['A4'],
 intro:`<p>Operator <code>&amp;</code> menyambung isi beberapa sel atau teks menjadi satu. <code>=A2&amp;B2</code> menempelkan isi A2 dan B2 tanpa jarak.</p>
 <p>Spasi juga termasuk teks, jadi perlu ditulis di dalam tanda kutip: <code>" "</code>. Fungsi <code>CONCAT</code> (dulu <code>CONCATENATE</code>) memberi hasil yang sama.</p>`,
 syntax:'=A2&" "&B2',parts:[['A2','nama depan'],['" "','satu spasi di antara keduanya'],['B2','nama belakang']],
 task:'Isi <code>C2</code> dengan nama lengkap: nama depan, spasi, lalu nama belakang.',
 cols:3,rows:4,target:'C2',solution:'=A2&" "&B2',use:['&|CONCAT|CONCATENATE'],caseSensitive:true,
 hint:'Kalau hasilnya "SitiRahma", spasinya belum ada. Tambahkan <code>&amp;" "&amp;</code> di antara A2 dan B2.',
 data:{A1:'Nama depan',B1:'Nama belakang',C1:'Nama lengkap',A2:'Siti',B2:'Rahma',A3:'Budi',B3:'Santoso',C3:'=A3&" "&B3'}},

{id:'textjoin',mod:'teks',title:'Menggabung daftar dengan pemisah',fns:'TEXTJOIN',cert:['A4'],
 intro:`<p><code>TEXTJOIN</code> menggabungkan seluruh isi rentang dengan pemisah yang kamu tentukan. Argumen kedua <code>TRUE</code> berarti sel kosong dilewati, jadi tidak ada koma ganda di hasilnya.</p>
 <p>Berguna untuk membuat daftar penerima email, daftar peserta rapat, atau ringkasan kode barang dalam satu sel.</p>`,
 syntax:'=TEXTJOIN(", ",TRUE,A2:A7)',parts:[['", "','pemisah: koma dan spasi'],['TRUE','lewati sel kosong'],['A2:A7','teks yang digabung']],
 task:'Isi <code>C2</code> dengan daftar peserta rapat dalam satu sel, dipisah koma dan spasi.',
 cols:3,rows:8,target:'C2',solution:'=TEXTJOIN(", ",TRUE,A2:A7)',use:['TEXTJOIN'],caseSensitive:true,
 hint:'Pemisahnya <code>", "</code>, yaitu koma lalu spasi, di dalam tanda kutip.',
 data:{A1:'Peserta rapat',C1:'Daftar undangan',A2:'Rina',A3:'Yusuf',A5:'Maya',A6:'Hendra'}},

{id:'left-mid-right',mod:'teks',title:'Mengambil sebagian teks',fns:'LEFT · MID · RIGHT',cert:['A4'],
 intro:`<p><code>LEFT</code> mengambil beberapa karakter dari kiri, <code>RIGHT</code> dari kanan, dan <code>MID</code> dari tengah mulai posisi tertentu. Ini berguna untuk memecah kode seperti nomor faktur.</p>
 <p>Hasil ketiga fungsi ini selalu teks, walaupun isinya angka, sehingga tampil rata kiri. Untuk mengubahnya menjadi angka, bungkus dengan <code>VALUE</code>.</p>`,
 syntax:'=MID(A2,5,4)',parts:[['A2','teks sumber'],['5','mulai dari karakter ke-5'],['4','ambil 4 karakter']],
 task:'Nomor faktur berpola <b>KOTA-TAHUN-URUT</b>. Isi <code>C2</code> dengan tahunnya.',
 cols:4,rows:4,target:'C2',editable:['C2','C3'],solution:'=MID(A2,5,4)',use:['MID'],
 hint:'J-K-T-(tanda hubung) adalah karakter 1 sampai 4, jadi tahun dimulai di karakter ke-5 dan panjangnya 4.',
 data:{A1:'Nomor faktur',B1:'Kota',C1:'Tahun',D1:'Urut',A2:'JKT-2026-0042',B2:'=LEFT(A2,3)',D2:'=RIGHT(A2,4)',A3:'SBY-2025-0107',B3:'=LEFT(A3,3)',D3:'=RIGHT(A3,4)'}},

{id:'find-substitute',mod:'teks',title:'Mencari posisi dan mengganti teks',fns:'FIND · SEARCH · SUBSTITUTE',cert:['A4'],
 intro:`<p>Kalau panjang bagian yang mau diambil berbeda-beda, posisinya perlu dicari dulu. <code>FIND</code> memberi posisi sebuah karakter di dalam teks. <code>SEARCH</code> sama, tetapi tidak membedakan huruf besar dan kecil.</p>
 <p>Gabungkan dengan MID atau LEFT: semua yang ada setelah tanda @ adalah domain email. <code>SUBSTITUTE</code> mengganti teks tertentu, misalnya <code>=SUBSTITUTE(A2,"-","")</code> membuang semua tanda hubung. Di Microsoft 365 tersedia juga <code>TEXTAFTER</code> dan <code>TEXTBEFORE</code>.</p>`,
 syntax:'=MID(A2,FIND("@",A2)+1,LEN(A2))',parts:[['FIND("@",A2)','posisi tanda @'],['+1','mulai satu karakter setelahnya'],['LEN(A2)','ambil sisanya; panjang lebih juga tidak apa-apa']],
 task:'Isi <code>C2</code> dengan domain perusahaan dari alamat email di A2. Kolom B sudah berisi contoh mengambil username.',
 cols:3,rows:4,target:'C2',editable:['C2','C3'],solution:'=MID(A2,FIND("@",A2)+1,LEN(A2))',use:['FIND|SEARCH|TEXTAFTER'],
 hint:'Lihat rumus username di B2: LEFT sampai sebelum @. Domain adalah kebalikannya.',
 data:{A1:'Email',B1:'Username',C1:'Domain',A2:'rina.wulandari@majujaya.co.id',B2:'=LEFT(A2,FIND("@",A2)-1)',A3:'hendra@sinarlogistik.com',B3:'=LEFT(A3,FIND("@",A3)-1)'}},

{id:'rapikan-teks',mod:'teks',title:'Merapikan teks',fns:'TRIM · PROPER · UPPER · LEN',cert:['A4'],
 intro:`<p>Data hasil input manual atau impor sering berantakan. <code>TRIM</code> membuang spasi di awal, akhir, dan spasi ganda. <code>PROPER</code> membuat huruf pertama setiap kata menjadi kapital.</p>
 <p><code>UPPER</code> mengubah semua huruf menjadi kapital dan <code>LOWER</code> menjadi kecil. <code>LEN</code> menghitung jumlah karakter, berguna untuk memeriksa spasi tersembunyi.</p>`,
 syntax:'=PROPER(TRIM(A2))',parts:[['TRIM(A2)','buang spasi berlebih dulu'],['PROPER(…)','lalu rapikan huruf kapitalnya']],
 task:'Isi <code>B2</code> dengan nama yang sudah rapi. Kolom C menunjukkan jumlah karakter sebelum dirapikan.',
 cols:3,rows:5,target:'B2',solution:'=PROPER(TRIM(A2))',use:['PROPER','TRIM'],caseSensitive:true,
 hint:'Fungsi boleh ditaruh di dalam fungsi lain. Yang paling dalam dihitung lebih dulu.',
 data:{A1:'Data mentah',B1:'Rapi',C1:'Panjang',A2:'  bUDI   santoso ',C2:'=LEN(A2)',A3:'SITI rahma',B3:'=PROPER(A3)',C3:'=LEN(A3)',A4:'andi pratama',B4:'=UPPER(A4)',C4:'=LEN(A4)'}},

{id:'text-format',mod:'teks',title:'Angka dan tanggal di dalam kalimat',fns:'TEXT',cert:['E3'],
 intro:`<p>Saat angka digabung dengan teks memakai &amp;, formatnya hilang. <code>="Total "&amp;B1</code> menghasilkan "Total 1250000". Fungsi <code>TEXT</code> mengubah angka menjadi teks dengan format yang kamu tentukan.</p>
 <p>Kode formatnya sama dengan format kustom: <code>#,##0</code> untuk pemisah ribuan, <code>dd/mm/yyyy</code> untuk tanggal, <code>mmmm</code> untuk nama bulan.</p>`,
 syntax:'="Rp"&TEXT(B1,"#,##0")',parts:[['"Rp"','teks awalan'],['TEXT(B1,"#,##0")','angka dengan pemisah ribuan']],
 note:'<b>Excel berbahasa Indonesia:</b> kode format di dalam TEXT juga mengikuti pengaturan wilayah, jadi bisa ditulis <code>"#.##0"</code>. Di sini kode berformat Inggris dipakai, dan hasilnya memakai titik sebagai pemisah ribuan.',
 task:'Isi <code>B4</code> dengan teks <b>Rp1.250.000</b> yang diambil dari angka di B1. Baris 5 berisi contoh untuk tanggal.',
 cols:2,rows:6,target:'B4',solution:'="Rp"&TEXT(B1,"#,##0")',use:['TEXT'],caseSensitive:true,fmt:{B2:'date'},
 hint:'Gabungkan <code>"Rp"</code> dengan TEXT memakai &amp;.',
 data:{A1:'Total tagihan',B1:1250000,A2:'Jatuh tempo',B2:D(2026,10,31),A4:'Teks nominal',A5:'Teks tanggal',B5:'="Jatuh tempo "&TEXT(B2,"dd mmmm yyyy")'}},

/* ================= TANGGAL ================= */
{id:'tanggal',mod:'tanggal',title:'Tanggal adalah angka',fns:'YEAR · MONTH · DAY · WEEKDAY',cert:['E3'],
 intro:`<p>Excel menyimpan tanggal sebagai nomor urut hari. Tanggal 1 Januari 1900 bernilai 1, dan 14 September 2026 bernilai 46279. Yang kamu lihat di sel hanyalah format tampilannya.</p>
 <p>Karena tanggal adalah angka, kamu bisa menjumlahnya dengan bilangan hari. Tanggal faktur ditambah 30 menghasilkan tanggal jatuh tempo. <code>YEAR</code>, <code>MONTH</code>, dan <code>DAY</code> mengambil bagian tahun, bulan, dan hari. <code>WEEKDAY(tanggal,2)</code> memberi 1 untuk Senin sampai 7 untuk Minggu.</p>`,
 syntax:'=B2+30',parts:[['B2','tanggal faktur'],['+30','tambah 30 hari']],
 task:'Isi <code>C2</code> dengan tanggal jatuh tempo, yaitu 30 hari setelah tanggal faktur.',
 cols:4,rows:4,target:'C2',solution:'=B2+30',fmt:{B:'date',C:'date'},
 hint:'Cukup tambahkan 30 ke sel tanggal. Excel akan menghitung pergantian bulannya sendiri.',
 data:{A1:'Faktur',B1:'Tanggal faktur',C1:'Jatuh tempo',D1:'Tahun',A2:'INV-031',B2:D(2026,9,14),D2:'=YEAR(B2)',A3:'INV-032',B3:D(2026,9,28),C3:'=B3+30',D3:'=YEAR(B3)'}},

{id:'datedif',mod:'tanggal',title:'Selisih tanggal dengan DATEDIF',fns:'DATEDIF · TODAY',cert:['E3'],
 intro:`<p>Mengurangkan dua tanggal menghasilkan selisih dalam hari. Untuk selisih dalam tahun atau bulan penuh, pakai <code>DATEDIF</code>. Kode satuannya: <code>"Y"</code> tahun, <code>"M"</code> bulan, <code>"D"</code> hari, dan <code>"YM"</code> sisa bulan setelah tahun penuh.</p>
 <p><code>TODAY()</code> menghasilkan tanggal hari ini dan berubah setiap hari. Untuk laporan per tanggal tertentu, lebih aman memakai sel berisi tanggal tetap seperti F1 di bawah.</p>`,
 syntax:'=DATEDIF(B2,$F$1,"Y")',parts:[['B2','tanggal mulai'],['$F$1','tanggal akhir, dikunci'],['"Y"','hitung dalam tahun penuh']],
 note:'<b>Catatan:</b> DATEDIF tidak muncul di daftar saran fungsi Excel, tetapi tetap bisa dipakai kalau diketik lengkap.',
 task:'Isi <code>C2</code> dengan masa kerja Rudi dalam tahun penuh, dihitung sampai tanggal di F1.',
 cols:6,rows:4,target:'C2',solution:'=DATEDIF(B2,$F$1,"Y")',use:['DATEDIF'],fmt:{B:'date',F1:'date'},bold:['E1'],
 hint:'Tanggal mulai harus lebih awal dari tanggal akhir. Kalau terbalik, hasilnya #NUM!.',
 data:{A1:'Karyawan',B1:'Tanggal masuk',C1:'Masa kerja (th)',D1:'Sisa bulan',A2:'Rudi',B2:D(2019,3,15),D2:'=DATEDIF(B2,$F$1,"YM")',A3:'Wulan',B3:D(2023,7,1),C3:'=DATEDIF(B3,$F$1,"Y")',D3:'=DATEDIF(B3,$F$1,"YM")',E1:'Per tanggal',F1:D(2026,12,31)}},

{id:'eomonth-edate',mod:'tanggal',title:'Akhir bulan dan tambah bulan',fns:'EOMONTH · EDATE',cert:['E3'],
 intro:`<p>Banyak termin pembayaran berbunyi "akhir bulan berikutnya". <code>EOMONTH(tanggal,1)</code> memberi tanggal terakhir bulan berikutnya. Angka 0 berarti akhir bulan yang sama, -1 berarti akhir bulan sebelumnya.</p>
 <p><code>EDATE(tanggal,6)</code> menambah 6 bulan dengan tanggal yang sama, berguna untuk masa kontrak, garansi, atau jadwal servis. Kalau tanggalnya tidak ada di bulan tujuan, misalnya 31 Agustus + 1 bulan, hasilnya tanggal terakhir bulan itu.</p>`,
 syntax:'=EOMONTH(B2,1)',parts:[['B2','tanggal awal'],['1','geser 1 bulan, lalu ambil tanggal terakhirnya']],
 task:'Termin pembayaran vendor adalah akhir bulan berikutnya. Isi <code>C2</code> dengan tanggal jatuh temponya.',
 cols:4,rows:4,target:'C2',editable:['C2','C3'],fill:{from:'C2',to:['C3']},solution:'=EOMONTH(B2,1)',use:['EOMONTH'],fmt:{B:'date',C:'date',D:'date'},
 hint:'Faktur 14 September dengan termin akhir bulan berikutnya jatuh tempo 31 Oktober.',
 data:{A1:'Faktur',B1:'Tanggal faktur',C1:'Jatuh tempo',D1:'Akhir garansi (6 bln)',A2:'PO-118',B2:D(2026,9,14),D2:'=EDATE(B2,6)',A3:'PO-119',B3:D(2026,8,31),D3:'=EDATE(B3,6)'}},

{id:'networkdays',mod:'tanggal',title:'Menghitung hari kerja',fns:'NETWORKDAYS · WORKDAY',cert:['E3'],
 intro:`<p><code>NETWORKDAYS</code> menghitung jumlah hari kerja (Senin sampai Jumat) di antara dua tanggal, termasuk tanggal awal dan akhir. Argumen ketiga berisi daftar tanggal libur yang ikut dikecualikan.</p>
 <p><code>WORKDAY(mulai,10,libur)</code> melakukan kebalikannya: mencari tanggal setelah 10 hari kerja, cocok untuk menghitung tenggat SLA. Untuk kantor yang libur di hari selain Sabtu-Minggu, pakai versi <code>.INTL</code>.</p>`,
 syntax:'=NETWORKDAYS(B2,C2,$F$2:$F$3)',parts:[['B2, C2','tanggal mulai dan selesai'],['$F$2:$F$3','daftar tanggal libur, dikunci']],
 task:'Isi <code>D2</code> dengan jumlah hari kerja proyek migrasi data, dengan memperhitungkan libur di kolom F.',
 cols:6,rows:4,target:'D2',solution:'=NETWORKDAYS(B2,C2,$F$2:$F$3)',use:['NETWORKDAYS'],fmt:{B:'date',C:'date',F:'date'},bold:['F1'],
 hint:'Tanpa daftar libur hasilnya 15. Dengan dua hari libur di hari kerja, hasilnya berkurang.',
 data:{A1:'Pekerjaan',B1:'Mulai',C1:'Selesai',D1:'Hari kerja',A2:'Migrasi data',B2:D(2026,10,5),C2:D(2026,10,23),A3:'Uji sistem',B3:D(2026,10,26),C3:D(2026,11,6),D3:'=NETWORKDAYS(B3,C3,$F$2:$F$3)',F1:'Libur kantor (contoh)',F2:D(2026,10,15),F3:D(2026,10,16)}},

/* ================= MENCARI DATA ================= */
{id:'vlookup',mod:'cari',title:'Mencari data dengan VLOOKUP',fns:'VLOOKUP',cert:['E3'],
 intro:`<p><code>VLOOKUP</code> mencari sebuah nilai di kolom paling kiri tabel, lalu mengambil data dari kolom lain di baris yang sama.</p>
 <p>Isi argumen terakhir dengan <code>FALSE</code> agar hanya kecocokan persis yang diterima. Tanpa itu, VLOOKUP mencari kecocokan terdekat dan bisa memberi hasil salah tanpa peringatan.</p>`,
 syntax:'=VLOOKUP(E2,A2:C5,3,FALSE)',parts:[['E2','nilai yang dicari'],['A2:C5','tabel; kolom pertamanya tempat mencari'],['3','nomor kolom yang diambil'],['FALSE','harus cocok persis']],
 task:'Isi <code>F2</code> dengan harga produk yang kodenya ada di <code>E2</code>. Setelah benar, ganti E2 menjadi P01.',
 cols:6,rows:6,target:'F2',editable:['F2','E2'],solution:'=VLOOKUP(E2,A2:C5,3,FALSE)',use:['VLOOKUP'],
 hint:'Harga ada di kolom ketiga tabel. Kolom dihitung dari kiri tabel: A = 1, B = 2, C = 3.',
 data:{A1:'Kode',B1:'Produk',C1:'Harga',A2:'P01',B2:'Teh botol',C2:5000,A3:'P02',B3:'Roti tawar',C3:16000,A4:'P03',B4:'Susu UHT',C4:7500,A5:'P04',B5:'Mi instan',C5:3500,E1:'Kode',E2:'P03',F1:'Harga'}},

{id:'vlookup-tarif',mod:'cari',title:'Tabel tarif bertingkat',fns:'VLOOKUP … TRUE',cert:['E3'],
 intro:`<p>Komisi, diskon grosir, dan tarif berjenjang biasanya disusun sebagai tabel batas bawah. VLOOKUP dengan argumen terakhir <code>TRUE</code> mencari batas terbesar yang masih lebih kecil atau sama dengan nilai yang dicari.</p>
 <p>Syaratnya, kolom pertama tabel harus urut dari kecil ke besar dan dimulai dari 0. Cara ini jauh lebih mudah dirawat daripada IF bertingkat, karena perubahan tarif cukup dilakukan di tabel.</p>`,
 syntax:'=VLOOKUP(B2,$E$2:$F$5,2,TRUE)',parts:[['B2','penjualan sales'],['$E$2:$F$5','tabel batas bawah dan tarif, dikunci'],['TRUE','cari batas terdekat di bawahnya']],
 task:'Isi <code>C2</code> dengan persentase komisi Agus, lalu salin ke bawah.',
 cols:6,rows:6,target:'C2',editable:['C2','C3','C4'],fill:{from:'C2',to:['C3','C4']},solution:'=VLOOKUP(B2,$E$2:$F$5,2,TRUE)',use:['VLOOKUP'],fmt:{C:'pct',F:'pct'},bold:['E1','F1'],
 abs:'\\$E\\$2:\\$F\\$5',absMsg:'Komisi Agus sudah benar, tapi tabel tarif belum dikunci, jadi rumusnya akan rusak saat disalin. Kunci dengan F4.',
 hint:'Penjualan Agus 136,5 juta berada di antara batas 100 juta dan 200 juta, jadi tarifnya 3,5%.',
 data:{A1:'Sales',B1:'Penjualan',C1:'Komisi',A2:'Agus',B2:136500000,A3:'Bella',B3:48000000,A4:'Candra',B4:212000000,E1:'Batas bawah',F1:'Tarif',E2:0,F2:0,E3:50000000,F3:0.02,E4:100000000,F4:0.035,E5:200000000,F5:0.05}},

{id:'index-match',mod:'cari',title:'INDEX dan MATCH',fns:'INDEX · MATCH',cert:['E3'],
 intro:`<p>VLOOKUP hanya bisa mencari ke kanan. Kalau kunci pencarian ada di kolom kanan dan hasilnya di kolom kiri, pakai pasangan <code>INDEX</code> dan <code>MATCH</code>.</p>
 <p><code>MATCH</code> mencari posisi sebuah nilai di dalam satu kolom. <code>INDEX</code> mengambil isi kolom lain pada posisi tersebut. Angka 0 di MATCH berarti harus cocok persis.</p>`,
 syntax:'=INDEX(A2:A6,MATCH(E2,B2:B6,0))',parts:[['MATCH(E2,B2:B6,0)','posisi nama E2 di kolom B, misalnya 4'],['INDEX(A2:A6, …)','ambil isi kolom A di posisi itu']],
 task:'Isi <code>F2</code> dengan kode karyawan yang namanya tertulis di <code>E2</code>.',
 cols:6,rows:7,target:'F2',editable:['F2','E2'],solution:'=INDEX(A2:A6,MATCH(E2,B2:B6,0))',use:['INDEX','MATCH'],
 hint:'Coba MATCH dulu: <code>=MATCH(E2,B2:B6,0)</code> menghasilkan 4. Setelah itu bungkus dengan INDEX.',
 data:{A1:'Kode',B1:'Nama',C1:'Divisi',A2:'K-101',B2:'Arif',C2:'Keuangan',A3:'K-102',B3:'Dewi',C3:'Pemasaran',A4:'K-103',B4:'Rizky',C4:'Operasional',A5:'K-104',B5:'Nadia',C5:'Keuangan',A6:'K-105',B6:'Bayu',C6:'TI',E1:'Nama',E2:'Nadia',F1:'Kode'}},

{id:'xlookup',mod:'cari',title:'XLOOKUP',fns:'XLOOKUP',cert:['E3'],
 intro:`<p><code>XLOOKUP</code> menggantikan VLOOKUP dan INDEX-MATCH dengan satu fungsi. Kamu menyebut kolom pencarian dan kolom hasil secara terpisah, jadi arah pencarian bebas. Secara bawaan ia mencari kecocokan persis.</p>
 <p>Argumen keempat adalah teks yang ditampilkan kalau data tidak ditemukan, jadi tidak perlu IFERROR lagi.</p>`,
 syntax:'=XLOOKUP(E2,A2:A5,C2:C5,"Tidak ada")',parts:[['E2','nilai yang dicari'],['A2:A5','kolom tempat mencari'],['C2:C5','kolom hasil'],['"Tidak ada"','hasil kalau tidak ditemukan']],
 note:'<b>Catatan versi:</b> XLOOKUP tersedia di Excel 2021, Excel 2024, dan Microsoft 365. Di Excel 2019 ke bawah, pakai VLOOKUP atau INDEX-MATCH.',
 task:'Isi <code>F2</code> dengan stok barang yang kodenya ada di E2. Setelah benar, ganti E2 menjadi B-09.',
 cols:6,rows:6,target:'F2',editable:['F2','E2'],solution:'=XLOOKUP(E2,A2:A5,C2:C5,"Tidak ada")',use:['XLOOKUP'],
 hint:'Tiga argumen pertama wajib: yang dicari, kolom pencarian, kolom hasil. Argumen keempat opsional.',
 data:{A1:'Kode',B1:'Barang',C1:'Stok',A2:'B-01',B2:'Beras 5 kg',C2:24,A3:'B-02',B3:'Minyak 2 L',C3:40,A4:'B-03',B4:'Gula 1 kg',C4:15,A5:'B-04',B5:'Tepung 1 kg',C5:32,E1:'Kode',E2:'B-03',F1:'Stok'}},
];
}

// Bagian B: Array dinamis sampai VBA
{
const D=XL.D;
LESSONS.push(
/* ================= ARRAY DINAMIS ================= */
{id:'filter',mod:'array',title:'Menyaring data dengan FILTER',fns:'FILTER',cert:['E3'],
 intro:`<p>Di Excel 365, satu rumus bisa menghasilkan banyak nilai sekaligus. Hasilnya "tumpah" (spill) ke sel-sel di sebelahnya. <code>FILTER</code> mengambil semua baris yang memenuhi kondisi, dan hasilnya otomatis berubah saat data atau kondisinya berubah.</p>
 <p>Kalau ada sel yang menghalangi area tumpahan, hasilnya <code>#SPILL!</code>. Kosongkan sel penghalang itu. Untuk dua kondisi sekaligus, kalikan keduanya: <code>(B2:B9="Jakarta")*(C2:C9&gt;50)</code>.</p>`,
 syntax:'=FILTER(A2:C9,B2:B9=F1)',parts:[['A2:C9','data yang diambil'],['B2:B9=F1','kondisi per baris: kota sama dengan F1'],['[jika_kosong]','opsional, teks kalau tidak ada yang cocok']],
 note:'<b>Catatan versi:</b> FILTER, SORT, UNIQUE, dan LET tersedia di Excel 2021, Excel 2024, dan Microsoft 365.',
 task:'Isi <code>E3</code> dengan semua data sales di kota yang tertulis di <code>F1</code>. Setelah benar, ganti F1 menjadi Bandung dan perhatikan hasilnya.',
 cols:7,rows:10,target:'E3',editable:['E3','F1'],solution:'=FILTER(A2:C9,B2:B9=F1)',use:['FILTER'],bold:['E1','E2','F2','G2'],
 hint:'Cukup satu rumus di E3. Baris dan kolom berikutnya terisi sendiri.',
 data:{A1:'Nama',B1:'Kota',C1:'Penjualan',A2:'Rina',B2:'Jakarta',C2:58,A3:'Yusuf',B3:'Bandung',C3:44,A4:'Maya',B4:'Jakarta',C4:71,A5:'Hendra',B5:'Surabaya',C5:39,A6:'Sari',B6:'Bandung',C6:62,A7:'Teguh',B7:'Jakarta',C7:49,A8:'Lestari',B8:'Surabaya',C8:55,A9:'Dimas',B9:'Bandung',C9:47,E1:'Kota:',F1:'Jakarta',E2:'Nama',F2:'Kota',G2:'Penjualan'}},

{id:'sort-unique',mod:'array',title:'Daftar unik yang terurut',fns:'SORT · UNIQUE · SORTBY',cert:['A4','E3'],
 intro:`<p><code>UNIQUE</code> mengambil nilai tanpa duplikat, dan <code>SORT</code> mengurutkannya. Digabung, keduanya membuat daftar pilihan yang selalu rapi, misalnya daftar kota untuk dropdown atau daftar pelanggan untuk laporan.</p>
 <p><code>SORT(data,2,-1)</code> mengurutkan berdasarkan kolom ke-2 dari besar ke kecil. <code>SORTBY</code> mengurutkan berdasarkan kolom lain yang tidak ikut ditampilkan.</p>`,
 syntax:'=SORT(UNIQUE(A2:A10))',parts:[['UNIQUE(A2:A10)','ambil setiap kota sekali saja'],['SORT(…)','urutkan A sampai Z']],
 task:'Isi <code>C2</code> dengan daftar kota tanpa duplikat, urut abjad.',
 cols:5,rows:11,target:'C2',solution:'=SORT(UNIQUE(A2:A10))',use:['SORT','UNIQUE'],bold:['E1'],
 hint:'Bungkus UNIQUE dengan SORT. Hasilnya akan tumpah ke bawah mulai C2.',
 data:{A1:'Kota pengiriman',C1:'Daftar kota',E1:'Jumlah kota unik',E2:'=COUNTA(UNIQUE(A2:A10))',A2:'Jakarta',A3:'Bandung',A4:'Jakarta',A5:'Surabaya',A6:'Medan',A7:'Bandung',A8:'Jakarta',A9:'Makassar',A10:'Surabaya'}},

{id:'let',mod:'array',title:'Rumus yang mudah dibaca dengan LET',fns:'LET · LAMBDA',cert:['E3'],
 intro:`<p>Rumus panjang sering mengulang bagian yang sama. <code>LET</code> memberi nama pada hasil antara, lalu nama itu dipakai di bagian akhir rumus. Rumusnya jadi lebih pendek, lebih mudah dibaca, dan dihitung lebih cepat karena setiap bagian hanya dihitung sekali.</p>
 <p>Langkah berikutnya adalah <code>LAMBDA</code>, yang membuat fungsi buatanmu sendiri. Simpan di <b>Formulas › Name Manager</b> dengan nama misalnya <code>HARGANETTO</code>, isi <code>=LAMBDA(harga,diskon,harga*(1-diskon)*1.11)</code>, lalu pakai seperti fungsi biasa: <code>=HARGANETTO(B1,B3)</code>.</p>`,
 syntax:'=LET(sub,B1*B2,net,sub*(1-B3),net*(1+B4))',parts:[['sub, B1*B2','nama "sub" berisi harga × qty'],['net, sub*(1-B3)','nama "net" berisi sub setelah diskon'],['net*(1+B4)','perhitungan akhir memakai nama tadi']],
 task:'Isi <code>B6</code> dengan total bayar: harga × qty, dikurangi diskon, lalu ditambah pajak. Gunakan LET.',
 cols:2,rows:7,target:'B6',solution:'=LET(sub,B1*B2,net,sub*(1-B3),net*(1+B4))',use:['LET'],fmt:{B3:'pct',B4:'pct'},bold:['A6'],
 hint:'Nama bebas, asal tidak mirip alamat sel. Hindari nama seperti <code>a1</code> atau <code>tot2</code>.',
 data:{A1:'Harga satuan',B1:850000,A2:'Qty',B2:12,A3:'Diskon',B3:0.05,A4:'Pajak (contoh)',B4:0.11,A6:'Total bayar'}},

/* ================= KEUANGAN ================= */
{id:'pmt',mod:'keuangan',title:'Menghitung cicilan dengan PMT',fns:'PMT · PV · FV',cert:['E3'],
 intro:`<p><code>PMT</code> menghitung angsuran tetap per periode untuk pinjaman dengan bunga efektif (anuitas). Bunga dan jumlah periode harus memakai satuan yang sama. Untuk cicilan bulanan, bagi bunga tahunan dengan 12 dan kalikan tenor tahun dengan 12.</p>
 <p>Hasil PMT bertanda negatif karena dianggap uang keluar. Beri tanda minus di depan pokok pinjaman supaya hasilnya positif. <code>PV</code> menghitung kebalikannya: berapa pinjaman maksimal untuk cicilan tertentu. <code>FV</code> menghitung nilai tabungan di masa depan.</p>`,
 syntax:'=PMT(B2/12,B3*12,-B1)',parts:[['B2/12','bunga per bulan'],['B3*12','jumlah bulan'],['-B1','pokok pinjaman, diberi minus']],
 note:'<b>Bunga flat vs efektif:</b> banyak leasing kendaraan menyebut bunga flat. Bunga flat tidak bisa dimasukkan langsung ke PMT; hitungannya cukup (pokok + pokok × bunga × tahun) ÷ jumlah bulan.',
 task:'Isi <code>B5</code> dengan cicilan per bulan untuk pinjaman di B1.',
 cols:2,rows:8,target:'B5',solution:'=PMT(B2/12,B3*12,-B1)',use:['PMT'],fmt:{B2:'pct'},bold:['A5'],
 hint:'Kalau hasilnya negatif, tambahkan minus di depan B1.',
 test:raw=>null,
 data:{A1:'Pokok pinjaman',B1:180000000,A2:'Bunga efektif per tahun',B2:0.08,A3:'Tenor (tahun)',B3:4,A5:'Cicilan per bulan',A6:'Total dibayar',B6:'=B5*B3*12',A7:'Total bunga',B7:'=B6-B1'}},

{id:'npv-irr',mod:'keuangan',title:'Kelayakan investasi: NPV dan IRR',fns:'NPV · IRR',cert:['E3'],
 intro:`<p><code>NPV</code> menghitung nilai sekarang dari arus kas masa depan dengan tingkat diskonto tertentu. NPV positif berarti investasi menghasilkan lebih dari biaya modalnya.</p>
 <p>Perhatikan cara Excel menghitung NPV: arus kas pertama dianggap terjadi di akhir periode 1. Investasi awal di tahun 0 tidak dimasukkan ke NPV, melainkan ditambahkan di luar. <code>IRR</code> mencari tingkat bunga yang membuat NPV sama dengan nol. Kalau IRR lebih besar dari biaya modal, proyek layak.</p>`,
 syntax:'=IRR(B3:B8)',parts:[['B3:B8','arus kas dari tahun 0 (negatif) sampai tahun 5']],
 task:'NPV di B10 sudah dihitung. Isi <code>B11</code> dengan IRR proyek mesin ini.',
 cols:2,rows:12,target:'B11',solution:'=IRR(B3:B8)',use:['IRR'],fmt:{B1:'pct',B11:'pct'},bold:['A10','A11'],
 hint:'IRR memakai seluruh arus kas, termasuk investasi awal yang negatif di B3.',
 data:{A1:'Biaya modal',B1:0.12,A2:'Tahun',B2:'Arus kas',A3:0,B3:-500000000,A4:1,B4:120000000,A5:2,B5:150000000,A6:3,B6:160000000,A7:4,B7:170000000,A8:5,B8:180000000,A10:'NPV',B10:'=NPV(B1,B4:B8)+B3',A11:'IRR'}},

{id:'sln',mod:'keuangan',title:'Penyusutan aset tetap',fns:'SLN',cert:['E3'],
 intro:`<p>Metode garis lurus membagi rata penyusutan sepanjang umur manfaat aset. <code>SLN</code> menghitungnya dari harga perolehan, nilai sisa, dan umur manfaat.</p>
 <p>Nilai buku di akhir tahun ke-n adalah harga perolehan dikurangi penyusutan × n. Excel juga punya <code>DB</code> dan <code>DDB</code> untuk metode saldo menurun.</p>`,
 syntax:'=SLN(B1,B2,B3)',parts:[['B1','harga perolehan'],['B2','nilai sisa di akhir umur'],['B3','umur manfaat dalam tahun']],
 task:'Isi <code>B5</code> dengan beban penyusutan per tahun. Tabel nilai buku di kolom E akan langsung terisi.',
 cols:5,rows:7,target:'B5',solution:'=SLN(B1,B2,B3)',use:['SLN'],bold:['A5'],
 hint:'(240 juta − 40 juta) ÷ 5 tahun.',
 data:{A1:'Harga perolehan',B1:240000000,A2:'Nilai sisa',B2:40000000,A3:'Umur manfaat (th)',B3:5,A5:'Penyusutan per tahun',D1:'Tahun',E1:'Nilai buku akhir',D2:1,E2:'=$B$1-$B$5*D2',D3:2,E3:'=$B$1-$B$5*D3',D4:3,E4:'=$B$1-$B$5*D4',D5:4,E5:'=$B$1-$B$5*D5',D6:5,E6:'=$B$1-$B$5*D6'}},

/* ================= DATA ================= */
{id:'tabel',mod:'data',type:'read',title:'Excel Table dan referensi terstruktur',fns:'Ctrl+T · Tabel[Kolom]',cert:['A3'],preview:'table',
 body:`<p>Rentang data biasa dan <b>Excel Table</b> terlihat mirip, tetapi Table jauh lebih pintar. Pilih satu sel di dalam data, tekan <kbd>Ctrl</kbd>+<kbd>T</kbd>, centang <i>My table has headers</i>, lalu OK.</p>
 <h3>Yang kamu dapat dari Table</h3>
 <ul>
  <li>Baris baru di bawah tabel otomatis menjadi bagian tabel, lengkap dengan rumus dan formatnya.</li>
  <li>Tombol filter muncul di setiap judul kolom.</li>
  <li>Judul kolom tetap terlihat saat menggulir ke bawah.</li>
  <li><b>Total Row</b> (Table Design › Total Row) menambah baris total dengan pilihan Sum, Average, Count, dan lainnya.</li>
  <li>PivotTable, grafik, dan dropdown yang bersumber dari Table ikut bertambah saat datanya bertambah.</li>
 </ul>
 <h3>Referensi terstruktur</h3>
 <p>Beri nama tabel di <b>Table Design › Table Name</b>, misalnya <code>Penjualan</code>. Rumus kemudian bisa memakai nama kolom, bukan alamat sel:</p>
 <ul>
  <li><code>=SUM(Penjualan[Nilai])</code> menjumlahkan seluruh kolom Nilai, sebanyak apa pun barisnya.</li>
  <li><code>=[@Qty]*[@Harga]</code> di dalam tabel berarti Qty dikali Harga di baris yang sama.</li>
  <li><code>=COUNTIFS(Penjualan[Cabang],"Medan")</code> tetap benar saat data ditambah.</li>
 </ul>
 <p>Untuk mengembalikan tabel menjadi rentang biasa: <b>Table Design › Convert to Range</b>. Format tetap, fitur tabel hilang.</p>`,
 quiz:[
  {q:'Shortcut untuk mengubah rentang data menjadi Excel Table?',opts:['Ctrl + L','Ctrl + T','Ctrl + Shift + T','Alt + T'],a:1,why:'Ctrl + T (atau Ctrl + L) membuka dialog Create Table.'},
  {q:'Di dalam tabel, rumus =[@Qty]*[@Harga] berarti…',opts:['Total seluruh Qty dikali total Harga','Qty dikali Harga di baris yang sama','Qty baris pertama dikali Harga baris pertama','Error karena tidak ada alamat sel'],a:1,why:'Tanda @ berarti "baris ini".'},
 ]},

{id:'sort-filter',mod:'data',type:'read',title:'Sort dan Filter',fns:'Sort · Filter · Advanced Filter · SUBTOTAL',cert:['A3'],preview:['sort','filter'],
 body:`<p><b>Sort</b> mengurutkan data, dan <b>Filter</b> menyembunyikan baris yang tidak memenuhi syarat. Keduanya ada di tab <b>Data</b> dan di <b>Home › Sort &amp; Filter</b>. Nyalakan dan matikan filter dengan <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd>.</p>
 <h3>Sort bertingkat</h3>
 <p>Data › Sort membuka dialog untuk beberapa level, misalnya urut per cabang, lalu dalam tiap cabang urut nilai terbesar. Opsi <b>Order › Custom List</b> mengurutkan sesuai daftar sendiri, seperti Senin, Selasa, Rabu, atau Rendah, Sedang, Tinggi.</p>
 <div class="tip"><b>Hati-hati:</b> pilih seluruh data sebelum sort, atau cukup satu sel di dalam data. Kalau hanya satu kolom yang dipilih lalu kamu memilih <i>Continue with the current selection</i>, isi kolom itu akan terlepas dari baris aslinya.</div>
 <h3>Jenis filter</h3>
 <ul>
  <li><b>Text Filters</b>: Contains, Begins With, Does Not Equal.</li>
  <li><b>Number Filters</b>: Greater Than, Between, Top 10, Above Average.</li>
  <li><b>Date Filters</b>: This Month, Last Quarter, Year to Date.</li>
  <li><b>Filter by Color</b>: berdasarkan warna sel atau warna font.</li>
 </ul>
 <h3>Advanced Filter</h3>
 <p>Untuk kriteria rumit, tulis kriteria di area terpisah dengan judul kolom yang sama. Kriteria di baris yang sama berarti DAN, di baris berbeda berarti ATAU. Lalu buka Data › Advanced dan pilih <i>Copy to another location</i> untuk menyalin hasilnya ke tempat lain.</p>
 <h3>Tur ribbon Data › Sort &amp; Filter</h3>
 <ul>
  <li><b>A→Z / Z→A</b>: urut cepat berdasarkan kolom sel aktif. <b>Sort</b>: dialog bertingkat.</li>
  <li><b>Filter</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd>): memunculkan tombol ▾ di setiap judul kolom.</li>
  <li><b>Clear</b>: menghapus semua filter tanpa mematikan tombol ▾. <b>Reapply</b>: menerapkan ulang filter setelah data berubah.</li>
  <li><b>Advanced</b>: filter dengan area kriteria, bisa menyalin hasil ke tempat lain dan mengambil data unik.</li>
 </ul>
 <h3>Quick filter dan banyak kriteria</h3>
 <p>Klik ▾ lalu centang item yang ingin ditampilkan. Item yang dicentang dalam <b>satu kolom</b> berarti ATAU (Jakarta atau Bandung). Filter di <b>kolom berbeda</b> berarti DAN (Jakarta dan Elektronik). Ikon ▾ berubah jadi corong dan nomor baris jadi biru sebagai tanda ada baris tersembunyi; status bar menulis misalnya <i>8 of 30 records found</i>.</p>
 <p><b>Custom AutoFilter</b> (Number/Text Filters › Custom) memberi dua syarat di satu kolom dengan pilihan <i>And</i> atau <i>Or</i>, misalnya Nilai ≥ 5.000.000 And ≤ 10.000.000. Di kotak Search, karakter <code>*</code> dan <code>?</code> bisa dipakai sebagai wildcard.</p>
 <h3>Menyimpan hasil filter</h3>
 <ol class="steps">
  <li>Blok data yang sudah difilter.</li>
  <li><b>Home › Find &amp; Select › Go To Special › Visible cells only</b>, atau tekan <kbd>Alt</kbd>+<kbd>;</kbd>. (Pada data hasil AutoFilter, Excel modern sudah otomatis hanya menyalin baris yang terlihat.)</li>
  <li><kbd>Ctrl</kbd>+<kbd>C</kbd>, pindah ke sheet baru, <kbd>Ctrl</kbd>+<kbd>V</kbd>.</li>
 </ol>
 <p>Alternatif: Advanced Filter › <i>Copy to another location</i>, atau fungsi <code>=FILTER()</code> yang hasilnya ikut berubah saat data berubah.</p>
 <h3>Menghitung data yang terfilter</h3>
 <p>SUM tetap menjumlahkan baris yang disembunyikan filter. Pakai <code>=SUBTOTAL(9,C2:C100)</code> agar total hanya menghitung baris yang terlihat. Kode 1–11 (1 AVERAGE, 2 COUNT, 3 COUNTA, 4 MAX, 9 SUM) mengabaikan baris yang tersaring filter; kode 101–111 juga mengabaikan baris yang disembunyikan manual (Hide). Tombol <b>AutoSum</b> di data terfilter otomatis menulis SUBTOTAL. <code>AGGREGATE</code> bisa sekaligus mengabaikan error.</p>
 <p>Simulasi di bawah memakai alur Excel yang sama: nyalakan Filter, klik ▾, coba Number Filters dan Top 10, bandingkan SUM dengan SUBTOTAL, lalu salin hasilnya ke Sheet2.</p>`,
 quiz:[
  {q:'Data difilter hanya cabang Medan. Rumus mana yang hanya menjumlah baris yang terlihat?',opts:['=SUM(C2:C100)','=SUBTOTAL(9,C2:C100)','=SUMIF(C2:C100,">0")','=TOTAL(C2:C100)'],a:1,why:'SUBTOTAL dengan kode 9 mengabaikan baris yang tersaring.'},
  {q:'Di Advanced Filter, dua kriteria ditulis di baris yang sama. Artinya…',opts:['Salah satu terpenuhi (ATAU)','Keduanya harus terpenuhi (DAN)','Kriteria kedua diabaikan','Error'],a:1,why:'Baris sama berarti DAN, baris berbeda berarti ATAU.'},
 ]},

{id:'cond-format',mod:'data',type:'read',title:'Conditional Formatting',fns:'Highlight · Data Bars · Rumus',cert:['A2','E2'],preview:'cf',
 body:`<p>Conditional Formatting memberi warna otomatis sesuai isi sel, jadi data yang perlu perhatian langsung terlihat. Ada di <b>Home › Conditional Formatting</b>.</p>
 <h3>Aturan siap pakai</h3>
 <ul>
  <li><b>Highlight Cells Rules</b>: lebih besar dari, di antara, teks berisi, tanggal tertentu, dan nilai duplikat.</li>
  <li><b>Top/Bottom Rules</b>: 10 teratas, 10% terbawah, di atas rata-rata.</li>
  <li><b>Data Bars</b>: batang di dalam sel sesuai besar nilai.</li>
  <li><b>Color Scales</b>: gradasi warna, misalnya merah untuk kecil dan hijau untuk besar.</li>
  <li><b>Icon Sets</b>: panah, lampu lalu lintas, atau tanda centang.</li>
 </ul>
 <h3>Aturan dengan rumus</h3>
 <p>Untuk mewarnai satu baris penuh berdasarkan satu kolom, pilih seluruh data mulai baris 2, lalu buka <b>New Rule › Use a formula to determine which cells to format</b>. Contoh untuk faktur yang lewat jatuh tempo dan belum lunas:</p>
 <pre class="code">=AND($D2&lt;TODAY(),$E2&lt;&gt;"Lunas")</pre>
 <p>Tanda <code>$</code> di depan D dan E mengunci kolom, sedangkan barisnya tetap relatif. Rumus aturan ditulis untuk baris pertama yang dipilih, dan Excel menerapkannya ke baris lain.</p>
 <h3>Mengelola aturan</h3>
 <p><b>Manage Rules</b> menampilkan semua aturan beserta urutannya. Aturan di atas diperiksa lebih dulu. Centang <i>Stop If True</i> supaya aturan di bawahnya tidak ikut berlaku ketika aturan itu terpenuhi.</p>`,
 quiz:[
  {q:'Kamu ingin mewarnai seluruh baris ketika kolom E berisi "Lunas". Rumus aturan yang tepat untuk data mulai baris 2?',opts:['=E2="Lunas"','=$E$2="Lunas"','=$E2="Lunas"','=E$2="Lunas"'],a:2,why:'Kolom E dikunci, baris tetap relatif supaya ikut berganti di setiap baris.'},
  {q:'Di mana mengatur urutan beberapa aturan Conditional Formatting?',opts:['Format Cells','Manage Rules','Clear Rules','Cell Styles'],a:1,why:'Manage Rules menampilkan dan mengurutkan semua aturan.'},
 ]},

{id:'data-validation',mod:'data',type:'read',title:'Data Validation dan dropdown',fns:'List · Custom · Input message',cert:['E2'],preview:'dv',
 body:`<p>Data Validation membatasi apa yang boleh diisi ke sel. Hasilnya, data lebih bersih dan rumus jarang rusak karena salah ketik. Buka <b>Data › Data Validation</b>.</p>
 <h3>Jenis validasi</h3>
 <ul>
  <li><b>List</b>: dropdown. Sumbernya bisa berupa rentang, misalnya <code>=$H$2:$H$6</code>, atau daftar yang diketik langsung: <code>Lunas,Belum,Sebagian</code>. Di Excel dengan pengaturan wilayah Indonesia, pemisah daftarnya titik koma.</li>
  <li><b>Whole number</b> dan <b>Decimal</b>: batas angka, misalnya qty antara 1 dan 1.000.</li>
  <li><b>Date</b>: hanya tanggal dalam rentang tertentu.</li>
  <li><b>Text length</b>: misalnya NIK harus tepat 16 karakter.</li>
  <li><b>Custom</b>: aturan dengan rumus. Contoh untuk mencegah kode ganda di kolom A: <code>=COUNTIF($A:$A,A2)=1</code></li>
 </ul>
 <h3>Pesan untuk pengguna</h3>
 <p>Tab <b>Input Message</b> menampilkan petunjuk saat sel dipilih. Tab <b>Error Alert</b> mengatur reaksi saat isian salah: <i>Stop</i> menolak isian, <i>Warning</i> bertanya dulu, dan <i>Information</i> hanya memberi tahu.</p>
 <h3>Dropdown bertingkat</h3>
 <p>Pilihan kota bisa bergantung pada provinsi yang dipilih. Beri nama setiap daftar kota sesuai nama provinsinya (tanpa spasi), lalu isi sumber dropdown kota dengan <code>=INDIRECT(B2)</code>.</p>
 <p><b>Circle Invalid Data</b> di menu yang sama menandai data lama yang tidak memenuhi aturan baru.</p>`,
 quiz:[
  {q:'Kamu ingin menolak isian kode pegawai yang sudah ada sebelumnya. Jenis validasi apa?',opts:['List','Whole number','Custom dengan COUNTIF','Text length'],a:2,why:'=COUNTIF($A:$A,A2)=1 hanya mengizinkan kode yang muncul sekali.'},
  {q:'Error Alert dengan gaya Warning akan…',opts:['Menolak isian sepenuhnya','Bertanya apakah tetap mau dilanjutkan','Tidak muncul sama sekali','Menghapus isian lama'],a:1,why:'Warning memberi pilihan Yes, No, atau Cancel.'},
 ]},

{id:'bersih-data',mod:'data',type:'read',title:'Membersihkan data',fns:'Remove Duplicates · Text to Columns · Go To Special',cert:['A2','E2'],preview:['dupes','textcol'],
 body:`<p>Data dari sistem lain jarang langsung siap dipakai. Berikut alat-alat bawaan untuk merapikannya.</p>
 <h3>Remove Duplicates</h3>
 <p><b>Data › Remove Duplicates</b>. Pilih kolom yang menentukan sebuah baris dianggap ganda. Misalnya, centang hanya "No Faktur" supaya baris dengan nomor faktur sama dihapus walaupun kolom lain berbeda. Simpan salinan data dulu, karena baris yang terhapus tidak bisa dikembalikan setelah file disimpan.</p>
 <h3>Text to Columns</h3>
 <p>Memecah satu kolom menjadi beberapa. <b>Delimited</b> memecah berdasarkan pemisah seperti koma, titik koma, atau tab. <b>Fixed width</b> memecah di posisi karakter tertentu. Di langkah terakhir kamu bisa menentukan format setiap kolom, termasuk urutan tanggal seperti DMY untuk data berformat tanggal Indonesia.</p>
 <h3>Find &amp; Replace</h3>
 <p><kbd>Ctrl</kbd>+<kbd>H</kbd>. Bisa memakai wildcard <code>*</code> dan <code>?</code>, mencari di seluruh workbook, dan mengganti format. Untuk mencari tanda bintang itu sendiri, tulis <code>~*</code>.</p>
 <h3>Go To Special</h3>
 <p><kbd>F5</kbd> › Special › Blanks memilih semua sel kosong. Trik untuk mengisi sel kosong dengan nilai di atasnya: pilih kolomnya, Go To Special › Blanks, ketik <code>=</code>, tekan panah atas, lalu <kbd>Ctrl</kbd>+<kbd>Enter</kbd>.</p>
 <h3>Angka yang tersimpan sebagai teks</h3>
 <p>Tanda segitiga hijau di pojok sel biasanya berarti angka tersimpan sebagai teks, sehingga tidak ikut dihitung SUM. Pilih selnya, klik ikon peringatan, lalu <i>Convert to Number</i>. Alternatif lain: <code>=VALUE(A2)</code>, atau Text to Columns langsung Finish.</p>`,
 quiz:[
  {q:'Kolom berisi "Jakarta;Bandung;Medan" dalam satu sel. Alat yang paling cepat untuk memecahnya ke tiga kolom?',opts:['Flash Fill','Text to Columns','Remove Duplicates','Consolidate'],a:1,why:'Text to Columns dengan pemisah titik koma.'},
  {q:'Cara cepat mengisi semua sel kosong dengan nilai di atasnya?',opts:['Ctrl + D di setiap sel','Go To Special › Blanks, ketik =↑, Ctrl + Enter','Remove Duplicates','Sort A-Z'],a:1,why:'Ctrl + Enter mengisi rumus yang sama ke semua sel yang terpilih.'},
 ]},

{id:'named-range',mod:'data',type:'read',title:'Nama rentang (Named Range)',fns:'Name Manager · Ctrl+F3',cert:['A2'],preview:null,
 body:`<p>Sel atau rentang bisa diberi nama, sehingga rumus lebih mudah dibaca. <code>=B10*TarifPajak</code> lebih jelas daripada <code>=B10*$F$1</code>.</p>
 <h3>Cara membuat nama</h3>
 <ol class="steps">
  <li>Pilih sel atau rentang, ketik nama di <b>Name Box</b> (kiri bar rumus), lalu tekan Enter.</li>
  <li>Atau <b>Formulas › Define Name</b> untuk mengatur ruang lingkup (scope) dan komentar.</li>
  <li><b>Formulas › Create from Selection</b> membuat banyak nama sekaligus dari judul baris atau kolom.</li>
 </ol>
 <p>Aturan nama: diawali huruf atau garis bawah, tanpa spasi, dan tidak boleh mirip alamat sel seperti <code>PPN1</code>.</p>
 <h3>Name Manager</h3>
 <p><kbd>Ctrl</kbd>+<kbd>F3</kbd> membuka daftar semua nama di workbook. Di sini kamu bisa mengubah rentangnya, menghapus nama yang tidak dipakai, atau menemukan nama yang rusak (#REF!).</p>
 <h3>Scope</h3>
 <p>Nama berlingkup <b>Workbook</b> bisa dipakai di sheet mana pun. Nama berlingkup sheet hanya berlaku di sheet itu, sehingga sheet lain bisa punya nama yang sama dengan isi berbeda.</p>
 <h3>Kegunaan lain</h3>
 <ul>
  <li>Sumber dropdown: <code>=DaftarCabang</code>.</li>
  <li>Melompat cepat: pilih nama dari Name Box.</li>
  <li><kbd>F3</kbd> saat mengetik rumus menampilkan daftar nama untuk ditempel.</li>
 </ul>`,
 quiz:[
  {q:'Shortcut membuka Name Manager?',opts:['Ctrl + F3','F3','Shift + F3','Ctrl + N'],a:0,why:'Ctrl + F3 membuka Name Manager; F3 menempel nama ke rumus.'},
  {q:'Nama mana yang tidak valid?',opts:['TarifPajak','_Target2026','PPN1','Daftar_Cabang'],a:2,why:'PPN1 terbaca sebagai alamat sel kolom PPN baris 1.'},
 ]},

{id:'grafik',mod:'data',type:'read',title:'Grafik dan sparkline',fns:'Column · Line · Combo · Waterfall',cert:['A5','E4'],preview:'chart',
 body:`<p>Pilih data beserta judulnya, lalu <b>Insert › Recommended Charts</b> atau tekan <kbd>Alt</kbd>+<kbd>F1</kbd> untuk grafik instan. <kbd>F11</kbd> membuat grafik di sheet tersendiri.</p>
 <h3>Memilih jenis grafik</h3>
 <ul>
  <li><b>Column / Bar</b>: membandingkan kategori. Pakai Bar (mendatar) kalau nama kategorinya panjang.</li>
  <li><b>Line</b>: tren dari waktu ke waktu.</li>
  <li><b>Pie / Doughnut</b>: komposisi, hanya untuk sedikit kategori yang totalnya 100%.</li>
  <li><b>Combo</b>: dua ukuran berbeda, misalnya omzet (kolom) dan margin % (garis) di <b>sumbu sekunder</b>.</li>
  <li><b>Scatter</b>: hubungan dua angka, misalnya biaya iklan dan penjualan.</li>
  <li><b>Waterfall</b>: perjalanan dari angka awal ke akhir, misalnya laba kotor ke laba bersih.</li>
  <li><b>Histogram</b> dan <b>Box &amp; Whisker</b>: sebaran data. <b>Pareto</b>: penyebab terbesar di depan.</li>
  <li><b>Funnel</b>: tahapan proses yang menyusut, misalnya prospek ke deal.</li>
  <li><b>Map</b>, <b>Treemap</b>, <b>Sunburst</b>: data wilayah dan hierarki.</li>
 </ul>
 <h3>Mengubah grafik</h3>
 <p>Klik grafik untuk memunculkan tab <b>Chart Design</b> dan <b>Format</b>. Tombol <b>+</b> di samping grafik menambah judul, label data, legenda, garis tren, dan error bar. <b>Select Data</b> mengubah rentang sumber dan menukar baris dengan kolom. <b>Change Chart Type</b> memindahkan satu seri ke sumbu sekunder.</p>
 <h3>Sparkline</h3>
 <p>Grafik mini di dalam satu sel: <b>Insert › Sparklines</b> (Line, Column, Win/Loss). Cocok untuk tabel ringkasan, misalnya tren 12 bulan di samping setiap cabang.</p>
 <div class="tip">Grafik yang bersumber dari Excel Table ikut bertambah otomatis saat baris baru ditambahkan.</div>`,
 quiz:[
  {q:'Omzet (miliaran rupiah) dan margin (persen) ingin ditampilkan di satu grafik. Pilihan terbaik?',opts:['Pie','Combo dengan sumbu sekunder','Dua grafik Line ditumpuk','Stacked Column'],a:1,why:'Skalanya sangat berbeda, jadi margin perlu sumbu sendiri.'},
  {q:'Grafik untuk menunjukkan bagaimana laba kotor berkurang oleh beban demi beban sampai menjadi laba bersih?',opts:['Waterfall','Scatter','Doughnut','Radar'],a:0,why:'Waterfall menampilkan kenaikan dan penurunan bertahap.'},
 ]},

{id:'pivot',mod:'data',type:'read',title:'PivotTable',fns:'Rows · Columns · Values · Filters',cert:['E4'],preview:'pivot',
 body:`<p>PivotTable meringkas ribuan baris menjadi tabel ringkasan hanya dengan menarik nama kolom. Tidak ada rumus yang perlu ditulis, dan susunannya bisa diubah dalam hitungan detik.</p>
 <h3>Membuat PivotTable</h3>
 <ol class="steps">
  <li>Pastikan data rapi: satu baris judul, tanpa baris atau kolom kosong, tanpa sel gabungan. Idealnya ubah dulu menjadi Table (<kbd>Ctrl</kbd>+<kbd>T</kbd>).</li>
  <li>Pilih satu sel di data, lalu <b>Insert › PivotTable</b>. Pilih <i>New Worksheet</i>.</li>
  <li>Di panel <b>PivotTable Fields</b>, tarik kolom ke empat area: <b>Rows</b> (baris), <b>Columns</b> (kolom), <b>Values</b> (angka yang diringkas), dan <b>Filters</b> (penyaring seluruh pivot).</li>
 </ol>
 <h3>Mengatur Values</h3>
 <p>Klik field di area Values › <b>Value Field Settings</b>. Ganti <i>Summarize by</i> dari Sum ke Count, Average, Max, atau Min. Tab <i>Show Values As</i> menampilkan angka sebagai % of Grand Total, % of Column Total, Difference From, atau Running Total. Tombol <b>Number Format</b> di dialog yang sama mengatur format angkanya.</p>
 <h3>Refresh</h3>
 <p>PivotTable tidak berubah otomatis saat data sumber berubah. Klik kanan › <b>Refresh</b>, atau <kbd>Alt</kbd>+<kbd>F5</kbd>. <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F5</kbd> me-refresh semua pivot dan koneksi data di workbook.</p>
 <p>Coba di simulasi di bawah, alurnya sama seperti di Excel: buka tab <b>Insert › PivotTable</b>, tekan OK, lalu centang atau seret field di panel <b>PivotTable Fields</b>. Klik kanan angka di pivot untuk mengurutkan atau mengganti ringkasan, klik tombol ▾ untuk menyaring, dan klik dua kali angka untuk melihat data penyusunnya. Selesaikan misinya satu per satu.</p>`,
 quiz:[
  {q:'Data sumber pivot baru saja ditambah 50 baris. Apa yang perlu dilakukan?',opts:['Membuat pivot baru','Refresh pivot','Tidak perlu apa-apa','Menyalin ulang data'],a:1,why:'Pivot perlu di-refresh. Kalau sumbernya Table, rentang baru ikut terbaca.'},
  {q:'Untuk menampilkan kontribusi tiap cabang dalam persen dari total, gunakan…',opts:['Summarize by Average','Show Values As › % of Grand Total','Filter','Sort'],a:1,why:'Show Values As mengubah cara angka ditampilkan.'},
  {q:'Area mana yang dipakai untuk menyaring seluruh pivot berdasarkan tahun?',opts:['Rows','Values','Filters','Columns'],a:2,why:'Filters menyaring keseluruhan pivot.'},
 ]},

{id:'pivot-lanjut',mod:'data',type:'read',title:'PivotTable lanjutan dan PivotChart',fns:'Group · Slicer · Timeline · Calculated Field',cert:['E4'],preview:'pivot',
 body:`<h3>Mengelompokkan (Grouping)</h3>
 <ul>
  <li><b>Tanggal</b>: klik kanan sebuah tanggal di pivot › <b>Group</b> › pilih Months, Quarters, dan/atau Years. Kalau Years tidak ikut dipilih, Januari 2025 dan Januari 2026 tergabung jadi satu "Jan".</li>
  <li><b>Rentang angka</b>: klik kanan angka di area Rows (misalnya Qty atau umur) › Group › isi <i>Starting at</i>, <i>Ending at</i>, dan <i>By</i> (misalnya 10 menghasilkan 0-9, 10-19, …).</li>
  <li><b>Grup buatan sendiri</b>: blok beberapa item teks dengan <kbd>Ctrl</kbd> (misalnya Jakarta dan Bandung), klik kanan › <b>Group</b>. Excel membuat field baru <i>Cabang2</i> berisi "Group1" yang bisa diganti nama menjadi "Barat". <b>Ungroup</b> mengembalikannya.</li>
  <li><b>Grouping di kolom</b> bekerja sama: taruh Tanggal di Columns lalu Group by Months untuk tabel bulan ke samping.</li>
  <li>Pesan <i>Cannot group that selection</i> biasanya karena ada sel kosong atau teks di kolom tanggal/angka sumber.</li>
 </ul>
 <h3>Sel kosong dan item tanpa data</h3>
 <p><b>PivotTable Options › Layout &amp; Format › For empty cells show</b>: isi <code>0</code> atau <code>-</code> supaya sel kosong tidak membingungkan. Klik kanan field › <b>Field Settings › Layout &amp; Print › Show items with no data</b> menampilkan item yang tidak punya transaksi (misalnya cabang yang tidak berjualan bulan itu).</p>
 <h3>Subtotal</h3>
 <p><b>Design › Subtotals</b> mengatur subtotal semua field sekaligus (tidak tampil, di bawah, atau di atas grup). Per field: klik kanan label › <i>Subtotal "Cabang"</i> untuk menyalakan atau mematikan, atau Field Settings › Subtotals › <i>Custom</i> untuk memilih Sum, Average, Max sekaligus.</p>
 <h3>Slicer dan Timeline</h3>
 <p><b>PivotTable Analyze › Insert Slicer</b> menambah tombol filter yang mudah diklik. <b>Insert Timeline</b> menambah penggeser waktu untuk kolom tanggal. Satu slicer bisa mengendalikan beberapa pivot sekaligus lewat <b>Report Connections</b>, cara umum untuk membuat dashboard.</p>
 <h3>Calculated Field</h3>
 <p><b>PivotTable Analyze › Fields, Items &amp; Sets › Calculated Field</b> membuat kolom hitungan baru, misalnya <code>Harga = Nilai / Qty</code> atau <code>Margin = Laba / Penjualan</code>. Rumus ini dihitung dari <b>jumlah</b> tiap field di sel itu, bukan per baris data, sehingga cocok untuk rasio. <b>Calculated Item</b> (di menu yang sama) menghitung antar-item dalam satu field, misalnya <code>Selisih = Agu − Jul</code>.</p>
 <h3>Rumus di luar pivot: GETPIVOTDATA</h3>
 <p>Saat kamu mengetik <code>=</code> lalu mengklik sel angka di pivot, Excel menulis <code>=GETPIVOTDATA("Nilai",$A$3,"Cabang","Jakarta","Bulan","Jul")</code>. Rumus ini tetap benar walau susunan pivot berubah, karena mencari berdasarkan nama item, bukan alamat sel. Kalau kamu lebih suka alamat biasa (misalnya <code>=B5</code>), matikan lewat <b>PivotTable Analyze › Options ▾ › Generate GetPivotData</b>.</p>
 <h3>Fitur lain yang sering dipakai</h3>
 <ul>
  <li><b>Design › Report Layout › Show in Tabular Form</b> menaruh tiap field baris di kolom sendiri, dan <i>Repeat All Item Labels</i> mengisi label yang kosong sehingga pivot mudah disalin sebagai tabel biasa.</li>
  <li><b>Show Report Filter Pages</b> (PivotTable Analyze › Options ▾) membuat satu sheet untuk setiap item di area Filters, misalnya satu sheet per cabang, lengkap dengan pivotnya.</li>
  <li><b>PivotTable Styles</b> di tab Design memberi warna dan baris berselang (Banded Rows) seperti Format as Table.</li>
  <li>Klik dua kali angka di pivot untuk melihat baris data penyusunnya (drill down).</li>
  <li><code>GETPIVOTDATA</code> muncul otomatis saat kamu merujuk sel pivot dari rumus.</li>
  <li><b>Distinct Count</b> tersedia kalau kamu mencentang <i>Add this data to the Data Model</i> saat membuat pivot.</li>
 </ul>
 <h3>PivotChart</h3>
 <p><b>PivotTable Analyze › PivotChart</b> membuat grafik yang terhubung ke pivot. Tombol field di grafik bisa dipakai untuk menyaring, dan grafiknya ikut berubah saat slicer diklik.</p>`,
 quiz:[
  {q:'Kamu ingin satu tombol filter cabang mengendalikan tiga pivot sekaligus. Langkahnya?',opts:['Membuat tiga slicer','Slicer › Report Connections','Group','Calculated Field'],a:1,why:'Report Connections menghubungkan slicer ke beberapa pivot dengan sumber yang sama.'},
  {q:'Untuk menghitung jumlah pelanggan unik di pivot, kamu perlu…',opts:['Calculated Field','Menambahkan data ke Data Model lalu memakai Distinct Count','COUNTIF','Group'],a:1,why:'Distinct Count hanya tersedia untuk pivot berbasis Data Model.'},
 ]},

{id:'what-if',mod:'data',type:'read',title:'Analisis What-If dan Solver',fns:'Goal Seek · Scenario · Data Table · Solver',cert:['E3'],preview:'whatif',
 body:`<p>Analisis what-if menjawab pertanyaan "bagaimana kalau". Semua alatnya ada di <b>Data › What-If Analysis</b>.</p>
 <h3>Goal Seek</h3>
 <p>Mencari satu nilai input agar sebuah rumus mencapai target. Contoh: berapa pinjaman maksimal kalau cicilan per bulan dibatasi Rp5.000.000? Isi <i>Set cell</i> dengan sel cicilan, <i>To value</i> 5000000, dan <i>By changing cell</i> dengan sel pokok pinjaman.</p>
 <h3>Scenario Manager</h3>
 <p>Menyimpan beberapa set input, misalnya skenario Optimis, Normal, dan Pesimis, lalu menampilkannya bergantian. Tombol <b>Add</b> meminta nama skenario, <i>Changing cells</i> (maksimal 32 sel), lalu nilai tiap sel. <b>Show</b> menulis nilai skenario itu ke sel aslinya (data sebelumnya tertimpa, jadi buat juga skenario "Normal"). <b>Summary</b> membuat sheet baru berisi tabel perbandingan: changing cells di atas dan <i>Result cells</i> (misalnya laba) di bawah. Skenario disimpan per sheet; <b>Merge</b> mengambil skenario dari sheet lain.</p>
 <h3>Data Table</h3>
 <p>Menghitung rumus untuk banyak nilai input sekaligus, misalnya tabel cicilan untuk berbagai tenor dan suku bunga.</p>
 <ul>
  <li><b>Satu variabel</b>: daftar nilai input ke bawah (misalnya bunga 6%–12%), rumus <code>=B4</code> di sel kanan atas daftar. Blok semuanya, lalu Data Table dan isi hanya <i>Column input cell</i> dengan sel bunga asli.</li>
  <li><b>Dua variabel</b>: input pertama ke bawah, input kedua ke samping, rumus di pojok kiri atas. Isi <i>Row input cell</i> (yang berderet ke samping) dan <i>Column input cell</i> (yang berderet ke bawah).</li>
  <li>Hasilnya berupa rumus array <code>{=TABLE(B3,B2)}</code> yang tidak bisa diedit per sel. Kalau workbook terasa lambat, pilih <b>Formulas › Calculation Options › Automatic Except for Data Tables</b> lalu tekan <kbd>F9</kbd> saat perlu.</li>
 </ul>
 <h3>Forecast Sheet</h3>
 <p><b>Data › Forecast Sheet</b> membuat proyeksi dari data deret waktu, lengkap dengan batas atas dan bawah.</p>
 <h3>Solver</h3>
 <p>Solver mencari kombinasi beberapa input untuk memaksimalkan atau meminimalkan hasil dengan batasan tertentu, misalnya komposisi produksi dengan laba terbesar tanpa melebihi kapasitas mesin. Aktifkan dulu lewat <b>File › Options › Add-ins › Manage: Excel Add-ins › Go › centang Solver Add-in</b>. Setelah itu Solver muncul di tab Data.</p>
 <ol class="steps">
  <li><b>Set Objective</b>: sel rumus yang dioptimalkan (misalnya total laba <code>=SUMPRODUCT(B2:D2,B3:D3)</code>), pilih <i>Max</i>, <i>Min</i>, atau <i>Value Of</i>.</li>
  <li><b>By Changing Variable Cells</b>: sel input yang boleh diubah (jumlah tiap produk).</li>
  <li><b>Subject to the Constraints › Add</b>: batasan seperti jam kerja <code>&lt;=</code> 120, <code>int</code> (bilangan bulat), atau <code>bin</code> (0/1, untuk keputusan ya/tidak).</li>
  <li>Centang <i>Make Unconstrained Variables Non-Negative</i> dan pilih metode: <b>Simplex LP</b> untuk model linear, <b>GRG Nonlinear</b> untuk model halus non-linear, <b>Evolutionary</b> untuk model dengan IF/VLOOKUP.</li>
  <li><b>Solve</b>, lalu pilih <i>Keep Solver Solution</i> atau <i>Restore Original Values</i>, dan centang <b>Answer Report</b> untuk sheet laporan: nilai awal dan akhir, serta status tiap batasan (<i>Binding</i> = batas habis terpakai, <i>Not Binding</i> = masih ada sisa/slack).</li>
 </ol>
 <p>Kalau muncul <i>The Objective Cell values do not converge</i>, berarti batasannya kurang sehingga hasil bisa naik tanpa batas. Tombol <b>Save Model</b> menyimpan pengaturan Solver ke range supaya bisa dipakai lagi.</p>
 <p>Simulasi di bawah berisi keempat alat ini dengan dialog seperti di Excel. Kerjakan misinya dari Goal Seek sampai Answer Report.</p>`,
 quiz:[
  {q:'Kamu tahu target hasilnya dan ingin mencari satu nilai input. Alat yang tepat?',opts:['Scenario Manager','Goal Seek','Data Table','Solver'],a:1,why:'Goal Seek mengubah satu input untuk mencapai satu target.'},
  {q:'Solver tidak terlihat di tab Data. Apa yang perlu dilakukan?',opts:['Install ulang Excel','Mengaktifkan Solver Add-in di Options','Membuka tab Developer','Memakai Goal Seek'],a:1,why:'Solver adalah add-in bawaan yang harus diaktifkan dulu.'},
 ]},

{id:'power-query',mod:'data',type:'read',title:'Power Query: mengambil dan mengolah data',fns:'Get & Transform · Applied Steps',cert:['A1','E2'],preview:'pq',
 body:`<p>Power Query mengambil data dari berbagai sumber, membersihkannya, lalu memuatnya ke Excel. Setiap langkah dicatat, jadi saat data bulan depan datang, kamu cukup menekan <b>Refresh</b> dan semua langkah diulang otomatis.</p>
 <h3>Sumber data</h3>
 <p><b>Data › Get Data</b>: file Excel lain, CSV atau teks, folder berisi banyak file, database, halaman web, SharePoint, dan lainnya. <b>From Table/Range</b> mengambil data dari sheet yang sedang dibuka.</p>
 <h3>Transformasi yang paling sering dipakai</h3>
 <ul>
  <li>Hapus kolom, ubah nama kolom, ubah tipe data (teks, angka, tanggal).</li>
  <li>Filter baris, hapus baris kosong, hapus duplikat.</li>
  <li>Split Column berdasarkan pemisah, Trim dan Clean teks.</li>
  <li><b>Unpivot Columns</b>: mengubah tabel lebar (Jan, Feb, Mar sebagai kolom) menjadi tabel panjang yang siap dipivot.</li>
  <li><b>Group By</b>: meringkas seperti pivot.</li>
  <li><b>Merge Queries</b>: menggabungkan dua tabel berdasarkan kolom kunci, mirip VLOOKUP untuk seluruh tabel.</li>
  <li><b>Append Queries</b>: menumpuk beberapa tabel berstruktur sama, misalnya data Januari sampai Desember.</li>
 </ul>
 <h3>Applied Steps dan bahasa M</h3>
 <p>Panel <b>Applied Steps</b> di sebelah kanan editor mencatat setiap langkah. Klik sebuah langkah untuk melihat kondisi data saat itu. Di balik layar, langkah-langkah ditulis dalam bahasa M, yang bisa dilihat di <b>Advanced Editor</b>:</p>
 <pre class="code">let
    Sumber = Excel.CurrentWorkbook(){[Name="Penjualan"]}[Content],
    UbahTipe = Table.TransformColumnTypes(Sumber,{{"Tanggal", type date}, {"Nilai", type number}}),
    TanpaKosong = Table.SelectRows(UbahTipe, each [Nilai] &lt;&gt; null)
in
    TanpaKosong</pre>
 <p>Selesai mengolah, pilih <b>Close &amp; Load</b> untuk memuat hasilnya ke sheet, atau <b>Close &amp; Load To</b> untuk memuatnya ke Data Model saja.</p>`,
 quiz:[
  {q:'Kamu menerima 12 file CSV bulanan dengan struktur sama dan ingin menggabungkannya. Cara paling efisien?',opts:['Salin-tempel manual','Get Data › From Folder lalu Combine','VLOOKUP','Consolidate'],a:1,why:'From Folder menggabungkan semua file di folder dan bisa di-refresh saat ada file baru.'},
  {q:'Tabel punya kolom Jan, Feb, Mar, … dan kamu ingin satu kolom Bulan dan satu kolom Nilai. Fitur Power Query yang dipakai?',opts:['Group By','Merge Queries','Unpivot Columns','Transpose'],a:2,why:'Unpivot mengubah kolom menjadi baris.'},
 ]},

{id:'power-pivot',mod:'data',type:'read',title:'Data Model, Power Pivot, dan DAX',fns:'Relationships · Measure · DAX',cert:['E4'],preview:'model',
 body:`<p>Data Model menyimpan beberapa tabel sekaligus di dalam workbook dan menghubungkannya lewat relasi, tanpa perlu VLOOKUP untuk menyatukan kolom. Kapasitasnya jauh melampaui batas 1 juta baris per sheet.</p>
 <h3>Membuat relasi</h3>
 <ol class="steps">
  <li>Ubah setiap tabel menjadi Excel Table dengan nama yang jelas, misalnya <code>Penjualan</code>, <code>Produk</code>, dan <code>Cabang</code>.</li>
  <li>Buat PivotTable dan centang <i>Add this data to the Data Model</i>, atau muat lewat Power Query ke Data Model.</li>
  <li><b>Data › Relationships › New</b>: hubungkan <code>Penjualan[KodeProduk]</code> dengan <code>Produk[KodeProduk]</code>. Tabel Produk berisi kode unik (sisi "satu"), sedangkan Penjualan berisi banyak baris per kode (sisi "banyak").</li>
 </ol>
 <p>Setelah terhubung, satu PivotTable bisa menampilkan kategori dari tabel Produk dan nilai dari tabel Penjualan sekaligus.</p>
 <h3>Power Pivot dan DAX</h3>
 <p>Aktifkan add-in COM <b>Microsoft Power Pivot for Excel</b> untuk membuka jendela Power Pivot dan tampilan diagram. Di sana kamu menulis <b>measure</b> dengan bahasa DAX:</p>
 <pre class="code">Total Penjualan := SUM(Penjualan[Nilai])
Total Laba := SUMX(Penjualan, Penjualan[Qty] * (RELATED(Produk[Harga]) - RELATED(Produk[HPP])))
Margin % := DIVIDE([Total Laba], [Total Penjualan])
Penjualan Jakarta := CALCULATE([Total Penjualan], Cabang[Kota] = "Jakarta")</pre>
 <p>Measure dihitung sesuai konteks pivot. Margin % di baris "Jakarta" otomatis menjadi margin Jakarta saja. <code>DIVIDE</code> aman dari pembagian nol, dan <code>CALCULATE</code> mengubah konteks filter.</p>
 <div class="tip">Ketersediaan Power Pivot tergantung edisi Excel. Data Model dan relasi tersedia di Excel untuk Windows versi modern.</div>`,
 quiz:[
  {q:'Tabel Produk berisi satu baris per kode produk, tabel Penjualan berisi ribuan transaksi. Di relasi, Produk adalah sisi…',opts:['Banyak','Satu','Tidak ada','Keduanya sama'],a:1,why:'Kode produk unik di tabel Produk, jadi tabel itu sisi "satu".'},
  {q:'Fungsi DAX yang aman dari error pembagian nol?',opts:['SUM','DIVIDE','RELATED','CALCULATE'],a:1,why:'DIVIDE(a,b) mengembalikan kosong atau nilai alternatif saat b = 0.'},
 ]},

/* ================= KOLABORASI ================= */
{id:'tampilan',mod:'kolaborasi',type:'read',title:'Freeze panes dan tampilan lembar',fns:'Freeze · Split · New Window',cert:['A1'],preview:'freeze',
 body:`<p>Tabel panjang sulit dibaca ketika judul kolom hilang saat menggulir. <b>View › Freeze Panes</b> mengunci baris dan kolom tertentu agar selalu terlihat.</p>
 <ul>
  <li><b>Freeze Top Row</b>: baris 1 selalu terlihat.</li>
  <li><b>Freeze First Column</b>: kolom A selalu terlihat.</li>
  <li><b>Freeze Panes</b>: semua baris di atas dan semua kolom di kiri sel yang dipilih ikut terkunci. Pilih B2 untuk mengunci baris 1 dan kolom A sekaligus.</li>
 </ul>
 <h3>Melihat dua bagian sekaligus</h3>
 <ul>
  <li><b>Split</b> membagi layar menjadi dua atau empat bagian yang bisa digulir sendiri-sendiri.</li>
  <li><b>New Window</b> membuka jendela kedua untuk workbook yang sama. Lanjutkan dengan <b>Arrange All</b> atau <b>View Side by Side</b> untuk membandingkan dua sheet.</li>
 </ul>
 <h3>Pengaturan tampilan lain</h3>
 <ul>
  <li><b>Normal</b>, <b>Page Layout</b>, dan <b>Page Break Preview</b>: mode kerja, mode tata letak cetak, dan mode batas halaman.</li>
  <li><b>Show</b>: menyalakan atau mematikan gridlines, headings, dan formula bar.</li>
  <li><b>Hide/Unhide</b> baris, kolom, dan sheet lewat klik kanan.</li>
  <li><b>Custom Views</b> menyimpan kombinasi filter, ukuran, dan baris tersembunyi untuk dipanggil lagi. Tidak tersedia kalau workbook berisi Excel Table.</li>
 </ul>`,
 quiz:[
  {q:'Baris 1 dan kolom A ingin dikunci sekaligus. Sel mana yang dipilih sebelum Freeze Panes?',opts:['A1','A2','B1','B2'],a:3,why:'Semua yang di atas dan di kiri sel terpilih ikut terkunci.'},
  {q:'Kamu ingin membandingkan sheet Januari dan Februari dari workbook yang sama berdampingan. Langkahnya?',opts:['Split','New Window lalu View Side by Side','Freeze Panes','Zoom'],a:1,why:'New Window membuka jendela kedua untuk workbook yang sama.'},
 ]},

{id:'proteksi',mod:'kolaborasi',type:'read',title:'Melindungi sel, sheet, dan workbook',fns:'Protect Sheet · Lock · Encrypt',cert:['A1','E1'],preview:'protect',
 body:`<p>Proteksi mencegah rumus dan struktur laporan berubah tanpa sengaja. Ada tiga tingkat.</p>
 <h3>1. Mengunci sel dan sheet</h3>
 <ol class="steps">
  <li>Secara bawaan semua sel berstatus <i>Locked</i>, tetapi kunci itu baru berlaku setelah sheet diproteksi.</li>
  <li>Pilih sel yang boleh diisi pengguna, tekan <kbd>Ctrl</kbd>+<kbd>1</kbd> › tab <b>Protection</b>, lalu hapus centang <i>Locked</i>. Centang <i>Hidden</i> kalau rumusnya ingin disembunyikan dari bar rumus.</li>
  <li><b>Review › Protect Sheet</b>, isi kata sandi (opsional), dan pilih apa yang tetap boleh dilakukan, misalnya memilih sel, sort, atau memakai AutoFilter.</li>
 </ol>
 <p><b>Allow Edit Ranges</b> memberi kata sandi berbeda untuk area tertentu di sheet yang sama.</p>
 <h3>2. Melindungi struktur workbook</h3>
 <p><b>Review › Protect Workbook</b> mencegah sheet ditambah, dihapus, diganti nama, disembunyikan, atau dipindah.</p>
 <h3>3. Enkripsi file</h3>
 <p><b>File › Info › Protect Workbook › Encrypt with Password</b>. File tidak bisa dibuka tanpa kata sandi. Kata sandi yang lupa tidak bisa dipulihkan, jadi simpan di tempat aman.</p>
 <h3>Pilihan lain di File › Info</h3>
 <ul>
  <li><b>Mark as Final</b>: menandai file sebagai versi akhir dan hanya baca. Ini sifatnya pemberitahuan, bukan pengaman.</li>
  <li><b>Inspect Document</b>: mencari dan menghapus komentar, properti pribadi, baris tersembunyi, dan data sensitif lain sebelum file dibagikan.</li>
 </ul>
 <div class="tip">Proteksi sheet mencegah perubahan tidak sengaja, tetapi bukan pengamanan yang kuat. Untuk data rahasia, gunakan enkripsi file dan atur hak akses foldernya.</div>`,
 quiz:[
  {q:'Kamu memproteksi sheet, tapi pengguna tetap harus bisa mengisi kolom D. Apa yang dilakukan sebelum proteksi?',opts:['Menyembunyikan kolom D','Menghapus centang Locked di kolom D','Mengenkripsi file','Mark as Final'],a:1,why:'Sel yang tidak Locked tetap bisa diedit di sheet yang diproteksi.'},
  {q:'Fitur yang mencegah orang lain menghapus atau menambah sheet?',opts:['Protect Sheet','Protect Workbook (structure)','Allow Edit Ranges','Hidden'],a:1,why:'Protect Workbook mengunci struktur sheet.'},
 ]},

{id:'cetak',mod:'kolaborasi',type:'read',title:'Mengatur halaman dan mencetak',fns:'Print Area · Print Titles · Fit to page',cert:['A1'],preview:'print',
 body:`<p>Laporan yang rapi di layar belum tentu rapi saat dicetak atau diekspor ke PDF. Semua pengaturannya ada di tab <b>Page Layout</b> dan di <b>File › Print</b> (<kbd>Ctrl</kbd>+<kbd>P</kbd>).</p>
 <h3>Pengaturan penting</h3>
 <ul>
  <li><b>Print Area</b>: pilih rentang › Page Layout › Print Area › Set Print Area. Hanya bagian ini yang dicetak.</li>
  <li><b>Print Titles</b>: <i>Rows to repeat at top</i> diisi <code>$1:$1</code> agar judul kolom tercetak di setiap halaman.</li>
  <li><b>Orientation</b>: Landscape untuk tabel lebar.</li>
  <li><b>Scaling</b>: <i>Fit All Columns on One Page</i> supaya kolom tidak terpotong ke halaman berikutnya.</li>
  <li><b>Margins</b> dan <b>Center on page</b> (Page Setup › Margins) untuk posisi tabel.</li>
  <li><b>Header &amp; Footer</b>: nomor halaman (<code>&amp;[Page] dari &amp;[Pages]</code>), nama file, tanggal cetak.</li>
  <li><b>Sheet Options</b>: cetak gridlines dan judul baris/kolom kalau perlu.</li>
 </ul>
 <h3>Page Break Preview</h3>
 <p><b>View › Page Break Preview</b> menampilkan batas halaman sebagai garis biru. Seret garisnya untuk memindahkan batas, atau sisipkan pemisah manual di <b>Page Layout › Breaks</b>.</p>
 <h3>Ekspor PDF</h3>
 <p><b>File › Export › Create PDF/XPS</b>, atau pilih printer PDF di dialog Print. Di <i>Options</i> kamu bisa memilih hanya area terpilih, sheet aktif, atau seluruh workbook.</p>`,
 quiz:[
  {q:'Tabel 8 halaman. Judul kolom hanya tercetak di halaman pertama. Pengaturan yang diperbaiki?',opts:['Print Area','Print Titles › Rows to repeat at top','Orientation','Margins'],a:1,why:'Rows to repeat at top mengulang baris judul di setiap halaman.'},
  {q:'Kolom terakhir selalu terpotong ke halaman baru. Pengaturan paling cepat?',opts:['Fit All Columns on One Page','Freeze Panes','Wrap Text','Print Area'],a:0,why:'Scaling mengecilkan cetakan agar semua kolom muat satu halaman.'},
 ]},

{id:'audit-rumus',mod:'kolaborasi',type:'read',title:'Mencari dan memperbaiki error rumus',fns:'Trace · Evaluate · Watch Window',cert:['E3'],preview:'errors',
 body:`<p>Setiap kode error punya penyebab yang khas. Kenali dulu kodenya, lalu gunakan alat audit di <b>Formulas › Formula Auditing</b>.</p>
 <h3>Alat audit</h3>
 <ul>
  <li><b>Trace Precedents</b>: panah ke sel-sel yang dipakai rumus ini. Shortcut <kbd>Ctrl</kbd>+<kbd>[</kbd> melompat ke sel-sel itu.</li>
  <li><b>Trace Dependents</b>: panah ke rumus-rumus yang memakai sel ini. Periksa sebelum menghapus sebuah sel.</li>
  <li><b>Show Formulas</b> (<kbd>Ctrl</kbd>+<kbd>&#96;</kbd>): menampilkan rumus di semua sel, bukan hasilnya.</li>
  <li><b>Evaluate Formula</b>: menjalankan rumus selangkah demi selangkah, sangat membantu untuk rumus bertingkat.</li>
  <li><b>Error Checking</b>: memeriksa semua error di sheet satu per satu.</li>
  <li><b>Watch Window</b>: memantau nilai sel penting dari sheet lain sambil kamu bekerja.</li>
 </ul>
 <h3>Referensi melingkar</h3>
 <p>Rumus yang merujuk dirinya sendiri, langsung atau lewat sel lain, memunculkan peringatan <i>circular reference</i>. <b>Error Checking › Circular References</b> menunjukkan selnya. Untuk model yang memang sengaja melingkar, aktifkan <b>File › Options › Formulas › Enable iterative calculation</b>.</p>
 <h3>Mode perhitungan</h3>
 <p><b>Formulas › Calculation Options</b>: Automatic (bawaan) atau Manual. Dalam mode Manual, rumus baru dihitung saat kamu menekan <kbd>F9</kbd>. Ini berguna untuk file yang sangat berat, tetapi sering membuat bingung kalau lupa sedang aktif.</p>`,
 quiz:[
  {q:'Sebelum menghapus kolom C, kamu ingin tahu rumus mana saja yang memakainya. Alat yang tepat?',opts:['Trace Precedents','Trace Dependents','Show Formulas','Evaluate Formula'],a:1,why:'Dependents menunjukkan rumus yang bergantung pada sel itu.'},
  {q:'Rumus tidak berubah saat data diubah, dan baru berubah setelah F9. Penyebabnya?',opts:['Circular reference','Calculation Options sedang Manual','Sel diproteksi','Format Text'],a:1,why:'Mode Manual menunda perhitungan sampai F9 ditekan.'},
 ]},

{id:'kolaborasi-berbagi',mod:'kolaborasi',type:'read',title:'Komentar, berbagi, dan bekerja bersama',fns:'Comments · Notes · Version History',cert:['A1','E1'],preview:null,
 body:`<h3>Comment dan Note</h3>
 <p>Excel versi baru membedakan dua jenis catatan:</p>
 <ul>
  <li><b>Comment</b> (Review › New Comment): percakapan berbalas. Ketik <code>@nama</code> untuk menandai rekan kerja; ia akan menerima notifikasi email. Diskusi bisa ditandai selesai dengan <i>Resolve</i>.</li>
  <li><b>Note</b> (<kbd>Shift</kbd>+<kbd>F2</kbd>): catatan kuning sederhana tanpa balasan, cocok untuk keterangan tetap seperti sumber data.</li>
 </ul>
 <h3>Bekerja bersama</h3>
 <p>Simpan workbook di OneDrive atau SharePoint, lalu klik <b>Share</b>. Beberapa orang bisa mengedit bersamaan (co-authoring), dan perubahan tersimpan otomatis selama <b>AutoSave</b> aktif.</p>
 <ul>
  <li><b>Version History</b> (File › Info) memulihkan versi sebelumnya kalau ada perubahan yang keliru.</li>
  <li><b>Sheet View</b> (View › Sheet View) membuat filter dan sort pribadi tanpa mengganggu tampilan orang lain.</li>
 </ul>
 <h3>Sebelum dibagikan ke luar</h3>
 <ul>
  <li><b>Inspect Document</b>: menghapus komentar, properti penulis, dan data tersembunyi.</li>
  <li><b>Check Accessibility</b>: memeriksa teks alternatif pada gambar, nama tabel, dan kontras warna.</li>
  <li><b>Check Compatibility</b>: memeriksa fitur yang tidak didukung versi Excel lama, misalnya fungsi array dinamis.</li>
 </ul>
 <h3>Bahasa</h3>
 <p><b>File › Options › Language</b> mengatur bahasa tampilan Excel dan bahasa pemeriksa ejaan. Fungsi <code>TRANSLATE</code> di Microsoft 365 dan <b>Review › Translate</b> membantu menerjemahkan isi sel.</p>`,
 quiz:[
  {q:'Kamu ingin rekan kerja mendapat notifikasi untuk menjawab pertanyaan di sel tertentu. Gunakan…',opts:['Note','Comment dengan @mention','Data Validation','Hyperlink'],a:1,why:'@mention di Comment mengirim notifikasi.'},
  {q:'Rekan kerja tidak sengaja menghapus satu sheet di file bersama di OneDrive. Cara memulihkannya?',opts:['Ctrl + Z di komputermu','Version History','Inspect Document','Protect Workbook'],a:1,why:'Version History menyimpan versi-versi sebelumnya.'},
 ]},

{id:'opsi-workbook',mod:'kolaborasi',type:'read',title:'Opsi workbook, link, dan template',fns:'Options · Trust Center · Edit Links',cert:['E1'],preview:null,
 body:`<h3>File › Options yang perlu kamu tahu</h3>
 <ul>
  <li><b>General</b>: font bawaan, jumlah sheet di workbook baru, nama pengguna.</li>
  <li><b>Formulas</b>: mode perhitungan, iterative calculation, gaya referensi R1C1.</li>
  <li><b>Save</b>: format simpan bawaan, interval AutoRecover, lokasi file.</li>
  <li><b>Customize Ribbon</b>: menampilkan tab <b>Developer</b> dan membuat tab atau grup sendiri.</li>
  <li><b>Quick Access Toolbar</b>: menaruh perintah yang sering dipakai di bilah kecil di atas.</li>
  <li><b>Trust Center</b>: pengaturan macro, lokasi tepercaya, dan konten eksternal.</li>
 </ul>
 <h3>Merujuk data di workbook lain</h3>
 <p>Rumus bisa mengambil data dari file lain: <code>='[Penjualan 2026.xlsx]Jan'!$C$10</code>. Saat file sumber dipindah atau diganti nama, link perlu diperbarui di <b>Data › Edit Links</b> (di versi baru bernama <b>Workbook Links</b>). Di sana kamu bisa memperbarui nilai, mengganti sumber, atau memutus link menjadi nilai tetap.</p>
 <h3>Template</h3>
 <p>Simpan workbook yang sering dipakai ulang sebagai <code>.xltx</code> (atau <code>.xltm</code> kalau berisi macro). Saat dibuka, Excel membuat salinan baru sehingga template aslinya tidak tertimpa.</p>
 <h3>Menyalin macro antar-workbook</h3>
 <p>Di Visual Basic Editor (<kbd>Alt</kbd>+<kbd>F11</kbd>), seret modul dari satu project ke project lain di panel Project Explorer. Macro yang perlu dipakai di semua workbook bisa disimpan di <b>Personal Macro Workbook</b> (PERSONAL.XLSB).</p>`,
 quiz:[
  {q:'Tab Developer tidak muncul. Di mana menampilkannya?',opts:['File › Options › Customize Ribbon','View › Show','Review › Protect','Data › Edit Links'],a:0,why:'Centang Developer di Customize Ribbon.'},
  {q:'Format file untuk template yang berisi macro?',opts:['.xltx','.xlsm','.xltm','.xlsb'],a:2,why:'.xltm adalah template dengan macro.'},
 ]},

/* ================= OTOMASI ================= */
{id:'macro-recorder',mod:'otomasi',type:'read',title:'Merekam macro pertama',fns:'Record Macro · .xlsm',cert:['E3','E1'],preview:'macrorec',
 body:`<p>Macro adalah rangkaian perintah yang dijalankan otomatis. Cara termudah membuatnya adalah merekam langkah yang kamu lakukan secara manual.</p>
 <h3>Langkah merekam</h3>
 <ol class="steps">
  <li>Tampilkan tab <b>Developer</b> (File › Options › Customize Ribbon › centang Developer).</li>
  <li>Klik <b>Record Macro</b>. Beri nama tanpa spasi, misalnya <code>FormatLaporan</code>, pilih shortcut (opsional), dan tentukan lokasi: <i>This Workbook</i> atau <i>Personal Macro Workbook</i> agar bisa dipakai di semua file.</li>
  <li>Lakukan langkah-langkahnya: format judul, atur lebar kolom, beri border, dan seterusnya.</li>
  <li>Klik <b>Stop Recording</b>.</li>
  <li>Jalankan lagi lewat <b>Developer › Macros</b> (<kbd>Alt</kbd>+<kbd>F8</kbd>), shortcut yang tadi dipilih, atau tombol yang ditaruh di sheet.</li>
 </ol>
 <h3>Referensi relatif</h3>
 <p>Secara bawaan, recorder mencatat alamat sel tetap, misalnya <code>Range("A1:D6").Select</code>. Klik <b>Use Relative References</b> sebelum merekam kalau macro harus bekerja mulai dari sel mana pun yang sedang dipilih; kodenya menjadi <code>ActiveCell.Offset(1, 0).Range("A1").Select</code>.</p>
 <h3>Membaca kode hasil rekaman</h3>
 <ul>
  <li>Rumus yang kamu ketik disimpan dalam gaya R1C1: <code>=SUM(C2:C6)</code> di C7 menjadi <code>ActiveCell.FormulaR1C1 = "=SUM(R[-5]C:R[-1]C)"</code>, artinya "5 baris di atas sampai 1 baris di atas, kolom yang sama".</li>
  <li>Recorder menulis banyak <code>.Select</code>. Di VBE kamu bisa merapikannya: <code>Range("A1:D1").Font.Bold = True</code> tanpa Select dulu.</li>
  <li>Macro absolut hanya menyentuh range yang terekam. Kalau data bulan depan lebih panjang, pakai kolom utuh (klik huruf kolom saat merekam) atau ubah kodenya menjadi <code>Range("A1").CurrentRegion</code>.</li>
  <li>Macro tidak bisa di-<i>Undo</i> (<kbd>Ctrl</kbd>+<kbd>Z</kbd>). Simpan file sebelum mencoba macro baru.</li>
 </ul>
 <h3>Menyimpan dan keamanan</h3>
 <ul>
  <li>Simpan sebagai <code>.xlsm</code>. File <code>.xlsx</code> akan membuang semua macro.</li>
  <li>Macro dari file yang diunduh diblokir secara bawaan. Buka properti file di Windows dan centang <i>Unblock</i>, atau simpan di lokasi tepercaya (Trust Center › Trusted Locations).</li>
  <li><b>Macro Settings</b> di Trust Center mengatur apakah macro dinonaktifkan dengan atau tanpa notifikasi.</li>
 </ul>
 <h3>Menempatkan tombol</h3>
 <p><b>Developer › Insert › Button (Form Control)</b>, gambar tombolnya di sheet, lalu pilih macro yang dijalankan. Bisa juga klik kanan sebuah shape › <b>Assign Macro</b>, atau tambahkan macro ke Quick Access Toolbar.</p>
 <p>Coba di simulasi: rekam, lihat kodenya muncul baris per baris di panel Visual Basic, jalankan di sheet Agustus, lalu simpan sebagai .xlsm.</p>`,
 quiz:[
  {q:'Macro hilang setelah file disimpan ulang. Penyebab paling mungkin?',opts:['Disimpan sebagai .xlsx','Lupa Stop Recording','Shortcut bentrok','Sheet diproteksi'],a:0,why:'.xlsx tidak menyimpan macro. Gunakan .xlsm.'},
  {q:'Macro harus bisa dipakai di semua workbook di komputermu. Simpan di…',opts:['This Workbook','New Workbook','Personal Macro Workbook','Template'],a:2,why:'Personal Macro Workbook terbuka otomatis setiap Excel dijalankan.'},
 ]},

{id:'vba-dasar',mod:'otomasi',type:'read',title:'VBA dasar: editor, Sub, Range, variabel',fns:'Alt+F11 · Sub · Range · Cells · Dim',cert:['E3'],preview:'vbe',
 body:`<p>VBA (Visual Basic for Applications) adalah bahasa di balik macro. Dengan menulis kode sendiri, kamu bisa membuat otomatisasi yang tidak bisa direkam, misalnya pengulangan dan keputusan.</p>
 <h3>Visual Basic Editor</h3>
 <p>Tekan <kbd>Alt</kbd>+<kbd>F11</kbd>. Di panel kiri ada Project Explorer. Klik kanan nama workbook › <b>Insert › Module</b> untuk membuat tempat menulis kode. Jalankan kode dengan menaruh kursor di dalam Sub lalu tekan <kbd>F5</kbd>, atau <kbd>F8</kbd> untuk menjalankan baris demi baris.</p>
 <h3>Sub dan MsgBox</h3>
 <pre class="code">Sub SapaPengguna()
    MsgBox "Laporan siap diproses"
End Sub</pre>
 <h3>Menulis ke sel</h3>
 <pre class="code">Sub IsiKepalaLaporan()
    Range("B1").Value = Date
    Range("B1").NumberFormat = "dd mmmm yyyy"
    Cells(2, 2).Value = "Disusun oleh: Bagian Keuangan"
    Range("A4:F4").Font.Bold = True
End Sub</pre>
 <p><code>Range("B1")</code> dan <code>Cells(2, 2)</code> sama-sama menunjuk sel. Cells memakai nomor baris dan kolom, jadi mudah dipakai di dalam pengulangan.</p>
 <h3>Variabel dan baris terakhir</h3>
 <pre class="code">Sub HitungTotal()
    Dim terakhir As Long
    Dim total As Double
    terakhir = Cells(Rows.Count, "A").End(xlUp).Row
    total = Application.WorksheetFunction.Sum(Range("C2:C" &amp; terakhir))
    MsgBox "Total penjualan: " &amp; Format(total, "#,##0")
End Sub</pre>
 <p><code>Dim</code> mendeklarasikan variabel. Baris <code>Cells(Rows.Count, "A").End(xlUp).Row</code> adalah pola paling umum di VBA: mencari baris terakhir yang berisi data di kolom A, sama seperti menekan <kbd>Ctrl</kbd>+<kbd>↑</kbd> dari dasar sheet. <code>Application.WorksheetFunction</code> memberi akses ke fungsi Excel seperti SUM dan VLOOKUP.</p>
 <div class="tip">Tulis <code>Option Explicit</code> di baris paling atas modul. VBA akan menolak variabel yang belum dideklarasikan, sehingga salah ketik nama variabel langsung ketahuan.</div>`,
 quiz:[
  {q:'Shortcut membuka Visual Basic Editor?',opts:['Alt + F8','Alt + F11','Ctrl + F11','F5'],a:1,why:'Alt + F11 membuka VBE. Alt + F8 membuka daftar macro.'},
  {q:'Cells(3, 2) menunjuk sel…',opts:['C2','B3','3B','C3'],a:1,why:'Cells(baris, kolom): baris 3, kolom 2 (B).'},
  {q:'Apa fungsi Option Explicit?',opts:['Mempercepat macro','Mewajibkan semua variabel dideklarasikan','Menyembunyikan kode','Mengunci workbook'],a:1,why:'Variabel yang belum di-Dim akan memicu error saat kompilasi.'},
 ]},

{id:'vba-logika',mod:'otomasi',type:'read',title:'VBA: keputusan dan pengulangan',fns:'If · For · For Each · Do While',cert:['E3'],preview:null,
 body:`<h3>If … Then … Else</h3>
 <pre class="code">If Range("E2").Value &gt;= Range("D2").Value Then
    Range("F2").Value = "Tercapai"
ElseIf Range("E2").Value &gt;= Range("D2").Value * 0.8 Then
    Range("F2").Value = "Hampir"
Else
    Range("F2").Value = "Belum"
End If</pre>
 <h3>For … Next: mengulang setiap baris</h3>
 <p>Contoh: menandai faktur yang lewat jatuh tempo dan belum lunas.</p>
 <pre class="code">Sub TandaiJatuhTempo()
    Dim i As Long, terakhir As Long
    terakhir = Cells(Rows.Count, "A").End(xlUp).Row
    For i = 2 To terakhir
        If Cells(i, "D").Value &lt; Date And Cells(i, "E").Value &lt;&gt; "Lunas" Then
            Cells(i, "F").Value = "Terlambat"
            Cells(i, "F").Interior.Color = RGB(252, 228, 214)
        Else
            Cells(i, "F").Value = ""
            Cells(i, "F").Interior.ColorIndex = xlNone
        End If
    Next i
End Sub</pre>
 <h3>For Each: mengulang setiap sel atau sheet</h3>
 <pre class="code">Sub RapikanNama()
    Dim sel As Range
    For Each sel In Selection
        If Not IsEmpty(sel.Value) Then
            sel.Value = Application.WorksheetFunction.Proper( _
                        Application.WorksheetFunction.Trim(sel.Value))
        End If
    Next sel
End Sub</pre>
 <p>Garis bawah di akhir baris (<code> _</code>) menyambung satu perintah ke baris berikutnya.</p>
 <h3>Do While: mengulang sampai kondisi berhenti</h3>
 <pre class="code">Sub HitungBarisIsi()
    Dim r As Long
    r = 2
    Do While Cells(r, "A").Value &lt;&gt; ""
        r = r + 1
    Loop
    MsgBox "Data berisi " &amp; (r - 2) &amp; " baris"
End Sub</pre>
 <h3>Mempercepat macro</h3>
 <pre class="code">Application.ScreenUpdating = False
Application.Calculation = xlCalculationManual
' … proses berat …
Application.Calculation = xlCalculationAutomatic
Application.ScreenUpdating = True</pre>`,
 quiz:[
  {q:'Pengulangan yang paling cocok untuk memproses setiap sel di area yang dipilih pengguna?',opts:['For i = 1 To 10','For Each sel In Selection','Do While True','If Then'],a:1,why:'For Each mengulang setiap anggota koleksi, termasuk setiap sel di Selection.'},
  {q:'Baris kode Application.ScreenUpdating = False berguna untuk…',opts:['Menyembunyikan sheet','Mempercepat macro dengan tidak menggambar ulang layar','Mengunci workbook','Menghapus format'],a:1,why:'Layar tidak diperbarui selama proses, sehingga macro jauh lebih cepat.'},
 ]},

{id:'vba-kantor',mod:'otomasi',type:'read',title:'Macro siap pakai untuk kantor',fns:'Pecah sheet · Gabung sheet · PDF · Proteksi',cert:['E3'],preview:null,
 body:`<p>Contoh-contoh berikut bisa langsung disalin ke modul dan disesuaikan nama sheet serta kolomnya. Selalu coba di salinan file terlebih dahulu.</p>
 <h3>1. Memecah data per cabang ke sheet terpisah</h3>
 <pre class="code">Sub PecahPerCabang()
    Dim wsData As Worksheet, ws As Worksheet
    Dim i As Long, terakhir As Long, cabang As String
    Set wsData = ThisWorkbook.Worksheets("Data")
    terakhir = wsData.Cells(wsData.Rows.Count, "A").End(xlUp).Row
    Application.ScreenUpdating = False
    For i = 2 To terakhir
        cabang = wsData.Cells(i, "B").Value
        Set ws = Nothing
        On Error Resume Next
        Set ws = ThisWorkbook.Worksheets(cabang)
        On Error GoTo 0
        If ws Is Nothing Then
            Set ws = ThisWorkbook.Worksheets.Add( _
                After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
            ws.Name = cabang
            wsData.Rows(1).Copy ws.Rows(1)
        End If
        wsData.Rows(i).Copy ws.Cells(ws.Cells(ws.Rows.Count, "A").End(xlUp).Row + 1, 1)
    Next i
    Application.ScreenUpdating = True
    MsgBox "Data sudah dipisah per cabang"
End Sub</pre>
 <h3>2. Menggabungkan semua sheet ke sheet Rekap</h3>
 <pre class="code">Sub GabungSemuaSheet()
    Dim ws As Worksheet, rekap As Worksheet
    Dim tujuan As Long, terakhir As Long, kolom As Long
    Set rekap = ThisWorkbook.Worksheets("Rekap")
    rekap.Cells.Clear
    tujuan = 1
    For Each ws In ThisWorkbook.Worksheets
        If ws.Name &lt;&gt; rekap.Name Then
            terakhir = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
            kolom = ws.Cells(1, ws.Columns.Count).End(xlToLeft).Column
            If tujuan = 1 Then
                ws.Range(ws.Cells(1, 1), ws.Cells(terakhir, kolom)).Copy rekap.Cells(1, 1)
            ElseIf terakhir &gt; 1 Then
                ws.Range(ws.Cells(2, 1), ws.Cells(terakhir, kolom)).Copy rekap.Cells(tujuan, 1)
            End If
            tujuan = rekap.Cells(rekap.Rows.Count, "A").End(xlUp).Row + 1
        End If
    Next ws
End Sub</pre>
 <h3>3. Menyimpan sheet aktif sebagai PDF bertanggal</h3>
 <pre class="code">Sub SimpanSebagaiPDF()
    Dim nama As String
    nama = ThisWorkbook.Path &amp; Application.PathSeparator &amp; _
           "Laporan_" &amp; Format(Date, "yyyymmdd") &amp; ".pdf"
    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, Filename:=nama
    MsgBox "Tersimpan di " &amp; nama
End Sub</pre>
 <h3>4. Memproteksi semua sheet sekaligus</h3>
 <pre class="code">Sub KunciSemuaSheet()
    Dim ws As Worksheet, sandi As String
    sandi = InputBox("Masukkan kata sandi proteksi")
    If sandi = "" Then Exit Sub
    For Each ws In ThisWorkbook.Worksheets
        ws.Protect Password:=sandi, AllowFiltering:=True
    Next ws
    MsgBox "Semua sheet sudah dikunci"
End Sub</pre>`,
 quiz:[
  {q:'Di macro PecahPerCabang, apa gunanya On Error Resume Next sebelum Set ws = Worksheets(cabang)?',opts:['Mempercepat macro','Mencegah error kalau sheet cabang belum ada','Menghapus sheet lama','Menyembunyikan sheet'],a:1,why:'Kalau sheet belum ada, ws tetap Nothing dan macro membuat sheet baru.'},
  {q:'Kenapa contoh PDF memakai Application.PathSeparator?',opts:['Agar nama file berwarna','Agar pemisah folder benar di Windows maupun Mac','Agar PDF terenkripsi','Tidak ada alasan'],a:1,why:'Windows memakai \\ sedangkan Mac memakai /.'},
 ]},

{id:'vba-event-udf',mod:'otomasi',type:'read',title:'Event, fungsi buatan sendiri, dan UserForm',fns:'Worksheet_Change · Function · UserForm',cert:['E3'],preview:null,
 body:`<h3>Event: kode yang berjalan sendiri</h3>
 <p>Event dijalankan otomatis saat sesuatu terjadi. Kodenya ditulis di modul sheet atau di <i>ThisWorkbook</i>, bukan di Module biasa. Contoh: mencatat waktu setiap kali kolom C (status) diubah.</p>
 <pre class="code">Private Sub Worksheet_Change(ByVal Target As Range)
    If Not Intersect(Target, Me.Range("C:C")) Is Nothing Then
        Application.EnableEvents = False
        Target.Offset(0, 1).Value = Now
        Application.EnableEvents = True
    End If
End Sub</pre>
 <p><code>EnableEvents = False</code> mencegah perubahan oleh macro memicu event yang sama berulang-ulang. Event lain yang sering dipakai: <code>Workbook_Open</code>, <code>Workbook_BeforeSave</code>, dan <code>Worksheet_SelectionChange</code>.</p>
 <h3>Fungsi buatan sendiri (UDF)</h3>
 <p>Function di Module biasa bisa dipakai di sheet seperti fungsi bawaan.</p>
 <pre class="code">Function HargaNetto(harga As Double, diskon As Double, _
                    Optional pajak As Double = 0.11) As Double
    HargaNetto = Application.WorksheetFunction.Round( _
                 harga * (1 - diskon) * (1 + pajak), 0)
End Function</pre>
 <p>Di sheet: <code>=HargaNetto(B2,C2)</code>. Contoh ini sengaja memakai Round milik Excel, karena fungsi <code>Round</code> bawaan VBA memakai pembulatan bankir: 2,5 dibulatkan menjadi 2, bukan 3.</p>
 <h3>UserForm: formulir input</h3>
 <ol class="steps">
  <li>Di VBE: <b>Insert › UserForm</b>. Tambahkan TextBox (beri nama <code>txtNama</code>), ComboBox (<code>cboDivisi</code>), dan CommandButton (<code>btnSimpan</code>) dari Toolbox.</li>
  <li>Klik dua kali tombol untuk menulis kodenya:</li>
 </ol>
 <pre class="code">Private Sub UserForm_Initialize()
    Me.cboDivisi.List = Array("Keuangan", "HRD", "Penjualan", "Gudang")
End Sub

Private Sub btnSimpan_Click()
    Dim ws As Worksheet, baris As Long
    If Trim(Me.txtNama.Value) = "" Then
        MsgBox "Nama wajib diisi", vbExclamation
        Exit Sub
    End If
    Set ws = ThisWorkbook.Worksheets("Data")
    baris = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row + 1
    ws.Cells(baris, 1).Value = Me.txtNama.Value
    ws.Cells(baris, 2).Value = Me.cboDivisi.Value
    ws.Cells(baris, 3).Value = Date
    Unload Me
End Sub</pre>
 <p>Tampilkan formulir dari macro biasa dengan <code>UserForm1.Show</code>, lalu pasang macro itu di sebuah tombol.</p>`,
 quiz:[
  {q:'Di mana kode Worksheet_Change ditulis?',opts:['Module biasa','Modul sheet yang bersangkutan','UserForm','Personal Macro Workbook'],a:1,why:'Event sheet ditulis di modul milik sheet itu.'},
  {q:'Hasil Round(2.5, 0) di VBA adalah…',opts:['3','2','2,5','Error'],a:1,why:'VBA memakai pembulatan bankir ke angka genap terdekat.'},
 ]},

/* ================= LATIHAN ================= */
{id:'sebaran-data',mod:'lanjut',title:'Sebaran data: STDEV dan VAR',fns:'STDEV.S · STDEV.P · VAR.S',cert:['E3'],
 intro:`<p>Rata-rata saja belum cukup. Dua toko bisa punya rata-rata penjualan sama, tapi yang satu stabil dan yang lain naik-turun tajam. <b>Simpangan baku</b> mengukur seberapa jauh data menyebar dari rata-ratanya.</p>
 <p>Pakai <code>STDEV.S</code> kalau datanya <b>sampel</b> (sebagian hari, sebagian pelanggan), dan <code>STDEV.P</code> kalau datanya <b>seluruh populasi</b>. <code>VAR.S</code> dan <code>VAR.P</code> adalah kuadrat dari simpangan baku. Versi lama <code>STDEV</code> dan <code>VAR</code> sama dengan versi .S.</p>`,
 syntax:'=STDEV.S(B2:B9)',parts:[['B2:B9','data penjualan harian (sampel)']],
 task:'Isi <code>E2</code> dengan simpangan baku penjualan harian Toko A (sampel 8 hari).',
 cols:5,rows:9,target:'E2',solution:'=STDEV.S(B2:B9)',use:['STDEV.S|STDEV'],
 hint:'Delapan hari ini hanya sampel dari seluruh hari, jadi pakai STDEV.S.',
 data:{A1:'Hari',B1:'Toko A',C1:'Toko B',A2:'Sen',B2:4200000,C2:3100000,A3:'Sel',B3:4350000,C3:5900000,A4:'Rab',B4:4100000,C4:2400000,A5:'Kam',B5:4280000,C5:6100000,A6:'Jum',B6:4500000,C6:3500000,A7:'Sab',B7:4650000,C7:5200000,A8:'Min',B8:4400000,C8:4300000,A9:'Sen',B9:4320000,C9:4100000,D1:'Ukuran',D2:'Simpangan A',E1:'Nilai'},
 note:'<p>Coba juga <code>=STDEV.S(C2:C9)</code> di sel lain: rata-ratanya mirip, tapi Toko B jauh lebih tidak stabil.</p>'},

{id:'korelasi-tren',mod:'lanjut',title:'Korelasi dan garis tren',fns:'CORREL · SLOPE · INTERCEPT · RSQ',cert:['E3'],
 intro:`<p><code>CORREL</code> mengukur seberapa kuat dua data bergerak bersama, dari −1 (berlawanan) sampai 1 (searah sempurna). Angka di atas 0,7 biasanya dianggap hubungan kuat.</p>
 <p><code>SLOPE</code> dan <code>INTERCEPT</code> memberi persamaan garis tren <i>y = intercept + slope × x</i>, sama seperti trendline di grafik. <code>RSQ</code> (R²) menunjukkan berapa persen variasi y yang dijelaskan oleh x.</p>`,
 syntax:'=CORREL(B2:B9,C2:C9)',parts:[['B2:B9','biaya iklan'],['C2:C9','penjualan']],
 task:'Isi <code>F2</code> dengan koefisien korelasi antara biaya iklan dan penjualan.',
 cols:6,rows:9,target:'F2',solution:'=CORREL(B2:B9,C2:C9)',use:['CORREL|PEARSON'],
 hint:'Urutan kedua rentang boleh dibalik; hasil CORREL tetap sama.',
 data:{A1:'Bulan',B1:'Iklan (juta)',C1:'Penjualan (juta)',A2:'Jan',B2:12,C2:180,A3:'Feb',B3:15,C3:205,A4:'Mar',B4:9,C4:150,A5:'Apr',B5:20,C5:248,A6:'Mei',B6:18,C6:232,A7:'Jun',B7:11,C7:171,A8:'Jul',B8:24,C8:276,A9:'Agu',B9:16,C9:214,E1:'Ukuran',E2:'Korelasi',E3:'Slope',F3:'=SLOPE(C2:C9,B2:B9)',E4:'Intercept',F4:'=INTERCEPT(C2:C9,B2:B9)',E5:'R²',F5:'=RSQ(C2:C9,B2:B9)'}},

{id:'peramalan',mod:'lanjut',title:'Meramal dengan FORECAST dan TREND',fns:'FORECAST.LINEAR · TREND · GROWTH',cert:['E3','E4'],
 intro:`<p><code>FORECAST.LINEAR</code> menarik garis lurus dari data masa lalu lalu membaca nilainya di titik x yang baru, misalnya bulan ke-13. <code>TREND</code> melakukan hal yang sama untuk banyak titik sekaligus (hasilnya tumpah), dan <code>GROWTH</code> memakai kurva eksponensial untuk data yang tumbuh berlipat.</p>
 <p>Di menu Excel, <b>Data › Forecast Sheet</b> membuat grafik peramalan otomatis dengan <code>FORECAST.ETS</code> yang memperhitungkan pola musiman.</p>`,
 syntax:'=FORECAST.LINEAR(A14,B2:B13,A2:A13)',parts:[['A14','x yang diramal (bulan ke-13)'],['B2:B13','nilai y yang diketahui'],['A2:A13','nilai x yang diketahui']],
 task:'Isi <code>B14</code> dengan ramalan penjualan bulan ke-13.',
 cols:3,rows:14,target:'B14',solution:'=FORECAST.LINEAR(A14,B2:B13,A2:A13)',use:['FORECAST.LINEAR|FORECAST|TREND'],
 hint:'Urutan argumennya: x baru, lalu y yang diketahui, lalu x yang diketahui.',
 data:{A1:'Bulan ke-',B1:'Penjualan (unit)',A2:1,B2:410,A3:2,B3:432,A4:3,B4:428,A5:4,B5:455,A6:5,B6:471,A7:6,B7:466,A8:7,B8:492,A9:8,B9:505,A10:9,B10:498,A11:10,B11:526,A12:11,B12:540,A13:12,B13:552,A14:13}},

{id:'frekuensi',mod:'lanjut',title:'Distribusi frekuensi',fns:'FREQUENCY · COUNTIFS',cert:['E3'],
 intro:`<p><code>FREQUENCY</code> menghitung berapa data yang jatuh di setiap kelas (bin). Kamu cukup menulis batas atas tiap kelas, dan hasilnya tumpah ke bawah dengan satu baris tambahan untuk data di atas batas terakhir.</p>
 <p>Ini dasar dari histogram. Di Excel 365 hasilnya langsung tumpah; di versi lama harus dimasukkan sebagai array formula dengan <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd>.</p>`,
 syntax:'=FREQUENCY(B2:B13,D2:D5)',parts:[['B2:B13','data nilai'],['D2:D5','batas atas tiap kelas']],
 task:'Isi <code>E2</code> dengan jumlah peserta di setiap kelas nilai (hasilnya tumpah sampai E6).',
 cols:5,rows:13,target:'E2',solution:'=FREQUENCY(B2:B13,D2:D5)',use:['FREQUENCY|COUNTIFS'],
 hint:'Kelas pertama berisi nilai ≤ 59, kelas kedua 60–69, dan seterusnya. Baris terakhir menghitung nilai di atas 89.',
 data:{A1:'Peserta',B1:'Nilai',A2:'Andi',B2:72,A3:'Budi',B3:58,A4:'Citra',B4:91,A5:'Dewi',B5:66,A6:'Eko',B6:84,A7:'Fajar',B7:77,A8:'Gita',B8:69,A9:'Hana',B9:95,A10:'Irfan',B10:81,A11:'Joko',B11:54,A12:'Kartika',B12:88,A13:'Lukman',B13:73,D1:'Batas atas',D2:59,D3:69,D4:79,D5:89,E1:'Jumlah',C1:''}},

{id:'fungsi-database',mod:'lanjut',title:'Fungsi database: DSUM dan kawan-kawan',fns:'DSUM · DCOUNT · DAVERAGE · DGET',cert:['E3'],
 intro:`<p>Fungsi D (<code>DSUM</code>, <code>DAVERAGE</code>, <code>DCOUNT</code>, <code>DMAX</code>, <code>DGET</code>, …) bekerja dengan <b>rentang kriteria</b>: sebuah tabel kecil berisi judul kolom yang sama dengan data, lalu syaratnya di bawahnya.</p>
 <p>Syarat di <b>satu baris</b> berarti DAN; syarat di <b>baris berbeda</b> berarti ATAU. Keuntungannya, kriteria bisa diubah tanpa menyentuh rumus, dan logika ATAU jadi mudah. Ini juga dasar dari <b>Advanced Filter</b>.</p>`,
 syntax:'=DSUM(A1:D10,"Nilai",F1:G2)',parts:[['A1:D10','database lengkap dengan judul'],['"Nilai"','kolom yang dijumlahkan (nama atau nomor kolom)'],['F1:G2','rentang kriteria: judul + syarat']],
 task:'Isi <code>G5</code> dengan total nilai transaksi cabang <b>Bandung</b> yang nilainya di atas 5 juta, sesuai kriteria di F1:G2.',
 cols:7,rows:10,target:'G5',solution:'=DSUM(A1:D10,"Nilai",F1:G2)',use:['DSUM|SUMIFS'],
 hint:'Judul di F1:G1 sama persis dengan judul di data (Cabang dan Nilai), dan syaratnya di baris 2.',
 data:{A1:'Tanggal',B1:'Cabang',C1:'Sales',D1:'Nilai',A2:'03/10',B2:'Bandung',C2:'Rina',D2:7200000,A3:'03/10',B3:'Jakarta',C3:'Yusuf',D3:9100000,A4:'04/10',B4:'Bandung',C4:'Maya',D4:3400000,A5:'05/10',B5:'Surabaya',C5:'Hendra',D5:6100000,A6:'06/10',B6:'Bandung',C6:'Rina',D6:8800000,A7:'07/10',B7:'Jakarta',C7:'Maya',D7:4900000,A8:'08/10',B8:'Bandung',C8:'Yusuf',D8:5200000,A9:'09/10',B9:'Surabaya',C9:'Rina',D9:2700000,A10:'10/10',B10:'Bandung',C10:'Hendra',D10:4100000,
  F1:'Cabang',G1:'Nilai',F2:'Bandung',G2:'>5000000',F5:'Total',F6:'Jumlah transaksi',G6:'=DCOUNT(A1:D10,"Nilai",F1:G2)'}},

{id:'fungsi-informasi',mod:'lanjut',title:'Fungsi informasi: memeriksa isi sel',fns:'ISNUMBER · ISTEXT · ISBLANK · ISERR · TYPE',cert:['E3'],
 intro:`<p>Fungsi IS… menjawab pertanyaan "isi sel ini apa?" dengan TRUE atau FALSE: <code>ISNUMBER</code>, <code>ISTEXT</code>, <code>ISBLANK</code>, <code>ISERROR</code>, <code>ISERR</code> (error selain #N/A), <code>ISNA</code>, <code>ISEVEN</code>, <code>ISODD</code>, <code>ISFORMULA</code>. <code>TYPE</code> memberi kode jenis data.</p>
 <p>Masalah klasik di kantor: angka hasil ekspor sistem tersimpan sebagai <b>teks</b>, sehingga tidak ikut dijumlahkan SUM. Di Excel, sel seperti ini biasanya rata kiri dan bertanda segitiga hijau. Dengan <code>ISTEXT</code> kamu bisa menghitung berapa banyak yang bermasalah, lalu memperbaikinya dengan <code>VALUE</code> atau <b>Data › Text to Columns</b>.</p>`,
 syntax:'=SUMPRODUCT(--ISTEXT(B2:B9))',parts:[['ISTEXT(B2:B9)','TRUE untuk setiap sel berisi teks'],['--','mengubah TRUE/FALSE menjadi 1/0']],
 task:'Isi <code>E2</code> dengan jumlah sel di kolom Nilai yang tersimpan sebagai <b>teks</b>, bukan angka.',
 cols:5,rows:9,target:'E2',solution:'=SUMPRODUCT(--ISTEXT(B2:B9))',use:['ISTEXT|ISNUMBER|ISNONTEXT'],
 hint:'Bisa juga COUNTA(B2:B9) − COUNT(B2:B9). Pastikan fungsi IS… tetap dipakai.',
 data:{A1:'Faktur',B1:'Nilai',A2:'INV-01',B2:1250000,A3:'INV-02',B3:"'980000",A4:'INV-03',B4:2310000,A5:'INV-04',B5:'1.450.000',A6:'INV-05',B6:760000,A7:'INV-06',B7:"'3100000",A8:'INV-07',B8:1890000,A9:'INV-08',B9:540000,D1:'Cek',D2:'Tersimpan sebagai teks',E1:'Jumlah',D3:'Total SUM',E3:'=SUM(B2:B9)'}},

{id:'mod-quotient',mod:'lanjut',title:'Sisa bagi dan hasil bagi bulat',fns:'MOD · QUOTIENT · INT',cert:['E3'],
 intro:`<p><code>QUOTIENT</code> memberi bagian bulat hasil bagi, <code>MOD</code> memberi sisanya. Pasangan ini dipakai untuk mengubah menit menjadi jam dan menit, membagi barang ke dalam dus, menandai baris genap dan ganjil (<code>MOD(ROW(),2)</code>), atau membuat siklus jadwal.</p>`,
 syntax:'=QUOTIENT(B2,60)&" jam "&MOD(B2,60)&" menit"',parts:[['QUOTIENT(B2,60)','jam penuh'],['MOD(B2,60)','sisa menit']],
 task:'Isi <code>C2</code> dengan durasi lembur dalam format <b>X jam Y menit</b>, misalnya <i>2 jam 15 menit</i>.',
 cols:3,rows:6,target:'C2',solution:'=QUOTIENT(B2,60)&" jam "&MOD(B2,60)&" menit"',use:['MOD','QUOTIENT|INT|TRUNC|ROUNDDOWN'],cs:true,fill:['C3','C4','C5','C6'],
 hint:'Gabungkan hasil QUOTIENT dan MOD dengan & dan teks " jam " serta " menit".',
 data:{A1:'Karyawan',B1:'Lembur (menit)',C1:'Durasi',A2:'Andi',B2:135,A3:'Budi',B3:90,A4:'Citra',B4:240,A5:'Dewi',B5:45,A6:'Eko',B6:185}},

{id:'konversi-satuan',mod:'lanjut',title:'Konversi satuan dan basis bilangan',fns:'CONVERT · DEC2BIN · ROMAN · BASE',cert:['E3'],
 intro:`<p><code>CONVERT</code> mengubah satuan tanpa perlu menghafal faktor: panjang (<code>"mi"</code>, <code>"km"</code>, <code>"ft"</code>, <code>"m"</code>), berat (<code>"lbm"</code>, <code>"kg"</code>), suhu (<code>"F"</code>, <code>"C"</code>), waktu, volume, dan lainnya. Kode satuannya peka huruf besar kecil.</p>
 <p>Untuk basis bilangan ada <code>DEC2BIN</code>, <code>DEC2HEX</code>, <code>HEX2DEC</code>, dan <code>BASE</code>. <code>ROMAN</code> dan <code>ARABIC</code> mengubah angka Romawi.</p>`,
 syntax:'=CONVERT(B2,"mi","km")',parts:[['B2','angka asal'],['"mi"','satuan asal (mil)'],['"km"','satuan tujuan']],
 task:'Data jarak pengiriman dari vendor luar negeri masih dalam <b>mil</b>. Isi <code>C2</code> dengan jaraknya dalam kilometer, lalu salin ke bawah.',
 cols:3,rows:5,target:'C2',solution:'=CONVERT(B2,"mi","km")',use:['CONVERT'],fill:['C3','C4','C5'],
 hint:'Kode mil adalah "mi" dan kilometer "km".',
 data:{A1:'Rute',B1:'Jarak (mil)',C1:'Jarak (km)',A2:'Gudang–Pelabuhan',B2:18,A3:'Pelabuhan–Pabrik',B3:42.5,A4:'Pabrik–Distributor',B4:96,A5:'Distributor–Toko',B5:7.2}},

{id:'hari-kerja-intl',mod:'lanjut',title:'Hari kerja dengan akhir pekan khusus',fns:'NETWORKDAYS.INTL · WORKDAY.INTL',cert:['E3'],
 intro:`<p>Tidak semua kantor libur Sabtu–Minggu. Toko ritel sering libur Minggu saja, pabrik bisa punya shift berbeda. Versi <code>.INTL</code> menerima <b>kode akhir pekan</b>: 1 = Sabtu–Minggu, 11 = Minggu saja, 17 = Sabtu saja, 7 = Jumat–Sabtu.</p>
 <p>Bisa juga memakai teks 7 karakter mulai Senin, misalnya <code>"0000011"</code> (Sabtu–Minggu libur) atau <code>"0000001"</code> (Minggu saja).</p>`,
 syntax:'=NETWORKDAYS.INTL(B1,B2,11,D2:D3)',parts:[['B1, B2','tanggal mulai dan selesai'],['11','akhir pekan = Minggu saja'],['D2:D3','tanggal libur nasional']],
 task:'Toko buka Senin–Sabtu. Isi <code>B3</code> dengan jumlah hari kerja toko di bulan Oktober 2026, dikurangi libur di D2:D3.',
 cols:4,rows:3,target:'B3',solution:'=NETWORKDAYS.INTL(B1,B2,11,D2:D3)',use:['NETWORKDAYS.INTL'],
 hint:'Kode 11 berarti hanya Minggu yang libur.',
 data:{A1:'Mulai',B1:'=DATE(2026,10,1)',A2:'Selesai',B2:'=DATE(2026,10,31)',A3:'Hari kerja toko',C1:'',D1:'Libur',D2:'=DATE(2026,10,13)',D3:'=DATE(2026,10,28)'},fmt:{B1:'date',B2:'date',D2:'date',D3:'date'}},

{id:'lama-cicilan',mod:'lanjut',title:'Berapa lama lunas: NPER dan RATE',fns:'NPER · RATE · EFFECT',cert:['E3'],
 intro:`<p>Kalau <code>PMT</code> menghitung cicilan, <code>NPER</code> menghitung kebalikannya: dengan cicilan sekian per bulan, berapa bulan pinjaman lunas? <code>RATE</code> mencari suku bunga yang tersembunyi di balik cicilan, dan <code>EFFECT</code> mengubah bunga nominal menjadi bunga efektif tahunan.</p>
 <p>Aturan tanda tetap sama: uang yang kamu terima positif, uang yang kamu bayar negatif.</p>`,
 syntax:'=NPER(B2/12,-B3,B1)',parts:[['B2/12','bunga per bulan'],['-B3','cicilan (keluar, jadi negatif)'],['B1','pinjaman yang diterima']],
 task:'Isi <code>B5</code> dengan jumlah bulan sampai pinjaman lunas.',
 cols:3,rows:6,target:'B5',solution:'=NPER(B2/12,-B3,B1)',use:['NPER'],
 hint:'Hasilnya bisa berupa pecahan bulan. Bungkus dengan ROUNDUP kalau ingin bilangan bulat.',
 data:{A1:'Pinjaman',B1:50000000,A2:'Bunga per tahun',B2:0.12,A3:'Sanggup cicil per bulan',B3:1500000,A5:'Lama cicilan (bulan)',A6:'Bunga efektif tahunan',B6:'=EFFECT(B2,12)'},fmt:{B2:'pct',B6:'pct'}},

{id:'xirr-xnpv',mod:'lanjut',title:'Investasi dengan tanggal tidak teratur: XIRR dan XNPV',fns:'XIRR · XNPV · MIRR',cert:['E3'],
 intro:`<p><code>IRR</code> dan <code>NPV</code> menganggap arus kas datang tiap periode yang sama. Di dunia nyata, dividen, setoran, atau penarikan datang di tanggal acak. <code>XIRR</code> dan <code>XNPV</code> memakai tanggal sebenarnya sehingga hasilnya tepat.</p>
 <p><code>MIRR</code> adalah IRR yang dimodifikasi: memisahkan bunga pinjaman untuk arus kas negatif dan bunga reinvestasi untuk arus kas positif.</p>`,
 syntax:'=XIRR(B2:B6,A2:A6)',parts:[['B2:B6','arus kas (investasi awal negatif)'],['A2:A6','tanggal tiap arus kas']],
 task:'Isi <code>E2</code> dengan imbal hasil tahunan (XIRR) dari investasi ini.',
 cols:5,rows:6,target:'E2',solution:'=XIRR(B2:B6,A2:A6)',use:['XIRR'],fmt:{A:'date',E2:'pct'},
 hint:'Arus kas pertama harus negatif (uang keluar), dan setiap nilai punya tanggalnya sendiri.',
 data:{A1:'Tanggal',B1:'Arus kas',A2:'=DATE(2026,1,1)',B2:-10000,A3:'=DATE(2026,3,1)',B3:2750,A4:'=DATE(2026,10,30)',B4:4250,A5:'=DATE(2027,2,15)',B5:3250,A6:'=DATE(2027,4,1)',B6:2750,D1:'Ukuran',D2:'XIRR',D3:'XNPV (9%)',E3:'=XNPV(0.09,B2:B6,A2:A6)'}},

{id:'aggregate',mod:'lanjut',title:'Menjumlah sambil mengabaikan error: AGGREGATE',fns:'AGGREGATE · SUBTOTAL',cert:['E3'],
 intro:`<p>Satu sel error saja membuat <code>SUM</code> ikut error. <code>AGGREGATE</code> menjalankan 19 fungsi (SUM, AVERAGE, MAX, LARGE, PERCENTILE, …) sambil <b>mengabaikan error</b>, baris tersembunyi, atau subtotal lain.</p>
 <p>Argumen pertama memilih fungsinya (9 = SUM, 1 = AVERAGE, 4 = MAX, 14 = LARGE), argumen kedua opsi pengabaian (6 = abaikan error, 5 = abaikan baris tersembunyi, 7 = keduanya).</p>`,
 syntax:'=AGGREGATE(9,6,C2:C9)',parts:[['9','fungsi SUM'],['6','abaikan nilai error'],['C2:C9','rentang data']],
 task:'Kolom Margin berisi beberapa error #DIV/0!. Isi <code>F2</code> dengan total margin, abaikan error-nya.',
 cols:6,rows:9,target:'F2',solution:'=AGGREGATE(9,6,C2:C9)',use:['AGGREGATE'],
 hint:'Fungsi 9 = SUM, opsi 6 = abaikan error.',
 data:{A1:'Produk',B1:'Terjual',C1:'Margin',A2:'Kopi',B2:120,C2:'=360000/B2*B2',A3:'Teh',B3:0,C3:'=150000/B3',A4:'Gula',B4:80,C4:240000,A5:'Susu',B5:45,C5:315000,A6:'Roti',B6:0,C6:'=90000/B6',A7:'Air',B7:200,C7:180000,A8:'Mi',B8:150,C8:225000,A9:'Biskuit',B9:60,C9:132000,E1:'Ringkasan',E2:'Total margin',E3:'SUM biasa',F3:'=IFERROR(SUM(C2:C9),"error")'}},

{id:'lambda-helper',mod:'lanjut',title:'LAMBDA, BYROW, MAP, dan SCAN',fns:'LAMBDA · BYROW · MAP · REDUCE · SCAN',cert:['E3'],
 intro:`<p><code>LAMBDA</code> membuat fungsi kecil buatan sendiri. Fungsi pembantunya menjalankan LAMBDA itu berulang-ulang:</p>
 <ul><li><code>BYROW</code>/<code>BYCOL</code>: sekali per baris atau kolom.</li><li><code>MAP</code>: sekali per sel.</li><li><code>REDUCE</code>: mengakumulasi menjadi satu nilai, dan <code>SCAN</code> menampilkan setiap langkahnya (misalnya saldo berjalan).</li></ul>
 <p>Hasilnya satu rumus yang tumpah, tanpa kolom bantu dan tanpa menyalin ke bawah.</p>`,
 syntax:'=BYROW(B2:E7,LAMBDA(r,MAX(r)))',parts:[['B2:E7','nilai semua siswa'],['LAMBDA(r,MAX(r))','untuk setiap baris r, ambil nilai tertingginya']],
 task:'Isi <code>F2</code> dengan nilai tertinggi setiap siswa dalam <b>satu rumus</b> yang tumpah sampai F7.',
 cols:6,rows:7,target:'F2',solution:'=BYROW(B2:E7,LAMBDA(r,MAX(r)))',use:['BYROW|MAP|MAKEARRAY'],
 hint:'BYROW(rentang, LAMBDA(r, MAX(r))). Nama r bebas, asal sama di kedua tempat.',
 data:{A1:'Siswa',B1:'Tugas',C1:'Kuis',D1:'UTS',E1:'UAS',F1:'Tertinggi',A2:'Andi',B2:78,C2:85,D2:72,E2:80,A3:'Budi',B3:90,C3:68,D3:88,E3:84,A4:'Citra',B4:65,C4:92,D4:79,E4:88,A5:'Dewi',B5:83,C5:77,D5:95,E5:70,A6:'Eko',B6:71,C6:74,D6:69,E6:93,A7:'Fajar',B7:88,C7:81,D7:86,E7:79}},

{id:'konsolidasi-3d',mod:'lanjut',type:'read',title:'Consolidate, referensi 3D, dan Forecast Sheet',fns:'Consolidate · Sheet1:Sheet3!B2 · Forecast Sheet · Watch Window',cert:['E2','E3','E4'],
 body:`<p>Materi ini melengkapi kisi-kisi Excel Expert (MO-211) untuk menggabungkan data dari banyak sheet dan meramal secara visual.</p>
 <h3>Referensi 3D</h3>
 <p>Kalau sheet <i>Jan</i>, <i>Feb</i>, dan <i>Mar</i> punya susunan yang sama persis, total kuartal cukup ditulis <code>=SUM(Jan:Mar!B5)</code>. Excel menjumlahkan sel B5 di semua sheet di antara Jan dan Mar. Sheet baru yang disisipkan di antara keduanya otomatis ikut dihitung. Referensi 3D bisa dipakai di SUM, AVERAGE, COUNT, MAX, MIN, dan beberapa fungsi statistik lain.</p>
 <h3>Data › Consolidate</h3>
 <ol class="steps">
  <li>Pilih sel tujuan, lalu <b>Data › Consolidate</b>.</li>
  <li>Pilih fungsi (Sum, Average, Count, …), lalu tambahkan rentang dari tiap sheet atau workbook dengan <b>Add</b>.</li>
  <li>Centang <i>Top row</i> dan <i>Left column</i> supaya data digabung berdasarkan judul, bukan posisi. Urutan baris di tiap sheet boleh berbeda.</li>
  <li>Centang <i>Create links to source data</i> kalau hasilnya harus ikut berubah saat sumber berubah.</li>
 </ol>
 <h3>Forecast Sheet</h3>
 <p>Pilih kolom tanggal dan nilai, lalu <b>Data › Forecast Sheet</b>. Excel membuat tabel dan grafik ramalan dengan batas atas dan bawah (interval kepercayaan) memakai <code>FORECAST.ETS</code>, termasuk pola musiman yang terdeteksi otomatis. Di <i>Options</i> kamu bisa mengatur musiman, interval kepercayaan, dan cara mengisi data yang hilang.</p>
 <h3>Memantau rumus</h3>
 <p><b>Formulas › Watch Window</b> menampilkan nilai sel penting dari sheet mana pun dalam satu jendela, berguna saat mengubah asumsi di sheet lain. <b>Evaluate Formula</b> menjalankan rumus selangkah demi selangkah, dan <b>Trace Precedents / Dependents</b> menggambar panah asal dan tujuan rumus.</p>
 <h3>Opsi perhitungan</h3>
 <p><b>Formulas › Calculation Options</b> bisa diubah ke <i>Manual</i> untuk workbook besar; tekan <kbd>F9</kbd> untuk menghitung ulang. Iterative calculation (File › Options › Formulas) dipakai kalau sengaja membuat referensi melingkar, misalnya menghitung bonus yang bergantung pada laba setelah bonus.</p>`,
 quiz:[
  {q:'Rumus untuk menjumlahkan sel C10 di semua sheet dari Cabang1 sampai Cabang5 adalah…',opts:['=SUM(Cabang1!C10:Cabang5!C10)','=SUM(Cabang1:Cabang5!C10)','=SUM(C10,Cabang1,Cabang5)','=SUM3D(C10)'],a:1,why:'Referensi 3D ditulis NamaSheetAwal:NamaSheetAkhir!Sel.'},
  {q:'Urutan produk di tiap sheet cabang berbeda-beda. Pilihan Consolidate yang harus dicentang supaya angkanya tetap digabung dengan benar adalah…',opts:['Create links to source data','Top row dan Left column','Browse','Sum'],a:1,why:'Dengan label baris dan kolom, Consolidate mencocokkan berdasarkan judul, bukan posisi.'},
  {q:'Fitur yang membuat grafik ramalan beserta batas atas dan bawahnya secara otomatis adalah…',opts:['Goal Seek','Forecast Sheet','Scenario Manager','Flash Fill'],a:1,why:'Forecast Sheet ada di tab Data dan memakai FORECAST.ETS.'},
 ]},

{id:'kertas-bebas',mod:'latihan',title:'Kertas bebas',sandbox:true,fns:'semua fungsi',
 intro:`<p>Semua sel di lembar ini bisa diisi. Sebagai latihan, lengkapi anggaran bulanan di bawah: selisih tiap baris di kolom D, total di baris 6, lalu status di D7 dengan IF, misalnya <code>=IF(D6&lt;0,"Lewat anggaran","Aman")</code>.</p>
 <p>Semua fungsi di <a href="#fungsi" data-go="fungsi">Daftar Fungsi</a> bisa dipakai, termasuk FILTER, SORT, dan UNIQUE. Isianmu tersimpan di akunmu.</p>`,
 cols:8,rows:14,editable:'all',bold:['A6','A7'],
 data:{A1:'Pos',B1:'Anggaran',C1:'Realisasi',D1:'Selisih',A2:'Sewa',B2:3500000,C2:3500000,A3:'Makan',B3:2000000,C3:2240000,A4:'Transport',B4:800000,C4:650000,A5:'Tabungan',B5:1500000,C5:1500000,A6:'Total',A7:'Status'}},
);
}

// Bagian C: fungsi tambahan dan Excel 365
{
const D=XL.D;
const after=(id,...items)=>{const i=LESSONS.findIndex(l=>l.id===id);LESSONS.splice(i+1,0,...items)};
const mod=MODULES.find(m=>m.id==='array');if(mod){mod.title='Array dinamis dan Excel 365';mod.desc='FILTER, SORT, UNIQUE, LET, TEXTSPLIT, VSTACK, GROUPBY, REGEX'}
const ot=MODULES.find(m=>m.id==='otomasi');if(ot){ot.title='Macro, VBA, dan AI';ot.desc='Merekam macro, menulis VBA, Copilot, dan Python in Excel'}

after('large-small',
{id:'sebaran',mod:'hitung',title:'Median, kuartil, dan persentil',fns:'MEDIAN · QUARTILE · PERCENTILE',cert:['E3'],
 intro:`<p>Rata-rata mudah tertarik oleh angka ekstrem. Satu gaji direksi bisa membuat rata-rata gaji terlihat jauh lebih tinggi dari kenyataan. <code>MEDIAN</code> memberi nilai tengah, sehingga lebih jujur untuk data seperti gaji atau harga rumah.</p>
 <p><code>QUARTILE(data,1)</code> adalah batas 25% terbawah dan <code>QUARTILE(data,3)</code> batas 75%. <code>PERCENTILE(data,0.9)</code> adalah angka yang dilampaui hanya oleh 10% data teratas. Bagian HR sering memakainya untuk menyusun rentang gaji.</p>`,
 syntax:'=PERCENTILE(B2:B11,0.9)',parts:[['B2:B11','data gaji'],['0.9','persentil ke-90, antara 0 dan 1']],
 task:'Isi <code>E5</code> dengan persentil ke-90 gaji. Bandingkan juga rata-rata di E6 dengan median di E2.',
 cols:5,rows:12,target:'E5',solution:'=PERCENTILE(B2:B11,0.9)',use:['PERCENTILE|PERCENTILE.INC'],bold:['D2','D3','D4','D5','D6'],
 hint:'Persentil ditulis sebagai desimal: 90% menjadi 0.9.',
 data:{A1:'Karyawan',B1:'Gaji (ribu)',A2:'Arif',B2:6200,A3:'Dewi',B3:5800,A4:'Rizky',B4:7100,A5:'Nadia',B5:6500,A6:'Bayu',B6:5400,A7:'Sinta',B7:8900,A8:'Fikri',B8:6000,A9:'Lina',B9:7600,A10:'Galih',B10:5900,A11:'Direktur',B11:42000,
  D2:'Median',E2:'=MEDIAN(B2:B11)',D3:'Kuartil 1',E3:'=QUARTILE(B2:B11,1)',D4:'Kuartil 3',E4:'=QUARTILE(B2:B11,3)',D5:'Persentil 90',D6:'Rata-rata',E6:'=AVERAGE(B2:B11)'}});

after('networkdays',
{id:'waktu',mod:'tanggal',title:'Menghitung jam kerja',fns:'TIME · HOUR · MINUTE · NOW',cert:['E3'],
 intro:`<p>Jam di Excel adalah pecahan dari satu hari. Pukul 12:00 bernilai 0,5 dan pukul 18:00 bernilai 0,75. Karena itu, selisih dua jam menghasilkan pecahan hari, bukan jumlah jam.</p>
 <p>Untuk mengubahnya menjadi jam, kalikan dengan 24. <code>HOUR</code>, <code>MINUTE</code>, dan <code>SECOND</code> mengambil bagian jamnya, <code>TIME(17,30,0)</code> membuat jam dari angka, dan <code>NOW()</code> memberi tanggal sekaligus jam saat ini. Kalau shift melewati tengah malam, pakai <code>MOD(pulang-masuk,1)</code> supaya hasilnya tidak negatif.</p>`,
 syntax:'=(C2-B2)*24',parts:[['C2-B2','selisih jam dalam satuan hari'],['*24','ubah menjadi jam']],
 task:'Isi <code>D2</code> dengan jumlah jam kerja Arif dalam angka desimal, lalu salin ke bawah. Kolom E (lembur di atas 8 jam) akan ikut terisi.',
 cols:5,rows:5,target:'D2',editable:['D2','D3','D4'],fill:{from:'D2',to:['D3','D4']},solution:'=(C2-B2)*24',fmt:{B:'time',C:'time'},
 hint:'Tanpa dikali 24, hasilnya 0,395833…, yaitu 9,5 jam dibagi 24.',
 data:{A1:'Nama',B1:'Masuk',C1:'Pulang',D1:'Jam kerja',E1:'Lembur (jam)',A2:'Arif',B2:'08:00',C2:'17:30',E2:'=MAX(0,D2-8)',A3:'Dewi',B3:'07:45',C3:'16:15',E3:'=MAX(0,D3-8)',A4:'Rizky',B4:'08:30',C4:'20:00',E4:'=MAX(0,D4-8)'}});

after('xlookup',
{id:'offset-indirect',mod:'cari',title:'Rentang dinamis: OFFSET dan INDIRECT',fns:'OFFSET · INDIRECT · COUNT',cert:['E3'],
 intro:`<p><code>OFFSET</code> membuat rentang yang bergeser dari titik awal: <code>OFFSET(B1,7,0,3,1)</code> berarti mulai dari B1, turun 7 baris, lalu ambil 3 baris × 1 kolom. Kalau jumlah baris turunnya dihitung dengan COUNT, rentangnya ikut bergeser setiap data bulan baru masuk.</p>
 <p><code>INDIRECT</code> mengubah teks menjadi alamat. <code>=INDIRECT("B"&amp;E5)</code> mengambil isi kolom B di baris yang nomornya ada di E5. Keduanya bersifat volatile (dihitung ulang setiap ada perubahan), jadi pakai seperlunya di file besar.</p>`,
 syntax:'=AVERAGE(OFFSET(B1,COUNT(B2:B13)-2,0,3,1))',parts:[['COUNT(B2:B13)','jumlah bulan yang sudah terisi, misalnya 9'],['-2','mundur supaya 3 bulan terakhir tercakup'],['3,1','tinggi 3 baris, lebar 1 kolom']],
 task:'Isi <code>E2</code> dengan rata-rata penjualan 3 bulan terakhir yang sudah terisi. Setelah benar, isi penjualan Oktober di B11 dan lihat hasilnya bergeser.',
 cols:5,rows:14,target:'E2',editable:['E2','B11','B12','B13'],solution:'=AVERAGE(OFFSET(B1,COUNT(B2:B13)-2,0,3,1))',use:['OFFSET'],bold:['D2','D4'],
 hint:'Ada 9 bulan terisi. Bulan terakhir ada di baris 10, jadi 3 bulan terakhir adalah B8:B10.',
 data:{A1:'Bulan',B1:'Penjualan (juta)',A2:'Jan',B2:412,A3:'Feb',B3:388,A4:'Mar',B4:431,A5:'Apr',B5:405,A6:'Mei',B6:452,A7:'Jun',B7:470,A8:'Jul',B8:463,A9:'Agu',B9:498,A10:'Sep',B10:515,A11:'Okt',A12:'Nov',A13:'Des',
  D2:'Rata-rata 3 bln terakhir',D4:'Bulan ke-',E4:5,D5:'Penjualan bulan itu',E5:'=INDIRECT("B"&(E4+1))'}});

after('let',
{id:'textsplit',mod:'array',title:'Memecah teks dengan TEXTSPLIT',fns:'TEXTSPLIT · TEXTBEFORE · TEXTAFTER',cert:['E3'],
 intro:`<p><code>TEXTSPLIT</code> memecah satu teks menjadi beberapa kolom berdasarkan pemisah, mirip Text to Columns tetapi dalam bentuk rumus. Hasilnya tumpah ke kanan dan ikut berubah saat teks sumbernya diubah.</p>
 <p>Argumen ketiga (opsional) adalah pemisah baris, sehingga satu sel bisa dipecah menjadi tabel. Untuk mengambil satu bagian saja, <code>TEXTBEFORE</code> dan <code>TEXTAFTER</code> lebih ringkas.</p>`,
 syntax:'=TEXTSPLIT(A2,"|")',parts:[['A2','teks yang dipecah'],['"|"','pemisah kolom']],
 note:'<b>Catatan versi:</b> TEXTSPLIT, TEXTBEFORE, dan TEXTAFTER hanya ada di Microsoft 365 dan Excel untuk web.',
 task:'Data ekspor sistem menggabungkan nama, divisi, dan email dengan tanda <code>|</code>. Isi <code>B2</code> supaya ketiganya terpecah ke kolom B, C, dan D.',
 cols:4,rows:4,target:'B2',solution:'=TEXTSPLIT(A2,"|")',use:['TEXTSPLIT'],
 hint:'Cukup satu rumus di B2. C2 dan D2 terisi otomatis.',
 data:{A1:'Data ekspor',B1:'Nama',C1:'Divisi',D1:'Email',A2:'Rina Wulandari|Keuangan|rina@majujaya.co.id',A3:'Hendra Saputra|Gudang|hendra@majujaya.co.id',B3:'=TEXTSPLIT(A3,"|")'}},

{id:'stack',mod:'array',title:'Menumpuk data dengan VSTACK dan HSTACK',fns:'VSTACK · HSTACK · TAKE · DROP',cert:['E3'],
 intro:`<p><code>VSTACK</code> menumpuk beberapa rentang dari atas ke bawah, sedangkan <code>HSTACK</code> menjajarkannya ke samping. Ini cara cepat menggabungkan daftar dari beberapa cabang atau beberapa sheet tanpa salin-tempel.</p>
 <p>Fungsi lain di keluarga yang sama: <code>TAKE</code> mengambil n baris pertama atau terakhir, <code>DROP</code> membuang n baris, <code>CHOOSECOLS</code> memilih kolom tertentu, dan <code>TOCOL</code> meratakan tabel menjadi satu kolom.</p>`,
 syntax:'=SORT(VSTACK(A2:A4,C2:C3))',parts:[['VSTACK(A2:A4,C2:C3)','tumpuk peserta Jakarta lalu Bandung'],['SORT(…)','urutkan abjad']],
 note:'<b>Catatan versi:</b> VSTACK, HSTACK, TAKE, DROP, CHOOSECOLS, dan TOCOL hanya ada di Microsoft 365 dan Excel untuk web.',
 task:'Isi <code>E2</code> dengan gabungan peserta pelatihan dari kedua cabang, diurutkan sesuai abjad.',
 cols:5,rows:8,target:'E2',solution:'=SORT(VSTACK(A2:A4,C2:C3))',use:['VSTACK','SORT'],bold:['E1'],
 hint:'Tumpuk dulu dengan VSTACK, lalu bungkus dengan SORT.',
 data:{A1:'Cabang Jakarta',A2:'Rina',A3:'Teguh',A4:'Maya',C1:'Cabang Bandung',C2:'Yusuf',C3:'Dimas',E1:'Semua peserta'}},

{id:'pilih-kolom',mod:'array',title:'Memilih kolom dan baris: CHOOSECOLS, TAKE, DROP',fns:'CHOOSECOLS · CHOOSEROWS · TAKE · DROP',cert:['E3'],
 intro:`<p>Laporan sering hanya butuh sebagian tabel: kolom tertentu, beberapa baris teratas, atau tanpa baris judul. Empat fungsi ini memotong tabel tanpa menyalin manual:</p>
 <ul><li><code>CHOOSECOLS(tabel,1,4)</code> mengambil kolom ke-1 dan ke-4, dalam urutan yang kamu tulis. Angka negatif dihitung dari kanan: <code>-1</code> adalah kolom terakhir.</li>
 <li><code>CHOOSEROWS(tabel,1,-1)</code> mengambil baris pertama dan baris terakhir.</li>
 <li><code>TAKE(tabel,3)</code> mengambil 3 baris teratas. <code>TAKE(tabel,-3)</code> mengambil 3 baris terbawah.</li>
 <li><code>DROP(tabel,1)</code> membuang 1 baris teratas, misalnya baris judul.</li></ul>
 <p>Kekuatannya muncul saat digabung dengan <code>SORT</code> atau <code>FILTER</code>: urutkan dulu, pilih kolom yang perlu, lalu ambil beberapa teratas.</p>`,
 syntax:'=TAKE(CHOOSECOLS(SORT(A2:D9,4,-1),1,4),3)',parts:[['SORT(A2:D9,4,-1)','urutkan tabel berdasarkan kolom ke-4 (Omzet), terbesar dulu'],['CHOOSECOLS(…,1,4)','sisakan kolom Nama dan Omzet saja'],['TAKE(…,3)','ambil 3 baris teratas']],
 note:'<b>Catatan versi:</b> CHOOSECOLS, CHOOSEROWS, TAKE, dan DROP hanya ada di Microsoft 365 dan Excel untuk web.',
 task:'Isi <code>F2</code> dengan daftar 3 sales dengan omzet tertinggi, hanya kolom <b>Nama</b> dan <b>Omzet</b>, terurut dari yang terbesar.',
 cols:7,rows:9,target:'F2',solution:'=TAKE(CHOOSECOLS(SORT(A2:D9,4,-1),1,4),3)',use:['CHOOSECOLS|CHOOSEROWS','TAKE'],bold:['F1','G1'],
 hint:'Kerjakan dari dalam ke luar: SORT(A2:D9,4,-1) dulu, lalu CHOOSECOLS(…,1,4), terakhir TAKE(…,3).',
 data:{A1:'Nama',B1:'Cabang',C1:'Transaksi',D1:'Omzet',A2:'Rina',B2:'Jakarta',C2:42,D2:186500000,A3:'Yusuf',B3:'Bandung',C3:35,D3:142000000,A4:'Maya',B4:'Jakarta',C4:51,D4:231750000,A5:'Hendra',B5:'Surabaya',C5:29,D5:118250000,A6:'Sari',B6:'Bandung',C6:47,D6:205000000,A7:'Teguh',B7:'Medan',C7:33,D7:126400000,A8:'Lestari',B8:'Surabaya',C8:38,D8:164900000,A9:'Dimas',B9:'Medan',C9:44,D9:198300000,F1:'Top 3 sales',G1:'Omzet'}},

{id:'bentuk-array',mod:'array',title:'Membentuk ulang tabel: TOCOL, WRAPROWS, EXPAND',fns:'TOCOL · TOROW · WRAPROWS · EXPAND',cert:['E3'],
 intro:`<p>Kadang data yang kamu terima bentuknya tidak cocok untuk diolah, misalnya jadwal piket berbentuk tabel padahal yang kamu butuhkan daftar nama satu kolom.</p>
 <ul><li><code>TOCOL(tabel)</code> meratakan tabel menjadi satu kolom, dibaca per baris. Argumen kedua <code>1</code> membuang sel kosong. Argumen ketiga <code>TRUE</code> membaca per kolom.</li>
 <li><code>TOROW</code> sama, tetapi hasilnya satu baris.</li>
 <li><code>WRAPROWS(daftar,3)</code> kebalikannya: memotong satu daftar panjang menjadi baris-baris berisi 3 item.</li>
 <li><code>EXPAND(tabel,5,3,"")</code> memperbesar tabel sampai 5 baris × 3 kolom dan mengisi sisanya dengan teks kosong.</li></ul>`,
 syntax:'=SORT(UNIQUE(TOCOL(B2:D6,1)))',parts:[['TOCOL(B2:D6,1)','ratakan jadwal jadi satu kolom, buang sel kosong'],['UNIQUE(…)','hapus nama yang muncul lebih dari sekali'],['SORT(…)','urutkan abjad']],
 note:'<b>Catatan versi:</b> TOCOL, TOROW, WRAPROWS, WRAPCOLS, dan EXPAND hanya ada di Microsoft 365 dan Excel untuk web.',
 task:'Jadwal shift di B2:D6 punya beberapa slot kosong dan nama yang berulang. Isi <code>F2</code> dengan daftar semua petugas, <b>tanpa duplikat</b>, terurut abjad.',
 cols:6,rows:10,target:'F2',solution:'=SORT(UNIQUE(TOCOL(B2:D6,1)))',use:['TOCOL'],bold:['F1'],
 hint:'Tanpa argumen 1, sel kosong ikut masuk sebagai 0. Tanpa UNIQUE, nama yang bertugas lebih dari sekali muncul berulang.',
 data:{A1:'Hari',B1:'Pagi',C1:'Siang',D1:'Malam',A2:'Senin',B2:'Rina',C2:'Teguh',D2:'Dimas',A3:'Selasa',B3:'Maya',C3:'Rina',A4:'Rabu',B4:'Yusuf',C4:'Sari',D4:'Teguh',A5:'Kamis',B5:'Dimas',D5:'Hendra',A6:'Jumat',B6:'Sari',C6:'Maya',D6:'Yusuf',F1:'Daftar petugas'}},

{id:'textbefore-after',mod:'array',title:'Mengambil potongan teks: TEXTBEFORE dan TEXTAFTER',fns:'TEXTBEFORE · TEXTAFTER',cert:['E3'],
 intro:`<p><code>TEXTBEFORE(teks,"@")</code> mengambil teks sebelum pembatas, <code>TEXTAFTER(teks,"@")</code> mengambil teks sesudahnya. Jauh lebih ringkas daripada kombinasi LEFT, MID, dan FIND.</p>
 <p>Argumen ketiga menentukan pembatas yang ke berapa. Angka negatif dihitung dari belakang, jadi <code>TEXTAFTER(A2,"/",-1)</code> mengambil bagian setelah garis miring <b>terakhir</b>. Argumen keenam mengisi nilai pengganti kalau pembatasnya tidak ditemukan, sehingga tidak perlu IFERROR.</p>`,
 syntax:'=TEXTAFTER(A2,"/",-1)',parts:[['A2','nomor dokumen, misalnya INV/JKT/2026/0042'],['"/"','pembatas'],['-1','pembatas pertama dari belakang (yang terakhir)']],
 note:'<b>Catatan versi:</b> TEXTBEFORE dan TEXTAFTER hanya ada di Microsoft 365 dan Excel untuk web.',
 task:'Isi <code>B2</code> dengan nomor urut dokumen, yaitu bagian setelah garis miring terakhir, lalu salin sampai B6. Panjang kode cabang berbeda-beda, jadi posisinya tidak tetap.',
 cols:4,rows:6,target:'B2',editable:['B2','B3','B4','B5','B6'],fill:{from:'B2',to:['B3','B4','B5','B6']},solution:'=TEXTAFTER(A2,"/",-1)',use:['TEXTAFTER'],
 hint:'Ada tiga garis miring di setiap nomor. Argumen ketiga -1 berarti garis miring terakhir.',
 data:{A1:'Nomor dokumen',B1:'Nomor urut',C1:'Cabang',A2:'INV/JKT/2026/0042',A3:'INV/BDG/2026/0107',A4:'INV/SBY-2/2026/0009',A5:'RET/JKT/2026/0013',A6:'INV/MDN/2026/0215',C2:'=TEXTBEFORE(TEXTAFTER(A2,"/"),"/")',C3:'=TEXTBEFORE(TEXTAFTER(A3,"/"),"/")',C4:'=TEXTBEFORE(TEXTAFTER(A4,"/"),"/")',C5:'=TEXTBEFORE(TEXTAFTER(A5,"/"),"/")',C6:'=TEXTBEFORE(TEXTAFTER(A6,"/"),"/")'}},

{id:'groupby',mod:'array',title:'Ringkasan dengan GROUPBY dan PIVOTBY',fns:'GROUPBY · PIVOTBY',cert:['E4'],
 intro:`<p><code>GROUPBY</code> membuat ringkasan seperti PivotTable, tetapi dalam bentuk rumus: kelompokkan berdasarkan satu kolom, lalu agregasikan kolom lain dengan fungsi seperti SUM, AVERAGE, atau COUNT. Hasilnya langsung diperbarui saat data berubah, tanpa perlu Refresh.</p>
 <p><code>PIVOTBY</code> menambah pengelompokan kolom, sehingga hasilnya berbentuk tabel silang lengkap dengan total. Nama fungsi agregasi ditulis tanpa kurung, misalnya <code>SUM</code>, bukan <code>SUM()</code>.</p>`,
 syntax:'=GROUPBY(A2:A9,B2:B9,SUM)',parts:[['A2:A9','kolom pengelompok'],['B2:B9','nilai yang diringkas'],['SUM','fungsi agregasi, tanpa kurung']],
 note:'<b>Catatan versi:</b> GROUPBY dan PIVOTBY termasuk fungsi terbaru di Microsoft 365. Belum ada di Excel 2021 maupun 2024.',
 task:'Isi <code>D2</code> dengan total pengeluaran per kategori, lengkap dengan baris Total.',
 cols:5,rows:10,target:'D2',solution:'=GROUPBY(A2:A9,B2:B9,SUM)',use:['GROUPBY'],
 hint:'Argumen ketiga cukup ditulis SUM.',
 data:{A1:'Kategori',B1:'Jumlah',A2:'Makanan',B2:45000,A3:'Transport',B3:20000,A4:'Makanan',B4:32000,A5:'Hiburan',B5:75000,A6:'Makanan',B6:58000,A7:'Transport',B7:15000,A8:'ATK',B8:27500,A9:'Hiburan',B9:40000,D1:'Kategori',E1:'Total'}},

{id:'regex',mod:'array',title:'Mencari pola teks dengan REGEX',fns:'REGEXEXTRACT · REGEXREPLACE · REGEXTEST',cert:['E3'],
 intro:`<p>Regular expression (regex) adalah cara menulis pola teks. <code>[0-9]</code> berarti satu angka, <code>{4}</code> berarti tepat empat kali, dan <code>+</code> berarti satu kali atau lebih. Pola <code>INV-[0-9]{4}-[0-9]{4}</code> cocok dengan nomor faktur seperti INV-2026-0042 di mana pun letaknya di dalam kalimat.</p>
 <p><code>REGEXEXTRACT</code> mengambil bagian yang cocok, <code>REGEXREPLACE</code> menggantinya (misalnya membuang semua karakter selain angka dari nomor HP dengan pola <code>[^0-9]</code>), dan <code>REGEXTEST</code> menghasilkan TRUE atau FALSE.</p>`,
 syntax:'=REGEXEXTRACT(A2,"INV-[0-9]{4}-[0-9]{4}")',parts:[['A2','teks keterangan transfer'],['"INV-[0-9]{4}-[0-9]{4}"','pola nomor faktur']],
 note:'<b>Catatan versi:</b> fungsi REGEX termasuk fungsi terbaru di Microsoft 365. Di sini pola ditulis dengan gaya JavaScript, yang untuk pola umum sama dengan Excel.',
 task:'Keterangan transfer dari bank ditulis bebas. Isi <code>B2</code> dengan nomor fakturnya saja, lalu salin ke bawah.',
 cols:3,rows:5,target:'B2',editable:['B2','B3','B4'],fill:{from:'B2',to:['B3','B4']},solution:'=REGEXEXTRACT(A2,"INV-[0-9]{4}-[0-9]{4}")',use:['REGEXEXTRACT'],
 hint:'Pola ditulis di dalam tanda kutip. Kolom C berisi contoh REGEXREPLACE untuk membersihkan nomor HP.',
 data:{A1:'Keterangan transfer',B1:'No faktur',C1:'HP bersih',A2:'TRF PT ARTA NIAGA INV-2026-0042 PELUNASAN',A3:'pembayaran inv-2026-0107? lihat INV-2026-0107 ok',A4:'DP 50% INV-2026-0131 CV BINTANG',C2:'=REGEXREPLACE("0812-3456-7890","[^0-9]","")'}});

after('pmt',
{id:'angsuran',mod:'keuangan',title:'Tabel angsuran: bunga dan pokok',fns:'IPMT · PPMT · CUMIPMT',cert:['E3'],
 intro:`<p>Cicilan anuitas besarnya tetap, tetapi isinya berubah setiap bulan. Di awal, porsi bunganya besar dan porsi pokoknya kecil; makin lama, porsi pokoknya makin besar. <code>IPMT</code> menghitung porsi bunga untuk bulan tertentu, <code>PPMT</code> menghitung porsi pokoknya.</p>
 <p>Jumlah IPMT dan PPMT di bulan yang sama selalu sama dengan PMT. <code>CUMIPMT</code> dan <code>CUMPRINC</code> menjumlahkan bunga atau pokok untuk rentang bulan, misalnya total bunga di tahun pertama. <code>RATE</code> mencari suku bunga dari cicilan yang sudah diketahui.</p>`,
 syntax:'=IPMT($B$2/12,D2,$B$3,-$B$1)',parts:[['$B$2/12','bunga per bulan'],['D2','bulan ke berapa'],['$B$3','tenor dalam bulan'],['-$B$1','pokok pinjaman']],
 task:'Isi <code>F2</code> dengan porsi bunga di bulan pertama, lalu salin ke bawah. Kolom pokok dan sisa pinjaman akan ikut terisi.',
 cols:8,rows:6,target:'F2',editable:['F2','F3','F4','F5'],fill:{from:'F2',to:['F3','F4','F5']},solution:'=IPMT($B$2/12,D2,$B$3,-$B$1)',use:['IPMT'],fmt:{B2:'pct'},
 abs:'\\$B\\$2.*\\$B\\$3.*\\$B\\$1',absMsg:'Bunga, tenor, dan pokok di kolom B harus dikunci dengan $ supaya tidak bergeser saat disalin.',
 hint:'Bulan ke berapa diambil dari kolom D, jadi D2 tidak dikunci.',
 data:{A1:'Pokok pinjaman',B1:60000000,A2:'Bunga per tahun',B2:0.12,A3:'Tenor (bulan)',B3:24,D1:'Bulan',E1:'Cicilan',F1:'Bunga',G1:'Pokok',H1:'Sisa pinjaman',
  D2:1,D3:2,D4:3,D5:4,E2:'=PMT($B$2/12,$B$3,-$B$1)',E3:'=PMT($B$2/12,$B$3,-$B$1)',E4:'=PMT($B$2/12,$B$3,-$B$1)',E5:'=PMT($B$2/12,$B$3,-$B$1)',
  G2:'=E2-F2',G3:'=E3-F3',G4:'=E4-F4',G5:'=E5-F5',H2:'=$B$1-SUM($G$2:G2)',H3:'=$B$1-SUM($G$2:G3)',H4:'=$B$1-SUM($G$2:G4)',H5:'=$B$1-SUM($G$2:G5)'}});

after('vba-event-udf',
{id:'excel-ai',mod:'otomasi',type:'read',title:'Copilot dan Python in Excel',fns:'Copilot · =PY()',cert:['E3'],preview:null,
 body:`<p>Excel di Microsoft 365 kini punya dua alat baru untuk analisis: Copilot, yang menerima perintah dalam bahasa sehari-hari, dan Python in Excel, yang menjalankan kode Python langsung di sel. Ketersediaan keduanya bergantung pada jenis lisensi, wilayah, dan kanal pembaruan Microsoft 365 yang kamu pakai.</p>
 <h3>Copilot di Excel</h3>
 <p>Tombol Copilot ada di tab Home. Kamu menulis permintaan, misalnya "tambahkan kolom margin dari kolom Penjualan dan HPP" atau "tampilkan 5 produk dengan penjualan tertinggi". Yang biasanya bisa dilakukan Copilot:</p>
 <ul>
  <li>Mengusulkan dan menuliskan rumus kolom baru, lengkap dengan penjelasan cara kerjanya.</li>
  <li>Menyorot data dengan conditional formatting, mengurutkan, dan menyaring.</li>
  <li>Membuat ringkasan, PivotTable, dan grafik dari pertanyaan seperti "bagaimana tren penjualan per bulan?".</li>
  <li>Menjelaskan rumus panjang yang sudah ada.</li>
 </ul>
 <p>Copilot bekerja paling baik kalau datanya rapi: satu baris judul, tanpa sel gabungan, idealnya dalam bentuk Excel Table, dan file tersimpan di OneDrive atau SharePoint.</p>
 <div class="tip"><b>Tetap periksa hasilnya.</b> Copilot bisa salah memahami permintaan atau memilih kolom yang keliru. Klik sel hasilnya, baca rumusnya di bar rumus, dan cocokkan beberapa angka secara manual. Pemahaman rumus yang kamu pelajari di kelas ini justru yang membuatmu bisa memeriksa pekerjaan Copilot.</div>
 <h3>Python in Excel</h3>
 <p>Ketik <code>=PY(</code> di sebuah sel, atau pilih <b>Formulas › Insert Python</b>, untuk membuka mode Python. Kode berjalan di cloud Microsoft dengan pustaka analisis data yang umum, seperti pandas untuk tabel dan matplotlib untuk grafik. Data Excel diambil dengan fungsi <code>xl()</code>:</p>
 <pre class="code">df = xl("Penjualan[#All]", headers=True)
df.groupby("Cabang")["Nilai"].sum().sort_values(ascending=False)</pre>
 <p>Hasilnya bisa dikembalikan sebagai objek Python di satu sel atau sebagai nilai Excel biasa yang tumpah ke sel-sel di sekitarnya. Python in Excel cocok untuk analisis statistik, pembersihan data yang rumit, dan visualisasi yang tidak tersedia di grafik bawaan.</p>
 <h3>Kapan memakai apa</h3>
 <ul>
  <li><b>Rumus biasa</b>: perhitungan harian yang perlu dipahami dan diperiksa semua orang di tim.</li>
  <li><b>Power Query</b>: langkah pembersihan data yang diulang setiap bulan.</li>
  <li><b>VBA</b>: otomatisasi yang mengubah file, sheet, atau tampilan di komputer.</li>
  <li><b>Copilot</b>: memulai analisis dengan cepat dan mendapat usulan rumus.</li>
  <li><b>Python</b>: analisis statistik dan visualisasi lanjutan.</li>
 </ul>`,
 quiz:[
  {q:'Copilot menambahkan kolom berisi rumus baru. Apa yang sebaiknya kamu lakukan sebelum memakai hasilnya di laporan?',opts:['Langsung dipakai karena dibuat AI','Membaca rumusnya dan mencocokkan beberapa angka secara manual','Menghapus kolom lain','Mengubahnya menjadi nilai'],a:1,why:'Copilot bisa salah memahami permintaan. Memeriksa rumus dan beberapa angka adalah langkah wajib.'},
  {q:'Di Python in Excel, fungsi apa yang dipakai untuk mengambil data dari tabel Excel?',opts:['import()','xl()','RANGE()','=PY()'],a:1,why:'xl("NamaTabel[#All]", headers=True) mengambil data sebagai tabel pandas.'},
 ]});
}

/* ---------- Modul: Google Sheets dan AI (pelengkap, tidak termasuk syarat sertifikat) ---------- */
{
MODULES.splice(MODULES.findIndex(m=>m.id==='latihan'),0,{id:'modern',title:'Google Sheets dan AI',desc:'Pindah ke Google Sheets, QUERY, IMPORTRANGE, dan cara memakai AI untuk membuat rumus'});
LESSONS.push(
{id:'gs-beda',mod:'modern',type:'read',title:'Dari Excel ke Google Sheets',fns:'Berbagi · Riwayat versi · Locale',preview:null,
 body:`<p>Banyak kantor dan UMKM memakai Google Sheets karena gratis dan bisa dikerjakan bareng. Kabar baiknya, hampir semua rumus yang kamu pelajari di sini jalan juga di Sheets: SUM, SUMIFS, IF, XLOOKUP, FILTER, UNIQUE, sampai LET dan LAMBDA.</p>
 <h3>Yang terasa beda di hari pertama</h3>
 <ul>
  <li><b>Tidak ada tombol Save.</b> Semua tersimpan otomatis. Kalau salah hapus, buka <b>File › Version history</b> untuk kembali ke versi sebelumnya.</li>
  <li><b>Berbagi lewat link.</b> Tombol <b>Share</b> di kanan atas. Pilih Viewer, Commenter, atau Editor. Jangan pilih "Anyone with the link" untuk data gaji atau data pelanggan.</li>
  <li><b>Pemisah rumus ikut Locale.</b> Kalau rumus <code>=IF(A2>0,"Ya","Tidak")</code> ditolak, cek <b>File › Settings › Locale</b>. Locale Indonesia memakai titik koma dan koma desimal, sama seperti Excel berbahasa Indonesia.</li>
  <li><b>Kerja bareng.</b> Kursor rekan kerja terlihat dengan warna berbeda. Pakai komentar (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>M</kbd>) dan sebut nama dengan <code>@</code> supaya mereka dapat notifikasi.</li>
 </ul>
 <h3>Yang tidak ada di Sheets</h3>
 <ul>
  <li><b>Power Query dan Power Pivot.</b> Penggantinya biasanya rumus QUERY atau IMPORTRANGE.</li>
  <li><b>VBA.</b> Otomatisasi di Sheets memakai <b>Apps Script</b> (bahasa JavaScript), lewat <b>Extensions › Apps Script</b>. Macro dari Excel tidak bisa dipakai langsung.</li>
  <li>Beberapa fitur grafik dan PivotTable lebih sederhana dibanding Excel desktop.</li>
 </ul>
 <h3>Membuka file Excel di Sheets</h3>
 <p>Upload file .xlsx ke Google Drive, lalu buka dengan Google Sheets. Rumus biasa ikut terbawa. Yang perlu dicek ulang: macro, koneksi Power Query, dan format bersyarat yang rumit. Kalau perlu mengirim balik ke orang yang memakai Excel, pakai <b>File › Download › Microsoft Excel (.xlsx)</b>.</p>
 <div class="tip"><b>Kebiasaan yang membantu:</b> beri nama yang jelas pada setiap sheet dan kunci sel rumus lewat <b>Data › Protect sheets and ranges</b>, supaya rekan kerja tidak menimpa rumus tanpa sengaja.</div>`,
 quiz:[
  {q:'Rekan kerja tidak sengaja menghapus satu kolom kemarin sore. Cara paling cepat mengembalikannya di Google Sheets?',opts:['Tekan Ctrl+Z berkali-kali','File › Version history, pilih versi kemarin','Unduh ulang dari email','Tidak bisa dikembalikan'],a:1,why:'Version history menyimpan versi lama secara otomatis, termasuk perubahan dari orang lain.'},
  {q:'Rumus =IF(A2>0,"Ya","Tidak") ditolak di file Sheets milik kantor. Apa yang paling mungkin terjadi?',opts:['IF tidak ada di Sheets','Locale file memakai titik koma sebagai pemisah','File harus disimpan dulu','Harus diketik huruf kecil'],a:1,why:'Dengan locale Indonesia, pemisah argumen adalah titik koma: =IF(A2>0;"Ya";"Tidak").'},
  {q:'Kamu punya macro VBA untuk merapikan laporan. Di Google Sheets, otomatisasi serupa dibuat dengan...',opts:['VBA yang sama','Apps Script','Power Query','Tidak bisa sama sekali'],a:1,why:'Sheets memakai Apps Script (JavaScript). Logikanya bisa ditulis ulang, tetapi kode VBA tidak bisa ditempel langsung.'},
 ]},

{id:'gs-query',mod:'modern',type:'read',title:'QUERY: ringkasan data dengan satu rumus',fns:'QUERY',preview:null,
 body:`<p><code>QUERY</code> adalah fungsi khas Google Sheets. Satu rumus bisa memfilter, mengelompokkan, menjumlah, dan mengurutkan sekaligus, mirip PivotTable tetapi hasilnya ikut berubah saat data berubah.</p>
 <pre class="code">=QUERY(A1:E200; "select B, sum(E) where C = 'Elektronik' group by B order by sum(E) desc"; 1)</pre>
 <ul>
  <li><b>Argumen 1</b>: rentang data, termasuk baris judul.</li>
  <li><b>Argumen 2</b>: perintah dalam tanda kutip. Kolom ditulis dengan hurufnya (B, C, E), bukan judulnya.</li>
  <li><b>Argumen 3</b>: jumlah baris judul, biasanya 1.</li>
 </ul>
 <h3>Kata kunci yang paling sering dipakai</h3>
 <ul>
  <li><code>select B, E</code>: kolom yang ditampilkan.</li>
  <li><code>where E > 1000000</code>: syarat. Teks memakai tanda kutip tunggal: <code>where B = 'Jakarta'</code>.</li>
  <li><code>group by B</code> bersama <code>sum(E)</code>, <code>count(A)</code>, atau <code>avg(E)</code>: ringkasan per kelompok.</li>
  <li><code>order by sum(E) desc</code>: urutkan dari yang terbesar.</li>
  <li><code>limit 5</code>: ambil 5 baris teratas.</li>
  <li><code>label sum(E) 'Total omzet'</code>: mengganti judul kolom hasil.</li>
 </ul>
 <h3>Kesalahan yang sering terjadi</h3>
 <ul>
  <li>Satu kolom berisi campuran angka dan teks. QUERY hanya membaca tipe yang paling banyak, sisanya dianggap kosong. Rapikan dulu datanya.</li>
  <li>Tanggal di dalam <code>where</code> harus ditulis <code>date '2026-11-01'</code>, bukan 01/11/2026.</li>
  <li>Kalau sumbernya hasil rumus lain (misalnya <code>{A1:E200}</code>), kolom ditulis <code>Col1</code>, <code>Col2</code>, dan seterusnya.</li>
 </ul>
 <p>Di Excel tidak ada QUERY. Hasil yang sama dibuat dengan PivotTable, atau rumus <code>GROUPBY</code>, <code>FILTER</code>, dan <code>SORT</code> yang sudah kamu pelajari di modul Array dinamis.</p>`,
 quiz:[
  {q:'Kamu ingin total penjualan (kolom E) per cabang (kolom B), dari yang terbesar. Perintah QUERY yang tepat?',opts:['"select B, E order by E"','"select B, sum(E) group by B order by sum(E) desc"','"sum E by B"','"select sum(B), E group by E"'],a:1,why:'group by B mengelompokkan per cabang, sum(E) menjumlah penjualan, order by … desc mengurutkan dari yang terbesar.'},
  {q:'Bagaimana menulis syarat teks Jakarta di dalam QUERY?',opts:['where B = "Jakarta"',"where B = 'Jakarta'",'where B is Jakarta','where Jakarta'],a:1,why:'Teks di dalam perintah QUERY memakai tanda kutip tunggal, karena seluruh perintah sudah diapit tanda kutip ganda.'},
 ]},

{id:'gs-import',mod:'modern',type:'read',title:'IMPORTRANGE, ARRAYFORMULA, dan GOOGLEFINANCE',fns:'IMPORTRANGE · ARRAYFORMULA · GOOGLEFINANCE',preview:null,
 body:`<h3>IMPORTRANGE: mengambil data dari file lain</h3>
 <p>Misalnya setiap cabang punya file sendiri, dan kamu membuat file rekap di kantor pusat.</p>
 <pre class="code">=IMPORTRANGE("https://docs.google.com/spreadsheets/d/…"; "Penjualan!A1:F500")</pre>
 <p>Pertama kali dipakai, muncul tombol <b>Allow access</b>. Klik sekali, dan selanjutnya data ikut terbarui sendiri. Kamu harus punya akses ke file sumbernya. Gabungkan dengan QUERY untuk langsung meringkas: <code>=QUERY(IMPORTRANGE(…); "select Col2, sum(Col6) group by Col2"; 1)</code>.</p>
 <h3>ARRAYFORMULA: satu rumus untuk satu kolom</h3>
 <p>Di Sheets, rumus biasa tidak otomatis meluber ke bawah seperti array dinamis di Excel 365. <code>ARRAYFORMULA</code> membuat satu rumus mengisi seluruh kolom:</p>
 <pre class="code">=ARRAYFORMULA(IF(B2:B="";"";C2:C*D2:D))</pre>
 <p>Bagian <code>IF(B2:B="";"";…)</code> mencegah hasil 0 di baris kosong. Kelebihannya, baris baru di bawah langsung ikut terhitung tanpa menyalin rumus.</p>
 <h3>GOOGLEFINANCE: kurs dan harga saham</h3>
 <pre class="code">=GOOGLEFINANCE("CURRENCY:USDIDR")</pre>
 <p>Mengambil kurs dolar ke rupiah terbaru. Untuk riwayat: <code>=GOOGLEFINANCE("CURRENCY:USDIDR"; "price"; DATE(2026;10;1); DATE(2026;10;31); "DAILY")</code>. Datanya bisa terlambat beberapa menit dan bukan untuk transaksi resmi, tetapi cukup untuk estimasi harga impor atau laporan internal.</p>
 <div class="tip"><b>Fungsi lain yang berguna:</b> <code>GOOGLETRANSLATE(A2;"en";"id")</code> untuk menerjemahkan teks, <code>IMAGE(url)</code> untuk menampilkan foto produk di sel, dan <code>SPARKLINE(B2:M2)</code> untuk grafik mini.</div>`,
 quiz:[
  {q:'Rumus IMPORTRANGE menampilkan #REF! dengan tombol Allow access. Apa yang harus dilakukan?',opts:['Menulis ulang rumusnya','Klik Allow access sekali','Mengunduh file sumber','Mengganti dengan VLOOKUP'],a:1,why:'Sheets meminta izin sekali untuk menghubungkan dua file. Setelah diizinkan, data mengalir otomatis.'},
  {q:'Kenapa ARRAYFORMULA sering dibungkus IF(B2:B="";"";…)?',opts:['Supaya lebih cepat','Supaya baris kosong tidak menampilkan 0 atau error','Wajib secara aturan','Supaya bisa dicetak'],a:1,why:'Tanpa IF, baris yang belum terisi ikut dihitung dan menampilkan 0 sampai ke bawah sheet.'},
 ]},

{id:'ai-rumus',mod:'modern',title:'Minta rumus ke AI, lalu periksa hasilnya',fns:'Prompt · VLOOKUP · XLOOKUP',
 intro:`<p>ChatGPT, Claude, Gemini, atau Copilot bisa membuatkan rumus dalam hitungan detik. Hasilnya sering benar, tetapi tidak selalu. Tugasmu ada dua: memberi permintaan yang jelas, dan memeriksa rumus yang dihasilkan sebelum dipakai di laporan.</p>
 <h3>Permintaan yang bagus</h3>
 <ul>
  <li>Sebut <b>letak datanya</b>: "Kode barang di A2:A10, harga di C2:C10."</li>
  <li>Sebut <b>hasil yang diinginkan</b> dan contohnya: "Di F2 tampilkan harga untuk kode di E2. Kode B-03 harusnya 18.500."</li>
  <li>Sebut <b>versi Excel</b> dan bahasanya: "Excel 2019 berbahasa Indonesia." Supaya AI tidak memakai fungsi yang belum ada di versimu, dan memakai titik koma.</li>
  <li>Minta <b>penjelasan per bagian</b>, supaya kamu bisa memeriksanya.</li>
 </ul>
 <h3>Cara memeriksa</h3>
 <ul>
  <li>Coba pada beberapa baris yang jawabannya sudah kamu tahu.</li>
  <li>Uji kasus aneh: sel kosong, kode yang tidak ada, data ganda.</li>
  <li>Cek tanda <code>$</code>: apakah rentangnya tetap benar setelah disalin ke bawah?</li>
  <li>Waspadai VLOOKUP tanpa argumen keempat. Defaultnya pencarian kira-kira, jadi bisa mengembalikan baris yang salah tanpa error.</li>
 </ul>`,
 syntax:'=VLOOKUP(E2,A2:C10,3,FALSE)',parts:[['E2','kode yang dicari'],['A2:C10','tabel, kolom pertama berisi kode'],['3','ambil kolom ketiga (Harga)'],['FALSE','wajib: cari yang persis sama']],
 note:'<b>Contoh nyata:</b> AI menyarankan <code>=VLOOKUP(E2,A2:C10,3)</code>. Karena kode di kolom A tidak urut, hasilnya bisa #N/A, atau yang lebih berbahaya, harga barang lain tanpa pesan error sama sekali.',
 task:'AI memberi rumus <code>=VLOOKUP(E2,A2:C10,3)</code> untuk harga kode di E2, dan hasilnya tidak bisa dipercaya. Tulis rumus yang benar di <code>F2</code>.',
 cols:6,rows:10,target:'F2',solution:'=VLOOKUP(E2,A2:C10,3,FALSE)',use:['VLOOKUP|XLOOKUP|INDEX'],bold:['E1','F1'],
 hint:'Tambahkan argumen keempat FALSE (atau 0) supaya VLOOKUP mencari kode yang persis sama. XLOOKUP(E2,A2:A10,C2:C10) juga benar, karena XLOOKUP selalu mencari yang persis secara bawaan.',
 data:{A1:'Kode',B1:'Barang',C1:'Harga',E1:'Kode dicari',F1:'Harga',A2:'B-07',B2:'Gula 1 kg',C2:17500,A3:'B-02',B3:'Minyak 2 L',C3:38900,A4:'B-09',B4:'Tepung 1 kg',C4:12800,A5:'B-03',B5:'Beras 5 kg',C5:74500,A6:'B-05',B6:'Kecap 520 ml',C6:23900,A7:'B-01',B7:'Garam 250 g',C7:4500,A8:'B-08',B8:'Teh celup 25',C8:8200,A9:'B-04',B9:'Kopi 200 g',C9:31000,A10:'B-06',B10:'Susu 1 L',C10:19500,E2:'B-03'}},
);
}

export { MODULES, CERT, LESSONS };
