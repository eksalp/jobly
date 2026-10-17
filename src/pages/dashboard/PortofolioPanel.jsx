import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Briefcase, Check, Clock, Download, FileSpreadsheet, FileText, Lock,
  Loader2, Plus, Search, Send, Sparkles, Table2, Trash2, X, Link2, Eye, EyeOff,
} from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useLangganan } from "../../context/LanggananContext";
import { useUserProfile } from "../../context/UserProfileContext";
import {
  MAKS_PROYEK, PAKET_PORTOFOLIO, MIN_HASIL, MIN_REVISI, DAFTAR_KATEGORI,
  muatKatalog, idProyek, tabelAwal, tabelTerisi, statusProyek, namaBerkas,
} from "../../data/portofolio";
import { buatXlsx, unduhBlob } from "../../utils/xlsxSederhana";
import { t, lokal } from "../../i18n.js";

const TABEL_DB = "portofolio_proyek";
const MAKS_BARIS = 200;
const MAKS_KOLOM = 15;

/* ------------------------------------------------------------------ */
/*  Pesan bergaya chat (sama dengan latihan praktik)                    */
/* ------------------------------------------------------------------ */

const WARNA_KANAL = { WhatsApp: "wa", Email: "email", Upwork: "upwork", Slack: "slack", Telegram: "wa", Fiverr: "upwork" };

