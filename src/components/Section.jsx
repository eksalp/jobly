import React from "react";
import { T } from "../theme";

export function Section({ title, color, items, icon }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 8,
            fontSize: 13.5,
            color: T.inkSoft,
            marginBottom: 6,
            alignItems: "flex-start",
          }}
        >
          <span style={{ marginTop: 2, color }}>{icon}</span>
          {it}
        </div>
      ))}
    </div>
  );
}
