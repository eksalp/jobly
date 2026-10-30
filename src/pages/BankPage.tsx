import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FOCUS, focusCount, focusOf, focusValue, topicOk } from '../lib/drillfocus';
import { DRILL, drillLevelStats, type Item } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { useBank } from './bank-state';
import { matches } from '../lib/search';

const PER = 120;
/** Nama tingkat di kartu soal, sama dengan nama sertifikat. */
const LV_LABEL: Record<string, string> = { Dasar: 'Basic', Menengah: 'Intermediate', Advanced: 'Advanced', Expert: 'Expert' };

/** Cari soal berikutnya (atau acak) yang belum dikerjakan dan boleh diakses. */
export function findDrill(solved: Record<string, number>, isPro: boolean, opts: { from?: number; random?: boolean; lv?: string; tp?: string } = {}) {
  const pool: number[] = [];
  for (let i = 0; i < DRILL.count; i++) {
    const d = DRILL.at(i);
    if (opts.lv && d.t.level !== opts.lv) continue;
    if (opts.tp && !topicOk(d.t.topic, opts.tp)) continue;
    if (solved[d.id]) continue;
    if (d.t.level !== 'Dasar' && !isPro) continue;
    pool.push(i);
  }
  if (!pool.length) return null;
  if (opts.random) return DRILL.at(pool[Math.floor(Math.random() * pool.length)]).id as string;
  const nx = pool.find(i => i >= (opts.from || 0));
  return DRILL.at(nx != null ? nx : pool[0]).id as string;
}

