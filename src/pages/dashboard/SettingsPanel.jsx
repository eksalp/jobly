import React, { useState, useEffect } from "react";
import {
  Check,
  KeyRound,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { T } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { useUserProfile } from "../../context/UserProfileContext";
import { useLangganan } from "../../hooks/useLangganan";
import { Glass } from "../../components/ui/Glass";
import { Button } from "../../components/ui/Button";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";

export function SettingsField({ label, value, onChange, disabled }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: T.inkSoft,
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: "100%",
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: "10px 12px",
          fontSize: 13,
          fontFamily: "'Poppins', sans-serif",
          background: disabled ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.6)",
          outline: "none",
          color: T.ink,
        }}
      />
    </div>
  );
}

/**
 * Kartu ganti kata sandi.
 *
 * Hanya relevan untuk akun yang mendaftar lewat email. Akun yang masuk
 * lewat Google tidak punya kata sandi di sistem kita — sandinya dikelola
 * Google, dan mengubahnya harus lewat akun Google mereka.
 */
function KartuKataSandi({ user }) {
  const [buka, setBuka] = useState(false);
  const [sandi, setSandi] = useState("");
  const [ulang, setUlang] = useState("");
  const [lihat, setLihat] = useState(false);
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState("");
  const [sukses, setSukses] = useState(false);

  // Supabase mencatat penyedia login di identities dan app_metadata.
  // Keduanya diperiksa karena bentuknya berbeda antar versi.
  const penyedia =
    user?.identities?.map((i) => i.provider) ??
    (user?.app_metadata?.provider ? [user.app_metadata.provider] : []);

  const pakaiEmail = penyedia.length === 0 || penyedia.includes("email");
  const penyediaLain = penyedia.filter((p) => p !== "email");

  const namaPenyedia = (p) =>
    ({ google: "Google", github: "GitHub", facebook: "Facebook" })[p] ?? p;

  const simpan = async () => {
    setGalat("");

    if (sandi.length < 8) {
      setGalat("Kata sandi minimal 8 karakter.");
      return;
    }
    if (sandi !== ulang) {
      setGalat("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setProses(true);
    const { error } = await supabase.auth.updateUser({ password: sandi });
    setProses(false);

    if (error) {
      setGalat(error.message);
      return;
    }

    setSandi("");
    setUlang("");
    setBuka(false);
    setSukses(true);
    setTimeout(() => setSukses(false), 3000);
  };

  const input = {
    width: "100%",
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: "9px 38px 9px 12px",
    fontSize: 13,
    fontFamily: "'Poppins', sans-serif",
    background: "rgba(255,255,255,0.6)",
    outline: "none",
    color: T.ink,
    boxSizing: "border-box",
  };

  return (
    <Glass style={{ padding: 22 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <KeyRound size={15} color={T.inkSoft} />
        <span style={{ fontWeight: 600, fontSize: 14.5, color: T.ink }}>
          Kata Sandi
        </span>
      </div>

      {!pakaiEmail ? (
        /* Akun pihak ketiga: jelaskan kenapa tidak bisa diubah di sini,
           bukan sekadar menonaktifkan tombol tanpa keterangan. */
        <div style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.65 }}>
          Kamu masuk menggunakan{" "}
          <strong>{penyediaLain.map(namaPenyedia).join(" dan ")}</strong>, jadi
          tidak ada kata sandi yang perlu diatur di sini. Untuk mengubahnya,
          buka pengaturan keamanan di akun {namaPenyedia(penyediaLain[0])} kamu.
        </div>
      ) : sukses ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12.5,
            color: T.teal,
          }}
        >
          <Check size={14} /> Kata sandi berhasil diperbarui.
        </div>
      ) : !buka ? (
        <>
          <div
            style={{
              fontSize: 12.5,
              color: T.inkSoft,
              marginBottom: 14,
              lineHeight: 1.6,
            }}
          >
            Ganti kata sandi akunmu. Pakai minimal 8 karakter.
          </div>
          <Button variant="outline" onClick={() => setBuka(true)}>
            Ganti kata sandi
          </Button>
        </>
      ) : (
        <div style={{ marginTop: 12 }}>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <input
              type={lihat ? "text" : "password"}
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
              placeholder="Kata sandi baru"
              autoComplete="new-password"
              style={input}
            />
            <button
              onClick={() => setLihat(!lihat)}
              aria-label={lihat ? "Sembunyikan" : "Tampilkan"}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.inkFaint,
                padding: 2,
                display: "flex",
              }}
            >
              {lihat ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <input
            type={lihat ? "text" : "password"}
            value={ulang}
            onChange={(e) => setUlang(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && simpan()}
            placeholder="Ulangi kata sandi baru"
            autoComplete="new-password"
            style={{ ...input, paddingRight: 12, marginBottom: 10 }}
          />

          {galat && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#B23A3A",
                marginBottom: 10,
              }}
            >
              <AlertCircle size={13} style={{ flexShrink: 0 }} /> {galat}
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="primary" onClick={simpan} disabled={proses}>
              {proses ? (
                <Loader2
                  size={13}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Check size={13} />
              )}
              Simpan
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setBuka(false);
                setSandi("");
                setUlang("");
                setGalat("");
              }}
            >
              Batal
            </Button>
          </div>
        </div>
      )}
    </Glass>
  );
}

