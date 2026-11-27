import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle, ArrowLeft, Check, CheckCircle2, Clock, Eye, ExternalLink, ImagePlus, Loader2,
  MousePointerClick, Pencil, Plus, Send, Trash2, X, XCircle, Download, Users, FileText, Mail, Phone, MapPin, Link2,
} from "lucide-react";
import { PublicLayout, useToast } from "../../components/publik/PublicLayout";
import { KartuLoker } from "../../components/publik/KartuLoker";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { BIDANG } from "../../data/bidang";
import { PAKET_LOKER, MASA_TAYANG_HARI, rupiah, ketHargaPaket } from "../../data/paketLoker";
import { mapSupabaseJob } from "../../utils/petaLoker";
import { urlDetail } from "../../utils/sumberLoker";
import { muatSnap, lanjutkanBayar, sisaMenitBayar } from "../../utils/snap";
import { unduhInvoice } from "../../utils/invoicePdf";
import { kecilkanLogo, MAKS_ASLI, MAKS_HASIL } from "../../utils/kecilkanLogo";
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

/** Cara pelamar melamar (sama dengan SQL 22). */
export const CARA_LAMAR = [
  {
    id: "form",
    judul: t("Formulir Workly", "Workly form"),
    ket: t(
      "Pelamar mengisi formulir di Workly dan mengunggah CV. Lamaran langsung dikirim ke email perusahaan dan tersimpan di dasbor ini.",
      "Applicants fill in a form on Workly and upload a CV. Applications go straight to your email and are kept in this dashboard.",
    ),
  },
  {
    id: "link",
    judul: t("Link formulir perusahaan", "Your own form or page"),
    ket: t("Pelamar diarahkan ke Google Form, situs karier, atau sistem rekrutmen milik perusahaan.", "Applicants are sent to your Google Form, careers page, or applicant tracking system."),
  },
  {
    id: "email",
    judul: t("Lewat email", "By email"),
    ket: t("Pelamar mengirim CV langsung ke alamat email perusahaan.", "Applicants send their CV directly to your email address."),
  },
];

