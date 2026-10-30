/* Jagoan Excel — studi kasus kantor per divisi */
import { XL } from '../engine/engine.js';
import { CASES_IND_A } from './cases-ind-a.js';
import { CASES_IND_B } from './cases-ind-b.js';
import { CASES_KHUSUS } from './cases-khusus.js';
import { CASES_SULIT } from './cases-sulit.js';

/** @type {any[]} */ let CASES;
{
const D=XL.D;
const col=(c,a,b)=>{const o=[];for(let r=a;r<=b;r++)o.push(c+r);return o};
CASES=[
{id:'kasus-arus-kas',div:'Keuangan',title:'Buku kas harian',free:true,
 scenario:'Kamu memegang kas operasional kantor. Setiap transaksi dicatat per baris, dan atasan ingin melihat saldo setelah setiap transaksi serta saldo terendah minggu ini untuk memastikan kas tidak pernah minus.',
 cols:5,rows:11,fmt:{A:'date'},bold:['A10','A11'],
 data:{A1:'Tanggal',B1:'Keterangan',C1:'Masuk',D1:'Keluar',E1:'Saldo',A2:D(2026,10,5),B2:'Saldo awal',C2:25000000,E2:'=C2-D2',A3:D(2026,10,5),B3:'Pelunasan PT Arta Niaga',C3:18500000,A4:D(2026,10,6),B4:'Sewa gudang Oktober',D4:12000000,A5:D(2026,10,6),B5:'Penjualan tunai',C5:7250000,A6:D(2026,10,7),B6:'Upah pekerja harian',D6:4800000,A7:D(2026,10,8),B7:'Listrik dan air',D7:3150000,A8:D(2026,10,9),B8:'Pelunasan CV Bintang',C8:9600000,A10:'Total penerimaan',A11:'Saldo terendah'},
 tasks:[
  {target:'E3',text:'Isi <code>E3</code> dengan saldo berjalan: saldo sebelumnya ditambah uang masuk dikurangi uang keluar. Lalu salin ke bawah sampai E8.',solution:'=E2+C3-D3',fill:col('E',4,8),hint:'Saldo sebelumnya ada di E2. Sel kosong di kolom Masuk atau Keluar dihitung sebagai 0.'},
  {target:'C10',text:'Isi <code>C10</code> dengan total penerimaan minggu ini, tanpa saldo awal.',solution:'=SUM(C3:C8)',use:['SUM'],hint:'Mulai dari C3, karena C2 adalah saldo awal, bukan penerimaan.'},
  {target:'E11',text:'Isi <code>E11</code> dengan saldo terendah selama periode ini.',solution:'=MIN(E2:E8)',use:['MIN'],hint:'Pastikan kolom E sudah terisi sampai E8 sebelum menghitung MIN.'},
 ]},

{id:'kasus-leasing',div:'Keuangan',title:'Simulasi kredit kendaraan operasional',
 scenario:'Perusahaan berencana membeli satu mobil boks secara kredit. Direktur keuangan meminta simulasi pokok pinjaman setelah uang muka, cicilan per bulan dengan bunga efektif, dan total bunga yang dibayar sampai lunas.',
 cols:2,rows:8,fmt:{B2:'pct',B4:'pct'},bold:['A3','A6','A7'],
 data:{A1:'Harga kendaraan',B1:285000000,A2:'Uang muka',B2:0.2,A3:'Pokok pinjaman',A4:'Bunga efektif per tahun',B4:0.095,A5:'Tenor (bulan)',B5:36,A6:'Cicilan per bulan',A7:'Total bunga'},
 tasks:[
  {target:'B3',text:'Isi <code>B3</code> dengan pokok pinjaman, yaitu harga dikurangi uang muka.',solution:'=B1*(1-B2)',hint:'Uang muka 20%, jadi yang dipinjam 80% dari harga.'},
  {target:'B6',text:'Isi <code>B6</code> dengan cicilan per bulan.',solution:'=PMT(B4/12,B5,-B3)',use:['PMT'],hint:'Tenor sudah dalam bulan, jadi cukup bunga yang dibagi 12.'},
  {target:'B7',text:'Isi <code>B7</code> dengan total bunga selama masa kredit.',solution:'=B6*B5-B3',hint:'Total yang dibayar (cicilan × tenor) dikurangi pokok pinjaman.'},
 ]},

{id:'kasus-aging',div:'Akuntansi',title:'Umur piutang (aging schedule)',
 scenario:'Menjelang tutup bulan, bagian akuntansi perlu mengelompokkan piutang berdasarkan berapa lama sudah lewat jatuh tempo. Hasilnya dipakai untuk menagih dan menghitung cadangan kerugian piutang.',
 cols:9,rows:8,fmt:{C:'date',I1:'date'},bold:['H1','H3'],
 data:{A1:'No faktur',B1:'Pelanggan',C1:'Jatuh tempo',D1:'Nilai',E1:'Hari lewat',F1:'Kelompok',H1:'Per tanggal',I1:D(2026,10,31),H3:'Total lewat 60 hari',
  A2:'INV-201',B2:'PT Arta Niaga',C2:D(2026,11,10),D2:12500000,A3:'INV-188',B3:'CV Bintang Timur',C3:D(2026,10,15),D3:8750000,A4:'INV-176',B4:'PT Sinar Logam',C4:D(2026,9,20),D4:21300000,A5:'INV-160',B5:'UD Makmur',C5:D(2026,8,25),D5:4200000,A6:'INV-152',B6:'PT Delta Pangan',C6:D(2026,8,1),D6:15900000,A7:'INV-199',B7:'CV Cahaya',C7:D(2026,10,28),D7:6400000},
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan jumlah hari lewat jatuh tempo per tanggal di I1. Faktur yang belum jatuh tempo bernilai 0. Salin ke bawah.',solution:'=MAX(0,$I$1-C2)',use:['MAX|IF'],abs:'\\$I\\$1',absMsg:'Tanggal laporan di I1 perlu dikunci supaya tidak bergeser saat disalin.',fill:col('E',3,7),hint:'Selisih tanggal laporan dan jatuh tempo bisa negatif. MAX(0, …) mengubah angka negatif menjadi 0.'},
  {target:'F2',text:'Isi <code>F2</code> dengan kelompok umur: <b>Belum jatuh tempo</b> (0 hari), <b>1-30</b>, <b>31-60</b>, atau <b>Lewat 60</b>. Salin ke bawah.',solution:'=IF(E2=0,"Belum jatuh tempo",IF(E2<=30,"1-30",IF(E2<=60,"31-60","Lewat 60")))',use:['IF|IFS'],fill:col('F',3,7),hint:'Tiga IF bertingkat, mulai dari kondisi E2=0.'},
  {target:'I3',text:'Isi <code>I3</code> dengan total nilai piutang di kelompok Lewat 60.',solution:'=SUMIF(F2:F7,"Lewat 60",D2:D7)',use:['SUMIF|SUMIFS'],hint:'Kriterianya teks "Lewat 60", sama persis dengan isi kolom F.'},
 ]},

{id:'kasus-penyusutan',div:'Akuntansi',title:'Register aset dan penyusutan',
 scenario:'Auditor meminta daftar aset tetap dengan penyusutan garis lurus, akumulasi penyusutan sampai akhir tahun buku, dan nilai buku. Aset yang umurnya sudah habis tidak boleh disusutkan melebihi umur manfaatnya.',
 cols:11,rows:5,fmt:{B:'date',K1:'date'},bold:['J1'],
 data:{A1:'Aset',B1:'Tgl perolehan',C1:'Harga',D1:'Nilai sisa',E1:'Umur (th)',F1:'Penyusutan/th',G1:'Akumulasi',H1:'Nilai buku',J1:'Akhir tahun buku',K1:D(2026,12,31),
  A2:'Laptop tim keuangan',B2:D(2024,1,10),C2:18000000,D2:2000000,E2:4,A3:'Mesin press',B3:D(2021,7,1),C3:450000000,D3:50000000,E3:8,A4:'Kendaraan boks',B4:D(2019,3,15),C4:320000000,D4:40000000,E4:5},
 tasks:[
  {target:'F2',text:'Isi <code>F2</code> dengan penyusutan per tahun metode garis lurus. Salin ke bawah.',solution:'=SLN(C2,D2,E2)',use:['SLN'],fill:col('F',3,4),hint:'Atau (Harga − Nilai sisa) ÷ Umur.'},
  {target:'G2',text:'Isi <code>G2</code> dengan akumulasi penyusutan sampai K1: penyusutan per tahun × tahun penuh yang sudah lewat, tetapi tidak lebih dari umur manfaat. Salin ke bawah.',solution:'=F2*MIN(E2,DATEDIF(B2,$K$1,"Y"))',use:['MIN','DATEDIF'],abs:'\\$K\\$1',absMsg:'Kunci K1 supaya tanggal akhir tahun buku tidak bergeser.',fill:col('G',3,4),hint:'Kendaraan boks sudah dipakai 7 tahun, tetapi umurnya hanya 5. MIN(umur, tahun pakai) membatasinya.'},
  {target:'H2',text:'Isi <code>H2</code> dengan nilai buku, lalu salin ke bawah.',solution:'=C2-G2',fill:col('H',3,4),hint:'Harga perolehan dikurangi akumulasi penyusutan.'},
 ]},

{id:'kasus-ppn',div:'Pajak',title:'Rekap PPN keluaran dan masukan',
 scenario:'Setiap bulan, bagian pajak merekap faktur pajak keluaran (penjualan) dan masukan (pembelian) untuk menghitung PPN yang harus disetor. Tarif di H1 hanya contoh; sesuaikan dengan ketentuan yang berlaku.',
 cols:8,rows:7,fmt:{H1:'pct'},bold:['G1','G3','G4','G5'],
 data:{A1:'No faktur',B1:'Jenis',C1:'DPP',D1:'PPN',G1:'Tarif efektif (contoh)',H1:0.11,G3:'PPN keluaran',G4:'PPN masukan',H4:'=SUMIF(B2:B7,"Masukan",D2:D7)',G5:'Kurang (lebih) bayar',
  A2:'FP-001',B2:'Keluaran',C2:45000000,A3:'FP-002',B3:'Keluaran',C3:28500000,A4:'FP-003',B4:'Masukan',C4:31000000,A5:'FP-004',B5:'Keluaran',C5:12750000,A6:'FP-005',B6:'Masukan',C6:9800000,A7:'FP-006',B7:'Masukan',C7:6250000},
 tasks:[
  {target:'D2',text:'Isi <code>D2</code> dengan PPN (DPP × tarif di H1), dibulatkan ke rupiah penuh. Salin ke bawah.',solution:'=ROUND(C2*$H$1,0)',use:['ROUND'],abs:'\\$H\\$1',absMsg:'Kunci H1 dengan $ supaya tarifnya tidak bergeser.',fill:col('D',3,7),hint:'Bungkus perkalian dengan ROUND(…,0).'},
  {target:'H3',text:'Isi <code>H3</code> dengan total PPN keluaran. H4 (masukan) sudah berisi contoh.',solution:'=SUMIF(B2:B7,"Keluaran",D2:D7)',use:['SUMIF|SUMIFS'],hint:'Polanya sama dengan rumus di H4.'},
  {target:'H5',text:'Isi <code>H5</code> dengan PPN kurang bayar: keluaran dikurangi masukan.',solution:'=H3-H4',hint:'Angka positif berarti kurang bayar, negatif berarti lebih bayar.'},
 ]},

{id:'kasus-cuti',div:'HRD',title:'Masa kerja dan sisa cuti',
 scenario:'HRD menyiapkan rekap cuti akhir tahun. Kebijakan perusahaan dalam contoh ini: jatah cuti 12 hari, dan 15 hari untuk karyawan dengan masa kerja 5 tahun atau lebih.',
 cols:9,rows:6,fmt:{B:'date',I1:'date'},bold:['H1','H3'],
 data:{A1:'Nama',B1:'Tgl masuk',C1:'Masa kerja',D1:'Jatah cuti',E1:'Terpakai',F1:'Sisa',H1:'Per tanggal',I1:D(2026,12,31),H3:'Cuti sudah habis',
  A2:'Arif',B2:D(2017,2,1),E2:8,A3:'Dewi',B3:D(2022,6,15),E3:10,A4:'Rizky',B4:D(2025,3,1),E4:3,A5:'Nadia',B5:D(2020,11,20),E5:15},
 tasks:[
  {target:'C2',text:'Isi <code>C2</code> dengan masa kerja dalam tahun penuh per tanggal di I1. Salin ke bawah.',solution:'=DATEDIF(B2,$I$1,"Y")',use:['DATEDIF'],abs:'\\$I\\$1',absMsg:'Kunci I1 supaya tanggal acuan tidak bergeser.',fill:col('C',3,5)},
  {target:'D2',text:'Isi <code>D2</code> dengan jatah cuti sesuai kebijakan. Salin ke bawah.',solution:'=IF(C2>=5,15,12)',use:['IF'],fill:col('D',3,5),hint:'Masa kerja 5 tahun atau lebih mendapat 15 hari.'},
  {target:'F2',text:'Isi <code>F2</code> dengan sisa cuti, lalu salin ke bawah.',solution:'=D2-E2',fill:col('F',3,5)},
  {target:'I3',text:'Isi <code>I3</code> dengan jumlah karyawan yang sisa cutinya 0.',solution:'=COUNTIF(F2:F5,0)',use:['COUNTIF'],hint:'Kriteria angka tidak perlu tanda kutip.'},
 ]},

{id:'kasus-payroll',div:'Payroll',title:'Rekap gaji dan lembur',
 scenario:'Upah lembur per jam dihitung dari 1/173 gaji sebulan. Dalam contoh ini pengali lembur disederhanakan menjadi satu angka di K1; di praktik, pengalinya berbeda untuk jam pertama dan jam berikutnya serta hari libur.',
 cols:11,rows:6,bold:['J1','J3'],
 data:{A1:'Nama',B1:'Gaji pokok',C1:'Tunjangan',D1:'Jam lembur',E1:'Upah lembur',F1:'Potongan',G1:'Gaji bersih',J1:'Pengali lembur',K1:1.5,J3:'Total gaji bersih',
  A2:'Agus',B2:5200000,C2:750000,D2:10,F2:260000,A3:'Bella',B3:6800000,C3:1000000,D3:4,F3:340000,A4:'Candra',B4:4900000,C4:500000,D4:0,F4:245000,A5:'Dina',B5:7500000,C5:1250000,D5:12,F5:375000},
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan upah lembur: gaji pokok ÷ 173 × pengali di K1 × jam lembur, dibulatkan ke rupiah. Salin ke bawah.',solution:'=ROUND(B2/173*$K$1*D2,0)',use:['ROUND'],abs:'\\$K\\$1',absMsg:'Kunci K1 dengan $ sebelum menyalin.',fill:col('E',3,5)},
  {target:'G2',text:'Isi <code>G2</code> dengan gaji bersih: gaji pokok + tunjangan + upah lembur − potongan. Salin ke bawah.',solution:'=B2+C2+E2-F2',fill:col('G',3,5)},
  {target:'K3',text:'Isi <code>K3</code> dengan total gaji bersih yang harus ditransfer.',solution:'=SUM(G2:G5)',use:['SUM']},
 ]},

