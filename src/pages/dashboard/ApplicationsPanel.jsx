import React, { useState, useMemo } from "react";
import {
  Plus,
  X,
  Loader2,
  ExternalLink,
  Trash2,
  Calendar,
  ChevronDown,
  Building2,
  MapPin,
  StickyNote,
  Check,
} from "lucide-react";
import { T } from "../../theme";
import { Glass } from "../../components/ui/Glass";
import { Button } from "../../components/ui/Button";
import { useApplications, TAHAPAN, HASIL } from "../../hooks/useApplications";
import { lokal, t } from "../../i18n.js";

const tglIndo = (s) =>
  s
    ? new Date(s).toLocaleDateString(lokal(), {
        day: "numeric",
        month: "short",
      })
    : "";

const hariSejak = (s) => {
  if (!s) return null;
  const beda = Math.floor((Date.now() - new Date(s).getTime()) / 86400000);
  return beda;
};

/* ------------------------------------------------------------------ */
/*  Kartu lamaran                                                      */
/* ------------------------------------------------------------------ */
function KartuLamaran({ item, onPerbarui, onHapus }) {
  const [buka, setBuka] = useState(false);
  const [catatan, setCatatan] = useState(item.catatan || "");
  const [simpanCatatan, setSimpanCatatan] = useState(false);

  const umur = hariSejak(item.tanggal_lamar);
  const hasil = HASIL.find((h) => h.id === item.hasil);

  // Lamaran yang lama tidak bergerak perlu ditandai — user sering lupa follow up
  const perluTindakan =
    umur !== null &&
    umur >= 14 &&
    ["dilamar", "ditinjau"].includes(item.status);

  const simpan = async () => {
    await onPerbarui(item.id, { catatan: catatan.trim() || null });
    setSimpanCatatan(true);
    setTimeout(() => setSimpanCatatan(false), 1600);
  };

  return (
    <Glass
      style={{
        padding: 13,
        border: perluTindakan ? "1px solid rgba(201,138,30,0.45)" : undefined,
      }}
    >
      <div onClick={() => setBuka(!buka)} style={{ cursor: "pointer" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.ink,
            lineHeight: 1.35,
            marginBottom: 3,
          }}
        >
          {item.posisi}
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: T.inkSoft,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Building2 size={10} /> {item.perusahaan}
        </div>
        {item.lokasi && (
          <div
            style={{
              fontSize: 11,
              color: T.inkFaint,
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <MapPin size={9} /> {item.lokasi}
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 10.5, color: T.inkFaint }}>
            {tglIndo(item.tanggal_lamar)}
            {umur !== null && umur > 0 && t(` · ${umur} hari lalu`, ` · ${umur} days ago`)}
          </span>
          {hasil && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 7px",
                borderRadius: 99,
                background: `${hasil.warna}1A`,
                color: hasil.warna,
              }}
            >
              {hasil.label}
            </span>
          )}
          {item.catatan && !buka && <StickyNote size={10} color={T.inkFaint} />}
        </div>

        {perluTindakan && (
          <div
            style={{
              fontSize: 10.5,
              color: "var(--t-warn)",
              marginTop: 7,
              lineHeight: 1.4,
            }}
          >
            {t("Sudah", "It's been")}{" "}{umur}{" "}{t("hari tanpa kabar. Mungkin waktunya follow up.", "days with no reply. Maybe it's time to follow up.")}
          </div>
        )}
      </div>

      {buka && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          {/* Pindah tahap */}
          <label
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: T.inkFaint,
              display: "block",
              marginBottom: 5,
            }}
          >
            {t("Tahap saat ini", "Current stage")}
          </label>
          <select
            value={item.status}
            onChange={(e) => onPerbarui(item.id, { status: e.target.value })}
            style={{
              width: "100%",
              border: `1px solid ${T.border}`,
              borderRadius: 9,
              padding: "7px 10px",
              fontSize: 12,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              background: "var(--t-surface)",
              color: T.ink,
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            {TAHAPAN.map((tt) => (
              <option key={tt.id} value={tt.id}>
                {tt.label}
              </option>
            ))}
          </select>

          {/* Hasil akhir, hanya saat tahap selesai */}
          {item.status === "selesai" && (
            <>
              <label
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: T.inkFaint,
                  display: "block",
                  marginBottom: 5,
                }}
              >
                {t("Hasil", "Outcome")}
              </label>
              <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
                {HASIL.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => onPerbarui(item.id, { hasil: h.id })}
                    style={{
                      flex: 1,
                      padding: "6px 4px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                      border: `1px solid ${item.hasil === h.id ? h.warna : T.border}`,
                      background:
                        item.hasil === h.id ? `${h.warna}1A` : "transparent",
                      color: item.hasil === h.id ? h.warna : T.inkSoft,
                    }}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Jadwal berikutnya */}
          <label
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: T.inkFaint,
              display: "block",
              marginBottom: 5,
            }}
          >
            {t("Jadwal berikutnya", "Next scheduled step")}
          </label>
          <input
            type="date"
            value={item.tanggal_acara || ""}
            onChange={(e) =>
              onPerbarui(item.id, { tanggal_acara: e.target.value || null })
            }
            style={{
              width: "100%",
              border: `1px solid ${T.border}`,
              borderRadius: 9,
              padding: "7px 10px",
              fontSize: 12,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              background: "var(--t-surface)",
              color: T.ink,
              marginBottom: 10,
              boxSizing: "border-box",
            }}
          />

          {/* Catatan */}
          <label
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: T.inkFaint,
              display: "block",
              marginBottom: 5,
            }}
          >
            {t("Catatan", "Notes")}
          </label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            onBlur={simpan}
            rows={3}
            placeholder={t("Nama HR, pertanyaan interview, ekspektasi gaji...", "HR contact, interview questions, salary expectations...")}
            style={{
              width: "100%",
              border: `1px solid ${T.border}`,
              borderRadius: 9,
              padding: "8px 10px",
              fontSize: 12,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              background: "var(--t-surface)",
              color: T.ink,
              resize: "vertical",
              lineHeight: 1.5,
              boxSizing: "border-box",
              outline: "none",
            }}
          />
          {simpanCatatan && (
            <div
              style={{
                fontSize: 10.5,
                color: T.teal,
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Check size={10} />{" "}{t("Catatan tersimpan", "Notes saved")}
            </div>
          )}

          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1 }}
              >
                <Button
                  variant="outline"
                  style={{ width: "100%", fontSize: 11.5, padding: "7px 10px" }}
                >
                  {t("Lihat loker", "View job")}{" "}<ExternalLink size={11} />
                </Button>
              </a>
            )}
            <button
              onClick={() => onHapus(item.id)}
              title={t("Hapus lamaran", "Delete application")}
              style={{
                padding: "7px 10px",
                borderRadius: 10,
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: "var(--t-danger)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}
    </Glass>
  );
}

