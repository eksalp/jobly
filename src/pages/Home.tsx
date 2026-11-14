import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BY, CASES, DRILL, SCORED, isFreeItem, modOf, pathFor, type Item } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { useAuth } from '../lib/auth';
import { currentStreak, getGoal, todayCount } from '../lib/streak';
import { WhatsNew } from '../components/WhatsNew';
import { findDrill } from './BankPage';
import { PATHS } from '../content/paths.js';
import { myPath, pathProgress } from './PathsPage';
import { challengeFor, getLog, shortTime, wibDate } from '../lib/challenge';
import { fetchBoard, type RankRow } from '../lib/rank';

const IC: Record<string, string> = {
  grid: 'M4 4h16v16H4zM4 9.5h16M4 15h16M9.5 4v16M15 4v16',
  case: 'M3.5 8h17v11h-17zM8.5 8V5.5h7V8M3.5 13h17',
  tpl: 'M5 4h14v16H5zM5 9h14M10 9v11',
  sim: 'M4 5h16v14H4zM4 9h16M9 9v10M12.5 13h5M12.5 16h3',
  brief: 'M3.5 8h17v11.5h-17zM8.5 8V5.5h7V8M3.5 13h17M11 12v2.5h2V12',
  doc: 'M6.5 3h7.5l4 4v14h-11.5zM14 3v4h4M9.5 12h5.5M9.5 15.5h5.5',
  star: 'M12 3.5l2.6 5.3 5.9.8-4.3 4 1.1 5.8L12 16.6l-5.3 2.8 1.1-5.8-4.3-4 5.9-.8z',
  play: 'M7 5l12 7-12 7z',
};
const Ic = ({ k }: { k: string }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={IC[k]} /></svg>;
const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const dkey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function greet(h: number) { return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam'; }

export default function Home() {
  const { p, isPro } = useProgress();
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const cur = p.current && BY[p.current];
  const first = SCORED.find((l: Item) => !p.done.includes(l.id) && (isFreeItem(l) || isPro)) || SCORED[0];
  const target: Item = cur || first;
  const doneN = SCORED.filter((l: Item) => p.done.includes(l.id)).length;
  const solved = Object.keys(p.drill).length;
  const n = (x: number) => x.toLocaleString('id-ID');
  const name = (profile?.full_name || user?.email?.split('@')[0] || '').trim();
  const firstName = name.split(/\s+/)[0];
  const streak = currentStreak(p.activity);
  const goal = getGoal(), today = todayCount(p.activity);
  const idx = SCORED.findIndex((l: Item) => l.id === target.id);
  const tMod = target.mod ? modOf(target.mod) : null;

  // 7 hari terakhir
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { l: DAYS[d.getDay()], v: p.activity[dkey(d)] || 0, now: i === 6 }; });
  const wMax = Math.max(4, ...week.map(w => w.v)), wSum = week.reduce((a, w) => a + w.v, 0);

  const ch = challengeFor(wibDate());
  const chDone = getLog()[ch.date];

  const mp = PATHS.find(x => x.id === myPath());
  const g = mp ? pathProgress(mp, p.done) : null;
  const pathNext = mp ? mp.stages.flatMap(s => s.items).filter(id => BY[id]).slice(0, 999) : [];
  const nextIdx = pathNext.findIndex(id => !p.done.includes(id));
  const pathShow = nextIdx < 0 ? pathNext.slice(-3) : pathNext.slice(Math.max(0, nextIdx - 1), Math.max(0, nextIdx - 1) + 3);

  const [rank, setRank] = useState<RankRow[] | null>(null);
  useEffect(() => { let on = true; fetchBoard('minggu', 5).then(r => { if (on) setRank(r); }).catch(() => { if (on) setRank(null); }); return () => { on = false; }; }, []);

  const sub = cur ? `Lanjut dari ${cur.title.replace(/^(Mencari data dengan|Memakai|Menghitung)\s+/i, '')}?` : doneN ? 'Satu materi lagi hari ini sudah cukup.' : 'Mulai dari materi pertama. Lima menit sudah cukup.';
  const R = 48, C = 2 * Math.PI * R, pct = Math.min(1, today / goal);

  return (
    <div className="wrap page home3">
      <div className="h3-grid">
        <section className="h3-main">
          <header className="h3-head">
            <h1>{greet(new Date().getHours())}{firstName ? `, ${firstName}` : ''}</h1>
            <p>{sub}</p>
          </header>

          <div className="h3-cards">
            <article className="h3-cont">
              <span className="h3-k">{cur ? 'Lanjutkan belajar' : doneN ? 'Materi berikutnya' : 'Mulai belajar'}</span>
              <h2>{target.title}</h2>
              <span className="h3-meta">Materi {idx + 1} dari {SCORED.length}{tMod ? ` · ${tMod.title}` : ''}</span>
              <span className="h3-bar" role="img" aria-label={`${doneN} dari ${SCORED.length} materi selesai`}><span style={{ width: Math.max(3, (doneN / SCORED.length) * 100) + '%' }} /></span>
              <div className="h3-row"><Link className="h3-btn-w" to={pathFor(target.id)}>{cur || doneN ? 'Lanjutkan' : 'Mulai'}</Link><Link className="h3-lnk-w" to="/materi">Semua materi</Link></div>
            </article>

            <article className="h3-card">
              <div className="h3-row"><span className="h3-k acc">Tantangan hari ini</span><span className="h3-tag">#{ch.n}</span></div>
              <h2 className="h3-t">{ch.title}</h2>
              <p className="h3-p">{chDone != null ? `Kamu menyelesaikannya dalam ${shortTime(chDone)}. Besok ada soal baru.` : 'Satu soal yang sama untuk semua orang. Coba catat waktumu.'}</p>
              <div className="h3-row end"><Link className="btn primary" to="/tantangan">{chDone != null ? 'Lihat hasil' : 'Mulai'}</Link></div>
            </article>

            <article className="h3-card">
              <div className="h3-row"><h2 className="h3-t sm">Aktivitas minggu ini</h2><span className="h3-num">{wSum}</span></div>
              <div className="h3-week" role="img" aria-label={'Aktivitas per hari: ' + week.map(w => `${w.l} ${w.v}`).join(', ')}>
                {week.map((w, i) => <span key={i}><i className={w.now ? 'now' : ''} style={{ height: Math.max(4, (w.v / wMax) * 100) + '%' }} /><small>{w.l}</small></span>)}
              </div>
            </article>

            <article className="h3-card h3-goal">
              <svg viewBox="0 0 120 120" role="img" aria-label={`Target hari ini ${today} dari ${goal}`}>
                <circle cx="60" cy="60" r={R} className="trk" />{pct > 0 && <circle cx="60" cy="60" r={R} className="val" strokeDasharray={`${C * pct} ${C}`} transform="rotate(-90 60 60)" />}
                <text x="60" y="62" textAnchor="middle">{Math.min(today, goal)}/{goal}</text><text x="60" y="80" textAnchor="middle" className="s">hari ini</text>
              </svg>
              <div>
                <h2 className="h3-t sm">Target harian</h2>
                <p className="h3-p">{today >= goal ? (streak > 1 ? `Tercapai. Sudah ${streak} hari berturut-turut.` : 'Tercapai. Sampai besok.') : today ? `Kurang ${goal - today} lagi.` : `Selesaikan ${goal} soal atau materi hari ini.`}</p>
              </div>
              <div className="h3-goal-act">{today < goal && <button className="btn primary sm" onClick={() => { const id = findDrill(p.drill, isPro); nav(id ? '/soal/' + id : '/soal'); }}>Kerjakan satu soal</button>}<Link className="btn sm" to="/dashboard#target">Ubah target</Link></div>
            </article>
          </div>

          <article className="h3-card h3-path">
            {mp && g ? <>
              <div className="h3-row"><h2 className="h3-t sm">Jalur belajar: {mp.title}</h2><Link to={'/jalur/' + mp.id}>{g.done} dari {g.total} langkah</Link></div>
              <div className="h3-steps">{pathShow.map(id => { const it = BY[id], ok = p.done.includes(id), on = id === pathNext[nextIdx]; return (
                <Link key={id} to={pathFor(id)} className={'h3-step' + (ok ? ' ok' : '') + (on ? ' on' : '')}><span>{ok ? '✓' : pathNext.indexOf(id) + 1}</span>{it.title}</Link>); })}</div>
            </> : <div className="h3-row"><div><h2 className="h3-t sm">Belajar sesuai pekerjaanmu</h2><p className="h3-p">Admin, keuangan, HR, gudang, olshop, sampai data analyst. Pilih satu, urutan materinya sudah disusun.</p></div><Link className="btn" to="/jalur">Pilih jalur</Link></div>}
          </article>

          <WhatsNew />

          <section aria-labelledby="h3-more" className="h3-more">
            <h2 id="h3-more" className="h3-t sm">Mau latihan apa lagi?</h2>
            <div className="h3-tiles">
              <Link to="/soal" className="h3-tile"><Ic k="grid" /><b>Bank soal</b><span>{n(DRILL.count)} soal, dicek otomatis</span></Link>
              <Link to="/kasus" className="h3-tile"><Ic k="case" /><b>Studi kasus</b><span>{CASES.length} kasus dari kantor sungguhan</span></Link>
              <Link to="/kasus/kasus-proyek-1-bersih" className="h3-tile"><Ic k="star" /><b>Proyek akhir</b><span>Laporan lengkap dari data mentah, 3 bagian</span></Link>
              <Link to="/fitur" className="h3-tile"><Ic k="sim" /><b>Simulasi Excel</b><span>PivotTable, Sort, grafik, dan lainnya</span></Link>
              <Link to="/template" className="h3-tile"><Ic k="tpl" /><b>Template</b><span>Siap pakai, tinggal isi data</span></Link>
              <Link to="/tes-kerja" className="h3-tile"><Ic k="brief" /><b>Tes Excel kerja</b><span>Latihan sebelum seleksi{!isPro && ' · Pro'}</span></Link>
              <Link to="/playground" className="h3-tile"><Ic k="play" /><b>Playground</b><span>Lembar kosong untuk coba rumus</span></Link>
            </div>
          </section>
        </section>

        <aside className="h3-side" aria-label="Ringkasan akun">
          <div className="h3-me">
            <span className="h3-av" aria-hidden="true">{profile?.avatar_url ? <img src={profile.avatar_url} alt="" referrerPolicy="no-referrer" /> : (firstName[0] || 'J').toUpperCase()}</span>
            <b>{name || 'Tamu'}</b>
            <span className="muted">{isPro ? 'Member Pro' : 'Akun gratis'}</span>
          </div>
          <dl className="h3-stats">
            <div><dd>{streak}</dd><dt>hari beruntun</dt></div>
            <div><dd>{n(solved)}</dd><dt>soal benar</dt></div>
            <div><dd>{doneN}</dd><dt>materi selesai</dt></div>
          </dl>
          {!isPro && <Link className="h3-pro" to="/harga"><small>PRO LIFETIME</small><b>Bayar sekali, terbuka selamanya</b><span>Semua materi, soal, studi kasus, dan template.</span></Link>}
          {rank && rank.length > 0 && <div className="h3-rank">
            <div className="h3-row"><h2 className="h3-t sm">Peringkat minggu ini</h2><Link to="/peringkat">Semua</Link></div>
            {rank.slice(0, 5).map(r => <div key={r.pos + r.name} className={'h3-rk' + (r.is_me ? ' me' : '')}><span>{r.pos}</span><b>{r.name}{r.is_me ? ' (kamu)' : ''}</b><em>{n(r.points)}</em></div>)}
          </div>}
          <Link className="h3-side-l" to="/portofolio"><Ic k="doc" /><span><b>Portofolio PDF</b><small>Semua hasil latihanmu dalam satu file</small></span></Link>
          <Link className="h3-side-l" to="/sertifikat"><Ic k="star" /><span><b>Sertifikat</b><small>Lulus ujian tiap tingkat, ada QR verifikasi</small></span></Link>
        </aside>
      </div>
    </div>
  );
}
