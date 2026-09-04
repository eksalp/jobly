import React, { useState, useEffect, useMemo } from "react";
import {
  GraduationCap,
  ExternalLink,
  Loader2,
  Sparkles,
  Info,
  TrendingUp,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { T } from "../../theme";
import { Glass } from "../../components/ui/Glass";
import { Button } from "../../components/ui/Button";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useTeksProfil } from "../../hooks/useTeksProfil";
import { detectCategory } from "../../utils/jobMatching";
import { cocokkanKursus } from "../../data/kursus";

/* ------------------------------------------------------------------ */
/*  Kartu kursus                                                       */
/* ------------------------------------------------------------------ */
function KartuKursus({ k }) {
  return (
    <a
      href={k.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: "12px 14px",
          background: "rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          transition: "border-color .12s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.accent)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            flexShrink: 0,
            background: T.accentSoft,
            color: T.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap size={16} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.ink,
              lineHeight: 1.35,
            }}
          >
            {k.judul}
          </div>
          <div
            style={{
              fontSize: 11,
              color: T.inkFaint,
              marginTop: 2,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span>{k.penyedia}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Clock size={9} /> {k.durasi}
            </span>
            <span>{k.level}</span>
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: k.gratis ? T.teal : T.ink,
            }}
          >
            {k.harga}
          </div>
          <ExternalLink size={11} color={T.inkFaint} style={{ marginTop: 3 }} />
        </div>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  PANEL UTAMA                                                        */
