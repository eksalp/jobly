import React from "react";
import {
  MapPin,
  Briefcase,
  Laptop,
  ArrowRight,
  Share2,
  Bookmark,
  BookmarkCheck,
  ListPlus,
  ListChecks,
} from "lucide-react";
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
import { tautan, bagikan, keHalaman } from "../../utils/navigasi";
import { useAuth } from "../../context/AuthContext";
import { useSavedJobs } from "../../context/SavedJobsContext";

/**
 * Kartu loker Jobly — dipakai di Beranda, Semua loker, Cocok untukku,
 * Tersimpan, dan Loker serupa.
 *
 *   [logo] Perusahaan                     [Baru]
 *          [sumber] LinkedIn · 2 hari lalu
 *   Judul posisi (maks. 2 baris)
 *   Kota · Full time · Remote
 *   [82% cocok ████████░░]  (opsional, halaman Cocok untukku)
 *   ─────────────────────────────────────────
 *   Rp 15–25 jt / bulan
 *   ≈ Rp 71,6 jt per bulan   (khusus gaji mata uang asing)
 *   Lihat detail →               [simpan] [lacak] [bagikan]
 *
 * Props opsional:
 *   cocok   { persen, alasan }  — skor kecocokan dengan profil
 *   onLacak (job) => void       — tampilkan tombol "lacak lamaran"
 *   dilamar boolean             — lamaran sudah dicatat
 */
export function KartuLoker({ job, onToast, cocok, onLacak, dilamar }) {
  const { rates } = useKurs();
  const { session } = useAuth();
  const { isSaved, toggleSave } = useSavedJobs();

  const sumber = infoSumber(job);
  const logo = logoPerusahaan(job);
  const gaji = gajiRingkas(job);
  const rupiah = konversiGaji(job, rates, idrPer, rupiahRingkas);
  const tipe = labelTipe(job);
  const lokasiKerja = labelLokasiKerja(job);
  const kota = kotaDari(job.lokasi) || job.lokasi;
  const kapan = waktuRelatif(job.tanggal);
  const url = urlDetail(job);
  const tersimpan = isSaved(job.id);

  const henti = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const klikBagikan = async (e) => {
    henti(e);
    const hasil = await bagikan({
      judul: job.posisi,
      teks: `${job.posisi} di ${job.perusahaan}`,
      url,
    });
    if (hasil === "disalin") onToast?.("Tautan lowongan disalin");
  };

  const klikSimpan = (e) => {
    henti(e);
    if (!session) {
      keHalaman("/login");
      return;
    }
    toggleSave(job.id);
    onToast?.(tersimpan ? "Dihapus dari loker tersimpan" : "Disimpan ke Loker tersimpan");
  };

  const klikLacak = (e) => {
    henti(e);
    if (!dilamar) onLacak?.(job);
  };

  return (
    <article className="pb-card">
      <a className="pb-card-hit" {...tautan(url)} aria-label={`${job.posisi} di ${job.perusahaan}`} />

      <div className="pb-card-head">
        <LogoKotak src={logo} nama={job.perusahaan} ikon={!logo} ukuran={40} />
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

      {cocok && cocok.persen > 0 && (
        <div className="pb-match">
          <div className="pb-match-top">
            <b>{cocok.persen}% cocok</b>
            <span className="pb-match-bar" aria-hidden="true">
              <i style={{ width: `${cocok.persen}%` }} />
            </span>
          </div>
          {cocok.alasan && <p>{cocok.alasan}</p>}
        </div>
      )}

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
        <div className="pb-card-acts">
          <button
            type="button"
            className={`pb-icon-btn ${tersimpan ? "on" : ""}`}
            onClick={klikSimpan}
            aria-label={tersimpan ? "Hapus dari tersimpan" : "Simpan loker"}
            aria-pressed={tersimpan}
            title={tersimpan ? "Tersimpan" : "Simpan"}
          >
            {tersimpan ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>
          {onLacak && (
            <button
              type="button"
              className={`pb-icon-btn ${dilamar ? "on" : ""}`}
              onClick={klikLacak}
              aria-label={dilamar ? "Sudah dicatat di Lamaran saya" : "Catat ke Lamaran saya"}
              title={dilamar ? "Sudah dicatat di Lamaran saya" : "Catat ke Lamaran saya"}
              disabled={dilamar}
            >
              {dilamar ? <ListChecks size={15} /> : <ListPlus size={15} />}
            </button>
          )}
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
      </div>
    </article>
  );
}

/** Kerangka kartu saat data dimuat. */
export function KartuLokerSkeleton() {
  return (
    <div className="pb-card" aria-hidden="true">
      <div className="pb-card-head">
        <div className="pb-skel" style={{ width: 40, height: 40, borderRadius: 10 }} />
        <div style={{ flex: 1 }}>
          <div className="pb-skel" style={{ width: "60%", height: 13 }} />
          <div className="pb-skel" style={{ width: "42%", height: 11, marginTop: 8 }} />
        </div>
      </div>
      <div className="pb-skel" style={{ width: "88%", height: 16, marginTop: 18 }} />
      <div className="pb-skel" style={{ width: "66%", height: 12, marginTop: 12 }} />
      <div className="pb-card-spacer" />
      <div className="pb-sal">
        <div className="pb-skel" style={{ width: "55%", height: 15 }} />
      </div>
    </div>
  );
}
