import React, { useState } from "react";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { T } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Field, ErrorNote, GoogleButton } from "../../components/ui/FormControls";
import { AuthWrap } from "./AuthWrap";
import { t } from "../../i18n.js";

export function RegisterPage({ go }) {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
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
    );
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    // Kalau "Confirm email" aktif di Supabase Auth settings, session belum
    // langsung ada sampai user klik link di email.
    if (data?.session) {
      go("dashboard");
    } else {
      setInfo(
        t("Akun berhasil dibuat! Cek email kamu untuk konfirmasi sebelum login.", "Account created! Check your email to confirm before signing in."),
      );
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err);
      setGoogleLoading(false);
    }
  };

  return (
    <AuthWrap>
      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: T.ink,
          marginBottom: 4,
        }}
      >
        {t("Mulai perjalanan kariermu", "Start your career journey")}
      </h1>
      <p style={{ fontSize: 13.5, color: T.inkSoft, marginBottom: 24 }}>
        {t("Buat akun gratis, tanpa kartu kredit.", "Create a free account, no credit card needed.")}
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
      <Field
        label={t("Nama lengkap", "Full name")}
        icon={<User size={16} color={T.inkFaint} />}
        placeholder={t("Nama kamu", "Your name")}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        autoComplete="name"
      />
      <Field
        label="Email"
        icon={<Mail size={16} color={T.inkFaint} />}
        placeholder={t("nama@email.com", "name@email.com")}
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
          t("Buat Akun", "Create account")
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
        {t("Sudah punya akun?", "Already have an account?")}{" "}
        <span
          style={{ color: T.accent, fontWeight: 600, cursor: "pointer" }}
          onClick={() => go("login")}
        >
          {t("Masuk", "Sign in")}
        </span>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AuthWrap>
  );
}

