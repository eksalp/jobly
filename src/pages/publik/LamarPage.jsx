import React, { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, FileUp, Loader2, Send } from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { useAuth } from "../../context/AuthContext";
import { useUserProfile } from "../../context/UserProfileContext";
import { useJobs } from "../../context/JobsContext";
import { supabase } from "../../lib/supabaseClient";
import { panggilApi, keJob } from "../../utils/apiLoker";
import { urlDetail } from "../../utils/sumberLoker";
import { tautan, keHalaman } from "../../utils/navigasi";
import { logoPerusahaan } from "../../utils/sumberLoker";
import { t } from "../../i18n.js";

const ID_MITRA = 800000000;
const MAKS_CV = 2 * 1024 * 1024;

/**
 * Formulir lamaran Workly untuk loker perusahaan yang memilih cara melamar
 * "Formulir Workly" (workly.id/lamar/<nomor loker>). Lamaran dikirim lewat
 * edge function kirim-lamaran: tersimpan di dasbor perusahaan dan diteruskan
 * ke email perusahaan beserta CV.
 */
export function LamarPage({ nomor }) {
  const { session, user, peran } = useAuth();
  const profil = useUserProfile();
  const { penuh, siap } = useJobs();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState("memuat"); // memuat | siap | kosong
  const [f, setF] = useState({ nama: "", email: "", telepon: "", domisili: "", tautan: "", pesan: "" });
  const [cv, setCv] = useState(null);
  const [kirim, setKirim] = useState({ sibuk: false, galat: "", selesai: false });

  useEffect(() => {
    if (!siap) return;
    let batal = false;
    panggilApi("detail", { id: `db1:${ID_MITRA + Number(nomor)}` }, { penuh })
      .then((d) => {
        if (batal) return;
        if (!d?.row) return setStatus("kosong");
        setJob(keJob(d.row));
        setStatus("siap");
      })
      .catch(() => !batal && setStatus("kosong"));
    return () => {
      batal = true;
    };
  }, [nomor, siap, penuh]);

  // Isi otomatis dari akun dan profil
  useEffect(() => {
    if (!user) return;
    setF((x) => ({
      ...x,
      nama: x.nama || profil?.fullName || user.user_metadata?.full_name || "",
      email: x.email || user.email || "",
      domisili: x.domisili || profil?.location || "",
    }));
  }, [user, profil?.fullName, profil?.location]);

  useEffect(() => {
    document.title = job ? t(`Lamar ${job.posisi} · Workly`, `Apply: ${job.posisi} · Workly`) : t("Kirim lamaran · Workly", "Apply · Workly");
  }, [job]);

  const ubah = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const pilihCv = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      e.target.value = "";
      return setKirim((k) => ({ ...k, galat: t("CV harus berformat PDF.", "Your CV must be a PDF.") }));
    }
    if (file.size > MAKS_CV) {
      e.target.value = "";
      return setKirim((k) => ({ ...k, galat: t("Ukuran CV maksimal 2 MB.", "Your CV must be 2 MB or smaller.") }));
    }
    setKirim((k) => ({ ...k, galat: "" }));
    setCv(file);
  };

  const masukDulu = () => {
    try {
      sessionStorage.setItem("jobly:tujuan", window.location.pathname);
    } catch {
      /* abaikan */
    }
    keHalaman("/login");
  };

  const kirimLamaran = async (e) => {
    e.preventDefault();
    if (f.nama.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      return setKirim((k) => ({ ...k, galat: t("Isi nama dan email dengan benar.", "Enter a valid name and email.") }));
    if (!f.telepon.trim()) return setKirim((k) => ({ ...k, galat: t("Nomor telepon / WhatsApp wajib diisi.", "A phone / WhatsApp number is required.") }));
    if (!cv) return setKirim((k) => ({ ...k, galat: t("Unggah CV dalam format PDF.", "Upload your CV as a PDF.") }));
    setKirim({ sibuk: true, galat: "", selesai: false });
    try {
      const path = `${user.id}/${nomor}-${Date.now()}.pdf`;
      const { error: galatUnggah } = await supabase.storage.from("cv-pelamar").upload(path, cv, { contentType: "application/pdf" });
      if (galatUnggah) throw new Error(t("CV gagal diunggah: ", "CV upload failed: ") + galatUnggah.message);
      const { data, error } = await supabase.functions.invoke("kirim-lamaran", {
        body: { loker_id: Number(nomor), ...f, cv_path: path },
      });
      if (error) {
        let pesan = error.message;
        try {
          const b = await error.context?.json?.();
          if (b?.error) pesan = b.error;
        } catch {
          /* pesan bawaan */
        }
        throw new Error(pesan);
      }
      if (data?.error) throw new Error(data.error);
      setKirim({ sibuk: false, galat: "", selesai: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setKirim({ sibuk: false, galat: err.message, selesai: false });
    }
  };

  const logo = job ? logoPerusahaan(job) : null;

  let isi;
  if (status === "memuat") {
    isi = (
      <div className="pk-panel pk-tengah">
        <Loader2 size={18} className="pk-putar" /> {t("Memuat lowongan...", "Loading job...")}
      </div>
    );
  } else if (status === "kosong" || !job) {
    isi = (
      <div className="pk-panel" style={{ display: "grid", gap: 10 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>{t("Lowongan tidak ditemukan", "Job not found")}</h1>
        <p className="pk-redup" style={{ margin: 0 }}>
          {t("Lowongan ini mungkin sudah ditutup atau masa tayangnya habis.", "This job may have closed or expired.")}
        </p>
        <a className="pb-btn pb-btn-primary" style={{ justifySelf: "start" }} {...tautan("/loker")}>
          {t("Cari loker lain", "Browse other jobs")}
        </a>
      </div>
    );
  } else if (kirim.selesai) {
    isi = (
      <div className="pk-panel" style={{ display: "grid", gap: 12, justifyItems: "start" }}>
        <CheckCircle2 size={34} color="#16a34a" />
        <h1 style={{ margin: 0, fontSize: 22 }}>{t("Lamaranmu sudah terkirim", "Your application has been sent")}</h1>
        <p className="pk-redup" style={{ margin: 0, lineHeight: 1.6 }}>
          {t(
            `Lamaran untuk ${job.posisi} di ${job.perusahaan} sudah diteruskan ke perusahaan. Salinan konfirmasi dikirim ke ${f.email}. Perusahaan akan menghubungimu langsung bila lamaranmu sesuai.`,
            `Your application for ${job.posisi} at ${job.perusahaan} has been forwarded. A confirmation was sent to ${f.email}. The company will contact you directly if you're a good fit.`,
          )}
        </p>
        <a className="pb-btn pb-btn-primary" {...tautan("/loker")}>
          {t("Cari loker lain", "Browse more jobs")}
        </a>
      </div>
    );
  } else {
    isi = (
      <form className="pb-as-form pk-panel" onSubmit={kirimLamaran}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 22 }}>{t("Kirim lamaran", "Apply")}</h1>
          <p className="pk-redup" style={{ margin: 0 }}>
            {t("Lamaran dan CV-mu dikirim langsung ke perusahaan.", "Your application and CV go straight to the company.")}
          </p>
        </div>

        {!session ? (
          <div className="pk-catatan" style={{ display: "grid", gap: 10 }}>
            <span>{t("Masuk dulu dengan akun pencari kerja untuk mengirim lamaran. Kamu akan kembali ke halaman ini setelah masuk.", "Sign in with a job seeker account to apply. You'll come back here after signing in.")}</span>
            <button type="button" className="pb-btn pb-btn-primary" style={{ justifySelf: "start" }} onClick={masukDulu}>
              {t("Masuk untuk melamar", "Sign in to apply")}
            </button>
          </div>
        ) : peran === "perusahaan" ? (
          <p className="pk-galat">
            <AlertTriangle size={15} /> {t("Akun perusahaan tidak bisa mengirim lamaran. Masuk dengan akun pencari kerja.", "Company accounts can't apply. Sign in with a job seeker account.")}
          </p>
        ) : (
          <>
            <div className="pb-as-grid">
              <label>
                <span>{t("Nama lengkap *", "Full name *")}</span>
                <input value={f.nama} onChange={ubah("nama")} maxLength={120} autoComplete="name" />
              </label>
              <label>
                <span>Email *</span>
                <input type="email" value={f.email} onChange={ubah("email")} maxLength={160} autoComplete="email" />
              </label>
              <label>
                <span>{t("Nomor telepon / WhatsApp *", "Phone / WhatsApp *")}</span>
                <input value={f.telepon} onChange={ubah("telepon")} inputMode="tel" placeholder="08xx" autoComplete="tel" />
              </label>
              <label>
                <span>{t("Domisili", "City")}</span>
                <input value={f.domisili} onChange={ubah("domisili")} placeholder="Surabaya" />
              </label>
              <label className="lebar">
                <span>{t("LinkedIn atau portofolio", "LinkedIn or portfolio")}</span>
                <input value={f.tautan} onChange={ubah("tautan")} placeholder="https://linkedin.com/in/..." />
              </label>
              <label className="lebar">
                <span>{t("CV (PDF, maks. 2 MB) *", "CV (PDF, max 2 MB) *")}</span>
                <span className="pk-unggah">
                  <FileUp size={16} />
                  <span>{cv ? cv.name : t("Pilih file CV", "Choose CV file")}</span>
                  <input type="file" accept="application/pdf" onChange={pilihCv} />
                </span>
                <small>
                  {t("Belum punya CV PDF? Buat dulu di ", "No PDF CV yet? Make one with the ")}
                  <a {...tautan("/dashboard/cvbuilder")}>CV Builder Workly</a>.
                </small>
              </label>
              <label className="lebar">
                <span>{t("Pesan untuk perusahaan", "Message to the company")}</span>
                <textarea
                  rows={6}
                  value={f.pesan}
                  onChange={ubah("pesan")}
                  maxLength={3000}
                  placeholder={t("Ceritakan singkat kenapa kamu cocok untuk posisi ini.", "Briefly explain why you're a good fit for this role.")}
                />
              </label>
            </div>
            {kirim.galat && (
              <p className="pk-galat">
                <AlertTriangle size={15} /> {kirim.galat}
              </p>
            )}
            <div className="pk-tombol">
              <button className="pb-btn pb-btn-primary" disabled={kirim.sibuk}>
                {kirim.sibuk ? <Loader2 size={15} className="pk-putar" /> : <Send size={15} />} {t("Kirim lamaran", "Send application")}
              </button>
              <small className="pk-redup">{t("Workly tidak memungut biaya apa pun dari pelamar.", "Workly never charges applicants anything.")}</small>
            </div>
          </>
        )}
      </form>
    );
  }

  return (
    <PublicLayout aktif="/loker">
      <div className="pb-wrap pk-dasbor" style={{ maxWidth: 820 }}>
        {job && (
          <>
            <a className="pk-kembali" {...tautan(urlDetail(job))}>
              <ArrowLeft size={15} /> {t("Kembali ke detail lowongan", "Back to job details")}
            </a>
            <div className="pk-lamar-kepala">
              <div className="pk-logo kecil">{logo ? <img src={logo} alt="" /> : (job.perusahaan || "PT").slice(0, 2).toUpperCase()}</div>
              <div>
                <b>{job.posisi}</b>
                <span>
                  {job.perusahaan} · {job.lokasi}
                </span>
              </div>
            </div>
          </>
        )}
        {isi}
      </div>
    </PublicLayout>
  );
}
