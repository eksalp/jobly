import React from "react";
import { Sparkles, Clock, Zap } from "lucide-react";
import { T } from "../theme";
import { useLangganan } from "../hooks/useLangganan";

/**
 * Kartu status langganan di sidebar.
 *
 * Sengaja menampilkan sisa kuota sebagai angka, bukan sekadar "aktif".
 * User yang tidak tahu sisa jatahnya cenderung ragu memakainya —
 * dan jatah yang tidak terpakai tidak menghasilkan kebiasaan.
 */
export function KartuLangganan({ setActive }) {
  const {
    aktif,
    detailPaket,
    sisaHari,
    sisaAnalisis,
    kuotaAnalisis,
    segeraBerakhir,
    kuotaMenipis,
    jumlahPaket,
    loading,
  } = useLangganan();

  if (loading) return null;

  const keParket = () => setActive?.("paket");

  /* ---- Belum berlangganan ---- */
  if (!aktif) {
    return (
      <button
        onClick={keParket}
        style={{
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          background: "rgba(76,99,224,0.07)",
          border: `1px solid rgba(76,99,224,0.25)`,
          borderRadius: 12,
          padding: "12px 13px",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <Sparkles size={13} color={T.accent} />
          <span style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>
            Buka semua fitur
          </span>
        </div>
        <div style={{ fontSize: 10.5, color: T.inkSoft, lineHeight: 1.5 }}>
          Analisis AI, CV Builder, dan seluruh loker yang cocok
        </div>
        <div
          style={{
            fontSize: 11,
            color: T.accent,
            fontWeight: 600,
            marginTop: 7,
          }}
        >
          Lihat paket →
        </div>
      </button>
    );
  }

  /* ---- Berlangganan ---- */
  const perluPerhatian = segeraBerakhir || kuotaMenipis;
  const warna = perluPerhatian ? "#B45309" : T.teal;
  const latar = perluPerhatian
    ? "rgba(217,119,6,0.07)"
    : "rgba(20,184,166,0.07)";
  const tepi = perluPerhatian ? "rgba(217,119,6,0.3)" : "rgba(20,184,166,0.28)";

  const persenKuota =
    kuotaAnalisis > 0 ? (sisaAnalisis / kuotaAnalisis) * 100 : 0;

  return (
    <button
      onClick={keParket}
      style={{
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        background: latar,
        border: `1px solid ${tepi}`,
        borderRadius: 12,
        padding: "12px 13px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: warna,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 11.5, fontWeight: 600, color: T.ink }}>
          {detailPaket?.nama ?? "Langganan aktif"}
        </span>
        {jumlahPaket > 1 && (
          <span
            title={`${jumlahPaket} paket aktif, kuotanya digabung`}
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: T.teal,
              background: "rgba(20,184,166,0.14)",
              padding: "1px 6px",
              borderRadius: 99,
            }}
          >
            +{jumlahPaket - 1}
          </span>
        )}
      </div>

      {/* Sisa analisis — angka besar supaya langsung terbaca */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          marginBottom: 5,
        }}
      >
        <Zap size={12} color={warna} style={{ alignSelf: "center" }} />
        <span
          style={{ fontSize: 17, fontWeight: 700, color: T.ink, lineHeight: 1 }}
        >
          {sisaAnalisis}
        </span>
        <span style={{ fontSize: 10.5, color: T.inkFaint }}>
          / {kuotaAnalisis} analisis tersisa
        </span>
      </div>

      {/* Bilah kuota */}
      <div
        style={{
          height: 3,
          borderRadius: 99,
          background: "rgba(0,0,0,0.07)",
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: `${persenKuota}%`,
            height: "100%",
            background: warna,
            transition: "width .3s",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 10.5,
          color: T.inkSoft,
        }}
      >
        <Clock size={10} />
        {sisaHari > 0 ? `Aktif ${sisaHari} hari lagi` : "Berakhir hari ini"}
      </div>

      {perluPerhatian && (
        <div
          style={{
            fontSize: 10.5,
            color: warna,
            fontWeight: 600,
            marginTop: 7,
          }}
        >
          {kuotaMenipis && sisaAnalisis === 0
            ? "Kuota habis — tambah paket →"
            : kuotaMenipis
              ? "Kuota menipis →"
              : "Perpanjang sekarang →"}
        </div>
      )}
    </button>
  );
}
