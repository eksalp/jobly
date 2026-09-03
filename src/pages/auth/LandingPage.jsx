import React from "react";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Linkedin,
  Search,
  Briefcase,
  Check,
  Loader2,
  Building2,
  Layers,
} from "lucide-react";
import { T } from "../../theme";
import { Button } from "../../components/ui/Button";
import { Glass } from "../../components/ui/Glass";
import { Logo } from "../../components/ui/Logo";
import { useStatistikLoker, bulatkan } from "../../hooks/useStatistikLoker";
import { useLayarKecil } from "../../hooks/useLayarKecil";

const FITUR = [
  {
    Ikon: Layers,
    judul: "Puluhan ribu loker, satu pencarian",
    isi: "Kami mengumpulkan lowongan dari banyak perusahaan dan sumber sekaligus, lalu memperbaruinya tiap hari. Kamu cukup mencari di satu tempat.",
  },
  {
    Ikon: Search,
    judul: "Pencocokan loker dari CV kamu",
    isi: "Tempel CV, langsung ketahuan lowongan mana yang cocok dan kenapa. Bukan sekadar kata kunci — bidangnya dicocokkan, bukan cuma katanya.",
  },
  {
    Ikon: FileText,
    judul: "Audit CV dengan skor ATS",
    isi: "Tahu bagian mana yang bikin CV kamu tersaring sistem, lengkap dengan cara memperbaikinya per bagian.",
  },
  {
    Ikon: Sparkles,
    judul: "CV ditulis ulang oleh AI",
    isi: "Ringkasan, bullet pengalaman, dan skill disusun ulang agar lolos penyaringan — dalam bahasa Indonesia dan Inggris.",
  },
  {
    Ikon: Linkedin,
    judul: "Profil LinkedIn yang dilirik recruiter",
    isi: "Headline, Tentang, dan keahlian ditulis ulang mengikuti cara kerja pencarian LinkedIn.",
  },
];

