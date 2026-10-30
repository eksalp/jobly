// Simulasi Macro Recorder: rekam langkah di lembar kecil, lihat kode VBA yang ditulis Excel secara langsung,
// coba Use Relative References, lalu jalankan macro di sheet lain. Juga Save As .xlsm.
import { useEffect, useMemo, useState } from 'react';
import { XL } from '../engine/engine.js';

type Fmt = { b?: boolean; i?: boolean; fill?: boolean; center?: boolean; num?: boolean };
type SheetT = { name: string; cells: Record<string, string>; fmt: Record<string, Fmt>; rows: number };
type Rng = { r1: number; c1: number; r2: number; c2: number; kind: 'cells' | 'col' | 'row' };
type Act =
  | { k: 'sel'; rel: boolean; rng: Rng; dr: number; dc: number }
  | { k: 'fmt'; p: keyof Fmt }
  | { k: 'type'; v: string; rel: boolean; r1c1?: string }
  | { k: 'clear' } | { k: 'autofit' };
type Macro = { name: string; key: string; desc: string; acts: Act[]; store: string };

const COLS = 5, ROWS = 12;
const cn = (c: number) => String.fromCharCode(65 + c);
const ad = (r: number, c: number) => cn(c) + (r + 1);
const norm = (g: Rng): Rng => ({ ...g, r1: Math.min(g.r1, g.r2), r2: Math.max(g.r1, g.r2), c1: Math.min(g.c1, g.c2), c2: Math.max(g.c1, g.c2) });
const addr = (g: Rng) => (g.kind === 'col' ? `${cn(g.c1)}:${cn(g.c2)}` : g.kind === 'row' ? `${g.r1 + 1}:${g.r2 + 1}` : g.r1 === g.r2 && g.c1 === g.c2 ? ad(g.r1, g.c1) : `${ad(g.r1, g.c1)}:${ad(g.r2, g.c2)}`);

function seed(name: string, data: [string, string, number, number][]): SheetT {
  const cells: Record<string, string> = { A1: 'nama', B1: 'cabang', C1: 'nilai', D1: 'target' };
  data.forEach(([n, c, v, t], i) => { cells['A' + (i + 2)] = n; cells['B' + (i + 2)] = c; cells['C' + (i + 2)] = String(v); cells['D' + (i + 2)] = String(t); });
  return { name, cells, fmt: {}, rows: data.length + 1 };
}
const SHEETS0 = (): SheetT[] => [
  seed('Juli', [['rina', 'Jakarta', 12500000, 10000000], ['yusuf', 'Bandung', 8400000, 9000000], ['maya', 'Surabaya', 15100000, 12000000], ['hendra', 'Medan', 6900000, 7000000], ['dewi', 'Jakarta', 11250000, 10000000]]),
  seed('Agustus', [['rina', 'Jakarta', 13200000, 10000000], ['yusuf', 'Bandung', 9100000, 9000000], ['maya', 'Surabaya', 14800000, 12000000], ['hendra', 'Medan', 7400000, 7000000], ['dewi', 'Jakarta', 10900000, 10000000], ['bagas', 'Bali', 5600000, 6000000], ['sari', 'Makassar', 8800000, 8000000]]),
];

