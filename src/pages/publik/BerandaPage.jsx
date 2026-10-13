import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  ArrowRight,
  Check,
  FilePlus2,
  MessageSquareQuote,
  FileSearch,
  Mic,
  Globe,
  ShieldX,
  BarChart3,
  Flame,
  History,
} from "lucide-react";
import {
  PublicLayout,
  KOTA_POPULER,
  useToast,
  useGulirKeHash,
} from "../../components/publik/PublicLayout";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { LogoKotak } from "../../components/publik/LogoKotak";
import { DaftarFaq } from "../../components/publik/DaftarFaq";
import { BagianKomunitas } from "../../components/publik/Komunitas";
import { useJobs } from "../../context/JobsContext";
import { useAuth } from "../../context/AuthContext";
import { useHitungNaik, usePintasanCari, bacaDilihat } from "../../utils/interaksi";
import { jt } from "../../utils/petaGaji";
import { infoSumber, urlDetail } from "../../utils/sumberLoker";
import { usePetaGaji } from "../../hooks/useLoker";
import { SEMUA_TIER, rupiah, labelDurasi } from "../../data/paket";
import { BATAS_GRATIS } from "../../context/JobsContext";
import { FAQ_BERANDA } from "../../data/faq";
import { keHalaman, tautan } from "../../utils/navigasi";
import { logoPerusahaan, waktuRelatif, kotaDari } from "../../utils/sumberLoker";
import { useKurs, rupiahPenuh, formatWaktuKurs } from "../../utils/kurs";
import { keTahunan } from "../../utils/hitungGaji";

const POPULER = [
  ["Remote", "/loker?lokasi=remote"],
  ["Magang", "/loker?tipe=magang"],
  ["Fresh graduate", "/loker?q=fresh%20graduate"],
  ["Admin", "/loker?q=admin"],
  ["Finance", "/loker?q=finance"],
  ["IT", "/loker?q=engineer"],
];

const waktuDari = (j) => {
  const t = j.tanggal ? new Date(j.tanggal).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
};
const angka = (n) => Number(n || 0).toLocaleString("id-ID");

/* ---------------------------------------------------------------- */

