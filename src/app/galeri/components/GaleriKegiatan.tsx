"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Image as ImageIcon,
  Plus,
  Calendar,
  User,
  Tag,
  ZoomIn,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Upload,
  Lock,
} from "lucide-react";
import { GaleriData, saveNewGaleri } from "@/lib/galeriData";
import { useAuth } from "@/context/AuthContext";

interface GaleriKegiatanProps {
  galeriList: GaleriData[];
  isLoading: boolean;
  onItemAdded: (item: GaleriData) => void;
}

const kategoriFilters = [
  "Semua Kategori",
  "Kegiatan Rayon",
  "Dokumentasi Rayon",
  "Acara Sekolah",
  "Kebersamaan",
  "Prestasi & Lomba",
];

export default function GaleriKegiatan({
  galeriList,
  isLoading,
  onItemAdded,
}: GaleriKegiatanProps) {
  const { profile, role } = useAuth();
  const [selectedKategori, setSelectedKategori] = useState("Semua Kategori");
  const [selectedItem, setSelectedItem] = useState<GaleriData | null>(null);

  // Modal Tambah Foto (Hanya Pengurus, Admin, Guru)
  const [showAddModal, setShowAddModal] = useState(false);
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState<GaleriData["kategori"]>("Kegiatan Rayon");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [fotoUrl, setFotoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Hak akses: hanya admin, guru, dan pengurus
  const canAddGaleri = ["admin", "guru", "pengurus"].includes(role);

  const filteredList = galeriList.filter((item) => {
    if (selectedKategori === "Semua Kategori") return true;
    return item.kategori === selectedKategori;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFotoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !fotoUrl.trim()) {
      setFormMsg({ type: "err", text: "Judul dan foto wajib diisi." });
      return;
    }

    setIsSubmitting(true);
    setFormMsg(null);

    try {
      const authorNama = profile?.nama || (role === "guru" ? "Guru / PS" : role === "admin" ? "Admin" : "Pengurus Rayon");
      const newItem = await saveNewGaleri({
        judul: judul.trim(),
        kategori,
        deskripsi: deskripsi.trim(),
        foto_url: fotoUrl,
        tanggal,
        author_nama: authorNama,
        created_by_role: role,
      });

      onItemAdded(newItem);
      setFormMsg({ type: "ok", text: "Foto kegiatan berhasil ditambahkan ke Galeri!" });
      setTimeout(() => {
        setShowAddModal(false);
        setJudul("");
        setDeskripsi("");
        setFotoUrl("");
        setImagePreview(null);
        setFormMsg(null);
      }, 1500);
    } catch (err: any) {
      setFormMsg({ type: "err", text: err.message || "Gagal menyimpan foto kegiatan." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Role Action */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              <Camera className="w-4 h-4 text-cyan-200" />
              <span>Dokumentasi Rayon Cisarua 3</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Galeri Kegiatan & Momen Kebersamaan
            </h2>
            <p className="text-white/90 text-sm mt-2 leading-relaxed">
              Kumpulan dokumentasi resmi kebersamaan, aksi rayon, kegiatan belajar, dan agenda penting siswa bersama pembimbing.
            </p>
          </div>

          {canAddGaleri ? (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-blue-50 font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Tambah Foto Kegiatan</span>
            </button>
          ) : (
            <div className="bg-black/20 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 text-white/90">
              <ShieldCheck className="w-4 h-4 text-yellow-300" />
              <span>Dikelola oleh Pengurus & Guru Rayon</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar w-full sm:w-auto">
          {kategoriFilters.map((kat) => {
            const isSelected = selectedKategori === kat;
            return (
              <button
                key={kat}
                onClick={() => setSelectedKategori(kat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-slate-800"
                }`}
              >
                {kat}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 self-end sm:self-center">
          <ImageIcon className="w-4 h-4 text-blue-500" />
          <span><b>{filteredList.length}</b> Foto Dokumentasi</span>
        </div>
      </div>

      {/* Gallery Masonry / Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 animate-pulse"
            >
              <div className="h-56 bg-gray-200 rounded-2xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Belum ada foto dokumentasi kegiatan</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            {canAddGaleri
              ? "Belum ada foto yang diunggah. Klik tombol 'Tambah Foto Kegiatan' di atas untuk mempublikasikan dokumentasi baru."
              : "Foto dokumentasi kegiatan Rayon Cisarua 3 akan diunggah oleh Pengurus Rayon dan Guru Pembimbing."}
          </p>
          {canAddGaleri && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Foto Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-60 bg-slate-900 overflow-hidden">
                  <img
                    src={item.foto_url}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/10 to-transparent" />

                  {/* Kategori Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-white/90 backdrop-blur-md text-slate-800 shadow-md">
                      <Tag className="w-3 h-3 text-blue-600" />
                      {item.kategori}
                    </span>
                  </div>

                  {/* Zoom hint */}
                  <div className="absolute bottom-3 right-3 p-2 bg-white/90 text-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                    <ZoomIn className="w-4 h-4" />
                  </div>

                  {/* Date on photo */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90 text-xs font-semibold drop-shadow-md">
                    <Calendar className="w-3.5 h-3.5 text-yellow-300" />
                    <span>
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-extrabold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.judul}
                  </h3>
                  {item.deskripsi && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-5 pb-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span className="font-medium">Oleh: {item.author_nama}</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                  Dokumentasi
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Viewer Kegiatan */}
      <AnimatePresence>
        {selectedItem && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-800 line-clamp-1">
                      {selectedItem.judul}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">
                      {selectedItem.kategori} • Diunggah oleh <b>{selectedItem.author_nama}</b>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 overflow-auto max-h-[60vh]">
                <img
                  src={selectedItem.foto_url}
                  alt={selectedItem.judul}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
                />
              </div>

              <div className="p-5 bg-white border-t border-gray-100 text-xs space-y-1">
                <p className="text-slate-800 font-medium leading-relaxed">
                  {selectedItem.deskripsi || "Dokumentasi kebersamaan dan kegiatan Rayon Cisarua 3."}
                </p>
                <p className="text-gray-400 text-[11px]">
                  Tanggal:{" "}
                  {new Date(selectedItem.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Tambah Foto Galeri (Restricted to Admin, Guru, Pengurus) */}
      <AnimatePresence>
        {showAddModal && canAddGaleri && (
          <div
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base">Tambah Foto Kegiatan Rayon</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-gray-400 hover:text-slate-700 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    formMsg.type === "ok"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {formMsg.type === "ok" ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{formMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Kegiatan / Foto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kunjungan Rutin Rayon Cisarua 3"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kategori *
                    </label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value as any)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Kegiatan Rayon">Kegiatan Rayon</option>
                      <option value="Dokumentasi Rayon">Dokumentasi Rayon</option>
                      <option value="Acara Sekolah">Acara Sekolah</option>
                      <option value="Kebersamaan">Kebersamaan</option>
                      <option value="Prestasi & Lomba">Prestasi & Lomba</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tanggal Kegiatan *
                    </label>
                    <input
                      type="date"
                      required
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deskripsi / Catatan Kegiatan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan ringkasan singkat kegiatan ini..."
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Upload Foto / URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Foto Kegiatan *
                  </label>

                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                      <Upload className="w-6 h-6 text-blue-500 mb-1" />
                      <span className="text-xs font-bold text-blue-700">Pilih Foto dari Perangkat</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP (Maks 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="relative">
                      <input
                        type="url"
                        placeholder="Atau masukkan Link / URL Gambar langsung..."
                        value={fotoUrl.startsWith("data:") ? "" : fotoUrl}
                        onChange={(e) => {
                          setFotoUrl(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {imagePreview && (
                      <div className="relative h-36 bg-slate-100 rounded-2xl overflow-hidden border border-gray-200 mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFotoUrl("");
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg shadow cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !judul.trim() || !fotoUrl.trim()}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    Publikasikan ke Galeri
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