{id:'kasus-komisi',div:'Penjualan',title:'Pencapaian target dan komisi sales',
 scenario:'Komisi diberikan bertingkat berdasarkan persentase pencapaian target, sesuai tabel di kolom H dan I. Manajer penjualan butuh pencapaian tiap sales, tarif komisinya, dan total komisi yang harus dibayar bulan ini.',
 cols:9,rows:8,fmt:{D:'pct',E:'pct',H:'pct',I:'pct'},bold:['H1','I1','H7'],
 data:{A1:'Sales',B1:'Target',C1:'Realisasi',D1:'Pencapaian',E1:'Komisi',H1:'Pencapaian min.',I1:'Tarif',H2:0,I2:0,H3:0.8,I3:0.01,H4:1,I4:0.025,H5:1.2,I5:0.04,H7:'Total komisi',
  A2:'Agus',B2:150000000,C2:168000000,A3:'Bella',B3:120000000,C3:91200000,A4:'Candra',B4:200000000,C4:248000000,A5:'Dina',B5:100000000,C5:85000000},
 tasks:[
  {target:'D2',text:'Isi <code>D2</code> dengan persentase pencapaian (realisasi ÷ target). Salin ke bawah.',solution:'=C2/B2',fill:col('D',3,5)},
  {target:'E2',text:'Isi <code>E2</code> dengan tarif komisi dari tabel di H2:I5. Salin ke bawah.',solution:'=VLOOKUP(D2,$H$2:$I$5,2,TRUE)',use:['VLOOKUP|XLOOKUP|INDEX'],abs:'\\$H\\$2:\\$I\\$5',absMsg:'Kunci tabel tarif dengan $ sebelum menyalin.',fill:col('E',3,5),hint:'Ini tabel batas bawah, jadi pakai VLOOKUP dengan TRUE.'},
  {target:'I7',text:'Isi <code>I7</code> dengan total komisi semua sales dalam satu rumus.',solution:'=SUMPRODUCT(C2:C5,E2:E5)',use:['SUMPRODUCT'],hint:'Komisi = realisasi × tarif, dijumlah untuk semua baris.'},
 ]},

{id:'kasus-kampanye',div:'Pemasaran',title:'Evaluasi kanal iklan',
 scenario:'Tim pemasaran menjalankan empat kanal iklan bulan lalu. Kamu diminta menghitung CTR, biaya per konversi (CPA), dan ROAS, lalu menunjukkan kanal paling efisien untuk dinaikkan anggarannya.',
 cols:11,rows:6,fmt:{G:'pct'},bold:['K1'],
 data:{A1:'Kanal',B1:'Biaya',C1:'Tayangan',D1:'Klik',E1:'Konversi',F1:'Pendapatan',G1:'CTR',H1:'CPA',I1:'ROAS',K1:'ROAS tertinggi',
  A2:'Instagram Ads',B2:4500000,C2:210000,D2:3150,E2:63,F2:18900000,A3:'Google Search',B3:6200000,C3:85000,D3:4250,E3:118,F3:35400000,A4:'TikTok Ads',B4:3800000,C4:320000,D4:2880,E4:0,F4:0,A5:'Email',B5:750000,C5:12000,D5:960,E5:24,F5:7200000},
 tasks:[
  {target:'G2',text:'Isi <code>G2</code> dengan CTR (klik ÷ tayangan). Salin ke bawah.',solution:'=D2/C2',fill:col('G',3,5)},
  {target:'H2',text:'Isi <code>H2</code> dengan CPA (biaya ÷ konversi). Kalau tidak ada konversi, tampilkan tanda "-". Salin ke bawah.',solution:'=IFERROR(B2/E2,"-")',use:['IFERROR|IF'],fill:col('H',3,5),hint:'TikTok tidak punya konversi, jadi pembagiannya error.'},
  {target:'I2',text:'Isi <code>I2</code> dengan ROAS (pendapatan ÷ biaya). Salin ke bawah.',solution:'=F2/B2',fill:col('I',3,5)},
  {target:'K2',text:'Isi <code>K2</code> dengan nama kanal yang ROAS-nya tertinggi.',solution:'=INDEX(A2:A5,MATCH(MAX(I2:I5),I2:I5,0))',use:['MAX','INDEX|XLOOKUP'],hint:'Cari MAX dari kolom I, lalu ambil nama kanal di baris yang sama.'},
 ]},

