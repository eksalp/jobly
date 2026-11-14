// Ujian akhir per tingkat: soal praktik gabungan rumus, studi kasus, PivotTable, dan teori.
// Soal datang dari server tanpa kunci jawaban, dan dinilai di server setelah dikumpulkan.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProgress } from '../lib/progress';
import { useAuth } from '../lib/auth';
import { hasSupabase } from '../lib/supabase';
import type { WorkItem } from '../lib/work';
import { LEVEL_BY, LEVELS, allStatus, type Level } from '../lib/certs';
import { useBypass } from '../lib/bypass';
import { EXAM, bestPassed, myAttempts, startExam, submitExam, triesToday, type Answers, type Attempt, type AttemptRow, type ExamItem, type Result } from '../lib/exam';
import { Workbench } from '../components/Workbench';
import { PivotSim, type PivotSnapshot } from '../components/PivotSim';
import { Html } from '../components/Html';
import NotFound from './NotFound';

const saveKey = (id: string) => 'kr.exam.ans.' + id;
const mmss = (ms: number) => { const s = Math.max(0, Math.ceil(ms / 1000)); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return (h ? h + ':' + String(m).padStart(2, '0') : String(m)) + ':' + String(s % 60).padStart(2, '0'); };
const SECTION: Record<string, string> = { p: 'Praktik', c: 'Studi kasus', v: 'PivotTable', t: 'Teori' };
const SEC_LETTER: Record<string, string> = { p: 'P', c: 'K', v: 'V', t: 'T' };

function toWork(x: Extract<ExamItem, { type: 'p' | 'c' }>): WorkItem {
  return {
    id: x.id, kind: x.type === 'p' ? 'drill' : 'case', cols: x.cols, rows: x.rows, data: x.data, fmt: x.fmt || undefined, bold: x.bold || undefined,
    tasks: x.tasks.map(t => ({ target: t.target, solution: '', text: t.text, fill: t.fill })), editable: new Set(x.editable),
  };
}
function isAnswered(x: ExamItem, a: unknown) {
  if (x.type === 't') return Number.isInteger(a);
  if (x.type === 'v') { const s = a as PivotSnapshot | undefined; return !!s && (s.state.vals.length > 0 || s.state.rows.length > 0); }
  return !!a && Object.values(a as Record<string, string>).some(v => String(v).trim() !== '');
}

