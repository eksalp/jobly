import { Link } from 'react-router-dom';
import { BY, CASES, INDS, DRILL, PRICE, SCORED, drillLevelStats, pathFor, type Item } from '../lib/catalog';
import { useProgress } from '../lib/progress';
import { useBuy } from '../components/Buy';
import { fmtUntil, rp } from '../lib/format';

const WHO: { i: string; t: string; d: string; b: string[]; start: string }[] = [
  { i: 'M8 8V6a4 4 0 0 1 8 0v2M5 8h14v12H5zM9 12h6', t: 'Pelajar SMA/SMK', d: 'Siap ujian praktik komputer, tugas sekolah, dan magang/PKL.', b: ['Rumus dasar sampai IF dan VLOOKUP', 'Membuat tabel dan grafik yang rapi', 'Soal latihan bertahap dari nol'], start: 'rumus-pertama' },
  { i: 'M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6', t: 'Mahasiswa', d: 'Olah data tugas, praktikum, dan skripsi lebih cepat.', b: ['Statistik deskriptif, korelasi, regresi', 'PivotTable dan grafik untuk laporan', 'Sertifikat dan portofolio untuk CV'], start: 'sebaran-data' },
  { i: 'M4 9l1.5-5h13L20 9M4 9h16v11H4zM4 9c0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0M10 20v-5h4v5', t: 'Pebisnis & UMKM', d: 'Catat penjualan, stok, dan laba tanpa aplikasi mahal.', b: ['Rekap penjualan dengan SUMIFS dan PivotTable', 'Stok, HPP, margin, dan PPN', 'Cicilan, NPV, dan analisis What-If'], start: 'sumifs' },
  { i: 'M3 8h18v11H3zM8 8V5h8v3M3 13h18', t: 'Karyawan & pencari kerja', d: 'Lolos tes Excel rekrutmen dan kerjakan laporan kantor lebih cepat.', b: ['XLOOKUP, FILTER, dan rumus gabungan', 'Studi kasus keuangan, HRD, gudang, audit', 'Macro dan VBA untuk tugas berulang'], start: 'xlookup' },
];