function KalkulatorMini() {
  const { idrPerUsd, live, waktu } = useKurs();
  const [teks, setTeks] = useState("1500");
  const [periode, setPeriode] = useState("bulan");
  const jumlah = parseFloat(String(teks).replace(/\./g, "").replace(",", ".")) || 0;
  const perBulan = (keTahunan(jumlah, periode, 40) / 12) * idrPerUsd;

  return (
    <div className="pb-panel" style={{ display: "grid", gap: 18 }}>
      <label className="pb-field">
        <span>Gaji dalam dolar AS</span>
        <div className="pb-input">
          <input id="mini-usd" inputMode="decimal" value={teks} onChange={(e) => setTeks(e.target.value)} />
          <span className="unit">USD</span>
        </div>
      </label>
      <div className="pb-seg" role="group" aria-label="Periode gaji">
        {[
          ["jam", "Per jam"],
          ["bulan", "Per bulan"],
          ["tahun", "Per tahun"],
        ].map(([id, l]) => (
          <button key={id} type="button" className={periode === id ? "on" : ""} aria-pressed={periode === id} onClick={() => setPeriode(id)}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--line2)", paddingTop: 16 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink2)" }}>Setara per bulan</div>
        <div className="pb-big" style={{ marginTop: 4 }}>
          {rupiahPenuh(perBulan)}
        </div>
        <div className="pb-kurs" style={{ marginTop: 6 }}>
          1 USD = {rupiahPenuh(idrPerUsd)} · {live ? `kurs ${formatWaktuKurs(waktu) || "hari ini"}` : "kurs cadangan"}
          {periode === "jam" ? " · 40 jam/minggu" : ""}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function Angka({ nilai, loading }) {
  const ref = useHitungNaik(loading ? NaN : nilai);
  return <b ref={ref}>{loading ? "…" : angka(nilai)}</b>;
}

/* ------------------------------------------------ mini-visual fitur */

function MiniCek() {
  return (
    <div className="mv-cek" aria-hidden="true">
      <div className="bubble">
        DIBUKA LOWONGAN PT BESAR!!! Lulusan SMA, gaji 9 jt. Wajib{" "}
        <mark>bayar biaya seragam Rp 350.000</mark>, kirim CV ke{" "}
        <mark>hrd.ptbesar@gmail.com</mark>. <mark>Kuota terbatas hari ini</mark>!
      </div>
      <div className="vonis">
        <ShieldX size={16} /> Bahaya · 3 tanda penipuan
      </div>
    </div>
  );
}

function MiniGaji({ data }) {
  const baris = data.length ? data : [
    { label: "Teknologi", p25: 9e6, median: 14e6, p75: 22e6 },
    { label: "Keuangan", p25: 6e6, median: 9e6, p75: 13e6 },
    { label: "Pemasaran", p25: 5e6, median: 7.5e6, p75: 11e6 },
    { label: "Administrasi", p25: 4.5e6, median: 5.5e6, p75: 7e6 },
  ];
  const maks = Math.max(...baris.map((b) => b.p75)) * 1.1;
  return (
    <div className="mv-gaji" aria-hidden="true">
      {baris.map((b, i) => (
        <div key={b.label} style={{ "--i": i }}>
          <span>{b.label}</span>
          <div className="trek">
            <i className="pita" style={{ left: `${(b.p25 / maks) * 100}%`, width: `${((b.p75 - b.p25) / maks) * 100}%` }} />
            <i className="med" style={{ left: `${(b.median / maks) * 100}%` }} />
          </div>
          <em>{jt(b.median)}</em>
        </div>
      ))}
    </div>
  );
}

const FONT_CV = [
  ["Carlito", "'Carlito', 'Calibri', sans-serif"],
  ["EB Garamond", "'EB Garamond', Garamond, serif"],
  ["Lato", "'Lato', sans-serif"],
  ["Gelasio", "'Gelasio', Georgia, serif"],
];
function MiniCv() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % FONT_CV.length), 1800);
    return () => clearInterval(t);
  }, []);
  const [nama, keluarga] = FONT_CV[i];
  return (
    <div className="mv-cv" aria-hidden="true">
      <div className="kertas" style={{ fontFamily: keluarga }} key={nama}>
        <b>Nadia Putri</b>
        <small>Finance & Tax Staff · Jakarta</small>
        <hr />
        <i style={{ width: "92%" }} />
        <i style={{ width: "78%" }} />
        <i style={{ width: "85%" }} />
      </div>
      <span className="font">Aa · {nama}</span>
    </div>
  );
}

function MiniLatihan() {
  return (
    <div className="mv-latihan" aria-hidden="true">
      <span className="tag">Level neraka</span>
      <p>“Kalau kami bisa merekrut kandidat internal dengan gaji lebih rendah, kenapa harus kamu?”</p>
      <div className="timer">
        <svg viewBox="0 0 36 36" width="34" height="34">
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--bar-bg)" strokeWidth="4" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" strokeDasharray="94" className="putar" transform="rotate(-90 18 18)" />
        </svg>
        <span>2:00 untuk menjawab</span>
      </div>
    </div>
  );
}

function MiniRencana() {
  const hari = ["S", "S", "R", "K", "J", "S", "M"];
  const isi = [2, 1, 3, 0, 2, 1, 0];
  return (
    <div className="mv-rencana" aria-hidden="true">
      <div className="api">
        <Flame size={20} /> <b>5 hari</b> streak
      </div>
      <div className="hari">
        {hari.map((h, i) => (
          <div key={i} className={isi[i] ? "isi" : ""} style={{ "--i": i }}>
            <i>{isi[i] || ""}</i>
            <span>{h}</span>
          </div>
        ))}
      </div>
      <div className="bar">
        <i style={{ width: "90%" }} />
      </div>
      <small>9 dari 10 lamaran minggu ini</small>
    </div>
  );
}

