// POST /functions/v1/telegram-bot
// Webhook bot Telegram untuk admin: aktivasi Pro manual dan pembuatan kode login.
// Keamanan berlapis:
//   1. Header X-Telegram-Bot-Api-Secret-Token harus sama dengan TELEGRAM_WEBHOOK_SECRET.
//   2. Hanya chat id di TELEGRAM_ADMIN_IDS yang perintahnya dijalankan.
import { createClient } from 'npm:@supabase/supabase-js@2.117.3';
import { esc, handleCommand, makeCode, type Deps } from '../_shared/bot.ts';

const env = (k: string) => {
  const v = Deno.env.get(k);
  if (!v) throw new Error(`Secret ${k} belum diset`);
  return v;
};

async function reply(chatId: number, text: string) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${env('TELEGRAM_BOT_TOKEN')}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    if (!res.ok) console.error('sendMessage gagal', res.status, await res.text());
  } catch (e) { console.error('sendMessage gagal', e); }
}

/** Bandingkan rahasia tanpa bocor lewat waktu eksekusi. */
function sameSecret(a: string, b: string) {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  let d = x.length ^ y.length;
  for (let i = 0; i < y.length; i++) d |= (x[i] ?? 0) ^ y[i];
  return d === 0;
}

Deno.serve(async (req) => {
  // Selalu jawab 200 untuk update yang sah, supaya Telegram tidak mengirim ulang perintah yang sama.
  try { return await handle(req); } catch (e) { console.error(e); return new Response('ok'); }
});

