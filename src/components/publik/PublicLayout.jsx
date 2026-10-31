import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Menu,
  BookOpen,
  X,
  ChevronDown,
  Search,
  Sparkles,
  Bookmark,
  Send,
  User,
  FilePlus2,
  Mail,
  Linkedin,
  FileSearch,
  Route,
  TrendingUp,
  Mic,
  MessageSquareQuote,
  Calculator,
  CreditCard,
  Settings,
  LogOut,
  Globe,
  Handshake,
  Briefcase,
  Landmark,
  LayoutGrid,
  ListChecks,
  Users,
  Gauge,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  CalendarCheck,
  Sun,
  Moon,
  Monitor,
  ArrowUp,
  ArrowRight,
  HelpCircle,
  Award,
} from "lucide-react";
import "../../styles/publik.css";
import { useAuth } from "../../context/AuthContext";
import { useUserProfile } from "../../context/UserProfileContext";
import { useLangganan } from "../../context/LanggananContext";
import { useJobs } from "../../context/JobsContext";
import { getInitials } from "../../utils/format";
import { tautan, keHalaman } from "../../utils/navigasi";
import { useTema } from "../../utils/tema";
import { SITUS, grupAktif } from "../../data/situs";
import { IkonSosial, TautanGrup } from "./Komunitas";
import { TandaJobly } from "../ui/TandaJobly";
import { lokal, t, bahasa, setBahasa, DAFTAR_BAHASA } from "../../i18n.js";

/* ------------------------------------------------------------------ */
/*  Struktur menu                                                      */
/* ------------------------------------------------------------------ */

const ke = (panel) => `/dashboard/${panel}`;

