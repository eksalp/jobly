# JobFinder AI — prototype

## Cara jalanin di lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Ada tombol switcher di pojok kanan atas buat pindah antara:
- **Website** — landing page, auth (UI saja), dan dashboard
- **CV/LinkedIn Analyzer** — widget analisis gratis + berbayar

## ⚠️ Penting: bagian AI di Analyzer belum akan jalan di lokal

Di `src/pages/JobFinderAnalyzer.jsx`, tombol "Buka Analisis Lengkap" manggil:

```js
fetch("https://api.anthropic.com/v1/messages", { ... })
```

Ini jalan tanpa perlu API key **hanya di dalam Claude.ai Artifacts**, karena Anthropic yang nyisipin key di balik layar di sandbox itu. Di luar Claude.ai (termasuk pas kamu run `npm run dev` di lokal, atau nanti di-deploy ke Vercel), panggilan ini akan **gagal** — karena:
1. Nggak ada API key yang nempel otomatis.
2. Browser nggak boleh manggil `api.anthropic.com` langsung sambil nyimpen API key di kode frontend (key bakal kelihatan siapa aja lewat DevTools — bahaya).

**Yang perlu kamu lakukan sebelum fitur ini beneran jalan:**
1. Bikin backend kecil (Cloudflare Worker, kayak yang kamu pakai di Promptfolio, paling cocok) yang nyimpen `ANTHROPIC_API_KEY` di environment variable server-side.
2. Ubah `fetch("https://api.anthropic.com/v1/messages", ...)` di `JobFinderAnalyzer.jsx` jadi `fetch("https://worker-kamu.workers.dev/analyze", ...)` — Worker itu yang nerusin request ke Anthropic API pakai key yang aman.
3. Bagian keyword matching gratis (deteksi arah karier + 3 loker teaser) **sudah 100% jalan tanpa backend apapun** — itu murni JS di browser.

## Struktur folder

```
src/
  App.jsx                  ← switcher demo (bisa dihapus/diganti routing beneran nanti)
  main.jsx
  pages/
    JobFinderSite.jsx       ← landing + auth + dashboard
    JobFinderAnalyzer.jsx   ← CV/LinkedIn analyzer (free + paid tier)
```

## Belum termasuk di sini (langkah berikutnya)

- Koneksi Supabase beneran ke papan-loker (sekarang datanya di-hardcode di `JOBS` array dalam `JobFinderAnalyzer.jsx`)
- Autentikasi asli (sekarang tombol "Masuk" langsung tembus ke dashboard tanpa cek apapun)
- Payment gateway Midtrans (tombol bayar sekarang cuma simulasi)
- Backend proxy buat Claude API (lihat peringatan di atas)
