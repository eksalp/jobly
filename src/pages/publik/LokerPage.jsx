import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  PublicLayout,
  KOTA_POPULER,
  useToast,
} from "../../components/publik/PublicLayout";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { useJobs } from "../../context/JobsContext";
import { useDaftarLoker, useTunda } from "../../hooks/useLoker";
import { KartuKunci, InfoKuotaLoker } from "../../components/publik/LokerTerkunci";
import { TautanGrup } from "../../components/publik/Komunitas";
import { grupAktif } from "../../data/situs";
import { usePintasanCari } from "../../utils/interaksi";
import { infoSumber, LABEL_LOKASI_KERJA, LABEL_TIPE_KERJA } from "../../utils/sumberLoker";
import { lokal, t } from "../../i18n.js";


const OPSI_LOKASI = [["", t("Semua", "All")], ...Object.entries(LABEL_LOKASI_KERJA)];
const OPSI_TIPE = [
  ["", t("Semua", "All")],
  ["full-time", LABEL_TIPE_KERJA["full-time"]],
  ["kontrak", LABEL_TIPE_KERJA.kontrak],
  ["magang", LABEL_TIPE_KERJA.magang],
  ["freelance", LABEL_TIPE_KERJA.freelance],
  ["part-time", LABEL_TIPE_KERJA["part-time"]],
];

function bacaUrl() {
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") || "",
    kota: p.get("kota") || "",
    lokasi: p.get("lokasi") || "",
    tipe: p.get("tipe") || "",
    sumber: p.get("sumber") || "",
    gaji: p.get("gaji") === "1",
    urut: p.get("urut") || "terbaru",
  };
}

function tulisUrl(f) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.kota) p.set("kota", f.kota);
  if (f.lokasi) p.set("lokasi", f.lokasi);
  if (f.tipe) p.set("tipe", f.tipe);
  if (f.sumber) p.set("sumber", f.sumber);
  if (f.gaji) p.set("gaji", "1");
  if (f.urut !== "terbaru") p.set("urut", f.urut);
  const s = p.toString();
  // replaceState: mengetik di kolom cari tidak menumpuk riwayat "Kembali"
  window.history.replaceState({}, "", `/loker${s ? `?${s}` : ""}`);
}


