import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProgress } from '../lib/progress';
import { useAuth } from '../lib/auth';
import { supabase, hasSupabase } from '../lib/supabase';
import { LEVELS, LEVEL_BY, allStatus, moduleTitles, verifyUrl, type Cert, type Level } from '../lib/certs';
import { fmtDate } from '../lib/format';
import { NameLock, useCertName } from '../components/NameLock';
import { CertPreviewButton } from '../components/CertPreviewButton';
import { useBypass } from '../lib/bypass';
import { EXAM, bestPassed, myAttempts, type AttemptRow } from '../lib/exam';

const LOCAL_KEY = 'kr.certs.local';
const readLocal = (): Cert[] => { try { const x = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); return Array.isArray(x) ? x : []; } catch { return []; } };

export default function CertificatePage() {
  const { p } = useProgress();
  const { user } = useAuth();
  const [locked, setLocked] = useCertName();
  const name = locked || '';
  const [certs, setCerts] = useState<Cert[]>(() => (hasSupabase ? [] : readLocal()));
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const bypass = useBypass();
  const st = useMemo(() => allStatus(p, bypass), [p, bypass]);
  const [rows, setRows] = useState<AttemptRow[]>([]);
  useEffect(() => { myAttempts().then(setRows).catch(() => setRows([])); }, [user?.id]);
  const passedBy = bestPassed(rows);

  useEffect(() => {
    if (!supabase || !user) return;
    supabase.from('certificates').select('id, level, name, issued_at, score, test').then(({ data }) => setCerts((data as Cert[]) || []));
  }, [user?.id]);

  const issue = async (lv: Level) => {
    const nm = name;
    if (!nm) { setMsg({ ok: false, t: 'Isi dan kunci nama sertifikat dulu.' }); return; }
    setBusy(lv.key); setMsg(null);
    try {
      let c: Cert;
      if (supabase) {
        const { data, error } = await supabase.rpc('issue_certificate', { p_level: lv.key, p_name: nm });
        if (error) throw new Error(/ujian/i.test(error.message) ? 'Kamu belum lulus ujian akhir tingkat ini.' : /Syarat/.test(error.message) ? 'Syarat kelulusan belum tercatat di akunmu. Pastikan kamu masuk dengan akun yang dipakai belajar, lalu muat ulang halaman.' : error.message);
        c = (data as Cert[])[0];
      } else {
        const old = certs.find(x => x.level === lv.key);
        const hex = () => Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0');
        c = { id: old?.id || `JE-${hex()}-${hex()}-${hex()}`, level: lv.key, name: nm, issued_at: old?.issued_at || new Date().toISOString(), score: passedBy[lv.key] };
        const list = [...certs.filter(x => x.level !== lv.key), c];
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch { /* abaikan */ }
      }
      setCerts(cs => [...cs.filter(x => x.level !== c.level), c]);
      await download(c);
      setMsg({ ok: true, t: `Sertifikat ${lv.name} untuk ${c.name} sudah dibuat dan diunduh.` });
    } catch (e) { setMsg({ ok: false, t: e instanceof Error ? e.message : 'Sertifikat gagal dibuat.' }); }
    setBusy(null);
  };
  const download = async (c: Cert, sample = false) => {
    const s = st[c.level];
    const { downloadCertificatePdf } = await import('../lib/certpdf');
    await downloadCertificatePdf({ ...c, score: c.score ?? passedBy[c.level] }, { lessons: s.lessons[1], drills: LEVEL_BY[c.level].minDrill, cases: LEVEL_BY[c.level].minCases }, sample);
  };

  const pct = (a: [number, number]) => (a[1] ? Math.round((a[0] / a[1]) * 100) : 100);
  return (
    <div className="wrap page">
      <div className="page-head"><p className="eyebrow">Akun &amp; pencapaian</p><h1>Sertifikat kelulusan</h1>
        <p>Setiap tingkat punya sertifikat sendiri. Selesaikan semua materi di tingkat itu, kerjakan minimal {LEVELS[0].minDrill.toLocaleString("id-ID")} soal praktik di tingkat itu, lalu <b>lulus ujian akhir</b> (soal praktik gabungan rumus, studi kasus, PivotTable, dan teori; nilai minimal {EXAM.pass}) untuk mengambil sertifikat. Setiap sertifikat punya nomor unik dan QR code yang bisa dipindai siapa saja untuk memeriksa keasliannya.</p></div>

      <NameLock name={locked} onLocked={setLocked} />
      {hasSupabase && !user && <p className="demo-note">Masuk dulu supaya sertifikat tercatat di akunmu dan bisa diverifikasi. <Link to="/masuk?next=/sertifikat">Masuk</Link></p>}
      {!hasSupabase && <p className="demo-note">Mode lokal: sertifikat dibuat di browser ini saja. Verifikasi QR berfungsi penuh setelah aplikasi tersambung ke Supabase.</p>}
      {bypass && <p className="demo-note">Akun uji coba: syarat materi, soal, urutan tingkat, dan batas percobaan harian dilewati. Kamu boleh mengambil sertifikat uji coba tanpa ujian untuk mencoba scan QR; di halaman verifikasi ditandai "uji coba" dan dihapus saat bypass dimatikan.</p>}
      {msg && <p className={msg.ok ? 'feedback ok' : 'buy-err'} role="status">{msg.t}</p>}

      <div className="certs">
        {LEVELS.map((lv, i) => {
          const s = st[lv.key]; const c = certs.find(x => x.level === lv.key);
          const prevPassed = bypass || LEVELS.slice(0, i).every(l => passedBy[l.key] != null);
          const canExam = s.ok && prevPassed; const passed = passedBy[lv.key] != null;
          return (
            <article key={lv.key} className={'cert-card' + (c ? ' got' : s.ok ? ' ready' : '')}>
              <div className="cert-top"><span className="cert-n">{String(i + 1).padStart(2, '0')}</span>{c ? <span className="badge pro">Lulus</span> : passed ? <span className="badge">Siap diambil</span> : canExam ? <span className="badge">Siap ujian</span> : null}</div>
              <h2>{lv.name}</h2>
              <p className="muted">{moduleTitles(lv).join(' · ')}</p>
              <ul className="cert-req">
                <li><span>Materi tingkat {lv.label}</span><span className="meter"><span style={{ width: pct(s.lessons) + '%' }} /></span><b>{s.lessons[0]}/{s.lessons[1]}</b></li>
                <li><span>Soal praktik {lv.drillLevel}</span><span className="meter"><span style={{ width: pct(s.drills) + '%' }} /></span><b>{s.drills[0]}/{s.drills[1]}</b></li>
                {lv.minCases > 0 && <li><span>Studi kasus</span><span className="meter"><span style={{ width: pct(s.cases) + '%' }} /></span><b>{s.cases[0]}/{s.cases[1]}</b></li>}
                <li><span>Ujian akhir</span><span className="meter"><span style={{ width: (passed ? 100 : 0) + '%' }} /></span><b>{passed ? passedBy[lv.key] : '–'}</b></li>
              </ul>
              {!prevPassed && <p className="muted cert-note">Lulus ujian tingkat sebelumnya dulu.</p>}
              {c ? (
                <div className="cert-act">
                  <button className="btn primary dl" onClick={() => download(c)}><DlIcon />Unduh sertifikat</button>
                  <CertPreviewButton level={lv.key} name={c.name} score={c.score ?? passedBy[lv.key]} id={c.id} date={fmtDate(c.issued_at)} />
                  <Link className="btn ghost sm" to={'/verifikasi/' + c.id}>Cek keaslian</Link>
                  <p className="cert-id">No. {c.id} · terbit {fmtDate(c.issued_at)}{c.test ? ' · uji coba' : ''}{name && c.name !== name ? <> · <button className="linkish" onClick={() => issue(lv)}>perbarui nama</button></> : c.test && passed ? <> · <button className="linkish" onClick={() => issue(lv)}>perbarui dengan nilai ujian</button></> : null}</p>
                </div>
              ) : (
                <div className="cert-act">
                  {passed || bypass ? <button className="btn primary dl" disabled={busy !== null || !name || (hasSupabase && !user)} title={name ? '' : 'Kunci namamu dulu'} onClick={() => issue(lv)}>{busy === lv.key ? 'Membuat…' : <><DlIcon />{passed ? 'Ambil sertifikat' : 'Ambil sertifikat uji coba'}</>}</button>
                    : <Link className={'btn ' + (canExam ? 'primary' : '')} to={'/ujian/' + lv.key}>{canExam ? 'Ikut ujian akhir' : 'Lihat syarat ujian'}</Link>}
                  {!s.ok && <Link className="btn ghost sm" to="/soal">Latihan soal</Link>}
                  <CertPreviewButton level={lv.key} name={name || 'Nama Kamu'} score={90} id="JE-0000-0000-0000" date={fmtDate(Date.now())} sample />
                </div>
              )}
            </article>
          );
        })}
      </div>
      <p className="muted" style={{ fontSize: 13.5 }}>Sertifikat ditandatangani secara digital oleh Eksal Pujianto, Founder - Jagoan Excel, lewat QR code verifikasi. Sertifikat ini menunjukkan penyelesaian kurikulum dan latihan di Jagoan Excel, bukan sertifikasi resmi Microsoft.</p>
    </div>
  );
}

const DlIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export { readLocal as readLocalCerts };
export function VerifyPage() {
  const { id = '' } = useParams();
  const [res, setRes] = useState<'loading' | 'none' | { id: string; title: string; name: string; issued_at: string; revoked: boolean; score?: number | null; test?: boolean }>('loading');
  useEffect(() => {
    if (!/^JE-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/i.test(id)) { setRes('none'); return; }
    if (!supabase) {
      const c = readLocal().find(x => x.id.toUpperCase() === id.toUpperCase());
      setRes(c ? { id: c.id, title: LEVEL_BY[c.level].name, name: c.name, issued_at: c.issued_at, revoked: false, score: c.score } : 'none'); return;
    }
    supabase.rpc('verify_certificate', { p_id: id }).then(({ data, error }) => {
      const row = !error && Array.isArray(data) ? data[0] : null;
      setRes(row ? row : 'none');
    });
  }, [id]);
  return (
    <div className="wrap page verify">
      <div className="verify-card">
        {/^JE-0000-0000-0000$/i.test(id) ? (
          <>
            <span className="verify-ic" aria-hidden="true">i</span>
            <p className="eyebrow">Nomor contoh</p>
            <h1>Ini QR dari sertifikat contoh</h1>
            <p>Nomor <code>{id}</code> hanya dipakai di pratinjau sertifikat, jadi tidak tercatat. Sertifikat asli punya nomor unik dan halaman ini akan menampilkan nama, tingkat, nilai, dan statusnya.</p>
            <Link className="btn primary sm" to="/sertifikat">Lihat syarat sertifikat</Link>
          </>
        ) : res === 'loading' ? <p className="muted">Memeriksa sertifikat…</p> : res === 'none' ? (
          <>
            <span className="verify-ic bad" aria-hidden="true">✕</span>
            <h1>Sertifikat tidak ditemukan</h1>
            <p>Nomor <code>{id}</code> tidak terdaftar di Jagoan Excel. Pastikan nomor atau QR code yang dipindai benar.</p>
          </>
        ) : (
          <>
            <span className={'verify-ic' + (res.revoked ? ' bad' : '')} aria-hidden="true">{res.revoked ? '✕' : '✓'}</span>
            <p className="eyebrow">{res.revoked ? 'Sertifikat dicabut' : res.test ? 'Sertifikat uji coba' : 'Sertifikat asli'}</p>
            <h1>{res.name}</h1>
            <p className="verify-lv">{res.title}</p>
            <dl>
              <dt>Nomor</dt><dd><code>{res.id}</code></dd>
              <dt>Tanggal terbit</dt><dd>{fmtDate(res.issued_at)}</dd>
              {res.score != null && <><dt>Nilai ujian akhir</dt><dd>{res.score}/100</dd></>}
              <dt>Diterbitkan oleh</dt><dd>Jagoan Excel · Eksal Pujianto, Founder - Jagoan Excel</dd>
              <dt>Status</dt><dd>{res.revoked ? 'Tidak berlaku' : res.test ? 'Uji coba sistem, bukan bukti kelulusan' : 'Berlaku'}</dd>
            </dl>
            {!supabase && <p className="demo-note">Mode lokal: data diambil dari browser ini.</p>}
          </>
        )}
        <p className="verify-foot">Verifikasi resmi: {verifyUrl(id).replace(/^https?:\/\//, '')}</p>
        <Link className="btn ghost sm" to="/">Ke Jagoan Excel</Link>
      </div>
    </div>
  );
}
