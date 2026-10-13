import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { useJobs } from "../../context/JobsContext";
import { useUserProfile } from "../../context/UserProfileContext";
import { useAuth } from "../../context/AuthContext";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import {
  rankJobs,
  persenKecocokan,
  detectCategory,
  alasanKecocokan,
  kataKunciPencarian,
} from "../../utils/jobMatching";
import { useDaftarLoker, useKandidatLoker, useTunda } from "../../hooks/useLoker";
import { KOTA_POPULER } from "../../data/kota";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { useToast } from "../../components/publik/PublicLayout";
import { useApplications } from "../../hooks/useApplications";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { KartuKunci, InfoKuotaLoker } from "../../components/publik/LokerTerkunci";
import { useMuatOtomatis, usePintasanCari } from "../../utils/interaksi";
import { lokal, t } from "../../i18n.js";
import { labelTampil } from "../../data/taxonomy.js";

// Kelipatan 4 supaya baris terakhir grid 4 kolom selalu penuh
const PER_MUAT = 24;

const LOKASI = [
  ["Semua", t("Semua lokasi", "All locations")],
  ["remote", "Remote"],
  ["onsite", t("Di kantor", "On-site")],
  ["hybrid", "Hybrid"],
];
// Kunci = nilai persis di kolom employment_type database
const TIPE = [
  ["Semua", t("Semua tipe", "All types")],
  ["full-time", t("Full time", "Full-time")],
  ["kontrak", t("Kontrak", "Contract")],
  ["freelance", "Freelance"],
  ["magang", t("Magang", "Internship")],
];

// Kota-kota besar Indonesia, diprioritaskan di urutan atas daftar filter.
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
 * "Jakarta Selatan, Indonesia" → "Jakarta"; "Bandung, Jawa Barat" → "Bandung".
 */
function normalkanKota(lokasi) {
  if (!lokasi) return null;
  const teks = String(lokasi).trim();
  if (!teks || /tidak disebutkan|unknown|n\/a|-/i.test(teks.toLowerCase())) return null;
  const cocok = KOTA_PRIORITAS.find((k) => teks.toLowerCase().includes(k.toLowerCase()));
  if (cocok) return cocok;
  const bagian = teks.split(/[,\-–|]/)[0].trim();
  return bagian.length >= 2 && bagian.length <= 40 ? bagian : null;
}

function joinDesc(desc) {
  if (Array.isArray(desc)) return desc.join(" ");
  return desc || "";
}

// cv_json dari CV Builder → teks referensi tambahan untuk pencocokan
function cvJsonToText(cv) {
  if (!cv) return "";
  const parts = [];
  (cv.experiences || []).forEach((e) => parts.push(e.role, e.company, joinDesc(e.desc)));
  (cv.organizations || []).forEach((o) => parts.push(o.role, o.org, joinDesc(o.desc)));
  (cv.volunteers || []).forEach((v) => parts.push(v.role, v.org, joinDesc(v.desc)));
  (cv.education || []).forEach((e) => parts.push(e.degree, e.school, joinDesc(e.desc)));
  (cv.certifications || []).forEach((c) => parts.push(c.name, c.issuer));
  (cv.awards || []).forEach((a) => parts.push(a.title, a.issuer));
  if (Array.isArray(cv.skills)) parts.push(cv.skills.join(" "));
  if (cv.headline) parts.push(cv.headline);
  if (cv.summary) parts.push(cv.summary);
  return parts.filter(Boolean).join(" ");
}

// Skor minimal untuk lolos "Sesuai keahlianku": cocok di judul (bobot 2)
// atau kolom skill (bobot 3), atau minimal 2 kata di deskripsi.
const MIN_MATCH_SCORE = 2;

const tanpaSkor = (j) => ({
  ...j,
  score: 0,
  skorInti: 0,
  kategoriLoker: null,
  matchedTerms: [],
  matchedKategori: [],
});

