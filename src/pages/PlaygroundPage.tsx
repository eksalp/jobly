// Excel Playground: lembar kerja bebas untuk mencoba rumus apa saja. Isian tersimpan otomatis di browser.
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { XL } from '../engine/engine.js';
import { Workbench } from '../components/Workbench';
import type { WorkItem } from '../lib/work';

type Saved = { cols: number; rows: number; cells: Record<string, unknown>; fmt?: Record<string, string>; bold?: string[]; name?: string };
const KEY = 'kr.playground.v1';
const MAX_COLS = 26, MAX_ROWS = 200;
const D = XL.D as (y: number, m: number, d: number) => number;

/** Template awal. Semuanya data contoh yang bisa langsung diolah dengan rumus. */
const TEMPLATES: { id: string; name: string; desc: string; make: () => Saved }[] = [
  { id: 'kosong', name: 'Lembar kosong', desc: '12 kolom × 40 baris', make: () => ({ cols: 12, rows: 40, cells: {} }) },
  { id: 'anggaran', name: 'Anggaran bulanan', desc: 'SUM, selisih, IF', make: () => ({ cols: 8, rows: 20, bold: ['A1', 'B1', 'C1', 'D1', 'A9'], cells: {
    A1: 'Pos', B1: 'Anggaran', C1: 'Realisasi', D1: 'Selisih', A2: 'Sewa kos', B2: 1500000, C2: 1500000, A3: 'Makan', B3: 1800000, C3: 2050000,
    A4: 'Transport', B4: 600000, C4: 520000, A5: 'Pulsa & internet', B5: 200000, C5: 200000, A6: 'Hiburan', B6: 400000, C6: 610000, A7: 'Tabungan', B7: 1000000, C7: 800000, A9: 'Total' } }) },
  { id: 'penjualan', name: 'Penjualan toko', desc: 'SUMIFS, COUNTIFS, PivotTable', make: () => ({ cols: 10, rows: 30, fmt: { A: 'date' }, bold: ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'], cells: {
    A1: 'Tanggal', B1: 'Cabang', C1: 'Produk', D1: 'Qty', E1: 'Harga', F1: 'Total',
    ...Object.fromEntries(([
      [D(2026, 10, 1), 'Bandung', 'Kopi susu', 24, 18000], [D(2026, 10, 1), 'Jakarta', 'Roti cokelat', 30, 12000], [D(2026, 10, 2), 'Jakarta', 'Kopi susu', 41, 18000],
      [D(2026, 10, 2), 'Surabaya', 'Teh lemon', 19, 15000], [D(2026, 10, 3), 'Bandung', 'Roti cokelat', 22, 12000], [D(2026, 10, 3), 'Surabaya', 'Kopi susu', 35, 18000],
      [D(2026, 10, 4), 'Jakarta', 'Teh lemon', 28, 15000], [D(2026, 10, 4), 'Bandung', 'Kopi susu', 31, 18000], [D(2026, 10, 5), 'Surabaya', 'Roti cokelat', 17, 12000],
      [D(2026, 10, 5), 'Jakarta', 'Kopi susu', 46, 18000],
    ] as [number, string, string, number, number][]).flatMap((r, i) => [['A' + (i + 2), r[0]], ['B' + (i + 2), r[1]], ['C' + (i + 2), r[2]], ['D' + (i + 2), r[3]], ['E' + (i + 2), r[4]]])) } }) },
  { id: 'nilai', name: 'Nilai siswa', desc: 'AVERAGE, IFS, RANK', make: () => ({ cols: 9, rows: 20, bold: ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1'], cells: {
    A1: 'Nama', B1: 'Tugas', C1: 'UTS', D1: 'UAS', E1: 'Nilai akhir', F1: 'Predikat', G1: 'Peringkat',
    ...Object.fromEntries(([['Alya', 88, 79, 85], ['Bima', 72, 68, 75], ['Citra', 95, 91, 89], ['Dafa', 64, 70, 58], ['Eka', 81, 85, 90], ['Fajar', 77, 60, 72], ['Gita', 90, 88, 94], ['Hendra', 58, 66, 61]] as [string, number, number, number][])
      .flatMap((r, i) => [['A' + (i + 2), r[0]], ['B' + (i + 2), r[1]], ['C' + (i + 2), r[2]], ['D' + (i + 2), r[3]]])) } }) },
  { id: 'karyawan', name: 'Data karyawan', desc: 'XLOOKUP, FILTER, SORT', make: () => ({ cols: 10, rows: 25, fmt: { D: 'date' }, bold: ['A1', 'B1', 'C1', 'D1', 'E1'], cells: {
    A1: 'ID', B1: 'Nama', C1: 'Divisi', D1: 'Tgl masuk', E1: 'Gaji pokok',
    ...Object.fromEntries(([['K-01', 'Rina Wulandari', 'Keuangan', D(2019, 3, 4), 8200000], ['K-02', 'Andi Saputra', 'Gudang', D(2021, 7, 12), 5600000], ['K-03', 'Sari Lestari', 'HRD', D(2018, 1, 15), 9100000],
      ['K-04', 'Budi Santoso', 'Penjualan', D(2022, 9, 1), 6300000], ['K-05', 'Dewi Anggraini', 'Keuangan', D(2020, 11, 23), 7400000], ['K-06', 'Joko Prasetyo', 'Gudang', D(2023, 2, 6), 5200000],
      ['K-07', 'Maya Putri', 'Penjualan', D(2017, 5, 30), 10400000], ['K-08', 'Rizky Halim', 'IT', D(2024, 4, 8), 8800000]] as [string, string, string, number, number][])
      .flatMap((r, i) => [['A' + (i + 2), r[0]], ['B' + (i + 2), r[1]], ['C' + (i + 2), r[2]], ['D' + (i + 2), r[3]], ['E' + (i + 2), r[4]]])) } }) },
];
const IDEAS: Record<string, string[]> = {
  kosong: ['=SEQUENCE(10)', '=RANDBETWEEN(1,100)', '=TODAY()', '=TEXT(TODAY(),"dddd, d mmmm yyyy")'],
  anggaran: ['D2: =B2-C2 lalu salin ke bawah', 'B9: =SUM(B2:B7)', 'E2: =IF(C2>B2,"Lewat","Aman")'],
  penjualan: ['F2: =D2*E2 lalu salin ke bawah', 'H2: =SUMIFS(F:F,B:B,"Jakarta")', 'H3: =UNIQUE(B2:B11)', 'I3: =SUMIFS(F2:F11,B2:B11,H3:H5)'],
  nilai: ['E2: =ROUND(B2*0.3+C2*0.3+D2*0.4,1)', 'F2: =IFS(E2>=85,"A",E2>=75,"B",E2>=65,"C",TRUE,"D")', 'G2: =RANK.EQ(E2,$E$2:$E$9)'],
  karyawan: ['G2: =XLOOKUP("K-05",A2:A9,B2:B9)', 'G4: =FILTER(B2:B9,C2:C9="Keuangan")', 'G8: =SORT(A2:E9,5,-1)', 'H2: =DATEDIF(D2,TODAY(),"y")'],
};

