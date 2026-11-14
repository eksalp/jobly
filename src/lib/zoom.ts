// Di desktop seluruh halaman diperkecil dengan CSS zoom (lihat styles.css, --z).
// Koordinat dari getBoundingClientRect/clientX dalam piksel layar, sedangkan nilai style
// left/top/width di dalam elemen ber-zoom dikalikan zoom lagi. Bagi dengan faktor ini.
export const pageZoom = (): number => {
  if (typeof document === 'undefined') return 1;
  const z = parseFloat(getComputedStyle(document.documentElement).zoom || '1');
  return Number.isFinite(z) && z > 0 ? z : 1;
};
