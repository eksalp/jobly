import React from "react";
import { Mic, Volume2, Loader2, Hand } from "lucide-react";
import { t } from "../../i18n.js";

/**
 * Avatar pewawancara: ilustrasi kartun seorang HRD perempuan berblazer
 * abu-abu dengan rambut disanggul, tersenyum dan bersedekap.
 *
 * Keadaan:
 *   diam      → bernapas pelan dan berkedip, menunggu giliran kandidat
 *   mendengar → kandidat sedang bicara: alis terangkat, mengangguk pelan,
 *               cincin di sekeliling avatar mengikuti suara kandidat
 *   berpikir  → menyiapkan sesi atau penilaian: mata melirik ke atas
 *   bicara    → mulut bergerak mengikuti kerasnya suara pewawancara
 *
 * `tingkatAi` (0-1) diukur dari audio pewawancara, `tingkat` (0-1) dari
 * mikrofon kandidat.
 */
export const NAMA_PEWAWANCARA = "Rina";

export function PewawancaraHRD({ keadaan = "diam", tingkat = 0, tingkatAi = 0, ukuran = 180, peran }) {
  const bicara = keadaan === "bicara";
  const mendengar = keadaan === "mendengar";
  const berpikir = keadaan === "berpikir";

  // Bukaan mulut 0-1. Saat AI bicara tetapi suaranya sedang di jeda antar
  // kata, mulut menutup sebentar seperti orang sungguhan.
  const buka = bicara ? Math.min(1, tingkatAi * 1.6) : 0;
  // Senyum lebar dengan gigi terlihat; bibir bawah turun saat bicara.
  const mulut = `M${104 - buka * 2} 121 Q120 ${126 - buka * 2} ${136 + buka * 2} 121 Q120 ${134 + buka * 16} ${104 - buka * 2} 121 Z`;

  const LABEL = {
    diam: { teks: t("Giliranmu", "Your turn"), Ikon: Hand, warna: "#64748B" },
    mendengar: { teks: t(`${NAMA_PEWAWANCARA} mendengarkan`, `${NAMA_PEWAWANCARA} is listening`), Ikon: Mic, warna: "#1D5BF0" },
    berpikir: { teks: t("Sedang menyiapkan...", "Getting ready..."), Ikon: Loader2, warna: "#B45309" },
    bicara: { teks: t(`${NAMA_PEWAWANCARA} sedang bicara`, `${NAMA_PEWAWANCARA} is speaking`), Ikon: Volume2, warna: "#0F7B4F" },
  };
  const l = LABEL[keadaan] ?? LABEL.diam;
  const { Ikon } = l;

  // Cincin luar: mengikuti suara kandidat saat mendengar, suara AI saat bicara.
  const denyut = mendengar ? Math.min(1, tingkat * 1.4) : bicara ? Math.min(1, tingkatAi * 1.2) : 0;

  return (
    <div className="hrd" style={{ "--hrd-ukuran": `${ukuran}px` }}>
      <style>{CSS}</style>
      <div
        className={`hrd-bingkai hrd-${keadaan}`}
        style={{
          "--hrd-warna": l.warna,
          boxShadow: `0 0 0 ${3 + denyut * 10}px color-mix(in srgb, ${l.warna} ${Math.round(14 + denyut * 22)}%, transparent)`,
        }}
      >
        <svg viewBox="0 0 240 240" width={ukuran} height={ukuran} role="img" aria-label={l.teks}>
          <defs>
            <clipPath id="hrd-klip">
              <circle cx="120" cy="120" r="120" />
            </clipPath>
            <linearGradient id="hrd-latar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#EEF3FB" />
              <stop offset="1" stopColor="#DCE6F5" />
            </linearGradient>
            <radialGradient id="hrd-kulit" cx="0.45" cy="0.38" r="0.7">
              <stop offset="0" stopColor="#FAD3B4" />
              <stop offset="1" stopColor="#EDB590" />
            </radialGradient>
            <linearGradient id="hrd-rambut" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8A5530" />
              <stop offset="1" stopColor="#5E3519" />
            </linearGradient>
            <linearGradient id="hrd-jas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7A7F88" />
              <stop offset="1" stopColor="#5F646D" />
            </linearGradient>
            <clipPath id="hrd-mulut">
              <path d={mulut} />
            </clipPath>
          </defs>

          <g clipPath="url(#hrd-klip)">
            {/* Latar: ruang kantor yang terang */}
            <rect width="240" height="240" fill="url(#hrd-latar)" />
            <rect x="18" y="40" width="50" height="74" rx="4" fill="#F8FBFF" opacity="0.8" />
            <line x1="43" y1="40" x2="43" y2="114" stroke="#DCE6F5" strokeWidth="3" />
            <line x1="18" y1="77" x2="68" y2="77" stroke="#DCE6F5" strokeWidth="3" />
            <g opacity="0.5">
              <ellipse cx="204" cy="128" rx="8" ry="19" fill="#7FB59A" transform="rotate(-18 204 128)" />
              <ellipse cx="218" cy="136" rx="7" ry="17" fill="#6AA587" transform="rotate(22 218 136)" />
              <ellipse cx="210" cy="114" rx="6.5" ry="15" fill="#8CC2A6" />
            </g>

            <g transform="translate(120 126) scale(1.12) translate(-120 -126)">
            <g className="hrd-tubuh">
              {/* Rambut bagian belakang */}
              <path d="M70 104 C66 64 92 44 122 44 C154 44 176 66 172 104 C170 128 160 146 150 152 L92 152 C80 146 72 128 70 104 Z" fill="#5E3519" />

              {/* Leher */}
              <path d="M106 138 L106 166 C112 172 128 172 134 166 L134 138 Z" fill="#E8AC86" />

              {/* Blazer abu-abu dan kemeja putih */}
              <path d="M22 240 C26 198 56 176 98 168 L142 168 C184 176 214 198 218 240 Z" fill="url(#hrd-jas)" />
              <path d="M101 167 L120 204 L139 167 C134 174 106 174 101 167 Z" fill="#F4F6FA" />
              <path d="M100 166 L112 196 L96 186 L94 172 Z" fill="#FFFFFF" stroke="#D5DAE3" strokeWidth="1" />
              <path d="M140 166 L128 196 L144 186 L146 172 Z" fill="#FFFFFF" stroke="#D5DAE3" strokeWidth="1" />
              <path d="M96 170 L120 214 L108 240 L76 240 C76 210 84 184 96 170 Z" fill="#585D66" />
              <path d="M144 170 L120 214 L132 240 L164 240 C164 210 156 184 144 170 Z" fill="#585D66" />

              {/* Tangan bersedekap */}
              <path d="M44 214 C44 202 58 196 72 198 L176 206 C190 208 194 226 182 232 L66 236 C52 236 44 226 44 214 Z" fill="#6E737C" />
              <path d="M196 220 C196 208 182 202 168 204 L64 212 C50 214 46 232 58 238 L176 240 C190 240 196 232 196 220 Z" fill="url(#hrd-jas)" />
              <rect x="160" y="203" width="12" height="16" rx="3" fill="#FFFFFF" transform="rotate(8 166 211)" />
              <rect x="68" y="208" width="12" height="17" rx="3" fill="#FFFFFF" transform="rotate(-6 74 216)" />
              <ellipse cx="180" cy="211" rx="12" ry="9" fill="#F2BE98" transform="rotate(-18 180 211)" />
              <ellipse cx="60" cy="218" rx="12" ry="9" fill="#F2BE98" transform="rotate(14 60 218)" />

              <g className="hrd-kepala">
                {/* Telinga */}
                <ellipse cx="77" cy="106" rx="7" ry="10" fill="#EDB590" />
                <ellipse cx="163" cy="106" rx="7" ry="10" fill="#EDB590" />
                {/* Wajah */}
                <ellipse cx="120" cy="100" rx="44" ry="47" fill="url(#hrd-kulit)" />

                {/* Rambut depan dan sanggul */}
                <circle cx="156" cy="40" r="19" fill="url(#hrd-rambut)" />
                <path d="M144 36 C150 28 164 30 166 40 M146 46 C154 50 164 46 168 40" fill="none" stroke="#9C6639" strokeWidth="2.2" strokeLinecap="round" />
                <path
                  d="M74 104 C68 64 94 48 122 48 C150 48 172 64 166 102 C162 86 152 72 136 66 C128 78 108 84 86 84 C80 90 76 96 74 104 Z"
                  fill="url(#hrd-rambut)"
                />
                <path d="M100 58 C112 52 132 52 146 60" fill="none" stroke="#A06A3C" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
                <path d="M76 104 C74 118 76 128 80 134" fill="none" stroke="#6B3D1E" strokeWidth="3" strokeLinecap="round" />
                <path d="M164 102 C166 116 164 126 160 132" fill="none" stroke="#6B3D1E" strokeWidth="3" strokeLinecap="round" />

                {/* Alis */}
                <g className="hrd-alis">
                  <path d="M94 88 Q103 82 112 86" fill="none" stroke="#6B3D1E" strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M128 86 Q137 82 146 88" fill="none" stroke="#6B3D1E" strokeWidth="3.4" strokeLinecap="round" />
                </g>

                {/* Mata besar */}
                <g className="hrd-mata">
                  {[103, 137].map((x) => (
                    <g key={x} className="hrd-kedip">
                      <ellipse cx={x} cy="102" rx="10" ry="11" fill="#FFFFFF" />
                      <circle cx={x + 1} cy="103" r="7" fill="#7A4A22" />
                      <circle cx={x + 1} cy="103" r="3.6" fill="#1F140C" />
                      <circle cx={x + 3.4} cy="100" r="2" fill="#FFFFFF" />
                      <path d={`M${x - 11} 99 Q${x} 88 ${x + 11} 98`} fill="none" stroke="#2B1A10" strokeWidth="2.8" strokeLinecap="round" />
                    </g>
                  ))}
                </g>

                {/* Hidung dan pipi */}
                <path d="M118 110 Q116 117 120 118 Q123 118 124 116" fill="none" stroke="#D99572" strokeWidth="2" strokeLinecap="round" />
                <circle cx="94" cy="118" r="7.5" fill="#F29A8E" opacity="0.35" />
                <circle cx="146" cy="118" r="7.5" fill="#F29A8E" opacity="0.35" />

                {/* Mulut: selalu tersenyum, terbuka lebih lebar saat bicara */}
                <path d={mulut} fill="#7A2B33" />
                <g clipPath="url(#hrd-mulut)">
                  <rect x="100" y="120" width="40" height="6" rx="2" fill="#FFFFFF" />
                  <ellipse cx="120" cy={133 + buka * 9} rx="9" ry="6" fill="#D2646F" />
                </g>
                <path d={mulut} fill="none" stroke="#B4505A" strokeWidth="1.6" strokeLinejoin="round" />
              </g>
            </g>
            </g>
          </g>
        </svg>

        {berpikir && (
          <span className="hrd-titik" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
      </div>

      <div className="hrd-nama">
        <b>{NAMA_PEWAWANCARA}</b>
        <span>{peran || t("HR Recruiter", "HR Recruiter")}</span>
      </div>
      <div className="hrd-status" style={{ color: l.warna }}>
        <Ikon size={13} className={berpikir ? "hrd-putar" : undefined} />
        {l.teks}
      </div>
    </div>
  );
}

const CSS = `
.hrd{display:flex;flex-direction:column;align-items:center;gap:10px;padding:6px 0}
.hrd-bingkai{position:relative;width:var(--hrd-ukuran);height:var(--hrd-ukuran);border-radius:50%;transition:box-shadow .12s linear;background:#EAF1FB}
.hrd-bingkai svg{display:block;border-radius:50%}
.hrd-nama{display:flex;align-items:baseline;gap:6px;font-size:14px;color:var(--t-ink,#0f172a)}
.hrd-nama span{font-size:12px;color:var(--t-ink-soft,#64748b)}
.hrd-status{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;padding:4px 11px;border-radius:999px;background:color-mix(in srgb,currentColor 10%,transparent)}
.hrd-putar{animation:hrd-putar 1s linear infinite}
@keyframes hrd-putar{to{transform:rotate(360deg)}}

.hrd-tubuh{transform-origin:120px 240px;animation:hrd-napas 4.2s ease-in-out infinite}
@keyframes hrd-napas{0%,100%{transform:scale(1)}50%{transform:scale(1.012,1.018)}}
.hrd-kepala{transform-origin:120px 160px;transition:transform .4s ease}
.hrd-kedip{transform-box:fill-box;transform-origin:center;animation:hrd-kedip 4.6s infinite}
@keyframes hrd-kedip{0%,93%,100%{transform:scaleY(1)}95.5%{transform:scaleY(.1)}}
.hrd-alis,.hrd-mata{transition:transform .35s ease}

.hrd-bicara .hrd-kepala{animation:hrd-bicara 2.8s ease-in-out infinite}
@keyframes hrd-bicara{0%,100%{transform:rotate(0)}30%{transform:rotate(-1.6deg)}70%{transform:rotate(1.2deg)}}
.hrd-mendengar .hrd-kepala{animation:hrd-angguk 2.6s ease-in-out infinite}
@keyframes hrd-angguk{0%,60%,100%{transform:translateY(0) rotate(1deg)}75%{transform:translateY(2.5px) rotate(1deg)}}
.hrd-mendengar .hrd-alis{transform:translateY(-2px)}
.hrd-berpikir .hrd-mata{transform:translate(1.5px,-2px)}
.hrd-berpikir .hrd-alis{transform:translateY(-1.5px)}

.hrd-titik{position:absolute;top:8%;right:2%;display:flex;gap:4px;padding:7px 9px;border-radius:14px;background:#fff;box-shadow:0 4px 14px rgba(15,23,42,.15)}
.hrd-titik i{width:6px;height:6px;border-radius:50%;background:#B45309;animation:hrd-titik 1.1s infinite ease-in-out}
.hrd-titik i:nth-child(2){animation-delay:.15s}
.hrd-titik i:nth-child(3){animation-delay:.3s}
@keyframes hrd-titik{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}

@media (prefers-reduced-motion: reduce){
  .hrd-tubuh,.hrd-kepala,.hrd-kedip,.hrd-titik i{animation:none!important}
}
`;
