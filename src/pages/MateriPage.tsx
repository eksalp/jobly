import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BY, CASES, CERT, INDS, DRILL, LESSONS, MODULES, SCORED, certStats, drillLevelStats, isFreeItem, pathFor, type Item } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { ItemCard } from '../components/Cards';
import { useBank } from './bank-state';
import { matches } from '../lib/search';
import { modHasNew } from '../lib/whatsnew';

const KEY = 'kr.home.mod';
const MODS = MODULES.filter((m: Item) => !LESSONS.find((l: Item) => l.mod === m.id)?.sandbox);
const SANDBOX = LESSONS.find((l: Item) => l.sandbox);
// Nomor urut materi lintas modul (latihan bebas tidak dinomori)
const NUM: Record<string, string> = Object.fromEntries(SCORED.map((l: Item, i: number) => [l.id, String(i + 1).padStart(2, '0')]));

function useWide() {
  const q = '(min-width: 900px)';
  const [w, setW] = useState(() => typeof window === 'undefined' || window.matchMedia(q).matches);
  useEffect(() => { const m = window.matchMedia(q); const on = () => setW(m.matches); m.addEventListener('change', on); return () => m.removeEventListener('change', on); }, []);
  return w;
}
function readMod(): string | null { try { return localStorage.getItem(KEY); } catch { return null; } }
function saveMod(id: string) { try { localStorage.setItem(KEY, id); } catch { /* mode privat */ } }

