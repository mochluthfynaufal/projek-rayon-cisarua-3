"use client";

import React, { useState } from "react";
import { X, Lock, KeyRound, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { saveCustomPassword, verifyUserPassword } from "@/lib/authPasswordService";

interface ModalUbahPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalUbahPassword({ isOpen, onClose }: ModalUbahPasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  if (!isOpen) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedCurrent = currentPassword.trim();
    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedCurrent) {
      setErrorMsg("Masukkan kata sandi saat ini terlebih dahulu.");
      return;
    }

    if (trimmedNew.length < 6) {
      setErrorMsg("Kata sandi baru minimal harus 6 karakter.");
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok. Mohon periksa kembali.");
      return;
    }

    if (trimmedCurrent === trimmedNew) {
      setErrorMsg("Kata sandi baru tidak boleh sama dengan kata sandi saat ini.");
      return;
    }

    setLoading(true);
    try {
      // 1. Ambil email & NIS dari sesi aktif atau localStorage
      let userEmail: string | undefined;
      let userNis: string | undefined;
      let userRole: string | undefined;
      let userNama: string | undefined;

      try {
        const saved = localStorage.getItem("rayon_cisarua_3_user_session");
        if (saved) {
          const parsed = JSON.parse(saved);
          userEmail = parsed?.email;
          userNis = parsed?.nis;
          userRole = parsed?.role;
          userNama = parsed?.nama;
        }
      } catch (_) {}

      if (!userEmail) {
        if (isSupabaseConfigured) {
          const { data: sessionData } = await supabase.auth.getSession();
          userEmail = sessionData?.session?.user?.email;
        }
      }

      if (!userEmail && !userNis) {
        throw new Error("Tidak dapat menemukan data akun. Silakan logout lalu login kembali.");
      }

      // 2. Verifikasi kata sandi saat ini
      const defaultPassword = userRole === "guru" ? "psrayoncisarua" : userNis || "";
      const isCurrentValid = verifyUserPassword(trimmedCurrent, {
        email: userEmail,
        nis: userNis,
        defaultPassword,
      });

      if (!isCurrentValid) {
        const hint = userNis ? ` Password awal adalah NIS: ${userNis}.` : "";
        throw new Error(`Kata sandi saat ini salah.${hint} Masukkan kata sandi yang benar.`);
      }

      // 3. Simpan kata sandi baru ke persistent storage
      saveCustomPassword(userEmail, userNis, trimmedNew, userNama);

      // 4. Sinkronkan ke Supabase Auth jika ada sesi aktif
      if (isSupabaseConfigured) {
        try {
          await supabase.auth.updateUser({
            password: trimmedNew,
          });
        } catch (authSyncErr) {
          console.log("[ModalUbahPassword] Supabase auth update notice (offline/fallback mode active):", authSyncErr);
        }
      }

      setSuccessMsg("Kata sandi berhasil diperbarui! Gunakan kata sandi baru ini untuk login berikutnya.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengubah kata sandi. Coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
      data-lenis-prevent="true"
      onClick={handleClose}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 z-10 overflow-y-auto overscroll-contain my-auto max-h-[90vh]"
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Ubah Kata Sandi</h3>
              <p className="text-xs text-gray-500">Ganti kata sandi akun Anda</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alert Error / Success */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-2xl mb-4 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* Kata sandi saat ini */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kata Sandi Saat Ini</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showCurrent ? "text" : "password"}
                required
                placeholder="Masukkan kata sandi saat ini"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-200 pt-1" />

          {/* Kata sandi baru */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kata Sandi Baru</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showNew ? "text" : "password"}
                required
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Konfirmasi kata sandi baru */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Konfirmasi Kata Sandi Baru</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showNew ? "text" : "password"}
                required
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Simpan Kata Sandi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
