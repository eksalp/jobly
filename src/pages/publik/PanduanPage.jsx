import React, { useEffect } from "react";
import {
  ArrowRight, Globe, ShieldCheck, Calculator, BookOpen, Headset, MessageCircle, Instagram, PenLine,
  Palette, Keyboard, Clapperboard, BrainCircuit, GraduationCap, Compass, FolderOpen, Handshake,
  Wallet, Receipt, ShieldAlert, AudioLines, BarChart3, BookText, Briefcase, Brush, CalendarClock,
  ClipboardCheck, Code2, Feather, FileText, Film, Languages, ListChecks, Mail, Megaphone, Mic,
  Presentation, ScanSearch, Search, Shapes, Sigma, Smartphone, Sparkles, Table, Target, TrendingUp,
  UserCheck, Workflow, Wrench, Dumbbell, CircleCheckBig,
} from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { PROFESI, INSIGHT, KATEGORI_PANDUAN } from "../../data/panduan";
import { tautan } from "../../utils/navigasi";
import { t } from "../../i18n.js";
import { sudahSelesai } from "../../utils/latihanProgres";

// Ikon diimpor satu per satu supaya tidak seluruh pustaka ikon ikut terbundel
const IKON = {
  Headset, MessageCircle, Instagram, PenLine, Palette, Keyboard, Clapperboard, BrainCircuit,
  GraduationCap, Calculator, Compass, FolderOpen, Handshake, Wallet, Receipt, ShieldAlert, AudioLines,
  BarChart3, BookText, Briefcase, Brush, CalendarClock, ClipboardCheck, Code2, Feather, FileText, Film,
  Globe, Languages, ListChecks, Mail, Megaphone, Mic, Presentation, ScanSearch, Search, Shapes, Sigma,
  Smartphone, Sparkles, Table, Target, TrendingUp, UserCheck, Workflow, Wrench,
};

export function IkonPanduan({ nama, size = 20 }) {
  const K = IKON[nama] || BookOpen;
  return <K size={size} strokeWidth={1.9} aria-hidden="true" />;
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
          <span className={`pb-pd-level ${p.levelKode === "mudah" ? "mudah" : ""}`}>{p.level}</span>
          {sudahSelesai(p.slug) && (
            <span className="pb-pd-selesai">
              <CircleCheckBig size={12} />
              {t("Latihan selesai", "Practice done")}
            </span>
          )}
        </span>
      </span>
      <ArrowRight size={16} className="pb-pd-panah" aria-hidden="true" />
    </a>
  );
}

const gulir = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function PanduanPage() {
  useEffect(() => {
    document.title = t("Panduan Remote Working · Jobly", "Remote Working Guide · Jobly");
  }, []);

  return (
    <PublicLayout aktif="/panduan">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">{t("Panduan Remote Working", "Remote Working Guide")}</span>
        <h1>{t("Mulai kerja remote, dari nol", "Start working remotely, from zero")}</h1>
        <p>
          {t(
            "Ingin bekerja dari rumah, tetapi belum tahu harus mulai dari mana? Pilih layanan yang paling sesuai dengan kemampuanmu dari delapan kategori di bawah. Setiap panduan menjelaskan tugas sehari-hari, keterampilan yang perlu disiapkan, perkiraan penghasilan, langkah memulai, serta ciri lowongan palsu agar kamu tidak tertipu.",
            "Want to work from home but not sure where to start? Pick the service that best matches your skills from the eight categories below. Each guide explains the daily tasks, the skills to prepare, expected earnings, how to get started, and how to spot fake listings so you don't get scammed.",
          )}
        </p>
      </div>

      <div className="pb-wrap pb-pd-wrap">
        <div className="pb-lt-info">
          <Dumbbell size={18} />
          <span>
            <b>{t("Baru: latihan praktik untuk setiap pekerjaan.", "New: hands-on practice for every role.")}</b>{" "}
            {t(
              "Buka panduan mana saja, lalu coba kuis situasi kerja dan brief klien sungguhan. Tersedia mulai paket Starter.",
              "Open any guide, then try the work-situation quiz and real client briefs. Available from the Starter plan.",
            )}
          </span>
        </div>
        <section aria-labelledby="pd-profesi">
          <div className="pb-pd-headrow">
            <h2 id="pd-profesi" className="pb-h2">{t("Pilih jenis pekerjaan", "Pick a role")}</h2>
            <span className="pb-pd-jumlah">{PROFESI.length} {t("panduan", "guides")}</span>
          </div>
          <nav className="pb-pd-kat-nav" aria-label={t("Kategori layanan", "Service categories")}>
            {KATEGORI_PANDUAN.map((k) => (
              <a key={k.id} href={`#kat-${k.id}`} onClick={gulir(`kat-${k.id}`)}>
                <IkonPanduan nama={k.ikon} size={15} />
                {k.judul}
                <span>{k.profesi.length}</span>
              </a>
            ))}
          </nav>
          {KATEGORI_PANDUAN.map((k) => (
            <div key={k.id} id={`kat-${k.id}`} className="pb-pd-kat">
              <h3 className="pb-pd-kat-judul">
                <IkonPanduan nama={k.ikon} size={18} />
                {k.judul}
              </h3>
              <div className="pb-pd-grid">
                {k.profesi.map((p) => (
                  <KartuProfesi key={p.slug} p={p} />
                ))}
              </div>
            </div>
          ))}
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
