import React, { useEffect, useRef, useState } from "react";
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
  GraduationCap,
  ShieldCheck,
  BarChart3,
  CalendarCheck,
  Sun,
  Moon,
  Monitor,
  ArrowUp,
  ArrowRight,
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
  magang: { t: t("Magang & fresh graduate", "Internships & fresh graduates"), d: t("Cocok buat yang baru mulai kerja", "For people starting their first job"), path: "/loker?tipe=magang", Ikon: GraduationCap },
  cocok: { t: t("Cocok untukku", "Matched for me"), d: t("Loker yang paling sesuai dengan CV-mu", "Jobs that best fit your CV"), path: ke("jobfinder"), Ikon: Sparkles },
  simpan: { t: t("Tersimpan", "Saved"), d: t("Loker yang sudah kamu simpan", "Jobs you have saved"), path: ke("saved"), Ikon: Bookmark },
  lamaran: { t: t("Lamaran saya", "My applications"), d: t("Pantau status setiap lamaran", "Track the status of each application"), path: ke("applications"), Ikon: Send },
  rencana: { t: t("Rencana lamar", "Application plan"), d: t("Target mingguan dan streak harian", "Weekly targets and daily streaks"), path: ke("rencana"), Ikon: CalendarCheck, baru: true },
  peta: { t: t("Peta gaji", "Salary map"), d: t("Kisaran gaji per bidang dan kota", "Salary ranges by field and city"), path: "/peta-gaji", Ikon: BarChart3, baru: true },
  cek: { t: t("Cek loker palsu", "Fake job checker"), d: t("Cek dulu sebelum kamu kirim data diri", "Check before you send personal details"), path: "/cek-loker", Ikon: ShieldCheck, baru: true },
  panduan: { t: t("Panduan Remote Working", "Remote Working Guide"), d: t("Mulai jadi VA, CS, admin sosmed, dan lainnya", "Start as a VA, support agent, social media admin, and more"), path: "/panduan", Ikon: BookOpen, baru: true },
  kalkulator: { t: t("Kalkulator gaji", "Salary calculator"), d: t("Ubah gaji dolar ke rupiah", "Convert dollar pay to rupiah"), path: "/kalkulator-gaji", Ikon: Calculator },
  profil: { t: t("Profil karier", "Career profile"), d: t("Data diri, skill, dan pengalaman", "Personal details, skills, and experience"), path: ke("profile"), Ikon: User },
  cv: { t: "CV Builder", d: t("Bikin CV rapi, unduh dalam PDF", "Build a clean CV, download as PDF"), path: ke("cvbuilder"), Ikon: FilePlus2 },
  linkedin: { t: "LinkedIn Builder", d: t("Bikin profil LinkedIn lebih menarik", "Make your LinkedIn profile stand out"), path: ke("linkedinbuilder"), Ikon: Linkedin },
  latihan: { t: t("Latihan interview", "Interview practice"), d: t("140+ pertanyaan, dari yang mudah sampai yang paling sulit", "140+ questions, from easy to the hardest"), path: ke("interview"), Ikon: MessageSquareQuote },
  review: { t: t("Review CV", "CV review"), d: t("Skor ATS dan saran perbaikan CV", "ATS score and CV improvement tips"), path: ke("overview"), Ikon: FileSearch, pro: true },
  pindah: { t: t("Pindah karier", "Career switch"), d: t("Skill apa yang perlu ditambah untuk bidang baru", "Skills you need for a new field"), path: ke("pindahkarier"), Ikon: Route, pro: true },
  rekomendasi: { t: t("Rekomendasi karier", "Career suggestions"), d: t("Posisi yang cocok untuk kamu incar", "Roles worth aiming for"), path: ke("recommendations"), Ikon: TrendingUp },
  simulasi: { t: t("Simulasi interview", "Mock interview"), d: t("Latihan interview pakai suara", "Practice interviews by voice"), path: ke("simulasi"), Ikon: Mic, pro: true },
};

