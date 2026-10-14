import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, ChevronRight, Check, X, Lock, Sparkles, ListChecks, PenLine, RotateCcw, Eye, EyeOff,
  CircleCheckBig, Clock, LogIn, Send, MessagesSquare, Star, CornerDownRight, AlertTriangle,
} from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { cariPanduan } from "../../data/panduan";
import { useAuth } from "../../context/AuthContext";
import { useLangganan } from "../../context/LanggananContext";
import { tautan, keHalaman } from "../../utils/navigasi";
import {
  bacaProgres, simpanProgres, hitungSelesai, tugasSelesai, MIN_JAWABAN, MIN_REVISI,
} from "../../utils/latihanProgres";
import { t } from "../../i18n.js";
import { IkonPanduan } from "./PanduanPage";

/** Paket yang membuka latihan praktik: semua paket berbayar (Starter, Pro, Max). */
const PAKET_LATIHAN = ["coba", "aktif", "serius"];

/* ------------------------------------------------------------------ */
/*  Pesan bergaya aplikasi chat/email                                  */
/* ------------------------------------------------------------------ */

const WARNA_KANAL = { WhatsApp: "wa", Email: "email", Upwork: "upwork", Slack: "slack", Telegram: "wa", Fiverr: "upwork" };

function Pesan({ dari, kanal, waktu, tenggat, children, saya = false }) {
  const inisial = (dari?.nama || "?").trim().charAt(0).toUpperCase();
  return (
    <div className={`pb-lt-pesan ${saya ? "saya" : ""}`}>
      {!saya && <span className="pb-lt-avatar">{inisial}</span>}
      <div className="pb-lt-gelembung">
        <div className="pb-lt-pesan-kepala">
          <b>{saya ? t("Kamu", "You") : dari?.nama}</b>
          {!saya && dari?.peran && <span>{dari.peran}</span>}
          {kanal && <span className={`pb-lt-kanal ${WARNA_KANAL[kanal] || ""}`}>{kanal}</span>}
          {waktu && <span className="pb-lt-waktu">{waktu}</span>}
        </div>
        <div className="pb-lt-pesan-isi">{children}</div>
        {tenggat && (
          <div className="pb-lt-tenggat">
            <Clock size={12} />
            {t("Tenggat", "Due")}: {tenggat}
          </div>
        )}
      </div>
    </div>
  );
}

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
/*  Simulasi hari kerja                                                */
/* ------------------------------------------------------------------ */

const LABEL_SKOR = {
  2: () => t("Tepat", "Spot on"),
  1: () => t("Kurang tepat", "Could be better"),
  0: () => t("Berisiko", "Risky"),
};

