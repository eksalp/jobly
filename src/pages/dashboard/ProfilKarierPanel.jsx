import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Building2,
  DollarSign,
  Check,
  Pencil,
  Plus,
  X,
  Briefcase,
  Loader2,
  Trash2,
} from "lucide-react";
import { T } from "../../theme";
import { useUserProfile } from "../../context/UserProfileContext";
import { useAuth } from "../../context/AuthContext";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { getInitials } from "../../utils/format";
import { Glass } from "../../components/ui/Glass";
import { Button } from "../../components/ui/Button";
import { t } from "../../i18n.js";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function PrefItem({ label, value, icon: Icon }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: T.inkFaint,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Icon size={12} /> {label}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>
        {value}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FORM inline untuk tambah / edit pengalaman kerja                    */
/* ------------------------------------------------------------------ */
function ExpForm({ draft, onChange, onSave, onCancel, saving }) {
  const inputStyle = {
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: "8px 10px",
    fontSize: 13,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    background: "var(--t-field)",
    outline: "none",
    color: T.ink,
  };
  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        background: "var(--t-field)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <input
          value={draft.role}
          onChange={(e) => onChange({ ...draft, role: e.target.value })}
          placeholder={t("Posisi / Jabatan", "Role / Title")}
          style={inputStyle}
        />
        <input
          value={draft.company}
          onChange={(e) => onChange({ ...draft, company: e.target.value })}
          placeholder={t("Perusahaan", "Company")}
          style={inputStyle}
        />
        <input
          value={draft.start}
          onChange={(e) => onChange({ ...draft, start: e.target.value })}
          placeholder={t("Mulai, mis. Jan 2023", "Start, e.g. Jan 2023")}
          style={inputStyle}
        />
        <input
          value={draft.end}
          onChange={(e) => onChange({ ...draft, end: e.target.value })}
          placeholder={t("Selesai, mis. Sekarang", "End, e.g. Present")}
          style={inputStyle}
        />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button
          variant="outline"
          style={{ fontSize: 12, padding: "7px 12px" }}
          onClick={onCancel}
        >
          {t("Batal", "Cancel")}
        </Button>
        <Button
          variant="primary"
          style={{ fontSize: 12, padding: "7px 12px" }}
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2
              size={13}
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : (
            <Check size={13} />
          )}{" "}
          {t("Simpan", "Save")}
        </Button>
      </div>
    </div>
  );
}

