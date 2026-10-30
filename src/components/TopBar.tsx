// Kerangka aplikasi: sidebar kiri (menu belajar + akun) dan bar atas (judul halaman + menu akun).
// Di layar lebar sidebar selalu tampil; di layar kecil sidebar menjadi laci yang dibuka tombol hamburger.
import { Flame } from './DailyGoal';
import { currentStreak } from '../lib/streak';
import { ThemeSwitch } from './ThemeSwitch';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useProgress } from '../lib/progress';
import { hasSupabase } from '../lib/supabase';
import { SearchButton } from './SearchDialog';
import { LOGO } from '../lib/brand';

export const BRAND = 'Jagoan Excel';

/** Logo: monogram "je" satu garis gelombang + titik hijau muda. Garisnya tergambar lalu titiknya muncul,
 *  saat halaman dibuka, diulang setiap 8 detik, dan saat logo disorot. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <path className="lg-e" d={LOGO.path} pathLength={100} fill="none" strokeWidth={LOGO.width} strokeLinecap="round" strokeLinejoin="round" />
      <circle className="lg-dot" cx={LOGO.dot.cx} cy={LOGO.dot.cy} r={LOGO.dot.r} />
    </svg>
  );
}

// Ikon garis 20×20 untuk menu
const I: Record<string, string> = {
  home: 'M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-3.5v-4.5h-5V17H4a1 1 0 0 1-1-1z',
  book: 'M4 4.5h4.5A2.5 2.5 0 0 1 11 7v9.5a2 2 0 0 0-2-2H4zM16 4.5h-3A2 2 0 0 0 11 6.5M16 4.5v10h-5',
  case: 'M3.5 7h13v9h-13zM7.5 7V5h5v2M3.5 11h13',
  path: 'M5 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM15 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM6.5 15h5a2.5 2.5 0 0 0 0-5h-3a2.5 2.5 0 0 1 0-5h5',
  tpl: 'M5 3.5h7l3 3v10h-10zM12 3.5v3h3M7.5 10h5M7.5 13h5',
  play: 'M3.5 4.5h13v11h-13zM3.5 8.5h13M7.5 4.5v11M10.5 11.5l2 1.5-2 1.5',
  grid: 'M3.5 3.5h13v13h-13zM3.5 8h13M3.5 12.5h13M8 3.5v13',
  bolt: 'M11.5 2.5 4.5 11h5l-1 6.5 7-8.5h-5z',
  fx: 'M12 4.5c-2 0-2.5 1-3 3.5l-1.5 7c-.4 1.8-1 2.5-2.5 2.5M6 9h6M12.5 10l4 5M16.5 10l-4 5',
  ribbon: 'M3 5h14v4H3zM5 9v6h10V9M8 12h4',
  key: 'M3 6.5h14v8H3zM6 9.5h1M9.5 9.5h1M13 9.5h1M7 12h6',
  chart: 'M4 16V9M8.5 16V5M13 16v-5M16.5 16H3',
  user: 'M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 17c.7-3 3-4.5 6-4.5s5.3 1.5 6 4.5',
  doc: 'M5.5 3h6l3.5 3.5V17h-9.5zM11.5 3v3.5H15M8 11h4.5M8 14h4.5',
  star: 'M10 3l2.1 4.4 4.8.6-3.5 3.3.9 4.7L10 13.7 5.7 16l.9-4.7L3.1 8l4.8-.6z',
  tag: 'M3.5 10.5V4h6.5l6.5 6.5-6 6zM7 7.5h.01',
  award: 'M10 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM7 11.5 6 17.5l4-2 4 2-1-6',
  brief: 'M3 6.5h14v10H3zM7 6.5V4.5h6v2M3 11h14',
  trophy: 'M6 3.5h8v4a4 4 0 0 1-8 0zM6 5H3.5v1a3 3 0 0 0 3 3M14 5h2.5v1a3 3 0 0 1-3 3M10 11.5v3M7 17h6M8 14.5h4v2.5H8z',
  chat: 'M3.5 4.5h13v9h-7l-4 3v-3h-2z',
  timer: 'M10 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM10 8v3l2 1.5M8 2.5h4',
  warn: 'M10 3.5 17.5 16.5h-15zM10 8.5v3.5M10 14.3h.01',
};
const Ic = ({ k }: { k: string }) => <svg className="sb-ic" viewBox="0 0 20 20" aria-hidden="true"><path d={I[k]} /></svg>;

type NavItem = { to: string; label: string; ic: string; pro?: boolean };
const LEARN: NavItem[] = [
  { to: '/', label: 'Beranda', ic: 'home' },
  { to: '/materi', label: 'Materi', ic: 'book' },
  { to: '/jalur', label: 'Jalur Belajar', ic: 'path' },
  { to: '/soal', label: 'Bank Soal', ic: 'grid' },
  { to: '/kasus', label: 'Studi Kasus', ic: 'case' },
  { to: '/playground', label: 'Excel Playground', ic: 'play' },
  { to: '/template', label: 'Template Excel', ic: 'tpl' },
  { to: '/pro', label: 'Latihan Pro', ic: 'star', pro: true },
  { to: '/ringkas', label: 'Rumus Ringkas', ic: 'bolt' },
  { to: '/fungsi', label: 'Daftar Fungsi', ic: 'fx' },
  { to: '/fitur', label: 'Fitur Excel', ic: 'ribbon' },
  { to: '/shortcut', label: 'Shortcut', ic: 'key' },
];
const JOB: NavItem[] = [
  { to: '/tes-kerja', label: 'Simulasi Tes Kerja', ic: 'brief', pro: true },
  { to: '/wawancara', label: 'Wawancara & CV', ic: 'chat', pro: true },
  { to: '/shortcut/latihan', label: 'Latihan Shortcut', ic: 'timer', pro: true },
  { to: '/error', label: 'Kamus Error', ic: 'warn' },
];
const ACCOUNT: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard & aktivitas', ic: 'chart' },
  { to: '/peringkat', label: 'Peringkat', ic: 'trophy' },
  { to: '/portofolio', label: 'Portofolio (PDF)', ic: 'doc' },
  { to: '/sertifikat', label: 'Sertifikat', ic: 'award' },
  { to: '/harga', label: 'Paket Pro', ic: 'tag' },
];
const TITLE: [RegExp, string][] = [
  [/^\/$/, 'Ruang belajar'], [/^\/materi/, 'Materi'], [/^\/soal/, 'Bank Soal'], [/^\/kasus/, 'Studi Kasus'], [/^\/playground/, 'Playground'], [/^\/jalur/, 'Jalur Belajar'], [/^\/template/, 'Template Excel'], [/^\/pro/, 'Latihan Pro'],
  [/^\/ringkas/, 'Rumus Ringkas'], [/^\/fungsi/, 'Daftar Fungsi'], [/^\/fitur/, 'Fitur Excel'], [/^\/shortcut\/latihan/, 'Latihan Shortcut'], [/^\/shortcut/, 'Shortcut'], [/^\/tes-kerja/, 'Simulasi Tes Kerja'], [/^\/wawancara/, 'Wawancara & CV'], [/^\/error/, 'Kamus Error'],
  [/^\/dashboard/, 'Dashboard'], [/^\/peringkat/, 'Peringkat'], [/^\/portofolio/, 'Portofolio'], [/^\/sertifikat/, 'Sertifikat'], [/^\/ujian/, 'Ujian akhir'], [/^\/verifikasi/, 'Verifikasi sertifikat'], [/^\/fungsi\//, 'Materi fungsi'], [/^\/harga/, 'Paket Pro'], [/^\/masuk/, 'Masuk'],
];

const isActive = (to: string, path: string) => (to === '/' ? path === '/' : to === '/shortcut' ? path === to : path === to || path.startsWith(to + '/'));

export function TopBar() {
  const { user, profile, signOut } = useAuth();
  const { isPro, p } = useProgress();
  const streakN = currentStreak(p.activity);
  const loc = useLocation();
  const nav = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = profile?.full_name || user?.email?.split('@')[0] || '';
  const initial = (name.trim()[0] || 'J').toUpperCase();
  const avatar = <span className="avatar">{profile?.avatar_url ? <img src={profile.avatar_url} alt="" referrerPolicy="no-referrer" /> : initial}</span>;
  const needLogin = hasSupabase && !user;
  const title = TITLE.find(([re]) => re.test(loc.pathname))?.[1] ?? 'Jagoan Excel';

  useEffect(() => { setDrawer(false); setMenu(false); }, [loc.pathname]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Laci menu HP: tutup dengan Esc, kunci gulir halaman di belakangnya
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [drawer]);

  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setMenu(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [menu]);

  const logout = async () => { setMenu(false); setDrawer(false); await signOut(); nav('/'); };
  const item = (x: NavItem) => (
    <Link key={x.to} to={x.to} aria-current={isActive(x.to, loc.pathname) ? 'page' : undefined}>
      <Ic k={x.ic} /><span>{x.label}</span>{x.pro && !isPro && <i className="sb-pro">Pro</i>}
    </Link>
  );

  return (
    <>
      <aside id="sidebar" className={'sb' + (drawer ? ' open' : '')} aria-label="Menu utama">
        <Link className="sb-brand" to="/" aria-label={BRAND + ', beranda'}>
          <Logo size={44} /><span><b>Jagoan Excel</b><small>{isPro ? 'Member Pro' : 'Ruang belajar'}</small></span>
        </Link>
        <nav className="sb-nav">
          <p className="sb-h">Ruang belajar</p>
          {LEARN.map(item)}
          <p className="sb-h">Persiapan kerja</p>
          {JOB.map(item)}
          <p className="sb-h">Akun &amp; pencapaian</p>
          {ACCOUNT.map(item)}
        </nav>
        <div className="sb-foot">
          {!isPro && <Link className="sb-up" to="/harga"><b>Pro Lifetime</b><span>Sekali bayar, semua terbuka.</span></Link>}
          <ThemeSwitch withLabel />
          <p>Belajar sedikit, setiap hari.</p>
          <p className="sb-copy">© {new Date().getFullYear()} Jagoan Excel · by.eksal</p>
        </div>
      </aside>
      {drawer && <div className="sb-scrim" onClick={() => setDrawer(false)} aria-hidden="true" />}

      <header className={'top' + (scrolled ? ' scrolled' : '')}>
        <div className="top-in">
          <button className="burger" aria-label={drawer ? 'Tutup menu' : 'Buka menu'} aria-expanded={drawer} aria-controls="sidebar" onClick={() => setDrawer(d => !d)}>
            <span /><span /><span />
          </button>
          <Link className="brand top-brand" to="/" aria-label={BRAND + ', beranda'}><Logo /><span className="brand-name">Jagoan<b>Excel</b></span></Link>
          <p className="top-title">{title}</p>
          <SearchButton />
          {streakN > 0 && <Link className="top-streak" to="/dashboard#target" title={`${streakN} hari beruntun`} aria-label={`${streakN} hari beruntun`}><Flame />{streakN}</Link>}
          <div className="top-acct">
            {needLogin ? <Link className="btn sm primary" to="/masuk">Masuk</Link> : (
              <div className="acct-menu" ref={menuRef}>
                <button className="acct" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(m => !m)}>
                  {avatar}<span className="lbl">{user ? name : 'Tamu'}</span><span className={'badge' + (isPro ? ' pro' : '')}>{isPro ? 'Pro' : 'Gratis'}</span>
                  <svg className="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" /></svg>
                </button>
                {menu && (
                  <div className="acct-pop" role="menu">
                    {user && <p className="acct-who">{user.email}</p>}
                    <Link role="menuitem" to="/dashboard">Dashboard</Link>
                    <Link role="menuitem" to="/portofolio">Unduh portofolio PDF</Link>
                    {!isPro && <Link role="menuitem" to="/harga">Buka akses Pro</Link>}
                    <div className="acct-theme"><ThemeSwitch withLabel /></div>
                    {user && <button role="menuitem" className="danger" onClick={logout}>Keluar</button>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
