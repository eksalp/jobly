import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BY, CASES, CERT, DRILL, LESSONS, MODULES, PRICE, SCORED, certStats, drillLevelStats, INDS, indOf, isFreeItem, pathFor, type Item } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { useAuth } from '../lib/auth';
import { supabase, hasSupabase } from '../lib/supabase';
import { useBuy } from '../components/Buy';
import { dkey, fmtDate, fmtUntil, isLifetime, rp } from '../lib/format';
import { findDrill } from './BankPage';
import { DailyGoal } from '../components/DailyGoal';
import { currentStreak } from '../lib/streak';
import { JOB_TESTS } from '../content/jobtests.js';

function Ring({ pct }: { pct: number }) {
  const r = 40, c = 2 * Math.PI * r;
  return <svg viewBox="0 0 96 96" className="ring" role="img" aria-label={pct + '% selesai'}>
    <circle cx="48" cy="48" r={r} className="bg" /><circle cx="48" cy="48" r={r} className="fg" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
    <text x="48" y="55" textAnchor="middle">{pct}%</text></svg>;
}
function Heat({ activity }: { activity: Record<string, number> }) {
  const weeks = 18, end = new Date(); end.setHours(0, 0, 0, 0);
  const first = new Date(end); first.setDate(end.getDate() - ((end.getDay() + 6) % 7) - (weeks - 1) * 7);
  return <div className="heat" role="img" aria-label="Aktivitas belajar 18 minggu terakhir">
    {Array.from({ length: weeks * 7 }, (_, i) => {
      const d = new Date(first); d.setDate(first.getDate() + i);
      if (d > end) return <i key={i} style={{ visibility: 'hidden' }} />;
      const v = activity[dkey(d)] || 0;
      return <i key={i} className={v >= 6 ? 'l3' : v >= 3 ? 'l2' : v > 0 ? 'l1' : ''} title={`${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}: ${v} aktivitas`} />;
    })}
  </div>;
}
function sumDays(activity: Record<string, number>, days: number) {
  let n = 0; const d = new Date();
  for (let i = 0; i < days; i++) { n += activity[dkey(d)] || 0; d.setDate(d.getDate() - 1); }
  return n;
}
/** Judul untuk riwayat: materi/kasus dari katalog, soal dari bank soal */
function recentLabel(id: string): { title: string; to: string } | null {
  if (BY[id]) return { title: BY[id].title, to: pathFor(id) };
  const i = DRILL.indexOf(id);
  if (i >= 0) { const d = DRILL.at(i); return { title: `Soal #${(i + 1).toLocaleString('id-ID')} · ${d.t.title}`, to: pathFor(id) }; }
  if (id.startsWith('tes-')) { const t = JOB_TESTS.find(x => 'tes-' + x.id === id); return t ? { title: 'Simulasi tes ' + t.title, to: '/tes-kerja' } : null; }
  if (id.startsWith('shortcut-')) return { title: 'Latihan shortcut', to: '/shortcut/latihan' };
  return null;
}

type Order = { order_id: string; amount: number; status: string; created_at: string; paid_at: string | null };

