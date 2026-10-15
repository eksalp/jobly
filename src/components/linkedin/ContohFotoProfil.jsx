import React from "react";
import "./contoh.css";
import { t } from "../../i18n.js";

/**
 * Contoh gaya foto profil LinkedIn: 5 perempuan (Jane Doe) dan 5 laki-laki
 * (John Doe), digambar sebagai ilustrasi supaya tidak memakai foto orang
 * sungguhan. Setiap contoh menunjukkan satu gaya yang baik beserta
 * kapan gaya itu cocok dipakai.
 */

const KULIT = { terang: "#F3C9A6", sedang: "#E3AC85", sawo: "#C98B62" };

export const CONTOH_FOTO = [
  {
    id: "w1", gender: "w", nama: "Jane Doe",
    gaya: t("Studio, latar polos", "Studio, plain background"),
    cocok: t("Korporat, bank, BUMN", "Corporate, banking, state firms"),
    latar: "polos", warnaLatar: ["#E8EDF4", "#D3DCE8"], kulit: "sedang",
    rambut: "hijab", warnaRambut: "#2F3E5C", baju: "blazer", warnaBaju: "#1F2E4A", dalam: "#FFFFFF",
  },
  {
    id: "w2", gender: "w", nama: "Jane Doe",
    gaya: t("Kantor, latar diburamkan", "Office, blurred background"),
    cocok: t("HR, admin, manajemen", "HR, admin, management"),
    latar: "kantor", kulit: "terang",
    rambut: "sanggul", warnaRambut: "#4A2E1C", baju: "blazer", warnaBaju: "#6B7280", dalam: "#F1F5F9",
  },
  {
    id: "w3", gender: "w", nama: "Jane Doe",
    gaya: t("Luar ruangan, cahaya alami", "Outdoors, natural light"),
    cocok: t("Pendidikan, sosial, kesehatan", "Education, social work, health"),
    latar: "luar", kulit: "sawo",
    rambut: "hijab", warnaRambut: "#C98F9B", baju: "kemeja", warnaBaju: "#F8F4EE", dalam: "#F8F4EE",
  },
  {
    id: "w4", gender: "w", nama: "Jane Doe",
    gaya: t("Smart casual, senyum lebar", "Smart casual, big smile"),
    cocok: t("Startup, kreatif, pemasaran", "Startups, creative, marketing"),
    latar: "hangat", kulit: "sedang",
    rambut: "panjang", warnaRambut: "#2B1B12", baju: "rajut", warnaBaju: "#D97757", dalam: "#D97757",
  },
  {
    id: "w5", gender: "w", nama: "Jane Doe",
    gaya: t("Formal, kemeja putih", "Formal, white shirt"),
    cocok: t("Hukum, konsultan, keuangan", "Law, consulting, finance"),
    latar: "polos", warnaLatar: ["#F1F1EF", "#DEDCD8"], kulit: "terang",
    rambut: "bob", warnaRambut: "#1C1410", baju: "blazer", warnaBaju: "#111827", dalam: "#FFFFFF", kacamata: true,
  },
  {
    id: "m1", gender: "m", nama: "John Doe",
    gaya: t("Studio, jas dan dasi", "Studio, suit and tie"),
    cocok: t("Bank, korporat, pemerintahan", "Banking, corporate, government"),
    latar: "polos", warnaLatar: ["#E6ECF5", "#CDD8E8"], kulit: "sedang",
    rambut: "samping", warnaRambut: "#1C140F", baju: "blazer", warnaBaju: "#1E3A5F", dalam: "#FFFFFF", dasi: "#9F1D2D",
  },
  {
    id: "m2", gender: "m", nama: "John Doe",
    gaya: t("Kantor, kemeja tanpa dasi", "Office, shirt without tie"),
    cocok: t("IT, data, operasional", "IT, data, operations"),
    latar: "kantor", kulit: "sawo",
    rambut: "pendek", warnaRambut: "#15100C", baju: "kemeja", warnaBaju: "#BFD3EA", dalam: "#BFD3EA", kacamata: true,
  },
  {
    id: "m3", gender: "m", nama: "John Doe",
    gaya: t("Batik, rapi dan lokal", "Batik, neat and local"),
    cocok: t("BUMN, pemerintahan, pendidikan", "State firms, government, education"),
    latar: "polos", warnaLatar: ["#F3EEE6", "#E2D8C8"], kulit: "sedang",
    rambut: "pendek", warnaRambut: "#1A120D", baju: "batik", warnaBaju: "#7A4A21", dalam: "#7A4A21",
  },
  {
    id: "m4", gender: "m", nama: "John Doe",
    gaya: t("Luar ruangan, polo", "Outdoors, polo shirt"),
    cocok: t("Sales, lapangan, logistik", "Sales, field work, logistics"),
    latar: "luar", kulit: "terang",
    rambut: "samping", warnaRambut: "#3B2618", baju: "polo", warnaBaju: "#1F6F5C", dalam: "#1F6F5C",
  },
  {
    id: "m5", gender: "m", nama: "John Doe",
    gaya: t("Kreatif, turtleneck", "Creative, turtleneck"),
    cocok: t("Desain, media, teknologi", "Design, media, tech"),
    latar: "hangat", kulit: "sawo",
    rambut: "pendek", warnaRambut: "#110C09", baju: "turtleneck", warnaBaju: "#262A33", dalam: "#262A33", jenggot: true,
  },
];

