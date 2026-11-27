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
export function AuthWrap({ children, mitra = false }) {
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
            href={mitra ? "/pemberi-kerja" : "/"}
            onClick={keHalaman(mitra ? "/pemberi-kerja" : "/")}
            aria-label={t("Ke beranda Workly", "Go to Workly home")}
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
          >
            <Logo size={32} tagline={!mitra} />
            {mitra && (
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "var(--brand, #1660F5)",
                  background: "var(--brand-soft, #e8efff)",
                  padding: "3px 9px",
                  borderRadius: 99,
                }}
              >
                {t("untuk Perusahaan", "for Employers")}
              </span>
            )}
          </a>
          <a
            href={mitra ? "/" : "/pemberi-kerja"}
            onClick={keHalaman(mitra ? "/" : "/pemberi-kerja")}
            style={{ fontSize: 13.5, fontWeight: 600, color: T.inkSoft, textDecoration: "none" }}
          >
            {mitra ? t("Mencari kerja? →", "Looking for work? →") : t("Untuk perusahaan →", "For employers →")}
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
        © {new Date().getFullYear()}{" "}{t("Workly · Dibuat oleh Eksal Pujianto", "Workly · Made by Eksal Pujianto")}
      </div>
    </div>
  );
}
