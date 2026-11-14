// Jalur belajar per profesi: daftar jalur dan halaman detail berisi tahap-tahap berurutan dengan progres.
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../content/paths.js';
import { BY, isFreeItem, pathFor, type Item } from '../lib/catalog';
import { FOCUS, focusCount } from '../lib/drillfocus';
import { useProgress } from '../lib/progress';
import NotFound from './NotFound';

type Path = (typeof PATHS)[number];
const MY = 'kr.path';
export const myPath = (): string | null => { try { return localStorage.getItem(MY); } catch { return null; } };
const setMyPath = (id: string | null) => { try { if (id) localStorage.setItem(MY, id); else localStorage.removeItem(MY); } catch { /* abaikan */ } };
const itemsOf = (p: Path) => p.stages.flatMap(s => s.items);
export function pathProgress(p: Path, done: string[]) { const all = itemsOf(p); const d = all.filter(i => done.includes(i)).length; return { done: d, total: all.length, pct: Math.round((d / all.length) * 100) }; }

const ICON: Record<string, string> = {
  admin: 'M4 6h16v12H4zM8 10h8M8 14h5', calc: 'M6 3h12v18H6zM9 7h6M9 11h.01M12 11h.01M15 11h.01M9 14.5h.01M12 14.5h.01M15 14.5v3.5M9 18h.01M12 18h.01', finance: 'M5 19V9M10 19V5M15 19v-7M20 19v-4M3 19h18', people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 19c.8-3 3-4.5 6-4.5s5.2 1.5 6 4.5M16 11a2.5 2.5 0 1 0 0-5M17 14.5c2 .4 3.4 1.8 4 4.5',
  chart: 'M4 19h16M6 15l4-4 3 3 5-6', box: 'M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8', data: 'M5 6c0-1.1 3.1-2 7-2s7 .9 7 2-3.1 2-7 2-7-.9-7-2ZM5 6v12c0 1.1 3.1 2 7 2s7-.9 7-2V6M5 12c0 1.1 3.1 2 7 2s7-.9 7-2',
  megaphone: 'M4 10v4h3l6 4V6L7 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11', cart: 'M3 4h2l2.2 10.5h10.6L20 7H6.2M9 19h.01M17 19h.01',
  clip: 'M9 4h6v3H9zM7 5.5H5.5V20h13V5.5H17M8.5 11h7M8.5 15h5', truck: 'M3 6h11v9H3zM14 9h4l3 3v3h-7M7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  health: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10ZM12 9v5M9.5 11.5h5',
  shield: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4', store: 'M4 9l1.5-5h13L20 9M4 9h16v10H4zM4 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3', school: 'M3 9l9-5 9 5-9 5zM7 11v5c3 2 7 2 10 0v-5', grad: 'M3 9l9-5 9 5-9 5zM21 9v6M7 11v4.5c3 2 7 2 10 0V11',
};
export const PIcon = ({ k }: { k: string }) => <svg className="pt-ic" viewBox="0 0 24 24" aria-hidden="true"><path d={ICON[k] || ICON.admin} /></svg>;

export default function PathsPage() {
  const { id } = useParams();
  return id ? <PathDetail id={id} /> : <PathList />;
}

const GROUPS: { id: string; title: string; desc: string }[] = [
  { id: 'admin', title: 'Jalur admin', desc: 'Untuk pekerjaan admin di berbagai bagian: kantor, pemasaran, gudang, olshop, keuangan, HR, sales, purchasing, logistik, dan klinik.' },
  { id: 'profesi', title: 'Jalur profesi', desc: 'Untuk staf dan analis yang memakai Excel lebih dalam di bidangnya.' },
  { id: 'lain', title: 'Usaha & pendidikan', desc: 'Untuk pemilik usaha, guru, pelajar, dan mahasiswa.' },
];

function PathList() {
  const { p } = useProgress();
  const [mine, setMine] = useState<string | null>(null);
  const [grp, setGrp] = useState('');
  useEffect(() => setMine(myPath()), []);
  const card = (x: Path) => { const g = pathProgress(x, p.done); return (
    <Link key={x.id} to={'/jalur/' + x.id} className={'pt-card' + (mine === x.id ? ' mine' : '')}>
      <div className="pt-top"><PIcon k={x.icon} />{mine === x.id && <span className="badge pro">Jalurku</span>}</div>
      <h2>{x.title}</h2>
      <p className="pt-who">{x.who}</p>
      <p className="pt-desc">{x.desc}</p>
      <div className="pt-foot"><span className="meter"><span style={{ width: g.pct + '%' }} /></span><span className="muted">{g.done}/{g.total}</span></div>
    </Link>); };
  return (
    <div className="wrap page">
      <div className="page-head"><p className="eyebrow">Mulai dari pekerjaanmu</p><h1>Jalur belajar per profesi</h1>
        <p>Bingung mulai dari mana? Pilih pekerjaan yang paling dekat denganmu. Materinya sudah diurutkan, tinggal ikuti satu per satu.</p></div>
      <div className="filters" role="group" aria-label="Kelompok jalur">
        {[{ id: '', title: 'Semua' }, ...GROUPS].map(g => <button key={g.id || 'all'} className="chip" aria-pressed={grp === g.id} onClick={() => setGrp(grp === g.id ? '' : g.id)}>{g.title}{g.id && <span className="chip-n">{PATHS.filter(x => x.group === g.id).length}</span>}</button>)}
      </div>
      {GROUPS.filter(g => !grp || g.id === grp).map(g => (
        <section key={g.id} className="pt-sec" aria-labelledby={'pt-' + g.id}>
          <div className="pt-sec-h"><h2 id={'pt-' + g.id}>{g.title}</h2><p className="muted">{g.desc}</p></div>
          <div className="pt-grid">{PATHS.filter(x => x.group === g.id).map(card)}</div>
        </section>
      ))}
    </div>
  );
}