async function handle(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('ok');
  const secret = Deno.env.get('TELEGRAM_WEBHOOK_SECRET');
  if (!secret || !sameSecret(req.headers.get('X-Telegram-Bot-Api-Secret-Token') ?? '', secret)) return new Response('forbidden', { status: 403 });
  if (Number(req.headers.get('content-length') ?? 0) > 100_000) return new Response('ok');

  const update = await req.json().catch(() => null);
  const msg = update?.message;
  const chatId: number | undefined = msg?.chat?.id;
  const text: string | undefined = msg?.text;
  if (!chatId || !text) return new Response('ok'); // abaikan stiker, foto, dll.

  // Perintah admin hanya di chat pribadi, supaya kode login tidak terkirim ke grup.
  const fromId = msg.from?.id;
  const admins = env('TELEGRAM_ADMIN_IDS').split(',').map(s => s.trim()).filter(Boolean);
  if (msg.chat?.type !== 'private' || !fromId || !admins.includes(String(fromId))) {
    if (msg.chat?.type === 'private') await reply(chatId, `Bot ini khusus admin Jagoan Excel.\nID Telegram kamu: <code>${fromId ?? chatId}</code>`);
    return new Response('ok');
  }

  const admin = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });

  // Satu update hanya diproses sekali, walaupun Telegram mengirim ulang.
  if (typeof update.update_id === 'number') {
    const { error: dup } = await admin.from('tg_updates').insert({ update_id: update.update_id });
    if (dup?.code === '23505') return new Response('ok'); // sudah pernah diproses
    if (dup) console.error('tg_updates', dup.message); // tabel belum ada: tetap jalan tanpa pencegah duplikat
  }

  const deps: Deps = {
    async findUser(email) {
      const { data, error } = await admin.rpc('user_id_by_email', { p_email: email });
      if (error) throw error;
      return (data as string | null) ?? null;
    },
    async createUser(email, code) {
      const { data, error } = await admin.auth.admin.createUser({ email, password: code, email_confirm: true });
      if (error || !data.user) throw error ?? new Error('Gagal membuat akun');
      return data.user.id;
    },
    async setCode(userId, code) {
      const { error } = await admin.auth.admin.updateUserById(userId, { password: code });
      if (error) throw error;
    },
    async grantPro(userId, days, amount, note) {
      const { data, error } = await admin.rpc('grant_pro_manual', { p_user: userId, p_days: days, p_amount: amount, p_note: note });
      if (error) throw error;
      return data as string;
    },
    async revokePro(userId) {
      const { data, error } = await admin.rpc('revoke_pro', { p_user: userId });
      if (error) throw error;
      return data as number;
    },
    async proUntil(userId) {
      const { data } = await admin.from('subscriptions').select('ends_at').eq('user_id', userId).order('ends_at', { ascending: false }).limit(1).maybeSingle();
      return data?.ends_at ?? null;
    },
    newCode: () => makeCode(n => crypto.getRandomValues(new Uint8Array(n))),
    async listLinks() {
      const { data, error } = await admin.from('pro_links').select('key, title, url').order('sort').order('key');
      if (error) throw error;
      return data ?? [];
    },
    async setLink(l) {
      const { error } = await admin.from('pro_links').upsert({ ...l, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    async certName(userId) {
      const { data, error } = await admin.from('cert_names').select('name').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return data?.name ?? null;
    },
    async setCertName(userId, name, by) {
      const { data, error } = await admin.rpc('admin_set_cert_name', { p_user: userId, p_name: name, p_by: by });
      if (error) throw error;
      return data as string;
    },
    async listPro(q, limit) {
      const { data, error } = await admin.rpc('admin_list_pro', { p_q: q || null, p_limit: limit });
      if (error) throw error;
      const rows = (data ?? []) as { email: string; since: string; ends_at: string; total: number }[];
      return { rows, total: Number(rows[0]?.total ?? 0) };
    },
    async bypass(userId) {
      const { data, error } = await admin.from('cert_bypass').select('user_id').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return !!data;
    },
    async setBypass(userId, on, by) {
      const { error } = on
        ? await admin.from('cert_bypass').upsert({ user_id: userId, note: `Telegram: ${by}`.slice(0, 80) })
        : await admin.from('cert_bypass').delete().eq('user_id', userId);
      if (error) throw error;
      // Sertifikat uji coba (tanpa lulus ujian) ikut dihapus saat bypass dimatikan.
      if (!on) { const { error: e2 } = await admin.from('certificates').delete().eq('user_id', userId).eq('test', true); if (e2) throw e2; }
    },
    async getRef(code) {
      const { data, error } = await admin.from('referrers').select('code, name, commission, discount, active').eq('code', code).maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
    async claimedRef(email) {
      const { data, error } = await admin.from('ref_claims').select('code').eq('email', email).maybeSingle();
      if (error) { console.error('ref_claims', error.message); return null; }
      return data?.code ?? null;
    },
    async saveRef(r, by) {
      const { error } = await admin.from('referrers').upsert({ ...r, created_by: by });
      if (error) throw error;
    },
    async listRefs() {
      const [{ data: rs, error: e1 }, { data: xs, error: e2 }] = await Promise.all([
        admin.from('referrers').select('code, name, commission, discount, active').order('created_at'),
        admin.from('referrals').select('code, commission, paid'),
      ]);
      if (e1) throw e1; if (e2) throw e2;
      return (rs ?? []).map(r => {
        const mine = (xs ?? []).filter(x => x.code === r.code);
        return { ...r, sales: mine.length, earned: mine.reduce((a, x) => a + x.commission, 0), unpaid: mine.filter(x => !x.paid).reduce((a, x) => a + x.commission, 0) };
      });
    },
    async refHistory(code, limit) {
      const { data, error } = await admin.from('referrals').select('email, amount, commission, paid, created_at').eq('code', code).order('created_at', { ascending: false }).limit(limit);
      if (error) throw error;
      return data ?? [];
    },
    async addReferral(x) {
      const { error } = await admin.from('referrals').insert({ code: x.code, user_id: x.userId, email: x.email, amount: x.amount, commission: x.commission, created_by: x.by });
      if (error?.code === '23505') return false;
      if (error) throw error;
      return true;
    },
    async payRef(code) {
      const { data, error } = await admin.from('referrals').update({ paid: true, paid_at: new Date().toISOString() }).eq('code', code).eq('paid', false).select('commission');
      if (error) throw error;
      return { n: data?.length ?? 0, total: (data ?? []).reduce((a, x) => a + x.commission, 0) };
    },
    async delLink(key) {
      const { data, error } = await admin.from('pro_links').delete().eq('key', key).select('key');
      if (error) throw error;
      return (data?.length ?? 0) > 0;
    },
  };

  try {
    const out = await handleCommand(text, deps, {
      appUrl: (Deno.env.get('APP_URL') ?? 'http://localhost:5173').replace(/\/$/, ''),
      price: Number(Deno.env.get('PRICE_PRO') ?? 29000),
      adminName: msg.from?.username ? '@' + msg.from.username : String(fromId),
    });
    await reply(chatId, out);
  } catch (e) {
    console.error(e);
    await reply(chatId, 'Gagal: ' + esc(e instanceof Error ? e.message : String(e)));
  }
  return new Response('ok');
}
