import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, SkipForward, Clock, Loader2, Lock, ArrowRight, Users, Check, MessageSquareText, Play, LogOut } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useLangganan } from "../../context/LanggananContext";
import { AvatarFgd } from "../../components/ui/AvatarFgd";
import { useSuaraFgd, MAKS_DETIK_BICARA } from "../../hooks/useSuaraFgd";
import { TOPIK_FGD, PESERTA_FGD, DURASI_FGD_MENIT } from "../../data/fgdTopik";
import { t, bahasa } from "../../i18n.js";

const KURSI = ["moderator", "dimas", "ayu", "fajar", "kamu"];
const mmss = (d) => `${String(Math.floor(Math.max(0, d) / 60)).padStart(2, "0")}:${String(Math.floor(Math.max(0, d) % 60)).padStart(2, "0")}`;

async function panggil(body) {
  const { data, error } = await supabase.functions.invoke("fgd", { body });
  if (error) {
    let pesan = error.message;
    try {
      const isi = await error.context?.json?.();
      if (isi?.error) pesan = isi.error;
    } catch {
      /* biarkan pesan bawaan */
    }
    throw new Error(pesan);
  }
  return data;
}

/* ------------------------------------------------------------------ */
/*  Ruang FGD (ilustrasi meja bundar)                                  */
/* ------------------------------------------------------------------ */

