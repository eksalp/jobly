import React, { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, Info } from "lucide-react";
import { PublicLayout, KOTA_POPULER } from "../../components/publik/PublicLayout";
import { useJobs } from "../../context/JobsContext";
import { useKurs, idrPer } from "../../utils/kurs";
import { hitungPetaGaji, gajiPosisi, jt, MIN_DATA } from "../../utils/petaGaji";
import { tautan } from "../../utils/navigasi";
import { urlDetail } from "../../utils/sumberLoker";
import { usePintasanCari } from "../../utils/interaksi";

const TAB = [
  ["perBidang", "Per bidang"],
  ["perKota", "Per kota"],
  ["perCara", "Remote vs kantor"],
];

const SARAN = ["Akuntan", "Frontend", "Data analyst", "Admin", "Marketing", "Customer service"];

/**
 * Grafik rentang: satu baris per kelompok. Pita = 50% gaji di tengah
 * (kuartil 1–3), titik = median. Skala dibagi bersama semua baris.
 */
function GrafikRentang({ data, periode }) {
  const kali = periode === "tahun" ? 12 : 1;
  const maks = Math.max(...data.map((g) => g.p75 * kali), 1);
  // Batas atas skala dibulatkan supaya garis bantu jatuh di angka bulat
  const langkah = maks > 60e6 ? 20e6 : maks > 24e6 ? 10e6 : 5e6;
  const atas = Math.ceil((maks * 1.08) / langkah) * langkah;
  const bantu = Array.from({ length: Math.floor(atas / langkah) + 1 }, (_, i) => i * langkah);
  const pos = (v) => `${(v / atas) * 100}%`;

  return (
    <div className="pb-rentang" role="table" aria-label="Kisaran gaji">
      <div className="pb-rentang-sumbu" aria-hidden="true">
        <span />
        <div className="trek">
          {bantu.map((v) => (
            <i key={v} style={{ left: pos(v) }}>
              {v === 0 ? "0" : jt(v).replace("Rp ", "")}
            </i>
          ))}
        </div>
        <span />
      </div>
      {data.map((g, i) => (
        <div key={g.label} className="pb-rentang-baris" role="row" data-muncul="" style={{ "--tunda": `${Math.min(i, 10) * 35}ms` }}>
          <span className="lbl" role="rowheader" title={g.label}>
            {g.label}
            <small>{g.n} loker</small>
          </span>
          <div className="trek" role="cell">
            {bantu.map((v) => (
              <b key={v} className="garis" style={{ left: pos(v) }} />
            ))}
            <span
              className="pita"
              style={{ left: pos(g.p25 * kali), width: `max(6px, calc(${pos((g.p75 - g.p25) * kali)}))` }}
            />
            <span className="med" style={{ left: pos(g.median * kali) }} />
            <span className="tip" role="tooltip">
              <b>{g.label}</b>
              Median {jt(g.median * kali)}
              <br />
              Tengah 50%: {jt(g.p25 * kali)} – {jt(g.p75 * kali)}
              <br />
              Terendah–tertinggi: {jt(g.min * kali)} – {jt(g.max * kali)}
              <br />
              Dari {g.n} loker
            </span>
          </div>
          <span className="val" role="cell">
            {jt(g.median * kali)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PetaGajiPage() {
  const { jobs, loading, terkunci } = useJobs();
  const { rates } = useKurs();
  const [tab, setTab] = useState("perBidang");
  const [periode, setPeriode] = useState("bulan");
  const [q, setQ] = useState(() => new URLSearchParams(window.location.search).get("posisi") || "");
  usePintasanCari("cari-gaji");

  useEffect(() => {
    document.title = "Peta gaji · Jobly";
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("posisi", q.trim());
    window.history.replaceState({}, "", `/peta-gaji${p.toString() ? `?${p}` : ""}`);
  }, [q]);

  const peta = useMemo(
    () => hitungPetaGaji(jobs, { idrPerFn: idrPer, rates, daftarKota: KOTA_POPULER }),
    [jobs, rates],
  );
  const posisi = useMemo(() => (q.trim().length >= 2 ? gajiPosisi(peta.baris, q.trim()) : null), [peta, q]);
  const kelompok = peta[tab];
  const kali = periode === "tahun" ? 12 : 1;

  return (
    <PublicLayout aktif="/peta-gaji">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">Peta gaji</span>
        <h1>Berapa gaji yang wajar untuk posisimu?</h1>
        <p>
          Kisaran gaji dihitung langsung dari loker di Jobly yang mencantumkan
          angka gaji — bukan survei, bukan tebakan. Mata uang asing disetarakan
          ke rupiah dengan kurs hari ini.
        </p>
      </div>

      <div className="pb-wrap">
        <div className="pb-gaji-cari">
          <label className="pb-input">
            <Search size={17} color="var(--muted)" aria-hidden="true" />
            <span className="pb-sr">Cari posisi</span>
            <input
              id="cari-gaji"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ketik posisi, mis. akuntan, frontend, admin…"
              autoComplete="off"
            />
          </label>
          <div className="pb-chips" style={{ marginTop: 10 }}>
            {SARAN.map((s) => (
              <button key={s} type="button" className={`pb-chip ${q.toLowerCase() === s.toLowerCase() ? "on" : ""}`} onClick={() => setQ(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {posisi && (
          <div className="pb-gaji-posisi" data-muncul="">
            {posisi.n === 0 ? (
              <p style={{ margin: 0, color: "var(--ink2)" }}>
                Belum ada loker “{q}” yang mencantumkan gaji. Coba kata yang lebih umum.
              </p>
            ) : (
              <>
                <div className="pb-gaji-angka">
                  <div>
                    <span>Median gaji “{q}”</span>
                    <b>{jt(posisi.median * kali)}</b>
                    <small>per {periode}</small>
                  </div>
                  <div>
                    <span>Kisaran umum</span>
                    <b className="kecil">
                      {jt(posisi.p25 * kali)} – {jt(posisi.p75 * kali).replace("Rp ", "")}
                    </b>
                    <small>50% loker di tengah</small>
                  </div>
                  <div>
                    <span>Data</span>
                    <b className="kecil">{posisi.n} loker</b>
                    <small>{posisi.n < MIN_DATA ? "masih sedikit — anggap gambaran kasar" : "dengan gaji tercantum"}</small>
                  </div>
                </div>
                <div className="pb-gaji-contoh">
                  {posisi.contoh.map(({ job, gaji }) => (
                    <a key={job.id} {...tautan(urlDetail(job))}>
                      <span>
                        <b>{job.posisi}</b>
                        {job.perusahaan}
                      </span>
                      <em>{jt(gaji * kali)}</em>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="pb-toolbar" style={{ marginTop: 34 }}>
          <div className="pb-seg" role="tablist" aria-label="Kelompokkan">
            {TAB.map(([id, l]) => (
              <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
                {l}
              </button>
            ))}
          </div>
          <div className="pb-seg" role="group" aria-label="Periode">
            {[
              ["bulan", "Per bulan"],
              ["tahun", "Per tahun"],
            ].map(([id, l]) => (
              <button key={id} type="button" aria-pressed={periode === id} className={periode === id ? "on" : ""} onClick={() => setPeriode(id)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pb-gaji-legenda">
          <span>
            <i className="pita" /> 50% gaji di tengah
          </span>
          <span>
            <i className="med" /> Median
          </span>
          <span className="ket">
            <Info size={13} /> Arahkan kursor ke baris untuk rincian. Kelompok dengan kurang dari {MIN_DATA} data disembunyikan.
          </span>
        </div>

        {loading ? (
          <div style={{ display: "grid", gap: 14, marginTop: 10 }}>
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="pb-skel" style={{ height: 26, width: `${90 - i * 7}%` }} />
            ))}
          </div>
        ) : kelompok.tampil.length ? (
          <GrafikRentang data={kelompok.tampil} periode={periode} />
        ) : (
          <div className="pb-empty">
            <h3>Data gaji belum cukup</h3>
            <p style={{ margin: 0 }}>Belum banyak loker yang mencantumkan angka gaji untuk pengelompokan ini.</p>
          </div>
        )}

        {!loading && (
          <p className="pb-gaji-catatan">
            Dihitung dari {peta.total.toLocaleString("id-ID")} loker yang mencantumkan gaji
            {terkunci ? ` (di antara loker yang terbuka untukmu)` : ""}. Nilai tengah dari
            kisaran yang tercantum dipakai sebagai gaji satu loker. Gaji dari perusahaan
            luar negeri ikut dihitung, jadi angka remote cenderung lebih tinggi.
          </p>
        )}
      </div>

      <section className="pb-section tint" style={{ marginTop: 40 }}>
        <div className="pb-wrap pb-cek-cta" data-muncul="">
          <div>
            <h2 className="pb-h2">Ditawari gaji dalam dolar?</h2>
            <p className="pb-sub">Hitung nilai bersihnya dalam rupiah — per jam sampai per tahun, setelah potongan platform dan biaya transfer.</p>
          </div>
          <a className="pb-btn pb-btn-primary" {...tautan("/kalkulator-gaji")}>
            Buka kalkulator <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}
