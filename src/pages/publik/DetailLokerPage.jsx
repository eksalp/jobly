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
} from "lucide-react";
import { PublicLayout, useToast } from "../../components/publik/PublicLayout";
import { KartuLoker } from "../../components/publik/KartuLoker";
import { LogoKotak, LogoSumber } from "../../components/publik/LogoKotak";
import { useJobs } from "../../context/JobsContext";
import { useAuth } from "../../context/AuthContext";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { fetchDetailLoker } from "../../utils/jobMatching";
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
        Deskripsi lengkap tersedia di halaman sumber lowongan ini.
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
  const { jobs, loading: memuatDaftar } = useJobs();
  const { session } = useAuth();
  const masuk = Boolean(session);
  const { isSaved, toggleSave } = useSavedJobs();
  const { rates } = useKurs();
  const [toast, elemenToast] = useToast();

  // Data ringkas dari daftar (langsung tampil) sambil menunggu detail lengkap
  const ringkas = useMemo(() => jobs.find((j) => j.id === id) || null, [jobs, id]);
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState("memuat"); // memuat | siap | kosong | galat

  useEffect(() => {
    let batal = false;
    setStatus("memuat");
    setDetail(null);
    fetchDetailLoker(id)
      .then((d) => {
        if (batal) return;
        setDetail(d);
        setStatus(d ? "siap" : "kosong");
      })
      .catch(() => {
        if (!batal) setStatus("galat");
      });
    window.scrollTo(0, 0);
    return () => {
      batal = true;
    };
  }, [id]);

  const job = detail || ringkas;

  useEffect(() => {
    if (job) document.title = `${job.posisi} — ${job.perusahaan} · Jobly`;
  }, [job]);

  const serupa = useMemo(() => {
    if (!job) return [];
    const kataJudul = (job.posisi || "").toLowerCase().split(/\W+/).filter((k) => k.length > 3);
    return jobs
      .filter((j) => j.id !== job.id)
      .map((j) => {
        const judul = (j.posisi || "").toLowerCase();
        let skor = kataJudul.filter((k) => judul.includes(k)).length * 2;
        if (job.kategori && j.kategori === job.kategori) skor += 2;
        if (j.perusahaan === job.perusahaan) skor += 1;
        return { j, skor };
      })
      .filter((x) => x.skor > 0)
      .sort((a, b) => b.skor - a.skor)
      .slice(0, 3)
      .map((x) => x.j);
  }, [jobs, job]);

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
            <h3>Lowongan ini sudah tidak tersedia</h3>
            <p style={{ margin: "0 0 18px" }}>
              {status === "galat"
                ? "Lowongan tidak bisa dimuat. Periksa koneksimu lalu coba lagi."
                : "Mungkin sudah ditutup atau dihapus dari sumbernya."}
            </p>
            <a className="pb-btn pb-btn-primary pb-btn-sm" {...tautan("/loker")}>
              Lihat loker lainnya
            </a>
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
  const namaSumber = sumber.langsung ? "situs resmi" : sumber.nama;

  const simpan = () => {
    if (!masuk) {
      keHalaman("/login");
      return;
    }
    toggleSave(job.id);
    toast(tersimpan ? "Dihapus dari loker tersimpan" : "Tersimpan di Loker Disimpan");
  };

  const klikBagikan = async () => {
    const hasil = await bagikan({
      judul: job.posisi,
      teks: `${job.posisi} — ${job.perusahaan}`,
      url: window.location.pathname,
    });
    if (hasil === "disalin") toast("Tautan lowongan disalin");
  };

  const info = [
    ["Lokasi kerja", lokasiKerja],
    ["Tipe pekerjaan", tipe],
    ["Jenjang", job.jenjang],
    ["Fungsi", job.fungsi],
    ["Lokasi", job.lokasi],
    ["Industri", job.industri],
    ["Jumlah lowongan", job.jumlahLowongan ? `${job.jumlahLowongan} posisi` : null],
    ["Diposting", formatTanggal(job.tanggal)],
  ].filter(([, v]) => v);

  const tombolLamar = (
    <a className="pb-btn pb-btn-primary" href={job.link} target="_blank" rel="noreferrer">
      Lamar di {namaSumber} <ArrowUpRight size={16} />
    </a>
  );

  return (
    <PublicLayout aktif="/loker">
      <div className="pb-wrap">
        <nav className="pb-crumb" aria-label="Lokasi halaman">
          <a {...tautan("/")}>Beranda</a>
          <ChevronRight size={14} />
          <a {...tautan("/loker")}>Loker</a>
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
                {tersimpan ? "Tersimpan" : "Simpan"}
              </button>
              <button type="button" className="pb-btn pb-btn-outline" onClick={klikBagikan}>
                <Share2 size={16} /> Bagikan
              </button>
            </div>
            <div className="pb-d-note">
              {job.tanggal ? `Diposting ${waktuRelatif(job.tanggal).toLowerCase()} · ` : ""}
              Kamu akan diarahkan ke {sumber.langsung ? "situs karier resmi perusahaan" : sumber.nama}.
              Jobly tidak memungut biaya apa pun.
            </div>

            <section className="pb-d-sec">
              <h2>Tentang pekerjaan</h2>
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
                <h2>Informasi posisi</h2>
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
              <h2>Tentang perusahaan</h2>
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
                        <Users size={14} /> {job.jumlahKaryawan} karyawan
                      </span>
                    )}
                    {job.rating ? (
                      <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
                        <Star size={14} /> {Number(job.rating).toFixed(1)}
                        {job.jumlahUlasan ? ` (${job.jumlahUlasan} ulasan)` : ""}
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
                Loker lain dari {job.perusahaan} <ArrowRight size={14} />
              </a>
            </section>
          </article>

          {/* =================================================== samping */}
          <aside className="pb-aside">
            <div className="pb-box">
              <h3>Ringkasan</h3>
              <div style={{ marginTop: 8 }}>
                <div className="pb-box-row" style={{ alignItems: "flex-start" }}>
                  <span className="k">Gaji</span>
                  <span className="v" style={gaji ? { color: "var(--salary)" } : { color: "var(--muted)", fontWeight: 500 }}>
                    {gaji || "Tidak dicantumkan"}
                    {rupiah && (
                      <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 500, color: "var(--muted)", marginTop: 3 }}>
                        {rupiah}
                      </span>
                    )}
                  </span>
                </div>
                {tipe && (
                  <div className="pb-box-row">
                    <span className="k">Tipe</span>
                    <span className="v">{tipe}</span>
                  </div>
                )}
                {lokasiKerja && (
                  <div className="pb-box-row">
                    <span className="k">Lokasi kerja</span>
                    <span className="v">{lokasiKerja}</span>
                  </div>
                )}
                <div className="pb-box-row">
                  <span className="k">Sumber</span>
                  <span className="v" style={{ display: "inline-flex", gap: 7, alignItems: "center" }}>
                    <LogoSumber sumber={sumber} ukuran={20} />
                    {sumber.nama}
                  </span>
                </div>
              </div>
              <div style={{ display: "grid", marginTop: 16 }}>{tombolLamar}</div>
            </div>

            <div className="pb-box tint">
              <h3>Siapkan lamaranmu</h3>
              <p style={{ fontSize: 13.5, color: "var(--ink2)", margin: "6px 0 10px", lineHeight: 1.55 }}>
                Tingkatkan peluang dipanggil interview untuk posisi ini.
              </p>
              {[
                { label: "Review CV dengan AI", pro: true, panel: "overview", Ikon: FileText },
                { label: "Latihan 100+ pertanyaan", pro: false, panel: "interview", Ikon: MessageSquareQuote },
                { label: "Simulasi interview AI", pro: true, panel: "simulasi", Ikon: Bot },
              ].map(({ label, pro, panel, Ikon }) => (
                <a
                  key={panel}
                  className="pb-box-row"
                  style={{ alignItems: "center" }}
                  {...tautan(pathFitur(panel, masuk))}
                >
                  <span style={{ display: "inline-flex", gap: 9, alignItems: "center", fontWeight: 500 }}>
                    <Ikon size={16} color="var(--brand)" /> {label}
                  </span>
                  <span className={`pb-tag ${pro ? "pro" : ""}`}>{pro ? "Pro" : "Gratis"}</span>
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
                <span className="pb-label">Loker serupa</span>
                <h2>Lowongan lain yang mirip</h2>
              </div>
              <a className="pb-link" {...tautan("/loker")}>
                Semua lowongan <ArrowRight size={15} />
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
