import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import {
  PublicLayout,
  KOTA_POPULER,
  useToast,
} from "../../components/publik/PublicLayout";
import { KartuLoker, KartuLokerSkeleton } from "../../components/publik/KartuLoker";
import { useJobs } from "../../context/JobsContext";
import { useDaftarLoker, useTunda } from "../../hooks/useLoker";
import { KartuKunci, InfoKuotaLoker } from "../../components/publik/LokerTerkunci";
import { TautanGrup } from "../../components/publik/Komunitas";
import { grupAktif } from "../../data/situs";
import { useMuatOtomatis, usePintasanCari } from "../../utils/interaksi";
import { infoSumber, LABEL_LOKASI_KERJA, LABEL_TIPE_KERJA } from "../../utils/sumberLoker";


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


export function LokerPage() {
  const { statistik } = useJobs();
  const [f, setF] = useState(bacaUrl);
  const [toast, elemenToast] = useToast();

  const ubah = (sebagian) => setF((lama) => ({ ...lama, ...sebagian }));
  const sentinel = useRef(null);
  usePintasanCari("cari-loker");

  useEffect(() => {
    tulisUrl(f);
  }, [f]);

  // Kata kunci dikirim ke server setelah berhenti mengetik sebentar
  const q = useTunda(f.q, 350);
  const { jobs: hasil, total, terkunci, loading, error, adaLagi, memuatLagi, muatLagi } = useDaftarLoker({
    q: q.trim(),
    kota: f.kota,
    lokasi: f.lokasi,
    tipe: f.tipe,
    sumber: f.sumber,
    gaji: f.gaji,
    urut: f.urut,
  });

  // Daftar sumber dari statistik server, untuk pilihan filter
  const daftarSumber = useMemo(
    () =>
      Object.entries(statistik.sumber || {})
        .map(([site, n]) => {
          const info = infoSumber({ site });
          return {
            site,
            n,
            label: info.langsung ? site.replace(/_/g, " ") : info.nama,
            langsung: info.langsung,
          };
        })
        .sort((a, b) => b.n - a.n),
    [statistik.sumber],
  );

  // Gulir sampai bawah = muat 24 berikutnya, tanpa perlu menekan tombol
  useMuatOtomatis(sentinel, !loading && adaLagi && !memuatLagi, muatLagi);

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
          Loker dari situs karier resmi perusahaan dan platform kerja,
          diperbarui setiap hari. Buka detailnya, lalu lamar langsung di
          situs aslinya. Gratis, tanpa biaya dari Jobly.
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
                placeholder="Posisi, perusahaan, atau kata kunci…  (tekan / )"
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
                  {s.langsung ? `· ${s.label}` : s.label} ({s.n.toLocaleString("id-ID")})
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
        {!loading && <InfoKuotaLoker />}
        <div className="pb-result">
          <span>
            {loading ? (
              "Memuat lowongan…"
            ) : (
              <>
                <b>{(total ?? 0).toLocaleString("id-ID")}</b> lowongan
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
            Array.from({ length: 8 }, (_, i) => <KartuLokerSkeleton key={i} />)}

          {!loading &&
            hasil.map((j) => <KartuLoker key={j.id} job={j} onToast={toast} />)}
          {memuatLagi && Array.from({ length: 4 }, (_, i) => <KartuLokerSkeleton key={`m${i}`} />)}

          {!loading && hasil.length === 0 && (
            <div className="pb-empty">
              <h3>Belum ada loker yang cocok</h3>
              <p style={{ margin: "0 0 18px" }}>
                {error
                  ? "Data loker sedang tidak bisa dimuat. Coba muat ulang halaman sebentar lagi."
                  : "Coba kata kunci yang lebih umum, atau kurangi filternya."}
              </p>
              {adaFilter && (
                <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={reset}>
                  Hapus semua filter
                </button>
              )}
            </div>
          )}
        </div>

        {!loading && adaLagi && (
          <div className="pb-more" ref={sentinel}>
            <button type="button" className="pb-btn pb-btn-outline" onClick={muatLagi} disabled={memuatLagi}>
              {memuatLagi ? "Memuat…" : "Muat lebih banyak"}
            </button>
            Menampilkan {hasil.length.toLocaleString("id-ID")} dari {(total ?? 0).toLocaleString("id-ID")} lowongan
          </div>
        )}
        {!loading && !adaLagi && terkunci > 0 && (
          <div className="pb-grid" style={{ marginTop: 18 }}>
            <KartuKunci jumlah={terkunci} />
          </div>
        )}
        {!loading && !adaLagi && hasil.length > 0 && (
          <div className="pb-more">Semua lowongan yang terbuka sudah ditampilkan.</div>
        )}
        {!loading && grupAktif().length > 0 && (
          <div className="pb-grup-strip">
            <span>
              <b>Mau dapat info loker tiap hari?</b> Gabung grup Jobly, gratis.
            </span>
            <TautanGrup ringkas />
          </div>
        )}
      </div>

      {elemenToast}
    </PublicLayout>
  );
}
