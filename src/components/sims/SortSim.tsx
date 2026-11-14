// Simulasi Data › Sort (Custom Sort bertingkat): Add/Delete/Copy Level, urutan naik/turun,
// Custom List, opsi "My data has headers", tombol cepat A→Z / Z→A, dan Undo.
import { useState } from 'react';
import { Dialog, L, Missions, dser, dshow, rp, useMissions, type Mission } from './kit';

type V = string | number;
type Order = 'asc' | 'desc' | 'custom';
type Level = { col: number; order: Order };
const HEAD = ['Tanggal', 'Cabang', 'Sales', 'Kategori', 'Qty', 'Nilai'];
const NUMC = [0, 4, 5];
const CUSTOM = ['Jakarta', 'Bandung', 'Surabaya', 'Medan'];

const BASE: V[][] = [
  [dser(3, 10, 2026), 'Surabaya', 'Hendra', 'Elektronik', 12, 18500000],
  [dser(1, 10, 2026), 'Jakarta', 'Rina', 'ATK', 40, 3250000],
  [dser(6, 10, 2026), 'Bandung', 'Yusuf', 'Perabot', 5, 22400000],
  [dser(2, 10, 2026), 'Medan', 'Dewi', 'Elektronik', 9, 14750000],
  [dser(3, 10, 2026), 'Jakarta', 'Maya', 'Elektronik', 15, 26100000],
  [dser(7, 10, 2026), 'Surabaya', 'Lestari', 'ATK', 55, 4100000],
  [dser(1, 10, 2026), 'Bandung', 'Sari', 'Elektronik', 7, 11900000],
  [dser(8, 10, 2026), 'Jakarta', 'Rina', 'Perabot', 3, 16800000],
  [dser(5, 10, 2026), 'Medan', 'Teguh', 'Perabot', 4, 9600000],
  [dser(2, 10, 2026), 'Surabaya', 'Hendra', 'Perabot', 6, 20300000],
  [dser(9, 10, 2026), 'Bandung', 'Yusuf', 'ATK', 32, 2900000],
  [dser(4, 10, 2026), 'Jakarta', 'Maya', 'ATK', 28, 3700000],
  [dser(6, 10, 2026), 'Medan', 'Dewi', 'Elektronik', 11, 17200000],
  [dser(5, 10, 2026), 'Surabaya', 'Lestari', 'Elektronik', 8, 13400000],
];

const MISSIONS: Mission[] = [
  { id: 's1', text: '<b>Sort cepat</b>: klik huruf kolom <b>B</b> (Cabang), lalu tombol <b>A→Z</b>.' },
  { id: 's2', text: '<b>Dua tingkat</b>: buka <b>Sort</b>, urutkan Cabang A to Z, lalu <b>Add Level</b>: Nilai Largest to Smallest.' },
  { id: 's3', text: '<b>Custom List</b>: urutkan Cabang sesuai urutan wilayah kantor (Jakarta, Bandung, Surabaya, Medan), bukan abjad.' },
  { id: 's4', text: '<b>Tiga tingkat</b>: Cabang, lalu Kategori, lalu Tanggal dari yang terlama.' },
  { id: 's5', text: '<b>Kesalahan umum</b>: hilangkan centang <b>My data has headers</b>, lihat baris judul ikut terurut, lalu tekan <b>Undo</b>.' },
];

const isNum = (v: V) => typeof v === 'number';
function cmp(a: V, b: V, o: Order) {
  if (o === 'custom') {
    const ia = CUSTOM.indexOf(String(a)), ib = CUSTOM.indexOf(String(b));
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  }
  // Excel: angka selalu sebelum teks (urutan naik), teks dibandingkan tanpa membedakan huruf besar
  let r = isNum(a) && isNum(b) ? (a as number) - (b as number) : isNum(a) ? -1 : isNum(b) ? 1 : String(a).localeCompare(String(b), 'id', { sensitivity: 'base' });
  return o === 'desc' ? -r : r;
}
function sortRows(rows: V[][], levels: Level[]) {
  return rows.map((r, i) => ({ r, i })).sort((x, y) => {
    for (const lv of levels) { const c = cmp(x.r[lv.col], y.r[lv.col], lv.order); if (c) return c; }
    return x.i - y.i; // stabil
  }).map(x => x.r);
}
const orderLabel = (c: number, o: Order) => o === 'custom' ? 'Jakarta, Bandung, Surabaya, Medan' : c === 0 ? (o === 'asc' ? 'Oldest to Newest' : 'Newest to Oldest') : NUMC.includes(c) ? (o === 'asc' ? 'Smallest to Largest' : 'Largest to Smallest') : (o === 'asc' ? 'A to Z' : 'Z to A');