const I = {
  semua: { t: t("Semua loker", "All jobs"), d: t("Dari situs karier, LinkedIn, Indeed, dan lainnya", "From career sites, LinkedIn, Indeed, and more"), path: "/loker", Ikon: Search },
  remote: { t: t("Loker remote", "Remote jobs"), d: t("Kerja dari mana saja, digaji rupiah atau dolar", "Work from anywhere, paid in rupiah or dollars"), path: "/remote", Ikon: Globe },
  bumn: { t: t("Loker BUMN", "State-owned firms"), d: t("Pertamina, PLN, Telkom, bank BUMN, dan lainnya", "Pertamina, PLN, Telkom, state banks, and more"), path: "/bumn", Ikon: Landmark, baru: true },
  bidang: { t: t("Per bidang", "By field"), d: t("Data, marketing, teknik, keuangan, dan lainnya", "Data, marketing, engineering, finance, and more"), path: "/bidang", Ikon: LayoutGrid, baru: true },
  freelance: { t: t("Loker freelance", "Freelance jobs"), d: t("Kerja per proyek, atur waktumu sendiri", "Project-based work on your own schedule"), path: "/freelance", Ikon: Handshake, baru: true },
  magang: { t: t("Loker magang / internship", "Internships"), d: t("MagangHub Kemnaker dan program magang perusahaan", "MagangHub and company internship programmes"), path: "/magang", Ikon: GraduationCap, baru: true },
  cocok: { t: t("Cocok untukku", "Matched for me"), d: t("Loker yang paling sesuai dengan CV-mu", "Jobs that best fit your CV"), path: ke("jobfinder"), Ikon: Sparkles },
  simpan: { t: t("Tersimpan", "Saved"), d: t("Loker yang sudah kamu simpan", "Jobs you have saved"), path: ke("saved"), Ikon: Bookmark },
  lamaran: { t: t("Lamaran saya", "My applications"), d: t("Pantau status setiap lamaran", "Track the status of each application"), path: ke("applications"), Ikon: Send },
  rencana: { t: t("Rencana lamar", "Application plan"), d: t("Target mingguan dan streak harian", "Weekly targets and daily streaks"), path: ke("rencana"), Ikon: CalendarCheck, baru: true },
  peta: { t: t("Peta gaji", "Salary map"), d: t("Kisaran gaji per bidang dan kota", "Salary ranges by field and city"), path: "/peta-gaji", Ikon: BarChart3, baru: true },
  cek: { t: t("Cek loker palsu", "Fake job checker"), d: t("Cek dulu sebelum kamu kirim data diri", "Check before you send personal details"), path: "/cek-loker", Ikon: ShieldCheck, baru: true },
  panduan: { t: t("Panduan Remote Working", "Remote Working Guide"), d: t("Mulai jadi VA, CS, admin sosmed, dan lainnya", "Start as a VA, support agent, social media admin, and more"), path: "/panduan", Ikon: BookOpen, baru: true },
  kalkulator: { t: t("Kalkulator gaji", "Salary calculator"), d: t("Ubah gaji dolar ke rupiah", "Convert dollar pay to rupiah"), path: "/kalkulator-gaji", Ikon: Calculator },
  profil: { t: t("Profil karier", "Career profile"), d: t("Data diri, skill, dan pengalaman", "Personal details, skills, and experience"), path: ke("profile"), Ikon: User },
  cv: { t: "CV Builder", d: t("Buat CV yang rapi, unduh dalam PDF", "Build a clean CV, download as PDF"), path: ke("cvbuilder"), Ikon: FilePlus2 },
  coverletter: { t: "Cover Letter", d: t("Surat lamaran dengan pratinjau & PDF, analisis AI", "Cover letters with preview & PDF, AI analysis"), path: ke("coverletter"), Ikon: Mail, baru: true },
  linkedin: { t: "LinkedIn Builder", d: t("Buat profil LinkedIn yang lebih menarik", "Make your LinkedIn profile stand out"), path: ke("linkedinbuilder"), Ikon: Linkedin },
  portofolio: { t: t("Portofolio", "Portfolio"), d: t("2 proyek studi kasus, unduh PDF & Excel", "2 case-study projects, download PDF & Excel"), path: ke("portofolio"), Ikon: Briefcase, baru: true, pro: true },
  latihan: { t: t("Latihan interview", "Interview practice"), d: t("140+ pertanyaan, dari yang mudah sampai yang paling sulit", "140+ questions, from easy to the hardest"), path: ke("interview"), Ikon: MessageSquareQuote },
  review: { t: t("Review CV & LinkedIn", "CV & LinkedIn review"), d: t("Skor ATS, saran perbaikan, dan draft baru untuk CV atau profil LinkedIn", "ATS score, fixes, and a new draft for your CV or LinkedIn profile"), path: ke("overview"), Ikon: FileSearch, pro: true },
  pindah: { t: t("Pindah karier", "Career switch"), d: t("Skill apa yang perlu ditambah untuk bidang baru", "Skills you need for a new field"), path: ke("pindahkarier"), Ikon: Route, pro: true },
  sertifikasi: { t: t("Sertifikasi & pelatihan", "Certifications & training"), d: t("Per bidang dan jenjang karier, batch selalu diperbarui", "By field and career stage, batches kept up to date"), path: "/sertifikasi", Ikon: Award, baru: true },
  rekomendasi: { t: t("Rekomendasi karier", "Career suggestions"), d: t("Posisi yang cocok untuk kamu incar", "Roles worth aiming for"), path: ke("recommendations"), Ikon: TrendingUp },
  tes: { t: t("Tes persiapan kerja", "Job tests practice"), d: t("TPA, Kraepelin, CFIT, AKHLAK, DISC, EPPS, tes gambar", "Aptitude, Kraepelin, CFIT, DISC, EPPS, drawing tests"), path: ke("tes"), Ikon: ListChecks, max: true },
  fgd: { t: t("Simulasi FGD", "FGD simulation"), d: t("Diskusi kelompok 20 menit dengan peserta AI", "20-minute group discussion with AI participants"), path: ke("fgd"), Ikon: Users, max: true },
  rapor: { t: t("Rapor kesiapan kerja", "Job-readiness report"), d: t("Skor CV, interview, tes, sampai FGD", "CV, interview, tests, and FGD scores"), path: ke("rapor"), Ikon: Gauge, max: true },
  simulasi: { t: t("Simulasi interview", "Mock interview"), d: t("Latihan interview pakai suara", "Practice interviews by voice"), path: ke("simulasi"), Ikon: Mic, pro: true },
};

// Menu untuk pengguna yang sudah masuk — dikelompokkan per tujuan.
export const MENU_APLIKASI = [
  {
    label: t("Loker", "Jobs"),
    promo: "loker",
    kolom: [
      { judul: t("Cari", "Search"), items: [I.semua, I.bidang, I.remote, I.freelance, I.bumn, I.magang, I.cocok] },
      { judul: t("Punyaku", "Mine"), items: [I.simpan, I.lamaran, I.rencana] },
    ],
  },
  { label: t("Profil & CV", "Profile & CV"), kolom: [{ items: [I.profil, I.cv, I.coverletter, I.linkedin, I.portofolio] }] },
  {
    label: t("Persiapan", "Prepare"),
    kolom: [
      { judul: t("Gratis", "Free"), items: [I.latihan, I.rekomendasi, I.sertifikasi, I.panduan] },
      { judul: t("Dengan AI", "With AI"), items: [I.review, I.pindah, I.simulasi] },
      { judul: t("Khusus Max", "Max only"), items: [I.fgd, I.tes, I.rapor] },
    ],
  },
  { label: t("Riset", "Research"), kolom: [{ items: [I.peta, I.cek, I.kalkulator] }] },
];

