import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

export const UserProfileContext = createContext({
  fullName: "",
  headline: "",
  location: "",
  summary: "",
  skills: [],
  cvText: "",
  profileLoading: true,
  setCvText: () => {},
  addSkill: () => {},
  removeSkill: () => {},
  updateProfile: () => {},
});

export function useUserProfile() {
  return useContext(UserProfileContext);
}

export function defaultProfileFor(user) {
  return {
    fullName:
      user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User baru",
    headline: "",
    location: "",
    summary: "",
    skills: [],
    cvText: "",
  };
}

export function UserProfileProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!user || !supabaseConfigured) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    let cancelled = false;
    setProfileLoading(true);

    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Gagal memuat profil:", error.message);
        setProfile(defaultProfileFor(user));
        setProfileLoading(false);
        return;
      }

      if (!data) {
        // Baris profil belum ada (mis. trigger auto-create belum di-setup).
        // Buat baru supaya update berikutnya bisa langsung upsert.
        const fresh = defaultProfileFor(user);
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: fresh.fullName,
          headline: fresh.headline,
          location: fresh.location,
          summary: fresh.summary,
          skills: fresh.skills,
          cv_text: fresh.cvText,
        });
        if (!cancelled) setProfile(fresh);
      } else {
        setProfile({
          fullName: data.full_name || defaultProfileFor(user).fullName,
          headline: data.headline || "",
          location: data.location || "",
          summary: data.summary || "",
          skills: data.skills || [],
          cvText: data.cv_text || "",
        });
      }
      setProfileLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Simpan perubahan ke Supabase. `patch` cuma berisi field yang berubah.
  const persist = (patch) => {
    if (!user || !supabaseConfigured) return;
    const dbPatch = { updated_at: new Date().toISOString() };
    if ("fullName" in patch) dbPatch.full_name = patch.fullName;
    if ("headline" in patch) dbPatch.headline = patch.headline;
    if ("location" in patch) dbPatch.location = patch.location;
    if ("summary" in patch) dbPatch.summary = patch.summary;
    if ("skills" in patch) dbPatch.skills = patch.skills;
    if ("cvText" in patch) dbPatch.cv_text = patch.cvText;
    supabase
      .from("profiles")
      .update(dbPatch)
      .eq("id", user.id)
      .then(({ error }) => {
        if (error) console.error("Gagal menyimpan profil:", error.message);
      });
  };

  // Untuk field seperti nama/headline/lokasi, ganti + simpan langsung.
  const updateProfile = (patch) => {
    setProfile((prev) => ({ ...(prev || {}), ...patch }));
    persist(patch);
  };

  // CV text sering diketik cepat, jadi di-debounce 800ms sebelum disimpan.
  const setCvText = (text) => {
    setProfile((prev) => ({ ...(prev || {}), cvText: text }));
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist({ cvText: text }), 800);
  };

  const addSkill = (skill) => {
    const clean = skill.trim();
    if (!clean) return;
    setProfile((prev) => {
      const current = prev?.skills || [];
      if (current.some((s) => s.toLowerCase() === clean.toLowerCase()))
        return prev;
      const next = [...current, clean];
      persist({ skills: next });
      return { ...(prev || {}), skills: next };
    });
  };

  const removeSkill = (skill) => {
    setProfile((prev) => {
      const next = (prev?.skills || []).filter((s) => s !== skill);
      persist({ skills: next });
      return { ...(prev || {}), skills: next };
    });
  };

  const value = {
    fullName: profile?.fullName || "",
    headline: profile?.headline || "",
    location: profile?.location || "",
    summary: profile?.summary || "",
    skills: profile?.skills || [],
    cvText: profile?.cvText || "",
    profileLoading,
    setCvText,
    addSkill,
    removeSkill,
    updateProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

