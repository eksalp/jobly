import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { IkonBidang } from "../../components/publik/IkonBidang";
import { useJobs } from "../../context/JobsContext";
import { BIDANG } from "../../data/bidang";
import { tautan } from "../../utils/navigasi";
import { lokal, t } from "../../i18n.js";

/** Kartu bidang berwarna, dipakai di halaman ini dan di beranda. */
export function GridBidang({ jumlah = {}, loading, batas }) {
  const daftar = batas ? BIDANG.slice(0, batas) : BIDANG;
  return (
    <div className="pb-bidang-grid">
      {daftar.map((b, i) => (
        <a key={b.slug} className="pb-bidang" style={{ "--warna": b.warna, "--i": i }} {...tautan(`/loker?bidang=${b.slug}`)}>
          <span className="pb-bidang-ikon">
            <IkonBidang nama={b.ikon} size={20} />
          </span>
          <span className="pb-bidang-teks">
            <b>{b.nama}</b>
            <small>{b.ket}</small>
          </span>
          <span className="pb-bidang-jml">
            {loading ? "…" : jumlah[b.slug] ? jumlah[b.slug].toLocaleString(lokal()) : ""}
            <ArrowRight size={14} />
          </span>
        </a>
      ))}
    </div>
  );
}

export function BidangPage() {
  const { statistik, loading } = useJobs();
  useEffect(() => {
    document.title = t("Loker per bidang · Jobly", "Jobs by field · Jobly");
  }, []);
  return (
    <PublicLayout aktif="/bidang">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">{t("Jelajahi per bidang", "Browse by field")}</span>
        <h1>{t("Mau kerja di bidang apa?", "Which field do you want to work in?")}</h1>
        <p>
          {t(
            "Pilih bidangmu, Jobly tampilkan semua lowongannya dari situs karier perusahaan, BUMN, LinkedIn, Indeed, dan lainnya.",
            "Pick your field and Jobly shows every opening from company career sites, state-owned enterprises, LinkedIn, Indeed, and more.",
          )}
        </p>
      </div>
      <div className="pb-wrap" style={{ paddingBottom: 56 }}>
        <GridBidang jumlah={statistik.bidang} loading={loading} />
      </div>
    </PublicLayout>
  );
}
