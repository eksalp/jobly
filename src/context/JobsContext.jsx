import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { supabaseConfigured } from "../lib/supabaseClient";
import { DEMO_JOBS } from "../data/demoJobs";
import { fetchLoker } from "../utils/jobMatching";
import { useAuth } from "./AuthContext";
import { useLangganan } from "./LanggananContext";

/**
 * Akun gratis dan pengunjung bisa membuka BATAS_GRATIS loker. Sisanya
 * terbuka untuk semua paket berbayar yang masih aktif.
 *
 * Catatan: ini pembatasan di sisi tampilan. Untuk penguncian penuh,
 * tabel jobs juga perlu dibatasi lewat RLS/fungsi di Supabase.
 */
export const BATAS_GRATIS = 5000;

export const JobsContext = createContext({
  jobs: DEMO_JOBS,
  loading: false,
  error: null,
  usingDemo: true,
  refresh: () => {},
  total: DEMO_JOBS.length,
  terkunci: 0,
  terbatas: false,
  terbuka: () => true,
});

export function useJobs() {
  return useContext(JobsContext);
}

export function JobsProvider({ children }) {
  const { user, authLoading } = useAuth();
  const langganan = useLangganan();
  const [jobs, setJobs] = useState(supabaseConfigured ? [] : DEMO_JOBS);
  const [total, setTotal] = useState(supabaseConfigured ? 0 : DEMO_JOBS.length);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [error, setError] = useState(null);
  const [usingDemo, setUsingDemo] = useState(!supabaseConfigured);
  const [terbatas, setTerbatas] = useState(false);
  const batasTerakhir = useRef(null);

  // Status langganan baru pasti setelah sesi & cek langganan selesai.
  // Pengunjung tanpa akun tidak perlu menunggu cek langganan.
  const siap = !authLoading && (!user || !langganan.loading);
  const bebas = Boolean(user && langganan.aktif);

  const load = async (paksa = false) => {
    if (!supabaseConfigured) {
      setJobs(DEMO_JOBS);
      setTotal(DEMO_JOBS.length);
      setUsingDemo(true);
      setLoading(false);
      return;
    }
    const batas = bebas ? Infinity : BATAS_GRATIS;
    if (!paksa && batasTerakhir.current === batas) return;
    batasTerakhir.current = batas;

    setLoading(true);
    setError(null);
    try {
      const hasil = await fetchLoker({ batas });
      setJobs(hasil.jobs);
      setTotal(hasil.total);
      setTerbatas(!bebas && hasil.total > hasil.jobs.length);
      setUsingDemo(false);
    } catch (err) {
      setError(err.message || "Gagal memuat data loker dari Supabase.");
      setJobs(DEMO_JOBS);
      setTotal(DEMO_JOBS.length);
      setTerbatas(false);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!siap) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siap, bebas]);

  const idTerbuka = useMemo(() => new Set(jobs.map((j) => j.id)), [jobs]);

  const nilai = {
    jobs,
    loading: loading || (supabaseConfigured && !siap && jobs.length === 0),
    error,
    usingDemo,
    refresh: () => load(true),
    total: Math.max(total, jobs.length),
    terkunci: terbatas ? Math.max(0, total - jobs.length) : 0,
    terbatas,
    batasGratis: BATAS_GRATIS,
    /** Apakah loker ini bisa dibuka akun saat ini. */
    terbuka: (id) => !terbatas || idTerbuka.has(id),
  };

  return <JobsContext.Provider value={nilai}>{children}</JobsContext.Provider>;
}
