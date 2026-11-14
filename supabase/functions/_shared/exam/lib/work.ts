// @ts-nocheck
// DISALIN OTOMATIS oleh scripts/sync-exam.mjs dari src/. Jangan diedit di sini.
// Mengubah materi, studi kasus, soal bank, dan lembar bebas menjadi satu bentuk "WorkItem"
// yang dipakai komponen Workbench, plus logika pemeriksaan jawaban.
import { XL } from '../engine/engine.js';
import { showValue, fmtOf } from './format.ts';
// deno-lint-ignore no-explicit-any
type Item = any;

export type Task = {
  target: string; solution: string; use?: string[]; abs?: string; absMsg?: string;
  test?: (raw: string) => string | null; caseSensitive?: boolean; hint?: string; text?: string; fill?: string[] | null;
};
export type WorkItem = {
  id: string; kind: 'lesson' | 'case' | 'drill' | 'sandbox';
  cols: number; rows: number; data: Record<string, any>; fmt?: Record<string, string>; bold?: string[];
  tasks: Task[]; editable: Set<string> | 'all';
};

export function fromLesson(l: Item): WorkItem {
  if (l.sandbox) return { id: l.id, kind: 'sandbox', cols: l.cols, rows: l.rows, data: l.data, fmt: l.fmt, bold: l.bold, tasks: [], editable: 'all' };
  const fill: string[] | null = l.fill ? l.fill.to : null;
  const ed = new Set<string>(l.editable || [l.target]); (fill || []).forEach(k => ed.add(k));
  return {
    id: l.id, kind: l.kind === 'drill' ? 'drill' : 'lesson', cols: l.cols, rows: l.rows, data: l.data, fmt: l.fmt, bold: l.bold, editable: ed,
    tasks: [{ target: l.target, solution: l.solution, use: l.use, abs: l.abs, absMsg: l.absMsg, test: l.test, caseSensitive: l.caseSensitive, hint: l.hint, text: l.task, fill }],
  };
}
export function fromCase(c: Item): WorkItem {
  const ed = new Set<string>();
  c.tasks.forEach((t: Task & { editable?: string[] }) => { ed.add(t.target); (t.fill || []).forEach(k => ed.add(k)); (t.editable || []).forEach(k => ed.add(k)); });
  return { id: c.id, kind: 'case', cols: c.cols, rows: c.rows, data: c.data, fmt: c.fmt, bold: c.bold, tasks: c.tasks, editable: ed };
}

export const esc = (s: string) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as any)[c]);

export function same(a: any, b: any, cs?: boolean) {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
  if (typeof a === 'string' && typeof b === 'string') return cs ? a === b : a.toLowerCase() === b.toLowerCase();
  if (XL.isErr(a) && XL.isErr(b)) return a.code === b.code;
  return a === b;
}
export function usesFn(raw: string, item: string) {
  const s = raw.replace(/"(?:[^"]|"")*"/g, '""');
  return item.split('|').some(n => n === '&' ? s.includes('&') : new RegExp('(^|[^A-Z.])' + n.replace(/\./g, '\\.') + '\\s*\\(', 'i').test(s));
}
export function shiftFill(cells: Record<string, any>, t: Task, formula = t.solution) {
  const p = XL.splitRef(t.target);
  for (const k of t.fill || []) { const q = XL.splitRef(k); cells[k] = XL.shiftFormula(formula, q.r - p.r, q.c - p.c); }
}
export function solutionSheet(item: WorkItem, cells: Record<string, any>) {
  const c = { ...cells };
  for (const t of item.tasks) { c[t.target] = t.solution; shiftFill(c, t); }
  return XL.makeSheet(c);
}