export function JobFinderPanel({ setActive }) {
  useJobs();
  const { skills, summary, cvText } = useUserProfile();
  const { user } = useAuth();
  const { tambah: tambahLamaran, sudahDilamar } = useApplications();
  const hp = useLayarKecil(600);
  const sentinel = useRef(null);
  usePintasanCari("cari-cocok");
  const [toast, elemenToast] = useToast();

  const [query, setQuery] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("Semua");
  const [filterKota, setFilterKota] = useState("Semua");
  const [filterTipe, setFilterTipe] = useState("Semua");
  const [tampil, setTampil] = useState(PER_MUAT);

  // Catat loker sebagai lamaran. Data disalin, bukan direferensikan,
  // supaya riwayat tetap utuh walau lokernya hilang dari sumber.
  const lacak = async (job) => {
    await tambahLamaran({
      job_id: job.id,
      posisi: job.posisi,
      perusahaan: job.perusahaan,
      lokasi: job.lokasi,
      link: job.link,
    });
    toast(t("Dicatat di Lamaran saya", "Logged in My applications"));
  };

  const kotaOptions = KOTA_POPULER;

  // Teks referensi tambahan dari CV Builder
  const [cvProfileText, setCvProfileText] = useState("");
  useEffect(() => {
    if (!user || !supabaseConfigured) return;
    supabase
      .from("profiles")
      .select("cv_json")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data: row }) => setCvProfileText(cvJsonToText(row?.cv_json)));
  }, [user?.id]);

  // Skill + ringkasan + CV mentah + CV Builder: makin lengkap, makin akurat
  const profileText = [skills.join(" "), summary, cvText, cvProfileText].join(" ").trim();
  const hasProfile = profileText.length > 0;
  const [matchOnly, setMatchOnly] = useState(hasProfile);
  useEffect(() => {
    if (hasProfile) setMatchOnly(true);
  }, [hasProfile]);

  const kategori = hasProfile ? detectCategory(profileText) : null;
  const modeCocok = matchOnly && hasProfile;

  // Mode "Sesuai keahlianku": server mengirim kandidat yang judul/bidangnya
  // mengandung kata kunci profil (maks. ±200), lalu diurutkan di browser.
  const kataProfil = useMemo(
    () => (hasProfile ? kataKunciPencarian(profileText, skills) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profileText, hasProfile],
  );
  const kandidat = useKandidatLoker(kataProfil, { aktif: modeCocok });

  const ranked = useMemo(
    () => (modeCocok ? rankJobs(kandidat.jobs, profileText, kandidat.jobs.length, kategori) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kandidat.jobs, profileText, modeCocok],
  );

  const q = useTunda(query, 350);
  const filteredCocok = useMemo(() => {
    if (!modeCocok) return [];
    const kata = q.trim().toLowerCase();
    return ranked.filter(
      (j) =>
        j.skorInti >= MIN_MATCH_SCORE &&
        (filterLokasi === "Semua" || j.lokasiKerja === filterLokasi) &&
        (filterTipe === "Semua" || j.tipeKerja === filterTipe) &&
        (filterKota === "Semua" || normalkanKota(j.lokasi) === filterKota) &&
        (!kata || `${j.posisi} ${j.perusahaan}`.toLowerCase().includes(kata)),
    );
  }, [ranked, modeCocok, q, filterLokasi, filterTipe, filterKota]);

  // Mode "Semua loker": halaman demi halaman dari server
  const daftar = useDaftarLoker(
    {
      q: q.trim(),
      kota: filterKota === "Semua" ? "" : filterKota,
      lokasi: filterLokasi === "Semua" ? "" : filterLokasi,
      tipe: filterTipe === "Semua" ? "" : filterTipe,
    },
    { aktif: !modeCocok },
  );

  const loading = modeCocok ? kandidat.loading : daftar.loading;
  const filtered = modeCocok ? filteredCocok : daftar.jobs;
  const jumlah = modeCocok ? filteredCocok.length : daftar.total ?? 0;
  const adaLagi = modeCocok ? filteredCocok.length > tampil : daftar.adaLagi;
  const muatLagi = () => (modeCocok ? setTampil((n) => n + PER_MUAT) : daftar.muatLagi());
  const tampilkan = modeCocok ? filteredCocok.slice(0, tampil) : daftar.jobs;

  useMuatOtomatis(sentinel, !loading && adaLagi && !daftar.memuatLagi, muatLagi);

  useEffect(() => {
    setTampil(PER_MUAT);
  }, [query, filterLokasi, filterKota, filterTipe, matchOnly]);

  const infoCocok = (j) => {
    if (!hasProfile || !(j.skorInti >= MIN_MATCH_SCORE)) return null;
    const alasan = alasanKecocokan(j.matchedTerms, 4, j.matchedKategori);
    return {
      persen: persenKecocokan(j.skorInti),
      alasan: [j.kategoriLoker ? t(`Bidang ${j.kategoriLoker}`, `Field: ${labelTampil(j.kategoriLoker)}`) : null, alasan.length ? alasan.join(", ") : null]
        .filter(Boolean)
        .join(" · "),
    };
  };

  const adaFilter = query || filterLokasi !== "Semua" || filterTipe !== "Semua" || filterKota !== "Semua";
  const reset = () => {
    setQuery("");
    setFilterLokasi("Semua");
    setFilterTipe("Semua");
    setFilterKota("Semua");
  };

  return (
    <div style={{ padding: hp ? "0 16px" : "0 28px" }}>
      {!hasProfile && (
        <div className="pb-hint">
          <Sparkles size={18} />
          <div>
            {t("Loker belum bisa diurutkan sesuai keahlianmu. Isi skill di", "Jobs can't be matched to your skills yet. Add skills in")}{" "}
            <button type="button" onClick={() => setActive?.("profile")}>
              {t("Profil karier", "Career profile")}
            </button>
            {t(", lengkapi", ", complete the")}{" "}
            <button type="button" onClick={() => setActive?.("cvbuilder")}>
              CV Builder
            </button>
            {t(", atau unggah CV di", ", or upload a CV in")}{" "}
            <button type="button" onClick={() => setActive?.("overview")}>
              {t("Review CV", "CV Review")}
            </button>
            .
          </div>
        </div>
      )}

      <div className="pb-filterbar" style={{ top: "var(--head)" }}>
        <div className="pb-filter-row">
          <label className="pb-input">
            <Search size={17} color="var(--muted)" aria-hidden="true" />
            <span className="pb-sr">{t("Cari loker", "Find jobs")}</span>
            <input
              id="cari-cocok"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Cari posisi atau perusahaan", "Search role or company")}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("Hapus pencarian", "Clear search")}
                style={{ border: 0, background: "none", cursor: "pointer", color: "var(--muted)", display: "flex" }}
              >
                <X size={16} />
              </button>
            )}
          </label>
          <label className="pb-sr" htmlFor="kota-cocok">
            {t("Kota", "City")}
          </label>
          <select id="kota-cocok" className="pb-select" value={filterKota} onChange={(e) => setFilterKota(e.target.value)}>
            <option value="Semua">{t("Semua kota", "All cities")}</option>
            {kotaOptions.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className="pb-chips">
          {LOKASI.map(([v, l]) => (
            <button key={v} type="button" className={`pb-chip ${filterLokasi === v ? "on" : ""}`} onClick={() => setFilterLokasi(v)}>
              {l}
            </button>
          ))}
          <span className="pb-chip-sep" />
          {TIPE.map(([v, l]) => (
            <button key={v} type="button" className={`pb-chip ${filterTipe === v ? "on" : ""}`} onClick={() => setFilterTipe(v)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {!loading && <InfoKuotaLoker />}
      <div className="pb-toolbar">
        <span className="count">
          {loading ? (
            t("Memuat lowongan…", "Loading jobs…")
          ) : (
            <>
              <b>{jumlah.toLocaleString(lokal())}</b>{" "}
              {matchOnly && hasProfile ? t("loker cocok dengan profilmu", "jobs match your profile") : "lowongan"}
              {adaFilter && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={reset}
                    style={{ border: 0, background: "none", padding: 0, font: "inherit", color: "var(--brand)", fontWeight: 600, cursor: "pointer" }}
                  >
                    {t("Hapus filter", "Clear filters")}
                  </button>
                </>
              )}
            </>
          )}
        </span>
        <div className="pb-seg" role="group" aria-label={t("Tampilkan", "Show")}>
          <button
            type="button"
            className={matchOnly && hasProfile ? "on" : ""}
            aria-pressed={matchOnly && hasProfile}
            disabled={!hasProfile}
            onClick={() => setMatchOnly(true)}
            style={!hasProfile ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            title={!hasProfile ? t("Lengkapi profil atau CV dulu", "Complete your profile or CV first") : undefined}
          >
            {t("Sesuai keahlianku", "Matching my skills")}
          </button>
          <button
            type="button"
            className={!(matchOnly && hasProfile) ? "on" : ""}
            aria-pressed={!(matchOnly && hasProfile)}
            onClick={() => setMatchOnly(false)}
          >
            {t("Semua loker", "All jobs")}
          </button>
        </div>
      </div>

      <div className="pb-grid">
        {loading && Array.from({ length: 8 }, (_, i) => <KartuLokerSkeleton key={i} />)}

        {!loading &&
          tampilkan.map((j) => (
            <KartuLoker
              key={j.id}
              job={j}
              cocok={modeCocok ? infoCocok(j) : null}
              onLacak={lacak}
              dilamar={sudahDilamar(j.id)}
              onToast={toast}
            />
          ))}

        {!loading && filtered.length === 0 && (
          <div className="pb-empty">
            <h3>{matchOnly && hasProfile ? t("Belum ada loker yang cocok", "No matching jobs yet") : t("Tidak ada loker yang sesuai", "No jobs match")}</h3>
            <p style={{ margin: "0 0 18px" }}>
              {matchOnly && hasProfile
                ? t("Tambah skill di Profil karier, atau lihat semua loker.", "Add skills in Career profile, or browse all jobs.")
                : t("Coba kata kunci yang lebih umum, atau longgarkan filternya.", "Try a broader keyword, or loosen the filters.")}
            </p>
            {matchOnly && hasProfile ? (
              <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={() => setMatchOnly(false)}>
                {t("Lihat semua loker", "See all jobs")}
              </button>
            ) : (
              adaFilter && (
                <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={reset}>
                  {t("Hapus filter", "Clear filters")}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {!loading && adaLagi && (
        <div className="pb-more" ref={sentinel}>
          <button type="button" className="pb-btn pb-btn-outline" onClick={muatLagi} disabled={daftar.memuatLagi}>
            {daftar.memuatLagi ? t("Memuat…", "Loading…") : t("Muat lebih banyak", "Load more")}
          </button>
          {t("Menampilkan", "Showing")}{" "}{tampilkan.length.toLocaleString(lokal())} {t("dari", "of")} {jumlah.toLocaleString(lokal())}
        </div>
      )}
      {!loading && !adaLagi && !modeCocok && daftar.terkunci > 0 && (
        <div className="pb-grid" style={{ marginTop: 18 }}>
          <KartuKunci jumlah={daftar.terkunci} />
        </div>
      )}
      {!loading && !adaLagi && filtered.length > 0 && (
        <div className="pb-more">
          {modeCocok
            ? t("Itu semua loker yang cocok dengan profilmu. Lihat “Semua loker” untuk pilihan lain.", "That's every job matching your profile. Check “All jobs” for more.")
            : t("Semua loker yang terbuka sudah ditampilkan.", "All open jobs are shown.")}
        </div>
      )}

      {elemenToast}
    </div>
  );
}
