import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { XL } from '../engine/engine.js';
import { fmtOf, thumbValue } from '../lib/format';
import { isFreeItem, pathFor, type Item } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { LockIcon, TopicIcon } from './Icons';
import { lessonTag } from '../lib/whatsnew';

const thumbCache: Record<string, any> = {};

/** Potongan lembar kerja asli dari materi/kasus, dengan sel jawaban dihitung dari kunci jawaban. */
export function SheetThumb({ x }: { x: Item }) {
  const t = x.kind === 'case' ? x.tasks[0] : x.sandbox ? null : { target: x.target, solution: x.solution };
  const model = useMemo(() => {
    if (thumbCache[x.id]) return thumbCache[x.id];
    const cells: Record<string, any> = { ...x.data }; if (t) cells[t.target] = t.solution;
    const sh = XL.makeSheet(cells);
    const tp = t ? XL.splitRef(t.target) : { c: 1, r: 3 };
    const nc = Math.min(3, x.cols), c0 = Math.max(0, Math.min(tp.c - nc + 1, x.cols - nc));
    const cs = Array.from({ length: nc }, (_, i) => c0 + i);
    const rows = tp.r <= 4 ? [1, 2, 3, 4].filter(r => r <= x.rows) : [1, tp.r - 2, tp.r - 1, tp.r];
    const sz = t ? sh.anchorSize(t.target) : null;
    const grid = rows.map(r => cs.map(c => {
      const k = XL.colName(c) + r, v = sh.value(k), q = XL.splitRef(k);
      const spill = sz && q.r >= tp.r && q.r < tp.r + sz[0] && q.c >= tp.c && q.c < tp.c + sz[1];
      return { k, r, txt: thumbValue(v, fmtOf(x.fmt, k)), num: typeof v === 'number', tg: !!t && k === t.target, sp: !!spill };
    }));
    return (thumbCache[x.id] = { cs, rows, grid });
  }, [x.id]);
  return (
    <>
      <div className="th-fx"><i>fx</i><span>{t ? t.solution : 'Semua sel bisa diisi'}</span></div>
      <table className="th-grid">
        <thead><tr><th />{model.cs.map((c: number) => <th key={c}>{XL.colName(c)}</th>)}</tr></thead>
        <tbody>{model.grid.map((row: any[], i: number) => (
          <tr key={i}><th>{model.rows[i]}</th>{row.map(c => (
            <td key={c.k} className={[c.tg ? 'tg' : c.sp ? 'sp' : '', c.r === 1 ? 'h' : '', c.num ? 'n' : ''].filter(Boolean).join(' ')}>{c.txt}</td>
          ))}</tr>
        ))}</tbody>
      </table>
    </>
  );
}

export function ItemCard({ x, num }: { x: Item; num?: string }) {
  const { p, isPro } = useProgress();
  const done = p.done.includes(x.id), locked = !isFreeItem(x) && !isPro, read = x.type === 'read';
  const kind = x.kind === 'case' ? (x.ind ? x.ind + ' · ' + x.div : x.div) : x.sandbox ? 'Latihan bebas' : read ? 'Baca + kuis' : 'Praktik rumus';
  const fns = x.kind === 'case'
    ? [...new Set<string>(x.tasks.flatMap((t: any) => (t.use || []).map((u: string) => u.split('|')[0])))].slice(0, 3).join(' · ') || 'Rumus dasar'
    : x.fns;
  return (
    <Link className={'lcard' + (done ? ' is-done' : '')} to={pathFor(x.id)}>
      {read ? <div className="lc-vis lc-icon"><TopicIcon lesson={x} /></div> : <div className="lc-vis lc-sheet" aria-hidden="true"><SheetThumb x={x} /></div>}
      <div className="lc-body">
        <p className="lc-meta">{num && <span className="lc-num">{num}</span>}{x.khusus && <span className="lc-khusus" title="Kasus khusus: data berantakan atau situasi tidak biasa">Khusus</span>}{x.proyek && <span className="lc-proyek">Proyek {x.step}/3</span>}{x.hard && <span className="lc-sulit" title="Kasus sulit: keuangan, akuntansi, pajak, atau audit tingkat lanjut">Sulit</span>}<span className="lc-kind" title={typeof kind === 'string' ? kind : undefined}>{kind}</span>{lessonTag(x.id) && <i className="new">{lessonTag(x.id)}</i>}</p>
        <h3>{x.title}</h3>
        <p className="lc-fns">{fns}</p>
      </div>
      <div className="lc-foot">
        <span>{x.kind === 'case' ? x.tasks.length + ' tugas' : ''}</span>
        {done ? <span className="lc-st done">✓ Selesai</span> : locked ? <span className="lc-st lock"><LockIcon /> Pro</span> : null}
      </div>
    </Link>
  );
}
