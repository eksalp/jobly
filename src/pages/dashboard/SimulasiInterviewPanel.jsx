import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Loader2,
  History,
  Sparkles,
  Clock,
  ChevronRight,
  Mic,
  Square,
  Bot,
  Info,
  AlertCircle,
  Check,
} from "lucide-react";
import { T } from "../../theme";
import { Glass } from "../../components/ui/Glass";
import { Button } from "../../components/ui/Button";
import { OrbSuara } from "../../components/ui/OrbSuara";
import { KartuPelatihan } from "../../components/ui/KartuPelatihan";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useLangganan } from "../../hooks/useLangganan";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { GerbangFitur } from "../../components/GerbangFitur";
import { KuotaSaya } from "../../components/ui/KuotaSaya";
import { KATEGORI_INTERVIEW } from "../../data/interviewBank";
import { useGeminiLive, pilihModelLive } from "../../hooks/useGeminiLive";
import { lokal, t } from "../../i18n.js";

const TAHAP = { siap: "siap", berlangsung: "berlangsung", selesai: "selesai" };

// 10 menit: cukup untuk 5–7 pertanyaan yang digali, dan menjaga biaya
// audio per sesi tetap di bawah harga paket.
const DURASI_MENIT = 10;
const DURASI_DETIK = DURASI_MENIT * 60;

const NILAI = {
  kurang: { label: t("Kurang", "Weak"), warna: "#B23A3A" },
  cukup: { label: t("Cukup", "Fair"), warna: "#B45309" },
  baik: { label: t("Baik", "Good"), warna: "#0F7B4F" },
  "sangat baik": { label: t("Sangat baik", "Excellent"), warna: "#0F7B4F" },
};

