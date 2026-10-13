import React, { useEffect, useMemo, useState } from "react";
import { Flame, Target, CheckCircle2, Circle, ArrowRight, Trophy, CalendarDays } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useJobs } from "../../context/JobsContext";
import { useApplications } from "../../hooks/useApplications";
import { tautan } from "../../utils/navigasi";
import { lokal, t } from "../../i18n.js";

/*
 * Rencana lamar — target mingguan, streak harian, dan misi kecil.
 *
 * Angka lamaran dihitung dari tabel `applications` (Lamaran saya), jadi
 * tidak ada data baru di server. Target dan centang misi disimpan di
 * perangkat, per akun.
 */

const PILIHAN_TARGET = [5, 10, 15, 20];
const HARI = [t("Sen", "Mon"), t("Sel", "Tue"), t("Rab", "Wed"), t("Kam", "Thu"), t("Jum", "Fri"), t("Sab", "Sat"), t("Min", "Sun")];

const tglLokal = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
const awalMinggu = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const geser = (x.getDay() + 6) % 7; // Senin = 0
  x.setDate(x.getDate() - geser);
  return x;
};

function useSimpanLokal(kunci, awal) {
  const [nilai, setNilai] = useState(() => {
    try {
      const v = localStorage.getItem(kunci);
      return v == null ? awal : JSON.parse(v);
    } catch {
      return awal;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(kunci, JSON.stringify(nilai));
    } catch {
      // penyimpanan tidak tersedia — tetap berjalan di sesi ini
    }
  }, [kunci, nilai]);
  return [nilai, setNilai];
}

function Cincin({ nilai, target }) {
  const p = Math.min(1, target ? nilai / target : 0);
  const r = 54;
  const k = 2 * Math.PI * r;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="pb-cincin" aria-hidden="true">
      <circle cx="70" cy="70" r={r} fill="none" stroke="var(--bar-bg)" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="var(--brand-deep)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={k}
        strokeDashoffset={k * (1 - p)}
        transform="rotate(-90 70 70)"
        className="isi"
      />
    </svg>
  );
}