export function LokerPage() {
  const { statistik } = useJobs();
  const [f, setF] = useState(bacaUrl);
  const [toast, elemenToast] = useToast();

  const ubah = (sebagian) => setF((lama) => ({ ...lama, ...sebagian }));
  usePintasanCari("cari-loker");

  useEffect(() => {
    tulisUrl(f);
  }, [f]);

  // Kata kunci dikirim ke server setelah berhenti mengetik sebentar
  const q = useTunda(f.q, 350);
  const { jobs: hasil, total, terkunci, loading, error, adaLagi, memuatLagi, muatLagi } = useDaftarLoker({
    q: q.trim(),
    kota: f.kota,
    lokasi: f.lokasi,
    tipe: f.tipe,
    sumber: f.sumber,
    gaji: f.gaji,
    urut: f.urut,
  });

  // Daftar sumber dari statistik server, untuk pilihan filter
  const daftarSumber = useMemo(
    () =>
      Object.entries(statistik.sumber || {})
        .map(([site, n]) => {
          const info = infoSumber({ site });
          return {
            site,
            n,
            label: info.langsung ? site.replace(/_/g, " ") : info.nama,
            langsung: info.langsung,
          };
        })
        .sort((a, b) => b.n - a.n),
    [statistik.sumber],
  );

  // Gulir sampai bawah = muat 24 berikutnya, tanpa perlu menekan tombol
  // Loker berikutnya dimuat lewat tombol "Lihat lebih banyak", tidak otomatis saat menggulir

  const adaFilter = f.q || f.kota || f.lokasi || f.tipe || f.sumber || f.gaji;
  const reset = () =>
    setF({ q: "", kota: "", lokasi: "", tipe: "", sumber: "", gaji: false, urut: "terbaru" });

  // Judul halaman mengikuti filter, mis. "Loker di Bandung"
  const judul = f.kota
    ? t(`Loker di ${f.kota}`, `Jobs in ${f.kota}`)
    : f.lokasi === "remote"
      ? t("Loker remote", "Remote jobs")
      : f.q
        ? t(`Loker “${f.q}”`, `“${f.q}” jobs`)
        : t("Semua lowongan", "All jobs");

  useEffect(() => {
    document.title = `${f.kota || f.q ? judul : t("Semua loker", "All jobs")} · Jobly`;
  }, [judul, f.kota, f.q]);

  return (
    <PublicLayout aktif="/loker">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">{t("Lowongan kerja", "Job openings")}</span>
        <h1>{judul}</h1>
        <p>
          {t(
            "Loker dari situs karier resmi perusahaan dan platform kerja, diperbarui setiap hari.",
            "Openings from official company career sites and job platforms, updated every day.",
          )}
        </p>
      </div>

      <div className="pb-filterbar">
        <div className="pb-wrap">
          <div className="pb-filter-row">
            <label className="pb-input">
              <Search size={17} color="#7A8597" />
              <span className="pb-sr">{t("Cari loker", "Search jobs")}</span>
              <input
                id="cari-loker"
                value={f.q}
                onChange={(e) => ubah({ q: e.target.value })}
                placeholder={t("Posisi, perusahaan, atau kata kunci…  (tekan / )", "Role, company, or keyword…  (press / )")}
                autoComplete="off"
              />
              {f.q && (
                <button
                  type="button"
                  onClick={() => ubah({ q: "" })}
                  aria-label={t("Hapus pencarian", "Clear search")}
                  style={{ border: 0, background: "none", cursor: "pointer", color: "#7A8597", display: "flex" }}
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <label className="pb-sr" htmlFor="filter-kota">{t("Kota", "City")}</label>
            <select
              id="filter-kota"
              className="pb-select"
              value={f.kota}
              onChange={(e) => ubah({ kota: e.target.value })}
            >
              <option value="">{t("Semua kota", "All cities")}</option>
              {KOTA_POPULER.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <label className="pb-sr" htmlFor="filter-sumber">{t("Sumber", "Source")}</label>
            <select
              id="filter-sumber"
              className="pb-select"
              value={f.sumber}
              onChange={(e) => ubah({ sumber: e.target.value })}
            >
              <option value="">{t("Semua sumber", "All sources")}</option>
              {daftarSumber.some((s) => s.langsung) && (
                <option value="_langsung">{t("Situs karier resmi", "Official career sites")}</option>
              )}
              {daftarSumber.map((s) => (
                <option key={s.site} value={s.site}>
                  {s.langsung ? `· ${s.label}` : s.label} ({s.n.toLocaleString(lokal())})
                </option>
              ))}
            </select>

            <label className="pb-sr" htmlFor="filter-urut">{t("Urutkan", "Sort by")}</label>
            <select
              id="filter-urut"
              className="pb-select"
              value={f.urut}
              onChange={(e) => ubah({ urut: e.target.value })}
            >
              <option value="terbaru">{t("Terbaru", "Newest")}</option>
              <option value="gaji">{t("Gaji tertinggi", "Highest pay")}</option>
            </select>
          </div>

          <div className="pb-chips">
            {OPSI_LOKASI.map(([v, l]) => (
              <button
                key={`l-${v}`}
                type="button"
                className={`pb-chip ${f.lokasi === v ? "on" : ""}`}
                onClick={() => ubah({ lokasi: v })}
              >
                {v ? l : t("Semua lokasi", "Any location")}
              </button>
            ))}
            <span className="pb-chip-sep" />
            {OPSI_TIPE.map(([v, l]) => (
              <button
                key={`t-${v}`}
                type="button"
                className={`pb-chip ${f.tipe === v ? "on" : ""}`}
                onClick={() => ubah({ tipe: v })}
              >
                {v ? l : t("Semua tipe", "Any type")}
              </button>
            ))}
            <span className="pb-chip-sep" />
            <button
              type="button"
              className={`pb-chip ${f.gaji ? "on" : ""}`}
              onClick={() => ubah({ gaji: !f.gaji })}
            >
              {t("Ada info gaji", "Shows salary")}
            </button>
          </div>
        </div>
      </div>

      <div className="pb-wrap">
        {!loading && <InfoKuotaLoker />}
        <div className="pb-result">
          <span>
            {loading ? (
              t("Memuat lowongan…", "Loading jobs…")
            ) : (
              <>
                <b>{(total ?? 0).toLocaleString(lokal())}</b> {t("lowongan ditemukan", "jobs found")}
              </>
            )}
          </span>
          {adaFilter && (
            <button
              type="button"
              className="pb-link"
              onClick={reset}
              style={{ border: 0, background: "none", cursor: "pointer", color: "#14549A", fontSize: 13.5 }}
            >
              <X size={14} /> {t("Hapus semua filter", "Clear all filters")}
            </button>
          )}
        </div>

        <div className="pb-grid">
          {loading &&
            Array.from({ length: 8 }, (_, i) => <KartuLokerSkeleton key={i} />)}

          {!loading &&
            hasil.map((j) => <KartuLoker key={j.id} job={j} onToast={toast} />)}
          {memuatLagi && Array.from({ length: 4 }, (_, i) => <KartuLokerSkeleton key={`m${i}`} />)}

          {!loading && hasil.length === 0 && (
            <div className="pb-empty">
              <h3>{t("Belum ada loker yang cocok", "No matching jobs yet")}</h3>
              <p style={{ margin: "0 0 18px" }}>
                {error
                  ? t("Data loker sedang tidak bisa dimuat. Coba muat ulang halaman sebentar lagi.", "Jobs can't be loaded right now. Try reloading the page in a moment.")
                  : t("Coba kata kunci yang lebih umum, atau kurangi filternya.", "Try a broader keyword, or remove some filters.")}
              </p>
              {adaFilter && (
                <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={reset}>
                  {t("Hapus semua filter", "Clear all filters")}
                </button>
              )}
            </div>
          )}
        </div>

        {!loading && adaLagi && (
          <div className="pb-more">
            <button type="button" className="pb-btn pb-btn-outline" onClick={muatLagi} disabled={memuatLagi}>
              {memuatLagi ? t("Memuat…", "Loading…") : t("Lihat lebih banyak", "Show more")}
            </button>
            {t(
              `Menampilkan ${hasil.length.toLocaleString(lokal())} dari ${(total ?? 0).toLocaleString(lokal())} lowongan`,
              `Showing ${hasil.length.toLocaleString(lokal())} of ${(total ?? 0).toLocaleString(lokal())} jobs`,
            )}
          </div>
        )}
        {!loading && !adaLagi && terkunci > 0 && (
          <div className="pb-grid" style={{ marginTop: 18 }}>
            <KartuKunci jumlah={terkunci} />
          </div>
        )}
        {!loading && !adaLagi && hasil.length > 0 && (
          <div className="pb-more">{t("Semua lowongan yang terbuka sudah ditampilkan.", "All open jobs are shown.")}</div>
        )}
        {!loading && grupAktif().length > 0 && (
          <div className="pb-grup-strip">
            <span>
              <b>{t("Mau dapat info loker tiap hari?", "Want job alerts every day?")}</b> {t("Gabung grup Jobly, gratis.", "Join the Jobly group, it's free.")}
            </span>
            <TautanGrup ringkas />
          </div>
        )}
      </div>

      {elemenToast}
    </PublicLayout>
  );
}
