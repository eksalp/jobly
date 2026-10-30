// Latihan Pro: link latihan tambahan dan grup Telegram, hanya untuk akun Pro.
// Link disimpan admin lewat bot (/link) di tabel pro_links, dan hanya bisa dibaca lewat RPC my_pro_links()
// yang memeriksa status Pro di server. Jadi link tidak ikut terkirim ke pengguna gratis.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../lib/progress';
import { useAuth } from '../lib/auth';
import { supabase, hasSupabase } from '../lib/supabase';
import { Paywall } from '../components/Buy';

type ProLink = { key: string; title: string; url: string };
const isTg = (u: string) => /^https:\/\/(t\.me|telegram\.me)\//i.test(u);
const host = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };

export default function ProPage() {
  const { isPro } = useProgress();
  const { user } = useAuth();
  const [links, setLinks] = useState<ProLink[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!isPro || !supabase || !user) return;
    let off = false;
    supabase.rpc('my_pro_links').then(({ data, error }) => {
      if (off) return;
      if (error) { setErr('Link belum bisa dimuat. Coba muat ulang halaman.'); setLinks([]); return; }
      setLinks(((data as ProLink[]) || []).filter(l => /^https:\/\//.test(l.url)));
    });
    return () => { off = true; };
  }, [isPro, user?.id]);

  const isDrive = (u: string) => /^https:\/\/(drive|docs)\.google\.com\//i.test(u);
  const groups = links?.filter(l => isTg(l.url)) ?? [];
  const drives = links?.filter(l => isDrive(l.url)) ?? [];
  const others = links?.filter(l => !isTg(l.url) && !isDrive(l.url)) ?? [];

  return (
    <div className="wrap page">
      <div className="page-head"><p className="eyebrow">Khusus member Pro</p><h1>Latihan Pro</h1>
        <p>Ribuan latihan soal Excel tambahan di luar bank soal aplikasi, kumpulan ebook Excel yang bisa diunduh, plus grup Telegram untuk tanya jawab dengan sesama member dan admin.</p></div>

      {!isPro ? <Paywall what="Latihan Pro" /> : !hasSupabase ? (
        <p className="demo-note">Mode lokal: link latihan dan grup Telegram diisi admin lewat bot (<code>/link</code>) setelah aplikasi tersambung ke Supabase.</p>
      ) : links === null ? <p className="muted">Memuat link…</p> : (
        <>
          {err && <p className="buy-err" role="alert">{err}</p>}
          {!links.length && !err && <p className="muted">Admin belum menambahkan link. Cek lagi nanti, atau tanyakan lewat WhatsApp admin.</p>}
          <div className="hcards">
            {others.map(l => (
              <article className="hcard" key={l.key}>
                <span className="hc-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM4 9.5h16M4 15h16M9.5 4v16M15 4v16" /></svg></span>
                <h2>{l.title}</h2>
                <p>Latihan tambahan dari {host(l.url)}. Buka di tab baru; progresmu di sana terpisah dari aplikasi ini.</p>
                <div className="hc-act"><a className="btn primary lg" href={l.url} target="_blank" rel="noopener noreferrer">Buka latihan ↗</a></div>
              </article>
            ))}
            {drives.map(l => (
              <article className="hcard" key={l.key}>
                <span className="hc-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h3" /></svg></span>
                <h2>{l.title}</h2>
                <p>Kumpulan materi dan ebook Excel di Google Drive. Buka foldernya, lalu unduh file yang kamu butuhkan. Mohon tidak membagikan link ini ke orang lain.</p>
                <div className="hc-act"><a className="btn primary lg" href={l.url} target="_blank" rel="noopener noreferrer">Buka &amp; unduh ↗</a></div>
              </article>
            ))}
            {groups.map(l => (
              <article className="hcard" key={l.key}>
                <span className="hc-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4 3 11l6 2.5M21 4l-3 16-9-6.5M21 4 9 13.5V19l3-3.5" /></svg></span>
                <h2>{l.title}</h2>
                <p>Tanya rumus, kirim file yang bikin bingung, dan dapat info materi baru. Mohon jangan bagikan link ini ke orang lain.</p>
                <div className="hc-act"><a className="btn primary lg" href={l.url} target="_blank" rel="noopener noreferrer">Gabung grup Telegram ↗</a></div>
              </article>
            ))}
          </div>
        </>
      )}
      <p className="muted" style={{ fontSize: 14 }}>Bank soal di aplikasi tetap jalan seperti biasa: <Link to="/soal">buka bank soal</Link>.</p>
    </div>
  );
}
