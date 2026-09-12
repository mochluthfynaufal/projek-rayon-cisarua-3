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
    <main className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* Header Gradient */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 px-8 pt-10 pb-14 text-center relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full translate-x-1/4 translate-y-1/4" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Portal Siswa</h1>
              <p className="text-indigo-200 text-sm">Rayon Cisarua 3 · SMK Wikrama</p>
            </div>
          </div>

          {/* Form area — lifted over the gradient */}
          <div className="-mt-6 mx-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-5 text-center">
              Masuk dengan akun kamu
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => { setNama(e.target.value); setError(""); }}
                    placeholder="Contoh: Moch Luthfy Naufal"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Tulis nama lengkap sesuai data sekolah</p>
              </div>

              {/* NIS sebagai Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  NIS (Kata Sandi)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={nis}
                    onChange={(e) => { setNis(e.target.value); setError(""); }}
                    placeholder="Masukkan NIS kamu"
                    required
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Kata sandi kamu adalah NIS sekolah</p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3.5">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Masuk
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="px-8 py-5 text-center">
            <p className="text-xs text-gray-400">
              Hanya untuk siswa aktif Rayon Cisarua 3 · Data tersimpan di perangkat ini
            </p>
          </div>
        </div>

        {/* Hint box */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-amber-700 font-medium mb-1">💡 Lupa NIS?</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            NIS kamu bisa dilihat di kartu pelajar, buku rapor, atau tanyakan ke wali kelas.
          </p>
        </div>
      </div>
    </main>
  );
}
