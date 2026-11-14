// Pratinjau sertifikat: memakai tata letak yang sama persis dengan PDF (lib/certlayout.ts).
import { useMemo } from 'react';
import { LEVEL_BY, lessonsOf, moduleTitles, verifyUrl, type Level } from '../lib/certs';
import { SIGNER } from '../lib/certpdf-signer';
import { certOps, CERT_H, CERT_W } from '../lib/certlayout';
import { OpsSvg, svgMeasure } from './OpsSvg';

const desc = (lessons: number, label: string, mods: string[], drills: number, cases: number, score?: number | null, skills?: string) =>
  `Telah menyelesaikan seluruh ${lessons} materi tingkat ${label} (${mods.join(', ')}), ${drills.toLocaleString('id-ID')} soal praktik${cases ? `, ${cases} studi kasus kantor,` : ''} dan lulus ujian akhir${score != null ? ` dengan nilai ${score}` : ''}. Kompetensi: ${skills}.`;

export function CertPreview({ level, name, score, id, date, sample }: { level: Level['key']; name: string; score?: number | null; id: string; date: string; sample?: boolean }) {
  const lv = LEVEL_BY[level];
  const ops = useMemo(() => certOps(svgMeasure, {
    levelName: lv.name, levelLabel: lv.label, name, date, id, score, url: verifyUrl(id), signer: SIGNER, sample,
    desc: desc(lessonsOf(lv).length, lv.label, moduleTitles(lv), lv.minDrill, lv.minCases, score, lv.skills),
  }), [lv, name, date, id, score, sample]);
  return <OpsSvg className="cert-pv" ops={ops} w={CERT_W} h={CERT_H} label={`Pratinjau sertifikat ${lv.name} untuk ${name}`} />;
}
