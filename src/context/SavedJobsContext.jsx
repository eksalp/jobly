import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

export const SavedJobsContext = createContext({
  savedIds: new Set(),
  loading: true,
  isSaved: () => false,
  toggleSave: async () => {},
});

export function useSavedJobs() {
  return useContext(SavedJobsContext);
}

export function SavedJobsProvider({ children }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !supabaseConfigured) {
      setSavedIds(new Set());
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("saved_jobs")
      .select("job_id")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Gagal memuat saved jobs:", error.message);
          setSavedIds(new Set());
        } else {
          setSavedIds(new Set((data || []).map((r) => r.job_id)));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const isSaved = (jobId) => savedIds.has(jobId);

  const toggleSave = async (jobId) => {
    if (!user || !supabaseConfigured) return;
    const currentlySaved = savedIds.has(jobId);
    // Optimistic update dulu biar UI langsung responsif
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (currentlySaved) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
    if (currentlySaved) {
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("user_id", user.id)
        .eq("job_id", jobId);
      if (error) console.error("Gagal hapus saved job:", error.message);
    } else {
      const { error } = await supabase
        .from("saved_jobs")
        .insert({ user_id: user.id, job_id: jobId });
      if (error) console.error("Gagal simpan job:", error.message);
    }
  };

  return (
    <SavedJobsContext.Provider
      value={{ savedIds, loading, isSaved, toggleSave }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

