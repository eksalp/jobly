import React from "react";
import { AtSign, ArrowUpRight, Users } from "lucide-react";
import { sosialAktif, grupAktif } from "../../data/situs";
import { JALUR_MEREK, VIEWBOX_MEREK } from "../../data/ikonMerek";

/** Ikon merek satu warna (mengikuti currentColor). */
function IkonMerek({ jenis, size = 18 }) {
  const d = JALUR_MEREK[jenis];
  if (!d) return <AtSign size={size} />;
  return (
    <svg width={size} height={size} viewBox={VIEWBOX_MEREK[jenis] || "0 0 24 24"} fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const IKON_SOSIAL = new Proxy({}, { get: (_, jenis) => (p) => <IkonMerek jenis={jenis} {...p} /> });
const IKON_GRUP = IKON_SOSIAL;

const luar = { target: "_blank", rel: "noopener noreferrer" };

/** Deretan ikon media sosial (footer). */
export function IkonSosial() {
  const daftar = sosialAktif();
  if (!daftar.length) return null;
  return (
    <div className="pb-sosial" aria-label="Media sosial Jobly">
      {daftar.map(({ jenis, label, url, handle }) => {
        const Ikon = IKON_SOSIAL[jenis] || AtSign;
        return (
          <a key={jenis} href={url} {...luar} className={`s-${jenis}`} aria-label={`${label}${handle ? ` ${handle}` : ""}`} title={handle || label}>
            <Ikon size={17} />
          </a>
        );
      })}
    </div>
  );
}

/** Tautan grup ringkas (footer & halaman loker). */
export function TautanGrup({ ringkas = false }) {
  const daftar = grupAktif();
  if (!daftar.length) return null;
  return (
    <div className={`pb-grup-tautan ${ringkas ? "ringkas" : ""}`}>
      {daftar.map(({ jenis, label, url }) => {
        const Ikon = IKON_GRUP[jenis] || Users;
        return (
          <a key={jenis} href={url} {...luar} className={`pb-grup-pil ${jenis}`}>
            <Ikon size={15} /> {label}
          </a>
        );
      })}
    </div>
  );
}

/** Bagian "Gabung komunitas" di beranda. Tidak tampil kalau belum ada tautan. */
export function BagianKomunitas() {
  const grup = grupAktif();
  const sosial = sosialAktif();
  if (!grup.length && !sosial.length) return null;
  return (
    <section className="pb-section">
      <div className="pb-wrap">
        <div className="pb-komunitas" data-muncul="">
          <div className="pb-komunitas-teks">
            <span className="pb-label">Komunitas</span>
            <h2 className="pb-h2">Cari kerja nggak harus sendirian.</h2>
            <p className="pb-sub">
              Gabung grup Jobly untuk dapat loker pilihan, info rekrutmen yang
              sedang buka, dan tips melamar — langsung di HP-mu.
            </p>
            {sosial.length > 0 && (
              <div className="pb-komunitas-sosial">
                <span>Ikuti juga</span>
                <IkonSosial />
              </div>
            )}
          </div>
          {grup.length > 0 && (
            <div className="pb-komunitas-grup">
              {grup.map(({ jenis, label, ket, anggota, url, aksi }) => {
                const Ikon = IKON_GRUP[jenis] || Users;
                return (
                  <a key={jenis} href={url} {...luar} className={`pb-grup-kartu ${jenis}`}>
                    <span className="ic">
                      <Ikon size={22} />
                    </span>
                    <span className="isi">
                      <b>{label}</b>
                      <span>{ket}</span>
                      {anggota && <small>{anggota}</small>}
                    </span>
                    <span className="go">
                      {aksi || "Gabung"} <ArrowUpRight size={15} />
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
