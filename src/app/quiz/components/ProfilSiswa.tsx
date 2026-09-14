"use client";
import { useState, useEffect } from "react";
import {
  LogOut, Edit3, Save, X, Plus, Trash2,
  Trophy, Calendar, MapPin, Star,
  GraduationCap, BookOpen, Briefcase, User,
  CheckCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import type { Siswa } from "@/lib/siswaData";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Prestasi {
  id: string;
  juara: string;           // "Juara 1", "Juara 2", dst
  tingkat: string;         // "Kota", "Kabupaten", "Provinsi", dst
  nama: string;            // Nama kejuaraan
  tanggal: string;         // YYYY-MM-DD
}

interface ProfilData {
  bio: string;
  prestasi: Prestasi[];
}

// ─── Storage helpers ──────────────────────────────────────────────────────────
const STORAGE_KEY = (id: number) => `siswa_profil_${id}`;

function loadProfil(id: number): ProfilData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(id));
    if (raw) return JSON.parse(raw) as ProfilData;
  } catch { /* ignore */ }
  return { bio: "", prestasi: [] };
}

function saveProfil(id: number, data: ProfilData) {
  localStorage.setItem(STORAGE_KEY(id), JSON.stringify(data));
}

// ─── Badge helpers ────────────────────────────────────────────────────────────
const angkatanBadge: Record<string, { bg: string; text: string }> = {
  "Kelas X":         { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Kelas XI":        { bg: "bg-amber-100",   text: "text-amber-700"   },
  "Kelas XII (PKL)": { bg: "bg-blue-100",    text: "text-blue-700"    },
};

const jabatanBadge: Record<string, string> = {
  "Ketua":       "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Wakil Ketua": "bg-blue-100   text-blue-800   border-blue-300",
  "Sekretaris":  "bg-green-100  text-green-800  border-green-300",
  "Bendahara":   "bg-purple-100 text-purple-800 border-purple-300",
  "Anggota":     "bg-gray-100   text-gray-700   border-gray-300",
};

const juaraColor = (j: string) => {
  if (j.includes("1")) return "from-yellow-400 to-amber-500";
  if (j.includes("2")) return "from-gray-300 to-gray-400";
  if (j.includes("3")) return "from-orange-400 to-amber-600";
  return "from-indigo-400 to-indigo-500";
};

const tingkatOptions = ["Kota", "Kabupaten", "Kota/Kabupaten", "Provinsi", "Nasional", "Internasional"];
const juaraOptions = ["Juara 1", "Juara 2", "Juara 3", "Juara Harapan 1", "Juara Harapan 2", "Finalis", "Peserta"];

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  siswa: Siswa;
  onLogout: () => void;
}

