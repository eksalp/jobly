// Komponen bersama untuk simulasi fitur Excel (Sort, Conditional Formatting, Data Validation, dst.).
import { useState, type ReactNode } from 'react';
import { XL } from '../../engine/engine.js';

export type Mission = { id: string; text: string };

export function useMissions() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const mark = (id: string) => setDone(d => (d.has(id) ? d : new Set(d).add(id)));
  return { done, mark };
}

export function Missions({ list, done, tip }: { list: Mission[]; done: Set<string>; tip?: ReactNode }) {
  return (
    <div className="pf-missions">
      <p className="pf-m-h">Misi latihan <span>{done.size}/{list.length}</span></p>
      <ol>{list.map(m => (
        <li key={m.id} className={done.has(m.id) ? 'ok' : ''}>
          <span className="pf-m-c" aria-hidden="true">{done.has(m.id) ? '✓' : ''}</span>
          <span dangerouslySetInnerHTML={{ __html: m.text }} />
        </li>))}
      </ol>
      {done.size === list.length && <p className="ds-alldone">Semua misi selesai. Fitur ini sudah kamu kuasai.</p>}
      {tip && <p className="pf-m-tip">{tip}</p>}
    </div>
  );
}

export const rp = (n: number) => n.toLocaleString('id-ID');
export const L = (i: number) => String.fromCharCode(65 + i);

/** Tanggal disimpan sebagai serial Excel, ditampilkan dd/mm/yyyy. */
export const dser = (d: number, m: number, y: number) => XL.D(y, m, d) as number;
export const dshow = (s: number) => { const p = XL.fromSerial(s); return `${String(p.d).padStart(2, '0')}/${String(p.m).padStart(2, '0')}/${p.y}`; };

export function Dialog({ title, children, onOk, onCancel, okDisabled, wide, extra }: { title: string; children: ReactNode; onOk: () => void; onCancel: () => void; okDisabled?: boolean; wide?: boolean; extra?: ReactNode }) {
  return (
    <div className="pf-dlg" role="dialog" aria-label={title} onKeyDown={e => { if (e.key === 'Escape') onCancel(); }}>
      <div className={'pf-dlg-in' + (wide ? ' ds-wide' : '')}>
        <p className="pf-dlg-t">{title}</p>
        {children}
        <div className="pf-dlg-b">{extra}<span className="ds-grow" /><button className="btn sm primary" disabled={okDisabled} onClick={onOk}>OK</button><button className="btn sm" onClick={onCancel}>Cancel</button></div>
      </div>
    </div>
  );
}

/** Mengubah isian angka gaya Indonesia (100.000.000 atau 0,5) menjadi number. */
export const parseNum = (s: string) => {
  const t = String(s).trim();
  if (!t) return NaN;
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) return Number(t.replace(/\./g, '').replace(',', '.'));
  return Number(t.replace(',', '.'));
};
