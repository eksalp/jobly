import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleCheckBig, Clock, Dumbbell, Globe, Lightbulb,
  Info, Loader2, PenLine, RotateCcw, TriangleAlert, X, GraduationCap, ListChecks,
} from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { cariPanduan } from "../../data/panduan";
import { muatKelas, adaKelas } from "../../data/kelas/index.js";
import { bacaKelas, simpanKelas, babSelesai } from "../../utils/kelasProgres";
import { tautan } from "../../utils/navigasi";
import { t, bahasa } from "../../i18n.js";

/* Urutan pilihan kuis diacak tetap (sama setiap kali dibuka) supaya jawaban benar tidak selalu di atas */
function urutan(kunci, n) {
  let h = 2166136261;
  for (let i = 0; i < kunci.length; i++) h = Math.imul(h ^ kunci.charCodeAt(i), 16777619);
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

const IKON_KOTAK = { fakta: Info, tips: Lightbulb, awas: TriangleAlert };
const LABEL_KOTAK = { fakta: "Perlu diketahui", tips: "Tips", awas: "Hati-hati" };

function Blok({ b, kunciLatihan, latihan, setLatihan }) {
  const [buka, setBuka] = useState(false);
  switch (b.t) {
    case "p":
      return <p>{b.teks}</p>;
    case "poin":
      return (
        <div className="kl-poin">
          {b.judul && <h3>{b.judul}</h3>}
          <ul>
            {b.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      );
    case "istilah":
      return (
        <div className="kl-istilah">
          <h3>
            <BookOpen size={16} /> Istilah penting
          </h3>
          <dl>
            {b.items.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "contoh":
      return (
        <figure className="kl-contoh">
          <figcaption>{b.judul}</figcaption>
          <div className="kl-contoh-dua">
            <div className="kurang">
              <span>
                <X size={14} /> Kurang tepat
              </span>
              <p>{b.kurang}</p>
            </div>
            <div className="lebih">
              <span>
                <Check size={14} /> Lebih baik
              </span>
              <p>{b.lebih}</p>
            </div>
          </div>
          <p className="kl-contoh-kenapa">
            <b>Kenapa?</b> {b.kenapa}
          </p>
        </figure>
      );
    case "kotak": {
      const Ik = IKON_KOTAK[b.gaya] || Info;
      return (
        <aside className={`kl-kotak ${b.gaya}`}>
          <Ik size={18} />
          <div>
            <b>{b.judul || LABEL_KOTAK[b.gaya]}</b>
            <p>{b.teks}</p>
          </div>
        </aside>
      );
    }
    case "langkah":
      return (
        <ol className="kl-langkah">
          {b.items.map(([j, x]) => (
            <li key={j}>
              <b>{j}</b>
              <span>{x}</span>
            </li>
          ))}
        </ol>
      );
    case "latihan":
      return (
        <div className="kl-latihan">
          <h3>
            <PenLine size={16} /> Latihan
          </h3>
          <p>{b.soal}</p>
          <textarea
            rows={4}
            placeholder="Tulis jawabanmu di sini dulu, baru bandingkan dengan contoh."
            value={latihan[kunciLatihan] || ""}
            onChange={(e) => setLatihan(kunciLatihan, e.target.value)}
          />
          {buka ? (
            <div className="kl-latihan-jawab">
              <b>Contoh jawaban</b>
              <p>{b.jawaban}</p>
            </div>
          ) : (
            <button type="button" className="kl-btn garis" onClick={() => setBuka(true)}>
              Lihat contoh jawaban
            </button>
          )}
        </div>
      );
    default:
      return null;
  }
}

function Kuis({ slug, bab, jawab, pilih, ulang }) {
  const benar = bab.kuis.filter((s, i) => jawab[i] === 0).length;
  const lengkap = bab.kuis.every((_, i) => jawab[i] != null);
  return (
    <section className="kl-kuis" aria-label="Kuis bab">
      <h2>
        <ListChecks size={20} /> Cek pemahaman
      </h2>
      {bab.kuis.map((s, i) => {
        const ur = urutan(`${slug}:${bab.id}:${i}`, s.o.length);
        const dipilih = jawab[i];
        return (
          <div key={s.q} className="kl-soal">
            <p className="kl-soal-q">
              <span>{i + 1}</span>
              {s.q}
            </p>
            <div className="kl-opsi">
              {ur.map((oi) => {
                const status = dipilih == null ? "" : oi === 0 ? "benar" : oi === dipilih ? "salah" : "redup";
                return (
                  <button
                    key={oi}
                    type="button"
                    className={`kl-opsi-btn ${status}`}
                    disabled={dipilih != null}
                    onClick={() => pilih(i, oi)}
                  >
                    {status === "benar" && <Check size={15} />}
                    {status === "salah" && <X size={15} />}
                    <span>{s.o[oi]}</span>
                  </button>
                );
              })}
            </div>
            {dipilih != null && (
              <p className={`kl-pembahasan ${dipilih === 0 ? "ok" : "no"}`}>
                <b>{dipilih === 0 ? "Tepat." : "Belum tepat."}</b> {s.e}
              </p>
            )}
          </div>
        );
      })}
      {lengkap && (
        <div className="kl-skor">
          <span>
            Skor bab ini: <b>{benar}</b> dari {bab.kuis.length}
          </span>
          <button type="button" className="kl-btn garis kecil" onClick={ulang}>
            <RotateCcw size={14} /> Ulangi kuis
          </button>
        </div>
      )}
    </section>
  );
}

export function KelasPage({ slug }) {
  const p = cariPanduan(slug);
  const [kelas, setKelas] = useState(null);
  const [gagal, setGagal] = useState(false);
  const [data, setData] = useState(() => bacaKelas(slug));
  const [aktif, setAktif] = useState(() => bacaKelas(slug).terakhir ?? -1);

  useEffect(() => {
    let batal = false;
    muatKelas(slug)
      .then((k) => {
        if (batal) return;
        if (k) setKelas(k);
        else setGagal(true);
      })
      .catch(() => !batal && setGagal(true));
    return () => {
      batal = true;
    };
  }, [slug]);

  useEffect(() => {
    document.title = kelas ? `${kelas.judul} · Jobly` : t("Kelas Dasar · Jobly", "Starter Course · Jobly");
  }, [kelas]);

  // Di layar kecil daftar bab menjadi baris geser; pastikan bab aktif terlihat
  useEffect(() => {
    const nav = document.querySelector(".kl-side");
    const el = nav?.querySelector(".kl-side-item.aktif");
    if (nav && el && nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft = el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2;
    }
  }, [aktif, kelas]);

  const ubah = (fn) =>
    setData((d) => {
      const baru = fn(d);
      simpanKelas(slug, baru);
      return baru;
    });

  const pindah = (i) => {
    setAktif(i);
    ubah((d) => ({ ...d, terakhir: i }));
    const el = document.getElementById("kl-mulai");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const jumlahBab = kelas?.bab.length || 0;
  const selesai = useMemo(() => (kelas ? kelas.bab.filter((b) => babSelesai(b, data)).length : 0), [kelas, data]);
  const persen = jumlahBab ? Math.round((selesai / jumlahBab) * 100) : 0;

  if (gagal || !adaKelas(slug)) {
    return (
      <PublicLayout aktif="/panduan">
        <div className="pb-wrap pb-pagehead">
          <h1>{t("Kelas tidak ditemukan", "Course not found")}</h1>
          <p>
            <a className="pb-link" {...tautan(p ? `/panduan/${slug}` : "/panduan")}>
              {t("Kembali ke panduan", "Back to the guide")} <ArrowRight size={14} />
            </a>
          </p>
        </div>
      </PublicLayout>
    );
  }

  const bab = kelas && aktif >= 0 && aktif < jumlahBab ? kelas.bab[aktif] : null;
  const akhir = kelas && aktif >= jumlahBab;

  let totalBenar = 0;
  let totalSoal = 0;
  if (kelas) {
    kelas.bab.forEach((b) => {
      totalSoal += b.kuis.length;
      const j = data.kuis[b.id] || {};
      b.kuis.forEach((_, i) => {
        if (j[i] === 0) totalBenar += 1;
      });
    });
  }

  return (
    <PublicLayout aktif="/panduan">
      <div className="pb-wrap pb-pagehead">
        <nav className="pb-crumb" aria-label={t("Lokasi halaman", "Breadcrumb")}>
          <a {...tautan("/")}>{t("Beranda", "Home")}</a>
          <ChevronRight size={14} />
          <a {...tautan("/panduan")}>{t("Panduan Remote Working", "Remote Working Guide")}</a>
          {p && (
            <>
              <ChevronRight size={14} />
              <a {...tautan(`/panduan/${slug}`)}>{p.judul}</a>
            </>
          )}
        </nav>
        <span className="pb-label">{t("Kelas Dasar · Gratis", "Starter Course · Free")}</span>
        <h1>{kelas ? kelas.judul : t("Memuat kelas…", "Loading course…")}</h1>
        {kelas && <p>{kelas.ringkas}</p>}
        {kelas && (
          <div className="kl-meta">
            <span>
              <Clock size={15} /> {kelas.durasi}
            </span>
            <span>
              <BookOpen size={15} /> {jumlahBab} bab
            </span>
            <span>
              <ListChecks size={15} /> {totalSoal} soal kuis
            </span>
            <span className="kl-meta-progres">
              <span className="kl-bar">
                <i style={{ width: `${persen}%` }} />
              </span>
              {persen}% selesai
            </span>
          </div>
        )}
        {bahasa() === "en" && (
          <p className="kl-catatan-en">
            <Globe size={15} /> This course is currently available in Indonesian only.
          </p>
        )}
      </div>

      {!kelas ? (
        <div className="pb-wrap kl-muat">
          <Loader2 size={22} className="pb-po-putar" />
        </div>
      ) : (
        <div className="pb-wrap kl-wrap" id="kl-mulai">
          <nav className="kl-side" aria-label="Daftar bab">
            <button type="button" className={`kl-side-item ${aktif < 0 ? "aktif" : ""}`} onClick={() => pindah(-1)}>
              <span className="kl-side-no">
                <GraduationCap size={14} />
              </span>
              <span>Pengantar</span>
            </button>
            {kelas.bab.map((b, i) => {
              const ok = babSelesai(b, data);
              return (
                <button
                  key={b.id}
                  type="button"
                  className={`kl-side-item ${aktif === i ? "aktif" : ""} ${ok ? "ok" : ""}`}
                  onClick={() => pindah(i)}
                >
                  <span className="kl-side-no">{ok ? <Check size={14} /> : i + 1}</span>
                  <span>
                    {b.judul}
                    <small>{b.menit} menit</small>
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              className={`kl-side-item ${akhir ? "aktif" : ""}`}
              onClick={() => pindah(jumlahBab)}
            >
              <span className="kl-side-no">
                <CircleCheckBig size={14} />
              </span>
              <span>Tugas akhir & langkah berikutnya</span>
            </button>
          </nav>

          <article className="kl-isi">
            {aktif < 0 && (
              <div className="kl-pengantar">
                <h2>Yang akan kamu kuasai</h2>
                <ul className="kl-hasil">
                  {kelas.hasil.map((h) => (
                    <li key={h}>
                      <Check size={16} />
                      {h}
                    </li>
                  ))}
                </ul>
                <p className="kl-untuk">
                  <b>Cocok untuk:</b> {kelas.untuk}
                </p>
                <p className="kl-cara">
                  Setiap bab berisi penjelasan, istilah penting, contoh sebelum dan sesudah, latihan dengan contoh jawaban,
                  dan kuis singkat. Progresmu tersimpan otomatis di perangkat ini.
                </p>
                <button type="button" className="kl-btn" onClick={() => pindah(selesai > 0 && selesai < jumlahBab ? kelas.bab.findIndex((b) => !babSelesai(b, data)) : 0)}>
                  {selesai > 0 && selesai < jumlahBab ? "Lanjutkan belajar" : "Mulai bab 1"} <ArrowRight size={16} />
                </button>
              </div>
            )}

            {bab && (
              <>
                <header className="kl-bab-kepala">
                  <span>
                    Bab {aktif + 1} dari {jumlahBab} · {bab.menit} menit
                  </span>
                  <h2>{bab.judul}</h2>
                </header>
                <div className="kl-blok">
                  {bab.isi.map((b, i) => (
                    <Blok
                      key={`${bab.id}-${i}`}
                      b={b}
                      kunciLatihan={`${bab.id}:${i}`}
                      latihan={data.latihan || {}}
                      setLatihan={(k, v) => ubah((d) => ({ ...d, latihan: { ...(d.latihan || {}), [k]: v } }))}
                    />
                  ))}
                </div>
                <Kuis
                  slug={slug}
                  bab={bab}
                  jawab={data.kuis[bab.id] || {}}
                  pilih={(i, oi) =>
                    ubah((d) => ({ ...d, kuis: { ...d.kuis, [bab.id]: { ...(d.kuis[bab.id] || {}), [i]: oi } } }))
                  }
                  ulang={() =>
                    ubah((d) => {
                      const k = { ...d.kuis };
                      delete k[bab.id];
                      return { ...d, kuis: k };
                    })
                  }
                />
                <div className="kl-nav">
                  <button type="button" className="kl-btn garis" onClick={() => pindah(aktif - 1)}>
                    <ArrowLeft size={16} /> {aktif === 0 ? "Pengantar" : "Bab sebelumnya"}
                  </button>
                  <button type="button" className="kl-btn" onClick={() => pindah(aktif + 1)}>
                    {aktif + 1 < jumlahBab ? "Bab berikutnya" : "Tugas akhir"} <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}

            {akhir && (
              <div className="kl-akhir">
                <div className="kl-akhir-skor">
                  <CircleCheckBig size={28} />
                  <div>
                    <b>
                      {selesai === jumlahBab ? "Semua bab selesai." : `${selesai} dari ${jumlahBab} bab selesai.`}
                    </b>
                    <span>
                      Total jawaban benar: {totalBenar} dari {totalSoal} soal
                    </span>
                  </div>
                </div>
                {kelas.tugasAkhir && (
                  <section className="kl-tugas">
                    <h2>{kelas.tugasAkhir.judul}</h2>
                    <p>{kelas.tugasAkhir.brief}</p>
                    <h3>Periksa hasilmu dengan daftar ini</h3>
                    <ul>
                      {kelas.tugasAkhir.kriteria.map((k) => (
                        <li key={k}>
                          <Check size={15} />
                          {k}
                        </li>
                      ))}
                    </ul>
                    <p className="kl-tugas-cat">Hasil tugas akhir ini bisa langsung kamu jadikan karya pertama di portofolio.</p>
                  </section>
                )}
                <h2 className="kl-lanjut-judul">Langkah berikutnya</h2>
                <div className="kl-lanjut">
                  <a {...tautan(`/latihan/${slug}`)}>
                    <Dumbbell size={18} />
                    <span>
                      <b>Latihan praktik</b>
                      Kuis situasi kerja dan brief klien sungguhan, lengkap dengan revisi.
                    </span>
                    <ArrowRight size={15} />
                  </a>
                  {p && (
                    <a {...tautan(`/panduan/${slug}`)}>
                      <BookOpen size={18} />
                      <span>
                        <b>Panduan lengkap</b>
                        Penghasilan, langkah memulai, platform, dan cara lolos seleksi.
                      </span>
                      <ArrowRight size={15} />
                    </a>
                  )}
                  <a {...tautan(p?.remoteQ ? `/remote?q=${encodeURIComponent(p.remoteQ)}` : "/remote")}>
                    <Globe size={18} />
                    <span>
                      <b>Cari lowongannya</b>
                      Lowongan remote yang cocok dengan keterampilan ini.
                    </span>
                    <ArrowRight size={15} />
                  </a>
                </div>
                <div className="kl-nav">
                  <button type="button" className="kl-btn garis" onClick={() => pindah(jumlahBab - 1)}>
                    <ArrowLeft size={16} /> Bab terakhir
                  </button>
                </div>
              </div>
            )}
          </article>
        </div>
      )}
    </PublicLayout>
  );
}
