"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import LoginSiswa from "./components/LoginSiswa";
import ProfilSiswa from "./components/ProfilSiswa";
import { daftarSiswa, type Siswa } from "@/lib/siswaData";

// ── Inner component yang pakai useSearchParams ────────────────────────────────
function LoginPageInner() {
  const [loggedIn, setLoggedIn] = useState<Siswa | null>(null);
  const [loading, setLoading]   = useState(true);
  const router       = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const session = sessionStorage.getItem("siswa_session");
    const fromNav = searchParams.get("from") === "nav";

    if (session) {
      // Session aktif → tampilkan profil
      try {
        const parsed = JSON.parse(session) as { id: number };
        const found  = daftarSiswa.find((s) => s.id === parsed.id);
        if (found) {
          setLoggedIn(found);
          setLoading(false);
          return;
        }
      } catch {
        sessionStorage.removeItem("siswa_session");
      }
    }

    if (!fromNav) {
      // Tidak ada session & bukan dari klik navbar (misal refresh) → balik beranda
      router.replace("/");
      return;
    }

    // Dari navbar, belum login → tampilkan form login
    setLoading(false);
  }, [router, searchParams]);

  const handleLogin = (siswa: Siswa) => {
    sessionStorage.setItem("siswa_session", JSON.stringify({ id: siswa.id }));
    // Beri tahu Navbar bahwa session berubah
    window.dispatchEvent(new Event("sessionchange"));
    setLoggedIn(siswa);
    // Setelah login, balik ke beranda
    router.replace("/");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("siswa_session");
    // Beri tahu Navbar bahwa session berubah
    window.dispatchEvent(new Event("sessionchange"));
    setLoggedIn(null);
    router.replace("/");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Navbar />

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : loggedIn ? (
        <ProfilSiswa siswa={loggedIn} onLogout={handleLogout} />
      ) : (
        <LoginSiswa onLogin={handleLogin} />
      )}
    </div>
  );
}

// ── Outer wrapper dengan Suspense (wajib untuk useSearchParams di Next.js) ────
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
