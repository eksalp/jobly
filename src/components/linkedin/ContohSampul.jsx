import React, { useRef, useState } from "react";
import "./contoh.css";
import { Download, Loader2, Check } from "lucide-react";
import { t } from "../../i18n.js";

/**
 * Lima contoh foto sampul LinkedIn (1584 × 396 px) yang bisa langsung
 * diunduh sebagai PNG. Headline dan nama user dimasukkan ke gambarnya.
 * Bagian kiri bawah sengaja dibiarkan kosong karena tertutup foto profil.
 */

const W = 1584;
const H = 396;
const FONT = "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif";

/** Potong teks panjang menjadi beberapa baris kira-kira sesuai lebar. */
function bagiBaris(teks, maksHuruf, maksBaris = 2) {
  const kata = String(teks || "").split(/\s+/).filter(Boolean);
  const baris = [];
  let kini = "";
  for (const k of kata) {
    if ((kini + " " + k).trim().length > maksHuruf) {
      if (kini) baris.push(kini);
      kini = k;
    } else kini = (kini + " " + k).trim();
  }
  if (kini) baris.push(kini);
  if (baris.length > maksBaris) {
    const sisa = baris.slice(0, maksBaris);
    sisa[maksBaris - 1] = sisa[maksBaris - 1].replace(/[,.;:]?$/, "…");
    return sisa;
  }
  return baris;
}

function Teks({ baris, x, y, ukuran, warna, berat = 700, jarak = 1.25, anchor = "end" }) {
  return (
    <text x={x} y={y} fill={warna} fontFamily={FONT} fontSize={ukuran} fontWeight={berat} textAnchor={anchor}>
      {baris.map((b, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : ukuran * jarak}>
          {b}
        </tspan>
      ))}
    </text>
  );
}

