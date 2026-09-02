import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { T } from "../../theme";
import { Button } from "./Button";

export function Field({
  label,
  type = "text",
  icon,
  placeholder,
  toggle,
  value,
  onChange,
  autoComplete,
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: T.ink,
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "12px 14px",
          background: "rgba(255,255,255,0.7)",
          gap: 10,
        }}
      >
        {icon}
        <input
          type={isPw ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: 14,
            fontFamily: "'Poppins', sans-serif",
            background: "transparent",
            color: T.ink,
            width: "100%",
          }}
        />
        {isPw && toggle && (
          <span
            style={{ cursor: "pointer", color: T.inkFaint }}
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </span>
        )}
      </div>
    </div>
  );
}

export function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 7,
        fontSize: 12.5,
        color: "#B23A3A",
        background: "#FDEEEE",
        border: "1px solid rgba(178,58,58,0.25)",
        borderRadius: 12,
        padding: "10px 12px",
        marginBottom: 16,
      }}
    >
      <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{message}</span>
    </div>
  );
}

export function GoogleButton({ onClick, disabled }) {
  return (
    <Button
      variant="outline"
      style={{ width: "100%" }}
      onClick={onClick}
      disabled={disabled}
    >
      <svg width="16" height="16" viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.8 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3c-7.5 0-13.9 4.3-17.1 10.6z"
        />
        <path
          fill="#4CAF50"
          d="M24 45c5.4 0 10.3-1.8 14.1-5l-6.5-5.5C29.5 36 26.9 37 24 37c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.9 40.5 16.4 45 24 45z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H24v8h11.3c-1 3.1-3.3 5.6-6.3 7.1l6.5 5.5C39.6 37.4 43 31.2 43 24c0-1.2-.1-2.4-.4-3.5z"
        />
      </svg>
      Lanjutkan dengan Google
    </Button>
  );
}