export function LandingPage({ go }) {
  const { statistik, total, loading } = useStatistikLoker();
  const hp = useLayarKecil(760);

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      {/* ===== Bilah atas ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: hp ? "16px 18px" : "20px 36px",
          gap: 12,
        }}
      >
        <Logo size={26} />
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            variant="outline"
            onClick={() => go("login")}
            style={{ fontSize: 13 }}
          >
            Masuk
          </Button>
          {!hp && (
            <Button
              variant="primary"
              onClick={() => go("register")}
              style={{ fontSize: 13 }}
            >
              Daftar gratis
            </Button>
          )}
        </div>
      </div>

      {/* ===== Bagian utama ===== */}
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: hp ? "28px 18px 48px" : "56px 32px 72px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: T.accentSoft,
            color: T.accent,
            padding: "6px 14px",
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          <Sparkles size={13} />
          Analisis karier bertenaga AI
        </div>

        {/* Angka total loker jadi elemen paling besar di layar — ini yang
            paling cepat menjelaskan skala produk sebelum orang membaca
            satu kata pun. */}
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: hp ? 40 : 60,
            fontWeight: 700,
            color: T.ink,
            lineHeight: 1,
            marginBottom: 6,
            letterSpacing: "-0.03em",
          }}
        >
          {loading ? (
            <Loader2
              size={hp ? 34 : 48}
              style={{ animation: "spin 1s linear infinite", color: T.accent }}
            />
          ) : (
            <>
              {total.toLocaleString("id-ID")}
              <span style={{ color: T.accent }}>+</span>
            </>
          )}
        </div>
        <div
          style={{
            fontSize: hp ? 13.5 : 15,
            color: T.inkSoft,
            marginBottom: 28,
            fontWeight: 500,
          }}
        >
          lowongan aktif dari ribuan perusahaan, diperbarui tiap hari
        </div>

        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: hp ? 24 : 34,
            fontWeight: 700,
            color: T.ink,
            lineHeight: 1.3,
            marginBottom: 14,
            letterSpacing: "-0.02em",
          }}
        >
          Satu tempat untuk mencari di semuanya sekaligus
        </h1>

        <p
          style={{
            fontSize: hp ? 14 : 16.5,
            color: T.inkSoft,
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 28px",
          }}
        >
          Daripada buka puluhan situs lowongan satu per satu, cukup tempel CV
          kamu di sini. Kami yang mencocokkannya ke seluruh katalog, dan
          menunjukkan langsung kenapa suatu lowongan cocok untukmu.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          <Button
            variant="primary"
            onClick={() => go("register")}
            style={{ fontSize: 14, padding: "12px 22px" }}
          >
            Mulai gratis <ArrowRight size={16} />
          </Button>
          <Button
            variant="outline"
            onClick={() => go("login")}
            style={{ fontSize: 14, padding: "12px 22px" }}
          >
            Sudah punya akun
          </Button>
        </div>

        <div style={{ fontSize: 12, color: T.inkFaint }}>
          Analisis arah karier dan pencocokan loker gratis, tanpa kartu kredit.
        </div>
      </div>

      {/* ===== Statistik loker per bidang ===== */}
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: hp ? "0 18px 48px" : "0 32px 64px",
        }}
      >
        <Glass style={{ padding: hp ? 20 : 28 }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: 5,
              }}
            >
              <Briefcase size={16} color={T.accent} />
              <span style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>
                {loading
                  ? "Menghitung lowongan..."
                  : `${total.toLocaleString("id-ID")} lowongan aktif`}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: T.inkSoft }}>
              Diperbarui otomatis setiap hari dari berbagai sumber
            </div>
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: 24,
                fontSize: 13,
                color: T.inkSoft,
              }}
            >
              <Loader2
                size={15}
                style={{ animation: "spin 1s linear infinite" }}
              />
              Memuat data lowongan...
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 10,
              }}
            >
              {statistik.map((s) => (
                <div
                  key={s.label}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.55)",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: T.accent,
                      fontFamily: "'Poppins', sans-serif",
                      lineHeight: 1.1,
                    }}
                  >
                    {bulatkan(s.jumlah)}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: T.inkSoft,
                      marginTop: 4,
                      lineHeight: 1.4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Angka ini hasil pencocokan kata kunci, bukan klasifikasi penuh.
              Disebutkan terus terang supaya tidak terbaca sebagai data pasti. */}
          {!loading && statistik.length > 0 && (
            <div
              style={{
                fontSize: 10.5,
                color: T.inkFaint,
                textAlign: "center",
                marginTop: 14,
                lineHeight: 1.5,
              }}
            >
              Angka per bidang bersifat perkiraan — satu lowongan bisa masuk
              lebih dari satu bidang.
            </div>
          )}

          {/* Penekanan "banyak sumber, satu tempat" — ini yang membedakan
              dari sekadar satu papan lowongan biasa. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 18,
              paddingTop: 18,
              borderTop: `1px solid ${T.border}`,
              fontSize: 12,
              color: T.inkSoft,
              flexWrap: "wrap",
              textAlign: "center",
            }}
          >
            <Building2 size={13} color={T.inkFaint} />
            Dikumpulkan otomatis dari banyak perusahaan dan papan lowongan
            sekaligus — kamu tidak perlu buka satu-satu.
          </div>
        </Glass>
      </div>

      {/* ===== Fitur ===== */}
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: hp ? "0 18px 48px" : "0 32px 64px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: hp ? "1fr" : "1fr 1fr",
            gap: 12,
          }}
        >
          {FITUR.map(({ Ikon, judul, isi }) => (
            <Glass key={judul} style={{ padding: 20 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  background: T.accentSoft,
                  color: T.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ikon size={17} />
              </div>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 6,
                }}
              >
                {judul}
              </div>
              <div
                style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.65 }}
              >
                {isi}
              </div>
            </Glass>
          ))}
        </div>
      </div>

      {/* ===== Ajakan terakhir ===== */}
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: hp ? "0 18px 56px" : "0 32px 80px",
        }}
      >
        <Glass
          style={{
            padding: hp ? 24 : 36,
            textAlign: "center",
            border: `1.5px solid ${T.accent}`,
          }}
        >
          <div
            style={{
              fontSize: hp ? 18 : 22,
              fontWeight: 600,
              color: T.ink,
              marginBottom: 8,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Coba dulu, tanpa bayar
          </div>
          <div
            style={{
              fontSize: 13,
              color: T.inkSoft,
              lineHeight: 1.7,
              maxWidth: 460,
              margin: "0 auto 20px",
            }}
          >
            Deteksi arah karier dan pencocokan loker bisa langsung kamu pakai
            setelah daftar. Analisis lengkap dan penulisan ulang CV tersedia
            lewat paket berlangganan.
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 7,
              maxWidth: 340,
              margin: "0 auto 22px",
              textAlign: "left",
            }}
          >
            {[
              "Deteksi arah karier dari CV",
              "Loker yang cocok beserta alasannya",
              "CV Builder siap unduh PDF",
            ].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  gap: 8,
                  fontSize: 12.5,
                  color: T.inkSoft,
                }}
              >
                <Check
                  size={14}
                  color={T.teal}
                  style={{ flexShrink: 0, marginTop: 2 }}
                />
                {t}
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            onClick={() => go("register")}
            style={{ fontSize: 14, padding: "12px 26px" }}
          >
            Daftar gratis <ArrowRight size={16} />
          </Button>
        </Glass>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "0 18px 32px",
          fontSize: 11.5,
          color: T.inkFaint,
        }}
      >
        Jobly · Dibuat untuk pencari kerja di Indonesia
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
