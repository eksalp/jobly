import React from "react";
import { UserCheck, ExternalLink, Check, Info } from "lucide-react";
import { T } from "../../theme";
import { Glass } from "./Glass";

/**
 * Tawaran pelatihan interview dengan pewawancara sungguhan.
 *
 * Ditempatkan SETELAH daftar "yang perlu diperbaiki", bukan di awal
 * halaman. Setelah membaca kekurangannya sendiri, orang jauh lebih
 * terbuka pada tawaran bantuan nyata — di awal, tawaran yang sama cuma
 * terbaca sebagai iklan yang menghalangi hasil yang mereka tunggu.
 *
 * `skor` dipakai menyesuaikan kalimat pembuka. Menawarkan hal yang sama
 * dengan nada yang sama kepada orang yang nyaris sempurna dan orang yang
 * kesulitan sama-sama terasa tidak nyambung.
 */
const TAUTAN = "https://lynk.id/nextkarirku/XRPv4Rd";
const HARGA = "Rp 30.000";

export function KartuPelatihan({ skor }) {
  const pembuka =
    skor != null && skor < 60
      ? "Latihan dengan AI bagus untuk membiasakan diri, tapi untuk memperbaiki hal-hal di atas, masukan dari pewawancara sungguhan jauh lebih tajam."
      : skor != null && skor >= 80
        ? "Penampilanmu sudah kuat. Untuk mengasahnya sampai siap menghadapi wawancara sungguhan, latihan dengan pewawancara berpengalaman bisa menemukan hal yang tidak tertangkap AI."
        : "AI bisa melatih kebiasaanmu, tapi pewawancara sungguhan bisa membaca hal yang tidak terekam transkrip — cara membawa diri, jeda, dan keyakinan saat menjawab.";

  const isi = [
    "Sesi 1-on-1 lewat Zoom bersama profesional berpengalaman di BUMN dan startup",
    "Panduan interview berbasis praktik langsung",
    "Perbaikan langsung saat sesi, dengan form checklist",
    "Gratis e-book kumpulan pertanyaan interview kerja dan magang",
  ];

  return (
    <Glass
      style={{
        padding: 22,
        marginTop: 14,
        border: `1.5px solid ${T.teal}`,
        background: "rgba(20,184,166,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <UserCheck size={16} color={T.teal} />
        <span style={{ fontSize: 14.5, fontWeight: 600, color: T.ink }}>
          Latihan langsung dengan pewawancara
        </span>
      </div>

      <div
        style={{
          fontSize: 12.5,
          color: T.inkSoft,
          lineHeight: 1.7,
          marginBottom: 14,
        }}
      >
        {pembuka}
      </div>

      <div style={{ marginBottom: 16 }}>
        {isi.map((t) => (
          <div
            key={t}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 7,
              fontSize: 12.5,
              color: T.inkSoft,
              lineHeight: 1.6,
            }}
          >
            <Check
              size={13}
              color={T.teal}
              style={{ flexShrink: 0, marginTop: 3 }}
            />
            <span>{t}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          paddingTop: 14,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: T.ink,
              fontFamily: "'Poppins', sans-serif",
              lineHeight: 1.2,
            }}
          >
            {HARGA}
          </div>
          <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 2 }}>
            jadwal konsultasi bisa diatur sendiri
          </div>
        </div>

        <a
          href={TAUTAN}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "11px 20px",
            borderRadius: 12,
            background: T.teal,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            textDecoration: "none",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(20,184,166,0.3)",
          }}
        >
          Atur jadwal <ExternalLink size={13} />
        </a>
      </div>

      {/* Keterbukaan soal kerja sama. Wajib ada: kalau user menyadarinya
          sendiri belakangan, kepercayaan yang hilang jauh lebih mahal
          daripada satu-dua transaksi. */}
      <div
        style={{
          display: "flex",
          gap: 7,
          marginTop: 14,
          padding: "9px 11px",
          borderRadius: 10,
          background: "rgba(0,0,0,0.03)",
          fontSize: 10.5,
          color: T.inkFaint,
          lineHeight: 1.6,
        }}
      >
        <Info size={11} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          Layanan ini disediakan mitra kami, dan kami menerima komisi dari
          pendaftaran lewat tautan di atas — tanpa biaya tambahan untukmu.
        </span>
      </div>
    </Glass>
  );
}
