import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { unzipSync, strFromU8 } from 'fflate';
import { XL } from '../src/engine/engine.js';
import { ALLFUNCS } from '../src/content/allfuncs.js';
import { FN_EX, FN_SAMPLE } from '../src/content/fnexamples.js';
import { CERT_LEVELS } from '../src/content/certlevels.js';
import { LESSONS } from '../src/content/lessons.js';
import { buildXlsx, excelFormula, sheetName } from '../src/lib/xlsx';
import { argsOf, fnContext, suggest, typingToken, fnsIn } from '../src/lib/fnhelp';

describe('materi fungsi', () => {
  it('setiap fungsi punya contoh, dan contoh yang bisa dihitung tidak error', () => {
    const can = new Set(XL.ALL_FUNCS);
    for (const [name] of ALLFUNCS) {
      const ex = FN_EX[name];
      expect(ex, name).toBeTruthy();
      expect(ex.f.toUpperCase()).toContain(name + '(');
      if (ex.x || !can.has(name)) continue;
      const v = XL.makeSheet({ ...FN_SAMPLE.data, P1: ex.f }).value('P1');
      expect(XL.isErr(v), name + ' ' + ex.f).toBe(false);
    }
  });
  it('bantuan rumus: saran, argumen aktif, dan fungsi dalam rumus', () => {
    expect(typingToken('=SUMI')).toBe('SUMI');
    expect(typingToken('=SUM(B2')).toBeNull();
    expect(typingToken('="abc')).toBeNull();
    expect(suggest('xlo')[0][0]).toBe('XLOOKUP');
    const c = fnContext('=IFERROR(VLOOKUP(A2,D2:E9,');
    expect(c?.fn[0]).toBe('VLOOKUP'); expect(c?.arg).toBe(2);
    expect(argsOf('SUMIF(rentang, kriteria, [rentang_jumlah])')).toEqual(['rentang', 'kriteria', '[rentang_jumlah]']);
    expect(fnsIn('=IFERROR(XLOOKUP(A2,"SUM(",B:B),0)')).toEqual(['IFERROR', 'XLOOKUP']);
  });
});

