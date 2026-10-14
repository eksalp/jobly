import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, Globe, Clock, Calculator, ShieldCheck, ArrowRight, X } from "lucide-react";
import { PublicLayout, useToast } from "../../components/publik/PublicLayout";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { KartuKunci, InfoKuotaLoker } from "../../components/publik/LokerTerkunci";
import { useJobs } from "../../context/JobsContext";
import { useDaftarLoker, useTunda } from "../../hooks/useLoker";
import { tautan } from "../../utils/navigasi";
import { useHitungNaik, useMuatOtomatis, usePintasanCari } from "../../utils/interaksi";
import { lokal, t } from "../../i18n.js";


const SARING = [
  ["semua", t("Semua remote", "All remote")],
  ["asing", t("Gaji mata uang asing", "Paid in foreign currency")],
  ["full-time", "Full time"],
  ["freelance", "Freelance"],
  ["kontrak", t("Kontrak", "Contract")],
  ["hybrid", "Hybrid"],
];

// Jam sekarang di beberapa kota — mengingatkan soal beda zona waktu
const KOTA_JAM = [
  ["Jakarta", "Asia/Jakarta"],
  [t("Singapura", "Singapore"), "Asia/Singapore"],
  ["London", "Europe/London"],
];
const jamDi = (zona) => {
  try {
    return new Date().toLocaleTimeString(lokal(), { hour: "2-digit", minute: "2-digit", timeZone: zona });
  } catch {
    return "";
  }
};


function Angka({ nilai, loading }) {
  const ref = useHitungNaik(loading ? NaN : nilai);
  return <b ref={ref}>{loading ? "…" : "0"}</b>;
}

