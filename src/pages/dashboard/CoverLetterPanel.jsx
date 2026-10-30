import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Download, Copy, Check, Sparkles, Lock, Loader2, Plus, Trash2, Wand2, RotateCcw, ChevronDown,
  CircleCheck, CircleAlert, CircleX, FileText, Palette, User, Building2, PenLine, Lightbulb, ClipboardCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useUserProfile } from "../../context/UserProfileContext";
import { useLangganan } from "../../hooks/useLangganan";
import { useLayarKecil } from "../../hooks/useLayarKecil";
import { useCegahTinggalkan } from "../../hooks/useCegahTinggalkan";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { FONT_CV, AKSEN_CV, bacaGaya } from "../../data/cvGaya";
import {
  SITUASI, TEMA_CL, KOSONG, TIPS_CL, isiKerangka, salamAwal, salamAkhir, hariIni, susunSurat, periksaSurat,
  suratKeTeks, badanSurat, hitungKata,
} from "../../data/coverLetter";
import { UKURAN_CL } from "../../utils/pdfCoverLetter";
import { cvKeTeks } from "../../utils/kirimKeReview";

const MAKS_PARAGRAF = 4;
const ASPEK_LABEL = {
  kecocokan: "Kecocokan dengan posisi",
  struktur: "Struktur surat",
  bukti: "Bukti & pencapaian",
  nada: "Nada & bahasa",
  kejelasan: "Kejelasan & panjang",
};
const BAGIAN_LABEL = { pembuka: "Pembuka", isi: "Isi", penutup: "Penutup", umum: "Umum" };

/* ------------------------------------------------------------------ */

function Kartu({ ikon: Ikon, judul, children, buka: bukaAwal = true, kanan }) {
  const [buka, setBuka] = useState(bukaAwal);
  return (
    <section className={`cl-kartu ${buka ? "buka" : ""}`}>
      <button type="button" className="cl-kartu-kepala" onClick={() => setBuka((b) => !b)} aria-expanded={buka}>
        <Ikon size={17} />
        <span>{judul}</span>
        {kanan}
        <ChevronDown size={16} className="cl-chev" />
      </button>
      {buka && <div className="cl-kartu-isi">{children}</div>}
    </section>
  );
}