export default function MateriPage() {
  const { p, isPro } = useProgress();
  const nav = useNavigate();
  const bank = useBank();
  const cur = p.current && BY[p.current];
  const first = SCORED.find((l: Item) => !p.done.includes(l.id) && (isFreeItem(l) || isPro)) || SCORED[0];
  const target = cur || first;
  const doneN = SCORED.filter((l: Item) => p.done.includes(l.id)).length;
  const started = !!cur || doneN > 0;

  const saved = readMod();
  const [open, setOpen] = useState<string>(() =>
    (saved && MODS.some((m: Item) => m.id === saved) ? saved : (target.kind === 'lesson' && MODS.some((m: Item) => m.id === target.mod) ? target.mod : MODS[0].id)));
  const pick = (id: string) => { setOpen(id); saveMod(id); };
  const [q, setQ] = useState('');
  const found = q.trim() ? LESSONS.filter((l: Item) => matches(q, l.title, l.fns || '', l.intro || '', l.body || '', l.solution || '', l.task || '')) : null;

  const mod = MODS.find((m: Item) => m.id === open) || MODS[0];
  const ls = LESSONS.filter((l: Item) => l.mod === mod.id);
  const modDone = ls.filter((l: Item) => p.done.includes(l.id)).length;
  const solved = Object.keys(p.drill).length;
  const wide = useWide();
  const nextIn = ls.find((l: Item) => !p.done.includes(l.id)) || ls[0];
  const panel = (
    <div className="kur-panel" id="mod-panel" role="tabpanel" aria-labelledby={'tab-' + mod.id}>
      <div className="kp-h">
        <div><p className="eyebrow">Modul {MODS.indexOf(mod) + 1}</p><h3>{mod.title}</h3><p>{mod.desc}</p></div>
        <div className="kp-act"><span className="muted">{modDone} dari {ls.length} selesai</span>{nextIn && <Link className="btn primary" to={pathFor(nextIn.id)}>{modDone ? 'Lanjutkan modul' : 'Mulai modul'}</Link>}</div>
      </div>
      <div className="lgrid">{ls.map((l: Item) => <ItemCard key={l.id} x={l} num={NUM[l.id]} />)}</div>
    </div>
  );

  return (
    <div className="wrap home">
      <section className="hm-head">
        <div>
          <h1>Semua materi</h1>
          <p className="hm-sub">
            <span><b>{SCORED.length}</b> materi</span>
            <span><b>{CASES.length}</b> studi kasus</span>
            <span><b>{DRILL.count.toLocaleString('id-ID')}</b> soal</span>
            <span>Rumus diperiksa otomatis</span>
          </p>
        </div>
        <Link className="hm-go" to={pathFor(target.id)}>
          <small>{started ? 'Lanjutkan belajar' : 'Mulai dari sini'}</small>
          <b>{target.title}</b>
          <span className="hm-go-p">
            <span className="meter" role="img" aria-label={`${doneN} dari ${SCORED.length} materi selesai`}><span style={{ width: (doneN / SCORED.length) * 100 + '%' }} /></span>
            <span className="muted">{doneN}/{SCORED.length}</span>
          </span>
          <span className="hm-go-btn" aria-hidden="true">→</span>
        </Link>
      </section>

      <input className="page-search" type="search" placeholder="Cari materi, misalnya VLOOKUP, tanggal, pivot, atau gaji" aria-label="Cari materi" value={q} onChange={e => setQ(e.target.value)} />
      {found && (
        <section className="hm-sec" aria-label="Hasil pencarian materi">
          <p className="muted" style={{ fontSize: 14, margin: '0 0 6px' }}>{found.length} materi cocok dengan "{q.trim()}"</p>
          {found.length ? <div className="lgrid">{found.map((l: Item) => <ItemCard key={l.id} x={l} num={NUM[l.id]} />)}</div> : <p className="empty-state">Tidak ketemu. Coba kata lain, atau pakai kotak Cari di atas.</p>}
        </section>
      )}
      {!found && <section className="hm-sec" aria-labelledby="kur-h">
        <div className="hm-sec-h">
          <h2 id="kur-h">Kurikulum</h2>
          <span className="muted">Modul 1–2 gratis{SANDBOX ? <> · <Link to={pathFor(SANDBOX.id)}>Latihan bebas</Link></> : null}</span>
        </div>
        <div className="kur">
          <div className="kur-list" role="tablist" aria-label="Pilih modul" aria-orientation="vertical">
            {MODS.map((m: Item, i: number) => {
              const ml = LESSONS.filter((l: Item) => l.mod === m.id);
              const d = ml.filter((l: Item) => p.done.includes(l.id)).length;
              const on = m.id === open;
              return (
                <div key={m.id} className="kur-item">
                  <button role="tab" id={'tab-' + m.id} aria-selected={on} aria-expanded={wide ? undefined : on} aria-controls="mod-panel"
                    className={'kur-mod' + (on ? ' on' : '') + (d === ml.length ? ' full' : '')} onClick={e => { pick(m.id); if (!wide) { const el = e.currentTarget; setTimeout(() => el.scrollIntoView({ block: 'start', behavior: 'smooth' }), 30); } }}>
                    <span className="km-n">{d === ml.length ? '✓' : String(i + 1).padStart(2, '0')}</span>
                    <span className="km-t"><b>{m.title}{modHasNew(ml.map((l: Item) => l.id)) && <i className="new">baru</i>}</b><small>{m.desc}</small></span>
                    <span className="km-r">{m.free ? <span className="badge">gratis</span> : !isPro ? <span className="badge">Pro</span> : null}<span className="km-c">{d}/{ml.length}</span></span>
                    <span className="km-bar" aria-hidden="true"><span style={{ width: (d / ml.length) * 100 + '%' }} /></span>
                  </button>
                  {!wide && on && panel}
                </div>
              );
            })}
          </div>
          {wide && panel}
        </div>
      </section>}

      <section className="hm-more" aria-label="Latihan lainnya">
        <div className="hm-card">
          <div className="hm-card-h"><h2>Bank soal</h2><Link to="/soal">Buka</Link></div>
          <p className="hm-big">{DRILL.count.toLocaleString('id-ID')}<small> soal praktik · {solved.toLocaleString('id-ID')} selesai</small></p>
          <div className="hm-lv">
            {DRILL.levels.map((lv: string) => {
              const s = drillLevelStats(lv, p.drill);
              return (
                <button key={lv} onClick={() => { bank.set({ lv, page: 0 }); nav('/soal'); }}>
                  <span>{lv}{lv === 'Expert' && <i className="new">baru</i>}</span>
                  <span className="muted">{s.n.toLocaleString('id-ID')}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="hm-card">
          <div className="hm-card-h"><h2>Studi kasus</h2><Link to="/kasus">Buka</Link></div>
          <p className="hm-big">{CASES.length}<small> kasus dari {INDS.length} bidang industri</small></p>
          <div className="divs">{INDS.map(d => <span key={d}>{d}</span>)}</div>
        </div>
        <div className="hm-card">
          <div className="hm-card-h"><h2>Sertifikasi MOS</h2></div>
          {['MO-210', 'MO-211'].map(ex => {
            const doms = CERT.filter((c: Item) => c.exam === ex);
            let n = 0, d = 0;
            doms.forEach((c: Item) => { const s = certStats(c.code, p.done); n += s.n; d += s.d; });
            const pct = n ? Math.round((d / n) * 100) : 0;
            return (
              <div className="hm-cert" key={ex}>
                <span><b>{ex}</b> <span className="muted">{ex === 'MO-210' ? 'Associate' : 'Expert'}</span></span>
                <span className="meter" role="img" aria-label={pct + '% selesai'}><span style={{ width: pct + '%' }} /></span>
                <span className="muted">{pct}%</span>
              </div>
            );
          })}
          <p className="muted hm-note">{CERT.length} domain ujian, dipetakan ke materi.</p>
        </div>
      </section>
    </div>
  );
}

