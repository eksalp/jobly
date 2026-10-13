import React, { useEffect, useMemo, useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, ClipboardPaste, Check, Eraser, ArrowRight } from "lucide-react";
import { PublicLayout } from "../../components/publik/PublicLayout";
import { cekLoker, LABEL_LEVEL, LANGKAH_VERIFIKASI } from "../../utils/cekLoker";
import { tautan } from "../../utils/navigasi";

const CONTOH = [
  {
    nama: "Broadcast WhatsApp",
    teks: "DIBUKA LOWONGAN PT PERTAMINA (PERSERO)!!! Posisi admin gudang, lulusan SMA/SMK, gaji Rp 9.500.000 + mess. Peserta wajib membayar biaya seragam Rp 350.000 yang dikembalikan setelah diterima. Kirim foto KTP & KK ke WA 0812-3456-7890 atau email rekrutmen.pertamina@gmail.com. Kuota terbatas hari ini juga!!!",
  },
  {
    nama: "Undangan interview",
    teks: "Selamat, Anda lolos seleksi administrasi PT Astra International. Psikotes dan interview dilaksanakan di Jakarta. Untuk tiket pesawat dan hotel silakan pesan melalui travel agen resmi kami, PT Cahaya Wisata, hubungi 0813-1111-2222. Biaya akan diganti saat hari interview.",
  },
  {
    nama: "Lowongan resmi",
    teks: "PT Bank Central Asia Tbk membuka posisi Relationship Officer di Jakarta. Tanggung jawab: mengelola portofolio nasabah dan menawarkan produk perbankan. Kualifikasi: S1 semua jurusan, IPK min. 3,00. BCA tidak memungut biaya apa pun dalam proses rekrutmen. Lamar melalui karir.bca.co.id.",
  },
];

const IKON_LEVEL = { aman: ShieldCheck, waspada: ShieldAlert, bahaya: ShieldX };

