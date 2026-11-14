// Simulasi Page Layout + Print Preview: orientasi, ukuran kertas, margin, Print Area, Print Titles,
// Scaling (Fit All Columns on One Page), header/footer nomor halaman. Pratinjau menghitung pembagian halaman.
import { useEffect, useMemo, useState } from 'react';
import { L, Missions, rp, useMissions, type Mission } from './kit';

type Orient = 'portrait' | 'landscape';
type Paper = 'A4' | 'F4';
type Margin = 'normal' | 'narrow' | 'wide';
type Scale = 'none' | 'cols' | 'rows' | 'all';
const HEAD = ['No', 'Tanggal', 'Faktur', 'Pelanggan', 'Cabang', 'Produk', 'Qty', 'Harga', 'Total', 'Catatan internal'];
const W = [4, 10, 10, 18, 10, 16, 5, 11, 12, 22]; // lebar kolom (karakter)
const NAMES = ['PT Prima Kemas', 'CV Sumber Plastik', 'UD Sejahtera', 'PT Arunika Pack', 'PT Delta Pangan', 'Toko Makmur'];
const CAB = ['Jakarta', 'Bandung', 'Surabaya', 'Medan'], PRD = ['Kardus A4', 'Plastik roll', 'Lakban coklat', 'Bubble wrap', 'Label stiker'];
const N = 64;
const DATA = Array.from({ length: N }, (_, i) => { const q = 3 + (i * 7) % 40, h = [12500, 48000, 9500, 65000, 22000][i % 5]; return [i + 1, `${String(1 + (i % 28)).padStart(2, '0')}/10/2026`, 'INV-' + (2101 + i), NAMES[i % 6], CAB[(i * 3) % 4], PRD[i % 5], q, h, q * h, i % 9 === 0 ? 'cek ulang harga' : '']; });
// kapasitas kira-kira per halaman (karakter lebar × baris) pada skala 100%
const CAP: Record<Paper, Record<Orient, [number, number]>> = { A4: { portrait: [92, 48], landscape: [134, 32] }, F4: { portrait: [92, 56], landscape: [150, 32] } };
const MARG: Record<Margin, number> = { narrow: 1.12, normal: 1, wide: .86 };

const MISSIONS: Mission[] = [
  { id: 'p1', text: 'Tabelnya lebar. Ubah <b>Orientation</b> menjadi <b>Landscape</b>.' },
  { id: 'p2', text: 'Kolom Catatan internal tidak perlu dicetak: set <b>Print Area</b> ke <code>A1:I65</code>.' },
  { id: 'p3', text: 'Pastikan semua kolom muat selebar satu halaman: Scaling › <b>Fit All Columns on One Page</b>.' },
  { id: 'p4', text: 'Judul kolom muncul lagi di setiap halaman: <b>Print Titles</b> › Rows to repeat at top <code>$1:$1</code>.' },
  { id: 'p5', text: 'Tambahkan footer nomor halaman: <b>Page 1 of ?</b>.' },
];

