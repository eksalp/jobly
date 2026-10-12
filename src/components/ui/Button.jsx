import React from "react";
import { T } from "../../theme";

export function Button({ children, variant = "primary", style, ...props }) {
  const base = {
    fontFamily: T.sans,
    fontWeight: 600,
    fontSize: 14,
    padding: "12px 20px",
    borderRadius: 12,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all .16s",
    border: "1px solid transparent",
  };
  const variants = {
    primary: {
      background: T.accent,
      color: "#fff",
    },
    outline: {
      background: T.surface,
      color: T.ink,
      border: `1px solid ${T.border}`,
    },
    ghost: { background: "transparent", color: T.inkSoft },
  };
  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
      {...props}
    >
      {children}
    </button>
  );
}
