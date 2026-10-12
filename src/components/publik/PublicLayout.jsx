import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
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
} from "lucide-react";
import "../../styles/publik.css";
import { useAuth } from "../../context/AuthContext";
import { useUserProfile } from "../../context/UserProfileContext";
import { useLangganan } from "../../context/LanggananContext";
import { getInitials } from "../../utils/format";
import { tautan, keHalaman } from "../../utils/navigasi";
import { SITUS } from "../../data/situs";

/* ------------------------------------------------------------------ */
/*  Struktur menu                                                      */
/* ------------------------------------------------------------------ */

const ke = (panel) => `/dashboard/${panel}`;

// Menu untuk pengguna yang sudah masuk — menggantikan sidebar lama.
// Dikelompokkan per tujuan pengguna, bukan per fitur teknis.
export const MENU_APLIKASI = [
  {
    label: "Loker",
    items: [
      { t: "Semua loker", d: "Cari dari semua sumber", path: "/loker", Ikon: Search },
      { t: "Cocok untukku", d: "Diurutkan sesuai profil & CV-mu", path: ke("jobfinder"), Ikon: Sparkles },
      { t: "Tersimpan", d: "Loker yang kamu tandai", path: ke("saved"), Ikon: Bookmark },
      { t: "Lamaran saya", d: "Pantau progres tiap lamaran", path: ke("applications"), Ikon: Send },
    ],
  },
  {
    label: "Profil & CV",
    items: [
      { t: "Profil karier", d: "Data diri, skill, pengalaman", path: ke("profile"), Ikon: User },
      { t: "CV Builder", d: "Susun & unduh CV dalam PDF", path: ke("cvbuilder"), Ikon: FilePlus2 },
      { t: "LinkedIn Builder", d: "Rapikan profil LinkedIn", path: ke("linkedinbuilder"), Ikon: Linkedin },
    ],
  },
  {
    label: "Alat AI",
    items: [
      { t: "Review CV", d: "Skor ATS & arah karier dari CV-mu", path: ke("overview"), Ikon: FileSearch, pro: true },
      { t: "Pindah karier", d: "Peta skill ke bidang baru", path: ke("pindahkarier"), Ikon: Route, pro: true },
      { t: "Rekomendasi karier", d: "Posisi yang layak kamu incar", path: ke("recommendations"), Ikon: TrendingUp },
      { t: "Simulasi interview", d: "Wawancara suara dengan AI", path: ke("simulasi"), Ikon: Mic, pro: true },
    ],
  },
  { label: "Latihan interview", path: ke("interview") },
  { label: "Kalkulator gaji", path: "/kalkulator-gaji" },
];

// Menu untuk pengunjung
export const MENU_PUBLIK = [
  { label: "Loker", path: "/loker" },
  { label: "Kalkulator gaji", path: "/kalkulator-gaji" },
  { label: "Fitur", path: "/#fitur" },
  { label: "Harga", path: "/#harga" },
  { label: "FAQ", path: "/faq" },
];

const MENU_AKUN = [
  { t: "Paket & langganan", path: ke("paket"), Ikon: CreditCard },
  { t: "Pengaturan", path: ke("settings"), Ikon: Settings },
];

export const KOTA_POPULER = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Medan",
  "Semarang",
  "Yogyakarta",
  "Makassar",
  "Denpasar",
  "Bekasi",
  "Tangerang",
  "Depok",
  "Bogor",
  "Malang",
  "Palembang",
  "Batam",
  "Pekanbaru",
  "Balikpapan",
  "Samarinda",
  "Banjarmasin",
  "Pontianak",
  "Manado",
  "Padang",
  "Bandar Lampung",
  "Cikarang",
  "Karawang",
  "Solo",
  "Cirebon",
  "Serang",
];

/* ------------------------------------------------------------------ */
/*  Bagian kecil                                                       */
/* ------------------------------------------------------------------ */

