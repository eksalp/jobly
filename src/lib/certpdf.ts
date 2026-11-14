// Sertifikat kelulusan (PDF A4 tegak). Tata letaknya ada di certlayout.ts, sama dengan pratinjau di layar.
import { LEVEL_BY, moduleTitles, verifyUrl, type Cert } from './certs';
import { certOps, CERT_H, CERT_W } from './certlayout';
import { drawOps, loadLogos, pdfMeasure } from './certdraw';
import { SIGNER } from './certpdf-signer';
export { SIGNER };
const tgl = (t: string | number) => new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export const certDesc = (lessons: number, label: string, mods: string[], drills: number, cases: number, score?: number | null, skills?: string) =>
  `Telah menyelesaikan seluruh ${lessons} materi tingkat ${label} (${mods.join(', ')}), ${drills.toLocaleString('id-ID')} soal praktik${cases ? `, ${cases} studi kasus kantor,` : ''} dan lulus ujian akhir${score != null ? ` dengan nilai ${score}` : ''}. Kompetensi: ${skills}.`;

export async function downloadCertificatePdf(c: Cert, stats: { lessons: number; drills: number; cases: number }, sample = false) {
  const [{ jsPDF }, logos] = await Promise.all([import('jspdf'), loadLogos()]);
  const lv = LEVEL_BY[c.level];
  const doc = new jsPDF({ unit: 'mm', format: [CERT_W, CERT_H], orientation: 'portrait' });
  const ops = certOps(pdfMeasure(doc), {
    levelName: lv.name, levelLabel: lv.label, name: c.name, date: tgl(c.issued_at), id: c.id, score: c.score, url: verifyUrl(c.id), signer: SIGNER, sample,
    desc: certDesc(stats.lessons, lv.label, moduleTitles(lv), stats.drills, stats.cases, c.score, lv.skills),
  });
  drawOps(doc, ops, logos);
  const safe = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'peserta';
  doc.save(`${sample ? 'contoh-' : ''}sertifikat-${c.level}-${safe}.pdf`);
}
