import React, { createContext, useContext, useState, useEffect } from "react";
import { supabaseConfigured } from "../lib/supabaseClient";
import { DEMO_JOBS } from "../data/demoJobs";
import { fetchAllJobs } from "../utils/jobMatching";

export const JobsContext = createContext({
  jobs: DEMO_JOBS,
  loading: false,
  error: null,
  usingDemo: true,
  refresh: () => {},
});

export function useJobs() {
  return useContext(JobsContext);
}

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState(supabaseConfigured ? [] : DEMO_JOBS);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [error, setError] = useState(null);
  const [usingDemo, setUsingDemo] = useState(!supabaseConfigured);

  const load = async () => {
    if (!supabaseConfigured) {
      setJobs(DEMO_JOBS);
      setUsingDemo(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllJobs();
      setJobs(data);
      setUsingDemo(false);
    } catch (err) {
      setError(err.message || "Gagal memuat data loker dari Supabase.");
      setJobs(DEMO_JOBS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <JobsContext.Provider
      value={{ jobs, loading, error, usingDemo, refresh: load }}
    >
      {children}
    </JobsContext.Provider>
  );
}
