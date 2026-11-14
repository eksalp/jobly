// Demo animasi untuk materi praktik: dibuat otomatis dari data materi (data, syntax/parts, solusi,
// fill, tips). Kursor bergerak, rumus diketik per bagian, bagian yang sedang dijelaskan disorot
// di bilah rumus dan di lembar, lalu hasilnya muncul. Narasi teks bahasa Indonesia, plus suara
// dari browser (Web Speech API) kalau tersedia suara bahasa Indonesia.
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { XL } from '../engine/engine.js';
import { fmtOf, showValue } from '../lib/format';
import type { Item } from '../lib/catalog';

type Phase = 'base' | 'typing' | 'result' | 'fill';
type Step = {
  cap: string; dur: number; phase: Phase; title?: string;
  cursor?: string | 'handle' | null; sel?: string | null; mark?: boolean;
  typed?: [number, number]; hl?: [number, number] | null; refs?: string[]; fill?: boolean; end?: boolean;
};

const strip = (h: string) => String(h || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const firstSentence = (s: string) => { const m = s.match(/^.*?[.!?](\s|$)/); return (m ? m[0] : s).trim(); };
const readDur = (s: string, min = 2600) => Math.max(min, Math.min(11000, s.split(/\s+/).length * 340 + 1200));
const REF = /\$?[A-Z]{1,3}\$?\d+(?::\$?[A-Z]{1,3}\$?\d+)?/g;
const COLORS = ['#2563eb', '#dc2626', '#7c3aed', '#059669', '#d97706'];
const forSpeech = (s: string) => s
  .replace(/\$/g, '')
  .replace(/([A-Z]{1,3}\d+):([A-Z]{1,3}\d+)/g, '$1 sampai $2')
  .replace(/=/g, ' sama dengan ')
  .replace(/→/g, ',')
  .replace(/[“”"]/g, '');

/** Bangun urutan adegan dari sebuah materi praktik. */
export function buildSteps(x: Item): Step[] {
  const sol: string = x.solution, T: string = x.target;
  const S: Step[] = [];
  const fns = strip(x.fns || '').replace(/·/g, 'dan');
  const t1 = `Di demo singkat ini kamu melihat cara memakai ${fns} langsung di lembar kerja.`;
  S.push({ title: x.title, cap: t1, dur: readDur(t1, 3800), phase: 'base', cursor: null });
  const intro = firstSentence(strip(x.intro));
  if (intro) S.push({ cap: intro, dur: readDur(intro), phase: 'base', cursor: null });
  const task = 'Tugasnya: ' + strip(x.task);
  S.push({ cap: task, dur: readDur(task), phase: 'base', cursor: T, mark: true });
  S.push({ cap: `Klik sel ${T}, lalu awali rumus dengan tanda sama dengan.`, dur: 3200, phase: 'typing', cursor: T, sel: T, typed: [0, 1] });

  // bagian rumus, diurutkan sesuai posisinya di rumus
  const all = ((x.parts || []) as string[][]).map(([tok, desc]) => {
    const t2 = tok.replace(/,\s+/g, ',');
    let i = sol.indexOf(t2), len = t2.length;
    if (i < 0) { const name = tok.split('(')[0].trim(); const j = name ? sol.indexOf(name + '(') : -1; if (j >= 0) { i = j; len = name.length + 1; } }
    return { tok, desc: strip(desc), i, len };
  });
  const parts = all.filter(p => p.i >= 0).sort((a, b) => a.i - b.i);
  const extras = all.filter(p => p.i < 0); // catatan tambahan (mis. F4, COUNTA), dijelaskan setelah hasil muncul
  let cur = 1;
  for (const p of parts) {
    const end = Math.max(cur, p.i + p.len);
    const cap = `${p.tok.replace(/\s*…\s*/g, '…')} → ${p.desc}`;
    const chars = end - cur;
    S.push({ cap, dur: Math.max(readDur(cap, 2800), chars * 90 + 1400), phase: 'typing', cursor: 'fx', sel: T, typed: [cur, end], hl: [p.i, p.i + p.len], refs: p.tok.match(REF) || [] });
    cur = end;
  }
  if (cur < sol.length) {
    const cap = parts.length ? 'Lengkapi rumusnya sampai kurung penutup.' : `Ketik rumusnya: ${sol}`;
    S.push({ cap, dur: Math.max(2600, (sol.length - cur) * 90 + 1400), phase: 'typing', cursor: 'fx', sel: T, typed: [cur, sol.length], refs: parts.length ? [] : sol.match(REF) || [] });
  }
  const res = { phase: 'result' as Phase, cursor: T, sel: T, typed: [sol.length, sol.length] as [number, number] };
  S.push({ ...res, cap: `Tekan Enter. Hasilnya langsung muncul di ${T}.`, dur: 3400 });
  if (x.fill?.to?.length) {
    const last = x.fill.to[x.fill.to.length - 1];
    const cap = `Tarik kotak kecil di pojok kanan bawah ${T} sampai ${last}. Rumusnya ikut menyesuaikan di setiap baris.` + (x.abs ? ' Bagian yang diberi tanda $ tetap terkunci.' : '');
    S.push({ ...res, phase: 'fill', cursor: 'handle', fill: true, cap, dur: readDur(cap, 4200) });
  }
  for (const p of extras) { const cap = `${p.tok} → ${p.desc}`; S.push({ ...res, phase: x.fill ? 'fill' : 'result', fill: !!x.fill, cursor: null, cap, dur: readDur(cap) }); }
  if (x.hint) { const cap = 'Tips: ' + strip(x.hint); S.push({ ...res, phase: x.fill ? 'fill' : 'result', fill: !!x.fill, cursor: null, cap, dur: readDur(cap) }); }
  S.push({ ...res, phase: x.fill ? 'fill' : 'result', fill: !!x.fill, cursor: null, end: true, cap: 'Sekarang giliranmu. Kerjakan sendiri di lembar Praktik di bawah.', dur: 3000 });
  return S;
}

const pickVoice = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  return speechSynthesis.getVoices().find(v => /^id([-_]|$)/i.test(v.lang)) || null;
};

export function DemoPlayer({ x, onTry }: { x: Item; onTry?: () => void }) {
  const steps = useMemo(() => buildSteps(x), [x]);
  const total = steps.reduce((a, s) => a + s.dur, 0);
  const [i, setI] = useState(0);
  const [el, setEl] = useState(0); // ms berjalan di langkah ini
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [sound, setSound] = useState(true);
  const spoke = useRef<{ i: number; done: boolean }>({ i: -1, done: true });
  const last = useRef(0);

  useEffect(() => {
    const v = pickVoice(); if (v) setVoice(v);
    if (!('speechSynthesis' in window)) return;
    const on = () => { const w = pickVoice(); if (w) setVoice(w); };
    speechSynthesis.addEventListener?.('voiceschanged', on);
    return () => { speechSynthesis.removeEventListener?.('voiceschanged', on); speechSynthesis.cancel(); };
  }, []);
  const talk = !!voice && sound;

  const speak = useCallback((k: number) => {
    if (!talk) { spoke.current = { i: k, done: true }; return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(forSpeech((steps[k].title ? steps[k].title + '. ' : '') + steps[k].cap));
    u.voice = voice; u.lang = voice!.lang; u.rate = Math.min(1.6, 1.02 * speed);
    spoke.current = { i: k, done: false };
    u.onend = u.onerror = () => { if (spoke.current.i === k) spoke.current.done = true; };
    speechSynthesis.speak(u);
  }, [talk, voice, speed, steps]);

  // jam utama
  useEffect(() => {
    if (!playing) return;
    if (spoke.current.i !== i) speak(i);
    let raf = 0; last.current = performance.now();
    const tick = (now: number) => {
      const d = (now - last.current) * speed; last.current = now;
      setEl(e => {
        const ne = e + d;
        // pengaman: kalau event selesai bicara tidak pernah datang (bug sebagian browser), lanjut setelah 2,5× durasi
        if (ne >= steps[i].dur && (spoke.current.done || ne >= steps[i].dur * 2.5)) {
          if (i >= steps.length - 1) { setPlaying(false); return steps[i].dur; }
          setI(i + 1); return 0;
        }
        return ne;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, i, speed, speak, steps]);

  const go = (k: number) => { speechSynthesis?.cancel?.(); spoke.current = { i: -1, done: true }; setI(Math.max(0, Math.min(steps.length - 1, k))); setEl(0); };
  const toggle = () => {
    if (playing) { setPlaying(false); speechSynthesis?.cancel?.(); spoke.current = { i: -1, done: true }; setEl(0); return; }
    if (steps[i].end && el >= steps[i].dur) go(0);
    setPlaying(true);
  };

  // lembar
  const st = steps[i];
  const sol: string = x.solution, T: string = x.target;
  const fillTo: string[] = x.fill?.to || [];
  const sheets = useMemo(() => {
    const base = XL.makeSheet({ ...x.data });
    const one = XL.makeSheet({ ...x.data, [T]: sol });
    const all: Record<string, any> = { ...x.data, [T]: sol };
    const p = XL.splitRef(T);
    for (const k of fillTo) { const q = XL.splitRef(k); all[k] = XL.shiftFormula(sol, q.r - p.r, q.c - p.c); }
    return { base, one, all: XL.makeSheet(all) };
  }, [x]);
  const cols = Math.min(x.cols, 10), rows = Math.min(x.rows, 14);
  // baris 1 dianggap judul kolom kalau isinya teks semua
  const headRow = useMemo(() => { const v = Object.entries(x.data || {}).filter(([k]) => /^[A-Z]+1$/.test(k)).map(([, v]) => v); return v.length > 1 && v.every(t => typeof t === 'string' && t[0] !== '='); }, [x]);
  const prog = Math.min(1, el / st.dur);
  const typedLen = st.typed ? Math.round(st.typed[0] + (st.typed[1] - st.typed[0]) * Math.min(1, prog / 0.7)) : 0;
  const nFill = st.fill ? (st.phase === 'fill' && st.cursor === 'handle' ? Math.round(fillTo.length * Math.min(1, Math.max(0, (prog - 0.25) / 0.5))) : fillTo.length) : 0;
  const filled = new Set(fillTo.slice(0, nFill));
  const sheet = st.phase === 'result' || st.phase === 'fill' ? (nFill === fillTo.length && nFill ? sheets.all : sheets.one) : sheets.base;
  const shown = (k: string) => {
    if (k === T && st.phase === 'typing') return { t: sol.slice(0, typedLen), f: true };
    if (filled.has(k) && nFill < fillTo.length) return { t: showValue(sheets.all.value(k), fmtOf(x.fmt, k)), f: false };
    return { t: showValue(sheet.value(k), fmtOf(x.fmt, k)), f: false };
  };

  // posisi kursor & sorotan
  const stage = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState<{ x: number; y: number } | null>(null);
  const [boxes, setBoxes] = useState<{ l: number; t: number; w: number; h: number; c: string }[]>([]);
  useLayoutEffect(() => {
    const s = stage.current; if (!s) return;
    const sb = s.getBoundingClientRect(), z = sb.width / s.offsetWidth || 1;
    const rect = (ref: string) => { const e = s.querySelector<HTMLElement>(`[data-ref="${ref}"]`); if (!e) return null; const b = e.getBoundingClientRect(); return { l: (b.left - sb.left) / z, t: (b.top - sb.top) / z, w: b.width / z, h: b.height / z }; };
    const target = st.cursor === 'handle' ? (() => { const tgt = filled.size ? fillTo[Math.max(0, nFill - 1)] : T; const r = rect(tgt); return r && { x: r.l + r.w - 2, y: r.t + r.h - 2 }; })()
      : st.cursor === 'fx' ? (() => { const e = s.querySelector<HTMLElement>('.dp-fx-t'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: (b.right - sb.left) / z + 4, y: (b.top - sb.top) / z + b.height / 2 }; })()
      : st.cursor ? (() => { const r = rect(st.cursor!); return r && { x: r.l + r.w * 0.55, y: r.t + r.h * 0.6 }; })() : null;
    setCur(target);
    setBoxes((st.refs || []).map((ref, n) => {
      const [a, b] = ref.replace(/\$/g, '').split(':'); const ra = rect(a), rb = rect(b || a);
      if (!ra || !rb) return null;
      return { l: Math.min(ra.l, rb.l), t: Math.min(ra.t, rb.t), w: Math.max(ra.l + ra.w, rb.l + rb.w) - Math.min(ra.l, rb.l), h: Math.max(ra.t + ra.h, rb.t + rb.h) - Math.min(ra.t, rb.t), c: COLORS[n % COLORS.length] };
    }).filter(Boolean) as any);
  }, [i, nFill, typedLen > 0]);

  const fx = st.phase === 'typing' ? sol.slice(0, typedLen) : st.phase === 'base' ? (st.sel ? '' : '') : sol;
  const fxHtml = () => {
    if (!st.hl || st.phase !== 'typing') return <>{fx}</>;
    const [a, b] = st.hl, cut = Math.min(b, fx.length);
    if (a >= fx.length) return <>{fx}</>;
    return <>{fx.slice(0, a)}<mark>{fx.slice(a, cut)}</mark>{fx.slice(cut)}</>;
  };
  const done = steps.slice(0, i).reduce((s, q) => s + q.dur, 0) + Math.min(el, st.dur);
  const mins = Math.max(1, Math.round(total / 60000));

  return (
    <section className="dp" aria-label={`Demo: ${x.title}`}>
      <div className="dp-stage" ref={stage}>
        <div className="dp-fx" aria-hidden="true">
          <span className="dp-nb">{st.sel || T}</span><i>fx</i>
          <span className="dp-fx-t">{fxHtml()}{st.phase === 'typing' && <b className="dp-caret" />}</span>
        </div>
        <div className="dp-grid" style={{ gridTemplateColumns: `30px repeat(${cols}, minmax(64px, auto))` }} aria-hidden="true">
          <span className="dp-h" />
          {Array.from({ length: cols }, (_, c) => <span key={c} className="dp-h">{XL.colName(c)}</span>)}
          {Array.from({ length: rows }, (_, r) => (
            <FragmentRow key={r} r={r} cols={cols} render={(k) => {
              const v = shown(k), isT = k === T;
              return <span key={k} data-ref={k} className={['dp-c', isT && st.sel ? 'sel' : '', isT && st.mark ? 'mark' : '', (x.bold || []).includes(k) || (r === 0 && headRow) ? 'b' : '', v.f ? 'f' : '', filled.has(k) || (isT && st.phase !== 'typing' && st.phase !== 'base') ? 'new' : ''].filter(Boolean).join(' ')}>{v.t}{isT && st.phase === 'typing' && <b className="dp-caret" />}</span>;
            }} />
          ))}
        </div>
        {boxes.map((b, n) => <span key={n} className="dp-box" style={{ left: b.l, top: b.t, width: b.w, height: b.h, borderColor: b.c, background: b.c + '14' }} />)}
        {st.phase === 'fill' && st.cursor === 'handle' && (() => { const r = cur; return r ? <span className="dp-handle" style={{ left: r.x - 3, top: r.y - 3 }} /> : null; })()}
        {cur && <svg className="dp-cursor" style={{ transform: `translate(${cur.x}px, ${cur.y}px)` }} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          {st.cursor === 'handle' ? <path d="M12 3v18M3 12h18" stroke="#111" strokeWidth="2.6" strokeLinecap="round" /> : <path d="M4 3l15 7.5-6.5 1.8L9.8 19z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />}
        </svg>}
        {st.title && <div className="dp-title"><small>Demo materi</small><b>{st.title}</b></div>}
        {(!playing && i === 0 && el === 0) && <button className="dp-poster" onClick={toggle}><span className="dp-play-big" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg></span><b>Putar demo</b><small>sekitar {mins} menit{voice ? ' · dengan suara' : ''}</small></button>}
        {st.end && el >= st.dur * 0.6 && !playing && <div className="dp-endcard"><b>Sekarang giliranmu</b><div><button className="btn primary" onClick={onTry}>Coba sendiri</button><button className="btn" onClick={() => { go(0); setPlaying(true); }}>Putar ulang</button></div></div>}
      </div>
      <p className="dp-cap" aria-live="polite">{st.cap}</p>
      <div className="dp-ctl">
        <button className="dp-b" onClick={toggle} aria-label={playing ? 'Jeda' : 'Putar'}>{playing
          ? <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>
          : <svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>}</button>
        <button className="dp-b" onClick={() => go(i - 1)} aria-label="Langkah sebelumnya" disabled={i === 0}><svg viewBox="0 0 24 24" width="16" height="16"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        <button className="dp-b" onClick={() => go(i + 1)} aria-label="Langkah berikutnya" disabled={i === steps.length - 1}><svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        <div className="dp-seg" role="group" aria-label="Langkah demo">
          {steps.map((s, k) => <button key={k} title={s.cap} aria-label={`Langkah ${k + 1}`} onClick={() => go(k)} style={{ flexGrow: s.dur }}><i style={{ width: k < i ? '100%' : k === i ? `${prog * 100}%` : 0 }} /></button>)}
        </div>
        <span className="dp-time">{Math.floor(done / 1000)}/{Math.round(total / 1000)} dtk</span>
        <button className="dp-b dp-sp" onClick={() => setSpeed(s => (s === 1 ? 1.5 : s === 1.5 ? 0.75 : 1))} aria-label="Kecepatan">{speed}×</button>
        {voice && <button className={'dp-b' + (sound ? ' on' : '')} onClick={() => { setSound(s => !s); speechSynthesis.cancel(); spoke.current = { i, done: true }; }} aria-label={sound ? 'Matikan suara' : 'Nyalakan suara'} aria-pressed={sound}>
          <svg viewBox="0 0 24 24" width="17" height="17"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" />{sound ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M16 9.5l5 5m0-5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}</svg>
        </button>}
      </div>
    </section>
  );
}

function FragmentRow({ r, cols, render }: { r: number; cols: number; render: (k: string) => JSX.Element }) {
  return <>
    <span className="dp-h">{r + 1}</span>
    {Array.from({ length: cols }, (_, c) => render(XL.colName(c) + (r + 1)))}
  </>;
}
