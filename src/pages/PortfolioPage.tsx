import { Seal } from '../components/Seal';
import { LOGO_SVG } from '../lib/brand';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { XL } from '../engine/engine.js';
import { useProgress } from '../lib/progress';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { fmtDate, fmtUntil } from '../lib/format';
import { buildPortfolio, downloadEvidenceXlsx, downloadPortfolioPdf, usedFunctions } from '../lib/portfolio';
import { collectEvidence, gridBounds, type Evidence } from '../lib/evidence';
import { LEVEL_BY, type Cert } from '../lib/certs';
import { fnPath } from '../lib/fnhelp';
import { readLocalCerts } from './CertificatePage';
import { NameLock, useCertName } from '../components/NameLock';


export default function PortfolioPage() {
  const { p, isPro, proUntil } = useProgress();
  const { user, profile } = useAuth();
  const [locked, setLocked] = useCertName();
  const name = locked || '';
  const [busy, setBusy] = useState<'' | 'pdf' | 'xlsx'>('');
  const [err, setErr] = useState('');
  const [certs, setCerts] = useState<Cert[]>(() => (supabase ? [] : readLocalCerts()));
  const [more, setMore] = useState(6);
  useEffect(() => { if (supabase && user) supabase.from('certificates').select('id, level, name, issued_at').then(({ data }) => setCerts((data as Cert[]) || [])); }, [user?.id]);

  const pf = useMemo(() => buildPortfolio(p, { name: name.trim(), email: user?.email || '', pro: isPro ? 'Member Pro ' + fmtUntil(proUntil!) : '' }), [p, name, user?.email, isPro, proUntil]);
  const ev = useMemo(() => collectEvidence(p), [p]);
  const fns = useMemo(() => usedFunctions(ev), [ev]);
  const pct = (d: number, t: number) => (t ? Math.round((d / t) * 100) : 0);

  const save = async (kind: 'pdf' | 'xlsx') => {
    if (!isPro) return;
    setBusy(kind); setErr('');
    try {
      if (kind === 'pdf') await downloadPortfolioPdf(pf, ev, certs.map(c => ({ title: LEVEL_BY[c.level]?.name || c.level, id: c.id, date: fmtDate(c.issued_at) })));
      else await downloadEvidenceXlsx(name.trim(), ev);
    } catch { setErr('File gagal dibuat. Coba lagi atau pakai browser lain.'); }
    setBusy('');
  };

  return (
    <div className="wrap page">
      <div className="page-head"><p className="eyebrow">Akun &amp; pencapaian</p><h1>Portofolio Excel</h1>
        <p>Bukti kemampuan Excel-mu untuk CV atau lamaran kerja: ringkasan progres, fungsi yang sudah kamu kuasai, dan <b>bukti kerja</b> dari lembar kerja yang sudah kamu selesaikan. Unduh sebagai PDF untuk lamaran, atau sebagai file Excel.</p></div>

      <NameLock name={locked} onLocked={setLocked} />
      <div className="pfo-bar">
        {!isPro ? <>
          <p className="muted" style={{ margin: 0, flexBasis: '100%', fontSize: 13.5 }}>Unduhan portofolio PDF dan bukti kerja khusus member Pro. Pratinjaunya tetap bisa kamu lihat di bawah.</p>
          <Link className="btn primary lg" to="/harga">Buka dengan Pro</Link>
        </> : <>
        {!locked && <p className="muted" style={{ margin: 0, flexBasis: '100%', fontSize: 13.5 }}>Kunci namamu dulu untuk mengunduh portofolio.</p>}
        <button className="btn primary lg" onClick={() => save('pdf')} disabled={!!busy || !locked}>{busy === 'pdf' ? 'Menyiapkan PDF…' : 'Unduh PDF'}</button>
        <button className="btn lg" onClick={() => save('xlsx')} disabled={!!busy || !ev.length || !locked} title={ev.length ? '' : 'Belum ada bukti kerja'}>{busy === 'xlsx' ? 'Menyiapkan…' : 'Unduh bukti kerja (.xlsx)'}</button>
        </>}
      </div>
      {err && <p className="buy-err" role="alert">{err}</p>}

      <article className="pfo" aria-label="Pratinjau portofolio">
        <header className="pfo-band">
          <div className="pfo-brand"><img src={'data:image/svg+xml;utf8,' + encodeURIComponent(LOGO_SVG(30, 'white'))} alt="" width="30" height="30" /><b>Jagoan Excel</b></div>
          <small>Portofolio kemampuan Excel</small>
          <h2>{pf.name || 'Nama kamu'}</h2>
          <p>{[pf.email, 'Belajar sejak ' + fmtDate(pf.since), pf.pro].filter(Boolean).join(' · ')}</p>
          <Seal ring="JAGOAN EXCEL • PORTOFOLIO • " label="Portofolio" />
        </header>
        <dl className="pfo-stats">
          <div><dd>{pf.lessons.done}/{pf.lessons.total}</dd><dt>Materi selesai</dt></div>
          <div><dd>{pf.drills.toLocaleString('id-ID')}</dd><dt>Soal praktik benar</dt></div>
          <div><dd>{pf.cases.done}/{pf.cases.total}</dd><dt>Studi kasus</dt></div>
          <div><dd>{ev.length}</dd><dt>Bukti kerja</dt></div>
        </dl>
        {fns.length > 0 && <div className="pfo-sec"><h3>Fungsi Excel yang sudah dipakai ({fns.length})</h3><p className="fn-chips">{fns.map(f => <Link key={f} to={fnPath(f)}>{f}</Link>)}</p></div>}
        {certs.length > 0 && <div className="pfo-sec"><h3>Sertifikat</h3><p className="fn-chips">{certs.map(c => <Link key={c.id} to={'/verifikasi/' + c.id}>{LEVEL_BY[c.level]?.name} · {c.id}</Link>)}</p></div>}
        <section className="pfo-sec"><h3>Penguasaan per modul</h3>
          <div className="pfo-mods">{pf.modules.map(m => <div className="mrow" key={m.title}><span>{m.title}</span><div className="meter"><span style={{ width: pct(m.done, m.total) + '%' }} /></div><span>{m.done}/{m.total}</span></div>)}</div>
        </section>
      </article>

      <section className="section pfo-ev" aria-labelledby="ev-h">
        <div className="section-h"><div><h2 id="ev-h">Bukti kerja</h2><p>Lembar kerja yang sudah kamu selesaikan. Sel hijau adalah rumus buatanmu sendiri.</p></div></div>
        {!ev.length ? <div className="ev-empty"><b>Belum ada bukti kerja</b><p>Rumus yang kamu tulis di materi praktik, studi kasus, dan bank soal otomatis tersimpan di sini sebagai bukti kerja.</p><div className="ev-empty-act"><Link className="btn primary sm" to="/materi">Materi praktik</Link><Link className="btn sm" to="/kasus">Studi kasus</Link><Link className="btn sm" to="/soal">Bank soal</Link></div></div> : <>
          <div className="ev-list">{ev.slice(0, more).map(e => <EvidenceCard key={e.id} e={e} />)}</div>
          {ev.length > more && <button className="btn" onClick={() => setMore(m => m + 6)}>Tampilkan lebih banyak ({ev.length - more} lagi)</button>}
        </>}
      </section>
      <p className="muted pfo-note">Angka diambil dari progres yang tersimpan{user ? ' di akunmu' : ' di browser ini'}. Mau bukti resmi per tingkat? Ambil <Link to="/sertifikat">sertifikat kelulusan</Link>.</p>
    </div>
  );
}