function load(): Saved | null {
  try { const x = JSON.parse(localStorage.getItem(KEY) || 'null'); return x && typeof x === 'object' && x.cells ? x : null; } catch { return null; }
}
function store(s: Saved) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* penuh/diblokir: abaikan */ } }

/** Ubah teks tempelan dari Excel/Google Sheets (dipisah tab) jadi isi sel mulai dari sel awal. */
function parsePaste(text: string, start: string): Record<string, unknown> {
  const p = XL.splitRef(start); const out: Record<string, unknown> = {};
  text.replace(/\r/g, '').replace(/\n$/, '').split('\n').forEach((line, i) => line.split('\t').forEach((raw, j) => {
    const v = raw.trim(); if (v === '') return;
    const k = XL.colName(p.c + j) + (p.r + i);
    const n = /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : /^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(v) ? Number(v.replace(/\./g, '').replace(',', '.')) : null;
    out[k] = n != null && Number.isFinite(n) ? n : v;
  }));
  return out;
}

export default function PlaygroundPage() {
  const [doc, setDoc] = useState<Saved>(() => load() || { ...TEMPLATES[0].make(), name: 'kosong' });
  const [ver, setVer] = useState(0);
  const [paste, setPaste] = useState<{ text: string; at: string } | null>(null);
  const [msg, setMsg] = useState('');
  const cellsRef = useRef<Record<string, unknown>>(doc.cells);

  const item: WorkItem = useMemo(() => ({ id: 'playground', kind: 'sandbox', cols: doc.cols, rows: doc.rows, data: {}, fmt: doc.fmt, bold: doc.bold, tasks: [], editable: 'all' }), [doc.cols, doc.rows, doc.fmt, doc.bold]);
  const save = (cells: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {}; for (const k in cells) if (cells[k] !== '' && cells[k] != null) clean[k] = cells[k];
    cellsRef.current = clean; store({ ...doc, cells: clean });
  };
  const replace = (next: Saved, note: string) => { cellsRef.current = next.cells; setDoc(next); store(next); setVer(v => v + 1); setMsg(note); };
  const useTemplate = (id: string) => {
    const t = TEMPLATES.find(x => x.id === id)!;
    if (Object.keys(cellsRef.current).length && !confirm('Ganti isi lembar dengan template "' + t.name + '"? Isian sekarang akan hilang.')) return;
    replace({ ...t.make(), name: t.id }, 'Template "' + t.name + '" dimuat.');
  };
  const grow = (dc: number, dr: number) => replace({ ...doc, cells: cellsRef.current, cols: Math.min(MAX_COLS, doc.cols + dc), rows: Math.min(MAX_ROWS, doc.rows + dr) }, '');
  const applyPaste = () => {
    if (!paste) return;
    const at = paste.at.trim().toUpperCase();
    if (!/^[A-Z]{1,2}\d{1,3}$/.test(at)) { setMsg('Sel awal tidak valid, contoh: A1.'); return; }
    const add = parsePaste(paste.text, at); const keys = Object.keys(add);
    if (!keys.length) { setMsg('Tidak ada data yang ditempel.'); return; }
    let cols = doc.cols, rows = doc.rows;
    for (const k of keys) { const q = XL.splitRef(k); cols = Math.max(cols, q.c + 1); rows = Math.max(rows, q.r); }
    if (cols > MAX_COLS || rows > MAX_ROWS) { setMsg(`Data terlalu besar. Batas playground ${MAX_COLS} kolom × ${MAX_ROWS} baris.`); return; }
    replace({ ...doc, cols, rows, cells: { ...cellsRef.current, ...add } }, `${keys.length} sel ditempel mulai dari ${at}.`); setPaste(null);
  };
  const download = async () => {
    const { buildXlsx, downloadBlob, excelFormula } = await import('../lib/xlsx');
    const cells = cellsRef.current; const sheet = XL.makeSheet(cells as any);
    const out: Record<string, any> = {};
    for (const k in cells) {
      const raw = cells[k]; const v = sheet.value(k);
      const fmt = (doc.fmt && (doc.fmt[k] || doc.fmt[k.replace(/\d+$/, '')])) as any;
      out[k] = { v: XL.isErr(v) ? v.code : v, f: typeof raw === 'string' && raw[0] === '=' ? excelFormula(raw) : undefined, bold: doc.bold?.includes(k), fmt };
    }
    downloadBlob(buildXlsx([{ name: 'Playground', cells: out }]), 'jagoan-excel-playground.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };
  const ideas = IDEAS[doc.name || 'kosong'] || IDEAS.kosong;

  return (
    <div className="wrap page playground">
      <div className="page-head"><p className="eyebrow">Latihan bebas</p><h1>Excel Playground</h1>
        <p>Lembar kerja bebas untuk mencoba rumus apa saja: semua fungsi di <Link to="/fungsi">Daftar Fungsi</Link> bisa dipakai, termasuk FILTER, XLOOKUP, dan LET. Tidak ada nilai di sini, bebas coba-coba. Isianmu tersimpan otomatis dan bisa diunduh sebagai file Excel.</p></div>

      <div className="pg-bar">
        <div className="pg-tpl" role="group" aria-label="Template">
          {TEMPLATES.map(t => <button key={t.id} className="chip" aria-pressed={doc.name === t.id} onClick={() => useTemplate(t.id)} title={t.desc}>{t.name}</button>)}
        </div>
        <div className="pg-act">
          <button className="btn sm" onClick={() => setPaste({ text: '', at: 'A1' })}>Tempel dari Excel</button>
          <button className="btn sm" onClick={() => grow(0, 10)} disabled={doc.rows >= MAX_ROWS}>+10 baris</button>
          <button className="btn sm" onClick={() => grow(1, 0)} disabled={doc.cols >= MAX_COLS}>+1 kolom</button>
          <button className="btn sm primary" onClick={download}>Unduh .xlsx</button>
        </div>
      </div>
      {msg && <p className="muted pg-msg" role="status">{msg}</p>}

      {paste && (
        <div className="pg-paste" role="dialog" aria-label="Tempel data">
          <p><b>Tempel data dari Excel atau Google Sheets.</b> Blok sel di sana, salin (Ctrl+C), lalu tempel di kotak ini. Angka berformat Indonesia seperti 1.250.000 ikut dikenali.</p>
          <textarea rows={6} value={paste.text} onChange={e => setPaste({ ...paste, text: e.target.value })} placeholder={'Nama\tNilai\nAlya\t88\nBima\t72'} aria-label="Data yang ditempel" autoFocus />
          <div className="pg-paste-a">
            <label>Mulai di sel <input value={paste.at} onChange={e => setPaste({ ...paste, at: e.target.value })} size={5} aria-label="Sel awal" /></label>
            <button className="btn primary sm" onClick={applyPaste}>Tempel</button>
            <button className="btn ghost sm" onClick={() => setPaste(null)}>Batal</button>
          </div>
        </div>
      )}

      <Workbench key={ver} item={item} heading="Lembar kerja" initial={doc.cells} onAnswers={save} start="A1" />

      <section className="pg-ideas" aria-labelledby="pg-ide">
        <h2 id="pg-ide">Ide untuk dicoba</h2>
        <ul>{ideas.map(s => <li key={s}><code>{s}</code></li>)}</ul>
        <p className="muted">Tips: klik sel lalu ketik di bar rumus. Tekan <kbd>F4</kbd> saat kursor di alamat sel untuk menguncinya dengan $. Mau latihan yang dinilai? Coba <Link to="/soal">Bank Soal</Link> atau <Link to="/kasus">Studi Kasus</Link>.</p>
      </section>
    </div>
  );
}
