import React from "react";
import {
  Building2,
  MapPin,
  DollarSign,
  Bookmark,
  ExternalLink,
  Lock,
  Check,
  Send,
} from "lucide-react";
import { T } from "../theme";
import { useLayarKecil } from "../hooks/useLayarKecil";
import { Button } from "./ui/Button";

export function JobRow({
  job,
  locked,
  saved,
  onToggleSave,
  onLamar,
  sudahDilamar,
}) {
  const hp = useLayarKecil(600);

  const inner = (
    <div
      style={{
        background: "rgba(255,255,255,0.5)",
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: hp ? 12 : 14,
        display: "flex",
        gap: hp ? 10 : 12,
        // Di layar sempit tombol turun ke baris berikutnya, tidak lagi
        // berdesakan dengan judul loker.
        flexWrap: hp ? "wrap" : "nowrap",
        alignItems: hp ? "flex-start" : "center",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: T.accent,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Building2 size={16} />
      </div>
      <div style={{ flex: hp ? "1 1 100%" : 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: hp ? 13 : 14,
            color: T.ink,
            lineHeight: 1.4,
            // Judul panjang dipotong maksimal dua baris supaya tinggi
            // tiap baris loker tetap seragam.
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {job.posisi}
        </div>
        <div
          style={{
            fontSize: hp ? 11.5 : 12,
            color: T.inkSoft,
            display: "flex",
            gap: hp ? 6 : 8,
            flexWrap: "wrap",
            marginTop: 3,
            alignItems: "center",
          }}
        >
          <span>{job.perusahaan}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <MapPin size={10} />
            {job.lokasi}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <DollarSign size={10} />
            {job.gaji}
          </span>
        </div>
        {job.alasan && (
          <div style={{ fontSize: 11.5, color: T.teal, marginTop: 4 }}>
            {job.alasan}
          </div>
        )}
      </div>
      {!locked && onToggleSave && (
        <button
          onClick={() => onToggleSave(job.id)}
          title={saved ? "Hapus dari tersimpan" : "Simpan loker ini"}
          style={{
            flexShrink: 0,
            background: saved ? T.accentSoft : "transparent",
            border: `1px solid ${saved ? T.accent : T.border}`,
            borderRadius: 10,
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Bookmark
            size={15}
            color={saved ? T.accent : T.inkFaint}
            fill={saved ? T.accent : "none"}
          />
        </button>
      )}
      {hp && !locked && <div style={{ flexBasis: "100%", height: 0 }} />}

      {!locked && onLamar && (
        <button
          onClick={() => !sudahDilamar && onLamar(job)}
          disabled={sudahDilamar}
          title={
            sudahDilamar
              ? "Sudah ada di daftar lamaran"
              : "Catat sebagai lamaran"
          }
          style={{
            flexShrink: 0,
            padding: "7px 11px",
            borderRadius: 10,
            border: `1px solid ${sudahDilamar ? T.teal : T.border}`,
            background: sudahDilamar ? "rgba(20,184,166,0.1)" : "transparent",
            color: sudahDilamar ? T.teal : T.inkSoft,
            cursor: sudahDilamar ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {sudahDilamar ? (
            <>
              <Check size={12} /> Dilamar
            </>
          ) : (
            <>
              <Send size={12} /> Lamar
            </>
          )}
        </button>
      )}
      {!locked && (
        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          style={{ flexShrink: 0 }}
        >
          <Button
            variant="outline"
            style={{ padding: "7px 12px", fontSize: 12 }}
          >
            Lihat <ExternalLink size={12} />
          </Button>
        </a>
      )}
    </div>
  );

  if (!locked) return inner;

  // Kalau locked: wrap dengan container yang blur + overlay di atasnya
  // Overlay mencegah user bisa klik atau select apapun
  // Blur ada di wrapper, bukan di elemen itu sendiri — tapi ini tetap bisa di-remove di DevTools
  // Data yang ditampilkan adalah dummy (karakter █), bukan data asli
  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}>
      {/* Konten di-blur */}
      <div
        style={{
          filter: "blur(6px)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {inner}
      </div>
      {/* Overlay transparan di atas — mencegah interaksi dan menutupi konten */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(248,248,252,0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: T.inkFaint,
            fontSize: 12,
          }}
        >
          <Lock size={12} />
          Buka dengan analisis lengkap
        </div>
      </div>
    </div>
  );
}
