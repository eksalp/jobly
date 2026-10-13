import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  User,
  AlertTriangle,
  Wallet,
  Flame,
  Users,
  Puzzle,
  Scale,
  Target,
  Flag,
  Crown,
  MessageSquareQuote,
  Zap,
  Calculator,
  Languages,
  Briefcase,
  Timer,
  Play,
  SkipForward,
  Eye,
  Shuffle,
  Trophy,
} from "lucide-react";
import { T } from "../../theme";
import { Glass } from "../../components/ui/Glass";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { KATEGORI_INTERVIEW, TOTAL_PERTANYAAN } from "../../data/interviewBank";
import { KartuPelatihan } from "../../components/ui/KartuPelatihan";
import { t } from "../../i18n.js";

// Peta nama ikon (string di file data) ke komponennya. File data sengaja
// hanya menyimpan nama supaya tetap murni data tanpa impor React.
const IKON = {
  User,
  AlertTriangle,
  Wallet,
  Flame,
  Users,
  Puzzle,
  Scale,
  Target,
  Flag,
  Crown,
  Zap,
  Calculator,
  Languages,
  Briefcase,
};

/* ------------------------------------------------------------------ */
/*  Satu kartu pertanyaan — strategi disembunyikan sampai diklik        */
/* ------------------------------------------------------------------ */
function KartuPertanyaan({ item, dibuka, onToggle, ditandai, onTandai }) {
  return (
    <Glass style={{ padding: 0, marginBottom: 8, overflow: "hidden" }}>
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "14px 16px",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.accent,
            background: T.accentSoft,
            borderRadius: 8,
            padding: "3px 8px",
            flexShrink: 0,
            marginTop: 1,
            minWidth: 28,
            textAlign: "center",
          }}
        >
          {item.nomor}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: T.ink,
              lineHeight: 1.5,
            }}
          >
            {item.pertanyaan}
          </div>
          {item.level === "neraka" && <span className="lt-level">{t("Level neraka", "Brutal")}</span>}
        </div>

        {/* Penanda "latih lagi" — dihentikan propagasinya supaya tidak
            ikut membuka/menutup kartu saat diklik. */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTandai();
          }}
          title={
            ditandai ? t("Hapus dari daftar latihan", "Remove from practice list") : t("Tandai untuk dilatih", "Mark to practise")
          }
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: ditandai ? T.accent : T.inkFaint,
            padding: 2,
            display: "flex",
            flexShrink: 0,
          }}
        >
          {ditandai ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        </button>

        <ChevronDown
          size={15}
          color={T.inkFaint}
          style={{
            flexShrink: 0,
            marginTop: 1,
            transform: dibuka ? "rotate(180deg)" : "none",
            transition: "transform .15s",
          }}
        />
      </div>

      {dibuka && (
        <div
          style={{
            padding: "0 16px 16px 56px",
            borderTop: `1px solid ${T.border}`,
            paddingTop: 14,
            marginTop: -1,
          }}
        >
          <IsiJawaban item={item} />
        </div>
      )}
    </Glass>
  );
}

/* ------------------------------------------------------------------ */
/*  Isi jawaban: jebakan, strategi, contoh                              */
/* ------------------------------------------------------------------ */
function IsiJawaban({ item }) {
  return (
    <div className="lt-isi">
      {item.jebakan && (
        <div className="lt-blok jebakan">
          <span>
            <AlertTriangle size={12} />{" "}{t("Yang sebenarnya diuji", "What's really being tested")}
          </span>
          <p>{item.jebakan}</p>
        </div>
      )}
      <div className="lt-blok">
        <span>
          <Lightbulb size={12} />{" "}{t("Strategi menjawab", "How to answer")}
        </span>
        <p>{item.strategi}</p>
      </div>
      {item.contoh && (
        <div className="lt-blok contoh">
          <span>
            <MessageSquareQuote size={12} />{" "}{t("Contoh jawaban", "Sample answer")}
          </span>
          <p>{item.contoh}</p>
          <small>{t("Ini kerangka, bukan hafalan. Ganti dengan pengalamanmu sendiri.", "This is a framework, not a script. Swap in your own experience.")}</small>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mode tantangan: pertanyaan acak, waktu berpikir & menjawab          */
/* ------------------------------------------------------------------ */
const FASE_DETIK = { pikir: 20, jawab: 120 };
const KUNCI_SKOR = "jobly:tantangan";

function bacaSkor() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_SKOR) || "null") || { dijawab: 0, kuat: 0, beruntun: 0, terbaik: 0 };
  } catch {
    return { dijawab: 0, kuat: 0, beruntun: 0, terbaik: 0 };
  }
}

