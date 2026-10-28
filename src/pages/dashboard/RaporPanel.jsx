import React, { useEffect, useMemo, useState } from "react";
import {
  FileText, Linkedin, Mic, Users, ListChecks, Briefcase, ArrowRight, Lock, Loader2, Sparkles, CircleDashed, CheckCircle2,
} from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useLangganan } from "../../context/LanggananContext";
import { JENIS_TES } from "../../data/tesKerja";

// Tes yang punya skor benar/salah (tes profil & latihan gambar tidak dihitung)
const TES_DINILAI = new Set(JENIS_TES.filter((x) => !x.profil && !x.latihan).map((x) => x.id));
import { t, lokal } from "../../i18n.js";

/**
 * Rapor kesiapan kerja (paket Max): satu halaman yang merangkum hasil
 * Review CV & LinkedIn, simulasi interview, tes persiapan, FGD, dan
 * portofolio, lalu menunjukkan langkah berikutnya yang paling berdampak.
 */

const BOBOT = { cv: 25, interview: 25, fgd: 20, tes: 20, linkedin: 10 };

const tanggal = (iso) => (iso ? new Date(iso).toLocaleDateString(lokal(), { day: "numeric", month: "short", year: "numeric" }) : "");

function warna(skor) {
  if (skor == null) return "var(--muted)";
  if (skor >= 75) return "var(--ok)";
  if (skor >= 55) return "#B45309";
  return "var(--danger)";
}

function label(skor) {
  if (skor >= 80) return t("Siap bersaing", "Ready to compete");
  if (skor >= 65) return t("Hampir siap", "Almost ready");
  if (skor >= 50) return t("Perlu diasah", "Needs sharpening");
  return t("Masih banyak PR", "Plenty to work on");
}

function Cincin({ nilai }) {
  const r = 52;
  const k = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 130 130" className="rp-cincin" role="img" aria-label={`${nilai}`}>
      <circle cx="65" cy="65" r={r} className="latar" />
      <circle cx="65" cy="65" r={r} className="isi" style={{ stroke: warna(nilai), strokeDasharray: `${(k * (nilai || 0)) / 100} ${k}` }} />
      <text x="65" y="72" textAnchor="middle">{nilai ?? "–"}</text>
    </svg>
  );
}

