/**
 * Merapikan tense kata kerja pembuka bullet di draft CV/LinkedIn bahasa Inggris.
 *
 * Konvensi CV berbahasa Inggris:
 *   - posisi yang sudah selesai  → past tense   ("Managed", "Led", "Built")
 *   - posisi yang masih berjalan → present tense ("Manage", "Lead", "Build")
 *
 * Model AI sering tidak konsisten, terutama di draft terjemahan. Fungsi ini
 * memperbaiki secara pasti tanpa AI: hanya kata PERTAMA tiap bullet yang
 * diubah, dan hanya kalau kata itu ada di daftar kata kerja CV di bawah.
 * Posisi dengan tanggal akhir yang tidak jelas dibiarkan apa adanya.
 *
 * File JS murni supaya bisa dipakai di edge function (Deno) dan di browser.
 */

// Bentuk dasar kata kerja yang lazim membuka bullet CV.
const DASAR = `act achieve acquire adapt address administer advise advocate align allocate analyze analyse
answer apply appraise approve arrange assemble assess assign assist attain audit author automate
balance boost brief budget build calculate campaign catalog categorize chair champion clarify classify
close coach code collaborate collect communicate compile complete compose compute conceptualize conduct
configure consolidate consult contribute control convert coordinate correspond counsel craft create
curate customize debug decrease define delegate deliver deploy design detect determine develop devise
diagnose digitize direct discover distribute document draft drive edit educate eliminate enable enforce
engage engineer enhance ensure establish estimate evaluate examine execute expand expedite explain explore
facilitate file finalize forecast formulate foster gather generate grow guide handle head help hire
identify implement improve increase influence inform initiate inspect install institute instruct integrate
interpret interview introduce investigate launch lead liaise maintain manage map market measure mediate
mentor merge migrate minimize model moderate monitor motivate negotiate onboard operate optimize orchestrate
organize originate outline oversee partner perform pilot pioneer plan prepare present prioritize process
produce program promote propose prototype provide publish purchase raise rebuild recommend reconcile record
recruit redesign reduce refine register regulate reorganize repair report represent research resolve
restructure revamp review revise rewrite run safeguard schedule screen secure select sell serve service
shape simplify solve source spearhead standardize steer streamline strengthen structure submit summarize
supervise support survey sustain teach test track train transcribe transform translate troubleshoot
update upgrade validate verify write win pay make take hold send meet bring keep find buy speak give
draw undertake spend input set cut enter copy check post upload respond earn save greet`
  .split(/\s+/)
  .filter(Boolean);

const TAK_BERATURAN = {
  build: "built", drive: "drove", grow: "grew", lead: "led", oversee: "oversaw", rebuild: "rebuilt",
  rewrite: "rewrote", run: "ran", sell: "sold", teach: "taught", write: "wrote", win: "won",
  forecast: "forecast", pay: "paid", make: "made", take: "took", hold: "held", send: "sent", meet: "met",
  bring: "brought", keep: "kept", find: "found", buy: "bought", speak: "spoke", give: "gave", draw: "drew",
  undertake: "undertook", spend: "spent", input: "input", set: "set", cut: "cut",
};

// Kata kerja yang konsonan akhirnya digandakan (plan → planned, planning).
const GANDA_PAKSA = { program: "programmed", control: "controlled", submit: "submitted", plan: "planned", map: "mapped" };

// Bentuk -s dan -ing yang sering juga dipakai sebagai kata benda di awal
// bullet ("Reports for ...", "Training sessions for ..."). Bentuk ini tidak
// diubah supaya tidak merusak kalimat yang memang diawali kata benda.
const NOMINA = new Set(`reports records tests plans maps files services programs budgets models partners
pilots surveys interviews designs drafts campaigns chairs champions audits catalogs documents processes
structures schedules screens markets heads forecasts presents controls outlines updates upgrades reviews
supports purchases prototypes registers edits codes mentors coaches sources leads answers balances briefs
closes collects drives guides helps maps produces programs runs sales serves shapes tracks trains wins
training marketing engineering programming planning reporting budgeting recruiting onboarding testing
consulting auditing coaching mentoring publishing modeling networking scheduling sourcing staffing
accounting coding drafting editing writing teaching tracking monitoring mapping
checks posts copies inputs sets cuts holdings findings meetings savings earnings`.split(/\s+/).filter(Boolean));

