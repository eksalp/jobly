import React, { useEffect, useMemo, useState } from "react";
import { Search, X, Building2, SlidersHorizontal } from "lucide-react";
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
import { lokal, t, bahasa } from "../../i18n.js";
import { DAFTAR_NEGARA, cariNegara } from "../../data/negara.js";
import { BIDANG, cariBidang } from "../../data/bidang.js";
import { IkonBidang } from "../../components/publik/IkonBidang";


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
    pt: p.get("pt") || "",
    negara: p.get("negara") || "",
    bidang: p.get("bidang") || "",
    bumn: p.get("bumn") === "1",
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
  if (f.pt) p.set("pt", f.pt);
  if (f.negara) p.set("negara", f.negara);
  if (f.bidang) p.set("bidang", f.bidang);
  if (f.bumn) p.set("bumn", "1");
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
  const pt = useTunda(f.pt, 350);
  const { jobs: hasil, total, terkunci, loading, error, adaLagi, memuatLagi, muatLagi } = useDaftarLoker({
    q: q.trim(),
    pt: pt.trim(),
    negara: f.negara,
    bidang: f.bidang,
    bumn: f.bumn,
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

  // Di HP, filter lanjutan dilipat supaya daftar loker tidak tertutup
  const [filterBuka, setFilterBuka] = useState(false);
  const jumlahFilter = [f.pt, f.negara, f.kota, f.sumber, f.urut !== "terbaru", f.bidang, f.lokasi, f.tipe, f.gaji, f.bumn].filter(Boolean).length;

  const adaFilter = f.q || f.pt || f.negara || f.bidang || f.bumn || f.kota || f.lokasi || f.tipe || f.sumber || f.gaji;
  const reset = () =>
    setF({ q: "", pt: "", negara: "", bidang: "", bumn: false, kota: "", lokasi: "", tipe: "", sumber: "", gaji: false, urut: "terbaru" });

  // Negara yang punya loker, diurutkan dari yang terbanyak
  const daftarNegara = useMemo(() => {
    const jml = statistik.negara || {};
    const ada = Object.keys(jml).length > 0;
    return DAFTAR_NEGARA.filter((n) => !ada || jml[n.kode] || n.kode === f.negara)
      .map((n) => ({ ...n, n: jml[n.kode] || 0 }))
      .sort((a, b) => b.n - a.n);
  }, [statistik.negara, f.negara]);
  const namaNegara = (n) => (bahasa() === "en" ? n.en : n.id);
  // Pilihan kota hanya berisi kota di Indonesia
  const kotaAktif = !f.negara || f.negara === "id";

  // Judul halaman mengikuti filter, mis. "Loker di Bandung"
  const negaraDipilih = cariNegara(f.negara);
  const bidangDipilih = cariBidang(f.bidang);
  const judul = bidangDipilih
    ? t(`Loker ${bidangDipilih.nama}`, `${bidangDipilih.nama} jobs`)
    : f.bumn
      ? t("Loker BUMN", "State-owned enterprise jobs")
      : f.kota
    ? t(`Loker di ${f.kota}`, `Jobs in ${f.kota}`)
    : negaraDipilih
      ? t(`Loker di ${negaraDipilih.id}`, `Jobs in ${negaraDipilih.en}`)
      : f.pt
        ? t(`Loker di ${f.pt}`, `Jobs at ${f.pt}`)
        : f.lokasi === "remote"
      ? t("Loker remote", "Remote jobs")
      : f.q
        ? t(`Loker “${f.q}”`, `“${f.q}” jobs`)
        : t("Semua lowongan", "All jobs");

  useEffect(() => {
    document.title = `${f.kota || f.q || f.negara || f.pt || f.bidang || f.bumn ? judul : t("Semua loker", "All jobs")} · Jobly`;
  }, [judul, f.kota, f.q, f.negara, f.pt, f.bidang, f.bumn]);

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
                placeholder={t("Posisi atau kata kunci, mis. akuntan, admin, IT…  (tekan / )", "Role or keyword, e.g. accountant, admin, IT…  (press / )")}
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

            <button
              type="button"
              className={`pb-filter-toggle ${filterBuka ? "on" : ""}`}
              aria-expanded={filterBuka}
              onClick={() => setFilterBuka((x) => !x)}
            >
              <SlidersHorizontal size={16} /> {t("Filter", "Filters")}
              {jumlahFilter > 0 && <b>{jumlahFilter}</b>}
            </button>

            <div className={`pb-filter-lanjut ${filterBuka ? "buka" : ""}`}>
            <label className="pb-input pb-input-pt">
              <Building2 size={16} color="#7A8597" />
              <span className="pb-sr">{t("Nama perusahaan", "Company name")}</span>
              <input
                value={f.pt}
                onChange={(e) => ubah({ pt: e.target.value })}
                placeholder={t("Perusahaan", "Company")}
                autoComplete="off"
              />
              {f.pt && (
                <button
                  type="button"
                  onClick={() => ubah({ pt: "" })}
                  aria-label={t("Hapus nama perusahaan", "Clear company")}
                  style={{ border: 0, background: "none", cursor: "pointer", color: "#7A8597", display: "flex" }}
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <label className="pb-sr" htmlFor="filter-negara">{t("Negara", "Country")}</label>
            <select
              id="filter-negara"
              className="pb-select"
              value={f.negara}
              onChange={(e) => {
                const negara = e.target.value;
                // Kota hanya berlaku untuk Indonesia
                ubah(negara && negara !== "id" ? { negara, kota: "" } : { negara });
              }}
            >
              <option value="">{t("Semua negara", "All countries")}</option>
              {daftarNegara.map((n) => (
                <option key={n.kode} value={n.kode}>
                  {namaNegara(n)}{n.n ? ` (${n.n.toLocaleString(lokal())})` : ""}
                </option>
              ))}
            </select>

            <label className="pb-sr" htmlFor="filter-kota">{t("Kota", "City")}</label>
            <select
              id="filter-kota"
              className="pb-select"
              value={f.kota}
              disabled={!kotaAktif}
              title={kotaAktif ? undefined : t("Pilihan kota hanya untuk Indonesia", "City options are for Indonesia only")}
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
          </div>

          <div className={`pb-filter-lanjut ${filterBuka ? "buka" : ""}`}>
          <div className="pb-bidang-strip" role="group" aria-label={t("Bidang", "Field")}>
            <button type="button" className={`pb-bidang-chip ${!f.bidang ? "on" : ""}`} onClick={() => ubah({ bidang: "" })}>
              {t("Semua bidang", "All fields")}
            </button>
            {BIDANG.map((b) => (
              <button
                key={b.slug}
                type="button"
                className={`pb-bidang-chip ${f.bidang === b.slug ? "on" : ""}`}
                style={{ "--warna": b.warna }}
                onClick={() => ubah({ bidang: f.bidang === b.slug ? "" : b.slug })}
              >
                <IkonBidang nama={b.ikon} size={14} />
                {b.nama}
                {statistik.bidang?.[b.slug] ? <small>{statistik.bidang[b.slug].toLocaleString(lokal())}</small> : null}
              </button>
            ))}
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
            <button type="button" className={`pb-chip ${f.bumn ? "on" : ""}`} onClick={() => ubah({ bumn: !f.bumn })}>
              {t("Hanya BUMN", "State-owned only")}
            </button>
          </div>
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
