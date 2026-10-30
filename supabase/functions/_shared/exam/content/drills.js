// @ts-nocheck
// DISALIN OTOMATIS oleh scripts/sync-exam.mjs dari src/. Jangan diedit di sini.
/* Jagoan Excel — bank soal praktik: pola soal × data acak berbenih = ribuan soal unik.
   Nomor soal yang sama selalu menghasilkan data yang sama. */
import { XL } from '../engine/engine.js';

/** @type {any[]} */ let T_ALL;
/** @type {any} */ let _DR;
/** @type {any} */ let DRILL;
/** @type {any} */ let DRILL_KIT;
{
const C=j=>XL.colName(j),D=XL.D;
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function hash(s){let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function R(seed){const f=rng(seed);const r={
  f,int:(a,b)=>a+Math.floor(f()*(b-a+1)),
  pick:a=>a[Math.floor(f()*a.length)],
  money:(a,b,step)=>{step=step||1000;return Math.round((a+f()*(b-a))/step)*step},
  sample:(a,k)=>{const c=a.slice();for(let i=c.length-1;i>0;i--){const j=Math.floor(f()*(i+1));[c[i],c[j]]=[c[j],c[i]]}return c.slice(0,k)},
  chance:p=>f()<p};return r}
const NAMES=['Andi','Budi','Citra','Dewi','Eko','Fajar','Gita','Hana','Irfan','Joko','Kartika','Lukman','Maya','Nadia','Oki','Putri','Rina','Sari','Teguh','Umar','Vina','Wulan','Yusuf','Zahra','Agus','Bella','Dimas','Farah','Hendra','Lestari','Rizky','Sinta','Bayu','Galih','Indah','Raka'];
const LAST=['Saputra','Wulandari','Pratama','Santoso','Lestari','Hidayat','Kusuma','Rahman','Siregar','Nugroho','Wijaya','Halim','Gunawan','Permata'];
const CITY=[['Jakarta','JKT'],['Bandung','BDG'],['Surabaya','SBY'],['Medan','MDN'],['Semarang','SMG'],['Makassar','MKS'],['Denpasar','DPS'],['Palembang','PLG'],['Yogyakarta','YOG'],['Balikpapan','BPN']];
const PROD=['Kopi bubuk','Teh celup','Gula 1 kg','Beras 5 kg','Minyak 2 L','Susu UHT','Mi instan','Kecap manis','Sabun cair','Tisu','Air mineral','Biskuit','Kertas A4','Pulpen','Map plastik','Tinta printer'];
const CAT=['Makanan','Transport','ATK','Hiburan','Listrik','Konsumsi rapat','Perjalanan dinas'];
const DIV=['Keuangan','HRD','Gudang','Pemasaran','TI','Penjualan','Pengadaan'];
const MON=['Jan','Feb','Mar','Apr','Mei','Jun'];
const DOM=['majujaya.co.id','sinarlogistik.com','arunika.id','deltapangan.co.id','bintangtimur.com'];
const tbl=(heads,rows)=>{const d={};heads.forEach((h,j)=>d[C(j)+1]=h);rows.forEach((row,i)=>row.forEach((v,j)=>{if(v!==null&&v!==undefined&&v!=='')d[C(j)+(i+2)]=v}));return d};
const col=(c,a,b)=>{const o=[];for(let r=a;r<=b;r++)o.push(c+r);return o};
const rpx=n=>'Rp'+n.toLocaleString('id-ID');
const idd=s=>XL.fromSerial(s),tgl=s=>{const p=idd(s);return p.d+' '+XL.BULAN[p.m-1]+' '+p.y};
const people=(r,n)=>r.sample(NAMES,n);
const cityList=(r,k)=>r.sample(CITY,k).map(c=>c[0]);

/* T(key, level, topic, title, gen) — gen(r) returns the problem */
const T=[];const add=(key,level,topic,title,gen)=>T.push({key,level,topic,title,gen});

/* =============== DASAR =============== */
add('sum','Dasar','Hitung dasar','Total satu kolom',r=>{const n=r.int(5,9),ps=r.sample(PROD,n);const rows=ps.map(p=>[p,r.money(150000,2500000,5000)]);
  return{data:Object.assign(tbl(['Produk','Penjualan'],rows),{D2:'Total penjualan'}),cols:5,rows:n+1,target:'E2',solution:`=SUM(B2:B${n+1})`,use:['SUM'],bold:['D2'],
  text:`Isi <code>E2</code> dengan total penjualan semua produk.`,hint:`Rentangnya B2 sampai B${n+1}.`}});
add('avg','Dasar','Hitung dasar','Rata-rata',r=>{const n=r.int(6,10),ns=people(r,n);const rows=ns.map(p=>[p,r.int(48,99)]);
  return{data:Object.assign(tbl(['Siswa','Nilai'],rows),{D2:'Rata-rata'}),cols:5,rows:n+1,target:'E2',solution:`=AVERAGE(B2:B${n+1})`,use:['AVERAGE'],bold:['D2'],
  text:`Isi <code>E2</code> dengan rata-rata nilai.`}});
add('maxmin','Dasar','Hitung dasar','Nilai terbesar atau terkecil',r=>{const n=r.int(6,10),cs=cityList(r,n);const mx=r.chance(.5);const rows=cs.map(c=>[c,r.money(8000000,95000000,250000)]);
  return{data:Object.assign(tbl(['Cabang','Biaya operasional'],rows),{D2:mx?'Biaya tertinggi':'Biaya terendah'}),cols:5,rows:n+1,target:'E2',solution:`=${mx?'MAX':'MIN'}(B2:B${n+1})`,use:[mx?'MAX|LARGE':'MIN|SMALL'],bold:['D2'],
  text:`Isi <code>E2</code> dengan biaya operasional ${mx?'tertinggi':'terendah'}.`}});
add('count','Dasar','Hitung dasar','Menghitung data',r=>{const n=r.int(6,10),ns=people(r,n);let rows=ns.map(p=>[p,r.chance(.6)?r.pick([150000,250000,350000]):null]);rows[0][1]=rows[0][1]||250000;rows[n-1][1]=null;
  const blank=r.chance(.5);
  return{data:Object.assign(tbl(['Peserta','Bayar'],rows),{D2:blank?'Belum bayar':'Sudah bayar'}),cols:5,rows:n+1,target:'E2',solution:blank?`=COUNTBLANK(B2:B${n+1})`:`=COUNT(B2:B${n+1})`,use:[blank?'COUNTBLANK|COUNTIF':'COUNT|COUNTA'],bold:['D2'],
  text:`Sel kosong di kolom B berarti peserta belum membayar. Isi <code>E2</code> dengan jumlah peserta yang ${blank?'<b>belum</b>':'<b>sudah</b>'} membayar.`,hint:blank?'COUNTBLANK menghitung sel kosong.':'COUNT hanya menghitung sel berisi angka.'}});
add('kali','Dasar','Hitung dasar','Kali qty dengan harga',r=>{const n=r.int(4,7),ps=r.sample(PROD,n);const rows=ps.map(p=>[p,r.int(2,60),r.money(3000,90000,500)]);const t=r.int(2,n+1);
  return{data:tbl(['Produk','Qty','Harga','Total'],rows),cols:4,rows:n+1,target:'D'+t,solution:`=B${t}*C${t}`,
  text:`Isi <code>D${t}</code> dengan total untuk <b>${rows[t-2][0]}</b>: qty dikali harga.`}});
add('diskon','Dasar','Persentase & selisih','Harga setelah diskon',r=>{const h=r.money(80000,2500000,5000),d=r.pick([.05,.1,.15,.2,.25,.3]),o=r.pick([0,10000,15000,20000,25000]);const withO=o>0;
  return{data:{A1:'Harga',B1:h,A2:'Diskon',B2:d,A3:'Ongkos kirim',B3:o,A4:withO?'Harga akhir':'Harga setelah diskon'},fmt:{B2:'pct'},cols:3,rows:5,target:'B4',bold:['A4'],
  solution:withO?'=B1*(1-B2)+B3':'=B1*(1-B2)',text:withO?`Isi <code>B4</code> dengan harga setelah diskon, lalu ditambah ongkos kirim.`:`Isi <code>B4</code> dengan harga setelah diskon. Ongkos kirim tidak dihitung.`,hint:'Harga dikali (1 − diskon). Pakai kurung.'}});
add('capai','Dasar','Persentase & selisih','Persentase pencapaian',r=>{const n=r.int(4,7),ns=people(r,n);const rows=ns.map(p=>{const tg=r.money(50e6,200e6,5e6);return[p,tg,Math.round(tg*(0.6+r.f()*0.7)/1e5)*1e5]});const t=r.int(2,n+1);
  return{data:tbl(['Sales','Target','Realisasi','Pencapaian'],rows),fmt:{D:'pct'},cols:4,rows:n+1,target:'D'+t,solution:`=C${t}/B${t}`,
  text:`Isi <code>D${t}</code> dengan persentase pencapaian <b>${rows[t-2][0]}</b>: realisasi dibagi target.`}});
add('selisih','Dasar','Persentase & selisih','Sisa anggaran',r=>{const n=r.int(4,7),cs=r.sample(CAT,n);const rows=cs.map(c=>{const a=r.money(1e6,20e6,250000);return[c,a,Math.round(a*(0.5+r.f()*0.7)/5e4)*5e4]});const t=r.int(2,n+1);const pct=r.chance(.4);
  return{data:tbl(['Pos','Anggaran','Realisasi',pct?'Sisa (%)':'Sisa'],rows),fmt:pct?{D:'pct'}:undefined,cols:4,rows:n+1,target:'D'+t,solution:pct?`=(B${t}-C${t})/B${t}`:`=B${t}-C${t}`,
  text:pct?`Isi <code>D${t}</code> dengan sisa anggaran <b>${rows[t-2][0]}</b> dalam persen dari anggaran.`:`Isi <code>D${t}</code> dengan sisa anggaran <b>${rows[t-2][0]}</b>. Hasil negatif berarti melebihi anggaran.`}});
add('bulat','Dasar','Hitung dasar','Membulatkan',r=>{const v=Math.round((r.f()*9e6+1e5)*1000)/1000+0.4567;const mode=r.pick([['ROUND',0,'rupiah penuh'],['ROUND',-2,'ratusan terdekat'],['ROUND',-3,'ribuan terdekat'],['ROUNDUP',-3,'ribuan, selalu ke atas'],['ROUNDDOWN',-3,'ribuan, selalu ke bawah']]);
  return{data:{A1:'Nilai',B1:v,A2:'Dibulatkan'},cols:3,rows:3,target:'B2',solution:`=${mode[0]}(B1,${mode[1]})`,use:[mode[0]],bold:['A2'],
  text:`Isi <code>B2</code> dengan nilai B1 dibulatkan ke <b>${mode[2]}</b>.`,hint:'Digit 0 = tanpa desimal, -2 = ratusan, -3 = ribuan.'}});
add('kunci','Dasar','Referensi','Kunci sel dengan $',r=>{const n=r.int(4,6),ns=people(r,n);const rate=r.pick([.02,.025,.03,.04,.05]);const rows=ns.map(p=>[p,r.money(20e6,150e6,1e6)]);
  return{data:Object.assign(tbl(['Sales','Penjualan','Komisi'],rows),{E1:'Tarif komisi',F1:rate}),fmt:{F1:'pct'},cols:6,rows:n+1,target:'C2',solution:'=B2*$F$1',fill:col('C',3,n+1),abs:'\\$F\\$1',absMsg:'Tarif di F1 perlu dikunci dengan $ (tekan F4) supaya tidak bergeser saat disalin.',bold:['E1'],
  text:`Isi <code>C2</code> dengan komisi (penjualan × tarif di F1) dan kunci F1. Tekan Salin ke bawah untuk memeriksa baris lain.`}});
add('gabung','Dasar','Teks','Menggabung nama',r=>{const n=r.int(3,5);const rows=Array.from({length:n},()=>[r.pick(NAMES),r.pick(LAST)]);const t=r.int(2,n+1);const sep=r.pick([[' ','spasi'],[', ','koma dan spasi']]);const rev=sep[0]===', ';
  return{data:tbl(['Nama depan','Nama belakang','Gabungan'],rows),cols:3,rows:n+1,target:'C'+t,solution:rev?`=B${t}&", "&A${t}`:`=A${t}&" "&B${t}`,use:['&|CONCAT|CONCATENATE|TEXTJOIN'],cs:true,
  text:rev?`Isi <code>C${t}</code> dengan format <b>NamaBelakang, NamaDepan</b>, misalnya "${rows[t-2][1]}, ${rows[t-2][0]}".`:`Isi <code>C${t}</code> dengan nama lengkap: nama depan, spasi, nama belakang.`}});
add('rapi','Dasar','Teks','Merapikan teks',r=>{const n=r.int(3,5);const mess=s=>s.split('').map(ch=>r.chance(.5)?ch.toUpperCase():ch.toLowerCase()).join('');const rows=Array.from({length:n},()=>['  '+mess(r.pick(NAMES))+'   '+mess(r.pick(LAST))+' ']);const t=r.int(2,n+1);
  const up=r.chance(.3);
  return{data:tbl(['Data mentah','Rapi'],rows),cols:2,rows:n+1,target:'B'+t,solution:up?`=UPPER(TRIM(A${t}))`:`=PROPER(TRIM(A${t}))`,use:[up?'UPPER':'PROPER','TRIM'],cs:true,
  text:up?`Isi <code>B${t}</code> dengan nama tanpa spasi berlebih, semuanya huruf kapital.`:`Isi <code>B${t}</code> dengan nama tanpa spasi berlebih dan huruf kapital di awal setiap kata.`}});
add('kode','Dasar','Teks','Mengambil bagian kode',r=>{const n=r.int(3,6);const rows=Array.from({length:n},()=>{const c=r.pick(CITY)[1];return[c+'-'+String(r.int(1,9999)).padStart(4,'0')]});const t=r.int(2,n+1);const left=r.chance(.5);
  return{data:tbl(['Kode transaksi',left?'Kode cabang':'Nomor urut'],rows),cols:2,rows:n+1,target:'B'+t,solution:left?`=LEFT(A${t},3)`:`=RIGHT(A${t},4)`,use:[left?'LEFT':'RIGHT|MID'],
  text:`Kode berpola <b>CAB-NNNN</b>. Isi <code>B${t}</code> dengan ${left?'3 huruf kode cabang':'4 digit nomor urut'}.`}});
add('lulus','Dasar','Logika','Lulus atau remedial',r=>{const n=r.int(4,7),ns=people(r,n),kkm=r.pick([65,70,72,75,78,80]);const rows=ns.map(p=>[p,r.int(50,98)]);const t=r.int(2,n+1);rows[t-2][1]=r.pick([kkm,kkm-1,kkm+3,kkm-5]);
  return{data:Object.assign(tbl(['Siswa','Nilai','Status'],rows),{E1:'KKM',F1:kkm}),cols:6,rows:n+1,target:'C'+t,solution:`=IF(B${t}>=$F$1,"Lulus","Remedial")`,use:['IF'],bold:['E1'],
  text:`Isi <code>C${t}</code> dengan <b>Lulus</b> kalau nilai minimal sama dengan KKM di F1, selain itu <b>Remedial</b>.`,hint:'Nilai yang sama persis dengan KKM tetap lulus, jadi pakai >=.'}});
add('tempo','Dasar','Tanggal','Tanggal jatuh tempo',r=>{const n=r.int(3,6),hari=r.pick([7,14,30,45,60]);const rows=Array.from({length:n},(_, i)=>['INV-'+String(r.int(100,999)),D(2026,r.int(1,11),r.int(1,28))]);const t=r.int(2,n+1);
  return{data:tbl(['Faktur','Tanggal','Jatuh tempo'],rows),fmt:{B:'date',C:'date'},cols:3,rows:n+1,target:'C'+t,solution:`=B${t}+${hari}`,
  text:`Termin pembayarannya <b>${hari} hari</b>. Isi <code>C${t}</code> dengan tanggal jatuh tempo faktur ${rows[t-2][0]}.`}});
add('bagian-tgl','Dasar','Tanggal','Mengambil tahun, bulan, atau hari',r=>{const n=r.int(3,6);const rows=Array.from({length:n},()=>[r.pick(NAMES),D(r.int(2018,2026),r.int(1,12),r.int(1,28))]);const t=r.int(2,n+1);const m=r.pick([['YEAR','tahun'],['MONTH','bulan (angka 1–12)'],['DAY','tanggal (1–31)']]);
  return{data:tbl(['Nama','Tanggal masuk','Hasil'],rows),fmt:{B:'date'},cols:3,rows:n+1,target:'C'+t,solution:`=${m[0]}(B${t})`,use:[m[0]],
  text:`Isi <code>C${t}</code> dengan ${m[1]} dari tanggal masuk ${rows[t-2][0]}.`}});

/* =============== MENENGAH =============== */
const catRows=(r,n,cats)=>Array.from({length:n},()=>[r.pick(cats),r.money(15000,500000,500)]);
add('sumif','Menengah','Bersyarat','Jumlah dengan satu syarat',r=>{const n=r.int(7,11),cats=r.sample(CAT,4);const rows=catRows(r,n,cats);const k=r.pick(rows)[0];
  return{data:Object.assign(tbl(['Kategori','Jumlah'],rows),{D1:'Kategori',E1:k,D2:'Total'}),cols:5,rows:n+1,target:'E2',solution:`=SUMIF(A2:A${n+1},E1,B2:B${n+1})`,use:['SUMIF|SUMIFS|SUMPRODUCT'],bold:['D1','D2'],
  text:`Isi <code>E2</code> dengan total pengeluaran kategori <b>${k}</b> (tertulis di E1).`}});
add('countif','Menengah','Bersyarat','Hitung dengan satu syarat',r=>{const n=r.int(7,11),st=['Selesai','Proses','Tertunda'];const rows=Array.from({length:n},()=>['TK-'+r.int(100,999),r.pick(st)]);const k=r.pick(rows)[1];
  return{data:Object.assign(tbl(['Tiket','Status'],rows),{D2:'Jumlah '+k}),cols:5,rows:n+1,target:'E2',solution:`=COUNTIF(B2:B${n+1},"${k}")`,use:['COUNTIF|COUNTIFS'],bold:['D2'],
  text:`Isi <code>E2</code> dengan jumlah tiket berstatus <b>${k}</b>.`}});
add('countif-angka','Menengah','Bersyarat','Hitung nilai di atas batas',r=>{const n=r.int(7,11),ns=people(r,n),b=r.pick([60,70,75,80,85]);const rows=ns.map(p=>[p,r.int(45,100)]);const op=r.pick([['>=','minimal'],['<','di bawah']]);
  return{data:Object.assign(tbl(['Peserta','Skor'],rows),{D1:'Batas',E1:b,D2:'Jumlah'}),cols:5,rows:n+1,target:'E2',solution:`=COUNTIF(B2:B${n+1},"${op[0]}"&E1)`,use:['COUNTIF|COUNTIFS'],bold:['D1','D2'],
  text:`Isi <code>E2</code> dengan jumlah peserta yang skornya <b>${op[1]} ${b}</b>.`,hint:`Kriteria perbandingan ditulis sebagai teks, misalnya "${op[0]}${b}" atau "${op[0]}"&E1.`}});
add('avgif','Menengah','Bersyarat','Rata-rata bersyarat',r=>{const n=r.int(7,11),cs=cityList(r,3);const rows=Array.from({length:n},()=>[r.pick(NAMES),r.pick(cs),r.int(20,95)]);const k=r.pick(rows)[1];
  return{data:Object.assign(tbl(['Sales','Kota','Unit'],rows),{E1:'Kota',F1:k,E2:'Rata-rata unit'}),cols:6,rows:n+1,target:'F2',solution:`=AVERAGEIF(B2:B${n+1},F1,C2:C${n+1})`,use:['AVERAGEIF|AVERAGEIFS'],bold:['E1','E2'],
  text:`Isi <code>F2</code> dengan rata-rata unit terjual oleh sales di kota <b>${k}</b>.`}});
add('sumifs','Menengah','Bersyarat','Jumlah dengan dua syarat',r=>{const n=r.int(8,12),cs=cityList(r,3),ms=r.sample(MON,2);const rows=Array.from({length:n},()=>[r.pick(cs),r.pick(ms),r.money(1e6,25e6,100000)]);const pick=r.pick(rows);
  return{data:Object.assign(tbl(['Kota','Bulan','Penjualan'],rows),{E1:'Kota',F1:pick[0],E2:'Bulan',F2:pick[1],E3:'Total'}),cols:6,rows:n+1,target:'F3',solution:`=SUMIFS(C2:C${n+1},A2:A${n+1},F1,B2:B${n+1},F2)`,use:['SUMIFS|SUMPRODUCT'],bold:['E1','E2','E3'],
  text:`Isi <code>F3</code> dengan total penjualan kota <b>${pick[0]}</b> pada bulan <b>${pick[1]}</b>.`,hint:'Di SUMIFS, rentang yang dijumlahkan ditulis paling depan.'}});
add('countifs','Menengah','Bersyarat','Hitung dengan dua syarat',r=>{const n=r.int(8,12),ds=r.sample(DIV,3),st=['Hadir','Izin','Sakit'];const rows=Array.from({length:n},()=>[r.pick(NAMES),r.pick(ds),r.pick(st)]);const p=r.pick(rows);
  return{data:Object.assign(tbl(['Nama','Divisi','Status'],rows),{E1:'Divisi',F1:p[1],E2:'Status',F2:p[2],E3:'Jumlah'}),cols:6,rows:n+1,target:'F3',solution:`=COUNTIFS(B2:B${n+1},F1,C2:C${n+1},F2)`,use:['COUNTIFS|SUMPRODUCT'],bold:['E1','E2','E3'],
  text:`Isi <code>F3</code> dengan jumlah karyawan divisi <b>${p[1]}</b> yang berstatus <b>${p[2]}</b>.`}});
add('maxifs','Menengah','Bersyarat','Tertinggi atau terendah bersyarat',r=>{const n=r.int(7,11),cs=cityList(r,3);const rows=Array.from({length:n},()=>[r.pick(NAMES),r.pick(cs),r.int(15,99)]);const k=r.pick(rows)[1];const mx=r.chance(.5);
  return{data:Object.assign(tbl(['Sales','Cabang','Unit'],rows),{E1:'Cabang',F1:k,E2:mx?'Tertinggi':'Terendah'}),cols:6,rows:n+1,target:'F2',solution:`=${mx?'MAXIFS':'MINIFS'}(C2:C${n+1},B2:B${n+1},F1)`,use:[mx?'MAXIFS':'MINIFS'],bold:['E1','E2'],
  text:`Isi <code>F2</code> dengan unit ${mx?'tertinggi':'terendah'} di cabang <b>${k}</b>.`}});
add('vlookup','Menengah','Pencarian','VLOOKUP persis',r=>{const n=r.int(5,8),ps=r.sample(PROD,n);const rows=ps.map((p,i)=>['P'+String(i+1).padStart(2,'0'),p,r.money(3000,95000,500)]);const k=r.pick(rows);const want=r.chance(.5);
  return{data:Object.assign(tbl(['Kode','Produk','Harga'],rows),{E1:'Kode',F1:k[0],E2:want?'Harga':'Nama produk'}),cols:6,rows:n+1,target:'F2',solution:`=VLOOKUP(F1,A2:C${n+1},${want?3:2},FALSE)`,use:['VLOOKUP|XLOOKUP|INDEX|LOOKUP'],bold:['E1','E2'],
  text:`Isi <code>F2</code> dengan ${want?'harga':'nama produk'} untuk kode di F1.`,hint:`${want?'Harga ada di kolom ke-3':'Nama produk ada di kolom ke-2'} tabel. Jangan lupa FALSE.`}});
add('xlookup-kiri','Menengah','Pencarian','Mencari ke kiri',r=>{const n=r.int(5,8),ns=people(r,n);const rows=ns.map((p,i)=>['K-'+(100+i+r.int(0,3)*10),p,r.pick(DIV)]);const k=r.pick(rows);
  return{data:Object.assign(tbl(['NIK','Nama','Divisi'],rows),{E1:'Nama',F1:k[1],E2:'NIK'}),cols:6,rows:n+1,target:'F2',solution:`=INDEX(A2:A${n+1},MATCH(F1,B2:B${n+1},0))`,use:['XLOOKUP|INDEX'],bold:['E1','E2'],
  text:`Isi <code>F2</code> dengan NIK karyawan bernama <b>${k[1]}</b>. NIK ada di sebelah kiri nama, jadi VLOOKUP tidak bisa dipakai.`,hint:'Pakai XLOOKUP, atau INDEX + MATCH.'}});
add('grade','Menengah','Logika','Predikat bertingkat',r=>{const n=r.int(4,7),ns=people(r,n);const a=r.pick([85,88,90]),b=r.pick([70,75,78]),c=r.pick([55,60]);const rows=ns.map(p=>[p,r.int(40,100)]);const t=r.int(2,n+1);
  return{data:Object.assign(tbl(['Nama','Skor','Predikat'],rows),{E1:'Min',F1:'Predikat',E2:a,F2:'A',E3:b,F3:'B',E4:c,F4:'C',E5:0,F5:'D'}),cols:6,rows:n+1>5?n+1:5,target:'C'+t,solution:`=IF(B${t}>=${a},"A",IF(B${t}>=${b},"B",IF(B${t}>=${c},"C","D")))`,use:['IF|IFS|VLOOKUP|XLOOKUP|LOOKUP'],bold:['E1','F1'],
  text:`Isi <code>C${t}</code> dengan predikat ${rows[t-2][0]} sesuai tabel batas minimal di kolom E–F.`}});
add('and','Menengah','Logika','Dua syarat sekaligus (AND)',r=>{const n=r.int(4,6),ns=people(r,n),h=r.pick([18,20,22]);const rows=ns.map(p=>{const tg=r.int(30,60);return[p,tg,tg+r.int(-10,15),r.int(15,24)]});const t=r.int(2,n+1);
  return{data:Object.assign(tbl(['Sales','Target','Realisasi','Hadir','Bonus'],rows),{G1:'Min. hadir',H1:h}),cols:8,rows:n+1,target:'E'+t,solution:`=IF(AND(C${t}>=B${t},D${t}>=$H$1),"Dapat","Tidak")`,use:['AND|IFS'],bold:['G1'],
  text:`Bonus diberikan kalau realisasi mencapai target <b>dan</b> kehadiran minimal ${h} hari (H1). Isi <code>E${t}</code> dengan <b>Dapat</b> atau <b>Tidak</b>.`}});
add('or','Menengah','Logika','Salah satu syarat (OR)',r=>{const n=r.int(4,6),ns=people(r,n),bt=r.pick([500000,750000,1000000]);const rows=ns.map(p=>[p,r.pick(['Gold','Silver','Reguler']),r.money(100000,1500000,5000)]);const t=r.int(2,n+1);
  return{data:Object.assign(tbl(['Pelanggan','Member','Belanja','Diskon'],rows),{F1:'Min. belanja',G1:bt}),cols:7,rows:n+1,target:'D'+t,solution:`=IF(OR(B${t}="Gold",C${t}>=$G$1),10%,0)`,use:['OR'],fmt:{D:'pct'},bold:['F1'],
  text:`Diskon 10% diberikan kalau pelanggan member <b>Gold</b> <b>atau</b> belanja minimal ${rpx(bt)} (G1). Selain itu 0. Isi <code>D${t}</code>.`}});
add('iferror','Menengah','Logika','Menangani error',r=>{const n=r.int(4,6),ps=r.sample(PROD,n);const rows=ps.map(p=>[p,r.money(500000,5e6,10000),r.int(1,40)]);const t=r.int(2,n+1);rows[t-2][1]=0;rows[t-2][2]=0;const txt=r.chance(.5);
  return{data:tbl(['Produk','Pendapatan','Unit','Rata-rata'],rows),cols:4,rows:n+1,target:'D'+t,solution:txt?`=IFERROR(B${t}/C${t},"-")`:`=IFERROR(B${t}/C${t},0)`,use:['IFERROR|IF'],
  text:`Isi <code>D${t}</code> dengan pendapatan dibagi unit. Produk ini belum terjual, jadi tampilkan <b>${txt?'tanda "-"':'0'}</b> kalau terjadi error.`}});
add('masa-kerja','Menengah','Tanggal','Masa kerja',r=>{const n=r.int(3,6);const rows=Array.from({length:n},()=>[r.pick(NAMES),D(r.int(2008,2025),r.int(1,12),r.int(1,28))]);const t=r.int(2,n+1);const u=r.pick([['Y','tahun penuh'],['M','bulan penuh']]);const per=D(2026,12,31);
  return{data:Object.assign(tbl(['Nama','Tanggal masuk','Masa kerja'],rows),{E1:'Per tanggal',F1:per}),fmt:{B:'date',F1:'date'},cols:6,rows:n+1,target:'C'+t,solution:`=DATEDIF(B${t},$F$1,"${u[0]}")`,use:['DATEDIF|YEARFRAC|INT'],bold:['E1'],
  text:`Isi <code>C${t}</code> dengan masa kerja ${rows[t-2][0]} dalam <b>${u[1]}</b> sampai tanggal di F1.`}});
add('harikerja','Menengah','Tanggal','Hari kerja',r=>{const s=D(2026,r.int(1,11),r.int(1,20)),e=s+r.int(10,45);const lib=r.chance(.5)?[s+r.int(1,9)]:[];
  const data={A1:'Mulai',B1:s,A2:'Selesai',B2:e,A3:'Hari kerja'};if(lib.length){data.D1='Libur';data.D2=lib[0]}
  return{data,fmt:{B1:'date',B2:'date',D2:'date'},cols:4,rows:4,target:'B3',solution:lib.length?'=NETWORKDAYS(B1,B2,D2)':'=NETWORKDAYS(B1,B2)',use:['NETWORKDAYS'],bold:['A3','D1'],
  text:`Isi <code>B3</code> dengan jumlah hari kerja Senin–Jumat dari ${tgl(s)} sampai ${tgl(e)}${lib.length?', tidak termasuk tanggal libur di D2':''}.`}});
add('akhir-bulan','Menengah','Tanggal','Akhir bulan',r=>{const n=r.int(3,5),k=r.pick([0,1,2]);const rows=Array.from({length:n},()=>['PO-'+r.int(100,999),D(2026,r.int(1,11),r.int(1,28))]);const t=r.int(2,n+1);
  return{data:tbl(['PO','Tanggal','Jatuh tempo'],rows),fmt:{B:'date',C:'date'},cols:3,rows:n+1,target:'C'+t,solution:`=EOMONTH(B${t},${k})`,use:['EOMONTH'],
  text:`Termin pembayarannya <b>akhir bulan ${k===0?'yang sama':k===1?'berikutnya':'kedua setelahnya'}</b>. Isi <code>C${t}</code>.`}});
add('rank','Menengah','Statistik','Peringkat',r=>{const n=r.int(5,9),ns=people(r,n);const vs=r.sample(Array.from({length:60},(_,i)=>30+i),n);const rows=ns.map((p,i)=>[p,vs[i]]);const t=r.int(2,n+1);
  return{data:tbl(['Sales','Unit','Peringkat'],rows),cols:3,rows:n+1,target:'C'+t,solution:`=RANK(B${t},B2:B${n+1})`,use:['RANK|RANK.EQ|COUNTIF'],
  text:`Isi <code>C${t}</code> dengan peringkat ${rows[t-2][0]}. Unit terbanyak = peringkat 1.`}});
add('large','Menengah','Statistik','Nilai ke-N',r=>{const n=r.int(6,10),cs=cityList(r,n);const rows=cs.map(c=>[c,r.int(150,900)]);const k=r.int(2,3);const big=r.chance(.6);
  return{data:Object.assign(tbl(['Cabang','Omzet (juta)'],rows),{D2:`${big?'Terbesar':'Terkecil'} ke-${k}`}),cols:5,rows:n+1,target:'E2',solution:`=${big?'LARGE':'SMALL'}(B2:B${n+1},${k})`,use:[big?'LARGE':'SMALL'],bold:['D2'],
  text:`Isi <code>E2</code> dengan omzet <b>${big?'terbesar':'terkecil'} ke-${k}</b>.`}});
add('sumproduct','Menengah','Hitung dasar','Total tanpa kolom bantu',r=>{const n=r.int(4,8),ps=r.sample(PROD,n);const rows=ps.map(p=>[p,r.int(2,120),r.money(2500,60000,500)]);
  return{data:Object.assign(tbl(['Produk','Qty','Harga'],rows),{E2:'Total nilai'}),cols:6,rows:n+1,target:'F2',solution:`=SUMPRODUCT(B2:B${n+1},C2:C${n+1})`,use:['SUMPRODUCT'],bold:['E2'],
  text:`Isi <code>F2</code> dengan total nilai penjualan (qty × harga untuk semua baris) dalam satu rumus.`}});
add('mid','Menengah','Teks','Memotong teks di tengah',r=>{const n=r.int(3,5);const rows=Array.from({length:n},()=>{const y=r.int(2023,2026),m=r.int(1,12);return['INV/'+y+'/'+String(m).padStart(2,'0')+'/'+String(r.int(1,999)).padStart(4,'0')]});const t=r.int(2,n+1);const part=r.pick([['tahun',5,4],['bulan',10,2]]);
  return{data:tbl(['Nomor faktur',part[0][0].toUpperCase()+part[0].slice(1)],rows),cols:2,rows:n+1,target:'B'+t,solution:`=MID(A${t},${part[1]},${part[2]})`,use:['MID|TEXTAFTER|TEXTBEFORE|TEXTSPLIT'],
  text:`Nomor faktur berpola <b>INV/TAHUN/BULAN/URUT</b>. Isi <code>B${t}</code> dengan ${part[0]}nya (sebagai teks).`}});
add('email','Menengah','Teks','Memecah alamat email',r=>{const n=r.int(3,5);const rows=Array.from({length:n},()=>[(r.pick(NAMES)+(r.chance(.5)?'.'+r.pick(LAST).slice(0,1):'')).toLowerCase()+'@'+r.pick(DOM)]);const t=r.int(2,n+1);const dom=r.chance(.5);
  return{data:tbl(['Email',dom?'Domain':'Username'],rows),cols:2,rows:n+1,target:'B'+t,solution:dom?`=MID(A${t},FIND("@",A${t})+1,LEN(A${t}))`:`=LEFT(A${t},FIND("@",A${t})-1)`,use:['FIND|SEARCH|TEXTAFTER|TEXTBEFORE|TEXTSPLIT'],
  text:`Isi <code>B${t}</code> dengan ${dom?'domain (semua setelah tanda @)':'username (semua sebelum tanda @)'}.`}});
add('teks-rp','Menengah','Teks','Angka di dalam kalimat',r=>{const v=r.money(50000,95e6,500);const nm=r.pick(NAMES);
  return{data:{A1:'Pelanggan',B1:nm,A2:'Tagihan',B2:v,A3:'Kalimat'},cols:2,rows:4,target:'B3',solution:`="Tagihan "&B1&": Rp"&TEXT(B2,"#,##0")`,use:['TEXT'],cs:true,bold:['A3'],
  text:`Isi <code>B3</code> dengan kalimat persis: <b>Tagihan ${nm}: ${rpx(v)}</b>, diambil dari B1 dan B2.`,hint:'Gabungkan dengan & dan format angkanya dengan TEXT(B2,"#,##0").'}});
add('duplikat','Menengah','Bersyarat','Cek data ganda',r=>{const n=r.int(7,10);const pool=Array.from({length:5},()=>'INV-'+r.int(1000,9999));const rows=Array.from({length:n},()=>[r.pick(pool),r.money(500000,9e6,10000)]);const t=r.int(2,n+1);
  return{data:Object.assign(tbl(['No faktur','Nilai','Muncul'],rows)),cols:3,rows:n+1,target:'C'+t,solution:`=COUNTIF($A$2:$A$${n+1},A${t})`,use:['COUNTIF|COUNTIFS'],
  text:`Isi <code>C${t}</code> dengan berapa kali nomor faktur di A${t} muncul di seluruh kolom A.`}});
add('median','Menengah','Statistik','Median dan kuartil',r=>{const n=r.int(7,11),ns=people(r,n);const rows=ns.map(p=>[p,r.money(4200,12000,50)]);rows[r.int(0,n-1)][1]=r.money(30000,60000,500);const m=r.pick([['MEDIAN','median',''],['QUARTILE','kuartil 1',',1'],['QUARTILE','kuartil 3',',3']]);
  return{data:Object.assign(tbl(['Karyawan','Gaji (ribu)'],rows),{D2:m[1]}),cols:5,rows:n+1,target:'E2',solution:`=${m[0]}(B2:B${n+1}${m[2]})`,use:[m[0]+(m[0]==='QUARTILE'?'|QUARTILE.INC|PERCENTILE':'')],bold:['D2'],
  text:`Isi <code>E2</code> dengan <b>${m[1]}</b> gaji.`}});
add('porsi','Menengah','Referensi','Porsi dari total',r=>{const n=r.int(4,7),cs=cityList(r,n);const rows=cs.map(c=>[c,r.int(80,900)]);
  return{data:tbl(['Cabang','Omzet','Porsi'],rows),fmt:{C:'pct'},cols:3,rows:n+1,target:'C2',solution:`=B2/SUM($B$2:$B$${n+1})`,fill:col('C',3,n+1),abs:`\\$B\\$2:\\$B\\$${n+1}`,absMsg:`Rentang total B2:B${n+1} perlu dikunci dengan $ supaya tidak bergeser saat disalin.`,
  text:`Isi <code>C2</code> dengan porsi omzet ${rows[0][0]} terhadap total semua cabang. Kunci rentang totalnya, lalu Salin ke bawah.`}});

/* =============== MAHIR =============== */
add('filter','Advanced','Array dinamis','Menyaring dengan FILTER',r=>{const n=r.int(7,10),cs=cityList(r,3);const rows=Array.from({length:n},()=>[r.pick(NAMES),r.pick(cs),r.int(20,99)]);const k=r.pick(rows)[1];
  return{data:Object.assign(tbl(['Nama','Kota','Unit'],rows),{E1:'Kota:',F1:k,E2:'Nama',F2:'Kota',G2:'Unit'}),cols:7,rows:n+2,target:'E3',solution:`=FILTER(A2:C${n+1},B2:B${n+1}=F1)`,use:['FILTER'],bold:['E1','E2','F2','G2'],
  text:`Isi <code>E3</code> dengan semua baris sales dari kota <b>${k}</b> dalam satu rumus.`}});
add('sort','Advanced','Array dinamis','Mengurutkan dengan SORT',r=>{const n=r.int(5,8),ps=r.sample(PROD,n);const rows=ps.map(p=>[p,r.int(10,500)]);const desc=r.chance(.7);
  return{data:Object.assign(tbl(['Produk','Terjual'],rows),{D1:'Produk',E1:'Terjual'}),cols:5,rows:n+1,target:'D2',solution:`=SORT(A2:B${n+1},2,${desc?-1:1})`,use:['SORT|SORTBY'],bold:['D1','E1'],
  text:`Isi <code>D2</code> dengan tabel produk diurutkan berdasarkan jumlah terjual dari <b>${desc?'terbesar ke terkecil':'terkecil ke terbesar'}</b>.`}});
add('unik','Advanced','Array dinamis','Menghitung nilai unik',r=>{const n=r.int(8,12),pool=r.sample(NAMES,r.int(3,6));const rows=Array.from({length:n},()=>['TRX-'+r.int(100,999),r.pick(pool)]);
  return{data:Object.assign(tbl(['Transaksi','Pelanggan'],rows),{D2:'Pelanggan unik'}),cols:5,rows:n+1,target:'E2',solution:`=COUNTA(UNIQUE(B2:B${n+1}))`,use:['UNIQUE'],bold:['D2'],
  text:`Isi <code>E2</code> dengan jumlah pelanggan <b>berbeda</b> yang bertransaksi.`}});
add('top3','Advanced','Array dinamis','Tiga teratas',r=>{const n=r.int(6,9),ns=people(r,n);const vs=r.sample(Array.from({length:80},(_,i)=>20+i),n);const rows=ns.map((p,i)=>[p,vs[i]]);const k=r.pick([3,3,5].filter(x=>x<n));
  return{data:Object.assign(tbl(['Sales','Unit'],rows),{D1:'Sales',E1:'Unit'}),cols:5,rows:n+1,target:'D2',solution:`=TAKE(SORT(A2:B${n+1},2,-1),${k})`,use:['SORT|SORTBY'],bold:['D1','E1'],
  text:`Isi <code>D2</code> dengan <b>${k} sales teratas</b> beserta unitnya, dari yang terbesar.`,hint:'Urutkan dulu dengan SORT, lalu ambil beberapa baris pertama dengan TAKE.'}});
add('nama-terbaik','Advanced','Pencarian','Nama dengan nilai tertinggi',r=>{const n=r.int(5,9),ns=people(r,n);const vs=r.sample(Array.from({length:80},(_,i)=>20+i),n);const rows=ns.map((p,i)=>[p,vs[i]]);const mx=r.chance(.6);
  return{data:Object.assign(tbl(['Sales','Unit'],rows),{D2:mx?'Terbaik':'Terendah'}),cols:5,rows:n+1,target:'E2',solution:`=INDEX(A2:A${n+1},MATCH(${mx?'MAX':'MIN'}(B2:B${n+1}),B2:B${n+1},0))`,use:[mx?'MAX|LARGE|SORT':'MIN|SMALL|SORT'],bold:['D2'],
  text:`Isi <code>E2</code> dengan <b>nama</b> sales yang unitnya paling ${mx?'tinggi':'rendah'}.`}});
add('tarif','Advanced','Pencarian','Tabel tarif bertingkat',r=>{const n=r.int(3,5),ns=people(r,n);const tiers=[0,r.pick([40,50]),r.pick([100,120]),r.pick([200,250])].map(x=>x*1e6);const rates=[0,r.pick([.01,.015]),r.pick([.025,.03]),r.pick([.04,.05])];
  const rows=ns.map(p=>[p,r.money(10e6,320e6,500000)]);const t=r.int(2,n+1);const d=tbl(['Sales','Penjualan','Komisi'],rows);tiers.forEach((v,i)=>{d['E'+(i+2)]=v;d['F'+(i+2)]=rates[i]});d.E1='Batas bawah';d.F1='Tarif';
  return{data:d,fmt:{C:'pct',F:'pct'},cols:6,rows:Math.max(n+1,5),target:'C'+t,solution:`=VLOOKUP(B${t},$E$2:$F$5,2,TRUE)`,use:['VLOOKUP|XLOOKUP|LOOKUP|INDEX|IFS|IF'],bold:['E1','F1'],
  text:`Isi <code>C${t}</code> dengan tarif komisi ${rows[t-2][0]} berdasarkan tabel batas bawah di E–F.`,hint:'Untuk tabel batas bawah, VLOOKUP memakai TRUE (kecocokan terdekat).'}});
add('pmt','Advanced','Keuangan','Cicilan pinjaman',r=>{const p=r.money(20e6,500e6,5e6),b=r.pick([.06,.075,.08,.095,.1,.12]),n=r.pick([12,24,36,48,60]);
  return{data:{A1:'Pokok pinjaman',B1:p,A2:'Bunga per tahun',B2:b,A3:'Tenor (bulan)',B3:n,A4:'Cicilan per bulan'},fmt:{B2:'pct'},cols:3,rows:5,target:'B4',solution:'=PMT(B2/12,B3,-B1)',use:['PMT'],bold:['A4'],
  text:`Isi <code>B4</code> dengan cicilan per bulan (bunga efektif) sebagai angka positif.`,hint:'Bunga per bulan = B2/12. Beri minus di depan pokok supaya hasilnya positif.'}});
add('bunga-bulan','Advanced','Keuangan','Porsi bunga dan pokok',r=>{const p=r.money(20e6,300e6,5e6),b=r.pick([.08,.1,.12]),n=r.pick([12,24,36]),k=r.int(1,6);const ip=r.chance(.5);
  return{data:{A1:'Pokok pinjaman',B1:p,A2:'Bunga per tahun',B2:b,A3:'Tenor (bulan)',B3:n,A4:'Bulan ke-',B4:k,A5:ip?'Porsi bunga':'Porsi pokok'},fmt:{B2:'pct'},cols:3,rows:6,target:'B5',solution:`=${ip?'IPMT':'PPMT'}(B2/12,B4,B3,-B1)`,use:[ip?'IPMT':'PPMT'],bold:['A5'],
  text:`Isi <code>B5</code> dengan porsi <b>${ip?'bunga':'pokok'}</b> dari cicilan bulan ke-${k}.`}});
add('irr','Advanced','Keuangan','NPV atau IRR',r=>{const inv=-r.money(100e6,800e6,10e6);const flows=Array.from({length:5},()=>Math.round(-inv*(0.18+r.f()*0.2)/1e6)*1e6);const npv=r.chance(.5);const dr=r.pick([.08,.1,.12,.15]);
  const d={A1:'Tahun',B1:'Arus kas',A2:0,B2:inv};flows.forEach((f,i)=>{d['A'+(i+3)]=i+1;d['B'+(i+3)]=f});d.D1='Biaya modal';d.E1=dr;d.D2=npv?'NPV':'IRR';
  return{data:d,fmt:{E1:'pct',E2:npv?undefined:'pct'},cols:5,rows:7,target:'E2',solution:npv?'=NPV(E1,B3:B7)+B2':'=IRR(B2:B7)',use:[npv?'NPV':'IRR'],bold:['D1','D2'],
  text:npv?`Isi <code>E2</code> dengan NPV proyek. Investasi awal di tahun 0 (B2) ditambahkan di luar fungsi NPV.`:`Isi <code>E2</code> dengan IRR proyek.`}});
add('sumproduct-syarat','Advanced','Bersyarat','SUMPRODUCT bersyarat',r=>{const n=r.int(6,10),ps=r.sample(PROD,3);const rows=Array.from({length:n},()=>[r.pick(ps),r.int(2,50),r.money(3000,40000,500)]);const k=r.pick(rows)[0];
  return{data:Object.assign(tbl(['Produk','Qty','Harga'],rows),{E1:'Produk',F1:k,E2:'Total nilai'}),cols:6,rows:n+1,target:'F2',solution:`=SUMPRODUCT((A2:A${n+1}=F1)*B2:B${n+1}*C2:C${n+1})`,use:['SUMPRODUCT'],bold:['E1','E2'],
  text:`Isi <code>F2</code> dengan total nilai (qty × harga) khusus produk <b>${k}</b>, dalam satu rumus tanpa kolom bantu.`,hint:'(A2:A…=F1) menghasilkan TRUE/FALSE yang dihitung 1/0 saat dikali.'}});
add('dua-kunci','Advanced','Pencarian','Mencari dengan dua kunci',r=>{const ps=r.sample(['Kaos','Kemeja','Jaket','Celana'],r.int(2,3)),sz=['S','M','L'];const rows=[];ps.forEach(p=>sz.forEach(s=>rows.push([p,s,r.money(60000,450000,5000)])));const k=r.pick(rows);const n=rows.length;
  return{data:Object.assign(tbl(['Produk','Ukuran','Harga'],rows),{E1:'Produk',F1:k[0],E2:'Ukuran',F2:k[1],E3:'Harga'}),cols:6,rows:n+1,target:'F3',solution:`=XLOOKUP(1,(A2:A${n+1}=F1)*(B2:B${n+1}=F2),C2:C${n+1})`,use:['XLOOKUP|INDEX|SUMIFS|FILTER|SUMPRODUCT|MAXIFS'],bold:['E1','E2','E3'],
  text:`Isi <code>F3</code> dengan harga <b>${k[0]}</b> ukuran <b>${k[1]}</b>.`,hint:'Contoh: XLOOKUP(1,(kolom produk=F1)*(kolom ukuran=F2),kolom harga).'}});
add('groupby','Advanced','Array dinamis','Ringkasan per kelompok',r=>{const n=r.int(7,11),cats=r.sample(CAT,r.int(3,4));const rows=catRows(r,n,cats);
  return{data:Object.assign(tbl(['Kategori','Jumlah'],rows),{D1:'Kategori',E1:'Total'}),cols:5,rows:n+1,target:'D2',solution:`=GROUPBY(A2:A${n+1},B2:B${n+1},SUM)`,use:['GROUPBY'],bold:['D1','E1'],
  text:`Isi <code>D2</code> dengan total pengeluaran per kategori beserta baris Total, memakai satu rumus GROUPBY.`}});
add('regex','Advanced','Array dinamis','Mengambil pola dengan REGEX',r=>{const n=r.int(3,4);const rows=Array.from({length:n},()=>{const inv='INV-'+r.int(2024,2026)+'-'+String(r.int(1,9999)).padStart(4,'0');return[r.pick([`TRF ${r.pick(LAST).toUpperCase()} ${inv} PELUNASAN`,`dp 50% ${inv} cv ${r.pick(NAMES).toLowerCase()}`,`bayar ${inv} via mobile`])]});const t=r.int(2,n+1);
  return{data:tbl(['Keterangan transfer','No faktur'],rows),cols:2,rows:n+1,target:'B'+t,solution:`=REGEXEXTRACT(A${t},"INV-[0-9]{4}-[0-9]{4}")`,use:['REGEXEXTRACT|MID|TEXTAFTER'],cs:true,
  text:`Isi <code>B${t}</code> dengan nomor faktur (pola INV-TTTT-NNNN) dari keterangan transfer.`}});
add('textsplit','Advanced','Array dinamis','Memecah teks ke kolom',r=>{const sep=r.pick([';','|',',']);const rows=[2,3].map(()=>[r.pick(NAMES)+' '+r.pick(LAST)+sep+r.pick(DIV)+sep+r.pick(CITY)[0]]);
  return{data:tbl(['Data','Nama','Divisi','Kota'],rows),cols:4,rows:3,target:'B2',solution:`=TEXTSPLIT(A2,"${sep}")`,use:['TEXTSPLIT'],cs:true,
  text:`Isi <code>B2</code> supaya nama, divisi, dan kota di A2 terpecah ke kolom B, C, dan D. Pemisahnya tanda <code>${sep}</code>.`}});
add('let','Advanced','Array dinamis','Rumus bernama dengan LET',r=>{const h=r.money(50000,900000,5000),q=r.int(2,40),d=r.pick([.05,.1,.15]),p=.11;
  return{data:{A1:'Harga satuan',B1:h,A2:'Qty',B2:q,A3:'Diskon',B3:d,A4:'Pajak (contoh)',B4:p,A6:'Total bayar'},fmt:{B3:'pct',B4:'pct'},cols:2,rows:7,target:'B6',solution:'=LET(sub,B1*B2,net,sub*(1-B3),net*(1+B4))',use:['LET'],bold:['A6'],
  text:`Isi <code>B6</code> dengan total bayar: harga × qty, dikurangi diskon, lalu ditambah pajak. Gunakan LET.`}});
add('rata-terakhir','Advanced','Pencarian','Rata-rata N bulan terakhir',r=>{const m=r.int(6,10),k=r.pick([3,3,4]);const ms=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];const d={A1:'Bulan',B1:'Penjualan'};ms.forEach((x,i)=>{d['A'+(i+2)]=x;if(i<m)d['B'+(i+2)]=r.int(300,700)});d.D2=`Rata-rata ${k} bln terakhir`;
  return{data:d,cols:5,rows:13,target:'E2',solution:`=AVERAGE(OFFSET(B1,COUNT(B2:B13)-${k-1},0,${k},1))`,use:['OFFSET|TAKE|INDEX|INDIRECT'],bold:['D2'],
  text:`Isi <code>E2</code> dengan rata-rata penjualan <b>${k} bulan terakhir</b> yang sudah terisi. Rumusnya harus tetap benar saat bulan berikutnya diisi.`,hint:'Gunakan COUNT untuk tahu berapa bulan yang terisi, lalu OFFSET atau TAKE.'}});

/* =============== EXPERT: gabungan beberapa rumus =============== */
const uniq=(r,n,a,b,step)=>{step=step||1;const pool=[];for(let v=a;v<=b;v+=step)pool.push(v);return r.sample(pool,n)};
add('x-filter-sort','Expert','Gabungan array','FILTER dua syarat lalu SORT',r=>{const n=r.int(9,13),cs=cityList(r,3),ns=people(r,n),us=uniq(r,n,20,99);
  const rows=ns.map((p,i)=>[p,cs[i%3],us[i]]);const k=r.pick(cs);const ku=rows.filter(x=>x[1]===k).map(x=>x[2]).sort((a,b)=>b-a);const b=ku[r.int(0,Math.min(2,ku.length-1))];const bb=b-b%5;const m=rows.filter(x=>x[1]===k&&x[2]>=bb).length;const N=n+1;
  return{data:Object.assign(tbl(['Nama','Kota','Unit'],rows),{E1:'Kota',F1:k,E2:'Unit minimal',F2:bb,E4:'Nama',F4:'Kota',G4:'Unit'}),cols:7,rows:Math.max(N,4+m),target:'E5',
  solution:`=SORT(FILTER(A2:C${N},(B2:B${N}=F1)*(C2:C${N}>=F2)),3,-1)`,use:['FILTER','SORT|SORTBY'],bold:['E1','E2','E4','F4','G4'],
  text:`Isi <code>E5</code> dengan semua sales kota <b>${k}</b> yang unitnya minimal ${bb} (F2), diurutkan dari unit terbesar. Satu rumus saja.`,hint:'Dua syarat di FILTER dikalikan: (syarat1)*(syarat2). Bungkus hasil FILTER dengan SORT.'}});
add('x-lookup-sumifs','Expert','Gabungan pencarian','SUMIFS dengan kriteria hasil XLOOKUP',r=>{const cs=cityList(r,3),ns=people(r,5);const mast=ns.map((p,i)=>['K-'+(201+i*7),p,i<3?cs[i]:r.pick(cs)]);const ms=r.sample(MON,3);const n=r.int(10,14);
  const tr=Array.from({length:n},()=>[r.pick(cs),r.pick(ms),r.money(2e6,40e6,100000)]);const pick=r.pick(tr);const who=r.pick(mast.filter(x=>x[2]===pick[0]));const N=n+1;
  const d=tbl(['NIK','Nama','Cabang'],mast);['Cabang','Bulan','Penjualan'].forEach((h,j)=>d[C(4+j)+1]=h);tr.forEach((x,i)=>x.forEach((v,j)=>d[C(4+j)+(i+2)]=v));Object.assign(d,{I1:'NIK',J1:who[0],I2:'Bulan',J2:pick[1],I3:'Total cabang'});
  return{data:d,cols:10,rows:N,target:'J3',solution:`=SUMIFS(G2:G${N},E2:E${N},XLOOKUP(J1,A2:A6,C2:C6),F2:F${N},J2)`,use:['SUMIFS|SUMPRODUCT|FILTER','XLOOKUP|VLOOKUP|INDEX|LOOKUP'],bold:['I1','I2','I3'],
  text:`Isi <code>J3</code> dengan total penjualan <b>cabang tempat karyawan ${who[0]} bekerja</b> pada bulan ${pick[1]}. Cabangnya harus dicari dari tabel karyawan di dalam rumus yang sama.`,hint:'Cari cabang dengan XLOOKUP(J1, kolom NIK, kolom cabang), lalu pakai hasilnya sebagai kriteria SUMIFS.'}});
add('x-top-pelanggan','Expert','Gabungan array','Peringkat total per pelanggan',r=>{const pool=r.sample(NAMES,r.int(5,6)).map(x=>'CV '+x);const n=r.int(12,16);const rows=Array.from({length:n},(_,i)=>[i<pool.length?pool[i]:r.pick(pool),r.money(250000,9e6,2500)]);const N=n+1;
  return{data:Object.assign(tbl(['Pelanggan','Belanja'],rows),{D1:'Pelanggan',E1:'Total'}),cols:5,rows:N,target:'D2',solution:`=LET(u,UNIQUE(A2:A${N}),t,SUMIFS(B2:B${N},A2:A${N},u),TAKE(SORTBY(HSTACK(u,t),t,-1),3))`,use:['SORT|SORTBY','TAKE|CHOOSEROWS|INDEX'],bold:['D1','E1'],
  text:`Isi <code>D2</code> dengan <b>3 pelanggan</b> yang total belanjanya paling besar, lengkap dengan totalnya, dari yang terbesar. Satu rumus.`,hint:'Jalan 1: UNIQUE → SUMIFS per pelanggan → HSTACK → SORTBY → TAKE. Jalan 2: GROUPBY, buang baris Total dengan DROP, lalu SORT dan TAKE.'}});
add('x-index-2match','Expert','Gabungan pencarian','Mencari di tabel dua arah',r=>{const ps=r.sample(PROD,5),ms=MON.slice();const d={A1:'Produk'};ms.forEach((m,j)=>d[C(j+1)+1]=m);ps.forEach((p,i)=>{d['A'+(i+2)]=p;ms.forEach((m,j)=>d[C(j+1)+(i+2)]=r.int(40,900))});
  const kp=r.pick(ps),km=r.pick(ms);Object.assign(d,{I1:'Produk',J1:kp,I2:'Bulan',J2:km,I3:'Terjual'});
  return{data:d,cols:10,rows:6,target:'J3',solution:'=INDEX(B2:G6,MATCH(J1,A2:A6,0),MATCH(J2,B1:G1,0))',use:['INDEX|XLOOKUP|OFFSET','MATCH|XMATCH|XLOOKUP'],bold:['I1','I2','I3'],
  text:`Isi <code>J3</code> dengan jumlah terjual <b>${kp}</b> pada bulan <b>${km}</b>. Produk dicari ke bawah, bulan dicari ke samping.`,hint:'INDEX(tabel, MATCH(produk, kolom A, 0), MATCH(bulan, baris 1, 0)), atau XLOOKUP di dalam XLOOKUP.'}});
add('x-umur-piutang','Expert','Gabungan tanggal','Piutang lewat jatuh tempo per akhir bulan',r=>{const ref=D(2026,r.int(3,11),r.int(1,28)),p0=XL.fromSerial(ref);const eom=D(p0.y,p0.m+1,1)-1;
  const pel=r.sample(NAMES,3).map(x=>'Toko '+x),n=r.int(9,13),lim=r.pick([30,60,90]);
  const rows=Array.from({length:n},()=>['INV-'+r.int(1000,9999),r.pick(pel),eom-r.int(-20,150),r.money(500000,25e6,50000)]);const k=r.pick(rows)[1];const N=n+1;
  return{data:Object.assign(tbl(['Faktur','Pelanggan','Jatuh tempo','Sisa'],rows),{F1:'Tanggal laporan',G1:ref,F2:'Pelanggan',G2:k,F3:'Lewat lebih dari (hari)',G3:lim,F4:'Total'}),fmt:{C:'date',G1:'date'},cols:7,rows:N,target:'G4',
  solution:`=SUMIFS(D2:D${N},B2:B${N},G2,C2:C${N},"<"&EOMONTH(G1,0)-G3)`,use:['SUMIFS|SUMPRODUCT|FILTER','EOMONTH|DATE'],bold:['F1','F2','F3','F4'],
  text:`Laporan umur piutang dihitung <b>per akhir bulan</b> dari tanggal di G1. Isi <code>G4</code> dengan total sisa piutang <b>${k}</b> yang per akhir bulan itu sudah lewat jatuh tempo <b>lebih dari ${lim} hari</b>.`,hint:'Akhir bulan: EOMONTH(G1,0). Lewat lebih dari N hari berarti jatuh tempo < akhir bulan − N, jadi kriterianya "<"&(EOMONTH(G1,0)-G3).'}});
add('x-textjoin-filter','Expert','Gabungan teks','Daftar nama dalam satu sel',r=>{const n=r.int(8,11),ns=people(r,n),ds=r.sample(DIV,3);const rows=ns.map((p,i)=>[p,ds[i<3?i:r.int(0,2)]]);const k=r.pick(ds);const N=n+1;
  return{data:Object.assign(tbl(['Nama','Divisi'],rows),{D1:'Divisi',E1:k,D2:'Anggota'}),cols:5,rows:N,target:'E2',solution:`=TEXTJOIN(", ",TRUE,FILTER(A2:A${N},B2:B${N}=E1))`,use:['TEXTJOIN|CONCAT|ARRAYTOTEXT','FILTER|IF'],cs:true,bold:['D1','D2'],
  text:`Isi <code>E2</code> dengan nama semua anggota divisi <b>${k}</b> dalam satu sel, dipisah koma dan spasi, urut sesuai tabel. Contoh: <i>Andi, Budi</i>.`,hint:'FILTER mengambil nama-namanya, TEXTJOIN(", ",TRUE,…) menggabungkannya.'}});
add('x-komisi-cap','Expert','Gabungan pencarian','Komisi bertingkat dengan batas maksimal',r=>{const n=r.int(4,6),ns=people(r,n);const tiers=[0,r.pick([25,30]),r.pick([60,75]),r.pick([120,150])].map(x=>x*1e6);const rates=[.01,r.pick([.02,.025]),r.pick([.03,.035]),r.pick([.04,.05])];const cap=r.money(2e6,5e6,250000);
  const rows=ns.map(p=>[p,r.money(10e6,220e6,500000)]);const t=r.int(2,n+1);const d=tbl(['Sales','Penjualan','Komisi'],rows);d.E1='Batas bawah';d.F1='Tarif';tiers.forEach((v,i)=>{d['E'+(i+2)]=v;d['F'+(i+2)]=rates[i]});Object.assign(d,{H1:'Komisi maks.',I1:cap});
  return{data:d,fmt:{F:'pct'},cols:9,rows:Math.max(n+1,5),target:'C'+t,solution:`=MIN(B${t}*XLOOKUP(B${t},$E$2:$E$5,$F$2:$F$5,,-1),$I$1)`,use:['MIN|IF|IFS','XLOOKUP|VLOOKUP|LOOKUP|INDEX'],bold:['E1','F1','H1'],
  text:`Isi <code>C${t}</code> dengan komisi ${rows[t-2][0]} dalam rupiah: penjualan × tarif sesuai tabel batas bawah, tapi tidak boleh lebih dari komisi maksimal di I1.`,hint:'Tarif: XLOOKUP(penjualan, batas, tarif, , -1) atau VLOOKUP(…,TRUE). Batas atas: bungkus dengan MIN(…, $I$1).'}});
add('x-pph-progresif','Expert','Gabungan keuangan','Pajak progresif berlapis',r=>{const pkp=r.money(30e6,900e6,1e6);
  const d={A1:'PKP setahun',B1:pkp,A2:'PPh terutang',D1:'Batas bawah',E1:'Tarif',D2:0,E2:.05,D3:60e6,E3:.15,D4:250e6,E4:.25,D5:500e6,E5:.3};
  return{data:d,fmt:{E:'pct'},cols:5,rows:5,target:'B2',solution:'=SUMPRODUCT((B1>D2:D5)*(B1-D2:D5),E2:E5-VSTACK(0,DROP(E2:E5,-1)))',use:['SUMPRODUCT|SUM|MIN|MAX|IF|IFS|LET'],bold:['A2','D1','E1'],
  text:`Isi <code>B2</code> dengan PPh progresif dari PKP di B1. Tarif berlaku berlapis: 5% untuk 60 juta pertama, 15% untuk bagian 60–250 juta, dan seterusnya sesuai tabel.`,hint:'Per lapisan: (PKP − batas bawah, kalau positif) × kenaikan tarif dibanding lapisan sebelumnya. Dengan SUMPRODUCT bisa satu rumus.'}});
add('x-groupby-filter','Expert','Gabungan array','Ringkasan per kategori untuk satu bulan',r=>{const ms=r.sample(MON,3),cats=r.sample(CAT,r.int(3,4)),n=r.int(10,14);const rows=Array.from({length:n},(_,i)=>[ms[i%3],r.pick(cats),r.money(50000,2e6,5000)]);const k=r.pick(ms);const N=n+1;
  const m=new Set(rows.filter(x=>x[0]===k).map(x=>x[1])).size;
  return{data:Object.assign(tbl(['Bulan','Kategori','Jumlah'],rows),{E1:'Bulan',F1:k,E3:'Kategori',F3:'Total'}),cols:6,rows:Math.max(N,4+m),target:'E4',solution:`=GROUPBY(FILTER(B2:B${N},A2:A${N}=F1),FILTER(C2:C${N},A2:A${N}=F1),SUM)`,use:['GROUPBY|PIVOTBY','FILTER'],bold:['E1','E3','F3'],
  text:`Isi <code>E4</code> dengan total pengeluaran per kategori <b>khusus bulan ${k}</b>, lengkap dengan baris Total. Gabungkan GROUPBY dengan FILTER.`,hint:'Saring dulu kolom kategori dan kolom jumlah dengan FILTER(…, A2:A…=F1), lalu masukkan keduanya ke GROUPBY.'}});
add('x-transaksi-terakhir','Expert','Gabungan pencarian','Nilai transaksi terbaru',r=>{const pel=r.sample(NAMES,4).map(x=>'PT '+x),n=r.int(10,14);const ds=uniq(r,n,D(2026,1,2),D(2026,9,30));const rows=ds.map((dt,i)=>[dt,pel[i%4],r.money(500000,30e6,5000)]);const k=r.pick(pel);const N=n+1;
  return{data:Object.assign(tbl(['Tanggal','Pelanggan','Nilai'],rows),{E1:'Pelanggan',F1:k,E2:'Transaksi terbaru'}),fmt:{A:'date'},cols:6,rows:N,target:'F2',solution:`=XLOOKUP(MAXIFS(A2:A${N},B2:B${N},F1),A2:A${N},C2:C${N})`,use:['MAXIFS|MAX|SORTBY|SORT|LARGE','XLOOKUP|INDEX|FILTER|SUMIFS|LOOKUP|TAKE'],bold:['E1','E2'],
  text:`Isi <code>F2</code> dengan <b>nilai</b> transaksi paling baru milik <b>${k}</b>. Hati-hati: tanggalnya tidak berurutan.`,hint:'Cari tanggal terbaru pelanggan itu dengan MAXIFS, lalu cari nilainya berdasarkan tanggal tersebut.'}});
add('x-restock','Expert','Gabungan array','Daftar barang yang harus dipesan',r=>{const n=r.int(7,10),ps=r.sample(PROD,n);const rows=ps.map(p=>{const rop=r.int(20,60),mx=rop+r.int(40,120);return[p,r.int(5,mx),rop,mx]});rows[r.int(0,n-1)][1]=r.int(2,15);const N=n+1;const m=rows.filter(x=>x[1]<x[2]).length;
  return{data:Object.assign(tbl(['Produk','Stok','Titik pesan','Stok maks.'],rows),{F1:'Produk',G1:'Jumlah pesan'}),cols:7,rows:Math.max(N,m+1),target:'F2',solution:`=FILTER(HSTACK(A2:A${N},D2:D${N}-B2:B${N}),B2:B${N}<C2:C${N})`,use:['FILTER','HSTACK|CHOOSE|CHOOSECOLS'],bold:['F1','G1'],
  text:`Isi <code>F2</code> dengan daftar produk yang stoknya <b>di bawah</b> titik pesan ulang, beserta jumlah yang harus dipesan supaya stok kembali ke stok maksimum.`,hint:'Bangun dua kolom dengan HSTACK(nama, stok maks − stok), lalu saring dengan FILTER.'}});
add('x-saldo-scan','Expert','LAMBDA','Saldo berjalan dengan SCAN',r=>{const n=r.int(6,9);const rows=Array.from({length:n},()=>{const masuk=r.chance(.45);return[masuk?r.pick(['Setoran tunai','Pelunasan '+r.pick(NAMES),'Transfer masuk']):r.pick(['Beli ATK','Bayar listrik','Konsumsi rapat','Bensin operasional']),masuk?r.money(500000,8e6,50000):null,masuk?null:r.money(50000,3e6,5000)]});const N=n+1;
  return{data:Object.assign(tbl(['Keterangan','Masuk','Keluar','Saldo'],rows),{F1:'Saldo awal',G1:r.money(2e6,15e6,100000)}),cols:7,rows:N,target:'D2',solution:`=SCAN(G1,B2:B${N}-C2:C${N},LAMBDA(a,x,a+x))`,use:['SCAN|MAP|BYROW|MAKEARRAY'],bold:['F1'],
  text:`Isi <code>D2</code> dengan saldo berjalan untuk semua baris sekaligus dalam <b>satu rumus</b> yang tumpah ke bawah. Saldo = saldo sebelumnya + masuk − keluar, mulai dari saldo awal di G1.`,hint:'SCAN(awal, data, LAMBDA(akumulasi, nilai, akumulasi+nilai)). Datanya: B2:B…−C2:C….'}});
add('x-bulan-terbaik','Expert','LAMBDA','Bulan terbaik tiap sales dengan BYROW',r=>{const n=r.int(4,6),ns=people(r,n);const d={A1:'Sales'};MON.forEach((m,j)=>d[C(j+1)+1]=m);d.H1='Bulan terbaik';ns.forEach((p,i)=>{d['A'+(i+2)]=p;uniq(r,6,20,99).forEach((v,j)=>d[C(j+1)+(i+2)]=v)});const N=n+1;
  return{data:d,cols:8,rows:N,target:'H2',solution:`=BYROW(B2:G${N},LAMBDA(r,XLOOKUP(MAX(r),r,B1:G1)))`,use:['BYROW|MAP','XLOOKUP|INDEX|MATCH|XMATCH|FILTER'],bold:['H1'],
  text:`Isi <code>H2</code> dengan nama bulan penjualan tertinggi untuk <b>setiap</b> sales, dalam satu rumus yang tumpah ke bawah.`,hint:'BYROW menjalankan LAMBDA per baris. Di dalamnya: XLOOKUP(MAX(r), r, B1:G1).'}});
add('x-unik-bersyarat','Expert','Gabungan array','Pelanggan unik per kota',r=>{const cs=cityList(r,3),pool=r.sample(NAMES,6),n=r.int(10,14);const rows=Array.from({length:n},(_,i)=>[cs[i%3],r.pick(pool)]);const k=r.pick(cs);const N=n+1;
  return{data:Object.assign(tbl(['Kota','Pelanggan'],rows),{D1:'Kota',E1:k,D2:'Pelanggan unik'}),cols:5,rows:N,target:'E2',solution:`=COUNTA(UNIQUE(FILTER(B2:B${N},A2:A${N}=E1)))`,use:['UNIQUE','FILTER'],bold:['D1','D2'],
  text:`Isi <code>E2</code> dengan jumlah pelanggan <b>berbeda</b> yang bertransaksi di kota <b>${k}</b>.`,hint:'FILTER pelanggan kota itu → UNIQUE → COUNTA.'}});
add('x-sla-workday','Expert','Gabungan tanggal','Tenggat SLA hari kerja',r=>{const n=r.int(4,7);const base=D(2026,r.int(1,11),r.int(1,20));const wk=s=>{let x=s;while(XL.fromSerial(x).w===0||XL.fromSerial(x).w===6)x++;return x};
  const rows=Array.from({length:n},()=>['TK-'+r.int(100,999),wk(base+r.int(0,10)),r.pick(['Tinggi','Sedang','Rendah'])]);const t=r.int(2,n+1);const sl=[r.pick([1,2]),r.pick([3,4]),r.pick([5,7])];const lib=[wk(base+r.int(2,6)),wk(base+r.int(8,14))];
  const d=Object.assign(tbl(['Tiket','Masuk','Prioritas','Tenggat'],rows),{F1:'Prioritas',G1:'SLA (hari kerja)',F2:'Tinggi',G2:sl[0],F3:'Sedang',G3:sl[1],F4:'Rendah',G4:sl[2],I1:'Libur',I2:lib[0],I3:lib[1]});
  return{data:d,fmt:{B:'date',D:'date',I:'date'},cols:9,rows:Math.max(n+1,4),target:'D'+t,solution:`=WORKDAY(B${t},XLOOKUP(C${t},$F$2:$F$4,$G$2:$G$4),$I$2:$I$3)`,use:['WORKDAY','XLOOKUP|VLOOKUP|INDEX|SWITCH|IFS|IF|LOOKUP'],bold:['F1','G1','I1'],
  text:`Isi <code>D${t}</code> dengan tenggat tiket ${rows[t-2][0]}: tanggal masuk + SLA sesuai prioritas (tabel F–G), dihitung dalam hari kerja dan melewati tanggal libur di I2:I3.`,hint:'WORKDAY(tanggal, jumlah hari, libur). Jumlah harinya dicari dari tabel SLA.'}});
add('x-qty-teks','Expert','Gabungan teks','Total qty dari teks pesanan',r=>{const n=r.int(3,5);const items=['Kopi','Teh','Gula','Susu','Roti','Air','Mi'];const rows=Array.from({length:n},()=>[r.sample(items,r.int(2,4)).map(x=>x+':'+r.int(1,24)).join(';')]);const t=r.int(2,n+1);
  return{data:tbl(['Pesanan','Total qty'],rows),cols:2,rows:n+1,target:'B'+t,solution:`=SUM(--TEXTAFTER(TEXTSPLIT(A${t},";"),":"))`,use:['TEXTSPLIT|REGEXEXTRACT|SUBSTITUTE|MID','SUM|SUMPRODUCT|REDUCE'],
  text:`Setiap pesanan ditulis <b>barang:qty</b> dipisah titik koma. Isi <code>B${t}</code> dengan total qty pesanan di A${t}.`,hint:'TEXTSPLIT memecah per ";", TEXTAFTER mengambil angka setelah ":", tanda -- mengubah teks jadi angka, lalu SUM.'}});
add('x-tenor','Expert','Gabungan keuangan','Tenor terpendek yang terjangkau',r=>{const p=r.money(30e6,400e6,5e6),b=r.pick([.08,.095,.11,.12]);const tn=[12,24,36,48,60];const pm=n=>p*(b/12)/(1-Math.pow(1+b/12,-n));
  const i=r.int(1,4);const bud=Math.ceil((pm(tn[i])+ (pm(tn[i-1])-pm(tn[i]))*r.f()*0.8)/50000)*50000;
  const d={A1:'Pinjaman',B1:p,A2:'Bunga per tahun',B2:b,A3:'Cicilan maks. per bulan',B3:bud,A5:'Tenor terpendek',D1:'Pilihan tenor'};tn.forEach((x,j)=>d['D'+(j+2)]=x);
  return{data:d,fmt:{B2:'pct'},cols:4,rows:6,target:'B5',solution:'=XLOOKUP(TRUE,PMT(B2/12,D2:D6,-B1)<=B3,D2:D6)',use:['PMT','XLOOKUP|INDEX|FILTER|MINIFS|MIN|MATCH|XMATCH|TAKE'],bold:['A5','D1'],
  text:`Isi <code>B5</code> dengan tenor (bulan) <b>terpendek</b> dari pilihan di D2:D6 yang cicilannya tidak melebihi B3.`,hint:'PMT(B2/12, D2:D6, -B1) menghitung cicilan untuk semua tenor sekaligus. Cari TRUE pertama dari (cicilan <= B3).'}});
add('x-yoy','Expert','Gabungan bersyarat','Pertumbuhan dibanding tahun lalu',r=>{const ms=r.sample(MON,3);const rows=[];[2025,2026].forEach(y=>ms.forEach(m=>{for(let k=r.int(1,3);k>0;k--)rows.push([y,m,r.money(5e6,60e6,100000)])}));const rr=r.sample(rows,rows.length);const k=r.pick(ms);const N=rr.length+1;
  return{data:Object.assign(tbl(['Tahun','Bulan','Penjualan'],rr),{E1:'Bulan',F1:k,E2:'Tahun ini',F2:2026,E3:'Tahun lalu',F3:2025,E4:'Pertumbuhan'}),fmt:{F4:'pct'},cols:6,rows:N,target:'F4',solution:`=ROUND(SUMIFS(C2:C${N},A2:A${N},F2,B2:B${N},F1)/SUMIFS(C2:C${N},A2:A${N},F3,B2:B${N},F1)-1,3)`,use:['SUMIFS|SUMPRODUCT|FILTER','ROUND'],bold:['E1','E2','E3','E4'],
  text:`Isi <code>F4</code> dengan pertumbuhan penjualan bulan <b>${k}</b> tahun ${2026} dibanding ${2025}, dalam persen dengan <b>1 angka desimal</b> (misalnya 12,3%).`,hint:'Pertumbuhan = total tahun ini / total tahun lalu − 1. Masing-masing total pakai SUMIFS dua syarat. 1 desimal persen = ROUND(…, 3).'}});
add('x-absen-potong','Expert','Gabungan bersyarat','Potongan gaji karena alpa',r=>{const n=r.int(4,6),ns=people(r,n);const d={A1:'Nama',B1:'Gaji'};for(let j=0;j<10;j++)d[C(j+2)+1]=String(j+1);d.M1='Potongan';d.O1='Hari kerja';d.P1=22;
  const t=r.int(2,n+1);ns.forEach((p,i)=>{d['A'+(i+2)]=p;d['B'+(i+2)]=r.money(4.5e6,12e6,50000);for(let j=0;j<10;j++)d[C(j+2)+(i+2)]=r.pick(['H','H','H','H','H','S','I','A'])});d[C(r.int(2,11))+t]='A';
  return{data:d,cols:16,rows:n+1,target:'M'+t,solution:`=ROUND(COUNTIF(C${t}:L${t},"A")*B${t}/$P$1,-3)`,use:['COUNTIF|COUNTIFS','ROUND|ROUNDUP|ROUNDDOWN|MROUND'],bold:['M1','O1'],
  text:`Kode absen: H hadir, S sakit, I izin, A alpa. Setiap hari <b>alpa</b> dipotong gaji/hari kerja (P1). Isi <code>M${t}</code> dengan potongan ${ns[t-2]}, dibulatkan ke <b>ribuan terdekat</b>.`,hint:'COUNTIF(baris absen, "A") × gaji / hari kerja, lalu ROUND(…, -3).'}});
add('x-rank-grup','Expert','Gabungan bersyarat','Peringkat di dalam cabang untuk semua baris',r=>{const n=r.int(8,12),cs=cityList(r,3),ns=people(r,n),us=uniq(r,n,15,99);const rows=ns.map((p,i)=>[p,cs[i%3],us[i]]);const N=n+1;
  return{data:tbl(['Sales','Cabang','Unit','Peringkat cabang'],rows),cols:4,rows:N,target:'D2',solution:`=MAP(B2:B${N},C2:C${N},LAMBDA(b,u,COUNTIFS(B2:B${N},b,C2:C${N},">"&u)+1))`,use:['COUNTIFS|SUMPRODUCT|RANK|RANK.EQ|FILTER'],
  text:`Isi <code>D2</code> dengan peringkat setiap sales <b>di dalam cabangnya sendiri</b> (unit terbanyak di cabang = 1), untuk semua baris sekaligus dalam satu rumus yang tumpah ke bawah.`,hint:'Peringkat = jumlah sales di cabang yang sama dengan unit lebih besar, + 1. Bisa COUNTIFS dengan kriteria berupa rentang (B2:B…, ">"&C2:C…), atau MAP + LAMBDA.'}});
add('x-nilai-akhir','Expert','Gabungan pencarian','Nilai berbobot lalu predikat',r=>{const n=r.int(4,6),ns=people(r,n);const w=r.pick([[.2,.3,.5],[.3,.3,.4],[.25,.35,.4]]);const lim=[0,60,75,85],gr=['D','C','B','A'];
  const sc=row=>row[0]*w[0]+row[1]*w[1]+row[2]*w[2];const rows=ns.map(p=>{const v=[r.int(45,100),r.int(45,100),r.int(45,100)];while(lim.some(l=>Math.abs(sc(v)-l)<0.05))v[2]=v[2]<100?v[2]+1:v[2]-3;return[p,...v]});const t=r.int(2,n+1);
  const d=Object.assign(tbl(['Nama','Tugas','UTS','UAS','Predikat'],rows),{G1:'Bobot tugas',H1:'Bobot UTS',I1:'Bobot UAS',G2:w[0],H2:w[1],I2:w[2],K1:'Nilai min.',L1:'Predikat'});lim.forEach((l,i)=>{d['K'+(i+2)]=l;d['L'+(i+2)]=gr[i]});
  return{data:d,fmt:{G2:'pct',H2:'pct',I2:'pct'},cols:12,rows:Math.max(n+1,5),target:'E'+t,solution:`=XLOOKUP(SUMPRODUCT(B${t}:D${t},$G$2:$I$2),$K$2:$K$5,$L$2:$L$5,,-1)`,use:['SUMPRODUCT|SUM|MMULT','XLOOKUP|VLOOKUP|LOOKUP|INDEX|IFS|IF'],bold:['G1','H1','I1','K1','L1'],
  text:`Isi <code>E${t}</code> dengan predikat ${rows[t-2][0]}: hitung nilai akhir berbobot (bobot di G2:I2), lalu cari predikatnya di tabel K–L.`,hint:'Nilai akhir: SUMPRODUCT(nilai, bobot). Predikat: XLOOKUP(nilai, batas, predikat, , -1) atau VLOOKUP(…, TRUE).'}});
add('x-duplikat','Expert','Gabungan bersyarat','Menandai kemunculan kedua',r=>{const n=r.int(8,11);const pool=Array.from({length:5},()=>'INV-'+r.int(1000,9999));const rows=Array.from({length:n},()=>[r.pick(pool),r.money(500000,9e6,10000)]);const t=r.int(4,n+1);if(r.chance(.6))rows[t-2][0]=rows[r.int(0,t-3)][0];
  return{data:tbl(['No faktur','Nilai','Cek'],rows),cols:3,rows:n+1,target:'C'+t,solution:`=IF(COUNTIF($A$2:A${t},A${t})>1,"Duplikat","Unik")`,use:['COUNTIF|COUNTIFS|MATCH|XMATCH|XLOOKUP','IF|IFS'],
  text:`Isi <code>C${t}</code> dengan <b>Duplikat</b> kalau nomor faktur A${t} sudah muncul di baris-baris <b>sebelumnya</b>, selain itu <b>Unik</b>. Kemunculan pertama tetap Unik.`,hint:'Hitung kemunculan dari A2 sampai baris ini saja: COUNTIF($A$2:A'+t+', A'+t+').'}});
add('x-hari-kerja-bulan','Expert','Gabungan tanggal','Hari kerja dalam satu bulan',r=>{const dt=D(2026,r.int(1,12),r.int(1,28));const p=XL.fromSerial(dt);const lib=[D(p.y,p.m,r.int(2,14)),D(p.y,p.m,r.int(15,28))];
  return{data:{A1:'Tanggal',B1:dt,A2:'Hari kerja bulan ini',D1:'Libur',D2:lib[0],D3:lib[1]},fmt:{B1:'date',D2:'date',D3:'date'},cols:4,rows:4,target:'B2',solution:'=NETWORKDAYS(DATE(YEAR(B1),MONTH(B1),1),EOMONTH(B1,0),D2:D3)',use:['NETWORKDAYS','EOMONTH|DATE'],bold:['A2','D1'],
  text:`Isi <code>B2</code> dengan jumlah hari kerja Senin–Jumat <b>sepanjang bulan</b> dari tanggal di B1 (tanggal 1 sampai akhir bulan), tidak termasuk libur di D2:D3.`,hint:'Awal bulan: DATE(YEAR(B1),MONTH(B1),1). Akhir bulan: EOMONTH(B1,0).'}});
add('x-nominal-catatan','Expert','Gabungan teks','Menjumlah nominal dari catatan',r=>{const n=r.int(4,6);const rows=Array.from({length:n},()=>{const v=r.money(50000,9e6,5000);const s=v.toLocaleString('id-ID');return[r.pick([`Bayar ${r.pick(NAMES)} Rp${s} lunas`,`DP proyek Rp${s}`,`transfer ${r.pick(LAST)} sebesar Rp${s}`])]});const N=n+1;
  return{data:Object.assign(tbl(['Catatan'],rows),{C1:'Total nominal'}),cols:4,rows:N,target:'D1',solution:`=SUM(--SUBSTITUTE(REGEXEXTRACT(A2:A${N},"[0-9][0-9.]*"),".",""))`,use:['REGEXEXTRACT|TEXTAFTER|MID|REGEXREPLACE','SUM|SUMPRODUCT|REDUCE'],bold:['C1'],
  text:`Setiap catatan memuat satu nominal berformat Rp1.250.000. Isi <code>D1</code> dengan total semua nominal itu dalam satu rumus.`,hint:'Ambil angkanya dengan REGEXEXTRACT(…,"[0-9][0-9.]*"), buang titik dengan SUBSTITUTE, ubah jadi angka dengan --, lalu SUM.'}});

/* =============== tambahan: keuangan, akuntansi, audit, pajak =============== */
const AKUN=['Kas','Bank','Piutang usaha','Persediaan','Utang usaha','Pendapatan','Beban gaji','Beban sewa','Beban listrik'];
const JAB=[['Supervisor',25e6],['Manajer',100e6],['Direktur',1e9]];
add('ppn','Dasar','Pajak & keuangan','Menghitung PPN',r=>{const dpp=r.money(500000,90e6,5000),t=r.pick([.11,.12]);const tot=r.chance(.4);
  return{data:{A1:'DPP',B1:dpp,A2:'Tarif PPN (contoh)',B2:t,A3:tot?'Total tagihan':'PPN'},fmt:{B2:'pct'},cols:3,rows:4,target:'B3',solution:tot?'=B1*(1+B2)':'=B1*B2',bold:['A3'],
  text:tot?`Isi <code>B3</code> dengan total tagihan: DPP ditambah PPN.`:`Isi <code>B3</code> dengan PPN: DPP × tarif.`,hint:tot?'DPP × (1 + tarif).':'B1 × B2.'}});
add('margin','Dasar','Pajak & keuangan','Margin laba',r=>{const n=r.int(4,7),ps=r.sample(PROD,n);const rows=ps.map(p=>{const m=r.money(2000,80000,500);return[p,m,Math.round(m*(1.1+r.f()*0.6)/500)*500]});const t=r.int(2,n+1);const mk=r.chance(.4);
  return{data:tbl(['Produk','Modal','Harga jual',mk?'Markup':'Margin'],rows),fmt:{D:'pct'},cols:4,rows:n+1,target:'D'+t,solution:mk?`=(C${t}-B${t})/B${t}`:`=(C${t}-B${t})/C${t}`,
  text:mk?`Isi <code>D${t}</code> dengan <b>markup</b> ${rows[t-2][0]}: laba dibagi <b>modal</b>.`:`Isi <code>D${t}</code> dengan <b>margin</b> ${rows[t-2][0]}: laba dibagi <b>harga jual</b>.`,hint:'Laba = harga jual − modal. Pakai kurung sebelum membagi.'}});
add('selisih-kurs','Dasar','Pajak & keuangan','Laba rugi selisih kurs',r=>{const usd=r.money(1000,90000,50),k1=r.int(15500,16500),k2=k1+r.int(-400,400)||k1+50;
  return{data:{A1:'Utang (USD)',B1:usd,A2:'Kurs saat dicatat',B2:k1,A3:'Kurs saat dibayar',B3:k2,A4:'Rugi (laba) kurs'},cols:3,rows:5,target:'B4',solution:'=B1*(B3-B2)',bold:['A4'],
  text:`Utang dalam dolar dicatat dengan kurs B2 dan dibayar dengan kurs B3. Isi <code>B4</code> dengan rugi selisih kurs dalam rupiah (positif = rugi, negatif = laba).`,hint:'Jumlah USD × (kurs bayar − kurs catat).'}});
add('pajak-bulat','Dasar','Pajak & keuangan','Pajak dibulatkan ke bawah',r=>{const b=r.money(1e6,95e6,1)+r.int(1,999),t=r.pick([.005,.015,.02,.025]);
  return{data:{A1:'Dasar pengenaan',B1:b,A2:'Tarif (contoh)',B2:t,A3:'Pajak'},fmt:{B2:'pct'},cols:3,rows:4,target:'B3',solution:'=ROUNDDOWN(B1*B2,-3)',use:['ROUNDDOWN|FLOOR|FLOOR.MATH|INT'],bold:['A3'],
  text:`Isi <code>B3</code> dengan pajak (dasar × tarif) yang dibulatkan <b>ke bawah</b> ke ribuan.`,hint:'ROUNDDOWN(…, -3).'}});
add('saldo-akun','Menengah','Akuntansi','Saldo akun dari jurnal',r=>{const n=r.int(8,12),ak=r.sample(AKUN,4);const rows=Array.from({length:n},()=>{const db=r.chance(.5);const v=r.money(500000,30e6,50000);return[r.pick(ak),db?v:null,db?null:v]});const k=r.pick(rows)[0];const N=n+1;
  return{data:Object.assign(tbl(['Akun','Debit','Kredit'],rows),{E1:'Akun',F1:k,E2:'Saldo (D−K)'}),cols:6,rows:N,target:'F2',solution:`=SUMIF(A2:A${N},F1,B2:B${N})-SUMIF(A2:A${N},F1,C2:C${N})`,use:['SUMIF|SUMIFS|SUMPRODUCT'],bold:['E1','E2'],
  text:`Isi <code>F2</code> dengan saldo akun <b>${k}</b>: total debit dikurangi total kredit.`,hint:'Dua SUMIF: satu untuk kolom Debit, satu untuk kolom Kredit.'}});
add('umur-kelompok','Menengah','Akuntansi','Kelompok umur piutang',r=>{const n=r.int(4,7);const rows=Array.from({length:n},()=>['INV-'+r.int(100,999),r.pick([0,0,r.int(1,30),r.int(31,60),r.int(61,150)])]);const t=r.int(2,n+1);
  return{data:tbl(['Faktur','Hari lewat','Kelompok'],rows),cols:3,rows:n+1,target:'C'+t,solution:`=IF(B${t}=0,"Lancar",IF(B${t}<=30,"1-30",IF(B${t}<=60,"31-60","Lewat 60")))`,use:['IF|IFS|LOOKUP|XLOOKUP|SWITCH'],
  text:`Isi <code>C${t}</code> dengan kelompok umur piutang: <b>Lancar</b> (0 hari), <b>1-30</b>, <b>31-60</b>, atau <b>Lewat 60</b>.`,hint:'IF bertingkat, atau IFS.'}});
add('cek-seimbang','Menengah','Akuntansi','Jurnal seimbang?',r=>{const k=r.int(3,5);const rows=[];for(let i=0;i<k;i++){const v=r.money(500000,25e6,50000);const ak=r.sample(AKUN,2);rows.push(['JU-'+(i+1),ak[0],v,null]);rows.push(['JU-'+(i+1),ak[1],null,v])}
  if(r.chance(.5)){const x=r.pick(rows);if(x[2])x[2]+=r.pick([10000,50000,100000]);else x[3]+=r.pick([10000,50000,100000])}const N=rows.length+1;
  return{data:Object.assign(tbl(['No','Akun','Debit','Kredit'],rows),{F1:'Cek'}),cols:7,rows:N,target:'G1',solution:`=IF(SUM(C2:C${N})=SUM(D2:D${N}),"Seimbang","Tidak seimbang")`,use:['IF','SUM'],bold:['F1'],
  text:`Isi <code>G1</code> dengan <b>Seimbang</b> kalau total debit sama dengan total kredit, selain itu <b>Tidak seimbang</b>.`}});
add('rasio-status','Menengah','Pajak & keuangan','Rasio dan status',r=>{const n=r.int(4,6);const rows=Array.from({length:n},()=>['PT '+r.pick(NAMES)+' '+r.pick(['Jaya','Abadi','Makmur','Sentosa']),r.money(500,5000,10),r.money(400,4000,10)]);const t=r.int(2,n+1);const lim=r.pick([1,1.2,1.5]);
  return{data:Object.assign(tbl(['Debitur','Aset lancar','Utang lancar','Status'],rows),{F1:'Rasio min.',G1:lim}),cols:7,rows:n+1,target:'D'+t,solution:`=IF(B${t}/C${t}>=$G$1,"Sehat","Berisiko")`,use:['IF'],bold:['F1'],
  text:`Isi <code>D${t}</code> dengan <b>Sehat</b> kalau rasio lancar (aset lancar ÷ utang lancar) minimal G1, selain itu <b>Berisiko</b>.`}});
add('sln','Menengah','Akuntansi','Penyusutan garis lurus',r=>{const h=r.money(5e6,600e6,500000),s=Math.round(h*r.pick([0,.05,.1])/100000)*100000,u=r.pick([4,5,8,10,20]);const ak=r.chance(.4);const th=r.int(1,u);
  const d={A1:'Harga perolehan',B1:h,A2:'Nilai sisa',B2:s,A3:'Umur (tahun)',B3:u,A5:ak?'Nilai buku':'Penyusutan per tahun'};if(ak){d.A4='Sudah dipakai (tahun)';d.B4=th}
  return{data:d,cols:3,rows:6,target:'B5',solution:ak?'=B1-SLN(B1,B2,B3)*B4':'=SLN(B1,B2,B3)',use:['SLN'],bold:['A5'],
  text:ak?`Isi <code>B5</code> dengan nilai buku setelah dipakai B4 tahun (metode garis lurus).`:`Isi <code>B5</code> dengan penyusutan per tahun metode garis lurus.`,hint:ak?'Harga − SLN(harga, sisa, umur) × tahun dipakai.':'SLN(harga, nilai sisa, umur).'}});
add('limit-jabatan','Menengah','Audit','Transaksi di atas limit',r=>{const n=r.int(8,12);const rows=Array.from({length:n},()=>{const j=r.pick(JAB);return['PO-'+r.int(100,999),j[0],r.money(j[1]*0.3,j[1]*1.4,500000)]});const jb=r.pick(rows)[1];const lim=JAB.find(x=>x[0]===jb)[1];const N=n+1;
  return{data:Object.assign(tbl(['No PO','Disetujui','Nilai'],rows),{E1:'Jabatan',F1:jb,E2:'Limit',F2:lim,E3:'Melebihi limit'}),cols:6,rows:N,target:'F3',solution:`=COUNTIFS(B2:B${N},F1,C2:C${N},">"&F2)`,use:['COUNTIFS|SUMPRODUCT|FILTER'],bold:['E1','E2','E3'],
  text:`Isi <code>F3</code> dengan jumlah PO yang disetujui <b>${jb}</b> dengan nilai di atas limitnya (F2).`,hint:'COUNTIFS dengan dua syarat: jabatan dan nilai ">"&F2.'}});
add('total-bunga','Advanced','Keuangan','Total bunga pinjaman',r=>{const p=r.money(10e6,500e6,1e6),b=r.pick([.07,.085,.1,.12,.15]),n=r.pick([12,24,36,60]);
  return{data:{A1:'Pokok',B1:p,A2:'Bunga per tahun',B2:b,A3:'Tenor (bulan)',B3:n,A4:'Total bunga'},fmt:{B2:'pct'},cols:3,rows:5,target:'B4',solution:'=PMT(B2/12,B3,-B1)*B3-B1',use:['PMT|CUMIPMT|IPMT'],bold:['A4'],
  text:`Isi <code>B4</code> dengan total bunga yang dibayar sampai lunas (cicilan anuitas).`,hint:'Cicilan × tenor − pokok.'}});
add('fv','Advanced','Keuangan','Nilai masa depan tabungan',r=>{const s=r.money(500000,10e6,50000),b=r.pick([.04,.05,.06,.07]),y=r.pick([5,10,15,20]),a=r.chance(.5)?r.money(1e6,50e6,500000):0;
  return{data:{A1:'Setoran per bulan',B1:s,A2:'Imbal hasil per tahun',B2:b,A3:'Lama (tahun)',B3:y,A4:'Saldo awal',B4:a,A5:'Saldo akhir'},fmt:{B2:'pct'},cols:3,rows:6,target:'B5',solution:'=FV(B2/12,B3*12,-B1,-B4)',use:['FV'],bold:['A5'],
  text:`Isi <code>B5</code> dengan nilai dana pada akhir periode, dengan setoran tiap akhir bulan dan bunga majemuk bulanan.`,hint:'FV(bunga/12, tahun×12, −setoran, −saldo awal).'}});
add('pv','Advanced','Keuangan','Nilai sekarang pembayaran sewa',r=>{const s=r.money(5e6,80e6,500000),b=r.pick([.06,.08,.1,.12]),n=r.pick([12,24,36,48,60]);
  return{data:{A1:'Sewa per bulan',B1:s,A2:'Suku bunga per tahun',B2:b,A3:'Masa sewa (bulan)',B3:n,A4:'Nilai sekarang'},fmt:{B2:'pct'},cols:3,rows:5,target:'B4',solution:'=PV(B2/12,B3,-B1)',use:['PV'],bold:['A4'],
  text:`Isi <code>B4</code> dengan nilai sekarang seluruh pembayaran sewa (dibayar tiap akhir bulan).`,hint:'PV(bunga/12, jumlah bulan, −sewa).'}});
add('rate','Advanced','Keuangan','Bunga efektif dari cicilan',r=>{const p=r.money(10e6,300e6,1e6),b=r.pick([.08,.1,.12,.14,.18]),n=r.pick([12,24,36]);const c=Math.round(p*(b/12)/(1-Math.pow(1+b/12,-n))/1000)*1000;
  return{data:{A1:'Pinjaman diterima',B1:p,A2:'Cicilan per bulan',B2:c,A3:'Tenor (bulan)',B3:n,A4:'Bunga efektif per tahun'},fmt:{B4:'pct'},cols:3,rows:5,target:'B4',solution:'=RATE(B3,-B2,B1)*12',use:['RATE'],bold:['A4'],
  text:`Leasing hanya menyebut cicilannya. Isi <code>B4</code> dengan bunga efektif per tahun yang sebenarnya.`,hint:'RATE(tenor, −cicilan, pinjaman) memberi bunga per bulan; kali 12.'}});
add('kurs-tanggal','Advanced','Keuangan','Kurs pada tanggal terdekat',r=>{const n=r.int(6,9);const start=D(2026,r.int(1,10),r.int(1,10));const ds=uniq(r,n,start,start+40).sort((a,b)=>a-b);const rows=ds.map(d=>[d,r.int(15600,16600)]);const q=r.int(ds[0]+1,ds[n-1]+5);const usd=r.money(1000,50000,50);
  return{data:Object.assign(tbl(['Tanggal kurs','Kurs'],rows),{D1:'Tanggal transaksi',E1:q,D2:'Nilai (USD)',E2:usd,D3:'Nilai (Rp)'}),fmt:{A:'date',E1:'date'},cols:5,rows:n+1,target:'E3',solution:`=E2*XLOOKUP(E1,A2:A${n+1},B2:B${n+1},,-1)`,use:['XLOOKUP|VLOOKUP|LOOKUP|INDEX'],bold:['D1','D2','D3'],
  text:`Kurs hanya tersedia pada tanggal tertentu. Isi <code>E3</code> dengan nilai rupiah transaksi, memakai kurs pada tanggal yang sama atau tanggal <b>terakhir sebelumnya</b>.`,hint:'XLOOKUP(tanggal, kolom tanggal, kolom kurs, , -1), atau VLOOKUP(…, TRUE).'}});
add('x-benford','Expert','Gabungan audit','Proporsi digit pertama',r=>{const n=r.int(15,22);const rows=Array.from({length:n},(_,i)=>['BKK-'+(100+i),r.chance(.3)?r.int(70,74)*100000+r.int(0,99)*1000:Math.round(Math.pow(10,6+r.f()*2)/1000)*1000]);const dg=r.pick([1,7,9,1,7]);const N=n+1;
  return{data:Object.assign(tbl(['No bukti','Nilai'],rows),{D1:'Digit',E1:dg,D2:'Proporsi'}),fmt:{E2:'pct'},cols:5,rows:N,target:'E2',solution:`=SUMPRODUCT(--(LEFT(B2:B${N},1)=E1&""))/COUNT(B2:B${N})`,use:['SUMPRODUCT|SUM|COUNT|ROWS|FILTER|COUNTIF','LEFT|MID|TEXT|INT'],bold:['D1','D2'],
  text:`Isi <code>E2</code> dengan proporsi transaksi yang digit <b>pertamanya</b> ${dg}. Satu rumus.`,hint:'LEFT(B2:B…,1)=E1&"" menghasilkan TRUE/FALSE per baris. Ubah jadi 1/0 dengan --, jumlahkan, lalu bagi COUNT.'}});
add('x-rekon','Expert','Gabungan audit','Selisih rekonsiliasi bank',r=>{const n=r.int(6,9);const bank=Array.from({length:n},()=>r.money(-9e6,15e6,5000)).map(v=>v||25000);const book=bank.filter(()=>r.chance(.75));const extra=Array.from({length:r.int(1,2)},()=>r.money(500000,9e6,5000));const bk=r.sample(book.concat(extra),book.length+extra.length);
  const d=tbl(['Mutasi bank'],bank.map(v=>[v]));bk.forEach((v,i)=>{d['C'+(i+2)]=v});d.C1='Catatan buku';d.E1=r.chance(.5)?'Belum dicatat di buku':'Belum masuk bank';const bankSide=d.E1==='Belum dicatat di buku';const N=n+1,M=bk.length+1;
  return{data:d,cols:6,rows:Math.max(N,M),target:'F1',solution:bankSide?`=SUMPRODUCT((COUNTIF(C2:C${M},A2:A${N})=0)*A2:A${N})`:`=SUMPRODUCT((COUNTIF(A2:A${N},C2:C${M})=0)*C2:C${M})`,use:['COUNTIF|COUNTIFS|XMATCH|MATCH|ISNA|ISNUMBER'],bold:['E1'],
  text:bankSide?`Isi <code>F1</code> dengan total mutasi bank yang <b>tidak ada</b> di catatan buku.`:`Isi <code>F1</code> dengan total catatan buku yang <b>tidak ada</b> di mutasi bank.`,hint:'COUNTIF(daftar lain, daftar ini)=0 menandai yang tidak ditemukan; kalikan dengan nilainya lalu SUMPRODUCT, atau SUM(FILTER(…)).'}});
add('x-split','Expert','Gabungan audit','Mendeteksi pemecahan PO',r=>{const n=r.int(8,11),vs=r.sample(['PT Bina Karya','CV Sinar','UD Maju','PT Delta','CV Cahaya'],3),base=D(2026,r.int(1,11),r.int(1,20)),lim=25e6;
  const rows=Array.from({length:n},()=>[base+r.int(0,3),r.pick(vs),r.money(8e6,24e6,250000)]);const N=n+1;
  return{data:Object.assign(tbl(['Tanggal','Vendor','Nilai'],rows),{E1:'Limit per PO',F1:lim,E2:'PO dalam grup di atas limit'}),fmt:{A:'date'},cols:6,rows:N,target:'F2',solution:`=SUM(--(SUMIFS(C2:C${N},B2:B${N},B2:B${N},A2:A${N},A2:A${N})>F1))`,use:['SUMIFS|SUMPRODUCT|COUNTIFS|MAP|BYROW'],bold:['E1','E2'],
  text:`Setiap PO di bawah limit F1, tapi bisa jadi dipecah. Isi <code>F2</code> dengan jumlah PO yang total nilai <b>vendor yang sama di tanggal yang sama</b> melewati F1. Satu rumus.`,hint:'SUMIFS dengan kriteria berupa rentang (B2:B…, A2:A…) menghasilkan total grup untuk setiap baris. Bandingkan dengan F1, lalu hitung TRUE-nya.'}});
add('x-nomor-hilang','Expert','Gabungan audit','Daftar nomor yang hilang',r=>{const s=r.int(100,900)*10+1,len=r.int(12,18);const all=Array.from({length:len},(_,i)=>s+i);const miss=new Set(r.sample(all.slice(1,-1),r.int(1,4)));const have=all.filter(x=>!miss.has(x));const N=have.length+1;
  return{data:Object.assign(tbl(['No faktur'],have.map(v=>[v])),{C1:'Nomor hilang'}),cols:4,rows:N,target:'D1',solution:`=TEXTJOIN(", ",TRUE,FILTER(SEQUENCE(MAX(A2:A${N})-MIN(A2:A${N})+1,1,MIN(A2:A${N})),COUNTIF(A2:A${N},SEQUENCE(MAX(A2:A${N})-MIN(A2:A${N})+1,1,MIN(A2:A${N})))=0))`,use:['TEXTJOIN|CONCAT|ARRAYTOTEXT','SEQUENCE|ROW'],cs:true,bold:['C1'],
  text:`Nomor faktur seharusnya berurutan. Isi <code>D1</code> dengan semua nomor yang hilang, dipisah koma dan spasi (misalnya <i>1004, 1009</i>).`,hint:'SEQUENCE membuat semua nomor dari MIN sampai MAX. Saring yang COUNTIF-nya 0 dengan FILTER, lalu TEXTJOIN. LET membuat rumusnya lebih rapi.'}});

/* =============== tambahan 2: perpajakan, akuntansi, keuangan, audit (tingkat sulit) + variasi umum =============== */
const VENDOR=['PT Bina Karya','CV Sinar Abadi','UD Maju Jaya','PT Delta Niaga','CV Cahaya Timur','PT Arunika','PT Sentosa Prima','CV Mitra Usaha'];
const PTKP=[['TK/0',54e6],['TK/1',58.5e6],['TK/2',63e6],['TK/3',67.5e6],['K/0',58.5e6],['K/1',63e6],['K/2',67.5e6],['K/3',72e6]];
const LAPIS=[[0,.05],[60e6,.15],[250e6,.25],[500e6,.30],[5e9,.35]];

// ---------- PERPAJAKAN
add('ppn-dpp-lain','Menengah','Perpajakan','PPN dengan DPP nilai lain',r=>{const h=r.money(1e6,250e6,10000);const v=r.pick(['ppn','total','balik']);
  if(v==='balik'){const tot=Math.round(h*1.11);return{data:{A1:'Harga termasuk PPN',B1:tot,A2:'Tarif efektif PPN',B2:.11,A3:'DPP (harga jual)'},fmt:{B2:'pct'},cols:3,rows:4,target:'B3',solution:'=ROUND(B1/(1+B2),0)',use:['ROUND'],bold:['A3'],
    text:`Kuitansi hanya mencantumkan harga yang <b>sudah termasuk</b> PPN. Isi <code>B3</code> dengan harga jual sebelum PPN, dibulatkan ke rupiah penuh.`,hint:'Harga termasuk PPN ÷ (1 + tarif), lalu ROUND(…, 0). Jangan dikali (1 − tarif).'}}
  return{data:{A1:'Harga jual',B1:h,A2:'Tarif PPN',B2:.12,A3:'Faktor DPP nilai lain',B3:'=11/12',A4:v==='ppn'?'PPN terutang':'Total tagihan'},fmt:{B2:'pct'},cols:3,rows:5,target:'B4',solution:v==='ppn'?'=ROUND(B1*B3*B2,0)':'=B1+ROUND(B1*B3*B2,0)',use:['ROUND'],bold:['A4'],
    text:v==='ppn'?`Untuk barang non-mewah, PPN 12% dihitung dari DPP nilai lain = 11/12 × harga jual. Isi <code>B4</code> dengan PPN terutang, dibulatkan ke rupiah penuh.`:`PPN 12% dihitung dari DPP nilai lain (11/12 × harga jual). Isi <code>B4</code> dengan total tagihan: harga jual + PPN (PPN dibulatkan ke rupiah penuh).`,hint:'PPN = ROUND(harga × B3 × tarif, 0). Hasil efektifnya 11% dari harga jual.'}});
add('pph21-pkp','Advanced','Perpajakan','PKP PPh 21 setahun',r=>{const st=r.pick(PTKP),gaji=r.money(5e6,40e6,50000),thr=r.chance(.6)?gaji:0,pensiun=Math.round(gaji*r.pick([0,.01,.02])/1000)*1000;const v=r.pick(['neto','pkp','pkp']);
  const d={A1:'Gaji per bulan',B1:gaji,A2:'THR/bonus setahun',B2:thr,A3:'Iuran pensiun per bulan',B3:pensiun,A4:'Status PTKP',B4:st[0],A5:'Biaya jabatan',B5:.05,A6:'Maks. biaya jabatan setahun',B6:6e6,A8:v==='neto'?'Penghasilan neto setahun':'PKP setahun',D1:'Status',E1:'PTKP'};PTKP.forEach((p,i)=>{d['D'+(i+2)]=p[0];d['E'+(i+2)]=p[1]});
  const bruto='(B1*12+B2)',neto=`${bruto}-MIN(${bruto}*B5,B6)-B3*12`;
  return{data:d,fmt:{B5:'pct'},cols:5,rows:9,target:'B8',solution:v==='neto'?'='+neto:`=ROUNDDOWN(MAX(0,${neto}-XLOOKUP(B4,D2:D9,E2:E9)),-3)`,use:v==='neto'?['MIN|IF']:['MIN|IF','XLOOKUP|VLOOKUP|INDEX|LOOKUP','ROUNDDOWN|FLOOR|FLOOR.MATH|INT|TRUNC'],bold:['A8','D1','E1'],
    text:v==='neto'?`Bruto setahun = gaji × 12 + THR. Biaya jabatan 5% dari bruto, maksimal B6. Isi <code>B8</code> dengan penghasilan neto setahun (bruto − biaya jabatan − iuran pensiun setahun).`
      :`Isi <code>B8</code> dengan Penghasilan Kena Pajak setahun: bruto (gaji × 12 + THR) − biaya jabatan (5%, maks. B6) − iuran pensiun setahun − PTKP sesuai status di B4. Bulatkan <b>ke bawah</b> ke ribuan, dan kalau hasilnya negatif tulis 0.`,
    hint:'Biaya jabatan: MIN(bruto × 5%, 6.000.000). PTKP: XLOOKUP(B4, D2:D9, E2:E9). Lalu ROUNDDOWN(MAX(0, …), -3).'}});
add('pph23','Advanced','Perpajakan','PPh 23 per tagihan vendor',r=>{const n=r.int(5,8);const J=[['Jasa teknik',.02],['Sewa alat',.02],['Jasa konsultan',.02],['Royalti',.15],['Bunga pinjaman',.15]];const rows=Array.from({length:n},()=>[r.pick(VENDOR),r.pick(J)[0],r.money(2e6,150e6,50000),r.pick(['Ya','Ya','Tidak'])]);const N=n+1;
  const d=Object.assign(tbl(['Vendor','Jenis','DPP','NPWP','PPh 23'],rows),{G1:'Jenis',H1:'Tarif'});J.forEach((j,i)=>{d['G'+(i+2)]=j[0];d['H'+(i+2)]=j[1]});
  return{data:d,fmt:{H:'pct'},cols:8,rows:Math.max(N,6),target:'E2',fill:col('E',3,N),solution:'=C2*XLOOKUP(B2,$G$2:$G$6,$H$2:$H$6)*IF(D2="Tidak",2,1)',use:['XLOOKUP|VLOOKUP|INDEX|LOOKUP','IF|IFS|SWITCH|CHOOSE'],abs:'\\$G\\$2',absMsg:'Tabel tarif G2:H6 perlu dikunci dengan $ supaya tidak bergeser saat disalin.',bold:['G1','H1'],
    text:`Isi <code>E2</code> dengan PPh 23 yang dipotong: DPP × tarif sesuai jenis (tabel G–H). Vendor <b>tanpa NPWP</b> dipotong <b>dua kali</b> tarifnya. Kunci tabel tarif, lalu Salin ke bawah.`,hint:'C2 × XLOOKUP(B2, $G$2:$G$6, $H$2:$H$6) × IF(D2="Tidak", 2, 1).'}});
add('umkm-final','Advanced','Perpajakan','PPh final UMKM dengan omzet tidak kena pajak',r=>{const om=Array.from({length:12},()=>r.money(30e6,110e6,500000));let cum=0,cross=12;for(let i=0;i<12;i++){cum+=om[i];if(cum>500e6){cross=i;break}}if(cum<=500e6){om[11]+=520e6-cum;cross=11}
  const i=Math.min(11,r.chance(.6)?cross:r.int(cross,11)),t=i+2,BL=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return{data:Object.assign(tbl(['Bulan','Omzet','PPh final'],om.map((v,k)=>[BL[k],v])),{E1:'Omzet tidak kena pajak',F1:500e6,E2:'Tarif',F2:.005}),fmt:{F2:'pct'},cols:6,rows:13,target:'C'+t,solution:`=(MAX(0,SUM($B$2:B${t})-$F$1)-MAX(0,SUM($B$2:B${t})-B${t}-$F$1))*$F$2`,use:['MAX|IF|MIN','SUM'],bold:['E1','E2'],
    text:`Wajib pajak orang pribadi UMKM bebas pajak untuk omzet <b>kumulatif</b> sampai F1 per tahun; kelebihannya kena tarif F2. Isi <code>C${t}</code> dengan PPh final bulan <b>${BL[i]}</b>: hanya bagian omzet bulan itu yang melewati batas kumulatif.`,hint:`Bagian kena pajak = MAX(0, kumulatif s.d. bulan ini − F1) − MAX(0, kumulatif s.d. bulan lalu − F1). Kumulatif s.d. bulan lalu = SUM($B$2:B${t}) − B${t}.`}});
add('ppn-kurang-bayar','Advanced','Perpajakan','PPN kurang atau lebih bayar',r=>{const n=r.int(8,12);const rows=Array.from({length:n},(_,i)=>{const k=r.chance(.5);return['FP-'+(1000+r.int(0,8999)),k?'Keluaran':'Masukan',r.money(5e6,180e6,100000),k?'-':r.pick(['Ya','Ya','Ya','Tidak'])]});rows[0][1]='Keluaran';rows[0][3]='-';rows[1][1]='Masukan';rows[1][3]='Ya';const N=n+1;
  return{data:Object.assign(tbl(['No faktur','Jenis','DPP','Dapat dikreditkan'],rows),{F1:'Tarif efektif PPN',G1:.11,F2:'PPN kurang (lebih) bayar'}),fmt:{G1:'pct'},cols:7,rows:N,target:'G2',solution:`=(SUMIFS(C2:C${N},B2:B${N},"Keluaran")-SUMIFS(C2:C${N},B2:B${N},"Masukan",D2:D${N},"Ya"))*G1`,use:['SUMIFS|SUMPRODUCT|SUMIF|FILTER'],bold:['F1','F2'],
    text:`Isi <code>G2</code> dengan PPN yang harus disetor: PPN Keluaran dikurangi PPN Masukan yang <b>dapat dikreditkan</b> saja (kolom D = Ya). Hasil negatif berarti lebih bayar.`,hint:'(Total DPP Keluaran − total DPP Masukan yang D="Ya") × G1. Pakai SUMIFS dengan dua syarat untuk Masukan.'}});
add('x-pph-lapis-tarif','Expert','Gabungan pajak','PPh progresif berlapis',r=>{const pkp=r.pick([r.money(20e6,59e6,1000),r.money(61e6,249e6,1000),r.money(251e6,499e6,1000),r.money(501e6,2e9,1000),r.money(5.1e9,8e9,1000)]);const bl=r.chance(.35);
  const d={A1:'PKP setahun',B1:pkp,A2:bl?'PPh 21 per bulan':'PPh terutang setahun',D1:'Lapisan dari',E1:'Tarif'};LAPIS.forEach((l,i)=>{d['D'+(i+2)]=l[0];d['E'+(i+2)]=l[1]});
  const core='SUMPRODUCT(--(B1>D2:D6),B1-D2:D6,E2:E6-VSTACK(0,E2:E5))';
  return{data:d,fmt:{E:'pct'},cols:5,rows:6,target:'B2',solution:bl?`=ROUND(${core}/12,0)`:'='+core,use:null,bold:['A2','D1','E1'],
    text:`Tarif Pasal 17 berlaku <b>berlapis</b>: 5% untuk bagian PKP sampai 60 juta, 15% untuk bagian berikutnya sampai 250 juta, dan seterusnya (tabel D–E). Isi <code>B2</code> dengan ${bl?'PPh per bulan (PPh setahun ÷ 12, dibulatkan ke rupiah penuh)':'PPh terutang setahun'} dalam satu rumus.`,
    hint:'Cara ringkas: SUMPRODUCT(--(PKP>batas), PKP−batas, tarif − tarif lapisan sebelumnya). Tarif sebelumnya bisa dibuat dengan VSTACK(0, E2:E5). Cara lain: IF bertingkat atau penjumlahan MIN per lapisan.'}});
add('x-pph-badan-31e','Expert','Gabungan pajak','PPh badan dengan fasilitas 31E',r=>{const om=r.pick([r.money(1e9,4.7e9,1e6),r.money(5e9,49e9,1e6),r.money(51e9,90e9,1e6)]);const pkp=Math.round(om*(0.05+r.f()*0.15))+r.int(1,999);
  return{data:{A1:'Peredaran bruto',B1:om,A2:'PKP',B2:pkp,A3:'PPh badan terutang',D1:'Batas omzet fasilitas',E1:4.8e9,D2:'Batas omzet maksimal',E2:50e9,D3:'Tarif PPh badan',E3:.22,D4:'Pengurangan tarif',E4:.5},fmt:{E3:'pct',E4:'pct'},cols:5,rows:4,target:'B3',
    solution:'=LET(p,ROUNDDOWN(B2,-3),f,IF(B1>E2,0,MIN(1,E1/B1)),p*E3*(1-E4*f))',use:['IF|IFS|MIN|LET'],bold:['A3','D1','D2','D3','D4'],
    text:`Fasilitas Pasal 31E: kalau omzet ≤ E2, bagian PKP sebesar (E1 ÷ omzet) mendapat pengurangan tarif 50% (kalau omzet ≤ E1, seluruh PKP mendapat fasilitas). Omzet di atas E2 tidak mendapat fasilitas. PKP dibulatkan ke bawah ke ribuan. Isi <code>B3</code> dengan PPh badan terutang.`,
    hint:'Porsi fasilitas f = IF(omzet > E2, 0, MIN(1, E1/omzet)). PPh = PKP bulat × 22% × (1 − 50% × f). LET membuat rumusnya rapi.'}});

// ---------- AKUNTANSI
add('rata-tertimbang','Menengah','Akuntansi','Harga pokok rata-rata tertimbang',r=>{const n=r.int(3,6),base=r.money(8000,90000,500);const rows=Array.from({length:n},(_,i)=>[i===0?'Saldo awal':'Pembelian '+(i),r.int(20,300),Math.round(base*(0.9+r.f()*0.3)/50)*50]);const N=n+1;const v=r.pick(['avg','akhir','hpp']);const jual=r.int(10,rows.reduce((a,x)=>a+x[1],0)-5);
  const d=Object.assign(tbl(['Keterangan','Unit','Harga per unit'],rows),{E1:'Unit terjual',F1:jual,E2:v==='avg'?'Harga rata-rata per unit':v==='akhir'?'Nilai persediaan akhir':'HPP'});
  const avg=`SUMPRODUCT(B2:B${N},C2:C${N})/SUM(B2:B${N})`;
  return{data:d,cols:6,rows:N,target:'F2',solution:v==='avg'?'='+avg:v==='akhir'?`=(SUM(B2:B${N})-F1)*${avg}`:`=F1*${avg}`,use:['SUMPRODUCT|SUM|MMULT'],bold:['E1','E2'],
    text:v==='avg'?`Isi <code>F2</code> dengan harga pokok rata-rata tertimbang per unit.`:v==='akhir'?`Metode rata-rata tertimbang. Isi <code>F2</code> dengan nilai persediaan akhir: sisa unit (total unit − F1) × harga rata-rata.`:`Metode rata-rata tertimbang. Isi <code>F2</code> dengan HPP untuk F1 unit yang terjual.`,
    hint:'Harga rata-rata = SUMPRODUCT(unit, harga) ÷ SUM(unit).'}});
add('saldo-normal','Menengah','Akuntansi','Saldo sesuai saldo normal',r=>{const ak=[['Kas','Debit'],['Piutang usaha','Debit'],['Persediaan','Debit'],['Utang usaha','Kredit'],['Modal','Kredit'],['Pendapatan','Kredit'],['Beban gaji','Debit'],['Beban sewa','Debit']];const pk=r.sample(ak,r.int(5,7));const rows=pk.map(a=>{const x=r.money(5e6,200e6,100000),y=r.money(1e6,150e6,100000);return a[1]==='Debit'?[a[0],a[1],Math.max(x,y),Math.min(x,y)]:[a[0],a[1],Math.min(x,y),Math.max(x,y)]});const t=r.int(2,rows.length+1);
  return{data:tbl(['Akun','Saldo normal','Total debit','Total kredit','Saldo'],rows),cols:5,rows:rows.length+1,target:'E'+t,solution:`=IF(B${t}="Debit",C${t}-D${t},D${t}-C${t})`,use:['IF|IFS|SWITCH|CHOOSE'],
    text:`Isi <code>E${t}</code> dengan saldo akun <b>${rows[t-2][0]}</b> sesuai saldo normalnya: akun bersaldo normal Debit = debit − kredit, akun bersaldo normal Kredit = kredit − debit.`}});
add('akrual-bunga','Menengah','Akuntansi','Bunga deposito yang masih harus diterima',r=>{const p=r.money(50e6,2e9,1e6),b=r.pick([.0375,.045,.05,.055,.06]);const s=D(2026,r.int(1,11),r.int(1,28));const end=s+r.int(10,75);const basis=r.pick([365,360]);
  return{data:{A1:'Pokok deposito',B1:p,A2:'Bunga per tahun',B2:b,A3:'Tanggal penempatan',B3:s,A4:'Tanggal laporan',B4:end,A5:'Basis hari setahun',B5:basis,A6:'Bunga akrual'},fmt:{B2:'pct',B3:'date',B4:'date'},cols:3,rows:7,target:'B6',solution:'=ROUND(B1*B2*(B4-B3)/B5,0)',use:['ROUND'],bold:['A6'],
    text:`Isi <code>B6</code> dengan bunga yang sudah menjadi hak perusahaan sampai tanggal laporan: pokok × bunga × (jumlah hari ÷ basis hari), dibulatkan ke rupiah penuh.`,hint:'Jumlah hari = B4 − B3 (tanggal adalah angka). ROUND(…, 0).'}});
add('dibayar-dimuka','Advanced','Akuntansi','Amortisasi beban dibayar di muka',r=>{const bln=r.pick([6,12,12,24,36]),nil=r.money(6e6,240e6,bln*1000);const sy=2025+r.int(0,1),sm=r.int(1,12),start=D(sy,sm,1);const v=r.chance(.5);const k=v?r.int(1,bln+3):r.int(1,bln-1);const p=XL.fromSerial(start);const em=p.m-1+k;const rep=D(p.y+Math.floor((em)/12),(em%12)+1,1);const repEnd=rep-1;
  return{data:{A1:'Premi asuransi dibayar',B1:nil,A2:'Mulai berlaku',B2:start,A3:'Masa manfaat (bulan)',B3:bln,A4:'Tanggal laporan',B4:repEnd,A5:v?'Beban yang sudah diakui':'Sisa asuransi dibayar di muka'},fmt:{B2:'date',B4:'date'},cols:3,rows:6,target:'B5',
    solution:v?'=B1/B3*MIN(B3,DATEDIF(B2,B4,"m")+1)':'=B1-B1/B3*MIN(B3,DATEDIF(B2,B4,"m")+1)',use:['DATEDIF|YEAR|MONTH|YEARFRAC|EDATE','MIN|IF'],bold:['A5'],
    text:`Polis berlaku mulai tanggal 1 dan dibebankan rata setiap bulan; bulan yang sedang berjalan pada tanggal laporan (akhir bulan) dihitung penuh, dan beban tidak boleh melebihi masa manfaat. Isi <code>B5</code> dengan ${v?'total beban asuransi yang sudah diakui':'sisa asuransi dibayar di muka di neraca'} per tanggal B4.`,
    hint:'Bulan berjalan = DATEDIF(B2, B4, "m") + 1, dibatasi MIN(B3, …). Beban per bulan = B1 ÷ B3.'}});
add('susut-metode','Advanced','Akuntansi','Penyusutan saldo menurun dan jumlah angka tahun',r=>{const h=r.money(20e6,900e6,1e6),s=Math.round(h*r.pick([.05,.1,.15])/1e5)*1e5,u=r.pick([4,5,8,10]),k=r.int(1,Math.min(u,4));const m=r.pick([['DDB','saldo menurun ganda'],['SYD','jumlah angka tahun'],['DB','saldo menurun tetap']]);
  return{data:{A1:'Harga perolehan',B1:h,A2:'Nilai sisa',B2:s,A3:'Umur (tahun)',B3:u,A4:'Tahun ke-',B4:k,A5:'Penyusutan tahun itu'},cols:3,rows:6,target:'B5',solution:`=${m[0]}(B1,B2,B3,B4)`,use:[m[0]],bold:['A5'],
    text:`Isi <code>B5</code> dengan penyusutan tahun ke-${k} memakai metode <b>${m[1]}</b>.`,hint:`${m[0]}(harga, nilai sisa, umur, tahun ke-).`}});
add('laba-operasi','Advanced','Akuntansi','Laba dari daftar akun',r=>{const G=[['Pendapatan',['Penjualan','Pendapatan jasa']],['HPP',['HPP barang','Biaya angkut masuk']],['Beban operasional',['Beban gaji','Beban sewa','Beban listrik','Beban iklan']],['Lain-lain',['Pendapatan bunga','Beban bunga']]];
  const rows=[];G.forEach(g=>g[1].forEach(a=>rows.push([a,g[0],g[0]==='Pendapatan'?r.money(300e6,2e9,1e6):r.money(10e6,250e6,500000)])));const s=r.sample(rows,rows.length);const N=s.length+1;const v=r.pick(['kotor','operasi','margin']);
  return{data:Object.assign(tbl(['Akun','Kelompok','Saldo'],s),{E1:v==='kotor'?'Laba kotor':v==='operasi'?'Laba operasional':'Margin laba kotor'}),fmt:v==='margin'?{F1:'pct'}:undefined,cols:6,rows:N,target:'F1',
    solution:v==='kotor'?`=SUMIF(B2:B${N},"Pendapatan",C2:C${N})-SUMIF(B2:B${N},"HPP",C2:C${N})`:v==='operasi'?`=SUMIF(B2:B${N},"Pendapatan",C2:C${N})-SUMIF(B2:B${N},"HPP",C2:C${N})-SUMIF(B2:B${N},"Beban operasional",C2:C${N})`:`=(SUMIF(B2:B${N},"Pendapatan",C2:C${N})-SUMIF(B2:B${N},"HPP",C2:C${N}))/SUMIF(B2:B${N},"Pendapatan",C2:C${N})`,
    use:['SUMIF|SUMIFS|SUMPRODUCT|FILTER'],bold:['E1'],
    text:v==='kotor'?`Isi <code>F1</code> dengan laba kotor: total Pendapatan − total HPP.`:v==='operasi'?`Isi <code>F1</code> dengan laba operasional: Pendapatan − HPP − Beban operasional. Kelompok Lain-lain <b>tidak</b> ikut.`:`Isi <code>F1</code> dengan margin laba kotor: (Pendapatan − HPP) ÷ Pendapatan.`,hint:'SUMIF(kolom kelompok, "Pendapatan", kolom saldo), dan seterusnya.'}});
add('x-cadangan-umur','Expert','Gabungan akuntansi','Cadangan kerugian piutang per faktur',r=>{const n=r.int(7,11);const rows=Array.from({length:n},()=>['INV-'+r.int(1000,9999),r.money(2e6,90e6,50000),r.pick([0,r.int(1,30),r.int(31,60),r.int(61,90),r.int(91,200)])]);const N=n+1;const rt=[[0,.01],[1,.03],[31,.1],[61,.25],[91,.5]];
  const d=Object.assign(tbl(['Faktur','Saldo','Hari lewat'],rows),{F1:'Hari lewat dari',G1:'Estimasi tak tertagih',I1:'Cadangan'});rt.forEach((x,i)=>{d['F'+(i+2)]=x[0];d['G'+(i+2)]=x[1]});
  return{data:d,fmt:{G:'pct'},cols:10,rows:Math.max(N,6),target:'J1',solution:`=SUM(MAP(C2:C${N},B2:B${N},LAMBDA(h,s,s*XLOOKUP(h,F2:F6,G2:G6,,-1))))`,use:null,bold:['F1','G1','I1'],
    text:`Isi <code>J1</code> dengan total cadangan kerugian piutang dalam <b>satu rumus</b>: setiap saldo dikali persentase estimasi sesuai kelompok hari lewatnya (tabel F–G, batas bawah).`,hint:'Per faktur: saldo × XLOOKUP(hari, F2:F6, G2:G6, , -1). Untuk semua baris sekaligus pakai SUM(MAP(…, LAMBDA(…))).'}});
add('x-fifo','Expert','Gabungan akuntansi','HPP metode FIFO',r=>{const n=r.int(3,5),base=r.money(10000,80000,500);const rows=Array.from({length:n},(_,i)=>[i===0?'Saldo awal':'Beli '+tgl(D(2026,r.int(1,6)+i,r.int(1,28))),r.int(20,150),Math.round(base*(1+i*0.04+r.f()*0.05)/50)*50]);const tot=rows.reduce((a,x)=>a+x[1],0);const q=r.int(rows[0][1]+1,tot-1);const N=n+1;const v=r.chance(.5);
  const take=`LET(q,B2:B${N},cum,SCAN(0,q,LAMBDA(a,x,a+x)),ambil,IF(F1>=cum,q,IF(F1>cum-q,F1-(cum-q),0)),SUMPRODUCT(ambil,C2:C${N}))`;
  return{data:Object.assign(tbl(['Lapisan','Unit','Harga per unit'],rows),{E1:'Unit terjual',F1:q,E2:v?'HPP (FIFO)':'Persediaan akhir (FIFO)'}),cols:6,rows:N,target:'F2',solution:v?'='+take:`=SUMPRODUCT(B2:B${N},C2:C${N})-${take}`,use:null,bold:['E1','E2'],
    text:`Barang keluar memakai metode <b>FIFO</b>: unit yang terjual diambil dari lapisan paling awal dulu. Isi <code>F2</code> dengan ${v?'HPP untuk F1 unit terjual':'nilai persediaan akhir setelah F1 unit terjual'} dalam satu rumus.`,
    hint:'Kumulatif unit per lapisan: SCAN(0, B2:B…, LAMBDA(a,x,a+x)). Unit yang diambil dari tiap lapisan = semua unit kalau kumulatifnya ≤ F1, sisanya saja untuk lapisan yang terpotong, 0 setelahnya. Kalikan dengan harga lalu jumlahkan.'}});
add('x-nilai-buku-ddb','Expert','Gabungan akuntansi','Nilai buku setelah beberapa tahun (saldo menurun)',r=>{const h=r.money(50e6,900e6,1e6),s=Math.round(h*r.pick([.05,.1])/1e5)*1e5,u=r.pick([4,5,8]),k=r.int(2,u-1);
  return{data:{A1:'Harga perolehan',B1:h,A2:'Nilai sisa',B2:s,A3:'Umur (tahun)',B3:u,A4:'Sudah dipakai (tahun)',B4:k,A5:'Nilai buku'},cols:3,rows:6,target:'B5',solution:'=B1-SUM(MAP(SEQUENCE(B4),LAMBDA(t,DDB(B1,B2,B3,t))))',use:null,bold:['A5'],
    text:`Metode <b>saldo menurun ganda</b> (tanpa beralih ke garis lurus). Isi <code>B5</code> dengan nilai buku setelah dipakai B4 tahun, dalam satu rumus.`,hint:'Akumulasi = jumlah DDB tahun 1 sampai B4: SUM(MAP(SEQUENCE(B4), LAMBDA(t, DDB(B1,B2,B3,t)))). Cara lain: VDB(B1,B2,B3,0,B4,2,TRUE).'}});

// ---------- KEUANGAN
add('npv-irr','Advanced','Keuangan','Kelayakan proyek: NPV atau IRR',r=>{const n=r.int(4,7),inv=r.money(100e6,2e9,10e6);const rows=[['Tahun 0',-inv]];for(let i=1;i<=n;i++)rows.push(['Tahun '+i,Math.round(inv*(0.15+r.f()*0.25)/1e6)*1e6]);const N=rows.length+1;const rate=r.pick([.08,.1,.12,.14]);const v=r.pick(['npv','irr']);
  return{data:Object.assign(tbl(['Periode','Arus kas'],rows),{D1:'Biaya modal',E1:rate,D2:v==='npv'?'NPV':'IRR'}),fmt:v==='irr'?{E1:'pct',E2:'pct'}:{E1:'pct'},cols:5,rows:N,target:'E2',solution:v==='npv'?`=B2+NPV(E1,B3:B${N})`:`=IRR(B2:B${N})`,use:[v==='npv'?'NPV|XNPV|SUMPRODUCT':'IRR|RATE|XIRR'],bold:['D1','D2'],
    text:v==='npv'?`Investasi dibayar di awal (tahun 0), arus kas masuk di akhir tiap tahun. Isi <code>E2</code> dengan NPV proyek memakai biaya modal E1.`:`Isi <code>E2</code> dengan IRR proyek (tahun 0 sampai tahun terakhir).`,
    hint:v==='npv'?'Fungsi NPV menganggap arus kas pertama terjadi akhir periode 1, jadi tahun 0 ditambahkan di luar: B2 + NPV(E1, B3:B…).':'IRR(seluruh arus kas, termasuk tahun 0).'}});
add('cicilan-rinci','Advanced','Keuangan','Bunga, pokok, dan sisa pinjaman',r=>{const p=r.money(20e6,900e6,1e6),b=r.pick([.06,.08,.095,.11,.13]),n=r.pick([24,36,60,120,180]),k=r.int(2,Math.min(n-1,36));const v=r.pick(['ipmt','ppmt','sisa','bungatahun']);
  const L={ipmt:['Bunga cicilan ke-k','=-IPMT(B2/12,B4,B3,B1)','IPMT|CUMIPMT',`porsi <b>bunga</b> di cicilan ke-${k}`],ppmt:['Pokok cicilan ke-k','=-PPMT(B2/12,B4,B3,B1)','PPMT|CUMPRINC',`porsi <b>pokok</b> di cicilan ke-${k}`],sisa:['Sisa pokok','=B1+CUMPRINC(B2/12,B3,B1,1,B4,0)','CUMPRINC|FV|PPMT',`<b>sisa pokok</b> setelah cicilan ke-${k} dibayar`],bungatahun:['Bunga tahun ke-'+Math.ceil(k/12),`=-CUMIPMT(B2/12,B3,B1,${(Math.ceil(k/12)-1)*12+1},${Math.ceil(k/12)*12},0)`,'CUMIPMT|IPMT',`total <b>bunga</b> yang dibayar selama tahun ke-${Math.ceil(k/12)} (cicilan ${(Math.ceil(k/12)-1)*12+1}–${Math.ceil(k/12)*12})`]}[v];
  if(v==='bungatahun'&&Math.ceil(k/12)*12>n)return{data:{A1:'Pokok',B1:p,A2:'Bunga per tahun',B2:b,A3:'Tenor (bulan)',B3:n,A4:'Cicilan ke-',B4:k,A5:'Bunga cicilan ke-k'},fmt:{B2:'pct'},cols:3,rows:6,target:'B5',solution:'=-IPMT(B2/12,B4,B3,B1)',use:['IPMT|CUMIPMT'],bold:['A5'],text:`Cicilan anuitas bulanan. Isi <code>B5</code> dengan porsi <b>bunga</b> di cicilan ke-${k} (sebagai angka positif).`,hint:'IPMT(bunga/12, cicilan ke-, tenor, pokok) bernilai negatif; beri tanda minus.'};
  return{data:{A1:'Pokok',B1:p,A2:'Bunga per tahun',B2:b,A3:'Tenor (bulan)',B3:n,A4:'Cicilan ke-',B4:k,A5:L[0]},fmt:{B2:'pct'},cols:3,rows:6,target:'B5',solution:L[1],use:[L[2]],bold:['A5'],
    text:`Cicilan anuitas bulanan. Isi <code>B5</code> dengan ${L[3]}, sebagai angka positif.`,hint:'Fungsi kredit Excel mengembalikan nilai negatif untuk uang keluar; beri tanda minus. Bunga per bulan = B2/12.'}});
add('nper-target','Menengah','Keuangan','Berapa bulan menabung',r=>{const s=r.money(500000,8e6,100000),b=r.pick([.03,.045,.05,.06]),tg=r.money(20e6,600e6,1e6),a=r.chance(.5)?r.money(1e6,30e6,500000):0;
  return{data:{A1:'Setoran per bulan',B1:s,A2:'Imbal hasil per tahun',B2:b,A3:'Saldo awal',B3:a,A4:'Target dana',B4:tg,A5:'Lama menabung (bulan)'},fmt:{B2:'pct'},cols:3,rows:6,target:'B5',solution:'=ROUNDUP(NPER(B2/12,-B1,-B3,B4),0)',use:['NPER','ROUNDUP|CEILING|CEILING.MATH'],bold:['A5'],
    text:`Isi <code>B5</code> dengan jumlah bulan sampai dana mencapai target, dibulatkan <b>ke atas</b> ke bulan penuh.`,hint:'NPER(bunga/12, −setoran, −saldo awal, target), lalu ROUNDUP(…, 0).'}});
add('bunga-efektif','Menengah','Keuangan','Bunga nominal dan efektif',r=>{const v=r.pick(['effect','nominal','flat']);const b=r.pick([.06,.08,.1,.12,.15,.18]);const m=r.pick([[12,'bulanan'],[4,'triwulanan'],[2,'semesteran']]);
  if(v==='flat'){const p=r.money(10e6,300e6,1e6),n=r.pick([12,24,36]);return{data:{A1:'Pinjaman',B1:p,A2:'Bunga flat per tahun',B2:b,A3:'Tenor (bulan)',B3:n,A4:'Cicilan per bulan'},fmt:{B2:'pct'},cols:3,rows:5,target:'B4',solution:'=B1/B3+B1*B2/12',bold:['A4'],
    text:`Bunga <b>flat</b> dihitung dari pokok awal sepanjang tenor. Isi <code>B4</code> dengan cicilan per bulan: pokok dibagi tenor + bunga flat per bulan.`,hint:'B1/B3 + B1×B2/12.'}}
  return v==='effect'?{data:{A1:'Bunga nominal per tahun',B1:b,A2:'Periode majemuk per tahun',B2:m[0],A3:'Bunga efektif per tahun'},fmt:{B1:'pct',B3:'pct'},cols:3,rows:4,target:'B3',solution:'=EFFECT(B1,B2)',use:['EFFECT'],bold:['A3'],text:`Bunga dimajemukkan ${m[1]}. Isi <code>B3</code> dengan bunga efektif per tahun.`,hint:'EFFECT(nominal, jumlah periode).'}
    :{data:{A1:'Bunga efektif per tahun',B1:b,A2:'Periode majemuk per tahun',B2:m[0],A3:'Bunga nominal per tahun'},fmt:{B1:'pct',B3:'pct'},cols:3,rows:4,target:'B3',solution:'=NOMINAL(B1,B2)',use:['NOMINAL'],bold:['A3'],text:`Produk investasi menyebut imbal hasil efektif. Isi <code>B3</code> dengan bunga nominal per tahun kalau dimajemukkan ${m[1]}.`,hint:'NOMINAL(efektif, jumlah periode).'}});
add('bep','Menengah','Keuangan','Titik impas',r=>{const fc=r.money(20e6,500e6,1e6),p=r.money(20000,900000,1000),vc=Math.round(p*(0.35+r.f()*0.4)/500)*500;const v=r.pick(['unit','rp','laba']);const tg=r.money(10e6,200e6,1e6);
  const d={A1:'Biaya tetap per bulan',B1:fc,A2:'Harga jual per unit',B2:p,A3:'Biaya variabel per unit',B3:vc};if(v==='laba'){d.A4='Target laba';d.B4=tg}d.A5=v==='rp'?'Titik impas (Rp)':v==='unit'?'Titik impas (unit)':'Unit untuk target laba';
  return{data:d,cols:3,rows:6,target:'B5',solution:v==='unit'?'=ROUNDUP(B1/(B2-B3),0)':v==='rp'?'=B1/(1-B3/B2)':'=ROUNDUP((B1+B4)/(B2-B3),0)',use:v==='rp'?null:['ROUNDUP|CEILING|CEILING.MATH'],bold:['A5'],
    text:v==='unit'?`Isi <code>B5</code> dengan jumlah unit minimal yang harus terjual supaya tidak rugi, dibulatkan ke atas.`:v==='rp'?`Isi <code>B5</code> dengan titik impas dalam rupiah penjualan: biaya tetap ÷ rasio margin kontribusi.`:`Isi <code>B5</code> dengan jumlah unit yang harus terjual untuk mencapai target laba B4, dibulatkan ke atas.`,
    hint:'Margin kontribusi per unit = harga − biaya variabel. Rasio margin kontribusi = 1 − biaya variabel ÷ harga.'}});
add('rasio-lapkeu','Advanced','Keuangan','Rasio laporan keuangan',r=>{const pj=r.money(2e9,40e9,1e8),hpp=Math.round(pj*(0.55+r.f()*0.2)/1e6)*1e6,lb=Math.round(pj*(0.03+r.f()*0.1)/1e6)*1e6;const pi=[r.money(2e8,6e9,1e7),r.money(2e8,6e9,1e7)],ps=[r.money(2e8,5e9,1e7),r.money(2e8,5e9,1e7)],ek=[r.money(1e9,20e9,1e8),r.money(1e9,20e9,1e8)],ut=[r.money(5e8,15e9,1e8),r.money(5e8,15e9,1e8)];
  const R=[['roe','ROE (laba bersih ÷ rata-rata ekuitas)','=C4/AVERAGE(B7:C7)','pct'],['dso','Hari rata-rata penagihan piutang (pakai 365 hari)','=AVERAGE(B5:C5)/C2*365',null],['ito','Perputaran persediaan (HPP ÷ rata-rata persediaan)','=C3/AVERAGE(B6:C6)',null],['dio','Hari rata-rata persediaan (pakai 365 hari)','=365/(C3/AVERAGE(B6:C6))',null],['der','Rasio utang terhadap ekuitas akhir tahun','=C8/C7',null],['npm','Margin laba bersih','=C4/C2','pct']];const x=r.pick(R);
  return{data:{A1:'Pos',B1:'2025',C1:'2026',A2:'Penjualan',C2:pj,A3:'HPP',C3:hpp,A4:'Laba bersih',C4:lb,A5:'Piutang usaha',B5:pi[0],C5:pi[1],A6:'Persediaan',B6:ps[0],C6:ps[1],A7:'Ekuitas',B7:ek[0],C7:ek[1],A8:'Total utang',B8:ut[0],C8:ut[1],E1:x[1]},fmt:x[3]?{E2:'pct'}:undefined,cols:7,rows:8,target:'E2',solution:x[2],use:null,bold:['E1'],
    text:`Laba rugi (baris 2–4) hanya untuk tahun 2026. Pos neraca tersedia untuk akhir 2025 dan 2026; "rata-rata" berarti rata-rata saldo kedua tahun. Isi <code>E2</code> dengan <b>${x[1]}</b>.`,hint:'Rata-rata saldo = AVERAGE(saldo 2025, saldo 2026).'}});
add('x-payback','Expert','Gabungan keuangan','Payback period dengan pecahan tahun',r=>{const n=r.int(5,7),inv=r.money(200e6,3e9,10e6);const rows=[['Tahun 0',-inv]];for(let i=1;i<=n;i++)rows.push(['Tahun '+i,Math.round(inv*(0.12+r.f()*0.3)/1e6)*1e6]);let c=0;rows.forEach(x=>c+=x[1]);if(c<=0)rows[n][1]+=-c+inv*0.2;const N=rows.length+1;const disc=r.chance(.35);const rate=r.pick([.08,.1,.12]);
  if(disc){let c2=0;rows.forEach((x,i)=>{c2+=x[1]/Math.pow(1+rate,i)});if(c2<=0)rows[n][1]+=Math.round((-c2*Math.pow(1+rate,n)+inv*0.3)/1e6)*1e6}
  const cf=disc?`B2:B${N}/(1+E1)^SEQUENCE(${N-1},1,0)`:`B2:B${N}`;
  return{data:Object.assign(tbl(['Periode','Arus kas'],rows),disc?{D1:'Tingkat diskonto',E1:rate,D2:'Discounted payback (tahun)'}:{D2:'Payback period (tahun)'}),fmt:disc?{E1:'pct'}:undefined,cols:5,rows:N,target:'E2',
    solution:`=LET(cf,${cf},cum,SCAN(0,cf,LAMBDA(a,x,a+x)),p,XMATCH(TRUE,cum>=0),p-2+(-INDEX(cum,p-1))/INDEX(cf,p))`,use:null,bold:['D1','D2'],
    text:`Isi <code>E2</code> dengan ${disc?'<b>discounted</b> payback period (arus kas didiskonto dengan E1 sesuai tahunnya)':'payback period'} dalam tahun, termasuk pecahan tahun (misalnya 3,4 tahun). Asumsikan arus kas masuk merata sepanjang tahun.`,
    hint:'Kumulatif arus kas dengan SCAN. Cari posisi pertama yang ≥ 0 (XMATCH(TRUE, kumulatif>=0)). Payback = tahun sebelumnya + sisa kekurangan ÷ arus kas tahun itu.'}});
add('x-xirr','Expert','Gabungan keuangan','Imbal hasil dengan tanggal tidak beraturan',r=>{const n=r.int(4,7),st=D(2025,r.int(1,12),r.int(1,28)),inv=r.money(50e6,900e6,1e6);const ds=[st];for(let i=1;i<n;i++)ds.push(ds[i-1]+r.int(40,200));const rows=ds.map((d,i)=>[d,i===0?-inv:Math.round(inv*(0.2+r.f()*0.35)/1e5)*1e5]);const N=n+1;const v=r.chance(.5);const rate=r.pick([.08,.1,.12]);
  return{data:Object.assign(tbl(['Tanggal','Arus kas'],rows),v?{D2:'XIRR (4 desimal)'}:{D1:'Tingkat diskonto',E1:rate,D2:'XNPV (rupiah penuh)'}),fmt:Object.assign({A:'date'},v?{}:{E1:'pct'}),cols:5,rows:N,target:'E2',
    solution:v?`=ROUND(XIRR(B2:B${N},A2:A${N}),4)`:`=ROUND(XNPV(E1,B2:B${N},A2:A${N}),0)`,use:[v?'XIRR':'XNPV','ROUND'],bold:['D1','D2'],
    text:v?`Arus kas investasi terjadi pada tanggal yang tidak beraturan. Isi <code>E2</code> dengan imbal hasil tahunannya, dibulatkan 4 desimal (0,1234 berarti 12,34%).`:`Arus kas terjadi pada tanggal yang tidak beraturan. Isi <code>E2</code> dengan nilai sekarang bersih memakai tingkat diskonto E1, dibulatkan ke rupiah penuh.`,
    hint:v?'XIRR(nilai, tanggal) lalu ROUND(…, 4). IRR biasa salah karena menganggap jaraknya sama.':'XNPV(tingkat, nilai, tanggal) lalu ROUND(…, 0).'}});
add('x-varians-anggaran','Expert','Gabungan keuangan','Pos anggaran yang perlu dijelaskan',r=>{const n=r.int(7,11),cs=r.sample(['Gaji','Lembur','Listrik','Sewa','Perjalanan dinas','ATK','Konsumsi','Pemasaran','Pelatihan','Perawatan','Telepon','Asuransi'],n);const rows=cs.map(c=>{const a=r.money(5e6,300e6,500000);return[c,a,Math.round(a*(0.7+r.f()*0.6)/1e5)*1e5]});const pc=r.pick([.1,.15,.2]),mn=r.pick([5e6,10e6,20e6]);const jj=r.int(0,n-1);rows[jj]=[rows[jj][0],200e6,Math.round(200e6*(1+pc+.1))];const N=n+1;const v=r.chance(.5);
  const cond=`(ABS(C2:C${N}-B2:B${N})/B2:B${N}>F1)*(ABS(C2:C${N}-B2:B${N})>F2)`;
  return{data:Object.assign(tbl(['Pos','Anggaran','Realisasi'],rows),{E1:'Batas selisih (%)',F1:pc,E2:'Batas selisih (Rp)',F2:mn,E3:v?'Jumlah pos':'Daftar pos'}),fmt:{F1:'pct'},cols:6,rows:N,target:'F3',
    solution:v?`=SUMPRODUCT(${cond})`:`=TEXTJOIN(", ",TRUE,IF(${cond},A2:A${N},""))`,use:v?['SUMPRODUCT|SUM|COUNT|FILTER|ROWS','ABS|IF|OR']:['TEXTJOIN|CONCAT|ARRAYTOTEXT','IF|FILTER'],cs:!v,bold:['E1','E2','E3'],
    text:`Pos yang wajib diberi penjelasan adalah yang selisih realisasi vs anggarannya (lebih <b>atau</b> kurang) melewati F1 dari anggaran <b>dan</b> melewati F2 rupiah. Isi <code>F3</code> dengan ${v?'jumlah pos tersebut':'nama pos-pos tersebut dipisah koma dan spasi (kosongkan kalau tidak ada)'}.`,
    hint:'Selisih absolut: ABS(realisasi − anggaran). Dua syarat dikalikan: (ABS(…)/anggaran > F1) * (ABS(…) > F2).'}});

// ---------- AUDIT
add('audit-akhir-pekan','Menengah','Audit','Transaksi di akhir pekan',r=>{const n=r.int(10,15),st=D(2026,r.int(1,11),r.int(1,10));const rows=Array.from({length:n},()=>['BKK-'+r.int(1000,9999),st+r.int(0,20),r.money(250000,40e6,50000)]);const N=n+1;const v=r.chance(.5);
  return{data:Object.assign(tbl(['No bukti','Tanggal','Nilai'],rows),{E1:v?'Jumlah transaksi akhir pekan':'Nilai transaksi akhir pekan'}),fmt:{B:'date'},cols:6,rows:N,target:'F1',solution:v?`=SUMPRODUCT(--(WEEKDAY(B2:B${N},2)>5))`:`=SUMPRODUCT((WEEKDAY(B2:B${N},2)>5)*C2:C${N})`,use:['WEEKDAY','SUMPRODUCT|SUM|FILTER|COUNT'],bold:['E1'],
    text:`Kantor tutup Sabtu–Minggu, jadi pengeluaran di hari itu perlu diperiksa. Isi <code>F1</code> dengan ${v?'jumlah transaksi':'total nilai transaksi'} yang tanggalnya jatuh di <b>Sabtu atau Minggu</b>.`,hint:'WEEKDAY(tanggal, 2) memberi 6 untuk Sabtu dan 7 untuk Minggu. Ubah syaratnya jadi 1/0 lalu SUMPRODUCT.'}});
add('audit-angka-bulat','Menengah','Audit','Nominal yang terlalu bulat',r=>{const n=r.int(10,15);const kel=r.pick([1e6,5e5,1e7]);const rows=Array.from({length:n},()=>['BKK-'+r.int(1000,9999),r.chance(.3)?r.int(1,40)*kel:r.money(150000,40e6,1000)+r.pick([0,250,500,750])]);const N=n+1;const v=r.chance(.5);
  return{data:Object.assign(tbl(['No bukti','Nilai'],rows),{D1:'Kelipatan',E1:kel,D2:v?'Jumlah transaksi bulat':'Porsi transaksi bulat'}),fmt:v?undefined:{E2:'pct'},cols:5,rows:N,target:'E2',solution:v?`=SUMPRODUCT(--(MOD(B2:B${N},E1)=0))`:`=SUMPRODUCT(--(MOD(B2:B${N},E1)=0))/COUNT(B2:B${N})`,use:['MOD','SUMPRODUCT|SUM|FILTER|COUNT'],bold:['D1','D2'],
    text:`Nominal yang persis kelipatan E1 sering berupa estimasi atau rekayasa. Isi <code>E2</code> dengan ${v?'jumlah transaksi':'persentase transaksi'} yang nilainya kelipatan tepat E1.`,hint:'MOD(nilai, E1)=0 berarti kelipatan. Hitung TRUE-nya dengan SUMPRODUCT(--(…)).'}});
add('audit-materialitas','Menengah','Audit','Materialitas laporan keuangan',r=>{const lb=r.money(1e9,40e9,1e8),pd=r.money(20e9,400e9,1e9),as=r.money(30e9,600e9,1e9);const pm=r.pick([.5,.6,.75]);const v=r.chance(.5);
  return{data:{A1:'Tolok ukur',B1:'Nilai',C1:'Persentase',A2:'Laba sebelum pajak',B2:lb,C2:.05,A3:'Pendapatan',B3:pd,C3:.01,A4:'Total aset',B4:as,C4:.01,E1:'Performance materiality',F1:pm,E2:v?'Materialitas keseluruhan':'Performance materiality (Rp)'},fmt:{C:'pct',F1:'pct'},cols:6,rows:4,target:'F2',
    solution:v?'=MIN(B2*C2,B3*C3,B4*C4)':'=MIN(B2*C2,B3*C3,B4*C4)*F1',use:['MIN|SMALL|SUMPRODUCT'],bold:['A1','B1','C1','E1','E2'],
    text:`Tim audit memakai pendekatan konservatif: materialitas keseluruhan = nilai <b>terkecil</b> dari tiga perhitungan (nilai × persentase). Isi <code>F2</code> dengan ${v?'materialitas keseluruhan':'performance materiality: materialitas keseluruhan × F1'}.`,hint:'MIN(B2*C2, B3*C3, B4*C4).'}});
add('audit-cutoff','Advanced','Audit','Uji pisah batas penjualan',r=>{const n=r.int(10,14);const tb=r.pick([[2025,12,31],[2026,6,30],[2026,3,31]]);const pe=D(...tb);const rows=Array.from({length:n},()=>{const c=pe+r.int(-6,4),k=c+r.pick([0,0,0,1,2,3,-1]);return['SJ-'+r.int(1000,9999),k,c,r.money(5e6,250e6,500000)]});rows[r.int(0,n-1)].splice(1,2,pe+r.int(1,3),pe-r.int(0,3));const N=n+1;const v=r.chance(.5);
  return{data:Object.assign(tbl(['No faktur','Tanggal kirim','Tanggal dicatat','Nilai'],rows),{F1:'Tutup buku',G1:pe,F2:v?'Faktur salah periode':'Nilai salah periode'}),fmt:{B:'date',C:'date',G1:'date'},cols:7,rows:N,target:'G2',
    solution:v?`=COUNTIFS(C2:C${N},"<="&G1,B2:B${N},">"&G1)`:`=SUMIFS(D2:D${N},C2:C${N},"<="&G1,B2:B${N},">"&G1)`,use:[v?'COUNTIFS|SUMPRODUCT|FILTER':'SUMIFS|SUMPRODUCT|FILTER'],bold:['F1','F2'],
    text:`Penjualan baru boleh diakui saat barang <b>dikirim</b>. Isi <code>G2</code> dengan ${v?'jumlah faktur':'total nilai faktur'} yang <b>dicatat</b> sampai tanggal tutup buku G1, padahal barangnya baru dikirim <b>setelah</b> G1.`,hint:'Dua syarat: tanggal dicatat "<="&G1 dan tanggal kirim ">"&G1.'}});
add('audit-sod','Advanced','Audit','Pemisahan tugas pembuat dan penyetuju',r=>{const n=r.int(10,14),ps=people(r,5);const rows=Array.from({length:n},()=>{const a=r.pick(ps);return['PO-'+r.int(100,999),a,r.chance(.25)?a:r.pick(ps),r.money(1e6,90e6,100000)]});rows[0][2]=rows[0][1];const N=n+1;const v=r.pick(['n','nilai','orang']);const who=rows[0][1];
  return{data:Object.assign(tbl(['No PO','Dibuat oleh','Disetujui oleh','Nilai'],rows),Object.assign(v==='orang'?{F1:'Nama',G1:who}:{},{F2:v==='n'?'PO dibuat & disetujui orang sama':v==='nilai'?'Nilai PO tersebut':'Jumlah PO miliknya'})),cols:7,rows:N,target:'G2',
    solution:v==='n'?`=SUMPRODUCT(--(B2:B${N}=C2:C${N}))`:v==='nilai'?`=SUMPRODUCT((B2:B${N}=C2:C${N})*D2:D${N})`:`=SUMPRODUCT((B2:B${N}=G1)*(C2:C${N}=G1))`,use:['SUMPRODUCT|SUM|FILTER|COUNT|COUNTIFS|MAP'],bold:['F1','F2'],
    text:v==='n'?`Pembuat PO tidak boleh menyetujui PO-nya sendiri. Isi <code>G2</code> dengan jumlah PO yang pembuat dan penyetujunya <b>orang yang sama</b>.`:v==='nilai'?`Pembuat PO tidak boleh menyetujui PO-nya sendiri. Isi <code>G2</code> dengan total nilai PO yang pembuat dan penyetujunya orang yang sama.`:`Isi <code>G2</code> dengan jumlah PO yang <b>dibuat sekaligus disetujui</b> oleh ${who} (nama di G1).`,
    hint:'Membandingkan dua kolom baris per baris: (B2:B…=C2:C…) menghasilkan TRUE/FALSE. Ubah jadi angka dengan -- atau dikalikan, lalu SUMPRODUCT.'}});
add('x-mus','Expert','Gabungan audit','Item kunci pada sampling unit moneter',r=>{const n=r.int(12,18);const rows=Array.from({length:n},()=>['PIU-'+r.int(100,999),r.chance(.2)?r.money(80e6,400e6,1e6):r.money(1e6,60e6,100000)]);const N=n+1;const ss=r.pick([10,15,20,25]);const v=r.chance(.5);
  return{data:Object.assign(tbl(['Pelanggan','Saldo'],rows),{D1:'Ukuran sampel',E1:ss,D2:v?'Jumlah item kunci':'Nilai item kunci'}),cols:5,rows:N,target:'E2',solution:v?`=COUNTIF(B2:B${N},">="&SUM(B2:B${N})/E1)`:`=SUMIF(B2:B${N},">="&SUM(B2:B${N})/E1)`,use:[v?'COUNTIF|COUNTIFS|SUMPRODUCT|FILTER':'SUMIF|SUMIFS|SUMPRODUCT|FILTER','SUM'],bold:['D1','D2'],
    text:`Interval sampling = total saldo ÷ ukuran sampel. Saldo yang <b>sama atau lebih besar</b> dari interval pasti terpilih (item kunci). Isi <code>E2</code> dengan ${v?'jumlah':'total nilai'} item kunci dalam satu rumus.`,hint:'Interval: SUM(B2:B…)/E1. Lalu COUNTIF atau SUMIF dengan kriteria ">="&interval.'}});
add('x-outlier','Expert','Gabungan audit','Transaksi menyimpang (z-score)',r=>{const n=r.int(14,20),m=r.money(2e6,20e6,100000);const rows=Array.from({length:n},()=>['TRX-'+r.int(1000,9999),Math.round(m*(0.7+r.f()*0.6)/1000)*1000]);rows[r.int(0,n-1)][1]=Math.round(m*r.pick([3.5,4,5])/1000)*1000;const N=n+1;const k=r.pick([2,2.5,3]);const v=r.chance(.5);
  const cond=`ABS(B2:B${N}-AVERAGE(B2:B${N}))>D2*STDEV.S(B2:B${N})`;
  return{data:Object.assign(tbl(['No','Nilai'],rows),{D1:'Batas (× simpangan baku)',D2:k,F1:v?'Jumlah transaksi menyimpang':'Nomor transaksi menyimpang'}),cols:7,rows:N,target:'G1',solution:v?`=SUMPRODUCT(--(${cond}))`:`=TEXTJOIN(", ",TRUE,FILTER(A2:A${N},${cond}))`,use:v?['STDEV.S|STDEV|STDEV.P','AVERAGE']:['TEXTJOIN|CONCAT|ARRAYTOTEXT','STDEV.S|STDEV'],cs:!v,bold:['D1','F1'],
    text:`Transaksi dianggap menyimpang kalau jaraknya dari rata-rata lebih dari D2 × simpangan baku sampel. Isi <code>G1</code> dengan ${v?'jumlah transaksi menyimpang':'nomor transaksi yang menyimpang, dipisah koma dan spasi'}.`,hint:'ABS(nilai − AVERAGE(…)) > D2 × STDEV.S(…) untuk setiap baris, lalu hitung atau FILTER.'}});
add('x-tiga-arah','Expert','Gabungan audit','Pencocokan tiga arah PO, penerimaan, dan faktur',r=>{const n=r.int(7,10);const rows=Array.from({length:n},()=>{const q=r.int(10,500),h=r.money(5000,500000,500);const gr=r.chance(.8)?q:q-r.int(1,9);const iq=r.chance(.8)?gr:gr+r.int(1,9);const ih=r.chance(.8)?h:Math.round(h*(1+r.pick([.01,.03,.08]))/100)*100;return['PO-'+r.int(1000,9999),q,gr,iq,h,ih]});rows[0][3]=rows[0][2]+2;const N=n+1;const tol=r.pick([.02,.05]);
  return{data:Object.assign(tbl(['No PO','Qty PO','Qty diterima','Qty faktur','Harga PO','Harga faktur'],rows),{H1:'Toleransi harga',I1:tol,H2:'PO bermasalah'}),fmt:{I1:'pct'},cols:9,rows:N,target:'I2',
    solution:`=TEXTJOIN(", ",TRUE,FILTER(A2:A${N},(D2:D${N}>C2:C${N})+(F2:F${N}>E2:E${N}*(1+I1))))`,use:['TEXTJOIN|CONCAT|ARRAYTOTEXT','FILTER|IF'],cs:true,bold:['H1','H2'],
    text:`Faktur bermasalah kalau qty yang ditagih <b>lebih banyak</b> dari qty yang diterima, <b>atau</b> harga faktur melebihi harga PO lebih dari toleransi I1. Isi <code>I2</code> dengan nomor PO yang bermasalah, dipisah koma dan spasi.`,hint:'Syarat ATAU di dalam FILTER ditulis dengan tanda +: (qty faktur > qty terima) + (harga faktur > harga PO × (1+I1)).'}});
add('x-bayar-ganda','Expert','Gabungan audit','Pembayaran ganda ke vendor',r=>{const n=r.int(10,14),vs=r.sample(VENDOR,4);const rows=Array.from({length:n},()=>['INV-'+r.int(1000,9999),r.pick(vs),r.money(1e6,60e6,50000)]);const a=r.int(0,n-1);let b=r.int(0,n-1);if(b===a)b=(a+1)%n;rows[b][1]=rows[a][1];rows[b][2]=rows[a][2];const N=n+1;const v=r.chance(.5);
  const cond=`COUNTIFS(B2:B${N},B2:B${N},C2:C${N},C2:C${N})>1`;
  return{data:Object.assign(tbl(['No faktur','Vendor','Nilai'],rows),{E1:v?'Baris berpotensi ganda':'Nilai berpotensi ganda'}),cols:6,rows:N,target:'F1',solution:v?`=SUM(--(${cond}))`:`=SUM((${cond})*C2:C${N})`,use:['COUNTIFS|SUMPRODUCT|MAP|BYROW','SUM|SUMPRODUCT|FILTER|COUNT'],bold:['E1'],
    text:`Nomor faktur bisa berbeda, tapi vendor dan nominal yang persis sama patut dicurigai sebagai pembayaran ganda. Isi <code>F1</code> dengan ${v?'jumlah baris':'total nilai baris'} yang vendor <b>dan</b> nominalnya muncul lebih dari sekali.`,hint:'COUNTIFS(B2:B…, B2:B…, C2:C…, C2:C…) memberi jumlah kemunculan untuk setiap baris. Bandingkan dengan 1 lalu jumlahkan.'}});

// ---------- VARIASI UMUM
add('lembur','Menengah','Logika','Upah lembur jam pertama dan berikutnya',r=>{const n=r.int(4,7),ns=people(r,n);const rows=ns.map(p=>[p,r.money(4.5e6,12e6,50000),r.int(1,6)]);const t=r.int(2,n+1);
  return{data:Object.assign(tbl(['Karyawan','Gaji bulanan','Jam lembur','Upah lembur'],rows),{F1:'Pembagi upah per jam',G1:173}),cols:7,rows:n+1,target:'D'+t,solution:`=IF(C${t}<=1,C${t}*1.5,1.5+(C${t}-1)*2)*B${t}/$G$1`,use:['IF|MIN|MAX'],bold:['F1'],
    text:`Upah per jam = gaji ÷ G1. Jam lembur pertama dibayar 1,5×, jam kedua dan seterusnya 2×. Isi <code>D${t}</code> dengan upah lembur ${rows[t-2][0]}.`,hint:'Pengali jam: IF(jam<=1, jam×1,5, 1,5 + (jam−1)×2). Lalu kali upah per jam.'}});
add('ongkir-berat','Menengah','Pencarian','Ongkos kirim per kilogram',r=>{const n=r.int(4,7);const Z=r.sample(['Jawa','Sumatra','Kalimantan','Sulawesi','Bali-NTT','Papua'],4).map(z=>[z,r.money(9000,60000,500)]);const rows=Array.from({length:n},()=>['RSI-'+r.int(10000,99999),r.pick(Z)[0],Math.round((0.2+r.f()*7)*10)/10]);const t=r.int(2,n+1);
  const d=Object.assign(tbl(['Resi','Zona','Berat (kg)','Ongkir'],rows),{F1:'Zona',G1:'Tarif per kg'});Z.forEach((z,i)=>{d['F'+(i+2)]=z[0];d['G'+(i+2)]=z[1]});
  return{data:d,cols:7,rows:Math.max(n+1,5),target:'D'+t,solution:`=ROUNDUP(C${t},0)*XLOOKUP(B${t},$F$2:$F$5,$G$2:$G$5)`,use:['ROUNDUP|CEILING|CEILING.MATH','XLOOKUP|VLOOKUP|INDEX|LOOKUP'],bold:['F1','G1'],
    text:`Berat selalu dibulatkan <b>ke atas</b> ke kilogram penuh (1,2 kg dihitung 2 kg). Isi <code>D${t}</code> dengan ongkir resi ${rows[t-2][0]}: berat dibulatkan × tarif zonanya.`}});
add('masa-kerja-teks','Menengah','Tanggal','Masa kerja tahun dan bulan',r=>{const n=r.int(4,6),ns=people(r,n);const rows=ns.map(p=>[p,D(r.int(2008,2025),r.int(1,12),r.int(1,28))]);const t=r.int(2,n+1);const ref=D(2026,r.int(1,12),r.int(1,28));const v=r.chance(.5);
  return{data:Object.assign(tbl(['Karyawan','Tanggal masuk','Masa kerja'],rows),{E1:'Per tanggal',F1:ref}),fmt:{B:'date',F1:'date'},cols:6,rows:n+1,target:'C'+t,solution:v?`=DATEDIF(B${t},$F$1,"y")&" tahun "&DATEDIF(B${t},$F$1,"ym")&" bulan"`:`=DATEDIF(B${t},$F$1,"y")`,use:['DATEDIF|YEARFRAC|INT'],bold:['E1'],
    text:v?`Isi <code>C${t}</code> dengan masa kerja ${rows[t-2][0]} per tanggal F1 dalam format <b>X tahun Y bulan</b>, misalnya "5 tahun 3 bulan".`:`Isi <code>C${t}</code> dengan masa kerja ${rows[t-2][0]} dalam <b>tahun penuh</b> per tanggal F1.`,hint:v?'DATEDIF(…,"y") untuk tahun, DATEDIF(…,"ym") untuk sisa bulan, gabung dengan &.':'DATEDIF(tanggal masuk, F1, "y").'}});
add('peringkat-grup','Advanced','Statistik','Peringkat di dalam kelompok',r=>{const n=r.int(8,12),dv=r.sample(DIV,3),ns=people(r,n);const rows=ns.map(p=>[p,r.pick(dv),r.int(55,100)]);const t=r.int(2,n+1);
  return{data:tbl(['Nama','Divisi','Skor KPI','Peringkat di divisi'],rows),cols:4,rows:n+1,target:'D'+t,solution:`=COUNTIFS($B$2:$B$${n+1},B${t},$C$2:$C$${n+1},">"&C${t})+1`,use:['COUNTIFS|SUMPRODUCT|RANK.EQ|FILTER'],
    text:`Isi <code>D${t}</code> dengan peringkat ${rows[t-2][0]} <b>di dalam divisinya</b> (skor tertinggi = 1). Skor yang sama mendapat peringkat yang sama.`,hint:'Hitung berapa orang di divisi yang sama dengan skor lebih tinggi, lalu tambah 1: COUNTIFS(divisi, divisi ini, skor, ">"&skor ini)+1.'}});
add('top-n','Advanced','Array dinamis','Tiga teratas otomatis',r=>{const n=r.int(7,11),ps=r.sample(PROD,n);const rows=ps.map(p=>[p,r.money(1e6,90e6,10000)]);const N=n+1;const k=r.pick([3,3,5]);const asc=r.chance(.3);
  return{data:Object.assign(tbl(['Produk','Penjualan'],rows),{D1:asc?`${k} terendah`:`${k} terlaris`}),cols:5,rows:Math.max(N,k+1),target:'D2',solution:`=TAKE(SORTBY(A2:A${N},B2:B${N},${asc?1:-1}),${k})`,use:['SORTBY|SORT|LARGE|SMALL|FILTER|INDEX','TAKE|INDEX|SEQUENCE|CHOOSEROWS'],bold:['D1'],
    text:`Isi <code>D2</code> dengan nama ${k} produk dengan penjualan ${asc?'<b>terendah</b> (dari yang paling rendah)':'<b>tertinggi</b> (dari yang paling tinggi)'}. Hasilnya tumpah ke bawah.`,hint:`SORTBY(produk, penjualan, ${asc?1:-1}) lalu ambil ${k} teratas dengan TAKE.`}});
add('kode-switch','Menengah','Logika','Menerjemahkan kode',r=>{const n=r.int(4,7);const M=r.pick([[['T','Tunai'],['K','Kartu'],['Q','QRIS'],['V','Transfer VA']],[['P','Pria'],['W','Wanita']],[['A','Aktif'],['C','Cuti'],['R','Resign'],['M','Magang']]]);const rows=Array.from({length:n},()=>['TRX-'+r.int(100,999),r.pick(M)[0]]);const t=r.int(2,n+1);
  return{data:tbl(['No','Kode','Keterangan'],rows),cols:3,rows:n+1,target:'C'+t,solution:`=SWITCH(B${t},${M.map(m=>`"${m[0]}","${m[1]}"`).join(',')})`,use:['SWITCH|IFS|IF|XLOOKUP|CHOOSE'],
    text:`Isi <code>C${t}</code> dengan keterangan kode di B${t}: ${M.map(m=>`<b>${m[0]}</b> = ${m[1]}`).join(', ')}.`,hint:'SWITCH(kode, "T","Tunai", "K","Kartu", …) lebih ringkas daripada IF bertingkat.'}});

/* =============== HOTS: analisis, evaluasi, dan penalaran (bukan sekadar menghafal rumus) =============== */
const evalF=(data,f)=>{const v=XL.makeSheet(data).evalFormula(f.slice(1),true);return v&&v.rows?v.rows[0][0]:v};
const nf=v=>typeof v==='number'?(Math.abs(v)<1&&v!==0?(Math.round(v*1e4)/1e4).toLocaleString('id-ID'):Math.round(v).toLocaleString('id-ID')):XL.isErr(v)?v.code:String(v);
const KUR=['Reguler','Ekonomi','Kilat','Kargo','Same day','Hemat','Ekspres'];

// ---- analisis kesalahan rumus orang lain
add('h-debug-vlookup','Menengah','HOTS','Mencari kesalahan VLOOKUP',r=>{let n,codes,m,rows,d,N,t=2,wrong=null;
  for(let a=0;a<40&&wrong===null;a++){n=r.int(5,7);codes=r.sample(['BRG-07','BRG-02','BRG-15','BRG-11','BRG-04','BRG-19','BRG-08','BRG-13'],n);const pr=codes.map(()=>r.money(5000,250000,500));m=r.int(4,6);rows=Array.from({length:m},()=>['SO-'+r.int(100,999),r.pick(codes),r.int(1,30)]);
  d=Object.assign(tbl(['Order','Kode','Qty','Harga'],rows),{F1:'Kode',G1:'Harga'});codes.forEach((c,i)=>{d['F'+(i+2)]=c;d['G'+(i+2)]=pr[i]});N=n+1;
  for(let k=2;k<=m+1;k++){const w=evalF(d,`=VLOOKUP(B${k},$F$2:$G$${N},2)`),g=evalF(d,`=VLOOKUP(B${k},$F$2:$G$${N},2,FALSE)`);if(String(w)!==String(g)){t=k;wrong=w;break}}}
  return{data:d,cols:7,rows:Math.max(m+1,N),target:'D'+t,solution:`=VLOOKUP(B${t},$F$2:$G$${N},2,FALSE)`,use:['VLOOKUP|XLOOKUP|INDEX|LOOKUP'],bold:['F1','G1'],
  text:`Rekanmu mengisi D${t} dengan <code>=VLOOKUP(B${t},$F$2:$G$${N},2)</code> dan hasilnya <b>${nf(wrong)}</b>, padahal kode ${rows[t-2][1]} jelas ada di tabel F–G dengan harga yang berbeda. Cari penyebabnya, lalu isi <code>D${t}</code> dengan rumus yang benar.`,
  hint:'Tanpa argumen keempat, VLOOKUP memakai pencocokan perkiraan yang menganggap kolom kode sudah urut. Kolom F tidak urut. Tambahkan FALSE (atau 0) untuk pencocokan persis, atau pakai XLOOKUP.'}});
add('h-debug-rata','Menengah','HOTS','Rata-rata yang tertarik nilai nol',r=>{const n=r.int(7,10),ns=people(r,n);const rows=ns.map(p=>[p,r.chance(.3)?0:r.int(55,98)]);rows[0][1]=0;rows[1][1]=rows[1][1]||77;const N=n+1;const wrong=evalF(tbl(['a','b'],rows),`=AVERAGE(B2:B${N})`);
  return{data:Object.assign(tbl(['Peserta','Skor'],rows),{D1:'Catatan',E1:'0 = belum ikut tes',D2:'Rata-rata peserta yang sudah tes'}),cols:5,rows:N,target:'E2',solution:`=AVERAGEIF(B2:B${N},">0")`,use:['AVERAGEIF|AVERAGEIFS|SUM|FILTER|AVERAGE'],bold:['D1','D2'],
  text:`Atasan protes karena laporan menulis rata-rata skor <b>${nf(wrong)}</b> dari <code>=AVERAGE(B2:B${N})</code>. Angka 0 di kolom B berarti peserta belum ikut tes, bukan skor nol. Isi <code>E2</code> dengan rata-rata yang benar.`,
  hint:'AVERAGE ikut menghitung angka 0. Batasi hanya skor di atas 0: AVERAGEIF(B2:B…, ">0"), atau SUM dibagi COUNTIF(…,">0").'}});
add('h-debug-persen','Menengah','HOTS','Rumus pertumbuhan yang terbalik',r=>{const n=r.int(4,6),cs=cityList(r,n);const rows=cs.map(c=>{const a=r.money(50e6,400e6,1e6);return[c,a,Math.round(a*(0.7+r.f()*0.7)/1e6)*1e6]});const t=r.int(2,n+1);const w=(rows[t-2][1]-rows[t-2][2])/rows[t-2][2];
  return{data:tbl(['Cabang','Tahun lalu','Tahun ini','Pertumbuhan'],rows),fmt:{D:'pct'},cols:4,rows:n+1,target:'D'+t,solution:`=(C${t}-B${t})/B${t}`,
  text:`Laporan menulis pertumbuhan cabang ${rows[t-2][0]} sebesar <b>${(Math.round(w*1000)/10).toLocaleString('id-ID')}%</b> dari rumus <code>=(B${t}-C${t})/C${t}</code>. Periksa logikanya: pertumbuhan dihitung dari tahun lalu ke tahun ini. Isi <code>D${t}</code> dengan rumus yang benar.`,
  hint:'Pertumbuhan = (nilai baru − nilai lama) ÷ nilai lama. Rumus rekanmu terbalik di dua tempat.'}});
add('h-debug-sum-range','Menengah','HOTS','Total yang melewatkan baris baru',r=>{const n=r.int(6,9),ps=r.sample(PROD,n);const rows=ps.map(p=>[p,r.money(200000,5e6,5000)]);const N=n+1;const wrong=evalF(tbl(['a','b'],rows),`=SUM(B2:B${N-2})`);
  return{data:Object.assign(tbl(['Produk','Penjualan'],rows),{D1:'Total'}),cols:5,rows:N,target:'E1',solution:`=SUM(B2:B${N})`,use:['SUM|SUBTOTAL|AGGREGATE'],bold:['D1'],
  text:`File lama berisi <code>=SUM(B2:B${N-2})</code> dengan hasil <b>${nf(wrong)}</b>. Dua produk terakhir baru ditambahkan minggu ini. Isi <code>E1</code> dengan total yang benar, lalu pikirkan: bagaimana supaya baris baru otomatis ikut terhitung?`,
  hint:`Rentangnya harus sampai B${N}. Supaya baris baru otomatis ikut, ubah data jadi Tabel (Ctrl+T) atau pakai rentang satu kolom seperti B:B.`}});

// ---- penalaran mundur (dari target ke input)
add('h-nilai-minimal','Advanced','HOTS','Nilai ujian minimal untuk mencapai target',r=>{const w=r.pick([[.3,.3,.4],[.2,.3,.5],[.25,.25,.5],[.2,.4,.4]]),tg=r.pick([70,75,78,80,85]);const tu=r.int(55,95),ut=r.int(50,95);
  return{data:{A1:'Komponen',B1:'Nilai',C1:'Bobot',A2:'Tugas',B2:tu,C2:w[0],A3:'UTS',B3:ut,C3:w[1],A4:'UAS',C4:w[2],A6:'Target nilai akhir',B6:tg,A7:'UAS minimal'},fmt:{C:'pct'},cols:4,rows:8,target:'B7',
  solution:'=IF(ROUNDUP((B6-B2*C2-B3*C3)/C4,0)>100,"Tidak mungkin",MAX(0,ROUNDUP((B6-B2*C2-B3*C3)/C4,0)))',use:['ROUNDUP|CEILING|CEILING.MATH|LET','IF|IFS'],bold:['A1','B1','C1','A6','A7'],
  text:`Mahasiswa ingin tahu nilai UAS paling kecil supaya nilai akhir berbobot mencapai target B6. Isi <code>B7</code> dengan nilai UAS minimal (bilangan bulat, dibulatkan ke atas). Kalau yang dibutuhkan lebih dari 100, tulis <b>Tidak mungkin</b>; kalau target sudah tercapai tanpa UAS, tulis 0.`,
  hint:'Susun ulang persamaan: target = tugas×bobot + UTS×bobot + UAS×bobot UAS. UAS = (target − dua komponen lain) ÷ bobot UAS. Lalu ROUNDUP, cek >100, dan batasi minimal 0.'}});
add('h-harga-jual-min','Advanced','HOTS','Harga jual minimal di marketplace',r=>{const hpp=r.money(15000,400000,500),fee=r.pick([.05,.065,.08,.1]),fl=r.pick([1000,1250,2000,2500]),mg=r.pick([.1,.15,.2,.25]);
  return{data:{A1:'HPP per unit',B1:hpp,A2:'Potongan marketplace (% harga jual)',B2:fee,A3:'Biaya layanan per pesanan',B3:fl,A4:'Target laba (% harga jual)',B4:mg,A5:'Harga jual minimal'},fmt:{B2:'pct',B4:'pct'},cols:3,rows:6,target:'B5',
  solution:'=ROUNDUP((B1+B3)/(1-B2-B4),-2)',use:['ROUNDUP|CEILING|CEILING.MATH|MROUND'],bold:['A5'],
  text:`Seller ingin laba bersih minimal B4 dari harga jual setelah potongan marketplace (persen dari harga jual) dan biaya layanan per pesanan. Isi <code>B5</code> dengan harga jual minimal, dibulatkan <b>ke atas</b> ke ratusan rupiah.`,
  hint:'Harga − harga×potongan − biaya layanan − HPP = harga×target laba. Pindahkan semua suku "harga" ke satu sisi: harga = (HPP + biaya layanan) ÷ (1 − potongan − target laba).'}});
add('h-diskon-maks','Advanced','HOTS','Diskon maksimal yang masih aman',r=>{const P=r.money(50000,800000,1000),C=Math.round(P*(0.4+r.f()*0.2)/500)*500,Q=r.int(200,3000),F=r.money(2e6,40e6,500000);const L=Math.max(1e6,Math.round(((P*0.88-C)*Q-F)*(0.3+r.f()*0.5)/500000)*500000);
  return{data:{A1:'Harga normal',B1:P,A2:'HPP per unit',B2:C,A3:'Perkiraan unit terjual',B3:Q,A4:'Biaya promosi (tetap)',B4:F,A5:'Laba minimal yang diminta',B5:L,A6:'Diskon maksimal'},fmt:{B6:'pct'},cols:3,rows:7,target:'B6',
  solution:'=ROUNDDOWN(1-(B5+B4+B2*B3)/(B1*B3),2)',use:['ROUNDDOWN|FLOOR|FLOOR.MATH|INT|TRUNC'],bold:['A6'],
  text:`Tim promo bertanya: berapa diskon paling besar supaya laba program tetap minimal B5? Laba = (harga × (1 − diskon) − HPP) × unit − biaya promosi. Isi <code>B6</code> dengan diskon maksimal dalam persen bulat, dibulatkan <b>ke bawah</b> (misalnya 0,17 untuk 17%).`,
  hint:'Pecahkan persamaannya untuk diskon: diskon = 1 − (laba + biaya + HPP×unit) ÷ (harga×unit). Bulatkan ke bawah 2 desimal supaya laba tidak kurang dari target.'}});
add('h-plafon-maks','Advanced','HOTS','Plafon pinjaman maksimal dari gaji',r=>{const g=r.money(4e6,40e6,100000),ra=r.pick([.3,.35,.4]),b=r.pick([.075,.09,.11,.13]),n=r.pick([60,120,180,240]),cl=r.chance(.5)?r.money(500000,3e6,100000):0;
  return{data:{A1:'Gaji bersih per bulan',B1:g,A2:'Batas cicilan (% gaji)',B2:ra,A3:'Cicilan lain yang sedang berjalan',B3:cl,A4:'Bunga per tahun',B4:b,A5:'Tenor (bulan)',B5:n,A6:'Plafon maksimal'},fmt:{B2:'pct',B4:'pct'},cols:3,rows:7,target:'B6',
  solution:'=ROUNDDOWN(PV(B4/12,B5,-(B1*B2-B3)),-6)',use:['PV','ROUNDDOWN|FLOOR|FLOOR.MATH|INT|TRUNC'],bold:['A6'],
  text:`Bank membatasi total cicilan maksimal B2 dari gaji, termasuk cicilan lain yang sudah berjalan. Isi <code>B6</code> dengan plafon pinjaman terbesar yang masih bisa disetujui (anuitas), dibulatkan ke bawah ke <b>jutaan</b>.`,
  hint:'Cicilan yang masih tersedia = gaji × batas − cicilan lain. Plafon = PV(bunga/12, tenor, −cicilan tersedia). Ini kebalikan dari PMT.'}});

// ---- evaluasi pilihan
add('x-h-pilih-supplier','Expert','HOTS','Memilih pemasok termurah dengan syarat diskon',r=>{let rows,q,tot;for(let a=0;a<20;a++){q=r.int(50,600);rows=r.sample(VENDOR,3).map(v=>[v,r.money(9000,15000,100),r.pick([0,150000,250000,400000]),r.pick([100,200,300,500]),r.pick([.03,.05,.08,.1])]);tot=rows.map(x=>x[1]*q*(1-(q>=x[3]?x[4]:0))+x[2]);if(new Set(tot.map(Math.round)).size===3)break}
  return{data:Object.assign(tbl(['Pemasok','Harga per unit','Ongkir per order','Min. qty diskon','Diskon'],rows),{G1:'Kebutuhan (unit)',H1:q,G2:'Pemasok termurah'}),fmt:{E:'pct'},cols:8,rows:4,target:'H2',
  solution:'=LET(total,B2:B4*H1*(1-IF(H1>=D2:D4,E2:E4,0))+C2:C4,INDEX(A2:A4,MATCH(MIN(total),total,0)))',use:null,bold:['G1','G2'],
  text:`Untuk kebutuhan H1 unit, bandingkan total biaya ketiga pemasok: harga × qty, dipotong diskon <b>hanya kalau</b> qty mencapai minimumnya, lalu ditambah ongkir. Isi <code>H2</code> dengan nama pemasok yang total biayanya paling murah, dalam satu rumus.`,
  hint:'Hitung total per pemasok sebagai array dengan LET: B2:B4*H1*(1−IF(H1>=D2:D4,E2:E4,0))+C2:C4. Lalu ambil nama di posisi MIN-nya dengan INDEX/MATCH atau XLOOKUP.'}});
add('x-h-sewa-beli','Expert','HOTS','Sewa atau beli: bandingkan nilai sekarang',r=>{const hb=r.money(150e6,900e6,5e6),sw=Math.round(hb*(0.012+r.f()*0.01)/100000)*100000,th=r.pick([3,4,5]),rs=Math.round(hb*(0.35+r.f()*0.25)/1e6)*1e6,b=r.pick([.08,.1,.12]);const v=r.chance(.5);
  const beli='B1-B4/(1+B5)^B3',sewa='PV(B5/12,B3*12,-B2)';
  return{data:{A1:'Harga beli kendaraan',B1:hb,A2:'Sewa per bulan',B2:sw,A3:'Masa pakai (tahun)',B3:th,A4:'Nilai jual kembali di akhir',B4:rs,A5:'Biaya modal per tahun',B5:b,A6:v?'Keputusan':'Penghematan pilihan terbaik'},fmt:{B5:'pct'},cols:3,rows:7,target:'B6',
  solution:v?`=IF(${beli}<${sewa},"Beli","Sewa")`:`=ROUND(ABS((${beli})-${sewa}),0)`,use:['PV|NPV','IF|ABS|MIN'],bold:['A6'],
  text:`Bandingkan dalam <b>nilai sekarang</b>: biaya beli = harga beli − nilai sekarang dari nilai jual kembali (didiskonto per tahun), biaya sewa = nilai sekarang semua sewa bulanan (bunga bulanan = B5/12). ${v?'Isi <code>B6</code> dengan <b>Beli</b> atau <b>Sewa</b>, mana yang lebih murah.':'Isi <code>B6</code> dengan selisih kedua biaya (penghematan dari pilihan yang lebih murah), dibulatkan ke rupiah penuh.'}`,
  hint:'Biaya beli: B1 − B4/(1+B5)^B3. Biaya sewa: PV(B5/12, B3×12, −B2). Bandingkan keduanya.'}});
add('x-h-kurir-tenggat','Expert','HOTS','Kurir termurah yang tetap tepat waktu',r=>{let rows,ord,dl,ok;for(let a=0;a<30;a++){ord=D(2026,r.int(1,11),r.int(1,24));rows=r.sample(KUR,5).map(k=>[k,r.money(9000,90000,500),r.int(1,8)]);dl=XL.makeSheet({A1:ord}).evalFormula('WORKDAY(A1,'+r.int(2,5)+')',true);ok=rows.filter(x=>XL.makeSheet({A1:ord}).evalFormula('WORKDAY(A1,'+x[2]+')',true)<=dl);if(ok.length>=1&&ok.length<5&&new Set(ok.map(x=>x[1])).size===ok.length)break}
  return{data:Object.assign(tbl(['Kurir','Ongkir','Lama (hari kerja)'],rows),{E1:'Tanggal kirim',F1:ord,E2:'Harus tiba paling lambat',F2:dl,E3:'Kurir dipilih'}),fmt:{F1:'date',F2:'date'},cols:6,rows:6,target:'F3',
  solution:'=LET(tiba,MAP(C2:C6,LAMBDA(h,WORKDAY(F1,h))),ok,tiba<=F2,INDEX(SORTBY(FILTER(A2:A6,ok),FILTER(B2:B6,ok)),1))',use:null,bold:['E1','E2','E3'],
  text:`Paket dikirim tanggal F1 dan harus tiba paling lambat F2. Lama pengiriman dihitung dalam <b>hari kerja</b> (Senin–Jumat). Isi <code>F3</code> dengan kurir <b>termurah</b> di antara kurir yang tiba tepat waktu.`,
  hint:'Tanggal tiba tiap kurir: WORKDAY(F1, lama). Saring kurir yang tiba ≤ F2 dengan FILTER, urutkan berdasarkan ongkir dengan SORTBY, ambil yang pertama. Cara lain: MINIFS ongkir untuk kurir yang tepat waktu, lalu cari namanya.'}});
add('x-h-bonus-syarat','Expert','HOTS','Skema bonus dengan syarat dan batas',r=>{const n=r.int(5,8),ns=people(r,n);const rows=ns.map(p=>[p,r.money(5e6,15e6,100000),Math.round((0.7+r.f()*0.7)*100)/100,r.pick([.85,.9,.95,.98,1,1])]);const t=r.int(2,n+1);if(r.chance(.8))rows[t-2][2]=Math.round((0.9+r.f()*0.5)*100)/100;rows[t-2][3]=r.chance(.75)?r.pick([.95,.97,.98,1]):r.pick([.88,.9,.93]);const tier=[[0,0],[.9,.5],[1,1],[1.1,1.5],[1.25,2]];
  const d=Object.assign(tbl(['Nama','Gaji','Pencapaian','Kehadiran','Bonus'],rows),{G1:'Pencapaian dari',H1:'Bonus (× gaji)',J1:'Kehadiran minimal',K1:.95,J2:'Bonus maksimal (× gaji)',K2:1.75});tier.forEach((x,i)=>{d['G'+(i+2)]=x[0];d['H'+(i+2)]=x[1]});
  return{data:d,fmt:{C:'pct',D:'pct',G:'pct',K1:'pct'},cols:11,rows:Math.max(n+1,6),target:'E'+t,
  solution:`=IF(D${t}<$K$1,0,MIN($K$2,XLOOKUP(C${t},$G$2:$G$6,$H$2:$H$6,,-1))*B${t})`,use:['IF|IFS','MIN|IF','XLOOKUP|VLOOKUP|LOOKUP|INDEX'],bold:['G1','H1','J1','J2'],
  text:`Hitung bonus ${rows[t-2][0]} di <code>E${t}</code>: kelipatan gaji diambil dari tabel G–H berdasarkan pencapaian (batas bawah), dibatasi maksimal K2 × gaji, dan <b>gugur</b> (0) kalau kehadiran di bawah K1.`,
  hint:'Tiga aturan, tiga fungsi: XLOOKUP(…, , −1) untuk kelipatan, MIN(K2, …) untuk batas, IF(kehadiran<K1, 0, …) untuk syarat gugur.'}});
add('x-h-penurunan-terbesar','Expert','HOTS','Bulan dengan penurunan terbesar',r=>{const BL=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];let v=r.money(200e6,800e6,1e6);const rows=BL.map(b=>{v=Math.max(50e6,Math.round(v*(0.82+r.f()*0.33)/1e6)*1e6);return[b,v]});const k=r.int(2,11);rows[k][1]=Math.round(rows[k-1][1]*0.62/1e6)*1e6;const pct=r.chance(.5);
  const ch='B3:B13/B2:B12-1';
  return{data:Object.assign(tbl(['Bulan','Penjualan'],rows),{D1:pct?'Penurunan terbesar (%)':'Bulan turun paling tajam'}),fmt:pct?{E1:'pct'}:undefined,cols:5,rows:13,target:'E1',
  solution:pct?`=ROUND(MIN(${ch}),4)`:`=INDEX(A3:A13,MATCH(MIN(${ch}),${ch},0))`,use:pct?['MIN|SMALL|AGGREGATE','ROUND']:['MIN|SMALL','INDEX|XLOOKUP|LOOKUP|FILTER'],bold:['D1'],
  text:pct?`Isi <code>E1</code> dengan perubahan bulanan paling negatif (dalam persen terhadap bulan sebelumnya), dibulatkan 4 desimal (−0,3782 berarti −37,82%), dalam satu rumus tanpa kolom bantu.`:`Isi <code>E1</code> dengan nama bulan yang penjualannya turun paling tajam <b>dalam persen</b> dibanding bulan sebelumnya, dalam satu rumus.`,
  hint:'Perubahan tiap bulan: B3:B13/B2:B12 − 1 (rentang digeser satu baris). Nilai paling kecil = penurunan terbesar.'+(pct?'':' Cari posisinya lalu ambil nama bulan dari A3:A13.')}});

