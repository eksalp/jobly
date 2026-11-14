import { Fragment, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FUNCS, RIBBON, SHORTCUTS } from '../content/ref.js';
import { ALLFUNCS, ALLCATS } from '../content/allfuncs.js';
import { XL } from '../engine/engine.js';
import { BY, pathFor } from '../lib/catalog';
import { Preview } from '../components/Preview';
import { simIsNew } from '../lib/whatsnew';
import { fnPath } from '../lib/fnhelp';

/** Ubah "Ctrl + Shift + L / Alt + A" menjadi deretan <kbd>. */
export function Keys({ k }: { k: string }) {
  return <>{k.split(' / ').map((x, i) => (
    <Fragment key={i}>{i > 0 && ' / '}{x.split(' + ').map((y, j) => (
      <Fragment key={j}>{j > 0 && ' + '}{/^(Panah|lalu|\()/.test(y) ? y : <kbd>{y.replace('&#96;', '`')}</kbd>}</Fragment>
    ))}</Fragment>
  ))}</>;
}

// Materi terkait: diambil dari daftar fungsi kurikulum (FUNCS) yang punya tautan materi
const LESSON_OF: Record<string, string> = {};
for (const f of FUNCS as any[]) if (f[4]) for (const n of String(f[0]).split(' / ')) LESSON_OF[n.trim()] = f[4];
const CAN = new Set<string>(XL.ALL_FUNCS);

export { LESSON_OF };
export function FunctionsPage() {
  const [sp] = useSearchParams();
  const [cat, setCat] = useState(''); const [q, setQ] = useState(sp.get('q') || ''); const [only, setOnly] = useState(false);
  const s = q.trim().toLowerCase();
  const rows = ALLFUNCS.filter(f => (!cat || f[1] === cat) && (!only || CAN.has(f[0])) && (!s || (f[0] + ' ' + f[1] + ' ' + f[3]).toLowerCase().includes(s)));
  const nCan = ALLFUNCS.filter(f => CAN.has(f[0])).length;
  return (
    <div className="wrap page">
      <div className="page-head"><h1>Semua fungsi Excel</h1><p>{ALLFUNCS.length} fungsi lembar kerja Excel (Microsoft 365) dalam {ALLCATS.length} kategori resmi, lengkap dengan penjelasan argumennya. <b>{nCan}</b> di antaranya bisa langsung dicoba di sini. Argumen dalam kurung siku boleh dilewati.</p></div>
      <div className="filters">
        <input className="search" type="search" placeholder="Cari fungsi, misalnya tanggal, cicilan, atau XLOOKUP" aria-label="Cari fungsi" value={q} onChange={e => setQ(e.target.value)} />
        {['', ...ALLCATS].map(c => <button key={c || 'all'} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c || 'Semua'} <span className="muted">{c ? ALLFUNCS.filter(f => f[1] === c).length : ALLFUNCS.length}</span></button>)}
        <label className="chip-check"><input type="checkbox" checked={only} onChange={e => setOnly(e.target.checked)} /> Hanya yang bisa dicoba</label>
      </div>
      <p className="muted" style={{ fontSize: 13, margin: '0 0 8px' }}>{rows.length} fungsi ditampilkan</p>
      <div className="fnlist">
        {rows.length ? rows.map(f => (
          <div className="fnrow" key={f[0]}><div className="name"><Link to={fnPath(f[0])}>{f[0]}</Link><span className="cat">{f[1]}</span>{CAN.has(f[0]) ? <span className="fn-ok">bisa dicoba</span> : <span className="fn-no">khusus Excel</span>}</div><div className="syn">={f[2]}</div><div className="d">{f[3]}</div>
            <div className="go"><Link to={fnPath(f[0])}>Pelajari →</Link>{LESSON_OF[f[0]] && <Link className="muted" to={pathFor(LESSON_OF[f[0]])}>Materi lengkap</Link>}</div></div>
        )) : <p className="empty-state">Tidak ada fungsi yang cocok dengan "{q}".</p>}
      </div>
    </div>
  );
}

export function ShortcutsPage() {
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const s = q.trim().toLowerCase();
  const total = SHORTCUTS.reduce((n: number, g: any[]) => n + g[1].length, 0);
  const groups = SHORTCUTS.map(([g, rows]: [string, string[][]]) => [g, rows.filter(([k, d]) => !s || (k + ' ' + d + ' ' + g).toLowerCase().includes(s))] as [string, string[][]]).filter(([, r]: [string, string[][]]) => r.length);
  return (
    <div className="wrap page">
      <div className="page-head"><h1>Shortcut Excel</h1><p>{total} shortcut Excel di Windows, dikelompokkan menurut pekerjaan. Di Mac, Ctrl biasanya diganti Cmd. Shortcut seperti "Alt, H, O, I" ditekan satu per satu, bukan bersamaan.</p><Link className="btn primary" to="/shortcut/latihan">Latihan shortcut 60 detik →</Link></div>
      <div className="filters"><input className="search" type="search" placeholder="Cari, misalnya filter, pivot, atau macro" aria-label="Cari shortcut" value={q} onChange={e => setQ(e.target.value)} /></div>
      <div className="sc-grid">
        {groups.length ? groups.map(([g, rows]: [string, string[][]]) => (
          <section key={g}><h2>{g}</h2><table className="sc-table"><tbody>{rows.map(([k, d]) => <tr key={k}><td><Keys k={k} /></td><td>{d}</td></tr>)}</tbody></table></section>
        )) : <p className="empty-state">Tidak ada shortcut yang cocok dengan "{q}".</p>}
      </div>
    </div>
  );
}

