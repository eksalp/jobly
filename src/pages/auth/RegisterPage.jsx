import React, { useState } from "react";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { T } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Field, ErrorNote, GoogleButton } from "../../components/ui/FormControls";
import { AuthWrap } from "./AuthWrap";

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
      setError("Lengkapi semua kolom dulu ya.");
      return;
    }
    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
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
        "Akun berhasil dibuat! Cek email kamu untuk konfirmasi sebelum login.",
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
          fontFamily: "'Poppins', sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: T.ink,
          marginBottom: 4,
        }}
      >
        Mulai perjalanan kariermu
      </h1>
      <p style={{ fontSize: 13.5, color: T.inkSoft, marginBottom: 24 }}>
        Buat akun gratis, tanpa kartu kredit.
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
        label="Nama lengkap"
        icon={<User size={16} color={T.inkFaint} />}
        placeholder="Nama kamu"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        autoComplete="name"
      />
      <Field
        label="Email"
        icon={<Mail size={16} color={T.inkFaint} />}
        placeholder="nama@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Field
        label="Kata sandi"
        type="password"
        toggle
        icon={<Lock size={16} color={T.inkFaint} />}
        placeholder="Minimal 8 karakter"
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
          "Buat Akun"
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
        Sudah punya akun?{" "}
        <span
          style={{ color: T.accent, fontWeight: 600, cursor: "pointer" }}
          onClick={() => go("login")}
        >
          Masuk
        </span>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AuthWrap>
  );
}

