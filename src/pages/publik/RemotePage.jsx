import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, Globe, Clock, Calculator, ShieldCheck, ArrowRight, X } from "lucide-react";
import { PublicLayout, useToast } from "../../components/publik/PublicLayout";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { KartuKunci, InfoKuotaLoker } from "../../components/publik/LokerTerkunci";
import { useJobs } from "../../context/JobsContext";
import { tautan } from "../../utils/navigasi";
import { useHitungNaik, useMuatOtomatis, usePintasanCari } from "../../utils/interaksi";

const PER_MUAT = 24;

const SARING = [
  ["semua", "Semua remote"],
  ["asing", "Gaji mata uang asing"],
  ["full-time", "Full time"],
  ["freelance", "Freelance"],
  ["kontrak", "Kontrak"],
  ["hybrid", "Hybrid"],
];

// Jam sekarang di beberapa kota — mengingatkan soal beda zona waktu
const KOTA_JAM = [
  ["Jakarta", "Asia/Jakarta"],
  ["Singapura", "Asia/Singapore"],
  ["London", "Europe/London"],
];
const jamDi = (zona) => {
  try {
    return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: zona });
  } catch {
    return "";
  }
};

const waktu = (j) => {
  const t = j.tanggal ? new Date(j.tanggal).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
};

function Angka({ nilai, loading }) {
  const ref = useHitungNaik(loading ? NaN : nilai);
  return <b ref={ref}>{loading ? "…" : "0"}</b>;
}

