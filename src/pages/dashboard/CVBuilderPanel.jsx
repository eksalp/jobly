import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { jsPDF } from "jspdf";
import {
  Plus,
  Download,
  Trash2,
  Loader2,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  GraduationCap,
  Star,
  Users,
  Award,
  BadgeCheck,
  HeartHandshake,
  Save,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { T } from "../../theme";
import { useUserProfile } from "../../context/UserProfileContext";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { useAuth } from "../../context/AuthContext";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { Glass } from "../../components/ui/Glass";
import { PilihDraftAi } from "../../components/PilihDraftAi";
import { GerbangFitur } from "../../components/GerbangFitur";
import { useLangganan } from "../../hooks/useLangganan";
import { Button } from "../../components/ui/Button";

/* ------------------------------------------------------------------ */
/*  HELPERS                                                             */
/* ------------------------------------------------------------------ */
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ------------------------------------------------------------------ */
/*  LANGUAGE CONTEXT — dipakai Tooltip supaya ikut bahasa CV            */
/* ------------------------------------------------------------------ */
const LangContext = React.createContext("ID");

/* ------------------------------------------------------------------ */
/*  LABEL TRANSLATIONS                                                  */
/* ------------------------------------------------------------------ */
const LABELS = {
  ID: {
    summary: "Ringkasan Profil",
    experience: "Pengalaman Kerja",
    organization: "Pengalaman Organisasi",
    volunteer: "Pengalaman Volunteer",
    education: "Pendidikan",
    awards: "Penghargaan & Prestasi",
    certifications: "Sertifikasi & Lisensi",
    skills: "Keahlian",
    // editor section cards
    personal: "Informasi Pribadi",
    summaryCard: "Ringkasan Profil",
    lblFullName: "Nama Lengkap",
    lblHeadline: "Headline / Posisi",
    lblEmail: "Email",
    lblPhone: "No. HP",
    lblLocation: "Lokasi",
    lblLinkedin: "LinkedIn (opsional)",
    lblSummary: "Ringkasan Profil",
    deleteLabel: "Hapus",
    // field labels
    role: "Posisi / Jabatan",
    company: "Perusahaan",
    start: "Mulai",
    end: "Selesai",
    desc: "Deskripsi singkat (opsional)",
    orgRole: "Jabatan di Organisasi",
    orgName: "Nama Organisasi",
    volRole: "Peran di Kegiatan",
    volOrg: "Nama Organisasi / Kegiatan",
    school: "Institusi",
    degree: "Jurusan / Gelar",
    awardTitle: "Nama Penghargaan / Prestasi",
    awardYear: "Tahun",
    awardIssuer: "Pemberi / Penyelenggara (opsional)",
    certName: "Nama Sertifikasi",
    certIssuer: "Penerbit",
    certYear: "Tahun / Periode",
    certLicense: "Nomor Lisensi (opsional)",
    certUrl: "URL Sertifikat (opsional)",
    addExp: "Tambah Pengalaman",
    addOrg: "Tambah Organisasi",
    addVolunteer: "Tambah Volunteer",
    addEdu: "Tambah Pendidikan",
    addAward: "Tambah Penghargaan",
    addCert: "Tambah Sertifikasi",
    // placeholders
    phRole: "Staff Finance & Tax",
    phCompany: "PT Pelindo Solusi Digital",
    phStart: "Jan 2023",
    phEnd: "Sekarang",
    phDesc: "Tanggung jawab dan pencapaian utama...",
    phOrgRole: "Ketua Divisi Keuangan",
    phOrgName: "BEM Fakultas Ekonomi",
    phOrgDesc: "Kontribusi dan program yang dijalankan...",
    phVolRole: "Volunteer Pengajar",
    phVolOrg: "Yayasan Cinta Anak Bangsa",
    phVolDesc: "Kegiatan volunteer dan dampak yang dihasilkan...",
    phSchool: "Universitas Indonesia",
    phDegree: "S1 Akuntansi",
    phEduDesc: "Kegiatan, pencapaian, atau mata kuliah relevan...",
    phAwardTitle: "Juara 1 Olimpiade Akuntansi",
    phAwardYear: "2020",
    phAwardIssuer: "Ikatan Akuntan Indonesia",
    phCertName: "Brevet A & B Terpadu",
    phCertIssuer: "IAI, Coursera, Google, dst.",
    phCertYear: "2022",
    phCertLicense: "UC-XXXXXXXXXX",
    phSummary:
      "Deskripsikan dirimu secara singkat — pengalaman, keahlian utama, dan tujuan karier...",
    skillPlaceholder: "Tambah skill, lalu Enter...",
    previewLabel: "Preview CV",
    pdfSubtitle: "Hasil PDF ukuran A4 penuh",
    downloadBtn: "Unduh PDF",
    generatingBtn: "Membuat PDF...",
    stillHere: "Masih berlangsung",
  },
  EN: {
    summary: "Professional Summary",
    experience: "Work Experience",
    organization: "Organizational Experience",
    volunteer: "Volunteer Experience",
    education: "Education",
    awards: "Honors & Awards",
    certifications: "Certifications & Licenses",
    skills: "Skills",
    personal: "Personal Information",
    summaryCard: "Professional Summary",
    lblFullName: "Full Name",
    lblHeadline: "Headline / Title",
    lblEmail: "Email",
    lblPhone: "Phone",
    lblLocation: "Location",
    lblLinkedin: "LinkedIn (optional)",
    lblSummary: "Professional Summary",
    deleteLabel: "Delete",
    role: "Position / Title",
    company: "Company",
    start: "Start",
    end: "End",
    desc: "Brief description (optional)",
    orgRole: "Role in Organization",
    orgName: "Organization Name",
    volRole: "Role in Activity",
    volOrg: "Organization / Activity Name",
    school: "Institution",
    degree: "Degree / Major",
    awardTitle: "Award / Achievement",
    awardYear: "Year",
    awardIssuer: "Issuer / Organizer (optional)",
    certName: "Certification Name",
    certIssuer: "Issuing Organization",
    certYear: "Year / Period",
    certLicense: "License Number (optional)",
    certUrl: "Certificate URL (optional)",
    addExp: "Add Experience",
    addOrg: "Add Organization",
    addVolunteer: "Add Volunteer Experience",
    addEdu: "Add Education",
    addAward: "Add Award",
    addCert: "Add Certification",
    phRole: "Tax & Finance Staff",
    phCompany: "PT Pelindo Solusi Digital",
    phStart: "Jan 2023",
    phEnd: "Present",
    phDesc: "Key responsibilities and achievements...",
    phOrgRole: "Head of Finance Division",
    phOrgName: "Student Executive Board",
    phOrgDesc: "Contributions and programs led...",
    phVolRole: "Teaching Volunteer",
    phVolOrg: "Cinta Anak Bangsa Foundation",
    phVolDesc: "Volunteer activities and impact created...",
    phSchool: "Universitas Indonesia",
    phDegree: "B.Sc. Accounting",
    phEduDesc: "Relevant activities, achievements, or coursework...",
    phAwardTitle: "1st Place Accounting Olympiad",
    phAwardYear: "2020",
    phAwardIssuer: "Indonesian Institute of Accountants",
    phCertName: "Brevet A & B",
    phCertIssuer: "IAI, Coursera, Google, etc.",
    phCertYear: "2022",
    phCertLicense: "UC-XXXXXXXXXX",
    phSummary:
      "Briefly describe yourself — your experience, key skills, and career goals...",
    skillPlaceholder: "Add a skill, then press Enter...",
    previewLabel: "CV Preview",
    pdfSubtitle: "PDF output is full A4 size",
    downloadBtn: "Download PDF",
    generatingBtn: "Generating PDF...",
    stillHere: "Currently ongoing",
  },
};

/* ------------------------------------------------------------------ */
/*  TOOLTIP — ikon ? dengan tips ATS saat hover (bilingual)             */
/* ------------------------------------------------------------------ */
const ATS_TIPS = {
  ID: {
    fullName: {
      title: "Nama Lengkap",
      tips: [
        "Gunakan nama resmi sesuai KTP / identitas profesional.",
        "Hindari nama panggilan atau singkatan (mis. 'Eki' → 'Eksal Pujianto').",
        "ATS membaca nama untuk mencocokkan profil LinkedIn & referensi.",
      ],
    },
    headline: {
      title: "Headline / Posisi",
      tips: [
        "Tulis jabatan yang spesifik dan relevan dengan posisi yang dilamar.",
        "Contoh bagus: 'Tax & Treasury Staff | ICOFR | BUMN'.",
        "Hindari kata generik seperti 'Fresh Graduate' atau 'Jobseeker'.",
        "Masukkan kata kunci industri — ATS sering mencocokkan headline dengan deskripsi job.",
      ],
    },
    email: {
      title: "Email",
      tips: [
        "Gunakan email profesional: nama.lengkap@gmail.com atau nama@domain.com.",
        "Hindari email tidak profesional seperti 'gamer123@' atau 'kucinglucu@'.",
        "ATS mengekstrak email secara otomatis untuk kontak rekruiter.",
      ],
    },
    phone: {
      title: "Nomor HP",
      tips: [
        "Format internasional lebih aman: +62 812-xxxx-xxxx.",
        "Pastikan nomor aktif dan bisa dihubungi.",
      ],
    },
    location: {
      title: "Lokasi",
      tips: [
        "Tulis kota dan negara: 'Jakarta, Indonesia'.",
        "Untuk posisi remote, tambahkan '(Open to Remote)'.",
        "ATS kadang memfilter kandidat berdasarkan lokasi — sesuaikan dengan kota job listing.",
      ],
    },
    linkedin: {
      title: "LinkedIn",
      tips: [
        "Pakai URL custom: linkedin.com/in/namakamu (atur di profil LinkedIn).",
        "Pastikan profil LinkedIn up-to-date dan konsisten dengan CV.",
        "Banyak rekruiter langsung cek LinkedIn setelah baca CV.",
      ],
    },
    summary: {
      title: "Ringkasan Profil",
      tips: [
        "Tulis 3–5 kalimat yang merangkum pengalaman, keahlian inti, dan tujuan karier.",
        "Masukkan kata kunci dari job description target di bagian ini.",
        "Contoh: 'Staff Keuangan dengan 4 tahun pengalaman di ICOFR, perpajakan, dan audit internal di lingkungan BUMN.'",
        "Hindari kalimat klise: 'Saya adalah pribadi yang kerja keras dan berdedikasi'.",
        "ATS memberi bobot tinggi pada ringkasan karena dibaca pertama.",
      ],
    },
    role: {
      title: "Posisi / Jabatan",
      tips: [
        "Gunakan judul jabatan yang umum di industri, bukan judul internal perusahaan.",
        "Contoh: 'Staff Finance & Tax' lebih baik dari 'Officer Grade III Divisi Perpajakan'.",
        "Cocokkan dengan judul posisi yang sedang kamu lamar jika relevan.",
      ],
    },
    company: {
      title: "Perusahaan",
      tips: [
        "Tulis nama resmi perusahaan (PT/CV/Tbk) — ATS bisa mengenali perusahaan ternama.",
        "Tambahkan industri jika perusahaan kurang dikenal: 'Startup Fintech' atau 'BUMN Logistik'.",
      ],
    },
    desc: {
      title: "Deskripsi",
      tips: [
        "Gunakan format bullet point (satu kalimat per baris) di deskripsi.",
        "Mulai setiap poin dengan kata kerja aktif: Mengelola, Menganalisis, Menyusun, Memimpin.",
        "Sertakan angka/persentase jika ada: 'Menyusun laporan pajak untuk 12 entitas anak perusahaan'.",
        "Hindari kalimat pasif: 'Bertanggung jawab atas...' → ganti dengan 'Mengelola...'.",
        "ATS mencari kata kunci teknis di bagian ini — masukkan tools/software yang dipakai.",
      ],
    },
    school: {
      title: "Institusi Pendidikan",
      tips: [
        "Tulis nama lengkap universitas/sekolah — ATS mengenali nama resmi.",
        "Contoh: 'Universitas Airlangga' bukan 'UNAIR'.",
      ],
    },
    degree: {
      title: "Jurusan / Gelar",
      tips: [
        "Format standar: 'S1 Akuntansi' atau 'Bachelor of Economics, Accounting'.",
        "Sebutkan gelar akademis: S.E., S.Ak., S.T. — berguna untuk filter ATS yang mensyaratkan S1.",
      ],
    },
    certName: {
      title: "Nama Sertifikasi",
      tips: [
        "Tulis nama lengkap sertifikasi, bukan singkatan saja.",
        "Contoh: 'Brevet Pajak A & B' bukan hanya 'Brevet'.",
        "Sertifikasi dari lembaga ternama (Google, Coursera, IAI) diberi bobot lebih tinggi oleh ATS.",
      ],
    },
    skills: {
      title: "Keahlian",
      tips: [
        "Pisahkan hard skill dan soft skill — ATS lebih mengenali hard skill teknis.",
        "Gunakan nama tools/software yang spesifik: 'Microsoft Excel (Advanced)', 'SAP FI', 'MYOB'.",
        "Cocokkan skill dengan kata kunci di job description yang kamu lamar.",
        "Hindari skill terlalu generik: 'Komunikasi', 'Kerja Tim' — tambahkan konteks.",
        "Urutan penting: letakkan skill yang paling relevan dengan posisi di depan.",
      ],
    },
  },
  EN: {
    fullName: {
      title: "Full Name",
      tips: [
        "Use your official/legal name, not a nickname.",
        "Avoid abbreviations (e.g. 'Eki' → 'Eksal Pujianto').",
        "ATS uses the name to match your LinkedIn profile and references.",
      ],
    },
    headline: {
      title: "Headline / Title",
      tips: [
        "Write a specific title relevant to the position you're applying for.",
        "Good example: 'Tax & Treasury Staff | ICOFR | State-Owned Enterprise'.",
        "Avoid generic terms like 'Fresh Graduate' or 'Jobseeker'.",
        "Include industry keywords — ATS often matches the headline against the job description.",
      ],
    },
    email: {
      title: "Email",
      tips: [
        "Use a professional email: firstname.lastname@gmail.com or name@domain.com.",
        "Avoid unprofessional addresses like 'gamer123@' or 'catlover@'.",
        "ATS automatically extracts your email for recruiter contact.",
      ],
    },
    phone: {
      title: "Phone Number",
      tips: [
        "International format is safer: +62 812-xxxx-xxxx.",
        "Make sure the number is active and reachable.",
      ],
    },
    location: {
      title: "Location",
      tips: [
        "Write your city and country: 'Jakarta, Indonesia'.",
        "For remote roles, add '(Open to Remote)'.",
        "ATS sometimes filters candidates by location — match it to the job listing's city.",
      ],
    },
    linkedin: {
      title: "LinkedIn",
      tips: [
        "Use a custom URL: linkedin.com/in/yourname (set this in your LinkedIn profile).",
        "Keep your LinkedIn profile up to date and consistent with your CV.",
        "Many recruiters check LinkedIn right after reading your CV.",
      ],
    },
    summary: {
      title: "Professional Summary",
      tips: [
        "Write 3–5 sentences summarizing your experience, core skills, and career goals.",
        "Include keywords from your target job description here.",
        "Example: 'Finance Staff with 4 years of experience in ICOFR, tax, and internal audit at a state-owned enterprise.'",
        "Avoid clichés like: 'I am a hardworking and dedicated person'.",
        "ATS gives this section high weight since it's read first.",
      ],
    },
    role: {
      title: "Position / Title",
      tips: [
        "Use an industry-standard job title, not an internal company title.",
        "Example: 'Finance & Tax Staff' is better than 'Officer Grade III, Tax Division'.",
        "Match it to the title of the position you're applying for when relevant.",
      ],
    },
    company: {
      title: "Company",
      tips: [
        "Write the company's official name (Inc./Ltd./Corp.) — ATS can recognize well-known companies.",
        "Add the industry if the company isn't well known: 'Fintech Startup' or 'State Logistics Company'.",
      ],
    },
    desc: {
      title: "Description",
      tips: [
        "Use bullet points (one sentence per line) for the description.",
        "Start each point with an active verb: Managed, Analyzed, Prepared, Led.",
        "Include numbers/percentages where possible: 'Prepared tax reports for 12 subsidiary entities'.",
        "Avoid passive phrasing: 'Responsible for...' → use 'Managed...' instead.",
        "ATS searches for technical keywords here — mention the tools/software you used.",
      ],
    },
    school: {
      title: "Educational Institution",
      tips: [
        "Write the full university/school name — ATS recognizes official names.",
        "Example: 'Universitas Airlangga' instead of 'UNAIR'.",
      ],
    },
    degree: {
      title: "Degree / Major",
      tips: [
        "Standard format: 'B.Sc. Accounting' or 'Bachelor of Economics, Accounting'.",
        "Include your academic title if relevant — useful for ATS filters requiring a bachelor's degree.",
      ],
    },
    certName: {
      title: "Certification Name",
      tips: [
        "Write the full certification name, not just an abbreviation.",
        "Example: 'Tax Brevet A & B' instead of just 'Brevet'.",
        "Certifications from well-known providers (Google, Coursera, professional bodies) carry more weight with ATS.",
      ],
    },
    skills: {
      title: "Skills",
      tips: [
        "Separate hard skills and soft skills — ATS recognizes technical hard skills better.",
        "Use specific tool/software names: 'Microsoft Excel (Advanced)', 'SAP FI', 'MYOB'.",
        "Match your skills to keywords in the job description you're applying for.",
        "Avoid overly generic skills like 'Communication' or 'Teamwork' — add context.",
        "Order matters: put the most relevant skills for the position first.",
      ],
    },
  },
};

function Tooltip({ tipKey }) {
  const [show, setShow] = React.useState(false);
  const [align, setAlign] = React.useState("center"); // "left" | "center" | "right"
  const iconRef = React.useRef(null);
  const lang = React.useContext(LangContext);
  const tip = ATS_TIPS[lang]?.[tipKey];
  if (!tip) return null;

  const handleEnter = () => {
    // Deteksi posisi ikon relatif terhadap viewport, lalu putuskan arah bubble
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const tooltipW = 288;
      // Kalau sisa ruang kiri kurang dari setengah lebar tooltip → geser ke kanan
      if (rect.left < tooltipW / 2) setAlign("left");
      // Kalau sisa ruang kanan kurang → geser ke kiri
      else if (vw - rect.right < tooltipW / 2) setAlign("right");
      else setAlign("center");
    }
    setShow(true);
  };

  // Posisi arrow ikut align
  const arrowPos = {
    left: { left: 10 },
    center: { left: "50%", transform: "translateX(-50%)" },
    right: { right: 10 },
  }[align];

  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        marginLeft: 6,
      }}
    >
      <span
        ref={iconRef}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setShow(false)}
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: T.accentSoft,
          color: T.accent,
          fontSize: 10,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "help",
          flexShrink: 0,
          border: `1px solid ${T.accent}`,
          lineHeight: 1,
        }}
      >
        ?
      </span>
      {show &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              bottom: iconRef.current
                ? window.innerHeight -
                  iconRef.current.getBoundingClientRect().top +
                  8
                : "auto",
              left: iconRef.current
                ? align === "right"
                  ? "auto"
                  : align === "center"
                    ? iconRef.current.getBoundingClientRect().left +
                      iconRef.current.offsetWidth / 2
                    : iconRef.current.getBoundingClientRect().left
                : "auto",
              right:
                align === "right" && iconRef.current
                  ? window.innerWidth -
                    iconRef.current.getBoundingClientRect().right
                  : "auto",
              transform: align === "center" ? "translateX(-50%)" : "none",
              width: 288,
              background: T.ink,
              color: "#fff",
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 11.5,
              lineHeight: 1.55,
              zIndex: 9999,
              pointerEvents: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 12,
                marginBottom: 7,
                color: "#fff",
              }}
            >
              💡 Tips ATS: {tip.title}
            </div>
            {tip.tips.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 7,
                  marginBottom: i < tip.tips.length - 1 ? 5 : 0,
                }}
              >
                <span style={{ color: "#7DD3FC", flexShrink: 0, marginTop: 1 }}>
                  •
                </span>
                <span style={{ color: "#E2E8F0" }}>{t}</span>
              </div>
            ))}
            {/* Arrow */}
            <div
              style={{
                position: "absolute",
                bottom: -6,
                ...arrowPos,
                width: 12,
                height: 12,
                background: T.ink,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          </div>,
          document.body,
        )}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 3,
  tipKey,
}) {
  const base = {
    width: "100%",
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 13,
    fontFamily: "'Poppins', sans-serif",
    background: "rgba(255,255,255,0.65)",
    outline: "none",
    color: T.ink,
    resize: multiline ? "vertical" : "none",
    boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: T.inkSoft,
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          {label}
          {tipKey && <Tooltip tipKey={tipKey} />}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          style={base}
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={base}
        />
      )}
    </div>
  );
}

