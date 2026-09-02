import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Sparkles,
  Check,
  ChevronRight,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { T } from "../../theme";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useJobs } from "../../context/JobsContext";
import { useUserProfile } from "../../context/UserProfileContext";
import { useAuth } from "../../context/AuthContext";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { useAnalysisHistory } from "../../hooks/useAnalysisHistory";
import { useLangganan } from "../../hooks/useLangganan";
import { BilahLangganan } from "../../components/GerbangFitur";
import {
  rankJobs,
  detectCategory,
  lengkapiKecocokan,
} from "../../utils/jobMatching";
import { bacaDokumen, FORMAT_DITERIMA } from "../../utils/bacaDokumen";
import { Glass } from "../../components/ui/Glass";
import { Button } from "../../components/ui/Button";
import { JobRow } from "../../components/JobRow";
import { Section } from "../../components/Section";
import DataSourceBanner from "../../components/DataSourceBanner";

// Kartu audit — menampilkan skor + daftar masalah & perbaikannya
function AuditCard({ judul, skor, masalah }) {
  const warna = skor >= 75 ? T.teal : skor >= 50 ? "#D97706" : "#B23A3A";
  return (
    <Glass style={{ padding: 22, marginTop: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 15, color: T.ink }}>
          {judul}
        </div>
        {typeof skor === "number" && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: warna,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {skor}
            </span>
            <span style={{ fontSize: 12, color: T.inkFaint }}>/100</span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(masalah || []).map((m, i) => (
          <div
            key={i}
            style={{
              borderLeft: `2.5px solid ${T.accentSoft}`,
              paddingLeft: 12,
            }}
          >
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: T.accent,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 4,
              }}
            >
              {m.bagian}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: T.inkSoft,
                lineHeight: 1.55,
                marginBottom: 5,
              }}
            >
              <AlertCircle
                size={11}
                style={{ verticalAlign: -1, marginRight: 5, color: "#D97706" }}
              />
              {m.masalah}
            </div>
            <div style={{ fontSize: 12.5, color: T.ink, lineHeight: 1.55 }}>
              <Sparkles
                size={11}
                style={{ verticalAlign: -1, marginRight: 5, color: T.teal }}
              />
              {m.perbaikan}
            </div>
          </div>
        ))}
      </div>
    </Glass>
  );
}

// Berapa loker yang boleh dilihat tanpa membayar
const LOKER_GRATIS = 3;