export function ProfilKarierPanel() {
  const {
    fullName,
    headline,
    location,
    summary,
    skills,
    addSkill,
    removeSkill,
    updateProfile,
    profileLoading,
  } = useUserProfile();
  const { user } = useAuth();
  const [newSkill, setNewSkill] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ fullName, headline, location, summary });

  /* ------------------------------------------------------------------ */
  /*  PENGALAMAN KERJA — otomatis sinkron dengan cv_json dari CV Builder */
  /* ------------------------------------------------------------------ */
  const [cvExperiences, setCvExperiences] = useState([]);
  const [cvSummary, setCvSummary] = useState("");
  const [jobPref, setJobPref] = useState({
    location: "",
    tipeKerja: [],
    gajiMin: "",
    gajiMax: "",
  });
  const [expLoading, setExpLoading] = useState(false);
  const [expSaving, setExpSaving] = useState(false);
  const rawCvJson = useRef(null); // simpan cv_json utuh, biar field lain (pendidikan, dst) nggak ketimpa

  const [addingExp, setAddingExp] = useState(false);
  const [expDraft, setExpDraft] = useState({
    role: "",
    company: "",
    start: "",
    end: "",
  });
  const [editingExpId, setEditingExpId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    role: "",
    company: "",
    start: "",
    end: "",
  });

  useEffect(() => {
    if (!user || !supabaseConfigured) return;
    setExpLoading(true);
    supabase
      .from("profiles")
      .select("cv_json")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data: row }) => {
        const cv = row?.cv_json || {};
        rawCvJson.current = cv;
        setCvExperiences(Array.isArray(cv.experiences) ? cv.experiences : []);
        setCvSummary(cv.summary || "");
        setJobPref({
          location: cv.jobPreferences?.location || "",
          tipeKerja: Array.isArray(cv.jobPreferences?.tipeKerja)
            ? cv.jobPreferences.tipeKerja
            : [],
          gajiMin: cv.jobPreferences?.gajiMin || "",
          gajiMax: cv.jobPreferences?.gajiMax || "",
        });
        setExpLoading(false);
      });
  }, [user?.id]);

  // Fungsi umum: gabungkan partial data ke cv_json yang sudah ada, lalu
  // tulis balik ke Supabase — dipakai untuk pengalaman, ringkasan, & preferensi.
  const persistCvJson = async (partial) => {
    if (!user || !supabaseConfigured) return;
    setExpSaving(true);
    const mergedCvJson = { ...(rawCvJson.current || {}), ...partial };
    const { error } = await supabase
      .from("profiles")
      .update({ cv_json: mergedCvJson, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setExpSaving(false);
    if (!error) {
      rawCvJson.current = mergedCvJson;
    }
  };

  const persistExperiences = async (updated) => {
    setCvExperiences(updated); // optimistic update di UI dulu
    await persistCvJson({ experiences: updated });
  };

  // Ringkasan yang ditampilkan: prioritaskan yang ditulis di CV Builder
  // (cv_json.summary), fallback ke summary di Profil Karier kalau CV
  // Builder belum diisi.
  const displayedSummary = cvSummary || summary;

  const startEdit = () => {
    setDraft({ fullName, headline, location, summary: displayedSummary });
    setEditing(true);
  };

  const saveEdit = () => {
    updateProfile({
      fullName: draft.fullName,
      headline: draft.headline,
      location: draft.location,
      summary: draft.summary,
    });
    setCvSummary(draft.summary);
    persistCvJson({ summary: draft.summary });
    setEditing(false);
  };

  const handleAddExp = () => {
    if (!expDraft.role.trim() && !expDraft.company.trim()) return;
    const newItem = { id: uid(), ...expDraft, desc: [] };
    persistExperiences([...cvExperiences, newItem]);
    setExpDraft({ role: "", company: "", start: "", end: "" });
    setAddingExp(false);
  };

  const startEditExp = (item) => {
    setEditingExpId(item.id);
    setEditDraft({
      role: item.role || "",
      company: item.company || "",
      start: item.start || "",
      end: item.end || "",
    });
  };

  const saveEditExp = () => {
    const updated = cvExperiences.map((it) =>
      it.id === editingExpId ? { ...it, ...editDraft } : it,
    );
    persistExperiences(updated);
    setEditingExpId(null);
  };

  const deleteExp = (id) => {
    persistExperiences(cvExperiences.filter((it) => it.id !== id));
  };

  /* ------------------------------------------------------------------ */
  /*  PREFERENSI KERJA — tersimpan di cv_json.jobPreferences              */
  /* ------------------------------------------------------------------ */
  const TIPE_KERJA_OPTIONS = [
    "Full-time",
    "Kontrak",
    "Freelance",
    "Magang",
    "Remote",
  ];
  const [editingPref, setEditingPref] = useState(false);
  const [prefDraft, setPrefDraft] = useState({
    location: "",
    tipeKerja: [],
    gajiMin: "",
    gajiMax: "",
  });

  const startEditPref = () => {
    setPrefDraft({
      location: jobPref.location || location || "",
      tipeKerja: jobPref.tipeKerja,
      gajiMin: jobPref.gajiMin,
      gajiMax: jobPref.gajiMax,
    });
    setEditingPref(true);
  };

  const toggleTipeKerja = (opt) => {
    setPrefDraft((prev) => ({
      ...prev,
      tipeKerja: prev.tipeKerja.includes(opt)
        ? prev.tipeKerja.filter((tt) => tt !== opt)
        : [...prev.tipeKerja, opt],
    }));
  };

  const saveEditPref = () => {
    setJobPref(prefDraft);
    persistCvJson({ jobPreferences: prefDraft });
    setEditingPref(false);
  };

  const tipeKerjaDisplay =
    jobPref.tipeKerja.length > 0 ? jobPref.tipeKerja.join(", ") : t("Belum diisi", "Not filled in");
  const gajiDisplay =
    jobPref.gajiMin || jobPref.gajiMax
      ? `Rp ${jobPref.gajiMin || "?"}–${jobPref.gajiMax || "?"} jt`
      : t("Belum diisi", "Not filled in");
  const lokasiPrefDisplay = jobPref.location || location || t("Belum diisi", "Not filled in");

  return (
    <div style={{ padding: 28, maxWidth: 840, margin: "0 auto" }}>
      {profileLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12.5,
            color: T.inkSoft,
            marginBottom: 16,
          }}
        >
          <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
          {t("Memuat profil...", "Loading profile...")}
        </div>
      ) : null}
      <Glass
        style={{
          padding: 24,
          marginBottom: 16,
          display: "flex",
          gap: 20,
          alignItems: editing ? "flex-start" : "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: T.accent,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            flexShrink: 0,
          }}
        >
          {getInitials(fullName)}
        </div>
        {editing ? (
          <div
            style={{
              flex: 1,
              minWidth: 220,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <input
              value={draft.fullName}
              onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
              placeholder={t("Nama lengkap", "Full name")}
              style={{
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                background: "var(--t-field)",
                outline: "none",
                color: T.ink,
              }}
            />
            <input
              value={draft.headline}
              onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
              placeholder={t("Headline, mis. Finance & Tax Staff", "Headline, e.g. Finance & Tax Staff")}
              style={{
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 13,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                background: "var(--t-field)",
                outline: "none",
                color: T.ink,
              }}
            />
            <input
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              placeholder={t("Lokasi, mis. Jakarta, Indonesia", "Location, e.g. Jakarta, Indonesia")}
              style={{
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 13,
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                background: "var(--t-field)",
                outline: "none",
                color: T.ink,
              }}
            />
          </div>
        ) : (
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T.ink }}>
              {fullName || t("Lengkapi nama kamu", "Add your name")}
            </div>
            <div style={{ fontSize: 13, color: T.inkSoft }}>
              {[headline, location].filter(Boolean).join(" · ") ||
                t("Belum ada headline & lokasi", "No headline & location yet")}
            </div>
          </div>
        )}
        {editing ? (
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              variant="outline"
              style={{ fontSize: 12.5, padding: "8px 14px" }}
              onClick={() => setEditing(false)}
            >
              {t("Batal", "Cancel")}
            </Button>
            <Button
              variant="primary"
              style={{ fontSize: 12.5, padding: "8px 14px" }}
              onClick={saveEdit}
            >
              <Check size={13} />{" "}{t("Simpan", "Save")}
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={startEdit}>
            <Pencil size={14} />{" "}{t("Edit Profil", "Edit profile")}
          </Button>
        )}
      </Glass>
      <Glass style={{ padding: 22, marginBottom: 16 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14.5,
            color: T.ink,
            marginBottom: 12,
          }}
        >
          {t("Ringkasan", "Summary")}
        </div>
        {editing ? (
          <textarea
            value={draft.summary}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            placeholder={t("Deskripsikan dirimu secara singkat...", "Describe yourself briefly...")}
            rows={4}
            style={{
              width: "100%",
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 12,
              fontSize: 13.5,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              resize: "vertical",
              outline: "none",
              color: T.ink,
              background: "var(--t-field)",
            }}
          />
        ) : (
          <p
            style={{
              fontSize: 13.5,
              color: T.inkSoft,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {displayedSummary ||
              t("Belum ada ringkasan. Klik Edit Profil buat isi, atau isi lewat CV Builder.", "No summary yet. Click Edit profile to add one, or fill it in through the CV Builder.")}
          </p>
        )}
        <div style={{ fontSize: 11.5, color: T.inkFaint, marginTop: 10 }}>
          {t("Ringkasan ini otomatis sinkron dengan Ringkasan Profil di CV Builder.", "This summary syncs automatically with the Profile Summary in the CV Builder.")}
        </div>
      </Glass>
      <Glass style={{ padding: 22, marginBottom: 16 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14.5,
            color: T.ink,
            marginBottom: 12,
          }}
        >
          {t("Keahlian", "Skills")}
        </div>

        {/* Daftar chip skill */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {skills.map((s) => (
            <span
              key={s}
              style={{
                fontSize: 12.5,
                background: T.accentSoft,
                color: T.accent,
                padding: "6px 8px 6px 12px",
                borderRadius: 99,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {s}
              <X
                size={12}
                style={{ cursor: "pointer" }}
                onClick={() => removeSkill(s)}
              />
            </span>
          ))}
          {skills.length === 0 && (
            <span style={{ fontSize: 12.5, color: T.inkFaint }}>
              {t("Belum ada skill ditambahkan.", "No skills added yet.")}
            </span>
          )}
        </div>

        {/* Input + tombol tambah */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addSkill(newSkill);
                setNewSkill("");
              }
            }}
            placeholder={t("Tambah skill, lalu Enter...", "Add a skill, then press Enter...")}
            style={{
              flex: "1 1 160px",
              minWidth: 0,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "9px 12px",
              fontSize: 13,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              background: "var(--t-field)",
              outline: "none",
              color: T.ink,
              boxSizing: "border-box",
            }}
          />
          <Button
            variant="outline"
            style={{
              fontSize: 12.5,
              padding: "8px 14px",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
            onClick={() => {
              addSkill(newSkill);
              setNewSkill("");
            }}
          >
            <Plus size={13} />{" "}{t("Tambah", "Add")}
          </Button>
        </div>

        <div style={{ fontSize: 11.5, color: T.inkFaint, marginTop: 10 }}>
          {t("Skill ini dipakai buat menyaring loker yang cocok di halaman Job Finder.", "These skills are used to filter matching jobs in Matched for me.")}
        </div>
      </Glass>
      <Glass style={{ padding: 22, marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14.5, color: T.ink }}>
            {t("Pengalaman Kerja", "Work experience")}
          </div>
          {expSaving && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: T.inkFaint,
              }}
            >
              <Loader2
                size={11}
                style={{ animation: "spin 1s linear infinite" }}
              />
              {t("Menyimpan...", "Saving...")}
            </div>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: T.inkFaint, marginBottom: 14 }}>
          {t("Data ini otomatis tersambung dengan Pengalaman Kerja di CV Builder. Kamu bisa isi atau ubah di sini maupun di CV Builder, hasilnya tetap sama.", "This syncs automatically with Work Experience in the CV Builder. Edit it here or there, the result is the same.")}
        </div>

        {expLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              color: T.inkSoft,
              marginBottom: 14,
            }}
          >
            <Loader2
              size={14}
              style={{ animation: "spin 1s linear infinite" }}
            />
            {t("Memuat pengalaman kerja...", "Loading work experience...")}
          </div>
        ) : (
          <>
            {cvExperiences.length === 0 && !addingExp && (
              <div
                style={{ fontSize: 12.5, color: T.inkFaint, marginBottom: 14 }}
              >
                {t("Belum ada pengalaman kerja. Tambahkan di sini atau lewat CV Builder.", "No work experience yet. Add it here or through the CV Builder.")}
              </div>
            )}

            {cvExperiences.map((e) =>
              editingExpId === e.id ? (
                <ExpForm
                  key={e.id}
                  draft={editDraft}
                  onChange={setEditDraft}
                  onSave={saveEditExp}
                  onCancel={() => setEditingExpId(null)}
                  saving={expSaving}
                />
              ) : (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    gap: 14,
                    marginBottom: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: T.accentSoft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Briefcase size={15} color={T.accent} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontWeight: 600, fontSize: 13.5, color: T.ink }}
                    >
                      {e.role || t("Posisi belum diisi", "Role not filled in")}
                    </div>
                    <div style={{ fontSize: 12.5, color: T.inkSoft }}>
                      {[e.company, [e.start, e.end].filter(Boolean).join(" – ")]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button
                      onClick={() => startEditExp(e)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: T.inkFaint,
                        padding: 4,
                        display: "flex",
                      }}
                      title={t("Edit", "Edit")}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteExp(e.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--t-danger)",
                        padding: 4,
                        display: "flex",
                      }}
                      title={t("Hapus", "Delete")}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ),
            )}

            {addingExp && (
              <ExpForm
                draft={expDraft}
                onChange={setExpDraft}
                onSave={handleAddExp}
                onCancel={() => {
                  setAddingExp(false);
                  setExpDraft({ role: "", company: "", start: "", end: "" });
                }}
                saving={expSaving}
              />
            )}

            {!addingExp && (
              <Button
                variant="outline"
                style={{ fontSize: 12.5, padding: "8px 14px" }}
                onClick={() => setAddingExp(true)}
              >
                <Plus size={13} />{" "}{t("Tambah Pengalaman", "Add experience")}
              </Button>
            )}
          </>
        )}
      </Glass>
      <Glass style={{ padding: 22 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14.5, color: T.ink }}>
            {t("Preferensi Kerja", "Work preferences")}
          </div>
          {editingPref ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                variant="outline"
                style={{ fontSize: 12, padding: "6px 12px" }}
                onClick={() => setEditingPref(false)}
              >
                {t("Batal", "Cancel")}
              </Button>
              <Button
                variant="primary"
                style={{ fontSize: 12, padding: "6px 12px" }}
                onClick={saveEditPref}
                disabled={expSaving}
              >
                {expSaving ? (
                  <Loader2
                    size={12}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Check size={12} />
                )}{" "}
                {t("Simpan", "Save")}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              style={{ fontSize: 12, padding: "6px 12px" }}
              onClick={startEditPref}
            >
              <Pencil size={12} />{" "}{t("Edit", "Edit")}
            </Button>
          )}
        </div>

        {editingPref ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: T.inkFaint,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 6,
                }}
              >
                {t("Lokasi", "Location")}
              </div>
              <input
                value={prefDraft.location}
                onChange={(e) =>
                  setPrefDraft({ ...prefDraft, location: e.target.value })
                }
                placeholder="Jakarta, Indonesia"
                style={{
                  width: "100%",
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  background: "var(--t-field)",
                  outline: "none",
                  color: T.ink,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: 11,
                  color: T.inkFaint,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 6,
                }}
              >
                {t("Tipe Kerja", "Work type")}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TIPE_KERJA_OPTIONS.map((opt) => {
                  const active = prefDraft.tipeKerja.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleTipeKerja(opt)}
                      style={{
                        padding: "7px 13px",
                        borderRadius: 99,
                        border: `1px solid ${active ? T.accent : T.border}`,
                        background: active ? T.accentSoft : "transparent",
                        color: active ? T.accent : T.inkSoft,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 11,
                  color: T.inkFaint,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 6,
                }}
              >
                {t("Ekspektasi Gaji (juta/bulan)", "Salary expectation (million/month)")}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  value={prefDraft.gajiMin}
                  onChange={(e) =>
                    setPrefDraft({ ...prefDraft, gajiMin: e.target.value })
                  }
                  placeholder={t("Min, mis. 8", "Min, e.g. 8")}
                  inputMode="numeric"
                  style={{
                    width: "100%",
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: 13,
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    background: "var(--t-field)",
                    outline: "none",
                    color: T.ink,
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ color: T.inkFaint, fontSize: 12 }}>-</span>
                <input
                  value={prefDraft.gajiMax}
                  onChange={(e) =>
                    setPrefDraft({ ...prefDraft, gajiMax: e.target.value })
                  }
                  placeholder={t("Max, mis. 14", "Max, e.g. 14")}
                  inputMode="numeric"
                  style={{
                    width: "100%",
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: 13,
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    background: "var(--t-field)",
                    outline: "none",
                    color: T.ink,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
            }}
          >
            <PrefItem label={t("Lokasi", "Location")} value={lokasiPrefDisplay} icon={MapPin} />
            <PrefItem label={t("Tipe", "Type")} value={tipeKerjaDisplay} icon={Briefcase} />
            <PrefItem
              label={t("Ekspektasi Gaji", "Salary expectation")}
              value={gajiDisplay}
              icon={DollarSign}
            />
          </div>
        )}
      </Glass>
    </div>
  );
}
