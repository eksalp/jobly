/**
 * Versi English portofolio.
 *
 * Teks proyek (brief, studi kasus, hasil kerja, revisi, keterangan gambar,
 * judul kolom tabel) dan profil (headline, ringkasan) diratakan menjadi
 * peta { kunci: teks }, diterjemahkan lewat edge function terjemah-portofolio,
 * lalu dipasang kembali. Hasil per proyek disimpan di kolom `terjemahan`
 * bersama sidik isinya, jadi terjemahan hanya dibuat ulang kalau isinya berubah.
 */
import { supabase } from "../lib/supabaseClient";

const TABEL = "portofolio_proyek";
const STUDI = ["ringkasan", "tantangan", "peran", "proses", "hasil", "pelajaran"];

/** Sidik sederhana (FNV-1a) untuk mendeteksi perubahan isi. */
export function sidik(obj) {
  const s = JSON.stringify(obj);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36) + s.length.toString(36);
}

const isi = (v) => typeof v === "string" && v.trim();

export function teksProyek(proyek, data) {
  const m = {};
  const taruh = (k, v) => {
    if (isi(v)) m[k] = v;
  };
  taruh("judul", proyek.judul);
  taruh("profesi", proyek.namaProfesi);
  taruh("klien", proyek.dari?.peran);
  taruh("brief", proyek.brief);
  taruh("revisiPesan", proyek.revisi?.pesan);
  (proyek.langkah || []).forEach((x, i) => taruh(`langkah.${i}`, x));
  (proyek.rubrik || []).forEach((x, i) => taruh(`rubrik.${i}`, x));
  STUDI.forEach((k) => taruh(`studi.${k}`, data.studi?.[k]));
  taruh("jawaban", data.jawaban);
  taruh("revisi", data.revisi);
  (data.lampiran || []).forEach((x, i) => taruh(`ket.${i}`, x?.ket));
  (data.tabel?.kolom || []).forEach((x, i) => taruh(`kolom.${i}`, String(x ?? "")));
  return m;
}

export function terapkanProyek(proyek, data, en) {
  const g = (k, asli) => (isi(en[k]) ? en[k] : asli);
  return {
    proyek: {
      ...proyek,
      judul: g("judul", proyek.judul),
      namaProfesi: g("profesi", proyek.namaProfesi),
      dari: proyek.dari ? { ...proyek.dari, peran: g("klien", proyek.dari.peran) } : proyek.dari,
      brief: g("brief", proyek.brief),
      revisi: proyek.revisi ? { ...proyek.revisi, pesan: g("revisiPesan", proyek.revisi.pesan) } : proyek.revisi,
      langkah: (proyek.langkah || []).map((x, i) => g(`langkah.${i}`, x)),
      rubrik: (proyek.rubrik || []).map((x, i) => g(`rubrik.${i}`, x)),
    },
    data: {
      ...data,
      studi: Object.fromEntries(Object.entries(data.studi || {}).map(([k, v]) => [k, g(`studi.${k}`, v)])),
      jawaban: g("jawaban", data.jawaban),
      revisi: g("revisi", data.revisi),
      lampiran: (data.lampiran || []).map((x, i) => (x ? { ...x, ket: g(`ket.${i}`, x.ket) } : x)),
      tabel: data.tabel ? { ...data.tabel, kolom: (data.tabel.kolom || []).map((x, i) => g(`kolom.${i}`, x)) } : data.tabel,
    },
  };
}

const KUNCI_PROFIL = "jobly:portofolio-en-profil";
// Terjemahan yang baru disimpan di sesi ini (data di layar belum tentu memuatnya)
const ingatan = new Map();

/**
 * Siapkan versi English untuk sekumpulan proyek dan profil.
 * items: [{ proyek, data }] dengan data = baris DB (punya id & terjemahan).
 * Mengembalikan { items, profil }.
 */
export async function siapkanInggris(items, profil) {
  const kirim = {};
  const rencana = items.map(({ proyek, data }, i) => {
    const teks = teksProyek(proyek, data);
    const h = sidik(teks);
    const simpanan = ingatan.get(data.id) || data.terjemahan;
    const cache = simpanan && simpanan.hash === h ? simpanan.teks : null;
    if (!cache) Object.entries(teks).forEach(([k, v]) => (kirim[`p${i}|${k}`] = v));
    return { teks, h, cache };
  });

  const teksProfil = {};
  if (isi(profil.headline)) teksProfil.headline = profil.headline;
  if (isi(profil.ringkasan)) teksProfil.ringkasan = profil.ringkasan;
  (profil.keahlian || []).forEach((x, i) => isi(x) && (teksProfil[`skill.${i}`] = x));
  const hProfil = sidik(teksProfil);
  let profilEn = null;
  try {
    const c = JSON.parse(localStorage.getItem(KUNCI_PROFIL) || "null");
    if (c?.hash === hProfil) profilEn = c.teks;
  } catch {
    /* penyimpanan tidak tersedia */
  }
  if (!profilEn) Object.entries(teksProfil).forEach(([k, v]) => (kirim[`profil|${k}`] = v));

  let hasil = {};
  if (Object.keys(kirim).length) {
    const { data, error } = await supabase.functions.invoke("terjemah-portofolio", { body: { teks: kirim } });
    if (error) {
      let pesan = "Terjemahan gagal dibuat. Coba lagi sebentar.";
      try {
        const b = await error.context?.json?.();
        if (b?.error) pesan = b.error;
      } catch {
        /* abaikan */
      }
      throw new Error(pesan);
    }
    hasil = data?.teks || {};
  }

  const ambil = (awalan) =>
    Object.fromEntries(
      Object.entries(hasil)
        .filter(([k]) => k.startsWith(awalan))
        .map(([k, v]) => [k.slice(awalan.length), v]),
    );

  const keluar = [];
  for (let i = 0; i < items.length; i++) {
    const { proyek, data } = items[i];
    const r = rencana[i];
    const en = r.cache || ambil(`p${i}|`);
    if (!r.cache && Object.keys(en).length && data.id) {
      // Simpan supaya tidak perlu diterjemahkan ulang
      ingatan.set(data.id, { hash: r.h, teks: en });
      await supabase.from(TABEL).update({ terjemahan: { hash: r.h, teks: en } }).eq("id", data.id);
    }
    keluar.push(terapkanProyek(proyek, data, en));
  }

  if (!profilEn) {
    profilEn = ambil("profil|");
    try {
      localStorage.setItem(KUNCI_PROFIL, JSON.stringify({ hash: hProfil, teks: profilEn }));
    } catch {
      /* penyimpanan tidak tersedia */
    }
  }
  const profilBaru = {
    ...profil,
    headline: profilEn.headline || profil.headline,
    ringkasan: profilEn.ringkasan || profil.ringkasan,
    keahlian: (profil.keahlian || []).map((x, i) => profilEn[`skill.${i}`] || x),
  };
  return { items: keluar, profil: profilBaru };
}
