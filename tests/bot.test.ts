import { describe, it, expect, beforeEach } from 'vitest';
import { handleCommand, makeCode, normalizeCode, type Deps } from '../supabase/functions/_shared/bot';
import { normalizeCode as clientNormalize } from '../src/lib/auth';
import { randomBytes } from 'node:crypto';

const ctx = { appUrl: 'https://jagoanexcel.id', price: 39000, adminName: '@admin' };

function fakeDb() {
  const users = new Map<string, { id: string; code: string }>();
  const subs: { user: string; ends: number }[] = [];
  const log: string[] = [];
  const links = new Map<string, { key: string; title: string; url: string }>();
  const byp = new Set<string>();
  const names = new Map<string, string>();
  const refs = new Map<string, { code: string; name: string; commission: number; discount: number; active: boolean }>();
  const claims = new Map<string, string>();
  const refRows: { code: string; userId: string; email: string; amount: number; commission: number; paid: boolean }[] = [];
  let n = 0, codeN = 0;
  const deps: Deps = {
    async findUser(email) { return users.get(email)?.id ?? null; },
    async createUser(email, code) { const id = 'u' + ++n; users.set(email, { id, code }); log.push('create ' + email); return id; },
    async setCode(id, code) { for (const u of users.values()) if (u.id === id) u.code = code; log.push('setCode ' + id); },
    async grantPro(id, days, amount) {
      const cur = Math.max(Date.now(), ...subs.filter(s => s.user === id).map(s => s.ends));
      const ends = cur + days * 864e5; subs.push({ user: id, ends }); log.push(`grant ${id} ${days} ${amount}`);
      return new Date(ends).toISOString();
    },
    async revokePro(id) { let k = 0; for (const s of subs) if (s.user === id && s.ends > Date.now()) { s.ends = Date.now() - 1; k++; } return k; },
    async proUntil(id) { const e = subs.filter(s => s.user === id).map(s => s.ends); return e.length ? new Date(Math.max(...e)).toISOString() : null; },
    newCode: () => ['ABCD-EFGH', 'JKMN-PQRS', 'TUVW-XYZ2'][codeN++ % 3],
    async listLinks() { return [...links.values()]; },
    async setLink(l) { links.set(l.key, l); },
    async delLink(k) { return links.delete(k); },
    async certName(id) { return names.get(id) ?? null; },
    async setCertName(id, n) { names.set(id, n); return n; },
    async bypass(id) { return byp.has(id); },
    async listPro(q) {
      const rows = [...users.entries()].filter(([e, u]) => (!q || e.includes(q)) && subs.some(x => x.user === u.id && x.ends > Date.now()))
        .map(([email, u]) => ({ email, since: new Date().toISOString(), ends_at: new Date(Math.max(...subs.filter(x => x.user === u.id).map(x => x.ends))).toISOString() }));
      return { rows, total: rows.length };
    },
    async setBypass(id, on) { if (on) byp.add(id); else byp.delete(id); },
    async getRef(c) { return refs.get(c) ?? null; },
    async claimedRef(e) { return claims.get(e) ?? null; },
    async saveRef(r) { refs.set(r.code, { ...r }); },
    async listRefs() { return [...refs.values()].map(r => { const m = refRows.filter(x => x.code === r.code); return { ...r, sales: m.length, earned: m.reduce((a, x) => a + x.commission, 0), unpaid: m.filter(x => !x.paid).reduce((a, x) => a + x.commission, 0) }; }); },
    async refHistory(c) { return refRows.filter(x => x.code === c).map(x => ({ ...x, created_at: new Date().toISOString() })); },
    async addReferral(x) { if (refRows.some(y => y.userId === x.userId)) return false; refRows.push({ ...x, paid: false }); return true; },
    async payRef(c) { const m = refRows.filter(x => x.code === c && !x.paid); m.forEach(x => (x.paid = true)); return { n: m.length, total: m.reduce((a, x) => a + x.commission, 0) }; },
  };
  return { deps, users, subs, log, links, byp, refs, refRows, claims };
}