function TandaMerek() {
  return (
    <span className="pb-brand-mk" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </span>
  );
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

function MenuTurun({ grup, aktif }) {
  const [buka, setBuka] = useState(false);
  const ref = useTutupLuar(buka, setBuka);
  const on = grup.items.some((i) => cocok(i.path, aktif));

  useEffect(() => setBuka(false), [aktif]);

  return (
    <div className="pb-dd" ref={ref}>
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
        <div className="pb-dd-menu" role="menu">
          {grup.items.map(({ t, d, path, Ikon, pro }) => (
            <a key={t} role="menuitem" className={cocok(path, aktif) ? "on" : ""} {...tautan(path)}>
              <span className="pb-dd-ic">
                <Ikon size={17} />
              </span>
              <span>
                <span className="pb-dd-t">
                  {t}
                  {pro && <span className="pb-tag pro">Pro</span>}
                </span>
                <span className="pb-dd-d">{d}</span>
              </span>
            </a>
          ))}
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

  const nama = fullName || user?.email?.split("@")[0] || "Akun";
  const adaKuota = l?.aktif || l?.punyaKuota;
  const berakhir = l?.berakhirAt
    ? new Date(l.berakhirAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
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
        aria-label="Menu akun"
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
                  <span>Review CV (AI)</span>
                  <b>{l.sisaAnalisis ?? 0}x</b>
                </div>
                <div className="row">
                  <span>Pindah karier</span>
                  <b>{l.sisaPindah ?? 0}x</b>
                </div>
                <div className="row">
                  <span>Simulasi interview</span>
                  <b>{l.sisaInterview ?? 0}x</b>
                </div>
                {berakhir && (
                  <div className="exp">
                    Paket {l.detailPaket?.nama || ""} berlaku sampai {berakhir}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>Paket Free</div>
                <div className="exp" style={{ marginTop: 2 }}>
                  Semua loker & alat dasar gratis. Fitur AI mulai Rp 9.000.
                </div>
              </>
            )}
          </div>
          {MENU_AKUN.map(({ t, path, Ikon }) => (
            <a key={t} role="menuitem" className={cocok(path, aktif) ? "on" : ""} {...tautan(path)}>
              <span className="pb-dd-ic">
                <Ikon size={17} />
              </span>
              <span className="pb-dd-t">{t}</span>
            </a>
          ))}
          <div className="pb-dd-sep" />
          <button type="button" className="item" role="menuitem" onClick={keluar}>
            <span className="pb-dd-ic">
              <LogOut size={17} />
            </span>
            <span className="pb-dd-t">Keluar</span>
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
  const menu = masuk ? MENU_APLIKASI : MENU_PUBLIK;

  useEffect(() => setBuka(false), [aktif]);

  return (
    <header className="pb-header">
      <div className="pb-wrap">
        <div className="pb-header-in">
          <a className="pb-brand" {...tautan("/")} aria-label="Jobly — beranda">
            <TandaMerek />
            Jobly
          </a>

          <nav className="pb-nav" aria-label="Menu utama">
            {menu.map((m) =>
              m.items ? (
                <MenuTurun key={m.label} grup={m} aktif={aktif} />
              ) : (
                <a key={m.label} className={cocok(m.path, aktif) && !m.path.includes("#") ? "on" : ""} {...tautan(m.path)}>
                  {m.label}
                </a>
              ),
            )}
          </nav>

          <div className="pb-actions">
            {masuk ? (
              <>
                {(l?.aktif || l?.punyaKuota) && (
                  <a className="pb-quota" {...tautan(ke("paket"))} title="Sisa kuota fitur AI">
                    Kuota AI <b>{l.sisaAnalisis ?? 0}</b> review · <b>{l.sisaInterview ?? 0}</b> simulasi
                  </a>
                )}
                <MenuAkun aktif={aktif} />
              </>
            ) : (
              <>
                <a className="pb-login" {...tautan("/login")}>
                  Masuk
                </a>
                <a className="pb-btn pb-btn-primary pb-btn-sm" {...tautan("/register")}>
                  Daftar gratis
                </a>
              </>
            )}
            <button
              type="button"
              className="pb-burger"
              onClick={() => setBuka((v) => !v)}
              aria-label={buka ? "Tutup menu" : "Buka menu"}
              aria-expanded={buka}
            >
              {buka ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div className={`pb-mobile-menu ${buka ? "open" : ""}`}>
          {menu.map((m) =>
            m.items ? (
              <React.Fragment key={m.label}>
                <div className="pb-mm-group">{m.label}</div>
                {m.items.map((i) => (
                  <a key={i.t} {...tautan(i.path)}>
                    {i.t}
                    {i.pro && <span className="pb-tag pro">Pro</span>}
                  </a>
                ))}
              </React.Fragment>
            ) : (
              <a key={m.label} {...tautan(m.path)}>
                {m.label}
              </a>
            ),
          )}
          {masuk ? (
            <>
              <div className="pb-mm-group">Akun</div>
              {MENU_AKUN.map((i) => (
                <a key={i.t} {...tautan(i.path)}>
                  {i.t}
                </a>
              ))}
            </>
          ) : (
            <div className="pb-mobile-cta">
              <a className="pb-btn pb-btn-outline" {...tautan("/login")}>
                Masuk
              </a>
              <a className="pb-btn pb-btn-primary" {...tautan("/register")}>
                Daftar gratis
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

export function SiteFooter() {
  const { session } = useAuth();
  const masuk = Boolean(session);
  const tahun = new Date().getFullYear();
  const fitur = (panel) => (masuk ? ke(panel) : "/register");

  const kolom = [
    {
      judul: "Lowongan",
      tautan: [
        ["Semua loker", "/loker"],
        ["Loker remote", "/loker?lokasi=remote"],
        ["Magang", "/loker?tipe=magang"],
        ["Fresh graduate", "/loker?q=fresh%20graduate"],
        ["Kalkulator gaji USD", "/kalkulator-gaji"],
      ],
    },
    {
      judul: "Alat",
      tautan: [
        ["CV Builder", fitur("cvbuilder")],
        ["LinkedIn Builder", fitur("linkedinbuilder")],
        ["Review CV dengan AI", fitur("overview")],
        ["Latihan interview", fitur("interview")],
        ["Simulasi interview AI", fitur("simulasi")],
      ],
    },
    {
      judul: "Jobly",
      tautan: [
        ["Harga", "/#harga"],
        ["FAQ", "/faq"],
        ["Syarat & ketentuan", "/syarat-ketentuan"],
        ["Kebijakan privasi", "/kebijakan-privasi"],
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
              <TandaMerek />
              Jobly
            </a>
            <p>
              Lowongan kerja dari situs karier resmi perusahaan dan platform
              tepercaya, dikumpulkan setiap hari. Cari gratis, lamar langsung di
              sumbernya.
            </p>
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
          <span>
            © {tahun} {SITUS.nama} · Dibuat oleh {SITUS.pembuat}
          </span>
          <p>
            Jobly bukan agen penyalur kerja dan tidak berafiliasi dengan
            perusahaan yang lowongannya ditampilkan. Melamar selalu di sumber
            aslinya, tanpa biaya dari Jobly.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Kerangka & util                                                    */
/* ------------------------------------------------------------------ */

/** Kerangka halaman publik: header, isi, footer. */
export function PublicLayout({ aktif, children }) {
  return (
    <div className="pb">
      <SiteHeader aktif={aktif} />
      <main className="pb-main">{children}</main>
      <SiteFooter />
    </div>
  );
}

/** Notifikasi kecil di bawah layar, hilang sendiri. */
export function useToast() {
  const [pesan, setPesan] = useState("");
  useEffect(() => {
    if (!pesan) return;
    const t = setTimeout(() => setPesan(""), 2400);
    return () => clearTimeout(t);
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
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => clearTimeout(t);
  }, [siap]);
}