/** Kartu hasil: dipakai di halaman ini dan (versi ringkas) di detail loker. */
export function HasilCek({ hasil, ringkas = false }) {
  const Ikon = IKON_LEVEL[hasil.level];
  const tampil = ringkas ? hasil.temuan.slice(0, 3) : hasil.temuan;
  return (
    <div className={`pb-cek-hasil ${hasil.level}`}>
      <div className="pb-cek-head">
        <span className="pb-cek-ic">
          <Ikon size={ringkas ? 18 : 22} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div className="pb-cek-level">{LABEL_LEVEL[hasil.level].label}</div>
          <div className="pb-cek-sub">
            {hasil.temuan.length
              ? `${hasil.temuan.length} tanda ditemukan`
              : "Tidak ada pola penipuan umum yang terdeteksi"}
          </div>
        </div>
        {!ringkas && (
          <div className="pb-cek-meter" aria-label={`Skor risiko ${hasil.skor} dari 100`}>
            <b>{hasil.skor}</b>
            <span>/100 risiko</span>
          </div>
        )}
      </div>
      {!ringkas && (
        <div className="pb-cek-bar" aria-hidden="true">
          <i style={{ width: `${Math.max(3, hasil.skor)}%` }} />
        </div>
      )}
      {tampil.length > 0 && (
        <ul className="pb-cek-list">
          {tampil.map((t, i) => (
            <li key={t.id} style={{ "--tunda": `${i * 70}ms` }}>
              <b>{t.judul}</b>
              {!ringkas && <p>{t.detail}</p>}
              {!ringkas && t.kutipan && <q>{t.kutipan}</q>}
            </li>
          ))}
        </ul>
      )}
      {!ringkas && hasil.hal_baik.length > 0 && (
        <ul className="pb-cek-baik">
          {hasil.hal_baik.map((p) => (
            <li key={p.id}>
              <Check size={15} /> {p.judul}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CekLokerPage() {
  const [teks, setTeks] = useState("");
  const [diperiksa, setDiperiksa] = useState("");

  useEffect(() => {
    document.title = "Cek loker palsu · Jobly";
  }, []);

  // Periksa otomatis sebentar setelah berhenti mengetik
  useEffect(() => {
    const t = setTimeout(() => setDiperiksa(teks), 350);
    return () => clearTimeout(t);
  }, [teks]);

  const hasil = useMemo(() => (diperiksa.trim().length >= 40 ? cekLoker({ teks: diperiksa }) : null), [diperiksa]);

  const tempel = async () => {
    try {
      const isi = await navigator.clipboard.readText();
      if (isi) setTeks(isi);
    } catch {
      document.getElementById("teks-loker")?.focus();
    }
  };

  return (
    <PublicLayout aktif="/cek-loker">
      <div className="pb-wrap pb-pagehead">
        <span className="pb-label">Gratis · tanpa daftar</span>
        <h1>Cek loker palsu sebelum kamu melamar</h1>
        <p>
          Dapat info loker dari WhatsApp, Instagram, Telegram, atau email? Tempel
          teksnya di sini. Jobly akan mencocokkannya dengan 16 modus penipuan loker
          yang paling sering beredar, mulai dari minta biaya, travel agent untuk
          interview, tugas like berbayar, sampai “jalur orang dalam”. Teksnya
          diperiksa di HP atau laptopmu sendiri dan tidak dikirim ke mana pun.
        </p>
      </div>

      <div className="pb-wrap pb-cek">
        <div className="pb-cek-kiri">
          <label className="pb-field" htmlFor="teks-loker">
            <span>Teks lowongan</span>
          </label>
          <div className="pb-cek-area">
            <textarea
              id="teks-loker"
              value={teks}
              onChange={(e) => setTeks(e.target.value)}
              placeholder="Tempel isi lowongan di sini…"
              rows={12}
            />
            <div className="pb-cek-tools">
              <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={tempel}>
                <ClipboardPaste size={15} /> Tempel
              </button>
              {teks && (
                <button type="button" className="pb-btn pb-btn-outline pb-btn-sm" onClick={() => setTeks("")}>
                  <Eraser size={15} /> Kosongkan
                </button>
              )}
              <span className="pb-cek-count">{teks.length.toLocaleString("id-ID")} karakter</span>
            </div>
          </div>
          <div className="pb-cek-contoh">
            <span>Coba contoh:</span>
            {CONTOH.map((c) => (
              <button key={c.nama} type="button" className="pb-chip" onClick={() => setTeks(c.teks)}>
                {c.nama}
              </button>
            ))}
          </div>
        </div>

        <div className="pb-cek-kanan" aria-live="polite">
          {hasil ? (
            <HasilCek hasil={hasil} />
          ) : (
            <div className="pb-cek-kosong">
              <ShieldCheck size={28} />
              <b>Hasil pemeriksaan muncul di sini</b>
              <span>Tempel minimal satu-dua kalimat lowongan.</span>
            </div>
          )}

          <div className="pb-box tint" style={{ marginTop: 16 }}>
            <h3>Apa pun hasilnya, lakukan ini</h3>
            <ol className="pb-cek-langkah">
              {LANGKAH_VERIFIKASI.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ol>
            <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "10px 0 0", lineHeight: 1.55 }}>
              Pemeriksaan ini mengenali pola, bukan memastikan keaslian. Loker
              asli bisa memicu satu-dua tanda, dan penipu bisa menulis dengan rapi.
            </p>
          </div>
        </div>
      </div>

      <section className="pb-section tint" style={{ marginTop: 56 }}>
        <div className="pb-wrap pb-cek-cta" data-muncul="">
          <div>
            <h2 className="pb-h2">Lebih aman: cari dari sumber resmi</h2>
            <p className="pb-sub">
              Setiap loker di Jobly menampilkan sumbernya dan diarahkan ke situs
              karier perusahaan atau portal tepercaya. Kamu tidak pernah membayar
              apa pun untuk melamar.
            </p>
          </div>
          <a className="pb-btn pb-btn-primary" {...tautan("/loker")}>
            Cari loker <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}
