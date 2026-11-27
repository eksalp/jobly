import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, ExternalLink, Loader2, Lock, X } from "lucide-react";
import { PublicLayout, useToast } from "../../components/publik/PublicLayout";
import { supabase } from "../../lib/supabaseClient";
import { useAdminJobly } from "../dashboard/AdminSertifikasiPanel";
import { STATUS, TIPE, CARA_KERJA, tgl, ID_MITRA } from "./DasborMitraPage";
import { rupiah } from "../../data/paketLoker";
import { urlDetail } from "../../utils/sumberLoker";
import { tautan } from "../../utils/navigasi";
import { t } from "../../i18n.js";

const SARING = [
  ["menunggu", t("Menunggu dicek", "In review")],
  ["tayang", t("Tayang", "Live")],
  ["ditolak", t("Ditolak", "Rejected")],
  ["semua", t("Semua", "All")],
];

function Antrean({ m, onSelesai, toast }) {
  const [buka, setBuka] = useState(m.status === "menunggu");
  const [alasan, setAlasan] = useState("");
  const [sibuk, setSibuk] = useState("");
  const pt = m.perusahaan || {};

  const jalankan = async (jenis) => {
    if (jenis === "tolak" && !alasan.trim()) {
      toast(t("Tulis alasan penolakan dulu.", "Write a rejection reason first."));
      return;
    }
    setSibuk(jenis);
    const { error } =
      jenis === "setujui"
        ? await supabase.rpc("setujui_loker", { p_id: m.id })
        : jenis === "tutup"
          ? await supabase.rpc("tutup_loker", { p_id: m.id })
          : await supabase.rpc("tolak_loker", { p_id: m.id, p_alasan: alasan.trim() });
    setSibuk("");
    if (error) return toast(error.message);
    // Email status ke perusahaan (tidak menghambat bila gagal)
    if (jenis !== "tutup") supabase.functions.invoke("kabar-perusahaan", { body: { id: m.id } }).catch(() => {});
    toast(jenis === "setujui" ? t("Disetujui, loker tayang", "Approved, now live") : jenis === "tutup" ? t("Loker ditutup", "Job closed") : t("Ditolak", "Rejected"));
    onSelesai();
  };

  const gaji = m.gaji_min ? `${rupiah(m.gaji_min)}${m.gaji_max ? ` – ${rupiah(m.gaji_max)}` : ""}${m.tampilkan_gaji ? "" : t(" (disembunyikan)", " (hidden)")}` : null;

  return (
    <div className={`pk-loker pk-antrean ${m.status}`}>
      <button type="button" className="pk-antrean-kepala" onClick={() => setBuka((x) => !x)} aria-expanded={buka}>
        <div className="pk-logo kecil">{pt.logo_url ? <img src={pt.logo_url} alt="" /> : (pt.nama || "PT").slice(0, 2).toUpperCase()}</div>
        <div className="isi">
          <div className="atas">
            <b>
              #{m.id} {m.posisi}
            </b>
            <span className={`pk-status ${STATUS[m.status]?.warna}`}>{STATUS[m.status]?.label}</span>
            {m.status === "menunggu" && m.tayang_sampai && <span className="pk-status kuning">{t("diubah setelah tayang", "edited after going live")}</span>}
          </div>
          <small>
            {pt.nama} · {t("diajukan", "submitted")} {tgl(m.diubah_at)}
          </small>
        </div>
      </button>
      {buka && (
        <div className="pk-antrean-isi">
          <dl>
            <dt>{t("Perusahaan", "Company")}</dt>
            <dd>
              {pt.nama}
              {pt.situs && (
                <>
                  {" · "}
                  <a href={pt.situs} target="_blank" rel="noreferrer">
                    {pt.situs} <ExternalLink size={12} />
                  </a>
                </>
              )}
            </dd>
            <dt>{t("Kontak", "Contact")}</dt>
            <dd>{[pt.kontak_nama, pt.kontak_wa].filter(Boolean).join(" · ") || "-"}</dd>
            <dt>{t("Detail", "Details")}</dt>
            <dd>
              {[m.lokasi, TIPE.find((x) => x[0] === m.tipe)?.[1], CARA_KERJA.find((x) => x[0] === m.cara_kerja)?.[1], m.jenjang, m.pendidikan, gaji]
                .filter(Boolean)
                .join(" · ")}
            </dd>
            <dt>{t("Lamar", "Apply")}</dt>
            <dd>
              {m.cara_lamar === "form" ? (
                t(`Formulir Workly (diteruskan ke ${m.email_lamaran || "email akun"})`, `Workly form (forwarded to ${m.email_lamaran || "account email"})`)
              ) : m.cara_lamar === "email" ? (
                t(`Email: ${m.email_lamaran}`, `Email: ${m.email_lamaran}`)
              ) : (
                <a href={m.link} target="_blank" rel="noreferrer">
                  {m.link} <ExternalLink size={12} />
                </a>
              )}
            </dd>
          </dl>
          <div className="pk-deskripsi">{m.deskripsi}</div>
          {m.alasan_tolak && (
            <p className="pk-galat">
              {t("Alasan ditolak: ", "Rejection reason: ")}
              {m.alasan_tolak}
            </p>
          )}
          {m.status === "menunggu" && (
            <div className="pk-tombol">
              <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" disabled={Boolean(sibuk)} onClick={() => jalankan("setujui")}>
                {sibuk === "setujui" ? <Loader2 size={14} className="pk-putar" /> : <Check size={14} />} {t("Setujui & tayangkan", "Approve & publish")}
              </button>
              <input
                className="pk-alasan"
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder={t("Alasan penolakan (dilihat pemberi kerja)", "Rejection reason (shown to the employer)")}
              />
              <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" disabled={Boolean(sibuk)} onClick={() => jalankan("tolak")}>
                {sibuk === "tolak" ? <Loader2 size={14} className="pk-putar" /> : <X size={14} />} {t("Tolak", "Reject")}
              </button>
            </div>
          )}
          {m.status === "tayang" && (
            <div className="pk-tombol">
              <a className="pb-btn pb-btn-outline pb-btn-sm" {...tautan(urlDetail({ id: `db1:${ID_MITRA + m.id}`, posisi: m.posisi }))}>
                {t("Lihat di Workly", "View on Workly")}
              </a>
              <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" disabled={Boolean(sibuk)} onClick={() => window.confirm(t("Turunkan loker ini?", "Take this job down?")) && jalankan("tutup")}>
                {t("Turunkan", "Take down")}
              </button>
              <small className="pk-redup">
                {t(`Tayang sampai ${tgl(m.tayang_sampai)} · dilihat ${m.dilihat} · klik ${m.klik}`, `Live until ${tgl(m.tayang_sampai)} · ${m.dilihat} views · ${m.klik} clicks`)}
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminMitraPage() {
  const admin = useAdminJobly();
  const [saring, setSaring] = useState("menunggu");
  const [d, setD] = useState({ memuat: true, rows: [], galat: "" });
  const [toast, elemenToast] = useToast();

  const muat = useCallback(async () => {
    setD((x) => ({ ...x, memuat: true }));
    let q = supabase
      .from("loker_perusahaan")
      .select("*, perusahaan(nama, situs, kota, logo_url, kontak_nama, kontak_wa)")
      .order("diubah_at", { ascending: saring === "menunggu" })
      .limit(100);
    if (saring !== "semua") q = q.eq("status", saring);
    else q = q.neq("status", "draf");
    const { data, error } = await q;
    setD({ memuat: false, rows: data || [], galat: error?.message || "" });
  }, [saring]);

  useEffect(() => {
    document.title = t("Moderasi loker · Workly", "Job moderation · Workly");
  }, []);
  useEffect(() => {
    if (admin) muat();
  }, [admin, muat]);

  return (
    <PublicLayout aktif="/pemberi-kerja">
      <div className="pb-wrap pk-dasbor">
        <div className="pk-kepala">
          <div>
            <span className="pb-label">{t("Admin", "Admin")}</span>
            <h1>{t("Moderasi loker pemberi kerja", "Employer job moderation")}</h1>
          </div>
        </div>
        {admin === null && (
          <div className="pk-panel pk-tengah">
            <Loader2 size={18} className="pk-putar" />
          </div>
        )}
        {admin === false && (
          <div className="pk-panel pk-tengah">
            <Lock size={18} /> {t("Halaman ini hanya bisa dibuka oleh admin Workly.", "This page is only available to Workly admins.")}
          </div>
        )}
        {admin && (
          <div className="pk-panel">
            <div className="pb-chips" style={{ marginBottom: 14 }}>
              {SARING.map(([id, l]) => (
                <button key={id} type="button" className={`pb-chip ${saring === id ? "on" : ""}`} onClick={() => setSaring(id)}>
                  {l}
                </button>
              ))}
            </div>
            {d.galat && (
              <p className="pk-galat">
                <AlertTriangle size={15} /> {d.galat}
              </p>
            )}
            {d.memuat ? (
              <div className="pk-tengah">
                <Loader2 size={18} className="pk-putar" />
              </div>
            ) : d.rows.length === 0 ? (
              <p className="pk-redup">{t("Tidak ada loker di sini.", "Nothing here.")}</p>
            ) : (
              <div className="pk-daftar">
                {d.rows.map((m) => (
                  <Antrean key={`${m.id}-${m.status}`} m={m} onSelesai={muat} toast={toast} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {elemenToast}
    </PublicLayout>
  );
}
