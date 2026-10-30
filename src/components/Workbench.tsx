// Lembar kerja interaktif: bar rumus, kisi sel, klik-untuk-merujuk, F4, salin ke bawah, pemeriksaan jawaban.
import { buildGuide, guideHtml } from '../lib/hintgen';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XL } from '../engine/engine.js';
import { fmtOf, fmtSerial, fmtTime, showValue } from '../lib/format';
import { checkTask, esc, formulaTip, rangeStr, refsIn, shiftFill, solutionSheet, toggleAbsAt, type WorkItem } from '../lib/work';
import { Html } from './Html';
import { argIndexIn, argsOf, fnContext, fnPath, suggest, typingToken } from '../lib/fnhelp';

type Feedback = { type: 'ok' | 'bad' | 'info'; html: string; next?: { to: string; label: string } | null } | null;

export function Workbench(props: {
  item: WorkItem;
  heading: string;
  initial?: Record<string, unknown>;
  solved?: string[];
  done?: boolean;
  next?: { to: string; label: string } | null;
  onAnswers?: (ans: Record<string, unknown>) => void;
  onResult?: (okTargets: string[], allOk: boolean) => void;
  extraActions?: ReactNode;
  /** sel yang dipilih saat pertama tampil */
  start?: string;
  /** mode ujian: tanpa periksa, petunjuk, atau kunci jawaban */
  exam?: boolean;
}) {
  const { item, next } = props;
  const nav = useNavigate();
  const isAll = item.editable === 'all';
  const editable = (k: string) => isAll || (item.editable as Set<string>).has(k);
  const fmt = (k: string) => fmtOf(item.fmt, k);

  const [cells, setCells] = useState<Record<string, any>>(() => {
    const c: Record<string, any> = { ...item.data, ...(props.initial || {}) };
    for (const k in c) if (c[k] === '') delete c[k];
    return c;
  });
  const [sel, setSel] = useState(props.start || item.tasks[0]?.target || 'A1');
  const [cur, setCur] = useState(0);
  const [fb, setFb] = useState<Feedback>(null);
  const [hint, setHint] = useState(false);
  const [results, setResults] = useState<(string | null)[] | null>(() =>
    props.solved && item.tasks.length > 1 ? item.tasks.map(t => (props.solved!.includes(t.target) ? null : '')) : null);
  const [done, setDone] = useState(!!props.done);
  // saran nama fungsi + tooltip argumen, seperti Formula AutoComplete di Excel
  const [fxPos, setFxPos] = useState<number | null>(null);
  const [acI, setAcI] = useState(0);
  const [acOff, setAcOff] = useState(false);

  const fxRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lastInsert = useRef<{ start: number; end: number } | null>(null);
  const pointing = useRef<{ anchor: string } | null>(null);
  const caret = useRef<number | null>(null);
  const first = useRef(true);

  const sheet = useMemo(() => XL.makeSheet(cells), [cells]);
  const multi = item.tasks.length > 1;
  const targets = useMemo(() => new Set(item.tasks.map(t => t.target)), [item]);
  const hl = useMemo(() => refsIn(cells[sel]), [cells, sel]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!props.onAnswers) return;
    const ans: Record<string, unknown> = {};
    for (const k in cells) if (editable(k) && cells[k] !== item.data[k]) ans[k] = cells[k];
    for (const k in item.data) if (editable(k) && !(k in cells)) ans[k] = '';
    props.onAnswers(ans);
  }, [cells]);

  useLayoutEffect(() => {
    if (caret.current != null && fxRef.current) {
      const n = caret.current < 0 ? fxRef.current.value.length : caret.current;
      fxRef.current.setSelectionRange(n, n); caret.current = null;
    }
  });

  useEffect(() => {
    const up = () => { pointing.current = null; };
    document.addEventListener('mouseup', up);
    return () => document.removeEventListener('mouseup', up);
  }, []);

  const rawForBar = (k: string) => {
    const r = cells[k];
    if (typeof r === 'number' && fmt(k) === 'date') return fmtSerial(r);
    if (typeof r === 'number' && fmt(k) === 'time') return fmtTime(r);
    if (typeof r === 'number' && fmt(k) === 'pct') return +(r * 100).toPrecision(12) + '%';
    return r ?? '';
  };
  const setCell = (k: string, v: string) => setCells(prev => { const n = { ...prev }; if (v === '') delete n[k]; else n[k] = v; return n; });
  const hideBad = () => setFb(f => (f && f.type === 'bad' ? null : f));
  const taskOf = (k: string) => item.tasks.findIndex(t => t.target === k || (t.fill || []).includes(k));

  function selectCell(k: string, focus: boolean) {
    setSel(k); lastInsert.current = null;
    const ti = taskOf(k); if (ti >= 0) setCur(ti);
    // Fokus langsung (bukan setTimeout) supaya ketikan pertama tidak hilang; kursor dipindah ke akhir setelah render.
    if (focus && editable(k) && fxRef.current) { fxRef.current.focus({ preventScroll: true }); caret.current = -1; }
    else wrapRef.current?.focus({ preventScroll: true });
  }
  function move(dr: number, dc: number) {
    const p = XL.splitRef(sel);
    const c = Math.min(item.cols - 1, Math.max(0, p.c + dc)), r = Math.min(item.rows, Math.max(1, p.r + dr));
    selectCell(XL.colName(c) + r, false);
  }
  function canPoint() {
    const fx = fxRef.current; if (!fx || document.activeElement !== fx) return false;
    if (!editable(sel) || !fx.value.startsWith('=')) return false;
    const s = fx.selectionStart ?? 0;
    if (lastInsert.current && lastInsert.current.end === s && fx.selectionEnd === s) return true;
    return /[=(,;+\-*/^&<>:]$/.test(fx.value.slice(0, s).replace(/\s+$/, ''));
  }
  function insertRef(txt: string) {
    const fx = fxRef.current!; let s = fx.selectionStart ?? fx.value.length; const e = fx.selectionEnd ?? s;
    if (lastInsert.current && lastInsert.current.end === s && s === e) s = lastInsert.current.start;
    const v = fx.value.slice(0, s) + txt + fx.value.slice(e);
    lastInsert.current = { start: s, end: s + txt.length }; caret.current = s + txt.length;
    setCell(sel, v);
  }

  function check() {
    const ref = solutionSheet(item, cells);
    const res = item.tasks.map(t => checkTask(item, t, cells, sheet, ref));
    const okT = item.tasks.filter((_, i) => !res[i]).map(t => t.target);
    const allOk = res.every(r => !r);
    if (multi) setResults(res);
    props.onResult?.(okT, allOk);
    if (allOk) {
      setDone(true);
      const t = item.tasks[0], v = sheet.value(t.target);
      setFb({ type: 'ok', next, html: multi ? `<strong>Semua ${res.length} tugas benar.</strong> Studi kasus ini selesai.`
        : `<strong>Benar.</strong> ${t.target} = ${esc(showValue(v, fmt(t.target)))}.${t.fill && t.fill.length ? ' Tekan Salin ke bawah untuk melihat rumusnya di baris lain.' : ''}` });
    } else {
      const n = res.filter(r => !r).length;
      setFb({ type: 'bad', html: multi ? `<strong>${n} dari ${res.length} tugas benar.</strong> Lihat keterangan merah di daftar tugas.` : `<strong>Belum tepat.</strong> ${res[0]}` });
      const firstBad = res.findIndex(r => r); if (firstBad >= 0) setCur(firstBad);
    }
  }
  function fillDown() {
    const t = item.tasks[cur];
    const list = t && t.fill && t.fill.length ? [t] : item.tasks.filter(z => z.fill && z.fill.length && cells[z.target]);
    if (!list.length) { setFb({ type: 'bad', html: '<strong>Belum ada yang bisa disalin.</strong> Isi rumusnya dulu, lalu tekan Salin ke bawah.' }); return; }
    const msg: string[] = []; const n = { ...cells };
    for (const z of list) {
      const f = cells[z.target];
      if (f == null || f === '') { msg.push(`${z.target} masih kosong`); continue; }
      shiftFill(n, z, String(f)); msg.push(`${z.target} disalin ke ${z.fill![0]}:${z.fill![z.fill!.length - 1]}`);
    }
    setCells(n);
    const okLock = !t || !t.abs || new RegExp(t.abs, 'i').test(String(cells[t.target] || ''));
    setFb(okLock ? { type: 'ok', html: `<strong>Tersalin.</strong> ${msg.join('; ')}. Klik sel-sel hasilnya untuk melihat alamat yang bergeser.` }
      : { type: 'bad', html: `<strong>Lihat hasilnya.</strong> ${msg.join('; ')}. Alamat yang tidak dikunci ikut bergeser, jadi sebagian hasil salah. Kunci dengan $ lalu salin lagi.` });
  }
  function solve() {
    const t = item.tasks[cur]; setSel(t.target); setCell(t.target, t.solution);
    const fill = t.fill && t.fill.length ? `<br>Rumus ini lalu disalin ke ${t.fill[0]}:${t.fill[t.fill.length - 1]}. Tekan <b>Salin ke bawah</b> untuk mengisinya.` : '';
    const lock = t.abs ? '<br>Perhatikan tanda <b>$</b>: alamat itu dikunci supaya tidak bergeser saat disalin.' : '';
    setFb({ type: 'info', html: `<strong>Jawaban ${t.target}:</strong> <code class="ans-fx">${esc(t.solution)}</code>${fill}${lock}<br><span class="muted">Rumusnya sudah diisi di ${t.target}. Pelajari, lalu tekan Periksa.</span>` });
  }
  function reset() { setCells({ ...item.data }); setFb(null); setResults(null); }

  const fxText = typeof cells[sel] === 'string' ? (cells[sel] as string) : '';
  const before = fxPos == null ? '' : fxText.slice(0, fxPos);
  const tok = editable(sel) && fxPos != null ? typingToken(before) : null;
  const acList = tok && !acOff ? suggest(tok) : [];
  const ctx = editable(sel) && fxPos != null ? fnContext(before) : null;
  const pickFn = (name: string) => {
    const s0 = fxPos ?? fxText.length; const start = s0 - (tok?.length ?? 0);
    const v = fxText.slice(0, start) + name + '(' + fxText.slice(s0);
    caret.current = start + name.length + 1; setFxPos(start + name.length + 1); setAcI(0);
    setCell(sel, v); fxRef.current?.focus({ preventScroll: true });
  };
  const syncPos = (el: HTMLInputElement) => { setFxPos(document.activeElement === el ? el.selectionStart : null); };

  const onFxKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (acList.length) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setAcI(i => (i + 1) % acList.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setAcI(i => (i - 1 + acList.length) % acList.length); return; }
      if (e.key === 'Tab') { e.preventDefault(); pickFn(acList[Math.min(acI, acList.length - 1)][0]); return; }
      if (e.key === 'Escape') { e.preventDefault(); setAcOff(true); return; }
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && next && done) { e.preventDefault(); nav(next.to); return; }
    if (e.key === 'Enter') { e.preventDefault(); if (isAll || props.exam) move(1, 0); else check(); return; }
    if (e.key === 'F4') {
      e.preventDefault(); const fx = e.currentTarget; const r = toggleAbsAt(fx.value, fx.selectionStart ?? 0);
      if (r) { lastInsert.current = null; caret.current = r.caret; setCell(sel, r.value); }
      return;
    }
    if (e.key === 'Escape') wrapRef.current?.focus({ preventScroll: true });
  };
  const onGridKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== wrapRef.current) return;
    const map: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (map[e.key]) { e.preventDefault(); move(...map[e.key]); return; }
    if ((e.key === 'Enter' || e.key === 'F2') && editable(sel)) { e.preventDefault(); selectCell(sel, true); return; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && editable(sel)) { e.preventDefault(); setCell(sel, ''); return; }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && editable(sel)) {
      e.preventDefault(); lastInsert.current = null; caret.current = 1; fxRef.current?.focus({ preventScroll: true }); setCell(sel, e.key);
    }
  };

  // ---------- info sel aktif
  const raw = cells[sel], v = sheet.value(sel), owner = sheet.spillOf(sel);
  let info: ReactNode;
  if (XL.isErr(v)) info = <span className="bad">{v.code} · {v.msg}</span>;
  else if (typeof raw === 'string' && raw[0] === '=') { const sz = sheet.anchorSize(sel); const tip = formulaTip(raw); info = <span>hasil: <b>{showValue(v, fmt(sel))}</b>{typeof v === 'string' ? ' (teks)' : ''}{sz ? ` · tumpah ke ${sz[0]} baris × ${sz[1]} kolom` : ''}{tip && <span className="cs-tip">{tip}</span>}</span>; }
  else if ((raw == null || raw === '') && owner) info = <span>bagian dari hasil array di <b>{owner}</b></span>;
  else if (raw == null || raw === '') info = <span>{editable(sel) ? 'Kosong. Ketik rumus yang diawali tanda = di bar rumus.' : 'Kosong.'}</span>;
  else info = <span>{fmt(sel) === 'date' ? 'tanggal, tersimpan sebagai angka ' + raw : typeof v === 'number' ? 'angka' : typeof v === 'boolean' ? 'nilai logika' : 'teks'}{editable(sel) ? '' : ' · data soal, tidak bisa diubah'}</span>;

  const selCol = sel.replace(/\d+/, ''), selRow = +sel.replace(/\D+/, '');
  const anyFill = item.tasks.some(t => t.fill && t.fill.length), anyHint = item.tasks.some(t => t.hint || /^=/.test(String(t.solution || '')));
  const tk = item.tasks[cur];

  return (
    <section className="task" aria-labelledby="task-h">
      <div className="task-head"><h2 id="task-h">{props.heading}</h2>{done && !props.exam && <span className="pill">Selesai</span>}{multi && <span className="muted" style={{ fontSize: 13 }}>{item.tasks.length} tugas</span>}</div>
      {multi ? (
        <ol className="tasklist">
          {item.tasks.map((t, i) => {
            const r = results ? results[i] : undefined;
            return (
              <li key={t.target}><button type="button" aria-current={i === cur} className={r === null ? 'ok' : r ? 'bad' : ''} onClick={() => { setCur(i); selectCell(t.target, true); }}>
                <span className="tn">{i + 1}</span><span><Html as="span" html={t.text || ''} />{r ? <Html as="span" className="why" html={r} /> : null}</span>
              </button></li>
            );
          })}
        </ol>
      ) : tk?.text ? <Html as="p" className="task-text" style={{ margin: 0, maxWidth: '72ch' }} html={tk.text} /> : null}

      <div className="book">
        <div className="fbar">
          <span className="namebox">{sel}</span><span className="fxl" aria-hidden="true">fx</span>
          <input id="fx" ref={fxRef} aria-label="Bar rumus" autoComplete="off" autoCapitalize="off" spellCheck={false}
            value={rawForBar(sel)} readOnly={!editable(sel)} placeholder={editable(sel) ? 'Ketik rumus, misalnya =SUM(B2:B6)' : ''}
            onChange={e => { lastInsert.current = null; setCell(sel, e.target.value); hideBad(); setFxPos(e.target.selectionStart); setAcI(0); setAcOff(false); }} onKeyDown={onFxKey}
            onSelect={e => syncPos(e.currentTarget)} onFocus={e => syncPos(e.currentTarget)} onBlur={() => window.setTimeout(() => setFxPos(null), 150)}
            role="combobox" aria-expanded={acList.length > 0} aria-controls="fx-ac" aria-autocomplete="list" />
          {acList.length > 0 && (
            <ul className="fx-ac" id="fx-ac" role="listbox" aria-label="Saran fungsi">
              {acList.map((f, i) => (
                <li key={f[0]} role="option" aria-selected={i === acI} onMouseDown={e => { e.preventDefault(); pickFn(f[0]); }} onMouseEnter={() => setAcI(i)}>
                  <b>{f[0]}</b><span>{f[3]}</span>
                </li>
              ))}
              <li className="fx-ac-k" aria-hidden="true">Tab untuk memilih · Esc untuk menutup</li>
            </ul>
          )}
          {!acList.length && ctx && (() => {
            const args = argsOf(ctx.fn[2]); const ai = argIndexIn(args, ctx.arg);
            return <div className="fx-tip" role="note">{ctx.fn[0]}({args.map((a, i) => <span key={i}>{i > 0 && ', '}{i === ai ? <b>{a}</b> : a}</span>)}) <a href={fnPath(ctx.fn[0])} onMouseDown={e => { e.preventDefault(); nav(fnPath(ctx.fn[0])); }}>materi</a></div>;
          })()}
        </div>
        <div className="sheet-wrap" ref={wrapRef} tabIndex={0} aria-label="Lembar kerja" onKeyDown={onGridKey}>
          <table className="sheet">
            <thead><tr><th className="corner" />{Array.from({ length: item.cols }, (_, c) => { const cn = XL.colName(c); return <th key={cn} className={cn === selCol ? 'colsel' : ''}>{cn}</th>; })}</tr></thead>
            <tbody>
              {Array.from({ length: item.rows }, (_, i) => {
                const r = i + 1;
                return (
                  <tr key={r}><th className="rn" style={r === selRow ? { background: 'var(--accent-soft)', color: 'var(--accent-strong)', fontWeight: 600 } : undefined}>{r}</th>
                    {Array.from({ length: item.cols }, (_, c) => {
                      const k = XL.colName(c) + r, rv = cells[k], val = sheet.value(k);
                      const empty = rv == null || rv === '', spill = empty && !!sheet.spillOf(k);
                      const cls = [
                        typeof val === 'number' || typeof val === 'boolean' ? 'num' : '', XL.isErr(val) ? 'err' : '',
                        editable(k) && !isAll ? 'edit' : '', targets.has(k) ? 'target' : '', empty && !spill ? 'empty' : '', spill ? 'spill' : '',
                        typeof rv === 'string' && rv[0] === '=' && !editable(k) ? 'hasfx' : '',
                        /^[A-Z]+1$/.test(k) || (item.bold || []).includes(k) ? 'hd' : '', hl.has(k) && k !== sel ? 'hl' : '', k === sel ? 'sel' : '',
                      ].filter(Boolean).join(' ');
                      return (
                        <td key={k} className={cls}
                          onMouseDown={e => { e.preventDefault(); if (k !== sel && canPoint()) { pointing.current = { anchor: k }; insertRef(k); return; } selectCell(k, true); }}
                          onMouseEnter={e => { if (pointing.current && e.buttons & 1) insertRef(rangeStr(pointing.current.anchor, k)); }}>
                          {showValue(val, fmt(k))}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="cellinfo"><b>{sel}</b>{info}</div>
      </div>

      <div className="actions">
        {isAll || props.exam ? <><button className="btn" onClick={reset}>Kosongkan isian</button>{props.exam && anyFill && <button className="btn" onClick={fillDown}>Salin ke bawah</button>}</> : <>
          <button className="btn primary" onClick={check}>{multi ? 'Periksa semua' : 'Periksa jawaban'} <span className="kbd">Enter</span></button>
          {anyFill && <button className="btn" onClick={fillDown}>Salin ke bawah</button>}
          {anyHint && <button className="btn ghost" aria-expanded={hint} onClick={() => setHint(h => !h)}>Petunjuk</button>}
          <button className="btn ghost" onClick={solve}>Lihat jawaban{multi ? ' tugas ini' : ''}</button>
          <button className="btn ghost" onClick={reset}>Ulangi</button>
        </>}
        {props.extraActions}
      </div>
      {hint && tk && <Html className="hint hint-guide" html={(() => { const g = buildGuide(tk, item.data, fmt, item.tasks.flatMap(z => [z.target, ...(z.fill || [])])); return g ? guideHtml(g, tk.target) : (tk.hint || 'Belum ada petunjuk untuk tugas ini.'); })()} />}
      {fb && (
        <div className={'feedback ' + fb.type} role="status" aria-live="polite">
          <Html as="span" className="msg" html={fb.html} />
          {fb.next && <Link className="btn primary" to={fb.next.to}>{fb.next.label} →</Link>}
        </div>
      )}
    </section>
  );
}
