import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { T, fontLink } from "../theme";
import { supabaseConfigured } from "../lib/supabaseClient";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { JobsProvider } from "../context/JobsContext";
import { UserProfileProvider } from "../context/UserProfileContext";
import { SavedJobsProvider } from "../context/SavedJobsContext";
import { LanggananProvider } from "../context/LanggananContext";
import { GlassBackdrop } from "../components/ui/Glass";
import { LoginPage } from "./auth/LoginPage";
import { RegisterPage } from "./auth/RegisterPage";
import { ForgotPage } from "./auth/ForgotPage";
import { DashboardPage, PANEL_META } from "./dashboard/DashboardPage";
import { BerandaPage } from "./publik/BerandaPage";
import { LokerPage } from "./publik/LokerPage";
import { DetailLokerPage } from "./publik/DetailLokerPage";
import { KalkulatorPage } from "./publik/KalkulatorPage";
import { FaqPage } from "./publik/FaqPage";
import { DokumenPage } from "./publik/DokumenPage";
import { RemotePage } from "./publik/RemotePage";
import { FreelancePage } from "./publik/FreelancePage";
import { MagangPage } from "./publik/MagangPage";
import { BumnPage } from "./publik/BumnPage";
import { SertifikasiPage } from "./publik/SertifikasiPage";
import { BidangPage } from "./publik/BidangPage";
import { CekLokerPage } from "./publik/CekLokerPage";
import { PetaGajiPage } from "./publik/PetaGajiPage";
import { PanduanPage } from "./publik/PanduanPage";
import { DetailPanduanPage } from "./publik/DetailPanduanPage";
import { LatihanPage } from "./publik/LatihanPage";
import { KelasPage } from "./publik/KelasPage";
import {
  adaProsesBerjalan,
  keteranganProses,
} from "../hooks/useCegahTinggalkan";
import { t } from "../i18n.js";

const DASH_IDS = Object.keys(PANEL_META);

/*
 * Peta rute:
 *   /                 Beranda (publik)
 *   /loker            Daftar loker (publik, gratis untuk semua)
 *   /loker/<id>       Detail loker ala JobStreet (publik)
 *   /kalkulator-gaji  Kalkulator gaji mata uang asing → rupiah
 *   /panduan          Panduan Remote Working untuk pemula
 *   /panduan/<slug>   Satu panduan (profesi atau topik umum)
 *   /panduan/<slug>/kelas  Kelas Dasar gratis untuk satu profesi
 *   /magang           Loker magang: MagangHub dulu, lalu magang lainnya
 *   /latihan/<slug>   Latihan praktik untuk satu profesi (Pro)
 *   /faq, /kebijakan-privasi, /syarat-ketentuan, /disclaimer
 *   /login /register /forgot
 *   /dashboard/<menu> Area akun (wajib masuk)
 */
const HALAMAN_PUBLIK = ["beranda", "loker", "detail", "kalkulator", "faq", "dokumen", "remote", "freelance", "magang", "bumn", "bidang", "sertifikasi", "cek", "petagaji", "panduan", "panduanDetail", "kelas", "latihan"];
const DOKUMEN = ["kebijakan-privasi", "syarat-ketentuan", "disclaimer"];
const HALAMAN_AUTH = ["login", "register", "forgot"];

function pathFor(page, dashActive) {
  if (page === "dashboard") return `/dashboard/${dashActive}`;
  if (page === "landing" || page === "beranda") return "/";
  return `/${page}`;
}