/** Posisi perintah ribbon berdasarkan nama persis (dipakai tautan dari pencarian global). */
function findCmd(name: string): [number, number, number] | null {
  for (let t = 0; t < RIBBON.length; t++) for (let g = 0; g < RIBBON[t][1].length; g++) {
    const c = RIBBON[t][1][g][1].findIndex((x: any[]) => x[0] === name); if (c >= 0) return [t, g, c];
  }
  return null;
}
export function RibbonPage() {
  const [sp] = useSearchParams();
  const start = findCmd(sp.get('q') || '');
  const [tab, setTab] = useState(start ? start[0] : 1);
  const [cmd, setCmd] = useState<[number, number, number]>(start || [1, 4, 0]);
  const [q, setQ] = useState('');
  const total = RIBBON.reduce((s: number, [, g]: any) => s + g.reduce((a: number, [, c]: any) => a + c.length, 0), 0);
  const withPv = RIBBON.reduce((s: number, [, g]: any) => s + g.reduce((a: number, [, c]: any) => a + c.filter((z: any[]) => z[3]).length, 0), 0);
  const nCtx = RIBBON.filter((t: any) => t[2]).length;
  const [, groups, note] = RIBBON[tab];
  const sel = cmd[0] === tab ? cmd : [tab, 0, 0];
  const [tName, gs] = RIBBON[sel[0]]; const [gName, cmds] = gs[sel[1]]; const c = cmds[sel[2]];
  const L = c[4] && BY[c[4]];
  const qs = q.trim().toLowerCase();
  const hits: [number, number, number][] = [];
  if (qs) RIBBON.forEach(([, g]: any, ti: number) => g.forEach(([gn, cs]: any, gi: number) => cs.forEach((x: any[], ci: number) => {
    if ((x[0] + ' ' + x[1] + ' ' + gn + ' ' + (x[2] ?? '')).toLowerCase().includes(qs)) hits.push([ti, gi, ci]);
  })));
  const pick = (h: [number, number, number]) => { setTab(h[0]); setCmd(h); setQ(''); setTimeout(() => document.querySelector('.rb-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); };
  return (
    <div className="wrap page">
      <div className="page-head"><h1>Fitur dan menu Excel</h1><p>Semua menu Excel, tab demi tab. Klik perintah untuk melihat gunanya dan shortcut-nya. Yang ada titik hijaunya bisa langsung dicoba ({withPv} dari {total} perintah).</p></div>
      <div className="rb-search">
        <input type="search" placeholder="Cari perintah, misalnya goal seek, freeze, slicer, Ctrl + T…" value={q} onChange={e => setQ(e.target.value)} aria-label="Cari perintah ribbon" />
        {qs && <div className="rb-hits" role="listbox">{hits.length ? hits.slice(0, 40).map(h => { const [tn, g] = RIBBON[h[0]]; const [gn, cs] = g[h[1]]; const x = cs[h[2]]; return (
          <button key={h.join('-')} type="button" role="option" aria-selected={false} onClick={() => pick(h)}><b>{x[0]}</b><span>{tn} › {gn}{x[2] ? ' · ' + x[2] : ''}</span></button>
        ); }) : <p className="muted">Tidak ada perintah yang cocok.</p>}{hits.length > 40 && <p className="muted">dan {hits.length - 40} lainnya…</p>}</div>}
      </div>
      <div className="rb">
        <div className="rb-tabs" role="tablist">{RIBBON.map((t: any, i: number) => <button key={t[0]} type="button" role="tab" className={t[2] ? 'ctx' : ''} aria-selected={i === tab} onClick={() => { setTab(i); setCmd([i, 0, 0]); }}>{t[0]}</button>)}</div>
        {note && <p className="rb-note">{note}</p>}
        <div className="rb-groups">
          {groups.map(([gn, cs]: any, gi: number) => (
            <div className="rb-group" key={gn}><div className="rb-cmds">
              {cs.map((x: any[], ci: number) => (
                <button key={x[0]} type="button" aria-pressed={sel[1] === gi && sel[2] === ci} onClick={() => setCmd([tab, gi, ci])}>
                  {x[0]}{x[3] && <><i className="pvdot" title="Ada pratinjau" /><span className="sr">, ada pratinjau</span></>}{x[3] && simIsNew(x[3]) && <i className="new">baru</i>}
                </button>
              ))}
            </div><span className="rb-gname">{gn}</span></div>
          ))}
        </div>
      </div>
      <div className="rb-detail">
        <div className="rb-info"><p className="crumb">{tName} › {gName}</p><h2>{c[0]}</h2><p>{c[1]}</p>
          <dl>{c[2] && <><dt>Shortcut</dt><dd><Keys k={c[2]} /></dd></>}<dt>Menu</dt><dd>{tName} › {gName}</dd></dl>
          {L && <Link className="btn" to={pathFor(L.id)}>Pelajari di materi: {L.title}</Link>}</div>
        <div>{c[3] ? <Preview key={c[3]} k={c[3]} /> : <p className="muted" style={{ margin: 0 }}>Perintah ini belum bisa dicoba. Pilih yang ada titik hijaunya, misalnya Sort, Filter, atau PivotTable.</p>}</div>
      </div>
    </div>
  );
}
