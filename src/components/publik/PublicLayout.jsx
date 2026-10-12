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
import { SITUS } from "../../data/situs";

/* ------------------------------------------------------------------ */
/*  Struktur menu                                                      */
/* ------------------------------------------------------------------ */

const ke = (panel) => `/dashboard/${panel}`;

const I = {
  semua: { t: "Semua loker", d: "Cari dari semua sumber resmi", path: "/loker", Ikon: Search },
  remote: { t: "Loker remote", d: "Kerja dari mana saja, gaji rupiah atau dolar", path: "/remote", Ikon: Globe },
  magang: { t: "Magang & fresh graduate", d: "Untuk langkah pertamamu", path: "/loker?tipe=magang", Ikon: GraduationCap },
  cocok: { t: "Cocok untukku", d: "Diurutkan sesuai profil & CV-mu", path: ke("jobfinder"), Ikon: Sparkles },
  simpan: { t: "Tersimpan", d: "Loker yang kamu tandai", path: ke("saved"), Ikon: Bookmark },
  lamaran: { t: "Lamaran saya", d: "Pantau progres tiap lamaran", path: ke("applications"), Ikon: Send },
  rencana: { t: "Rencana lamar", d: "Target mingguan & streak harian", path: ke("rencana"), Ikon: CalendarCheck, baru: true },
  peta: { t: "Peta gaji", d: "Kisaran gaji per bidang & kota", path: "/peta-gaji", Ikon: BarChart3, baru: true },
  cek: { t: "Cek loker palsu", d: "Tempel teks loker, kenali tanda penipuan", path: "/cek-loker", Ikon: ShieldCheck, baru: true },
  kalkulator: { t: "Kalkulator gaji", d: "Dolar ke rupiah, per jam s.d. per tahun", path: "/kalkulator-gaji", Ikon: Calculator },
  profil: { t: "Profil karier", d: "Data diri, skill, pengalaman", path: ke("profile"), Ikon: User },
  cv: { t: "CV Builder", d: "Pilih font & tema, unduh PDF rapi", path: ke("cvbuilder"), Ikon: FilePlus2 },
  linkedin: { t: "LinkedIn Builder", d: "Rapikan profil LinkedIn", path: ke("linkedinbuilder"), Ikon: Linkedin },
  latihan: { t: "Latihan interview", d: "140+ pertanyaan, termasuk level neraka", path: ke("interview"), Ikon: MessageSquareQuote },
  review: { t: "Review CV", d: "Skor ATS & arah karier dari CV-mu", path: ke("overview"), Ikon: FileSearch, pro: true },
  pindah: { t: "Pindah karier", d: "Peta skill ke bidang baru", path: ke("pindahkarier"), Ikon: Route, pro: true },
  rekomendasi: { t: "Rekomendasi karier", d: "Posisi yang layak kamu incar", path: ke("recommendations"), Ikon: TrendingUp },
  simulasi: { t: "Simulasi interview", d: "Wawancara suara dengan AI", path: ke("simulasi"), Ikon: Mic, pro: true },
};

// Menu untuk pengguna yang sudah masuk — dikelompokkan per tujuan.
export const MENU_APLIKASI = [
  {
    label: "Loker",
    promo: "loker",
    kolom: [
      { judul: "Cari", items: [I.semua, I.remote, I.cocok] },
      { judul: "Punyaku", items: [I.simpan, I.lamaran, I.rencana] },
    ],
  },
  { label: "Profil & CV", kolom: [{ items: [I.profil, I.cv, I.linkedin] }] },
  {
    label: "Persiapan",
    kolom: [
      { judul: "Gratis", items: [I.latihan, I.rekomendasi] },
      { judul: "Dengan AI", items: [I.review, I.pindah, I.simulasi] },
    ],
  },
  { label: "Riset", kolom: [{ items: [I.peta, I.cek, I.kalkulator] }] },
];

// Menu untuk pengunjung — sama kayanya, tujuan yang butuh akun
// diarahkan ke halaman masuk lalu kembali ke tujuan semula.
export const MENU_PUBLIK = [
  {
    label: "Loker",
    promo: "loker",
    kolom: [
      { judul: "Cari loker", items: [I.semua, I.remote, I.magang] },
      { judul: "Riset sebelum melamar", items: [I.peta, I.cek, I.kalkulator] },
    ],
  },
  {
    label: "Alat",
    kolom: [
      { judul: "Gratis", items: [I.cv, I.linkedin, I.latihan, I.rencana] },
      { judul: "Dengan AI", items: [I.review, I.pindah, I.simulasi] },
    ],
  },
  { label: "Peta gaji", path: "/peta-gaji" },
  { label: "Harga", path: "/#harga" },
  { label: "FAQ", path: "/faq" },
];

