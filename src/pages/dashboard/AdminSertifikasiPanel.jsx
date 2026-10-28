import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ExternalLink, Loader2, Lock, Pencil, Plus, Search, Trash2, X, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { BIDANG } from "../../data/bidang";
import { JENJANG, JENIS, MODE, statusDaftar, teksBiaya, fmtTanggal } from "../../data/sertifikasi";
import { t } from "../../i18n.js";

const KOSONG = {
  nama: "",
  penyelenggara: "",
  url: "",
  jenis: "sertifikasi",
  bidang: [],
  posisi: "",
  jenjang: "dasar",
  biayaMode: "gratis", // gratis | rupiah | teks
  biaya: "",
  ket_biaya: "",
  mode: "online",
  durasi: "",
  batch: "",
  buka: "",
  tutup: "",
  mulai: "",
  ringkas: "",
  manfaat: "",
  aktif: true,
};

/** Cek admin lewat fungsi database saya_admin(). */
export function useAdminJobly() {
  const { user } = useAuth();
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    if (!user || !supabaseConfigured) {
      setAdmin(false);
      return;
    }
    supabase.rpc("saya_admin").then(({ data, error }) => setAdmin(!error && data === true));
  }, [user]);
  return admin;
}

const hariIni = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD waktu lokal

function dariBaris(r) {
  return {
    ...KOSONG,
    ...r,
    posisi: (r.posisi || []).join(", "),
    biayaMode: r.biaya === 0 ? "gratis" : r.biaya ? "rupiah" : "teks",
    biaya: r.biaya ? String(r.biaya) : "",
    buka: r.buka || "",
    tutup: r.tutup || "",
    mulai: r.mulai || "",
  };
}

function keBaris(f) {
  return {
    nama: f.nama.trim(),
    penyelenggara: f.penyelenggara.trim(),
    url: f.url.trim(),
    jenis: f.jenis,
    bidang: f.bidang,
    posisi: f.posisi.split(/[,;]+/).map((x) => x.trim().toLowerCase()).filter(Boolean).slice(0, 15),
    jenjang: f.jenjang,
    biaya: f.biayaMode === "gratis" ? 0 : f.biayaMode === "rupiah" ? Number(String(f.biaya).replace(/\D/g, "")) || null : null,
    ket_biaya: f.biayaMode === "gratis" ? "Gratis" : f.biayaMode === "teks" ? f.ket_biaya.trim() : "",
    mode: f.mode,
    durasi: f.durasi.trim(),
    batch: f.batch.trim(),
    buka: f.buka || null,
    tutup: f.tutup || null,
    mulai: f.mulai || null,
    ringkas: f.ringkas.trim(),
    manfaat: f.manfaat.trim(),
    aktif: f.aktif,
  };
}

