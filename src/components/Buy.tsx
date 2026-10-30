import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useProgress } from '../lib/progress';
import { hasSupabase, allowDemo } from '../lib/supabase';
import { hasWhatsApp, waLink } from '../lib/whatsapp';
import { PRICE, LESSONS, CASES, DRILL } from '../lib/catalog';
import { rp } from '../lib/format';
import { LockIcon } from './Icons';
import { checkRef, claimRef, normRef, rememberRef, storedRef, validRefFormat, type RefCheck } from '../lib/referral';

type BuyCtx = { buy: () => void; toast: (m: string) => void };
const C = createContext<BuyCtx | null>(null);
export const useBuy = () => useContext(C)!;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Alur beli Pro (manual):
 *  1. Pembeli mengisi email → tombol membuka WhatsApp admin dengan pesan terisi.
 *  2. Admin menerima transfer, lalu mengirim /aktivasi email ke bot Telegram.
 *  3. Bot membuat akun + kode login; admin meneruskan kodenya ke pembeli.
 *  4. Pembeli masuk di /masuk dengan email + kode.
 * Tanpa Supabase (mode lokal) tersedia tombol aktivasi demo untuk pengembangan.
 */
export function BuyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { demoActivate, isPro } = useProgress();
  const nav = useNavigate();
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const [ref, setRef] = useState('');
  const [refOk, setRefOk] = useState<RefCheck>(null);
  useEffect(() => {
    if (!modal || !validRefFormat(ref)) { setRefOk(null); return; }
    let live = true; const t = window.setTimeout(() => { checkRef(ref).then(r => { if (live) setRefOk(r); }); }, 350);
    return () => { live = false; window.clearTimeout(t); };
  }, [ref, modal]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toast = (m: string) => { setToastMsg(m); window.setTimeout(() => setToastMsg(null), 4000); };
  const open = () => { setEmail(user?.email || ''); setRef(storedRef()); setTouched(false); setSent(false); setModal(true); };
  const valid = EMAIL_RE.test(email.trim());
  const refBad = ref !== '' && (!validRefFormat(ref) || refOk?.valid === false);
  const disc = refOk?.valid ? refOk.discount : 0;
  const wa = () => waLink({ email: email.trim(), name: name.trim(), renew: isPro, ref: ref && !refBad ? ref : undefined, discount: disc });

  return (
    <C.Provider value={{ buy: open, toast }}>
      {children}
      {modal && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="co-h" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}
          onKeyDown={e => { if (e.key === 'Escape') setModal(false); }}>
          <div className="modal-card">
            <h2 id="co-h">Akses Pro Lifetime</h2>
            <dl>
              <dt>Semua materi, bank soal, latihan Pro, dan grup Telegram · selamanya</dt><dd>{disc > 0 ? <><s className="muted">{rp(PRICE.pro)}</s> {rp(Math.max(0, PRICE.pro - disc))}</> : rp(PRICE.pro)}</dd>
            </dl>
            {sent ? (
              <div className="buy-steps">
                <p><b>Lanjutkan di WhatsApp.</b> Setelah pembayaran diterima, admin mengirim <b>kode login</b> ke WhatsApp kamu.</p>
                <p>Lalu masuk dengan email <b>{email.trim()}</b> dan kode tersebut.</p>
                <p className="muted" style={{ fontSize: 13 }}>WhatsApp tidak terbuka? Kirim pesan ke admin secara manual, atau <a href={wa()} target="_blank" rel="noopener noreferrer">coba buka lagi</a>.</p>
              </div>
            ) : hasWhatsApp ? (
              <form id="buy-form" className="buy-form" onSubmit={e => {
                e.preventDefault(); setTouched(true);
                if (!valid || refBad) return;
                rememberRef(ref);
                if (ref && !refBad) claimRef(email, ref); // dikirim dulu, sebelum pindah ke WhatsApp
                window.open(wa(), '_blank', 'noopener');
                setSent(true);
              }}>
                <ol className="buy-how">
                  <li>Isi email yang akan dipakai untuk masuk.</li>
                  <li>Chat admin di WhatsApp dan lakukan pembayaran.</li>
                  <li>Admin mengirim kode login. Masuk dengan email + kode.</li>
                </ol>
                <label htmlFor="buy-email" className="pv-lab">Email</label>
                <input id="buy-email" className="pv-in buy-in" type="email" autoComplete="email" required placeholder="nama@gmail.com"
                  value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={touched && !valid} />
                {touched && !valid && <p className="buy-err" role="alert">Isi alamat email yang valid, misalnya nama@gmail.com.</p>}
                <label htmlFor="buy-name" className="pv-lab">Nama (opsional)</label>
                <input id="buy-name" className="pv-in buy-in" type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
                <label htmlFor="buy-ref" className="pv-lab">Kode referal (opsional)</label>
                <input id="buy-ref" className="pv-in buy-in" type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="Misalnya ANDI"
                  value={ref} onChange={e => setRef(normRef(e.target.value))} aria-invalid={refBad} aria-describedby="buy-ref-n" />
                <p id="buy-ref-n" className={refBad ? 'buy-err' : 'muted buy-ref-n'} role={refBad ? 'alert' : undefined}>
                  {refBad ? (validRefFormat(ref) ? 'Kode referal tidak ditemukan atau sudah tidak aktif. Kosongkan kalau tidak punya.' : 'Kode referal 3–16 huruf atau angka.')
                    : refOk?.valid ? (disc > 0 ? `Kode berlaku · hemat ${rp(disc)}.` : 'Kode berlaku.') : 'Dapat kode dari teman? Isi di sini.'}
                </p>
              </form>
            ) : (
              <p className="demo-note">{hasSupabase ? 'Nomor WhatsApp admin belum diisi (VITE_WA_NUMBER di .env).' : allowDemo ? 'Mode lokal: Supabase belum dikonfigurasi, jadi akses Pro diaktifkan sebagai demo di browser ini.' : 'Pembelian belum tersedia: hubungi admin.'}</p>
            )}
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setModal(false)}>{sent ? 'Selesai' : 'Tutup'}</button>
              {sent ? <Link className="btn primary" to="/masuk" onClick={() => setModal(false)}>Saya sudah punya kode</Link>
                : hasWhatsApp ? <button className="btn primary" type="submit" form="buy-form">Lanjut ke WhatsApp</button>
                : allowDemo ? <button className="btn primary" autoFocus onClick={() => { demoActivate(); setModal(false); nav('/dashboard'); }}>Aktifkan Pro (demo)</button> : null}
            </div>
          </div>
        </div>
      )}
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </C.Provider>
  );
}

export function Paywall({ what, desc }: { what: string; desc?: string }) {
  const { buy } = useBuy();
  const { user } = useAuth();
  const nScored = LESSONS.filter((l: any) => !l.sandbox).length;
  return (
    <section className="paywall" aria-labelledby="pw-h">
      <h2 id="pw-h"><span className="lockico" aria-hidden="true"><LockIcon size={16} /></span>{what} termasuk akses Pro</h2>
      {desc && <p>{desc}</p>}
      <p>Akses Pro membuka semua {nScored} materi, {CASES.length} studi kasus kantor, {DRILL.count.toLocaleString('id-ID')} soal praktik, PivotTable, Power Query, sampai VBA, ditambah ribuan latihan Excel dan grup Telegram khusus Pro. Sekali bayar, berlaku selamanya.</p>
      <div className="cta">
        <button className="btn primary" onClick={buy}>Beli akses Pro · {rp(PRICE.pro)}</button>
        {hasSupabase && !user && <Link className="btn" to="/masuk">Sudah punya kode? Masuk</Link>}
        <Link className="btn ghost" to="/harga">Lihat perbandingan paket</Link>
      </div>
    </section>
  );
}
