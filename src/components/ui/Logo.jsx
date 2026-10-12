import React from "react";
import { T } from "../../theme";

/** Tanda Jobly: kotak emerald membulat dengan ikon tas kerja. */
export function LogoMark({ size = 32 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: T.accent,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.54}
        height={size * 0.54}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </div>
  );
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
            Loker gratis untuk semua
          </div>
        )}
      </div>
    </div>
  );
}
