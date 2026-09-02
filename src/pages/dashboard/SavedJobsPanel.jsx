import React from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { T } from "../../theme";
import { useJobs } from "../../context/JobsContext";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { JobRow } from "../../components/JobRow";

export function SavedJobsPanel() {
  const { jobs } = useJobs();
  const { savedIds, loading, isSaved, toggleSave } = useSavedJobs();
  const saved = jobs.filter((j) => savedIds.has(j.id));

  if (loading) {
    return (
      <div
        style={{
          padding: 28,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12.5,
          color: T.inkSoft,
        }}
      >
        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
        Memuat loker tersimpan...
      </div>
    );
  }

  return (
    <div style={{ padding: 28 }}>
      {saved.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <Bookmark size={28} color={T.inkFaint} style={{ marginBottom: 14 }} />
          <div
            style={{
              fontWeight: 600,
              fontSize: 15,
              color: T.ink,
              marginBottom: 6,
            }}
          >
            Belum ada loker disimpan
          </div>
          <div style={{ fontSize: 13, color: T.inkSoft }}>
            Simpan loker yang menarik biar gampang ditinjau lagi nanti.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {saved.map((j) => (
            <JobRow
              key={j.id}
              job={j}
              locked={false}
              saved={isSaved(j.id)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}

