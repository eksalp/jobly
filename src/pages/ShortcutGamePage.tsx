// Latihan shortcut Excel: 60 detik, tebak sebanyak mungkin. Mode tekan tombol (keyboard) atau pilihan ganda (HP).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SC_GAME, SC_LEVELS, type ScItem } from '../content/shortcutgame.js';
import { Keys } from './RefPages';
import { useProgress } from '../lib/progress';
import { Paywall } from '../components/Buy';

const ROUND = 60;
const BEST_KEY = 'kr.sc.best';
type Mode = 'ketik' | 'pilih';
const MODS = new Set(['ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'CapsLock']);
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const touchOnly = () => typeof window !== 'undefined' && window.matchMedia?.('(hover: none) and (pointer: coarse)').matches;

const readBest = (): Record<string, number> => { try { const x = JSON.parse(localStorage.getItem(BEST_KEY) || '{}'); return x && typeof x === 'object' ? x : {}; } catch { return {}; } };
const shuffle = <T,>(a: T[]) => { const c = a.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c; };

/** Apakah tombol yang ditekan sama dengan shortcut ini. ⌘ di Mac dianggap Ctrl. */
export function matchKey(x: ScItem, e: { code: string; ctrlKey: boolean; metaKey: boolean; shiftKey: boolean; altKey: boolean }) {
  const ctrl = e.ctrlKey || e.metaKey;
  return e.code === x.code && ctrl === !!x.c && e.shiftKey === !!x.s && e.altKey === !!x.a;
}
/** Tulisan tombol yang ditekan, untuk umpan balik saat salah. */
function pressed(e: KeyboardEvent) {
  const k = e.code.replace(/^Key/, '').replace(/^Digit/, '').replace('Arrow', 'Panah ').replace('Space', 'Spasi').replace('Semicolon', ';').replace('Equal', '=').replace('Minus', '-').replace('Backquote', '`').replace('BracketLeft', '[');
  return [e.ctrlKey && 'Ctrl', e.metaKey && '⌘', e.altKey && 'Alt', e.shiftKey && 'Shift', k].filter(Boolean).join(' + ');
}

export default function ShortcutGamePage() {
  const pr = useProgress();
  const [mode, setMode] = useState<Mode>(() => (touchOnly() ? 'pilih' : 'ketik'));
  const [lv, setLv] = useState(1);
  const [state, setState] = useState<'idle' | 'play' | 'end'>('idle');
  const [queue, setQueue] = useState<ScItem[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [miss, setMiss] = useState<ScItem[]>([]);
  const [wrong, setWrong] = useState(0);
  const [fb, setFb] = useState<{ ok: boolean; text: string } | null>(null);
  const [end, setEnd] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [best, setBest] = useState(readBest);
  const lock = useRef(false);
  useEffect(() => { document.title = 'Latihan Shortcut Excel · Jagoan Excel'; }, []);

  const pool = useMemo(() => SC_GAME.filter(x => x.lv <= lv), [lv]);
  const cur = queue[i];
  const left = Math.max(0, end - now);
  const bestKey = mode + '-' + lv;

  const next = useCallback(() => {
    setWrong(0); lock.current = false;
    setI(n => { if (n + 1 >= queue.length) { setQueue(q => [...q, ...shuffle(pool)]); } return n + 1; });
  }, [queue.length, pool]);

  const start = () => { setQueue(shuffle(pool)); setI(0); setScore(0); setMiss([]); setWrong(0); setFb(null); lock.current = false; setEnd(Date.now() + ROUND * 1000); setNow(Date.now()); setState('play'); };

  const answer = useCallback((ok: boolean, got?: string) => {
    if (!cur || lock.current) return;
    if (ok) { setScore(s => s + 1); setFb({ ok: true, text: 'Benar · ' + cur.k }); next(); return; }
    const w = wrong + 1; setWrong(w);
    if (w >= 2 || mode === 'pilih') {
      lock.current = true; setMiss(m => (m.includes(cur) ? m : [...m, cur]));
      setFb({ ok: false, text: 'Jawabannya ' + cur.k });
      window.setTimeout(next, 1100);
    } else setFb({ ok: false, text: (got ? 'Kamu menekan ' + got + '. ' : '') + 'Coba sekali lagi.' });
  }, [cur, wrong, mode, next]);

  const skip = () => { if (!cur || lock.current) return; setMiss(m => (m.includes(cur) ? m : [...m, cur])); setFb({ ok: false, text: 'Dilewati · ' + cur.k }); next(); };

  // tombol keyboard
  useEffect(() => {
    if (state !== 'play' || mode !== 'ketik') return;
    const on = (e: KeyboardEvent) => {
      if (MODS.has(e.code) || e.repeat) return;
      if (e.code === 'Escape') { setEnd(Date.now()); return; }
      e.preventDefault(); e.stopPropagation();
      if (cur) answer(matchKey(cur, e), pressed(e));
    };
    window.addEventListener('keydown', on, { capture: true });
    return () => window.removeEventListener('keydown', on, { capture: true });
  }, [state, mode, cur, answer]);

  // waktu
  useEffect(() => {
    if (state !== 'play') return;
    const t = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(t);
  }, [state]);
  useEffect(() => {
    if (state === 'play' && left <= 0) {
      setState('end'); setFb(null);
      const b = { ...readBest() }; if (score > (b[bestKey] || 0)) { b[bestKey] = score; try { localStorage.setItem(BEST_KEY, JSON.stringify(b)); } catch { /* abaikan */ } }
      setBest(b);
      if (score > 0) pr.track('shortcut-' + bestKey, 'latihan shortcut');
    }
  }, [left <= 0, state]);

  const options = useMemo(() => {
    if (!cur || mode !== 'pilih') return [];
    const others = shuffle(SC_GAME.filter(x => x.k !== cur.k && x.d !== cur.d)).slice(0, 3);
    return shuffle([cur, ...others]);
  }, [cur, mode]);

  const lvName = SC_LEVELS.find(x => x.lv === lv)!.name;
  const share = `Aku dapat ${score} shortcut Excel dalam 60 detik (level ${lvName}) di Jagoan Excel. Berani coba? https://jagoanexcel.com/shortcut/latihan`;

  return (
    <div className="wrap page sc">
      <p className="crumb"><Link to="/shortcut">Shortcut</Link> › Latihan</p>
      <div className="page-head"><p className="eyebrow">Latihan 60 detik</p><h1>Latihan shortcut Excel</h1>
        <p>Satu perintah muncul, tekan shortcut-nya secepat mungkin. Kamu punya 60 detik.</p></div>

      {state !== 'play' && (
        <div className="sc-setup">
          <div className="sc-opt"><span>Mode</span>
            <div className="seg" role="radiogroup" aria-label="Mode">
              <button role="radio" aria-checked={mode === 'ketik'} onClick={() => setMode('ketik')}>Tekan tombol</button>
              <button role="radio" aria-checked={mode === 'pilih'} onClick={() => setMode('pilih')}>Pilihan ganda</button>
            </div></div>
          <div className="sc-opt"><span>Level</span>
            <div className="seg" role="radiogroup" aria-label="Level">
              {SC_LEVELS.map(x => <button key={x.lv} role="radio" aria-checked={lv === x.lv} onClick={() => setLv(x.lv)}>{x.name} <small>{SC_GAME.filter(y => y.lv <= x.lv).length}</small></button>)}
            </div></div>
          {mode === 'ketik' && <p className="muted sc-note">Butuh keyboard fisik.{isMac ? ' Di Mac, tekan ⌘ sebagai pengganti Ctrl. Beberapa shortcut dipakai macOS, jadi kalau tidak bisa, pakai mode pilihan ganda.' : ''} Tekan Esc untuk berhenti.</p>}
          {mode === 'pilih' && <p className="muted sc-note">Pas untuk di HP: pilih jawaban yang benar dari 4 pilihan.</p>}
          <p className="sc-best">Skor terbaikmu ({mode === 'ketik' ? 'tekan tombol' : 'pilihan ganda'}, {lvName}): <b>{best[bestKey] || 0}</b></p>
        </div>
      )}

      {state === 'end' && (
        <div className="sc-end" role="status">
          <div className="ex-score"><b>{score}</b><span> shortcut</span></div>
          <p>{score >= (best[bestKey] || 0) && score > 0 ? 'Rekor baru! ' : ''}Dalam 60 detik, level {lvName}.</p>
          {miss.length > 0 && <><h2>Yang perlu diulang</h2><ul className="sc-miss">{miss.map(x => <li key={x.k}><span>{x.d}</span><span className="sc-keys"><Keys k={x.k} /></span></li>)}</ul></>}
          <div className="cta"><a className="btn ghost" href={'https://wa.me/?text=' + encodeURIComponent(share)} target="_blank" rel="noopener noreferrer">Tantang teman lewat WhatsApp</a></div>
        </div>
      )}

      {!pr.isPro ? <Paywall what="Latihan shortcut" desc="Game latihan shortcut 60 detik khusus member Pro. Daftar lengkap shortcut Excel tetap bisa kamu baca gratis." /> : state !== 'play' ? <button className="btn primary lg sc-start" onClick={start}>{state === 'end' ? 'Main lagi' : 'Mulai'}</button> : cur && (
        <div className="sc-play">
          <div className="sc-bar"><span className="sc-time" role="timer">{Math.ceil(left / 1000)} dtk</span><span className="sc-meter"><span style={{ width: (left / (ROUND * 10)) + '%' }} /></span><b>{score}</b></div>
          <div className="sc-card" aria-live="polite">
            <p className="sc-ask">{cur.d}</p>
            {mode === 'ketik' ? <p className="muted sc-hint">Tekan shortcut-nya sekarang</p> : (
              <div className="sc-opts">{options.map(o => <button key={o.k} className="btn" onClick={() => answer(o.k === cur.k)}><Keys k={o.k} /></button>)}</div>
            )}
            {fb && <p className={'sc-fb ' + (fb.ok ? 'ok' : 'bad')}>{fb.text}</p>}
          </div>
          <div className="cta"><button className="btn ghost sm" onClick={skip}>Lewati</button><button className="btn ghost sm" onClick={() => setEnd(Date.now())}>Berhenti</button></div>
        </div>
      )}
      <p className="muted" style={{ marginTop: 24, fontSize: 13.5 }}>Mau lihat semua shortcut? Buka <Link to="/shortcut">daftar shortcut Excel</Link>.</p>
    </div>
  );
}