function parsePath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path.startsWith("/dashboard")) {
    const seg = path.split("/dashboard/")[1];
    return {
      page: "dashboard",
      dashActive: DASH_IDS.includes(seg) ? seg : "overview",
    };
  }
  if (path.startsWith("/loker/")) {
    return { page: "detail", slug: path.slice("/loker/".length) };
  }
  if (path === "/loker") return { page: "loker" };
  if (path === "/kalkulator-gaji") return { page: "kalkulator" };
  if (path === "/panduan") return { page: "panduan" };
  {
    const m = path.match(/^\/panduan\/([^/]+)\/kelas\/?$/);
    if (m) return { page: "kelas", slug: m[1] };
  }
  if (path.startsWith("/panduan/")) return { page: "panduanDetail", slug: path.slice("/panduan/".length) };
  if (path.startsWith("/latihan/")) return { page: "latihan", slug: path.slice("/latihan/".length) };
  if (path === "/remote") return { page: "remote" };
  if (path === "/freelance") return { page: "freelance" };
  if (path === "/magang") return { page: "magang" };
  if (path === "/bumn") return { page: "bumn" };
  if (path === "/bidang") return { page: "bidang" };
  if (path === "/sertifikasi") return { page: "sertifikasi" };
  if (path === "/cek-loker") return { page: "cek" };
  if (path === "/peta-gaji") return { page: "petagaji" };
  if (path === "/faq") return { page: "faq" };
  if (DOKUMEN.includes(path.slice(1))) return { page: "dokumen", jenis: path.slice(1) };
  if (path === "/register") return { page: "register" };
  if (path === "/forgot") return { page: "forgot" };
  if (path === "/login") return { page: "login" };
  return { page: "beranda" };
}

