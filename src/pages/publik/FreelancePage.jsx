import React, { useEffect, useRef, useState } from "react";
import {
  Search, Wallet, FileSignature, ShieldCheck, ArrowRight, X, PenTool, Code2, Video, Megaphone,
  Feather, ClipboardList, Languages, BarChart3, GraduationCap, Camera, TrendingUp, Flame,
} from "lucide-react";
import { PublicLayout, useToast } from "../../components/publik/PublicLayout";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { KartuKunci, InfoKuotaLoker } from "../../components/publik/LokerTerkunci";
import { useDaftarLoker, useTunda } from "../../hooks/useLoker";
import { tautan } from "../../utils/navigasi";
import { useHitungNaik, usePintasanCari } from "../../utils/interaksi";
import { lokal, t } from "../../i18n.js";
import { panggilApi } from "../../utils/apiLoker";
import { BIDANG_FREELANCE } from "../../data/bidangFreelance.js";

const IKON_BIDANG = { PenTool, Feather, Video, Code2, Megaphone, ClipboardList, Languages, BarChart3, GraduationCap, Camera };
const infoBidang = (slug) => BIDANG_FREELANCE.find((b) => b.slug === slug);

const SARING = [
  ["semua", t("Semua freelance", "All freelance")],
  ["asing", t("Bayaran mata uang asing", "Paid in foreign currency")],
];

// Bidang yang sering dicari freelancer — sekali klik mengisi pencarian
const BIDANG = [
  [t("Desain", "Design"), "desain", PenTool],
  [t("Penulis & konten", "Writing & content"), "content writer", Megaphone],
  ["Developer", "developer", Code2],
  [t("Video & editing", "Video & editing"), "video editor", Video],
];

// Kartu proyek yang melayang di sisi kanan hero (hanya hiasan)
const KARTU_HIAS = [
  [PenTool, t("Desain logo", "Logo design"), t("per proyek", "per project")],
  [Megaphone, t("Artikel SEO", "SEO article"), t("per artikel", "per article")],
  [Video, t("Edit video", "Video editing"), t("per video", "per video")],
];

/** Bidang freelance yang paling ramai (dihitung server, cache 1 jam). */
function useTrenFreelance() {
  const [state, setState] = useState({ bidang: [], loading: true });
  useEffect(() => {
    let batal = false;
    panggilApi("tren")
      .then((d) => !batal && setState({ bidang: d?.bidang || [], loading: false }))
      .catch(() => !batal && setState({ bidang: [], loading: false }));
    return () => {
      batal = true;
    };
  }, []);
  return state;
}

function BidangTren({ aktif, onPilih }) {
  const { bidang, loading } = useTrenFreelance();
  if (!loading && !bidang.length) return null;
  const teratas = bidang.slice(0, 6);
  return (
    <section className="pb-fl-tren" aria-labelledby="judul-tren">
      <div className="pb-fl-tren-head">
        <span className="pb-label">
          <Flame size={13} /> {t("Lagi ramai", "Trending")}
        </span>
        <h2 id="judul-tren">{t("Bidang freelance yang paling banyak dicari klien", "Freelance fields clients are hiring for most")}</h2>
        <p>{t("Dihitung dari proyek yang masih dibuka di Jobly. Klik salah satu untuk melihat proyeknya.", "Based on open projects on Jobly. Click one to see its projects.")}</p>
      </div>
      <div className="pb-fl-tren-grid">
        {loading &&
          Array.from({ length: 6 }, (_, i) => <div key={i} className="pb-fl-tren-kartu muat" aria-hidden="true" />)}
        {!loading &&
          teratas.map((b, i) => {
            const info = infoBidang(b.slug);
            if (!info) return null;
            const Ikon = IKON_BIDANG[info.ikon] || PenTool;
            const naik = b.minggu > b.mingguLalu && b.minggu > 0;
            return (
              <button
                key={b.slug}
                type="button"
                className={`pb-fl-tren-kartu ${aktif === b.slug ? "on" : ""}`}
                onClick={() => onPilih(aktif === b.slug ? "" : b.slug)}
                aria-pressed={aktif === b.slug}
              >
                <span className="urut">{i + 1}</span>
                <span className="ikon">
                  <Ikon size={18} />
                </span>
                <span className="isi">
                  <b>{info.nama}</b>
                  <small>
                    {b.total.toLocaleString(lokal())} {t("proyek dibuka", "open projects")}
                    {b.minggu > 0 && (
                      <>
                        {" · "}+{b.minggu.toLocaleString(lokal())} {t("minggu ini", "this week")}
                      </>
                    )}
                  </small>
                </span>
                {naik && (
                  <span className="naik">
                    <TrendingUp size={13} /> {t("Naik", "Rising")}
                  </span>
                )}
              </button>
            );
          })}
      </div>
    </section>
  );
}

