import React, { useState, useEffect, useMemo } from "react";
import { Search, Target, Check } from "lucide-react";
import { T } from "../../theme";
import { useJobs } from "../../context/JobsContext";
import { useUserProfile } from "../../context/UserProfileContext";
import { useAuth } from "../../context/AuthContext";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import {
  rankJobs,
  persenKecocokan,
  detectCategory,
  alasanKecocokan,
} from "../../utils/jobMatching";
import { Glass } from "../../components/ui/Glass";
import { JobRow } from "../../components/JobRow";
import { Pagination } from "../../components/Pagination";
import { useApplications } from "../../hooks/useApplications";
import { useLangganan } from "../../hooks/useLangganan";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { GerbangFitur, BilahLangganan } from "../../components/GerbangFitur";
import DataSourceBanner from "../../components/DataSourceBanner";

const JOBS_PER_PAGE = 10;

// Label yang ditampilkan di tombol filter, biar teksnya rapi (bukan cuma
// nampilin nilai mentah kayak "fulltime" apa adanya).
const LOKASI_LABELS = {
  Semua: "Semua",
  onsite: "Onsite",
  remote: "Remote",
  hybrid: "Hybrid",
};
// Key = nilai persis di kolom employment_type database
const TIPE_KERJA_LABELS = {
  Semua: "Semua",
  "full-time": "Full-time",
  kontrak: "Kontrak",
  freelance: "Freelance",
  magang: "Magang",
};

// Kota-kota besar Indonesia, diprioritaskan di urutan atas daftar filter.
// Loker di pasar kerja Indonesia terpusat di kota-kota ini, jadi
// menaruhnya di depan menghemat gulir untuk mayoritas pengguna.
const KOTA_PRIORITAS = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Medan",
  "Makassar",
  "Denpasar",
  "Tangerang",
  "Bekasi",
  "Depok",
  "Bogor",
  "Malang",
  "Solo",
  "Palembang",
];

/**
 * Menormalkan teks lokasi mentah jadi nama kota yang bisa disaring.
 * Data lokasi sering berupa "Jakarta Selatan, Indonesia" atau
 * "Bandung, Jawa Barat" — dipangkas ke nama kota utamanya.
 */
function normalkanKota(lokasi) {
  if (!lokasi) return null;
  const teks = String(lokasi).trim();
  if (!teks || /tidak disebutkan|unknown|n\/a|-/i.test(teks.toLowerCase()))
    return null;

  // Kalau mengandung nama kota prioritas di mana pun, pakai itu — supaya
  // "Jakarta Selatan", "Kota Jakarta", "DKI Jakarta" semua jadi "Jakarta".
  const cocok = KOTA_PRIORITAS.find((k) =>
    teks.toLowerCase().includes(k.toLowerCase()),
  );
  if (cocok) return cocok;

  // Selain itu, ambil bagian pertama sebelum koma sebagai nama kota apa
  // adanya. Batas panjang dilonggarkan supaya nama daerah yang agak
  // panjang tetap masuk, bukan dibuang jadi null.
  const bagian = teks.split(/[,\-–|]/)[0].trim();
  return bagian.length >= 2 && bagian.length <= 40 ? bagian : null;
}

// Gabungkan array bullet desc (string / array) jadi satu string aman
function joinDesc(desc) {
  if (Array.isArray(desc)) return desc.join(" ");
  return desc || "";
}

// Ubah cv_json (dari CV Builder) jadi satu blob teks referensi tambahan
// buat matching — makin lengkap CV-nya, makin akurat rekomendasi lokernya.
function cvJsonToText(cv) {
  if (!cv) return "";
  const parts = [];

  (cv.experiences || []).forEach((e) => {
    parts.push(e.role, e.company, joinDesc(e.desc));
  });
  (cv.organizations || []).forEach((o) => {
    parts.push(o.role, o.org, joinDesc(o.desc));
  });
  (cv.volunteers || []).forEach((v) => {
    parts.push(v.role, v.org, joinDesc(v.desc));
  });
  (cv.education || []).forEach((e) => {
    parts.push(e.degree, e.school, joinDesc(e.desc));
  });
  (cv.certifications || []).forEach((c) => {
    parts.push(c.name, c.issuer);
  });
  (cv.awards || []).forEach((a) => {
    parts.push(a.title, a.issuer);
  });
  if (Array.isArray(cv.skills)) parts.push(cv.skills.join(" "));
  if (cv.headline) parts.push(cv.headline);
  if (cv.summary) parts.push(cv.summary);

  return parts.filter(Boolean).join(" ");
}

