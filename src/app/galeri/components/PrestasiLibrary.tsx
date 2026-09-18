"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Award,
  Search,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ZoomIn,
  X,
  PlusCircle,
  Building2,
  Tag,
  Medal,
} from "lucide-react";
import { PrestasiData } from "@/lib/galeriData";
import { useAuth } from "@/context/AuthContext";

interface PrestasiLibraryProps {
  prestasiList: PrestasiData[];
  isLoading: boolean;
}

const tingkatFilters = [
  "Semua Tingkat",
  "Internasional",
  "Nasional",
  "Provinsi",
  "Kabupaten/Kota",
  "Sekolah",
];

export default function PrestasiLibrary({ prestasiList, isLoading }: PrestasiLibraryProps) {
  const { profile } = useAuth();
  const [selectedTingkat, setSelectedTingkat] = useState("Semua Tingkat");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<PrestasiData | null>(null);

  React.useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Filter Prestasi
  const filteredList = prestasiList.filter((item) => {
    const matchesTingkat =
      selectedTingkat === "Semua Tingkat" || item.tingkat === selectedTingkat;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.nama.toLowerCase().includes(query) ||
      item.author_nama.toLowerCase().includes(query) ||
      (item.penyelenggara && item.penyelenggara.toLowerCase().includes(query)) ||
      (item.jurusan && item.jurusan.toLowerCase().includes(query));

    return matchesTingkat && matchesSearch;
  });

  const getJuaraBadgeStyle = (juara: string) => {
    const j = juara.toLowerCase();
    if (j.includes("1") || j.includes("emas") || j.includes("gold") || j.includes("pertama")) {
      return "from-amber-400 via-yellow-400 to-yellow-500 text-slate-900 border-yellow-200 shadow-yellow-500/20";
    }
    if (j.includes("2") || j.includes("perak") || j.includes("silver") || j.includes("kedua")) {
      return "from-slate-300 via-gray-300 to-slate-400 text-slate-900 border-slate-200 shadow-slate-400/20";
    }
    if (j.includes("3") || j.includes("perunggu") || j.includes("bronze") || j.includes("ketiga")) {
      return "from-amber-600 via-amber-700 to-orange-700 text-white border-amber-600 shadow-amber-700/20";
    }
    return "from-blue-500 to-indigo-600 text-white border-blue-400 shadow-blue-500/20";
  };

  const getTingkatBadgeStyle = (tingkat: string) => {
    switch (tingkat) {
      case "Internasional":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Nasional":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "Provinsi":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Kabupaten/Kota":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Info */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              <Trophy className="w-4 h-4 text-yellow-200 animate-bounce" />
              <span>Library Prestasi Siswa Rayon Cisarua 3</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Pusat Apresiasi & Rekam Prestasi Siswa
            </h2>
            <p className="text-white/90 text-sm mt-2 leading-relaxed">
              Setiap pencapaian, lomba, dan sertifikat yang diraih oleh siswa Rayon Cisarua 3
              didokumentasikan secara rapi di sini untuk memotivasi satu sama lain.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-yellow-50 font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <PlusCircle className="w-4 h-4 text-amber-600" />
              <span>Tambah Prestasi di Profil</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, nama lomba, atau jurusan..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Stats indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 px-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Menampilkan <b>{filteredList.length}</b> prestasi</span>
          </div>
        </div>

        {/* Tingkat Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {tingkatFilters.map((tingkat) => {
            const isSelected = selectedTingkat === tingkat;
            return (
              <button
                key={tingkat}
                onClick={() => setSelectedTingkat(tingkat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-slate-800"
                  }`}
              >
                {tingkat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prestasi Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-2xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Tidak ada prestasi ditemukan</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau filter tingkat lomba.
          </p>
          <div className="pt-2">
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Tambah Prestasi Pertama
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Certificate / Documentation Photo Box */}
                <div className="relative h-52 bg-slate-900 overflow-hidden rounded-t-3xl">
                  {item.foto_url ? (
                    <img
                      src={item.foto_url}
                      alt={item.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setSelectedImage(item)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-500/20 via-yellow-500/30 to-emerald-500/20 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                      <Award className="w-12 h-12 text-yellow-500/60 mb-2" />
                      <span className="text-xs font-semibold text-slate-600">Dokumentasi Sertifikat</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Juara Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r ${getJuaraBadgeStyle(
                        item.juara
                      )} shadow-md border`}
                    >
                      <Medal className="w-3.5 h-3.5" />
                      {item.juara}
                    </span>
                  </div>

                  {/* Tingkat Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getTingkatBadgeStyle(
                        item.tingkat
                      )} backdrop-blur-md shadow-sm`}
                    >
                      <Tag className="w-3 h-3" />
                      {item.tingkat}
                    </span>
                  </div>

                  {/* Zoom Action Hint */}
                  {item.foto_url && (
                    <button
                      onClick={() => setSelectedImage(item)}
                      className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      title="Lihat Sertifikat Penuh"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  )}

                  {/* Author Name on bottom of photo */}
                  <div className="absolute bottom-3 left-3 right-12 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-black text-[10px] shadow-sm">
                      {item.author_nama.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-white truncate drop-shadow-md">
                      {item.author_nama}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-2 group-hover:text-yellow-600 transition-colors">
                      {item.nama}
                    </h3>

                    {item.penyelenggara && (
                      <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 mt-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{item.penyelenggara}</span>
                      </p>
                    )}
                  </div>

                  {item.deskripsi && (
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {item.jurusan && (
                  <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                    {item.jurusan}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Lightbox Sertifikat Viewer */}
      <AnimatePresence>
        {selectedImage && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain"
            data-lenis-prevent="true"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col overscroll-contain my-auto"
              data-lenis-prevent="true"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-black text-sm">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-800 line-clamp-1">
                      {selectedImage.nama}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">
                      Oleh: <b>{selectedImage.author_nama}</b> • {selectedImage.juara} ({selectedImage.tingkat})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Preview Container */}
              <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 overflow-auto max-h-[60vh]">
                <img
                  src={selectedImage.foto_url}
                  alt={selectedImage.nama}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
                />
              </div>

              {/* Footer info */}
              <div className="p-4 sm:p-5 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="text-slate-700 font-medium">{selectedImage.deskripsi || "Dokumentasi sertifikat resmi prestasi siswa."}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Penyelenggara: {selectedImage.penyelenggara || "Rayon Cisarua 3"} • Tanggal:{" "}
                    {new Date(selectedImage.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <a
                  href={selectedImage.foto_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-700 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Gambar Asli
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
