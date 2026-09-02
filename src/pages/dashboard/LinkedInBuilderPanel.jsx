import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Camera,
  Pencil,
  Plus,
  X,
  Check,
  Loader2,
  Save,
  Sparkles,
  Copy,
  AlertTriangle,
  AlertCircle,
  CircleCheck,
  Trash2,
  ChevronDown,
  Info,
} from "lucide-react";
import { T } from "../../theme";
import { useUserProfile } from "../../context/UserProfileContext";
import { useAuth } from "../../context/AuthContext";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { Button } from "../../components/ui/Button";
import { PilihDraftAi } from "../../components/PilihDraftAi";
import { GerbangFitur } from "../../components/GerbangFitur";
import { useLangganan } from "../../hooks/useLangganan";
import { LI_SPECS, LI_FIELDS } from "../../data/linkedinSpecs";
import {
  SectionBerulang,
  EditorPoin,
} from "../../components/linkedin/SectionBerulang";
import { auditProfile, skorProfil } from "../../utils/linkedinAudit";

/* LinkedIn punya bahasa visual sendiri — di dalam mockup kita ikuti persis,
   di luar mockup (panel review) kita pakai bahasa visual JobFinder. */
const LI = {
  blue: "#0A66C2",
  page: "#F4F2EE",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.08)",
  text: "rgba(0,0,0,0.9)",
  textSoft: "rgba(0,0,0,0.6)",
  radius: 8,
  font: "-apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const STATUS = {
  ok: {
    warna: "#0F7B4F",
    bg: "rgba(15,123,79,0.1)",
    label: "Sudah baik",
    Ikon: CircleCheck,
  },
  warn: {
    warna: "#B45309",
    bg: "rgba(180,83,9,0.1)",
    label: "Bisa lebih baik",
    Ikon: AlertTriangle,
  },
  bad: {
    warna: "#B23A3A",
    bg: "rgba(178,58,58,0.1)",
    label: "Perlu diperbaiki",
    Ikon: AlertCircle,
  },
};

