import { useState, useEffect, useCallback } from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

/* Tahapan lamaran. Urutannya menentukan urutan kolom di papan. */
export const TAHAPAN = [
  {
    id: "dilamar",
    label: "Dilamar",
    warna: "#8891A8",
    deskripsi: "Lamaran sudah dikirim",
  },
  {
    id: "ditinjau",
    label: "Ditinjau",
    warna: "#4C63E0",
    deskripsi: "Sedang diproses HR",
  },
  {
    id: "interview",
    label: "Interview",
    warna: "#C98A1E",
    deskripsi: "Dijadwalkan atau sudah wawancara",
  },
  {
    id: "offer",
    label: "Offer",
    warna: "#14B8A6",
    deskripsi: "Menerima penawaran",
  },
  {
    id: "selesai",
    label: "Selesai",
    warna: "#6B7280",
    deskripsi: "Diterima atau ditolak",
  },
];

/* Hasil akhir, hanya relevan untuk tahap "selesai" */
export const HASIL = [
  { id: "diterima", label: "Diterima", warna: "#0F7B4F" },
  { id: "ditolak", label: "Ditolak", warna: "#B23A3A" },
  { id: "batal", label: "Batal", warna: "#8891A8" },
];

export function useApplications() {
  const { user } = useAuth();
  const [lamaran, setLamaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const muat = useCallback(async () => {
    if (!user || !supabaseConfigured) {
      setLamaran([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("tanggal_lamar", { ascending: false });

    if (err) setError(err.message);
    else {
      setLamaran(data || []);
      setError("");
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    muat();
  }, [muat]);

  /* Tambah lamaran. Dipakai tombol "Lamar" di daftar loker
     maupun form input manual. */
  const tambah = useCallback(
    async (data) => {
      if (!user || !supabaseConfigured) return { error: "Belum masuk akun." };

      const baris = {
        user_id: user.id,
        job_id: data.job_id ? String(data.job_id) : null,
        posisi: data.posisi,
        perusahaan: data.perusahaan,
        lokasi: data.lokasi || null,
        link: data.link || null,
        status: data.status || "dilamar",
        catatan: data.catatan || null,
        tanggal_lamar:
          data.tanggal_lamar || new Date().toISOString().slice(0, 10),
      };

      const { data: hasil, error: err } = await supabase
        .from("applications")
        .insert(baris)
        .select()
        .single();

      if (err) return { error: err.message };
      setLamaran((prev) => [hasil, ...prev]);
      return { data: hasil };
    },
    [user?.id],
  );

  const perbarui = useCallback(
    async (id, perubahan) => {
      // Optimistic: UI langsung berubah, tidak menunggu server
      setLamaran((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...perubahan } : l)),
      );

      const { error: err } = await supabase
        .from("applications")
        .update(perubahan)
        .eq("id", id);

      if (err) {
        setError(err.message);
        muat(); // kembalikan ke kondisi server kalau gagal
      }
    },
    [muat],
  );

  const hapus = useCallback(
    async (id) => {
      const sebelum = lamaran;
      setLamaran((prev) => prev.filter((l) => l.id !== id));

      const { error: err } = await supabase
        .from("applications")
        .delete()
        .eq("id", id);
      if (err) {
        setError(err.message);
        setLamaran(sebelum);
      }
    },
    [lamaran],
  );

  /* Cek apakah sebuah loker sudah pernah dilamar —
     dipakai untuk mengubah tampilan tombol "Lamar". */
  const sudahDilamar = useCallback(
    (jobId) => lamaran.some((l) => l.job_id === String(jobId)),
    [lamaran],
  );

  return {
    lamaran,
    loading,
    error,
    tambah,
    perbarui,
    hapus,
    sudahDilamar,
    muat,
  };
}
