import React, { useEffect } from "react";
import {
  ArrowRight, Globe, ShieldCheck, Calculator, BookOpen, Headset, MessageCircle, Instagram, PenLine,
  Palette, Keyboard, Clapperboard, BrainCircuit, GraduationCap, Compass, FolderOpen, Handshake,
  Wallet, Receipt, ShieldAlert,
} from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { PROFESI, INSIGHT } from "../../data/panduan";
import { tautan } from "../../utils/navigasi";
import { bahasa, t } from "../../i18n.js";

// Ikon diimpor satu per satu supaya tidak seluruh pustaka ikon ikut terbundel
const IKON = {
  Headset, MessageCircle, Instagram, PenLine, Palette, Keyboard, Clapperboard, BrainCircuit,
  GraduationCap, Calculator, Compass, FolderOpen, Handshake, Wallet, Receipt, ShieldAlert,
};

export function IkonPanduan({ nama, size = 20 }) {
  const K = IKON[nama] || BookOpen;
  return <K size={size} strokeWidth={1.9} aria-hidden="true" />;
}

export function CatatanBahasa() {
  if (bahasa() !== "en") return null;
  return <p className="pb-pd-bahasa">These guides are written in Indonesian for job seekers in Indonesia.</p>;
}

function KartuProfesi({ p }) {
  return (
    <a className="pb-pd-kartu" {...tautan(`/panduan/${p.slug}`)}>
      <span className="pb-pd-ikon">
        <IkonPanduan nama={p.ikon} />
      </span>
      <span className="pb-pd-isi">
        <span className="pb-pd-judul">{p.judul}</span>
        <span className="pb-pd-ringkas">{p.ringkas}</span>
        <span className="pb-pd-meta">
          <span className={`pb-pd-level ${p.level === "Ramah pemula" ? "mudah" : ""}`}>{p.level}</span>
        </span>
      </span>
      <ArrowRight size={16} className="pb-pd-panah" aria-hidden="true" />
    </a>
  );
}

export function PanduanPage() {
  useEffect(() => {
    document.title = t("Panduan kerja remote untuk pemula · Jobly", "Remote work guides for beginners · Jobly");
  }, []);

  return (
    <PublicLayout aktif="/panduan">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">{t("Panduan", "Guides")}</span>
        <h1>{t("Mulai kerja remote, dari nol", "Start working remotely, from zero")}</h1>
        <p>
          {t(
            "Pilih profesi yang paling dekat dengan kemampuanmu. Tiap panduan berisi tugas sehari-hari, skill yang dibutuhkan, kisaran penghasilan beserta sumbernya, langkah memulai, dan tanda penipuan yang perlu diwaspadai.",
            "Pick the role closest to your skills. Each guide covers daily tasks, required skills, pay ranges with sources, first steps, and scam warning signs.",
          )}
        </p>
        <CatatanBahasa />
      </div>

      <div className="pb-wrap pb-pd-wrap">
        <section aria-labelledby="pd-profesi">
          <div className="pb-pd-headrow">
            <h2 id="pd-profesi" className="pb-h2">{t("Panduan per profesi", "Guides by role")}</h2>
            <span className="pb-pd-jumlah">{PROFESI.length} {t("profesi", "roles")}</span>
          </div>
          <div className="pb-pd-grid">
            {PROFESI.map((p) => (
              <KartuProfesi key={p.slug} p={p} />
            ))}
          </div>
        </section>

        <section aria-labelledby="pd-insight" style={{ marginTop: 56 }}>
          <div className="pb-pd-headrow">
            <h2 id="pd-insight" className="pb-h2">{t("Wajib tahu sebelum mulai", "Know this before you start")}</h2>
          </div>
          <div className="pb-pd-insight">
            {INSIGHT.map((p, i) => (
              <a key={p.slug} className="pb-pd-baris" {...tautan(`/panduan/${p.slug}`)}>
                <span className="pb-pd-no">{String(i + 1).padStart(2, "0")}</span>
                <span className="pb-pd-ikon kecil">
                  <IkonPanduan nama={p.ikon} size={18} />
                </span>
                <span className="pb-pd-isi">
                  <span className="pb-pd-judul">{p.judul}</span>
                  <span className="pb-pd-ringkas">{p.ringkas}</span>
                </span>
                <ArrowRight size={16} className="pb-pd-panah" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="pb-pd-alat" aria-label={t("Alat pendukung", "Helpful tools")}>
          <a {...tautan("/remote")}>
            <Globe size={18} />
            <span>
              <b>{t("Loker remote", "Remote jobs")}</b>
              {t("Lowongan kerja dari mana saja, diperbarui tiap hari", "Work-from-anywhere jobs, updated daily")}
            </span>
          </a>
          <a {...tautan("/kalkulator-gaji")}>
            <Calculator size={18} />
            <span>
              <b>{t("Kalkulator gaji", "Salary calculator")}</b>
              {t("Hitung bayaran dolar dalam rupiah", "Convert dollar pay to rupiah")}
            </span>
          </a>
          <a {...tautan("/cek-loker")}>
            <ShieldCheck size={18} />
            <span>
              <b>{t("Cek loker palsu", "Fake job checker")}</b>
              {t("Periksa lowongan sebelum kirim data diri", "Check a listing before sending personal details")}
            </span>
          </a>
        </section>
      </div>
    </PublicLayout>
  );
}