/* ------------------------------------------------------------------ */
/*  Form tambah manual                                                 */
/* ------------------------------------------------------------------ */
function FormTambah({ onTutup, onSimpan }) {
  const [f, setF] = useState({
    posisi: "",
    perusahaan: "",
    lokasi: "",
    link: "",
    status: "dilamar",
    tanggal_lamar: new Date().toISOString().slice(0, 10),
  });
  const [menyimpan, setMenyimpan] = useState(false);
  const [galat, setGalat] = useState("");

  const isi = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const kirim = async () => {
    if (!f.posisi.trim() || !f.perusahaan.trim()) {
      setGalat(t("Posisi dan perusahaan wajib diisi.", "Role and company are required."));
      return;
    }
    setMenyimpan(true);
    const { error } = await onSimpan(f);
    setMenyimpan(false);
    if (error) setGalat(error);
    else onTutup();
  };

  const input = {
    width: "100%",
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 13,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    background: "var(--t-surface)",
    color: T.ink,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      onClick={onTutup}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.32)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
        padding: 20,
      }}
    >
      <Glass
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: 24,
          width: "100%",
          maxWidth: 440,
          background: "var(--t-field)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>
            {t("Catat lamaran", "Log application")}
          </span>
          <button
            onClick={onTutup}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.inkFaint,
              display: "flex",
            }}
          >
            <X size={17} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <input
            value={f.posisi}
            onChange={isi("posisi")}
            placeholder={t("Posisi *", "Role *")}
            style={input}
            autoFocus
          />
          <input
            value={f.perusahaan}
            onChange={isi("perusahaan")}
            placeholder={t("Perusahaan *", "Company *")}
            style={input}
          />
          <input
            value={f.lokasi}
            onChange={isi("lokasi")}
            placeholder={t("Lokasi", "Location")}
            style={input}
          />
          <input
            value={f.link}
            onChange={isi("link")}
            placeholder={t("Link lowongan", "Job link")}
            style={input}
          />

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}
          >
            <div>
              <label
                style={{
                  fontSize: 10.5,
                  color: T.inkFaint,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {t("Tanggal melamar", "Date applied")}
              </label>
              <input
                type="date"
                value={f.tanggal_lamar}
                onChange={isi("tanggal_lamar")}
                style={input}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 10.5,
                  color: T.inkFaint,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {t("Tahap", "Stage")}
              </label>
              <select
                value={f.status}
                onChange={isi("status")}
                style={{ ...input, cursor: "pointer" }}
              >
                {TAHAPAN.map((tt) => (
                  <option key={tt.id} value={tt.id}>
                    {tt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {galat && (
          <div style={{ fontSize: 12, color: "var(--t-danger)", marginTop: 10 }}>
            {galat}
          </div>
        )}

        <Button
          variant="primary"
          onClick={kirim}
          disabled={menyimpan}
          style={{ width: "100%", marginTop: 16 }}
        >
          {menyimpan ? (
            <Loader2
              size={14}
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : (
            <Plus size={14} />
          )}
          {t("Simpan", "Save")}
        </Button>
      </Glass>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PANEL UTAMA                                                        */
/* ------------------------------------------------------------------ */
export function ApplicationsPanel() {
  const { lamaran, loading, tambah, perbarui, hapus } = useApplications();
  const [formBuka, setFormBuka] = useState(false);

  const kolom = useMemo(
    () =>
      TAHAPAN.map((tt) => ({
        ...tt,
        items: lamaran.filter((l) => l.status === tt.id),
      })),
    [lamaran],
  );

  const statistik = useMemo(() => {
    const total = lamaran.length;
    const aktif = lamaran.filter((l) => l.status !== "selesai").length;
    const sampaiInterview = lamaran.filter(
      (l) =>
        ["interview", "offer"].includes(l.status) || l.hasil === "diterima",
    ).length;
    const persen = total > 0 ? Math.round((sampaiInterview / total) * 100) : 0;
    return { total, aktif, sampaiInterview, persen };
  }, [lamaran]);

  return (
    <div style={{ padding: "24px 28px" }}>
      {/* Ringkasan */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginBottom: 18,
          background: "var(--t-field)",
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "14px 18px",
          backdropFilter: "blur(14px)",
          flexWrap: "wrap",
        }}
      >
        {[
          { angka: statistik.total, label: t("Total lamaran", "Total applications") },
          { angka: statistik.aktif, label: t("Masih berjalan", "In progress") },
          { angka: statistik.sampaiInterview, label: t("Sampai interview", "Reached interview") },
          { angka: `${statistik.persen}%`, label: t("Rasio interview", "Interview rate") },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && (
              <div style={{ width: 1, height: 30, background: T.border }} />
            )}
            <div style={{ minWidth: 76 }}>
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 700,
                  color: T.ink,
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  lineHeight: 1.1,
                }}
              >
                {s.angka}
              </div>
              <div style={{ fontSize: 10.5, color: T.inkFaint, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          </React.Fragment>
        ))}
        <div style={{ flex: 1 }} />
        <Button
          variant="primary"
          onClick={() => setFormBuka(true)}
          style={{ fontSize: 12.5, padding: "9px 16px" }}
        >
          <Plus size={14} />{" "}{t("Catat lamaran", "Log application")}
        </Button>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: T.inkSoft,
            padding: 30,
          }}
        >
          <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />{" "}
          {t("Memuat lamaran...", "Loading applications...")}
        </div>
      ) : lamaran.length === 0 ? (
        <Glass style={{ padding: 40, textAlign: "center" }}>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 600,
              color: T.ink,
              marginBottom: 6,
            }}
          >
            {t("Belum ada lamaran tercatat", "No applications logged yet")}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: T.inkSoft,
              lineHeight: 1.65,
              maxWidth: 380,
              margin: "0 auto 16px",
            }}
          >
            {t("Catat setiap lowongan yang kamu lamar, lalu perbarui tahapnya sendiri saat ada perkembangan. Kamu bisa menambah dari sini atau lewat tombol Lamar di daftar loker.", "Log every job you apply to, then update its stage yourself as things progress. Add them here or with the Apply button in the job list.")}
          </div>
          <Button variant="primary" onClick={() => setFormBuka(true)}>
            <Plus size={14} />{" "}{t("Catat lamaran pertama", "Log your first application")}
          </Button>
        </Glass>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${TAHAPAN.length}, minmax(190px, 1fr))`,
            gap: 12,
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          {kolom.map((col) => (
            <div key={col.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 99,
                    background: col.warna,
                  }}
                />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>
                  {col.label}
                </span>
                <span style={{ fontSize: 11, color: T.inkFaint }}>
                  ({col.items.length})
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.items.map((it) => (
                  <KartuLamaran
                    key={it.id}
                    item={it}
                    onPerbarui={perbarui}
                    onHapus={hapus}
                  />
                ))}
                {col.items.length === 0 && (
                  <div
                    style={{
                      fontSize: 11,
                      color: T.inkFaint,
                      textAlign: "center",
                      padding: "18px 10px",
                      border: `1.5px dashed ${T.border}`,
                      borderRadius: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    {col.deskripsi}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {formBuka && (
        <FormTambah onTutup={() => setFormBuka(false)} onSimpan={tambah} />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