export default function ExamPage() {
  const { level = '' } = useParams();
  const lv = LEVEL_BY[level as Level['key']];
  const plan = EXAM.levels[level];
  const { p } = useProgress();
  const { user } = useAuth();
  const [rows, setRows] = useState<AttemptRow[] | null>(null);
  const [att, setAtt] = useState<Attempt | null>(null);
  const [ans, setAns] = useState<Answers>({});
  const [cur, setCur] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [res, setRes] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [confirm, setConfirm] = useState(false);
  const sent = useRef(false);

  useEffect(() => { myAttempts().then(setRows).catch(() => setRows([])); }, [user?.id, res]);
  useEffect(() => { document.title = `Ujian ${lv?.name ?? ''} · Jagoan Excel`; }, [level]);
  useEffect(() => { if (!att || res) return; const t = window.setInterval(() => setNow(Date.now()), 500); return () => window.clearInterval(t); }, [att, res]);
  useEffect(() => { if (att && !res) try { localStorage.setItem(saveKey(att.id), JSON.stringify(ans)); } catch { /* abaikan */ } }, [ans]);
  useEffect(() => {
    if (!att || res) return;
    const on = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', on); return () => window.removeEventListener('beforeunload', on);
  }, [att, res]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [cur]);

  const left = att ? Date.parse(att.deadline) - now : 0;
  const submit = async () => {
    if (!att || sent.current) return;
    sent.current = true; setBusy(true); setErr(''); setConfirm(false);
    try {
      const r = await submitExam(att, ans);
      setRes(r); try { localStorage.removeItem(saveKey(att.id)); } catch { /* abaikan */ }
      window.scrollTo({ top: 0 });
    } catch (e) { sent.current = false; setErr(e instanceof Error ? e.message : 'Jawaban gagal dikirim. Coba lagi.'); }
    setBusy(false);
  };
  useEffect(() => { if (att && !res && left <= 0) submit(); }, [left <= 0, att, res]);

  const bypass = useBypass();
  const st = useMemo(() => allStatus(p, bypass), [p, bypass]);
  if (!lv || !plan) return <NotFound />;
  const passedBy = bestPassed(rows || []);
  const idx = LEVELS.findIndex(l => l.key === lv.key);
  const prevOk = bypass || LEVELS.slice(0, idx).every(l => passedBy[l.key] != null);
  const ready = st[lv.key].ok && prevOk;
  const tries = bypass ? 0 : triesToday(rows || [], lv.key);
  const W = EXAM.weights;
  const maxPts = plan.practical * W.practical + plan.cases * 4 * W.caseTask + plan.pivot * W.pivot + plan.theory * W.theory;

  const begin = async () => {
    setBusy(true); setErr('');
    try {
      const a = await startExam(lv.key);
      let saved: Answers = {}; try { saved = JSON.parse(localStorage.getItem(saveKey(a.id)) || '{}'); } catch { /* abaikan */ }
      sent.current = false; setAns(saved); setCur(0); setRes(null); setAtt(a); setNow(Date.now());
    } catch (e) { setErr(e instanceof Error ? e.message : 'Ujian belum bisa dimulai.'); }
    setBusy(false);
  };
  const labelOf = (items: ExamItem[], i: number) => { const t = items[i].type; return SEC_LETTER[t] + (items.slice(0, i + 1).filter(x => x.type === t).length); };

  // ---------- hasil
  if (att && res) {
    const byId = Object.fromEntries(att.items.map((x, i) => [x.id, { x, i }]));
    return (
      <div className="wrap page exam">
        <div className={'ex-result' + (res.passed ? ' ok' : '')}>
          <p className="eyebrow">Hasil ujian {lv.name}</p>
          <div className="ex-score"><b>{res.score}</b><span>/100</span></div>
          <h1>{res.passed ? 'Selamat, kamu lulus!' : 'Belum lulus kali ini'}</h1>
          <p>{res.points != null ? `${res.points} dari ${res.max} poin · ` : ''}{res.correct} dari {res.total} soal benar penuh · batas lulus {EXAM.pass}.{res.late ? ' Jawaban terkirim setelah waktu habis, jadi tidak dinilai.' : ''}</p>
          <div className="cta">
            {res.passed ? <Link className="btn primary lg" to="/sertifikat">Ambil sertifikat {lv.name} →</Link>
              : <button className="btn primary lg" onClick={() => { setAtt(null); setRes(null); }}>Kembali ke halaman ujian</button>}
            <Link className="btn lg ghost" to="/soal">Latihan lagi di bank soal</Link>
          </div>
        </div>
        <h2 className="ex-h2">Rincian per soal</h2>
        <p className="muted" style={{ fontSize: 13.5, marginTop: -4 }}>Kunci jawaban tidak ditampilkan supaya adil untuk peserta lain. Lihat keterangan di bawah untuk tahu bagian yang perlu dilatih lagi.</p>
        <ol className="ex-review">{res.results.map(r => { const it = byId[r.id]; if (!it) return null; const x = it.x; return (
          <li key={r.id} className={r.ok ? 'ok' : r.got > 0 ? 'part' : 'bad'}><span className="ex-mark">{r.ok ? '✓' : r.got > 0 ? '½' : '✕'}</span>
            <div><b>{labelOf(att.items, it.i)} · {SECTION[x.type]}{'title' in x ? ' · ' + x.title : ''}</b> <span className="muted">{r.got}/{r.max} poin</span>
              {x.type === 't' && <p>{x.q}</p>}
              {r.msg && <p>{r.msg}</p>}
              {r.tasks && <ul className="ex-tasks">{r.tasks.map(t => <li key={t.target} className={t.ok ? 'ok' : 'bad'}>{t.ok ? '✓' : '✕'} {t.target}{t.msg ? ': ' + t.msg : ''}</li>)}</ul>}
            </div></li>
        ); })}</ol>
      </div>
    );
  }

  // ---------- sedang ujian
  if (att) {
    const items = att.items; const x = items[cur];
    const nAns = items.filter(i => isAnswered(i, ans[i.id])).length;
    const set = (v: unknown) => setAns(s => ({ ...s, [x.id]: v }));
    return (
      <div className="wrap page exam">
        <div className="ex-bar">
          <b>Ujian {lv.name}</b>
          <span className={'ex-timer' + (left < 5 * 60_000 ? ' low' : '')} role="timer" aria-label="Sisa waktu">{mmss(left)}</span>
          <span className="muted">{nAns}/{items.length} dijawab</span>
          <button className="btn primary" disabled={busy} onClick={() => setConfirm(true)}>{busy ? 'Mengirim…' : 'Kumpulkan'}</button>
        </div>
        {confirm && <div className="ex-confirm" role="alertdialog"><p>Kumpulkan sekarang? {items.length - nAns > 0 ? `${items.length - nAns} soal belum dijawab. ` : ''}Jawaban tidak bisa diubah setelah dikumpulkan.</p><button className="btn primary sm" onClick={submit}>Ya, kumpulkan</button><button className="btn ghost sm" onClick={() => setConfirm(false)}>Lanjut mengerjakan</button></div>}
        {err && <p className="buy-err" role="alert">{err}</p>}
        <nav className="ex-nav" aria-label="Nomor soal">
          {(['p', 'c', 'v', 't'] as const).filter(t => items.some(i => i.type === t)).map(t => (
            <div key={t} className="ex-nav-g"><span>{SECTION[t]}</span>
              {items.map((it, i) => it.type !== t ? null : <button key={it.id} aria-current={i === cur} className={isAnswered(it, ans[it.id]) ? 'done' : ''} onClick={() => setCur(i)}>{labelOf(items, i)}</button>)}
            </div>
          ))}
        </nav>

        <p className="crumb">{SECTION[x.type]} · soal {cur + 1} dari {items.length}</p>
        {x.type === 'p' && <>
          <h1 className="ex-q">{x.title}</h1>
          <Workbench key={x.id} item={toWork(x)} heading="Jawaban" exam initial={ans[x.id] as any} start={x.tasks[0].target} onAnswers={a => set(a)} />
        </>}
        {x.type === 'c' && <>
          <h1 className="ex-q">Studi kasus: {x.title}</h1>
          <div className="scenario"><p>{x.scenario}</p></div>
          <Workbench key={x.id} item={toWork(x)} heading="Tugas" exam initial={ans[x.id] as any} start={x.tasks[0].target} onAnswers={a => set(a)} />
        </>}
        {x.type === 'v' && <>
          <h1 className="ex-q">{x.title}</h1>
          <Html as="p" className="task-text" html={x.text} />
          <div className="preview pf-drill-box"><div className="preview-b pf-wrap">
            <PivotSim key={x.id} mode="drill" data={x.data} fields={x.fields} numeric={x.numeric} sheetName={x.sheetName} initial={(ans[x.id] as PivotSnapshot) || null} onChange={s => set(s)} />
          </div></div>
          <p className="muted" style={{ fontSize: 13 }}>Susunan pivot tersimpan otomatis. Tidak perlu menekan tombol periksa.</p>
        </>}
        {x.type === 't' && (
          <fieldset className="ex-theory">
            <legend>{x.q}</legend>
            {x.opts.map((o, i) => (
              <label key={i} className={ans[x.id] === i ? 'on' : ''}><input type="radio" name={x.id} checked={ans[x.id] === i} onChange={() => set(i)} /> <span>{o}</span></label>
            ))}
          </fieldset>
        )}

        <div className="drill-nav">
          <button className="btn ghost" disabled={cur === 0} onClick={() => setCur(c => c - 1)}>← Sebelumnya</button>
          <span className="muted" style={{ fontSize: 13 }}>Tidak ada tombol periksa di ujian. Semua jawaban dinilai setelah dikumpulkan.</span>
          {cur < items.length - 1 ? <button className="btn" onClick={() => setCur(c => c + 1)}>Berikutnya →</button> : <button className="btn primary" onClick={() => setConfirm(true)}>Kumpulkan</button>}
        </div>
      </div>
    );
  }

  // ---------- pengantar
  return (
    <div className="wrap page exam">
      <p className="crumb"><Link to="/sertifikat">Sertifikat</Link> › Ujian</p>
      <p className="eyebrow">Ujian akhir</p>
      <h1>Ujian {lv.name}</h1>
      <div className="ex-rules">
        <div><b>{plan.practical}</b><span>soal praktik gabungan rumus</span></div>
        <div><b>{plan.cases}</b><span>studi kasus (3–4 tugas berkaitan)</span></div>
        {plan.pivot > 0 && <div><b>{plan.pivot}</b><span>soal PivotTable</span></div>}
        <div><b>{plan.theory}</b><span>soal teori pilihan ganda</span></div>
        <div><b>{plan.minutes} menit</b><span>waktu mengerjakan</span></div>
        <div><b>{EXAM.pass}</b><span>nilai minimal lulus (dari 100)</span></div>
      </div>
      <Html as="p" html={`Soal ujian <b>berbeda dari bank soal latihan</b>: lebih menantang, menggabungkan beberapa fungsi, dan datanya diacak untuk setiap peserta. Selama ujian <b>tidak ada tombol periksa, petunjuk, atau kunci jawaban</b>. Bobot nilai: soal praktik ${W.practical} poin, tiap tugas studi kasus ${W.caseTask} poin${plan.pivot ? `, PivotTable ${W.pivot} poin` : ''}, teori ${W.theory} poin (total sekitar ${maxPts} poin, dihitung jadi nilai 0–100). Jawaban ${hasSupabase ? 'dinilai di server' : 'dinilai otomatis'} setelah kamu menekan Kumpulkan atau waktu habis, dan tersimpan sementara di browser kalau halaman tidak sengaja dimuat ulang.`} />
      <h2 className="ex-h2">Syarat mengikuti ujian</h2>
      <ul className="ex-req">
        <li className={st[lv.key].lessons[0] === st[lv.key].lessons[1] ? 'ok' : ''}>Semua materi tingkat {lv.label}: {st[lv.key].lessons[0]}/{st[lv.key].lessons[1]}</li>
        <li className={st[lv.key].drills[0] >= lv.minDrill ? 'ok' : ''}>Soal latihan {lv.drillLevel} di bank soal: {st[lv.key].drills[0].toLocaleString('id-ID')}/{lv.minDrill.toLocaleString('id-ID')}</li>
        {lv.minCases > 0 && <li className={st[lv.key].cases[0] >= lv.minCases ? 'ok' : ''}>Studi kasus: {st[lv.key].cases[0]}/{lv.minCases}</li>}
        {idx > 0 && <li className={prevOk ? 'ok' : ''}>Lulus ujian {LEVELS[idx - 1].name}</li>}
      </ul>
      {err && <p className="buy-err" role="alert">{err}</p>}
      {hasSupabase && !user ? <Link className="btn primary lg" to={`/masuk?next=/ujian/${lv.key}`}>Masuk untuk ikut ujian</Link>
        : passedBy[lv.key] != null ? <div className="cta"><span className="badge pro">Lulus · nilai {passedBy[lv.key]}</span><Link className="btn primary" to="/sertifikat">Ambil sertifikat</Link><button className="btn ghost" disabled={busy || tries >= EXAM.perDay} onClick={begin}>Ulangi untuk nilai lebih baik</button></div>
        : <div className="cta"><button className="btn primary lg" disabled={!ready || busy || tries >= EXAM.perDay} onClick={begin}>{busy ? 'Menyiapkan soal…' : 'Mulai ujian'}</button>
          {!ready && <Link className="btn lg ghost" to="/soal">Lengkapi syarat dulu</Link>}
          {tries >= EXAM.perDay && <span className="muted">Batas {EXAM.perDay} percobaan hari ini sudah habis.</span>}</div>}
      <p className="muted" style={{ fontSize: 13.5, marginTop: 16 }}>Setelah lulus, ambil sertifikatmu di halaman <Link to="/sertifikat">Sertifikat</Link>. Nilai ujian ikut tercantum di sertifikat dan di halaman verifikasi QR.</p>
    </div>
  );
}
