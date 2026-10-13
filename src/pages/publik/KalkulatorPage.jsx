import React, { useEffect, useMemo, useState } from "react";
import { RotateCcw, ArrowRight } from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { useKurs, idrPer, rupiahPenuh, rupiahRingkas, formatWaktuKurs } from "../../utils/kurs";
import { hitungGaji, PERIODE, MATA_UANG, formatAsing } from "../../utils/hitungGaji";
import { tautan } from "../../utils/navigasi";
import { lokal, t } from "../../i18n.js";

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
    document.title = t("Kalkulator gaji dolar ke rupiah · Jobly", "Dollar to rupiah salary calculator · Jobly");
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
    ? t("kurs yang kamu masukkan", "your own rate")
    : kurs.live
      ? t(`kurs referensi ${formatWaktuKurs(kurs.waktu) || "hari ini"}`, `reference rate ${formatWaktuKurs(kurs.waktu) || "today"}`)
      : t("kurs cadangan, karena kurs hari ini gagal dimuat", "fallback rate, today's rate failed to load");

  return (
    <PublicLayout aktif="/kalkulator-gaji">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">Kalkulator gaji</span>
        <h1>{t("Berapa gaji dolarmu dalam rupiah?", "What's your dollar salary in rupiah?")}</h1>
        <p>
          {t(
            "Masukkan tawaran gaji atau tarif freelance dalam mata uang asing. Kalkulator ini menghitung nilainya per jam sampai per tahun, lalu memotong biaya platform dan transfer. Jadi kamu tahu berapa yang benar-benar masuk ke rekening.",
            "Enter a salary offer or freelance rate in a foreign currency. The calculator works out hourly to yearly amounts, then subtracts platform and transfer fees, so you know what actually lands in your account.",
          )}
        </p>
      </div>

      <div className="pb-wrap pb-calc" style={{ marginTop: 32 }}>
        {/* ============================================== input */}
        <section className="pb-panel" aria-label={t("Isian kalkulator", "Calculator inputs")} style={{ display: "grid", gap: 22 }}>
          <div className="pb-row">
            <label className="pb-field">
              <span>{t("Mata uang", "Currency")}</span>
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
              <span>{t("Jumlah gaji", "Amount")}</span>
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
            <span id="kalk-periode-label">{t("Periode gaji", "Pay period")}</span>
            <div className="pb-seg" role="group" aria-labelledby="kalk-periode-label">
              {PERIODE.map((p) => (
                <button key={p.id} type="button" className={periode === p.id ? "on" : ""} onClick={() => setPeriode(p.id)} aria-pressed={periode === p.id}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <label className="pb-field">
            <span>{t("Jam kerja per minggu", "Hours per week")}</span>
            <div className="pb-input" style={{ maxWidth: 220 }}>
              <input id="kalk-jam" inputMode="numeric" value={jamTeks} onChange={(e) => setJamTeks(e.target.value)} />
              <span className="unit">jam</span>
            </div>
            <small>{t("Dipakai untuk menghitung tarif per jam. Penuh waktu umumnya 40 jam.", "Used for the hourly rate. Full time is usually 40 hours.")}</small>
          </label>

          <div className="pb-row">
            <div className="pb-field">
              <span id="kalk-platform-label">{t("Potongan platform", "Platform fee")}</span>
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
              <small>{t("Biaya layanan marketplace freelance, bila ada. Isi 0 untuk gaji karyawan.", "Freelance marketplace service fee, if any. Use 0 for an employee salary.")}</small>
            </div>
            <div className="pb-field">
              <span id="kalk-transfer-label">{t("Biaya transfer & selisih kurs", "Transfer fee & FX margin")}</span>
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
              <small>{t("Berbeda tiap penyedia. Cek di aplikasi transfer atau bank yang kamu pakai.", "Varies by provider. Check your transfer app or bank.")}</small>
            </div>
          </div>

          <label className="pb-field">
            <span>{t(`Kurs 1 ${kode} dalam rupiah`, `Rate for 1 ${kode} in rupiah`)}</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div className="pb-input" style={{ flex: "1 1 200px" }}>
                <span className="unit">Rp</span>
                <input
                  id="kalk-kurs"
                  inputMode="decimal"
                  placeholder={kursLive ? Math.round(kursLive).toLocaleString(lokal()) : ""}
                  value={kursManual}
                  onChange={(e) => setKursManual(e.target.value)}
                />
              </div>
              {kursManual && (
                <button type="button" className="pb-btn pb-btn-outline" onClick={() => setKursManual("")}>
                  <RotateCcw size={15} /> {t("Pakai kurs live", "Use live rate")}
                </button>
              )}
            </div>
            <small>{t("Kosongkan untuk memakai kurs referensi harian. Isi sendiri bila ingin memakai kurs dari bank atau penyedia transfermu.", "Leave empty to use the daily reference rate, or enter your bank's or transfer provider's rate.")}</small>
          </label>
        </section>

        {/* ============================================== hasil */}
        <aside className="pb-calc-result" aria-live="polite">
          <div className="pb-panel">
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink2)" }}>{t("Perkiraan diterima per bulan", "Estimated monthly take-home")}</div>
            <div className="pb-big" style={{ marginTop: 6 }}>
              {rupiahPenuh(h.rincianBulan.bersih)}
            </div>
            <div className="pb-kurs" style={{ marginTop: 8 }}>
              1 {kode} = {kursPakai ? rupiahPenuh(kursPakai) : "-"} · {sumberKurs}
            </div>

            <ul className="pb-break" style={{ marginTop: 20 }}>
              <li>
                <span>{t("Gaji kotor per bulan", "Gross monthly pay")}</span>
                <span>{rupiahPenuh(h.rincianBulan.kotor)}</span>
              </li>
              <li>
                <span>{t("Potongan platform", "Platform fee")} ({platform || 0}%)</span>
                <span>− {rupiahPenuh(h.rincianBulan.platform)}</span>
              </li>
              <li>
                <span>{t("Biaya transfer", "Transfer fee")} ({transfer || 0}%)</span>
                <span>− {rupiahPenuh(h.rincianBulan.transfer)}</span>
              </li>
              <li className="total">
                <span>{t("Diterima", "Take-home")}</span>
                <span>{rupiahPenuh(h.rincianBulan.bersih)}</span>
              </li>
            </ul>
          </div>

          <div className="pb-panel" style={{ marginTop: 14, overflowX: "auto" }}>
            <table className="pb-table">
              <thead>
                <tr>
                  <th scope="col">{t("Periode", "Period")}</th>
                  <th scope="col">{kode}</th>
                  <th scope="col">{t("Kotor", "Gross")}</th>
                  <th scope="col">{t("Diterima", "Take-home")}</th>
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
              {t(
                "Asumsi 52 minggu per tahun dan 5 hari kerja per minggu. Belum dikurangi pajak penghasilan. Kurs referensi berbeda dengan kurs transaksi bank.",
                "Assumes 52 weeks a year and 5 working days a week. Income tax is not deducted. The reference rate differs from bank transaction rates.",
              )}
            </p>
          </div>

          <a className="pb-link" style={{ marginTop: 18 }} {...tautan("/loker?lokasi=remote")}>
            {t("Cari loker remote", "Find remote jobs")} <ArrowRight size={15} />
          </a>
        </aside>
      </div>
    </PublicLayout>
  );
}
