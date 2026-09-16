"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Siswa, daftarSiswa } from "@/lib/siswaData";

export type UserRole = "admin" | "guru" | "pengurus" | "siswa" | "guest";

export interface UserProfile {
  id: string;
  email: string | null;
  nama: string;
  nis?: string | null;
  role: UserRole;
  siswa_id: number | null;
  siswa?: Siswa | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  isConfigured: boolean;
  setLocalAuthSession: (profile: UserProfile) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const LOCAL_STORAGE_AUTH_KEY = "rayon_cisarua_3_user_session";

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: "guest",
  isLoading: true,
  isConfigured: false,
  setLocalAuthSession: () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      // 1. Ambil profil user dari public.profiles
      const { data: profData, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (profErr && profErr.code !== "PGRST116") {
        console.warn("Could not query profiles table:", profErr.message);
      }

      let matchedSiswa: Siswa | null = null;
      const targetSiswaId = profData?.siswa_id || currentUser.user_metadata?.siswa_id;

      if (targetSiswaId) {
        const { data: siswaData } = await supabase
          .from("siswa")
          .select("*")
          .eq("id", targetSiswaId)
          .single();

        if (siswaData) {
          matchedSiswa = {
            id: siswaData.id,
            nama: siswaData.nama,
            nis: siswaData.nis,
            jabatan: siswaData.jabatan,
            angkatan: siswaData.angkatan,
            tahunAngkatan: siswaData.tahun_angkatan,
            inisial: siswaData.inisial,
            warnaBg: siswaData.warna_bg,
          };
        } else {
          const localS = daftarSiswa.find((s) => s.id === targetSiswaId);
          if (localS) matchedSiswa = localS;
        }
      }

      if (profData) {
        setProfile({
          id: profData.id,
          email: profData.email || currentUser.email || null,
          nama: profData.nama || currentUser.email || "Pengguna",
          nis: profData.nis || null,
          role: (profData.role as UserRole) || "siswa",
          siswa_id: profData.siswa_id || null,
          siswa: matchedSiswa,
        });
      } else {
        // Fallback metadata
        setProfile({
          id: currentUser.id,
          email: currentUser.email || null,
          nama: currentUser.user_metadata?.nama || currentUser.email || "Pengguna",
          nis: currentUser.user_metadata?.nis || null,
          role: (currentUser.user_metadata?.role as UserRole) || "siswa",
          siswa_id: targetSiswaId || null,
          siswa: matchedSiswa,
        });
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  };

  const setLocalAuthSession = (newProfile: UserProfile) => {
    setProfile(newProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(newProfile));
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    } else if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as UserProfile;
          setProfile(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    // 1. Cek session dari Local Storage terlebih dahulu untuk instant load
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as UserProfile;
          setProfile(parsed);
        } catch (e) {
          console.error("Error parsing stored session:", e);
        }
      }
    }

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // 2. Cek session Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }).catch(() => {
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user).finally(() => setIsLoading(false));
      } else if (!localStorage.getItem(LOCAL_STORAGE_AUTH_KEY)) {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn("Signout warning:", e);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }
    setUser(null);
    setProfile(null);
  };

  const role: UserRole = profile?.role || "guest";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isLoading,
        isConfigured: isSupabaseConfigured,
        setLocalAuthSession,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

