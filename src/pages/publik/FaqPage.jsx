import React, { useEffect } from "react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { DaftarFaq } from "../../components/publik/DaftarFaq";
import { FAQ } from "../../data/faq";
import { SITUS } from "../../data/situs";
import { tautan } from "../../utils/navigasi";

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
        <span className="pb-label">Bantuan</span>
        <h1>Pertanyaan yang sering diajukan</h1>
        <p>
          Seputar sumber lowongan, cara melamar, paket berbayar, dan data pribadimu.
        </p>
      </div>

      <div className="pb-wrap pb-doc" style={{ marginTop: 36 }}>
        <nav className="pb-toc" aria-label="Topik">
          <b>Topik</b>
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
            <b>Belum terjawab?</b>
            <br />
            {SITUS.emailKontak ? (
              <>
                Kirim pertanyaanmu ke{" "}
                <a href={`mailto:${SITUS.emailKontak}`} style={{ color: "var(--brand)", fontWeight: 600 }}>
                  {SITUS.emailKontak}
                </a>
                .
              </>
            ) : (
              "Baca juga Syarat & Ketentuan dan Kebijakan Privasi."
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
            Dokumen terkait:{" "}
            <a className="pb-link" {...tautan("/syarat-ketentuan")}>Syarat & ketentuan</a>
            {" · "}
            <a className="pb-link" {...tautan("/kebijakan-privasi")}>Kebijakan privasi</a>
            {" · "}
            <a className="pb-link" {...tautan("/disclaimer")}>Disclaimer</a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
