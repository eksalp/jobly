// Renderer SVG untuk daftar bentuk dari certlayout.ts (pratinjau sertifikat & portofolio).
import { Fragment } from 'react';
import qrcode from 'qrcode-generator';
import { logoMark } from '../lib/brand';
import type { Measure, Op } from '../lib/certlayout';

const SANS = 'Helvetica, Arial, sans-serif', SERIF = '"Times New Roman", Times, serif';
const pt2mm = (p: number) => p * 0.3528;
let ctx: CanvasRenderingContext2D | null = null;
export const svgMeasure: Measure = (s, pt, bold, italic, face) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return s.length * pt2mm(pt) * 0.55;
  ctx.font = `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}100px ${face === 'serif' ? SERIF : SANS}`;
  return (ctx.measureText(s).width / 100) * pt2mm(pt);
};
const qrPath = (data: string, x: number, y: number, size: number) => {
  const q = qrcode(0, 'M'); q.addData(data); q.make();
  const n = q.getModuleCount(), c = size / n, e = (c + 0.02).toFixed(3); let d = '';
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) d += `M${(x + k * c).toFixed(3)} ${(y + r * c).toFixed(3)}h${e}v${e}h-${e}z`;
  return d;
};

export function OpsSvg({ ops, w, h, label, className }: { ops: Op[]; w: number; h: number; label: string; className?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
      {ops.map((o, i) => {
        switch (o.k) {
          case 'rect': return <rect key={i} x={o.x} y={o.y} width={o.w} height={o.h} rx={o.r} fill={o.fill || 'none'} stroke={o.stroke} strokeWidth={o.sw} opacity={o.op} />;
          case 'circle': return <circle key={i} cx={o.cx} cy={o.cy} r={o.r} fill={o.fill || 'none'} stroke={o.stroke} strokeWidth={o.sw} opacity={o.op} />;
          case 'line': return <line key={i} x1={o.x1} y1={o.y1} x2={o.x2} y2={o.y2} stroke={o.stroke} strokeWidth={o.sw} strokeDasharray={o.dash?.join(' ')} opacity={o.op} />;
          case 'text': return <text key={i} x={o.x} y={o.y} fontSize={pt2mm(o.pt)} fontWeight={o.bold ? 700 : 400} fontStyle={o.italic ? 'italic' : undefined}
            fontFamily={o.face === 'serif' ? SERIF : SANS} fill={o.color} letterSpacing={o.ls} opacity={o.op}
            transform={o.angle ? `rotate(${-o.angle} ${o.x} ${o.y})` : undefined}>{o.s}</text>;
          case 'logo': return <g key={i} transform={`translate(${o.x} ${o.y}) scale(${o.size / 100})`} dangerouslySetInnerHTML={{ __html: logoMark(o.v) }} />;
          case 'qr': return <path key={i} d={qrPath(o.data, o.x, o.y, o.size)} fill="#15201b" />;
          default: return <Fragment key={i} />;
        }
      })}
    </svg>
  );
}