function BulletListField({ label, items, onChange, placeholder, tipKey }) {
  const [draft, setDraft] = useState("");
  const bullets = Array.isArray(items) ? items : items ? [items] : [];

  const addBullet = () => {
    const clean = draft.trim();
    if (!clean) return;
    onChange([...bullets, clean]);
    setDraft("");
  };

  const removeBullet = (idx) => onChange(bullets.filter((_, i) => i !== idx));
  const updateBullet = (idx, value) =>
    onChange(bullets.map((it, i) => (i === idx ? value : it)));

  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: T.inkSoft,
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          {label}
          {tipKey && <Tooltip tipKey={tipKey} />}
        </label>
      )}

      {bullets.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {bullets.map((it, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: T.inkFaint,
                  marginTop: 9,
                  flexShrink: 0,
                }}
              >
                {idx + 1}.
              </span>
              <input
                value={it}
                onChange={(e) => updateBullet(idx, e.target.value)}
                style={{
                  flex: 1,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "8px 10px",
                  fontSize: 12.5,
                  fontFamily: "'Poppins', sans-serif",
                  background: "rgba(255,255,255,0.65)",
                  outline: "none",
                  color: T.ink,
                }}
              />
              <button
                onClick={() => removeBullet(idx)}
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
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addBullet();
            }
          }}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: "9px 12px",
            fontSize: 13,
            fontFamily: "'Poppins', sans-serif",
            background: "rgba(255,255,255,0.65)",
            outline: "none",
            color: T.ink,
          }}
        />
        <Button
          variant="outline"
          style={{ fontSize: 12, padding: "7px 12px" }}
          onClick={addBullet}
        >
          <Plus size={12} />
        </Button>
      </div>
    </div>
  );
}