export function AnalyzerPanel({ setActive }) {
  // Baris terkunci berisi teks tersamar, bukan data loker asli.
  // Data asli tidak pernah dikirim ke browser sebelum pembayaran,
  // jadi menghapus blur lewat DevTools tidak membocorkan apa pun.
  const BARIS_TERKUNCI = [
    {
      id: "_k1",
      posisi: "██████ ██████████ ██████",
      perusahaan: "██████████",
      lokasi: "██████",
      gaji: "████",
    },
    {
      id: "_k2",
      posisi: "████ ███████ - ██████████",
      perusahaan: "████████",
      lokasi: "██████",
      gaji: "████",
    },
    {
      id: "_k3",
      posisi: "██ ████████ ███ ████",
      perusahaan: "██████",
      lokasi: "███████",
      gaji: "████",
    },
    {
      id: "_k4",
      posisi: "██████████ ████████ - ███████",
      perusahaan: "█████████",
      lokasi: "████",
      gaji: "████",
    },
    {
      id: "_k5",
      posisi: "████████ ██████████ ████",
      perusahaan: "███ █████",
      lokasi: "█████████",
      gaji: "████",
    },
  ];

  // Pindah panel. Kalau prop setActive tidak diteruskan (DashboardPage versi lama),
  // jatuh ke event global yang didengarkan DashboardPage.
  const pergiKe = (panel) => {
    if (typeof setActive === "function") {
      setActive(panel);
      return;
    }
    window.dispatchEvent(new CustomEvent("jf:navigate", { detail: panel }));
  };

  const { jobs, loading: jobsLoading } = useJobs();
  const { cvText: text, setCvText: setText } = useUserProfile();
  const { user } = useAuth();
  const langganan = useLangganan();
  const { isSaved, toggleSave } = useSavedJobs();
  const {
    history,
    loading: historyLoading,
    saveAnalysis,
    deleteAnalysis,
  } = useAnalysisHistory();

  const [fileName, setFileName] = useState("");
  const [bacaProgres, setBacaProgres] = useState("");
  const [bacaGalat, setBacaGalat] = useState("");
  const [freeResult, setFreeResult] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [sourceType, setSourceType] = useState("cv"); // "cv" | "linkedin"
  const [orderTerakhir, setOrderTerakhir] = useState(null);

  const [bolehCobaLagi, setBolehCobaLagi] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setBacaGalat("");
    setBacaProgres("Membaca berkas...");

    try {
      const teks = await bacaDokumen(file, (hal, total) => {
        if (total > 1)
          setBacaProgres(`Membaca halaman ${hal} dari ${total}...`);
      });
      setText(teks);
      setBacaProgres("");
    } catch (err) {
      setBacaProgres("");
      setBacaGalat(err?.message || "Gagal membaca berkas.");
      setFileName("");
    } finally {
      // Reset supaya berkas yang sama bisa dipilih ulang setelah gagal
      e.target.value = "";
    }
  };

  // Loker menyusul: begitu katalog selesai dimuat, hasil pencocokan
  // diisikan ke tampilan tanpa mengganggu analisis yang sudah berjalan.
  useEffect(() => {
    if (!freeResult || freeResult.ranked.length > 0 || jobs.length === 0)
      return;
    const allRanked = lengkapiKecocokan(
      rankJobs(jobs, text, jobs.length, freeResult.cat),
    );
    setFreeResult((prev) => ({
      ...prev,
      ranked: allRanked,
      matchCount: allRanked.length,
    }));
  }, [jobs, freeResult?.cat]);

  const runFree = () => {
    if (text.trim().length < 30) return;
    const cat = detectCategory(text);
    // Pencocokan loker dilewati kalau datanya belum siap. Analisis CV tidak
    // bergantung padanya, jadi user tidak perlu menunggu katalog selesai dimuat —
    // daftar lokernya menyusul sendiri lewat efek di bawah.
    const allRanked = jobs.length
      ? lengkapiKecocokan(rankJobs(jobs, text, jobs.length, cat))
      : [];
    const matchCount = allRanked.length;
    // Simpan semua yang cocok — pencocokan ini gratis, tidak ada alasan dikunci
    setFreeResult({ cat, ranked: allRanked, matchCount });
    setUnlocked(false);
    setAiResult(null);
    setAiError("");
  };

  // Menjalankan analisis. Kuota diperiksa dan dikurangi di SERVER —
  // pemeriksaan di sini hanya menentukan tampilan tombol.
  const mulaiAnalisis = () => {
    if (!langganan.aktif || langganan.sisaAnalisis <= 0) {
      pergiKe("paket");
      return;
    }
    runAiAnalysis(null);
  };

  // Langkah 2: setelah bayar sukses, minta hasil analisis dari server
  // Loker TIDAK pernah ada di client — semua diproses di Edge Function
  const runAiAnalysis = async (orderId) => {
    setAiLoading(true);
    setAiError("");
    setBolehCobaLagi(false);
    setOrderTerakhir(orderId);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "get-paid-analysis",
        {
          body: { orderId, cvText: text, sourceType },
        },
      );

      // supabase-js melempar FunctionsHttpError untuk status non-2xx dan
      // mengosongkan `data`. Pesan aslinya ada di error.context (objek Response),
      // jadi body-nya harus dibaca manual — kalau tidak, yang terlihat user
      // hanya "Edge Function returned a non-2xx status code" yang tidak berguna.
      if (fnError) {
        let pesan = fnError.message;
        try {
          const body = await fnError.context?.json?.();
          if (body?.error) {
            pesan = body.error;
            setBolehCobaLagi(Boolean(body.bolehCobaLagi));
          }
        } catch {
          /* body bukan JSON — pakai pesan bawaan */
        }
        console.error("get-paid-analysis gagal:", pesan);
        throw new Error(pesan);
      }

      if (data?.error) {
        setBolehCobaLagi(Boolean(data.bolehCobaLagi));
        throw new Error(data.error);
      }
      if (!data?.arah_karier)
        throw new Error("Hasil analisis kosong. Coba lagi.");

      console.log("Analisis selesai lewat:", data._penyedia);

      setAiResult(data);
      setUnlocked(true);
      langganan.refresh(); // sisa kuota di sidebar ikut turun

      // Simpan ke riwayat supaya hasilnya bisa dilihat lagi nanti.
      // Kegagalan menyimpan tidak boleh membatalkan analisis yang sudah jadi,
      // jadi errornya cukup dicatat di console.
      try {
        await saveAnalysis({
          arah_karier: data.arah_karier,
          arah_karier_alasan: data.arah_karier_alasan,
          posisi_target: data.posisi_target,
          bidang_alternatif: data.bidang_alternatif,
          kategori_label: freeResult?.cat?.label || "",
          kekuatan: data.kekuatan,
          kekurangan: data.kekurangan,
          saran_perbaikan: data.saran_perbaikan,
          job_ranking: (freeResult?.ranked || []).slice(0, 8).map((j) => ({
            id: j.id,
            posisi: j.posisi,
            perusahaan: j.perusahaan,
            skor: j.persen,
            alasan: (j.alasanTerms || []).join(", "),
          })),
          cv_snapshot: text.slice(0, 2000),
          cv_draft: data.cv_draft,
          linkedin_draft: data.linkedin_draft,
          cv_draft_en: data.cv_draft_en,
          linkedin_draft_en: data.linkedin_draft_en,
          source_type: sourceType,
        });
      } catch (e) {
        console.error("Gagal menyimpan riwayat:", e);
      }
    } catch (err) {
      setAiError(err?.message || "Analisis gagal diproses.");
    } finally {
      setAiLoading(false);
    }
  };

  // Analisis ulang tanpa bayar lagi — pembayaran tetap tercatat 'paid' di server
  const cobaLagi = () => runAiAnalysis(orderTerakhir);

  const sisaTerkunci = freeResult
    ? Math.max(0, freeResult.matchCount - LOKER_GRATIS)
    : 0;

  const isPaymentBusy = aiLoading;

  const labelTombol = () => {
    if (aiLoading)
      return (
        <>
          <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />{" "}
          Menganalisis CV...
        </>
      );
    if (!langganan.aktif)
      return (
        <>
          Lihat paket langganan <ChevronRight size={15} />
        </>
      );
    if (langganan.sisaAnalisis <= 0)
      return (
        <>
          Kuota habis — tambah paket <ChevronRight size={15} />
        </>
      );
    return (
      <>
        Analisis Lengkap dengan AI <ChevronRight size={15} />
      </>
    );
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 840, margin: "0 auto" }}>
      {/* Banner sumber data hanya relevan buat yang belum berlangganan,
          karena cuma mereka yang melihat daftar loker di halaman ini. */}
      {!langganan.aktif && <DataSourceBanner />}
      <BilahLangganan
        langganan={langganan}
        onLangganan={() => pergiKe("paket")}
      />

      {/* Upload / paste CV */}
      <Glass style={{ padding: 24, marginBottom: 20 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: T.ink,
            marginBottom: 4,
          }}
        >
          Upload atau paste CV / profil LinkedIn
        </div>
        <div style={{ fontSize: 13, color: T.inkSoft, marginBottom: 14 }}>
          Langsung ketahuan arah kariermu dan loker yang cocok.
        </div>

        {/* Toggle: ini CV atau salinan LinkedIn? */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 14,
            background: "rgba(0,0,0,0.04)",
            padding: 4,
            borderRadius: 12,
            width: "fit-content",
          }}
        >
          {[
            { key: "cv", label: "Ini CV saya" },
            { key: "linkedin", label: "Ini profil LinkedIn" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSourceType(opt.key)}
              style={{
                padding: "6px 14px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                background: sourceType === opt.key ? "#fff" : "transparent",
                color: sourceType === opt.key ? T.accent : T.inkSoft,
                boxShadow:
                  sourceType === opt.key
                    ? "0 1px 4px rgba(0,0,0,0.12)"
                    : "none",
                transition: "all .15s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div
          onClick={() => fileRef.current.click()}
          style={{
            border: `1.5px dashed ${T.border}`,
            borderRadius: 14,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            marginBottom: 12,
            background: "rgba(255,255,255,0.4)",
          }}
        >
          {bacaProgres ? (
            <Loader2
              size={16}
              color={T.accent}
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : (
            <Upload size={16} color={T.inkFaint} />
          )}
          <span
            style={{ fontSize: 13.5, color: fileName ? T.ink : T.inkFaint }}
          >
            {bacaProgres || fileName || "Pilih file PDF, DOCX, atau TXT"}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept={FORMAT_DITERIMA}
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </div>
        {bacaGalat && (
          <div
            style={{
              fontSize: 12.5,
              color: "#92400E",
              lineHeight: 1.6,
              background: "rgba(217,119,6,0.07)",
              border: "1px solid rgba(217,119,6,0.3)",
              borderRadius: 12,
              padding: "10px 13px",
              marginBottom: 12,
            }}
          >
            {bacaGalat}
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Atau tempel teks CV / LinkedIn kamu di sini..."
          rows={6}
          style={{
            width: "100%",
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: 14,
            fontSize: 13.5,
            fontFamily: "'Poppins', sans-serif",
            resize: "vertical",
            outline: "none",
            color: T.ink,
            background: "rgba(255,255,255,0.5)",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <span style={{ fontSize: 12, color: T.inkFaint }}>
            {text.length} karakter
          </span>
          <Button
            variant="primary"
            onClick={runFree}
            disabled={text.trim().length < 30}
          >
            Analisis Gratis <Sparkles size={15} />
          </Button>
        </div>
      </Glass>

      {freeResult && (
        <>
          {/* Arah karier — versi gratis memakai deteksi kata kunci,
              versi berbayar memakai analisis AI yang jauh lebih spesifik. */}
          <Glass
            style={{
              padding: 22,
              marginBottom: 16,
              border: unlocked ? `1.5px solid ${T.teal}` : undefined,
            }}
          >
            <div
              style={{
                fontSize: 11.5,
                color: unlocked ? T.teal : T.accent,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {unlocked && <Sparkles size={12} />}
              {unlocked
                ? "Arah karier menurut analisis AI"
                : "Arah karier terdeteksi"}
            </div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: unlocked ? 17 : 19,
                color: T.ink,
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              {unlocked && aiResult?.arah_karier
                ? aiResult.arah_karier
                : freeResult.cat.label}
            </div>

            {unlocked && aiResult?.arah_karier_alasan && (
              <div
                style={{
                  fontSize: 12.5,
                  color: T.inkSoft,
                  lineHeight: 1.65,
                  marginTop: 8,
                }}
              >
                {aiResult.arah_karier_alasan}
              </div>
            )}

            {unlocked && aiResult?.posisi_target?.length > 0 && (
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
                  Posisi yang realistis kamu lamar sekarang
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {aiResult.posisi_target.map((p) => (
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

            {unlocked && aiResult?.bidang_alternatif?.length > 0 && (
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.inkFaint,
                    marginBottom: 8,
                    letterSpacing: "0.03em",
                  }}
                >
                  Bidang lain yang masih terjangkau
                </div>
                {aiResult.bidang_alternatif.map((b) => (
                  <div key={b.bidang} style={{ marginBottom: 7 }}>
                    <span
                      style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}
                    >
                      {b.bidang}
                    </span>
                    <span style={{ fontSize: 12, color: T.inkSoft }}>
                      {" "}
                      — {b.alasan}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {freeResult.cat.hits.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {freeResult.cat.hits.slice(0, 6).map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: 11,
                      fontFamily: "'IBM Plex Mono', monospace",
                      background: T.accentSoft,
                      color: T.accent,
                      padding: "3px 9px",
                      borderRadius: 99,
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}
          </Glass>

          {/* Daftar loker — HANYA untuk yang belum berlangganan.
              Pelanggan sudah punya akses penuh di Job Finder, jadi
              menampilkannya lagi di sini cuma mengalihkan perhatian
              dari hasil analisis. */}
          {!langganan.aktif && (
            <>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14.5,
                  color: T.ink,
                  marginBottom: 10,
                }}
              >
                {jobsLoading && freeResult.matchCount === 0
                  ? "Mencocokkan loker..."
                  : `${freeResult.matchCount} loker cocok dengan CV kamu`}
                {sisaTerkunci > 0 && (
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: 12,
                      color: T.inkFaint,
                      marginLeft: 8,
                    }}
                  >
                    {LOKER_GRATIS} terbuka · {sisaTerkunci} terkunci
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {jobsLoading && freeResult.matchCount === 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 12.5,
                      color: T.inkSoft,
                      padding: "16px 18px",
                      border: `1px dashed ${T.border}`,
                      borderRadius: 12,
                    }}
                  >
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    Memuat daftar loker — kamu tetap bisa lanjut ke analisis
                    lengkap.
                  </div>
                )}

                {freeResult.ranked.slice(0, LOKER_GRATIS).map((j) => (
                  <JobRow
                    key={j.id}
                    job={{
                      ...j,
                      alasan: `${j.persen}% cocok — bidang ${j.kategoriLoker || "serupa"}${j.alasanTerms.length ? ` · ${j.alasanTerms.join(", ")}` : ""}`,
                    }}
                    locked={false}
                    saved={isSaved(j.id)}
                    onToggleSave={toggleSave}
                  />
                ))}

                {Array.from({ length: Math.min(sisaTerkunci, 5) }).map(
                  (_, i) => (
                    <JobRow
                      key={"_k" + i}
                      job={BARIS_TERKUNCI[i % BARIS_TERKUNCI.length]}
                      locked={true}
                    />
                  ),
                )}
              </div>
            </>
          )}

          {/* Sudah berlangganan: cukup tautan singkat ke Job Finder */}
          {langganan.aktif && freeResult.matchCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                padding: "12px 16px",
                borderRadius: 12,
                background: "rgba(20,184,166,0.06)",
                border: "1px solid rgba(20,184,166,0.25)",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{ fontSize: 12.5, color: T.ink, flex: 1, minWidth: 200 }}
              >
                <strong>{freeResult.matchCount} loker</strong> cocok dengan
                profilmu, semuanya terbuka.
              </span>
              <button
                onClick={() => pergiKe("jobfinder")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.teal,
                  fontSize: 12.5,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                Buka di Job Finder →
              </button>
            </div>
          )}

          {/* CTA berlangganan */}
          {!langganan.aktif && (
            <Glass
              style={{
                padding: 22,
                textAlign: "center",
                border: `1.5px solid ${T.accent}`,
              }}
            >
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: T.ink,
                    marginBottom: 8,
                  }}
                >
                  <Sparkles
                    size={14}
                    style={{ verticalAlign: -2, marginRight: 6 }}
                    color={T.accent}
                  />
                  Perbaiki CV dan LinkedIn kamu
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: T.inkSoft,
                    lineHeight: 1.7,
                    textAlign: "left",
                    maxWidth: 420,
                    margin: "0 auto",
                  }}
                >
                  {[
                    sisaTerkunci > 0
                      ? `${sisaTerkunci} loker cocok lainnya yang masih terkunci`
                      : "Semua loker yang cocok dengan profilmu",
                    "Arah karier lengkap: posisi target dan bidang alternatif",
                    sourceType === "cv"
                      ? "Skor ATS dan temuan spesifik per bagian CV"
                      : "Skor profil LinkedIn dan temuan per bagian",
                    "CV ditulis ulang agar lolos ATS — versi Indonesia dan Inggris",
                    "Profil LinkedIn siap pakai dalam dua bahasa",
                  ].map((t) => (
                    <div
                      key={t}
                      style={{ display: "flex", gap: 8, marginBottom: 5 }}
                    >
                      <Check
                        size={13}
                        color={T.teal}
                        style={{ flexShrink: 0, marginTop: 3 }}
                      />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              {aiError && (
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#B23A3A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      lineHeight: 1.5,
                    }}
                  >
                    <AlertCircle size={13} style={{ flexShrink: 0 }} />{" "}
                    {aiError}
                  </div>
                  {bolehCobaLagi && (
                    <div style={{ marginTop: 10 }}>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: T.inkSoft,
                          marginBottom: 8,
                        }}
                      >
                        Kuota kamu tidak terpotong untuk analisis yang gagal.
                        Silakan ulangi.
                      </div>
                      <Button
                        variant="outline"
                        onClick={cobaLagi}
                        disabled={aiLoading}
                        style={{ fontSize: 12, padding: "8px 16px" }}
                      >
                        Ulangi analisis
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <Button
                variant="primary"
                onClick={mulaiAnalisis}
                disabled={isPaymentBusy}
                style={{ width: "100%" }}
              >
                {labelTombol()}
              </Button>
              <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 10 }}>
                {langganan.aktif
                  ? `${langganan.sisaAnalisis} dari ${langganan.kuotaAnalisis} analisis tersisa · aktif ${langganan.sisaHari} hari lagi`
                  : "Termasuk dalam semua paket langganan"}
              </div>
            </Glass>
          )}

          {/* Hasil analisis AI */}
          {unlocked && aiResult && (
            <>
              <Glass style={{ padding: 22, marginTop: 16 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: T.ink,
                    marginBottom: 14,
                  }}
                >
                  Ringkasan Analisis
                </div>
                <Section
                  title="Kekuatan"
                  color={T.teal}
                  items={aiResult.kekuatan}
                  icon={<Check size={13} />}
                />
                <Section
                  title="Kekurangan"
                  color={T.accent}
                  items={aiResult.kekurangan}
                  icon={<AlertCircle size={13} />}
                />
                <Section
                  title="Saran Perbaikan"
                  color={T.ink}
                  items={aiResult.saran_perbaikan}
                  icon={<Sparkles size={13} />}
                />
              </Glass>

              {/* Audit ditampilkan sesuai jenis input.
                  Kalau user memilih "Ini CV saya", audit LinkedIn tidak
                  relevan — mereka belum memberi profil LinkedIn-nya, jadi
                  penilaiannya cuma tebakan dari isi CV. */}
              {sourceType === "cv" && aiResult.cv_audit && (
                <AuditCard
                  judul="Audit CV (ATS)"
                  skor={aiResult.cv_audit.skor_ats}
                  masalah={aiResult.cv_audit.masalah}
                />
              )}

              {sourceType === "linkedin" && aiResult.linkedin_audit && (
                <AuditCard
                  judul="Audit Profil LinkedIn"
                  skor={aiResult.linkedin_audit.skor}
                  masalah={aiResult.linkedin_audit.masalah}
                />
              )}

              {/* CTA ke CV Builder */}
              {aiResult.cv_draft && (
                <Glass
                  style={{
                    padding: 22,
                    marginTop: 16,
                    border: `1.5px solid ${T.teal}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 14.5,
                          color: T.ink,
                          marginBottom: 4,
                        }}
                      >
                        Draft CV dan LinkedIn sudah siap
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: T.inkSoft,
                          lineHeight: 1.6,
                        }}
                      >
                        AI sudah menulis ulang CV kamu agar lebih ATS-friendly,
                        sekaligus menyiapkan versi LinkedIn yang lebih naratif.
                        Buka salah satu builder untuk melihat dan menerapkannya.
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <Button
                      variant="primary"
                      onClick={() => pergiKe("cvbuilder")}
                      style={{ flex: 1 }}
                    >
                      Buka di CV Builder <ChevronRight size={15} />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => pergiKe("linkedinbuilder")}
                      style={{ flex: 1 }}
                    >
                      Buka di LinkedIn Builder <ChevronRight size={15} />
                    </Button>
                  </div>
                </Glass>
              )}
            </>
          )}
        </>
      )}

      {/* Riwayat analisis */}
      <div style={{ marginTop: 28 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14.5,
            color: T.ink,
            marginBottom: 10,
          }}
        >
          Riwayat Analisis
        </div>
        {historyLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              color: T.inkSoft,
            }}
          >
            <Loader2
              size={14}
              style={{ animation: "spin 1s linear infinite" }}
            />{" "}
            Memuat riwayat...
          </div>
        ) : history.length === 0 ? (
          <div
            style={{
              fontSize: 12.5,
              color: T.inkFaint,
              background: "rgba(255,255,255,0.4)",
              border: `1px dashed ${T.border}`,
              borderRadius: 14,
              padding: "16px 18px",
            }}
          >
            Belum ada riwayat. Hasil "Analisis Lengkap" yang sudah kamu buka
            akan muncul di sini supaya bisa dilihat lagi kapan saja.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((h) => {
              const isOpen = expandedHistoryId === h.id;
              const date = new Date(h.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              return (
                <Glass key={h.id} style={{ padding: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => setExpandedHistoryId(isOpen ? null : h.id)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.inkFaint,
                          marginBottom: 3,
                        }}
                      >
                        {date}
                        {h.kategori_label ? ` · ${h.kategori_label}` : ""}
                      </div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: T.ink,
                        }}
                      >
                        {h.arah_karier || "Analisis karier"}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnalysis(h.id);
                      }}
                      style={{
                        flexShrink: 0,
                        background: "transparent",
                        border: "none",
                        color: T.inkFaint,
                        cursor: "pointer",
                        padding: 4,
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {isOpen && (
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: `1px solid ${T.border}`,
                      }}
                    >
                      <Section
                        title="Kekuatan"
                        color={T.teal}
                        items={h.kekuatan}
                        icon={<Check size={13} />}
                      />
                      <Section
                        title="Kekurangan"
                        color={T.accent}
                        items={h.kekurangan}
                        icon={<AlertCircle size={13} />}
                      />
                      <Section
                        title="Saran Perbaikan"
                        color={T.ink}
                        items={h.saran_perbaikan}
                        icon={<Sparkles size={13} />}
                      />
                    </div>
                  )}
                </Glass>
              );
            })}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
