import React from "react";
import { Lock, Unlock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useJobs } from "../../context/JobsContext";
import { tautan } from "../../utils/navigasi";
import { DAFTAR_PAKET, rupiah } from "../../data/paket";

const angka = (n) => Number(n || 0).toLocaleString("id-ID");
const termurah = Math.min(...DAFTAR_PAKET.map((p) => p.harga));

/** Ke mana tombol "buka semua" mengarah. */
export function useTujuanBuka() {
  const { session } = useAuth();
  return session ? "/dashboard/paket" : "/register";
}

/**
 * Kotak penutup daftar loker untuk akun gratis: kartu buram di belakang,
 * ajakan membuka sisa loker di depan. Dipasang sebagai anak .pb-grid,
 * mengambil satu baris penuh.
 */
export function KartuKunci({ jumlah }) {
  const ctx = useJobs();
  const { batasGratis } = ctx;
  const terkunci = jumlah ?? ctx.terkunci;
  const tujuan = useTujuanBuka();
  if (!terkunci) return null;
  return (
    <div className="pb-kunci" role="region" aria-label="Loker terkunci">
      <div className="pb-kunci-bayang" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i}>
            <i style={{ width: 34, height: 34, borderRadius: 9 }} />
            <i style={{ width: "80%" }} />
            <i style={{ width: "55%" }} />
            <i style={{ width: "40%", marginTop: "auto" }} />
          </div>
        ))}
      </div>
      <div className="pb-kunci-isi">
        <span className="pb-kunci-ic">
          <Lock size={20} />
        </span>
        <h3>{angka(terkunci)} loker lagi {jumlah != null ? "cocok dengan pencarianmu" : "menunggumu"}</h3>
        <p>
          Akun gratis bisa membuka {angka(batasGratis)} loker terbaru, diambil merata dari setiap sumber.
          Mau lihat semuanya, termasuk loker yang baru masuk tiap hari? Pilih paket mana saja, mulai{" "}
          {rupiah(termurah)} sekali bayar.
        </p>
        <div className="pb-kunci-act">
          <a className="pb-btn pb-btn-primary" {...tautan(tujuan)}>
            <Unlock size={16} /> Buka semua loker
          </a>
          <a className="pb-btn pb-btn-outline" {...tautan("/#harga")}>
            Lihat paket
          </a>
        </div>
      </div>
    </div>
  );
}

/** Strip kecil di atas daftar: "5.000 dari 18.240 loker terbuka". */
export function InfoKuotaLoker() {
  const { terkunci, batasGratis, total, loading } = useJobs();
  const tujuan = useTujuanBuka();
  if (!terkunci || loading) return null;
  return (
    <div className="pb-kuota-loker">
      <Lock size={15} />
      <span>
        Kamu sedang melihat <b>{angka(batasGratis)}</b> dari <b>{angka(total)}</b> loker, yaitu
        yang terbaru dari setiap sumber. Pencarian dan filter hanya berlaku untuk loker yang terbuka.
      </span>
      <a {...tautan(tujuan)}>Buka semua</a>
    </div>
  );
}
