import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle, ArrowLeft, Check, CheckCircle2, Clock, Eye, ExternalLink, ImagePlus, Loader2,
  MousePointerClick, Pencil, Plus, Send, Trash2, X, XCircle,
} from "lucide-react";
import { PublicLayout, useToast } from "../../components/publik/PublicLayout";
import { KartuLoker } from "../../components/publik/KartuLoker";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { BIDANG } from "../../data/bidang";
import { PAKET_LOKER, MASA_TAYANG_HARI, rupiah } from "../../data/paketLoker";
import { mapSupabaseJob } from "../../utils/petaLoker";
import { urlDetail } from "../../utils/sumberLoker";
import { muatSnap } from "../../utils/snap";
import { tautan } from "../../utils/navigasi";
import { lokal, t } from "../../i18n.js";

export const ID_MITRA = 800000000;

export const STATUS = {
  draf: { label: t("Draf", "Draft"), warna: "abu" },
  menunggu: { label: t("Menunggu dicek", "In review"), warna: "kuning" },
  tayang: { label: t("Tayang", "Live"), warna: "hijau" },
  ditolak: { label: t("Ditolak", "Rejected"), warna: "merah" },
  ditutup: { label: t("Ditutup", "Closed"), warna: "abu" },
  berakhir: { label: t("Berakhir", "Expired"), warna: "abu" },
};

export const TIPE = [
  ["full-time", "Full time"],
  ["kontrak", t("Kontrak", "Contract")],
  ["part-time", "Part time"],
  ["magang", t("Magang", "Internship")],
  ["freelance", "Freelance"],
];
export const CARA_KERJA = [
  ["onsite", t("Di kantor", "On-site")],
  ["hybrid", "Hybrid"],
  ["remote", "Remote"],
];
const UKURAN = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export const tgl = (iso) =>
  iso ? new Date(iso).toLocaleDateString(lokal(), { day: "numeric", month: "short", year: "numeric" }) : "";

const angkaSaja = (v) => {
  const n = Number(String(v ?? "").replace(/\D/g, ""));
  return n > 0 ? n : null;
};

/** Baris loker_perusahaan + perusahaan → objek job untuk KartuLoker. */
export function keJobMitra(m, pt) {
  const job = mapSupabaseJob(
    {
      id: ID_MITRA + (m.id || 0),
      title: m.posisi || t("Posisi", "Role"),
      company: pt?.nama || t("Perusahaan", "Company"),
      company_logo: pt?.logo_url || null,
      company_url: pt?.situs || null,
      location: m.lokasi || pt?.kota || "Indonesia",
      employment_type: m.tipe || null,
      work_arrangement: m.cara_kerja || null,
      min_amount: m.tampilkan_gaji ? m.gaji_min : null,
      max_amount: m.tampilkan_gaji ? m.gaji_max || m.gaji_min : null,
      currency: m.tampilkan_gaji && m.gaji_min ? "IDR" : null,
      interval: m.tampilkan_gaji && m.gaji_min ? "monthly" : null,
      job_url: m.link,
      site: "jobly",
      prioritas: true,
      created_at: m.tayang_mulai || new Date().toISOString(),
    },
    "db1",
  );
  return job;
}

function Lencana({ status }) {
  const s = STATUS[status] || STATUS.draf;
  return <span className={`pk-status ${s.warna}`}>{s.label}</span>;
}

/* ------------------------------------------------------------ data */

function useDataMitra() {
  const { user } = useAuth();
  const [d, setD] = useState({ memuat: true, pt: null, loker: [], beli: [], galat: "" });
  const muat = useCallback(async () => {
    if (!user) return;
    await supabase.rpc("rapikan_loker_mitra").then(() => {}, () => {});
    const [pt, loker, beli] = await Promise.all([
      supabase.from("perusahaan").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("loker_perusahaan").select("*").eq("user_id", user.id).order("dibuat_at", { ascending: false }),
      supabase.from("pembelian_kredit").select("*").eq("user_id", user.id).order("dibuat_at", { ascending: false }).limit(20),
    ]);
    const galat = pt.error || loker.error;
    setD({
      memuat: false,
      pt: pt.data || null,
      loker: loker.data || [],
      beli: beli.data || [],
      galat: galat
        ? /relation|does not exist|schema cache/i.test(galat.message)
          ? t("Fitur pemberi kerja belum disiapkan di database (SQL 19).", "Employer features aren't set up in the database yet (SQL 19).")
          : galat.message
        : "",
    });
  }, [user]);
  useEffect(() => {
    muat();
  }, [muat]);
  return { ...d, muat };
}

/* ------------------------------------------------------ profil */

const namaTersimpan = () => {
  try {
    return localStorage.getItem("jobly:nama-perusahaan") || "";
  } catch {
    return "";
  }
};

