import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  Check,
  AlertTriangle,
  Clock,
  GraduationCap,
  ExternalLink,
  Info,
  Target,
  TrendingUp,
  History,
} from "lucide-react";
import { T } from "../../theme";
import { Glass } from "../../components/ui/Glass";
import { Button } from "../../components/ui/Button";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useTeksProfil } from "../../hooks/useTeksProfil";
import { useLangganan } from "../../hooks/useLangganan";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { GerbangFitur, BilahLangganan } from "../../components/GerbangFitur";
import { detectCategory } from "../../utils/jobMatching";
import { cocokkanKursus } from "../../data/kursus";
import { TAXONOMY } from "../../data/taxonomy";

const KESULITAN = {
  mudah: { label: "Relatif mudah", warna: "#0F7B4F" },
  sedang: { label: "Sedang", warna: "#B45309" },
  sulit: { label: "Menantang", warna: "#B23A3A" },
};

const PRIORITAS = {
  wajib: { label: "Wajib", warna: "#B23A3A" },
  penting: { label: "Penting", warna: "#B45309" },
  "nilai tambah": { label: "Nilai tambah", warna: "#8891A8" },
};

// Gaya teks justify yang dipakai berulang
const justifyText = {
  textAlign: "justify",
  hyphens: "auto",
};

function normalisasiHasil(h) {
  if (typeof h === "string") {
    try {
      h = JSON.parse(h);
    } catch {
      return null;
    }
  }
  if (!h || typeof h !== "object" || Array.isArray(h)) return null;
  return {
    ...h,
    skill_transfer: Array.isArray(h.skill_transfer) ? h.skill_transfer : [],
    skill_kurang: Array.isArray(h.skill_kurang) ? h.skill_kurang : [],
    tahapan: Array.isArray(h.tahapan) ? h.tahapan : [],
    posisi_masuk: Array.isArray(h.posisi_masuk) ? h.posisi_masuk : [],
    risiko: Array.isArray(h.risiko) ? h.risiko : [],
  };
}

