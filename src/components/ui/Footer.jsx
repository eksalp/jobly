import React from "react";
import { T } from "../../theme";

/**
 * Footer hak cipta.
 *
 * Tahunnya dihitung otomatis dari tanggal saat ini, bukan ditulis tetap,
 * supaya tidak perlu diperbarui manual tiap pergantian tahun.
 */
export function Footer() {
  const tahun = new Date().getFullYear();

  return (
    <div
      style={{
        textAlign: "center",
        padding: "24px 18px 28px",
        fontSize: 11.5,
        color: T.inkFaint,
        lineHeight: 1.6,
      }}
    >
      © {tahun} Jobly · Dibuat oleh Eksal Pujianto
    </div>
  );
}
