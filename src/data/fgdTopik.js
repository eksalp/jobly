/**
 * Daftar topik simulasi FGD untuk pilihan di browser.
 * Isi lengkapnya ada di supabase/functions/_shared/fgdTopik.ts — id, kelompok,
 * dan judul WAJIB sama.
 */
import { t } from "../i18n.js";

export const KELOMPOK_FGD = [
  { id: "kerja", nama: t("Dunia kerja & SDM", "Work & people") },
  { id: "digital", nama: t("Teknologi & digital", "Tech & digital") },
  { id: "ekonomi", nama: t("Ekonomi & bisnis", "Economy & business") },
  { id: "lingkungan", nama: t("Lingkungan & kota", "Environment & cities") },
  { id: "muda", nama: t("Pendidikan & generasi muda", "Education & young people") },
  { id: "publik", nama: t("BUMN & layanan publik", "State firms & public services") },
  { id: "kasus", nama: t("Studi kasus perusahaan", "Company case studies") },
  { id: "prioritas", nama: t("Simulasi & prioritas", "Ranking & survival exercises") },
];

export const TOPIK_FGD = [
  { id: "wfh", kelompok: "kerja", jenis: "isu", judul: t("WFH dijadikan kebijakan permanen", "Making remote work permanent") },
  { id: "4hari", kelompok: "kerja", jenis: "isu", judul: t("Empat hari kerja dalam seminggu", "A four-day work week") },
  { id: "loyalitas", kelompok: "kerja", jenis: "isu", judul: t("Pindah kerja setiap 1–2 tahun", "Changing jobs every 1–2 years") },
  { id: "gajiterbuka", kelompok: "kerja", jenis: "isu", judul: t("Wajib mencantumkan gaji di lowongan", "Mandatory salary ranges in job ads") },
  { id: "lembur", kelompok: "kerja", jenis: "isu", judul: t("Hak tidak dihubungi di luar jam kerja", "The right to disconnect") },
  { id: "phk", kelompok: "kerja", jenis: "kasus", judul: t("PHK atau potong gaji saat krisis", "Layoffs or pay cuts in a downturn") },
  { id: "ai", kelompok: "digital", jenis: "isu", judul: t("AI di tempat kerja: ancaman atau peluang", "AI at work: threat or opportunity") },
  { id: "databocor", kelompok: "digital", jenis: "kasus", judul: t("Data pelanggan bocor", "A customer data breach") },
  { id: "medsos", kelompok: "digital", jenis: "isu", judul: t("Aturan media sosial untuk karyawan", "Social media rules for employees") },
  { id: "paylater", kelompok: "digital", jenis: "isu", judul: t("Paylater dan pinjol di kalangan anak muda", "Buy-now-pay-later and online loans among young people") },
  { id: "hoaks", kelompok: "digital", jenis: "isu", judul: t("Hoaks dan deepfake: tanggung jawab siapa?", "Hoaxes and deepfakes: whose job is it?") },
  { id: "tunai", kelompok: "digital", jenis: "isu", judul: t("Toko yang tidak menerima uang tunai", "Cashless-only shops") },
  { id: "ojol", kelompok: "ekonomi", jenis: "isu", judul: t("Status pengemudi ojek online: mitra atau karyawan?", "Ride-hailing drivers: partners or employees?") },
  { id: "umr", kelompok: "ekonomi", jenis: "isu", judul: t("Kenaikan upah minimum", "Raising the minimum wage") },
  { id: "waralaba", kelompok: "ekonomi", jenis: "kasus", judul: t("Ekspansi waralaba ke luar Jawa", "Expanding a franchise beyond Java") },
  { id: "harga", kelompok: "ekonomi", jenis: "kasus", judul: t("Naikkan harga atau kecilkan kemasan?", "Raise the price or shrink the pack?") },
  { id: "lokal", kelompok: "ekonomi", jenis: "isu", judul: t("Produk impor murah di toko online", "Cheap imports on online marketplaces") },
  { id: "plastik", kelompok: "lingkungan", jenis: "isu", judul: t("Larangan kantong plastik sekali pakai", "Banning single-use plastic bags") },
  { id: "motorlistrik", kelompok: "lingkungan", jenis: "isu", judul: t("Subsidi motor listrik", "Subsidies for electric motorbikes") },
  { id: "erp", kelompok: "lingkungan", jenis: "isu", judul: t("Jalan berbayar untuk mengatasi macet", "Congestion charging") },
  { id: "sisamakanan", kelompok: "lingkungan", jenis: "isu", judul: t("Sisa makanan di restoran dan hotel", "Food waste in restaurants and hotels") },
  { id: "banjir", kelompok: "lingkungan", jenis: "kasus", judul: t("Anggaran pengendalian banjir", "A flood-control budget") },
  { id: "airbersih", kelompok: "lingkungan", jenis: "kasus", judul: t("Krisis air bersih saat kemarau", "A clean-water crisis in the dry season") },
  { id: "kuliah", kelompok: "muda", jenis: "isu", judul: t("Kuliah dulu atau langsung kerja?", "University first, or straight to work?") },
  { id: "magang", kelompok: "muda", jenis: "isu", judul: t("Magang tanpa dibayar", "Unpaid internships") },
  { id: "mental", kelompok: "muda", jenis: "isu", judul: t("Cuti untuk kesehatan mental", "Mental-health leave") },
  { id: "judol", kelompok: "muda", jenis: "isu", judul: t("Judi online di kalangan pekerja muda", "Online gambling among young workers") },
  { id: "ijazah", kelompok: "muda", jenis: "isu", judul: t("Menghapus syarat IPK dan ijazah", "Dropping GPA and degree requirements") },
  { id: "usia", kelompok: "muda", jenis: "isu", judul: t("Batas usia di lowongan kerja", "Age limits in job ads") },
  { id: "penempatan", kelompok: "publik", jenis: "isu", judul: t("Siap ditempatkan di seluruh Indonesia", "Willing to be posted anywhere in Indonesia") },
  { id: "cabang", kelompok: "publik", jenis: "isu", judul: t("Bank BUMN menutup kantor cabang", "A state bank closing branches") },
  { id: "mudik", kelompok: "publik", jenis: "kasus", judul: t("Lonjakan penumpang kereta saat mudik", "The holiday rush on the railways") },
  { id: "csr", kelompok: "publik", jenis: "kasus", judul: t("Menyalurkan dana CSR Rp5 miliar", "Allocating Rp5 billion in CSR funds") },
  { id: "padam", kelompok: "publik", jenis: "kasus", judul: t("Pemadaman listrik bergilir", "Rolling blackouts") },
  { id: "antrean", kelompok: "publik", jenis: "kasus", judul: t("Antrean panjang di rumah sakit daerah", "Long queues at a regional hospital") },
  { id: "umkm", kelompok: "kasus", jenis: "kasus", judul: t("Anggaran pemasaran kedai kopi", "A coffee shop's marketing budget") },
  { id: "gudang", kelompok: "kasus", jenis: "kasus", judul: t("Memilih lokasi gudang baru", "Choosing a new warehouse site") },
  { id: "turnover", kelompok: "kasus", jenis: "kasus", judul: t("Banyak karyawan keluar", "High staff turnover") },
  { id: "viral", kelompok: "kasus", jenis: "kasus", judul: t("Keluhan pelanggan viral", "A customer complaint goes viral") },
  { id: "vendor", kelompok: "kasus", jenis: "kasus", judul: t("Memilih vendor sistem HR", "Choosing an HR software vendor") },
  { id: "produkbaru", kelompok: "kasus", jenis: "kasus", judul: t("Meluncurkan minuman sehat", "Launching a healthy drink") },
  { id: "akuisisi", kelompok: "kasus", jenis: "kasus", judul: t("Dua tim digabung setelah akuisisi", "Merging two teams after an acquisition") },
  { id: "proyek", kelompok: "kasus", jenis: "kasus", judul: t("Proyek aplikasi terlambat dua bulan", "An app project two months late") },
  { id: "survival", kelompok: "prioritas", jenis: "kasus", judul: t("Terdampar di hutan", "Stranded in the forest") },
  { id: "laut", kelompok: "prioritas", jenis: "kasus", judul: t("Terombang-ambing di laut", "Adrift at sea") },
  { id: "bencana", kelompok: "prioritas", jenis: "kasus", judul: t("Satu truk bantuan untuk tiga desa", "One aid truck for three villages") },
  { id: "promosi", kelompok: "prioritas", jenis: "kasus", judul: t("Memilih satu kandidat promosi", "Choosing one candidate for promotion") },
  { id: "anggarankantor", kelompok: "prioritas", jenis: "kasus", judul: t("Anggaran perbaikan kantor Rp300 juta", "A Rp300 million office budget") },
];

export const PESERTA_FGD = {
  moderator: { nama: "Bu Sari", peran: t("Asesor", "Assessor") },
  dimas: { nama: "Dimas", peran: t("Peserta", "Participant") },
  ayu: { nama: "Ayu", peran: t("Peserta", "Participant") },
  fajar: { nama: "Fajar", peran: t("Peserta", "Participant") },
};

export const DURASI_FGD_MENIT = 20;