describe('file Excel bukti kerja', () => {
  it('rumus baru diberi awalan _xlfn, teks di dalam kutip tidak diubah', () => {
    expect(excelFormula('=XLOOKUP(A2,B:B,C:C)')).toBe('_xlfn.XLOOKUP(A2,B:B,C:C)');
    expect(excelFormula('=SUM(FILTER(A:A,B:B="XLOOKUP("))')).toBe('SUM(_xlfn._xlws.FILTER(A:A,B:B="XLOOKUP("))');
    expect(excelFormula('=SUM(B2:B6)')).toBe('SUM(B2:B6)');
  });
  it('struktur .xlsx lengkap dan sel rumus tersimpan', () => {
    const bytes = buildXlsx([{ name: 'Data', cells: { A1: { v: 'Nilai', bold: true }, A2: { v: 10 }, A3: { v: 20 }, A4: { v: 30, f: '=SUM(A2:A3)', hl: true }, B1: { v: 'a<b & "c"' } } }]);
    const z = unzipSync(bytes);
    for (const f of ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/styles.xml', 'xl/worksheets/sheet1.xml']) expect(z[f], f).toBeTruthy();
    const sh = strFromU8(z['xl/worksheets/sheet1.xml']);
    expect(sh).toContain('<c r="A4" s="');
    expect(sh).toContain('<f>SUM(A2:A3)</f><v>30</v>');
    expect(sh).toContain('a&lt;b &amp; &quot;c&quot;');
  });
  it('nama sheet sah dan unik', () => {
    const used = new Set<string>();
    expect(sheetName('01 Gaji: [Rekap]/2026', used)).toBe('01 Gaji Rekap 2026'.replace('Rekap 2026', 'Rekap 2026'));
    const a = sheetName('x'.repeat(40), used), b = sheetName('x'.repeat(40), used);
    expect(a.length).toBeLessThanOrEqual(31); expect(b).not.toBe(a); expect(b.length).toBeLessThanOrEqual(31);
  });
});

describe('sertifikat', () => {
  it('migrasi SQL memuat semua materi wajib tiap tingkat (jalankan scripts/gen-cert-sql.mjs kalau gagal)', () => {
    const sql = readFileSync(new URL('../supabase/migrations/20261108090000_cert_materi_array.sql', import.meta.url), 'utf8');
    for (const lv of CERT_LEVELS) {
      expect(sql).toContain(`'${lv.key}'`);
      for (const l of LESSONS.filter((x: any) => lv.modules.includes(x.mod) && !x.sandbox)) expect(sql, l.id).toContain(`'${l.id}'`);
    }
  });
});

describe('ujian akhir (server)', async () => {
  const S = await import('../supabase/functions/_shared/exam/examserver.ts');
  let k = 7; const rand = () => { k = (k * 9301 + 49297) % 233280; return k / 233280; };
  it('komposisi soal sesuai rencana tiap tingkat, termasuk PivotTable', () => {
    for (const lv of ['basic', 'intermediate', 'advanced', 'expert']) {
      const plan = S.EXAM.levels[lv]; const ids = S.pickExam(lv, rand);
      const n = (t: string) => ids.filter((i: string) => i.startsWith(t + ':')).length;
      expect([n('p'), n('c'), n('v'), n('t')]).toEqual([plan.practical, plan.cases, plan.pivot, plan.theory]);
      expect(new Set(ids).size).toBe(ids.length);
    }
    expect(S.EXAM.levels.basic.pivot).toBe(0);
    expect(S.EXAM.levels.intermediate.pivot).toBe(3);
    expect(S.EXAM.levels.advanced.pivot).toBe(4);
  });
  it('soal untuk browser tidak membawa kunci jawaban', () => {
    for (const lv of ['basic', 'intermediate', 'advanced', 'expert']) for (const id of S.pickExam(lv, rand)) {
      const p = S.payload(id); const j = JSON.stringify(p);
      expect(p).toBeTruthy();
      expect(j).not.toMatch(/"solution"|"answer"|"target":\{|"use"|"hint"|"abs"/);
      if (p.type === 't') expect(p.opts.length).toBe(4);
    }
  });
  it('kunci jawaban dapat nilai 100, kosong 0, menimpa data soal tidak berpengaruh', () => {
    for (const lv of ['basic', 'intermediate', 'advanced', 'expert']) {
      const ids = S.pickExam(lv, rand); const ans: any = {};
      for (const id of ids) {
        const x = S.buildItem(id);
        if (x.type === 't') ans[id] = x.answer;
        else if (x.type === 'v') { const t = x.pivot.target; ans[id] = { state: { filters: Object.keys(t.filters || {}), cols: t.cols, rows: t.rows, vals: t.vals.map((v: any) => ({ field: v.field === '*' ? x.pivot.fields[0] : v.field, agg: v.agg, show: v.show || 'none', num: false })) }, sel: t.filters || {}, sort: t.sortDesc ? { [t.sortDesc]: { by: 'value', dir: -1 } } : {}, layout: 'compact', grand: true, created: true }; }
        else { const c: any = {}; for (const t of x.work.tasks) { c[t.target] = t.solution; for (const f of t.fill || []) { const a = XL.splitRef(t.target), b = XL.splitRef(f); c[f] = XL.shiftFormula(t.solution, b.r - a.r, b.c - a.c); } } ans[id] = c; }
      }
      const g = S.gradeExam(ids, ans);
      expect(g.results.filter((r: any) => !r.ok).map((r: any) => r.id + ' ' + (r.msg || JSON.stringify(r.tasks)))).toEqual([]);
      expect(g.score).toBe(100);
      expect(S.gradeExam(ids, {}).score).toBe(0);
    }
    const id = S.pickExam('basic', rand)[0]; const x = S.buildItem(id);
    const hack: any = { [id]: { A1: '=1', B2: '999999', [x.work.tasks[0].target]: '=1+1' } };
    expect(S.gradeExam([id], hack).score).toBe(0);
  });
});

describe('salinan Edge Function ujian', () => {
  it('sama dengan sumber di src/ (jalankan node scripts/sync-exam.mjs kalau gagal)', () => {
    const rd = (p: string) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
    const strip = (s: string) => s.split('\n').slice(2).join('\n');
    expect(strip(rd('supabase/functions/_shared/exam/engine/engine.js'))).toBe(rd('src/engine/engine.js'));
    expect(strip(rd('supabase/functions/_shared/exam/content/drills.js'))).toBe(rd('src/content/drills.js'));
    expect(strip(rd('supabase/functions/_shared/exam/content/certlevels.js'))).toBe(rd('src/content/certlevels.js'));
    expect(strip(rd('supabase/functions/_shared/exam/lib/format.ts'))).toBe(rd('src/lib/format.ts'));
    expect(strip(rd('supabase/functions/_shared/exam/lib/pivotcheck.ts'))).toBe(rd('src/lib/pivotcheck.ts').replace("import type { PivotSnapshot } from '../components/PivotSim';", 'type PivotSnapshot = any;'));
    expect(strip(rd('supabase/functions/_shared/exam/lib/work.ts')).replace(/\/\/ deno-lint[^\n]*\ntype Item = any;/, '')).toBe(rd('src/lib/work.ts').replace("import { showValue, fmtOf } from './format';", "import { showValue, fmtOf } from './format.ts';").replace("import type { Item } from './catalog';", ''));
  });
});
