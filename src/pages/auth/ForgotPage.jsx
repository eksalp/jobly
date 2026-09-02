import React, { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { T } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Field, ErrorNote } from "../../components/ui/FormControls";
import { AuthWrap } from "./AuthWrap";

export function ForgotPage({ go }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Isi email dulu ya.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: err } = await resetPassword(email.trim());
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setSent(true);
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
        Reset kata sandi
      </h1>
      <p style={{ fontSize: 13.5, color: T.inkSoft, marginBottom: 24 }}>
        Kami akan kirim tautan reset ke emailmu.
      </p>
      <ErrorNote message={error} />
      {sent ? (
        <div
          style={{
            fontSize: 13.5,
            color: T.teal,
            background: "rgba(30,158,139,0.08)",
            border: "1px solid rgba(30,158,139,0.25)",
            borderRadius: 12,
            padding: "14px",
            marginBottom: 4,
          }}
        >
          Tautan reset sudah dikirim ke {email}. Cek inbox (atau folder spam)
          kamu.
        </div>
      ) : (
        <>
          <Field
            label="Email"
            icon={<Mail size={16} color={T.inkFaint} />}
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Button
            variant="primary"
            style={{ width: "100%" }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2
                size={15}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              "Kirim Tautan Reset"
            )}
          </Button>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </>
      )}
      <div
        style={{
          textAlign: "center",
          marginTop: 22,
          fontSize: 13.5,
          color: T.inkSoft,
        }}
      >
        Ingat kata sandimu?{" "}
        <span
          style={{ color: T.accent, fontWeight: 600, cursor: "pointer" }}
          onClick={() => go("login")}
        >
          Masuk
        </span>
      </div>
    </AuthWrap>
  );
}

