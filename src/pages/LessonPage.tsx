import { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BY, LESSONS, SCORED, isFreeItem, modOf, pathFor, type Item } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { fromCase, fromLesson } from '../lib/work';
import { LessonLayout } from '../components/LessonLayout';
import { Workbench } from '../components/Workbench';
import { Quiz } from '../components/Quiz';
import { Preview } from '../components/Preview';
import { Html } from '../components/Html';
import { Paywall } from '../components/Buy';
import NotFound from './NotFound';
import { FN_BY, fnPath, fnsIn } from '../lib/fnhelp';
import { lessonTag } from '../lib/whatsnew';
import { DemoPlayer } from '../components/DemoPlayer';

/** Fungsi Excel yang dipakai di materi/kasus ini, untuk tautan ke halaman fungsi. */
function fnsOf(x: Item): string[] {
  const src = [x.solution || '', ...(x.tasks || []).map((t: Item) => t.solution || ''), x.syntax || ''].join(' ');
  const out = fnsIn(src);
  for (const w of String(x.fns || '').split(/[·,/]/).map((s: string) => s.trim().toUpperCase())) if (FN_BY[w] && !out.includes(w)) out.push(w);
  return out;
}
function FnChips({ x }: { x: Item }) {
  const fs = fnsOf(x);
  if (!fs.length) return null;
  return <p className="fn-chips"><span>Fungsi di sini:</span>{fs.map(f => <Link key={f} to={fnPath(f)} title={FN_BY[f][3]}>{f}</Link>)}</p>;
}

function nextLink(x: Item, seq: Item[]) {
  const n = seq[seq.indexOf(x) + 1];
  return n ? { to: pathFor(n.id), label: 'Lanjut ke ' + n.title } : null;
}

function DownloadWorksheet({ x, kind }: { x: Item; kind: 'lesson' | 'case' }) {
  const [busy, setBusy] = useState(false);
  return (
    <button className="btn ghost dl-ws" disabled={busy} title="Data soal, petunjuk, dan kunci jawaban dalam satu file Excel"
      onClick={async () => { setBusy(true); try { const { downloadWorksheet } = await import('../lib/worksheet'); await downloadWorksheet(x, kind); } finally { setBusy(false); } }}>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {busy ? 'Menyiapkan…' : 'File latihan .xlsx'}
    </button>
  );
}

export default function LessonPage({ kind }: { kind: 'lesson' | 'case' }) {
  const { id = '' } = useParams();
  const x = BY[id];
  const pr = useProgress();
  useEffect(() => { if (x) pr.openItem(x.id); }, [x?.id]);
  useEffect(() => { if (x) document.title = x.title + ' · Jagoan Excel'; }, [x?.id]);
  if (!x || x.kind !== kind) return <NotFound />;

  const locked = !isFreeItem(x) && !pr.isPro;
  const done = pr.p.done.includes(x.id);
  const isCase = x.kind === 'case';
  const seq = isCase ? (Object.values(BY) as Item[]).filter(i => i.kind === 'case') : LESSONS;
  const crumb = isCase
    ? <p className="crumb"><Link to="/kasus">Studi Kasus</Link> › {x.div}</p>
    : <p className="crumb"><Link to="/materi">Materi</Link> › {modOf(x.mod).title}{x.sandbox ? '' : ' › Materi ' + (SCORED.indexOf(x) + 1)}</p>;

  if (x.type === 'read') {
    const firstP = (x.body.match(/<p>[\s\S]*?<\/p>/) || [''])[0];
    return (
      <LessonLayout x={x}>
        <article className="prose">{crumb}<h1>{x.title}{lessonTag(x.id) && <i className="new new-lg">{lessonTag(x.id)}</i>}</h1><FnChips x={x} /><Html html={locked ? firstP : x.body} /></article>
        {locked ? <Paywall what="Materi ini" /> : <>
          {x.preview && (Array.isArray(x.preview) ? x.preview : [x.preview]).map((k: string) => <Preview key={k} k={k} />)}
          <Quiz key={x.id} quiz={x.quiz} saved={pr.p.quiz[x.id] || {}} done={done} next={nextLink(x, seq)}
            onChange={a => pr.setQuiz(x.id, a)} onPass={() => pr.markDone(x.id, 'lesson')} />
        </>}
      </LessonLayout>
    );
  }

  const work = isCase ? fromCase(x) : fromLesson(x);
  return (
    <LessonLayout x={x}>
      <article className="prose">{crumb}<h1>{x.title}{lessonTag(x.id) && <i className="new new-lg">{lessonTag(x.id)}</i>}</h1><FnChips x={x} />
        {isCase ? <div className="scenario"><p>{x.scenario}</p></div> : <Html html={x.intro} />}
        {x.syntax && (
          <div className="syntax">
            <Html className="syntax-code" html={x.syntax.replace(/[&<>]/g, (c: string) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as any)[c]).replace(/\b([A-Z][A-Z.]*)(?=\()/g, '<span class="fn">$1</span>')} />
            <dl>{x.parts.map((p: string[]) => <Fragment key={p[0]}><dt>{p[0]}</dt><dd dangerouslySetInnerHTML={{ __html: p[1] }} /></Fragment>)}</dl>
          </div>
        )}
        {x.note && <Html className="note" html={x.note} />}
      </article>
      {!locked && !isCase && !x.sandbox && x.solution && x.target && (
        <div className="dp-wrap">
          <div className="dp-head"><h2>Tonton demonya</h2><p>Lihat cara mengerjakannya langkah demi langkah, lalu coba sendiri di bawah.</p></div>
          <DemoPlayer key={x.id} x={x} onTry={() => document.querySelector('.task')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
        </div>
      )}
      {locked ? <Paywall what={isCase ? 'Studi kasus ini' : 'Materi ini'} /> : (
        <Workbench key={x.id} item={work} heading={x.sandbox ? 'Lembar kerja' : isCase ? 'Tugas' : 'Praktik'}
          initial={pr.p.answers[x.id] as any} solved={pr.p.tasks[x.id]} done={done} next={nextLink(x, seq)}
          onAnswers={a => pr.setAnswers(x.id, a)}
          onResult={(ok, all) => { if (isCase && ok.length) pr.setTasks(x.id, ok); if (all) pr.markDone(x.id, isCase ? 'case' : 'lesson'); }}
          extraActions={<DownloadWorksheet x={x} kind={kind} />} />
      )}
    </LessonLayout>
  );
}
