import React, { useEffect, useState } from "react";
import { Search, X, ExternalLink, FileText, CalendarClock, ShieldCheck, ArrowRight } from "lucide-react";
import { PublicLayout, useToast } from "../../components/publik/PublicLayout";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { useDaftarLoker, useTunda } from "../../hooks/useLoker";
import { tautan } from "../../utils/navigasi";
import { useHitungNaik, usePintasanCari } from "../../utils/interaksi";
import { lokal, t } from "../../i18n.js";

const MAGANGHUB = "https://maganghub.kemnaker.go.id";

function Angka({ nilai, loading }) {
  const ref = useHitungNaik(loading ? NaN : nilai);
  return <b ref={ref}>{loading ? "…" : "0"}</b>;
}

/** Satu daftar loker berhalaman: dipakai untuk MagangHub dan magang lainnya. */
function Daftar({ hasil, onToast, kosong }) {
  const { jobs, loading, adaLagi, memuatLagi, muatLagi } = hasil;
  return (
    <>
      <div className="pb-grid">
        {loading && Array.from({ length: 4 }, (_, i) => <KartuLokerSkeleton key={i} />)}
        {!loading && jobs.map((j) => <KartuLoker key={j.id} job={j} onToast={onToast} />)}
        {memuatLagi && Array.from({ length: 4 }, (_, i) => <KartuLokerSkeleton key={`m${i}`} />)}
        {!loading && jobs.length === 0 && <div className="pb-empty">{kosong}</div>}
      </div>
      {!loading && adaLagi && (
        <div className="pb-more">
          <button type="button" className="pb-btn pb-btn-outline" onClick={muatLagi} disabled={memuatLagi}>
            {memuatLagi ? t("Memuat…", "Loading…") : t("Lihat lebih banyak", "Show more")}
          </button>
        </div>
      )}
    </>
  );
}

