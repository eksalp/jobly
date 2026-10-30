// Template Excel siap pakai. Daftar diambil dari tabel "templates" di Supabase, file dari bucket privat "templates".
// File Pro hanya bisa diunduh member Pro (dicek oleh kebijakan Storage di database, bukan hanya di tampilan).
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useProgress } from '../lib/progress';
import { matches } from '../lib/search';

type Tpl = { slug: string; title: string; category: string; description: string; file_path: string; preview_url: string | null; tags: string[]; free: boolean; sort: number };

/** Contoh tampilan untuk mode lokal (tanpa Supabase). File-nya tidak ada. */
const SAMPLE: Tpl[] = [
  { slug: 'contoh-dashboard', title: 'Dashboard penjualan bulanan', category: 'Dashboard', description: 'Contoh kartu template. Isi daftar asli lewat tabel templates di Supabase.', file_path: '', preview_url: null, tags: ['PivotTable', 'grafik'], free: false, sort: 1 },
  { slug: 'contoh-absensi', title: 'Absensi & rekap lembur', category: 'HRD', description: 'Contoh kartu template gratis.', file_path: '', preview_url: null, tags: ['NETWORKDAYS'], free: true, sort: 2 },
];
const CAT_IC: Record<string, string> = {
  Dashboard: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z', KPI: 'M4 19h16M6 15l4-4 3 3 5-6M18 8h-3', HRD: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 19c.8-3 3-4.5 6-4.5s5.2 1.5 6 4.5M16 11a2.5 2.5 0 1 0 0-5M17 14.5c2 .4 3.4 1.8 4 4.5',
  Keuangan: 'M5 19V9M10 19V5M15 19v-7M20 19v-4M3 19h18', Penjualan: 'M4 7h16l-1.5 9h-13zM8 7l1-3h6l1 3M9 20h.01M16 20h.01', Gudang: 'M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8',
  Proyek: 'M4 6h10M4 12h16M4 18h7M16 4v4M8 10v4', SDM: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 19c.8-3 3-4.5 6-4.5s5.2 1.5 6 4.5M16 11a2.5 2.5 0 1 0 0-5M17 14.5c2 .4 3.4 1.8 4 4.5',
  Pajak: 'M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h3', Payroll: 'M3 7h18v10H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 10v4M18 10v4', Akuntansi: 'M5 3h14v18H5zM8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h6', Pendidikan: 'M3 9l9-5 9 5-9 5zM7 11v5c3 2 7 2 10 0v-5', Pribadi: 'M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z', UMKM: 'M4 9l1.5-5h13L20 9M4 9h16v10H4z',
};

export default function TemplatesPage() {
  const { user } = useAuth();
  const { isPro } = useProgress();
  const [list, setList] = useState<Tpl[] | null>(supabase ? null : SAMPLE);
  const [err, setErr] = useState('');
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.from('templates').select('slug, title, category, description, file_path, preview_url, tags, free, sort').order('sort').order('title')
      .then(({ data, error }) => { if (error) { setErr('Daftar template belum bisa dimuat.'); setList([]); } else setList((data as Tpl[]) || []); });
  }, []);
  const cats = useMemo(() => [...new Set((list || []).map(t => t.category))].sort((a, b) => a.localeCompare(b, 'id')), [list]);
  const shown = (list || []).filter(t => (!cat || t.category === cat) && (!q.trim() || matches(q, t.title, t.category, t.description, ...(t.tags || []))));

  const download = async (t: Tpl) => {
    setErr('');
    if (!supabase || !t.file_path) { setErr('Ini contoh tampilan. File template asli tersedia setelah diunggah di Supabase.'); return; }
    setBusy(t.slug);
    const { data, error } = await supabase.storage.from('templates').createSignedUrl(t.file_path, 120, { download: true });
    setBusy('');
    if (error || !data?.signedUrl) { setErr(!t.free && !isPro ? 'Template ini khusus member Pro.' : 'File belum bisa diunduh. Coba lagi sebentar lagi.'); return; }
    window.location.assign(data.signedUrl);
  };

  return (
    <div className="wrap page">
      <div className="page-head"><p className="eyebrow">Siap pakai</p><h1>Template Excel</h1>
        <p>Template kerja yang tinggal diisi, dikelompokkan per bidang: keuangan, akuntansi, pajak, SDM, payroll, dashboard, dan lainnya. Semua rumusnya asli dan bisa dipelajari, jadi sekalian latihan membaca cara kerjanya.</p></div>
      {!supabase && <p className="demo-note">Mode lokal: yang tampil hanya contoh kartu. Daftar asli diambil dari Supabase.</p>}

      {list && list.length > 0 && <>
        <input className="page-search" type="search" placeholder="Cari template, misalnya absensi, KPI, stok" aria-label="Cari template" value={q} onChange={e => setQ(e.target.value)} />
        <div className="filters">{['', ...cats].map(c => <button key={c || 'all'} className="chip" aria-pressed={cat === c} onClick={() => setCat(cat === c ? '' : c)}>{c || 'Semua'}</button>)}</div>
      </>}
      {err && <p className="buy-err" role="alert">{err} {!isPro && /Pro/.test(err) && <Link to="/harga">Lihat paket Pro</Link>}</p>}

      {list === null ? <p className="muted">Memuat template…</p>
        : list.length === 0 ? (
          <div className="tp-empty"><h2>Template sedang disiapkan</h2><p>Koleksi template siap pakai segera hadir di sini. Sambil menunggu, coba <Link to="/playground">Excel Playground</Link> atau <Link to="/kasus">studi kasus</Link>.</p></div>
        ) : (
          <div className="tp-grid">
            {shown.map(t => { const locked = !t.free && !isPro; return (
              <article key={t.slug} className="tp-card">
                <div className="tp-vis">{t.preview_url ? <img src={t.preview_url} alt="" loading="lazy" /> :
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={CAT_IC[t.category] || CAT_IC.Dashboard} /></svg>}</div>
                <div className="tp-body">
                  <p className="lc-meta">{t.category}{t.free ? <span className="badge">Gratis</span> : <span className="badge pro">Pro</span>}</p>
                  <h3>{t.title}</h3>
                  {t.description && <p className="tp-desc">{t.description}</p>}
                  {t.tags?.length > 0 && <p className="fn-chips">{t.tags.map(g => <span key={g}>{g}</span>)}</p>}
                </div>
                <div className="tp-foot">
                  {locked ? <Link className="btn sm" to={user ? '/harga' : '/masuk?next=/template'}>{user ? 'Buka dengan Pro' : 'Masuk untuk unduh'}</Link>
                    : <button className="btn sm primary dl" disabled={busy === t.slug} onClick={() => download(t)}>
                      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {busy === t.slug ? 'Menyiapkan…' : 'Unduh .xlsx'}</button>}
                </div>
              </article>); })}
            {!shown.length && <p className="empty-state">Tidak ada template yang cocok.</p>}
          </div>
        )}
    </div>
  );
}
