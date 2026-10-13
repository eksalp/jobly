import React, { useEffect, useMemo, useState } from "react";
import { RotateCcw, ArrowRight } from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { useKurs, idrPer, rupiahPenuh, rupiahRingkas, formatWaktuKurs } from "../../utils/kurs";
import { hitungGaji, PERIODE, MATA_UANG, formatAsing } from "../../utils/hitungGaji";
import { tautan } from "../../utils/navigasi";

const PRESET_PLATFORM = [0, 10, 20];
const PRESET_TRANSFER = [0, 1, 3];

/** Nominal gaya Indonesia: titik = ribuan, koma = desimal ("2.000,5"). */
function angkaDari(s) {
  const bersih = String(s).replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(bersih);
  return Number.isFinite(n) ? n : 0;
}

/** Persen & jam: titik atau koma sama-sama desimal ("2.5" = "2,5"). */
function desimalDari(s) {
  const n = parseFloat(String(s).replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function KalkulatorPage() {
  const kurs = useKurs();
  const [kode, setKode] = useState("USD");
  const [jumlahTeks, setJumlahTeks] = useState("2000");
  const [periode, setPeriode] = useState("bulan");
  const [jamTeks, setJamTeks] = useState("40");
  const [platformTeks, setPlatformTeks] = useState("0");
  const [transferTeks, setTransferTeks] = useState("1");
  const jam = desimalDari(jamTeks) || 40;
  const platform = desimalDari(platformTeks);
  const transfer = desimalDari(transferTeks);
  const [kursManual, setKursManual] = useState("");

  useEffect(() => {
    document.title = "Kalkulator gaji dolar ke rupiah · Jobly";
  }, []);

  const kursLive = idrPer(kode, kurs.rates);
  const kursPakai = kursManual ? angkaDari(kursManual) : kursLive;
  const jumlah = angkaDari(jumlahTeks);

  const h = useMemo(
    () =>
      hitungGaji({
        jumlah,
        periode,
        jamPerMinggu: jam,
        kurs: kursPakai,
        potonganPlatform: platform,
        biayaTransfer: transfer,
      }),
    [jumlah, periode, jam, kursPakai, platform, transfer],
  );

  const sumberKurs = kursManual
    ? "kurs yang kamu masukkan"
    : kurs.live
      ? `kurs referensi ${formatWaktuKurs(kurs.waktu) || "hari ini"}`
      : "kurs cadangan, karena kurs hari ini gagal dimuat";

  return (
    <PublicLayout aktif="/kalkulator-gaji">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">Kalkulator gaji</span>
        <h1>Berapa gaji dolarmu dalam rupiah?</h1>
        <p>
          Masukkan tawaran gaji atau tarif freelance dalam mata uang asing. Kalkulator
          ini menghitung nilainya per jam sampai per tahun, lalu memotong biaya
          platform dan transfer. Jadi kamu tahu berapa yang benar-benar masuk ke
          rekening.
        </p>
      </div>

      <div className="pb-wrap pb-calc" style={{ marginTop: 32 }}>
        {/* ============================================== input */}
        <section className="pb-panel" aria-label="Isian kalkulator" style={{ display: "grid", gap: 22 }}>
          <div className="pb-row">
            <label className="pb-field">
              <span>Mata uang</span>
              <div className="pb-input">
                <select id="kalk-mata-uang" value={kode} onChange={(e) => { setKode(e.target.value); setKursManual(""); }}>
                  {MATA_UANG.map((m) => (
                    <option key={m.kode} value={m.kode}>
                      {m.kode} ({m.nama})
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <label className="pb-field">
              <span>Jumlah gaji</span>
              <div className="pb-input">
                <input
                  id="kalk-jumlah"
                  inputMode="decimal"
                  value={jumlahTeks}
                  onChange={(e) => setJumlahTeks(e.target.value)}
                  aria-describedby="kalk-jumlah-unit"
                />
                <span className="unit" id="kalk-jumlah-unit">
                  {kode}
                </span>
              </div>
            </label>
          </div>

          <div className="pb-field">
            <span id="kalk-periode-label">Periode gaji</span>
            <div className="pb-seg" role="group" aria-labelledby="kalk-periode-label">
              {PERIODE.map((p) => (
                <button key={p.id} type="button" className={periode === p.id ? "on" : ""} onClick={() => setPeriode(p.id)} aria-pressed={periode === p.id}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <label className="pb-field">
            <span>Jam kerja per minggu</span>
            <div className="pb-input" style={{ maxWidth: 220 }}>
              <input id="kalk-jam" inputMode="numeric" value={jamTeks} onChange={(e) => setJamTeks(e.target.value)} />
              <span className="unit">jam</span>
            </div>
            <small>Dipakai untuk menghitung tarif per jam. Penuh waktu umumnya 40 jam.</small>
          </label>

          <div className="pb-row">
            <div className="pb-field">
              <span id="kalk-platform-label">Potongan platform</span>
              <div className="pb-input">
                <input
                  id="kalk-platform"
                  inputMode="decimal"
                  value={platformTeks}
                  onChange={(e) => setPlatformTeks(e.target.value)}
                  aria-labelledby="kalk-platform-label"
                />
                <span className="unit">%</span>
              </div>
              <div className="pb-chips">
                {PRESET_PLATFORM.map((v) => (
                  <button key={v} type="button" className={`pb-chip ${platform === v ? "on" : ""}`} onClick={() => setPlatformTeks(String(v))}>
                    {v}%
                  </button>
                ))}
              </div>
              <small>Biaya layanan marketplace freelance, bila ada. Isi 0 untuk gaji karyawan.</small>
            </div>
            <div className="pb-field">
              <span id="kalk-transfer-label">Biaya transfer & selisih kurs</span>
              <div className="pb-input">
                <input
                  id="kalk-transfer"
                  inputMode="decimal"
                  value={transferTeks}
                  onChange={(e) => setTransferTeks(e.target.value)}
                  aria-labelledby="kalk-transfer-label"
                />
                <span className="unit">%</span>
              </div>
              <div className="pb-chips">
                {PRESET_TRANSFER.map((v) => (
                  <button key={v} type="button" className={`pb-chip ${transfer === v ? "on" : ""}`} onClick={() => setTransferTeks(String(v))}>
                    {v}%
                  </button>
                ))}
              </div>
              <small>Berbeda tiap penyedia. Cek di aplikasi transfer atau bank yang kamu pakai.</small>
            </div>
          </div>

          <label className="pb-field">
            <span>Kurs 1 {kode} dalam rupiah</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div className="pb-input" style={{ flex: "1 1 200px" }}>
                <span className="unit">Rp</span>
                <input
                  id="kalk-kurs"
                  inputMode="decimal"
                  placeholder={kursLive ? Math.round(kursLive).toLocaleString("id-ID") : ""}
                  value={kursManual}
                  onChange={(e) => setKursManual(e.target.value)}
                />
              </div>
              {kursManual && (
                <button type="button" className="pb-btn pb-btn-outline" onClick={() => setKursManual("")}>
                  <RotateCcw size={15} /> Pakai kurs live
                </button>
              )}
            </div>
            <small>Kosongkan untuk memakai kurs referensi harian. Isi sendiri bila ingin memakai kurs dari bank atau penyedia transfermu.</small>
          </label>
        </section>

        {/* ============================================== hasil */}
        <aside className="pb-calc-result" aria-live="polite">
          <div className="pb-panel">
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink2)" }}>Perkiraan diterima per bulan</div>
            <div className="pb-big" style={{ marginTop: 6 }}>
              {rupiahPenuh(h.rincianBulan.bersih)}
            </div>
            <div className="pb-kurs" style={{ marginTop: 8 }}>
              1 {kode} = {kursPakai ? rupiahPenuh(kursPakai) : "-"} · {sumberKurs}
            </div>

            <ul className="pb-break" style={{ marginTop: 20 }}>
              <li>
                <span>Gaji kotor per bulan</span>
                <span>{rupiahPenuh(h.rincianBulan.kotor)}</span>
              </li>
              <li>
                <span>Potongan platform ({platform || 0}%)</span>
                <span>− {rupiahPenuh(h.rincianBulan.platform)}</span>
              </li>
              <li>
                <span>Biaya transfer ({transfer || 0}%)</span>
                <span>− {rupiahPenuh(h.rincianBulan.transfer)}</span>
              </li>
              <li className="total">
                <span>Diterima</span>
                <span>{rupiahPenuh(h.rincianBulan.bersih)}</span>
              </li>
            </ul>
          </div>

          <div className="pb-panel" style={{ marginTop: 14, overflowX: "auto" }}>
            <table className="pb-table">
              <thead>
                <tr>
                  <th scope="col">Periode</th>
                  <th scope="col">{kode}</th>
                  <th scope="col">Kotor</th>
                  <th scope="col">Diterima</th>
                </tr>
              </thead>
              <tbody>
                {h.baris.map((b) => (
                  <tr key={b.id} className={b.id === periode ? "on" : ""}>
                    <td>{b.label}</td>
                    <td>{formatAsing(b.asing, kode).replace(`${kode} `, "")}</td>
                    <td>{rupiahRingkas(b.kotorIdr)}</td>
                    <td>{rupiahRingkas(b.bersihIdr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "12px 0 0", lineHeight: 1.55 }}>
              Asumsi 52 minggu per tahun dan 5 hari kerja per minggu. Belum dikurangi pajak
              penghasilan. Kurs referensi berbeda dengan kurs transaksi bank.
            </p>
          </div>

          <a className="pb-link" style={{ marginTop: 18 }} {...tautan("/loker?lokasi=remote")}>
            Cari loker remote <ArrowRight size={15} />
          </a>
        </aside>
      </div>
    </PublicLayout>
  );
}
