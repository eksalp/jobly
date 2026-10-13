import { t } from "../i18n.js";
/**
 * Cek Loker Palsu — penilai tanda bahaya lowongan kerja.
 *
 * Aturan disusun dari pola penipuan loker yang paling sering beredar di
 * Indonesia: minta biaya di muka, travel agent "interview", tugas like &
 * subscribe berbayar, rekrutmen berkedok MLM, sampai "jalur orang dalam".
 *
 * Penilaian berjalan seluruhnya di browser — teks yang ditempel tidak
 * dikirim ke mana pun. Hasilnya adalah PERINGATAN, bukan vonis: loker
 * asli bisa saja memicu satu-dua tanda, dan loker palsu bisa lolos.
 */

// Kalimat penyangkal: "kami TIDAK memungut biaya", "biaya pelatihan
// DITANGGUNG perusahaan". Kalau muncul di sekitar temuan, temuan diabaikan.
const PENYANGKAL =
  /(ditanggung|gratis|cuma-?cuma|tidak dipungut|bebas biaya|free of charge|(tidak|tanpa|tak|bukan|never|not)\s+(pernah\s+)?(memungut|meminta|menarik|mengenakan|ada|dikenakan|dipungut|charge|ask|request|akan)|(tidak|tanpa)\s+biaya)/i;

