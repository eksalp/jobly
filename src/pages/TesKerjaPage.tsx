// Simulasi tes Excel rekrutmen: pilih posisi, kerjakan soal acak dengan batas waktu, lalu lihat nilai dan pembahasan.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DRILL } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { fromLesson } from '../lib/work';
import { pivotAnswer } from '../lib/pivotanswer';
import { Workbench } from '../components/Workbench';
import { PivotSim, type PivotSnapshot } from '../components/PivotSim';
import { Html } from '../components/Html';
import { JOB_GROUPS, JOB_TESTS, type JobTest } from '../content/jobtests.js';
import { JoblyCard } from '../components/JoblyCard';
import { Paywall } from '../components/Buy';
import { LockIcon } from '../components/Icons';
import { PIcon } from './PathsPage';
import {
  addHistory, answered, bandOf, bestByPos, gradeRun, history, isPivot, loadRun, newRun, saveRun, testOf,
  type JobResult, type JobRun,
} from '../lib/jobtest';

/** Kunci jawaban di halaman hasil hanya untuk member Pro (nilai dan keterangan salah tetap untuk semua). */
const SOLUTION_PRO = false; // seluruh simulasi sudah khusus Pro
const mmss = (ms: number) => { const s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const dur = (s: number) => (s >= 60 ? Math.floor(s / 60) + ' menit ' : '') + (s % 60 ? (s % 60) + ' detik' : '');

export default function TesKerjaPage() {
  const pr = useProgress();
  const [run, setRun] = useState<JobRun | null>(loadRun);
  const [res, setRes] = useState<{ r: JobResult; run: JobRun } | null>(null);
  const [hist, setHist] = useState<JobResult[]>(history);
  const [cur, setCur] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const [grp, setGrp] = useState('');

  useEffect(() => { document.title = 'Simulasi Tes Excel Kerja · Jagoan Excel'; }, []);
  useEffect(() => { if (!run) return; const t = window.setInterval(() => setNow(Date.now()), 500); return () => window.clearInterval(t); }, [run]);
  useEffect(() => { saveRun(run); }, [run]);
  useEffect(() => {
    if (!run) return;
    const on = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', on); return () => window.removeEventListener('beforeunload', on);
  }, [!!run]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [cur, !!res]);

  const items = useMemo(() => (run ? run.ids.map(id => DRILL.build(id)) : []), [run?.ids.join()]);
  const left = run ? run.deadline - now : 0;

  const finish = () => {
    if (!run) return;
    const r = gradeRun(run);
    addHistory(r); setHist(history());
    if (r.correct > 0) pr.track('tes-' + run.pos, 'tes kerja');
    setRes({ r, run }); setRun(null); setConfirm(false); setCur(0);
  };
  useEffect(() => { if (run && pr.isPro && left <= 0) finish(); }, [left <= 0, !!run, pr.isPro]);

  const begin = (pos: string) => { if (!pr.isPro) { document.getElementById('tk-pay')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; } const r = newRun(pos); if (r) { setRes(null); setCur(0); setNow(Date.now()); setRun(r); } };

  // ---------- hasil
  if (res) {
    const { r, run: rr } = res; const t = testOf(r.pos)!; const band = bandOf(r.score);
    const locked = SOLUTION_PRO && !pr.isPro;
    const wrongTopics = [...new Set(r.items.filter(i => !i.ok).map(i => DRILL.build(i.id)?.topic).filter(Boolean))] as string[];
    const share = `Aku baru coba simulasi tes Excel posisi ${t.title} di Jagoan Excel, nilainya ${r.score}/100 (${band.label}). Coba juga di https://jagoanexcel.com/tes-kerja`;
    return (
      <div className="wrap page exam tk">
        <div className={'ex-result' + (r.score >= 70 ? ' ok' : '')}>
          <p className="eyebrow">Simulasi tes · {t.title}</p>
          <div className="ex-score"><b>{r.score}</b><span>/100</span></div>
          <h1>{band.label}</h1>
          <p>{r.correct} dari {r.total} soal benar · waktu {dur(r.secs) || '0 detik'} dari {t.minutes} menit.<br />{band.note}</p>
          <div className="cta">
            <button className="btn primary lg" onClick={() => begin(r.pos)}>Ulangi dengan soal baru</button>
            <Link className="btn lg" to={'/jalur/' + t.path}>Jalur belajar {t.title}</Link>
            <a className="btn lg ghost" href={'https://wa.me/?text=' + encodeURIComponent(share)} target="_blank" rel="noopener noreferrer">Bagikan ke WhatsApp</a>
          </div>
        </div>
        {wrongTopics.length > 0 && <p className="tk-topics">Topik yang perlu dilatih: {wrongTopics.map(x => <span key={x} className="pill">{x}</span>)} <Link to="/soal">Latihan di bank soal →</Link></p>}
        <h2 className="ex-h2">Pembahasan per soal</h2>
        {locked && <p className="tk-lock">Kunci jawaban (rumus yang benar) terbuka untuk member Pro. Nilai dan keterangan salahnya tetap bisa kamu lihat. <Link to="/harga">Buka Pro</Link></p>}
        <ol className="ex-review">{r.items.map((it, i) => {
          const x = DRILL.build(it.id); if (!x) return null; const key = rr.ids[i].replace(/^soal-|-\d+$/g, '');
          return (
            <li key={it.id} className={it.ok ? 'ok' : 'bad'}><span className="ex-mark">{it.ok ? '✓' : '✕'}</span>
              <div><b>Soal {i + 1} · {x.title}</b> <span className="muted">{x.level} · {x.topic}</span>
                <Html as="p" className="tk-task" html={x.task} />
                {!it.ok && it.msg && <Html as="p" className="tk-why" html={'Kenapa salah: ' + it.msg} />}
                {!it.ok && (locked ? <p className="tk-sol locked">Kunci jawaban: <span aria-hidden="true">=••••••(•••, ••••)</span> <span className="badge">Pro</span></p>
                  : isPivot(x) ? <p className="tk-sol">Susunan yang benar: {pivotAnswer(x.pivot.target).join(' · ')}</p>
                    : <p className="tk-sol">Kunci jawaban: <code>{x.target} {x.solution}</code></p>)}
                <Link className="tk-more" to={`/soal/soal-${key}-1`}>Latih pola ini di bank soal →</Link>
              </div></li>);
        })}</ol>
        <JoblyCard />
        <button className="btn ghost" onClick={() => setRes(null)}>← Pilih posisi lain</button>
      </div>
    );
  }

  // ---------- sedang tes (status Pro bisa baru termuat sesaat setelah halaman dibuka)
  if (run && pr.isPro) {
    const t = testOf(run.pos)!; const x = items[cur]; const id = run.ids[cur];
    const nAns = items.filter((it, i) => answered(it, run.ans[run.ids[i]])).length;
    const set = (v: unknown) => setRun(r => (r ? { ...r, ans: { ...r.ans, [id]: v } } : r));
    return (
      <div className="wrap page exam tk">
        <div className="ex-bar">
          <b>Tes {t.title}</b>
          <span className={'ex-timer' + (left < 5 * 60_000 ? ' low' : '')} role="timer" aria-label="Sisa waktu">{mmss(left)}</span>
          <span className="muted">{nAns}/{items.length} dijawab</span>
          <button className="btn primary" onClick={() => setConfirm(true)}>Kumpulkan</button>
        </div>
        {confirm && <div className="ex-confirm" role="alertdialog"><p>Kumpulkan sekarang? {items.length - nAns > 0 ? `${items.length - nAns} soal belum dijawab. ` : ''}Jawaban langsung dinilai.</p><button className="btn primary sm" onClick={finish}>Ya, kumpulkan</button><button className="btn ghost sm" onClick={() => setConfirm(false)}>Lanjut mengerjakan</button><button className="btn ghost sm" onClick={() => { if (window.confirm('Batalkan tes ini? Jawaban tidak disimpan.')) { setRun(null); setConfirm(false); } }}>Batalkan tes</button></div>}
        <nav className="ex-nav" aria-label="Nomor soal"><div className="ex-nav-g"><span>Soal</span>
          {items.map((it, i) => <button key={run.ids[i]} aria-current={i === cur} className={answered(it, run.ans[run.ids[i]]) ? 'done' : ''} onClick={() => setCur(i)}>{i + 1}</button>)}
        </div></nav>
        <p className="crumb">Soal {cur + 1} dari {items.length} · {x.topic}</p>
        {isPivot(x) ? <>
          <h1 className="ex-q">{x.title}</h1>
          <Html as="p" className="task-text" html={x.task} />
          <div className="preview pf-drill-box"><div className="preview-b pf-wrap">
            <PivotSim key={id} mode="drill" data={x.pivot.data} fields={x.pivot.fields} numeric={x.pivot.numeric} sheetName={x.pivot.sheetName} initial={(run.ans[id] as PivotSnapshot) || null} onChange={s => set(s)} />
          </div></div>
          <p className="muted" style={{ fontSize: 13 }}>Susunan pivot tersimpan otomatis.</p>
        </> : <>
          <h1 className="ex-q">{x.title}</h1>
          <Workbench key={id} item={fromLesson(x)} heading="Soal" exam initial={run.ans[id] as any} start={x.target} onAnswers={a => set(a)} />
        </>}
        <div className="drill-nav">
          <button className="btn ghost" disabled={cur === 0} onClick={() => setCur(c => c - 1)}>← Sebelumnya</button>
          <span className="muted" style={{ fontSize: 13 }}>Seperti tes rekrutmen sungguhan: tidak ada petunjuk, nilainya keluar setelah dikumpulkan.</span>
          {cur < items.length - 1 ? <button className="btn" onClick={() => setCur(c => c + 1)}>Berikutnya →</button> : <button className="btn primary" onClick={() => setConfirm(true)}>Kumpulkan</button>}
        </div>
      </div>
    );
  }

  // ---------- pilih posisi
  const best = bestByPos(hist);
  const card = (t: JobTest) => (
    <article key={t.id} className="pt-card tk-card">
      <div className="pt-top"><PIcon k={t.icon} />{best[t.id] != null && <span className={'badge' + (best[t.id] >= 70 ? ' pro' : '')}>Terbaik {best[t.id]}</span>}</div>
      <h2>{t.title}</h2>
      <p className="pt-who">{t.who}</p>
      <p className="pt-desc">{t.desc}</p>
      <div className="tk-foot"><span className="muted">{t.keys.length} soal · {t.minutes} menit</span>{pr.isPro ? <button className="btn primary sm" onClick={() => begin(t.id)}>Mulai tes</button> : <button className="btn sm" onClick={() => begin(t.id)}><LockIcon /> Pro</button>}</div>
    </article>);
  return (
    <div className="wrap page tk">
      <div className="page-head"><p className="eyebrow">Persiapan kerja</p><h1>Simulasi tes Excel rekrutmen</h1>
        <p>Banyak perusahaan memberi tes Excel praktik saat seleksi: kamu diberi data, lalu diminta membuat rekap atau mencari data dengan batas waktu. Latih situasi itu di sini. Pilih posisi yang kamu lamar, kerjakan 12 soal tanpa petunjuk, lalu lihat nilai dan pembahasannya. Datanya diacak setiap kali tes dimulai, jadi bisa diulang sebanyak yang kamu mau.</p></div>
      <div className="tk-how">
        <div><b>12 soal</b><span>rumus + 1 PivotTable</span></div>
        <div><b>35–45 menit</b><span>ada hitung mundur</span></div>
        <div><b>Tanpa petunjuk</b><span>seperti tes asli</span></div>
        <div><b>Nilai 70+</b><span>artinya siap tes</span></div>
      </div>
      {!pr.isPro && <div id="tk-pay"><Paywall what="Simulasi tes kerja" desc="Simulasi tes kerja, persiapan wawancara & CV, dan latihan shortcut khusus member Pro. Kamu tetap bisa melihat daftar posisi dan materi yang dites di bawah." /></div>}
      <div className="filters" role="group" aria-label="Kelompok posisi">
        {[{ id: '', title: 'Semua' }, ...JOB_GROUPS].map(g => <button key={g.id || 'all'} className="chip" aria-pressed={grp === g.id} onClick={() => setGrp(grp === g.id ? '' : g.id)}>{g.title}{g.id && <span className="chip-n">{JOB_TESTS.filter(x => x.group === g.id).length}</span>}</button>)}
      </div>
      {JOB_GROUPS.filter(g => !grp || g.id === grp).map(g => (
        <section key={g.id} className="pt-sec" aria-labelledby={'tk-' + g.id}>
          <div className="pt-sec-h"><h2 id={'tk-' + g.id}>{g.title}</h2><p className="muted">{g.desc}</p></div>
          <div className="pt-grid tk-grid">{JOB_TESTS.filter(t => t.group === g.id).map(card)}</div>
        </section>
      ))}
      {hist.length > 0 && <>
        <h2 className="ex-h2">Riwayat tesmu</h2>
        <table className="tk-hist"><thead><tr><th>Tanggal</th><th>Posisi</th><th>Nilai</th><th>Hasil</th></tr></thead><tbody>
          {hist.slice(0, 8).map(h => <tr key={h.at}><td>{new Date(h.at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td><td>{testOf(h.pos)?.title}</td><td><b>{h.score}</b></td><td>{bandOf(h.score).label}</td></tr>)}
        </tbody></table>
        <p className="muted" style={{ fontSize: 13 }}>Riwayat tersimpan di perangkat ini.</p>
      </>}
      <JoblyCard />
      <p className="tk-next">Mau persiapan lebih lengkap? Baca juga <Link to="/wawancara">pertanyaan wawancara Excel & cara menulis skill Excel di CV</Link>.</p>
    </div>
  );
}
