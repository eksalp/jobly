import React, { useRef, useState } from "react";
import "./contoh.css";
import { Upload, Trash2, Loader2, Check } from "lucide-react";
import { t } from "../../i18n.js";
import { ATURAN_GAMBAR, MAKS_MB_ASLI, TIPE_DITERIMA, kompresGambar } from "../../utils/gambarLinkedin";

/**
 * Unggah foto profil atau sampul untuk pratinjau LinkedIn Builder.
 *
 * @param jenis     "foto" | "sampul"
 * @param url       URL gambar yang sedang terpasang ("" bila belum ada)
 * @param onPasang  (blob) => Promise  — mengunggah dan memasang gambar
 * @param onHapus   () => Promise      — menghapus gambar
 */
export function KelolaGambar({ jenis, url, onPasang, onHapus }) {
  const aturan = ATURAN_GAMBAR[jenis];
  const ref = useRef(null);
  const [proses, setProses] = useState("");
  const [pesan, setPesan] = useState({ teks: "", galat: false });
  const foto = jenis === "foto";

  const pilihBerkas = async (e) => {
    const berkas = e.target.files?.[0];
    e.target.value = "";
    if (!berkas) return;
    if (!TIPE_DITERIMA.split(",").includes(berkas.type)) {
      setPesan({ teks: t("Format harus JPG, PNG, atau WebP.", "The format must be JPG, PNG, or WebP."), galat: true });
      return;
    }
    if (berkas.size > MAKS_MB_ASLI * 1024 * 1024) {
      setPesan({ teks: t(`Berkas lebih dari ${MAKS_MB_ASLI} MB. Pilih gambar yang lebih kecil.`, `The file is over ${MAKS_MB_ASLI} MB. Choose a smaller image.`), galat: true });
      return;
    }
    try {
      setPesan({ teks: "", galat: false });
      setProses(t("Mengecilkan gambar...", "Compressing image..."));
      const blob = await kompresGambar(berkas, aturan);
      setProses(t("Mengunggah...", "Uploading..."));
      await onPasang(blob);
      setPesan({
        teks: t(
          `Terpasang (${Math.round(blob.size / 1024)} KB). ${url ? "Gambar lama sudah diganti." : ""}`,
          `Applied (${Math.round(blob.size / 1024)} KB). ${url ? "The previous image was replaced." : ""}`,
        ),
        galat: false,
      });
    } catch (err) {
      setPesan({ teks: err?.message || t("Gagal mengunggah.", "Upload failed."), galat: true });
    } finally {
      setProses("");
    }
  };

  const hapus = async () => {
    setProses(t("Menghapus...", "Removing..."));
    try {
      await onHapus();
      setPesan({ teks: t("Gambar dihapus.", "Image removed."), galat: false });
    } catch (err) {
      setPesan({ teks: err?.message || t("Gagal menghapus.", "Couldn't remove it."), galat: true });
    } finally {
      setProses("");
    }
  };

  return (
    <div className="ctl-unggah">
      <div className="ctl-unggah-atas">
        <div className={`ctl-unggah-pratinjau ${foto ? "bulat" : ""}`} style={url ? { backgroundImage: `url(${url})` } : undefined}>
          {!url && <Upload size={16} />}
        </div>
        <div className="ctl-unggah-tombol">
          <button type="button" className="utama" disabled={!!proses} onClick={() => ref.current?.click()}>
            {proses ? <Loader2 size={13} className="ctl-putar" /> : <Upload size={13} />}
            {proses || (url ? t(foto ? "Ganti foto" : "Ganti sampul", foto ? "Change photo" : "Change cover") : t(foto ? "Unggah foto" : "Unggah sampul", foto ? "Upload photo" : "Upload cover"))}
          </button>
          {url && !proses && (
            <button type="button" onClick={hapus}>
              <Trash2 size={13} /> {t("Hapus", "Remove")}
            </button>
          )}
        </div>
        <input ref={ref} type="file" accept={TIPE_DITERIMA} onChange={pilihBerkas} hidden />
      </div>
      {pesan.teks && (
        <div className={`ctl-unggah-pesan ${pesan.galat ? "galat" : ""}`}>
          {!pesan.galat && <Check size={12} />} {pesan.teks}
        </div>
      )}
      <ul className="ctl-unggah-ket">
        <li>{t(`Format JPG, PNG, atau WebP, maksimal ${MAKS_MB_ASLI} MB.`, `JPG, PNG, or WebP, up to ${MAKS_MB_ASLI} MB.`)}</li>
        <li>
          {foto
            ? t(`Otomatis dipotong persegi di bagian tengah dan dikecilkan ke ${aturan.label}, maksimal ${aturan.maksKB} KB.`, `Automatically cropped square from the centre and resized to ${aturan.label}, max ${aturan.maksKB} KB.`)
            : t(`Otomatis dipotong 4:1 di bagian tengah dan dikecilkan ke ${aturan.label}, maksimal ${aturan.maksKB} KB.`, `Automatically cropped 4:1 from the centre and resized to ${aturan.label}, max ${aturan.maksKB} KB.`)}
        </li>
        <li>{t("Setiap akun hanya menyimpan satu gambar. Mengunggah lagi langsung menghapus dan mengganti gambar lama.", "Each account keeps only one image. Uploading again deletes and replaces the old one.")}</li>
        <li>{t("Gambar ini untuk pratinjau di Jobly. Untuk LinkedIn, unggah berkas aslimu langsung di LinkedIn agar tetap tajam.", "This image is for the Jobly preview. On LinkedIn, upload your original file so it stays sharp.")}</li>
      </ul>
    </div>
  );
}
