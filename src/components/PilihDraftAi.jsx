import React, { useState, useEffect } from "react";
import { Sparkles, Check, ChevronDown, Loader2 } from "lucide-react";
import { T } from "../theme";
import { Glass } from "./ui/Glass";
import { Button } from "./ui/Button";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { lokal, t } from "../i18n.js";
import { rapikanTensaDraft } from "../../supabase/functions/_shared/tensaVerb.js";

const tglIndo = (s) =>
  s
    ? new Date(s).toLocaleDateString(lokal(), {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const jamIndo = (s) =>
  s
    ? new Date(s).toLocaleTimeString(lokal(), {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

/**
 * Banner pemilih draft hasil AI.
 *
 * Menampilkan semua riwayat analisis yang punya draft, bukan hanya yang
 * terakhir — user sering menganalisis CV beberapa kali (versi Indonesia dan
 * Inggris, atau sebelum dan sesudah revisi) dan ingin memilih yang mana.
 *
 * @param kolom  "cv_draft" | "linkedin_draft"
 * @param onTerapkan  dipanggil dengan objek draft yang dipilih
 */
/**
 * Pengingat untuk pengalaman kerja yang bullet-nya dilengkapi AI karena CV
 * asli kurang dari 3 bullet. Isinya tugas yang lazim untuk jabatan itu,
 * jadi pengguna perlu memastikan memang benar-benar mengerjakannya.
 */
function CatatanTambahan({ draft }) {
  const daftar = (draft?.experiences || []).filter((e) => e?.tambahan_ai > 0);
  if (!daftar.length) return null;
  return (
    <div
      style={{
        margin: "0 0 10px",
        padding: "9px 11px",
        borderRadius: 9,
        background: "var(--t-warn-bg, rgba(217,119,6,0.08))",
        border: "1px solid rgba(217,119,6,0.3)",
        fontSize: 11.5,
        lineHeight: 1.55,
        color: T.ink,
      }}
    >
      <b>{t("Bullet tambahan dari AI. ", "AI-added bullets. ")}</b>
      {t(
        "CV aslimu kurang dari 3 poin untuk posisi berikut, jadi AI melengkapinya dengan tugas yang lazim di jabatan itu: ",
        "Your CV had fewer than 3 points for these roles, so AI added duties typical for the job: ",
      )}
      {daftar.map((e) => `${e.role}${e.company ? ` (${e.company})` : ""}: ${e.tambahan_ai} ${t("poin", "points")}`).join("; ")}
      {". "}
      {t(
        "Hapus atau ubah poin yang tidak benar-benar kamu kerjakan sebelum CV dikirim.",
        "Remove or edit any point you didn't actually do before sending your CV.",
      )}
    </div>
  );
}

/** Cuplikan isi draft — memberi konfirmasi visual saat bahasa diganti. */
function Cuplikan({ draft, bahasa, ringkas = false }) {
  if (!draft) return null;

  const judul = draft.headline || draft.fullName || "";
  const isi = draft.summary || draft.about || "";
  if (!judul && !isi) return null;

  const batasJudul = ringkas ? 80 : 110;
  const batasIsi = ringkas ? 110 : 160;

  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        background: "var(--t-surface)",
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          fontSize: 9.5,
          fontWeight: 700,
          color: T.inkFaint,
          letterSpacing: "0.04em",
          marginBottom: 5,
        }}
      >
        {t("CUPLIKAN", "PREVIEW")}{" "}{bahasa === "en" ? t("VERSI INGGRIS", "ENGLISH VERSION") : t("VERSI INDONESIA", "INDONESIAN VERSION")}
      </div>
      {judul && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: T.ink,
            lineHeight: 1.45,
            marginBottom: isi ? 4 : 0,
          }}
        >
          {judul.length > batasJudul ? judul.slice(0, batasJudul) + "…" : judul}
        </div>
      )}
      {isi && (
        <div style={{ fontSize: 11.5, color: T.inkSoft, lineHeight: 1.55 }}>
          {isi.length > batasIsi ? isi.slice(0, batasIsi) + "…" : isi}
        </div>
      )}
    </div>
  );
}

const CSS_PILIH = `
.pda-pemilih{transition:border-color .15s, box-shadow .15s}
.pda-pemilih:hover{border-color:var(--t-teal,#14b8a6)!important;box-shadow:0 0 0 3px rgba(20,184,166,.12)}
.pda-opsi{transition:background .12s}
.pda-opsi:hover{background:rgba(20,184,166,.06)!important}
`;

