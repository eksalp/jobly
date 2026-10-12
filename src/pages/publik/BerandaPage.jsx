import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  ArrowRight,
  Check,
  Bookmark,
  FilePlus2,
  Linkedin,
  MessageSquareQuote,
  FileSearch,
  Route,
  Mic,
  Globe,
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
import { useJobs } from "../../context/JobsContext";
import { useAuth } from "../../context/AuthContext";
import { SEMUA_TIER, rupiah, labelDurasi } from "../../data/paket";
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

export function BerandaPage() {
  const { jobs, loading } = useJobs();
  const { session } = useAuth();
  const masuk = Boolean(session);
  const [q, setQ] = useState("");
  const [kota, setKota] = useState("");
  const [toast, elemenToast] = useToast();
  useGulirKeHash(!loading);

  const fitur = (panel) => (masuk ? `/dashboard/${panel}` : "/register");

  const data = useMemo(() => {
    const urut = [...jobs].sort((a, b) => waktuDari(b) - waktuDari(a));
    const seminggu = Date.now() - 7 * 86400000;
    const perusahaan = new Set();
    const perKota = new Map();
    let baru = 0;
    let remote = 0;
    for (const j of jobs) {
      perusahaan.add(j.perusahaan);
      if (waktuDari(j) >= seminggu) baru++;
      if (j.lokasiKerja === "remote") remote++;
      const lok = (j.lokasi || "").toLowerCase();
      for (const k of KOTA_POPULER) {
        if (lok.includes(k.toLowerCase())) perKota.set(k, (perKota.get(k) || 0) + 1);
      }
    }
    const kotaTeratas = [...perKota.entries()].sort((a, b) => b[1] - a[1]).slice(0, 11);
    return {
      terbaru: urut.slice(0, 8),
      ringkas: urut.slice(0, 5),
      total: jobs.length,
      baru,
      remote,
      perusahaan: perusahaan.size,
      kotaTeratas,
    };
  }, [jobs]);

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

  const ALAT = [
    { t: "Cari & simpan loker", d: "Saring per kota, remote, dan jenis kerja. Simpan yang menarik dan catat progres lamaranmu.", path: "/loker", Ikon: Bookmark },
    { t: "CV Builder", d: "Susun CV rapi yang mudah dibaca sistem penyaringan, lalu unduh dalam PDF.", path: fitur("cvbuilder"), Ikon: FilePlus2 },
    { t: "LinkedIn Builder", d: "Rapikan headline, ringkasan, dan pengalaman agar profilmu mudah ditemukan recruiter.", path: fitur("linkedinbuilder"), Ikon: Linkedin },
    { t: "Latihan interview", d: "100+ pertanyaan yang sering menjebak dalam 10 kategori, lengkap dengan cara menjawabnya.", path: fitur("interview"), Ikon: MessageSquareQuote },
    { t: "Review CV dengan AI", d: "Skor kesesuaian ATS, bagian yang melemahkan CV, dan versi perbaikan dalam dua bahasa.", path: fitur("overview"), Ikon: FileSearch, pro: true },
    { t: "Pindah karier", d: "Lihat skill mana yang masih terpakai di bidang baru, apa yang perlu dikejar, dan seberapa realistis.", path: fitur("pindahkarier"), Ikon: Route, pro: true },
    { t: "Simulasi interview", d: "Wawancara lewat suara dengan pewawancara AI, lalu dapat penilaian dan masukan di akhir sesi.", path: fitur("simulasi"), Ikon: Mic, pro: true },
  ];

  return (
    <PublicLayout aktif="/">
      {/* ======================================================= hero */}
      <section className="pb-wrap pb-hero">
        <div>
          <h1>
            Semua lowongan, <span>langsung dari sumbernya.</span>
          </h1>
          <p className="pb-lede">
            Jobly mengumpulkan lowongan dari situs karier resmi perusahaan,
            LinkedIn, dan Indeed setiap hari. Cari tanpa daftar, buka detail
            lengkapnya, lalu lamar di halaman aslinya.
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
              <b>{loading ? "…" : angka(data.total)}</b>
              <span>lowongan</span>
            </div>
            <div>
              <b>{loading ? "…" : angka(data.baru)}</b>
              <span>baru 7 hari</span>
            </div>
            <div>
              <b>{loading ? "…" : angka(data.perusahaan)}</b>
              <span>perusahaan</span>
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
              : data.ringkas.map((j) => {
                  const logo = logoPerusahaan(j);
                  return (
                    <li key={j.id}>
                      <a {...tautan(`/loker/${String(j.id).replace(":", "-")}`)}>
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

      {/* ============================================ lowongan terbaru */}
      <section className="pb-section" style={{ paddingTop: 24 }}>
        <div className="pb-wrap">
          <div className="pb-head">
            <div>
              <span className="pb-label">Lowongan terbaru</span>
              <h2>Baru masuk dari berbagai sumber</h2>
            </div>
            <a className="pb-link" {...tautan("/loker")}>
              Lihat semua <ArrowRight size={15} />
            </a>
          </div>
          <div className="pb-grid">
            {loading
              ? Array.from({ length: 8 }, (_, i) => <KartuLokerSkeleton key={i} />)
              : data.terbaru.map((j) => <KartuLoker key={j.id} job={j} onToast={toast} />)}
          </div>
        </div>
      </section>

      {/* ================================================ per kota */}
      <section className="pb-section tint">
        <div className="pb-wrap">
          <div className="pb-head">
            <div>
              <span className="pb-label">Lokasi</span>
              <h2>Cari di kota tujuanmu</h2>
            </div>
          </div>
          <div className="pb-cities-grid">
            <a className="pb-city" {...tautan("/loker?lokasi=remote")}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "inherit", fontSize: 14.5, fontWeight: 600 }}>
                <Globe size={16} /> Remote
              </span>
              {!loading && <span>{angka(data.remote)}</span>}
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

      {/* ================================================== fitur */}
      <section className="pb-section" id="fitur">
        <div className="pb-wrap pb-split">
          <div className="pb-split-aside">
            <span className="pb-label">Alat persiapan</span>
            <h2 className="pb-h2">Lebih siap sebelum menekan tombol lamar.</h2>
            <p className="pb-sub">
              Mencari loker hanya separuh pekerjaan. Jobly juga menyediakan alat
              untuk menyusun CV, merapikan LinkedIn, dan berlatih interview.
            </p>
            <div className="pb-note">
              <b>Gratis selamanya:</b> semua loker, CV Builder, LinkedIn Builder,
              latihan 100+ pertanyaan, loker tersimpan, dan pelacak lamaran.
              Fitur bertanda <span className="pb-tag pro">Pro</span> memakai
              kuota dari paket berbayar, mulai {rupiah(SEMUA_TIER[1].harga)}.
            </div>
          </div>
          <ul className="pb-flist">
            {ALAT.map(({ t, d, path, Ikon, pro }) => (
              <li key={t}>
                <a {...tautan(path)}>
                  <span className="pb-ficon">
                    <Ikon size={20} />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <h3>
                      {t}
                      <span className={`pb-tag ${pro ? "pro" : ""}`}>{pro ? "Pro" : "Gratis"}</span>
                    </h3>
                    <p>{d}</p>
                  </span>
                  <ArrowRight size={18} className="go" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================ kalkulator mini */}
      <section className="pb-section tint">
        <div className="pb-wrap pb-calc-teaser">
          <div>
            <span className="pb-label">Kalkulator gaji</span>
            <h2 className="pb-h2">Ditawari gaji dalam dolar? Hitung dulu nilainya dalam rupiah.</h2>
            <p className="pb-sub">
              Kalkulator lengkap menghitung tarif per jam sampai per tahun,
              memotong biaya platform dan transfer, dan memakai kurs referensi
              harian — atau kurs bankmu sendiri.
            </p>
            <a className="pb-link" style={{ marginTop: 20 }} {...tautan("/kalkulator-gaji")}>
              Buka kalkulator lengkap <ArrowRight size={15} />
            </a>
          </div>
          <KalkulatorMini />
        </div>
      </section>

      {/* =================================================== langkah */}
      <section className="pb-section">
        <div className="pb-wrap">
          <div className="pb-head">
            <div>
              <span className="pb-label">Cara kerja</span>
              <h2>Dari pencarian sampai lamaran terkirim</h2>
            </div>
          </div>
          <ol className="pb-steps">
            <li>
              <h3>Temukan lowongan</h3>
              <p>Cari berdasarkan posisi, kota, atau jenis kerja. Setiap lowongan menampilkan sumber dan tanggalnya.</p>
            </li>
            <li>
              <h3>Siapkan lamaranmu</h3>
              <p>Sesuaikan CV, cek kekuatannya, dan latih jawaban untuk pertanyaan yang paling sering muncul.</p>
            </li>
            <li>
              <h3>Lamar di sumbernya</h3>
              <p>Tombol Lamar membawamu ke halaman lowongan aslinya. Catat lamaranmu di Jobly untuk memantau progres.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ===================================================== harga */}
      <section className="pb-section tint" id="harga">
        <div className="pb-wrap">
          <div className="pb-head">
            <div>
              <span className="pb-label">Harga</span>
              <h2>Gratis untuk mencari. Bayar hanya saat butuh AI.</h2>
              <p>Sekali bayar, tanpa tagihan berulang. Kuota Review CV tetap bisa dipakai setelah masa berlaku habis.</p>
            </div>
          </div>
          <div className="pb-prices">
            {SEMUA_TIER.map((p) => (
              <div key={p.id} className={`pb-price ${p.populer ? "rek" : ""}`}>
                <div className="pb-price-top">
                  <h3>{p.nama}</h3>
                  {p.populer && <span className="pb-tag">Paling dipilih</span>}
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

      {/* ======================================================= FAQ */}
      <section className="pb-section">
        <div className="pb-wrap pb-split">
          <div className="pb-split-aside">
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
