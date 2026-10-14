import { t } from "../../i18n.js";
import React from "react";
import { T } from "../../theme";
import { TandaJobly } from "./TandaJobly";

/** Tanda Jobly: huruf "j" dari pita (komponen bersama, lihat TandaJobly). */
export function LogoMark({ size = 32 }) {
  return <TandaJobly ukuran={size} />;
}

/**
 * Logo lengkap. `tagline` menampilkan teks kecil di bawah nama,
 * seperti "Remote Freelance" yang bertumpuk di header remotefreelance.id.
 */
export function Logo({ size = 30, tagline = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={size} />
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontFamily: T.sans,
            fontWeight: 700,
            fontSize: size * 0.6,
            letterSpacing: "-0.02em",
            color: T.ink,
          }}
        >
          Jobly
        </div>
        {tagline && (
          <div
            style={{
              fontFamily: T.sans,
              fontSize: 10.5,
              fontWeight: 600,
              color: T.inkFaint,
              marginTop: 3,
            }}
          >
            {t("Cari kerja, lebih cepat", "Find work, faster")}
          </div>
        )}
      </div>
    </div>
  );
}
