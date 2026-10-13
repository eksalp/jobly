import React, { useEffect, useRef } from "react";
import { AnalyzerPanel } from "./AnalyzerPanel";
import { ProfilKarierPanel } from "./ProfilKarierPanel";
import { CVBuilderPanel } from "./CVBuilderPanel";
import { LinkedInBuilderPanel } from "./LinkedInBuilderPanel";
import { PaketPanel } from "./PaketPanel";
import { JobFinderPanel } from "./JobFinderPanel";
import { SavedJobsPanel } from "./SavedJobsPanel";
import { ApplicationsPanel } from "./ApplicationsPanel";
import { CareerRecommendationsPanel } from "./CareerRecommendationsPanel";
import { PindahKarierPanel } from "./PindahKarierPanel";
import { LatihanInterviewPanel } from "./LatihanInterviewPanel";
import { SimulasiInterviewPanel } from "./SimulasiInterviewPanel";
import { SettingsPanel } from "./SettingsPanel";
import { RencanaPanel } from "./RencanaPanel";
import { SiteHeader, useAnimasiMuncul } from "../../components/publik/PublicLayout";
import { tautan } from "../../utils/navigasi";
import { SITUS } from "../../data/situs";
import {
  adaProsesBerjalan,
  keteranganProses,
} from "../../hooks/useCegahTinggalkan";
import { t } from "../../i18n.js";

/**
 * Judul, kelompok menu, dan keterangan setiap halaman akun.
 * `grup` sama dengan label menu di header supaya pengguna tahu posisinya.
 */
export const PANEL_META = {
  overview: {
    grup: t("Persiapan", "Prepare"),
    title: t("Review CV & arah karier", "CV review & career direction"),
    desc: t("Unggah CV atau profil LinkedIn untuk melihat skor ATS, bidang yang paling cocok, dan loker yang relevan.", "Upload your CV or LinkedIn profile to see your ATS score, best-fit fields, and relevant jobs."),
  },
  profile: {
    grup: t("Profil & CV", "Profile & CV"),
    title: t("Profil karier", "Career profile"),
    desc: t("Data diri, keahlian, dan preferensi kerja yang dipakai untuk mencocokkan loker denganmu.", "Your details, skills, and work preferences, used to match jobs to you."),
  },
  cvbuilder: {
    grup: t("Profil & CV", "Profile & CV"),
    title: "CV Builder",
    desc: t("Susun CV yang mudah dibaca sistem penyaringan, lalu unduh dalam PDF.", "Build a CV that screening systems can read, then download it as a PDF."),
  },
  linkedinbuilder: {
    grup: t("Profil & CV", "Profile & CV"),
    title: "LinkedIn Builder",
    desc: t("Rapikan headline, ringkasan, dan pengalaman di profil LinkedIn-mu.", "Polish the headline, summary, and experience on your LinkedIn profile."),
  },
  jobfinder: {
    grup: t("Loker", "Jobs"),
    title: t("Cocok untukku", "Matched for me"),
    desc: t("Loker diurutkan berdasarkan kecocokan dengan keahlian, profil, dan CV-mu.", "Jobs ranked by how well they match your skills, profile, and CV."),
  },
  saved: {
    grup: t("Loker", "Jobs"),
    title: t("Loker tersimpan", "Saved jobs"),
    desc: t("Lowongan yang kamu tandai untuk dilamar nanti.", "Jobs you've marked to apply to later."),
  },
  rencana: {
    grup: t("Loker", "Jobs"),
    title: t("Rencana lamar", "Application plan"),
    desc: t("Target mingguan, streak harian, dan misi kecil supaya pencarian kerja tetap jalan.", "Weekly targets, daily streaks, and small missions to keep your job search moving."),
  },
  applications: {
    grup: t("Loker", "Jobs"),
    title: t("Lamaran saya", "My applications"),
    desc: t("Catat setiap lamaran dan pantau progresnya sampai tahap akhir.", "Log every application and track it through to the final stage."),
  },
  recommendations: {
    grup: t("Persiapan", "Prepare"),
    title: t("Rekomendasi karier", "Career suggestions"),
    desc: t("Posisi dan bidang yang layak kamu incar berdasarkan profilmu.", "Roles and fields worth aiming for, based on your profile."),
  },
  pindahkarier: {
    grup: t("Persiapan", "Prepare"),
    title: t("Pindah karier", "Career switch"),
    desc: t("Petakan skill yang masih terpakai di bidang baru dan apa saja yang perlu dikejar.", "Map which skills carry over to a new field and what you still need to learn."),
  },
  interview: {
    grup: t("Persiapan", "Prepare"),
    title: t("Latihan interview", "Interview practice"),
    desc: t("140+ pertanyaan dari yang umum sampai level neraka, lengkap dengan strategi, contoh jawaban, dan mode tantangan berwaktu.", "140+ questions from the common to the brutal, with strategies, sample answers, and a timed challenge mode."),
  },
  simulasi: {
    grup: t("Persiapan", "Prepare"),
    title: t("Simulasi interview", "Mock interview"),
    desc: t("Wawancara lewat suara dengan pewawancara AI, lalu dapat penilaian dan masukan.", "A voice interview with an AI interviewer, followed by a score and feedback."),
  },
  paket: {
    grup: t("Akun", "Account"),
    title: t("Paket & langganan", "Plans & billing"),
    desc: t("Kuota fitur AI, masa berlaku paket, dan riwayat pembelian.", "AI credits, plan validity, and purchase history."),
  },
  settings: {
    grup: t("Akun", "Account"),
    title: t("Pengaturan", "Settings"),
    desc: t("Data akun, kata sandi, dan preferensi.", "Account details, password, and preferences."),
  },
};

