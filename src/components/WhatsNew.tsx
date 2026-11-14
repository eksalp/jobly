import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WHATS_NEW, isFresh } from '../lib/whatsnew';

const KEY = 'kelasRumus.whatsNewSeen';
const seen = () => { try { return localStorage.getItem(KEY) === WHATS_NEW.id; } catch { return false; } };

/** Kotak pengumuman fitur baru di beranda. Bisa ditutup; hilang sendiri setelah masa "baru" lewat. */
export function WhatsNew() {
  const [hide, setHide] = useState(seen);
  if (hide || !isFresh()) return null;
  const close = () => { try { localStorage.setItem(KEY, WHATS_NEW.id); } catch { /* abaikan */ } setHide(true); };
  return (
    <section className="wn" aria-labelledby="wn-h">
      <div className="wn-h"><h2 id="wn-h"><i className="new">baru</i>{WHATS_NEW.title}</h2>
        <button type="button" className="wn-x" aria-label="Tutup pengumuman" onClick={close}>×</button></div>
      <ul>{WHATS_NEW.items.map(it => <li key={it.to}><Link to={it.to}>{it.text}</Link></li>)}</ul>
      <p className="wn-f">Cari label <i className="new">baru</i> dan <i className="new">simulasi baru</i> di daftar materi.</p>
    </section>
  );
}
