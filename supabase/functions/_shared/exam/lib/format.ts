// @ts-nocheck
// DISALIN OTOMATIS oleh scripts/sync-exam.mjs dari src/. Jangan diedit di sini.
import { XL } from '../engine/engine.js';

export const rp = (n: number) => 'Rp' + Math.round(n).toLocaleString('id-ID');
/** Pro lifetime disimpan sebagai tanggal berakhir ≥ tahun 2100. */
export const isLifetime = (t: number | null | undefined) => !!t && new Date(t).getFullYear() >= 2100;
export const fmtUntil = (t: number) => (isLifetime(t) ? 'lifetime' : 'sampai ' + fmtDate(t));
export const fmtDate = (t: number | string | Date) =>
  new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export function fmtSerial(v: number) {
  const p = XL.fromSerial(v);
  return String(p.d).padStart(2, '0') + '/' + String(p.m).padStart(2, '0') + '/' + p.y;
}
export function fmtTime(v: number) {
  const s = Math.round((v - Math.floor(v)) * 86400) % 86400;
  return String(Math.floor(s / 3600)).padStart(2, '0') + ':' + String(Math.floor((s % 3600) / 60)).padStart(2, '0');
}

/** Tampilan nilai sel sesuai format sel (pct, date, time) atau General. */
export function showValue(v: any, f?: string): string {
  if (v == null) return '';
  if (XL.isErr(v)) return v.code;
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  if (typeof v === 'number') {
    if (f === 'pct') return (v * 100).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + '%';
    if (f === 'date') return fmtSerial(v);
    if (f === 'time') return fmtTime(v);
    return v.toLocaleString('id-ID', { maximumFractionDigits: Math.abs(v) >= 1000 ? 2 : 6, useGrouping: Math.abs(v) >= 10000 });
  }
  return String(v);
}

/** Versi ringkas untuk thumbnail kartu. */
export function thumbValue(v: any, f?: string): string {
  if (typeof v === 'number' && !f) {
    const a = Math.abs(v);
    if (a >= 1e6) return (v / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
    return v.toLocaleString('id-ID', { maximumFractionDigits: a < 10 ? 2 : 0, useGrouping: a >= 10000 });
  }
  if (typeof v === 'number' && f === 'pct') return (v * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + '%';
  return showValue(v, f);
}

export const fmtOf = (fmt: Record<string, string> | undefined, k: string) =>
  fmt ? fmt[k] || fmt[k.replace(/\d+/, '')] : undefined;

export const dkey = (d: Date) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
