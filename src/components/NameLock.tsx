// Kotak nama sertifikat/portofolio: isi sekali dengan peringatan jelas, setelah itu terkunci.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { hasSupabase } from '../lib/supabase';
import { changeNameLink, getCertName, lockCertName, nameProblem, tidyName } from '../lib/certname';

export function useCertName() {
  const { user } = useAuth();
  const [name, setName] = useState<string | null | undefined>(undefined); // undefined = memuat
  useEffect(() => { let off = false; getCertName(user?.id).then(n => { if (!off) setName(n); }).catch(() => !off && setName(null)); return () => { off = true; }; }, [user?.id]);
  return [name, setName] as const;
}

export function NameLock({ name, onLocked, what = 'sertifikat dan portofolio' }: { name: string | null | undefined; onLocked: (n: string) => void; what?: string }) {
  const { user, profile } = useAuth();
  const [draft, setDraft] = useState(() => { try { return localStorage.getItem('kr.portfolio.name') || profile?.full_name || ''; } catch { return ''; } });
  const [agree, setAgree] = useState(false);
  const [ask, setAsk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  if (name === undefined) return <div className="nl"><p className="muted">Memuat nama…</p></div>;
  if (hasSupabase && !user) return <div className="nl"><p>Masuk dulu untuk mengisi nama di {what}. <Link to="/masuk?next=/sertifikat">Masuk</Link></p></div>;

  if (name) {
    const wa = changeNameLink(user?.email || '', name);
    return (
      <div className="nl locked">
        <div><small>Nama di {what}</small><b>{name}</b></div>
        <p className="nl-note">Nama sudah dikunci. Mau mengganti (misalnya salah ketik atau nama resmi berubah)? {wa ? <a href={wa} target="_blank" rel="noopener noreferrer">Hubungi admin lewat WhatsApp</a> : 'Hubungi admin'} dan sertakan <b>alasannya</b>.</p>
      </div>
    );
  }
  const clean = tidyName(draft); const bad = draft ? nameProblem(clean) : null;
  const save = async () => {
    setBusy(true); setErr('');
    try { const n = await lockCertName(clean); onLocked(n); setAsk(false); } catch (e) { setErr(e instanceof Error ? e.message : 'Nama gagal disimpan.'); }
    setBusy(false);
  };
  return (
    <div className="nl">
      <label className="pfo-name">Nama lengkap untuk {what}
        <input value={draft} maxLength={60} placeholder="Nama lengkap sesuai identitas" onChange={e => { setDraft(e.target.value); setAsk(false); }} />
      </label>
      {bad && <p className="buy-err">{bad}</p>}
      <div className="nl-warn" role="note">
        <b>Perhatian: nama hanya bisa diisi satu kali.</b> Nama ini akan tercetak di semua sertifikat dan portofolio, dan dipakai untuk verifikasi QR. Periksa ejaan dan gunakan nama sesuai identitas. Setelah disimpan, penggantian hanya bisa lewat admin dengan menyertakan alasan.
      </div>
      {!ask ? <button className="btn primary" disabled={!clean || !!bad} onClick={() => setAsk(true)}>Simpan nama</button> : (
        <div className="nl-confirm">
          <p>Simpan nama <b>“{clean}”</b>? Nama ini tidak bisa kamu ubah sendiri lagi.</p>
          <label className="pf-radio"><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} /> Ejaan nama sudah benar dan sesuai identitas saya</label>
          <div className="cta"><button className="btn primary" disabled={!agree || busy} onClick={save}>{busy ? 'Menyimpan…' : 'Ya, kunci nama ini'}</button><button className="btn ghost" onClick={() => setAsk(false)}>Periksa lagi</button></div>
        </div>
      )}
      {err && <p className="buy-err" role="alert">{err}</p>}
    </div>
  );
}
