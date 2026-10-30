// Pratinjau sertifikat (SVG, ukuran A4 lanskap dalam mm) dengan tata letak yang sama persis dengan PDF.
import { logoInner } from '../lib/brand';
import { useMemo } from 'react';
import qrcode from 'qrcode-generator';
import { LEVEL_BY, lessonsOf, moduleTitles, verifyUrl, type Level } from '../lib/certs';
import { SIGNER } from '../lib/certpdf-signer';

const W = 297, H = 210, cx = W / 2;
const GREEN = '#107c41', INK = '#1b2320', MUTED = '#6e7873', LINE = '#d6ded9';
const pt = (n: number) => n * 0.3528;
const FONT = 'Helvetica, Arial, sans-serif';

export function CertPreview({ level, name, score, id, date, sample }: { level: Level['key']; name: string; score?: number | null; id: string; date: string; sample?: boolean }) {
  const lv = LEVEL_BY[level];
  const url = verifyUrl(id);
  const qr = useMemo(() => {
    const q = qrcode(0, 'M'); q.addData(url); q.make();
    const n = q.getModuleCount(), size = 27, cell = size / n, x0 = cx - size / 2, y0 = 132; let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${(x0 + c * cell).toFixed(3)} ${(y0 + r * cell).toFixed(3)}h${(cell + 0.02).toFixed(3)}v${(cell + 0.02).toFixed(3)}h-${(cell + 0.02).toFixed(3)}z`;
    return { d, x0, y0, size };
  }, [url]);
  const grid = useMemo(() => {
    const out: { x: number; y: number; f: number; fill: boolean }[] = []; const cw = 8, ch = 4.8;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { const d = i + j; if (d > 8) continue; out.push({ x: W - 13 - (i + 1) * cw, y: 13 + j * ch, f: 1 - d / 9, fill: (i * 5 + j * 3) % 4 === 0 }); }
    return out;
  }, []);
  const waves = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const x0 = 16, x1 = W - 15, y0 = H - 18.5, amp = 1.8, ph = i * 0.85, per = 30; let d = `M${x0} ${y0 + Math.sin(ph) * amp}`;
    for (let x = x0 + 1.5; x <= x1; x += 1.5) d += `L${x.toFixed(2)} ${(y0 + Math.sin(ph + ((x - x0) / per) * Math.PI * 2) * amp).toFixed(2)}`;
    return d;
  }), []);
  const desc = `atas keberhasilan menyelesaikan seluruh ${lessonsOf(lv).length} materi tingkat ${lv.label} (${moduleTitles(lv).join(', ')}), ${lv.minDrill.toLocaleString('id-ID')} soal praktik${lv.minCases ? `, ${lv.minCases} studi kasus kantor,` : ''} dan lulus ujian akhir${score != null ? ` dengan nilai ${score}` : ''}. Kompetensi: ${lv.skills}.`;
  const by = qr.y0 + qr.size + 9.5;
  const k = 4.2, ox = cx - 16 * k, oy = 104 - 16 * k;
  const bolt = [[18.6, 4.5], [8.5, 18], [15.1, 18], [13.1, 27.5], [23.5, 14], [16.8, 14]].map(([x, y]) => `${(ox + x * k).toFixed(2)},${(oy + y * k).toFixed(2)}`).join(' ');
  return (
    <svg className="cert-pv" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Pratinjau sertifikat ${lv.name} untuk ${name}`} fontFamily={FONT}>
      <rect width={W} height={H} fill="#fff" />
      <polygon points={bolt} fill={GREEN} opacity={0.05} />
      {grid.map((g, i) => <g key={i}>{g.fill && <rect x={g.x} y={g.y} width={8} height={4.8} fill={GREEN} opacity={0.07 * g.f} />}<rect x={g.x} y={g.y} width={8} height={4.8} fill="none" stroke={GREEN} strokeWidth={0.2} opacity={0.22 * g.f} /></g>)}
      {waves.map((d, i) => <path key={i} d={d} fill="none" stroke={GREEN} strokeWidth={0.15} opacity={0.16} />)}
      <rect x={10} y={10} width={W - 20} height={H - 20} fill="none" stroke={GREEN} strokeWidth={0.7} />
      <rect x={13} y={13} width={W - 26} height={H - 26} fill="none" stroke={LINE} strokeWidth={0.25} />
      <rect x={10} y={10} width={4} height={H - 20} fill={GREEN} />
      <g transform="translate(26 26) scale(0.09)" dangerouslySetInnerHTML={{ __html: logoInner(true) }} />
      <text x={38} y={32.2} fontSize={pt(12)} fontWeight={700} fill={INK}>Jagoan Excel</text>
      <text x={cx} y={54} fontSize={pt(11)} fontWeight={700} fill={GREEN} textAnchor="middle" letterSpacing={0.9}>SERTIFIKAT KELULUSAN</text>
      <text x={cx} y={69} fontSize={pt(30)} fontWeight={700} fill={INK} textAnchor="middle">{lv.name}</text>
      <text x={cx} y={81} fontSize={pt(10.5)} fill={MUTED} textAnchor="middle">diberikan kepada</text>
      <text x={cx} y={95} fontSize={pt(28)} fontWeight={700} fill={INK} textAnchor="middle">{name}</text>
      <line x1={cx - 18} y1={100} x2={cx + 18} y2={100} stroke={GREEN} strokeWidth={0.5} />
      <foreignObject x={cx - 102.5} y={104.5} width={205} height={24}>
        <div style={{ font: `${pt(10.5)}px/${1.5} ${FONT}`, color: INK, textAlign: 'center' }}>{desc}</div>
      </foreignObject>
      <rect x={qr.x0 - 2} y={qr.y0 - 2} width={qr.size + 4} height={qr.size + 4} fill="#fff" />
      <path d={qr.d} fill={INK} />
      <line x1={cx - 32} y1={qr.y0 + qr.size + 4} x2={cx + 32} y2={qr.y0 + qr.size + 4} stroke={INK} strokeWidth={0.3} />
      <text x={cx} y={by} fontSize={pt(10.5)} fontWeight={700} fill={INK} textAnchor="middle">{SIGNER.name}</text>
      <text x={cx} y={by + 4.5} fontSize={pt(9)} fill={MUTED} textAnchor="middle">{SIGNER.role}</text>
      <text x={40} y={by - 6} fontSize={pt(8.5)} fill={MUTED}>Tanggal terbit</text>
      <text x={40} y={by} fontSize={pt(11)} fontWeight={700} fill={INK}>{date}</text>
      {score != null && <text x={40} y={by + 5} fontSize={pt(8.5)} fill={MUTED}>Nilai ujian akhir: {score}/100</text>}
      <text x={W - 40} y={by - 6} fontSize={pt(8.5)} fill={MUTED} textAnchor="end">Nomor sertifikat</text>
      <text x={W - 40} y={by} fontSize={pt(11)} fontWeight={700} fill={INK} textAnchor="end">{id}</text>
      <text x={W - 40} y={by + 5} fontSize={pt(7.5)} fill={MUTED} textAnchor="end">Pindai QR di tengah untuk memeriksa keaslian:</text>
      <text x={W - 40} y={by + 8.5} fontSize={pt(7.5)} fill={MUTED} textAnchor="end">{url.replace(/^https?:\/\//, '')}</text>
      {sample && <text x={cx} y={H / 2 + 12} fontSize={46} fontWeight={700} fill="#c0392b" opacity={0.1} textAnchor="middle" transform={`rotate(-18 ${cx} ${H / 2})`} letterSpacing={6}>CONTOH</text>}
    </svg>
  );
}
