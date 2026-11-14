import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { hasSupabase } from '../lib/supabase';
import { hasWhatsApp, WA_NUMBER } from '../lib/whatsapp';
import { useBuy } from '../components/Buy';

export default function LoginPage() {
  const { user, signInWithCode } = useAuth();
  const { buy } = useBuy();
  const [sp] = useSearchParams();
  // Hanya alamat di dalam situs ini (mencegah open redirect seperti //situs-lain.com)
  const rawNext = sp.get('next') || '';
  const next = /^\/(?![\/\\])/.test(rawNext) ? rawNext : '/dashboard';
  const [email, setEmail] = useState(sp.get('email') || '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (user) return <Navigate to={next} replace />;
  if (!hasSupabase) return (
    <div className="wrap page"><div className="auth-card"><h1>Masuk</h1>
      <p>Supabase belum dikonfigurasi, jadi aplikasi berjalan dalam mode lokal tanpa akun. Isi <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> di file <code>.env</code> untuk mengaktifkan login.</p></div></div>
  );

  const lostCode = hasWhatsApp
    ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo, saya lupa kode login Jagoan Excel.\nEmail: ${email.trim() || '(isi email)'}`)}`
    : null;

  return (
    <div className="wrap page">
      <div className="auth-card">
        <h1>Masuk ke Jagoan Excel</h1>
        <p>Masukkan email dan kode yang dikirim admin lewat WhatsApp. Progres di browser ini otomatis ikut masuk ke akunmu.</p>
        <form onSubmit={async e => {
          e.preventDefault(); setErr(null); setBusy(true);
          const r = await signInWithCode(email, code);
          setBusy(false);
          if (r.error) setErr(r.error);
        }}>
          <label htmlFor="login-email" className="pv-lab">Email</label>
          <input id="login-email" type="email" required autoComplete="username" placeholder="nama@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
          <label htmlFor="login-code" className="pv-lab">Kode login</label>
          <input id="login-code" type="text" required autoComplete="current-password" autoCapitalize="characters" spellCheck={false}
            placeholder="ABCD-EFGH" className="code-in" value={code} onChange={e => setCode(e.target.value)} />
          <button className="btn primary block" disabled={busy}>{busy ? 'Memeriksa…' : 'Masuk'}</button>
        </form>
        {err && <p className="pv-msg bad" role="alert">{err}</p>}
        <div className="auth-or">belum punya kode?</div>
        <button className="btn block" onClick={buy}>Beli akses Pro</button>
        {lostCode && <p style={{ fontSize: 13.5 }}>Lupa kode? <a href={lostCode} target="_blank" rel="noopener noreferrer">Minta kode baru lewat WhatsApp</a>.</p>}
        <p style={{ fontSize: 13 }}>Materi gratis bisa dipakai tanpa masuk.</p>
      </div>
    </div>
  );
}
