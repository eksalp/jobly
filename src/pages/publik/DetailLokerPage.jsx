import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Share2,
  MapPin,
  Building2,
  Globe,
  Star,
  Users,
  ChevronRight,
  FileText,
  MessageSquareQuote,
  Bot,
  Laptop,
  Briefcase,
  GraduationCap,
  Wallet,
  Lock,
} from "lucide-react";
import { PublicLayout, useToast } from "../../components/publik/PublicLayout";
import { KartuLoker } from "../../components/publik/KartuLoker";
import { LogoKotak, LogoSumber } from "../../components/publik/LogoKotak";
import { useJobs } from "../../context/JobsContext";
import { catatDilihat } from "../../utils/interaksi";
import { cekLoker } from "../../utils/cekLoker";
import { HasilCek } from "./CekLokerPage";
import { useTujuanBuka } from "../../components/publik/LokerTerkunci";
import { DAFTAR_PAKET, rupiah as rupiahPaket } from "../../data/paket";
import { useAuth } from "../../context/AuthContext";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { panggilApi, keJob } from "../../utils/apiLoker";
import { useDaftarLoker } from "../../hooks/useLoker";
import { formatDeskripsi, potongTebal } from "../../utils/formatDeskripsi";
import {
  infoSumber,
  logoPerusahaan,
  situsResmi,
  formatGaji,
  formatTanggal,
  waktuRelatif,
  labelTipe,
  labelLokasiKerja,
  idDariSlug,
  konversiGaji,
} from "../../utils/sumberLoker";
import { useKurs, idrPer, rupiahRingkas } from "../../utils/kurs";
import { tautan, keHalaman, bagikan, pathFitur } from "../../utils/navigasi";
import { lokal, t } from "../../i18n.js";

function TeksTebal({ teks }) {
  return potongTebal(teks).map((p, i) =>
    p.tebal ? <strong key={i}>{p.teks}</strong> : <React.Fragment key={i}>{p.teks}</React.Fragment>,
  );
}