function MiniSkor() {
  return (
    <div className="mv-skor" aria-hidden="true">
      <svg viewBox="0 0 80 80" width="92" height="92">
        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--bar-bg)" strokeWidth="8" />
        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--brand-deep)" strokeWidth="8" strokeLinecap="round" strokeDasharray="201" strokeDashoffset="36" className="isi" transform="rotate(-90 40 40)" />
        <text x="40" y="46" textAnchor="middle">82</text>
      </svg>
      <ul>
        <li className="ok">Format terbaca ATS</li>
        <li className="ok">Kata kunci posisi</li>
        <li className="no">Pencapaian tanpa angka</li>
      </ul>
    </div>
  );
}

function MiniSuara() {
  return (
    <div className="mv-suara" aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <i key={i} style={{ "--i": i, "--h": `${20 + ((i * 37) % 70)}%` }} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */

export function BerandaPage() {
  const { statistik: st, loading, total, terkunci } = useJobs();
  const { session } = useAuth();
  const masuk = Boolean(session);
  const [q, setQ] = useState("");
  const [kota, setKota] = useState("");
  const [toast, elemenToast] = useToast();
  const dilihat = useMemo(() => bacaDilihat().slice(0, 4), []);
  useGulirKeHash(!loading);
  usePintasanCari("cari-beranda");

  const fitur = (panel) => `/dashboard/${panel}`;

  // Semua angka beranda dihitung server dan di-cache CDN — browser tidak
  // perlu mengunduh daftar loker sama sekali untuk halaman ini.
  const data = useMemo(() => {
    const kotaTeratas = Object.entries(st.kota || {})
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 11);
    const daftarSumber = Object.entries(st.sumber || {})
      .sort((a, b) => b[1] - a[1])
      .map(([site]) => {
        const info = infoSumber({ site });
        return info.langsung ? site.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : info.nama;
      });
    return {
      terbaru: st.terbaru || [],
      ringkas: (st.terbaru || []).slice(0, 5),
      baru: st.baru7 || 0,
      remote: st.remoteContoh || [],
      jumlahRemote: st.remote || 0,
      jumlahSumber: Object.keys(st.sumber || {}).length,
      kotaTeratas,
      daftarSumber,
    };
  }, [st]);

  const { data: peta } = usePetaGaji();
  const gajiMini = (peta?.perBidang?.tampil || []).slice(0, 4);

  const cari = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (kota) p.set("kota", kota);
    const s = p.toString();
    keHalaman(`/loker${s ? `?${s}` : ""}`);
  };

  const hariIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Daftar sumber untuk pita berjalan. Cadangan dipakai sebelum data siap.
  const sumberPita = data.daftarSumber.length
    ? data.daftarSumber
    : ["LinkedIn", "Indeed", "BCA", "Pertamina", "Shopee", "Astra", "Loker BUMN", "Traveloka", "Unilever", "Danone"];

  return (
    <PublicLayout aktif="/">
      {/* ======================================================= hero */}
      <section className="pb-wrap pb-hero">
        <div>
          <h1>
            In this economy, cari kerja itu susah.{" "}
            <span>Biar Jobly yang cariin ribuan loker buat kamu.</span>
          </h1>
          <p className="pb-lede">
            Setiap hari Jobly mengumpulkan lowongan dari situs karier perusahaan,
            BUMN, LinkedIn, dan Indeed. Kamu cukup cari di satu tempat, cek
            gajinya, lalu lamar langsung ke sumbernya. Gratis.
          </p>

          <form className="pb-searchbar" onSubmit={cari} role="search">
            <label>
              <Search size={18} color="var(--muted)" aria-hidden="true" />
              <span className="pb-sr">Posisi atau perusahaan</span>
              <input
                id="cari-beranda"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Posisi, perusahaan, atau skill"
                autoComplete="off"
              />
            </label>
            <label>
              <MapPin size={18} color="var(--muted)" aria-hidden="true" />
              <span className="pb-sr">Kota</span>
              <select id="kota-beranda" value={kota} onChange={(e) => setKota(e.target.value)}>
                <option value="">Semua kota</option>
                {KOTA_POPULER.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="pb-btn pb-btn-primary">
              Cari loker
            </button>
          </form>

          <div className="pb-popular">
            <span>Populer:</span>
            {POPULER.map(([l, path]) => (
              <a key={l} {...tautan(path)}>
                {l}
              </a>
            ))}
          </div>
        </div>

        <aside className="pb-today" aria-label="Ringkasan lowongan hari ini">
          <div className="pb-today-head">
            Hari ini di Jobly
            <time>{hariIni}</time>
          </div>
          <div className="pb-today-stats">
            <div>
              <Angka nilai={total} loading={loading} />
              <span>lowongan</span>
            </div>
            <div>
              <Angka nilai={data.baru} loading={loading} />
              <span>baru 7 hari</span>
            </div>
            <div>
              <Angka nilai={data.jumlahSumber} loading={loading} />
              <span>sumber</span>
            </div>
          </div>
          <ul className="pb-today-list">
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <li key={i} style={{ padding: "10px 20px", display: "flex", gap: 12 }}>
                    <div className="pb-skel" style={{ width: 34, height: 34, borderRadius: 9 }} />
                    <div style={{ flex: 1 }}>
                      <div className="pb-skel" style={{ width: "70%", height: 12 }} />
                      <div className="pb-skel" style={{ width: "45%", height: 10, marginTop: 7 }} />
                    </div>
                  </li>
                ))
              : data.ringkas.map((j, i) => {
                  const logo = logoPerusahaan(j);
                  return (
                    <li key={j.id} className="masuk" style={{ "--i": i }}>
                      <a {...tautan(urlDetail(j))}>
                        <LogoKotak src={logo} nama={j.perusahaan} ikon={!logo} ukuran={34} />
                        <span style={{ minWidth: 0 }}>
                          <span className="t" style={{ display: "block" }}>
                            {j.posisi}
                          </span>
                          <span className="c" style={{ display: "block" }}>
                            {j.perusahaan}
                            {kotaDari(j.lokasi) ? ` · ${kotaDari(j.lokasi)}` : ""}
                          </span>
                        </span>
                        <span className="w">{waktuRelatif(j.tanggal) || ""}</span>
                      </a>
                    </li>
                  );
                })}
          </ul>
          <div className="pb-today-foot">
            <a className="pb-link" {...tautan("/loker")}>
              Lihat semua lowongan <ArrowRight size={15} />
            </a>
          </div>
        </aside>
      </section>

      {/* ============================================ pita sumber */}
      <div className="pb-pita" aria-label="Sumber lowongan">
        <span className="pb-pita-label">Dikumpulkan dari</span>
        <div className="pb-pita-trek">
          <div className="pb-pita-isi">
            {[...sumberPita, ...sumberPita].map((n, i) => (
              <span key={i} aria-hidden={i >= sumberPita.length}>
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ terakhir dilihat */}
      {dilihat.length > 0 && (
        <section className="pb-wrap pb-dilihat" data-muncul="">
          <span className="pb-dilihat-h">
            <History size={15} /> Terakhir kamu lihat
          </span>
          <div className="pb-dilihat-list">
            {dilihat.map((d) => (
              <a key={d.id} {...tautan(urlDetail(d))}>
                <b>{d.posisi}</b>
                <span>{d.perusahaan}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ============================================ lowongan terbaru */}
      <section className="pb-section" style={{ paddingTop: 36 }}>
        <div className="pb-wrap">
          <div className="pb-head" data-muncul="">
            <div>
              <span className="pb-label">Lowongan terbaru</span>
              <h2>Loker yang baru masuk</h2>
            </div>
            <a className="pb-link" {...tautan("/loker")}>
              Lihat semua <ArrowRight size={15} />
            </a>
          </div>
          <div className="pb-grid pb-grid-ringkas">
            {loading
              ? Array.from({ length: 8 }, (_, i) => <KartuLokerSkeleton key={i} />)
              : data.terbaru.map((j) => <KartuLoker key={j.id} job={j} onToast={toast} />)}
          </div>
        </div>
      </section>

      {/* ============================================ remote */}
      <section className="pb-remote-band">
        <div className="pb-wrap">
          <div className="pb-remote-band-head" data-muncul="">
            <div>
              <span className="pb-label terang">
                <Globe size={14} /> Khusus remote
              </span>
              <h2>Kerja dari rumah, kafe, atau kampung halaman.</h2>
              <p>
                {loading ? "Memuat…" : `${angka(data.jumlahRemote)} loker full remote`} dari
                perusahaan Indonesia dan luar negeri. Sebagian dibayar dalam dolar.
              </p>
            </div>
            <a className="pb-btn pb-btn-putih" {...tautan("/remote")}>
              Lihat loker remote <ArrowRight size={16} />
            </a>
          </div>
          <div className="pb-grid pb-grid-ringkas">
            {loading
              ? Array.from({ length: 4 }, (_, i) => <KartuLokerSkeleton key={i} />)
              : data.remote.map((j) => <KartuLoker key={j.id} job={j} onToast={toast} />)}
          </div>
        </div>
      </section>

      {/* ================================================== fitur (bento) */}
      <section className="pb-section" id="fitur">
        <div className="pb-wrap">
          <div className="pb-head" data-muncul="">
            <div>
              <span className="pb-label">Kenapa Jobly</span>
              <h2>Bukan cuma daftar loker.</h2>
              <p>Semua yang kamu butuhkan buat melamar ada di sini, dan sebagian besar gratis.</p>
            </div>
          </div>

          <div className="pb-bento">
            <a className="pb-bento-item lebar" data-muncul="" {...tautan("/cek-loker")}>
              <div className="teks">
                <span className="pb-tag baru">Gratis · tanpa daftar</span>
                <h3>Cek loker palsu</h3>
                <p>Ragu sama loker dari WhatsApp atau Instagram? Tempel teksnya di sini. Jobly akan menandai ciri-ciri penipuan, misalnya minta biaya, pakai travel agent, atau tugas like berbayar.</p>
                <span className="go">Coba cek sekarang <ArrowRight size={15} /></span>
              </div>
              <MiniCek />
            </a>

            <a className="pb-bento-item" data-muncul="" style={{ "--tunda": "80ms" }} {...tautan("/peta-gaji")}>
              <div className="teks">
                <span className="pb-tag baru">Gratis</span>
                <h3>Peta gaji</h3>
                <p>Lihat kisaran gaji per bidang dan kota, dihitung dari loker yang benar-benar ada.</p>
              </div>
              <MiniGaji data={gajiMini} />
            </a>

            <a className="pb-bento-item" data-muncul="" {...tautan(fitur("interview"))}>
              <div className="teks">
                <span className="pb-tag">Gratis</span>
                <h3>Latihan interview level neraka</h3>
                <p>140+ pertanyaan lengkap dengan contoh jawaban, plus mode tantangan dengan batas waktu.</p>
              </div>
              <MiniLatihan />
            </a>

            <a className="pb-bento-item" data-muncul="" style={{ "--tunda": "80ms" }} {...tautan(fitur("cvbuilder"))}>
              <div className="teks">
                <span className="pb-tag">Gratis</span>
                <h3>Bikin CV yang lolos ATS</h3>
                <p>Pilih font dan tema sesukamu. PDF-nya tetap rapi dan terbaca oleh sistem penyaring HRD.</p>
              </div>
              <MiniCv />
            </a>

            <a className="pb-bento-item" data-muncul="" style={{ "--tunda": "160ms" }} {...tautan(fitur("rencana"))}>
              <div className="teks">
                <span className="pb-tag baru">Gratis</span>
                <h3>Rencana lamar</h3>
                <p>Pasang target mingguan dan jaga streak harian, supaya kamu tetap rajin melamar.</p>
              </div>
              <MiniRencana />
            </a>

            <a className="pb-bento-item" data-muncul="" {...tautan(fitur("overview"))}>
              <div className="teks">
                <span className="pb-tag pro">Pro</span>
                <h3>
                  <FileSearch size={17} /> Review CV dengan AI
                </h3>
                <p>Dapat skor ATS, tahu bagian CV yang masih lemah, plus versi perbaikannya dalam bahasa Indonesia dan Inggris.</p>
              </div>
              <MiniSkor />
            </a>

            <a className="pb-bento-item lebar" data-muncul="" style={{ "--tunda": "80ms" }} {...tautan(fitur("simulasi"))}>
              <div className="teks">
                <span className="pb-tag pro">Pro</span>
                <h3>
                  <Mic size={17} /> Simulasi interview bersuara
                </h3>
                <p>Latihan ngobrol langsung dengan pewawancara AI. Di akhir sesi, kamu dapat nilai dan masukan untuk tiap jawaban.</p>
                <span className="go">Mulai dari {rupiah(SEMUA_TIER[2].harga)} <ArrowRight size={15} /></span>
              </div>
              <MiniSuara />
            </a>
          </div>

          <div className="pb-bento-kecil" data-muncul="">
            <a {...tautan(fitur("linkedinbuilder"))}>
              <FilePlus2 size={16} /> LinkedIn Builder
            </a>
            <a {...tautan(fitur("pindahkarier"))}>
              <BarChart3 size={16} /> Pindah karier <span className="pb-tag pro">Pro</span>
            </a>
            <a {...tautan(fitur("applications"))}>
              <MessageSquareQuote size={16} /> Pelacak lamaran
            </a>
            <a {...tautan("/kalkulator-gaji")}>
              <Globe size={16} /> Kalkulator gaji USD
            </a>
          </div>
        </div>
      </section>

      {/* ================================================ per kota */}
      <section className="pb-section tint">
        <div className="pb-wrap">
          <div className="pb-head" data-muncul="">
            <div>
              <span className="pb-label">Lokasi</span>
              <h2>Cari di kota tujuanmu</h2>
            </div>
          </div>
          <div className="pb-cities-grid" data-muncul="">
            <a className="pb-city" {...tautan("/remote")}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "inherit", fontSize: 14.5, fontWeight: 600 }}>
                <Globe size={16} /> Remote
              </span>
              {!loading && <span>{angka(data.jumlahRemote)}</span>}
            </a>
            {(data.kotaTeratas.length ? data.kotaTeratas : KOTA_POPULER.slice(0, 11).map((k) => [k, null])).map(
              ([k, n]) => (
                <a key={k} className="pb-city" {...tautan(`/loker?kota=${encodeURIComponent(k)}`)}>
                  {k}
                  {n != null && <span>{angka(n)}</span>}
                </a>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ============================================ kalkulator mini */}
      <section className="pb-section">
        <div className="pb-wrap pb-calc-teaser">
          <div data-muncul="">
            <span className="pb-label">Kalkulator gaji</span>
            <h2 className="pb-h2">Ditawari gaji dalam dolar? Cek dulu berapa rupiahnya.</h2>
            <p className="pb-sub">
              Hitung gaji per jam sampai per tahun, sudah dipotong biaya platform
              dan transfer. Kursnya ikut kurs hari ini, atau bisa kamu ganti
              dengan kurs bankmu sendiri.
            </p>
            <a className="pb-link" style={{ marginTop: 20 }} {...tautan("/kalkulator-gaji")}>
              Buka kalkulator lengkap <ArrowRight size={15} />
            </a>
          </div>
          <div data-muncul="" style={{ "--tunda": "100ms" }}>
            <KalkulatorMini />
          </div>
        </div>
      </section>

      {/* =================================================== langkah */}
      <section className="pb-section tint">
        <div className="pb-wrap">
          <div className="pb-head" data-muncul="">
            <div>
              <span className="pb-label">Cara kerja</span>
              <h2>Dari cari loker sampai lamaran terkirim</h2>
            </div>
          </div>
          <ol className="pb-steps" data-muncul="">
            <li>
              <h3>Cari lowongan</h3>
              <p>Cari berdasarkan posisi, kota, atau jenis kerja. Setiap loker mencantumkan sumber dan tanggal tayangnya.</p>
            </li>
            <li>
              <h3>Siapkan lamaranmu</h3>
              <p>Pastikan lokernya asli, bandingkan gajinya, rapikan CV, lalu latihan menjawab pertanyaan yang paling sulit.</p>
            </li>
            <li>
              <h3>Lamar di sumbernya</h3>
              <p>Tombol Lamar langsung membuka halaman loker aslinya. Jangan lupa catat lamaranmu supaya mudah dipantau.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ===================================================== harga */}
      <section className="pb-section" id="harga">
        <div className="pb-wrap">
          <div className="pb-head" data-muncul="">
            <div>
              <span className="pb-label">Harga</span>
              <h2>Mulai gratis. Buka semuanya mulai {rupiah(SEMUA_TIER[1].harga)}.</h2>
              <p>
                Akun gratis membuka {angka(BATAS_GRATIS)} loker
                {terkunci ? ` dari ${angka(total)}` : ""}. Paket berbayar cukup sekali bayar, tanpa
                langganan otomatis, dan membuka semua loker.
              </p>
            </div>
          </div>
          <div className="pb-prices">
            {SEMUA_TIER.map((p, i) => (
              <div key={p.id} className={`pb-price ${p.populer ? "rek" : ""}`} data-muncul="" style={{ "--tunda": `${i * 70}ms` }}>
                <div className="pb-price-top">
                  <h3>{p.nama}</h3>
                  {p.populer && <span className="pb-tag">Rekomendasi</span>}
                </div>
                <div className="amt">{rupiah(p.harga)}</div>
                <div className="per">{p.selamanya ? "selamanya" : `sekali bayar · berlaku ${labelDurasi(p.durasiHari)}`}</div>
                <ul>
                  {p.fitur.map((f) =>
                    f.endsWith(":") ? (
                      <li key={f} style={{ display: "block", fontWeight: 600, color: "var(--ink)" }}>
                        {f}
                      </li>
                    ) : (
                      <li key={f}>
                        <Check size={15} />
                        <span>{f}</span>
                      </li>
                    ),
                  )}
                </ul>
                <a
                  className={`pb-btn ${p.populer ? "pb-btn-primary" : "pb-btn-outline"}`}
                  {...tautan(p.harga === 0 ? (masuk ? "/loker" : "/register") : masuk ? "/dashboard/paket" : "/register")}
                >
                  {p.harga === 0 ? (masuk ? "Cari loker" : "Daftar gratis") : `Pilih ${p.nama}`}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================ komunitas */}
      <BagianKomunitas />

      {/* ======================================================= FAQ */}
      <section className="pb-section tint">
        <div className="pb-wrap pb-split">
          <div className="pb-split-aside" data-muncul="">
            <span className="pb-label">FAQ</span>
            <h2 className="pb-h2">Pertanyaan yang sering diajukan</h2>
            <p className="pb-sub">Belum menemukan jawabannya? Lihat daftar lengkapnya.</p>
            <a className="pb-link" style={{ marginTop: 18 }} {...tautan("/faq")}>
              Semua pertanyaan <ArrowRight size={15} />
            </a>
          </div>
          <DaftarFaq items={FAQ_BERANDA} />
        </div>
      </section>

      {elemenToast}
    </PublicLayout>
  );
}
