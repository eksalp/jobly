// Simulasi Data › Data Validation: tab Settings (List, Whole number, Decimal, Date, Text length, Custom),
// Input Message, Error Alert (Stop/Warning/Information), dropdown di sel, Circle Invalid Data.
import { useState } from 'react';
import { XL } from '../../engine/engine.js';
import { Dialog, L, Missions, parseNum, useMissions, type Mission } from './kit';

type Allow = 'any' | 'whole' | 'decimal' | 'list' | 'date' | 'length' | 'custom';
type Op = 'between' | 'notbetween' | 'eq' | 'ne' | 'gt' | 'lt' | 'ge' | 'le';
type Style = 'stop' | 'warning' | 'info';
type DV = { allow: Allow; op: Op; min: string; max: string; src: string; f: string; ignoreBlank: boolean; dropdown: boolean; inShow: boolean; inT: string; inM: string; alShow: boolean; style: Style; alT: string; alM: string };
type Cell = string;

const HEAD = ['Nama', 'Divisi', 'Jenis cuti', 'Jumlah hari', 'Tanggal mulai', 'NIK'];
const LIST = ['Keuangan', 'HRD', 'Gudang', 'Penjualan'];
const START: Cell[][] = [
  ['Rina Wulandari', 'Keuangan', 'Tahunan', '3', '10/11/2026', '3171012345678901'],
  ['Hendra Saputra', 'Gudang', 'Sakit', '2', '12/11/2026', '3273019876543210'],
  ['Maya Lestari', 'Pemasaran', 'Tahunan', '15', '17/11/2026', '317101234567890'],
  ['Dimas Pratama', 'HRD', 'Tahunan', '4,5', '20/11/2026', '3578012345678901'],
  ['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', ''],
];
const NR = START.length; // baris 2..8
const OPS: [Op, string][] = [['between', 'between'], ['notbetween', 'not between'], ['eq', 'equal to'], ['ne', 'not equal to'], ['gt', 'greater than'], ['lt', 'less than'], ['ge', 'greater than or equal to'], ['le', 'less than or equal to']];
const ALLOW: [Allow, string][] = [['any', 'Any value'], ['whole', 'Whole number'], ['decimal', 'Decimal'], ['list', 'List'], ['date', 'Date'], ['length', 'Text length'], ['custom', 'Custom']];
const blank = (): DV => ({ allow: 'any', op: 'between', min: '', max: '', src: '', f: '=', ignoreBlank: true, dropdown: true, inShow: true, inT: '', inM: '', alShow: true, style: 'stop', alT: '', alM: '' });

const MISSIONS: Mission[] = [
  { id: 'd1', text: 'Kolom <b>B</b> (Divisi): Allow <b>List</b>, Source <code>=$H$2:$H$5</code>. Lalu klik sel B6 dan pilih dari panah ▾.' },
  { id: 'd2', text: 'Kolom <b>D</b> (Jumlah hari): <b>Whole number</b> between 1 and 12.' },
  { id: 'd3', text: 'Kolom <b>F</b> (NIK): <b>Text length</b> equal to 16.' },
  { id: 'd4', text: 'Isi tab <b>Input Message</b> supaya muncul petunjuk saat sel dipilih.' },
  { id: 'd5', text: 'Uji aturannya: ketik isian yang salah (misalnya 20 di kolom D) sampai muncul pesan error.' },
  { id: 'd6', text: 'Data lama tidak ikut diperiksa. Klik <b>Circle Invalid Data</b> untuk menemukan isian yang sudah terlanjur salah.' },
];

const toDate = (s: string) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s.trim()); if (!m) return NaN; const d = +m[1], mo = +m[2], y = +m[3]; if (mo < 1 || mo > 12 || d < 1 || d > 31) return NaN; return XL.D(y, mo, d) as number; };
const cmpOp = (op: Op, v: number, a: number, b: number) => op === 'between' ? v >= a && v <= b : op === 'notbetween' ? v < a || v > b : op === 'eq' ? v === a : op === 'ne' ? v !== a : op === 'gt' ? v > a : op === 'lt' ? v < a : op === 'ge' ? v >= a : v <= a;

