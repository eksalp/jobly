import React, { useState, useEffect } from "react";
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
import { SettingsPanel } from "./SettingsPanel";
import { Sidebar, Topbar } from "./DashboardLayout";
import { Footer } from "../../components/ui/Footer";

export const PANEL_META = {
  overview: { title: "Cari Arah Karier" },
  profile: { title: "Profil Karier" },
  cvbuilder: { title: "CV Builder" },
  linkedinbuilder: { title: "LinkedIn Builder" },
  jobfinder: { title: "Job Finder" },
  saved: { title: "Loker Disimpan" },
  applications: { title: "Lamaran" },
  recommendations: { title: "Rekomendasi Karier" },
  pindahkarier: { title: "Pindah Karier" },
  paket: { title: "Paket & Langganan" },
  settings: { title: "Pengaturan" },
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
  paket: PaketPanel,
  settings: SettingsPanel,
};

/**
 * Menu yang sementara disembunyikan.
 *
 * Panelnya tetap terdaftar di PANEL_COMPONENTS agar URL lama tidak
 * menghasilkan error, tapi diarahkan ke halaman "belum tersedia".
 * Kosongkan daftar ini untuk mengaktifkannya kembali.
 */
const PANEL_DISEMBUNYIKAN = [];

/* Ditampilkan kalau ada menu yang belum punya komponen.
   Tanpa ini, satu entri yang terlewat membuat seluruh dashboard blank. */
function PanelTidakDitemukan() {
  return (
    <div
      style={{
        padding: 48,
        textAlign: "center",
        color: "#8891A8",
        fontSize: 13,
        lineHeight: 1.7,
      }}
    >
      Halaman ini belum tersedia.
      <br />
      Fitur ini sedang disiapkan dan akan segera hadir.
    </div>
  );
}

export function DashboardPage({ go, active, setActive }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Panel mana pun bisa meminta pindah halaman lewat event ini,
  // tanpa harus menerima prop setActive.
  useEffect(() => {
    const pindah = (e) => {
      const tujuan = e.detail;
      if (PANEL_COMPONENTS[tujuan] && !PANEL_DISEMBUNYIKAN.includes(tujuan)) {
        setActive(tujuan);
      }
    };
    window.addEventListener("jf:navigate", pindah);
    return () => window.removeEventListener("jf:navigate", pindah);
  }, [setActive]);

  const meta = PANEL_META[active] ?? { title: "Halaman tidak ditemukan" };
  const PanelComponent = PANEL_DISEMBUNYIKAN.includes(active)
    ? PanelTidakDitemukan
    : (PANEL_COMPONENTS[active] ?? PanelTidakDitemukan);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 45,
          }}
          className="jf-overlay"
        />
      )}
      <Sidebar
        active={active}
        setActive={setActive}
        go={go}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      {/* minHeight + flex kolom: mendorong footer ke bawah pada halaman
          yang isinya pendek, supaya tidak menggantung di tengah layar. */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Topbar title={meta.title} setMobileOpen={setMobileOpen} />
        <div style={{ flex: 1 }}>
          <PanelComponent setActive={setActive} go={go} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
