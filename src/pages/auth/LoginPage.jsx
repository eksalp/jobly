import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2, Building2 } from "lucide-react";
import { T } from "../../theme";
import { useAuth, peranDari } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { keHalaman } from "../../utils/navigasi";
import { Button } from "../../components/ui/Button";
import {
  Field,
  ErrorNote,
  GoogleButton,
} from "../../components/ui/FormControls";
import { AuthWrap } from "./AuthWrap";
import { t } from "../../i18n.js";

/**
 * Halaman masuk. `jenis` = "pekerja" (bawaan, /login) atau "perusahaan"
 * (/pemberi-kerja/masuk). Akun pencari kerja tidak bisa masuk lewat halaman
 * perusahaan; akun perusahaan yang masuk lewat /login diarahkan ke dasbornya.
 */
export function LoginPage({ go, jenis = "pekerja" }) {
  const mitra = jenis === "perusahaan";
  const { signInWithEmail, signInWithGoogle, signOut, session, peran, setPeran } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError(t("Isi email dan kata sandi dulu ya.", "Please enter your email and password."));
      return;
    }
    setError("");
    setLoading(true);
    const { data, error: err } = await signInWithEmail(email.trim(), password);
    if (err) {
      setLoading(false);
      setError(err);
      return;
    }
    let p = peranDari(data?.user);
    if (!data?.user?.user_metadata?.peran) {
      // Akun lama: perusahaan bila sudah punya profil perusahaan
      const { data: pt } = await supabase.from("perusahaan").select("user_id").eq("user_id", data.user.id).maybeSingle();
      p = pt ? "perusahaan" : "pekerja";
      await setPeran(p);
    }
    setLoading(false);
    if (mitra && p !== "perusahaan") {
      await signOut();
      setError(
        t(
          "Email ini terdaftar sebagai akun pencari kerja. Masuk lewat halaman pencari kerja, atau daftarkan perusahaanmu dengan email lain.",
          "This email belongs to a job seeker account. Sign in on the job seeker page, or register your company with a different email.",
        ),
      );
      return;
    }
    if (p === "perusahaan") keHalaman("/pemberi-kerja/dasbor");
    else go("dashboard");
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const { error: err } = await signInWithGoogle(mitra ? "perusahaan" : "pekerja");
    if (err) {
      setError(err);
      setGoogleLoading(false);
    }
    // Kalau sukses, browser akan di-redirect ke Google lalu balik lagi —
    // nggak perlu setGoogleLoading(false) di sini.
  };

  // Sudah masuk sebagai pencari kerja tetapi membuka halaman masuk perusahaan
  if (mitra && session && peran !== "perusahaan") {
    return (
      <AuthWrap mitra>
        <h1 style={{ fontSize: 21, fontWeight: 650, color: T.ink, marginBottom: 8 }}>
          {t("Kamu sedang masuk sebagai pencari kerja", "You're signed in as a job seeker")}
        </h1>
        <p style={{ fontSize: 13.5, color: T.inkSoft, marginBottom: 20, lineHeight: 1.6 }}>
          {t(
            `Akun ${session.user.email} adalah akun pencari kerja. Untuk memasang loker, keluar dulu lalu masuk atau daftar dengan akun perusahaan.`,
            `${session.user.email} is a job seeker account. To post jobs, sign out first, then sign in or register with a company account.`,
          )}
        </p>
        <Button variant="primary" style={{ width: "100%" }} onClick={() => signOut()}>
          {t("Keluar dan lanjut sebagai perusahaan", "Sign out and continue as a company")}
        </Button>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span style={{ fontSize: 13, color: T.accent, fontWeight: 600, cursor: "pointer" }} onClick={() => go("dashboard")}>
            {t("Kembali ke dasbor pencari kerja", "Back to the job seeker dashboard")}
          </span>
        </div>
      </AuthWrap>
    );
  }

  return (
    <AuthWrap mitra={mitra}>
      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: T.ink,
          marginBottom: 4,
        }}
      >
        {mitra ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Building2 size={20} color={T.accent} /> {t("Masuk akun perusahaan", "Company sign in")}
          </span>
        ) : (
          t("Selamat datang kembali", "Welcome back")
        )}
      </h1>
      <p style={{ fontSize: 13.5, color: T.inkSoft, marginBottom: 24 }}>
        {mitra
          ? t("Kelola loker, kredit, dan profil perusahaanmu.", "Manage your jobs, credits, and company profile.")
          : t("Masuk untuk melanjutkan pencarian kariermu.", "Sign in to continue your job search.")}
      </p>
      <ErrorNote message={error} />
      <Field
        label="Email"
        icon={<Mail size={16} color={T.inkFaint} />}
        placeholder={mitra ? t("hrd@perusahaan.co.id", "hr@company.com") : t("nama@email.com", "name@email.com")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Field
        label={t("Kata sandi", "Password")}
        type="password"
        toggle
        icon={<Lock size={16} color={T.inkFaint} />}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <div style={{ textAlign: "right", marginBottom: 20 }}>
        <span
          style={{
            fontSize: 13,
            color: T.accent,
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => go("forgot")}
        >
          {t("Lupa kata sandi?", "Forgot password?")}
        </span>
      </div>
      <Button
        variant="primary"
        style={{ width: "100%" }}
        onClick={handleSubmit}
        disabled={loading || googleLoading}
      >
        {loading ? (
          <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <>
            {t("Masuk", "Sign in")}{" "}<ArrowRight size={15} />
          </>
        )}
      </Button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "20px 0",
        }}
      >
        <div style={{ flex: 1, height: 1, background: T.border }} />
        <span style={{ fontSize: 12, color: T.inkFaint }}>atau</span>
        <div style={{ flex: 1, height: 1, background: T.border }} />
      </div>
      <GoogleButton
        onClick={handleGoogle}
        disabled={loading || googleLoading}
      />
      <div
        style={{
          textAlign: "center",
          marginTop: 22,
          fontSize: 13.5,
          color: T.inkSoft,
        }}
      >
        <span
          onClick={() => (mitra ? keHalaman("/pemberi-kerja") : go("landing"))}
          style={{
            display: "inline-block",
            marginBottom: 10,
            cursor: "pointer",
            color: T.inkFaint,
            fontSize: 12.5,
          }}
        >
          {t("← Kembali ke beranda", "← Back to home")}
        </span>
        <br />
        {mitra ? t("Belum punya akun perusahaan?", "No company account yet?") : t("Belum punya akun?", "Don't have an account?")}{" "}
        <span
          style={{ color: T.accent, fontWeight: 600, cursor: "pointer" }}
          onClick={() => (mitra ? keHalaman("/pemberi-kerja/daftar") : go("register"))}
        >
          {mitra ? t("Daftar perusahaan", "Register your company") : t("Daftar", "Sign up")}
        </span>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}`, fontSize: 12.5 }}>
          {mitra ? t("Mencari kerja? ", "Looking for work? ") : t("Mau pasang loker? ", "Hiring? ")}
          <span
            style={{ color: T.accent, fontWeight: 600, cursor: "pointer" }}
            onClick={() => keHalaman(mitra ? "/login" : "/pemberi-kerja/masuk")}
          >
            {mitra ? t("Masuk sebagai pencari kerja", "Sign in as a job seeker") : t("Masuk sebagai perusahaan", "Sign in as a company")}
          </span>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AuthWrap>
  );
}
