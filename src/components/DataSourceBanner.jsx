import React from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { T } from "../theme";
import { supabaseConfigured } from "../lib/supabaseClient";
import { useJobs } from "../context/JobsContext";
import { t } from "../i18n.js";

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
          background: "var(--t-field)",
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: "10px 14px",
          marginBottom: 16,
        }}
      >
        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
        {t("Menyiapkan daftar loker terbaru...", "Preparing the latest jobs...")}
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
          color: "var(--t-warn-ink)",
          background: "var(--t-warn-bg)",
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
          {t("Sedang menampilkan data contoh. Sambungan ke sumber loker belum dikonfigurasi.", "Showing sample data. The job source connection isn't configured yet.")}
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
          color: "var(--t-danger)",
          background: "var(--t-danger-bg)",
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
          {t("Loker terbaru gagal dimuat, jadi untuk sementara yang tampil data contoh.", "The latest jobs failed to load, so sample data is shown for now.")}
        </span>
        <button
          onClick={refresh}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "none",
            border: "1px solid rgba(178,58,58,0.35)",
            color: "var(--t-danger)",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={12} />{" "}{t("Coba lagi", "Try again")}
        </button>
      </div>
    );
  }
  if (usingDemo) return null;
  return null;
}