function ModeTantangan({ onTutup }) {
  const [sumber, setSumber] = useState("neraka"); // neraka | sulit | semua
  const kumpulan = useMemo(() => {
    const semua = KATEGORI_INTERVIEW.flatMap((k) => k.pertanyaan.map((p) => ({ ...p, kategori: k.namaPendek, level: k.level })));
    if (sumber === "neraka") return semua.filter((p) => p.level === "neraka");
    if (sumber === "sulit") return semua.filter((p) => p.level);
    return semua;
  }, [sumber]);
  const acak = () => kumpulan[Math.floor(Math.random() * kumpulan.length)];
  const [soal, setSoal] = useState(() => acak());
  const [fase, setFase] = useState("siap"); // siap | pikir | jawab | ulas
  const [sisa, setSisa] = useState(0);
  const [skor, setSkor] = useState(bacaSkor);
  const timer = useRef(null);

  useEffect(() => setSoal(acak()), [kumpulan]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    clearInterval(timer.current);
    if (fase !== "pikir" && fase !== "jawab") return;
    setSisa(FASE_DETIK[fase]);
    timer.current = setInterval(() => {
      setSisa((d) => {
        if (d <= 1) {
          clearInterval(timer.current);
          setFase((f) => (f === "pikir" ? "jawab" : "ulas"));
          return 0;
        }
        return d - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [fase]);

  const nilai = (kuat) => {
    const baru = {
      dijawab: skor.dijawab + 1,
      kuat: skor.kuat + (kuat ? 1 : 0),
      beruntun: kuat ? skor.beruntun + 1 : 0,
      terbaik: Math.max(skor.terbaik, kuat ? skor.beruntun + 1 : 0),
    };
    setSkor(baru);
    try {
      localStorage.setItem(KUNCI_SKOR, JSON.stringify(baru));
    } catch {
      /* abaikan */
    }
    lanjut();
  };

  const lanjut = () => {
    let s2 = acak();
    if (kumpulan.length > 1) while (s2.nomor === soal.nomor) s2 = acak();
    setSoal(s2);
    setFase("siap");
  };

  const total = FASE_DETIK[fase] || 1;
  const persen = fase === "pikir" || fase === "jawab" ? sisa / total : 1;
  const mm = `${Math.floor(sisa / 60)}:${String(sisa % 60).padStart(2, "0")}`;

  return (
    <div className="lt-tantangan" role="region" aria-label={t("Mode tantangan", "Challenge mode")}>
      <div className="lt-t-atas">
        <div className="lt-t-judul">
          <Zap size={16} />{" "}{t("Mode tantangan", "Challenge mode")}
        </div>
        <div className="lt-t-skor">
          <span>
            <Trophy size={13} />{" "}{t("Beruntun", "Streak")}{" "}<b>{skor.beruntun}</b>
          </span>
          <span>
            {t("Terbaik", "Best")}{" "}<b>{skor.terbaik}</b>
          </span>
          <span>
            {t("Dijawab", "Answered")}{" "}<b>{skor.dijawab}</b>
          </span>
        </div>
        <button type="button" className="lt-t-tutup" onClick={onTutup}>
          {t("Tutup", "Close")}
        </button>
      </div>

      <div className="lt-t-sumber" role="radiogroup" aria-label={t("Sumber pertanyaan", "Question pool")}>
        {[
          ["neraka", t("Level neraka", "Brutal")],
          ["sulit", t("Semua yang sulit", "All hard ones")],
          ["semua", t("Semua pertanyaan", "All questions")],
        ].map(([id, l]) => (
          <button key={id} type="button" role="radio" aria-checked={sumber === id} className={sumber === id ? "on" : ""} onClick={() => setSumber(id)}>
            {l}
          </button>
        ))}
      </div>

      <div className={`lt-t-kartu ${fase}`} key={soal.nomor}>
        <span className="lt-t-kat">{soal.kategori}</span>
        <p className="lt-t-soal">{soal.pertanyaan}</p>

        {(fase === "pikir" || fase === "jawab") && (
          <div className="lt-t-waktu">
            <svg viewBox="0 0 44 44" width="52" height="52" aria-hidden="true">
              <circle cx="22" cy="22" r="19" fill="none" stroke="var(--bar-bg)" strokeWidth="4" />
              <circle
                cx="22"
                cy="22"
                r="19"
                fill="none"
                stroke={fase === "pikir" ? "var(--amber)" : "var(--brand)"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={119.4}
                strokeDashoffset={119.4 * (1 - persen)}
                transform="rotate(-90 22 22)"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div>
              <b>{mm}</b>
              <span>{fase === "pikir" ? t("Waktu berpikir, susun poin jawabanmu", "Thinking time, outline your answer") : t("Jawab dengan suara keras, seperti di ruang interview", "Answer out loud, like in a real interview")}</span>
            </div>
          </div>
        )}

        {fase === "ulas" && <IsiJawaban item={soal} />}

        <div className="lt-t-aksi">
          {fase === "siap" && (
            <>
              <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={() => setFase("pikir")}>
                <Play size={15} />{" "}{t("Mulai", "Start")}{" "}{FASE_DETIK.pikir}{" "}{t("detik berpikir", "seconds to think")}
              </button>
              <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={lanjut}>
                <Shuffle size={15} />{" "}{t("Acak lagi", "Shuffle")}
              </button>
            </>
          )}
          {fase === "pikir" && (
            <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={() => setFase("jawab")}>
              <Timer size={15} />{" "}{t("Sudah siap, mulai menjawab", "Ready, start answering")}
            </button>
          )}
          {fase === "jawab" && (
            <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={() => setFase("ulas")}>
              <Eye size={15} />{" "}{t("Selesai, lihat pembahasan", "Done, show the breakdown")}
            </button>
          )}
          {fase === "ulas" && (
            <>
              <span className="lt-t-tanya">{t("Jawabanmu tadi sudah sekuat contoh?", "Was your answer as strong as the sample?")}</span>
              <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={() => nilai(true)}>
                {t("Sudah kuat", "Yes, strong")}
              </button>
              <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={() => nilai(false)}>
                {t("Perlu latihan lagi", "Needs more practice")}
              </button>
            </>
          )}
          {fase !== "siap" && fase !== "ulas" && (
            <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={lanjut}>
              <SkipForward size={15} />{" "}{t("Lewati", "Skip")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PANEL UTAMA                                                        */
/* ------------------------------------------------------------------ */
export function LatihanInterviewPanel() {
  const hp = useLayarKecil(600);

  const [kategoriAktif, setKategoriAktif] = useState(KATEGORI_INTERVIEW[0].id);
  const [cari, setCari] = useState("");
  const [dibuka, setDibuka] = useState(null); // "katId-nomor"
  const [ditandai, setDitandai] = useState(new Set());
  const [hanyaDitandai, setHanyaDitandai] = useState(false);
  const [tantangan, setTantangan] = useState(false);

  const kunci = (katId, nomor) => `${katId}-${nomor}`;

  const toggleTandai = (katId, nomor) => {
    const k = kunci(katId, nomor);
    setDitandai((prev) => {
      const baru = new Set(prev);
      baru.has(k) ? baru.delete(k) : baru.add(k);
      return baru;
    });
  };

  /* Pencarian menembus semua kategori; tanpa kata kunci, hanya kategori
     aktif yang ditampilkan supaya daftarnya tidak membanjiri layar. */
  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();

    const sumber = q
      ? KATEGORI_INTERVIEW
      : KATEGORI_INTERVIEW.filter((k) => k.id === kategoriAktif);

    return sumber
      .map((k) => ({
        ...k,
        pertanyaan: k.pertanyaan.filter((p) => {
          if (hanyaDitandai && !ditandai.has(kunci(k.id, p.nomor)))
            return false;
          if (!q) return true;
          return (
            p.pertanyaan.toLowerCase().includes(q) ||
            p.strategi.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((k) => k.pertanyaan.length > 0);
  }, [cari, kategoriAktif, hanyaDitandai, ditandai]);

  const jumlahHasil = hasil.reduce((n, k) => n + k.pertanyaan.length, 0);
  const sedangMencari = cari.trim().length > 0;

  return (
    <div
      style={{
        padding: hp ? "16px 14px" : 28,
        maxWidth: 820,
        margin: "0 auto",
      }}
    >
      {/* Kepala halaman */}
      <Glass style={{ padding: hp ? 18 : 22, marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 6,
          }}
        >
          <MessageSquareQuote size={17} color={T.accent} />
          <span style={{ fontSize: 16, fontWeight: 600, color: T.ink }}>
            {t("Latihan Pertanyaan Interview", "Interview Question Practice")}
          </span>
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: T.inkSoft,
            lineHeight: 1.65,
            marginBottom: 14,
          }}
        >
          {TOTAL_PERTANYAAN}{" "}{t("pertanyaan, mulai dari yang sering menjebak sampai level neraka, ditambah kasus hitung cepat dan interview bahasa Inggris. Klik pertanyaan untuk melihat apa yang sebenarnya diuji, strategi, dan contoh jawabannya.", "questions, from common traps to the brutal ones, plus quick-maths cases and English interviews. Click a question to see what's really being tested, a strategy, and a sample answer.")}
        </div>
        {!tantangan && (
          <button type="button" className="lt-mulai" onClick={() => setTantangan(true)}>
            <span className="ic">
              <Zap size={18} />
            </span>
            <span>
              <b>{t("Mode tantangan", "Challenge mode")}</b>
              <small>{t("Pertanyaan acak, 20 detik berpikir, 2 menit menjawab. Berani?", "A random question, 20 seconds to think, 2 minutes to answer. Up for it?")}</small>
            </span>
            <Play size={16} />
          </button>
        )}

        {/* Pencarian */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <Search
            size={14}
            color={T.inkFaint}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder={t("Cari pertanyaan atau kata kunci...", "Search questions or keywords...")}
            style={{
              width: "100%",
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "9px 12px 9px 34px",
              fontSize: 13,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              background: "var(--t-field)",
              outline: "none",
              color: T.ink,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Saring: hanya yang ditandai */}
        {ditandai.size > 0 && (
          <button
            onClick={() => setHanyaDitandai((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: 99,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              border: `1px solid ${hanyaDitandai ? T.accent : T.border}`,
              background: hanyaDitandai ? T.accentSoft : "transparent",
              color: hanyaDitandai ? T.accent : T.inkSoft,
            }}
          >
            <BookmarkCheck size={12} />
            {t("Ditandai (", "Marked (")}{ditandai.size})
          </button>
        )}
      </Glass>

      {tantangan && <ModeTantangan onTutup={() => setTantangan(false)} />}

      {/* Tab kategori — disembunyikan saat mencari, karena pencarian
          memang sengaja menembus semua kategori sekaligus. */}
      {!sedangMencari && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 14,
          }}
        >
          {KATEGORI_INTERVIEW.map((k) => {
            const Ikon = IKON[k.ikon] ?? Puzzle;
            const aktif = k.id === kategoriAktif;
            return (
              <button
                key={k.id}
                onClick={() => {
                  setKategoriAktif(k.id);
                  setDibuka(null);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "7px 13px",
                  borderRadius: 99,
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  border: `1px solid ${aktif ? T.accent : T.border}`,
                  background: aktif ? T.accentSoft : "var(--t-field)",
                  color: aktif ? T.accent : T.inkSoft,
                }}
              >
                <Ikon size={13} />
                {k.namaPendek}
              </button>
            );
          })}
        </div>
      )}

      {/* Keterangan jumlah hasil */}
      <div style={{ fontSize: 11.5, color: T.inkFaint, marginBottom: 10 }}>
        {sedangMencari
          ? t(`${jumlahHasil} pertanyaan cocok dengan pencarianmu`, `${jumlahHasil} questions match your search`)
          : hanyaDitandai
            ? t(`${jumlahHasil} pertanyaan ditandai di kategori ini`, `${jumlahHasil} marked questions in this category`)
            : t(`${jumlahHasil} pertanyaan di kategori ini`, `${jumlahHasil} questions in this category`)}
      </div>

      {/* Daftar pertanyaan */}
      {jumlahHasil === 0 ? (
        <Glass style={{ padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.7 }}>
            {hanyaDitandai
              ? t("Belum ada pertanyaan yang ditandai di kategori ini.", "No marked questions in this category yet.")
              : t("Tidak ada pertanyaan yang cocok. Coba kata kunci lain.", "No matching questions. Try another keyword.")}
          </div>
        </Glass>
      ) : (
        hasil.map((k) => (
          <div key={k.id} style={{ marginBottom: 18 }}>
            {/* Judul kategori hanya perlu saat hasil pencarian bercampur
                dari beberapa kategori sekaligus. */}
            {sedangMencari && (
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: T.inkSoft,
                  letterSpacing: "0.03em",
                  marginBottom: 8,
                }}
              >
                {k.namaPendek.toUpperCase()}
              </div>
            )}

            {k.pertanyaan.map((p) => (
              <KartuPertanyaan
                key={`${k.id}-${p.nomor}`}
                item={{ ...p, level: k.level }}
                dibuka={dibuka === kunci(k.id, p.nomor)}
                onToggle={() =>
                  setDibuka((d) =>
                    d === kunci(k.id, p.nomor) ? null : kunci(k.id, p.nomor),
                  )
                }
                ditandai={ditandai.has(kunci(k.id, p.nomor))}
                onTandai={() => toggleTandai(k.id, p.nomor)}
              />
            ))}
          </div>
        ))
      )}

      {/* Tawaran pelatihan ditaruh di bawah daftar, bukan di atas.
          Orang datang ke halaman ini untuk membaca pertanyaannya —
          menaruh tawaran di depan akan menghalangi itu. Yang sudah
          menggulir sampai bawah justru sedang serius mempersiapkan diri. */}
      <KartuPelatihan />
    </div>
  );
}