export function DVSim() {
  const [data, setData] = useState<Cell[][]>(() => START.map(r => [...r]));
  const [rules, setRules] = useState<Record<number, DV>>({});
  const [sel, setSel] = useState<number | null>(null);
  const [act, setAct] = useState<{ r: number; c: number } | null>(null);
  const [edit, setEdit] = useState<{ r: number; c: number; v: string } | null>(null);
  const [drop, setDrop] = useState<{ r: number; c: number } | null>(null);
  const [dlg, setDlg] = useState<null | { c: number; tab: 'set' | 'in' | 'al'; dv: DV }>(null);
  const [alert, setAlert] = useState<null | { r: number; c: number; v: string; dv: DV }>(null);
  const [circles, setCircles] = useState(false);
  const { done, mark } = useMissions();

  const cellsDict = (d: Cell[][]) => {
    const o: Record<string, string | number> = {};
    HEAD.forEach((h, j) => { o[L(j) + 1] = h; });
    d.forEach((row, i) => row.forEach((v, j) => { if (v !== '') { const n = parseNum(v); o[L(j) + (i + 2)] = j === 3 && !isNaN(n) ? n : v; } }));
    o.H1 = 'Daftar divisi'; LIST.forEach((x, i) => { o['H' + (i + 2)] = x; });
    return o;
  };
  const listOf = (dv: DV, d: Cell[][]) => {
    const s = dv.src.trim();
    if (s.startsWith('=')) {
      const m = /^=\$?([A-Z]{1,2})\$?(\d+):\$?([A-Z]{1,2})\$?(\d+)$/i.exec(s.replace(/\s/g, ''));
      if (!m) return [];
      const cells = cellsDict(d); const out: string[] = [];
      for (const row of XL.expandRange(m[1].toUpperCase() + m[2], m[3].toUpperCase() + m[4])) for (const k of row) if (cells[k] != null) out.push(String(cells[k]));
      return out;
    }
    return s.split(',').map(x => x.trim()).filter(Boolean);
  };
  const valid = (c: number, r: number, v: string, d: Cell[][], dv?: DV) => {
    dv = dv || rules[c]; if (!dv || dv.allow === 'any') return true;
    if (v === '') return dv.ignoreBlank;
    const a = dv.allow === 'date' ? toDate(dv.min) : parseNum(dv.min), b = dv.allow === 'date' ? toDate(dv.max) : parseNum(dv.max);
    if (dv.allow === 'whole') { const n = parseNum(v); return Number.isInteger(n) && cmpOp(dv.op, n, a, b); }
    if (dv.allow === 'decimal') { const n = parseNum(v); return !isNaN(n) && cmpOp(dv.op, n, a, b); }
    if (dv.allow === 'length') return cmpOp(dv.op, v.length, a, b);
    if (dv.allow === 'date') { const n = toDate(v); return !isNaN(n) && cmpOp(dv.op, n, a, b); }
    if (dv.allow === 'list') return listOf(dv, d).some(x => x.toLowerCase() === v.toLowerCase());
    if (dv.allow === 'custom') {
      const dd = d.map(x => [...x]); dd[r][c] = v;
      const res = XL.makeSheet(cellsDict(dd)).evalFormula((XL.shiftFormula(dv.f, r, 0) as string).slice(1));
      return res === true || (typeof res === 'number' && res !== 0);
    }
    return true;
  };

  const commit = (r: number, c: number, v: string) => {
    setEdit(null); setDrop(null);
    const dv = rules[c];
    if (dv && dv.alShow && !valid(c, r, v, data)) { setAlert({ r, c, v, dv }); mark('d5'); return; }
    setData(d => { const n = d.map(x => [...x]); n[r][c] = v; return n; });
  };
  const okDV = () => {
    if (!dlg) return;
    const { c, dv } = dlg;
    setRules(rs => { const n = { ...rs }; if (dv.allow === 'any' && !dv.inT && !dv.inM) delete n[c]; else n[c] = dv; return n; });
    setDlg(null);
    const set = (xs: string[]) => new Set(xs.map(x => x.toLowerCase()));
    if (c === 1 && dv.allow === 'list') { const got = set(listOf(dv, data)), want = set(LIST); if (got.size === want.size && [...want].every(x => got.has(x))) mark('d1'); }
    if (c === 3 && dv.allow === 'whole' && dv.op === 'between' && parseNum(dv.min) === 1 && parseNum(dv.max) === 12) mark('d2');
    if (c === 5 && dv.allow === 'length' && dv.op === 'eq' && parseNum(dv.min) === 16) mark('d3');
    if (dv.inShow && (dv.inT.trim() || dv.inM.trim())) mark('d4');
  };
  const bad = (r: number, c: number) => circles && !!rules[c] && !valid(c, r, data[r][c], data);
  const nBad = circles ? data.reduce((s, row, r) => s + row.filter((_, c) => bad(r, c)).length, 0) : 0;
  const msgFor = act && rules[act.c] && rules[act.c].inShow && (rules[act.c].inT || rules[act.c].inM) ? rules[act.c] : null;
  const actRef = act ? L(act.c) + (act.r + 2) : sel !== null ? `${L(sel)}2:${L(sel)}${NR + 1}` : 'A1';
  const targetCol = sel ?? act?.c ?? null;

  return (
    <div className="pf xs ds">
      <div className="pf-tabs" role="tablist"><button role="tab" aria-selected>Data</button></div>
      <div className="pf-ribbon">
        <button className="pf-rb" disabled={targetCol === null} onClick={() => targetCol !== null && setDlg({ c: targetCol, tab: 'set', dv: { ...(rules[targetCol] || blank()) } })}>Data Validation… <kbd>Alt+A, V, V</kbd></button>
        <button className="pf-rb" onClick={() => { setCircles(true); if (Object.keys(rules).length && data.some((row, r) => row.some((v, c) => !!rules[c] && !valid(c, r, v, data)))) mark('d6'); }}>◯ Circle Invalid Data</button>
        <button className="pf-rb" disabled={!circles} onClick={() => setCircles(false)}>Clear Validation Circles</button>
      </div>
      <div className="pf-fx"><span className="pf-nb">{actRef}</span><i>fx</i>
        <span className="pf-fv2">{act ? data[act.r][act.c] : targetCol === null ? 'Klik huruf kolom untuk memilih kolom, atau klik sel untuk mengisi' : ''}</span></div>
      <div className="pf-sheet xs-sheet" onClick={e => { if (!(e.target as HTMLElement).closest('.ds-dd,.ds-ddlist,td')) setDrop(null); }}>
        <table className="pf-grid">
          <thead><tr><th />{[...HEAD, '', 'Daftar'].map((_, i) => <th key={i} className={'ds-colh' + (sel === i ? ' on' : '')}>{i < 6 ? <button type="button" onClick={() => { setSel(i); setAct(null); setEdit(null); }}>{L(i)}</button> : L(i)}</th>)}</tr></thead>
          <tbody>
            <tr><th>1</th>{HEAD.map(h => <td key={h} className="pf-dh">{h}</td>)}<td /><td className="pf-dh">Daftar divisi</td></tr>
            {data.map((row, r) => (
              <tr key={r}><th>{r + 2}</th>
                {row.map((v, c) => {
                  const isAct = act?.r === r && act?.c === c, dv = rules[c];
                  return (
                    <td key={c} className={(c === 3 && v && !isNaN(parseNum(v)) ? 'n' : '') + (isAct ? ' act' : '') + (sel === c ? ' xs-sel' : '') + (bad(r, c) ? ' ds-circle' : '')}
                      onClick={() => { setAct({ r, c }); setSel(null); if (!isAct) setEdit(null); }} onDoubleClick={() => setEdit({ r, c, v })}>
                      {edit && edit.r === r && edit.c === c ? (
                        <input className="ds-cellin" autoFocus aria-label={`Isi ${L(c)}${r + 2}`} value={edit.v} onChange={e => setEdit({ ...edit, v: e.target.value })}
                          onKeyDown={e => { if (e.key === 'Enter') commit(r, c, edit.v.trim()); if (e.key === 'Escape') setEdit(null); }} onBlur={() => edit && commit(r, c, edit.v.trim())} />
                      ) : (
                        <span className="pf-cell"><span className="pf-t" onClick={() => isAct && setEdit({ r, c, v })}>{v}</span>
                          {isAct && dv?.allow === 'list' && dv.dropdown && <button type="button" className="ds-dd" aria-label="Pilih dari daftar" onClick={e => { e.stopPropagation(); setDrop(d => d ? null : { r, c }); }}>▾</button>}
                          {isAct && !(dv?.allow === 'list' && dv.dropdown) && <button type="button" className="ds-edit" onClick={e => { e.stopPropagation(); setEdit({ r, c, v }); }}>Ketik</button>}
                        </span>)}
                      {drop && drop.r === r && drop.c === c && (
                        <div className="ds-ddlist" role="listbox">{listOf(dv!, data).map(x => <button key={x} role="option" aria-selected={x === v} onClick={e => { e.stopPropagation(); commit(r, c, x); }}>{x}</button>)}</div>)}
                      {isAct && msgFor && !edit && <div className="ds-inmsg" role="tooltip">{msgFor.inT && <b>{msgFor.inT}</b>}<span>{msgFor.inM}</span></div>}
                    </td>);
                })}
                <td /><td>{r < LIST.length ? LIST[r] : ''}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
      <div className="pf-sheets"><button aria-pressed>Pengajuan cuti</button><span className="xs-status">{circles ? `${nBad} isian tidak sesuai aturan` : act ? 'Klik "Ketik" atau klik dua kali sel untuk mengisi, Enter untuk menyimpan' : 'Ready'}</span></div>

      {dlg && (() => {
        const dv = dlg.dv, set = (p: Partial<DV>) => setDlg({ ...dlg, dv: { ...dv, ...p } });
        const numeric = ['whole', 'decimal', 'date', 'length'].includes(dv.allow), two = dv.op === 'between' || dv.op === 'notbetween';
        const lab = dv.allow === 'date' ? ['Start date', 'End date', 'Date'] : dv.allow === 'length' ? ['Minimum', 'Maximum', 'Length'] : ['Minimum', 'Maximum', 'Value'];
        return (
          <Dialog title="Data Validation" wide onCancel={() => setDlg(null)} onOk={okDV}
            extra={<button className="btn sm ghost" onClick={() => setDlg({ ...dlg, dv: blank() })}>Clear All</button>}>
            <div className="ds-tabs" role="tablist">
              {([['set', 'Settings'], ['in', 'Input Message'], ['al', 'Error Alert']] as const).map(([k, l]) => <button key={k} role="tab" aria-selected={dlg.tab === k} onClick={() => setDlg({ ...dlg, tab: k })}>{l}</button>)}
            </div>
            {dlg.tab === 'set' && <div className="ds-form">
              <p className="pf-dlg-s">Validation criteria · berlaku untuk <code>{L(dlg.c)}2:{L(dlg.c)}{NR + 1}</code></p>
              <label className="pf-field">Allow: <select value={dv.allow} onChange={e => set({ allow: e.target.value as Allow })}>{ALLOW.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
              {numeric && <label className="pf-field">Data: <select value={dv.op} onChange={e => set({ op: e.target.value as Op })}>{OPS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>}
              {numeric && <label className="pf-field">{two ? lab[0] : lab[2]}: <input className="pf-in" value={dv.min} onChange={e => set({ min: e.target.value })} placeholder={dv.allow === 'date' ? 'dd/mm/yyyy' : ''} /></label>}
              {numeric && two && <label className="pf-field">{lab[1]}: <input className="pf-in" value={dv.max} onChange={e => set({ max: e.target.value })} placeholder={dv.allow === 'date' ? 'dd/mm/yyyy' : ''} /></label>}
              {dv.allow === 'list' && <><label className="pf-field">Source: <input className="pf-in ds-mono" value={dv.src} onChange={e => set({ src: e.target.value })} placeholder="=$H$2:$H$5 atau Keuangan,HRD" /></label>
                <label className="ds-chk"><input type="checkbox" checked={dv.dropdown} onChange={e => set({ dropdown: e.target.checked })} /> In-cell dropdown</label></>}
              {dv.allow === 'custom' && <label className="pf-field">Formula (untuk baris 2): <input className="pf-in ds-mono" value={dv.f} onChange={e => set({ f: e.target.value })} placeholder={`=COUNTIF($F$2:$F$8,F2)=1`} /></label>}
              {dv.allow !== 'any' && <label className="ds-chk"><input type="checkbox" checked={dv.ignoreBlank} onChange={e => set({ ignoreBlank: e.target.checked })} /> Ignore blank</label>}
            </div>}
            {dlg.tab === 'in' && <div className="ds-form">
              <label className="ds-chk"><input type="checkbox" checked={dv.inShow} onChange={e => set({ inShow: e.target.checked })} /> Show input message when cell is selected</label>
              <label className="pf-field">Title: <input className="pf-in" value={dv.inT} onChange={e => set({ inT: e.target.value })} placeholder="Jumlah hari" /></label>
              <label className="pf-field ds-col">Input message: <textarea className="pf-in" rows={3} value={dv.inM} onChange={e => set({ inM: e.target.value })} placeholder="Isi angka bulat 1 sampai 12." /></label>
            </div>}
            {dlg.tab === 'al' && <div className="ds-form">
              <label className="ds-chk"><input type="checkbox" checked={dv.alShow} onChange={e => set({ alShow: e.target.checked })} /> Show error alert after invalid data is entered</label>
              <label className="pf-field">Style: <select value={dv.style} onChange={e => set({ style: e.target.value as Style })}><option value="stop">Stop</option><option value="warning">Warning</option><option value="info">Information</option></select></label>
              <label className="pf-field">Title: <input className="pf-in" value={dv.alT} onChange={e => set({ alT: e.target.value })} /></label>
              <label className="pf-field ds-col">Error message: <textarea className="pf-in" rows={3} value={dv.alM} onChange={e => set({ alM: e.target.value })} /></label>
              <p className="ds-note">Stop menolak isian. Warning dan Information masih bisa diloloskan dengan Yes/OK.</p>
            </div>}
          </Dialog>);
      })()}

      {alert && (
        <div className="pf-dlg" role="alertdialog" aria-label={alert.dv.alT || 'Microsoft Excel'}>
          <div className={'pf-dlg-in ds-alert ' + alert.dv.style}>
            <p className="pf-dlg-t"><span className="ds-al-ic" aria-hidden="true">{alert.dv.style === 'stop' ? '✕' : alert.dv.style === 'warning' ? '!' : 'i'}</span>{alert.dv.alT || 'Microsoft Excel'}</p>
            <p>{alert.dv.alM || 'This value doesn\'t match the data validation restrictions defined for this cell.'}{alert.dv.style === 'warning' ? ' Continue?' : ''}</p>
            <div className="pf-dlg-b">
              {alert.dv.style === 'stop' && <><button className="btn sm primary" onClick={() => { setEdit({ r: alert.r, c: alert.c, v: alert.v }); setAlert(null); }}>Retry</button><button className="btn sm" onClick={() => setAlert(null)}>Cancel</button></>}
              {alert.dv.style === 'warning' && <><button className="btn sm primary" onClick={() => { setData(d => { const n = d.map(x => [...x]); n[alert.r][alert.c] = alert.v; return n; }); setAlert(null); }}>Yes</button><button className="btn sm" onClick={() => { setEdit({ r: alert.r, c: alert.c, v: alert.v }); setAlert(null); }}>No</button><button className="btn sm" onClick={() => setAlert(null)}>Cancel</button></>}
              {alert.dv.style === 'info' && <><button className="btn sm primary" onClick={() => { setData(d => { const n = d.map(x => [...x]); n[alert.r][alert.c] = alert.v; return n; }); setAlert(null); }}>OK</button><button className="btn sm" onClick={() => setAlert(null)}>Cancel</button></>}
            </div>
          </div>
        </div>
      )}

      <Missions list={MISSIONS} done={done} tip={<>Data Validation hanya memeriksa isian <b>baru</b>. Data yang ditempel (paste) juga lolos tanpa diperiksa, jadi pakai Circle Invalid Data untuk mengecek data lama. Untuk mencegah NIK ganda, pakai Allow Custom dengan <code>=COUNTIF($F$2:$F$8,F2)=1</code>.</>} />
    </div>
  );
}