{id:'kasus-vendor',div:'Pengadaan',title:'Perbandingan penawaran vendor',
 scenario:'Bagian pengadaan menerima empat penawaran kemasan untuk 500 unit. Harga satuan termurah belum tentu paling hemat setelah ongkos kirim dihitung.',
 cols:9,rows:6,bold:['H2','H3'],
 data:{A1:'Vendor',B1:'Harga satuan',C1:'Qty',D1:'Ongkir',E1:'Total biaya',F1:'Lead time (hari)',H2:'Vendor termurah',H3:'Selisih termahal-termurah',
  A2:'PT Prima Kemas',B2:12400,C2:500,D2:350000,F2:7,A3:'CV Sumber Plastik',B3:11900,C3:500,D3:750000,F3:10,A4:'PT Arunika Pack',B4:12100,C4:500,D4:0,F4:5,A5:'UD Sejahtera',B5:11750,C5:500,D5:1200000,F5:14},
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan total biaya: harga × qty + ongkir. Salin ke bawah.',solution:'=B2*C2+D2',fill:col('E',3,5)},
  {target:'I2',text:'Isi <code>I2</code> dengan nama vendor yang total biayanya paling kecil.',solution:'=INDEX(A2:A5,MATCH(MIN(E2:E5),E2:E5,0))',use:['MIN','INDEX|XLOOKUP'],hint:'Vendor dengan harga satuan termurah belum tentu jawabannya.'},
  {target:'I3',text:'Isi <code>I3</code> dengan selisih total biaya termahal dan termurah.',solution:'=MAX(E2:E5)-MIN(E2:E5)',use:['MAX','MIN']},
 ]},

{id:'kasus-stok',div:'Gudang',title:'Stok akhir dan titik pesan ulang',free:true,
 scenario:'Kepala gudang ingin tahu stok akhir setiap barang dan barang mana yang sudah mencapai titik pesan ulang (reorder point), supaya pembelian bisa diajukan sebelum stok habis.',
 cols:11,rows:7,bold:['J2'],
 data:{A1:'Kode',B1:'Barang',C1:'Stok awal',D1:'Masuk',E1:'Keluar',F1:'Stok akhir',G1:'Titik pesan',H1:'Status',J2:'Perlu dipesan',
  A2:'BR-01',B2:'Kardus 40x30',C2:120,D2:200,E2:260,G2:80,A3:'BR-02',B3:'Lakban bening',C3:85,D3:0,E3:40,G3:30,A4:'BR-03',B4:'Bubble wrap (roll)',C4:14,D4:10,E4:18,G4:8,A5:'BR-04',B5:'Label pengiriman',C5:900,D5:500,E5:1150,G5:300,A6:'BR-05',B6:'Stretch film',C6:22,D6:12,E6:9,G6:10},
 tasks:[
  {target:'F2',text:'Isi <code>F2</code> dengan stok akhir: stok awal + masuk − keluar. Salin ke bawah.',solution:'=C2+D2-E2',fill:col('F',3,6)},
  {target:'H2',text:'Isi <code>H2</code> dengan <b>Pesan ulang</b> kalau stok akhir sama dengan atau di bawah titik pesan, selain itu <b>Aman</b>. Salin ke bawah.',solution:'=IF(F2<=G2,"Pesan ulang","Aman")',use:['IF'],fill:col('H',3,6)},
  {target:'K2',text:'Isi <code>K2</code> dengan jumlah barang yang perlu dipesan.',solution:'=COUNTIF(H2:H6,"Pesan ulang")',use:['COUNTIF']},
 ]},

{id:'kasus-ongkir',div:'Logistik',title:'Menghitung ongkos kirim per zona',
 scenario:'Ongkos kirim ditentukan oleh zona kota tujuan dan berat yang dibulatkan ke atas per kilogram. Data kota-zona dan tarif per zona disimpan di tabel terpisah.',
 cols:12,rows:8,bold:['H1','I1','K1','L1'],
 data:{A1:'Resi',B1:'Kota tujuan',C1:'Berat (kg)',D1:'Zona',E1:'Tarif/kg',F1:'Biaya',H1:'Kota',I1:'Zona',K1:'Zona',L1:'Tarif/kg',
  H2:'Bandung',I2:1,H3:'Semarang',I3:2,H4:'Surabaya',I4:2,H5:'Medan',I5:3,H6:'Makassar',I6:3,H7:'Jayapura',I7:4,K2:1,L2:9000,K3:2,L3:12000,K4:3,L4:18000,K5:4,L5:32000,
  A2:'RS-1001',B2:'Surabaya',C2:2.3,A3:'RS-1002',B3:'Bandung',C3:0.8,A4:'RS-1003',B4:'Makassar',C4:5.1,A5:'RS-1004',B5:'Jayapura',C5:1.2},
 tasks:[
  {target:'D2',text:'Isi <code>D2</code> dengan zona kota tujuan dari tabel H:I. Salin ke bawah.',solution:'=VLOOKUP(B2,$H$2:$I$7,2,FALSE)',use:['VLOOKUP|XLOOKUP|INDEX'],fill:col('D',3,5),hint:'Pastikan tabel dikunci dengan $ sebelum disalin.'},
  {target:'E2',text:'Isi <code>E2</code> dengan tarif per kg sesuai zona dari tabel K:L. Salin ke bawah.',solution:'=VLOOKUP(D2,$K$2:$L$5,2,FALSE)',use:['VLOOKUP|XLOOKUP|INDEX'],fill:col('E',3,5)},
  {target:'F2',text:'Isi <code>F2</code> dengan biaya kirim: berat dibulatkan ke atas ke kilogram penuh, dikali tarif. Salin ke bawah.',solution:'=ROUNDUP(C2,0)*E2',use:['ROUNDUP|CEILING|CEILING.MATH'],fill:col('F',3,5),hint:'2,3 kg dihitung 3 kg.'},
 ]},

{id:'kasus-sla',div:'Layanan Pelanggan',title:'Kepatuhan SLA tiket',
 scenario:'Setiap tiket punya batas waktu respons sesuai prioritas. Supervisor ingin tahu tiket mana yang lewat SLA, persentase kepatuhan, dan rata-rata waktu respons untuk tiket prioritas tinggi.',
 cols:8,rows:9,fmt:{H2:'pct'},bold:['G2','G3'],
 data:{A1:'Tiket',B1:'Prioritas',C1:'Respons (jam)',D1:'Batas SLA (jam)',E1:'Status',G2:'% tepat SLA',G3:'Rata-rata respons prioritas Tinggi',
  A2:'T-501',B2:'Tinggi',C2:1.5,D2:2,A3:'T-502',B3:'Sedang',C3:5,D3:4,A4:'T-503',B4:'Rendah',C4:10,D4:24,A5:'T-504',B5:'Tinggi',C5:3.2,D5:2,A6:'T-505',B6:'Sedang',C6:2.5,D6:4,A7:'T-506',B7:'Rendah',C7:30,D7:24,A8:'T-507',B8:'Tinggi',C8:0.8,D8:2},
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan <b>Tepat</b> kalau respons tidak melebihi batas SLA, selain itu <b>Lewat</b>. Salin ke bawah.',solution:'=IF(C2<=D2,"Tepat","Lewat")',use:['IF'],fill:col('E',3,8)},
  {target:'H2',text:'Isi <code>H2</code> dengan persentase tiket yang tepat SLA.',solution:'=COUNTIF(E2:E8,"Tepat")/COUNTA(E2:E8)',use:['COUNTIF'],hint:'Jumlah tiket Tepat dibagi jumlah semua tiket.'},
  {target:'H3',text:'Isi <code>H3</code> dengan rata-rata waktu respons untuk tiket prioritas Tinggi.',solution:'=AVERAGEIF(B2:B8,"Tinggi",C2:C8)',use:['AVERAGEIF|AVERAGEIFS']},
 ]},

{id:'kasus-reject',div:'Produksi',title:'Tingkat reject per shift',
 scenario:'Batas reject yang ditetapkan bagian mutu adalah 2%. Manajer pabrik ingin melihat shift mana yang melewati batas, dan berapa tingkat reject shift malam secara keseluruhan.',
 cols:10,rows:8,fmt:{A:'date',E:'pct',J1:'pct',J3:'pct'},bold:['I1','I3'],
 data:{A1:'Tanggal',B1:'Shift',C1:'Produksi',D1:'Reject',E1:'% reject',F1:'Status',I1:'Batas reject',J1:0.02,I3:'Reject shift Malam',
  A2:D(2026,10,5),B2:'Pagi',C2:4800,D2:62,A3:D(2026,10,5),B3:'Malam',C3:4350,D3:118,A4:D(2026,10,6),B4:'Pagi',C4:4920,D4:71,A5:D(2026,10,6),B5:'Malam',C5:4410,D5:96,A6:D(2026,10,7),B6:'Pagi',C6:5010,D6:88,A7:D(2026,10,7),B7:'Malam',C7:4280,D7:79},
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan persentase reject. Salin ke bawah.',solution:'=D2/C2',fill:col('E',3,7)},
  {target:'F2',text:'Isi <code>F2</code> dengan <b>Sesuai</b> kalau % reject tidak melebihi batas di J1, selain itu <b>Di atas batas</b>. Salin ke bawah.',solution:'=IF(E2<=$J$1,"Sesuai","Di atas batas")',use:['IF'],abs:'\\$J\\$1',absMsg:'Kunci J1 sebelum menyalin.',fill:col('F',3,7)},
  {target:'J3',text:'Isi <code>J3</code> dengan tingkat reject gabungan shift Malam: total reject Malam ÷ total produksi Malam.',solution:'=SUMIF(B2:B7,"Malam",D2:D7)/SUMIF(B2:B7,"Malam",C2:C7)',use:['SUMIF|SUMIFS'],hint:'Jangan merata-ratakan persentasenya. Hitung dari total reject dan total produksi, karena volume tiap hari berbeda.'},
 ]},

