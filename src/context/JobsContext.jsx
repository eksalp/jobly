import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { panggilApi, keJob } from "../utils/apiLoker";
import { useAuth } from "./AuthContext";
import { useLangganan } from "./LanggananContext";
import { t } from "../i18n.js";

/**
 * Akun gratis & pengunjung membuka BATAS_GRATIS loker terbaru. Paket
 * berbayar yang masih aktif membuka semuanya. Batas ini ditegakkan di
 * server (/api/loker), bukan di browser.
 */
export const BATAS_GRATIS = 5000;

const KOSONG = {
  total: 0,
  gratis: 0,
  baru7: 0,
  baru2: 0,
  remote: 0,
  remoteAsing: 0,
  kota: {},
  sumber: {},
  terbaru: [],
  remoteContoh: [],
};

export const JobsContext = createContext(null);

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs harus dipakai di dalam <JobsProvider>");
  return ctx;
}

/**
 * Yang dibagikan ke seluruh aplikasi hanya RINGKASAN (statistik beranda,
 * beberapa loker terbaru) — satu permintaan kecil yang di-cache CDN.
 * Daftar loker diambil per halaman lewat hook di src/hooks/useLoker.js.
 */
export function JobsProvider({ children }) {
  const { user, authLoading } = useAuth();
  const langganan = useLangganan();
  const [statistik, setStatistik] = useState(KOSONG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status akses baru pasti setelah sesi & cek langganan selesai.
  const siap = !authLoading && (!user || !langganan.loading);
  const penuh = Boolean(user && langganan.aktif);

  const muat = useCallback(async (segar = false) => {
    setLoading(true);
    setError(null);
    try {
      const d = await panggilApi("statistik", {}, { segar });
      setStatistik({
        ...KOSONG,
        ...d,
        terbaru: (d.terbaru || []).map(keJob),
        remoteContoh: (d.remoteContoh || []).map(keJob),
      });
    } catch (e) {
      setError(e.message || t("Data loker sedang tidak bisa dimuat.", "Job data can't be loaded right now."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  const total = statistik.total || 0;
  const gratis = statistik.gratis || Math.min(total, BATAS_GRATIS);

  const nilai = {
    statistik,
    loading,
    error,
    usingDemo: false,
    refresh: () => muat(true),
    siap,
    penuh,
    total,
    batasGratis: BATAS_GRATIS,
    /** Jumlah loker yang terkunci untuk akun saat ini. */
    terkunci: penuh ? 0 : Math.max(0, total - gratis),
  };

  return <JobsContext.Provider value={nilai}>{children}</JobsContext.Provider>;
}
