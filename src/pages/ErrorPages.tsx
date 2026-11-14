// Kamus error Excel: daftar error dan halaman penjelasan per error (arti, penyebab, cara memperbaiki, contoh).
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ERRORS } from '../content/errors.js';
import { Html } from '../components/Html';
import { FN_BY, fnPath } from '../lib/fnhelp';
import { matches } from '../lib/search';
import { plain, setMeta } from '../lib/meta';
import NotFound from './NotFound';

export function ErrorListPage() {
  const [q, setQ] = useState('');
  useEffect(() => { setMeta('Arti Error Excel (#N/A, #VALUE!, #REF!, #DIV/0!) dan Cara Memperbaikinya · Jagoan Excel', 'Kamus error Excel lengkap: arti #N/A, #VALUE!, #REF!, #DIV/0!, #NAME?, #SPILL!, ####, dan masalah lain, beserta penyebab dan cara memperbaikinya.', '/error'); }, []);
  const list = ERRORS.filter(e => !q.trim() || matches(q, e.code, e.title, plain(e.short, 500)));
  return (
    <div className="wrap page er">
      <div className="page-head"><p className="eyebrow">Kamus error</p><h1>Arti error Excel & cara memperbaikinya</h1>
        <p>Rumusmu tiba-tiba #N/A atau #VALUE!? Pilih error-nya, nanti kelihatan penyebab dan cara membereskannya.</p></div>
      <input className="page-search" type="search" placeholder="Cari error, misalnya #N/A atau teks" aria-label="Cari error" value={q} onChange={e => setQ(e.target.value)} />
      <div className="er-grid">{list.map(e => (
        <Link key={e.slug} to={'/error/' + e.slug} className="er-card">
          <code className="er-code">{e.code}</code><b>{e.title}</b><Html as="span" className="muted" html={e.short} />
        </Link>))}
      </div>
      {!list.length && <p className="empty-state">Tidak ada error yang cocok.</p>}
    </div>
  );
}

export function ErrorPage() {
  const { slug = '' } = useParams();
  const e = ERRORS.find(x => x.slug === slug);
  useEffect(() => { if (e) setMeta(`${e.code} di Excel: ${e.title} dan Cara Memperbaikinya · Jagoan Excel`, plain(`Arti ${e.code} di Excel: ${e.short} Penyebab: ${e.causes.map(c => c[0]).join(', ')}.`), '/error/' + e.slug); }, [slug]);
  if (!e) return <NotFound />;
  const i = ERRORS.indexOf(e); const prev = ERRORS[i - 1], next = ERRORS[i + 1];
  return (
    <div className="wrap page er er-detail">
      <p className="crumb"><Link to="/error">Kamus error</Link> › {e.code}</p>
      <div className="er-hero"><code className="er-code big">{e.code}</code><div><h1>{e.code}: {e.title}</h1><Html as="p" html={e.short} /></div></div>
      <section className="er-sec"><h2>Penyebab yang paling sering</h2>
        <ol className="er-causes">{e.causes.map(([c, ex]) => <li key={c}><b>{c}</b><Html as="p" html={'Contoh: ' + ex} /></li>)}</ol></section>
      <section className="er-sec"><h2>Cara memperbaiki</h2>
        <ul className="er-fix">{e.fixes.map(f => <li key={f}><Html as="span" html={f} /></li>)}</ul></section>
      <section className="er-sec"><h2>Contoh</h2>
        <div className="er-ex"><div className="bad"><span>Bermasalah</span><code>{e.example.bad}</code></div><div className="ok"><span>Lebih aman</span><code>{e.example.good}</code></div></div></section>
      {e.fns.some(f => FN_BY[f]) && <section className="er-sec"><h2>Fungsi terkait</h2>
        <p className="fn-chips">{e.fns.filter(f => FN_BY[f]).map(f => <Link key={f} to={fnPath(f)}>{f}</Link>)}</p></section>}
      <nav className="drill-nav" aria-label="Error lain">
        {prev ? <Link className="btn ghost" to={'/error/' + prev.slug}>← {prev.code}</Link> : <span />}
        <Link className="btn" to="/playground">Coba di Playground</Link>
        {next ? <Link className="btn ghost" to={'/error/' + next.slug}>{next.code} →</Link> : <span />}
      </nav>
    </div>
  );
}