function Simulasi({ sim, pilihan, onPilih, onUlang }) {
  const jawab = pilihan || [];
  const sampai = Math.min(jawab.filter((x) => x != null).length, sim.langkah.length);
  const selesai = sampai >= sim.langkah.length;
  const skor = sim.langkah.reduce((n, l, i) => n + (jawab[i] != null ? l.pilihan[jawab[i]].skor : 0), 0);
  const maks = sim.langkah.length * 2;
  const bintang = Math.max(1, Math.round((skor / maks) * 4) + 1);

  return (
    <div className="pb-lt-sim">
      <div className="pb-lt-sim-konteks">
        <b>{sim.judul}</b>
        <p>{sim.konteks}</p>
      </div>

      {sim.langkah.slice(0, sampai + (selesai ? 0 : 1)).map((l, i) => {
        const pil = jawab[i];
        const terpilih = pil != null ? l.pilihan[pil] : null;
        return (
          <div key={i} className="pb-lt-sim-langkah">
            <Pesan dari={l.dari} kanal={l.kanal} waktu={l.waktu}>
              {l.pesan}
            </Pesan>
            {terpilih ? (
              <>
                <Pesan saya>{terpilih.teks}</Pesan>
                <div className={`pb-lt-umpan s${terpilih.skor}`}>
                  {terpilih.skor === 0 ? <AlertTriangle size={15} /> : terpilih.skor === 2 ? <CircleCheckBig size={15} /> : <CornerDownRight size={15} />}
                  <div>
                    <b>{LABEL_SKOR[terpilih.skor]()}</b> {terpilih.umpan}
                  </div>
                </div>
              </>
            ) : (
              <div className="pb-lt-sim-pilih">
                <span className="pb-lt-brief-label">{t("Apa balasanmu?", "How do you reply?")}</span>
                {l.pilihan.map((o, j) => (
                  <button key={j} type="button" className="pb-lt-pilih" onClick={() => onPilih(i, j)}>
                    <span className="pb-lt-huruf">{"ABC"[j]}</span>
                    <span>{o.teks}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {selesai && (
        <div className="pb-lt-rating">
          <div className="pb-lt-bintang" aria-label={`${bintang}/5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} size={20} className={n <= bintang ? "on" : ""} />
            ))}
          </div>
          <b>
            {t("Rating dari klien", "Client rating")}: {bintang}/5 · {t("skor", "score")} {skor}/{maks}
          </b>
          <p>
            {bintang >= 5
              ? t("Klien sangat puas dan kemungkinan besar memperpanjang kontrak.", "The client is delighted and likely to extend your contract.")
              : bintang >= 4
                ? t("Klien puas. Beberapa keputusan masih bisa lebih baik, baca kembali umpan baliknya.", "The client is happy. A few calls could be better, so review the feedback.")
                : t("Klien mulai ragu. Pelajari umpan balik di setiap langkah, lalu coba lagi.", "The client is having doubts. Study the feedback at each step and try again.")}
          </p>
          <button type="button" className="pb-btn pb-btn-outline" onClick={onUlang}>
            <RotateCcw size={15} />
            {t("Ulangi simulasi", "Replay simulation")}
          </button>
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
  const d = data || {};
  const jawaban = d.jawaban || "";
  const cek = d.cek || [];
  const terpenuhi = tugas.rubrik.filter((_, i) => cek[i]).length;
  const cukup = jawaban.trim().length >= MIN_JAWABAN;
  const ubah = (x) => onUbah({ ...d, ...x });
  const dari = tugas.dari || { nama: t("Klien", "Client") };

  return (
    <div className="pb-lt-tugas">
      <div className="pb-lt-tugas-head">
        <span className="pb-lt-soal-no">
          {t("Tugas", "Task")} {no + 1}
        </span>
        <h3>{tugas.judul}</h3>
      </div>

      <Pesan dari={dari} kanal={tugas.kanal} tenggat={tugas.tenggat}>
        {tugas.brief}
      </Pesan>

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
        readOnly={Boolean(d.dikirim)}
        placeholder={t("Tulis jawabanmu di sini. Jawaban tersimpan otomatis di perangkat ini.", "Write your answer here. It's saved automatically on this device.")}
        onChange={(e) => ubah({ jawaban: e.target.value })}
      />
      <div className="pb-lt-hitung">
        {jawaban.trim().length} {t("karakter", "characters")}
        {!cukup && jawaban.length > 0 && ` · ${t(`minimal ${MIN_JAWABAN} sebelum dikirim`, `at least ${MIN_JAWABAN} before sending`)}`}
      </div>

      {tugas.revisi && !d.dikirim && (
        <button
          type="button"
          className="pb-btn pb-btn-primary pb-lt-kirim"
          disabled={!cukup}
          onClick={() => ubah({ dikirim: true })}
        >
          <Send size={15} />
          {t(`Kirim ke ${dari.nama}`, `Send to ${dari.nama}`)}
        </button>
      )}

      {tugas.revisi && d.dikirim && (
        <div className="pb-lt-balasan">
          <Pesan saya kanal={tugas.kanal}>
            {t("Sudah saya kirim, mohon dicek.", "Sent over, please take a look.")}
          </Pesan>
          <Pesan dari={dari} kanal={tugas.kanal}>
            {tugas.revisi.pesan}
          </Pesan>
          <h4>{t("Yang perlu diperhatikan saat merevisi", "What to keep in mind for the revision")}</h4>
          <ul className="pb-lt-langkah">
            {tugas.revisi.petunjuk.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <label className="pb-lt-label" htmlFor={`revisi-${no}`}>
            {t("Revisimu", "Your revision")}
          </label>
          <textarea
            id={`revisi-${no}`}
            className="pb-lt-jawab"
            rows={6}
            value={d.revisi || ""}
            placeholder={t("Tulis versi revisi atau balasanmu untuk klien.", "Write your revised version or reply to the client.")}
            onChange={(e) => ubah({ revisi: e.target.value })}
          />
          <div className="pb-lt-hitung">
            {(d.revisi || "").trim().length} {t("karakter", "characters")}
            {(d.revisi || "").trim().length < MIN_REVISI && ` · ${t(`minimal ${MIN_REVISI} untuk dihitung selesai`, `at least ${MIN_REVISI} to count as done`)}`}
          </div>
          <button type="button" className="pb-lt-tautan-kecil" onClick={() => ubah({ dikirim: false })}>
            {t("Ubah jawaban pertama", "Edit the first answer")}
          </button>
        </div>
      )}

      <h4>
        {t("Nilai hasil kerjamu sendiri", "Check your own work")}
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
                ubah({ cek: baru });
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
      <h3>{t("Lanjutkan latihan dengan paket berbayar", "Continue with a paid plan")}</h3>
      <p>
        {t(
          `Soal pertama tadi gratis. Semua paket berbayar, mulai Starter Rp9.000, membuka ${set.kuis.length - 1} soal lainnya, simulasi hari kerja, dan ${set.tugas.length} tugas dari klien lengkap dengan permintaan revisi, checklist penilaian, dan contoh jawaban, untuk semua pekerjaan di Panduan Remote Working.`,
          `The first question was free. Every paid plan, from Starter at Rp9,000, unlocks the other ${set.kuis.length - 1} questions, a workday simulation, and ${set.tugas.length} client tasks with revision requests, scoring checklists, and sample answers, for every role in the Remote Working Guide.`,
        )}
      </p>
      <ul className="pb-lt-kunci-daftar">
        {set.simulasi && (
          <li>
            <MessagesSquare size={14} />
            {set.simulasi.judul}
          </li>
        )}
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
          {t("Lihat paket", "See plans")}
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
  const tugasBeres = set ? set.tugas.filter((x, i) => tugasSelesai(x, progres.tugas[i])).length : 0;
  const simJalan = set?.simulasi ? (progres.simulasi || []).filter((x) => x != null).length : 0;
  const total = set ? set.kuis.length + set.tugas.length + (set.simulasi ? set.simulasi.langkah.length : 0) : 1;
  const persen = Math.round(((dijawab + tugasBeres + simJalan) / total) * 100);

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
              {t("Latihan praktik", "Practice")} <span className="pb-tag pro">{t("Berbayar", "Paid")}</span>
            </span>
            <h1>{p.judul}</h1>
            <p>
              {t(
                "Rasakan kerja sungguhan: jawab situasi kerja, hadapi pesan yang masuk sepanjang hari, lalu kerjakan brief klien sampai tahap revisi.",
                "Get a feel for the real job: handle work situations, respond to messages through the day, then complete client briefs through to revision.",
              )}
            </p>
          </div>
        </div>
        {set && (
          <div className="pb-pd-fakta">
            <span>
              <b>{t("Isi", "Contents")}</b>
              {set.kuis.length} {t("soal", "questions")}
              {set.simulasi ? ` · ${t("simulasi hari kerja", "workday simulation")}` : ""} · {set.tugas.length} {t("tugas klien", "client tasks")}
            </span>
            <span>
              <b>{t("Waktu", "Time")}</b>
              <Clock size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
              {t("sekitar 45 menit", "about 45 minutes")}
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
                  {t("1. Kuis situasi kerja", "1. Work situation quiz")}
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
                <button type="button" className="pb-btn pb-btn-outline" onClick={() => perbarui((lama) => ({ ...lama, kuis: {} }))}>
                  <RotateCcw size={15} />
                  {t("Ulangi kuis", "Retake quiz")}
                </button>
              )}
            </section>

            {pro ? (
              <>
                {set.simulasi && (
                  <section aria-labelledby="lt-sim" style={{ marginTop: 48 }}>
                    <div className="pb-lt-bagian-head">
                      <h2 id="lt-sim">
                        <MessagesSquare size={20} />
                        {t("2. Simulasi hari kerja", "2. Workday simulation")}
                      </h2>
                    </div>
                    <p className="pb-lt-pengantar">
                      {t(
                        "Pesan akan masuk satu per satu seperti di hari kerja sungguhan. Pilih balasan yang menurutmu paling tepat. Setiap pilihan langsung mendapat umpan balik.",
                        "Messages arrive one by one, like on a real workday. Pick the reply you think is best. Each choice gets instant feedback.",
                      )}
                    </p>
                    <Simulasi
                      sim={set.simulasi}
                      pilihan={progres.simulasi}
                      onPilih={(i, j) =>
                        perbarui((lama) => {
                          const s = [...(lama.simulasi || [])];
                          s[i] = j;
                          return { ...lama, simulasi: s };
                        })
                      }
                      onUlang={() => perbarui((lama) => ({ ...lama, simulasi: [] }))}
                    />
                  </section>
                )}

                <section aria-labelledby="lt-tugas" style={{ marginTop: 48 }}>
                  <div className="pb-lt-bagian-head">
                    <h2 id="lt-tugas">
                      <PenLine size={20} />
                      {set.simulasi ? t("3. Tugas dari klien", "3. Client tasks") : t("2. Tugas dari klien", "2. Client tasks")}
                    </h2>
                  </div>
                  <p className="pb-lt-pengantar">
                    {t(
                      "Kerjakan brief seperti pekerjaan sungguhan. Setelah dikirim, klien akan membalas dengan permintaan revisi.",
                      "Work on each brief like a real job. Once you send it, the client will reply with a revision request.",
                    )}
                  </p>
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
              </>
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