function bentukLampau(v) {
  if (TAK_BERATURAN[v]) return TAK_BERATURAN[v];
  if (GANDA_PAKSA[v]) return GANDA_PAKSA[v];
  if (v.endsWith("e")) return v + "d";
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + "ied";
  return v + "ed";
}
function bentukS(v) {
  if (/(s|sh|ch|x|z|o)$/.test(v)) return v + "es";
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + "ies";
  return v + "s";
}
function bentukIng(v) {
  if (GANDA_PAKSA[v]) return GANDA_PAKSA[v].replace(/ed$/, "ing");
  if (/ie$/.test(v)) return v.slice(0, -2) + "ying";
  if (/[^e]e$/.test(v)) return v.slice(0, -1) + "ing";
  return v + "ing";
}

// bentuk apa pun (huruf kecil) → { dasar, jenis }
const PETA = new Map();
for (const v of DASAR) {
  const lampau = bentukLampau(v);
  PETA.set(v, { dasar: v, jenis: "dasar" });
  if (!PETA.has(bentukS(v))) PETA.set(bentukS(v), { dasar: v, jenis: "s" });
  if (!PETA.has(bentukIng(v))) PETA.set(bentukIng(v), { dasar: v, jenis: "ing" });
  if (lampau !== v) PETA.set(lampau, { dasar: v, jenis: "lampau" });
}

const BULAN = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, mei: 5, jun: 6, jul: 7, aug: 8, agu: 8, agt: 8, ags: 8,
  sep: 9, oct: 10, okt: 10, nov: 11, dec: 12, des: 12,
};

/**
 * "sekarang" | "lampau" | null (tidak yakin).
 * `kini` bisa diisi untuk pengujian.
 */
export function statusPosisi(akhir, kini = new Date()) {
  const s = String(akhir || "").trim().toLowerCase();
  if (!s) return null;
  if (/present|current|now|ongoing|today|sekarang|saat ini|kini|sampai sekarang/.test(s)) return "sekarang";
  const th = s.match(/\b(19|20)\d{2}\b/);
  if (!th) return null;
  const tahun = Number(th[0]);
  const tahunKini = kini.getFullYear();
  if (tahun < tahunKini) return "lampau";
  if (tahun > tahunKini) return null;
  const bln = s.match(/\b([a-z]{3})[a-z]*\b/);
  const angkaBln = s.match(/\b(0?[1-9]|1[0-2])[/.-](19|20)\d{2}\b/);
  const bulan = bln && BULAN[bln[1]] ? BULAN[bln[1]] : angkaBln ? Number(angkaBln[1]) : null;
  if (!bulan) return null;
  return bulan < kini.getMonth() + 1 ? "lampau" : null;
}

const samakanHuruf = (asli, baru) =>
  asli === asli.toUpperCase() && asli.length > 1
    ? baru.toUpperCase()
    : asli[0] === asli[0].toUpperCase()
      ? baru[0].toUpperCase() + baru.slice(1)
      : baru;

/** Ubah kata kerja pertama satu bullet sesuai status posisinya. */
export function rapikanBullet(teks, status) {
  if (typeof teks !== "string" || !status) return teks;
  const m = teks.match(/^(\s*(?:[-•*]\s*)?)([A-Za-z]+)(.*)$/s);
  if (!m) return teks;
  const [, awal, kata, sisa] = m;
  const info = PETA.get(kata.toLowerCase());
  if (!info) return teks;
  if ((info.jenis === "s" || info.jenis === "ing") && NOMINA.has(kata.toLowerCase())) return teks;
  let baru = null;
  if (status === "lampau" && info.jenis !== "lampau") baru = bentukLampau(info.dasar);
  if (status === "sekarang" && info.jenis !== "dasar") baru = info.dasar;
  if (!baru || baru === kata.toLowerCase()) return teks;
  return awal + samakanHuruf(kata, baru) + sisa;
}

function rapikanDaftar(daftar, kini) {
  if (!Array.isArray(daftar)) return daftar;
  return daftar.map((x) => {
    if (!x || !Array.isArray(x.desc)) return x;
    const status = statusPosisi(x.end, kini);
    if (!status) return x;
    return { ...x, desc: x.desc.map((b) => rapikanBullet(b, status)) };
  });
}

/**
 * Terapkan ke draft CV atau LinkedIn berbahasa Inggris.
 * Bagian yang diperiksa: pengalaman, organisasi, dan relawan.
 */
export function rapikanTensaDraft(draft, kini = new Date()) {
  if (!draft || typeof draft !== "object") return draft;
  const hasil = { ...draft };
  for (const k of ["experiences", "organizations", "volunteers", "volunteering"]) {
    if (Array.isArray(hasil[k])) hasil[k] = rapikanDaftar(hasil[k], kini);
  }
  return hasil;
}