// ---- konsistensi & rekayasa data
add('h-cek-konsisten','Advanced','HOTS','Menemukan baris yang totalnya tidak cocok',r=>{const n=r.int(8,12);const rows=Array.from({length:n},()=>{const q=r.int(1,60),h=r.money(5000,300000,500);return['INV-'+r.int(1000,9999),q,h,q*h]});const bad=r.sample([...rows.keys()],r.int(1,3));bad.forEach(i=>{rows[i][3]+=r.pick([-1,1])*r.pick([500,1000,5000,10000])});const N=n+1;const v=r.chance(.5);
  return{data:Object.assign(tbl(['Faktur','Qty','Harga','Total tertulis'],rows),{F1:v?'Baris tidak cocok':'Selisih total'}),cols:7,rows:N,target:'G1',
  solution:v?`=SUMPRODUCT(--(B2:B${N}*C2:C${N}<>D2:D${N}))`:`=SUM(D2:D${N})-SUMPRODUCT(B2:B${N},C2:C${N})`,use:['SUMPRODUCT|SUM|FILTER|COUNT|MMULT'],bold:['F1'],
  text:v?`Kolom D diketik manual, bukan rumus. Isi <code>G1</code> dengan jumlah baris yang totalnya <b>tidak sama</b> dengan qty × harga, dalam satu rumus.`:`Kolom D diketik manual. Isi <code>G1</code> dengan selisih antara jumlah total tertulis dan jumlah qty × harga yang seharusnya (positif = tertulis lebih besar).`,
  hint:'B2:B…*C2:C… menghasilkan total seharusnya per baris. Bandingkan dengan D, ubah TRUE/FALSE jadi angka dengan --, lalu SUMPRODUCT.'}});
