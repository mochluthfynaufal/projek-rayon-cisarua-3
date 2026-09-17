"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Camera,
  Award,
  Sparkles,
  Users,
  Star,
  PlusCircle,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import PrestasiLibrary from "./components/PrestasiLibrary";
import GaleriKegiatan from "./components/GaleriKegiatan";
import {
  PrestasiData,
  GaleriData,
  fetchAllPrestasi,
  fetchAllGaleri,
} from "@/lib/galeriData";

export default function GaleriPage() {
  // Default tab adalah kegiatan (Galeri Dokumentasi dulu, bukan prestasi)
  const [activeTab, setActiveTab] = useState<"kegiatan" | "prestasi">("kegiatan");
  const [prestasiList, setPrestasiList] = useState<PrestasiData[]>([]);
  const [galeriList, setGaleriList] = useState<GaleriData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [pres, gal] = await Promise.all([
          fetchAllPrestasi(),
          fetchAllGaleri(),
        ]);
        setPrestasiList(pres);
        setGaleriList(gal);
      } catch (e) {
        console.error("Error loading gallery & prestasi:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleGaleriItemAdded = (newItem: GaleriData) => {
    setGaleriList((prev) => [newItem, ...prev]);
  };

  const scrollToSection = (tab: "kegiatan" | "prestasi") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const element = document.getElementById("galeri-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Hero Props mengikuti model tampilan awal yang sama seperti sebelumnya
  const galeriHeroProps = {
    title: "Galeri & Prestasi",
    highlightPrefix: "Rayon",
    rotatingTexts: [
      "Cisarua 3!",
      "Dokumentasi!",
      "Kebersamaan!",
      "Berprestasi!",
      "Berkarya!",
    ],
    subtitle:
      "Dokumentasi lengkap momen kegiatan kebersamaan rayon dan deretan sertifikat pencapaian prestasi siswa Rayon Cisarua 3.",
    primaryColor: "text-blue-500",
    ctaPrimary: {
      text: "Lihat Galeri Kegiatan",
      action: () => scrollToSection("kegiatan"),
    },
    ctaSecondary: {
      text: "Prestasi Siswa",
      action: () => scrollToSection("prestasi"),
    },
    theme: {
      gradient: "bg-gradient-to-t from-blue-500/50 to-white",
      primaryColor: "bg-blue-500",
      primaryHover: "hover:bg-blue-700",
      borderColor: "border-blue-600",
      hoverBg: "hover:bg-blue-50",
    },
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-tl from-blue-100/20 via-blue-100/10 to-white">
      <Navbar />

      {/* Hero Section dengan model awal yang sama seperti sebelumnya */}
      <Hero {...galeriHeroProps} />

      {/* Stats Summary Section dengan gap top yang lega */}
      <section className="pt-20 pb-10 px-4 mt-6 sm:mt-12 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            onClick={() => setActiveTab("kegiatan")}
            className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl ${
              activeTab === "kegiatan"
                ? "bg-gradient-to-br from-blue-50 to-indigo-100/80 border-blue-300 ring-2 ring-blue-400"
                : "bg-white/90 backdrop-blur-xl border-white hover:border-blue-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-400/20 text-blue-700 flex items-center justify-center font-black">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                Dokumentasi
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800">
              {galeriList.length} <span className="text-sm font-bold text-gray-500">Foto Kegiatan</span>
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Dokumentasi resmi kebersamaan dan agenda Rayon Cisarua 3
            </p>
          </div>

          <div
            onClick={() => setActiveTab("prestasi")}
            className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl ${
              activeTab === "prestasi"
                ? "bg-gradient-to-br from-yellow-50 to-amber-100/80 border-yellow-300 ring-2 ring-yellow-400"
                : "bg-white/90 backdrop-blur-xl border-white hover:border-yellow-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 text-yellow-700 flex items-center justify-center font-black">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs font-bold text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
                Prestasi Siswa
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800">
              {prestasiList.length} <span className="text-sm font-bold text-gray-500">Sertifikat</span>
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Pencapaian lomba tingkat Sekolah, Provinsi hingga Nasional
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-700 flex items-center justify-center font-black">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Keluarga Rayon
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800">
              57 <span className="text-sm font-bold text-gray-500">Anggota</span>
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Siswa aktif Kelas X, XI & XII Pembimbing Siswa
            </p>
          </div>
        </div>
      </section>

      {/* Main Tabs & Gallery Content */}
      <section id="galeri-section" className="max-w-6xl mx-auto px-4 py-8 pb-24 relative z-10">
        {/* Tab Switcher: Galeri Kegiatan dulu di urutan pertama */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-full shadow-lg">
            <button
              onClick={() => setActiveTab("kegiatan")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                activeTab === "kegiatan"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-102"
                  : "text-gray-600 hover:text-slate-900"
              }`}
            >
              <Camera className={`w-4 h-4 ${activeTab === "kegiatan" ? "text-white" : "text-blue-500"}`} />
              <span>Galeri Dokumentasi Rayon</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === "kegiatan" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800"}`}>
                {galeriList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("prestasi")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                activeTab === "prestasi"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-md scale-102"
                  : "text-gray-600 hover:text-slate-900"
              }`}
            >
              <Trophy className={`w-4 h-4 ${activeTab === "prestasi" ? "text-slate-950" : "text-amber-500"}`} />
              <span>Library Prestasi Siswa</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === "prestasi" ? "bg-slate-950/20 text-slate-950" : "bg-yellow-100 text-yellow-800"}`}>
                {prestasiList.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === "kegiatan" ? (
            <motion.div
              key="kegiatan"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <GaleriKegiatan
                galeriList={galeriList}
                isLoading={isLoading}
                onItemAdded={handleGaleriItemAdded}
              />
            </motion.div>
          ) : (
            <motion.div
              key="prestasi"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <PrestasiLibrary prestasiList={prestasiList} isLoading={isLoading} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </div>
  );
}
