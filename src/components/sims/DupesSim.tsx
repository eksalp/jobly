// Simulasi Data › Remove Duplicates: memilih kolom pembanding, "My data has headers",
// pesan hasil seperti Excel, Undo, penanda duplikat, dan pembanding dengan rumus UNIQUE.
import { useEffect, useMemo, useState } from 'react';
import { XL } from '../../engine/engine.js';
import { Dialog, L, Missions, dser, dshow, rp, useMissions, type Mission } from './kit';

type V = string | number;
const HEAD = ['Tanggal', 'No faktur', 'Pelanggan', 'Nilai'];
const BASE: V[][] = [
  [dser(1, 10, 2026), 'INV-101', 'PT Prima Kemas', 4500000],
  [dser(1, 10, 2026), 'INV-102', 'CV Sumber Plastik', 2150000],
  [dser(1, 10, 2026), 'INV-101', 'PT Prima Kemas', 4500000],
  [dser(2, 10, 2026), 'INV-103', 'PT Arunika Pack', 3300000],
  [dser(2, 10, 2026), 'INV-104', 'UD Sejahtera', 1980000],
  [dser(1, 10, 2026), 'INV-102', 'CV Sumber Plastik', 2150000],
  [dser(3, 10, 2026), 'INV-105', 'PT Delta Pangan', 6700000],
  [dser(3, 10, 2026), 'INV-104', 'UD Sejahtera', 1890000],
  [dser(4, 10, 2026), 'INV-106', 'PT Prima Kemas', 2750000],
  [dser(4, 10, 2026), 'INV-107', 'CV Sumber Plastik', 5100000],
  [dser(4, 10, 2026), 'INV-106', 'PT Prima Kemas', 2750000],
  [dser(5, 10, 2026), 'INV-108', 'PT Arunika Pack', 3300000],
];
const MISSIONS: Mission[] = [
  { id: 'r1', text: 'Sebelum menghapus, <b>tandai</b> dulu: pilih kolom <b>B</b> lalu klik <b>Tandai duplikat</b> (sama dengan Conditional Formatting › Duplicate Values).' },
  { id: 'r2', text: '<b>Remove Duplicates</b> dengan <b>semua kolom</b> dicentang. Perhatikan berapa baris yang terhapus.' },
  { id: 'r3', text: '<b>Undo</b>, lalu ulangi hanya berdasarkan kolom <b>No faktur</b>. Bandingkan hasilnya.' },
  { id: 'r4', text: 'Cara tanpa mengubah data: di kotak rumus bawah, hitung jumlah baris unik dengan <code>=ROWS(UNIQUE(A2:D13))</code>.' },
];