/** Rumus A1 → R1C1 relatif terhadap sel aktif, persis cara recorder menyimpan rumus. */
function toR1C1(f: string, r: number, c: number) {
  return f.replace(/(\$?)([A-Z])(\$?)(\d+)/g, (_, ac, col, ar, row) => {
    const rr = +row - 1, cc = col.charCodeAt(0) - 65;
    const R = ar ? `R${rr + 1}` : rr === r ? 'R' : `R[${rr - r}]`;
    const C = ac ? `C${cc + 1}` : cc === c ? 'C' : `C[${cc - c}]`;
    return R + C;
  });
}
const q = (s: string) => '"' + s.replace(/"/g, '""') + '"';

function codeOf(m: { name: string; key: string; desc: string; acts: Act[] }, start: { r: number; c: number }) {
  const out = [`Sub ${m.name}()`, `'`, `' ${m.name} Macro`];
  if (m.desc) out.push(`' ${m.desc}`);
  out.push(`'`);
  if (m.key) out.push(`' Keyboard Shortcut: Ctrl+Shift+${m.key.toUpperCase()}`, `'`);
  let cur = start;
  for (const a of m.acts) {
    if (a.k === 'sel') {
      const g = a.rng;
      if (!a.rel) out.push(g.kind === 'col' ? `    Columns("${addr(g)}").Select` : g.kind === 'row' ? `    Rows("${addr(g)}").Select` : `    Range("${addr(g)}").Select`);
      else {
        const off = a.dr || a.dc ? `ActiveCell.Offset(${a.dr}, ${a.dc}).` : 'ActiveCell.';
        const h = g.r2 - g.r1, w = g.c2 - g.c1;
        out.push(g.kind === 'col' ? `    ${off}Columns("A:${cn(w)}").EntireColumn.Select` : g.kind === 'row' ? `    ${off}Rows("1:${h + 1}").EntireRow.Select` : `    ${off}Range("${h || w ? `A1:${ad(h, w)}` : 'A1'}").Select`);
      }
      cur = { r: g.r1, c: g.c1 };
    } else if (a.k === 'fmt') {
      if (a.p === 'b') out.push('    Selection.Font.Bold = True');
      if (a.p === 'i') out.push('    Selection.Font.Italic = True');
      if (a.p === 'center') out.push('    With Selection', '        .HorizontalAlignment = xlCenter', '        .VerticalAlignment = xlCenter', '    End With');
      if (a.p === 'num') out.push('    Selection.NumberFormat = "#,##0"');
      if (a.p === 'fill') out.push('    With Selection.Interior', '        .Pattern = xlSolid', '        .Color = 65535', '    End With');
    } else if (a.k === 'type') {
      out.push(a.v.startsWith('=') ? `    ActiveCell.FormulaR1C1 = ${q(a.r1c1 ?? toR1C1(a.v, cur.r, cur.c))}` : `    ActiveCell.FormulaR1C1 = ${q(a.v)}`);
    } else if (a.k === 'clear') out.push('    Selection.ClearContents');
    else if (a.k === 'autofit') out.push('    Selection.Columns.AutoFit');
  }
  out.push('End Sub');
  return out.join('\n');
}

const MISSIONS = [
  { id: 'r1', text: 'Developer › <b>Record Macro</b>, beri nama <code>RapikanLaporan</code> dan shortcut <b>Ctrl+Shift+R</b>.' },
  { id: 'r2', text: 'Sambil merekam: blok baris judul (klik nomor baris 1) lalu <b>Bold</b> + <b>Fill</b> kuning; blok kolom C:D lalu <b>Format #,##0</b>.' },
  { id: 'r3', text: '<b>Stop Recording</b>, lalu lihat kodenya di panel Visual Basic Editor.' },
  { id: 'r4', text: 'Buka sheet <b>Agustus</b> dan jalankan macro (Macros › Run, atau tekan shortcut-nya).' },
  { id: 'r5', text: 'Rekam macro kedua dengan <b>Use Relative References</b> menyala yang mengetik rumus <code>=SUM(…)</code> di bawah data, lalu jalankan dari sel lain.' },
  { id: 'r6', text: '<b>Save As</b> sebagai <b>.xlsm</b> (Excel Macro-Enabled Workbook) supaya macro tidak hilang.' },
];

export function MacroSim() {
  const [sheets, setSheets] = useState<SheetT[]>(SHEETS0);
  const [si, setSi] = useState(0);
  const [selR, setSelR] = useState<Rng>({ r1: 0, c1: 0, r2: 0, c2: 0, kind: 'cells' });
  const [act, setAct] = useState({ r: 0, c: 0 });
  const [rec, setRec] = useState<null | { name: string; key: string; desc: string; store: string; acts: Act[]; start: { r: number; c: number } }>(null);
  const [rel, setRel] = useState(false);
  const [macros, setMacros] = useState<Macro[]>([]);
  const [dlg, setDlg] = useState<null | 'record' | 'macros' | 'save'>(null);
  const [form, setForm] = useState({ name: 'Macro1', key: '', desc: '', store: 'This Workbook' });
  const [typing, setTyping] = useState('');
  const [vbe, setVbe] = useState<number | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState<Set<string>>(new Set());
  const mark = (id: string) => setDone(d => (d.has(id) ? d : new Set(d).add(id)));
  const sh = sheets[si];

  const values = useMemo(() => { const s = XL.makeSheet(sh.cells); const o: Record<string, unknown> = {}; for (const k of Object.keys(sh.cells)) o[k] = s.value(k); return o; }, [sh.cells]);
  const show = (k: string) => { const v = values[k]; const f = sh.fmt[k]; if (v === undefined || v === null || v === '') return ''; if (typeof v === 'number') return f?.num ? v.toLocaleString('id-ID', { maximumFractionDigits: 0 }) : String(v); return typeof v === 'object' ? String((v as { code?: string }).code ?? '#VALUE!') : String(v); };

  const push = (a: Act) => setRec(r => (r ? { ...r, acts: [...r.acts, a] } : r));
  const select = (g: Rng, anchor = { r: g.r1, c: g.c1 }) => {
    const n = norm(g);
    if (rec) push({ k: 'sel', rel, rng: n, dr: n.r1 - act.r, dc: n.c1 - act.c });
    setSelR(n); setAct(anchor);
  };
  const inSel = (r: number, c: number) => { const g = selR; return g.kind === 'col' ? c >= g.c1 && c <= g.c2 : g.kind === 'row' ? r >= g.r1 && r <= g.r2 : r >= g.r1 && r <= g.r2 && c >= g.c1 && c <= g.c2; };
  const cellsIn = (g: Rng, rows: number) => { const out: string[] = []; const r2 = g.kind === 'col' ? Math.max(rows, ROWS) - 1 : g.r2, c2 = g.kind === 'row' ? COLS - 1 : g.c2; const r1 = g.kind === 'col' ? 0 : g.r1, c1 = g.kind === 'row' ? 0 : g.c1; for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) out.push(ad(r, c)); return out; };

  // terapkan aksi ke sheet (dipakai saat merekam dan saat Run)
  const apply = (s: SheetT, a: Act, st: { sel: Rng; act: { r: number; c: number } }) => {
    if (a.k === 'sel') {
      if (!a.rel) { st.sel = a.rng; st.act = { r: a.rng.r1, c: a.rng.c1 }; }
      else { const r1 = st.act.r + a.dr, c1 = st.act.c + a.dc; st.sel = { kind: a.rng.kind, r1, c1, r2: r1 + a.rng.r2 - a.rng.r1, c2: c1 + a.rng.c2 - a.rng.c1 }; st.act = { r: r1, c: c1 }; }
      return s;
    }
    const cells = { ...s.cells }, fmt = { ...s.fmt };
    if (a.k === 'fmt') for (const k of cellsIn(st.sel, s.rows)) fmt[k] = { ...fmt[k], [a.p]: true };
    if (a.k === 'clear') for (const k of cellsIn(st.sel, s.rows)) delete cells[k];
    if (a.k === 'type') {
      const k = ad(st.act.r, st.act.c);
      // rumus disimpan R1C1: geser referensinya sesuai sel aktif saat ini
      cells[k] = a.v;
      st.act = { r: st.act.r + 1, c: st.act.c }; st.sel = { kind: 'cells', r1: st.act.r, c1: st.act.c, r2: st.act.r, c2: st.act.c };
    }
    return { ...s, cells, fmt, rows: Math.max(s.rows, st.act.r) };
  };
  const doAct = (a: Act) => {
    const st = { sel: selR, act };
    const ns = apply(sh, a, st);
    setSheets(ss => ss.map((x, i) => (i === si ? ns : x))); setSelR(st.sel); setAct(st.act);
    if (rec) {
      if (a.k === 'type') { push(a.v.startsWith('=') ? { ...a, r1c1: toR1C1(a.v, act.r, act.c) } : a); push({ k: 'sel', rel, rng: st.sel, dr: 1, dc: 0 }); }
      else push(a);
    }
  };

  // Run: rumus ketikan direkam sebagai R1C1, jadi saat diputar ulang referensinya relatif ke sel aktif.
  const run = (m: Macro) => {
    const st = { sel: selR, act };
    let s = sh;
    for (const a of m.acts) {
      if (a.k === 'type' && a.r1c1) {
        const back = a.r1c1.replace(/(?<![A-Z])R(\[(-?\d+)\]|(\d+))?C(\[(-?\d+)\]|(\d+))?/g, (_x, _a, rr, ra, _b, cr, ca) => {
          const R = ra ? +ra - 1 : st.act.r + (rr ? +rr : 0); const C = ca ? +ca - 1 : st.act.c + (cr ? +cr : 0);
          return ad(Math.max(0, R), Math.max(0, C));
        });
        s = apply(s, { ...a, v: back }, st);
      } else s = apply(s, a, st);
    }
    setSheets(ss => ss.map((x, i) => (i === si ? s : x))); setSelR(st.sel); setAct(st.act);
    setMsg(`Macro ${m.name} dijalankan di sheet ${sh.name}.`);
    if (si === 1) mark('r4');
    if (m.acts.some(a => a.k === 'sel' && a.rel) && m.acts.some(a => a.k === 'type' && /^=SUM/i.test(a.v))) mark('r5');
  };

  // shortcut Ctrl+Shift+huruf
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || !e.shiftKey) return;
      const m = macros.find(x => x.key && x.key.toLowerCase() === e.key.toLowerCase());
      if (m && !rec) { e.preventDefault(); run(m); }
    };
    document.addEventListener('keydown', on); return () => document.removeEventListener('keydown', on);
  });

  const startRec = () => {
    const name = form.name.trim();
    if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(name)) { setMsg('Nama macro harus diawali huruf, tanpa spasi atau tanda baca (pakai _).'); return; }
    setRec({ ...form, name, acts: [], start: act }); setDlg(null); setMsg('');
    if (name === 'RapikanLaporan' && form.key.toLowerCase() === 'r') mark('r1');
  };
  const stopRec = () => {
    if (!rec) return;
    const m: Macro = { name: rec.name, key: rec.key, desc: rec.desc, acts: rec.acts, store: rec.store };
    setMacros(ms => [...ms.filter(x => x.name !== m.name), m]); setVbe(macros.filter(x => x.name !== m.name).length); setRec(null); mark('r3');
    const has = (p: keyof Fmt) => m.acts.some(a => a.k === 'fmt' && a.p === p);
    if (has('b') && has('fill') && has('num')) mark('r2');
  };
  const code = rec ? codeOf(rec, rec.start) : vbe !== null && macros[vbe] ? codeOf(macros[vbe], { r: 0, c: 0 }) : '';
  const allCode = macros.map(m => codeOf(m, { r: 0, c: 0 })).join('\n\n');

  return (
    <div className="pf xs">
      <div className="pf-tabs" role="tablist"><button role="tab" aria-selected>Developer</button></div>
      <div className="pf-ribbon">
        <button className="pf-rb" onClick={() => setVbe(v => (v === null ? 0 : v))}>⌨ Visual Basic <kbd>Alt+F11</kbd></button>
        <button className="pf-rb" onClick={() => setDlg('macros')}>▶ Macros <kbd>Alt+F8</kbd></button>
        {!rec ? <button className="pf-rb" onClick={() => { setForm(f => ({ ...f, name: 'Macro' + (macros.length + 1), key: '', desc: '' })); setDlg('record'); }}>● Record Macro</button>
          : <button className="pf-rb xs-rec" onClick={stopRec}>■ Stop Recording</button>}
        <button className="pf-rb" aria-pressed={rel} onClick={() => setRel(r => !r)}>⇲ Use Relative References</button>
        <span className="pf-sep" />
        <span className="xs-grp">Home:</span>
        <button className="pf-rb" aria-label="Bold" onClick={() => doAct({ k: 'fmt', p: 'b' })}><b>B</b></button>
        <button className="pf-rb" aria-label="Italic" onClick={() => doAct({ k: 'fmt', p: 'i' })}><em>I</em></button>
        <button className="pf-rb" onClick={() => doAct({ k: 'fmt', p: 'fill' })}><span className="xs-fill" /> Fill</button>
        <button className="pf-rb" onClick={() => doAct({ k: 'fmt', p: 'center' })}>≡ Center</button>
        <button className="pf-rb" onClick={() => doAct({ k: 'fmt', p: 'num' })}>#,##0</button>
        <button className="pf-rb" onClick={() => doAct({ k: 'autofit' })}>↔ AutoFit</button>
        <button className="pf-rb" onClick={() => doAct({ k: 'clear' })}>⌫ Clear</button>
        <span className="pf-sep" />
        <button className="pf-rb" onClick={() => setDlg('save')}>Save As</button>
      </div>
      <div className="pf-fx"><span className="pf-nb">{addr(selR)}</span><i>fx</i>
        <input className="xs-type" placeholder="Ketik isi sel aktif lalu Enter, mis. =SUM(C2:C6)" value={typing} onChange={e => setTyping(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && typing.trim()) { doAct({ k: 'type', v: typing.trim(), rel }); setTyping(''); } }} />
      </div>

      <div className="xs-macro">
        <div className="pf-sheet">
          <table className="pf-grid xs-mgrid">
            <thead><tr><th />{Array.from({ length: COLS }, (_, c) => <th key={c} className={selR.kind === 'col' && c >= selR.c1 && c <= selR.c2 ? 'xs-hsel' : ''} onClick={e => select(e.shiftKey ? { ...selR, kind: 'col', c2: c } : { kind: 'col', r1: 0, r2: ROWS - 1, c1: c, c2: c }, { r: 0, c })} role="button">{cn(c)}</th>)}</tr></thead>
            <tbody>
              {Array.from({ length: ROWS }, (_, r) => (
                <tr key={r}><th className={selR.kind === 'row' && r >= selR.r1 && r <= selR.r2 ? 'xs-hsel' : ''} onClick={e => select(e.shiftKey ? { ...selR, kind: 'row', r2: r } : { kind: 'row', r1: r, r2: r, c1: 0, c2: COLS - 1 }, { r, c: 0 })} role="button">{r + 1}</th>
                  {Array.from({ length: COLS }, (_, c) => {
                    const k = ad(r, c), f = sh.fmt[k] ?? {}, v = values[k];
                    return <td key={c} className={[typeof v === 'number' ? 'n' : '', inSel(r, c) ? 'xs-sel' : '', act.r === r && act.c === c ? 'act' : '', f.b ? 'xs-b' : '', f.i ? 'xs-i' : '', f.fill ? 'xs-y' : '', f.center ? 'xs-c' : ''].filter(Boolean).join(' ')}
                      title={sh.cells[k]?.startsWith('=') ? sh.cells[k] : undefined}
                      onClick={e => select(e.shiftKey ? { kind: 'cells', r1: act.r, c1: act.c, r2: r, c2: c } : { kind: 'cells', r1: r, c1: c, r2: r, c2: c }, e.shiftKey ? act : { r, c })}>{show(k)}</td>;
                  })}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="xs-vbe" aria-label="Visual Basic Editor">
          <p className="xs-vbe-h">Microsoft Visual Basic · VBAProject (Laporan{saved ?? '.xlsx'}) › Modules › Module1</p>
          {rec && <p className="xs-live">● Merekam… setiap klik dan format kamu ditulis jadi kode di bawah.</p>}
          <pre className="xs-code">{code || allCode || "' Belum ada macro. Klik Record Macro, lakukan beberapa langkah, lalu Stop Recording."}</pre>
          {macros.length > 1 && !rec && <div className="xs-btns">{macros.map((m, i) => <button key={m.name} className="btn sm" aria-pressed={vbe === i} onClick={() => setVbe(i)}>{m.name}</button>)}</div>}
        </aside>
      </div>

      <div className="pf-sheets">
        {sheets.map((s, i) => <button key={s.name} aria-pressed={si === i} onClick={() => { if (rec) push({ k: 'sel', rel: false, rng: selR, dr: 0, dc: 0 }); setSi(i); }}>{s.name}</button>)}
        <span className="xs-status">{rec ? <button className="xs-stop" onClick={stopRec} title="Stop Recording">■</button> : null}{rec ? ' Recording' : 'Ready'}{msg && ' · ' + msg}</span>
      </div>

      {dlg === 'record' && (
        <div className="pf-dlg" role="dialog" aria-label="Record Macro"><div className="pf-dlg-in">
          <p className="pf-dlg-t">Record Macro</p>
          <label className="pf-field">Macro name: <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
          <label className="pf-field">Shortcut key: Ctrl+Shift+ <input maxLength={1} style={{ maxWidth: 40 }} value={form.key} onChange={e => setForm({ ...form, key: e.target.value.replace(/[^a-z]/gi, '') })} /></label>
          <label className="pf-field">Store macro in: <select value={form.store} onChange={e => setForm({ ...form, store: e.target.value })}><option>This Workbook</option><option>Personal Macro Workbook</option><option>New Workbook</option></select></label>
          <label className="pf-field">Description: <input value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} /></label>
          <p className="pf-m-tip">Nama tanpa spasi. <b>Personal Macro Workbook</b> (PERSONAL.XLSB) membuat macro bisa dipakai di semua file. Hindari shortcut Ctrl+huruf biasa karena menimpa shortcut bawaan (Ctrl+C, Ctrl+S…); pakai Ctrl+Shift.</p>
          <div className="pf-dlg-b"><button className="btn sm primary" onClick={startRec}>OK</button><button className="btn sm" onClick={() => setDlg(null)}>Cancel</button></div>
        </div></div>
      )}
      {dlg === 'macros' && <MacrosDlg macros={macros} onClose={() => setDlg(null)} onRun={m => { setDlg(null); run(m); }} onEdit={i => { setVbe(i); setDlg(null); }} onDelete={n => setMacros(ms => ms.filter(x => x.name !== n))} />}
      {dlg === 'save' && <SaveDlg onClose={() => setDlg(null)} hasMacro={macros.length > 0} onSave={ext => { setSaved(ext); setDlg(null); setMsg(ext === '.xlsm' ? 'Tersimpan sebagai Laporan.xlsm' : 'Tersimpan sebagai Laporan.xlsx, macro dibuang'); if (ext === '.xlsm' && macros.length) mark('r6'); if (ext === '.xlsx') setMacros([]); }} />}

      <div className="pf-missions">
        <p className="pf-m-h">Misi latihan <span>{done.size}/{MISSIONS.length}</span></p>
        <ol>{MISSIONS.map(m => <li key={m.id} className={done.has(m.id) ? 'ok' : ''}><span className="pf-m-c" aria-hidden="true">{done.has(m.id) ? '✓' : ''}</span><span dangerouslySetInnerHTML={{ __html: m.text }} /></li>)}</ol>
        <p className="pf-m-tip">Perhatikan: macro absolut yang merekam <code>Range("A1:D6")</code> tidak ikut menjangkau baris baru di sheet Agustus (data lebih panjang). Itu alasan memilih kolom/baris utuh, atau memakai Relative References, atau memperbaiki kodenya di VBE (misalnya <code>Range("A1").CurrentRegion</code>).</p>
      </div>
    </div>
  );
}

