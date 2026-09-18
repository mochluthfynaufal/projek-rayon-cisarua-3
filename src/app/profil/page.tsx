"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Mail, CreditCard, BookOpen, Award, KeyRound, LogOut, Shield,
  GraduationCap, Star, Trophy, Edit3, Save, X, Loader2, Plus, Trash2,
  CheckCircle2, AlertCircle, ChevronRight, Leaf, ArrowLeft, Clock, Users,
  Sparkles, Image as ImageIcon, Upload, ExternalLink, Building2, Tag
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import ModalUbahPassword from "@/app/components/ModalUbahPassword";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { daftarSiswa } from "@/lib/siswaData";
import {
  PrestasiData,
  saveNewPrestasi,
  removePrestasi,
  fetchAllPrestasi,
} from "@/lib/galeriData";

interface SiswaDB {
  id: number;
  nama: string;
  nis: string;
  jabatan: string;
  angkatan: string;
  tahun_angkatan: string;
  jurusan?: string;
  inisial: string;
  warna_bg: string;
  bio?: string;
  foto_url?: string;
}

const roleConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  admin: { label: "Admin", color: "text-red-700", bg: "bg-red-100", icon: Shield },
  guru: { label: "Guru / PS", color: "text-purple-700", bg: "bg-purple-100", icon: GraduationCap },
  pengurus: { label: "Pengurus Rayon", color: "text-yellow-700", bg: "bg-yellow-100", icon: Star },
  siswa: { label: "Siswa", color: "text-blue-700", bg: "bg-blue-100", icon: Users },
  guest: { label: "Tamu", color: "text-gray-700", bg: "bg-gray-100", icon: User },
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <p className="text-xs font-semibold text-slate-700 break-all leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilPage() {
  const router = useRouter();
  const { user, profile, role, logout, isLoading } = useAuth();

  const [siswaData, setSiswaData] = useState<SiswaDB | null>(null);
  const [prestasi, setPrestasi] = useState<PrestasiData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [bioMsg, setBioMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Form Tambah Prestasi
  const [showAddPrestasi, setShowAddPrestasi] = useState(false);
  const [newNama, setNewNama] = useState("");
  const [newJuara, setNewJuara] = useState("Juara 1");
  const [newTingkat, setNewTingkat] = useState<PrestasiData["tingkat"]>("Sekolah");
  const [newPenyelenggara, setNewPenyelenggara] = useState("");
  const [newTanggal, setNewTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [newDeskripsi, setNewDeskripsi] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [savingPrestasi, setSavingPrestasi] = useState(false);
  const [prestasiMsg, setPrestasiMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [showUbahPw, setShowUbahPw] = useState(false);

  useEffect(() => {
    if (!isLoading && !profile) {
      router.push("/auth/login");
    }
  }, [isLoading, profile, router]);

  const fetchData = useCallback(async () => {
    if (!profile) return;
    setLoadingData(true);
    try {
      const targetSiswaId = profile.siswa_id;
      if (targetSiswaId && isSupabaseConfigured) {
        const { data: dbSiswa } = await supabase.from("siswa").select("*").eq("id", targetSiswaId).single();
        if (dbSiswa) { setSiswaData(dbSiswa); setBioText(dbSiswa.bio || ""); }
      } else if (targetSiswaId) {
        const local = daftarSiswa.find((s) => s.id === targetSiswaId);
        if (local) setSiswaData({ id: local.id, nama: local.nama, nis: local.nis, jabatan: local.jabatan, angkatan: local.angkatan, tahun_angkatan: local.tahunAngkatan, jurusan: local.jurusan, inisial: local.inisial, warna_bg: local.warnaBg });
      }

      // Ambil prestasi siswa
      const allPrestasi = await fetchAllPrestasi();
      const myPrestasi = allPrestasi.filter(
        (p) =>
          (targetSiswaId && p.siswa_id === targetSiswaId) ||
          (p.author_nama && profile.nama && p.author_nama.toLowerCase() === profile.nama.toLowerCase())
      );
      setPrestasi(myPrestasi);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveBio = async () => {
    if (!siswaData) return;
    setSavingBio(true); setBioMsg(null);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("siswa").update({ bio: bioText }).eq("id", siswaData.id);
        if (error) throw error;
      }
      setSiswaData((prev) => prev ? { ...prev, bio: bioText } : prev);
      setBioMsg({ type: "ok", text: "Bio berhasil disimpan!" });
      setIsEditingBio(false);
      setTimeout(() => setBioMsg(null), 3000);
    } catch (err: any) { setBioMsg({ type: "err", text: err.message || "Gagal menyimpan bio." }); }
    finally { setSavingBio(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar sertifikat maksimal 5MB");
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

  const handleAddPrestasi = async () => {
    if (!newNama.trim() || !profile) return;
    setSavingPrestasi(true);
    setPrestasiMsg(null);

    try {
      const authorNama = profile.nama || siswaData?.nama || "Siswa Cisarua 3";
      const newItem = await saveNewPrestasi({
        siswa_id: profile.siswa_id || siswaData?.id || undefined,
        author_nama: authorNama,
        nis: profile.nis || siswaData?.nis || "",
        jurusan: siswaData?.jurusan || "",
        angkatan: siswaData?.angkatan || "",
        nama: newNama.trim(),
        juara: newJuara,
        tingkat: newTingkat,
        penyelenggara: newPenyelenggara.trim() || undefined,
        tanggal: newTanggal,
        deskripsi: newDeskripsi.trim() || undefined,
        foto_url: fotoUrl || undefined,
      });

      setPrestasi((prev) => [newItem, ...prev]);
      setNewNama("");
      setNewPenyelenggara("");
      setNewDeskripsi("");
      setFotoUrl("");
      setImagePreview(null);
      setShowAddPrestasi(false);
      setPrestasiMsg({
        type: "ok",
        text: "Prestasi berhasil ditambahkan! Sertifikat otomatis ditampilkan di Galeri Prestasi Rayon.",
      });
      setTimeout(() => setPrestasiMsg(null), 4000);
    } catch (err: any) {
      setPrestasiMsg({ type: "err", text: err.message || "Gagal menambahkan prestasi." });
    } finally {
      setSavingPrestasi(false);
    }
  };

  const handleDeletePrestasi = async (id: string) => {
    if (!confirm("Hapus prestasi ini dari riwayat dan galeri?")) return;
    try {
      await removePrestasi(id);
      setPrestasi((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mx-auto" />
          <p className="text-gray-500 text-sm font-medium">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const rc = roleConfig[role] || roleConfig.guest;
  const RoleIcon = rc.icon;
  const displayName = profile.nama || siswaData?.nama || "Pengguna";
  const displayInitial = siswaData?.inisial || displayName.charAt(0).toUpperCase();
  const bgColorClass = siswaData?.warna_bg || "bg-gradient-to-br from-yellow-400 to-amber-500";
  const canEditProfile = ["siswa", "pengurus", "admin"].includes(role);

  return (
    <>
      <Navbar />
      <ModalUbahPassword isOpen={showUbahPw} onClose={() => setShowUbahPw(false)} />

      <div className="min-h-screen bg-gradient-to-br from-yellow-50/60 via-white to-emerald-50/50 pt-28 pb-20">
        <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-yellow-300/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-300/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <Link href="/belajar" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-slate-800 mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Rayon
          </Link>

          {/* Hero Card */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl shadow-yellow-500/5 overflow-hidden mb-6">
            <div className="h-32 sm:h-36 bg-gradient-to-r from-yellow-400 via-amber-400 to-emerald-500 relative">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
              <div className="absolute top-4 right-4"><Leaf className="w-8 h-8 text-white/30" /></div>
            </div>
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 -mt-12 sm:-mt-14">
                  <div className={`w-24 h-24 rounded-3xl ${bgColorClass} flex items-center justify-center text-white text-3xl font-black shadow-xl border-4 border-white flex-shrink-0 z-10`}>
                    {displayInitial}
                  </div>
                  <div className="pt-2 sm:pt-14 min-w-0">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{displayName}</h1>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{profile.email}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold ${rc.bg} ${rc.color} shadow-sm`}>
                        <RoleIcon className="w-3.5 h-3.5" />{rc.label}
                      </span>
                      {siswaData?.jabatan && siswaData.jabatan !== "Anggota" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <Star className="w-3.5 h-3.5 text-emerald-600" />{siswaData.jabatan}
                        </span>
                      )}
                      {siswaData?.jurusan && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />{siswaData.jurusan}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 pt-2 sm:pt-6 flex-shrink-0">
                  <button onClick={() => setShowUbahPw(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer">
                    <KeyRound className="w-4 h-4 text-yellow-600" />Ubah Password
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer">
                    <LogOut className="w-4 h-4" />Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-md">
                <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-yellow-500" />Identitas Akun
                </h2>
                {loadingData ? (
                  <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-5 bg-gray-100 rounded-lg animate-pulse" />)}</div>
                ) : (
                  <dl className="space-y-3">
                    <InfoRow icon={<User className="w-3.5 h-3.5 text-gray-400" />} label="Nama Lengkap" value={displayName} />
                    <InfoRow icon={<Mail className="w-3.5 h-3.5 text-gray-400" />} label="Email" value={profile.email || "-"} />
                    {profile.nis && <InfoRow icon={<CreditCard className="w-3.5 h-3.5 text-gray-400" />} label="NIS" value={profile.nis} />}
                    {siswaData && (
                      <>
                        <InfoRow icon={<BookOpen className="w-3.5 h-3.5 text-gray-400" />} label="Jurusan" value={siswaData.jurusan || "-"} />
                        <InfoRow icon={<GraduationCap className="w-3.5 h-3.5 text-gray-400" />} label="Angkatan" value={siswaData.angkatan} />
                        <InfoRow icon={<Clock className="w-3.5 h-3.5 text-gray-400" />} label="Tahun" value={siswaData.tahun_angkatan} />
                        <InfoRow icon={<Award className="w-3.5 h-3.5 text-gray-400" />} label="Jabatan" value={siswaData.jabatan} />
                      </>
                    )}
                  </dl>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-md">
                <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />Navigasi Cepat
                </h2>
                <div className="space-y-1.5">
                  {[
                    { href: "/belajar", label: "Rayon", icon: BookOpen },
                    { href: "/galeri", label: "Galeri & Prestasi Rayon", icon: ImageIcon },
                    { href: "/contact", label: "Keluhan Rayon", icon: AlertCircle },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-yellow-50 group transition-colors">
                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                      <span className="text-xs font-medium text-gray-600 group-hover:text-slate-800 transition-colors flex-1">{label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-yellow-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Bio */}
              {canEditProfile && (
                <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Edit3 className="w-4 h-4 text-blue-500" />Bio Singkat</h2>
                    {!isEditingBio ? (
                      <button onClick={() => setIsEditingBio(true)} className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors cursor-pointer">
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => { setIsEditingBio(false); setBioText(siswaData?.bio || ""); }} className="text-[11px] font-semibold text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer">
                          <X className="w-3 h-3" /> Batal
                        </button>
                        <button onClick={handleSaveBio} disabled={savingBio} className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 disabled:opacity-50 cursor-pointer">
                          {savingBio ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Simpan
                        </button>
                      </div>
                    )}
                  </div>
                  {bioMsg && (
                    <div className={`mb-3 p-2.5 rounded-xl text-xs flex items-center gap-2 ${bioMsg.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {bioMsg.type === "ok" ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                      {bioMsg.text}
                    </div>
                  )}
                  {isEditingBio ? (
                    <textarea value={bioText} onChange={(e) => setBioText(e.target.value)} rows={4} placeholder="Tulis sedikit tentang dirimu..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" />
                  ) : (
                    <p className="text-xs text-gray-600 leading-relaxed min-h-[60px]">
                      {siswaData?.bio || <span className="text-gray-400 italic">Belum ada bio. Klik Edit untuk menambahkan.</span>}
                    </p>
                  )}
                </div>
              )}

              {/* Prestasi Section */}
              {canEditProfile && (
                <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />Riwayat Prestasi Saya
                        {prestasi.length > 0 && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">
                            {prestasi.length}
                          </span>
                        )}
                      </h2>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Riwayat pencapaian lomba & sertifikat yang telah Anda masukkan.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddPrestasi(!showAddPrestasi)}
                      className="flex items-center gap-1 text-xs font-bold bg-yellow-50 hover:bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-xl border border-yellow-200 transition-colors cursor-pointer"
                    >
                      {showAddPrestasi ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-yellow-600" />}
                      {showAddPrestasi ? "Tutup Form" : "Tambah Prestasi"}
                    </button>
                  </div>

                  {/* Form Tambah Prestasi */}
                  {showAddPrestasi && (
                    <div className="p-4 bg-yellow-50/80 border border-yellow-200/90 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-yellow-200">
                        <Trophy className="w-4 h-4 text-yellow-700" />
                        <p className="text-xs font-bold text-yellow-900">Form Tambah Prestasi & Sertifikat</p>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nama Lomba / Prestasi *
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Juara 1 Lomba Web Design Tingkat Nasional"
                          value={newNama}
                          onChange={(e) => setNewNama(e.target.value)}
                          className="w-full border border-yellow-200 bg-white rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Pencapaian / Juara *
                          </label>
                          <select
                            value={newJuara}
                            onChange={(e) => setNewJuara(e.target.value)}
                            className="w-full border border-yellow-200 bg-white rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          >
                            <option value="Juara 1">Juara 1</option>
                            <option value="Juara 2">Juara 2</option>
                            <option value="Juara 3">Juara 3</option>
                            <option value="Medali Emas">Medali Emas</option>
                            <option value="Medali Perak">Medali Perak</option>
                            <option value="Medali Perunggu">Medali Perunggu</option>
                            <option value="Harapan 1">Harapan 1</option>
                            <option value="Harapan 2">Harapan 2</option>
                            <option value="Finalis">Finalis</option>
                            <option value="Peserta / Apresiasi">Peserta / Apresiasi</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Tingkat Kompetisi *
                          </label>
                          <select
                            value={newTingkat}
                            onChange={(e) => setNewTingkat(e.target.value as any)}
                            className="w-full border border-yellow-200 bg-white rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          >
                            <option value="Sekolah">Sekolah</option>
                            <option value="Kecamatan">Kecamatan</option>
                            <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                            <option value="Provinsi">Provinsi</option>
                            <option value="Nasional">Nasional</option>
                            <option value="Internasional">Internasional</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Penyelenggara / Lembaga
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Kemendikbud / Telkom University"
                            value={newPenyelenggara}
                            onChange={(e) => setNewPenyelenggara(e.target.value)}
                            className="w-full border border-yellow-200 bg-white rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Tanggal Diraih *
                          </label>
                          <input
                            type="date"
                            value={newTanggal}
                            onChange={(e) => setNewTanggal(e.target.value)}
                            className="w-full border border-yellow-200 bg-white rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Deskripsi / Ringkasan Prestasi
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Jelaskan sedikit tentang karya atau lomba yang diikuti..."
                          value={newDeskripsi}
                          onChange={(e) => setNewDeskripsi(e.target.value)}
                          className="w-full border border-yellow-200 bg-white rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        />
                      </div>

                      {/* Upload Foto Sertifikat */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Foto Sertifikat / Piagam Penghargaan
                          <span className="text-[10px] font-normal text-gray-500 ml-1">
                            (Akan otomatis tampil di Galeri Prestasi Rayon)
                          </span>
                        </label>

                        <div className="space-y-2">
                          <label className="border-2 border-dashed border-yellow-300 hover:border-yellow-400 bg-white rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                            <Upload className="w-5 h-5 text-yellow-600 mb-1" />
                            <span className="text-xs font-bold text-yellow-800">Pilih Foto Sertifikat / Piagam</span>
                            <span className="text-[10px] text-gray-400">JPG, PNG, WebP (Maks 5MB)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>

                          <input
                            type="url"
                            placeholder="Atau link gambar sertifikat..."
                            value={fotoUrl.startsWith("data:") ? "" : fotoUrl}
                            onChange={(e) => {
                              setFotoUrl(e.target.value);
                              setImagePreview(e.target.value);
                            }}
                            className="w-full border border-yellow-200 bg-white rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />

                          {imagePreview && (
                            <div className="relative h-28 bg-slate-100 rounded-xl overflow-hidden border border-yellow-200">
                              <img
                                src={imagePreview}
                                alt="Sertifikat preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview(null);
                                  setFotoUrl("");
                                }}
                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg shadow"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleAddPrestasi}
                        disabled={savingPrestasi || !newNama.trim()}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-slate-900 text-xs font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
                      >
                        {savingPrestasi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Simpan & Publikasikan ke Galeri Prestasi
                      </button>
                    </div>
                  )}

                  {prestasiMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${prestasiMsg.type === "ok"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                    >
                      {prestasiMsg.type === "ok" ? (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span>{prestasiMsg.text}</span>
                    </div>
                  )}

                  {/* Riwayat Prestasi Berbasis Teks Tanpa Foto */}
                  {loadingData ? (
                    <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
                  ) : prestasi.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                      <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30 text-yellow-600" />
                      <p className="text-xs font-semibold text-gray-600">Belum ada riwayat prestasi.</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Klik tombol Tambah Prestasi di atas untuk mencatatkan prestasimu.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between px-1 text-[11px] text-gray-400">
                        <span>Daftar Riwayat Prestasi:</span>
                        <Link
                          href="/galeri"
                          className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
                        >
                          Lihat di Galeri Prestasi Rayon <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      {prestasi.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-yellow-50/60 to-amber-50/40 border border-yellow-100 hover:border-yellow-200 transition-all group"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-yellow-400/20 text-yellow-800 flex items-center justify-center flex-shrink-0 font-black text-xs">
                              <Trophy className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="min-w-0 space-y-1">
                              <p className="text-xs font-bold text-slate-800 leading-tight">
                                {p.nama}
                              </p>

                              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                <span className="bg-yellow-200/80 text-yellow-900 font-extrabold px-2 py-0.5 rounded-md">
                                  {p.juara}
                                </span>
                                <span className="bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                                  {p.tingkat}
                                </span>
                                {p.penyelenggara && (
                                  <span className="text-gray-500 font-medium">
                                    • {p.penyelenggara}
                                  </span>
                                )}
                              </div>

                              {p.deskripsi && (
                                <p className="text-[11px] text-gray-600 line-clamp-1">
                                  {p.deskripsi}
                                </p>
                              )}

                              <p className="text-[10px] text-gray-400">
                                Diraih pada: {new Date(p.tanggal).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                                {p.foto_url && (
                                  <span className="text-emerald-600 font-bold ml-2">
                                    • Sertifikat terpublikasi di Galeri
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeletePrestasi(p.id)}
                            title="Hapus riwayat prestasi ini"
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Guru info card */}
              {role === "guru" && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 text-center">
                  <GraduationCap className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                  <p className="text-sm font-bold text-purple-800">Akun Guru / Pembimbing Siswa</p>
                  <p className="text-xs text-purple-600 mt-1 max-w-xs mx-auto">Anda memiliki akses untuk mengelola struktur pengurus, jadwal piket, meninjau keluhan rayon, dan mengunggah foto ke Galeri Kegiatan.</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <Link href="/belajar" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold transition-colors">
                      <BookOpen className="w-3.5 h-3.5" />Kelola Rayon
                    </Link>
                    <Link href="/galeri" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-colors">
                      <ImageIcon className="w-3.5 h-3.5" />Buka Galeri
                    </Link>
                  </div>
                </div>
              )}

              {/* Security */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-md">
                <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />Keamanan Akun
                </h2>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center">
                      <KeyRound className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Kata Sandi</p>
                      <p className="text-[11px] text-gray-400">Ubah kata sandi akun Anda</p>
                    </div>
                  </div>
                  <button onClick={() => setShowUbahPw(true)} className="text-[11px] font-bold text-yellow-600 hover:text-yellow-800 flex items-center gap-1 transition-colors cursor-pointer">
                    Ubah <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