add('h-alokasi-sisa','Advanced','HOTS','Alokasi dibulatkan yang totalnya harus pas',r=>{const n=r.int(4,6),dv=r.sample(DIV,n);const tot=r.money(50e6,500e6,1e6)+r.int(1,999)*1000;const w=dv.map(()=>r.int(5,40));const N=n+1;
  const d=Object.assign(tbl(['Divisi','Jumlah karyawan','Alokasi'],dv.map((x,i)=>[x,w[i]])),{E1:'Anggaran pelatihan',F1:tot,E2:'Total alokasi'});for(let i=2;i<N;i++)d['C'+i]=`=ROUND($F$1*B${i}/SUM($B$2:$B$${N}),-5)`;d.F2=`=SUM(C2:C${N})`;
  return{data:d,cols:6,rows:N,target:'C'+N,solution:`=F1-SUM(C2:C${N-1})`,use:['SUM'],bold:['E1','E2'],
  text:`Anggaran dibagi proporsional jumlah karyawan dan dibulatkan ke ratusan ribu, jadi totalnya bisa meleset beberapa rupiah dari F1. Kebijakan kantor: divisi terakhir menerima <b>sisanya</b> supaya total alokasi tepat sama dengan anggaran. Isi <code>C${N}</code>, lalu cek F2.`,
  hint:'Sisa = anggaran − jumlah alokasi divisi lain. Kalau C'+N+' dihitung dengan rumus pembulatan yang sama, F2 tidak akan pas.'}});
