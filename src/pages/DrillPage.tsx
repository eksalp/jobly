import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DRILL, isFreeItem } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { fromLesson } from '../lib/work';
import { Workbench } from '../components/Workbench';
import { PivotSim, type PivotSnapshot } from '../components/PivotSim';
import { checkPivot, type PivotTarget } from '../lib/pivotcheck';
import { pivotAnswer } from '../lib/pivotanswer';
import { Html } from '../components/Html';
import { Paywall } from '../components/Buy';
import { findDrill } from './BankPage';
import NotFound from './NotFound';

export default function DrillPage() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const pr = useProgress();
  const [note, setNote] = useState<string | null>(null);
  const x = useMemo(() => DRILL.build(id), [id]);
  const lastAns = useRef<Record<string, unknown> | null>(null);
  useEffect(() => { if (x) document.title = `Soal #${x.num} · Jagoan Excel`; setNote(null); }, [id]);
  if (!x) return <NotFound />;

  if (x.pivot) x.hint = x.hint || 'Klik sel di tabel saat mengetik rumus untuk memasukkan alamatnya.';
  const work = fromLesson(x);
  const version = +id.split('-').pop()!;
  const prev = x.num > 1 ? DRILL.at(x.num - 2) : null, next = x.num < DRILL.count ? DRILL.at(x.num) : null;
  let sameT = 0; for (let k = 1; k <= DRILL.seeds; k++) if (pr.p.drill['soal-' + x.tkey + '-' + k]) sameT++;
  const locked = !isFreeItem(x) && !pr.isPro;

  const other = () => {
    const ks: number[] = []; for (let k = 1; k <= DRILL.seeds; k++) if (!pr.p.drill['soal-' + x.tkey + '-' + k] && k !== version) ks.push(k);
    nav('/soal/soal-' + x.tkey + '-' + (ks.length ? ks[Math.floor(Math.random() * ks.length)] : 1 + Math.floor(Math.random() * DRILL.seeds)));
  };
  const random = () => {
    const nid = findDrill(pr.p.drill, pr.isPro, { random: true });
    if (nid) nav('/soal/' + nid); else setNote('Semua soal yang bisa kamu akses sudah selesai.');
  };

  return (
    <div className="wrap page drill">
      <div className="drill-head">
        <p className="crumb"><Link to="/soal">Bank Soal</Link> › {x.level} › {x.topic}</p>
        <div className="drill-title"><h1>Soal #{x.num.toLocaleString('id-ID')}</h1><span className="pill">{x.title}</span></div>
        <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>Versi {version} dari {DRILL.seeds} untuk pola ini · {sameT} versi sudah kamu selesaikan · {Object.keys(pr.p.drill).length.toLocaleString('id-ID')} dari {DRILL.count.toLocaleString('id-ID')} soal total</p>
      </div>
      {locked ? <Paywall what={'Soal tingkat ' + x.level} /> : x.pivot ? (
        <PivotDrill key={id} x={x} done={!!pr.p.drill[id]} onSolved={() => pr.markDone(id, 'drill')}
          next={next ? { to: '/soal/' + next.id, label: 'Lanjut ke Soal #' + next.num } : null} />
      ) : (
        <Workbench key={id} item={work} heading="Soal" done={!!pr.p.drill[id]} initial={pr.p.answers[id] as any}
          next={next ? { to: '/soal/' + next.id, label: 'Lanjut ke Soal #' + next.num } : null}
          onAnswers={a => { lastAns.current = a; }}
          onResult={(_ok, all) => { if (all) { pr.markDone(id, 'drill'); if (lastAns.current) pr.setAnswers(id, lastAns.current); } }} />
      )}
      {note && <p className="muted" role="status">{note}</p>}
      <nav className="drill-nav" aria-label="Navigasi soal">
        {prev ? <Link className="btn ghost" to={'/soal/' + prev.id}>← Soal {prev.num}</Link> : <span />}
        <div className="cta"><button className="btn" onClick={other}>Versi lain pola ini</button><button className="btn" onClick={random}>Soal acak</button></div>
        {next ? <Link className="btn ghost" to={'/soal/' + next.id}>Soal {next.num} →</Link> : <span />}
      </nav>
    </div>
  );
}

/** Soal PivotTable: susun pivot di simulasi, lalu periksa susunannya. */
function PivotDrill({ x, done, onSolved, next }: { x: any; done: boolean; onSolved: () => void; next: { to: string; label: string } | null }) {
  const snap = useRef<PivotSnapshot | null>(null);
  const [fb, setFb] = useState<{ ok: boolean; html: string } | null>(done ? { ok: true, html: '<strong>Soal ini sudah pernah kamu selesaikan.</strong> Coba susun lagi kalau mau berlatih.' } : null);
  const [showHint, setShowHint] = useState(false);
  const t: PivotTarget = x.pivot.target;
  const check = () => {
    const msg = checkPivot(snap.current, t);
    if (msg) setFb({ ok: false, html: msg });
    else { setFb({ ok: true, html: '<strong>Benar.</strong> Susunan PivotTable-mu sudah sesuai permintaan.' }); onSolved(); }
  };
  const answer = pivotAnswer(t);
  return (
    <section className="pv-drill">
      <h2 className="sr">Soal</h2>
      <Html as="p" className="task-text" html={x.task} />
      <div className="preview pf-drill-box"><div className="preview-b pf-wrap">
        <PivotSim mode="drill" data={x.pivot.data} fields={x.pivot.fields} numeric={x.pivot.numeric} sheetName={x.pivot.sheetName} onChange={s => { snap.current = s; }} />
      </div></div>
      <div className="wb-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        <button className="btn primary" onClick={check}>Periksa jawaban</button>
        <button className="btn ghost" onClick={() => setShowHint(h => !h)}>{showHint ? 'Sembunyikan petunjuk' : 'Petunjuk'}</button>
        <button className="btn ghost" onClick={() => setFb({ ok: false, html: '<strong>Susunan yang diminta:</strong><br>' + answer.join('<br>') })}>Lihat jawaban</button>
      </div>
      {showHint && x.hint && <Html as="p" className="hint" html={x.hint} />}
      {fb && (
        <div className={'feedback ' + (fb.ok ? 'good' : 'bad')} role="status" aria-live="polite" style={{ marginTop: 12 }}>
          <Html as="span" html={fb.html} />
          {fb.ok && next && <Link className="btn primary sm" to={next.to} style={{ marginLeft: 12 }}>{next.label} →</Link>}
        </div>
      )}
    </section>
  );
}
