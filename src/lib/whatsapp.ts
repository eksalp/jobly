// Pembayaran manual lewat WhatsApp admin.
import { PRICE } from './catalog';
import { rp } from './format';

/** Nomor WhatsApp admin dalam format internasional tanpa + (contoh 6281234567890). */
const raw = (import.meta.env.VITE_WA_NUMBER as string | undefined) || '';
export const WA_NUMBER = raw.replace(/\D/g, '').replace(/^0/, '62');
export const hasWhatsApp = WA_NUMBER.length >= 9;

export function waLink(opts: { email: string; name?: string; renew?: boolean; ref?: string; discount?: number }) {
  const price = Math.max(0, PRICE.pro - (opts.ref && opts.discount ? opts.discount : 0));
  const lines = [
    `Halo, saya mau ${opts.renew ? 'memperpanjang' : 'membeli'} Jagoan Excel Pro lifetime (${rp(price)}).`,
    '',
    `Email: ${opts.email}`,
    opts.name ? `Nama: ${opts.name}` : null,
    opts.ref ? `Kode referal: ${opts.ref}` : null,
    '',
    'Mohon info cara pembayarannya. Terima kasih.',
  ].filter((l): l is string => l !== null);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}