export function SettingsPanel({ setActive }) {
  const { user } = useAuth();
  const langganan = useLangganan();

  // Sama seperti panel lain: pakai prop kalau ada, kalau tidak lewat event.
  const pergiKe = (panel) => {
    if (typeof setActive === "function") {
      setActive(panel);
      return;
    }
    window.dispatchEvent(new CustomEvent("jf:navigate", { detail: panel }));
  };
  const { fullName, updateProfile } = useUserProfile();
  const [nameDraft, setNameDraft] = useState(fullName);
  const [saved, setSaved] = useState(false);

  // Sinkronkan draft kalau fullName dari profil berubah (mis. baru selesai loading)
  useEffect(() => {
    setNameDraft(fullName);
  }, [fullName]);

  const handleSaveName = () => {
    updateProfile({ fullName: nameDraft });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div
      style={{
        padding: 28,
        maxWidth: 640,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <Glass style={{ padding: 22 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14.5,
            color: T.ink,
            marginBottom: 16,
          }}
        >
          Akun
        </div>
        <SettingsField
          label="Nama"
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
        />
        <SettingsField label="Email" value={user?.email || ""} disabled />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button
            variant="primary"
            style={{ fontSize: 12.5, padding: "8px 14px" }}
            onClick={handleSaveName}
            disabled={!nameDraft.trim() || nameDraft === fullName}
          >
            <Check size={13} /> {saved ? "Tersimpan" : "Simpan Nama"}
          </Button>
        </div>
      </Glass>
      {/* Paket Langganan — datanya diambil dari langganan sungguhan,
          bukan teks tetap, dan tombolnya mengarah ke halaman paket. */}
      <Glass style={{ padding: 22 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14.5,
            color: T.ink,
            marginBottom: 16,
          }}
        >
          Paket Langganan
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>
              {langganan.aktif
                ? (langganan.detailPaket?.nama ?? "Aktif")
                : "Belum berlangganan"}
            </div>
            <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>
              {langganan.aktif
                ? `${langganan.sisaAnalisis} dari ${langganan.kuotaAnalisis} analisis tersisa · aktif ${langganan.sisaHari} hari lagi`
                : "Analisis AI, CV Builder, dan seluruh loker yang cocok"}
            </div>
          </div>
          <Button variant="outline" onClick={() => pergiKe("paket")}>
            {langganan.aktif ? "Kelola" : "Lihat paket"}
          </Button>
        </div>
      </Glass>
      <KartuKataSandi user={user} />
      <Glass style={{ padding: 22, border: "1px solid rgba(220,60,60,0.25)" }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14.5,
            color: "#C23B3B",
            marginBottom: 8,
          }}
        >
          Hapus Akun
        </div>
        <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 14 }}>
          Tindakan ini permanen dan nggak bisa dibatalkan.
        </div>
        <Button
          variant="outline"
          style={{ color: "#C23B3B", borderColor: "rgba(220,60,60,0.3)" }}
        >
          Hapus Akun Saya
        </Button>
      </Glass>
    </div>
  );
}
