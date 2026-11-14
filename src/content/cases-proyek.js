/* Jagoan Excel — proyek akhir terpandu: tiga studi kasus berurutan yang membangun satu laporan
   penjualan bulanan dari data mentah sampai ringkasan untuk atasan. Format sama dengan cases.js,
   ditambah proyek:true dan step (1–3). Hasilnya otomatis masuk ke portofolio. */
import { XL } from '../engine/engine.js';

/** @type {any[]} */ let CASES_PROYEK;
{
const D=XL.D;
const col=(c,a,b)=>{const o=[];for(let r=a;r<=b;r++)o.push(c+r);return o};
const put=(d,c0,r0,rows)=>{rows.forEach((row,i)=>row.forEach((v,j)=>{if(v!==null&&v!==undefined)d[XL.colName(XL.colIndex(c0)+j)+(r0+i)]=v}));return d};
const SCN='Kamu baru bergabung sebagai admin penjualan di CV Kemasan Prima, pemasok kardus dan plastik untuk toko online. Setiap awal bulan atasanmu minta laporan penjualan bulan lalu. Proyek ini terdiri dari tiga bagian yang dikerjakan berurutan, persis seperti alur kerja sungguhan.';

// 12 transaksi Oktober 2026 (dipakai di ketiga bagian)
const TX=[
 [D(2026,10,2),'Jakarta','Rina Wulandari','KRD-A4',40],[D(2026,10,3),'Bandung','Yusuf Hakim','PLS-RL',25],
 [D(2026,10,6),'Jakarta','Maya Lestari','BBW-50',12],[D(2026,10,8),'Surabaya','Hendra Saputra','KRD-A4',65],
 [D(2026,10,9),'Bandung','Yusuf Hakim','LKB-CK',80],[D(2026,10,13),'Medan','Dimas Pratama','LBL-ST',150],
 [D(2026,10,15),'Jakarta','Rina Wulandari','PLS-RL',30],[D(2026,10,17),'Surabaya','Sari Kusuma','BBW-50',20],
 [D(2026,10,20),'Medan','Dimas Pratama','KRD-A4',35],[D(2026,10,22),'Jakarta','Maya Lestari','LKB-CK',120],
 [D(2026,10,27),'Bandung','Sari Kusuma','KRD-A4',55],[D(2026,10,30),'Surabaya','Hendra Saputra','PLS-RL',18],
];
const MASTER=[['KRD-A4','Kardus A4 isi 25',187500],['PLS-RL','Plastik roll 50 m',96000],['BBW-50','Bubble wrap 50 m',142000],['LKB-CK','Lakban coklat isi 6',57000],['LBL-ST','Label stiker 100 lbr',23500]];
const price=k=>MASTER.find(m=>m[0]===k)[2];
const bruto=TX.map(t=>t[4]*price(t[3]));
const neto=bruto.map(b=>b>=5000000?b*0.95:b);
// versi berantakan (bagian 1): spasi lebih, huruf besar-kecil acak, qty tersimpan sebagai teks
const messy=[['  jakarta','rina wulandari ','krd-a4','40 pcs'],['BANDUNG','YUSUF  HAKIM','pls-rl ','25pcs'],['Jakarta ','maya lestari',' BBW-50','12 PCS'],['surabaya','Hendra saputra','krd-A4','65 pcs '],
 [' bandung','yusuf hakim','LKB-ck','80  pcs'],['MEDAN ','DIMAS PRATAMA','lbl-st','150 Pcs'],['jakarta','Rina  Wulandari','PLS-RL ','30 pcs'],['Surabaya','sari kusuma','bbw-50','20pcs'],
 ['medan','dimas pratama ',' krd-a4','35 pcs'],['JAKARTA','Maya Lestari','lkb-CK','120 PCS '],['Bandung ','SARI KUSUMA','KRD-A4','55 pcs'],['surabaya ','hendra  saputra','pls-rl','18pcs']];

CASES_PROYEK=[
{id:'kasus-proyek-1-bersih',proyek:true,step:1,free:true,ind:'Ritel & FMCG',div:'Admin Penjualan',title:'Proyek 1 dari 3: Merapikan data transaksi',
 scenario:SCN+' Bagian 1: data dari tim cabang diketik manual, jadi spasi dan huruf besar-kecilnya tidak seragam, dan kolom Qty ditulis bersama satuannya ("40 pcs") sehingga tidak bisa dijumlah. Rapikan dulu sebelum dihitung.',
 cols:13,rows:14,fmt:{A:'date'},bold:['G1','H1','I1','J1','L1'],
 data:put({A1:'Tanggal',B1:'Cabang',C1:'Sales',D1:'Kode',E1:'Qty',G1:'Cabang',H1:'Sales',I1:'Kode',J1:'Qty',L1:'Total unit'},'A',2,messy.map((m,i)=>[TX[i][0],...m])),
 tasks:[
  {target:'G2',text:'Isi <code>G2</code> dengan nama cabang yang rapi: tanpa spasi berlebih, huruf depan kapital (Jakarta). Salin sampai G13.',solution:'=PROPER(TRIM(B2))',use:['TRIM','PROPER'],fill:col('G',3,13),hint:'TRIM membuang spasi di awal, akhir, dan spasi ganda. PROPER membuat huruf depan tiap kata kapital.'},
  {target:'H2',text:'Isi <code>H2</code> dengan nama sales yang rapi, aturannya sama. Salin sampai H13.',solution:'=PROPER(TRIM(C2))',use:['TRIM','PROPER'],fill:col('H',3,13)},
  {target:'I2',text:'Isi <code>I2</code> dengan kode produk dalam huruf besar semua dan tanpa spasi (KRD-A4). Salin sampai I13.',solution:'=UPPER(TRIM(D2))',use:['TRIM','UPPER'],fill:col('I',3,13)},
  {target:'J2',text:'Isi <code>J2</code> dengan qty sebagai <b>angka</b>: buang tulisan "pcs" (huruf besar atau kecil) dan spasinya, lalu ubah jadi angka. Salin sampai J13.',solution:'=VALUE(TRIM(SUBSTITUTE(UPPER(E2),"PCS","")))',use:['SUBSTITUTE|LEFT|TEXTBEFORE','VALUE|NUMBERVALUE|--'],fill:col('J',3,13),hint:'Ubah dulu jadi huruf besar semua dengan UPPER supaya "pcs", "PCS", dan "Pcs" sama. SUBSTITUTE(…,"PCS","") membuang satuannya, TRIM membuang spasi, VALUE mengubahnya jadi angka.'},
  {target:'M1',text:'Isi <code>M1</code> dengan total unit terjual dari kolom J. Bandingkan dengan SUM(E2:E13): hasilnya 0 karena kolom E berisi teks.',solution:'=SUM(J2:J13)',use:['SUM']},
 ]},

{id:'kasus-proyek-2-hitung',proyek:true,step:2,ind:'Ritel & FMCG',div:'Admin Penjualan',title:'Proyek 2 dari 3: Harga, diskon, dan nilai bersih',
 scenario:SCN+' Bagian 2: data sudah rapi. Sekarang lengkapi harga dari daftar harga resmi, hitung nilai kotor, beri diskon 5% untuk transaksi minimal Rp5.000.000, lalu hitung nilai bersihnya.',
 cols:13,rows:14,fmt:{A:'date'},bold:['K1','L1','M1','K8'],
 data:put(put({A1:'Tanggal',B1:'Cabang',C1:'Sales',D1:'Kode',E1:'Qty',F1:'Harga',G1:'Bruto',H1:'Diskon',I1:'Neto',K1:'Kode',L1:'Produk',M1:'Harga',K8:'Total neto',K9:'Batas diskon',L9:5000000,K10:'Persen diskon',L10:0.05},'A',2,TX),'K',2,MASTER),
 tasks:[
  {target:'F2',text:'Isi <code>F2</code> dengan harga produk dari daftar harga K2:M6, berdasarkan kode di D2. Salin sampai F13.',solution:'=XLOOKUP(D2,$K$2:$K$6,$M$2:$M$6)',use:['XLOOKUP|VLOOKUP|INDEX'],abs:'\\$K\\$2',absMsg:'Kunci daftar harga supaya tidak bergeser saat disalin.',fill:col('F',3,13)},
  {target:'G2',text:'Isi <code>G2</code> dengan nilai bruto: qty × harga. Salin sampai G13.',solution:'=E2*F2',fill:col('G',3,13)},
  {target:'H2',text:'Isi <code>H2</code> dengan diskon: 5% dari bruto kalau bruto minimal batas di L9, selain itu 0. Pakai sel L9 dan L10, jangan ketik angkanya langsung. Salin sampai H13.',solution:'=IF(G2>=$L$9,G2*$L$10,0)',use:['IF'],abs:'\\$L\\$9',absMsg:'Kunci L9 dan L10.',fill:col('H',3,13),hint:'Kalau suatu hari batas atau persennya berubah, cukup ganti L9 atau L10.'},
  {target:'I2',text:'Isi <code>I2</code> dengan nilai neto: bruto dikurangi diskon. Salin sampai I13.',solution:'=G2-H2',fill:col('I',3,13)},
  {target:'L8',text:'Isi <code>L8</code> dengan total neto seluruh transaksi.',solution:'=SUM(I2:I13)',use:['SUM']},
 ]},

{id:'kasus-proyek-3-ringkas',proyek:true,step:3,ind:'Ritel & FMCG',div:'Admin Penjualan',title:'Proyek 3 dari 3: Ringkasan untuk atasan',
 scenario:SCN+' Bagian 3: atasanmu tidak mau membaca 12 baris transaksi. Dia ingin tahu realisasi tiap cabang dibanding target, cabang mana yang belum tercapai, dan transaksi terbesar bulan ini.',
 cols:12,rows:13,fmt:{A:'date',K:'pct',I10:'pct'},bold:['H1','I1','J1','K1','H8','H9','H10'],
 data:put(put({A1:'Tanggal',B1:'Cabang',C1:'Sales',D1:'Kode',E1:'Qty',F1:'Neto',H1:'Cabang',I1:'Target',J1:'Realisasi',K1:'Capaian',H8:'Cabang di bawah target',H9:'Transaksi terbesar oleh',H10:'Capaian total'},'A',2,TX.map((t,i)=>[...t,neto[i]])),
  'H',2,[['Jakarta',14000000],['Bandung',17500000],['Surabaya',18000000],['Medan',8000000]]),
 tasks:[
  {target:'J2',text:'Isi <code>J2</code> dengan realisasi neto cabang di H2 dari data transaksi. Salin sampai J5.',solution:'=SUMIFS($F$2:$F$13,$B$2:$B$13,H2)',use:['SUMIFS|SUMIF'],abs:'\\$F\\$2:\\$F\\$13',absMsg:'Kunci rentang data transaksi.',fill:col('J',3,5)},
  {target:'K2',text:'Isi <code>K2</code> dengan capaian: realisasi ÷ target. Salin sampai K5.',solution:'=J2/I2',fill:col('K',3,5)},
  {target:'I8',text:'Isi <code>I8</code> dengan jumlah cabang yang capaiannya di bawah 100%.',solution:'=COUNTIF(K2:K5,"<1")',use:['COUNTIF|COUNTIFS|SUM']},
  {target:'I9',text:'Isi <code>I9</code> dengan nama sales pada transaksi dengan neto terbesar.',solution:'=INDEX(C2:C13,MATCH(MAX(F2:F13),F2:F13,0))',use:['INDEX|XLOOKUP|FILTER|SORTBY|TAKE','MAX|SORT|LARGE|SORTBY']},
  {target:'I10',text:'Isi <code>I10</code> dengan capaian total semua cabang: total realisasi ÷ total target.',solution:'=SUM(J2:J5)/SUM(I2:I5)',use:['SUM']},
 ]},
];
void bruto;
}
export { CASES_PROYEK };