add('h-target-sisa','Menengah','HOTS','Penjualan yang masih dibutuhkan',r=>{const BL=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];const k=r.int(8,11);const rows=BL.slice(0,k).map(b=>[b,r.money(60e6,200e6,1e6)]);const sum=rows.reduce((a,x)=>a+x[1],0);const tg=Math.round(sum*(1.05+r.f()*0.4)/1e7)*1e7;const left=12-k;
  return{data:Object.assign(tbl(['Bulan','Penjualan'],rows),{D1:'Target setahun',E1:tg,D2:`Rata-rata per bulan yang dibutuhkan (${left} bulan tersisa)`}),cols:5,rows:13,target:'E2',solution:`=MAX(0,(E1-SUM(B2:B13))/(12-COUNT(B2:B13)))`,use:['SUM','COUNT|COUNTA|ROWS'],bold:['D1','D2'],
  text:`Data penjualan baru sampai bulan ${BL[k-1]}. Isi <code>E2</code> dengan rata-rata penjualan per bulan yang masih dibutuhkan di sisa tahun supaya target E1 tercapai. Rumusnya harus tetap benar kalau bulan berikutnya ditambahkan di bawah (pakai rentang B2:B13 dan jangan ketik angka ${left} langsung). Tulis 0 kalau target sudah tercapai.`,
  hint:'Sisa target = E1 − SUM(B2:B13). Sisa bulan = 12 − COUNT(B2:B13); sel kosong tidak dihitung. Bagi keduanya, lalu MAX(0, …).'}});

