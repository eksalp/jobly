// Katalog konten: indeks materi, studi kasus, soal, dan cara membentuk URL-nya.
import { LESSONS, MODULES, CERT } from '../content/lessons.js';
import { CASES } from '../content/cases.js';
import { DRILL } from '../content/drills.js';

export type Item = any;

LESSONS.forEach((l: Item) => (l.kind = 'lesson'));
CASES.forEach((c: Item) => { c.kind = 'case'; c.mod = 'kasus'; });

export { LESSONS, MODULES, CERT, CASES, DRILL };
export const BY: Record<string, Item> = Object.fromEntries([...LESSONS, ...CASES].map((x: Item) => [x.id, x]));
export const SCORED: Item[] = LESSONS.filter((l: Item) => !l.sandbox);
export const DIVS: string[] = [...new Set<string>(CASES.map((c: Item) => c.div))];
/** Industri studi kasus; kasus lama tanpa industri dikelompokkan sebagai perkantoran umum. */
export const UMUM = 'Perkantoran umum';
export const indOf = (c: Item): string => c.ind || UMUM;
export const INDS: string[] = [...new Set<string>(CASES.map(indOf))].sort((a, b) => (a === UMUM ? -1 : b === UMUM ? 1 : a.localeCompare(b, 'id')));
export const modOf = (id: string) => MODULES.find((m: Item) => m.id === id);

const PAGES = new Set(['kasus', 'soal', 'ringkas', 'fitur', 'fungsi', 'shortcut', 'harga', 'dashboard', 'masuk', 'pro', 'portofolio', 'sertifikat']);

/** URL untuk sebuah id (materi, kasus, soal, atau halaman). */
export function pathFor(id: string): string {
  if (!id) return '/';
  if (id === 'materi') return '/materi';
  if (/^soal-/.test(id)) return '/soal/' + id;
  const x = BY[id];
  if (x) return x.kind === 'case' ? '/kasus/' + id : '/materi/' + id;
  if (PAGES.has(id)) return '/' + id;
  return '/';
}

export const isFreeItem = (x: Item) =>
  x.kind === 'drill' ? x.level === 'Dasar' : x.kind === 'case' ? !!x.free : !!(modOf(x.mod) && modOf(x.mod).free);

export function certStats(code: string, done: string[]) {
  const ls = LESSONS.filter((l: Item) => (l.cert || []).includes(code));
  const d = ls.filter((l: Item) => done.includes(l.id)).length;
  return { n: ls.length, d, pct: ls.length ? Math.round((d / ls.length) * 100) : 0 };
}

export function drillLevelStats(level: string | '', solved: Record<string, number>) {
  let n = 0, d = 0;
  for (let i = 0; i < DRILL.count; i++) {
    const x = DRILL.at(i);
    if (level && x.t.level !== level) continue;
    n++; if (solved[x.id]) d++;
  }
  return { n, d };
}

export const PRICE = { pro: 29000 };
