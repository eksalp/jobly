// Tombol "Pratinjau": arahkan kursor (atau fokus keyboard) untuk melihat sertifikat melayang di dekat tombol.
// Di layar sentuh, ketuk sekali untuk membuka dan ketuk di luar untuk menutup.
import { pageZoom } from '../lib/zoom';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { createPortal } from 'react-dom';
import { CertPreview } from './CertPreview';

type Props = ComponentProps<typeof CertPreview> & { label?: string };

export function CertPreviewButton({ label = 'Pratinjau', ...pv }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; w: number } | null>(null);
  const pinned = useRef(false);
  const timer = useRef<number>();

  const open = () => {
    window.clearTimeout(timer.current);
    const r = btn.current?.getBoundingClientRect(); if (!r) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const w = Math.min(380, vw - 32, ((vh - 56) * 210) / 297), h = (w * 297) / 210 + 30;
    const left = Math.max(16, Math.min(r.left + r.width / 2 - w / 2, vw - w - 16));
    const below = r.bottom + 10, above = r.top - 10 - h;
    const top = below + h <= vh - 8 || above < 8 ? Math.max(8, Math.min(below, vh - h - 8)) : above;
    const z = pageZoom();
    setPos({ left: left / z, top: top / z, w: w / z });
  };
  const close = () => { pinned.current = false; setPos(null); };
  const leave = () => { if (!pinned.current) timer.current = window.setTimeout(close, 80); };

  useEffect(() => {
    if (!pos) return;
    const onDown = (e: Event) => { if (!btn.current?.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('pointerdown', onDown); window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true); window.addEventListener('resize', close);
    return () => { window.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
  }, [!!pos]);

  return (
    <>
      <button ref={btn} type="button" className="btn ghost sm cpb" aria-expanded={!!pos}
        onMouseEnter={open} onMouseLeave={leave} onFocus={open} onBlur={leave}
        onClick={() => { if (pos && pinned.current) close(); else { pinned.current = true; open(); } }}>
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>
        {label}
      </button>
      {pos && createPortal(
        <div className="cpb-pop" role="tooltip" style={{ left: pos.left, top: pos.top, width: pos.w }}>
          <CertPreview {...pv} />
          <p>{pv.sample ? 'Contoh tampilan. Nama, nilai, nomor, dan QR asli muncul setelah kamu lulus ujian.' : 'Sertifikatmu'}</p>
        </div>, document.body)}
    </>
  );
}
