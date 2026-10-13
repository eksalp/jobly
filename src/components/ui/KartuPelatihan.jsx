import React from "react";
import { UserCheck, ExternalLink, Check, Info } from "lucide-react";
import { T } from "../../theme";
import { Glass } from "./Glass";
import { t } from "../../i18n.js";

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
      ? t("Latihan dengan AI bagus untuk membiasakan diri, tapi untuk memperbaiki hal-hal di atas, masukan dari pewawancara sungguhan jauh lebih tajam.", "Practising with AI is great for building habits, but to fix the points above, feedback from a real interviewer is much sharper.")
      : skor != null && skor >= 80
        ? t("Penampilanmu sudah kuat. Untuk mengasahnya sampai siap menghadapi wawancara sungguhan, latihan dengan pewawancara berpengalaman bisa menemukan hal yang tidak tertangkap AI.", "You performed strongly. To sharpen it for a real interview, practising with an experienced interviewer can catch things AI misses.")
        : t("AI bisa melatih kebiasaanmu, tapi pewawancara sungguhan bisa membaca hal yang tidak terekam di transkrip, seperti cara membawa diri, jeda bicara, dan rasa percaya diri saat menjawab.", "AI can train your habits, but a real interviewer reads things a transcript can't capture, like how you carry yourself, your pauses, and how confident you sound.");

  const isi = [
    t("Sesi 1-on-1 lewat Zoom bersama profesional berpengalaman di BUMN dan startup", "1-on-1 Zoom sessions with professionals experienced at state-owned enterprises and startups"),
    t("Panduan interview berbasis praktik langsung", "Hands-on, practice-based interview guidance"),
    t("Perbaikan langsung saat sesi, dengan form checklist", "Live corrections during the session, with a checklist form"),
    t("Gratis e-book kumpulan pertanyaan interview kerja dan magang", "Free e-book of job and internship interview questions"),
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
          {t("Latihan langsung dengan pewawancara", "Practise with a real interviewer")}
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
        {isi.map((butir) => (
          <div
            key={butir}
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
            <span>{butir}</span>
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
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              lineHeight: 1.2,
            }}
          >
            {HARGA}
          </div>
          <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 2 }}>
            {t("jadwal konsultasi bisa diatur sendiri", "you choose the session time")}
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
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            textDecoration: "none",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(20,184,166,0.3)",
          }}
        >
          {t("Atur jadwal", "Book a session")}{" "}<ExternalLink size={13} />
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
          {t("Layanan ini disediakan oleh mitra Jobly. Jobly bisa mendapat komisi kalau kamu mendaftar lewat tautan di atas, tanpa biaya tambahan untukmu.", "This service is provided by a Jobly partner. Jobly may earn a commission if you sign up through the link above, at no extra cost to you.")}
        </span>
      </div>
    </Glass>
  );
}
