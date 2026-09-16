"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Leaf,
  BookOpen,
  Users,
  Home,
  LogIn,
  LogOut,
  MessageSquareWarning,
  KeyRound,
  UserCircle2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ModalUbahPassword from "@/app/components/ModalUbahPassword";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, logout } = useAuth();

  // Theme colors based on route
  const getThemeColors = () => {
    if (pathname === "/belajar") {
      return {
        primary: "yellow",
        gradient: "from-yellow-500 to-yellow-600",
        gradientHover: "from-yellow-600 to-yellow-700",
        text: "from-yellow-600 to-yellow-600",
        bg: "bg-yellow-100",
        bgHover: "hover:bg-yellow-50/80",
        textHover: "hover:text-yellow-600",
        borderColor: "border-yellow-100",
        gradientOverlay: "from-yellow-400 to-yellow-500",
      };
    } else if (pathname === "/contact" || pathname === "/keluhan") {
      return {
        primary: "yellow",
        gradient: "from-yellow-500 to-amber-600",
        gradientHover: "from-yellow-600 to-amber-700",
        text: "from-yellow-600 to-amber-600",
        bg: "bg-yellow-100",
        bgHover: "hover:bg-yellow-50/80",
        textHover: "hover:text-yellow-600",
        borderColor: "border-yellow-100",
        gradientOverlay: "from-yellow-400 to-amber-500",
      };
    } else if (pathname === "/komunitas") {
      return {
        primary: "blue",
        gradient: "from-blue-500 to-blue-600",
        gradientHover: "from-blue-600 to-blue-700",
        text: "from-blue-600 to-blue-600",
        bg: "bg-blue-100",
        bgHover: "hover:bg-blue-50/80",
        textHover: "hover:text-blue-600",
        borderColor: "border-blue-100",
        gradientOverlay: "from-blue-400 to-blue-500",
      };
    } else if (pathname === "/quiz") {
      return {
        primary: "emerald",
        gradient: "from-emerald-500 via-teal-500 to-cyan-600",
        gradientHover: "from-emerald-600 via-teal-600 to-cyan-700",
        text: "from-emerald-600 to-teal-600",
        bg: "bg-emerald-100",
        bgHover: "hover:bg-emerald-50/80",
        textHover: "hover:text-emerald-600",
        borderColor: "border-emerald-100",
        gradientOverlay: "from-emerald-400 to-teal-500",
      };
    }
    return {
      primary: "emerald",
      gradient: "from-green-500 to-emerald-600",
      gradientHover: "from-green-600 to-emerald-700",
      text: "from-green-600 to-emerald-600",
      bg: "bg-green-100",
      bgHover: "hover:bg-green-50/80",
      textHover: "hover:text-green-600",
      borderColor: "border-green-100",
      gradientOverlay: "from-green-400 to-emerald-500",
    };
  };

  const theme = getThemeColors();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      icon: Home,
      label: "Beranda",
      href: "/",
    },
    {
      icon: BookOpen,
      label: "Rayon & Kelas",
      href: "/belajar",
    },
    {
      icon: MessageSquareWarning,
      label: "Keluhan Rayon",
      href: "/contact",
    },
    {
      icon: Users,
      label: "Komunitas",
      href: "/komunitas",
    },
  ];

  const getRoleBadge = () => {
    switch (role) {
      case "admin":
        return { label: "Admin", bg: "bg-red-100 text-red-800" };
      case "guru":
        return { label: "Guru / PS", bg: "bg-purple-100 text-purple-800" };
      case "pengurus":
        return { label: "Pengurus", bg: "bg-yellow-100 text-yellow-800" };
      case "siswa":
        return { label: "Siswa", bg: "bg-blue-100 text-blue-800" };
      default:
        return null;
    }
  };

  const roleBadge = getRoleBadge();
  const isLoggedIn = !!user || !!profile;

  return (
    <>
      {/* Desktop Navbar - Capsule Shape */}
      <nav
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[90] transition-all duration-500 ease-in-out ${
          scrolled ? "scale-95 top-4" : "scale-100"
        }`}
      >
        <div
          className={`backdrop-blur-md rounded-full px-6 py-2.5 bg-white/90 hover:bg-white/98 border border-white/80 hover:border-gray-300/80 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 ${
            scrolled ? "py-2 bg-white/95 backdrop-blur-lg shadow-md" : ""
          }`}
        >
          <div className="flex items-center justify-center">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Logo/Brand */}
              <a
                href="/"
                className="group flex items-center space-x-2 pr-3 transition-transform duration-300 hover:scale-105 cursor-pointer"
              >
                <div
                  className={`bg-gradient-to-br ${theme.gradient} p-2 rounded-full shadow-sm group-hover:shadow-md group-hover:rotate-12 transition-all duration-300`}
                >
                  <Leaf className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span
                  className={`font-bold text-lg whitespace-nowrap bg-gradient-to-r ${theme.text} bg-clip-text text-transparent group-hover:opacity-90`}
                >
                  Cisarua 3
                </span>
              </a>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-200 mx-1"></div>

              {/* Nav Items Container */}
              <div
                className="flex items-center space-x-1 relative"
                onMouseLeave={() => setHoveredHref(null)}
              >
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const activeTarget = hoveredHref ?? pathname;
                  const isSelected = activeTarget === item.href;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onMouseEnter={() => setHoveredHref(item.href)}
                      className={`relative flex items-center space-x-1.5 px-3.5 py-2 rounded-full transition-colors duration-200 select-none z-10 ${
                        isSelected
                          ? `${theme.textHover.replace("hover:", "")} font-semibold`
                          : "text-gray-600 hover:text-gray-900 font-medium"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="nav-sliding-pill"
                          className={`absolute inset-0 ${theme.bg} rounded-full -z-10 shadow-sm`}
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 32,
                          }}
                        />
                      )}
                      <IconComponent
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSelected ? "scale-110 -rotate-3" : ""
                        }`}
                      />
                      <span className="text-sm whitespace-nowrap">
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-200 mx-1"></div>

              {/* User Account / Login Button */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <a
                    href="/profil"
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-extrabold px-3.5 py-1.5 rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 text-xs whitespace-nowrap"
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-black text-[10px]">
                      {profile?.nama ? profile.nama.charAt(0).toUpperCase() : "P"}
                    </div>
                    <span>Profil</span>
                    {roleBadge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/50 text-slate-900">
                        {roleBadge.label}
                      </span>
                    )}
                  </a>
                  <button
                    onClick={async () => {
                      await logout();
                      router.push("/");
                    }}
                    title="Keluar / Logout"
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <a
                  href="/auth/login"
                  className={`bg-gradient-to-r ${theme.gradient} text-white px-4 py-2 rounded-full font-bold text-xs hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap flex items-center gap-1.5`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </a>
              )}
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between min-w-[280px]">
              <div className="flex items-center space-x-2">
                <div className={`bg-gradient-to-br ${theme.gradient} p-2 rounded-full`}>
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className={`font-bold text-lg whitespace-nowrap bg-gradient-to-r ${theme.text} bg-clip-text text-transparent`}>
                  Cisarua 3
                </span>
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full ${theme.bgHover} transition-colors duration-200`}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>

        <div
          className={`absolute top-24 left-4 right-4 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border ${
            theme.borderColor
          } p-6 transform transition-all duration-300 max-h-[80vh] overflow-y-auto ${
            isOpen ? "translate-y-0 scale-100" : "-translate-y-4 scale-95"
          }`}
        >
          <div className="space-y-2">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? `${theme.bg} ${theme.textHover.replace("hover:", "")} shadow-sm font-bold`
                      : `text-gray-700 ${theme.textHover} ${theme.bgHover}`
                  }`}
                >
                  <div className={`${isActive ? theme.bg : theme.bg} p-2 rounded-full transition-colors duration-200`}>
                    <IconComponent className={`w-5 h-5 ${isActive ? theme.textHover.replace("hover:", "") : `text-${theme.primary}-600`}`} />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-slate-900 text-sm">
                    {profile?.nama ? profile.nama.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{profile?.nama || "Pengguna"}</p>
                    <p className="text-xs text-gray-500 truncate">{profile?.email || user?.email || ""}</p>
                  </div>
                  {roleBadge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleBadge.bg}`}>
                      {roleBadge.label}
                    </span>
                  )}
                </div>
                <a
                  href="/profil"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-extrabold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <UserCircle2 className="w-4 h-4" /> Profil Saya
                </a>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowChangePassword(true);
                  }}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-slate-700 font-semibold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-gray-200 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-yellow-600" /> Ubah Kata Sandi
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    setIsOpen(false);
                    router.push("/");
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            ) : (
              <a
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className={`w-full bg-gradient-to-r ${theme.gradient} text-white py-3 rounded-2xl font-bold text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
              >
                <LogIn className="w-4 h-4" />
                Masuk ke Akun
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Modal Ubah Kata Sandi */}
      <ModalUbahPassword
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
}