function Deskripsi({ teks, judul }) {
  const blok = useMemo(() => formatDeskripsi(teks, judul), [teks, judul]);
  if (!blok.length) {
    return (
      <p className="pb-desc" style={{ color: "#7A8597" }}>
        {t("Deskripsi lengkap tersedia di halaman sumber lowongan ini.", "The full description is on the original job page.")}
      </p>
    );
  }
  return (
    <div className="pb-desc">
      {blok.map((b, i) =>
        b.jenis === "judul" ? (
          <h4 key={i}>{b.teks}</h4>
        ) : b.jenis === "daftar" ? (
          <ul key={i}>
            {b.butir.map((s, k) => (
              <li key={k}>
                <TeksTebal teks={s} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <TeksTebal teks={b.teks} />
          </p>
        ),
      )}
    </div>
  );
}

function Kerangka() {
  return (
    <div aria-hidden="true">
      <div style={{ display: "flex", gap: 20 }}>
        <div className="pb-skel" style={{ width: 72, height: 72, borderRadius: 18 }} />
        <div style={{ flex: 1 }}>
          <div className="pb-skel" style={{ width: "80%", height: 30 }} />
          <div className="pb-skel" style={{ width: "40%", height: 16, marginTop: 12 }} />
        </div>
      </div>
      {[92, 100, 96, 70, 88, 60].map((w, i) => (
        <div key={i} className="pb-skel" style={{ width: `${w}%`, height: 13, marginTop: i === 0 ? 48 : 14 }} />
      ))}
    </div>
  );
}

export function DetailLokerPage({ slug }) {
  const id = idDariSlug(slug);
  const { penuh, siap, batasGratis } = useJobs();
  const tujuanBuka = useTujuanBuka();
  const { session } = useAuth();
  const masuk = Boolean(session);
  const { isSaved, toggleSave } = useSavedJobs();
  const { rates } = useKurs();
  const [toast, elemenToast] = useToast();

  const [detail, setDetail] = useState(null);
  const [terkunciIni, setTerkunciIni] = useState(false);
  const [status, setStatus] = useState("memuat"); // memuat | siap | kosong | galat

  // Satu loker lengkap dari server. Server juga yang memutuskan apakah
  // loker ini terkunci untuk akun gratis.
  useEffect(() => {
    if (!siap) return;
    let batal = false;
    setStatus("memuat");
    setDetail(null);
    panggilApi("detail", { id }, { penuh })
      .then((d) => {
        if (batal) return;
        const row = d?.row;
        if (!row) {
          setStatus("kosong");
          return;
        }
        setDetail({
          ...keJob(row),
          deskripsiPerusahaan: row.company_description || null,
          jumlahKaryawan: row.company_num_employees || null,
          alamatPerusahaan: row.company_addresses || null,
          rating: row.company_rating ?? null,
          jumlahUlasan: row.company_reviews_count ?? null,
          jumlahLowongan: row.vacancy_count ?? null,
        });
        setTerkunciIni(Boolean(d.terkunci));
        setStatus("siap");
      })
      .catch(() => !batal && setStatus("galat"));
    window.scrollTo(0, 0);
    return () => {
      batal = true;
    };
  }, [id, penuh, siap]);

  const job = detail;
  const memuatDaftar = !siap;

  useEffect(() => {
    if (job) document.title = `${t(`${job.posisi} di ${job.perusahaan}`, `${job.posisi} at ${job.perusahaan}`)} · Jobly`;
  }, [job]);

  useEffect(() => {
    if (job && !terkunciIni) catatDilihat(job);
  }, [job?.id, terkunciIni]); // eslint-disable-line react-hooks/exhaustive-deps

  const keamanan = useMemo(
    () =>
      detail && detail.deskripsi && !terkunciIni
        ? cekLoker({ teks: detail.deskripsi, judul: detail.posisi, perusahaan: detail.perusahaan, link: detail.link })
        : null,
    [detail, terkunciIni],
  );

  // Loker serupa: cari dua kata pertama judul di server
  const kataSerupa = (job?.posisi || "")
    .split(/[\s(),/–-]+/)
    .filter((k) => k.length > 2)
    .slice(0, 2)
    .join(" ");
  const { jobs: calonSerupa } = useDaftarLoker({ q: kataSerupa }, { n: 8, aktif: Boolean(job && kataSerupa && !terkunciIni) });
  const serupa = useMemo(() => calonSerupa.filter((j) => j.id !== job?.id).slice(0, 4), [calonSerupa, job?.id]);

  // ------------------------------------------------ keadaan khusus
  if (!job && (status === "memuat" || memuatDaftar)) {
    return (
      <PublicLayout aktif="/loker">
        <div className="pb-wrap" style={{ paddingBlock: "40px 90px", maxWidth: 860 }}>
          <Kerangka />
        </div>
      </PublicLayout>
    );
  }

  if (!job) {
    return (
      <PublicLayout aktif="/loker">
        <div className="pb-wrap" style={{ paddingBlock: 90 }}>
          <div className="pb-empty">
            <h3>{t("Lowongan ini sudah tidak tersedia", "This job is no longer available")}</h3>
            <p style={{ margin: "0 0 18px" }}>
              {status === "galat"
                ? t("Lowongan tidak bisa dimuat. Periksa koneksimu lalu coba lagi.", "The job couldn't be loaded. Check your connection and try again.")
                : t("Mungkin sudah ditutup atau dihapus dari sumbernya.", "It may have closed or been removed at the source.")}
            </p>
            <a className="pb-btn pb-btn-primary pb-btn-sm" {...tautan("/loker")}>
              {t("Lihat loker lainnya", "See other jobs")}
            </a>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (terkunciIni) {
    const logoK = logoPerusahaan(job);
    return (
      <PublicLayout aktif="/loker">
        <div className="pb-wrap" style={{ paddingBlock: "48px 90px", maxWidth: 860 }}>
          <div className="pb-d-head">
            <LogoKotak src={logoK} nama={job.perusahaan} ikon={!logoK} ukuran={72} radius={18} />
            <div style={{ minWidth: 0 }}>
              <h1>{job.posisi}</h1>
              <div className="pb-d-company">{job.perusahaan}</div>
            </div>
          </div>
          <div className="pb-kunci" style={{ marginTop: 28 }}>
            <div className="pb-kunci-bayang" aria-hidden="true" style={{ gridTemplateColumns: "1fr" }}>
              <div style={{ height: 220 }}>
                {[96, 88, 92, 70, 84, 60].map((w, i) => (
                  <i key={i} style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
            <div className="pb-kunci-isi">
              <span className="pb-kunci-ic">
                <Lock size={20} />
              </span>
              <h3>
                {t(
                  `Loker ini di luar ${batasGratis.toLocaleString(lokal())} loker gratis`,
                  `This job is outside the ${batasGratis.toLocaleString(lokal())} free jobs`,
                )}
              </h3>
              <p>
                {t(
                  `Detail lengkap dan tombol lamarnya bisa kamu buka dengan paket apa saja, mulai ${rupiahPaket(Math.min(...DAFTAR_PAKET.map((p) => p.harga)))} sekali bayar. Semua loker lain ikut terbuka.`,
                  `Unlock the full details and the apply button with any plan, from ${rupiahPaket(Math.min(...DAFTAR_PAKET.map((p) => p.harga)))} one-time. Every other job unlocks too.`,
                )}
              </p>
              <div className="pb-kunci-act">
                <a className="pb-btn pb-btn-primary" {...tautan(tujuanBuka)}>
                  {t("Buka semua loker", "Unlock all jobs")}
                </a>
                <a className="pb-btn pb-btn-outline" {...tautan("/loker")}>
                  {t("Kembali ke loker gratis", "Back to free jobs")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // ------------------------------------------------ data tampilan
  const sumber = infoSumber(job);
  const gaji = formatGaji(job);
  const rupiah = konversiGaji(job, rates, idrPer, rupiahRingkas);
  const tipe = labelTipe(job);
  const lokasiKerja = labelLokasiKerja(job);
  const situs = situsResmi(job);
  const logo = logoPerusahaan(job);
  const tersimpan = isSaved(job.id);
  const namaSumber = sumber.langsung ? t("situs resmi", "the official site") : sumber.nama;

  const simpan = () => {
    if (!masuk) {
      keHalaman("/login");
      return;
    }
    toggleSave(job.id);
    toast(tersimpan ? t("Dihapus dari loker tersimpan", "Removed from saved jobs") : t("Tersimpan di Loker Disimpan", "Added to saved jobs"));
  };

  const klikBagikan = async () => {
    const hasil = await bagikan({
      judul: job.posisi,
      teks: t(`${job.posisi} di ${job.perusahaan}`, `${job.posisi} at ${job.perusahaan}`),
      url: window.location.pathname,
    });
    if (hasil === "disalin") toast(t("Tautan lowongan disalin", "Job link copied"));
  };

  const info = [
    [t("Lokasi kerja", "Work setting"), lokasiKerja],
    [t("Tipe pekerjaan", "Job type"), tipe],
    [t("Jenjang", "Level"), job.jenjang],
    [t("Fungsi", "Function"), job.fungsi],
    [t("Lokasi", "Location"), job.lokasi],
    [t("Industri", "Industry"), job.industri],
    [t("Jumlah lowongan", "Openings"), job.jumlahLowongan ? t(`${job.jumlahLowongan} posisi`, `${job.jumlahLowongan} positions`) : null],
    [t("Diposting", "Posted"), formatTanggal(job.tanggal)],
  ].filter(([, v]) => v);

  const tombolLamar = (
    <a className="pb-btn pb-btn-primary" href={job.link} target="_blank" rel="noreferrer">
      {t(`Lamar di ${namaSumber}`, `Apply on ${namaSumber}`)} <ArrowUpRight size={16} />
    </a>
  );

  return (
    <PublicLayout aktif="/loker">
      <div className="pb-wrap">
        <nav className="pb-crumb" aria-label={t("Lokasi halaman", "Breadcrumb")}>
          <a {...tautan("/")}>{t("Beranda", "Home")}</a>
          <ChevronRight size={14} />
          <a {...tautan("/loker")}>{t("Loker", "Jobs")}</a>
          {job.lokasi && job.lokasi !== "Tidak disebutkan" && (
            <>
              <ChevronRight size={14} />
              <a {...tautan(`/loker?q=${encodeURIComponent(job.lokasi.split(",")[0])}`)}>
                {job.lokasi.split(",")[0]}
              </a>
            </>
          )}
        </nav>

        <div className="pb-detail">
          {/* ===================================================== isi */}
          <article style={{ minWidth: 0 }}>
            <div className="pb-d-head">
              <LogoKotak src={logo} nama={job.perusahaan} ikon={!logo} ukuran={72} radius={18} />
              <div style={{ minWidth: 0 }}>
                <h1>{job.posisi}</h1>
                <div className="pb-d-company">{job.perusahaan}</div>
              </div>
            </div>

            <div className="pb-d-facts">
              <span>
                <MapPin size={15} /> {job.lokasi}
              </span>
              {lokasiKerja && (
                <span>
                  <Laptop size={15} /> {lokasiKerja}
                </span>
              )}
              {tipe && (
                <span>
                  <Briefcase size={15} /> {tipe}
                </span>
              )}
              {job.jenjang && (
                <span>
                  <GraduationCap size={15} /> {job.jenjang}
                </span>
              )}
              {gaji && (
                <span style={{ color: "var(--salary)", fontWeight: 600 }}>
                  <Wallet size={15} /> {gaji}
                </span>
              )}
            </div>

            <div className="pb-d-actions">
              {tombolLamar}
              <button type="button" className="pb-btn pb-btn-outline" onClick={simpan}>
                {tersimpan ? <BookmarkCheck size={16} color="var(--brand)" /> : <Bookmark size={16} />}
                {tersimpan ? t("Tersimpan", "Saved") : t("Simpan", "Save")}
              </button>
              <button type="button" className="pb-btn pb-btn-outline" onClick={klikBagikan}>
                <Share2 size={16} /> {t("Bagikan", "Share")}
              </button>
            </div>
            <div className="pb-d-note">
              {job.tanggal ? t(`Diposting ${waktuRelatif(job.tanggal).toLowerCase()} · `, `Posted ${waktuRelatif(job.tanggal).toLowerCase()} · `) : ""}
              {t(
                `Tombol lamar akan membuka ${sumber.langsung ? "situs karier resmi perusahaan" : sumber.nama}. Jobly tidak memungut biaya apa pun.`,
                `The apply button opens ${sumber.langsung ? "the company's official career site" : sumber.nama}. Jobly never charges you anything.`,
              )}
            </div>

            <section className="pb-d-sec">
              <h2>{t("Tentang pekerjaan", "About the job")}</h2>
              {status === "memuat" ? (
                [96, 100, 90, 74, 98, 62].map((w, i) => (
                  <div key={i} className="pb-skel" style={{ width: `${w}%`, height: 13, marginTop: i ? 14 : 0 }} />
                ))
              ) : (
                <Deskripsi teks={job.deskripsi} judul={job.posisi} />
              )}
            </section>

            {info.length > 0 && (
              <section className="pb-d-sec">
                <h2>{t("Informasi posisi", "Position details")}</h2>
                <dl className="pb-kv">
                  {info.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section className="pb-d-sec">
              <h2>{t("Tentang perusahaan", "About the company")}</h2>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <LogoKotak src={logo} nama={job.perusahaan} ikon={!logo} ukuran={56} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 16.5 }}>{job.perusahaan}</div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 4, fontSize: 13.5, color: "var(--ink2)" }}>
                    {job.industri && (
                      <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
                        <Building2 size={14} /> {job.industri}
                      </span>
                    )}
                    {job.jumlahKaryawan && (
                      <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
                        <Users size={14} /> {job.jumlahKaryawan} {t("karyawan", "employees")}
                      </span>
                    )}
                    {job.rating ? (
                      <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
                        <Star size={14} /> {Number(job.rating).toFixed(1)}
                        {job.jumlahUlasan ? t(` (${job.jumlahUlasan} ulasan)`, ` (${job.jumlahUlasan} reviews)`) : ""}
                      </span>
                    ) : null}
                  </div>
                  {situs && (
                    <a
                      href={`https://${situs}`}
                      target="_blank"
                      rel="noreferrer"
                      className="pb-link"
                      style={{ fontSize: 13.5, marginTop: 6 }}
                    >
                      <Globe size={14} /> {situs} <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </div>
              {job.deskripsiPerusahaan && (
                <p className="pb-desc" style={{ marginTop: 18 }}>
                  {job.deskripsiPerusahaan.length > 700
                    ? `${job.deskripsiPerusahaan.slice(0, 700)}…`
                    : job.deskripsiPerusahaan}
                </p>
              )}
              <a
                className="pb-link"
                style={{ marginTop: 18, fontSize: 13.5 }}
                {...tautan(`/loker?q=${encodeURIComponent(job.perusahaan)}`)}
              >
                {t(`Loker lain dari ${job.perusahaan}`, `More jobs at ${job.perusahaan}`)} <ArrowRight size={14} />
              </a>
            </section>
          </article>

          {/* =================================================== samping */}
          <aside className="pb-aside">
            <div className="pb-box">
              <h3>{t("Ringkasan", "Summary")}</h3>
              <div style={{ marginTop: 8 }}>
                <div className="pb-box-row" style={{ alignItems: "flex-start" }}>
                  <span className="k">{t("Gaji", "Salary")}</span>
                  <span className="v" style={gaji ? { color: "var(--salary)" } : { color: "var(--muted)", fontWeight: 500 }}>
                    {gaji || t("Tidak dicantumkan", "Not listed")}
                    {rupiah && (
                      <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 500, color: "var(--muted)", marginTop: 3 }}>
                        {rupiah}
                      </span>
                    )}
                  </span>
                </div>
                {tipe && (
                  <div className="pb-box-row">
                    <span className="k">{t("Tipe", "Type")}</span>
                    <span className="v">{tipe}</span>
                  </div>
                )}
                {lokasiKerja && (
                  <div className="pb-box-row">
                    <span className="k">{t("Lokasi kerja", "Work setting")}</span>
                    <span className="v">{lokasiKerja}</span>
                  </div>
                )}
                <div className="pb-box-row">
                  <span className="k">{t("Sumber", "Source")}</span>
                  <span className="v" style={{ display: "inline-flex", gap: 7, alignItems: "center" }}>
                    <LogoSumber sumber={sumber} ukuran={20} />
                    {sumber.nama}
                  </span>
                </div>
              </div>
              <div style={{ display: "grid", marginTop: 16 }}>{tombolLamar}</div>
            </div>

            {keamanan && (
              <div className="pb-box">
                <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {t("Cek keamanan loker", "Job safety check")}
                  <a className="pb-link" style={{ fontSize: 12.5 }} {...tautan("/cek-loker")}>
                    {t("Cara kerjanya", "How it works")}
                  </a>
                </h3>
                <div style={{ marginTop: 10 }}>
                  <HasilCek hasil={keamanan} ringkas />
                </div>
              </div>
            )}

            <div className="pb-box tint">
              <h3>{t("Siapkan lamaranmu", "Prepare your application")}</h3>
              <p style={{ fontSize: 13.5, color: "var(--ink2)", margin: "6px 0 10px", lineHeight: 1.55 }}>
                {t("Biar peluang dipanggil interview makin besar.", "Improve your chances of getting an interview.")}
              </p>
              {[
                { label: t("Review CV dengan AI", "AI CV review"), pro: true, panel: "overview", Ikon: FileText },
                { label: t("Latihan 140+ pertanyaan", "Practise 140+ questions"), pro: false, panel: "interview", Ikon: MessageSquareQuote },
                { label: t("Bandingkan di Peta gaji", "Compare on the salary map"), pro: false, path: `/peta-gaji?posisi=${encodeURIComponent((job.posisi || "").split(/[\s(,/-]+/).slice(0, 2).join(" "))}`, panel: "peta", Ikon: Wallet },
                { label: t("Simulasi interview AI", "AI mock interview"), pro: true, panel: "simulasi", Ikon: Bot },
              ].map(({ label, pro, panel, path, Ikon }) => (
                <a
                  key={panel}
                  className="pb-box-row"
                  style={{ alignItems: "center" }}
                  {...tautan(path || `/dashboard/${panel}`)}
                >
                  <span style={{ display: "inline-flex", gap: 9, alignItems: "center", fontWeight: 500 }}>
                    <Ikon size={16} color="var(--brand)" /> {label}
                  </span>
                  <span className={`pb-tag ${pro ? "pro" : ""}`}>{pro ? "Pro" : t("Gratis", "Free")}</span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {serupa.length > 0 && (
        <section className="pb-section tint">
          <div className="pb-wrap">
            <div className="pb-head">
              <div>
                <span className="pb-label">{t("Loker serupa", "Similar jobs")}</span>
                <h2>{t("Lowongan lain yang mirip", "Other jobs like this")}</h2>
              </div>
              <a className="pb-link" {...tautan("/loker")}>
                {t("Semua lowongan", "All jobs")} <ArrowRight size={15} />
              </a>
            </div>
            <div className="pb-grid">
              {serupa.map((j) => (
                <KartuLoker key={j.id} job={j} onToast={toast} />
              ))}
            </div>
          </div>
        </section>
      )}

      {elemenToast}
    </PublicLayout>
  );
}
