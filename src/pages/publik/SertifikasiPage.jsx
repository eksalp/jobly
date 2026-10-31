import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Award, Clock, Loader2, Search, X, Sparkles, Send } from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { IkonBidang } from "../../components/publik/IkonBidang";
import { BIDANG } from "../../data/bidang";
import { JENJANG, JENIS, MODE, muatSertifikasi, statusDaftar, teksBiaya, skorPosisi, namaBidang } from "../../data/sertifikasi";
import { useUserProfile } from "../../context/UserProfileContext";
import { useAdminJobly } from "../dashboard/AdminSertifikasiPanel";
import { tautan } from "../../utils/navigasi";
import { t } from "../../i18n.js";

const CONTOH_POSISI = ["Data analyst", "Digital marketing", "Staf pajak", "Admin", "HR", "Project manager", "IT support", "Management trainee"];

function KartuSertif({ r }) {
  const st = statusDaftar(r);
  return (
    <article className={`pb-sf-kartu ${st.kode}`}>
      <div className="atas">
        <span className="jenis">{JENIS[r.jenis] || r.jenis}</span>
        <span className={`status ${st.kode}`}>
          <Clock size={12} /> {st.teks}
        </span>
      </div>
      <h3>{r.nama}</h3>
      <small className="oleh">{r.penyelenggara}</small>
      {r.ringkas && <p>{r.ringkas}</p>}
      {r.manfaat && (
        <p className="manfaat">
          <Sparkles size={13} /> {r.manfaat}
        </p>
      )}
      <div className="meta">
        <span className={r.biaya === 0 ? "gratis" : ""}>{teksBiaya(r)}</span>
        <span>{MODE[r.mode] || r.mode}</span>
        {r.durasi && <span>{r.durasi}</span>}
        {r.batch && <span>{r.batch}</span>}
      </div>
      {r.posisi?.length > 0 && (
        <div className="posisi">
          {r.posisi.slice(0, 5).map((p) => (
            <em key={p}>{p}</em>
          ))}
        </div>
      )}
      {r.url && (
        <a className="pb-btn pb-btn-outline pb-btn-sm" href={r.url} target="_blank" rel="noopener noreferrer">
          {t("Lihat & daftar", "View & apply")} <ArrowUpRight size={14} />
        </a>
      )}
    </article>
  );
}

