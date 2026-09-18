"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Calendar, Plus, Trash2, Loader2, Users } from "lucide-react";
import { Siswa } from "@/lib/siswaData";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface PiketDayData {
  hari: string;
  dayIndex: number;
  petugas: { id?: number; siswa_id: number; nama: string }[];
}

interface ModalEditPiketProps {
  daftarSiswa: Siswa[];
  currentJadwal: PiketDayData[];
  onClose: () => void;
  onSaved: (updatedJadwal: PiketDayData[]) => void;
}

export function deduplicatePetugasList(
  petugas: { id?: number; siswa_id: number; nama: string }[]
): { id?: number; siswa_id: number; nama: string }[] {
  const seenIds = new Set<number>();
  const seenNames = new Set<string>();
  const result: { id?: number; siswa_id: number; nama: string }[] = [];

  for (const p of petugas) {
    const cleanName = (p.nama || "").trim().toLowerCase();
    const sId = Number(p.siswa_id);

    if (sId && seenIds.has(sId)) continue;
    if (cleanName && seenNames.has(cleanName)) continue;

    if (sId) seenIds.add(sId);
    if (cleanName) seenNames.add(cleanName);

    result.push({
      ...p,
      siswa_id: sId,
      nama: p.nama || "Siswa",
    });
  }
  return result;
}

export default function ModalEditPiket({
  daftarSiswa,
  currentJadwal,
  onClose,
  onSaved,
}: ModalEditPiketProps) {
  const [jadwal, setJadwal] = useState<PiketDayData[]>(() =>
    currentJadwal.map((d) => ({
      ...d,
      petugas: deduplicatePetugasList(d.petugas || []),
    }))
  );
  const [activeDayIndex, setActiveDayIndex] = useState(1);
  const [selectedSiswaId, setSelectedSiswaId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const activeDay = jadwal.find((j) => j.dayIndex === activeDayIndex) || jadwal[0];

  const handleAddPetugas = () => {
    if (!selectedSiswaId) return;
    const sId = parseInt(selectedSiswaId);
    const siswa = daftarSiswa.find((s) => s.id === sId);
    if (!siswa) return;

    // Cek apakah sudah ada di hari ini
    if (
      activeDay.petugas.some(
        (p) =>
          p.siswa_id === sId ||
          p.nama.trim().toLowerCase() === siswa.nama.trim().toLowerCase()
      )
    ) {
      setErrorMsg(`${siswa.nama} sudah terdaftar di hari ${activeDay.hari}.`);
      return;
    }

    setErrorMsg(null);
    setJadwal((prev) =>
      prev.map((d) => {
        if (d.dayIndex === activeDayIndex) {
          const updated = [...d.petugas, { siswa_id: sId, nama: siswa.nama }];
          return {
            ...d,
            petugas: deduplicatePetugasList(updated),
          };
        }
        return d;
      })
    );
    setSelectedSiswaId("");
  };

  const handleRemovePetugas = (indexToRemove: number) => {
    setJadwal((prev) =>
      prev.map((d) => {
        if (d.dayIndex === activeDayIndex) {
          return {
            ...d,
            petugas: d.petugas.filter((_, idx) => idx !== indexToRemove),
          };
        }
        return d;
      })
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const cleanJadwal = jadwal.map((d) => ({
        ...d,
        petugas: deduplicatePetugasList(d.petugas),
      }));

      if (isSupabaseConfigured) {
        // Hapus data jadwal piket lama
        await supabase.from("jadwal_piket").delete().neq("id", 0);

        // Insert jadwal baru tanpa duplikasi
        const insertPayload: any[] = [];
        cleanJadwal.forEach((day) => {
          day.petugas.forEach((p, idx) => {
            insertPayload.push({
              hari: day.hari,
              day_index: day.dayIndex,
              siswa_id: p.siswa_id,
              urutan: idx + 1,
            });
          });
        });

        if (insertPayload.length > 0) {
          const { error } = await supabase.from("jadwal_piket").insert(insertPayload);
          if (error) throw error;
        }
      } else {
        localStorage.setItem("custom_jadwal_piket", JSON.stringify(cleanJadwal));
      }

      onSaved(cleanJadwal);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Gagal menyimpan jadwal: " + (err.message || "Terjadi kesalahan"));
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
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col z-10 overscroll-contain my-auto"
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Atur Jadwal Piket Rayon</h3>
              <p className="text-xs text-gray-300 mt-0.5">Khusus Pengurus Rayon, Guru/PS, & Admin</p>
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
        <div className="p-6 space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Hari Tab Selector */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1 overflow-x-auto">
            {jadwal.map((day) => (
              <button
                key={day.dayIndex}
                type="button"
                onClick={() => {
                  setActiveDayIndex(day.dayIndex);
                  setErrorMsg(null);
                }}
                className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-xl transition-all ${activeDayIndex === day.dayIndex
                    ? "bg-yellow-500 text-slate-900 shadow-sm"
                    : "text-gray-600 hover:text-slate-900"
                  }`}
              >
                {day.hari} ({day.petugas.length})
              </button>
            ))}
          </div>

          {/* Form Tambah Petugas ke Hari yang Aktif */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Tambah Petugas Piket Hari {activeDay.hari}
            </label>
            <div className="flex gap-2">
              <select
                value={selectedSiswaId}
                onChange={(e) => setSelectedSiswaId(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">-- Pilih Siswa --</option>
                {daftarSiswa
                  .filter((s) => s.angkatan !== "Alumni")
                  .filter((s, index, self) => index === self.findIndex((t) => t.id === s.id))
                  .sort((a, b) => a.nama.localeCompare(b.nama))
                  .map((s) => (
                    <option key={`siswa-opt-${s.id}`} value={s.id}>
                      {s.nama} ({s.angkatan})
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={handleAddPetugas}
                className="bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
          </div>

          {/* Daftar Petugas Hari Ini */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-yellow-600" />
              Daftar Petugas Piket ({activeDay.petugas.length} Siswa)
            </h4>

            {activeDay.petugas.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                <p className="text-xs text-gray-400">Belum ada petugas di hari {activeDay.hari}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {activeDay.petugas.map((p, idx) => (
                  <div
                    key={`${p.siswa_id}-${p.id ?? idx}-${idx}`}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-800 font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{p.nama}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePetugas(idx)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            Simpan Jadwal Piket
          </button>
        </div>
      </div>
    </div>
  );
}
