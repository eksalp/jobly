// Bot Telegram mode coba (tanpa Supabase).
// Menjalankan perintah bot yang sama persis dengan versi online, tapi data akun disimpan di memori
// dan hilang saat bot dimatikan. Kode yang dibuat di sini BELUM bisa dipakai login di web.
//
// Cara pakai:
//   TELEGRAM_BOT_TOKEN=123456:ABC... npm run bot:lokal
//   TELEGRAM_BOT_TOKEN=123456:ABC... TELEGRAM_ADMIN_IDS=123456789 npm run bot:lokal
import { randomBytes, randomUUID } from 'node:crypto';
import { handleCommand, makeCode, type Deps } from '../supabase/functions/_shared/bot';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
if (!TOKEN) {
  console.error('\nToken bot belum diisi. Jalankan seperti ini:\n  TELEGRAM_BOT_TOKEN=123456:ABC... npm run bot:lokal\n');
  process.exit(1);
}
const ADMINS = (process.env.TELEGRAM_ADMIN_IDS ?? '').split(',').map(s => s.trim()).filter(Boolean);
const PRICE = Number(process.env.PRICE_PRO ?? 29000);
const APP_URL = (process.env.APP_URL ?? 'http://localhost:5173').replace(/\/$/, '');
const API = `https://api.telegram.org/bot${TOKEN}`;

async function tg(method: string, body: Record<string, unknown>) {
  const r = await fetch(`${API}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json() as { ok: boolean; result?: any; description?: string };
  if (!j.ok) throw new Error(`${method}: ${j.description}`);
  return j.result;
}
const reply = (chatId: number, text: string) =>
  tg('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true });

// Penyimpanan di memori, pengganti Supabase
const users = new Map<string, { id: string; code: string }>(); // email → akun
const subs = new Map<string, string>(); // userId → ends_at ISO
const links = new Map<string, { key: string; title: string; url: string }>();
  const byp = new Set<string>();
  const names = new Map<string, string>();
let orderNo = 0;

const deps: Deps = {
  async findUser(email) { return users.get(email)?.id ?? null; },
  async createUser(email, code) { const id = randomUUID(); users.set(email, { id, code }); return id; },
  async setCode(userId, code) { for (const u of users.values()) if (u.id === userId) u.code = code; },
  async grantPro(userId, days, amount, note) {
    const now = Date.now();
    const cur = subs.get(userId);
    const base = cur && Date.parse(cur) > now ? Date.parse(cur) : now;
    const end = new Date(base + days * 86400000).toISOString();
    subs.set(userId, end);
    console.log(`  pesanan TG-LOKAL-${++orderNo}: ${days} hari, Rp${amount}${note ? ', ' + note : ''}`);
    return end;
  },
  async revokePro(userId) {
    const cur = subs.get(userId);
    if (!cur || Date.parse(cur) <= Date.now()) return 0;
    subs.set(userId, new Date().toISOString());
    return 1;
  },
  async proUntil(userId) { return subs.get(userId) ?? null; },
  newCode: () => makeCode(n => new Uint8Array(randomBytes(n))),
  async listLinks() { return [...links.values()]; },
  async setLink(l) { links.set(l.key, l); },
  async delLink(k) { return links.delete(k); },
  async certName(id) { return names.get(id) ?? null; },
  async setCertName(id, n) { names.set(id, n); return n; },
    async bypass(id) { return byp.has(id); },
    async listPro(q) {
      const rows = [...users.entries()].filter(([e, u]) => (!q || e.includes(q)) && Date.parse(subs.get(u.id) ?? '') > Date.now())
        .map(([email, u]) => ({ email, since: new Date().toISOString(), ends_at: subs.get(u.id)! }));
      return { rows, total: rows.length };
    },
    async setBypass(id, on) { if (on) byp.add(id); else byp.delete(id); },
};

async function main() {
  const me = await tg('getMe', {});
  // Bot baru tidak punya webhook; kalau sudah pernah dipasang, polling tidak akan jalan.
  const info = await tg('getWebhookInfo', {});
  if (info.url) {
    console.error(`\nBot ini masih tersambung ke webhook:\n  ${info.url}\nMode coba memakai polling, jadi webhook harus dilepas dulu. Buka di browser:\n  ${API.replace(TOKEN!, '<TOKEN>')}/deleteWebhook\nlalu jalankan lagi. (Pasang ulang webhook saat pindah ke Supabase.)\n`);
    process.exit(1);
  }
  console.log(`\nBot @${me.username} jalan (mode coba, tanpa Supabase).`);
  console.log(ADMINS.length
    ? `   Admin: ${ADMINS.join(', ')}`
    : '   Admin belum diisi: kirim pesan ke bot untuk melihat ID Telegram kamu.');
  console.log('   Tekan Control + C untuk berhenti.\n');

  let offset = 0;
  for (;;) {
    let updates: any[] = [];
    try {
      updates = await tg('getUpdates', { offset, timeout: 30, allowed_updates: ['message'] });
    } catch (e) {
      console.error('  koneksi ke Telegram gagal, coba lagi 3 detik…', (e as Error).message);
      await new Promise(r => setTimeout(r, 3000));
      continue;
    }
    for (const u of updates) {
      offset = u.update_id + 1;
      const msg = u.message;
      const chatId: number | undefined = msg?.chat?.id;
      const text: string | undefined = msg?.text;
      if (!chatId || !text) continue;
      const fromId = String(msg.from?.id ?? chatId);
      console.log(`← ${msg.from?.username ? '@' + msg.from.username : fromId}: ${text}`);
      try {
        if (!ADMINS.includes(fromId)) {
          await reply(chatId, `Bot ini khusus admin Jagoan Excel.\nID Telegram kamu: <code>${fromId}</code>`
            + (ADMINS.length ? '' : '\n\n(Mode coba) Matikan bot dengan Control + C, lalu jalankan lagi dengan TELEGRAM_ADMIN_IDS=' + fromId));
          console.log(`  bukan admin, ID-nya ${fromId}`);
          continue;
        }
        const out = await handleCommand(text, deps, {
          appUrl: APP_URL, price: PRICE,
          adminName: msg.from?.username ? '@' + msg.from.username : fromId,
        });
        await reply(chatId, '<i>Mode coba: data hilang saat bot dimatikan, kode belum bisa dipakai login.</i>\n\n' + out);
        console.log('  dibalas');
      } catch (e) {
        console.error(e);
        await reply(chatId, 'Gagal: ' + (e instanceof Error ? e.message : String(e))).catch(() => {});
      }
    }
  }
}

main().catch(e => { console.error('\nGagal:', e instanceof Error ? e.message : e); process.exit(1); });