{id:'kasus-kendaraan',div:'General Affair',title:'Jadwal servis kendaraan',
 scenario:'Kendaraan operasional diservis setiap 6 bulan. Bagian GA ingin tahu jadwal servis berikutnya dan kendaraan mana yang sudah terlambat atau harus segera dijadwalkan dalam 30 hari.',
 cols:9,rows:7,fmt:{C:'date',D:'date',I1:'date'},bold:['H1','H3'],
 data:{A1:'Nopol',B1:'Kendaraan',C1:'Servis terakhir',D1:'Servis berikutnya',E1:'Status',H1:'Per tanggal',I1:D(2026,10,8),H3:'Jumlah terlambat',
  A2:'B 1234 KLM',B2:'Minibus 1',C2:D(2026,3,10),A3:'B 2271 TRQ',B3:'Van boks',C3:D(2026,5,2),A4:'B 9180 PZA',B4:'Minibus 2',C4:D(2026,7,20),A5:'B 4402 SDF',B5:'Pikap',C5:D(2026,4,15),A6:'B 7763 WKN',B6:'Mobil direksi',C6:D(2026,1,28)},
 tasks:[
  {target:'D2',text:'Isi <code>D2</code> dengan tanggal servis berikutnya, 6 bulan setelah servis terakhir. Salin ke bawah.',solution:'=EDATE(C2,6)',use:['EDATE'],fill:col('D',3,6)},
  {target:'E2',text:'Isi <code>E2</code>: <b>Terlambat</b> kalau jadwalnya sebelum I1, <b>Segera</b> kalau dalam 30 hari dari I1, selain itu <b>Aman</b>. Salin ke bawah.',solution:'=IF(D2<$I$1,"Terlambat",IF(D2-$I$1<=30,"Segera","Aman"))',use:['IF|IFS'],abs:'\\$I\\$1',absMsg:'Kunci I1 dengan $ sebelum menyalin.',fill:col('E',3,6)},
  {target:'I3',text:'Isi <code>I3</code> dengan jumlah kendaraan yang terlambat servis.',solution:'=COUNTIF(E2:E6,"Terlambat")',use:['COUNTIF']},
 ]},

{id:'kasus-lisensi',div:'IT',title:'Pemantauan lisensi software',
 scenario:'Tim IT harus memperpanjang lisensi sebelum habis dan menyiapkan anggaran tahunan. Kamu diminta menghitung sisa hari setiap lisensi, total biaya tahunan, dan jumlah lisensi yang habis dalam 60 hari.',
 cols:9,rows:7,fmt:{D:'date',I1:'date'},bold:['H1','H3','H4'],
 data:{A1:'Software',B1:'Seat',C1:'Harga/seat/th',D1:'Berakhir',E1:'Sisa hari',H1:'Per tanggal',I1:D(2026,10,8),H3:'Total biaya tahunan',H4:'Habis ≤ 60 hari',
  A2:'Office suite',B2:45,C2:1850000,D2:D(2027,1,31),A3:'Antivirus endpoint',B3:60,C3:320000,D3:D(2026,11,15),A4:'Desain grafis',B4:6,C4:4200000,D4:D(2026,10,30),A5:'Aplikasi akuntansi',B5:8,C5:3600000,D5:D(2027,6,30),A6:'Video meeting',B6:20,C6:1100000,D6:D(2026,12,1)},
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan sisa hari sampai lisensi berakhir, dihitung dari I1. Salin ke bawah.',solution:'=D2-$I$1',abs:'\\$I\\$1',absMsg:'Kunci I1 dengan $ sebelum menyalin.',fill:col('E',3,6)},
  {target:'I3',text:'Isi <code>I3</code> dengan total biaya lisensi per tahun (seat × harga, semua software).',solution:'=SUMPRODUCT(B2:B6,C2:C6)',use:['SUMPRODUCT']},
  {target:'I4',text:'Isi <code>I4</code> dengan jumlah lisensi yang sisa harinya 60 atau kurang.',solution:'=COUNTIF(E2:E6,"<=60")',use:['COUNTIF|COUNTIFS'],hint:'Kriteria perbandingan ditulis dalam tanda kutip: "&lt;=60".'},
 ]},

{id:'kasus-faktur-ganda',div:'Audit Internal',title:'Deteksi faktur ganda',
 scenario:'Auditor internal menemukan indikasi faktur vendor yang diinput dua kali. Tandai nomor faktur yang muncul lebih dari sekali, hitung nilainya, dan hitung berapa vendor berbeda yang terlibat dalam periode ini.',
 cols:7,rows:9,bold:['F2','F3'],
 data:{A1:'No faktur',B1:'Vendor',C1:'Nilai',D1:'Cek',F2:'Total nilai baris duplikat',F3:'Jumlah vendor',
  A2:'INV-7781',B2:'PT Prima Kemas',C2:4500000,A3:'INV-7790',B3:'CV Sumber Plastik',C3:2150000,A4:'INV-7781',B4:'PT Prima Kemas',C4:4500000,A5:'INV-7802',B5:'PT Arunika Pack',C5:3300000,A6:'INV-7815',B6:'UD Sejahtera',C6:1980000,A7:'INV-7790',B7:'CV Sumber Plastik',C7:2150000,A8:'INV-7820',B8:'PT Delta Pangan',C8:6700000},
 tasks:[
  {target:'D2',text:'Isi <code>D2</code> dengan <b>Duplikat</b> kalau nomor faktur muncul lebih dari sekali di kolom A, selain itu <b>OK</b>. Salin ke bawah.',solution:'=IF(COUNTIF($A$2:$A$8,A2)>1,"Duplikat","OK")',use:['COUNTIF'],abs:'\\$A\\$2:\\$A\\$8',absMsg:'Rentang pencarian A2:A8 harus dikunci.',fill:col('D',3,8)},
  {target:'G2',text:'Isi <code>G2</code> dengan total nilai semua baris yang bertanda Duplikat.',solution:'=SUMIF(D2:D8,"Duplikat",C2:C8)',use:['SUMIF|SUMIFS']},
  {target:'G3',text:'Isi <code>G3</code> dengan jumlah vendor yang berbeda.',solution:'=COUNTA(UNIQUE(B2:B8))',use:['UNIQUE'],hint:'UNIQUE mengambil vendor tanpa duplikat, lalu COUNTA menghitungnya.'},
 ]},

{id:'kasus-kpi',div:'Manajemen',title:'Ringkasan KPI tahunan untuk direksi',
 scenario:'Direksi ingin satu tabel ringkas: pertumbuhan setiap indikator dibanding tahun lalu dan statusnya terhadap target. Status Hampir berarti pertumbuhan sudah mencapai minimal 75% dari target.',
 cols:9,rows:6,fmt:{D:'pct',E:'pct',I2:'pct'},bold:['H2'],
 data:{A1:'Indikator',B1:'2025',C1:'2026',D1:'Pertumbuhan',E1:'Target tumbuh',F1:'Status',H2:'Rata-rata pertumbuhan',
  A2:'Pendapatan (juta)',B2:48200,C2:55900,E2:0.12,A3:'Laba bersih (juta)',B3:6150,C3:6480,E3:0.08,A4:'Pelanggan aktif',B4:1840,C4:2210,E4:0.15,A5:'Transaksi online',B5:12400,C5:13350,E5:0.1},
 tasks:[
  {target:'D2',text:'Isi <code>D2</code> dengan pertumbuhan: (2026 − 2025) ÷ 2025. Salin ke bawah.',solution:'=(C2-B2)/B2',fill:col('D',3,5),hint:'Jangan lupa kurung, supaya pengurangan dihitung sebelum pembagian.'},
  {target:'F2',text:'Isi <code>F2</code> dengan <b>Tercapai</b>, <b>Hampir</b>, atau <b>Tidak tercapai</b>. Salin ke bawah.',solution:'=IFS(D2>=E2,"Tercapai",D2>=E2*0.75,"Hampir",TRUE,"Tidak tercapai")',use:['IFS|IF'],fill:col('F',3,5)},
  {target:'I2',text:'Isi <code>I2</code> dengan rata-rata pertumbuhan keempat indikator.',solution:'=AVERAGE(D2:D5)',use:['AVERAGE']},
 ]},

{id:'kasus-proyek',div:'Manajemen Proyek',title:'Progres dan tenggat proyek',
 scenario:'Project manager memantau empat paket pekerjaan implementasi sistem. Ia butuh progres masing-masing, status terhadap tenggat, dan sisa hari kerja menuju tenggat pelatihan pengguna.',
 cols:10,rows:6,fmt:{C:'date',F:'pct',J1:'date'},bold:['I1','I3'],
 data:{A1:'Pekerjaan',B1:'PIC',C1:'Tenggat',D1:'Subtugas',E1:'Selesai',F1:'Progres',G1:'Status',I1:'Per tanggal',J1:D(2026,10,8),I3:'Sisa hari kerja (pelatihan)',
  A2:'Desain sistem',B2:'Rina',C2:D(2026,10,2),D2:12,E2:12,A3:'Pengembangan modul',B3:'Yusuf',C3:D(2026,10,30),D3:40,E3:22,A4:'Migrasi data',B4:'Maya',C4:D(2026,10,6),D4:8,E4:5,A5:'Pelatihan pengguna',B5:'Hendra',C5:D(2026,11,13),D5:6,E5:0},
 tasks:[
  {target:'F2',text:'Isi <code>F2</code> dengan progres (subtugas selesai ÷ total subtugas). Salin ke bawah.',solution:'=E2/D2',fill:col('F',3,5)},
  {target:'G2',text:'Isi <code>G2</code>: <b>Selesai</b> kalau progres 100%, <b>Terlambat</b> kalau tenggat sudah lewat dari J1, selain itu <b>Berjalan</b>. Salin ke bawah.',solution:'=IF(F2=1,"Selesai",IF(C2<$J$1,"Terlambat","Berjalan"))',use:['IF|IFS'],abs:'\\$J\\$1',absMsg:'Kunci J1 sebelum menyalin.',fill:col('G',3,5)},
  {target:'J3',text:'Isi <code>J3</code> dengan jumlah hari kerja dari J1 sampai tenggat pelatihan pengguna (C5).',solution:'=NETWORKDAYS(J1,C5)',use:['NETWORKDAYS']},
 ]},

