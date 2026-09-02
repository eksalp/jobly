import React from "react";
import { Logo } from "../../components/ui/Logo";
import { Glass } from "../../components/ui/Glass";

export function AuthWrap({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <Logo size={30} />
        </div>
        <Glass style={{ padding: 32 }}>{children}</Glass>
      </div>
    </div>
  );
}