function MacrosDlg(p: { macros: Macro[]; onClose: () => void; onRun: (m: Macro) => void; onEdit: (i: number) => void; onDelete: (n: string) => void }) {
  const [i, setI] = useState(0);
  const m = p.macros[i];
  return (
    <div className="pf-dlg" role="dialog" aria-label="Macro"><div className="pf-dlg-in">
      <p className="pf-dlg-t">Macro</p>
      <label className="pf-field">Macro name: <input readOnly value={m?.name ?? ''} /></label>
      <div className="pf-lb xs-lb">{p.macros.length ? p.macros.map((x, j) => <button key={x.name} aria-pressed={i === j} onClick={() => setI(j)}>{x.name}{x.key ? `  (Ctrl+Shift+${x.key.toUpperCase()})` : ''}</button>) : <span className="pf-dlg-s">Belum ada macro.</span>}</div>
      <p className="pf-dlg-s">Macros in: All Open Workbooks{m?.desc ? ' · ' + m.desc : ''}</p>
      <div className="pf-dlg-b">
        <button className="btn sm primary" disabled={!m} onClick={() => m && p.onRun(m)}>Run</button>
        <button className="btn sm" disabled={!m} onClick={() => p.onEdit(i)}>Edit</button>
        <button className="btn sm" disabled={!m} onClick={() => m && p.onDelete(m.name)}>Delete</button>
        <button className="btn sm" onClick={p.onClose}>Cancel</button>
      </div>
    </div></div>
  );
}

