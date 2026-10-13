import React from "react";
import { Bookmark } from "lucide-react";
import { useLokerById } from "../../hooks/useLoker";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { useToast } from "../../components/publik/PublicLayout";
import { useApplications } from "../../hooks/useApplications";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { tautan } from "../../utils/navigasi";

export function SavedJobsPanel() {
  const { savedIds, loading } = useSavedJobs();
  // Hanya loker yang disimpan yang diambil dari server, bukan seluruh katalog
  const { jobs: saved, loading: memuatLoker } = useLokerById(savedIds);
  const { tambah: tambahLamaran, sudahDilamar } = useApplications();
  const hp = useLayarKecil(600);
  const [toast, elemenToast] = useToast();

  // Loker tersimpan yang sudah tidak ada lagi di sumber
  const hilang = Math.max(0, savedIds.size - saved.length);
  const memuat = loading || memuatLoker;

  const lacak = async (job) => {
    await tambahLamaran({
      job_id: job.id,
      posisi: job.posisi,
      perusahaan: job.perusahaan,
      lokasi: job.lokasi,
      link: job.link,
    });
    toast("Dicatat di Lamaran saya");
  };

  return (
    <div style={{ padding: hp ? "0 16px" : "0 28px" }}>
      <div className="pb-toolbar">
        <span className="count">
          {memuat ? (
            "Memuat loker tersimpan…"
          ) : (
            <>
              <b>{saved.length}</b> loker tersimpan
              {!memuatLoker && hilang > 0 ? ` · ${hilang} sudah tidak tersedia di sumbernya` : ""}
            </>
          )}
        </span>
        <a className="pb-link" {...tautan("/loker")}>
          Cari loker lain
        </a>
      </div>

      <div className="pb-grid">
        {memuat && Array.from({ length: 4 }, (_, i) => <KartuLokerSkeleton key={i} />)}

        {!memuat &&
          saved.map((j) => (
            <KartuLoker key={j.id} job={j} onLacak={lacak} dilamar={sudahDilamar(j.id)} onToast={toast} />
          ))}

        {!memuat && saved.length === 0 && (
          <div className="pb-empty">
            <Bookmark size={26} color="var(--faint)" style={{ marginBottom: 12 }} />
            <h3>Belum ada loker tersimpan</h3>
            <p style={{ margin: "0 0 18px" }}>
              Tekan ikon simpan di kartu loker untuk menandai lowongan yang ingin kamu lamar nanti.
            </p>
            <a className="pb-btn pb-btn-primary pb-btn-sm" {...tautan("/loker")}>
              Jelajahi loker
            </a>
          </div>
        )}
      </div>

      <div style={{ height: 40 }} />
      {elemenToast}
    </div>
  );
}