function Pesan({ dari, kanal, tenggat, children }) {
  return (
    <div className="pb-lt-pesan">
      <span className="pb-lt-avatar">{(dari?.nama || "?").trim().charAt(0).toUpperCase()}</span>
      <div className="pb-lt-gelembung">
        <div className="pb-lt-pesan-kepala">
          <b>{dari?.nama || t("Klien", "Client")}</b>
          {dari?.peran && <span>{dari.peran}</span>}
          {kanal && <span className={`pb-lt-kanal ${WARNA_KANAL[kanal] || ""}`}>{kanal}</span>}
        </div>
        <div className="pb-lt-pesan-isi">{children}</div>
        {tenggat && (
          <div className="pb-lt-tenggat">
            <Clock size={12} /> {t("Tenggat", "Due")}: {tenggat}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Editor tabel sederhana (bisa tempel dari Excel/Sheets)              */
/* ------------------------------------------------------------------ */

function EditorTabel({ nilai, onUbah }) {
  const { kolom, baris } = nilai;

  const ubahSel = (r, c, v) => onUbah({ kolom, baris: baris.map((b, i) => (i === r ? b.map((x, j) => (j === c ? v : x)) : b)) });
  const ubahKolom = (c, v) => onUbah({ kolom: kolom.map((x, j) => (j === c ? v : x)), baris });
  const tambahBaris = () => baris.length < MAKS_BARIS && onUbah({ kolom, baris: [...baris, kolom.map(() => "")] });
  const tambahKolom = () =>
    kolom.length < MAKS_KOLOM &&
    onUbah({ kolom: [...kolom, `${t("Kolom", "Column")} ${kolom.length + 1}`], baris: baris.map((b) => [...b, ""]) });
  const hapusBaris = (r) => baris.length > 1 && onUbah({ kolom, baris: baris.filter((_, i) => i !== r) });
  const hapusKolom = (c) =>
    kolom.length > 1 && onUbah({ kolom: kolom.filter((_, j) => j !== c), baris: baris.map((b) => b.filter((_, j) => j !== c)) });

  // Tempel blok dari Excel/Google Sheets (dipisah tab & baris baru)
  const tempel = (e, r0, c0) => {
    const teks = e.clipboardData.getData("text/plain");
    if (!/[\t\n]/.test(teks.replace(/\n$/, ""))) return;
    e.preventDefault();
    const blok = teks.replace(/\r/g, "").replace(/\n$/, "").split("\n").map((l) => l.split("\t"));
    const lebar = Math.min(MAKS_KOLOM, Math.max(kolom.length, c0 + Math.max(...blok.map((b) => b.length))));
    const tinggi = Math.min(MAKS_BARIS, Math.max(baris.length, r0 + blok.length));
    const kolomBaru = Array.from({ length: lebar }, (_, j) => kolom[j] ?? `${t("Kolom", "Column")} ${j + 1}`);
    const barisBaru = Array.from({ length: tinggi }, (_, i) =>
      Array.from({ length: lebar }, (_, j) => {
        const b = blok[i - r0];
        if (b && j >= c0 && j - c0 < b.length) return b[j - c0];
        return baris[i]?.[j] ?? "";
      }),
    );
    onUbah({ kolom: kolomBaru, baris: barisBaru });
  };

  return (
    <div className="pb-po-tabel">
      <div className="pb-po-tabel-gulir">
        <table>
          <thead>
            <tr>
              <th className="no" />
              {kolom.map((k, c) => (
                <th key={c}>
                  <div className="kepala">
                    <input value={k} onChange={(e) => ubahKolom(c, e.target.value)} aria-label={t(`Nama kolom ${c + 1}`, `Column ${c + 1} name`)} />
                    {kolom.length > 1 && (
                      <button type="button" onClick={() => hapusKolom(c)} aria-label={t("Hapus kolom", "Remove column")} title={t("Hapus kolom", "Remove column")}>
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {baris.map((b, r) => (
              <tr key={r}>
                <td className="no">
                  <span>{r + 1}</span>
                  {baris.length > 1 && (
                    <button type="button" onClick={() => hapusBaris(r)} aria-label={t("Hapus baris", "Remove row")} title={t("Hapus baris", "Remove row")}>
                      <X size={11} />
                    </button>
                  )}
                </td>
                {kolom.map((_, c) => (
                  <td key={c}>
                    <input value={b[c] ?? ""} onChange={(e) => ubahSel(r, c, e.target.value)} onPaste={(e) => tempel(e, r, c)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pb-po-tabel-aksi">
        <button type="button" onClick={tambahBaris} disabled={baris.length >= MAKS_BARIS}>
          <Plus size={13} /> {t("Baris", "Row")}
        </button>
        <button type="button" onClick={tambahKolom} disabled={kolom.length >= MAKS_KOLOM}>
          <Plus size={13} /> {t("Kolom", "Column")}
        </button>
        <span>{t("Bisa tempel langsung dari Excel atau Google Sheets.", "You can paste straight from Excel or Google Sheets.")}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Unduhan                                                            */
/* ------------------------------------------------------------------ */

function profilPdf(profil, user) {
  return {
    nama: profil.fullName || user?.user_metadata?.full_name || "",
    headline: profil.headline,
    lokasi: profil.location,
    email: user?.email,
  };
}

async function unduhPdf(item, profil, namaPendek) {
  const { buatPdfPortofolio } = await import("../../utils/portofolioPdf");
  const blob = await buatPdfPortofolio({ profil, proyek: item });
  unduhBlob(blob, `${namaBerkas("portofolio", namaPendek, profil.nama) || "portofolio"}.pdf`);
}

function unduhExcel(proyek, data, profil) {
  const tanggal = new Date().toLocaleDateString(lokal(), { day: "numeric", month: "long", year: "numeric" });
  const lembar = [];
  if (tabelTerisi(data.tabel)) {
    lembar.push({
      nama: t("Hasil", "Result"),
      judul: proyek.judul,
      kolom: data.tabel.kolom,
      baris: data.tabel.baris.filter((b) => b.some((v) => String(v ?? "").trim())),
    });
  }
  if (String(data.jawaban || "").trim()) {
    lembar.push({ nama: t("Catatan", "Notes"), judul: t("Catatan & aturan yang dipakai", "Notes & rules applied"), baris: data.jawaban.split("\n").map((l) => [l]), lebar: [100] });
  }
  if (data.dikirim && String(data.revisi || "").trim()) {
    lembar.push({
      nama: t("Revisi", "Revision"),
      judul: t("Revisi dari klien & tanggapan", "Client revision & response"),
      baris: [[t("Permintaan klien", "Client request")], [proyek.revisi?.pesan || ""], [""], [t("Tanggapan saya", "My response")], ...data.revisi.split("\n").map((l) => [l])],
      lebar: [100],
    });
  }
  lembar.push({
    nama: t("Tentang", "About"),
    judul: t("Tentang proyek ini", "About this project"),
    baris: [
      [t("Proyek", "Project"), proyek.judul],
      [t("Bidang", "Field"), proyek.namaProfesi],
      [t("Dikerjakan oleh", "Done by"), profil.nama || ""],
      [t("Tanggal", "Date"), tanggal],
      [t("Keterangan", "Note"), t("Proyek latihan berbasis studi kasus di Jobly (jobly.my.id). Klien dan data adalah simulasi.", "Case-study practice project on Jobly (jobly.my.id). The client and data are simulated.")],
      [""],
      [t("Brief klien", "Client brief"), proyek.brief],
    ],
    lebar: [20, 100],
  });
  const blob = buatXlsx(lembar, { judul: proyek.judul, pembuat: profil.nama || "Jobly" });
  unduhBlob(blob, `${namaBerkas(proyek.profesi, proyek.judul) || "proyek"}.xlsx`);
}

/* ------------------------------------------------------------------ */
/*  Ruang kerja satu proyek                                            */
/* ------------------------------------------------------------------ */

export function RuangKerja({ proyek, baris, onSimpan, onKembali, onLepas, profil }) {
  const [data, setData] = useState(() => ({
    jawaban: baris.jawaban || "",
    tabel: baris.tabel || null,
    dikirim: Boolean(baris.dikirim),
    revisi: baris.revisi || "",
    cek: Array.isArray(baris.cek) ? baris.cek : [],
    tautan: baris.tautan || "",
  }));
  const [simpan, setSimpan] = useState("tersimpan"); // tersimpan | menyimpan | gagal
  const [pakaiTabel, setPakaiTabel] = useState(Boolean(baris.tabel) || proyek.tabelAwal);
  const [lihatContoh, setLihatContoh] = useState(false);
  const [unduh, setUnduh] = useState("");
  const tunda = useRef(null);
  const tertunda = useRef(null);

  const st = statusProyek(proyek, data);
  const tabelTampil = data.tabel || (pakaiTabel ? tabelAwal(proyek) : null);

  // Simpan otomatis 1 detik setelah berhenti mengetik
  const ubah = (sebagian) => {
    setData((d) => {
      const baru = { ...d, ...sebagian };
      tertunda.current = baru;
      return baru;
    });
    setSimpan("menyimpan");
    clearTimeout(tunda.current);
    tunda.current = setTimeout(async () => {
      const ok = await onSimpan(baris.id, tertunda.current);
      setSimpan(ok ? "tersimpan" : "gagal");
    }, 1000);
  };

  // Simpan yang tertunda saat panel ditutup
  useEffect(
    () => () => {
      if (tunda.current) {
        clearTimeout(tunda.current);
        if (tertunda.current) onSimpan(baris.id, tertunda.current);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const belumDikerjakan = !data.jawaban.trim() && !data.tabel && !data.dikirim;
  const kurang = Math.max(0, MIN_HASIL - data.jawaban.trim().length);

  const jalankanUnduh = async (jenis) => {
    setUnduh(jenis);
    try {
      if (jenis === "pdf") await unduhPdf([{ proyek, data }], profil, proyek.profesi);
      else unduhExcel(proyek, data, profil);
    } catch (e) {
      alert(e?.message || t("Gagal membuat berkas.", "Couldn't create the file."));
    } finally {
      setUnduh("");
    }
  };

  return (
    <div className="pb-po-kerja">
      <div className="pb-po-kerja-atas">
        <button type="button" className="pb-link" onClick={onKembali} style={{ border: 0, background: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={15} /> {t("Kembali ke portofolio", "Back to portfolio")}
        </button>
        <span className={`pb-po-simpan ${simpan}`}>
          {simpan === "menyimpan" ? t("Menyimpan…", "Saving…") : simpan === "gagal" ? t("Gagal menyimpan, coba ketik lagi", "Couldn't save, try typing again") : t("Tersimpan", "Saved")}
        </span>
      </div>

      <div className="pb-panel">
        <span className="pb-label">{proyek.namaProfesi}</span>
        <h2 className="pb-po-judul">{proyek.judul}</h2>
        <ol className="pb-po-tahap">
          {[t("Kerjakan", "Do the work"), t("Kirim ke klien", "Send to client"), t("Tanggapi revisi", "Handle revision"), t("Periksa ulang", "Final check")].map((x, i) => (
            <li key={x} className={st.langkah > i + 1 ? "beres" : st.langkah === i + 1 ? "aktif" : ""}>
              <span>{st.langkah > i + 1 ? <Check size={12} /> : i + 1}</span>
              {x}
            </li>
          ))}
        </ol>

        <h3 className="pb-po-sub">{t("Brief dari klien", "Client brief")}</h3>
        <Pesan dari={proyek.dari} kanal={proyek.kanal} tenggat={proyek.tenggat}>
          {proyek.brief}
        </Pesan>
        {proyek.langkah?.length > 0 && (
          <ol className="pb-po-langkah">
            {proyek.langkah.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ol>
        )}

        <h3 className="pb-po-sub">{t("1. Hasil kerjamu", "1. Your work")}</h3>
        <p className="pb-po-ket">
          {t(
            "Kerjakan selengkap mungkin seperti untuk klien sungguhan. Semua yang kamu tulis di sini masuk ke PDF portofolio.",
            "Do it as thoroughly as you would for a real client. Everything you write here goes into the portfolio PDF.",
          )}
        </p>

        {tabelTampil ? (
          <>
            <EditorTabel nilai={tabelTampil} onUbah={(tabel) => ubah({ tabel })} />
            {!proyek.tabelAwal && !tabelTerisi(data.tabel) && (
              <button
                type="button"
                className="pb-po-teks-tombol"
                onClick={() => {
                  setPakaiTabel(false);
                  ubah({ tabel: null });
                }}
              >
                {t("Tidak jadi memakai tabel", "Don't use a table")}
              </button>
            )}
          </>
        ) : (
          <button type="button" className="pb-po-teks-tombol" onClick={() => setPakaiTabel(true)}>
            <Table2 size={14} /> {t("Tambahkan tabel (bisa diunduh sebagai Excel)", "Add a table (downloadable as Excel)")}
          </button>
        )}

        <label className="pb-po-isian">
          <span>{tabelTampil ? t("Catatan, aturan yang dipakai, dan hal yang perlu dikonfirmasi", "Notes, rules applied, and things to confirm") : t("Hasil kerja", "Your work")}</span>
          <textarea
            value={data.jawaban}
            onChange={(e) => ubah({ jawaban: e.target.value })}
            rows={tabelTampil ? 6 : 12}
            maxLength={20000}
            placeholder={t("Tulis hasil kerjamu di sini…", "Write your work here…")}
          />
          <small>
            {kurang > 0 && !(tabelTerisi(data.tabel) && data.jawaban.trim().length >= 40)
              ? t(`Minimal ${MIN_HASIL} karakter (kurang ${kurang}).`, `At least ${MIN_HASIL} characters (${kurang} to go).`)
              : t(`${data.jawaban.trim().length} karakter`, `${data.jawaban.trim().length} characters`)}
          </small>
        </label>

        <label className="pb-po-isian">
          <span>
            <Link2 size={13} /> {t("Tautan ke hasil kerja (opsional)", "Link to your work (optional)")}
          </span>
          <input
            type="url"
            value={data.tautan}
            onChange={(e) => ubah({ tautan: e.target.value.slice(0, 500) })}
            placeholder={t("mis. Google Docs/Sheets, Canva, Figma, Notion, GitHub", "e.g. Google Docs/Sheets, Canva, Figma, Notion, GitHub")}
          />
        </label>

        <h3 className="pb-po-sub">{t("2. Kirim ke klien", "2. Send to the client")}</h3>
        {!data.dikirim ? (
          <button type="button" className="pb-btn pb-btn-primary" disabled={!st.hasilCukup} onClick={() => ubah({ dikirim: true })}>
            <Send size={15} /> {t("Kirim hasil ke klien", "Send work to client")}
          </button>
        ) : (
          <div className="pb-po-terkirim">
            <Check size={14} /> {t("Terkirim. Klien membalas:", "Sent. The client replied:")}
          </div>
        )}

        {data.dikirim && proyek.revisi && (
          <>
            <Pesan dari={proyek.dari} kanal={proyek.kanal}>
              {proyek.revisi.pesan}
            </Pesan>
            <h3 className="pb-po-sub">{t("3. Tanggapi revisi", "3. Handle the revision")}</h3>
            {proyek.revisi.petunjuk?.length > 0 && (
              <ul className="pb-po-petunjuk">
                {proyek.revisi.petunjuk.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
            <label className="pb-po-isian">
              <span>{t("Hasil revisi atau balasanmu ke klien", "Your revised work or reply to the client")}</span>
              <textarea value={data.revisi} onChange={(e) => ubah({ revisi: e.target.value })} rows={7} maxLength={10000} />
              <small>
                {data.revisi.trim().length < MIN_REVISI
                  ? t(`Minimal ${MIN_REVISI} karakter.`, `At least ${MIN_REVISI} characters.`)
                  : t(`${data.revisi.trim().length} karakter`, `${data.revisi.trim().length} characters`)}
              </small>
            </label>
          </>
        )}

        {data.dikirim && st.revisiBeres && (
          <>
            <h3 className="pb-po-sub">{t("4. Periksa ulang sebelum diserahkan", "4. Final check before handing over")}</h3>
            <p className="pb-po-ket">{t("Centang hanya yang benar-benar sudah kamu penuhi. Daftar ini tercetak di PDF sebagai penilaian sendiri.", "Tick only what you've truly done. This list is printed in the PDF as a self-assessment.")}</p>
            <div className="pb-po-cek">
              {(proyek.rubrik || []).map((r, i) => (
                <label key={r}>
                  <input
                    type="checkbox"
                    checked={Boolean(data.cek[i])}
                    onChange={(e) => {
                      const cek = [...data.cek];
                      cek[i] = e.target.checked;
                      ubah({ cek });
                    }}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {data.dikirim && proyek.contoh && (
          <div className="pb-po-contoh">
            <button type="button" className="pb-po-teks-tombol" onClick={() => setLihatContoh((x) => !x)}>
              {lihatContoh ? <EyeOff size={14} /> : <Eye size={14} />}{" "}
              {lihatContoh ? t("Sembunyikan contoh jawaban", "Hide sample answer") : t("Bandingkan dengan contoh jawaban", "Compare with a sample answer")}
            </button>
            {lihatContoh && <pre>{proyek.contoh}</pre>}
          </div>
        )}

        <div className={`pb-po-unduh ${st.selesai ? "siap" : ""}`}>
          <div>
            <b>{st.selesai ? t("Proyek selesai. Siap masuk portofolio.", "Project complete. Ready for your portfolio.") : t("Unduh hasil", "Download")}</b>
            <span>
              {st.selesai
                ? t("Unduh hasilnya, atau gabungkan dengan proyek lain di halaman portofolio.", "Download it, or combine it with your other project on the portfolio page.")
                : t("Unduhan terbuka setelah keempat langkah selesai.", "Downloads unlock once all four steps are done.")}
            </span>
          </div>
          <div className="pb-po-unduh-tombol">
            <button type="button" className="pb-btn pb-btn-primary pb-btn-sm" disabled={!st.selesai || !!unduh} onClick={() => jalankanUnduh("pdf")}>
              {unduh === "pdf" ? <Loader2 size={14} className="pb-po-putar" /> : <FileText size={14} />} PDF
            </button>
            {tabelTerisi(data.tabel) && (
              <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" disabled={!st.selesai || !!unduh} onClick={() => jalankanUnduh("xlsx")}>
                <FileSpreadsheet size={14} /> Excel
              </button>
            )}
          </div>
        </div>

        {belumDikerjakan && (
          <button type="button" className="pb-po-lepas" onClick={onLepas}>
            <Trash2 size={13} /> {t("Lepas proyek ini dan pilih yang lain", "Drop this project and pick another")}
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Panel utama                                                        */
/* ------------------------------------------------------------------ */

export function PortofolioPanel({ setActive }) {
  const { user } = useAuth();
  const langganan = useLangganan();
  const profil = useUserProfile();
  const boleh = langganan.aktif && PAKET_PORTOFOLIO.includes(langganan.paket);

  const [katalog, setKatalog] = useState(null);
  const [baris, setBaris] = useState(null);
  const [galat, setGalat] = useState("");
  const [buka, setBuka] = useState(null);
  const [kategori, setKategori] = useState("");
  const [cari, setCari] = useState("");
  const [memilih, setMemilih] = useState("");
  const [unduh, setUnduh] = useState(false);

  useEffect(() => {
    muatKatalog().then(setKatalog);
  }, []);

  const muatBaris = useCallback(async () => {
    if (!user || !supabaseConfigured) {
      setBaris([]);
      return;
    }
    const { data, error } = await supabase.from(TABEL_DB).select("*").order("dibuat_at", { ascending: true });
    if (error) {
      setGalat(
        /relation|does not exist|schema cache/i.test(error.message)
          ? t("Fitur portofolio belum disiapkan di database. Jalankan supabase/sql/05_portofolio.sql.", "The portfolio feature isn't set up in the database yet. Run supabase/sql/05_portofolio.sql.")
          : error.message,
      );
      setBaris([]);
      return;
    }
    setBaris(data || []);
  }, [user]);

  useEffect(() => {
    muatBaris();
  }, [muatBaris]);

  const peta = useMemo(() => Object.fromEntries((katalog || []).map((p) => [p.id, p])), [katalog]);
  const dipilih = (baris || []).map((b) => ({ baris: b, proyek: peta[idProyek(b.profesi, b.tugas)] })).filter((x) => x.proyek);
  const sisa = MAKS_PROYEK - (baris || []).length;

  const simpan = useCallback(async (id, data) => {
    const { error } = await supabase
      .from(TABEL_DB)
      .update({
        jawaban: data.jawaban,
        tabel: data.tabel || null,
        dikirim: data.dikirim,
        revisi: data.revisi,
        cek: data.cek,
        tautan: data.tautan,
      })
      .eq("id", id);
    if (error) return false;
    setBaris((lama) => (lama || []).map((b) => (b.id === id ? { ...b, ...data } : b)));
    return true;
  }, []);

  const pilih = async (p) => {
    const lanjut = window.confirm(
      t(
        `Pilih "${p.judul}" (${p.namaProfesi}) sebagai proyek portofolio?\n\nSetiap akun hanya bisa memilih ${MAKS_PROYEK} proyek. Sisa pilihanmu: ${sisa}. Proyek bisa dilepas selama belum mulai dikerjakan.`,
        `Pick "${p.judul}" (${p.namaProfesi}) as a portfolio project?\n\nEach account can pick only ${MAKS_PROYEK} projects. Picks left: ${sisa}. You can drop a project until you start working on it.`,
      ),
    );
    if (!lanjut) return;
    setMemilih(p.id);
    setGalat("");
    const { data, error } = await supabase.from(TABEL_DB).insert({ profesi: p.profesi, tugas: p.tugas }).select().single();
    setMemilih("");
    if (error) {
      setGalat(error.message);
      return;
    }
    setBaris((lama) => [...(lama || []), data]);
    setBuka(data.id);
  };

  const lepas = async (b) => {
    if (!window.confirm(t("Lepas proyek ini? Kamu bisa memilih proyek lain sebagai gantinya.", "Drop this project? You can pick another one instead."))) return;
    const { error } = await supabase.from(TABEL_DB).delete().eq("id", b.id);
    if (error) {
      setGalat(error.message);
      return;
    }
    setBaris((lama) => (lama || []).filter((x) => x.id !== b.id));
    setBuka(null);
  };

  const profilCetak = profilPdf(profil, user);
  const siapUnduh = dipilih.filter(({ proyek, baris: b }) => statusProyek(proyek, b).selesai);

  const unduhSemua = async () => {
    setUnduh(true);
    try {
      await unduhPdf(siapUnduh.map(({ proyek, baris: b }) => ({ proyek, data: b })), profilCetak, "lengkap");
    } catch (e) {
      alert(e?.message || t("Gagal membuat PDF.", "Couldn't create the PDF."));
    } finally {
      setUnduh(false);
    }
  };

  const daftarKatalog = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    const sudah = new Set((baris || []).map((b) => idProyek(b.profesi, b.tugas)));
    return (katalog || []).filter(
      (p) =>
        !sudah.has(p.id) &&
        (!kategori || p.kategori === kategori) &&
        (!kata || `${p.judul} ${p.namaProfesi} ${p.brief}`.toLowerCase().includes(kata)),
    );
  }, [katalog, kategori, cari, baris]);

  /* ---------- memuat ---------- */
  if (!katalog || baris === null || langganan.loading) {
    return (
      <div className="pb-po-muat">
        <Loader2 size={18} className="pb-po-putar" /> {t("Memuat portofolio…", "Loading portfolio…")}
      </div>
    );
  }

  /* ---------- ruang kerja ---------- */
  const aktif = dipilih.find((x) => x.baris.id === buka);
  if (aktif) {
    return (
      <RuangKerja
        key={aktif.baris.id}
        proyek={aktif.proyek}
        baris={aktif.baris}
        profil={profilCetak}
        onSimpan={simpan}
        onKembali={() => setBuka(null)}
        onLepas={() => lepas(aktif.baris)}
      />
    );
  }

  /* ---------- belum Pro/Max ---------- */
  if (!boleh && dipilih.length === 0) {
    return (
      <div className="pb-panel pb-po-kunci">
        <span className="pb-po-kunci-ikon">
          <Lock size={20} />
        </span>
        <h2>{t("Portofolio khusus paket Pro dan Max", "Portfolio is for Pro and Max plans")}</h2>
        <p>
          {t(
            "Pilih 2 proyek dari 40 profesi remote (VA, data entry, desain, penulis, dan lainnya), kerjakan seperti untuk klien sungguhan, lalu unduh hasilnya sebagai PDF portofolio dan Excel. Cocok untuk dilampirkan di lamaran atau proposal Upwork saat kamu belum punya pengalaman.",
            "Pick 2 projects from 40 remote roles (VA, data entry, design, writing, and more), do them as you would for a real client, then download a PDF portfolio and Excel files. Great to attach to applications or Upwork proposals when you don't have experience yet.",
          )}
        </p>
        <button type="button" className="pb-btn pb-btn-primary" onClick={() => setActive?.("paket")}>
          {t("Lihat paket Pro & Max", "See Pro & Max plans")} <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  /* ---------- ringkasan + katalog ---------- */
  return (
    <div className="pb-po">
      {galat && (
        <div className="pb-po-galat">
          {galat}
          <button type="button" onClick={() => setGalat("")} aria-label={t("Tutup", "Close")}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="pb-panel pb-po-ringkas">
        <div className="pb-po-ringkas-atas">
          <div>
            <span className="pb-label">{t("Proyek terpilih", "Chosen projects")}</span>
            <h2>
              {dipilih.length} / {MAKS_PROYEK}
            </h2>
            <p>
              {t(
                "Setiap proyek diakhiri dengan PDF (dan Excel bila ada tabel) yang bisa kamu lampirkan di lamaran, profil Upwork, atau LinkedIn.",
                "Each project ends in a PDF (and Excel when there's a table) you can attach to applications, Upwork, or LinkedIn.",
              )}
            </p>
          </div>
          <button type="button" className="pb-btn pb-btn-primary" disabled={!siapUnduh.length || unduh} onClick={unduhSemua}>
            {unduh ? <Loader2 size={15} className="pb-po-putar" /> : <Download size={15} />} {t("Unduh portofolio (PDF)", "Download portfolio (PDF)")}
          </button>
        </div>
        {!siapUnduh.length && dipilih.length > 0 && (
          <p className="pb-po-ket">{t("PDF portofolio bisa diunduh setelah minimal satu proyek selesai.", "The portfolio PDF unlocks once at least one project is complete.")}</p>
        )}

        {dipilih.length > 0 && (
          <div className="pb-po-daftar">
            {dipilih.map(({ baris: b, proyek: p }) => {
              const st = statusProyek(p, b);
              return (
                <button type="button" key={b.id} className="pb-po-item" onClick={() => setBuka(b.id)}>
                  <span className={`pb-po-item-ikon ${st.selesai ? "beres" : ""}`}>{st.selesai ? <Check size={16} /> : <Briefcase size={16} />}</span>
                  <span className="pb-po-item-isi">
                    <small>{p.namaProfesi}</small>
                    <b>{p.judul}</b>
                    <span className="pb-po-bar">
                      <i style={{ width: `${((Math.min(st.langkah, 5) - 1) / 4) * 100}%` }} />
                    </span>
                    <small>{st.selesai ? t("Selesai", "Complete") : t(`Langkah ${st.langkah} dari 4`, `Step ${st.langkah} of 4`)}</small>
                  </span>
                  <ArrowRight size={16} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {sisa > 0 && boleh && (
        <div className="pb-po-katalog">
          <div className="pb-head" style={{ marginBottom: 12 }}>
            <div>
              <span className="pb-label">
                <Sparkles size={13} /> {t(`Pilih ${sisa} proyek lagi`, `Pick ${sisa} more project${sisa > 1 ? "s" : ""}`)}
              </span>
              <h2 style={{ margin: "6px 0 0", fontSize: 22 }}>{t("Katalog proyek", "Project catalogue")}</h2>
            </div>
          </div>
          <label className="pb-input" style={{ maxWidth: 460, marginBottom: 12 }}>
            <Search size={16} color="var(--muted)" />
            <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder={t("Cari profesi atau proyek, mis. data entry, VA, desain", "Search a role or project, e.g. data entry, VA, design")} />
          </label>
          <div className="pb-chips" style={{ marginBottom: 16 }}>
            <button type="button" className={`pb-chip ${!kategori ? "on" : ""}`} onClick={() => setKategori("")}>
              {t("Semua", "All")}
            </button>
            {DAFTAR_KATEGORI.map((k) => (
              <button key={k.id} type="button" className={`pb-chip ${kategori === k.id ? "on" : ""}`} onClick={() => setKategori(k.id)}>
                {k.judul}
              </button>
            ))}
          </div>
          <div className="pb-po-grid">
            {daftarKatalog.map((p) => (
              <div key={p.id} className="pb-po-kartu">
                <small>{p.namaProfesi}</small>
                <b>{p.judul}</b>
                <p>{p.brief.split("\n")[0].slice(0, 150)}{p.brief.length > 150 ? "…" : ""}</p>
                <div className="pb-po-kartu-bawah">
                  <span className="pb-po-format">
                    <FileText size={12} /> PDF
                  </span>
                  {p.tabelAwal && (
                    <span className="pb-po-format">
                      <FileSpreadsheet size={12} /> Excel
                    </span>
                  )}
                  <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" disabled={!!memilih} onClick={() => pilih(p)}>
                    {memilih === p.id ? <Loader2 size={13} className="pb-po-putar" /> : <Plus size={13} />} {t("Pilih", "Pick")}
                  </button>
                </div>
              </div>
            ))}
            {daftarKatalog.length === 0 && <p className="pb-po-ket">{t("Tidak ada proyek yang cocok dengan pencarian.", "No projects match your search.")}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
