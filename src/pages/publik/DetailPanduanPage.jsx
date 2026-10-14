import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronRight, ExternalLink, AlertTriangle, Globe, Calculator, ShieldCheck, Dumbbell, CircleCheckBig } from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { SEMUA_PANDUAN, PROFESI, KATEGORI_PANDUAN, cariPanduan } from "../../data/panduan";
import { cocokkanKursus } from "../../data/kursus";
import { tautan } from "../../utils/navigasi";
import { t } from "../../i18n.js";
import { IkonPanduan } from "./PanduanPage";
import { sudahSelesai } from "../../utils/latihanProgres";

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

function BagianKerja({ kerja }) {
  return (
    <>
      <h3>{t("Contoh satu hari kerja", "A typical working day")}</h3>
      <ol className="pb-pd-hari">
        {kerja.hari.map((h) => (
          <li key={h.jam}>
            <span className="pb-pd-jam">{h.jam}</span>
            <span>{h.isi}</span>
          </li>
        ))}
      </ol>
      <h3>{t("Cara kerjamu dinilai", "How your work is judged")}</h3>
      <Daftar items={kerja.dinilai} />
      <h3>{t("Tantangan yang sering muncul", "Common challenges")}</h3>
      <div className="pb-pd-tantangan">
        {kerja.tantangan.map((x) => (
          <div key={x.judul}>
            <b>{x.judul}</b>
            <p>{x.isi}</p>
          </div>
        ))}
      </div>
      <h3>{t("Jenjang karier", "Career path")}</h3>
      <p>{kerja.jenjang}</p>
    </>
  );
}

function BagianLolos({ lolos }) {
  return (
    <>
      <h3>{t("Alur seleksi yang umum", "The usual hiring process")}</h3>
      <ol className="pb-pd-alur">
        {lolos.alur.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ol>
      <h3>{t("Isi portofolio yang dicari", "What a strong portfolio shows")}</h3>
      <Daftar items={lolos.portofolio} />
      <h3>{t("Tes yang biasa diberikan", "Typical tests")}</h3>
      <p>{lolos.tes}</p>
      <h3>{t("Pertanyaan interview yang sering muncul", "Common interview questions")}</h3>
      <div className="pb-pd-tanya">
        {lolos.pertanyaan.map((x) => (
          <div key={x.q}>
            <b>"{x.q}"</b>
            <p>
              <span>{t("Cara menjawab:", "How to answer:")}</span> {x.jawab}
            </p>
          </div>
        ))}
      </div>
      <h3>{t("Kesalahan yang sering membuat gagal", "Mistakes that often cost the job")}</h3>
      <Daftar items={lolos.kesalahan} />
    </>
  );
}

function bagianProfesi(p, ekstra) {
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
    ekstra?.kerja && {
      judul: t("Seperti apa kerjanya", "What the work is really like"),
      isi: <BagianKerja kerja={ekstra.kerja} />,
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
    ekstra?.lolos && {
      judul: t("Cara lolos seleksi", "How to get hired"),
      isi: <BagianLolos lolos={ekstra.lolos} />,
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
              {t("Cari loker", "Find jobs:")}{" "}{p.judul}
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

function AjakanLatihan({ p }) {
  const selesai = sudahSelesai(p.slug);
  return (
    <a className={`pb-lt-ajak ${selesai ? "selesai" : ""}`} {...tautan(`/latihan/${p.slug}`)}>
      <span className="pb-lt-ajak-ikon">{selesai ? <CircleCheckBig size={20} /> : <Dumbbell size={20} />}</span>
      <span className="pb-lt-ajak-isi">
        <b>
          {selesai ? t("Latihan sudah selesai", "Practice completed") : t("Latihan praktik", "Practice")}{" "}
          <span className="pb-tag pro">{t("Berbayar", "Paid")}</span>
        </b>
        <span>
          {selesai
            ? t("Buka lagi untuk mengulang kuis atau memperbaiki jawabanmu.", "Open it again to retake the quiz or improve your answers.")
            : t("Kuis situasi kerja, simulasi pesan masuk sepanjang hari, dan 2 brief klien lengkap dengan permintaan revisi. Soal pertama gratis.", "A work-situation quiz, a simulated day of incoming messages, and 2 client briefs with revision requests. The first question is free.")}
        </span>
      </span>
      <span className="pb-lt-ajak-aksi">
        {selesai ? t("Buka", "Open") : t("Mulai", "Start")}
        <ArrowRight size={15} />
      </span>
    </a>
  );
}

export function DetailPanduanPage({ slug }) {
  const p = cariPanduan(slug);

  useEffect(() => {
    document.title = p ? t(`${p.judul} · Panduan Remote Working · Jobly`, `${p.judul} · Remote Working Guide · Jobly`) : t("Panduan tidak ditemukan · Jobly", "Guide not found · Jobly");
    window.scrollTo(0, 0);
  }, [p]);

  // Bagian "cara lolos" dan "seperti apa kerjanya" cukup panjang, jadi dimuat terpisah
  const [ekstra, setEkstra] = useState(null);
  useEffect(() => {
    if (!p || p.jenis !== "profesi") return undefined;
    let batal = false;
    import("../../data/panduanKerja/index.js").then((m) => {
      if (!batal) setEkstra(m.PANDUAN_KERJA[p.slug] || null);
    });
    return () => {
      batal = true;
    };
  }, [p]);

  const bagian = useMemo(
    () => (p ? (p.jenis === "profesi" ? bagianProfesi(p, ekstra) : bagianInsight(p)) : []),
    [p, ekstra],
  );

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

  const kat = KATEGORI_PANDUAN.find((k) => k.id === p.kategori);

  const gulir = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Utamakan panduan dari kategori yang sama, lalu lengkapi dengan kategori lain
  const sekategori = PROFESI.filter((x) => x.slug !== p.slug && x.kategori === p.kategori);
  const lainnya = PROFESI.filter((x) => x.slug !== p.slug && x.kategori !== p.kategori);
  const lain = (p.jenis === "profesi" ? [...sekategori, ...lainnya].slice(0, 4) : [])
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
            {kat && (
              <span>
                <b>{t("Kategori", "Category")}</b>
                <a {...tautan(`/panduan#kat-${kat.id}`)}>{kat.judul}</a>
              </span>
            )}
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
        {p.jenis === "profesi" && <AjakanLatihan p={p} />}
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
