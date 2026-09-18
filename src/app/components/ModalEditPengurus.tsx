"use client";

import React, { useState } from "react";
import { X, Save, Crown, Loader2, ShieldCheck, UserCheck } from "lucide-react";
import { Siswa } from "@/lib/siswaData";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface PengurusItem {
  id: number;
  peran: string;
  inisial: string;
  siswa_id: number | null;
  nama_custom?: string | null;
  tugas: string[];
}

interface ModalEditPengurusProps {
  daftarSiswa: Siswa[];
  currentPengurus: PengurusItem[];
  onClose: () => void;
  onSaved: (updated: PengurusItem[]) => void;
}

export default function ModalEditPengurus({
  daftarSiswa,
  currentPengurus,
  onClose,
  onSaved,
}: ModalEditPengurusProps) {
  const [pengurusList, setPengurusList] = useState<PengurusItem[]>(currentPengurus);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSelectSiswa = (pengurusId: number, siswaIdStr: string) => {
    const sId = siswaIdStr ? parseInt(siswaIdStr) : null;
    setPengurusList((prev) =>
      prev.map((item) => {
        if (item.id === pengurusId) {
          return { ...item, siswa_id: sId };
        }
        return item;
      })
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured) {
        // Upsert struktur_pengurus ke Supabase
        for (const item of pengurusList) {
          const { error } = await supabase
            .from("struktur_pengurus")
            .update({ siswa_id: item.siswa_id })
            .eq("id", item.id);

          if (error) throw error;
        }

        // Juga update field 'jabatan' di tabel siswa jika diperlukan
        // Reset jabatan pengurus lama menjadi 'Anggota' jika diganti
      } else {
        localStorage.setItem("custom_struktur_pengurus", JSON.stringify(pengurusList));
      }

      onSaved(pengurusList);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Gagal menyimpan perubahan: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
      data-lenis-prevent="true"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto flex flex-col z-10 overscroll-contain my-auto"
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Atur Struktur Pengurus Rayon</h3>
              <p className="text-xs text-gray-300 mt-0.5">Khusus Pembimbing Siswa (Guru) & Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 flex-1">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-blue-800">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
            <span>
              Sebagai Pembimbing Siswa / Guru, Anda dapat menentukan siswa mana yang ditugaskan sebagai pengurus harian (Ketua, Wakil, Sekretaris, Bendahara).
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            {pengurusList.map((item) => {
              const assignedSiswa = daftarSiswa.find((s) => s.id === item.siswa_id);
              return (
                <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-yellow-600" />
                      {item.peran}
                    </span>
                    {assignedSiswa && (
                      <span className="text-[10px] font-mono text-gray-500">
                        NIS: {assignedSiswa.nis}
                      </span>
                    )}
                  </div>

                  <select
                    value={item.siswa_id || ""}
                    onChange={(e) => handleSelectSiswa(item.id, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">-- Pilih Siswa --</option>
                    {daftarSiswa
                      .filter((s) => s.angkatan !== "Alumni")
                      .filter((s, index, self) => index === self.findIndex((t) => t.id === s.id))
                      .sort((a, b) => a.nama.localeCompare(b.nama))
                      .map((s) => (
                        <option key={`pengurus-opt-${s.id}`} value={s.id}>
                          {s.nama} ({s.angkatan} - {s.nis})
                        </option>
                      ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
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
            Simpan Struktur
          </button>
        </div>
      </div>
    </div>
  );
}
