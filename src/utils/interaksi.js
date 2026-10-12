import { useEffect, useRef } from "react";

/**
 * Pemuatan otomatis: begitu elemen penanda (biasanya tombol "Muat lebih
 * banyak") terlihat di layar, panggil `muat`. Tombolnya tetap ada untuk
 * pembaca layar dan kalau IntersectionObserver tidak tersedia.
 */
export function useMuatOtomatis(ref, aktif, muat) {
  const fn = useRef(muat);
  fn.current = muat;
  useEffect(() => {
    const el = ref.current;
    if (!aktif || !el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) fn.current();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, aktif]);
}

/** Tekan "/" di mana saja untuk langsung mengetik di kolom pencarian. */
export function usePintasanCari(idInput) {
  useEffect(() => {
    const f = (e) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      const el = document.getElementById(idInput);
      if (!el) return;
      e.preventDefault();
      el.focus();
      el.select?.();
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [idInput]);
}

/** Angka yang "berhitung" naik saat pertama tampil — untuk statistik. */
export function useHitungNaik(target, durasi = 900) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target)) return;
    const akhir = Math.round(target);
    const tulis = (n) => {
      el.textContent = Math.round(n).toLocaleString("id-ID");
    };
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || akhir === 0) {
      tulis(akhir);
      return;
    }
    let mulai = null;
    let raf;
    const langkah = (t) => {
      if (mulai == null) mulai = t;
      const p = Math.min(1, (t - mulai) / durasi);
      tulis(akhir * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(langkah);
    };
    raf = requestAnimationFrame(langkah);
    return () => cancelAnimationFrame(raf);
  }, [target, durasi]);
  return ref;
}

/* ------------------------------------------------------------------ */
/*  Loker yang terakhir dilihat — disimpan di perangkat                */
/* ------------------------------------------------------------------ */
const KUNCI_LIHAT = "jobly:terakhir-dilihat";

export function catatDilihat(job) {
  if (!job?.id) return;
  try {
    const lama = JSON.parse(localStorage.getItem(KUNCI_LIHAT) || "[]");
    const baru = [
      { id: job.id, posisi: job.posisi, perusahaan: job.perusahaan, lokasi: job.lokasi, t: Date.now() },
      ...lama.filter((x) => x.id !== job.id),
    ].slice(0, 12);
    localStorage.setItem(KUNCI_LIHAT, JSON.stringify(baru));
  } catch {
    // penyimpanan tidak tersedia — abaikan
  }
}

export function bacaDilihat() {
  try {
    const v = JSON.parse(localStorage.getItem(KUNCI_LIHAT) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
