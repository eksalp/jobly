// Kelompok topik bank soal untuk fokus profesi (dipakai di Bank Soal dan Jalur Belajar).
import { DRILL } from '../content/drills.js';

export type Focus = { id: string; label: string; topics: string[] };
export const FOCUS: Focus[] = [
  { id: 'keuangan', label: 'Keuangan', topics: ['Keuangan', 'Gabungan keuangan', 'Pajak & keuangan'] },
  { id: 'akuntansi', label: 'Akuntansi', topics: ['Akuntansi', 'Gabungan akuntansi'] },
  { id: 'pajak', label: 'Perpajakan', topics: ['Perpajakan', 'Gabungan pajak', 'Pajak & keuangan'] },
  { id: 'audit', label: 'Audit', topics: ['Audit', 'Gabungan audit'] },
  { id: 'hots', label: 'HOTS (analisis & penalaran)', topics: ['HOTS'] },
];
const PREFIX = 'fokus:';
export const focusValue = (id: string) => PREFIX + id;
export const focusOf = (tp: string) => (tp.startsWith(PREFIX) ? FOCUS.find(f => f.id === tp.slice(PREFIX.length)) || null : null);
/** Cocokkan topik soal dengan filter: kosong, satu topik, atau kelompok fokus. */
export function topicOk(topic: string, tp: string) {
  if (!tp) return true;
  const f = focusOf(tp);
  return f ? f.topics.includes(topic) : topic === tp;
}
export function focusCount(id: string) {
  const f = FOCUS.find(x => x.id === id); if (!f) return { patterns: 0, hard: 0, soal: 0 };
  const ts = DRILL.templates.filter((t: any) => f.topics.includes(t.topic));
  return { patterns: ts.length, hard: ts.filter((t: any) => t.level === 'Advanced' || t.level === 'Expert').length, soal: ts.length * DRILL.seeds };
}
