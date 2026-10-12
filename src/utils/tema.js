import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Tema tampilan: "terang", "gelap", atau "sistem" (ikut setelan perangkat).
 *
 * Pilihan disimpan di localStorage per perangkat. Atribut data-tema di
 * <html> selalu berisi tema yang benar-benar dipakai ("terang"/"gelap"),
 * sehingga CSS cukup membaca satu atribut.
 */
const KUNCI = "jobly:tema";
const PILIHAN = ["terang", "gelap", "sistem"];
const pendengar = new Set();

function baca() {
  try {
    const v = localStorage.getItem(KUNCI);
    return PILIHAN.includes(v) ? v : "sistem";
  } catch {
    return "sistem";
  }
}

const mq = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

function efektifDari(pilihan) {
  if (pilihan === "sistem") return mq()?.matches ? "gelap" : "terang";
  return pilihan;
}

function terapkan(pilihan, halus = false) {
  const root = document.documentElement;
  if (halus) {
    root.classList.add("ganti-tema");
    window.setTimeout(() => root.classList.remove("ganti-tema"), 320);
  }
  const ef = efektifDari(pilihan);
  root.setAttribute("data-tema", ef);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", ef === "gelap" ? "#0B1220" : "#0B3C6E");
}

export function setTema(pilihan) {
  try {
    localStorage.setItem(KUNCI, pilihan);
  } catch {
    // mode privat — tetap diterapkan untuk sesi ini
  }
  terapkan(pilihan, true);
  pendengar.forEach((f) => f());
}

// Ikuti perubahan setelan perangkat saat memilih "sistem"
if (typeof window !== "undefined") {
  mq()?.addEventListener?.("change", () => {
    if (baca() === "sistem") {
      terapkan("sistem", true);
      pendengar.forEach((f) => f());
    }
  });
}

function langganan(f) {
  pendengar.add(f);
  return () => pendengar.delete(f);
}

/** [pilihan, efektif, setTema] */
export function useTema() {
  const pilihan = useSyncExternalStore(langganan, baca, () => "sistem");
  const [efektif, setEfektif] = useState(() => efektifDari(pilihan));
  useEffect(() => {
    setEfektif(efektifDari(pilihan));
    return langganan(() => setEfektif(efektifDari(baca())));
  }, [pilihan]);
  return [pilihan, efektif, setTema];
}
