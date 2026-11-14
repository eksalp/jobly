import { useMemo } from 'react';
import { sealOps } from '../lib/certlayout';
import { OpsSvg, svgMeasure } from './OpsSvg';

/** Stempel bulat Jagoan Excel, sama dengan yang ada di sertifikat. */
export function Seal({ ring, label, className = 'seal' }: { ring: string; label: string; className?: string }) {
  const ops = useMemo(() => sealOps(svgMeasure, ring, label), [ring, label]);
  return <OpsSvg className={className} ops={ops} w={40} h={40} label="" />;
}
