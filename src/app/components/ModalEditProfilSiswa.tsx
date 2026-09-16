"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, Trophy, User, Save, Loader2, Star } from "lucide-react";
import { Siswa } from "@/lib/siswaData";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface PrestasiItem {
  id?: string;
  nama: string;
  juara: string;
  tingkat: string;
  tanggal: string;
}

interface ModalEditProfilSiswaProps {
  siswa: Siswa;
  initialBio: string;
  initialPrestasi: PrestasiItem[];
  onClose: () => void;
  onSaved: (newBio: string, newPrestasi: PrestasiItem[]) => void;
}

export default function ModalEditProfilSiswa({
  siswa,
  initialBio,
  initialPrestasi,
  onClose,
  onSaved,
}: ModalEditProfilSiswaProps) {
  const [bio, setBio] = useState(initialBio);
  const [prestasi, setPrestasi] = useState<PrestasiItem[]>(initialPrestasi);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form input prestasi baru
  const [namaPrestasi, setNamaPrestasi] = useState("");
  const [juara, setJuara] = useState("Juara 1");
  const [tingkat, setTingkat] = useState("Sekolah");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);

  const handleAddPrestasi = () => {
    if (!namaPrestasi.trim()) return;
    const newItem: PrestasiItem = {
      nama: namaPrestasi.trim(),
      juara,
      tingkat,
      tanggal,
    };
    setPrestasi([newItem, ...prestasi]);
    setNamaPrestasi("");
  };

  const handleRemovePrestasi = (idx: number) => {
    setPrestasi(prestasi.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setLoading(true);
    setStatusMsg(null);

    try {
      if (isSupabaseConfigured) {
        // 1. Update Bio di tabel siswa
        const { error: bioErr } = await supabase
          .from("siswa")
          .update({ bio })
          .eq("id", siswa.id);

        if (bioErr) throw bioErr;

        // 2. Sync Prestasi: Hapus lama, masukkan baru
        await supabase.from("prestasi").delete().eq("siswa_id", siswa.id);

        if (prestasi.length > 0) {
          const insertPayload = prestasi.map((p) => ({
            siswa_id: siswa.id,
            nama: p.nama,
            juara: p.juara,
            tingkat: p.tingkat,
            tanggal: p.tanggal,
          }));

          const { error: prestErr } = await supabase.from("prestasi").insert(insertPayload);
          if (prestErr) throw prestErr;
        }
      } else {
        // Fallback localStorage jika offline/unconfigured
        localStorage.setItem(
          `siswa_profil_${siswa.id}`,
          JSON.stringify({ bio, prestasi })
        );
      }

      onSaved(bio, prestasi);
      onClose();
    } catch (err: any) {
      console.error(err);
      setStatusMsg("Gagal menyimpan: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
          <div>
            <h3 className="text-lg font-bold">Edit Profil Siswa</h3>
            <p className="text-xs text-gray-300 mt-0.5">
              {siswa.nama} &middot; NIS {siswa.nis}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {statusMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {statusMsg}
            </div>
          )}

          {/* Section Bio */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              <User className="w-3.5 h-3.5 text-yellow-500" /> Bio & Deskripsi Diri
            </label>
            <textarea
              rows={3}
              placeholder="Ceritakan minat, keahlian, atau kutipan favoritmu..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Section Prestasi */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" /> Prestasi & Kejuaraan
            </label>

            {/* Input Form Tambah Prestasi */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4 space-y-3">
              <input
                type="text"
                placeholder="Nama Lomba / Kejuaraan (misal: LKS Web Tech)"
                value={namaPrestasi}
                onChange={(e) => setNamaPrestasi(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={juara}
                  onChange={(e) => setJuara(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Juara 1">Juara 1</option>
                  <option value="Juara 2">Juara 2</option>
                  <option value="Juara 3">Juara 3</option>
                  <option value="Harapan 1">Harapan 1</option>
                  <option value="Finalis">Finalis</option>
                  <option value="Peserta">Peserta</option>
                </select>

                <select
                  value={tingkat}
                  onChange={(e) => setTingkat(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Sekolah">Sekolah</option>
                  <option value="Kota/Kabupaten">Kota/Kab</option>
                  <option value="Provinsi">Provinsi</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Internasional">Internasional</option>
                </select>

                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <button
                type="button"
                onClick={handleAddPrestasi}
                className="w-full bg-slate-800 text-white font-semibold py-2 rounded-xl text-xs hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Prestasi
              </button>
            </div>

            {/* List Prestasi */}
            {prestasi.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-2">Belum ada prestasi yang ditambahkan.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {prestasi.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{p.nama}</p>
                        <p className="text-[10px] text-gray-500">
                          {p.juara} &middot; Tingkat {p.tingkat} &middot; {p.tanggal}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePrestasi(idx)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-white transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
