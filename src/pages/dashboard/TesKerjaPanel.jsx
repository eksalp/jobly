import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, Clock, Columns3, BookA, Sigma, Brain, ScanSearch, UserRound, Lock,
  Loader2, Play, RotateCcw, X, AlertTriangle, Eye, Languages, Shapes, Focus, GraduationCap, Lightbulb, BookOpen,
} from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useLangganan } from "../../context/LanggananContext";
import {
  JENIS_TES, buatSoal, buatAcak, buatKraepelin, nilaiKraepelin, nilaiPilihan, hitungKepribadian,
  DIMENSI, KRAEPELIN, labelSkor, buatKecermatan, nilaiKecermatan, KECERMATAN, LABEL_KECERMATAN,
} from "../../data/tesKerja";
import { t } from "../../i18n.js";

const IKON = { Columns3, BookA, Sigma, Brain, ScanSearch, UserRound, Languages, Shapes, Focus, GraduationCap };
const LIKERT = [t("Sangat tidak sesuai", "Strongly disagree"), t("Tidak sesuai", "Disagree"), t("Netral", "Neutral"), t("Sesuai", "Agree"), t("Sangat sesuai", "Strongly agree")];

/* ------------------------------------------------------------------ */
/*  Gambar untuk soal figural                                          */
/* ------------------------------------------------------------------ */

const bacaFigur = (x) => {
  if (typeof x !== "string") return x;
  try {
    return JSON.parse(x);
  } catch {
    return null;
  }
};