export function RemotePage() {
  const { statistik: st, loading: memuatStat } = useJobs();
  const [toast, elemenToast] = useToast();
  const [saring, setSaring] = useState("semua");
  // ?q=... dari tautan lain (mis. tombol di halaman Panduan)
  const [q, setQ] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  const sentinel = useRef(null);
  usePintasanCari("cari-remote");

  useEffect(() => {
    document.title = t("Loker remote · Jobly", "Remote jobs · Jobly");
  }, []);

  const kata = useTunda(q, 350);
  const filter = {
    q: kata.trim(),
    lokasi: saring === "hybrid" ? "hybrid" : "remote",
    asing: saring === "asing",
    tipe: ["full-time", "freelance", "kontrak"].includes(saring) ? saring : "",
  };
  const { jobs: hasil, total, terkunci, loading, adaLagi, memuatLagi, muatLagi } = useDaftarLoker(filter);
  useMuatOtomatis(sentinel, !loading && adaLagi && !memuatLagi, muatLagi);

  const statistik = { total: st.remote || 0, asing: st.remoteAsing || 0, baru: st.baru7 || 0 };

  return (
    <PublicLayout aktif="/remote">
      <section className="pb-remote-hero">
        <div className="pb-wrap">
          <div className="pb-remote-in">
            <div>
              <span className="pb-label">{t("Loker remote", "Remote jobs")}</span>
              <h1>
                {t("Kerja dari mana saja.", "Work from anywhere.")} <span>{t("Gaji tetap jalan.", "Still get paid.")}</span>
              </h1>
              <p>
                {t(
                  "Loker remote dan hybrid dari perusahaan Indonesia dan luar negeri, diperbarui setiap hari. Sebagian dibayar dalam dolar, jadi cek dulu nilainya dalam rupiah sebelum melamar.",
                  "Remote and hybrid jobs from Indonesian and overseas companies, updated every day. Some pay in dollars, so check the rupiah value before you apply.",
                )}
              </p>
              <label className="pb-input" style={{ maxWidth: 520, marginTop: 22 }}>
                <Search size={17} color="var(--muted)" aria-hidden="true" />
                <span className="pb-sr">{t("Cari loker remote", "Search remote jobs")}</span>
                <input
                  id="cari-remote"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("Posisi atau skill, mis. developer, desain, customer support", "Role or skill, e.g. developer, design, customer support")}
                  autoComplete="off"
                />
                {q && (
                  <button type="button" onClick={() => setQ("")} aria-label={t("Hapus pencarian", "Clear search")} className="pb-input-x">
                    <X size={16} />
                  </button>
                )}
              </label>
            </div>
            <div className="pb-remote-globe" aria-hidden="true">
              <div className="orbit o1" />
              <div className="orbit o2" />
              <div className="orbit o3" />
              <Globe size={64} strokeWidth={1.2} />
              {KOTA_JAM.map(([kota, zona], i) => (
                <span key={kota} className={`titik t${i + 1}`}>
                  {kota} <b>{jamDi(zona)}</b>
                </span>
              ))}
            </div>
          </div>
          <div className="pb-remote-stat">
            <div>
              <Angka nilai={statistik.total} loading={memuatStat} />
              <span>{t("loker full remote", "fully remote jobs")}</span>
            </div>
            <div>
              <Angka nilai={statistik.asing} loading={memuatStat} />
              <span>{t("bergaji mata uang asing", "paid in foreign currency")}</span>
            </div>
            <div>
              <Angka nilai={Object.keys(st.sumber || {}).length} loading={memuatStat} />
              <span>{t("sumber loker", "job sources")}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-wrap" style={{ paddingTop: 28 }}>
        {!loading && <InfoKuotaLoker />}
        <div className="pb-chips" style={{ marginBottom: 16 }}>
          {SARING.map(([id, l]) => (
            <button key={id} type="button" className={`pb-chip ${saring === id ? "on" : ""}`} onClick={() => setSaring(id)}>
              {l}
            </button>
          ))}
        </div>
        <div className="pb-result">
          <span>{loading ? t("Memuat lowongan…", "Loading jobs…") : <><b>{(total ?? 0).toLocaleString(lokal())}</b> {t("lowongan", "jobs")}</>}</span>
        </div>
        <div className="pb-grid">
          {loading && Array.from({ length: 8 }, (_, i) => <KartuLokerSkeleton key={i} />)}
          {!loading && hasil.map((j) => <KartuLoker key={j.id} job={j} onToast={toast} />)}
          {memuatLagi && Array.from({ length: 4 }, (_, i) => <KartuLokerSkeleton key={`m${i}`} />)}
          {!loading && hasil.length === 0 && (
            <div className="pb-empty">
              <h3>{t("Belum ada loker remote yang cocok", "No matching remote jobs yet")}</h3>
              <p style={{ margin: 0 }}>{t("Coba kata kunci lain atau pilih “Semua remote”.", "Try another keyword or choose “All remote”.")}</p>
            </div>
          )}
        </div>
        {!loading && adaLagi && (
          <div className="pb-more" ref={sentinel}>
            <button type="button" className="pb-btn pb-btn-outline" onClick={muatLagi} disabled={memuatLagi}>
              {memuatLagi ? t("Memuat…", "Loading…") : t("Muat lebih banyak", "Load more")}
            </button>
          </div>
        )}
        {!loading && !adaLagi && terkunci > 0 && (
          <div className="pb-grid" style={{ marginTop: 18 }}>
            <KartuKunci jumlah={terkunci} />
          </div>
        )}
      </div>

      <section className="pb-section tint" style={{ marginTop: 56 }}>
        <div className="pb-wrap">
          <div className="pb-head">
            <div>
              <span className="pb-label">{t("Sebelum melamar remote", "Before applying remotely")}</span>
              <h2>{t("Tiga hal yang sering dilupakan", "Three things people often forget")}</h2>
            </div>
          </div>
          <div className="pb-tips">
            <div className="pb-tip" data-muncul="">
              <span className="pb-ficon">
                <Clock size={20} />
              </span>
              <h3>{t("Zona waktu", "Time zones")}</h3>
              <p>
                {t(
                  "Tim di Eropa atau Amerika bisa berarti rapat malam hari WIB. Tanyakan jam kerja inti sejak interview pertama.",
                  "A team in Europe or the US can mean late-night meetings in Indonesia. Ask about core hours in the first interview.",
                )}
              </p>
            </div>
            <div className="pb-tip" data-muncul="" style={{ "--tunda": "80ms" }}>
              <span className="pb-ficon">
                <Calculator size={20} />
              </span>
              <h3>{t("Nilai bersih dalam rupiah", "Take-home pay in rupiah")}</h3>
              <p>
                {t(
                  "Gaji dolar terpotong biaya platform dan transfer. Hitung nilai bersihnya sebelum menyebut angka.",
                  "Dollar pay loses some to platform and transfer fees. Work out the net amount before you name a number.",
                )}
              </p>
              <a className="pb-link" {...tautan("/kalkulator-gaji")}>
                {t("Kalkulator gaji", "Salary calculator")} <ArrowRight size={14} />
              </a>
            </div>
            <div className="pb-tip" data-muncul="" style={{ "--tunda": "160ms" }}>
              <span className="pb-ficon">
                <ShieldCheck size={20} />
              </span>
              <h3>{t("Waspada “kerja dari HP”", "Beware “work from your phone”")}</h3>
              <p>
                {t(
                  "Remote sungguhan tidak meminta deposit, like & subscribe, atau biaya pelatihan. Periksa dulu kalau ragu.",
                  "Real remote jobs never ask for deposits, like-and-subscribe tasks, or training fees. Check first if you're unsure.",
                )}
              </p>
              <a className="pb-link" {...tautan("/cek-loker")}>
                {t("Cek loker palsu", "Fake job checker")} <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
      {elemenToast}
    </PublicLayout>
  );
}
