import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  PublicLayout,
  KOTA_POPULER,
  useToast,
} from "../../components/publik/PublicLayout";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { useJobs } from "../../context/JobsContext";
import {
  formatGaji,
  infoSumber,
  LABEL_LOKASI_KERJA,
  LABEL_TIPE_KERJA,
} from "../../utils/sumberLoker";

const PER_MUAT = 24;

const OPSI_LOKASI = [["", "Semua"], ...Object.entries(LABEL_LOKASI_KERJA)];
const OPSI_TIPE = [
  ["", "Semua"],
  ["full-time", LABEL_TIPE_KERJA["full-time"]],
  ["kontrak", LABEL_TIPE_KERJA.kontrak],
  ["magang", LABEL_TIPE_KERJA.magang],
  ["freelance", LABEL_TIPE_KERJA.freelance],
  ["part-time", LABEL_TIPE_KERJA["part-time"]],
];

function bacaUrl() {
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") || "",
    kota: p.get("kota") || "",
    lokasi: p.get("lokasi") || "",
    tipe: p.get("tipe") || "",
    sumber: p.get("sumber") || "",
    gaji: p.get("gaji") === "1",
    urut: p.get("urut") || "terbaru",
  };
}

function tulisUrl(f) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.kota) p.set("kota", f.kota);
  if (f.lokasi) p.set("lokasi", f.lokasi);
  if (f.tipe) p.set("tipe", f.tipe);
  if (f.sumber) p.set("sumber", f.sumber);
  if (f.gaji) p.set("gaji", "1");
  if (f.urut !== "terbaru") p.set("urut", f.urut);
  const s = p.toString();
  // replaceState: mengetik di kolom cari tidak menumpuk riwayat "Kembali"
  window.history.replaceState({}, "", `/loker${s ? `?${s}` : ""}`);
}

const waktu = (j) => {
  const t = j.tanggal ? new Date(j.tanggal).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
};