export default function DashboardPage() {
  const pr = useProgress();
  const { p, isPro, proUntil } = pr;
  const { user, profile, signOut } = useAuth();
  const { buy, toast } = useBuy();
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const [confirm, setConfirm] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => { if (location.hash === '#target') setTimeout(() => document.getElementById('target')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }, []);
  useEffect(() => {
    if (sp.get('bayar') === 'selesai') {
      toast('Terima kasih. Status pembayaranmu sedang dicek.');
      pr.refreshPlan(); setSp({}, { replace: true });
    }
  }, []);
  useEffect(() => {
    if (!supabase || !user) return;
    supabase.from('orders').select('order_id, amount, status, created_at, paid_at').order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => setOrders((data as Order[]) || []));
  }, [user?.id, isPro]);

  const doneL = p.done.filter(id => BY[id]?.kind === 'lesson' && !BY[id].sandbox).length;
  const doneC = p.done.filter(id => BY[id]?.kind === 'case').length;
  const total = SCORED.length + CASES.length, pct = Math.round(((doneL + doneC) / total) * 100);
  const daysLeft = isPro ? Math.ceil((proUntil! - Date.now()) / 864e5) : 0;
  const expired = !!proUntil && !isPro;
  const cur = p.current && BY[p.current];
  const next = [...SCORED, ...CASES].find((x: Item) => !p.done.includes(x.id) && (isFreeItem(x) || isPro));
  const name = profile?.full_name || '';
  const recent = p.recent.map(r => ({ ...r, x: recentLabel(r.id) })).filter(r => r.x).slice(0, 6);
  const today = sumDays(p.activity, 1), week = sumDays(p.activity, 7), allAct = Object.values(p.activity).reduce((a, b) => a + b, 0);
  const doneDiv = new Set(CASES.filter((c: Item) => p.done.includes(c.id)).map(indOf));
  const initial = ((name || user?.email || 'K').trim()[0] || 'K').toUpperCase();

  return (
    <div className="wrap page">
      <div className="dash-head">
        <div className="dash-id"><span className="avatar">{profile?.avatar_url ? <img src={profile.avatar_url} alt="" referrerPolicy="no-referrer" /> : initial}</span>
          <div><h1>{name ? 'Halo, ' + name.split(' ')[0] : 'Dashboard belajar'}</h1>
            <p>{isPro ? `Akses Pro aktif ${fmtUntil(proUntil!)}` : expired ? 'Akses Pro sudah berakhir' : 'Paket Gratis'} · belajar sejak {fmtDate(p.since)}{user?.email ? ' · ' + user.email : ''}</p></div></div>
        <div className="cta">{cur ? <Link className="btn primary" to={pathFor(cur.id)}>Lanjutkan: {cur.title}</Link> : next ? <Link className="btn primary" to={pathFor(next.id)}>Mulai: {next.title}</Link> : null}</div>
      </div>

      <div className="dash-grid">
        <section className="card c4" aria-labelledby="d-prog"><h2 id="d-prog">Progres keseluruhan</h2>
          <div className="kv"><Ring pct={pct} /><dl><dt>Materi</dt><dd>{doneL}/{SCORED.length}</dd><dt>Studi kasus</dt><dd>{doneC}/{CASES.length}</dd><dt>Soal bank</dt><dd>{Object.keys(p.drill).length.toLocaleString('id-ID')}</dd></dl></div></section>
        <section className="card c4" aria-labelledby="d-plan"><h2 id="d-plan">Akses</h2>
          {isPro ? <>
            {isLifetime(proUntil) ? <>
              <div className="big">Pro <small>lifetime</small></div>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>Semua materi, bank soal, latihan Pro, dan grup Telegram terbuka selamanya.</p>
              <Link className="btn sm" to="/pro">Buka latihan Pro</Link>
            </> : <>
              <div className="big">{daysLeft} <small>hari tersisa</small></div>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>Pro berakhir {fmtDate(proUntil!)}</p>
              <button className="btn sm" onClick={buy}>Ganti ke Pro lifetime</button>
            </>}
            {!hasSupabase && <div className="confirm-row"><button className="btn sm ghost" onClick={pr.demoDeactivate}>Kembalikan ke Gratis (demo)</button></div>}
          </> : <>
            <div className="big">Gratis</div>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>{expired ? 'Akses Pro sudah berakhir. Progresmu tetap tersimpan.' : 'Sekali bayar, semua materi, bank soal, latihan Pro, dan grup Telegram terbuka selamanya.'}</p>
            <button className="btn primary" onClick={buy}>{expired ? 'Aktifkan lagi' : 'Buka akses Pro'} · {rp(PRICE.pro)}</button>
          </>}</section>
        <section className="card c4" aria-labelledby="d-act"><h2 id="d-act">Aktivitas belajar</h2>
          <div className="big">{currentStreak(p.activity)} <small>hari beruntun</small></div>
          <dl className="act-nums"><div><dt>Hari ini</dt><dd>{today}</dd></div><div><dt>7 hari</dt><dd>{week}</dd></div><div><dt>Total</dt><dd>{allAct.toLocaleString('id-ID')}</dd></div></dl>
          <Heat activity={p.activity} />
          <div className="heat-legend">Sedikit <i style={{ background: 'var(--line)' }} /><i style={{ background: 'color-mix(in srgb,var(--accent) 35%,var(--surface))' }} /><i style={{ background: 'color-mix(in srgb,var(--accent) 65%,var(--surface))' }} /><i style={{ background: 'var(--accent)' }} /> Banyak</div>
          <p className="act-help">Setiap materi, studi kasus, atau soal yang <b>berhasil kamu selesaikan</b> dihitung 1 aktivitas. Satu kotak = satu hari (18 minggu terakhir); makin hijau, makin banyak yang selesai hari itu. Hari beruntun bertambah kalau kamu menyelesaikan minimal 1 hal setiap hari.</p></section>

        <DailyGoal />

        <section className="card c12" aria-labelledby="d-bank"><h2 id="d-bank">Bank soal praktik</h2>
          <div>{DRILL.levels.map((lv: string) => { const s = drillLevelStats(lv, p.drill); return <div className="mrow" key={lv} style={{ gridTemplateColumns: '90px minmax(0,1fr) 110px' }}><span>{lv}</span><div className="meter"><span style={{ width: (s.n ? (s.d / s.n) * 100 : 0) + '%' }} /></div><span>{s.d.toLocaleString('id-ID')} / {s.n.toLocaleString('id-ID')}</span></div>; })}</div>
          <div className="cta"><Link className="btn primary" to="/soal">Buka bank soal</Link><button className="btn" onClick={() => { const id = findDrill(p.drill, isPro); if (id) nav('/soal/' + id); }}>Kerjakan soal berikutnya</button></div></section>

        <section className="card c7" aria-labelledby="d-mod"><h2 id="d-mod">Progres per modul</h2>
          {MODULES.filter((m: Item) => m.id !== 'latihan').map((m: Item) => {
            const ls = LESSONS.filter((l: Item) => l.mod === m.id), d = ls.filter((l: Item) => p.done.includes(l.id)).length;
            return <div className="mrow" key={m.id}><Link to={pathFor(ls[0].id)} style={{ color: 'var(--ink)', textDecoration: 'none' }}>{m.title}{!m.free && !isPro && <span className="muted"> · Pro</span>}</Link><div className="meter"><span style={{ width: (d / ls.length) * 100 + '%' }} /></div><span>{d}/{ls.length}</span></div>;
          })}
          <div className="mrow"><Link to="/kasus" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Studi kasus kantor</Link><div className="meter"><span style={{ width: (doneC / CASES.length) * 100 + '%' }} /></div><span>{doneC}/{CASES.length}</span></div></section>
        <section className="card c5" aria-labelledby="d-cert"><h2 id="d-cert">Kesiapan sertifikasi</h2>
          {['MO-210', 'MO-211'].map(ex => <div key={ex}><p className="muted" style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 500 }}>{ex === 'MO-210' ? 'Excel Associate · MO-210' : 'Excel Expert · MO-211'}</p>
            {CERT.filter((c: Item) => c.exam === ex).map((c: Item) => { const s = certStats(c.code, p.done); return <div className="mrow" key={c.code}><span>{c.title}</span><div className="meter"><span style={{ width: s.pct + '%' }} /></div><span>{s.pct}%</span></div>; })}</div>)}</section>

        <section className="card c7" aria-labelledby="d-rec"><h2 id="d-rec">Riwayat terbaru</h2>
          {recent.length ? <ul className="recent">{recent.map(r => { const x = r.x!; return <li key={r.id + r.t}><span><Link to={x.to}>{x.title}</Link> <span className="muted">· {r.what === 'soal' ? 'soal benar' : r.what}</span></span><time dateTime={new Date(r.t).toISOString()}>{new Date(r.t).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time></li>; })}</ul>
            : <><p className="muted" style={{ margin: 0 }}>Belum ada apa-apa di sini. Selesaikan satu soal dulu, nanti muncul.</p><Link className="btn" to="/materi/rumus-pertama">Buka materi pertama</Link></>}</section>
        <section className="card c5" aria-labelledby="d-div"><h2 id="d-div">Industri yang sudah kamu jelajahi</h2>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>Industri ditandai hijau setelah minimal satu studi kasusnya selesai.</p>
          <div className="divs">{INDS.map(d => <span key={d} className={doneDiv.has(d) ? 'on' : ''}>{d}</span>)}</div></section>

        <section className="card c12" aria-labelledby="d-set"><h2 id="d-set">Akun dan data</h2>
          <p className="storage"><i className={pr.sync === 'akun' ? '' : 'local'} />{pr.sync === 'akun' ? 'Progres tersimpan di akunmu dan ikut terbawa ke perangkat lain.' : pr.sync === 'memuat' ? 'Menyinkronkan progres dengan akunmu…' : hasSupabase ? 'Progresmu baru tersimpan di browser ini. Masuk supaya tidak hilang.' : 'Mode lokal: progres tersimpan di browser ini (Supabase belum dikonfigurasi).'}</p>
          {orders.length > 0 && <><h3 style={{ margin: '4px 0 0' }}>Riwayat aktivasi Pro</h3><ul className="order-list">{orders.map(o => <li key={o.order_id}><span><code>{o.order_id}</code> · {rp(o.amount)}</span><span className="muted">{({ paid: 'Aktif', pending: 'Menunggu pembayaran', failed: 'Gagal', expired: 'Kedaluwarsa', refunded: 'Dikembalikan' } as any)[o.status] || o.status} · {fmtDate(o.paid_at || o.created_at)}</span></li>)}</ul></>}
          <div className="confirm-row">
            {confirm ? <><span>Semua progres dan isianmu akan hilang. Paket Pro-mu tetap aman.</span><button className="btn sm" onClick={async () => { await pr.reset(); setConfirm(false); toast('Progres sudah dihapus.'); }}>Ya, hapus</button><button className="btn sm ghost" onClick={() => setConfirm(false)}>Batal</button></>
              : <button className="btn sm" onClick={() => setConfirm(true)}>Hapus semua progres</button>}
            {user ? <button className="btn sm ghost" onClick={async () => { await signOut(); nav('/'); }}>Keluar</button> : hasSupabase ? <Link className="btn sm primary" to="/masuk?next=/dashboard">Masuk</Link> : null}
          </div></section>
      </div>
    </div>
  );
}
