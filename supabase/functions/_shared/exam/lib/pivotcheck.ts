// @ts-nocheck
// DISALIN OTOMATIS oleh scripts/sync-exam.mjs dari src/. Jangan diedit di sini.
// Pemeriksa jawaban soal PivotTable di bank soal: membandingkan susunan pivot pengguna dengan target.
type PivotSnapshot = any;

export type PivotTarget = {
  rows: string[]; cols: string[];
  vals: { field: string | '*'; agg: 'sum' | 'count' | 'avg' | 'max' | 'min'; show?: 'none' | 'pctGrand' | 'pctCol' | 'pctRow' }[];
  filters?: Record<string, string[]>;
  sortDesc?: string;
};
const AGG: Record<string, string> = { sum: 'Sum', count: 'Count', avg: 'Average', max: 'Max', min: 'Min' };
const SHOW: Record<string, string> = { none: 'No Calculation', pctGrand: '% of Grand Total', pctCol: '% of Column Total', pctRow: '% of Row Total' };
const list = (xs: string[]) => xs.length ? xs.map(x => `<b>${x}</b>`).join(', ') : '<i>kosong</i>';
const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

/** null = benar; string (HTML) = apa yang masih kurang */
export function checkPivot(s: PivotSnapshot | null, t: PivotTarget): string | null {
  if (!s || !s.created) return 'Buat PivotTable dulu lewat <b>Insert › PivotTable</b>.';
  const st = s.state;
  if (!same(st.rows, t.rows)) return `Area <b>Rows</b> seharusnya berisi ${list(t.rows)}${t.rows.length > 1 ? ' (urutan dari atas ke bawah)' : ''}. Sekarang: ${list(st.rows)}.`;
  if (!same(st.cols, t.cols)) return `Area <b>Columns</b> seharusnya berisi ${list(t.cols)}. Sekarang: ${list(st.cols)}.`;
  if (st.vals.length !== t.vals.length) return `Area <b>Values</b> seharusnya berisi ${t.vals.length} field. Sekarang ada ${st.vals.length}.`;
  for (const tv of t.vals) {
    const hit = st.vals.find(v => (tv.field === '*' || v.field === tv.field) && v.agg === tv.agg && v.show === (tv.show ?? 'none'));
    if (!hit) {
      const near = st.vals.find(v => tv.field === '*' || v.field === tv.field);
      if (!near) return `Tambahkan <b>${tv.field}</b> ke area Values.`;
      if (near.agg !== tv.agg) return `Ringkasan <b>${near.field}</b> masih <b>${AGG[near.agg]}</b>. Ubah ke <b>${AGG[tv.agg]}</b> lewat Value Field Settings.`;
      return `Tampilan nilai <b>${near.field}</b> masih <b>${SHOW[near.show]}</b>. Ubah Show Values As ke <b>${SHOW[tv.show ?? 'none']}</b>.`;
    }
  }
  const tf = t.filters ?? {};
  for (const [f, items] of Object.entries(tf)) {
    if (!st.filters.includes(f)) return `Seret <b>${f}</b> ke area <b>Filters</b>.`;
    const sel = s.sel[f];
    if (!sel || sel.length !== items.length || !items.every(x => sel.includes(x))) return `Filter <b>${f}</b> seharusnya hanya memilih ${list(items)}.`;
  }
  for (const [f, sel] of Object.entries(s.sel)) if (sel && !tf[f]) return `Ada filter di <b>${f}</b> yang tidak diminta soal. Pilih (Select All) lagi.`;
  if (t.sortDesc) { const so = s.sort[t.sortDesc]; if (!so || so.by !== 'value' || so.dir !== -1) return `Urutkan <b>${t.sortDesc}</b> dari nilai terbesar: klik kanan angka › Sort › Largest to Smallest.`; }
  return null;
}
