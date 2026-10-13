import React, { useEffect } from "react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { DaftarFaq } from "../../components/publik/DaftarFaq";
import { FAQ } from "../../data/faq";
import { SITUS } from "../../data/situs";
import { tautan } from "../../utils/navigasi";
import { t } from "../../i18n.js";

const idGrup = (g) => g.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function FaqPage() {
  useEffect(() => {
    document.title = "FAQ · Jobly";
  }, []);

  const gulir = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PublicLayout aktif="/faq">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">{t("Bantuan", "Help")}</span>
        <h1>{t("Pertanyaan yang sering diajukan", "Frequently asked questions")}</h1>
        <p>
          {t("Seputar sumber lowongan, cara melamar, paket berbayar, dan data pribadimu.", "About job sources, how to apply, paid plans, and your personal data.")}
        </p>
      </div>

      <div className="pb-wrap pb-doc" style={{ marginTop: 36 }}>
        <nav className="pb-toc" aria-label={t("Topik", "Topics")}>
          <b>{t("Topik", "Topics")}</b>
          <ol>
            {FAQ.map((g) => (
              <li key={g.grup}>
                <a href={`#${idGrup(g.grup)}`} onClick={gulir(idGrup(g.grup))}>
                  {g.grup}
                </a>
              </li>
            ))}
          </ol>
          <div className="pb-note" style={{ marginTop: 24 }}>
            <b>{t("Belum terjawab?", "Still have a question?")}</b>
            <br />
            {SITUS.emailKontak ? (
              <>
                {t("Kirim pertanyaanmu ke", "Send it to")}{" "}
                <a href={`mailto:${SITUS.emailKontak}`} style={{ color: "var(--brand)", fontWeight: 600 }}>
                  {SITUS.emailKontak}
                </a>
                .
              </>
            ) : (
              t("Baca juga Syarat & Ketentuan dan Kebijakan Privasi.", "See also the Terms of Service and Privacy Policy.")
            )}
          </div>
        </nav>

        <div style={{ minWidth: 0 }}>
          {FAQ.map((g, i) => (
            <section key={g.grup} id={idGrup(g.grup)} style={{ scrollMarginTop: 92, marginTop: i ? 44 : 0 }}>
              <h2 className="pb-faq-group">{g.grup}</h2>
              <DaftarFaq items={g.items} />
            </section>
          ))}

          <p style={{ marginTop: 40, fontSize: 14.5, color: "var(--ink2)" }}>
            {t("Dokumen terkait:", "Related documents:")}{" "}
            <a className="pb-link" {...tautan("/syarat-ketentuan")}>{t("Syarat & ketentuan", "Terms of service")}</a>
            {" · "}
            <a className="pb-link" {...tautan("/kebijakan-privasi")}>{t("Kebijakan privasi", "Privacy policy")}</a>
            {" · "}
            <a className="pb-link" {...tautan("/disclaimer")}>Disclaimer</a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