function CheckField({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11.5,
        color: T.inkSoft,
        cursor: "pointer",
        marginTop: -6,
        marginBottom: 12,
        userSelect: "none",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ width: 13, height: 13, cursor: "pointer" }}
      />
      {label}
    </label>
  );
}

function DeleteBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
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
        marginTop: 2,
      }}
    >
      <Trash2 size={11} /> Hapus
    </button>
  );
}

function ItemWrap({ children }) {
  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        background: "rgba(255,255,255,0.45)",
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SECTION CARD — collapsible                                          */
/* ------------------------------------------------------------------ */
function SectionCard({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Glass style={{ marginBottom: 10, minWidth: 0, overflow: "hidden" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "13px 16px",
          cursor: "pointer",
          borderBottom: open ? `1px solid ${T.border}` : "none",
        }}
      >
        <Icon size={14} color={T.accent} />
        <span style={{ flex: 1, fontWeight: 600, fontSize: 13, color: T.ink }}>
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} color={T.inkFaint} />
        ) : (
          <ChevronDown size={14} color={T.inkFaint} />
        )}
      </div>
      {open && <div style={{ padding: "14px 16px" }}>{children}</div>}
    </Glass>
  );
}

/* ------------------------------------------------------------------ */
/*  ITEM COMPONENTS                                                     */
/* ------------------------------------------------------------------ */
function ExpItem({ item, onChange, onDelete, L }) {
  return (
    <ItemWrap>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 8,
        }}
      >
        <Field
          label={L.role}
          tipKey="role"
          value={item.role}
          onChange={(e) => onChange({ ...item, role: e.target.value })}
          placeholder={L.phRole}
        />
        <Field
          label={L.company}
          tipKey="company"
          value={item.company}
          onChange={(e) => onChange({ ...item, company: e.target.value })}
          placeholder={L.phCompany}
        />
        <Field
          label={L.start}
          value={item.start}
          onChange={(e) => onChange({ ...item, start: e.target.value })}
          placeholder={L.phStart}
        />
        <Field
          label={L.end}
          value={item.end}
          onChange={(e) => onChange({ ...item, end: e.target.value })}
          placeholder={L.phEnd}
        />
      </div>
      <CheckField
        label={L.stillHere}
        checked={item.end === L.phEnd}
        onChange={(e) =>
          onChange({ ...item, end: e.target.checked ? L.phEnd : "" })
        }
      />
      <BulletListField
        label={L.desc}
        tipKey="desc"
        items={item.desc}
        onChange={(bullets) => onChange({ ...item, desc: bullets })}
        placeholder={L.phDesc}
      />
      <DeleteBtn onClick={onDelete} />
    </ItemWrap>
  );
}

function OrgItem({ item, onChange, onDelete, L }) {
  return (
    <ItemWrap>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 8,
        }}
      >
        <Field
          label={L.orgRole}
          value={item.role}
          onChange={(e) => onChange({ ...item, role: e.target.value })}
          placeholder={L.phOrgRole}
        />
        <Field
          label={L.orgName}
          value={item.org}
          onChange={(e) => onChange({ ...item, org: e.target.value })}
          placeholder={L.phOrgName}
        />
        <Field
          label={L.start}
          value={item.start}
          onChange={(e) => onChange({ ...item, start: e.target.value })}
          placeholder={L.phStart}
        />
        <Field
          label={L.end}
          value={item.end}
          onChange={(e) => onChange({ ...item, end: e.target.value })}
          placeholder={L.phEnd}
        />
      </div>
      <CheckField
        label={L.stillHere}
        checked={item.end === L.phEnd}
        onChange={(e) =>
          onChange({ ...item, end: e.target.checked ? L.phEnd : "" })
        }
      />
      <BulletListField
        label={L.desc}
        tipKey="desc"
        items={item.desc}
        onChange={(bullets) => onChange({ ...item, desc: bullets })}
        placeholder={L.phOrgDesc}
      />
      <DeleteBtn onClick={onDelete} />
    </ItemWrap>
  );
}

function VolunteerItem({ item, onChange, onDelete, L }) {
  return (
    <ItemWrap>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 8,
        }}
      >
        <Field
          label={L.volRole}
          value={item.role}
          onChange={(e) => onChange({ ...item, role: e.target.value })}
          placeholder={L.phVolRole}
        />
        <Field
          label={L.volOrg}
          value={item.org}
          onChange={(e) => onChange({ ...item, org: e.target.value })}
          placeholder={L.phVolOrg}
        />
        <Field
          label={L.start}
          value={item.start}
          onChange={(e) => onChange({ ...item, start: e.target.value })}
          placeholder={L.phStart}
        />
        <Field
          label={L.end}
          value={item.end}
          onChange={(e) => onChange({ ...item, end: e.target.value })}
          placeholder={L.phEnd}
        />
      </div>
      <CheckField
        label={L.stillHere}
        checked={item.end === L.phEnd}
        onChange={(e) =>
          onChange({ ...item, end: e.target.checked ? L.phEnd : "" })
        }
      />
      <BulletListField
        label={L.desc}
        tipKey="desc"
        items={item.desc}
        onChange={(bullets) => onChange({ ...item, desc: bullets })}
        placeholder={L.phVolDesc}
      />
      <DeleteBtn onClick={onDelete} />
    </ItemWrap>
  );
}

function EduItem({ item, onChange, onDelete, L }) {
  return (
    <ItemWrap>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 8,
        }}
      >
        <Field
          label={L.school}
          tipKey="school"
          value={item.school}
          onChange={(e) => onChange({ ...item, school: e.target.value })}
          placeholder={L.phSchool}
        />
        <Field
          label={L.degree}
          tipKey="degree"
          value={item.degree}
          onChange={(e) => onChange({ ...item, degree: e.target.value })}
          placeholder={L.phDegree}
        />
        <Field
          label={L.start}
          value={item.start}
          onChange={(e) => onChange({ ...item, start: e.target.value })}
          placeholder={L.phStart}
        />
        <Field
          label={L.end}
          value={item.end}
          onChange={(e) => onChange({ ...item, end: e.target.value })}
          placeholder={L.phEnd}
        />
      </div>
      <CheckField
        label={L.stillHere}
        checked={item.end === L.phEnd}
        onChange={(e) =>
          onChange({ ...item, end: e.target.checked ? L.phEnd : "" })
        }
      />
      <BulletListField
        label={L.desc}
        tipKey="desc"
        items={item.desc}
        onChange={(bullets) => onChange({ ...item, desc: bullets })}
        placeholder={L.phEduDesc}
      />
      <DeleteBtn onClick={onDelete} />
    </ItemWrap>
  );
}

function AwardItem({ item, onChange, onDelete, L }) {
  return (
    <ItemWrap>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 8,
        }}
      >
        <Field
          label={L.awardTitle}
          value={item.title}
          onChange={(e) => onChange({ ...item, title: e.target.value })}
          placeholder={L.phAwardTitle}
        />
        <Field
          label={L.awardYear}
          value={item.year}
          onChange={(e) => onChange({ ...item, year: e.target.value })}
          placeholder={L.phAwardYear}
        />
      </div>
      <Field
        label={L.awardIssuer}
        value={item.issuer}
        onChange={(e) => onChange({ ...item, issuer: e.target.value })}
        placeholder={L.phAwardIssuer}
      />
      <DeleteBtn onClick={onDelete} />
    </ItemWrap>
  );
}