function Angka({ nilai, loading }) {
  const ref = useHitungNaik(loading ? NaN : nilai);
  return <b ref={ref}>{loading ? "…" : "0"}</b>;
}

export function FreelancePage() {
  const [toast, elemenToast] = useToast();
  const [saring, setSaring] = useState("semua");
  const [q, setQ] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  const [bidang, setBidang] = useState("");
  const daftarRef = useRef(null);
  const pilihBidang = (slug) => {
    setBidang(slug);
    if (slug) daftarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  usePintasanCari("cari-freelance");

  useEffect(() => {
    document.title = t("Loker freelance · Jobly", "Freelance jobs · Jobly");
  }, []);

  const kata = useTunda(q, 350);
  // Sumber khusus: project data kedua (DB2), hanya yang bertipe freelance
  const filter = {
    db: "db2",
    q: kata.trim(),
    tipe: "freelance",
    bidang,
    asing: saring === "asing",
  };
  const { jobs: hasil, total, terkunci, loading, adaLagi, memuatLagi, muatLagi } = useDaftarLoker(filter);

  // Angka di hero tetap jumlah semua loker freelance, tidak ikut filter
  // (ditambah yang terkunci untuk pengunjung gratis, agar angkanya utuh)
  const semua = useDaftarLoker({ db: "db2", tipe: "freelance" }, { n: 1 });
  const totalSemua = (semua.total ?? 0) + (semua.terkunci ?? 0);
  // Semua freelance di sini dikerjakan online, jadi angkanya sama dengan total
  const totalRemote = totalSemua;
  const memuatSemua = semua.loading;
  const memuatRemote = semua.loading;

  return (
    <PublicLayout aktif="/freelance">
      <section className="pb-remote-hero pb-fl-hero">
        <div className="pb-wrap">
          <div className="pb-remote-in">
            <div>
              <span className="pb-label">{t("Loker freelance", "Freelance jobs")}</span>
              <h1>
                {t("Kerja per proyek.", "Work by the project.")} <span>{t("Atur waktumu sendiri.", "Set your own hours.")}</span>
              </h1>
              <p>
                {t(
                  "Proyek lepas, tugas online, dan kerja sampingan yang bisa dikerjakan dari mana saja. Cocok untuk tambahan penghasilan atau membangun portofolio.",
                  "Freelance projects, online tasks, and side gigs you can do from anywhere. Good for extra income or building a portfolio.",
                )}
              </p>
              <label className="pb-input" style={{ maxWidth: 520, marginTop: 22 }}>
                <Search size={17} color="var(--muted)" aria-hidden="true" />
                <span className="pb-sr">{t("Cari loker freelance", "Search freelance jobs")}</span>
                <input
                  id="cari-freelance"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("Skill atau bidang, mis. desain, penulis, video editor", "Skill or field, e.g. design, writer, video editor")}
                  autoComplete="off"
                />
                {q && (
                  <button type="button" onClick={() => setQ("")} aria-label={t("Hapus pencarian", "Clear search")} className="pb-input-x">
                    <X size={16} />
                  </button>
                )}
              </label>
              <div className="pb-fl-bidang">
                {BIDANG.map(([label, kunci, Ikon]) => (
                  <button key={kunci} type="button" className={q === kunci ? "on" : ""} onClick={() => setQ(q === kunci ? "" : kunci)}>
                    <Ikon size={14} /> {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="pb-fl-hias" aria-hidden="true">
              {KARTU_HIAS.map(([Ikon, judul, satuan], i) => (
                <div key={judul} className={`pb-fl-kartu k${i + 1}`}>
                  <span className="ikon">
                    <Ikon size={16} />
                  </span>
                  <div>
                    <b>{judul}</b>
                    <small>{satuan}</small>
                  </div>
                  <span className="status">{t("Dibuka", "Open")}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pb-remote-stat">
            <div>
              <Angka nilai={totalSemua} loading={memuatSemua} />
              <span>{t("loker freelance", "freelance jobs")}</span>
            </div>
            <div>
              <Angka nilai={totalRemote} loading={memuatRemote} />
              <span>{t("bisa dikerjakan dari rumah", "can be done from home")}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-wrap" style={{ paddingTop: 28 }}>
        <BidangTren aktif={bidang} onPilih={pilihBidang} />
      </div>

      <div className="pb-wrap" ref={daftarRef} style={{ paddingTop: 8, scrollMarginTop: 80 }}>
        {!loading && <InfoKuotaLoker />}
        <div className="pb-chips" style={{ marginBottom: 16 }}>
          {SARING.map(([id, l]) => (
            <button key={id} type="button" className={`pb-chip ${saring === id ? "on" : ""}`} onClick={() => setSaring(id)}>
              {l}
            </button>
          ))}
          {bidang && (
            <button type="button" className="pb-chip on" onClick={() => setBidang("")} aria-label={t("Hapus filter bidang", "Clear field filter")}>
              {infoBidang(bidang)?.nama} <X size={13} style={{ verticalAlign: "-2px" }} />
            </button>
          )}
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
              <h3>{t("Belum ada loker freelance yang cocok", "No matching freelance jobs yet")}</h3>
              <p style={{ margin: 0 }}>{t("Coba kata kunci lain atau pilih “Semua freelance”.", "Try another keyword or choose “All freelance”.")}</p>
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
              <span className="pb-label">{t("Sebelum mengambil proyek", "Before taking a project")}</span>
              <h2>{t("Tiga hal yang melindungi freelancer", "Three things that protect freelancers")}</h2>
            </div>
          </div>
          <div className="pb-tips">
            <div className="pb-tip" data-muncul="">
              <span className="pb-ficon">
                <FileSignature size={20} />
              </span>
              <h3>{t("Lingkup kerja tertulis", "Scope in writing")}</h3>
              <p>
                {t(
                  "Sepakati hasil akhir, jumlah revisi, dan tenggat secara tertulis sebelum mulai. Revisi tanpa batas adalah awal proyek yang merugi.",
                  "Agree on deliverables, number of revisions, and deadlines in writing before you start. Unlimited revisions are how projects lose money.",
                )}
              </p>
            </div>
            <div className="pb-tip" data-muncul="" style={{ "--tunda": "80ms" }}>
              <span className="pb-ficon">
                <Wallet size={20} />
              </span>
              <h3>{t("Minta uang muka", "Ask for a deposit")}</h3>
              <p>
                {t(
                  "Untuk klien baru, uang muka 30–50% adalah hal biasa. Bayaran dolar juga terpotong biaya platform dan transfer, jadi hitung nilai bersihnya.",
                  "With new clients, a 30–50% deposit is normal. Dollar payments also lose some to platform and transfer fees, so work out the net amount.",
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
              <h3>{t("Klien yang meminta bayaran", "Clients who ask you to pay")}</h3>
              <p>
                {t(
                  "Klien sungguhan tidak meminta biaya pendaftaran, deposit, atau pembelian alat. Periksa dulu jika tawarannya terasa janggal.",
                  "Real clients never ask for sign-up fees, deposits, or equipment purchases. Check first if an offer feels off.",
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
