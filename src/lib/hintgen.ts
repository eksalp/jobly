// Petunjuk langkah demi langkah yang disusun otomatis dari kunci jawaban.
// Tujuannya menjelaskan: apa yang dicari, data mana yang dipakai (beserta artinya), lalu langkah dari bagian
// paling dalam ke luar, dengan bahasa sehari-hari. Rumus lengkapnya tidak ditampilkan (itu tugas "Lihat jawaban").
import { XL } from '../engine/engine.js';
import { ALLFUNCS } from '../content/allfuncs.js';

type Node = any;
type Ctx = { data: Record<string, any>; steps: string[]; names: Set<string>; fns: Set<string>; orig: Map<string, string> };

const esc = (s: string) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as any)[c]);
const plain = (h: string) => String(h || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const FN = new Map<string, any>((ALLFUNCS as any[]).map(f => [f[0], f]));
const isText = (v: any) => typeof v === 'string' && v.trim() !== '' && v[0] !== '=';
const clean = (k: string) => k.replace(/\$/g, '');

function fmtVal(v: any) {
  if (v == null || v === '') return 'kosong';
  if (typeof v === 'number') return Math.abs(v) < 1 && v !== 0 ? String(+v.toFixed(4)).replace('.', ',') : v.toLocaleString('id-ID');
  if (typeof v === 'string' && v[0] === '=') return 'hasil rumus';
  return '"' + String(v) + '"';
}

/** Arti sebuah sel: label di kirinya, atau judul kolomnya. */
function cellLabel(k: string, data: Record<string, any>) {
  const p = XL.splitRef(clean(k)); const col = XL.colName(p.c);
  const left = p.c > 0 ? data[XL.colName(p.c - 1) + p.r] : null;
  const head = p.r > 1 ? data[col + '1'] : null;
  // tabel: judul kolom di baris 1, nama baris di kolom A
  if (isText(head)) { const rowName = p.c > 0 ? data['A' + p.r] : null; return isText(rowName) && String(rowName) !== String(head) ? `${head} untuk ${rowName}` : `${head} di baris ${p.r}`; }
  if (isText(left)) return String(left);
  return '';
}
function rangeLabel(a: string, b: string, data: Record<string, any>) {
  const A = XL.splitRef(clean(a)), B = XL.splitRef(clean(b));
  const headRow = A.r > 1 ? A.r - 1 : 1;
  const heads: string[] = [];
  for (let c = A.c; c <= B.c; c++) { const h = data[XL.colName(c) + headRow] ?? data[XL.colName(c) + '1']; if (isText(h)) heads.push(String(h)); }
  if (A.c === B.c) return heads.length ? `kolom ${heads[0]}` : '';
  if (A.r === B.r) { const l = A.c > 0 ? data[XL.colName(A.c - 1) + A.r] : null; return isText(l) ? `baris ${l}` : ''; }
  return heads.length ? `tabel ${heads[0]} sampai ${heads[heads.length - 1]}` : '';
}

/** Kata untuk satu argumen. */
function say(n: Node, c: Ctx): string {
  if (!n) return '';
  switch (n.t) {
    case 'val': return typeof n.v === 'string' ? `<code>"${esc(n.v)}"</code>` : typeof n.v === 'boolean' ? (n.v ? 'TRUE' : 'FALSE') : `<code>${String(n.v)}</code>`;
    case 'ref': { const l = cellLabel(n.k, c.data); return `<code>${esc(n.k)}</code>${l ? ` (${esc(l)})` : ''}`; }
    case 'range': { const l = rangeLabel(n.a, n.b, c.data); return `<code>${esc(n.a)}:${esc(n.b)}</code>${l ? ` (${esc(l)})` : ''}`; }
    case 'name': return `<b>${esc(c.orig.get(n.n) || n.n)}</b>`;
    case 'blank': return 'dikosongkan';
    case 'neg': return n.x.t === 'neg' ? `(${say(n.x.x, c)}, diubah jadi 1 kalau benar / 0 kalau salah)` : `minus ${say(n.x, c)}`;
    case 'pct': return `${say(n.x, c)} persen`;
    case 'arr': return 'daftar nilai tetap {…}';
    case 'bin': return binWords(n, c);
    case 'fn': case 'call': return `hasil langkah ${walk(n, c)}`;
  }
  return '…';
}
const OPW: Record<string, string> = { '*': '×', '/': '÷', '+': '+', '-': '−', '^': 'pangkat', '&': 'disambung dengan', '=': 'sama dengan', '<>': 'tidak sama dengan', '<': 'lebih kecil dari', '>': 'lebih besar dari', '<=': 'paling besar', '>=': 'minimal' };
function binWords(n: Node, c: Ctx): string {
  const cmp = ['=', '<>', '<', '>', '<=', '>='];
  const side = (x: Node, right: boolean) => {
    if (x.t !== 'bin' || x.o === '&') return say(x, c);
    const need = x.o !== n.o || (right && ['-', '/'].includes(n.o)) || cmp.includes(x.o);
    return need ? '(' + binWords(x, c) + ')' : binWords(x, c);
  };
  return `${side(n.l, false)} ${OPW[n.o] || n.o} ${side(n.r, true)}`;
}
/** Kriteria SUMIF/COUNTIF dalam kata. */
function crit(n: Node, c: Ctx) {
  const opw = (s: string) => ({ '>': 'lebih dari', '<': 'kurang dari', '>=': 'minimal', '<=': 'maksimal', '<>': 'bukan', '=': 'sama dengan' } as any)[s];
  if (n?.t === 'val' && typeof n.v === 'string') {
    const m = /^(>=|<=|<>|>|<|=)(.*)$/.exec(n.v);
    if (m) return `${opw(m[1])} ${m[2] === '' ? 'kosong' : '<code>' + esc(m[2]) + '</code>'}`;
    return `sama dengan <code>"${esc(n.v)}"</code>`;
  }
  if (n?.t === 'bin' && n.o === '&' && n.l.t === 'val' && typeof n.l.v === 'string' && opw(n.l.v)) return `${opw(n.l.v)} ${say(n.r, c)}`;
  return `sama dengan ${say(n, c)}`;
}
function digits(n: Node) {
  const d = n?.t === 'val' ? Number(n.v) : n?.t === 'neg' && n.x.t === 'val' ? -Number(n.x.v) : NaN;
  if (isNaN(d)) return 'jumlah digit yang diminta';
  if (d === 0) return 'bilangan bulat (tanpa desimal)';
  if (d > 0) return `${d} angka di belakang koma`;
  return { '-1': 'puluhan', '-2': 'ratusan', '-3': 'ribuan', '-4': 'puluh ribuan', '-5': 'ratus ribuan', '-6': 'jutaan' }[String(d)] || `${d} digit`;
}
function pairs(args: Node[], start: number, c: Ctx) {
  const out: string[] = [];
  for (let i = start; i + 1 < args.length; i += 2) out.push(`${say(args[i], c)} ${crit(args[i + 1], c)}`);
  return out.join(', <b>dan</b> ');
}

/** Satu langkah untuk satu fungsi. Mengembalikan nomor langkahnya. */
function walk(n: Node, c: Ctx): number {
  if (n._step) return n._step;
  const k = walkOnce(n, c); n._step = k; return k;
}
function walkOnce(n: Node, c: Ctx): number {
  if (n.t === 'call') { const s = `Jalankan fungsi kecil (LAMBDA) itu dengan ${n.args.map((a: Node) => say(a, c)).join(', ')}.`; c.steps.push(s); return c.steps.length; }
  const F = String(n.n).toUpperCase(); const a: Node[] = n.args || []; c.fns.add(F);
  if (F === 'LET') {
    for (let i = 0; i + 1 < a.length; i += 2) { if (a[i].t === 'name') c.names.add(a[i].n); c.steps.push(`Beri nama <b>${esc(c.orig.get(a[i].n) || a[i].n)}</b> untuk ${say(a[i + 1], c)}. Nama ini dipakai lagi di langkah berikutnya supaya rumus tidak diulang-ulang.`); }
    const last = say(a[a.length - 1], c); c.steps.push(`Hasil akhir LET adalah ${last}.`); return c.steps.length;
  }
  if (F === 'LAMBDA') {
    const params = a.slice(0, -1).map(x => `<b>${esc(c.orig.get(x.n) || x.n || '?')}</b>`).join(', ');
    a.slice(0, -1).forEach(x => x.n && c.names.add(x.n));
    c.steps.push(`Buat rumus kecil (LAMBDA) dengan nama sementara ${params}: ${say(a[a.length - 1], c)}.`); return c.steps.length;
  }
  const s = (i: number) => say(a[i], c);
  let t = '';
  switch (F) {
    case 'SUM': t = `Jumlahkan ${a.map((_, i) => s(i)).join(' dan ')}.`; break;
    case 'AVERAGE': t = `Hitung rata-rata ${a.map((_, i) => s(i)).join(' dan ')}.`; break;
    case 'COUNT': t = `Hitung berapa sel berisi <b>angka</b> di ${s(0)}.`; break;
    case 'COUNTA': t = `Hitung berapa sel yang <b>tidak kosong</b> di ${s(0)}.`; break;
    case 'COUNTBLANK': t = `Hitung berapa sel yang <b>kosong</b> di ${s(0)}.`; break;
    case 'MAX': t = `Ambil nilai <b>terbesar</b> dari ${a.map((_, i) => s(i)).join(', ')}.`; break;
    case 'MIN': t = `Ambil nilai <b>terkecil</b> dari ${a.map((_, i) => s(i)).join(', ')}.`; break;
    case 'LARGE': t = `Ambil nilai terbesar ke-${s(1)} dari ${s(0)}.`; break;
    case 'SMALL': t = `Ambil nilai terkecil ke-${s(1)} dari ${s(0)}.`; break;
    case 'ROUND': t = `Bulatkan ${s(0)} ke ${digits(a[1])}.`; break;
    case 'ROUNDUP': t = `Bulatkan ${s(0)} <b>ke atas</b> ke ${digits(a[1])}.`; break;
    case 'ROUNDDOWN': t = `Bulatkan ${s(0)} <b>ke bawah</b> ke ${digits(a[1])}.`; break;
    case 'INT': t = `Buang angka di belakang koma dari ${s(0)} (bulatkan ke bawah).`; break;
    case 'ABS': t = `Ambil nilai mutlak ${s(0)} (tanda minus dibuang, jadi selisih ke atas atau ke bawah dihitung sama).`; break;
    case 'MOD': t = `Hitung sisa pembagian ${s(0)} dibagi ${s(1)}. Sisa 0 berarti habis dibagi.`; break;
    case 'IF': t = `Cek syarat: ${s(0)}. Kalau <b>benar</b>, hasilnya ${s(1)}${a.length > 2 ? `; kalau <b>salah</b>, hasilnya ${s(2)}` : ''}.`; break;
    case 'IFS': { const parts: string[] = []; for (let i = 0; i + 1 < a.length; i += 2) parts.push(`kalau ${s(i)} → ${s(i + 1)}`); t = `Cek syarat satu per satu dari atas (yang pertama benar yang dipakai): ${parts.join('; ')}.`; break; }
    case 'SWITCH': { const parts: string[] = []; for (let i = 1; i + 1 < a.length; i += 2) parts.push(`${s(i)} → ${s(i + 1)}`); t = `Lihat isi ${s(0)}, lalu terjemahkan: ${parts.join(', ')}${a.length % 2 === 0 ? `; selain itu ${s(a.length - 1)}` : ''}.`; break; }
    case 'IFERROR': t = `Hitung ${s(0)}; kalau hasilnya error, tampilkan ${s(1)} sebagai gantinya.`; break;
    case 'IFNA': t = `Hitung ${s(0)}; kalau tidak ketemu (#N/A), tampilkan ${s(1)}.`; break;
    case 'AND': t = `Pastikan <b>semua</b> syarat ini benar: ${a.map((_, i) => s(i)).join('; ')}.`; break;
    case 'OR': t = `Cukup <b>salah satu</b> syarat ini benar: ${a.map((_, i) => s(i)).join('; ')}.`; break;
    case 'NOT': t = `Balikkan ${s(0)} (benar jadi salah, salah jadi benar).`; break;
    case 'SUMIF': t = `Jumlahkan ${a[2] ? s(2) : s(0)} <b>hanya</b> untuk baris yang ${s(0)} ${crit(a[1], c)}.`; break;
    case 'SUMIFS': t = `Jumlahkan ${s(0)} <b>hanya</b> untuk baris yang ${pairs(a, 1, c)}.`; break;
    case 'COUNTIF': t = `Hitung berapa sel di ${s(0)} yang ${crit(a[1], c)}.`; break;
    case 'COUNTIFS': t = `Hitung berapa baris yang ${pairs(a, 0, c)}.`; break;
    case 'AVERAGEIF': t = `Hitung rata-rata ${a[2] ? s(2) : s(0)} hanya untuk baris yang ${s(0)} ${crit(a[1], c)}.`; break;
    case 'AVERAGEIFS': t = `Hitung rata-rata ${s(0)} hanya untuk baris yang ${pairs(a, 1, c)}.`; break;
    case 'MAXIFS': t = `Ambil nilai terbesar di ${s(0)} hanya dari baris yang ${pairs(a, 1, c)}.`; break;
    case 'MINIFS': t = `Ambil nilai terkecil di ${s(0)} hanya dari baris yang ${pairs(a, 1, c)}.`; break;
    case 'SUMPRODUCT': t = a.length === 1 ? `Jumlahkan semua hasil dari ${s(0)}. Syarat yang benar dihitung 1, yang salah 0, jadi ini menghitung/menjumlahkan baris yang lolos syarat.` : `Kalikan ${a.map((_, i) => s(i)).join(' dengan ')} <b>baris per baris</b>, lalu jumlahkan semua hasilnya.`; break;
    case 'VLOOKUP': t = `Cari ${s(0)} di kolom <b>pertama</b> ${s(1)}, lalu ambil isi kolom ke-${s(2)} pada baris yang ketemu. ${a[3] && (a[3].v === false || a[3].v === 0) ? 'Pakai FALSE supaya yang dicari harus <b>persis sama</b>.' : 'Tanpa FALSE / dengan TRUE berarti pencarian <b>rentang</b>: diambil batas terdekat yang lebih kecil (tabel harus urut naik).'}`; break;
    case 'HLOOKUP': t = `Cari ${s(0)} di baris <b>pertama</b> ${s(1)}, lalu ambil isi baris ke-${s(2)}.`; break;
    case 'XLOOKUP': {
      const mode = a[4] && a[4].t !== 'blank' ? (a[4].t === 'neg' ? -Number(a[4].x.v) : Number(a[4].v)) : 0;
      t = `Cari ${s(0)} di ${s(1)}, lalu ambil pasangannya dari ${s(2)}.` + (a[3] && a[3].t !== 'blank' ? ` Kalau tidak ketemu, tampilkan ${s(3)}.` : '') +
        (mode === -1 ? ' Mode <code>-1</code>: kalau tidak ada yang persis sama, ambil yang <b>terdekat lebih kecil</b> (cocok untuk tabel batas bawah seperti tarif bertingkat).' : mode === 1 ? ' Mode <code>1</code>: kalau tidak ada yang sama, ambil yang terdekat lebih besar.' : '');
      break;
    }
    case 'MATCH': case 'XMATCH': t = `Cari ${s(0)} di ${s(1)} dan ambil <b>posisinya</b> (urutan ke berapa).${F === 'MATCH' && a[2] && Number(a[2].v) === 0 ? ' Angka 0 berarti harus persis sama.' : ''}`; break;
    case 'INDEX': t = `Ambil isi ${s(0)} pada baris ke-${s(1)}${a[2] && a[2].t !== 'blank' ? ` dan kolom ke-${s(2)}` : ''}.`; break;
    case 'LOOKUP': t = `Cari ${s(0)} di ${s(1)} (pencarian rentang, ambil batas terdekat yang lebih kecil), lalu ambil pasangannya${a[2] ? ` dari ${s(2)}` : ''}.`; break;
    case 'CHOOSE': t = `Pilih salah satu dari daftar berdasarkan nomor di ${s(0)}.`; break;
    case 'LEFT': t = `Ambil ${a[1] ? s(1) : '1'} karakter dari <b>kiri</b> ${s(0)}.`; break;
    case 'RIGHT': t = `Ambil ${a[1] ? s(1) : '1'} karakter dari <b>kanan</b> ${s(0)}.`; break;
    case 'MID': t = `Ambil ${s(2)} karakter dari ${s(0)}, mulai dari karakter ke-${s(1)}.`; break;
    case 'LEN': t = `Hitung jumlah karakter ${s(0)}.`; break;
    case 'TRIM': t = `Buang spasi berlebih di ${s(0)} (depan, belakang, dan spasi ganda di tengah).`; break;
    case 'UPPER': t = `Ubah ${s(0)} jadi HURUF BESAR semua.`; break;
    case 'LOWER': t = `Ubah ${s(0)} jadi huruf kecil semua.`; break;
    case 'PROPER': t = `Ubah ${s(0)} jadi Huruf Besar Di Awal Setiap Kata.`; break;
    case 'SUBSTITUTE': t = `Di ${s(0)}, ganti setiap ${s(1)} dengan ${s(2)}.`; break;
    case 'FIND': case 'SEARCH': t = `Cari posisi ${s(0)} di dalam ${s(1)}.`; break;
    case 'TEXT': t = `Ubah ${s(0)} jadi teks dengan format ${s(1)}.`; break;
    case 'VALUE': t = `Ubah teks ${s(0)} jadi angka.`; break;
    case 'CONCAT': case 'CONCATENATE': t = `Sambungkan ${a.map((_, i) => s(i)).join(', ')} jadi satu teks.`; break;
    case 'TEXTJOIN': t = `Gabungkan semua isi ${a.slice(2).map((_, i) => s(i + 2)).join(', ')} jadi satu teks, dipisah ${s(0)}${a[1] && a[1].v === true ? ', dan lewati yang kosong' : ''}.`; break;
    case 'TEXTBEFORE': t = `Ambil bagian ${s(0)} <b>sebelum</b> ${s(1)}.`; break;
    case 'TEXTAFTER': t = `Ambil bagian ${s(0)} <b>sesudah</b> ${s(1)}.`; break;
    case 'TEXTSPLIT': t = `Pecah ${s(0)} di setiap ${s(1)} jadi beberapa kolom.`; break;
    case 'REGEXEXTRACT': t = `Ambil bagian ${s(0)} yang cocok dengan pola ${s(1)}.`; break;
    case 'DATE': t = `Susun tanggal dari tahun ${s(0)}, bulan ${s(1)}, tanggal ${s(2)}.`; break;
    case 'YEAR': t = `Ambil <b>tahun</b> dari ${s(0)}.`; break;
    case 'MONTH': t = `Ambil <b>bulan</b> (1–12) dari ${s(0)}.`; break;
    case 'DAY': t = `Ambil <b>tanggal</b> (1–31) dari ${s(0)}.`; break;
    case 'TODAY': t = 'Ambil tanggal hari ini.'; break;
    case 'WEEKDAY': t = `Cari hari ke berapa ${s(0)} dalam seminggu${a[1] && Number(a[1].v) === 2 ? ' (mode 2: Senin = 1 … Sabtu = 6, Minggu = 7)' : ''}.`; break;
    case 'EOMONTH': t = `Cari tanggal <b>akhir bulan</b> dari ${s(0)}, digeser ${s(1)} bulan.`; break;
    case 'EDATE': t = `Geser tanggal ${s(0)} sebanyak ${s(1)} bulan.`; break;
    case 'DATEDIF': { const u = String(a[2]?.v || '').toLowerCase(); t = `Hitung selisih dari ${s(0)} sampai ${s(1)} dalam ${{ y: 'tahun penuh', m: 'bulan penuh', d: 'hari', ym: 'sisa bulan setelah tahun penuh', md: 'sisa hari setelah bulan penuh' }[u] || 'satuan ' + s(2)}.`; break; }
    case 'NETWORKDAYS': t = `Hitung hari kerja (Senin–Jumat) dari ${s(0)} sampai ${s(1)}${a[2] ? `, tanpa hari libur di ${s(2)}` : ''}.`; break;
    case 'WORKDAY': t = `Cari tanggal setelah ${s(1)} hari kerja dari ${s(0)}${a[2] ? `, melewati libur di ${s(2)}` : ''}.`; break;
    case 'PMT': t = `Hitung cicilan per periode: bunga per periode ${s(0)}, jumlah periode ${s(1)}, pokok pinjaman ${s(2)}. (Pokok diberi tanda minus supaya cicilannya positif.)`; break;
    case 'PV': t = `Hitung nilai <b>sekarang</b> dari pembayaran ${s(2)} per periode, bunga ${s(0)}, selama ${s(1)} periode.`; break;
    case 'FV': t = `Hitung nilai di <b>akhir</b> periode: bunga ${s(0)}, ${s(1)} periode, setoran ${s(2)}${a[3] ? `, saldo awal ${s(3)}` : ''}.`; break;
    case 'RATE': t = `Cari bunga per periode dari ${s(0)} periode, cicilan ${s(1)}, dan pinjaman ${s(2)}.`; break;
    case 'NPER': t = `Hitung berapa periode yang dibutuhkan: bunga ${s(0)}, setoran ${s(1)}${a[2] ? `, saldo awal ${s(2)}` : ''}${a[3] ? `, target ${s(3)}` : ''}.`; break;
    case 'NPV': t = `Hitung nilai sekarang arus kas ${a.slice(1).map((_, i) => s(i + 1)).join(', ')} dengan tingkat diskonto ${s(0)}. Ingat: NPV mulai mendiskonto dari periode 1.`; break;
    case 'IRR': t = `Cari tingkat imbal hasil yang membuat total nilai sekarang ${s(0)} sama dengan nol.`; break;
    case 'XNPV': t = `Hitung nilai sekarang arus kas ${s(1)} pada tanggal ${s(2)} dengan tingkat ${s(0)}.`; break;
    case 'XIRR': t = `Cari imbal hasil tahunan dari arus kas ${s(0)} pada tanggal ${s(1)}.`; break;
    case 'IPMT': t = `Hitung porsi <b>bunga</b> pada cicilan ke-${s(1)} (bunga ${s(0)}, tenor ${s(2)}, pokok ${s(3)}).`; break;
    case 'PPMT': t = `Hitung porsi <b>pokok</b> pada cicilan ke-${s(1)} (bunga ${s(0)}, tenor ${s(2)}, pokok ${s(3)}).`; break;
    case 'CUMIPMT': t = `Jumlahkan bunga dari cicilan ke-${s(3)} sampai ke-${s(4)} (bunga ${s(0)}, tenor ${s(1)}, pokok ${s(2)}).`; break;
    case 'CUMPRINC': t = `Jumlahkan pokok yang dibayar dari cicilan ke-${s(3)} sampai ke-${s(4)} (bunga ${s(0)}, tenor ${s(1)}, pokok ${s(2)}).`; break;
    case 'SLN': t = `Hitung penyusutan garis lurus per tahun: (harga ${s(0)} − nilai sisa ${s(1)}) ÷ umur ${s(2)}.`; break;
    case 'DDB': t = `Hitung penyusutan saldo menurun ganda tahun ke-${s(3)} (harga ${s(0)}, sisa ${s(1)}, umur ${s(2)}).`; break;
    case 'SYD': t = `Hitung penyusutan jumlah angka tahun untuk tahun ke-${s(3)} (harga ${s(0)}, sisa ${s(1)}, umur ${s(2)}).`; break;
    case 'DB': t = `Hitung penyusutan saldo menurun tetap tahun ke-${s(3)} (harga ${s(0)}, sisa ${s(1)}, umur ${s(2)}).`; break;
    case 'EFFECT': t = `Ubah bunga nominal ${s(0)} jadi bunga efektif per tahun (dimajemukkan ${s(1)} kali).`; break;
    case 'NOMINAL': t = `Ubah bunga efektif ${s(0)} jadi bunga nominal (dimajemukkan ${s(1)} kali).`; break;
    case 'FILTER': t = `Saring ${s(0)}: ambil hanya baris yang memenuhi ${s(1)}.${a[2] ? ` Kalau tidak ada, tampilkan ${s(2)}.` : ''}`; break;
    case 'SORT': t = `Urutkan ${s(0)}.`; break;
    case 'SORTBY': t = `Urutkan ${s(0)} berdasarkan ${s(1)}${a[2] && (a[2].t === 'neg' || Number(a[2].v) === -1) ? ' dari yang <b>terbesar</b>' : ' dari yang terkecil'}.`; break;
    case 'UNIQUE': t = `Ambil daftar nilai unik (tanpa dobel) dari ${s(0)}.`; break;
    case 'TAKE': t = `Ambil ${s(1)} baris pertama dari ${s(0)}.`; break;
    case 'DROP': t = `Buang ${s(1)} baris dari ${s(0)}.`; break;
    case 'SEQUENCE': t = `Buat deret angka berurutan sebanyak ${s(0)}${a[2] ? `, mulai dari ${s(2)}` : ''}.`; break;
    case 'VSTACK': t = `Tumpuk ${a.map((_, i) => s(i)).join(' di atas ')} jadi satu daftar.`; break;
    case 'HSTACK': t = `Jejerkan ${a.map((_, i) => s(i)).join(' di samping ')}.`; break;
    case 'MAP': { const k = s(a.length - 1); t = `Untuk <b>setiap</b> isi ${a.slice(0, -1).map((_, i) => s(i)).join(' dan ')} (berpasangan, satu per satu), jalankan ${k.replace('hasil langkah', 'rumus kecil di langkah')}.`; break; }
    case 'SCAN': { const k = s(2); t = `Hitung nilai <b>berjalan</b> (kumulatif) dari ${s(1)}, mulai dari ${s(0)}: setiap isi diolah dengan ${k.replace('hasil langkah', 'rumus kecil di langkah')}, dan hasil tiap langkah ikut ditampilkan.`; break; }
    case 'REDUCE': { const k = s(2); t = `Olah ${s(1)} satu per satu, mulai dari ${s(0)}, dengan ${k.replace('hasil langkah', 'rumus kecil di langkah')}, sampai jadi satu hasil.`; break; }
    case 'BYROW': { const k = s(1); t = `Untuk setiap baris ${s(0)}, jalankan ${k.replace('hasil langkah', 'rumus kecil di langkah')}.`; break; }
    case 'CEILING': case 'CEILING.MATH': t = `Bulatkan ${s(0)} <b>ke atas</b> ke kelipatan ${a[1] ? s(1) : '1'}.`; break;
    case 'FLOOR': case 'FLOOR.MATH': t = `Bulatkan ${s(0)} <b>ke bawah</b> ke kelipatan ${a[1] ? s(1) : '1'}.`; break;
    case 'MROUND': t = `Bulatkan ${s(0)} ke kelipatan ${s(1)} terdekat.`; break;
    case 'QUOTIENT': t = `Ambil hasil bagi bulat ${s(0)} dibagi ${s(1)} (sisanya dibuang).`; break;
    case 'TRUNC': t = `Potong angka di belakang koma dari ${s(0)}.`; break;
    case 'ISERROR': t = `Cek apakah ${s(0)} menghasilkan error.`; break;
    case 'ISTEXT': t = `Cek apakah ${s(0)} berupa teks.`; break;
    case 'HOUR': t = `Ambil jam dari ${s(0)}.`; break;
    case 'MINUTE': t = `Ambil menit dari ${s(0)}.`; break;
    case 'NETWORKDAYS.INTL': t = `Hitung hari kerja dari ${s(0)} sampai ${s(1)} dengan pola akhir pekan ${s(2)}${a[3] ? `, tanpa libur di ${s(3)}` : ''}.`; break;
    case 'WORKDAY.INTL': t = `Cari tanggal setelah ${s(1)} hari kerja dari ${s(0)} dengan pola akhir pekan ${s(2)}.`; break;
    case 'OFFSET': t = `Mulai dari ${s(0)}, geser ${s(1)} baris dan ${s(2)} kolom${a[3] ? `, lalu ambil ${s(3)} baris` : ''}${a[4] ? ` × ${s(4)} kolom` : ''}.`; break;
    case 'GROUPBY': t = `Kelompokkan berdasarkan ${s(0)}, lalu ringkas ${s(1)}.`; break;
    case 'STDEV.S': case 'STDEV': t = `Hitung simpangan baku (seberapa menyebar) ${s(0)}.`; break;
    case 'MEDIAN': t = `Ambil nilai tengah ${s(0)}.`; break;
    case 'RANK': case 'RANK.EQ': t = `Cari peringkat ${s(0)} di antara ${s(1)}.`; break;
    case 'ISNUMBER': t = `Cek apakah ${s(0)} berupa angka (TRUE/FALSE).`; break;
    case 'ISBLANK': t = `Cek apakah ${s(0)} kosong.`; break;
    case 'N': t = `Ubah ${s(0)} jadi angka (kosong atau teks jadi 0).`; break;
    default: {
      const f = FN.get(F);
      t = `Pakai <b>${F}</b>${f ? ` (${esc(f[3]).replace(/\.$/, '')})` : ''} dengan ${a.map((_, i) => s(i)).join(', ') || 'argumen yang sesuai'}.`;
    }
  }
  c.steps.push(t); return c.steps.length;
}

export type Guide = { goal: string; inputs: string[]; steps: string[]; fns: [string, string, string][]; after: string[]; tip: string };

/** Susun petunjuk untuk satu tugas. Mengembalikan null kalau kunci jawaban tidak bisa diurai. */
export function buildGuide(task: { target: string; solution: string; text?: string; hint?: string; fill?: string[] | null; abs?: string }, data: Record<string, any>, fmt?: (k: string) => string | undefined, filled: string[] = []): Guide | null {
  const sol = String(task.solution || '');
  if (sol[0] !== '=') return null;
  let ast: Node;
  try { ast = XL.parse(sol.slice(1)); } catch { return null; }
  const orig = new Map<string, string>();
  for (const m of sol.replace(/"(?:[^"]|"")*"/g, '').matchAll(/[A-Za-z_][A-Za-z0-9_.]*/g)) if (m[0] !== m[0].toUpperCase()) orig.set(m[0].toUpperCase(), m[0]);
  const c: Ctx = { data, steps: [], names: new Set(), fns: new Set(), orig };
  // langkah
  if (ast.t === 'fn' || ast.t === 'call') walk(ast, c);
  else if (ast.t === 'bin' || ast.t === 'neg') c.steps.push(`Hitung: ${say(ast, c)}. <i>Ini hasil akhirnya.</i>`);
  else if (ast.t === 'ref' || ast.t === 'range') c.steps.push(`Ambil isi ${say(ast, c)}.`);
  if (c.steps.length && (ast.t === 'fn' || ast.t === 'call')) c.steps[c.steps.length - 1] += ' <i>Ini hasil akhirnya.</i>';
  // data yang dipakai
  const seen = new Set<string>(); const inputs: string[] = [];
  for (const tk of XL.tokenize(sol) as any[]) {
    if (tk.type !== 'ref') continue;
    const key = clean(tk.v); if (seen.has(key)) continue; seen.add(key);
    if (key.includes(':')) {
      const [a, b] = key.split(':'); const l = rangeLabel(a, b, data);
      const A = XL.splitRef(a), B = XL.splitRef(b); const n = (B.r - A.r + 1) * (B.c - A.c + 1);
      inputs.push(`<code>${a}:${b}</code>${l ? ` = ${esc(l)}` : ''} <span class="muted">(${n} sel)</span>`);
    } else {
      if (key === clean(task.target)) continue;
      const l = cellLabel(key, data); const v = data[key];
      const f = fmt?.(key);
      const shown = typeof v === 'number' && f === 'pct' ? (Math.round(v * 10000) / 100).toLocaleString('id-ID') + '%' : typeof v === 'number' && f === 'date' ? 'tanggal' : fmtVal(v);
      const note = (v == null || v === '') ? (filled.includes(key) ? 'diisi di tugas sebelumnya' : 'masih kosong') : 'isinya ' + shown;
      inputs.push(`<code>${key}</code>${l ? ` = ${esc(l)}` : ''} <span class="muted">(${esc(note)})</span>`);
    }
  }
  // fungsi yang dipakai
  const fns: [string, string, string][] = [...c.fns].filter(n => FN.has(n)).map(n => { const f = FN.get(n); return [n, f[2], f[3]]; });
  // setelah rumus jadi
  const after: string[] = [];
  const absRefs = [...new Set((sol.match(/\$?[A-Z]{1,3}\$\d+|\$[A-Z]{1,3}\$?\d+/g) || []))];
  if (task.fill && task.fill.length) {
    after.push(`Rumus ini nanti disalin ke ${task.fill[0]}${task.fill.length > 1 ? ':' + task.fill[task.fill.length - 1] : ''}. Tulis rumus untuk <code>${task.target}</code> saja, tekan <b>Salin ke bawah</b>, lalu cek beberapa baris hasilnya.`);
    const rel = ((XL.tokenize(sol) as any[]).find(t => t.type === 'ref' && !t.v.includes('$') && !t.v.includes(':'))?.v) as string | undefined;
    const row1 = rel ? XL.splitRef(rel) : null;
    if (absRefs.length) after.push(`Alamat yang <b>harus tetap</b> walaupun rumus disalin dikunci dengan tanda $ (klik alamatnya di bar rumus lalu tekan F4): ${absRefs.map(r => `<code>${r}</code>`).join(', ')}.`);
    if (row1) after.push(`Alamat tanpa $ seperti <code>${rel}</code> memang dibiarkan ikut bergeser jadi <code>${XL.colName(row1.c)}${row1.r + 1}</code>, <code>${XL.colName(row1.c)}${row1.r + 2}</code>, dan seterusnya, supaya setiap baris menghitung datanya sendiri.`);
  }
  const goal = plain(task.text || '');
  return { goal: goal || `Isi sel ${task.target}.`, inputs, steps: c.steps, fns, after, tip: task.hint || '' };
}

/** HTML petunjuk untuk panel Petunjuk. */
export function guideHtml(g: Guide, target: string) {
  const li = (xs: string[]) => xs.map(x => `<li>${x}</li>`).join('');
  return `<div class="guide">
<p class="g-h">Yang dicari</p><p>${esc(g.goal)}</p>
${g.inputs.length ? `<p class="g-h">Data yang dipakai</p><ul>${li(g.inputs)}</ul>` : ''}
${g.steps.length ? `<p class="g-h">Langkah pengerjaan (dari bagian paling dalam)</p><ol>${li(g.steps)}</ol>` : ''}
${g.fns.length ? `<p class="g-h">Fungsi yang dipakai</p><ul>${li(g.fns.map(([n, sx, d]) => `<b>${n}</b> · <code>${esc(sx)}</code><br><span class="muted">${esc(d)}</span>`))}</ul>` : ''}
${g.after.length ? `<p class="g-h">Setelah rumus di ${target} jadi</p><ul>${li(g.after)}</ul>` : ''}
${g.tip ? `<p class="g-h">Catatan</p><p>${g.tip}</p>` : ''}
<p class="muted g-foot">Ketik rumusnya sendiri dulu. Masih buntu? Tekan <b>Lihat jawaban</b>.</p></div>`;
}
