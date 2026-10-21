import React from "react";

/**
 * Ilustrasi kartun peserta FGD (setengah badan, dalam lingkaran).
 *
 *   siapa:  moderator | dimas | ayu | fajar | kamu
 *   bicara: mulut bergerak mengikuti `tingkat` (0-1)
 *   berpikir: titik-titik di samping kepala
 *
 * Gaya gambarnya sama dengan pewawancara Rina di simulasi interview.
 */
const GAYA = {
  moderator: { kulit: ["#FAD3B4", "#EDB590"], rambut: "#3B2414", baju: ["#1F3A5F", "#16304F"], kerah: "#FFFFFF", latar: ["#EEF3FB", "#DCE6F5"], model: "sanggul" },
  dimas: { kulit: ["#F2C29E", "#E0A57D"], rambut: "#1F1A17", baju: ["#2F6FD6", "#2559B3"], kerah: "#DCE8FB", latar: ["#EAF2FF", "#D6E4FB"], model: "pendek" },
  ayu: { kulit: ["#F6CDB0", "#E8B08C"], rambut: "#C98A9A", baju: ["#F4F1EC", "#E3DED6"], kerah: "#C98A9A", latar: ["#FFF1F4", "#F8DDE4"], model: "hijab", kacamata: true },
  fajar: { kulit: ["#D9A27C", "#C48963"], rambut: "#2A1D14", baju: ["#2E9C6A", "#24805A"], kerah: "#BFE7D3", latar: ["#ECFAF2", "#D3F0E1"], model: "keriting" },
  kamu: { kulit: ["#E7D9C9", "#D6C4B0"], rambut: "#5B6474", baju: ["#5B6474", "#4A5261"], kerah: "#8C96A6", latar: ["#F3F5F8", "#E2E7EE"], model: "siluet" },
};