{id:'kasus-toko',div:'Retail',title:'Rekap penjualan toko',
 scenario:'Pemilik toko ingin tahu nilai setiap transaksi, total penjualan per kategori yang bisa dipilih, dan produk dari transaksi bernilai terbesar minggu ini.',
 cols:10,rows:10,fmt:{A:'date'},bold:['H2','H5'],
 data:{A1:'Tanggal',B1:'Produk',C1:'Kategori',D1:'Qty',E1:'Harga',F1:'Nilai',H1:'Kategori',I1:'Minuman',H2:'Penjualan kategori',H5:'Transaksi terbesar',
  A2:D(2026,10,5),B2:'Kopi bubuk 250 g',C2:'Minuman',D2:12,E2:38000,A3:D(2026,10,5),B3:'Teh celup',C3:'Minuman',D3:20,E3:14500,A4:D(2026,10,5),B4:'Gula 1 kg',C4:'Sembako',D4:15,E4:17500,A5:D(2026,10,6),B5:'Beras 5 kg',C5:'Sembako',D5:9,E5:78000,A6:D(2026,10,6),B6:'Kopi bubuk 250 g',C6:'Minuman',D6:7,E6:38000,A7:D(2026,10,7),B7:'Minyak 2 L',C7:'Sembako',D7:11,E7:36000,A8:D(2026,10,7),B8:'Biskuit kaleng',C8:'Camilan',D8:6,E8:65000,A9:D(2026,10,7),B9:'Teh celup',C9:'Minuman',D9:14,E9:14500},
 tasks:[
  {target:'F2',text:'Isi <code>F2</code> dengan nilai transaksi (qty × harga). Salin ke bawah.',solution:'=D2*E2',fill:col('F',3,9)},
  {target:'I2',text:'Isi <code>I2</code> dengan total penjualan untuk kategori di I1. Setelah benar, ganti I1 menjadi Sembako.',solution:'=SUMIF(C2:C9,I1,F2:F9)',use:['SUMIF|SUMIFS'],editable:['I1']},
  {target:'I5',text:'Isi <code>I5</code> dengan nama produk dari transaksi yang nilainya paling besar.',solution:'=INDEX(B2:B9,MATCH(MAX(F2:F9),F2:F9,0))',use:['MAX','INDEX|XLOOKUP']},
 ]},
/* ===== tambahan: keuangan, akuntansi, audit, pajak ===== */
{id:'kasus-varians-anggaran',div:'Keuangan',title:'Varians anggaran vs realisasi',free:true,
 scenario:'Tim FP&A menyiapkan laporan bulanan untuk direksi: berapa selisih realisasi terhadap anggaran per pos biaya, berapa persen, dan pos mana yang melewati batas toleransi 5% sehingga perlu penjelasan dari divisi pemiliknya.',
 cols:9,rows:9,fmt:{E:'pct',I1:'pct'},bold:['H1','E9'],
 data:{A1:'Pos biaya',B1:'Anggaran',C1:'Realisasi',D1:'Selisih',E1:'Selisih %',F1:'Status',H1:'Toleransi',I1:0.05,E9:'Pos over budget',
  A2:'Gaji dan tunjangan',B2:850000000,C2:862500000,A3:'Sewa kantor',B3:240000000,C3:240000000,A4:'Listrik dan air',B4:36000000,C4:41200000,A5:'Pemasaran',B5:180000000,C5:151800000,A6:'Perjalanan dinas',B6:60000000,C6:73500000,A7:'ATK',B7:18000000,C7:16900000,A8:'Pelatihan',B8:45000000,C8:28400000},
 tasks:[
  {target:'D2',text:'Isi <code>D2</code> dengan selisih realisasi terhadap anggaran (positif berarti lebih boros). Salin ke bawah sampai D8.',solution:'=C2-B2',fill:col('D',3,8),hint:'Realisasi dikurangi anggaran.'},
  {target:'E2',text:'Isi <code>E2</code> dengan selisih dalam persen dari anggaran. Salin ke bawah.',solution:'=D2/B2',fill:col('E',3,8),hint:'Selisih dibagi anggaran.'},
  {target:'F2',text:'Isi <code>F2</code> dengan <b>Over budget</b> kalau selisih % di atas toleransi I1, <b>Under budget</b> kalau di bawah minus toleransi, selain itu <b>Sesuai</b>. Salin ke bawah.',solution:'=IF(E2>$I$1,"Over budget",IF(E2 < -$I$1,"Under budget","Sesuai"))',use:['IF|IFS'],abs:'\\$I\\$1',absMsg:'Kunci I1 supaya toleransinya tidak bergeser saat disalin.',fill:col('F',3,8),hint:'Dua IF bertingkat: cek dulu di atas +5% (E2 > $I$1), lalu di bawah −5% (E2 < -$I$1). Tanda minus di depan $I$1 membuat toleransinya jadi negatif, jadi -$I$1 = −5%. Bisa juga ditulis E2 < -1*$I$1.'},
  {target:'F9',text:'Isi <code>F9</code> dengan jumlah pos yang berstatus Over budget.',solution:'=COUNTIF(F2:F8,"Over budget")',use:['COUNTIF|COUNTIFS'],hint:'Hitung teks "Over budget" di kolom F.'},
 ]},

{id:'kasus-proyeksi-kas',div:'Keuangan',title:'Proyeksi kas 6 bulan',
 scenario:'Treasury memproyeksikan kas enam bulan ke depan. Perusahaan punya kebijakan saldo minimum Rp100 juta; kalau proyeksi saldo turun di bawahnya, treasury harus menyiapkan fasilitas kredit sebelum bulan itu.',
 cols:8,rows:7,bold:['G1','G2','G4','G5'],
 data:{A1:'Bulan',B1:'Penerimaan',C1:'Pengeluaran',D1:'Arus kas bersih',E1:'Saldo akhir',G1:'Saldo awal',H1:150000000,G2:'Saldo minimum',H2:100000000,G4:'Pertama di bawah minimum',G5:'Saldo terendah',
  A2:'Jan',B2:420000000,C2:455000000,A3:'Feb',B3:380000000,C3:430000000,A4:'Mar',B4:510000000,C4:470000000,A5:'Apr',B5:360000000,C5:415000000,A6:'Mei',B6:400000000,C6:440000000,A7:'Jun',B7:560000000,C7:480000000},
 tasks:[
  {target:'D2',text:'Isi <code>D2</code> dengan arus kas bersih (penerimaan − pengeluaran). Salin ke bawah.',solution:'=B2-C2',fill:col('D',3,7),hint:'Negatif berarti kas berkurang bulan itu.'},
  {target:'E2',text:'Isi <code>E2</code> dengan saldo akhir bulan: saldo awal H1 ditambah arus kas bersih <b>kumulatif</b> sampai bulan itu. Salin ke bawah.',solution:'=$H$1+SUM($D$2:D2)',use:['SUM'],abs:'\\$D\\$2:D2',absMsg:'Rentang kumulatif ditulis $D$2:D2: awalnya dikunci, ujungnya ikut bergeser.',fill:col('E',3,7),hint:'Rentang yang "memanjang": $D$2:D2, lalu saat disalin jadi $D$2:D3, dan seterusnya.'},
  {target:'H4',text:'Isi <code>H4</code> dengan nama bulan <b>pertama</b> yang saldo akhirnya di bawah saldo minimum H2.',solution:'=XLOOKUP(TRUE,E2:E7<H2,A2:A7)',use:['XLOOKUP|INDEX|FILTER|MATCH|XMATCH'],hint:'XLOOKUP(TRUE, E2:E7<H2, A2:A7) mencari TRUE pertama.'},
  {target:'H5',text:'Isi <code>H5</code> dengan saldo akhir terendah selama enam bulan.',solution:'=MIN(E2:E7)',use:['MIN|SMALL'],hint:'MIN dari kolom saldo akhir.'},
 ]},

{id:'kasus-rasio-keuangan',div:'Keuangan',title:'Analisis rasio keuangan',
 scenario:'Bank meminta ringkasan kesehatan keuangan sebelum memperpanjang fasilitas kredit. Data neraca dan laba rugi (dalam juta rupiah) sudah ada; kamu menghitung rasio utama dan menyimpulkan apakah semuanya memenuhi batas sehat.',
 cols:7,rows:7,fmt:{E4:'pct',E5:'pct',F4:'pct',F5:'pct'},bold:['D1','E1','F1','D7'],
 data:{A1:'Aset lancar',B1:2450,A2:'Liabilitas jangka pendek',B2:1380,A3:'Total liabilitas',B3:3900,A4:'Ekuitas',B4:5200,A5:'Pendapatan',B5:12800,A6:'Laba bersih',B6:960,
  D1:'Rasio',E1:'Nilai',F1:'Batas sehat',D2:'Rasio lancar (min.)',F2:1.5,D3:'Utang terhadap ekuitas (maks.)',F3:1,D4:'Margin laba bersih (min.)',E4:'=B6/B5',F4:0.05,D5:'ROE (min.)',F5:0.1,D7:'Kesimpulan'},
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan rasio lancar: aset lancar ÷ liabilitas jangka pendek.',solution:'=B1/B2',hint:'B1 dibagi B2.'},
  {target:'E3',text:'Isi <code>E3</code> dengan rasio utang terhadap ekuitas (DER): total liabilitas ÷ ekuitas.',solution:'=B3/B4',hint:'B3 dibagi B4.'},
  {target:'E5',text:'Isi <code>E5</code> dengan ROE: laba bersih ÷ ekuitas. E4 sudah berisi contoh margin laba.',solution:'=B6/B4',hint:'B6 dibagi B4.'},
  {target:'E7',text:'Isi <code>E7</code> dengan <b>Sehat</b> kalau semua rasio memenuhi batas di kolom F (DER justru harus <b>tidak lebih</b> dari batasnya), selain itu <b>Perlu perhatian</b>.',solution:'=IF(AND(E2>=F2,E3<=F3,E4>=F4,E5>=F5),"Sehat","Perlu perhatian")',use:['AND','IF'],hint:'AND dengan empat syarat. Perhatikan arah tanda untuk DER.'},
 ]},