export function RemotePage() {
  const { jobs, loading } = useJobs();
  const [toast, elemenToast] = useToast();
  const [saring, setSaring] = useState("semua");
  const [q, setQ] = useState("");
  const [tampil, setTampil] = useState(PER_MUAT);
  const sentinel = useRef(null);
  usePintasanCari("cari-remote");

  useEffect(() => {
    document.title = "Loker remote · Jobly";
  }, []);
  useEffect(() => setTampil(PER_MUAT), [saring, q]);

  const remote = useMemo(
    () =>
      jobs
        .filter((j) => j.lokasiKerja === "remote" || j.lokasiKerja === "hybrid")
        .sort((a, b) => waktu(b) - waktu(a)),
    [jobs],
  );

  const statistik = useMemo(() => {
    const penuh = remote.filter((j) => j.lokasiKerja === "remote");
    return {
      total: penuh.length,
      asing: penuh.filter((j) => j.mataUang && j.mataUang.toUpperCase() !== "IDR").length,
      perusahaan: new Set(penuh.map((j) => j.perusahaan)).size,
    };
  }, [remote]);

  const hasil = useMemo(() => {
    const kata = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return remote.filter((j) => {
      if (saring === "hybrid") {
        if (j.lokasiKerja !== "hybrid") return false;
      } else if (j.lokasiKerja !== "remote") return false;
      if (saring === "asing" && !(j.mataUang && j.mataUang.toUpperCase() !== "IDR")) return false;
      if (["full-time", "freelance", "kontrak"].includes(saring) && j.tipeKerja !== saring) return false;
      if (kata.length) {
        const t = `${j.posisi} ${j.perusahaan} ${j.kategori}`.toLowerCase();
        if (!kata.every((k) => t.includes(k))) return false;
      }
      return true;
    });
  }, [remote, saring, q]);

  useMuatOtomatis(sentinel, !loading && hasil.length > tampil, () => setTampil((n) => n + PER_MUAT));

  return (
    <PublicLayout aktif="/remote">
      <section className="pb-remote-hero">
        <div className="pb-wrap">
          <div className="pb-remote-in">
            <div>
              <span className="pb-label">Loker remote</span>
              <h1>
                Kerja dari mana saja. <span>Gaji tetap jalan.</span>
              </h1>
              <p>
                Lowongan remote dan hybrid dari perusahaan Indonesia maupun luar
                negeri, dikumpulkan setiap hari. Sebagian menggaji dalam dolar —
                cek nilainya dalam rupiah sebelum melamar.
              </p>
              <label className="pb-input" style={{ maxWidth: 520, marginTop: 22 }}>
                <Search size={17} color="var(--muted)" aria-hidden="true" />
                <span className="pb-sr">Cari loker remote</span>
                <input
                  id="cari-remote"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Posisi atau skill, mis. developer, desain, customer support"
                  autoComplete="off"
                />
                {q && (
                  <button type="button" onClick={() => setQ("")} aria-label="Hapus pencarian" className="pb-input-x">
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
              <Angka nilai={statistik.total} loading={loading} />
              <span>loker full remote</span>
            </div>
            <div>
              <Angka nilai={statistik.asing} loading={loading} />
              <span>bergaji mata uang asing</span>
            </div>
            <div>
              <Angka nilai={statistik.perusahaan} loading={loading} />
              <span>perusahaan</span>
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
          <span>{loading ? "Memuat lowongan…" : <><b>{hasil.length.toLocaleString("id-ID")}</b> lowongan</>}</span>
        </div>
        <div className="pb-grid">
          {loading && Array.from({ length: 8 }, (_, i) => <KartuLokerSkeleton key={i} />)}
          {!loading && hasil.slice(0, tampil).map((j) => <KartuLoker key={j.id} job={j} onToast={toast} />)}
          {!loading && hasil.length === 0 && (
            <div className="pb-empty">
              <h3>Belum ada loker remote yang cocok</h3>
              <p style={{ margin: 0 }}>Coba kata kunci lain atau pilih “Semua remote”.</p>
            </div>
          )}
        </div>
        {!loading && hasil.length > tampil && (
          <div className="pb-more" ref={sentinel}>
            <button type="button" className="pb-btn pb-btn-outline" onClick={() => setTampil((n) => n + PER_MUAT)}>
              Muat lebih banyak
            </button>
          </div>
        )}
        {!loading && hasil.length <= tampil && (
          <div className="pb-grid" style={{ marginTop: 18 }}>
            <KartuKunci />
          </div>
        )}
      </div>

      <section className="pb-section tint" style={{ marginTop: 56 }}>
        <div className="pb-wrap">
          <div className="pb-head">
            <div>
              <span className="pb-label">Sebelum melamar remote</span>
              <h2>Tiga hal yang sering terlupa</h2>
            </div>
          </div>
          <div className="pb-tips">
            <div className="pb-tip" data-muncul="">
              <span className="pb-ficon">
                <Clock size={20} />
              </span>
              <h3>Zona waktu</h3>
              <p>
                Tim di Eropa atau Amerika bisa berarti rapat malam hari WIB.
                Tanyakan jam kerja inti sejak interview pertama.
              </p>
            </div>
            <div className="pb-tip" data-muncul="" style={{ "--tunda": "80ms" }}>
              <span className="pb-ficon">
                <Calculator size={20} />
              </span>
              <h3>Nilai bersih dalam rupiah</h3>
              <p>
                Gaji dolar terpotong biaya platform dan transfer. Hitung nilai
                bersihnya sebelum menyebut angka.
              </p>
              <a className="pb-link" {...tautan("/kalkulator-gaji")}>
                Kalkulator gaji <ArrowRight size={14} />
              </a>
            </div>
            <div className="pb-tip" data-muncul="" style={{ "--tunda": "160ms" }}>
              <span className="pb-ficon">
                <ShieldCheck size={20} />
              </span>
              <h3>Waspada “kerja dari HP”</h3>
              <p>
                Remote sungguhan tidak meminta deposit, like & subscribe, atau
                biaya pelatihan. Periksa dulu kalau ragu.
              </p>
              <a className="pb-link" {...tautan("/cek-loker")}>
                Cek loker palsu <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
      {elemenToast}
    </PublicLayout>
  );
}
