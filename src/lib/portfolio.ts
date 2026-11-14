// Portofolio kemampuan Excel: ringkasan progres belajar, lalu dibuat menjadi PDF A4 di browser (jsPDF).
import { CASES, CERT, DRILL, LESSONS, MODULES, SCORED, certStats, drillLevelStats, type Item } from './catalog';
import type { Progress } from './progress';
import { dkey } from './format';
import { XL } from '../engine/engine.js';
import { gridBounds, type Evidence } from './evidence';
import { fnsIn } from './fnhelp';
import { portfolioHeadOps, stripOps } from './certlayout';
import { drawOps, loadLogos, pdfMeasure } from './certdraw';

export type Portfolio = {
  name: string; email: string; issued: Date; since: number; pro: string;
  lessons: { done: number; total: number }; cases: { done: number; total: number }; drills: number; activeDays: number; streak: number;
  modules: { title: string; done: number; total: number }[];
  levels: { level: string; done: number; total: number }[];
  cert: { exam: string; title: string; pct: number }[];
  caseList: { title: string; div: string }[];
  skills: string[];
};

export function buildPortfolio(p: Progress, o: { name: string; email: string; pro: string }): Portfolio {
  const doneL = SCORED.filter((l: Item) => p.done.includes(l.id));
  const doneC = CASES.filter((c: Item) => p.done.includes(c.id));
  const d = new Date(); if (!p.activity[dkey(d)]) d.setDate(d.getDate() - 1);
  let streak = 0; while (p.activity[dkey(d)]) { streak++; d.setDate(d.getDate() - 1); }
  return {
    name: o.name, email: o.email, pro: o.pro, issued: new Date(), since: p.since,
    lessons: { done: doneL.length, total: SCORED.length },
    cases: { done: doneC.length, total: CASES.length },
    drills: Object.keys(p.drill).length,
    activeDays: Object.values(p.activity).filter(v => v > 0).length,
    streak,
    modules: MODULES.filter((m: Item) => m.id !== 'latihan').map((m: Item) => {
      const ls = LESSONS.filter((l: Item) => l.mod === m.id);
      return { title: m.title, done: ls.filter((l: Item) => p.done.includes(l.id)).length, total: ls.length };
    }).filter((m: { total: number }) => m.total > 0),
    levels: DRILL.levels.map((lv: string) => { const s = drillLevelStats(lv, p.drill); return { level: lv, done: s.d, total: s.n }; }),
    cert: CERT.map((c: Item) => ({ exam: c.exam, title: c.title, pct: certStats(c.code, p.done).pct })),
    caseList: doneC.map((c: Item) => ({ title: c.title, div: c.div })),
    skills: doneL.map((l: Item) => l.title),
  };
}

const GREEN: [number, number, number] = [10, 127, 85];
const SOFT: [number, number, number] = [227, 247, 238];
const INK: [number, number, number] = [27, 35, 32];
const MUTED: [number, number, number] = [104, 114, 109];
const LINE: [number, number, number] = [222, 228, 225];
const tgl = (t: number | Date) => new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const n = (x: number) => x.toLocaleString('id-ID');

/** Fungsi Excel yang benar-benar dipakai peserta di bukti kerjanya. */
export const usedFunctions = (ev: Evidence[]) => [...new Set(ev.flatMap(e => e.formulas.flatMap(f => fnsIn(f.f))))].sort();

