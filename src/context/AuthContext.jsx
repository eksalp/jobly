import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { t } from "../i18n.js";

export const AuthContext = createContext({
  session: null,
  user: null,
  authLoading: true,
  signUpWithEmail: async () => ({ error: "not configured" }),
  signInWithEmail: async () => ({ error: "not configured" }),
  signInWithGoogle: async () => ({ error: "not configured" }),
  signOut: async () => {},
  peran: "pekerja",
  setPeran: async () => {},
  resetPassword: async () => ({ error: "not configured" }),
});

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Jenis akun: "pekerja" (pencari kerja) atau "perusahaan" (penerbit loker).
 * Disimpan di user_metadata.peran. Akun lama tanpa peran dianggap pekerja,
 * kecuali sudah punya profil perusahaan (lihat AuthProvider).
 */
export const KUNCI_DAFTAR_SEBAGAI = "jobly:daftar-sebagai";
export const peranDari = (user) => (user?.user_metadata?.peran === "perusahaan" ? "perusahaan" : "pekerja");

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      setAuthLoading(false);
      return;
    }
    // Ambil session yang lagi aktif (kalau ada, termasuk hasil redirect OAuth)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    // Dengar perubahan auth: login, logout, token refresh, dsb.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const signUpWithEmail = async (email, password, fullName, peran = "pekerja", ekstra = {}) => {
    if (!supabaseConfigured)
      return { error: t("Supabase belum dikonfigurasi.", "Supabase isn't configured yet.") };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { ...ekstra, full_name: fullName, peran },
        emailRedirectTo: window.location.origin + (peran === "perusahaan" ? "/pemberi-kerja/dasbor" : "/dashboard/overview"),
      },
    });
    if (error) return { error: error.message };
    return { data };
  };

  const signInWithEmail = async (email, password) => {
    if (!supabaseConfigured)
      return { error: t("Supabase belum dikonfigurasi.", "Supabase isn't configured yet.") };
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return { data };
  };

  const signInWithGoogle = async (peran = "pekerja") => {
    if (!supabaseConfigured)
      return { error: t("Supabase belum dikonfigurasi.", "Supabase isn't configured yet.") };
    // Akun Google yang baru dibuat belum punya peran; catat pilihan ini
    // supaya peran bisa dipasang setelah kembali dari Google.
    try {
      sessionStorage.setItem(KUNCI_DAFTAR_SEBAGAI, peran);
    } catch {
      /* penyimpanan tidak tersedia */
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + (peran === "perusahaan" ? "/pemberi-kerja/dasbor" : "/dashboard/overview"),
      },
    });
    if (error) return { error: error.message };
    return { data };
  };

  const signOut = async () => {
    if (!supabaseConfigured) return;
    await supabase.auth.signOut();
  };

  const setPeran = async (peran) => {
    if (!supabaseConfigured) return;
    const { data } = await supabase.auth.updateUser({ data: { peran } });
    if (data?.user) setSession((s) => (s ? { ...s, user: data.user } : s));
  };

  // Lengkapi peran akun yang belum punya:
  //  - akun Google baru yang masuk lewat halaman perusahaan → perusahaan
  //  - akun lama yang sudah punya profil perusahaan → perusahaan
  //  - selain itu → pekerja
  const userId = session?.user?.id;
  const adaPeran = Boolean(session?.user?.user_metadata?.peran);
  useEffect(() => {
    if (!userId || adaPeran || !supabaseConfigured) return;
    let batal = false;
    (async () => {
      let pilihan = null;
      try {
        pilihan = sessionStorage.getItem(KUNCI_DAFTAR_SEBAGAI);
        sessionStorage.removeItem(KUNCI_DAFTAR_SEBAGAI);
      } catch {
        /* penyimpanan tidak tersedia */
      }
      const baru = Date.now() - new Date(session.user.created_at).getTime() < 15 * 60 * 1000;
      let peran = baru && pilihan === "perusahaan" ? "perusahaan" : null;
      if (!peran) {
        const { data } = await supabase.from("perusahaan").select("user_id").eq("user_id", userId).maybeSingle();
        peran = data ? "perusahaan" : "pekerja";
      }
      if (!batal) await setPeran(peran);
    })();
    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, adaPeran]);

  const resetPassword = async (email) => {
    if (!supabaseConfigured)
      return { error: t("Supabase belum dikonfigurasi.", "Supabase isn't configured yet.") };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login",
    });
    if (error) return { error: error.message };
    return { data: true };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        authLoading,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        resetPassword,
        peran: peranDari(session?.user),
        // false selama peran akun lama/Google baru masih ditentukan
        peranSiap: !session || Boolean(session.user?.user_metadata?.peran),
        setPeran,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

