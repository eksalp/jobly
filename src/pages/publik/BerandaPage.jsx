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
import { labelTampil } from "../../data/taxonomy";
import { infoSumber, urlDetail } from "../../utils/sumberLoker";
import { usePetaGaji } from "../../hooks/useLoker";
import { SEMUA_TIER, rupiah, labelDurasi } from "../../data/paket";
import { BATAS_GRATIS } from "../../context/JobsContext";
import { FAQ_BERANDA } from "../../data/faq";
import { keHalaman, tautan } from "../../utils/navigasi";
import { logoPerusahaan, waktuRelatif, kotaDari } from "../../utils/sumberLoker";
import { useKurs, rupiahPenuh, formatWaktuKurs } from "../../utils/kurs";
import { keTahunan } from "../../utils/hitungGaji";
import { lokal, t } from "../../i18n.js";

const POPULER = [
  ["Remote", "/loker?lokasi=remote"],
  [t("Magang", "Internship"), "/loker?tipe=magang"],
  ["Fresh graduate", "/loker?q=fresh%20graduate"],
  ["Admin", "/loker?q=admin"],
  ["Finance", "/loker?q=finance"],
  ["IT", "/loker?q=engineer"],
];

const waktuDari = (j) => {
  const w = j.tanggal ? new Date(j.tanggal).getTime() : 0;
  return Number.isFinite(w) ? w : 0;
};
const angka = (n) => Number(n || 0).toLocaleString(lokal());

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
        <span>{t("Gaji dalam dolar AS", "Salary in US dollars")}</span>
        <div className="pb-input">
          <input id="mini-usd" inputMode="decimal" value={teks} onChange={(e) => setTeks(e.target.value)} />
          <span className="unit">USD</span>
        </div>
      </label>
      <div className="pb-seg" role="group" aria-label={t("Periode gaji", "Pay period")}>
        {[
          ["jam", t("Per jam", "Hourly")],
          ["bulan", t("Per bulan", "Monthly")],
          ["tahun", t("Per tahun", "Yearly")],
        ].map(([id, l]) => (
          <button key={id} type="button" className={periode === id ? "on" : ""} aria-pressed={periode === id} onClick={() => setPeriode(id)}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--line2)", paddingTop: 16 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink2)" }}>{t("Setara per bulan", "Monthly equivalent")}</div>
        <div className="pb-big" style={{ marginTop: 4 }}>
          {rupiahPenuh(perBulan)}
        </div>
        <div className="pb-kurs" style={{ marginTop: 6 }}>
          1 USD = {rupiahPenuh(idrPerUsd)} · {live ? t(`kurs ${formatWaktuKurs(waktu) || "hari ini"}`, `rate ${formatWaktuKurs(waktu) || "today"}`) : t("kurs cadangan", "fallback rate")}
          {periode === "jam" ? t(" · 40 jam/minggu", " · 40 hrs/week") : ""}
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
        {t("DIBUKA LOWONGAN PT BESAR!!! Lulusan SMA, gaji 9 jt. Wajib", "HIRING NOW AT PT BESAR!!! High school grads, 9 million salary. You must")}{" "}
        <mark>{t("bayar biaya seragam Rp 350.000", "pay a Rp 350,000 uniform fee")}</mark>, {t("kirim CV ke", "send your CV to")}{" "}
        <mark>hrd.ptbesar@gmail.com</mark>. <mark>{t("Kuota terbatas hari ini", "Limited spots today")}</mark>!
      </div>
      <div className="vonis">
        <ShieldX size={16} /> {t("Bahaya · 3 tanda penipuan", "Danger · 3 scam signs")}
      </div>
    </div>
  );
}