// Menu untuk pengunjung — sama kayanya, tujuan yang butuh akun
// diarahkan ke halaman masuk lalu kembali ke tujuan semula.
export const MENU_PUBLIK = [
  {
    label: t("Loker", "Jobs"),
    promo: "loker",
    kolom: [
      { judul: t("Cari loker", "Find jobs"), items: [I.semua, I.bidang, I.remote, I.freelance, I.bumn, I.magang] },
      { judul: t("Riset sebelum melamar", "Research before applying"), items: [I.peta, I.cek, I.kalkulator] },
    ],
  },
  {
    label: "Tools",
    kolom: [
      { judul: t("Gratis", "Free"), items: [I.cv, I.coverletter, I.linkedin, I.latihan, I.sertifikasi, I.rencana] },
      { judul: t("Dengan AI", "With AI"), items: [I.review, I.pindah, I.simulasi] },
      { judul: t("Khusus Max", "Max only"), items: [I.fgd, I.tes, I.rapor] },
    ],
  },
  { label: t("Panduan Remote Working", "Remote Working Guide"), path: "/panduan", Ikon: BookOpen, sorot: true },
  { label: t("Peta gaji", "Salary map"), path: "/peta-gaji", Ikon: BarChart3 },
  { label: t("Harga", "Pricing"), path: "/#harga", Ikon: CreditCard },
  { label: "FAQ", path: "/faq", Ikon: HelpCircle },
];

const MENU_AKUN = [
  { t: t("Paket & langganan", "Plans & billing"), path: ke("paket"), Ikon: CreditCard },
  { t: t("Pengaturan", "Settings"), path: ke("settings"), Ikon: Settings },
];

const itemsDari = (m) => (m.kolom ? m.kolom.flatMap((k) => k.items) : []);

export { KOTA_POPULER } from "../../data/kota";

/* ------------------------------------------------------------------ */
/*  Bagian kecil                                                       */
/* ------------------------------------------------------------------ */

function TandaMerek() {
  return <TandaJobly ukuran={32} />;
}

/** Tutup menu saat klik di luar atau tekan Esc. */
function useTutupLuar(buka, setBuka) {
  const ref = useRef(null);
  useEffect(() => {
    if (!buka) return;
    const klik = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setBuka(false);
    };
    const esc = (e) => e.key === "Escape" && setBuka(false);
    document.addEventListener("mousedown", klik);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", klik);
      document.removeEventListener("keydown", esc);
    };
  }, [buka, setBuka]);
  return ref;
}

const cocok = (path, aktif) => {
  if (!aktif) return false;
  const p = path.split("?")[0].split("#")[0];
  if (p === "/") return aktif === "/";
  return aktif === p || aktif.startsWith(p + "/");
};

const angka = (n) => Number(n || 0).toLocaleString(lokal());

function ItemMenu({ item, aktif }) {
  const { t: judul, d, path, Ikon, pro, baru } = item;
  return (
    <a role="menuitem" className={cocok(path, aktif) ? "on" : ""} {...tautan(path)}>
      <span className="pb-dd-ic">
        <Ikon size={17} />
      </span>
      <span>
        <span className="pb-dd-t">
          {judul}
          {pro && <span className="pb-tag pro">Pro</span>}
          {item.max && <span className="pb-tag pro">Max</span>}
          {baru && <span className="pb-tag baru">{t("Baru", "New")}</span>}
        </span>
        <span className="pb-dd-d">{d}</span>
      </span>
    </a>
  );
}

/** Kartu kecil di sisi kanan menu Loker: angka hidup dari database. */
function PromoLoker() {
  const { total, loading } = useJobs();
  return (
    <a className="pb-dd-promo" {...tautan("/loker")}>
      <span className="k">{t("Hari ini di Jobly", "Today on Jobly")}</span>
      <b>{loading ? "…" : angka(total)}</b>
      <span className="s">{t("lowongan dari situs karier resmi, LinkedIn, Indeed, dan lainnya", "jobs from official career sites, LinkedIn, Indeed, and more")}</span>
      <span className="go">
        {t("Mulai cari", "Start searching")} <ArrowRight size={14} />
      </span>
    </a>
  );
}

