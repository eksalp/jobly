import React, { useState } from "react";
import { User, Mail, Lock, Loader2, Building2 } from "lucide-react";
import { T } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Field, ErrorNote, GoogleButton } from "../../components/ui/FormControls";
import { AuthWrap } from "./AuthWrap";
import { keHalaman } from "../../utils/navigasi";
import { t } from "../../i18n.js";

/** Halaman daftar. `jenis` = "pekerja" (/register) atau "perusahaan" (/pemberi-kerja/daftar). */
export function RegisterPage({ go, jenis = "pekerja" }) {
  const mitra = jenis === "perusahaan";
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [namaPt, setNamaPt] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !password || (mitra && !namaPt.trim())) {
      setError(t("Lengkapi semua kolom dulu ya.", "Please fill in every field."));
      return;
    }
    if (password.length < 8) {
      setError(t("Kata sandi minimal 8 karakter.", "Password must be at least 8 characters."));
      return;
    }
    setError("");
    setInfo("");
    setLoading(true);
    const { data, error: err } = await signUpWithEmail(
      email.trim(),
      password,
      fullName.trim(),
      mitra ? "perusahaan" : "pekerja",
      mitra ? { nama_perusahaan: namaPt.trim() } : {},
    );
    if (!err && mitra) {
      // Dipakai untuk mengisi nama di formulir profil perusahaan
      try {
        localStorage.setItem("jobly:nama-perusahaan", namaPt.trim());
      } catch {
        /* penyimpanan tidak tersedia */
      }
    }
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    // Kalau "Confirm email" aktif di Supabase Auth settings, session belum
    // langsung ada sampai user klik link di email.
    if (data?.session) {
      if (mitra) keHalaman("/pemberi-kerja/dasbor");
      else go("dashboard");
    } else {
      setInfo(
        t("Akun berhasil dibuat! Cek email kamu untuk konfirmasi sebelum login.", "Account created! Check your email to confirm before signing in."),
      );
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const { error: err } = await signInWithGoogle(mitra ? "perusahaan" : "pekerja");
    if (err) {
      setError(err);
      setGoogleLoading(false);
    }
  };

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
        {mitra ? t("Daftarkan perusahaanmu", "Register your company") : t("Mulai perjalanan kariermu", "Start your career journey")}
      </h1>
      <p style={{ fontSize: 13.5, color: T.inkSoft, marginBottom: 24 }}>
        {mitra
          ? t("Akun perusahaan gratis. Kredit loker baru dibeli saat kamu siap memasang loker.", "Company accounts are free. Buy job credits only when you're ready to post.")
          : t("Buat akun gratis, tanpa kartu kredit.", "Create a free account, no credit card needed.")}
      </p>
      <ErrorNote message={error} />
      {info && (
        <div
          style={{
            fontSize: 12.5,
            color: T.teal,
            background: "rgba(30,158,139,0.08)",
            border: "1px solid rgba(30,158,139,0.25)",
            borderRadius: 12,
            padding: "10px 12px",
            marginBottom: 16,
          }}
        >
          {info}
        </div>
      )}
      {mitra && (
        <Field
          label={t("Nama perusahaan", "Company name")}
          icon={<Building2 size={16} color={T.inkFaint} />}
          placeholder="PT Contoh Sejahtera"
          value={namaPt}
          onChange={(e) => setNamaPt(e.target.value)}
          autoComplete="organization"
        />
      )}
      <Field
        label={mitra ? t("Nama kamu (penanggung jawab rekrutmen)", "Your name (hiring contact)") : t("Nama lengkap", "Full name")}
        icon={<User size={16} color={T.inkFaint} />}
        placeholder={t("Nama kamu", "Your name")}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        autoComplete="name"
      />
      <Field
        label={mitra ? t("Email kerja", "Work email") : "Email"}
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
        placeholder={t("Minimal 8 karakter", "At least 8 characters")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />
      <Button
        variant="primary"
        style={{ width: "100%", marginTop: 4 }}
        onClick={handleSubmit}
        disabled={loading || googleLoading}
      >
        {loading ? (
          <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          mitra ? t("Buat akun perusahaan", "Create company account") : t("Buat Akun", "Create account")
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
      <GoogleButton onClick={handleGoogle} disabled={loading || googleLoading} />
      <div
        style={{
          textAlign: "center",
          marginTop: 22,
          fontSize: 13.5,
          color: T.inkSoft,
        }}
      >
        {mitra ? t("Sudah punya akun perusahaan?", "Already have a company account?") : t("Sudah punya akun?", "Already have an account?")}{" "}
        <span
          style={{ color: T.accent, fontWeight: 600, cursor: "pointer" }}
          onClick={() => (mitra ? keHalaman("/pemberi-kerja/masuk") : go("login"))}
        >
          {t("Masuk", "Sign in")}
        </span>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}`, fontSize: 12.5 }}>
          {mitra ? t("Mencari kerja? ", "Looking for work? ") : t("Mau pasang loker? ", "Hiring? ")}
          <span
            style={{ color: T.accent, fontWeight: 600, cursor: "pointer" }}
            onClick={() => keHalaman(mitra ? "/register" : "/pemberi-kerja/daftar")}
          >
            {mitra ? t("Daftar sebagai pencari kerja", "Sign up as a job seeker") : t("Daftarkan perusahaan", "Register your company")}
          </span>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AuthWrap>
  );
}

