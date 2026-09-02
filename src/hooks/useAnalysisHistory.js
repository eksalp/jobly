import { useState, useEffect } from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export function useAnalysisHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user || !supabaseConfigured) {
      setHistory([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("career_analyses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      console.error("Gagal memuat riwayat analisis:", error.message);
      setHistory([]);
    } else {
      setHistory(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const saveAnalysis = async (entry) => {
    if (!user || !supabaseConfigured) return;
    const { data, error } = await supabase
      .from("career_analyses")
      .insert({
        user_id: user.id,
        arah_karier: entry.arah_karier,
        kategori_label: entry.kategori_label,
        kekuatan: entry.kekuatan,
        kekurangan: entry.kekurangan,
        saran_perbaikan: entry.saran_perbaikan,
        job_ranking: entry.job_ranking,
        cv_snapshot: entry.cv_snapshot,
        // Draft ikut disimpan supaya CV Builder & LinkedIn Builder
        // bisa menawarkan pilihan antar-riwayat, bukan hanya yang terakhir.
        cv_draft: entry.cv_draft ?? null,
        linkedin_draft: entry.linkedin_draft ?? null,
        cv_draft_en: entry.cv_draft_en ?? null,
        linkedin_draft_en: entry.linkedin_draft_en ?? null,
        arah_karier_alasan: entry.arah_karier_alasan ?? null,
        posisi_target: entry.posisi_target ?? null,
        bidang_alternatif: entry.bidang_alternatif ?? null,
        source_type: entry.source_type ?? "cv",
      })
      .select()
      .single();
    if (error) {
      console.error("Gagal menyimpan riwayat analisis:", error.message);
      return null;
    }
    setHistory((prev) => [data, ...prev]);
    return data;
  };

  const deleteAnalysis = async (id) => {
    if (!user || !supabaseConfigured) return;
    setHistory((prev) => prev.filter((h) => h.id !== id));
    const { error } = await supabase
      .from("career_analyses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      console.error("Gagal menghapus riwayat:", error.message);
      load();
    }
  };

  return { history, loading, saveAnalysis, deleteAnalysis, refresh: load };
}
