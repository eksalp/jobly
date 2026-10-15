import React from "react";
import { Mic, Volume2, Loader2, Hand } from "lucide-react";
import { t } from "../../i18n.js";

/**
 * Avatar pewawancara: ilustrasi seorang HRD perempuan.
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

export function PewawancaraHRD({ keadaan = "diam", tingkat = 0, tingkatAi = 0, ukuran = 180 }) {
  const bicara = keadaan === "bicara";
  const mendengar = keadaan === "mendengar";
  const berpikir = keadaan === "berpikir";

  // Bukaan mulut 0-1. Saat AI bicara tetapi suaranya sedang di jeda antar
  // kata, mulut menutup sebentar seperti orang sungguhan.
  const buka = bicara ? Math.min(1, tingkatAi * 1.6) : 0;
  const mulut = `M${110.5 - buka} 132 Q120 ${129 - buka * 1.5} ${129.5 + buka} 132 Q120 ${134 + buka * 13} ${110.5 - buka} 132 Z`;

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
              <stop offset="0" stopColor="#EAF1FB" />
              <stop offset="1" stopColor="#D5E1F3" />
            </linearGradient>
            <linearGradient id="hrd-jilbab" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C8939C" />
              <stop offset="1" stopColor="#B07C86" />
            </linearGradient>
            <linearGradient id="hrd-jas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2B4470" />
              <stop offset="1" stopColor="#1F3354" />
            </linearGradient>
          </defs>

          <g clipPath="url(#hrd-klip)">
            {/* Latar: ruang kantor yang terang */}
            <rect width="240" height="240" fill="url(#hrd-latar)" />
            <rect x="22" y="34" width="54" height="78" rx="4" fill="#F7FAFE" opacity="0.75" />
            <line x1="49" y1="34" x2="49" y2="112" stroke="#D5E1F3" strokeWidth="3" />
            <line x1="22" y1="73" x2="76" y2="73" stroke="#D5E1F3" strokeWidth="3" />
            <g opacity="0.55">
              <ellipse cx="200" cy="132" rx="9" ry="20" fill="#7FB59A" transform="rotate(-18 200 132)" />
              <ellipse cx="214" cy="140" rx="8" ry="18" fill="#6AA587" transform="rotate(22 214 140)" />
              <ellipse cx="206" cy="118" rx="7" ry="16" fill="#8CC2A6" />
            </g>

            <g transform="translate(120 252) scale(1.22) translate(-120 -240)">
            <g className="hrd-tubuh">
              {/* Bahu dan blazer */}
              <path d="M26 240 C30 204 60 184 96 178 L144 178 C180 184 210 204 214 240 Z" fill="url(#hrd-jas)" />
              {/* Ujung jilbab yang jatuh di dada */}
              <path d="M82 146 C78 176 90 200 120 212 C150 200 162 176 158 146 Z" fill="url(#hrd-jilbab)" />
              <path d="M120 212 C104 204 92 190 88 170" fill="none" stroke="#9E6C76" strokeWidth="1.6" opacity="0.6" />
              {/* Kerah blazer */}
              <path d="M96 178 L114 214 L104 240 L80 240 C80 214 86 192 96 178 Z" fill="#33507F" />
              <path d="M144 178 L126 214 L136 240 L160 240 C160 214 154 192 144 178 Z" fill="#33507F" />
              {/* Tali dan kartu identitas */}
              <path d="M110 200 L128 226" stroke="#1D5BF0" strokeWidth="2.4" />
              <path d="M132 200 L130 226" stroke="#1D5BF0" strokeWidth="2.4" />
              <rect x="119" y="222" width="22" height="16" rx="2.5" fill="#FFFFFF" />
              <rect x="119" y="222" width="22" height="4.5" rx="2" fill="#1D5BF0" />
              <rect x="123" y="229.5" width="9" height="2" rx="1" fill="#94A3B8" />

              <g className="hrd-kepala">
                {/* Jilbab bagian kepala */}
                <path
                  d="M120 42 C80 42 63 74 65 108 C67 136 78 152 94 162 L146 162 C162 152 173 136 175 108 C177 74 160 42 120 42 Z"
                  fill="url(#hrd-jilbab)"
                />
                <ellipse cx="120" cy="111" rx="36" ry="42" fill="#A56F7A" />
                {/* Wajah */}
                <ellipse cx="120" cy="113" rx="32" ry="38" fill="#E9B993" />
                <path d="M93 128 C98 146 108 151 120 151 C132 151 142 146 147 128 C140 140 131 145 120 145 C109 145 100 140 93 128 Z" fill="#DCA67F" opacity="0.55" />
                {/* Ciput di dahi */}
                <path d="M86 102 C85 72 155 72 154 102 C147 88 133 82 120 82 C107 82 93 88 86 102 Z" fill="#B98590" />

                {/* Alis */}
                <g className="hrd-alis">
                  <path d="M99 98 Q106 93.5 114 96.5" fill="none" stroke="#4A3428" strokeWidth="2.6" strokeLinecap="round" />
                  <path d="M126 96.5 Q134 93.5 141 98" fill="none" stroke="#4A3428" strokeWidth="2.6" strokeLinecap="round" />
                </g>

                {/* Mata */}
                <g className="hrd-mata">
                  <g className="hrd-kedip">
                    <ellipse cx="107" cy="107" rx="3.8" ry="4.4" fill="#2B2018" />
                    <circle cx="108.3" cy="105.6" r="1.2" fill="#FFFFFF" />
                  </g>
                  <g className="hrd-kedip">
                    <ellipse cx="133" cy="107" rx="3.8" ry="4.4" fill="#2B2018" />
                    <circle cx="134.3" cy="105.6" r="1.2" fill="#FFFFFF" />
                  </g>
                </g>

                {/* Hidung dan pipi */}
                <path d="M120 110 Q116.5 119 119.5 122 Q122 123 124.5 121" fill="none" stroke="#C98F6C" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="100" cy="124" r="6.5" fill="#EE8F86" opacity="0.32" />
                <circle cx="140" cy="124" r="6.5" fill="#EE8F86" opacity="0.32" />

                {/* Mulut */}
                {buka < 0.06 ? (
                  <path d="M110.5 131.5 Q120 138.5 129.5 131.5" fill="none" stroke="#A4464F" strokeWidth="2.6" strokeLinecap="round" />
                ) : (
                  <g>
                    <clipPath id="hrd-mulut">
                      <path d={mulut} />
                    </clipPath>
                    <path d={mulut} fill="#6E2830" />
                    <g clipPath="url(#hrd-mulut)">
                      <rect x="110" y={128.5 - buka} width="20" height="4.2" rx="1.5" fill="#FFFFFF" opacity="0.92" />
                      <ellipse cx="120" cy={134 + buka * 8} rx="7" ry="4.5" fill="#C65B66" />
                    </g>
                    <path d={mulut} fill="none" stroke="#A4464F" strokeWidth="1.8" strokeLinejoin="round" />
                  </g>
                )}
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
        <span>{t("HR Recruiter", "HR Recruiter")}</span>
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
.hrd-berpikir .hrd-mata{transform:translate(2px,-2.5px)}
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
