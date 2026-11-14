// Simulasi Data › Text to Columns: wizard 3 langkah (Delimited / Fixed width, pemisah, garis potong,
// format kolom General/Text/Date DMY/Do not import, Destination). Pengaturan regional dibuat English (US)
// supaya terlihat kenapa tanggal bisa tertukar dan nol di depan bisa hilang.
import { useState } from 'react';
import { XL } from '../../engine/engine.js';
import { L, Missions, dshow, rp, useMissions, type Mission } from './kit';

type V = string | number;
type Fmt = 'general' | 'text' | 'date' | 'skip';
type SheetK = 'ekspor' | 'bank';
type Cfg = { type: 'delim' | 'fixed'; tab: boolean; semi: boolean; comma: boolean; space: boolean; other: string; consec: boolean; breaks: number[]; fmts: Fmt[]; dest: string };

const EKSPOR = ['Kode;Nama;Divisi;Tgl masuk;Catatan', '0042;Rina Wulandari;Keuangan;03/02/2021;-', '0107;Hendra Saputra;Gudang;15/08/2019;pindahan cabang', '0009;Maya Lestari;Pemasaran;01/11/2023;-', '0215;Dimas Pratama;TI;20/06/2022;kontrak 1 th'];
const BANKROWS: [string, string, string][] = [['05/10/2026', 'TRF MASUK PT PRIMA KEMAS', '4.500.000'], ['05/10/2026', 'BIAYA ADMIN', '15.000'], ['06/10/2026', 'TRF KELUAR CV SUMBER', '2.150.000'], ['07/10/2026', 'SETOR TUNAI', '10.000.000'], ['08/10/2026', 'BUNGA', '41.237']];
const BANK = BANKROWS.map(([d, k, n]) => d + ' ' + k.padEnd(28) + n.padStart(12));
const SRC: Record<SheetK, string[]> = { ekspor: EKSPOR, bank: BANK };
const COLS = 8;

const MISSIONS: Mission[] = [
  { id: 't1', text: 'Sheet <b>Ekspor HR</b>: pilih kolom A › Text to Columns › <b>Delimited</b> › centang <b>Semicolon</b>.' },
  { id: 't2', text: 'Kode pegawai harus tetap <b>0042</b>, bukan 42: di langkah 3 pilih kolom Kode › <b>Text</b>.' },
  { id: 't3', text: 'Tgl masuk tertulis hari/bulan/tahun: pilih kolom itu › <b>Date: DMY</b>. Dengan General, 03/02/2021 terbaca 2 Maret.' },
  { id: 't4', text: 'Kolom Catatan tidak perlu: pilih › <b>Do not import column (skip)</b>.' },
  { id: 't5', text: 'Ubah <b>Destination</b> menjadi <code>$C$1</code> supaya kolom asli tidak tertimpa.' },
  { id: 't6', text: 'Sheet <b>Mutasi bank</b>: pakai <b>Fixed width</b> dan klik penggaris untuk memotong jadi Tanggal | Keterangan | Nominal.' },
];

const defCfg = (k: SheetK): Cfg => ({ type: k === 'bank' ? 'fixed' : 'delim', tab: true, semi: false, comma: false, space: false, other: '', consec: false, breaks: [], fmts: [], dest: '$A$1' });

function split(lines: string[], c: Cfg): string[][] {
  if (c.type === 'fixed') {
    const b = [...c.breaks].sort((x, y) => x - y);
    return lines.map(l => { const out: string[] = []; let p = 0; for (const x of b) { out.push(l.slice(p, x).trim()); p = x; } out.push(l.slice(p).trim()); return out; });
  }
  const ds = [c.tab ? '\t' : '', c.semi ? ';' : '', c.comma ? ',' : '', c.space ? ' ' : '', c.other.slice(0, 1)].filter(Boolean);
  if (!ds.length) return lines.map(l => [l]);
  const re = new RegExp('[' + ds.map(d => d.replace(/[\]\\^-]/g, '\\$&')).join('') + ']' + (c.consec ? '+' : ''));
  return lines.map(l => l.split(re));
}
/** Konversi seperti Excel dengan regional English (US). */
function conv(s: string, f: Fmt): V {
  if (f === 'text') return s;
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (f === 'date') return m && +m[2] <= 12 ? XL.D(+m[3], +m[2], +m[1]) as number : s;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if (m && +m[1] <= 12 && +m[2] <= 31) return XL.D(+m[3], +m[1], +m[2]) as number; // M/D/Y
  return s;
}
const destCol = (d: string) => { const m = /^=?\$?([A-H])\$?1$/i.exec(d.trim()); return m ? m[1].toUpperCase().charCodeAt(0) - 65 : -1; };

