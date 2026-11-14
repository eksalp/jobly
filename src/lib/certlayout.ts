// Tata letak sertifikat dan kepala portofolio sebagai daftar bentuk sederhana (persegi, lingkaran,
// garis, teks, logo, QR) dalam milimeter. Satu sumber untuk pratinjau SVG dan PDF (jsPDF),
// jadi keduanya selalu sama persis. Semua teks digambar rata kiri; perataan tengah/kanan dan
// jarak huruf dihitung di sini memakai fungsi ukur dari masing-masing renderer.

export type Face = 'sans' | 'serif';
export type Op =
  | { k: 'rect'; x: number; y: number; w: number; h: number; fill?: string; stroke?: string; sw?: number; op?: number; r?: number }
  | { k: 'circle'; cx: number; cy: number; r: number; fill?: string; stroke?: string; sw?: number; op?: number }
  | { k: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: string; sw: number; dash?: [number, number]; op?: number }
  | { k: 'text'; x: number; y: number; s: string; pt: number; bold?: boolean; italic?: boolean; face?: Face; color: string; ls?: number; angle?: number; op?: number }
  | { k: 'logo'; x: number; y: number; size: number; v: 'white' | 'color' }
  | { k: 'qr'; x: number; y: number; size: number; data: string };

/** Lebar teks (mm) untuk ukuran pt tertentu, tanpa jarak huruf. */
export type Measure = (s: string, pt: number, bold?: boolean, italic?: boolean, face?: Face) => number;

export const C = {
  dark: '#053b2c', paper: '#ffffff', ink: '#15201b', muted: '#66736d', line: '#c9d6d0',
  green: '#0a7f55', brand: '#10a36b', mint: '#6ee7b7', sig: '#0b3d2c',
};
const STOPS: [number, string][] = [[0, '#053f2f'], [0.42, '#0a7f55'], [0.78, '#10a36b'], [1, '#4fd1a0']];
const hex = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (t: number) => {
  let i = 0; while (i < STOPS.length - 2 && t > STOPS[i + 1][0]) i++;
  const [t0, a] = STOPS[i], [t1, b] = STOPS[i + 1], f = Math.max(0, Math.min(1, (t - t0) / (t1 - t0)));
  const A = hex(a), B = hex(b);
  return '#' + A.map((v, j) => Math.round(v + (B[j] - v) * f).toString(16).padStart(2, '0')).join('');
};

export class Ops {
  list: Op[] = [];
  constructor(public m: Measure) {}
  push(o: Op) { this.list.push(o); }
  width(s: string, pt: number, o: { bold?: boolean; italic?: boolean; face?: Face; ls?: number } = {}) {
    return this.m(s, pt, o.bold, o.italic, o.face) + (o.ls || 0) * Math.max(0, s.length - 1);
  }
  text(s: string, x: number, y: number, pt: number, color: string, o: { bold?: boolean; italic?: boolean; face?: Face; ls?: number; align?: 'left' | 'center' | 'right'; op?: number } = {}) {
    const w = this.width(s, pt, o);
    const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    this.push({ k: 'text', x: x0, y, s, pt, bold: o.bold, italic: o.italic, face: o.face, color, ls: o.ls, op: o.op });
    return w;
  }
  wrap(s: string, pt: number, maxW: number, bold = false) {
    const out: string[] = []; let cur = '';
    for (const word of s.split(/\s+/)) {
      const t = cur ? cur + ' ' + word : word;
      if (cur && this.m(t, pt, bold) > maxW) { out.push(cur); cur = word; } else cur = t;
    }
    if (cur) out.push(cur);
    return out;
  }
  /** Pita gradien hijau dengan pola titik, digambar sebagai potongan tipis supaya sama di PDF dan SVG. */
  band(x: number, y: number, w: number, h: number) {
    const N = 140, sw = w / N;
    for (let i = 0; i < N; i++) this.push({ k: 'rect', x: x + i * sw, y, w: sw + 0.15, h, fill: mix(i / (N - 1)) });
    for (let yy = y + 3; yy < y + h - 1; yy += 3.6) for (let xx = x + 3; xx < x + w - 1; xx += 3.6)
      this.push({ k: 'circle', cx: xx, cy: yy, r: 0.3, fill: '#ffffff', op: 0.05 + 0.13 * ((xx - x) / w) });
  }
  /** Stempel bulat: tulisan melingkar + logo + label kecil di tengah. */
  seal(cx: number, cy: number, r: number, ring: string, label: string) {
    this.push({ k: 'circle', cx, cy, r: r + 1.6, fill: '#ffffff', op: 0.35 });
    this.push({ k: 'circle', cx, cy, r, fill: '#ffffff' });
    this.push({ k: 'circle', cx, cy, r: r - 1.7, stroke: C.brand, sw: 0.7 });
    this.push({ k: 'circle', cx, cy, r: r * 0.55, stroke: C.brand, sw: 0.45 });
    const pt = r * 0.31, ls = 0.25, rr = r * 0.7;
    const chars = [...ring];
    const ws = chars.map(ch => this.m(ch, pt, true) + ls);
    const total = ws.reduce((a, b) => a + b, 0), circ = 2 * Math.PI * rr, k = circ / total;
    let acc = 0;
    chars.forEach((ch, i) => {
      const mid = (acc + ws[i] / 2) * k; acc += ws[i];
      const th = mid / rr;
      const px = cx + rr * Math.sin(th), py = cy - rr * Math.cos(th);
      const half = (ws[i] - ls) / 2;
      const x0 = px - half * Math.cos(th), y0 = py - half * Math.sin(th);
      if (ch !== ' ') this.push({ k: 'text', x: x0, y: y0, s: ch, pt, bold: true, color: C.green, angle: -(th * 180) / Math.PI });
    });
    // logo tepat di tengah: titik pusat visual logo ada di (52.97, 49.52) dari kotak 100×100
    const sz = r * 0.8;
    this.push({ k: 'logo', x: cx - 0.5297 * sz, y: cy - 0.4952 * sz, size: sz, v: 'color' });
    void label;
  }
}

