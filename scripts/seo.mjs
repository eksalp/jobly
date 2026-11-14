// Dijalankan setelah `vite build`: membuat salinan index.html per halaman penting dengan judul, deskripsi,
// dan alamat kanonik yang sesuai (supaya Google dan pratinjau tautan WhatsApp/LinkedIn menampilkan teks yang benar),
// lalu menulis sitemap.xml dan robots.txt. Isi halaman tetap dirender oleh aplikasi React seperti biasa.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ALLFUNCS } from '../src/content/allfuncs.js';
import { ERRORS } from '../src/content/errors.js';
import { PATHS } from '../src/content/paths.js';
import { LESSONS } from '../src/content/lessons.js';
import { CASES } from '../src/content/cases.js';

const SITE = (process.env.SITE_URL || 'https://jagoanexcel.com').replace(/\/$/, '');
const DIST = process.argv[2] || 'dist';
const B = ' · Jagoan Excel';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (h, n = 155) => {
  const s = String(h || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
  return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s;
};

/** [path, judul, deskripsi, prioritas sitemap] */
const pages = [
  ['/', 'Jagoan Excel · Belajar Excel sambil praktik', 'Belajar Excel dari nol sampai siap kerja: materi praktik langsung di browser, studi kasus kantor, bank soal, simulasi tes kerja, dan sertifikat dengan QR verifikasi.', '1.0'],
  ['/materi', 'Materi Belajar Excel dari Dasar sampai Mahir' + B, 'Materi Excel berurutan dari dasar sampai mahir, setiap materi langsung dipraktikkan di lembar kerja online.', '0.9'],
  ['/jalur', 'Jalur Belajar Excel per Profesi' + B, 'Roadmap belajar Excel sesuai pekerjaan: admin kantor, admin gudang, admin olshop, keuangan, HRD, sales, data analyst, dan lainnya.', '0.9'],
  ['/tes-kerja', 'Simulasi Tes Excel Rekrutmen Kerja' + B, 'Latihan tes Excel seperti saat seleksi kerja: pilih dari 18 posisi (admin kantor, admin gudang, admin olshop, finance, HR, sales, purchasing, logistik, data analyst, fresh graduate, dan lainnya), kerjakan soal praktik dengan batas waktu, lalu lihat nilai dan pembahasan.', '0.9'],
  ['/wawancara', 'Pertanyaan Wawancara Excel & Cara Menulis Skill Excel di CV' + B, 'Pertanyaan Excel yang sering ditanya saat wawancara kerja beserta contoh jawaban, tips tes praktik Excel, dan contoh kalimat skill Excel untuk CV.', '0.9'],
  ['/error', 'Arti Error Excel (#N/A, #VALUE!, #REF!, #DIV/0!) dan Cara Memperbaikinya' + B, 'Kamus error Excel: arti #N/A, #VALUE!, #REF!, #DIV/0!, #NAME?, #SPILL!, ####, dan masalah lain, beserta penyebab dan cara memperbaikinya.', '0.9'],
  ['/shortcut', 'Daftar Shortcut Excel Lengkap' + B, 'Shortcut keyboard Excel yang paling berguna untuk kerja sehari-hari, dikelompokkan per kegunaan.', '0.7'],
  ['/shortcut/latihan', 'Latihan Shortcut Excel 60 Detik' + B, 'Game latihan shortcut Excel: tekan shortcut yang benar secepat mungkin dalam 60 detik. Bisa juga mode pilihan ganda di HP.', '0.7'],
  ['/fungsi', 'Daftar Lengkap Fungsi Excel dan Contohnya' + B, 'Semua fungsi Excel per kategori dengan penjelasan bahasa Indonesia, sintaks, dan contoh rumus yang bisa langsung dicoba.', '0.8'],
  ['/soal', 'Bank Soal Latihan Excel' + B, 'Ribuan soal latihan Excel dari tingkat Basic sampai Expert, langsung dikerjakan dan diperiksa di browser.', '0.8'],
  ['/tantangan', 'Tantangan Excel Harian' + B, 'Satu soal Excel baru setiap hari. Kerjakan secepat mungkin, lalu bagikan waktumu.', '0.7'],
  ['/kasus', 'Studi Kasus Excel Dunia Kerja' + B, 'Studi kasus Excel dari berbagai industri dan divisi kantor untuk latihan seperti kerja nyata.', '0.8'],
  ['/playground', 'Excel Playground Online' + B, 'Lembar kerja Excel online untuk mencoba rumus langsung di browser, tanpa instal aplikasi.', '0.7'],
  ['/template', 'Template Excel Siap Pakai' + B, 'Template Excel siap pakai: dashboard penjualan, keuangan pribadi, dan lainnya.', '0.7'],
  ['/ringkas', 'Rumus Excel Ringkas (Cheat Sheet)' + B, 'Ringkasan rumus Excel yang paling sering dipakai beserta contohnya.', '0.6'],
  ['/fitur', 'Fitur dan Menu Excel' + B, 'Penjelasan menu dan fitur di ribbon Excel.', '0.5'],
  ['/sertifikat', 'Sertifikat Excel dengan QR Verifikasi' + B, 'Ikuti ujian akhir dan dapatkan sertifikat Excel yang bisa diverifikasi lewat QR code.', '0.6'],
  ['/harga', 'Paket Pro' + B, 'Buka semua materi, bank soal, dan latihan Pro Jagoan Excel.', '0.5'],
];
for (const e of ERRORS) pages.push([`/error/${e.slug}`, `${e.code} di Excel: ${e.title} dan Cara Memperbaikinya` + B, plain(`Arti ${e.code} di Excel: ${e.short} Penyebab: ${e.causes.map(c => c[0]).join(', ')}.`), '0.8']);
for (const f of ALLFUNCS) pages.push([`/fungsi/${encodeURIComponent(f[0])}`, `Fungsi ${f[0]} Excel: Cara Pakai dan Contoh` + B, plain(`${f[0]}: ${f[3]} Sintaks ${f[2]}. Penjelasan bahasa Indonesia dan contoh rumus yang bisa langsung dicoba.`), '0.6']);
for (const p of PATHS) pages.push([`/jalur/${p.id}`, `Jalur Belajar Excel untuk ${p.title}` + B, plain(p.desc), '0.7']);
for (const l of LESSONS) pages.push([`/materi/${l.id}`, `${l.title}: Belajar Excel` + B, plain(l.body), '0.6']);
for (const c of CASES) pages.push([`/kasus/${c.id}`, `Studi Kasus Excel: ${c.title}` + B, plain(c.scenario), '0.5']);

const tpl = readFileSync(join(DIST, 'index.html'), 'utf8');
function render(path, title, desc) {
  const url = SITE + (path === '/' ? '/' : path);
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`, `<meta property="og:site_name" content="Jagoan Excel" />`,
    `<meta property="og:title" content="${esc(title)}" />`, `<meta property="og:description" content="${esc(desc)}" />`, `<meta property="og:url" content="${esc(url)}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ].join('\n    ');
  return tpl.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta name="description"[^>]*>/, '').replace('</head>', `    ${head}\n  </head>`);
}

let n = 0;
for (const [path, title, desc] of pages) {
  // /error/na → error/na.html (Netlify & Vercel cleanUrls menyajikannya di /error/na tanpa redirect garis miring)
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, decodeURIComponent(path).replace(/^\//, '') + '.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(path, title, desc)); n++;
}
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(([p, , , pr]) => `  <url><loc>${esc(SITE + p)}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /masuk\nDisallow: /ujian/\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`seo: ${n} halaman, sitemap.xml, robots.txt`);
