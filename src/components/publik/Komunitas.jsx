import React from "react";
import {
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Music2,
  AtSign,
  MessageCircle,
  Send,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { sosialAktif, grupAktif } from "../../data/situs";

const IKON_SOSIAL = {
  instagram: Instagram,
  tiktok: Music2,
  linkedin: Linkedin,
  x: Twitter,
  youtube: Youtube,
  threads: AtSign,
};
const IKON_GRUP = { whatsapp: MessageCircle, telegram: Send };

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
          <a key={jenis} href={url} {...luar} aria-label={`${label}${handle ? ` ${handle}` : ""}`} title={handle || label}>
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