export type CertData = { levelName: string; levelLabel: string; name: string; desc: string; date: string; id: string; score?: number | null; url: string; signer: { name: string; role: string }; sample?: boolean };
export const CERT_W = 210, CERT_H = 297;

/** Sertifikat A4 tegak. QR verifikasi berfungsi sebagai tanda tangan digital. */
export function certOps(m: Measure, d: CertData): Op[] {
  const o = new Ops(m), W = CERT_W, H = CERT_H, L = 24, MAXW = W - 2 * L;
  o.push({ k: 'rect', x: 0, y: 0, w: W, h: H, fill: C.dark });
  o.push({ k: 'rect', x: 6, y: 6, w: W - 12, h: H - 12, fill: C.paper });
  o.band(6, 6, W - 12, 80);
  // kepala
  o.push({ k: 'logo', x: L - 2, y: 22, size: 13, v: 'white' });
  o.text('Jagoan Excel', L + 15, 29.6, 17, '#ffffff', { bold: true });
  o.text('jagoanexcel.com', L + 15, 35.4, 9, '#ffffff', { op: 0.8 });
  o.text('SERTIFIKAT', L - 2, 58, 9, '#ffffff', { bold: true, ls: 1.1, op: 0.92 });
  o.text('KELULUSAN', L - 2, 64, 9, '#ffffff', { bold: true, ls: 1.1, op: 0.92 });
  o.seal(W - 50, 86, 26, 'JAGOAN EXCEL • SERTIFIKAT KOMPETENSI • ', d.levelLabel);

  // nama peserta (dikecilkan kalau terlalu panjang)
  let pt = 30; while (pt > 16 && o.width(d.name, pt, { bold: true }) > MAXW) pt -= 1;
  const nw = o.text(d.name, L, 130, pt, C.ink, { bold: true });
  o.push({ k: 'line', x1: L, y1: 134.5, x2: L + Math.min(MAXW, Math.max(nw + 8, 100)), y2: 134.5, stroke: C.line, sw: 0.35, dash: [0.9, 0.9] });
  o.text('Peserta', L, 139.2, 8.5, C.muted);

  o.text('dinyatakan lulus dan menerima', L, 155, 9.5, C.muted);
  const title = 'Sertifikat ' + d.levelName;
  let tp = 24; while (tp > 16 && o.width(title, tp, { bold: true }) > MAXW) tp -= 1;
  o.text(title, L, 166, tp, C.ink, { bold: true });
  o.wrap(d.desc, 9.5, MAXW).slice(0, 6).forEach((ln, i) => o.text(ln, L, 176 + i * 4.9, 9.5, C.muted));

  // tanggal, nomor, nilai
  const fw = (MAXW - 12) / 3;
  const field = (x: number, v: string, label: string) => {
    o.text(v, x, 218, 11, C.ink, { bold: true });
    o.push({ k: 'line', x1: x, y1: 221.3, x2: x + fw, y2: 221.3, stroke: C.line, sw: 0.35, dash: [0.9, 0.9] });
    o.text(label, x, 226, 8, C.muted);
  };
  field(L, d.date, 'Tanggal terbit');
  field(L + fw + 6, d.id, 'Nomor sertifikat');
  if (d.score != null) field(L + 2 * (fw + 6), `${d.score}/100`, 'Nilai ujian akhir');

  // QR verifikasi sebagai tanda tangan digital
  const qs = 32, qx = L, qy = 242;
  o.push({ k: 'rect', x: qx - 2.5, y: qy - 2.5, w: qs + 5, h: qs + 5, fill: '#ffffff', stroke: C.line, sw: 0.3, r: 2 });
  o.push({ k: 'qr', x: qx, y: qy, size: qs, data: d.url });
  const tx = qx + qs + 10;
  o.text('Ditandatangani secara digital oleh', tx, qy + 3.5, 8.5, C.muted);
  o.text(d.signer.name, tx, qy + 10.5, 14, C.ink, { bold: true });
  o.text(d.signer.role, tx, qy + 15.6, 9, C.green, { bold: true });
  o.push({ k: 'line', x1: tx, y1: qy + 18.6, x2: W - L, y2: qy + 18.6, stroke: C.line, sw: 0.3 });
  o.wrap('Pindai QR untuk memastikan sertifikat ini asli dan terdaftar di Jagoan Excel.', 8, W - L - tx).slice(0, 2)
    .forEach((ln, i) => o.text(ln, tx, qy + 23.4 + i * 4, 8, C.muted));
  o.text(d.url.replace(/^https?:\/\//, ''), tx, qy + qs, 7.5, C.green, { bold: true });

  if (d.sample) {
    const a = 35, s = 'CONTOH', p = 96, w = o.width(s, p, { bold: true }), rad = (a * Math.PI) / 180;
    const cx = W / 2, cy = 175;
    o.push({ k: 'text', x: cx - (w / 2) * Math.cos(rad), y: cy + (w / 2) * Math.sin(rad), s, pt: p, bold: true, color: '#c0392b', angle: a, op: 0.1 });
  }
  return o.list;
}

/** Kepala halaman pertama portofolio (A4 tegak, 210 mm). Mengembalikan tinggi yang terpakai. */
export function portfolioHeadOps(m: Measure, d: { name: string; meta: string }): { ops: Op[]; bottom: number } {
  const o = new Ops(m), W = 210, M = 18;
  o.push({ k: 'rect', x: 0, y: 0, w: W, h: 64, fill: C.dark });
  o.band(0, 0, W, 62);
  o.push({ k: 'logo', x: M, y: 12, size: 9, v: 'white' });
  o.text('Jagoan Excel', M + 11.5, 17.9, 12, '#ffffff', { bold: true });
  o.text('PORTOFOLIO KEMAMPUAN EXCEL', M, 32, 8, '#ffffff', { bold: true, ls: 0.9, op: 0.9 });
  let pt = 24; while (pt > 15 && o.width(d.name, pt, { bold: true }) > 140) pt -= 1;
  o.text(d.name, M, 43, pt, '#ffffff', { bold: true });
  o.wrap(d.meta, 8.5, 140).slice(0, 2).forEach((ln, i) => o.text(ln, M, 50.5 + i * 4.2, 8.5, '#ffffff', { op: 0.85 }));
  o.seal(W - 36, 62, 17, 'JAGOAN EXCEL • PORTOFOLIO • ', 'Portofolio');
  return { ops: o.list, bottom: 86 };
}

/** Garis gradien tipis di atas halaman lanjutan portofolio. */
export function stripOps(m: Measure, w: number): Op[] {
  const o = new Ops(m); const N = 80, sw = w / N;
  for (let i = 0; i < N; i++) o.push({ k: 'rect', x: i * sw, y: 0, w: sw + 0.15, h: 3, fill: mix(i / (N - 1)) });
  return o.list;
}

/** Stempel saja, dalam kotak 40×40 (untuk tampilan web). */
export function sealOps(m: Measure, ring: string, label: string): Op[] {
  const o = new Ops(m); o.seal(20, 20, 17.5, ring, label); return o.list;
}