const ATURAN = [
  {
    id: "biaya",
    berat: 45,
    judul: t("Meminta uang dari pelamar", "Asks applicants for money"),
    detail:
      t("Perusahaan resmi tidak memungut biaya pendaftaran, seragam, pelatihan, tes kesehatan, atau tiket. Ini tanda penipuan yang paling umum.", "Real companies don't charge for registration, uniforms, training, medical checks, or tickets. This is the most common scam sign."),
    pola: [
      /\b(biaya|uang|dana)\s+(pendaftaran|administrasi|admin|seragam|pelatihan|training|medical|med[ -]?check|tes kesehatan|pemeriksaan kesehatan|jaminan|pengurusan|registrasi|materai)/i,
      /\b(transfer|bayar|setor|kirim)\s+(dulu|terlebih dahulu|di ?muka|sebesar|ke rekening|uang|dana)/i,
      /\b(deposit|uang jaminan)\s+(sebesar|rp|\d|terlebih|dulu)/i,
      /\b(dp|uang muka)\s+(rp|sebesar|\d)/i,
      /\brp\.?\s?\d[\d.,]*\s*(untuk|sebagai|buat)\s+(biaya|admin|pendaftaran|seragam|pelatihan)/i,
      /\b(dikembalikan|refund(able)?)\s+(setelah|saat)\s+(diterima|bekerja|gajian)/i,
    ],
  },
  {
    id: "travel",
    berat: 40,
    judul: t("Pola 'travel agent' untuk interview", "The 'travel agent' interview trick"),
    detail:
      t("Undangan tes/interview di luar kota yang mewajibkan pesan tiket atau hotel lewat agen tertentu adalah modus lama. Perusahaan tidak menunjuk travel untuk pelamar.", "An out-of-town test or interview that requires booking tickets or a hotel through a specific agent is an old scam. Companies don't assign travel agents to applicants."),
    pola: [
      /(travel|agen perjalanan|biro perjalanan).{0,80}(interview|wawancara|tes|psikotes|seleksi)/i,
      /(interview|wawancara|tes|psikotes|seleksi).{0,80}(travel|agen perjalanan|biro perjalanan)/i,
      /(pesan|booking|reservasi)\s+(tiket|hotel).{0,40}(melalui|lewat|hubungi)/i,
    ],
  },
  {
    id: "tugas",
    berat: 38,
    judul: t("Tugas online berbayar (like, follow, rating)", "Paid online tasks (likes, follows, ratings)"),
    detail:
      t("Kerja 'like & subscribe', memberi rating, atau menyelesaikan tugas berbayar per misi hampir selalu berujung diminta deposit untuk 'menarik komisi'.", "'Like and subscribe' jobs, paid ratings, or per-mission tasks almost always end with a deposit request to 'withdraw your commission'."),
    pola: [
      /(like|subscribe|follow|rating|ulasan|review|share|klik iklan).{0,40}(dibayar|komisi|bayaran|per\s?tugas|per\s?misi|cuan)/i,
      /\b(tugas|misi)\s+online\b/i,
      /\b(per\s?tugas|per\s?misi)\b/i,
      /(kerja|pekerjaan)\s+(sampingan|paruh waktu|part ?time).{0,50}(hp|handphone|smartphone|dari rumah).{0,60}(rp|ribu|rb|\d+k)/i,
      /\b(komisi|cuan)\s+(harian|setiap hari|langsung cair)/i,
    ],
  },
  {
    id: "mlm",
    berat: 25,
    judul: t("Berbau MLM atau ajakan investasi", "Looks like MLM or an investment pitch"),
    detail:
      t("Kata seperti member, downline, modal awal, atau passive income menandakan skema keanggotaan, bukan pekerjaan yang menggaji karyawan.", "Words like member, downline, starting capital, or passive income point to a membership scheme, not a job that pays employees."),
    pola: [
      /\b(downline|upline|join member|jadi member|keanggotaan)\b/i,
      /\b(modal awal|paket usaha|paket member|passive income|penghasilan pasif|reseller tanpa modal|investasi (awal|minimal) rp)\b/i,
      /\b(rekrut|ajak)\s+(teman|orang|member).{0,30}(bonus|komisi)/i,
    ],
  },
  {
    id: "orangdalam",
    berat: 35,
    judul: t("Menjanjikan jalur khusus atau 'orang dalam'", "Promises a shortcut or an 'insider'"),
    detail:
      t("Rekrutmen BUMN, CPNS, dan perusahaan besar diumumkan terbuka. Tawaran jalur khusus, titipan, atau 'bisa dibantu lolos' adalah penipuan, sering dengan imbalan uang.", "State-owned enterprise, civil service, and big-company hiring is announced publicly. Offers of a special route or 'help to pass' are scams, usually for money."),
    pola: [
      /\b(jalur khusus|orang dalam|titipan|jalur belakang|bisa dibantu (masuk|lolos|diterima)|dijamin (lolos|diterima))\b/i,
      /\b(cpns|pppk|bumn).{0,40}(tanpa tes|tanpa seleksi|pasti lolos)/i,
    ],
  },
  {
    id: "datasensitif",
    berat: 28,
    judul: t("Meminta data pribadi sensitif di awal", "Asks for sensitive personal data up front"),
    detail:
      t("Foto KTP, KK, buku tabungan, apalagi kode OTP/PIN tidak dibutuhkan untuk melamar. Data seperti ini bisa dipakai untuk pinjol atau pembobolan rekening.", "Photos of your ID card, family card, or bank book, let alone OTP/PIN codes, are never needed to apply. This data can be used for illegal loans or account takeovers."),
    pola: [
      /(kirim|lampirkan|foto|upload|unggah|sertakan)\s.{0,25}(ktp|kartu keluarga|\bkk\b|buku tabungan|nomor rekening|kartu atm|npwp)/i,
    ],
  },
  {
    id: "otp",
    berat: 50,
    judul: t("Meminta kode OTP, PIN, atau password", "Asks for an OTP code, PIN, or password"),
    detail:
      t("Tidak ada proses rekrutmen yang membutuhkan kode OTP, PIN, atau kata sandi. Jangan pernah membagikannya.", "No hiring process ever needs an OTP code, PIN, or password. Never share them."),
    pola: [/(kirim|berikan|bagikan|sebutkan|minta|beritahu|infokan|masukkan)\s.{0,25}(kode\s+)?(otp|pin atm|pin m-?banking|kode verifikasi|password|kata sandi)\b/i],
  },
  {
    id: "janji",
    berat: 20,
    judul: t("Janji diterima tanpa seleksi", "Promises a job without selection"),
    detail:
      t("'Langsung diterima', 'tanpa tes', atau 'pasti lolos' tidak lazim untuk perusahaan yang benar-benar menyeleksi karyawan.", "'Hired on the spot', 'no test', or 'guaranteed to pass' is unusual for companies that actually screen candidates."),
    pola: [/\b(langsung diterima|langsung kerja|tanpa tes|tanpa interview|tanpa seleksi|pasti diterima|pasti lolos|100\s?%\s?diterima|dijamin diterima)\b/i],
  },
  {
    id: "gratisan",
    berat: 15,
    judul: t("Email rekrutmen memakai layanan gratis", "Recruiting email uses a free email service"),
    detail:
      t("Perusahaan besar memakai email berdomain perusahaan (mis. @namaperusahaan.co.id). Email @gmail/@yahoo yang mengatasnamakan PT besar patut dicurigai.", "Big companies use their own email domain (e.g. @companyname.co.id). A @gmail or @yahoo address claiming to be a big company is suspicious."),
    pola: [/[\w.+-]+@(gmail|googlemail|yahoo|ymail|hotmail|outlook|live|icloud|aol|protonmail|proton)\.(com|co\.id|me)/i],
  },
  {
    id: "wa",
    berat: 12,
    judul: t("Kontak hanya lewat WhatsApp atau Telegram", "Contact only via WhatsApp or Telegram"),
    detail:
      t("Melamar lewat chat pribadi bukan berarti palsu, tapi tanpa situs atau email resmi kamu sulit memastikan siapa di baliknya.", "Applying through private chat isn't always fake, but without an official site or email it's hard to know who's behind it."),
    pola: [/(wa\.me\/|api\.whatsapp|whatsapp|\bwa\b\s*[:.]?\s*(\+?62|0)8|hubungi\s+(wa|whatsapp)|telegram|t\.me\/)/i],
  },
  {
    id: "pendek",
    berat: 12,
    judul: t("Tautan disamarkan dengan pemendek", "Links hidden behind a URL shortener"),
    detail:
      t("Tautan bit.ly, s.id, dan sejenisnya menyembunyikan alamat tujuan. Buka hanya jika kamu bisa memastikan tujuannya situs resmi.", "bit.ly, s.id, and similar links hide the destination. Only open them if you can confirm they lead to an official site."),
    pola: [/\b(bit\.ly|s\.id|tinyurl|cutt\.ly|shorturl|rebrand\.ly|linktr\.ee|lynk\.id|rb\.gy|is\.gd)\//i],
  },
  {
    id: "urgensi",
    berat: 10,
    judul: t("Menekan agar cepat mengambil keputusan", "Pressures you to decide fast"),
    detail:
      t("Penipu sengaja membuat terburu-buru supaya kamu tidak sempat memeriksa. Lowongan asli jarang menuntut keputusan hari itu juga.", "Scammers rush you so you don't have time to check. Real openings rarely demand a decision the same day."),
    pola: [/\b(kuota terbatas|hari ini juga|segera hubungi|buruan|slot terbatas|terbatas hari ini|cepat sebelum|jangan sampai ketinggalan)\b/i],
  },
  {
    id: "hotel",
    berat: 10,
    judul: t("Lokasi interview tidak lazim", "Unusual interview location"),
    detail: t("Interview di kamar hotel, rumah pribadi, atau kafe dengan biaya ditanggung pelamar perlu diwaspadai.", "Interviews in a hotel room, a private home, or a café at your own cost are a warning sign."),
    pola: [/(interview|wawancara|tes).{0,40}(di|ke)\s+(hotel|kamar|rumah pribadi|ruko)/i],
  },
];

const POSITIF = [
  {
    id: "ats",
    nilai: 12,
    judul: t("Melamar lewat situs karier atau portal resmi", "Apply through a career site or official portal"),
    pola: /(linkedin\.com\/jobs|jobstreet|glints|kalibrr|indeed\.|greenhouse\.io|lever\.co|workday|myworkdayjobs|smartrecruiters|successfactors|taleo|icims|bamboohr|recruitee|karir\.|career|careers\.|rekrutmen\.)/i,
  },
  {
    id: "tanpabiaya",
    nilai: 4,
    judul: t("Menegaskan proses rekrutmen tanpa biaya", "States the hiring process is free"),
    pola: /(tidak|tanpa)\s+(memungut|dipungut|meminta|menarik|dikenakan)?\s*biaya/i,
  },
  {
    id: "kualifikasi",
    nilai: 5,
    judul: t("Menjelaskan kualifikasi dan tanggung jawab", "Explains qualifications and responsibilities"),
    pola: /(kualifikasi|persyaratan|tanggung jawab|job ?desc|requirements|responsibilities|qualifications)/i,
  },
];

const EMAIL_PERUSAHAAN = /[\w.+-]+@(?!(gmail|googlemail|yahoo|ymail|hotmail|outlook|live|icloud|aol|protonmail|proton)\.)[\w-]+(\.[\w-]+)+/i;

/** Ambil potongan kalimat di sekitar temuan, untuk ditampilkan. */
function kutip(teks, m) {
  if (!m) return null;
  const awal = Math.max(0, m.index - 40);
  const akhir = Math.min(teks.length, m.index + m[0].length + 40);
  return (
    (awal > 0 ? "…" : "") +
    teks.slice(awal, akhir).replace(/\s+/g, " ").trim() +
    (akhir < teks.length ? "…" : "")
  );
}

/** Gaji per bulan dalam rupiah dari teks bebas, kalau ada. Kasar tapi cukup. */
function gajiDariTeks(teks) {
  const m = teks.match(/rp\.?\s?(\d{1,3}(?:[.,]\d{3})+|\d+)\s*(juta|jt|rb|ribu|k)?\s*(\/|per)?\s*(hari|bulan|minggu)?/i);
  if (!m) return null;
  let n = Number(m[1].replace(/[.,]/g, ""));
  const satuan = (m[2] || "").toLowerCase();
  if (satuan === "juta" || satuan === "jt") n *= 1e6;
  else if (["rb", "ribu", "k"].includes(satuan)) n *= 1e3;
  const per = (m[4] || "").toLowerCase();
  if (per === "hari") return { bulanan: n * 22, harian: n };
  if (per === "minggu") return { bulanan: n * 4.3 };
  return { bulanan: n };
}

/**
 * @param {object} p
 * @param {string} p.teks       isi lowongan (deskripsi atau teks tempelan)
 * @param {string} [p.judul]
 * @param {string} [p.perusahaan]
 * @param {string} [p.link]
 * @param {number} [p.gajiBulanan] gaji per bulan dalam rupiah (opsional)
 */
export function cekLoker({ teks = "", judul = "", perusahaan = "", link = "", gajiBulanan = null } = {}) {
  const semua = `${judul}\n${perusahaan}\n${teks}\n${link}`;
  const temuan = [];

  for (const a of ATURAN) {
    let cocok = null;
    for (const p of a.pola) {
      const re = new RegExp(p.source, p.flags.includes("g") ? p.flags : p.flags + "g");
      let m;
      while ((m = re.exec(semua))) {
        const sekitar = semua.slice(Math.max(0, m.index - 60), m.index + m[0].length + 40);
        if (!PENYANGKAL.test(sekitar)) {
          cocok = m;
          break;
        }
        if (m[0].length === 0) re.lastIndex++;
      }
      if (cocok) break;
    }
    if (cocok) temuan.push({ id: a.id, berat: a.berat, judul: a.judul, detail: a.detail, kutipan: kutip(semua, cocok) });
  }

  // Gaji tidak wajar untuk syarat yang sangat ringan
  const gaji = gajiBulanan ? { bulanan: gajiBulanan } : gajiDariTeks(semua);
  const syaratRingan = /(tanpa pengalaman|lulusan (sma|smk|smp)|tanpa ijazah|ibu rumah tangga|pelajar|mahasiswa|semua jurusan|usia (bebas|maks))/i.test(semua);
  if (gaji && ((gaji.bulanan >= 12e6 && syaratRingan) || (gaji.harian && gaji.harian >= 400e3 && /(hp|handphone|dari rumah|online)/i.test(semua)))) {
    temuan.push({
      id: "gaji",
      berat: 22,
      judul: t("Gaji terlalu tinggi untuk syarat yang sangat ringan", "Pay is too high for very light requirements"),
      detail:
        t("Bayaran besar tanpa pengalaman atau hanya bermodal HP adalah umpan klasik. Bandingkan dengan Peta Gaji Jobly untuk posisi serupa.", "Big pay with no experience needed, or just a phone, is classic bait. Compare with Jobly's salary map for similar roles."),
      kutipan: null,
    });
  }

  // Huruf kapital & tanda seru berlebihan — ciri broadcast asal-asalan
  const huruf = teks.replace(/[^a-zA-Z]/g, "");
  if (huruf.length > 120) {
    const kapital = (teks.match(/[A-Z]/g) || []).length / huruf.length;
    const seru = (teks.match(/!{2,}/g) || []).length;
    if (kapital > 0.45 || seru >= 3) {
      temuan.push({
        id: "gaya",
        berat: 6,
        judul: t("Gaya tulisan seperti pesan berantai", "Written like a chain message"),
        detail: t("Huruf kapital dan tanda seru berlebihan lebih sering ditemukan di broadcast penipuan daripada pengumuman resmi.", "Lots of capital letters and exclamation marks show up far more in scam broadcasts than in official postings."),
        kutipan: null,
      });
    }
  }

  // Tanpa identitas perusahaan sama sekali
  if (!perusahaan.trim() && !/\b(pt|cv|tbk|persero|perusahaan|company|inc|ltd)\b/i.test(teks) && teks.length > 60) {
    temuan.push({
      id: "anonim",
      berat: 10,
      judul: t("Tidak menyebut nama perusahaan", "Doesn't name the company"),
      detail: t("Lowongan tanpa nama perusahaan yang jelas membuatmu tidak bisa memverifikasi apa pun.", "Without a clear company name, you can't verify anything."),
      kutipan: null,
    });
  }

  const hal_baik = [];
  // Alamat email dibuang dulu: "rekrutmen.pt@gmail.com" bukan situs karier
  const tanpaEmail = semua.replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, " ");
  for (const p of POSITIF) if (p.pola.test(tanpaEmail)) hal_baik.push({ id: p.id, nilai: p.nilai, judul: p.judul });
  const emailResmi = semua.match(EMAIL_PERUSAHAAN);
  if (emailResmi) hal_baik.push({ id: "email", nilai: 8, judul: t(`Email berdomain perusahaan (${emailResmi[0].split("@")[1]})`, `Company email domain (${emailResmi[0].split("@")[1]})`) });

  const risiko = temuan.reduce((n, x) => n + x.berat, 0);
  const pengurang = hal_baik.reduce((n, p) => n + p.nilai, 0);
  // Tanda berat (biaya, OTP, travel) tidak boleh "ditebus" oleh hal baik
  const adaBerat = temuan.some((x) => x.berat >= 35);
  const skor = Math.max(0, Math.min(100, adaBerat ? risiko : risiko - pengurang));

  const level = skor >= 40 ? "bahaya" : skor >= 15 ? "waspada" : "aman";
  temuan.sort((a, b) => b.berat - a.berat);
  return { skor, level, temuan, hal_baik, cukupTeks: teks.trim().length >= 40 };
}