export function Figur({ data, ukuran = 56 }) {
  const f = bacaFigur(data);
  if (!f) return null;
  const c = 50, R = 34;
  const warna = f.f ? "currentColor" : "none";
  let bentuk;
  if (f.s === 0) bentuk = <circle cx={c} cy={c} r={R} />;
  else if (f.s === 1) bentuk = <path d="M50 12 L74 42 L59 42 L59 86 L41 86 L41 42 L26 42 Z" />;
  else {
    const titik = Array.from({ length: f.s }, (_, i) => {
      const a = (-90 + (360 / f.s) * i) * (Math.PI / 180);
      return `${(c + R * Math.cos(a)).toFixed(1)},${(c + R * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
    bentuk = <polygon points={titik} />;
  }
  const n = f.n || 0;
  const kolom = n <= 4 ? 2 : 3;
  const baris = Math.ceil(n / kolom);
  const jarak = 13;
  const titikIsi = Array.from({ length: n }, (_, i) => {
    const b = Math.floor(i / kolom), k = i % kolom;
    const dalamBaris = b === baris - 1 ? n - b * kolom : kolom;
    return [c + (k - (dalamBaris - 1) / 2) * jarak, c + 4 + (b - (baris - 1) / 2) * jarak];
  });
  return (
    <svg className="pb-fig" width={ukuran} height={ukuran} viewBox="0 0 100 100" aria-hidden="true">
      <g transform={`rotate(${f.r || 0} 50 50)`} fill={warna} stroke="currentColor" strokeWidth="4" strokeLinejoin="round">
        {bentuk}
      </g>
      {titikIsi.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.2" className={f.f ? "putih" : ""} fill="currentColor" />
      ))}
    </svg>
  );
}

function SeriFigur({ seri }) {
  return (
    <div className="pb-fig-seri">
      {seri.map((x, i) => (
        <span key={i}>
          <Figur data={x} ukuran={60} />
        </span>
      ))}
      <span className="tanya">?</span>
    </div>
  );
}

function Bacaan({ teks, ringkas }) {
  const [buka, setBuka] = useState(!ringkas);
  if (!teks) return null;
  return (
    <div className="pb-tk-bacaan">
      <button type="button" onClick={() => setBuka((x) => !x)}>
        <BookOpen size={14} /> {t("Bacaan / data", "Passage / data")} {ringkas && (buka ? "▴" : "▾")}
      </button>
      {buka && <p>{teks}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Layar pembuka: tips sebelum tes dimulai                            */
/* ------------------------------------------------------------------ */

export function IntroTes({ tes, contoh, onMulai, onBatal, memulai }) {
  return (
    <div className="pb-panel pb-tk-intro">
      <span className="pb-label">{contoh ? t("Contoh soal", "Sample questions") : t("Sebelum mulai", "Before you start")}</span>
      <h3>{tes.nama}</h3>
      <p className="pb-tk-ket">{tes.ket}</p>
      <div className="pb-tk-info-mulai">
        <span>
          <Clock size={14} /> {tes.info}
        </span>
      </div>
      {tes.tips?.length > 0 && (
        <div className="pb-tk-tips">
          <b>
            <Lightbulb size={15} /> {t("Tips mengerjakan", "Tips")}
          </b>
          <ol>
            {tes.tips.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </div>
      )}
      {!contoh && (
        <p className="pb-tk-peringatan">
          <AlertTriangle size={14} />
          {t(
            "Tes ini hanya bisa dikerjakan SEKALI di paket Max-mu dan langsung dihitung terpakai saat dimulai, seperti tes sungguhan. Jangan menutup halaman sampai selesai.",
            "This test can be taken ONCE on your Max plan and counts as used once started, like a real test. Don't close the page until you finish.",
          )}
        </p>
      )}
      <div className="pb-tk-nav">
        <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={onBatal}>
          {t("Batal", "Cancel")}
        </button>
        <button type="button" className="pb-btn pb-btn-primary" disabled={memulai} onClick={onMulai}>
          {memulai ? <Loader2 size={15} className="pb-po-putar" /> : <Play size={15} />} {contoh ? t("Coba contoh", "Try sample") : t("Mulai tes sekarang", "Start the test now")}
        </button>
      </div>
    </div>
  );
}

const mmss = (d) => `${String(Math.floor(Math.max(0, d) / 60)).padStart(2, "0")}:${String(Math.max(0, d) % 60).padStart(2, "0")}`;

/* ------------------------------------------------------------------ */
/*  Pengerjaan tes pilihan ganda / Likert                              */
/* ------------------------------------------------------------------ */

export function TesPilihan({ tes, soal, batasDetik, onSelesai, onBatal, contoh }) {
  const [i, setI] = useState(0);
  const [jawab, setJawab] = useState({});
  const [sisa, setSisa] = useState(batasDetik);
  const selesaiRef = useRef(false);
  const kepribadian = tes.id === "kepribadian";
  const ketelitian = tes.id === "ketelitian";

  const kirim = useCallback(() => {
    if (selesaiRef.current) return;
    selesaiRef.current = true;
    onSelesai(jawab);
  }, [jawab, onSelesai]);

  useEffect(() => {
    if (!batasDetik) return undefined;
    const id = setInterval(() => setSisa((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [batasDetik]);
  useEffect(() => {
    if (batasDetik && sisa <= 0) kirim();
  }, [sisa, batasDetik, kirim]);

  const s = soal[i];
  const pilih = (j) => {
    setJawab((x) => ({ ...x, [i]: j }));
    // Ketelitian & kepribadian: langsung ke soal berikutnya supaya cepat
    if ((ketelitian || kepribadian) && i < soal.length - 1) setTimeout(() => setI((x) => Math.min(soal.length - 1, x + 1)), 140);
  };

  // Pintasan keyboard untuk ketelitian: S = sama, B/D = berbeda
  useEffect(() => {
    if (!ketelitian) return undefined;
    const f = (e) => {
      const k = e.key.toLowerCase();
      if (k === "s") pilih(0);
      if (k === "b" || k === "d") pilih(1);
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  });

  const terjawab = Object.keys(jawab).length;

  return (
    <div className="pb-tk-kerja">
      <div className="pb-tk-bar">
        <button type="button" className="pb-tk-batal" onClick={onBatal}>
          <X size={15} /> {contoh ? t("Tutup contoh", "Close sample") : t("Keluar", "Exit")}
        </button>
        <b>{tes.nama}{contoh ? ` · ${t("Contoh", "Sample")}` : ""}</b>
        {batasDetik ? (
          <span className={`pb-tk-waktu ${sisa <= 60 ? "habis" : ""}`}>
            <Clock size={14} /> {mmss(sisa)}
          </span>
        ) : (
          <span className="pb-tk-waktu">{terjawab}/{soal.length}</span>
        )}
      </div>
      <div className="pb-tk-progres">
        <i style={{ width: `${(terjawab / soal.length) * 100}%` }} />
      </div>

      <div className="pb-panel pb-tk-soal">
        <div className="pb-tk-no">
          {t("Soal", "Question")} {i + 1} / {soal.length}
          {s.bagian && <span>{s.bagian}</span>}
        </div>
        {s.pasangan ? (
          <div className="pb-tk-pasang">
            {s.q.split("\n").map((baris, k) => (
              <div key={k}>
                <small>{k ? t("Data B", "Entry B") : t("Data A", "Entry A")}</small>
                <code>{baris}</code>
              </div>
            ))}
          </div>
        ) : (
          <>
            <Bacaan key={s.bacaan || i} teks={s.bacaan} />
            <p className="pb-tk-tanya">{s.q}</p>
            {s.figural && <SeriFigur seri={s.seri} />}
          </>
        )}

        {s.likert ? (
          <div className="pb-tk-likert">
            {LIKERT.map((l, j) => (
              <button key={l} type="button" className={jawab[i] === j ? "on" : ""} onClick={() => pilih(j)}>
                <span>{j + 1}</span>
                {l}
              </button>
            ))}
          </div>
        ) : (
          <div className={`pb-tk-pilihan ${ketelitian ? "dua" : ""} ${s.figural ? "fig" : ""}`}>
            {s.o.map((o, j) => (
              <button key={o} type="button" className={jawab[i] === j ? "on" : ""} onClick={() => pilih(j)}>
                {!ketelitian && <span>{String.fromCharCode(65 + j)}</span>}
                {s.figural ? <Figur data={o} /> : o}
                {ketelitian && <kbd>{j ? "B" : "S"}</kbd>}
              </button>
            ))}
          </div>
        )}

        <div className="pb-tk-nav">
          <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" disabled={i === 0} onClick={() => setI(i - 1)}>
            <ArrowLeft size={14} /> {t("Sebelumnya", "Previous")}
          </button>
          {i < soal.length - 1 ? (
            <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={() => setI(i + 1)}>
              {t("Berikutnya", "Next")} <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              className="pb-btn pb-btn-primary pb-btn-sm"
              onClick={() => {
                const kosong = soal.length - terjawab;
                if (kosong > 0 && !window.confirm(t(`Masih ada ${kosong} soal kosong. Selesaikan tes sekarang?`, `${kosong} question(s) are unanswered. Finish now?`))) return;
                kirim();
              }}
            >
              <Check size={14} /> {t("Selesai", "Finish")}
            </button>
          )}
        </div>
      </div>

      {!kepribadian && soal.length > 5 && (
        <div className="pb-tk-peta">
          {soal.map((_, k) => (
            <button key={k} type="button" className={`${jawab[k] != null ? "isi" : ""} ${k === i ? "kini" : ""}`} onClick={() => setI(k)}>
              {k + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Kraepelin                                                          */
/* ------------------------------------------------------------------ */

export function TesKraepelin({ benih, kolomAwal = 0, onSelesai, onBatal, contoh }) {
  const jumlahKolom = contoh ? 3 : KRAEPELIN.kolom;
  const detik = contoh ? 15 : KRAEPELIN.detikPerKolom;
  const angka = useMemo(() => buatKraepelin(buatAcak(benih)).slice(0, jumlahKolom), [benih, jumlahKolom]);
  const [kolom, setKolom] = useState(kolomAwal);
  const [pos, setPos] = useState(0); // pasangan ke-n dari bawah
  const [sisa, setSisa] = useState(detik);
  const [mulai, setMulai] = useState(false);
  const hasil = useRef(Array.from({ length: jumlahKolom }, () => ({ dijawab: 0, benar: 0 })));
  const kolomRef = useRef(kolom);
  kolomRef.current = kolom;

  const lanjutKolom = useCallback(() => {
    if (kolomRef.current >= jumlahKolom - 1) {
      onSelesai(hasil.current);
      return;
    }
    setKolom((k) => k + 1);
    setPos(0);
    setSisa(detik);
  }, [jumlahKolom, detik, onSelesai]);

  useEffect(() => {
    if (!mulai) return undefined;
    const id = setInterval(() => setSisa((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [mulai]);
  useEffect(() => {
    if (mulai && sisa <= 0) lanjutKolom();
  }, [sisa, mulai, lanjutKolom]);

  const kol = angka[kolom] || [];
  const n = kol.length;
  // Angka disusun dari atas ke bawah; penjumlahan dimulai dari bawah
  const bawah = n - 1 - pos;
  const jawab = (d) => {
    if (!mulai || pos >= n - 1) return;
    const benar = (kol[bawah] + kol[bawah - 1]) % 10;
    const h = hasil.current[kolom];
    h.dijawab++;
    if (d === benar) h.benar++;
    setPos((p) => p + 1);
  };

  useEffect(() => {
    const f = (e) => {
      if (/^\d$/.test(e.key)) jawab(Number(e.key));
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  });

  if (!mulai) {
    return (
      <div className="pb-panel pb-tk-intro">
        <h3>{t("Cara mengerjakan Kraepelin", "How the Kraepelin test works")}</h3>
        <ol>
          <li>{t("Setiap kolom berisi deretan angka. Jumlahkan dua angka yang bersebelahan, mulai dari paling BAWAH ke atas.", "Each column is a stack of digits. Add each adjacent pair, starting from the BOTTOM going up.")}</li>
          <li>{t("Ketik angka terakhir hasilnya saja. Contoh: 7 + 8 = 15, ketik 5.", "Type only the last digit of the sum. E.g. 7 + 8 = 15, type 5.")}</li>
          <li>{t(`Setiap kolom diberi ${detik} detik. Saat waktunya habis, kamu otomatis pindah ke kolom berikutnya, walaupun belum sampai atas.`, `Each column gets ${detik} seconds. When time's up you move to the next column automatically, even if you haven't reached the top.`)}</li>
          <li>{t("Kejar kecepatan, tetapi jaga ketelitian dan kestabilan dari awal sampai akhir. Itu yang dinilai.", "Aim for speed, but keep accuracy and a steady pace from start to finish. That's what's assessed.")}</li>
        </ol>
        <div className="pb-tk-nav">
          <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={onBatal}>
            {t("Batal", "Cancel")}
          </button>
          <button type="button" className="pb-btn pb-btn-primary" onClick={() => setMulai(true)}>
            <Play size={15} /> {t("Mulai", "Start")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-tk-kerja">
      <div className="pb-tk-bar">
        <button type="button" className="pb-tk-batal" onClick={onBatal}>
          <X size={15} /> {contoh ? t("Tutup contoh", "Close sample") : t("Keluar", "Exit")}
        </button>
        <b>
          {t("Kolom", "Column")} {kolom + 1} / {jumlahKolom}
        </b>
        <span className={`pb-tk-waktu ${sisa <= 5 ? "habis" : ""}`}>
          <Clock size={14} /> {sisa}s
        </span>
      </div>
      <div className="pb-tk-progres">
        <i style={{ width: `${(sisa / detik) * 100}%`, transition: "width 1s linear" }} />
      </div>
      <div className="pb-kr">
        <div className="pb-kr-kolom" aria-label={t("Kolom angka", "Digit column")}>
          {kol.map((d, k) => {
            const aktif = k === bawah || k === bawah - 1;
            const lewat = k > bawah;
            return (
              <span key={k} className={`${aktif ? "aktif" : ""} ${lewat ? "lewat" : ""}`}>
                {d}
              </span>
            );
          })}
        </div>
        <div className="pb-kr-kanan">
          <p className="pb-kr-tanya">
            {pos < n - 1 ? (
              <>
                {kol[bawah]} + {kol[bawah - 1]} = <b>?</b>
              </>
            ) : (
              t("Kolom selesai. Tunggu kolom berikutnya…", "Column done. Wait for the next one…")
            )}
          </p>
          <div className="pb-kr-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
              <button key={d} type="button" onClick={() => jawab(d)}>
                {d}
              </button>
            ))}
          </div>
          <small>{t("Bisa juga mengetik angka di keyboard.", "You can also type digits on your keyboard.")}</small>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Kecermatan (simbol hilang)                                         */
/* ------------------------------------------------------------------ */

export function TesKecermatan({ benih, onSelesai, onBatal, contoh }) {
  const jumlahKolom = contoh ? 2 : KECERMATAN.kolom;
  const detik = contoh ? 20 : KECERMATAN.detikPerKolom;
  const data = useMemo(() => buatKecermatan(buatAcak(benih), jumlahKolom), [benih, jumlahKolom]);
  const [kolom, setKolom] = useState(0);
  const [pos, setPos] = useState(0);
  const [sisa, setSisa] = useState(detik);
  const [kilat, setKilat] = useState("");
  const hasil = useRef(Array.from({ length: jumlahKolom }, () => ({ dijawab: 0, benar: 0 })));
  const kolomRef = useRef(0);
  kolomRef.current = kolom;
  const selesaiRef = useRef(false);

  const lanjutKolom = useCallback(() => {
    if (kolomRef.current >= jumlahKolom - 1) {
      if (!selesaiRef.current) {
        selesaiRef.current = true;
        onSelesai(hasil.current);
      }
      return;
    }
    setKolom((k) => k + 1);
    setPos(0);
    setSisa(detik);
  }, [jumlahKolom, detik, onSelesai]);

  useEffect(() => {
    const id = setInterval(() => setSisa((x) => x - 1), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (sisa <= 0) lanjutKolom();
  }, [sisa, lanjutKolom]);

  const kol = data[kolom];
  const soal = kol.soal[pos % kol.soal.length];
  const jawab = (j) => {
    const h = hasil.current[kolom];
    h.dijawab++;
    if (j === soal.a) h.benar++;
    setKilat(j === soal.a ? "ok" : "");
    setPos((p) => p + 1);
  };

  useEffect(() => {
    const f = (e) => {
      const j = LABEL_KECERMATAN.indexOf(e.key.toUpperCase());
      if (j >= 0) jawab(j);
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  });

  return (
    <div className="pb-tk-kerja">
      <div className="pb-tk-bar">
        <button type="button" className="pb-tk-batal" onClick={onBatal}>
          <X size={15} /> {contoh ? t("Tutup contoh", "Close sample") : t("Keluar", "Exit")}
        </button>
        <b>
          {t("Kolom", "Column")} {kolom + 1} / {jumlahKolom}
        </b>
        <span className={`pb-tk-waktu ${sisa <= 5 ? "habis" : ""}`}>
          <Clock size={14} /> {Math.max(0, sisa)}s
        </span>
      </div>
      <div className="pb-tk-progres">
        <i style={{ width: `${(Math.max(0, sisa) / detik) * 100}%`, transition: "width 1s linear" }} />
      </div>
      <div className="pb-panel pb-kc">
        <div className="pb-kc-kunci">
          {kol.kunci.map((x, j) => (
            <div key={j}>
              <b>{x}</b>
              <span>{LABEL_KECERMATAN[j]}</span>
            </div>
          ))}
        </div>
        <p className="pb-tk-ket">{t("Simbol mana yang TIDAK ada di bawah ini?", "Which symbol is MISSING below?")}</p>
        <div className={`pb-kc-soal ${kilat}`} key={pos}>
          {soal.tampil.map((x, j) => (
            <b key={j}>{x}</b>
          ))}
        </div>
        <div className="pb-kc-pad">
          {LABEL_KECERMATAN.map((l, j) => (
            <button key={l} type="button" onClick={() => jawab(j)}>
              {l}
            </button>
          ))}
        </div>
        <small className="pb-tk-ket">
          {t(`Terjawab di kolom ini: ${pos}. Bisa juga menekan huruf A–E di keyboard.`, `Answered in this column: ${pos}. You can also press A–E on your keyboard.`)}
        </small>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hasil                                                              */
/* ------------------------------------------------------------------ */

function GrafikKraepelin({ perKolom, batas = KRAEPELIN.baris - 1 }) {
  const W = 560, H = 160, P = 22;
  const maks = Math.max(batas, ...perKolom.map((k) => k.dijawab));
  const x = (i) => P + (i * (W - P * 2)) / Math.max(1, perKolom.length - 1);
  const y = (v) => H - P - (v / maks) * (H - P * 2);
  const garis = perKolom.map((k, i) => `${x(i)},${y(k.dijawab)}`).join(" ");
  return (
    <svg className="pb-kr-grafik" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t("Grafik jumlah jawaban per kolom", "Answers per column chart")}>
      <line x1={P} y1={H - P} x2={W - P} y2={H - P} />
      <polyline points={garis} />
      {perKolom.map((k, i) => (
        <circle key={i} cx={x(i)} cy={y(k.dijawab)} r="3" />
      ))}
      <text x={P} y={H - 5}>1</text>
      <text x={W - P} y={H - 5} textAnchor="end">{perKolom.length}</text>
    </svg>
  );
}

export function Hasil({ tes, sesi, soal, onKembali }) {
  const [tinjau, setTinjau] = useState(false);
  const [hanyaSalah, setHanyaSalah] = useState(false);
  const h = sesi.hasil || {};
  const kolomTes = tes.id === "kraepelin" || tes.id === "kecermatan";
  return (
    <div className="pb-tk-hasil">
      <button type="button" className="pb-link" onClick={onKembali} style={{ border: 0, background: "none", cursor: "pointer", padding: 0, marginBottom: 12 }}>
        <ArrowLeft size={15} /> {t("Kembali ke daftar tes", "Back to tests")}
      </button>
      <div className="pb-panel">
        <span className="pb-label">{tes.nama}</span>
        {tes.id !== "kepribadian" ? (
          <div className="pb-tk-skor">
            <b>{sesi.skor ?? 0}</b>
            <div>
              <strong>{labelSkor(sesi.skor ?? 0)}</strong>
              <span>
                {kolomTes
                  ? t(`${h.total ?? 0} jawaban, ${h.benar ?? 0} benar`, `${h.total ?? 0} answers, ${h.benar ?? 0} correct`)
                  : t(`${h.benar ?? 0} dari ${h.total ?? 0} soal benar`, `${h.benar ?? 0} of ${h.total ?? 0} correct`)}
              </span>
            </div>
          </div>
        ) : (
          <h2 style={{ margin: "6px 0 14px" }}>{t("Profil kepribadian kerjamu", "Your work personality profile")}</h2>
        )}

        {kolomTes && h.perKolom && (
          <>
            <div className="pb-tk-batang">
              {[
                ["kecepatan", t("Kecepatan", "Speed")],
                ["ketelitian", t("Ketelitian", "Accuracy")],
                ["keajegan", t("Keajegan (stabil)", "Consistency")],
                ["ketahanan", t("Ketahanan", "Endurance")],
              ].map(([k, l]) => (
                <div key={k}>
                  <span>{l}</span>
                  <i>
                    <em style={{ width: `${h[k] ?? 0}%` }} />
                  </i>
                  <b>{h[k] ?? 0}</b>
                </div>
              ))}
            </div>
            <h4 className="pb-tk-sub">{t("Grafik kerjamu per kolom", "Your output per column")}</h4>
            <GrafikKraepelin perKolom={h.perKolom} batas={tes.id === "kecermatan" ? 25 : KRAEPELIN.baris - 1} />
            <p className="pb-tk-ket">
              {t(
                "Garis yang stabil dan sedikit naik di akhir menunjukkan ritme kerja yang terjaga. Garis yang turun tajam di akhir menandakan cepat lelah; garis yang naik-turun menandakan konsentrasi belum ajeg.",
                "A steady line that rises slightly at the end shows a sustained pace. A sharp drop at the end suggests fatigue; a jagged line suggests inconsistent focus.",
              )}
            </p>
          </>
        )}

        {tes.id === "kepribadian" && h.dimensi && (
          <div className="pb-tk-dimensi">
            {Object.entries(DIMENSI).map(([k, d]) => (
              <div key={k}>
                <div className="atas">
                  <b>{d.nama}</b>
                  <span>{h.dimensi[k]}</span>
                </div>
                <i>
                  <em style={{ width: `${h.dimensi[k]}%` }} />
                </i>
                <p>{h.dimensi[k] >= 50 ? d.tinggi : d.rendah}</p>
              </div>
            ))}
            <p className="pb-tk-ket">
              {t(
                "Di tes kepribadian sungguhan, jawablah jujur dan konsisten. Banyak tes memuat pertanyaan berulang dengan kalimat berbeda untuk mendeteksi jawaban yang dibuat-buat.",
                "In real personality tests, answer honestly and consistently. Many tests repeat questions in different words to spot faked answers.",
              )}
            </p>
          </div>
        )}

        {h.perBagian && (
          <div className="pb-tk-batang">
            {Object.entries(h.perBagian).map(([b, v]) => (
              <div key={b}>
                <span>{b}</span>
                <i>
                  <em style={{ width: `${v.total ? (v.benar / v.total) * 100 : 0}%` }} />
                </i>
                <b>
                  {v.benar}/{v.total}
                </b>
              </div>
            ))}
          </div>
        )}

        {tes.tips?.length > 0 && tes.id !== "kepribadian" && (
          <div className="pb-tk-tips">
            <b>
              <Lightbulb size={15} /> {t("Tips untuk tes sungguhan", "Tips for the real test")}
            </b>
            <ol>
              {tes.tips.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          </div>
        )}

        {soal?.length > 0 && !soal[0].likert && (
          <>
            <div className="pb-tk-bahas-atas">
              <button type="button" className="pb-po-teks-tombol" onClick={() => setTinjau((x) => !x)}>
                <Eye size={14} /> {tinjau ? t("Sembunyikan pembahasan", "Hide answers") : t("Lihat kunci & pembahasan", "See answers & explanations")}
              </button>
              {tinjau && (
                <label>
                  <input type="checkbox" checked={hanyaSalah} onChange={(e) => setHanyaSalah(e.target.checked)} /> {t("Hanya yang salah/kosong", "Only wrong/blank")}
                </label>
              )}
            </div>
            {tinjau && (
              <ol className="pb-tk-bahas">
                {soal.map((s, i) => {
                  const j = h.jawaban?.[i];
                  const benar = j === s.a;
                  if (hanyaSalah && benar) return null;
                  const tampil = (k) => (k == null ? t("(kosong)", "(blank)") : s.figural ? <Figur data={s.o[k]} ukuran={34} /> : s.o[k]);
                  return (
                    <li key={i} value={i + 1} className={benar ? "benar" : "salah"}>
                      {s.bagian && <em className="pb-tk-bahas-bagian">{s.bagian}</em>}
                      {s.bacaan && (i === 0 || soal[i - 1].bacaan !== s.bacaan || hanyaSalah) && <Bacaan teks={s.bacaan} ringkas />}
                      <p>{s.q}</p>
                      {s.figural && <SeriFigur seri={s.seri} />}
                      <div className="pb-tk-bahas-jawab">
                        <span className="kamu">
                          {benar ? <Check size={13} /> : <X size={13} />} {t("Jawabanmu", "Your answer")}: {tampil(j)}
                        </span>
                        {!benar && (
                          <span className="kunci">
                            <Check size={13} /> {t("Kunci", "Answer")}: {tampil(s.a)}
                          </span>
                        )}
                      </div>
                      {s.e && (
                        <div className="pb-tk-bahas-e">
                          <b>{t("Pembahasan", "Explanation")}</b>
                          {s.e}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
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

export function TesKerjaPanel({ setActive }) {
  const { user } = useAuth();
  const langganan = useLangganan();
  const max = langganan.aktif && langganan.paket === "serius";
  const [sesi, setSesi] = useState(null);
  const [galat, setGalat] = useState("");
  const [jalan, setJalan] = useState(null); // { tes, sesi?, contoh, benih }
  const [lihat, setLihat] = useState(null); // { tes, sesi, soal }
  const [memulai, setMemulai] = useState("");
  const [intro, setIntro] = useState(null); // { tes, contoh }

  const muat = useCallback(async () => {
    if (!user || !supabaseConfigured) {
      setSesi([]);
      return;
    }
    const { data, error } = await supabase.from("tes_sesi").select("*").order("mulai_at", { ascending: false });
    if (error) {
      setGalat(/relation|does not exist|schema cache/i.test(error.message) ? t("Fitur tes belum disiapkan di database. Jalankan supabase/sql/06_tes_fgd.sql.", "Tests aren't set up in the database yet. Run supabase/sql/06_tes_fgd.sql.") : error.message);
      setSesi([]);
      return;
    }
    setSesi(data || []);
  }, [user]);

  useEffect(() => {
    muat();
  }, [muat]);

  // Sesi terbaru per jenis (langganan Max terkini)
  const perJenis = useMemo(() => {
    const m = {};
    (sesi || []).forEach((s) => {
      if (!m[s.jenis]) m[s.jenis] = s;
    });
    return m;
  }, [sesi]);

  const mulai = async (tes, sudahIntro = false) => {
    const ada = perJenis[tes.id];
    if (!sudahIntro && (!ada || ada.status !== "berjalan")) {
      setIntro({ tes, contoh: false });
      return;
    }
    setMemulai(tes.id);
    setGalat("");
    const { data, error } = await supabase.rpc("mulai_tes", { p_jenis: tes.id, p_benih: Math.floor(Math.random() * 2 ** 31) + 1 });
    setMemulai("");
    if (error) {
      setGalat(error.message);
      setIntro(null);
      return;
    }
    const s = Array.isArray(data) ? data[0] : data;
    setIntro(null);
    setJalan({ tes, sesi: s, benih: Number(s.benih), contoh: false });
  };

  const cobaContoh = (tes) => setIntro({ tes, contoh: true });

  const simpan = async (tes, jalanSesi, hasil, skor, soal) => {
    if (jalan?.contoh) {
      setLihat({ tes, sesi: { skor, hasil }, soal });
      setJalan(null);
      return;
    }
    const { data, error } = await supabase.rpc("selesaikan_tes", { p_id: jalanSesi.id, p_skor: skor, p_hasil: hasil });
    if (error) {
      setGalat(error.message);
      setJalan(null);
      return;
    }
    const s = Array.isArray(data) ? data[0] : data;
    await muat();
    setJalan(null);
    setLihat({ tes, sesi: s, soal });
  };

  /* ---------- sedang mengerjakan ---------- */
  if (jalan) {
    const { tes, benih, contoh } = jalan;
    const keluar = () => {
      if (contoh || window.confirm(t("Keluar dari tes? Tes tetap dihitung terpakai, dan jawabanmu sejauh ini tidak tersimpan.", "Leave the test? It still counts as used, and your answers so far won't be saved."))) setJalan(null);
    };
    if (tes.id === "kecermatan") {
      return (
        <TesKecermatan
          benih={benih}
          contoh={contoh}
          onBatal={keluar}
          onSelesai={(perKolom) => {
            const n = nilaiKecermatan(perKolom);
            simpan(tes, jalan.sesi, { ...n, perKolom }, n.skor, null);
          }}
        />
      );
    }
    if (tes.id === "kraepelin") {
      return (
        <TesKraepelin
          benih={benih}
          contoh={contoh}
          onBatal={keluar}
          onSelesai={(perKolom) => {
            const n = nilaiKraepelin(perKolom);
            simpan(tes, jalan.sesi, { ...n, perKolom }, n.skor, null);
          }}
        />
      );
    }
    const soal = buatSoal(tes.id, benih, contoh);
    // Sisa waktu memperhitungkan waktu yang sudah berjalan (mis. halaman dimuat ulang)
    const lewat = jalan.sesi?.mulai_at ? Math.floor((Date.now() - new Date(jalan.sesi.mulai_at).getTime()) / 1000) : 0;
    const batas = tes.menit ? Math.max(30, (contoh ? 2 * 60 : tes.menit * 60) - (contoh ? 0 : lewat)) : 0;
    return (
      <TesPilihan
        tes={tes}
        soal={soal}
        contoh={contoh}
        batasDetik={batas}
        onBatal={keluar}
        onSelesai={(jawaban) => {
          if (tes.id === "kepribadian") {
            const dimensi = hitungKepribadian(soal, jawaban);
            simpan(tes, jalan.sesi, { dimensi, jawaban }, Math.round(Object.values(dimensi).reduce((a, b) => a + b, 0) / 5), soal);
          } else {
            const n = nilaiPilihan(soal, jawaban);
            simpan(tes, jalan.sesi, { ...n, jawaban }, n.skor, soal);
          }
        }}
      />
    );
  }

  if (intro) {
    const { tes, contoh } = intro;
    return (
      <IntroTes
        tes={tes}
        contoh={contoh}
        memulai={memulai === tes.id}
        onBatal={() => setIntro(null)}
        onMulai={() => {
          if (contoh) {
            setIntro(null);
            setJalan({ tes, contoh: true, benih: Date.now() % 2 ** 31 });
          } else mulai(tes, true);
        }}
      />
    );
  }

  if (lihat) return <Hasil tes={lihat.tes} sesi={lihat.sesi} soal={lihat.soal} onKembali={() => setLihat(null)} />;

  if (sesi === null || langganan.loading) {
    return (
      <div className="pb-po-muat">
        <Loader2 size={18} className="pb-po-putar" /> {t("Memuat…", "Loading…")}
      </div>
    );
  }

  const selesai = JENIS_TES.filter((x) => perJenis[x.id]?.status === "selesai").length;

  return (
    <div className="pb-tk">
      {galat && (
        <div className="pb-po-galat">
          {galat}
          <button type="button" onClick={() => setGalat("")} aria-label={t("Tutup", "Close")}>
            <X size={14} />
          </button>
        </div>
      )}

      {!max && (
        <div className="pb-panel pb-tk-ajak">
          <Lock size={18} />
          <div>
            <b>{t("Tes lengkap khusus paket Max", "Full tests are for the Max plan")}</b>
            <span>{t("Semua orang bisa mencoba contoh soal. Dengan Max, kamu mengerjakan setiap tes versi lengkap (1x per tes) dan mendapat hasil serta pembahasannya.", "Anyone can try sample questions. With Max you take the full version of every test (once each) and get scores and explanations.")}</span>
          </div>
          <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={() => setActive?.("paket")}>
            {t("Lihat Max", "See Max")} <ArrowRight size={14} />
          </button>
        </div>
      )}

      {max && (
        <div className="pb-panel pb-tk-ringkas">
          <div>
            <span className="pb-label">{t("Progres tes", "Test progress")}</span>
            <h2>
              {selesai} / {JENIS_TES.length}
            </h2>
          </div>
          <p>{t("Setiap tes bisa dikerjakan sekali di paket Max-mu. Kerjakan saat kondisi segar, di tempat tenang, seperti hari tes sungguhan.", "Each test can be taken once on your Max plan. Take it when you're fresh, somewhere quiet, like on a real test day.")}</p>
        </div>
      )}

      <div className="pb-tk-grid">
        {JENIS_TES.map((tes) => {
          const Ikon = IKON[tes.ikon] || Brain;
          const s = perJenis[tes.id];
          return (
            <div key={tes.id} className={`pb-tk-kartu ${s?.status === "selesai" ? "beres" : ""}`}>
              <div className="atas">
                <span className="ikon">
                  <Ikon size={19} />
                </span>
                {s?.status === "selesai" && (
                  <span className="pb-tk-nilai">
                    {tes.id === "kepribadian" ? <Check size={13} /> : s.skor}
                  </span>
                )}
              </div>
              <b>{tes.nama}</b>
              <p>{tes.ket}</p>
              <small>{tes.info}</small>
              <div className="bawah">
                {s?.status === "selesai" ? (
                  <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={() => setLihat({ tes, sesi: s, soal: tes.id === "kraepelin" || tes.id === "kecermatan" ? null : buatSoal(tes.id, Number(s.benih)) })}>
                    {t("Lihat hasil", "See result")}
                  </button>
                ) : max ? (
                  <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" disabled={!!memulai} onClick={() => mulai(tes)}>
                    {memulai === tes.id ? <Loader2 size={13} className="pb-po-putar" /> : s?.status === "berjalan" ? <RotateCcw size={13} /> : <Play size={13} />}{" "}
                    {s?.status === "berjalan" ? t("Lanjutkan", "Resume") : t("Mulai tes", "Start test")}
                  </button>
                ) : null}
                <button type="button" className="pb-po-teks-tombol" onClick={() => cobaContoh(tes)}>
                  {t("Coba contoh soal", "Try a sample")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pb-tk-catatan">
        <AlertTriangle size={15} />
        <span>
          {t(
            "Tes ini adalah latihan yang meniru format psikotes umum di Indonesia. Hasilnya untuk mengenali kekuatan dan kelemahanmu, bukan diagnosis psikologis resmi. Kunci jawaban dan pembahasan tersedia setelah tes selesai.",
            "These are practice tests modelled on common Indonesian psychometric formats. Results help you see strengths and weaknesses; they aren't an official psychological assessment. Answer keys and explanations are available after you finish.",
          )}
        </span>
      </div>
    </div>
  );
}