export function PageSetupSim() {
  const [orient, setOrient] = useState<Orient>('portrait');
  const [paper, setPaper] = useState<Paper>('A4');
  const [margin, setMargin] = useState<Margin>('normal');
  const [scale, setScale] = useState<Scale>('none');
  const [area, setArea] = useState('');
  const [titles, setTitles] = useState('');
  const [footer, setFooter] = useState('none');
  const [dlg, setDlg] = useState<null | 'area' | 'titles'>(null);
  const [draft, setDraft] = useState('');
  const [page, setPage] = useState(0);
  const { done, mark } = useMissions();

  const areaCols = /^\$?A\$?1:\$?([A-J])\$?\d+$/i.test(area.trim()) ? area.trim().toUpperCase().replace(/\$/g, '').split(':')[1].charCodeAt(0) - 64 : HEAD.length;
  const areaRows = /^\$?A\$?1:\$?[A-J]\$?(\d+)$/i.exec(area.trim().replace(/\$/g, '')) ? Math.min(N + 1, +/(\d+)$/.exec(area.trim())![1]) : N + 1;
  const repeat = /^\$?1:\$?1$/.test(titles.trim().replace(/\s/g, ''));
  const pages = useMemo(() => {
    const [cw, rh] = CAP[paper][orient], m = MARG[margin];
    const totW = W.slice(0, areaCols).reduce((a, b) => a + b, 0);
    let f = 1;
    if (scale === 'cols' || scale === 'all') f = Math.min(1, (cw * m) / totW);
    const capW = (cw * m) / f, capR = Math.floor((rh * m) / f);
    const colSets: number[][] = []; let cur: number[] = [], w = 0;
    for (let c = 0; c < areaCols; c++) { if (w + W[c] > capW && cur.length) { colSets.push(cur); cur = []; w = 0; } cur.push(c); w += W[c]; }
    if (cur.length) colSets.push(cur);
    const body = areaRows - 1, rowsFirst = capR - 1, rowsNext = repeat ? capR - 1 : capR;
    const rowSets: number[][] = []; let r = 0, first = true;
    if (scale === 'all') rowSets.push(Array.from({ length: body }, (_, i) => i));
    else while (r < body) { const n = first ? rowsFirst : rowsNext; rowSets.push(Array.from({ length: Math.min(n, body - r) }, (_, i) => r + i)); r += n; first = false; }
    const out: { cols: number[]; rows: number[]; head: boolean }[] = [];
    rowSets.forEach((rs, ri) => colSets.forEach(cs => out.push({ cols: cs, rows: rs, head: ri === 0 || repeat })));
    return { list: out, pct: Math.round(f * 100) * (scale === 'all' ? Math.min(1, rh / body) : 1), across: colSets.length };
  }, [orient, paper, margin, scale, areaCols, areaRows, repeat]);

  const check = () => {
    if (orient === 'landscape') mark('p1');
    if (areaCols === 9 && areaRows === N + 1) mark('p2');
    if (pages.across === 1 && scale === 'cols') mark('p3');
    if (repeat) mark('p4');
    if (footer === 'pageof') mark('p5');
  };
  // periksa misi setiap kali pengaturan berubah
  useEffect(check, [orient, area, scale, titles, footer, pages.across]);

  const pg = pages.list[Math.min(page, pages.list.length - 1)] || pages.list[0];
  const ft = (i: number) => footer === 'page' ? `Page ${i + 1}` : footer === 'pageof' ? `Page ${i + 1} of ${pages.list.length}` : footer === 'file' ? 'Penjualan Oktober.xlsx' : '';

  return (
    <div className="pf xs ds">
      <div className="pf-tabs" role="tablist"><button role="tab" aria-selected>Page Layout</button></div>
      <div className="pf-ribbon ps-rb">
        <label className="pf-field">Orientation <select value={orient} onChange={e => { setOrient(e.target.value as Orient); setPage(0); }}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
        <label className="pf-field">Size <select value={paper} onChange={e => setPaper(e.target.value as Paper)}><option value="A4">A4</option><option value="F4">F4 / Folio</option></select></label>
        <label className="pf-field">Margins <select value={margin} onChange={e => setMargin(e.target.value as Margin)}><option value="normal">Normal</option><option value="narrow">Narrow</option><option value="wide">Wide</option></select></label>
        <button className="pf-rb" onClick={() => { setDraft(area || 'A1:J65'); setDlg('area'); }}>Print Area…</button>
        <button className="pf-rb" onClick={() => { setDraft(titles); setDlg('titles'); }}>Print Titles…</button>
        <label className="pf-field">Scaling <select value={scale} onChange={e => { setScale(e.target.value as Scale); setPage(0); }}><option value="none">No Scaling</option><option value="cols">Fit All Columns on One Page</option><option value="rows">Fit All Rows on One Page</option><option value="all">Fit Sheet on One Page</option></select></label>
        <label className="pf-field">Footer <select value={footer} onChange={e => setFooter(e.target.value)}><option value="none">(none)</option><option value="page">Page 1</option><option value="pageof">Page 1 of ?</option><option value="file">Nama file</option></select></label>
      </div>
      <div className="ps-wrap">
        <div className="ps-info">
          <p><b>{pages.list.length}</b> halaman · {pages.across} halaman ke samping{scale !== 'none' ? ` · skala ±${Math.max(10, Math.round(pages.pct))}%` : ''}</p>
          <p className="ds-note">Print Area: <code>{area || '(seluruh data A1:J65)'}</code> · Print Titles: <code>{titles || '(tidak ada)'}</code></p>
          <div className="ps-thumbs" role="list" aria-label="Halaman">
            {pages.list.slice(0, 24).map((p, i) => <button key={i} role="listitem" aria-pressed={i === page} onClick={() => setPage(i)} className={orient}>{i + 1}{!p.head && <i title="Tanpa judul kolom">!</i>}</button>)}
            {pages.list.length > 24 && <span className="ds-note">+{pages.list.length - 24}</span>}
          </div>
        </div>
        <div className={'ps-page ' + orient} aria-label={`Pratinjau halaman ${page + 1}`}>
          <table>
            {pg.head && <thead><tr>{pg.cols.map(c => <th key={c}>{HEAD[c]}</th>)}</tr></thead>}
            <tbody>{pg.rows.slice(0, 14).map(r => <tr key={r}>{pg.cols.map(c => { const v = DATA[r][c]; return <td key={c} className={typeof v === 'number' ? 'n' : ''}>{typeof v === 'number' && c >= 7 ? rp(v) : v}</td>; })}</tr>)}</tbody>
          </table>
          {pg.rows.length > 14 && <p className="ps-more">… {pg.rows.length - 14} baris lagi di halaman ini</p>}
          {!pg.head && <p className="ps-warn">Halaman ini tanpa judul kolom. Pembaca harus balik ke halaman 1 untuk tahu arti tiap kolom.</p>}
          <p className="ps-foot">{ft(page)}</p>
        </div>
      </div>

      {dlg && (
        <div className="pf-dlg" role="dialog" aria-label={dlg === 'area' ? 'Set Print Area' : 'Page Setup · Sheet'}>
          <div className="pf-dlg-in">
            <p className="pf-dlg-t">{dlg === 'area' ? 'Set Print Area' : 'Page Setup · Sheet'}</p>
            <label className="pf-field">{dlg === 'area' ? 'Print area:' : 'Rows to repeat at top:'} <input className="pf-in ds-mono" autoFocus value={draft} onChange={e => setDraft(e.target.value)} placeholder={dlg === 'area' ? 'A1:I65' : '$1:$1'} /></label>
            <p className="ds-note">{dlg === 'area' ? `Data ada di A1:J${N + 1}. Kolom J berisi catatan internal.` : 'Baris yang diulang di atas setiap halaman, biasanya baris judul kolom.'}</p>
            <div className="pf-dlg-b"><span className="ds-grow" />
              {dlg === 'area' && <button className="btn sm ghost" onClick={() => { setArea(''); setDlg(null); }}>Clear Print Area</button>}
              <button className="btn sm primary" onClick={() => { dlg === 'area' ? setArea(draft) : setTitles(draft); setPage(0); setDlg(null); }}>OK</button><button className="btn sm" onClick={() => setDlg(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Missions list={MISSIONS} done={done} tip={<>Hindari <b>Fit Sheet on One Page</b> untuk data panjang: semuanya dikecilkan sampai tidak terbaca. Lebih baik muatkan kolomnya saja, biarkan baris mengalir ke halaman berikutnya, dan ulangi judul kolom dengan Print Titles. Kolom terakhir di Print Area: {L(areaCols - 1)}.</>} />
    </div>
  );
}
