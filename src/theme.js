/**
 * Token desain Jobly.
 *
 * Nilai di sini adalah variabel CSS, bukan warna langsung. Warna
 * sesungguhnya didefinisikan di src/styles/tema.css — sekali untuk tema
 * terang, sekali untuk tema gelap. Dengan begitu seluruh panel ikut
 * berganti tema tanpa diubah satu per satu.
 *
 * Nama kunci lama (ink, inkSoft, accent, dst) dipertahankan.
 */
export const T = {
  // Teks
  ink: "var(--t-ink)",
  inkSoft: "var(--t-ink-soft)",
  inkFaint: "var(--t-ink-faint)",

  // Merek
  accent: "var(--t-accent)",
  accentSoft: "var(--t-accent-soft)",
  brand: "var(--t-brand)",
  teal: "var(--t-teal)",
  salary: "var(--t-teal)",

  // Permukaan & garis
  bg: "var(--t-bg)",
  surface: "var(--t-surface)",
  surface2: "var(--t-surface2)",
  border: "var(--t-border)",
  line: "var(--t-line)",
  field: "var(--t-field)",
  track: "var(--t-track)",

  // Status
  danger: "var(--t-danger)",
  dangerBg: "var(--t-danger-bg)",
  warn: "var(--t-warn)",
  warnInk: "var(--t-warn-ink)",
  warnBg: "var(--t-warn-bg)",
  ok: "var(--t-ok)",
  okBg: "var(--t-ok-bg)",
  muted: "var(--t-muted)",

  // Huruf
  sans: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
};

export const fontLink =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