export function DupesSim() {
  const [grid, setGrid] = useState<V[][]>(BASE);
  const [hist, setHist] = useState<V[][][]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [mark1, setMark1] = useState<number | null>(null);
  const [dlg, setDlg] = useState<null | { cols: boolean[]; headers: boolean }>(null);
  const [msg, setMsg] = useState('');
  const [fx, setFx] = useState('=');
  const [lastRemove, setLastRemove] = useState<string | null>(null);
  const { done, mark } = useMissions();

  const dupSet = useMemo(() => {
    if (mark1 === null) return new Set<number>();
    const cnt = new Map<string, number>(); grid.forEach(r => cnt.set(String(r[mark1]), (cnt.get(String(r[mark1])) || 0) + 1));
    return new Set(grid.map((r, i) => (cnt.get(String(r[mark1]))! > 1 ? i : -1)).filter(i => i >= 0));
  }, [grid, mark1]);

  const remove = (cols: boolean[], headers: boolean) => {
    const use = cols.map((on, i) => (on ? i : -1)).filter(i => i >= 0);
    const all = headers ? grid : [HEAD as V[], ...grid];
    const seen = new Set<string>(), keep: V[][] = [];
    for (const r of all) { const k = use.map(i => String(r[i])).join('\u0001'); if (!seen.has(k)) { seen.add(k); keep.push(r); } }
    const removed = all.length - keep.length;
    setHist(h => [...h, grid]);
    setGrid(headers ? keep : keep.slice(1));
    setMsg(removed ? `${removed} duplicate values found and removed; ${keep.length} unique values remain.` : 'No duplicate values found.');
    const key = use.join(',');
    if (headers && key === '0,1,2,3') { mark('r2'); setLastRemove('all'); }
    if (headers && key === '1') { if (lastRemove === 'all' || done.has('r2')) mark('r3'); setLastRemove('faktur'); }
  };
  const undo = () => { if (!hist.length) return; setGrid(hist[hist.length - 1]); setHist(h => h.slice(0, -1)); setMsg(''); };

  const fxVal = useMemo(() => {
    const f = fx.trim(); if (f.length < 2 || f[0] !== '=') return '';
    const cells: Record<string, V> = {};
    HEAD.forEach((h, j) => { cells[L(j) + 1] = h; });
    BASE.forEach((r, i) => r.forEach((v, j) => { cells[L(j) + (i + 2)] = v; }));
    const v = XL.makeSheet(cells).evalFormula(f.slice(1));
    if (XL.isErr(v)) return v.code + ' ' + v.msg;
    return typeof v === 'number' ? rp(v) : XL.isArr(v) ? `Array ${v.rows.length} baris × ${v.rows[0].length} kolom` : String(v);
  }, [fx]);
  useEffect(() => { if (fxVal === '9' && /UNIQUE/i.test(fx) && /A2:D13/i.test(fx.replace(/\$/g, ''))) mark('r4'); }, [fxVal]);

  return (
    <div className="pf xs ds">
      <div className="pf-tabs" role="tablist"><button role="tab" aria-selected>Data</button></div>
      <div className="pf-ribbon">
        <button className="pf-rb" onClick={() => setDlg({ cols: HEAD.map(() => true), headers: true })}>Remove Duplicates… <kbd>Alt+A, M</kbd></button>
        <button className="pf-rb" disabled={sel === null} onClick={() => { setMark1(sel); if (sel === 1) mark('r1'); }}>Tandai duplikat</button>
        <button className="pf-rb" disabled={mark1 === null} onClick={() => setMark1(null)}>Hapus tanda</button>
        <span className="pf-sep" />
        <button className="pf-rb" disabled={!hist.length} onClick={undo}>↶ Undo <kbd>Ctrl+Z</kbd></button>
      </div>
      <div className="pf-fx"><span className="pf-nb">{sel === null ? 'A1' : `${L(sel)}2:${L(sel)}${grid.length + 1}`}</span><i>fx</i><span className="pf-fv2">{grid.length} baris data</span></div>
      <div className="pf-sheet xs-sheet">
        <table className="pf-grid">
          <thead><tr><th />{HEAD.map((_, i) => <th key={i} className={'ds-colh' + (sel === i ? ' on' : '')}><button type="button" onClick={() => setSel(i)}>{L(i)}</button></th>)}</tr></thead>
          <tbody>
            <tr><th>1</th>{HEAD.map(h => <td key={h} className="pf-dh">{h}</td>)}</tr>
            {grid.map((r, i) => (
              <tr key={i}><th>{i + 2}</th>{r.map((v, j) => <td key={j} className={(typeof v === 'number' ? 'n' : '') + (dupSet.has(i) && j === mark1 ? ' ds-f-red' : '') + (sel === j ? ' xs-sel' : '')}>{j === 0 ? dshow(v as number) : typeof v === 'number' ? rp(v) : v}</td>)}</tr>))}
          </tbody>
        </table>
      </div>
      {msg && <p className="ds-result" role="status">{msg}</p>}
      <div className="ds-fxbox">
        <label htmlFor="ds-dupe-fx">Kotak rumus (data asli 12 baris):</label>
        <input id="ds-dupe-fx" className="pf-in ds-mono" value={fx} onChange={e => setFx(e.target.value)} placeholder="=ROWS(UNIQUE(A2:D13))" />
        <output>{fxVal}</output>
      </div>
      <div className="pf-sheets"><button aria-pressed>Faktur masuk</button><span className="xs-status">Ready</span></div>

      {dlg && (
        <Dialog title="Remove Duplicates" onCancel={() => setDlg(null)} okDisabled={!dlg.cols.some(Boolean)} onOk={() => { remove(dlg.cols, dlg.headers); setDlg(null); }}>
          <p className="pf-dlg-s">To delete duplicate values, select one or more columns that contain duplicates.</p>
          <div className="ds-row">
            <button className="btn sm" onClick={() => setDlg({ ...dlg, cols: dlg.cols.map(() => true) })}>Select All</button>
            <button className="btn sm" onClick={() => setDlg({ ...dlg, cols: dlg.cols.map(() => false) })}>Unselect All</button>
            <label className="ds-chk"><input type="checkbox" checked={dlg.headers} onChange={e => setDlg({ ...dlg, headers: e.target.checked })} /> My data has headers</label>
          </div>
          <div className="pf-checks">
            {HEAD.map((h, i) => <label key={h}><input type="checkbox" checked={dlg.cols[i]} onChange={e => setDlg({ ...dlg, cols: dlg.cols.map((x, j) => (j === i ? e.target.checked : x)) })} /> {dlg.headers ? h : 'Column ' + L(i)}</label>)}
          </div>
        </Dialog>
      )}

      <Missions list={MISSIONS} done={done} tip={<>Dengan semua kolom, hanya baris yang <b>persis sama</b> yang dihapus. Dengan No faktur saja, INV-104 bernilai 1.890.000 ikut terhapus padahal nilainya beda dari 1.980.000. Bisa jadi itu salah ketik yang justru perlu dicek. Remove Duplicates menyimpan baris pertama yang ditemukan, jadi periksa dulu sebelum menghapus.</>} />
    </div>
  );
}
