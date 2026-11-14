import { useEffect, useRef } from 'react';
import { simIsNew } from '../lib/whatsnew';
import { PREVIEWS } from '../content/previews.js';
import { PivotSim } from './PivotSim';
import { FilterSim } from './FilterSim';
import { WhatIfSim } from './WhatIfSim';
import { MacroSim } from './MacroSim';
import { SortSim } from './sims/SortSim';
import { CFSim } from './sims/CFSim';
import { DVSim } from './sims/DVSim';
import { DupesSim } from './sims/DupesSim';
import { TextColSim } from './sims/TextColSim';
import { ChartSim } from './sims/ChartSim';
import { NumFmtSim } from './sims/NumFmtSim';
import { PageSetupSim } from './sims/PageSetupSim';

const SIMS: Record<string, [string, () => JSX.Element]> = {
  pivot: ['Simulasi PivotTable seperti di Excel', () => <PivotSim />],
  filter: ['Simulasi AutoFilter seperti di Excel', () => <FilterSim />],
  whatif: ['Simulasi What-If Analysis dan Solver', () => <WhatIfSim />],
  macrorec: ['Simulasi Macro Recorder dan VBA Editor', () => <MacroSim />],
  sort: ['Simulasi Sort bertingkat seperti di Excel', () => <SortSim />],
  cf: ['Simulasi Conditional Formatting seperti di Excel', () => <CFSim />],
  dv: ['Simulasi Data Validation seperti di Excel', () => <DVSim />],
  dupes: ['Simulasi Remove Duplicates seperti di Excel', () => <DupesSim />],
  textcol: ['Simulasi Text to Columns seperti di Excel', () => <TextColSim />],
  chart: ['Simulasi membuat grafik seperti di Excel', () => <ChartSim />],
  numfmt: ['Simulasi Format Cells dan kode format angka', () => <NumFmtSim />],
  print: ['Simulasi Page Layout dan Print Preview', () => <PageSetupSim />],
};

/** Pratinjau interaktif fitur Excel. PivotTable memakai simulasi React lengkap; sisanya DOM imperatif. */
export function Preview({ k }: { k: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const p = PREVIEWS[k];
  useEffect(() => {
    if (SIMS[k]) return;
    const el = ref.current; if (!el || !p) return;
    el.innerHTML = '';
    try { p.render(el); } catch { el.textContent = 'Pratinjau tidak bisa dimuat.'; }
  }, [k]);
  const sim = SIMS[k];
  if (sim) return (
    <section className="preview" aria-label={sim[0]}>
      <div className="preview-h"><span className="preview-t">{sim[0]}{simIsNew(k) && <i className="new">baru</i>}</span><span>Coba langsung</span></div>
      <div className="preview-b pf-wrap">{sim[1]()}</div>
    </section>
  );
  if (!p) return null;
  return (
    <section className="preview" aria-label={'Pratinjau: ' + p.title}>
      <div className="preview-h">{p.title}<span>Pratinjau interaktif</span></div>
      <div className="preview-b" ref={ref} />
    </section>
  );
}
