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

// Sebelumnya komponen ini hanya menerima `children` dan `style`, sehingga
// prop lain seperti onClick, onMouseEnter, atau key tidak pernah diteruskan
// ke <div> di dalamnya — inilah sebab kartu riwayat di halaman Pindah Karier
// (dan kemungkinan tempat lain yang memakai Glass dengan onClick) terlihat
// bisa diklik (cursor: pointer dari style) tapi tidak melakukan apa-apa.
//
// Perbaikannya: teruskan semua prop tambahan (...rest) ke <div>, supaya
// event handler apa pun yang dikirim ke <Glass> otomatis berfungsi.
export function Glass({ children, style, ...rest }) {
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
      {...rest}
    >
      {children}
    </div>
  );
}