export function JobFinderPanel({ setActive }) {
  const { jobs, loading } = useJobs();
  const { skills, summary, cvText } = useUserProfile();
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedJobs();
  const { tambah: tambahLamaran, sudahDilamar } = useApplications();
  const langganan = useLangganan();
  const hp = useLayarKecil(600);
  const keParket = () => setActive?.("paket");

  // Tanpa langganan, hanya sebagian loker yang DIRENDER.
  // Sisanya tidak masuk DOM sama sekali, bukan sekadar disembunyikan.
  const BATAS_GRATIS = 5;

  // Catat loker sebagai lamaran. Data loker disalin, bukan direferensikan,
  // supaya riwayat tetap utuh walau loker aslinya hilang dari scraper.
  const [toast, setToast] = useState("");
  const handleLamar = async (job) => {
    await tambahLamaran({
      job_id: job.id,
      posisi: job.posisi,
      perusahaan: job.perusahaan,
      lokasi: job.lokasi,
      link: job.link,
    });
    // Konfirmasi ke mana loker ini pergi. Tanpa ini user menekan tombol
    // lalu bingung apa yang terjadi — sumber ambiguitas tombolnya.
    setToast("Tersimpan ke menu Applications untuk kamu lacak.");
    setTimeout(() => setToast(""), 3500);
  };
  const [query, setQuery] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("Semua");
  const [filterKota, setFilterKota] = useState("Semua");
  const [filterTipeKerja, setFilterTipeKerja] = useState("Semua");
  const [page, setPage] = useState(1);
  const lokasiOptions = Object.keys(LOKASI_LABELS);

  // Daftar kota dibangun dari loker yang benar-benar ada. Kota prioritas
  // yang muncul di data ditaruh di depan, sisanya menyusul urut abjad —
  // jadi filter tidak pernah menampilkan kota yang tak punya satu loker pun.
  const kotaOptions = useMemo(() => {
    const ada = new Set();
    jobs.forEach((j) => {
      const kota = normalkanKota(j.lokasi);
      if (kota) ada.add(kota);
    });
    const prioritas = KOTA_PRIORITAS.filter((k) => ada.has(k));
    const lain = [...ada]
      .filter((k) => !KOTA_PRIORITAS.includes(k))
      .sort((a, b) => a.localeCompare(b, "id"));
    const hasil = ["Semua", ...prioritas, ...lain];
    // DIAGNOSTIK sementara — hapus setelah filter terbukti muncul.
    if (jobs.length > 0) {
      console.log(
        `[jobfinder] ${jobs.length} loker, ${hasil.length - 1} kota terdeteksi:`,
        hasil.slice(1, 8),
      );
    }
    return hasil;
  }, [jobs]);
  const tipeKerjaOptions = Object.keys(TIPE_KERJA_LABELS);

  // Referensi tambahan dari CV Builder (cv_json) — pengalaman kerja,
  // organisasi, volunteer, pendidikan, sertifikasi, penghargaan.
  const [cvProfileText, setCvProfileText] = useState("");
  useEffect(() => {
    if (!user || !supabaseConfigured) return;
    supabase
      .from("profiles")
      .select("cv_json")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data: row }) => {
        setCvProfileText(cvJsonToText(row?.cv_json));
      });
  }, [user?.id]);

  // Gabungan skill + ringkasan profil + CV mentah + data CV Builder — makin
  // lengkap kamu isi Profil Karier / CV Builder, makin akurat penyaringan
  // lokernya.
  const profileText = [skills.join(" "), summary, cvText, cvProfileText]
    .join(" ")
    .trim();
  const hasProfile = profileText.length > 0;
  const [matchOnly, setMatchOnly] = useState(hasProfile);

  // Ranking berdasarkan overlap kata kunci skill + CV vs posisi/deskripsi loker
  // Kategori bidang dari profil — dipakai sebagai sinyal utama pencocokan
  const kategori = hasProfile ? detectCategory(profileText) : null;

  const ranked = hasProfile
    ? rankJobs(jobs, profileText, jobs.length, kategori)
    : jobs.map((j) => ({
        ...j,
        score: 0,
        skorInti: 0,
        kategoriLoker: null,
        matchedTerms: [],
        matchedKategori: [],
      }));

  // Minimal skor 2 buat lolos filter "Sesuai Keahlianku" - artinya harus
  // match di judul (bobot 2) atau kolom skill (bobot 3), atau minimal 2
  // kata match di deskripsi. Skor 1 (cuma satu kata nyangkut di deskripsi
  // doang) dianggap sinyal terlalu lemah, gampang salah lolos untuk loker
  // yang sebenernya nggak relevan.
  const MIN_MATCH_SCORE = 2;
  // Kalau filter kecocokan dimatikan, tampilkan seluruh katalog —
  // rankJobs membuang skor 0, jadi ambil dari `jobs` langsung.
  const base =
    matchOnly && hasProfile
      ? ranked.filter((j) => j.skorInti >= MIN_MATCH_SCORE)
      : hasProfile
        ? jobs.map(
            (j) =>
              ranked.find((r) => r.id === j.id) || {
                ...j,
                score: 0,
                skorInti: 0,
                kategoriLoker: null,
                matchedTerms: [],
                matchedKategori: [],
              },
          )
        : ranked;

  const filtered = base
    .filter(
      (j) =>
        (filterLokasi === "Semua" || j.lokasiKerja === filterLokasi) &&
        (filterTipeKerja === "Semua" || j.tipeKerja === filterTipeKerja) &&
        (filterKota === "Semua" || normalkanKota(j.lokasi) === filterKota) &&
        (query.trim() === "" ||
          (j.posisi + j.perusahaan)
            .toLowerCase()
            .includes(query.toLowerCase())),
    )
    .map((j) =>
      matchOnly && hasProfile && j.skorInti >= MIN_MATCH_SCORE
        ? {
            ...j,
            alasan: `${persenKecocokan(j.skorInti)}% cocok — bidang ${
              j.kategoriLoker || "serupa"
            }${
              j.matchedKategori.length
                ? ` · ${alasanKecocokan(j.matchedTerms, 4, j.matchedKategori).join(", ")}`
                : ""
            }`,
          }
        : j,
    );

  // Balik ke halaman 1 tiap kali filter/pencarian berubah, biar nggak
  // nyangkut di halaman yang jadi kosong setelah hasilnya berubah.
  useEffect(() => {
    setPage(1);
  }, [
    query,
    filterLokasi,
    filterKota,
    filterTipeKerja,
    matchOnly,
    jobs.length,
  ]);

  // Belum langganan: hanya BATAS_GRATIS loker teratas yang boleh dirender.
  const bolehLihat = langganan.aktif
    ? filtered
    : filtered.slice(0, BATAS_GRATIS);
  const sisaTerkunci = Math.max(0, filtered.length - BATAS_GRATIS);

  const totalPages = Math.max(1, Math.ceil(bolehLihat.length / JOBS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = bolehLihat.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  return (
    <div style={{ padding: hp ? "16px 14px" : 28 }}>
      <BilahLangganan langganan={langganan} onLangganan={keParket} />
      <DataSourceBanner />

      {/* Konfirmasi melayang setelah menyimpan lamaran */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            background: T.ink,
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 500,
            padding: "11px 18px",
            borderRadius: 12,
            boxShadow: "0 8px 28px rgba(0,0,0,0.22)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            maxWidth: "90vw",
          }}
        >
          <Check size={14} color={T.teal} />
          {toast}
        </div>
      )}
      {!hasProfile && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12.5,
            color: T.inkSoft,
            background: "rgba(255,255,255,0.5)",
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 16,
          }}
        >
          <Target size={14} color={T.accent} />
          Tambahkan skill di halaman Profil Karier, lengkapi CV di CV Builder,
          atau paste CV di halaman Cari Arah Karier, biar loker di sini bisa
          disaring sesuai keahlianmu.
        </div>
      )}
      <Glass
        style={{
          padding: 16,
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: "9px 14px",
            background: "rgba(255,255,255,0.6)",
          }}
        >
          <Search size={15} color={T.inkFaint} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari posisi atau perusahaan..."
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              fontSize: 13,
              fontFamily: "'Poppins', sans-serif",
              background: "transparent",
              color: T.ink,
            }}
          />
        </div>
        {/* Filter kota — dropdown karena jumlah kota bisa puluhan.
            Muncul begitu ada minimal satu kota di data. Sebelumnya
            ambangnya > 2 dan bergantung katalog yang sudah dimuat penuh,
            sehingga saat data belum siap (mis. baru buka halaman) filter
            tidak pernah tampil. */}
        {kotaOptions.length > 1 && (
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
              Kota
            </div>
            <select
              value={filterKota}
              onChange={(e) => setFilterKota(e.target.value)}
              style={{
                width: "100%",
                maxWidth: 260,
                padding: "9px 12px",
                borderRadius: 10,
                border: `1px solid ${filterKota !== "Semua" ? T.accent : T.border}`,
                background:
                  filterKota !== "Semua"
                    ? T.accentSoft
                    : "rgba(255,255,255,0.6)",
                color: filterKota !== "Semua" ? T.accent : T.ink,
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {kotaOptions.map((k) => (
                <option key={k} value={k}>
                  {k === "Semua" ? "Semua kota" : k}
                </option>
              ))}
            </select>
          </div>
        )}

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
            Lokasi
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {lokasiOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilterLokasi(opt)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 99,
                  border: `1px solid ${filterLokasi === opt ? T.accent : T.border}`,
                  background:
                    filterLokasi === opt ? T.accentSoft : "transparent",
                  color: filterLokasi === opt ? T.accent : T.inkSoft,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {LOKASI_LABELS[opt]}
              </button>
            ))}
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
            Tipe Kerja
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tipeKerjaOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilterTipeKerja(opt)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 99,
                  border: `1px solid ${filterTipeKerja === opt ? T.accent : T.border}`,
                  background:
                    filterTipeKerja === opt ? T.accentSoft : "transparent",
                  color: filterTipeKerja === opt ? T.accent : T.inkSoft,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {TIPE_KERJA_LABELS[opt]}
              </button>
            ))}
          </div>
        </div>
      </Glass>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 13, color: T.inkSoft }}>
          {loading
            ? "Memuat..."
            : filtered.length === 0
              ? "0 loker ditemukan"
              : `Menampilkan ${(currentPage - 1) * JOBS_PER_PAGE + 1}\u2013${Math.min(
                  currentPage * JOBS_PER_PAGE,
                  filtered.length,
                )} dari ${filtered.length} loker`}
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            background: "rgba(255,255,255,0.5)",
            border: `1px solid ${T.border}`,
            borderRadius: 99,
            padding: 3,
          }}
        >
          <button
            onClick={() => setMatchOnly(true)}
            disabled={!hasProfile}
            style={{
              padding: "6px 13px",
              borderRadius: 99,
              border: "none",
              background: matchOnly ? T.accent : "transparent",
              color: matchOnly ? "#fff" : T.inkSoft,
              fontSize: 12,
              fontWeight: 600,
              cursor: hasProfile ? "pointer" : "not-allowed",
              fontFamily: "'Poppins', sans-serif",
              opacity: hasProfile ? 1 : 0.5,
            }}
          >
            Sesuai Keahlianku
          </button>
          <button
            onClick={() => setMatchOnly(false)}
            style={{
              padding: "6px 13px",
              borderRadius: 99,
              border: "none",
              background: !matchOnly ? T.accent : "transparent",
              color: !matchOnly ? "#fff" : T.inkSoft,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Semua Loker
          </button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {paginated.map((j) => (
          <JobRow
            key={j.id}
            job={j}
            locked={false}
            saved={isSaved(j.id)}
            onToggleSave={toggleSave}
            onLamar={handleLamar}
            sudahDilamar={sudahDilamar(j.id)}
          />
        ))}
        {!loading && filtered.length === 0 && (
          <div
            style={{
              fontSize: 13,
              color: T.inkFaint,
              textAlign: "center",
              padding: 40,
            }}
          >
            {matchOnly && hasProfile
              ? "Belum ada loker yang cocok sama keahlianmu. Coba tambah skill lagi atau lihat Semua Loker."
              : "Nggak ada loker yang cocok dengan pencarianmu."}
          </div>
        )}
      </div>
      {/* Gerbang langganan. Loker yang terkunci tidak dirender sama sekali,
          jadi tidak ada yang bisa diambil lewat DevTools. */}
      {!loading && !langganan.aktif && sisaTerkunci > 0 && (
        <div style={{ marginTop: 14 }}>
          <GerbangFitur
            terbuka={false}
            tinggiMinimal={180}
            judul={`${sisaTerkunci} loker lainnya masih terkunci`}
            keterangan="Berlangganan untuk membuka seluruh loker yang cocok dengan profilmu, plus analisis AI, CV Builder, dan LinkedIn Builder."
            onLangganan={keParket}
          />
        </div>
      )}

      {!loading && langganan.aktif && bolehLihat.length > JOBS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setPage}
        />
      )}
    </div>
  );
}
