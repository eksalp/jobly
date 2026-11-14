import { useMemo, useState } from 'react';
import { CASES, INDS, indOf, type Item } from '../lib/catalog';
import { ItemCard } from '../components/Cards';
import { matches } from '../lib/search';

const IND = INDS;
const DIVS = [...new Set<string>(CASES.map((c: Item) => c.div as string))].sort((a, b) => a.localeCompare(b, 'id'));
const N_KHUSUS = CASES.filter((c: Item) => c.khusus).length;
const N_SULIT = CASES.filter((c: Item) => c.hard).length;
const N_PROYEK = CASES.filter((c: Item) => c.proyek).length;

export default function CasesPage() {
  const [ind, setInd] = useState('');
  const [div, setDiv] = useState('');
  const [khusus, setKhusus] = useState(false);
  const [proyek, setProyek] = useState(false);
  const [sulit, setSulit] = useState(() => new URLSearchParams(location.search).get('sulit') === '1');
  const [q, setQ] = useState('');
  const list = useMemo(() => CASES.filter((c: Item) =>
    (!ind || indOf(c) === ind) && (!div || c.div === div) && (!khusus || c.khusus) && (!sulit || c.hard) && (!proyek || c.proyek) &&
    (!q.trim() || matches(q, c.title, c.div, indOf(c), c.scenario, ...c.tasks.map((t: Item) => t.text + ' ' + t.solution)))), [ind, div, khusus, sulit, proyek, q]);
  const count = (i: string) => CASES.filter((c: Item) => indOf(c) === i).length;
  const filtered = ind || div || khusus || sulit || proyek || q.trim();

  return (
    <div className="wrap page">
      <div className="page-head"><h1>Studi kasus kerja</h1>
        <p>{CASES.length} kasus dari {IND.length} bidang industri. Setiap kasus berisi 3–4 tugas yang saling terkait, seperti membuat laporan sungguhan. Ada juga <b>kasus khusus</b> dengan data berantakan dan <b>kasus sulit</b> untuk keuangan, pajak, dan audit. {CASES.filter((c: Item) => c.free).length} kasus bisa dicoba gratis.</p></div>
      <input className="page-search" type="search" placeholder="Cari kasus, misalnya rumah sakit, stok, PPN, atau XLOOKUP" aria-label="Cari studi kasus" value={q} onChange={e => setQ(e.target.value)} />
      <div className="filters cs-filters">
        <button className="chip chip-proyek" aria-pressed={proyek} onClick={() => setProyek(k => !k)}>Proyek akhir terpandu ({N_PROYEK} bagian)</button>
        <button className="chip chip-khusus" aria-pressed={khusus} onClick={() => setKhusus(k => !k)}>Kasus khusus · data berantakan ({N_KHUSUS})</button>
        <button className="chip chip-sulit" aria-pressed={sulit} onClick={() => setSulit(k => !k)}>Kasus sulit · keuangan, pajak & audit ({N_SULIT})</button>
        <label className="sr" htmlFor="cs-div">Divisi</label>
        <select id="cs-div" className="pv-sel" value={div} onChange={e => setDiv(e.target.value)}>
          <option value="">Semua divisi</option>
          {DIVS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {filtered && <button className="btn ghost sm" onClick={() => { setInd(''); setDiv(''); setKhusus(false); setSulit(false); setQ(''); }}>Hapus filter</button>}
      </div>
      <div className="filters" role="group" aria-label="Industri">
        {['', ...IND].map(i => <button key={i || 'all'} className="chip" aria-pressed={ind === i} onClick={() => setInd(ind === i ? '' : i)}>{i || 'Semua industri'}{i && <span className="chip-n">{count(i)}</span>}</button>)}
      </div>
      {filtered && <p className="muted" style={{ fontSize: 14 }}>{list.length} kasus cocok</p>}
      <div className="lgrid lgrid-cases">{list.map((c: Item) => <ItemCard key={c.id} x={c} />)}</div>
      {!list.length && <p className="empty-state">Tidak ada studi kasus yang cocok. <button className="linkish" onClick={() => { setInd(''); setDiv(''); setKhusus(false); setSulit(false); setQ(''); }}>Hapus filter</button></p>}
    </div>
  );
}
