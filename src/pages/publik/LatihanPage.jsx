import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, ChevronRight, Check, X, Lock, Sparkles, ListChecks, PenLine, RotateCcw, Eye, EyeOff,
  CircleCheckBig, Clock, LogIn,
} from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { cariPanduan } from "../../data/panduan";
import { useAuth } from "../../context/AuthContext";
import { useLangganan } from "../../context/LanggananContext";
import { tautan, keHalaman } from "../../utils/navigasi";
import { bacaProgres, simpanProgres, hitungSelesai } from "../../utils/latihanProgres";
import { t } from "../../i18n.js";
import { IkonPanduan } from "./PanduanPage";

/** Paket yang membuka latihan praktik: Pro dan Max. */
const PAKET_LATIHAN = ["aktif", "serius"];
const MIN_JAWABAN = 40;

/* ------------------------------------------------------------------ */
/*  Kuis                                                               */
/* ------------------------------------------------------------------ */

function Soal({ no, soal, pilihan, onPilih }) {
  const dijawab = pilihan != null;
  return (
    <div className="pb-lt-soal">
      <div className="pb-lt-soal-no">
        {t("Soal", "Question")} {no + 1}
      </div>
      <p className="pb-lt-tanya">{soal.q}</p>
      <div className="pb-lt-opsi" role="radiogroup">
        {soal.o.map((o, i) => {
          const benar = i === soal.a;
          const dipilih = i === pilihan;
          const kelas = !dijawab ? "" : benar ? "benar" : dipilih ? "salah" : "redup";
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={dipilih}
              disabled={dijawab}
              className={`pb-lt-pilih ${kelas}`}
              onClick={() => onPilih(i)}
            >
              <span className="pb-lt-huruf">{dijawab && benar ? <Check size={13} /> : dijawab && dipilih ? <X size={13} /> : "ABCD"[i]}</span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      {dijawab && (
        <div className={`pb-lt-jelas ${pilihan === soal.a ? "benar" : "salah"}`}>
          <b>{pilihan === soal.a ? t("Tepat.", "Correct.") : t("Belum tepat.", "Not quite.")}</b> {soal.e}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tugas praktik                                                      */
/* ------------------------------------------------------------------ */

function Tugas({ no, tugas, data, onUbah }) {
  const [lihatContoh, setLihatContoh] = useState(false);
  const jawaban = data?.jawaban || "";
  const cek = data?.cek || [];
  const terpenuhi = tugas.rubrik.filter((_, i) => cek[i]).length;
  const cukup = jawaban.trim().length >= MIN_JAWABAN;

  return (
    <div className="pb-lt-tugas">
      <div className="pb-lt-tugas-head">
        <span className="pb-lt-soal-no">
          {t("Tugas", "Task")} {no + 1}
        </span>
        <h3>{tugas.judul}</h3>
      </div>

      <div className="pb-lt-brief">
        <span className="pb-lt-brief-label">{t("Brief dari klien", "Client brief")}</span>
        <p>{tugas.brief}</p>
      </div>

      <h4>{t("Yang perlu kamu kerjakan", "What to do")}</h4>
      <ol className="pb-lt-langkah">
        {tugas.langkah.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ol>

      <label className="pb-lt-label" htmlFor={`jawab-${no}`}>
        {t("Jawabanmu", "Your answer")}
      </label>
      <textarea
        id={`jawab-${no}`}
        className="pb-lt-jawab"
        rows={8}
        value={jawaban}
        placeholder={t("Tulis jawabanmu di sini. Jawaban tersimpan otomatis di perangkat ini.", "Write your answer here. It's saved automatically on this device.")}
        onChange={(e) => onUbah({ ...data, jawaban: e.target.value, cek })}
      />
      <div className="pb-lt-hitung">
        {jawaban.trim().length} {t("karakter", "characters")}
        {!cukup && jawaban.length > 0 && ` · ${t(`minimal ${MIN_JAWABAN} untuk dihitung selesai`, `at least ${MIN_JAWABAN} to count as done`)}`}
      </div>

      <h4>
        {t("Nilai jawabanmu sendiri", "Check your own answer")}
        <span className="pb-lt-skor">
          {terpenuhi}/{tugas.rubrik.length}
        </span>
      </h4>
      <div className="pb-lt-rubrik">
        {tugas.rubrik.map((r, i) => (
          <label key={r} className={cek[i] ? "on" : ""}>
            <input
              type="checkbox"
              checked={Boolean(cek[i])}
              onChange={(e) => {
                const baru = [...cek];
                baru[i] = e.target.checked;
                onUbah({ ...data, jawaban, cek: baru });
              }}
            />
            <span>{r}</span>
          </label>
        ))}
      </div>

      <button type="button" className="pb-btn pb-btn-outline pb-lt-contoh-btn" onClick={() => setLihatContoh((v) => !v)}>
        {lihatContoh ? <EyeOff size={15} /> : <Eye size={15} />}
        {lihatContoh ? t("Sembunyikan contoh jawaban", "Hide sample answer") : t("Lihat contoh jawaban", "Show sample answer")}
      </button>
      {!lihatContoh && !cukup && (
        <p className="pb-lt-saran">{t("Coba kerjakan dulu sebelum membuka contoh, supaya latihannya lebih terasa.", "Try it yourself before opening the sample. You'll learn more that way.")}</p>
      )}
      {lihatContoh && (
        <div className="pb-lt-contoh">
          <span className="pb-lt-brief-label">{t("Contoh jawaban", "Sample answer")}</span>
          <p>{tugas.contoh}</p>
          <p className="pb-lt-saran">{t("Ini salah satu contoh, bukan satu-satunya jawaban benar. Bandingkan pendekatannya, bukan kata per kata.", "This is one example, not the only right answer. Compare the approach, not the exact words.")}</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gerbang Pro                                                        */
/* ------------------------------------------------------------------ */

function KunciPro({ set, masuk }) {
  const kePaket = () => keHalaman("/dashboard/paket");
  const keMasuk = () => {
    try {
      sessionStorage.setItem("jobly:tujuan", window.location.pathname);
    } catch {
      /* abaikan */
    }
    keHalaman("/login");
  };
  return (
    <div className="pb-lt-kunci">
      <span className="pb-lt-kunci-ikon">
        <Lock size={20} />
      </span>
      <h3>{t("Lanjutkan latihan dengan Pro", "Continue practising with Pro")}</h3>
      <p>
        {t(
          `Soal pertama tadi gratis. Paket Pro dan Max membuka ${set.kuis.length - 1} soal lainnya dan ${set.tugas.length} tugas praktik berikut, lengkap dengan checklist penilaian dan contoh jawaban, untuk semua pekerjaan di Panduan Remote Working.`,
          `The first question was free. Pro and Max unlock the other ${set.kuis.length - 1} questions and these ${set.tugas.length} practice tasks, with scoring checklists and sample answers, for every role in the Remote Working Guide.`,
        )}
      </p>
      <ul className="pb-lt-kunci-daftar">
        {set.tugas.map((x) => (
          <li key={x.judul}>
            <PenLine size={14} />
            {x.judul}
          </li>
        ))}
      </ul>
      <div className="pb-lt-kunci-aksi">
        {!masuk && (
          <button type="button" className="pb-btn pb-btn-outline" onClick={keMasuk}>
            <LogIn size={15} />
            {t("Masuk", "Sign in")}
          </button>
        )}
        <button type="button" className="pb-btn pb-btn-primary" onClick={kePaket}>
          <Sparkles size={15} />
          {t("Lihat paket Pro", "See Pro plans")}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function LatihanPage({ slug }) {
  const p = cariPanduan(slug);
  const { session } = useAuth();
  const langganan = useLangganan();
  const pro = langganan.aktif && PAKET_LATIHAN.includes(langganan.paket);

  const [set, setSet] = useState(undefined);
  const [progres, setProgres] = useState(() => bacaProgres(slug));

  useEffect(() => {
    let batal = false;
    import("../../data/latihan/index.js").then((m) => {
      if (!batal) setSet(m.LATIHAN[slug] || null);
    });
    return () => {
      batal = true;
    };
  }, [slug]);

  useEffect(() => {
    document.title = p
      ? t(`Latihan ${p.judul} · Jobly`, `${p.judul} practice · Jobly`)
      : t("Latihan tidak ditemukan · Jobly", "Practice not found · Jobly");
    window.scrollTo(0, 0);
  }, [p]);

  const perbarui = (fn) =>
    setProgres((lama) => {
      const baru = fn(lama);
      baru.selesai = hitungSelesai(baru, set);
      simpanProgres(slug, baru);
      return baru;
    });

  const skorKuis = useMemo(
    () => (set ? set.kuis.filter((s, i) => progres.kuis[i] === s.a).length : 0),
    [set, progres.kuis],
  );
  const dijawab = set ? set.kuis.filter((_, i) => progres.kuis[i] != null).length : 0;
  const tugasBeres = set ? set.tugas.filter((_, i) => (progres.tugas[i]?.jawaban || "").trim().length >= MIN_JAWABAN).length : 0;
  const total = set ? set.kuis.length + set.tugas.length : 1;
  const persen = Math.round(((dijawab + tugasBeres) / total) * 100);

  if (!p || p.jenis !== "profesi" || set === null) {
    return (
      <PublicLayout aktif="/panduan">
        <div className="pb-wrap pb-pagehead">
          <h1>{t("Latihan tidak ditemukan", "Practice not found")}</h1>
          <p>
            <a className="pb-link" {...tautan("/panduan")}>
              {t("Lihat semua panduan", "See all guides")} <ArrowRight size={14} />
            </a>
          </p>
        </div>
      </PublicLayout>
    );
  }

  const memuat = set === undefined || langganan.loading;
  const kuisTampil = set ? (pro ? set.kuis : set.kuis.slice(0, 1)) : [];

  return (
    <PublicLayout aktif="/panduan">
      <div className="pb-wrap pb-pagehead">
        <nav className="pb-crumb" aria-label={t("Lokasi halaman", "Breadcrumb")}>
          <a {...tautan("/panduan")}>{t("Panduan Remote Working", "Remote Working Guide")}</a>
          <ChevronRight size={14} />
          <a {...tautan(`/panduan/${p.slug}`)}>{p.judul}</a>
        </nav>
        <div className="pb-pd-kepala">
          <span className="pb-pd-ikon besar">
            <IkonPanduan nama={p.ikon} size={26} />
          </span>
          <div>
            <span className="pb-label">
              {t("Latihan praktik", "Practice")} <span className="pb-tag pro">Pro</span>
            </span>
            <h1>{p.judul}</h1>
            <p>
              {t(
                "Uji pemahamanmu lewat situasi kerja nyata, lalu kerjakan brief seperti dari klien sungguhan.",
                "Test yourself with real work situations, then complete briefs like ones from real clients.",
              )}
            </p>
          </div>
        </div>
        {set && (
          <div className="pb-pd-fakta">
            <span>
              <b>{t("Isi", "Contents")}</b>
              {set.kuis.length} {t("soal kuis", "quiz questions")} · {set.tugas.length} {t("tugas praktik", "practice tasks")}
            </span>
            <span>
              <b>{t("Waktu", "Time")}</b>
              <Clock size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
              {t("sekitar 30 menit", "about 30 minutes")}
            </span>
            {pro && (
              <span>
                <b>{t("Progres", "Progress")}</b>
                <span className="pb-lt-bar" aria-label={`${persen}%`}>
                  <i style={{ width: `${persen}%` }} />
                </span>
                {progres.selesai ? t("Selesai", "Done") : `${persen}%`}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pb-wrap pb-lt-wrap">
        {memuat ? (
          <div className="pb-lt-muat" aria-busy="true">
            {t("Memuat latihan...", "Loading practice...")}
          </div>
        ) : (
          <>
            <section aria-labelledby="lt-kuis">
              <div className="pb-lt-bagian-head">
                <h2 id="lt-kuis">
                  <ListChecks size={20} />
                  {t("Kuis situasi kerja", "Work situation quiz")}
                </h2>
                {pro && dijawab > 0 && (
                  <span className="pb-lt-skor besar">
                    {t("Benar", "Correct")} {skorKuis}/{set.kuis.length}
                  </span>
                )}
              </div>
              {kuisTampil.map((s, i) => (
                <Soal
                  key={i}
                  no={i}
                  soal={s}
                  pilihan={progres.kuis[i]}
                  onPilih={(pil) => perbarui((lama) => ({ ...lama, kuis: { ...lama.kuis, [i]: pil } }))}
                />
              ))}
              {pro && dijawab > 0 && (
                <button
                  type="button"
                  className="pb-btn pb-btn-outline"
                  onClick={() => perbarui((lama) => ({ ...lama, kuis: {} }))}
                >
                  <RotateCcw size={15} />
                  {t("Ulangi kuis", "Retake quiz")}
                </button>
              )}
            </section>

            {pro ? (
              <section aria-labelledby="lt-tugas" style={{ marginTop: 48 }}>
                <div className="pb-lt-bagian-head">
                  <h2 id="lt-tugas">
                    <PenLine size={20} />
                    {t("Tugas praktik", "Practice tasks")}
                  </h2>
                </div>
                {set.tugas.map((x, i) => (
                  <Tugas
                    key={x.judul}
                    no={i}
                    tugas={x}
                    data={progres.tugas[i]}
                    onUbah={(d) => perbarui((lama) => ({ ...lama, tugas: { ...lama.tugas, [i]: d } }))}
                  />
                ))}
                {progres.selesai && (
                  <div className="pb-lt-beres">
                    <CircleCheckBig size={22} />
                    <div>
                      <b>{t("Latihan selesai. Kerja bagus!", "Practice complete. Nice work!")}</b>
                      <p>
                        {t(
                          "Jawaban terbaikmu bisa jadi bahan portofolio. Langkah berikutnya, cari loker yang sesuai.",
                          "Your best answers can go into your portfolio. Next, look for a matching job.",
                        )}
                      </p>
                      <a className="pb-link" {...tautan(p.remoteQ ? `/remote?q=${encodeURIComponent(p.remoteQ)}` : "/remote")}>
                        {t("Lihat loker remote", "See remote jobs")} <ArrowRight size={13} />
                      </a>
                    </div>
                  </div>
                )}
              </section>
            ) : (
              <KunciPro set={set} masuk={Boolean(session)} />
            )}

            <p className="pb-lt-catatan">
              {t(
                "Progres dan jawaban latihan disimpan di browser perangkat ini, tidak dikirim ke server.",
                "Your progress and answers are stored in this device's browser, not sent to our servers.",
              )}{" "}
              <a className="pb-link" {...tautan(`/panduan/${p.slug}`)}>
                {t("Kembali ke panduan", "Back to the guide")}
              </a>
            </p>
          </>
        )}
      </div>
    </PublicLayout>
  );
}
