import React from "react";
import { T } from "../../theme";
import { t } from "../../i18n.js";

/**
 * Footer ringkas untuk dashboard. Halaman publik memakai PublicFooter
 * yang lebih lengkap.
 *
 * Tahunnya dihitung otomatis supaya tidak perlu diubah tiap tahun.
 */
export function Footer() {
  const tahun = new Date().getFullYear();

  return (
    <div
      style={{
        borderTop: `1px solid ${T.line}`,
        textAlign: "center",
        padding: "22px 18px 26px",
        fontSize: 12,
        color: T.inkFaint,
        lineHeight: 1.6,
        marginTop: 24,
      }}
    >
      © {tahun}{" "}{t("Jobly · Dibuat oleh Eksal Pujianto", "Jobly · Made by Eksal Pujianto")}
    </div>
  );
}