export const CONTOH_SAMPUL = [
  {
    id: "s1",
    nama: t("Profesional bersih", "Clean professional"),
    cocok: t("Semua bidang, terutama korporat", "Any field, especially corporate"),
    gambar: ({ judul, sub }) => (
      <>
        <defs>
          <linearGradient id="s1g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0E2A4F" />
            <stop offset="1" stopColor="#1D5BF0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#s1g)" />
        <g stroke="rgba(255,255,255,0.10)" strokeWidth="2" fill="none">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M${420 + i * 120} ${H} L${720 + i * 120} 0`} />
          ))}
        </g>
        <circle cx="1460" cy="70" r="140" fill="rgba(255,255,255,0.06)" />
        <Teks baris={bagiBaris(judul, 38)} x={1500} y={150} ukuran={48} warna="#FFFFFF" />
        <Teks baris={[sub]} x={1500} y={300} ukuran={32} warna="rgba(255,255,255,0.75)" berat={500} />
      </>
    ),
  },
  {
    id: "s2",
    nama: t("Teknologi", "Tech"),
    cocok: t("IT, data, produk digital", "IT, data, digital products"),
    gambar: ({ judul, sub }) => (
      <>
        <rect width={W} height={H} fill="#0B1220" />
        <g fill="rgba(94,234,212,0.18)">
          {Array.from({ length: 22 }).map((_, i) =>
            Array.from({ length: 6 }).map((__, j) => <circle key={`${i}-${j}`} cx={520 + i * 48} cy={40 + j * 64} r="2.6" />),
          )}
        </g>
        <text x="70" y="190" fill="rgba(94,234,212,0.22)" fontFamily="'IBM Plex Mono', monospace" fontSize="150" fontWeight="600">
          {"</>"}
        </text>
        <Teks baris={bagiBaris(judul, 38)} x={1500} y={150} ukuran={48} warna="#E6FFFA" />
        <Teks baris={[sub]} x={1500} y={300} ukuran={32} warna="#5EEAD4" berat={500} />
      </>
    ),
  },
  {
    id: "s3",
    nama: t("Kreatif", "Creative"),
    cocok: t("Desain, konten, pemasaran", "Design, content, marketing"),
    gambar: ({ judul, sub }) => (
      <>
        <rect width={W} height={H} fill="#FFF4EC" />
        <circle cx="560" cy="60" r="190" fill="#FFD9C2" />
        <circle cx="820" cy="380" r="150" fill="#FDE7B0" />
        <circle cx="1560" cy="40" r="120" fill="#F9C7D2" />
        <path d="M980 330 C1060 270 1140 390 1220 330 S1380 270 1460 330" stroke="#F08A5D" strokeWidth="6" fill="none" strokeLinecap="round" />
        <Teks baris={bagiBaris(judul, 38)} x={1500} y={150} ukuran={48} warna="#3B1F14" />
        <Teks baris={[sub]} x={1500} y={260} ukuran={32} warna="#B4532A" berat={600} />
      </>
    ),
  },
  {
    id: "s4",
    nama: t("Keuangan dan data", "Finance and data"),
    cocok: t("Akuntansi, analis, perbankan", "Accounting, analysts, banking"),
    gambar: ({ judul, sub }) => (
      <>
        <rect width={W} height={H} fill="#F5F8FC" />
        <g stroke="#DCE5F0" strokeWidth="2">
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="440" x2={W} y1={70 + i * 70} y2={70 + i * 70} />
          ))}
        </g>
        <path d="M440 330 L560 300 L680 312 L800 250 L920 266 L1040 200 L1160 214 L1280 150 L1400 120 L1584 90" stroke="#1D5BF0" strokeWidth="5" fill="none" strokeLinejoin="round" />
        <path d="M440 330 L560 300 L680 312 L800 250 L920 266 L1040 200 L1160 214 L1280 150 L1400 120 L1584 90 L1584 396 L440 396 Z" fill="rgba(29,91,240,0.07)" />
        <rect x="560" y="40" width="980" height="150" rx="16" fill="rgba(255,255,255,0.88)" />
        <Teks baris={bagiBaris(judul, 40)} x={1500} y={100} ukuran={44} warna="#0F172A" />
        <Teks baris={[sub]} x={1500} y={175} ukuran={28} warna="#1D5BF0" berat={600} />
      </>
    ),
  },
  {
    id: "s5",
    nama: t("Hangat dan tenang", "Warm and calm"),
    cocok: t("HR, pendidikan, kesehatan", "HR, education, health"),
    gambar: ({ judul, sub }) => (
      <>
        <defs>
          <linearGradient id="s5g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#DDEFE6" />
            <stop offset="1" stopColor="#F3F8F2" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#s5g)" />
        <g fill="#9CCBB2" opacity="0.6">
          <ellipse cx="540" cy="330" rx="28" ry="70" transform="rotate(-25 540 330)" />
          <ellipse cx="600" cy="320" rx="24" ry="62" transform="rotate(18 600 320)" />
          <ellipse cx="570" cy="270" rx="20" ry="52" />
        </g>
        <text x="760" y="170" fill="rgba(31,111,92,0.12)" fontFamily="Georgia, serif" fontSize="260">
          “
        </text>
        <Teks baris={bagiBaris(judul, 38)} x={1500} y={150} ukuran={46} warna="#14352C" />
        <Teks baris={[sub]} x={1500} y={290} ukuran={32} warna="#1F6F5C" berat={600} />
      </>
    ),
  },
];

function GambarSampul({ c, judul, sub, svgRef }) {
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%", height: "auto" }}>
      {c.gambar({ judul, sub })}
    </svg>
  );
}

/** Gambar SVG ke kanvas 1584×396. */
async function svgKeKanvas(svgEl) {
  const xml = new XMLSerializer().serializeToString(svgEl);
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = await new Promise((ok, gagal) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = gagal;
      i.src = url;
    });
    const kanvas = document.createElement("canvas");
    kanvas.width = W;
    kanvas.height = H;
    kanvas.getContext("2d").drawImage(img, 0, 0, W, H);
    return kanvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Ubah SVG menjadi PNG 1584×396 lalu unduh. */
async function unduhPng(svgEl, namaFile) {
  const kanvas = await svgKeKanvas(svgEl);
  const blob = await new Promise((ok) => kanvas.toBlob(ok, "image/png"));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = namaFile;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function KartuSampul({ c, judul, sub, urutan, onTerapkan, terpasang, onTerpasang }) {
  const ref = useRef(null);
  const [proses, setProses] = useState(false);
  const [memasang, setMemasang] = useState(false);
  const [galat, setGalat] = useState("");
  return (
    <figure className="ctl-sampul">
      <div className="ctl-sampul-gambar">
        <GambarSampul c={c} judul={judul} sub={sub} svgRef={ref} />
        {/* Penanda area yang tertutup foto profil */}
        <span className="ctl-zona" aria-hidden="true" />
      </div>
      <figcaption>
        <span>
          <b>
            {urutan}. {c.nama}
          </b>
          <span>{t("Cocok untuk", "Suits")}: {c.cocok}</span>
        </span>
        <span className="ctl-sampul-aksi">
        {onTerapkan && (
          <button
            type="button"
            className={`utama ${terpasang ? "terpasang" : ""}`}
            disabled={memasang}
            onClick={async () => {
              if (!ref.current) return;
              setMemasang(true);
              setGalat("");
              try {
                await onTerapkan(await svgKeKanvas(ref.current));
                onTerpasang?.();
              } catch (e) {
                setGalat(e?.message || t("Gagal memasang sampul.", "Couldn't apply the cover."));
              } finally {
                setMemasang(false);
              }
            }}
          >
            {memasang ? <Loader2 size={13} className="ctl-putar" /> : <Check size={13} />}
            {terpasang ? t("Terpasang", "Applied") : t("Terapkan", "Apply")}
          </button>
        )}
        <button
          type="button"
          disabled={proses}
          onClick={async () => {
            if (!ref.current) return;
            setProses(true);
            try {
              await unduhPng(ref.current, `sampul-linkedin-${urutan}.png`);
            } finally {
              setProses(false);
            }
          }}
        >
          {proses ? <Loader2 size={13} className="ctl-putar" /> : <Download size={13} />}
          {t("Unduh PNG", "Download PNG")}
        </button>
        </span>
      </figcaption>
      {galat && <div className="ctl-unggah-pesan galat" style={{ padding: "0 11px 9px" }}>{galat}</div>}
    </figure>
  );
}

/**
 * @param headline  headline user (dipakai sebagai teks utama sampul)
 * @param nama      nama user (dipakai sebagai teks kecil)
 */
export function GaleriSampul({ headline, nama, onTerapkan }) {
  const [terpasang, setTerpasang] = useState("");
  // Headline LinkedIn sering panjang dan dipisah "|". Untuk sampul cukup
  // dua bagian pertama, supaya teksnya besar dan mudah dibaca di HP.
  const bagianHeadline = String(headline || "")
    .split(/\s*[|•·]\s*/)
    .map((x) => x.trim())
    .filter(Boolean);
  const ringkas = bagianHeadline.length > 1 ? bagianHeadline.slice(0, 2).join(" · ") : bagianHeadline[0] || "";
  const judul = ringkas || t("Membantu bisnis tumbuh lewat data dan strategi yang terukur", "Helping businesses grow with data and measurable strategy");
  const sub = (nama || "").trim() || "John Doe";
  return (
    <div className="ctl-galeri">
      <div className="ctl-sampul-grid">
        {CONTOH_SAMPUL.map((c, i) => (
          <KartuSampul
            key={c.id}
            c={c}
            judul={judul}
            sub={sub}
            urutan={i + 1}
            onTerapkan={onTerapkan}
            terpasang={terpasang === c.id}
            onTerpasang={() => setTerpasang(c.id)}
          />
        ))}
      </div>
      <p className="ctl-catatan">
        {t(
          "Teks di sampul diambil dari headline dan namamu. Lingkaran putus-putus di kiri bawah menandai area yang tertutup foto profil, jadi bagian itu sengaja dibiarkan kosong. Terapkan memasang sampul ke pratinjau di sebelah kiri; Unduh PNG menyimpannya untuk diunggah lewat ikon pensil di sampul LinkedIn.",
          "The cover text uses your headline and name. The dashed circle at the bottom left marks the area covered by your profile photo, so it's left empty on purpose. Apply puts the cover on the preview on the left; Download PNG saves it so you can upload it with the pencil icon on your LinkedIn cover.",
        )}
      </p>
    </div>
  );
}
