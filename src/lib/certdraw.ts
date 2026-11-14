// Renderer jsPDF untuk daftar bentuk dari certlayout.ts.
import qrcode from 'qrcode-generator';
import type { Measure, Op } from './certlayout';
import { logoPng } from './brand';
/** Muat kedua versi logo (putih & berwarna, latar transparan). */
export const loadLogos = async (): Promise<Logos> => { const [white, color] = await Promise.all([logoPng('white').catch(() => null), logoPng('color').catch(() => null)]); return { white, color }; };

type Doc = any;
const rgb = (h: string): [number, number, number] => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
const setFont = (doc: Doc, pt: number, bold?: boolean, italic?: boolean, face?: string) => {
  doc.setFont(face === 'serif' ? 'times' : 'helvetica', bold && italic ? 'bolditalic' : bold ? 'bold' : italic ? 'italic' : 'normal');
  doc.setFontSize(pt);
};
export const pdfMeasure = (doc: Doc): Measure => (s, pt, bold, italic, face) => { setFont(doc, pt, bold, italic, face); return doc.getTextWidth(s); };

export type Logos = { white?: string | null; color?: string | null };
export function drawOps(doc: Doc, ops: Op[], logos: Logos) {
  const GS = (o: number) => doc.setGState(new doc.GState({ opacity: o, 'stroke-opacity': o }));
  for (const o of ops) {
    const op = 'op' in o && o.op != null ? o.op : 1;
    if (op !== 1) GS(op);
    if (o.k === 'rect') {
      if (o.fill) doc.setFillColor(...rgb(o.fill));
      if (o.stroke) { doc.setDrawColor(...rgb(o.stroke)); doc.setLineWidth(o.sw || 0.2); }
      const style = o.fill && o.stroke ? 'FD' : o.fill ? 'F' : 'S';
      if (o.r) doc.roundedRect(o.x, o.y, o.w, o.h, o.r, o.r, style); else doc.rect(o.x, o.y, o.w, o.h, style);
    } else if (o.k === 'circle') {
      if (o.fill) doc.setFillColor(...rgb(o.fill));
      if (o.stroke) { doc.setDrawColor(...rgb(o.stroke)); doc.setLineWidth(o.sw || 0.2); }
      doc.circle(o.cx, o.cy, o.r, o.fill && o.stroke ? 'FD' : o.fill ? 'F' : 'S');
    } else if (o.k === 'line') {
      doc.setDrawColor(...rgb(o.stroke)); doc.setLineWidth(o.sw);
      if (o.dash) doc.setLineDashPattern(o.dash, 0);
      doc.line(o.x1, o.y1, o.x2, o.y2);
      if (o.dash) doc.setLineDashPattern([], 0);
    } else if (o.k === 'text') {
      setFont(doc, o.pt, o.bold, o.italic, o.face); doc.setTextColor(...rgb(o.color));
      const opt: any = {}; if (o.angle) opt.angle = o.angle; if (o.ls) opt.charSpace = o.ls;
      doc.text(o.s, o.x, o.y, opt);
    } else if (o.k === 'logo') {
      const img = logos[o.v]; if (img) doc.addImage(img, 'PNG', o.x, o.y, o.size, o.size);
    } else if (o.k === 'qr') {
      const q = qrcode(0, 'M'); q.addData(o.data); q.make();
      const n = q.getModuleCount(), cell = o.size / n;
      doc.setFillColor(21, 32, 27);
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) doc.rect(o.x + c * cell, o.y + r * cell, cell + 0.02, cell + 0.02, 'F');
    }
    if (op !== 1) GS(1);
  }
}