describe('kode login', () => {
  it('format XXXX-XXXX tanpa huruf yang mirip', () => {
    for (let i = 0; i < 500; i++) {
      const c = makeCode(n => new Uint8Array(randomBytes(n)));
      expect(c).toMatch(/^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/);
    }
  });
  it('normalisasi kode sama di bot dan aplikasi', () => {
    for (const s of ['abcd-efgh', 'ABCDEFGH', ' abcd efgh ', 'abcd–efgh'])
      expect(normalizeCode(s)).toBe('ABCD-EFGH');
    expect(clientNormalize('abcd efgh')).toBe(normalizeCode('abcd efgh'));
  });
});

describe('perintah bot', () => {
  let db: ReturnType<typeof fakeDb>;
  beforeEach(() => { db = fakeDb(); });

  it('/aktivasi membuat akun baru, Pro lifetime, dan kode', async () => {
    const out = await handleCommand('/aktivasi Rina@Gmail.com', db.deps, ctx);
    expect(db.users.get('rina@gmail.com')?.code).toBe('ABCD-EFGH');
    expect(db.log).toContain('grant u1 36500 39000');
    expect(out).toContain('lifetime');
    expect(out).toContain('akun baru');
    expect(out).toContain('<code>ABCD-EFGH</code>');
    expect(out).toContain('https://jagoanexcel.id/masuk');
  });
  it('/aktivasi akun lama: uji coba 30 hari lalu lifetime', async () => {
    await handleCommand('/aktivasi rina@gmail.com 30 0', db.deps, ctx);
    const out = await handleCommand('/aktivasi rina@gmail.com', db.deps, ctx);
    expect(db.log.filter(l => l.startsWith('create'))).toHaveLength(1);
    expect(db.users.get('rina@gmail.com')?.code).toBe('JKMN-PQRS');
    expect(new Date((await db.deps.proUntil('u1'))!).getUTCFullYear()).toBeGreaterThanOrEqual(2100);
    expect(out).not.toContain('akun baru');
    // sudah lifetime: tidak mencatat pesanan lagi, hanya kode baru
    const again = await handleCommand('/aktivasi rina@gmail.com', db.deps, ctx);
    expect(again).toContain('sudah Pro lifetime');
    expect(db.log.filter(l => l.startsWith('grant'))).toHaveLength(2);
  });
  it('/nama melihat dan mengganti nama sertifikat', async () => {
    await handleCommand('/aktivasi rina@gmail.com', db.deps, ctx);
    expect(await handleCommand('/nama rina@gmail.com', db.deps, ctx)).toContain('belum mengisi');
    expect(await handleCommand('/nama rina@gmail.com R1na <b>', db.deps, ctx)).toContain('hanya berisi huruf');
    expect(await handleCommand('/nama rina@gmail.com   Rina   Wulandari ', db.deps, ctx)).toContain('<b>Rina Wulandari</b>');
    expect(await handleCommand('/nama rina@gmail.com', db.deps, ctx)).toContain('Rina Wulandari');
    expect(await handleCommand('/nama x@y.id Siapa', db.deps, ctx)).toContain('belum terdaftar');
  });
  it('/daftar menampilkan akun Pro aktif tanpa kode', async () => {
    expect(await handleCommand('/daftar', db.deps, ctx)).toContain('Belum ada');
    await handleCommand('/aktivasi rina@gmail.com', db.deps, ctx);
    await handleCommand('/aktivasi budi@yahoo.com 30 0', db.deps, ctx);
    const all = await handleCommand('/daftar', db.deps, ctx);
    expect(all).toContain('2 akun Pro aktif'); expect(all).toContain('rina@gmail.com'); expect(all).toContain('s.d.');
    expect(all).not.toMatch(/[A-Z0-9]{4}-[A-Z0-9]{4}/);
    const g = await handleCommand('/daftar gmail', db.deps, ctx);
    expect(g).toContain('1 akun Pro aktif'); expect(g).not.toContain('budi');
  });
  it('/bypass menyalakan dan mematikan akun uji coba', async () => {
    await handleCommand('/aktivasi eksal@gmail.com', db.deps, ctx);
    expect(await handleCommand('/bypass eksal@gmail.com', db.deps, ctx)).toContain('Bypass ujian aktif');
    expect(db.byp.size).toBe(1);
    expect(await handleCommand('/bypass eksal@gmail.com off', db.deps, ctx)).toContain('dimatikan');
    expect(db.byp.size).toBe(0);
    expect(await handleCommand('/bypass eksal@gmail.com ngaco', db.deps, ctx)).toContain('Format');
  });
  it('/link menyimpan, menampilkan, dan menghapus link Pro', async () => {
    expect(await handleCommand('/link', db.deps, ctx)).toContain('Belum ada link');
    expect(await handleCommand('/link latihan http://x.com', db.deps, ctx)).toContain('https://');
    expect(await handleCommand('/link Bad!Key https://x.com', db.deps, ctx)).toContain('Nama link');
    expect(await handleCommand('/link latihan https://contoh.com/soal Latihan 1000 soal', db.deps, ctx)).toContain('disimpan');
    expect(db.links.get('latihan')).toEqual({ key: 'latihan', title: 'Latihan 1000 soal', url: 'https://contoh.com/soal' });
    await handleCommand('/link grup https://t.me/+abc', db.deps, ctx);
    expect(db.links.get('grup')?.title).toBe('Grup Telegram Pro');
    expect(await handleCommand('/link', db.deps, ctx)).toContain('contoh.com/soal');
    expect(await handleCommand('/hapuslink latihan', db.deps, ctx)).toContain('dihapus');
    expect(db.links.has('latihan')).toBe(false);
  });
  it('/aktivasi dengan hari dan nominal', async () => {
    await handleCommand('/aktivasi a@b.co 30 0', db.deps, ctx);
    expect(db.log).toContain('grant u1 30 0');
  });
  it('menolak input yang salah', async () => {
    expect(await handleCommand('/aktivasi bukan-email', db.deps, ctx)).toContain('Tulis email');
    expect(await handleCommand('/aktivasi a@b.co 0', db.deps, ctx)).toContain('1–3650');
    expect(await handleCommand('/aktivasi a@b.co 30 -5', db.deps, ctx)).toContain('Nominal');
    expect(await handleCommand('/hapus a@b.co', db.deps, ctx)).toContain('tidak dikenal');
    expect(db.log).toEqual([]);
  });
  it('/kode untuk email yang belum terdaftar tidak membuat akun', async () => {
    const out = await handleCommand('/kode x@y.id', db.deps, ctx);
    expect(out).toContain('belum terdaftar');
    expect(db.log).toEqual([]);
  });
  it('/kode, /cek, /cabut', async () => {
    await handleCommand('/aktivasi a@b.co', db.deps, ctx);
    expect(await handleCommand('/kode a@b.co', db.deps, ctx)).toContain('JKMN-PQRS');
    expect(await handleCommand('/cek a@b.co', db.deps, ctx)).toContain('Pro aktif');
    expect(await handleCommand('/cabut a@b.co', db.deps, ctx)).toContain('dihentikan');
    expect(await handleCommand('/cek a@b.co', db.deps, ctx)).toContain('sudah berakhir');
    expect(await handleCommand('/cabut a@b.co', db.deps, ctx)).toContain('tidak sedang Pro');
  });
  it('mendukung /perintah@NamaBot dan /help', async () => {
    await handleCommand('/aktivasi@KelasRumusBot a@b.co', db.deps, ctx);
    expect(db.log[0]).toBe('create a@b.co');
    expect(await handleCommand('/help', db.deps, ctx)).toContain('/aktivasi');
  });
  it('email di-escape di balasan HTML', async () => {
    const out = await handleCommand('/aktivasi <b>@x.co', db.deps, ctx);
    expect(out).not.toContain('<b><b>');
  });
});