export function SertifikasiPage() {
  const profil = useUserProfile();
  const admin = useAdminJobly();
  const awal = new URLSearchParams(window.location.search);
  const [semua, setSemua] = useState(null);
  const [galat, setGalat] = useState("");
  const [posisi, setPosisi] = useState(awal.get("q") || "");
  const [bidang, setBidang] = useState(awal.get("bidang") || "");

  useEffect(() => {
    document.title = t("Sertifikasi & pelatihan · Jobly", "Certifications & training · Jobly");
    muatSertifikasi().then(({ data, galat: g }) => {
      setSemua(data);
      setGalat(g);
    });
  }, []);

  // Simpan filter di URL supaya bisa dibagikan
  useEffect(() => {
    const p = new URLSearchParams();
    if (posisi.trim()) p.set("q", posisi.trim());
    if (bidang) p.set("bidang", bidang);
    const qs = p.toString();
    window.history.replaceState({}, "", `/sertifikasi${qs ? `?${qs}` : ""}`);
  }, [posisi, bidang]);

  const bidangAda = useMemo(() => new Set((semua || []).flatMap((r) => r.bidang || [])), [semua]);

  const tersaring = useMemo(
    () =>
      (semua || []).filter((r) => !bidang || (r.bidang || []).includes(bidang)),
    [semua, bidang],
  );

  const relevan = useMemo(() => {
    if (!posisi.trim()) return [];
    return tersaring
      .map((r) => ({ r, s: skorPosisi(r, posisi) }))
      .filter((x) => x.s >= 3)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((x) => x.r);
  }, [tersaring, posisi]);

  // Urutan di setiap jenjang: yang segera tutup dulu, lalu yang terbatas waktu, lalu sisanya
  const urutan = { tutupSegera: 0, buka: 1, segera: 2, selalu: 3 };
  const perJenjang = JENJANG.map((j) => ({
    ...j,
    item: tersaring
      .filter((r) => r.jenjang === j.id)
      .sort((a, b) => urutan[statusDaftar(a).kode] - urutan[statusDaftar(b).kode] || (a.tutup || "9").localeCompare(b.tutup || "9")),
  }));

  return (
    <PublicLayout aktif="/sertifikasi">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">
          <Award size={13} /> {t("Sertifikasi & pelatihan", "Certifications & training")}
        </span>
        <h1>{t("Sertifikat apa yang perlu kamu kejar?", "Which certifications should you go for?")}</h1>
        {admin && (
          <a className="pb-btn pb-btn-outline pb-btn-sm" style={{ marginBottom: 8 }} {...tautan("/dashboard/admin-sertifikasi")}>
            {t("Kelola sertifikasi (admin)", "Manage certifications (admin)")}
          </a>
        )}
        <p>
          {t(
            "Rekomendasi sertifikasi, pelatihan, bootcamp, dan beasiswa yang disusun per bidang dan jenjang karier. Jadwal batch diperbarui rutin, dan program yang pendaftarannya sudah tutup otomatis disembunyikan.",
            "Certifications, training, bootcamps, and scholarships organised by field and career stage. Batch dates are updated regularly, and closed programmes are hidden automatically.",
          )}
        </p>
      </div>

      <div className="pb-wrap pb-sf">
        <div className="pb-panel pb-sf-cari">
          <label className="pb-input">
            <Search size={16} color="var(--muted)" />
            <input
              value={posisi}
              onChange={(e) => setPosisi(e.target.value)}
              placeholder={t("Posisi incaranmu, mis. data analyst, staf pajak, HR", "Your target role, e.g. data analyst, tax officer, HR")}
            />
            {posisi && (
              <button type="button" onClick={() => setPosisi("")} aria-label={t("Hapus", "Clear")}>
                <X size={14} />
              </button>
            )}
          </label>
          <div className="pb-sf-saran">
            {profil?.headline && !posisi && (
              <button type="button" className="pb-chip pb-sf-profil" onClick={() => setPosisi(profil.headline.split(/[|·,-]/)[0].trim())}>
                {t("Sesuai profilku", "From my profile")}
              </button>
            )}
            {CONTOH_POSISI.map((p) => (
              <button key={p} type="button" className={`pb-chip ${posisi.toLowerCase() === p.toLowerCase() ? "on" : ""}`} onClick={() => setPosisi(p)}>
                {p}
              </button>
            ))}
          </div>
          <div className="pb-sf-bidang">
            <button type="button" className={`pb-chip ${!bidang ? "on" : ""}`} onClick={() => setBidang("")}>
              {t("Semua bidang", "All fields")}
            </button>
            {BIDANG.filter((b) => bidangAda.has(b.slug)).map((b) => (
              <button key={b.slug} type="button" className={`pb-chip ${bidang === b.slug ? "on" : ""}`} style={{ "--warna": b.warna }} onClick={() => setBidang(b.slug)}>
                <IkonBidang nama={b.ikon} size={13} /> {b.nama}
              </button>
            ))}
          </div>
        </div>

        {semua === null ? (
          <div className="pb-po-muat">
            <Loader2 size={18} className="pb-po-putar" /> {t("Memuat…", "Loading…")}
          </div>
        ) : galat ? (
          <div className="pb-po-galat">{galat}</div>
        ) : (
          <>
            {posisi.trim() && (
              <section className="pb-sf-relevan">
                <h2>
                  {t("Paling relevan untuk", "Most relevant for")} <span>{posisi}</span>
                </h2>
                {relevan.length ? (
                  <div className="pb-sf-grid">
                    {relevan.map((r) => (
                      <KartuSertif key={r.id} r={r} />
                    ))}
                  </div>
                ) : (
                  <p className="pb-po-ket">
                    {t("Belum ada yang cocok persis dengan posisi itu. Lihat jalur karier per bidang di bawah.", "Nothing matches that role exactly yet. Browse the career path by field below.")}
                  </p>
                )}
              </section>
            )}

            <section className="pb-sf-jalur">
              <h2>
                {t("Jalur karier", "Career path")}
                {bidang && <span> · {namaBidang(bidang)}</span>}
              </h2>
              <p className="pb-po-ket">
                {t(
                  "Mulai dari kolom Pemula, lalu naik ke Menengah dan Lanjut seiring pengalamanmu bertambah. Satu sertifikat yang relevan dan selesai lebih berharga daripada banyak sertifikat yang tidak berhubungan dengan posisimu.",
                  "Start in the Starter column, then move up to Intermediate and Advanced as you gain experience. One relevant, completed certificate beats many unrelated ones.",
                )}
              </p>
              <div className="pb-sf-kolom">
                {perJenjang.map((j, i) => (
                  <div key={j.id} className="pb-sf-jenjang">
                    <div className="kepala">
                      <span className="no">{i + 1}</span>
                      <div>
                        <b>{j.nama}</b>
                        <small>{j.ket}</small>
                      </div>
                      {i < 2 && <ArrowRight size={16} className="panah" />}
                    </div>
                    {j.item.length ? (
                      j.item.map((r) => <KartuSertif key={r.id} r={r} />)
                    ) : (
                      <p className="kosong">{t("Belum ada untuk filter ini.", "Nothing for this filter yet.")}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="pb-sf-catatan">
          <Send size={15} />
          <span>
            {t(
              "Jadwal batch dan biaya bisa berubah sewaktu-waktu. Selalu cek situs resmi penyelenggara sebelum mendaftar. Cari lewat Telegram juga bisa: ketik /sertifikasi di bot Jobly.",
              "Batch dates and fees can change at any time. Always check the organiser's official site before applying. You can also search via the Jobly Telegram bot with /sertifikasi.",
            )}
          </span>
        </div>
      </div>
    </PublicLayout>
  );
}
