// Target harian, hari beruntun, dan pengingat belajar (Google Calendar / file .ics untuk iPhone & Outlook).
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../lib/progress';
import { findDrill } from '../pages/BankPage';
import { GOALS, atRisk, bestStreak, currentStreak, getGoal, getRemindTime, googleCalendarUrl, icsFile, setGoal, setRemindTime, todayCount } from '../lib/streak';

function Ring({ v, max }: { v: number; max: number }) {
  const r = 26, c = 2 * Math.PI * r, f = Math.min(1, max ? v / max : 0);
  return (
    <svg className="dg-ring" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r={r} className="bg" /><circle cx="32" cy="32" r={r} className="fg" strokeDasharray={c} strokeDashoffset={c * (1 - f)} transform="rotate(-90 32 32)" />
      <text x="32" y="37" textAnchor="middle">{f >= 1 ? '✓' : `${v}/${max}`}</text>
    </svg>
  );
}
export const Flame = () => <svg className="flame" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.5c.5 3-2.5 4.2-2.5 7.3 0 1.2.8 2.2 1.8 2.4-.5-1.6.5-2.9 1.6-3.6.2 1.6 2.4 2.4 2.4 4.7A3.3 3.3 0 0 1 10 16.6a5 5 0 0 1-5-5c0-4.3 4-6 5-9.1Z" /></svg>;

/** Versi lengkap (dashboard) atau ringkas (beranda). */
export function DailyGoal({ compact = false }: { compact?: boolean }) {
  const { p, isPro } = useProgress();
  const nav = useNavigate();
  const [goal, setG] = useState(getGoal);
  const [time, setT] = useState(getRemindTime);
  const [saved, setSaved] = useState('');
  const today = todayCount(p.activity), cur = currentStreak(p.activity), best = bestStreak(p.activity), risk = atRisk(p.activity);
  const done = today >= goal;
  const go = () => { const id = findDrill(p.drill, isPro); nav(id ? '/soal/' + id : '/soal'); };
  const msg = done ? `Target hari ini tercapai. ${cur > 1 ? `Hari beruntunmu ${cur} hari, pertahankan besok!` : 'Lanjutkan besok supaya jadi hari beruntun.'}`
    : risk ? `Selesaikan 1 hal lagi hari ini supaya ${cur} hari beruntunmu tidak putus.`
      : today ? `Tinggal ${goal - today} lagi untuk mencapai target hari ini.` : `Selesaikan ${goal} materi, soal, atau studi kasus hari ini.`;

  if (compact) return (
    <div className={'dg-strip' + (risk ? ' risk' : done ? ' ok' : '')}>
      <Ring v={today} max={goal} />
      <div><b>Target hari ini</b><span>{msg}</span></div>
      <span className="dg-streak" title="Hari beruntun"><Flame />{cur}</span>
      <div className="dg-act">{!done && <button className="btn primary sm" onClick={go}>Kerjakan 1 soal</button>}<Link to="/dashboard#target">Atur target & pengingat</Link></div>
    </div>
  );

  const origin = typeof location !== 'undefined' ? location.origin : 'https://jagoanexcel.com';
  const downloadIcs = () => {
    setRemindTime(time);
    const url = URL.createObjectURL(new Blob([icsFile(time, origin)], { type: 'text/calendar' }));
    const a = document.createElement('a'); a.href = url; a.download = 'pengingat-belajar-excel.ics'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000); setSaved('File pengingat terunduh. Buka filenya, lalu pilih Tambahkan ke kalender.');
  };
  return (
    <section id="target" className="card c12 dg" aria-labelledby="dg-h">
      <h2 id="dg-h">Target harian & pengingat</h2>
      <div className="dg-grid">
        <div className="dg-today">
          <Ring v={today} max={goal} />
          <div><p className="dg-msg">{msg}</p>
            <div className="dg-goal"><span>Target per hari</span>
              <div className="seg" role="radiogroup" aria-label="Target per hari">{GOALS.map(g => <button key={g} role="radio" aria-checked={goal === g} onClick={() => { setGoal(g); setG(g); }}>{g}</button>)}</div></div>
            {!done && <button className="btn primary sm" onClick={go}>Kerjakan 1 soal sekarang</button>}
          </div>
        </div>
        <dl className="dg-nums">
          <div><dt>Hari beruntun</dt><dd><Flame />{cur}</dd></div>
          <div><dt>Rekor terpanjang</dt><dd>{best}</dd></div>
        </dl>
        <div className="dg-remind">
          <b>Pasang pengingat harian</b>
          <p className="muted">Pasang pengingat di kalender HP atau laptop supaya tidak lupa latihan.</p>
          <label className="dg-time">Jam <input type="time" value={time} onChange={e => { setT(e.target.value); setRemindTime(e.target.value); }} /></label>
          <div className="cta">
            <a className="btn sm" href={googleCalendarUrl(time, origin)} target="_blank" rel="noopener noreferrer" onClick={() => setSaved('Di Google Calendar, tekan Simpan untuk memasang pengingatnya.')}>Google Calendar</a>
            <button className="btn sm" onClick={downloadIcs}>iPhone / Outlook (.ics)</button>
          </div>
          {saved && <p className="dg-saved" role="status">{saved}</p>}
        </div>
      </div>
    </section>
  );
}
