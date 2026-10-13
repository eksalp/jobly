import React from "react";
import { Lock, Unlock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useJobs } from "../../context/JobsContext";
import { tautan } from "../../utils/navigasi";
import { DAFTAR_PAKET, rupiah } from "../../data/paket";
import { lokal, t } from "../../i18n.js";

const angka = (n) => Number(n || 0).toLocaleString(lokal());
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
    <div className="pb-kunci" role="region" aria-label={t("Loker terkunci", "Locked jobs")}>
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
        <h3>
          {jumlah != null
            ? t(`${angka(terkunci)} loker lagi cocok dengan pencarianmu`, `${angka(terkunci)} more jobs match your search`)
            : t(`${angka(terkunci)} loker lagi menunggumu`, `${angka(terkunci)} more jobs are waiting`)}
        </h3>
        <p>
          {t(
            `Akun gratis bisa membuka ${angka(batasGratis)} loker terbaru, diambil merata dari setiap sumber. Mau lihat semuanya, termasuk loker yang baru masuk tiap hari? Pilih paket mana saja, mulai ${rupiah(termurah)} sekali bayar.`,
            `A free account opens the ${angka(batasGratis)} newest jobs, taken evenly from every source. Want to see them all, including jobs added every day? Any plan works, from ${rupiah(termurah)} one-time.`,
          )}
        </p>
        <div className="pb-kunci-act">
          <a className="pb-btn pb-btn-primary" {...tautan(tujuan)}>
            <Unlock size={16} /> {t("Buka semua loker", "Unlock all jobs")}
          </a>
          <a className="pb-btn pb-btn-outline" {...tautan("/#harga")}>
            {t("Lihat paket", "See plans")}
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
        {t("Kamu sedang melihat", "You're viewing")} <b>{angka(batasGratis)}</b> {t("dari", "of")} <b>{angka(total)}</b>{" "}
        {t(
          "loker, yaitu yang terbaru dari setiap sumber. Pencarian dan filter hanya berlaku untuk loker yang terbuka.",
          "jobs, the newest from each source. Search and filters only apply to unlocked jobs.",
        )}
      </span>
      <a {...tautan(tujuan)}>{t("Buka semua", "Unlock all")}</a>
    </div>
  );
}
