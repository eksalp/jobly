import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";
import { PAKET } from "../data/paket";

/**
 * Status langganan dibagikan lewat context, bukan hook per komponen.
 *
 * Sebelumnya tiap komponen memanggil useLangganan() sendiri sehingga
 * punya state terpisah — refresh di halaman paket tidak mengubah kartu
 * di sidebar. Dengan satu context, semua komponen membaca sumber yang sama.
 */
const LanggananContext = createContext(null);

const KOSONG = {
  aktif: false,
  paket: null,
  berakhirAt: null,
  sisaHari: 0,
  kuotaAnalisis: 0,
  kuotaTerpakai: 0,
  sisaAnalisis: 0,
  jumlahPaket: 0,
};

export function LanggananProvider({ children }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(KOSONG);
  const [loading, setLoading] = useState(true);

  const muat = useCallback(async () => {
    if (!user || !supabaseConfigured) {
      setStatus(KOSONG);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc("cek_langganan");

    if (error) {
      console.error("Gagal memeriksa langganan:", error.message);
      setLoading(false);
      return;
    }

    const b = Array.isArray(data) ? data[0] : data;
    setStatus({
      aktif: Boolean(b?.aktif),
      paket: b?.paket ?? null,
      berakhirAt: b?.berakhir_at ?? null,
      sisaHari: b?.sisa_hari ?? 0,
      kuotaAnalisis: b?.kuota_analisis ?? 0,
      kuotaTerpakai: b?.kuota_terpakai ?? 0,
      sisaAnalisis: b?.sisa_analisis ?? 0,
      jumlahPaket: b?.jumlah_paket ?? 0,
    });
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    muat();
  }, [muat]);

  const detailPaket = status.paket ? PAKET[status.paket] : null;

  const nilai = {
    ...status,
    detailPaket,
    // Peringatan menjelang habis — supaya user memperpanjang sebelum
    // aksesnya terputus, bukan sesudah.
    segeraBerakhir: status.aktif && status.sisaHari <= 3,
    kuotaMenipis: status.aktif && status.sisaAnalisis <= 1,
    loading,
    refresh: muat,
  };

  return (
    <LanggananContext.Provider value={nilai}>
      {children}
    </LanggananContext.Provider>
  );
}

export function useLangganan() {
  const ctx = useContext(LanggananContext);
  if (!ctx) {
    throw new Error("useLangganan harus dipakai di dalam <LanggananProvider>");
  }
  return ctx;
}
