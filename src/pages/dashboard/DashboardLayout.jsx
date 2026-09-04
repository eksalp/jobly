import React from "react";
import {
  LayoutGrid,
  User,
  FilePlus2,
  Search,
  Bookmark,
  Send,
  TrendingUp,
  Settings as SettingsIcon,
  X,
  Menu,
  LogOut,
  Linkedin,
  CreditCard,
  Route,
} from "lucide-react";
import { T } from "../../theme";
import { Logo } from "../../components/ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { useUserProfile } from "../../context/UserProfileContext";
import { getInitials } from "../../utils/format";
import { KartuLangganan } from "../../components/KartuLangganan";

export const NAV_GROUPS = [
  {
    label: "Ringkasan",
    items: [{ id: "overview", t: "Cari Arah Karier", i: LayoutGrid }],
  },
  {
    label: "Profil",
    items: [
      { id: "profile", t: "Profil Karier", i: User },
      { id: "cvbuilder", t: "CV Builder", i: FilePlus2 },
      { id: "linkedinbuilder", t: "LinkedIn Builder", i: Linkedin },
    ],
  },
  {
    label: "Pekerjaan",
    items: [
      { id: "jobfinder", t: "Job Finder", i: Search },
      { id: "saved", t: "Saved Jobs", i: Bookmark },
      { id: "applications", t: "Applications", i: Send },
    ],
  },
  {
    label: "Pengembangan",
    items: [
      { id: "recommendations", t: "Career Recommendations", i: TrendingUp },
      { id: "pindahkarier", t: "Pindah Karier", i: Route },
    ],
  },
  {
    label: "Lainnya",
    items: [
      { id: "paket", t: "Paket & Langganan", i: CreditCard },
      { id: "settings", t: "Settings", i: SettingsIcon },
    ],
  },
];

export function Sidebar({ active, setActive, go, mobileOpen, setMobileOpen }) {
  const { user, signOut } = useAuth();
  const { fullName } = useUserProfile();
  const displayName = fullName || user?.email?.split("@")[0] || "User";
  const initials = getInitials(fullName || user?.email);

  const handleLogout = async () => {
    await signOut();
    go("login");
  };

  return (
    <div
      className={`jf-sidebar ${mobileOpen ? "jf-sidebar-open" : ""}`}
      style={{
        width: 248,
        // 100dvh (dynamic viewport height) memperhitungkan bilah alamat
        // browser HP yang muncul-hilang saat menggulir. Dengan 100vh biasa,
        // tinggi dihitung seolah bilah itu tidak ada — akibatnya bagian
        // paling bawah (nama akun & tombol keluar) selalu terdorong ke
        // area yang tertutup dan tidak pernah bisa dijangkau.
        // 100vh ditulis lebih dulu sebagai cadangan untuk browser lama.
        height: "100vh",
        maxHeight: "100dvh",
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        // Sidebar TIDAK menggulir sendiri. Yang menggulir hanya area menu
        // di dalamnya, supaya header (logo) dan footer (akun) tetap diam
        // di tempatnya. Sebelumnya keduanya sama-sama scrollable dan
        // saling berebut, sehingga footer ikut hanyut keluar layar.
        overflow: "hidden",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderRight: "1px solid rgba(255,255,255,0.7)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6px",
          marginBottom: 24,
          flexShrink: 0,
        }}
      >
        <Logo size={24} />
        <button
          className="jf-sidebar-close"
          onClick={() => setMobileOpen(false)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: T.ink,
          }}
        >
          <X size={18} />
        </button>
      </div>
      {/* Satu-satunya area yang menggulir. minHeight: 0 wajib ada —
          tanpa itu, anak flex menolak menyusut di bawah tinggi isinya
          dan malah mendorong footer keluar layar alih-alih menggulir. */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {NAV_GROUPS.filter((g) => g.items.length > 0).map((g) => (
          <div key={g.label} style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: T.inkFaint,
                fontWeight: 600,
                padding: "0 10px",
                marginBottom: 8,
              }}
            >
              {g.label}
            </div>
            {g.items.map((it) => {
              const Icon = it.i;
              const isActive = active === it.id;
              return (
                <div
                  key={it.id}
                  onClick={() => {
                    setActive(it.id);
                    setMobileOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 10px",
                    borderRadius: 12,
                    cursor: "pointer",
                    marginBottom: 2,
                    background: isActive ? T.accentSoft : "transparent",
                    color: isActive ? T.accent : T.inkSoft,
                    fontSize: 13.5,
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  <Icon size={16} /> {it.t}
                </div>
              );
            })}
          </div>
        ))}

        {/* Status langganan — ditaruh di bawah menu supaya sisa kuota
            selalu terlihat, di halaman mana pun user berada. */}
        <div style={{ padding: "8px 10px 0" }}>
          <KartuLangganan setActive={setActive} />
        </div>
      </div>
      <div
        style={{
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 10px 0",
          // Tanpa ini footer ikut terperas saat menu panjang, sampai nama
          // akun dan tombol keluar hilang sama sekali dari layar.
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 99,
            background: T.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            color: "#fff",
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: T.ink,
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              color: T.inkFaint,
              fontSize: 11.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.email || ""}
          </div>
        </div>
        <LogOut
          size={15}
          color={T.inkFaint}
          style={{ cursor: "pointer" }}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}

export function Topbar({ title, setMobileOpen }) {
  const { user } = useAuth();
  const { fullName } = useUserProfile();
  const initials = getInitials(fullName || user?.email);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 28px",
        background: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${T.border}`,
        // Header tetap menempel di atas saat konten digulir, supaya judul
        // halaman dan tombol menu selalu terjangkau — terutama di HP di
        // mana halaman bisa sangat panjang.
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="jf-sidebar-open-btn"
          onClick={() => setMobileOpen(true)}
          style={{ display: "none", background: "none", border: "none" }}
        >
          <Menu size={20} color={T.ink} />
        </button>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 19,
            fontWeight: 600,
            color: T.ink,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 99,
            background: T.accent,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
          }}
        >
          {initials}
        </div>
      </div>
    </div>
  );
}
