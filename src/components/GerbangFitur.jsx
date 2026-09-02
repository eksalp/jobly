import React from "react";
import { Lock, Sparkles } from "lucide-react";
import { T } from "../theme";
import { Glass } from "./ui/Glass";
import { Button } from "./ui/Button";

/**
 * Menutup sebuah fitur untuk user yang belum berlangganan.
 *
 * PENTING: ini murni tampilan. Konten di dalamnya tidak dirender sama
 * sekali saat terkunci (bukan disembunyikan lewat CSS), dan server tetap
 * memeriksa ulang setiap permintaan. Menghapus komponen ini lewat DevTools
 * tidak membuka data apa pun.
 */
export function GerbangFitur({
  terbuka,
  judul,
  keterangan,
  onLangganan,
  tinggiMinimal = 220,
  children,
}) {
  if (terbuka) return <>{children}</>;

  return (
    <Glass
      style={{
        padding: 32,
        minHeight: tinggiMinimal,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        border: `1.5px dashed ${T.border}`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: T.accentSoft,
          color: T.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <Lock size={19} />
      </div>

      <div
        style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 6 }}
      >
        {judul}
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: T.inkSoft,
          lineHeight: 1.65,
          maxWidth: 380,
          marginBottom: 18,
        }}
      >
        {keterangan}
      </div>

      <Button variant="primary" onClick={onLangganan}>
        <Sparkles size={14} /> Lihat paket langganan
      </Button>
    </Glass>
  );
}

/** Bilah status langganan, ditampilkan di atas panel berbayar. */
export function BilahLangganan({ langganan, onLangganan }) {
  const {
    aktif,
    detailPaket,
    sisaHari,
    sisaAnalisis,
    segeraBerakhir,
    kuotaMenipis,
  } = langganan;

  if (!aktif) return null;

  const perluPerhatian = segeraBerakhir || kuotaMenipis;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
        padding: "10px 14px",
        borderRadius: 12,
        background: perluPerhatian
          ? "rgba(217,119,6,0.07)"
          : "rgba(20,184,166,0.07)",
        border: `1px solid ${perluPerhatian ? "rgba(217,119,6,0.35)" : "rgba(20,184,166,0.3)"}`,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>
        {detailPaket?.nama ?? "Langganan aktif"}
      </span>
      <span style={{ fontSize: 11.5, color: T.inkSoft }}>
        {sisaAnalisis} analisis tersisa · aktif {sisaHari} hari lagi
      </span>
      <div style={{ flex: 1 }} />
      {perluPerhatian && (
        <button
          onClick={onLangganan}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#B45309",
            fontSize: 11.5,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            padding: 0,
          }}
        >
          {kuotaMenipis ? "Tambah kuota" : "Perpanjang"}
        </button>
      )}
    </div>
  );
}