{id:'kasus-kelayakan-investasi',div:'Keuangan',title:'Kelayakan investasi mesin baru',
 scenario:'Divisi produksi mengusulkan mesin baru senilai Rp1,2 miliar. Sebelum disetujui, keuangan menghitung NPV dengan biaya modal 12%, IRR, dan berapa tahun modalnya kembali (payback period).',
 cols:6,rows:7,fmt:{F1:'pct',F3:'pct'},bold:['E1','E2','E3','E4'],
 data:{A1:'Tahun',B1:'Arus kas',C1:'Kumulatif',A2:0,B2:-1200000000,A3:1,B3:280000000,A4:2,B4:350000000,A5:3,B5:400000000,A6:4,B6:420000000,A7:5,B7:380000000,E1:'Biaya modal',F1:0.12,E2:'NPV',E3:'IRR',E4:'Payback (tahun ke-)'},
 tasks:[
  {target:'C2',text:'Isi <code>C2</code> dengan arus kas kumulatif sampai tahun itu. Salin ke bawah.',solution:'=SUM($B$2:B2)',use:['SUM'],abs:'\\$B\\$2:B2',absMsg:'Rentang kumulatif ditulis $B$2:B2.',fill:col('C',3,7),hint:'Rentang memanjang $B$2:B2.'},
  {target:'F2',text:'Isi <code>F2</code> dengan NPV proyek. Investasi tahun 0 ditambahkan di luar fungsi NPV.',solution:'=NPV(F1,B3:B7)+B2',use:['NPV'],hint:'NPV(F1, B3:B7) + B2.'},
  {target:'F3',text:'Isi <code>F3</code> dengan IRR proyek.',solution:'=IRR(B2:B7)',use:['IRR'],hint:'IRR memakai semua arus kas termasuk tahun 0.'},
  {target:'F4',text:'Isi <code>F4</code> dengan tahun pertama arus kas kumulatif sudah tidak negatif.',solution:'=XLOOKUP(TRUE,C2:C7>=0,A2:A7)',use:['XLOOKUP|INDEX|MATCH|XMATCH|FILTER|MINIFS'],hint:'Cari TRUE pertama dari C2:C7>=0.'},
 ]},

{id:'kasus-rekon-bank',div:'Akuntansi',title:'Rekonsiliasi bank',
 scenario:'Saldo rekening koran dan buku kas tidak sama di akhir bulan. Kamu mencocokkan setiap mutasi bank dengan catatan di buku: ada biaya admin dan jasa giro yang belum dicatat, dan ada setoran yang sudah dicatat di buku tapi belum masuk bank.',
 cols:10,rows:9,bold:['I2','I3'],
 data:{A1:'Tanggal',B1:'Keterangan bank',C1:'Jumlah',D1:'Status',F1:'Jumlah di buku',I2:'Belum dicatat di buku',I3:'Setoran dalam perjalanan',
  A2:D(2026,10,2),B2:'Transfer masuk PT Arta',C2:12500000,A3:D(2026,10,5),B3:'Cek 00451',C3:-3250000,A4:D(2026,10,9),B4:'Transfer masuk CV Cahaya',C4:8750000,A5:D(2026,10,15),B5:'Biaya administrasi',C5:-150000,A6:D(2026,10,18),B6:'Setoran tunai',C6:4200000,A7:D(2026,10,22),B7:'Cek 00452',C7:-2875000,A8:D(2026,10,31),B8:'Jasa giro',C8:25000,A9:D(2026,10,31),B9:'Transfer keluar sewa',C9:-6400000,
  F2:12500000,F3:-3250000,F4:8750000,F5:4200000,F6:-2875000,F7:-6400000,F8:9100000},
 fmt:{A:'date'},
 tasks:[
  {target:'D2',text:'Isi <code>D2</code> dengan <b>Cocok</b> kalau jumlah di C2 ada di daftar buku (F2:F8), selain itu <b>Belum dicatat</b>. Salin ke bawah.',solution:'=IF(COUNTIF($F$2:$F$8,C2)>0,"Cocok","Belum dicatat")',use:['COUNTIF|COUNTIFS|XLOOKUP|MATCH|XMATCH|ISNUMBER'],abs:'\\$F\\$2:\\$F\\$8',absMsg:'Kunci daftar buku $F$2:$F$8.',fill:col('D',3,9),hint:'COUNTIF(daftar buku, C2) > 0 berarti ada.'},
  {target:'J2',text:'Isi <code>J2</code> dengan total mutasi bank yang belum dicatat di buku.',solution:'=SUMIF(D2:D9,"Belum dicatat",C2:C9)',use:['SUMIF|SUMIFS|SUMPRODUCT|FILTER'],hint:'SUMIF dengan kriteria "Belum dicatat".'},
  {target:'J3',text:'Isi <code>J3</code> dengan total transaksi di buku yang <b>tidak ada</b> di rekening koran (setoran dalam perjalanan).',solution:'=SUMPRODUCT((COUNTIF(C2:C9,F2:F8)=0)*F2:F8)',use:['COUNTIF|COUNTIFS|XMATCH|MATCH|ISNA'],hint:'Kebalikan dari tugas 1: COUNTIF(C2:C9, F2:F8)=0 untuk setiap baris buku, lalu jumlahkan dengan SUMPRODUCT atau SUM(FILTER(…)).'},
 ]},

{id:'kasus-neraca-saldo',div:'Akuntansi',title:'Dari jurnal umum ke neraca saldo',
 scenario:'Jurnal umum bulan ini sudah dicatat. Sebelum menyusun laporan keuangan, kamu merangkumnya menjadi neraca saldo per akun dan memastikan total debit sama dengan total kredit.',
 cols:9,rows:13,bold:['F10'],
 data:{A1:'No jurnal',B1:'Akun',C1:'Debit',D1:'Kredit',F1:'Akun',G1:'Debit',H1:'Kredit',I1:'Saldo',F10:'Cek jurnal',
  A2:'JU-01',B2:'Kas',C2:50000000,A3:'JU-01',B3:'Pendapatan',D3:50000000,A4:'JU-02',B4:'Piutang usaha',C4:32000000,A5:'JU-02',B5:'Pendapatan',D5:32000000,A6:'JU-03',B6:'Beban gaji',C6:18500000,A7:'JU-03',B7:'Kas',D7:18500000,
  A8:'JU-04',B8:'Beban sewa',C8:7500000,A9:'JU-04',B9:'Kas',D9:7500000,A10:'JU-05',B10:'Persediaan',C10:21000000,A11:'JU-05',B11:'Utang usaha',D11:21000000,A12:'JU-06',B12:'Kas',C12:20000000,A13:'JU-06',B13:'Piutang usaha',D13:20000000,
  F2:'Kas',F3:'Piutang usaha',F4:'Persediaan',F5:'Utang usaha',F6:'Pendapatan',F7:'Beban gaji',F8:'Beban sewa'},
 tasks:[
  {target:'G2',text:'Isi <code>G2</code> dengan total debit akun di F2 dari jurnal. Salin ke bawah sampai G8.',solution:'=SUMIF($B$2:$B$13,F2,$C$2:$C$13)',use:['SUMIF|SUMIFS'],abs:'\\$B\\$2:\\$B\\$13',absMsg:'Kunci rentang jurnal dengan $ supaya tidak bergeser.',fill:col('G',3,8),hint:'SUMIF(kolom akun, F2, kolom debit).'},
  {target:'H2',text:'Isi <code>H2</code> dengan total kredit akun di F2. Salin ke bawah.',solution:'=SUMIF($B$2:$B$13,F2,$D$2:$D$13)',use:['SUMIF|SUMIFS'],abs:'\\$B\\$2:\\$B\\$13',absMsg:'Kunci rentang jurnal dengan $.',fill:col('H',3,8),hint:'Sama seperti debit, kolom yang dijumlahkan D.'},
  {target:'I2',text:'Isi <code>I2</code> dengan saldo (debit − kredit). Salin ke bawah.',solution:'=G2-H2',fill:col('I',3,8),hint:'Saldo negatif berarti saldo normal kredit (utang, pendapatan).'},
  {target:'G10',text:'Isi <code>G10</code> dengan <b>Seimbang</b> kalau total debit jurnal sama dengan total kredit, selain itu <b>Tidak seimbang</b>.',solution:'=IF(SUM(C2:C13)=SUM(D2:D13),"Seimbang","Tidak seimbang")',use:['IF','SUM'],hint:'Bandingkan SUM kolom C dan SUM kolom D.'},
 ]},

{id:'kasus-biaya-dibayar-dimuka',div:'Akuntansi',title:'Amortisasi biaya dibayar di muka',
 scenario:'Perusahaan membayar asuransi, sewa server, dan lisensi di muka. Setiap akhir bulan akuntansi membebankan porsinya. Kamu menghitung beban per bulan, berapa bulan sudah berjalan sampai tanggal laporan, dan sisa saldo dibayar di muka.',
 cols:11,rows:5,fmt:{C:'date',K1:'date'},bold:['J1'],
 data:{A1:'Pos',B1:'Dibayar',C1:'Mulai',D1:'Masa (bulan)',E1:'Beban/bulan',F1:'Bulan berjalan',G1:'Sisa di muka',J1:'Per tanggal',K1:D(2026,10,31),
  A2:'Asuransi gedung',B2:36000000,C2:D(2026,1,1),D2:12,A3:'Asuransi kendaraan',B3:14400000,C3:D(2025,11,1),D3:12,A4:'Sewa server',B4:60000000,C4:D(2026,4,1),D4:24,A5:'Lisensi ERP',B5:90000000,C5:D(2024,7,1),D5:36},
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan beban per bulan. Salin ke bawah.',solution:'=B2/D2',fill:col('E',3,5),hint:'Jumlah dibayar dibagi masa manfaat.'},
  {target:'F2',text:'Isi <code>F2</code> dengan jumlah bulan yang sudah dibebankan sampai akhir bulan K1 (bulan mulai ikut dihitung), maksimal sebesar masa manfaat. Salin ke bawah.',solution:'=MIN(D2,DATEDIF(C2,$K$1+1,"M"))',use:['MIN|IF','DATEDIF|YEAR|MONTH|YEARFRAC'],abs:'\\$K\\$1',absMsg:'Kunci tanggal laporan K1.',fill:col('F',3,5),hint:'Dari 1 Jan sampai 31 Okt = 10 bulan. DATEDIF(C2, K1+1, "M") menghitung bulan penuh sampai 1 Nov, lalu batasi dengan MIN.'},
  {target:'G2',text:'Isi <code>G2</code> dengan sisa biaya dibayar di muka. Salin ke bawah.',solution:'=B2-E2*F2',fill:col('G',3,5),hint:'Jumlah dibayar dikurangi beban yang sudah diakui.'},
 ]},