function MenuTurun({ grup, aktif, kecuali = [] }) {
  const [buka, setBuka] = useState(false);
  const ref = useTutupLuar(buka, setBuka);
  const tunda = useRef(null);
  // Kalau halaman ini juga punya tautan sendiri di header, cukup tautan itu yang ditandai
  const on = !kecuali.some((p) => cocok(p, aktif)) && itemsDari(grup).some((i) => cocok(i.path, aktif));
  const lebar = grup.kolom.length > 1 || grup.promo;

  useEffect(() => setBuka(false), [aktif]);
  useEffect(() => () => clearTimeout(tunda.current), []);

  // Geser menu ke kiri bila melewati tepi kanan layar
  const menuRef = useRef(null);
  const [geser, setGeser] = useState(0);
  useLayoutEffect(() => {
    if (!buka) {
      setGeser(0);
      return;
    }
    const el = menuRef.current;
    if (!el) return;
    const kotak = el.getBoundingClientRect();
    const lebih = kotak.right - (window.innerWidth - 16);
    if (lebih > 0) setGeser(-Math.min(lebih, Math.max(0, kotak.left - 16)));
  }, [buka]);

  // Buka saat kursor diarahkan (perangkat dengan mouse), tutup dengan
  // jeda kecil supaya tidak tertutup saat kursor melintas ke menu.
  const hover = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
  const masuk = () => {
    if (!hover) return;
    clearTimeout(tunda.current);
    setBuka(true);
  };
  const keluar = () => {
    if (!hover) return;
    clearTimeout(tunda.current);
    tunda.current = setTimeout(() => setBuka(false), 140);
  };

  return (
    <div className="pb-dd" ref={ref} onMouseEnter={masuk} onMouseLeave={keluar}>
      <button
        type="button"
        className={on ? "on" : ""}
        aria-expanded={buka}
        aria-haspopup="true"
        onClick={() => setBuka((v) => !v)}
      >
        {grup.label} <ChevronDown size={14} />
      </button>
      {buka && (
        <div ref={menuRef} className={`pb-dd-menu ${lebar ? "lebar" : ""}`} role="menu" style={geser ? { transform: `translateX(${geser}px)` } : undefined}>
          <div className="pb-dd-cols">
            {grup.kolom.map((k, i) => (
              <div key={i} className="pb-dd-col">
                {k.judul && <div className="pb-dd-h">{k.judul}</div>}
                {k.items.map((item) => (
                  <ItemMenu key={item.path} item={item} aktif={aktif} />
                ))}
              </div>
            ))}
            {grup.promo === "loker" && <PromoLoker />}
          </div>
        </div>
      )}
    </div>
  );
}

/** Pilihan tema: terang, gelap, atau ikut perangkat. */
const OPSI_TEMA = [
  ["terang", t("Terang", "Light"), Sun],
  ["gelap", t("Gelap", "Dark"), Moon],
  ["sistem", t("Sistem", "System"), Monitor],
];