const MENU_AKUN = [
  { t: "Paket & langganan", path: ke("paket"), Ikon: CreditCard },
  { t: "Pengaturan", path: ke("settings"), Ikon: Settings },
];

const itemsDari = (m) => (m.kolom ? m.kolom.flatMap((k) => k.items) : []);

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

const angka = (n) => Number(n || 0).toLocaleString("id-ID");

function ItemMenu({ item, aktif }) {
  const { t, d, path, Ikon, pro, baru } = item;
  return (
    <a role="menuitem" className={cocok(path, aktif) ? "on" : ""} {...tautan(path)}>
      <span className="pb-dd-ic">
        <Ikon size={17} />
      </span>
      <span>
        <span className="pb-dd-t">
          {t}
          {pro && <span className="pb-tag pro">Pro</span>}
          {baru && <span className="pb-tag baru">Baru</span>}
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
      <span className="k">Hari ini di Jobly</span>
      <b>{loading ? "…" : angka(total)}</b>
      <span className="s">lowongan dari situs karier resmi, LinkedIn, Indeed, dan lainnya</span>
      <span className="go">
        Mulai cari <ArrowRight size={14} />
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
                  <ItemMenu key={item.t} item={item} aktif={aktif} />
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
  ["terang", "Terang", Sun],
  ["gelap", "Gelap", Moon],
  ["sistem", "Sistem", Monitor],
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
        aria-label="Ganti tema tampilan"
        aria-expanded={buka}
        aria-haspopup="true"
        title="Tema tampilan"
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
                {id === "sistem" && <span className="pb-dd-d" style={{ margin: 0 }}>ikut perangkat</span>}
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
    <div className={`pb-seg ${kecil ? "kecil" : ""}`} role="radiogroup" aria-label="Tema tampilan">
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
                  5.000 loker & alat dasar gratis. Buka semua loker & fitur AI mulai Rp 9.000.
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
          <a className="pb-brand" {...tautan("/")} aria-label="Jobly — beranda">
            <TandaMerek />
            Jobly
          </a>

          <nav className="pb-nav" aria-label="Menu utama">
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
            <TombolTema />
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
            m.kolom ? (
              <React.Fragment key={m.label}>
                <div className="pb-mm-group">{m.label}</div>
                <div className="pb-mm-grid">
                  {itemsDari(m).map(({ t, path, Ikon, pro, baru }) => (
                    <a key={t} className="pb-mm-item" {...tautan(path)}>
                      <Ikon size={16} />
                      <span>{t}</span>
                      {pro && <span className="pb-tag pro">Pro</span>}
                      {baru && <span className="pb-tag baru">Baru</span>}
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
              <div className="pb-mm-group">Akun</div>
              {MENU_AKUN.map((i) => (
                <a key={i.t} {...tautan(i.path)}>
                  {i.t}
                </a>
              ))}
            </>
          )}
          <div className="pb-mm-group">Tampilan</div>
          <PilihTema kecil />
          {!masuk && (
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
  const tahun = new Date().getFullYear();

  const kolom = [
    {
      judul: "Lowongan",
      tautan: [
        ["Semua loker", "/loker"],
        ["Loker remote", "/remote"],
        ["Magang", "/loker?tipe=magang"],
        ["Fresh graduate", "/loker?q=fresh%20graduate"],
        ["Peta gaji", "/peta-gaji"],
        ["Cek loker palsu", "/cek-loker"],
      ],
    },
    {
      judul: "Alat",
      tautan: [
        ["CV Builder", ke("cvbuilder")],
        ["LinkedIn Builder", ke("linkedinbuilder")],
        ["Latihan interview", ke("interview")],
        ["Rencana lamar", ke("rencana")],
        ["Review CV dengan AI", ke("overview")],
        ["Kalkulator gaji USD", "/kalkulator-gaji"],
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
              In this economy cari kerja itu susah. Jobly mengumpulkan lowongan
              dari situs karier resmi dan platform tepercaya setiap hari, lalu
              membantumu menyiapkan lamaran sampai interview.
            </p>
            <div style={{ marginTop: 18 }}>
              <PilihTema kecil />
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
      aria-label="Kembali ke atas"
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