/** Buat PDF portofolio (ringkasan + bukti kerja) dan unduh. jsPDF dimuat hanya saat dibutuhkan. */
export async function downloadPortfolioPdf(pf: Portfolio, ev: Evidence[], certs: { title: string; id: string; date: string }[] = [], maxEvidence = 24) {
  const [{ jsPDF }, logos] = await Promise.all([import('jspdf'), loadLogos()]);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, M = 18, CW = W - 2 * M, BOTTOM = 280;
  let y = 0, page = 1;
  const font = (size: number, bold = false, color: [number, number, number] = INK, mono = false) => { doc.setFont(mono ? 'courier' : 'helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(...color); };
  const text = (s: string, x: number, yy: number, align: 'left' | 'right' | 'center' = 'left') => doc.text(s, x, yy, { align });
  const wrap = (s: string, w: number) => doc.splitTextToSize(s, w) as string[];
  const header = () => {
    drawOps(doc, stripOps(pdfMeasure(doc), W), logos);
    if (logos.color) doc.addImage(logos.color, 'PNG', M, 11, 6.5, 6.5);
    font(10, true); text('Jagoan Excel', M + 8.5, 15.8);
    font(8.5, false, MUTED); text('Portofolio Kemampuan Excel', W - M, 15.8, 'right');
    doc.setDrawColor(...LINE); doc.setLineWidth(0.25); doc.line(M, 21, W - M, 21);
  };
  const footer = () => {
    doc.setDrawColor(...LINE); doc.line(M, 287, W - M, 287);
    font(7.5, false, MUTED);
    text(`${pf.name || 'Peserta'} · dibuat otomatis dari progres belajar di Jagoan Excel pada ${tgl(pf.issued)}`, M, 291.5);
    text(`Halaman ${page}`, W - M, 291.5, 'right');
  };
  const newPage = () => { footer(); doc.addPage(); page++; header(); y = 30; };
  const need = (h: number) => { if (y + h > BOTTOM) newPage(); };
  const bar = (x: number, yy: number, w: number, frac: number) => {
    doc.setFillColor(...LINE); doc.roundedRect(x, yy, w, 2.2, 1.1, 1.1, 'F');
    if (frac > 0) { doc.setFillColor(...GREEN); doc.roundedRect(x, yy, Math.max(2.2, w * Math.min(1, frac)), 2.2, 1.1, 1.1, 'F'); }
  };
  const section = (title: string, note?: string) => {
    need(18); y += 3;
    font(11.5, true); text(title, M, y);
    if (note) { font(8, false, MUTED); text(note, W - M, y, 'right'); }
    y += 2.2; doc.setDrawColor(...GREEN); doc.setLineWidth(0.5); doc.line(M, y, M + 10, y); doc.setLineWidth(0.25); y += 6;
  };

  // ---------- halaman 1: identitas + ringkasan
  const head = portfolioHeadOps(pdfMeasure(doc), { name: pf.name || 'Peserta Jagoan Excel', meta: [pf.email, 'Belajar sejak ' + tgl(pf.since), pf.pro].filter(Boolean).join('   ·   ') });
  drawOps(doc, head.ops, logos);
  y = head.bottom;

  const stats: [string, string][] = [
    [`${pf.lessons.done}/${pf.lessons.total}`, 'Materi selesai'], [n(pf.drills), 'Soal praktik benar'],
    [`${pf.cases.done}/${pf.cases.total}`, 'Studi kasus selesai'], [n(ev.length), 'Bukti kerja terlampir'],
  ];
  const bw = (CW - 9) / 4;
  stats.forEach(([v, l], i) => {
    const x = M + i * (bw + 3);
    doc.setDrawColor(...LINE); doc.roundedRect(x, y, bw, 17, 2, 2, 'S');
    font(15, true, GREEN); text(v, x + 4.5, y + 8);
    font(7.8, false, MUTED); text(l, x + 4.5, y + 13.2);
  });
  y += 25;

  const fns = usedFunctions(ev);
  if (fns.length) {
    section('Fungsi Excel yang sudah dipakai', `${fns.length} fungsi`);
    font(8.5, false, INK, true);
    let x = M;
    for (const f of fns) {
      const w = doc.getTextWidth(f) + 5;
      if (x + w > W - M) { x = M; y += 6.5; need(7); }
      doc.setFillColor(...SOFT); doc.roundedRect(x, y - 4, w, 5.6, 1.2, 1.2, 'F');
      font(8.5, false, GREEN, true); text(f, x + 2.5, y);
      x += w + 2;
    }
    y += 8;
  }

  if (certs.length) {
    section('Sertifikat');
    for (const c of certs) { need(7); font(9.5, true); text(c.title, M, y); font(8.5, false, MUTED); text(`${c.date} · No. ${c.id}`, W - M, y, 'right'); y += 6; }
    y += 1;
  }

  section('Penguasaan per modul');
  for (const m of pf.modules) {
    need(7);
    font(9); text(m.title, M, y);
    bar(M + 82, y - 2.1, CW - 82 - 16, m.total ? m.done / m.total : 0);
    font(8.5, false, MUTED); text(`${m.done}/${m.total}`, W - M, y, 'right');
    y += 6;
  }

  // ---------- bukti kerja
  const shown = ev.slice(0, maxEvidence);
  if (shown.length) {
    newPage();
    font(8, true, GREEN); text('BUKTI KERJA', M, y); y += 7;
    font(16, true); text('Lembar kerja yang sudah diselesaikan', M, y); y += 6;
    font(9, false, MUTED);
    for (const l of wrap(`Setiap bukti berisi tugas, rumus yang ditulis sendiri oleh ${pf.name || 'peserta'}, hasilnya, dan potongan lembar kerja. Sel hijau adalah sel yang diisi rumus. Semua rumus diperiksa otomatis oleh Jagoan Excel.${ev.length > shown.length ? ` Ditampilkan ${shown.length} dari ${ev.length} bukti; versi lengkap ada di file Excel bukti kerja.` : ''}`, CW)) { text(l, M, y); y += 4.4; }
    y += 4;
    shown.forEach((e, k) => evidenceBlock(e, k + 1));
  }
  footer();
  const safe = (pf.name || 'peserta').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'peserta';
  doc.save(`portofolio-excel-${safe}.pdf`);

  function evidenceBlock(e: Evidence, no: number) {
    const g = gridBounds(e, 9, 16);
    const rowH = 4.6, rnW = 6;
    const colW = Math.min(24, (CW - rnW) / Math.max(1, g.cols));
    font(8.8);
    const narr = e.narrative.flatMap(t => wrap(t, CW - 6)).slice(0, 8);
    const fl = e.formulas.slice(0, 6);
    const tableH = (g.rows + 1) * rowH;
    need(12 + narr.length * 4.2 + fl.length * 5 + 8);
    // judul
    doc.setFillColor(...SOFT); doc.roundedRect(M, y - 4.6, CW, 7.4, 1.5, 1.5, 'F');
    font(8, true, GREEN); text(`${no}. ${e.kind.toUpperCase()}`, M + 3, y);
    const kw = doc.getTextWidth(`${no}. ${e.kind.toUpperCase()}`);
    font(9.5, true); text(wrap(e.title, CW - kw - 40)[0], M + 6 + kw, y);
    font(8, false, MUTED); text(wrap(e.sub, 36)[0] || '', W - M - 3, y, 'right');
    y += 7.5;
    // narasi
    font(8.8, false, INK);
    for (const l of narr) { need(5); text(l, M + 2, y); y += 4.2; }
    y += 1.5;
    // rumus
    for (const f of fl) {
      need(6);
      font(8.5, true, GREEN, true); text(f.cell, M + 2, y);
      font(8.5, false, INK, true); const ft = wrap(f.f, CW - 60)[0]; text(ft, M + 14, y);
      font(8.5, false, MUTED); text('= ' + f.value, W - M - 2, y, 'right');
      y += 5;
    }
    if (e.formulas.length > fl.length) { font(8, false, MUTED); text(`+ ${e.formulas.length - fl.length} rumus lain (lihat file Excel)`, M + 2, y); y += 5; }
    y += 1.5;
    // potongan lembar kerja
    need(tableH + 6);
    const x0 = M + 2, fcells = new Set(e.formulas.map(f => f.cell));
    doc.setDrawColor(...LINE); doc.setLineWidth(0.2);
    font(6.8, true, MUTED);
    doc.setFillColor(244, 246, 245); doc.rect(x0, y, rnW + g.cols * colW, rowH, 'F');
    for (let c = 0; c < g.cols; c++) text(XL.colName(c), x0 + rnW + c * colW + colW / 2, y + 3.2, 'center');
    for (let r = 1; r <= g.rows; r++) {
      const yy = y + r * rowH;
      doc.setFillColor(244, 246, 245); doc.rect(x0, yy, rnW, rowH, 'F');
      font(6.8, true, MUTED); text(String(r), x0 + rnW / 2, yy + 3.2, 'center');
      for (let c = 0; c < g.cols; c++) {
        const a = XL.colName(c) + r, xx = x0 + rnW + c * colW;
        if (fcells.has(a)) { doc.setFillColor(...SOFT); doc.rect(xx, yy, colW, rowH, 'F'); doc.setDrawColor(...GREEN); doc.rect(xx, yy, colW, rowH, 'S'); doc.setDrawColor(...LINE); }
        const v = e.values(a); const s = e.shown(a);
        if (!s) continue;
        const num = typeof v === 'number';
        font(6.8, r === 1, fcells.has(a) ? GREEN : INK);
        let t = s; while (t.length > 1 && doc.getTextWidth(t) > colW - 1.6) t = t.slice(0, -1);
        if (t !== s) t = t.slice(0, -1) + '…';
        text(t, num ? xx + colW - 0.9 : xx + 0.9, yy + 3.2, num ? 'right' : 'left');
      }
    }
    for (let r = 0; r <= g.rows + 1; r++) doc.line(x0, y + r * rowH, x0 + rnW + g.cols * colW, y + r * rowH);
    for (let c = 0; c <= g.cols + 1; c++) { const xx = c === 0 ? x0 : x0 + rnW + (c - 1) * colW; doc.line(xx, y, xx, y + (g.rows + 1) * rowH); }
    y += tableH + 3;
    if (g.cutRows || g.cutCols) { font(7.5, false, MUTED); text('Lembar dipotong agar muat di halaman; lembar lengkap ada di file Excel bukti kerja.', x0, y + 1); y += 4; }
    y += 6;
  }
}

/** File Excel bukti kerja: sheet Ringkasan + satu sheet per tugas berisi data dan rumus asli peserta. */
export async function downloadEvidenceXlsx(name: string, ev: Evidence[]) {
  const { buildXlsx, sheetName, downloadBlob } = await import('./xlsx');
  const used = new Set<string>();
  const sum: Record<string, any> = {};
  const put = (a: string, v: any, o: any = {}) => { sum[a] = { v, ...o }; };
  put('A1', 'Bukti kerja Excel' + (name ? ' · ' + name : ''), { bold: true });
  put('A2', `Dibuat dari progres belajar di Jagoan Excel pada ${tgl(Date.now())}. Setiap sheet berisi data tugas dan rumus asli yang ditulis peserta.`);
  ['No', 'Jenis', 'Judul', 'Sheet', 'Sel', 'Rumus', 'Hasil'].forEach((h, i) => put(XL.colName(i) + 4, h, { bold: true, hl: true }));
  let row = 5;
  const sheets = ev.slice(0, 200).map((e, i) => {
    const nm = sheetName(`${String(i + 1).padStart(2, '0')} ${e.title}`, used);
    const cells: Record<string, any> = {};
    const fset = new Set(e.formulas.map(f => f.cell));
    const sh = XL.makeSheet(e.cells);
    for (const [a, raw] of Object.entries(e.cells)) {
      const fmt = (e.item.fmt && (e.item.fmt[a] || e.item.fmt[a.replace(/\d+/, '')])) as any;
      const v = sh.value(a);
      const isF = typeof raw === 'string' && raw.startsWith('=');
      const size = isF ? sh.anchorSize(a) : null;
      const val = XL.isArr && XL.isArr(v) ? v[0]?.[0] : v;
      const isNum = typeof val === 'number';
      cells[a] = {
        v: val, f: isF ? raw : undefined, bold: /^[A-Z]+1$/.test(a) || (e.item.bold || []).includes(a), hl: fset.has(a),
        fmt: fmt === 'date' || fmt === 'pct' || fmt === 'time' ? fmt : isNum && Math.abs(val) >= 1000 && Number.isInteger(val) ? 'int' : undefined,
        arr: size && (size[0] > 1 || size[1] > 1) ? `${a}:${XL.colName(XL.splitRef(a).c + size[1] - 1)}${XL.splitRef(a).r + size[0] - 1}` : undefined,
      };
      if (size && (size[0] > 1 || size[1] > 1)) {
        const p0 = XL.splitRef(a);
        for (let dr = 0; dr < size[0]; dr++) for (let dc = 0; dc < size[1]; dc++) {
          if (!dr && !dc) continue;
          const b = XL.colName(p0.c + dc) + (p0.r + dr);
          cells[b] = { v: sh.value(b), hl: true };
        }
      }
    }
    // narasi di samping data
    const g = gridBounds(e, 40, 400); const nc = XL.colName(g.cols + 1);
    cells[nc + '1'] = { v: `${e.kind}: ${e.title}`, bold: true };
    e.narrative.forEach((t, k) => { cells[nc + (k + 2)] = { v: t, wrap: true }; });
    cells[nc + (e.narrative.length + 3)] = { v: 'Sel hijau = rumus yang ditulis peserta.' };
    const widths: Record<number, number> = {}; for (let c = 0; c < g.cols; c++) widths[c] = 14; widths[g.cols + 1] = 70;
    for (const f of e.formulas) {
      put('A' + row, row - 4); put('B' + row, e.kind); put('C' + row, e.title); put('D' + row, nm); put('E' + row, f.cell); put('F' + row, f.f); put('G' + row, f.value);
      row++;
    }
    return { name: nm, cells, widths };
  });
  const bytes = buildXlsx([{ name: 'Ringkasan', cells: sum, widths: { 0: 6, 1: 12, 2: 42, 3: 28, 4: 7, 5: 46, 6: 18 } }, ...sheets]);
  const safe = (name || 'peserta').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'peserta';
  downloadBlob(bytes, `bukti-kerja-excel-${safe}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