function TombolTema() {
  const [pilihan, efektif, setTema] = useTema();
  const [buka, setBuka] = useState(false);
  const ref = useTutupLuar(buka, setBuka);
  const IkonNow = efektif === "gelap" ? Moon : Sun;
  return (
    <div className="pb-dd pb-tema" ref={ref}>
      <button
        type="button"
        className="pb-icon-btn"
        aria-label={t("Ganti tema tampilan", "Change theme")}
        aria-expanded={buka}
        aria-haspopup="true"
        title={t("Tema tampilan", "Theme")}
        onClick={() => setBuka((v) => !v)}
      >
        <IkonNow size={17} />
      </button>
      {buka && (
        <div className="pb-dd-menu kanan pb-tema-menu" role="menu">
          {OPSI_TEMA.map(([id, label, Ikon]) => (
            <button
              key={id}
              type="button"
              role="menuitemradio"
              aria-checked={pilihan === id}
              className={`item ${pilihan === id ? "on" : ""}`}
              onClick={() => {
                setTema(id);
                setBuka(false);
              }}
            >
              <span className="pb-dd-ic">
                <Ikon size={16} />
              </span>
              <span className="pb-dd-t">
                {label}
                {id === "sistem" && <span className="pb-dd-d" style={{ margin: 0 }}>{t("ikut perangkat", "match device")}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Versi segmen untuk menu HP & halaman pengaturan. */
export function PilihTema({ kecil }) {
  const [pilihan, , setTema] = useTema();
  return (
    <div className={`pb-seg ${kecil ? "kecil" : ""}`} role="radiogroup" aria-label={t("Tema tampilan", "Theme")}>
      {OPSI_TEMA.map(([id, label, Ikon]) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={pilihan === id}
          className={pilihan === id ? "on" : ""}
          onClick={() => setTema(id)}
        >
          <Ikon size={14} /> {label}
        </button>
      ))}
    </div>
  );
}

/** Pilihan bahasa: tombol kecil "ID"/"EN" dengan menu turun (header). */
function TombolBahasa() {
  const [buka, setBuka] = useState(false);
  const ref = useTutupLuar(buka, setBuka);
  const kode = bahasa().toUpperCase();
  return (
    <div className="pb-dd pb-tema" ref={ref}>
      <button
        type="button"
        className="pb-icon-btn pb-bahasa-btn"
        aria-label={t("Ganti bahasa", "Change language")}
        aria-expanded={buka}
        aria-haspopup="true"
        title={t("Bahasa", "Language")}
        onClick={() => setBuka((v) => !v)}
      >
        <Globe size={15} />
        <span>{kode}</span>
      </button>
      {buka && (
        <div className="pb-dd-menu kanan pb-tema-menu" role="menu">
          {DAFTAR_BAHASA.map(([id, nama, singkat]) => (
            <button
              key={id}
              type="button"
              role="menuitemradio"
              aria-checked={bahasa() === id}
              className={`item ${bahasa() === id ? "on" : ""}`}
              onClick={() => setBahasa(id)}
            >
              <span className="pb-dd-ic pb-bahasa-kode">{singkat}</span>
              <span className="pb-dd-t">{nama}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Versi segmen untuk menu HP & footer. */
export function PilihBahasa({ kecil }) {
  return (
    <div className={`pb-seg ${kecil ? "kecil" : ""}`} role="radiogroup" aria-label={t("Bahasa", "Language")}>
      {DAFTAR_BAHASA.map(([id, nama]) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={bahasa() === id}
          className={bahasa() === id ? "on" : ""}
          onClick={() => setBahasa(id)}
        >
          {nama}
        </button>
      ))}
    </div>
  );
}

/**
 * Sisa kuota AI di header. Ketiga jenis kuota ditampilkan berdampingan
 * dengan ikonnya, dan bila diklik terbuka rincian: sisa dari total,
 * kegunaannya, tautan ke fiturnya, serta masa berlaku paket.
 */
export function ChipKuota({ l, aktif }) {
  const [buka, setBuka] = useState(false);
  const ref = useTutupLuar(buka, setBuka);
  useEffect(() => setBuka(false), [aktif]);

  const daftar = [
    { Ikon: FileSearch, singkat: "CV", label: t("Review CV & LinkedIn", "CV & LinkedIn review"), ket: t("Skor ATS, saran, dan draft baru", "ATS score, fixes, and a new draft"), sisa: l.sisaAnalisis ?? 0, total: l.kuotaAnalisis ?? 0, path: ke("overview") },
    { Ikon: Route, singkat: t("Karier", "Career"), label: t("Pindah Karier", "Career Switch"), ket: t("Rencana pindah ke bidang baru", "A plan for moving to a new field"), sisa: l.sisaPindah ?? 0, total: l.kuotaPindah ?? 0, path: ke("pindahkarier") },
    { Ikon: Mic, singkat: t("Simulasi", "Mock"), label: t("Simulasi Interview", "Mock Interview"), ket: t("Interview suara 10 menit dengan AI", "A 10-minute voice interview with AI"), sisa: l.sisaInterview ?? 0, total: l.kuotaInterview ?? 0, path: ke("simulasi") },
    { Ikon: Users, singkat: "FGD", label: t("Simulasi FGD", "FGD simulation"), ket: t("Diskusi kelompok 20 menit dengan AI", "A 20-minute group discussion with AI"), sisa: l.sisaFgd ?? 0, total: l.kuotaFgd ?? 0, path: ke("fgd") },
    { Ikon: ListChecks, singkat: t("Tes", "Tests"), label: t("Tes persiapan kerja", "Job tests"), ket: t("Setiap jenis tes bisa dikerjakan sekali", "Each test type can be taken once"), sisa: l.sisaTes ?? 0, total: l.kuotaTes ?? 0, path: ke("tes"), diMenuSaja: true },
  ];
  const berakhir = l?.berakhirAt
    ? new Date(l.berakhirAt).toLocaleDateString(lokal(), { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="pb-dd" ref={ref}>
      <button
        type="button"
        className="pb-quota"
        aria-expanded={buka}
        aria-haspopup="true"
        onClick={() => setBuka((v) => !v)}
        title={t("Lihat rincian sisa kuota AI", "See remaining AI credits")}
      >
        <span className="pb-quota-judul">{t("Sisa kuota", "Credits")}</span>
        {daftar.filter((x) => !x.diMenuSaja).map(({ Ikon, singkat, sisa, total }) => (
          <span key={singkat} className={`pb-quota-item ${total ? "" : "redup"}`}>
            <Ikon size={13} aria-hidden="true" />
            <b>{sisa}</b>
            <span className="pb-quota-label">{singkat}</span>
          </span>
        ))}
        <ChevronDown size={13} className={`pb-quota-panah ${buka ? "buka" : ""}`} aria-hidden="true" />
      </button>
      {buka && (
        <div className="pb-dd-menu kanan pb-kuota-menu" role="menu" style={{ top: "calc(100% + 10px)" }}>
          <div className="pb-kuota-head">
            <b>{t("Sisa kuota", "Remaining credits")}</b>
            {l.detailPaket?.nama && <span>{t(`Paket ${l.detailPaket.nama}`, `${l.detailPaket.nama} plan`)}</span>}
          </div>
          {daftar.map(({ Ikon, label, ket, sisa, total, path }) => (
            <a key={label} {...tautan(path)} className={`pb-kuota-baris ${total ? "" : "redup"}`}>
              <span className="pb-dd-ic">
                <Ikon size={16} />
              </span>
              <span className="pb-kuota-isi">
                <span className="atas">
                  <span>{label}</span>
                  <b>{total ? `${sisa} / ${total}` : t("Tidak termasuk", "Not included")}</b>
                </span>
                {total > 0 && (
                  <span className="bar">
                    <i style={{ width: `${Math.min(100, (sisa / total) * 100)}%` }} />
                  </span>
                )}
                <span className="ket">{ket}</span>
              </span>
            </a>
          ))}
          <div className="pb-kuota-kaki">
            <span>{berakhir ? t(`Berlaku sampai ${berakhir}`, `Active until ${berakhir}`) : t("Paket belum aktif", "No active plan")}</span>
            <a {...tautan(ke("paket"))}>{t("Kelola paket", "Manage plan")}</a>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuAkun({ aktif }) {
  const { user, signOut } = useAuth();
  const { fullName } = useUserProfile();
  const l = useLangganan();
  const [buka, setBuka] = useState(false);
  const ref = useTutupLuar(buka, setBuka);
  useEffect(() => setBuka(false), [aktif]);

  const nama = fullName || user?.email?.split("@")[0] || t("Akun", "Account");
  const adaKuota = l?.aktif || l?.punyaKuota;
  const berakhir = l?.berakhirAt
    ? new Date(l.berakhirAt).toLocaleDateString(lokal(), { day: "numeric", month: "short", year: "numeric" })
    : null;

  const keluar = async () => {
    setBuka(false);
    await signOut();
    keHalaman("/");
  };

  return (
    <div className="pb-dd" ref={ref}>
      <button
        type="button"
        className="pb-avatar"
        aria-label={t("Menu akun", "Account menu")}
        aria-expanded={buka}
        aria-haspopup="true"
        onClick={() => setBuka((v) => !v)}
      >
        {getInitials(fullName || user?.email)}
      </button>
      {buka && (
        <div className="pb-dd-menu kanan" role="menu" style={{ top: "calc(100% + 10px)" }}>
          <div className="pb-acct">
            <b>{nama}</b>
            <span>{user?.email}</span>
          </div>
          <div className="pb-acct-quota">
            {adaKuota ? (
              <>
                <div className="row">
                  <span>{t("Review CV & LinkedIn", "CV & LinkedIn review")}</span>
                  <b>{l.sisaAnalisis ?? 0}x</b>
                </div>
                <div className="row">
                  <span>{t("Pindah karier", "Career switch")}</span>
                  <b>{l.sisaPindah ?? 0}x</b>
                </div>
                <div className="row">
                  <span>{t("Simulasi interview", "Mock interview")}</span>
                  <b>{l.sisaInterview ?? 0}x</b>
                </div>
                {berakhir && (
                  <div className="exp">
                    {t(`Paket ${l.detailPaket?.nama || ""} berlaku sampai ${berakhir}`, `${l.detailPaket?.nama || ""} plan active until ${berakhir}`)}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>{t("Paket Free", "Free plan")}</div>
                <div className="exp" style={{ marginTop: 2 }}>
                  {t("Semua loker dan alat dasar sudah gratis. Mau latihan kerja dan fitur AI? Mulai Rp 9.000.", "Every job and the basic tools are free. Want hands-on practice and the AI features? From Rp 9,000.")}
                </div>
              </>
            )}
          </div>
          {MENU_AKUN.map(({ t: judul, path, Ikon }) => (
            <a key={path} role="menuitem" className={cocok(path, aktif) ? "on" : ""} {...tautan(path)}>
              <span className="pb-dd-ic">
                <Ikon size={17} />
              </span>
              <span className="pb-dd-t">{judul}</span>
            </a>
          ))}
          <div className="pb-dd-sep" />
          <button type="button" className="item" role="menuitem" onClick={keluar}>
            <span className="pb-dd-ic">
              <LogOut size={17} />
            </span>
            <span className="pb-dd-t">{t("Keluar", "Sign out")}</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

export function SiteHeader({ aktif }) {
  const { session } = useAuth();
  const l = useLangganan();
  const masuk = Boolean(session);
  const [buka, setBuka] = useState(false);
  // Saat menu HP terbuka, halaman di belakangnya tidak ikut tergulir
  useEffect(() => {
    if (!buka) return undefined;
    const lama = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = lama;
    };
  }, [buka]);
  const [gulir, setGulir] = useState(false);
  const menu = masuk ? MENU_APLIKASI : MENU_PUBLIK;

  useEffect(() => setBuka(false), [aktif]);
  useEffect(() => {
    const f = () => setGulir(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header className={`pb-header ${gulir ? "bergulir" : ""}`}>
      <div className="pb-wrap">
        <div className="pb-header-in">
          <a className="pb-brand" {...tautan("/")} aria-label={t("Jobly, ke beranda", "Jobly home")}>
            <TandaMerek />
            Jobly
          </a>

          <nav className="pb-nav" aria-label={t("Menu utama", "Main menu")}>
            {menu.map((m) =>
              m.kolom ? (
                <MenuTurun key={m.label} grup={m} aktif={aktif} kecuali={menu.filter((x) => x.path).map((x) => x.path)} />
              ) : (
                <a key={m.label} className={cocok(m.path, aktif) && !m.path.includes("#") ? "on" : ""} {...tautan(m.path)}>
                  {m.label}
                </a>
              ),
            )}
          </nav>

          <div className="pb-actions">
            <TombolBahasa />
            <TombolTema />
            {masuk ? (
              <>
                {(l?.aktif || l?.punyaKuota) && <ChipKuota l={l} aktif={aktif} />}
                <MenuAkun aktif={aktif} />
              </>
            ) : (
              <>
                <a className="pb-login" {...tautan("/login")}>
                  {t("Masuk", "Sign in")}
                </a>
                <a className="pb-btn pb-btn-primary pb-btn-sm" {...tautan("/register")}>
                  {t("Daftar gratis", "Sign up free")}
                </a>
              </>
            )}
            <button
              type="button"
              className="pb-burger"
              onClick={() => setBuka((v) => !v)}
              aria-label={buka ? t("Tutup menu", "Close menu") : t("Buka menu", "Open menu")}
              aria-expanded={buka}
            >
              {buka ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div className={`pb-mobile-menu ${buka ? "open" : ""}`}>
          {/* Tautan utama tampil paling atas sebagai tombol berikon, supaya
              tidak tenggelam di bawah daftar tools yang panjang. */}
          <div className="pb-mm-grid pb-mm-pintas">
            {(menu.some((m) => !m.kolom)
              ? menu.filter((m) => !m.kolom)
              : [{ label: I.panduan.t, path: I.panduan.path, Ikon: I.panduan.Ikon, sorot: true }]
            ).map(({ label, path, Ikon, sorot }) => (
              <a key={path} className={`pb-mm-item ${sorot ? "sorot" : ""}`} {...tautan(path)}>
                <Ikon size={16} />
                <span>{label}</span>
                {sorot && <ArrowRight size={15} className="pb-mm-panah" />}
              </a>
            ))}
          </div>
          {menu.map((m) =>
            !m.kolom ? null : (
              <React.Fragment key={m.label}>
                <div className="pb-mm-group">{m.label}</div>
                <div className="pb-mm-grid">
                  {itemsDari(m).map(({ t: judul, path, Ikon, pro, baru, max }) => (
                    <a key={path} className="pb-mm-item" {...tautan(path)}>
                      <Ikon size={16} />
                      <span>{judul}</span>
                      {pro && <span className="pb-tag pro">Pro</span>}
                      {max && <span className="pb-tag pro">Max</span>}
                      {baru && <span className="pb-tag baru">{t("Baru", "New")}</span>}
                    </a>
                  ))}
                </div>
              </React.Fragment>
            ),
          )}
          {masuk && (
            <>
              <div className="pb-mm-group">{t("Akun", "Account")}</div>
              {MENU_AKUN.map((i) => (
                <a key={i.path} {...tautan(i.path)}>
                  {i.t}
                </a>
              ))}
            </>
          )}
          <div className="pb-mm-group">{t("Tampilan", "Theme")}</div>
          <PilihTema kecil />
          <div className="pb-mm-group">{t("Bahasa", "Language")}</div>
          <PilihBahasa kecil />
          {!masuk && (
            <div className="pb-mobile-cta">
              <a className="pb-btn pb-btn-outline" {...tautan("/login")}>
                {t("Masuk", "Sign in")}
              </a>
              <a className="pb-btn pb-btn-primary" {...tautan("/register")}>
                {t("Daftar gratis", "Sign up free")}
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function IkonSosialFooter() {
  return (
    <div style={{ marginTop: 16 }}>
      <IkonSosial />
    </div>
  );
}

export function SiteFooter() {
  const tahun = new Date().getFullYear();

  const kolom = [
    {
      judul: t("Lowongan", "Jobs"),
      tautan: [
        [t("Semua loker", "All jobs"), "/loker"],
        [t("Loker remote", "Remote jobs"), "/remote"],
        [t("Loker freelance", "Freelance jobs"), "/freelance"],
        [t("Loker BUMN", "State-owned firms"), "/bumn"],
        [t("Loker per bidang", "Jobs by field"), "/bidang"],
        [t("Sertifikasi & pelatihan", "Certifications & training"), "/sertifikasi"],
        [t("Panduan Remote Working", "Remote Working Guide"), "/panduan"],
        [t("Magang / internship", "Internships"), "/magang"],
        ["Fresh graduate", "/loker?q=fresh%20graduate"],
        [t("Peta gaji", "Salary map"), "/peta-gaji"],
        [t("Cek loker palsu", "Fake job checker"), "/cek-loker"],
      ],
    },
    {
      judul: "Tools",
      tautan: [
        ["CV Builder", ke("cvbuilder")],
        ["Cover Letter", ke("coverletter")],
        ["LinkedIn Builder", ke("linkedinbuilder")],
        [t("Latihan interview", "Interview practice"), ke("interview")],
        [t("Rencana lamar", "Application plan"), ke("rencana")],
        [t("Review CV & LinkedIn dengan AI", "AI CV & LinkedIn review"), ke("overview")],
        [t("Kalkulator gaji USD", "USD salary calculator"), "/kalkulator-gaji"],
      ],
    },
    {
      judul: "Jobly",
      tautan: [
        [t("Harga", "Pricing"), "/#harga"],
        ["FAQ", "/faq"],
        [t("Syarat & ketentuan", "Terms of service"), "/syarat-ketentuan"],
        [t("Kebijakan privasi", "Privacy policy"), "/kebijakan-privasi"],
        ["Disclaimer", "/disclaimer"],
      ],
    },
  ];

  return (
    <footer className="pb-footer">
      <div className="pb-wrap">
        <div className="pb-foot-grid">
          <div>
            <a className="pb-brand" {...tautan("/")}>
              <TandaJobly ukuran={32} diam />
              Jobly
            </a>
            <p>
              {t(
                "In this economy, cari kerja itu semakin sulit. Jobly mengumpulkan lowongan dari situs karier resmi dan platform terpercaya setiap hari buat bantu kamu dapat pekerjaan.",
                "In this economy, finding a job keeps getting harder. Every day Jobly collects openings from official career sites and trusted job platforms to help you land your next job.",
              )}
            </p>
            <IkonSosialFooter />
            <TautanGrup />
            <div className="pb-foot-pilihan">
              <PilihTema kecil />
              <PilihBahasa kecil />
            </div>
          </div>
          {kolom.map((k) => (
            <div className="pb-foot-col" key={k.judul}>
              <h4>{k.judul}</h4>
              {k.tautan.map(([label, path]) => (
                <a key={label} {...tautan(path)}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="pb-foot-bottom">
          <span className="pb-hakcipta">
            {t(
              `© ${tahun} ${SITUS.nama}. Hak cipta dilindungi undang-undang.`,
              `© ${tahun} ${SITUS.nama}. All rights reserved.`,
            )}
            <br />
            {t(`Dibuat oleh ${SITUS.pembuat}`, `Made by ${SITUS.pembuat}`)}
          </span>
          <p>
            {t(
              "Jobly bukan agen penyalur kerja dan tidak terhubung dengan perusahaan yang lowongannya ditampilkan. Kamu selalu melamar langsung di situs aslinya, dan Jobly tidak memungut biaya apa pun.",
              "Jobly is not a recruitment agency and is not affiliated with the companies whose jobs are listed. You always apply directly on the original site, and Jobly never charges you anything.",
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Kerangka & util                                                    */
/* ------------------------------------------------------------------ */

/**
 * Animasi muncul saat digulir. Elemen bertanda data-muncul diberi kelas
 * "muncul" begitu masuk layar. Elemen yang ditambahkan belakangan (mis.
 * kartu loker setelah data dimuat) ikut terpantau lewat MutationObserver.
 */
export function useAnimasiMuncul(akarRef) {
  useEffect(() => {
    const akar = akarRef.current;
    if (!akar || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entri) =>
        entri.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("muncul");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    const pantau = () =>
      akar.querySelectorAll("[data-muncul]:not(.muncul)").forEach((el) => io.observe(el));
    pantau();
    const mo = new MutationObserver(pantau);
    mo.observe(akar, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [akarRef]);
}

function KeAtas() {
  const [tampil, setTampil] = useState(false);
  useEffect(() => {
    const f = () => setTampil(window.scrollY > 900);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <button
      type="button"
      className={`pb-keatas ${tampil ? "on" : ""}`}
      aria-label={t("Kembali ke atas", "Back to top")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp size={18} />
    </button>
  );
}

/** Kerangka halaman publik: header, isi, footer. */
export function PublicLayout({ aktif, children }) {
  const akar = useRef(null);
  useAnimasiMuncul(akar);
  return (
    <div className="pb" ref={akar}>
      <SiteHeader aktif={aktif} />
      <main className="pb-main">{children}</main>
      <SiteFooter />
      <KeAtas />
    </div>
  );
}

/** Notifikasi kecil di bawah layar, hilang sendiri. */
export function useToast() {
  const [pesan, setPesan] = useState("");
  useEffect(() => {
    if (!pesan) return;
    const tt = setTimeout(() => setPesan(""), 2400);
    return () => clearTimeout(tt);
  }, [pesan]);
  const elemen = pesan ? (
    <div className="pb-toast" role="status">
      {pesan}
    </div>
  ) : null;
  return [setPesan, elemen];
}

/** Gulir ke #anchor setelah halaman dirender (mis. "/#harga"). */
export function useGulirKeHash(siap = true) {
  useEffect(() => {
    if (!siap) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    const tt = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => clearTimeout(tt);
  }, [siap]);
}