function PathDetail({ id }: { id: string }) {
  const { p, isPro } = useProgress();
  const nav = useNavigate();
  const x = PATHS.find(y => y.id === id);
  const [mine, setMine] = useState<string | null>(null);
  useEffect(() => setMine(myPath()), []);
  useEffect(() => { if (x) document.title = 'Jalur ' + x.title + ' · Jagoan Excel'; }, [x?.id]);
  if (!x) return <NotFound />;
  const g = pathProgress(x, p.done);
  const next = itemsOf(x).find(i => !p.done.includes(i));
  const choose = () => { setMyPath(x.id); setMine(x.id); };

  return (
    <div className="wrap page pt-detail">
      <p className="crumb"><Link to="/jalur">Jalur belajar</Link> › {x.title}</p>
      <div className="pt-hero">
        <PIcon k={x.icon} />
        <div>
          <h1>{x.title}</h1>
          <p className="pt-who">Cocok untuk: {x.who}</p>
          <p>{x.desc}</p>
          <ul className="pt-goals">{x.goals.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
      <div className="pt-bar">
        <div className="pt-prog"><span><b>{g.pct}%</b> selesai · {g.done} dari {g.total} langkah</span><span className="meter"><span style={{ width: g.pct + '%' }} /></span></div>
        <div className="cta">
          {next ? <button className="btn primary" onClick={() => { choose(); nav(pathFor(next)); }}>{g.done ? 'Lanjutkan' : 'Mulai jalur ini'} →</button>
            : <Link className="btn primary" to="/sertifikat">Jalur selesai, ambil sertifikat →</Link>}
          {mine !== x.id ? <button className="btn ghost" onClick={choose}>Jadikan jalurku</button> : <span className="badge pro">Jalurku</span>}
        </div>
      </div>

      <ol className="pt-stages">
        {x.stages.map((s, si) => {
          const sd = s.items.filter(i => p.done.includes(i)).length;
          return (
            <li key={s.title} className={'pt-stage' + (sd === s.items.length ? ' done' : '')}>
              <div className="pt-sh"><span className="pt-n">{sd === s.items.length ? '✓' : si + 1}</span><h2>{s.title}</h2><span className="muted">{sd}/{s.items.length}</span></div>
              <ul className="pt-items">
                {s.items.map(i => { const it: Item = BY[i]; const ok = p.done.includes(i), lk = !isFreeItem(it) && !isPro;
                  const kind = it.kind === 'case' ? 'Studi kasus' : it.type === 'read' ? 'Baca + kuis' : 'Praktik';
                  return (
                    <li key={i}><Link to={pathFor(i)} className={(ok ? 'ok' : '') + (i === next ? ' next' : '')}>
                      <span className="pt-chk" aria-hidden="true">{ok ? '✓' : ''}</span>
                      <span className="pt-t">{it.title}</span>
                      <span className="pt-k">{kind}{it.kind === 'case' && it.ind ? ' · ' + it.ind : ''}</span>
                      {lk && <span className="badge">Pro</span>}{i === next && <span className="pt-nx">Berikutnya</span>}
                    </Link></li>);
                })}
              </ul>
            </li>);
        })}
      </ol>
      {x.drills && x.drills.length > 0 && (
        <section className="pt-after">
          <h2>Latihan bank soal untuk jalur ini</h2>
          <p>Datanya acak di setiap soal. Mau yang berat? Pilih Advanced atau Expert.</p>
          <div className="pt-drills">{x.drills.map(id => { const f = FOCUS.find(y => y.id === id); if (!f) return null; const c = focusCount(id);
            return <Link key={id} className="btn" to={'/soal?fokus=' + id}>{f.label} · {c.patterns} pola soal</Link>; })}
            <Link className="btn ghost" to="/kasus?sulit=1">Semua kasus sulit</Link></div>
        </section>
      )}
      <section className="pt-after">
        <h2>Setelah jalur ini</h2>
        <p>Perkuat dengan <Link to="/soal">Bank Soal</Link>, coba bebas di <Link to="/playground">Excel Playground</Link>, lalu ikuti <Link to="/sertifikat">ujian sertifikat</Link> dan lampirkan <Link to="/portofolio">portofolio</Link> di CV-mu.</p>
      </section>
    </div>
  );
}
