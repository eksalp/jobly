// Kode referal: dibawa lewat link ?ref=KODE, disimpan di browser 60 hari, lalu ikut di pesan WhatsApp saat beli.
import { supabase } from './supabase';

const KEY = 'kr.ref';
const DAYS = 60;
export const normRef = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
export const validRefFormat = (s: string) => /^[A-Z0-9]{3,16}$/.test(s);

/** Panggil sekali saat aplikasi dibuka: simpan ?ref=KODE dari alamat. */
export function captureRef(search = typeof location !== 'undefined' ? location.search : '') {
  const c = normRef(new URLSearchParams(search).get('ref') || '');
  if (!validRefFormat(c)) return;
  try { localStorage.setItem(KEY, JSON.stringify({ c, t: Date.now() })); } catch { /* abaikan */ }
}
export function storedRef(): string {
  try {
    const x = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (x && typeof x.c === 'string' && Date.now() - x.t < DAYS * 864e5) return x.c;
  } catch { /* abaikan */ }
  return '';
}
export function rememberRef(c: string) {
  try { if (validRefFormat(c)) localStorage.setItem(KEY, JSON.stringify({ c, t: Date.now() })); else localStorage.removeItem(KEY); } catch { /* abaikan */ }
}

export type RefCheck = { valid: boolean; discount: number } | null;
/** null = tidak bisa dicek (offline / server belum siap); pembeli tetap boleh lanjut. */
export async function checkRef(code: string): Promise<RefCheck> {
  if (!supabase || !validRefFormat(code)) return null;
  const { data, error } = await supabase.rpc('ref_check', { p_code: code });
  if (error) return null;
  const r = Array.isArray(data) ? data[0] : data;
  return r ? { valid: !!r.valid, discount: Number(r.discount) || 0 } : { valid: false, discount: 0 };
}

/** Catat kode referal untuk email ini di server (tidak bisa dihapus pembeli dari pesan WhatsApp).
 *  Pakai fetch keepalive supaya permintaan tetap terkirim walaupun HP langsung pindah ke aplikasi WhatsApp. */
export function claimRef(email: string, code: string) {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined, key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key || !validRefFormat(code)) return;
  try {
    void fetch(url.replace(/\/$/, '') + '/rest/v1/rpc/ref_claim', {
      method: 'POST', keepalive: true,
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: 'Bearer ' + key },
      body: JSON.stringify({ p_email: email.trim().toLowerCase(), p_code: code }),
    }).catch(() => { /* abaikan */ });
  } catch { /* abaikan */ }
}