export function MagangPage() {
  const [toast, elemenToast] = useToast();
  const [q, setQ] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  usePintasanCari("cari-magang");

  useEffect(() => {
    document.title = t("Loker magang & internship · Jobly", "Internships · Jobly");
  }, []);

  const kata = useTunda(q, 350).trim();
  // MagangHub tampil lebih dulu, lalu lowongan magang dari sumber lain
  const hub = useDaftarLoker({ q: kata, sumber: "maganghub" }, { n: 8 });
  const lain = useDaftarLoker({ q: kata, magang: true, kecuali: "maganghub" });
  const semuaHub = useDaftarLoker({ sumber: "maganghub" }, { n: 1 });
  const semuaLain = useDaftarLoker({ magang: true, kecuali: "maganghub" }, { n: 1 });

  return (
    <PublicLayout aktif="/magang">
      <section className="pb-remote-hero pb-mg-hero">
        <div className="pb-wrap">
          <span className="pb-label">{t("Magang / internship", "Internships")}</span>
          <h1>
            {t("Mulai dari magang.", "Start with an internship.")} <span>{t("Pengalaman pertama yang dihitung.", "Experience that counts.")}</span>
          </h1>
          <p>
            {t(
              "Program MagangHub dari Kementerian Ketenagakerjaan ditampilkan paling atas, disusul lowongan magang dan internship dari perusahaan, startup, dan BUMN.",
              "MagangHub programmes from Indonesia's Ministry of Manpower come first, followed by internships from companies, startups, and state-owned firms.",
            )}
          </p>
          <label className="pb-input" style={{ maxWidth: 520, marginTop: 22 }}>
            <Search size={17} color="var(--muted)" aria-hidden="true" />
            <span className="pb-sr">{t("Cari magang", "Search internships")}</span>
            <input
              id="cari-magang"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("Bidang atau kota, mis. akuntansi, marketing, Bandung", "Field or city, e.g. accounting, marketing, Bandung")}
              autoComplete="off"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label={t("Hapus pencarian", "Clear search")} className="pb-input-x">
                <X size={16} />
              </button>
            )}
          </label>
          <div className="pb-remote-stat">
            <div>
              <Angka nilai={semuaHub.total ?? 0} loading={semuaHub.loading} />
              <span>{t("program MagangHub", "MagangHub openings")}</span>
            </div>
            <div>
              <Angka nilai={semuaLain.total ?? 0} loading={semuaLain.loading} />
              <span>{t("lowongan magang lainnya", "other internships")}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-wrap" style={{ paddingTop: 32 }}>
        <div className="pb-head pb-mg-head">
          <div>
            <span className="pb-label">MagangHub Kemnaker</span>
            <h2>{t("Program magang resmi pemerintah", "Government internship programme")}</h2>
            <p>
              {t(
                "Magang bersertifikat untuk lulusan baru di perusahaan mitra Kemnaker. Pendaftaran dibuka per periode, jadi daftar ini bisa kosong saat periode sedang tutup.",
                "Certified internships for recent graduates at partner companies. Registration opens in periods, so this list can be empty between periods.",
              )}
            </p>
          </div>
          <a className="pb-link" href={MAGANGHUB} target="_blank" rel="noopener noreferrer">
            {t("Situs MagangHub", "MagangHub site")} <ExternalLink size={14} />
          </a>
        </div>
        <Daftar
          hasil={hub}
          onToast={toast}
          kosong={
            <>
              <h3>{kata ? t("Tidak ada program MagangHub yang cocok", "No matching MagangHub openings") : t("Periode MagangHub sedang tutup", "MagangHub registration is closed")}</h3>
              <p style={{ margin: 0 }}>
                {t("Pantau pengumuman periode berikutnya di ", "Watch for the next period on ")}
                <a className="pb-link" href={MAGANGHUB} target="_blank" rel="noopener noreferrer">
                  maganghub.kemnaker.go.id
                </a>
                {t(". Sementara itu, cek lowongan magang lain di bawah.", ". Meanwhile, browse the other internships below.")}
              </p>
            </>
          }
        />

        <div className="pb-head pb-mg-head" style={{ marginTop: 44 }}>
          <div>
            <span className="pb-label">{t("Magang lainnya", "Other internships")}</span>
            <h2>{t("Magang & internship dari perusahaan", "Internships from companies")}</h2>
          </div>
          <span className="pb-result" style={{ margin: 0 }}>
            {lain.loading ? t("Memuat…", "Loading…") : <><b>{(lain.total ?? 0).toLocaleString(lokal())}</b> {t("lowongan", "jobs")}</>}
          </span>
        </div>
        <Daftar
          hasil={lain}
          onToast={toast}
          kosong={
            <>
              <h3>{t("Belum ada lowongan magang yang cocok", "No matching internships yet")}</h3>
              <p style={{ margin: 0 }}>{t("Coba kata kunci lain, misalnya nama bidang atau kota.", "Try another keyword, such as a field or a city.")}</p>
            </>
          }
        />
      </div>

      <section className="pb-section tint" style={{ marginTop: 56 }}>
        <div className="pb-wrap">
          <div className="pb-head">
            <div>
              <span className="pb-label">{t("Sebelum melamar magang", "Before you apply")}</span>
              <h2>{t("Tiga hal yang sering menentukan", "Three things that often decide it")}</h2>
            </div>
          </div>
          <div className="pb-tips">
            <div className="pb-tip">
              <span className="pb-ficon">
                <FileText size={20} />
              </span>
              <h3>{t("CV satu halaman", "A one-page CV")}</h3>
              <p>{t("Tonjolkan proyek kuliah, organisasi, dan kepanitiaan. Tulis apa yang kamu kerjakan dan hasilnya, bukan hanya jabatannya.", "Highlight coursework projects, student organisations, and committees. Say what you did and the result, not just the title.")}</p>
              <a className="pb-link" {...tautan("/dashboard/cvbuilder")}>
                CV Builder <ArrowRight size={14} />
              </a>
            </div>
            <div className="pb-tip">
              <span className="pb-ficon">
                <CalendarClock size={20} />
              </span>
              <h3>{t("Perhatikan periode", "Mind the dates")}</h3>
              <p>{t("Banyak program magang punya batas daftar dan tanggal mulai tetap. Cek apakah jadwalnya cocok dengan kuliah atau wisudamu.", "Many programmes have fixed deadlines and start dates. Check that the schedule fits your studies or graduation.")}</p>
              <a className="pb-link" {...tautan("/dashboard/coverletter")}>
                {t("Buat cover letter", "Write a cover letter")} <ArrowRight size={14} />
              </a>
            </div>
            <div className="pb-tip">
              <span className="pb-ficon">
                <ShieldCheck size={20} />
              </span>
              <h3>{t("Magang tidak memungut biaya", "Real internships are free")}</h3>
              <p>{t("Program resmi tidak meminta biaya pendaftaran, pelatihan, atau seragam. Periksa dulu kalau ada yang janggal.", "Legitimate programmes never charge registration, training, or uniform fees. Check first if something feels off.")}</p>
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

