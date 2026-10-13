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

/**
 * Judul, kelompok menu, dan keterangan setiap halaman akun.
 * `grup` sama dengan label menu di header supaya pengguna tahu posisinya.
 */
export const PANEL_META = {
  overview: {
    grup: "Persiapan",
    title: "Review CV & arah karier",
    desc: "Unggah CV atau profil LinkedIn untuk melihat skor ATS, bidang yang paling cocok, dan loker yang relevan.",
  },
  profile: {
    grup: "Profil & CV",
    title: "Profil karier",
    desc: "Data diri, keahlian, dan preferensi kerja yang dipakai untuk mencocokkan loker denganmu.",
  },
  cvbuilder: {
    grup: "Profil & CV",
    title: "CV Builder",
    desc: "Susun CV yang mudah dibaca sistem penyaringan, lalu unduh dalam PDF.",
  },
  linkedinbuilder: {
    grup: "Profil & CV",
    title: "LinkedIn Builder",
    desc: "Rapikan headline, ringkasan, dan pengalaman di profil LinkedIn-mu.",
  },
  jobfinder: {
    grup: "Loker",
    title: "Cocok untukku",
    desc: "Loker diurutkan berdasarkan kecocokan dengan keahlian, profil, dan CV-mu.",
  },
  saved: {
    grup: "Loker",
    title: "Loker tersimpan",
    desc: "Lowongan yang kamu tandai untuk dilamar nanti.",
  },
  rencana: {
    grup: "Loker",
    title: "Rencana lamar",
    desc: "Target mingguan, streak harian, dan misi kecil supaya pencarian kerja tetap jalan.",
  },
  applications: {
    grup: "Loker",
    title: "Lamaran saya",
    desc: "Catat setiap lamaran dan pantau progresnya sampai tahap akhir.",
  },
  recommendations: {
    grup: "Persiapan",
    title: "Rekomendasi karier",
    desc: "Posisi dan bidang yang layak kamu incar berdasarkan profilmu.",
  },
  pindahkarier: {
    grup: "Persiapan",
    title: "Pindah karier",
    desc: "Petakan skill yang masih terpakai di bidang baru dan apa saja yang perlu dikejar.",
  },
  interview: {
    grup: "Persiapan",
    title: "Latihan interview",
    desc: "140+ pertanyaan dari yang umum sampai level neraka, lengkap dengan strategi, contoh jawaban, dan mode tantangan berwaktu.",
  },
  simulasi: {
    grup: "Persiapan",
    title: "Simulasi interview",
    desc: "Wawancara lewat suara dengan pewawancara AI, lalu dapat penilaian dan masukan.",
  },
  paket: {
    grup: "Akun",
    title: "Paket & langganan",
    desc: "Kuota fitur AI, masa berlaku paket, dan riwayat pembelian.",
  },
  settings: {
    grup: "Akun",
    title: "Pengaturan",
    desc: "Data akun, kata sandi, dan preferensi.",
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
      Halaman ini tidak ditemukan.{" "}
      <a {...tautan("/dashboard/overview")} style={{ color: "var(--brand)", fontWeight: 600 }}>
        Kembali ke Review CV
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
        `${keteranganProses()}\n\n` +
          "Kalau pindah sekarang, hasilnya tetap diproses di server dan bisa " +
          "kamu lihat saat kembali, tapi sebaiknya ditunggu.\n\n" +
          "Tetap pindah halaman?",
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
              © {tahun} {SITUS.nama} · Dibuat oleh {SITUS.pembuat}
            </span>
            <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <a {...tautan("/faq")}>FAQ</a>
              <a {...tautan("/syarat-ketentuan")}>Syarat & ketentuan</a>
              <a {...tautan("/kebijakan-privasi")}>Kebijakan privasi</a>
              <a {...tautan("/disclaimer")}>Disclaimer</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
