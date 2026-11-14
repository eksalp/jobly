// Simulasi Insert › Chart: memilih rentang data, jenis grafik (Column, Stacked, Line, Bar, Pie, Combo),
// Chart Elements (judul, judul sumbu, data label, legend, gridlines), Switch Row/Column, sumbu kedua.
import { useState } from 'react';
import { L, Missions, useMissions, type Mission } from './kit';

type CType = 'col' | 'stack' | 'line' | 'bar' | 'pie' | 'combo';
type Series = { name: string; vals: number[]; pct: boolean; kind: 'col' | 'line'; sec: boolean };
type Chart = { type: CType; cats: string[]; series: Series[]; title: string; axis: string; labels: boolean; legend: 'none' | 'right' | 'bottom' | 'top'; grid: boolean; switched: boolean; src: number[] };

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const OMZET = [420, 465, 438, 512, 560, 598, 575, 610, 642, 688, 701, 754];
const BIAYA = [310, 330, 325, 360, 385, 402, 398, 410, 428, 455, 462, 490];
const MARGIN = OMZET.map((o, i) => Math.round((o - BIAYA[i]) / o * 1000) / 1000);
const CH = ['Shopee', 'Tokopedia', 'TikTok Shop', 'Website'], PORSI = [42, 22, 24, 12];
// kolom sheet: A Bulan, B Omzet, C Biaya, D Margin, E (kosong), F Channel, G Porsi
const HEAD = ['Bulan', 'Omzet (juta)', 'Biaya (juta)', 'Margin', '', 'Channel', 'Porsi (%)'];
const TEXTC = [0, 5], T1 = [0, 1, 2, 3], T2 = [5, 6];
const colVals = (c: number): (string | number)[] => c === 0 ? MON : c === 1 ? OMZET : c === 2 ? BIAYA : c === 3 ? MARGIN : c === 5 ? CH : c === 6 ? PORSI : [];

const MISSIONS: Mission[] = [
  { id: 'g1', text: 'Pilih kolom <b>A</b> dan <b>B</b>, lalu Insert › <b>Column</b>: omzet per bulan.' },
  { id: 'g2', text: 'Ganti <b>Chart Title</b> menjadi judul yang menjelaskan isi, misalnya "Omzet 2026 terus naik".' },
  { id: 'g3', text: 'Tren dua angka: pilih A, B, dan C, lalu Insert › <b>Line</b>.' },
  { id: 'g4', text: 'Omzet dan margin beda satuan: pilih A, B, D, lalu Insert › <b>Combo</b> (Margin jadi garis di sumbu kedua).' },
  { id: 'g5', text: 'Komposisi: pilih kolom <b>F</b> dan <b>G</b>, lalu Insert › <b>Pie</b>.' },
  { id: 'g6', text: 'Chart Elements: nyalakan <b>Data Labels</b> dan pindahkan <b>Legend</b> ke bawah.' },
];

