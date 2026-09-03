import React from "react";
import { Compass } from "lucide-react";
import { T } from "../../theme";

export function Logo({ size = 26 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: T.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Compass size={size * 0.6} color="#fff" />
      </div>
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          fontSize: 18,
          color: T.ink,
        }}
      >
        Jobly
      </span>
    </div>
  );
}