{id:'kasus-hpp-rata-rata',div:'Akuntansi',title:'HPP metode rata-rata tertimbang',
 scenario:'Gudang mencatat pembelian dan pengeluaran barang sepanjang bulan. Untuk laporan laba rugi, akuntansi memakai metode rata-rata tertimbang (periodik): satu harga rata-rata untuk semua unit yang tersedia dijual.',
 cols:8,rows:7,bold:['G1','G2','G3','G4','G5'],
 data:{A1:'Tanggal',B1:'Keterangan',C1:'Qty masuk',D1:'Harga beli',E1:'Qty keluar',
  A2:D(2026,10,1),B2:'Saldo awal',C2:200,D2:15000,A3:D(2026,10,4),B3:'Pembelian',C3:300,D3:16000,A4:D(2026,10,9),B4:'Penjualan',E4:250,A5:D(2026,10,14),B5:'Pembelian',C5:400,D5:16500,A6:D(2026,10,20),B6:'Penjualan',E6:380,A7:D(2026,10,27),B7:'Pembelian',C7:150,D7:17000,
  G1:'Harga rata-rata',G2:'Qty terjual',H2:'=SUM(E2:E7)',G3:'HPP',G4:'Sisa unit',H4:'=SUM(C2:C7)-H2',G5:'Nilai persediaan akhir'},
 fmt:{A:'date'},
 tasks:[
  {target:'H1',text:'Isi <code>H1</code> dengan harga rata-rata tertimbang: total nilai barang tersedia (qty × harga) dibagi total qty masuk.',solution:'=SUMPRODUCT(C2:C7,D2:D7)/SUM(C2:C7)',use:['SUMPRODUCT|SUM'],hint:'SUMPRODUCT(C2:C7, D2:D7) / SUM(C2:C7). Baris penjualan kosong di kolom C dan D, jadi tidak ikut.'},
  {target:'H3',text:'Isi <code>H3</code> dengan harga pokok penjualan (qty terjual × harga rata-rata).',solution:'=H2*H1',hint:'H2 sudah berisi total qty terjual.'},
  {target:'H5',text:'Isi <code>H5</code> dengan nilai persediaan akhir.',solution:'=H4*H1',hint:'Sisa unit di H4 dikali harga rata-rata.'},
 ]},

{id:'kasus-benford',div:'Audit Internal',title:'Uji Benford pada nilai transaksi',
 scenario:'Hukum Benford menyatakan angka 1 paling sering muncul sebagai digit pertama dan angka 9 paling jarang. Auditor internal memakai uji ini untuk mencari pola janggal, misalnya banyak transaksi yang sengaja dibuat sedikit di bawah batas persetujuan Rp7,5 juta.',
 cols:11,rows:31,fmt:{F:'pct',G:'pct'},bold:['D1','E1','F1','G1','J1'],
 data:(()=>{const v=[1250000,1875500,12400000,1420000,16750000,1098000,2340000,27500000,2915000,2080000,3460000,38200000,3125000,4780000,41500000,5620000,5040000,6310000,64900000,7450000,7480000,7495000,7390000,7470000,7499000,7460000,8120000,83000000,9250000,9870000];
  const ord=[19,0,7,22,3,11,25,14,5,28,20,1,9,17,23,4,12,26,8,15,21,2,29,10,24,6,18,13,27,16];
  const d={A1:'No bukti',B1:'Nilai',D1:'Digit',E1:'Jumlah',F1:'Proporsi',G1:'Benford',J1:'Digit paling menyimpang'};
  ord.forEach((k,i)=>{d['A'+(i+2)]='BKK-'+String(301+i);d['B'+(i+2)]=v[k]});
  [0.301,0.176,0.125,0.097,0.079,0.067,0.058,0.051,0.046].forEach((b,i)=>{d['D'+(i+2)]=i+1;d['G'+(i+2)]=b});return d})(),
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan banyaknya transaksi yang digit pertamanya sama dengan D2. Salin ke bawah sampai E10.',solution:'=SUMPRODUCT(--(LEFT($B$2:$B$31,1)=D2&""))',use:['SUMPRODUCT|SUM|COUNT|ROWS|FILTER','LEFT|MID|TEXT|INT'],abs:'\\$B\\$2:\\$B\\$31',absMsg:'Kunci rentang nilai transaksi.',fill:col('E',3,10),hint:'LEFT(rentang,1) mengambil digit pertama sebagai teks. Bandingkan dengan D2&"" (angka diubah jadi teks), ubah TRUE/FALSE jadi 1/0 dengan --, lalu SUMPRODUCT.'},
  {target:'F2',text:'Isi <code>F2</code> dengan proporsi digit itu terhadap seluruh transaksi. Salin ke bawah.',solution:'=E2/COUNT($B$2:$B$31)',use:['COUNT|COUNTA|ROWS|SUM'],fill:col('F',3,10),hint:'Jumlah dibagi total transaksi (30).'},
  {target:'K1',text:'Isi <code>K1</code> dengan digit yang proporsinya paling jauh dari harapan Benford (selisih mutlak terbesar).',solution:'=XLOOKUP(MAX(ABS(F2:F10-G2:G10)),ABS(F2:F10-G2:G10),D2:D10)',use:['MAX','ABS'],hint:'ABS(F2:F10−G2:G10) memberi selisih mutlak per digit. Cari posisi MAX-nya dengan XLOOKUP atau INDEX/MATCH.'},
 ]},

{id:'kasus-skor-risiko',div:'Audit Internal',title:'Skor risiko transaksi untuk sampling',
 scenario:'Auditor tidak mungkin memeriksa semua transaksi. Setiap transaksi diberi skor risiko: +1 kalau terjadi di akhir pekan, +1 kalau nilainya angka bulat jutaan, dan +1 kalau di atas materialitas. Transaksi dengan skor 2 atau lebih masuk sampel pemeriksaan.',
 cols:8,rows:11,fmt:{B:'date'},bold:['G1','G3','G4'],
 data:{A1:'No bukti',B1:'Tanggal',C1:'Vendor',D1:'Nilai',E1:'Skor risiko',G1:'Materialitas',H1:50000000,G3:'Jumlah sampel',G4:'Nilai sampel',
  A2:'BKK-501',B2:D(2026,9,5),C2:'CV Sinar Abadi',D2:12000000,A3:'BKK-502',B3:D(2026,9,8),C3:'PT Delta Pangan',D3:48750000,A4:'BKK-503',B4:D(2026,9,13),C4:'UD Maju',D4:75000000,A5:'BKK-504',B5:D(2026,9,15),C5:'PT Arta Niaga',D5:61430000,
  A6:'BKK-505',B6:D(2026,9,19),C6:'CV Sinar Abadi',D6:8350000,A7:'BKK-506',B7:D(2026,9,22),C7:'PT Bina Karya',D7:100000000,A8:'BKK-507',B8:D(2026,9,26),C8:'UD Maju',D8:3275000,A9:'BKK-508',B9:D(2026,9,27),C9:'CV Cahaya',D9:20000000,A10:'BKK-509',B10:D(2026,9,29),C10:'PT Delta Pangan',D10:15600000,A11:'BKK-510',B11:D(2026,9,30),C11:'PT Bina Karya',D11:52000000},
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan skor risiko: (akhir pekan) + (angka bulat jutaan) + (di atas materialitas H1), masing-masing bernilai 1. Salin ke bawah.',solution:'=(WEEKDAY(B2,2)>5)+(MOD(D2,1000000)=0)+(D2>$H$1)',use:['WEEKDAY','MOD'],abs:'\\$H\\$1',absMsg:'Kunci materialitas H1.',fill:col('E',3,11),hint:'WEEKDAY(tanggal,2) memberi 6 untuk Sabtu dan 7 untuk Minggu. MOD(nilai,1000000)=0 berarti bulat jutaan. TRUE+TRUE = 2.'},
  {target:'H3',text:'Isi <code>H3</code> dengan jumlah transaksi yang skornya minimal 2.',solution:'=COUNTIF(E2:E11,">=2")',use:['COUNTIF|COUNTIFS'],hint:'Kriteria ">=2".'},
  {target:'H4',text:'Isi <code>H4</code> dengan total nilai transaksi yang masuk sampel.',solution:'=SUMIF(E2:E11,">=2",D2:D11)',use:['SUMIF|SUMIFS|SUMPRODUCT'],hint:'SUMIF dengan kriteria yang sama.'},
 ]},

{id:'kasus-limit-otorisasi',div:'Audit Internal',title:'Kepatuhan limit otorisasi dan pemecahan transaksi',
 scenario:'Setiap pembelian harus disetujui pejabat dengan limit yang cukup. Auditor memeriksa dua hal: persetujuan yang melebihi limit, dan pemecahan transaksi (split): pembelian ke vendor yang sama di hari yang sama dipecah supaya masing-masing di bawah limit.',
 cols:11,rows:10,fmt:{B:'date'},bold:['J1','K1','J6'],
 data:{A1:'No PO',B1:'Tanggal',C1:'Vendor',D1:'Nilai',E1:'Disetujui',F1:'Limit',G1:'Status',H1:'Total vendor hari itu',J1:'Jabatan',K1:'Limit',J2:'Supervisor',K2:25000000,J3:'Manajer',K3:100000000,J4:'Direktur',K4:1000000000,J6:'Jumlah pelanggaran limit',
  A2:'PO-811',B2:D(2026,8,3),C2:'PT Bina Karya',D2:18500000,E2:'Supervisor',A3:'PO-812',B3:D(2026,8,3),C3:'CV Sinar Abadi',D3:32000000,E3:'Supervisor',A4:'PO-813',B4:D(2026,8,5),C4:'PT Delta Pangan',D4:87500000,E4:'Manajer',A5:'PO-814',B5:D(2026,8,7),C5:'UD Maju',D5:24000000,E5:'Supervisor',
  A6:'PO-815',B6:D(2026,8,7),C6:'UD Maju',D6:23500000,E6:'Supervisor',A7:'PO-816',B7:D(2026,8,10),C7:'PT Arta Niaga',D7:145000000,E7:'Manajer',A8:'PO-817',B8:D(2026,8,12),C8:'CV Cahaya',D8:9800000,E8:'Supervisor',A9:'PO-818',B9:D(2026,8,14),C9:'PT Bina Karya',D9:420000000,E9:'Direktur',A10:'PO-819',B10:D(2026,8,7),C10:'UD Maju',D10:21000000,E10:'Supervisor'},
 tasks:[
  {target:'F2',text:'Isi <code>F2</code> dengan limit pejabat yang menyetujui, dari tabel J–K. Salin ke bawah.',solution:'=XLOOKUP(E2,$J$2:$J$4,$K$2:$K$4)',use:['XLOOKUP|VLOOKUP|INDEX|LOOKUP'],abs:'\\$J\\$2:\\$J\\$4',absMsg:'Kunci tabel limit dengan $.',fill:col('F',3,10),hint:'XLOOKUP(jabatan, kolom jabatan, kolom limit).'},
  {target:'G2',text:'Isi <code>G2</code> dengan <b>Melebihi limit</b> kalau nilai PO di atas limit, selain itu <b>OK</b>. Salin ke bawah.',solution:'=IF(D2>F2,"Melebihi limit","OK")',use:['IF'],fill:col('G',3,10),hint:'Bandingkan D2 dengan F2.'},
  {target:'H2',text:'Isi <code>H2</code> dengan total nilai PO ke vendor yang sama pada tanggal yang sama. Salin ke bawah, lalu lihat PO mana yang totalnya melewati limit walaupun tiap PO-nya OK.',solution:'=SUMIFS($D$2:$D$10,$C$2:$C$10,C2,$B$2:$B$10,B2)',use:['SUMIFS|SUMPRODUCT'],abs:'\\$D\\$2:\\$D\\$10',absMsg:'Kunci rentang data dengan $.',fill:col('H',3,10),hint:'SUMIFS dengan dua kriteria: vendor = C2 dan tanggal = B2.'},
  {target:'K6',text:'Isi <code>K6</code> dengan jumlah PO yang berstatus Melebihi limit.',solution:'=COUNTIF(G2:G10,"Melebihi limit")',use:['COUNTIF|COUNTIFS'],hint:'COUNTIF di kolom G.'},
 ]},

