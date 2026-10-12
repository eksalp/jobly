import { useEffect, useState } from "react";

/**
 * Kurs mata uang asing → rupiah.
 *
 * Sumber: open.er-api.com (gratis, tanpa API key, kurs harian). Hasilnya
 * disimpan di memori dan localStorage selama 12 jam supaya tidak diminta
 * ulang setiap pindah halaman. Kalau gagal dimuat, dipakai kurs cadangan
 * di bawah ini — nilainya perlu diperbarui sesekali.
 */
export const KURS_CADANGAN = {
  USD: 17890, // open.er-api.com, 11 Okt 2026 — perbarui sesekali
};

const URL_KURS = "https://open.er-api.com/v6/latest/USD";
const KUNCI_SIMPAN = "jobly:kurs:v1";
const UMUR_MAKS = 12 * 60 * 60 * 1000;

let cache = null; // { rates: {IDR, EUR, ...} relatif USD, waktu, live }
let permintaan = null;

function bacaSimpanan() {
  try {
    const s = JSON.parse(localStorage.getItem(KUNCI_SIMPAN) || "null");
    if (s?.rates?.IDR && Date.now() - s.diambil < UMUR_MAKS) return s;
  } catch {
    /* penyimpanan tidak tersedia */
  }
  return null;
}

async function ambilKurs() {
  if (cache) return cache;
  const simpan = bacaSimpanan();
  if (simpan) {
    cache = { ...simpan, live: true };
    return cache;
  }
  if (!permintaan) {
    permintaan = fetch(URL_KURS)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((d) => {
        if (d?.result !== "success" || !d?.rates?.IDR) throw new Error("kurs kosong");
        const hasil = {
          rates: d.rates,
          waktu: d.time_last_update_unix ? d.time_last_update_unix * 1000 : Date.now(),
          diambil: Date.now(),
          live: true,
        };
        try {
          localStorage.setItem(KUNCI_SIMPAN, JSON.stringify(hasil));
        } catch {
          /* abaikan */
        }
        cache = hasil;
        return hasil;
      })
      .catch(() => {
        cache = {
          rates: { USD: 1, IDR: KURS_CADANGAN.USD },
          waktu: null,
          live: false,
        };
        return cache;
      });
  }
  return permintaan;
}

/** Hook: { idrPerUsd, rates, waktu, live, siap } */
export function useKurs() {
  const [data, setData] = useState(cache);
  useEffect(() => {
    let aktif = true;
    ambilKurs().then((d) => aktif && setData(d));
    return () => {
      aktif = false;
    };
  }, []);
  const rates = data?.rates || { USD: 1, IDR: KURS_CADANGAN.USD };
  return {
    rates,
    idrPerUsd: rates.IDR,
    waktu: data?.waktu || null,
    live: Boolean(data?.live),
    siap: Boolean(data),
  };
}

/** Rupiah per 1 unit mata uang `kode`, atau null kalau tidak dikenal. */
export function idrPer(kode, rates) {
  if (!kode || !rates?.IDR) return null;
  const k = kode.toUpperCase();
  if (k === "IDR") return 1;
  if (!rates[k]) return null;
  return rates.IDR / rates[k];
}

/** Rupiah ringkas: 71.640.000 → "Rp 71,6 jt"; 1.200.000.000 → "Rp 1,2 M". */
export function rupiahRingkas(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  const f = (x) => x.toLocaleString("id-ID", { maximumFractionDigits: 1 });
  if (Math.abs(v) >= 1e9) return `Rp ${f(v / 1e9)} M`;
  if (Math.abs(v) >= 1e6) return `Rp ${f(v / 1e6)} jt`;
  return `Rp ${Math.round(v).toLocaleString("id-ID")}`;
}

export function rupiahPenuh(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return `Rp ${Math.round(v).toLocaleString("id-ID")}`;
}

export function formatWaktuKurs(ms) {
  if (!ms) return null;
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
