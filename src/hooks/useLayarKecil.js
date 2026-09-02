import { useState, useEffect } from "react";

/**
 * Mendeteksi lebar layar untuk penyesuaian tata letak.
 *
 * Seluruh gaya di proyek ini ditulis inline, sehingga media query CSS
 * tidak bisa dipakai. Hook ini menggantikannya dengan matchMedia —
 * lebih hemat daripada mendengarkan event resize, karena hanya terpicu
 * saat ambangnya benar-benar terlewati.
 */
export function useLayarKecil(ambang = 900) {
  const [kecil, setKecil] = useState(
    () => typeof window !== "undefined" && window.innerWidth < ambang,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${ambang - 1}px)`);
    const ubah = (e) => setKecil(e.matches);

    setKecil(mq.matches);
    mq.addEventListener("change", ubah);
    return () => mq.removeEventListener("change", ubah);
  }, [ambang]);

  return kecil;
}

/** Ambang khusus ponsel, untuk penyesuaian yang lebih rapat. */
export function useHp() {
  return useLayarKecil(600);
}
