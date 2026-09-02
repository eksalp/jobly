import React from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { T } from "../theme";
import { supabaseConfigured } from "../lib/supabaseClient";
import { useJobs } from "../context/JobsContext";

export default function DataSourceBanner() {
  const { loading, error, usingDemo, refresh } = useJobs();
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12.5,
          color: T.inkSoft,
          background: "rgba(255,255,255,0.5)",
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: "10px 14px",
          marginBottom: 16,
        }}
      >
        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
        Menyiapkan daftar loker terbaru...
      </div>
    );
  }
  if (!supabaseConfigured) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
          fontSize: 12.5,
          color: "#8A6D1E",
          background: "#FFF8E6",
          border: "1px solid rgba(202,158,26,0.3)",
          borderRadius: 12,
          padding: "10px 14px",
          marginBottom: 16,
        }}
      >
        <span>
          <AlertCircle
            size={13}
            style={{ verticalAlign: -2, marginRight: 6 }}
          />
          Sedang menampilkan data contoh. Sambungan ke sumber loker belum
          dikonfigurasi.
        </span>
      </div>
    );
  }
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
          fontSize: 12.5,
          color: "#B23A3A",
          background: "#FDEEEE",
          border: "1px solid rgba(178,58,58,0.25)",
          borderRadius: 12,
          padding: "10px 14px",
          marginBottom: 16,
        }}
      >
        <span>
          <AlertCircle
            size={13}
            style={{ verticalAlign: -2, marginRight: 6 }}
          />
          Gagal memuat loker terbaru — sementara menampilkan data contoh.
        </span>
        <button
          onClick={refresh}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "none",
            border: "1px solid rgba(178,58,58,0.35)",
            color: "#B23A3A",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={12} /> Coba lagi
        </button>
      </div>
    );
  }
  if (usingDemo) return null;
  return null;
}