/* ------------------------------------------------------------------ */
export function CareerRecommendationsPanel({ setActive }) {
  const { user } = useAuth();
  const { teks: cvText } = useTeksProfil();
  const [analisis, setAnalisis] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Ambil analisis terbaru — jalur karier dan skill gap datang dari sini */
  useEffect(() => {
    if (!user || !supabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase
      .from("career_analyses")
      .select(
        "arah_karier, arah_karier_alasan, posisi_target, bidang_alternatif, kekurangan, saran_perbaikan, kategori_label, created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setAnalisis(data ?? null);
        setLoading(false);
      });
  }, [user?.id]);

  const kategori = useMemo(
    () =>
      analisis?.kategori_label ??
      (cvText ? detectCategory(cvText)?.label : null),
    [analisis, cvText],
  );

  /* Skill gap: gabungan kekurangan dan saran perbaikan dari AI */
  const skillGap = useMemo(() => {
    const a = analisis?.kekurangan ?? [];
    const b = analisis?.saran_perbaikan ?? [];
    return [...a, ...b];
  }, [analisis]);

  const kursusUtama = useMemo(
    () =>
      cocokkanKursus(
        skillGap.length ? skillGap : [kategori ?? ""],
        kategori,
        3,
      ),
    [skillGap, kategori],
  );

  if (loading) {
    return (
      <div
        style={{
          padding: 28,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: T.inkSoft,
        }}
      >
        <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />{" "}
        Memuat rekomendasi...
      </div>
    );
  }

  /* Belum ada analisis — arahkan ke Analyzer dulu */
  if (!analisis) {
    return (
      <div style={{ padding: 28, maxWidth: 640, margin: "0 auto" }}>
        <Glass style={{ padding: 34, textAlign: "center" }}>
          <TrendingUp
            size={22}
            color={T.inkFaint}
            style={{ marginBottom: 12 }}
          />
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: T.ink,
              marginBottom: 6,
            }}
          >
            Belum ada rekomendasi
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: T.inkSoft,
              lineHeight: 1.65,
              marginBottom: 18,
            }}
          >
            Jalankan analisis CV atau LinkedIn dulu. Dari situ kami bisa
            menentukan arah kariermu dan menyarankan apa yang perlu dipelajari.
          </div>
          <Button variant="primary" onClick={() => setActive?.("overview")}>
            <Sparkles size={14} /> Mulai analisis
          </Button>
        </Glass>
      </div>
    );
  }

  const posisiTarget = analisis.posisi_target ?? [];
  const bidangAlternatif = analisis.bidang_alternatif ?? [];

  return (
    <div
      style={{
        padding: 28,
        maxWidth: 760,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Arah karier */}
      <Glass style={{ padding: 22 }}>
        <div
          style={{
            fontSize: 11.5,
            color: T.accent,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Arah karier kamu
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: T.ink,
            lineHeight: 1.4,
          }}
        >
          {analisis.arah_karier}
        </div>
        {analisis.arah_karier_alasan && (
          <div
            style={{
              fontSize: 12.5,
              color: T.inkSoft,
              lineHeight: 1.65,
              marginTop: 8,
            }}
          >
            {analisis.arah_karier_alasan}
          </div>
        )}

        {posisiTarget.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.inkFaint,
                marginBottom: 7,
                letterSpacing: "0.03em",
              }}
            >
              Posisi yang realistis dilamar sekarang
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {posisiTarget.map((p) => (
                <span
                  key={p}
                  style={{
                    fontSize: 12,
                    background: "rgba(20,184,166,0.1)",
                    color: T.teal,
                    padding: "5px 11px",
                    borderRadius: 99,
                    fontWeight: 600,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </Glass>

      {/* Yang perlu diperkuat + kursus */}
      {skillGap.length > 0 && (
        <Glass style={{ padding: 22 }}>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 600,
              color: T.ink,
              marginBottom: 4,
            }}
          >
            Yang perlu kamu perkuat
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.inkSoft,
              lineHeight: 1.6,
              marginBottom: 14,
            }}
          >
            Diambil dari analisis CV kamu.
          </div>

          <div style={{ marginBottom: 18 }}>
            {skillGap.slice(0, 4).map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  fontSize: 12.5,
                  color: T.ink,
                  lineHeight: 1.6,
                  marginBottom: 7,
                }}
              >
                <span style={{ color: T.accent, flexShrink: 0, marginTop: 1 }}>
                  •
                </span>
                <span>{s}</span>
              </div>
            ))}
          </div>

          {kursusUtama.length > 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <GraduationCap size={14} color={T.inkSoft} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>
                  Kursus yang relevan
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {kursusUtama.map((k) => (
                  <KartuKursus key={k.id} k={k} />
                ))}
              </div>

              {/* Keterbukaan afiliasi.
                  Wajib ditampilkan: sebagian besar program afiliasi mensyaratkannya
                  dalam perjanjian, dan tanpa ini kepercayaan user gampang runtuh
                  begitu mereka menyadarinya sendiri. */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 12,
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.03)",
                  borderRadius: 10,
                  fontSize: 11,
                  color: T.inkFaint,
                  lineHeight: 1.6,
                }}
              >
                <Info size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  Tautan tersebut adalah rekomendasi dari sistem AI Jobly untuk
                  mencari course yang cocok buat kamu!
                </span>
              </div>
            </>
          )}
        </Glass>
      )}

      {/* Bidang alternatif */}
      {bidangAlternatif.length > 0 && (
        <Glass style={{ padding: 22 }}>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 600,
              color: T.ink,
              marginBottom: 4,
            }}
          >
            Bidang lain yang masih terjangkau
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.inkSoft,
              lineHeight: 1.6,
              marginBottom: 14,
            }}
          >
            Bisa dimasuki dengan bekal yang sudah kamu punya sekarang.
          </div>

          {bidangAlternatif.map((b) => {
            const kursusBidang = cocokkanKursus(
              [b.bidang, b.alasan],
              b.bidang,
              2,
            );
            return (
              <div key={b.bidang} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <BadgeCheck size={13} color={T.teal} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
                    {b.bidang}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.inkSoft,
                    lineHeight: 1.6,
                    marginBottom: 9,
                    paddingLeft: 19,
                  }}
                >
                  {b.alasan}
                </div>
                {kursusBidang.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 7,
                      paddingLeft: 19,
                    }}
                  >
                    {kursusBidang.map((k) => (
                      <KartuKursus key={k.id} k={k} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </Glass>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
