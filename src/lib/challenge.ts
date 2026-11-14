// Tantangan harian: satu soal yang sama untuk semua orang, berganti setiap hari (WIB).
// Soal diambil dari pola tingkat Menengah dan Advanced, versi ditentukan dari tanggal.
import { DRILL } from '../content/drills.js';

const KEY = 'kelasRumus.tantangan';
const START = Date.UTC(2026, 10, 1); // tantangan #1 = 1 November 2026

/** Tanggal hari ini di WIB, format YYYY-MM-DD. */
export function wibDate(now = new Date()) {
  const d = new Date(now.getTime() + 7 * 3600e3);
  return d.toISOString().slice(0, 10);
}
const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

export function challengeFor(date = wibDate()) {
  const pool = (DRILL.templates as any[]).filter(t => (t.level === 'Menengah' || t.level === 'Advanced') && !/pivot/i.test(t.key) && !/^x-/.test(t.key));
  const h = hash('tantangan#' + date);
  const k = 1 + ((h >>> 8) % DRILL.seeds);
  let t = pool[h % pool.length];
  // soal PivotTable butuh tampilan khusus; lewati
  for (let i = 1; i < pool.length && DRILL.build(`soal-${t.key}-${k}`)?.pivot; i++) t = pool[(h + i) % pool.length];
  const n = Math.floor((Date.parse(date + 'T00:00:00Z') - START) / 864e5) + 1;
  return { id: `soal-${t.key}-${k}`, n, date, level: t.level as string, title: t.title as string };
}

export type Log = Record<string, number>; // tanggal → detik
export function getLog(): Log { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { return {}; } }
export function saveResult(date: string, secs: number) {
  const log = getLog(); if (log[date] == null || secs < log[date]) log[date] = secs;
  try { localStorage.setItem(KEY, JSON.stringify(log)); } catch { /* abaikan */ }
  return log;
}
export const fmtTime = (s: number) => { const m = Math.floor(s / 60), d = Math.round(s % 60); return m ? `${m} menit ${d} detik` : `${d} detik`; };
export const shortTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
/** Tantangan beruntun: hari berturut-turut sampai hari ini (atau kemarin) yang diselesaikan. */
export function challengeStreak(log: Log, today = wibDate()) {
  let n = 0; let d = new Date(today + 'T00:00:00Z');
  if (log[today] == null) d = new Date(d.getTime() - 864e5);
  while (log[d.toISOString().slice(0, 10)] != null) { n++; d = new Date(d.getTime() - 864e5); }
  return n;
}