function Isian({ label, value, onChange, placeholder, multi, rows = 3, type = "text", info }) {
  return (
    <label className="cl-isian">
      <span>
        {label}
        {info && <small>{info}</small>}
      </span>
      {multi ? (
        <textarea rows={rows} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={type} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

/* ---------------------------------------------------------- pratinjau */

function Pratinjau({ d }) {
  const bungkus = useRef(null);
  const kertas = useRef(null);
  const [skala, setSkala] = useState(0.6);
  const [tinggi, setTinggi] = useState(1123);
  const { font, aksen } = bacaGaya(d.gaya);
  const blok = useMemo(() => susunSurat(d), [d]);
  const U = UKURAN_CL;
  const k = font.skala || 1;

  useLayoutEffect(() => {
    const el = bungkus.current;
    if (!el) return undefined;
    const ukur = () => {
      const lebar = el.clientWidth;
      setSkala(Math.min(1, lebar / 794));
      if (kertas.current) setTinggi(kertas.current.offsetHeight);
    };
    ukur();
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    if (kertas.current) ro.observe(kertas.current);
    return () => ro.disconnect();
  }, []);

  const lebihSatuHalaman = tinggi > 1123 + 4;

  return (
    <div className="cl-pratinjau" ref={bungkus}>
      <div className="cl-kertas-bingkai" style={{ height: tinggi * skala }}>
        <div
          ref={kertas}
          className="cl-kertas"
          style={{
            transform: `scale(${skala})`,
            fontFamily: font.css,
            fontSize: `${U.isi * k}pt`,
            lineHeight: `${U.baris}mm`,
            padding: `${U.margin}mm`,
            "--aksen": aksen.hex,
          }}
        >
          {blok.map((b, i) => {
            if (b.t === "jarak") return <div key={i} style={{ height: `${b.n}mm` }} />;
            if (b.t === "garis") return <hr key={i} />;
            if (b.t === "judul")
              return (
                <div key={i} className="cl-k-judul" style={{ fontSize: `${U.judul * k}pt` }}>
                  {b.teks}
                </div>
              );
            if (b.t === "kecil")
              return (
                <div key={i} className="cl-k-kecil" style={{ fontSize: `${U.kecil * k}pt` }}>
                  {b.teks}
                </div>
              );
            if (b.t === "paragraf")
              return (
                <p key={i} className="cl-k-par">
                  {b.teks}
                </p>
              );
            if (String(b.teks).includes("\t")) {
              const [label, isi] = String(b.teks).split("\t");
              return (
                <div key={i} className="cl-k-label">
                  <span style={{ width: `${U.label}mm` }}>{label}</span>
                  <span>{isi}</span>
                </div>
              );
            }
            return (
              <div key={i} className={`cl-k-baris ${b.tebal ? "tebal" : ""} ${b.kanan ? "kanan" : ""}`}>
                {b.teks}
              </div>
            );
          })}
          {lebihSatuHalaman && <div className="cl-k-batas" style={{ top: "297mm" }} />}
        </div>
      </div>
      {lebihSatuHalaman && (
        <p className="cl-peringatan">
          <CircleAlert size={14} /> Surat lebih dari satu halaman. Idealnya cover letter muat dalam satu halaman A4.
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- pemeriksaan */

function Pemeriksaan({ d }) {
  const hasil = useMemo(() => periksaSurat(d), [d]);
  const [buka, setBuka] = useState(false);
  const ok = hasil.filter((h) => h.status === "ok").length;
  const perlu = hasil.length - ok;
  const IKON = { ok: CircleCheck, warn: CircleAlert, bad: CircleX };
  return (
    <div className="cl-cek">
      <button type="button" className="cl-cek-kepala" onClick={() => setBuka((b) => !b)} aria-expanded={buka}>
        <ClipboardCheck size={17} />
        <span>
          <b>Pemeriksaan otomatis</b>
          <small>
            {ok} sudah baik · {perlu} perlu diperbaiki
          </small>
        </span>
        <ChevronDown size={16} className={`cl-chev ${buka ? "putar" : ""}`} />
      </button>
      {buka && (
        <ul>
          {hasil.map((h) => {
            const I = IKON[h.status];
            return (
              <li key={h.judul} className={h.status}>
                <I size={16} />
                <span>
                  <b>{h.judul}</b>
                  {h.saran && <small>{h.saran}</small>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- AI */

function Cincin({ nilai }) {
  const r = 30;
  const kel = 2 * Math.PI * r;
  const warna = nilai >= 75 ? "var(--ok)" : nilai >= 55 ? "var(--amber)" : "var(--danger)";
  return (
    <svg className="cl-cincin" width="76" height="76" viewBox="0 0 76 76" aria-label={`Skor ${nilai} dari 100`}>
      <circle cx="38" cy="38" r={r} fill="none" stroke="var(--bar-bg)" strokeWidth="7" />
      <circle
        cx="38"
        cy="38"
        r={r}
        fill="none"
        stroke={warna}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${(nilai / 100) * kel} ${kel}`}
        transform="rotate(-90 38 38)"
      />
      <text x="38" y="44" textAnchor="middle" fontSize="19" fontWeight="700" fill="var(--ink)">
        {nilai}
      </text>
    </svg>
  );
}

function SalinTombol({ teks, label = "Salin" }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="cl-btn-kecil"
      onClick={() => {
        navigator.clipboard?.writeText(teks).then(() => {
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        });
      }}
    >
      {ok ? <Check size={13} /> : <Copy size={13} />} {ok ? "Tersalin" : label}
    </button>
  );
}

function HasilAi({ h, onTerapkan, diterapkan, onBatal }) {
  const label = h.skor >= 80 ? "Siap dikirim" : h.skor >= 65 ? "Cukup baik, masih bisa ditajamkan" : h.skor >= 50 ? "Perlu perbaikan" : "Perlu ditulis ulang";
  return (
    <div className="cl-ai-hasil">
      <div className="cl-ai-skor">
        <Cincin nilai={h.skor} />
        <div>
          <b>{label}</b>
          <p>{h.kesan_hr}</p>
        </div>
      </div>

      <div className="cl-aspek">
        {h.skor_aspek.map((a) => (
          <div key={a.aspek}>
            <div className="cl-aspek-atas">
              <span>{ASPEK_LABEL[a.aspek] || a.aspek}</span>
              <b>{a.nilai}</b>
            </div>
            <span className="cl-bar">
              <i style={{ width: `${a.nilai}%` }} />
            </span>
            {a.catatan && <small>{a.catatan}</small>}
          </div>
        ))}
      </div>

      {h.kekuatan?.length > 0 && (
        <div className="cl-ai-blok">
          <h4>Yang sudah kuat</h4>
          <ul className="cl-ai-kuat">
            {h.kekuatan.map((x) => (
              <li key={x}>
                <CircleCheck size={15} /> {x}
              </li>
            ))}
          </ul>
        </div>
      )}

      {h.masalah?.length > 0 && (
        <div className="cl-ai-blok">
          <h4>Yang perlu diperbaiki</h4>
          <ol className="cl-ai-masalah">
            {h.masalah.map((m, i) => (
              <li key={i}>
                <span className="cl-tag">{BAGIAN_LABEL[m.bagian]}</span>
                {m.kutipan && <q>{m.kutipan}</q>}
                <p>{m.masalah}</p>
                <div className="cl-ai-ganti">
                  <b>Contoh perbaikan</b>
                  <span>{m.perbaikan}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {h.kata_kunci_kurang?.length > 0 && (
        <div className="cl-ai-blok">
          <h4>Kata kunci lowongan yang belum muncul</h4>
          <div className="cl-chip-baris">
            {h.kata_kunci_kurang.map((x) => (
              <span key={x} className="cl-chip">
                {x}
              </span>
            ))}
          </div>
          <small className="cl-redup">Masukkan hanya yang memang kamu kuasai.</small>
        </div>
      )}

      <div className="cl-ai-blok cl-ai-versi">
        <h4>Versi yang ditulis ulang AI</h4>
        <div className="cl-ai-teks">
          {[h.perbaikan.pembuka, ...h.perbaikan.isi, h.perbaikan.penutup].filter(Boolean).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="cl-ai-aksi">
          {diterapkan ? (
            <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={onBatal}>
              <RotateCcw size={14} /> Kembalikan tulisan saya
            </button>
          ) : (
            <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={onTerapkan}>
              <Wand2 size={14} /> Pakai versi ini
            </button>
          )}
          <SalinTombol teks={[h.perbaikan.pembuka, ...h.perbaikan.isi, h.perbaikan.penutup].filter(Boolean).join("\n\n")} label="Salin teks" />
        </div>
        <small className="cl-redup">Periksa lagi sebelum dikirim. AI hanya memakai fakta dari surat dan CV-mu.</small>
      </div>

      {h.subjek_email && (
        <div className="cl-ai-blok">
          <h4>Subjek email</h4>
          <div className="cl-subjek">
            <code>{h.subjek_email}</code>
            <SalinTombol teks={h.subjek_email} />
          </div>
        </div>
      )}
    </div>
  );
}

function BagianAi({ d, cvTeks, setD, setActive }) {
  const langganan = useLangganan();
  const [lowongan, setLowongan] = useState("");
  const [hasil, setHasil] = useState(null);
  const [kuota, setKuota] = useState(null);
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState("");
  const [cadangan, setCadangan] = useState(null);
  useCegahTinggalkan(proses, "Analisis cover letter sedang berjalan.");

  const terbuka = langganan.aktif;

  useEffect(() => {
    if (!terbuka || !supabaseConfigured) return;
    supabase.rpc("kuota_cl_saya").then(({ data }) => {
      const b = Array.isArray(data) ? data[0] : data;
      if (b) setKuota({ jatah: b.jatah, terpakai: b.terpakai });
    });
    supabase
      .from("cover_letter_analisis")
      .select("hasil, dibuat_at")
      .eq("status", "selesai")
      .order("dibuat_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]?.hasil) setHasil({ ...data[0].hasil, dibuat_at: data[0].dibuat_at });
      });
  }, [terbuka]);

  if (langganan.loading) return null;

  if (!terbuka) {
    return (
      <section className="cl-ai cl-ai-kunci">
        <div className="cl-ai-ikon">
          <Lock size={18} />
        </div>
        <div>
          <b>Analisis cover letter dengan AI</b>
          <p>
            Dinilai seperti recruiter: skor, kesan pertama HR, bagian yang lemah lengkap dengan contoh perbaikannya, kata kunci
            lowongan yang belum ada, dan versi yang ditulis ulang. Tersedia mulai paket Starter.
          </p>
          <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={() => setActive?.("paket")}>
            <Sparkles size={14} /> Lihat paket
          </button>
        </div>
      </section>
    );
  }

  const sisa = kuota ? Math.max(0, kuota.jatah - kuota.terpakai) : null;
  const kata = hitungKata(badanSurat(d).join(" "));

  const analisis = async () => {
    setGalat("");
    if (kata < 60) {
      setGalat("Tulis surat minimal 60 kata dulu, atau isi dengan kerangka lalu lengkapi.");
      return;
    }
    setProses(true);
    try {
      const { data, error } = await supabase.functions.invoke("analisis-cover-letter", {
        body: {
          surat: suratKeTeks(d),
          posisi: d.posisi,
          perusahaan: d.perusahaan,
          lowongan: lowongan.trim(),
          cv: cvTeks,
          bahasa: d.bahasa,
        },
      });
      if (error) {
        let pesan = "Analisis gagal. Jatahmu tidak terpotong, silakan coba lagi.";
        try {
          const b = await error.context?.json?.();
          if (b?.error) pesan = b.error;
        } catch {
          /* abaikan */
        }
        throw new Error(pesan);
      }
      setHasil(data);
      setCadangan(null);
      if (typeof data?.sisa === "number" && kuota) setKuota({ ...kuota, terpakai: kuota.jatah - data.sisa });
    } catch (e) {
      setGalat(e.message || "Analisis gagal.");
    } finally {
      setProses(false);
    }
  };

  const terapkan = () => {
    setCadangan({ pembuka: d.pembuka, isi: d.isi, penutup: d.penutup });
    setD((x) => ({ ...x, pembuka: hasil.perbaikan.pembuka, isi: hasil.perbaikan.isi, penutup: hasil.perbaikan.penutup || x.penutup }));
  };
  const batal = () => {
    if (!cadangan) return;
    setD((x) => ({ ...x, ...cadangan }));
    setCadangan(null);
  };

  return (
    <section className="cl-ai">
      <div className="cl-ai-kepala">
        <Sparkles size={18} />
        <b>Analisis AI</b>
        {sisa != null && (
          <span className="cl-jatah">
            Sisa {sisa} dari {kuota.jatah}
          </span>
        )}
      </div>
      <p className="cl-redup">
        Tempel teks lowongan agar AI bisa menilai kecocokan dan kata kunci. Isi CV Builder-mu ikut dipakai sebagai sumber fakta.
      </p>
      <textarea
        className="cl-lowongan"
        rows={4}
        value={lowongan}
        onChange={(e) => setLowongan(e.target.value)}
        placeholder="Opsional: tempel deskripsi pekerjaan dan kualifikasi dari lowongan"
      />
      <div className="cl-ai-aksi">
        <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={analisis} disabled={proses || sisa === 0}>
          {proses ? <Loader2 size={14} className="pb-po-putar" /> : <Sparkles size={14} />}
          {proses ? "Menganalisis, sekitar 20 detik…" : hasil ? "Analisis ulang" : "Analisis sekarang"}
        </button>
        {sisa === 0 && <small className="cl-redup">Jatah di paketmu sudah habis.</small>}
      </div>
      {galat && <p className="cl-galat">{galat}</p>}
      {hasil && !proses && (
        <>
          {hasil.dibuat_at && (
            <small className="cl-redup">
              Hasil analisis terakhir · {new Date(hasil.dibuat_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
            </small>
          )}
          <HasilAi h={hasil} onTerapkan={terapkan} diterapkan={Boolean(cadangan)} onBatal={batal} />
        </>
      )}
    </section>
  );
}

/* ---------------------------------------------------------- panel */

export function CoverLetterPanel({ setActive }) {
  const { user } = useAuth();
  const profil = useUserProfile();
  const layarKecil = useLayarKecil(1000);
  const [tab, setTab] = useState("editor");
  const [d, setD] = useState(() => ({ ...KOSONG, tanggal: hariIni() }));
  const [cvTeks, setCvTeks] = useState("");
  const [situasi, setSituasi] = useState("fresh");
  const [siap, setSiap] = useState(false);
  const [simpan, setSimpan] = useState(""); // "" | "menyimpan" | "tersimpan" | "gagal"
  const [unduh, setUnduh] = useState(false);
  const pertama = useRef(true);

  const ubah = (kunci) => (v) => setD((x) => ({ ...x, [kunci]: v }));
  const ubahGaya = (kunci, v) => setD((x) => ({ ...x, gaya: { ...KOSONG.gaya, ...(x.gaya || {}), [kunci]: v } }));

  /* Muat draft, atau isi awal dari CV Builder dan profil */
  useEffect(() => {
    if (!user || !supabaseConfigured) {
      setSiap(true);
      return;
    }
    let batal = false;
    supabase
      .from("profiles")
      .select("cv_json, cover_letter_json")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (batal) return;
        const cv = data?.cv_json || {};
        if (cv && Object.keys(cv).length) setCvTeks(cvKeTeks(cv).slice(0, 5000));
        const tersimpan = data?.cover_letter_json;
        if (tersimpan && typeof tersimpan === "object" && Object.keys(tersimpan).length) {
          setD({ ...KOSONG, ...tersimpan, isi: tersimpan.isi?.length ? tersimpan.isi : [""], gaya: { ...KOSONG.gaya, ...(tersimpan.gaya || {}) } });
        } else {
          setD((x) => ({
            ...x,
            nama: cv.fullName || profil.fullName || "",
            email: cv.email || user.email || "",
            telepon: cv.phone || "",
            kota: (cv.location || profil.location || "").split(",")[0].trim(),
            linkedin: cv.linkedin || "",
          }));
        }
        setSiap(true);
      });
    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  /* Simpan otomatis 1,5 detik setelah berhenti mengetik */
  useEffect(() => {
    if (!siap || !user || !supabaseConfigured) return undefined;
    if (pertama.current) {
      pertama.current = false;
      return undefined;
    }
    setSimpan("menyimpan");
    const t = setTimeout(async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ cover_letter_json: d, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      setSimpan(error ? "gagal" : "tersimpan");
    }, 1500);
    return () => clearTimeout(t);
  }, [d, siap, user]);

  const kosong = badanSurat(d).length === 0;
  const pakaiKerangka = () => {
    if (!kosong && !window.confirm("Isi surat yang sekarang akan diganti dengan kerangka. Lanjutkan?")) return;
    const k = isiKerangka(situasi, d.bahasa, d);
    setD((x) => ({ ...x, ...k, salam: salamAwal(x.bahasa, x), salamPenutup: salamAkhir(x.bahasa) }));
    if (layarKecil) setTab("editor");
  };

  const gantiBahasa = (b) =>
    setD((x) => ({
      ...x,
      bahasa: b,
      // Salam ikut berganti kalau masih bawaan
      salam: !x.salam || x.salam === salamAwal(x.bahasa, x) ? salamAwal(b, x) : x.salam,
      salamPenutup: !x.salamPenutup || x.salamPenutup === salamAkhir(x.bahasa) ? salamAkhir(b) : x.salamPenutup,
    }));

  const ubahIsi = (i, v) => setD((x) => ({ ...x, isi: x.isi.map((p, j) => (j === i ? v : p)) }));
  const tambahIsi = () => setD((x) => ({ ...x, isi: [...x.isi, ""] }));
  const hapusIsi = (i) => setD((x) => ({ ...x, isi: x.isi.length > 1 ? x.isi.filter((_, j) => j !== i) : [""] }));

  const kata = hitungKata(badanSurat(d).join(" "));
  const en = d.bahasa === "EN";

  const unduhPdf = async () => {
    setUnduh(true);
    try {
      const { unduhCoverLetter } = await import("../../utils/pdfCoverLetter");
      await unduhCoverLetter(d);
    } catch (e) {
      console.error(e);
      alert("Gagal membuat PDF. Periksa koneksi internet lalu coba lagi.");
    } finally {
      setUnduh(false);
    }
  };

  const aksi = (
    <div className="cl-aksi">
      <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={unduhPdf} disabled={unduh}>
        {unduh ? <Loader2 size={15} className="pb-po-putar" /> : <Download size={15} />} Unduh PDF
      </button>
      <SalinTombol teks={suratKeTeks(d)} label="Salin untuk email" />
      <span className={`cl-status ${simpan}`}>
        {simpan === "menyimpan" ? "Menyimpan…" : simpan === "tersimpan" ? "Tersimpan" : simpan === "gagal" ? "Gagal menyimpan" : ""}
      </span>
    </div>
  );

  const editor = (
    <div className="cl-editor">
      <BagianAi d={d} cvTeks={cvTeks} setD={setD} setActive={setActive} />

      <Kartu ikon={Wand2} judul="Mulai cepat">
        <div className="cl-bahasa" role="group" aria-label="Bahasa surat">
          {[
            ["ID", "Bahasa Indonesia"],
            ["EN", "English"],
          ].map(([id, nama]) => (
            <button key={id} type="button" className={d.bahasa === id ? "aktif" : ""} onClick={() => gantiBahasa(id)}>
              {nama}
            </button>
          ))}
        </div>
        <p className="cl-label-kecil">Situasimu</p>
        <div className="cl-situasi">
          {SITUASI.map((s) => (
            <button key={s.id} type="button" className={situasi === s.id ? "aktif" : ""} onClick={() => setSituasi(s.id)}>
              <b>{s.nama}</b>
              <small>{s.ket}</small>
            </button>
          ))}
        </div>
        <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={pakaiKerangka}>
          <Wand2 size={14} /> Isi dengan kerangka
        </button>
        <small className="cl-redup">Kerangka berisi bagian [dalam kurung] yang perlu kamu ganti dengan cerita sendiri.</small>
      </Kartu>

      <Kartu ikon={Building2} judul="Lowongan yang dilamar">
        <div className="cl-dua">
          <Isian label="Posisi" value={d.posisi} onChange={ubah("posisi")} placeholder="Staf Administrasi Keuangan" />
          <Isian label="Perusahaan" value={d.perusahaan} onChange={ubah("perusahaan")} placeholder="PT Maju Bersama" />
          <Isian label="Nama penerima" info="opsional" value={d.penerimaNama} onChange={ubah("penerimaNama")} placeholder={en ? "Ms. Rina Wijaya" : "Rina Wijaya"} />
          <Isian label="Jabatan penerima" info="opsional" value={d.penerimaJabatan} onChange={ubah("penerimaJabatan")} placeholder="HR Manager" />
          <Isian label="Tahu lowongan dari" info="opsional" value={d.sumber} onChange={ubah("sumber")} placeholder="Jobly / LinkedIn / situs karier" />
          <Isian label="Tanggal surat" type="date" value={d.tanggal} onChange={ubah("tanggal")} />
        </div>
        <Isian label="Alamat perusahaan" info="opsional" value={d.alamat} onChange={ubah("alamat")} placeholder={"Jl. Sudirman No. 1\nJakarta Selatan"} multi rows={2} />
        {!en && d.gaya?.tema === "formal" && (
          <Isian label="Lampiran" info="opsional" value={d.lampiran} onChange={ubah("lampiran")} placeholder="CV, ijazah, transkrip nilai, sertifikat" />
        )}
      </Kartu>

      <Kartu ikon={PenLine} judul="Isi surat" kanan={<span className="cl-hitung">{kata} kata</span>}>
        <Isian label="Salam pembuka" value={d.salam} onChange={ubah("salam")} placeholder={salamAwal(d.bahasa, d)} />
        <Isian
          label="Paragraf pembuka"
          info="sebut posisi dan alasan kamu cocok"
          value={d.pembuka}
          onChange={ubah("pembuka")}
          multi
          rows={4}
          placeholder={en ? "I am writing to apply for…" : "Saya ingin melamar posisi … di …"}
        />
        {d.isi.map((p, i) => (
          <div key={i} className="cl-isi-baris">
            <Isian
              label={`Paragraf isi ${d.isi.length > 1 ? i + 1 : ""}`}
              info={i === 0 ? "pengalaman dan bukti yang relevan" : ""}
              value={p}
              onChange={(v) => ubahIsi(i, v)}
              multi
              rows={5}
            />
            {d.isi.length > 1 && (
              <button type="button" className="cl-hapus" onClick={() => hapusIsi(i)} aria-label="Hapus paragraf">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        {d.isi.length < MAKS_PARAGRAF && (
          <button type="button" className="cl-btn-kecil" onClick={tambahIsi}>
            <Plus size={13} /> Tambah paragraf
          </button>
        )}
        <Isian label="Paragraf penutup" info="ajak wawancara, ucapkan terima kasih" value={d.penutup} onChange={ubah("penutup")} multi rows={3} />
        <Isian label="Salam penutup" value={d.salamPenutup} onChange={ubah("salamPenutup")} placeholder={salamAkhir(d.bahasa)} />
      </Kartu>

      <Kartu ikon={User} judul="Data diri" buka={false}>
        <div className="cl-dua">
          <Isian label="Nama lengkap" value={d.nama} onChange={ubah("nama")} />
          <Isian label="Kota" value={d.kota} onChange={ubah("kota")} placeholder="Jakarta" />
          <Isian label="Email" value={d.email} onChange={ubah("email")} />
          <Isian label="Nomor HP" value={d.telepon} onChange={ubah("telepon")} placeholder="0812 xxxx xxxx" />
        </div>
        <Isian label="LinkedIn" info="opsional" value={d.linkedin} onChange={ubah("linkedin")} placeholder="linkedin.com/in/nama" />
      </Kartu>

      <Kartu ikon={Palette} judul="Tampilan" buka={false}>
        <p className="cl-label-kecil">Format</p>
        <div className="cl-pilih">
          {TEMA_CL.map((t) => (
            <button key={t.id} type="button" className={d.gaya?.tema === t.id ? "aktif" : ""} onClick={() => ubahGaya("tema", t.id)}>
              <b>{t.nama}</b>
              <small>{t.ket}</small>
            </button>
          ))}
        </div>
        <p className="cl-label-kecil">Huruf</p>
        <select className="cl-select" value={d.gaya?.font} onChange={(e) => ubahGaya("font", e.target.value)}>
          {FONT_CV.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nama} · {f.ket}
            </option>
          ))}
        </select>
        <p className="cl-label-kecil">Warna aksen</p>
        <div className="cl-aksen">
          {AKSEN_CV.map((a) => (
            <button
              key={a.id}
              type="button"
              title={a.nama}
              aria-label={a.nama}
              className={d.gaya?.aksen === a.id ? "aktif" : ""}
              style={{ background: a.hex }}
              onClick={() => ubahGaya("aksen", a.id)}
            >
              {d.gaya?.aksen === a.id && <Check size={13} />}
            </button>
          ))}
        </div>
      </Kartu>

      <Kartu ikon={Lightbulb} judul="Tips dari recruiter" buka={false}>
        <ul className="cl-tips">
          {TIPS_CL.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Kartu>
    </div>
  );

  const pratinjau = (
    <div className="cl-kanan">
      {aksi}
      <Pemeriksaan d={d} />
      <Pratinjau d={d} />
    </div>
  );

  return (
    <div className="cl">
      {!siap ? (
        <div className="cl-muat">
          <Loader2 size={22} className="pb-po-putar" />
        </div>
      ) : layarKecil ? (
        <>
          <div className="cl-tab" role="tablist">
            {[
              ["editor", "Editor", PenLine],
              ["pratinjau", "Pratinjau", FileText],
            ].map(([id, nama, I]) => (
              <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? "aktif" : ""} onClick={() => setTab(id)}>
                <I size={15} /> {nama}
              </button>
            ))}
          </div>
          {tab === "editor" ? editor : pratinjau}
        </>
      ) : (
        <div className="cl-grid">
          {editor}
          {pratinjau}
        </div>
      )}
    </div>
  );
}
