import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Loader2,
  History,
  Sparkles,
  Clock,
  ChevronRight,
  Bot,
  User as UserIcon,
  Info,
  AlertCircle,
  Check,
  PhoneOff,
} from "lucide-react";
import { T } from "../../theme";
import { Glass } from "../../components/ui/Glass";
import { Button } from "../../components/ui/Button";
import { OrbSuara } from "../../components/ui/OrbSuara";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useLangganan } from "../../hooks/useLangganan";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { GerbangFitur, BilahLangganan } from "../../components/GerbangFitur";
import { KATEGORI_INTERVIEW } from "../../data/interviewBank";
import { useGeminiLive } from "../../hooks/useGeminiLive";

const TAHAP = { siap: "siap", berlangsung: "berlangsung", selesai: "selesai" };

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

  const [posisi, setPosisi] = useState("");
  const [kategori, setKategori] = useState(KATEGORI_INTERVIEW[0]);
  const [tahap, setTahap] = useState(TAHAP.siap);
  const [dialog, setDialog] = useState([]);
  const [menyiapkan, setMenyiapkan] = useState(false);
  const [menilai, setMenilai] = useState(false);
  const [galat, setGalat] = useState("");
  const [detik, setDetik] = useState(0);
  const [hasil, setHasil] = useState(null);
  const [riwayat, setRiwayat] = useState([]);

  const timerRef = useRef(null);
  const akhirRef = useRef(null);
  const akhiriRef = useRef(null);
  const dialogRef = useRef([]);

  /* Transkrip datang sepotong-sepotong. Potongan berturut-turut dari
     pembicara yang sama digabung jadi satu gelembung, supaya dialognya
     terbaca seperti percakapan — bukan cacahan kata. */
  const tambahTranskrip = useCallback((dari, teks) => {
    if (dari === "giliran-selesai") {
      dialogRef.current = dialogRef.current.map((d) => ({ ...d, tutup: true }));
      setDialog([...dialogRef.current]);
      return;
    }
    if (!teks) return;

    const isi = dialogRef.current;
    const terakhir = isi[isi.length - 1];

    if (terakhir && terakhir.dari === dari && !terakhir.tutup) {
      terakhir.teks = (terakhir.teks + teks).replace(/\s+/g, " ");
    } else {
      isi.push({ dari, teks: teks.trim(), tutup: false });
    }
    setDialog([...isi]);
  }, []);

  const gagalRef = useRef(false);

  const live = useGeminiLive({
    onTranskrip: tambahTranskrip,
    onGalat: (pesan, gagalSebelumSiap) => {
      setGalat(pesan);
      // Ditandai di ref, bukan state: pengembalian kuota dilakukan di
      // fungsi lain yang berjalan setelah ini, dan state belum tentu
      // sudah diperbarui saat itu.
      if (gagalSebelumSiap) gagalRef.current = true;
    },
  });

  /* Riwayat sesi */
  const muatRiwayat = useCallback(() => {
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
  }, [user?.id]);
  useEffect(() => {
    muatRiwayat();
  }, [muatRiwayat]);

  /* Hitung mundur */
  useEffect(() => {
    if (tahap !== TAHAP.berlangsung) return;
    timerRef.current = setInterval(() => {
      setDetik((d) => {
        if (d + 1 >= DURASI_DETIK) {
          clearInterval(timerRef.current);
          setTimeout(() => akhiriRef.current?.(), 0);
          return DURASI_DETIK;
        }
        return d + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [tahap]);

  useEffect(() => {
    akhirRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [dialog.length]);

  const sisaDetik = Math.max(0, DURASI_DETIK - detik);
  const formatDurasi = (d) =>
    `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(d % 60).padStart(2, "0")}`;

  /* Mengembalikan kuota saat sesi gagal dipakai. Dibungkus try/catch
     diam karena kegagalan di sini tidak boleh menimpa pesan galat asli
     yang sedang ditampilkan ke user. */
  const kembalikanKuota = useCallback(async () => {
    try {
      await supabase.functions.invoke("kembalikan-kuota", {
        body: { jenis: "interview" },
      });
      langganan.refresh();
    } catch {
      /* diabaikan — user tetap melihat pesan galat yang sebenarnya */
    }
  }, [langganan]);

  /* ---------------- Mulai sesi ---------------- */
  const mulai = async () => {
    if (!posisi.trim()) {
      setGalat("Isi dulu posisi yang ingin kamu latih.");
      return;
    }

    setMenyiapkan(true);
    setGalat("");
    dialogRef.current = [];
    setDialog([]);

    try {
      // Token sementara diterbitkan server; kuota dipotong di sana juga.
      const { data, error } = await supabase.functions.invoke("live-token", {});
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

      const instruksi = `Kamu pewawancara kerja profesional di Indonesia yang sedang
mewawancarai kandidat untuk posisi "${posisi}". Fokus wawancara: ${kategori.nama}.

Wawancara ini berlangsung sekitar ${DURASI_MENIT} menit.

CARA BICARA:
- Bahasa Indonesia yang wajar dan hangat, seperti orang sungguhan — bukan
  membacakan naskah.
- Ringkas. Satu sampai dua kalimat per giliran. Ini percakapan lisan;
  kalimat panjang sulit disimak.
- Buka dengan sapaan singkat lalu satu pertanyaan pembuka.
- GALI dari jawaban kandidat. Kalau jawabannya umum atau menghindar, minta
  contoh konkret. Menelusuri satu topik sampai jelas jauh lebih berguna
  daripada melompat-lompat.
- Boleh menanggapi singkat sebelum bertanya ("Oke, saya paham.") supaya
  tidak terdengar kaku.
- Ajukan SATU pertanyaan per giliran. Jangan menumpuk beberapa pertanyaan
  sekaligus — kandidat akan bingung menjawab yang mana.
- Menjelang akhir waktu, arahkan ke pertanyaan penutup lalu tutup dengan sopan.

Kamu adalah pewawancaranya. Jangan keluar dari peran itu.`;

      try {
        await live.mulai({ token: data.token, instruksi });
      } catch (e) {
        // Token sudah diterbitkan (kuota terpotong) tapi koneksi gagal —
        // kuotanya dikembalikan karena tidak ada biaya AI yang keluar.
        await kembalikanKuota();
        throw e;
      }

      setDetik(0);
      gagalRef.current = false;
      setTahap(TAHAP.berlangsung);
      langganan.refresh();

      // Koneksi bisa ditolak beberapa saat SETELAH mulai() selesai —
      // WebSocket menolak secara asinkron. Diperiksa ulang sebentar
      // kemudian supaya kuotanya tetap dikembalikan.
      setTimeout(async () => {
        if (gagalRef.current) {
          await kembalikanKuota();
          setTahap(TAHAP.siap);
        }
      }, 4000);
    } catch (e) {
      setGalat(e?.message || "Gagal memulai sesi.");
    } finally {
      setMenyiapkan(false);
    }
  };

  /* ---------------- Akhiri & nilai ---------------- */
  const akhiri = useCallback(async () => {
    clearInterval(timerRef.current);
    live.akhiri();

    const transkrip = dialogRef.current.filter((d) => d.teks?.trim());

    // Sesi terlalu pendek tidak layak dinilai — hasilnya akan asal-asalan
    // dan justru menyesatkan kandidat.
    if (transkrip.filter((d) => d.dari === "user").length === 0) {
      await kembalikanKuota();
      setTahap(TAHAP.siap);
      setGalat("Sesi berakhir sebelum ada jawaban, jadi kuotamu dikembalikan.");
      return;
    }

    setMenilai(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "simulasi-interview",
        {
          body: {
            aksi: "nilai",
            posisi,
            kategori: kategori.nama,
            dialog: transkrip.map(({ dari, teks }) => ({ dari, teks })),
            durasiDetik: detik,
          },
        },
      );
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setHasil(data);
      setTahap(TAHAP.selesai);
      setTimeout(muatRiwayat, 1200);
    } catch (e) {
      setGalat(e?.message || "Gagal menilai sesi.");
      setTahap(TAHAP.selesai);
    } finally {
      setMenilai(false);
    }
  }, [live, posisi, kategori, detik, muatRiwayat, kembalikanKuota]);

  useEffect(() => {
    akhiriRef.current = akhiri;
  });

  const ulangi = () => {
    setTahap(TAHAP.siap);
    setDialog([]);
    dialogRef.current = [];
    setHasil(null);
    setDetik(0);
    setPosisi("");
    setGalat("");
  };

  /* ---------------- Gerbang akses ---------------- */
  const kuotaHabis =
    langganan.aktif && langganan.punyaInterview && langganan.sisaInterview <= 0;

  if (
    !langganan.loading &&
    tahap === TAHAP.siap &&
    (!langganan.aktif || !langganan.punyaInterview || kuotaHabis)
  ) {
    let judul = "Simulasi Interview dengan AI";
    let keterangan;

    if (kuotaHabis) {
      judul = "Kuota simulasi kamu sudah habis";
      keterangan =
        `Kamu sudah memakai seluruh ${langganan.kuotaInterview} sesi di paket ini. ` +
        "Beli paket baru untuk menambah kuota — sisa masa aktif paketmu tidak hangus, " +
        "dan kuotanya digabung.";
    } else if (langganan.aktif) {
      keterangan =
        "Fitur ini tersedia di paket Pro dan Max. Ngobrol langsung dengan AI lewat " +
        "suara, lalu terima penilaian di akhir sesi.";
    } else {
      keterangan =
        "Ngobrol langsung dengan AI lewat suara seperti wawancara sungguhan, lalu " +
        "terima penilaian dan masukan spesifik di akhir sesi.";
    }

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
          judul={judul}
          keterangan={keterangan}
          onLangganan={() => setActive?.("paket")}
        />
        {riwayat.length > 0 && (
          <DaftarRiwayat
            riwayat={riwayat}
            onPilih={(r) => {
              setHasil(r.ringkasan);
              setPosisi(r.posisi);
              setDetik(r.durasi_detik || 0);
              setTahap(TAHAP.selesai);
            }}
          />
        )}
      </div>
    );
  }

  /* ---------------- Keadaan orb ---------------- */
  const keadaanOrb =
    menyiapkan || menilai
      ? "berpikir"
      : live.berbicara
        ? "bicara"
        : live.mendengar
          ? "mendengar"
          : "diam";

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

      {(galat || live.galat) && (
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
          <span>{galat || live.galat}</span>
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
              Ngobrol langsung dengan AI selama {DURASI_MENIT} menit. Bicara
              saja seperti wawancara biasa — kamu bahkan bisa memotong saat AI
              sedang bicara. Penilaian muncul otomatis di akhir.
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 14,
                padding: "10px 13px",
                borderRadius: 12,
                background: "rgba(76,99,224,0.06)",
                border: `1px solid ${T.accentSoft}`,
                fontSize: 11.5,
                color: T.inkSoft,
                lineHeight: 1.6,
              }}
            >
              <Info size={13} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                Pakai <strong>headphone</strong> supaya suara AI tidak terekam
                balik oleh mikrofon. Sesi butuh izin mikrofon.
              </span>
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
              disabled={menyiapkan || !posisi.trim()}
              style={{ width: "100%" }}
            >
              {menyiapkan ? (
                <>
                  <Loader2
                    size={15}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Menyambungkan...
                </>
              ) : (
                <>
                  <Play size={15} /> Mulai ngobrol
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

          {riwayat.length > 0 ? (
            <DaftarRiwayat
              riwayat={riwayat}
              onPilih={(r) => {
                setHasil(r.ringkasan);
                setPosisi(r.posisi);
                setDetik(r.durasi_detik || 0);
                setTahap(TAHAP.selesai);
              }}
            />
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
                  {kategori.namaPendek}
                  {live.terhubung ? " · tersambung" : " · menyambungkan..."}
                </div>
              </div>
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

          {/* Orb — pusat perhatian selama percakapan */}
          <Glass style={{ padding: hp ? 18 : 24, marginBottom: 12 }}>
            <OrbSuara
              keadaan={keadaanOrb}
              tingkat={live.tingkat}
              ukuran={hp ? 140 : 165}
            />

            {/* Selama kalibrasi, derau latar diukur untuk menentukan
                ambang gerbang. User perlu tahu harus diam sebentar —
                kalau ia bicara di detik pertama, ambangnya jadi terlalu
                tinggi dan suaranya ikut tersaring sepanjang sesi. */}
            {live.mengkalibrasi && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontSize: 12,
                  color: T.inkSoft,
                  lineHeight: 1.5,
                }}
              >
                Menyesuaikan dengan suara ruanganmu — diam sebentar ya
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 6 }}>
              <Button
                variant="outline"
                onClick={() => akhiri()}
                disabled={menilai}
                style={{ fontSize: 12.5 }}
              >
                <PhoneOff size={13} /> Akhiri & lihat penilaian
              </Button>
            </div>
          </Glass>

          {/* Transkrip berjalan */}
          {dialog.length > 0 && (
            <Glass
              style={{
                padding: hp ? 14 : 18,
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: T.inkFaint,
                  letterSpacing: "0.04em",
                  marginBottom: 12,
                }}
              >
                TRANSKRIP
              </div>
              {dialog.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 9,
                    marginBottom: 10,
                    flexDirection: d.dari === "user" ? "row-reverse" : "row",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
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
                    {d.dari === "ai" ? (
                      <Bot size={12} />
                    ) : (
                      <UserIcon size={12} />
                    )}
                  </div>
                  <div
                    style={{
                      maxWidth: "80%",
                      background:
                        d.dari === "ai"
                          ? "rgba(255,255,255,0.7)"
                          : T.accentSoft,
                      border: `1px solid ${d.dari === "ai" ? T.border : "transparent"}`,
                      borderRadius: 12,
                      padding: "9px 12px",
                      fontSize: 12.5,
                      color: T.ink,
                      lineHeight: 1.55,
                    }}
                  >
                    {d.teks}
                  </div>
                </div>
              ))}
              <div ref={akhirRef} />
            </Glass>
          )}
        </>
      )}

      {/* ============ SELESAI ============ */}
      {tahap === TAHAP.selesai &&
        (menilai ? (
          <Glass style={{ padding: 40, textAlign: "center" }}>
            <Loader2
              size={22}
              color={T.accent}
              style={{ animation: "spin 1s linear infinite", marginBottom: 12 }}
            />
            <div style={{ fontSize: 13.5, color: T.inkSoft }}>
              Menilai wawancaramu...
            </div>
          </Glass>
        ) : hasil ? (
          <HasilPenilaian
            hasil={hasil}
            posisi={posisi}
            detik={detik}
            hp={hp}
            formatDurasi={formatDurasi}
            onUlangi={ulangi}
          />
        ) : (
          <Glass style={{ padding: 28, textAlign: "center" }}>
            <div
              style={{
                fontSize: 13,
                color: T.inkSoft,
                lineHeight: 1.7,
                marginBottom: 16,
              }}
            >
              Sesi selesai, tapi penilaiannya gagal dibuat.
            </div>
            <Button variant="primary" onClick={ulangi}>
              Kembali
            </Button>
          </Glass>
        ))}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DaftarRiwayat({ riwayat, onPilih }) {
  return (
    <div style={{ marginTop: 18 }}>
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
            style={{ padding: 14, cursor: r.ringkasan ? "pointer" : "default" }}
            onClick={() => r.ringkasan && onPilih(r)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Bot size={14} color={T.accent} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
                  {r.posisi}
                </div>
                <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 2 }}>
                  {new Date(r.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
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
  );
}

function HasilPenilaian({ hasil, posisi, detik, hp, formatDurasi, onUlangi }) {
  return (
    <>
      <Glass
        style={{ padding: hp ? 20 : 26, marginBottom: 12, textAlign: "center" }}
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
                  style={{ fontSize: 10.5, color: T.inkFaint, marginTop: 3 }}
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
              <span style={{ color: "#B45309", flexShrink: 0, marginTop: 1 }}>
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
        <Button variant="primary" onClick={onUlangi}>
          Kembali
        </Button>
      </div>
    </>
  );
}
