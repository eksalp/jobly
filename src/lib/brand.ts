// Logo Jagoan Excel: monogram "je" dari satu garis gelombang tebal — titik + batang "j" turun,
// melengkung naik menjadi gelombang, lalu ujungnya menggulung ke dalam seperti "e". Titik hijau muda = titik "j".
// Satu sumber untuk logo di aplikasi, favicon, sertifikat, dan PDF.
export const BRAND_GREEN = '#107c41';
export const BRAND_ACCENT = '#84cc16';
export const LOGO = {
  path: 'M22 38 C20 58 22 79 37 80 C51 81 53 61 58 48 C62 37 69 30 77 32 C86 34 87 47 80 53 C74 58 64 56 60 50',
  width: 13,
  dot: { cx: 24, cy: 20, r: 7.5 },
};
/** Isi SVG (tanpa tag <svg>) untuk kotak 100×100.
 *  tile = true: ubin hijau dengan garis putih (favicon, ikon aplikasi). tile = false: garis hijau tanpa latar. */
export const logoInner = (tile = true) => {
  const fg = tile ? '#ffffff' : BRAND_GREEN, accent = tile ? '#bef264' : BRAND_ACCENT;
  const body = `<path d="${LOGO.path}" fill="none" stroke="${fg}" stroke-width="${LOGO.width}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="${LOGO.dot.cx}" cy="${LOGO.dot.cy}" r="${LOGO.dot.r}" fill="${accent}"/>`;
  return tile ? `<rect width="100" height="100" rx="22" fill="${BRAND_GREEN}"/><g transform="translate(9 9) scale(.84)">${body}</g>` : body;
};
export const LOGO_SVG = (size = 256, tile = true) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">${logoInner(tile)}</svg>`;

let cache: string | null = null;
/** Data URL PNG logo (resolusi tinggi supaya tajam saat dicetak). */
export function logoPng(): Promise<string> {
  if (cache) return Promise.resolve(cache);
  return new Promise((ok, fail) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      c.getContext('2d')!.drawImage(img, 0, 0, 256, 256);
      cache = c.toDataURL('image/png'); ok(cache);
    };
    img.onerror = fail;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(LOGO_SVG());
  });
}
