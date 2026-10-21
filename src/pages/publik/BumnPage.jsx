import React, { useEffect, useState } from "react";
import { Search, X, Landmark, ShieldCheck, FileCheck2, CalendarClock, ArrowRight } from "lucide-react";
import { PublicLayout, useToast } from "../../components/publik/PublicLayout";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { KartuKunci, InfoKuotaLoker } from "../../components/publik/LokerTerkunci";
import { useJobs } from "../../context/JobsContext";
import { useDaftarLoker, useTunda } from "../../hooks/useLoker";
import { BUMN_POPULER, KET_BUMN } from "../../data/bumn";
import { tautan } from "../../utils/navigasi";
import { useHitungNaik, usePintasanCari } from "../../utils/interaksi";
import { lokal, t } from "../../i18n.js";

function Angka({ nilai, loading }) {
  const ref = useHitungNaik(loading ? NaN : nilai);
  return <b ref={ref}>{loading ? "…" : "0"}</b>;
}

export function BumnPage() {
  const { statistik: st, loading: memuatStat } = useJobs();
  const [toast, elemenToast] = useToast();
  const [q, setQ] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  const [pt, setPt] = useState("");
  usePintasanCari("cari-bumn");

  useEffect(() => {
    document.title = t("Loker BUMN · Jobly", "State-owned enterprise jobs · Jobly");
  }, []);

  const kata = useTunda(q, 350);
  const { jobs: hasil, total, terkunci, loading, adaLagi, memuatLagi, muatLagi } = useDaftarLoker({ q: kata.trim(), pt, bumn: true });

  return (
    <PublicLayout aktif="/bumn">
      <section className="pb-remote-hero pb-bumn-hero">
        <div className="pb-wrap">
          <div className="pb-remote-in">
            <div>
              <span className="pb-label">{t("Loker BUMN", "State-owned enterprise jobs")}</span>
              <h1>
                {t("Fokus ke BUMN.", "Focus on state-owned firms.")} <span>{t("Semua lowongannya di satu tempat.", "Every opening in one place.")}</span>
              </h1>
              <p>{KET_BUMN}</p>
              <label className="pb-input" style={{ maxWidth: 520, marginTop: 22 }}>
                <Search size={17} color="var(--muted)" aria-hidden="true" />
                <span className="pb-sr">{t("Cari loker BUMN", "Search state-owned enterprise jobs")}</span>
                <input
                  id="cari-bumn"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("Posisi, mis. engineer, admin, management trainee", "Role, e.g. engineer, admin, management trainee")}
                  autoComplete="off"
                />
                {q && (
                  <button type="button" onClick={() => setQ("")} aria-label={t("Hapus pencarian", "Clear search")} className="pb-input-x">
                    <X size={16} />
                  </button>
                )}
              </label>
            </div>
            <div className="pb-bumn-hias" aria-hidden="true">
              <span className="pb-bumn-gedung">
                <Landmark size={58} strokeWidth={1.3} />
              </span>
              {BUMN_POPULER.slice(0, 6).map(([nama], i) => (
                <span key={nama} className={`pb-bumn-chip c${i + 1}`}>
                  {nama}
                </span>
              ))}
            </div>
          </div>
          <div className="pb-remote-stat">
            <div>
              <Angka nilai={st.bumn || 0} loading={memuatStat} />
              <span>{t("loker BUMN & anak usaha", "state-owned & subsidiary jobs")}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-wrap" style={{ paddingTop: 28 }}>
        {!loading && <InfoKuotaLoker />}
        <div className="pb-chips" style={{ marginBottom: 16 }}>
          <button type="button" className={`pb-chip ${!pt ? "on" : ""}`} onClick={() => setPt("")}>
            {t("Semua BUMN", "All")}
          </button>
          {BUMN_POPULER.map(([nama, kunci]) => (
            <button key={kunci} type="button" className={`pb-chip ${pt === kunci ? "on" : ""}`} onClick={() => setPt(pt === kunci ? "" : kunci)}>
              {nama}
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
              <h3>{t("Belum ada loker BUMN yang cocok", "No matching jobs yet")}</h3>
              <p style={{ margin: 0 }}>{t("Coba kata kunci lain atau pilih “Semua BUMN”.", "Try another keyword or choose “All”.")}</p>
            </div>
          )}
        </div>
        {!loading && adaLagi && (
          <div className="pb-more">
            <button type="button" className="pb-btn pb-btn-outline" onClick={muatLagi} disabled={memuatLagi}>
              {memuatLagi ? t("Memuat…", "Loading…") : t("Lihat lebih banyak", "Show more")}
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
              <span className="pb-label">{t("Sebelum melamar ke BUMN", "Before applying to a state-owned firm")}</span>
              <h2>{t("Tiga hal yang perlu kamu tahu", "Three things you should know")}</h2>
            </div>
          </div>
          <div className="pb-tips">
            <div className="pb-tip" data-muncul="">
              <span className="pb-ficon">
                <CalendarClock size={20} />
              </span>
              <h3>{t("Pantau Rekrutmen Bersama BUMN", "Watch the joint BUMN recruitment")}</h3>
              <p>
                {t(
                  "Banyak BUMN membuka lowongan sekaligus lewat Rekrutmen Bersama BUMN. Jadwal dan syaratnya diumumkan di situs resmi Kementerian BUMN.",
                  "Many state-owned firms recruit together through the joint BUMN recruitment. Dates and requirements are announced on the ministry's official site.",
                )}
              </p>
            </div>
            <div className="pb-tip" data-muncul="" style={{ "--tunda": "80ms" }}>
              <span className="pb-ficon">
                <FileCheck2 size={20} />
              </span>
              <h3>{t("Siapkan tes seleksinya", "Prepare for the selection tests")}</h3>
              <p>
                {t(
                  "Seleksi BUMN biasanya berlapis: administrasi, tes kemampuan dasar, tes kepribadian, wawancara, lalu tes kesehatan. Latih interview dan CV-mu lebih awal.",
                  "BUMN selection usually has several stages: screening, aptitude tests, personality tests, interviews, then a medical. Practise your interview and CV early.",
                )}
              </p>
              <a className="pb-link" {...tautan("/dashboard/interview")}>
                {t("Latihan interview", "Interview practice")} <ArrowRight size={14} />
              </a>
            </div>
            <div className="pb-tip" data-muncul="" style={{ "--tunda": "160ms" }}>
              <span className="pb-ficon">
                <ShieldCheck size={20} />
              </span>
              <h3>{t("Rekrutmen BUMN tidak dipungut biaya", "BUMN recruitment is free")}</h3>
              <p>
                {t(
                  "Lowongan atas nama BUMN yang meminta transfer untuk tes, tiket, atau penginapan hampir pasti penipuan. Cek dulu jika ragu.",
                  "A job in a state-owned firm's name that asks you to pay for tests, tickets, or lodging is almost certainly a scam. Check first if unsure.",
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
