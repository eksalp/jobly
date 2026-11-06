import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Laptop, GraduationCap, BookOpenCheck, FileText, ListChecks } from "lucide-react";
import { tautan } from "../../utils/navigasi";
import { t, lokal } from "../../i18n.js";

/**
 * Slider banner di beranda. Bisa digeser (sentuh/trackpad), memakai tombol,
 * atau titik. Berganti otomatis setiap 6 detik, berhenti saat disorot kursor
 * atau saat pengguna memilih mengurangi animasi.
 */
export function SliderBanner({ jumlahFreelance = 0 }) {
  const angka = (n) => Number(n || 0).toLocaleString(lokal());
  const SLIDE = [
    {
      id: "freelance",
      gaya: "hijau",
      Ikon: Laptop,
      label: t("Freelance & kerja sampingan", "Freelance & side gigs"),
      judul: t("Cuan tambahan, dikerjakan dari rumah", "Extra income, done from home"),
      teks: jumlahFreelance
        ? t(`${angka(jumlahFreelance)} proyek lepas, tugas online, dan kerja sampingan pilihan. Atur waktumu sendiri.`, `${angka(jumlahFreelance)} freelance projects, online tasks, and side gigs. Set your own hours.`)
        : t("Proyek lepas, tugas online, dan kerja sampingan pilihan. Atur waktumu sendiri.", "Freelance projects, online tasks, and side gigs. Set your own hours."),
      aksi: t("Lihat freelance", "See freelance"),
      path: "/freelance",
    },
    {
      id: "magang",
      gaya: "biru",
      Ikon: GraduationCap,
      label: t("Magang / internship", "Internships"),
      judul: t("Mulai dari magang, termasuk MagangHub Kemnaker", "Start with an internship, including MagangHub"),
      teks: t("Program magang resmi pemerintah dan internship dari perusahaan, startup, dan BUMN.", "Government internship programmes plus internships at companies, startups, and state-owned firms."),
      aksi: t("Cari magang", "Find internships"),
      path: "/magang",
    },
    {
      id: "kelas",
      gaya: "ungu",
      Ikon: BookOpenCheck,
      label: t("Kelas Dasar gratis", "Free starter courses"),
      judul: t("Baru mau kerja remote? Kupas dari nol", "New to remote work? Learn from zero"),
      teks: t("Copywriting, virtual assistant, admin media sosial, dan 7 profesi lain: istilah, contoh, latihan, dan kuis.", "Copywriting, virtual assistant, social media admin, and 7 more: terms, examples, exercises, and quizzes."),
      aksi: t("Mulai belajar", "Start learning"),
      path: "/panduan",
    },
    {
      id: "dokumen",
      gaya: "jingga",
      Ikon: FileText,
      label: t("CV & cover letter", "CV & cover letter"),
      judul: t("CV ramah ATS dan cover letter dalam 10 menit", "An ATS-friendly CV and cover letter in 10 minutes"),
      teks: t("Gratis, lengkap dengan pratinjau dan unduh PDF. Analisis AI tersedia mulai paket Starter.", "Free, with live preview and PDF download. AI analysis from the Starter plan."),
      aksi: t("Buat CV", "Build a CV"),
      path: "/dashboard/cvbuilder",
    },
    {
      id: "tes",
      gaya: "gelap",
      Ikon: ListChecks,
      label: t("Psikotes & simulasi BUMN", "Aptitude tests & BUMN simulation"),
      judul: t("Latihan psikotes sebelum hari H", "Practise aptitude tests before the real one"),
      teks: t("Simulasi Tes Online RBB BUMN, TPA, Kraepelin, DISC, tes kebanksentralan, dan lainnya.", "BUMN online test simulation, aptitude, Kraepelin, DISC, central-banking test, and more."),
      aksi: t("Coba latihan", "Start practising"),
      path: "/dashboard/tes",
    },
  ];

  const rel = useRef(null);
  const [aktif, setAktif] = useState(0);
  const [jeda, setJeda] = useState(false);

  const ke = useCallback((i) => {
    const el = rel.current;
    if (!el) return;
    const n = el.children.length;
    const tujuan = ((i % n) + n) % n;
    el.scrollTo({ left: el.children[tujuan].offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  // Slide aktif mengikuti posisi gulir (termasuk saat digeser dengan jari)
  useEffect(() => {
    const el = rel.current;
    if (!el) return undefined;
    const saatGulir = () => {
      const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
      setAktif(Math.min(el.children.length - 1, Math.max(0, i)));
    };
    el.addEventListener("scroll", saatGulir, { passive: true });
    return () => el.removeEventListener("scroll", saatGulir);
  }, []);

  useEffect(() => {
    let kurangiGerak = false;
    try {
      kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      /* abaikan */
    }
    if (jeda || kurangiGerak) return undefined;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") ke(aktif + 1);
    }, 6000);
    return () => clearInterval(id);
  }, [aktif, jeda, ke]);

  return (
    <section
      className="pb-slider"
      aria-roledescription="carousel"
      aria-label={t("Sorotan Jobly", "Jobly highlights")}
      onMouseEnter={() => setJeda(true)}
      onMouseLeave={() => setJeda(false)}
      onFocus={() => setJeda(true)}
      onBlur={() => setJeda(false)}
    >
      <div className="pb-slider-trek" ref={rel}>
        {SLIDE.map((s, i) => (
          <a
            key={s.id}
            className={`pb-slide ${s.gaya}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${SLIDE.length}: ${s.judul}`}
            {...tautan(s.path)}
          >
            <span className="pb-slide-isi">
              <span className="pb-slide-label">{s.label}</span>
              <b>{s.judul}</b>
              <span className="pb-slide-teks">{s.teks}</span>
              <span className="pb-slide-aksi">
                {s.aksi} <ArrowRight size={15} />
              </span>
            </span>
            <span className="pb-slide-ikon" aria-hidden="true">
              <s.Ikon size={64} strokeWidth={1.4} />
            </span>
          </a>
        ))}
      </div>
      <div className="pb-slider-kendali">
        <button type="button" onClick={() => ke(aktif - 1)} aria-label={t("Sebelumnya", "Previous")}>
          <ChevronLeft size={18} />
        </button>
        <div className="pb-slider-titik" role="tablist">
          {SLIDE.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === aktif}
              aria-label={s.label}
              className={i === aktif ? "aktif" : ""}
              onClick={() => ke(i)}
            />
          ))}
        </div>
        <button type="button" onClick={() => ke(aktif + 1)} aria-label={t("Berikutnya", "Next")}>
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
