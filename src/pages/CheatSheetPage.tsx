import { useMemo, useRef, useState } from 'react';
import { formulaTip } from '../lib/work';
import { XL } from '../engine/engine.js';
import { CHEAT } from '../content/cheatsheet.js';
import { fmtSerial } from '../lib/format';
import { Html } from '../components/Html';

function Value({ v, f }: { v: any; f?: string }) {
  if (v == null || v === '') return <span className="muted">(kosong)</span>;
  if (XL.isErr(v)) return <span className="cs-err">{v.code}</span>;
  if (XL.isArr(v)) {
    const h = v.rows.length, w = v.rows[0].length, flat = v.rows.flat();
    const shown = flat.slice(0, 6).map((x: any) => XL.isErr(x) ? x.code : typeof x === 'number' ? x.toLocaleString('id-ID', { maximumFractionDigits: 2 }) : x === '' ? '·' : String(x));
    return <><span className="cs-arr">{shown.join(' · ')}{flat.length > 6 ? ' …' : ''}</span><small className="muted"> {h} × {w}</small></>;
  }
  if (typeof v === 'boolean') return <>{v ? 'TRUE' : 'FALSE'}</>;
  if (typeof v === 'number') return <>{f === 'date' ? fmtSerial(v) : v.toLocaleString('id-ID', { maximumFractionDigits: Math.abs(v) >= 1000 ? 2 : 4 })}</>;
  return <>{String(v)}</>;
}