function MiniGaji({ data }) {
  const baris = data.length ? data : [
    { label: t("Teknologi", "Technology"), p25: 9e6, median: 14e6, p75: 22e6 },
    { label: t("Keuangan", "Finance"), p25: 6e6, median: 9e6, p75: 13e6 },
    { label: t("Pemasaran", "Marketing"), p25: 5e6, median: 7.5e6, p75: 11e6 },
    { label: t("Administrasi", "Administration"), p25: 4.5e6, median: 5.5e6, p75: 7e6 },
  ];
  const maks = Math.max(...baris.map((b) => b.p75)) * 1.1;
  return (
    <div className="mv-gaji" aria-hidden="true">
      {baris.map((b, i) => (
        <div key={b.label} style={{ "--i": i }}>
          <span>{labelTampil(b.label)}</span>
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
    const jeda = setInterval(() => setI((x) => (x + 1) % FONT_CV.length), 1800);
    return () => clearInterval(jeda);
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
      <span className="tag">{t("Level neraka", "Hardcore")}</span>
      <p>{t("“Kalau kami bisa merekrut kandidat internal dengan gaji lebih rendah, kenapa harus kamu?”", "“If we could hire an internal candidate for less, why should we pick you?”")}</p>
      <div className="timer">
        <svg viewBox="0 0 36 36" width="34" height="34">
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--bar-bg)" strokeWidth="4" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" strokeDasharray="94" className="putar" transform="rotate(-90 18 18)" />
        </svg>
        <span>{t("2:00 untuk menjawab", "2:00 to answer")}</span>
      </div>
    </div>
  );
}

function MiniRencana() {
  const hari = t("S S R K J S M", "M T W T F S S").split(" ");
  const isi = [2, 1, 3, 0, 2, 1, 0];
  return (
    <div className="mv-rencana" aria-hidden="true">
      <div className="api">
        <Flame size={20} /> <b>{t("5 hari", "5 days")}</b> streak
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
      <small>{t("9 dari 10 lamaran minggu ini", "9 of 10 applications this week")}</small>
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
        <li className="ok">{t("Format terbaca ATS", "ATS-readable format")}</li>
        <li className="ok">{t("Kata kunci posisi", "Role keywords")}</li>
        <li className="no">{t("Pencapaian tanpa angka", "Achievements without numbers")}</li>
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

  const hariIni = new Date().toLocaleDateString(lokal(), {
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
            {t("In this economy, cari kerja itu susah.", "In this economy, job hunting is hard.")}{" "}
            <span>{t("Biar Jobly yang cariin ribuan loker buat kamu.", "Let Jobly find thousands of jobs for you.")}</span>
          </h1>
          <p className="pb-lede">
            {t(
              "Setiap hari Jobly mengumpulkan lowongan dari situs karier perusahaan, BUMN, LinkedIn, dan Indeed. Kamu cukup cari di satu tempat, cek gajinya, lalu lamar langsung ke sumbernya. Gratis.",
              "Every day Jobly collects openings from company career sites, state-owned enterprises, LinkedIn, and Indeed. Search in one place, check the pay, then apply directly at the source. Free.",
            )}
          </p>

          <form className="pb-searchbar" onSubmit={cari} role="search">
            <label>
              <Search size={18} color="var(--muted)" aria-hidden="true" />
              <span className="pb-sr">{t("Posisi atau perusahaan", "Role or company")}</span>
              <input
                id="cari-beranda"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("Posisi, perusahaan, atau skill", "Role, company, or skill")}
                autoComplete="off"
              />
            </label>
            <label>
              <MapPin size={18} color="var(--muted)" aria-hidden="true" />
              <span className="pb-sr">{t("Kota", "City")}</span>
              <select id="kota-beranda" value={kota} onChange={(e) => setKota(e.target.value)}>
                <option value="">{t("Semua kota", "All cities")}</option>
                {KOTA_POPULER.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="pb-btn pb-btn-primary">
              {t("Cari loker", "Find jobs")}
            </button>
          </form>

          <div className="pb-popular">
            <span>{t("Populer:", "Popular:")}</span>
            {POPULER.map(([l, path]) => (
              <a key={l} {...tautan(path)}>
                {l}
              </a>
            ))}
          </div>
        </div>

        <aside className="pb-today" aria-label={t("Ringkasan lowongan hari ini", "Today's job summary")}>
          <div className="pb-today-head">
            {t("Hari ini di Jobly", "Today on Jobly")}
            <time>{hariIni}</time>
          </div>
          <div className="pb-today-stats">
            <div>
              <Angka nilai={total} loading={loading} />
              <span>{t("lowongan", "jobs")}</span>
            </div>
            <div>
              <Angka nilai={data.baru} loading={loading} />
              <span>{t("baru 7 hari", "new in 7 days")}</span>
            </div>
            <div>
              <Angka nilai={data.jumlahSumber} loading={loading} />
              <span>{t("sumber", "sources")}</span>
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
              {t("Lihat semua lowongan", "See all jobs")} <ArrowRight size={15} />
            </a>
          </div>
        </aside>
      </section>

      {/* ============================================ pita sumber */}
      <div className="pb-pita" aria-label={t("Sumber lowongan", "Job sources")}>
        <span className="pb-pita-label">{t("Dikumpulkan dari", "Collected from")}</span>
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
            <History size={15} /> {t("Terakhir kamu lihat", "Recently viewed")}
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
              <span className="pb-label">{t("Lowongan terbaru", "Latest jobs")}</span>
              <h2>{t("Loker yang baru masuk", "Just added")}</h2>
            </div>
            <a className="pb-link" {...tautan("/loker")}>
              {t("Lihat semua", "See all")} <ArrowRight size={15} />
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
                <Globe size={14} /> {t("Khusus remote", "Remote only")}
              </span>
              <h2>{t("Kerja dari rumah, kafe, atau kampung halaman.", "Work from home, a café, or your hometown.")}</h2>
              <p>
                {loading
                  ? t("Memuat…", "Loading…")
                  : t(
                      `${angka(data.jumlahRemote)} loker full remote dari perusahaan Indonesia dan luar negeri. Sebagian dibayar dalam dolar.`,
                      `${angka(data.jumlahRemote)} fully remote jobs from Indonesian and overseas companies. Some pay in dollars.`,
                    )}
              </p>
            </div>
            <a className="pb-btn pb-btn-putih" {...tautan("/remote")}>
              {t("Lihat loker remote", "See remote jobs")} <ArrowRight size={16} />
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
              <span className="pb-label">{t("Kenapa Jobly", "Why Jobly")}</span>
              <h2>{t("Bukan cuma daftar loker.", "More than a job list.")}</h2>
              <p>{t("Semua yang kamu butuhkan buat melamar ada di sini, dan sebagian besar gratis.", "Everything you need to apply is here, and most of it is free.")}</p>
            </div>
          </div>

          <div className="pb-bento">
            <a className="pb-bento-item lebar" data-muncul="" {...tautan("/cek-loker")}>
              <div className="teks">
                <span className="pb-tag baru">{t("Gratis · tanpa daftar", "Free · no sign-up")}</span>
                <h3>{t("Cek loker palsu", "Fake job checker")}</h3>
                <p>{t("Ragu sama loker dari WhatsApp atau Instagram? Tempel teksnya di sini. Jobly akan menandai ciri-ciri penipuan, misalnya minta biaya, pakai travel agent, atau tugas like berbayar.", "Unsure about a job post from WhatsApp or Instagram? Paste it here. Jobly flags common scam signs, like upfront fees, travel agents, or paid like-tasks.")}</p>
                <span className="go">{t("Coba cek sekarang", "Check one now")} <ArrowRight size={15} /></span>
              </div>
              <MiniCek />
            </a>

            <a className="pb-bento-item" data-muncul="" style={{ "--tunda": "80ms" }} {...tautan("/peta-gaji")}>
              <div className="teks">
                <span className="pb-tag baru">{t("Gratis", "Free")}</span>
                <h3>{t("Peta gaji", "Salary map")}</h3>
                <p>{t("Lihat kisaran gaji per bidang dan kota, dihitung dari loker yang benar-benar ada.", "See salary ranges by field and city, calculated from real job posts.")}</p>
              </div>
              <MiniGaji data={gajiMini} />
            </a>

            <a className="pb-bento-item" data-muncul="" {...tautan(fitur("interview"))}>
              <div className="teks">
                <span className="pb-tag">{t("Gratis", "Free")}</span>
                <h3>{t("Latihan interview level neraka", "Hardcore interview practice")}</h3>
                <p>{t("140+ pertanyaan lengkap dengan contoh jawaban, plus mode tantangan dengan batas waktu.", "140+ questions with sample answers, plus a timed challenge mode.")}</p>
              </div>
              <MiniLatihan />
            </a>

            <a className="pb-bento-item" data-muncul="" style={{ "--tunda": "80ms" }} {...tautan(fitur("cvbuilder"))}>
              <div className="teks">
                <span className="pb-tag">{t("Gratis", "Free")}</span>
                <h3>{t("Bikin CV yang lolos ATS", "Build a CV that passes ATS")}</h3>
                <p>{t("Pilih font dan tema sesukamu. PDF-nya tetap rapi dan terbaca oleh sistem penyaring HRD.", "Pick any font and theme. The PDF stays clean and readable by applicant tracking systems.")}</p>
              </div>
              <MiniCv />
            </a>

            <a className="pb-bento-item" data-muncul="" style={{ "--tunda": "160ms" }} {...tautan(fitur("rencana"))}>
              <div className="teks">
                <span className="pb-tag baru">{t("Gratis", "Free")}</span>
                <h3>{t("Rencana lamar", "Application plan")}</h3>
                <p>{t("Pasang target mingguan dan jaga streak harian, supaya kamu tetap rajin melamar.", "Set a weekly target and keep a daily streak so you keep applying.")}</p>
              </div>
              <MiniRencana />
            </a>

            <a className="pb-bento-item" data-muncul="" {...tautan(fitur("overview"))}>
              <div className="teks">
                <span className="pb-tag pro">Pro</span>
                <h3>
                  <FileSearch size={17} /> {t("Review CV dengan AI", "AI CV review")}
                </h3>
                <p>{t("Dapat skor ATS, tahu bagian CV yang masih lemah, plus versi perbaikannya dalam bahasa Indonesia dan Inggris.", "Get an ATS score, see the weak parts of your CV, plus an improved version in Indonesian and English.")}</p>
              </div>
              <MiniSkor />
            </a>

            <a className="pb-bento-item lebar" data-muncul="" style={{ "--tunda": "80ms" }} {...tautan(fitur("simulasi"))}>
              <div className="teks">
                <span className="pb-tag pro">Pro</span>
                <h3>
                  <Mic size={17} /> {t("Simulasi interview bersuara", "Voice mock interview")}
                </h3>
                <p>{t("Latihan ngobrol langsung dengan pewawancara AI. Di akhir sesi, kamu dapat nilai dan masukan untuk tiap jawaban.", "Talk live with an AI interviewer. At the end you get a score and feedback on every answer.")}</p>
                <span className="go">{t("Mulai dari", "From")} {rupiah(SEMUA_TIER[2].harga)} <ArrowRight size={15} /></span>
              </div>
              <MiniSuara />
            </a>
          </div>

          <div className="pb-bento-kecil" data-muncul="">
            <a {...tautan(fitur("linkedinbuilder"))}>
              <FilePlus2 size={16} /> LinkedIn Builder
            </a>
            <a {...tautan(fitur("pindahkarier"))}>
              <BarChart3 size={16} /> {t("Pindah karier", "Career switch")} <span className="pb-tag pro">Pro</span>
            </a>
            <a {...tautan(fitur("applications"))}>
              <MessageSquareQuote size={16} /> {t("Pelacak lamaran", "Application tracker")}
            </a>
            <a {...tautan("/kalkulator-gaji")}>
              <Globe size={16} /> {t("Kalkulator gaji USD", "USD salary calculator")}
            </a>
          </div>
        </div>
      </section>

      {/* ================================================ per kota */}
      <section className="pb-section tint">
        <div className="pb-wrap">
          <div className="pb-head" data-muncul="">
            <div>
              <span className="pb-label">{t("Lokasi", "Location")}</span>
              <h2>{t("Cari di kota tujuanmu", "Search in your city")}</h2>
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
            <span className="pb-label">{t("Kalkulator gaji", "Salary calculator")}</span>
            <h2 className="pb-h2">{t("Ditawari gaji dalam dolar? Cek dulu berapa rupiahnya.", "Offered a salary in dollars? See what it is in rupiah.")}</h2>
            <p className="pb-sub">
              {t(
                "Hitung gaji per jam sampai per tahun, sudah dipotong biaya platform dan transfer. Kursnya ikut kurs hari ini, atau bisa kamu ganti dengan kurs bankmu sendiri.",
                "Work out hourly to yearly pay after platform and transfer fees. It uses today's exchange rate, or you can enter your bank's rate.",
              )}
            </p>
            <a className="pb-link" style={{ marginTop: 20 }} {...tautan("/kalkulator-gaji")}>
              {t("Buka kalkulator lengkap", "Open the full calculator")} <ArrowRight size={15} />
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
              <span className="pb-label">{t("Cara kerja", "How it works")}</span>
              <h2>{t("Dari cari loker sampai lamaran terkirim", "From job search to application sent")}</h2>
            </div>
          </div>
          <ol className="pb-steps" data-muncul="">
            <li>
              <h3>{t("Cari lowongan", "Find a job")}</h3>
              <p>{t("Cari berdasarkan posisi, kota, atau jenis kerja. Setiap loker mencantumkan sumber dan tanggal tayangnya.", "Search by role, city, or job type. Every post shows its source and the date it went live.")}</p>
            </li>
            <li>
              <h3>{t("Siapkan lamaranmu", "Get your application ready")}</h3>
              <p>{t("Pastikan lokernya asli, bandingkan gajinya, rapikan CV, lalu latihan menjawab pertanyaan yang paling sulit.", "Make sure the post is real, compare the pay, polish your CV, then practise the toughest questions.")}</p>
            </li>
            <li>
              <h3>{t("Lamar di sumbernya", "Apply at the source")}</h3>
              <p>{t("Tombol Lamar langsung membuka halaman loker aslinya. Jangan lupa catat lamaranmu supaya mudah dipantau.", "The Apply button opens the original job page. Log your application so it's easy to track.")}</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ===================================================== harga */}
      <section className="pb-section" id="harga">
        <div className="pb-wrap">
          <div className="pb-head" data-muncul="">
            <div>
              <span className="pb-label">{t("Harga", "Pricing")}</span>
              <h2>{t(`Mulai gratis. Buka semuanya mulai ${rupiah(SEMUA_TIER[1].harga)}.`, `Start free. Unlock everything from ${rupiah(SEMUA_TIER[1].harga)}.`)}</h2>
              <p>
                {t(
                  `Akun gratis membuka ${angka(BATAS_GRATIS)} loker${terkunci ? ` dari ${angka(total)}` : ""}. Paket berbayar cukup sekali bayar, tanpa langganan otomatis, dan membuka semua loker.`,
                  `A free account opens ${angka(BATAS_GRATIS)} jobs${terkunci ? ` out of ${angka(total)}` : ""}. Paid plans are a one-time payment, never auto-renew, and unlock every job.`,
                )}
              </p>
            </div>
          </div>
          <div className="pb-prices">
            {SEMUA_TIER.map((p, i) => (
              <div key={p.id} className={`pb-price ${p.populer ? "rek" : ""}`} data-muncul="" style={{ "--tunda": `${i * 70}ms` }}>
                <div className="pb-price-top">
                  <h3>{p.nama}</h3>
                  {p.populer && <span className="pb-tag">{t("Rekomendasi", "Recommended")}</span>}
                </div>
                <div className="amt">{rupiah(p.harga)}</div>
                <div className="per">{p.selamanya ? t("selamanya", "forever") : t(`sekali bayar · berlaku ${labelDurasi(p.durasiHari)}`, `one-time · valid ${labelDurasi(p.durasiHari)}`)}</div>
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
                  {p.harga === 0 ? (masuk ? t("Cari loker", "Find jobs") : t("Daftar gratis", "Sign up free")) : t(`Pilih ${p.nama}`, `Choose ${p.nama}`)}
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
            <h2 className="pb-h2">{t("Pertanyaan yang sering diajukan", "Frequently asked questions")}</h2>
            <p className="pb-sub">{t("Belum menemukan jawabannya? Lihat daftar lengkapnya.", "Didn't find your answer? See the full list.")}</p>
            <a className="pb-link" style={{ marginTop: 18 }} {...tautan("/faq")}>
              {t("Semua pertanyaan", "All questions")} <ArrowRight size={15} />
            </a>
          </div>
          <DaftarFaq items={FAQ_BERANDA} />
        </div>
      </section>

      {elemenToast}
    </PublicLayout>
  );
}