describe('kode referal', () => {
  let db: ReturnType<typeof fakeDb>;
  beforeEach(() => { db = fakeDb(); });
  it('buat kode, aktivasi dengan ref, riwayat, dan bayar komisi', async () => {
    expect(await handleCommand('/reff tambah andi 5000 Andi Saputra', db.deps, ctx)).toContain('ANDI');
    expect(db.refs.get('ANDI')).toMatchObject({ name: 'Andi Saputra', commission: 5000, discount: 0, active: true });
    expect(await handleCommand('/reff tambah ANDI 5000', db.deps, ctx)).toContain('sudah ada');
    await handleCommand('/reff diskon ANDI 4000', db.deps, ctx);
    const out = await handleCommand('/aktivasi beli@x.com ref:andi', db.deps, ctx);
    expect(out).toContain('komisi Rp5.000');
    expect(db.log).toContain('grant u1 36500 35000'); // harga 39.000 − diskon 4.000
    expect(db.refRows).toHaveLength(1);
    // pembeli yang sama tidak menghasilkan komisi dua kali
    await handleCommand('/cabut beli@x.com', db.deps, ctx);
    expect(await handleCommand('/aktivasi beli@x.com #ANDI', db.deps, ctx)).toContain('sudah pernah tercatat');
    expect(db.refRows).toHaveLength(1);
    expect(await handleCommand('/reff', db.deps, ctx)).toContain('belum dibayar Rp5.000');
    expect(await handleCommand('/reff ANDI', db.deps, ctx)).toContain('beli@x.com');
    expect(await handleCommand('/reff bayar ANDI', db.deps, ctx)).toContain('Rp5.000');
    expect(db.refRows[0].paid).toBe(true);
  });
  it('kode tidak ada atau nonaktif menolak aktivasi tanpa mengubah apa pun', async () => {
    expect(await handleCommand('/aktivasi a@x.com ref=BUDI', db.deps, ctx)).toContain('tidak ada');
    expect(db.users.size).toBe(0);
    await handleCommand('/reff tambah BUDI 3000', db.deps, ctx);
    await handleCommand('/reff off BUDI', db.deps, ctx);
    expect(await handleCommand('/aktivasi a@x.com ref=BUDI', db.deps, ctx)).toContain('nonaktif');
    expect(db.users.size).toBe(0);
  });
  it('kode dari situs terbaca walaupun tidak ditulis di pesan WhatsApp', async () => {
    await handleCommand('/reff tambah DEWI 5000 Dewi', db.deps, ctx);
    db.claims.set('d@x.com', 'DEWI');
    expect(await handleCommand('/aktivasi d@x.com', db.deps, ctx)).toContain('terbaca otomatis');
    expect(db.refRows[0]).toMatchObject({ code: 'DEWI', email: 'd@x.com', commission: 5000 });
    db.claims.set('e@x.com', 'DEWI');
    await handleCommand('/aktivasi e@x.com noref', db.deps, ctx);
    expect(db.refRows).toHaveLength(1);
    db.claims.set('f@x.com', 'DEWI'); await handleCommand('/reff off DEWI', db.deps, ctx);
    expect(await handleCommand('/aktivasi f@x.com', db.deps, ctx)).toContain('nonaktif');
    expect(db.refRows).toHaveLength(1);
  });
  it('pesanan gratis tidak menghasilkan komisi, nominal manual tetap dipakai', async () => {
    await handleCommand('/reff tambah CITRA 5000', db.deps, ctx);
    await handleCommand('/aktivasi c@x.com 30 0 ref:CITRA', db.deps, ctx);
    expect(db.refRows[0]).toMatchObject({ amount: 0, commission: 0 });
  });
});
