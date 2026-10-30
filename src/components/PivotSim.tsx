// Simulasi PivotTable yang meniru Excel: sheet data, Insert › PivotTable, panel PivotTable Fields
// (centang + seret ke Filters/Columns/Rows/Values), Value Field Settings, filter ▾, urutkan,
// klik kanan, drill-down, Refresh, dan tata letak Compact/Tabular.
import { useEffect, useMemo, useRef, useState, type DragEvent, type MouseEvent as RMouseEvent } from 'react';
import { XL } from '../engine/engine.js';

export type Rec = Record<string, string | number>;
export type Agg = 'sum' | 'count' | 'avg' | 'max' | 'min';
export type Show = 'none' | 'pctGrand' | 'pctCol' | 'pctRow';
export type VF = { field: string; agg: Agg; show: Show; num: boolean };
type Area = 'filters' | 'cols' | 'rows' | 'vals';
export type Sort = { by: 'label' | 'value'; dir: 1 | -1 };
type Cell = { text: string; num?: boolean; cls?: string; item?: string; kind?: 'rl' | 'cl' | 'filter' | 'val' | 'lab' | 'item'; row?: string[]; col?: string[]; vi?: number; toggle?: string; level?: number; field?: string; caret?: 'rows' | 'cols' | string };

const DEF_FIELDS = ['Tanggal', 'Bulan', 'Cabang', 'Kategori', 'Sales', 'Nilai', 'Qty'];
const DEF_NUMERIC = ['Nilai', 'Qty'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const AGG_L: Record<Agg, string> = { sum: 'Sum', count: 'Count', avg: 'Average', max: 'Max', min: 'Min' };
const SHOW_L: Record<Show, string> = { none: 'No Calculation', pctGrand: '% of Grand Total', pctCol: '% of Column Total', pctRow: '% of Row Total' };
const AREA_L: Record<Area, string> = { filters: 'Filters', cols: 'Columns', rows: 'Rows', vals: 'Values' };

const ser = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / 864e5 + 25569;
const ymd = (n: number) => { const t = new Date((n - 25569) * 864e5); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; };
const fdate = (n: number) => { const p = ymd(n); return `${String(p.d).padStart(2, '0')}/${String(p.m).padStart(2, '0')}/${p.y}`; };
function makeData(): Rec[] {
  const cab = ['Jakarta', 'Bandung', 'Surabaya', 'Medan'], kat = ['Elektronik', 'Perabot', 'ATK'], sales = ['Rina', 'Yusuf', 'Maya', 'Hendra'];
  const bln: [string, number][] = [['Jul', 7], ['Agu', 8], ['Sep', 9]];
  let s = 11; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const out: Rec[] = [];
  for (const [b, m] of bln) for (const c of cab) for (const k of kat) {
    const d = 1 + Math.floor(rnd() * 28);
    out.push({ Tanggal: ser(2026, m, d), Bulan: b, Cabang: c, Kategori: k, Sales: sales[Math.floor(rnd() * 4)], Nilai: Math.round((8 + rnd() * 40) * 10) * 100000, Qty: Math.round(5 + rnd() * 60) });
  }
  return out;
}

const dkey = (x: string) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(x); return m ? +(m[3] + m[2] + m[1]) : null; };
const nkey = (x: string) => { const m = /^([<>])?(-?\d+(?:[.,]\d+)?)/.exec(x); return m ? parseFloat(m[2].replace(',', '.')) + (m[1] === '<' ? -0.5 : m[1] === '>' ? 1e12 : 0) : null; };
const cmpLabel = (a: string, b: string) => {
  const ia = MONTHS.indexOf(a), ib = MONTHS.indexOf(b);
  if (ia >= 0 && ib >= 0) return ia - ib; // seperti custom list bulan di Excel
  const da = dkey(a), db = dkey(b); if (da !== null && db !== null) return da - db;
  const na = nkey(a), nb = nkey(b); if (na !== null && nb !== null) return na - nb;
  return a.localeCompare(b, 'id');
};
const vname = (v: VF) => `${AGG_L[v.agg]} of ${v.field}`;
function aggr(recs: Rec[], v: VF): number | null {
  if (v.agg === 'count') return recs.length || null;
  const xs = recs.map(r => r[v.field]).filter((x): x is number => typeof x === 'number');
  if (!xs.length) return null;
  if (v.agg === 'sum') return xs.reduce((a, b) => a + b, 0);
  if (v.agg === 'avg') return xs.reduce((a, b) => a + b, 0) / xs.length;
  if (v.agg === 'max') return Math.max(...xs);
  return Math.min(...xs);
}
function fmt(x: number | null, v: VF): string {
  if (x === null || !isFinite(x)) return '';
  if (v.show !== 'none') return (x * 100).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  if (v.num) return x.toLocaleString('id-ID', { maximumFractionDigits: 2, minimumFractionDigits: v.agg === 'avg' ? 2 : 0 });
  return String(Math.round(x * 1e9) / 1e9).replace('.', ',');
}
const colName = (i: number) => { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };

export type State = { filters: string[]; cols: string[]; rows: string[]; vals: VF[] };
type Node = { key: string; label: string; path: string[]; recs: Rec[]; kids: Node[] };

const MISSIONS: { id: string; text: string }[] = [
  { id: 'm1', text: 'Buat PivotTable lewat <b>Insert › PivotTable</b>.' },
  { id: 'm2', text: 'Tampilkan <b>total Nilai per Cabang</b>: centang Cabang dan Nilai.' },
  { id: 'm3', text: 'Pecah per bulan: seret <b>Bulan</b> ke area <b>Columns</b>.' },
  { id: 'm4', text: 'Tambah level kedua: <b>Kategori</b> di bawah Cabang di area Rows, lalu ciutkan satu cabang dengan tombol <b>−</b>.' },
  { id: 'm5', text: 'Urutkan cabang dari nilai <b>terbesar</b> (klik kanan angka › Sort › Largest to Smallest).' },
  { id: 'm6', text: 'Ubah angka jadi <b>% of Grand Total</b> lewat Value Field Settings atau Show Values As.' },
  { id: 'm7', text: 'Pindahkan <b>Sales</b> ke <b>Filters</b> dan pilih satu nama saja.' },
  { id: 'm8', text: 'Klik dua kali sebuah angka untuk melihat data penyusunnya (<b>drill down</b>).' },
  { id: 'm9', text: 'Ubah satu angka di sheet <b>Penjualan</b>, lalu tekan <b>Refresh</b>. Pivot baru berubah setelah di-refresh.' },
  { id: 'm10', text: '<b>Grouping tanggal/angka</b>: taruh <b>Tanggal</b> di Rows, klik kanan sebuah tanggal › <b>Group…</b> › Months. (Coba juga Qty di Rows › Group By 10.)' },
  { id: 'm11', text: '<b>Grup buatan sendiri</b>: dengan Cabang di Rows, klik kanan Jakarta › Group…, centang Jakarta & Bandung, beri nama <b>Barat</b>.' },
  { id: 'm12', text: 'Pasang <b>Slicer</b> Kategori (Analyze › Insert Slicer) lalu klik salah satu tombolnya.' },
  { id: 'm13', text: 'Buat <b>Calculated Field</b> <code>Harga</code> = <code>Nilai/Qty</code> (rumus di atas data pivot).' },
  { id: 'm14', text: 'Buka <b>Options</b>: isi <i>For empty cells show</i> dengan 0 atau centang <i>Show items with no data</i>.' },
  { id: 'm15', text: 'Taruh Cabang di Filters, lalu <b>Show Report Filter Pages</b>: satu tab sheet per cabang.' },
];

export type PivotSnapshot = { state: State; sel: Record<string, string[] | undefined>; sort: Record<string, Sort>; layout: 'compact' | 'tabular'; grand: boolean; created: boolean };
type Props = {
  /** data sumber; default: data penjualan contoh */
  data?: Rec[]; fields?: string[]; numeric?: string[]; sheetName?: string; dateFields?: string[];
  /** 'lesson' = mulai dari Insert › PivotTable + misi; 'drill' = pivot kosong langsung siap diisi */
  mode?: 'lesson' | 'drill';
  onChange?: (s: PivotSnapshot) => void;
  /** susunan awal (misalnya jawaban ujian yang tersimpan) */
  initial?: PivotSnapshot | null;
};

