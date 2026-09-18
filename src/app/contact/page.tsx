"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  MessageSquareWarning,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Loader2,
  Filter,
  Sparkles,
  User,
  Hash,
  LogIn,
  Calendar,
  Inbox,
  EyeOff,
  Shield
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface KeluhanItem {
  id: string;
  nama_pengirim: string;
  nis_pengirim: string | null;
  siswa_id?: number | null;
  judul: string;
  isi: string;
  kategori: string;
  status: "Pending" | "Diproses" | "Selesai";
  tanggapan: string | null;
  created_at: string;
}

export default function ContactPage() {
  const { user, profile, role, isLoading } = useAuth();
  const router = useRouter();

  // State Form Siswa / Pengirim
  const [nama, setNama] = useState("");
  const [nis, setNis] = useState("");
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [kategori, setKategori] = useState("Fasilitas Rayon");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State Daftar Keluhan
  const [keluhanList, setKeluhanList] = useState<KeluhanItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  // Peran yang HANYA melihat output tanpa CRUD/form keluhan
  const isViewOnly = role === "guru" || role === "admin";

  // Hanya Guru dan Admin yang dapat melihat identitas asli pengirim (Nama & NIS)
  // Pengurus rayon dan umum TIDAK BISA melihat siapa yang mengirim (anonim/dirahasiakan)
  const canSeeSender = role === "guru" || role === "admin";

  // Pre-fill nama & NIS jika user login
  useEffect(() => {
    if (profile) {
      setNama(profile.nama || "");
      if (profile.siswa?.nis) {
        setNis(profile.siswa.nis);
      } else if (profile.nis) {
        setNis(profile.nis);
      }
    }
  }, [profile]);

  // Fetch daftar keluhan
  const fetchKeluhan = async () => {
    setLoadingData(true);
    try {
      if (isSupabaseConfigured) {
        let query = supabase
          .from("keluhan_rayon")
          .select("*")
          .order("created_at", { ascending: false });

        // Jika siswa biasa (bukan guru, admin, atau pengurus), hanya fetch keluhan miliknya
        if (role === "siswa" && profile?.siswa_id) {
          query = query.eq("siswa_id", profile.siswa_id);
        }

        const { data, error } = await query;
        if (error) {
          console.warn("Supabase query error:", error);
          loadLocalFallback();
        } else {
          setKeluhanList(data || []);
        }
      } else {
        loadLocalFallback();
      }
    } catch (err) {
      console.error(err);
      loadLocalFallback();
    } finally {
      setLoadingData(false);
    }
  };

  const loadLocalFallback = () => {
    const local = localStorage.getItem("demo_keluhan_rayon");
    if (local) {
      try {
        setKeluhanList(JSON.parse(local));
      } catch {
        setKeluhanList(getDefaultDummyKeluhan());
      }
    } else {
      const dummy = getDefaultDummyKeluhan();
      setKeluhanList(dummy);
      localStorage.setItem("demo_keluhan_rayon", JSON.stringify(dummy));
    }
  };

  const getDefaultDummyKeluhan = (): KeluhanItem[] => [
    {
      id: "1",
      nama_pengirim: "Muhammad Al Fatih",
      nis_pengirim: "12511094",
      judul: "Sapu dan pengki di ruang rayon perlu diperbarui",
      isi: "Mohon izin untuk pengadaan alat kebersihan baru agar jadwal piket harian berjalan lebih optimal dan ruang rayon tetap bersih.",
      kategori: "Fasilitas Rayon",
      status: "Diproses",
      tanggapan: "Sudah diagendakan pembelian menggunakan kas rayon pada pertemuan minggu ini.",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "2",
      nama_pengirim: "Siti Rahmawati",
      nis_pengirim: "12511095",
      judul: "Usulan penambahan sesi bimbingan belajar produktif",
      isi: "Mohon dipertimbangkan untuk mengadakan sesi sharing dan bimbingan tugas produktif bersama kakak tingkat atau pengurus rayon.",
      kategori: "Kegiatan & Program",
      status: "Selesai",
      tanggapan: "Usulan disetujui, jadwal belajar bersama akan dimulai setiap hari Kamis sore.",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    }
  ];

  useEffect(() => {
    if (user || profile) {
      fetchKeluhan();
    }
  }, [user, profile, role]);

  const handleSubmitKeluhan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMsg(null);
    setSubmitting(true);

    try {
      if (!judul.trim() || !isi.trim()) {
        throw new Error("Mohon isi judul dan rincian keluhan.");
      }

      if (isSupabaseConfigured) {
        const { error } = await supabase.from("keluhan_rayon").insert({
          nama_pengirim: nama || profile?.nama || "Siswa Rayon Cisarua 3",
          nis_pengirim: nis || profile?.nis || profile?.siswa?.nis || null,
          siswa_id: profile?.siswa_id || null,
          judul: judul.trim(),
          isi: isi.trim(),
          kategori,
          status: "Pending",
        });

        if (error) {
          console.warn("Supabase insert error, fallback local storage:", error);
          saveLocalKeluhan();
        }
      } else {
        saveLocalKeluhan();
      }

      setSubmitMsg({
        type: "success",
        text: "Keluhan & aspirasi berhasil dikirimkan! (Identitas hanya dapat dilihat oleh Guru & Admin)",
      });
      setJudul("");
      setIsi("");
      fetchKeluhan();
    } catch (err: any) {
      setSubmitMsg({
        type: "error",
        text: err.message || "Gagal mengirim keluhan.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const saveLocalKeluhan = () => {
    const newItem: KeluhanItem = {
      id: Date.now().toString(),
      nama_pengirim: nama || profile?.nama || "Siswa Rayon",
      nis_pengirim: nis || profile?.nis || null,
      judul: judul.trim(),
      isi: isi.trim(),
      kategori,
      status: "Pending",
      tanggapan: null,
      created_at: new Date().toISOString(),
    };
    const updated = [newItem, ...keluhanList];
    setKeluhanList(updated);
    localStorage.setItem("demo_keluhan_rayon", JSON.stringify(updated));
  };

  const filteredKeluhan = keluhanList.filter((k) => {
    if (filterStatus === "Semua") return true;
    return k.status === filterStatus;
  });

  const keluhanHeroProps = {
    title: isViewOnly ? "Rekap Aspirasi Rayon" : "Ada Saran & Keluhan?",
    highlightPrefix: "Suara",
    rotatingTexts: [
      "Didengar!",
      "Solutif!",
      "Bermakna!",
      "Membangun!",
      "Cisarua 3!",
    ],
    subtitle: isViewOnly
      ? `Panel Peninjauan Keluhan & Aspirasi Rayon Cisarua 3 untuk ${role === "guru" ? "Guru / Pembimbing Siswa" : "Administrator"}.`
      : "Sampaikan aspirasi, kendala sarana rayon, atau masukan untuk Rayon Cisarua 3 secara aman. Identitas Anda dirahasiakan dari pengurus rayon dan hanya diketahui oleh Guru & Admin.",
    primaryColor: "text-yellow-500",
    ctaPrimary: isViewOnly
      ? {
        text: "Lihat Rekap Keluhan",
        action: () => {
          document.getElementById("output-keluhan")?.scrollIntoView({ behavior: "smooth" });
        },
      }
      : {
        text: "Tulis Keluhan",
        action: () => {
          document.getElementById("form-keluhan")?.scrollIntoView({ behavior: "smooth" });
        },
      },
    ctaSecondary: {
      text: "Lihat Rekap Status",
      action: () => {
        document.getElementById("output-keluhan")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    theme: {
      gradient: "bg-gradient-to-t from-yellow-500/40 via-yellow-100/20 to-white",
      primaryColor: "bg-yellow-500",
      primaryHover: "hover:bg-yellow-600",
      borderColor: "border-yellow-500",
      hoverBg: "hover:bg-yellow-50",
    },
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <Navbar />
      <Hero {...keluhanHeroProps} />

      {/* Main Content Section */}
      <section className="w-full py-16 px-4 bg-gray-50/80">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest">
                  {isViewOnly ? "Output & Rekap Data" : "Aspirasi & Keluhan"}
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                  {isViewOnly ? "Daftar Keluhan Rayon Masuk" : "Pusat Keluhan Rayon"}
                </h2>
              </div>
            </div>

            {/* Role Badge Info jika Login */}
            {user && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-gray-500 font-medium">Masuk sebagai:</span>
                <span className="text-xs font-bold text-slate-800 uppercase px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                  {role}
                </span>
              </div>
            )}
          </div>

          {/* CHECK STATUS LOGIN: Halaman HANYA muncul ketika login */}
          {isLoading ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-sm max-w-xl mx-auto">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">Memeriksa Status Masuk</h3>
              <p className="text-xs text-gray-400">Mohon tunggu sebentar...</p>
            </div>
          ) : !user && !profile ? (
            /* State Jika Belum Login */
            <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-yellow-200 shadow-xl max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Lock className="w-10 h-10" />
              </div>
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full mb-3">
                Akses Terbatas
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3">
                Halaman Keluhan Rayon Memerlukan Login
              </h3>
              <p className="text-sm text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
                Halaman ini khusus untuk civitas Rayon Cisarua 3 (Siswa, Pengurus, Guru Pembimbing, dan Admin). Silakan masuk ke akun Anda untuk melihat rekap atau mengirimkan aspirasi rayon.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto px-8 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Masuk ke Akun
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold text-sm rounded-2xl transition-all"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          ) : isViewOnly ? (
            /* ============================================================== */
            /* TAMPILAN KHUSUS GURU & ADMIN: HANYA OUTPUT KELUHAN (NO CRUD)   */
            /* ============================================================== */
            <div id="output-keluhan" className="space-y-6">
              {/* Header Panel Guru/Admin */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Inbox className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-xl font-bold text-slate-800">
                      Rekapitulasi Suara & Keluhan Siswa
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500">
                    Mode peninjauan penuh {role === "guru" ? "Guru / PS" : "Admin"}. Menampilkan identitas pengirim lengkap (Nama & NIS) untuk tindak lanjut pembinaan.
                  </p>
                </div>

                {/* Filter Status */}
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-600">Filter Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border-none bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Semua">Semua Status ({keluhanList.length})</option>
                    <option value="Pending">Pending ({keluhanList.filter((k) => k.status === "Pending").length})</option>
                    <option value="Diproses">Diproses ({keluhanList.filter((k) => k.status === "Diproses").length})</option>
                    <option value="Selesai">Selesai ({keluhanList.filter((k) => k.status === "Selesai").length})</option>
                  </select>
                </div>
              </div>

              {/* Data List Keluhan untuk Guru & Admin */}
              {loadingData ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-sm">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500 mb-3" />
                  <p className="text-xs text-gray-400">Memuat output data keluhan...</p>
                </div>
              ) : filteredKeluhan.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-sm">
                  <MessageSquareWarning className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-base font-bold text-slate-700 mb-1">Tidak Ada Keluhan Ditemukan</p>
                  <p className="text-xs text-gray-400">
                    {filterStatus === "Semua"
                      ? "Belum ada laporan keluhan yang masuk dari siswa."
                      : `Tidak ada laporan dengan status "${filterStatus}".`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredKeluhan.map((item) => {
                    const statusBadge =
                      item.status === "Selesai"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : item.status === "Diproses"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-amber-100 text-amber-800 border-amber-200";

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Header Item */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
                              {item.kategori}
                            </span>
                            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${statusBadge}`}>
                              {item.status}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-800 mb-2 leading-snug">
                            {item.judul}
                          </h4>

                          {/* Info Pengirim: Terbuka untuk Guru & Admin */}
                          <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-gray-500 mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                            <span className="flex items-center gap-1 font-bold text-slate-800">
                              <User className="w-3.5 h-3.5 text-yellow-600" />
                              {item.nama_pengirim || "Anonim"}
                            </span>
                            {item.nis_pengirim && (
                              <span className="flex items-center gap-1 text-gray-500 font-mono text-[10px] bg-white px-2 py-0.5 rounded-md border border-gray-200">
                                <Hash className="w-3 h-3 text-gray-400" />
                                NIS: {item.nis_pengirim}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-gray-400 ml-auto">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              {new Date(item.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          {/* Isi Rincian */}
                          <p className="text-xs text-gray-600 leading-relaxed bg-slate-50/80 rounded-2xl p-4 mb-4 border border-slate-100">
                            {item.isi}
                          </p>
                        </div>

                        {/* Output Tanggapan (Read Only) */}
                        {item.tanggapan ? (
                          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 text-xs mt-2">
                            <p className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1 text-[11px]">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Catatan / Tanggapan Rayon:
                            </p>
                            <p className="text-emerald-800 leading-relaxed">{item.tanggapan}</p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-2.5 text-center mt-2">
                            <p className="text-[11px] text-gray-400 italic">Belum ada tanggapan tercatat</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ============================================================== */
            /* TAMPILAN SISWA / PENGURUS: FORM KIRIM & DAFTAR STATUS          */
            /* ============================================================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* KIRI: Form Kirim Keluhan */}
              <div id="form-keluhan" className="lg:col-span-5">
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm sticky top-28">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold shadow-sm">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Form Aspirasi Rayon</h3>
                      <p className="text-xs text-gray-500">Kirim kendala atau saran Anda</p>
                    </div>
                  </div>

                  {/* Banner Privasi Keamanan Siswa */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-5 flex items-start gap-2 text-xs text-blue-800">
                    <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Privasi Terjamin Aman</p>
                      <p className="text-[11px] text-blue-700">Identitas Anda dirahasiakan dari Pengurus Rayon dan hanya diketahui oleh Guru Pembimbing & Admin.</p>
                    </div>
                  </div>

                  {submitMsg && (
                    <div
                      className={`p-4 rounded-2xl mb-6 text-xs flex items-start gap-2.5 ${submitMsg.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                    >
                      {submitMsg.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                      )}
                      <span>{submitMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitKeluhan} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nama</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Nama Anda"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">NIS</label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Contoh: 12511094"
                            value={nis}
                            onChange={(e) => setNis(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Masalah</label>
                      <select
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
                      >
                        <option value="Fasilitas Rayon">Fasilitas & Sarana Rayon</option>
                        <option value="Kebersihan">Kebersihan & Jadwal Piket</option>
                        <option value="Kegiatan & Program">Kegiatan & Program Rayon</option>
                        <option value="Kedisiplinan">Kedisiplinan & Ketertiban</option>
                        <option value="Lainnya">Lain-lain / Aspirasi Pribadi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Keluhan</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Alat kebersihan sapu perlu diganti"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rincian Lengkap</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Ceritakan detail kendala atau saran yang ingin disampaikan secara lengkap..."
                        value={isi}
                        onChange={(e) => setIsi(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Kirimkan Aspirasi
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* KANAN: Daftar Status Keluhan */}
              <div id="output-keluhan" className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-yellow-600" />
                      <h3 className="text-base font-bold text-slate-800">
                        {role === "pengurus" ? "Daftar Aspirasi Rayon" : "Status Keluhan Saya"}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {role === "pengurus"
                        ? "Laporan & keluhan masuk (Identitas pengirim disamarkan untuk Pengurus)"
                        : "Laporan yang telah Anda kirimkan ke pembimbing & pengurus rayon"}
                    </p>
                  </div>

                  {/* Filter Status */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>

                {loadingData ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-yellow-500 mb-2" />
                    <p className="text-xs text-gray-400">Memuat data keluhan...</p>
                  </div>
                ) : filteredKeluhan.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
                    <MessageSquareWarning className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-700 mb-1">Belum Ada Keluhan Tercatat</p>
                    <p className="text-xs text-gray-400">
                      {role === "pengurus"
                        ? "Semua laporan telah terselesaikan atau belum ada aspirasi baru."
                        : "Anda belum pernah mengirimkan keluhan atau belum ada tiket aktif."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredKeluhan.map((item) => {
                      const statusBadge =
                        item.status === "Selesai"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : item.status === "Diproses"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-amber-100 text-amber-800 border-amber-200";

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-700 bg-yellow-100 px-2.5 py-0.5 rounded-full mr-2">
                                {item.kategori}
                              </span>
                              <h4 className="text-base font-bold text-slate-800 mt-2">{item.judul}</h4>
                            </div>

                            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${statusBadge}`}>
                              {item.status}
                            </span>
                          </div>

                          {/* Info Pengirim: Jika Pengurus Rayon melihat, sensor identitas pengirim */}
                          {role === "pengurus" ? (
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 mb-3 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                              <span className="flex items-center gap-1.5 font-bold text-amber-900">
                                <Shield className="w-3.5 h-3.5 text-amber-600" />
                                Anggota / Siswa Rayon
                              </span>
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <EyeOff className="w-3 h-3" /> Identitas Dirahasiakan
                              </span>
                              <span className="flex items-center gap-1 text-gray-400 ml-auto">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                {new Date(item.created_at).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-400 mb-3">
                              Dikirim:{" "}
                              {new Date(item.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          )}

                          <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-2xl p-4 mb-4">
                            {item.isi}
                          </p>

                          {/* Tanggapan jika ada */}
                          {item.tanggapan ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs">
                              <p className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Tanggapan Guru / Pengurus:
                              </p>
                              <p className="text-emerald-800 leading-relaxed">{item.tanggapan}</p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-400 italic">Belum ada tanggapan resmi.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