export function Ruang({ pembicara, berpikir, tingkatAi, tingkatMic, merekam, judul, sisa }) {
  return (
    <div className="fgd-ruang">
      <div className="fgd-meja">
        <span className="fgd-meja-label">{t("Topik", "Topic")}</span>
        <b>{judul}</b>
        <span className={`fgd-jam ${sisa <= 120 ? "mepet" : ""}`}>
          <Clock size={13} /> {mmss(sisa)}
        </span>
      </div>
      {KURSI.map((k) => {
        const aktif = k === "kamu" ? merekam : pembicara === k;
        return (
          <div key={k} className={`fgd-kursi k-${k} ${aktif ? "aktif" : ""}`}>
            <div className="fgd-cincin" style={{ "--denyut": aktif ? (k === "kamu" ? tingkatMic : tingkatAi) : 0 }}>
              <AvatarFgd siapa={k} bicara={aktif && k !== "kamu"} tingkat={tingkatAi} berpikir={berpikir && k !== "kamu" && k !== "moderator"} ukuran={k === "moderator" ? 100 : 116} />
            </div>
            <span className="fgd-nama">
              {k === "kamu" ? t("Kamu", "You") : PESERTA_FGD[k].nama}
              {k === "moderator" && <small>{PESERTA_FGD.moderator.peran}</small>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hasil penilaian                                                    */
/* ------------------------------------------------------------------ */

const ASPEK = [
  ["inisiatif", t("Inisiatif", "Initiative")],
  ["kualitas_argumen", t("Kualitas argumen", "Argument quality")],
  ["mendengarkan", t("Mendengarkan & menanggapi", "Listening & responding")],
  ["kerja_sama", t("Kerja sama", "Collaboration")],
  ["kepemimpinan", t("Kepemimpinan", "Leadership")],
  ["komunikasi", t("Komunikasi", "Communication")],
];

export function HasilFgd({ hasil, transkrip, onKembali }) {
  const [lihat, setLihat] = useState(false);
  return (
    <div className="pb-tk-hasil">
      <button type="button" className="pb-link" onClick={onKembali} style={{ border: 0, background: "none", cursor: "pointer", padding: 0, marginBottom: 12 }}>
        ← {t("Kembali", "Back")}
      </button>
      <div className="pb-panel">
        <span className="pb-label">{t("Hasil simulasi FGD", "FGD simulation result")}</span>
        <div className="pb-tk-skor">
          <b>{hasil.skor}</b>
          <div>
            <strong>{hasil.skor >= 80 ? t("Menonjol di kelompok", "Stood out in the group") : hasil.skor >= 65 ? t("Berkontribusi baik", "Contributed well") : hasil.skor >= 50 ? t("Cukup, perlu lebih aktif", "Fair, be more active") : t("Perlu banyak latihan", "Needs more practice")}</strong>
            <span>{t(`Kamu bicara ${hasil.jumlah_bicara ?? "-"} kali`, `You spoke ${hasil.jumlah_bicara ?? "-"} times`)}</span>
          </div>
        </div>
        <div className="pb-tk-batang">
          {ASPEK.map(([k, l]) => (
            <div key={k}>
              <span>{l}</span>
              <i>
                <em style={{ width: `${hasil.aspek?.[k] ?? 0}%` }} />
              </i>
              <b>{hasil.aspek?.[k] ?? 0}</b>
            </div>
          ))}
        </div>
        {hasil.momen_kunci && (
          <blockquote className="fgd-kutip">
            <small>{t("Momen kunci", "Key moment")}</small>
            {hasil.momen_kunci}
          </blockquote>
        )}
        <div className="fgd-dua">
          <div>
            <h4>{t("Kekuatan", "Strengths")}</h4>
            <ul>{(hasil.kekuatan || []).map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div>
            <h4>{t("Perlu diperbaiki", "To improve")}</h4>
            <ul>{(hasil.perbaikan || []).map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
        {hasil.catatan && <p className="pb-tk-ket" style={{ fontSize: 14, color: "var(--ink2)" }}>{hasil.catatan}</p>}
        {transkrip?.length > 0 && (
          <>
            <button type="button" className="pb-po-teks-tombol" onClick={() => setLihat((x) => !x)}>
              <MessageSquareText size={14} /> {lihat ? t("Sembunyikan transkrip", "Hide transcript") : t("Lihat transkrip", "Show transcript")}
            </button>
            {lihat && (
              <div className="fgd-transkrip penuh">
                {transkrip.map((b, i) => (
                  <p key={i} className={b.siapa === "kamu" ? "kamu" : ""}>
                    <b>{b.siapa === "kamu" ? t("Kamu", "You") : PESERTA_FGD[b.siapa]?.nama}:</b> {b.teks}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Panel                                                              */
/* ------------------------------------------------------------------ */

export function FgdPanel({ setActive }) {
  const { user } = useAuth();
  const langganan = useLangganan();
  const max = langganan.aktif && langganan.paket === "serius";
  const suara = useSuaraFgd();

  const [tahap, setTahap] = useState("siap"); // siap | berjalan | menilai | hasil
  const [topik, setTopik] = useState("");
  const [bhs, setBhs] = useState(() => (bahasa() === "en" ? "en" : "id"));
  const [sesi, setSesi] = useState(null);
  const [transkrip, setTranskrip] = useState([]);
  const [pembicara, setPembicara] = useState(null);
  const [sibuk, setSibuk] = useState(false); // menunggu AI
  const [galat, setGalat] = useState("");
  const [hasil, setHasil] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [sekarang, setSekarang] = useState(Date.now());
  const batal = useRef(false);
  const selesaiRef = useRef(false);
  const penutupRef = useRef(false);

  const muatRiwayat = useCallback(async () => {
    if (!user || !supabaseConfigured) return;
    const { data } = await supabase.from("fgd_sesi").select("id, topik, status, skor, hasil, transkrip, mulai_at").order("mulai_at", { ascending: false }).limit(10);
    setRiwayat(data || []);
  }, [user]);
  useEffect(() => {
    muatRiwayat();
  }, [muatRiwayat]);

  useEffect(() => {
    if (tahap !== "berjalan") return undefined;
    const id = setInterval(() => setSekarang(Date.now()), 500);
    return () => clearInterval(id);
  }, [tahap]);

  const lewat = sesi ? (sekarang - new Date(sesi.mulai_at).getTime()) / 1000 : 0;
  const sisa = DURASI_FGD_MENIT * 60 - lewat;

  /** Putar beberapa ucapan berurutan; suara diminta sekaligus supaya cepat. */
  const putarGiliran = useCallback(
    async (sesiId, daftar) => {
      batal.current = false;
      const janji = daftar.map((g) => panggil({ aksi: "suara", sesiId, siapa: g.siapa, teks: g.teks }).catch(() => null));
      for (let i = 0; i < daftar.length; i++) {
        if (batal.current) break;
        const g = daftar[i];
        setTranskrip((x) => [...x, g]);
        setPembicara(g.siapa);
        const a = await janji[i];
        if (batal.current) break;
        if (a?.audio) await suara.putarPcm(a.audio, a.mime);
        else await suara.ucapkan(g.teks, bhs);
        await new Promise((r) => setTimeout(r, 250));
      }
      // Ucapan yang terpotong interupsi tetap muncul di teks
      if (batal.current) setTranskrip((x) => [...x, ...daftar.filter((g) => !x.includes(g))]);
      setPembicara(null);
    },
    [suara, bhs],
  );

  const akhiri = useCallback(async () => {
    if (!sesi || selesaiRef.current) return;
    selesaiRef.current = true;
    batal.current = true;
    suara.hentikanSuara();
    if (suara.merekam) suara.selesaiRekam();
    setTahap("menilai");
    try {
      const d = await panggil({ aksi: "akhiri", sesiId: sesi.id, bahasaTampilan: bahasa() === "en" ? "en" : "id" });
      if (d.dikembalikan) {
        setGalat(t("Kamu belum cukup banyak bicara untuk dinilai, jadi kuota FGD-mu dikembalikan. Coba lagi kapan saja.", "You didn't speak enough to be assessed, so your FGD quota was refunded. Try again any time."));
        setTahap("siap");
      } else {
        setHasil({ hasil: d.hasil, transkrip });
        setTahap("hasil");
      }
      langganan.refresh?.();
      muatRiwayat();
    } catch (e) {
      setGalat(e.message);
      selesaiRef.current = false;
      setTahap("berjalan");
    }
  }, [sesi, suara, transkrip, langganan, muatRiwayat]);

  /** Kirim giliran pengguna (dengan rekaman) atau biarkan peserta lain lanjut. */
  const kirimGiliran = useCallback(
    async (rekaman) => {
      if (!sesi || sibuk) return;
      setSibuk(true);
      setGalat("");
      try {
        const d = await panggil({ aksi: "giliran", sesiId: sesi.id, audio: rekaman?.base64 || "" });
        if (d.ucapanUser) setTranskrip((x) => [...x, { siapa: "kamu", teks: d.ucapanUser }]);
        setSibuk(false);
        await putarGiliran(sesi.id, d.giliran || []);
        if (d.selesai) akhiri();
      } catch (e) {
        setGalat(e.message);
        setSibuk(false);
      }
    },
    [sesi, sibuk, putarGiliran, akhiri],
  );

  // Waktu habis: minta penutup dari asesor sekali, lalu nilai
  useEffect(() => {
    if (tahap !== "berjalan" || selesaiRef.current) return;
    const tenang = !sibuk && !pembicara && !suara.merekam;
    if (sisa <= 0 && tenang) {
      if (!penutupRef.current) {
        penutupRef.current = true;
        kirimGiliran(null);
      } else akhiri();
    }
    if (sisa <= -120) akhiri();
  }, [sisa, tahap, sibuk, pembicara, suara.merekam, kirimGiliran, akhiri]);

  // Batas lama bicara per giliran
  useEffect(() => {
    if (suara.merekam && suara.detikRekam >= MAKS_DETIK_BICARA) kirimGiliran(suara.selesaiRekam());
  }, [suara.merekam, suara.detikRekam, suara, kirimGiliran]);

  const mulai = async () => {
    setGalat("");
    try {
      suara.siapkan();
      const izin = await navigator.mediaDevices.getUserMedia({ audio: true });
      izin.getTracks().forEach((x) => x.stop());
    } catch {
      setGalat(t("Izinkan akses mikrofon dulu supaya kamu bisa bicara di diskusi.", "Allow microphone access so you can speak in the discussion."));
      return;
    }
    setSibuk(true);
    try {
      const d = await panggil({ aksi: "mulai", topik, bahasa: bhs });
      selesaiRef.current = false;
      penutupRef.current = false;
      setSesi(d.sesi);
      setTahap("berjalan");
      setSibuk(false);
      if (d.lanjut) {
        setTranskrip(d.sesi.transkrip || []);
      } else {
        setTranskrip([]);
        await putarGiliran(d.sesi.id, d.sesi.transkrip || []);
      }
    } catch (e) {
      setGalat(e.message);
      setSibuk(false);
    }
  };

  const tombolBicara = async () => {
    if (suara.merekam) {
      kirimGiliran(suara.selesaiRekam());
      return;
    }
    // Interupsi: hentikan peserta yang sedang bicara
    if (pembicara) {
      batal.current = true;
      suara.hentikanSuara();
    }
    try {
      await suara.mulaiRekam();
    } catch {
      setGalat(t("Mikrofon tidak bisa dipakai.", "The microphone can't be used."));
    }
  };

  /* ---------------- tampilan ---------------- */

  if (tahap === "hasil" && hasil) return <HasilFgd hasil={hasil.hasil} transkrip={hasil.transkrip} onKembali={() => setTahap("siap")} />;

  if (tahap === "berjalan" || tahap === "menilai") {
    const judul = TOPIK_FGD.find((x) => x.id === sesi?.topik?.id)?.judul || "";
    const giliranmu = !pembicara && !sibuk && !suara.merekam && tahap === "berjalan";
    return (
      <div className="fgd">
        <div className="fgd-atas">
          <span>
            <Users size={15} /> {t("Simulasi FGD", "FGD simulation")}
          </span>
          <button type="button" className="pb-tk-batal" onClick={() => window.confirm(t("Akhiri diskusi sekarang dan lihat penilaian?", "End the discussion now and see your assessment?")) && akhiri()}>
            <LogOut size={14} /> {t("Akhiri", "End")}
          </button>
        </div>
        <Ruang pembicara={pembicara} berpikir={sibuk} tingkatAi={suara.tingkatAi} tingkatMic={suara.tingkatMic} merekam={suara.merekam} judul={judul} sisa={sisa} />

        <div className="fgd-kendali">
          <div className="fgd-status">
            {tahap === "menilai"
              ? t("Bu Sari sedang menilai diskusimu…", "Sari is assessing the discussion…")
              : suara.merekam
                ? t(`Kamu bicara… ${suara.detikRekam}s (tekan lagi bila selesai)`, `You're speaking… ${suara.detikRekam}s (press again when done)`)
                : sibuk
                  ? t("Peserta lain sedang menanggapi…", "Others are responding…")
                  : pembicara
                    ? t(`${PESERTA_FGD[pembicara]?.nama} sedang bicara. Tekan Bicara untuk menyela.`, `${PESERTA_FGD[pembicara]?.nama} is speaking. Press Speak to cut in.`)
                    : t("Giliranmu. Sampaikan pendapat, tanggapi, atau ajak yang lain.", "Your turn. Share a view, respond, or bring others in.")}
          </div>
          <div className="fgd-tombol">
            <button type="button" className={`fgd-mic ${suara.merekam ? "rekam" : ""}`} disabled={sibuk || tahap === "menilai"} onClick={tombolBicara}>
              {suara.merekam ? <Square size={18} /> : <Mic size={20} />}
              {suara.merekam ? t("Selesai bicara", "Done") : t("Bicara", "Speak")}
            </button>
            <button type="button" className="pb-btn pb-btn-outline" disabled={!giliranmu} onClick={() => kirimGiliran(null)}>
              <SkipForward size={15} /> {t("Biarkan yang lain lanjut", "Let others continue")}
            </button>
          </div>
          {galat && <div className="pb-po-galat">{galat}</div>}
        </div>

        <div className="fgd-transkrip">
          {transkrip.slice(-8).map((b, i) => (
            <p key={i} className={b.siapa === "kamu" ? "kamu" : ""}>
              <b>{b.siapa === "kamu" ? t("Kamu", "You") : PESERTA_FGD[b.siapa]?.nama}:</b> {b.teks}
            </p>
          ))}
          {sibuk && (
            <p className="tunggu">
              <Loader2 size={13} className="pb-po-putar" /> {t("menyimak…", "listening…")}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ---------- persiapan ---------- */
  const selesaiDulu = riwayat.filter((r) => r.status === "selesai");
  return (
    <div className="fgd-siap">
      <div className="pb-panel fgd-intro">
        <div className="fgd-intro-gambar" aria-hidden="true">
          {["dimas", "ayu", "moderator", "fajar", "kamu"].map((k) => (
            <AvatarFgd key={k} siapa={k} ukuran={k === "moderator" ? 78 : 64} />
          ))}
        </div>
        <h2>{t("Latihan FGD seperti hari seleksi", "Practise an FGD like it's selection day")}</h2>
        <p>
          {t(
            `Kamu duduk satu meja dengan Dimas, Ayu, dan Fajar, diamati asesor Bu Sari. Diskusi ${DURASI_FGD_MENIT} menit lewat suara: sampaikan pendapat, tanggapi peserta lain, ajak yang pendiam, dan bawa kelompok ke kesimpulan. Di akhir kamu mendapat nilai untuk enam aspek yang biasa dinilai asesor.`,
            `You sit with Dimas, Ayu, and Fajar, observed by assessor Sari. A ${DURASI_FGD_MENIT}-minute voice discussion: share views, respond to others, bring in the quiet ones, and lead the group to a conclusion. At the end you're scored on six aspects assessors usually look at.`,
          )}
        </p>
        <ul className="fgd-tips">
          <li>{t("Tekan Bicara, sampaikan pendapatmu, lalu tekan Selesai bicara.", "Press Speak, say your piece, then press Done.")}</li>
          <li>{t("Kamu boleh menyela peserta yang sedang bicara, seperti di FGD sungguhan.", "You can cut in while someone's speaking, like in a real FGD.")}</li>
          <li>{t("Pakai headset supaya suara peserta lain tidak terekam ulang.", "Use headphones so the others' voices aren't picked up again.")}</li>
        </ul>
      </div>

      {!max ? (
        <div className="pb-panel pb-tk-ajak">
          <Lock size={18} />
          <div>
            <b>{t("Simulasi FGD khusus paket Max", "FGD simulation is for the Max plan")}</b>
            <span>{t("Paket Max mendapat 1x simulasi FGD 20 menit, tes persiapan kerja, dan rapor kesiapan kerja.", "Max includes one 20-minute FGD simulation, job tests, and a job-readiness report.")}</span>
          </div>
          <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={() => setActive?.("paket")}>
            {t("Lihat Max", "See Max")} <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="pb-panel">
          <h3 className="pb-po-sub" style={{ marginTop: 0 }}>{t("Pilih topik", "Pick a topic")}</h3>
          <div className="fgd-topik">
            <button type="button" className={!topik ? "on" : ""} onClick={() => setTopik("")}>
              <b>{t("Acak", "Random")}</b>
              <small>{t("Seperti seleksi sungguhan", "Like a real selection")}</small>
            </button>
            {TOPIK_FGD.map((x) => (
              <button key={x.id} type="button" className={topik === x.id ? "on" : ""} onClick={() => setTopik(x.id)}>
                <b>{x.judul}</b>
                <small>{x.jenis === "kasus" ? t("Studi kasus", "Case study") : t("Isu", "Issue")}</small>
              </button>
            ))}
          </div>
          <h3 className="pb-po-sub">{t("Bahasa diskusi", "Discussion language")}</h3>
          <div className="pb-chips">
            {[["id", "Bahasa Indonesia"], ["en", "English"]].map(([k, l]) => (
              <button key={k} type="button" className={`pb-chip ${bhs === k ? "on" : ""}`} onClick={() => setBhs(k)}>
                {l}
              </button>
            ))}
          </div>
          {galat && <div className="pb-po-galat" style={{ marginTop: 14 }}>{galat}</div>}
          <button type="button" className="pb-btn pb-btn-primary" style={{ marginTop: 18 }} disabled={sibuk} onClick={mulai}>
            {sibuk ? <Loader2 size={15} className="pb-po-putar" /> : <Play size={15} />} {t("Masuk ruang diskusi", "Enter the discussion room")}
          </button>
          <p className="pb-tk-ket">{t("Kuota terpakai saat diskusi dimulai. Jika kamu bicara kurang dari 2 kali, kuota dikembalikan.", "Quota is used when the discussion starts. If you speak fewer than 2 times, it's refunded.")}</p>
        </div>
      )}

      {selesaiDulu.length > 0 && (
        <div className="pb-panel">
          <h3 className="pb-po-sub" style={{ marginTop: 0 }}>{t("Riwayat FGD", "FGD history")}</h3>
          <div className="fgd-riwayat">
            {selesaiDulu.map((r) => (
              <button key={r.id} type="button" onClick={() => { setHasil({ hasil: r.hasil, transkrip: r.transkrip }); setTahap("hasil"); }}>
                <span>
                  <b>{TOPIK_FGD.find((x) => x.id === r.topik?.id)?.judul || "FGD"}</b>
                  <small>{new Date(r.mulai_at).toLocaleDateString()}</small>
                </span>
                <em>{r.skor}</em>
              </button>
            ))}
          </div>
        </div>
      )}
      {galat && tahap === "siap" && !max && <div className="pb-po-galat">{galat}</div>}
      <div className="pb-tk-catatan">
        <Check size={15} />
        <span>{t("Suara peserta dibuat AI. Nilai bersifat latihan, bukan hasil seleksi resmi.", "Participants' voices are AI-generated. Scores are for practice, not an official selection result.")}</span>
      </div>
    </div>
  );
}
