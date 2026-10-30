// Logika bot Telegram admin. Tidak bergantung pada Deno atau Supabase, jadi bisa diuji dengan vitest.
// Semua aksi ke database dilewatkan lewat objek `deps`.

export type Deps = {
  /** id pengguna untuk email ini, atau null kalau belum terdaftar */
  findUser(email: string): Promise<string | null>;
  /** buat akun baru dengan email terverifikasi dan kode sebagai kata sandi */
  createUser(email: string, code: string): Promise<string>;
  /** ganti kode login (kata sandi) pengguna */
  setCode(userId: string, code: string): Promise<void>;
  /** catat pesanan manual + tambah masa Pro; kembalikan tanggal berakhir (ISO) */
  grantPro(userId: string, days: number, amount: number, note: string): Promise<string>;
  /** hentikan akses Pro sekarang; kembalikan jumlah langganan yang dihentikan */
  revokePro(userId: string): Promise<number>;
  /** tanggal berakhir Pro (ISO) atau null */
  proUntil(userId: string): Promise<string | null>;
  /** kode acak baru */
  newCode(): string;
  /** link khusus Pro (latihan tambahan, grup Telegram) */
  listLinks(): Promise<ProLink[]>;
  setLink(link: ProLink): Promise<void>;
  /** hapus link; true kalau ada yang terhapus */
  delLink(key: string): Promise<boolean>;
  /** nama terkunci di sertifikat/portofolio (null kalau belum diisi) */
  certName(userId: string): Promise<string | null>;
  /** ganti nama sertifikat oleh admin; sertifikat yang sudah terbit ikut diperbarui */
  setCertName(userId: string, name: string, by: string): Promise<string>;
  /** akun uji coba: syarat ujian dilewati */
  bypass(userId: string): Promise<boolean>;
  /** akun Pro yang masih aktif (terbaru dulu), opsional disaring kata kunci email */
  listPro(q: string, limit: number): Promise<{ rows: { email: string; since: string; ends_at: string }[]; total: number }>;
  setBypass(userId: string, on: boolean, by: string): Promise<void>;
  /** kode referal */
  getRef(code: string): Promise<Referrer | null>;
  /** kode referal yang dicatat situs untuk email ini saat pembeli menekan "Lanjut ke WhatsApp" */
  claimedRef(email: string): Promise<string | null>;
  saveRef(r: Referrer, by: string): Promise<void>;
  listRefs(): Promise<RefSummary[]>;
  refHistory(code: string, limit: number): Promise<RefRow[]>;
  /** catat pembelian lewat referal; false kalau pembeli ini sudah pernah tercatat */
  addReferral(x: { code: string; userId: string; email: string; amount: number; commission: number; by: string }): Promise<boolean>;
  /** tandai semua komisi yang belum dibayar sebagai sudah dibayar */
  payRef(code: string): Promise<{ n: number; total: number }>;
};
export type Referrer = { code: string; name: string; commission: number; discount: number; active: boolean };
export type RefSummary = Referrer & { sales: number; earned: number; unpaid: number };
export type RefRow = { email: string; amount: number; commission: number; paid: boolean; created_at: string };
export type ProLink = { key: string; title: string; url: string };

/** Pro lifetime = 36.500 hari (±100 tahun). Tanggal berakhir ≥ 2100 ditampilkan sebagai "selamanya". */
export const LIFETIME_DAYS = 36500;
export const isLifetime = (iso: string | null) => !!iso && new Date(iso).getUTCFullYear() >= 2100;
const KEY_RE = /^[a-z0-9_-]{1,32}$/;
/** Hanya https, tanpa spasi, maksimal 500 karakter. */
export function validUrl(u: string) {
  if (u.length > 500 || /\s/.test(u)) return false;
  try { const x = new URL(u); return x.protocol === 'https:' && !!x.hostname.includes('.'); } catch { return false; }
}

