// Papan peringkat: poin dari materi, studi kasus, soal bank, dan ujian yang lulus.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useProgress } from '../lib/progress';
import { hasSupabase } from '../lib/supabase';
import { POINTS, demoBoard, fetchBoard, getHidden, localPoints, setHidden, type Period, type RankRow } from '../lib/rank';

const PERIODS: { id: Period; label: string }[] = [{ id: 'minggu', label: 'Minggu ini' }, { id: 'bulan', label: 'Bulan ini' }, { id: 'semua', label: 'Sepanjang waktu' }];
const n = (x: number) => x.toLocaleString('id-ID');

export default function RankPage() {
  const { user } = useAuth();
  const { p } = useProgress();
  const [period, setPeriod] = useState<Period>('minggu');
  const [rows, setRows] = useState<RankRow[] | null>(null);
  const [err, setErr] = useState('');
  const [hidden, setHid] = useState(false);
  const mine = localPoints(p);

  useEffect(() => { document.title = 'Peringkat · Jagoan Excel'; }, []);
  useEffect(() => {
    setErr('');
    if (!hasSupabase) { setRows(demoBoard(mine)); return; }
    if (!user) { setRows([]); return; }
    setRows(null);
    fetchBoard(period).then(setRows).catch(e => { setErr(e.message); setRows([]); });
  }, [period, user?.id]);
  useEffect(() => { if (user) getHidden(user.id).then(setHid); }, [user?.id]);

  const toggle = async () => { const v = !hidden; try { await setHidden(v); setHid(v); fetchBoard(period).then(setRows).catch(() => {}); } catch (e) { setErr((e as Error).message); } };
  const me = rows?.find(r => r.is_me);
  const top = (rows || []).filter(r => r.pos <= 50);
  const meOutside = me && me.pos > 50;

  return (
    <div className="wrap page rk">
      <div className="page-head"><p className="eyebrow">Peringkat</p><h1>Papan peringkat Jagoan Excel</h1>
        <p>Kumpulkan poin dari setiap materi, studi kasus, dan soal yang berhasil kamu selesaikan. Peringkat mingguan direset setiap Senin, jadi semua orang selalu punya kesempatan naik ke atas.</p></div>

      <div className="rk-top">
        <div className="filters" role="tablist" aria-label="Periode">
          {PERIODS.map(x => <button key={x.id} role="tab" className="chip" aria-selected={period === x.id} aria-pressed={period === x.id} onClick={() => setPeriod(x.id)}>{x.label}</button>)}
        </div>
        {me && <div className="rk-me-sum"><span>Posisimu</span><b>#{n(me.pos)}</b><span>{n(me.points)} poin</span></div>}
      </div>

      {hasSupabase && !user ? (
        <div className="rk-login"><p><b>Masuk untuk ikut peringkat.</b> Poin dihitung dari progres yang tersimpan di akunmu.</p><Link className="btn primary" to="/masuk?next=/peringkat">Masuk</Link></div>
      ) : rows === null ? <p className="muted">Memuat peringkat…</p> : (
        <>
          {err && <p className="buy-err" role="alert">{err}</p>}
          {!rows.length && !err && <p className="empty-state">Belum ada yang mengumpulkan poin {period === 'minggu' ? 'minggu ini' : period === 'bulan' ? 'bulan ini' : ''}. Jadilah yang pertama: <Link to="/soal">kerjakan satu soal</Link>.</p>}
          {rows.length > 0 && (
            <ol className="rk-list">
              {top.map(r => <Row key={r.pos + r.name} r={r} />)}
              {meOutside && <><li className="rk-gap" aria-hidden="true">⋯</li><Row r={me!} /></>}
            </ol>
          )}
          {!hasSupabase && <p className="demo-note">Mode lokal: nama lain di atas hanya contoh. Peringkat asli diambil dari akun pengguna di Supabase.</p>}
        </>
      )}

      <div className="rk-info">
        <section>
          <h2>Cara mendapat poin</h2>
          <table className="rk-pts"><tbody>
            <tr><td>Materi selesai</td><td>{POINTS.lesson}</td></tr>
            <tr><td>Studi kasus selesai</td><td>{POINTS.case}</td></tr>
            <tr><td>Soal bank: Basic / Intermediate / Advanced / Expert</td><td>{Object.values(POINTS.drill).join(' / ')}</td></tr>
            <tr><td>Lulus ujian sertifikat (sekali per tingkat)</td><td>{Object.values(POINTS.exam).join(' / ')}</td></tr>
          </tbody></table>
          <p className="muted">Setiap item hanya dihitung sekali. Poinmu di perangkat ini: <b>{n(mine.points)}</b> ({mine.lessons} materi, {mine.cases} kasus, {n(mine.drills)} soal).</p>
        </section>
        {user && <section>
          <h2>Privasi</h2>
          <p>Di peringkat, namamu ditampilkan singkat (nama depan + inisial), tanpa email atau foto.</p>
          <label className="rk-hide"><input type="checkbox" checked={hidden} onChange={toggle} /> Sembunyikan namaku dari peringkat</label>
          <p className="muted" style={{ fontSize: 13 }}>Kalau disembunyikan, orang lain tidak melihatmu, tapi kamu tetap bisa melihat posisimu sendiri.</p>
        </section>}
      </div>
    </div>
  );
}

function Row({ r }: { r: RankRow }) {
  return (
    <li className={'rk-row' + (r.is_me ? ' me' : '') + (r.pos <= 3 ? ' podium' : '')}>
      <span className="rk-pos">{r.pos <= 3 ? <span className={'rk-top rk-top' + r.pos} aria-label={'Peringkat ' + r.pos}>{r.pos}</span> : '#' + r.pos}</span>
      <span className="avatar">{r.initial}</span>
      <span className="rk-name"><b>{r.name}{r.is_me && ' (kamu)'}</b>{r.is_pro && <span className="badge pro">Pro</span>}
        <small>{r.lessons} materi · {r.cases} kasus · {n(r.drills)} soal{r.exams ? ` · ${r.exams} sertifikat` : ''}</small></span>
      <span className="rk-pts-v"><b>{n(r.points)}</b> poin</span>
    </li>
  );
}
