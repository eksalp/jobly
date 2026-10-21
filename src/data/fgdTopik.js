/**
 * Daftar topik simulasi FGD untuk pilihan di browser.
 * Isi lengkapnya ada di supabase/functions/_shared/fgdTopik.ts — id dan
 * judul WAJIB sama.
 */
import { t } from "../i18n.js";

export const TOPIK_FGD = [
  { id: "wfh", jenis: "isu", judul: t("WFH dijadikan kebijakan permanen", "Making remote work permanent") },
  { id: "4hari", jenis: "isu", judul: t("Empat hari kerja dalam seminggu", "A four-day work week") },
  { id: "ai", jenis: "isu", judul: t("AI di tempat kerja: ancaman atau peluang", "AI at work: threat or opportunity") },
  { id: "plastik", jenis: "isu", judul: t("Larangan kantong plastik sekali pakai", "Banning single-use plastic bags") },
  { id: "umkm", jenis: "kasus", judul: t("Anggaran pemasaran kedai kopi", "A coffee shop's marketing budget") },
  { id: "gudang", jenis: "kasus", judul: t("Memilih lokasi gudang baru", "Choosing a new warehouse site") },
  { id: "turnover", jenis: "kasus", judul: t("Banyak karyawan keluar", "High staff turnover") },
  { id: "survival", jenis: "kasus", judul: t("Terdampar di hutan", "Stranded in the forest") },
];

export const PESERTA_FGD = {
  moderator: { nama: "Bu Sari", peran: t("Asesor", "Assessor") },
  dimas: { nama: "Dimas", peran: t("Peserta", "Participant") },
  ayu: { nama: "Ayu", peran: t("Peserta", "Participant") },
  fajar: { nama: "Fajar", peran: t("Peserta", "Participant") },
};

export const DURASI_FGD_MENIT = 20;