/** Menyeragamkan desc jadi array poin. Data lama tersimpan sebagai string. */
function kePoin(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === "string" && v.trim()) {
    // String panjang dipecah per baris, supaya isian lama tidak menumpuk
    // jadi satu poin raksasa.
    return v
      .split(/\n+/)
      .map((b) => b.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

/** Total panjang teks seluruh poin, dipakai audit. */
function panjangDesk(v) {
  return kePoin(v).join(" ").trim().length;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const PROFIL_KOSONG = {
  nama: "",
  headline: "",
  lokasi: "",
  about: "",
  coverUrl: "",
  photoUrl: "",
  experiences: [
    {
      id: uid(),
      role: "",
      company: "",
      jenis: "",
      start: "",
      end: "",
      lokasi: "",
      desc: [],
      skills: [],
    },
  ],
  education: [{ id: uid(), ...LI_FIELDS.education.kosong }],
  certifications: [{ id: uid(), ...LI_FIELDS.certifications.kosong }],
  volunteering: [{ id: uid(), ...LI_FIELDS.volunteering.kosong }],
  skills: [],
  publications: [{ id: uid(), ...LI_FIELDS.publications.kosong }],
  awards: [{ id: uid(), ...LI_FIELDS.awards.kosong }],
  languages: [{ id: uid(), ...LI_FIELDS.languages.kosong }],
  organizations: [{ id: uid(), ...LI_FIELDS.organizations.kosong }],
};

// Urutan bagian berulang, mengikuti urutan asli di profil LinkedIn
const SECTION_BERULANG = [
  { id: "education", judul: "Pendidikan", tambah: "Tambah pendidikan" },
  {
    id: "certifications",
    judul: "Lisensi & sertifikasi",
    tambah: "Tambah sertifikasi",
  },
  {
    id: "volunteering",
    judul: "Pengalaman sukarela",
    tambah: "Tambah kegiatan",
  },
];

const SECTION_BERULANG_BAWAH = [
  { id: "publications", judul: "Publikasi", tambah: "Tambah publikasi" },
  {
    id: "awards",
    judul: "Penghargaan & prestasi",
    tambah: "Tambah penghargaan",
  },
  { id: "languages", judul: "Bahasa", tambah: "Tambah bahasa" },
  { id: "organizations", judul: "Organisasi", tambah: "Tambah organisasi" },
];

/* ------------------------------------------------------------------ */
/*  Penanda review yang menempel di tiap bagian mockup                  */
/* ------------------------------------------------------------------ */
function PenandaReview({ status, aktif, onClick, adaPanah }) {
  const s = STATUS[status] || STATUS.warn;
  const { Ikon } = s;
  return (
    <button
      // Penanda berada di dalam header yang punya klik sendiri untuk
      // buka-tutup kartu. Tanpa stopPropagation, satu ketukan memicu
      // keduanya sekaligus.
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px 3px 7px",
        borderRadius: 99,
        background: aktif ? s.warna : s.bg,
        color: aktif ? "#fff" : s.warna,
        border: `1px solid ${aktif ? s.warna : "transparent"}`,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'Poppins', sans-serif",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background .12s, color .12s",
      }}
    >
      <Ikon size={11} />
      {s.label}
      {/* Panah menandakan penanda ini membuka panel, bukan sekadar label */}
      {adaPanah && (
        <ChevronDown size={10} style={{ transform: "rotate(-90deg)" }} />
      )}
    </button>
  );
}

/* Bungkus tiap kartu LinkedIn, menambahkan penanda review di pojok */
function KartuLI({
  id,
  judul,
  review,
  dipilih,
  onPilih,
  children,
  padding = 20,
  layarKecil,
}) {
  const aktif = dipilih === id;
  return (
    <div
      // Di layar sempit, hanya penanda status yang membuka laci ulasan.
      // Kalau seluruh kartu ikut membuka, klik untuk mengedit selalu
      // tertutup laci lebih dulu.
      onClick={layarKecil ? undefined : () => onPilih(id)}
      style={{
        background: LI.card,
        border: `1px solid ${aktif ? T.accent : LI.border}`,
        borderRadius: LI.radius,
        marginBottom: 8,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: aktif ? `0 0 0 3px ${T.accentSoft}` : "none",
        transition: "border-color .12s, box-shadow .12s",
      }}
    >
      {judul && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: `${padding}px ${padding}px 0`,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: LI.text,
              fontFamily: LI.font,
            }}
          >
            {judul}
          </span>
          {review && (
            <PenandaReview
              status={review.status}
              aktif={aktif}
              onClick={() => onPilih(id)}
              adaPanah={layarKecil}
            />
          )}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Panel review di kolom kanan                                         */
/* ------------------------------------------------------------------ */
function PanelReview({
  bagian,
  review,
  spec,
  saranAi,
  bisaDiterapkan,
  onTerapkanSaran,
  onTutup,
}) {
  if (!bagian) {
    return (
      <div
        style={{
          padding: "28px 22px",
          textAlign: "center",
          color: T.inkFaint,
          fontSize: 12.5,
          lineHeight: 1.7,
        }}
      >
        <Info size={22} style={{ marginBottom: 10, opacity: 0.5 }} />
        <div>
          Klik bagian mana pun di profil sebelah kiri untuk melihat ukuran yang
          benar, temuan, dan saran perbaikan.
        </div>
      </div>
    );
  }

  const s = STATUS[review?.status] || STATUS.warn;
  const { Ikon } = s;

  return (
    <div style={{ padding: "18px 20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 3,
        }}
      >
        <Ikon size={15} color={s.warna} />
        <span style={{ fontSize: 15, fontWeight: 600, color: T.ink, flex: 1 }}>
          {spec.label}
        </span>
        {onTutup && (
          <button
            onClick={onTutup}
            aria-label="Tutup"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.inkFaint,
              padding: 4,
              display: "flex",
              flexShrink: 0,
            }}
          >
            <X size={17} />
          </button>
        )}
      </div>
      <div style={{ fontSize: 12, color: T.inkSoft, marginBottom: 18 }}>
        {review?.ringkas}
      </div>

      {/* Spesifikasi teknis */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.inkFaint,
            marginBottom: 8,
            letterSpacing: "0.03em",
          }}
        >
          Ketentuan LinkedIn
        </div>
        <div
          style={{
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {spec.spec.map(([k, v], i) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                padding: "8px 11px",
                fontSize: 11.5,
                borderTop: i > 0 ? `1px solid ${T.border}` : "none",
                background: i % 2 ? "rgba(0,0,0,0.015)" : "transparent",
              }}
            >
              <span style={{ color: T.inkSoft }}>{k}</span>
              <span
                style={{
                  color: T.ink,
                  fontWeight: 600,
                  textAlign: "right",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Temuan dari profil user */}
      {review?.temuan?.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.inkFaint,
              marginBottom: 8,
              letterSpacing: "0.03em",
            }}
          >
            Temuan di profilmu
          </div>
          {review.temuan.map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                fontSize: 12,
                color: T.ink,
                lineHeight: 1.6,
                marginBottom: 7,
                paddingLeft: 2,
              }}
            >
              <span style={{ color: s.warna, flexShrink: 0, marginTop: 1 }}>
                •
              </span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      )}

      {/* Panduan umum */}
      <div style={{ marginBottom: saranAi ? 18 : 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.inkFaint,
            marginBottom: 8,
            letterSpacing: "0.03em",
          }}
        >
          Cara memperbaiki
        </div>
        {spec.panduan.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              fontSize: 12,
              color: T.inkSoft,
              lineHeight: 1.6,
              marginBottom: 7,
            }}
          >
            <span style={{ color: T.accent, flexShrink: 0, marginTop: 1 }}>
              •
            </span>
            <span>{t}</span>
          </div>
        ))}
      </div>

      {/* Tulisan hasil AI, kalau ada.
          Bagian seperti foto dan sampul hanya menghasilkan nasihat — tidak
          ada isi yang bisa dimasukkan ke form, jadi tombolnya tidak
          ditampilkan supaya tidak terlihat bisa ditekan padahal tidak. */}
      {saranAi && (
        <div
          style={{
            border: `1px solid ${T.teal}`,
            borderRadius: 12,
            padding: 14,
            background: "rgba(20,184,166,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 9,
            }}
          >
            <Sparkles size={13} color={T.teal} />
            <span style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>
              {bisaDiterapkan ? "Versi tulis ulang dari AI" : "Saran dari AI"}
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.ink,
              lineHeight: 1.65,
              whiteSpace: "pre-wrap",
              background: "#fff",
              border: `1px solid ${T.border}`,
              borderRadius: 9,
              padding: "10px 12px",
              marginBottom: bisaDiterapkan ? 10 : 0,
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {saranAi}
          </div>
          {bisaDiterapkan && (
            <Button
              variant="primary"
              onClick={onTerapkanSaran}
              style={{ fontSize: 11.5, padding: "7px 13px", width: "100%" }}
            >
              <Check size={12} /> Pakai versi ini
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PANEL UTAMA                                                         */
/* ------------------------------------------------------------------ */
export function LinkedInBuilderPanel({ setActive }) {
  const { fullName, headline, location, summary, skills } = useUserProfile();
  const { user } = useAuth();
  const langganan = useLangganan();
  const layarKecil = useLayarKecil(1000);

  // Berpindah ukuran layar saat ada bagian terpilih akan membuka laci
  // secara tiba-tiba. Pilihannya dibersihkan supaya itu tidak terjadi.
  useEffect(() => {
    setDipilih(null);
  }, [layarKecil]);

  const [p, setP] = useState(PROFIL_KOSONG);
  const [dipilih, setDipilih] = useState(null); // bagian yang sedang diulas
  const [edit, setEdit] = useState(null); // bagian yang sedang diedit
  const [aiDraft, setAiDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pesan, setPesan] = useState("");
  const [dirty, setDirty] = useState(false);
  const [skillBaru, setSkillBaru] = useState("");
  const loaded = useRef(false);

  /* Pre-fill dari profil karier */
  useEffect(() => {
    if (loaded.current) return;
    if (!fullName && !headline && !summary && skills.length === 0) return;
    loaded.current = true;
    setP((prev) => ({
      ...prev,
      nama: fullName || prev.nama,
      headline: headline || prev.headline,
      lokasi: location || prev.lokasi,
      about: summary || prev.about,
      skills: skills.length > 0 ? [...skills] : prev.skills,
    }));
  }, [fullName, headline, location, summary, skills]);

  /* Muat draft tersimpan + draft AI */
  useEffect(() => {
    if (!user || !supabaseConfigured) return;
    supabase
      .from("profiles")
      .select("linkedin_json")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data: row }) => {
        if (row?.linkedin_json && Object.keys(row.linkedin_json).length > 0) {
          setP((prev) => ({
            ...prev,
            ...row.linkedin_json,
            experiences: (row.linkedin_json.experiences || []).map((e) => ({
              ...e,
              id: e.id || uid(),
              desc: kePoin(e.desc),
            })),
          }));
          loaded.current = true;
        }
      });
  }, [user?.id]);

  useEffect(() => {
    if (!loaded.current) return;
    setDirty(true);
  }, [p]);

  // Saat laci terbuka, halaman di belakangnya dikunci supaya sentuhan
  // tidak menggulir latar, dan Escape menutup seperti dialog pada umumnya.
  useEffect(() => {
    if (!layarKecil || !dipilih) return;

    const semulaOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const tekan = (e) => {
      if (e.key === "Escape") setDipilih(null);
    };
    window.addEventListener("keydown", tekan);

    return () => {
      document.body.style.overflow = semulaOverflow;
      window.removeEventListener("keydown", tekan);
    };
  }, [layarKecil, dipilih]);

  const review = useMemo(() => auditProfile(p), [p]);
  const skor = useMemo(() => skorProfil(review), [review]);
  const skorWarna = skor >= 75 ? "#0F7B4F" : skor >= 50 ? "#B45309" : "#B23A3A";

  const ubah = (field) => (e) =>
    setP((prev) => ({ ...prev, [field]: e.target.value }));

  const expUbah = (id, updated) =>
    setP((prev) => ({
      ...prev,
      experiences: prev.experiences.map((i) => (i.id === id ? updated : i)),
    }));
  const expTambah = () =>
    setP((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: uid(),
          role: "",
          company: "",
          jenis: "",
          start: "",
          end: "",
          lokasi: "",
          desc: [],
          skills: [],
        },
      ],
    }));
  const expHapus = (id) =>
    setP((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((i) => i.id !== id),
    }));

  /* Helper generik untuk semua daftar berulang */
  const daftarUbah = (key) => (id, updated) =>
    setP((prev) => ({
      ...prev,
      [key]: prev[key].map((i) => (i.id === id ? updated : i)),
    }));
  const daftarTambah = (key) => () =>
    setP((prev) => ({
      ...prev,
      [key]: [...prev[key], { id: uid(), ...LI_FIELDS[key].kosong }],
    }));
  const daftarHapus = (key) => (id) =>
    setP((prev) => ({ ...prev, [key]: prev[key].filter((i) => i.id !== id) }));

  const tambahSkill = () => {
    const c = skillBaru.trim();
    if (!c || p.skills.includes(c)) return;
    setP((prev) => ({ ...prev, skills: [...prev.skills, c] }));
    setSkillBaru("");
  };

  // Menerapkan seluruh bagian draft sekaligus, dipakai tombol di banner atas.
  // Saran per bagian tetap tersedia lewat panel review di sebelah kanan,
  // untuk user yang cuma mau mengambil sebagian.
  const terapkanSemuaDariDraft = (d) => {
    if (!d) return;
    const berId = (arr, kunci) =>
      Array.isArray(arr) && arr.length > 0
        ? arr.map((i) => ({
            ...LI_FIELDS[kunci].kosong,
            ...i,
            id: i.id || uid(),
            ...(i.desc !== undefined ? { desc: kePoin(i.desc) } : null),
          }))
        : null;

    setP((prev) => ({
      ...prev,
      headline: d.headline || prev.headline,
      about: d.about || prev.about,
      experiences:
        Array.isArray(d.experiences) && d.experiences.length > 0
          ? d.experiences.map((e) => ({
              ...e,
              id: e.id || uid(),
              skills: e.skills || [],
              desc: kePoin(e.desc),
            }))
          : prev.experiences,
      education: berId(d.education, "education") ?? prev.education,
      certifications:
        berId(d.certifications, "certifications") ?? prev.certifications,
      volunteering: berId(d.volunteering, "volunteering") ?? prev.volunteering,
      skills:
        Array.isArray(d.skills) && d.skills.length > 0 ? d.skills : prev.skills,
      publications: berId(d.publications, "publications") ?? prev.publications,
      awards: berId(d.awards, "awards") ?? prev.awards,
      languages: berId(d.languages, "languages") ?? prev.languages,
      organizations:
        berId(d.organizations, "organizations") ?? prev.organizations,
    }));
    loaded.current = true;
    setDirty(true);
    setPesan("Draft AI diterapkan");
    setTimeout(() => setPesan(""), 2000);
  };

  const terapkanSaranAi = (bagian) => {
    if (!aiDraft) return;

    if (bagian === "headline" && aiDraft.headline) {
      setP((prev) => ({ ...prev, headline: aiDraft.headline }));
    } else if (bagian === "about" && aiDraft.about) {
      setP((prev) => ({ ...prev, about: aiDraft.about }));
    } else if (bagian === "skills" && aiDraft.skills?.length) {
      setP((prev) => ({ ...prev, skills: aiDraft.skills }));
    } else if (bagian === "experience" && aiDraft.experiences?.length) {
      setP((prev) => ({
        ...prev,
        experiences: aiDraft.experiences.map((e) => ({
          ...e,
          id: e.id || uid(),
          skills: e.skills || [],
        })),
      }));
    } else if (LI_FIELDS[bagian] && aiDraft[bagian]?.length) {
      setP((prev) => ({
        ...prev,
        [bagian]: aiDraft[bagian].map((i) => ({
          ...LI_FIELDS[bagian].kosong,
          ...i,
          id: i.id || uid(),
        })),
      }));
    } else {
      // Sampai di sini berarti ada bagian yang tombolnya tampil tapi tidak
      // punya jalur penerapan — kondisi yang seharusnya sudah dicegah
      // lewat HANYA_NASIHAT di atas.
      console.warn(`Saran untuk bagian "${bagian}" tidak bisa diterapkan.`);
      return;
    }

    setPesan("Saran diterapkan");
    setTimeout(() => setPesan(""), 1800);
  };

  const simpan = useCallback(async () => {
    if (!user || !supabaseConfigured) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ linkedin_json: p, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setSaving(false);
    setPesan(error ? "Gagal menyimpan" : "Tersimpan");
    if (!error) setDirty(false);
    setTimeout(() => setPesan(""), 2200);
  }, [user?.id, p]);

  /* Saran AI per bagian — teks bebas untuk bagian naratif,
     ringkasan terformat untuk bagian berbentuk daftar. */
  // Bagian yang sarannya berupa nasihat, bukan isi yang bisa dimasukkan
  // ke form. Keduanya menyangkut berkas gambar yang harus diunggah user
  // sendiri di LinkedIn.
  const HANYA_NASIHAT = ["cover", "photo"];

  const saranUntuk = (bagian) => {
    // Panel review tidak menampilkan tulisan AI tanpa langganan aktif
    if (!langganan.aktif) return null;
    if (!aiDraft) return null;
    if (bagian === "headline") return aiDraft.headline || null;
    if (bagian === "about") return aiDraft.about || null;
    if (bagian === "skills")
      return aiDraft.skills?.length ? aiDraft.skills.join(" · ") : null;
    if (bagian === "cover") return aiDraft.cover_saran || null;
    if (bagian === "photo") return aiDraft.photo_saran || null;

    if (bagian === "experience" && aiDraft.experiences?.length) {
      return aiDraft.experiences
        .map((e) => {
          const poin = Array.isArray(e.desc) ? e.desc : e.desc ? [e.desc] : [];
          const isi = poin
            .filter(Boolean)
            .map((d) => `• ${d}`)
            .join("\n");
          return `${e.role || "Posisi"} — ${e.company || ""}\n${isi}`;
        })
        .join("\n\n");
    }

    const def = LI_FIELDS[bagian];
    if (def && aiDraft[bagian]?.length) {
      return aiDraft[bagian]
        .map((i) => {
          const baris = [def.judul?.(i), def.sub?.(i), def.meta?.(i)]
            .filter(Boolean)
            .join(" — ");
          const poin = Array.isArray(i.desc) ? i.desc : i.desc ? [i.desc] : [];
          const isi = poin
            .filter(Boolean)
            .map((d) => `• ${d}`)
            .join("\n");
          return isi ? `${baris}\n${isi}` : baris;
        })
        .join("\n\n");
    }
    return null;
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

  return (
    <div
      style={{
        padding: layarKecil ? "16px 14px" : "24px 28px",
        background: T.bg,
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Baris atas: skor + aksi */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: layarKecil ? 12 : 16,
          // Tanpa flexWrap, teks penjelas terjepit di antara skor dan tombol
          // sampai membungkus satu kata per baris.
          flexWrap: "wrap",
          marginBottom: 18,
          background: "rgba(255,255,255,0.7)",
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: layarKecil ? "12px 14px" : "14px 18px",
          backdropFilter: "blur(14px)",
        }}
      >
        <div style={{ flexShrink: 0, textAlign: "center", minWidth: 62 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: skorWarna,
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1,
              }}
            >
              {skor}
            </span>
            <span style={{ fontSize: 11, color: T.inkFaint }}>/100</span>
          </div>
          <div style={{ fontSize: 10, color: T.inkFaint, marginTop: 3 }}>
            Kekuatan profil
          </div>
        </div>
        {!layarKecil && (
          <div
            style={{
              width: 1,
              height: 34,
              background: T.border,
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: "1 1 200px", minWidth: 0 }}>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: T.ink,
              marginBottom: 2,
            }}
          >
            Pratinjau profil LinkedIn kamu
          </div>
          <div style={{ fontSize: 11.5, color: pesan ? T.teal : T.inkSoft }}>
            {saving
              ? "Menyimpan..."
              : pesan ||
                "Klik bagian mana pun untuk melihat ukuran yang benar dan saran perbaikan."}
          </div>
        </div>
        {dirty && (
          <span style={{ fontSize: 11, color: "#B45309", flexShrink: 0 }}>
            Belum tersimpan
          </span>
        )}
        <Button
          variant="primary"
          onClick={simpan}
          disabled={saving}
          style={{
            fontSize: 12.5,
            padding: "9px 16px",
            flexShrink: 0,
            ...(layarKecil
              ? { flexBasis: "100%", justifyContent: "center" }
              : null),
          }}
        >
          {saving ? (
            <Loader2
              size={13}
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : (
            <Save size={13} />
          )}{" "}
          Simpan
        </Button>
      </div>

      {/* Pemilih draft AI. Menyetel aiDraft juga membuat panel review kanan
          ikut menampilkan saran dari versi yang dipilih. */}
      {langganan.aktif ? (
        <PilihDraftAi
          kolom="linkedin_draft"
          judul="AI sudah menyiapkan draft LinkedIn kamu"
          keterangan="Headline, Tentang, pengalaman, dan keahlian ditulis ulang agar lebih mudah ditemukan recruiter."
          onTerapkan={(draft) => {
            setAiDraft(draft);
            terapkanSemuaDariDraft(draft);
          }}
        />
      ) : (
        /* Mockup dan editor tetap terbuka — yang dikunci hanya arahan AI. */
        <GerbangFitur
          terbuka={false}
          tinggiMinimal={160}
          judul="LinkedIn Builder dengan arahan AI"
          keterangan="AI menulis ulang headline, Tentang, dan keahlian kamu agar lebih mudah ditemukan recruiter — dalam bahasa Indonesia dan Inggris."
          onLangganan={() => setActive?.("paket")}
        />
      )}

      {/* Dua kolom: mockup + inspector */}
      <div
        style={{
          display: "grid",
          // Panel review 340px tidak muat berdampingan di layar sempit,
          // jadi dipindah ke bawah mockup.
          gridTemplateColumns: layarKecil ? "1fr" : "minmax(0,1fr) 340px",
          gap: layarKecil ? 12 : 18,
          alignItems: "start",
        }}
      >
        {/* ============ KIRI: MOCKUP LINKEDIN ============ */}
        <div
          style={{
            background: LI.page,
            borderRadius: 12,
            padding: layarKecil ? 10 : 14,
            fontFamily: LI.font,
            minWidth: 0,
          }}
        >
          {/* Kartu identitas: sampul + foto + nama + headline */}
          <div
            onClick={layarKecil ? undefined : () => setDipilih("cover")}
            style={{
              background: LI.card,
              borderRadius: LI.radius,
              overflow: "hidden",
              marginBottom: 8,
              border: `1px solid ${dipilih === "cover" || dipilih === "photo" || dipilih === "headline" ? T.accent : LI.border}`,
              cursor: "pointer",
            }}
          >
            {/* Sampul */}
            <div
              style={{
                position: "relative",
                height: 134,
                background: p.coverUrl
                  ? `url(${p.coverUrl}) center/cover`
                  : "repeating-linear-gradient(45deg, #E8E6E1, #E8E6E1 12px, #E1DFDA 12px, #E1DFDA 24px)",
              }}
            >
              {!p.coverUrl && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    color: "rgba(0,0,0,0.42)",
                    fontSize: 11.5,
                  }}
                >
                  <Camera size={20} />
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10.5,
                    }}
                  >
                    1584 × 396
                  </span>
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  top: 9,
                  right: 9,
                  display: "flex",
                  gap: 6,
                }}
              >
                <PenandaReview
                  status={review.cover.status}
                  aktif={dipilih === "cover"}
                  onClick={() => setDipilih("cover")}
                  adaPanah={layarKecil}
                />
              </div>
            </div>

            {/* Foto profil + identitas */}
            <div style={{ padding: "0 20px 20px", position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginTop: -40,
                  marginBottom: 12,
                }}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!layarKecil) setDipilih("photo");
                  }}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    border: "4px solid #fff",
                    background: p.photoUrl
                      ? `url(${p.photoUrl}) center/cover`
                      : "#E1DFDA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(0,0,0,0.4)",
                    flexShrink: 0,
                    boxShadow:
                      dipilih === "photo" ? `0 0 0 3px ${T.accent}` : "none",
                  }}
                >
                  {!p.photoUrl && <Camera size={22} />}
                </div>
                <PenandaReview
                  status={review.photo.status}
                  aktif={dipilih === "photo"}
                  onClick={() => setDipilih("photo")}
                  adaPanah={layarKecil}
                />
              </div>

              {edit === "identitas" ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <input
                    value={p.nama}
                    onChange={ubah("nama")}
                    placeholder="Nama lengkap"
                    style={{ ...inputStyle, fontSize: 20, fontWeight: 600 }}
                  />
                  <textarea
                    value={p.headline}
                    onChange={ubah("headline")}
                    rows={3}
                    maxLength={260}
                    placeholder="Tax and Treasury at Pelindo Solusi Digital | Finance & Risk Management | ..."
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.5,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: p.headline.length > 220 ? "#B23A3A" : T.inkFaint,
                        fontFamily: "'IBM Plex Mono', monospace",
                      }}
                    >
                      {p.headline.length} / 220
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setEdit(null)}
                      style={{ fontSize: 11.5, padding: "6px 12px" }}
                    >
                      <Check size={12} /> Selesai
                    </Button>
                  </div>
                  <input
                    value={p.lokasi}
                    onChange={ubah("lokasi")}
                    placeholder="Tangerang, Banten, Indonesia"
                    style={inputStyle}
                  />
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!layarKecil) setDipilih("headline");
                    setEdit("identitas");
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: LI.text,
                      lineHeight: 1.25,
                      marginBottom: 3,
                    }}
                  >
                    {p.nama || (
                      <span style={{ color: "rgba(0,0,0,0.3)" }}>
                        Nama lengkap
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: LI.text,
                      lineHeight: 1.45,
                      marginBottom: 5,
                    }}
                  >
                    {p.headline || (
                      <span style={{ color: "rgba(0,0,0,0.3)" }}>
                        Headline kamu muncul di sini — 220 karakter
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: LI.textSoft }}>
                    {p.lokasi || "Kota, Provinsi, Negara"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 12,
                    }}
                  >
                    <PenandaReview
                      status={review.headline.status}
                      aktif={dipilih === "headline"}
                      onClick={() => setDipilih("headline")}
                      adaPanah={layarKecil}
                    />
                    <span
                      style={{
                        fontSize: 11.5,
                        color: LI.textSoft,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Pencil size={10} /> Klik untuk mengubah
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tentang */}
          <KartuLI
            id="about"
            judul={"Tentang"}
            review={review.about}
            dipilih={dipilih}
            onPilih={setDipilih}
            layarKecil={layarKecil}
          >
            {edit === "about" ? (
              <div onClick={(e) => e.stopPropagation()}>
                <textarea
                  value={p.about}
                  onChange={ubah("about")}
                  rows={11}
                  placeholder={
                    "Saya lulusan Manajemen dengan pengalaman di bidang keuangan, pajak, dan treasury...\n\nSelama bekerja, saya...\n\nSaat ini saya terbuka untuk..."
                  }
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.65,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: p.about.length > 2600 ? "#B23A3A" : T.inkFaint,
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    {p.about.length} / 2.600
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setEdit(null)}
                    style={{ fontSize: 11.5, padding: "6px 12px" }}
                  >
                    <Check size={12} /> Selesai
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (!layarKecil) setDipilih("about");
                  setEdit("about");
                }}
              >
                {p.about ? (
                  <>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: LI.text,
                        lineHeight: 1.65,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {p.about.slice(0, 270)}
                      {p.about.length > 270 && (
                        <span style={{ color: LI.textSoft }}>
                          …{" "}
                          <span style={{ fontWeight: 600 }}>
                            lihat selengkapnya
                          </span>
                        </span>
                      )}
                    </div>
                    {p.about.length > 270 && (
                      <div
                        style={{
                          marginTop: 10,
                          paddingTop: 9,
                          borderTop: `1px dashed ${LI.border}`,
                          fontSize: 11,
                          color: LI.textSoft,
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        Garis ini menandai batas 270 karakter yang terlihat
                        tanpa klik
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      fontSize: 13.5,
                      color: "rgba(0,0,0,0.3)",
                      lineHeight: 1.65,
                    }}
                  >
                    Belum ada tulisan. Klik untuk mulai menulis — tersedia 2.600
                    karakter.
                  </div>
                )}
              </div>
            )}
          </KartuLI>

          {/* Pengalaman */}
          <KartuLI
            id="experience"
            judul={"Pengalaman"}
            review={review.experience}
            dipilih={dipilih}
            onPilih={setDipilih}
            layarKecil={layarKecil}
          >
            {p.experiences.map((e, idx) => (
              <div
                key={e.id}
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (!layarKecil) setDipilih("experience");
                  setEdit(edit === e.id ? null : e.id);
                }}
                style={{
                  display: "flex",
                  gap: 12,
                  paddingBottom: 14,
                  marginBottom: 14,
                  borderBottom:
                    idx < p.experiences.length - 1
                      ? `1px solid ${LI.border}`
                      : "none",
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
                  {(e.company || "?").charAt(0).toUpperCase()}
                </div>

                {edit === e.id ? (
                  <div
                    onClick={(ev) => ev.stopPropagation()}
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
                        gridTemplateColumns: "1fr 1fr",
                        gap: 7,
                      }}
                    >
                      <input
                        value={e.role}
                        onChange={(ev) =>
                          expUbah(e.id, { ...e, role: ev.target.value })
                        }
                        placeholder="Posisi"
                        style={inputStyle}
                      />
                      <input
                        value={e.company}
                        onChange={(ev) =>
                          expUbah(e.id, { ...e, company: ev.target.value })
                        }
                        placeholder="Perusahaan"
                        style={inputStyle}
                      />
                      <input
                        value={e.start}
                        onChange={(ev) =>
                          expUbah(e.id, { ...e, start: ev.target.value })
                        }
                        placeholder="Okt 2024"
                        style={inputStyle}
                      />
                      <input
                        value={e.end}
                        onChange={(ev) =>
                          expUbah(e.id, { ...e, end: ev.target.value })
                        }
                        placeholder="Sekarang"
                        style={inputStyle}
                      />
                    </div>
                    <input
                      value={e.lokasi}
                      onChange={(ev) =>
                        expUbah(e.id, { ...e, lokasi: ev.target.value })
                      }
                      placeholder="Jakarta Utara, Indonesia · On-site"
                      style={inputStyle}
                    />
                    <EditorPoin
                      label="Deskripsi"
                      items={e.desc}
                      onChange={(poin) => expUbah(e.id, { ...e, desc: poin })}
                      placeholder="Menyusun laporan kinerja keuangan menggunakan 5 indikator utama"
                    />
                    <input
                      value={(e.skills || []).join(", ")}
                      onChange={(ev) =>
                        expUbah(e.id, {
                          ...e,
                          skills: ev.target.value
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Skill di posisi ini, pisahkan koma (maks 5)"
                      style={inputStyle}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => expHapus(e.id)}
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
                        <Trash2 size={11} /> Hapus posisi
                      </button>
                      <Button
                        variant="outline"
                        onClick={() => setEdit(null)}
                        style={{ fontSize: 11.5, padding: "6px 12px" }}
                      >
                        <Check size={12} /> Selesai
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: LI.text,
                      }}
                    >
                      {e.role || (
                        <span style={{ color: "rgba(0,0,0,0.3)" }}>Posisi</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: LI.text }}>
                      {e.company || "Perusahaan"}
                      {e.jenis ? ` · ${e.jenis}` : ""}
                    </div>
                    <div style={{ fontSize: 12.5, color: LI.textSoft }}>
                      {[e.start, e.end].filter(Boolean).join(" - ") ||
                        "Periode"}
                    </div>
                    {e.lokasi && (
                      <div style={{ fontSize: 12.5, color: LI.textSoft }}>
                        {e.lokasi}
                      </div>
                    )}
                    {(() => {
                      const poin = Array.isArray(e.desc)
                        ? e.desc
                        : e.desc
                          ? [e.desc]
                          : [];
                      if (poin.length === 0) return null;
                      return (
                        <div style={{ marginTop: 7 }}>
                          {poin.filter(Boolean).map((d, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                gap: 7,
                                marginBottom: 3,
                              }}
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
                    {e.skills?.length > 0 ? (
                      <div
                        style={{
                          fontSize: 12.5,
                          color: LI.text,
                          marginTop: 8,
                          fontWeight: 600,
                        }}
                      >
                        ◈ {e.skills.join(", ")}
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#B45309",
                          marginTop: 8,
                        }}
                      >
                        Belum ada skill di posisi ini
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                expTambah();
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
              <Plus size={13} /> Tambah posisi
            </button>
          </KartuLI>

          {/* Pendidikan, sertifikasi, sukarela — di antara Pengalaman dan Keahlian */}
          {SECTION_BERULANG.map((sec) => (
            <KartuLI
              key={sec.id}
              id={sec.id}
              judul={sec.judul}
              review={review[sec.id]}
              dipilih={dipilih}
              onPilih={setDipilih}
              layarKecil={layarKecil}
            >
              <SectionBerulang
                items={p[sec.id]}
                def={LI_FIELDS[sec.id]}
                editId={edit}
                setEditId={(v) => {
                  if (!layarKecil) setDipilih(sec.id);
                  setEdit(v);
                }}
                onUbah={daftarUbah(sec.id)}
                onTambah={daftarTambah(sec.id)}
                onHapus={daftarHapus(sec.id)}
                labelTambah={sec.tambah}
              />
            </KartuLI>
          ))}

          {/* Keahlian */}
          <KartuLI
            id="skills"
            judul={`Keahlian`}
            review={review.skills}
            dipilih={dipilih}
            onPilih={setDipilih}
            layarKecil={layarKecil}
          >
            {p.skills.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {p.skills.slice(0, 3).map((sk, i) => (
                  <div
                    key={sk}
                    style={{
                      padding: "10px 0",
                      borderBottom: i < 2 ? `1px solid ${LI.border}` : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{ fontSize: 14, fontWeight: 600, color: LI.text }}
                    >
                      {sk}
                    </span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontSize: 10.5,
                          color: LI.blue,
                          fontWeight: 600,
                        }}
                      >
                        3 teratas
                      </span>
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setP((prev) => ({
                            ...prev,
                            skills: prev.skills.filter((s) => s !== sk),
                          }));
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "rgba(0,0,0,0.35)",
                          padding: 0,
                          display: "flex",
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {p.skills.length > 3 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 12,
                    }}
                  >
                    {p.skills.slice(3).map((sk) => (
                      <span
                        key={sk}
                        style={{
                          fontSize: 12.5,
                          background: "rgba(0,0,0,0.05)",
                          color: LI.text,
                          padding: "5px 8px 5px 12px",
                          borderRadius: 99,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {sk}
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setP((prev) => ({
                              ...prev,
                              skills: prev.skills.filter((s) => s !== sk),
                            }));
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "rgba(0,0,0,0.35)",
                            padding: 0,
                            display: "flex",
                          }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ display: "flex", gap: 7 }}
            >
              <input
                value={skillBaru}
                onChange={(e) => setSkillBaru(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && tambahSkill()}
                placeholder="Tambah keahlian, lalu Enter"
                style={inputStyle}
              />
              <Button
                variant="outline"
                onClick={tambahSkill}
                style={{ fontSize: 12, padding: "7px 12px", flexShrink: 0 }}
              >
                <Plus size={12} />
              </Button>
            </div>
          </KartuLI>

          {/* Publikasi, penghargaan, bahasa, organisasi */}
          {SECTION_BERULANG_BAWAH.map((sec) => (
            <KartuLI
              key={sec.id}
              id={sec.id}
              judul={sec.judul}
              review={review[sec.id]}
              dipilih={dipilih}
              onPilih={setDipilih}
              layarKecil={layarKecil}
            >
              <SectionBerulang
                items={p[sec.id]}
                def={LI_FIELDS[sec.id]}
                editId={edit}
                setEditId={(v) => {
                  if (!layarKecil) setDipilih(sec.id);
                  setEdit(v);
                }}
                onUbah={daftarUbah(sec.id)}
                onTambah={daftarTambah(sec.id)}
                onHapus={daftarHapus(sec.id)}
                labelTambah={sec.tambah}
              />
            </KartuLI>
          ))}
        </div>

        {/* ============ KANAN: PANEL REVIEW ============ */}
        {/* Di layar lebar panel menempel di samping. Di layar sempit
            panel ini tidak dirender di sini — digantikan laci geser
            di bawah, supaya user tidak perlu menggulir jauh ke bawah
            hanya untuk membaca ulasan bagian yang baru saja diklik. */}
        {!layarKecil && (
          <div
            style={{
              position: "sticky",
              top: 20,
              background: "rgba(255,255,255,0.72)",
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              backdropFilter: "blur(16px)",
              maxHeight: "calc(100vh - 140px)",
              overflowY: "auto",
            }}
          >
            <PanelReview
              bagian={dipilih}
              review={review[dipilih]}
              spec={LI_SPECS[dipilih]}
              saranAi={saranUntuk(dipilih)}
              bisaDiterapkan={!HANYA_NASIHAT.includes(dipilih)}
              onTerapkanSaran={() => terapkanSaranAi(dipilih)}
            />
          </div>
        )}
      </div>

      {/* ============ LACI REVIEW (layar sempit) ============ */}
      {layarKecil && (
        <>
          {/* Latar gelap, klik untuk menutup */}
          <div
            onClick={() => setDipilih(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
              background: "rgba(0,0,0,0.35)",
              opacity: dipilih ? 1 : 0,
              pointerEvents: dipilih ? "auto" : "none",
              transition: "opacity .2s",
            }}
          />

          <div
            role="dialog"
            aria-label="Ulasan bagian profil"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 61,
              width: "min(420px, 88vw)",
              background: "#fff",
              boxShadow: "-8px 0 32px rgba(0,0,0,0.18)",
              // Laci selalu ada di DOM dan hanya digeser, supaya
              // animasinya mulus dan isinya tidak dirender ulang.
              transform: dipilih ? "translateX(0)" : "translateX(100%)",
              transition: "transform .25s cubic-bezier(.4,0,.2,1)",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <PanelReview
              bagian={dipilih}
              review={review[dipilih]}
              spec={LI_SPECS[dipilih]}
              saranAi={saranUntuk(dipilih)}
              bisaDiterapkan={!HANYA_NASIHAT.includes(dipilih)}
              onTerapkanSaran={() => terapkanSaranAi(dipilih)}
              onTutup={() => setDipilih(null)}
            />
          </div>
        </>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
