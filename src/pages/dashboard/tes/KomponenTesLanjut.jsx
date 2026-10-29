import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Download, Eraser, Pencil, RotateCcw, X, ChevronDown, ExternalLink, Lightbulb } from "lucide-react";
import { bacaGrid } from "../../../data/tes/spasial.js";
import { DISC_DIMENSI, EPPS_KEBUTUHAN, TIPE16 } from "../../../data/tes/profil.js";
import { WARTEGG, LATIHAN_GAMBAR } from "../../../data/tes/gambar.js";
import { PAKET_SELEKSI } from "../../../data/tes/paketSeleksi.js";
import { t } from "../../../i18n.js";

const mmss = (d) => `${String(Math.floor(Math.max(0, d) / 60)).padStart(2, "0")}:${String(Math.max(0, d) % 60).padStart(2, "0")}`;

/* ------------------------------------------------------------------ */
/*  Bangun kotak untuk tes spasial                                      */
/* ------------------------------------------------------------------ */

export function Grid({ kode, ukuran = 64 }) {
  const sel = bacaGrid(kode);
  const w = Math.max(...sel.map((c) => c[0])) + 1;
  const h = Math.max(...sel.map((c) => c[1])) + 1;
  const sisi = Math.max(w, h, 4);
  const kotak = 100 / sisi;
  const ox = ((sisi - w) * kotak) / 2;
  const oy = ((sisi - h) * kotak) / 2;
  return (
    <svg className="pb-grid-fig" width={ukuran} height={ukuran} viewBox="-2 -2 104 104" aria-hidden="true">
      {sel.map(([x, y]) => (
        <rect key={`${x},${y}`} x={ox + x * kotak} y={oy + y * kotak} width={kotak} height={kotak} rx="1.5" />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagram himpunan (tes diagram reasoning)                            */
/* ------------------------------------------------------------------ */

const LINGKARAN = {
  terpisah: [[20, 35, 13], [50, 35, 13], [80, 35, 13]],
  bersarang: [[50, 35, 30], [50, 35, 19], [50, 35, 9]],
  dua_dalam: [[50, 35, 31], [37, 35, 11], [63, 35, 11]],
  dua_iris: [[50, 35, 31], [41, 35, 13], [59, 35, 13]],
  iris_satu: [[24, 35, 15], [42, 35, 15], [80, 35, 13]],
  iris_tiga: [[40, 28, 17], [60, 28, 17], [50, 45, 17]],
  dalam_satu: [[34, 35, 25], [34, 35, 11], [80, 35, 13]],
};

export function Venn({ tipe, ukuran = 96 }) {
  const c = LINGKARAN[tipe] || LINGKARAN.terpisah;
  return (
    <svg className="pb-venn" width={ukuran} height={(ukuran * 70) / 100} viewBox="0 0 100 70" aria-hidden="true">
      {c.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  DISC: pilih paling & paling tidak                                   */
/* ------------------------------------------------------------------ */

export function TesDisc({ soal, onSelesai, onBatal, contoh }) {
  const [i, setI] = useState(0);
  const [jawab, setJawab] = useState({});
  const s = soal[i];
  const j = jawab[i] || {};
  const lengkap = j.paling != null && j.tidak != null;
  const set = (jenis, k) =>
    setJawab((x) => {
      const lama = x[i] || {};
      const baru = { ...lama, [jenis]: k };
      // Satu kata tidak boleh dipilih sebagai paling DAN paling tidak
      if (jenis === "paling" && lama.tidak === k) baru.tidak = null;
      if (jenis === "tidak" && lama.paling === k) baru.paling = null;
      return { ...x, [i]: baru };
    });
  const terisi = Object.values(jawab).filter((x) => x.paling != null && x.tidak != null).length;

  return (
    <div className="pb-tk-kerja">
      <div className="pb-tk-bar">
        <button type="button" className="pb-tk-batal" onClick={onBatal}>
          <X size={15} /> {contoh ? t("Tutup contoh", "Close sample") : t("Keluar", "Exit")}
        </button>
        <b>DISC{contoh ? ` · ${t("Contoh", "Sample")}` : ""}</b>
        <span className="pb-tk-waktu">
          {terisi}/{soal.length}
        </span>
      </div>
      <div className="pb-tk-progres">
        <i style={{ width: `${(terisi / soal.length) * 100}%` }} />
      </div>
      <div className="pb-panel pb-tk-soal">
        <div className="pb-tk-no">
          {t("Kelompok", "Group")} {i + 1} / {soal.length}
        </div>
        <p className="pb-tk-tanya">{t("Pilih satu kata yang PALING menggambarkan dirimu dan satu yang PALING TIDAK.", "Pick one word MOST like you and one LEAST like you.")}</p>
        <div className="pb-disc">
          <div className="kepala">
            <span />
            <b>{t("Paling", "Most")}</b>
            <b>{t("Paling tidak", "Least")}</b>
          </div>
          {s.kata.map((k, n) => (
            <div key={k.kata} className="baris">
              <span>{k.kata}</span>
              <button type="button" className={`ya ${j.paling === n ? "on" : ""}`} onClick={() => set("paling", n)} aria-label={t(`Paling: ${k.kata}`, `Most: ${k.kata}`)}>
                <Check size={16} />
              </button>
              <button type="button" className={`tidak ${j.tidak === n ? "on" : ""}`} onClick={() => set("tidak", n)} aria-label={t(`Paling tidak: ${k.kata}`, `Least: ${k.kata}`)}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="pb-tk-nav">
          <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" disabled={i === 0} onClick={() => setI(i - 1)}>
            <ArrowLeft size={14} /> {t("Sebelumnya", "Previous")}
          </button>
          {i < soal.length - 1 ? (
            <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" disabled={!lengkap} onClick={() => setI(i + 1)}>
              {t("Berikutnya", "Next")} <ArrowRight size={14} />
            </button>
          ) : (
            <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" disabled={terisi < soal.length} onClick={() => onSelesai(jawab)}>
              <Check size={14} /> {t("Selesai", "Finish")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hasil tes profil                                                    */
/* ------------------------------------------------------------------ */

function Batang({ label, nilai, ket, kiri, kanan }) {
  return (
    <div className="pb-profil-batang">
      <div className="atas">
        <b>{label}</b>
        <span>{nilai}</span>
      </div>
      <i>
        <em style={{ width: `${nilai}%` }} />
      </i>
      {(kiri || kanan) && (
        <div className="ujung">
          <small>{kiri}</small>
          <small>{kanan}</small>
        </div>
      )}
      {ket && <p>{ket}</p>}
    </div>
  );
}

export function HasilProfil({ tes, h }) {
  const p = h.profil || {};
  if (tes.id === "disc" && p.nilai) {
    const u = DISC_DIMENSI[p.utama];
    const k = DISC_DIMENSI[p.kedua];
    return (
      <div className="pb-profil">
        <div className="pb-profil-kepala">
          <span className="huruf">
            {p.utama}
            <small>{p.kedua}</small>
          </span>
          <div>
            <h2>
              {u.nama} · {u.singkat}
            </h2>
            <p>{u.ket}</p>
            <p>
              <b>{t("Gaya pendukung", "Secondary style")}:</b> {k.nama} ({k.singkat.toLowerCase()}).
            </p>
            <p>
              <b>{t("Posisi yang biasanya cocok", "Roles that usually fit")}:</b> {u.cocok}.
            </p>
          </div>
        </div>
        {Object.entries(DISC_DIMENSI).map(([kunci, d]) => (
          <Batang key={kunci} label={`${kunci} · ${d.nama}`} nilai={p.nilai[kunci]} />
        ))}
      </div>
    );
  }
  if (tes.id === "epps" && p.skor) {
    const urut = Object.entries(p.skor).sort((a, b) => b[1] - a[1]);
    return (
      <div className="pb-profil">
        <h2 style={{ margin: "6px 0 4px" }}>{t("Kebutuhan kerja yang paling menonjol", "Your strongest work needs")}</h2>
        <p className="pb-tk-ket">
          {urut
            .slice(0, 3)
            .map(([k]) => EPPS_KEBUTUHAN[k].nama)
            .join(", ")}
          . {t("Nilai 50 berarti seimbang; makin tinggi makin kuat kebutuhan tersebut dibanding yang lain.", "50 means balanced; higher means a stronger need relative to the others.")}
        </p>
        {urut.map(([k, v]) => (
          <Batang key={k} label={EPPS_KEBUTUHAN[k].nama} nilai={v} ket={v >= 56 ? EPPS_KEBUTUHAN[k].tinggi : v <= 44 ? EPPS_KEBUTUHAN[k].rendah : t("Seimbang.", "Balanced.")} />
        ))}
      </div>
    );
  }
  if (tes.id === "tipe16" && p.tipe) {
    const [julukan, ket, cocok] = TIPE16[p.tipe] || ["", "", ""];
    const s = p.skala;
    return (
      <div className="pb-profil">
        <div className="pb-profil-kepala">
          <span className="huruf tipe">{p.tipe}</span>
          <div>
            <h2>{julukan}</h2>
            <p>{ket}</p>
            <p>
              <b>{t("Bidang yang sering cocok", "Fields that often fit")}:</b> {cocok}.
            </p>
          </div>
        </div>
        <Batang label="Extraversion ↔ Introversion" nilai={s.EI} kiri={`E ${s.EI}%`} kanan={`I ${100 - s.EI}%`} />
        <Batang label="Sensing ↔ Intuition" nilai={s.SN} kiri={`S ${s.SN}%`} kanan={`N ${100 - s.SN}%`} />
        <Batang label="Thinking ↔ Feeling" nilai={s.TF} kiri={`T ${s.TF}%`} kanan={`F ${100 - s.TF}%`} />
        <Batang label="Judging ↔ Perceiving" nilai={s.JP} kiri={`J ${s.JP}%`} kanan={`P ${100 - s.JP}%`} />
        <p className="pb-tk-ket">
          {t(
            "Tes ini bergaya MBTI untuk latihan dan refleksi diri, bukan tes MBTI resmi. Tipe kepribadian tidak menentukan bisa atau tidaknya kamu sukses di suatu posisi.",
            "This is an MBTI-style practice test for self-reflection, not the official MBTI. Type doesn't decide whether you can succeed in a role.",
          )}
        </p>
      </div>
    );
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Latihan tes gambar                                                  */
/* ------------------------------------------------------------------ */

function Kanvas({ id, rangsang, tinggi = 1, alat, bersihkanKe, onGambar }) {
  const ref = useRef(null);
  const menggambar = useRef(false);

  useEffect(() => {
    const c = ref.current;
    const r = c.getBoundingClientRect();
    const skala = window.devicePixelRatio || 1;
    c.width = Math.round(r.width * skala);
    c.height = Math.round(r.height * skala);
    const ctx = c.getContext("2d");
    ctx.setTransform(skala, 0, 0, skala, 0, 0);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, r.width, r.height);
    if (rangsang) gambarRangsang(ctx, rangsang, r.width, r.height);
  }, [rangsang, bersihkanKe]);

  const titik = (e) => {
    const r = ref.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const mulai = (e) => {
    e.preventDefault();
    ref.current.setPointerCapture?.(e.pointerId);
    menggambar.current = true;
    const ctx = ref.current.getContext("2d");
    const [x, y] = titik(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const gerak = (e) => {
    if (!menggambar.current) return;
    const ctx = ref.current.getContext("2d");
    const [x, y] = titik(e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = alat === "hapus" ? "#fff" : "#1f2937";
    ctx.lineWidth = alat === "hapus" ? 16 : 2.2;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const selesai = () => {
    if (menggambar.current) onGambar?.(id);
    menggambar.current = false;
  };

  return (
    <canvas
      ref={ref}
      data-kanvas={id}
      className="pb-gb-kanvas"
      style={{ aspectRatio: `1 / ${tinggi}` }}
      onPointerDown={mulai}
      onPointerMove={gerak}
      onPointerUp={selesai}
      onPointerLeave={selesai}
    />
  );
}

function gambarRangsang(ctx, rangsang, w, h) {
  const sx = (v) => (v / 100) * w;
  const sy = (v) => (v / 100) * h;
  ctx.save();
  ctx.strokeStyle = "#111";
  ctx.fillStyle = "#111";
  ctx.lineWidth = 2;
  rangsang.forEach((g) => {
    if (g.t === "titik") {
      ctx.beginPath();
      ctx.arc(sx(g.x), sy(g.y), sx(g.r), 0, Math.PI * 2);
      ctx.fill();
    } else if (g.t === "kotak") {
      ctx.fillRect(sx(g.x), sy(g.y), sx(g.s), sy(g.s));
    } else if (g.t === "titikTitik") {
      for (let i = 0; i <= 8; i++) {
        const a = Math.PI + (i / 8) * Math.PI;
        ctx.beginPath();
        ctx.arc(sx(g.cx + g.r * Math.cos(a)), sy(g.cy + g.r * Math.sin(a)), 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (g.t === "path") {
      ctx.save();
      ctx.scale(w / 100, h / 100);
      ctx.lineWidth = 2 / (w / 100);
      ctx.stroke(new window.Path2D(g.d));
      ctx.restore();
    }
  });
  ctx.restore();
}

export function TesGambar({ onBatal }) {
  const [latihan, setLatihan] = useState(null);
  const [sisa, setSisa] = useState(0);
  const [alat, setAlat] = useState("pensil");
  const [ulang, setUlang] = useState(0);
  const [judul, setJudul] = useState({});
  const [terisi, setTerisi] = useState({});
  const [selesai, setSelesai] = useState(false);

  useEffect(() => {
    if (!latihan || selesai) return undefined;
    const id = setInterval(() => setSisa((x) => x - 1), 1000);
    return () => clearInterval(id);
  }, [latihan, selesai]);
  useEffect(() => {
    if (latihan && sisa <= 0 && !selesai) setSelesai(true);
  }, [sisa, latihan, selesai]);

  const unduh = () => {
    const daftar = [...document.querySelectorAll("canvas[data-kanvas]")];
    if (!daftar.length) return;
    const kolom = daftar.length > 1 ? 4 : 1;
    const baris = Math.ceil(daftar.length / kolom);
    const w = daftar[0].width;
    const h = daftar[0].height;
    const gab = document.createElement("canvas");
    gab.width = w * kolom;
    gab.height = h * baris;
    const ctx = gab.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, gab.width, gab.height);
    daftar.forEach((c, i) => {
      ctx.drawImage(c, (i % kolom) * w, Math.floor(i / kolom) * h);
      ctx.strokeStyle = "#9ca3af";
      ctx.strokeRect((i % kolom) * w, Math.floor(i / kolom) * h, w, h);
    });
    const a = document.createElement("a");
    a.href = gab.toDataURL("image/png");
    a.download = `latihan-${latihan.id}.png`;
    a.click();
  };

  if (!latihan) {
    return (
      <div className="pb-panel pb-tk-intro">
        <button type="button" className="pb-tk-batal" onClick={onBatal} style={{ marginBottom: 8 }}>
          <ArrowLeft size={15} /> {t("Kembali", "Back")}
        </button>
        <h3>{t("Pilih latihan tes gambar", "Choose a drawing exercise")}</h3>
        <p className="pb-tk-ket">
          {t(
            "Latihan ini tidak dinilai otomatis dan tidak memakai kuota. Tujuannya membiasakan format, waktu, dan hal yang biasa diperhatikan asesor. Hasil gambarmu bisa diunduh.",
            "These exercises aren't auto-scored and don't use any quota. They help you get used to the format, timing, and what assessors usually look at. You can download your drawings.",
          )}
        </p>
        <div className="pb-gb-pilih">
          {LATIHAN_GAMBAR.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                setLatihan(l);
                setSisa(l.menit * 60);
                setSelesai(false);
                setJudul({});
                setTerisi({});
              }}
            >
              <b>{l.nama}</b>
              <small>
                <Clock size={12} /> {l.menit} {t("menit", "minutes")}
              </small>
              <span>{l.perintah}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const wartegg = latihan.id === "wartegg";
  const jumlahTerisi = Object.keys(terisi).length;

  return (
    <div className="pb-tk-kerja lebar">
      <div className="pb-tk-bar">
        <button type="button" className="pb-tk-batal" onClick={() => setLatihan(null)}>
          <ArrowLeft size={15} /> {t("Ganti latihan", "Change exercise")}
        </button>
        <b>{latihan.nama}</b>
        <span className={`pb-tk-waktu ${sisa <= 60 && !selesai ? "habis" : ""}`}>
          <Clock size={14} /> {selesai ? t("Selesai", "Done") : mmss(sisa)}
        </span>
      </div>
      <div className="pb-panel">
        <p className="pb-tk-tanya" style={{ fontSize: 15 }}>
          {latihan.perintah}
        </p>
        <div className="pb-gb-alat">
          <button type="button" className={alat === "pensil" ? "on" : ""} onClick={() => setAlat("pensil")}>
            <Pencil size={14} /> {t("Pensil", "Pencil")}
          </button>
          <button type="button" className={alat === "hapus" ? "on" : ""} onClick={() => setAlat("hapus")}>
            <Eraser size={14} /> {t("Penghapus", "Eraser")}
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t("Hapus semua gambar dan mulai ulang?", "Clear everything and start over?"))) {
                setUlang((x) => x + 1);
                setTerisi({});
              }
            }}
          >
            <RotateCcw size={14} /> {t("Ulang", "Reset")}
          </button>
          <button type="button" onClick={unduh}>
            <Download size={14} /> PNG
          </button>
        </div>

        {wartegg ? (
          <div className="pb-gb-wartegg">
            {WARTEGG.map((k) => (
              <figure key={k.no}>
                <Kanvas id={`w${k.no}`} rangsang={k.gambar} alat={alat} bersihkanKe={ulang} onGambar={(id) => setTerisi((x) => ({ ...x, [id]: true }))} />
                <figcaption>
                  <span>{k.no}</span>
                  <input value={judul[k.no] || ""} onChange={(e) => setJudul((x) => ({ ...x, [k.no]: e.target.value }))} placeholder={t("Judul gambar", "Title")} maxLength={40} />
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="pb-gb-tunggal">
            <Kanvas id="utama" tinggi={1.35} alat={alat} bersihkanKe={ulang} onGambar={(id) => setTerisi((x) => ({ ...x, [id]: true }))} />
          </div>
        )}

        {wartegg && !selesai && (
          <p className="pb-tk-ket">
            {t(`${jumlahTerisi} dari 8 kotak sudah diisi.`, `${jumlahTerisi} of 8 boxes done.`)}
          </p>
        )}

        {!selesai ? (
          <div className="pb-tk-nav">
            <span />
            <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" onClick={() => setSelesai(true)}>
              <Check size={14} /> {t("Selesai", "Finish")}
            </button>
          </div>
        ) : (
          <div className="pb-tk-tips">
            <b>
              <Lightbulb size={15} /> {t("Periksa sendiri gambarmu", "Check your drawing")}
            </b>
            {wartegg && jumlahTerisi < 8 && <p className="pb-tk-peringatan">{t(`Masih ada ${8 - jumlahTerisi} kotak kosong. Di tes sungguhan, isi semua kotak.`, `${8 - jumlahTerisi} boxes are still empty. In a real test, fill every box.`)}</p>}
            {wartegg && Object.values(judul).filter((x) => x.trim()).length < 8 && <p className="pb-tk-peringatan">{t("Beri judul untuk setiap gambar, seperti yang diminta di tes sungguhan.", "Give every drawing a title, as the real test asks.")}</p>}
            <ol>
              {latihan.tips.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Paket simulasi seleksi                                              */
/* ------------------------------------------------------------------ */

export function PaketSeleksi({ namaTes, statusTes, onPilihTes, IKON }) {
  const [buka, setBuka] = useState("");
  return (
    <div className="pb-paket-sel">
      <div className="judul">
        <span className="pb-label">{t("Simulasi per perusahaan", "By employer")}</span>
        <h3>{t("Mau ikut seleksi di mana?", "Where are you applying?")}</h3>
        <p className="pb-tk-ket">{t("Pilih tujuanmu untuk melihat tahapan yang umum dan urutan tes yang disarankan.", "Pick a target to see the usual stages and a recommended test order.")}</p>
      </div>
      <div className="daftar">
        {PAKET_SELEKSI.map((p) => {
          const Ikon = IKON[p.ikon];
          const aktif = buka === p.id;
          const beres = p.tes.filter((x) => statusTes(x) === "selesai").length;
          return (
            <div key={p.id} className={`pb-paket ${aktif ? "buka" : ""}`}>
              <button type="button" className="kepala" onClick={() => setBuka(aktif ? "" : p.id)} aria-expanded={aktif}>
                {Ikon && (
                  <span className="ikon">
                    <Ikon size={18} />
                  </span>
                )}
                <span className="teks">
                  <b>{p.nama}</b>
                  <small>{p.ringkas}</small>
                </span>
                <span className="jml">
                  {beres}/{p.tes.length}
                </span>
                <ChevronDown size={16} className="panah" />
              </button>
              {aktif && (
                <div className="isi">
                  <h4>{t("Tahapan yang umum", "Usual stages")}</h4>
                  <ol>
                    {p.tahap.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ol>
                  <h4>{t("Urutan latihan yang disarankan", "Recommended practice order")}</h4>
                  <div className="tes">
                    {p.tes.map((id, i) => (
                      <button key={id} type="button" className={statusTes(id) === "selesai" ? "beres" : ""} onClick={() => onPilihTes(id)}>
                        <span>{statusTes(id) === "selesai" ? <Check size={12} /> : i + 1}</span>
                        {namaTes(id)}
                      </button>
                    ))}
                  </div>
                  <h4>{t("Tips", "Tips")}</h4>
                  <ul>
                    {p.tips.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <p className="posisi">
                    <b>{t("Posisi", "Roles")}:</b> {p.posisi}
                  </p>
                  {p.sumber.length > 0 && (
                    <p className="sumber">
                      {t("Rujukan", "Sources")}:{" "}
                      {p.sumber.map(([l, u], k) => (
                        <React.Fragment key={u}>
                          {k > 0 && " · "}
                          <a href={u} target="_blank" rel="noopener noreferrer">
                            {l} <ExternalLink size={11} />
                          </a>
                        </React.Fragment>
                      ))}
                      . {t("Tahapan bisa berubah setiap periode; selalu cek pengumuman resmi.", "Stages can change each intake; always check the official announcement.")}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