function Formulir({ awal, onBatal, onSimpan, menyimpan }) {
  const [f, setF] = useState(awal);
  const [galat, setGalat] = useState("");
  const ubah = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const kirim = (e) => {
    e.preventDefault();
    if (f.nama.trim().length < 3) return setGalat(t("Nama program minimal 3 huruf.", "Programme name needs at least 3 characters."));
    if (f.url && !/^https?:\/\/\S+\.\S+/i.test(f.url.trim())) return setGalat(t("Link harus diawali https://", "The link must start with https://"));
    if (!f.bidang.length) return setGalat(t("Pilih minimal satu bidang.", "Pick at least one field."));
    if (f.buka && f.tutup && f.tutup < f.buka) return setGalat(t("Tanggal tutup tidak boleh sebelum tanggal buka.", "Closing date can't be before the opening date."));
    setGalat("");
    onSimpan(keBaris(f));
  };

  return (
    <form className="pb-panel pb-as-form" onSubmit={kirim}>
      <button type="button" className="pb-link" onClick={onBatal} style={{ border: 0, background: "none", cursor: "pointer", padding: 0 }}>
        <ArrowLeft size={15} /> {t("Kembali ke daftar", "Back to list")}
      </button>
      <h2>{awal.id ? t("Ubah program", "Edit programme") : t("Tambah program", "Add programme")}</h2>

      <div className="pb-as-grid">
        <label className="lebar">
          <span>{t("Nama program *", "Programme name *")}</span>
          <input value={f.nama} onChange={(e) => ubah("nama", e.target.value)} maxLength={200} placeholder="mis. Bootcamp Data Analyst Batch 5" />
        </label>
        <label>
          <span>{t("Penyelenggara", "Organiser")}</span>
          <input value={f.penyelenggara} onChange={(e) => ubah("penyelenggara", e.target.value)} placeholder="mis. Dicoding, Google, IAI" />
        </label>
        <label>
          <span>{t("Link pendaftaran", "Registration link")}</span>
          <input type="url" value={f.url} onChange={(e) => ubah("url", e.target.value)} placeholder="https://…" />
        </label>
        <label>
          <span>{t("Jenis", "Type")}</span>
          <select value={f.jenis} onChange={(e) => ubah("jenis", e.target.value)}>
            {Object.entries(JENIS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t("Jenjang karier", "Career stage")}</span>
          <select value={f.jenjang} onChange={(e) => ubah("jenjang", e.target.value)}>
            {JENJANG.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama} ({j.ket})
              </option>
            ))}
          </select>
        </label>

        <div className="lebar">
          <span className="judul-isian">{t("Bidang *", "Fields *")}</span>
          <div className="pb-chips">
            {BIDANG.map((b) => (
              <button
                key={b.slug}
                type="button"
                className={`pb-chip ${f.bidang.includes(b.slug) ? "on" : ""}`}
                onClick={() => ubah("bidang", f.bidang.includes(b.slug) ? f.bidang.filter((x) => x !== b.slug) : [...f.bidang, b.slug])}
              >
                {b.nama}
              </button>
            ))}
          </div>
        </div>

        <label className="lebar">
          <span>{t("Posisi yang cocok (pisahkan dengan koma)", "Matching roles (comma-separated)")}</span>
          <input value={f.posisi} onChange={(e) => ubah("posisi", e.target.value)} placeholder="data analyst, business analyst, admin" />
        </label>

        <div>
          <span className="judul-isian">{t("Biaya", "Cost")}</span>
          <div className="pb-chips">
            {[
              ["gratis", t("Gratis", "Free")],
              ["rupiah", "Rupiah"],
              ["teks", t("Teks bebas", "Free text")],
            ].map(([k, l]) => (
              <button key={k} type="button" className={`pb-chip ${f.biayaMode === k ? "on" : ""}`} onClick={() => ubah("biayaMode", k)}>
                {l}
              </button>
            ))}
          </div>
          {f.biayaMode === "rupiah" && <input inputMode="numeric" value={f.biaya} onChange={(e) => ubah("biaya", e.target.value)} placeholder="350000" />}
          {f.biayaMode === "teks" && <input value={f.ket_biaya} onChange={(e) => ubah("ket_biaya", e.target.value)} placeholder="mis. USD 49/bulan, ada bantuan biaya" maxLength={120} />}
        </div>
        <label>
          <span>{t("Mode", "Format")}</span>
          <select value={f.mode} onChange={(e) => ubah("mode", e.target.value)}>
            {Object.entries(MODE).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{t("Durasi", "Duration")}</span>
          <input value={f.durasi} onChange={(e) => ubah("durasi", e.target.value)} placeholder="mis. 4 bulan" />
        </label>
        <label>
          <span>{t("Batch / angkatan", "Batch / cohort")}</span>
          <input value={f.batch} onChange={(e) => ubah("batch", e.target.value)} placeholder="mis. Batch 2 2027" />
        </label>

        <label>
          <span>{t("Pendaftaran dibuka", "Opens")}</span>
          <input type="date" value={f.buka} onChange={(e) => ubah("buka", e.target.value)} />
        </label>
        <label>
          <span>{t("Pendaftaran ditutup", "Closes")}</span>
          <input type="date" value={f.tutup} onChange={(e) => ubah("tutup", e.target.value)} />
          <small>{t("Kosongkan bila selalu tersedia. Setelah lewat, otomatis hilang dari situs.", "Leave empty if always open. Hidden automatically once passed.")}</small>
        </label>
        <label>
          <span>{t("Kelas dimulai", "Starts")}</span>
          <input type="date" value={f.mulai} onChange={(e) => ubah("mulai", e.target.value)} />
        </label>

        <label className="lebar">
          <span>{t("Ringkasan (maks 2 kalimat)", "Summary (max 2 sentences)")}</span>
          <textarea rows={2} value={f.ringkas} onChange={(e) => ubah("ringkas", e.target.value)} maxLength={600} />
        </label>
        <label className="lebar">
          <span>{t("Manfaat untuk karier", "Career benefit")}</span>
          <textarea rows={2} value={f.manfaat} onChange={(e) => ubah("manfaat", e.target.value)} maxLength={600} />
        </label>
        <label className="centang lebar">
          <input type="checkbox" checked={f.aktif} onChange={(e) => ubah("aktif", e.target.checked)} />
          {t("Tampilkan di situs", "Show on site")}
        </label>
      </div>

      {galat && <div className="pb-po-galat">{galat}</div>}
      <div className="pb-tk-nav">
        <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={onBatal}>
          {t("Batal", "Cancel")}
        </button>
        <button type="submit" className="pb-btn pb-btn-primary" disabled={menyimpan}>
          {menyimpan ? <Loader2 size={15} className="pb-po-putar" /> : <Check size={15} />} {t("Simpan", "Save")}
        </button>
      </div>
    </form>
  );
}