/** Alamat yang dibuka tombol lamar, sesuai cara melamar. */
export function alamatLamar(m) {
  const cara = m.cara_lamar || "link";
  if (cara === "form") return `${window.location.origin}/lamar/${m.id || 0}`;
  if (cara === "email") return `mailto:${m.email_lamaran || ""}?subject=${encodeURIComponent(`Lamaran ${m.posisi || ""} (via Workly)`)}`;
  return m.link;
}

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
      job_url: alamatLamar(m),
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
  const [d, setD] = useState({ memuat: true, pt: null, loker: [], beli: [], lamaran: [], galat: "" });
  const muat = useCallback(async () => {
    if (!user) return;
    await supabase.rpc("rapikan_loker_mitra").then(() => {}, () => {});
    const [pt, loker, beli, lamaran] = await Promise.all([
      supabase.from("perusahaan").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("loker_perusahaan").select("*").eq("user_id", user.id).order("dibuat_at", { ascending: false }),
      supabase.from("pembelian_kredit").select("*").eq("user_id", user.id).order("dibuat_at", { ascending: false }).limit(20),
      // RLS: hanya lamaran untuk loker milik perusahaan ini
      supabase.from("lamaran_mitra").select("*").order("dibuat_at", { ascending: false }).limit(1000),
    ]);
    const galat = pt.error || loker.error;
    setD({
      memuat: false,
      pt: pt.data || null,
      loker: loker.data || [],
      beli: beli.data || [],
      lamaran: lamaran.data || [],
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
    if (file.size > MAKS_ASLI) return setGalat(t("Ukuran file maksimal 5 MB.", "File must be 5 MB or smaller."));
    setSibuk(true);
    setGalat("");
    let hasil;
    try {
      // Dikecilkan dulu (maks. 256 px, WEBP) supaya penyimpanan tetap ringan
      hasil = await kecilkanLogo(file);
    } catch (err) {
      setSibuk(false);
      return setGalat(err.message);
    }
    if (hasil.blob.size > MAKS_HASIL) {
      setSibuk(false);
      return setGalat(t("Logo terlalu rumit untuk dikecilkan. Coba gambar yang lebih sederhana.", "The logo is too complex to shrink. Try a simpler image."));
    }
    const path = `${user.id}/logo-${Date.now()}.${hasil.ext}`;
    // Nama file selalu baru, jadi tidak perlu upsert (upsert butuh izin tambahan)
    const { error } = await supabase.storage.from("logo-perusahaan").upload(path, hasil.blob, { upsert: false, contentType: hasil.tipe });
    setSibuk(false);
    if (error) {
      return setGalat(
        /row-level security|not authorized|bucket not found/i.test(error.message)
          ? t("Logo belum bisa diunggah karena izin penyimpanan belum disiapkan (SQL 20). Hubungi admin Workly.", "The logo can't be uploaded yet because storage permissions aren't set up (SQL 20). Contact the Workly admin.")
          : t("Logo gagal diunggah: ", "Logo upload failed: ") + error.message,
      );
    }
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
            {t("Persegi, PNG/JPG/WEBP/SVG. Otomatis dikecilkan ke 256 px.", "Square, PNG/JPG/WEBP/SVG. Automatically resized to 256 px.")}
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
  cara_lamar: "form",
  email_lamaran: "",
  deskripsi: "",
};

function FormLoker({ pt, awal, kredit, onSelesai, onBatal }) {
  const { user } = useAuth();
  const [f, setF] = useState(() => {
    if (!awal) return { ...LOKER_KOSONG, lokasi: pt?.kota || "", email_lamaran: user?.email || "" };
    const isi = { ...LOKER_KOSONG, ...Object.fromEntries(Object.entries(awal).map(([k, v]) => [k, v ?? ""])), tampilkan_gaji: awal.tampilkan_gaji !== false };
    // Loker lama yang memakai mailto: di kolom link ditampilkan sebagai "Lewat email"
    if ((awal.cara_lamar || "link") === "link" && String(awal.link).startsWith("mailto:")) {
      isi.cara_lamar = "email";
      isi.email_lamaran = String(awal.link).replace(/^mailto:/, "").split("?")[0];
      isi.link = "";
    }
    if (!isi.email_lamaran && isi.cara_lamar !== "link") isi.email_lamaran = user?.email || "";
    return isi;
  });
  const [sibuk, setSibuk] = useState("");
  const [galat, setGalat] = useState("");
  const ubah = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const status = awal?.status || "draf";
  const perluKredit = !awal?.sudah_bayar;

  const baris = useMemo(() => {
    let link = f.cara_lamar === "link" ? f.link.trim() : "";
    if (link && !/^https?:/i.test(link)) link = `https://${link}`;
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
      cara_lamar: f.cara_lamar,
      email_lamaran: f.cara_lamar === "link" ? null : f.email_lamaran.trim().toLowerCase() || null,
      deskripsi: f.deskripsi.trim(),
    };
  }, [f]);

  const periksa = () => {
    if (baris.posisi.length < 2) return t("Nama posisi wajib diisi.", "Job title is required.");
    if (baris.cara_lamar === "link" && !/^https?:\/\/[^\s.]+\.[^\s]+/i.test(baris.link))
      return t("Isi link formulir atau halaman lamaran perusahaan, misalnya https://forms.gle/...", "Enter your application form or page link, e.g. https://forms.gle/...");
    if (baris.cara_lamar !== "link" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(baris.email_lamaran || ""))
      return t("Isi alamat email perusahaan yang benar.", "Enter a valid company email address.");
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
          <fieldset className="lebar pk-cara-lamar">
            <legend>{t("Cara pelamar melamar *", "How candidates apply *")}</legend>
            <div className="pilihan">
              {CARA_LAMAR.map((c) => (
                <label key={c.id} className={f.cara_lamar === c.id ? "on" : ""}>
                  <input type="radio" name="cara_lamar" value={c.id} checked={f.cara_lamar === c.id} onChange={ubah("cara_lamar")} />
                  <b>
                    {c.judul}
                    {c.id === "form" && <span className="pk-rekom">{t("Disarankan", "Recommended")}</span>}
                  </b>
                  <small>{c.ket}</small>
                </label>
              ))}
            </div>
            {f.cara_lamar === "link" && (
              <label>
                <span>{t("Link formulir / halaman lamaran *", "Application form / page link *")}</span>
                <input value={f.link} onChange={ubah("link")} placeholder="https://forms.gle/...  atau  https://contoh.co.id/karier" />
              </label>
            )}
            {f.cara_lamar === "form" && (
              <label>
                <span>{t("Kirim lamaran ke email *", "Send applications to email *")}</span>
                <input type="email" value={f.email_lamaran} onChange={ubah("email_lamaran")} placeholder="hrd@contoh.co.id" />
                <small>{t("Setiap lamaran dikirim ke email ini beserta CV-nya, dan juga tersimpan di dasbor.", "Each application, with its CV, is sent to this email and also kept in your dashboard.")}</small>
              </label>
            )}
            {f.cara_lamar === "email" && (
              <label>
                <span>{t("Email penerima lamaran *", "Email that receives applications *")}</span>
                <input type="email" value={f.email_lamaran} onChange={ubah("email_lamaran")} placeholder="hrd@contoh.co.id" />
                <small>{t("Alamat ini tampil ke pelamar.", "This address is shown to applicants.")}</small>
              </label>
            )}
          </fieldset>
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
          setPesan({ ok: false, teks: t("Pembayaran belum selesai. Lanjutkan kapan saja lewat tombol \"Lanjutkan bayar\" sebelum waktunya habis; kredit masuk otomatis setelah lunas.", "Payment isn't finished. Use \"Continue payment\" before it expires; credits are added automatically once paid.") });
          onLunas();
        },
        onError: () => {
          setProses("");
          setPesan({ ok: false, teks: t("Pembayaran gagal. Silakan coba lagi.", "Payment failed. Please try again.") });
        },
        onClose: () => {
          setProses("");
          onLunas(); // tampilkan pembayaran tertunda, bila ada
        },
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
              {ketHargaPaket(p)}
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

/** Pembayaran yang jendelanya tertutup tetapi masih bisa dilanjutkan. */
const bisaDilanjutkan = (b) => b.status === "pending" && b.snap_token && sisaMenitBayar(b.dibuat_at) > 0;

function TombolLanjutBayar({ b, onLunas, kecil }) {
  const [sibuk, setSibuk] = useState(false);
  const [pesan, setPesan] = useState("");
  const lanjut = async () => {
    setSibuk(true);
    setPesan("");
    try {
      await lanjutkanBayar(b.snap_token, {
        onSuccess: () => {
          setSibuk(false);
          setPesan(t("Pembayaran berhasil. Kredit sedang ditambahkan...", "Payment successful. Adding credits..."));
          setTimeout(onLunas, 3000);
        },
        onPending: () => setSibuk(false),
        onError: () => {
          setSibuk(false);
          setPesan(t("Sesi pembayaran ini sudah tidak berlaku. Silakan beli ulang.", "This payment session is no longer valid. Please buy again."));
        },
        onClose: () => setSibuk(false),
      });
    } catch (e) {
      setSibuk(false);
      setPesan(e.message);
    }
  };
  return (
    <>
      <button type="button" className={`pb-btn pb-btn-primary ${kecil ? "pb-btn-sm" : ""}`} disabled={sibuk} onClick={lanjut}>
        {sibuk ? <Loader2 size={14} className="pk-putar" /> : <Clock size={14} />} {t("Lanjutkan bayar", "Continue payment")}
      </button>
      {pesan && <small className="pk-redup" style={{ display: "block", marginTop: 6 }}>{pesan}</small>}
    </>
  );
}

/** Kartu di atas paket: pembayaran yang belum selesai. */
function BayarTertunda({ beli, onLunas }) {
  const tertunda = beli.filter(bisaDilanjutkan);
  if (!tertunda.length) return null;
  return (
    <div className="pk-tertunda">
      {tertunda.map((b) => (
        <div key={b.order_id}>
          <div>
            <b>{t("Pembayaran belum selesai", "Payment not finished")}</b>
            <span>
              {PAKET_LOKER.find((p) => p.id === b.paket)?.nama || b.paket} · {rupiah(b.harga)} ·{" "}
              {t(`sisa waktu ${sisaMenitBayar(b.dibuat_at)} menit`, `${sisaMenitBayar(b.dibuat_at)} min left`)}
            </span>
          </div>
          <div>
            <TombolLanjutBayar b={b} onLunas={onLunas} kecil />
          </div>
        </div>
      ))}
    </div>
  );
}

function RiwayatBeli({ beli, pt, onLunas }) {
  const { user } = useAuth();
  if (!beli.length) return null;
  const label = {
    pending: t("Menunggu bayar", "Awaiting payment"),
    kedaluwarsa: t("Kedaluwarsa", "Expired"),
    paid: t("Lunas", "Paid"),
    failed: t("Gagal / batal", "Failed / cancelled"),
  };
  const warna = { paid: "hijau", failed: "merah", kedaluwarsa: "abu", pending: "kuning" };
  return (
    <div className="pk-panel">
      <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>{t("Riwayat pembelian & invoice", "Purchases & invoices")}</h3>
      <p className="pk-redup" style={{ margin: "0 0 12px", fontSize: 13 }}>
        {t("Invoice tersedia untuk setiap pembelian yang sudah lunas.", "An invoice is available for every paid purchase.")}
      </p>
      <div className="pk-riwayat">
        <div className="kepala">
          <span>{t("Tanggal", "Date")}</span>
          <span>{t("No. invoice / pesanan", "Invoice / order no.")}</span>
          <span>{t("Paket", "Bundle")}</span>
          <span>Total</span>
          <span>Status</span>
          <span />
        </div>
        {beli.map((b) => {
          const st = b.status === "pending" && !bisaDilanjutkan(b) ? "kedaluwarsa" : b.status;
          return (
            <div key={b.order_id}>
              <span>{tgl(b.dibayar_at || b.dibuat_at)}</span>
              <span className="mono">{b.no_invoice || b.order_id}</span>
              <span>
                {PAKET_LOKER.find((p) => p.id === b.paket)?.nama || b.paket}
                <small>{t(`${b.kredit} kredit`, `${b.kredit} credits`)}</small>
              </span>
              <span>{rupiah(b.harga)}</span>
              <span>
                <span className={`pk-status ${warna[st]}`}>{label[st]}</span>
              </span>
              <span className="aksi">
                {b.status === "paid" && (
                  <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={() => unduhInvoice(b, pt, user?.email)}>
                    <Download size={14} /> Invoice
                  </button>
                )}
                {st === "pending" && <TombolLanjutBayar b={b} onLunas={onLunas} kecil />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ daftar loker */

/** Loker yang sedang menunggu dan belum pernah tayang: kreditnya bisa dikembalikan. */
const belumTayang = (m) => m.status === "menunggu" && !m.tayang_sampai;

/** Kotak persetujuan sebelum membatalkan, menutup, atau menghapus loker. */
function KonfirmasiAksi({ aksi, onBatal, onYa }) {
  const [sibuk, setSibuk] = useState(false);
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && !sibuk && onBatal();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onBatal, sibuk]);
  if (!aksi) return null;
  const { jenis, m } = aksi;
  const sisaHari = m.tayang_sampai ? Math.max(0, Math.ceil((new Date(m.tayang_sampai) - Date.now()) / 86400000)) : 0;

  let judul, isi, tombol, bahaya;
  if (jenis === "hapus") {
    judul = t("Hapus draf ini?", "Delete this draft?");
    isi = [t(`Draf "${m.posisi}" akan dihapus permanen.`, `The draft "${m.posisi}" will be permanently deleted.`), t("Tidak ada kredit yang terpakai.", "No credits are used.")];
    tombol = t("Ya, hapus draf", "Yes, delete draft");
    bahaya = true;
  } else if (belumTayang(m)) {
    judul = t("Batalkan pengajuan loker?", "Cancel this submission?");
    isi = [
      t(`"${m.posisi}" belum disetujui, jadi pengajuannya bisa dibatalkan.`, `"${m.posisi}" hasn't been approved yet, so the submission can be cancelled.`),
      t("1 kredit dikembalikan ke akunmu.", "1 credit is returned to your account."),
      t("Loker kembali menjadi draf; kamu bisa mengubah lalu mengajukannya lagi, atau menghapusnya.", "The job goes back to draft; you can edit and resubmit it, or delete it."),
    ];
    tombol = t("Ya, batalkan & kembalikan kredit", "Yes, cancel & refund credit");
    bahaya = false;
  } else {
    judul = t("Tutup loker ini?", "Close this job?");
    isi = [
      t(`"${m.posisi}" langsung hilang dari Workly dan tidak bisa ditayangkan lagi.`, `"${m.posisi}" is removed from Workly right away and can't be published again.`),
      sisaHari > 0
        ? t(`Sisa masa tayang ${sisaHari} hari ikut hangus. Kredit tidak dikembalikan karena loker sudah pernah tayang.`, `The remaining ${sisaHari} days are forfeited. The credit isn't refunded because the job has already been live.`)
        : t("Kredit tidak dikembalikan karena loker sudah pernah tayang.", "The credit isn't refunded because the job has already been live."),
      t("Kalau hanya ingin mengubah isi, pakai tombol Ubah saja.", "If you only want to change the content, use Edit instead."),
    ];
    tombol = t("Ya, tutup loker", "Yes, close job");
    bahaya = true;
  }

  return (
    <div className="pk-modal-latar" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && !sibuk && onBatal()}>
      <div className="pk-modal" role="dialog" aria-modal="true" aria-labelledby="pk-modal-judul">
        <h3 id="pk-modal-judul">{judul}</h3>
        <ul>
          {isi.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <div className="pk-tombol" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="pb-btn pb-btn-outline" disabled={sibuk} onClick={onBatal} autoFocus>
            {t("Kembali", "Go back")}
          </button>
          <button
            type="button"
            className={`pb-btn ${bahaya ? "pk-btn-bahaya" : "pb-btn-primary"}`}
            disabled={sibuk}
            onClick={async () => {
              setSibuk(true);
              await onYa();
              setSibuk(false);
            }}
          >
            {sibuk && <Loader2 size={15} className="pk-putar" />} {tombol}
          </button>
        </div>
      </div>
    </div>
  );
}

function BarisLoker({ m, onUbah, onAksi, jumlahPelamar = 0, baru = 0, onPelamar }) {
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
        {(m.cara_lamar === "form" || jumlahPelamar > 0) && (
          <button type="button" className="pk-tombol-pelamar" onClick={() => onPelamar(m)} title={t("Lihat pelamar", "View applicants")}>
            <Users size={15} /> {jumlahPelamar}
            {baru > 0 && <i>{t(`${baru} baru`, `${baru} new`)}</i>}
          </button>
        )}
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
          <button
            type="button"
            onClick={() => onAksi("tutup", m)}
            title={belumTayang(m) ? t("Batalkan pengajuan", "Cancel submission") : t("Tutup loker", "Close job")}
          >
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

/* ------------------------------------------------------ pelamar */

export const STATUS_LAMARAN = {
  baru: t("Baru", "New"),
  dilihat: t("Sudah dilihat", "Seen"),
  diproses: t("Diproses", "In process"),
  diterima: t("Diterima", "Accepted"),
  ditolak: t("Tidak lanjut", "Not proceeding"),
};

function PanelPelamar({ m, lamaran, onKembali, onUbah }) {
  const [toast, elemenToast] = useToast();
  const [buka, setBuka] = useState(null);
  const [saring, setSaring] = useState("semua");
  const daftar = lamaran.filter((l) => saring === "semua" || l.status === saring);

  const ubahStatus = async (l, status) => {
    const { error } = await supabase.from("lamaran_mitra").update({ status }).eq("id", l.id);
    if (error) return toast(error.message);
    onUbah(l.id, status);
  };
  const unduhCv = async (l) => {
    const { data, error } = await supabase.storage.from("cv-pelamar").createSignedUrl(l.cv_path, 3600, {
      download: `CV-${l.nama.replace(/[^A-Za-z0-9]+/g, "-")}.pdf`,
    });
    if (error) return toast(t("CV tidak bisa dibuka: ", "Couldn't open CV: ") + error.message);
    window.open(data.signedUrl, "_blank", "noopener");
    if (l.status === "baru") ubahStatus(l, "dilihat");
  };

  return (
    <div className="pk-panel">
      <button type="button" className="pk-kembali" onClick={onKembali}>
        <ArrowLeft size={15} /> {t("Kembali ke daftar loker", "Back to job list")}
      </button>
      <div className="pk-daftar-atas">
        <div>
          <h2 style={{ margin: 0, fontSize: 20 }}>{t(`Pelamar ${m.posisi}`, `Applicants: ${m.posisi}`)}</h2>
          <small className="pk-redup">
            {t(`${lamaran.length} lamaran masuk lewat formulir Workly`, `${lamaran.length} applications via the Workly form`)}
          </small>
        </div>
        <select value={saring} onChange={(e) => setSaring(e.target.value)} className="pk-saring">
          <option value="semua">{t("Semua status", "All statuses")}</option>
          {Object.entries(STATUS_LAMARAN).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {daftar.length === 0 ? (
        <div className="pk-kosong">
          <p>
            {lamaran.length === 0
              ? t("Belum ada pelamar. Lamaran yang masuk akan tampil di sini dan juga dikirim ke email perusahaan.", "No applicants yet. New applications appear here and are also emailed to you.")
              : t("Tidak ada pelamar dengan status ini.", "No applicants with this status.")}
          </p>
        </div>
      ) : (
        <div className="pk-pelamar">
          {daftar.map((l) => (
            <div key={l.id} className={`pk-pelamar-baris ${l.status}`}>
              <div className="kepala" onClick={() => setBuka(buka === l.id ? null : l.id)}>
                <div className="nama">
                  <b>{l.nama}</b>
                  <small>
                    {[l.domisili, tgl(l.dibuat_at)].filter(Boolean).join(" · ")}
                  </small>
                </div>
                <span className={`pk-status-lamar ${l.status}`}>{STATUS_LAMARAN[l.status] || l.status}</span>
              </div>
              <div className="kontak">
                <a href={`mailto:${l.email}`}>
                  <Mail size={13} /> {l.email}
                </a>
                {l.telepon && (
                  <a href={`https://wa.me/${l.telepon.replace(/\D/g, "").replace(/^0/, "62")}`} target="_blank" rel="noreferrer">
                    <Phone size={13} /> {l.telepon}
                  </a>
                )}
                {l.domisili && (
                  <span>
                    <MapPin size={13} /> {l.domisili}
                  </span>
                )}
                {l.tautan && (
                  <a href={l.tautan} target="_blank" rel="noreferrer">
                    <Link2 size={13} /> {l.tautan.replace(/^https?:\/\/(www\.)?/, "").slice(0, 40)}
                  </a>
                )}
              </div>
              {l.pesan && (buka === l.id ? <p className="pesan">{l.pesan}</p> : <p className="pesan ringkas" onClick={() => setBuka(l.id)}>{l.pesan}</p>)}
              <div className="pk-tombol">
                <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={() => unduhCv(l)}>
                  <FileText size={14} /> {t("Lihat CV", "View CV")}
                </button>
                <label className="pk-ubah-status">
                  <span>{t("Status", "Status")}</span>
                  <select value={l.status} onChange={(e) => ubahStatus(l, e.target.value)}>
                    {Object.entries(STATUS_LAMARAN).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="pk-redup" style={{ fontSize: 12.5, margin: "14px 0 0" }}>
        {t("Status hanya untuk catatanmu sendiri dan tidak dikirim ke pelamar. Hubungi pelamar lewat email atau WhatsApp.", "Status is only for your own tracking and isn't sent to applicants. Contact applicants by email or WhatsApp.")}
      </p>
      {elemenToast}
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
  const [pelamarDari, setPelamarDari] = useState(null); // loker yang sedang dilihat pelamarnya
  const [ubahanLamaran, setUbahanLamaran] = useState({}); // id -> status (pembaruan lokal)
  const pilihPaket = useMemo(() => new URLSearchParams(window.location.search).get("beli"), []);

  useEffect(() => {
    document.title = t("Dasbor pemberi kerja · Workly", "Employer dashboard · Workly");
  }, []);
  // Tab mengikuti alamat (?tab=...), jadi menu header dan tombol kembali browser ikut bekerja
  const setMode = (m) => {
    setModeState(m);
    setPelamarDari(null);
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

  // Aksi tutup/hapus selalu lewat kotak persetujuan dulu
  const [konfirmasi, setKonfirmasi] = useState(null);
  const aksi = (jenis, m) => setKonfirmasi({ jenis, m });
  const jalankanAksi = async () => {
    const { jenis, m } = konfirmasi;
    if (jenis === "tutup") {
      const { data: hasil, error } = await supabase.rpc("tutup_loker", { p_id: m.id });
      if (error) toast(error.message);
      else if (hasil === "dibatalkan") toast(t("Pengajuan dibatalkan, 1 kredit dikembalikan", "Submission cancelled, 1 credit refunded"));
      else toast(t("Loker ditutup", "Job closed"));
    } else {
      const { error } = await supabase.from("loker_perusahaan").delete().eq("id", m.id);
      toast(error ? error.message : t("Draf dihapus", "Draft deleted"));
    }
    setKonfirmasi(null);
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

  const lamaranLoker = (id) =>
    data.lamaran.filter((l) => l.loker_id === id).map((l) => (ubahanLamaran[l.id] ? { ...l, status: ubahanLamaran[l.id] } : l));

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
        <BayarTertunda beli={data.beli} onLunas={data.muat} />
        <BeliKredit pt={data.pt} pilihan={pilihPaket} onLunas={data.muat} />
        <RiwayatBeli beli={data.beli} pt={data.pt} onLunas={data.muat} />
      </>
    );
  } else if (pelamarDari && mode === "daftar") {
    isi = (
      <PanelPelamar
        m={pelamarDari}
        lamaran={lamaranLoker(pelamarDari.id)}
        onKembali={() => setPelamarDari(null)}
        onUbah={(id, status) => setUbahanLamaran((x) => ({ ...x, [id]: status }))}
      />
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
                jumlahPelamar={lamaranLoker(m.id).length}
                baru={lamaranLoker(m.id).filter((l) => l.status === "baru").length}
                onPelamar={(x) => {
                  setPelamarDari(x);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
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
      <KonfirmasiAksi aksi={konfirmasi} onBatal={() => setKonfirmasi(null)} onYa={jalankanAksi} />
      {elemenToast}
    </PublicLayout>
  );
}
