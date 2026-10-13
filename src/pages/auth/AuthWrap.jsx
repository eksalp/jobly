import React from "react";
import { Logo } from "../../components/ui/Logo";
import { T } from "../../theme";
import { t } from "../../i18n.js";

const keHalaman = (path) => (e) => {
  e.preventDefault();
  window.dispatchEvent(new CustomEvent("jf:path", { detail: path }));
};

/**
 * Bingkai halaman masuk / daftar / lupa sandi.
 * Bersih ala remotefreelance.id: header tipis dan kartu bergaris halus.
 */
export function AuthWrap({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--t-surface)" }}>
      <header style={{ borderBottom: `1px solid ${T.border}` }}>
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 24px",
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="/"
            onClick={keHalaman("/")}
            aria-label={t("Ke beranda Jobly", "Go to Jobly home")}
            style={{ textDecoration: "none" }}
          >
            <Logo size={32} tagline />
          </a>
          <a
            href="/loker"
            onClick={keHalaman("/loker")}
            style={{ fontSize: 14, fontWeight: 600, color: T.ink, textDecoration: "none" }}
          >
            {t("Lihat loker ↗", "Browse jobs ↗")}
          </a>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 20px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 18,
              padding: "34px 30px",
              background: "var(--t-surface)",
            }}
          >
            {children}
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${T.border}`,
          textAlign: "center",
          padding: "20px 16px 26px",
          fontSize: 12,
          color: T.inkFaint,
        }}
      >
        © {new Date().getFullYear()}{" "}{t("Jobly · Dibuat oleh Eksal Pujianto", "Jobly · Made by Eksal Pujianto")}
      </div>
    </div>
  );
}