export function AvatarFgd({ siapa = "dimas", bicara = false, tingkat = 0, berpikir = false, ukuran = 96 }) {
  const g = GAYA[siapa] || GAYA.dimas;
  const id = `fgd-${siapa}`;
  const buka = bicara ? Math.min(1, 0.25 + tingkat * 1.5) : 0;
  const mulut = `M${106 - buka * 2} 124 Q120 ${128 - buka * 2} ${134 + buka * 2} 124 Q120 ${134 + buka * 16} ${106 - buka * 2} 124 Z`;
  const siluet = g.model === "siluet";

  return (
    <div className={`fgd-av ${bicara ? "bicara" : ""} ${berpikir ? "berpikir" : ""}`} style={{ width: ukuran, height: ukuran }}>
      <svg viewBox="0 0 240 240" width={ukuran} height={ukuran} aria-hidden="true">
        <defs>
          <clipPath id={`${id}-klip`}>
            <circle cx="120" cy="120" r="120" />
          </clipPath>
          <linearGradient id={`${id}-latar`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={g.latar[0]} />
            <stop offset="1" stopColor={g.latar[1]} />
          </linearGradient>
          <radialGradient id={`${id}-kulit`} cx="0.45" cy="0.38" r="0.7">
            <stop offset="0" stopColor={g.kulit[0]} />
            <stop offset="1" stopColor={g.kulit[1]} />
          </radialGradient>
          <linearGradient id={`${id}-baju`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={g.baju[0]} />
            <stop offset="1" stopColor={g.baju[1]} />
          </linearGradient>
          <clipPath id={`${id}-mulut`}>
            <path d={mulut} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-klip)`}>
          <rect width="240" height="240" fill={`url(#${id}-latar)`} />
          <g transform="translate(120 132) scale(1.16) translate(-120 -132)">
          <g className="fgd-av-tubuh">
            {/* Rambut belakang / hijab belakang */}
            {g.model === "sanggul" && (
              <>
                <path d="M72 104 C68 66 94 46 122 46 C152 46 174 66 170 104 C168 126 158 142 150 148 L92 148 C80 142 74 126 72 104 Z" fill={g.rambut} />
                <circle cx="120" cy="42" r="18" fill={g.rambut} />
              </>
            )}
            {g.model === "hijab" && <path d="M62 112 C58 60 92 36 120 36 C150 36 182 60 178 112 C176 150 166 176 150 186 L90 186 C74 176 64 150 62 112 Z" fill={g.rambut} />}

            {/* Leher */}
            <path d="M106 138 L106 166 C112 172 128 172 134 166 L134 138 Z" fill={g.kulit[1]} />

            {/* Badan */}
            <path d="M22 240 C26 198 56 176 98 168 L142 168 C184 176 214 198 218 240 Z" fill={`url(#${id}-baju)`} />
            {g.model === "hijab" ? (
              <path d="M74 150 C86 178 154 178 166 150 C176 168 172 190 158 200 C140 210 100 210 82 200 C68 190 64 168 74 150 Z" fill={g.rambut} />
            ) : (
              <path d="M100 167 L120 196 L140 167 C134 174 106 174 100 167 Z" fill={g.kerah} />
            )}
            {g.model === "sanggul" && (
              <>
                <path d="M96 170 L120 212 L108 240 L78 240 C78 210 86 184 96 170 Z" fill="#16304F" />
                <path d="M144 170 L120 212 L132 240 L162 240 C162 210 154 184 144 170 Z" fill="#16304F" />
              </>
            )}

            <g className="fgd-av-kepala">
              {!siluet && g.model !== "hijab" && (
                <>
                  <ellipse cx="77" cy="106" rx="7" ry="10" fill={g.kulit[1]} />
                  <ellipse cx="163" cy="106" rx="7" ry="10" fill={g.kulit[1]} />
                </>
              )}
              <ellipse cx="120" cy="102" rx={g.model === "hijab" ? 40 : 44} ry={g.model === "hijab" ? 44 : 47} fill={`url(#${id}-kulit)`} />

              {/* Rambut depan */}
              {g.model === "sanggul" && <path d="M76 104 C70 66 96 50 122 50 C150 50 172 66 166 102 C160 84 148 70 132 66 C124 78 104 84 86 84 C80 90 78 96 76 104 Z" fill={g.rambut} />}
              {g.model === "pendek" && <path d="M76 98 C72 62 96 46 122 46 C150 46 170 62 166 96 C160 82 150 72 138 70 L132 62 L124 72 L114 60 L106 72 L96 66 C86 74 80 86 76 98 Z" fill={g.rambut} />}
              {g.model === "keriting" && (
                <g fill={g.rambut}>
                  {[[84, 74], [96, 60], [112, 54], [128, 54], [144, 60], [156, 74], [80, 90], [160, 90], [104, 66], [136, 66], [120, 62]].map(([x, y]) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="13" />
                  ))}
                </g>
              )}
              {g.model === "hijab" && <path d="M78 96 C80 66 100 54 120 54 C142 54 160 66 162 96 C150 80 134 72 120 72 C104 72 90 80 78 96 Z" fill={g.rambut} opacity="0.92" />}
              {siluet && <path d="M76 96 C72 62 96 48 122 48 C150 48 170 62 166 96 C156 80 140 72 120 72 C100 72 86 80 76 96 Z" fill={g.rambut} />}

              {!siluet && (
                <>
                  {/* Alis */}
                  <path d="M95 89 Q104 84 112 87" fill="none" stroke="#3B2414" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M128 87 Q136 84 145 89" fill="none" stroke="#3B2414" strokeWidth="3.2" strokeLinecap="round" />
                  {/* Mata */}
                  {[104, 136].map((x) => (
                    <g key={x} className="fgd-av-kedip">
                      <ellipse cx={x} cy="103" rx="8.5" ry="9.5" fill="#FFFFFF" />
                      <circle cx={x + 1} cy="104" r="5.8" fill="#5A3A20" />
                      <circle cx={x + 1} cy="104" r="3" fill="#1B120B" />
                      <circle cx={x + 3} cy="101.5" r="1.7" fill="#FFFFFF" />
                    </g>
                  ))}
                  {g.kacamata && (
                    <g fill="none" stroke="#5B4636" strokeWidth="2.6">
                      <rect x="90" y="92" width="28" height="22" rx="8" />
                      <rect x="122" y="92" width="28" height="22" rx="8" />
                      <path d="M118 102 L122 102" />
                    </g>
                  )}
                  <path d="M118 111 Q116 117 120 118 Q123 118 124 116" fill="none" stroke="#C88663" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="95" cy="119" r="7" fill="#F29A8E" opacity="0.3" />
                  <circle cx="145" cy="119" r="7" fill="#F29A8E" opacity="0.3" />
                  {/* Mulut */}
                  <path d={mulut} fill="#7A2B33" />
                  <g clipPath={`url(#${id}-mulut)`}>
                    <rect x="100" y="123" width="40" height="5" rx="2" fill="#FFFFFF" />
                    <ellipse cx="120" cy={135 + buka * 9} rx="9" ry="6" fill="#D2646F" />
                  </g>
                </>
              )}
              {siluet && (
                <path d="M108 124 Q120 130 132 124" fill="none" stroke="#8C96A6" strokeWidth="3" strokeLinecap="round" opacity={bicara ? 1 : 0.6} />
              )}
            </g>
          </g>
          </g>
        </g>
      </svg>
      {berpikir && (
        <span className="fgd-av-titik">
          <i />
          <i />
          <i />
        </span>
      )}
    </div>
  );
}
