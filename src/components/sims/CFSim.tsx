// Simulasi Home › Conditional Formatting: Highlight Cells Rules, Top/Bottom Rules, Data Bars,
// Color Scales, Icon Sets, New Rule dengan rumus (dihitung oleh mesin rumus), Manage Rules, Clear Rules.
import { useMemo, useState } from 'react';
import { XL } from '../../engine/engine.js';
import { Dialog, L, Missions, parseNum, rp, useMissions, type Mission } from './kit';

type Fmt = 'red' | 'yellow' | 'green' | 'bold';
type Kind = 'gt' | 'lt' | 'between' | 'eq' | 'text' | 'dup' | 'uniq' | 'top' | 'bottom' | 'above' | 'below' | 'bar' | 'scale' | 'icon' | 'formula';
type Rule = { id: number; c0: number; c1: number; k: Kind; a?: number; b?: number; s?: string; n?: number; f?: string; fmt: Fmt };
type Sel = { c0: number; c1: number } | null;

const HEAD = ['Faktur', 'Sales', 'Cabang', 'Target', 'Realisasi', 'Capaian'];
const RAW: [string, string, string, number, number][] = [
  ['INV-1021', 'Rina', 'Jakarta', 120000000, 134500000], ['INV-1022', 'Yusuf', 'Bandung', 90000000, 71200000],
  ['INV-1023', 'Maya', 'Jakarta', 150000000, 162800000], ['INV-1024', 'Hendra', 'Surabaya', 100000000, 88400000],
  ['INV-1021', 'Rina', 'Jakarta', 120000000, 134500000], ['INV-1026', 'Sari', 'Bandung', 80000000, 96300000],
  ['INV-1027', 'Teguh', 'Medan', 70000000, 52100000], ['INV-1028', 'Lestari', 'Surabaya', 110000000, 109700000],
  ['INV-1029', 'Dimas', 'Medan', 75000000, 81600000], ['INV-1030', 'Dewi', 'Jakarta', 130000000, 99800000],
  ['INV-1031', 'Bayu', 'Bandung', 95000000, 101250000], ['INV-1030', 'Dewi', 'Jakarta', 130000000, 99800000],
];
const ROWS = RAW.map(r => [...r, Math.round(r[4] / r[3] * 1000) / 1000] as (string | number)[]);
const N = ROWS.length; // baris data 2..13
const FMT_L: Record<Fmt, string> = { red: 'Light Red Fill with Dark Red Text', yellow: 'Yellow Fill with Dark Yellow Text', green: 'Green Fill with Dark Green Text', bold: 'Red Text (tebal)' };
const show = (c: number, v: string | number) => typeof v !== 'number' ? v : c === 5 ? (v * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + '%' : rp(v);
const rng = (c0: number, c1: number) => `$${L(c0)}$2:$${L(c1)}$${N + 1}`;

const MISSIONS: Mission[] = [
  { id: 'c1', text: 'Pilih kolom <b>E</b> (Realisasi) › Highlight Cells Rules › <b>Greater Than</b> 100.000.000.' },
  { id: 'c2', text: 'Temukan faktur ganda: kolom <b>A</b> › Highlight Cells Rules › <b>Duplicate Values</b>.' },
  { id: 'c3', text: 'Kolom <b>F</b> (Capaian) › Top/Bottom Rules › <b>Top 10 Items</b>, ubah menjadi 3.' },
  { id: 'c4', text: 'Beri <b>Data Bars</b> pada kolom Realisasi.' },
  { id: 'c5', text: 'Warnai <b>seluruh baris</b> yang capaiannya di bawah 100%: klik pojok kiri atas tabel, lalu New Rule › Use a formula. Kuncinya ada di tanda <b>$</b>.' },
  { id: 'c6', text: 'Hapus aturan lewat <b>Manage Rules</b> › Delete Rule, atau <b>Clear Rules</b>.' },
];

function buildSheet() {
  const cells: Record<string, string | number> = {};
  HEAD.forEach((h, j) => { cells[L(j) + 1] = h; });
  ROWS.forEach((r, i) => r.forEach((v, j) => { cells[L(j) + (i + 2)] = v; }));
  return XL.makeSheet(cells);
}

export function CFSim() {
  const sheet = useMemo(buildSheet, []);
  const [sel, setSel] = useState<Sel>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [menu, setMenu] = useState(false);
  const [dlg, setDlg] = useState<null | { k: Kind; a: string; b: string; s: string; n: string; f: string; fmt: Fmt; err?: string }>(null);
  const [manage, setManage] = useState(false);
  const [nid, setNid] = useState(1);
  const [warn, setWarn] = useState('');
  const { done, mark } = useMissions();

  const formulaHit = (r: Rule, ri: number, c: number) => {
    const f = XL.shiftFormula(r.f!, ri, c - r.c0) as string;
    const v = sheet.evalFormula(f.slice(1));
    return !XL.isErr(v) && (v === true || (typeof v === 'number' && v !== 0));
  };
  // hasil tiap aturan dihitung per sel
  const evalRule = (r: Rule) => {
    const cells: { ri: number; c: number; v: string | number }[] = [];
    for (let ri = 0; ri < N; ri++) for (let c = r.c0; c <= r.c1; c++) cells.push({ ri, c, v: ROWS[ri][c] });
    const nums = cells.map(x => x.v).filter((v): v is number => typeof v === 'number');
    const max = Math.max(...nums), min = Math.min(...nums), avg = nums.reduce((a, b) => a + b, 0) / (nums.length || 1);
    const sorted = [...nums].sort((a, b) => b - a);
    const cnt = new Map<string, number>(); cells.forEach(x => cnt.set(String(x.v).toLowerCase(), (cnt.get(String(x.v).toLowerCase()) || 0) + 1));
    const hit = new Map<string, { on: boolean; t?: number }>();
    for (const x of cells) {
      const v = x.v, isN = typeof v === 'number'; let on = false, t: number | undefined;
      switch (r.k) {
        case 'gt': on = isN && v > r.a!; break;
        case 'lt': on = isN && v < r.a!; break;
        case 'eq': on = isN ? v === r.a : String(v).toLowerCase() === String(r.s ?? '').toLowerCase(); break;
        case 'between': on = isN && v >= Math.min(r.a!, r.b!) && v <= Math.max(r.a!, r.b!); break;
        case 'text': on = String(v).toLowerCase().includes((r.s || '').toLowerCase()); break;
        case 'dup': on = (cnt.get(String(v).toLowerCase()) || 0) > 1; break;
        case 'uniq': on = (cnt.get(String(v).toLowerCase()) || 0) === 1; break;
        case 'top': on = isN && v >= sorted[Math.min(r.n!, sorted.length) - 1]; break;
        case 'bottom': on = isN && v <= sorted[Math.max(0, sorted.length - r.n!)]; break;
        case 'above': on = isN && v > avg; break;
        case 'below': on = isN && v < avg; break;
        case 'bar': case 'scale': case 'icon': on = isN; t = isN ? (r.k === 'bar' ? v / (max || 1) : (v - min) / ((max - min) || 1)) : undefined; break;
        case 'formula': on = formulaHit(r, x.ri, x.c); break;
      }
      hit.set(x.ri + ':' + x.c, { on, t });
    }
    return hit;
  };
  const results = useMemo(() => rules.map(r => ({ r, hit: evalRule(r) })), [rules]);

  const add = (r: Omit<Rule, 'id'>) => {
    const rule = { ...r, id: nid }; setNid(n => n + 1);
    setRules(rs => [rule, ...rs]); // aturan terbaru di urutan teratas (prioritas tertinggi)
    const one = (c: number) => r.c0 === c && r.c1 === c;
    if (r.k === 'gt' && one(4) && r.a === 100000000) mark('c1');
    if (r.k === 'dup' && one(0)) mark('c2');
    if (r.k === 'top' && one(5) && r.n === 3) mark('c3');
    if (r.k === 'bar' && (one(4) || one(3))) mark('c4');
    if (r.k === 'formula' && r.c0 === 0 && r.c1 === 5) {
      const h = evalRule(rule as Rule);
      const ok = ROWS.every((row, ri) => { const want = (row[5] as number) < 1; return HEAD.every((_, c) => h.get(ri + ':' + c)?.on === want); });
      if (ok) mark('c5');
    }
  };
  const pick = (k: Kind) => {
    setMenu(false);
    if (!sel) { setWarn('Pilih dulu kolom (klik huruf kolom) atau seluruh tabel (klik pojok kiri atas).'); return; }
    setWarn('');
    if (k === 'bar' || k === 'scale' || k === 'icon') { add({ c0: sel.c0, c1: sel.c1, k, fmt: 'red' }); return; }
    setDlg({ k, a: '', b: '', s: '', n: k === 'top' || k === 'bottom' ? '10' : '', f: '=', fmt: 'red' });
  };
  const okDlg = () => {
    if (!dlg || !sel) return;
    const base = { c0: sel.c0, c1: sel.c1, k: dlg.k, fmt: dlg.fmt };
    if (dlg.k === 'formula') {
      const f = dlg.f.trim();
      if (!f.startsWith('=') || f.length < 2) { setDlg({ ...dlg, err: 'Rumus harus diawali tanda =.' }); return; }
      try { XL.parse(f.slice(1)); } catch { setDlg({ ...dlg, err: 'Ada masalah dengan rumus ini. Periksa tanda kurung dan tanda kutip.' }); return; }
      add({ ...base, f });
    } else if (dlg.k === 'between') add({ ...base, a: parseNum(dlg.a), b: parseNum(dlg.b) });
    else if (dlg.k === 'gt' || dlg.k === 'lt') add({ ...base, a: parseNum(dlg.a) });
    else if (dlg.k === 'eq') { const n = parseNum(dlg.a); add({ ...base, a: isNaN(n) ? undefined : n, s: dlg.a }); }
    else if (dlg.k === 'text') add({ ...base, s: dlg.a });
    else if (dlg.k === 'top' || dlg.k === 'bottom') add({ ...base, n: Math.max(1, Math.round(parseNum(dlg.n) || 10)) });
    else add(base);
    setDlg(null);
  };
  const removeRule = (id: number) => { setRules(rs => rs.filter(r => r.id !== id)); mark('c6'); };
  const clear = (all: boolean) => {
    setMenu(false);
    if (all) { if (rules.length) mark('c6'); setRules([]); return; }
    if (!sel) return;
    const keep = rules.filter(r => r.c1 < sel.c0 || r.c0 > sel.c1);
    if (keep.length < rules.length) mark('c6');
    setRules(keep);
  };

  const desc = (r: Rule) => ({
    gt: `Cell Value > ${rp(r.a ?? 0)}`, lt: `Cell Value < ${rp(r.a ?? 0)}`, eq: `Cell Value = ${r.s}`, between: `Cell Value between ${rp(r.a ?? 0)} and ${rp(r.b ?? 0)}`,
    text: `Cell Value contains "${r.s}"`, dup: 'Duplicate Values', uniq: 'Unique Values', top: `Top ${r.n}`, bottom: `Bottom ${r.n}`, above: 'Above Average', below: 'Below Average',
    bar: 'Data Bar', scale: 'Graded Color Scale', icon: 'Icon Set', formula: `Formula: ${r.f}`,
  } as Record<Kind, string>)[r.k];

  const cellView = (ri: number, c: number) => {
    let cls = '', bar: number | undefined, scale: number | undefined, icon: number | undefined;
    for (const { r, hit } of results) {
      const h = hit.get(ri + ':' + c); if (!h || !h.on) continue;
      if (r.k === 'bar') bar ??= h.t; else if (r.k === 'scale') scale ??= h.t; else if (r.k === 'icon') icon ??= h.t; else if (!cls) cls = 'ds-f-' + r.fmt;
    }
    return { cls, bar, scale, icon };
  };
  const sel0 = sel ? `${L(sel.c0)}2:${L(sel.c1)}${N + 1}` : 'A1';

  return (
    <div className="pf xs ds">
      <div className="pf-tabs" role="tablist"><button role="tab" aria-selected>Home</button></div>
      <div className="pf-ribbon">
        <div className="ds-menuwrap">
          <button className="pf-rb" aria-expanded={menu} onClick={() => setMenu(m => !m)}>Conditional Formatting ▾</button>
          {menu && (
            <div className="pf-menu ds-cfmenu" role="menu">
              <p className="ds-mh">Highlight Cells Rules</p>
              <button onClick={() => pick('gt')}>Greater Than…</button><button onClick={() => pick('lt')}>Less Than…</button>
              <button onClick={() => pick('between')}>Between…</button><button onClick={() => pick('eq')}>Equal To…</button>
              <button onClick={() => pick('text')}>Text that Contains…</button><button onClick={() => pick('dup')}>Duplicate Values…</button>
              <p className="ds-mh">Top/Bottom Rules</p>
              <button onClick={() => pick('top')}>Top 10 Items…</button><button onClick={() => pick('bottom')}>Bottom 10 Items…</button>
              <button onClick={() => pick('above')}>Above Average…</button><button onClick={() => pick('below')}>Below Average…</button>
              <p className="ds-mh">Visual</p>
              <button onClick={() => pick('bar')}>Data Bars</button><button onClick={() => pick('scale')}>Color Scales</button><button onClick={() => pick('icon')}>Icon Sets</button>
              <hr />
              <button onClick={() => pick('formula')}>New Rule… (Use a formula)</button>
              <button onClick={() => clear(false)}>Clear Rules from Selected Cells</button>
              <button onClick={() => clear(true)}>Clear Rules from Entire Sheet</button>
              <button onClick={() => { setMenu(false); setManage(true); }}>Manage Rules…</button>
            </div>)}
        </div>
        {warn && <span className="ds-warn" role="status">{warn}</span>}
      </div>
      <div className="pf-fx"><span className="pf-nb">{sel0}</span><i>fx</i><span className="pf-fv2">{sel ? `${rules.length} aturan di sheet ini` : 'Klik huruf kolom, atau pojok kiri atas untuk memilih seluruh tabel'}</span></div>
      <div className="pf-sheet xs-sheet" onClick={() => setMenu(false)}>
        <table className="pf-grid">
          <thead><tr>
            <th className={'ds-colh' + (sel && sel.c0 === 0 && sel.c1 === 5 ? ' on' : '')}><button type="button" aria-label="Pilih seluruh tabel A2:F13" onClick={() => setSel({ c0: 0, c1: 5 })}>◢</button></th>
            {HEAD.map((_, i) => <th key={i} className={'ds-colh' + (sel && sel.c0 <= i && i <= sel.c1 ? ' on' : '')}><button type="button" onClick={() => setSel({ c0: i, c1: i })}>{L(i)}</button></th>)}
          </tr></thead>
          <tbody>
            <tr><th>1</th>{HEAD.map(h => <td key={h} className="pf-dh">{h}</td>)}</tr>
            {ROWS.map((row, ri) => (
              <tr key={ri}><th>{ri + 2}</th>{row.map((v, c) => {
                const cv = cellView(ri, c), inSel = sel && sel.c0 <= c && c <= sel.c1;
                const style = cv.scale !== undefined ? { background: `color-mix(in srgb, var(--ds-good) ${Math.round(cv.scale * 100)}%, var(--ds-bad))` } : undefined;
                return (
                  <td key={c} className={(typeof v === 'number' ? 'n ' : '') + cv.cls + (inSel ? ' xs-sel' : '')} style={style}>
                    {cv.bar !== undefined && <span className="ds-bar" style={{ width: Math.max(2, cv.bar * 100) + '%' }} aria-hidden="true" />}
                    {cv.icon !== undefined && <span className={'ds-ic ' + (cv.icon >= 2 / 3 ? 'up' : cv.icon >= 1 / 3 ? 'mid' : 'down')} aria-hidden="true" />}
                    <span className="ds-v">{show(c, v)}</span>
                  </td>);
              })}</tr>))}
          </tbody>
        </table>
      </div>
      <div className="pf-sheets"><button aria-pressed>Pencapaian</button><span className="xs-status">{sel ? `Terpilih ${sel0}` : 'Ready'}</span></div>

      {dlg && (() => {
        const title = ({ gt: 'Greater Than', lt: 'Less Than', between: 'Between', eq: 'Equal To', text: 'Text That Contains', dup: 'Duplicate Values', uniq: 'Duplicate Values', top: 'Top 10 Items', bottom: 'Bottom 10 Items', above: 'Above Average', below: 'Below Average', formula: 'New Formatting Rule' } as Record<string, string>)[dlg.k];
        const fmtSel = <label className="pf-field">with <select value={dlg.fmt} onChange={e => setDlg({ ...dlg, fmt: e.target.value as Fmt })}>{(Object.keys(FMT_L) as Fmt[]).map(f => <option key={f} value={f}>{FMT_L[f]}</option>)}</select></label>;
        return (
          <Dialog title={title} onCancel={() => setDlg(null)} onOk={okDlg}
            okDisabled={(['gt', 'lt', 'eq', 'text'].includes(dlg.k) && !dlg.a.trim()) || (dlg.k === 'between' && (!dlg.a.trim() || !dlg.b.trim()))}>
            {['gt', 'lt', 'eq', 'text'].includes(dlg.k) && <><p className="pf-dlg-s">Format cells that {dlg.k === 'gt' ? 'are GREATER THAN' : dlg.k === 'lt' ? 'are LESS THAN' : dlg.k === 'eq' ? 'are EQUAL TO' : 'contain the text'}:</p>
              <input className="pf-in" autoFocus value={dlg.a} onChange={e => setDlg({ ...dlg, a: e.target.value })} placeholder={dlg.k === 'text' ? 'Jakarta' : '100.000.000'} /></>}
            {dlg.k === 'between' && <><p className="pf-dlg-s">Format cells that are BETWEEN:</p><div className="ds-row"><input className="pf-in" autoFocus value={dlg.a} onChange={e => setDlg({ ...dlg, a: e.target.value })} /> and <input className="pf-in" value={dlg.b} onChange={e => setDlg({ ...dlg, b: e.target.value })} /></div></>}
            {(dlg.k === 'dup' || dlg.k === 'uniq') && <label className="pf-field">Format cells that contain: <select value={dlg.k} onChange={e => setDlg({ ...dlg, k: e.target.value as Kind })}><option value="dup">Duplicate</option><option value="uniq">Unique</option></select> values</label>}
            {(dlg.k === 'top' || dlg.k === 'bottom') && <label className="pf-field">Format cells that rank in the {dlg.k === 'top' ? 'TOP' : 'BOTTOM'}: <input className="pf-in ds-narrow" autoFocus inputMode="numeric" value={dlg.n} onChange={e => setDlg({ ...dlg, n: e.target.value })} /></label>}
            {(dlg.k === 'above' || dlg.k === 'below') && <p className="pf-dlg-s">Format cells that are {dlg.k.toUpperCase()} AVERAGE for the selected range</p>}
            {dlg.k === 'formula' && <><p className="pf-dlg-s">Select a Rule Type: <b>Use a formula to determine which cells to format</b></p>
              <p className="pf-dlg-s">Format values where this formula is true (ditulis untuk sel kiri atas rentang, {L(sel!.c0)}2):</p>
              <input className="pf-in ds-mono" autoFocus value={dlg.f} onChange={e => setDlg({ ...dlg, f: e.target.value, err: undefined })} placeholder="=$F2<1" />
              {dlg.err && <p className="ds-err" role="alert">{dlg.err}</p>}</>}
            {fmtSel}
            <p className="ds-note">Applies to: <code>={rng(sel!.c0, sel!.c1)}</code></p>
          </Dialog>);
      })()}

      {manage && (
        <Dialog title="Conditional Formatting Rules Manager" wide onCancel={() => setManage(false)} onOk={() => setManage(false)}>
          <p className="pf-dlg-s">Show formatting rules for: This Worksheet. Aturan paling atas punya prioritas tertinggi.</p>
          {rules.length ? (
            <div className="ds-rules">
              <div className="ds-rule ds-rule-h"><span>Rule (applied in order shown)</span><span>Format</span><span>Applies to</span><span /></div>
              {rules.map(r => <div key={r.id} className="ds-rule"><span className="ds-mono">{desc(r)}</span><span className={['bar', 'scale', 'icon'].includes(r.k) ? '' : 'ds-f-' + r.fmt}>{['bar', 'scale', 'icon'].includes(r.k) ? '—' : 'AaBbCc'}</span><span className="ds-mono">={rng(r.c0, r.c1)}</span><button className="btn sm" onClick={() => removeRule(r.id)}>Delete Rule</button></div>)}
            </div>) : <p className="ds-note">Belum ada aturan.</p>}
        </Dialog>
      )}

      <Missions list={MISSIONS} done={done} tip={<>Pada rumus untuk seluruh baris, <code>=$F2&lt;1</code> mengunci kolom F tetapi membiarkan baris bergeser. Tanpa <b>$</b>, sel di kolom lain akan memeriksa kolom yang salah. Aturan teratas di Manage Rules menang kalau dua aturan mewarnai sel yang sama.</>} />
    </div>
  );
}
