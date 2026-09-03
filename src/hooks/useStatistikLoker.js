import { useState, useEffect } from "react";
import {
  supabase,
  supabase2,
  SUPABASE_TABLE,
  SUPABASE_TABLE_2,
} from "../lib/supabaseClient";
import { TAXONOMY } from "../data/taxonomy";

/**
 * Menghitung jumlah loker per bidang, langsung di database.
 *
 * Kategori tidak tersimpan sebagai kolom — ditentukan taxonomy di sisi
 * aplikasi. Memuat seluruh katalog hanya untuk menghitung akan membuat
 * halaman depan lambat, jadi di sini dipakai `count` dengan filter ilike:
 * Postgres yang menghitung, dan tidak ada satu baris pun yang diunduh.
 *
 * Angkanya perkiraan, bukan hasil klasifikasi penuh — satu lowongan bisa
 * tercakup di dua bidang. Untuk halaman depan, itu memadai.
 */

// Kata kunci paling khas per bidang. Sengaja sedikit: URL query punya
// batas panjang, dan kata yang terlalu umum justru mengaburkan angkanya.
const KUNCI_HITUNG = {
  "AI Training & Anotasi Data": [
    "ai",
    "data",
    "machine learning",
    "python",
    "annotation",
  ],
  "Konten, Bahasa & Presenter": [
    "content",
    "writer",
    "konten",
    "translator",
    "video",
  ],
  "Transaksi, Keuangan & Treasury": [
    "finance",
    "keuangan",
    "accounting",
    "tax",
    "treasury",
  ],
  "Sales, Marketing & Lapangan": [
    "sales",
    "marketing",
    "business development",
    "account",
  ],
  "IT & Dukungan Teknis": [
    "developer",
    "engineer",
    "it ",
    "software",
    "technical",
  ],
};

async function hitungBidang(client, tabel, kunci) {
  // ilike pada kolom judul. Kolom judul berbeda antar sumber, jadi
  // keduanya dicoba dan yang gagal diabaikan.
  const filter = kunci
    .flatMap((k) => [`title.ilike.%${k}%`, `posisi.ilike.%${k}%`])
    .join(",");

  const { count, error } = await client
    .from(tabel)
    .select("*", { count: "exact", head: true })
    .or(filter);

  if (error) return 0;
  return count ?? 0;
}

export function useStatistikLoker() {
  const [statistik, setStatistik] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let batal = false;

    (async () => {
      try {
        // Total keseluruhan
        const { count } = await supabase
          .from(SUPABASE_TABLE)
          .select("*", { count: "exact", head: true });

        if (batal) return;
        setTotal(count ?? 0);

        // Per bidang, dijalankan bersamaan
        const hasil = await Promise.all(
          TAXONOMY.map(async (kat) => {
            const kunci = KUNCI_HITUNG[kat.label];
            if (!kunci) return null;
            const n = await hitungBidang(supabase, SUPABASE_TABLE, kunci);
            return { label: kat.label, jumlah: n };
          }),
        );

        if (batal) return;

        setStatistik(
          hasil
            .filter((h) => h && h.jumlah > 0)
            .sort((a, b) => b.jumlah - a.jumlah),
        );
      } catch (e) {
        console.warn("Gagal menghitung statistik loker:", e?.message);
      } finally {
        if (!batal) setLoading(false);
      }
    })();

    return () => {
      batal = true;
    };
  }, []);

  return { statistik, total, loading };
}

/** Membulatkan ke bawah supaya angkanya tidak terkesan mengada-ada. */
export function bulatkan(n) {
  if (n >= 1000) return `${Math.floor(n / 100) / 10}rb`;
  if (n >= 100) return `${Math.floor(n / 100) * 100}+`;
  return String(n);
}