export function RencanaPanel() {
  const { user } = useAuth();
  const { statistik } = useJobs();
  const { lamaran, loading } = useApplications();
  const uid = user?.id || "tamu";
  const hariIni = tglLokal(new Date());
  const [target, setTarget] = useSimpanLokal(`jobly:target:${uid}`, 10);
  const [centang, setCentang] = useSimpanLokal(`jobly:misi:${uid}:${hariIni}`, {});

  const data = useMemo(() => {
    const perHari = new Map();
    for (const l of lamaran) {
      const tt = l.tanggal_lamar || (l.created_at || "").slice(0, 10);
      if (!tt) continue;
      perHari.set(tt, (perHari.get(tt) || 0) + 1);
    }

    // Minggu ini (Senin–Minggu)
    const senin = awalMinggu();
    const minggu = HARI.map((h, i) => {
      const d = new Date(senin);
      d.setDate(senin.getDate() + i);
      const k = tglLokal(d);
      return { h, k, n: perHari.get(k) || 0, lewat: k <= hariIni, hariIni: k === hariIni };
    });
    const mingguIni = minggu.reduce((n, d) => n + d.n, 0);

    // Streak: hari berturut-turut dengan minimal satu lamaran. Hari ini
    // yang belum ada lamaran tidak memutus streak — harinya belum selesai.
    let streak = 0;
    const d = new Date();
    if (!perHari.get(tglLokal(d))) d.setDate(d.getDate() - 1);
    while (perHari.get(tglLokal(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }

    // 12 minggu terakhir untuk peta aktivitas
    const mulai = awalMinggu();
    mulai.setDate(mulai.getDate() - 7 * 11);
    const kolom = Array.from({ length: 12 }, (_, w) =>
      Array.from({ length: 7 }, (_, h) => {
        const x = new Date(mulai);
        x.setDate(mulai.getDate() + w * 7 + h);
        const k = tglLokal(x);
        return { k, n: perHari.get(k) || 0, nanti: k > hariIni };
      }),
    );

    // Rekor minggu terbaik
    const perMinggu = new Map();
    for (const [tt, n] of perHari) {
      const k = tglLokal(awalMinggu(new Date(`${tt}T00:00:00`)));
      perMinggu.set(k, (perMinggu.get(k) || 0) + n);
    }
    const rekor = Math.max(0, ...perMinggu.values());

    return { minggu, mingguIni, streak, kolom, rekor, hariIniN: perHari.get(hariIni) || 0, total: lamaran.length };
  }, [lamaran, hariIni]);

  const lokerSegar = statistik.baru2 || 0;

  const sisaHari = 7 - data.minggu.filter((d) => d.lewat && !d.hariIni).length;
  const sisaTarget = Math.max(0, target - data.mingguIni);
  const perHariPerlu = sisaTarget ? Math.ceil(sisaTarget / Math.max(1, sisaHari)) : 0;
  const tercapai = data.mingguIni >= target;

  const MISI = [
    {
      id: "lamar",
      t: t(`Kirim ${Math.max(1, perHariPerlu || 1)} lamaran hari ini`, `Send ${Math.max(1, perHariPerlu || 1)} applications today`),
      d: t("Tercentang otomatis saat kamu mencatat lamaran.", "Ticks itself when you log an application."),
      otomatis: data.hariIniN >= Math.max(1, perHariPerlu || 1),
      path: "/dashboard/jobfinder",
      aksi: t("Cari yang cocok", "Find a match"),
    },
    { id: "simpan", t: t("Simpan 3 loker yang menarik", "Save 3 interesting jobs"), d: t("Bahan lamaran untuk besok.", "Material for tomorrow's applications."), path: "/loker", aksi: t("Buka loker", "Open jobs") },
    { id: "latih", t: t("Latih 1 pertanyaan level neraka", "Practise 1 brutal question"), d: t("Jawab dengan suara, maksimal 2 menit.", "Answer out loud, 2 minutes max."), path: "/dashboard/interview", aksi: t("Latihan", "Practise") },
    { id: "cv", t: t("Perbaiki 1 bullet di CV", "Improve 1 bullet in your CV"), d: t("Tambahkan angka: berapa, berapa banyak, berapa persen.", "Add numbers: how much, how many, what percentage."), path: "/dashboard/cvbuilder", aksi: t("Buka CV", "Open CV") },
  ];
  const selesai = MISI.filter((m) => m.otomatis || centang[m.id]).length;

  return (
    <div className="pb-rencana">
      <div className="pb-rencana-atas">
        <div className="pb-rencana-kartu utama" data-muncul="">
          <div className="pb-rencana-cincin">
            <Cincin nilai={data.mingguIni} target={target} />
            <div className="angka">
              <b>{loading ? "…" : data.mingguIni}</b>
              <span>{t("dari", "of")} {target}</span>
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <span className="pb-label">{t("Minggu ini", "This week")}</span>
            <h2>
              {tercapai
                ? t("Target minggu ini tercapai.", "This week's target is reached.")
                : data.mingguIni === 0
                  ? t("Mulai minggu ini dengan satu lamaran.", "Start this week with one application.")
                  : t(`${sisaTarget} lamaran lagi untuk mencapai target.`, `${sisaTarget} more applications to hit your target.`)}
            </h2>
            <p>
              {tercapai
                ? t("Pertahankan ritmenya. Biasanya yang paling rajin melamar yang paling sering dipanggil interview.", "Keep the rhythm. The most consistent applicants usually get the most interviews.")
                : t(`Sekitar ${perHariPerlu} lamaran per hari selama ${sisaHari} hari tersisa.`, `About ${perHariPerlu} applications a day for the ${sisaHari} days left.`)}
            </p>
            <div className="pb-rencana-target" role="radiogroup" aria-label={t("Target lamaran per minggu", "Weekly application target")}>
              <Target size={15} />
              <span>{t("Target per minggu", "Weekly target")}</span>
              {PILIHAN_TARGET.map((n) => (
                <button key={n} type="button" role="radio" aria-checked={target === n} className={target === n ? "on" : ""} onClick={() => setTarget(n)}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pb-rencana-kartu" data-muncul="" style={{ "--tunda": "80ms" }}>
          <div className="pb-rencana-streak">
            <span className={`api ${data.streak > 0 ? "nyala" : ""}`}>
              <Flame size={26} />
            </span>
            <div>
              <b>{data.streak} {t("hari", data.streak === 1 ? "day" : "days")}</b>
              <span>{t("streak melamar", "application streak")}</span>
            </div>
          </div>
          <div className="pb-rencana-minggu">
            {data.minggu.map((d) => (
              <div key={d.k} className={`${d.n ? "isi" : ""} ${d.hariIni ? "kini" : ""}`} title={`${d.k}: ${d.n} lamaran`}>
                <i>{d.n || ""}</i>
                <span>{d.h}</span>
              </div>
            ))}
          </div>
          <div className="pb-rencana-mini">
            <span>
              <Trophy size={14} />{" "}{t("Rekor seminggu:", "Best week:")}{" "}<b>{data.rekor}</b>
            </span>
            <span>
              <CalendarDays size={14} />{" "}{t("Total:", "Total:")}{" "}<b>{data.total}</b>
            </span>
          </div>
        </div>
      </div>

      <div className="pb-rencana-bawah">
        <div className="pb-rencana-kartu" data-muncul="">
          <div className="pb-rencana-judul">
            <h3>{t("Misi hari ini", "Today's missions")}</h3>
            <span>
              {selesai}/{MISI.length} {t("selesai", "done")}
            </span>
          </div>
          <div className="pb-rencana-progres" aria-hidden="true">
            <i style={{ width: `${(selesai / MISI.length) * 100}%` }} />
          </div>
          <ul className="pb-misi">
            {MISI.map((m) => {
              const ok = m.otomatis || centang[m.id];
              return (
                <li key={m.id} className={ok ? "ok" : ""}>
                  <button
                    type="button"
                    className="cek"
                    aria-pressed={Boolean(ok)}
                    disabled={m.otomatis !== undefined}
                    aria-label={ok ? t(`Batalkan: ${m.t}`, `Undo: ${m.t}`) : t(`Tandai selesai: ${m.t}`, `Mark done: ${m.t}`)}
                    onClick={() => setCentang((c) => ({ ...c, [m.id]: !c[m.id] }))}
                  >
                    {ok ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>
                  <div style={{ minWidth: 0 }}>
                    <b>{m.t}</b>
                    <span>{m.d}</span>
                  </div>
                  <a className="pb-link" {...tautan(m.path)}>
                    {m.aksi} <ArrowRight size={14} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pb-rencana-kartu" data-muncul="" style={{ "--tunda": "80ms" }}>
          <div className="pb-rencana-judul">
            <h3>{t("12 minggu terakhir", "Last 12 weeks")}</h3>
            <span>{t("tiap kotak = 1 hari", "each box = 1 day")}</span>
          </div>
          <div className="pb-peta-aktivitas" role="img" aria-label={t("Jumlah lamaran per hari selama 12 minggu terakhir", "Applications per day over the last 12 weeks")}>
            {data.kolom.map((kol, i) => (
              <div key={i}>
                {kol.map((h) => (
                  <i
                    key={h.k}
                    className={h.nanti ? "nanti" : `l${Math.min(4, h.n)}`}
                    title={h.nanti ? "" : `${h.k}: ${h.n} lamaran`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="pb-peta-legenda">
            {t("Sedikit", "Fewer")}
            {[0, 1, 2, 3, 4].map((n) => (
              <i key={n} className={`l${n}`} />
            ))}
            {t("Banyak", "More")}
          </div>
          <div className="pb-rencana-segar">
            <b>{lokerSegar.toLocaleString(lokal())}</b>{" "}{t("loker baru masuk dalam 2 hari terakhir.", "new jobs in the last 2 days.")}{" "}
            <a className="pb-link" {...tautan("/dashboard/jobfinder")}>
              {t("Lihat yang cocok", "See matches")}{" "}<ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
