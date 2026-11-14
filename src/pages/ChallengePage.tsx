import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DRILL } from '../content/drills.js';
import { fromLesson } from '../lib/work';
import { useProgress } from '../lib/progress';
import { Workbench } from '../components/Workbench';
import { challengeFor, challengeStreak, fmtTime, getLog, saveResult, shortTime, wibDate, type Log } from '../lib/challenge';

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BLN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const tglPanjang = (iso: string) => { const d = new Date(iso + 'T00:00:00Z'); return `${HARI[d.getUTCDay()]}, ${d.getUTCDate()} ${BLN[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };

const tglPendek = (iso: string) => { const d = new Date(iso + 'T00:00:00Z'); return `${HARI[d.getUTCDay()].slice(0, 3)}, ${d.getUTCDate()} ${BLN[d.getUTCMonth()].slice(0, 3)}`; };

export default function ChallengePage() {
  const pr = useProgress();
  const today = wibDate();
  const ch = useMemo(() => challengeFor(today), [today]);
  const x = useMemo(() => DRILL.build(ch.id), [ch.id]);
  const [log, setLog] = useState<Log>(getLog);
  const [start, setStart] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [result, setResult] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const tick = useRef<number>();
  const already = log[today];

  useEffect(() => { document.title = 'Tantangan hari ini · Jagoan Excel'; }, []);
  useEffect(() => {
    if (start === null || result !== null) return;
    tick.current = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(tick.current);
  }, [start, result]);

  if (!x) return null;
  const work = fromLesson(x);
  const secs = result ?? (start ? (now - start) / 1000 : 0);
  const best = result ?? already;
  const streak = challengeStreak(log, today);
  const shareText = `Tantangan Excel #${ch.n} selesai dalam ${shortTime(best ?? 0)}. Coba kalahkan waktuku di jagoanexcel.com/tantangan`;
  const share = (to: 'wa' | 'threads' | 'copy') => {
    if (to === 'copy') { navigator.clipboard?.writeText(shareText).then(() => setCopied(true)).catch(() => setCopied(false)); return; }
    const u = to === 'wa' ? 'https://wa.me/?text=' + encodeURIComponent(shareText) : 'https://www.threads.net/intent/post?text=' + encodeURIComponent(shareText);
    window.open(u, '_blank', 'noopener');
  };
  const hist = Object.entries(log).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 5);
  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(Date.parse(today + 'T00:00:00Z') - (6 - i) * 864e5).toISOString().slice(0, 10); return { d, ok: log[d] != null, label: HARI[new Date(d + 'T00:00:00Z').getUTCDay()].slice(0, 3) }; });

  return (
    <div className="wrap page tg">
      <header className="tg-head">
        <div>
          <p className="eyebrow">Tantangan #{ch.n} · {tglPanjang(today)}</p>
          <h1>Tantangan hari ini</h1>
          <p className="tg-sub">Satu soal, sama untuk semua orang, ganti setiap tengah malam. Waktu mulai dihitung saat kamu menekan Mulai. Tidak ada petunjuk atau kunci jawaban di sini.</p>
        </div>
        <div className="tg-week" aria-label={`Tantangan 7 hari terakhir, ${streak} hari beruntun`}>
          {last7.map(w => <span key={w.d} className={'tg-day' + (w.ok ? ' ok' : '') + (w.d === today ? ' now' : '')} title={w.d}><i aria-hidden="true">{w.ok ? '✓' : ''}</i>{w.label}</span>)}
          <b>{streak} hari beruntun</b>
        </div>
      </header>

      {start === null && result === null ? (
        <div className="tg-grid">
        <section className="tg-start">
          <span className="pill">{x.level} · {x.topic}</span>
          <h2>{x.title}</h2>
          {already != null ? <p>Kamu sudah menyelesaikan tantangan ini dalam <b>{fmtTime(already)}</b>. Boleh coba lagi untuk memperbaiki waktumu.</p> : <p>Siapkan diri dulu. Begitu menekan Mulai, soal muncul dan waktu berjalan.</p>}
          <div className="tg-act">
            <button className="btn primary lg" onClick={() => { setStart(Date.now()); setNow(Date.now()); }}>{already != null ? 'Coba lagi' : 'Mulai'}</button>
            {already != null && <button className="btn lg" onClick={() => setResult(already)}>Bagikan hasil</button>}
          </div>
        </section>
        <aside className="tg-side">
          <h3>Cara main</h3>
          <ol className="tg-rules">
            <li>Soal yang sama untuk semua orang hari ini, berganti pukul 00.00 WIB.</li>
            <li>Waktu mulai dihitung saat kamu menekan Mulai dan berhenti begitu semua jawaban benar.</li>
            <li>Tidak ada petunjuk atau kunci jawaban. Boleh mencoba ulang untuk memperbaiki waktu.</li>
            <li>Kerjakan setiap hari supaya hari beruntunmu bertambah.</li>
          </ol>
          <h3>Catatan waktumu</h3>
          {hist.length ? <ul className="tg-hist">{hist.map(([d, t]) => <li key={d}><span>{tglPendek(d)}</span><b>{shortTime(t)}</b></li>)}</ul> : <p className="muted">Belum ada catatan. Hasil pertamamu akan muncul di sini.</p>}
        </aside>
        </div>
      ) : result !== null ? (
        <section className="tg-done" aria-live="polite">
          <p className="tg-big">{shortTime(result)}</p>
          <h2>Selesai dalam {fmtTime(result)}</h2>
          <p>{streak > 1 ? `Sudah ${streak} hari berturut-turut. Besok ada soal baru.` : 'Besok ada soal baru. Datang lagi supaya jadi beruntun.'}</p>
          <div className="tg-act">
            <button className="btn primary" onClick={() => share('wa')}>Bagikan ke WhatsApp</button>
            <button className="btn" onClick={() => share('threads')}>Bagikan ke Threads</button>
            <button className="btn" onClick={() => share('copy')}>{copied ? 'Teks tersalin' : 'Salin teks'}</button>
          </div>
          <p className="muted tg-share">{shareText}</p>
          <p><Link to="/soal">Lanjut latihan di Bank Soal</Link></p>
        </section>
      ) : (
        <>
          <div className="tg-timer" role="timer" aria-label="Waktu berjalan">{shortTime(secs)}</div>
          <Workbench key={ch.id} item={work} heading="Tantangan" done={false} noHelp
            onResult={(_ok, all) => {
              if (!all || result !== null || start === null) return;
              const s = Math.max(1, (Date.now() - start) / 1000);
              setResult(s); setLog(saveResult(today, s));
              if (!pr.p.drill[ch.id]) pr.markDone(ch.id, 'drill');
            }} />
        </>
      )}
    </div>
  );
}