function CertItem({ item, onChange, onDelete, L }) {
  return (
    <ItemWrap>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 8,
        }}
      >
        <Field
          label={L.certName}
          tipKey="certName"
          value={item.name}
          onChange={(e) => onChange({ ...item, name: e.target.value })}
          placeholder={L.phCertName}
        />
        <Field
          label={L.certIssuer}
          value={item.issuer}
          onChange={(e) => onChange({ ...item, issuer: e.target.value })}
          placeholder={L.phCertIssuer}
        />
        <Field
          label={L.certYear}
          value={item.year}
          onChange={(e) => onChange({ ...item, year: e.target.value })}
          placeholder={L.phCertYear}
        />
        <Field
          label={L.certLicense}
          value={item.license}
          onChange={(e) => onChange({ ...item, license: e.target.value })}
          placeholder={L.phCertLicense}
        />
      </div>
      <Field
        label={L.certUrl}
        value={item.url}
        onChange={(e) => onChange({ ...item, url: e.target.value })}
        placeholder="https://coursera.org/verify/..."
      />
      <DeleteBtn onClick={onDelete} />
    </ItemWrap>
  );
}

/* ------------------------------------------------------------------ */
/*  CV PREVIEW (ATS 1-kolom, live update)                              */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Pratinjau berhalaman                                               */
/*                                                                     */
/*  Isi CV dirender sekali secara utuh, lalu dipotong menjadi halaman   */
/*  lewat viewport ber-overflow-hidden yang digeser. Cara ini jauh      */
/*  lebih sederhana daripada benar-benar membelah konten, dan hasil     */
/*  potongannya persis mengikuti tinggi halaman A4.                     */
/* ------------------------------------------------------------------ */
function PratinjauBerhalaman({ children }) {
  const LEBAR_HAL = 680; // 680px mewakili 210mm
  const TINGGI_HAL = Math.round((LEBAR_HAL * 297) / 210); // rasio A4

  const wadahRef = useRef(null);
  const isiRef = useRef(null);
  const [skala, setSkala] = useState(0.8);
  const [halaman, setHalaman] = useState(1);

  // Skala mengikuti lebar wadah supaya pratinjau memenuhi ruang yang ada
  useEffect(() => {
    const el = wadahRef.current;
    if (!el) return;
    const hitung = () => {
      const tersedia = el.clientWidth - 28; // sisakan ruang untuk bayangan
      setSkala(Math.min(1.15, Math.max(0.35, tersedia / LEBAR_HAL)));
    };
    hitung();
    const ro = new ResizeObserver(hitung);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [awalHalaman, setAwalHalaman] = useState([0]);

  /**
   * Menghitung posisi awal tiap halaman.
   *
   * Pemotongan tidak boleh sekadar per TINGGI_HAL, karena blok bisa
   * terbelah di tengah — judul section tertinggal di bawah, isinya pindah.
   * Di sini tiap blok bertanda data-blok diukur, lalu halaman baru dimulai
   * tepat di awal blok yang tidak muat. Blok bertanda data-jaga (judul
   * section) ikut terdorong bersama blok sesudahnya.
   */
  useEffect(() => {
    const el = isiRef.current;
    if (!el) return;

    const hitung = () => {
      const dasar = el.getBoundingClientRect().top;
      const blok = Array.from(el.querySelectorAll("[data-blok]")).map((b) => {
        const r = b.getBoundingClientRect();
        return {
          atas: (r.top - dasar) / skala,
          bawah: (r.bottom - dasar) / skala,
          jaga: b.hasAttribute("data-jaga"),
        };
      });

      const awal = [0];
      let mulaiHal = 0;

      blok.forEach((b, i) => {
        if (b.bawah <= mulaiHal + TINGGI_HAL) return;

        // Blok yang lebih tinggi dari satu halaman tetap dibiarkan terbelah
        if (b.bawah - b.atas > TINGGI_HAL) return;

        // Kalau blok sebelumnya adalah judul section, ikut didorong
        const sebelum = blok[i - 1];
        const potong =
          sebelum && sebelum.jaga && sebelum.bawah >= b.atas - 24
            ? sebelum.atas
            : b.atas;

        if (potong > mulaiHal) {
          mulaiHal = potong;
          awal.push(potong);
        }
      });

      // Hanya perbarui kalau titik potongnya benar-benar berubah,
      // supaya tidak memicu render ulang beruntun.
      setAwalHalaman((lama) =>
        lama.length === awal.length &&
        lama.every((v, i) => Math.abs(v - awal[i]) < 1)
          ? lama
          : awal,
      );
    };

    hitung();
    const ro = new ResizeObserver(hitung);
    ro.observe(el);
    return () => ro.disconnect();
  }, [skala]);

  const totalHalaman = awalHalaman.length;
  const hal = Math.min(halaman, totalHalaman);
  const geser = awalHalaman[hal - 1] ?? 0;

  return (
    <div ref={wadahRef} style={{ padding: "18px 14px" }}>
      {/* Lembar halaman */}
      <div
        style={{
          width: LEBAR_HAL * skala,
          height: TINGGI_HAL * skala,
          margin: "0 auto",
          overflow: "hidden",
          background: "#fff",
          borderRadius: 2,
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            width: LEBAR_HAL,
            transform: `scale(${skala}) translateY(${-geser}px)`,
            transformOrigin: "top left",
          }}
        >
          <div ref={isiRef}>{children}</div>
        </div>
      </div>

      {/* Navigasi halaman */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <button
          onClick={() => setHalaman((h) => Math.max(1, h - 1))}
          disabled={hal <= 1}
          aria-label="Halaman sebelumnya"
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            border: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: hal <= 1 ? "not-allowed" : "pointer",
            opacity: hal <= 1 ? 0.45 : 1,
            color: T.ink,
          }}
        >
          <ChevronLeft size={15} />
        </button>

        <span
          style={{
            fontSize: 12,
            color: T.inkSoft,
            fontFamily: "'Poppins', sans-serif",
            minWidth: 108,
            textAlign: "center",
          }}
        >
          Halaman {hal} dari {totalHalaman}
        </span>

        <button
          onClick={() => setHalaman((h) => Math.min(totalHalaman, h + 1))}
          disabled={hal >= totalHalaman}
          aria-label="Halaman berikutnya"
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            border: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: hal >= totalHalaman ? "not-allowed" : "pointer",
            opacity: hal >= totalHalaman ? 0.45 : 1,
            color: T.ink,
          }}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function CVPreview({ data, L }) {
  const lang = React.useContext(LangContext);
  const s = {
    wrap: {
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 10.5,
      lineHeight: 1.55,
      color: "#111",
      width: 680,
      padding: "36px 48px",
      background: "#fff",
      boxSizing: "border-box",
    },
    name: { fontSize: 21, fontWeight: 700, color: "#111", marginBottom: 2 },
    headline: { fontSize: 12, color: "#444", marginBottom: 6 },
    contact: {
      fontSize: 10,
      color: "#555",
      display: "flex",
      flexWrap: "wrap",
      gap: "3px 14px",
      marginBottom: 14,
    },
    divider: { borderTop: "1.5px solid #111", margin: "3px 0 0" },
    thinDivider: { borderTop: "0.5px solid #ccc", margin: "8px 0 6px" },
    sectionTitle: {
      fontSize: 10,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "#333",
      marginBottom: 0,
    },
    // Satu entri pengalaman/pendidikan tidak boleh terbelah dua halaman.
    // Kalau tidak muat, seluruh bloknya pindah ke halaman berikutnya.
    entri: {
      breakInside: "avoid",
      pageBreakInside: "avoid",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    },
    // minWidth 0 wajib: tanpa itu, judul panjang menolak membungkus
    // dan malah menabrak kolom tanggal di sebelah kanan.
    roleText: {
      fontWeight: 700,
      fontSize: 11,
      color: "#111",
      flex: 1,
      minWidth: 0,
      lineHeight: 1.35,
    },
    metaText: {
      fontSize: 9.5,
      color: "#666",
      textAlign: "right",
      flexShrink: 0,
      whiteSpace: "nowrap",
      paddingTop: 1,
    },
    subText: { fontSize: 10, color: "#555", marginTop: 1 },
    descText: {
      fontSize: 9.5,
      color: "#444",
      marginTop: 2,
      lineHeight: 1.5,
      paddingLeft: 4,
      textAlign: "justify",
      // Tanpa hyphens, teks rata kanan-kiri menghasilkan celah antarkata
      // yang lebar dan tidak rapi, terutama di kolom sempit.
      hyphens: "auto",
      WebkitHyphens: "auto",
    },
    skillRow: { display: "flex", flexWrap: "wrap", gap: "3px 10px" },
    skillTag: { fontSize: 10, color: "#333" },
  };

  // Garis berada DI BAWAH judul, bukan di atasnya — judul jadi terbaca
  // menempel pada isinya, bukan mengambang di antara dua bagian.
  const Section = ({ title }) => (
    <div
      data-blok=""
      data-jaga=""
      style={{
        marginTop: 12,
        marginBottom: 6,
        breakAfter: "avoid",
        pageBreakAfter: "avoid",
      }}
    >
      <div style={s.sectionTitle}>{title}</div>
      <div style={s.divider} />
    </div>
  );

  // Bullet digambar manual, bukan lewat list-style.
  // Marker bawaan browser tampil sebagai "*" di font yang dipakai preview ini,
  // dan hasil cetaknya tidak konsisten. Titik digambar sebagai elemen sendiri
  // supaya bentuknya sama di layar maupun di PDF, sekaligus memberi
  // hanging indent yang benar saat teksnya membungkus ke baris berikutnya.
  const BulletBlock = ({ items }) =>
    Array.isArray(items) && items.length > 0 ? (
      <div style={{ margin: "3px 0 0" }}>
        {items.map((d, di) => (
          <div
            key={di}
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 2,
              breakInside: "avoid",
              pageBreakInside: "avoid",
            }}
          >
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "#444",
                flexShrink: 0,
                marginTop: 5.5,
              }}
            />
            <span
              style={{
                ...s.descText,
                paddingLeft: 0,
                marginTop: 0,
                flex: 1,
                minWidth: 0,
              }}
            >
              {d}
            </span>
          </div>
        ))}
      </div>
    ) : null;

  const exps = data.experiences.filter((e) => e.role || e.company);
  const orgs = data.organizations.filter((o) => o.role || o.org);
  const vols = (data.volunteers || []).filter((v) => v.role || v.org);
  const edus = data.education.filter((e) => e.school || e.degree);
  const aws = data.awards.filter((a) => a.title);
  const certs = (data.certifications || []).filter((c) => c.name);

  return (
    // lang menentukan aturan pemenggalan kata yang dipakai browser.
    // Tanpa atribut ini, hyphens: auto tidak berpengaruh sama sekali.
    <div style={s.wrap} lang={lang === "EN" ? "en" : "id"}>
      {/* Header */}
      <div style={s.name}>{data.fullName || "Nama Lengkap"}</div>
      {data.headline && <div style={s.headline}>{data.headline}</div>}
      <div style={s.contact}>
        {data.email && <span>✉ {data.email}</span>}
        {data.phone && <span>☏ {data.phone}</span>}
        {data.location && <span>⌖ {data.location}</span>}
        {data.linkedin && <span>in {data.linkedin}</span>}
      </div>

      {/* Ringkasan */}
      {data.summary && (
        <>
          <Section title={L.summary} />
          <div style={{ ...s.descText, paddingLeft: 0, marginBottom: 4 }}>
            {data.summary}
          </div>
        </>
      )}

      {/* Pengalaman Kerja */}
      {exps.length > 0 && (
        <>
          <Section title={L.experience} />
          {exps.map((e, i) => (
            <div
              key={e.id}
              data-blok=""
              style={{ ...s.entri, marginBottom: i < exps.length - 1 ? 8 : 0 }}
            >
              <div style={s.row}>
                <div style={s.roleText}>{e.role || "Posisi"}</div>
                <div style={s.metaText}>
                  {[e.start, e.end].filter(Boolean).join(" – ")}
                </div>
              </div>
              {e.company && <div style={s.subText}>{e.company}</div>}
              <BulletBlock items={e.desc} />
            </div>
          ))}
        </>
      )}

      {/* Pengalaman Organisasi */}
      {orgs.length > 0 && (
        <>
          <Section title={L.organization} />
          {orgs.map((o, i) => (
            <div
              key={o.id}
              data-blok=""
              style={{ ...s.entri, marginBottom: i < orgs.length - 1 ? 8 : 0 }}
            >
              <div style={s.row}>
                <div style={s.roleText}>{o.role || "Jabatan"}</div>
                <div style={s.metaText}>
                  {[o.start, o.end].filter(Boolean).join(" – ")}
                </div>
              </div>
              {o.org && <div style={s.subText}>{o.org}</div>}
              <BulletBlock items={o.desc} />
            </div>
          ))}
        </>
      )}

      {/* Pengalaman Volunteer */}
      {vols.length > 0 && (
        <>
          <Section title={L.volunteer} />
          {vols.map((v, i) => (
            <div
              key={v.id}
              data-blok=""
              style={{ ...s.entri, marginBottom: i < vols.length - 1 ? 8 : 0 }}
            >
              <div style={s.row}>
                <div style={s.roleText}>{v.role || "Peran"}</div>
                <div style={s.metaText}>
                  {[v.start, v.end].filter(Boolean).join(" – ")}
                </div>
              </div>
              {v.org && <div style={s.subText}>{v.org}</div>}
              <BulletBlock items={v.desc} />
            </div>
          ))}
        </>
      )}

      {/* Pendidikan */}
      {edus.length > 0 && (
        <>
          <Section title={L.education} />
          {edus.map((e, i) => (
            <div
              key={e.id}
              data-blok=""
              style={{ ...s.entri, marginBottom: i < edus.length - 1 ? 8 : 0 }}
            >
              <div style={s.row}>
                <div style={s.roleText}>{e.school || "Institusi"}</div>
                <div style={s.metaText}>
                  {[e.start, e.end].filter(Boolean).join(" – ")}
                </div>
              </div>
              {e.degree && <div style={s.subText}>{e.degree}</div>}
              <BulletBlock items={e.desc} />
            </div>
          ))}
        </>
      )}

      {/* Penghargaan */}
      {aws.length > 0 && (
        <>
          <Section title={L.awards} />
          {aws.map((a, i) => (
            <div
              key={a.id}
              data-blok=""
              style={{ ...s.entri, marginBottom: i < aws.length - 1 ? 8 : 0 }}
            >
              <div style={s.row}>
                <div style={s.roleText}>{a.title}</div>
                {a.year && <div style={s.metaText}>{a.year}</div>}
              </div>
              {a.issuer && <div style={s.subText}>{a.issuer}</div>}
            </div>
          ))}
        </>
      )}

      {/* Sertifikasi */}
      {certs.length > 0 && (
        <>
          <Section title={L.certifications} />
          {certs.map((c, i) => (
            <div
              key={c.id}
              data-blok=""
              style={{ ...s.entri, marginBottom: i < certs.length - 1 ? 8 : 0 }}
            >
              <div style={s.row}>
                <div style={s.roleText}>{c.name || "Sertifikasi"}</div>
                {c.year && <div style={s.metaText}>{c.year}</div>}
              </div>
              {c.issuer && (
                <div style={s.subText}>
                  {c.issuer}
                  {c.license ? ` · ${c.license}` : ""}
                </div>
              )}
              {c.url && (
                <div style={{ ...s.subText, fontSize: 9, color: "#6B7AE8" }}>
                  {c.url}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Keahlian */}
      {data.skills.length > 0 && (
        <>
          <Section title={L.skills} />
          {/* Titik berada di DEPAN tiap keahlian, termasuk di awal baris —
              disamakan dengan hasil PDF. */}
          <div style={s.skillRow}>
            {data.skills.map((sk) => (
              <span
                key={sk}
                style={{
                  ...s.skillTag,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 2.5,
                    height: 2.5,
                    borderRadius: "50%",
                    background: "#888",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {sk}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PANEL                                                          */
/* ------------------------------------------------------------------ */
export function CVBuilderPanel({ setActive }) {
  const { fullName, headline, location, summary, skills } = useUserProfile();
  const { user } = useAuth();
  const [lang, setLang] = useState("ID"); // "ID" | "EN"
  const layarKecil = useLayarKecil(1000);
  const [tabHp, setTabHp] = useState("editor"); // "editor" | "pratinjau"
  const L = LABELS[lang];
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [dirty, setDirty] = useState(false);
  const langganan = useLangganan();
  const profileLoaded = useRef(false);

  const [data, setData] = useState({
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    experiences: [
      { id: uid(), role: "", company: "", start: "", end: "", desc: [] },
    ],
    organizations: [
      { id: uid(), role: "", org: "", start: "", end: "", desc: [] },
    ],
    volunteers: [
      { id: uid(), role: "", org: "", start: "", end: "", desc: [] },
    ],
    education: [
      { id: uid(), school: "", degree: "", start: "", end: "", desc: [] },
    ],
    awards: [{ id: uid(), title: "", year: "", issuer: "" }],
    certifications: [
      { id: uid(), name: "", issuer: "", year: "", license: "", url: "" },
    ],
    skills: [],
  });
  const [newSkill, setNewSkill] = useState("");

  // Isi awal dari profil user
  useEffect(() => {
    if (profileLoaded.current) return;
    if (!fullName && !headline && skills.length === 0 && !summary) return;
    profileLoaded.current = true;
    setData((prev) => ({
      ...prev,
      fullName: fullName || prev.fullName,
      headline: headline || prev.headline,
      location: location || prev.location,
      summary: summary || prev.summary,
      skills: skills.length > 0 ? [...skills] : prev.skills,
    }));
  }, [fullName, headline, location, summary, skills]);

  const set = (field) => (e) =>
    setData((prev) => ({ ...prev, [field]: e.target.value }));

  const makeHelpers = (key, template) => ({
    update: (id, updated) =>
      setData((prev) => ({
        ...prev,
        [key]: prev[key].map((i) => (i.id === id ? updated : i)),
      })),
    add: () =>
      setData((prev) => ({
        ...prev,
        [key]: [...prev[key], { id: uid(), ...template }],
      })),
    remove: (id) =>
      setData((prev) => ({
        ...prev,
        [key]: prev[key].filter((i) => i.id !== id),
      })),
  });

  const exp = makeHelpers("experiences", {
    role: "",
    company: "",
    start: "",
    end: "",
    desc: [],
  });
  const org = makeHelpers("organizations", {
    role: "",
    org: "",
    start: "",
    end: "",
    desc: [],
  });
  const vol = makeHelpers("volunteers", {
    role: "",
    org: "",
    start: "",
    end: "",
    desc: [],
  });
  const edu = makeHelpers("education", {
    school: "",
    degree: "",
    start: "",
    end: "",
    desc: [],
  });
  const aw = makeHelpers("awards", { title: "", year: "", issuer: "" });
  const cert = makeHelpers("certifications", {
    name: "",
    issuer: "",
    year: "",
    license: "",
    url: "",
  });

  const addSkill = () => {
    const clean = newSkill.trim();
    if (!clean || data.skills.includes(clean)) return;
    setData((prev) => ({ ...prev, skills: [...prev.skills, clean] }));
    setNewSkill("");
  };

  /* ---------- SUPABASE: load draft (cv_json) saja saat komponen dibuka ---------- */
  useEffect(() => {
    if (!user || !supabaseConfigured) return;
    supabase
      .from("profiles")
      .select("cv_json")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data: row }) => {
        if (row?.cv_json && Object.keys(row.cv_json).length > 0) {
          // Draft ada — pakai ini, skip pre-fill dari profil
          // Normalisasi: pastikan field desc lama (string) jadi array bullet,
          // dan pastikan array volunteers/education punya bentuk yang benar
          const toBullets = (v) => (Array.isArray(v) ? v : v ? [v] : []);
          const normalized = {
            ...row.cv_json,
            experiences: (row.cv_json.experiences || []).map((e) => ({
              ...e,
              desc: toBullets(e.desc),
            })),
            organizations: (row.cv_json.organizations || []).map((o) => ({
              ...o,
              desc: toBullets(o.desc),
            })),
            volunteers: (row.cv_json.volunteers || []).map((v) => ({
              ...v,
              desc: toBullets(v.desc),
            })),
            education: (row.cv_json.education || []).map((e) => ({
              ...e,
              desc: toBullets(e.desc),
            })),
          };
          setData((prev) => ({ ...prev, ...normalized }));
          profileLoaded.current = true;
        }
      });
  }, [user?.id]);

  /* ---------- SUPABASE: simpan draft — HANYA saat tombol "Simpan" diklik ---------- */
  const saveDraft = useCallback(
    async (currentData) => {
      if (!user || !supabaseConfigured) return;
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          cv_json: currentData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      setSaving(false);
      if (!error) {
        setSaveMsg(lang === "ID" ? "Tersimpan" : "Saved");
        setDirty(false);
        setTimeout(() => setSaveMsg(""), 2000);
      } else {
        setSaveMsg(lang === "ID" ? "Gagal simpan" : "Save failed");
        setTimeout(() => setSaveMsg(""), 2500);
      }
    },
    [user?.id, lang],
  );

  /* ---------- Terapkan draft hasil AI ke form ---------- */
  const applyAiDraft = (aiDraft) => {
    if (!aiDraft) return;
    const toBullets = (v) => (Array.isArray(v) ? v : v ? [v] : []);
    const withId = (arr, fallback) => {
      const list = (arr || []).filter(Boolean);
      if (list.length === 0) return [{ id: uid(), ...fallback }];
      return list.map((it) => ({
        ...it,
        id: it.id || uid(),
        ...(it.desc !== undefined ? { desc: toBullets(it.desc) } : {}),
      }));
    };

    setData((prev) => ({
      ...prev,
      // Field teks: pakai versi AI kalau ada isinya, kalau kosong pertahankan yang lama
      fullName: aiDraft.fullName || prev.fullName,
      headline: aiDraft.headline || prev.headline,
      email: aiDraft.email || prev.email,
      phone: aiDraft.phone || prev.phone,
      location: aiDraft.location || prev.location,
      linkedin: aiDraft.linkedin || prev.linkedin,
      summary: aiDraft.summary || prev.summary,
      experiences: withId(aiDraft.experiences, {
        role: "",
        company: "",
        start: "",
        end: "",
        desc: [],
      }),
      organizations: withId(aiDraft.organizations, {
        role: "",
        org: "",
        start: "",
        end: "",
        desc: [],
      }),
      volunteers: withId(aiDraft.volunteers, {
        role: "",
        org: "",
        start: "",
        end: "",
        desc: [],
      }),
      education: withId(aiDraft.education, {
        school: "",
        degree: "",
        start: "",
        end: "",
        desc: [],
      }),
      awards: withId(aiDraft.awards, { title: "", year: "", issuer: "" }),
      certifications: withId(aiDraft.certifications, {
        name: "",
        issuer: "",
        year: "",
        license: "",
        url: "",
      }),
      skills:
        Array.isArray(aiDraft.skills) && aiDraft.skills.length > 0
          ? aiDraft.skills
          : prev.skills,
    }));

    profileLoaded.current = true;
    setDirty(true);
  };

  const handleManualSave = () => saveDraft(data);

  /* ---------- Tandai ada perubahan yang belum disimpan ---------- */
  useEffect(() => {
    if (!profileLoaded.current) return;
    setDirty(true);
  }, [data]);

  /* ---------- PDF ---------- */
  const handleDownload = async () => {
    setDownloading(true);
    try {
      // jsPDF sudah di-import statis di atas (npm install jspdf)
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 20,
        pageW = 210,
        contentW = pageW - margin * 2,
        BATAS_BAWAH = 278; // batas bawah area cetak (mm)
      let y = margin;

      const safe = (t) =>
        (t || "")
          .toString()
          // Font bawaan jsPDF memakai WinAnsiEncoding, yang sudah memuat
          // "•" (0x95) dan "·" (0xB7) — keduanya dipertahankan supaya
          // pemisah di PDF sama dengan pratinjau.
          .replace(
            /[^\x00-\x7F]/g,
            (c) =>
              ({ "–": "-", "—": "-", "\u2022": "\u2022", "·": "·" })[c] || "",
          );

      /**
       * Menggambar satu baris dengan rata kanan-kiri.
       *
       * Opsi align:"justify" bawaan jsPDF tidak berpengaruh untuk baris yang
       * sudah dipecah lebih dulu lewat splitTextToSize — itu sebabnya hasil
       * sebelumnya tetap rata kiri. Di sini jarak antarkata dihitung sendiri:
       * sisa ruang dibagi rata ke seluruh celah, lalu tiap kata digambar
       * pada posisi x-nya masing-masing.
       */
      const gambarBarisRata = (baris, x, yy, lebar) => {
        const kata = baris.split(/\s+/).filter(Boolean);

        // Satu kata tidak punya celah untuk diregangkan
        if (kata.length < 2) {
          doc.text(baris, x, yy);
          return;
        }

        const lebarKata = kata.map((k) => doc.getTextWidth(k));
        const totalKata = lebarKata.reduce((a, b) => a + b, 0);
        const celah = (lebar - totalKata) / (kata.length - 1);

        // Ambangnya diukur relatif terhadap lebar spasi pada ukuran font
        // yang sedang dipakai, bukan angka milimeter tetap — kalau tidak,
        // batasnya jadi terlalu ketat di font kecil dan terlalu longgar
        // di font besar. Lebih dari 2,5x spasi normal sudah terlihat renggang.
        const lebarSpasi = doc.getTextWidth(" ") || 1;
        if (celah <= 0 || celah > lebarSpasi * 2.5) {
          doc.text(baris, x, yy);
          return;
        }

        let posX = x;
        kata.forEach((k, i) => {
          doc.text(k, posX, yy);
          posX += lebarKata[i] + celah;
        });
      };

      const addText = (
        text,
        {
          size = 10,
          bold = false,
          color = [0, 0, 0],
          indent = 0,
          lineH = 5.5,
          justify = false,
        } = {},
      ) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setTextColor(...color);

        const lebar = contentW - indent;
        const lines = doc.splitTextToSize(safe(text), lebar);

        lines.forEach((line, i) => {
          if (y > BATAS_BAWAH) {
            doc.addPage();
            y = margin;
          }
          // Baris terakhir tidak diratakan — kalau dipaksa, celah antarkata
          // jadi menganga karena isinya cuma beberapa kata.
          if (justify && i < lines.length - 1) {
            gambarBarisRata(line, margin + indent, y, lebar);
          } else {
            doc.text(line, margin + indent, y);
          }
          y += lineH;
        });
      };

      // Bullet digambar sebagai lingkaran, bukan karakter.
      // Font bawaan jsPDF tidak punya glyph "•", dan safe() mengubahnya
      // jadi "*" — itu penyebab bullet berbentuk bintang di hasil unduhan.
      const addBullets = (items, opts = {}) => {
        if (!Array.isArray(items)) return;
        const indentTeks = 5;

        items.filter(Boolean).forEach((d) => {
          doc.setFontSize(8.8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);

          const lines = doc.splitTextToSize(safe(d), contentW - indentTeks);

          lines.forEach((line, i) => {
            if (y > BATAS_BAWAH) {
              doc.addPage();
              y = margin;
            }
            // Titik hanya di baris pertama; baris lanjutan menjorok sejajar
            if (i === 0) {
              doc.setFillColor(70, 70, 70);
              doc.circle(margin + 1.6, y - 1.1, 0.5, "F");
            }
            if (i < lines.length - 1) {
              gambarBarisRata(
                line,
                margin + indentTeks,
                y,
                contentW - indentTeks,
              );
            } else {
              doc.text(line, margin + indentTeks, y);
            }
            y += 4.5;
          });
        });
      };

      const divider = (thick = false) => {
        if (y > BATAS_BAWAH) {
          doc.addPage();
          y = margin;
        }
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(thick ? 0.6 : 0.2);
        doc.line(margin, y, pageW - margin, y);
        y += 3;
      };

      // Garis DI BAWAH judul, mengikuti pratinjau — judul jadi menempel
      // pada isinya, bukan mengambang di antara dua bagian.
      const section = (title) => {
        // Judul section butuh ruang untuk dirinya plus setidaknya
        // satu entri pendek di bawahnya, supaya tidak tertinggal sendirian.
        if (y + 22 > BATAS_BAWAH) {
          doc.addPage();
          y = margin;
        }
        y += 4;
        // Jarak antarhuruf meniru letterSpacing 0.08em di pratinjau —
        // tanpa ini judul section terasa lebih padat daripada versi web.
        doc.setCharSpace(0.4);
        addText(title.toUpperCase(), {
          size: 9,
          bold: true,
          lineH: 3.5,
          color: [60, 60, 60],
        });
        doc.setCharSpace(0);
        divider(false);
        y += 1.5;
      };

      /**
       * Padanan `break-inside: avoid` untuk jsPDF.
       *
       * Tinggi satu entri dihitung dulu; kalau tidak muat di sisa halaman,
       * halaman baru dibuka SEBELUM entri digambar. Tanpa ini, judul bisa
       * tertinggal sendirian di dasar halaman sementara isinya pindah.
       */
      const tinggiEntri = (judulKiri, tanggal, subTeks, bullets) => {
        let t = 0;

        // Judul (bisa membungkus kalau panjang)
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        const lebarKanan = tanggal ? doc.getTextWidth(safe(tanggal)) + 4 : 0;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        t +=
          doc.splitTextToSize(safe(judulKiri), contentW - lebarKanan).length *
            4.8 +
          0.5;

        // Sub-teks (nama perusahaan / institusi)
        if (subTeks) {
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          t += doc.splitTextToSize(safe(subTeks), contentW).length * 4.4;
        }

        // Bullet
        if (Array.isArray(bullets)) {
          doc.setFontSize(8.8);
          doc.setFont("helvetica", "normal");
          bullets.filter(Boolean).forEach((b) => {
            t += doc.splitTextToSize(safe(b), contentW - 5).length * 4.5;
          });
        }

        return t + 2;
      };

      const mulaiEntri = (tinggi) => {
        const sisa = BATAS_BAWAH - y;
        // Entri yang lebih tinggi dari satu halaman penuh tetap dibiarkan
        // terpotong — memindahkannya tidak menolong apa pun.
        const muatDiHalamanBaru = tinggi <= BATAS_BAWAH - margin;
        if (tinggi > sisa && muatDiHalamanBaru) {
          doc.addPage();
          y = margin;
        }
      };

      // Judul kiri dibatasi lebarnya dan dibungkus, supaya judul panjang
      // (mis. nama sertifikasi ISO) tidak menimpa kolom tanggal di kanan.
      const rowLR = (left, right) => {
        if (y > BATAS_BAWAH) {
          doc.addPage();
          y = margin;
        }

        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        const lebarKanan = right ? doc.getTextWidth(safe(right)) + 4 : 0;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(safe(left), contentW - lebarKanan);

        // Tanggal ditulis sejajar baris pertama judul
        if (right) {
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(110, 110, 110);
          doc.text(safe(right), pageW - margin, y, { align: "right" });
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
        }

        lines.forEach((line, i) => {
          if (i > 0 && y > BATAS_BAWAH) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += 4.8;
        });
        y += 0.5;
      };

      // Header
      addText(data.fullName || "Nama Lengkap", {
        size: 19,
        bold: true,
        lineH: 8,
      });
      if (data.headline)
        addText(data.headline, { size: 10.5, color: [70, 70, 70], lineH: 5.5 });
      const contacts = [
        data.email,
        data.phone,
        data.location,
        data.linkedin,
      ].filter(Boolean);
      if (contacts.length) {
        y += 1;
        addText(contacts.join("   |   "), {
          size: 8.8,
          color: [100, 100, 100],
          lineH: 5,
        });
      }
      y += 2;

      if (data.summary) {
        section(L.summary);
        addText(data.summary, {
          size: 9.2,
          color: [50, 50, 50],
          lineH: 4.7,
          justify: true,
        });
      }

      const exps = data.experiences.filter((e) => e.role || e.company);
      if (exps.length) {
        section(L.experience);
        exps.forEach((e) => {
          const tgl = [e.start, e.end].filter(Boolean).join(" - ");
          mulaiEntri(tinggiEntri(e.role || "Posisi", tgl, e.company, e.desc));
          rowLR(e.role || "Posisi", tgl);
          if (e.company)
            addText(e.company, { size: 9, color: [85, 85, 85], lineH: 4.4 });
          addBullets(e.desc);
          y += 2;
        });
      }

      const orgs = data.organizations.filter((o) => o.role || o.org);
      if (orgs.length) {
        section(L.organization);
        orgs.forEach((o) => {
          const tgl = [o.start, o.end].filter(Boolean).join(" - ");
          mulaiEntri(tinggiEntri(o.role || "Jabatan", tgl, o.org, o.desc));
          rowLR(o.role || "Jabatan", tgl);
          if (o.org)
            addText(o.org, { size: 9, color: [85, 85, 85], lineH: 4.4 });
          addBullets(o.desc);
          y += 2;
        });
      }

      const vols = (data.volunteers || []).filter((v) => v.role || v.org);
      if (vols.length) {
        section(L.volunteer);
        vols.forEach((v) => {
          const tgl = [v.start, v.end].filter(Boolean).join(" - ");
          mulaiEntri(tinggiEntri(v.role || "Peran", tgl, v.org, v.desc));
          rowLR(v.role || "Peran", tgl);
          if (v.org)
            addText(v.org, { size: 9, color: [85, 85, 85], lineH: 4.4 });
          addBullets(v.desc);
          y += 2;
        });
      }

      const edus = data.education.filter((e) => e.school || e.degree);
      if (edus.length) {
        section(L.education);
        edus.forEach((e) => {
          const tgl = [e.start, e.end].filter(Boolean).join(" - ");
          mulaiEntri(
            tinggiEntri(e.school || "Institusi", tgl, e.degree, e.desc),
          );
          rowLR(e.school || "Institusi", tgl);
          if (e.degree)
            addText(e.degree, { size: 9, color: [85, 85, 85], lineH: 4.4 });
          addBullets(e.desc);
          y += 2;
        });
      }

      const aws = data.awards.filter((a) => a.title);
      if (aws.length) {
        section(L.awards);
        aws.forEach((a) => {
          mulaiEntri(tinggiEntri(a.title, a.year, a.issuer, null));
          rowLR(a.title, a.year);
          if (a.issuer)
            addText(a.issuer, { size: 9, color: [85, 85, 85], lineH: 4.4 });
          y += 2;
        });
      }

      const certs = (data.certifications || []).filter((c) => c.name);
      if (certs.length) {
        section(L.certifications);
        certs.forEach((c) => {
          const sub0 = [c.issuer, c.license].filter(Boolean).join(" · ");
          mulaiEntri(
            tinggiEntri(c.name, c.year, sub0, null) + (c.url ? 4.5 : 0),
          );
          rowLR(c.name, c.year);
          const sub = [c.issuer, c.license].filter(Boolean).join(" · ");
          if (sub) addText(sub, { size: 9, color: [85, 85, 85], lineH: 4.4 });
          if (c.url)
            addText(c.url, { size: 9, color: [80, 80, 170], lineH: 4.5 });
          y += 2;
        });
      }

      // Keahlian ditaruh paling akhir, mengikuti urutan di pratinjau.
      //
      // Disusun manual, bukan lewat join(): pemisahnya digambar sebagai
      // lingkaran dengan ukuran yang sama persis dengan bullet di bagian
      // lain. Karakter "·" jauh lebih kecil dan terlihat tidak sepadan.
      if (data.skills.length) {
        section(L.skills);

        doc.setFontSize(9.2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(45, 45, 45);

        const lebarTitik = 1.0; // diameter titik
        const jedaTitik = 1.8; // jarak titik ke teks
        const jedaItem = 3.6; // jarak antar-item
        const tinggiBaris = 4.9;

        const daftarSkill = data.skills.filter(Boolean);

        // TAHAP 1 — bagi ke dalam baris.
        // Titik selalu berada DI DEPAN tiap skill, termasuk di awal baris,
        // jadi lebar titik ikut dihitung sebagai bagian dari itemnya.
        const baris = [[]];
        let lebarBaris = 0;

        daftarSkill.forEach((sk) => {
          const w = doc.getTextWidth(safe(sk));
          const lebarItem = lebarTitik + jedaTitik + w;
          const barisIni = baris[baris.length - 1];
          const jeda = barisIni.length > 0 ? jedaItem : 0;

          if (lebarBaris > 0 && lebarBaris + jeda + lebarItem > contentW) {
            baris.push([{ teks: sk, lebar: w }]);
            lebarBaris = lebarItem;
            return;
          }

          barisIni.push({ teks: sk, lebar: w });
          lebarBaris += jeda + lebarItem;
        });

        // TAHAP 2 — gambar.
        baris.forEach((isi) => {
          if (y > BATAS_BAWAH) {
            doc.addPage();
            y = margin;
          }

          let x = margin;
          isi.forEach((item, i) => {
            if (i > 0) x += jedaItem;

            doc.setFillColor(110, 110, 110);
            doc.circle(x + lebarTitik / 2, y - 1.1, lebarTitik / 2, "F");
            x += lebarTitik + jedaTitik;

            doc.text(safe(item.teks), x, y);
            x += item.lebar;
          });

          y += tinggiBaris;
        });
      }

      const fileName = `CV_${(data.fullName || "CV").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;

      // Download lokal
      doc.save(fileName);
    } catch (err) {
      console.error("Gagal generate PDF:", err);
      alert("Gagal buat PDF. Pastikan koneksi internet aktif lalu coba lagi.");
    } finally {
      setDownloading(false);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <LangContext.Provider value={lang}>
      <div
        style={{
          display: "grid",
          // Di layar sempit, editor dan pratinjau tidak muat berdampingan.
          // Keduanya jadi satu kolom penuh dan dipilih lewat tab.
          gridTemplateColumns: layarKecil ? "1fr" : "1fr 1fr",
          gap: layarKecil ? 12 : 20,
          padding: layarKecil ? "16px 14px" : 28,
          height: layarKecil ? "auto" : "calc(100vh - 72px)",
          minHeight: layarKecil ? "calc(100vh - 72px)" : undefined,
          boxSizing: "border-box",
          alignItems: "start",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        {/* Tab hanya muncul di layar sempit */}
        {layarKecil && (
          <div
            style={{
              display: "flex",
              gap: 6,
              padding: 4,
              borderRadius: 12,
              background: "rgba(0,0,0,0.05)",
              position: "sticky",
              top: 0,
              zIndex: 5,
            }}
          >
            {[
              { key: "editor", label: "Editor" },
              { key: "pratinjau", label: "Pratinjau" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTabHp(t.key)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 9,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12.5,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  background: tabHp === t.key ? "#fff" : "transparent",
                  color: tabHp === t.key ? T.accent : T.inkSoft,
                  boxShadow:
                    tabHp === t.key ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        {/* ====== KIRI: Editor — scroll sendiri ====== */}
        <div
          style={{
            display: layarKecil && tabHp !== "editor" ? "none" : "block",
            overflowY: layarKecil ? "visible" : "auto",
            paddingRight: layarKecil ? 0 : 6,
            maxHeight: layarKecil ? "none" : "calc(100vh - 128px)",
            // Tanpa ini, isi yang panjang memaksa kolom melebar melewati
            // layar — anak grid punya min-width: auto secara bawaan.
            minWidth: 0,
          }}
        >
          {/* Pemilih draft AI — menampilkan semua riwayat yang punya draft,
              bukan hanya yang terakhir. */}
          {langganan.aktif ? (
            <PilihDraftAi
              kolom="cv_draft"
              judul={
                lang === "ID"
                  ? "AI sudah menyiapkan draft CV kamu"
                  : "AI has prepared your CV draft"
              }
              keterangan={
                lang === "ID"
                  ? "Ringkasan, bullet pengalaman, dan skill sudah ditulis ulang agar lebih ATS-friendly. Menerapkannya akan menimpa isi form saat ini."
                  : "Your summary, experience bullets, and skills have been rewritten to be more ATS-friendly. Applying will overwrite the current form."
              }
              onTerapkan={applyAiDraft}
              onGantiBahasa={setLang}
            />
          ) : (
            /* Form CV tetap bisa dipakai gratis — hanya arahan AI yang dikunci. */
            <GerbangFitur
              terbuka={false}
              tinggiMinimal={160}
              judul={
                lang === "ID"
                  ? "CV Builder dengan arahan AI"
                  : "AI-guided CV Builder"
              }
              keterangan={
                lang === "ID"
                  ? "AI menulis ulang ringkasan, bullet pengalaman, dan skill kamu agar lolos penyaringan ATS — tersedia dalam bahasa Indonesia dan Inggris."
                  : "AI rewrites your summary, experience bullets, and skills to pass ATS screening — available in both Indonesian and English."
              }
              onLangganan={() => setActive?.("paket")}
            />
          )}

          <SectionCard title={L.personal} icon={User}>
            <Field
              label={L.lblFullName}
              tipKey="fullName"
              value={data.fullName}
              onChange={set("fullName")}
              placeholder="Nama kamu"
            />
            <Field
              label={L.lblHeadline}
              tipKey="headline"
              value={data.headline}
              onChange={set("headline")}
              placeholder="Finance & Tax Staff"
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <Field
                label={L.lblEmail}
                tipKey="email"
                value={data.email}
                onChange={set("email")}
                placeholder="nama@email.com"
              />
              <Field
                label={L.lblPhone}
                tipKey="phone"
                value={data.phone}
                onChange={set("phone")}
                placeholder="+62 812 xxx xxxx"
              />
              <Field
                label={L.lblLocation}
                tipKey="location"
                value={data.location}
                onChange={set("location")}
                placeholder="Jakarta, Indonesia"
              />
              <Field
                label={L.lblLinkedin}
                tipKey="linkedin"
                value={data.linkedin}
                onChange={set("linkedin")}
                placeholder="linkedin.com/in/nama"
              />
            </div>
          </SectionCard>

          <SectionCard title={L.summaryCard} icon={User} defaultOpen={false}>
            <Field
              label={L.lblSummary}
              tipKey="summary"
              value={data.summary}
              onChange={set("summary")}
              placeholder="Deskripsikan dirimu secara singkat — pengalaman, keahlian utama, dan tujuan karier..."
              multiline
              rows={4}
            />
          </SectionCard>

          <SectionCard
            title={L.experience}
            icon={Briefcase}
            defaultOpen={false}
          >
            {data.experiences.map((e) => (
              <ExpItem
                key={e.id}
                item={e}
                onChange={(updated) => exp.update(e.id, updated)}
                onDelete={() => exp.remove(e.id)}
                L={L}
              />
            ))}
            <Button
              variant="outline"
              style={{ fontSize: 12, padding: "7px 12px" }}
              onClick={exp.add}
            >
              <Plus size={12} /> {L.addExp}
            </Button>
          </SectionCard>

          <SectionCard title={L.organization} icon={Users} defaultOpen={false}>
            {data.organizations.map((o) => (
              <OrgItem
                key={o.id}
                item={o}
                onChange={(updated) => org.update(o.id, updated)}
                onDelete={() => org.remove(o.id)}
                L={L}
              />
            ))}
            <Button
              variant="outline"
              style={{ fontSize: 12, padding: "7px 12px" }}
              onClick={org.add}
            >
              <Plus size={12} /> {L.addOrg}
            </Button>
          </SectionCard>

          <SectionCard
            title={L.volunteer}
            icon={HeartHandshake}
            defaultOpen={false}
          >
            {data.volunteers.map((v) => (
              <VolunteerItem
                key={v.id}
                item={v}
                onChange={(updated) => vol.update(v.id, updated)}
                onDelete={() => vol.remove(v.id)}
                L={L}
              />
            ))}
            <Button
              variant="outline"
              style={{ fontSize: 12, padding: "7px 12px" }}
              onClick={vol.add}
            >
              <Plus size={12} /> {L.addVolunteer}
            </Button>
          </SectionCard>

          <SectionCard
            title={L.education}
            icon={GraduationCap}
            defaultOpen={false}
          >
            {data.education.map((e) => (
              <EduItem
                key={e.id}
                item={e}
                onChange={(updated) => edu.update(e.id, updated)}
                onDelete={() => edu.remove(e.id)}
                L={L}
              />
            ))}
            <Button
              variant="outline"
              style={{ fontSize: 12, padding: "7px 12px" }}
              onClick={edu.add}
            >
              <Plus size={12} /> {L.addEdu}
            </Button>
          </SectionCard>

          <SectionCard title={L.awards} icon={Award} defaultOpen={false}>
            {data.awards.map((a) => (
              <AwardItem
                key={a.id}
                item={a}
                onChange={(updated) => aw.update(a.id, updated)}
                onDelete={() => aw.remove(a.id)}
                L={L}
              />
            ))}
            <Button
              variant="outline"
              style={{ fontSize: 12, padding: "7px 12px" }}
              onClick={aw.add}
            >
              <Plus size={12} /> {L.addAward}
            </Button>
          </SectionCard>

          <SectionCard
            title={L.certifications}
            icon={BadgeCheck}
            defaultOpen={false}
          >
            {(data.certifications || []).map((c) => (
              <CertItem
                key={c.id}
                item={c}
                onChange={(updated) => cert.update(c.id, updated)}
                onDelete={() => cert.remove(c.id)}
                L={L}
              />
            ))}
            <Button
              variant="outline"
              style={{ fontSize: 12, padding: "7px 12px" }}
              onClick={cert.add}
            >
              <Plus size={12} /> {L.addCert}
            </Button>
          </SectionCard>

          <SectionCard title={L.skills} icon={Star} defaultOpen={false}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 10,
              }}
            >
              {data.skills.map((sk) => (
                <span
                  key={sk}
                  style={{
                    fontSize: 12,
                    background: T.accentSoft,
                    color: T.accent,
                    padding: "5px 8px 5px 12px",
                    borderRadius: 99,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {sk}
                  <button
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        skills: prev.skills.filter((s) => s !== sk),
                      }))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: T.accent,
                      fontSize: 15,
                      lineHeight: 1,
                      padding: 0,
                      display: "flex",
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder={L.skillPlaceholder}
                style={{
                  flex: 1,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 12.5,
                  fontFamily: "'Poppins', sans-serif",
                  background: "rgba(255,255,255,0.6)",
                  outline: "none",
                  color: T.ink,
                }}
              />
              <Button
                variant="outline"
                style={{ fontSize: 12, padding: "7px 12px" }}
                onClick={addSkill}
              >
                <Plus size={12} />
              </Button>
            </div>
          </SectionCard>
        </div>

        {/* ====== KANAN: tombol di atas fixed, preview scroll sendiri ====== */}
        <div
          style={{
            display: layarKecil && tabHp !== "pratinjau" ? "none" : "flex",
            flexDirection: "column",
            minHeight: 0,
            minWidth: 0,
          }}
        >
          {/* Topbar tombol — tidak ikut scroll */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 12,
              flexShrink: 0,
              background: "rgba(250,251,253,0.9)",
              backdropFilter: "blur(8px)",
              borderRadius: 14,
              padding: layarKecil ? "10px 12px" : "10px 14px",
              border: `1px solid ${T.border}`,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
                {L.previewLabel}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: saveMsg ? T.teal : T.inkFaint,
                  marginTop: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {saving ? (
                  <>
                    <Loader2
                      size={10}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    {lang === "ID" ? "Menyimpan..." : "Saving..."}
                  </>
                ) : saveMsg ? (
                  saveMsg
                ) : (
                  L.pdfSubtitle
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* Toggle bahasa CV */}
              <div
                style={{
                  display: "flex",
                  background: "rgba(0,0,0,0.05)",
                  borderRadius: 10,
                  padding: 3,
                  gap: 2,
                }}
              >
                {["ID", "EN"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    style={{
                      padding: "5px 11px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "'Poppins', sans-serif",
                      background: lang === l ? "#fff" : "transparent",
                      color: lang === l ? T.accent : T.inkSoft,
                      boxShadow:
                        lang === l ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                      transition: "all .15s",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={handleManualSave}
                disabled={saving}
                style={{ fontSize: 12, padding: "8px 12px" }}
              >
                {saving ? (
                  <Loader2
                    size={13}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Save size={13} />
                )}{" "}
                {lang === "ID" ? "Simpan" : "Save"}
              </Button>
              <Button
                variant="primary"
                onClick={handleDownload}
                disabled={downloading}
                style={{ fontSize: 12.5, padding: "10px 18px" }}
              >
                {downloading ? (
                  <>
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    {L.generatingBtn}
                  </>
                ) : (
                  <>
                    <Download size={14} /> {L.downloadBtn}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Warning: perubahan belum tersimpan */}
          {dirty && user && supabaseConfigured && (
            <Glass
              style={{
                padding: "10px 14px",
                marginBottom: 12,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
              }}
            >
              <AlertTriangle
                size={15}
                color="#B45309"
                style={{ flexShrink: 0 }}
              />
              <div style={{ fontSize: 12, color: "#92400E", lineHeight: 1.4 }}>
                {lang === "ID"
                  ? "Ada perubahan yang belum disimpan. Klik "
                  : "You have unsaved changes. Click "}
                <strong>{lang === "ID" ? "Simpan" : "Save"}</strong>
                {lang === "ID"
                  ? " agar data terakhir tidak hilang."
                  : " so your latest data isn't lost."}
              </div>
            </Glass>
          )}

          {/* Scroll container preview */}
          <div
            style={{
              flex: 1,
              overflowY: layarKecil ? "visible" : "auto",
              minHeight: 0,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              background: "#e8e8e8",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <PratinjauBerhalaman>
              <CVPreview data={data} L={L} />
            </PratinjauBerhalaman>
          </div>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </LangContext.Provider>
  );
}