function JobFinderApp() {
  const { session, authLoading } = useAuth();
  const [rute, setRute] = useState(() => ({
    dashActive: "overview",
    ...parsePath(window.location.pathname),
  }));
  // Kunci render untuk halaman loker: berubah tiap navigasi, sehingga
  // filter dibaca ulang dari URL (mis. klik nama kota di footer).
  const [kunci, setKunci] = useState(0);
  const page = rute.page;

  const terapkan = (parsed) => {
    setRute((lama) => ({ dashActive: lama.dashActive, ...parsed }));
    setKunci((k) => k + 1);
  };

  // Tombol kembali / maju browser
  React.useEffect(() => {
    const onPopState = () => terapkan(parsePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Navigasi dari komponen mana pun: keHalaman("/loker?kota=Bandung")
  React.useEffect(() => {
    const onPath = (e) => {
      const tujuan = String(e.detail || "/");
      const url = new URL(tujuan, window.location.origin);

      // Analisis AI sedang berjalan: minta konfirmasi sebelum pindah
      if (url.pathname !== window.location.pathname && adaProsesBerjalan()) {
        const lanjut = window.confirm(
          t(
            `${keteranganProses()}\n\nKalau pindah sekarang, hasilnya tetap diproses di server dan bisa kamu lihat saat kembali, tapi sebaiknya ditunggu.\n\nTetap pindah halaman?`,
            `${keteranganProses()}\n\nIf you leave now, it keeps processing on the server and you can see the result when you come back, but it's better to wait.\n\nLeave this page anyway?`,
          ),
        );
        if (!lanjut) return;
      }

      const sekarang = window.location.pathname + window.location.search + window.location.hash;
      if (tujuan !== sekarang) window.history.pushState({}, "", tujuan);
      terapkan(parsePath(url.pathname));

      // "/#harga" → gulir ke bagian itu; selain itu ke atas halaman
      if (url.hash) {
        setTimeout(() => {
          document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      } else {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("jf:path", onPath);
    return () => window.removeEventListener("jf:path", onPath);
  }, []);

  // go("login" | "register" | "forgot" | "dashboard" | "landing") —
  // dipakai halaman lama (login, dashboard, dsb.)
  const go = (target) => {
    const dash = target === "dashboard" ? "overview" : rute.dashActive;
    window.history.pushState({}, "", pathFor(target, dash));
    terapkan(parsePath(window.location.pathname));
    window.scrollTo(0, 0);
  };

  const goDash = (id) => {
    setRute((lama) => ({ ...lama, page: "dashboard", dashActive: id }));
    window.history.pushState({}, "", pathFor("dashboard", id));
  };

  // Proteksi rute. Halaman publik (beranda, loker, detail) bebas dibuka
  // siapa saja. Dashboard wajib masuk; halaman masuk/daftar dilewati
  // kalau sudah masuk.
  React.useEffect(() => {
    if (authLoading || !supabaseConfigured) return;
    if (!session && page === "dashboard") {
      // Ingat tujuan, supaya setelah masuk langsung kembali ke sana
      try {
        sessionStorage.setItem("jobly:tujuan", window.location.pathname + window.location.search);
      } catch {
        /* abaikan */
      }
      go("login");
    } else if (session && HALAMAN_AUTH.includes(page)) {
      let tujuan = null;
      try {
        tujuan = sessionStorage.getItem("jobly:tujuan");
        sessionStorage.removeItem("jobly:tujuan");
      } catch {
        /* abaikan */
      }
      if (tujuan && (tujuan.startsWith("/dashboard/") || tujuan.startsWith("/latihan/"))) {
        window.history.pushState({}, "", tujuan);
        terapkan(parsePath(window.location.pathname));
        window.scrollTo(0, 0);
      } else {
        go("dashboard");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, session, page]);

  // Judul tab untuk halaman non-publik (halaman publik mengatur sendiri)
  React.useEffect(() => {
    if (page === "beranda") document.title = t("Jobly · Lowongan kerja dari sumber resmi", "Jobly · Jobs from official sources");
    else if (page === "dashboard")
      document.title = `${PANEL_META[rute.dashActive]?.title || "Dashboard"} · Jobly`;
    else if (HALAMAN_AUTH.includes(page)) document.title = t("Masuk · Jobly", "Sign in · Jobly");
  }, [page, rute.dashActive]);

  const publik = HALAMAN_PUBLIK.includes(page);

  // Halaman publik tidak menunggu sesi — loker langsung tampil
  if (authLoading && !publik) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          color: T.inkSoft,
          fontFamily: T.sans,
          fontSize: 14,
        }}
      >
        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
        {t("Memuat sesi...", "Loading session...")}
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  let isi;
  switch (page) {
    case "beranda":
      isi = <BerandaPage />;
      break;
    case "loker":
      isi = <LokerPage key={kunci} />;
      break;
    case "detail":
      isi = <DetailLokerPage slug={rute.slug} />;
      break;
    case "kalkulator":
      isi = <KalkulatorPage />;
      break;
    case "faq":
      isi = <FaqPage />;
      break;
    case "remote":
      isi = <RemotePage />;
      break;
    case "freelance":
      isi = <FreelancePage />;
      break;
    case "magang":
      isi = <MagangPage />;
      break;
    case "bumn":
      isi = <BumnPage />;
      break;
    case "bidang":
      isi = <BidangPage />;
      break;
    case "sertifikasi":
      isi = <SertifikasiPage />;
      break;
    case "cek":
      isi = <CekLokerPage />;
      break;
    case "petagaji":
      isi = <PetaGajiPage />;
      break;
    case "panduan":
      isi = <PanduanPage />;
      break;
    case "panduanDetail":
      isi = <DetailPanduanPage key={rute.slug} slug={rute.slug} />;
      break;
    case "kelas":
      isi = <KelasPage key={rute.slug} slug={rute.slug} />;
      break;
    case "latihan":
      isi = <LatihanPage key={rute.slug} slug={rute.slug} />;
      break;
    case "dokumen":
      isi = <DokumenPage jenis={rute.jenis} />;
      break;
    case "login":
      isi = <LoginPage go={go} />;
      break;
    case "register":
      isi = <RegisterPage go={go} />;
      break;
    case "forgot":
      isi = <ForgotPage go={go} />;
      break;
    default:
      isi = <DashboardPage go={go} active={rute.dashActive} setActive={goDash} />;
  }

  return (
    <div style={{ fontFamily: T.sans, position: "relative", color: T.ink }}>
      <link rel="stylesheet" href={fontLink} />
      <GlassBackdrop />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      {isi}
    </div>
  );
}

export default function JobFinderSite() {
  return (
    <AuthProvider>
      <LanggananProvider>
        <JobsProvider>
          <UserProfileProvider>
            <SavedJobsProvider>
              <JobFinderApp />
            </SavedJobsProvider>
          </UserProfileProvider>
        </JobsProvider>
      </LanggananProvider>
    </AuthProvider>
  );
}
