"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Bell,
  Megaphone,
  Pin,
  Calendar,
  User,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Bookmark,
  Clock,
  Sparkles,
  Info,
  Timer,
  CalendarDays,
  Check,
} from "lucide-react";
import {
  InformasiRayonData,
  KategoriInformasi,
  fetchAllInformasi,
  saveNewInformasi,
  updateInformasi,
  deleteInformasi,
  isInformasiActive,
} from "@/lib/informasiData";
import { useAuth } from "@/context/AuthContext";

const kategoriList: { key: string; label: string; color: string; badgeBg: string }[] = [
  { key: "Semua", label: "Semua", color: "text-slate-700", badgeBg: "bg-slate-100 border-slate-200" },
  { key: "Penting", label: "Penting", color: "text-red-700", badgeBg: "bg-red-50 text-red-700 border-red-200" },
  { key: "Kegiatan", label: "Kegiatan", color: "text-blue-700", badgeBg: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "Akademik", label: "Akademik", color: "text-purple-700", badgeBg: "bg-purple-50 text-purple-700 border-purple-200" },
  { key: "Kas & Keuangan", label: "Kas & Keuangan", color: "text-emerald-700", badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "Piket & Kebersihan", label: "Piket & Kebersihan", color: "text-amber-700", badgeBg: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "Umum", label: "Umum", color: "text-slate-700", badgeBg: "bg-slate-50 text-slate-700 border-slate-200" },
];