export function TextColSim() {
  const [sheet, setSheet] = useState<SheetK>('ekspor');
  const [grids, setGrids] = useState<Record<SheetK, (V | null)[][]>>(() => ({ ekspor: EKSPOR.map(l => [l]), bank: BANK.map(l => [l]) }));
  const [hist, setHist] = useState<{ k: SheetK; g: (V | null)[][] }[]>([]);
  const [colSel, setColSel] = useState(false);
  const [wiz, setWiz] = useState<null | { step: 1 | 2 | 3; cfg: Cfg; pick: number }>(null);
  const [warn, setWarn] = useState('');
  const { done, mark } = useMissions();
  const grid = grids[sheet];

  const open = () => { if (!colSel) { setWarn('Pilih dulu kolom A (klik huruf A).'); return; } setWarn(''); setWiz({ step: 1, cfg: defCfg(sheet), pick: 0 }); };
  const finish = (cfg: Cfg) => {
    const lines = SRC[sheet];
    const parts = split(lines, cfg), n = Math.max(...parts.map(p => p.length));
    const fmts = Array.from({ length: n }, (_, i) => cfg.fmts[i] || 'general');
    const dc = destCol(cfg.dest); if (dc < 0) { setWarn('Destination tidak valid. Contoh: $C$1'); return; }
    const out = grid.map(r => [...r]);
    parts.forEach((p, ri) => { let c = dc; p.forEach((s, j) => { if (fmts[j] === 'skip') return; if (c < COLS) { while (out[ri].length <= c) out[ri].push(null); out[ri][c] = ri === 0 && sheet === 'ekspor' ? s : conv(s, fmts[j]); } c++; }); });
    setHist(h => [...h, { k: sheet, g: grid }]);
    setGrids(g => ({ ...g, [sheet]: out }));
    setWiz(null);
    if (sheet === 'ekspor' && cfg.type === 'delim' && cfg.semi && n >= 5) {
      mark('t1');
      if (fmts[0] === 'text') mark('t2');
      if (fmts[3] === 'date') mark('t3');
      if (fmts[4] === 'skip') mark('t4');
      if (dc >= 2) mark('t5');
    }
    if (sheet === 'bank' && cfg.type === 'fixed' && n === 3 && parts.every((p, i) => p[0] === BANKROWS[i][0] && p[1] === BANKROWS[i][1] && p[2] === BANKROWS[i][2])) mark('t6');
  };
  const undo = () => { const h = hist[hist.length - 1]; if (!h) return; setGrids(g => ({ ...g, [h.k]: h.g })); setSheet(h.k); setHist(x => x.slice(0, -1)); };

  const show = (v: V | null) => v === null ? '' : typeof v === 'number' ? (v > 30000 && v < 60000 ? dshow(v) : rp(v)) : v;
  const maxLen = Math.max(...SRC[sheet].map(l => l.length));

  return (
    <div className="pf xs ds">
      <div className="pf-tabs" role="tablist"><button role="tab" aria-selected>Data</button></div>
      <div className="pf-ribbon">
        <button className="pf-rb" onClick={open}>Text to Columns… <kbd>Alt+A, E</kbd></button>
        <button className="pf-rb" disabled={!hist.length} onClick={undo}>↶ Undo <kbd>Ctrl+Z</kbd></button>
        {warn && <span className="ds-warn" role="status">{warn}</span>}
      </div>
      <div className="pf-fx"><span className="pf-nb">{colSel ? `A1:A${grid.length}` : 'A1'}</span><i>fx</i><span className="pf-fv2 ds-mono">{typeof grid[0][0] === 'string' ? grid[0][0] : ''}</span></div>
      <div className="pf-sheet xs-sheet">
        <table className="pf-grid ds-tc">
          <thead><tr><th />{Array.from({ length: COLS }, (_, i) => <th key={i} className={'ds-colh' + (colSel && i === 0 ? ' on' : '')}>{i === 0 ? <button type="button" onClick={() => setColSel(true)}>A</button> : L(i)}</th>)}</tr></thead>
          <tbody>
            {grid.map((r, i) => (
              <tr key={i}><th>{i + 1}</th>{Array.from({ length: COLS }, (_, j) => { const v = r[j] ?? null; return <td key={j} className={(typeof v === 'number' ? 'n' : '') + (colSel && j === 0 ? ' xs-sel' : '') + (sheet === 'bank' && j === 0 && r.length === 1 ? ' ds-mono' : '')}>{show(v)}</td>; })}</tr>))}
          </tbody>
        </table>
      </div>
      <div className="pf-sheets">
        <button aria-pressed={sheet === 'ekspor'} onClick={() => { setSheet('ekspor'); setColSel(false); }}>Ekspor HR</button>
        <button aria-pressed={sheet === 'bank'} onClick={() => { setSheet('bank'); setColSel(false); }}>Mutasi bank</button>
        <span className="xs-status">Regional: English (United States) · angka di kanan = angka, teks di kiri = teks</span>
      </div>

      {wiz && (() => {
        const c = wiz.cfg, set = (p: Partial<Cfg>) => setWiz({ ...wiz, cfg: { ...c, ...p } });
        const parts = split(SRC[sheet], c), n = Math.max(...parts.map(p => p.length));
        const fmtOf = (i: number): Fmt => c.fmts[i] || 'general';
        return (
          <div className="pf-dlg" role="dialog" aria-label={`Convert Text to Columns Wizard - Step ${wiz.step} of 3`}>
            <div className="pf-dlg-in ds-wide">
              <p className="pf-dlg-t">Convert Text to Columns Wizard · Step {wiz.step} of 3</p>
              {wiz.step === 1 && <>
                <p className="pf-dlg-s">Choose the file type that best describes your data:</p>
                <label className="pf-radio"><input type="radio" checked={c.type === 'delim'} onChange={() => set({ type: 'delim' })} /> <b>Delimited</b> — dipisah karakter seperti koma, titik koma, atau tab</label>
                <label className="pf-radio"><input type="radio" checked={c.type === 'fixed'} onChange={() => set({ type: 'fixed' })} /> <b>Fixed width</b> — kolom rata dengan spasi di antaranya</label>
                <pre className="ds-pre">{SRC[sheet].join('\n')}</pre>
              </>}
              {wiz.step === 2 && c.type === 'delim' && <>
                <p className="pf-dlg-s">Delimiters</p>
                <div className="ds-row">
                  {([['tab', 'Tab'], ['semi', 'Semicolon'], ['comma', 'Comma'], ['space', 'Space']] as const).map(([k, l]) => <label key={k} className="ds-chk"><input type="checkbox" checked={c[k]} onChange={e => set({ [k]: e.target.checked } as Partial<Cfg>)} /> {l}</label>)}
                  <label className="ds-chk">Other: <input className="pf-in ds-narrow" maxLength={1} value={c.other} onChange={e => set({ other: e.target.value })} /></label>
                </div>
                <label className="ds-chk"><input type="checkbox" checked={c.consec} onChange={e => set({ consec: e.target.checked })} /> Treat consecutive delimiters as one</label>
                <Preview parts={parts} n={n} />
              </>}
              {wiz.step === 2 && c.type === 'fixed' && <>
                <p className="pf-dlg-s">Klik penggaris untuk membuat garis potong. Klik lagi garis yang sama untuk menghapusnya.</p>
                <div className="ds-ruler" style={{ gridTemplateColumns: `repeat(${maxLen}, 1ch)` }}>
                  {Array.from({ length: maxLen }, (_, i) => i + 1).map(p => <button key={p} type="button" aria-label={`Garis potong di posisi ${p}`} aria-pressed={c.breaks.includes(p)} onClick={() => set({ breaks: c.breaks.includes(p) ? c.breaks.filter(x => x !== p) : [...c.breaks, p] })}>{p % 10 === 0 ? p / 10 : '·'}</button>)}
                </div>
                <pre className="ds-pre">{SRC[sheet].map(l => { let s = '', last = 0; for (const b of [...c.breaks].sort((x, y) => x - y)) { s += l.slice(last, b) + '│'; last = b; } return s + l.slice(last); }).join('\n')}</pre>
                <p className="ds-note">{c.breaks.length} garis potong · menghasilkan {n} kolom</p>
              </>}
              {wiz.step === 3 && <>
                <p className="pf-dlg-s">Pilih kolom di pratinjau, lalu tentukan formatnya.</p>
                <div className="ds-row">
                  {([['general', 'General'], ['text', 'Text'], ['date', 'Date: DMY'], ['skip', 'Do not import column (skip)']] as const).map(([k, l]) => <label key={k} className="pf-radio"><input type="radio" checked={fmtOf(wiz.pick) === k} onChange={() => { const f = [...c.fmts]; f[wiz.pick] = k; set({ fmts: f }); }} /> {l}</label>)}
                </div>
                <label className="pf-field">Destination: <input className="pf-in ds-mono ds-narrow2" value={c.dest} onChange={e => set({ dest: e.target.value })} /></label>
                <Preview parts={parts} n={n} fmts={Array.from({ length: n }, (_, i) => fmtOf(i))} pick={wiz.pick} onPick={i => setWiz({ ...wiz, pick: i })} />
              </>}
              <div className="pf-dlg-b">
                <button className="btn sm" onClick={() => setWiz(null)}>Cancel</button>
                <span className="ds-grow" />
                <button className="btn sm" disabled={wiz.step === 1} onClick={() => setWiz({ ...wiz, step: (wiz.step - 1) as 1 | 2 })}>‹ Back</button>
                <button className="btn sm" disabled={wiz.step === 3} onClick={() => setWiz({ ...wiz, step: (wiz.step + 1) as 2 | 3 })}>Next ›</button>
                <button className="btn sm primary" onClick={() => finish(c)}>Finish</button>
              </div>
            </div>
          </div>);
      })()}

      <Missions list={MISSIONS} done={done} tip={<>Text to Columns menimpa kolom di sebelah kanan tanpa bertanya, jadi pastikan kolom tujuan kosong. Kalau datanya sering diperbarui, rumus <code>=TEXTSPLIT(A2,";")</code> atau Power Query lebih praktis karena hasilnya ikut berubah.</>} />
    </div>
  );
}

function Preview({ parts, n, fmts, pick, onPick }: { parts: string[][]; n: number; fmts?: Fmt[]; pick?: number; onPick?: (i: number) => void }) {
  const lab: Record<Fmt, string> = { general: 'General', text: 'Text', date: 'DMY', skip: 'Skip' };
  return (
    <div className="ds-prev pf-sheet">
      <table className="pf-grid">
        <thead><tr>{Array.from({ length: n }, (_, i) => <th key={i} className={pick === i ? 'ds-pick' : ''}>{onPick ? <button type="button" aria-pressed={pick === i} onClick={() => onPick(i)}>{fmts ? lab[fmts[i]] : L(i)}</button> : L(i)}</th>)}</tr></thead>
        <tbody>{parts.map((p, r) => <tr key={r}>{Array.from({ length: n }, (_, i) => <td key={i} className={(pick === i ? 'ds-pick ' : '') + (fmts?.[i] === 'skip' ? 'ds-skip' : '')} onClick={() => onPick?.(i)}>{p[i] ?? ''}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
