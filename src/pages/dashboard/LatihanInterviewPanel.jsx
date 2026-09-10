import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { T } from "../../theme";
import { Glass } from "../../components/ui/Glass";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { KATEGORI_INTERVIEW, TOTAL_PERTANYAAN } from "../../data/interviewBank";

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
        </div>

        {/* Penanda "latih lagi" — dihentikan propagasinya supaya tidak
            ikut membuka/menutup kartu saat diklik. */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTandai();
          }}
          title={
            ditandai ? "Hapus dari daftar latihan" : "Tandai untuk dilatih"
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: T.teal,
              letterSpacing: "0.04em",
              marginBottom: 7,
            }}
          >
            <Lightbulb size={12} /> STRATEGI MENJAWAB
          </div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.75 }}>
            {item.strategi}
          </div>
        </div>
      )}
    </Glass>
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
            Latihan Pertanyaan Interview
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
          {TOTAL_PERTANYAAN} pertanyaan yang paling sering menjebak, lengkap
          dengan strategi menjawabnya. Klik pertanyaan untuk melihat cara
          menjawab yang disarankan.
        </div>

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
            placeholder="Cari pertanyaan atau kata kunci..."
            style={{
              width: "100%",
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "9px 12px 9px 34px",
              fontSize: 13,
              fontFamily: "'Poppins', sans-serif",
              background: "rgba(255,255,255,0.6)",
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
              fontFamily: "'Poppins', sans-serif",
              border: `1px solid ${hanyaDitandai ? T.accent : T.border}`,
              background: hanyaDitandai ? T.accentSoft : "transparent",
              color: hanyaDitandai ? T.accent : T.inkSoft,
            }}
          >
            <BookmarkCheck size={12} />
            Ditandai ({ditandai.size})
          </button>
        )}
      </Glass>

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
                  fontFamily: "'Poppins', sans-serif",
                  border: `1px solid ${aktif ? T.accent : T.border}`,
                  background: aktif ? T.accentSoft : "rgba(255,255,255,0.5)",
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
          ? `${jumlahHasil} pertanyaan cocok dengan pencarianmu`
          : hanyaDitandai
            ? `${jumlahHasil} pertanyaan ditandai di kategori ini`
            : `${jumlahHasil} pertanyaan di kategori ini`}
      </div>

      {/* Daftar pertanyaan */}
      {jumlahHasil === 0 ? (
        <Glass style={{ padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.7 }}>
            {hanyaDitandai
              ? "Belum ada pertanyaan yang ditandai di kategori ini."
              : "Tidak ada pertanyaan yang cocok. Coba kata kunci lain."}
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
                item={p}
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
    </div>
  );
}