function nice(max: number) { if (max <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(max))); const m = max / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
const fmtV = (v: number, pct: boolean) => pct ? (v * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + '%' : v.toLocaleString('id-ID');

function ChartSvg({ ch }: { ch: Chart }) {
  const W = 620, H = 340;
  const lgH = ch.legend === 'top' || ch.legend === 'bottom' ? 26 : 0, lgW = ch.legend === 'right' ? 120 : 0;
  const hasSec = ch.series.some(s => s.sec) && ch.type === 'combo';
  const top = 40 + (ch.legend === 'top' ? lgH : 0), bottom = H - 34 - (ch.legend === 'bottom' ? lgH : 0);
  const left = 64 + (ch.axis ? 16 : 0), right = W - 16 - lgW - (hasSec ? 44 : 0);
  const pw = right - left, ph = bottom - top, n = ch.cats.length;
  const color = (i: number) => `var(--s${i % 6})`;
  const legend = ch.legend !== 'none' && ch.type !== 'pie' ? ch.series.map((s, i) => ({ name: s.name, c: color(i), line: ch.type === 'line' || s.kind === 'line' && ch.type === 'combo' })) : ch.type === 'pie' && ch.legend !== 'none' ? ch.cats.map((c, i) => ({ name: c, c: color(i), line: false })) : [];
  const legendEl = legend.length ? (ch.legend === 'right'
    ? <g>{legend.map((l, i) => <g key={i} transform={`translate(${W - lgW - 4},${top + 10 + i * 20})`}>{l.line ? <line x1="0" x2="14" y1="6" y2="6" stroke={l.c} strokeWidth="3" /> : <rect width="12" height="12" fill={l.c} />}<text x="18" y="10" className="ax l">{l.name.slice(0, 16)}</text></g>)}</g>
    : <g transform={`translate(${left},${ch.legend === 'top' ? 42 : H - 18})`}>{legend.map((l, i) => <g key={i} transform={`translate(${i * 120},-8)`}>{l.line ? <line x1="0" x2="14" y1="6" y2="6" stroke={l.c} strokeWidth="3" /> : <rect width="12" height="12" fill={l.c} />}<text x="18" y="10" className="ax l">{l.name.slice(0, 16)}</text></g>)}</g>) : null;
  const title = ch.title ? <text x={W / 2} y="24" textAnchor="middle" className="ds-ctitle">{ch.title}</text> : null;

  if (ch.type === 'pie') {
    const s = ch.series[0], tot = s.vals.reduce((a, b) => a + b, 0) || 1; let a0 = -Math.PI / 2;
    const cx = (left + right) / 2, cy = (top + bottom) / 2 + 6, r = Math.min(pw, ph) / 2 - 6;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="pv-svg ds-chart" role="img" aria-label={'Grafik pie ' + ch.title}>
        {title}
        {s.vals.map((v, i) => { const a1 = a0 + v / tot * 2 * Math.PI, mid = (a0 + a1) / 2; const d = `M${cx},${cy} L${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} Z`; a0 = a1;
          return <g key={i}><path d={d} fill={color(i)} />{ch.labels && <text x={cx + r * .62 * Math.cos(mid)} y={cy + r * .62 * Math.sin(mid) + 4} textAnchor="middle" className="ds-lbl on">{Math.round(v / tot * 100)}%</text>}</g>; })}
        {legendEl}
      </svg>);
  }
  const prim = ch.series.filter(s => !(hasSec && s.sec));
  const sec = hasSec ? ch.series.filter(s => s.sec) : [];
  const stackMax = ch.type === 'stack' ? Math.max(...ch.cats.map((_, i) => prim.reduce((a, s) => a + s.vals[i], 0))) : 0;
  const pMax = nice(Math.max(1e-9, stackMax || Math.max(...prim.flatMap(s => s.vals)))), sMax = sec.length ? nice(Math.max(...sec.flatMap(s => s.vals))) : 1;
  const pct = prim.every(s => s.pct);
  const ticks = [0, .25, .5, .75, 1];
  if (ch.type === 'bar') {
    const bh = ph / n, x = (v: number) => left + v / pMax * pw, k = prim.length;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="pv-svg ds-chart" role="img" aria-label={'Grafik bar ' + ch.title}>
        {title}
        {ticks.map(t => <g key={t}>{ch.grid && <line x1={x(t * pMax)} x2={x(t * pMax)} y1={top} y2={bottom} className="grid" />}<text x={x(t * pMax)} y={bottom + 16} textAnchor="middle" className="ax">{fmtV(t * pMax, pct)}</text></g>)}
        {ch.cats.map((c, i) => <g key={i}><text x={left - 6} y={top + i * bh + bh / 2 + 4} textAnchor="end" className="ax">{c}</text>
          {prim.map((s, j) => { const y = top + i * bh + bh * .15 + j * (bh * .7 / k); return <g key={j}><rect x={left} y={y} width={Math.max(0, x(s.vals[i]) - left)} height={bh * .7 / k} fill={color(j)} />{ch.labels && <text x={x(s.vals[i]) + 3} y={y + bh * .35 / k + 4} className="ds-lbl">{fmtV(s.vals[i], s.pct)}</text>}</g>; })}</g>)}
        {legendEl}
      </svg>);
  }
  const bw = pw / n, y = (v: number) => bottom - v / pMax * ph, y2 = (v: number) => bottom - v / sMax * ph;
  const cols = ch.type === 'col' || ch.type === 'stack' ? prim : ch.type === 'combo' ? ch.series.filter(s => s.kind === 'col') : [];
  const lines = ch.type === 'line' ? prim : ch.type === 'combo' ? ch.series.filter(s => s.kind === 'line') : [];
  const idx = (s: Series) => ch.series.indexOf(s);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="pv-svg ds-chart" role="img" aria-label={'Grafik ' + ch.type + ' ' + ch.title}>
      {title}
      {ticks.map(t => <g key={t}>{ch.grid && <line x1={left} x2={right} y1={y(t * pMax)} y2={y(t * pMax)} className="grid" />}<text x={left - 6} y={y(t * pMax) + 4} textAnchor="end" className="ax">{fmtV(t * pMax, pct)}</text>
        {hasSec && <text x={right + 6} y={y2(t * sMax) + 4} className="ax">{fmtV(t * sMax, sec.every(s => s.pct))}</text>}</g>)}
      {ch.axis && <text x="14" y={(top + bottom) / 2} className="ax l" transform={`rotate(-90 14 ${(top + bottom) / 2})`} textAnchor="middle">{ch.axis}</text>}
      {ch.cats.map((c, i) => <text key={i} x={left + bw * i + bw / 2} y={bottom + 16} textAnchor="middle" className="ax">{c.slice(0, 10)}</text>)}
      {ch.cats.map((_, i) => {
        let acc = 0; const k = ch.type === 'stack' ? 1 : cols.length;
        return <g key={i}>{cols.map((s, j) => {
          const v = s.vals[i], yy = ch.type === 'stack' ? y(acc + v) : (s.sec && hasSec ? y2(v) : y(v)), hh = ch.type === 'stack' ? y(acc) - y(acc + v) : bottom - yy;
          const x = left + bw * i + bw * .15 + (ch.type === 'stack' ? 0 : j * (bw * .7 / k)); acc += v;
          return <g key={j}><rect x={x} y={yy} width={bw * .7 / k} height={Math.max(0, hh)} fill={color(idx(s))} />{ch.labels && bw * .7 / k >= 24 && hh > 16 && <text x={x + bw * .35 / k} y={yy + 13} textAnchor="middle" className="ds-lbl on">{fmtV(v, s.pct)}</text>}</g>;
        })}</g>;
      })}
      {lines.map(s => { const yf = s.sec && hasSec ? y2 : y; const pts = s.vals.map((v, i) => `${left + bw * i + bw / 2},${yf(v)}`).join(' ');
        return <g key={s.name}><polyline points={pts} fill="none" stroke={color(idx(s))} strokeWidth="2.5" />{s.vals.map((v, i) => <g key={i}><circle cx={left + bw * i + bw / 2} cy={yf(v)} r="3" fill="var(--surface)" stroke={color(idx(s))} strokeWidth="2" />{ch.labels && <text x={left + bw * i + bw / 2} y={yf(v) - 7} textAnchor="middle" className="ds-lbl">{fmtV(v, s.pct)}</text>}</g>)}</g>; })}
      {legendEl}
    </svg>);
}

