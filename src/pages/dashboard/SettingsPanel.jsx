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
import { t } from "../../i18n.js";

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
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          background: disabled ? "rgba(0,0,0,0.03)" : "var(--t-field)",
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
      setGalat(t("Kata sandi minimal 8 karakter.", "Password must be at least 8 characters."));
      return;
    }
    if (sandi !== ulang) {
      setGalat(t("Konfirmasi kata sandi tidak cocok.", "The passwords don't match."));
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
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    background: "var(--t-field)",
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
          {t("Kata Sandi", "Password")}
        </span>
      </div>

      {!pakaiEmail ? (
        /* Akun pihak ketiga: jelaskan kenapa tidak bisa diubah di sini,
           bukan sekadar menonaktifkan tombol tanpa keterangan. */
        <div style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.65 }}>
          {t("Kamu masuk menggunakan", "You signed in with")}{" "}
          <strong>{penyediaLain.map(namaPenyedia).join(" dan ")}</strong>{t(", jadi tidak ada kata sandi yang perlu diatur di sini. Untuk mengubahnya, buka pengaturan keamanan di akun", ", so there's no password to set here. To change it, open the security settings of your")}{" "}{namaPenyedia(penyediaLain[0])} kamu.
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
          <Check size={14} />{" "}{t("Kata sandi berhasil diperbarui.", "Password updated.")}
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
            {t("Ganti kata sandi akunmu. Pakai minimal 8 karakter.", "Change your account password. Use at least 8 characters.")}
          </div>
          <Button variant="outline" onClick={() => setBuka(true)}>
            {t("Ganti kata sandi", "Change password")}
          </Button>
        </>
      ) : (
        <div style={{ marginTop: 12 }}>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <input
              type={lihat ? "text" : "password"}
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
              placeholder={t("Kata sandi baru", "New password")}
              autoComplete="new-password"
              style={input}
            />
            <button
              onClick={() => setLihat(!lihat)}
              aria-label={lihat ? t("Sembunyikan", "Hide") : t("Tampilkan", "Show")}
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
            placeholder={t("Ulangi kata sandi baru", "Repeat new password")}
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
                color: "var(--t-danger)",
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
              {t("Simpan", "Save")}
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
              {t("Batal", "Cancel")}
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
          {t("Akun", "Account")}
        </div>
        <SettingsField
          label={t("Nama", "Name")}
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
            <Check size={13} /> {saved ? t("Tersimpan", "Saved") : t("Simpan Nama", "Save name")}
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
          {t("Paket Langganan", "Plan")}
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
                ? (langganan.detailPaket?.nama ?? t("Aktif", "Active"))
                : t("Belum berlangganan", "No active plan")}
            </div>
            <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>
              {langganan.aktif
                ? t(`Sisa kuota: ${langganan.sisaAnalisis}/${langganan.kuotaAnalisis} Review CV · ${langganan.sisaPindah}/${langganan.kuotaPindah} Pindah Karier · ${langganan.sisaInterview}/${langganan.kuotaInterview} Simulasi · aktif ${langganan.sisaHari} hari lagi`, `Credits left: ${langganan.sisaAnalisis}/${langganan.kuotaAnalisis} CV review · ${langganan.sisaPindah}/${langganan.kuotaPindah} Career switch · ${langganan.sisaInterview}/${langganan.kuotaInterview} Mock interview · active for ${langganan.sisaHari} more days`)
                : t("Semua loker & alat dasar gratis. Latihan kerja & fitur AI mulai Rp 9.000.", "Every job & the basic tools are free. Practice & the AI features from Rp 9,000.")}
            </div>
          </div>
          <Button variant="outline" onClick={() => pergiKe("paket")}>
            {langganan.aktif ? t("Kelola", "Manage") : t("Lihat paket", "See plans")}
          </Button>
        </div>
      </Glass>
      <KartuKataSandi user={user} />
      <Glass style={{ padding: 22, border: "1px solid rgba(220,60,60,0.25)" }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14.5,
            color: "var(--t-danger)",
            marginBottom: 8,
          }}
        >
          {t("Hapus Akun", "Delete account")}
        </div>
        <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 14 }}>
          {t("Tindakan ini permanen dan tidak bisa dibatalkan.", "This is permanent and can't be undone.")}
        </div>
        <Button
          variant="outline"
          style={{ color: "var(--t-danger)", borderColor: "rgba(220,60,60,0.3)" }}
        >
          {t("Hapus Akun Saya", "Delete my account")}
        </Button>
      </Glass>
    </div>
  );
}
