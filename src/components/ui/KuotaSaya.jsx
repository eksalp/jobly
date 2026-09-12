import React, { useEffect, useRef } from "react";
import { FileText, Route, Bot, Clock } from "lucide-react";
import { T } from "../../theme";
import { Glass } from "./Glass";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";

/**
 * Ringkasan kuota per jenis analisis.
 *
 * Sebelumnya hanya kuota analisis CV yang ditampilkan di bilah atas,
 * sementara kuota Pindah Karier dan Simulasi Interview cuma muncul di
 * halamannya masing-masing. Akibatnya angka yang kebetulan sama terbaca
 * seolah kuota tidak berkurang — persis kebingungan yang wajar muncul
 * kalau tiga hitungan berbeda tidak pernah ditampilkan berdampingan.
 */
export function KuotaSaya({ langganan, onLangganan, ringkas = false }) {
  const sudahCek = useRef(false);

  /* Memeriksa kuota yang terpotong tanpa hasil.
     
     Dijalankan sekali per pemuatan halaman, di komponen yang muncul di
     semua panel berkuota — jadi kuota yang tertinggal dari sesi mana pun
     ikut terpulihkan tanpa user perlu tahu atau meminta.
     
     Server yang memutuskan layak atau tidak berdasarkan keadaan token,
     jadi pemanggilan berulang pun tidak bisa disalahgunakan. */
  useEffect(() => {
    if (sudahCek.current || !langganan?.aktif || !supabaseConfigured) return;
    sudahCek.current = true;

    supabase.functions
      .invoke("kembalikan-kuota", { body: { klaimTertinggal: true } })
      .then(({ data }) => {
        if (data?.jumlah > 0) {
          console.log(`${data.jumlah} kuota tertinggal dikembalikan`);
          langganan.refresh?.();
        }
      })
      .catch(() => {
        /* Diam-diam saja. Ini pemeriksaan latar; kegagalannya tidak
           perlu mengganggu user yang sedang mengerjakan hal lain. */
      });
  }, [langganan?.aktif]);

  if (langganan?.loading) return null;

  if (!langganan?.aktif) {
    return (
      <Glass
        style={{
          padding: "12px 16px",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{ fontSize: 12.5, color: T.inkSoft, flex: 1, minWidth: 180 }}
        >
          Belum berlangganan — fitur AI masih terkunci.
        </span>
        <button
          onClick={onLangganan}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: T.accent,
            fontSize: 12.5,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            padding: 0,
            flexShrink: 0,
          }}
        >
          Lihat paket →
        </button>
      </Glass>
    );
  }

  // Kuota yang tidak termasuk paket sengaja TETAP ditampilkan dengan
  // angka 0 dan warna redup, bukan disembunyikan. Menyembunyikannya
  // membuat user paket bawah tidak pernah tahu fitur itu ada.
  const daftar = [
    {
      Ikon: FileText,
      label: "Analisis CV",
      sisa: langganan.sisaAnalisis,
      total: langganan.kuotaAnalisis,
    },
    {
      Ikon: Route,
      label: "Pindah Karier",
      sisa: langganan.sisaPindah,
      total: langganan.kuotaPindah,
    },
    {
      Ikon: Bot,
      label: "Simulasi Interview",
      sisa: langganan.sisaInterview,
      total: langganan.kuotaInterview,
    },
  ];

  return (
    <Glass
      style={{ padding: ringkas ? "12px 14px" : "14px 18px", marginBottom: 14 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
            {langganan.detailPaket?.nama ?? "Paket aktif"}
          </span>
          {langganan.jumlahPaket > 1 && (
            <span
              title={`${langganan.jumlahPaket} paket aktif, kuotanya digabung`}
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: T.teal,
                background: "rgba(20,184,166,0.14)",
                padding: "1px 6px",
                borderRadius: 99,
              }}
            >
              +{langganan.jumlahPaket - 1}
            </span>
          )}
        </div>

        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11.5,
            color: langganan.segeraBerakhir ? "#B45309" : T.inkFaint,
            fontWeight: langganan.segeraBerakhir ? 600 : 400,
          }}
        >
          <Clock size={11} />
          Aktif {langganan.sisaHari} hari lagi
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 10,
        }}
      >
        {daftar.map(({ Ikon, label, sisa, total }) => {
          const adaFitur = total > 0;
          const habis = adaFitur && sisa <= 0;
          const persen = adaFitur ? (sisa / total) * 100 : 0;

          const warna = !adaFitur
            ? T.inkFaint
            : habis
              ? "#B23A3A"
              : persen <= 34
                ? "#B45309"
                : T.accent;

          return (
            <div
              key={label}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                background: adaFitur
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(0,0,0,0.02)",
                border: `1px solid ${T.border}`,
                opacity: adaFitur ? 1 : 0.6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 10.5,
                  color: T.inkFaint,
                  marginBottom: 5,
                }}
              >
                <Ikon size={11} />
                {label}
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span
                  style={{
                    fontSize: 19,
                    fontWeight: 700,
                    color: warna,
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {adaFitur ? sisa : "—"}
                </span>
                {adaFitur && (
                  <span style={{ fontSize: 11, color: T.inkFaint }}>
                    / {total}
                  </span>
                )}
              </div>

              {adaFitur ? (
                <div
                  style={{
                    height: 3,
                    borderRadius: 99,
                    marginTop: 7,
                    background: "rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(100, persen))}%`,
                      height: "100%",
                      background: warna,
                      transition: "width .3s",
                    }}
                  />
                </div>
              ) : (
                <div style={{ fontSize: 10, color: T.inkFaint, marginTop: 7 }}>
                  Tidak di paket ini
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ajakan naik paket hanya muncul kalau memang ada yang terkunci
          atau habis — bukan mengganggu user yang kuotanya masih penuh. */}
      {(langganan.kuotaPindah === 0 ||
        langganan.kuotaInterview === 0 ||
        langganan.sisaAnalisis <= 0 ||
        (langganan.kuotaPindah > 0 && langganan.sisaPindah <= 0) ||
        (langganan.kuotaInterview > 0 && langganan.sisaInterview <= 0)) && (
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <button
            onClick={onLangganan}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.accent,
              fontSize: 11.5,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              padding: 0,
            }}
          >
            Tambah kuota →
          </button>
        </div>
      )}
    </Glass>
  );
}
