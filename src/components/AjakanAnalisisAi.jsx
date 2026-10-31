import React from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { t } from "../i18n.js";

/**
 * Ajakan analisis AI di CV Builder dan LinkedIn Builder.
 *
 * Tampil untuk semua pengguna supaya pengguna gratis tahu fiturnya ada.
 * Tombol utama mengirim isi builder ke halaman Review: analisis dasar
 * gratis, analisis AI lengkap mulai paket Starter.
 */
export function AjakanAnalisisAi({ jenis = "cv", bisa, aktif, onAnalisis, onPaket }) {
  const cv = jenis === "cv";
  const poin = cv
    ? [
        t("Skor ATS dan bagian yang paling lemah", "ATS score and the weakest sections"),
        t("Contoh perbaikan untuk tiap masalah", "A suggested fix for each issue"),
        t("Draft CV baru dalam bahasa Indonesia & Inggris", "A new CV draft in Indonesian & English"),
      ]
    : [
        t("Skor profil dan bagian yang paling lemah", "Profile score and the weakest sections"),
        t("Headline dan Tentang yang ditulis ulang", "A rewritten headline and About section"),
        t("Draft profil dalam bahasa Indonesia & Inggris", "A profile draft in Indonesian & English"),
      ];
  return (
    <section className="pb-ajak-ai">
      <span className="pb-ajak-ai-ikon">
        <Sparkles size={18} />
      </span>
      <div className="pb-ajak-ai-isi">
        <b>
          {cv ? t("Analisis CV ini dengan AI", "Analyse this CV with AI") : t("Analisis profil ini dengan AI", "Analyse this profile with AI")}
          {!aktif && <span className="pb-tag pro">{t("Mulai paket Starter", "From Starter plan")}</span>}
        </b>
        <ul>
          {poin.map((p) => (
            <li key={p}>
              <Check size={13} /> {p}
            </li>
          ))}
        </ul>
        {!aktif && (
          <small>
            {t(
              "Tanpa paket pun kamu tetap dapat analisis dasar gratis: bidang yang paling cocok dan loker yang relevan.",
              "Without a plan you still get a free basic analysis: your best-fit field and relevant jobs.",
            )}
          </small>
        )}
      </div>
      <div className="pb-ajak-ai-aksi">
        <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={onAnalisis} disabled={!bisa}>
          <Sparkles size={14} /> {t("Analisis dengan AI", "Analyse with AI")}
        </button>
        {!aktif && (
          <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={onPaket}>
            {t("Lihat paket", "See plans")} <ArrowRight size={14} />
          </button>
        )}
        {!bisa && (
          <small>
            {cv ? t("Isi ringkasan dan pengalaman dulu.", "Fill in your summary and experience first.") : t("Isi headline dan Tentang dulu.", "Fill in your headline and About first.")}
          </small>
        )}
      </div>
    </section>
  );
}