export default function PricingPage() {
  const { isPro, proUntil } = useProgress();
  const { buy } = useBuy();
  const freeCases = CASES.filter((c: Item) => c.free).length;
  const freeDrill = drillLevelStats('Dasar', {}).n;
  const feats: [string, any, any][] = [
    ['Modul Dasar Excel dan Fungsi hitung', 1, 1],
    ['Semua ' + SCORED.length + ' materi sampai PivotTable, Power Query, dan VBA', 0, 1],
    ['Studi kasus kantor', freeCases + ' kasus', CASES.length + ' kasus'],
    ['Bank soal praktik di aplikasi', freeDrill.toLocaleString('id-ID') + ' soal', DRILL.count.toLocaleString('id-ID') + ' soal'],
    ['Ribuan latihan soal Excel tambahan (Latihan Pro)', 0, 1],
    ['Grup Telegram khusus member Pro', 0, 1],
    ['Simulasi PivotTable, Filter, What-If, Solver, Macro', 1, 1],
    ['Daftar fungsi, shortcut, rumus ringkas, dan menu Excel', 1, 1],
    ['Portofolio PDF untuk CV', 0, 1],
    ['Pemetaan kesiapan sertifikasi MO-210 / MO-211', 0, 1],
    ['Masa akses', 'Selamanya', 'Selamanya'],
  ];
  const cell = (v: any) => (v === 1 ? '✓' : v === 0 ? <span className="muted">–</span> : v);
  const perLesson = Math.round(PRICE.pro / SCORED.length);
  const cta = isPro ? <Link className="btn lg" to="/pro">Pro aktif {fmtUntil(proUntil!)} · buka latihan Pro</Link> : <button className="btn primary lg" onClick={buy}>Beli Pro lifetime · {rp(PRICE.pro)}</button>;
  return (
    <div className="wrap page pricing">
      <section className="pr-hero">
        <div>
          <p className="eyebrow">Paket Pro</p>
          <h1>Bayar sekali, belajar Excel selamanya.</h1>
          <p className="pr-lead">Cukup <b>{rp(PRICE.pro)}</b> untuk membuka semua materi, {DRILL.count.toLocaleString('id-ID')} soal, studi kasus, template, dan grup Telegram. Tidak ada langganan bulanan.</p>
          <div className="cta">{cta}<Link className="btn lg ghost" to="/materi">Coba yang gratis dulu</Link></div>
          <p className="pr-mini">Setara ±{rp(perLesson)} per materi · bayar lewat transfer atau e-wallet via WhatsApp admin</p>
        </div>
        <div className="pr-price" aria-label="Harga">
          <span className="pr-tag">Lifetime</span>
          <div className="pr-amt">{rp(PRICE.pro)}</div>
          <p>sekali bayar</p>
          <ul>
            <li>{SCORED.length} materi + kuis</li><li>{DRILL.count.toLocaleString('id-ID')} soal praktik</li><li>{CASES.length} studi kasus kantor</li><li>Ribuan latihan tambahan</li><li>Grup Telegram Pro</li><li>Sertifikat & portofolio PDF</li>
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="who-h">
        <div className="section-h"><div><h2 id="who-h">Cocok untuk siapa?</h2><p>Isinya sama, tujuannya bisa beda-beda. Mulai dari yang paling kamu butuhkan.</p></div></div>
        <div className="pr-who">
          {WHO.map(w => (
            <article key={w.t} className="pr-card">
              <span className="hc-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={w.i} /></svg></span>
              <h3>{w.t}</h3>
              <p>{w.d}</p>
              <ul>{w.b.map(x => <li key={x}>{x}</li>)}</ul>
              <Link to={pathFor(w.start)}>Mulai dari: {BY[w.start]?.title ?? 'materi pertama'} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="plan-h"><h2 id="plan-h" className="sr">Pilih paket</h2>
      <div className="plans">
        <div className="plan"><h2>Gratis</h2><div className="price">Rp0</div><p className="sub">Untuk mencoba cara belajarnya.</p>
          <ul><li>Modul Dasar Excel dan Fungsi hitung</li><li>{freeCases} studi kasus kantor</li><li>{freeDrill.toLocaleString('id-ID')} soal praktik tingkat Dasar</li><li>Simulasi fitur Excel</li><li className="no">Portofolio PDF, Latihan Pro, dan grup Telegram</li><li className="no">PivotTable, Power Query, VBA</li></ul>
          <Link className="btn block" to="/materi">Mulai belajar</Link></div>
        <div className="plan main"><span className="plan-flag">Paling hemat</span><h2>Pro Lifetime {isPro && <span className="badge pro">Aktif</span>}</h2><div className="price">{rp(PRICE.pro)} <small>sekali bayar</small></div><p className="sub">Berlaku selamanya, termasuk materi baru berikutnya.</p>
          <ul><li>Semua {SCORED.length} materi dan kuis</li><li>{DRILL.count.toLocaleString('id-ID')} soal praktik di bank soal</li><li><b>Ribuan latihan soal Excel tambahan</b></li><li><b>Grup Telegram khusus member Pro</b></li><li>Semua {CASES.length} studi kasus dari {INDS.length} bidang industri</li><li>PivotTable, Power Query, Power Pivot, sampai VBA</li><li>Sertifikat tiap tingkat dengan QR verifikasi</li><li>Peta kesiapan sertifikasi MO-210 dan MO-211</li></ul>
          {isPro ? <Link className="btn block" to="/pro">Aktif {fmtUntil(proUntil!)} · buka latihan Pro</Link> : <button className="btn primary block" onClick={buy}>Beli Pro lifetime</button>}</div>
      </div>
      </section>
      <section className="section" aria-labelledby="cmp-h"><h2 id="cmp-h">Perbandingan paket</h2>
        <div className="pv-scroll"><table className="cmp"><thead><tr><th>Fitur</th><th>Gratis</th><th>Pro</th></tr></thead>
          <tbody>{feats.map(f => <tr key={f[0]}><td>{f[0]}</td><td>{cell(f[1])}</td><td>{cell(f[2])}</td></tr>)}</tbody></table></div></section>
      <section className="section faq" aria-labelledby="faq-h"><h2 id="faq-h">Pertanyaan umum</h2>
        <details><summary>Benar-benar lifetime?</summary><p>Ya. Bayar sekali, tidak ada tagihan bulanan. Materi dan latihan yang ditambahkan nanti juga ikut terbuka.</p></details>
        <details><summary>Bagaimana cara membayar?</summary><p>Tekan Beli Pro, isi email, lalu kamu diarahkan ke WhatsApp admin untuk instruksi pembayaran (transfer bank atau e-wallet). Setelah pembayaran diterima, admin mengirim kode login. Masuk dengan email dan kode itu, dan semua materi langsung terbuka.</p></details>
        <details><summary>Di mana link latihan tambahan dan grup Telegram?</summary><p>Setelah Pro aktif, buka menu <b>Latihan Pro</b> di sidebar. Link-link itu hanya tampil untuk akun Pro.</p></details>
        <details><summary>Saya lupa kode login.</summary><p>Chat admin di WhatsApp dan sebutkan emailmu. Kamu akan dapat kode baru, dan kode lama tidak bisa dipakai lagi.</p></details>
        <details><summary>Saya sudah membeli paket 1 tahun sebelumnya.</summary><p>Tenang, aksesmu otomatis jadi lifetime tanpa bayar lagi.</p></details>
        <details><summary>Apakah perlu memasang Excel untuk belajar di sini?</summary><p>Tidak perlu. Rumus dihitung langsung di browser, jadi bisa belajar dari HP. Untuk PivotTable, Power Query, dan VBA, sebaiknya dicoba juga di Excel.</p></details>
        <details><summary>Apakah materi ini sama dengan soal ujian MOS?</summary><p>Bukan. Materinya mengikuti kisi-kisi resmi MO-210 dan MO-211 supaya persiapanmu terarah, tapi ini bukan bocoran soal.</p></details>
      </section>
      <section className="pr-band"><div><h2>Mulai hari ini, pakai selamanya.</h2><p>{rp(PRICE.pro)} sekali bayar. Progres, portofolio, dan sertifikatmu tersimpan di akun.</p></div>{cta}</section>
    </div>
  );
}