export default function InformasiRayon() {
  const { profile, role } = useAuth();
  const [informasiList, setInformasiList] = useState<InformasiRayonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState<"aktif" | "semua" | "berakhir">("aktif");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [selectedItem, setSelectedItem] = useState<InformasiRayonData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InformasiRayonData | null>(null);

  // Form states
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState<KategoriInformasi>("Penting");
  const [isi, setIsi] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [berlakuSampai, setBerlakuSampai] = useState("");
  const [authorNama, setAuthorNama] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [lampiranUrl, setLampiranUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Can manage if role is pengurus, guru (PS), or admin
  const canManage = ["admin", "guru", "pengurus"].includes(role);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllInformasi();
      setInformasiList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showAddModal || selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddModal, selectedItem]);

  const getRemainingDaysInfo = (item: InformasiRayonData) => {
    if (!item.berlaku_sampai) {
      return { text: "Selamanya", status: "forever" as const };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(item.berlaku_sampai);
    expDate.setHours(0, 0, 0, 0);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Sudah Berakhir", status: "expired" as const, days: diffDays };
    } else if (diffDays === 0) {
      return { text: "Berakhir Hari Ini", status: "urgent" as const, days: 0 };
    } else if (diffDays === 1) {
      return { text: "Sisa 1 Hari lagi", status: "warning" as const, days: 1 };
    } else {
      return { text: `Sisa ${diffDays} Hari`, status: "active" as const, days: diffDays };
    }
  };

  const filteredList = useMemo(() => {
    return informasiList.filter((item) => {
      // 1. Status Filter (Aktif / Semua / Berakhir)
      const isActive = isInformasiActive(item);
      if (statusFilter === "aktif" && !isActive) return false;
      if (statusFilter === "berakhir" && isActive) return false;

      // 2. Kategori Filter
      const matchKat = selectedKategori === "Semua" || item.kategori === selectedKategori;

      // 3. Search Query
      const matchSearch =
        searchQuery.trim() === "" ||
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.isi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author_nama.toLowerCase().includes(searchQuery.toLowerCase());

      return matchKat && matchSearch;
    });
  }, [informasiList, selectedKategori, statusFilter, searchQuery]);

  const setExpiryDaysFromStart = (days: number) => {
    const baseDate = tanggal ? new Date(tanggal) : new Date();
    baseDate.setDate(baseDate.getDate() + days);
    setHasExpiry(true);
    setBerlakuSampai(baseDate.toISOString().split("T")[0]);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setJudul("");
    setKategori("Penting");
    setIsi("");
    const todayStr = new Date().toISOString().split("T")[0];
    setTanggal(todayStr);
    setHasExpiry(false);
    setBerlakuSampai("");
    setAuthorNama(
      profile?.nama
        ? `${profile.nama} (${role === "guru" ? "Pembimbing Siswa" : role === "admin" ? "Admin" : "Pengurus Rayon"})`
        : role === "guru"
        ? "Mohamad Rizal, S.Pd. (Pembimbing Siswa)"
        : "Pengurus Rayon Cisarua 3"
    );
    setIsPinned(false);
    setLampiranUrl("");
    setShowAddModal(true);
  };

  const openEditModal = (item: InformasiRayonData) => {
    setEditingItem(item);
    setJudul(item.judul);
    setKategori(item.kategori);
    setIsi(item.isi);
    setTanggal(item.tanggal);
    if (item.berlaku_sampai) {
      setHasExpiry(true);
      setBerlakuSampai(item.berlaku_sampai);
    } else {
      setHasExpiry(false);
      setBerlakuSampai("");
    }
    setAuthorNama(item.author_nama);
    setIsPinned(!!item.is_pinned);
    setLampiranUrl(item.lampiran_url || "");
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim() || !authorNama.trim()) {
      setToastMsg({ type: "err", text: "Mohon lengkapi judul, isi pengumuman, dan nama pembuat." });
      return;
    }

    if (hasExpiry && berlakuSampai && tanggal && berlakuSampai < tanggal) {
      setToastMsg({
        type: "err",
        text: "Tanggal berakhir tidak boleh lebih awal dari tanggal mulai terbit.",
      });
      return;
    }

    setSubmitting(true);
    setToastMsg(null);

    const finalExpiry = hasExpiry && berlakuSampai ? berlakuSampai : undefined;

    try {
      if (editingItem) {
        const updated = await updateInformasi({
          ...editingItem,
          judul: judul.trim(),
          kategori,
          isi: isi.trim(),
          tanggal,
          berlaku_sampai: finalExpiry,
          author_nama: authorNama.trim(),
          is_pinned: isPinned,
          lampiran_url: lampiranUrl.trim() || undefined,
        });
        setInformasiList((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        setToastMsg({ type: "ok", text: "Informasi berhasil diperbarui!" });
      } else {
        const created = await saveNewInformasi({
          judul: judul.trim(),
          kategori,
          isi: isi.trim(),
          tanggal,
          berlaku_sampai: finalExpiry,
          author_nama: authorNama.trim(),
          author_role: (role === "guru" ? "guru" : role === "admin" ? "admin" : "pengurus") as any,
          is_pinned: isPinned,
          lampiran_url: lampiranUrl.trim() || undefined,
        });
        setInformasiList((prev) => [created, ...prev]);
        setToastMsg({ type: "ok", text: "Informasi baru berhasil diterbitkan!" });
      }

      setTimeout(() => {
        setShowAddModal(false);
        setToastMsg(null);
      }, 1200);
    } catch (err) {
      console.error(err);
      setToastMsg({ type: "err", text: "Terjadi kesalahan saat menyimpan informasi." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) return;

    try {
      await deleteInformasi(id);
      setInformasiList((prev) => prev.filter((i) => i.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus informasi.");
    }
  };

  const getBadgeStyle = (kat: string) => {
    const found = kategoriList.find((k) => k.key === kat);
    return found ? found.badgeBg : "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <section id="informasi-rayon" className="relative w-full py-20 px-4 bg-[#FFF0E6]/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FFF0E6] border border-[#FF6600]/20 px-4 py-1.5 rounded-full mb-4 shadow-2xs">
              <Megaphone className="w-4 h-4 text-[#FF6600]" />
              <span className="text-[#CC5200] font-bold text-xs uppercase tracking-wider">
                Papan Informasi Rayon
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
              Informasi & Pengumuman <span className="text-[#FF6600]">Rayon</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-2 max-w-2xl">
              Pusat informasi resmi, instruksi Pembimbing Siswa (PS), dan agenda kegiatan
              dari Pengurus Rayon Cisarua 3 untuk seluruh anggota siswa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canManage && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-[#FF6600] text-white px-5 py-2.5 rounded-2xl font-bold text-xs hover:bg-[#CC5200] transition-all shadow-md shadow-[#FF6600]/20 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Tambah Informasi
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar: Status Tabs + Search + Categories */}
        <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-5 shadow-xs mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Status Tabs (Aktif / Semua / Berakhir) */}
            <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200 gap-1 w-full md:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setStatusFilter("aktif")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === "aktif"
                    ? "bg-[#FF6600] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sedang Aktif
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("semua")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === "semua"
                    ? "bg-[#FF6600] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua Arsip
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("berakhir")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === "berakhir"
                    ? "bg-[#FF6600] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sudah Berakhir
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pengumuman..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-2xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-[#FF6600] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Kategori Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pt-2 border-t border-gray-100 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 px-1 hidden sm:inline">Kategori:</span>
            {kategoriList.map((kat) => {
              const isActive = selectedKategori === kat.key;
              return (
                <button
                  key={kat.key}
                  type="button"
                  onClick={() => setSelectedKategori(kat.key)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-gray-100 text-slate-600 hover:bg-gray-200/70"
                  }`}
                >
                  {kat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Informasi Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#FF6600]/30 border-t-[#FF6600] rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-500">Memuat informasi rayon...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center">
            <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Belum ada informasi</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedKategori !== "Semua" || statusFilter !== "aktif"
                ? "Tidak ada informasi yang sesuai dengan filter pencarian Anda."
                : "Belum ada pengumuman aktif saat ini."}
            </p>
            {canManage && (
              <button
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-2 bg-[#FF6600] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#CC5200] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Terbitkan Informasi Baru
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => {
              const remaining = getRemainingDaysInfo(item);
              const isActive = isInformasiActive(item);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group relative bg-white border rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 ${
                    !isActive
                      ? "opacity-75 bg-gray-50/70 border-gray-200"
                      : item.is_pinned
                      ? "border-[#FF6600]/40 ring-2 ring-[#FF6600]/10 bg-gradient-to-b from-[#FFF0E6]/30 to-white"
                      : "border-gray-200"
                  }`}
                >
                  <div>
                    {/* Top Bar: Pinned badge + Category + Expiry Status */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.is_pinned && (
                          <span className="inline-flex items-center gap-1 bg-[#FF6600] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                            <Pin className="w-3 h-3 fill-current" />
                            Disematkan
                          </span>
                        )}
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${getBadgeStyle(
                            item.kategori
                          )}`}
                        >
                          {item.kategori}
                        </span>
                      </div>

                      {canManage && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(item);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF6600] hover:bg-[#FFF0E6] transition-colors"
                            title="Edit Informasi"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Informasi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#FF6600] transition-colors line-clamp-2 leading-snug">
                      {item.judul}
                    </h3>

                    {/* Expiry / Duration Tag */}
                    <div className="mb-3 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          remaining.status === "expired"
                            ? "bg-gray-100 text-gray-500 line-through"
                            : remaining.status === "urgent" || remaining.status === "warning"
                            ? "bg-red-100 text-red-700 font-bold"
                            : remaining.status === "forever"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {item.berlaku_sampai
                          ? `Tampil s/d ${item.berlaku_sampai} (${remaining.text})`
                          : "Tampil Selamanya"}
                      </span>
                    </div>

                    {/* Isi preview */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-6">
                      {item.isi}
                    </p>
                  </div>

                  {/* Footer: Author & Date */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-slate-600">
                        {item.author_role === "guru" ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#FF6600]" />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-600 truncate">{item.author_nama}</span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span>{item.tanggal}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DETAIL INFORMASI */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
          data-lenis-prevent="true"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-gray-100 relative overscroll-contain my-auto"
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {selectedItem.is_pinned && (
                <span className="inline-flex items-center gap-1 bg-[#FF6600] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Pin className="w-3.5 h-3.5 fill-current" />
                  Disematkan
                </span>
              )}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(
                  selectedItem.kategori
                )}`}
              >
                {selectedItem.kategori}
              </span>

              {/* Expiry Badge */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                  isInformasiActive(selectedItem)
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {selectedItem.berlaku_sampai
                  ? `Berlaku s/d ${selectedItem.berlaku_sampai} (${getRemainingDaysInfo(selectedItem).text})`
                  : "Berlaku Selamanya (Tanpa Batas)"}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 leading-snug">
              {selectedItem.judul}
            </h2>

            {/* Author info */}
            <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-gray-50 rounded-2xl text-xs text-slate-600 mb-6 border border-gray-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF6600]" />
                <span>
                  Penulis: <strong className="text-slate-800">{selectedItem.author_nama}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Mulai Terbit: {selectedItem.tanggal}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="prose prose-sm text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base mb-6">
              {selectedItem.isi}
            </div>

            {/* Lampiran URL if any */}
            {selectedItem.lampiran_url && (
              <div className="mb-6 p-4 bg-[#FFF0E6] border border-[#FF6600]/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#FF6600]" />
                  <span className="text-xs font-semibold text-slate-700">Lampiran / Dokumen Terkait</span>
                </div>
                <a
                  href={selectedItem.lampiran_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#FF6600] hover:text-[#CC5200] underline"
                >
                  Buka Tautan
                </a>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {canManage ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const itm = selectedItem;
                      setSelectedItem(null);
                      openEditModal(itm);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Pengumuman
                  </button>
                  <button
                    onClick={() => handleDelete(selectedItem.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus
                  </button>
                </div>
              ) : (
                <div />
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT INFORMASI */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
          data-lenis-prevent="true"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[88vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-gray-100 relative overscroll-contain my-auto"
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF0E6] flex items-center justify-center text-[#FF6600]">
                  {editingItem ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {editingItem ? "Edit Informasi Rayon" : "Tambah Informasi Rayon"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Atur tanggal terbit dan masa tampil informasi untuk siswa
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {toastMsg && (
              <div
                className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 mb-4 ${
                  toastMsg.type === "ok"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {toastMsg.type === "ok" ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{toastMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul Informasi / Pengumuman <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Pengumuman Evaluasi Mingguan Rayon"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as KategoriInformasi)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF6600] bg-white"
                  >
                    <option value="Penting">Penting</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Kas & Keuangan">Kas & Keuangan</option>
                    <option value="Piket & Kebersihan">Piket & Kebersihan</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mulai Terbit Pada
                  </label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF6600] bg-white"
                  />
                </div>
              </div>

              {/* SETTING MASA BERLAKU / DITAMPILKAN SAMPAI KAPAN */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-[#FF6600]" />
                    <span className="text-xs font-bold text-slate-800">
                      Batas Waktu Penayangan (Tampilkan Sampai Kapan)
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasExpiry}
                      onChange={(e) => {
                        setHasExpiry(e.target.checked);
                        if (!e.target.checked) setBerlakuSampai("");
                        else if (!berlakuSampai) setExpiryDaysFromStart(7);
                      }}
                      className="w-4 h-4 text-[#FF6600] rounded-md border-gray-300 focus:ring-[#FF6600]"
                    />
                    <span>Tentukan Batas Tanggal</span>
                  </label>
                </div>

                {hasExpiry ? (
                  <div className="space-y-2.5 pt-2 border-t border-gray-200">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-slate-500 text-[11px] font-medium mr-1">Pilihan Cepat:</span>
                      <button
                        type="button"
                        onClick={() => setExpiryDaysFromStart(1)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#FF6600] hover:text-[#FF6600] text-[11px] font-semibold transition-colors"
                      >
                        1 Hari
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpiryDaysFromStart(3)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#FF6600] hover:text-[#FF6600] text-[11px] font-semibold transition-colors"
                      >
                        3 Hari
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpiryDaysFromStart(7)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#FF6600] hover:text-[#FF6600] text-[11px] font-semibold transition-colors"
                      >
                        1 Minggu
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpiryDaysFromStart(14)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#FF6600] hover:text-[#FF6600] text-[11px] font-semibold transition-colors"
                      >
                        2 Minggu
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpiryDaysFromStart(30)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#FF6600] hover:text-[#FF6600] text-[11px] font-semibold transition-colors"
                      >
                        1 Bulan
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-medium">Tampilkan s/d tanggal:</span>
                      <input
                        type="date"
                        value={berlakuSampai}
                        min={tanggal}
                        onChange={(e) => setBerlakuSampai(e.target.value)}
                        required={hasExpiry}
                        className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-[#FF6600]"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    Pengumuman akan terus ditampilkan secara permanen (selamanya) sampai pengurus/PS menghapusnya.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Penulis / Jabatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={authorNama}
                  onChange={(e) => setAuthorNama(e.target.value)}
                  placeholder="Contoh: Mohamad Rizal, S.Pd. (PS) / Pengurus Rayon"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Isi Pengumuman / Instruksi Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Tuliskan detail pengumuman atau informasi secara lengkap di sini..."
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF6600] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Link / Tautan Lampiran (Opsional)
                </label>
                <input
                  type="url"
                  value={lampiranUrl}
                  onChange={(e) => setLampiranUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              {/* Pin Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-[#FF6600] rounded-md border-gray-300 focus:ring-[#FF6600]"
                />
                <span className="text-xs font-bold text-slate-700">
                  Sematkan di bagian teratas (Pin to top)
                </span>
              </label>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#FF6600] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#CC5200] transition-colors shadow-md shadow-[#FF6600]/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Terbitkan Informasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