/** null = benar; string (boleh berisi HTML sederhana) = alasan belum benar. */
export function checkTask(item: WorkItem, t: Task, cells: Record<string, any>, sheet: any, ref: any): string | null {
  const raw = String(cells[t.target] ?? '').trim();
  const f = (k: string) => fmtOf(item.fmt, k);
  if (!raw) return `Sel ${t.target} masih kosong.`;
  if (raw[0] !== '=') return 'Ini masih nilai biasa, belum rumus. Rumus selalu diawali tanda sama dengan (=).';
  const v = sheet.value(t.target);
  if (XL.isErr(v)) return `${esc(v.code)}: ${esc(v.msg)}.`;
  if (t.use) {
    const miss = t.use.filter(u => !usesFn(raw, u));
    if (miss.length) return `Tugas ini melatih ${t.use.map(u => u.split('|').map(z => '<code>' + esc(z) + '</code>').join(' atau ')).join(' dan ')}. Coba tulis ulang rumusnya memakai fungsi itu.`;
  }
  if (!/\$?[A-Z]{1,3}\$?\d+/i.test(raw.replace(/"(?:[^"]|"")*"/g, ''))) return 'Pakai alamat sel. Kalau angkanya diketik langsung, hasilnya tidak ikut berubah saat data berubah.';
  const ev = ref.value(t.target);
  if (!same(v, ev, t.caseSensitive)) {
    const tip = formulaTip(raw); if (tip) return esc(tip);
    const deps = item.tasks.indexOf(t) > 0 ? ' Pastikan juga tugas sebelumnya sudah benar dan sudah disalin ke bawah.' : '';
    return `Rumusnya jalan, tapi hasilnya ${esc(showValue(v, f(t.target)))}${typeof v === 'string' ? ' (teks)' : ''}. Periksa lagi sel dan operator yang dipakai.${deps}`;
  }
  const sz = ref.anchorSize(t.target);
  if (sz) {
    const p = XL.splitRef(t.target); const mine = sheet.anchorSize(t.target);
    if (!mine || mine[0] !== sz[0] || mine[1] !== sz[1]) return `Hasilnya seharusnya ${sz[0]} baris × ${sz[1]} kolom.`;
    for (let i = 0; i < sz[0]; i++) for (let j = 0; j < sz[1]; j++) {
      const k = XL.colName(p.c + j) + (p.r + i);
      if (!same(sheet.value(k), ref.value(k), t.caseSensitive)) return `Isi di ${k} belum sesuai.`;
    }
  }
  if (t.abs && !new RegExp(t.abs, 'i').test(raw)) return t.absMsg || 'Kunci alamat sel dengan $.';
  if (t.test) { const m = t.test(raw); if (m) return m; }
  return null;
}

export function refsIn(raw: unknown): Set<string> {
  const set = new Set<string>();
  if (typeof raw !== 'string' || raw[0] !== '=') return set;
  let toks: any[]; try { toks = XL.tokenize(raw.slice(1)); } catch { return set; }
  for (const t of toks) if (t.type === 'ref') {
    if (t.v.includes(':')) { const [a, b] = t.v.split(':'); if (XL.splitRef(a) && XL.splitRef(b)) { try { XL.expandRange(a, b).flat().forEach((k: string) => set.add(k)); } catch { /* rentang terlalu besar: tidak disorot */ } } }
    else set.add(t.v);
  }
  return set;
}

export function toggleAbsAt(value: string, pos: number): { value: string; caret: number } | null {
  const re = /(\$?[A-Za-z]{1,3}\$?\d+)(:\$?[A-Za-z]{1,3}\$?\d+)?/g; let m: RegExpExecArray | null;
  while ((m = re.exec(value))) {
    const s = m.index, e = s + m[0].length;
    if (pos >= s && pos <= e) {
      const parts = m[0].split(':');
      const st = (p: string) => /^\$[A-Z]+\$\d/i.test(p) ? 1 : /^[A-Z]+\$\d/i.test(p) ? 2 : /^\$[A-Z]+\d/i.test(p) ? 3 : 0;
      const ns = (st(parts[0]) + 1) % 4;
      const ap = (p: string) => { const q = /^\$?([A-Za-z]+)\$?(\d+)$/.exec(p)!; return ns === 1 ? '$' + q[1] + '$' + q[2] : ns === 2 ? q[1] + '$' + q[2] : ns === 3 ? '$' + q[1] + q[2] : q[1] + q[2]; };
      const rep = parts.map(ap).join(':');
      return { value: value.slice(0, s) + rep + value.slice(e), caret: s + rep.length };
    }
  }
  return null;
}

export function rangeStr(a: string, b: string) {
  if (a === b) return a;
  const r = XL.expandRange(a, b);
  return r[0][0] + ':' + r[r.length - 1][r[0].length - 1];
}

/** Tips untuk kesalahan umum yang tetap menghasilkan angka, misalnya SUM(C2,C11) padahal maksudnya C2:C11. */
export function formulaTip(raw: string): string | null {
  if (typeof raw !== 'string' || raw[0] !== '=') return null;
  const s = raw.replace(/"(?:[^"]|"")*"/g, '""').toUpperCase();
  const re = /\b(SUM|AVERAGE|COUNT|COUNTA|MAX|MIN|PRODUCT|MEDIAN|STDEV\.S|STDEV)\s*\(\s*\$?([A-Z]{1,3})\$?(\d+)\s*[,;]\s*\$?([A-Z]{1,3})\$?(\d+)\s*\)/;
  const m = re.exec(s);
  if (!m) return null;
  const [, fn, c1, r1, c2, r2] = m;
  const gap = c1 === c2 ? Math.abs(+r2 - +r1) : r1 === r2 ? 2 : 0;
  if (gap < 2) return null;
  return `Rumusmu memakai pemisah koma, jadi ${fn} hanya menghitung dua sel: ${c1}${r1} dan ${c2}${r2}. Kalau maksudnya semua sel dari ${c1}${r1} sampai ${c2}${r2}, pakai titik dua: =${fn}(${c1}${r1}:${c2}${r2}).`;
}