export function SortSim() {
  // baris 1 (judul) ikut disimpan supaya kesalahan "tanpa header" bisa diperagakan
  const [grid, setGrid] = useState<V[][]>(() => [HEAD, ...BASE]);
  const [hist, setHist] = useState<V[][][]>([]);
  const [col, setCol] = useState<number | null>(null);
  const [dlg, setDlg] = useState<null | { levels: Level[]; sel: number; headers: boolean }>(null);
  const [messy, setMessy] = useState(false);
  const [last, setLast] = useState<Level[] | null>(null);
  const { done, mark } = useMissions();

  const apply = (levels: Level[], headers: boolean) => {
    setHist(h => [...h, grid]);
    const next = headers ? [grid[0], ...sortRows(grid.slice(1), levels)] : sortRows(grid, levels);
    setGrid(next); setLast(levels);
    if (!headers && next.indexOf(HEAD) > 0) setMessy(true);
    if (!headers) return;
    if (levels.length === 1 && levels[0].col === 1 && levels[0].order === 'asc') mark('s1');
    if (levels.length >= 2 && levels[0].col === 1 && levels[0].order !== 'desc' && levels[1].col === 5 && levels[1].order === 'desc') mark('s2');
    if (levels.some(l => l.col === 1 && l.order === 'custom')) mark('s3');
    if (levels.length >= 3 && levels[0].col === 1 && levels[1].col === 3 && levels[2].col === 0 && levels[2].order === 'asc') mark('s4');
  };
  const undo = () => { if (!hist.length) return; setGrid(hist[hist.length - 1]); setHist(h => h.slice(0, -1)); if (messy) { mark('s5'); setMessy(false); } };
  const openDlg = () => setDlg({ levels: last && last.length ? last.map(l => ({ ...l })) : [{ col: col ?? 1, order: 'asc' }], sel: 0, headers: true });

  const upd = (f: (d: NonNullable<typeof dlg>) => void) => setDlg(d => { if (!d) return d; const n = { ...d, levels: d.levels.map(l => ({ ...l })) }; f(n); return n; });
  const colName = (c: number, headers: boolean) => headers ? HEAD[c] : 'Column ' + L(c);
  const headerInData = grid.findIndex(r => r === HEAD);

  return (
    <div className="pf xs ds">
      <div className="pf-tabs" role="tablist"><button role="tab" aria-selected>Data</button></div>
      <div className="pf-ribbon">
        <button className="pf-rb" disabled={col === null} onClick={() => col !== null && apply([{ col, order: 'asc' }], true)} title="Sort A to Z berdasarkan kolom terpilih">A→Z</button>
        <button className="pf-rb" disabled={col === null} onClick={() => col !== null && apply([{ col, order: 'desc' }], true)} title="Sort Z to A berdasarkan kolom terpilih">Z→A</button>
        <button className="pf-rb" onClick={openDlg}>Sort… <kbd>Alt+A, S, S</kbd></button>
        <span className="pf-sep" />
        <button className="pf-rb" disabled={!hist.length} onClick={undo}>↶ Undo <kbd>Ctrl+Z</kbd></button>
      </div>
      <div className="pf-fx"><span className="pf-nb">{col === null ? 'A1' : L(col) + '2'}</span><i>fx</i><span className="pf-fv2">{col === null ? 'Klik huruf kolom untuk memilih kolom' : `Kolom ${L(col)} terpilih (${HEAD[col]})`}</span></div>
      <div className="pf-sheet xs-sheet">
        <table className="pf-grid">
          <thead><tr><th />{HEAD.map((_, i) => <th key={i} className={'ds-colh' + (col === i ? ' on' : '')}><button type="button" onClick={() => setCol(i)} aria-pressed={col === i}>{L(i)}</button></th>)}</tr></thead>
          <tbody>
            {grid.map((r, i) => (
              <tr key={i} className={r === HEAD ? 'ds-headrow' + (i > 0 ? ' ds-bad' : '') : ''}>
                <th>{i + 1}</th>
                {r.map((v, j) => <td key={j} className={(isNum(v) ? 'n' : '') + (col === j && i > 0 ? ' xs-sel' : '')}>{r === HEAD ? v : j === 0 && isNum(v) ? dshow(v as number) : isNum(v) ? rp(v as number) : v}</td>)}
              </tr>))}
          </tbody>
        </table>
      </div>
      <div className="pf-sheets"><button aria-pressed>Penjualan</button><span className="xs-status">{headerInData > 0 ? `Baris judul pindah ke baris ${headerInData + 1}. Tekan Undo.` : 'Ready'}</span></div>

      {dlg && (
        <Dialog title="Sort" wide onCancel={() => setDlg(null)} onOk={() => { apply(dlg.levels, dlg.headers); setDlg(null); }}>
          <div className="ds-toolbar">
            <button className="btn sm" disabled={dlg.levels.length >= 6} onClick={() => upd(d => { d.levels.push({ col: 0, order: 'asc' }); d.sel = d.levels.length - 1; })}>+ Add Level</button>
            <button className="btn sm" disabled={dlg.levels.length <= 1} onClick={() => upd(d => { d.levels.splice(d.sel, 1); d.sel = Math.max(0, d.sel - 1); })}>✕ Delete Level</button>
            <button className="btn sm" disabled={dlg.levels.length >= 6} onClick={() => upd(d => { d.levels.splice(d.sel + 1, 0, { ...d.levels[d.sel] }); d.sel++; })}>Copy Level</button>
            <button className="btn sm" aria-label="Pindah ke atas" disabled={dlg.sel === 0} onClick={() => upd(d => { const [x] = d.levels.splice(d.sel, 1); d.levels.splice(d.sel - 1, 0, x); d.sel--; })}>▲</button>
            <button className="btn sm" aria-label="Pindah ke bawah" disabled={dlg.sel >= dlg.levels.length - 1} onClick={() => upd(d => { const [x] = d.levels.splice(d.sel, 1); d.levels.splice(d.sel + 1, 0, x); d.sel++; })}>▼</button>
            <label className="ds-chk"><input type="checkbox" checked={dlg.headers} onChange={e => upd(d => { d.headers = e.target.checked; })} /> My data has headers</label>
          </div>
          <div className="ds-levels" role="list">
            <div className="ds-lv ds-lv-h"><span /><span>Column</span><span>Sort On</span><span>Order</span></div>
            {dlg.levels.map((lv, i) => (
              <div key={i} role="listitem" className={'ds-lv' + (dlg.sel === i ? ' on' : '')} onClick={() => upd(d => { d.sel = i; })}>
                <span>{i === 0 ? 'Sort by' : 'Then by'}</span>
                <select aria-label="Kolom" value={lv.col} onChange={e => upd(d => { d.levels[i].col = +e.target.value; if (d.levels[i].order === 'custom' && +e.target.value !== 1) d.levels[i].order = 'asc'; })}>
                  {HEAD.map((_, c) => <option key={c} value={c}>{colName(c, dlg.headers)}</option>)}
                </select>
                <select aria-label="Sort On" value="v" onChange={() => {}}><option value="v">Cell Values</option></select>
                <select aria-label="Urutan" value={lv.order} onChange={e => upd(d => { d.levels[i].order = e.target.value as Order; })}>
                  <option value="asc">{orderLabel(lv.col, 'asc')}</option>
                  <option value="desc">{orderLabel(lv.col, 'desc')}</option>
                  {lv.col === 1 && <option value="custom">Custom List: Jakarta, Bandung, Surabaya, Medan</option>}
                </select>
              </div>))}
          </div>
          <p className="ds-note">{dlg.headers ? 'Baris 1 dianggap judul dan tidak ikut diurutkan.' : 'Tanpa centang ini, baris 1 dianggap data biasa dan ikut diurutkan.'}</p>
        </Dialog>
      )}

      <Missions list={MISSIONS} done={done} tip={<>Tingkat pertama menentukan urutan utama; tingkat berikutnya hanya dipakai saat nilai tingkat sebelumnya sama. Custom List dibuat di <b>File › Options › Advanced › Edit Custom Lists</b>.</>} />
    </div>
  );
}
