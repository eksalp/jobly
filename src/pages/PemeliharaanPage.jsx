import React from "react";
import { t, lokal, bahasa, setBahasa } from "../i18n.js";
import { PEMELIHARAAN } from "../pemeliharaan.js";

/** Halaman yang tampil di seluruh situs selama mode pemeliharaan aktif. */
export default function PemeliharaanPage() {
  const selesai = new Date(PEMELIHARAAN.selesai);
  const sudahLewat = Date.now() > selesai.getTime();
  const jam = selesai.toLocaleString(lokal(), {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });

  // setBahasa memuat ulang halaman, jadi tidak perlu state tambahan.
  const ganti = () => setBahasa(bahasa() === "en" ? "id" : "en");

  return (
    <main className="pml">
      <style>{CSS}</style>
      <div className="pml-kartu">
        <div className="pml-atas">
          <img src="/logo-jobly-j.svg" alt="" width="34" height="34" />
          <b>Jobly</b>
          <button type="button" className="pml-bhs" onClick={ganti}>
            {bahasa() === "en" ? "Bahasa Indonesia" : "English"}
          </button>
        </div>

        <span className="pml-label">{t("Sedang pemeliharaan", "Under maintenance")}</span>
        <h1>{t("Jobly sedang ditingkatkan", "Jobly is being upgraded")}</h1>
        <p>
          {t(
            "Terima kasih atas antusiasme kalian. Agar Jobly tetap nyaman dipakai, kami sedang memperbaiki dan menambah beberapa fitur. Situs untuk sementara ditutup sampai pekerjaan ini selesai.",
            "Thank you for all the enthusiasm. To keep Jobly running smoothly, we're fixing and adding a few features. The site is closed for now until the work is done.",
          )}
        </p>

        <div className="pml-waktu">
          <span>{t("Perkiraan dibuka kembali", "Expected back")}</span>
          <strong>
            {sudahLewat
              ? t("Sebentar lagi. Terima kasih sudah menunggu.", "Very soon. Thanks for waiting.")
              : `${jam} WIB`}
          </strong>
        </div>

        <ul className="pml-janji">
          <li>
            <b>{t("Kuota kamu aman.", "Your credits are safe.")}</b>{" "}
            {t(
              "Selama pemeliharaan tidak ada kuota Review CV, Pindah Karier, atau Simulasi Interview yang terpakai.",
              "No CV Review, Career Switch, or Mock Interview credits are used during maintenance.",
            )}
          </li>
          <li>
            <b>{t("Data dan paketmu tetap tersimpan.", "Your data and plan are kept.")}</b>{" "}
            {t(
              "Akun, CV, riwayat, dan paket yang sudah dibeli tidak berubah.",
              "Your account, CVs, history, and purchased plans stay as they are.",
            )}
          </li>
        </ul>

        <p className="pml-kecil">
          {t("Sampai jumpa lagi dengan Jobly yang lebih baik.", "See you soon with a better Jobly.")}
        </p>
      </div>
    </main>
  );
}

const CSS = `
.pml{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:var(--t-bg,#f6f8fc);color:var(--t-ink,#0f172a);font-family:"Plus Jakarta Sans",system-ui,sans-serif}
.pml-kartu{width:100%;max-width:560px;background:var(--t-surface,#fff);border:1px solid var(--t-border,#e2e8f0);border-radius:20px;padding:32px 28px;box-shadow:0 20px 50px -30px rgba(15,23,42,.35)}
.pml-atas{display:flex;align-items:center;gap:10px;margin-bottom:28px}
.pml-atas b{font-size:18px}
.pml-bhs{margin-left:auto;background:none;border:1px solid var(--t-border,#e2e8f0);color:var(--t-ink-soft,#475569);border-radius:999px;padding:6px 12px;font:inherit;font-size:12.5px;cursor:pointer}
.pml-label{display:inline-block;font-size:12px;font-weight:600;color:var(--t-warn-ink,#92400e);background:var(--t-warn-bg,#fef3c7);padding:4px 10px;border-radius:999px}
.pml h1{font-size:clamp(24px,5vw,30px);line-height:1.2;margin:12px 0 10px;letter-spacing:-.02em}
.pml p{color:var(--t-ink-soft,#475569);line-height:1.65;margin:0;font-size:15px}
.pml-waktu{margin:22px 0;padding:14px 16px;border-radius:14px;background:var(--t-accent-soft,#eef3ff);display:flex;flex-direction:column;gap:4px}
.pml-waktu span{font-size:12.5px;color:var(--t-ink-soft,#475569)}
.pml-waktu strong{font-size:16px;color:var(--t-ink,#0f172a)}
.pml-janji{list-style:none;padding:0;margin:0 0 22px;display:grid;gap:10px}
.pml-janji li{font-size:14px;line-height:1.6;color:var(--t-ink-soft,#475569);padding-left:24px;position:relative}
.pml-janji li::before{content:"";position:absolute;left:4px;top:7px;width:9px;height:9px;border-radius:50%;background:var(--t-ok,#16a34a)}
.pml-janji b{color:var(--t-ink,#0f172a)}
.pml-kecil{font-size:13.5px!important}
`;