export const LABEL_LEVEL = {
  aman: { label: t("Tidak ada tanda bahaya", "No warning signs"), ringkas: t("Aman", "Safe") },
  waspada: { label: t("Perlu diwaspadai", "Be careful"), ringkas: t("Waspada", "Caution") },
  bahaya: { label: t("Banyak tanda penipuan", "Many scam signs"), ringkas: t("Bahaya", "Danger") },
};

/** Langkah verifikasi yang selalu berlaku, apa pun hasilnya. */
export const LANGKAH_VERIFIKASI = [
  t("Cari nama perusahaan + 'penipuan' atau 'scam' di Google dan media sosial.", "Search the company name plus 'scam' on Google and social media."),
  t("Cocokkan lowongan dengan halaman karier atau akun LinkedIn resmi perusahaan.", "Match the job with the company's official careers page or LinkedIn account."),
  t("Periksa alamat email pengirim. Domainnya harus sama dengan situs resmi perusahaan.", "Check the sender's email. The domain should match the company's official site."),
  t("Jangan transfer uang dan jangan bagikan OTP, PIN, atau foto kartu ATM.", "Never transfer money or share an OTP, PIN, or photo of your ATM card."),
  t("Laporkan nomor penipu ke cekrekening.id dan aduannomor.id (Kominfo).", "Report scam numbers to cekrekening.id and aduannomor.id (Kominfo)."),
];