export function PilihDraftAi({
  kolom,
  onTerapkan,
  onGantiBahasa,
  judul,
  keterangan,
}) {
  const { user } = useAuth();
  const [daftar, setDaftar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [terpilih, setTerpilih] = useState(null);
  const [bukaDaftar, setBukaDaftar] = useState(false);
  const [sudahTerapkan, setSudahTerapkan] = useState(false);
  const [tutup, setTutup] = useState(false);
  const [bahasa, setBahasa] = useState("id"); // "id" | "en"

  useEffect(() => {
    if (!user || !supabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase
      .from("career_analyses")
      .select(
        `id, created_at, arah_karier, kategori_label, source_type, ${kolom}, ${kolom}_en`,
      )
      .eq("user_id", user.id)
      .not(kolom, "is", null)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (error) console.error("Gagal memuat draft AI:", error.message);
        const bersih = (data || [])
          .filter(
            (d) =>
              (d[kolom] && Object.keys(d[kolom]).length > 0) ||
              (d[`${kolom}_en`] && Object.keys(d[`${kolom}_en`]).length > 0),
          )
          // Draft lama juga ikut dirapikan: posisi yang sudah selesai → past tense
          .map((d) => (d[`${kolom}_en`] ? { ...d, [`${kolom}_en`]: rapikanTensaDraft(d[`${kolom}_en`]) } : d));
        setDaftar(bersih);
        setTerpilih(bersih[0] ?? null);
        setLoading(false);
      });
  }, [user?.id, kolom]);

  const draftAktif = (d) => (bahasa === "en" ? d?.[`${kolom}_en`] : d?.[kolom]);

  // Kalau versi bahasa yang sedang dipilih tidak tersedia di entri ini,
  // pindah otomatis ke versi yang ada.
  //
  // WAJIB berada di atas early return: hook tidak boleh dipanggil setelah
  // komponen berpotensi keluar lebih awal, karena urutan hook antar-render
  // jadi berbeda dan React menolaknya.
  useEffect(() => {
    if (!terpilih) return;
    const adaId = Boolean(terpilih[kolom]);
    const adaEn = Boolean(terpilih[`${kolom}_en`]);
    if (bahasa === "en" && !adaEn && adaId) setBahasa("id");
    else if (bahasa === "id" && !adaId && adaEn) setBahasa("en");
  }, [terpilih?.id, bahasa, kolom]);

  // Early return baru boleh setelah SEMUA hook dipanggil.
  if (loading || tutup || daftar.length === 0) return null;

  /**
   * Mengganti bahasa langsung menerapkan draftnya, tanpa perlu menekan
   * Terapkan lagi — itu langkah tambahan yang tidak menambah apa pun.
   * Toggle bahasa di builder ikut disesuaikan lewat onGantiBahasa, supaya
   * label form dan pratinjau tidak berbeda bahasa dengan isinya.
   */
  const pilihBahasa = (key) => {
    setBahasa(key);
    onGantiBahasa?.(key === "en" ? "EN" : "ID");

    const draft = key === "en" ? terpilih?.[`${kolom}_en`] : terpilih?.[kolom];
    if (draft) {
      onTerapkan(draft);
      setSudahTerapkan(true);
    }
  };

  const terapkan = () => {
    const draft = draftAktif(terpilih);
    if (!draft) return;
    onTerapkan(draft);
    setSudahTerapkan(true);
  };

  if (sudahTerapkan) {
    return (
      <Glass
        style={{
          padding: "12px 16px",
          marginBottom: 10,
          background: "rgba(20,184,166,0.07)",
          border: `1px solid ${T.teal}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 10,
          }}
        >
          <Check size={15} color={T.teal} style={{ flexShrink: 0 }} />
          <div
            style={{ flex: 1, fontSize: 12, color: T.ink, lineHeight: 1.45 }}
          >
            {t("Draft", "The")}{" "}{bahasa === "en" ? t("versi Inggris", "English draft") : t("versi Indonesia", "Indonesian draft")}{" "}{t("sudah diterapkan. Periksa tiap bagian, lalu klik Simpan.", "has been applied. Review each section, then click Save.")}
          </div>
        </div>
        <CatatanTambahan draft={draftAktif(terpilih)} />

        {/* Toggle tetap ada supaya bisa berpindah bahasa kapan saja
            tanpa harus membuka ulang banner. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 11, color: T.inkSoft }}>{t("Bahasa", "Language")}</span>
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "var(--t-track)",
              padding: 3,
              borderRadius: 10,
            }}
          >
            {[
              { key: "id", label: "Indonesia" },
              { key: "en", label: "English" },
            ].map((opt) => {
              const tersedia = Boolean(
                opt.key === "en"
                  ? terpilih?.[`${kolom}_en`]
                  : terpilih?.[kolom],
              );
              return (
                <button
                  key={opt.key}
                  onClick={() => tersedia && pilihBahasa(opt.key)}
                  disabled={!tersedia}
                  style={{
                    padding: "4px 11px",
                    borderRadius: 8,
                    border: "none",
                    cursor: tersedia ? "pointer" : "not-allowed",
                    fontSize: 11.5,
                    fontWeight: 600,
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    background: bahasa === opt.key ? "var(--t-surface)" : "transparent",
                    color: !tersedia
                      ? T.inkFaint
                      : bahasa === opt.key
                        ? T.teal
                        : T.inkSoft,
                    opacity: tersedia ? 1 : 0.45,
                    boxShadow:
                      bahasa === opt.key
                        ? "0 1px 3px rgba(0,0,0,0.12)"
                        : "none",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <div style={{ flex: 1 }} />
          {daftar.length > 1 && (
            <button
              onClick={() => setSudahTerapkan(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.teal,
                fontSize: 11.5,
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                flexShrink: 0,
                padding: 0,
              }}
            >
              {t("Pilih analisis lain", "Choose another analysis")}
            </button>
          )}
        </div>

        {/* Cuplikan tetap ditampilkan supaya perpindahan bahasa setelah
            diterapkan tetap punya konfirmasi visual. */}
        <div style={{ marginTop: 10 }}>
          <Cuplikan draft={draftAktif(terpilih)} bahasa={bahasa} ringkas />
        </div>
      </Glass>
    );
  }

  const labelRingkas = (d) => {
    // Jam ikut ditampilkan karena beberapa analisis sering dibuat di hari
    // yang sama — tanpa jam, entrinya terlihat identik dan user tidak tahu
    // mana yang mereka pilih.
    const bagian = [`${tglIndo(d.created_at)} ${jamIndo(d.created_at)}`];
    if (d.source_type === "linkedin") bagian.push(t("dari LinkedIn", "from LinkedIn"));

    const punyaId = Boolean(d[kolom]);
    const punyaEn = Boolean(d[`${kolom}_en`]);
    if (punyaId && punyaEn) bagian.push(t("ID + EN", "ID + EN"));
    else if (punyaEn) bagian.push(t("EN saja", "EN only"));
    else bagian.push(t("ID saja", "ID only"));

    return bagian.join(" · ");
  };

  return (
    <Glass
      style={{
        padding: "14px 16px",
        marginBottom: 10,
        background: "rgba(20,184,166,0.07)",
        border: `1.5px solid ${T.teal}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Sparkles
          size={16}
          color={T.teal}
          style={{ flexShrink: 0, marginTop: 2 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.ink,
              marginBottom: 3,
            }}
          >
            {judul}
          </div>
          <div style={{ fontSize: 11.5, color: T.inkSoft, lineHeight: 1.55 }}>
            {keterangan}
          </div>
        </div>
      </div>

      <style>{CSS_PILIH}</style>
      {/* Pemilih versi — hanya muncul kalau memang ada lebih dari satu.
          Diberi judul dan tombol "Ganti" yang jelas supaya user tahu
          daftar ini bisa dipilih, bukan sekadar catatan riwayat. */}
      {daftar.length > 1 && (
        <div style={{ marginBottom: 11 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 11.5, fontWeight: 700, color: T.ink }}>
              {t(`Pilih hasil analisis (${daftar.length} tersedia)`, `Choose an analysis (${daftar.length} available)`)}
            </span>
            <span style={{ fontSize: 10.5, color: T.inkFaint }}>
              {t("Setiap analisis punya draft sendiri", "Each analysis has its own draft")}
            </span>
          </div>
          <button
            aria-expanded={bukaDaftar}
            className="pda-pemilih"
            onClick={() => setBukaDaftar(!bukaDaftar)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: "var(--t-surface)",
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              textAlign: "left",
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.teal, letterSpacing: "0.04em", marginBottom: 2 }}>
                {t("SEDANG DIPILIH", "SELECTED")}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.ink,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {terpilih?.arah_karier ||
                  terpilih?.kategori_label ||
                  t("Analisis", "Analysis")}
              </div>
              <div style={{ fontSize: 10.5, color: T.inkFaint, marginTop: 1 }}>
                {labelRingkas(terpilih)}
              </div>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                flexShrink: 0,
                fontSize: 11.5,
                fontWeight: 600,
                color: T.teal,
                padding: "5px 9px",
                borderRadius: 8,
                background: "rgba(20,184,166,0.1)",
              }}
            >
              {bukaDaftar ? t("Tutup", "Close") : t("Ganti", "Change")}
              <ChevronDown
                size={13}
                style={{
                  transform: bukaDaftar ? "rotate(180deg)" : "none",
                  transition: "transform .15s",
                }}
              />
            </span>
          </button>

          {bukaDaftar && (
            <div
              role="radiogroup"
              aria-label={t("Daftar hasil analisis", "List of analyses")}
              style={{
                marginTop: 6,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                background: "var(--t-surface)",
                overflow: "hidden",
                maxHeight: 230,
                overflowY: "auto",
              }}
            >
              {daftar.map((d, i) => {
                const aktif = d.id === terpilih?.id;
                return (
                  <button
                    key={d.id}
                    className="pda-opsi"
                    role="radio"
                    aria-checked={aktif}
                    onClick={() => {
                      setTerpilih(d);
                      setBukaDaftar(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 12px",
                      border: "none",
                      cursor: "pointer",
                      borderTop: i > 0 ? `1px solid ${T.border}` : "none",
                      background: aktif
                        ? "rgba(20,184,166,0.08)"
                        : "transparent",
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    {/* Penanda pilihan berbentuk radio: jelas bisa diklik */}
                    <span
                      aria-hidden="true"
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        flexShrink: 0,
                        marginTop: 1,
                        border: `2px solid ${aktif ? T.teal : T.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {aktif && <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.teal }} />}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: T.ink,
                          lineHeight: 1.4,
                        }}
                      >
                        {d.arah_karier || d.kategori_label || t("Analisis", "Analysis")}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: T.inkFaint,
                          marginTop: 2,
                        }}
                      >
                        {labelRingkas(d)}
                        {i === 0 && (
                          <span style={{ color: T.teal, fontWeight: 600 }}>
                            {" "}
                            {t("· terbaru", "· latest")}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: 11,
                        fontWeight: 600,
                        color: aktif ? T.teal : T.inkSoft,
                        marginTop: 1,
                      }}
                    >
                      {aktif ? t("Dipilih", "Selected") : t("Pilih", "Select")}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Pilih bahasa. Kedua versi selalu dibuat saat analisis,
          jadi user bisa berpindah kapan saja tanpa analisis ulang. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 11,
        }}
      >
        <span style={{ fontSize: 11, color: T.inkSoft }}>{t("Bahasa", "Language")}</span>
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "var(--t-track)",
            padding: 3,
            borderRadius: 10,
          }}
        >
          {[
            { key: "id", label: "Indonesia" },
            { key: "en", label: "English" },
          ].map((opt) => {
            const tersedia = Boolean(
              opt.key === "en" ? terpilih?.[`${kolom}_en`] : terpilih?.[kolom],
            );
            return (
              <button
                key={opt.key}
                onClick={() => tersedia && pilihBahasa(opt.key)}
                disabled={!tersedia}
                title={
                  tersedia
                    ? ""
                    : t("Analisis ini dibuat sebelum ada fitur dua bahasa. Pilih analisis yang lebih baru.", "This analysis was made before two-language drafts existed. Choose a newer one.")
                }
                style={{
                  padding: "4px 11px",
                  borderRadius: 8,
                  border: "none",
                  cursor: tersedia ? "pointer" : "not-allowed",
                  fontSize: 11.5,
                  fontWeight: 600,
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  background: bahasa === opt.key ? "var(--t-surface)" : "transparent",
                  color: !tersedia
                    ? T.inkFaint
                    : bahasa === opt.key
                      ? T.teal
                      : T.inkSoft,
                  opacity: tersedia ? 1 : 0.45,
                  boxShadow:
                    bahasa === opt.key ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cuplikan versi terpilih — memberi umpan balik saat bahasa diganti. */}
      <div style={{ marginBottom: 11 }}>
        <Cuplikan draft={draftAktif(terpilih)} bahasa={bahasa} />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button
          variant="primary"
          onClick={terapkan}
          disabled={!draftAktif(terpilih)}
          style={{ fontSize: 12, padding: "8px 14px" }}
        >
          <Sparkles size={12} />{" "}{t("Terapkan saran AI", "Apply AI suggestions")}
        </Button>
        <Button
          variant="outline"
          onClick={() => setTutup(true)}
          style={{ fontSize: 12, padding: "8px 14px" }}
        >
          {t("Nanti saja", "Not now")}
        </Button>
      </div>
    </Glass>
  );
}
