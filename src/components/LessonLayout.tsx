import { useEffect, useRef, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CASES, INDS, indOf, LESSONS, MODULES, isFreeItem, pathFor, type Item } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { lessonTag } from '../lib/whatsnew';

/** Tata letak halaman materi & studi kasus: daftar isi di kiri, isi di kanan, navigasi sebelum/sesudah. */
export function LessonLayout({ x, children }: { x: Item; children: ReactNode }) {
  const { p, isPro } = useProgress();
  const nav = useNavigate();
  const sideRef = useRef<HTMLElement>(null);
  const isCase = x.kind === 'case';
  const groups: [string, Item[]][] = isCase
    ? INDS.map(d => [d, CASES.filter((c: Item) => indOf(c) === d)])
    : MODULES.map((m: Item) => [m.title, LESSONS.filter((l: Item) => l.mod === m.id)]);
  const seq: Item[] = isCase ? groups.flatMap(g => g[1]) : LESSONS;
  const i = seq.indexOf(x), prev = seq[i - 1], next = seq[i + 1];
  const mark = (l: Item) => (p.done.includes(l.id) ? '✓' : !isFreeItem(l) && !isPro ? '·' : '');

  useEffect(() => { sideRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' }); }, [x.id]);

  return (
    <div className="wrap lesson-layout">
      <aside className="side" aria-label="Daftar isi" ref={sideRef}>
        {groups.map(([g, ls]) => (
          <div className="side-mod" key={g}><p>{g}</p>
            {ls.map(l => <Link key={l.id} to={pathFor(l.id)} aria-current={l.id === x.id ? 'page' : undefined}><span className="ck">{mark(l)}</span>{l.title}{lessonTag(l.id) && <i className="new">{lessonTag(l.id)}</i>}</Link>)}
          </div>
        ))}
      </aside>
      <main className="content">
        <select className="jump" aria-label="Pilih materi" value={x.id} onChange={e => nav(pathFor(e.target.value))}>
          {groups.map(([g, ls]) => <optgroup key={g} label={g}>{ls.map(l => <option key={l.id} value={l.id}>{p.done.includes(l.id) ? '✓ ' : ''}{l.title}</option>)}</optgroup>)}
        </select>
        {children}
        <nav className="pager" aria-label="Sebelum dan sesudah">
          {prev && <Link to={pathFor(prev.id)}><small>← Sebelumnya</small><span>{prev.title}</span></Link>}
          {next && <Link className="next" to={pathFor(next.id)}><small>Berikutnya →</small><span>{next.title}</span></Link>}
        </nav>
      </main>
    </div>
  );
}
