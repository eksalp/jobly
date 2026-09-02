import React from "react";
import { T } from "../../theme";

export function Button({ children, variant = "primary", style, ...props }) {
  const base = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    padding: "12px 22px",
    borderRadius: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all .18s",
    border: "none",
  };
  const variants = {
    primary: {
      background: T.accent,
      color: "#fff",
      boxShadow: "0 6px 18px rgba(76,99,224,0.28)",
    },
    outline: {
      background: "rgba(255,255,255,0.6)",
      color: T.ink,
      border: `1px solid ${T.border}`,
    },
    ghost: { background: "transparent", color: T.inkSoft },
  };
  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
      {...props}
    >
      {children}
    </button>
  );
}