function SaveDlg(p: { onClose: () => void; onSave: (ext: string) => void; hasMacro: boolean }) {
  const [ext, setExt] = useState('.xlsx');
  const [warn, setWarn] = useState(false);
  return (
    <div className="pf-dlg" role="dialog" aria-label="Save As"><div className="pf-dlg-in">
      <p className="pf-dlg-t">Save As</p>
      {!warn ? <>
        <label className="pf-field">File name: <input readOnly value={'Laporan' + ext} /></label>
        <label className="pf-field">Save as type: <select value={ext} onChange={e => setExt(e.target.value)}><option value=".xlsx">Excel Workbook (*.xlsx)</option><option value=".xlsm">Excel Macro-Enabled Workbook (*.xlsm)</option><option value=".xlsb">Excel Binary Workbook (*.xlsb)</option></select></label>
        <div className="pf-dlg-b"><button className="btn sm primary" onClick={() => (ext === '.xlsx' && p.hasMacro ? setWarn(true) : p.onSave(ext))}>Save</button><button className="btn sm" onClick={p.onClose}>Cancel</button></div>
      </> : <>
        <p>The following features cannot be saved in macro-free workbooks: <b>VB project</b>.</p>
        <p className="pf-dlg-s">To save a file with these features, click No, and then choose a macro-enabled file type in the File Type list. To continue saving as a macro-free workbook, click Yes.</p>
        <div className="pf-dlg-b"><button className="btn sm" onClick={() => p.onSave('.xlsx')}>Yes</button><button className="btn sm primary" onClick={() => { setWarn(false); setExt('.xlsm'); }}>No</button></div>
      </>}
    </div></div>
  );
}
