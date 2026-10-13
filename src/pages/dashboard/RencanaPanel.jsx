import React, { useEffect, useMemo, useState } from "react";
import { Flame, Target, CheckCircle2, Circle, ArrowRight, Trophy, CalendarDays } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useJobs } from "../../context/JobsContext";
import { useApplications } from "../../hooks/useApplications";
import { tautan } from "../../utils/navigasi";

/*
 * Rencana lamar — target mingguan, streak harian, dan misi kecil.
 *
 * Angka lamaran dihitung dari tabel `applications` (Lamaran saya), jadi
 * tidak ada data baru di server. Target dan centang misi disimpan di
 * perangkat, per akun.
 */

const PILIHAN_TARGET = [5, 10, 15, 20];
const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

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
      const t = l.tanggal_lamar || (l.created_at || "").slice(0, 10);
      if (!t) continue;
      perHari.set(t, (perHari.get(t) || 0) + 1);
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
    for (const [t, n] of perHari) {
      const k = tglLokal(awalMinggu(new Date(`${t}T00:00:00`)));
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
      t: `Kirim ${Math.max(1, perHariPerlu || 1)} lamaran hari ini`,
      d: "Tercentang otomatis saat kamu mencatat lamaran.",
      otomatis: data.hariIniN >= Math.max(1, perHariPerlu || 1),
      path: "/dashboard/jobfinder",
      aksi: "Cari yang cocok",
    },
    { id: "simpan", t: "Simpan 3 loker yang menarik", d: "Bahan lamaran untuk besok.", path: "/loker", aksi: "Buka loker" },
    { id: "latih", t: "Latih 1 pertanyaan level neraka", d: "Jawab dengan suara, maksimal 2 menit.", path: "/dashboard/interview", aksi: "Latihan" },
    { id: "cv", t: "Perbaiki 1 bullet di CV", d: "Tambahkan angka: berapa, berapa banyak, berapa persen.", path: "/dashboard/cvbuilder", aksi: "Buka CV" },
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
              <span>dari {target}</span>
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <span className="pb-label">Minggu ini</span>
            <h2>
              {tercapai
                ? "Target minggu ini tercapai."
                : data.mingguIni === 0
                  ? "Mulai minggu ini dengan satu lamaran."
                  : `${sisaTarget} lamaran lagi untuk mencapai target.`}
            </h2>
            <p>
              {tercapai
                ? "Pertahankan ritmenya — yang dipanggil interview biasanya yang paling konsisten melamar."
                : `Sekitar ${perHariPerlu} lamaran per hari selama ${sisaHari} hari tersisa.`}
            </p>
            <div className="pb-rencana-target" role="radiogroup" aria-label="Target lamaran per minggu">
              <Target size={15} />
              <span>Target per minggu</span>
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
              <b>{data.streak} hari</b>
              <span>streak melamar</span>
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
              <Trophy size={14} /> Rekor seminggu: <b>{data.rekor}</b>
            </span>
            <span>
              <CalendarDays size={14} /> Total: <b>{data.total}</b>
            </span>
          </div>
        </div>
      </div>

      <div className="pb-rencana-bawah">
        <div className="pb-rencana-kartu" data-muncul="">
          <div className="pb-rencana-judul">
            <h3>Misi hari ini</h3>
            <span>
              {selesai}/{MISI.length} selesai
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
                    aria-label={ok ? `Batalkan: ${m.t}` : `Tandai selesai: ${m.t}`}
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
            <h3>12 minggu terakhir</h3>
            <span>tiap kotak = 1 hari</span>
          </div>
          <div className="pb-peta-aktivitas" role="img" aria-label="Jumlah lamaran per hari selama 12 minggu terakhir">
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
            Sedikit
            {[0, 1, 2, 3, 4].map((n) => (
              <i key={n} className={`l${n}`} />
            ))}
            Banyak
          </div>
          <div className="pb-rencana-segar">
            <b>{lokerSegar.toLocaleString("id-ID")}</b> loker baru masuk dalam 2 hari terakhir.{" "}
            <a className="pb-link" {...tautan("/dashboard/jobfinder")}>
              Lihat yang cocok <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
