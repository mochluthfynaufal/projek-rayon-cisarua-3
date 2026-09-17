"use client";
import { useState } from "react";
import { LogIn, Eye, EyeOff, User, KeyRound, AlertCircle, ShieldCheck } from "lucide-react";
import { daftarSiswa, type Siswa } from "@/lib/siswaData";

interface Props {
  onLogin: (siswa: Siswa) => void;
}

export default function LoginSiswa({ onLogin }: Props) {
  const [nama, setNama] = useState("");
  const [nis, setNis] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulasi delay kecil biar feel loginnya bagus
    setTimeout(() => {
      const trimNama = nama.trim().toLowerCase();
      const trimNis = nis.trim();

      const found = daftarSiswa.find(
        (s) =>
          s.nama.toLowerCase() === trimNama &&
          s.nis === trimNis &&
          s.angkatan !== "Alumni"
      );

      if (found) {
        onLogin(found);
      } else {
        setError("Nama atau NIS tidak cocok. Pastikan nama ditulis lengkap dan benar.");
      }
      setLoading(false);
    }, 700);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16 relative">
      {/* Ambient background glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-emerald-950/10 border border-emerald-100/80 overflow-hidden">

          {/* Header Full-Color Gradient */}
          <div className="bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 px-8 pt-10 pb-14 text-center relative overflow-hidden">
            {/* Decorative colored lights */}
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-amber-300/30 rounded-full blur-xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-300/30 rounded-full blur-xl" />
            <div className="absolute top-1/2 right-4 w-20 h-20 bg-emerald-300/25 rounded-full blur-lg" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/30 text-amber-300">
                <ShieldCheck className="w-8 h-8 text-white drop-shadow" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mb-1 drop-shadow-sm">
                Portal Siswa
              </h1>
              <div className="inline-flex items-center gap-1.5 bg-black/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-100 border border-white/20 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                Rayon Cisarua 3 · SMK Wikrama
              </div>
            </div>
          </div>

          {/* Form area — lifted over the gradient */}
          <div className="-mt-6 mx-6 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-slate-700 mb-5 text-center flex items-center justify-center gap-2">
              <span>👋</span> Masuk dengan Akun Kamu
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => { setNama(e.target.value); setError(""); }}
                    placeholder="Contoh: Moch Luthfy Naufal"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-medium text-slate-800 placeholder-slate-400"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Tulis nama lengkap sesuai data sekolah</p>
              </div>

              {/* NIS sebagai Password */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  NIS (Kata Sandi)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={nis}
                    onChange={(e) => { setNis(e.target.value); setError(""); }}
                    placeholder="Masukkan NIS kamu"
                    required
                    className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all font-mono font-semibold tracking-widest text-slate-800 placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Kata sandi kamu adalah NIS sekolah</p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl p-3.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700 leading-relaxed font-medium">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Masuk Sekarang
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="px-8 py-5 text-center">
            <p className="text-xs text-slate-400">
              Hanya untuk siswa aktif Rayon Cisarua 3 · Data tersimpan aman di perangkat
            </p>
          </div>
        </div>

        {/* Hint box - Colorful sunny warm look */}
        <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-amber-800 font-bold mb-1 flex items-center gap-1.5">
            <span>💡</span> Lupa NIS?
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            NIS kamu bisa dilihat di kartu pelajar, buku rapor, atau tanyakan ke pembimbing siswa (PS).
          </p>
        </div>
      </div>
    </main>
  );
}