/* ---------------------------------------------------------- bagian gambar */

function Latar({ c, id }) {
  if (c.latar === "kantor") {
    return (
      <g>
        <rect width="200" height="200" fill="#DCE3EC" />
        <g filter={`url(#blur-${id})`} opacity="0.9">
          <rect x="8" y="20" width="56" height="90" rx="4" fill="#F7FAFD" />
          <rect x="140" y="12" width="60" height="70" rx="4" fill="#EEF3F9" />
          <rect x="120" y="96" width="80" height="20" fill="#B9C6D6" />
          <circle cx="30" cy="140" r="14" fill="#9FC3A8" />
          <circle cx="174" cy="40" r="9" fill="#FFF4D6" />
        </g>
      </g>
    );
  }
  if (c.latar === "luar") {
    return (
      <g>
        <rect width="200" height="200" fill={`url(#luar-${id})`} />
        <g filter={`url(#blur-${id})`}>
          <circle cx="28" cy="40" r="22" fill="#B9DDB0" opacity="0.8" />
          <circle cx="170" cy="30" r="26" fill="#DCEFC8" opacity="0.9" />
          <circle cx="182" cy="110" r="18" fill="#9CCB94" opacity="0.7" />
          <circle cx="16" cy="120" r="16" fill="#CFE8C4" opacity="0.8" />
          <circle cx="150" cy="70" r="7" fill="#FFF7DA" />
        </g>
      </g>
    );
  }
  if (c.latar === "hangat") {
    return (
      <g>
        <rect width="200" height="200" fill="#F4E6D7" />
        <circle cx="168" cy="36" r="46" fill="#F0D4BC" />
        <circle cx="22" cy="170" r="40" fill="#EED9C4" />
      </g>
    );
  }
  const [a, b] = c.warnaLatar || ["#E8EDF4", "#D3DCE8"];
  return <rect width="200" height="200" fill={`url(#polos-${id})`} data-a={a} data-b={b} />;
}

