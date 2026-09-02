import React, { useState } from "react";
import { Plus, Check, Trash2, ExternalLink, X } from "lucide-react";
import { T } from "../../theme";
import { Button } from "../ui/Button";

const LI = {
  blue: "#0A66C2",
  border: "rgba(0,0,0,0.08)",
  text: "rgba(0,0,0,0.9)",
  textSoft: "rgba(0,0,0,0.6)",
  font: "-apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const inputStyle = {
  width: "100%",
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: "8px 11px",
  fontSize: 13,
  fontFamily: LI.font,
  background: "#fff",
  outline: "none",
  color: LI.text,
  boxSizing: "border-box",
};

/**
 * Editor poin-poin, sepadan dengan BulletListField di CV Builder.
 *
 * Sebelumnya bagian ini memakai satu textarea bebas. Poin terpisah lebih
 * cocok karena isinya memang daftar kegiatan, dan bentuknya jadi sama
 * dengan draft yang dihasilkan AI.
 */
export function EditorPoin({ label, items, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  // Data lama tersimpan sebagai string. Diubah jadi satu poin supaya
  // tidak hilang saat formatnya berganti.
  const poin = Array.isArray(items) ? items : items ? [items] : [];

  const tambah = () => {
    const bersih = draft.trim();
    if (!bersih) return;
    onChange([...poin, bersih]);
    setDraft("");
  };

  return (
    <div>
      {label && (
        <label
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: T.inkSoft,
            display: "block",
            marginBottom: 5,
          }}
        >
          {label}
        </label>
      )}

      {poin.map((it, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 7,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 11.5,
              color: T.inkFaint,
              marginTop: 9,
              flexShrink: 0,
              minWidth: 14,
            }}
          >
            {i + 1}.
          </span>
          <textarea
            value={it}
            onChange={(e) =>
              onChange(poin.map((p, j) => (j === i ? e.target.value : p)))
            }
            rows={2}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
          />
          <button
            onClick={() => onChange(poin.filter((_, j) => j !== i))}
            title="Hapus poin"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#B23A3A",
              padding: "8px 2px",
              flexShrink: 0,
            }}
          >
            <X size={13} />
          </button>
        </div>
      ))}

      <div style={{ display: "flex", gap: 7 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter menambah poin; Shift+Enter untuk baris baru di dalam poin
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              tambah();
            }
          }}
          rows={2}
          placeholder={placeholder || "Tulis satu poin, lalu Enter"}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
        />
        <Button
          variant="outline"
          onClick={tambah}
          disabled={!draft.trim()}
          style={{
            fontSize: 11.5,
            padding: "7px 11px",
            flexShrink: 0,
            alignSelf: "flex-start",
          }}
        >
          <Plus size={12} />
        </Button>
      </div>
    </div>
  );
}

/**
 * Merender satu daftar berulang di dalam mockup LinkedIn
 * (pendidikan, sertifikasi, sukarela, publikasi, penghargaan, bahasa, organisasi).
 * Bentuk kolom dan cara menampilkan diambil dari LI_FIELDS.
 */
export function SectionBerulang({
  items,
  def,
  editId,
  setEditId,
  onUbah,
  onTambah,
  onHapus,
  labelTambah,
}) {
  return (
    <>
      {items.map((item, idx) => {
        const sedangEdit = editId === item.id;
        const judul = def.judul?.(item);
        const sub = def.sub?.(item);
        const meta = def.meta?.(item);
        const ekstra = def.ekstra?.(item);
        const tautan = def.tautan?.(item);

        return (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setEditId(sedangEdit ? null : item.id);
            }}
            style={{
              display: "flex",
              gap: 12,
              paddingBottom: 14,
              marginBottom: 14,
              borderBottom:
                idx < items.length - 1 ? `1px solid ${LI.border}` : "none",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 4,
                background: "#E1DFDA",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 700,
                color: "rgba(0,0,0,0.4)",
              }}
            >
              {(judul || "?").charAt(0).toUpperCase()}
            </div>

            {sedangEdit ? (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 7,
                  }}
                >
                  {def.kolom.map((f) => (
                    <div
                      key={f.k}
                      style={{ gridColumn: f.lebar === 2 ? "span 2" : "auto" }}
                    >
                      {f.tipe === "select" ? (
                        <select
                          value={item[f.k] || ""}
                          onChange={(e) =>
                            onUbah(item.id, { ...item, [f.k]: e.target.value })
                          }
                          style={{ ...inputStyle, cursor: "pointer" }}
                        >
                          <option value="">{f.ph}</option>
                          {f.pilihan.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={item[f.k] || ""}
                          onChange={(e) =>
                            onUbah(item.id, { ...item, [f.k]: e.target.value })
                          }
                          placeholder={f.ph}
                          style={inputStyle}
                        />
                      )}
                    </div>
                  ))}
                </div>
                {def.deskripsi && (
                  <EditorPoin
                    items={item.desc}
                    onChange={(poin) =>
                      onUbah(item.id, { ...item, desc: poin })
                    }
                    placeholder={def.deskripsi}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => onHapus(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11.5,
                      color: "#B23A3A",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <Trash2 size={11} /> Hapus
                  </button>
                  <Button
                    variant="outline"
                    onClick={() => setEditId(null)}
                    style={{ fontSize: 11.5, padding: "6px 12px" }}
                  >
                    <Check size={12} /> Selesai
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontSize: 14.5, fontWeight: 600, color: LI.text }}
                >
                  {judul || (
                    <span style={{ color: "rgba(0,0,0,0.3)" }}>
                      Klik untuk mengisi
                    </span>
                  )}
                </div>
                {sub && (
                  <div style={{ fontSize: 13, color: LI.text }}>{sub}</div>
                )}
                {meta && (
                  <div style={{ fontSize: 12.5, color: LI.textSoft }}>
                    {meta}
                  </div>
                )}
                {ekstra && (
                  <div style={{ fontSize: 12.5, color: LI.textSoft }}>
                    {ekstra}
                  </div>
                )}
                {(() => {
                  const poin = Array.isArray(item.desc)
                    ? item.desc
                    : item.desc
                      ? [item.desc]
                      : [];
                  if (poin.length === 0) return null;
                  return (
                    <div style={{ marginTop: 7 }}>
                      {poin.filter(Boolean).map((d, i) => (
                        <div
                          key={i}
                          style={{ display: "flex", gap: 7, marginBottom: 3 }}
                        >
                          <span
                            style={{
                              width: 3,
                              height: 3,
                              borderRadius: "50%",
                              background: "#666",
                              flexShrink: 0,
                              marginTop: 8,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              color: LI.text,
                              lineHeight: 1.6,
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            {d}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                {tautan && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 8,
                      border: `1px solid ${LI.border}`,
                      borderRadius: 99,
                      padding: "4px 11px",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: LI.text,
                    }}
                  >
                    Tampilkan kredensial <ExternalLink size={11} />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onTambah();
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: `1px solid ${LI.blue}`,
          color: LI.blue,
          borderRadius: 99,
          padding: "6px 14px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: LI.font,
        }}
      >
        <Plus size={13} /> {labelTambah}
      </button>
    </>
  );
}