{id:'kasus-nomor-hilang',div:'Audit Internal',title:'Mencari nomor faktur yang hilang',
 scenario:'Nomor faktur penjualan seharusnya berurutan tanpa lompatan. Nomor yang hilang bisa berarti faktur dibatalkan tanpa dokumentasi, atau penjualan yang tidak dicatat. Auditor mencari lompatan dan mendaftar nomor yang hilang.',
 cols:6,rows:16,bold:['E1','E2','E3'],
 data:(()=>{const d={A1:'No faktur',B1:'Lompatan',E1:'Seharusnya ada',E2:'Jumlah hilang',E3:'Nomor hilang'};[1001,1002,1003,1005,1006,1007,1008,1011,1012,1013,1014,1015,1017,1018,1019].forEach((v,i)=>d['A'+(i+2)]=v);return d})(),
 tasks:[
  {target:'B3',text:'Isi <code>B3</code> dengan selisih nomor terhadap baris sebelumnya dikurangi 1 (0 berarti berurutan). Salin ke bawah sampai B16.',solution:'=A3-A2-1',fill:col('B',4,16),hint:'Kalau berurutan, A3−A2 = 1, jadi lompatannya 0.'},
  {target:'F1',text:'Isi <code>F1</code> dengan banyaknya nomor yang seharusnya ada dari nomor terkecil sampai terbesar.',solution:'=MAX(A2:A16)-MIN(A2:A16)+1',use:['MAX','MIN'],hint:'Terbesar − terkecil + 1.'},
  {target:'F2',text:'Isi <code>F2</code> dengan jumlah nomor yang hilang.',solution:'=F1-COUNT(A2:A16)',use:['COUNT|COUNTA|ROWS|SUM'],hint:'Yang seharusnya ada dikurangi yang benar-benar ada. Bisa juga SUM(B3:B16).'},
  {target:'F3',text:'Isi <code>F3</code> dengan daftar nomor yang hilang dalam satu sel, dipisah koma dan spasi.',solution:'=TEXTJOIN(", ",TRUE,FILTER(SEQUENCE(F1,1,MIN(A2:A16)),COUNTIF(A2:A16,SEQUENCE(F1,1,MIN(A2:A16)))=0))',use:['TEXTJOIN','SEQUENCE'],cs:true,hint:'SEQUENCE(F1,1,MIN(A2:A16)) membuat semua nomor yang seharusnya ada. Saring yang COUNTIF-nya 0, lalu gabungkan dengan TEXTJOIN.'},
 ]},

{id:'kasus-pph23',div:'Pajak',title:'Pemotongan PPh 23 atas jasa',
 scenario:'Setiap membayar jasa ke vendor, perusahaan memotong PPh 23. Vendor tanpa NPWP dikenai tarif lebih tinggi (dua kali tarif normal). Tarif di I1 hanya contoh; sesuaikan dengan ketentuan yang berlaku.',
 cols:9,rows:8,fmt:{E:'pct',I1:'pct'},bold:['H1','H3'],
 data:{A1:'Vendor',B1:'Jenis jasa',C1:'DPP',D1:'NPWP',E1:'Tarif',F1:'PPh 23',H1:'Tarif normal (contoh)',I1:0.02,H3:'Total PPh 23',
  A2:'PT Bersih Selalu',B2:'Kebersihan',C2:18500000,D2:'Ada',A3:'CV Kilat Teknik',B3:'Perbaikan AC',C3:4250000,D3:'Tidak',A4:'PT Data Aman',B4:'Konsultan TI',C4:65000000,D4:'Ada',A5:'UD Sumber Rejeki',B5:'Katering',C5:7800000,D5:'Tidak',A6:'PT Jaga Prima',B6:'Keamanan',C6:32000000,D6:'Ada',A7:'CV Cetak Kilat',B7:'Percetakan',C7:2950000,D7:'Ada',A8:'PT Angkut Cepat',B8:'Sewa kendaraan',C8:24000000,D8:'Tidak'},
 tasks:[
  {target:'E2',text:'Isi <code>E2</code> dengan tarif yang berlaku: tarif normal kalau NPWP Ada, dua kali tarif normal kalau Tidak. Salin ke bawah.',solution:'=IF(D2="Ada",$I$1,$I$1*2)',use:['IF|IFS|SWITCH'],abs:'\\$I\\$1',absMsg:'Kunci tarif normal I1.',fill:col('E',3,8),hint:'IF(D2="Ada", $I$1, $I$1*2).'},
  {target:'F2',text:'Isi <code>F2</code> dengan PPh 23 yang dipotong, dibulatkan ke rupiah penuh. Salin ke bawah.',solution:'=ROUND(C2*E2,0)',use:['ROUND|ROUNDDOWN'],fill:col('F',3,8),hint:'DPP × tarif, lalu ROUND(…,0).'},
  {target:'I3',text:'Isi <code>I3</code> dengan total PPh 23 yang harus disetor.',solution:'=SUM(F2:F8)',use:['SUM'],hint:'Jumlahkan kolom F.'},
 ]},

{id:'kasus-pph21-tahunan',div:'Pajak',title:'PPh 21 tahunan dengan PTKP dan tarif progresif',
 scenario:'Di akhir tahun, bagian pajak menghitung PPh 21 setahun untuk setiap karyawan: penghasilan neto dikurangi PTKP sesuai status, dibulatkan ke ribuan ke bawah, lalu dikenai tarif progresif berlapis. Angka PTKP dan tarif di tabel adalah contoh; sesuaikan dengan ketentuan yang berlaku.',
 cols:9,rows:13,fmt:{I:'pct'},bold:['H1','I1','H8','I8'],
 data:{A1:'Nama',B1:'Neto setahun',C1:'Status',D1:'PTKP',E1:'PKP',F1:'PPh 21 setahun',
  A2:'Andi Saputra',B2:96000000,C2:'TK/0',A3:'Citra Lestari',B3:148500000,C3:'K/1',A4:'Dimas Pratama',B4:312750000,C4:'K/2',A5:'Hana Wijaya',B5:61200000,C5:'K/0',A6:'Rizky Halim',B6:684000000,C6:'K/3',
  H1:'Status',I1:'PTKP',H2:'TK/0',I2:54000000,H3:'K/0',I3:58500000,H4:'K/1',I4:63000000,H5:'K/2',I5:67500000,H6:'K/3',I6:72000000,
  H8:'Batas bawah PKP',I8:'Tarif',H9:0,I9:0.05,H10:60000000,I10:0.15,H11:250000000,I11:0.25,H12:500000000,I12:0.3,H13:5000000000,I13:0.35},
 tasks:[
  {target:'D2',text:'Isi <code>D2</code> dengan PTKP sesuai status karyawan dari tabel H–I. Salin ke bawah.',solution:'=XLOOKUP(C2,$H$2:$H$6,$I$2:$I$6)',use:['XLOOKUP|VLOOKUP|INDEX|LOOKUP'],abs:'\\$H\\$2:\\$H\\$6',absMsg:'Kunci tabel PTKP.',fill:col('D',3,6),hint:'XLOOKUP(status, kolom status, kolom PTKP). Hati-hati, I1 juga berisi teks "PTKP".'},
  {target:'E2',text:'Isi <code>E2</code> dengan PKP: neto − PTKP, dibulatkan ke <b>ribuan ke bawah</b>, dan tidak boleh negatif. Salin ke bawah.',solution:'=MAX(0,ROUNDDOWN(B2-D2,-3))',use:['ROUNDDOWN|FLOOR|FLOOR.MATH|INT|MROUND','MAX|IF'],fill:col('E',3,6),hint:'ROUNDDOWN(…,-3) membulatkan ke ribuan ke bawah, MAX(0,…) mencegah nilai negatif.'},
  {target:'F2',text:'Isi <code>F2</code> dengan PPh 21 setahun memakai tarif progresif berlapis di tabel H8:I13. Salin ke bawah.',solution:'=SUMPRODUCT((E2>$H$9:$H$13)*(E2-$H$9:$H$13),$I$9:$I$13-VSTACK(0,DROP($I$9:$I$13,-1)))',use:['SUMPRODUCT|SUM|MIN|MAX|IF|IFS|LET|REDUCE'],fill:col('F',3,6),hint:'Per lapisan: (PKP − batas bawah, kalau positif) × kenaikan tarif dibanding lapisan sebelumnya. Bisa juga ditulis manual: MIN(PKP,60jt)×5% + MAX(0,MIN(PKP,250jt)−60jt)×15% + …'},
 ]},

];
}

CASES.push(...CASES_IND_A, ...CASES_IND_B, ...CASES_KHUSUS, ...CASES_SULIT);

export { CASES };
