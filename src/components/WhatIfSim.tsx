// Simulasi Data › What-If Analysis (Goal Seek, Scenario Manager, Data Table) dan Solver, meniru dialog Excel.
import { useState } from 'react';

const rp = (n: number, d = 0) => (isFinite(n) ? n.toLocaleString('id-ID', { maximumFractionDigits: d, minimumFractionDigits: d }) : '#NUM!');
const pct = (n: number) => (n * 100).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + '%';
const pmt = (r: number, n: number, pv: number) => (n <= 0 ? NaN : r === 0 ? pv / n : (pv * r) / (1 - Math.pow(1 + r, -n)));
const num = (s: string) => Number(String(s).replace(/\s|Rp/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.').replace('%', '')) / (String(s).includes('%') ? 100 : 1);

type Tab = 'goal' | 'scen' | 'table' | 'solver';
const MISSIONS = [
  { id: 'w1', text: '<b>Goal Seek</b>: cari pinjaman maksimal agar angsuran tepat <b>Rp5.000.000</b> (By changing B1).' },
  { id: 'w2', text: '<b>Scenario Manager</b>: buat skenario <b>Optimis</b>, <b>Normal</b>, <b>Pesimis</b>, lalu Show salah satunya.' },
  { id: 'w3', text: 'Buat <b>Scenario Summary</b> untuk membandingkan laba ketiga skenario.' },
  { id: 'w4', text: '<b>Data Table satu variabel</b>: angsuran untuk bunga 6%–12% (Column input cell = B2).' },
  { id: 'w5', text: '<b>Data Table dua variabel</b>: bunga × tenor (Row input = B3, Column input = B2).' },
  { id: 'w6', text: '<b>Solver</b>: maksimalkan laba produksi dengan batasan jam kerja & kayu, lalu buat <b>Answer Report</b>.' },
];

export function WhatIfSim() {
  const [tab, setTab] = useState<Tab>('goal');
  const [done, setDone] = useState<Set<string>>(new Set());
  const mark = (id: string) => setDone(d => (d.has(id) ? d : new Set(d).add(id)));
  return (
    <div className="pf xs">
      <div className="pf-tabs" role="tablist"><button role="tab" aria-selected>Data</button></div>
      <div className="pf-ribbon">
        <span className="pf-hint xs-grp">What-If Analysis ▾</span>
        {([['goal', 'Goal Seek…'], ['scen', 'Scenario Manager…'], ['table', 'Data Table…']] as [Tab, string][]).map(([t, l]) => <button key={t} className="pf-rb" aria-pressed={tab === t} onClick={() => setTab(t)}>{l}</button>)}
        <span className="pf-sep" />
        <button className="pf-rb" aria-pressed={tab === 'solver'} onClick={() => setTab('solver')}>Solver</button>
        <span className="pf-hint">Solver adalah add-in: aktifkan lewat File › Options › Add-ins › Excel Add-ins › Solver Add-in.</span>
      </div>
      {tab === 'goal' && <GoalSeek mark={mark} />}
      {tab === 'scen' && <Scenario mark={mark} />}
      {tab === 'table' && <DataTable mark={mark} />}
      {tab === 'solver' && <Solver mark={mark} />}
      <div className="pf-missions">
        <p className="pf-m-h">Misi latihan <span>{done.size}/{MISSIONS.length}</span></p>
        <ol>{MISSIONS.map(m => <li key={m.id} className={done.has(m.id) ? 'ok' : ''}><span className="pf-m-c" aria-hidden="true">{done.has(m.id) ? '✓' : ''}</span><span dangerouslySetInnerHTML={{ __html: m.text }} /></li>)}</ol>
      </div>
    </div>
  );
}

/* ---------- lembar kecil */
type R = [string, string, string?, boolean?]; // label, nilai tampil, rumus, disorot
function Mini({ title, rows, active, onPick }: { title?: string; rows: R[]; active?: string; onPick?: (addr: string) => void }) {
  return (
    <table className="pf-grid xs-mini">
      <thead><tr><th />{['A', 'B', 'C'].map(c => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>
        {title && <tr><th>0</th><td colSpan={3} className="pf-dh">{title}</td></tr>}
        {rows.map(([l, v, f, hl], i) => {
          const addr = 'B' + (i + 1);
          return <tr key={i}><th>{i + 1}</th><td>{l}</td>
            <td className={'n' + (active === addr ? ' act' : '') + (hl ? ' xs-hl' : '')} title={f} onClick={() => onPick?.(addr)}>{v}</td>
            <td className="xs-f">{f ?? ''}</td></tr>;
        })}
      </tbody>
    </table>
  );
}
const Dlg = ({ title, children }: { title: string; children: React.ReactNode }) => <div className="pf-dlg-in xs-dlg" role="group" aria-label={title}><p className="pf-dlg-t">{title}</p>{children}</div>;

/* ---------- Goal Seek */
function GoalSeek({ mark }: { mark: (id: string) => void }) {
  const [v, setV] = useState({ B1: 300_000_000, B2: 0.09, B3: 120 });
  const ang = (x = v) => pmt(x.B2 / 12, x.B3, x.B1);
  const [to, setTo] = useState('5000000');
  const [by, setBy] = useState<'B1' | 'B2' | 'B3'>('B1');
  const [res, setRes] = useState<null | { ok: boolean; prev: typeof v; val: number }>(null);
  const run = () => {
    const target = num(to); if (!isFinite(target)) return;
    const f = (x: number) => ang({ ...v, [by]: x }) - target;
    let lo = by === 'B1' ? 0 : by === 'B2' ? 0 : 1, hi = by === 'B1' ? 1e13 : by === 'B2' ? 5 : 1200;
    let flo = f(lo), fhi = f(hi), ok = isFinite(flo) && isFinite(fhi) && Math.sign(flo) !== Math.sign(fhi);
    let x = v[by];
    if (ok) { for (let i = 0; i < 200; i++) { x = (lo + hi) / 2; const fx = f(x); if (Math.sign(fx) === Math.sign(flo)) { lo = x; flo = fx; } else hi = x; } }
    if (by === 'B3' && ok) x = Math.round(x * 1e6) / 1e6;
    const prev = v; const nv = { ...v, [by]: ok ? x : v[by] };
    setV(nv); setRes({ ok, prev, val: ang(nv) });
    if (ok && by === 'B1' && Math.abs(target - 5_000_000) < 1) mark('w1');
  };
  return (
    <div className="xs-body">
      <div><Mini rows={[
        ['Pinjaman', 'Rp' + rp(v.B1), undefined, by === 'B1'],
        ['Bunga per tahun', pct(v.B2), undefined, by === 'B2'],
        ['Tenor (bulan)', rp(v.B3, by === 'B3' ? 2 : 0), undefined, by === 'B3'],
        ['Angsuran / bulan', 'Rp' + rp(ang()), '=PMT(B2/12,B3,-B1)', true],
      ]} active="B4" /></div>
      {!res ? (
        <Dlg title="Goal Seek">
          <label className="pf-field">Set cell: <input readOnly value="$B$4" /></label>
          <label className="pf-field">To value: <input value={to} onChange={e => setTo(e.target.value)} inputMode="decimal" /></label>
          <label className="pf-field">By changing cell: <select value={by} onChange={e => setBy(e.target.value as any)}><option value="B1">$B$1 (Pinjaman)</option><option value="B2">$B$2 (Bunga)</option><option value="B3">$B$3 (Tenor)</option></select></label>
          <p className="pf-m-tip">Set cell harus berisi <b>rumus</b>; By changing cell harus berisi <b>angka</b> (bukan rumus) yang dipakai rumus itu.</p>
          <div className="pf-dlg-b"><button className="btn sm primary" onClick={run}>OK</button></div>
        </Dlg>
      ) : (
        <Dlg title="Goal Seek Status">
          <p>{res.ok ? <>Goal Seeking with Cell B4 <b>found a solution.</b></> : <>Goal Seeking with Cell B4 <b>may not have found a solution.</b></>}</p>
          <p className="pf-dlg-s">Target value: {rp(num(to))}<br />Current value: {rp(res.val, 2)}</p>
          {res.ok && <p className="pf-m-tip">{by === 'B1' ? <>Pinjaman maksimal ≈ <b>Rp{rp(v.B1)}</b>.</> : by === 'B2' ? <>Bunga yang dibutuhkan ≈ <b>{pct(v.B2)}</b> per tahun.</> : <>Tenor yang dibutuhkan ≈ <b>{rp(v.B3, 1)}</b> bulan (bulatkan ke atas).</>}</p>}
          <div className="pf-dlg-b"><button className="btn sm primary" onClick={() => setRes(null)}>OK</button><button className="btn sm" onClick={() => { setV(res.prev); setRes(null); }}>Cancel</button></div>
        </Dlg>
      )}
    </div>
  );
}

/* ---------- Scenario Manager */
type Sc = { name: string; vals: number[]; comment: string };
const SC_CELLS = ['Harga jual', 'Volume (unit)', 'Biaya variabel/unit'];
function Scenario({ mark }: { mark: (id: string) => void }) {
  const [cur, setCur] = useState([50_000, 2_000, 30_000]);
  const fixed = 25_000_000;
  const laba = (x: number[]) => (x[0] - x[2]) * x[1] - fixed;
  const [list, setList] = useState<Sc[]>([]);
  const [pick, setPick] = useState(0);
  const [edit, setEdit] = useState<null | { name: string; vals: string[] }>(null);
  const [sum, setSum] = useState(false);
  const presets: Record<string, number[]> = { Optimis: [55_000, 2_600, 28_000], Normal: [50_000, 2_000, 30_000], Pesimis: [45_000, 1_500, 32_000] };
  const save = () => {
    if (!edit || !edit.name.trim()) return;
    const vals = edit.vals.map(num); if (vals.some(x => !isFinite(x))) return;
    setList(l => { const n = [...l.filter(s => s.name !== edit.name.trim()), { name: edit.name.trim(), vals, comment: 'Created by Jagoan Excel' }]; return n; });
    setEdit(null);
  };
  const names = new Set(list.map(s => s.name));
  return (
    <div className="xs-body">
      <div>{!sum ? <Mini rows={[
        ['Harga jual', 'Rp' + rp(cur[0])], ['Volume (unit)', rp(cur[1])], ['Biaya variabel/unit', 'Rp' + rp(cur[2])], ['Biaya tetap', 'Rp' + rp(fixed)],
        ['Laba', 'Rp' + rp(laba(cur)), '=(B1-B3)*B2-B4', true],
      ]} /> : (
        <table className="pf-grid xs-mini xs-sum">
          <thead><tr><th /><th>Scenario Summary</th><th>Current Values:</th>{list.map(s => <th key={s.name}>{s.name}</th>)}</tr></thead>
          <tbody>
            <tr><td className="pf-dh" colSpan={3 + list.length}>Changing Cells:</td></tr>
            {SC_CELLS.map((c, i) => <tr key={c}><td>$B${i + 1}</td><td>{c}</td><td className="n">{rp(cur[i])}</td>{list.map(s => <td key={s.name} className="n">{rp(s.vals[i])}</td>)}</tr>)}
            <tr><td className="pf-dh" colSpan={3 + list.length}>Result Cells:</td></tr>
            <tr><td>$B$5</td><td>Laba</td><td className="n xs-hl">{rp(laba(cur))}</td>{list.map(s => <td key={s.name} className="n xs-hl">{rp(laba(s.vals))}</td>)}</tr>
          </tbody>
          <caption className="xs-cap">Notes: Current Values column represents values of changing cells at time Scenario Summary Report was created. Changing cells for each scenario are highlighted in gray.</caption>
        </table>
      )}</div>
      {sum ? (
        <Dlg title="Sheet: Scenario Summary"><p className="pf-m-tip">Excel membuat sheet baru berisi tabel ini. Laba setiap skenario terlihat berdampingan, tanpa mengubah data asli.</p><div className="pf-dlg-b"><button className="btn sm" onClick={() => setSum(false)}>Kembali ke Sheet1</button></div></Dlg>
      ) : edit ? (
        <Dlg title={names.has(edit.name) ? 'Edit Scenario' : 'Add Scenario'}>
          <label className="pf-field">Scenario name: <input value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} list="xs-sc" /></label>
          <datalist id="xs-sc">{Object.keys(presets).map(k => <option key={k} value={k} />)}</datalist>
          <label className="pf-field">Changing cells: <input readOnly value="$B$1:$B$3" /></label>
          <p className="pf-dlg-s">Scenario Values — enter values for each of the changing cells:</p>
          {SC_CELLS.map((c, i) => <label key={c} className="pf-field">{i + 1}: $B${i + 1} <input value={edit.vals[i]} onChange={e => setEdit({ ...edit, vals: edit.vals.map((x, j) => (j === i ? e.target.value : x)) })} /></label>)}
          {presets[edit.name] && <button className="btn sm" onClick={() => setEdit({ ...edit, vals: presets[edit.name].map(String) })}>Isi angka contoh "{edit.name}"</button>}
          <div className="pf-dlg-b"><button className="btn sm primary" onClick={save}>OK</button><button className="btn sm" onClick={() => setEdit(null)}>Cancel</button></div>
        </Dlg>
      ) : (
        <Dlg title="Scenario Manager">
          <p className="pf-dlg-s">Scenarios:</p>
          <div className="pf-lb xs-lb">{list.length ? list.map((s, i) => <button key={s.name} aria-pressed={pick === i} onClick={() => setPick(i)}>{s.name}</button>) : <span className="pf-dlg-s">No Scenarios defined. Choose Add to add scenarios.</span>}</div>
          <div className="xs-btns">
            <button className="btn sm" onClick={() => { const n = ['Optimis', 'Normal', 'Pesimis'].find(x => !names.has(x)) ?? 'Skenario ' + (list.length + 1); setEdit({ name: n, vals: (presets[n] ?? cur).map(String) }); }}>Add…</button>
            <button className="btn sm" disabled={!list[pick]} onClick={() => { setList(l => l.filter((_, i) => i !== pick)); setPick(0); }}>Delete</button>
            <button className="btn sm" disabled={!list[pick]} onClick={() => setEdit({ name: list[pick].name, vals: list[pick].vals.map(String) })}>Edit…</button>
            <button className="btn sm" disabled={!list.length} onClick={() => { setSum(true); if (list.length >= 3) mark('w3'); }}>Summary…</button>
          </div>
          <p className="pf-dlg-s">Changing cells: $B$1:$B$3 · Comment: {list[pick]?.comment ?? ''}</p>
          <div className="pf-dlg-b"><button className="btn sm primary" disabled={!list[pick]} onClick={() => { setCur(list[pick].vals); if (['Optimis', 'Normal', 'Pesimis'].every(x => names.has(x))) mark('w2'); }}>Show</button></div>
        </Dlg>
      )}
    </div>
  );
}

/* ---------- Data Table */
const RATES = [0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12];
const TENORS = [60, 120, 180, 240];
function DataTable({ mark }: { mark: (id: string) => void }) {
  const base = { B1: 300_000_000, B2: 0.09, B3: 120 };
  const [two, setTwo] = useState(false);
  const [rowIn, setRowIn] = useState(''), [colIn, setColIn] = useState('');
  const [made, setMade] = useState<null | { two: boolean; rowIn: string; colIn: string }>(null);
  const calc = (subs: Record<string, number>) => { const x = { ...base, ...subs }; return pmt(x.B2 / 12, x.B3, x.B1); };
  const ok = () => {
    if (!two && !colIn) return;
    if (two && (!rowIn || !colIn)) return;
    setMade({ two, rowIn, colIn });
    if (!two && colIn === 'B2') mark('w4');
    if (two && rowIn === 'B3' && colIn === 'B2') mark('w5');
  };
  const sel = (v: string, set: (s: string) => void) => <select value={v} onChange={e => set(e.target.value)}><option value="">(kosong)</option><option value="B1">$B$1</option><option value="B2">$B$2</option><option value="B3">$B$3</option></select>;
  const m = made;
  return (
    <div className="xs-body">
      <div>
        <Mini rows={[['Pinjaman', 'Rp' + rp(base.B1)], ['Bunga per tahun', pct(base.B2)], ['Tenor (bulan)', String(base.B3)], ['Angsuran', 'Rp' + rp(calc({})), '=PMT(B2/12,B3,-B1)', true]]} />
        <p className="pf-dlg-s">Range D1:{two ? 'H8' : 'E8'}, sudut kiri atas berisi <code>=B4</code>; bunga di kolom D{two && ', tenor di baris 1'}.</p>
        <table className="pf-grid xs-mini xs-dt">
          <thead><tr><th /><th>D</th>{(two ? TENORS : [0]).map((_, i) => <th key={i}>{String.fromCharCode(69 + i)}</th>)}</tr></thead>
          <tbody>
            <tr><th>1</th><td className="n xs-f">{two ? '=B4' : ''}</td>{two ? TENORS.map(t => <td key={t} className="n pf-dh">{t}</td>) : <td className="n xs-f">=B4</td>}</tr>
            {RATES.map((r, i) => <tr key={r}><th>{i + 2}</th><td className="n pf-dh">{pct(r)}</td>
              {(two ? TENORS : [0]).map(t => {
                if (!m || m.two !== two) return <td key={t} className="n" />;
                const subs: Record<string, number> = {}; subs[m.colIn] = r; if (two) subs[m.rowIn] = t;
                return <td key={t} className="n xs-hl" title={two ? `{=TABLE(${m.rowIn},${m.colIn})}` : `{=TABLE(,${m.colIn})}`}>{rp(calc(subs))}</td>;
              })}</tr>)}
          </tbody>
        </table>
        {m && m.two === two && <p className="pf-m-tip">Isi tabel berupa rumus array <code>{two ? `{=TABLE(${m.rowIn},${m.colIn})}` : `{=TABLE(,${m.colIn})}`}</code>. {(two ? m.rowIn === 'B3' && m.colIn === 'B2' : m.colIn === 'B2') ? 'Input cell sudah benar.' : 'Hasilnya aneh? Input cell salah: angka di kolom D adalah bunga, jadi Column input cell harus $B$2' + (two ? ' dan Row input cell (tenor di baris 1) harus $B$3.' : '.')}</p>}
      </div>
      <Dlg title="Data Table">
        <div className="xs-btns"><button className="btn sm" aria-pressed={!two} onClick={() => { setTwo(false); setMade(null); }}>Satu variabel</button><button className="btn sm" aria-pressed={two} onClick={() => { setTwo(true); setMade(null); }}>Dua variabel</button></div>
        <label className="pf-field">Row input cell: {sel(rowIn, setRowIn)}</label>
        <label className="pf-field">Column input cell: {sel(colIn, setColIn)}</label>
        <p className="pf-m-tip">Blok seluruh tabel (termasuk sel rumus di sudut) dulu, baru buka Data › What-If Analysis › Data Table. Nilai yang berderet ke <b>bawah</b> → Column input cell; yang berderet ke <b>samping</b> → Row input cell.</p>
        <div className="pf-dlg-b"><button className="btn sm primary" onClick={ok}>OK</button></div>
      </Dlg>
    </div>
  );
}

/* ---------- Solver */
const PRODUCTS = [{ n: 'Meja', laba: 450_000, jam: 4, kayu: 6 }, { n: 'Kursi', laba: 200_000, jam: 2, kayu: 2 }, { n: 'Rak', laba: 300_000, jam: 3, kayu: 4 }];
type Lhs = 'Jam' | 'Kayu' | 'Meja' | 'Kursi' | 'Rak';
type Con = { lhs: Lhs; op: '<=' | '>=' | '=' | 'int'; rhs: number };
const CELL: Record<Lhs, string> = { Meja: '$B$2', Kursi: '$C$2', Rak: '$D$2', Jam: '$E$4', Kayu: '$E$5' };
const MAXU = 60;
function Solver({ mark }: { mark: (id: string) => void }) {
  const [x, setX] = useState([0, 0, 0]);
  const [goal, setGoal] = useState<'max' | 'min'>('max');
  const [cons, setCons] = useState<Con[]>([]);
  const [add, setAdd] = useState<Con>({ lhs: 'Jam', op: '<=', rhs: 120 });
  const [res, setRes] = useState<null | { ok: boolean; msg: string; prev: number[]; best: number[] }>(null);
  const [report, setReport] = useState<null | { prev: number[]; best: number[] }>(null);
  const val = (lhs: Lhs, v: number[]) => (lhs === 'Jam' ? v.reduce((a, q, i) => a + q * PRODUCTS[i].jam, 0) : lhs === 'Kayu' ? v.reduce((a, q, i) => a + q * PRODUCTS[i].kayu, 0) : v[PRODUCTS.findIndex(p => p.n === lhs)]);
  const obj = (v: number[]) => v.reduce((a, q, i) => a + q * PRODUCTS[i].laba, 0);
  const okC = (c: Con, v: number[]) => { const a = val(c.lhs, v); return c.op === 'int' ? true : c.op === '<=' ? a <= c.rhs + 1e-9 : c.op === '>=' ? a >= c.rhs - 1e-9 : Math.abs(a - c.rhs) < 1e-9; };
  const solve = () => {
    let best: number[] | null = null, bv = goal === 'max' ? -Infinity : Infinity;
    for (let a = 0; a <= MAXU; a++) for (let b = 0; b <= MAXU; b++) for (let c = 0; c <= MAXU; c++) {
      const v = [a, b, c]; if (!cons.every(k => okC(k, v))) continue;
      const o = obj(v); if (goal === 'max' ? o > bv : o < bv) { bv = o; best = v; }
    }
    if (!best) { setRes({ ok: false, msg: 'Solver could not find a feasible solution.', prev: x, best: x }); return; }
    const unbounded = goal === 'max' && best.some(q => q === MAXU) && !cons.some(c => c.op !== 'int' && (c.lhs === 'Jam' || c.lhs === 'Kayu') && c.op !== '>=');
    if (unbounded) { setRes({ ok: false, msg: 'The Objective Cell values do not converge. Tambahkan batasan (misalnya jam kerja dan kayu) supaya produksi tidak tak terhingga.', prev: x, best: x }); return; }
    setRes({ ok: true, msg: 'Solver found a solution. All Constraints and optimality conditions are satisfied.', prev: x, best }); setX(best);
  };
  const conText = (c: Con) => `${CELL[c.lhs]} ${c.op === 'int' ? '= integer' : c.op + ' ' + c.rhs}`;
  return (
    <div className="xs-body">
      <div>
        <table className="pf-grid xs-mini">
          <thead><tr><th /><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead>
          <tbody>
            <tr><th>1</th><td className="pf-dh">Produk</td>{PRODUCTS.map(p => <td key={p.n} className="pf-dh">{p.n}</td>)}<td className="pf-dh">Total</td></tr>
            <tr><th>2</th><td>Jumlah dibuat</td>{x.map((q, i) => <td key={i} className="n xs-hl">{q}</td>)}<td /></tr>
            <tr><th>3</th><td>Laba/unit</td>{PRODUCTS.map(p => <td key={p.n} className="n">{rp(p.laba)}</td>)}<td className="n xs-hl" title="=SUMPRODUCT(B2:D2,B3:D3)">{rp(obj(x))}</td></tr>
            <tr><th>4</th><td>Jam kerja/unit</td>{PRODUCTS.map(p => <td key={p.n} className="n">{p.jam}</td>)}<td className="n" title="=SUMPRODUCT(B2:D2,B4:D4)">{val('Jam', x)} <small>/ 120</small></td></tr>
            <tr><th>5</th><td>Kayu (m)/unit</td>{PRODUCTS.map(p => <td key={p.n} className="n">{p.kayu}</td>)}<td className="n" title="=SUMPRODUCT(B2:D2,B5:D5)">{val('Kayu', x)} <small>/ 160</small></td></tr>
          </tbody>
        </table>
        <p className="pf-dlg-s">E3 <code>=SUMPRODUCT(B2:D2,B3:D3)</code> · tersedia 120 jam kerja dan 160 m kayu per minggu · rak maksimal 10 (gudang).</p>
        {report && (
          <table className="pf-grid xs-mini xs-sum">
            <caption className="xs-cap">Answer Report 1 · Solver Engine: Simplex LP · Solution: {rp(obj(report.best))}</caption>
            <tbody>
              <tr><td className="pf-dh" colSpan={4}>Objective Cell ({goal === 'max' ? 'Max' : 'Min'})</td></tr>
              <tr><td>$E$3</td><td>Total laba</td><td className="n">{rp(obj(report.prev))}</td><td className="n xs-hl">{rp(obj(report.best))}</td></tr>
              <tr><td className="pf-dh" colSpan={4}>Variable Cells (Original → Final)</td></tr>
              {PRODUCTS.map((p, i) => <tr key={p.n}><td>{CELL[p.n as Lhs]}</td><td>{p.n}</td><td className="n">{report.prev[i]}</td><td className="n xs-hl">{report.best[i]}</td></tr>)}
              <tr><td className="pf-dh" colSpan={4}>Constraints (Cell Value · Status · Slack)</td></tr>
              {cons.filter(c => c.op !== 'int').map((c, i) => { const a = val(c.lhs, report.best); const slack = Math.abs(c.rhs - a); return <tr key={i}><td>{CELL[c.lhs]}</td><td>{conText(c)}</td><td className="n">{a}</td><td>{slack < 1e-9 ? 'Binding · 0' : 'Not Binding · ' + slack}</td></tr>; })}
            </tbody>
          </table>
        )}
      </div>
      {!res ? (
        <Dlg title="Solver Parameters">
          <label className="pf-field">Set Objective: <input readOnly value="$E$3" /></label>
          <div className="xs-btns">To: {(['max', 'min'] as const).map(g => <label key={g} className="pf-radio"><input type="radio" checked={goal === g} onChange={() => setGoal(g)} /> {g === 'max' ? 'Max' : 'Min'}</label>)}</div>
          <label className="pf-field">By Changing Variable Cells: <input readOnly value="$B$2:$D$2" /></label>
          <p className="pf-dlg-s">Subject to the Constraints:</p>
          <div className="pf-lb xs-lb">{cons.length ? cons.map((c, i) => <span key={i} className="xs-con">{conText(c)} <button aria-label="Delete" onClick={() => setCons(cs => cs.filter((_, j) => j !== i))}>Delete</button></span>) : <span className="pf-dlg-s">(belum ada)</span>}</div>
          <div className="xs-add">
            <select value={add.lhs} onChange={e => setAdd({ ...add, lhs: e.target.value as Lhs })}>{(Object.keys(CELL) as Lhs[]).map(k => <option key={k} value={k}>{CELL[k]} ({k})</option>)}</select>
            <select value={add.op} onChange={e => setAdd({ ...add, op: e.target.value as any })}><option>{'<='}</option><option>{'>='}</option><option>=</option><option value="int">int</option></select>
            {add.op !== 'int' && <input inputMode="numeric" value={add.rhs} onChange={e => setAdd({ ...add, rhs: Number(e.target.value) })} />}
            <button className="btn sm" onClick={() => setCons(cs => [...cs, add])}>Add</button>
          </div>
          <button className="btn sm xs-link" onClick={() => setCons([{ lhs: 'Jam', op: '<=', rhs: 120 }, { lhs: 'Kayu', op: '<=', rhs: 160 }, { lhs: 'Rak', op: '<=', rhs: 10 }, { lhs: 'Meja', op: 'int', rhs: 0 }, { lhs: 'Kursi', op: 'int', rhs: 0 }, { lhs: 'Rak', op: 'int', rhs: 0 }])}>Isi batasan contoh</button>
          <label className="pf-radio"><input type="checkbox" checked readOnly /> Make Unconstrained Variables Non-Negative</label>
          <label className="pf-field">Select a Solving Method: <select defaultValue="lp"><option value="lp">Simplex LP</option><option value="grg">GRG Nonlinear</option><option value="evo">Evolutionary</option></select></label>
          <p className="pf-m-tip">Simulator ini mencari jumlah unit bulat (0–{MAXU}) yang memenuhi semua batasan, sama hasilnya dengan Simplex LP + batasan <i>int</i>.</p>
          <div className="pf-dlg-b"><button className="btn sm primary" onClick={solve}>Solve</button><button className="btn sm" onClick={() => { setX([0, 0, 0]); setReport(null); }}>Reset All</button></div>
        </Dlg>
      ) : (
        <Dlg title="Solver Results">
          <p>{res.msg}</p>
          {res.ok && <p className="pf-m-tip">Rencana terbaik: {PRODUCTS.map((p, i) => `${res.best[i]} ${p.n}`).join(', ')} → laba Rp{rp(obj(res.best))}.</p>}
          {res.ok && <><label className="pf-radio"><input type="radio" name="keep" defaultChecked /> Keep Solver Solution</label>
            <p className="pf-dlg-s">Reports: Answer</p></>}
          <div className="pf-dlg-b">
            {res.ok && <button className="btn sm primary" onClick={() => { setReport({ prev: res.prev, best: res.best }); setRes(null); mark('w6'); }}>OK + Answer Report</button>}
            <button className="btn sm" onClick={() => setRes(null)}>OK</button>
            {res.ok && <button className="btn sm" onClick={() => { setX(res.prev); setRes(null); }}>Restore Original Values</button>}
          </div>
        </Dlg>
      )}
    </div>
  );
}