export function LokerPage() {
  const { jobs, loading, error } = useJobs();
  const [f, setF] = useState(bacaUrl);
  const [tampil, setTampil] = useState(PER_MUAT);
  const [toast, elemenToast] = useToast();

  const ubah = (sebagian) => setF((lama) => ({ ...lama, ...sebagian }));

  useEffect(() => {
    tulisUrl(f);
    setTampil(PER_MUAT);
  }, [f]);

  // Daftar sumber yang benar-benar ada di data, untuk pilihan filter
  const daftarSumber = useMemo(() => {
    const hitung = new Map();
    for (const j of jobs) {
      if (!j.site) continue;
      hitung.set(j.site, (hitung.get(j.site) || 0) + 1);
    }
    return [...hitung.entries()]
      .map(([site, n]) => {
        const info = infoSumber({ site });
        return {
          site,
          n,
          label: info.langsung ? site.replace(/_/g, " ") : info.nama,
          langsung: info.langsung,
        };
      })
      .sort((a, b) => b.n - a.n);
  }, [jobs]);

  const hasil = useMemo(() => {
    const kata = f.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const kota = f.kota.toLowerCase();

    const cocok = jobs.filter((j) => {
      if (f.lokasi && j.lokasiKerja !== f.lokasi) return false;
      if (f.tipe && j.tipeKerja !== f.tipe) return false;
      if (f.sumber === "_langsung" && infoSumber(j).langsung === false) return false;
      if (f.sumber && f.sumber !== "_langsung" && j.site !== f.sumber) return false;
      if (kota && !(j.lokasi || "").toLowerCase().includes(kota)) return false;
      if (f.gaji && !formatGaji(j)) return false;
      if (kata.length) {
        const teks = `${j.posisi} ${j.perusahaan} ${j.lokasi} ${j.kategori} ${
          j.jenjang || ""
        } ${j.fungsi || ""}`.toLowerCase();
        if (!kata.every((k) => teks.includes(k))) return false;
      }
      return true;
    });

    if (f.urut === "gaji") {
      return cocok.sort(
        (a, b) => Number(b.gajiMax || b.gajiMin || 0) - Number(a.gajiMax || a.gajiMin || 0),
      );
    }
    return cocok.sort((a, b) => waktu(b) - waktu(a));
  }, [jobs, f]);

  const adaFilter = f.q || f.kota || f.lokasi || f.tipe || f.sumber || f.gaji;
  const reset = () =>
    setF({ q: "", kota: "", lokasi: "", tipe: "", sumber: "", gaji: false, urut: "terbaru" });

  // Judul halaman mengikuti filter, mis. "Loker di Bandung"
  const judul = f.kota
    ? `Loker di ${f.kota}`
    : f.lokasi === "remote"
      ? "Loker remote"
      : f.q
        ? `Loker “${f.q}”`
        : "Semua lowongan";

  useEffect(() => {
    document.title = `${f.kota || f.q ? judul : "Semua loker"} · Jobly`;
  }, [judul, f.kota, f.q]);

  return (
    <PublicLayout aktif="/loker">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">Lowongan kerja</span>
        <h1>{judul}</h1>
        <p>
          Lowongan dari situs karier resmi perusahaan dan platform kerja,
          dikumpulkan setiap hari. Gratis untuk semua — buka detailnya, lalu
          lamar langsung di sumber aslinya.
        </p>
      </div>

      <div className="pb-filterbar">
        <div className="pb-wrap">
          <div className="pb-filter-row">
            <label className="pb-input">
              <Search size={17} color="#7A8597" />
              <span className="pb-sr">Cari loker</span>
              <input
                id="cari-loker"
                value={f.q}
                onChange={(e) => ubah({ q: e.target.value })}
                placeholder="Posisi, perusahaan, atau kata kunci…"
                autoComplete="off"
              />
              {f.q && (
                <button
                  type="button"
                  onClick={() => ubah({ q: "" })}
                  aria-label="Hapus pencarian"
                  style={{ border: 0, background: "none", cursor: "pointer", color: "#7A8597", display: "flex" }}
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <label className="pb-sr" htmlFor="filter-kota">Kota</label>
            <select
              id="filter-kota"
              className="pb-select"
              value={f.kota}
              onChange={(e) => ubah({ kota: e.target.value })}
            >
              <option value="">Semua kota</option>
              {KOTA_POPULER.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <label className="pb-sr" htmlFor="filter-sumber">Sumber</label>
            <select
              id="filter-sumber"
              className="pb-select"
              value={f.sumber}
              onChange={(e) => ubah({ sumber: e.target.value })}
            >
              <option value="">Semua sumber</option>
              {daftarSumber.some((s) => s.langsung) && (
                <option value="_langsung">Situs karier resmi</option>
              )}
              {daftarSumber.map((s) => (
                <option key={s.site} value={s.site}>
                  {s.langsung ? `— ${s.label}` : s.label} ({s.n.toLocaleString("id-ID")})
                </option>
              ))}
            </select>

            <label className="pb-sr" htmlFor="filter-urut">Urutkan</label>
            <select
              id="filter-urut"
              className="pb-select"
              value={f.urut}
              onChange={(e) => ubah({ urut: e.target.value })}
            >
              <option value="terbaru">Terbaru</option>
              <option value="gaji">Gaji tertinggi</option>
            </select>
          </div>

          <div className="pb-chips">
            {OPSI_LOKASI.map(([v, l]) => (
              <button
                key={`l-${v}`}
                type="button"
                className={`pb-chip ${f.lokasi === v ? "on" : ""}`}
                onClick={() => ubah({ lokasi: v })}
              >
                {v ? l : "Semua lokasi"}
              </button>
            ))}
            <span className="pb-chip-sep" />
            {OPSI_TIPE.map(([v, l]) => (
              <button
                key={`t-${v}`}
                type="button"
                className={`pb-chip ${f.tipe === v ? "on" : ""}`}
                onClick={() => ubah({ tipe: v })}
              >
                {v ? l : "Semua tipe"}
              </button>
            ))}
            <span className="pb-chip-sep" />
            <button
              type="button"
              className={`pb-chip ${f.gaji ? "on" : ""}`}
              onClick={() => ubah({ gaji: !f.gaji })}
            >
              Ada info gaji
            </button>
          </div>
        </div>
      </div>

      <div className="pb-wrap">
        <div className="pb-result">
          <span>
            {loading ? (
              "Memuat lowongan…"
            ) : (
              <>
                <b>{hasil.length.toLocaleString("id-ID")}</b> lowongan
                ditemukan
              </>
            )}
          </span>
          {adaFilter && (
            <button
              type="button"
              className="pb-link"
              onClick={reset}
              style={{ border: 0, background: "none", cursor: "pointer", color: "#14549A", fontSize: 13.5 }}
            >
              <X size={14} /> Hapus semua filter
            </button>
          )}
        </div>

        <div className="pb-grid">
          {loading &&
            Array.from({ length: 6 }, (_, i) => <KartuLokerSkeleton key={i} />)}

          {!loading &&
            hasil.slice(0, tampil).map((j) => (
              <KartuLoker key={j.id} job={j} onToast={toast} />
            ))}

          {!loading && hasil.length === 0 && (
            <div className="pb-empty">
              <h3>Belum ada loker yang cocok</h3>
              <p style={{ margin: "0 0 18px" }}>
                {error
                  ? "Data loker sedang tidak bisa dimuat. Coba muat ulang halaman sebentar lagi."
                  : "Coba kata kunci yang lebih umum, atau longgarkan filternya."}
              </p>
              {adaFilter && (
                <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={reset}>
                  Hapus semua filter
                </button>
              )}
            </div>
          )}
        </div>

        {!loading && hasil.length > tampil && (
          <div className="pb-more">
            <button
              type="button"
              className="pb-btn pb-btn-outline"
              onClick={() => setTampil((n) => n + PER_MUAT)}
            >
              Muat lebih banyak
            </button>
            Menampilkan {tampil.toLocaleString("id-ID")} dari{" "}
            {hasil.length.toLocaleString("id-ID")} lowongan
          </div>
        )}
        {!loading && hasil.length > 0 && hasil.length <= tampil && (
          <div className="pb-more">Semua lowongan sudah ditampilkan.</div>
        )}
      </div>

      {elemenToast}
    </PublicLayout>
  );
}