/* =============== PivotTable (dikerjakan di simulasi pivot) =============== */
const PVSETS=[
  {name:'Penjualan',text:['Bulan','Cabang','Kategori','Sales'],num:['Nilai','Qty'],gen:(r,n)=>{const bl=r.sample(['Jul','Agu','Sep','Okt','Nov'],3),cb=cityList(r,4),kt=r.sample(['Elektronik','Perabot','ATK','Pakaian','Makanan'],3),sl=r.sample(NAMES,4);
    return Array.from({length:n},(_,i)=>({Bulan:bl[i%3],Cabang:cb[Math.floor(i/3)%4],Kategori:r.pick(kt),Sales:r.pick(sl),Nilai:r.money(2e6,45e6,100000),Qty:r.int(3,80)}))}},
  {name:'Biaya',text:['Bulan','Divisi','Akun','Vendor'],num:['Nominal','Dokumen'],gen:(r,n)=>{const bl=r.sample(['Jan','Feb','Mar','Apr','Mei'],3),dv=r.sample(DIV,4),ak=r.sample(['Perjalanan dinas','ATK','Konsumsi','Sewa','Listrik','Pelatihan'],3),vd=r.sample(['PT Bina Karya','CV Sinar','UD Maju','PT Delta','CV Cahaya'],4);
    return Array.from({length:n},(_,i)=>({Bulan:bl[i%3],Divisi:dv[Math.floor(i/3)%4],Akun:r.pick(ak),Vendor:r.pick(vd),Nominal:r.money(250000,25e6,50000),Dokumen:r.int(1,12)}))}},
  {name:'Karyawan',text:['Divisi','Lokasi','Status','Jabatan'],num:['Gaji','Lembur'],gen:(r,n)=>{const dv=r.sample(DIV,4),lk=cityList(r,3),jb=['Staf','Supervisor','Manajer'];
    return Array.from({length:n},(_,i)=>{const j=r.pick([0,0,0,1,1,2]);return{Divisi:dv[i%4],Lokasi:lk[Math.floor(i/4)%3],Status:r.pick(['Tetap','Tetap','Kontrak']),Jabatan:jb[j],Gaji:r.money([5e6,9e6,16e6][j],[8e6,14e6,28e6][j],50000),Lembur:r.int(0,40)}})}},
];
const pvAgg={sum:'total',avg:'rata-rata',max:'nilai tertinggi',count:'jumlah baris'};
const pvData=(r)=>{const S=r.pick(PVSETS);const data=S.gen(r,r.int(28,40));return{S,data,fields:[...S.text,...S.num]}};
const pvItems=(data,f)=>[...new Set(data.map(d=>d[f]))].sort();
const pv=(level,key,title,make)=>add(key,level,'PivotTable',title,r=>{const{S,data,fields}=pvData(r);const m=make(r,S,data);
  return{pivot:{data,fields,numeric:S.num,sheetName:S.name,target:m.target},text:m.text+` <span class="muted">Sumber: sheet ${S.name} (${data.length} baris).</span>`,hint:m.hint,use:null}});