function Baju({ c }) {
  const w = c.warnaBaju;
  const bahu = "M18 200 C22 170 52 152 80 148 L120 148 C148 152 178 170 182 200 Z";
  if (c.baju === "blazer") {
    return (
      <g>
        <path d={bahu} fill={w} />
        <path d="M84 148 L100 186 L116 148 Z" fill={c.dalam} />
        {c.dasi && <path d="M96 156 L104 156 L106 178 L100 188 L94 178 Z" fill={c.dasi} />}
        <path d="M80 148 L96 176 L88 200 L64 200 C64 178 70 160 80 148 Z" fill="rgba(0,0,0,0.18)" />
        <path d="M120 148 L104 176 L112 200 L136 200 C136 178 130 160 120 148 Z" fill="rgba(0,0,0,0.18)" />
      </g>
    );
  }
  if (c.baju === "kemeja" || c.baju === "polo") {
    return (
      <g>
        <path d={bahu} fill={w} />
        <path d="M84 148 L100 166 L116 148 L112 144 L100 156 L88 144 Z" fill="rgba(0,0,0,0.12)" />
        <path d="M86 146 L100 164 L92 170 L80 152 Z" fill={w} stroke="rgba(0,0,0,0.15)" />
        <path d="M114 146 L100 164 L108 170 L120 152 Z" fill={w} stroke="rgba(0,0,0,0.15)" />
        <line x1="100" y1="166" x2="100" y2="200" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
        {c.baju === "polo" && <circle cx="100" cy="178" r="1.6" fill="rgba(255,255,255,0.7)" />}
      </g>
    );
  }
  if (c.baju === "batik") {
    return (
      <g>
        <path d={bahu} fill={w} />
        <g opacity="0.55" fill="none" stroke="#E9C98F" strokeWidth="1.4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <path d={`M${34 + i * 26} 176 l8 -8 l8 8 l-8 8 Z`} />
              <circle cx={47 + i * 26} cy="192" r="3.2" />
              <path d={`M${40 + i * 26} 160 q6 -6 12 0`} />
            </g>
          ))}
        </g>
        <path d="M86 146 L100 162 L114 146 L110 144 L100 154 L90 144 Z" fill="#5E3616" />
      </g>
    );
  }
  if (c.baju === "turtleneck") {
    return (
      <g>
        <path d={bahu} fill={w} />
        <rect x="84" y="136" width="32" height="18" rx="7" fill={w} />
        <path d="M86 142 h28 M86 147 h28" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      </g>
    );
  }
  // rajut
  return (
    <g>
      <path d={bahu} fill={w} />
      <path d="M82 148 C88 160 112 160 118 148" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="5" />
    </g>
  );
}

function RambutBelakang({ c }) {
  const w = c.warnaRambut;
  if (c.rambut === "panjang") return <path d="M58 92 C54 50 80 34 100 34 C122 34 148 50 142 94 C146 128 150 150 138 162 L62 162 C50 150 54 128 58 92 Z" fill={w} />;
  if (c.rambut === "bob") return <path d="M60 94 C56 52 80 36 100 36 C122 36 146 52 140 96 C142 116 138 126 130 130 L70 130 C62 126 58 116 60 94 Z" fill={w} />;
  if (c.rambut === "hijab")
    return (
      <g>
        <path d="M100 38 C70 38 56 64 58 96 C60 120 68 138 80 148 L120 148 C132 138 140 120 142 96 C144 64 130 38 100 38 Z" fill={w} />
        <path d="M70 140 C66 160 76 178 100 186 C124 178 134 160 130 140 Z" fill={w} />
      </g>
    );
  return null;
}

function RambutDepan({ c }) {
  const w = c.warnaRambut;
  switch (c.rambut) {
    case "hijab":
      return <path d="M70 84 C70 58 130 58 130 84 C124 72 112 68 100 68 C88 68 76 72 70 84 Z" fill={w} style={{ filter: "brightness(1.08)" }} />;
    case "sanggul":
      return (
        <g>
          <circle cx="100" cy="40" r="14" fill={w} />
          <path d="M64 92 C60 58 82 46 100 46 C120 46 142 58 136 92 C132 76 120 66 104 64 C90 70 76 76 66 80 Z" fill={w} />
        </g>
      );
    case "panjang":
      return <path d="M64 92 C60 58 82 44 100 44 C122 44 142 58 136 92 C130 74 118 62 100 60 C96 70 82 80 64 92 Z" fill={w} />;
    case "bob":
      return <path d="M64 96 C60 58 82 44 100 44 C122 44 142 58 136 96 C134 78 124 66 112 62 C104 74 86 80 64 96 Z" fill={w} />;
    case "samping":
      return <path d="M64 88 C60 52 84 40 104 42 C126 44 142 58 136 86 C134 72 126 62 112 58 C100 62 84 60 72 66 C68 72 66 80 64 88 Z" fill={w} />;
    default:
      return <path d="M64 86 C62 52 86 40 102 40 C124 40 140 56 136 86 C132 70 122 60 100 60 C84 60 70 68 64 86 Z" fill={w} />;
  }
}

