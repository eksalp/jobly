import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Play,
  Loader2,
  Volume2,
  VolumeX,
  History,
  Sparkles,
  Clock,
  ChevronRight,
  Bot,
  User as UserIcon,
  Info,
  AlertCircle,
  Check,
  Keyboard,
  RotateCcw,
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
import { usePengenalanSuara, usePembacaSuara } from "../../hooks/useSuara";

const TAHAP = { siap: "siap", berlangsung: "berlangsung", selesai: "selesai" };
// Durasi sesi. 15 menit dipilih karena mendekati panjang wawancara
// tahap awal yang sebenarnya — cukup untuk beberapa topik digali dalam,
// tapi tidak melelahkan untuk latihan yang diulang berkali-kali.
const DURASI_MENIT = 15;
const DURASI_DETIK = DURASI_MENIT * 60;

const NILAI = {
  kurang: { label: "Kurang", warna: "#B23A3A" },
  cukup: { label: "Cukup", warna: "#B45309" },
  baik: { label: "Baik", warna: "#0F7B4F" },
  "sangat baik": { label: "Sangat baik", warna: "#0F7B4F" },
};

export function SimulasiInterviewPanel({ setActive }) {
  const { user } = useAuth();
  const langganan = useLangganan();
  const hp = useLayarKecil(600);

  // onSelesaiBicara terpanggil setelah user diam beberapa saat —
  // jawabannya dikirim sendiri tanpa perlu menekan tombol.
  const suara = usePengenalanSuara({
    onSelesaiBicara: (teks) => kirimRef.current?.(teks),
  });
  const pembaca = usePembacaSuara();

  const [posisi, setPosisi] = useState("");
  const [kategori, setKategori] = useState(KATEGORI_INTERVIEW[0]);
  const [tahap, setTahap] = useState(TAHAP.siap);
  const [dialog, setDialog] = useState([]);
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState("");
  const [detik, setDetik] = useState(0);
  const [hasil, setHasil] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [modeKetik, setModeKetik] = useState(false);
  const [ketikan, setKetikan] = useState("");
  const [bacaOtomatis, setBacaOtomatis] = useState(true);
  const [otomatis, setOtomatis] = useState(true); // kirim otomatis saat berhenti bicara

  const timerRef = useRef(null);
  const akhirRef = useRef(null);
  // Ref ke fungsi akhiri supaya timer bisa memanggilnya tanpa membuat
  // efek ini bergantung pada fungsi yang berubah tiap render.
  const akhiriRef = useRef(null);
  const kirimRef = useRef(null);

  /* Riwayat sesi */
  const muatRiwayat = () => {
    if (!user || !supabaseConfigured) return;
    supabase
      .from("interview_sessions")
      .select(
        "id, posisi, kategori, jumlah_soal, durasi_detik, skor, ringkasan, created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setRiwayat(data || []));
  };
  useEffect(muatRiwayat, [user?.id]);

  /* Hitung mundur sesi. Saat habis, sesi diakhiri otomatis dan langsung
     masuk ke penilaian — sama seperti wawancara sungguhan yang berhenti
     karena waktu, bukan karena kehabisan pertanyaan. */
  useEffect(() => {
    if (tahap !== TAHAP.berlangsung) return;
    timerRef.current = setInterval(() => {
      setDetik((d) => {
        if (d + 1 >= DURASI_DETIK) {
          clearInterval(timerRef.current);
          // Dijalankan di luar setState supaya tidak memicu pembaruan
          // state lain di tengah render.
          setTimeout(() => akhiriRef.current?.(), 0);
          return DURASI_DETIK;
        }
        return d + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [tahap]);

  /* Gulir otomatis ke pesan terbaru */
  useEffect(() => {
    akhirRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [dialog.length, memuat]);

  const sisaDetik = Math.max(0, DURASI_DETIK - detik);
  const sisaMenit = Math.ceil(sisaDetik / 60);

  const formatDurasi = (d) =>
    `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(d % 60).padStart(2, "0")}`;

  const jumlahSoal = dialog.filter((d) => d.dari === "ai").length;

  /* ---------------- Panggilan ke edge function ---------------- */
  const panggil = async (aksi, dialogSaatIni, durasi = 0) => {
    const { data, error } = await supabase.functions.invoke(
      "simulasi-interview",
      {
        body: {
          aksi,
          posisi,
          kategori: kategori.nama,
          dialog: dialogSaatIni,
          totalMenit: DURASI_MENIT,
          sisaMenit: Math.ceil(Math.max(0, DURASI_DETIK - detik) / 60),
          durasiDetik: durasi,
        },
      },
    );

    if (error) {
      let pesan = error.message;
      try {
        const mentah = (await error.context?.text?.()) ?? "";
        const body = mentah ? JSON.parse(mentah) : null;
        if (body?.error) pesan = body.error;
      } catch {
        /* pakai pesan bawaan */
      }
      throw new Error(pesan);
    }
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const mulai = async () => {
    if (!posisi.trim()) {
      setGalat("Isi dulu posisi yang ingin kamu latih.");
      return;
    }
    setMemuat(true);
    setGalat("");
    try {
      const data = await panggil("mulai", []);
      const awal = [{ dari: "ai", teks: data.pertanyaan }];
      setDialog(awal);
      setDetik(0);
      setTahap(TAHAP.berlangsung);
      langganan.refresh();
      if (bacaOtomatis) pembaca.baca(data.pertanyaan);
    } catch (e) {
      setGalat(e?.message || "Gagal memulai sesi.");
    } finally {
      setMemuat(false);
    }
  };

  const kirimJawaban = async (teksLangsung) => {
    const jawaban = (teksLangsung ?? (modeKetik ? ketikan : suara.teks)).trim();
    if (!jawaban || memuat) return;

    // Mikrofon dihentikan sementara supaya suara AI tidak ikut terekam
    // sebagai jawaban berikutnya — ini penyebab paling umum percakapan
    // suara jadi kacau dan berulang sendiri.
    suara.berhenti();
    pembaca.hentikan();

    const setelahJawab = [...dialog, { dari: "user", teks: jawaban }];
    setDialog(setelahJawab);
    suara.bersihkan();
    setKetikan("");

    setMemuat(true);
    try {
      const data = await panggil("tanya", setelahJawab);
      setDialog([...setelahJawab, { dari: "ai", teks: data.pertanyaan }]);
      if (bacaOtomatis) pembaca.baca(data.pertanyaan);
    } catch (e) {
      setGalat(e?.message || "Gagal mengambil pertanyaan berikutnya.");
    } finally {
      setMemuat(false);
    }
  };

  const akhiri = async (dialogFinal) => {
    const d = dialogFinal || dialog;
    suara.berhenti();
    pembaca.hentikan();
    clearInterval(timerRef.current);

    setMemuat(true);
    setGalat("");
    try {
      const data = await panggil("nilai", d, detik);
      setHasil(data);
      setTahap(TAHAP.selesai);
      setTimeout(muatRiwayat, 1200); // beri jeda untuk penyimpanan
    } catch (e) {
      setGalat(e?.message || "Gagal menilai sesi.");
    } finally {
      setMemuat(false);
    }
  };

  /* Ref disinkronkan tiap render supaya timer sesi dan callback deteksi
     jeda selalu memanggil versi terbaru fungsinya — tanpa ini, keduanya
     memegang closure lama dan bekerja dengan state yang sudah basi. */
  useEffect(() => {
    akhiriRef.current = () => akhiri();
    kirimRef.current = kirimJawaban;
  });

  /* Mikrofon dinyalakan lagi setelah AI selesai bicara.
     Inilah yang membuat sesi terasa seperti mengobrol: user tidak perlu
     menekan apa pun, cukup menjawab saat gilirannya tiba. */
  useEffect(() => {
    if (tahap !== TAHAP.berlangsung) return;
    if (!otomatis || modeKetik || !suara.didukung) return;
    if (memuat || pembaca.berbicara || suara.mendengar) return;

    const terakhir = dialog[dialog.length - 1];
    if (terakhir?.dari !== "ai") return;

    // Jeda sesaat sebelum mendengarkan, supaya ekor suara AI dari
    // speaker tidak tertangkap mikrofon sebagai jawaban user.
    const t = setTimeout(() => suara.mulai(), 450);
    return () => clearTimeout(t);
  }, [
    tahap,
    otomatis,
    modeKetik,
    memuat,
    pembaca.berbicara,
    suara.mendengar,
    suara.didukung,
    dialog.length,
  ]);

  const ulangi = () => {
    setTahap(TAHAP.siap);
    setDialog([]);
    setHasil(null);
    setDetik(0);
    setPosisi("");
    setGalat("");
    suara.bersihkan();
  };

  /* ---------------- Gerbang paket ---------------- */
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
              ? "Fitur ini tersedia di paket Pro dan Max. Berlatih wawancara lewat suara dengan AI yang menggali jawabanmu, lalu memberi penilaian di akhir sesi."
              : "Berlatih wawancara lewat suara dengan AI yang bertanya, menggali jawabanmu, lalu memberi penilaian dan masukan spesifik di akhir sesi."
          }
          onLangganan={() => setActive?.("paket")}
        />
      </div>
    );
  }

  const jawabanSaatIni = modeKetik ? ketikan : suara.teks;

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

      {galat && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 14,
            padding: "11px 14px",
            borderRadius: 12,
            background: "rgba(178,58,58,0.06)",
            border: "1px solid rgba(178,58,58,0.3)",
            fontSize: 12.5,
            color: "#B23A3A",
            lineHeight: 1.6,
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{galat}</span>
        </div>
      )}

      {/* ============ SIAP ============ */}
      {tahap === TAHAP.siap && (
        <>
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
              Ngobrol langsung dengan AI selama {DURASI_MENIT} menit, seperti
              wawancara sungguhan. Mikrofon menyala sendiri saat giliranmu —
              cukup jawab, tidak perlu menekan apa pun. Penilaian muncul
              otomatis saat waktu habis.
            </div>

            {!suara.didukung && (
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
                  Browser ini belum mendukung input suara. Kamu tetap bisa
                  berlatih dengan mengetik jawaban. Untuk pengalaman penuh,
                  gunakan Chrome, Edge, atau Safari.
                </span>
              </div>
            )}

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
                marginBottom: 14,
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
                  onClick={() => setKategori(k)}
                  style={{
                    fontSize: 11.5,
                    padding: "6px 12px",
                    borderRadius: 99,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    border: `1px solid ${kategori.slug === k.slug ? T.accent : T.border}`,
                    background:
                      kategori.slug === k.slug
                        ? T.accentSoft
                        : "rgba(255,255,255,0.5)",
                    color: kategori.slug === k.slug ? T.accent : T.inkSoft,
                  }}
                >
                  {k.namaPendek}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              onClick={mulai}
              disabled={
                memuat || !posisi.trim() || langganan.sisaInterview <= 0
              }
              style={{ width: "100%" }}
            >
              {memuat ? (
                <>
                  <Loader2
                    size={15}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Menyiapkan pewawancara...
                </>
              ) : langganan.sisaInterview <= 0 ? (
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

          {/* Riwayat */}
          {riwayat.length > 0 ? (
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
                  <Glass
                    key={r.id}
                    style={{
                      padding: 14,
                      cursor: r.ringkasan ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (!r.ringkasan) return;
                      setHasil(r.ringkasan);
                      setPosisi(r.posisi);
                      setDetik(r.durasi_detik || 0);
                      setTahap(TAHAP.selesai);
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Bot
                        size={14}
                        color={T.accent}
                        style={{ flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.ink,
                          }}
                        >
                          {r.posisi}
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
                          {r.jumlah_soal
                            ? ` · ${r.jumlah_soal} pertanyaan`
                            : ""}
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
          ) : (
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
        </>
      )}

      {/* ============ BERLANGSUNG ============ */}
      {tahap === TAHAP.berlangsung && (
        <>
          <Glass style={{ padding: hp ? 14 : 18, marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>
                  {posisi}
                </div>
                <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 2 }}>
                  {kategori.namaPendek} · {jumlahSoal} pertanyaan
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => {
                    setBacaOtomatis((v) => !v);
                    if (bacaOtomatis) pembaca.hentikan();
                  }}
                  title={
                    bacaOtomatis ? "Matikan suara AI" : "Nyalakan suara AI"
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: bacaOtomatis ? T.accent : T.inkFaint,
                    padding: 3,
                    display: "flex",
                  }}
                >
                  {bacaOtomatis ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                {/* Hitung mundur, bukan hitung maju — user perlu tahu
                    berapa lama lagi, bukan sudah berapa lama. Warnanya
                    berubah di 2 menit terakhir sebagai peringatan halus. */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: sisaDetik <= 120 ? "#B45309" : T.inkSoft,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  <Clock size={12} /> {formatDurasi(sisaDetik)}
                </span>
              </div>
            </div>

            <div
              style={{
                height: 3,
                borderRadius: 99,
                marginTop: 12,
                background: "rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(detik / DURASI_DETIK) * 100}%`,
                  height: "100%",
                  background: sisaDetik <= 120 ? "#B45309" : T.accent,
                  transition: "width 1s linear",
                }}
              />
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
                  {d.dari === "ai" && pembaca.didukung && (
                    <button
                      onClick={() => pembaca.baca(d.teks)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 10.5,
                        color: T.inkFaint,
                        marginTop: 7,
                        padding: 0,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <Volume2 size={11} /> Dengarkan lagi
                    </button>
                  )}
                </div>
              </div>
            ))}

            {memuat && (
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 99,
                    flexShrink: 0,
                    background: T.accentSoft,
                    color: T.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={15} />
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    border: `1px solid ${T.border}`,
                    borderRadius: 14,
                    padding: "11px 14px",
                    fontSize: 12.5,
                    color: T.inkFaint,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Loader2
                    size={13}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Sedang menyusun pertanyaan...
                </div>
              </div>
            )}
            <div ref={akhirRef} />
          </div>

          {/* Status percakapan.
              Dalam mode otomatis, ini bukan panel tombol melainkan
              penanda giliran — user cukup tahu kapan harus bicara. */}
          <Glass style={{ padding: hp ? 16 : 20 }}>
            {suara.galat && (
              <div
                style={{
                  fontSize: 11.5,
                  color: "#B23A3A",
                  marginBottom: 10,
                  lineHeight: 1.5,
                }}
              >
                {suara.galat}
              </div>
            )}

            {/* Transkrip berjalan */}
            {!modeKetik && suara.teks && (
              <div
                style={{
                  fontSize: 12.5,
                  color: T.ink,
                  lineHeight: 1.6,
                  background: "rgba(255,255,255,0.6)",
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "10px 13px",
                  marginBottom: 12,
                  maxHeight: 110,
                  overflowY: "auto",
                }}
              >
                {suara.teks}
              </div>
            )}

            {modeKetik && (
              <textarea
                value={ketikan}
                onChange={(e) => setKetikan(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    kirimJawaban();
                  }
                }}
                placeholder="Ketik jawabanmu, lalu Enter..."
                rows={3}
                style={{
                  width: "100%",
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "10px 13px",
                  fontSize: 13,
                  fontFamily: "'Poppins', sans-serif",
                  resize: "vertical",
                  background: "rgba(255,255,255,0.6)",
                  outline: "none",
                  color: T.ink,
                  boxSizing: "border-box",
                  marginBottom: 12,
                }}
              />
            )}

            {/* Penanda giliran */}
            {!modeKetik && suara.didukung && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px 0 4px",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 99,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: suara.mendengar
                      ? "#B23A3A"
                      : pembaca.berbicara
                        ? T.accent
                        : "rgba(0,0,0,0.08)",
                    color:
                      suara.mendengar || pembaca.berbicara
                        ? "#fff"
                        : T.inkFaint,
                    boxShadow: suara.mendengar
                      ? "0 0 0 7px rgba(178,58,58,0.13)"
                      : pembaca.berbicara
                        ? "0 0 0 7px rgba(79,70,229,0.13)"
                        : "none",
                    transition: "all .25s",
                    flexShrink: 0,
                  }}
                >
                  {pembaca.berbicara ? (
                    <Volume2 size={19} />
                  ) : (
                    <Mic size={19} />
                  )}
                </div>
                <div
                  style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.5 }}
                >
                  {memuat
                    ? "AI sedang berpikir..."
                    : pembaca.berbicara
                      ? "AI sedang bicara — tunggu sebentar"
                      : suara.mendengar
                        ? "Giliranmu — bicara saja, nanti terkirim sendiri"
                        : "Bersiap mendengarkan..."}
                </div>
              </div>
            )}

            {/* Kendali manual — selalu tersedia sebagai jalan keluar
                kalau deteksi jeda meleset atau user ingin kendali penuh. */}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 14,
                paddingTop: 14,
                borderTop: `1px solid ${T.border}`,
              }}
            >
              {(modeKetik || !otomatis) && (
                <Button
                  variant="primary"
                  onClick={() => kirimJawaban()}
                  disabled={
                    memuat || !(modeKetik ? ketikan : suara.teks).trim()
                  }
                  style={{ fontSize: 12.5 }}
                >
                  <Check size={13} /> Kirim
                </Button>
              )}

              {!modeKetik && suara.didukung && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setOtomatis((v) => !v);
                    suara.berhenti();
                    suara.bersihkan();
                  }}
                  style={{ fontSize: 12 }}
                >
                  {otomatis ? "Kendali manual" : "Mode otomatis"}
                </Button>
              )}

              {!otomatis && !modeKetik && suara.didukung && (
                <Button
                  variant="outline"
                  onClick={() =>
                    suara.mendengar ? suara.berhenti() : suara.mulai()
                  }
                  style={{ fontSize: 12 }}
                >
                  {suara.mendengar ? (
                    <>
                      <Square size={12} /> Berhenti
                    </>
                  ) : (
                    <>
                      <Mic size={12} /> Bicara
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setModeKetik((v) => !v);
                  suara.berhenti();
                  suara.bersihkan();
                }}
                style={{ fontSize: 12 }}
              >
                {modeKetik ? (
                  <>
                    <Mic size={12} /> Pakai suara
                  </>
                ) : (
                  <>
                    <Keyboard size={12} /> Ketik saja
                  </>
                )}
              </Button>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => akhiri()}
                disabled={
                  memuat || dialog.filter((d) => d.dari === "user").length === 0
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.inkFaint,
                  fontSize: 11.5,
                  marginTop: 14,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Akhiri lebih awal & lihat penilaian
              </button>
            </div>
          </Glass>
        </>
      )}

      {/* ============ SELESAI ============ */}
      {tahap === TAHAP.selesai && hasil && (
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
                marginBottom: 5,
              }}
            >
              Hasil simulasi
            </div>
            <div style={{ fontSize: 12.5, color: T.inkSoft, marginBottom: 20 }}>
              {posisi}
              {detik > 0 ? ` · ${formatDurasi(detik)}` : ""}
            </div>

            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                lineHeight: 1,
                fontFamily: "'Poppins', sans-serif",
                color:
                  hasil.skor >= 75
                    ? "#0F7B4F"
                    : hasil.skor >= 55
                      ? "#B45309"
                      : "#B23A3A",
              }}
            >
              {hasil.skor}
            </div>
            <div
              style={{
                fontSize: 11,
                color: T.inkFaint,
                marginTop: 4,
                marginBottom: 20,
              }}
            >
              dari 100
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: hp ? 18 : 28,
                flexWrap: "wrap",
              }}
            >
              {[
                ["Kejelasan", hasil.kejelasan],
                ["Struktur", hasil.struktur],
                ["Relevansi", hasil.relevansi],
              ].map(([label, nilai]) => {
                const n = NILAI[nilai] ?? NILAI.cukup;
                return (
                  <div key={label}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: n.warna,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {n.label}
                    </div>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: T.inkFaint,
                        marginTop: 3,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </Glass>

          {hasil.kekuatan?.length > 0 && (
            <Glass style={{ padding: 22, marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 12,
                }}
              >
                <Check size={15} color={T.teal} />
                <span style={{ fontSize: 14.5, fontWeight: 600, color: T.ink }}>
                  Yang sudah baik
                </span>
              </div>
              {hasil.kekuatan.map((k, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    fontSize: 12.5,
                    color: T.inkSoft,
                    lineHeight: 1.65,
                    marginBottom: 7,
                  }}
                >
                  <span style={{ color: T.teal, flexShrink: 0, marginTop: 1 }}>
                    •
                  </span>
                  <span>{k}</span>
                </div>
              ))}
            </Glass>
          )}

          {hasil.perbaikan?.length > 0 && (
            <Glass
              style={{
                padding: 22,
                marginBottom: 12,
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
                <AlertCircle size={15} color="#B45309" />
                <span style={{ fontSize: 14.5, fontWeight: 600, color: T.ink }}>
                  Yang perlu diperbaiki
                </span>
              </div>
              {hasil.perbaikan.map((k, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    fontSize: 12.5,
                    color: T.ink,
                    lineHeight: 1.65,
                    marginBottom: 7,
                  }}
                >
                  <span
                    style={{ color: "#B45309", flexShrink: 0, marginTop: 1 }}
                  >
                    •
                  </span>
                  <span>{k}</span>
                </div>
              ))}
              {hasil.catatan && (
                <div
                  style={{
                    fontSize: 12.5,
                    color: T.ink,
                    lineHeight: 1.7,
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(217,119,6,0.25)",
                  }}
                >
                  {hasil.catatan}
                </div>
              )}
            </Glass>
          )}

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button variant="primary" onClick={ulangi}>
              Kembali
            </Button>
          </div>
        </>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