export default function CheatSheetPage() {
  const sheet = useMemo(() => XL.makeSheet(CHEAT.data), []);
  const ev = (f: string) => sheet.evalFormula(f.slice(1), true);
  const [formula, setFormula] = useState('=AVERAGEIF(B2:B11,"Bandung",C2:C11)');
  const boxRef = useRef<HTMLElement>(null), inRef = useRef<HTMLInputElement>(null);
  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const total = CHEAT.sections.reduce((s: number, x: any) => s + x.rows.length, 0);
  const nav: [string, string][] = [['ops', 'Operator'], ...CHEAT.sections.map((s: any) => [s.id, s.title.startsWith('Array') ? 'Excel 365' : s.title.replace(' dan ', ' & ')] as [string, string]), ['error', 'Error'], ['tips', 'Tips']];
  const tryIt = (f: string) => { setFormula(f); boxRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }); inRef.current?.focus({ preventScroll: true }); };
  const out = (() => {
    const f = formula.trim();
    if (!f) return <span className="muted">Ketik rumus yang diawali tanda =.</span>;
    if (f[0] !== '=') return <span className="cs-err">Rumus perlu diawali tanda =.</span>;
    const v = ev(f);
    const tip = formulaTip(f);
    return XL.isErr(v) ? <><span className="cs-err">{v.code}</span> {v.msg}</> : <>Hasil: <b><Value v={v} /></b>{tip && <span className="cs-tip">{tip}</span>}</>;
  })();
  const Row = ({ r }: { r: any[] }) => {
    const skip = r[3] === 'skip';
    return <tr><td className="cs-fn">{r[0]}</td><td><code className="cs-f">{r[1]}</code></td>
      <td className="cs-res">{skip ? <span className="muted">tidak bisa dicoba di sini</span> : <Value v={ev(r[1])} f={r[3]} />}</td>
      <td>{r[2]}</td><td>{!skip && <button className="btn sm ghost" onClick={() => tryIt(r[1])}>Coba</button>}</td></tr>;
  };

  return (
    <div className="wrap page">
      <div className="page-head"><h1>Rumus ringkas</h1>
        <p>{total} rumus yang paling sering dipakai di kantor. Hasilnya dihitung langsung dari data contoh di bawah. Tekan Coba untuk mengutak-atik rumusnya.</p></div>
      <div className="filters cs-nav">{nav.map(([id, l]) => <button key={id} className="chip" onClick={() => document.getElementById('cs-' + id)?.scrollIntoView({ block: 'start', behavior: 'smooth' })}>{l}</button>)}</div>
      <section className="cs-box" ref={boxRef} aria-labelledby="cs-d-h"><h2 id="cs-d-h">Data contoh</h2>
        <div className="pv-scroll"><table className="pv-t cs-data"><thead><tr><th />{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>{Array.from({ length: 11 }, (_, i) => <tr key={i}><th>{i + 1}</th>{cols.map(c => {
            const v = CHEAT.data[c + (i + 1)];
            return <td key={c} className={(typeof v === 'number' ? 'n' : '') + (i === 0 ? ' b' : '')}>{v == null ? '' : c === 'D' && i > 0 ? fmtSerial(v) : typeof v === 'number' ? v.toLocaleString('id-ID') : v}</td>;
          })}</tr>)}</tbody></table></div>
        <div className="cs-try"><label htmlFor="cs-in" className="pv-lab">Coba rumus sendiri pada data contoh</label>
          <div className="fbar cs-bar"><span className="fxl" aria-hidden="true">fx</span><input id="cs-in" ref={inRef} autoComplete="off" spellCheck={false} value={formula} onChange={e => setFormula(e.target.value)} /></div>
          <p className="cs-out" aria-live="polite">{out}</p></div>
      </section>

      <section className="cs-sec" id="cs-ops"><h2>Operator dan simbol</h2><div className="pv-scroll"><table className="cs-t">
        <thead><tr><th>Simbol</th><th>Contoh</th><th>Hasil</th><th>Arti</th><th /></tr></thead>
        <tbody>{CHEAT.ops.map((o: string[]) => <tr key={o[0]}><td className="cs-fn"><code>{o[0]}</code></td><td><code className="cs-f">{o[2]}</code></td><td className="cs-res"><Value v={ev(o[2])} /></td><td>{o[1]}</td><td><button className="btn sm ghost" onClick={() => tryIt(o[2])}>Coba</button></td></tr>)}</tbody>
      </table></div></section>

      {CHEAT.sections.map((s: any) => (
        <section className="cs-sec" id={'cs-' + s.id} key={s.id}><h2>{s.title}</h2>
          {s.note && <p className="note" style={{ margin: '6px 0 10px' }}>{s.note}</p>}
          <div className="pv-scroll"><table className="cs-t"><thead><tr><th>Fungsi</th><th>Contoh</th><th>Hasil</th><th>Kegunaan</th><th /></tr></thead>
            <tbody>{s.rows.map((r: any[]) => <Row key={r[1]} r={r} />)}</tbody></table></div>
        </section>
      ))}

      <section className="cs-sec" id="cs-error"><h2>Kode error dan masalah umum</h2>
        <div className="pv-scroll"><table className="cs-t"><thead><tr><th>Kode</th><th>Artinya</th><th colSpan={3}>Cara memperbaiki</th></tr></thead>
          <tbody>{CHEAT.errors.map((e: string[]) => <tr key={e[0]}><td className="cs-fn"><code>{e[0]}</code></td><td>{e[1]}</td><td colSpan={3}>{e[2]}</td></tr>)}</tbody></table></div>
        <h3>Bukan kode error, tapi sering terjadi</h3>
        <div className="pv-scroll"><table className="cs-t"><thead><tr><th>Masalah</th><th>Tandanya</th><th colSpan={3}>Cara memperbaiki</th></tr></thead>
          <tbody>{CHEAT.issues.map((e: string[]) => <tr key={e[0]}><td className="cs-fn">{e[0]}</td><td>{e[1]}</td><td colSpan={3}>{e[2]}</td></tr>)}</tbody></table></div>
      </section>
      <section className="cs-sec" id="cs-tips"><h2>Tips cepat</h2>
        <div className="cs-tips">{CHEAT.tips.map((t: string[]) => <div key={t[0]}><b>{t[0]}</b><Html as="p" html={t[1]} /></div>)}</div>
      </section>
    </div>
  );
}
