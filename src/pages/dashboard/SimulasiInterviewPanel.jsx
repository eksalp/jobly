import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Play,
  Square,
  Loader2,
  Volume2,
  History,
  Sparkles,
  Clock,
  ChevronRight,
  Bot,
  User as UserIcon,
  Info,
} from "lucide-react";
import { T } from "../../theme";
import { Glass } from "../../components/ui/Glass";
import { Button } from "../../components/ui/Button";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useLangganan } from "../../hooks/useLangganan";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { GerbangFitur, BilahLangganan } from "../../components/GerbangFitur";
import { KATEGORI_INTERVIEW } from "../../data/interviewBank";

/* ------------------------------------------------------------------ */
/*  MOCKUP — belum tersambung ke AI suara sungguhan.
    Semua yang ditandai MOCK di bawah nanti diganti panggilan nyata ke
    speech-to-text, LLM, dan text-to-speech. Alur, tata letak, dan
    penyimpanan riwayatnya sudah final supaya penggantian nanti hanya
    menyentuh lapisan pemanggilan AI-nya saja.                          */
/* ------------------------------------------------------------------ */

const TAHAP = {
  siap: "siap",
  berlangsung: "berlangsung",
  selesai: "selesai",
};

// MOCK: contoh dialog untuk memperagakan tampilannya
const CONTOH_DIALOG = [
  {
    dari: "ai",
    teks: "Selamat datang. Saya akan menjadi pewawancara Anda hari ini. Bisa ceritakan tentang diri Anda secara singkat?",
  },
  {
    dari: "user",
    teks: "Baik. Saya lulusan Manajemen dengan pengalaman dua tahun di bidang HR, terutama rekrutmen dan administrasi kepegawaian.",
  },
  {
    dari: "ai",
    teks: "Menarik. Anda menyebut rekrutmen — bisa berikan contoh situasi ketika Anda harus menolak kandidat yang direkomendasikan langsung oleh atasan Anda?",
  },
];