export function RaporPanel({ setActive }) {
  const { user } = useAuth();
  const langganan = useLangganan();
  const max = langganan.aktif && langganan.paket === "serius";
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user || !supabaseConfigured) {
      setData({});
      return;
    }
    const ambil = (q) => q.then((r) => r.data || []).catch(() => []);
    Promise.all([
      ambil(supabase.from("analysis_results").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(15)),
      ambil(supabase.from("interview_sessions").select("skor, posisi, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10)),
      ambil(supabase.from("tes_sesi").select("jenis, skor, status, selesai_at").eq("status", "selesai")),
      ambil(supabase.from("fgd_sesi").select("skor, status, topik, mulai_at, hasil").eq("status", "selesai").order("mulai_at", { ascending: false }).limit(5)),
      ambil(supabase.from("portofolio_proyek").select("jawaban, dikirim, revisi, cek")),
      ambil(supabase.from("applications").select("id").eq("user_id", user.id)),
    ]).then(([analisis, interview, tes, fgd, porto, lamaran]) => setData({ analisis, interview, tes, fgd, porto, lamaran }));
  }, [user]);

  const r = useMemo(() => {
    if (!data?.analisis) return null;
    const cvTerakhir = data.analisis.find((a) => typeof a?.cv_audit?.skor_ats === "number");
    const liTerakhir = data.analisis.find((a) => typeof a?.linkedin_audit?.skor === "number");
    const iv = data.interview.find((x) => typeof x.skor === "number");
    const fgd = data.fgd.find((x) => typeof x.skor === "number");
    const tesKognitif = data.tes.filter((x) => TES_DINILAI.has(x.jenis) && typeof x.skor === "number");
    const tesSkor = tesKognitif.length ? Math.round(tesKognitif.reduce((a, x) => a + x.skor, 0) / tesKognitif.length) : null;
    const portoSelesai = data.porto.filter((p) => p.dikirim && (p.jawaban || "").length >= 40).length;

    const komponen = {
      cv: cvTerakhir ? cvTerakhir.cv_audit.skor_ats : null,
      linkedin: liTerakhir ? liTerakhir.linkedin_audit.skor : null,
      interview: iv ? iv.skor : null,
      fgd: fgd ? fgd.skor : null,
      tes: tesSkor,
    };
    let total = 0;
    let bobot = 0;
    Object.entries(BOBOT).forEach(([k, b]) => {
      if (komponen[k] != null) {
        total += komponen[k] * b;
        bobot += b;
      }
    });
    const indeks = bobot ? Math.round(total / bobot) : null;
    const kelengkapan = Math.round((bobot / 100) * 100);

    // Langkah berikutnya: komponen kosong lebih dulu, lalu yang terlemah
    const meta = {
      cv: { nama: t("Review CV", "CV review"), panel: "overview", saran: t("Jalankan Review CV untuk mendapat skor ATS dan draft perbaikan.", "Run a CV review to get an ATS score and a revised draft."), lemah: t("Skor ATS CV-mu masih rendah. Terapkan draft perbaikannya di CV Builder, lalu review ulang.", "Your CV's ATS score is low. Apply the revised draft in CV Builder, then review again.") },
      linkedin: { nama: "LinkedIn", panel: "linkedinbuilder", saran: t("Rapikan profil LinkedIn lalu minta review.", "Polish your LinkedIn profile, then request a review."), lemah: t("Profil LinkedIn-mu perlu diperkuat: headline, About, dan pengalaman.", "Strengthen your LinkedIn profile: headline, About, and experience.") },
      interview: { nama: t("Simulasi interview", "Mock interview"), panel: "simulasi", saran: t("Coba simulasi interview bersuara untuk mengukur kesiapanmu menjawab.", "Try a voice mock interview to see how ready your answers are."), lemah: t("Latih jawaban dengan pola STAR di Latihan interview, lalu simulasi ulang.", "Practise STAR-style answers in Interview practice, then simulate again.") },
      fgd: { nama: "FGD", panel: "fgd", saran: t("Ikuti simulasi FGD untuk melatih diskusi kelompok.", "Join the FGD simulation to practise group discussion."), lemah: t("Di FGD berikutnya, buka diskusi lebih awal dan rangkum kesepakatan di akhir.", "In your next FGD, open earlier and summarise the agreement at the end.") },
      tes: { nama: t("Tes persiapan", "Job tests"), panel: "tes", saran: t("Kerjakan tes persiapan kerja: Kraepelin, TPA, penalaran, dan ketelitian.", "Take the job tests: Kraepelin, aptitude, reasoning, and accuracy."), lemah: t("Skor tes kognitifmu masih bisa naik. Latih deret angka dan soal penalaran setiap hari.", "Your aptitude scores can improve. Practise number series and reasoning daily.") },
    };
    const langkah = [
      ...Object.keys(BOBOT).filter((k) => komponen[k] == null).map((k) => ({ ...meta[k], kunci: k, jenis: "kosong" })),
      ...Object.keys(BOBOT)
        .filter((k) => komponen[k] != null && komponen[k] < 70)
        .sort((a, b) => komponen[a] - komponen[b])
        .map((k) => ({ ...meta[k], kunci: k, jenis: "lemah" })),
    ].slice(0, 3);

    return { komponen, indeks, kelengkapan, cvTerakhir, liTerakhir, iv, fgd, tesKognitif, portoSelesai, langkah, lamaran: data.lamaran.length, tes: data.tes };
  }, [data]);

  if (!data || langganan.loading) {
    return (
      <div className="pb-po-muat">
        <Loader2 size={18} className="pb-po-putar" /> {t("Menyusun rapor…", "Building your report…")}
      </div>
    );
  }

  if (!max) {
    return (
      <div className="pb-panel pb-po-kunci">
        <span className="pb-po-kunci-ikon">
          <Lock size={20} />
        </span>
        <h2>{t("Rapor kesiapan kerja khusus paket Max", "The job-readiness report is for Max")}</h2>
        <p>
          {t(
            "Satu halaman yang merangkum skor CV, LinkedIn, simulasi interview, tes persiapan kerja, dan FGD menjadi satu indeks kesiapan, lengkap dengan tiga langkah berikutnya yang paling berdampak.",
            "One page that combines your CV, LinkedIn, mock interview, job tests, and FGD scores into a single readiness index, with the three most impactful next steps.",
          )}
        </p>
        <button type="button" className="pb-btn pb-btn-primary" onClick={() => setActive?.("paket")}>
          {t("Lihat paket Max", "See Max")} <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  const K = r.komponen;
  const baris = [
    { k: "cv", Ikon: FileText, nama: t("CV (skor ATS)", "CV (ATS score)"), nilai: K.cv, ket: r.cvTerakhir ? tanggal(r.cvTerakhir.created_at) : t("Belum direview", "Not reviewed yet"), panel: "overview" },
    { k: "linkedin", Ikon: Linkedin, nama: "LinkedIn", nilai: K.linkedin, ket: r.liTerakhir ? tanggal(r.liTerakhir.created_at) : t("Belum direview", "Not reviewed yet"), panel: "linkedinbuilder" },
    { k: "interview", Ikon: Mic, nama: t("Simulasi interview", "Mock interview"), nilai: K.interview, ket: r.iv ? `${r.iv.posisi || ""} · ${tanggal(r.iv.created_at)}` : t("Belum dicoba", "Not tried yet"), panel: "simulasi" },
    { k: "tes", Ikon: ListChecks, nama: t("Tes persiapan (rata-rata)", "Job tests (average)"), nilai: K.tes, ket: t(`${r.tesKognitif.length} dari ${TES_DINILAI.size} tes kemampuan`, `${r.tesKognitif.length} of ${TES_DINILAI.size} aptitude tests`), panel: "tes" },
    { k: "fgd", Ikon: Users, nama: "FGD", nilai: K.fgd, ket: r.fgd ? tanggal(r.fgd.mulai_at) : t("Belum dicoba", "Not tried yet"), panel: "fgd" },
  ];

  return (
    <div className="rp">
      <div className="pb-panel rp-atas">
        <Cincin nilai={r.indeks} />
        <div>
          <span className="pb-label">{t("Indeks kesiapan kerja", "Job-readiness index")}</span>
          <h2>{r.indeks == null ? t("Belum ada data", "No data yet") : label(r.indeks)}</h2>
          <p>
            {r.indeks == null
              ? t("Mulai dari Review CV atau simulasi interview. Rapor terisi otomatis setiap kali kamu menyelesaikan sesuatu.", "Start with a CV review or a mock interview. The report fills in automatically as you complete things.")
              : t(
                  `Dihitung dari komponen yang sudah kamu kerjakan (${r.kelengkapan}% lengkap). Bobot: CV 25%, interview 25%, FGD 20%, tes 20%, LinkedIn 10%.`,
                  `Based on what you've completed so far (${r.kelengkapan}% complete). Weights: CV 25%, interview 25%, FGD 20%, tests 20%, LinkedIn 10%.`,
                )}
          </p>
          <div className="rp-lengkap">
            <i style={{ width: `${r.kelengkapan}%` }} />
          </div>
        </div>
      </div>

      <div className="rp-grid">
        {baris.map(({ k, Ikon, nama, nilai, ket, panel }) => (
          <button key={k} type="button" className="rp-kartu" onClick={() => setActive?.(panel)}>
            <span className="ikon">
              <Ikon size={17} />
            </span>
            <span className="isi">
              <b>{nama}</b>
              <small>{ket}</small>
            </span>
            <span className="nilai" style={{ color: warna(nilai) }}>
              {nilai ?? <CircleDashed size={18} />}
            </span>
          </button>
        ))}
        <button type="button" className="rp-kartu" onClick={() => setActive?.("portofolio")}>
          <span className="ikon">
            <Briefcase size={17} />
          </span>
          <span className="isi">
            <b>{t("Portofolio", "Portfolio")}</b>
            <small>{t(`${r.portoSelesai} dari 2 proyek dikirim`, `${r.portoSelesai} of 2 projects sent`)}</small>
          </span>
          <span className="nilai">{r.portoSelesai >= 2 ? <CheckCircle2 size={18} color="var(--ok)" /> : `${r.portoSelesai}/2`}</span>
        </button>
      </div>

      {r.tes.length > 0 && (
        <div className="pb-panel">
          <h3 className="pb-po-sub" style={{ marginTop: 0 }}>{t("Rincian tes persiapan", "Job test breakdown")}</h3>
          <div className="pb-tk-batang">
            {JENIS_TES.filter((x) => TES_DINILAI.has(x.id)).map((x) => {
              const s = r.tes.find((y) => y.jenis === x.id);
              return (
                <div key={x.id}>
                  <span>{x.nama}</span>
                  <i>
                    <em style={{ width: `${s?.skor ?? 0}%`, background: s ? undefined : "transparent" }} />
                  </i>
                  <b>{s?.skor ?? "–"}</b>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {r.fgd?.hasil?.aspek && (
        <div className="pb-panel">
          <h3 className="pb-po-sub" style={{ marginTop: 0 }}>{t("Profil diskusi kelompok (FGD terakhir)", "Group discussion profile (latest FGD)")}</h3>
          <div className="pb-tk-batang">
            {Object.entries(r.fgd.hasil.aspek).map(([k, v]) => (
              <div key={k}>
                <span style={{ textTransform: "capitalize" }}>{k.replace(/_/g, " ")}</span>
                <i>
                  <em style={{ width: `${v}%` }} />
                </i>
                <b>{v}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {r.langkah.length > 0 && (
        <div className="pb-panel rp-langkah">
          <h3 className="pb-po-sub" style={{ marginTop: 0 }}>
            <Sparkles size={16} /> {t("Tiga langkah berikutnya", "Your next three steps")}
          </h3>
          <ol>
            {r.langkah.map((l) => (
              <li key={l.kunci}>
                <div>
                  <b>{l.nama}</b>
                  <span>{l.jenis === "kosong" ? l.saran : l.lemah}</span>
                </div>
                <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={() => setActive?.(l.panel)}>
                  {t("Buka", "Open")} <ArrowRight size={13} />
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="pb-tk-ket">
        {t(`Lamaran tercatat: ${r.lamaran}. Rapor ini alat bantu latihan, bukan jaminan hasil seleksi.`, `Applications logged: ${r.lamaran}. This report is a practice aid, not a guarantee of selection results.`)}
      </p>
    </div>
  );
}
