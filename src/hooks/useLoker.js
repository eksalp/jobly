import { useCallback, useEffect, useRef, useState } from "react";
import { panggilApi, keJob } from "../utils/apiLoker";
import { useJobs } from "../context/JobsContext";

const kunciDari = (o) => JSON.stringify(o, Object.keys(o || {}).sort());

/**
 * Daftar loker berhalaman dari server.
 * filter: { q, kota, lokasi, tipe, sumber, gaji, asing, urut }
 */
export function useDaftarLoker(filter, { n = 24, aktif = true } = {}) {
  const { penuh, siap } = useJobs();
  const [state, setState] = useState({ jobs: [], total: null, terkunci: 0, kursor: null, loading: true, memuatLagi: false, error: null });
  const kunci = kunciDari(filter);
  const versi = useRef(0);

  useEffect(() => {
    if (!aktif || !siap) return;
    const v = ++versi.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    panggilApi("daftar", { ...filter, n }, { penuh })
      .then((d) => {
        if (v !== versi.current) return;
        setState({
          jobs: (d.rows || []).map(keJob),
          total: d.total ?? 0,
          terkunci: d.terkunci ?? 0,
          kursor: d.kursor,
          loading: false,
          memuatLagi: false,
          error: null,
        });
      })
      .catch((e) => v === versi.current && setState((s) => ({ ...s, loading: false, error: e.message, jobs: [] })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kunci, n, penuh, aktif, siap]);

  const muatLagi = useCallback(() => {
    setState((s) => {
      if (!s.kursor || s.memuatLagi) return s;
      const v = versi.current;
      panggilApi("daftar", { ...filter, n, c: s.kursor }, { penuh })
        .then((d) => {
          if (v !== versi.current) return;
          setState((t) => {
            const ada = new Set(t.jobs.map((j) => j.id));
            const baru = (d.rows || []).map(keJob).filter((j) => !ada.has(j.id));
            return { ...t, jobs: [...t.jobs, ...baru], kursor: d.kursor, memuatLagi: false };
          });
        })
        .catch(() => v === versi.current && setState((t) => ({ ...t, memuatLagi: false })));
      return { ...s, memuatLagi: true };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kunci, n, penuh]);

  return { ...state, adaLagi: Boolean(state.kursor), muatLagi };
}

/** Loker yang judul/kategorinya mengandung salah satu kata kunci (untuk pencocokan profil). */
export function useKandidatLoker(kata, { aktif = true, n = 200 } = {}) {
  const { penuh, siap } = useJobs();
  const [state, setState] = useState({ jobs: [], loading: true });
  const daftar = (kata || []).filter(Boolean).slice(0, 24);
  const kunci = daftar.join(",");
  useEffect(() => {
    if (!aktif || !siap) return;
    if (!kunci) {
      setState({ jobs: [], loading: false });
      return;
    }
    let batal = false;
    setState((s) => ({ ...s, loading: true }));
    panggilApi("kandidat", { kata: kunci, n }, { penuh })
      .then((d) => !batal && setState({ jobs: (d.rows || []).map(keJob), loading: false }))
      .catch(() => !batal && setState({ jobs: [], loading: false }));
    return () => {
      batal = true;
    };
  }, [kunci, n, penuh, aktif, siap]);
  return state;
}

/** Beberapa loker berdasarkan id gabungan ("db1:123"). */
export function useLokerById(ids) {
  const { penuh, siap } = useJobs();
  const [state, setState] = useState({ jobs: [], loading: true });
  const kunci = [...(ids || [])].sort().join(",");
  useEffect(() => {
    if (!siap) return;
    if (!kunci) {
      setState({ jobs: [], loading: false });
      return;
    }
    let batal = false;
    setState((s) => ({ ...s, loading: true }));
    panggilApi("id", { ids: kunci }, { penuh, segar: true })
      .then((d) => !batal && setState({ jobs: (d.rows || []).map(keJob), loading: false }))
      .catch(() => !batal && setState({ jobs: [], loading: false }));
    return () => {
      batal = true;
    };
  }, [kunci, penuh, siap]);
  return state;
}

/** Peta gaji yang sudah dihitung server; `posisi` opsional. */
export function usePetaGaji(posisi = "") {
  const [state, setState] = useState({ data: null, loading: true });
  const q = posisi.trim().length >= 2 ? posisi.trim().toLowerCase() : "";
  useEffect(() => {
    let batal = false;
    setState((s) => ({ ...s, loading: true }));
    panggilApi("gaji", { posisi: q })
      .then((d) => !batal && setState({ data: d, loading: false }))
      .catch(() => !batal && setState({ data: null, loading: false }));
    return () => {
      batal = true;
    };
  }, [q]);
  return state;
}

/** Nilai yang baru dipakai setelah berhenti berubah selama `ms`. */
export function useTunda(nilai, ms = 300) {
  const [v, setV] = useState(nilai);
  useEffect(() => {
    const t = setTimeout(() => setV(nilai), ms);
    return () => clearTimeout(t);
  }, [nilai, ms]);
  return v;
}