function Wajah({ c }) {
  const k = KULIT[c.kulit];
  return (
    <g>
      <rect x="88" y="120" width="24" height="30" rx="8" fill={k} style={{ filter: "brightness(0.93)" }} />
      {c.rambut !== "hijab" && (
        <>
          <ellipse cx="66" cy="96" rx="5.5" ry="8" fill={k} />
          <ellipse cx="134" cy="96" rx="5.5" ry="8" fill={k} />
        </>
      )}
      <ellipse cx="100" cy="92" rx="33" ry="39" fill={k} />
      {c.jenggot && <path d="M72 104 C76 128 88 134 100 134 C112 134 124 128 128 104 C122 120 112 124 100 124 C88 124 78 120 72 104 Z" fill="#1A120D" opacity="0.55" />}
      {/* alis */}
      <path d="M80 82 Q87 78 94 81" stroke="#2B1D14" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M106 81 Q113 78 120 82" stroke="#2B1D14" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* mata */}
      <ellipse cx="87" cy="92" rx="3.4" ry="3.9" fill="#21170F" />
      <ellipse cx="113" cy="92" rx="3.4" ry="3.9" fill="#21170F" />
      <circle cx="88.2" cy="90.8" r="1" fill="#fff" />
      <circle cx="114.2" cy="90.8" r="1" fill="#fff" />
      {c.kacamata && (
        <g fill="none" stroke="#1F2937" strokeWidth="2">
          <rect x="76" y="84" width="21" height="16" rx="6" />
          <rect x="103" y="84" width="21" height="16" rx="6" />
          <path d="M97 91 h6" />
        </g>
      )}
      {/* hidung, pipi, senyum */}
      <path d="M100 96 Q97 105 100 107 Q102 108 104 106" stroke="rgba(0,0,0,0.22)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="106" r="5.5" fill="#EE8F86" opacity="0.25" />
      <circle cx="120" cy="106" r="5.5" fill="#EE8F86" opacity="0.25" />
      <path d="M88 113 Q100 124 112 113 Q100 119 88 113 Z" fill="#7A2E36" />
      <path d="M90 113.6 Q100 117 110 113.6" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function FotoProfil({ c, ukuran = 96 }) {
  const id = c.id;
  const [a, b] = c.warnaLatar || ["#E8EDF4", "#D3DCE8"];
  return (
    <svg viewBox="0 0 200 200" width={ukuran} height={ukuran} role="img" aria-label={`${c.nama}: ${c.gaya}`} style={{ display: "block", borderRadius: "50%" }}>
      <defs>
        <clipPath id={`bulat-${id}`}>
          <circle cx="100" cy="100" r="100" />
        </clipPath>
        <filter id={`blur-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <linearGradient id={`polos-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <linearGradient id={`luar-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E6F3DE" />
          <stop offset="1" stopColor="#BFDDB4" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#bulat-${id})`}>
        <Latar c={c} id={id} />
        {/* Wajah diperbesar agar mengisi sekitar 60% bingkai, sesuai saran */}
        <g transform="translate(100 118) scale(1.28) translate(-100 -112)">
          <RambutBelakang c={c} />
          <Baju c={c} />
          <Wajah c={c} />
          <RambutDepan c={c} />
        </g>
      </g>
    </svg>
  );
}

/** Galeri 10 contoh, dikelompokkan perempuan lalu laki-laki. */
export function GaleriFotoProfil() {
  const grup = [
    { judul: t("Perempuan", "Women"), isi: CONTOH_FOTO.filter((c) => c.gender === "w") },
    { judul: t("Laki-laki", "Men"), isi: CONTOH_FOTO.filter((c) => c.gender === "m") },
  ];
  return (
    <div className="ctl-galeri">
      {grup.map((g) => (
        <div key={g.judul} className="ctl-grup">
          <div className="ctl-subjudul">{g.judul}</div>
          <div className="ctl-foto-grid">
            {g.isi.map((c) => (
              <figure key={c.id} className="ctl-foto">
                <FotoProfil c={c} ukuran={78} />
                <figcaption>
                  <b>{c.gaya}</b>
                  <span>{t("Cocok untuk", "Suits")}: {c.cocok}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
      <p className="ctl-catatan">
        {t(
          "Ilustrasi John Doe dan Jane Doe ini hanya contoh gaya. Pakai foto aslimu dengan gaya yang paling dekat dengan bidang kerjamu: wajah terlihat jelas, mengisi sekitar 60% bingkai, dan tersenyum.",
          "These John Doe and Jane Doe illustrations only show styles. Use a real photo of yourself in the style closest to your field: face clearly visible, filling about 60% of the frame, and smiling.",
        )}
      </p>
    </div>
  );
}
