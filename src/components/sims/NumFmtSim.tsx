// Simulasi Format Cells (Ctrl+1) tab Number: General, Number, Currency, Percentage, Date, Text, Custom.
// Kode format dihitung oleh mesin yang sama dengan fungsi TEXT, jadi hasilnya sesuai Excel.
import { useState } from 'react';
import { XL } from '../../engine/engine.js';
import { L, Missions, dser, useMissions, type Mission } from './kit';

type Cat = 'general' | 'number' | 'currency' | 'percent' | 'date' | 'text' | 'custom';
const HEAD = ['Produk', 'Kode', 'Penjualan', 'Margin', 'Tanggal'];
const ROWS: (string | number)[][] = [
  ['Kemeja Linen', 42, 1250000, 0.125, dser(2, 11, 2026)],
  ['Celana Cargo', 7, 980000, 0.3, dser(3, 11, 2026)],
  ['Retur Hoodie', 315, -45000, -0.05, dser(5, 11, 2026)],
  ['Tote Bag', 1208, 0, 0.215, dser(6, 11, 2026)],
];
const START = ['@', 'General', 'General', 'General', 'General'];
const DATE_TYPES = ['dd/mm/yyyy', 'd mmm yyyy', 'dddd, d mmmm yyyy', 'mmmm yyyy', 'dd-mm-yy'];
const NEG = ['-#,##0', '[Red]-#,##0', '(#,##0)', '[Red](#,##0)'];
const CUSTOM_LIST = ['General', '0', '0.00', '#,##0', '#,##0.00', '"Rp"#,##0', '#,##0;[Red](#,##0)', '0%', '0.0%', '0000', '#,##0.0,," jt"', 'dd/mm/yyyy', 'dddd, d mmm yyyy', '@'];

const MISSIONS: Mission[] = [
  { id: 'n1', text: 'Kolom <b>B</b> (Kode) selalu 4 digit: 42 tampil <b>0042</b>. Pakai Custom <code>0000</code>.' },
  { id: 'n2', text: 'Kolom <b>C</b> (Penjualan) tampil seperti <b>Rp1.250.000</b>.' },
  { id: 'n3', text: 'Angka negatif di Penjualan tampil <b>dalam kurung</b> dan <b>merah</b>, seperti di laporan keuangan.' },
  { id: 'n4', text: 'Kolom <b>D</b> (Margin) jadi persen dengan satu desimal: <b>12,5%</b>.' },
  { id: 'n5', text: 'Kolom <b>E</b> (Tanggal) tampil lengkap dengan nama hari, misalnya <b>Senin, 2 November 2026</b>.' },
  { id: 'n6', text: 'Penjualan dalam juta: <b>1,3 jt</b>. Petunjuk: koma di akhir kode membagi seribu.' },
];

const general = (v: string | number) => typeof v === 'number' ? (Number.isInteger(v) ? String(v) : String(v).replace('.', ',')) : v;
function show(v: string | number, code: string) {
  if (code === 'General') return { t: general(v), color: null as string | null };
  return XL.fmtCode(v, code) as { t: string; color: string | null };
}
function codeOf(c: Cat, o: { dec: number; sep: boolean; neg: number; sym: boolean; date: number; custom: string }) {
  const d = o.dec ? '.' + '0'.repeat(o.dec) : '';
  if (c === 'general') return 'General';
  if (c === 'text') return '@';
  if (c === 'percent') return '0' + d + '%';
  if (c === 'date') return DATE_TYPES[o.date];
  if (c === 'custom') return o.custom;
  const base = (c === 'currency' && o.sym ? '"Rp"' : '') + (o.sep || c === 'currency' ? '#,##0' : '0') + d;
  const neg = NEG[o.neg].replace('#,##0', (c === 'currency' && o.sym ? '"Rp"' : '') + (o.sep || c === 'currency' ? '#,##0' : '0') + d);
  return o.neg === 0 ? base : base + ';' + neg;
}