export function SimulasiInterviewPanel({ setActive }) {
  const { user } = useAuth();
  const langganan = useLangganan();
  const hp = useLayarKecil(600);

  const [posisi, setPosisi] = useState("");
  const [kategori, setKategori] = useState(KATEGORI_INTERVIEW[0].slug);
  const [tahap, setTahap] = useState(TAHAP.siap);
  const [dialog, setDialog] = useState([]);
  const [merekam, setMerekam] = useState(false);
  const [detik, setDetik] = useState(0);
  const [riwayat, setRiwayat] = useState([]);
  const timerRef = useRef(null);

  /* Riwayat sesi dari database */
  useEffect(() => {
    if (!user || !supabaseConfigured) return;
    supabase
      .from("interview_sessions")
      .select(
        "id, posisi, kategori, jumlah_soal, durasi_detik, skor, created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setRiwayat(data || []));
  }, [user?.id]);

  /* Penghitung durasi sesi */
  useEffect(() => {
    if (tahap !== TAHAP.berlangsung) return;
    timerRef.current = setInterval(() => setDetik((d) => d + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [tahap]);

  const formatDurasi = (d) =>
    `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(d % 60).padStart(2, "0")}`;

  const mulai = () => {
    setDialog([CONTOH_DIALOG[0]]); // MOCK
    setDetik(0);
    setTahap(TAHAP.berlangsung);
  };

  // MOCK: menirukan giliran bicara. Nanti diganti rekaman suara asli →
  // transkripsi → LLM → suara balasan.
  const kirimJawaban = () => {
    setMerekam(false);
    const berikutnya = CONTOH_DIALOG.slice(0, dialog.length + 2);
    setDialog(berikutnya.length > dialog.length ? berikutnya : dialog);
  };

  const akhiri = () => {
    setTahap(TAHAP.selesai);
    clearInterval(timerRef.current);
  };

  const ulangi = () => {
    setTahap(TAHAP.siap);
    setDialog([]);
    setDetik(0);
    setPosisi("");
  };

  /* ---- Gerbang: fitur ini hanya di paket Tiga Bulan ---- */
  if (!langganan.loading && (!langganan.aktif || !langganan.punyaInterview)) {
    const sudahLangganan = langganan.aktif;
    return (
      <div
        style={{
          padding: hp ? "16px 14px" : 28,
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <GerbangFitur
          terbuka={false}
          tinggiMinimal={240}
          judul="Simulasi Interview dengan AI"
          keterangan={
            sudahLangganan
              ? "Fitur ini tersedia di paket Pro dan Max. Berlatih wawancara langsung dengan AI yang bertanya lewat suara, menyesuaikan pertanyaan dengan jawabanmu, lalu memberi penilaian di akhir sesi."
              : "Berlatih wawancara langsung dengan AI yang bertanya lewat suara, menyesuaikan pertanyaan dengan jawabanmu, lalu memberi penilaian di akhir sesi."
          }
          onLangganan={() => setActive?.("paket")}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: hp ? "16px 14px" : 28,
        maxWidth: 780,
        margin: "0 auto",
      }}
    >
      <BilahLangganan
        langganan={langganan}
        onLangganan={() => setActive?.("paket")}
      />

      {/* Penanda mockup — dihapus setelah AI suara tersambung */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 14,
          padding: "10px 13px",
          borderRadius: 12,
          background: "rgba(217,119,6,0.07)",
          border: "1px solid rgba(217,119,6,0.3)",
          fontSize: 11.5,
          color: "#92400E",
          lineHeight: 1.6,
        }}
      >
        <Info size={13} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          <strong>Pratinjau tampilan.</strong> Suara AI belum aktif — dialog di
          bawah masih contoh. Alur dan penyimpanan riwayatnya sudah berfungsi.
        </span>
      </div>

      {/* ============ TAHAP: SIAP ============ */}
      {tahap === TAHAP.siap && (
        <Glass style={{ padding: hp ? 18 : 22, marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginBottom: 5,
            }}
          >
            <Bot size={17} color={T.accent} />
            <span style={{ fontSize: 16, fontWeight: 600, color: T.ink }}>
              Mulai simulasi interview
            </span>
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: T.inkSoft,
              lineHeight: 1.65,
              marginBottom: 16,
            }}
          >
            AI akan berperan sebagai pewawancara. Jawab dengan suara seperti
            wawancara sungguhan — pertanyaan berikutnya menyesuaikan jawabanmu.
          </div>

          <input
            value={posisi}
            onChange={(e) => setPosisi(e.target.value)}
            placeholder="Posisi yang dilamar, mis. HR Generalist"
            style={{
              width: "100%",
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 13.5,
              fontFamily: "'Poppins', sans-serif",
              background: "rgba(255,255,255,0.6)",
              outline: "none",
              color: T.ink,
              boxSizing: "border-box",
              marginBottom: 12,
            }}
          />

          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.inkFaint,
              marginBottom: 7,
              letterSpacing: "0.03em",
            }}
          >
            FOKUS PERTANYAAN
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 16,
            }}
          >
            {KATEGORI_INTERVIEW.map((k) => (
              <button
                key={k.slug}
                onClick={() => setKategori(k.slug)}
                style={{
                  fontSize: 11.5,
                  padding: "6px 12px",
                  borderRadius: 99,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  border: `1px solid ${kategori === k.slug ? T.accent : T.border}`,
                  background:
                    kategori === k.slug
                      ? T.accentSoft
                      : "rgba(255,255,255,0.5)",
                  color: kategori === k.slug ? T.accent : T.inkSoft,
                }}
              >
                {k.namaPendek}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            onClick={mulai}
            disabled={!posisi.trim() || langganan.sisaInterview <= 0}
            style={{ width: "100%" }}
          >
            {langganan.sisaInterview <= 0 ? (
              <>Kuota simulasi habis</>
            ) : (
              <>
                <Play size={15} /> Mulai simulasi
              </>
            )}
          </Button>
          <div
            style={{
              fontSize: 11,
              color: T.inkFaint,
              marginTop: 9,
              textAlign: "center",
            }}
          >
            Memakai 1 kuota simulasi · {langganan.sisaInterview} tersisa
          </div>
        </Glass>
      )}

      {/* ============ TAHAP: BERLANGSUNG ============ */}
      {tahap === TAHAP.berlangsung && (
        <>
          <Glass style={{ padding: hp ? 16 : 20, marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 4,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>
                {posisi}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: T.inkSoft,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                <Clock size={12} /> {formatDurasi(detik)}
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: T.inkFaint }}>
              {dialog.filter((d) => d.dari === "ai").length} pertanyaan diajukan
            </div>
          </Glass>

          {/* Dialog */}
          <div style={{ marginBottom: 14 }}>
            {dialog.map((d, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 12,
                  flexDirection: d.dari === "user" ? "row-reverse" : "row",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 99,
                    flexShrink: 0,
                    background:
                      d.dari === "ai" ? T.accentSoft : "rgba(0,0,0,0.06)",
                    color: d.dari === "ai" ? T.accent : T.inkSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {d.dari === "ai" ? <Bot size={15} /> : <UserIcon size={15} />}
                </div>
                <div
                  style={{
                    maxWidth: "78%",
                    background:
                      d.dari === "ai" ? "rgba(255,255,255,0.75)" : T.accentSoft,
                    border: `1px solid ${d.dari === "ai" ? T.border : "transparent"}`,
                    borderRadius: 14,
                    padding: "11px 14px",
                    fontSize: 13,
                    color: T.ink,
                    lineHeight: 1.6,
                  }}
                >
                  {d.teks}
                  {d.dari === "ai" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 10.5,
                        color: T.inkFaint,
                        marginTop: 7,
                      }}
                    >
                      <Volume2 size={11} /> Diucapkan oleh AI
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Kendali rekam */}
          <Glass style={{ padding: 18, textAlign: "center" }}>
            <button
              onClick={() => (merekam ? kirimJawaban() : setMerekam(true))}
              style={{
                width: 64,
                height: 64,
                borderRadius: 99,
                border: "none",
                cursor: "pointer",
                marginBottom: 10,
                background: merekam ? "#B23A3A" : T.accent,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: merekam
                  ? "0 0 0 8px rgba(178,58,58,0.15)"
                  : "0 4px 16px rgba(79,70,229,0.3)",
                transition: "all .2s",
              }}
            >
              {merekam ? <Square size={22} /> : <Mic size={24} />}
            </button>
            <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 14 }}>
              {merekam
                ? "Merekam — tekan untuk mengirim jawaban"
                : "Tekan untuk mulai menjawab"}
            </div>
            <Button
              variant="outline"
              onClick={akhiri}
              style={{ fontSize: 12.5 }}
            >
              Akhiri sesi
            </Button>
          </Glass>
        </>
      )}

      {/* ============ TAHAP: SELESAI ============ */}
      {tahap === TAHAP.selesai && (
        <>
          <Glass
            style={{
              padding: hp ? 20 : 26,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            <Sparkles size={20} color={T.accent} style={{ marginBottom: 10 }} />
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: T.ink,
                marginBottom: 6,
              }}
            >
              Sesi selesai
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: T.inkSoft,
                lineHeight: 1.65,
                marginBottom: 18,
              }}
            >
              {posisi} · {formatDurasi(detik)} ·{" "}
              {dialog.filter((d) => d.dari === "ai").length} pertanyaan
            </div>

            {/* MOCK: penilaian contoh */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: hp ? 20 : 28,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              {[
                { angka: "78", label: "Skor keseluruhan", warna: "#0F7B4F" },
                {
                  angka: "Baik",
                  label: "Kejelasan",
                  warna: T.ink,
                  kecil: true,
                },
                {
                  angka: "Cukup",
                  label: "Struktur STAR",
                  warna: "#B45309",
                  kecil: true,
                },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontSize: s.kecil ? 15 : 26,
                      fontWeight: 700,
                      color: s.warna,
                      fontFamily: "'Poppins', sans-serif",
                      lineHeight: 1.2,
                    }}
                  >
                    {s.angka}
                  </div>
                  <div
                    style={{ fontSize: 10.5, color: T.inkFaint, marginTop: 3 }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <Button variant="primary" onClick={ulangi}>
              Mulai sesi baru
            </Button>
          </Glass>
        </>
      )}

      {/* ============ RIWAYAT ============ */}
      {tahap === TAHAP.siap && riwayat.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <History size={14} color={T.inkSoft} />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>
              Sesi sebelumnya
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {riwayat.map((r) => (
              <Glass key={r.id} style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Bot size={14} color={T.accent} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: T.ink }}
                    >
                      {r.posisi}
                    </div>
                    <div
                      style={{ fontSize: 11, color: T.inkFaint, marginTop: 2 }}
                    >
                      {new Date(r.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {r.jumlah_soal ? ` · ${r.jumlah_soal} pertanyaan` : ""}
                      {r.skor != null ? ` · skor ${r.skor}` : ""}
                    </div>
                  </div>
                  <ChevronRight
                    size={13}
                    color={T.inkFaint}
                    style={{ flexShrink: 0 }}
                  />
                </div>
              </Glass>
            ))}
          </div>
        </div>
      )}

      {tahap === TAHAP.siap && riwayat.length === 0 && (
        <div
          style={{
            fontSize: 12.5,
            color: T.inkFaint,
            textAlign: "center",
            padding: "20px 18px",
            border: `1px dashed ${T.border}`,
            borderRadius: 14,
            lineHeight: 1.6,
          }}
        >
          Belum ada sesi. Riwayat simulasi kamu akan muncul di sini.
        </div>
      )}
    </div>
  );
}
