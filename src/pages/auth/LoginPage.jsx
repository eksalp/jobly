import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { T } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Field, ErrorNote, GoogleButton } from "../../components/ui/FormControls";
import { AuthWrap } from "./AuthWrap";

export function LoginPage({ go }) {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError("Isi email dan kata sandi dulu ya.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: err } = await signInWithEmail(email.trim(), password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    go("dashboard");
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err);
      setGoogleLoading(false);
    }
    // Kalau sukses, browser akan di-redirect ke Google lalu balik lagi —
    // nggak perlu setGoogleLoading(false) di sini.
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
        Selamat datang kembali
      </h1>
      <p style={{ fontSize: 13.5, color: T.inkSoft, marginBottom: 24 }}>
        Masuk untuk melanjutkan pencarian kariermu.
      </p>
      <ErrorNote message={error} />
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
          Lupa kata sandi?
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
            Masuk <ArrowRight size={15} />
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
      <GoogleButton onClick={handleGoogle} disabled={loading || googleLoading} />
      <div
        style={{
          textAlign: "center",
          marginTop: 22,
          fontSize: 13.5,
          color: T.inkSoft,
        }}
      >
        Belum punya akun?{" "}
        <span
          style={{ color: T.accent, fontWeight: 600, cursor: "pointer" }}
          onClick={() => go("register")}
        >
          Daftar
        </span>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AuthWrap>
  );
}