export default function ProfilSiswa({ siswa, onLogout }: Props) {
  const [profil, setProfil] = useState<ProfilData>({ bio: "", prestasi: [] });
  const [editBio, setEditBio] = useState(false);
  const [draftBio, setDraftBio] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Form state untuk tambah/edit prestasi
  const [form, setForm] = useState<Omit<Prestasi, "id">>({
    juara: "Juara 1",
    tingkat: "Kota",
    nama: "",
    tanggal: "",
  });

  useEffect(() => {
    const data = loadProfil(siswa.id);
    setProfil(data);
    setDraftBio(data.bio);
  }, [siswa.id]);

  // ── Bio ──────────────────────────────────────────────────────────────────
  const saveBio = () => {
    const updated = { ...profil, bio: draftBio };
    setProfil(updated);
    saveProfil(siswa.id, updated);
    setEditBio(false);
  };

  // ── Prestasi ─────────────────────────────────────────────────────────────
  const openAddForm = () => {
    setEditId(null);
    setForm({ juara: "Juara 1", tingkat: "Kota", nama: "", tanggal: "" });
    setShowForm(true);
  };

  const openEditForm = (p: Prestasi) => {
    setEditId(p.id);
    setForm({ juara: p.juara, tingkat: p.tingkat, nama: p.nama, tanggal: p.tanggal });
    setShowForm(true);
  };

  const submitForm = () => {
    if (!form.nama.trim() || !form.tanggal) return;

    let updated: ProfilData;
    if (editId) {
      updated = {
        ...profil,
        prestasi: profil.prestasi.map((p) =>
          p.id === editId ? { ...form, id: editId } : p
        ),
      };
    } else {
      const newItem: Prestasi = { ...form, id: Date.now().toString() };
      updated = { ...profil, prestasi: [...profil.prestasi, newItem] };
    }

    setProfil(updated);
    saveProfil(siswa.id, updated);
    setShowForm(false);
    setEditId(null);
  };

  const deletePrestasi = (id: string) => {
    const updated = { ...profil, prestasi: profil.prestasi.filter((p) => p.id !== id) };
    setProfil(updated);
    saveProfil(siswa.id, updated);
  };

  // Format tanggal
  const formatTanggal = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const badge = angkatanBadge[siswa.angkatan] ?? { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─── Profile Card ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/80 overflow-hidden">

          {/* Banner + Avatar di dalamnya */}
          <div className="h-40 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
            />
            {/* Logout */}
            <button
              onClick={onLogout}
              className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/20 hover:bg-black/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all backdrop-blur-sm border border-white/20"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>

            {/* Avatar di dalam banner pojok bawah-kiri, setengah keluar */}
            <div className={`absolute -bottom-10 left-6 w-20 h-20 ${siswa.warnaBg} rounded-2xl flex items-center justify-center shadow-xl border-4 border-white flex-shrink-0`}>
              <span className="text-white font-extrabold text-2xl">{siswa.inisial}</span>
            </div>
          </div>

          {/* Info — beri ruang untuk avatar yang keluar */}
          <div className="px-6 pt-14 pb-6">
            {/* Nama + NIS */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-slate-800">{siswa.nama}</h1>
              <p className="text-xs text-gray-500 font-mono mt-0.5">NIS: {siswa.nis}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${jabatanBadge[siswa.jabatan]}`}>
                {siswa.jabatan}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                {siswa.angkatan}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                {siswa.tahunAngkatan}
              </span>
            </div>

            {/* ── Bio ─────────────────────────────────────────────────────── */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Bio
                </div>
                {!editBio && (
                  <button
                    onClick={() => { setDraftBio(profil.bio); setEditBio(true); }}
                    className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                )}
              </div>

              {editBio ? (
                <div className="space-y-2">
                  <textarea
                    value={draftBio}
                    onChange={(e) => setDraftBio(e.target.value)}
                    rows={3}
                    placeholder="Tulis bio singkat tentang dirimu..."
                    maxLength={300}
                    className="w-full text-sm border border-emerald-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none bg-white"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">{draftBio.length}/300</span>
                    <div className="flex gap-2">
                      <button onClick={() => setEditBio(false)} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                        <X className="w-3 h-3" /> Batal
                      </button>
                      <button onClick={saveBio} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-emerald-700 transition-colors font-semibold shadow-sm">
                        <Save className="w-3 h-3" /> Simpan
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {profil.bio || <span className="italic text-gray-400">Belum ada bio. Klik Edit untuk menambahkan.</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ─── Prestasi Card ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-sm">Daftar Kejuaraan</h2>
                <p className="text-xs text-gray-500">{profil.prestasi.length} prestasi tercatat</p>
              </div>
            </div>
            <button
              onClick={openAddForm}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 shadow-sm shadow-emerald-600/20"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>

          {/* Form Tambah/Edit */}
          {showForm && (
            <div className="mx-4 mt-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5">
              <h3 className="font-bold text-emerald-900 text-sm mb-4">
                {editId ? "Edit Prestasi" : "Tambah Prestasi Baru"}
              </h3>
              <div className="space-y-3">

                {/* Nama kejuaraan */}
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">Nama Kejuaraan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Lomba Cerdas Cermat PAI"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full border border-emerald-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Juara */}
                  <div>
                    <label className="block text-xs font-semibold text-emerald-800 mb-1">Juara</label>
                    <select
                      value={form.juara}
                      onChange={(e) => setForm({ ...form, juara: e.target.value })}
                      className="w-full border border-emerald-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                    >
                      {juaraOptions.map((j) => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>

                  {/* Tingkat */}
                  <div>
                    <label className="block text-xs font-semibold text-emerald-800 mb-1">Tingkat</label>
                    <select
                      value={form.tingkat}
                      onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
                      className="w-full border border-emerald-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                    >
                      {tingkatOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full border border-emerald-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { setShowForm(false); setEditId(null); }}
                    className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Batal
                  </button>
                  <button
                    onClick={submitForm}
                    disabled={!form.nama.trim() || !form.tanggal}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> {editId ? "Perbarui" : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* List Prestasi */}
          <div className="p-4 space-y-3">
            {profil.prestasi.length === 0 ? (
              <div className="text-center py-10">
                <Trophy className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Belum ada prestasi tercatat.</p>
                <p className="text-xs text-gray-400 mt-1">Klik tombol <strong>Tambah</strong> untuk menambahkan kejuaraan.</p>
              </div>
            ) : (
              profil.prestasi
                .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                .map((p) => {
                  const isOpen = expanded === p.id;
                  return (
                    <div
                      key={p.id}
                      className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200"
                    >
                      {/* Card Header */}
                      <button
                        className="w-full text-left flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 transition-colors"
                        onClick={() => setExpanded(isOpen ? null : p.id)}
                      >
                        {/* Medal gradient circle */}
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${juaraColor(p.juara)} flex items-center justify-center shadow-sm flex-shrink-0`}>
                          <Star className="w-4 h-4 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate">{p.nama}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                              {p.juara}
                            </span>
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" /> Tingkat {p.tingkat}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-gray-300">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {isOpen && (
                        <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
                          <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-600">{formatTanggal(p.tanggal)}</span>
                          </div>

                          {/* Detail grid */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                              <p className="text-[10px] text-gray-400 mb-1">Juara</p>
                              <p className="text-sm font-bold text-slate-800">{p.juara}</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                              <p className="text-[10px] text-gray-400 mb-1">Tingkat</p>
                              <p className="text-sm font-bold text-slate-800">{p.tingkat}</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                              <p className="text-[10px] text-gray-400 mb-1">Tahun</p>
                              <p className="text-sm font-bold text-slate-800">{new Date(p.tanggal).getFullYear()}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditForm(p)}
                              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => deletePrestasi(p.id)}
                              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Stats ringkas */}
        {profil.prestasi.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Trophy, label: "Total Prestasi", value: profil.prestasi.length, color: "text-yellow-600 bg-yellow-50" },
              { icon: Star, label: "Juara 1", value: profil.prestasi.filter(p => p.juara === "Juara 1").length, color: "text-amber-600 bg-amber-50" },
              { icon: GraduationCap, label: "Prov/Nas", value: profil.prestasi.filter(p => p.tingkat === "Provinsi" || p.tingkat === "Nasional" || p.tingkat === "Internasional").length, color: "text-indigo-600 bg-indigo-50" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                <div className={`w-8 h-8 ${s.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