export function NumFmtSim() {
  const [fmts, setFmts] = useState<string[]>(START);
  const [col, setCol] = useState(2);
  const [row, setRow] = useState(0);
  const [dlg, setDlg] = useState<null | { cat: Cat; dec: number; sep: boolean; neg: number; sym: boolean; date: number; custom: string }>(null);
  const { done, mark } = useMissions();

  const open = () => { const cur = fmts[col]; setDlg({ cat: cur === 'General' ? 'general' : 'custom', dec: 0, sep: true, neg: 0, sym: true, date: 2, custom: cur }); };
  const apply = (code: string) => {
    const next = fmts.map((f, i) => (i === col ? code : f)); setFmts(next); setDlg(null);
    const out = (c: number, r: number) => show(ROWS[r][c], next[c]);
    if (out(1, 0).t === '0042' && out(1, 3).t === '1208') mark('n1');
    if (out(2, 0).t === 'Rp1.250.000') mark('n2');
    if (/^\(.*45\.000.*\)$/.test(out(2, 2).t) && out(2, 2).color === 'red') mark('n3');
    if (out(3, 0).t === '12,5%') mark('n4');
    if (/^Senin, 2 November 2026$/.test(out(4, 0).t)) mark('n5');
    if (/^1,3 ?jt$/.test(out(2, 0).t)) mark('n6');
  };
  const v = ROWS[row][col];
  const code = dlg ? codeOf(dlg.cat, dlg) : '';
  const sample = dlg ? show(v, code) : null;
  const okCode = (() => { try { if (code !== 'General') XL.fmtCode(1, code); return true; } catch { return false; } })();

  return (
    <div className="pf xs ds">
      <div className="pf-tabs" role="tablist"><button role="tab" aria-selected>Home</button></div>
      <div className="pf-ribbon">
        <button className="pf-rb" onClick={open}>Format Cells… <kbd>Ctrl+1</kbd></button>
        <button className="pf-rb" onClick={() => apply('General')}>Clear Formats</button>
      </div>
      <div className="pf-fx"><span className="pf-nb">{L(col)}{row + 2}</span><i>fx</i><span className="pf-fv2">{typeof v === 'number' ? general(v) : v}</span><span className="ds-note" style={{ marginLeft: 'auto' }}>Format: <code>{fmts[col]}</code></span></div>
      <div className="pf-sheet xs-sheet">
        <table className="pf-grid">
          <thead><tr><th />{HEAD.map((_, i) => <th key={i} className={'ds-colh' + (col === i ? ' on' : '')}><button type="button" onClick={() => setCol(i)}>{L(i)}</button></th>)}</tr></thead>
          <tbody>
            <tr><th>1</th>{HEAD.map(h => <td key={h} className="pf-dh">{h}</td>)}</tr>
            {ROWS.map((r, ri) => <tr key={ri}><th>{ri + 2}</th>{r.map((x, c) => { const o = show(x, fmts[c]); const isNum = typeof x === 'number' && fmts[c] !== '@';
              return <td key={c} className={(isNum ? 'n' : '') + (col === c ? ' xs-sel' : '') + (col === c && row === ri ? ' act' : '')} style={o.color === 'red' ? { color: '#c00000' } : undefined} onClick={() => { setCol(c); setRow(ri); }}>{o.t}</td>; })}</tr>)}
          </tbody>
        </table>
      </div>
      <div className="pf-sheets"><button aria-pressed>Laporan</button><span className="xs-status">Bar rumus selalu menampilkan nilai asli. Format hanya mengubah tampilan.</span></div>

      {dlg && (
        <div className="pf-dlg" role="dialog" aria-label="Format Cells">
          <div className="pf-dlg-in ds-wide">
            <p className="pf-dlg-t">Format Cells · Number · kolom {L(col)}</p>
            <div className="nf-grid">
              <div className="nf-cats" role="listbox" aria-label="Category">
                {([['general', 'General'], ['number', 'Number'], ['currency', 'Currency'], ['percent', 'Percentage'], ['date', 'Date'], ['text', 'Text'], ['custom', 'Custom']] as [Cat, string][]).map(([k, l]) =>
                  <button key={k} role="option" aria-selected={dlg.cat === k} onClick={() => setDlg({ ...dlg, cat: k, custom: k === 'custom' ? dlg.custom : dlg.custom })}>{l}</button>)}
              </div>
              <div className="ds-form">
                <div className="nf-sample"><span>Sample</span><b style={sample?.color === 'red' ? { color: '#c00000' } : undefined}>{okCode && sample ? sample.t || ' ' : 'Kode tidak valid'}</b></div>
                {(dlg.cat === 'number' || dlg.cat === 'currency' || dlg.cat === 'percent') && <label className="pf-field">Decimal places: <input className="pf-in ds-narrow" type="number" min={0} max={6} value={dlg.dec} onChange={e => setDlg({ ...dlg, dec: Math.max(0, Math.min(6, +e.target.value || 0)) })} /></label>}
                {dlg.cat === 'number' && <label className="ds-chk"><input type="checkbox" checked={dlg.sep} onChange={e => setDlg({ ...dlg, sep: e.target.checked })} /> Use 1000 Separator (.)</label>}
                {dlg.cat === 'currency' && <label className="pf-field">Symbol: <select value={dlg.sym ? 'Rp' : 'none'} onChange={e => setDlg({ ...dlg, sym: e.target.value === 'Rp' })}><option value="Rp">Rp</option><option value="none">None</option></select></label>}
                {(dlg.cat === 'number' || dlg.cat === 'currency') && <div className="nf-neg" role="radiogroup" aria-label="Negative numbers"><span>Negative numbers:</span>{NEG.map((n, i) => <label key={n} className={'pf-radio' + (n.includes('Red') ? ' red' : '')}><input type="radio" checked={dlg.neg === i} onChange={() => setDlg({ ...dlg, neg: i })} /> {XL.fmtCode(-1234, n.replace(/\[Red\]/, '')).t}</label>)}</div>}
                {dlg.cat === 'date' && <div className="nf-neg" role="radiogroup" aria-label="Type">{DATE_TYPES.map((d, i) => <label key={d} className="pf-radio"><input type="radio" checked={dlg.date === i} onChange={() => setDlg({ ...dlg, date: i })} /> {XL.fmtCode(dser(2, 11, 2026), d).t}</label>)}</div>}
                {dlg.cat === 'text' && <p className="ds-note">Isi sel dianggap teks apa adanya, termasuk angka. Berguna untuk NIK atau nomor HP.</p>}
                {dlg.cat === 'general' && <p className="ds-note">Tanpa format khusus. Excel menampilkan angka apa adanya.</p>}
                {dlg.cat === 'custom' && <>
                  <label className="pf-field">Type: <input className="pf-in ds-mono" value={dlg.custom} onChange={e => setDlg({ ...dlg, custom: e.target.value })} /></label>
                  <div className="nf-list">{CUSTOM_LIST.map(c => <button key={c} type="button" aria-pressed={dlg.custom === c} onClick={() => setDlg({ ...dlg, custom: c })}>{c}</button>)}</div>
                </>}
                {dlg.cat !== 'custom' && <p className="ds-note">Kode format: <code>{code}</code></p>}
              </div>
            </div>
            <div className="pf-dlg-b"><span className="ds-grow" /><button className="btn sm primary" disabled={!okCode} onClick={() => apply(code)}>OK</button><button className="btn sm" onClick={() => setDlg(null)}>Cancel</button></div>
          </div>
        </div>
      )}

      <Missions list={MISSIONS} done={done} tip={<>Kode format punya sampai empat bagian dipisah titik koma: <code>positif;negatif;nol;teks</code>. Contoh <code>#,##0;[Red](#,##0);"-"</code> membuat angka nol tampil sebagai strip. Di Excel berbahasa Indonesia, titik dan koma pada kode bisa tertukar mengikuti pengaturan regional.</>} />
    </div>
  );
}