export function PindahKarierPanel({ setActive }) {
  const { user } = useAuth();
  const {
    teks: cvText,
    sumber: sumberProfil,
    loading: loadingProfil,
    ada: adaProfil,
  } = useTeksProfil();
  const langganan = useLangganan();
  const hp = useLayarKecil(600);

  const [tujuan, setTujuan] = useState("");
  const [loading, setLoading] = useState(false);
  const [galat, setGalat] = useState("");
  const [hasil, setHasil] = useState(null);
  const [riwayat, setRiwayat] = useState([]);

  const bidangAsal = cvText ? detectCategory(cvText)?.label : null;

  useEffect(() => {
    if (!user || !supabaseConfigured) return;
    supabase
      .from("career_switches")
      .select("id, bidang_tujuan, hasil, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setRiwayat(data || []));
  }, [user?.id]);

  const analisis = async () => {
    if (!tujuan.trim()) {
      setGalat("Pilih atau tulis bidang yang ingin kamu tuju.");
      return;
    }
    if (!adaProfil) {
      setGalat(
        "Belum ada data profil. Isi CV kamu di CV Builder, atau jalankan " +
          "analisis di halaman Cari Arah Karier dulu.",
      );
      return;
    }
    setLoading(true);
    setGalat("");

    try {
      const batasWaktu = new Promise((_, tolak) =>
        setTimeout(
          () =>
            tolak(new Error("Permintaan terlalu lama. Coba lagi sebentar.")),
          100000,
        ),
      );

      const { data, error } = await Promise.race([
        supabase.functions.invoke("analisis-pindah-karier", {
          body: { cvText, bidangTujuan: tujuan },
        }),
        batasWaktu,
      ]);

      if (error) {
        let pesan = error.message;
        let mentah = "";
        try {
          mentah = (await error.context?.text?.()) ?? "";
          const body = mentah ? JSON.parse(mentah) : null;
          if (body?.error) pesan = body.error;
        } catch {
          if (mentah) pesan = mentah.slice(0, 300);
        }
        let detail = "";
        try {
          detail = JSON.parse(mentah)?.detail ?? "";
        } catch {
          /* abaikan */
        }
        console.error(
          `[pindah-karier] status=${error.context?.status} | ` +
            `pesan="${pesan}" | detail="${detail || "(kosong)"}"`,
        );
        throw new Error(pesan);
      }
      if (data?.error) throw new Error(data.error);

      setHasil(normalisasiHasil(data));
      langganan.refresh();
      setRiwayat((r) => [
        {
          id: "baru",
          bidang_tujuan: data.bidang_tujuan,
          hasil: data,
          created_at: new Date().toISOString(),
        },
        ...r,
      ]);
    } catch (e) {
      setGalat(e?.message || "Analisis gagal.");
    } finally {
      setLoading(false);
    }
  };

  const kursusUntuk = (skill) => cocokkanKursus([skill], tujuan, 2);

  /* ---- Belum berlangganan ---- */
  if (!langganan.loading && !langganan.aktif) {
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
          judul="Rencana Pindah Karier"
          keterangan="AI menilai keahlian mana dari pengalamanmu sekarang yang masih terpakai di bidang tujuan, apa yang perlu dipelajari, dan berapa lama waktunya. Termasuk penilaian jujur soal risikonya."
          onLangganan={() => setActive?.("paket")}
        />
      </div>
    );
  }

  const pad = hp ? "14px 14px" : "28px";

  return (
    <div
      style={{
        padding: pad,
        maxWidth: 780,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <BilahLangganan
        langganan={langganan}
        onLangganan={() => setActive?.("paket")}
      />

      {/* ── Form ── */}
      <Glass style={{ padding: hp ? 18 : 22, marginBottom: 16 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: T.ink,
            marginBottom: 5,
          }}
        >
          Mau pindah ke bidang apa?
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: T.inkSoft,
            lineHeight: 1.65,
            marginBottom: 16,
            ...justifyText,
          }}
        >
          {bidangAsal ? (
            <>
              Bidangmu sekarang terdeteksi sebagai <strong>{bidangAsal}</strong>
              . Pilih tujuanmu, nanti dinilai apa yang bisa dibawa dan apa yang
              perlu dikejar.
            </>
          ) : (
            "Isi dulu CV kamu di CV Builder, atau jalankan analisis di halaman Cari Arah Karier."
          )}
        </div>

        {adaProfil && sumberProfil !== "sesi" && (
          <div
            style={{
              fontSize: 11.5,
              color: T.inkFaint,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Info size={11} style={{ flexShrink: 0 }} />
            {sumberProfil === "cv_builder"
              ? "Memakai CV yang tersimpan di CV Builder."
              : "Memakai data dari analisis terakhir kamu."}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 12,
          }}
        >
          {TAXONOMY.filter((c) => c.label !== bidangAsal).map((c) => (
            <button
              key={c.label}
              onClick={() => setTujuan(c.label)}
              style={{
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 99,
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                border: `1px solid ${tujuan === c.label ? T.accent : T.border}`,
                background:
                  tujuan === c.label ? T.accentSoft : "rgba(255,255,255,0.5)",
                color: tujuan === c.label ? T.accent : T.inkSoft,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <input
          value={tujuan}
          onChange={(e) => setTujuan(e.target.value)}
          placeholder="Atau tulis sendiri, misal: UX Researcher, Product Manager..."
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
            marginBottom: 14,
          }}
        />

        {galat && (
          <div
            style={{
              fontSize: 12.5,
              color: "#B23A3A",
              marginBottom: 12,
              lineHeight: 1.55,
            }}
          >
            {galat}
          </div>
        )}

        <Button
          variant="primary"
          onClick={analisis}
          disabled={loading || langganan.sisaAnalisis <= 0}
          style={{ width: "100%" }}
        >
          {loading ? (
            <>
              <Loader2
                size={15}
                style={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Menilai kelayakan, bisa sampai 1 menit...
            </>
          ) : langganan.sisaAnalisis <= 0 ? (
            <>Kuota analisis habis</>
          ) : (
            <>
              Nilai kelayakan pindah <ArrowRight size={15} />
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
          Memakai 1 kuota analisis · {langganan.sisaAnalisis} tersisa
        </div>
      </Glass>

      {/* ── Hasil ── */}
      {hasil && (
        <>
          {/* Tombol kembali */}
          <button
            onClick={() => {
              setHasil(null);
              setGalat("");
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              color: T.inkSoft,
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 12,
              padding: 0,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            ← Kembali ke riwayat
          </button>

          {/* Ringkasan */}
          <Glass style={{ padding: hp ? 18 : 22, marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 12.5, color: T.inkSoft }}>
                {bidangAsal}
              </span>
              <ArrowRight size={13} color={T.inkFaint} />
              <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>
                {hasil.bidang_tujuan}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: hp ? 16 : 24,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  angka: `${hasil.peluang_persen}%`,
                  label: "Peluang berhasil",
                  warna:
                    hasil.peluang_persen >= 65
                      ? "#0F7B4F"
                      : hasil.peluang_persen >= 40
                        ? "#B45309"
                        : "#B23A3A",
                },
                {
                  angka: `${hasil.estimasi_bulan} bln`,
                  label: "Perkiraan waktu",
                  warna: T.ink,
                },
                {
                  angka: KESULITAN[hasil.tingkat_kesulitan]?.label,
                  label: "Tingkat kesulitan",
                  warna: KESULITAN[hasil.tingkat_kesulitan]?.warna,
                  kecil: true,
                },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontSize: s.kecil ? 14 : 22,
                      fontWeight: 700,
                      color: s.warna,
                      fontFamily: "'Poppins', sans-serif",
                      lineHeight: 1.2,
                    }}
                  >
                    {s.angka}
                  </div>
                  <div
                    style={{ fontSize: 10.5, color: T.inkFaint, marginTop: 2 }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: 13,
                color: T.ink,
                lineHeight: 1.7,
                ...justifyText,
              }}
            >
              {hasil.ringkasan}
            </div>

            {hasil.skill_transfer.length === 0 &&
              hasil.skill_kurang.length === 0 &&
              hasil.tahapan.length === 0 &&
              !hasil.ringkasan && (
                <div
                  style={{
                    fontSize: 12.5,
                    color: T.inkSoft,
                    marginTop: 8,
                    lineHeight: 1.6,
                  }}
                >
                  Data analisis ini tidak lengkap atau formatnya berbeda. Coba
                  jalankan analisis ulang untuk mendapatkan hasil terbaru.
                </div>
              )}
          </Glass>

          {/* Yang sudah kamu bawa */}
          {hasil.skill_transfer.length > 0 && (
            <Glass style={{ padding: hp ? 18 : 22, marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 4,
                }}
              >
                <Check size={15} color={T.teal} />
                <span style={{ fontSize: 14.5, fontWeight: 600, color: T.ink }}>
                  Yang sudah kamu bawa
                </span>
              </div>
              <div style={{ fontSize: 12, color: T.inkSoft, marginBottom: 14 }}>
                Keahlian dari pengalamanmu sekarang yang tetap terpakai di
                bidang tujuan.
              </div>

              {hasil.skill_transfer.map((s, i) => (
                <div
                  key={i}
                  style={{
                    paddingLeft: 12,
                    borderLeft: "2.5px solid rgba(20,184,166,0.35)",
                    marginBottom: i < hasil.skill_transfer.length - 1 ? 13 : 0,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
                    {s.skill}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: T.inkSoft,
                      lineHeight: 1.65,
                      marginTop: 4,
                      ...justifyText,
                    }}
                  >
                    {s.kenapa_berguna}
                  </div>
                </div>
              ))}
            </Glass>
          )}

          {/* Yang perlu dikejar */}
          {hasil.skill_kurang.length > 0 && (
            <Glass style={{ padding: hp ? 18 : 22, marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 14,
                }}
              >
                Yang perlu kamu kejar
              </div>

              {hasil.skill_kurang.map((s, i) => {
                const p = PRIORITAS[s.prioritas] ?? PRIORITAS.penting;
                const kursus = kursusUntuk(s.skill);
                return (
                  <div
                    key={i}
                    style={{
                      marginBottom: i < hasil.skill_kurang.length - 1 ? 18 : 0,
                      paddingBottom: i < hasil.skill_kurang.length - 1 ? 18 : 0,
                      borderBottom:
                        i < hasil.skill_kurang.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 5,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{ fontSize: 13, fontWeight: 600, color: T.ink }}
                      >
                        {s.skill}
                      </span>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: p.warna,
                          background: `${p.warna}14`,
                          padding: "2px 7px",
                          borderRadius: 99,
                        }}
                      >
                        {p.label}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: T.inkSoft,
                        lineHeight: 1.65,
                        marginBottom: kursus.length ? 10 : 0,
                        ...justifyText,
                      }}
                    >
                      {s.cara_belajar}
                    </div>

                    {kursus.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        {kursus.map((k) => (
                          <a
                            key={k.id}
                            href={k.url}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            style={{ textDecoration: "none" }}
                          >
                            <div
                              style={{
                                border: `1px solid ${T.border}`,
                                borderRadius: 10,
                                padding: "9px 12px",
                                background: "rgba(255,255,255,0.5)",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <GraduationCap
                                size={13}
                                color={T.accent}
                                style={{ flexShrink: 0 }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: T.ink,
                                  }}
                                >
                                  {k.judul}
                                </div>
                                <div
                                  style={{ fontSize: 10.5, color: T.inkFaint }}
                                >
                                  {k.penyedia} · {k.durasi}
                                </div>
                              </div>
                              <span
                                style={{
                                  fontSize: 11.5,
                                  fontWeight: 600,
                                  color: k.gratis ? T.teal : T.ink,
                                  flexShrink: 0,
                                }}
                              >
                                {k.harga}
                              </span>
                              <ExternalLink
                                size={10}
                                color={T.inkFaint}
                                style={{ flexShrink: 0 }}
                              />
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 14,
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
                  Sebagian tautan kursus adalah tautan afiliasi. Kami menerima
                  komisi tanpa biaya tambahan untukmu, dan rekomendasinya
                  disusun berdasarkan kecocokan dengan kebutuhanmu.
                </span>
              </div>
            </Glass>
          )}

          {/* Tahapan */}
          {hasil.tahapan.length > 0 && (
            <Glass style={{ padding: hp ? 18 : 22, marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 16,
                }}
              >
                Tahapan yang disarankan
              </div>
              {hasil.tahapan.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 13,
                    marginBottom: i < hasil.tahapan.length - 1 ? 16 : 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 99,
                        background: T.accentSoft,
                        color: T.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </div>
                    {i < hasil.tahapan.length - 1 && (
                      <div
                        style={{
                          width: 1.5,
                          flex: 1,
                          background: T.border,
                          marginTop: 5,
                          minHeight: 22,
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{ fontSize: 13, fontWeight: 600, color: T.ink }}
                      >
                        {t.fase}
                      </span>
                      <span style={{ fontSize: 11, color: T.inkFaint }}>
                        {t.durasi}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: T.inkSoft,
                        lineHeight: 1.65,
                        marginTop: 4,
                        ...justifyText,
                      }}
                    >
                      {t.fokus}
                    </div>
                  </div>
                </div>
              ))}
            </Glass>
          )}

          {/* Posisi masuk */}
          {hasil.posisi_masuk.length > 0 && (
            <Glass style={{ padding: hp ? 18 : 22, marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 4,
                }}
              >
                Posisi yang bisa kamu incar
              </div>
              <div style={{ fontSize: 12, color: T.inkSoft, marginBottom: 14 }}>
                Setelah kekurangan wajib terpenuhi.
              </div>
              {hasil.posisi_masuk.map((p, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: i < hasil.posisi_masuk.length - 1 ? 14 : 0,
                    paddingBottom: i < hasil.posisi_masuk.length - 1 ? 14 : 0,
                    borderBottom:
                      i < hasil.posisi_masuk.length - 1
                        ? `1px solid ${T.border}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      flexWrap: "wrap",
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{ fontSize: 13, fontWeight: 600, color: T.ink }}
                    >
                      {p.jabatan}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: T.accent,
                        background: T.accentSoft,
                        padding: "2px 7px",
                        borderRadius: 99,
                      }}
                    >
                      {p.level}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: T.inkSoft,
                      lineHeight: 1.65,
                      ...justifyText,
                    }}
                  >
                    {p.alasan}
                  </div>
                </div>
              ))}
            </Glass>
          )}

          {/* Risiko */}
          {(hasil.risiko.length > 0 || hasil.saran_jujur) && (
            <Glass
              style={{
                padding: hp ? 18 : 22,
                border: "1px solid rgba(217,119,6,0.35)",
                background: "rgba(217,119,6,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 12,
                }}
              >
                <AlertTriangle size={15} color="#B45309" />
                <span style={{ fontSize: 14.5, fontWeight: 600, color: T.ink }}>
                  Yang perlu kamu pertimbangkan
                </span>
              </div>

              {hasil.risiko.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    fontSize: 12.5,
                    color: T.ink,
                    lineHeight: 1.65,
                    marginBottom: 9,
                  }}
                >
                  <span
                    style={{
                      color: "#B45309",
                      flexShrink: 0,
                      marginTop: 2,
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    •
                  </span>
                  <span style={{ flex: 1, minWidth: 0, ...justifyText }}>
                    {r}
                  </span>
                </div>
              ))}

              {hasil.saran_jujur && (
                <div
                  style={{
                    fontSize: 12.5,
                    color: T.ink,
                    lineHeight: 1.7,
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(217,119,6,0.25)",
                    ...justifyText,
                  }}
                >
                  {hasil.saran_jujur}
                </div>
              )}
            </Glass>
          )}
        </>
      )}

      {/* ── Riwayat ── */}
      {!hasil && riwayat.length > 0 && (
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
              Analisis sebelumnya
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {riwayat.map((r) => (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const h = normalisasiHasil(r.hasil);
                  if (!h) {
                    setGalat(
                      "Data analisis lama tidak lengkap atau kosong. " +
                        "Coba jalankan analisis ulang untuk bidang ini.",
                    );
                    return;
                  }
                  setGalat("");
                  setTujuan(r.bidang_tujuan);
                  setHasil(h);
                }}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
              >
                <Glass style={{ padding: 14 }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <TrendingUp
                      size={14}
                      color={T.accent}
                      style={{ flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ fontSize: 13, fontWeight: 600, color: T.ink }}
                      >
                        {r.bidang_tujuan}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.inkFaint,
                          marginTop: 2,
                        }}
                      >
                        {new Date(r.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {r.hasil?.peluang_persen != null &&
                          ` · peluang ${r.hasil.peluang_persen}%`}
                      </div>
                    </div>
                    <ArrowRight
                      size={13}
                      color={T.inkFaint}
                      style={{ flexShrink: 0 }}
                    />
                  </div>
                </Glass>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