export const PANEL_COMPONENTS = {
  overview: AnalyzerPanel,
  profile: ProfilKarierPanel,
  cvbuilder: CVBuilderPanel,
  linkedinbuilder: LinkedInBuilderPanel,
  jobfinder: JobFinderPanel,
  saved: SavedJobsPanel,
  applications: ApplicationsPanel,
  recommendations: CareerRecommendationsPanel,
  pindahkarier: PindahKarierPanel,
  interview: LatihanInterviewPanel,
  simulasi: SimulasiInterviewPanel,
  paket: PaketPanel,
  settings: SettingsPanel,
  rencana: RencanaPanel,
};

/** Ditampilkan kalau URL menunjuk ke menu yang tidak ada. */
function PanelTidakDitemukan() {
  return (
    <div style={{ padding: "48px 28px", color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
      {t("Halaman ini tidak ditemukan.", "This page wasn't found.")}{" "}
      <a {...tautan("/dashboard/overview")} style={{ color: "var(--brand)", fontWeight: 600 }}>
        {t("Kembali ke Review CV", "Back to CV review")}
      </a>
    </div>
  );
}

/**
 * Kerangka halaman akun — tanpa sidebar.
 *
 * Navigasi sepenuhnya lewat header (menu turun per kelompok + menu akun),
 * sama dengan halaman publik, sehingga situs terasa satu kesatuan.
 */
export function DashboardPage({ go, active, setActive }) {
  // Panel mana pun bisa meminta pindah halaman lewat event ini
  useEffect(() => {
    const pindah = (e) => {
      if (PANEL_COMPONENTS[e.detail]) gantiPanel(e.detail);
    };
    window.addEventListener("jf:navigate", pindah);
    return () => window.removeEventListener("jf:navigate", pindah);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [active]);

  /*
   * Pindah halaman saat analisis berjalan: beforeunload tidak menangkap
   * ini karena halamannya tidak benar-benar ditinggalkan, jadi minta
   * konfirmasi di sini. Navigasi lewat header dijaga di JobFinderSite.
   */
  function gantiPanel(tujuan) {
    if (tujuan !== active && adaProsesBerjalan()) {
      const lanjut = window.confirm(
        t(
          `${keteranganProses()}\n\nKalau pindah sekarang, hasilnya tetap diproses di server dan bisa kamu lihat saat kembali, tapi sebaiknya ditunggu.\n\nTetap pindah halaman?`,
          `${keteranganProses()}\n\nIf you leave now, it keeps processing on the server and you can see the result when you come back, but it's better to wait.\n\nLeave this page anyway?`,
        ),
      );
      if (!lanjut) return;
    }
    setActive(tujuan);
  }

  const akar = useRef(null);
  useAnimasiMuncul(akar);
  const meta = PANEL_META[active];
  const Panel = PANEL_COMPONENTS[active] ?? PanelTidakDitemukan;
  const tahun = new Date().getFullYear();

  return (
    <div className="pb" ref={akar}>
      <SiteHeader aktif={`/dashboard/${active}`} />

      <main className="pb-main">
        {meta && (
          <div className="pb-app-head">
            <div className="pb-app-wrap">
              <span className="pb-label">{meta.grup}</span>
              <h1>{meta.title}</h1>
              <p>{meta.desc}</p>
            </div>
          </div>
        )}
        <div className="pb-app-wrap pb-app-body">
          <Panel setActive={gantiPanel} go={go} />
        </div>
      </main>

      <footer className="pb-footer">
        <div className="pb-wrap">
          <div className="pb-foot-bottom" style={{ borderTop: 0 }}>
            <span>
              © {tahun} {SITUS.nama}{" "}{t("· Dibuat oleh", "· Made by")}{" "}{SITUS.pembuat}
            </span>
            <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <a {...tautan("/faq")}>FAQ</a>
              <a {...tautan("/syarat-ketentuan")}>{t("Syarat & ketentuan", "Terms of service")}</a>
              <a {...tautan("/kebijakan-privasi")}>{t("Kebijakan privasi", "Privacy policy")}</a>
              <a {...tautan("/disclaimer")}>Disclaimer</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
