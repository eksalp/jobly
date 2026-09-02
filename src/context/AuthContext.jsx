import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";

export const AuthContext = createContext({
  session: null,
  user: null,
  authLoading: true,
  signUpWithEmail: async () => ({ error: "not configured" }),
  signInWithEmail: async () => ({ error: "not configured" }),
  signInWithGoogle: async () => ({ error: "not configured" }),
  signOut: async () => {},
  resetPassword: async () => ({ error: "not configured" }),
});

export function useAuth() {
  return useContext(AuthContext);
}

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

  const signUpWithEmail = async (email, password, fullName) => {
    if (!supabaseConfigured)
      return { error: "Supabase belum dikonfigurasi." };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    return { data };
  };

  const signInWithEmail = async (email, password) => {
    if (!supabaseConfigured)
      return { error: "Supabase belum dikonfigurasi." };
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return { data };
  };

  const signInWithGoogle = async () => {
    if (!supabaseConfigured)
      return { error: "Supabase belum dikonfigurasi." };
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard/overview" },
    });
    if (error) return { error: error.message };
    return { data };
  };

  const signOut = async () => {
    if (!supabaseConfigured) return;
    await supabase.auth.signOut();
  };

  const resetPassword = async (email) => {
    if (!supabaseConfigured)
      return { error: "Supabase belum dikonfigurasi." };
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