export function PivotSim(props: Props = {}) {
  const FIELDS = props.fields ?? DEF_FIELDS;
  const NUMERIC = useMemo(() => new Set(props.numeric ?? DEF_NUMERIC), [props.numeric]);
  const drillMode = props.mode === 'drill';
  const sheetName = props.sheetName ?? 'Penjualan';
  const [data, setData] = useState<Rec[]>(() => props.data ?? makeData());
  const [cache, setCache] = useState<Rec[]>(data);
  const [stale, setStale] = useState(false);
  const ini = props.initial;
  const [created, setCreated] = useState(ini?.created ?? drillMode);
  const [sheet, setSheet] = useState<'data' | 'pivot' | 'drill' | 'page'>(drillMode ? 'pivot' : 'data');
  const [ribbon, setRibbon] = useState<'insert' | 'analyze' | 'design'>(drillMode ? 'analyze' : 'insert');
  type Dlg = null | 'create' | { vf: number } | { k: 'group'; field: string; item?: string } | { k: 'calc' } | { k: 'opts' } | { k: 'slicer' } | { k: 'pages' };
  const [dialog, setDialog] = useState<Dlg>(null);
  const [st, setSt] = useState<State>(ini?.state ?? { filters: [], cols: [], rows: [], vals: [] });
  const [sel, setSel] = useState<Record<string, string[] | undefined>>(ini?.sel ?? {});
  const [sort, setSort] = useState<Record<string, Sort>>(ini?.sort ?? {});
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [layout, setLayout] = useState<'compact' | 'tabular'>(ini?.layout ?? 'compact');
  const [grand, setGrand] = useState(ini?.grand ?? true);
  const [subs, setSubs] = useState(true);
  const [showList, setShowList] = useState(true);
  const [active, setActive] = useState<{ r: number; c: number; text: string } | null>(null);
  const [menu, setMenu] = useState<null | { x: number; y: number; kind: 'chip'; area: Area; idx: number } | { x: number; y: number; kind: 'ctx'; cell: Cell } | { x: number; y: number; kind: 'filter'; field: string; axis: Area }>(null);
  const [drill, setDrill] = useState<Rec[] | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<{ r: number; f: string } | null>(null);
  const [search, setSearch] = useState('');
  // fitur lanjutan: grouping, calculated field, opsi, slicer, report filter pages
  const DATES = useMemo(() => new Set(props.dateFields ?? (props.data ? [] : ['Tanggal'])), [props.dateFields, props.data]);
  const [dateGroup, setDateGroup] = useState<Record<string, 'months' | 'quarters' | 'years' | undefined>>({});
  const [numGroup, setNumGroup] = useState<Record<string, { start: number; end: number; by: number } | undefined>>({});
  const [userGroups, setUserGroups] = useState<Record<string, { name: string; items: string[] }[]>>({});
  const [calcs, setCalcs] = useState<{ name: string; formula: string }[]>([]);
  const [opts, setOpts] = useState({ empty: '', noData: false, repeat: false });
  const [slicers, setSlicers] = useState<string[]>([]);
  const [pages, setPages] = useState<{ field: string; items: string[] } | null>(null);
  const [page, setPage] = useState<string | null>(null);
  const dragRef = useRef<{ field: string; from?: Area; idx?: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const mark = (id: string) => setDone(d => (d.has(id) ? d : new Set(d).add(id)));
  const calcMap = useMemo(() => Object.fromEntries(calcs.map(c => [c.name, c.formula])), [calcs]);
  const isNum = (f: string) => NUMERIC.has(f) || f in calcMap;
  const groupFields = Object.keys(userGroups).filter(f => userGroups[f]?.length).map(f => f + '2');
  const ALLF = [...FIELDS, ...groupFields, ...calcs.map(c => c.name)];
  /** label sebuah record untuk field tertentu, setelah tanggal/angka/item dikelompokkan */
  const lab = (r: Rec, f: string): string => {
    if (f.endsWith('2') && userGroups[f.slice(0, -1)]?.length) { const it = lab(r, f.slice(0, -1)); const g = userGroups[f.slice(0, -1)].find(x => x.items.includes(it)); return g ? g.name : it; }
    const v = r[f];
    if (DATES.has(f) && typeof v === 'number') { const g = dateGroup[f]; const p = ymd(v); return g === 'months' ? MONTHS[p.m - 1] : g === 'quarters' ? 'Qtr' + Math.ceil(p.m / 3) : g === 'years' ? String(p.y) : fdate(v); }
    const ng = numGroup[f];
    if (ng && typeof v === 'number') { if (v < ng.start) return '<' + ng.start; if (v > ng.end) return '>' + ng.end; const lo = ng.start + Math.floor((v - ng.start) / ng.by) * ng.by; return `${lo}-${Math.min(lo + ng.by - 1, ng.end)}`; }
    return String(v ?? '');
  };
  const sumOf = (rs: Rec[], f: string) => rs.reduce((a, r) => a + (typeof r[f] === 'number' ? (r[f] as number) : 0), 0);
  const calcEval = (rs: Rec[], formula: string): number | null => {
    if (!rs.length) return null;
    let e = formula.trim().replace(/^=/, '');
    for (const f of [...FIELDS].sort((a, b) => b.length - a.length)) e = e.replace(new RegExp("'?" + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "'?(?![A-Za-z0-9_])", 'gi'), '(' + sumOf(rs, f) + ')');
    const v = XL.makeSheet({}).evalFormula(e);
    return typeof v === 'number' && isFinite(v) ? v : null;
  };
  const agg = (rs: Rec[], v: VF) => (calcMap[v.field] !== undefined ? calcEval(rs, calcMap[v.field]) : aggr(rs, v));
  const esel = sheet === 'page' && pages && page ? { ...sel, [pages.field]: [page] } : sel;
  const disp = (r: Rec, f: string) => { const v = r[f]; return typeof v === 'number' ? (DATES.has(f) ? fdate(v) : v.toLocaleString('id-ID')) : String(v ?? ''); };
  const baseOf = (f: string) => (f.endsWith('2') && userGroups[f.slice(0, -1)]?.length ? f.slice(0, -1) : f);
  const isGrouped = (f: string) => !!(dateGroup[f] || numGroup[f] || (f.endsWith('2') && userGroups[f.slice(0, -1)]?.length));
  const ungroup = (f: string, item?: string) => {
    if (dateGroup[f]) setDateGroup(g => ({ ...g, [f]: undefined }));
    else if (numGroup[f]) setNumGroup(g => ({ ...g, [f]: undefined }));
    else if (f !== baseOf(f)) {
      const b = baseOf(f); const left = (userGroups[b] ?? []).filter(g => g.name !== item);
      setUserGroups(u => ({ ...u, [b]: left }));
      if (!left.length) setSt(s => removeField(s, f));
    }
    setSel(s => ({ ...s, [f]: undefined }));
  };
  const anchorRow = st.filters.length ? st.filters.length + 2 : 3;
  const gpd = (c: Cell) => {
    if (c.kind !== 'val' || c.vi === undefined || !st.vals[c.vi]) return '';
    const q = (x: string) => '"' + x.replace(/"/g, '""') + '"';
    const pairs = [...(c.row ?? []).map((x, i) => [st.rows[i], x]), ...(c.col ?? []).map((x, i) => [st.cols[i], x])];
    return `=GETPIVOTDATA(${q(st.vals[c.vi].field)},$A$${anchorRow}${pairs.map(([f, x]) => ',' + q(f) + ',' + q(x)).join('')})`;
  };
  const used = (f: string) => st.filters.includes(f) || st.cols.includes(f) || st.rows.includes(f) || st.vals.some(v => v.field === f);

  // ---------- operasi field (meniru perilaku Excel)
  const removeField = (s: State, f: string): State => ({ filters: s.filters.filter(x => x !== f), cols: s.cols.filter(x => x !== f), rows: s.rows.filter(x => x !== f), vals: s.vals.filter(v => v.field !== f) });
  const addTo = (area: Area, f: string, at?: number) => setSt(s0 => {
    let s = area === 'vals' ? s0 : removeField(s0, f);
    if (area === 'vals') { const v: VF = { field: f, agg: isNum(f) ? 'sum' : 'count', show: 'none', num: false }; const vals = [...s.vals]; vals.splice(at ?? vals.length, 0, v); return { ...s, vals }; }
    const list = [...s[area]]; list.splice(at ?? list.length, 0, f); return { ...s, [area]: list };
  });
  const toggleField = (f: string) => {
    if (used(f)) { setSt(s => removeField(s, f)); return; }
    addTo(isNum(f) ? 'vals' : 'rows', f);
  };
  const moveChip = (from: Area, idx: number, to: Area, at?: number) => setSt(s0 => {
    const s: State = { filters: [...s0.filters], cols: [...s0.cols], rows: [...s0.rows], vals: [...s0.vals] };
    if (from === 'vals') {
      const [v] = s.vals.splice(idx, 1);
      if (to === 'vals') { s.vals.splice(at ?? s.vals.length, 0, v); return s; }
      const t = removeField(s, v.field); t[to].splice(at ?? t[to].length, 0, v.field); return t;
    }
    const [f] = (s[from] as string[]).splice(idx, 1);
    if (to === 'vals') { s.vals.splice(at ?? s.vals.length, 0, { field: f, agg: isNum(f) ? 'sum' : 'count', show: 'none', num: false }); return s; }
    const t = removeField(s, f); t[to].splice(at ?? t[to].length, 0, f); return t;
  });
  const removeChip = (area: Area, idx: number) => setSt(s => area === 'vals' ? { ...s, vals: s.vals.filter((_, i) => i !== idx) } : { ...s, [area]: (s[area] as string[]).filter((_, i) => i !== idx) });
  const setVF = (i: number, p: Partial<VF>) => setSt(s => ({ ...s, vals: s.vals.map((v, j) => (j === i ? { ...v, ...p } : v)) }));

  // ---------- data terfilter dan pohon baris/kolom
  const recs = useMemo(() => cache.filter(r => Object.entries(esel).every(([f, xs]) => !xs || xs.includes(lab(r, f)))), [cache, esel, dateGroup, numGroup, userGroups]);
  const itemsOf = (f: string) => [...new Set(cache.map(r => lab(r, f)))].sort(cmpLabel);

  const build = (fields: string[], rs: Rec[], path: string[] = []): Node[] => {
    if (!fields.length) return [];
    const f = fields[0];
    const labels = opts.noData && st.rows.includes(f) ? (sel[f] ?? itemsOf(f)) : [...new Set(rs.map(r => lab(r, f)))];
    const nodes = labels.map(l => { const sub = rs.filter(r => lab(r, f) === l); const p = [...path, l]; return { key: p.join('\u0001'), label: l, path: p, recs: sub, kids: build(fields.slice(1), sub, p) }; });
    const so = sort[f];
    if (so?.by === 'value' && st.vals[0]) nodes.sort((a, b) => ((agg(a.recs, st.vals[0]) ?? 0) - (agg(b.recs, st.vals[0]) ?? 0)) * so.dir);
    else nodes.sort((a, b) => cmpLabel(a.label, b.label) * (so?.dir ?? 1));
    return nodes;
  };
  const rowTree = useMemo(() => build(st.rows, recs), [st, recs, sort, opts, calcs]);
  const colTree = useMemo(() => build(st.cols, recs), [st, recs, sort, calcs]);

  // ---------- susun sel pivot (seperti yang tampil di lembar Excel)
  const grid = useMemo(() => {
    const out: Cell[][] = [];
    for (const f of st.filters) {
      const xs = esel[f]; const fl = !xs ? '(All)' : xs.length === 1 ? xs[0] : '(Multiple Items)';
      out.push([{ text: f, kind: 'lab', cls: 'pf-fl' }, { text: fl, kind: 'filter', field: f, caret: f, cls: 'pf-fv' }]);
    }
    if (st.filters.length) out.push([]);
    const V = st.vals, nV = V.length, C = st.cols, R = st.rows;
    if (!nV && !R.length && !C.length) return { cells: out, empty: true };

    type CE = { path: string[]; kind: 'leaf' | 'sub' | 'grand' };
    const ce: CE[] = [];
    const walkC = (ns: Node[]) => { for (const n of ns) { if (n.kids.length) { walkC(n.kids); if (subs && n.path.length === 1 && C.length > 1) ce.push({ path: n.path, kind: 'sub' }); } else ce.push({ path: n.path, kind: 'leaf' }); } };
    if (C.length) { walkC(colTree); if (grand) ce.push({ path: [], kind: 'grand' }); } else ce.push({ path: [], kind: 'grand' });
    const mc = nV ? ce.flatMap(e => V.map((_, vi) => ({ e, vi }))) : ce.map(e => ({ e, vi: -1 }));
    const tab = layout === 'tabular';
    const L = !R.length && !C.length ? 0 : tab ? Math.max(1, R.length) : 1;
    const match = (r: Rec, row: string[], col: string[]) => row.every((x, i) => lab(r, R[i]) === x) && col.every((x, i) => lab(r, C[i]) === x);
    const val = (row: string[], col: string[], vi: number) => {
      const v = V[vi]; const x = agg(recs.filter(r => match(r, row, col)), v);
      if (x === null || v.show === 'none') return x;
      const base = v.show === 'pctGrand' ? agg(recs, v) : v.show === 'pctCol' ? agg(recs.filter(r => match(r, [], col)), v) : agg(recs.filter(r => match(r, row, [])), v);
      return base ? x / base : null;
    };
    const valCells = (row: string[], cls = '') => mc.map(({ e, vi }) => vi < 0 ? { text: '' } : ({ text: (x => (x === null ? opts.empty : fmt(x, V[vi])))(val(row, e.path, vi)), num: true, kind: 'val' as const, row, col: e.path, vi, cls: [cls, e.kind !== 'leaf' ? 'pf-b' : ''].join(' ').trim() }));

    // header
    const rlabel = (): Cell[] => tab ? (R.length ? R.map(f => ({ text: f, kind: 'rl' as const, caret: f, field: f, cls: 'pf-h' })) : [{ text: '', cls: 'pf-h' }]) : [{ text: R.length ? 'Row Labels' : '', kind: 'rl', caret: R.length ? R[0] : undefined, field: R[0], cls: 'pf-h' }];
    if (C.length) {
      const top: Cell[] = Array.from({ length: L }, (_, i) => ({ text: i === 0 && nV === 1 ? vname(V[0]) : i === 0 && nV > 1 ? '' : '', cls: 'pf-h' }));
      top.push({ text: 'Column Labels', kind: 'cl', caret: C[0], field: C[0], cls: 'pf-h' }); for (let i = 1; i < mc.length; i++) top.push({ text: '', cls: 'pf-h' });
      out.push(top);
      const levels = C.length + (nV > 1 ? 1 : 0);
      for (let lv = 0; lv < levels; lv++) {
        const last = lv === levels - 1;
        const row: Cell[] = last ? rlabel() : Array.from({ length: L }, () => ({ text: '', cls: 'pf-h' }));
        let prev = '';
        mc.forEach(({ e, vi }) => {
          let t = '';
          if (lv < C.length) {
            if (e.kind === 'leaf') { const k = e.path.slice(0, lv + 1).join('\u0001'); if (k !== prev && vi <= 0) t = e.path[lv]; prev = k; }
            else { prev = ''; if (lv === 0 && vi <= 0) t = e.kind === 'sub' ? `${e.path[0]} Total` : nV > 1 ? '' : 'Grand Total'; }
          } else t = e.kind === 'grand' ? `Total ${vname(V[vi])}` : e.kind === 'sub' ? `${e.path[0]} ${vname(V[vi])}` : vname(V[vi]);
          row.push({ text: t, cls: 'pf-h' + (e.kind !== 'leaf' ? ' pf-b' : '') });
        });
        out.push(row);
      }
    } else {
      out.push([...(L ? rlabel() : []), ...mc.map(({ vi }) => ({ text: vi < 0 ? '' : vname(V[vi]), cls: 'pf-h' }))]);
    }

    // body
    if (!R.length) {
      out.push([...(L ? [{ text: nV === 1 ? vname(V[0]) : 'Total', cls: 'pf-gl pf-b' }] : []), ...valCells([], 'pf-gv')]);
      return { cells: out, empty: false };
    }
    const walkR = (ns: Node[], lv: number) => {
      ns.forEach(n => {
        const kids = n.kids.length > 0, open = !collapsed.has(n.key);
        if (!tab) {
          const lab: Cell = { text: n.label, level: lv, toggle: kids ? n.key : undefined, cls: kids ? 'pf-b' : '', kind: 'item', field: R[lv], item: n.label };
          // Grup terbuka menampilkan subtotal di barisnya sendiri (kalau Subtotals aktif); grup tertutup selalu menampilkan totalnya.
          const vs = !kids ? valCells(n.path) : (!open || subs) ? valCells(n.path, 'pf-b') : valCells(n.path).map(() => ({ text: '' }));
          out.push([lab, ...vs]);
          if (kids && open) walkR(n.kids, lv + 1);
        } else {
          if (kids && open) {
            const start = out.length; walkR(n.kids, lv + 1);
            if (out[start]) out[start][lv] = { text: n.label, toggle: n.key, cls: 'pf-b', kind: 'item', field: R[lv], item: n.label };
            if (subs) { const row: Cell[] = Array.from({ length: L }, () => ({ text: '', cls: 'pf-st' })); row[lv] = { text: `${n.label} Total`, cls: 'pf-st pf-b' }; out.push([...row, ...valCells(n.path, 'pf-st')]); }
          } else {
            const row: Cell[] = Array.from({ length: L }, () => ({ text: '' })); row[lv] = { text: n.label, toggle: kids ? n.key : undefined, cls: kids ? 'pf-b' : '', kind: 'item', field: R[lv], item: n.label };
            out.push([...row, ...valCells(n.path, kids ? 'pf-st' : '')]);
          }
        }
      });
    };
    const bodyStart = out.length;
    walkR(rowTree, 0);
    // Design › Report Layout › Repeat All Item Labels (tabular)
    if (tab && opts.repeat) { const last: Cell[] = []; for (let i = bodyStart; i < out.length; i++) { const row = out[i]; if (row.some(c => c.cls?.includes('pf-st'))) continue; for (let k = 0; k < L; k++) { if (row[k]?.text) last[k] = row[k]; else if (last[k] && row.slice(k + 1, L).some(c => c?.text)) row[k] = { ...last[k], toggle: undefined, cls: '' }; } } }
    if (grand) { const row: Cell[] = Array.from({ length: L }, (_, i) => ({ text: i === 0 ? 'Grand Total' : '', cls: 'pf-gl pf-b' })); out.push([...row, ...valCells([], 'pf-gv')]); }
    return { cells: out, empty: false };
  }, [st, recs, rowTree, colTree, collapsed, layout, grand, subs, esel, opts, calcs]);

  // laporkan susunan pivot ke luar (dipakai bank soal untuk memeriksa jawaban)
  useEffect(() => { props.onChange?.({ state: st, sel, sort, layout, grand, created }); }, [st, sel, sort, layout, grand, created]);

  // ---------- misi (dicentang otomatis)
  useEffect(() => {
    if (created) mark('m1');
    if (st.rows[0] === 'Cabang' && st.vals.some(v => v.field === 'Nilai' && v.agg === 'sum')) mark('m2');
    if (st.cols.includes('Bulan') && st.vals.length) mark('m3');
    if (st.rows[0] === 'Cabang' && st.rows[1] === 'Kategori' && [...collapsed].some(k => !k.includes('\u0001'))) mark('m4');
    if (sort.Cabang?.by === 'value' && sort.Cabang.dir === -1 && st.rows.includes('Cabang')) mark('m5');
    if (st.vals.some(v => v.show === 'pctGrand')) mark('m6');
    if (st.filters.includes('Sales') && sel.Sales?.length === 1) mark('m7');
  }, [created, st, collapsed, sort, sel]);

  // tutup menu saat klik di luar
  useEffect(() => {
    if (!menu) return;
    const close = (e: Event) => { if (!(e.target as HTMLElement).closest?.('.pf-menu')) setMenu(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(null); };
    document.addEventListener('mousedown', close); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [menu]);

  const pos = (e: { clientX: number; clientY: number }) => {
    const b = rootRef.current!.getBoundingClientRect();
    return { x: Math.min(e.clientX - b.left, b.width - 230), y: e.clientY - b.top };
  };

  // ---------- seret & lepas
  const onDragStart = (field: string, from?: Area, idx?: number) => (e: DragEvent) => { dragRef.current = { field, from, idx }; e.dataTransfer.setData('text/plain', field); e.dataTransfer.effectAllowed = 'move'; };
  const onDrop = (to: Area) => (e: DragEvent) => {
    e.preventDefault(); (e.currentTarget as HTMLElement).classList.remove('over');
    const d = dragRef.current; dragRef.current = null; if (!d) return;
    if (d.from !== undefined && d.idx !== undefined) moveChip(d.from, d.idx, to); else addTo(to, d.field);
  };
  const over = (e: DragEvent) => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.add('over'); };
  const leave = (e: DragEvent) => (e.currentTarget as HTMLElement).classList.remove('over');
  const dropOut = (e: DragEvent) => { e.preventDefault(); const d = dragRef.current; dragRef.current = null; if (d?.from !== undefined && d.idx !== undefined) removeChip(d.from, d.idx); };

  const refresh = () => { setCache(data); setStale(false); if (stale) mark('m9'); };
  const doDrill = (c: Cell) => {
    if (c.kind !== 'val' || !c.row || !c.col) return;
    const rs = recs.filter(r => c.row!.every((x, i) => lab(r, st.rows[i]) === x) && c.col!.every((x, i) => lab(r, st.cols[i]) === x));
    setDrill(rs); setSheet('drill'); mark('m8');
  };

  // Tanpa filter, Excel menaruh pivot di A3 (baris 1–2 disiapkan untuk filter).
  const offset = st.filters.length ? 0 : 2;
  const width = Math.max(4, ...grid.cells.map(r => r.length)) + 1;
  const sheetRows = Math.max(16, offset + grid.cells.length + 3);
  const cellAt = (r: number, c: number): Cell | undefined => (r < offset ? undefined : grid.cells[r - offset]?.[c]);
  const chips = (area: Area) => area === 'vals' ? st.vals.map(vname) : (st[area] as string[]);
  const sigma = st.vals.length > 1;

  const Chip = ({ area, i, label }: { area: Area; i: number; label: string }) => (
    <button type="button" className="pf-chip" draggable onDragStart={onDragStart(area === 'vals' ? st.vals[i].field : label, area, i)}
      onClick={e => setMenu({ ...pos(e), kind: 'chip', area, idx: i })} aria-haspopup="menu">
      <span>{label}</span><svg viewBox="0 0 10 10" aria-hidden="true"><path d="m2 3.5 3 3 3-3" /></svg>
    </button>
  );

  const filterMenu = menu?.kind === 'filter' ? menu : null;
  const activeCell = (sheet === 'pivot' || sheet === 'page') && active ? cellAt(active.r, active.c) : undefined;
  const hint = activeCell ? gpd(activeCell) : '';

  return (
    <div className="pf" ref={rootRef}>
      {/* ribbon */}
      <div className="pf-tabs" role="tablist">
        {(['insert', 'analyze', 'design'] as const).map(t => (
          <button key={t} role="tab" aria-selected={ribbon === t} disabled={t !== 'insert' && !created} onClick={() => setRibbon(t)}>{t === 'insert' ? 'Insert' : t === 'analyze' ? 'PivotTable Analyze' : 'Design'}</button>
        ))}
      </div>
      <div className="pf-ribbon">
        {ribbon === 'insert' && <>
          <button className="pf-rb big" onClick={() => { if (created) { setSheet('pivot'); return; } setSheet('data'); setDialog('create'); }}><i className="ic-pivot" />PivotTable</button>
          <span className="pf-hint">{created ? 'PivotTable sudah dibuat di Sheet2.' : 'Klik PivotTable untuk meringkas data penjualan.'}</span>
        </>}
        {ribbon === 'analyze' && <>
          <button className="pf-rb" onClick={refresh}><i className="ic-refresh" />Refresh</button>
          <button className="pf-rb" aria-pressed={showList} onClick={() => setShowList(s => !s)}><i className="ic-list" />Field List</button>
          <button className="pf-rb" onClick={() => { setCollapsed(new Set(rowTree.filter(n => n.kids.length).map(n => n.key))); }}>− Collapse Field</button>
          <button className="pf-rb" onClick={() => setCollapsed(new Set())}>+ Expand Field</button>
          <span className="pf-sep" />
          <button className="pf-rb" disabled={!activeCell || activeCell.kind !== 'item'} title="Pilih dulu sebuah label baris" onClick={() => activeCell?.field && setDialog({ k: 'group', field: activeCell.field, item: activeCell.item })}>⊞ Group Selection</button>
          <button className="pf-rb" disabled={!activeCell?.field || !isGrouped(activeCell.field)} onClick={() => activeCell?.field && ungroup(activeCell.field, activeCell.item)}>⊟ Ungroup</button>
          <span className="pf-sep" />
          <button className="pf-rb" onClick={() => setDialog({ k: 'slicer' })}>▦ Insert Slicer</button>
          <button className="pf-rb" onClick={() => setDialog({ k: 'calc' })}>ƒx Calculated Field</button>
          <button className="pf-rb" onClick={() => setDialog({ k: 'opts' })}>Options</button>
          <button className="pf-rb" disabled={!st.filters.length} title="Butuh field di area Filters" onClick={() => setDialog({ k: 'pages' })}>⧉ Show Report Filter Pages</button>
        </>}
        {ribbon === 'design' && <>
          <label className="pf-rs">Subtotals<select value={subs ? '1' : '0'} onChange={e => setSubs(e.target.value === '1')}><option value="1">Show all Subtotals</option><option value="0">Do Not Show Subtotals</option></select></label>
          <label className="pf-rs">Grand Totals<select value={grand ? '1' : '0'} onChange={e => setGrand(e.target.value === '1')}><option value="1">On for Rows and Columns</option><option value="0">Off for Rows and Columns</option></select></label>
          <label className="pf-rs">Report Layout<select value={layout} onChange={e => setLayout(e.target.value as any)}><option value="compact">Show in Compact Form</option><option value="tabular">Show in Tabular Form</option></select></label>
          <label className="pf-rs">Item Labels<select value={opts.repeat ? '1' : '0'} onChange={e => { setOpts(o => ({ ...o, repeat: e.target.value === '1' })); if (e.target.value === '1') setLayout('tabular'); }}><option value="0">Do Not Repeat Item Labels</option><option value="1">Repeat All Item Labels</option></select></label>
        </>}
      </div>

      {/* formula bar */}
      <div className="pf-fx"><span className="pf-nb">{active ? colName(active.c) + (active.r + 1) : 'A1'}</span><i>fx</i><span className="pf-fv2">{active?.text ?? ''}</span></div>
      {hint && <p className="pf-gpd" title="Rumus yang Excel buat kalau kamu mengetik = lalu mengklik sel ini dari luar pivot">Dirujuk dari sel lain: <code>{hint}</code></p>}

      <div className={'pf-main' + (sheet === 'pivot' && showList ? ' with-list' : '')}>
        <div className="pf-sheet" onDragOver={e => e.preventDefault()} onDrop={dropOut}>
          {sheet === 'data' && (
            <table className="pf-grid">
              <thead><tr><th />{FIELDS.map((_, i) => <th key={i}>{colName(i)}</th>)}</tr></thead>
              <tbody>
                <tr><th>1</th>{FIELDS.map(f => <td key={f} className="pf-dh">{f}</td>)}</tr>
                {data.map((r, i) => (
                  <tr key={i}><th>{i + 2}</th>{FIELDS.map((f, j) => {
                    const ed = editing && editing.r === i && editing.f === f;
                    return <td key={f} className={(typeof r[f] === 'number' ? 'n ' : '') + (active?.r === i + 1 && active.c === j ? 'act' : '')}
                      onClick={() => setActive({ r: i + 1, c: j, text: disp(r, f) })}
                      onDoubleClick={() => NUMERIC.has(f) && setEditing({ r: i, f })}>
                      {ed ? <input autoFocus className="pf-in" defaultValue={String(r[f])} onBlur={e => { const v = Number(e.target.value.replace(/\./g, '').replace(',', '.')); if (isFinite(v) && v !== r[f]) { setData(d => d.map((x, k) => (k === i ? { ...x, [f]: v } : x))); setStale(true); } setEditing(null); }} onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') setEditing(null); }} />
                        : disp(r, f)}
                    </td>;
                  })}</tr>
                ))}
              </tbody>
            </table>
          )}

          {(sheet === 'pivot' || sheet === 'page') && slicers.length > 0 && (
            <div className="pf-slicers">
              {slicers.map(f => { const xs = sel[f]; return (
                <div key={f} className="pf-slicer" role="group" aria-label={'Slicer ' + f}>
                  <p><b>{f}</b><button title="Clear Filter" aria-label={'Hapus filter ' + f} disabled={!xs} onClick={() => setSel(s => ({ ...s, [f]: undefined }))}>⨯</button><button title="Tutup slicer" aria-label={'Tutup slicer ' + f} onClick={() => setSlicers(l => l.filter(x => x !== f))}>×</button></p>
                  <div>{itemsOf(f).map(it => { const on = !xs || xs.includes(it); return (
                    <button key={it} aria-pressed={on} className={on ? 'on' : ''} onClick={e => { const multi = e.ctrlKey || e.metaKey || e.shiftKey; setSel(s => { const cur = s[f]; if (!multi) return { ...s, [f]: cur?.length === 1 && cur[0] === it ? undefined : [it] }; const base = new Set(cur ?? []); base.has(it) ? base.delete(it) : base.add(it); const arr = [...base]; return { ...s, [f]: arr.length && arr.length < itemsOf(f).length ? arr : undefined }; }); mark('m12'); }}>{it}</button>
                  ); })}</div>
                </div>
              ); })}
              <p className="pf-slicer-tip">Klik satu tombol untuk memfilter. Tahan Ctrl (⌘ di Mac) untuk memilih beberapa.</p>
            </div>
          )}
          {(sheet === 'pivot' || sheet === 'page') && (
            <table className="pf-grid pf-pv">
              <thead><tr><th />{Array.from({ length: width }, (_, i) => <th key={i}>{colName(i)}</th>)}</tr></thead>
              <tbody>
                {Array.from({ length: sheetRows }, (_, r) => (
                  <tr key={r}><th>{r + 1}</th>{Array.from({ length: width }, (_, c) => {
                    if (grid.empty && r === 2 && c === 0) return <td key={c} rowSpan={1} className="pf-ph-c"><div className="pf-ph"><b>PivotTable1</b><span>Untuk membuat laporan, pilih field dari daftar PivotTable Fields di kanan.</span></div></td>;
                    const cell = cellAt(r, c);
                    const isAct = active?.r === r && active.c === c;
                    if (!cell) return <td key={c} className={isAct ? 'act' : ''} onClick={() => setActive({ r, c, text: '' })} />;
                    return (
                      <td key={c} className={[cell.cls, cell.num ? 'n' : '', isAct ? 'act' : ''].filter(Boolean).join(' ')}
                        style={cell.level ? { paddingLeft: 6 + cell.level * 14 } : undefined}
                        onClick={() => setActive({ r, c, text: cell.text })}
                        onDoubleClick={() => doDrill(cell)}
                        onContextMenu={(e: RMouseEvent) => { e.preventDefault(); setActive({ r, c, text: cell.text }); setMenu({ ...pos(e), kind: 'ctx', cell }); }}>
                        <span className="pf-cell">
                          {cell.toggle && <button className="pf-tg" aria-label={collapsed.has(cell.toggle) ? 'Buka' : 'Ciutkan'} onClick={e => { e.stopPropagation(); setCollapsed(s => { const n = new Set(s); n.has(cell.toggle!) ? n.delete(cell.toggle!) : n.add(cell.toggle!); return n; }); }}>{collapsed.has(cell.toggle) ? '+' : '−'}</button>}
                          <span className="pf-t">{cell.text}</span>
                          {cell.caret && <button className="pf-dd" aria-label={'Filter ' + cell.text} onClick={e => { e.stopPropagation(); const field = cell.kind === 'filter' ? cell.field! : cell.field!; setMenu({ ...pos(e), kind: 'filter', field, axis: cell.kind === 'filter' ? 'filters' : cell.kind === 'cl' ? 'cols' : 'rows' }); }}>▾</button>}
                        </span>
                      </td>
                    );
                  })}</tr>
                ))}
              </tbody>
            </table>
          )}

          {sheet === 'drill' && drill && (
            <table className="pf-grid">
              <thead><tr><th />{FIELDS.map((_, i) => <th key={i}>{colName(i)}</th>)}</tr></thead>
              <tbody>
                <tr><th>1</th>{FIELDS.map(f => <td key={f} className="pf-dh pf-tbl">{f}</td>)}</tr>
                {drill.map((r, i) => <tr key={i} className={i % 2 ? 'band' : ''}><th>{i + 2}</th>{FIELDS.map(f => <td key={f} className={typeof r[f] === 'number' ? 'n' : ''}>{disp(r, f)}</td>)}</tr>)}
              </tbody>
            </table>
          )}
        </div>

        {/* PivotTable Fields */}
        {sheet === 'pivot' && showList && (
          <aside className="pf-list" aria-label="PivotTable Fields">
            <div className="pf-list-h"><b>PivotTable Fields</b><button aria-label="Tutup" onClick={() => setShowList(false)}>×</button></div>
            <p className="pf-list-s">Pilih field untuk ditambahkan ke laporan:</p>
            <input className="pf-search" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
            <ul className="pf-fields">
              {ALLF.filter(f => f.toLowerCase().includes(search.toLowerCase())).map(f => (
                <li key={f} draggable onDragStart={onDragStart(f)}>
                  <label><input type="checkbox" checked={used(f)} onChange={() => toggleField(f)} /> {f}{f in calcMap ? <small className="pf-tagc"> (calculated)</small> : null}</label>
                  {sel[f] && <span className="pf-funnel" title="Ada filter">⏷</span>}
                </li>
              ))}
            </ul>
            <p className="pf-list-s">Seret field ke area di bawah:</p>
            <div className="pf-areas">
              {(['filters', 'cols', 'rows', 'vals'] as Area[]).map(a => (
                <div key={a} className={'pf-area a-' + a} onDragOver={over} onDragLeave={leave} onDrop={onDrop(a)}>
                  <p>{a === 'filters' ? '▼ ' : a === 'cols' ? '▥ ' : a === 'rows' ? '☰ ' : 'Σ '}{AREA_L[a]}</p>
                  {chips(a).map((l, i) => <Chip key={a + i + l} area={a} i={i} label={l} />)}
                  {a === 'cols' && sigma && <span className="pf-chip sigma">Σ Values</span>}
                </div>
              ))}
            </div>
          </aside>
        )}
        {sheet === 'pivot' && !showList && <button className="pf-showlist" onClick={() => setShowList(true)}>Tampilkan PivotTable Fields</button>}
      </div>

      {/* tab sheet */}
      <div className="pf-sheets">
        <button aria-pressed={sheet === 'data'} onClick={() => setSheet('data')}>{sheetName}</button>
        {created && <button aria-pressed={sheet === 'pivot'} onClick={() => { setSheet('pivot'); setRibbon(r => (r === 'insert' ? 'analyze' : r)); }}>Sheet2</button>}
        {drill && <button aria-pressed={sheet === 'drill'} onClick={() => setSheet('drill')}>Sheet3</button>}
        {pages?.items.map(it => <button key={it} aria-pressed={sheet === 'page' && page === it} onClick={() => { setSheet('page'); setPage(it); }}>{it}</button>)}
        {stale && created && <span className="pf-stale">Data sumber berubah. Pivot belum ikut berubah sampai di-Refresh.</span>}
      </div>

      {/* dialog Create PivotTable */}
      {dialog === 'create' && (
        <div className="pf-dlg" role="dialog" aria-label="Create PivotTable">
          <div className="pf-dlg-in">
            <p className="pf-dlg-t">Create PivotTable</p>
            <p className="pf-dlg-s">Choose the data that you want to analyze</p>
            <label className="pf-radio"><input type="radio" defaultChecked /> Select a table or range</label>
            <label className="pf-field">Table/Range: <input readOnly value={`${sheetName}!$A$1:$${colName(FIELDS.length - 1)}$${data.length + 1}`} /></label>
            <p className="pf-dlg-s">Choose where you want the PivotTable to be placed</p>
            <label className="pf-radio"><input type="radio" defaultChecked /> New Worksheet</label>
            <label className="pf-radio dim"><input type="radio" disabled /> Existing Worksheet</label>
            <div className="pf-dlg-b">
              <button className="btn sm primary" onClick={() => { setCreated(true); setCache(data); setStale(false); setDialog(null); setSheet('pivot'); setRibbon('analyze'); setActive({ r: 2, c: 0, text: '' }); }}>OK</button>
              <button className="btn sm" onClick={() => setDialog(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Value Field Settings */}
      {dialog && typeof dialog === 'object' && 'vf' in dialog && st.vals[dialog.vf] && (() => {
        const i = dialog.vf, v = st.vals[i];
        return (
          <div className="pf-dlg" role="dialog" aria-label="Value Field Settings">
            <div className="pf-dlg-in">
              <p className="pf-dlg-t">Value Field Settings</p>
              <p className="pf-dlg-s">Source Name: {v.field}</p>
              <label className="pf-field">Custom Name: <input readOnly value={vname(v)} /></label>
              <div className="pf-vfs">
                <div><p className="pf-dlg-s">Summarize value field by</p>
                  <div className="pf-lb">{(Object.keys(AGG_L) as Agg[]).map(a => <button key={a} aria-pressed={v.agg === a} onClick={() => setVF(i, { agg: a })}>{AGG_L[a]}</button>)}</div></div>
                <div><p className="pf-dlg-s">Show values as</p>
                  <div className="pf-lb">{(Object.keys(SHOW_L) as Show[]).map(s => <button key={s} aria-pressed={v.show === s} onClick={() => setVF(i, { show: s })}>{SHOW_L[s]}</button>)}</div></div>
              </div>
              <label className="pf-radio"><input type="checkbox" checked={v.num} onChange={e => setVF(i, { num: e.target.checked })} /> Number Format: Number, pakai pemisah ribuan</label>
              <div className="pf-dlg-b"><button className="btn sm primary" onClick={() => setDialog(null)}>OK</button></div>
            </div>
          </div>
        );
      })()}

      {/* Grouping */}
      {dialog && typeof dialog === 'object' && 'k' in dialog && dialog.k === 'group' && <GroupDlg key={dialog.field} field={dialog.field} item={dialog.item}
        kind={DATES.has(dialog.field) ? 'date' : NUMERIC.has(dialog.field) ? 'num' : 'text'}
        range={(() => { const xs = cache.map(r => r[dialog.field]).filter((x): x is number => typeof x === 'number'); return xs.length ? [Math.min(...xs), Math.max(...xs)] : [0, 0]; })()}
        fdate={fdate} items={itemsOf(dialog.field)} nextName={'Group' + ((userGroups[baseOf(dialog.field)]?.length ?? 0) + 1)}
        onCancel={() => setDialog(null)}
        onDate={g => { setDateGroup(d => ({ ...d, [dialog.field]: g })); setSel(s => ({ ...s, [dialog.field]: undefined })); setDialog(null); mark('m10'); }}
        onNum={g => { setNumGroup(d => ({ ...d, [dialog.field]: g })); setSel(s => ({ ...s, [dialog.field]: undefined })); setDialog(null); mark('m10'); }}
        onText={(name, items) => {
          const b = baseOf(dialog.field), f2 = b + '2';
          setUserGroups(u => ({ ...u, [b]: [...(u[b] ?? []).map(g => ({ ...g, items: g.items.filter(x => !items.includes(x)) })).filter(g => g.items.length), { name, items }] }));
          setSt(s => (s.rows.includes(f2) || !s.rows.includes(b) ? s : { ...s, rows: s.rows.flatMap(x => (x === b ? [f2, b] : [x])) }));
          setDialog(null); mark('m11');
        }} />}

      {/* Calculated Field */}
      {dialog && typeof dialog === 'object' && 'k' in dialog && dialog.k === 'calc' && <CalcDlg fields={FIELDS.filter(f => NUMERIC.has(f))} calcs={calcs} test={f => calcEval(cache, f)}
        onCancel={() => setDialog(null)}
        onAdd={(name, formula) => {
          setCalcs(cs => [...cs.filter(c => c.name !== name), { name, formula }]);
          setSt(s => (s.vals.some(v => v.field === name) ? s : { ...s, vals: [...s.vals, { field: name, agg: 'sum', show: 'none', num: true }] }));
          setDialog(null); mark('m13');
        }}
        onDelete={name => { setCalcs(cs => cs.filter(c => c.name !== name)); setSt(s => removeField(s, name)); }} />}

      {/* PivotTable Options */}
      {dialog && typeof dialog === 'object' && 'k' in dialog && dialog.k === 'opts' && (
        <div className="pf-dlg" role="dialog" aria-label="PivotTable Options">
          <div className="pf-dlg-in">
            <p className="pf-dlg-t">PivotTable Options</p>
            <p className="pf-dlg-s">Layout &amp; Format</p>
            <label className="pf-field">For empty cells show: <input value={opts.empty} placeholder="(kosong)" onChange={e => setOpts(o => ({ ...o, empty: e.target.value }))} /></label>
            <p className="pf-dlg-s">Display</p>
            <label className="pf-radio"><input type="checkbox" checked={opts.noData} onChange={e => setOpts(o => ({ ...o, noData: e.target.checked }))} /> Show items with no data on rows</label>
            <label className="pf-radio"><input type="checkbox" checked={grand} onChange={e => setGrand(e.target.checked)} /> Show grand totals</label>
            <label className="pf-radio"><input type="checkbox" checked={subs} onChange={e => setSubs(e.target.checked)} /> Show subtotals</label>
            <p className="pf-m-tip">Contoh: isi <b>0</b> agar sel kosong tampil 0, lalu centang <i>Show items with no data</i> supaya cabang yang tidak berjualan di bulan itu tetap muncul.</p>
            <div className="pf-dlg-b"><button className="btn sm primary" onClick={() => { setDialog(null); if (opts.empty !== '' || opts.noData) mark('m14'); }}>OK</button></div>
          </div>
        </div>
      )}

      {/* Insert Slicers */}
      {dialog && typeof dialog === 'object' && 'k' in dialog && dialog.k === 'slicer' && <PickDlg title="Insert Slicers" sub="Pilih field yang ingin dijadikan tombol filter:" options={ALLF.filter(f => !isNum(f) || DATES.has(f))} initial={slicers}
        onCancel={() => setDialog(null)} onOk={xs => { setSlicers(xs); setDialog(null); }} />}

      {/* Show Report Filter Pages */}
      {dialog && typeof dialog === 'object' && 'k' in dialog && dialog.k === 'pages' && <PickDlg title="Show Report Filter Pages" sub="Show all report filter pages of:" single options={st.filters} initial={[st.filters[0]]}
        onCancel={() => setDialog(null)} onOk={xs => { const f = xs[0]; if (f) { const items = sel[f] ?? itemsOf(f); setPages({ field: f, items }); setSheet('page'); setPage(items[0]); mark('m15'); } setDialog(null); }} />}

      {/* menu field chip */}
      {menu?.kind === 'chip' && (
        <div className="pf-menu" style={{ left: menu.x, top: menu.y }} role="menu">
          {menu.idx > 0 && <button onClick={() => { const { area, idx } = menu; moveChip(area, idx, area, idx - 1); setMenu(null); }}>Move Up</button>}
          {menu.idx < chips(menu.area).length - 1 && <button onClick={() => { const { area, idx } = menu; moveChip(area, idx, area, idx + 1); setMenu(null); }}>Move Down</button>}
          <hr />
          {(['filters', 'rows', 'cols', 'vals'] as Area[]).filter(a => a !== menu.area).map(a => (
            <button key={a} onClick={() => { moveChip(menu.area, menu.idx, a); setMenu(null); }}>Move to {a === 'filters' ? 'Report Filter' : a === 'rows' ? 'Row Labels' : a === 'cols' ? 'Column Labels' : 'Values'}</button>
          ))}
          <hr />
          <button onClick={() => { removeChip(menu.area, menu.idx); setMenu(null); }}>Remove Field</button>
          {menu.area === 'vals' && <button onClick={() => { setDialog({ vf: menu.idx }); setMenu(null); }}>Value Field Settings…</button>}
        </div>
      )}

      {/* menu klik kanan di pivot */}
      {menu?.kind === 'ctx' && (() => {
        const c = menu.cell; const vi = c.vi ?? 0; const rowField = c.row?.length ? st.rows[c.row.length - 1] : st.rows[0];
        return (
          <div className="pf-menu" style={{ left: menu.x, top: menu.y }} role="menu">
            <button onClick={() => { refresh(); setMenu(null); }}>Refresh</button>
            {c.kind === 'item' && c.field && <>
              <hr />
              <button onClick={() => { setDialog({ k: 'group', field: c.field!, item: c.item }); setMenu(null); }}>Group…</button>
              {isGrouped(c.field) && <button onClick={() => { ungroup(c.field!, c.item); setMenu(null); }}>Ungroup</button>}
              <button onClick={() => { setSel(s => ({ ...s, [c.field!]: [c.item!] })); setMenu(null); }}>Filter › Keep Only Selected Items</button>
              <button onClick={() => { setSel(s => ({ ...s, [c.field!]: (s[c.field!] ?? itemsOf(c.field!)).filter(x => x !== c.item) })); setMenu(null); }}>Filter › Hide Selected Items</button>
              <button onClick={() => { const f = c.field!; setSt(s => removeField(s, f)); setMenu(null); }}>Remove "{c.field}"</button>
            </>}
            {rowField && st.vals.length > 0 && <>
              <hr />
              <button onClick={() => { setSort(s => ({ ...s, [rowField]: { by: 'value', dir: 1 } })); setMenu(null); }}>Sort › Smallest to Largest</button>
              <button onClick={() => { setSort(s => ({ ...s, [rowField]: { by: 'value', dir: -1 } })); setMenu(null); }}>Sort › Largest to Smallest</button>
            </>}
            {c.kind === 'val' && <>
              <hr />
              {(Object.keys(AGG_L) as Agg[]).map(a => <button key={a} aria-pressed={st.vals[vi]?.agg === a} onClick={() => { setVF(vi, { agg: a }); setMenu(null); }}>Summarize Values By › {AGG_L[a]}</button>)}
              <hr />
              {(Object.keys(SHOW_L) as Show[]).map(s => <button key={s} aria-pressed={st.vals[vi]?.show === s} onClick={() => { setVF(vi, { show: s }); setMenu(null); }}>Show Values As › {SHOW_L[s]}</button>)}
              <hr />
              <button onClick={() => { setDialog({ vf: vi }); setMenu(null); }}>Value Field Settings…</button>
              <button onClick={() => { doDrill(c); setMenu(null); }}>Show Details</button>
              <button onClick={() => { removeChip('vals', vi); setMenu(null); }}>Remove "{st.vals[vi] ? vname(st.vals[vi]) : ''}"</button>
            </>}
          </div>
        );
      })()}

      {/* menu filter ▾ (Row Labels / Column Labels / Filters) */}
      {filterMenu && <FilterMenu key={filterMenu.field + filterMenu.axis} x={filterMenu.x} y={filterMenu.y} axis={filterMenu.axis}
        fields={filterMenu.axis === 'rows' ? st.rows : filterMenu.axis === 'cols' ? st.cols : [filterMenu.field]} initial={filterMenu.field}
        itemsOf={itemsOf} sel={sel} sort={sort}
        onSort={(f, so) => setSort(s => ({ ...s, [f]: so }))}
        onApply={(f, xs) => { setSel(s => ({ ...s, [f]: xs })); setMenu(null); }} onClose={() => setMenu(null)} />}

      {/* misi */}
      {!drillMode && <div className="pf-missions">
        <p className="pf-m-h">Misi latihan <span>{done.size}/{MISSIONS.length}</span></p>
        <ol>{MISSIONS.map(m => <li key={m.id} className={done.has(m.id) ? 'ok' : ''}><span className="pf-m-c" aria-hidden="true">{done.has(m.id) ? '✓' : ''}</span><span dangerouslySetInnerHTML={{ __html: m.text }} /></li>)}</ol>
        <p className="pf-m-tip">Tips: centang field teks otomatis masuk ke Rows, field angka ke Values, persis seperti Excel. Klik nama field di area mana pun untuk memindahkan atau membuka Value Field Settings. Di HP, pakai menu itu sebagai ganti seret-lepas.</p>
      </div>}
    </div>
  );
}

function FilterMenu(p: { x: number; y: number; axis: Area; fields: string[]; initial: string; itemsOf: (f: string) => string[]; sel: Record<string, string[] | undefined>; sort: Record<string, Sort>; onSort: (f: string, s: Sort) => void; onApply: (f: string, xs: string[] | undefined) => void; onClose: () => void }) {
  const [f, setF] = useState(p.initial);
  const all = p.itemsOf(f);
  const [pick, setPick] = useState<Set<string>>(() => new Set(p.sel[p.initial] ?? all));
  useEffect(() => { setPick(new Set(p.sel[f] ?? p.itemsOf(f))); }, [f]);
  const allOn = pick.size === all.length;
  return (
    <div className="pf-menu pf-fmenu" style={{ left: p.x, top: p.y }} role="dialog" aria-label={'Filter ' + f}>
      {p.fields.length > 1 && <label className="pf-rs">Select field:<select value={f} onChange={e => setF(e.target.value)}>{p.fields.map(x => <option key={x}>{x}</option>)}</select></label>}
      {p.axis !== 'filters' && <>
        <button onClick={() => { p.onSort(f, { by: 'label', dir: 1 }); p.onClose(); }}>↑ Sort A to Z</button>
        <button onClick={() => { p.onSort(f, { by: 'label', dir: -1 }); p.onClose(); }}>↓ Sort Z to A</button>
        <hr />
      </>}
      <div className="pf-checks">
        <label><input type="checkbox" checked={allOn} onChange={() => setPick(allOn ? new Set() : new Set(all))} /> (Select All)</label>
        {all.map(x => <label key={x}><input type="checkbox" checked={pick.has(x)} onChange={() => setPick(s => { const n = new Set(s); n.has(x) ? n.delete(x) : n.add(x); return n; })} /> {x}</label>)}
      </div>
      <div className="pf-dlg-b">
        <button className="btn sm primary" disabled={!pick.size} onClick={() => p.onApply(f, pick.size === all.length ? undefined : [...pick])}>OK</button>
        <button className="btn sm" onClick={p.onClose}>Cancel</button>
      </div>
    </div>
  );
}

function GroupDlg(p: { field: string; item?: string; kind: 'date' | 'num' | 'text'; range: number[]; fdate: (n: number) => string; items: string[]; nextName: string; onCancel: () => void; onDate: (g: 'months' | 'quarters' | 'years') => void; onNum: (g: { start: number; end: number; by: number }) => void; onText: (name: string, items: string[]) => void }) {
  const [by, setBy] = useState<'months' | 'quarters' | 'years'>('months');
  const [lo, setLo] = useState(String(Math.floor(p.range[0]))), [hi, setHi] = useState(String(Math.ceil(p.range[1]))), [step, setStep] = useState('10');
  const [name, setName] = useState(p.nextName);
  const [pick, setPick] = useState<Set<string>>(() => new Set(p.item ? [p.item] : []));
  return (
    <div className="pf-dlg" role="dialog" aria-label="Grouping">
      <div className="pf-dlg-in">
        <p className="pf-dlg-t">Grouping: {p.field}</p>
        {p.kind === 'date' && <>
          <p className="pf-dlg-s">Auto · Starting at {p.fdate(p.range[0])} · Ending at {p.fdate(p.range[1])}</p>
          <p className="pf-dlg-s">By</p>
          <div className="pf-lb">{(['months', 'quarters', 'years'] as const).map(g => <button key={g} aria-pressed={by === g} onClick={() => setBy(g)}>{g === 'months' ? 'Months' : g === 'quarters' ? 'Quarters' : 'Years'}</button>)}</div>
          <div className="pf-dlg-b"><button className="btn sm primary" onClick={() => p.onDate(by)}>OK</button><button className="btn sm" onClick={p.onCancel}>Cancel</button></div>
        </>}
        {p.kind === 'num' && <>
          <label className="pf-field">Starting at: <input inputMode="decimal" value={lo} onChange={e => setLo(e.target.value)} /></label>
          <label className="pf-field">Ending at: <input inputMode="decimal" value={hi} onChange={e => setHi(e.target.value)} /></label>
          <label className="pf-field">By: <input inputMode="decimal" value={step} onChange={e => setStep(e.target.value)} /></label>
          <div className="pf-dlg-b"><button className="btn sm primary" disabled={!(+step > 0) || !(+hi >= +lo)} onClick={() => p.onNum({ start: +lo, end: +hi, by: +step })}>OK</button><button className="btn sm" onClick={p.onCancel}>Cancel</button></div>
        </>}
        {p.kind === 'text' && <>
          <p className="pf-dlg-s">Pilih item yang mau digabung (di Excel: blok beberapa label dengan Ctrl, lalu Group Selection):</p>
          <div className="pf-checks">{p.items.map(it => <label key={it} className="pf-radio"><input type="checkbox" checked={pick.has(it)} onChange={() => setPick(s => { const n = new Set(s); n.has(it) ? n.delete(it) : n.add(it); return n; })} /> {it}</label>)}</div>
          <label className="pf-field">Nama grup: <input value={name} onChange={e => setName(e.target.value)} /></label>
          <div className="pf-dlg-b"><button className="btn sm primary" disabled={!pick.size || !name.trim()} onClick={() => p.onText(name.trim(), [...pick])}>OK</button><button className="btn sm" onClick={p.onCancel}>Cancel</button></div>
        </>}
      </div>
    </div>
  );
}

function CalcDlg(p: { fields: string[]; calcs: { name: string; formula: string }[]; test: (f: string) => number | null; onCancel: () => void; onAdd: (name: string, formula: string) => void; onDelete: (name: string) => void }) {
  const [name, setName] = useState('Harga');
  const [f, setF] = useState('= Nilai/Qty');
  const ok = p.test(f) !== null && /^[A-Za-z_][\w ]*$/.test(name.trim()) && !p.fields.includes(name.trim());
  return (
    <div className="pf-dlg" role="dialog" aria-label="Insert Calculated Field">
      <div className="pf-dlg-in">
        <p className="pf-dlg-t">Insert Calculated Field</p>
        <label className="pf-field">Name: <input value={name} onChange={e => setName(e.target.value)} list="pf-calcs" /></label>
        <datalist id="pf-calcs">{p.calcs.map(c => <option key={c.name} value={c.name} />)}</datalist>
        <label className="pf-field">Formula: <input value={f} onChange={e => setF(e.target.value)} spellCheck={false} /></label>
        <p className="pf-dlg-s">Fields (klik untuk menyisipkan):</p>
        <div className="pf-lb">{p.fields.map(x => <button key={x} onClick={() => setF(v => v + x)}>{x}</button>)}</div>
        <p className="pf-m-tip">Calculated field menghitung dari <b>jumlah</b> tiap field per sel pivot. Jadi <code>Nilai/Qty</code> = total Nilai ÷ total Qty (harga rata-rata tertimbang), bukan rata-rata harga per baris.{!ok && ' Rumus atau nama belum valid.'}</p>
        {p.calcs.length > 0 && <p className="pf-dlg-s">Sudah ada: {p.calcs.map(c => <span key={c.name} className="pf-calc">{c.name} {c.formula} <button aria-label={'Hapus ' + c.name} onClick={() => p.onDelete(c.name)}>Delete</button></span>)}</p>}
        <div className="pf-dlg-b"><button className="btn sm primary" disabled={!ok} onClick={() => p.onAdd(name.trim(), f)}>OK</button><button className="btn sm" onClick={p.onCancel}>Cancel</button></div>
      </div>
    </div>
  );
}

function PickDlg(p: { title: string; sub: string; options: string[]; initial: string[]; single?: boolean; onOk: (xs: string[]) => void; onCancel: () => void }) {
  const [pick, setPick] = useState<string[]>(p.initial.filter(Boolean));
  return (
    <div className="pf-dlg" role="dialog" aria-label={p.title}>
      <div className="pf-dlg-in">
        <p className="pf-dlg-t">{p.title}</p>
        <p className="pf-dlg-s">{p.sub}</p>
        <div className="pf-checks">{p.options.map(o => <label key={o} className="pf-radio"><input type={p.single ? 'radio' : 'checkbox'} name="pf-pick" checked={pick.includes(o)} onChange={() => setPick(s => (p.single ? [o] : s.includes(o) ? s.filter(x => x !== o) : [...s, o]))} /> {o}</label>)}</div>
        <div className="pf-dlg-b"><button className="btn sm primary" disabled={p.single && !pick.length} onClick={() => p.onOk(pick)}>OK</button><button className="btn sm" onClick={p.onCancel}>Cancel</button></div>
      </div>
    </div>
  );
}