export function AdminSertifikasiPanel() {
  const admin = useAdminJobly();
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState("");
  const [cari, setCari] = useState("");
  const [saring, setSaring] = useState("semua"); // semua | perlu | arsip
  const [edit, setEdit] = useState(null);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState("");

  const muat = useCallback(async () => {
    const { data: d, error } = await supabase.from("sertifikasi").select("*").order("diubah_at", { ascending: false }).limit(1000);
    if (error) {
      setGalat(error.message);
      setData([]);
    } else setData(d || []);
  }, []);

  useEffect(() => {
    if (admin) muat();
  }, [admin, muat]);

  const kini = hariIni();
  const perlu = (r) => r.aktif && r.tutup && (r.tutup < kini || (new Date(r.tutup) - new Date(kini)) / 86400000 <= 7);

  const daftar = useMemo(() => {
    const k = cari.trim().toLowerCase();
    return (data || []).filter(
      (r) =>
        (!k || `${r.nama} ${r.penyelenggara} ${(r.posisi || []).join(" ")}`.toLowerCase().includes(k)) &&
        (saring === "semua" || (saring === "perlu" && perlu(r)) || (saring === "arsip" && !r.aktif)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, cari, saring]);

  const simpan = async (baris) => {
    setMenyimpan(true);
    const q = edit.id ? supabase.from("sertifikasi").update(baris).eq("id", edit.id) : supabase.from("sertifikasi").insert(baris);
    const { error } = await q;
    setMenyimpan(false);
    if (error) {
      setGalat(error.message);
      return;
    }
    setPesan(edit.id ? t("Perubahan disimpan.", "Changes saved.") : t("Program ditambahkan.", "Programme added."));
    setEdit(null);
    muat();
  };

  const aktifkan = async (r, aktif) => {
    const { error } = await supabase.from("sertifikasi").update({ aktif }).eq("id", r.id);
    if (error) setGalat(error.message);
    else muat();
  };

  const hapus = async (r) => {
    if (!window.confirm(t(`Hapus "${r.nama}" permanen?`, `Delete "${r.nama}" permanently?`))) return;
    const { error } = await supabase.from("sertifikasi").delete().eq("id", r.id);
    if (error) setGalat(error.message);
    else muat();
  };

  if (admin === null) {
    return (
      <div className="pb-po-muat">
        <Loader2 size={18} className="pb-po-putar" /> {t("Memeriksa akses…", "Checking access…")}
      </div>
    );
  }
  if (!admin) {
    return (
      <div className="pb-panel pb-po-kunci">
        <span className="pb-po-kunci-ikon">
          <Lock size={20} />
        </span>
        <h2>{t("Khusus admin Jobly", "Jobly admins only")}</h2>
        <p>
          {t(
            "Akunmu belum terdaftar sebagai admin. Jalankan supabase/sql/12_admin_sertifikasi.sql dengan email login Jobly-mu, lalu muat ulang halaman ini.",
            "Your account isn't an admin yet. Run supabase/sql/12_admin_sertifikasi.sql with your Jobly login email, then reload this page.",
          )}
        </p>
      </div>
    );
  }

  if (edit) return <Formulir awal={edit.id ? dariBaris(edit) : KOSONG} onBatal={() => setEdit(null)} onSimpan={simpan} menyimpan={menyimpan} />;

  const jumlahPerlu = (data || []).filter(perlu).length;

  return (
    <div className="pb-as">
      {galat && (
        <div className="pb-po-galat">
          {galat}
          <button type="button" onClick={() => setGalat("")} aria-label={t("Tutup", "Close")}>
            <X size={14} />
          </button>
        </div>
      )}
      {pesan && (
        <div className="pb-as-pesan">
          <Check size={14} /> {pesan}
          <button type="button" onClick={() => setPesan("")} aria-label={t("Tutup", "Close")}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="pb-panel pb-as-atas">
        <div>
          <span className="pb-label">{t("Admin", "Admin")}</span>
          <h2>{t("Kelola sertifikasi & pelatihan", "Manage certifications & training")}</h2>
          <p className="pb-tk-ket">
            {t(
              "Tambah program, perbarui link dan tanggal batch, atau sembunyikan yang sudah tidak berlaku. Program yang tanggal tutupnya lewat otomatis hilang dari situs.",
              "Add programmes, update links and batch dates, or hide outdated ones. Programmes past their closing date disappear from the site automatically.",
            )}
          </p>
        </div>
        <button type="button" className="pb-btn pb-btn-primary" onClick={() => setEdit({})}>
          <Plus size={15} /> {t("Tambah program", "Add programme")}
        </button>
      </div>

      <div className="pb-as-alat">
        <label className="pb-input">
          <Search size={16} color="var(--muted)" />
          <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder={t("Cari nama, penyelenggara, posisi", "Search name, organiser, role")} />
        </label>
        <div className="pb-chips">
          {[
            ["semua", t("Semua", "All")],
            ["perlu", t(`Perlu diperbarui (${jumlahPerlu})`, `Needs update (${jumlahPerlu})`)],
            ["arsip", t("Disembunyikan", "Hidden")],
          ].map(([k, l]) => (
            <button key={k} type="button" className={`pb-chip ${saring === k ? "on" : ""}`} onClick={() => setSaring(k)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {data === null ? (
        <div className="pb-po-muat">
          <Loader2 size={18} className="pb-po-putar" /> {t("Memuat…", "Loading…")}
        </div>
      ) : (
        <div className="pb-as-daftar">
          {daftar.map((r) => {
            const lewat = r.tutup && r.tutup < kini;
            const st = statusDaftar(r);
            return (
              <div key={r.id} className={`pb-as-baris ${!r.aktif ? "arsip" : ""} ${perlu(r) ? "perlu" : ""}`}>
                <div className="isi">
                  <b>{r.nama}</b>
                  <small>
                    {r.penyelenggara || "-"} · {JENIS[r.jenis] || r.jenis} · {JENJANG.find((j) => j.id === r.jenjang)?.nama} · {teksBiaya(r)}
                  </small>
                  <small className="status">
                    {!r.aktif ? (
                      t("Disembunyikan", "Hidden")
                    ) : lewat ? (
                      <>
                        <AlertTriangle size={12} /> {t(`Sudah tutup ${fmtTanggal(r.tutup)}, tidak tampil di situs`, `Closed ${fmtTanggal(r.tutup)}, hidden from site`)}
                      </>
                    ) : (
                      st.teks
                    )}
                    {r.batch ? ` · ${r.batch}` : ""}
                  </small>
                </div>
                <div className="aksi">
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" title={t("Buka link", "Open link")}>
                      <ExternalLink size={15} />
                    </a>
                  )}
                  <button type="button" onClick={() => setEdit(r)} title={t("Ubah", "Edit")}>
                    <Pencil size={15} />
                  </button>
                  <button type="button" onClick={() => aktifkan(r, !r.aktif)} title={r.aktif ? t("Sembunyikan", "Hide") : t("Tampilkan", "Show")}>
                    {r.aktif ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button type="button" onClick={() => hapus(r)} title={t("Hapus", "Delete")}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
          {!daftar.length && <p className="pb-po-ket">{t("Tidak ada program untuk filter ini.", "No programmes for this filter.")}</p>}
        </div>
      )}
    </div>
  );
}