export default function BankPage() {
  const { p, isPro } = useProgress();
  const { f, set } = useBank();
  const nav = useNavigate();
  const [note, setNote] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [sp] = useSearchParams();
  useEffect(() => { const fk = sp.get('fokus'); if (fk && FOCUS.some(x => x.id === fk)) set({ tp: focusValue(fk), lv: '', page: 0 }); }, [sp.get('fokus')]);
  const fc = focusOf(f.tp);
  const qKeys = useMemo(() => (q.trim() ? new Set(DRILL.templates.filter((t: Item) => matches(q, t.title, t.topic, t.level, t.key)).map((t: Item) => t.key)) : null), [q]);

  const idx = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < DRILL.count; i++) {
      const d = DRILL.at(i);
      if (f.lv && d.t.level !== f.lv) continue;
      if (f.tp && !topicOk(d.t.topic, f.tp)) continue;
      if (f.st && (f.st === 'sudah') !== !!p.drill[d.id]) continue;
      if (qKeys && !qKeys.has(d.t.key)) continue;
      out.push(i);
    }
    return out;
  }, [f.lv, f.tp, f.st, p.drill, qKeys]);
  const pages = Math.max(1, Math.ceil(idx.length / PER));
  const page = Math.min(f.page, pages - 1);
  const slice = idx.slice(page * PER, (page + 1) * PER);

  const go = (random: boolean) => {
    const id = findDrill(p.drill, isPro, { random, lv: f.lv, tp: f.tp });
    if (id) nav('/soal/' + id);
    else setNote(isPro ? 'Semua soal di filter ini sudah kamu selesaikan.' : 'Semua soal gratis di filter ini sudah selesai. Buka akses Pro untuk soal Menengah, Advanced, dan Expert.');
  };
  const firstOpen = (key: string) => { for (let k = 1; k <= DRILL.seeds; k++) if (!p.drill['soal-' + key + '-' + k]) return k; return 1; };
  const win: number[] = []; for (let q = 0; q < pages; q++) if (q < 2 || q > pages - 3 || Math.abs(q - page) <= 2) win.push(q);

  return (
    <div className="wrap page">
      <div className="page-head"><h1>Bank soal praktik</h1>
        <p>{DRILL.count.toLocaleString('id-ID')} soal pengerjaan langsung di lembar kerja, tanpa soal teori. Ada {DRILL.templates.length} pola soal, masing-masing dengan {DRILL.seeds} versi data yang berbeda: nama, angka, kriteria, dan sel jawabannya ikut berubah, jadi kamu tidak bisa menghafal jawaban. Jawaban diperiksa dari hasil rumusmu.</p></div>

      <div className="bk-levels">
        {DRILL.levels.map((lv: string) => {
          const s = drillLevelStats(lv, p.drill);
          return (
            <button key={lv} className={'bk-lv' + (f.lv === lv ? ' on' : '')} onClick={() => set({ lv: f.lv === lv ? '' : lv, page: 0 })}>
              <span className="bk-lv-h"><b>{lv}</b>{lv === 'Dasar' ? <span className="badge">gratis</span> : !isPro && <span className="badge">Pro</span>}</span>
              <span className="big">{s.d.toLocaleString('id-ID')}<small> / {s.n.toLocaleString('id-ID')}</small></span>
              <span className="meter"><span style={{ width: (s.n ? (s.d / s.n) * 100 : 0) + '%' }} /></span>
              <small className="muted">{DRILL.templates.filter((t: Item) => t.level === lv).length} pola soal{lv === 'Expert' ? ' · gabungan beberapa rumus' : ''}</small>
            </button>
          );
        })}
      </div>

      <div className="bk-focus" role="group" aria-label="Fokus profesi">
        <span className="bk-focus-l">Fokus profesi</span>
        {FOCUS.map(x => { const c = focusCount(x.id), on = f.tp === focusValue(x.id);
          return <button key={x.id} className="chip" aria-pressed={on} onClick={() => set({ tp: on ? '' : focusValue(x.id), page: 0 })}>{x.label}<span className="chip-n">{c.patterns} pola</span></button>; })}
      </div>
      {fc && <p className="muted bk-focus-note">Fokus <b>{fc.label}</b>: topik {fc.topics.join(', ')}. Pilih level Advanced atau Expert untuk soal yang paling menantang.</p>}

      <div className="bk-bar">
        <div className="filters" style={{ margin: 0 }}>
          <input className="search bk-q" type="search" placeholder="Cari soal: diskon, VLOOKUP, gaji…" aria-label="Cari pola soal" value={q} onChange={e => { setQ(e.target.value); set({ page: 0 }); }} />
          <label className="sr" htmlFor="bk-tp">Topik</label>
          <select id="bk-tp" className="pv-sel" value={f.tp} onChange={e => set({ tp: e.target.value, page: 0 })}>
            <option value="">Semua topik</option>{FOCUS.map(x => <option key={x.id} value={focusValue(x.id)}>Fokus: {x.label}</option>)}{DRILL.topics.map((t: string) => <option key={t}>{t}</option>)}
          </select>
          <label className="sr" htmlFor="bk-st">Status</label>
          <select id="bk-st" className="pv-sel" value={f.st} onChange={e => set({ st: e.target.value as any, page: 0 })}>
            <option value="">Semua status</option><option value="belum">Belum dikerjakan</option><option value="sudah">Sudah benar</option>
          </select>
          {f.lv && <button className="chip" onClick={() => set({ lv: '', page: 0 })}>Semua level ×</button>}
        </div>
        <div className="cta"><button className="btn primary" onClick={() => go(false)}>Kerjakan soal berikutnya</button><button className="btn" onClick={() => go(true)}>Soal acak</button></div>
      </div>
      <p className="muted" style={{ fontSize: 13.5, margin: '6px 0 10px' }} role="status">{note || `${idx.length.toLocaleString('id-ID')} soal cocok dengan filter · halaman ${page + 1} dari ${pages}`}</p>

      <div className="bk-grid">
        {slice.length ? slice.map(i => {
          const d = DRILL.at(i), ok = !!p.drill[d.id], lk = d.t.level !== 'Dasar' && !isPro;
          return <Link key={d.id} className={'dt' + (ok ? ' ok' : '') + (lk ? ' lk' : '')} to={'/soal/' + d.id}
            title={`Soal ${d.num} · ${d.t.title} · ${LV_LABEL[d.t.level] || d.t.level}${ok ? ' · sudah benar' : ' · belum dikerjakan'}${lk ? ' · Pro' : ''}`}>
            <span className="dt-h"><b>{d.num}</b><span className="dt-lv">{ok ? '✓ ' : ''}{LV_LABEL[d.t.level] || d.t.level}</span></span>
            <span className="dt-t">{d.t.title}</span>
            <span className="dt-f"><span>{d.t.topic}</span>{lk && <span className="dt-pro">Pro</span>}</span>
          </Link>;
        }) : <p className="empty-state">Tidak ada soal yang cocok. Ubah filter di atas.</p>}
      </div>
      {pages > 1 && (
        <nav className="bk-pages" aria-label="Halaman soal">
          <button className="btn sm ghost" disabled={page === 0} onClick={() => set({ page: page - 1 })}>← Sebelumnya</button>
          {win.map((q, i) => (
            <span key={q} style={{ display: 'contents' }}>
              {i > 0 && q - win[i - 1] > 1 && <span className="muted">…</span>}
              <button className={'btn sm ' + (q === page ? 'primary' : 'ghost')} aria-current={q === page} onClick={() => set({ page: q })}>{q + 1}</button>
            </span>
          ))}
          <button className="btn sm ghost" disabled={page >= pages - 1} onClick={() => set({ page: page + 1 })}>Berikutnya →</button>
        </nav>
      )}

      <section className="section" aria-labelledby="bk-pola"><h2 id="bk-pola">Daftar pola soal</h2>
        <p className="muted" style={{ fontSize: 14, margin: '4px 0 12px' }}>Buka tingkat untuk melihat polanya. Klik pola untuk langsung mengerjakan versi pertama yang belum kamu selesaikan.</p>
        <div className="bk-pola">
          {DRILL.levels.map((lv: string) => {
            const ts = DRILL.templates.filter((t: Item) => t.level === lv);
            const topics = [...new Set<string>(ts.map((t: Item) => t.topic))];
            let doneLv = 0;
            const rows: { t: Item; d: number }[] = ts.map((t: Item) => { let d = 0; for (let k = 1; k <= DRILL.seeds; k++) if (p.drill['soal-' + t.key + '-' + k]) d++; doneLv += d; return { t, d }; });
            return (
              <details key={lv} className="bk-dd">
                <summary><b>{lv}</b><span className="muted">{ts.length} pola · {doneLv.toLocaleString('id-ID')}/{(ts.length * DRILL.seeds).toLocaleString('id-ID')} selesai</span></summary>
                {topics.map(tp => (
                  <div key={tp} className="bk-dd-g"><p>{tp}</p><ul>
                    {rows.filter(x => x.t.topic === tp).map(({ t, d }) => (
                      <li key={t.key}><Link to={`/soal/soal-${t.key}-${firstOpen(t.key)}`}>{t.title}</Link><span className="muted">{d}/{DRILL.seeds}</span></li>
                    ))}
                  </ul></div>
                ))}
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
