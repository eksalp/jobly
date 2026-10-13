import React, { useEffect } from "react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { DOKUMEN } from "../../data/dokumen";
import { SITUS } from "../../data/situs";
import { tautan } from "../../utils/navigasi";
import { t } from "../../i18n.js";

const URUTAN = [
  ["syarat-ketentuan", t("Syarat & ketentuan", "Terms of service")],
  ["kebijakan-privasi", t("Kebijakan privasi", "Privacy policy")],
  ["disclaimer", "Disclaimer"],
];

/** Ganti token {KONTAK} dengan alamat email kontak. */
function Teks({ s }) {
  const bagian = String(s).split("{KONTAK}");
  if (bagian.length === 1) return s;
  return bagian.map((b, i) => (
    <React.Fragment key={i}>
      {b}
      {i < bagian.length - 1 &&
        (SITUS.emailKontak ? (
          <a href={`mailto:${SITUS.emailKontak}`}>{SITUS.emailKontak}</a>
        ) : (
          <strong>{t("email kontak Jobly", "Jobly's contact email")}</strong>
        ))}
    </React.Fragment>
  ));
}

export function DokumenPage({ jenis }) {
  const doc = DOKUMEN[jenis];

  useEffect(() => {
    if (doc) document.title = `${doc.judul} · Jobly`;
    window.scrollTo(0, 0);
  }, [doc]);

  if (!doc) return null;

  const gulir = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <PublicLayout aktif={`/${jenis}`}>
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">{t("Dokumen", "Document")}</span>
        <h1>{doc.judul}</h1>
        <p>{doc.ringkas}</p>
        <div className="pb-doc-meta">{t(`Berlaku sejak ${SITUS.dokumenBerlaku}`, `Effective from ${SITUS.dokumenBerlaku}`)}</div>
      </div>

      <div className="pb-wrap pb-doc" style={{ marginTop: 36 }}>
        <nav className="pb-toc" aria-label={t("Daftar isi", "Contents")}>
          <b>{t("Di halaman ini", "On this page")}</b>
          <ol>
            {doc.bagian.map((b) => (
              <li key={b.id}>
                <a href={`#${b.id}`} onClick={gulir(b.id)}>
                  {b.judul}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="pb-doc-body">
          {doc.callout && (
            <p className="pb-callout">
              <Teks s={doc.callout} />
            </p>
          )}
          {doc.bagian.map((b) => (
            <section key={b.id}>
              <h2 id={b.id}>{b.judul}</h2>
              {b.isi.map((x, i) =>
                typeof x === "string" ? (
                  <p key={i}>
                    <Teks s={x} />
                  </p>
                ) : (
                  <ul key={i}>
                    {x.daftar.map((d, k) => (
                      <li key={k}>
                        <Teks s={d} />
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}

          <h2>{t("Dokumen lainnya", "Other documents")}</h2>
          <ul>
            {URUTAN.filter(([id]) => id !== jenis).map(([id, label]) => (
              <li key={id}>
                <a {...tautan(`/${id}`)}>{label}</a>
              </li>
            ))}
            <li>
              <a {...tautan("/faq")}>{t("Pertanyaan yang sering diajukan", "Frequently asked questions")}</a>
            </li>
          </ul>
        </article>
      </div>
    </PublicLayout>
  );
}
