import { useState, useEffect } from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";

/**
 * Mengambil teks profil user dari sumber mana pun yang tersedia.
 *
 * `cvText` di UserProfileContext hanya terisi selama sesi berjalan — begitu
 * halaman dimuat ulang, isinya kosong meski user sudah punya CV tersimpan.
 * Hook ini menutup celah itu dengan mencari berurutan:
 *
 *   1. cvText di sesi ini (paling baru, paling relevan)
 *   2. CV tersimpan di CV Builder (profiles.cv_json)
 *   3. Cuplikan CV dari analisis terakhir (career_analyses.cv_snapshot)
 */
export function useTeksProfil() {
  const { user } = useAuth();
  const { cvText } = useUserProfile();

  const [teks, setTeks] = useState(cvText || "");
  const [sumber, setSumber] = useState(cvText ? "sesi" : null);
  const [loading, setLoading] = useState(!cvText);

  useEffect(() => {
    // Teks di sesi selalu menang — itu yang baru saja dimasukkan user
    if (cvText?.trim()) {
      setTeks(cvText);
      setSumber("sesi");
      setLoading(false);
      return;
    }

    if (!user || !supabaseConfigured) {
      setLoading(false);
      return;
    }

    let batal = false;

    (async () => {
      setLoading(true);

      const { data: profil } = await supabase
        .from("profiles")
        .select("cv_json")
        .eq("id", user.id)
        .maybeSingle();

      if (batal) return;

      const dariBuilder = ratakanCv(profil?.cv_json);
      if (dariBuilder.length > 80) {
        setTeks(dariBuilder);
        setSumber("cv_builder");
        setLoading(false);
        return;
      }

      const { data: analisis } = await supabase
        .from("career_analyses")
        .select("cv_snapshot")
        .eq("user_id", user.id)
        .not("cv_snapshot", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (batal) return;

      if (analisis?.cv_snapshot?.trim()) {
        setTeks(analisis.cv_snapshot);
        setSumber("analisis");
      }
      setLoading(false);
    })();

    return () => {
      batal = true;
    };
  }, [user?.id, cvText]);

  return { teks, sumber, loading, ada: teks.trim().length > 80 };
}

/**
 * Mengubah cv_json dari CV Builder jadi teks datar.
 *
 * Bentuknya tidak perlu rapi — yang dibutuhkan deteksi kategori dan AI
 * adalah kata-katanya, bukan tata letaknya.
 */
function ratakanCv(cv) {
  if (!cv || typeof cv !== "object") return "";

  const bagian = [];
  const tambah = (v) => {
    if (!v) return;
    if (Array.isArray(v)) v.forEach(tambah);
    else if (typeof v === "string" && v.trim()) bagian.push(v.trim());
  };

  tambah([cv.fullName, cv.headline, cv.location, cv.summary]);

  const daftar = [
    ["experiences", ["role", "company", "start", "end"]],
    ["organizations", ["role", "org", "start", "end"]],
    ["volunteers", ["role", "org", "start", "end"]],
    ["education", ["school", "degree", "start", "end"]],
    ["awards", ["title", "issuer", "year"]],
    ["certifications", ["name", "issuer", "year"]],
  ];

  daftar.forEach(([kunci, kolom]) => {
    (cv[kunci] || []).forEach((item) => {
      tambah(kolom.map((k) => item[k]));
      tambah(item.desc);
    });
  });

  tambah(cv.skills);

  return bagian.join("\n");
}