pv('Menengah','pv-total','Total per kelompok',(r,S)=>{const a=r.pick(S.text),n=r.pick(S.num);
  return{target:{rows:[a],cols:[],vals:[{field:n,agg:'sum'}]},text:`Buat PivotTable yang menampilkan <b>total ${n}</b> per <b>${a}</b>.`,hint:`Centang ${a} (masuk ke Rows) dan ${n} (masuk ke Values sebagai Sum).`}});
pv('Menengah','pv-hitung','Menghitung baris per kelompok',(r,S)=>{const a=r.pick(S.text);
  return{target:{rows:[a],cols:[],vals:[{field:'*',agg:'count'}]},text:`Buat PivotTable yang menghitung <b>jumlah baris data</b> per <b>${a}</b>.`,hint:`Taruh ${a} di Rows, lalu seret field apa saja ke Values dan pastikan ringkasannya Count. Field teks otomatis jadi Count.`}});
pv('Menengah','pv-rata','Rata-rata per kelompok',(r,S)=>{const a=r.pick(S.text),n=r.pick(S.num);
  return{target:{rows:[a],cols:[],vals:[{field:n,agg:'avg'}]},text:`Buat PivotTable yang menampilkan <b>rata-rata ${n}</b> per <b>${a}</b>.`,hint:'Setelah field angka masuk Values, klik namanya › Value Field Settings › Average.'}});
