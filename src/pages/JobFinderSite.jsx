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

const DASH_IDS = Object.keys(PANEL_META);

function pathFor(page, dashActive) {
  if (page === "dashboard") return `/dashboard/${dashActive}`;
  return `/${page}`;
}

function parsePath(pathname) {
  if (pathname.startsWith("/dashboard")) {
    const seg = pathname.split("/dashboard/")[1];
    return {
      page: "dashboard",
      dashActive: DASH_IDS.includes(seg) ? seg : "overview",
    };
  }
  if (pathname === "/register")
    return { page: "register", dashActive: "overview" };
  if (pathname === "/forgot") return { page: "forgot", dashActive: "overview" };
  return { page: "login", dashActive: "overview" };
}

function JobFinderApp() {
  const { session, authLoading } = useAuth();
  const initial =
    typeof window !== "undefined"
      ? parsePath(window.location.pathname)
      : { page: "login", dashActive: "overview" };
  const [page, setPageState] = useState(initial.page);
  const [dashActive, setDashActiveState] = useState(initial.dashActive);

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const onPopState = () => {
      const parsed = parsePath(window.location.pathname);
      setPageState(parsed.page);
      setDashActiveState(parsed.dashActive);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // go("login" | "register" | "forgot" | "dashboard") — pushes a new URL and updates state
  const go = (target) => {
    const nextDashActive = target === "dashboard" ? "overview" : dashActive;
    setPageState(target);
    setDashActiveState(nextDashActive);
    window.history.pushState({}, "", pathFor(target, nextDashActive));
  };

  // switch active dashboard tab — pushes /dashboard/{id}
  const goDash = (id) => {
    setDashActiveState(id);
    window.history.pushState({}, "", pathFor("dashboard", id));
  };

  // Proteksi route: kalau belum login tapi buka /dashboard/*, lempar ke
  // login. Kalau sudah login tapi masih di halaman login/register/forgot
  // (mis. setelah redirect OAuth balik ke /login), lempar ke dashboard.
  React.useEffect(() => {
    if (authLoading || !supabaseConfigured) return;
    if (!session && page === "dashboard") {
      go("login");
    } else if (session && page !== "dashboard") {
      go("dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, session, page]);

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          color: T.inkSoft,
          fontFamily: "'Poppins', sans-serif",
          fontSize: 14,
        }}
      >
        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
        Memuat sesi...
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const pages = {
    login: <LoginPage go={go} />,
    register: <RegisterPage go={go} />,
    forgot: <ForgotPage go={go} />,
    dashboard: <DashboardPage go={go} active={dashActive} setActive={goDash} />,
  };
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", position: "relative" }}>
      <link rel="stylesheet" href={fontLink} />
      <GlassBackdrop />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: #9CA3AF; }
        @media (max-width: 900px) {
          .jf-sidebar { position: fixed !important; left: -260px; top: 0; z-index: 50; transition: left .25s ease; }
          .jf-sidebar-open { left: 0 !important; }
          .jf-sidebar-close { display: block !important; }
          .jf-sidebar-open-btn { display: block !important; }
        }
        @media (min-width: 901px) { .jf-overlay { display: none !important; } }
      `}</style>
      {pages[page]}
    </div>
  );
}

export default function JobFinderSite() {
  return (
    <AuthProvider>
      <JobsProvider>
        <UserProfileProvider>
          <SavedJobsProvider>
            <LanggananProvider>
              <JobFinderApp />
            </LanggananProvider>
          </SavedJobsProvider>
        </UserProfileProvider>
      </JobsProvider>
    </AuthProvider>
  );
}
