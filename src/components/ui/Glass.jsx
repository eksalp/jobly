import React from "react";
import { T } from "../../theme";

export function GlassBackdrop() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#FAFBFD",
          zIndex: -2,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: -140,
          left: -100,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: T.accent,
          opacity: 0.1,
          filter: "blur(100px)",
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -160,
          right: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: T.teal,
          opacity: 0.08,
          filter: "blur(110px)",
          zIndex: -1,
        }}
      />
    </>
  );
}

export function Glass({ children, style }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        border: "1px solid rgba(255,255,255,0.8)",
        boxShadow: "0 8px 32px rgba(26,29,41,0.06)",
        borderRadius: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
