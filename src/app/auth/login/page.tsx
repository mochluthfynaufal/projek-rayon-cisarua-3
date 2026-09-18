"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { daftarSiswa, adminNisList } from "@/lib/siswaData";
import { verifyUserPassword } from "@/lib/authPasswordService";
import {
  Lock,
  Mail,
  ShieldAlert,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle,
  Leaf,
  Eye,
  EyeOff,
  Info
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, role, logout, refreshProfile } = useAuth();

  const [inputIdentifier, setInputIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedInput = inputIdentifier.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedInput || !trimmedPass) {
      setErrorMessage("Mohon isi email / NIS dan kata sandi.");
      return;
    }

    // 1. Tentukan target email & cari siswa terkait
    let targetEmail = trimmedInput;
    let targetNama = "Pengguna";
    let targetNis = "";
    let targetRole: "admin" | "guru" | "pengurus" | "siswa" = "siswa";
    let targetSiswaId: number | null = null;
    let expectedPassword = "";

    // Cek jika input berupa Guru
    if (
      trimmedInput === "mohamadrizal@smkwikrama.sch.id" ||
      trimmedInput === "guru" ||
      trimmedInput === "ps" ||
      trimmedInput === "pak rizal"
    ) {
      targetEmail = "mohamadrizal@smkwikrama.sch.id";
      targetNama = "Mohamad Rizal, S.Pd.";
      targetRole = "guru";
      expectedPassword = "psrayoncisarua";
    } else {
      // Cari di data siswa berdasarkan NIS atau bagian nama email
      const matchedSiswa = daftarSiswa.find((s) => {
        const cleanName = s.nama.toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          s.nis === trimmedInput ||
          trimmedInput.startsWith(cleanName) ||
          trimmedInput === `${cleanName}@smkwikrama.sch.id` ||
          s.nama.toLowerCase().includes(trimmedInput)
        );
      });

      if (matchedSiswa) {
        const clean = matchedSiswa.nama.toLowerCase().replace(/[^a-z0-9]/g, "");
        targetEmail = `${clean}@smkwikrama.sch.id`;
        targetNama = matchedSiswa.nama;
        targetNis = matchedSiswa.nis;
        targetSiswaId = matchedSiswa.id;
        expectedPassword = matchedSiswa.nis;

        if (adminNisList.includes(matchedSiswa.nis)) {
          targetRole = "admin";
        } else if (
          ["12511094", "12511415", "12510978", "12510816"].includes(matchedSiswa.nis) ||
          ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara"].includes(matchedSiswa.jabatan)
        ) {
          targetRole = "pengurus";
        } else {
          targetRole = "siswa";
        }
      }
    }

    setLoading(true);
    try {
      let loginSuccess = false;

      // Percobaan 1: Supabase GoTrue Auth
      if (isSupabaseConfigured) {
        try {
          const authResult = await supabase.auth.signInWithPassword({
            email: targetEmail,
            password: trimmedPass,
          });

          if (authResult.data.user && !authResult.error) {
            loginSuccess = true;
            // Sinkronkan ke profiles jika perlu
            await supabase.from("profiles").upsert({
              id: authResult.data.user.id,
              email: targetEmail,
              nama: targetNama,
              nis: targetNis || null,
              role: targetRole,
              siswa_id: targetSiswaId,
            });
          }
        } catch (authErr: any) {
          console.warn("Supabase GoTrue auth failed, trying direct database verification:", authErr?.message);
        }
      }

      // Percobaan 2: Jika GoTrue Auth error (seperti 500 schema error), lakukan verifikasi data siswa/guru
      if (!loginSuccess) {
        // Cek kecocokan password dengan password kustom (jika sudah diubah) atau NIS/password guru
        const defaultPassword = targetRole === "guru" ? "psrayoncisarua" : (expectedPassword || targetNis || "");
        const isPasswordValid = verifyUserPassword(trimmedPass, {
          email: targetEmail,
          nis: targetNis,
          defaultPassword,
        });

        if (isPasswordValid) {
          // Cari record profile di database Supabase jika ada
          let customUserId = `usr_${targetNis || "guru"}_${Date.now()}`;
          if (isSupabaseConfigured) {
            const { data: dbProf } = await supabase
              .from("profiles")
              .select("*")
              .or(`email.eq.${targetEmail},nis.eq.${targetNis}`)
              .limit(1)
              .maybeSingle();

            if (dbProf) {
              customUserId = dbProf.id;
              targetNama = dbProf.nama || targetNama;
              targetRole = dbProf.role || targetRole;
              targetSiswaId = dbProf.siswa_id || targetSiswaId;
            }

            // ✅ Daftarkan akun ke Supabase Auth agar fitur ganti password bisa bekerja
            // Gunakan NIS (atau password guru) sebagai password awal di Supabase Auth
            try {
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: targetEmail,
                password: trimmedPass, // NIS / password guru
                options: { emailRedirectTo: undefined },
              });

              if (signUpData?.user && !signUpError) {
                // Akun baru berhasil dibuat, sinkronkan profile
                customUserId = signUpData.user.id;
                await supabase.from("profiles").upsert({
                  id: signUpData.user.id,
                  email: targetEmail,
                  nama: targetNama,
                  nis: targetNis || null,
                  role: targetRole,
                  siswa_id: targetSiswaId,
                });
              } else if (signUpError?.message?.toLowerCase().includes("already registered") ||
                         signUpError?.message?.toLowerCase().includes("already exists")) {
                // Akun sudah ada di Supabase Auth, coba signIn untuk dapat sesi aktif
                const { data: reSignIn } = await supabase.auth.signInWithPassword({
                  email: targetEmail,
                  password: trimmedPass,
                });
                if (reSignIn?.user) {
                  customUserId = reSignIn.user.id;
                }
              }
            } catch (authRegisterErr) {
              // Gagal daftarkan ke Auth — tidak apa-apa, login lokal tetap jalan
              console.warn("Auto auth register failed (non-critical):", authRegisterErr);
            }
          }

          const matchedSiswaObj = daftarSiswa.find((s) => s.id === targetSiswaId) || null;

          const sessionProfile = {
            id: customUserId,
            email: targetEmail,
            nama: targetNama,
            nis: targetNis || null,
            role: targetRole,
            siswa_id: targetSiswaId,
            siswa: matchedSiswaObj,
          };

          const { setLocalAuthSession } = (window as any).__authContextHelper || {};
          if (typeof window !== "undefined") {
            localStorage.setItem("rayon_cisarua_3_user_session", JSON.stringify(sessionProfile));
          }

          await refreshProfile();
          loginSuccess = true;
        } else {
          const hint = targetNis ? ` (NIS: ${targetNis})` : "";
          throw new Error(`Kata sandi salah. Masukkan kata sandi yang telah Anda ubah atau gunakan NIS Anda${hint} jika belum diubah.`);
        }
      }

      setSuccessMessage("Berhasil masuk! Mengalihkan ke portal rayon...");
      setTimeout(() => {
        router.push("/belajar");
      }, 700);
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMessage(
        err.message?.includes("Invalid login credentials")
          ? "Kata sandi salah. Masukkan kata sandi yang sesuai atau gunakan NIS Anda."
          : err.message || "Gagal masuk. Periksa kembali email/NIS dan kata sandi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tl from-emerald-100/40 via-yellow-50/50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-2xl shadow-yellow-500/10 text-slate-800 relative z-10">

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        {/* Header Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-yellow-500/20">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">Rayon Cisarua 3</h1>
          <p className="text-gray-500 text-xs mt-1">
            Masuk untuk mengakses struktur rayon, piket, dan keluhan
          </p>
        </div>

        {/* Status jika user sudah login */}
        {user && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm mb-1">
              <CheckCircle className="w-4 h-4" /> Sedang Masuk
            </div>
            <p className="text-xs text-emerald-800 font-semibold">{profile?.nama || user.email}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white uppercase">
              Role: {role}
            </span>
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={() => router.push("/belajar")}
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Ke Halaman Rayon
              </button>
              <button
                onClick={logout}
                className="bg-red-50 text-red-600 border border-red-200 font-bold text-xs px-4 py-2 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>
        )}

        {/* Notifikasi Supabase unconfigured */}
        {!isSupabaseConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <p className="font-bold mb-1">Konfigurasi Database Belum Terhubung</p>
              <p className="opacity-90">
                Isi variabel <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-300">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> pada file <code className="bg-white/80 px-1 py-0.5 rounded border border-amber-300">.env</code>.
              </p>
            </div>
          </div>
        )}

        {/* Alerts */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 mb-4 text-xs text-red-700 leading-relaxed">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3.5 mb-4 text-xs text-green-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Sekolah atau NIS</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="namalengkap@smkwikrama.sch.id atau NIS"
                value={inputIdentifier}
                onChange={(e) => setInputIdentifier(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kata Sandi (NIS)</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Masukkan NIS Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-extrabold py-3 rounded-xl shadow-md hover:shadow-yellow-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Masuk ke Akun
              </>
            )}
          </button>
        </form>

        {/* Petunjuk Masuk */}
        <div className="mt-6 p-4 bg-yellow-50/70 border border-yellow-200/80 rounded-2xl flex items-start gap-2.5 text-[11px] text-yellow-900 leading-relaxed">
          <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-yellow-950 mb-0.5">Petunjuk Masuk Akun:</p>
            <p>
              Bisa masukkan <strong>Email Sekolah</strong> atau cukup ketik <strong>NIS Anda</strong> di kolom atas.<br />
              Password bawaan: <strong>NIS Anda</strong> (contoh: <code className="bg-yellow-200/60 px-1 py-0.2 rounded font-mono">12511108</code>).
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center text-[11px] text-gray-400">
          Rayon Cisarua 3 &middot; SMK Wikrama Bogor
        </div>
      </div>
    </div>
  );
}