pv('Advanced','pv-silang','Tabel silang baris dan kolom',(r,S)=>{const[a,b]=r.sample(S.text,2),n=r.pick(S.num);
  return{target:{rows:[a],cols:[b],vals:[{field:n,agg:'sum'}]},text:`Buat tabel silang <b>total ${n}</b> dengan <b>${a}</b> di baris dan <b>${b}</b> di kolom.`,hint:`${b} diseret ke area Columns.`}});
pv('Advanced','pv-persen','Kontribusi dalam persen',(r,S)=>{const a=r.pick(S.text),n=r.pick(S.num);
  return{target:{rows:[a],cols:[],vals:[{field:n,agg:'sum',show:'pctGrand'}]},text:`Tampilkan <b>kontribusi tiap ${a}</b> terhadap total ${n}, dalam <b>persen dari Grand Total</b>.`,hint:'Klik kanan angka › Show Values As › % of Grand Total.'}});
pv('Advanced','pv-saring','Ringkasan dengan filter',(r,S,data)=>{const[a,c]=r.sample(S.text,2),n=r.pick(S.num);const it=r.pick(pvItems(data,c));
  return{target:{rows:[a],cols:[],vals:[{field:n,agg:'sum'}],filters:{[c]:[it]}},text:`Tampilkan <b>total ${n}</b> per <b>${a}</b>, khusus <b>${c} = ${it}</b> memakai area <b>Filters</b>.`,hint:`Seret ${c} ke Filters, lalu klik ▾ di atas pivot dan pilih ${it} saja.`}});
