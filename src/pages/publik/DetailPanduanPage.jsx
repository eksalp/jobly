import React, { useEffect, useMemo } from "react";
import { ArrowRight, ChevronRight, ExternalLink, AlertTriangle, Globe, Calculator, ShieldCheck } from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { SEMUA_PANDUAN, PROFESI, cariPanduan } from "../../data/panduan";
import { cocokkanKursus } from "../../data/kursus";
import { tautan } from "../../utils/navigasi";
import { t } from "../../i18n.js";
import { IkonPanduan } from "./PanduanPage";

const idBagian = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Sumber({ sumber }) {
  if (!sumber) return null;
  return (
    <a className="pb-pd-sumber" href={sumber.url} target="_blank" rel="noopener noreferrer">
      {t("Sumber", "Source")}: {sumber.nama}
      <ExternalLink size={11} />
    </a>
  );
}

function Daftar({ items }) {
  return (
    <ul className="pb-pd-poin">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

function KartuKursus({ k }) {
  return (
    <a className="pb-pd-kursus" href={k.url} target="_blank" rel="sponsored noopener noreferrer">
      <span className="pb-pd-kursus-judul">{k.judul}</span>
      <span className="pb-pd-kursus-meta">
        {k.penyedia} · {k.durasi} · {k.level}
      </span>
      <span className="pb-pd-kursus-harga">
        {k.harga}
        <ExternalLink size={12} />
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Isi panduan profesi                                                */
/* ------------------------------------------------------------------ */

function bagianProfesi(p) {
  const kursus = cocokkanKursus(p.kursus || [], null, 3);
  const daftar = [
    {
      judul: t("Gambaran pekerjaan", "What the job involves"),
      isi: (
        <>
          <p>{p.intro}</p>
          <h3>{t("Contoh tugas sehari-hari", "Typical daily tasks")}</h3>
          <Daftar items={p.tugas} />
        </>
      ),
    },
    {
      judul: t("Skill dan tools", "Skills and tools"),
      isi: (
        <div className="pb-pd-dua">
          <div>
            <h3>{t("Skill yang dibutuhkan", "Skills you need")}</h3>
            <Daftar items={p.skill} />
          </div>
          <div>
            <h3>{t("Tools yang sering dipakai", "Common tools")}</h3>
            <Daftar items={p.tools} />
          </div>
        </div>
      ),
    },
    {
      judul: t("Kisaran penghasilan", "Expected earnings"),
      isi: (
        <>
          {p.penghasilan.length > 0 && (
            <div className="pb-pd-gaji">
              {p.penghasilan.map((g) => (
                <div key={g.label} className="pb-pd-gaji-item">
                  <span className="pb-pd-gaji-label">{g.label}</span>
                  <b className="pb-pd-gaji-nilai">{g.nilai}</b>
                  <Sumber sumber={g.sumber} />
                </div>
              ))}
            </div>
          )}
          {p.catatanGaji && <p className="pb-pd-catatan">{p.catatanGaji}</p>}
          <p>
            {t("Dibayar dalam dolar? Hitung nilai bersihnya dalam rupiah di", "Paid in dollars? Work out the net amount in rupiah with the")}{" "}
            <a {...tautan("/kalkulator-gaji")}>{t("Kalkulator Gaji", "Salary Calculator")}</a>{t(", dan bandingkan dengan gaji lokal di", ", and compare it with local pay on the")}{" "}
            <a {...tautan("/peta-gaji")}>{t("Peta Gaji", "Salary Map")}</a>.
          </p>
        </>
      ),
    },
    {
      judul: t("Langkah memulai", "How to get started"),
      isi: (
        <ol className="pb-pd-langkah">
          {p.langkah.map((l) => (
            <li key={l.judul}>
              <b>{l.judul}</b>
              <p>{l.isi}</p>
            </li>
          ))}
        </ol>
      ),
    },
    {
      judul: t("Tempat mencari kerja", "Where to find work"),
      isi: (
        <>
          <div className="pb-pd-platform">
            {p.platform.map((x) => (
              <span key={x} className="pb-chip">
                {x}
              </span>
            ))}
          </div>
          {p.remoteQ && (
            <a className="pb-btn pb-btn-primary pb-pd-cta" {...tautan(`/remote?q=${encodeURIComponent(p.remoteQ)}`)}>
              <Globe size={16} />
              {t("Lihat loker remote", "See remote jobs for")}{" "}{p.judul}
              <ArrowRight size={16} />
            </a>
          )}
        </>
      ),
    },
    kursus.length > 0 && {
      judul: t("Kursus yang disarankan", "Recommended courses"),
      isi: (
        <>
          <div className="pb-pd-kursus-grid">
            {kursus.map((k) => (
              <KartuKursus key={k.id} k={k} />
            ))}
          </div>
          <p className="pb-pd-catatan">
            {t("Sebagian tautan kursus adalah tautan afiliasi. Kursus dipilih berdasarkan kecocokan dengan skill di panduan ini.", "Some course links are affiliate links. Courses are chosen based on the skills in this guide.")}
          </p>
        </>
      ),
    },
    {
      judul: t("Waspadai penipuan", "Watch out for scams"),
      isi: (
        <div className="pb-pd-waspada">
          <AlertTriangle size={18} />
          <div>
            <Daftar items={p.waspada} />
            {p.sumberWaspada && <Sumber sumber={p.sumberWaspada} />}
            <a className="pb-link" {...tautan("/cek-loker")}>
              {t("Periksa lowongan di Cek Loker", "Check a listing with the Fake Job Checker")}{" "}<ArrowRight size={13} />
            </a>
          </div>
        </div>
      ),
    },
  ];
  return daftar.filter(Boolean);
}

/* ------------------------------------------------------------------ */
/*  Isi panduan insight                                                */
/* ------------------------------------------------------------------ */

function bagianInsight(p) {
  return p.bagian.map((b) => ({
    judul: b.judul,
    isi: (
      <>
        {b.isi && <p>{b.isi}</p>}
        {b.poin && <Daftar items={b.poin} />}
        {b.sumber && <Sumber sumber={b.sumber} />}
        {b.tautan && (
          <p style={{ marginTop: 10 }}>
            <a className="pb-link" {...tautan(b.tautan.path)}>
              {b.tautan.label} <ArrowRight size={13} />
            </a>
          </p>
        )}
      </>
    ),
  }));
}

/* ------------------------------------------------------------------ */

export function DetailPanduanPage({ slug }) {
  const p = cariPanduan(slug);

  useEffect(() => {
    document.title = p ? t(`${p.judul} · Panduan Remote Working · Jobly`, `${p.judul} · Remote Working Guide · Jobly`) : t("Panduan tidak ditemukan · Jobly", "Guide not found · Jobly");
    window.scrollTo(0, 0);
  }, [p]);

  const bagian = useMemo(() => (p ? (p.jenis === "profesi" ? bagianProfesi(p) : bagianInsight(p)) : []), [p]);

  if (!p) {
    return (
      <PublicLayout aktif="/panduan">
        <div className="pb-wrap pb-pagehead">
          <h1>{t("Panduan tidak ditemukan", "Guide not found")}</h1>
          <p>
            <a className="pb-link" {...tautan("/panduan")}>
              {t("Lihat semua panduan", "See all guides")} <ArrowRight size={14} />
            </a>
          </p>
        </div>
      </PublicLayout>
    );
  }

  const gulir = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lain = (p.jenis === "profesi" ? PROFESI.filter((x) => x.slug !== p.slug).slice(0, 3) : [])
    .concat(SEMUA_PANDUAN.filter((x) => x.jenis === "insight" && x.slug !== p.slug).slice(0, p.jenis === "profesi" ? 2 : 4));

  return (
    <PublicLayout aktif="/panduan">
      <div className="pb-wrap pb-pagehead">
        <nav className="pb-crumb" aria-label={t("Lokasi halaman", "Breadcrumb")}>
          <a {...tautan("/")}>{t("Beranda", "Home")}</a>
          <ChevronRight size={14} />
          <a {...tautan("/panduan")}>{t("Panduan Remote Working", "Remote Working Guide")}</a>
        </nav>
        <div className="pb-pd-kepala">
          <span className="pb-pd-ikon besar">
            <IkonPanduan nama={p.ikon} size={26} />
          </span>
          <div>
            <h1>{p.judul}</h1>
            <p>{p.ringkas}</p>
          </div>
        </div>
        {p.jenis === "profesi" && (
          <div className="pb-pd-fakta">
            <span>
              <b>{t("Tingkat", "Level")}</b>
              {p.level}
            </span>
            <span>
              <b>{t("Modal awal", "What you need")}</b>
              {p.modal}
            </span>
          </div>
        )}
      </div>

      <div className="pb-wrap pb-doc" style={{ marginTop: 32 }}>
        <nav className="pb-toc" aria-label={t("Isi panduan", "Contents")}>
          <b>{t("Isi panduan", "Contents")}</b>
          <ol>
            {bagian.map((b) => (
              <li key={b.judul}>
                <a href={`#${idBagian(b.judul)}`} onClick={gulir(idBagian(b.judul))}>
                  {b.judul}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="pb-doc-body pb-pd-body">
          {bagian.map((b) => (
            <section key={b.judul} id={idBagian(b.judul)} className="pb-pd-bagian">
              <h2>{b.judul}</h2>
              {b.isi}
            </section>
          ))}

          {p.catatan && <p className="pb-callout" style={{ marginTop: 28 }}>{p.catatan}</p>}

          <div className="pb-pd-lain">
            <h2>{t("Baca juga", "Read next")}</h2>
            <div className="pb-pd-lain-grid">
              {lain.map((x) => (
                <a key={x.slug} className="pb-pd-lain-item" {...tautan(`/panduan/${x.slug}`)}>
                  <IkonPanduan nama={x.ikon} size={17} />
                  <span>{x.judul}</span>
                  <ArrowRight size={14} />
                </a>
              ))}
            </div>
            <div className="pb-pd-alat kecil">
              <a {...tautan("/remote")}>
                <Globe size={16} />
                <span>
                  <b>{t("Loker remote", "Remote jobs")}</b>
                </span>
              </a>
              <a {...tautan("/kalkulator-gaji")}>
                <Calculator size={16} />
                <span>
                  <b>{t("Kalkulator gaji", "Salary calculator")}</b>
                </span>
              </a>
              <a {...tautan("/cek-loker")}>
                <ShieldCheck size={16} />
                <span>
                  <b>{t("Cek loker palsu", "Fake job checker")}</b>
                </span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </PublicLayout>
  );
}
