import React from "react";
import { T } from "../../theme";

/**
 * Latar halaman. Dulu berisi gumpalan warna buram; sekarang polos putih
 * mengikuti gaya bersih remotefreelance.id. Nama komponen dipertahankan
 * supaya pemanggil lama tidak perlu diubah.
 */
export function GlassBackdrop() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: T.bg,
        zIndex: -2,
      }}
    />
  );
}

/**
 * Kartu dasar: putih, garis tipis, sudut 16px, bayangan sangat halus.
 * Dipakai di hampir semua panel dashboard.
 */
export function Glass({ children, style, ...rest }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        boxShadow: "0 1px 2px rgba(17,27,41,0.03)",
        borderRadius: 16,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