pv('Advanced','pv-dua-level','Dua level baris',(r,S)=>{const[a,b]=r.sample(S.text,2),n=r.pick(S.num);
  return{target:{rows:[a,b],cols:[],vals:[{field:n,agg:'sum'}]},text:`Buat PivotTable <b>total ${n}</b> dengan <b>${a}</b> sebagai baris utama dan <b>${b}</b> di bawahnya.`,hint:`Area Rows berisi ${a} di atas, ${b} di bawah. Urutan menentukan level.`}});
pv('Advanced','pv-urut','Peringkat dari yang terbesar',(r,S)=>{const a=r.pick(S.text),n=r.pick(S.num);
  return{target:{rows:[a],cols:[],vals:[{field:n,agg:'sum'}],sortDesc:a},text:`Tampilkan <b>total ${n}</b> per <b>${a}</b>, diurutkan dari yang <b>terbesar</b>.`,hint:'Klik kanan salah satu angka › Sort › Largest to Smallest.'}});
pv('Advanced','pv-maks','Nilai tertinggi per kelompok',(r,S)=>{const a=r.pick(S.text),n=r.pick(S.num);
  return{target:{rows:[a],cols:[],vals:[{field:n,agg:'max'}]},text:`Tampilkan <b>${n} tertinggi</b> untuk setiap <b>${a}</b>.`,hint:'Value Field Settings › Summarize value field by › Max.'}});
pv('Expert','pv-persen-kolom','Persen per kolom',(r,S)=>{const[a,b]=r.sample(S.text,2),n=r.pick(S.num);
  return{target:{rows:[a],cols:[b],vals:[{field:n,agg:'sum',show:'pctCol'}]},text:`Buat tabel silang ${n} (<b>${a}</b> di baris, <b>${b}</b> di kolom) yang menunjukkan <b>porsi tiap ${a} di dalam masing-masing ${b}</b> (setiap kolom berjumlah 100%).`,hint:'Show Values As › % of Column Total.'}});
pv('Expert','pv-dua-nilai','Dua ringkasan sekaligus',(r,S)=>{const a=r.pick(S.text),[n1,n2]=S.num;
  return{target:{rows:[a],cols:[],vals:[{field:n1,agg:'sum'},{field:n2,agg:'avg'}]},text:`Per <b>${a}</b>, tampilkan <b>total ${n1}</b> dan <b>rata-rata ${n2}</b> berdampingan.`,hint:`Dua field di Values. Ubah ${n2} ke Average lewat Value Field Settings. Σ Values otomatis muncul di Columns.`}});
pv('Expert','pv-silang-saring','Tabel silang dengan beberapa filter',(r,S,data)=>{const[a,b,c]=r.sample(S.text,3),n=r.pick(S.num);const its=r.sample(pvItems(data,c),2).sort();
  return{target:{rows:[a],cols:[b],vals:[{field:n,agg:'sum'}],filters:{[c]:its}},text:`Buat tabel silang <b>total ${n}</b> (${a} di baris, ${b} di kolom) hanya untuk <b>${c} ${its[0]} dan ${its[1]}</b>, memakai area Filters.`,hint:`Di filter ${c}, hapus centang (Select All), lalu centang ${its[0]} dan ${its[1]}.`}});
T_ALL=T;_DR={R,hash};
// Perkakas yang sama dipakai generator soal ujian (server).
DRILL_KIT={R,hash,tbl,col,C,D,rpx,tgl,idd,people,cityList,NAMES,LAST,CITY,PROD,CAT,DIV,MON,DOM,PVSETS,pvData,pvItems};
}
{
const SEEDS=100,LV=['Dasar','Menengah','Advanced','Expert'];
const order=[];LV.forEach(l=>{const ts=T_ALL.filter(t=>t.level===l);for(let k=1;k<=SEEDS;k++)ts.forEach(t=>order.push([t,k]))});
DRILL={levels:LV,seeds:SEEDS,templates:T_ALL,count:order.length,topics:[...new Set(T_ALL.map(t=>t.topic))],
  at:i=>{const[t,k]=order[i];return{t,k,id:'soal-'+t.key+'-'+k,num:i+1}},
  indexOf:id=>{const m=/^soal-(.+)-(\d+)$/.exec(id);if(!m)return-1;return order.findIndex(([t,k])=>t.key===m[1]&&k===+m[2])},
  build:id=>{const i=DRILL.indexOf(id);if(i<0)return null;const[t,k]=order[i];const r=_DR.R(_DR.hash(t.key+'#'+k));const p=t.gen(r);
    return Object.assign({id,kind:'drill',num:i+1,level:t.level,topic:t.topic,title:t.title,tkey:t.key,task:p.text,editable:p.target?[p.target].concat(p.editable||[]):[]},p,{fill:p.fill?{from:p.target,to:p.fill}:null,caseSensitive:p.cs})}};
}

export { DRILL, DRILL_KIT };