function FormProfil({ pt, onSimpan, onBatal }) {
  const { user } = useAuth();
  const [f, setF] = useState(() => ({
    nama: pt?.nama || user?.user_metadata?.nama_perusahaan || namaTersimpan() || "",
    situs: pt?.situs || "",
    kota: pt?.kota || "",
    industri: pt?.industri || "",
    ukuran: pt?.ukuran || "",
    deskripsi: pt?.deskripsi || "",
    kontak_nama: pt?.kontak_nama || "",
    kontak_wa: pt?.kontak_wa || "",
    logo_url: pt?.logo_url || "",
  }));
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");
  const ubah = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const unggahLogo = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) return setGalat(t("Logo harus PNG, JPG, WEBP, atau SVG.", "Logo must be PNG, JPG, WEBP, or SVG."));
    if (file.size > 1024 * 1024) return setGalat(t("Ukuran logo maksimal 1 MB.", "Logo must be 1 MB or smaller."));
    setSibuk(true);
    setGalat("");
    const ext = file.name.split(".").pop().toLowerCase().replace(/[^a-z]/g, "") || "png";
    const path = `${user.id}/logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("logo-perusahaan").upload(path, file, { upsert: true, contentType: file.type });
    setSibuk(false);
    if (error) return setGalat(t("Logo gagal diunggah: ", "Logo upload failed: ") + error.message);
    const { data } = supabase.storage.from("logo-perusahaan").getPublicUrl(path);
    setF((x) => ({ ...x, logo_url: data.publicUrl }));
  };

  const simpan = async (e) => {
    e.preventDefault();
    if (f.nama.trim().length < 2) return setGalat(t("Nama perusahaan wajib diisi.", "Company name is required."));
    setSibuk(true);
    setGalat("");
    let situs = f.situs.trim();
    if (situs && !/^https?:\/\//i.test(situs)) situs = `https://${situs}`;
    const isi = {
      nama: f.nama.trim(),
      situs: situs || null,
      kota: f.kota.trim() || null,
      industri: f.industri.trim() || null,
      ukuran: f.ukuran || null,
      deskripsi: f.deskripsi.trim() || null,
      kontak_nama: f.kontak_nama.trim() || null,
      kontak_wa: f.kontak_wa.trim() || null,
      logo_url: f.logo_url || null,
    };
    const { error } = pt
      ? await supabase.from("perusahaan").update(isi).eq("user_id", user.id)
      : await supabase.from("perusahaan").insert({ user_id: user.id, ...isi });
    setSibuk(false);
    if (error) return setGalat(error.message);
    onSimpan();
  };

  return (
    <form className="pb-as-form pk-panel" onSubmit={simpan}>
      <div>
        <h2>{pt ? t("Profil perusahaan", "Company profile") : t("Lengkapi profil perusahaan", "Set up your company profile")}</h2>
        <p className="pk-redup">
          {t(
            "Nama dan logo ini tampil di setiap loker yang kamu pasang. Perubahan langsung berlaku untuk loker yang sedang tayang.",
            "This name and logo appear on every job you post. Changes apply to live posts right away.",
          )}
        </p>
      </div>
      <div className="pk-logo-baris">
        <div className="pk-logo">{f.logo_url ? <img src={f.logo_url} alt="" /> : <ImagePlus size={22} />}</div>
        <div>
          <label className="pb-btn pb-btn-outline pb-btn-sm" style={{ cursor: "pointer" }}>
            {f.logo_url ? t("Ganti logo", "Change logo") : t("Unggah logo", "Upload logo")}
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={unggahLogo} hidden />
          </label>
          <small className="pk-redup" style={{ display: "block", marginTop: 6 }}>
            {t("Persegi, PNG/JPG/WEBP/SVG, maks. 1 MB", "Square, PNG/JPG/WEBP/SVG, max 1 MB")}
          </small>
        </div>
      </div>
      <div className="pb-as-grid">
        <label>
          <span>{t("Nama perusahaan *", "Company name *")}</span>
          <input value={f.nama} onChange={ubah("nama")} maxLength={120} required placeholder="PT Contoh Sejahtera" />
        </label>
        <label>
          <span>{t("Situs web", "Website")}</span>
          <input value={f.situs} onChange={ubah("situs")} placeholder="contoh.co.id" />
        </label>
        <label>
          <span>{t("Kota kantor pusat", "Head office city")}</span>
          <input value={f.kota} onChange={ubah("kota")} placeholder="Jakarta Selatan" />
        </label>
        <label>
          <span>{t("Industri", "Industry")}</span>
          <input value={f.industri} onChange={ubah("industri")} placeholder={t("Logistik, F&B, teknologi, ...", "Logistics, F&B, tech, ...")} />
        </label>
        <label>
          <span>{t("Jumlah karyawan", "Company size")}</span>
          <select value={f.ukuran} onChange={ubah("ukuran")}>
            <option value="">{t("Pilih", "Select")}</option>
            {UKURAN.map((u) => (
              <option key={u} value={u}>
                {u} {t("orang", "people")}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t("Nama kontak (untuk tim Workly)", "Contact name (for the Workly team)")}</span>
          <input value={f.kontak_nama} onChange={ubah("kontak_nama")} />
        </label>
        <label>
          <span>{t("WhatsApp kontak (untuk tim Workly)", "Contact WhatsApp (for the Workly team)")}</span>
          <input value={f.kontak_wa} onChange={ubah("kontak_wa")} inputMode="tel" placeholder="08xx" />
          <small>{t("Tidak ditampilkan ke pelamar.", "Not shown to applicants.")}</small>
        </label>
        <label className="lebar">
          <span>{t("Tentang perusahaan", "About the company")}</span>
          <textarea rows={4} value={f.deskripsi} onChange={ubah("deskripsi")} maxLength={1500} />
        </label>
      </div>
      {galat && (
        <p className="pk-galat">
          <AlertTriangle size={15} /> {galat}
        </p>
      )}
      <div className="pk-tombol">
        <button className="pb-btn pb-btn-primary" disabled={sibuk}>
          {sibuk && <Loader2 size={15} className="pk-putar" />} {t("Simpan profil", "Save profile")}
        </button>
        {onBatal && (
          <button type="button" className="pb-btn pb-btn-outline" onClick={onBatal}>
            {t("Batal", "Cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------ form loker */

const LOKER_KOSONG = {
  posisi: "",
  lokasi: "",
  tipe: "full-time",
  cara_kerja: "onsite",
  kategori: "",
  jenjang: "",
  pendidikan: "",
  gaji_min: "",
  gaji_max: "",
  tampilkan_gaji: true,
  link: "",
  deskripsi: "",
};

function FormLoker({ pt, awal, kredit, onSelesai, onBatal }) {
  const { user } = useAuth();
  const [f, setF] = useState(() =>
    awal
      ? { ...LOKER_KOSONG, ...Object.fromEntries(Object.entries(awal).map(([k, v]) => [k, v ?? ""])), tampilkan_gaji: awal.tampilkan_gaji !== false }
      : { ...LOKER_KOSONG, lokasi: pt?.kota || "" },
  );
  const [sibuk, setSibuk] = useState("");
  const [galat, setGalat] = useState("");
  const ubah = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const status = awal?.status || "draf";
  const perluKredit = !awal?.sudah_bayar;

  const baris = useMemo(() => {
    let link = f.link.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(link)) link = `mailto:${link}`;
    else if (link && !/^(https?:|mailto:)/i.test(link)) link = `https://${link}`;
    const min = angkaSaja(f.gaji_min);
    const max = angkaSaja(f.gaji_max);
    return {
      posisi: f.posisi.trim(),
      lokasi: f.lokasi.trim() || null,
      tipe: f.tipe || null,
      cara_kerja: f.cara_kerja || null,
      kategori: f.kategori || null,
      jenjang: f.jenjang.trim() || null,
      pendidikan: f.pendidikan.trim() || null,
      gaji_min: min && max ? Math.min(min, max) : min || max,
      gaji_max: min && max ? Math.max(min, max) : null,
      tampilkan_gaji: Boolean(f.tampilkan_gaji),
      link,
      deskripsi: f.deskripsi.trim(),
    };
  }, [f]);

  const periksa = () => {
    if (baris.posisi.length < 2) return t("Nama posisi wajib diisi.", "Job title is required.");
    if (!baris.link) return t("Link atau email lamaran wajib diisi.", "An apply link or email is required.");
    if (baris.deskripsi.length < 80)
      return t("Deskripsi minimal 80 karakter: tulis tanggung jawab dan kualifikasi.", "Description needs at least 80 characters: list responsibilities and requirements.");
    return "";
  };

  const simpan = async (ajukan) => {
    const g = periksa();
    if (g) return setGalat(g);
    if (ajukan && perluKredit && kredit < 1) return setGalat(t("Kredit habis. Beli paket terlebih dahulu.", "You're out of credits. Buy a bundle first."));
    setSibuk(ajukan ? "ajukan" : "simpan");
    setGalat("");
    try {
      let id = awal?.id;
      if (id) {
        const { error } = await supabase.from("loker_perusahaan").update(baris).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("loker_perusahaan").insert({ user_id: user.id, ...baris }).select("id").single();
        if (error) throw error;
        id = data.id;
      }
      if (ajukan && ["draf", "ditolak"].includes(status)) {
        const { error } = await supabase.rpc("ajukan_loker", { p_id: id });
        if (error) throw error;
      }
      if (ajukan || status === "tayang" || status === "menunggu") {
        supabase.functions.invoke("kabar-loker", { body: { id } }).catch(() => {});
      }
      onSelesai(ajukan ? "ajukan" : "simpan");
    } catch (e) {
      setGalat(e.message || String(e));
    } finally {
      setSibuk("");
    }
  };

  const contoh = keJobMitra({ ...baris, id: awal?.id }, pt);

  return (
    <div className="pk-tulis">
      <form className="pb-as-form pk-panel" onSubmit={(e) => e.preventDefault()}>
        <div>
          <button type="button" className="pk-kembali" onClick={onBatal}>
            <ArrowLeft size={15} /> {t("Kembali ke daftar loker", "Back to your jobs")}
          </button>
          <h2>{awal ? t("Ubah loker", "Edit job") : t("Pasang loker baru", "Post a new job")}</h2>
          {status === "tayang" && (
            <p className="pk-catatan">
              {t(
                "Loker ini sedang tayang. Setelah disimpan, loker dicek ulang tim Workly (tanpa memotong kredit) dan sementara disembunyikan sampai disetujui.",
                "This job is live. After saving, it's reviewed again by Workly (no extra credit) and hidden until approved.",
              )}
            </p>
          )}
          {status === "ditolak" && awal?.alasan_tolak && (
            <p className="pk-galat">
              <XCircle size={15} /> {t("Alasan ditolak: ", "Rejected because: ")}
              {awal.alasan_tolak}
            </p>
          )}
        </div>
        <div className="pb-as-grid">
          <label className="lebar">
            <span>{t("Posisi *", "Job title *")}</span>
            <input value={f.posisi} onChange={ubah("posisi")} maxLength={150} placeholder="Staff Admin Gudang" />
          </label>
          <label>
            <span>{t("Lokasi kerja", "Location")}</span>
            <input value={f.lokasi} onChange={ubah("lokasi")} placeholder="Surabaya" />
          </label>
          <label>
            <span>{t("Bidang", "Field")}</span>
            <select value={f.kategori} onChange={ubah("kategori")}>
              <option value="">{t("Pilih bidang", "Select a field")}</option>
              {BIDANG.map((b) => (
                <option key={b.slug} value={b.kategori?.[0] || b.slug}>
                  {b.nama}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t("Tipe pekerjaan", "Job type")}</span>
            <select value={f.tipe} onChange={ubah("tipe")}>
              {TIPE.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t("Sistem kerja", "Work setting")}</span>
            <select value={f.cara_kerja} onChange={ubah("cara_kerja")}>
              {CARA_KERJA.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t("Pengalaman", "Experience")}</span>
            <input value={f.jenjang} onChange={ubah("jenjang")} placeholder={t("Fresh graduate / 1-3 tahun", "Fresh graduate / 1-3 years")} />
          </label>
          <label>
            <span>{t("Pendidikan minimal", "Minimum education")}</span>
            <input value={f.pendidikan} onChange={ubah("pendidikan")} placeholder="SMA/SMK, D3, S1" />
          </label>
          <label>
            <span>{t("Gaji per bulan, dari (Rp)", "Monthly salary, from (IDR)")}</span>
            <input value={f.gaji_min} onChange={ubah("gaji_min")} inputMode="numeric" placeholder="5000000" />
          </label>
          <label>
            <span>{t("sampai (Rp)", "to (IDR)")}</span>
            <input value={f.gaji_max} onChange={ubah("gaji_max")} inputMode="numeric" placeholder="7000000" />
          </label>
          <label className="centang lebar">
            <input type="checkbox" checked={f.tampilkan_gaji} onChange={ubah("tampilkan_gaji")} />
            {t("Tampilkan gaji di loker (loker bergaji jelas lebih banyak dilamar)", "Show the salary (posts with a salary get more applicants)")}
          </label>
          <label className="lebar">
            <span>{t("Link lamaran atau email *", "Apply link or email *")}</span>
            <input value={f.link} onChange={ubah("link")} placeholder="https://contoh.co.id/karier  atau  hrd@contoh.co.id" />
          </label>
          <label className="lebar">
            <span>{t("Deskripsi pekerjaan *", "Job description *")}</span>
            <textarea
              rows={10}
              value={f.deskripsi}
              onChange={ubah("deskripsi")}
              maxLength={8000}
              placeholder={t(
                "Tanggung jawab:\n• ...\n\nKualifikasi:\n• ...\n\nBenefit:\n• ...",
                "Responsibilities:\n• ...\n\nRequirements:\n• ...\n\nBenefits:\n• ...",
              )}
            />
            <small>
              {baris.deskripsi.length.toLocaleString(lokal())} / 8.000 · {t("Jangan meminta biaya apa pun dari pelamar.", "Never ask applicants for any fee.")}
            </small>
          </label>
        </div>
        {galat && (
          <p className="pk-galat">
            <AlertTriangle size={15} /> {galat}
          </p>
        )}
        <div className="pk-tombol">
          {["draf", "ditolak"].includes(status) ? (
            <>
              <button type="button" className="pb-btn pb-btn-primary" disabled={Boolean(sibuk)} onClick={() => simpan(true)}>
                {sibuk === "ajukan" ? <Loader2 size={15} className="pk-putar" /> : <Send size={15} />}{" "}
                {perluKredit ? t("Ajukan (1 kredit)", "Submit (1 credit)") : t("Ajukan ulang", "Resubmit")}
              </button>
              <button type="button" className="pb-btn pb-btn-outline" disabled={Boolean(sibuk)} onClick={() => simpan(false)}>
                {sibuk === "simpan" && <Loader2 size={15} className="pk-putar" />} {t("Simpan draf", "Save draft")}
              </button>
            </>
          ) : (
            <button type="button" className="pb-btn pb-btn-primary" disabled={Boolean(sibuk)} onClick={() => simpan(false)}>
              {sibuk && <Loader2 size={15} className="pk-putar" />} {t("Simpan perubahan", "Save changes")}
            </button>
          )}
          {perluKredit && ["draf", "ditolak"].includes(status) && (
            <small className="pk-redup">{t(`Sisa kredit: ${kredit}`, `Credits left: ${kredit}`)}</small>
          )}
        </div>
      </form>
      <aside className="pk-pratinjau">
        <span className="pb-label">{t("Pratinjau di daftar loker", "Preview in the job list")}</span>
        <div style={{ pointerEvents: "none" }}>
          <KartuLoker job={contoh} />
        </div>
        <p className="pk-redup" style={{ fontSize: 13 }}>
          {t(
            `Setelah disetujui, loker tayang ${MASA_TAYANG_HARI} hari dengan label Prioritas.`,
            `Once approved, the job runs for ${MASA_TAYANG_HARI} days with a Featured label.`,
          )}
        </p>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------ kredit */

function BeliKredit({ pt, pilihan, onLunas }) {
  const [proses, setProses] = useState("");
  const [pesan, setPesan] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (pilihan) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [pilihan]);

  const beli = async (id) => {
    setProses(id);
    setPesan(null);
    try {
      const snap = await muatSnap();
      const { data, error } = await supabase.functions.invoke("bayar-loker", { body: { paket: id } });
      if (error) {
        let p = error.message;
        try {
          const b = await error.context?.json?.();
          if (b?.error) p = b.error;
        } catch {
          /* pesan bawaan */
        }
        throw new Error(p);
      }
      if (data?.error) throw new Error(data.error);
      snap.pay(data.snapToken, {
        onSuccess: async () => {
          setProses("");
          setPesan({ ok: true, teks: t("Pembayaran berhasil. Menambahkan kredit...", "Payment successful. Adding your credits...") });
          const awal = pt.kredit;
          for (let i = 0; i < 6; i++) {
            await new Promise((r) => setTimeout(r, 2500));
            const { data: d } = await supabase.from("perusahaan").select("kredit").eq("user_id", pt.user_id).maybeSingle();
            if ((d?.kredit ?? 0) > awal) break;
          }
          setPesan({ ok: true, teks: t("Kredit sudah ditambahkan. Silakan pasang loker.", "Credits added. You can post your job now.") });
          onLunas();
        },
        onPending: () => {
          setProses("");
          setPesan({ ok: false, teks: t("Pembayaran belum selesai. Kredit masuk otomatis setelah pembayaran terkonfirmasi.", "Payment isn't finished. Credits are added automatically once confirmed.") });
        },
        onError: () => {
          setProses("");
          setPesan({ ok: false, teks: t("Pembayaran gagal. Silakan coba lagi.", "Payment failed. Please try again.") });
        },
        onClose: () => setProses(""),
      });
    } catch (e) {
      setProses("");
      setPesan({ ok: false, teks: e.message });
    }
  };

  return (
    <div className="pk-panel" ref={ref}>
      <h2 style={{ margin: 0, fontSize: 20 }}>{t("Beli kredit loker", "Buy job credits")}</h2>
      <p className="pk-redup" style={{ margin: "4px 0 16px" }}>
        {t(`1 kredit = 1 loker prioritas selama ${MASA_TAYANG_HARI} hari. Kredit tidak hangus.`, `1 credit = 1 featured job for ${MASA_TAYANG_HARI} days. Credits never expire.`)}
      </p>
      <div className="pk-paket">
        {PAKET_LOKER.map((p) => (
          <div key={p.id} className={`pk-paket-item ${pilihan === p.id ? "dipilih" : ""} ${p.populer ? "populer" : ""}`}>
            <b>{p.nama}</b>
            <div className="harga">{rupiah(p.harga)}</div>
            <small>
              {p.kredit > 1 ? t(`${rupiah(Math.round(p.harga / p.kredit))} per loker · hemat ${p.hemat}%`, `${rupiah(Math.round(p.harga / p.kredit))} per post · save ${p.hemat}%`) : t("per loker", "per post")}
            </small>
            <button type="button" className={`pb-btn ${p.populer || pilihan === p.id ? "pb-btn-primary" : "pb-btn-outline"} pb-btn-sm`} disabled={Boolean(proses)} onClick={() => beli(p.id)}>
              {proses === p.id ? <Loader2 size={14} className="pk-putar" /> : null} {t("Beli", "Buy")}
            </button>
          </div>
        ))}
      </div>
      {pesan && (
        <p className={pesan.ok ? "pk-sukses" : "pk-galat"}>
          {pesan.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />} {pesan.teks}
        </p>
      )}
      <small className="pk-redup" style={{ display: "block", marginTop: 12 }}>
        {t("Pembayaran lewat QRIS, diproses aman oleh Midtrans.", "Pay by QRIS, processed securely by Midtrans.")}
      </small>
    </div>
  );
}

function RiwayatBeli({ beli }) {
  if (!beli.length) return null;
  const label = { pending: t("Menunggu bayar", "Awaiting payment"), paid: t("Lunas", "Paid"), failed: t("Gagal", "Failed") };
  return (
    <div className="pk-panel">
      <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>{t("Riwayat pembelian", "Purchase history")}</h3>
      <div className="pk-tabel">
        {beli.map((b) => (
          <div key={b.order_id}>
            <span>{tgl(b.dibuat_at)}</span>
            <span>{PAKET_LOKER.find((p) => p.id === b.paket)?.nama || b.paket}</span>
            <span>{rupiah(b.harga)}</span>
            <span className={`pk-status ${b.status === "paid" ? "hijau" : b.status === "failed" ? "merah" : "kuning"}`}>{label[b.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ daftar loker */

function BarisLoker({ m, onUbah, onAksi }) {
  const url = m.status === "tayang" ? urlDetail({ id: `db1:${ID_MITRA + m.id}`, posisi: m.posisi }) : null;
  const sisaHari = m.tayang_sampai ? Math.ceil((new Date(m.tayang_sampai) - Date.now()) / 86400000) : null;
  return (
    <div className={`pk-loker ${m.status}`}>
      <div className="isi">
        <div className="atas">
          <b>{m.posisi}</b>
          <Lencana status={m.status} />
        </div>
        <small>
          {[m.lokasi, TIPE.find((x) => x[0] === m.tipe)?.[1], CARA_KERJA.find((x) => x[0] === m.cara_kerja)?.[1]].filter(Boolean).join(" · ")}
        </small>
        <small>
          {m.status === "tayang" && sisaHari !== null
            ? t(`Tayang sampai ${tgl(m.tayang_sampai)} (${sisaHari} hari lagi)`, `Live until ${tgl(m.tayang_sampai)} (${sisaHari} days left)`)
            : m.status === "menunggu"
              ? t("Sedang dicek tim Workly", "Being reviewed by Workly")
              : m.status === "berakhir"
                ? t(`Berakhir ${tgl(m.tayang_sampai)}`, `Ended ${tgl(m.tayang_sampai)}`)
                : t(`Dibuat ${tgl(m.dibuat_at)}`, `Created ${tgl(m.dibuat_at)}`)}
        </small>
        {m.status === "ditolak" && m.alasan_tolak && (
          <small className="alasan">
            {t("Alasan: ", "Reason: ")}
            {m.alasan_tolak}
          </small>
        )}
      </div>
      <div className="angka">
        <span title={t("Dilihat", "Views")}>
          <Eye size={14} /> {m.dilihat.toLocaleString(lokal())}
        </span>
        <span title={t("Klik lamar", "Apply clicks")}>
          <MousePointerClick size={14} /> {m.klik.toLocaleString(lokal())}
        </span>
      </div>
      <div className="aksi">
        {url && (
          <a {...tautan(url)} title={t("Lihat di Workly", "View on Workly")}>
            <ExternalLink size={15} />
          </a>
        )}
        {["draf", "ditolak", "menunggu", "tayang"].includes(m.status) && (
          <button type="button" onClick={() => onUbah(m)} title={t("Ubah", "Edit")}>
            <Pencil size={15} />
          </button>
        )}
        {["draf", "ditolak"].includes(m.status) && (
          <button type="button" onClick={() => onUbah(m)} className="utama" title={t("Ajukan", "Submit")}>
            <Send size={15} />
          </button>
        )}
        {["menunggu", "tayang"].includes(m.status) && (
          <button type="button" onClick={() => onAksi("tutup", m)} title={t("Tutup loker", "Close job")}>
            <X size={15} />
          </button>
        )}
        {["draf", "ditolak"].includes(m.status) && (
          <button type="button" onClick={() => onAksi("hapus", m)} title={t("Hapus", "Delete")}>
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ halaman */

const TAB_SAH = ["daftar", "tulis", "kredit", "profil"];
const tabDariUrl = () => {
  const p = new URLSearchParams(window.location.search);
  if (p.get("beli")) return "kredit";
  const tab = p.get("tab");
  return TAB_SAH.includes(tab) ? tab : "daftar";
};

export function DasborMitraPage() {
  const { user, peran, peranSiap, signOut } = useAuth();
  const data = useDataMitra();
  const [toast, elemenToast] = useToast();
  const [mode, setModeState] = useState(tabDariUrl); // daftar | tulis | profil | kredit
  const [sunting, setSunting] = useState(null);
  const pilihPaket = useMemo(() => new URLSearchParams(window.location.search).get("beli"), []);

  useEffect(() => {
    document.title = t("Dasbor pemberi kerja · Workly", "Employer dashboard · Workly");
  }, []);
  // Tab mengikuti alamat (?tab=...), jadi menu header dan tombol kembali browser ikut bekerja
  const setMode = (m) => {
    setModeState(m);
    const url = m === "daftar" ? "/pemberi-kerja/dasbor" : `/pemberi-kerja/dasbor?tab=${m}`;
    if (window.location.pathname + window.location.search !== url) {
      window.history.pushState({}, "", url);
      window.dispatchEvent(new Event("popstate"));
    }
  };
  useEffect(() => {
    // Dari menu header (jf:path): "Pasang loker" selalu membuka formulir kosong
    const dariMenu = () =>
      setTimeout(() => {
        const tab = tabDariUrl();
        setModeState(tab);
        if (tab === "tulis") setSunting(null);
      }, 0);
    const dariRiwayat = () => setTimeout(() => setModeState(tabDariUrl()), 0);
    window.addEventListener("jf:path", dariMenu);
    window.addEventListener("popstate", dariRiwayat);
    return () => {
      window.removeEventListener("jf:path", dariMenu);
      window.removeEventListener("popstate", dariRiwayat);
    };
  }, []);

  const aksi = async (jenis, m) => {
    if (jenis === "tutup" && !window.confirm(t(`Tutup loker "${m.posisi}"? Loker langsung hilang dari Workly.`, `Close "${m.posisi}"? It will be removed from Workly right away.`))) return;
    if (jenis === "hapus" && !window.confirm(t(`Hapus draf "${m.posisi}"?`, `Delete draft "${m.posisi}"?`))) return;
    const { error } =
      jenis === "tutup"
        ? await supabase.rpc("tutup_loker", { p_id: m.id })
        : await supabase.from("loker_perusahaan").delete().eq("id", m.id);
    if (error) toast(error.message);
    else toast(jenis === "tutup" ? t("Loker ditutup", "Job closed") : t("Draf dihapus", "Draft deleted"));
    data.muat();
  };

  if (!supabaseConfigured || !user) return null;

  if (!peranSiap) {
    return (
      <PublicLayout aktif="/pemberi-kerja">
        <div className="pb-wrap pk-dasbor">
          <div className="pk-panel pk-tengah">
            <Loader2 size={18} className="pk-putar" /> {t("Menyiapkan akun...", "Preparing your account...")}
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (peran !== "perusahaan") {
    return (
      <PublicLayout aktif="/pemberi-kerja">
        <div className="pb-wrap pk-dasbor">
          <div className="pk-panel" style={{ maxWidth: 560, margin: "40px auto", display: "grid", gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 22 }}>{t("Halaman ini untuk akun perusahaan", "This page is for company accounts")}</h1>
            <p className="pk-redup" style={{ margin: 0, lineHeight: 1.6 }}>
              {t(
                `Kamu masuk sebagai pencari kerja (${user.email}). Untuk memasang loker, keluar lalu masuk atau daftar dengan akun perusahaan memakai email lain.`,
                `You're signed in as a job seeker (${user.email}). To post jobs, sign out and sign in or register with a company account using another email.`,
              )}
            </p>
            <div className="pk-tombol">
              <button
                type="button"
                className="pb-btn pb-btn-primary"
                onClick={async () => {
                  await signOut();
                  window.dispatchEvent(new CustomEvent("jf:path", { detail: "/pemberi-kerja/daftar" }));
                }}
              >
                {t("Keluar & daftar perusahaan", "Sign out & register a company")}
              </button>
              <a className="pb-btn pb-btn-outline" {...tautan("/dashboard/overview")}>
                {t("Kembali ke dasbor pencari kerja", "Back to job seeker dashboard")}
              </a>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const ringkas = {
    tayang: data.loker.filter((m) => m.status === "tayang").length,
    menunggu: data.loker.filter((m) => m.status === "menunggu").length,
    dilihat: data.loker.reduce((n, m) => n + (m.dilihat || 0), 0),
    klik: data.loker.reduce((n, m) => n + (m.klik || 0), 0),
  };

  let isi;
  if (data.memuat) {
    isi = (
      <div className="pk-panel pk-tengah">
        <Loader2 size={18} className="pk-putar" /> {t("Memuat...", "Loading...")}
      </div>
    );
  } else if (data.galat) {
    isi = (
      <p className="pk-galat">
        <AlertTriangle size={15} /> {data.galat}
      </p>
    );
  } else if (!data.pt || mode === "profil") {
    isi = (
      <FormProfil
        pt={data.pt}
        onBatal={data.pt ? () => setMode("daftar") : null}
        onSimpan={() => {
          toast(t("Profil tersimpan", "Profile saved"));
          setMode(pilihPaket && !data.pt ? "kredit" : "daftar");
          data.muat();
        }}
      />
    );
  } else if (mode === "tulis") {
    isi = (
      <FormLoker
        key={sunting?.id || "baru"}
        pt={data.pt}
        awal={sunting}
        kredit={data.pt.kredit}
        onBatal={() => setMode("daftar")}
        onSelesai={(j) => {
          toast(j === "ajukan" ? t("Loker diajukan. Tim Workly akan mengeceknya.", "Submitted. The Workly team will review it.") : t("Tersimpan", "Saved"));
          setMode("daftar");
          data.muat();
        }}
      />
    );
  } else if (mode === "kredit") {
    isi = (
      <>
        <BeliKredit pt={data.pt} pilihan={pilihPaket} onLunas={data.muat} />
        <RiwayatBeli beli={data.beli} />
      </>
    );
  } else {
    isi = (
      <div className="pk-panel">
        <div className="pk-daftar-atas">
          <h2 style={{ margin: 0, fontSize: 20 }}>{t("Loker kamu", "Your jobs")}</h2>
          <button
            type="button"
            className="pb-btn pb-btn-primary pb-btn-sm"
            onClick={() => {
              setSunting(null);
              setMode("tulis");
            }}
          >
            <Plus size={15} /> {t("Pasang loker", "Post a job")}
          </button>
        </div>
        {data.loker.length === 0 ? (
          <div className="pk-kosong">
            <p>{t("Belum ada loker. Mulai dengan menulis loker pertamamu; bisa disimpan sebagai draf dulu.", "No jobs yet. Start by writing your first one; you can save it as a draft.")}</p>
            {data.pt.kredit < 1 && (
              <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={() => setMode("kredit")}>
                {t("Beli kredit", "Buy credits")}
              </button>
            )}
          </div>
        ) : (
          <div className="pk-daftar">
            {data.loker.map((m) => (
              <BarisLoker
                key={m.id}
                m={m}
                onAksi={aksi}
                onUbah={(x) => {
                  setSunting(x);
                  setMode("tulis");
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <PublicLayout aktif="/pemberi-kerja">
      <div className="pb-wrap pk-dasbor">
        <div className="pk-kepala">
          <div className="pk-kepala-pt">
            <div className="pk-logo kecil">{data.pt?.logo_url ? <img src={data.pt.logo_url} alt="" /> : (data.pt?.nama || "PT").slice(0, 2).toUpperCase()}</div>
            <div>
              <span className="pb-label">{t("Dasbor pemberi kerja", "Employer dashboard")}</span>
              <h1>{data.pt?.nama || t("Akun perusahaan", "Company account")}</h1>
            </div>
          </div>
          {data.pt && (
            <nav className="pk-tab" aria-label={t("Menu dasbor", "Dashboard menu")}>
              {[
                ["daftar", t("Loker", "Jobs")],
                ["kredit", t("Kredit", "Credits")],
                ["profil", t("Profil perusahaan", "Company profile")],
              ].map(([id, l]) => (
                <button key={id} type="button" className={mode === id || (id === "daftar" && mode === "tulis") ? "on" : ""} onClick={() => setMode(id)}>
                  {l}
                </button>
              ))}
            </nav>
          )}
        </div>

        {data.pt && (
          <div className="pk-ringkas">
            <div>
              <small>{t("Sisa kredit", "Credits left")}</small>
              <b>{data.pt.kredit}</b>
              <button type="button" className="pb-link" onClick={() => setMode("kredit")}>
                {t("Beli kredit", "Buy credits")}
              </button>
            </div>
            <div>
              <small>{t("Sedang tayang", "Live")}</small>
              <b>{ringkas.tayang}</b>
              <span className="pk-redup">
                <Clock size={12} /> {ringkas.menunggu} {t("menunggu dicek", "in review")}
              </span>
            </div>
            <div>
              <small>{t("Total dilihat", "Total views")}</small>
              <b>{ringkas.dilihat.toLocaleString(lokal())}</b>
            </div>
            <div>
              <small>{t("Total klik lamar", "Total apply clicks")}</small>
              <b>{ringkas.klik.toLocaleString(lokal())}</b>
            </div>
          </div>
        )}

        {isi}
        <p className="pk-redup" style={{ fontSize: 13, marginTop: 18 }}>
          <Check size={13} /> {t("Butuh bantuan? Hubungi tim Workly lewat halaman ", "Need help? Contact the Workly team via the ")}
          <a {...tautan("/faq")}>FAQ</a>.
        </p>
      </div>
      {elemenToast}
    </PublicLayout>
  );
}
