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
} from "../../utils/jobMatching";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { useToast } from "../../components/publik/PublicLayout";
import { useApplications } from "../../hooks/useApplications";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { KartuKunci, InfoKuotaLoker } from "../../components/publik/LokerTerkunci";
import { useMuatOtomatis, usePintasanCari } from "../../utils/interaksi";

// Kelipatan 4 supaya baris terakhir grid 4 kolom selalu penuh
const PER_MUAT = 24;

const LOKASI = [
  ["Semua", "Semua lokasi"],
  ["remote", "Remote"],
  ["onsite", "Di kantor"],
  ["hybrid", "Hybrid"],
];
// Kunci = nilai persis di kolom employment_type database
const TIPE = [
  ["Semua", "Semua tipe"],
  ["full-time", "Full time"],
  ["kontrak", "Kontrak"],
  ["freelance", "Freelance"],
  ["magang", "Magang"],
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
  const { jobs, loading } = useJobs();
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
    toast("Dicatat di Lamaran saya");
  };

  // Daftar kota dari loker yang benar-benar ada; kota besar di depan
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
    return [...prioritas, ...lain];
  }, [jobs]);

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

  const ranked = useMemo(
    () => (hasProfile ? rankJobs(jobs, profileText, jobs.length, kategori) : jobs.map(tanpaSkor)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jobs, profileText, hasProfile],
  );

  const filtered = useMemo(() => {
    let base;
    if (matchOnly && hasProfile) {
      base = ranked.filter((j) => j.skorInti >= MIN_MATCH_SCORE);
    } else if (hasProfile) {
      // rankJobs membuang skor 0, jadi ambil katalog lengkap dari `jobs`
      const peta = new Map(ranked.map((r) => [r.id, r]));
      base = jobs.map((j) => peta.get(j.id) || tanpaSkor(j));
    } else {
      base = ranked;
    }
    const q = query.trim().toLowerCase();
    return base.filter(
      (j) =>
        (filterLokasi === "Semua" || j.lokasiKerja === filterLokasi) &&
        (filterTipe === "Semua" || j.tipeKerja === filterTipe) &&
        (filterKota === "Semua" || normalkanKota(j.lokasi) === filterKota) &&
        (!q || `${j.posisi} ${j.perusahaan}`.toLowerCase().includes(q)),
    );
  }, [ranked, jobs, matchOnly, hasProfile, query, filterLokasi, filterTipe, filterKota]);

  useMuatOtomatis(sentinel, !loading && filtered.length > tampil, () =>
    setTampil((n) => n + PER_MUAT),
  );

  useEffect(() => {
    setTampil(PER_MUAT);
  }, [query, filterLokasi, filterKota, filterTipe, matchOnly, jobs.length]);

  const infoCocok = (j) => {
    if (!hasProfile || !(j.skorInti >= MIN_MATCH_SCORE)) return null;
    const alasan = alasanKecocokan(j.matchedTerms, 4, j.matchedKategori);
    return {
      persen: persenKecocokan(j.skorInti),
      alasan: [j.kategoriLoker ? `Bidang ${j.kategoriLoker}` : null, alasan.length ? alasan.join(", ") : null]
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
            Loker belum bisa diurutkan sesuai keahlianmu. Isi skill di{" "}
            <button type="button" onClick={() => setActive?.("profile")}>
              Profil karier
            </button>
            , lengkapi{" "}
            <button type="button" onClick={() => setActive?.("cvbuilder")}>
              CV Builder
            </button>
            , atau unggah CV di{" "}
            <button type="button" onClick={() => setActive?.("overview")}>
              Review CV
            </button>
            .
          </div>
        </div>
      )}

      <div className="pb-filterbar" style={{ top: "var(--head)" }}>
        <div className="pb-filter-row">
          <label className="pb-input">
            <Search size={17} color="var(--muted)" aria-hidden="true" />
            <span className="pb-sr">Cari loker</span>
            <input
              id="cari-cocok"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari posisi atau perusahaan"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
                style={{ border: 0, background: "none", cursor: "pointer", color: "var(--muted)", display: "flex" }}
              >
                <X size={16} />
              </button>
            )}
          </label>
          <label className="pb-sr" htmlFor="kota-cocok">
            Kota
          </label>
          <select id="kota-cocok" className="pb-select" value={filterKota} onChange={(e) => setFilterKota(e.target.value)}>
            <option value="Semua">Semua kota</option>
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
            "Memuat lowongan…"
          ) : (
            <>
              <b>{filtered.length.toLocaleString("id-ID")}</b>{" "}
              {matchOnly && hasProfile ? "loker cocok dengan profilmu" : "lowongan"}
              {adaFilter && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={reset}
                    style={{ border: 0, background: "none", padding: 0, font: "inherit", color: "var(--brand)", fontWeight: 600, cursor: "pointer" }}
                  >
                    Hapus filter
                  </button>
                </>
              )}
            </>
          )}
        </span>
        <div className="pb-seg" role="group" aria-label="Tampilkan">
          <button
            type="button"
            className={matchOnly && hasProfile ? "on" : ""}
            aria-pressed={matchOnly && hasProfile}
            disabled={!hasProfile}
            onClick={() => setMatchOnly(true)}
            style={!hasProfile ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            title={!hasProfile ? "Lengkapi profil atau CV dulu" : undefined}
          >
            Sesuai keahlianku
          </button>
          <button
            type="button"
            className={!(matchOnly && hasProfile) ? "on" : ""}
            aria-pressed={!(matchOnly && hasProfile)}
            onClick={() => setMatchOnly(false)}
          >
            Semua loker
          </button>
        </div>
      </div>

      <div className="pb-grid">
        {loading && Array.from({ length: 8 }, (_, i) => <KartuLokerSkeleton key={i} />)}

        {!loading &&
          filtered.slice(0, tampil).map((j) => (
            <KartuLoker
              key={j.id}
              job={j}
              cocok={matchOnly ? infoCocok(j) : null}
              onLacak={lacak}
              dilamar={sudahDilamar(j.id)}
              onToast={toast}
            />
          ))}

        {!loading && filtered.length === 0 && (
          <div className="pb-empty">
            <h3>{matchOnly && hasProfile ? "Belum ada loker yang cocok" : "Tidak ada loker yang sesuai"}</h3>
            <p style={{ margin: "0 0 18px" }}>
              {matchOnly && hasProfile
                ? "Tambah skill di Profil karier, atau lihat semua loker."
                : "Coba kata kunci yang lebih umum, atau longgarkan filternya."}
            </p>
            {matchOnly && hasProfile ? (
              <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={() => setMatchOnly(false)}>
                Lihat semua loker
              </button>
            ) : (
              adaFilter && (
                <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={reset}>
                  Hapus filter
                </button>
              )
            )}
          </div>
        )}
      </div>

      {!loading && filtered.length > tampil && (
        <div className="pb-more" ref={sentinel}>
          <button type="button" className="pb-btn pb-btn-outline" onClick={() => setTampil((n) => n + PER_MUAT)}>
            Muat lebih banyak
          </button>
          Menampilkan {tampil.toLocaleString("id-ID")} dari {filtered.length.toLocaleString("id-ID")}
        </div>
      )}
      {!loading && filtered.length <= tampil && (
        <div className="pb-grid" style={{ marginTop: 18 }}>
          <KartuKunci />
        </div>
      )}
      {!loading && filtered.length > 0 && filtered.length <= tampil && (
        <div className="pb-more">Semua loker yang terbuka sudah ditampilkan.</div>
      )}

      {elemenToast}
    </div>
  );
}
