"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Leaf,
  BookOpen,
  Users,
  Phone,
  Home,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { daftarSiswa, type Siswa } from "@/lib/siswaData";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siswaLogin, setSiswaLogin] = useState<Siswa | null>(null);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const pathname = usePathname();

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
    } else if (pathname === "/contact") {
      return {
        primary: "red",
        gradient: "from-red-500 to-red-600",
        gradientHover: "from-red-600 to-red-700",
        text: "from-red-600 to-red-600",
        bg: "bg-red-100",
        bgHover: "hover:bg-red-50/80",
        textHover: "hover:text-red-600",
        borderColor: "border-red-100",
        gradientOverlay: "from-red-400 to-red-500",
      };
    }
    // Default emerald theme for home and other routes
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

  // Baca session siswa dari sessionStorage
  useEffect(() => {
    const checkSession = () => {
      const saved = sessionStorage.getItem("siswa_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { id: number };
          const found = daftarSiswa.find((s) => s.id === parsed.id) ?? null;
          setSiswaLogin(found);
        } catch {
          setSiswaLogin(null);
        }
      } else {
        setSiswaLogin(null);
      }
    };
    checkSession();
    // sessionStorage tidak memicu event 'storage', pakai custom event
    window.addEventListener("sessionchange", checkSession);
    return () => window.removeEventListener("sessionchange", checkSession);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simplified nav items without dropdown
  const navItems = [
    {
      icon: Home,
      label: "Beranda",
      href: "/",
    },
    {
      icon: BookOpen,
      label: "Kelas",
      href: "/belajar",
    },
    {
      icon: Users,
      label: "Komunitas",
      href: "/komunitas",
    },
    {
      icon: Phone,
      label: "Kontak",
      href: "/contact",
    },
  ];

  return (
    <>
      {/* Desktop Navbar - Capsule Shape */}
      <nav
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[90] transition-all duration-500 ease-in-out  ${
          scrolled ? "scale-95 top-4" : "scale-100"
        }`}
      >
        <div
          className={`backdrop-blur-md rounded-full px-7 py-2.5 bg-white/85 hover:bg-white/95 border border-white/80 hover:border-gray-300/80 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 ${
            scrolled ? "py-2 bg-white/95 backdrop-blur-lg shadow-md" : ""
          }`}
        >
          <div className="flex items-center justify-center">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Logo/Brand */}
              <a
                href="/"
                className="group flex items-center space-x-2 pr-4 transition-transform duration-300 hover:scale-105 cursor-pointer"
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
              <div className="w-px h-6 bg-gray-200 mx-2"></div>

              {/* Nav Items Container with sliding active pill */}
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
                      className={`relative flex items-center space-x-2 px-4.5 py-2 rounded-full transition-colors duration-200 select-none z-10 ${
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
              <div className="w-px h-6 bg-gray-200 mx-2"></div>

              {/* CTA Button — Avatar jika login, Login Siswa jika belum */}
              {siswaLogin ? (
                <a
                  href="/quiz"
                  className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-105 active:scale-95 px-3 py-1.5 rounded-full transition-all duration-300 group"
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 ${siswaLogin.warnaBg} rounded-full flex items-center justify-center shadow-sm flex-shrink-0 group-hover:rotate-6 transition-transform duration-300`}>
                    <span className="text-white font-extrabold text-[10px]">{siswaLogin.inisial}</span>
                  </div>
                  {/* Nama dipersingkat */}
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 max-w-[120px] truncate">
                    {siswaLogin.nama.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 flex-shrink-0" />
                </a>
              ) : (
                <a
                  href="/quiz?from=nav"
                  className={`bg-gradient-to-r ${theme.gradient} text-white px-5 py-2.5 rounded-full font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap flex items-center gap-2 group`}
                >
                  <LogIn className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  <span>Login</span>
                </a>
              )}
            </div>

            {/* Mobile Content */}
            <div className="md:hidden  flex items-center justify-between min-w-82 ">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div
                  className={`bg-gradient-to-br ${theme.gradient} p-2 rounded-full`}
                >
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`font-bold text-lg whitespace-nowrap bg-gradient-to-r ${theme.text} bg-clip-text text-transparent`}
                >
                  Cisarua 3
                </span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full ${theme.bgHover} transition-colors duration-200`}
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed  inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Mobile Menu Panel */}
        <div
          className={`absolute top-25 left-4 right-4 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border ${
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
                      ? `${theme.bg} ${theme.textHover.replace(
                          "hover:",
                          ""
                        )} shadow-sm`
                      : `text-gray-700 ${theme.textHover} ${theme.bgHover}`
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isOpen
                      ? "slideInLeft 300ms ease-out forwards"
                      : "none",
                  }}
                >
                  <div
                    className={`${
                      isActive ? theme.bg : theme.bg
                    } p-2 rounded-full transition-colors duration-200`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        isActive
                          ? theme.textHover.replace("hover:", "")
                          : `text-${theme.primary}-600`
                      }`}
                    />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            {siswaLogin ? (
              <a
                href="/quiz"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-3 rounded-2xl transition-all duration-200"
              >
                <div className={`w-10 h-10 ${siswaLogin.warnaBg} rounded-full flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <span className="text-white font-extrabold text-sm">{siswaLogin.inisial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{siswaLogin.nama}</p>
                  <p className="text-xs text-gray-500">Lihat profil saya</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
              </a>
            ) : (
              <a
                href="/quiz?from=nav"
                className={`w-full bg-gradient-to-r ${theme.gradient} text-white py-3 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
              >
                <LogIn className="w-4 h-4" />
                Login
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