export function SimulasiInterviewPanel({ setActive }) {
  const { user } = useAuth();
  const langganan = useLangganan();
  const hp = useLayarKecil(600);

  const [posisi, setPosisi] = useState("");
  const [kategori, setKategori] = useState(KATEGORI_INTERVIEW[0]);
  const [tahap, setTahap] = useState(TAHAP.siap);
  const [menyiapkan, setMenyiapkan] = useState(false);
  const [menilai, setMenilai] = useState(false);
  const [galat, setGalat] = useState("");
  const [detik, setDetik] = useState(0);
  const [hasil, setHasil] = useState(null);
  const [jumlahGiliran, setJumlahGiliran] = useState(0);
  const [galatPosisi, setGalatPosisi] = useState("");
  const [riwayat, setRiwayat] = useState([]);

  const timerRef = useRef(null);
  const akhiriRef = useRef(null);
  const dialogRef = useRef([]);
  // Menandai koneksi yang ditolak sebelum sesi benar-benar siap.
  // Dipakai ref, bukan state: pengembalian kuota berjalan di fungsi
  // lain setelah ini, dan state belum tentu sudah diperbarui saat itu.
  const gagalRef = useRef(false);
  // Id sesi dari server. Wajib disertakan saat menilai maupun
  // mengembalikan kuota — keduanya menolak permintaan tanpa ini.
  const tokenIdRef = useRef(null);

  /* Transkrip datang sepotong-sepotong. Potongan berturut-turut dari
     pembicara yang sama digabung, supaya transkrip yang dikirim untuk
     penilaian terbaca sebagai percakapan utuh — bukan cacahan kata. */
  /* Transkrip dikumpulkan di ref saja, TIDAK memicu render.
     Sebelumnya tiap potongan transkrip memanggil setDialog, dan potongan
     itu datang beberapa kali per detik — setiap kalinya me-render ulang
     seluruh daftar percakapan. Beban itu bersaing dengan pemrosesan audio
     di thread yang sama dan membuat suara terasa tersendat.

     Isinya baru dipakai saat sesi berakhir, untuk menyusun penilaian. */
  const tambahTranskrip = useCallback((dari, teks) => {
    if (dari === "giliran-selesai") {
      dialogRef.current = dialogRef.current.map((d) => ({ ...d, tutup: true }));
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
  }, []);

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

  const sisaDetik = Math.max(0, DURASI_DETIK - detik);
  const formatDurasi = (d) =>
    `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(d % 60).padStart(2, "0")}`;

  /* Mengembalikan kuota saat sesi gagal dipakai. Dibungkus try/catch
     diam karena kegagalan di sini tidak boleh menimpa pesan galat asli
     yang sedang ditampilkan ke user. */
  const kembalikanKuota = useCallback(async () => {
    try {
      if (!tokenIdRef.current) return;
      await supabase.functions.invoke("kembalikan-kuota", {
        body: { tokenId: tokenIdRef.current },
      });
      langganan.refresh();
    } catch {
      /* diabaikan — user tetap melihat pesan galat yang sebenarnya */
    }
  }, [langganan]);

  /* ---------------- Mulai sesi ---------------- */
  const mulai = async () => {
    if (!posisi.trim()) {
      setGalatPosisi(
        t("Posisi wajib diisi supaya pertanyaannya sesuai bidangmu.", "Enter a role so the questions fit your field."),
      );
      return;
    }

    setMenyiapkan(true);
    setGalat("");
    dialogRef.current = [];

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

      tokenIdRef.current = data.token_id ?? null;

      const instruksi = `Kamu pewawancara kerja profesional di Indonesia yang sedang
mewawancarai kandidat untuk posisi "${posisi}". Fokus wawancara: ${kategori.nama}.

Wawancara ini berlangsung sekitar ${DURASI_MENIT} menit.

PENTING: Kandidat memakai tombol tekan-untuk-bicara. Setiap kali kamu
menerima suaranya, itu berarti ia SUDAH SELESAI bicara. Langsung tanggapi,
jangan menunggu tambahan.

CARA BICARA:
- Bahasa Indonesia yang wajar dan hangat, seperti orang sungguhan, bukan
  seperti membacakan naskah.
- Ringkas. Satu sampai dua kalimat per giliran. Ini percakapan lisan;
  kalimat panjang sulit disimak.
- Kandidat yang menyapa lebih dulu, seperti masuk ruang wawancara.
  Balas sapaannya dengan hangat dan singkat, lalu ajukan pertanyaan pembuka.
- GALI dari jawaban kandidat. Kalau jawabannya umum atau menghindar, minta
  contoh konkret. Menelusuri satu topik sampai jelas jauh lebih berguna
  daripada melompat-lompat.
- Boleh menanggapi singkat sebelum bertanya ("Oke, saya paham.") supaya
  tidak terdengar kaku.
- Ajukan SATU pertanyaan per giliran. Jangan menumpuk beberapa pertanyaan
  sekaligus, karena kandidat akan bingung menjawab yang mana.
- JANGAN menutup atau menyudahi wawancara atas inisiatifmu sendiri. Kamu
  tidak tahu sisa waktunya, dan menyudahi terlalu cepat membuat kandidat
  kehilangan sebagian besar sesi yang sudah ia bayar.
- Teruslah menggali topik baru selama kandidat masih menjawab. Kalau satu
  topik sudah tuntas, pindah ke aspek lain dari posisi yang dilamar:
  pengalaman, cara kerja, penanganan masalah, rencana ke depan.
- Sesi akan dihentikan oleh sistem saat waktunya habis. Sampai itu terjadi,
  anggap wawancara masih panjang.

Kamu adalah pewawancaranya. Jangan keluar dari peran itu.${t(
        "",
        "\n\nBAHASA: Kandidat memilih tampilan bahasa Inggris. Lakukan SELURUH wawancara dalam bahasa Inggris yang natural, termasuk sapaan pembuka.",
      )}`;

      try {
        await live.mulai({ token: data.token, instruksi, model: pilihModelLive(data.model_live) });
      } catch (e) {
        // Token sudah diterbitkan (kuota terpotong) tapi koneksi gagal —
        // kuotanya dikembalikan karena tidak ada biaya AI yang keluar.
        await kembalikanKuota();
        throw e;
      }

      setDetik(0);
      setJumlahGiliran(0);
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
      setGalat(e?.message || t("Gagal memulai sesi.", "Couldn't start the session."));
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
      setGalat(t("Sesi berakhir sebelum ada jawaban, jadi kuotamu dikembalikan.", "The session ended before any answer, so your quota was refunded."));
      return;
    }

    setMenilai(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "simulasi-interview",
        {
          body: {
            aksi: "nilai",
            tokenId: tokenIdRef.current,
            posisi,
            kategori: kategori.nama,
            dialog: transkrip.map(({ dari, teks }) => ({ dari, teks })),
            durasiDetik: detik,
            pemakaian: live.pemakaian(),
          },
        },
      );
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setHasil(data);
      setTahap(TAHAP.selesai);
      setTimeout(muatRiwayat, 1200);
    } catch (e) {
      let pesan = e?.message || t("Gagal menilai sesi.", "Couldn't score the session.");
      try {
        const mentah = (await e?.context?.text?.()) ?? "";
        const body = mentah ? JSON.parse(mentah) : null;
        if (body?.error) pesan = body.error;
      } catch {
        /* pakai pesan bawaan */
      }

      console.error("[simulasi] gagal menilai:", pesan);
      setGalat(pesan);
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
    dialogRef.current = [];
    setHasil(null);
    setDetik(0);
    setJumlahGiliran(0);
    setPosisi("");
    setGalat("");
    setGalatPosisi("");
  };

  /* ---------------- Gerbang akses ---------------- */
  const kuotaHabis =
    langganan.aktif && langganan.punyaInterview && langganan.sisaInterview <= 0;

  if (
    !langganan.loading &&
    tahap === TAHAP.siap &&
    (!langganan.aktif || !langganan.punyaInterview || kuotaHabis)
  ) {
    let judul = t("Simulasi Interview dengan AI", "AI Interview Simulation");
    let keterangan;

    if (kuotaHabis) {
      judul = t("Kuota simulasi kamu sudah habis", "Your simulation quota is used up");
      keterangan =
        t(
          `Kamu sudah memakai seluruh ${langganan.kuotaInterview} sesi di paket ini. Beli paket baru untuk menambah kuota. Sisa masa aktif paketmu tidak hangus, dan kuotanya digabung.`,
          `You've used all ${langganan.kuotaInterview} sessions in this plan. Buy a new plan to add quota. Your remaining active days carry over and the quotas are combined.`,
        );
    } else if (langganan.aktif) {
      keterangan =
        t(
          "Fitur ini tersedia di paket Pro dan Max. Berbicara langsung dengan AI lewat suara, lalu terima penilaian di akhir sesi.",
          "Available on Pro and Max. Talk with AI by voice, then get a score at the end of the session.",
        );
    } else {
      keterangan =
        t(
          "Berbicara langsung dengan AI lewat suara seperti wawancara sungguhan, lalu terima penilaian dan masukan spesifik di akhir sesi.",
          "Talk with AI by voice like a real interview, then get a score and specific feedback at the end.",
        );
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
        : live.sedangBicara
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
      <KuotaSaya
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
            color: "var(--t-danger)",
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
                {t("Mulai simulasi interview", "Start an interview simulation")}
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
              {t("Berbicara langsung dengan AI selama", "Talk live with AI for")}{" "}{DURASI_MENIT}{" "}{t("menit, seperti wawancara sungguhan. Penilaian muncul otomatis di akhir sesi.", "minutes, like a real interview. Your score appears automatically at the end.")}
            </div>

            {/* Panduan singkat sebelum masuk. Ditulis sebagai langkah
                berurutan, bukan paragraf — user membacanya sambil bersiap,
                bukan sambil duduk tenang. */}
            <div
              style={{
                marginBottom: 14,
                padding: "13px 15px",
                borderRadius: 12,
                background: "rgba(11,60,110,0.05)",
                border: `1px solid ${T.accentSoft}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: T.accent,
                  marginBottom: 9,
                  letterSpacing: "0.02em",
                }}
              >
                <Info size={13} />{" "}{t("CARA KERJANYA", "HOW IT WORKS")}
              </div>

              {[
                t("Tekan Mulai bicara saat giliranmu, lalu tekan Selesai kalau sudah. Pewawancara baru menjawab setelah itu.", "Press Start talking on your turn, then press Done when finished. The interviewer only replies after that."),
                t("Buka dengan salam dan perkenalan diri, seperti masuk ruang wawancara sungguhan.", "Open with a greeting and introduce yourself, like walking into a real interview."),
                t("Pakai headphone supaya suara pewawancara tidak terekam balik mikrofonmu.", "Use headphones so the interviewer's voice doesn't feed back into your mic."),
                t("Cari tempat yang cukup tenang. Sesi ini butuh izin mikrofon.", "Find a quiet spot. This session needs microphone access."),
              ].map((tt, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 9,
                    marginBottom: 7,
                    fontSize: 12,
                    color: T.inkSoft,
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.accent,
                      background: T.accentSoft,
                      borderRadius: 99,
                      width: 17,
                      height: 17,
                      flexShrink: 0,
                      marginTop: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span>{tt}</span>
                </div>
              ))}
            </div>

            {/* Posisi wajib diisi: seluruh pertanyaan pewawancara disusun
                dari sini. Tanpa posisi, AI hanya bisa bertanya umum dan
                latihannya kehilangan sebagian besar manfaatnya. */}
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: T.inkFaint,
                marginBottom: 6,
                letterSpacing: "0.03em",
              }}
            >
              {t("POSISI YANG DILAMAR", "ROLE YOU'RE APPLYING FOR")}{" "}<span style={{ color: "var(--t-danger)" }}>*</span>
            </label>
            <input
              value={posisi}
              onChange={(e) => {
                setPosisi(e.target.value);
                if (galatPosisi) setGalatPosisi("");
              }}
              onBlur={() => {
                if (!posisi.trim()) {
                  setGalatPosisi(
                    t("Posisi wajib diisi supaya pertanyaannya sesuai bidangmu.", "Enter a role so the questions fit your field."),
                  );
                }
              }}
              placeholder={t("mis. HR Generalist, Data Analyst, Barista", "e.g. HR Generalist, Data Analyst, Barista")}
              style={{
                width: "100%",
                border: `1px solid ${galatPosisi ? "var(--t-danger)" : T.border}`,
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 13.5,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                background: "var(--t-field)",
                outline: "none",
                color: T.ink,
                boxSizing: "border-box",
                marginBottom: galatPosisi ? 6 : 14,
              }}
            />
            {galatPosisi && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11.5,
                  color: "var(--t-danger)",
                  marginBottom: 14,
                }}
              >
                <AlertCircle size={12} style={{ flexShrink: 0 }} />
                {galatPosisi}
              </div>
            )}

            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.inkFaint,
                marginBottom: 7,
                letterSpacing: "0.03em",
              }}
            >
              {t("FOKUS PERTANYAAN", "QUESTION FOCUS")}
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
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    border: `1px solid ${kategori.slug === k.slug ? T.accent : T.border}`,
                    background:
                      kategori.slug === k.slug
                        ? T.accentSoft
                        : "var(--t-field)",
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
              // Sengaja TIDAK dinonaktifkan saat posisi kosong. Tombol mati
              // tanpa keterangan membuat orang mengira aplikasinya rusak —
              // lebih baik dibiarkan diklik lalu menunjukkan apa yang kurang.
              disabled={menyiapkan}
              style={{ width: "100%" }}
            >
              {menyiapkan ? (
                <>
                  <Loader2
                    size={15}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  {t("Menyambungkan...", "Connecting...")}
                </>
              ) : (
                <>
                  <Play size={15} />{" "}{t("Mulai sesi", "Start session")}
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
              {t("Memakai 1 kuota simulasi ·", "Uses 1 simulation credit ·")}{" "}{langganan.sisaInterview} tersisa
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
              {t("Belum ada sesi. Riwayat simulasi kamu akan muncul di sini.", "No sessions yet. Your simulation history will appear here.")}
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
                  {live.terhubung ? t(" · tersambung", "· connected") : t(" · menyambungkan...", "· connecting...")}
                </div>
              </div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: sisaDetik <= 120 ? "var(--t-warn)" : T.inkSoft,
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
                  background: sisaDetik <= 120 ? "var(--t-warn)" : T.accent,
                  transition: "width 1s linear",
                }}
              />
            </div>
          </Glass>

          {/* Orb + tombol bicara */}
          <Glass style={{ padding: hp ? 18 : 24, marginBottom: 12 }}>
            <OrbSuara
              keadaan={keadaanOrb}
              tingkat={live.tingkat}
              ukuran={hp ? 130 : 155}
            />

            {/* Panduan berubah mengikuti keadaan. Dalam percakapan suara
                user tidak bisa membaca sambil bicara, jadi kalimatnya
                dibuat sangat pendek dan hanya menjawab satu pertanyaan:
                sekarang harus apa. */}
            <div
              style={{
                textAlign: "center",
                marginTop: 4,
                marginBottom: 16,
                fontSize: 12.5,
                color: T.inkSoft,
                lineHeight: 1.6,
                minHeight: 36,
              }}
            >
              {live.berbicara
                ? t("Pewawancara sedang bicara, dengarkan dulu", "The interviewer is speaking, listen first")
                : live.sedangBicara
                  ? t("Silakan bicara. Tekan Selesai kalau sudah.", "Go ahead. Press Done when finished.")
                  : jumlahGiliran === 0
                    ? t("Tekan tombol di bawah, lalu ucapkan salam pembuka dan perkenalkan dirimu.", "Press the button below, then greet the interviewer and introduce yourself.")
                    : t("Tekan tombol di bawah saat siap menjawab", "Press the button below when you're ready to answer")}
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => {
                  if (live.sedangBicara) {
                    live.selesaiBicara();
                    setJumlahGiliran((n) => n + 1);
                  } else {
                    live.mulaiBicara();
                  }
                }}
                disabled={!live.terhubung || menilai}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  padding: hp ? "13px 26px" : "14px 32px",
                  borderRadius: 99,
                  border: "none",
                  cursor:
                    live.terhubung && !menilai ? "pointer" : "not-allowed",
                  fontSize: 14.5,
                  fontWeight: 600,
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  background: live.sedangBicara ? "var(--t-danger)" : T.accent,
                  color: "#fff",
                  opacity: live.terhubung && !menilai ? 1 : 0.5,
                  boxShadow: live.sedangBicara
                    ? "0 0 0 7px rgba(178,58,58,0.14)"
                    : "0 6px 20px rgba(11,60,110,0.3)",
                  transition: "all .2s",
                }}
              >
                {live.sedangBicara ? (
                  <>
                    <Square size={16} />{" "}{t("Selesai bicara", "Done talking")}
                  </>
                ) : (
                  <>
                    <Mic size={17} />{" "}{t("Mulai bicara", "Start talking")}
                  </>
                )}
              </button>
            </div>

            <div
              style={{
                marginTop: 18,
                paddingTop: 14,
                borderTop: `1px solid ${T.border}`,
                textAlign: "center",
              }}
            >
              {/* Disebut terus terang: sesi tidak berhenti sendiri sampai
                  waktunya habis. Tanpa ini user yang merasa sudah cukup
                  cenderung menutup tab — sesinya jadi tidak pernah dinilai
                  dan kuotanya terbuang. */}
              <div
                style={{
                  fontSize: 11.5,
                  color: T.inkSoft,
                  lineHeight: 1.6,
                  marginBottom: 10,
                }}
              >
                {t("Sudah merasa cukup? Tekan tombol di bawah untuk mengakhiri dan melihat penilaianmu. Jangan tutup halaman ini, nanti hasilnya hilang.", "Feel ready to wrap up? Press the button below to end and see your score. Don't close this page or the result will be lost.")}
              </div>

              <Button
                variant="outline"
                onClick={() => akhiri()}
                disabled={menilai}
                style={{ fontSize: 12.5 }}
              >
                <Check size={13} />{" "}{t("Akhiri & lihat penilaian", "End & see score")}
              </Button>
            </div>
          </Glass>
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
              {t("Menilai wawancaramu...", "Scoring your interview...")}
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
              {t("Sesi selesai, tapi penilaiannya gagal dibuat.", "The session ended, but the score couldn't be generated.")}
            </div>
            <Button variant="primary" onClick={ulangi}>
              {t("Kembali", "Back")}
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
          {t("Sesi sebelumnya", "Previous sessions")}
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
                  {new Date(r.created_at).toLocaleDateString(lokal(), {
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
          {t("Hasil simulasi", "Simulation result")}
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
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            color:
              hasil.skor >= 75
                ? "var(--t-ok)"
                : hasil.skor >= 55
                  ? "var(--t-warn)"
                  : "var(--t-danger)",
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
          {t("dari 100", "out of 100")}
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
            [t("Kejelasan", "Clarity"), hasil.kejelasan],
            [t("Struktur", "Structure"), hasil.struktur],
            [t("Relevansi", "Relevance"), hasil.relevansi],
          ].map(([label, nilai]) => {
            const n = NILAI[nilai] ?? NILAI.cukup;
            return (
              <div key={label}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: n.warna,
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
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
              {t("Yang sudah baik", "What went well")}
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
            <AlertCircle size={15} color="var(--t-warn)" />
            <span style={{ fontSize: 14.5, fontWeight: 600, color: T.ink }}>
              {t("Yang perlu diperbaiki", "What to improve")}
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
              <span style={{ color: "var(--t-warn)", flexShrink: 0, marginTop: 1 }}>
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

      {/* Tawaran pelatihan dengan pewawancara sungguhan. Sengaja
          diletakkan SETELAH daftar perbaikan — di titik itu user baru
          saja membaca kekurangannya sendiri dan paling terbuka pada
          bantuan nyata. Di awal halaman, tawaran yang sama cuma
          menghalangi hasil yang sedang mereka tunggu. */}
      <KartuPelatihan skor={hasil.skor} />

      <div style={{ textAlign: "center", marginTop: 18 }}>
        <Button variant="primary" onClick={onUlangi}>
          {t("Kembali", "Back")}
        </Button>
      </div>
    </>
  );
}
