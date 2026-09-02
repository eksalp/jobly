import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { T } from "../theme";

/**
 * Susun daftar nomor halaman dengan elipsis.
 * Selalu tampilkan halaman pertama, terakhir, dan beberapa di sekitar
 * halaman aktif. Sisanya diringkas jadi "…".
 *
 * Contoh (total 90):
 *   aktif 1   →  1 2 3 4 5 … 90
 *   aktif 45  →  1 … 43 44 45 46 47 … 90
 *   aktif 90  →  1 … 86 87 88 89 90
 */
function susunHalaman(aktif, total, tetangga = 2) {
  // Sedikit halaman: tampilkan semua, tidak perlu elipsis
  const maksTanpaElipsis = tetangga * 2 + 5;
  if (total <= maksTanpaElipsis) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Jumlah nomor di tengah dijaga tetap supaya lebar bar tidak melompat
  // saat berpindah halaman. Kalau posisi aktif mepet ke tepi, jendelanya
  // digeser ke dalam, bukan dipersempit.
  const lebarJendela = tetangga * 2 + 1;
  let kiri = aktif - tetangga;
  let kanan = aktif + tetangga;

  if (kiri < 2) {
    kiri = 2;
    kanan = kiri + lebarJendela - 1;
  }
  if (kanan > total - 1) {
    kanan = total - 1;
    kiri = kanan - lebarJendela + 1;
  }
  kiri = Math.max(2, kiri);
  kanan = Math.min(total - 1, kanan);

  const hasil = [1];
  if (kiri > 2) hasil.push("kiri"); // elipsis kiri
  for (let i = kiri; i <= kanan; i++) hasil.push(i);
  if (kanan < total - 1) hasil.push("kanan"); // elipsis kanan
  hasil.push(total);

  return hasil;
}

const tombolDasar = {
  minWidth: 34,
  height: 34,
  padding: "0 9px",
  borderRadius: 10,
  border: `1px solid ${T.border}`,
  background: "rgba(255,255,255,0.6)",
  color: T.ink,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 12.5,
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
  transition: "background .12s, border-color .12s",
};

export function Pagination({
  currentPage,
  totalPages,
  onChange,
  tetangga = 2,
}) {
  if (totalPages <= 1) return null;

  const halaman = susunHalaman(currentPage, totalPages, tetangga);
  const diAwal = currentPage === 1;
  const diAkhir = currentPage === totalPages;

  const tombolPanah = (nonaktif) => ({
    ...tombolDasar,
    color: nonaktif ? T.inkFaint : T.ink,
    cursor: nonaktif ? "not-allowed" : "pointer",
    opacity: nonaktif ? 0.5 : 1,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 20,
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={diAwal}
        aria-label="Halaman sebelumnya"
        style={tombolPanah(diAwal)}
      >
        <ChevronLeft size={16} />
      </button>

      {halaman.map((h, i) =>
        typeof h === "number" ? (
          <button
            key={h}
            onClick={() => onChange(h)}
            aria-current={h === currentPage ? "page" : undefined}
            style={{
              ...tombolDasar,
              background:
                h === currentPage ? T.accent : "rgba(255,255,255,0.6)",
              borderColor: h === currentPage ? T.accent : T.border,
              color: h === currentPage ? "#fff" : T.ink,
              boxShadow:
                h === currentPage ? "0 4px 12px rgba(76,99,224,0.25)" : "none",
            }}
          >
            {h}
          </button>
        ) : (
          // Elipsis: klik untuk melompat 5 halaman ke arah tersebut
          <button
            key={h + i}
            onClick={() =>
              onChange(
                h === "kiri"
                  ? Math.max(1, currentPage - 5)
                  : Math.min(totalPages, currentPage + 5),
              )
            }
            title={h === "kiri" ? "Mundur 5 halaman" : "Maju 5 halaman"}
            style={{
              ...tombolDasar,
              border: "none",
              background: "transparent",
              color: T.inkFaint,
              minWidth: 26,
              padding: 0,
            }}
          >
            …
          </button>
        ),
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={diAkhir}
        aria-label="Halaman berikutnya"
        style={tombolPanah(diAkhir)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
