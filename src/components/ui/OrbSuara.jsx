import React from "react";
import { Mic, Volume2, Loader2 } from "lucide-react";
import { T } from "../../theme";

/**
 * Orb suara — penanda giliran bicara.
 *
 * Dalam percakapan suara, user tidak melihat teks; mereka perlu tahu
 * dalam sekali lihat: sekarang giliran siapa. Warna dan gerakannya
 * dibedakan tajam antar-keadaan supaya bisa ditangkap dari sudut mata,
 * tanpa harus membaca label.
 *
 * `tingkat` (0-1) menggerakkan denyutnya mengikuti kerasnya suara, jadi
 * user langsung tahu mikrofonnya benar-benar menangkap suaranya —
 * keraguan paling umum saat berbicara ke aplikasi.
 */
export function OrbSuara({ keadaan, tingkat = 0, ukuran = 150 }) {
  const KEADAAN = {
    diam: {
      warna: "#94A3B8",
      warna2: "#CBD5E1",
      label: "Bersiap...",
      Ikon: Mic,
    },
    mendengar: {
      warna: "#4C63E0",
      warna2: "#818CF8",
      label: "Mendengarkan",
      Ikon: Mic,
    },
    berpikir: {
      warna: "#B45309",
      warna2: "#F59E0B",
      label: "Sedang berpikir",
      Ikon: Loader2,
    },
    bicara: {
      warna: "#0F7B4F",
      warna2: "#34D399",
      label: "AI sedang bicara",
      Ikon: Volume2,
    },
  };

  const k = KEADAAN[keadaan] ?? KEADAAN.diam;
  const { Ikon } = k;

  // Denyut mengikuti suara saat mendengarkan; saat AI bicara dipakai
  // denyut tetap karena kita tidak punya data amplitudo keluarannya.
  const skala = keadaan === "mendengar" ? 1 + Math.min(0.22, tingkat * 0.3) : 1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "8px 0",
      }}
    >
      <div
        style={{
          position: "relative",
          width: ukuran,
          height: ukuran,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Lingkaran gema — memberi kesan hidup tanpa mengalihkan perhatian */}
        {(keadaan === "mendengar" || keadaan === "bicara") && (
          <>
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: k.warna,
                opacity: 0.14,
                animation: "orbGema 2.4s ease-out infinite",
              }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: k.warna,
                opacity: 0.14,
                animation: "orbGema 2.4s ease-out infinite 1.2s",
              }}
            />
          </>
        )}

        {/* Orb utama */}
        <div
          style={{
            position: "relative",
            width: ukuran * 0.68,
            height: ukuran * 0.68,
            borderRadius: "50%",
            background: `radial-gradient(circle at 32% 28%, ${k.warna2}, ${k.warna})`,
            boxShadow: `0 10px 40px ${k.warna}55, inset 0 -8px 24px rgba(0,0,0,0.14)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            transform: `scale(${skala})`,
            // Transisi cepat supaya denyutnya terasa mengikuti suara,
            // bukan tertinggal di belakangnya.
            transition:
              "transform .12s ease-out, background .4s, box-shadow .4s",
            animation:
              keadaan === "berpikir"
                ? "orbNapas 1.6s ease-in-out infinite"
                : keadaan === "bicara"
                  ? "orbNapas 2s ease-in-out infinite"
                  : "none",
          }}
        >
          <Ikon
            size={ukuran * 0.2}
            style={
              keadaan === "berpikir"
                ? { animation: "spin 1s linear infinite" }
                : undefined
            }
          />
        </div>
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: k.warna,
          letterSpacing: "0.01em",
        }}
      >
        {k.label}
      </div>

      <style>{`
        @keyframes orbGema {
          0%   { transform: scale(0.72); opacity: 0.22; }
          70%  { opacity: 0.05; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes orbNapas {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
      `}</style>
    </div>
  );
}