export function ChartSim() {
  const [sel, setSel] = useState<number[]>([]);
  const [ch, setCh] = useState<Chart | null>(null);
  const [warn, setWarn] = useState('');
  const { done, mark } = useMissions();

  const toggle = (c: number) => {
    if (c === 4) return;
    setSel(s => { const same = T1.includes(c) ? T1 : T2; const base = s.filter(x => same.includes(x)); return base.includes(c) ? base.filter(x => x !== c) : [...base, c].sort((a, b) => a - b); });
  };
  const build = (type: CType, cols: number[], prev?: Chart): Chart | null => {
    const catC = cols.find(c => TEXTC.includes(c)), nums = cols.filter(c => !TEXTC.includes(c));
    if (!nums.length) { setWarn('Pilih minimal satu kolom angka.'); return null; }
    setWarn('');
    const len = colVals(nums[0]).length;
    const cats = catC !== undefined ? colVals(catC).map(String) : Array.from({ length: len }, (_, i) => String(i + 1));
    let series: Series[] = nums.map((c, i) => ({ name: HEAD[c], vals: colVals(c) as number[], pct: c === 3, kind: type === 'combo' && i === nums.length - 1 && nums.length > 1 ? 'line' : 'col', sec: type === 'combo' && i === nums.length - 1 && nums.length > 1 }));
    if (type === 'pie' && series.length > 1) series = series.slice(0, 1);
    const custom = prev && prev.title && prev.title !== 'Chart Title' && !HEAD.includes(prev.title);
    const title = custom ? prev!.title : series.length === 1 ? series[0].name : 'Chart Title';
    return { type, cats, series, title, axis: prev?.axis ?? '', labels: prev?.labels ?? false, legend: prev?.legend ?? (series.length > 1 || type === 'pie' ? 'bottom' : 'none'), grid: prev?.grid ?? true, switched: false, src: cols };
  };
  const check = (c: Chart) => {
    const names = c.series.map(s => s.name);
    if (c.type === 'col' && names.length === 1 && names[0] === HEAD[1] && c.cats[0] === 'Jan') mark('g1');
    if (/omzet/i.test(c.title) && c.title.trim() !== HEAD[1]) mark('g2');
    if (c.type === 'line' && names.length === 2 && names.includes(HEAD[1]) && names.includes(HEAD[2])) mark('g3');
    if (c.type === 'combo' && c.series.some(s => s.name === HEAD[1] && s.kind === 'col' && !s.sec) && c.series.some(s => s.name === HEAD[3] && s.kind === 'line' && s.sec)) mark('g4');
    if (c.type === 'pie' && names[0] === HEAD[6] && c.cats[0] === 'Shopee') mark('g5');
    if (c.labels && c.legend === 'bottom') mark('g6');
  };
  const upd = (p: Partial<Chart>) => { if (!ch) return; const n = { ...ch, ...p }; setCh(n); check(n); };
  const insert = (t: CType) => { if (!sel.length) { setWarn('Pilih dulu data: klik huruf kolom (bisa lebih dari satu).'); return; } const c = build(t, sel, ch ?? undefined); if (c) { setCh(c); check(c); } };
  const changeType = (t: CType) => { if (!ch) return; const c = build(t, ch.src, ch); if (c) { setCh(c); check(c); } };
  const switchRC = () => {
    if (!ch || ch.type === 'pie') return;
    const series: Series[] = ch.cats.map((cat, i) => ({ name: cat, vals: ch.series.map(s => s.vals[i]), pct: ch.series.every(s => s.pct), kind: 'col', sec: false }));
    setCh({ ...ch, cats: ch.series.map(s => s.name), series, switched: !ch.switched, legend: ch.legend === 'none' ? 'right' : ch.legend });
  };
  const ref = sel.length ? sel.map(c => `${L(c)}1:${L(c)}${colVals(c).length + 1}`).join(',') : 'A1';
  const note = !ch ? '' : ch.type === 'pie' && ch.cats.length > 6 ? 'Pie dengan lebih dari 6 irisan sulit dibaca. Untuk perbandingan antarbulan, Column atau Line lebih tepat.'
    : ch.type === 'pie' && ch.src.filter(c => !TEXTC.includes(c)).length > 1 ? 'Pie hanya memakai seri pertama. Seri lain diabaikan.'
    : ch.series.some(s => s.pct) && ch.series.some(s => !s.pct) && ch.type !== 'combo' ? 'Margin (%) dan omzet (juta) memakai satu sumbu, jadi garis margin nyaris rata di dasar grafik. Pakai Combo dengan sumbu kedua.'
    : ch.type === 'pie' ? 'Pie cocok untuk komposisi bagian dari keseluruhan, idealnya maksimal 6 irisan.' : '';

  return (
    <div className="pf xs ds">
      <div className="pf-tabs" role="tablist"><button role="tab" aria-selected>Insert</button>{ch && <button role="tab" aria-selected={false}>Chart Design</button>}</div>
      <div className="pf-ribbon">
        {([['col', 'Column'], ['stack', 'Stacked Column'], ['line', 'Line'], ['bar', 'Bar'], ['pie', 'Pie'], ['combo', 'Combo']] as [CType, string][]).map(([t, l]) => <button key={t} className="pf-rb" onClick={() => insert(t)}>{l}</button>)}
        {warn && <span className="ds-warn" role="status">{warn}</span>}
      </div>
      <div className="pf-fx"><span className="pf-nb">{ref.length > 14 ? ref.slice(0, 13) + '…' : ref}</span><i>fx</i><span className="pf-fv2">{sel.length ? `Terpilih: ${sel.map(c => HEAD[c]).join(', ')}` : 'Klik huruf kolom untuk memilih data. Klik lagi untuk membatalkan.'}</span></div>
      <div className="ds-chartwrap">
        <div className="pf-sheet xs-sheet ds-chartdata">
          <table className="pf-grid">
            <thead><tr><th />{HEAD.map((_, i) => <th key={i} className={'ds-colh' + (sel.includes(i) ? ' on' : '')}>{i === 4 ? L(i) : <button type="button" aria-pressed={sel.includes(i)} onClick={() => toggle(i)}>{L(i)}</button>}</th>)}</tr></thead>
            <tbody>
              <tr><th>1</th>{HEAD.map((h, i) => <td key={i} className={'pf-dh' + (sel.includes(i) ? ' xs-sel' : '')}>{h}</td>)}</tr>
              {MON.map((_, r) => <tr key={r}><th>{r + 2}</th>{HEAD.map((_, c) => { const v = colVals(c)[r]; return <td key={c} className={(typeof v === 'number' ? 'n' : '') + (sel.includes(c) && v !== undefined ? ' xs-sel' : '')}>{v === undefined ? '' : typeof v === 'number' ? fmtV(v, c === 3) : v}</td>; })}</tr>)}
            </tbody>
          </table>
        </div>
        <div className="ds-chartbox">
          {ch ? <ChartSvg ch={ch} /> : <p className="ds-empty">Grafik akan muncul di sini.</p>}
          {note && <p className="ds-note">{note}</p>}
        </div>
      </div>
      {ch && (
        <div className="ds-elems" aria-label="Chart Elements">
          <label className="pf-field">Chart Title <input className="pf-in" value={ch.title} onChange={e => upd({ title: e.target.value })} /></label>
          <label className="pf-field">Axis Title (vertikal) <input className="pf-in" value={ch.axis} onChange={e => upd({ axis: e.target.value })} placeholder="juta Rp" /></label>
          <label className="ds-chk"><input type="checkbox" checked={ch.labels} onChange={e => upd({ labels: e.target.checked })} /> Data Labels</label>
          <label className="ds-chk"><input type="checkbox" checked={ch.grid} onChange={e => upd({ grid: e.target.checked })} /> Gridlines</label>
          <label className="pf-field">Legend <select value={ch.legend} onChange={e => upd({ legend: e.target.value as Chart['legend'] })}><option value="none">None</option><option value="right">Right</option><option value="top">Top</option><option value="bottom">Bottom</option></select></label>
          <label className="pf-field">Change Chart Type <select value={ch.type} onChange={e => changeType(e.target.value as CType)}><option value="col">Clustered Column</option><option value="stack">Stacked Column</option><option value="line">Line</option><option value="bar">Bar</option><option value="pie">Pie</option><option value="combo">Combo</option></select></label>
          <button className="btn sm" disabled={ch.type === 'pie'} onClick={switchRC}>Switch Row/Column</button>
          {ch.type === 'combo' && ch.series.map((s, i) => (
            <span key={s.name} className="ds-comboser"><b>{s.name}</b>
              <select aria-label={'Jenis ' + s.name} value={s.kind} onChange={e => upd({ series: ch.series.map((x, j) => j === i ? { ...x, kind: e.target.value as 'col' | 'line' } : x) })}><option value="col">Clustered Column</option><option value="line">Line</option></select>
              <label className="ds-chk"><input type="checkbox" checked={s.sec} onChange={e => upd({ series: ch.series.map((x, j) => j === i ? { ...x, sec: e.target.checked } : x) })} /> Secondary Axis</label>
            </span>))}
          <button className="btn sm ghost" onClick={() => setCh(null)}>Hapus grafik</button>
        </div>
      )}
      <Missions list={MISSIONS} done={done} tip={<>Column untuk membandingkan, Line untuk tren waktu, Bar kalau label kategorinya panjang, Pie hanya untuk komposisi. Judul yang baik menyebut kesimpulannya, bukan sekadar nama data.</>} />
    </div>
  );
}