export type Ctx = { appUrl: string; price: number; adminName: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // tanpa 0/O, 1/I/L

/** Kode 8 karakter berformat XXXX-XXXX. `rand` mengembalikan byte acak (crypto). */
export function makeCode(rand: (n: number) => Uint8Array): string {
  const out: string[] = [];
  while (out.length < 8) {
    for (const b of rand(16)) {
      if (b >= 248) continue; // 248 = 31 × 8, hindari bias modulo
      out.push(ALPHABET[b % ALPHABET.length]);
      if (out.length === 8) break;
    }
  }
  return out.slice(0, 4).join('') + '-' + out.slice(4).join('');
}

/** Samakan kode yang diketik pembeli: huruf besar, tanpa spasi, tanda hubung di tengah. */
export function normalizeCode(input: string): string {
  const s = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return s.length === 8 ? s.slice(0, 4) + '-' + s.slice(4) : input.trim().toUpperCase();
}

export const esc = (s: string) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as Record<string, string>)[c]);
const tglPendek = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit', timeZone: 'Asia/Jakarta' });
const tgl = (iso: string) => isLifetime(iso) ? 'selamanya' : new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });
const rp = (n: number) => 'Rp' + n.toLocaleString('id-ID');

/** Samakan kode referal: huruf besar dan angka saja. */
export const normRef = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
const REF_RE = /^[A-Z0-9]{3,16}$/;
/** Ambil token ref:KODE / ref=KODE / #KODE dari pesan, kembalikan sisa bagian dan kodenya. */
export function takeRef(parts: string[]): { rest: string[]; ref: string | null; noref: boolean } {
  let ref: string | null = null, noref = false;
  const rest = parts.filter(p => { if (/^(noref|tanpa-?ref)$/i.test(p)) { noref = true; return false; } const m = /^(?:ref[:=]|#)(.+)$/i.exec(p); if (m) { ref = normRef(m[1]); return false; } return true; });
  return { rest, ref, noref };
}

export const HELP = [
  '<b>Perintah admin Jagoan Excel</b>',
  '',
  '<code>/daftar</code> · <code>/daftar gmail</code>',
  'Lihat akun Pro yang aktif (30 terbaru), bisa disaring dengan potongan email. Kode login tidak bisa dilihat; buat kode baru dengan /kode.',
  '',
  '<code>/aktivasi email@pembeli.com</code>',
  'Aktifkan Pro <b>lifetime</b> dan buat kode login. Akun dibuat otomatis kalau belum ada.',
  '',
  '<code>/aktivasi email@pembeli.com 30 0</code>',
  'Opsional: jumlah hari (misalnya 30 untuk uji coba), lalu nominal yang dibayar (0 = gratis/hadiah).',
  '',
  '<code>/aktivasi email@pembeli.com ref:ANDI</code>',
  'Kode referal yang diisi pembeli di situs <b>terbaca otomatis</b> walaupun barisnya dihapus dari pesan WhatsApp. Tulis ref:KODE hanya untuk menambah/mengganti kode secara manual, atau <code>noref</code> untuk mengabaikannya. Nominal otomatis dipotong diskon kode itu, dan komisinya dicatat.',
  '',
  '<code>/kode email@pembeli.com</code>',
  'Buat kode login baru (misalnya pembeli lupa kode). Kode lama tidak berlaku lagi.',
  '',
  '<code>/cek email@pembeli.com</code>',
  'Lihat status Pro.',
  '',
  '<code>/cabut email@pembeli.com</code>',
  'Hentikan akses Pro sekarang (misalnya refund).',
  '',
  '<b>Link khusus Pro</b> (tampil di menu Latihan Pro, hanya untuk akun Pro)',
  '<code>/link</code> lihat semua link',
  '<code>/link latihan https://contoh.com/latihan Latihan Excel 1000+ soal</code>',
  '<code>/link grup https://t.me/+abcdef Grup Telegram Pro</code>',
  'Format: /link nama-singkat url judul. Nama yang sama akan ditimpa.',
  '<code>/hapuslink latihan</code> hapus link',
  '',
  '<b>Nama di sertifikat</b> (peserta hanya bisa mengisi sekali)',
  '<code>/nama email@pembeli.com</code> lihat nama yang terkunci',
  '<code>/nama email@pembeli.com Nama Lengkap Baru</code> ganti nama (setelah alasan peserta dicek)',
  '',
  '<b>Kode referal</b>',
  '<code>/reff</code> semua kode + jumlah penjualan dan komisi',
  '<code>/reff ANDI</code> riwayat pembelian lewat kode ANDI',
  '<code>/reff tambah ANDI 5000 Andi Saputra</code> buat kode, komisi Rp5.000 per pembelian',
  '<code>/reff komisi ANDI 7000</code> · <code>/reff diskon ANDI 2000</code> ubah komisi / diskon untuk pembeli',
  '<code>/reff bayar ANDI</code> tandai komisi sudah ditransfer',
  '<code>/reff off ANDI</code> · <code>/reff on ANDI</code> nonaktifkan / aktifkan lagi',
  'Link untuk dibagikan: situs + <code>?ref=ANDI</code>, kodenya otomatis terisi saat beli.',
  '',
  '<b>Akun uji coba ujian</b> (lewati syarat materi, 1.000 soal, urutan tingkat, batas 3x sehari; boleh ambil sertifikat uji coba)',
  '<code>/bypass email@kamu.com</code> aktifkan · <code>/bypass email@kamu.com off</code> matikan',
].join('\n');

function buyerMessage(ctx: Ctx, email: string, code: string, until?: string) {
  return [
    until ? (isLifetime(until) ? 'Terima kasih! Akses Jagoan Excel Pro kamu sudah aktif lifetime.' : `Terima kasih! Akses Jagoan Excel Pro kamu sudah aktif sampai ${tgl(until)}.`) : 'Ini kode login Jagoan Excel kamu yang baru.',
    '',
    `Masuk di: ${ctx.appUrl}/masuk`,
    `Email: ${email}`,
    `Kode: ${code}`,
    '',
    'Simpan kode ini, dipakai setiap kali masuk. Jangan bagikan ke orang lain.',
    ...(until ? ['', `Link latihan tambahan dan grup Telegram Pro ada di menu Latihan Pro: ${ctx.appUrl}/pro`] : []),
  ].join('\n');
}

/** Proses satu pesan teks dari admin; kembalikan balasan (HTML Telegram). */
export async function handleCommand(text: string, deps: Deps, ctx: Ctx): Promise<string> {
  const { rest: parts, ref, noref } = takeRef(text.trim().split(/\s+/));
  const cmd = (parts[0] || '').toLowerCase().replace(/@.*$/, ''); // /aktivasi@NamaBot → /aktivasi
  const email = (parts[1] || '').toLowerCase();

  if (cmd === '/start' || cmd === '/help' || cmd === '/bantuan') return HELP;
  if (cmd === '/link' || cmd === '/hapuslink') return linkCommand(cmd, parts, deps);
  if (cmd === '/reff' || cmd === '/ref' || cmd === '/referal') return refCommand(parts, deps, ctx);
  if (ref && cmd !== '/aktivasi') return 'Kode referal hanya dipakai di <code>/aktivasi</code>.';
  if (cmd === '/daftar') {
    const q = (parts[1] || '').toLowerCase().slice(0, 60);
    const { rows, total } = await deps.listPro(q, 30);
    if (!rows.length) return q ? `Tidak ada akun Pro aktif yang emailnya memuat <b>${esc(q)}</b>.` : 'Belum ada akun Pro yang aktif.';
    return [
      `<b>${total} akun Pro aktif</b>${q ? ` cocok dengan "${esc(q)}"` : ''}${total > rows.length ? ` (menampilkan ${rows.length} terbaru)` : ''}`,
      '',
      ...rows.map((r, i) => `${i + 1}. <code>${esc(r.email)}</code> · sejak ${tglPendek(r.since)}${isLifetime(r.ends_at) ? '' : ` · s.d. ${tglPendek(r.ends_at)}`}`),
      '',
      'Kode login tidak tersimpan dalam bentuk yang bisa dibaca. Pembeli lupa kode? Kirim <code>/kode email</code> untuk membuat kode baru.',
    ].join('\n');
  }
  if (!['/aktivasi', '/kode', '/cek', '/cabut', '/nama', '/bypass'].includes(cmd)) return 'Perintah tidak dikenal.\n\n' + HELP;
  if (!EMAIL_RE.test(email)) return `Tulis email pembeli setelah perintah, misalnya:\n<code>${cmd} nama@gmail.com</code>`;

  if (cmd === '/aktivasi') {
    const life = !parts[2] || /^(selamanya|lifetime|seumur)/i.test(parts[2]);
    const days = life ? LIFETIME_DAYS : Number(parts[2]);
    let referrer: Referrer | null = null, fromSite = false, siteNote = '';
    if (!ref && !noref) {
      const c = await deps.claimedRef(email);
      if (c) {
        const r = await deps.getRef(c);
        if (r?.active) { referrer = r; fromSite = true; }
        else siteNote = `Pembeli sempat memakai kode <b>${esc(c)}</b>, tapi kodenya sudah nonaktif, jadi tidak dicatat.`;
      }
    }
    if (ref) {
      referrer = REF_RE.test(ref) ? await deps.getRef(ref) : null;
      if (!referrer) return `Kode referal <b>${esc(ref)}</b> tidak ada. Cek dengan <code>/reff</code>, atau aktivasi tanpa kode.`;
      if (!referrer.active) return `Kode referal <b>${esc(ref)}</b> sedang nonaktif. Aktifkan dengan <code>/reff on ${esc(ref)}</code>, atau aktivasi tanpa kode.`;
    }
    const amount = parts[3] != null ? Number(parts[3]) : Math.max(0, ctx.price - (referrer?.discount ?? 0));
    if (!life && (!Number.isInteger(days) || days < 1 || days > 3650)) return 'Jumlah hari harus bilangan bulat 1–3650, atau kosongkan untuk Pro lifetime.';
    if (!Number.isInteger(amount) || amount < 0 || amount > 100_000_000) return 'Nominal harus bilangan bulat 0 sampai 100.000.000.';
    const code = deps.newCode();
    let uid = await deps.findUser(email);
    const isNew = !uid;
    if (!uid) uid = await deps.createUser(email, code);
    // Sudah Pro lifetime: cukup buat kode baru, tidak perlu mencatat pesanan lagi.
    const before = isNew ? null : await deps.proUntil(uid);
    if (isLifetime(before) && Date.parse(before!) > Date.now()) {
      await deps.setCode(uid, code);
      return [`<b>${esc(email)}</b> sudah Pro lifetime. Tidak ada pesanan baru yang dicatat.`, '', `Kode login baru: <code>${code}</code>`, '', 'Pesan untuk pembeli:', `<pre>${esc(buyerMessage(ctx, email, code))}</pre>`].join('\n');
    }
    // Catat Pro dulu; kode lama baru diganti setelah Pro berhasil, supaya pembeli tidak terkunci kalau langkah ini gagal.
    const until = await deps.grantPro(uid, days, amount, `Telegram: ${ctx.adminName}${referrer ? ' · ref ' + referrer.code : ''}`);
    if (!isNew) await deps.setCode(uid, code);
    let refLine = siteNote;
    if (referrer) {
      const commission = amount > 0 ? referrer.commission : 0;
      const ok = await deps.addReferral({ code: referrer.code, userId: uid, email, amount, commission, by: ctx.adminName });
      refLine = ok ? `Referal <b>${esc(referrer.code)}</b> (${esc(referrer.name)})${fromSite ? ' · terbaca otomatis dari situs' : ''} · komisi ${rp(commission)} dicatat.` : `Pembeli ini sudah pernah tercatat sebagai referal, komisi tidak dicatat dua kali.`;
    }
    return [
      `Pro aktif untuk <b>${esc(email)}</b> ${isLifetime(until) ? '<b>lifetime</b>' : `sampai <b>${tgl(until)}</b>`}${isNew ? ' (akun baru)' : ''}.`,
      `Nominal tercatat: ${rp(amount)} · ${life ? 'lifetime' : days + ' hari'}`,
      ...(refLine ? [refLine] : []),
      '',
      `Kode login: <code>${code}</code>`,
      '',
      'Pesan untuk pembeli (tekan untuk menyalin):',
      `<pre>${esc(buyerMessage(ctx, email, code, until))}</pre>`,
    ].join('\n');
  }

  const uid = await deps.findUser(email);
  if (!uid) return `Email <b>${esc(email)}</b> belum terdaftar. Gunakan <code>/aktivasi ${esc(email)}</code> setelah pembayaran diterima.`;

  if (cmd === '/bypass') {
    const off = /^(off|mati|hapus|0)$/i.test(parts[2] || '');
    if (parts[2] && !off && !/^(on|aktif|1)$/i.test(parts[2])) return 'Format: <code>/bypass email</code> atau <code>/bypass email off</code>';
    await deps.setBypass(uid, !off, ctx.adminName);
    return off ? `Bypass ujian untuk <b>${esc(email)}</b> dimatikan. Syarat normal berlaku lagi dan sertifikat uji coba dihapus.`
      : `Bypass ujian aktif untuk <b>${esc(email)}</b>: semua tingkat ujian bisa langsung dicoba tanpa syarat materi/soal dan tanpa batas harian. Sertifikat yang diambil tanpa lulus ujian ditandai <i>uji coba</i> di halaman verifikasi.`;
  }
  if (cmd === '/nama') {
    const baru = parts.slice(2).join(' ').replace(/\s+/g, ' ').trim();
    if (!baru) {
      const n = await deps.certName(uid);
      return n ? `Nama sertifikat <b>${esc(email)}</b>: <b>${esc(n)}</b>` : `<b>${esc(email)}</b> belum mengisi nama sertifikat.`;
    }
    if (baru.length < 2 || baru.length > 60 || !/^\p{L}[\p{L} .,'-]*$/u.test(baru)) return 'Nama harus 2–60 karakter dan hanya berisi huruf, spasi, titik, koma, apostrof, atau tanda hubung.';
    const lama = await deps.certName(uid);
    const n = await deps.setCertName(uid, baru, ctx.adminName);
    return `Nama sertifikat <b>${esc(email)}</b> diganti${lama ? ` dari <b>${esc(lama)}</b>` : ''} menjadi <b>${esc(n)}</b>. Sertifikat yang sudah terbit ikut diperbarui.`;
  }
  if (cmd === '/kode') {
    const code = deps.newCode();
    await deps.setCode(uid, code);
    return [`Kode login baru untuk <b>${esc(email)}</b>: <code>${code}</code>`, 'Kode lama sudah tidak berlaku.', '', 'Pesan untuk pembeli:', `<pre>${esc(buyerMessage(ctx, email, code))}</pre>`].join('\n');
  }
  if (cmd === '/cek') {
    const until = await deps.proUntil(uid);
    const active = until && Date.parse(until) > Date.now();
    return active ? `<b>${esc(email)}</b>: Pro aktif ${isLifetime(until) ? 'lifetime' : 'sampai ' + tgl(until!)}.`
      : until ? `<b>${esc(email)}</b>: Pro sudah berakhir ${tgl(until)}.` : `<b>${esc(email)}</b>: terdaftar, belum pernah Pro.`;
  }
  // /cabut
  const n = await deps.revokePro(uid);
  return n ? `Akses Pro <b>${esc(email)}</b> dihentikan sekarang.` : `<b>${esc(email)}</b> tidak sedang Pro.`;
}

async function linkCommand(cmd: string, parts: string[], deps: Deps): Promise<string> {
  const key = (parts[1] || '').toLowerCase();
  if (cmd === '/hapuslink') {
    if (!KEY_RE.test(key)) return 'Tulis nama link yang mau dihapus, misalnya:\n<code>/hapuslink latihan</code>';
    return (await deps.delLink(key)) ? `Link <b>${esc(key)}</b> dihapus.` : `Link <b>${esc(key)}</b> tidak ditemukan.`;
  }
  if (!key) {
    const xs = await deps.listLinks();
    if (!xs.length) return 'Belum ada link Pro.\n\nContoh:\n<code>/link latihan https://contoh.com/latihan Latihan Excel 1000+ soal</code>';
    return ['<b>Link khusus Pro</b>', ...xs.map(x => `• <code>${esc(x.key)}</code> ${esc(x.title)}\n  ${esc(x.url)}`)].join('\n');
  }
  const url = parts[2] || '';
  if (!KEY_RE.test(key)) return 'Nama link hanya huruf kecil, angka, - atau _, maksimal 32 karakter. Contoh: <code>latihan</code>, <code>grup</code>.';
  if (!validUrl(url)) return 'URL harus diawali https:// dan tanpa spasi. Contoh:\n<code>/link latihan https://contoh.com/latihan Latihan Excel</code>';
  const title = parts.slice(3).join(' ').trim().slice(0, 80) || (key === 'grup' ? 'Grup Telegram Pro' : key);
  await deps.setLink({ key, title, url });
  return `Link <b>${esc(key)}</b> disimpan: ${esc(title)}\n${esc(url)}\n\nSekarang tampil di menu Latihan Pro untuk semua akun Pro.`;
}

async function refCommand(parts: string[], deps: Deps, ctx: Ctx): Promise<string> {
  const sub = (parts[1] || '').toLowerCase();
  const actions = ['tambah', 'baru', 'komisi', 'diskon', 'bayar', 'off', 'on', 'nonaktif', 'aktif'];
  if (!sub) {
    const xs = await deps.listRefs();
    if (!xs.length) return 'Belum ada kode referal.\n\nBuat dengan:\n<code>/reff tambah ANDI 5000 Andi Saputra</code>';
    const unpaid = xs.reduce((a, x) => a + x.unpaid, 0);
    return [
      `<b>${xs.length} kode referal</b> · komisi belum dibayar ${rp(unpaid)}`, '',
      ...xs.map(x => `${x.active ? '[aktif]' : '[nonaktif]'} <code>${esc(x.code)}</code> ${esc(x.name)} · ${x.sales} penjualan · komisi ${rp(x.earned)}${x.unpaid ? ` · <b>belum dibayar ${rp(x.unpaid)}</b>` : ''}`),
      '', 'Detail: <code>/reff KODE</code>',
    ].join('\n');
  }
  if (!actions.includes(sub)) {
    const code = normRef(parts[1]);
    const r = await deps.getRef(code);
    if (!r) return `Kode <b>${esc(code)}</b> tidak ada.`;
    const rows = await deps.refHistory(code, 30);
    const earned = rows.reduce((a, x) => a + x.commission, 0), unpaid = rows.filter(x => !x.paid).reduce((a, x) => a + x.commission, 0);
    return [
      `${r.active ? '[aktif]' : '[nonaktif]'} <b>${esc(r.code)}</b> · ${esc(r.name)}`,
      `Komisi ${rp(r.commission)} per pembelian · diskon pembeli ${rp(r.discount)}`,
      `Link: ${ctx.appUrl}/?ref=${r.code}`, '',
      rows.length ? `<b>${rows.length} pembelian terakhir</b> (komisi ${rp(earned)}, belum dibayar ${rp(unpaid)})` : 'Belum ada pembelian lewat kode ini.',
      ...rows.map((x, i) => `${i + 1}. ${tglPendek(x.created_at)} · <code>${esc(x.email)}</code> · ${rp(x.amount)} · komisi ${rp(x.commission)} ${x.paid ? '(sudah dibayar)' : '(belum dibayar)'}`),
      ...(unpaid ? ['', `Sudah ditransfer? <code>/reff bayar ${esc(r.code)}</code>`] : []),
    ].join('\n');
  }
  const code = normRef(parts[2] || '');
  if (!REF_RE.test(code)) return `Tulis kodenya (3–16 huruf/angka), misalnya:\n<code>/reff ${sub} ANDI${sub === 'tambah' || sub === 'baru' ? ' 5000 Andi Saputra' : sub === 'komisi' || sub === 'diskon' ? ' 5000' : ''}</code>`;
  const cur = await deps.getRef(code);
  if (sub === 'tambah' || sub === 'baru') {
    if (cur) return `Kode <b>${esc(code)}</b> sudah ada (${esc(cur.name)}). Ubah komisinya dengan <code>/reff komisi ${esc(code)} 7000</code>.`;
    const commission = Number(parts[3]);
    if (!Number.isInteger(commission) || commission < 0 || commission > ctx.price) return `Komisi harus bilangan bulat 0 sampai ${rp(ctx.price)}. Contoh:\n<code>/reff tambah ${esc(code)} 5000 Nama Pemilik</code>`;
    const name = parts.slice(4).join(' ').trim().slice(0, 60) || code;
    await deps.saveRef({ code, name, commission, discount: 0, active: true }, ctx.adminName);
    return [`Kode referal <b>${esc(code)}</b> dibuat untuk ${esc(name)}. Komisi ${rp(commission)} per pembelian.`, '', 'Link untuk dibagikan:', `<code>${ctx.appUrl}/?ref=${code}</code>`, '', `Mau beri diskon untuk pembeli? <code>/reff diskon ${esc(code)} 2000</code>`].join('\n');
  }
  if (!cur) return `Kode <b>${esc(code)}</b> tidak ada. Buat dulu dengan <code>/reff tambah ${esc(code)} 5000 Nama</code>.`;
  if (sub === 'komisi' || sub === 'diskon') {
    const v = Number(parts[3]);
    if (!Number.isInteger(v) || v < 0 || v > ctx.price) return `Nilai harus bilangan bulat 0 sampai ${rp(ctx.price)}.`;
    await deps.saveRef({ ...cur, [sub === 'komisi' ? 'commission' : 'discount']: v }, ctx.adminName);
    return sub === 'komisi' ? `Komisi <b>${esc(code)}</b> sekarang ${rp(v)} per pembelian (berlaku untuk pembelian berikutnya).`
      : `Diskon kode <b>${esc(code)}</b> sekarang ${rp(v)}. Pembeli membayar ${rp(Math.max(0, ctx.price - v))}.`;
  }
  if (sub === 'bayar') {
    const { n, total } = await deps.payRef(code);
    return n ? `${n} komisi <b>${esc(code)}</b> (${esc(cur.name)}) ditandai sudah dibayar · total ${rp(total)}.` : `Tidak ada komisi <b>${esc(code)}</b> yang belum dibayar.`;
  }
  const on = sub === 'on' || sub === 'aktif';
  await deps.saveRef({ ...cur, active: on }, ctx.adminName);
  return on ? `Kode <b>${esc(code)}</b> aktif lagi.` : `Kode <b>${esc(code)}</b> dinonaktifkan. Riwayatnya tetap tersimpan.`;
}