// Menu untuk pengguna yang sudah masuk — dikelompokkan per tujuan.
export const MENU_APLIKASI = [
  {
    label: t("Loker", "Jobs"),
    promo: "loker",
    kolom: [
      { judul: t("Cari", "Search"), items: [I.semua, I.remote, I.cocok] },
      { judul: t("Punyaku", "Mine"), items: [I.simpan, I.lamaran, I.rencana] },
    ],
  },
  { label: t("Profil & CV", "Profile & CV"), kolom: [{ items: [I.profil, I.cv, I.linkedin] }] },
  {
    label: t("Persiapan", "Prepare"),
    kolom: [
      { judul: t("Gratis", "Free"), items: [I.latihan, I.rekomendasi, I.panduan] },
      { judul: t("Dengan AI", "With AI"), items: [I.review, I.pindah, I.simulasi] },
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
      { judul: t("Cari loker", "Find jobs"), items: [I.semua, I.remote, I.magang] },
      { judul: t("Riset sebelum melamar", "Research before applying"), items: [I.peta, I.cek, I.kalkulator] },
    ],
  },
  {
    label: "Tools",
    kolom: [
      { judul: t("Gratis", "Free"), items: [I.cv, I.linkedin, I.latihan, I.rencana] },
      { judul: t("Dengan AI", "With AI"), items: [I.review, I.pindah, I.simulasi] },
    ],
  },
  { label: t("Panduan Remote Working", "Remote Working Guide"), path: "/panduan" },
  { label: t("Peta gaji", "Salary map"), path: "/peta-gaji" },
  { label: t("Harga", "Pricing"), path: "/#harga" },
  { label: "FAQ", path: "/faq" },
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
        <div className={`pb-dd-menu ${lebar ? "lebar" : ""}`} role="menu">
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
                  <span>{t("Review CV (AI)", "CV review (AI)")}</span>
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
                  {t("5.000 loker dan alat dasar sudah gratis. Mau buka semua loker dan fitur AI? Mulai Rp 9.000.", "5,000 jobs and the basic tools are free. Want every job and the AI features? From Rp 9,000.")}
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
                {(l?.aktif || l?.punyaKuota) && (
                  <a className="pb-quota" {...tautan(ke("paket"))} title={t("Sisa kuota fitur AI", "Remaining AI credits")}>
                    {t("Kuota AI", "AI credits")} <b>{l.sisaAnalisis ?? 0}</b> {t("review", "reviews")} · <b>{l.sisaInterview ?? 0}</b> {t("simulasi", "mock")}
                  </a>
                )}
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
          {menu.map((m) =>
            m.kolom ? (
              <React.Fragment key={m.label}>
                <div className="pb-mm-group">{m.label}</div>
                <div className="pb-mm-grid">
                  {itemsDari(m).map(({ t: judul, path, Ikon, pro, baru }) => (
                    <a key={path} className="pb-mm-item" {...tautan(path)}>
                      <Ikon size={16} />
                      <span>{judul}</span>
                      {pro && <span className="pb-tag pro">Pro</span>}
                      {baru && <span className="pb-tag baru">{t("Baru", "New")}</span>}
                    </a>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <a key={m.label} {...tautan(m.path)}>
                {m.label}
              </a>
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
        [t("Panduan Remote Working", "Remote Working Guide"), "/panduan"],
        [t("Magang", "Internships"), "/loker?tipe=magang"],
        ["Fresh graduate", "/loker?q=fresh%20graduate"],
        [t("Peta gaji", "Salary map"), "/peta-gaji"],
        [t("Cek loker palsu", "Fake job checker"), "/cek-loker"],
      ],
    },
    {
      judul: "Tools",
      tautan: [
        ["CV Builder", ke("cvbuilder")],
        ["LinkedIn Builder", ke("linkedinbuilder")],
        [t("Latihan interview", "Interview practice"), ke("interview")],
        [t("Rencana lamar", "Application plan"), ke("rencana")],
        [t("Review CV dengan AI", "AI CV review"), ke("overview")],
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