function EvidenceCard({ e }: { e: Evidence }) {
  const g = gridBounds(e, 8, 12);
  const fset = new Set(e.formulas.map(f => f.cell));
  return (
    <article className="ev">
      <p className="ev-k"><span>{e.kind}</span>{e.sub}</p>
      <h3>{e.title}</h3>
      {e.narrative.slice(0, 3).map((t, i) => <p key={i} className="ev-n">{t}</p>)}
      <ul className="ev-f">{e.formulas.slice(0, 4).map(f => <li key={f.cell}><b>{f.cell}</b><code>{f.f}</code><span>= {f.value}</span></li>)}{e.formulas.length > 4 && <li className="muted">+ {e.formulas.length - 4} rumus lain</li>}</ul>
      <div className="ev-grid-w"><table className="ev-grid"><thead><tr><th />{Array.from({ length: g.cols }, (_, c) => <th key={c}>{XL.colName(c)}</th>)}</tr></thead>
        <tbody>{Array.from({ length: g.rows }, (_, i) => { const r = i + 1; return <tr key={r}><th>{r}</th>{Array.from({ length: g.cols }, (_, c) => { const a = XL.colName(c) + r; const v = e.values(a); return <td key={c} className={(fset.has(a) ? 'f ' : '') + (typeof v === 'number' ? 'n ' : '') + (r === 1 ? 'h' : '')} title={fset.has(a) ? String(e.cells[a]) : undefined}>{e.shown(a)}</td>; })}</tr>; })}</tbody>
      </table></div>
    </article>
  );
}
