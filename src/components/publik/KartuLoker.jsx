import React from "react";
import { MapPin, Briefcase, Laptop, ArrowRight, Share2 } from "lucide-react";
import { LogoKotak, LogoSumber } from "./LogoKotak";
import {
  infoSumber,
  logoPerusahaan,
  gajiRingkas,
  konversiGaji,
  waktuRelatif,
  labelTipe,
  labelLokasiKerja,
  urlDetail,
  lokerBaru,
  kotaDari,
} from "../../utils/sumberLoker";
import { useKurs, idrPer, rupiahRingkas } from "../../utils/kurs";
import { tautan, bagikan } from "../../utils/navigasi";

/**
 * Kartu loker Jobly.
 *
 *   [logo] Perusahaan                     [Baru]
 *          [sumber] LinkedIn · 2 hari lalu
 *   Judul posisi (maks. 2 baris)
 *   📍 Kota   💼 Full time   💻 Remote
 *   ─────────────────────────────────────────
 *   Rp 15–25 jt / bulan
 *   ≈ Rp 71,6 jt per bulan   (khusus gaji mata uang asing)
 *   Lihat detail →                        [bagikan]
 *
 * Seluruh kartu bisa diklik; tombol bagikan berada di atas lapisan itu.
 */
export function KartuLoker({ job, onToast }) {
  const { rates } = useKurs();
  const sumber = infoSumber(job);
  const logo = logoPerusahaan(job);
  const gaji = gajiRingkas(job);
  const rupiah = konversiGaji(job, rates, idrPer, rupiahRingkas);
  const tipe = labelTipe(job);
  const lokasiKerja = labelLokasiKerja(job);
  const kota = kotaDari(job.lokasi) || job.lokasi;
  const kapan = waktuRelatif(job.tanggal);
  const url = urlDetail(job);

  const klikBagikan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const hasil = await bagikan({
      judul: job.posisi,
      teks: `${job.posisi} — ${job.perusahaan}`,
      url,
    });
    if (hasil === "disalin") onToast?.("Tautan lowongan disalin");
  };

  return (
    <article className="pb-card">
      <a className="pb-card-hit" {...tautan(url)} aria-label={`${job.posisi} di ${job.perusahaan}`} />

      <div className="pb-card-head">
        <LogoKotak src={logo} nama={job.perusahaan} ikon={!logo} ukuran={42} />
        <div className="pb-card-who">
          <div className="pb-card-co">{job.perusahaan}</div>
          <div className="pb-card-src">
            <LogoSumber sumber={sumber} ukuran={15} />
            <span>
              {sumber.nama}
              {kapan ? ` · ${kapan}` : ""}
            </span>
          </div>
        </div>
        {lokerBaru(job.tanggal) && <span className="pb-badge-new">Baru</span>}
      </div>

      <h3>{job.posisi}</h3>

      <ul className="pb-facts">
        {kota && (
          <li>
            <MapPin size={14} /> {kota}
          </li>
        )}
        {tipe && (
          <li>
            <Briefcase size={14} /> {tipe}
          </li>
        )}
        {lokasiKerja && (
          <li>
            <Laptop size={14} /> {lokasiKerja}
          </li>
        )}
      </ul>

      <div className="pb-card-spacer" />

      <div className="pb-sal">
        {gaji ? (
          <>
            <b>{gaji}</b>
            {rupiah && <small>{rupiah}</small>}
          </>
        ) : (
          <span className="none">Gaji tidak dicantumkan</span>
        )}
      </div>

      <div className="pb-card-foot">
        <a className="pb-link" {...tautan(url)}>
          Lihat detail <ArrowRight size={14} />
        </a>
        <button
          type="button"
          className="pb-icon-btn"
          onClick={klikBagikan}
          aria-label="Bagikan lowongan"
          title="Bagikan"
        >
          <Share2 size={15} />
        </button>
      </div>
    </article>
  );
}

/** Kerangka kartu saat data dimuat. */
export function KartuLokerSkeleton() {
  return (
    <div className="pb-card" aria-hidden="true">
      <div className="pb-card-head">
        <div className="pb-skel" style={{ width: 42, height: 42, borderRadius: 11 }} />
        <div style={{ flex: 1 }}>
          <div className="pb-skel" style={{ width: "55%", height: 13 }} />
          <div className="pb-skel" style={{ width: "40%", height: 11, marginTop: 8 }} />
        </div>
      </div>
      <div className="pb-skel" style={{ width: "85%", height: 17, marginTop: 18 }} />
      <div className="pb-skel" style={{ width: "65%", height: 12, marginTop: 12 }} />
      <div className="pb-card-spacer" />
      <div className="pb-sal">
        <div className="pb-skel" style={{ width: "50%", height: 15 }} />
      </div>
    </div>
  );
}
